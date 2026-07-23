"use client";

import { TopBar } from "@/components/topbar";
import { Card, Button } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { clearAllLogsAction } from "@/app/settings/actions";
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
  Loader2,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Logs", icon: FileText },
  { id: "system", label: "System", icon: Cpu },
  { id: "telegram", label: "Telegram", icon: Send },
  { id: "scheduler", label: "Scheduler", icon: CalendarClock },
  { id: "broadcast", label: "Broadcast", icon: Radio },
  { id: "ffmpeg", label: "FFmpeg", icon: Bug },
];

type LogEntry = {
  id: number;
  timestamp: string;
  level: string;
  category: string;
  message: string;
  details?: string | null;
};

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
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [clearing, setClearing] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/logs?limit=500", { cache: "no-store" });
      const data = await res.json();
      setLogs(data.logs || []);
    } catch {
      // keep whatever we last had; the page still functions, just stale
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchLogs, 10000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    if (selectedCategory !== "all" && log.category !== selectedCategory) return false;
    if (levelFilter !== "all" && log.level !== levelFilter) return false;
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: logs.length,
    system: logs.filter((l) => l.category === "system").length,
    telegram: logs.filter((l) => l.category === "telegram").length,
    scheduler: logs.filter((l) => l.category === "scheduler").length,
    broadcast: logs.filter((l) => l.category === "broadcast").length,
    ffmpeg: logs.filter((l) => l.category === "ffmpeg").length,
  };

  const handleExport = () => {
    const url = `/api/logs?format=csv&limit=5000${selectedCategory !== "all" ? `&category=${selectedCategory}` : ""}`;
    window.open(url, "_blank");
  };

  const handleClear = async () => {
    if (!confirm("Delete ALL log entries? This cannot be undone.")) return;
    setClearing(true);
    try {
      await clearAllLogsAction();
      await fetchLogs();
    } catch {
      alert("Could not clear logs.");
    } finally {
      setClearing(false);
    }
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
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button size="sm" onClick={fetchLogs} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Refresh
            </Button>
          </div>
        </div>

        {logs.length === 0 && !loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg px-4 py-3">
            No log entries yet. Logs are written by the Python backend as it runs
            (Telegram connection, scheduler activity, broadcasts). Once the backend
            has been running a bit, entries will show up here.
          </div>
        )}

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
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warnings</option>
              <option value="error">Errors</option>
              <option value="debug">Debug</option>
            </select>
            <Button variant="outline" size="sm" onClick={handleClear} disabled={clearing}>
              {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Clear
            </Button>
          </div>

          <div className="bg-slate-950 font-mono text-xs max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-10 text-center text-slate-500 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading logs…
              </div>
            ) : filteredLogs.length === 0 ? (
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
                        {new Date(log.timestamp).toLocaleTimeString("en-US", {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                          levelColors[log.level] || levelColors.info
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
              Showing {filteredLogs.length} of {logs.length} log entries
            </span>
            <span>Source: PostgreSQL `logs` table (written by the backend)</span>
          </div>
        </Card>
      </div>
    </>
  );
}
