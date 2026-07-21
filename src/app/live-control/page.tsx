// src/app/live-control/page.tsx (updated)
"use client";

import { TopBar } from "@/components/topbar";
import { Card, Button, StatusBadge } from "@/components/ui/stat-card";
import { ... icons ... } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export default function LiveControlPage() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [inVoiceChat, setInVoiceChat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(85);
  const [backendOnline, setBackendOnline] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/broadcast", { cache: "no-store" });
      if (!res.ok) throw new Error("Status fetch failed");
      const data = await res.json();
      setBackendOnline(true);
      setIsBroadcasting(!!data.broadcastActive);
      setInVoiceChat(!!data.inVoiceChat);
      setError(null);
    } catch (err) {
      setBackendOnline(false);
      setError("Backend unreachable");
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    const id = setInterval(refreshStatus, 3000); // Faster poll
    return () => clearInterval(id);
  }, [refreshStatus]);

  const toggleBroadcast = async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: isBroadcasting ? "stop" : "start", 
          durationMinutes: 60 
        }),
      });
      if (!res.ok) throw new Error("Action failed");
      await refreshStatus();
    } catch (err: any) {
      setError(err.message || "Failed to toggle broadcast");
    } finally {
      setPending(false);
    }
  };

  // ... rest of component with improved UI/feedback (pending disabled, error banner) ...
