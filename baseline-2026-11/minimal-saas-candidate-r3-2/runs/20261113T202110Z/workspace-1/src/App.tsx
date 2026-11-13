import type { CSSProperties, ReactNode } from "react";

type Line = {
  item: string;
  invoice: ReactNode;
  order: string;
  delivery: ReactNode;
  result: string | null; // null = matched
};

// Illustrative example, labelled as such on the page. Not customer data.
const EXAMPLE_LINES: Line[] = [
  { item: "Stretch film 500 mm", invoice: "24 × 18.40", order: "24 × 18.40", delivery: "24", result: null },
  {
    item: "Corner boards 1200 mm",
    invoice: "40 × 1.15",
    order: "40 × 1.15",
    delivery: <span className="diff">36</span>,
    result: "Quantity: 4 not delivered",
  },
  { item: "Pallet labels A5", invoice: "10 × 31.00", order: "10 × 31.00", delivery: "10", result: null },
  {
    item: "Strapping band 12 mm",
    invoice: (
      <>
        6 × <span className="diff">54.90</span>
      </>
    ),
    order: "6 × 49.90",
    delivery: "6",
    result: "Unit price: 5.00 above the order",
  },
  { item: "Cartons 600 × 400 mm", invoice: "50 × 0.92", order: "50 × 0.92", delivery: "50", result: null },
  {
    item: "Tape dispenser",
    invoice: "2 × 22.50",
    order: "2 × 22.50",
    delivery: <span className="diff">None received</span>,
    result: "Not delivered",
  },
];

function MatchTable() {
  let matchedIndex = 0;
  return (
    <figure className="match">
      <figcaption className="match-caption" id="match-caption">
        Example: one supplier invoice after the three-way match. Illustrative lines, not customer data.
      </figcaption>
      <table role="table" aria-describedby="match-caption">
        <thead role="rowgroup">
          <tr role="row">
            <th role="columnheader" scope="col">Invoice line</th>
            <th role="columnheader" scope="col" className="num">Invoice</th>
            <th role="columnheader" scope="col" className="num">Purchase order</th>
            <th role="columnheader" scope="col" className="num">Delivery note</th>
            <th role="columnheader" scope="col">Result</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {EXAMPLE_LINES.map((line) => {
            const matched = line.result === null;
            const style = matched ? ({ "--i": matchedIndex++ } as CSSProperties) : undefined;
            return (
              <tr role="row" key={line.item} className={matched ? "is-matched" : "is-exception"} style={style}>
                <td role="cell" className="cell-item">{line.item}</td>
                <td role="cell" className="num">
                  <span className="cell-label" aria-hidden="true">Invoice</span>
                  {line.invoice}
                </td>
                <td role="cell" className="num">
                  <span className="cell-label" aria-hidden="true">Order</span>
                  {line.order}
                </td>
                <td role="cell" className="num">
                  <span className="cell-label" aria-hidden="true">Delivery</span>
                  {line.delivery}
                </td>
                <td role="cell" className="cell-result">
                  {matched ? (
                    <>
                      <span aria-hidden="true">✓ </span>Matched
                    </>
                  ) : (
                    line.result
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </figure>
  );
}

function Actions() {
  return (
    <div className="actions">
      <a className="btn-primary" href="/trial">
        Start the 14-day trial
      </a>
      <p className="actions-note">
        No credit card. Or <a className="link" href="/demo">book a demo</a>.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="wordmark" href="/">
            Ploverdesk
          </a>
          <nav aria-label="Primary" className="header-nav">
            <a className="link header-demo" href="/demo">
              Book a demo
            </a>
            <a className="btn-primary btn-compact" href="/trial">
              Start the 14-day trial
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero container" aria-labelledby="hero-title">
          <h1 id="hero-title">Only the invoice lines that don't match reach your desk.</h1>
          <p className="lead">
            Ploverdesk reads the supplier invoices that arrive by email as PDF and checks every line against the
            purchase order and the delivery note. Invoices that match go straight to payment approval. You see the
            rest: a wrong quantity, a wrong unit price, a delivery that never arrived.
          </p>
          <Actions />
          <MatchTable />
        </section>

        <section className="terms" aria-labelledby="terms-title">
          <div className="container">
            <h2 id="terms-title">The terms</h2>
            <dl className="terms-list">
              <div>
                <dt>Price</dt>
                <dd>290 EUR per month, per company.</dd>
              </div>
              <div>
                <dt>Users</dt>
                <dd>No limit. The whole finance team works under the one price.</dd>
              </div>
              <div>
                <dt>Export</dt>
                <dd>Matched invoices go to your accounting system as a CSV file or through an API.</dd>
              </div>
              <div>
                <dt>Hosting</dt>
                <dd>Your data is hosted in Frankfurt, in the EU.</dd>
              </div>
              <div>
                <dt>Trial</dt>
                <dd>14 days, with no credit card.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="about container" aria-labelledby="about-title">
          <h2 id="about-title">Who builds it</h2>
          <p>
            Ploverdesk was founded in 2025. We are six people in Rotterdam. We have no customer logos to show you
            yet, so the 14-day trial is the way to judge it.
          </p>
          <Actions />
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>Ploverdesk, Rotterdam</span>
          <a className="link" href="/demo">
            Book a demo
          </a>
        </div>
      </footer>
    </>
  );
}
