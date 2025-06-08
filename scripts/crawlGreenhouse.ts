import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ----- DEFAULT EXPORT -----
export default async function crawlGreenhouse() {
  const { data } = await supa
    .from("companies")
    .select("id, ats_org")
    .eq("ats", "greenhouse");

  for (const c of data ?? []) {
    try {
      await crawlOrg(c.id, c.ats_org);
      console.log("✓", c.ats_org);
    } catch (err) {
      console.error("✗", c.ats_org, (err as Error).message);
    }
  }
  console.log("Done");
}

// helper to fetch and upsert one company’s jobs
async function crawlOrg(company_id: number, org: string) {
  const res = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${org}/jobs`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status} ${org}`);

  const json: any = await res.json();

  const jobs = json.jobs.map((j: any) => ({
    id: j.id,
    company_id,
    title: j.title,
    location: j.location?.name ?? "",
    role_family:
      j.departments && j.departments.length ? j.departments[0].name : null,
    remote: j.location?.name.includes("Remote") ?? false,
    apply_url: j.absolute_url,
    fts: null,
  }));

  const { error } = await supa.from("jobs").upsert(jobs, {
    onConflict: "id",
  });
  if (error) console.error(error);
}
