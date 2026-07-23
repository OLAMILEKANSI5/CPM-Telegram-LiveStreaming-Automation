import { TopBar } from "@/components/topbar";
import { Card } from "@/components/ui/stat-card";
import { SubmitButton } from "@/components/submit-button";
import { ResetSettingsButton } from "@/components/reset-settings-button";
import { SettingsDataBackup } from "@/components/settings-data-backup";
import { getSettings, getAudios } from "@/lib/db-service";
import { saveSettings } from "./actions";
import {
  Church,
  Clock,
  FolderOpen,
  Music2,
  Bell,
  Shield,
  Info,
  HardDrive,
  Globe,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, audios] = await Promise.all([getSettings(), getAudios()]);
  const bool = (v: any) => v === "true" || v === true;

  return (
    <>
      <TopBar title="Settings" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-slate-800">System Settings</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure your broadcast system preferences
          </p>
        </div>

        <form action={saveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main settings form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Church Information */}
            <Card title="Church Information" description="Branding and identity">
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Church className="w-4 h-4 inline mr-1.5 text-slate-500" />
                    Church / Ministry Name
                  </label>
                  <input
                    type="text"
                    name="church_name"
                    defaultValue={settings.church_name || "CHARIS Power Ministry"}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    This appears in the dashboard header and notifications
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Logo URL (optional)
                  </label>
                  <input
                    type="text"
                    name="logo_url"
                    defaultValue={settings.logo_url || ""}
                    placeholder="/static/logo.png"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            </Card>

            {/* Time & Region */}
            <Card title="Time & Region" description="Timezone and locale settings">
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1.5 text-slate-500" />
                    Default Timezone
                  </label>
                  <select
                    name="timezone"
                    defaultValue={settings.timezone || "Africa/Lagos"}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    <option value="Africa/Lagos">Africa/Lagos (WAT, UTC+1)</option>
                    <option value="UTC">UTC</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="America/Chicago">America/Chicago</option>
                    <option value="America/Los_Angeles">America/Los_Angeles</option>
                    <option value="Asia/Dubai">Asia/Dubai</option>
                    <option value="Europe/Paris">Europe/Paris</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1.5">
                    All schedule times use this timezone
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1.5 text-slate-500" />
                    Time Format
                  </label>
                  <div className="flex gap-3">
                    <label className="flex-1 flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 has-[:checked]:border-[#4a90e2] has-[:checked]:bg-blue-50">
                      <input
                        type="radio"
                        name="time_format"
                        value="24"
                        defaultChecked={(settings.time_format || "24") === "24"}
                        className="w-4 h-4 accent-[#0d2856]"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-700">
                          24-hour
                        </div>
                        <div className="text-xs text-slate-500">e.g., 18:30</div>
                      </div>
                    </label>
                    <label className="flex-1 flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 has-[:checked]:border-[#4a90e2] has-[:checked]:bg-blue-50">
                      <input
                        type="radio"
                        name="time_format"
                        value="12"
                        defaultChecked={settings.time_format === "12"}
                        className="w-4 h-4 accent-[#0d2856]"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-700">
                          12-hour
                        </div>
                        <div className="text-xs text-slate-500">e.g., 6:30 PM</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* Audio Settings */}
            <Card title="Audio Settings" description="Broadcast audio defaults">
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FolderOpen className="w-4 h-4 inline mr-1.5 text-slate-500" />
                    Audio Upload Folder
                  </label>
                  <input
                    type="text"
                    name="audio_folder"
                    defaultValue={settings.audio_folder || "./uploads/audio"}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 font-mono text-sm transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    Path where the backend stores uploaded audio files (set via
                    the backend&apos;s <code>AUDIO_DIR</code> environment variable)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Music2 className="w-4 h-4 inline mr-1.5 text-slate-500" />
                    Default Broadcast Audio
                  </label>
                  <select
                    name="default_audio_id"
                    defaultValue={settings.default_audio_id || ""}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    <option value="">Use audio library default</option>
                    {audios.map((a: any) => (
                      <option key={a.id} value={a.id}>
                        {a.originalName}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Fallback audio when no audio is specified for a schedule
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Stream Quality
                    </label>
                    <select
                      name="stream_quality"
                      defaultValue={settings.stream_quality || "high"}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 bg-white"
                    >
                      <option value="low">Low (24 kbps)</option>
                      <option value="medium">Medium (32 kbps)</option>
                      <option value="high">High (48 kbps) — Recommended</option>
                      <option value="hifi">Hi-Fi (64 kbps)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Auto-stop After
                    </label>
                    <select
                      name="autostop_mode"
                      defaultValue={settings.autostop_mode || "audio_end"}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 bg-white"
                    >
                      <option value="audio_end">When audio finishes</option>
                      <option value="duration">After scheduled duration</option>
                      <option value="both">Whichever comes first</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Stream quality and auto-stop mode are saved for reference; the
                  backend currently always loops audio to the schedule&apos;s
                  duration at 128kbps.
                </p>
              </div>
            </Card>

            {/* Notifications */}
            <Card title="Notifications" description="Alerts and event notifications">
              <div className="p-5 space-y-3">
                <label className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      <Bell className="w-4 h-4 inline mr-1.5 text-slate-500" />
                      Broadcast start notification
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 ml-5.5">
                      Send a message when broadcast starts
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="notify_start"
                    defaultChecked={bool(settings.notify_start ?? "true")}
                    className="w-5 h-5 rounded border-slate-300 text-[#0d2856] focus:ring-[#4a90e2]"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Broadcast end notification
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Send a message when broadcast ends
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="notify_end"
                    defaultChecked={bool(settings.notify_end ?? "true")}
                    className="w-5 h-5 rounded border-slate-300 text-[#0d2856] focus:ring-[#4a90e2]"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Error alerts
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Notify on any broadcast failure or error
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="notify_error"
                    defaultChecked={bool(settings.notify_error ?? "true")}
                    className="w-5 h-5 rounded border-slate-300 text-[#0d2856] focus:ring-[#4a90e2]"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Daily summary
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Send daily broadcast summary report
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="daily_summary"
                    defaultChecked={bool(settings.daily_summary)}
                    className="w-5 h-5 rounded border-slate-300 text-[#0d2856] focus:ring-[#4a90e2]"
                  />
                </label>
              </div>
            </Card>

            {/* Security */}
            <Card title="Security & Access" description="System protection">
              <div className="p-5 space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-sm text-amber-800">
                  <Shield className="w-5 h-5 shrink-0 text-amber-600" />
                  <div>
                    <strong>Security Best Practices:</strong> Never share your
                    .env file, API credentials, or session strings. This system
                    stores all secrets in environment variables only.
                  </div>
                </div>

                <label className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Require login for dashboard
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Password-protect the web interface
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="require_login"
                    defaultChecked={bool(settings.require_login)}
                    className="w-5 h-5 rounded border-slate-300 text-[#0d2856] focus:ring-[#4a90e2]"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Auto-lock after inactivity
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Lock dashboard after 30 minutes
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="auto_lock"
                    defaultChecked={bool(settings.auto_lock ?? "true")}
                    className="w-5 h-5 rounded border-slate-300 text-[#0d2856] focus:ring-[#4a90e2]"
                  />
                </label>
                <p className="text-xs text-slate-400">
                  Login and auto-lock preferences are saved here but must be
                  enforced by your deployment (e.g. a reverse-proxy auth layer);
                  the app itself does not yet implement a login screen.
                </p>
              </div>
            </Card>

            {/* Save button */}
            <div className="flex items-center justify-end gap-3">
              <ResetSettingsButton />
              <SubmitButton>Save All Settings</SubmitButton>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* System Info */}
            <Card title="System Information">
              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Version</span>
                  <span className="font-bold text-slate-700">v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Python</span>
                  <span className="font-mono text-slate-700 text-xs">3.12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">FFmpeg</span>
                  <span className="font-mono text-slate-700 text-xs">6.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pyrogram (kurigram)</span>
                  <span className="font-mono text-slate-700 text-xs">2.2.23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PyTgCalls</span>
                  <span className="font-mono text-slate-700 text-xs">2.2.11</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Database</span>
                  <span className="font-mono text-slate-700 text-xs">PostgreSQL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    Audio Library
                  </span>
                  <span className="font-mono text-slate-700 text-xs">
                    {audios.length} file{audios.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Database Maintenance */}
            <Card title="Data & Backup">
              <SettingsDataBackup />
            </Card>

            {/* About */}
            <Card title="About">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0d2856] to-[#4a90e2] flex items-center justify-center text-white shadow-md">
                    <Church className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      CHARIS Broadcast
                    </div>
                    <div className="text-xs text-slate-500">
                      Prayer Automation System
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  A fully automated Telegram Voice Chat broadcast system designed
                  for daily prayer meetings. Runs unattended, streaming
                  pre-recorded audio to your channel every morning.
                </p>
                <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1">
                  <p>
                    <Info className="w-3 h-3 inline mr-1 text-slate-400" />
                    Licensed for ministry use.
                  </p>
                  <p className="italic text-slate-500">
                    &ldquo;Pray without ceasing.&rdquo;
                    <br />— 1 Thessalonians 5:17
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </>
  );
}
