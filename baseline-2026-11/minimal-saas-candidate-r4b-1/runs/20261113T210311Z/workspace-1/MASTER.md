# Ploverdesk: design system (MASTER)

Single source of truth for the landing page. Every value in `src/tokens.css` comes from here.

## Theses (UNVALIDATED: headless run, carried as written)

**Visual thesis.** A white, cool-neutral page set like an auditor's tick-and-tie sheet: near-black
ink, hairline rules, and one colour only, a burnt-orange signal that marks a line that does not
match. The action (Start trial) is solid ink, so the signal never stands for the action. Type is
the system sans: no web face can be loaded offline, and the brief forbids decoration, so the
voice comes from tabular figures, two weights (400, 600) and a tight scale. Airy on an 8px base,
one left edge on a 72rem container for every section. Square 2px corners, bordered, flat, no
shadows.

`First screen:` the headline and both actions at reading measure (36rem); below them, at container
width, an example match sheet: one supplier invoice checked against its purchase order and its
delivery note, as a real `<table>`. One row covers the lines that agree three times and go to
payment approval, set in the recede grey. Three rows carry the brief's own mismatches (wrong
quantity, wrong unit price, delivery never arrived), the disagreeing document flagged in signal.
No figures, only the brief's words. Labelled "Example". On a wide frame (1440x900) headline and
sheet both stand before any scroll. Under 40rem each row becomes a stacked block, every value
beside its document name. At rest it already shows the final state.

**Interaction thesis.** Fast and dry: 150ms colour changes on hover (the button darkens, links
gain an underline), no scroll reveals, no parallax, no scale, no shadows, no loops, no bounce.

`The one motion:` on page load, after 500ms, the matching row recedes from ink to grey over 400ms,
`cubic-bezier(0.2, 0, 0, 1)`, once. If it never runs, or under `prefers-reduced-motion`, the row
is grey from the start: the grey is the resting style, the animation only starts from ink.

`Allowed patterns:` hairline rules on the rows of the match sheet and the spec list; the example
match sheet, labelled "Example"; the tabular layout of the specs.

`Set aside:` SaaS hero with feature cards and logo strip; one centred sentence; ledger grid; Swiss
minimal type. `Kept:` the auditor's tick-and-tie sheet.

## Dials

| Dial | Value | From the thesis clause |
|---|---|---|
| variance | 2 | "square-cornered, flat, one left edge" |
| motion | 2 | "fast and dry, no scroll reveals" |
| density | 3 | "airy on an 8px base" |

Dataset proposal: kept the cool slate neutral family and hairline weight. Dropped the blue CTA
accent, Plus Jakarta Sans, 900-weight oversized type, scroll reveal, destructive red.

## Colour

| Token | Hex | Job | Contrast |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | page ground | |
| `--color-surface` | `#F5F6F7` | sheet header band, spec labels ground | |
| `--color-ink` | `#14181D` | text, the action (filled button) | 17.8:1 on bg |
| `--color-ink-2` | `#4A525B` | secondary text | 7.9:1 on bg, 7.3:1 on surface |
| `--color-recede` | `#646C75` | matched lines, notes | 5.3:1 on bg, 4.9:1 on surface |
| `--color-rule` | `#DDE1E5` | hairlines (decorative separators) | |
| `--color-signal` | `#9C3D08` | a line that does not match. Nothing else. | 6.8:1 on bg, 6.1:1 on tint |
| `--color-signal-tint` | `#FCF0E8` | ground of a flagged cell | |
| `--color-action` | `#14181D` | primary button | white on it 17.8:1 |
| `--color-action-hover` | `#2E353D` | primary button hover | white on it 12.4:1 |
| `--color-action-active` | `#000000` | primary button pressed | |
| `--color-on-action` | `#FFFFFF` | label on the button | |
| `--color-disabled` | `#E3E6E9` | disabled button ground (label in `--color-recede`) | |
| `--color-focus` | `#14181D` | focus outline, 2px, offset 2px | 17.8:1 on bg |

Semantic: success, warning, info are not used on this page. The only status is "does not match",
which is `--color-signal`. No dark theme.

## Typography

- Stack: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- `font-variant-numeric: tabular-nums` on the body.
- Weights: 400 (text), 600 (headings, labels, the action). Nothing else.

| Token | Value | Use |
|---|---|---|
| `--text-sm` | 0.875rem / 1.5 | labels, notes, table headers |
| `--text-base` | 1rem / 1.55 | body |
| `--text-md` | 1.125rem / 1.55 | lede |
| `--text-lg` | 1.5rem / 1.3 | section headings, price |
| `--text-xl` | clamp(2rem, 1.5rem + 2vw, 2.75rem) / 1.15, -0.01em | h1 |

## Spacing (8px base, 4px half-step)

`--space-1` 4px, `--space-2` 8px, `--space-3` 12px, `--space-4` 16px, `--space-5` 24px,
`--space-6` 32px, `--space-7` 48px, `--space-8` 64px, `--space-9` 96px, `--space-10` 128px.

## Layout

- `--container` 72rem, gutter `--gutter` clamp(1.25rem, 4vw, 3rem). One left edge for every section.
- `--measure` 36rem for running text. `--measure-wide` 44rem for the h1 only, so it holds two
  lines and the whole match sheet stands before the fold on a short wide frame.
- Under 30rem the header keeps the wordmark and Start trial; Book a demo stays one line below,
  in the hero actions.
- `--label-col` 12rem: label column of the spec list and the price block. `--label-col-narrow` 9rem: document-name column of a stacked sheet row.
- Match sheet and spec list: container width, set by their columns.
- Narrow break: 40rem (sheet rows stack).

## Radii and elevation

`--radius-0` 0, `--radius-1` 2px. Elevation: level 0 only, no shadows anywhere.

## Motion

| Token | Value |
|---|---|
| `--dur-fast` | 150ms (hover, focus colour) |
| `--dur-recede` | 400ms (the one motion) |
| `--delay-recede` | 500ms |
| `--ease-out` | cubic-bezier(0.2, 0, 0, 1) |

No stagger. `prefers-reduced-motion: reduce` removes every animation and transition.

## Components

- **Button (primary, "Start trial")**: ink fill, white label, 600, `--space-3` x `--space-5`,
  radius 2px. Hover: action-hover. Active: action-active. Focus-visible: 2px ink outline, 2px
  offset. Disabled: `--color-disabled` ground, recede label, no pointer.
- **Link (quiet, "Book a demo")**: ink text, underline 1px offset 4px in `--color-rule`; hover:
  underline turns ink; active: ink-2; focus-visible: same outline as the button.
- **Sheet** (table): hairline under each row, header on surface band, flagged cell = signal text
  on signal tint, 600.
- **Spec list** (`dl`): label column in ink-2, value in ink, hairline under each row.
- One label for the action everywhere: "Start trial". One for the second: "Book a demo".
