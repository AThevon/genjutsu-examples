import ExampleMatch from "./ExampleMatch";

export default function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="wrap site-header__inner">
          <a className="wordmark" href="/" aria-label="Ploverdesk, home">
            Ploverdesk
          </a>
          <nav className="site-header__nav" aria-label="Primary">
            <a className="link" href="/demo">
              Book a demo
            </a>
            <a className="button button--small" href="/trial">
              Start the 14-day trial
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="wrap hero" aria-labelledby="hero-title">
          <div className="hero__text">
            <h1 id="hero-title">
              Every supplier invoice checked line by line. You see only the lines that don't
              match.
            </h1>
            <p className="lead">
              Ploverdesk reads the PDF invoices your suppliers email you and matches each line
              against the purchase order and the delivery note. Invoices that match go straight
              to payment approval. Your team looks at the rest: a wrong quantity, a wrong unit
              price, a delivery that never arrived.
            </p>
            <div className="actions">
              <a className="button" href="/trial">
                Start the 14-day trial
              </a>
              <a className="link" href="/demo">
                Book a demo
              </a>
            </div>
            <p className="fine">No credit card for the trial. Then 290 EUR a month per company.</p>
          </div>

          <div className="hero__example">
            <ExampleMatch />
          </div>
        </section>

        <section className="wrap section" aria-labelledby="flow-title">
          <h2 id="flow-title">What happens to an invoice</h2>
          <ol className="flow">
            <li>
              <h3>It arrives by email</h3>
              <p>
                Suppliers keep sending PDF invoices the way they do now. Ploverdesk reads each
                one, line by line.
              </p>
            </li>
            <li>
              <h3>Each line meets its order and its delivery</h3>
              <p>
                Quantity and unit price are checked against the purchase order. Quantity is
                checked against the delivery note.
              </p>
            </li>
            <li>
              <h3>A person sees what disagrees</h3>
              <p>
                Only the lines that do not match reach your team, each with the reason it was
                stopped.
              </p>
            </li>
            <li>
              <h3>The rest moves on</h3>
              <p>
                A matched invoice goes straight to payment approval, then to your accounting
                system.
              </p>
            </li>
          </ol>
        </section>

        <section className="wrap section terms" aria-labelledby="terms-title">
          <div className="terms__intro">
            <h2 id="terms-title">One price for the whole finance team</h2>
            <p>Try it on your own supplier invoices for 14 days before you pay anything.</p>
            <div className="actions">
              <a className="button" href="/trial">
                Start the 14-day trial
              </a>
              <a className="link" href="/demo">
                Book a demo
              </a>
            </div>
          </div>
          <dl className="terms__list">
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
              <dd>Matched invoices go to your accounting system as a CSV file or through the API</dd>
            </div>
            <div>
              <dt>Hosting</dt>
              <dd>Your data is hosted in Frankfurt, in the EU</dd>
            </div>
          </dl>
        </section>

        <section className="wrap section about" aria-labelledby="about-title">
          <h2 id="about-title">Who builds it</h2>
          <p>
            Ploverdesk is six people in Rotterdam, founded in 2025. We are new, so there are no
            customer logos or quotes on this page. The trial is the honest way to judge it: run
            your own supplier invoices through it for 14 days and see what it stops.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap site-footer__inner">
          <span>Ploverdesk, Rotterdam</span>
          <a className="link" href="/demo">
            Book a demo
          </a>
        </div>
      </footer>
    </>
  );
}
