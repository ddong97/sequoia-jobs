import { NextResponse } from 'next/server';
import crawlGreenhouse from '@/scripts/crawlGreenhouse';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await crawlGreenhouse();         // runs your scraper
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
