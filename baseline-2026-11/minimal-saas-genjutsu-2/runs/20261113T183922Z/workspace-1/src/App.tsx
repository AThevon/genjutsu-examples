export default function App() {
  return (
    <>
      <header className="masthead">
        <a className="wordmark" href="/">
          Ploverdesk
        </a>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">
            Pay the supplier invoices that match. Look only at the lines that don't.
          </h1>
          <p className="lead">
            Ploverdesk reads the PDF invoices your suppliers send by email and checks every line
            against the purchase order and the delivery note. Invoices that match go straight to
            payment approval. Your team sees only the lines that need a person: a wrong quantity,
            a wrong unit price, a delivery that never arrived.
          </p>
          <div className="actions">
            <a className="button" href="/trial">
              Start the 14-day trial
            </a>
            <a className="link link--target" href="/demo">
              Book a demo
            </a>
          </div>
          <p className="footnote">No credit card needed for the trial.</p>
        </section>

        <section className="section section--wide" aria-labelledby="match-title">
          <div className="section__intro">
            <h2 id="match-title">What reaches your team</h2>
            <p>
              Each invoice line is compared with the two documents you already have for it. Where
              all three agree, nobody looks. Where one disagrees, that line is shown, and the
              document that disagrees is marked.
            </p>
          </div>

          <table className="match">
            <caption className="visually-hidden">
              How Ploverdesk handles an invoice line in each case of the three-way match
            </caption>
            <thead>
              <tr>
                <th scope="col">Case</th>
                <th scope="col">Purchase order</th>
                <th scope="col">Delivery note</th>
                <th scope="col">Invoice</th>
                <th scope="col">What happens</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Everything agrees</th>
                <td data-label="Purchase order">Agrees</td>
                <td data-label="Delivery note">Agrees</td>
                <td data-label="Invoice">Agrees</td>
                <td data-label="What happens">Goes to payment approval</td>
              </tr>
              <tr>
                <th scope="row">Wrong quantity</th>
                <td data-label="Purchase order">Quantity ordered</td>
                <td data-label="Delivery note">Quantity received</td>
                <td data-label="Invoice" className="match__flag">
                  Quantity billed differs from quantity received
                </td>
                <td data-label="What happens">Shown to your team</td>
              </tr>
              <tr>
                <th scope="row">Wrong unit price</th>
                <td data-label="Purchase order">Agreed unit price</td>
                <td data-label="Delivery note">Quantity received</td>
                <td data-label="Invoice" className="match__flag">
                  Unit price differs from the purchase order
                </td>
                <td data-label="What happens">Shown to your team</td>
              </tr>
              <tr>
                <th scope="row">Delivery never arrived</th>
                <td data-label="Purchase order">Line ordered</td>
                <td data-label="Delivery note" className="match__flag">
                  No delivery recorded for this line
                </td>
                <td data-label="Invoice">Line billed</td>
                <td data-label="What happens">Shown to your team</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="section" aria-labelledby="after-title">
          <h2 id="after-title">After the match</h2>
          <dl className="facts">
            <div className="facts__row">
              <dt>Export</dt>
              <dd>
                Matched invoices go to your accounting system as a CSV file or through the API.
              </dd>
            </div>
            <div className="facts__row">
              <dt>Hosting</dt>
              <dd>Your data is hosted in Frankfurt, in the EU.</dd>
            </div>
            <div className="facts__row">
              <dt>Users</dt>
              <dd>No limit. Everyone who checks or approves invoices can have an account.</dd>
            </div>
          </dl>
        </section>

        <section className="section" aria-labelledby="price-title">
          <h2 id="price-title">Price</h2>
          <p className="price">290 EUR per month per company</p>
          <p>
            One price for the whole finance team, whatever its size. Try it for 14 days first,
            without a credit card.
          </p>
          <div className="actions">
            <a className="button" href="/trial">
              Start the 14-day trial
            </a>
            <a className="link link--target" href="/demo">
              Book a demo
            </a>
          </div>
        </section>

        <section className="section" aria-labelledby="company-title">
          <h2 id="company-title">Who builds it</h2>
          <p>
            Ploverdesk was founded in 2025. We are six people in Rotterdam. We are new, so there
            are no customer logos or quotes on this page yet. If you would rather see the match
            on your own invoices before you start a trial, book a demo and we will walk you
            through it.
          </p>
        </section>
      </main>

      <footer className="colophon">
        <p>Ploverdesk, Rotterdam</p>
      </footer>
    </>
  );
}
