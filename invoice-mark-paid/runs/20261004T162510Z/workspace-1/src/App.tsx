import { useState } from "react";
import InvoiceList from "./InvoiceList";
import LedgerFigure from "./LedgerFigure";
import { formatAmount, invoices as initialInvoices, type Invoice } from "./data";

export default function App() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  const outstanding = invoices
    .filter((invoice) => invoice.status === "Sent" || invoice.status === "Overdue")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const paid = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueCount = invoices.filter((invoice) => invoice.status === "Overdue").length;

  const [announcement, setAnnouncement] = useState("");

  function markPaid(id: string) {
    const target = invoices.find((invoice) => invoice.id === id);
    if (!target || target.status === "Paid") return;
    setInvoices((current) =>
      current.map((invoice) => (invoice.id === id ? { ...invoice, status: "Paid" } : invoice)),
    );
    setAnnouncement(`${target.id} marked as paid. ${formatAmount(target.amount)} moved from Outstanding to Paid.`);
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
          <LedgerFigure label="Outstanding" value={outstanding} />
          <LedgerFigure label="Paid" value={paid} delay={0.12} />
          <div>
            <dt>Overdue</dt>
            <dd>{overdueCount}</dd>
          </div>
        </dl>

        <InvoiceList invoices={invoices} onMarkPaid={markPaid} />
        <p className="visually-hidden" role="status">
          {announcement}
        </p>
      </main>
    </div>
  );
}
