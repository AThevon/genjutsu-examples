export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <a className="wordmark" href="/">
            Ploverdesk
          </a>
          <div className="header-actions">
            <a className="link header-demo" href="/demo">
              Book a demo
            </a>
            <a className="button" href="/trial">
              Start trial
            </a>
          </div>
        </div>
      </header>

      <main id="content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap">
            <div className="hero-text">
              <h1 id="hero-title">
                Pay the invoices that match. Look only at the lines that do not.
              </h1>
              <p className="lede">
                Ploverdesk reads the supplier invoices that arrive by email as PDF and checks
                every line against the purchase order and the delivery note. Invoices that match
                go straight to payment approval. Your finance team sees only what does not.
              </p>
              <div className="actions">
                <a className="button" href="/trial">
                  Start trial
                </a>
                <a className="link" href="/demo">
                  Book a demo
                </a>
              </div>
              <p className="terms">14-day trial. No credit card.</p>
            </div>

            <figure className="sheet" aria-label="Example of a three-way match">
              <table>
                <caption>Example: one supplier invoice, matched line by line.</caption>
                <thead>
                  <tr>
                    <th scope="col">Line</th>
                    <th scope="col">Invoice</th>
                    <th scope="col">Purchase order</th>
                    <th scope="col">Delivery note</th>
                    <th scope="col">Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row-matched">
                    <th scope="row">Every line that agrees</th>
                    <td data-label="Invoice">Agrees</td>
                    <td data-label="Purchase order">Agrees</td>
                    <td data-label="Delivery note">Agrees</td>
                    <td data-label="Result">To payment approval</td>
                  </tr>
                  <tr>
                    <th scope="row">Wrong quantity</th>
                    <td data-label="Invoice">
                      <span className="flag">Quantity differs</span>
                    </td>
                    <td data-label="Purchase order">Agrees</td>
                    <td data-label="Delivery note">Agrees</td>
                    <td data-label="Result" className="result-person">
                      Shown to a person
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Wrong unit price</th>
                    <td data-label="Invoice">
                      <span className="flag">Price differs</span>
                    </td>
                    <td data-label="Purchase order">Agrees</td>
                    <td data-label="Delivery note">Agrees</td>
                    <td data-label="Result" className="result-person">
                      Shown to a person
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Delivery never arrived</th>
                    <td data-label="Invoice">Agrees</td>
                    <td data-label="Purchase order">Agrees</td>
                    <td data-label="Delivery note">
                      <span className="flag">No delivery note</span>
                    </td>
                    <td data-label="Result" className="result-person">
                      Shown to a person
                    </td>
                  </tr>
                </tbody>
              </table>
            </figure>
          </div>
        </section>

        <section className="section" aria-labelledby="spec-title">
          <div className="wrap">
            <h2 id="spec-title">From the inbox to your accounting system</h2>
            <dl className="spec">
              <div>
                <dt>Input</dt>
                <dd>Supplier invoices that arrive by email, as PDF.</dd>
              </div>
              <div>
                <dt>Three-way match</dt>
                <dd>Every invoice line, against the purchase order and the delivery note.</dd>
              </div>
              <div>
                <dt>Review</dt>
                <dd>
                  Only the lines that do not match: a wrong quantity, a wrong unit price, a
                  delivery that never arrived.
                </dd>
              </div>
              <div>
                <dt>Approval</dt>
                <dd>Invoices that match go straight to payment approval.</dd>
              </div>
              <div>
                <dt>Export</dt>
                <dd>Matched invoices go to your accounting system, as a CSV file or through an API.</dd>
              </div>
              <div>
                <dt>Hosting</dt>
                <dd>Your data is hosted in Frankfurt, in the EU.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="section" aria-labelledby="price-title">
          <div className="wrap">
            <h2 id="price-title">Price</h2>
            <div className="price-grid">
              <p className="price">
                290 EUR
                <span className="price-unit">per month, per company</span>
              </p>
              <div className="price-terms">
                <p>No limit on users. Everyone in finance who touches an invoice can use it.</p>
                <p>The 14-day trial needs no credit card.</p>
                <div className="actions">
                  <a className="button" href="/trial">
                    Start trial
                  </a>
                  <a className="link" href="/demo">
                    Book a demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <p>Ploverdesk was founded in 2025. We are six people in Rotterdam.</p>
        </div>
      </footer>
    </>
  );
}
