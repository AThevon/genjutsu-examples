import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import AnimatedAmount from "./AnimatedAmount";
import InvoiceList from "./InvoiceList";
import { formatAmount, invoices as initialInvoices, type Invoice, type InvoiceStatus } from "./data";

/** The total follows the row by a beat, so the eye reads cause then effect. */
const TOTAL_DELAY = 0.15;

interface Landing {
  key: number;
  amount: number;
}

const formatCount = (value: number) => String(Math.round(value));

export default function App() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [landing, setLanding] = useState<Landing | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const reduceMotion = useReducedMotion();

  // The "+€" chip is a moment, not a fixture.
  useEffect(() => {
    if (!landing) return;
    const timer = window.setTimeout(() => setLanding(null), 2800);
    return () => window.clearTimeout(timer);
  }, [landing]);

  const outstanding = invoices
    .filter((invoice) => invoice.status === "Sent" || invoice.status === "Overdue")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const paid = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueCount = invoices.filter((invoice) => invoice.status === "Overdue").length;

  function setStatus(id: string, status: InvoiceStatus) {
    setInvoices((current) =>
      current.map((invoice) => (invoice.id === id ? { ...invoice, status } : invoice)),
    );
  }

  function markPaid(id: string) {
    const invoice = invoices.find((item) => item.id === id);
    if (!invoice) return;
    setStatus(id, "Paid");
    setLanding({ key: Date.now(), amount: invoice.amount });
    setAnnouncement(`${formatAmount(invoice.amount)} from ${invoice.client} received. ${id} marked as paid.`);
  }

  function undoPaid(id: string, previous: InvoiceStatus) {
    setStatus(id, previous);
    setLanding(null);
    setAnnouncement(`${id} is back to ${previous.toLowerCase()}.`);
  }

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">Folio</span>
        <nav aria-label="Main">
          <a href="#" aria-current="page">Invoices</a>
          <a href="#">Clients</a>
          <a href="#">Settings</a>
        </nav>
      </header>

      <main className="page">
        <div className="page-head">
          <h1>Invoices</h1>
          <button type="button" className="secondary">New invoice</button>
        </div>

        <dl className="summary">
          <div>
            <dt>Outstanding</dt>
            <dd>
              <AnimatedAmount value={outstanding} format={formatAmount} delay={TOTAL_DELAY} />
            </dd>
          </div>
          <div className="summary-paid">
            {landing ? <span key={landing.key} className="summary-glow" aria-hidden="true" /> : null}
            <dt>Paid</dt>
            <dd>
              <AnimatedAmount value={paid} format={formatAmount} delay={TOTAL_DELAY} />
              <AnimatePresence>
                {landing ? (
                  <motion.span
                    key={landing.key}
                    className="landed-delta"
                    aria-hidden="true"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: TOTAL_DELAY, ease: [0.16, 1, 0.3, 1] }}
                  >
                    +{formatAmount(landing.amount)}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </dd>
          </div>
          <div>
            <dt>Overdue</dt>
            <dd>
              <AnimatedAmount value={overdueCount} format={formatCount} delay={TOTAL_DELAY} />
            </dd>
          </div>
        </dl>

        <InvoiceList invoices={invoices} onMarkPaid={markPaid} onUndoPaid={undoPaid} />

        <p className="visually-hidden" role="status">
          {announcement}
        </p>
      </main>
    </div>
  );
}
