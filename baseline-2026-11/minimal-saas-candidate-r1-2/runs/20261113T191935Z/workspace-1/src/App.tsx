import MatchExample from "./MatchExample";

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <span className="wordmark">Ploverdesk</span>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap">
            <h1 id="hero-title" className="display">
              Look only at the invoice lines that do not match.
            </h1>
            <p className="lead measure">
              Ploverdesk reads the supplier invoices that arrive by email as PDF and matches
              every line against the purchase order and the delivery note. Invoices that match
              go straight to payment approval. Your finance team sees only the lines that do
              not.
            </p>
            <div className="actions">
              <a className="button" href="/trial">
                Start the 14-day trial
              </a>
              <a className="link" href="/demo">
                Book a demo
              </a>
            </div>
            <p className="small">No credit card for the trial.</p>

            <MatchExample />
          </div>
        </section>

        <section className="section" aria-labelledby="cases-title">
          <div className="wrap split">
            <h2 id="cases-title" className="heading">
              What reaches a person
            </h2>
            <div>
              <dl className="cases measure">
                <div>
                  <dt>A wrong quantity</dt>
                  <dd>The invoice bills a different quantity from the one on the delivery note.</dd>
                </div>
                <div>
                  <dt>A wrong unit price</dt>
                  <dd>The invoice bills a different unit price from the one on the purchase order.</dd>
                </div>
                <div>
                  <dt>A delivery that never arrived</dt>
                  <dd>The invoice bills a line that no delivery note records.</dd>
                </div>
              </dl>
              <p className="after-cases measure">
                Nothing else. When every line of an invoice matches, the invoice goes straight
                to payment approval.
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="export-title">
          <div className="wrap prose">
            <h2 id="export-title" className="heading">
              After the match
            </h2>
            <p className="measure">
              Matched invoices are exported to your accounting system, as a CSV file or through
              an API.
            </p>
            <p className="measure">Your data is hosted in Frankfurt, in the EU.</p>
          </div>
        </section>

        <section className="section" aria-labelledby="price-title">
          <div className="wrap price">
            <div>
              <h2 id="price-title" className="heading">
                290 EUR per month, per company
              </h2>
              <p className="lead measure">
                No limit on users. The first 14 days are a trial, with no credit card.
              </p>
            </div>
            <div className="actions">
              <a className="button" href="/trial">
                Start the 14-day trial
              </a>
              <a className="link" href="/demo">
                Book a demo
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <p className="small">Ploverdesk is six people in Rotterdam, founded in 2025.</p>
        </div>
      </footer>
    </>
  );
}
