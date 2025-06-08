/* eslint-disable @typescript-eslint/no-explicit-any */
// components/JobCard.tsx

import React from 'react';

export default function JobCard({ job }: { job: any }) {
  const company = job.companies;

  return (
    <a
      href={`/apply/${job.id}`}
      className="flex gap-4 rounded-xl border p-4 hover:shadow-sm"
    >
      {/* logo (raw <img> for now) */}
      <div className="shrink-0">
        {company?.logo_url ? (
          <img
            src={company.logo_url}
            width={48}
            height={48}
            style={{ objectFit: 'contain', borderRadius: 6 }}
          />
        ) : (
          <div className="grid h-12 w-12 place-content-center rounded-md bg-zinc-100 text-xs text-zinc-500">
            {company?.name?.[0] ?? '?'}
          </div>
        )}
      </div>

      {/* text */}
      <div className="flex flex-col gap-1">
        <h3 className="font-medium">{job.title}</h3>
        <p className="text-sm text-zinc-500">
          {company?.name} • {job.location || 'Multiple'}
        </p>
        {job.remote && (
          <span className="mt-1 inline-block rounded bg-emerald-600/10 px-2 py-0.5 text-xs font-medium text-emerald-700">
            Remote
          </span>
        )}
      </div>
    </a>
  );
}
