"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/stat-card";
import { clearOldLogsAction } from "@/app/settings/actions";

async function downloadFromUrl(url: string, filename?: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Request failed");
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  const disposition = res.headers.get("content-disposition");
  const match = disposition?.match(/filename="?([^"]+)"?/);
  a.download = filename || match?.[1] || "download";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

export function SettingsDataBackup() {
  const router = useRouter();
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const handleBackup = async () => {
    setBusy("backup");
    try {
      await downloadFromUrl("/api/backup");
    } catch {
      alert("Could not create backup.");
    } finally {
      setBusy(null);
    }
  };

  const handleRestoreFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!confirm("Restore settings and schedules from this backup file? Existing values with matching keys will be overwritten.")) {
      if (restoreInputRef.current) restoreInputRef.current.value = "";
      return;
    }
    setBusy("restore");
    try {
      const text = await files[0].text();
      const body = JSON.parse(text);
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Restore failed");
      alert(`Restored ${data.restoredSettings} setting(s) and ${data.restoredSchedules} schedule(s).`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Could not restore backup. Is the file valid?");
    } finally {
      setBusy(null);
      if (restoreInputRef.current) restoreInputRef.current.value = "";
    }
  };

  const handleExportLogs = async () => {
    setBusy("export-logs");
    try {
      await downloadFromUrl("/api/logs?format=csv&limit=5000");
    } catch {
      alert("Could not export logs.");
    } finally {
      setBusy(null);
    }
  };

  const handleClearOldLogs = async () => {
    if (!confirm("Delete all log entries older than 30 days?")) return;
    setBusy("clear-logs");
    try {
      const result = await clearOldLogsAction();
      alert(`Cleared ${result.count} old log entr${result.count === 1 ? "y" : "ies"}.`);
      router.refresh();
    } catch {
      alert("Could not clear old logs.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="p-5 space-y-2">
      <input
        ref={restoreInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => handleRestoreFile(e.target.files)}
      />
      <Button variant="outline" size="sm" className="w-full" onClick={handleBackup} disabled={busy === "backup"}>
        {busy === "backup" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Backup Database
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => restoreInputRef.current?.click()}
        disabled={busy === "restore"}
      >
        {busy === "restore" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        Restore Database
      </Button>
      <Button variant="outline" size="sm" className="w-full" onClick={handleExportLogs} disabled={busy === "export-logs"}>
        {busy === "export-logs" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Export All Logs
      </Button>
      <Button variant="danger" size="sm" className="w-full" onClick={handleClearOldLogs} disabled={busy === "clear-logs"}>
        {busy === "clear-logs" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        Clear Old Logs (30d+)
      </Button>
    </div>
  );
}
