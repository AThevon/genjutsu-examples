# Ploverdesk landing page &#8212; master notes

## Goal
One job: a finance lead starts the 14-day trial at `/trial`. Secondary, quieter: book a demo at `/demo`.

## Facts allowed on the page (from the brief, nothing else)
- For finance teams of mid-size wholesalers; sold to companies.
- Reads supplier invoices that arrive by email as PDF.
- Three-way match of every line: invoice vs purchase order vs delivery note.
- Shows a person only the lines that don't match: wrong quantity, wrong unit price, delivery that never arrived.
- Matched invoices go straight to payment approval.
- Export to accounting as CSV or via API.
- Data hosted in Frankfurt, EU.
- 290 EUR / month per company, no limit on users. 14-day trial, no credit card.
- Founded 2025, six people, Rotterdam.

Not allowed: logos, testimonials, usage numbers, time-saved claims, certifications,
named accounting integrations, sample invoices with made-up quantities or prices.

## Decisions
- The product illustration is a schematic of the three-way match with no numbers:
  check fields (quantity, unit price, delivery) per document, one row flagged.
- The only figures on the page are 290 EUR, 14 days, 2025 and six.
- Primary CTA appears three times (header, hero, pricing). Demo link is a plain text link.

## Style
- Minimal and restrained: white/warm off-white background, near-black ink, one muted accent
  (deep green) used only for the primary button and the "matched" state; a muted rust for "flagged".
- System font stack (no network, no webfonts). Tabular numerals in the schematic.
- Hairline 1px rules instead of cards, shadows or gradients. No icons, no illustrations, no animation.
- Single column, max width ~68rem; text measure ~36rem.
- Accessible: AA contrast, visible focus ring, semantic landmarks, skip link, states never conveyed by colour alone.
