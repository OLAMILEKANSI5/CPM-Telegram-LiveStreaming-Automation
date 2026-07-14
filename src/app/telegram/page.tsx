import { TopBar } from "@/components/topbar";
import { Card, Button, StatusBadge } from "@/components/ui/stat-card";
import { getTelegramConfig } from "@/lib/db-service";
import { saveCredentials, saveChannelConfig } from "./actions";
import {
  Send,
  Key,
  Phone,
  Hash,
  Users,
  Radio,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  RefreshCw,
  Link2,
  Unlink,
  Database,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TelegramPage() {
  const tg = await getTelegramConfig();
  const isConnected = tg?.connected;

  return (
    <>
      <TopBar title="Telegram Settings" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-slate-800">Telegram Configuration</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Connect your Telegram account to enable automated Voice Chat broadcasts
          </p>
        </div>

        {/* Connection Status Banner */}
        <Card
          className={
            isConnected
              ? "border-emerald-300 bg-gradient-to-r from-emerald-50 to-white"
              : "border-amber-300 bg-gradient-to-r from-amber-50 to-white"
          }
        >
          <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${
                  isConnected
                    ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                    : "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
                }`}
              >
                {isConnected ? (
                  <ShieldCheck className="w-7 h-7" />
                ) : (
                  <AlertTriangle className="w-7 h-7" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">
                    {isConnected
                      ? "Telegram Connected"
                      : "Telegram Not Connected"}
                  </h3>
                  <StatusBadge status={isConnected ? "connected" : "disconnected"}>
                    {isConnected ? "Active" : "Setup Required"}
                  </StatusBadge>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  {isConnected
                    ? `Authorized as ${tg?.phoneNumber || "User"} • Auto-reconnect enabled`
                    : "Configure your API credentials and authenticate to start broadcasting"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4" />
                    Reconnect
                  </Button>
                  <Button size="sm" variant="danger">
                    <Unlink className="w-4 h-4" />
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button size="sm">
                  <Link2 className="w-4 h-4" />
                  Connect Account
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Credentials */}
          <Card title="API Credentials" description="Get these from my.telegram.org">
            <form action={saveCredentials} className="p-5 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3 text-sm text-blue-800">
                <AlertTriangle className="w-5 h-5 shrink-0 text-blue-600" />
                <div>
                  <strong>Important:</strong> Go to{" "}
                  <a
                    href="https://my.telegram.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    my.telegram.org
                  </a>{" "}
                  and create a new application to obtain your API ID and API
                  Hash. Keep these credentials secret.
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Key className="w-4 h-4 inline mr-1.5 text-slate-500" />
                  API ID
                </label>
                <input
                  type="text"
                  name="apiId"
                  placeholder="Enter your API ID (e.g., 12345678)"
                  defaultValue={tg?.apiId || ""}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 transition-all font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-1.5 text-slate-500" />
                  API Hash
                </label>
                <input
                  type="password"
                  name="apiHash"
                  placeholder="Enter your API Hash"
                  defaultValue={tg?.apiHash || ""}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 transition-all font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1.5 text-slate-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="+2348000000000"
                  defaultValue={tg?.phoneNumber || ""}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 transition-all font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Include country code with + prefix (e.g., +234 for Nigeria)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Database className="w-4 h-4 inline mr-1.5 text-slate-500" />
                  Session String
                </label>
                <textarea
                  rows={3}
                  placeholder="Session will appear here after authentication..."
                  defaultValue={tg?.sessionString || ""}
                  readOnly
                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-lg text-slate-600 font-mono text-xs resize-none"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Auto-generated after first login. Stored securely.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit">Save Credentials</Button>
                <Button type="button" variant="outline" title="Run: python backend/login.py (see deployment guide)">
                  <Send className="w-4 h-4" />
                  Send Code & Login
                </Button>
              </div>
            </form>
          </Card>

          {/* Channel Configuration */}
          <Card
            title="Channel & Voice Chat"
            description="Configure the broadcast target channel"
          >
            <form action={saveChannelConfig} className="p-5 space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Connection Info
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <StatusBadge status={isConnected ? "connected" : "disconnected"}>
                      {isConnected ? "Online" : "Offline"}
                    </StatusBadge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Session:</span>
                    <span className="font-semibold text-slate-700">
                      {tg?.sessionString ? "Active" : "Not created"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last connected:</span>
                    <span className="font-semibold text-slate-700">
                      {tg?.lastConnectedAt
                        ? new Date(tg.lastConnectedAt).toLocaleString()
                        : "Never"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1.5 text-slate-500" />
                  Channel ID
                </label>
                <input
                  type="text"
                  name="channelId"
                  placeholder="-1001234567890"
                  defaultValue={tg?.channelId || ""}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 transition-all font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  The channel/group where voice chat will be started. Use negative
                  ID for channels (e.g., -100xxxxx).
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Channel Title / Name
                </label>
                <input
                  type="text"
                  name="channelTitle"
                  placeholder="CHARIS Power Ministry Prayer Channel"
                  defaultValue={tg?.channelTitle || ""}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Radio className="w-4 h-4 inline mr-1.5 text-slate-500" />
                  Voice Chat ID (optional)
                </label>
                <input
                  type="text"
                  name="voiceChatId"
                  placeholder="Auto-detected (leave empty)"
                  defaultValue={tg?.voiceChatId || ""}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:border-[#4a90e2] focus:ring-2 focus:ring-blue-100 transition-all font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Leave empty to auto-create or join the active group call.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-300 text-[#0d2856] focus:ring-[#4a90e2]"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700">
                      Auto-reconnect on disconnect
                    </div>
                    <div className="text-xs text-slate-500">
                      Automatically reconnect if Telegram connection drops
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
                      Mute on join
                    </div>
                    <div className="text-xs text-slate-500">
                      Join voice chat muted (audio only, no microphone)
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit">Save Channel Config</Button>
                <Button type="button" variant="outline">
                  <CheckCircle2 className="w-4 h-4" />
                  Test Connection
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Authentication Steps Guide */}
        <Card title="Setup Instructions" description="How to connect your Telegram account">
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  step: "1",
                  title: "Get API Credentials",
                  desc: "Visit my.telegram.org, login with your phone number, and create a new app to get API ID and API Hash.",
                },
                {
                  step: "2",
                  title: "Enter Credentials",
                  desc: "Paste your API ID, API Hash, and phone number into the fields above and click 'Save'.",
                },
                {
                  step: "3",
                  title: "Verify Login",
                  desc: "Click 'Send Code & Login'. You'll receive a code on Telegram. Enter it when prompted.",
                },
                {
                  step: "4",
                  title: "Configure Channel",
                  desc: "Add the bot/user to your channel as admin with permission to manage voice chats, then enter the channel ID.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative bg-slate-50 rounded-xl p-4 border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0d2856] to-[#4a90e2] text-white flex items-center justify-center font-bold text-sm mb-3 shadow-md">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 bg-rose-50 border border-rose-200 rounded-lg p-4 flex gap-3 text-sm text-rose-800">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
              <div>
                <strong>Security Notice:</strong> Never share your API Hash,
                session string, or verification codes with anyone. These grant
                full access to your Telegram account. This system stores
                credentials securely in your local environment variables only.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
