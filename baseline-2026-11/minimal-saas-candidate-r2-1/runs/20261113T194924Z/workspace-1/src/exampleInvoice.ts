// Illustrative data for the example sheet on the landing page.
// Not customer data, not a product screenshot. The page labels it as an example.

export type Field = "quantity" | "price" | "delivery";

export interface Line {
  item: string;
  invoice: { quantity: number; price: string };
  order: { quantity: number; price: string };
  /** Quantity on the delivery note; null when no delivery was received. */
  delivered: number | null;
  /** The field that does not match, or null when the line matches. */
  mismatch: Field | null;
}

export const lines: Line[] = [
  { item: "Stretch film, 500 mm", invoice: { quantity: 36, price: "21.40" }, order: { quantity: 36, price: "21.40" }, delivered: 36, mismatch: null },
  { item: "Corrugated box, 400 × 300", invoice: { quantity: 240, price: "0.86" }, order: { quantity: 200, price: "0.86" }, delivered: 200, mismatch: "quantity" },
  { item: "Packing tape, 48 mm", invoice: { quantity: 144, price: "1.12" }, order: { quantity: 144, price: "1.12" }, delivered: 144, mismatch: null },
  { item: "Pallet corner board", invoice: { quantity: 80, price: "0.47" }, order: { quantity: 80, price: "0.47" }, delivered: 80, mismatch: null },
  { item: "Label roll, 100 × 150", invoice: { quantity: 24, price: "7.95" }, order: { quantity: 24, price: "7.35" }, delivered: 24, mismatch: "price" },
  { item: "Strapping band, 12 mm", invoice: { quantity: 18, price: "16.20" }, order: { quantity: 18, price: "16.20" }, delivered: 18, mismatch: null },
  { item: "Void fill paper", invoice: { quantity: 12, price: "38.60" }, order: { quantity: 12, price: "38.60" }, delivered: null, mismatch: "delivery" },
  { item: "Shipping bag, C4", invoice: { quantity: 500, price: "0.09" }, order: { quantity: 500, price: "0.09" }, delivered: 500, mismatch: null },
];

export const mismatchLabel: Record<Field, string> = {
  quantity: "Quantity differs from the order",
  price: "Unit price differs from the order",
  delivery: "No delivery received",
};
