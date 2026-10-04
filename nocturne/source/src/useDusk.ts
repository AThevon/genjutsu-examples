import { useEffect, type RefObject } from "react";

// Dusk is linear in scroll: 0 at the top, 1 when the closing section's top meets the bottom of
// the viewport (MASTER.md > Motion > Dusk). Written once per frame, never through React state.
// The two ends come from the tokens, --c-dusk and --c-night.
const rgbOf = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.trim().slice(i, i + 2), 16));

export function useDusk(end: RefObject<HTMLElement | null>, apply: (dusk: number) => void) {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const css = getComputedStyle(root);
    const from = rgbOf(css.getPropertyValue("--c-dusk"));
    const to = rgbOf(css.getPropertyValue("--c-night"));
    const ground = (dusk: number) =>
      `rgb(${from.map((v, i) => Math.round(v + (to[i] - v) * dusk)).join(" ")})`;
    let frame = 0;

    const paint = () => {
      frame = 0;
      let dusk = 1;
      if (!reduced.matches && end.current) {
        const stop = end.current.getBoundingClientRect().top + window.scrollY - window.innerHeight;
        dusk = stop > 0 ? Math.min(1, Math.max(0, window.scrollY / stop)) : 1;
      }
      root.style.setProperty("--c-ground", ground(dusk));
      apply(dusk);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, [end, apply]);
}

// Text reveals once: opacity plus an 8px rise, 700ms, 90ms stagger (set in CSS).
export function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    // index.html sets .can-reveal before first paint; without it everything is simply visible.
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
