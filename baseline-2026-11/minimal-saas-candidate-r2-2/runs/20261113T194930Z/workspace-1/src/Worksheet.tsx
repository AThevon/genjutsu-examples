import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

/*
 * The one motion (MASTER.md, interaction thesis): "Show exceptions only" fades the
 * matched lines out (--dur-normal), then the exception line slides into its new
 * place (FLIP, transform only, --dur-settle). Reduced motion: instant switch.
 *
 * Illustrative example, labelled as such on the page. The brief allows no invented
 * figure, so the worksheet shows the checks themselves (agrees / differs), no
 * quantities or prices.
 */

type Check = "agrees" | "differs";

type Line = {
  item: string;
  poQuantity: Check;
  poPrice: Check;
  delivery: Check;
  finding?: string;
};

const LINES: Line[] = [
  { item: "Stretch film", poQuantity: "agrees", poPrice: "agrees", delivery: "agrees" },
  { item: "Corrugated boxes", poQuantity: "agrees", poPrice: "agrees", delivery: "agrees" },
  {
    item: "Packing tape",
    poQuantity: "agrees",
    poPrice: "agrees",
    delivery: "differs",
    finding: "Fewer units delivered than invoiced",
  },
  { item: "Pallet labels", poQuantity: "agrees", poPrice: "agrees", delivery: "agrees" },
  { item: "Strapping band", poQuantity: "agrees", poPrice: "agrees", delivery: "agrees" },
  { item: "Edge protectors", poQuantity: "agrees", poPrice: "agrees", delivery: "agrees" },
];

const isMatched = (l: Line) => l.poQuantity === "agrees" && l.poPrice === "agrees" && l.delivery === "agrees";

const matchedCount = LINES.filter(isMatched).length;

type Phase = "all" | "fading" | "only" | "returning";

function readToken(token: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

function readMs(token: string): number {
  const n = parseFloat(readToken(token));
  return Number.isFinite(n) ? n : 0;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Tick() {
  return (
    <svg className="mark mark--tick" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <polyline points="3,8.5 6.5,12 13,4.5" />
    </svg>
  );
}

function ExceptionMark() {
  return (
    <svg className="mark mark--exception" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <circle cx="9" cy="9" r="7.75" />
      <line x1="9" y1="5" x2="9" y2="10" />
      <circle className="mark-dot" cx="9" cy="12.75" r="0.9" />
    </svg>
  );
}

function CheckCell({ value, label }: { value: Check; label: string }) {
  return (
    <td role="cell" className={value === "differs" ? "ws-check is-off" : "ws-check"} data-label={label}>
      <span className="ws-check-inner">
        {value === "agrees" ? <Tick /> : <ExceptionMark />}
        <span className={value === "agrees" ? "visually-hidden" : undefined}>
          {value === "agrees" ? "Agrees" : "Differs"}
        </span>
      </span>
    </td>
  );
}

export default function Worksheet() {
  const [phase, setPhase] = useState<Phase>("all");
  const excRef = useRef<HTMLTableRowElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onlyExceptions = phase === "fading" || phase === "only";

  const exceptionTop = () => excRef.current?.getBoundingClientRect().top ?? 0;

  const flip = (before: number) => {
    const el = excRef.current;
    if (!el) return;
    const dy = before - exceptionTop();
    if (dy === 0) return;
    el.animate([{ transform: `translateY(${dy}px)` }, { transform: "translateY(0)" }], {
      duration: readMs("--dur-settle"),
      easing: readToken("--ease-out") || "linear",
    });
  };

  const showOnly = () => {
    window.clearTimeout(timer.current);
    if (prefersReducedMotion()) {
      setPhase("only");
      return;
    }
    // Sequencing only: wait for the CSS fade (--dur-normal), then collapse and FLIP.
    setPhase("fading");
    timer.current = window.setTimeout(() => {
      const before = exceptionTop();
      flushSync(() => setPhase("only"));
      flip(before);
    }, readMs("--dur-normal"));
  };

  const showAll = () => {
    window.clearTimeout(timer.current);
    if (prefersReducedMotion() || phase === "fading") {
      setPhase("all");
      return;
    }
    const before = exceptionTop();
    // "returning": matched rows are shown again and fade in from @starting-style,
    // the summary line fades out; it unmounts once that fade is over.
    flushSync(() => setPhase("returning"));
    flip(before);
    timer.current = window.setTimeout(() => {
      setPhase((p) => (p === "returning" ? "all" : p));
    }, readMs("--dur-normal"));
  };

  return (
    <figure className="ws" data-phase={phase} aria-labelledby="ws-title">
      <div className="ws-head">
        <div>
          <p className="ws-title" id="ws-title">
            One supplier invoice, checked line by line
          </p>
          <p className="ws-note">Illustrative example, not customer data.</p>
        </div>
        <button
          type="button"
          className="btn btn-quiet ws-toggle"
          aria-pressed={onlyExceptions}
          aria-controls="ws-table"
          onClick={onlyExceptions ? showAll : showOnly}
        >
          Show exceptions only
        </button>
      </div>

      <table className="ws-table" id="ws-table" role="table">
        <caption className="visually-hidden">
          Each invoice line checked against the purchase order and the delivery note
        </caption>
        <thead role="rowgroup">
          <tr role="row">
            <th role="columnheader" scope="col">Invoice line</th>
            <th role="columnheader" scope="col">Quantity on the PO</th>
            <th role="columnheader" scope="col">Unit price on the PO</th>
            <th role="columnheader" scope="col">Delivery note</th>
            <th role="columnheader" scope="col">Result</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {LINES.map((l) => {
            const matched = isMatched(l);
            return (
              <tr
                role="row"
                key={l.item}
                ref={matched ? undefined : excRef}
                className={matched ? "ws-row ws-row--matched" : "ws-row ws-row--exception"}
                hidden={matched && phase === "only"}
              >
                <td role="cell" className="ws-item">
                  {l.item}
                </td>
                <CheckCell value={l.poQuantity} label="PO quantity" />
                <CheckCell value={l.poPrice} label="PO price" />
                <CheckCell value={l.delivery} label="Delivery" />
                <td role="cell" className="ws-result">
                  {matched ? "Matched" : l.finding}
                </td>
              </tr>
            );
          })}
          {(phase === "only" || phase === "returning") && (
            <tr className="ws-summary" role="row">
              <td role="cell" colSpan={5}>
                {matchedCount} matched lines hidden. This invoice waits for a person on one line only.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="visually-hidden" aria-live="polite">
        {phase === "only" ? "Showing the one line that does not match." : ""}
      </p>
    </figure>
  );
}
