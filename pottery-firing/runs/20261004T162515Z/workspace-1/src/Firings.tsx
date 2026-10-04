import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    name: "Drying",
    measure: "About a week",
    text: "Freshly thrown pieces dry slowly, first under plastic, then in the open air, until they are bone dry. Water left in the clay turns to steam in the kiln and can burst a pot.",
  },
  {
    name: "Bisque firing",
    measure: "Around 950 °C",
    text: "The first firing turns dry clay into ceramic for good. The pieces come out hard but still porous, so they can take up the glaze.",
  },
  {
    name: "Glaze firing",
    measure: "Around 1280 °C, in reduction",
    text: "The second firing melts the glaze and vitrifies the stoneware body. Near the top of the firing the kiln is starved of oxygen; this reduction changes how the iron in the clay and the glazes colours.",
  },
  {
    name: "Cooling",
    measure: "Slowly, over about 24 hours",
    text: "The kiln stays shut while it cools. Opening it too early would crack the work with thermal shock.",
  },
];

// Schematic firing curve, one 200-unit segment per stage (not to scale in time).
// y = 220 - temperature / 1280 * 190: ambient ~217, 950 °C at 79, 1280 °C at 30.
const CURVE =
  "M0,217 L200,217 C240,217 270,79 300,79 L320,79 C350,79 370,217 400,217 C450,217 520,30 560,30 L600,30 C640,30 700,200 800,214";
const CURVE_WIDTH = 800;

// Pin only when the reader allows motion and the viewport is tall enough to hold one stage.
const PIN_QUERY = "(prefers-reduced-motion: no-preference) and (min-height: 560px)";
const HANDOVER = 0.2; // share of a stage spent on each text exit and entry

export default function Firings() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const mm = gsap.matchMedia();
    mm.add(PIN_QUERY, () => {
      section.classList.add("is-pinned");
      const items = gsap.utils.toArray<HTMLElement>(".stage", section);

      // The path's x never goes backwards, so a sampled table maps x to drawn length.
      const total = line.getTotalLength();
      const steps = 400;
      const xs = new Float32Array(steps + 1);
      for (let i = 0; i <= steps; i++) xs[i] = line.getPointAtLength((i / steps) * total).x;
      const lengthAtX = (x: number) => {
        let lo = 0;
        let hi = steps;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (xs[mid] < x) lo = mid + 1;
          else hi = mid;
        }
        return (lo / steps) * total;
      };

      line.style.strokeDasharray = `${total}`;
      line.style.strokeDashoffset = `${total}`;
      const head = { x: 0 };

      // Opacity, not autoAlpha: every stage stays in the accessibility tree.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: "+=300%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      tl.to(head, {
        x: CURVE_WIDTH,
        duration: stages.length,
        onUpdate: () => {
          line.style.strokeDashoffset = `${total - lengthAtX(head.x)}`;
        },
      }, 0);
      items.forEach((item, i) => {
        if (i > 0) {
          tl.fromTo(item, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: HANDOVER, ease: "power2.out" }, i);
        }
        if (i < items.length - 1) {
          tl.fromTo(item, { opacity: 1, y: 0 }, { opacity: 0, y: -24, duration: HANDOVER, ease: "power2.in" }, i + 1 - HANDOVER);
        }
      });

      return () => {
        section.classList.remove("is-pinned");
        line.style.strokeDasharray = "";
        line.style.strokeDashoffset = "";
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="firings" aria-labelledby="firings-title">
      <h2 id="firings-title">The four firings</h2>
      <p className="lede">Every piece goes through the same four stages before it leaves the studio.</p>
      <figure className="firing-curve">
        <svg viewBox="0 0 800 240" role="img" aria-labelledby="firing-curve-title">
          <title id="firing-curve-title">
            Firing curve: room temperature while drying, up to about 950 °C for the bisque firing and back down, up to
            about 1280 °C for the glaze firing, then a slow cool.
          </title>
          <path className="firing-curve-track" d={CURVE} />
          <path ref={lineRef} className="firing-curve-line" d={CURVE} />
        </svg>
        <ol className="firing-curve-labels" aria-hidden="true">
          {stages.map((stage) => (
            <li key={stage.name}>{stage.name}</li>
          ))}
        </ol>
      </figure>
      <ol className="stages">
        {stages.map((stage, index) => (
          <li key={stage.name} className="stage">
            <span className="stage-index">{index + 1}</span>
            <h3>{stage.name}</h3>
            <p className="stage-measure">{stage.measure}</p>
            <p>{stage.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
