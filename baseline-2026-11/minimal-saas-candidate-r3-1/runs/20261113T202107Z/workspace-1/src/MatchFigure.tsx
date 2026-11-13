import { useState } from "react";
import { flushSync } from "react-dom";

/*
 * Example invoice: illustrative values, labelled as such on the page.
 * Each line is compared with its purchase order and its delivery note.
 * `off` names the value that does not match, so only that value is marked.
 */
type Line = {
  id: string;
  item: string;
  invoice: string;
  order: string;
  delivery: string;
  off?: "invoice" | "delivery";
  result?: string;
};

const LINES: Line[] = [
  { id: "l1", item: "Stretch film 500 mm × 300 m", invoice: "40 × €18.40", order: "40 × €18.40", delivery: "40" },
  {
    id: "l2",
    item: "Carton box 400 × 300 × 300 mm",
    invoice: "600 × €1.35",
    order: "600 × €1.35",
    delivery: "500",
    off: "delivery",
    result: "Wrong quantity: 100 invoiced, not delivered",
  },
  { id: "l3", item: "Packing tape 48 mm, brown", invoice: "120 × €2.10", order: "120 × €2.10", delivery: "120" },
  {
    id: "l4",
    item: "Pallet label roll 100 × 150 mm",
    invoice: "30 × €9.80",
    order: "30 × €8.90",
    delivery: "30",
    off: "invoice",
    result: "Wrong unit price: €0.90 above the order",
  },
  { id: "l5", item: "Edge protector 35 mm", invoice: "200 × €0.62", order: "200 × €0.62", delivery: "200" },
  {
    id: "l6",
    item: "Bubble wrap 1 m × 100 m",
    invoice: "10 × €27.50",
    order: "10 × €27.50",
    delivery: "None received",
    off: "delivery",
    result: "Never delivered: no delivery note",
  },
  { id: "l7", item: "Strapping band 12 mm", invoice: "15 × €24.50", order: "15 × €24.50", delivery: "15" },
];

const EXCEPTIONS = LINES.filter((l) => l.result).length;
const MATCHED = LINES.length - EXCEPTIONS;

type View = "all" | "review";

export default function MatchFigure() {
  const [view, setView] = useState<View>("all");
  const shown = view === "all" ? LINES : LINES.filter((l) => l.result);

  function choose(next: View) {
    if (next === view) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const apply = () => flushSync(() => setView(next));
    // The one motion: matched lines leave, the exceptions close up. Native View Transitions;
    // without support or with reduced motion the switch is instant.
    const doc = document as Document & { startViewTransition?: (update: () => void) => unknown };
    if (!reduce && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <figure className="match-figure" aria-labelledby="match-title">
      <div className="match-head">
        <div>
          <h2 id="match-title">One supplier invoice, checked three ways</h2>
          <p>Example invoice from a packaging supplier. The values are illustrative.</p>
        </div>
        <div className="seg" role="group" aria-label="Lines shown">
          <button type="button" aria-pressed={view === "all"} onClick={() => choose("all")}>
            All {LINES.length} lines
          </button>
          <button type="button" aria-pressed={view === "review"} onClick={() => choose("review")}>
            What your team reviews ({EXCEPTIONS})
          </button>
        </div>
      </div>

      <table className="match" role="table">
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">Invoice line</th>
            <th scope="col" role="columnheader" className="num">Invoiced</th>
            <th scope="col" role="columnheader" className="num">Purchase order</th>
            <th scope="col" role="columnheader" className="num">Delivery note</th>
            <th scope="col" role="columnheader">Result</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {shown.map((l) => (
            <tr
              key={l.id}
              role="row"
              className={l.result ? "is-exception" : undefined}
              style={{ viewTransitionName: `line-${l.id}` }}
            >
              <th scope="row" role="rowheader">{l.item}</th>
              <td role="cell" className={l.off === "invoice" ? "num off" : "num"} data-label="Invoiced">
                {l.invoice}
              </td>
              <td role="cell" className="num" data-label="Purchase order">
                {l.order}
              </td>
              <td role="cell" className={l.off === "delivery" ? "num off" : "num"} data-label="Delivery note">
                {l.delivery}
              </td>
              <td role="cell" className={l.result ? "result off" : "result ok"}>
                {l.result ?? (
                  <>
                    <span className="tick" aria-hidden="true">✓</span>Matches
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="match-foot" aria-live="polite" style={{ viewTransitionName: "match-foot" }}>
        {view === "all"
          ? `${MATCHED} of ${LINES.length} lines match their order and delivery note and need nothing from anyone. The ${EXCEPTIONS} that don't are the only lines a person sees.`
          : `${MATCHED} matched lines are hidden. These ${EXCEPTIONS} are what your team reviews. An invoice where every line matches goes straight to payment approval.`}
      </p>
    </figure>
  );
}
