import { useEffect, type RefObject } from "react";

/**
 * The one motion (MASTER.md, Motion): writes --p (0..1) on the hero from scroll position.
 * Linear to scroll, no duration of its own. Under reduced motion it never listens: CSS
 * shows the full night sky instead.
 */
export function useDimming(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const write = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // Pinned: the whole pinned run. Not pinned: most of the hero's own height.
      const travel = Math.max(rect.height - window.innerHeight, rect.height * 0.6, 1);
      const p = Math.min(1, Math.max(0, -rect.top / travel));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };
    const attach = () => {
      if (reduce.matches) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        el.style.removeProperty("--p");
        return;
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      write();
    };

    attach();
    reduce.addEventListener("change", attach);
    return () => {
      reduce.removeEventListener("change", attach);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}
