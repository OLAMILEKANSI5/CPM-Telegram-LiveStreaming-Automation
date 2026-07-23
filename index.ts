import { sql } from "drizzle-orm";
import { getDb } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();

    await db.execute(sql`SELECT 1`);

    return Response.json({
      ok: true,
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        ok: false,
      },
      {
        status: 500,
      }
    );
  }
}
