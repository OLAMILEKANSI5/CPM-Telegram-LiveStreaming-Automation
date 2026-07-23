"use server";

import { updateSettings, resetSettingsToDefaults, clearOldLogs, clearAllLogs } from "@/lib/db-service";
import { revalidatePath } from "next/cache";

export async function saveSettings(formData: FormData) {
  const fields: Record<string, string> = {
    church_name: (formData.get("church_name") as string) || "",
    logo_url: (formData.get("logo_url") as string) || "",
    timezone: (formData.get("timezone") as string) || "Africa/Lagos",
    time_format: (formData.get("time_format") as string) || "24",
    audio_folder: (formData.get("audio_folder") as string) || "./uploads/audio",
    default_audio_id: (formData.get("default_audio_id") as string) || "",
    stream_quality: (formData.get("stream_quality") as string) || "high",
    autostop_mode: (formData.get("autostop_mode") as string) || "audio_end",
    notify_start: formData.get("notify_start") ? "true" : "false",
    notify_end: formData.get("notify_end") ? "true" : "false",
    notify_error: formData.get("notify_error") ? "true" : "false",
    daily_summary: formData.get("daily_summary") ? "true" : "false",
    require_login: formData.get("require_login") ? "true" : "false",
    auto_lock: formData.get("auto_lock") ? "true" : "false",
  };

  await updateSettings(fields);
  revalidatePath("/settings");
  revalidatePath("/");
}

export async function resetSettingsAction() {
  await resetSettingsToDefaults();
  revalidatePath("/settings");
  revalidatePath("/");
  return { success: true };
}

export async function clearOldLogsAction() {
  const count = await clearOldLogs(30);
  revalidatePath("/settings");
  revalidatePath("/logs");
  return { success: true, count };
}

export async function clearAllLogsAction() {
  const count = await clearAllLogs();
  revalidatePath("/settings");
  revalidatePath("/logs");
  return { success: true, count };
}
