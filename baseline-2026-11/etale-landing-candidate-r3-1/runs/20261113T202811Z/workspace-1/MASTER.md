# Étale - design system (MASTER)

Single source of truth for the Étale landing page. Every colour, size, space and duration in
`src/` comes from `src/tokens.css`, which mirrors this file. Status: **UNVALIDATED** (headless
run; nobody could approve the theses or this system).

## Theses

**Visual thesis.** The bay before light, read on an iPhone on the walk down: a near-black, cold
green-grey ground with pale ink. One amber marks slack and nothing else. The action, "Join the
TestFlight beta", is a solid ink button and never amber. Type is the system face (SF Pro on the
iPhones this page is for, the same face as the app), with no web font. Its voice comes from scale
contrast (a light 7rem tabular time) and tabular figures. The layout is airy on a 4px base, with
one left edge and one 72rem content width. Running text keeps a 40rem measure, and charts take the
full content width because the 24 hours of the day set it. Components are sharp (2px), flat and
hairline, with no shadows.

**First screen.** NOAA's 2 October 2026 current predictions at SFB1204 (Alcatraz Island,
southwest of) drawn across the day, with the three slacks in amber and their times. The readout
"05:57 slack" is set large, with what runs until the next slack. Every figure is labelled with its
date and station. Wide: the chart takes 72rem, and the readout and CTA sit at measure above it,
whole within 1440×800. 375px: the chart keeps only the slack labels, and every value moves into
a table beneath it. At rest, with no input, the 05:57 slack is already shown. With no script, a
`<noscript>` block carries the same values.

**Interaction thesis.** Fast and dry. Hover and focus are 160ms colour changes on
`--ease-out`, with no scale or lift. Choosing another slack fades the new readout in over 160ms.
Nothing happens on scroll: no reveals, no parallax, no bounce, no loops, no counters. **The one
motion:** on load, a ring travels once along the current line from the 03:07 flood maximum to the
05:57 slack, in 1400ms on `--ease-settle`, the current dying into slack. Before it runs, and
under reduced motion, the ring already sits on 05:57.

**Allowed patterns:** a dark ground (read before dawn); hairline rules (chart axes, table rows);
small uppercase source labels naming date and station; tabular figures; the one-shot ring travel
on load.

`Set aside: an app landing with a phone mockup, three feature cards and testimonials; a bare text
page with one button and no data; ocean waves and blue gradients; the printed nautical tide table.
Kept: the NOAA current prediction, slack as the zero crossing.`

### Assumptions (headless run, answered from the brief)

- Mood: still, exact, pre-dawn, unsentimental. Not given by the founders.
- References: none given, none added.
- No web font: no font request was agreed to, and the system face is the iPhone's own.
  Typeface voice comes from scale and tabular figures instead.
- No photograph, illustration or device mockup: the founders gave none. NOAA's real predictions
  stand in their place.

### Dials sent to the design-system lookup

| Dial | Value | From the thesis clause |
|---|---|---|
| variance | 3 | "one left edge and one 72rem content width", "sharp, flat" |
| motion | 2 | "fast and dry ... nothing happens on scroll", a single one-shot motion |
| density | 4 | "airy on a 4px base", but data-bearing charts and tables |

## Colour

Dark only. The page is read before dawn, so there is no light theme.

| Token | Hex | Job | Contrast on `--ground` |
|---|---|---|---|
| `--ground` | `#0E1315` | page background | - |
| `--surface` | `#151C1F` | readout panel, table header band | - |
| `--rule` | `#2A3438` | hairlines: axes, gridlines, table rows. Never a control edge | 1.47:1 (decorative) |
| `--ink` | `#E8ECEA` | text, headings, action button fill, focus ring | 15.69:1 |
| `--ink-muted` | `#93A0A4` | secondary text, labels, control borders | 6.95:1 |
| `--line` | `#6F8F96` | the data line in each chart (current, tide) | 5.38:1 |
| `--slack` | `#F0B43C` | **slack only**: slack points, slack times, slack lines, the selected-slack ring | 10.06:1 |
| `--action-hover` | `#FFFFFF` | action button fill on hover | ground on it 18.71:1 |

Roles: the **action** is ink (filled button), the **signal** is amber (slack). They never share
a mark. The focus ring is ink, not amber, so that amber keeps a single job. There is no
success/warning/error set: the page has no form and no state to report.

## Typography

- Stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, system-ui, sans-serif`
- `font-variant-numeric: tabular-nums` on the whole page.
- No web font, no font request.

| Token | Size | Use | Weight | Line-height |
|---|---|---|---|---|
| `--text-xs` | 0.75rem | uppercase source labels (letter-spacing 0.08em), chart axis | 500 | 1.4 |
| `--text-sm` | 0.875rem | tables, chart labels, notes | 400 | 1.5 |
| `--text-md` | 1rem (1.0625rem ≥ 48rem) | body | 400 | 1.55 |
| `--text-lg` | 1.25rem | lead paragraph | 400 | 1.45 |
| `--text-xl` | 1.75rem | section headings | 600 | 1.2 |
| `--text-2xl` | clamp(2rem, 4.5vw, 3rem) | h1 | 600 | 1.1 |
| `--text-readout` | clamp(4rem, 14vw, 7rem) | the slack time | 300 | 1, letter-spacing -0.03em |

## Spacing

Base 4px. `--space-1` 0.25rem, `-2` 0.5rem, `-3` 0.75rem, `-4` 1rem, `-6` 1.5rem, `-8` 2rem,
`-12` 3rem, `-16` 4rem, `-24` 6rem.

- `--content` 72rem: the one content width. Every section starts at the same left edge: the
  gutter `--gutter` = clamp(1.25rem, 5vw, 3rem).
- `--measure` 40rem: running text only.
- Charts and the station list take the full `--content`, because the day's 24 hours set the
  chart's width and the two stations sit side by side.
- Sections are separated by `--space-24` (≥ 48rem) / `--space-16` (narrow), with a `--rule` top line.

## Radii and elevation

- `--radius-0` 0, `--radius-sm` 2px (buttons, panel), `--radius-full` 50% (chart marks only: slack dot, selected ring, high/low dot). No pill button, no large radius.
- Chart mark sizes: `--mark-slack` 10px (slack dot), `--mark-ring` 22px (selected ring), `--mark-hl` 6px (high/low dot).
- Elevation: level 0 only. No shadow tokens. Separation is by `--surface` and `--rule`.

## Motion

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 160ms | hover, focus, readout fade, ring opacity |
| `--dur-settle` | 1400ms | the one motion, once on load |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | everything fast |
| `--ease-settle` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | the one motion |
| stagger | none | - |

Forbidden: scroll reveals, parallax, bounce or overshoot, infinite loops, number counters,
scale or lift on hover, layout-property animation. Under `prefers-reduced-motion: reduce`, the
travel is removed (the ring rests on 05:57) and the fades are removed.

## Components

**Button (action, link to /beta).** Fill `--ink`, text `--ground`, weight 600, `--radius-sm`,
min-height 44px, padding `--space-3` `--space-6`.
- hover: fill `--action-hover` (160ms)
- focus-visible: 2px `--ink` outline, 3px offset
- active: fill `--ink-muted`
- disabled (`aria-disabled="true"`): fill `--surface`, text `--ink-muted`, no pointer

**Slack chip (choose a slack, `aria-pressed`).** Transparent, 1px `--ink-muted` border, text
`--ink`, tabular, min 44×44.
- hover: border `--ink`
- focus-visible: 2px `--ink` outline, 3px offset
- pressed (selected): border and text `--slack`
- active: background `--surface`
- disabled: border `--rule`, text `--ink-muted`

**Link.** `--ink`, underline 1px `--ink-muted`, offset 0.2em. Hover: underline `--ink`. Focus: as
button.

**Panel (readout).** `--surface`, `--radius-sm`, no border, no shadow.

**Table.** `--text-sm`, header `--ink-muted` weight 500, rows separated by 1px `--rule`. Times
and values in tabular figures, each value in the column of its header.

**Source label.** `--text-xs`, uppercase, 0.08em tracking, `--ink-muted`. Always names a date and
a station.

## Data rules

- Every figure comes from `data/tide.json` (NOAA CO-OPS, 2 October 2026) and is labelled with
  its date and station.
- Slack times come from `current_slack_and_max` (SFB1204), never from `highs_lows`.
- No water temperature. No figure that is not in the file. Derived differences (slack minus the
  preceding high or low) are computed in code from the file.
- The current chart joins NOAA's maxima and slacks with straight segments. Only the marked points
  are predictions, and the page says so.
