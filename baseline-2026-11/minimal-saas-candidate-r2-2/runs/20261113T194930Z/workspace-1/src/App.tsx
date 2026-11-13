import Worksheet from "./Worksheet";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container site-header-inner">
          <a className="wordmark" href="/">
            Ploverdesk
          </a>
          <nav aria-label="Primary" className="site-nav">
            <a className="link" href="/demo">
              Book a demo
            </a>
            <a className="btn btn-primary btn-compact" href="/trial">
              Start the trial
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <div className="hero-copy">
              <h1 id="hero-title">Only the invoice lines that don't match reach your desk.</h1>
              <p className="lead">
                Ploverdesk reads the supplier invoices that arrive by email as PDF and matches every line against
                the purchase order and the delivery note. Invoices that match go straight to payment approval. You
                see the rest, one line at a time.
              </p>
              <div className="actions">
                <a className="btn btn-primary" href="/trial">
                  Start the trial
                </a>
                <a className="link" href="/demo">
                  Book a demo
                </a>
              </div>
              <p className="fine">14 days, no credit card needed.</p>
            </div>
            <Worksheet />
          </div>
        </section>

        <section className="section" aria-labelledby="flagged-title">
          <div className="container grid">
            <div className="col-head">
              <h2 id="flagged-title">What reaches a person</h2>
              <p>A line stops when the invoice, the purchase order and the delivery note disagree.</p>
            </div>
            <dl className="ruled col-body">
              <div className="ruled-row">
                <dt>Wrong quantity</dt>
                <dd>The invoice bills a different number of units than the purchase order or the delivery note.</dd>
              </div>
              <div className="ruled-row">
                <dt>Wrong unit price</dt>
                <dd>The price per unit on the invoice differs from the price on the purchase order.</dd>
              </div>
              <div className="ruled-row">
                <dt>Missing delivery</dt>
                <dd>The invoice bills goods that no delivery note shows as arrived.</dd>
              </div>
              <div className="ruled-row ruled-row--quiet">
                <dt>Everything else</dt>
                <dd>An invoice where every line matches goes straight to payment approval.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="section" aria-labelledby="flow-title">
          <div className="container">
            <h2 id="flow-title">From the inbox to your accounting system</h2>
            <ol className="flow">
              <li>
                <h3>The PDF arrives</h3>
                <p>Supplier invoices come in by email, as PDF.</p>
              </li>
              <li>
                <h3>Every line is matched</h3>
                <p>Quantity and unit price, against the purchase order and the delivery note.</p>
              </li>
              <li>
                <h3>Approval or a person</h3>
                <p>Matched invoices go to payment approval. For the others, a person sees only the lines that differ.</p>
              </li>
              <li>
                <h3>Export</h3>
                <p>Matched invoices go to your accounting system as a CSV file or through the API.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="section pricing" aria-labelledby="price-title">
          <div className="container grid">
            <div className="col-head">
              <h2 id="price-title">Price</h2>
              <p className="figure">
                290 EUR
              </p>
              <p>per month, per company.</p>
            </div>
            <div className="col-body">
              <dl className="ruled">
                <div className="ruled-row">
                  <dt>Users</dt>
                  <dd>No limit.</dd>
                </div>
                <div className="ruled-row">
                  <dt>Trial</dt>
                  <dd>14 days. No credit card needed.</dd>
                </div>
                <div className="ruled-row">
                  <dt>Export</dt>
                  <dd>CSV file or API.</dd>
                </div>
                <div className="ruled-row">
                  <dt>Hosting</dt>
                  <dd>Frankfurt, in the EU.</dd>
                </div>
              </dl>
              <div className="actions">
                <a className="btn btn-primary" href="/trial">
                  Start the trial
                </a>
                <a className="link" href="/demo">
                  Book a demo
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>Ploverdesk is six people in Rotterdam, founded in 2025.</p>
        </div>
      </footer>
    </>
  );
}
