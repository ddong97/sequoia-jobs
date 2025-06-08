import { NextResponse } from "next/server";
import crawlGreenhouse from "@/scripts/crawlGreenhouse";   // default import

export const runtime = "nodejs";

export async function GET() {
  try {
    await crawlGreenhouse();      // run crawler
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
