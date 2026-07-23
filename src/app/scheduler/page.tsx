import { TopBar } from "@/components/topbar";
import { Card, StatusBadge } from "@/components/ui/stat-card";
import { getSchedules, getAudios, getScheduleById } from "@/lib/db-service";
import { saveSchedule } from "./actions";
import { ScheduleDaysPicker } from "@/components/schedule-days-picker";
import { ScheduleRowActions } from "@/components/schedule-row-actions";
import { TestNowButton } from "@/components/test-now-button";
import { SubmitButton } from "@/components/submit-button";
import {
  CalendarClock,
  Plus,
  Clock,
  Globe,
  CalendarDays,
  Music2,
} from "lucide-react";
import Link from "next/link";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const dynamic = "force-dynamic";

export default async function SchedulerPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; new?: string }>;
}) {
  const params = await searchParams;
  const [schedules, audios] = await Promise.all([getSchedules(), getAudios()]);

  let editing: any = null;
  if (params.id) {
    editing = await getScheduleById(parseInt(params.id, 10));
  }
  if (!editing && !params.new) {
    editing = schedules[0] || null;
  }

  const isCreating = !editing;
  const otherSchedules = schedules.filter((s: any) => !editing || s.id !== editing.id);

  const defaultHour = editing?.hour ?? 6;
  const defaultMinute = editing?.minute ?? 0;
  const timeValue = `${String(defaultHour).padStart(2, "0")}:${String(defaultMinute).padStart(2, "0")}`;

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
          <Link
            href="/scheduler?new=1"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0d2856] to-[#1e4080] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-[#0a1f44] hover:to-[#0d2856] transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Schedule
          </Link>
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
                  {schedules.filter((s: any) => s.enabled).length}
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
                  {editing ? "Editing Time" : "Default Time"}
                </div>
                <div className="text-2xl font-bold text-slate-800">{timeValue}</div>
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
                <div className="text-lg font-bold text-slate-800">
                  {editing?.timezone || "Africa/Lagos"}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Schedule editor */}
        <Card
          title={isCreating ? "New Schedule" : editing.name}
          description={isCreating ? "Create a new broadcast schedule" : "Edit this broadcast schedule"}
        >
          <form action={saveSchedule} className="p-5 space-y-5">
            {editing?.id && <input type="hidden" name="id" value={editing.id} />}

            {/* Schedule summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1 block">
                    Schedule Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editing?.name || "Daily Morning Prayer"}
                    className="w-full bg-white/70 px-3 py-2 rounded-lg border border-blue-200 text-lg font-bold text-[#0d2856] focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={editing?.enabled !== false ? "enabled" : "disabled"}>
                    {editing?.enabled !== false ? "Enabled" : "Paused"}
                  </StatusBadge>
                  {!isCreating && (
                    <TestNowButton
                      audioId={editing?.audioId}
                      durationMinutes={editing?.durationMinutes || 60}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Broadcast Time
                </label>
                <input
                  type="time"
                  name="time"
                  defaultValue={timeValue}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
                {/* hidden hour/minute derived server-side via a second field pair */}
                <p className="text-xs text-slate-500 mt-1.5">
                  Time in 24-hour format (HH:MM)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Duration
                </label>
                <select
                  name="duration"
                  defaultValue={String(editing?.durationMinutes || 60)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes (1 hour)</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes (2 hours)</option>
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
                  name="timezone"
                  defaultValue={editing?.timezone || "Africa/Lagos"}
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
                  name="audioId"
                  defaultValue={editing?.audioId ? String(editing.audioId) : ""}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="">Use default audio</option>
                  {audios.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.originalName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Days of week */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <CalendarDays className="w-4 h-4 inline mr-1.5" />
                Repeat on Days
              </label>
              <ScheduleDaysPicker defaultDays={editing?.daysOfWeek || "0,1,2,3,4,5,6"} />
            </div>

            {/* Enabled toggle */}
            <label className="flex items-center gap-3 cursor-pointer bg-slate-50 rounded-lg p-4">
              <input
                type="checkbox"
                name="enabled"
                value="true"
                defaultChecked={editing?.enabled !== false}
                className="w-4 h-4 rounded border-slate-300 text-[#0d2856] focus:ring-[#4a90e2]"
              />
              <div>
                <div className="text-sm font-medium text-slate-700">Schedule enabled</div>
                <div className="text-xs text-slate-500">
                  Uncheck to pause this schedule without deleting it
                </div>
              </div>
            </label>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              {!isCreating && (
                <Link
                  href="/scheduler?new=1"
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel / New
                </Link>
              )}
              <SubmitButton>{isCreating ? "Create Schedule" : "Save Changes"}</SubmitButton>
            </div>
          </form>
        </Card>

        {/* Additional schedules list */}
        <Card
          title="Additional Schedules"
          description="Extra broadcast times (optional)"
        >
          {otherSchedules.length === 0 ? (
            <div className="p-8 text-center">
              <CalendarClock className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 font-medium">No additional schedules</p>
              <p className="text-sm text-slate-400 mt-1">
                You can add more schedules for evening prayers, special events, or weekly services
              </p>
              <Link
                href="/scheduler?new=1"
                className="mt-4 inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                <Plus className="w-4 h-4" />
                Add Evening Prayer
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {otherSchedules.map((sched: any) => (
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
                  <ScheduleRowActions id={sched.id} enabled={sched.enabled} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Weekly view */}
        <Card title="Weekly Overview" description="Schedule at a glance">
          <div className="p-5">
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day, i) => {
                const todaysSchedules = schedules.filter((s: any) =>
                  s.enabled && (s.daysOfWeek || "0,1,2,3,4,5,6").split(",").map(Number).includes(i)
                );
                const next = todaysSchedules.sort((a: any, b: any) => a.hour - b.hour)[0];
                return (
                  <div key={day} className="text-center">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">
                      {day}
                    </div>
                    <div
                      className={
                        next
                          ? "bg-gradient-to-b from-[#0d2856] to-[#4a90e2] rounded-lg px-2 py-3 text-white shadow-sm"
                          : "bg-slate-100 rounded-lg px-2 py-3 text-slate-400 shadow-sm"
                      }
                    >
                      <div className="text-lg font-bold">
                        {next ? next.hour.toString().padStart(2, "0") : "--"}:
                        {next ? next.minute.toString().padStart(2, "0") : "--"}
                      </div>
                      <div className="text-[10px] opacity-80">
                        {next ? "Scheduled" : "None"}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Music2 className="w-3 h-3 mx-auto text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
