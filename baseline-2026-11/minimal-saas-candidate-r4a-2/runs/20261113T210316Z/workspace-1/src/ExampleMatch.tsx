import { useEffect, useRef, useState } from "react";

/*
 * The first screen's one thing: an example three-way match.
 * Every quantity and price below is an illustrative example value, labelled as such on the page.
 * None of it is customer data, and none of it is a claim about the product.
 */

type Line = {
  item: string;
  ordered: { qty: number; price: string };
  delivered: number | null;
  invoiced: { qty: number; price: string };
  issue: null | "price" | "quantity" | "missing";
};

const LINES: Line[] = [
  { item: "Sunflower oil, 10 L", ordered: { qty: 40, price: "18.20" }, delivered: 40, invoiced: { qty: 40, price: "18.20" }, issue: null },
  { item: "Basmati rice, 5 kg", ordered: { qty: 60, price: "7.85" }, delivered: 60, invoiced: { qty: 60, price: "8.15" }, issue: "price" },
  { item: "Olive oil, 5 L", ordered: { qty: 24, price: "31.50" }, delivered: 24, invoiced: { qty: 24, price: "31.50" }, issue: null },
  { item: "Chopped tomatoes, case of 12", ordered: { qty: 120, price: "9.40" }, delivered: 108, invoiced: { qty: 120, price: "9.40" }, issue: "quantity" },
  { item: "Chickpeas, case of 12", ordered: { qty: 36, price: "11.60" }, delivered: 36, invoiced: { qty: 36, price: "11.60" }, issue: null },
  { item: "Dried pasta, case of 20", ordered: { qty: 50, price: "14.90" }, delivered: null, invoiced: { qty: 50, price: "14.90" }, issue: "missing" },
];

const REASON: Record<NonNullable<Line["issue"]>, string> = {
  price: "Unit price differs from the order",
  quantity: "Invoiced more than was delivered",
  missing: "Invoiced, never delivered",
};

const exceptions = LINES.filter((l) => l.issue !== null).length;
const matched = LINES.length - exceptions;

/* shown -> leaving (fade out) -> hidden -> entering (fade in) -> shown */
type Phase = "shown" | "leaving" | "hidden" | "entering";

function readDuration(): number {
  // The duration lives in tokens.css; under reduced motion the token is 0ms.
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--dur-base");
  const ms = parseFloat(raw);
  return Number.isFinite(ms) ? ms : 0;
}

export default function ExampleMatch() {
  const [phase, setPhase] = useState<Phase>("shown");
  const timer = useRef<number | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const onlyExceptions = phase === "leaving" || phase === "hidden";

  function toggle() {
    window.clearTimeout(timer.current);
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);

    if (!onlyExceptions) {
      setPhase("leaving");
      timer.current = window.setTimeout(() => setPhase("hidden"), readDuration());
    } else {
      // Mount the rows at opacity 0, then release them on the next frame so the fade runs.
      setPhase("entering");
      frame.current = requestAnimationFrame(() => {
        frame.current = requestAnimationFrame(() => setPhase("shown"));
      });
    }
  }

  return (
    <figure className="match" aria-labelledby="match-title">
      <div className="match__head">
        <figcaption>
          <span id="match-title" className="match__title">
            Example invoice from a food supplier
          </span>
          <span className="match__note">
            Illustrative values, not customer data. Prices in EUR.
          </span>
        </figcaption>
        <button
          type="button"
          className="toggle"
          aria-pressed={onlyExceptions}
          aria-controls="match-table"
          onClick={toggle}
        >
          {onlyExceptions ? "Show all lines" : "Hide matched lines"}
        </button>
      </div>

      <table id="match-table" className="match__table">
        <thead>
          <tr>
            <th scope="col">Line</th>
            <th scope="col">Purchase order</th>
            <th scope="col">Delivery note</th>
            <th scope="col">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {LINES.map((line) => {
            const isMatch = line.issue === null;
            const faded = isMatch && (phase === "leaving" || phase === "entering");
            const gone = isMatch && phase === "hidden";
            const rowClass = [
              "match__row",
              isMatch ? "is-matched" : "is-exception",
              faded ? "is-faded" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <tr key={line.item} className={rowClass} hidden={gone}>
                <th scope="row">
                  <span className="match__item">{line.item}</span>
                  <span className="match__reason">
                    {line.issue ? REASON[line.issue] : "Matched"}
                  </span>
                </th>
                <td data-label="Order">
                  {line.ordered.qty} × {line.ordered.price}
                </td>
                <td data-label="Delivered">
                  {line.delivered === null ? (
                    <span className="bad">None</span>
                  ) : (
                    line.delivered
                  )}
                </td>
                <td data-label="Invoice">
                  <span className={line.issue === "quantity" ? "bad" : undefined}>
                    {line.invoiced.qty}
                  </span>
                  {" × "}
                  <span className={line.issue === "price" ? "bad" : undefined}>
                    {line.invoiced.price}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="match__status" aria-live="polite">
        {onlyExceptions
          ? `${matched} matched lines hidden. These ${exceptions} need a person.`
          : `${exceptions} of ${LINES.length} lines need a person. The ${matched} matched lines need nothing from you.`}
      </p>
    </figure>
  );
}
