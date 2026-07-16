import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
    if (!process.env.DATABASE_URL) {
        return Response.json({
            ok: false,
            message: "DATABASE_URL missing",
        });
    }

    try {
        await db.execute(sql`SELECT 1`);
        return Response.json({ ok: true });
    } catch (e) {
        console.error(e);

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
