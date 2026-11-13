import { useEffect, useState } from "react";

type Line = {
  item: string;
  invoiced: number;
  ordered: number;
  delivered: number | null;
  price: string;
  orderPrice: string;
  issue?: { field: "delivered" | "price"; reason: string };
};

// Illustrative example only. Not customer data.
const LINES: Line[] = [
  { item: "Hex bolt M8 × 40, box of 100", invoiced: 40, ordered: 40, delivered: 40, price: "12.40", orderPrice: "12.40" },
  { item: "Washer M8, box of 200", invoiced: 25, ordered: 25, delivered: 25, price: "6.10", orderPrice: "6.10" },
  {
    item: "Hex nut M8, box of 100",
    invoiced: 60,
    ordered: 60,
    delivered: 48,
    price: "7.30",
    orderPrice: "7.30",
    issue: { field: "delivered", reason: "12 boxes invoiced but not delivered" },
  },
  {
    item: "Threaded rod M8, 1 m",
    invoiced: 120,
    ordered: 120,
    delivered: 120,
    price: "2.95",
    orderPrice: "2.45",
    issue: { field: "price", reason: "Unit price 0.50 above the order" },
  },
  { item: "Concrete anchor M8, box of 50", invoiced: 10, ordered: 10, delivered: 10, price: "18.90", orderPrice: "18.90" },
  {
    item: "Wall plug 8 mm, box of 100",
    invoiced: 20,
    ordered: 20,
    delivered: null,
    price: "4.20",
    orderPrice: "4.20",
    issue: { field: "delivered", reason: "No delivery note for this line" },
  },
  { item: "Cable tie 300 mm, bag of 100", invoiced: 30, ordered: 30, delivered: 30, price: "3.60", orderPrice: "3.60" },
];

const exceptionCount = LINES.filter((l) => l.issue).length;
const matchedCount = LINES.length - exceptionCount;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function MatchExample() {
  const [exceptionsOnly, setExceptionsOnly] = useState(prefersReducedMotion);
  const [touched, setTouched] = useState(false);

  // The page's single unprompted motion: matched lines fold away once.
  useEffect(() => {
    if (touched || exceptionsOnly) return;
    const t = window.setTimeout(() => setExceptionsOnly(true), 1600);
    return () => window.clearTimeout(t);
  }, [touched, exceptionsOnly]);

  const toggle = () => {
    setTouched(true);
    setExceptionsOnly((v) => !v);
  };

  return (
    <figure className="example" aria-labelledby="example-caption">
      <figcaption id="example-caption" className="example-caption">
        Example: one supplier invoice, checked line by line against its purchase order and delivery note.
      </figcaption>

      <div className="match" role="table" aria-describedby="example-status">
        <div className="match-head" role="rowgroup">
          <div className="match-cells" role="row">
            <span role="columnheader">Item</span>
            <span role="columnheader" className="num">Invoiced</span>
            <span role="columnheader" className="num">Ordered</span>
            <span role="columnheader" className="num">Delivered</span>
            <span role="columnheader" className="num">Unit price</span>
            <span role="columnheader" className="num">Order price</span>
            <span role="columnheader">Result</span>
          </div>
        </div>
        <div role="rowgroup">
          {LINES.map((line, i) => {
            const hidden = exceptionsOnly && !line.issue;
            const bad = (f: "delivered" | "price") => (line.issue?.field === f ? " is-off" : "");
            return (
              <div
                key={line.item}
                className={`match-line${line.issue ? " is-exception" : " is-matched"}${hidden ? " is-hidden" : ""}`}
                style={{ transitionDelay: hidden ? `${i * 40}ms` : "0ms" }}
                aria-hidden={hidden || undefined}
              >
                <div className="match-clip">
                  <div className="match-cells" role="row">
                    <span role="cell" className="item">{line.item}</span>
                    <span role="cell" className="num" data-label="Invoiced">{line.invoiced}</span>
                    <span role="cell" className="num" data-label="Ordered">{line.ordered}</span>
                    <span role="cell" className={`num${bad("delivered")}`} data-label="Delivered">
                      {line.delivered ?? "None"}
                    </span>
                    <span role="cell" className={`num${bad("price")}`} data-label="Unit price">{line.price}</span>
                    <span role="cell" className="num" data-label="Order price">{line.orderPrice}</span>
                    <span role="cell" className="result">{line.issue ? line.issue.reason : "Matched"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="example-foot">
        <p id="example-status" className="example-status" aria-live="polite">
          {exceptionsOnly
            ? `${matchedCount} lines matched and are hidden. ${exceptionCount} lines need a person.`
            : `Showing all ${LINES.length} lines.`}
        </p>
        <button type="button" className="text-button" onClick={toggle} aria-pressed={!exceptionsOnly}>
          {exceptionsOnly ? `Show all ${LINES.length} lines` : `Show only the ${exceptionCount} that need a person`}
        </button>
      </div>
    </figure>
  );
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="wordmark" href="/">Ploverdesk</a>
          <nav aria-label="Primary" className="header-nav">
            <a className="quiet-link" href="/demo">Book a demo</a>
            <a className="button button-small" href="/trial">Start free trial</a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <h1 id="hero-title">Only the invoice lines that don’t match reach your desk.</h1>
          <p className="lede">
            Ploverdesk reads the supplier invoices that arrive by email as PDF and checks every line against the
            purchase order and the delivery note. Your team sees only what is wrong: a quantity, a unit price, a
            delivery that never arrived. Invoices that match go straight to payment approval.
          </p>
          <div className="actions">
            <a className="button" href="/trial">Start 14-day trial</a>
            <p className="actions-note">
              No credit card needed. Or <a href="/demo">book a demo</a>.
            </p>
          </div>

          <MatchExample />
        </section>

        <section className="section wrap" aria-labelledby="flow-title">
          <h2 id="flow-title">From inbox to payment approval</h2>
          <ol className="flow">
            <li>
              <h3>Invoices arrive</h3>
              <p>Suppliers keep sending PDF invoices by email, as they do now. Ploverdesk reads each one, line by line.</p>
            </li>
            <li>
              <h3>Every line is matched</h3>
              <p>Each line is checked against its purchase order and delivery note: quantity, unit price, and whether the goods arrived.</p>
            </li>
            <li>
              <h3>A person reviews the exceptions</h3>
              <p>Lines that don’t match are shown with the reason next to them. Nothing else asks for your attention.</p>
            </li>
            <li>
              <h3>Matched invoices move on</h3>
              <p>They go straight to payment approval, then to your accounting system as a CSV file or through the API.</p>
            </li>
          </ol>
        </section>

        <section className="section wrap" aria-labelledby="details-title">
          <h2 id="details-title">The practical details</h2>
          <dl className="details">
            <div>
              <dt>Built for</dt>
              <dd>Finance teams at mid-size wholesalers. Sold to companies, not individuals.</dd>
            </div>
            <div>
              <dt>Accounting export</dt>
              <dd>Matched invoices are exported as a CSV file or through an API.</dd>
            </div>
            <div>
              <dt>Where your data lives</dt>
              <dd>Hosted in Frankfurt, in the EU.</dd>
            </div>
            <div>
              <dt>Users</dt>
              <dd>No limit. Everyone on the finance team can have an account.</dd>
            </div>
          </dl>
        </section>

        <section className="section wrap pricing" aria-labelledby="price-title">
          <h2 id="price-title" className="price">290 EUR per month, per company.</h2>
          <p>No limit on users. Try it for 14 days on your own invoices, without a credit card.</p>
          <div className="actions">
            <a className="button" href="/trial">Start 14-day trial</a>
          </div>
        </section>

        <section className="section wrap" aria-labelledby="about-title">
          <h2 id="about-title">Who makes it</h2>
          <p className="prose">
            Ploverdesk is six people in Rotterdam. We started in 2025, so we have no list of customers to show you yet.
            The fairest test is your own invoices: run them through the trial for 14 days. If you would rather see it
            with one of us first, <a href="/demo">book a demo</a>.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <span>Ploverdesk, Rotterdam</span>
          <span>Data hosted in Frankfurt, EU</span>
        </div>
      </footer>
    </>
  );
}
