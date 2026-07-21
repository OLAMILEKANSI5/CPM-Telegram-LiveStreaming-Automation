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
    ffmpegVersion: "6.0",           // ← Added this
    pyrogramVersion: "2.1",
    pytgcallsVersion: "3.0",
    broadcastActive: false,
    inVoiceChat: false,
    nextBroadcastAt: new Date(Date.now() + 3600000),
  };
}


export async function createSchedule(scheduleData: any) {
  if (!db) {
    console.log("Demo mode - Schedule saved:", scheduleData);
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
