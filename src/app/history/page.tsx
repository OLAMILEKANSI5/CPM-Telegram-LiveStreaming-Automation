import { TopBar } from "@/components/topbar";
import { Card, StatusBadge, Button } from "@/components/ui/stat-card";
import { getHistory } from "@/lib/db-service";
import { formatDateTime, formatDuration } from "@/lib/utils";
import {
  History as HistoryIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  Radio,
  Download,
  RefreshCw,
  Filter,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const history = await getHistory(100);

  const stats = {
    total: history.length,
    completed: history.filter((h) => h.status === "completed").length,
    failed: history.filter((h) => h.status === "failed").length,
    totalDuration: history.reduce(
      (acc, h) => acc + (h.durationSeconds || 0),
      0
    ),
  };

  return (
    <>
      <TopBar title="Broadcast History" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Broadcast History</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Complete record of all past prayer broadcasts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button size="sm">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="!p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center">
                <Radio className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Total Broadcasts
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {stats.total}
                </div>
              </div>
            </div>
          </Card>
          <Card className="!p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Successful
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  {stats.completed}
                </div>
              </div>
            </div>
          </Card>
          <Card className="!p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-rose-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Failed
                </div>
                <div className="text-2xl font-bold text-rose-600">
                  {stats.failed}
                </div>
              </div>
            </div>
          </Card>
          <Card className="!p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Total Air Time
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {Math.round(stats.totalDuration / 3600)}h
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* History Table */}
        <Card title="All Broadcasts" description="Detailed broadcast log">
          {history.length === 0 ? (
            <div className="p-10 text-center">
              <HistoryIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 font-medium">No broadcast history yet</p>
              <p className="text-sm text-slate-400 mt-1">
                Your past broadcasts will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                      <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                      Date & Time
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                      Audio File
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                      Duration
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                      <User className="w-3.5 h-3.5 inline mr-1.5" />
                      Triggered By
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium text-slate-700">
                          {formatDateTime(entry.startedAt).split(",")[0]}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatDateTime(entry.startedAt).split(",").slice(1).join(",").trim()}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium text-slate-700 truncate max-w-[220px]">
                          {entry.audioName || "—"}
                        </div>
                        {entry.scheduleId && (
                          <div className="text-xs text-slate-500">
                            Schedule #{entry.scheduleId}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-700 font-mono">
                        {formatDuration(entry.durationSeconds || 0)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                            entry.triggeredBy === "scheduler"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {entry.triggeredBy === "scheduler" ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          {entry.triggeredBy}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={entry.status}>
                          {entry.status.charAt(0).toUpperCase() +
                            entry.status.slice(1)}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-3.5">
                        {entry.errorMessage ? (
                          <span
                            className="inline-flex items-center gap-1 text-xs text-rose-600 cursor-help"
                            title={entry.errorMessage}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            View Error
                          </span>
                        ) : entry.status === "completed" ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            No issues
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
