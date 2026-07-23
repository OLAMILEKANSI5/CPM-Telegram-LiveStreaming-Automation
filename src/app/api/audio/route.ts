const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/audio`, { cache: "no-store" });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ audios: [], error: "backend unreachable" }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const res = await fetch(`${BACKEND_URL}/audio`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { error: "Could not reach broadcast backend. Is it running?" },
      { status: 502 }
    );
  }
}
