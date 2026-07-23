"use server";

import { updateTelegramConfig } from "@/lib/db-service";
import { revalidatePath } from "next/cache";

export async function saveCredentials(formData: FormData) {
  try {
    const apiId = formData.get("apiId") as string;
    const apiHash = formData.get("apiHash") as string;
    const phone = formData.get("phone") as string;

    await updateTelegramConfig({
      apiId,
      apiHash,
      phoneNumber: phone,
    });

    revalidatePath("/telegram");
    revalidatePath("/");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save credentials");
  }
}

export async function saveChannelConfig(formData: FormData) {
  try {
    const channelId = formData.get("channelId") as string;
    const channelTitle = formData.get("channelTitle") as string;
    const voiceChatId = formData.get("voiceChatId") as string;

    await updateTelegramConfig({
      channelId,
      channelTitle,
      voiceChatId,
    });

    revalidatePath("/telegram");
    revalidatePath("/");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save channel configuration");
  }
}
