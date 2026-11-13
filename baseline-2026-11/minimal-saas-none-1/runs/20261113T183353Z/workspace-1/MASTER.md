# Ploverdesk landing page: master notes

The reference for the page's content and design. If the page and this file disagree, fix one of them.

## Job of the page

Get a finance lead at a mid-size wholesaler to start the trial at `/trial`.
The only secondary action is a quieter link that books a demo at `/demo`. No other calls to action.

## Facts we may state (from the founders' brief, nothing else)

- Reads supplier invoices that arrive by email as PDF.
- Matches every line against the purchase order and the delivery note (three-way match).
- Shows a person only the lines that do not match: wrong quantity, wrong unit price, a delivery that never arrived.
- Invoices that match go straight to payment approval.
- Matched invoices are exported to the accounting system as CSV or through an API.
- Data hosted in Frankfurt, EU.
- 290 EUR per month per company, no limit on users.
- 14-day trial, no credit card.
- Founded 2025, six people, Rotterdam.

**Do not invent anything else:** no customer logos, testimonials, usage numbers, percentages, time-saved claims,
integrations by name, certifications or sample amounts. The product illustration uses words, not numbers.

## Voice

Plain, precise, a little dry. Write for someone who checks invoices for a living. Short sentences.
Name the thing ("unit price", "delivery note"), not the feeling. No exclamation marks, no "revolutionise".

## Design tokens

| Token | Value | Use |
|---|---|---|
| `--paper` | `#f7f6f2` | page background, warm off-white |
| `--surface` | `#ffffff` | the illustration panel |
| `--ink` | `#16181b` | body text, primary button |
| `--ink-2` | `#55595f` | secondary text (6.5:1 on paper) |
| `--rule` | `#dcdad3` | hairlines |
| `--flag` | `#9a3412` | the only accent: marks a mismatched line, nothing else |

- Type: system UI sans stack for text, system monospace for document labels inside the illustration. No web fonts (no network, and nothing decorative).
- Scale: 15/17/20/28/clamp(34–52) px. Headings weight 500, tight tracking on the H1 only.
- Layout: single column, max width 1080px, generous vertical spacing (96px between sections on desktop), 1px rules separate sections.
- Buttons: one filled ink button ("Start free trial"); the demo link is a plain underlined text link.
- No shadows, gradients, icons, illustrations of people or animation. Only colour is the rust accent for mismatches.

## Sections

1. Header: wordmark, "Book a demo" text link, "Start free trial" button.
2. Hero: the promise (you see only the lines that don't match), CTA, note "14 days, no credit card".
3. Illustration: an exceptions view in words: matched lines collapsed, one line flagged per mismatch type.
4. How it works: read, match, review.
5. What gets flagged: quantity, unit price, missing delivery.
6. After the match: payment approval, export CSV/API, hosting in Frankfurt.
7. Price: one plan.
8. Who we are: founded 2025, six people, Rotterdam. Honest that we are new.
9. Closing CTA.
10. Footer.
