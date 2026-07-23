import { getLogs } from "@/lib/db-service";

export const dynamic = "force-dynamic";

function toCsv(rows: any[]): string {
  const header = ["id", "timestamp", "level", "category", "message", "details"];
  const lines = [header.join(",")];
  for (const row of rows) {
    const values = header.map((key) => {
      const val = row[key];
      if (val === null || val === undefined) return "";
      const str = String(val instanceof Date ? val.toISOString() : val);
      return `"${str.replace(/"/g, '""')}"`;
    });
    lines.push(values.join(","));
  }
  return lines.join("\n");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const format = searchParams.get("format") || "json";
  const limit = parseInt(searchParams.get("limit") || "500", 10);

  const rows = await getLogs(limit, category);

  if (format === "csv") {
    return new Response(toCsv(rows), {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="logs-${Date.now()}.csv"`,
      },
    });
  }

  return Response.json({ logs: rows });
}
