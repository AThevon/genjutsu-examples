const TRIAL_LABEL = "Start the 14-day trial";
const DEMO_LABEL = "Book a demo";

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <a className="wordmark" href="/">
            Ploverdesk
          </a>
          <a className="link link--pad" href="/trial">
            {TRIAL_LABEL}
          </a>
        </div>
      </header>

      <main id="main">
        <section className="container hero" aria-labelledby="hero-title">
          <h1 id="hero-title" className="hero__title">
            Only the invoice lines that don’t match reach your desk.
          </h1>
          <p className="lead">
            Ploverdesk reads the supplier invoices that arrive by email as PDF
            and checks every line against the purchase order and the delivery
            note. Invoices that match go straight to payment approval. Your
            finance team sees only the lines that don’t.
          </p>
          <div className="actions">
            <a className="btn btn-primary" href="/trial">
              {TRIAL_LABEL}
            </a>
            <a className="link link--pad" href="/demo">
              {DEMO_LABEL}
            </a>
          </div>
          <p className="fine">
            The trial needs no credit card. After it, 290 EUR per month per
            company.
          </p>
        </section>

        <section className="container section" aria-labelledby="how-title">
          <h2 id="how-title" className="section__title">
            A three-way match on every line
          </h2>
          <ol className="sequence">
            <li className="sequence__item">
              <h3 className="item-title">The invoice is read</h3>
              <p>
                Supplier invoices arrive by email as PDF. Ploverdesk reads each
                one line by line, so nobody retypes them.
              </p>
            </li>
            <li className="sequence__item">
              <h3 className="item-title">Each line is matched twice</h3>
              <p>
                Against the purchase order: was this ordered, at this price?
                Against the delivery note: did this quantity arrive?
              </p>
            </li>
            <li className="sequence__item">
              <h3 className="item-title">The invoice is routed</h3>
              <p>
                When every line matches, the invoice goes to payment approval.
                When one does not, it goes to a person, showing only the lines
                that failed.
              </p>
            </li>
          </ol>
        </section>

        <section className="container section" aria-labelledby="desk-title">
          <h2 id="desk-title" className="section__title">
            What a person still has to look at
          </h2>
          <p className="prose">
            Three kinds of mismatch stop an invoice. Everything else passes
            without anyone opening it.
          </p>
          <table className="mismatch">
            <thead>
              <tr>
                <th scope="col">Mismatch</th>
                <th scope="col">Checked against</th>
                <th scope="col">What it means</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="mismatch__flag">
                  Wrong quantity
                </th>
                <td>Delivery note</td>
                <td>
                  The invoice bills a quantity the delivery note does not
                  record.
                </td>
              </tr>
              <tr>
                <th scope="row" className="mismatch__flag">
                  Wrong unit price
                </th>
                <td>Purchase order</td>
                <td>
                  The unit price on the invoice is not the price on the
                  purchase order.
                </td>
              </tr>
              <tr>
                <th scope="row" className="mismatch__flag">
                  Missing delivery
                </th>
                <td>Delivery note</td>
                <td>
                  The invoice bills goods that no delivery note shows as
                  arrived.
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="container section" aria-labelledby="after-title">
          <h2 id="after-title" className="section__title">
            After the match
          </h2>
          <dl className="facts">
            <div className="facts__row">
              <dt>Export</dt>
              <dd>
                Matched invoices go to your accounting system as a CSV file or
                through an API.
              </dd>
            </div>
            <div className="facts__row">
              <dt>Hosting</dt>
              <dd>Your data is hosted in Frankfurt, in the EU.</dd>
            </div>
          </dl>
        </section>

        <section className="price-band" aria-labelledby="price-title">
          <div className="container">
            <h2 id="price-title" className="section__title">
              Price
            </h2>
            <p className="price">
              <span className="price__amount">290 EUR</span>
              <span className="price__unit">per month, per company</span>
            </p>
            <ul className="terms">
              <li>No limit on users.</li>
              <li>The 14-day trial needs no credit card.</li>
            </ul>
            <div className="actions">
              <a className="btn btn-primary" href="/trial">
                {TRIAL_LABEL}
              </a>
              <a className="link link--pad" href="/demo">
                {DEMO_LABEL}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="container site-footer">
        <p>
          Ploverdesk was founded in 2025. We are six people in Rotterdam.
        </p>
      </footer>
    </>
  );
}
