"use server";

import { createSchedule, toggleSchedule, deleteSchedule } from "@/lib/db-service";
import { revalidatePath } from "next/cache";

export async function saveSchedule(formData: FormData) {
  const name = formData.get("name") as string;
  const hour = parseInt(formData.get("hour") as string);
  const minute = parseInt(formData.get("minute") as string);
  const duration = parseInt(formData.get("duration") as string) || 60;

  await createSchedule({
    name: name || "Daily Prayer",
    hour,
    minute,
    durationMinutes: duration,
    days_of_week: "0,1,2,3,4,5,6",
    timezone: "Africa/Lagos",
    enabled: true,
  });

  revalidatePath("/scheduler");
  return { success: true };
}

export async function toggleScheduleAction(id: number) {
  // Toggle logic (you can expand later)
  revalidatePath("/scheduler");
}
