/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import JobCard from "@/components/JobCard";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function Home() {
  /* ────────────────────  local UI state  ──────────────────── */
  const [q,     setQ]      = useState("");
  const [role,  setRole]   = useState("");
  const [remote,setRemote] = useState(false);

  /* ───────── build API URL whenever any filter changes ─────── */
  const api = useMemo(() => {
    const p = new URLSearchParams();
    if (q)      p.set("q", q);
    if (role)   p.set("role", role);
    if (remote) p.set("remote", "true");
    return `/api/jobs?${p.toString()}`;
  }, [q, role, remote]);

  /* ────────────────  fetch data with SWR hook  ─────────────── */
  const { data } = useSWR(api, fetcher);

  /* ──────────────────  render UI  ───────────────────────────── */
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      {/* ────────────── Filters ────────────── */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          className="border rounded p-2 flex-1 min-w-[180px]"
          placeholder="Search title or location…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        <select
          className="border rounded p-2"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="">All roles</option>
          <option value="engineering">Engineering</option>
          <option value="design">Design</option>
          <option value="product">Product</option>
          <option value="sales">Sales</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remote}
            onChange={e => setRemote(e.target.checked)}
          />
          Remote only
        </label>
      </div>

      {/* ────────────── Results ────────────── */}
      {!data ? (
        <p>Loading…</p>
      ) : data.length === 0 ? (
        <p>No jobs match these filters.</p>
      ) : (
        data.map((job: any) => (
          <JobCard key={job.id} job={job} />
        ))
      )}
    </main>
  );
}
