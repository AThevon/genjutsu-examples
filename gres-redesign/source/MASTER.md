# Atelier Grès - Design System (MASTER)

Single source of truth. Every value in `src/tokens.css` and every style in `src/index.css` comes from here.

## Theses (validated)

**Visual thesis:** Redesigning the whole visual layer: one page whose ground follows a piece through the kiln, from the cool grey-buff of bone-dry clay to the salmon of bisque, then the near-black of a kiln in reduction where the only light is a soft spy-hole glow, ending on the grey-green celadon that reduced iron gives a glaze. Iron-black ink, oxidised-iron rust for the firing measures. Display face: the platform's system face (SF Pro, Segoe UI, Roboto), chosen at the design-system gate because it carries true tabular figures and a degree sign for the temperatures, switches optical size between text and display on its own so one family covers the size jump, and costs no external font request, leaving the page's character to the ground colour. Strong size jump from body to headline. Airy, every stage gets at least a full screen on an 8px base. Flat and borderless: no cards, square corners, no shadows.

**Interaction thesis:** Slow and patient. The ground colour is tied to scroll position and changes only in the gaps between stages, holding still while you read. The spy-hole glow rises as the glaze firing reaches mid-screen, then over the long cooling stage it fades from yellow-orange to dull red to nothing, so the page waits like the kiln. Text fades in once with a 16px rise, 700ms, cubic-bezier(0.25, 1, 0.5, 1), 120ms stagger. No hover effects: the page has nothing to click. Forbidden: flames, flicker, particles, parallax, pinning or scroll-jacking, bounce, any loop.

**Allowed patterns:** the spy-hole glow (glaze firing and cooling only); scroll-linked ground colour; a dark ground for the glaze firing and cooling; firing measures in rust with tabular figures.

## Colour

Grounds follow the firing. Every text pair is computed against its ground.

| Token | Hex | Role |
|---|---|---|
| `--color-clay-dry` | `#D7D1C6` | ground: hero, intro, drying |
| `--color-clay-bisque` | `#DDBFA8` | ground: bisque firing |
| `--color-kiln` | `#17110E` | ground: glaze firing, cooling |
| `--color-celadon` | `#BCCBC3` | ground: footer, the kiln opened |
| `--color-ink` | `#1F1A17` | text on light grounds |
| `--color-ash` | `#4F4740` | secondary text on light grounds |
| `--color-rust` | `#843719` | measures on light grounds |
| `--color-bone` | `#EADBCB` | text on kiln |
| `--color-glow-core` | `#FFC27A` | spy-hole centre (light only, never text) |
| `--color-glow-mid` | `#F08A3C` | spy-hole edge; measures on kiln |
| `--color-ember` | `#7A2A14` | glow at the end of cooling (light only) |

Contrast (WCAG): clay-dry: ink 11.35, ash 5.99, rust 5.44. Bisque: ink 9.92, ash 5.24, rust 4.76. Celadon: ink 10.23, ash 5.4, rust 4.91. Kiln: bone 13.8, glow-mid 7.49.

No semantic success/warning/error colours: the page has no states that need them.

Focus ring (for any future interactive element): 2px solid `--color-ink` on light grounds, `--color-bone` on kiln, 4px offset.

## Typography

- Family: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- Weights: 400 (text, measures), 600 (headings)
- Measures and stage numbers: `font-variant-numeric: tabular-nums`

| Token | Size | Line height | Weight |
|---|---|---|---|
| `--text-display` | `clamp(2.5rem, 6vw, 4.5rem)` | 1.05 | 600, tracking -0.01em |
| `--text-h2` | `2.25rem` | 1.15 | 600 |
| `--text-h3` | `1.75rem` | 1.2 | 600 |
| `--text-measure` | `1.25rem` | 1.4 | 400 |
| `--text-body` | `1.125rem` | 1.6 | 400 |
| `--text-small` | `0.875rem` | 1.5 | 400 |

Body measure: max 58ch. Hero text: max 38ch.

## Spacing (8px base)

`--space-1` 0.25rem (4) · `--space-2` 0.5rem (8) · `--space-3` 1rem (16) · `--space-4` 1.5rem (24) · `--space-5` 2rem (32) · `--space-6` 3rem (48) · `--space-7` 4rem (64) · `--space-8` 6rem (96) · `--space-9` 8rem (128)

Layout:
- `--band-min`: `100svh` (each stage at least a full screen)
- `--band-cooling`: `170svh` (the wait)
- `--column-offset`: `clamp(2rem, 12vw, 10rem)` (left edge of the text column)
- `--column-max`: `72rem`
- `--seam`: `40svh` (ground transition between stages; band padding is at least half of it plus `--space-5`)
- `--spyhole-size`: `clamp(12rem, 36vw, 28rem)`

## Radii and shadows

- `--radius-none`: `0`. Square corners everywhere. No other radius.
- No shadows. No elevation. The only light on the page is the spy-hole glow.

## Components

The page has no buttons, inputs, links or cards. Its components:

- **Band:** a full-height section on one ground. `min-height: var(--band-min)`, content vertically centred, text column from `--column-offset`.
- **Stage:** a band holding the stage number (small, tabular), the stage name (h3), the measure (rust on light, glow-mid on kiln), the text (body, 58ch).
- **Seam:** where two stages have different grounds, a `--seam` (40svh) gradient centred on their boundary, smoothstep stops. The ground changes only there, and band padding keeps text clear of it, so text always sits on a solid ground.
- **Spy-hole glow:** a radial gradient (`circle closest-side`: glow-core 0%, glow-mid 40%, transparent 100%) in its own cell, `--spyhole-size` across: right of the text from 64rem up, below it under 64rem. Never behind text (bone on glow-core is about 1.3:1). Two layers, hot and ember, so the cooling colour shift is an opacity crossfade. In cooling it is sticky at mid-screen for the whole band. No blur filter, no box-shadow, no animation of its own.
- **Footer:** celadon ground, ink text.

## Motion

| Token | Value |
|---|---|
| `--ease-out` | `cubic-bezier(0.25, 1, 0.5, 1)` |
| `--dur-reveal` | `700ms` |
| `--stagger` | `120ms` |
| `--rise` | `16px` |

Scroll-linked (no duration, follows the scroll position):
- **Ground:** spatial, in CSS: the seams scroll past, so the ground holds inside each band and changes only between stages. No JS.
- **Glow rise** (GSAP ScrollTrigger, already in the project with `gsap`): hot layer 0 -> 1, smoothstep, from the glaze band's top at 80% of the viewport to its centre at mid-screen.
- **Glow cooling:** over the cooling band (top at mid-screen -> bottom at viewport bottom), light `1 - t²`, split hot `(1 - t)` / ember `t`.

Reveal: once per element, opacity 0 -> 1, translateY `--rise` -> 0, `--dur-reveal`, `--ease-out`, `--stagger` between siblings.

Reduced motion (and no JS): the seams stay, since they don't move on their own. The glaze spy-hole is static at full, the cooling one a static ember at 0.6. No reveals: text is hidden only after the motion script adds `.motion` to the root.

Forbidden: flames, flicker, particles, parallax, pinning or scroll-jacking, bounce, loops, hover effects.
