"use client";

import { TopBar } from "@/components/topbar";
import { Card, Button } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  FileText,
  RefreshCw,
  Download,
  Trash2,
  Search,
  AlertCircle,
  Info,
  AlertTriangle,
  Bug,
  Radio,
  Send,
  CalendarClock,
  Cpu,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Logs", icon: FileText, color: "slate" },
  { id: "system", label: "System", icon: Cpu, color: "blue" },
  { id: "telegram", label: "Telegram", icon: Send, color: "purple" },
  { id: "scheduler", label: "Scheduler", icon: CalendarClock, color: "amber" },
  { id: "broadcast", label: "Broadcast", icon: Radio, color: "emerald" },
  { id: "ffmpeg", label: "FFmpeg", color: "red", icon: Bug },
];

// Sample logs data
const SAMPLE_LOGS = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    level: "info",
    category: "system",
    message: "System health check completed. All services running normally.",
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    level: "info",
    category: "scheduler",
    message: "Scheduled job 'morning_prayer' registered for 06:00 Africa/Lagos",
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    level: "debug",
    category: "telegram",
    message: "Pyrogram client initialized. Session: charis_prayer_bot",
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    level: "info",
    category: "broadcast",
    message: "Starting scheduled broadcast: Daily Morning Prayer",
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 - 5000),
    level: "info",
    category: "telegram",
    message: "Joining voice chat on channel -1001234567890",
  },
  {
    id: 6,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 - 8000),
    level: "debug",
    category: "ffmpeg",
    message: "ffmpeg -i morning_prayer.mp3 -f s16le -ac 1 -ar 48000 -acodec pcm_s16le pipe:1",
  },
  {
    id: 7,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 - 10000),
    level: "info",
    category: "ffmpeg",
    message: "FFmpeg started streaming. Input duration: 59:00. Bitrate: 48kbps.",
  },
  {
    id: 8,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 - 30000),
    level: "info",
    category: "broadcast",
    message: "Audio stream started successfully. Listeners: 24",
  },
  {
    id: 9,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    level: "warning",
    category: "telegram",
    message: "Temporary connection instability detected. Auto-reconnect in 3s...",
  },
  {
    id: 10,
    timestamp: new Date(Date.now() - 1000 * 60 * 29),
    level: "info",
    category: "telegram",
    message: "Reconnected successfully to Telegram servers",
  },
  {
    id: 11,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    level: "warning",
    category: "ffmpeg",
    message: "Buffer underrun detected. Adjusting stream timing...",
  },
  {
    id: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    level: "info",
    category: "ffmpeg",
    message: "Stream buffer recovered. Timing stabilized.",
  },
  {
    id: 13,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    level: "info",
    category: "broadcast",
    message: "Scheduled end time reached. Stopping broadcast.",
  },
  {
    id: 14,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 5000),
    level: "info",
    category: "ffmpeg",
    message: "FFmpeg process terminated cleanly. Exit code: 0",
  },
  {
    id: 15,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 10000),
    level: "info",
    category: "telegram",
    message: "Left voice chat. Disconnected from group call.",
  },
  {
    id: 16,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 12000),
    level: "info",
    category: "broadcast",
    message: "Broadcast completed successfully. Duration: 60:00. Avg listeners: 22",
  },
  {
    id: 17,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    level: "error",
    category: "broadcast",
    message: "Failed to start broadcast. Voice chat unavailable.",
    details: "The group call could not be started. Check channel permissions and bot/admin status.",
  },
  {
    id: 18,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3 - 5000),
    level: "error",
    category: "telegram",
    message: "CHAT_ADMIN_REQUIRED: Need admin rights to manage voice chats",
  },
  {
    id: 19,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    level: "info",
    category: "system",
    message: "CHARIS Prayer Broadcast System v1.0.0 started",
  },
  {
    id: 20,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    level: "info",
    category: "system",
    message: "Loading configuration from /app/config/.env",
  },
  {
    id: 21,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    level: "info",
    category: "system",
    message: "Database initialized. SQLite connection OK.",
  },
  {
    id: 22,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    level: "info",
    category: "scheduler",
    message: "APScheduler started with 1 job(s)",
  },
];

const levelIcons: Record<string, typeof Info> = {
  debug: Bug,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  critical: AlertCircle,
};

const levelColors: Record<string, string> = {
  debug: "text-slate-400 bg-slate-50 border-slate-200",
  info: "text-blue-600 bg-blue-50 border-blue-200",
  warning: "text-amber-600 bg-amber-50 border-amber-200",
  error: "text-rose-600 bg-rose-50 border-rose-200",
  critical: "text-white bg-rose-700 border-rose-800",
};

const categoryColors: Record<string, string> = {
  system: "text-blue-700 bg-blue-100",
  telegram: "text-purple-700 bg-purple-100",
  scheduler: "text-amber-700 bg-amber-100",
  broadcast: "text-emerald-700 bg-emerald-100",
  ffmpeg: "text-rose-700 bg-rose-100",
};

export default function LogsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const filteredLogs = SAMPLE_LOGS.filter((log) => {
    if (selectedCategory !== "all" && log.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !log.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const counts = {
    all: SAMPLE_LOGS.length,
    system: SAMPLE_LOGS.filter((l) => l.category === "system").length,
    telegram: SAMPLE_LOGS.filter((l) => l.category === "telegram").length,
    scheduler: SAMPLE_LOGS.filter((l) => l.category === "scheduler").length,
    broadcast: SAMPLE_LOGS.filter((l) => l.category === "broadcast").length,
    ffmpeg: SAMPLE_LOGS.filter((l) => l.category === "ffmpeg").length,
  };

  return (
    <>
      <TopBar title="System Logs" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">System Logs</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              View, search, and download system, Telegram, and broadcast logs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0d2856]"
              />
              <span className="text-slate-600 font-medium">Auto-refresh</span>
            </label>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button size="sm">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                  active
                    ? "bg-[#0d2856] border-[#0d2856] text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <Icon className="w-5 h-5" />
                <div className="text-xs font-bold">{cat.label}</div>
                <div
                  className={cn(
                    "text-[10px] font-semibold px-1.5 rounded-full",
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  )}
                >
                  {counts[cat.id as keyof typeof counts]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Search + actions */}
        <Card>
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <select className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700">
              <option>All Levels</option>
              <option>Info</option>
              <option>Warnings</option>
              <option>Errors</option>
              <option>Debug</option>
            </select>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>

          <div className="bg-slate-950 font-mono text-xs max-h-[600px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No log messages match your filter
              </div>
            ) : (
              <div>
                {filteredLogs.map((log) => {
                  const LevelIcon = levelIcons[log.level] || Info;
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 px-4 py-2 border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors group"
                    >
                      <span className="text-slate-500 shrink-0 w-20 text-[11px] pt-0.5">
                        {log.timestamp.toLocaleTimeString("en-US", {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                          levelColors[log.level]
                        )}
                      >
                        <LevelIcon className="w-3 h-3" />
                        {log.level}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                          categoryColors[log.category] || "bg-slate-700 text-slate-300"
                        )}
                      >
                        {log.category}
                      </span>
                      <span className="text-slate-300 flex-1 leading-relaxed">
                        {log.message}
                        {log.details && (
                          <div className="text-[10px] text-slate-500 mt-0.5 pl-4 border-l-2 border-slate-700 ml-2">
                            {log.details}
                          </div>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {filteredLogs.length} of {SAMPLE_LOGS.length} log entries
            </span>
            <span>
              Log file: /app/logs/{selectedCategory === "all" ? "system" : selectedCategory}.log
            </span>
          </div>
        </Card>
      </div>
    </>
  );
}
