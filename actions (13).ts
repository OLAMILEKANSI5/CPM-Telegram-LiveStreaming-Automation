const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/audio/${id}/file`, { cache: "no-store" });
    if (!res.ok || !res.body) {
      return Response.json({ error: "Audio file not found" }, { status: res.status || 404 });
    }
    const headers = new Headers();
    const contentType = res.headers.get("content-type");
    const contentDisposition = res.headers.get("content-disposition");
    if (contentType) headers.set("content-type", contentType);
    if (contentDisposition) headers.set("content-disposition", contentDisposition);
    return new Response(res.body, { status: 200, headers });
  } catch {
    return Response.json({ error: "backend unreachable" }, { status: 502 });
  }
}
