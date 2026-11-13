import MatchFigure from "./MatchFigure";

const TRIAL = "/trial";
const DEMO = "/demo";

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="frame">
          <a className="wordmark" href="/">Ploverdesk</a>
          <nav aria-label="Primary">
            <a className="link" href={DEMO}>Book a demo</a>
            <a className="btn" href={TRIAL}>Start the 14-day trial</a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="frame">
            <h1 id="hero-title">Your team reviews only the invoice lines that don't match.</h1>
            <p className="lead">
              Ploverdesk reads the supplier invoices that arrive by email as PDF and checks every line
              against the purchase order and the delivery note. A wrong quantity, a wrong unit price or a
              delivery that never arrived is shown to a person. Invoices that match go straight to
              payment approval.
            </p>
            <div className="actions">
              <a className="btn" href={TRIAL}>Start the 14-day trial</a>
              <span className="note">No credit card needed.</span>
              <a className="link" href={DEMO}>Book a demo</a>
            </div>

            <MatchFigure />
          </div>
        </section>

        <section className="section" aria-labelledby="flow-title">
          <div className="frame">
            <h2 id="flow-title">From the inbox to the accounting system</h2>
            <ol className="flow">
              <li>
                <h3>The invoice arrives</h3>
                <p>Suppliers send their invoices by email as PDF. Ploverdesk reads each one, line by line.</p>
              </li>
              <li>
                <h3>Every line is matched</h3>
                <p>
                  Quantity and unit price on the invoice are checked against the purchase order, and the
                  quantity against the delivery note.
                </p>
              </li>
              <li>
                <h3>A person sees the exceptions</h3>
                <p>Only the lines that disagree reach your team, with the value that differs marked.</p>
              </li>
              <li>
                <h3>Matched invoices move on</h3>
                <p>
                  They go straight to payment approval, then to your accounting system as a CSV file or
                  through the API.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="section" aria-labelledby="price-title">
          <div className="frame">
            <h2 id="price-title">One price per company</h2>
            <div className="price">
              <p className="price-figure">
                290 EUR
                <span>per month, per company</span>
              </p>
              <dl className="terms">
                <div>
                  <dt>No limit on users</dt>
                  <dd>Everyone in finance who handles supplier invoices can have an account.</dd>
                </div>
                <div>
                  <dt>14-day trial</dt>
                  <dd>No credit card needed to start.</dd>
                </div>
                <div>
                  <dt>Hosted in Frankfurt</dt>
                  <dd>Your invoices and their data stay in the EU.</dd>
                </div>
              </dl>
              <div className="actions">
                <a className="btn" href={TRIAL}>Start the 14-day trial</a>
                <a className="link" href={DEMO}>Book a demo</a>
              </div>
              <p className="about">
                Ploverdesk is six people in Rotterdam, founded in 2025. The fairest way to judge it is the
                trial: run your own supplier invoices through it for 14 days.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="frame">
          <p>Ploverdesk, Rotterdam. Data hosted in Frankfurt, EU.</p>
        </div>
      </footer>
    </>
  );
}
