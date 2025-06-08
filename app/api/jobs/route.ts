import { supabase } from "@/lib/supa";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // ── read query-string values (empty string = “no filter”) ──────────
  const q      = searchParams.get("q")    ?? "";
  const role   = searchParams.get("role") ?? "";
  const remote = searchParams.get("remote") === "true";

  // ── build Supabase query ───────────────────────────────────────────
  let query = supabase
    .from("jobs")
    .select(
  `
    id, title, location, role_family, remote, apply_url, scraped_at,
    companies ( id, name, logo_url )
  `
  )
    .order("scraped_at", { ascending: false })   // newest first
    .limit(300);                                 // crude pagination

  if (q) {
    // Full-text search on the `fts` column we populated earlier
    query = query.textSearch("fts", `${q}:*`, { type: "plain" });
  }

  if (role) {
    query = query.eq("role_family", role);
  }

  if (remote) {
    query = query.eq("remote", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
