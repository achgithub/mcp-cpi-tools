import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerPackageTools } from "./tools/packages.js";
import { registerIFlowTools } from "./tools/iflows.js";
import { registerMappingTools } from "./tools/mappings.js";
import { registerMonitoringTools } from "./tools/monitoring.js";

const server = new McpServer({
  name: "mcp-cpi-tools",
  version: "1.0.0",
});

registerPackageTools(server);
registerIFlowTools(server);
registerMappingTools(server);
registerMonitoringTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
