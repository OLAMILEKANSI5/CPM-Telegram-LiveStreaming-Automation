import { TopBar } from "@/components/topbar";
import { Card, Button, StatusBadge } from "@/components/ui/stat-card";
import { getTelegramConfig } from "@/lib/db-service";
import { saveCredentials } from "./actions";
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
                  defaultValue={tg?.api_id || ""}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">API Hash</label>
                <input
                  type="text"
                  name="apiHash"
                  defaultValue={tg?.api_hash || ""}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={tg?.phone_number || ""}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Save Credentials
              </Button>
            </form>
          </Card>

          <Card title="Channel & Voice Chat">
            <div className="p-5 text-slate-500">
              Channel configuration coming soon...
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
