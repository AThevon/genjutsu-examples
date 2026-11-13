import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { lines, mismatchLabel } from "./exampleInvoice";
import type { Line } from "./exampleInvoice";

const TRIAL = "/trial";
const DEMO = "/demo";

function Header() {
  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <a className="wordmark" href="/">
          Ploverdesk
        </a>
        <nav className="site-header__nav" aria-label="Main">
          <a className="link" href={DEMO}>
            Book a demo
          </a>
          <a className="btn btn-primary btn-small" href={TRIAL}>
            Start the 14-day trial
          </a>
        </nav>
      </div>
    </header>
  );
}

type Phase = "resolved" | "pending" | "resolving";

function readMs(name: string): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  return Number.parseFloat(raw) || 0;
}

function Amount({ quantity, price, mark }: { quantity: number; price: string; mark?: "quantity" | "price" }) {
  return (
    <>
      {mark === "quantity" ? <mark className="diff">{quantity}</mark> : <span>{quantity}</span>}
      <span className="times" aria-label="at">
        {" × "}
      </span>
      {mark === "price" ? <mark className="diff">{price}</mark> : <span>{price}</span>}
    </>
  );
}

function SheetRow({ line, index }: { line: Line; index: number }) {
  const m = line.mismatch;
  const invoiceMark = m === "quantity" || m === "price" ? m : undefined;
  return (
    <tr
      role="row"
      className={m ? "row row--exception" : "row row--matched"}
      style={{ "--i": index } as CSSProperties}
    >
      <th role="rowheader" scope="row" className="cell cell--item">
        {line.item}
      </th>
      <td role="cell" className="cell cell--num" data-label="Invoice">
        <Amount quantity={line.invoice.quantity} price={line.invoice.price} mark={invoiceMark} />
      </td>
      <td role="cell" className="cell cell--num" data-label="Purchase order">
        <Amount quantity={line.order.quantity} price={line.order.price} />
      </td>
      <td role="cell" className="cell cell--num" data-label="Delivery note">
        {line.delivered === null ? (
          <mark className="diff">None received</mark>
        ) : m === "delivery" ? (
          <mark className="diff">{line.delivered}</mark>
        ) : (
          line.delivered
        )}
      </td>
      <td role="cell" className="cell cell--status">
        <span className="status">{m ? mismatchLabel[m] : "Matched"}</span>
      </td>
    </tr>
  );
}

function Sheet() {
  const [phase, setPhase] = useState<Phase>("resolved");
  const [exceptionsOnly, setExceptionsOnly] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const matched = lines.filter((l) => !l.mismatch).length;
  const exceptions = lines.length - matched;
  const visible = exceptionsOnly ? lines.filter((l) => l.mismatch) : lines;

  function runAgain() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("resolved");
      return;
    }
    timers.current.forEach((t) => window.clearTimeout(t));
    setPhase("pending");
    // Two frames so the pending state paints before the staggered resolution starts.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setPhase("resolving");
        const total =
          readMs("--dur-max") + (visible.length - 1) * readMs("--stagger") + readMs("--dur-status");
        timers.current.push(window.setTimeout(() => setPhase("resolved"), total));
      }),
    );
  }

  return (
    <figure className="sheet" aria-labelledby="sheet-caption">
      <div className="sheet__bar">
        <figcaption id="sheet-caption" className="sheet__caption">
          <span className="sheet__title">Example invoice, checked line by line</span>
          <span className="sheet__note">
            An illustration of a three-way match. The items and amounts are made up for this page.
          </span>
        </figcaption>
        <div className="sheet__controls">
          <label className="toggle">
            <input
              type="checkbox"
              checked={exceptionsOnly}
              onChange={(e) => setExceptionsOnly(e.target.checked)}
            />
            Show exceptions only
          </label>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={runAgain}
            disabled={phase !== "resolved"}
          >
            Run the match again
          </button>
        </div>
      </div>

      <table className="sheet__table" role="table" data-phase={phase}>
        <thead role="rowgroup">
          <tr role="row" className="row row--head">
            <th role="columnheader" scope="col" className="cell cell--item">
              Line
            </th>
            <th role="columnheader" scope="col" className="cell cell--num">
              Invoice
              <span className="cell__sub">qty × unit price, EUR</span>
            </th>
            <th role="columnheader" scope="col" className="cell cell--num">
              Purchase order
              <span className="cell__sub">qty × unit price, EUR</span>
            </th>
            <th role="columnheader" scope="col" className="cell cell--num">
              Delivery note
              <span className="cell__sub">qty received</span>
            </th>
            <th role="columnheader" scope="col" className="cell cell--status">
              Result
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {visible.map((line, i) => (
            <SheetRow key={line.item} line={line} index={i} />
          ))}
        </tbody>
      </table>

      <p className="sheet__summary" aria-live="polite">
        {phase === "resolved"
          ? `${matched} of ${lines.length} lines match. ${exceptions} need a person: one quantity, one unit price, one delivery that never arrived. So this invoice waits for a person instead of going straight to payment approval.`
          : "Checking each line against the purchase order and the delivery note."}
      </p>
    </figure>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <h1 id="hero-title" className="hero__title">
          Your team sees only the invoice lines that do not match.
        </h1>
        <p className="lead">
          Ploverdesk reads the supplier invoices that arrive by email as PDF and checks every line
          against the purchase order and the delivery note. Invoices that match go straight to
          payment approval. The rest wait for a person, with the wrong line already marked.
        </p>
        <div className="actions">
          <a className="btn btn-primary" href={TRIAL}>
            Start the 14-day trial
          </a>
          <span className="actions__note">No credit card needed.</span>
          <a className="link" href={DEMO}>
            Book a demo
          </a>
        </div>
        <Sheet />
      </div>
    </section>
  );
}

const path = [
  {
    term: "It arrives",
    text: "Suppliers keep sending invoices by email, as PDF. Ploverdesk reads each one, line by line.",
  },
  {
    term: "It is matched",
    text: "Every line is compared with the purchase order and the delivery note: the quantity, the unit price, and whether the goods arrived.",
  },
  {
    term: "It is approved or flagged",
    text: "An invoice where every line agrees goes to payment approval. When a line does not, a person sees that line, and what it disagrees with.",
  },
  {
    term: "It is exported",
    text: "Matched invoices go to your accounting system as a CSV file or through the API.",
  },
];

function InvoicePath() {
  return (
    <section className="section" aria-labelledby="path-title">
      <div className="wrap path">
        <h2 id="path-title" className="h2">
          What happens to an invoice
        </h2>
        <dl className="path__list">
          {path.map((p) => (
            <div className="path__item" key={p.term}>
              <dt className="path__term">{p.term}</dt>
              <dd className="path__text">{p.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="section" aria-labelledby="price-title">
      <div className="wrap">
        <h2 id="price-title" className="h2">
          Price
        </h2>
        <div className="price">
          <p className="price__figure">
            <span className="price__amount">290 EUR</span>
            <span className="price__unit">per month, per company</span>
          </p>
          <ul className="price__facts">
            <li>No limit on users. Everyone in finance who approves or checks invoices can have a seat.</li>
            <li>A 14-day trial, with no credit card.</li>
            <li>Export to your accounting system as CSV or through the API.</li>
            <li>Your data is hosted in Frankfurt, in the EU.</li>
          </ul>
          <div className="actions price__actions">
            <a className="btn btn-primary" href={TRIAL}>
              Start the 14-day trial
            </a>
            <a className="link" href={DEMO}>
              Book a demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__row">
        <p>Ploverdesk was founded in 2025. We are six people in Rotterdam.</p>
        <p>
          <a className="link" href={TRIAL}>
            Start the 14-day trial
          </a>
          <a className="link" href={DEMO}>
            Book a demo
          </a>
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <InvoicePath />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
