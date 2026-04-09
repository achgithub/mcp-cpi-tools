import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as api from "../cpi/monitoring.js";
import { ok, err, formatJson } from "../utils/format.js";
import { extractErrorMessage } from "../cpi/client.js";

const StatusEnum = z.enum(["COMPLETED", "FAILED", "PROCESSING", "ESCALATED", "RETRY", "ABANDONED"]);

export function registerMonitoringTools(server: McpServer): void {
  server.tool(
    "get_messages",
    "Retrieve message processing logs from SAP CPI monitoring. Supports filtering by status, iFlow name, and date range.",
    {
      status: StatusEnum.optional().describe("Filter by message status"),
      iflow_name: z.string().optional().describe("Filter by iFlow name"),
      from_date: z.string().optional().describe("Start date filter in ISO 8601, e.g. 2024-01-01T00:00:00"),
      to_date: z.string().optional().describe("End date filter in ISO 8601"),
      limit: z.number().min(1).max(200).optional().describe("Max results to return (default 50, max 200)"),
    },
    async ({ status, iflow_name, from_date, to_date, limit }) => {
      try {
        const messages = await api.getMessages({
          status: status as api.MessageStatus | undefined,
          iflowName: iflow_name,
          fromDate: from_date,
          toDate: to_date,
          limit,
        });
        if (messages.length === 0) return ok("No messages found matching the filter.");

        const lines = messages.map((m) =>
          [
            `GUID: ${m.MessageGuid}`,
            `Status: ${m.Status}`,
            `IFlow: ${m.IntegrationFlowName}`,
            `Start: ${m.LogStart}`,
            `End: ${m.LogEnd || "—"}`,
            `Sender: ${m.Sender || "—"} → Receiver: ${m.Receiver || "—"}`,
          ].join(" | ")
        );
        return ok(`${messages.length} message(s):\n\n${lines.join("\n")}`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "count_messages",
    "Count message processing logs matching a filter. Useful for summaries like 'how many failed messages today'.",
    {
      status: StatusEnum.optional(),
      iflow_name: z.string().optional(),
      from_date: z.string().optional().describe("ISO 8601 start date"),
      to_date: z.string().optional().describe("ISO 8601 end date"),
    },
    async ({ status, iflow_name, from_date, to_date }) => {
      try {
        const count = await api.countMessages({
          status: status as api.MessageStatus | undefined,
          iflowName: iflow_name,
          fromDate: from_date,
          toDate: to_date,
        });
        const filterDesc = [
          status && `status=${status}`,
          iflow_name && `iflow=${iflow_name}`,
          from_date && `from=${from_date}`,
          to_date && `to=${to_date}`,
        ].filter(Boolean).join(", ");
        return ok(`${count} message(s)${filterDesc ? ` matching [${filterDesc}]` : ""}.`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "get_message_detail",
    "Get full details for a specific message log entry by its GUID.",
    { guid: z.string().describe("The MessageGuid from get_messages") },
    async ({ guid }) => {
      try {
        const detail = await api.getMessageDetail(guid);
        return ok(formatJson(detail));
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );

  server.tool(
    "get_failed_messages",
    "Shortcut to retrieve recent failed messages from SAP CPI monitoring.",
    { limit: z.number().min(1).max(200).optional().describe("Max results (default 50)") },
    async ({ limit }) => {
      try {
        const messages = await api.getMessageErrors(limit);
        if (messages.length === 0) return ok("No failed messages found.");
        const lines = messages.map((m) =>
          `${m.MessageGuid} | ${m.IntegrationFlowName} | ${m.LogStart} | ${m.Sender || "—"} → ${m.Receiver || "—"}`
        );
        return ok(`${messages.length} failed message(s):\n\n${lines.join("\n")}\n\nUse get_message_detail with a GUID for full error info.`);
      } catch (e) {
        return err(extractErrorMessage(e));
      }
    }
  );
}
