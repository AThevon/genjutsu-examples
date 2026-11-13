import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatAmount, formatDate, type Invoice, type InvoiceStatus } from "./data";

interface InvoiceListProps {
  invoices: Invoice[];
  onMarkPaid: (id: string) => void;
  onUndoPaid: (id: string, previous: InvoiceStatus) => void;
}

/** How long the Undo stays offered. The clock pauses while it is hovered or focused. */
const UNDO_WINDOW_MS = 8000;

export default function InvoiceList({ invoices, onMarkPaid, onUndoPaid }: InvoiceListProps) {
  // Invoices paid during this session, with the status to restore if the user undoes.
  const [justPaid, setJustPaid] = useState<Map<string, InvoiceStatus>>(() => new Map());
  // Invoices whose "Mark as paid" was pressed from the keyboard; their Undo takes focus.
  const keyboardPaid = useRef(new Set<string>());
  const actionButtons = useRef(new Map<string, HTMLButtonElement>());

  function markPaid(invoice: Invoice, button: HTMLButtonElement) {
    if (button.matches(":focus-visible")) keyboardPaid.current.add(invoice.id);
    setJustPaid((current) => new Map(current).set(invoice.id, invoice.status));
    onMarkPaid(invoice.id);
  }

  function forget(id: string) {
    keyboardPaid.current.delete(id);
    setJustPaid((current) => {
      const next = new Map(current);
      next.delete(id);
      return next;
    });
  }

  function undo(id: string, previous: InvoiceStatus) {
    forget(id);
    onUndoPaid(id, previous);
    // "Mark as paid" comes back in the same cell; hand focus back to it once it has rendered.
    requestAnimationFrame(() => actionButtons.current.get(id)?.focus());
  }

  return (
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
      <tbody>
        {invoices.map((invoice) => {
          // Set only while this row's payment is fresh: the status Undo would restore.
          const restore = invoice.status === "Paid" ? justPaid.get(invoice.id) : undefined;
          const payable = invoice.status === "Sent" || invoice.status === "Overdue";

          return (
            <tr key={invoice.id} className={restore !== undefined ? "just-paid" : undefined}>
              <td className="mono">{invoice.id}</td>
              <td>{invoice.client}</td>
              <td className="muted">{invoice.project}</td>
              <td className="num amount">{formatAmount(invoice.amount)}</td>
              <td>{formatDate(invoice.issued)}</td>
              <td>{formatDate(invoice.due)}</td>
              <td>
                <StatusPill status={invoice.status} />
              </td>
              <td className="actions">
                {payable ? (
                  <motion.button
                    type="button"
                    ref={(node) => {
                      if (node) actionButtons.current.set(invoice.id, node);
                      else actionButtons.current.delete(invoice.id);
                    }}
                    whileTap={{ scale: 0.96 }}
                    onClick={(event) => markPaid(invoice, event.currentTarget)}
                  >
                    Mark as paid
                  </motion.button>
                ) : restore !== undefined ? (
                  <UndoOffer
                    label={`Undo marking ${invoice.id} as paid`}
                    takeFocus={keyboardPaid.current.has(invoice.id)}
                    onUndo={() => undo(invoice.id, restore)}
                    onExpire={() => forget(invoice.id)}
                  />
                ) : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function StatusPill({ status }: { status: InvoiceStatus }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        className={`status status-${status.toLowerCase()}`}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
        transition={
          reduceMotion
            ? { duration: 0.12 }
            : { type: "spring", stiffness: 520, damping: 24, opacity: { duration: 0.1 } }
        }
      >
        {status === "Paid" ? <PaidCheck /> : null}
        {status}
      </motion.span>
    </AnimatePresence>
  );
}

function PaidCheck() {
  const reduceMotion = useReducedMotion();
  return (
    <svg className="status-icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <motion.path
        d="M2.5 6.4 4.9 8.7 9.5 3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.32, delay: 0.12, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}

interface UndoOfferProps {
  label: string;
  onUndo: () => void;
  onExpire: () => void;
  takeFocus: boolean;
}

/**
 * Takes the place of "Mark as paid" for a few seconds. When the payment was made from the
 * keyboard it takes focus, so the user is not dropped onto <body> when their button vanishes;
 * the window then stays open for as long as focus (or the pointer) rests on it.
 */
function UndoOffer({ label, onUndo, onExpire, takeFocus }: UndoOfferProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [held, setHeld] = useState(false);
  const remaining = useRef(UNDO_WINDOW_MS);
  const expire = useRef(onExpire);
  expire.current = onExpire;

  useEffect(() => {
    if (takeFocus) ref.current?.focus({ preventScroll: true });
  }, [takeFocus]);

  useEffect(() => {
    if (held) return;
    const startedAt = performance.now();
    const timer = window.setTimeout(() => expire.current(), remaining.current);
    return () => {
      window.clearTimeout(timer);
      // Resuming after a pause always leaves a moment to act.
      remaining.current = Math.max(1500, remaining.current - (performance.now() - startedAt));
    };
  }, [held]);

  return (
    <motion.span
      className="undo-offer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.25 }}
    >
      <span className="undo-note">Paid just now</span>
      <button
        ref={ref}
        type="button"
        className="link"
        aria-label={label}
        onClick={onUndo}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
      >
        Undo
      </button>
    </motion.span>
  );
}
