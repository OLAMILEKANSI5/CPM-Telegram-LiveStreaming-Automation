import { TopBar } from "@/components/topbar";
import { StatCard, StatusBadge, Card, ProgressBar } from "@/components/ui/stat-card";
import {
  getSettings,
  getSchedules,
  getAudios,
  getLastBroadcast,
  getHistory,
  getSystemHealth,
  getTelegramConfig,
} from "@/lib/db-service";
import {
  Radio,
  CalendarClock,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick,
  Music2,
  CheckCircle2,
  XCircle,
  Mic2,
  Activity,
  Wifi,
  Server,
  AlertCircle,
} from "lucide-react";
import { formatDateTime, formatDuration, formatTime } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [settings, schedules, audios, lastBroadcast, history, telegram, health] =
    await Promise.all([
      getSettings(),
      getSchedules(),
      getAudios(),
      getLastBroadcast(),
      getHistory(10),
      getTelegramConfig(),
      Promise.resolve(getSystemHealth()),
    ]);

  const enabledSchedules = schedules.filter((s) => s.enabled);
  const nextBroadcast = health.nextBroadcastAt;
  const defaultAudio = audios.find((a) => a.isDefault) || audios[0];

  return (
    <>
      <TopBar title="Dashboard" />

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1f44] via-[#0d2856] to-[#1e3a8a] text-white p-6 sm:p-8 shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl translate-y-1/2"></div>
          <div className="absolute top-4 right-6 opacity-10">
            <Mic2 className="w-40 h-40" />
          </div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-xs font-semibold uppercase tracking-widest text-blue-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  System Active
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome to {settings.church_name || "CHARIS Power Ministry"}
              </h2>
              <p className="text-blue-100/80 max-w-lg text-sm sm:text-base leading-relaxed">
                Your automated daily prayer broadcast system is running smoothly.
                Today&apos;s morning prayer is scheduled to start at{" "}
                <span className="font-semibold text-white">6:00 AM</span> WAT.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/live-control"
                  className="inline-flex items-center gap-2 bg-white text-[#0d2856] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <Radio className="w-4 h-4" />
                  Go to Live Control
                </Link>
                <Link
                  href="/scheduler"
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm"
                >
                  <CalendarClock className="w-4 h-4" />
                  View Schedule
                </Link>
              </div>
            </div>

            {/* Next Broadcast countdown */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 min-w-[240px]">
              <div className="text-xs uppercase tracking-widest text-blue-300 font-semibold mb-1">
                Next Broadcast
              </div>
              <div className="text-3xl font-bold mb-1">6:00 AM</div>
              <div className="text-sm text-blue-100/70 mb-3">
                {nextBroadcast.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                Auto-start enabled
              </div>
            </div>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Broadcast Status"
            value={health.broadcastActive ? "LIVE" : "Idle"}
            subtitle={
              health.broadcastActive
                ? "Streaming to Voice Chat"
                : "Waiting for next schedule"
            }
            icon={health.broadcastActive ? Radio : Mic2}
            status={health.broadcastActive ? "success" : "neutral"}
          />
          <StatCard
            title="Scheduled Today"
            value={enabledSchedules.length}
            subtitle={`${enabledSchedules.length} active schedule(s)`}
            icon={CalendarClock}
            status="info"
          />
          <StatCard
            title="Audio Files"
            value={audios.length}
            subtitle={defaultAudio ? `Default: ${defaultAudio.originalName.slice(0, 25)}${defaultAudio.originalName.length > 25 ? "…" : ""}` : "No default audio set"}
            icon={Music2}
            status="info"
          />
          <StatCard
            title="Telegram"
            value={telegram?.connected ? "Connected" : "Not Configured"}
            subtitle={
              telegram?.phoneNumber
                ? `Account: ${telegram.phoneNumber}`
                : "Configure in settings"
            }
            icon={Wifi}
            status={telegram?.connected ? "success" : "warning"}
          />
        </div>

        {/* Middle Row: Current Status + Next Broadcast + Last Broadcast */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Voice Chat Status */}
          <Card title="Voice Chat Status" description="Current stream state">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {health.inVoiceChat ? (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                      </span>
                      <span className="font-bold text-rose-600">LIVE</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                      <span className="font-bold text-slate-500">Offline</span>
                    </>
                  )}
                </div>
                <StatusBadge status={health.inVoiceChat ? "running" : "idle"}>
                  {health.inVoiceChat ? "Broadcasting" : "Not in VC"}
                </StatusBadge>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">In Voice Chat</span>
                  <span className="font-semibold text-slate-700">
                    {health.inVoiceChat ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Streaming</span>
                  <span className="font-semibold text-slate-700">
                    {health.broadcastActive ? "Active" : "Stopped"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Current Audio</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                    {defaultAudio?.originalName || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Bitrate</span>
                  <span className="font-semibold text-slate-700">48 kbps (HQ)</span>
                </div>
              </div>

              {health.broadcastActive && (
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Stream Progress</span>
                    <span>23:45 / 60:00</span>
                  </div>
                  <ProgressBar value={39.6} color="green" />
                </div>
              )}
            </div>
          </Card>

          {/* Next Broadcast */}
          <Card
            title="Next Broadcast"
            description="Upcoming scheduled transmission"
          >
            <div className="p-5 space-y-4">
              <div className="text-center py-2">
                <div className="text-5xl font-bold gradient-text mb-2">
                  {formatTime(nextBroadcast)}
                </div>
                <div className="text-sm text-slate-500">
                  {nextBroadcast.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Scheduled Details
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Timezone:</span>
                    <span className="font-semibold text-slate-800">
                      {settings.timezone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-semibold text-slate-800">60 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Audio:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                      {defaultAudio?.originalName || "Default"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Autoplay:</span>
                    <span className="font-semibold text-emerald-600">Enabled</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                <Clock className="w-3.5 h-3.5" />
                System will automatically start at scheduled time
              </div>
            </div>
          </Card>

          {/* Last Broadcast */}
          <Card title="Last Broadcast" description="Most recent transmission">
            <div className="p-5 space-y-4">
              {lastBroadcast ? (
                <>
                  <div className="flex items-center gap-3">
                    {lastBroadcast.status === "completed" ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                    ) : lastBroadcast.status === "failed" ? (
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-rose-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Activity className="w-4.5 h-5 text-slate-600" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-800">
                        {lastBroadcast.status === "completed"
                          ? "Completed Successfully"
                          : lastBroadcast.status === "failed"
                            ? "Broadcast Failed"
                            : lastBroadcast.status}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatDateTime(lastBroadcast.startedAt)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Duration</span>
                      <span className="font-semibold text-slate-700">
                        {formatDuration(lastBroadcast.durationSeconds || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Audio</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[160px]">
                        {lastBroadcast.audioName || "Default"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Triggered by</span>
                      <span className="font-semibold text-slate-700 capitalize">
                        {lastBroadcast.triggeredBy}
                      </span>
                    </div>
                    {lastBroadcast.errorMessage && (
                      <div className="flex justify-between">
                        <span className="text-rose-500">Error</span>
                        <span className="font-semibold text-rose-600 text-xs truncate max-w-[160px]">
                          {lastBroadcast.errorMessage}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Radio className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No previous broadcasts yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Bottom Row: Server Status + Recent History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Server Health */}
          <Card title="Server Status" description="System resource usage">
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Server className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-600">
                  All systems operational
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      <Cpu className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">CPU Usage</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {health.cpuUsage.toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={health.cpuUsage}
                    color={health.cpuUsage > 80 ? "red" : health.cpuUsage > 60 ? "amber" : "blue"}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      <MemoryStick className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">Memory</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {health.memoryUsage.toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={health.memoryUsage}
                    color={health.memoryUsage > 80 ? "red" : health.memoryUsage > 60 ? "amber" : "blue"}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      <HardDrive className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">Disk Usage</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {health.diskUsage.toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={health.diskUsage}
                    color={health.diskUsage > 80 ? "red" : "green"}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 rounded px-2.5 py-2">
                  <div className="text-slate-500">Uptime</div>
                  <div className="font-bold text-slate-700">
                    {Math.floor(health.uptimeSeconds / 86400)}d{" "}
                    {Math.floor((health.uptimeSeconds % 86400) / 3600)}h
                  </div>
                </div>
                <div className="bg-slate-50 rounded px-2.5 py-2">
                  <div className="text-slate-500">FFmpeg</div>
                  <div className="font-bold text-slate-700">v{health.ffmpegVersion}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent History */}
          <Card
            title="Recent Broadcasts"
            description="Latest activity log"
            className="lg:col-span-2"
            action={
              <Link
                href="/history"
                className="text-sm font-semibold text-[#0d2856] hover:text-[#4a90e2] transition-colors"
              >
                View all →
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                      Audio
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                      Duration
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-8 text-center text-slate-400 text-sm"
                      >
                        No broadcast history yet
                      </td>
                    </tr>
                  ) : (
                    history.slice(0, 5).map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="text-sm font-medium text-slate-700">
                            {entry.startedAt
                              ? new Date(entry.startedAt).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )
                              : "—"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {entry.startedAt
                              ? new Date(entry.startedAt).toLocaleTimeString(
                                  "en-US",
                                  { hour: "2-digit", minute: "2-digit" }
                                )
                              : ""}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                            {entry.audioName || "—"}
                          </div>
                          <div className="text-xs text-slate-500 capitalize">
                            {entry.triggeredBy} trigger
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 font-medium">
                          {formatDuration(entry.durationSeconds || 0)}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={entry.status}>
                            {entry.status.charAt(0).toUpperCase() +
                              entry.status.slice(1)}
                          </StatusBadge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 pt-4">
          <p>
            © {new Date().getFullYear()} CHARIS Power Ministry • Automated Prayer
            Broadcast System • v1.0.0
          </p>
          <p className="mt-1">
            &ldquo;Pray without ceasing.&rdquo; — 1 Thessalonians 5:17
          </p>
        </footer>
      </div>
    </>
  );
}
