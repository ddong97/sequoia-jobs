import { NextResponse } from "next/server";
import { crawlGreenhouse } from "@/scripts/greenhouseCrawl";  // your crawler helper

// Ensure Node.js runtime on Vercel so fetch works
export const runtime = "nodejs";

export async function GET() {
  try {
    await crawlGreenhouse();        // run crawler, upsert jobs
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
