import { apiGet } from "./client.js";

export interface MessageLog {
  MessageGuid: string;
  CorrelationId: string;
  ApplicationMessageId: string;
  ApplicationMessageType: string;
  LogStart: string;
  LogEnd: string;
  Sender: string;
  Receiver: string;
  IntegrationFlowName: string;
  Status: string;
  AlternateWebLink: string;
}

export interface MessageLogDetail extends MessageLog {
  CustomHeaders: { Name: string; Value: string }[];
}

interface LogList { d: { results: MessageLog[] } }
interface LogDetail { d: MessageLogDetail }
interface CountResult { d: { __count: string } }

export type MessageStatus = "COMPLETED" | "FAILED" | "PROCESSING" | "ESCALATED" | "RETRY" | "ABANDONED";

export interface MessageFilter {
  status?: MessageStatus;
  iflowName?: string;
  fromDate?: string; // ISO 8601
  toDate?: string;   // ISO 8601
  limit?: number;
}

function buildFilter(filter: MessageFilter): string {
  const parts: string[] = [];

  if (filter.status) {
    parts.push(`Status eq '${filter.status}'`);
  }
  if (filter.iflowName) {
    parts.push(`IntegrationFlowName eq '${filter.iflowName}'`);
  }
  if (filter.fromDate) {
    parts.push(`LogStart ge datetime'${filter.fromDate.replace("Z", "")}'`);
  }
  if (filter.toDate) {
    parts.push(`LogEnd le datetime'${filter.toDate.replace("Z", "")}'`);
  }

  return parts.join(" and ");
}

export async function getMessages(filter: MessageFilter = {}): Promise<MessageLog[]> {
  const params: Record<string, string> = {
    $top: String(Math.min(filter.limit ?? 50, 200)),
    $orderby: "LogStart desc",
  };
  const filterStr = buildFilter(filter);
  if (filterStr) params.$filter = filterStr;

  const data = await apiGet<LogList>("/MessageProcessingLogs", params);
  return data.d.results;
}

export async function countMessages(filter: MessageFilter = {}): Promise<number> {
  const params: Record<string, string> = { $inlinecount: "allpages", $top: "1" };
  const filterStr = buildFilter(filter);
  if (filterStr) params.$filter = filterStr;

  const data = await apiGet<CountResult>("/MessageProcessingLogs", params);
  return parseInt(data.d.__count, 10);
}

export async function getMessageDetail(guid: string): Promise<MessageLogDetail> {
  const data = await apiGet<LogDetail>(
    `/MessageProcessingLogs('${encodeURIComponent(guid)}')`
  );
  return data.d;
}

export async function getMessageErrors(limit = 50): Promise<MessageLog[]> {
  return getMessages({ status: "FAILED", limit });
}
