# Ploverdesk landing page: design plan

## Subject, audience, job
- Subject: three-way matching of supplier invoices (invoice vs purchase order vs delivery note) for mid-size wholesalers.
- Audience: the finance lead at a wholesaler. They read invoices for a living, and they trust tables more than adjectives.
- Job: start the trial at `/trial`. The quieter second action is booking a demo at `/demo`.

## Core idea
The page should do what the product does: it shows everything, then steps back so that only the exceptions remain.
The hero is an example invoice after matching. Lines that match fade back to grey. The three lines that don't
match stay in ink, with the cell that differs marked in correction red and a plain sentence saying why.
That's the one memorable element on the page. Everything else stays quiet.

## Color (only used where it means something)
| Name   | Hex       | Role |
|--------|-----------|------|
| Paper  | `#F5F6F7` | Page background. Cool, like copier paper (deliberately not cream) |
| Sheet  | `#FFFFFF` | The invoice surface |
| Ink    | `#1A2533` | Text and the primary button. A blue-black, like ballpoint ink |
| Pencil | `#6A7380` | Secondary text and matched lines |
| Rule   | `#D6DBE1` | Table rules and dividers (only on tabular content) |
| Flag   | `#B3261E` | Mismatches only. Never used for decoration or for buttons |

## Type
- One family: Avenir Next (macOS/iOS), falling back to Segoe UI, then system-ui. No web fonts, because the build has no network.
- Figures: `tabular-nums` everywhere numbers sit in columns.
- Scale (base 18px, ratio 1.25): 14.4 / 18 / 22.5 / 28 / 35 / 44–56 (clamped headline).
- Weights: 400 body, 600 headings. Headline uses -0.015em tracking. Sentence case throughout, no all caps, no eyebrows.
- Measure: prose at most 62ch.

## Layout (left-aligned, single column, with a wider band for the table)
```
[Ploverdesk]                         Book a demo   [Start free trial]

Your team checks only the
invoice lines that don't match.
Ploverdesk reads supplier invoices ... (≤62ch)
[Start your 14-day trial]  No credit card needed. Or book a demo.

┌ Example invoice, eight lines ──────────────── [Show all lines] ┐
│ Item              Purchase order  Delivery note   Invoice      │
│ Hinge 80 mm         120 × 1.95     120             120 × 1.95  │  (grey)
│ Cabinet handle      200 × 3.40     200             200 × 3.65  │  ← price in red + note
│ Drawer runner        60 × 6.20      48              60 × 6.20  │  ← qty in red + note
│ Shelf bracket        40 × 2.15     not delivered    40 × 2.15  │  ← red + note
└────────────────────────────────────────────────────────────────┘

How it works        1 Invoice arrives  2 Lines matched  3 Exceptions to a person  4 Export
(real sequence, so numbering is justified)

The details         Hosting: Frankfurt, EU / Export: CSV or API / Price
Price               290 EUR per month per company. No limit on users.
Who we are          Founded in 2025. Six people in Rotterdam.
Closing CTA
```
The text-and-table layout is a two-column definition list on desktop and stacks on mobile.

## Principles
1. Show the exception, not the claim. The page has no logos, testimonials or statistics because there are none. The example invoice is labelled as an example.
2. Red means a mismatch, and nothing else uses red.
3. Rules and numbers only where the content really is a table or a sequence.
4. One motion: on load, matched rows recede (respecting reduced motion). The only other motion is the user's own "Show all lines / Show only mismatches" toggle.
5. Copy is written in plain language and active voice, and the CTA names what happens.

## Review against generic defaults (what I changed)
- First instinct: a warm off-white with a serif display. That's the cream/serif default, so I switched to cool paper and one sans family.
- First instinct: feature cards for "wrong quantity / wrong price / not delivered". That's the SaaS card kit, so I dropped it. The three cases now appear as real rows in the example invoice.
- First instinct: red accent on the CTA. That would weaken the meaning of red, so the CTA is ink.
- Considered a stats strip. Dropped, because the brief forbids invented figures. Example invoice values are shown as illustrative and labelled "Example".
