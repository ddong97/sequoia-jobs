import { supabase } from "@/lib/supa";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // ----- read filters -------------------------------------------------
  const q      = searchParams.get("q")    ?? "";
  const role   = searchParams.get("role") ?? "";
  const remote = searchParams.get("remote") === "true";
  const cursor = searchParams.get("cursor");            // ts|id or null

  const LIMIT  = 30;   // rows returned to client
  const WINDOW = 50;   // raw rows scanned each loop

  const collected: any[] = [];
  let currentCursor = cursor;
  let keepGoing     = true;

  while (collected.length < LIMIT && keepGoing) {
    // ---- base query --------------------------------------------------
    let qBuilder = supabase
      .from("jobs")
      .select(`
        id, title, location, role_family, remote,
        apply_url, scraped_at,
        companies ( id, name, logo_url )
      `)
      .order("scraped_at", { ascending: false })
      .order("id",         { ascending: false })
      .limit(WINDOW + 1);

    if (currentCursor) {
      const [ts, id] = currentCursor.split("|");
      qBuilder = qBuilder.or(
        `scraped_at.lt.${ts},and(scraped_at.eq.${ts},id.lt.${id})`
      );
    }

    const { data: raw, error } = await qBuilder;
    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ---- JS-side filters --------------------------------------------
    const filtered = raw.filter((row) =>
      (q      ? row.fts?.includes(q) : true) &&
      (role   ? row.role_family === role : true) &&
      (remote ? row.remote : true)
    );

    collected.push(
      ...filtered.slice(0, LIMIT - collected.length)
    );

    // ---- decide whether to loop again -------------------------------
    keepGoing = raw.length > WINDOW;
    if (keepGoing) {
      const pivot = raw[WINDOW - 1];               // 50-th row
      currentCursor = `${pivot.scraped_at}|${pivot.id}`;
    }
  }

  const nextCursor = keepGoing ? currentCursor : null;
  return NextResponse.json({ jobs: collected, nextCursor });
}
