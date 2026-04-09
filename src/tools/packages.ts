import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as api from "../cpi/packages.js";
import { ok, err, formatJson } from "../utils/format.js";
import { extractErrorMessage } from "../cpi/client.js";

export function registerPackageTools(server: McpServer): void {
  server.tool(
    "list_packages",
    "List all integration packages in SAP CPI. Returns Id, Name, Description, Version for each package.",
    {},
    async () => {
      try {
        const packages = await api.listPackages();
        if (packages.length === 0) return ok("No packages found.");
        const lines = packages.map(
          (p) => `${p.Id} | ${p.Name} | v${p.Version} | ${p.Description || "(no description)"}`
        );
        return ok(`Found ${packages.length} package(s):\n\n${lines.join("\n")}`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "get_package",
    "Get details of a specific integration package including metadata.",
    { package_id: z.string().describe("The package ID") },
    async ({ package_id }) => {
      try {
        const pkg = await api.getPackage(package_id);
        return ok(formatJson(pkg));
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "create_package",
    "Create a new integration package in SAP CPI.",
    {
      id: z.string().describe("Package ID — no spaces, use underscores or CamelCase"),
      name: z.string().describe("Display name for the package"),
      description: z.string().optional().describe("Optional description"),
    },
    async ({ id, name, description }) => {
      try {
        const pkg = await api.createPackage(id, name, description);
        return ok(`Package created successfully.\n\n${formatJson(pkg)}`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "delete_package",
    "Delete an integration package from SAP CPI. Only works on packages with no deployed artifacts.",
    { package_id: z.string().describe("The package ID to delete") },
    async ({ package_id }) => {
      try {
        await api.deletePackage(package_id);
        return ok(`Package '${package_id}' deleted.`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );
}
