import { TopBar } from "@/components/topbar";
import { Card, Button, StatusBadge } from "@/components/ui/stat-card";
import { getSchedules } from "@/lib/db-service";
import {
  CalendarClock,
  Plus,
  Clock,
  Globe,
  CalendarDays,
  Play,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Music2,
} from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const dynamic = "force-dynamic";

export default async function SchedulerPage() {
  const schedules = await getSchedules();

  return (
    <>
      <TopBar title="Scheduler" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Broadcast Schedules</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Configure automated daily prayer broadcast times
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4" />
            New Schedule
          </Button>
        </div>

        {/* Quick Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="!p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CalendarClock className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Active Schedules
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {schedules.filter((s) => s.enabled).length}
                </div>
              </div>
            </div>
          </Card>
          <Card className="!p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Default Time
                </div>
                <div className="text-2xl font-bold text-slate-800">06:00 AM</div>
              </div>
            </div>
          </Card>
          <Card className="!p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Timezone
                </div>
                <div className="text-lg font-bold text-slate-800">Africa/Lagos</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Default schedule (6:00 AM daily) */}
        <Card
          title="Daily Morning Prayer"
          description="Primary daily broadcast schedule"
        >
          <div className="p-5 space-y-5">
            {/* Schedule summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                    Next Broadcast
                  </div>
                  <div className="text-3xl font-bold text-[#0d2856]">6:00 AM</div>
                  <div className="text-sm text-slate-600 mt-1">
                    Daily • Africa/Lagos (WAT, UTC+1)
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status="enabled">
                    <ToggleRight className="w-3.5 h-3.5 inline mr-1" />
                    Enabled
                  </StatusBadge>
                  <Button size="sm" variant="success">
                    <Play className="w-4 h-4" />
                    Test Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Broadcast Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    defaultValue="06:00"
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Time in 24-hour format (HH:MM)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Duration
                </label>
                <select
                  defaultValue="60"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes (1 hour)</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes (2 hours)</option>
                  <option value="until_end">Until audio finishes</option>
                </select>
                <p className="text-xs text-slate-500 mt-1.5">
                  Auto-stop after this duration
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Timezone
                </label>
                <select
                  defaultValue="Africa/Lagos"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="Africa/Lagos">Africa/Lagos (WAT, UTC+1)</option>
                  <option value="UTC">UTC</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Audio File
                </label>
                <select
                  defaultValue=""
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="">Use default audio</option>
                  <option value="1">
                    Morning Prayer - Speaking in Tongues.mp3
                  </option>
                </select>
              </div>
            </div>

            {/* Days of week */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <CalendarDays className="w-4 h-4 inline mr-1.5" />
                Repeat on Days
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day, i) => {
                  const enabled = true; // All days selected by default
                  return (
                    <button
                      key={day}
                      className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${
                        enabled
                          ? "bg-gradient-to-br from-[#0d2856] to-[#4a90e2] text-white shadow-md"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-3">
                <button className="text-xs font-semibold text-[#0d2856] hover:underline">
                  Select All
                </button>
                <span className="text-slate-300">•</span>
                <button className="text-xs font-semibold text-[#0d2856] hover:underline">
                  Weekdays
                </button>
                <span className="text-slate-300">•</span>
                <button className="text-xs font-semibold text-[#0d2856] hover:underline">
                  Weekends
                </button>
              </div>
            </div>

            {/* Advanced options */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-bold text-slate-700">
                Advanced Options
              </h4>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-300 text-[#0d2856] focus:ring-[#4a90e2]"
                />
                <div>
                  <div className="text-sm font-medium text-slate-700">
                    Auto-retry on failure
                  </div>
                  <div className="text-xs text-slate-500">
                    Automatically retry up to 3 times if broadcast fails to start
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-300 text-[#0d2856] focus:ring-[#4a90e2]"
                />
                <div>
                  <div className="text-sm font-medium text-slate-700">
                    Auto-stop at end time
                  </div>
                  <div className="text-xs text-slate-500">
                    End broadcast at scheduled end time even if audio is still playing
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-[#0d2856] focus:ring-[#4a90e2]"
                />
                <div>
                  <div className="text-sm font-medium text-slate-700">
                    Random audio rotation
                  </div>
                  <div className="text-xs text-slate-500">
                    Play a random audio file from the library each day
                  </div>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline">Pause Schedule</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </Card>

        {/* Additional schedules list */}
        <Card
          title="Additional Schedules"
          description="Extra broadcast times (optional)"
        >
          {schedules.length <= 1 ? (
            <div className="p-8 text-center">
              <CalendarClock className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 font-medium">No additional schedules</p>
              <p className="text-sm text-slate-400 mt-1">
                You can add more schedules for evening prayers, special events, or weekly services
              </p>
              <Button size="sm" variant="outline" className="mt-4">
                <Plus className="w-4 h-4" />
                Add Evening Prayer
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {schedules.slice(1).map((sched) => (
                <div key={sched.id} className="p-5 flex items-center gap-4">
                  <div
                    className={`w-1 h-12 rounded-full ${sched.enabled ? "bg-emerald-500" : "bg-slate-300"}`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-800">
                        {sched.name}
                      </h4>
                      <StatusBadge status={sched.enabled ? "enabled" : "disabled"}>
                        {sched.enabled ? "Active" : "Paused"}
                      </StatusBadge>
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5">
                      {sched.hour.toString().padStart(2, "0")}:
                      {sched.minute.toString().padStart(2, "0")} •{" "}
                      {sched.durationMinutes} min • {sched.timezone}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                      {sched.enabled ? (
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <button className="p-2 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Weekly view */}
        <Card title="Weekly Overview" description="Schedule at a glance">
          <div className="p-5">
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day, i) => (
                <div key={day} className="text-center">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-2">
                    {day}
                  </div>
                  <div className="bg-gradient-to-b from-[#0d2856] to-[#4a90e2] rounded-lg px-2 py-3 text-white shadow-sm">
                    <div className="text-lg font-bold">6:00</div>
                    <div className="text-[10px] text-blue-200">AM</div>
                  </div>
                  <div className="mt-2">
                    <Music2 className="w-3 h-3 mx-auto text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
