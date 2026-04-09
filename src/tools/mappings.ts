import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as api from "../cpi/mappings.js";
import { ok, err, formatJson } from "../utils/format.js";
import { extractErrorMessage } from "../cpi/client.js";

export function registerMappingTools(server: McpServer): void {
  server.tool(
    "list_mappings",
    "List all message mappings in a given package.",
    { package_id: z.string().describe("The package ID") },
    async ({ package_id }) => {
      try {
        const mappings = await api.listMappings(package_id);
        if (mappings.length === 0) return ok(`No message mappings found in package '${package_id}'.`);
        const lines = mappings.map((m) => `${m.Id} | ${m.Name} | v${m.Version}`);
        return ok(`Found ${mappings.length} mapping(s) in '${package_id}':\n\n${lines.join("\n")}`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "get_mapping",
    "Get metadata for a specific message mapping.",
    { mapping_id: z.string().describe("The mapping ID") },
    async ({ mapping_id }) => {
      try {
        const mapping = await api.getMapping(mapping_id);
        return ok(formatJson(mapping));
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "deploy_mapping",
    "Deploy a message mapping to the SAP CPI runtime.",
    { mapping_id: z.string().describe("The mapping ID to deploy") },
    async ({ mapping_id }) => {
      try {
        await api.deployMapping(mapping_id);
        return ok(`Deployment triggered for mapping '${mapping_id}'.`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "download_mapping",
    "Download a message mapping artifact as a base64-encoded ZIP.",
    { mapping_id: z.string().describe("The mapping ID") },
    async ({ mapping_id }) => {
      try {
        const base64 = await api.downloadMapping(mapping_id);
        return ok(`Mapping '${mapping_id}' artifact (base64 ZIP):\n\n${base64}`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );
}
