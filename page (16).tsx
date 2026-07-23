const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/audio/${id}/default`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { error: "Could not reach broadcast backend. Is it running?" },
      { status: 502 }
    );
  }
}
