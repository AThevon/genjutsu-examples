import MatchTable from "./components/MatchTable";

export default function App() {
  return (
    <>
      <header className="site-header container">
        <a className="wordmark" href="/">Ploverdesk</a>
        <nav className="site-header__actions" aria-label="Primary">
          <a className="link" href="/demo">Book a demo</a>
          <a className="button" href="/trial">Start the 14-day trial</a>
        </nav>
      </header>

      <main>
        <section className="hero container" aria-labelledby="hero-title">
          <h1 id="hero-title" className="hero__title">
            Your team checks only the invoice lines that don't match.
          </h1>
          <p className="hero__lede">
            Ploverdesk reads the supplier invoices that reach your inbox as PDF and matches every
            line against the purchase order and the delivery note. Invoices that match go straight
            to payment approval. A person sees only the lines that disagree.
          </p>
          <div className="actions">
            <a className="button" href="/trial">Start the 14-day trial</a>
            <a className="link" href="/demo">Book a demo</a>
          </div>
          <p className="hero__note">No credit card needed.</p>
          <MatchTable />
        </section>

        <section className="section section--split container" aria-labelledby="flow-title">
          <h2 id="flow-title" className="section__title">How an invoice moves through Ploverdesk</h2>
          <ol className="ruled">
            <li className="ruled__row">
              <h3 className="ruled__term">It arrives by email</h3>
              <p className="ruled__text">
                Suppliers keep sending PDF invoices to the address they use now. Ploverdesk reads
                each one, line by line.
              </p>
            </li>
            <li className="ruled__row">
              <h3 className="ruled__term">Each line is matched three ways</h3>
              <p className="ruled__text">
                Quantity and unit price on the invoice are compared with your purchase order and
                with the delivery note.
              </p>
            </li>
            <li className="ruled__row">
              <h3 className="ruled__term">Matching invoices go to approval</h3>
              <p className="ruled__text">
                When every line agrees, the invoice goes straight to payment approval. Nobody has
                to open it first.
              </p>
            </li>
            <li className="ruled__row">
              <h3 className="ruled__term">The rest comes to a person</h3>
              <p className="ruled__text">
                Only the lines that disagree are shown, next to what the purchase order and the
                delivery note say for the same line.
              </p>
            </li>
          </ol>
        </section>

        <section className="section container" aria-labelledby="stops-title">
          <h2 id="stops-title" className="section__title">What stops an invoice</h2>
          <dl className="stops">
            <div className="stops__row">
              <dt className="stops__term">Wrong quantity</dt>
              <dd className="stops__text">
                The invoice charges for more units than were ordered or delivered.
              </dd>
            </div>
            <div className="stops__row">
              <dt className="stops__term">Wrong unit price</dt>
              <dd className="stops__text">
                The price per unit differs from the one agreed on the purchase order.
              </dd>
            </div>
            <div className="stops__row">
              <dt className="stops__term">A delivery that never arrived</dt>
              <dd className="stops__text">
                A line is invoiced, but no delivery note shows the goods were received.
              </dd>
            </div>
          </dl>
        </section>

        <section className="section section--split container" aria-labelledby="export-title">
          <h2 id="export-title" className="section__title">Into your accounting system</h2>
          <div className="prose">
            <p>
              Matched invoices are exported to your accounting system as a CSV file, or through
              an API.
            </p>
            <p>Your data is hosted in Frankfurt, in the EU.</p>
          </div>
        </section>

        <section className="section pricing container" aria-labelledby="price-title">
          <h2 id="price-title" className="section__title">Price</h2>
          <div className="pricing__body">
            <p className="pricing__figure">
              <span className="pricing__amount">290 EUR</span>
              <span className="pricing__unit">per month, per company</span>
            </p>
            <div className="pricing__terms">
              <ul className="pricing__list">
                <li>No limit on users. Everyone in finance can have an account.</li>
                <li>The 14-day trial needs no credit card.</li>
              </ul>
              <div className="actions">
                <a className="button" href="/trial">Start the 14-day trial</a>
                <a className="link" href="/demo">Book a demo</a>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--split container" aria-labelledby="about-title">
          <h2 id="about-title" className="section__title">Who makes it</h2>
          <div className="prose">
            <p>
              Ploverdesk was founded in 2025. We are six people in Rotterdam. We are new, so there
              are no customer logos on this page yet.
            </p>
            <p>
              If you would rather see it with one of us first, <a className="link" href="/demo">book a demo</a>.
            </p>
          </div>
        </section>
      </main>

      <footer className="container">
        <div className="site-footer">
          <p>Ploverdesk, Rotterdam.</p>
          <p>Data hosted in Frankfurt, EU.</p>
        </div>
      </footer>
    </>
  );
}
