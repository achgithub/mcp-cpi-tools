import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as api from "../cpi/iflows.js";
import { buildHttpIFlowZip } from "../utils/iflow-template.js";
import { ok, err, formatJson } from "../utils/format.js";
import { extractErrorMessage } from "../cpi/client.js";

export function registerIFlowTools(server: McpServer): void {
  server.tool(
    "list_iflows",
    "List all integration flows (iFlows) in a given package.",
    { package_id: z.string().describe("The package ID to list iFlows from") },
    async ({ package_id }) => {
      try {
        const iflows = await api.listIFlows(package_id);
        if (iflows.length === 0) return ok(`No iFlows found in package '${package_id}'.`);
        const lines = iflows.map((f) => `${f.Id} | ${f.Name} | v${f.Version} | ${f.Description || "(no description)"}`);
        return ok(`Found ${iflows.length} iFlow(s) in '${package_id}':\n\n${lines.join("\n")}`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "get_iflow",
    "Get metadata for a specific iFlow.",
    {
      iflow_id: z.string().describe("The iFlow ID"),
      package_id: z.string().optional().describe("Package ID — required on some tenants"),
    },
    async ({ iflow_id, package_id }) => {
      try {
        const iflow = await api.getIFlow(iflow_id, package_id);
        return ok(formatJson(iflow));
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "create_http_iflow",
    "Create a new HTTP pass-through iFlow from a template. The iFlow receives an HTTP request and forwards it to a target URL. Use deploy_iflow afterward to make it active.",
    {
      id: z.string().describe("iFlow ID — no spaces"),
      name: z.string().describe("Display name"),
      package_id: z.string().describe("Package to create it in"),
      sender_address: z.string().describe("Inbound endpoint path, e.g. /my-endpoint"),
      receiver_url: z.string().describe("Target URL to forward requests to"),
      sender_method: z.enum(["POST", "GET", "PUT", "DELETE"]).optional().describe("HTTP method to accept (default POST)"),
      receiver_method: z.enum(["POST", "GET", "PUT", "DELETE"]).optional().describe("HTTP method to call on receiver (default POST)"),
      description: z.string().optional(),
    },
    async ({ id, name, package_id, sender_address, receiver_url, sender_method, receiver_method, description }) => {
      try {
        const artifactContent = buildHttpIFlowZip({
          id, name, senderAddress: sender_address, receiverUrl: receiver_url,
          senderMethod: sender_method, receiverMethod: receiver_method, description,
        });
        const iflow = await api.createIFlow(id, name, package_id, artifactContent, description);
        return ok(`iFlow '${iflow.Id}' created in package '${package_id}'.\n\nCall deploy_iflow to activate it.`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "deploy_iflow",
    "Deploy an iFlow to the SAP CPI runtime. Deployment is async — use get_deploy_status to check progress.",
    { iflow_id: z.string().describe("The iFlow ID to deploy") },
    async ({ iflow_id }) => {
      try {
        await api.deployIFlow(iflow_id);
        return ok(`Deployment triggered for '${iflow_id}'. Use get_deploy_status to check progress.`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "get_deploy_status",
    "Get the deployment status of an iFlow runtime artifact. Status values: STARTED, STARTING, ERROR, STOPPING, STOPPED.",
    { iflow_id: z.string().describe("The iFlow ID") },
    async ({ iflow_id }) => {
      try {
        const artifact = await api.getDeployStatus(iflow_id);
        let result = `Status: ${artifact.Status}\nDeployed by: ${artifact.DeployedBy}\nDeployed at: ${artifact.DeployedOn}`;
        if (artifact.Status === "ERROR") {
          const errorInfo = await api.getDeployError(iflow_id);
          result += `\n\nError:\n${errorInfo}`;
        }
        return ok(result);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "get_iflow_configurations",
    "Get the configurable parameters (externalized variables) of an iFlow.",
    { iflow_id: z.string().describe("The iFlow ID") },
    async ({ iflow_id }) => {
      try {
        const configs = await api.getIFlowConfigurations(iflow_id);
        if (configs.length === 0) return ok(`iFlow '${iflow_id}' has no externalized configuration parameters.`);
        const lines = configs.map((c) => `${c.ParameterKey} (${c.DataType}): ${c.ParameterValue}`);
        return ok(`Configuration parameters for '${iflow_id}':\n\n${lines.join("\n")}`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "update_iflow_configuration",
    "Update a single configuration parameter of an iFlow (externalized variable).",
    {
      iflow_id: z.string().describe("The iFlow ID"),
      key: z.string().describe("The parameter key"),
      value: z.string().describe("The new value"),
    },
    async ({ iflow_id, key, value }) => {
      try {
        await api.updateIFlowConfiguration(iflow_id, key, value);
        return ok(`Updated '${key}' = '${value}' on iFlow '${iflow_id}'.`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "get_iflow_endpoints",
    "Get deployed service endpoints. Optionally filter by iFlow name to get its endpoint URL.",
    { iflow_id: z.string().optional().describe("Filter by iFlow name (optional, returns all if omitted)") },
    async ({ iflow_id }) => {
      try {
        const endpoints = await api.getServiceEndpoints(iflow_id);
        if (endpoints.length === 0) return ok("No endpoints found.");
        const lines = endpoints.map((e) => `${e.Name} | ${e.Title} | ${e.Url}`);
        return ok(`Service endpoints:\n\n${lines.join("\n")}`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "download_iflow",
    "Download an iFlow artifact as a base64-encoded ZIP. Useful for inspecting or modifying the artifact.",
    { iflow_id: z.string().describe("The iFlow ID") },
    async ({ iflow_id }) => {
      try {
        const base64 = await api.downloadIFlow(iflow_id);
        return ok(`iFlow '${iflow_id}' artifact (base64 ZIP):\n\n${base64}`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "save_iflow_to_disk",
    "Download an iFlow artifact ZIP and extract all files to the local exports folder (/exports/{iflow_id}/). Avoids passing large base64 blobs through the conversation.",
    { iflow_id: z.string().describe("The iFlow ID to download and extract") },
    async ({ iflow_id }) => {
      try {
        const files = await api.saveIFlowToDisk(iflow_id, "/exports");
        return ok(
          `Extracted ${files.length} file(s) to /exports/${iflow_id}/\n\n${files.map((f) => f.replace("/exports/", "")).join("\n")}`
        );
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "get_iflow_bpmn",
    "Download an iFlow artifact and extract the BPMN XML (.iflw file). Returns the full process definition so you can analyse or describe the integration flow design.",
    { iflow_id: z.string().describe("The iFlow ID") },
    async ({ iflow_id }) => {
      try {
        const { filename, xml, otherFiles } = await api.getIFlowBpmn(iflow_id);
        return ok(
          `File: ${filename}\n\nOther files in artifact: ${otherFiles.join(", ")}\n\n--- BPMN XML ---\n\n${xml}`
        );
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "send_test_message",
    "Send an HTTP request to a deployed iFlow endpoint. Requires CPI_BASE_URL and CPI_OAUTH_* to be configured.",
    {
      path: z.string().describe("The endpoint path, e.g. /http/my-endpoint"),
      body: z.string().optional().describe("Request body (for POST/PUT)"),
      content_type: z.string().optional().describe("Content-Type header (default: application/xml)"),
    },
    async ({ path, body, content_type }) => {
      try {
        const response = await api.sendTestMessage(path, body ?? "", content_type ?? "application/xml");
        return ok(`Response:\n\n${typeof response === "string" ? response : formatJson(response)}`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );
}
