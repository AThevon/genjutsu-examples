import { useEffect, useState, type CSSProperties } from "react";

/** First run of the one motion, after mount. MASTER.md > Motion. */
const FIRST_RUN_DELAY_MS = 600;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const row = (index: number) => ({ "--row": index }) as CSSProperties;

function Tick() {
  return (
    <svg className="tick" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <path d="M2 7.5 5.5 11 12 3" />
    </svg>
  );
}

function Matched() {
  return (
    <>
      <Tick />
      Matched
    </>
  );
}

export default function MatchExample() {
  const [after, setAfter] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setAfter(true);
      return;
    }
    const id = window.setTimeout(() => setAfter(true), FIRST_RUN_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <figure className={after ? "example is-after" : "example"} aria-labelledby="example-title">
      <div className="example-head">
        <div>
          <p id="example-title">One supplier invoice, matched three ways</p>
          <p className="small">
            Illustrative example, not customer data. Quantities and unit prices in EUR.
          </p>
        </div>
        <button
          type="button"
          className="button button--quiet"
          aria-controls="example-lines"
          onClick={() => setAfter((value) => !value)}
        >
          {after ? "Show before matching" : "Show after matching"}
        </button>
      </div>

      <div
        id="example-lines"
        className="scroller"
        role="region"
        aria-label="Example invoice lines"
        tabIndex={0}
      >
        <table className="match">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col" className="num">
                Invoiced
              </th>
              <th scope="col" className="num">
                Purchase order
              </th>
              <th scope="col" className="num">
                Delivery note
              </th>
              <th scope="col">Result</th>
            </tr>
          </thead>
          <tbody>
            <tr className="row--matched" style={row(0)}>
              <th scope="row">Hinge, steel, 80 mm</th>
              <td className="num">200 × 1.40</td>
              <td className="num">200 × 1.40</td>
              <td className="num">200</td>
              <td className="result">
                <Matched />
              </td>
            </tr>
            <tr className="row--matched" style={row(1)}>
              <th scope="row">Wood screws 4 × 40, box</th>
              <td className="num">50 × 6.20</td>
              <td className="num">50 × 6.20</td>
              <td className="num">50</td>
              <td className="result">
                <Matched />
              </td>
            </tr>
            <tr className="row--exception" style={row(2)}>
              <th scope="row">Cabinet handle, brushed</th>
              <td className="num">40 × 3.85</td>
              <td className="num">40 × 3.85</td>
              <td className="num">
                <span className="mark">
                  36
                  <svg className="ring" aria-hidden="true" focusable="false">
                    <ellipse cx="50%" cy="50%" rx="48%" ry="46%" pathLength={1} />
                  </svg>
                </span>
              </td>
              <td className="result">40 invoiced, 36 delivered</td>
            </tr>
            <tr className="row--matched" style={row(3)}>
              <th scope="row">Drawer runner, 450 mm</th>
              <td className="num">30 × 9.10</td>
              <td className="num">30 × 9.10</td>
              <td className="num">30</td>
              <td className="result">
                <Matched />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="example-status small" aria-live="polite">
        {after
          ? "After matching: three lines matched, one goes to a person."
          : "Before matching: four lines, unchecked."}
      </p>
    </figure>
  );
}
