"use server";

import { updateTelegramConfig } from "@/lib/db-service";
import { revalidatePath } from "next/cache";

export async function saveCredentials(formData: FormData) {
  await updateTelegramConfig({
    apiId: String(formData.get("apiId") || ""),
    apiHash: String(formData.get("apiHash") || ""),
    phoneNumber: String(formData.get("phoneNumber") || ""),
  });
  revalidatePath("/telegram");
}

export async function saveChannelConfig(formData: FormData) {
  await updateTelegramConfig({
    channelId: String(formData.get("channelId") || ""),
    channelTitle: String(formData.get("channelTitle") || ""),
    voiceChatId: String(formData.get("voiceChatId") || ""),
  });
  revalidatePath("/telegram");
}
