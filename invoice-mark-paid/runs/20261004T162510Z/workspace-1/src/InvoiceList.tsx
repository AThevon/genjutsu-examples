import { useRef } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Transition } from "motion/react";
import { formatAmount, formatDate, type Invoice } from "./data";

interface InvoiceListProps {
  invoices: Invoice[];
  onMarkPaid: (id: string) => void;
}

// The Paid pill lands like a stamp: a short overshoot, settled in about a quarter second.
const STAMP: Transition = { type: "spring", stiffness: 520, damping: 30, mass: 1 };
const LEAVE: Transition = { duration: 0.15, ease: "easeIn" };
// Reduced motion: no stamp, the new pill simply fades in.
const ARRIVE_FADE: Transition = { duration: 0.15, ease: "easeOut" };

export default function InvoiceList({ invoices, onMarkPaid }: InvoiceListProps) {
  const body = useRef<HTMLTableSectionElement>(null);
  const reduceMotion = useReducedMotion();

  function markPaid(button: HTMLButtonElement, id: string) {
    // The button is about to leave. Hand focus to the next unpaid invoice so the keyboard is not dropped on <body>.
    const buttons = Array.from(body.current?.querySelectorAll<HTMLButtonElement>("button[data-mark-paid]") ?? []);
    const index = buttons.indexOf(button);
    const next = buttons[index + 1] ?? buttons[index - 1];
    if (document.activeElement === button) next?.focus();
    onMarkPaid(id);
  }

  return (
    <MotionConfig reducedMotion="user">
      <table className="invoices">
        <thead>
          <tr>
            <th scope="col">Invoice</th>
            <th scope="col">Client</th>
            <th scope="col">Project</th>
            <th scope="col" className="num">Amount</th>
            <th scope="col">Issued</th>
            <th scope="col">Due</th>
            <th scope="col">Status</th>
            <th scope="col"><span className="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody ref={body}>
          {invoices.map((invoice) => {
            const payable = invoice.status === "Sent" || invoice.status === "Overdue";
            return (
              <tr key={invoice.id}>
                <td className="mono">{invoice.id}</td>
                <td>{invoice.client}</td>
                <td className="muted">{invoice.project}</td>
                <td className="num">{formatAmount(invoice.amount)}</td>
                <td>{formatDate(invoice.issued)}</td>
                <td>{formatDate(invoice.due)}</td>
                <td>
                  <span className="status-slot">
                    <AnimatePresence initial={false}>
                      <motion.span
                        key={invoice.status}
                        className={`status status-${invoice.status.toLowerCase()}`}
                        initial={{ opacity: 0, scale: 1.15 }}
                        animate={{ opacity: 1, scale: 1, transition: reduceMotion ? ARRIVE_FADE : STAMP }}
                        exit={{ opacity: 0, transition: LEAVE }}
                      >
                        {invoice.status}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </td>
                <td className="actions">
                  <AnimatePresence initial={false}>
                    {payable ? (
                      <motion.button
                        key="mark-paid"
                        type="button"
                        data-mark-paid=""
                        onClick={(event) => markPaid(event.currentTarget, invoice.id)}
                        whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                        exit={{ opacity: 0, x: 8, transition: LEAVE }}
                      >
                        Mark as paid
                      </motion.button>
                    ) : null}
                  </AnimatePresence>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </MotionConfig>
  );
}
