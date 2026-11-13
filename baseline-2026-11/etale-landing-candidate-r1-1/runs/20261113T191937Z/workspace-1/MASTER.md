# Étale - MASTER design system

Single source of truth for the Étale landing page. Every value in `src/tokens.css` comes from
this file; every component in `src/` reads `src/tokens.css`. Status: **UNVALIDATED** (headless
run, nobody could validate the theses or this system).

## Theses

**Visual thesis.** Étale is set as the current at SFB1204 read against one zero line: a cold
fog-green ground (#E3E8E5) under green-black ink (#0E1714), a single buoy orange (#B4430A) that
marks slack and nothing else, the iPhone's own system face (SF Pro on Apple devices, matched
fallbacks elsewhere) with tabular figures carrying the voice through very large slack times
against 13px source labels, airy margins around dense tide-table rows on a 4px base, flat,
nearly square components (2px radius) with no shadows, separated by space and one rule instead
of boxes.

**First screen.** Beside the headline and the TestFlight button, the whole of 2 October 2026 at
SFB1204 runs across the full width: flood stems above the zero line, ebb stems below, the three
slacks (05:57, 10:31, 16:17 PDT) as orange marks on it, each labelled with date and station;
the headline, the one line of copy and the slack readout stay at a 34rem measure, left-aligned
to the strip's 00:00 tick.

**Interaction thesis.** Fast and dry: 160ms colour changes on hover and press (no scale, no
lift, no shadow), nothing on scroll (no reveals, no parallax); forbidden: waves, ripples,
bobbing, looping animation, overshoot or bounce, gradient blobs, glass. The one motion: on load
the slack marker glides along the zero line from 00:00 to the first slack and stops, and when a
swimmer picks another slack (click, tap, arrow keys) it glides there, 640ms on
cubic-bezier(0.16, 1, 0.3, 1), decelerating to rest without overshoot, the current going still;
with reduced motion it is placed at once and only the readout changes.

**Allowed patterns:** the zero line (a 1px ink rule as the current axis); tabular figures;
station IDs (SFB1204, 9414290) as source labels under every figure; hour ticks on the day axis.
(Hairline rules on every table row were proposed and dropped at Phase 3: the thesis is
unvalidated, so the `tells` catalogue counts them.)

Set aside: phone mockup over a gradient with feature cards (routine); a bare one-link text page
(opposite); ocean-blue water photography; nautical-chart navy and brass. Kept: the current read
against its zero line.

### Assumptions (headless run, answered from the brief)

- Audience reads tide tables already: copy is terse, tabular, never explains the cove.
- Mood: exact, early, cold, still. No references were given; none were used.
- No photography: the data strip stands where a hero image would.
- No web font: there is no network and nobody to approve a third-party request. The system face
  is a decision: on iPhone, where the audience reads, it renders SF Pro, the face of the phone
  the app runs on. Voice comes from tabular figures at display size and weight contrast.
- Times in 12-hour form with AM/PM and PDT, as US printed tide tables give them.

### Dials sent to search.py

| Dial | Value | Clause |
|---|---|---|
| variance | 6 | "left-aligned text at a 34rem measure against a full-width strip" |
| motion | 2 | "fast and dry ... the one motion" |
| density | 5 | "airy margins around dense tide-table rows" (label only on this path; spacing derived by hand below) |

## Data rules

- Every figure comes from `data/tide.json`, imported at build time. Nothing is retyped.
- Every figure is labelled with its date (2 October 2026) and its station (SFB1204 or 9414290).
- Slack times come from `current_slack_and_max` (SFB1204), never from `highs_lows`.
- No water temperature, no sunrise, no user counts, no prices, no ratings.
- Heights in feet above MLLW. Current in knots; flood positive (into the bay), ebb negative.

## Color

| Token | Hex | Role | Contrast on ground |
|---|---|---|---|
| `--color-ground` | #E3E8E5 | page background, fog over the bay | - |
| `--color-surface` | #F1F4F2 | readout panel | - |
| `--color-ink` | #0E1714 | text, zero line, stems, primary button fill | 14.71:1 |
| `--color-ink-hover` | #26332E | primary button hover | ground text on it 10.62:1 |
| `--color-ink-press` | #3D4B46 | primary button active | ground text on it 7.39:1 |
| `--color-ink-2` | #3D4B46 | secondary text | 7.39:1 |
| `--color-ink-3` | #56645E | labels, source lines, ticks | 5.01:1 (5.61:1 on surface) |
| `--color-rule` | #9AA7A1 | one separating rule per section, decorative | 2.01:1 (non-text, decorative) |
| `--color-slack` | #B4430A | slack marks and the selected-slack marker, nothing else | 4.52:1 (5.06:1 on surface) |
| `--color-disabled-bg` | #C9D1CD | disabled button fill | - |
| `--color-disabled-ink` | #56645E | disabled button text | 3.99:1 on disabled fill (disabled controls are exempt) |

Semantic success / warning / error / info: not defined. The page has no form and no status.
The slack orange is never reused as a warning colour. Light only: the page has no dark theme.

## Typography

Stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
(token `--font-sans`). All figures `font-variant-numeric: tabular-nums`.

| Token | Value | Use |
|---|---|---|
| `--text-xs` | 0.8125rem (13px) | source labels, ticks |
| `--text-sm` | 0.9375rem (15px) | secondary lines, table |
| `--text-base` | 1.0625rem (17px) | body, the iOS body size |
| `--text-lg` | 1.375rem (22px) | readout lines, section intros |
| `--text-xl` | clamp(1.75rem, 1.2rem + 2vw, 2.5rem) | section headings |
| `--text-2xl` | clamp(2.25rem, 1.4rem + 3.4vw, 3.75rem) | page headline |
| `--text-display` | clamp(4rem, 1.5rem + 9vw, 8.5rem) | the selected slack time |

Weights: `--weight-regular` 400 body, `--weight-medium` 500 labels and readout, `--weight-bold` 600 headings and display.
Line height: `--leading-tight` 1.05 display, `--leading-snug` 1.15 headings, `--leading-body` 1.5 body.
Tracking: `--tracking-display` -0.03em, `--tracking-heading` -0.015em.

## Spacing (4px base)

`--space-1` 0.25rem · `--space-2` 0.5rem · `--space-3` 0.75rem · `--space-4` 1rem ·
`--space-5` 1.5rem · `--space-6` 2rem · `--space-7` 3rem · `--space-8` 4rem · `--space-9` 6rem ·
`--space-10` 8rem.

Layout: `--measure` 34rem (text), `--page-max` 75rem (strip and sections), `--gutter`
clamp(1.25rem, 4vw, 3rem). Sections are separated by `--space-9`, rows inside a table by
`--space-3`, never by a rule.

## Marks, plots and targets

| Token | Value | Use |
|---|---|---|
| `--line-hair` | 1px | the zero line, the MLLW datum line, the section rule |
| `--line-stem` | 2px | current stems, tide curve stroke, the marker line |
| `--focus-ring` / `--focus-offset` | 2px / 3px | focus-visible outline on every control |
| `--dot-slack` | 0.6875rem (11px) | hollow slack dot on the zero line |
| `--dot-marker` | 0.9375rem (15px) | filled marker dot on the selected slack |
| `--plot-strip` / `--plot-strip-narrow` | 15rem / 11rem | day strip plot height, wide / under 40rem |
| `--plot-tide` / `--plot-tide-narrow` | 16rem / 13rem | tide curve plot height, wide / under 40rem |
| `--tap-min` | 2.75rem (44px) | minimum touch target |

Breakpoints (media queries cannot read custom properties): 40rem (narrow to medium), 64rem
(two-column hero).

## Radii

`--radius-none` 0 (panels, table) · `--radius-sm` 2px (buttons, focus ring) · `--radius-full`
9999px (slack dots only).

## Shadows

None. Elevation level 0 only. A raised element is told by `--color-surface`, never by a shadow.

## Motion

| Token | Value | Use |
|---|---|---|
| `--dur-ui` | 160ms | colour change on hover and press |
| `--ease-ui` | ease-out | colour change |
| `--dur-settle` | 640ms | the slack marker glide |
| `--ease-settle` | cubic-bezier(0.16, 1, 0.3, 1) | the slack marker glide, never overshoots |
| `--stagger` | 0ms | nothing staggers |

Reduced motion: `--dur-settle` and `--dur-ui` drop to 0ms; the marker is placed at once.
Forbidden: scale, translate on hover, scroll-linked anything, `infinite`, springs, overshoot.

## Base components

- **Primary button** (`.btn`): ink fill, ground text, `--text-base` weight 600, padding
  `--space-4` `--space-5`, `--radius-sm`. Hover `--color-ink-hover`; active `--color-ink-press`;
  focus-visible 2px ink outline, offset 3px; disabled `--color-disabled-bg` /
  `--color-disabled-ink`, `cursor: not-allowed`. One label everywhere: "Join the TestFlight beta".
- **Link** (`.link`): ink, underline 1px, offset 0.2em. Hover underline 2px; focus-visible as
  button; active `--color-ink-2`.
- **Slack picker** (`.slack-pick`): a time and a slack dot, transparent ground. Hover: time
  turns ink and the dot fills; focus-visible as button; active (pressed) `--color-surface`
  background; selected (`aria-pressed=true`) dot filled orange, time weight 600; disabled never
  used, styled with `--color-ink-3` and `cursor: not-allowed`.
- **Readout panel** (`.readout`): `--color-surface`, no border, no radius, padding `--space-5`.
- **Data table** (`.tide-table`): no row rules, rows spaced by `--space-3`, figures right
  aligned, source label under the caption.
- **Badge**: none. The page has no status to badge.
- **Input**: none. The page has no form; the beta signup lives at `/beta`.
