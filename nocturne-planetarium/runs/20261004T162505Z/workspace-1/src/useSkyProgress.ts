import { useEffect } from "react";

const WIDE = "(min-width: 960px)";
const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * Writes --sky-p (0 dusk, 1 night) on the root from scroll position.
 * Wide: reaches night when the practical section is half-way up the screen.
 * Narrow: reaches night at the end of the pinned dome.
 * Reduced motion: no listener, the CSS keeps --sky-p at 1.
 */
export function useSkyProgress(pinId: string, endId: string) {
  useEffect(() => {
    const root = document.documentElement;
    const wide = window.matchMedia(WIDE);
    const reduce = window.matchMedia(REDUCE);
    let frame = 0;

    const measure = () => {
      frame = 0;
      let span: number;
      if (wide.matches) {
        const end = document.getElementById(endId);
        span = end ? end.offsetTop - window.innerHeight * 0.5 : 1;
      } else {
        const pin = document.getElementById(pinId);
        span = pin ? pin.offsetTop + pin.offsetHeight - window.innerHeight : 1;
      }
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(span, 1)));
      root.style.setProperty("--sky-p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const attach = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (reduce.matches) {
        root.style.removeProperty("--sky-p");
        return;
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      measure();
    };

    attach();
    reduce.addEventListener("change", attach);
    wide.addEventListener("change", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", attach);
      wide.removeEventListener("change", onScroll);
      root.style.removeProperty("--sky-p");
    };
  }, [pinId, endId]);
}
