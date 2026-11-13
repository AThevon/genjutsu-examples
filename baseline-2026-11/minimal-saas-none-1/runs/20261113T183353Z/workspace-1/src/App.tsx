const TRIAL = "/trial";
const DEMO = "/demo";

function TrialButton() {
  return (
    <a className="button" href={TRIAL}>
      Start free trial
    </a>
  );
}

type Row = {
  doc: string;
  status: "match" | "flag";
  note: string;
};

const rows: Row[] = [
  { doc: "Line 1", status: "match", note: "Matches order and delivery" },
  { doc: "Line 2", status: "flag", note: "Quantity differs from delivery note" },
  { doc: "Line 3", status: "match", note: "Matches order and delivery" },
  { doc: "Line 4", status: "flag", note: "Unit price differs from purchase order" },
  { doc: "Line 5", status: "flag", note: "No delivery note received" },
];

function Illustration() {
  return (
    <figure className="figure" aria-labelledby="figure-caption">
      <div className="panel" role="img" aria-label="Illustration of an invoice in Ploverdesk: five lines, three flagged &#8212; a quantity that differs from the delivery note, a unit price that differs from the purchase order, and a line with no delivery note.">
        <div className="panel-head">
          <span className="mono">invoice.pdf</span>
          <span className="panel-docs mono">
            <span>Invoice</span>
            <span aria-hidden="true">·</span>
            <span>Purchase order</span>
            <span aria-hidden="true">·</span>
            <span>Delivery note</span>
          </span>
        </div>
        <ul className="lines">
          {rows.map((r) => (
            <li key={r.doc} className={`line line-${r.status}`}>
              <span className="mono line-doc">{r.doc}</span>
              <span className="line-note">{r.note}</span>
              <span className="line-state">{r.status === "flag" ? "Review" : "Matched"}</span>
            </li>
          ))}
        </ul>
        <div className="panel-foot">
          <span>3 lines to review</span>
          <span className="muted">2 lines matched</span>
        </div>
      </div>
      <figcaption id="figure-caption" className="caption">
        Illustration. You review the flagged lines; everything else is already settled.
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
        <div className="wrap header-inner">
          <a className="wordmark" href="/" aria-label="Ploverdesk home">
            Ploverdesk
          </a>
          <nav className="header-nav" aria-label="Primary">
            <a className="text-link" href={DEMO}>
              Book a demo
            </a>
            <a className="button button-small" href={TRIAL}>
              Start free trial
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <p className="eyebrow">Invoice matching for wholesale finance teams</p>
          <h1 id="hero-title">See only the invoice lines that don’t match.</h1>
          <p className="lede">
            Ploverdesk reads the supplier invoices that arrive in your inbox, checks every line against the
            purchase order and the delivery note, and puts in front of you only the lines that are wrong.
            Invoices that match go straight to payment approval.
          </p>
          <div className="actions">
            <TrialButton />
            <a className="text-link" href={DEMO}>
              Or book a demo
            </a>
          </div>
          <p className="fine">14 days free. No credit card.</p>
        </section>

        <section className="wrap section-tight" aria-label="Product illustration">
          <Illustration />
        </section>

        <section className="wrap section" aria-labelledby="how-title">
          <h2 id="how-title">How it works</h2>
          <ol className="steps">
            <li>
              <span className="step-n mono" aria-hidden="true">01</span>
              <h3>It reads the invoice</h3>
              <p>Supplier invoices arrive by email as PDF. Ploverdesk picks them up and reads every line.</p>
            </li>
            <li>
              <span className="step-n mono" aria-hidden="true">02</span>
              <h3>It matches three ways</h3>
              <p>Each line is compared with the purchase order and the delivery note it belongs to.</p>
            </li>
            <li>
              <span className="step-n mono" aria-hidden="true">03</span>
              <h3>You see the exceptions</h3>
              <p>Lines that agree are left alone. Lines that don’t are shown to a person, with the reason.</p>
            </li>
          </ol>
        </section>

        <section className="wrap section" aria-labelledby="flags-title">
          <div className="split">
            <h2 id="flags-title">What gets flagged</h2>
            <dl className="defs">
              <div>
                <dt>Wrong quantity</dt>
                <dd>The invoice bills for a different quantity than was ordered or delivered.</dd>
              </div>
              <div>
                <dt>Wrong unit price</dt>
                <dd>The price per unit on the invoice differs from the purchase order.</dd>
              </div>
              <div>
                <dt>Missing delivery</dt>
                <dd>The invoice bills for goods that no delivery note shows arriving.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="wrap section" aria-labelledby="after-title">
          <div className="split">
            <h2 id="after-title">After the match</h2>
            <dl className="defs">
              <div>
                <dt>Payment approval</dt>
                <dd>Invoices where every line matches go straight to payment approval.</dd>
              </div>
              <div>
                <dt>Export</dt>
                <dd>Matched invoices go to your accounting system as a CSV file or through an API.</dd>
              </div>
              <div>
                <dt>Hosting</dt>
                <dd>Your data is hosted in Frankfurt, in the EU.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="wrap section" aria-labelledby="price-title">
          <div className="split">
            <h2 id="price-title">Price</h2>
            <div className="price">
              <p className="price-figure">
                <span className="price-amount">290 EUR</span>
                <span className="price-unit">per month, per company</span>
              </p>
              <ul className="price-list">
                <li>No limit on users. Bring the whole finance team.</li>
                <li>14-day trial. No credit card needed.</li>
              </ul>
              <div className="actions">
                <TrialButton />
              </div>
            </div>
          </div>
        </section>

        <section className="wrap section" aria-labelledby="about-title">
          <div className="split">
            <h2 id="about-title">Who we are</h2>
            <div className="prose">
              <p>
                Ploverdesk was founded in 2025. We are six people in Rotterdam. We are new, so there are no
                customer logos on this page yet. The trial is the honest way to judge us: run your own
                invoices through it for 14 days.
              </p>
            </div>
          </div>
        </section>

        <section className="wrap closing" aria-labelledby="closing-title">
          <h2 id="closing-title">Start with your next invoice.</h2>
          <div className="actions">
            <TrialButton />
            <a className="text-link" href={DEMO}>
              Or book a demo
            </a>
          </div>
          <p className="fine">14 days free. No credit card. 290 EUR per month after that.</p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <span>Ploverdesk · Rotterdam</span>
          <span>Data hosted in Frankfurt, EU</span>
        </div>
      </footer>
    </>
  );
}
