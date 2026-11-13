const TRIAL = "/trial";
const DEMO = "/demo";

type State = "ok" | "flag";
type Cell = State | "na";

const matchRows: { field: string; po: Cell; note: Cell; result: string; state: State }[] = [
  { field: "Quantity", po: "ok", note: "ok", result: "Matches", state: "ok" },
  { field: "Unit price", po: "flag", note: "na", result: "Price differs from order", state: "flag" },
  { field: "Delivery", po: "na", note: "ok", result: "Goods received", state: "ok" },
];

function Mark({ state }: { state: Cell }) {
  if (state === "na")
    return (
      <span className="mark mark--na">
        <span aria-hidden="true">–</span>
        <span className="sr-only">not checked here</span>
      </span>
    );
  return state === "ok" ? (
    <span className="mark mark--ok">
      <span aria-hidden="true">✓</span>
      <span className="sr-only">matches</span>
    </span>
  ) : (
    <span className="mark mark--flag">
      <span aria-hidden="true">✕</span>
      <span className="sr-only">does not match</span>
    </span>
  );
}

function MatchSchematic() {
  return (
    <figure className="schematic" aria-labelledby="schematic-caption">
      <div className="schematic__head">
        <span className="schematic__label">Invoice line</span>
        <span className="schematic__status">Needs review</span>
      </div>
      <table className="schematic__table">
        <thead>
          <tr>
            <th scope="col">Checked</th>
            <th scope="col">Purchase order</th>
            <th scope="col">Delivery note</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          {matchRows.map((r) => (
            <tr key={r.field} className={r.state === "flag" ? "is-flag" : undefined}>
              <th scope="row">{r.field}</th>
              <td>
                <Mark state={r.po} />
              </td>
              <td>
                <Mark state={r.note} />
              </td>
              <td className="schematic__result">{r.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption id="schematic-caption">
        Each invoice line is checked against the purchase order and the delivery note. Only lines
        like this one reach a person.
      </figcaption>
    </figure>
  );
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="wrap site-header__inner">
          <a className="wordmark" href="/" aria-label="Ploverdesk home">
            Ploverdesk
          </a>
          <nav aria-label="Primary" className="site-nav">
            <a href={DEMO} className="link-quiet">
              Book a demo
            </a>
            <a href={TRIAL} className="btn btn--small">
              Start free trial
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <p className="eyebrow">Accounts payable for mid-size wholesalers</p>
          <h1 id="hero-title">
            Approve the invoices that match.
            <br />
            Review only the lines that don’t.
          </h1>
          <p className="lede">
            Ploverdesk reads the supplier invoices that arrive in your inbox as PDF and checks every
            line against the purchase order and the delivery note. Your team sees only what is
            wrong.
          </p>
          <div className="cta">
            <a href={TRIAL} className="btn">
              Start the 14-day trial
            </a>
            <a href={DEMO} className="link-quiet">
              or book a demo
            </a>
          </div>
          <p className="fineprint">No credit card. One price per company, any number of users.</p>
        </section>

        <section className="wrap band" aria-label="How a line is checked">
          <MatchSchematic />
        </section>

        <section className="wrap section" aria-labelledby="how-title">
          <h2 id="how-title">How it works</h2>
          <ol className="steps">
            <li>
              <span className="steps__n" aria-hidden="true">
                1
              </span>
              <h3>Invoices arrive by email</h3>
              <p>
                Suppliers keep sending PDFs to the address they use today. Ploverdesk reads each
                invoice line by line.
              </p>
            </li>
            <li>
              <span className="steps__n" aria-hidden="true">
                2
              </span>
              <h3>Every line is matched three ways</h3>
              <p>
                Each line is compared with the purchase order and the delivery note: quantity, unit
                price, and whether the goods arrived.
              </p>
            </li>
            <li>
              <span className="steps__n" aria-hidden="true">
                3
              </span>
              <h3>Matches go to approval</h3>
              <p>
                Invoices that match go straight to payment approval. Nobody has to open them.
              </p>
            </li>
          </ol>
        </section>

        <section className="wrap section split" aria-labelledby="exceptions-title">
          <div>
            <h2 id="exceptions-title">What a person still sees</h2>
            <p className="muted">
              Only the lines that do not match, with the reason next to them.
            </p>
          </div>
          <dl className="defs">
            <div>
              <dt>Wrong quantity</dt>
              <dd>The invoice bills more or less than was ordered or delivered.</dd>
            </div>
            <div>
              <dt>Wrong unit price</dt>
              <dd>The price on the invoice differs from the price on the purchase order.</dd>
            </div>
            <div>
              <dt>Missing delivery</dt>
              <dd>The invoice bills for goods that never arrived.</dd>
            </div>
          </dl>
        </section>

        <section className="wrap section split" aria-labelledby="fit-title">
          <div>
            <h2 id="fit-title">Fits next to your accounting system</h2>
          </div>
          <dl className="defs">
            <div>
              <dt>Export</dt>
              <dd>Matched invoices go to your accounting system as a CSV file or through an API.</dd>
            </div>
            <div>
              <dt>Hosting</dt>
              <dd>Your data is hosted in Frankfurt, in the EU.</dd>
            </div>
          </dl>
        </section>

        <section className="wrap section" aria-labelledby="pricing-title">
          <div className="pricing">
            <div>
              <h2 id="pricing-title">Pricing</h2>
              <p className="price">
                <span className="price__amount">290 EUR</span>
                <span className="price__unit">per month, per company</span>
              </p>
              <ul className="ticks">
                <li>No limit on users</li>
                <li>14-day trial, no credit card</li>
              </ul>
            </div>
            <div className="pricing__cta">
              <a href={TRIAL} className="btn">
                Start the 14-day trial
              </a>
              <a href={DEMO} className="link-quiet">
                Prefer a walkthrough? Book a demo
              </a>
            </div>
          </div>
        </section>

        <section className="wrap section split" aria-labelledby="about-title">
          <div>
            <h2 id="about-title">Who we are</h2>
          </div>
          <p className="about">
            Ploverdesk was founded in 2025. We are six people in Rotterdam, building one thing:
            invoice matching for wholesale finance teams.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap site-footer__inner">
          <span>Ploverdesk · Rotterdam</span>
          <nav aria-label="Footer" className="site-nav">
            <a href={DEMO} className="link-quiet">
              Book a demo
            </a>
            <a href={TRIAL} className="link-quiet">
              Start free trial
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
