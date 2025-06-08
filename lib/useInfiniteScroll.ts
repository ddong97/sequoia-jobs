import { useEffect } from "react";

export function useInfiniteScroll(
  ref: React.RefObject<Element>,
  onLoad: () => void,
  canLoad: boolean
) {
  useEffect(() => {
    if (!ref.current || !canLoad) return;

    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onLoad(),
      { rootMargin: "200px", threshold: 0.25 }
    );

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, onLoad, canLoad]);
}
