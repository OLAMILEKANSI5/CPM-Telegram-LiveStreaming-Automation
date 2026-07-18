"use server";

import { updateTelegramConfig } from "@/lib/db-service";
import { revalidatePath } from "next/cache";

export async function saveCredentials(formData: FormData) {
  try {
    const apiId = formData.get("apiId") as string;
    const apiHash = formData.get("apiHash") as string;
    const phone = formData.get("phone") as string;
    const channelId = formData.get("channelId") as string;
    const voiceChatId = formData.get("voiceChatId") as string;

    await updateTelegramConfig({
      api_id: apiId,
      api_hash: apiHash,
      phone_number: phone,
      channel_id: channelId,
      voice_chat_id: voiceChatId,
    });

    revalidatePath("/telegram");
    // Do not return anything (void) for form action
  } catch (error) {
    console.error("Save credentials error:", error);
    throw new Error("Failed to save credentials");
  }
}
