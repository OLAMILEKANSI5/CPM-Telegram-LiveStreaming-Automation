"use client";

import { TopBar } from "@/components/topbar";
import { Card, Button, StatusBadge } from "@/components/ui/stat-card";
import {
  Radio,
  Play,
  Square,
  RotateCcw,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Mic2,
  Activity,
  Wifi,
  WifiOff,
  Clock,
  Music2,
  AlertTriangle,
  CheckCircle2,
  Waves,
  Settings,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export default function LiveControlPage() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [inVoiceChat, setInVoiceChat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(85);
  const [backendOnline, setBackendOnline] = useState(true);
  const [pending, setPending] = useState(false);

  const refreshStatus = useCallback(async () => {
    try {
     const res = await fetch("/api/broadcast", { 
  cache: "no-store",
  next: { revalidate: 0 } 
});
      const data = await res.json();
      setBackendOnline(!data.error);
      setIsBroadcasting(!!data.broadcastActive);
      setInVoiceChat(!!data.inVoiceChat);
    } catch {
      setBackendOnline(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    const id = setInterval(refreshStatus, 5000);
    return () => clearInterval(id);
  }, [refreshStatus]);

 const toggleBroadcast = async () => {
  setPending(true);
  try {
    const endpoint = isBroadcasting ? "/api/broadcast" : "/api/broadcast";
    const method = "POST";
    const body = isBroadcasting 
      ? { action: "stop" } 
      : { action: "start", durationMinutes: 60 };

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Failed");
    
    // Refresh immediately
    await refreshStatus();
  } catch (err) {
    alert("Could not reach backend. Is Python backend running?");
  } finally {
    setPending(false);
  }
};
  const stopBroadcast = async () => {
    setPending(true);
    try {
      await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop" }),
      });
    } finally {
      setPending(false);
      refreshStatus();
    }
  };

  return (
    <>
      <TopBar title="Live Control" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {!backendOnline && (
          <div className="bg-amber-50 border border-amber-300 text-amber-800 text-sm rounded-lg px-4 py-3">
            Broadcast backend is unreachable at <code>BACKEND_URL</code>. Start the Python
            backend (<code>python -m app.main</code> in <code>backend/</code>) to enable live
            broadcasting.
          </div>
        )}
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-slate-800">Live Broadcast Control</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Start, stop, and monitor your live prayer broadcast in real-time
          </p>
        </div>

        {/* Big status / hero control */}
        <Card
          className={cn(
            "relative overflow-hidden border-2",
            isBroadcasting
              ? "border-rose-300 bg-gradient-to-br from-rose-50 via-white to-rose-50"
              : "border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50"
          )}
        >
          {isBroadcasting && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-rose-600 text-white px-3 py-1.5 rounded-full text-xs font-bold live-pulse">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              LIVE ON AIR
            </div>
          )}
          <div className="p-8 sm:p-10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Big circular button */}
              <div className="relative">
                <div
                  className={cn(
                    "w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
                    isBroadcasting
                      ? "bg-gradient-to-br from-rose-500 to-red-600"
                      : "bg-gradient-to-br from-[#0d2856] to-[#4a90e2]"
                  )}
                >
                  <button
                    onClick={toggleBroadcast}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-inner transition-transform active:scale-95"
                  >
                    {isBroadcasting ? (
                      <Square
                        className="w-12 h-12 text-rose-600"
                        fill="currentColor"
                      />
                    ) : (
                      <Play
                        className="w-14 h-14 text-[#0d2856] ml-2"
                        fill="currentColor"
                      />
                    )}
                  </button>
                </div>
                {isBroadcasting && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-rose-400/30 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-rose-400/20" style={{ animationDelay: "0.5s" }}></div>
                  </>
                )}
              </div>

              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <StatusBadge status={isBroadcasting ? "running" : "idle"}>
                    {isBroadcasting ? "Broadcasting Live" : "Ready to Broadcast"}
                  </StatusBadge>
                  <StatusBadge status={inVoiceChat ? "connected" : "disconnected"}>
                    {inVoiceChat ? "In Voice Chat" : "Not In VC"}
                  </StatusBadge>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                  {isBroadcasting
                    ? "Prayer Broadcast is LIVE"
                    : "Start Broadcast"}
                </h3>
                <p className="text-slate-500 max-w-lg mb-4">
                  {isBroadcasting
                    ? "Streaming prayer audio to Telegram Voice Chat. The system will automatically stop at the scheduled end time."
                    : "Click the button to manually start the prayer broadcast, or wait for the scheduled time."}
                </p>

                {/* Elapsed time */}
                {isBroadcasting && (
                  <div className="inline-flex items-center gap-2 bg-white border border-rose-200 rounded-lg px-4 py-2 mb-4">
                    <Clock className="w-4 h-4 text-rose-600" />
                    <span className="text-sm font-mono font-bold text-slate-800">
                      Elapsed: 00:23:45
                    </span>
                    <span className="text-slate-400 text-sm">/ 01:00:00</span>
                  </div>
                )}

                {/* Quick action buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {isBroadcasting ? (
                    <>
                      <Button variant="danger" onClick={stopBroadcast}>
                        <Square className="w-4 h-4" />
                        Stop Broadcast
                      </Button>
                      <Button variant="outline">
                        <RotateCcw className="w-4 h-4" />
                        Restart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? (
                          <>
                            <VolumeX className="w-4 h-4" />
                            Unmute
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            Mute
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={toggleBroadcast}>
                        <Play className="w-4 h-4" />
                        Start Broadcast Now
                      </Button>
                      <Button variant="outline">
                        <Activity className="w-4 h-4" />
                        Test Broadcast
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Volume slider when broadcasting */}
            {isBroadcasting && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-4 max-w-md">
                  <Volume2 className="w-5 h-5 text-slate-500" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0d2856]"
                  />
                  <span className="text-sm font-bold text-slate-700 w-10 text-right">
                    {volume}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setInVoiceChat(!inVoiceChat)}
            className={cn(
              "p-5 rounded-xl border-2 transition-all text-left hover:shadow-md group",
              inVoiceChat
                ? "bg-emerald-50 border-emerald-300"
                : "bg-white border-slate-200 hover:border-slate-300"
            )}
          >
            {inVoiceChat ? (
              <Phone className="w-8 h-8 text-emerald-600 mb-2" />
            ) : (
              <Phone className="w-8 h-8 text-slate-400 mb-2 group-hover:text-[#0d2856]" />
            )}
            <div className="font-bold text-sm text-slate-800">
              {inVoiceChat ? "Leave Voice Chat" : "Join Voice Chat"}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {inVoiceChat ? "Currently connected" : "Connect to VC only"}
            </div>
          </button>

          <button className="p-5 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all text-left group">
            <RotateCcw className="w-8 h-8 text-slate-400 mb-2 group-hover:text-[#0d2856]" />
            <div className="font-bold text-sm text-slate-800">Restart Stream</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Reset and restart audio
            </div>
          </button>

          <button className="p-5 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all text-left group">
            <Activity className="w-8 h-8 text-slate-400 mb-2 group-hover:text-[#0d2856]" />
            <div className="font-bold text-sm text-slate-800">Run Test</div>
            <div className="text-xs text-slate-500 mt-0.5">
              30-second test broadcast
            </div>
          </button>

          <button className="p-5 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all text-left group">
            <Settings className="w-8 h-8 text-slate-400 mb-2 group-hover:text-[#0d2856]" />
            <div className="font-bold text-sm text-slate-800">Stream Settings</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Bitrate, quality, etc.
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Now Playing */}
          <Card title="Now Playing" description="Current audio information">
            <div className="p-5">
              <div className="bg-gradient-to-br from-[#0d2856] to-[#4a90e2] rounded-xl p-5 text-white mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center">
                    <Music2 className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                      {isBroadcasting ? "Now Playing" : "Loaded & Ready"}
                    </div>
                    <div className="font-bold truncate">
                      Morning Prayer - Speaking in Tongues
                    </div>
                  </div>
                </div>
                {isBroadcasting && (
                  <>
                    <div className="flex items-end gap-0.5 h-8 mb-2">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-white/80 rounded-full animate-pulse"
                          style={{
                            height: `${20 + Math.abs(Math.sin(Date.now() / 200 + i * 0.4)) * 80}%`,
                            animationDelay: `${i * 50}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-blue-200 font-mono">
                      <span>00:23:45</span>
                      <span>59:00</span>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Format:</span>
                  <span className="font-semibold text-slate-700">MP3, 48kbps mono</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-semibold text-slate-700">59:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sample Rate:</span>
                  <span className="font-semibold text-slate-700">48000 Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">FFmpeg Status:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Connection details */}
          <Card title="Connection Status" description="Telegram & Voice Chat">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  {inVoiceChat ? (
                    <Wifi className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-slate-400" />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Telegram Connection
                    </div>
                    <div className="text-xs text-slate-500">Pyrogram client</div>
                  </div>
                </div>
                <StatusBadge status="connected">Connected</StatusBadge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <Mic2 className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Voice Chat
                    </div>
                    <div className="text-xs text-slate-500">Group call status</div>
                  </div>
                </div>
                <StatusBadge status={inVoiceChat ? "connected" : "disconnected"}>
                  {inVoiceChat ? "Joined" : "Not in VC"}
                </StatusBadge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <Waves className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Audio Stream
                    </div>
                    <div className="text-xs text-slate-500">PyTgCalls media</div>
                  </div>
                </div>
                <StatusBadge status={isBroadcasting ? "running" : "idle"}>
                  {isBroadcasting ? "Streaming" : "Idle"}
                </StatusBadge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Listeners
                    </div>
                    <div className="text-xs text-slate-500">Members in VC</div>
                  </div>
                </div>
                <span className="font-bold text-slate-800">
                  {isBroadcasting ? "24" : "0"}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions / Queue */}
          <Card title="Audio Queue" description="Upcoming tracks (if enabled)">
            <div className="p-5">
              <div className="text-center py-4 text-slate-400">
                <Waves className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">Queue is empty</p>
                <p className="text-xs mt-0.5">
                  Enable rotation to queue multiple audio files
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Music2 className="w-4 h-4" />
                  Add Current to Queue
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <RotateCcw className="w-4 h-4" />
                  Enable Random Rotation
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Ping to Telegram:</span>
                  <span className="font-mono font-semibold text-emerald-600">42ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Stream Bitrate:</span>
                  <span className="font-mono font-semibold text-slate-700">48 kbps</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport:</span>
                  <span className="font-mono font-semibold text-slate-700">UDP/WebRTC</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
