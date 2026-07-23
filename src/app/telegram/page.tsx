import { TopBar } from "@/components/topbar";
import { Card, Button, StatusBadge } from "@/components/ui/stat-card";
import { getTelegramConfig } from "@/lib/db-service";
import { saveCredentials, saveChannelConfig } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import {
  Send,
  Hash,
  Radio,
  ShieldCheck,
  AlertTriangle,
  Info,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TelegramPage() {
  const tg = await getTelegramConfig();
  const isConnected = !!tg?.connected;
  const hasCredentials = !!(tg?.apiId && tg?.apiHash);
  const hasVoiceChat = !!tg?.voiceChatId;

  return (
    <>
      <TopBar title="Telegram Settings" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Telegram Configuration</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Connect your Telegram account to enable automated Voice Chat broadcasts
          </p>
        </div>

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
                    {isConnected ? "Telegram Connected" : "Telegram Not Connected"}
                  </h3>
                  <StatusBadge status={isConnected ? "connected" : "disconnected"}>
                    {isConnected ? "Active" : "Setup Required"}
                  </StatusBadge>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                  {isConnected
                    ? `Signed in as ${tg?.phoneNumber || "your account"}. The backend keeps this connection alive automatically.`
                    : !hasCredentials
                    ? "Enter your API credentials below, then run the login script on the backend to establish a session."
                    : !hasVoiceChat
                    ? "Credentials saved. Set your Voice Chat ID below so broadcasts know where to stream."
                    : "Waiting for the backend to establish a Telegram session."}
                </p>
              </div>
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
                  <a href="https://my.telegram.org" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
                    my.telegram.org
                  </a>{" "}
                  and create a new application.
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">API ID</label>
                <input
                  type="text"
                  name="apiId"
                  defaultValue={tg?.apiId || ""}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">API Hash</label>
                <input
                  type="text"
                  name="apiHash"
                  defaultValue={tg?.apiHash || ""}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={tg?.phoneNumber || ""}
                  placeholder="+234..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex gap-3 text-xs text-slate-600">
                <Info className="w-4 h-4 shrink-0 text-slate-400" />
                <div>
                  Saving credentials here only stores them for the backend to use. The
                  backend still needs a valid session — run{" "}
                  <code className="bg-slate-200 px-1 rounded">python login.py</code> once
                  in the <code className="bg-slate-200 px-1 rounded">backend/</code>{" "}
                  folder (or restart the backend) to complete the Telegram login.
                </div>
              </div>

              <SubmitButton className="w-full">Save Credentials</SubmitButton>
            </form>
          </Card>

          {/* Channel & Voice Chat */}
          <Card title="Channel & Voice Chat" description="Where broadcasts are streamed">
            <form action={saveChannelConfig} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-1.5 text-slate-500" />
                  Channel / Group ID
                </label>
                <input
                  type="text"
                  name="channelId"
                  defaultValue={tg?.channelId || ""}
                  placeholder="-1001234567890"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  The numeric ID of the Telegram channel or group (with the leading -100 for
                  supergroups/channels)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Channel Title (optional)
                </label>
                <input
                  type="text"
                  name="channelTitle"
                  defaultValue={tg?.channelTitle || ""}
                  placeholder="CHARIS Power Ministry"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Radio className="w-4 h-4 inline mr-1.5 text-slate-500" />
                  Voice Chat ID
                </label>
                <input
                  type="text"
                  name="voiceChatId"
                  defaultValue={tg?.voiceChatId || ""}
                  placeholder="Same as Channel/Group ID for most setups"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg font-mono text-sm"
                  required
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Required — the backend cannot start a broadcast without this
                </p>
              </div>

              {!hasVoiceChat && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  No Voice Chat ID configured yet — Live Control and scheduled
                  broadcasts will fail to start until this is set.
                </div>
              )}

              <SubmitButton className="w-full">Save Channel Settings</SubmitButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
