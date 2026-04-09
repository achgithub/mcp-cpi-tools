// Helpers to format CPI data as readable text for the AI

export function formatTable(rows: Record<string, unknown>[], columns: string[]): string {
  if (rows.length === 0) return "(no results)";
  const lines = rows.map((row) =>
    columns.map((col) => `${col}: ${row[col] ?? ""}`).join(" | ")
  );
  return lines.join("\n");
}

export function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function ok(message: string): { content: [{ type: "text"; text: string }] } {
  return { content: [{ type: "text" as const, text: message }] };
}

export function err(message: string): { content: [{ type: "text"; text: string }] } {
  return { content: [{ type: "text" as const, text: `Error: ${message}` }] };
}
