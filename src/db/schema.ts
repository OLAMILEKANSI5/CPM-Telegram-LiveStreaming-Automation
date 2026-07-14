import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";

// Settings table for app configuration
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schedules table for broadcast scheduling
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().default("Daily Prayer"),
  hour: integer("hour").notNull().default(6),
  minute: integer("minute").notNull().default(0),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  timezone: varchar("timezone", { length: 100 }).notNull().default("Africa/Lagos"),
  daysOfWeek: varchar("days_of_week", { length: 50 }).notNull().default("0,1,2,3,4,5,6"), // 0=Sun..6=Sat
  enabled: boolean("enabled").notNull().default(true),
  audioId: integer("audio_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audios table for audio library
export const audios = pgTable("audios", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  durationSeconds: doublePrecision("duration_seconds").default(0),
  fileSizeBytes: integer("file_size_bytes").default(0),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Broadcast history
export const history = pgTable("history", {
  id: serial("id").primaryKey(),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
  durationSeconds: doublePrecision("duration_seconds").default(0),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, running, completed, failed, stopped
  audioId: integer("audio_id"),
  audioName: varchar("audio_name", { length: 255 }),
  scheduleId: integer("schedule_id"),
  errorMessage: text("error_message"),
  ffmpegLog: text("ffmpeg_log"),
  telegramLog: text("telegram_log"),
  triggeredBy: varchar("triggered_by", { length: 50 }).notNull().default("scheduler"), // scheduler, manual
});

// Logs table
export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  level: varchar("level", { length: 20 }).notNull().default("info"), // debug, info, warning, error, critical
  category: varchar("category", { length: 50 }).notNull().default("system"), // system, telegram, scheduler, broadcast, ffmpeg
  message: text("message").notNull(),
  details: text("details"),
});

// Telegram configuration
export const telegramConfig = pgTable("telegram_config", {
  id: serial("id").primaryKey(),
  apiId: varchar("api_id", { length: 255 }),
  apiHash: varchar("api_hash", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  sessionString: text("session_string"),
  channelId: varchar("channel_id", { length: 100 }),
  channelTitle: varchar("channel_title", { length: 255 }),
  voiceChatId: varchar("voice_chat_id", { length: 100 }),
  connected: boolean("connected").notNull().default(false),
  lastConnectedAt: timestamp("last_connected_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
