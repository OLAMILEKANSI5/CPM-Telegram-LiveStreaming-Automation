const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/status`, { cache: "no-store" });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json(
      { connected: false, inVoiceChat: false, broadcastActive: false, error: "backend unreachable" },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const action = body.action; // "start" | "stop"

  try {
    if (action === "start") {
      const res = await fetch(`${BACKEND_URL}/broadcast/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio_id: body.audioId ?? null,
          duration_minutes: body.durationMinutes ?? 60,
        }),
      });
      const data = await res.json();
      return Response.json(data, { status: res.status });
    }
    if (action === "stop") {
      const res = await fetch(`${BACKEND_URL}/broadcast/stop`, { method: "POST" });
      const data = await res.json();
      return Response.json(data, { status: res.status });
    }
    return Response.json({ error: "unknown action" }, { status: 400 });
  } catch {
    return Response.json({ error: "backend unreachable" }, { status: 502 });
  }
}
