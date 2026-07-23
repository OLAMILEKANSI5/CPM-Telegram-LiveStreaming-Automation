"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/stat-card";

export function TestNowButton({
  audioId,
  durationMinutes,
}: {
  audioId?: number | null;
  durationMinutes: number;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setPending(true);
    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          audioId: audioId ?? null,
          durationMinutes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.detail || data?.error || "Could not start broadcast. Check Telegram & audio setup.");
      } else {
        router.push("/live-control");
      }
    } catch {
      alert("Could not reach backend. Is the Python backend running?");
    } finally {
      setPending(false);
      router.refresh();
    }
  };

  return (
    <Button size="sm" variant="success" onClick={handleClick} disabled={pending}>
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
      {pending ? "Starting…" : "Test Now"}
    </Button>
  );
}
