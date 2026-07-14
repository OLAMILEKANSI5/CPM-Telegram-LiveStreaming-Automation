import { db } from "@/db";
import {
  settings,
  schedules,
  audios,
  history,
  logs,
  telegramConfig,
} from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export type Setting = typeof settings.$inferSelect;
export type Schedule = typeof schedules.$inferSelect;
export type Audio = typeof audios.$inferSelect;
export type HistoryEntry = typeof history.$inferSelect;
export type LogEntry = typeof logs.$inferSelect;
export type TelegramCfg = typeof telegramConfig.$inferSelect;

// Default data
export const DEFAULT_SETTINGS: Record<string, string> = {
  church_name: "CHARIS Power Ministry",
  timezone: "Africa/Lagos",
  theme: "light",
  audio_folder: "./uploads/audio",
  default_audio_id: "",
  notifications_enabled: "true",
  auto_reconnect: "true",
  stream_quality: "high",
  system_language: "en",
};

export const DEFAULT_SCHEDULE: Omit<Schedule, "id" | "createdAt" | "updatedAt"> = {
  name: "Daily Morning Prayer",
  hour: 6,
  minute: 0,
  durationMinutes: 60,
  timezone: "Africa/Lagos",
  daysOfWeek: "0,1,2,3,4,5,6",
  enabled: true,
  audioId: null,
};

export const DEFAULT_TELEGRAM: Partial<TelegramCfg> = {
  apiId: "",
  apiHash: "",
  phoneNumber: "",
  sessionString: "",
  channelId: "",
  channelTitle: "",
  voiceChatId: "",
  connected: false,
};

// Seed data for demo / first run
export async function ensureSeedData() {
  const existingSettings = await db.select().from(settings).limit(1);
  if (existingSettings.length === 0) {
    // Seed default settings
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await db.insert(settings).values({ key, value }).onConflictDoNothing();
    }
    // Seed default schedule
    await db.insert(schedules).values({
      name: "Daily Morning Prayer",
      hour: 6,
      minute: 0,
      durationMinutes: 60,
      timezone: "Africa/Lagos",
      daysOfWeek: "0,1,2,3,4,5,6",
      enabled: true,
    });
    // Seed sample audio
    await db.insert(audios).values({
      filename: "morning_prayer_tongues.mp3",
      originalName: "Morning Prayer - Speaking in Tongues.mp3",
      filePath: "/uploads/audio/morning_prayer_tongues.mp3",
      mimeType: "audio/mpeg",
      durationSeconds: 3540,
      fileSizeBytes: 42598400,
      isDefault: true,
    });
    // Seed telegram config row
    await db.insert(telegramConfig).values({}).onConflictDoNothing();
    // Seed some sample history
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    await db.insert(history).values([
      {
        startedAt: yesterday,
        endedAt: new Date(yesterday.getTime() + 60 * 60 * 1000),
        durationSeconds: 3600,
        status: "completed",
        audioName: "Morning Prayer - Speaking in Tongues.mp3",
        triggeredBy: "scheduler",
      },
      {
        startedAt: twoDaysAgo,
        endedAt: new Date(twoDaysAgo.getTime() + 60 * 60 * 1000),
        durationSeconds: 3600,
        status: "completed",
        audioName: "Morning Prayer - Speaking in Tongues.mp3",
        triggeredBy: "scheduler",
      },
    ]);
    // Seed sample logs
    await db.insert(logs).values([
      {
        level: "info",
        category: "system",
        message: "CHARIS Prayer Broadcast System initialized successfully",
      },
      {
        level: "info",
        category: "scheduler",
        message: "Daily schedule loaded: 06:00 AM Africa/Lagos",
      },
      {
        level: "info",
        category: "telegram",
        message: "Awaiting Telegram configuration...",
      },
    ]);
  }
}

// Settings helpers
export async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(settings);
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value ?? "";
  }
  return { ...DEFAULT_SETTINGS, ...map };
}

export async function getSetting(key: string): Promise<string> {
  const [row] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1);
  return row?.value ?? DEFAULT_SETTINGS[key] ?? "";
}

export async function setSetting(key: string, value: string) {
  await db
    .insert(settings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value, updatedAt: new Date() },
    });
}

// Schedules
export async function getSchedules(): Promise<Schedule[]> {
  return db.select().from(schedules).orderBy(schedules.hour, schedules.minute);
}

export async function getSchedule(id: number): Promise<Schedule | null> {
  const [row] = await db
    .select()
    .from(schedules)
    .where(eq(schedules.id, id))
    .limit(1);
  return row ?? null;
}

// Audios
export async function getAudios(): Promise<Audio[]> {
  return db.select().from(audios).orderBy(desc(audios.isDefault), audios.filename);
}

export async function getAudio(id: number): Promise<Audio | null> {
  const [row] = await db
    .select()
    .from(audios)
    .where(eq(audios.id, id))
    .limit(1);
  return row ?? null;
}

// History
export async function getHistory(limit = 50): Promise<HistoryEntry[]> {
  return db
    .select()
    .from(history)
    .orderBy(desc(history.startedAt))
    .limit(limit);
}

export async function getLastBroadcast(): Promise<HistoryEntry | null> {
  const [row] = await db
    .select()
    .from(history)
    .orderBy(desc(history.startedAt))
    .limit(1);
  return row ?? null;
}

// Logs
export async function getLogs(
  category?: string,
  limit = 200
): Promise<LogEntry[]> {
  if (category && category !== "all") {
    return db
      .select()
      .from(logs)
      .where(eq(logs.category, category))
      .orderBy(desc(logs.timestamp))
      .limit(limit);
  }
  return db.select().from(logs).orderBy(desc(logs.timestamp)).limit(limit);
}

export async function addLog(
  level: string,
  category: string,
  message: string,
  details?: string
) {
  await db.insert(logs).values({
    level,
    category,
    message,
    details: details ?? null,
    timestamp: new Date(),
  });
}

// Telegram config
export async function getTelegramConfig(): Promise<TelegramCfg | null> {
  const [rows] = await db.select().from(telegramConfig).limit(1);
  return rows ?? null;
}

export async function updateTelegramConfig(fields: Partial<TelegramCfg>) {
  const existing = await getTelegramConfig();
  if (!existing) {
    await db.insert(telegramConfig).values({ ...fields, updatedAt: new Date() });
    return;
  }
  await db
    .update(telegramConfig)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(telegramConfig.id, existing.id));
}

// System health mock (would come from actual Python backend)
export function getSystemHealth() {
  // Simulate system stats - in production this would come from the Python backend
  const uptimeSeconds = 86400 * 3 + 3600 * 7 + 60 * 23; // 3 days, 7h 23m
  return {
    cpuUsage: 23.4,
    memoryUsage: 48.7,
    diskUsage: 34.2,
    uptimeSeconds,
    pythonVersion: "3.12.1",
    ffmpegVersion: "6.0",
    pyrogramVersion: "2.1.41",
    pytgcallsVersion: "3.0.0.dev24",
    broadcastActive: false,
    inVoiceChat: false,
    nextBroadcastAt: getNextBroadcastTime(),
  };
}

function getNextBroadcastTime(): Date {
  const now = new Date();
  const next = new Date(now);
  next.setHours(6, 0, 0, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}
