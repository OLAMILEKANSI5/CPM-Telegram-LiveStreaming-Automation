"use server";

import {
  createSchedule,
  updateSchedule,
  toggleSchedule,
  deleteSchedule,
} from "@/lib/db-service";
import { revalidatePath } from "next/cache";

function parseDays(formData: FormData): string {
  const days = formData.getAll("days") as string[];
  if (!days || days.length === 0) return "0,1,2,3,4,5,6";
  return days.join(",");
}

export async function saveSchedule(formData: FormData) {
  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string) || "Daily Prayer";
  const timeStr = (formData.get("time") as string) || "06:00";
  const [hourStr, minuteStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10) || 0;
  const minute = parseInt(minuteStr, 10) || 0;
  const durationMinutes = parseInt(formData.get("duration") as string, 10) || 60;
  const timezone = (formData.get("timezone") as string) || "Africa/Lagos";
  const daysOfWeek = parseDays(formData);
  const audioIdRaw = formData.get("audioId") as string;
  const audioId = audioIdRaw ? parseInt(audioIdRaw, 10) : null;
  const enabled = formData.get("enabled") !== "false";

  const payload = {
    name,
    hour,
    minute,
    durationMinutes,
    timezone,
    daysOfWeek,
    audioId,
    enabled,
  };

  if (id) {
    await updateSchedule(parseInt(id, 10), payload);
  } else {
    await createSchedule(payload);
  }

  revalidatePath("/scheduler");
  revalidatePath("/");
}

export async function toggleScheduleAction(id: number, enabled: boolean) {
  await toggleSchedule(id, enabled);
  revalidatePath("/scheduler");
  revalidatePath("/");
}

export async function deleteScheduleAction(id: number) {
  await deleteSchedule(id);
  revalidatePath("/scheduler");
  revalidatePath("/");
}
