# Ploverdesk landing page &#8212; design master

## Subject, audience, job
- Subject: three-way matching of supplier invoices (invoice / purchase order / delivery note) for mid-size wholesalers.
- Audience: the finance lead of a mid-size wholesaler. Reads numbers for a living; distrusts marketing.
- Job: start the trial at `/trial`. Secondary, quieter: book a demo at `/demo`.

## Tokens

### Colour
| Name      | Hex       | Role |
|-----------|-----------|------|
| Paper     | `#F6F7F5` | Page background. Neutral, faintly cool: office paper, not cream. |
| Ink       | `#1C2430` | Text, primary button. A ledger-ink blue-black, chosen, not a default near-black. |
| Slate     | `#5A6472` | Secondary text. |
| Rule      | `#D8DCE1` | Table rules and section dividers. Only where they separate data. |
| Matched   | `#98A1AC` | Lines that matched: present, but receding. |
| Exception | `#B42318` | Red ink. Used **only** for a value that does not match and its reason. |

Red is never decorative. If something is red on this page, it is a discrepancy.

### Type
- One family: Avenir Next (macOS/iOS), falling back to Segoe UI / system sans. No webfonts are available offline, so the choice is a deliberate system face: humanist-geometric, calm, precise.
- Weights: 400 body, 600 (Demi Bold) for headings and the wordmark. No italics as accent.
- Figures: `font-variant-numeric: tabular-nums` everywhere numbers sit in columns.
- Scale (classical): 14 / 18 / 24 / 36 / 48. Body 18/1.55. Measure ≤ 64ch.
- Sentence case throughout. No all-caps labels, no eyebrows.

### Layout
Left-aligned single column on a 12-col idea, content max 1080px, prose max 64ch.

```
Ploverdesk                                   Book a demo  [Start trial]
------------------------------------------------------------------------
Only the invoice lines that
don't match reach your desk.          (h1, 48, left)
Sub (64ch)
[Start 14-day trial]  No credit card needed.   Book a demo

+-- Example invoice --------------------------------------------------+
| Item            Invoiced  Ordered  Delivered  Price  Order price    |
| ...matched lines (grey) collapse away after load...                 |
| Nut M8          60        60       48 (red)   ...    reason (red)   |
|                                          [Show all 7 lines]         |
+---------------------------------------------------------------------+

From inbox to approval         1 2 3 4  (a real sequence, so numbered)

Practical details              definition list: export, hosting, users

290 EUR per month, per company.   [Start 14-day trial]

Six people in Rotterdam. Started 2025. Honest about being new. Book a demo.
```

### Principles
1. The product is the hero. The memorable element is a working example of the three-way match: on load, matched lines fold away and only the three exceptions stay. One orchestrated moment; nothing else moves on its own.
2. Red means "does not match". Nothing else uses the accent.
3. No invented proof: no logos, testimonials, metrics. The example invoice is labelled as an example.
4. Structure is information: rules only in the table and between sections; numbering only for the real four-step flow.

## Review against the brief (revisions)
- First draft had a three-column feature-card grid (export / hosting / users). That is the SaaS-card default. Replaced with a plain definition list: these are facts a finance lead scans, not features.
- First draft had a "Trusted by finance teams" strip placeholder. Removed: the brief has no customers; replaced with an honest "we are new" section that routes to the trial.
- Considered a serif display on warm paper (reads "finance-y") &#8212; that is the cream + serif default. Kept a single sans on cool paper.
- Considered a monospace face for figures in the table. Replaced with tabular figures from the body face.

## Notes for future passes
- Tried: product-as-hero with self-filtering table. Not tried: a scroll-driven version.
