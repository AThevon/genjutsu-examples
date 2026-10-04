# Étale - MASTER design system

Single source of truth for the landing page. Every value in `src/tokens.css` comes from here, and
every component reads `src/tokens.css`. Nothing else sets a colour, a size, a duration or an easing.

## Validated theses (2026-10-04)

**Visual thesis.** A dark, cool-grey notice read on a phone in a dark hallway: flat slate ground
(#1A1E21), grey ink in three steps, and one pale sea-glass accent (#A9CCC5) kept only for slack
water and the beta button. Type is Public Sans, chosen because it is the US federal web typeface,
so it has the plain register of a posted harbour notice, and it ships tabular figures for columns
of times. Two weights (400, 500), large figures against small labels. Spacing is unhurried, but
the data is set tight like a printed tide table. Components are flat and sharp: 2px corners, 1px
hairline rules, no shadows, no gradients.

**Interaction thesis.** Still, like slack water. Entrances fade and rise 8px over 480ms on one
settle curve, cubic-bezier(0.32, 0, 0.16, 1), with an 80ms stagger, played once on load. The
current line is drawn once over 1200ms. Hover changes colour only, in 160ms, with no scale and no
lift. Nothing is tied to scroll. Forbidden: bounce or overshoot, parallax, scroll reveals, looping
animation, numbers that count up, anything that reads as sporty or heroic.

**Allowed patterns:** hairline rules · small uppercase source labels under each figure · tabular
figures · a chart of the real SFB1204 current predictions · the evening alert drawn as an HTML
notification, labelled as an illustration.

## Content rules (from the brief)

- Every figure comes from `data/tide.json` and is labelled with its date (2 October 2026) and its
  station (9414290 San Francisco for tide heights, SFB1204 Alcatraz Island, southwest of, for
  slack and current). Times are PDT, as NOAA returned them (lst_ldt).
- Slack times are taken from the SFB1204 current predictions, never from high or low tide.
- No water temperature. No prices, user numbers, ratings, testimonials, Android or web app.
- One action: join the TestFlight beta at `/beta`. One label for it everywhere.
- The evening-before alert has the same weight as the slack window.

## Colour

| Token | Hex | Role | Contrast on ground / surface |
|---|---|---|---|
| `--color-ground` | #1A1E21 | page background | - |
| `--color-surface` | #22272B | cards, notification | - |
| `--color-rule` | #3A4247 | hairline rules, decorative only | 1.64 / 1.47 (not for UI boundaries) |
| `--color-rule-strong` | #6E787F | borders of interactive elements, chart axis | 3.72 / 3.34 |
| `--color-ink` | #DCE1E4 | primary text, figures | 12.73 / 11.44 |
| `--color-ink-2` | #9AA4AB | secondary text, labels | 6.61 / 5.94 |
| `--color-ink-3` | #879198 | source lines, axis labels | 5.22 / 4.69 |
| `--color-slack` | #A9CCC5 | slack water, beta button hover, focus ring | 9.69 / 8.71 |

Button text is `--color-ground` on `--color-ink` (12.73:1) and on `--color-slack` (9.69:1).
Semantic colours (success, warning, error, info) are deliberately not defined: the page has no
form and no status to report. Dark only: the thesis is the phone in a dark hallway.

## Typography

Public Sans 400 and 500 only, loaded from Google
Fonts in `index.html`. Fallback `system-ui, sans-serif`. `font-variant-numeric: tabular-nums`
on the whole page.

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `--text-display` | clamp(2.75rem, 11vw, 4rem) | 1 | 500 | the slack time |
| `--text-h1` | clamp(1.75rem, 5.5vw, 2.25rem) | 1.15 | 500 | page heading |
| `--text-h2` | 1.5rem | 1.25 | 500 | section headings |
| `--text-body` | 1rem | 1.55 | 400 | body |
| `--text-small` | .875rem | 1.5 | 400 | table rows, notification |
| `--text-label` | .75rem, tracking .08em, uppercase | 1.4 | 500 | source and section labels |

Measure: body copy at most 34rem.

## Spacing (4px base)

`--space-1` .25rem · `--space-2` .5rem · `--space-3` .75rem · `--space-4` 1rem ·
`--space-5` 1.5rem · `--space-6` 2.5rem · `--space-7` 4rem · `--space-8` 6rem.
Sections are separated by `--space-7` (mobile) to `--space-8` (wide). Table rows use
`--space-2` vertical padding: tight like a printed table.

Breakpoints (raw in media queries, CSS variables cannot be used there): 40rem, where the chart
labels gain the word "slack"; 52rem, where the hero pairs up.

Layout: one column up to 52rem, then a two-column grid (1.4fr / 1fr) for the slack card beside the
alert. Content max width `--width-page` 60rem, side padding `--space-5`.

## Radii and elevation

`--radius` 2px on everything. `--radius-notif` 12px only on the notification illustration.
`--radius-dot` 50% only on the data points of the chart. `--underline-offset` .2em on text links.
Elevation: none. No shadows, no gradients, no blur.

Chart strokes: `--chart-stroke` 1.5px for the current and tide lines, hairline for grid and axis,
`--chart-dash` 2 4 for the slack markers (slack colour).

## Motion

| Token | Value | Use |
|---|---|---|
| `--ease-settle` | cubic-bezier(0.32, 0, 0.16, 1) | every transition |
| `--dur-hover` | 160ms | colour changes on hover, focus, active |
| `--dur-enter` | 480ms | load entrance: opacity 0 to 1, translateY 8px to 0 |
| `--dur-draw` | 1200ms | the current line, drawn once |
| `--stagger` | 80ms | between entrance items |
| `--rise` | 8px | entrance offset |

Played once on load, never on scroll, never looped. Under `prefers-reduced-motion: reduce`,
everything is shown at rest with no transition. Native CSS only, no animation library.

## Base components

- **Button (`.btn`)** - the beta link. Default: ink fill, ground text. Hover: slack fill.
  Focus-visible: 2px slack outline, 3px offset. Active: ink-2 fill. Disabled: transparent,
  ink-3 text, rule-strong border. Minimum height 44px.
- **Text link (`.link`)** - ink text, 1px underline in rule-strong. Hover: underline in ink.
  Focus-visible: slack outline. Active: ink-2.
- **Card (`.card`)** - surface fill, 1px rule border, 2px radius, `--space-5` padding. Not interactive.
- **Data row (`.row`)** - label left in ink-2, value right in ink, hairline above.
- **Source line (`.src`)** - label size, ink-3, names station, place, date.
- **Notification (`.notif`)** - surface fill, 12px radius, labelled "illustration".
- No input: the beta is joined through the TestFlight link at `/beta`.
