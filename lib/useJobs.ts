import useSWRInfinite from "swr/infinite";

type Filters = { q: string; role: string; remote: boolean };

export function useJobs(filters: Filters) {
  const getKey = (pageIndex: number, prev: any) => {
    // stop when there's no nextCursor
    if (prev && !prev.nextCursor) return null;

    const p = new URLSearchParams();
    if (filters.q)      p.set("q",     filters.q);
    if (filters.role)   p.set("role",  filters.role);
    if (filters.remote) p.set("remote","true");
    if (prev?.nextCursor) p.set("cursor", prev.nextCursor);

    return `/api/jobs?${p.toString()}`;
  };

  return useSWRInfinite(getKey, (url) => fetch(url).then(r => r.json()), {
    initialSize: 1,            // first page only
    revalidateAll: false,
  });
}
