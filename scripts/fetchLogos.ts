// scripts/fetchLogos.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

// ── Supabase client ───────────────────────────────────────
const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Main ──────────────────────────────────────────────────
async function main() {
  const { data: companies, error } = await supa
    .from('companies')
    .select('id, slug, logo_url');

  if (error) throw error;

  for (const c of companies ?? []) {
    if (c.logo_url) continue; // already has a logo

    const url = `https://logo.clearbit.com/${c.slug}.com`;
    const ok  = (await fetch(url, { method: 'HEAD' })).ok;
    if (!ok) continue;       // Clearbit had no match

    await supa
      .from('companies')
      .update({ logo_url: url })
      .eq('id', c.id);

    console.log(`✓ ${c.slug}  →  ${url}`);
  }
}

main().catch(console.error);
