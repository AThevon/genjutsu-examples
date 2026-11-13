import type { CSSProperties, ReactNode } from "react";

/* Auditor's tickmark: drawn beside an invoice figure that ties to the order and delivery note. */
function Tick() {
  return (
    <svg className="tick" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M1.5 6.5 4.5 9.5 10.5 2.5" pathLength={1} />
    </svg>
  );
}

/* Red pencil ring: drawn around an invoice figure that does not tie. */
function Ringed({ children }: { children: ReactNode }) {
  return (
    <span className="ringed">
      {children}
      <svg className="ring" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <ellipse cx="50" cy="20" rx="48" ry="18" pathLength={1} />
      </svg>
    </span>
  );
}

function rowStyle(row: number): CSSProperties {
  return { "--row": row } as CSSProperties;
}

function Worksheet() {
  return (
    <figure className="sheet">
      <table className="match">
        <caption>
          Example invoice with illustrative values. Each line is checked against its purchase order
          and its delivery note.
        </caption>
        <thead>
          <tr>
            <th scope="col" rowSpan={2} className="c-line">Line</th>
            <th scope="colgroup" colSpan={3} className="c-group">Quantity</th>
            <th scope="colgroup" colSpan={2} className="c-group">Unit price, EUR</th>
            <th scope="col" rowSpan={2} className="c-result">Result</th>
          </tr>
          <tr>
            <th scope="col">Invoice</th>
            <th scope="col">Order</th>
            <th scope="col">Delivered</th>
            <th scope="col">Invoice</th>
            <th scope="col">Order</th>
          </tr>
        </thead>
        <tbody>
          <tr style={rowStyle(0)}>
            <th scope="row" className="c-line">Pallet wrap</th>
            <td data-label="Invoiced qty"><span className="fig">120<Tick /></span></td>
            <td data-label="Ordered qty">120</td>
            <td data-label="Delivered">120</td>
            <td data-label="Invoice price"><span className="fig">4.20<Tick /></span></td>
            <td data-label="Order price">4.20</td>
            <td className="c-result is-matched">Matched</td>
          </tr>
          <tr className="is-exception" style={rowStyle(1)}>
            <th scope="row" className="c-line">Corrugated boxes</th>
            <td data-label="Invoiced qty"><Ringed>400</Ringed></td>
            <td data-label="Ordered qty">400</td>
            <td data-label="Delivered">360</td>
            <td data-label="Invoice price"><span className="fig">0.86<Tick /></span></td>
            <td data-label="Order price">0.86</td>
            <td className="c-result">Wrong quantity</td>
          </tr>
          <tr className="is-exception" style={rowStyle(2)}>
            <th scope="row" className="c-line">Packing tape</th>
            <td data-label="Invoiced qty"><span className="fig">60<Tick /></span></td>
            <td data-label="Ordered qty">60</td>
            <td data-label="Delivered">60</td>
            <td data-label="Invoice price"><Ringed>2.10</Ringed></td>
            <td data-label="Order price">1.95</td>
            <td className="c-result">Wrong unit price</td>
          </tr>
          <tr className="is-exception" style={rowStyle(3)}>
            <th scope="row" className="c-line">Stretch film</th>
            <td data-label="Invoiced qty"><Ringed>24</Ringed></td>
            <td data-label="Ordered qty">24</td>
            <td data-label="Delivered">None</td>
            <td data-label="Invoice price"><span className="fig">3.80<Tick /></span></td>
            <td data-label="Order price">3.80</td>
            <td className="c-result">Not delivered</td>
          </tr>
          <tr style={rowStyle(4)}>
            <th scope="row" className="c-line">Edge protectors</th>
            <td data-label="Invoiced qty"><span className="fig">200<Tick /></span></td>
            <td data-label="Ordered qty">200</td>
            <td data-label="Delivered">200</td>
            <td data-label="Invoice price"><span className="fig">0.32<Tick /></span></td>
            <td data-label="Order price">0.32</td>
            <td className="c-result is-matched">Matched</td>
          </tr>
        </tbody>
      </table>
      <figcaption>
        Three lines on this invoice don't match, so a person sees those three. The two that match
        need nobody.
      </figcaption>
    </figure>
  );
}

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <a className="wordmark" href="/">Ploverdesk</a>
        </div>
      </header>

      <main>
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-text">
            <h1 id="hero-title">Only the invoice lines that don't match reach your desk.</h1>
            <p className="lead">
              Ploverdesk reads the supplier invoices that arrive by email as PDF and checks every
              line against the purchase order and the delivery note. Invoices that match go
              straight to payment approval. You see the rest.
            </p>
            <div className="actions">
              <a className="btn" href="/trial">Start the 14-day trial</a>
              <a className="quiet" href="/demo">Book a demo</a>
            </div>
            <p className="terms">No credit card needed. 290 EUR per month per company, with no limit on users.</p>
          </div>
          <Worksheet />
        </section>

        <section className="flow-section wrap" aria-labelledby="flow-title">
          <h2 id="flow-title">How an invoice travels</h2>
          <ol className="flow">
            <li>
              <h3>Arrives by email</h3>
              <p>Supplier invoices come in by email as PDF. Ploverdesk reads every line.</p>
            </li>
            <li>
              <h3>Checked three ways</h3>
              <p>
                Each line is compared with the purchase order and the delivery note: the quantity,
                the unit price, and whether the goods arrived.
              </p>
            </li>
            <li className="fork">
              <div>
                <h3>Every line matches</h3>
                <p>The invoice goes straight to payment approval. Nobody has to open it.</p>
              </div>
              <div className="fork-exception">
                <h3>A line doesn't match</h3>
                <p>
                  A person sees that line, and only that line: a wrong quantity, a wrong unit
                  price, a delivery that never arrived.
                </p>
              </div>
            </li>
            <li>
              <h3>Exported</h3>
              <p>Matched invoices go to your accounting system as a CSV file or through the API.</p>
            </li>
          </ol>
        </section>

        <section className="terms-section wrap" aria-labelledby="terms-title">
          <h2 id="terms-title">Price and terms</h2>
          <div className="terms-body">
            <dl className="facts">
              <div>
                <dt>Price</dt>
                <dd>290 EUR per month, per company</dd>
              </div>
              <div>
                <dt>Users</dt>
                <dd>No limit</dd>
              </div>
              <div>
                <dt>Trial</dt>
                <dd>14 days, no credit card</dd>
              </div>
              <div>
                <dt>Export</dt>
                <dd>CSV file or API</dd>
              </div>
              <div>
                <dt>Data</dt>
                <dd>Hosted in Frankfurt, in the EU</dd>
              </div>
              <div>
                <dt>Company</dt>
                <dd>Founded in 2025. Six people in Rotterdam.</dd>
              </div>
            </dl>
            <div className="actions">
              <a className="btn" href="/trial">Start the 14-day trial</a>
              <a className="quiet" href="/demo">Book a demo</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <p>Ploverdesk, Rotterdam</p>
        </div>
      </footer>
    </>
  );
}
