# Nocturne - design system (MASTER)

Single source of truth for the Nocturne landing page. Every colour, size, space and duration in
`src/` comes from `src/tokens.css`, which mirrors this file. Status: **UNVALIDATED** (headless run,
no one available to approve the theses).

## Theses

**Visual thesis.** A page that darkens as it scrolls, from deep twilight at the top to near-black
night at the tickets; stars drawn in their catalogue colour (from the B-V index); one accent,
Saturn's pale ochre, used only for Saturn and the ticket action; display face Futura (fallback
Century Gothic), chosen because its circular construction echoes the horizon circle of the
all-sky chart and it is available offline on Apple devices; body in the system sans with tabular
figures for times, prices and altitudes; airy spacing on an 8px base; flat, sharp components
(2px radius) with hairline rules and no shadows; the sky chart is the only circle on the page.

**Interaction thesis.** The sky arrives slowly, the interface answers fast. Stars fade in by
magnitude, brightest first, in six bands over about 1.8s (900ms opacity,
`cubic-bezier(0.22, 1, 0.36, 1)`), once. Everything else is 160ms colour or underline change on
`cubic-bezier(0.2, 0, 0, 1)`. Hovering the chart labels the nearest named star; selecting an
entry of the "tonight's sky" list rings that star on the chart. Scroll animates nothing: the
dusk-to-night shift is a document-length gradient. Forbidden: twinkling or any looping
animation, shooting stars or any invented event, constellation lines, parallax, scroll-triggered
text reveals, bounce, scale on hover, glowing text.

**Allowed patterns:** dark twilight-to-night ground, soft halo on the brightest stars and Saturn,
hairline rules, tabular figures, the circular all-sky chart.

**Assumptions (brainstorm answered from the brief):** audience wants an evening out, so copy is
short and practical; mood is hushed, exact, nocturnal, unhurried; no references; no web fonts
because the build has no network.

## Dials (sent to search.py)

| Dial | Value | From |
|---|---|---|
| motion | 3 | "once ... scroll animates nothing" |
| density | 3 | "airy spacing on an 8px base" |
| variance | not sent | the thesis does not settle symmetry or layout boldness |

## Colour

| Token | Hex | Role |
|---|---|---|
| `--c-dusk` | `#161C33` | page ground at the top (twilight) |
| `--c-night-1` | `#0A0E1A` | sky disc, mid page |
| `--c-night-0` | `#05070D` | page ground at the bottom (night) |
| `--c-ink` | `#E9ECF4` | primary text, starlight |
| `--c-ink-dim` | `#A3ABC2` | secondary text |
| `--c-ink-faint` | `#7D86A0` | captions, chart cardinal labels |
| `--c-rule` | `#2A3250` | hairline rules (decorative only, never a boundary) |
| `--c-edge` | `#6B7491` | UI boundaries (outline buttons, chart horizon) |
| `--c-saturn` | `#E8C77A` | accent: Saturn, primary ticket action |
| `--c-saturn-hi` | `#F2D894` | accent hover |
| `--c-on-saturn` | `#05070D` | text on accent |
| `--c-focus` | `#E9ECF4` | focus ring |
| `--c-error` | `#F2998C` | semantic, reserved (no forms on this page) |

Star colours are data, not decoration: B-V -0.3 `#AABFFF`, 0.65 `#F8F7FF`, 1.6 `#FFD6AA`,
interpolated linearly; null B-V uses 0.6.

Contrast (WCAG, computed): ink on dusk 14.24, on night-0 17.04; ink-dim on dusk 7.34; ink-faint on
dusk 4.64; saturn on dusk 10.32; on-saturn on saturn 12.35, on saturn-hi 14.41; edge on dusk 3.63,
on night-1 4.16.

## Typography

- Display: `Futura, "Century Gothic", "Avenir Next", system-ui, sans-serif`, weight 500, tracking 0.01em
- Body: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`, weight 400; strong 600
- Numbers: `font-variant-numeric: tabular-nums` on times, prices, altitudes
- Line height: body 1.55, headings 1.1, display 0.95

| Token | Value |
|---|---|
| `--t-xs` | 0.8125rem (chart labels only) |
| `--t-sm` | 0.9375rem |
| `--t-base` | 1.0625rem |
| `--t-lg` | 1.375rem |
| `--t-xl` | 2rem |
| `--t-2xl` | clamp(2.25rem, 4.5vw, 3.25rem) |
| `--t-display` | clamp(3.5rem, 12vw, 9rem) |

## Spacing (8px base)

`--s-1` 4px, `--s-2` 8px, `--s-3` 12px, `--s-4` 16px, `--s-5` 24px, `--s-6` 32px, `--s-7` 48px,
`--s-8` 64px, `--s-9` 96px, `--s-10` 144px. Sections are separated by `--s-10` on wide screens,
`--s-9` on narrow. Content measure `--measure` 62ch; page width `--page` 72rem.

Sky chart labels: `--chart-label` 9 SVG units (the horizon radius is 200 units). Touch targets:
`--target-min` 44px, `--target-primary` 48px. Detail panel reserves 12rem so the list does not jump.

## Radii

`--r-none` 0, `--r-sm` 2px (buttons, list entries), `--r-full` 50% (the sky chart only).

## Shadows

None. Elevation level 0 only: the thesis is flat. Depth on the page is the gradient ground.

## Base components

- **Button, primary**: saturn ground, on-saturn text, `--r-sm`, padding `--s-3 --s-5`, min height 48px.
  Hover saturn-hi; focus 2px focus ring offset 3px; active `filter: brightness(0.92)`; disabled
  ink-faint ground, 0.6 opacity, `cursor: not-allowed`.
- **Button, quiet** (sky list entries): transparent ground, ink text, `--r-sm`. Hover: 1px
  `--c-edge` inset. Focus: focus ring. Active/pressed (`aria-pressed="true"`): 1px `--c-ink` inset,
  and the matching star is ringed on the chart. Disabled: ink-faint text, `cursor: not-allowed`.
- **Link**: ink, underline 1px offset 0.2em in ink-faint; hover underline ink; focus ring.
- **Card**: none. Content sits on hairline rules, not in boxes.
- **Badge**: none.
- **Input**: none on this page (tickets are booked at /tickets).

## Motion

| Token | Value |
|---|---|
| `--d-ui` | 160ms |
| `--d-star` | 900ms |
| `--e-ui` | cubic-bezier(0.2, 0, 0, 1) |
| `--e-star` | cubic-bezier(0.22, 1, 0.36, 1) |
| `--d-ui-exit` | 120ms (label fade-out: exit quicker than entry) |
| `--e-exit` | cubic-bezier(0.4, 0, 1, 1) (ease-in, exits only) |
| band delays | 0, 180, 360, 720, 1080, 1440ms for mag <1, 1-2, 2-3, 3-3.5, 3.5-4, 4-4.5 (Saturn in band 1) |

Reduced motion: bands appear at full opacity with no fade; UI transitions drop to 0ms.
