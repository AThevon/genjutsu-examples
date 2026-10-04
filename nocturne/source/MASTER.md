# Nocturne: design system (MASTER)

Single source of truth for the Nocturne landing page. Every colour, size, space, radius and
duration in `src/` comes from `src/styles/tokens.css`, which mirrors this file. Change a value
here first, then in `tokens.css`.

## Theses (validated 2026-10-04)

**Visual thesis.** A darkened dome, not outer space: a blue-black ground that starts at dusk blue
(`#1A2638`) and deepens to night (`#07090E`) as you scroll, warm off-white ink, each star tinted
from its catalogue B-V colour index, Saturn in pale gold, and one sodium-amber accent kept for
booking. Display in Jost at weight 300: its geometric, compass-drawn circles echo the dome and the
star chart, and the light weight reads like talking softly. The same family at 400 and 500
carries the facts, with tabular figures. Spacing is airy on an 8px base, with tall sections.
Components are flat and sharp-cornered (2px radius at most), drawn with 1px hairlines and no
shadows; the dome is the only circle on the page. A pinned facts bar (Fri & Sat, doors 21:30,
22:00 / 23:30, 12 € / 8 €, Book) stays on screen from the first view.

**Interaction thesis.** Slow and hushed. The page's dusk is mapped linearly to scroll: the ground
deepens, the amber house-light glow at the dome rim fades out, and stars appear brightest-first by
catalogue magnitude, so the sky is complete by the time you reach the first show. Text reveals
once, opacity plus an 8px rise, 700ms on `cubic-bezier(0.22, 0.61, 0.36, 1)` with a 90ms stagger.
Hover only brightens colour, over 200ms, with no scale and no movement. Named stars show their
name and magnitude on hover or keyboard focus. Forbidden: twinkling, shooting stars, sky
rotation, parallax, bounce or springs, blurred glows, cursor effects, any looping animation. With
reduced motion, the full night sky shows at once and nothing reveals.

**Allowed patterns.** Compass letters N / E / S / W and two faint altitude rings (30°, 60°) on the
dome; 1px hairline rules; the amber house-light glow at the dome rim (scroll-linked, never loops);
the pinned facts bar; tabular figures for times and prices; small tracked uppercase labels, limited
to the dome compass and practical-info terms; star tints from catalogue B-V.

**Assumptions.** Copy in English. No logo: the wordmark is "Nocturne" in Jost 300.

## Content rules (from the brief)

- Draw only `stars` and `planets` from `data/stars.json`. Never draw `checked_below_cut`.
- No constellation lines, no invented stars, events, show titles, address, reviews or numbers.
- The planetarium has no name. Never name or suggest a real venue.
- Times, prices and booking (`/tickets`) visible at all times via the facts bar.
- One call to action, one label everywhere: **Book tickets**.
- Credit the IAU WGSN where star names are shown (licence), plus the Yale BSC and JPL Horizons.

## Colour

| Token | Value | Use | On night | On dusk |
|---|---|---|---|---|
| `--c-night` | `#07090E` | ground after dusk, text on amber | - | - |
| `--c-dusk` | `#1A2638` | ground at the top of the page | - | - |
| `--c-dome` | `#0C1018` | the dome disc | - | - |
| `--c-ink` | `#E8E3D8` | text | 15.56:1 | 11.91:1 |
| `--c-muted` | `#9AA0AB` | secondary text, star labels | 7.58:1 | 5.80:1 |
| `--c-faint` | `#6B7280` | rim, rings, disabled outlines. **Never text** | 4.12:1 | 3.15:1 |
| `--c-amber` | `#E2A65A` | booking button, rim glow | 9.33:1 | 7.14:1 |
| `--c-amber-hi` | `#ECB873` | booking hover | 11.07:1 | - |
| `--c-amber-press` | `#C98F45` | booking active | 7.11:1 (night text on it) | - |
| `--c-saturn` | `#EBD3A0` | Saturn and its label | 13.62:1 | 10.42:1 |
| `--c-hair` | `rgb(232 227 216 / .14)` | hairline rules | decorative | |
| `--c-hair-strong` | `rgb(232 227 216 / .28)` | hover border on ghost links | | |

`--c-ground` is computed at runtime: dusk to night, linear in scroll (see Motion).

Star tint: B-V to temperature (Ballesteros), temperature to RGB, mixed 55% toward white. Stars
with no B-V use `--c-ink`.

Semantic colours (success, warning, error, info): not defined. The page has no forms and no
states that need them. Add them here before any form is added.

## Typography

Jost (Google Fonts, weights 300, 400, 500, italic 300). Fallback `system-ui, sans-serif`.
`font-variant-numeric: tabular-nums` on the facts bar, the practical table and every time or price.

| Token | Size | Weight | Line height | Use |
|---|---|---|---|---|
| `--fs-display` | `clamp(2.75rem, 1.6rem + 4.6vw, 5rem)` | 300 | 1.0 | hero wordmark, closing line |
| `--fs-h2` | `clamp(2rem, 1.6rem + 1.6vw, 2.5rem)` | 300 | 1.15 | section titles |
| `--fs-h3` | `1.5rem` | 400 | 1.3 | sub-heads |
| `--fs-body` | `1.125rem` | 400 | 1.6 | body |
| `--fs-fact` | `0.9375rem` | 500 for values, 400 for keys | 1.4 | facts bar |
| `--fs-small` | `0.875rem` | 400 | 1.5 | captions, credits |
| `--fs-label` | `0.8125rem` | 400, `letter-spacing: .14em`, uppercase | 1.4 | compass, practical-info keys |
| `--fs-star` | `0.8125rem` | 300 italic | 1 | star labels on the dome |

Measure: body text at most `--measure` (34rem, about 65 characters).

| Token | Value | Use |
|---|---|---|
| `--fs-ui` | `1rem` | button and star-chip labels |
| `--lh-none` | `1` | wordmark, buttons |
| `--tracking-display` | `-0.01em` | display lines |
| `--tracking-ui` | `0.02em` | wordmark, buttons |
| `--tracking-label` | `0.14em` | tracked uppercase labels |

## Spacing (8px base)

`--s-1` 0.25rem · `--s-2` 0.5rem · `--s-3` 0.75rem · `--s-4` 1rem · `--s-5` 1.5rem · `--s-6` 2rem ·
`--s-7` 3rem · `--s-8` 4rem · `--s-9` 6rem · `--s-10` 8rem · `--s-11` 12rem.

Sections are tall: `min-height: 100svh` from 1100px, `--s-10` vertical padding. Page gutter `--s-4`
below 1100px, `--s-8` from 1100px.

## Radii, lines and elevation

`--r-0` 0 (cards, panels) · `--r-1` 2px (buttons, focus outlines) · `--r-round` 50% (the dome only).

| Token | Value | Use |
|---|---|---|
| `--line` | `1px` | hairlines, outlines, the amber pick ring |
| `--line-strong` | `2px` | the pick ring while a dome star has keyboard focus |
| `--focus-offset` | `4px` | focus outline offset |
| `--focus-offset-tight` | `2px` | focus outline offset on star chips |
| `--underline-offset` | `4px` | text links and the wordmark |
| `--o-ring` | `0.35` | opacity of the 30° and 60° altitude rings |
| `--target` | `44px` | minimum touch target; a tap on the dome reaches half of it |

Shadows: none, at every level (0 to 4). Depth comes from light: ground, dome, hairline.

## Layout

Breakpoints (media queries cannot read custom properties, so they live here): **900px** for the
facts bar on one line, **1100px** for the two-column page.

- The sky is one sticky layer (`100svh`) behind the content.
  - From 1100px the dome sits on the right, at most `--col-dome` (46vw) wide, and the content runs
    in a left column at most `--col-text` (42vw) wide, with no panel ground.
  - Below 1100px the dome sits at the top, at most `--dome-mobile` (62svh) tall including the bar.
    The content scrolls over it on solid `--c-ground` panels, with `--gap-sky` (70svh) of sky between
    panels and `--gap-sky-hero` (50svh) after the hero.
  - Below 1100px the star list docks: the list (not its intro) is `position: sticky` at
    `--sky-bottom` (where the dome's caption ends), on solid ground, at most the remaining viewport
    tall and scrolling inside, for at least `--dock-hold` (100svh) of page scroll. Its track starts
    `--sky-bottom` below the intro, so the intro has left the screen when the list docks. A picked
    star is never behind a panel.
- Facts bar: `position: sticky; top: 0; z-index: var(--z-bar)`, solid ground at 92% opacity, a
  hairline below. No backdrop blur.
- Runtime measurements, written on `:root` by script, with first-paint values in `tokens.css`:
  `--bar-h` (facts bar height, default 6.5rem), `--sky-bottom` (dome caption bottom, default
  62svh), `--c-ground` (dusk colour) and, on the SVG, `--k` (SVG units per CSS pixel).
- `--container` 80rem. `--chip-min` 13rem (star chip column). `--z-sky` 0, `--z-content` 1,
  `--z-bar` 10, `--z-tip` 20.

## Components

**Book button** (`.btn`): amber fill, night text, Jost 500 `--fs-ui`, padding `--s-3` `--s-5`,
`--r-1`. Min height `--target`.
- default `--c-amber` · hover `--c-amber-hi` · focus-visible 1px `--c-ink` outline, offset
  `--focus-offset` · active `--c-amber-press` · disabled: transparent, `--c-muted` text, 1px
  `--c-faint` inset ring.

**Wordmark** (`.facts__brand`, links to the top): "Nocturne", Jost 300 `--fs-h3`, ink.
- default: underline present but transparent · hover: underline turns `--c-ink` (200ms) ·
  focus-visible: outline as button · active (pressed): text `--c-muted` · disabled: not used.

**Text link** (`.link`): ink, 1px underline in `--c-hair-strong`, offset `--underline-offset`.
- hover: underline `--c-ink` · focus-visible: outline as button · active: `--c-muted` text ·
  disabled: not used.

**Star chip** (`.star-item`, Saturn and the twelve brightest stars): a button row, ink name,
muted detail.
- default: name `--c-ink`, detail `--c-muted`, hairline left marker `--c-hair`.
- hover, tap and focus-visible: marker turns `--c-amber`, and the matching star on the dome shows
  its ring and tag. Focus also gets the 1px ink outline.
- active: name `--c-muted` · disabled: not used.

**Dome stars** (every named star and Saturn, 150 bodies): a `listbox` of transparent targets over
the drawing, one tab stop.
- Mouse: pointing at a lit star shows its ring and tag.
- Touch: a tap picks the nearest lit named star within half of `--target`; a tap on empty sky
  clears it.
- Keyboard: Tab enters on Saturn. Arrow keys move to the nearest named star in that direction.
  Page Down / Page Up step through every named star from brightest to faintest, and Home / End jump
  to either end; this sequential path is what guarantees every name is reachable (arrows alone
  miss Thuban on this night). The focused target gets the shared 1px ink outline and the pick ring thickens to
  `--line-strong`, and
  the caption shows the key help while the dome has focus. Each option is announced as name,
  direction, altitude and magnitude.
- A picked star is drawn by the highlight itself, so it shows even before dusk has lit it.

**Facts list / practical table**: `dl`, keys in label style, values in Jost 500 with tabular
figures, keys and values aligned on the baseline, one hairline above the block, not on every row.

## Motion

| Token | Value |
|---|---|
| `--ease-out` | `cubic-bezier(0.22, 0.61, 0.36, 1)` |
| `--dur-hover` | `200ms` (colour only) |
| `--dur-reveal` | `700ms` (opacity + `translateY(8px)`, once) |
| `--stagger` | `90ms` |
| `--rise` | `8px` |

**Dusk.** `dusk = clamp(scrollY / (top of the closing section - viewport height), 0, 1)`, linear,
updated once per animation frame. It drives `--c-ground` (dusk to night), the rim glow opacity
(`1 - dusk`) and the stars: each star appears from `0.9 × (mag − 0.9) / 3.9` and reaches full
opacity 0.12 later. At dusk 0 that lights only Vega, Capella and Saturn, the three brightest
bodies; the faintest stars are complete at about 0.92. Stars are grouped by 0.25 magnitude so a
frame writes about 20 opacities.

**Reduced motion.** `prefers-reduced-motion: reduce`: dusk is fixed at 1, the ground is night,
every star and label is drawn at once, reveals and hover transitions are off.

## Dome geometry (SVG units, viewBox 1000, constants in `src/sky.ts` and `src/Dome.tsx`)

- Dome radius `RADIUS` 440, centred at 500. Altitude rings at 1/3 and 2/3 of the radius.
- **Projection.** Azimuthal equidistant, zenith at the centre, horizon at the rim, north up, east
  left (seen lying back, looking up): `r = (90 − alt) / 90 × R`, `x = cx − r·sin(az)`,
  `y = cy − r·cos(az)`.
- **Star size.** `0.8 + 0.9 × (4.7 − mag)`; Saturn × 1.15. Tints: B-V to temperature, mixed 55%
  toward white.
- House-light glow: radial gradient from transparent at 0.62 of the radius to amber at 0.5 opacity
  at the rim.
- Compass letters `COMPASS_GAP` 26 outside the rim. Star labels `LABEL_GAP` 8 right of the star,
  only for named stars brighter than 1.5 and Saturn.
- Targets: radius `max(HIT_MIN 10, star radius + HIT_PAD 6)`.
- Pick ring at star radius + `RING_PAD` 7. Tag `TAG_GAP` 14 from the star, two lines `TAG_LINE` 22
  apart, flipped to the left side past `TAG_FLIP` 0.45 of the radius east of centre.
- Labels and tags are sized from the type tokens times `--k`, so they render at token size.

## Dials sent to the lookup

- variance 4, from "the dome is the only circle on the page", a centred dome and calm sections.
- motion 3, from "slow and hushed … hover only brightens colour … no looping animation".
- density 2, from "airy on an 8px base, with tall sections".

Lookup result: kept dark-only with an AAA target; dropped the waitlist pattern (countdown and
count would be invented), the light navy palette, Lora + Raleway, the text-shadow glow and the
GSAP route transition.
