import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { formatAmount } from "./data";

const COUNT_EASE = [0.22, 1, 0.36, 1] as const;
const COUNT_DURATION = 0.7;
const DELTA_HOLD_MS = 1600;
const DELTA_FADE_MS = 200;

interface LedgerFigureProps {
  label: string;
  value: number;
  /** Seconds before the count starts, so money leaves one total before it lands in the next. */
  delay?: number;
}

interface Delta {
  key: number;
  amount: number;
}

export default function LedgerFigure({ label, value, delay = 0 }: LedgerFigureProps) {
  const reduceMotion = useReducedMotion();
  const shown = useMotionValue(value);
  const text = useTransform(shown, (latest) => formatAmount(latest));
  const previous = useRef(value);
  const [delta, setDelta] = useState<Delta | null>(null);

  useEffect(() => {
    const change = value - previous.current;
    previous.current = value;
    if (change === 0) return;

    setDelta({ key: Date.now(), amount: change });
    // Counted from the end of the fade-in, so the label is fully readable for the whole hold.
    const hide = window.setTimeout(() => setDelta(null), DELTA_FADE_MS + DELTA_HOLD_MS + (reduceMotion ? 0 : delay * 1000));

    if (reduceMotion) {
      shown.set(value);
      return () => window.clearTimeout(hide);
    }
    const controls = animate(shown, value, { duration: COUNT_DURATION, delay, ease: COUNT_EASE });
    return () => {
      controls.stop();
      window.clearTimeout(hide);
    };
  }, [value, delay, reduceMotion, shown]);

  return (
    <div className="ledger-figure">
      <dt>{label}</dt>
      <motion.dd>{text}</motion.dd>
      <AnimatePresence>
        {delta ? (
          <motion.span
            key={delta.key}
            className={`ledger-delta ${delta.amount > 0 ? "ledger-delta-in" : "ledger-delta-out"}`}
            aria-hidden="true"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: DELTA_FADE_MS / 1000, ease: "easeOut", delay: reduceMotion ? 0 : delay } }}
            exit={{ opacity: 0, transition: { duration: DELTA_FADE_MS / 1000, ease: "easeIn" } }}
          >
            {delta.amount > 0 ? "+" : "−"}
            {formatAmount(Math.abs(delta.amount))}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
