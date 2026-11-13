import { useState } from "react";

type Line = {
  item: string;
  ordered: string;
  delivered: string;
  invoiced: string;
  /** Which cell differs, if any */
  flag?: "ordered" | "delivered" | "invoiced";
  reason?: string;
};

// Illustrative example only. These are not customer data or product claims.
const lines: Line[] = [
  { item: "Hinge, 80 mm", ordered: "120 × 1.95", delivered: "120", invoiced: "120 × 1.95" },
  {
    item: "Cabinet handle, 128 mm",
    ordered: "200 × 3.40",
    delivered: "200",
    invoiced: "200 × 3.65",
    flag: "invoiced",
    reason: "Unit price is higher than on the order",
  },
  { item: "Wood screw 4 × 40, box", ordered: "30 × 8.90", delivered: "30", invoiced: "30 × 8.90" },
  {
    item: "Drawer runner, 450 mm",
    ordered: "60 × 6.20",
    delivered: "48",
    invoiced: "60 × 6.20",
    flag: "delivered",
    reason: "Invoiced 60, delivered 48",
  },
  { item: "Wall plug 8 mm, box", ordered: "50 × 4.10", delivered: "50", invoiced: "50 × 4.10" },
  {
    item: "Shelf bracket, 200 mm",
    ordered: "40 × 2.15",
    delivered: "Not delivered",
    invoiced: "40 × 2.15",
    flag: "delivered",
    reason: "No delivery note for this line",
  },
  { item: "Hinge mounting plate", ordered: "120 × 0.85", delivered: "120", invoiced: "120 × 0.85" },
  { item: "Soft-close damper", ordered: "80 × 1.30", delivered: "80", invoiced: "80 × 1.30" },
];

const flagged = lines.filter((l) => l.flag).length;

function Cell({ line, col, label }: { line: Line; col: "ordered" | "delivered" | "invoiced"; label: string }) {
  const off = line.flag === col;
  return (
    <td data-label={label} className={off ? "num is-off" : "num"}>
      {line[col]}
    </td>
  );
}

function MatchExample() {
  const [onlyMismatches, setOnlyMismatches] = useState(false);

  return (
    <figure className="sheet" aria-labelledby="sheet-title">
      <div className="sheet-head">
        <div>
          <p id="sheet-title" className="sheet-title">
            Example: an invoice from a hardware supplier, after matching
          </p>
          <p className="sheet-sub">
            {lines.length - flagged} of {lines.length} lines match. {flagged} need a person.
          </p>
        </div>
        <button
          type="button"
          className="toggle"
          aria-pressed={onlyMismatches}
          onClick={() => setOnlyMismatches((v) => !v)}
        >
          {onlyMismatches ? "Show all lines" : "Show only mismatches"}
        </button>
      </div>

      <table className={onlyMismatches ? "match only-off" : "match"}>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col" className="num">Purchase order</th>
            <th scope="col" className="num">Delivery note</th>
            <th scope="col" className="num">Invoice</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.item} className={line.flag ? "row-off" : "row-ok"}>
              <th scope="row">{line.item}</th>
              <Cell line={line} col="ordered" label="Purchase order" />
              <Cell line={line} col="delivered" label="Delivery note" />
              <Cell line={line} col="invoiced" label="Invoice" />
              <td className="result" data-label="Result">
                {line.reason ?? "Matches"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="sheet-note">
        Quantities × unit price in EUR. Example data, for illustration.
      </figcaption>
    </figure>
  );
}

const steps = [
  {
    title: "An invoice arrives",
    body: "A supplier emails a PDF invoice. Ploverdesk reads it line by line.",
  },
  {
    title: "Every line is matched",
    body: "Each line is checked against the purchase order and the delivery note: the quantity, the unit price, and whether the goods arrived.",
  },
  {
    title: "Matches go to approval, the rest to a person",
    body: "If every line matches, the invoice goes straight to payment approval. If not, your team sees only the lines that differ, with the reason next to each one.",
  },
  {
    title: "Matched invoices go to accounting",
    body: "They are exported to your accounting system as a CSV file or through the API.",
  },
];

export default function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="bar wrap">
        <a className="wordmark" href="/" aria-label="Ploverdesk home">
          Ploverdesk
        </a>
        <nav className="bar-nav" aria-label="Primary">
          <a className="quiet" href="/demo">
            Book a demo
          </a>
          <a className="btn btn-small" href="/trial">
            Start free trial
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <h1 id="hero-title">Your team checks only the invoice lines that don't match.</h1>
          <p className="lead">
            Ploverdesk reads the supplier invoices that arrive by email as PDF and matches every
            line against the purchase order and the delivery note. Invoices that match go straight
            to payment approval. Your team sees the rest: a wrong quantity, a wrong unit price, a
            delivery that never arrived.
          </p>
          <div className="actions">
            <a className="btn" href="/trial">
              Start free trial
            </a>
            <p className="actions-note">
              14 days, no credit card needed. Or <a href="/demo">book a demo</a>.
            </p>
          </div>
        </section>

        <section className="wrap wide" aria-label="Example of a matched invoice">
          <MatchExample />
        </section>

        <section className="wrap block" aria-labelledby="how-title">
          <h2 id="how-title">How it works</h2>
          <ol className="steps">
            {steps.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="wrap block" aria-labelledby="details-title">
          <h2 id="details-title">The details</h2>
          <dl className="facts">
            <div>
              <dt>Where your data is kept</dt>
              <dd>Hosted in Frankfurt, in the EU.</dd>
            </div>
            <div>
              <dt>Accounting system</dt>
              <dd>Matched invoices are exported as a CSV file or through an API.</dd>
            </div>
            <div>
              <dt>Users</dt>
              <dd>No limit. Everyone who reviews or approves invoices can have an account.</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>290 EUR per month, per company.</dd>
            </div>
          </dl>
        </section>

        <section className="wrap block close" aria-labelledby="trial-title">
          <h2 id="trial-title">Try it on your own invoices for 14 days</h2>
          <p>
            No credit card needed. After the trial, Ploverdesk costs 290 EUR per month for your
            whole company.
          </p>
          <div className="actions">
            <a className="btn" href="/trial">
              Start free trial
            </a>
            <p className="actions-note">
              Prefer a walkthrough first? <a href="/demo">Book a demo</a>.
            </p>
          </div>
        </section>
      </main>

      <footer className="foot wrap">
        <p>
          Ploverdesk was founded in 2025. We are six people in Rotterdam, working on one thing:
          invoice matching for wholesalers.
        </p>
      </footer>
    </>
  );
}
