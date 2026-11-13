type Cell = { text: string; differs?: boolean };

const COLUMNS = ["Purchase order", "Delivery note", "Invoice", "Outcome"] as const;

function CheckCell({ label, cell }: { label: string; cell: Cell }) {
  if (cell.differs) {
    return (
      <td className="differs" data-label={label}>
        <span>
          <span className="sr-only">Mismatch: </span>
          {cell.text}
        </span>
      </td>
    );
  }
  return (
    <td className={label === "Outcome" ? undefined : "agrees"} data-label={label}>
      <span>{cell.text}</span>
    </td>
  );
}

function ExceptionRow({ check, cells }: { check: string; cells: Cell[] }) {
  return (
    <tr className="is-exception">
      <th scope="row">{check}</th>
      {cells.map((cell, i) => (
        <CheckCell key={COLUMNS[i]} label={COLUMNS[i]} cell={cell} />
      ))}
    </tr>
  );
}

function TieOut() {
  return (
    <figure className="tieout" aria-labelledby="tieout-caption">
      <figcaption id="tieout-caption">
        Example: the lines of one supplier invoice after the three-way match
      </figcaption>
      <table aria-labelledby="tieout-caption">
        <thead>
          <tr>
            <th scope="col">Check</th>
            {COLUMNS.map((c) => (
              <th scope="col" key={c}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <ExceptionRow
            check="Quantity"
            cells={[
              { text: "ordered" },
              { text: "fewer received", differs: true },
              { text: "billed as ordered" },
              { text: "To a person" },
            ]}
          />
          <ExceptionRow
            check="Unit price"
            cells={[
              { text: "agreed price" },
              { text: "carries no price" },
              { text: "different price", differs: true },
              { text: "To a person" },
            ]}
          />
          <ExceptionRow
            check="Delivery"
            cells={[
              { text: "ordered" },
              { text: "never arrived", differs: true },
              { text: "billed" },
              { text: "To a person" },
            ]}
          />
          <tr className="is-rest">
            <th scope="row">Every other line</th>
            <td data-label="Purchase order">agrees</td>
            <td data-label="Delivery note">agrees</td>
            <td data-label="Invoice">agrees</td>
            <td data-label="Outcome">Payment approval</td>
          </tr>
        </tbody>
      </table>
    </figure>
  );
}

export default function App() {
  return (
    <>
      <a className="link skip" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container">
          <a className="wordmark" href="/">
            Ploverdesk
          </a>
          <nav className="site-nav" aria-label="Main">
            <a className="link link--plain" href="#pricing">
              Pricing
            </a>
            <a className="link link--plain" href="/demo">
              Book a demo
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <div className="hero__text">
              <h1 id="hero-title">Only the invoice lines that don't match reach your desk.</h1>
              <p className="lead">
                Ploverdesk reads the supplier invoices that arrive by email as PDF and checks every
                line against the purchase order and the delivery note. Invoices that match go
                straight to payment approval. A person sees only the lines that don't.
              </p>
              <div className="actions">
                <a className="btn" href="/trial">
                  Start the 14-day trial
                </a>
                <a className="link" href="/demo">
                  Book a demo
                </a>
              </div>
              <p className="note">No credit card needed for the trial.</p>
            </div>
            <TieOut />
          </div>
        </section>

        <section className="section" aria-labelledby="flow-title">
          <div className="container">
            <h2 id="flow-title">What happens to a supplier invoice</h2>
            <ol className="flow">
              <li>
                <h3>It arrives by email</h3>
                <p>
                  Suppliers keep sending PDF invoices the way they do now. Ploverdesk reads each one
                  and takes out every line.
                </p>
              </li>
              <li>
                <h3>Each line is matched three ways</h3>
                <p>
                  Quantity and unit price are checked against the purchase order, and the quantity
                  against what the delivery note says arrived.
                </p>
              </li>
              <li>
                <h3>Your team sees the exceptions</h3>
                <p>
                  A wrong quantity, a wrong unit price, a delivery that never arrived. Nothing else
                  is put in front of a person.
                </p>
              </li>
              <li>
                <h3>Matched invoices reach your accounting</h3>
                <p>
                  After payment approval they are exported to your accounting system as a CSV file
                  or through an API.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="section" id="pricing" aria-labelledby="pricing-title">
          <div className="container">
            <h2 id="pricing-title">One price per company</h2>
            <div className="price-block">
              <div>
                <p className="price">290 EUR</p>
                <p className="price-unit">per month, per company</p>
              </div>
              <dl className="terms">
                <div>
                  <dt>Users</dt>
                  <dd>No limit</dd>
                </div>
                <div>
                  <dt>Trial</dt>
                  <dd>14 days, no credit card</dd>
                </div>
                <div>
                  <dt>Data</dt>
                  <dd>Hosted in Frankfurt, in the EU</dd>
                </div>
              </dl>
              <div className="actions">
                <a className="btn" href="/trial">
                  Start the 14-day trial
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
