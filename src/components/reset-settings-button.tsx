"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/stat-card";
import { resetSettingsAction } from "@/app/settings/actions";

export function ResetSettingsButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    if (!confirm("Reset all settings to their defaults? This does not affect schedules or audio files.")) return;
    startTransition(async () => {
      await resetSettingsAction();
      router.refresh();
    });
  };

  return (
    <Button variant="outline" onClick={handleClick} disabled={isPending}>
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
      Reset to Defaults
    </Button>
  );
}
