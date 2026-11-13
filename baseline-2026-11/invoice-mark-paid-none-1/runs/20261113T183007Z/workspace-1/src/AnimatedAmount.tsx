import { animate, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";

interface AnimatedAmountProps {
  value: number;
  format: (value: number) => string;
  /** Seconds to wait before counting, so the row reacts first and the total follows. */
  delay?: number;
}

/**
 * Renders a number that counts from its previous value to the new one.
 * Mounts without animating; reduced motion jumps straight to the new value.
 */
export default function AnimatedAmount({ value, format, delay = 0 }: AnimatedAmountProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const reduceMotion = useReducedMotion();

  // The text is owned here rather than by React, so per-frame updates never fight reconciliation.
  useLayoutEffect(() => {
    if (ref.current && !ref.current.textContent) ref.current.textContent = format(shown.current);
  }, [format]);

  useEffect(() => {
    const node = ref.current;
    if (!node || shown.current === value) return;

    if (reduceMotion) {
      shown.current = value;
      node.textContent = format(value);
      return;
    }

    const controls = animate(shown.current, value, {
      duration: 0.7,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        shown.current = latest;
        node.textContent = format(Math.round(latest * 100) / 100);
      },
      onComplete: () => {
        shown.current = value;
        node.textContent = format(value);
      },
    });
    return () => controls.stop();
  }, [value, format, delay, reduceMotion]);

  return <span ref={ref} />;
}
