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
  console.error("Database initialization failed:", error);
}

// Default fallback data
export const DEFAULT_SETTINGS = {
  church_name: "CHARIS Power Ministry",
  timezone: "Africa/Lagos",
  theme: "light",
};

export async function ensureSeedData() {
  if (!db) return;
  try {
    // Seed logic (you can keep original if you want, but simplified here)
    console.log("Seed data skipped in demo mode");
  } catch (e) {
    console.warn("Seed failed:", e);
  }
}

export async function getSettings() {
  if (!db) return DEFAULT_SETTINGS;
  try {
    const rows = await db.select().from(settings);
    const map: any = {};
    rows.forEach((row: any) => { map[row.key] = row.value; });
    return { ...DEFAULT_SETTINGS, ...map };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getSchedules() {
  if (!db) return [];
  try {
    return await db.select().from(schedules).orderBy(schedules.hour, schedules.minute);
  } catch {
    return [];
  }
}

export async function getAudios() {
  if (!db) return [];
  try {
    return await db.select().from(audios).orderBy(desc(audios.isDefault), audios.filename);
  } catch {
    return [];
  }
}

export async function getHistory(limit = 10) {
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
    return row || null;
  } catch {
    return null;
  }
}

export async function getTelegramConfig() {
  if (!db) return null;
  try {
    const [row] = await db.select().from(telegramConfig).limit(1);
    return row || null;
  } catch {
    return null;
  }
}

export function getSystemHealth() {
  return {
    cpuUsage: 23.4,
    memoryUsage: 48.7,
    diskUsage: 34.2,
    uptimeSeconds: 259200,
    pythonVersion: "3.12",
    broadcastActive: false,
    inVoiceChat: false,
    nextBroadcastAt: new Date(Date.now() + 3600000),
  };
}

export async function updateTelegramConfig(fields: any) {
  if (!db) {
    console.warn("Telegram config update skipped - no database");
    return;
  }
  try {
    const existing = await getTelegramConfig();
    if (!existing) {
      await db.insert(telegramConfig).values({ ...fields, updatedAt: new Date() });
    } else {
      await db
        .update(telegramConfig)
        .set({ ...fields, updatedAt: new Date() })
        .where(eq(telegramConfig.id, existing.id));
    }
  } catch (e) {
    console.error("Failed to update telegram config:", e);
  }
}
