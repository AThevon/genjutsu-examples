export type InvoiceStatus = "Draft" | "Sent" | "Overdue" | "Paid";

export interface Invoice {
  id: string;
  client: string;
  project: string;
  amount: number;
  issued: string;
  due: string;
  status: InvoiceStatus;
}

export const invoices: Invoice[] = [
  {
    id: "FOL-2026-031",
    client: "Vellumark Studio",
    project: "Autumn catalogue cover",
    amount: 1450,
    issued: "2026-09-01",
    due: "2026-09-15",
    status: "Paid",
  },
  {
    id: "FOL-2026-032",
    client: "Quillfern Press",
    project: "Picture book, 14 spreads",
    amount: 4200,
    issued: "2026-09-03",
    due: "2026-10-03",
    status: "Overdue",
  },
  {
    id: "FOL-2026-033",
    client: "Otterwick Coffee",
    project: "Menu illustrations",
    amount: 680,
    issued: "2026-09-08",
    due: "2026-09-22",
    status: "Overdue",
  },
  {
    id: "FOL-2026-034",
    client: "Gullwhistle Outdoor",
    project: "Trail map poster",
    amount: 1150,
    issued: "2026-09-12",
    due: "2026-10-12",
    status: "Sent",
  },
  {
    id: "FOL-2026-035",
    client: "The Lanternmoth Review",
    project: "Editorial spot, October issue",
    amount: 320,
    issued: "2026-09-18",
    due: "2026-10-02",
    status: "Paid",
  },
  {
    id: "FOL-2026-036",
    client: "Fennico Tea",
    project: "Tea packaging, three boxes",
    amount: 2400,
    issued: "2026-09-24",
    due: "2026-10-24",
    status: "Sent",
  },
  {
    id: "FOL-2026-037",
    client: "Hushwave Records",
    project: "Album sleeve",
    amount: 950,
    issued: "2026-10-01",
    due: "2026-10-31",
    status: "Sent",
  },
  {
    id: "FOL-2026-038",
    client: "Vellumark Studio",
    project: "Winter catalogue, six spots",
    amount: 1800,
    issued: "2026-10-03",
    due: "2026-10-31",
    status: "Draft",
  },
];

const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function formatAmount(amount: number): string {
  return money.format(amount);
}

export function formatDate(iso: string): string {
  return day.format(new Date(`${iso}T12:00:00`));
}
