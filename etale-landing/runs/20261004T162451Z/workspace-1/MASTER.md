# Étale: design system (MASTER)

Single source of truth for the Étale landing page. Every value in `src/tokens.css` comes from this
file; every rule in `src/index.css` reads those tokens. Stack: React 19 + Vite, vanilla CSS, no
animation library.

Status: the theses below were written in a session with nobody to validate them. They are
**UNVALIDATED** until a person approves them.

## Theses

**Visual thesis.** A cold green-black ground (#0F1615) meant to be read before sunrise, pale cool
ink (#E6ECE9), the current drawn in one sea-glass green (#8DB3A6) with flood above the line and ebb
below it, and one warm colour, slack amber (#EDB95E), kept for slack times and the beta button
only. Display face: the iPhone's own system face (SF Pro through `system-ui`), because the page
should read like the app it sells, on the phone it is read on; tabular figures, slack times set
large and light (300) against medium headings (500). Airy spacing on an 8px base around compact,
exact figure blocks. Flat filled surfaces, square corners (2px), no borders, no shadows.

**Interaction thesis.** Still by default: nothing moves on load or on scroll. The only motion
answers a choice: picking one of the day's slacks slides the marker along the current strip
(240ms, `cubic-bezier(0.2, 0, 0, 1)`) and crossfades its figures (160ms out, then 160ms in).
Hover and press change colour only, 160ms, no scale. Forbidden: scroll reveals, parallax, looping
or wave animation, bounce or overshoot, scale on hover, anything that plays on page load.

**Allowed patterns:** tabular figures in the system face for times, heights and speeds (no
monospace); a zero line and hour ticks inside the two data charts only.

### Assumptions (brief answered without a person)

- Audience: experienced year-round swimmers who already read tide tables. No explaining of tides.
- Mood: still, exact, early, plain. Read in the dark, the evening before or before dawn.
- The hero is the real day of data (2 October 2026), not a drawing of the app.
- No references were given; the printed tide table is the swimmers' own reference, and the page
  borrows its exactness, not its look.

### Dials sent to the dataset lookup

| Dial | Value | From |
|---|---|---|
| variance | 3 | "flat filled surfaces, square corners": calm, content-led layout |
| motion | 2 | "still by default: nothing moves on load or on scroll" |
| density | 4 | "airy spacing … around compact, exact figure blocks" |

Lookup kept: 150-300ms for micro-interactions. Dropped: navy + gold light palette, Inter, 900-weight
oversized type, App Store pattern (device mockup, ratings, reviews, Play Store buttons), GSAP snippet.

## Data rules

- Every figure comes from `data/tide.json` (NOAA CO-OPS predictions, 2 October 2026), copied as
  NOAA returned it. Each figure on the page sits next to its date and its station.
- Slack times come from the current predictions of SFB1204, never from high or low tide.
- Tide heights are from 9414290, in feet above MLLW. Times are Pacific Daylight Time.
- No water temperature, no prices, no user counts, no ratings, no testimonials.

## Colour

| Token | Hex | Use | Contrast on ground |
|---|---|---|---|
| `--color-ground` | #0F1615 | page background | - |
| `--color-surface` | #17201E | data panels | - |
| `--color-surface-2` | #1F2A27 | slack picker buttons, secondary controls | - |
| `--color-surface-2-hover` | #283532 | hover of surface-2 controls | ink 10.66:1 |
| `--color-surface-2-active` | #121A19 | press of surface-2 controls | ink 14.77:1 |
| `--color-ink` | #E6ECE9 | text, headings | 15.31:1 |
| `--color-ink-muted` | #9AA9A3 | secondary text, captions | 7.49:1 (6.80:1 on surface) |
| `--color-ink-faint` | #7D8C86 | chart zero line, hour ticks, disabled text | 5.21:1 |
| `--color-current` | #8DB3A6 | current bars (flood up, ebb down) | 7.97:1 (7.24:1 on surface) |
| `--color-tide` | #6F9187 | tide height curve | 5.30:1 |
| `--color-slack` | #EDB95E | slack times, slack marks, primary button | 10.21:1 (9.27:1 on surface) |
| `--color-slack-hover` | #F4CB80 | primary button hover | on-slack 12.22:1 |
| `--color-slack-active` | #D9A54A | primary button press | on-slack 8.41:1 |
| `--color-on-slack` | #17110A | text on slack amber | 10.44:1 on slack |
| `--color-focus` | #E6ECE9 | focus ring | 15.31:1 |

Semantic success / warning / error: none. The page has no form and no state to report; none are
defined, so none can be misused.

## Typography

Family: `system-ui, -apple-system, "SF Pro Text", "Helvetica Neue", Arial, sans-serif` for
everything. `font-variant-numeric: tabular-nums` on every figure. No webfont is loaded.

| Token | Size | Weight | Line height | Use |
|---|---|---|---|---|
| `--text-time-xl` | clamp(4rem, 2.5rem + 7vw, 7.5rem) | 300 | 1 | the selected slack time |
| `--text-display` | clamp(2.25rem, 1.5rem + 3.2vw, 3.5rem) | 500 | 1.08 | h1 |
| `--text-heading` | clamp(1.75rem, 1.3rem + 1.9vw, 2.5rem) | 500 | 1.15 | h2 |
| `--text-statement` | clamp(1.5rem, 1.1rem + 1.8vw, 2.25rem) | 400 | 1.3 | the evening-before sentence |
| `--text-time-l` | 2.5rem | 300 | 1 | times in the tide comparison |
| `--text-lead` | 1.25rem | 400 | 1.5 | hero paragraph |
| `--text-body` | 1.0625rem | 400 | 1.55 | body (17px, the iOS body size) |
| `--text-caption` | 0.875rem | 400 | 1.45 | source lines, chart labels |

Weights: `--weight-light` 300, `--weight-regular` 400, `--weight-medium` 500. Letter spacing:
`--tracking-tight` -0.02em on time and display sizes only. Measures: `--measure` 62ch (body),
`--measure-title` 16ch (h1 and the beta heading), `--measure-statement` 34ch.

## Layout

Breakpoints: 37.5rem (narrow phone: tighter panel padding), 48rem (sources in two columns),
64rem (hero splits 5fr / 7fr). Chart sizes: `--strip-height` 168px, `--strip-reach` 36% (the
day's strongest current reaches 36% of the strip from the zero line), `--tide-height`
clamp(160px, 22vw, 240px). `--flow-column` 10rem (min column of the before/after figures).
Hit sizes: `--hit-min` 44px (slack picker), `--button-min` 48px. Lines: `--chart-line` 1px,
`--tide-line` 2px, `--marker-width` 2px. Focus: `--focus-width` 2px, `--focus-offset` 3px.

## Spacing (8px base)

`--space-1` 4px, `--space-2` 8px, `--space-3` 12px, `--space-4` 16px, `--space-5` 24px,
`--space-6` 32px, `--space-7` 48px, `--space-8` 64px, `--space-9` 96px, `--space-10` 128px.
Section rhythm: `--space-section` clamp(64px, 10vw, 128px). Gutter: `--gutter` clamp(20px, 5vw, 48px).
Container: `--container` 72rem.

## Radii and elevation

`--radius-0` 0, `--radius-1` 2px (everything that has a surface). No `full`, no pill.
Elevation: one level, flat. `--shadow-0: none`. No shadows anywhere.

## Motion

| Token | Value | Use |
|---|---|---|
| `--dur-colour` | 160ms | hover and press colour change |
| `--dur-fade` | 160ms | figure crossfade, each half |
| `--dur-slide` | 240ms | slack marker slide |
| `--ease-settle` | cubic-bezier(0.2, 0, 0, 1) | every transition |

Properties animated: `transform`, `opacity`, `background-color`, `color`. Nothing else.
`prefers-reduced-motion: reduce` sets every duration to 0ms: the marker jumps, figures swap.
No stagger, no keyframes, no infinite animation.

## Components

**Primary button (link to /beta).** surface slack amber, text on-slack, weight 500, padding
`--space-4` `--space-6`, min-height 48px, radius 1.
States: default slack; hover slack-hover; focus-visible 2px focus ring at 3px offset; active
slack-active; disabled surface-2 with ink-faint text, `cursor: not-allowed`.

**Slack picker (toggle button, `aria-pressed`).** surface-2, ink text, tabular, min 44px high.
States: default surface-2; hover surface-2-hover; focus-visible ring; active surface-2-active;
pressed (selected) slack amber with on-slack text; disabled ink-faint on surface-2.

**Text link.** ink, underline 1px at 0.2em offset; hover colour slack; focus-visible ring; active
ink-muted; no disabled link exists (a disabled link is not a link).

**Panel.** surface, radius 1, padding `--space-6` (`--space-5` under 600px). No border, no shadow.

**Chart.** zero line and hour ticks ink-faint 1px; current bars `--color-current`; tide line
`--color-tide` 2px; slack marks `--color-slack`. Labels are HTML text, not SVG text, so they never
stretch. Every chart has a text equivalent on the page.
