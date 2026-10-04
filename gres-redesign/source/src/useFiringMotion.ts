import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Motion per MASTER.md: scroll-linked spy-hole, one-time reveals. Nothing runs under reduced motion.
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function useFiringMotion() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.classList.add("motion");
      const stagger = parseFloat(getComputedStyle(root).getPropertyValue("--stagger")) || 0;

      // Reveals: once, staggered within each batch. Duration and easing live in CSS tokens.
      ScrollTrigger.batch(".reveal", {
        start: "top 85%",
        once: true,
        onEnter: (batch) =>
          batch.forEach((el, i) => {
            (el as HTMLElement).style.transitionDelay = `${i * stagger}ms`;
            el.classList.add("is-in");
          }),
      });

      // Glaze firing: the spy-hole rises until the band's centre reaches mid-screen.
      const glaze = document.querySelector<HTMLElement>('[data-spyhole="glaze"]');
      if (glaze) {
        gsap.fromTo(
          glaze.querySelector(".spyhole-hot"),
          { opacity: 0 },
          {
            opacity: 1,
            ease: smoothstep,
            scrollTrigger: {
              trigger: glaze.closest(".stage"),
              start: "top 80%",
              end: "center center",
              scrub: true,
            },
          },
        );
      }

      // Cooling: over the whole band, the light fades (1 - t²) and shifts from hot to ember.
      const cooling = document.querySelector<HTMLElement>('[data-spyhole="cooling"]');
      if (cooling) {
        const setHot = gsap.quickSetter(cooling.querySelector(".spyhole-hot"), "opacity");
        const setEmber = gsap.quickSetter(cooling.querySelector(".spyhole-ember"), "opacity");
        const apply = (t: number) => {
          const light = 1 - t * t;
          setHot(light * (1 - t));
          setEmber(light * t);
        };
        ScrollTrigger.create({
          trigger: cooling.closest(".stage"),
          start: "top center",
          end: "bottom bottom",
          onUpdate: (self) => apply(self.progress),
          onRefresh: (self) => apply(self.progress),
        });
      }

      return () => {
        root.classList.remove("motion");
      };
    });

    return () => mm.revert();
  }, []);
}
