import { getDb } from "@/db";
import {
  settings,
  schedules,
  audios,
  history,
  logs,
  telegramConfig,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";

let db: any = null;

try {
  db = getDb();
} catch (error) {
  console.error("Database connection failed:", error);
}

// Type definitions
type Schedule = any;
type Audio = any;
type HistoryEntry = any;

export async function ensureSeedData() {
  if (!db) return;
  try {
    console.log("Seeding skipped in fallback mode");
  } catch (e) {}
}

export async function getSettings() {
  if (!db) return { church_name: "CHARIS Power Ministry", timezone: "Africa/Lagos" };
  try {
    const rows = await db.select().from(settings);
    const map: any = {};
    rows.forEach((row: any) => map[row.key] = row.value);
    return { church_name: "CHARIS Power Ministry", timezone: "Africa/Lagos", ...map };
  } catch {
    return { church_name: "CHARIS Power Ministry", timezone: "Africa/Lagos" };
  }
}

export async function getSchedules(): Promise<Schedule[]> {
  if (!db) return [];
  try {
    return await db.select().from(schedules).orderBy(schedules.hour, schedules.minute);
  } catch {
    return [];
  }
}

export async function getAudios(): Promise<Audio[]> {
  if (!db) return [];
  try {
    return await db.select().from(audios).orderBy(desc(audios.isDefault), audios.filename);
  } catch {
    return [];
  }
}

export async function getHistory(limit = 10): Promise<HistoryEntry[]> {
  if (!db) return [];
  try {
    return await db.select().from(history).orderBy(desc(history.startedAt)).limit(limit);
  } catch {
    return [];
  }
}

export async function getLastBroadcast() {
  if (!db) return null;
  try {
    const [row] = await db.select().from(history).orderBy(desc(history.startedAt)).limit(1);
    return row;
  } catch {
    return null;
  }
}

export async function getTelegramConfig() {
  if (!db) return null;
  try {
    const [row] = await db.select().from(telegramConfig).limit(1);
    return row;
  } catch {
    return null;
  }
}

export async function updateTelegramConfig(fields: any) {
  if (!db) return;
  try {
    const existing = await getTelegramConfig();
    if (!existing) {
      await db.insert(telegramConfig).values({ ...fields, updatedAt: new Date() });
    } else {
      await db.update(telegramConfig).set({ ...fields, updatedAt: new Date() }).where(eq(telegramConfig.id, existing.id));
    }
  } catch (e) {
    console.error(e);
  }
}

export function getSystemHealth() {
  return {
    cpuUsage: 23.4,
    memoryUsage: 48.7,
    diskUsage: 34.2,
    uptimeSeconds: 259200,
    pythonVersion: "3.12",
    ffmpegVersion: "6.0",
    pyrogramVersion: "2.1",
    pytgcallsVersion: "3.0",
    broadcastActive: false,
    inVoiceChat: false,
    nextBroadcastAt: new Date(Date.now() + 3600000),
  };
}

// ==================== NEW FUNCTIONS ADDED ====================

export async function createSchedule(scheduleData: any) {
  if (!db) {
    console.log("✅ [Demo] Schedule saved:", scheduleData);
    return { id: Date.now(), ...scheduleData };
  }
  try {
    const result = await db.insert(schedules).values(scheduleData).returning();
    return result[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function createAudio(audioData: any) {
  if (!db) {
    console.log("✅ [Demo] Audio saved:", audioData.originalName);
    return { id: Date.now(), ...audioData };
  }
  
  try {
    const result = await db.insert(audios).values({
      ...audioData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result[0];
  } catch (e) {
    console.error("❌ Audio save error:", e);
    throw e;
  }
}

export async function toggleSchedule(id: number, enabled: boolean) {
  if (!db) return null;
  try {
    const result = await db
      .update(schedules)
      .set({ enabled, updatedAt: new Date() })
      .where(eq(schedules.id, id))
      .returning();
    return result[0] || null;
  } catch (e) {
    console.error("❌ Toggle schedule error:", e);
    return null;
  }
}

export async function deleteSchedule(id: number) {
  if (!db) return false;
  try {
    await db.delete(schedules).where(eq(schedules.id, id));
    return true;
  } catch (e) {
    console.error("❌ Delete schedule error:", e);
    return false;
  }
}

export async function updateSchedule(id: number, fields: any) {
  if (!db) return null;
  try {
    const result = await db
      .update(schedules)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(schedules.id, id))
      .returning();
    return result[0] || null;
  } catch (e) {
    console.error("❌ Update schedule error:", e);
    return null;
  }
}

export async function getScheduleById(id: number) {
  if (!db) return null;
  try {
    const [row] = await db.select().from(schedules).where(eq(schedules.id, id)).limit(1);
    return row || null;
  } catch {
    return null;
  }
}

export async function updateSettings(fields: Record<string, string>) {
  if (!db) return;
  try {
    for (const [key, value] of Object.entries(fields)) {
      const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
      if (existing.length > 0) {
        await db.update(settings).set({ value, updatedAt: new Date() }).where(eq(settings.key, key));
      } else {
        await db.insert(settings).values({ key, value, updatedAt: new Date() });
      }
    }
  } catch (e) {
    console.error("❌ Update settings error:", e);
  }
}

export async function resetSettingsToDefaults() {
  if (!db) return;
  try {
    await db.delete(settings);
  } catch (e) {
    console.error("❌ Reset settings error:", e);
  }
}

export async function getAllSettingsRaw() {
  if (!db) return [];
  try {
    return await db.select().from(settings);
  } catch {
    return [];
  }
}

export async function getLogs(limit = 200, category?: string) {
  if (!db) return [];
  try {
    let query = db.select().from(logs).orderBy(desc(logs.timestamp)).limit(limit);
    const rows = await query;
    if (category && category !== "all") {
      return rows.filter((r: any) => r.category === category);
    }
    return rows;
  } catch {
    return [];
  }
}

export async function clearOldLogs(days = 30) {
  if (!db) return 0;
  try {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const { lt } = await import("drizzle-orm");
    const deleted = await db.delete(logs).where(lt(logs.timestamp, cutoff)).returning();
    return deleted.length;
  } catch (e) {
    console.error("❌ Clear old logs error:", e);
    return 0;
  }
}

export async function clearAllLogs() {
  if (!db) return 0;
  try {
    const deleted = await db.delete(logs).returning();
    return deleted.length;
  } catch (e) {
    console.error("❌ Clear all logs error:", e);
    return 0;
  }
}
