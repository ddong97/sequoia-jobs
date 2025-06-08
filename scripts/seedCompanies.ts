import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from "fs";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  const rows: any[] = parse(
    fs.readFileSync("data/sequoia.csv"),
    { columns: true, skip_empty_lines: true }
  );

  const { error } = await supa.from("companies").upsert(rows, {
    onConflict: "slug",
  });
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(`Seeded ${rows.length} companies`);
}
main();
