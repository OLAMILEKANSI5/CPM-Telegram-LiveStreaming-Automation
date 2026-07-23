import { getDb } from "@/db";
import { settings, schedules } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const [settingsRows, scheduleRows] = await Promise.all([
      db.select().from(settings),
      db.select().from(schedules),
    ]);

    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: settingsRows,
      schedules: scheduleRows,
    };

    return new Response(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="charis-backup-${Date.now()}.json"`,
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not create backup" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDb();
    const { eq } = await import("drizzle-orm");

    let restoredSettings = 0;
    let restoredSchedules = 0;

    if (Array.isArray(body.settings)) {
      for (const row of body.settings) {
        if (!row.key) continue;
        const existing = await db.select().from(settings).where(eq(settings.key, row.key)).limit(1);
        if (existing.length > 0) {
          await db.update(settings).set({ value: row.value, updatedAt: new Date() }).where(eq(settings.key, row.key));
        } else {
          await db.insert(settings).values({ key: row.key, value: row.value, updatedAt: new Date() });
        }
        restoredSettings++;
      }
    }

    if (Array.isArray(body.schedules)) {
      for (const row of body.schedules) {
        const { id, createdAt, updatedAt, ...rest } = row;
        await db.insert(schedules).values(rest);
        restoredSchedules++;
      }
    }

    return Response.json({ ok: true, restoredSettings, restoredSchedules });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not restore backup. Is the file valid?" }, { status: 400 });
  }
}
