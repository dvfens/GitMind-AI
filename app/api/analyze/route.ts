import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "OpenRouter analysis is reserved for Phase 3. This endpoint is intentionally stubbed for now.",
    },
    { status: 501 },
  );
}
