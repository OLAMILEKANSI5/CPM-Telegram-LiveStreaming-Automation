// New file: src/app/api/schedules/route.ts
import { getDb } from "@/db";
import { schedules } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  // ... fetch logic ...
}

export async function POST(req: Request) {
  // Toggle enabled, create, etc.
  const { id, enabled } = await req.json();
  // Update DB
}
