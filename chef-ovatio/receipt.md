# chef-ovatio - receipt

Chef Ovatio is real: a private chef and culinary consultant who works between Touraine, the South of France and Switzerland. His site was built in one Claude Code session on 29 September 2026, and it is live at [chef-ovatio.vercel.app](https://chef-ovatio.vercel.app).

It is the run `bunshin` was extracted from. That same night, the way the session drove its agents became genjutsu's third skill, released in 4.1.0 on 30 September. So this is not a `/genjutsu:bunshin` call, which did not exist yet: the session ran genjutsu 4.0.0's `paint` with [Impeccable](https://impeccable.style) leading the product interview and the direction, and drove its subagents through eight workflows that `bunshin` later packaged as its research, build, review, refine and verdict steps.

The site's code is the client's private repository and is not published here. This receipt says what the run was given, what it asked, what it produced and what it cost, from the run's own notes (`.research/` in that repository: the research synthesis, the decisions file of round 3, the review and its plan, the results of every round and both verdicts).

## What it was given

- **The chef's public Instagram profile.** Its posts were listed by script, their photos and captions read, and the photos the site uses were picked and cut out from them; every image on the site carries its origin in its metadata. That harvest is the client's material: none of it is published here.
- **A short request** from the genjutsu author, in French, in the conversation: a first draft of real quality, made with Impeccable, for a site the chef would own, edit with an AI assistant, and ship by pushing to `main`. It is a private message and is not reproduced.
- Nothing else: no brief, no copy, no logo, no brand book, no prices, no testimonials.

## The two human answers

These are the only two times a person answered the run before the site was committed.

1. **The product questions**, asked together once the profile was read:
   - Stack: Astro + Vercel.
   - Which offer leads: the private chef first, consulting on its own B2B page.
   - Languages: French and English.
   - Contact: a guided request form plus a WhatsApp shortcut.

   All four answers were the option the run recommended.
2. **The direction.** Impeccable drew its directions and showed them on a decision page; the choices offered were "L'Affiche de la Riviera", "Le Marbre du passe" (Impeccable's own pick, from the dark green marble of the chef's photos, flagged by the run as territory many chefs already hold), a new draw, or the sector standard (dark full-screen photo, elegant serif, gold accents). The answer: **L'Affiche de la Riviera**.

## The run

| | |
|---|---|
| Skill | none yet: the run `bunshin` was extracted from, before v4.1.0 |
| genjutsu | 4.0.0 at commit `a0f6e09`, `paint`, with Impeccable |
| Model | `claude-opus-5-5` |
| Harness | Claude Code 2.1.284, one main session driving subagents through eight workflows (nine runs: the first refine round was started twice) |
| Date | 2026-09-29, from 16:05 to 22:23 UTC (first message to the last commit) |
| Cost | about 10.5M subagent tokens over six to eight hours, the figure genjutsu publishes for this run; the main session's own tokens were not measured; no dollar figure |
| Loop | one review, three refine rounds (one from the review's plan, two from decisions files), two verdicts |
| Human answers | 2 (above) |
| Human edits | 0: the repository's three commits were all made by the session |

## What it produced

A static Astro site deployed on Vercel, seven pages in French and English:

| Page | French | English |
|---|---|---|
| Home | `/` | `/en/` |
| Private chef | `/chef-prive` | `/en/private-chef` |
| The carnet (menus to compose) | `/carnet` | `/en/menu` |
| Consulting | `/consulting` | `/en/consulting` |
| The chef | `/le-chef` | `/en/the-chef` |
| Request form | `/demande` | `/en/enquiry` |
| Legal notice | `/mentions-legales` | `/en/legal` |

Plus a 404, and the files that let the chef keep the site going with an AI assistant: `DESIGN.md` (the design system), `PRODUCT.md` (who he is, who the site is for, what must never be invented), `AGENTS.md` (where each text, photo and menu lives, and the rules), and every text in `src/content/`.

The direction, "L'Affiche de la Riviera": every screen is a Riviera travel poster in five flat inks (Soleil, Cobalt, Couchant, Nuit, Assiette), with one hard horizon and one of his own top-down plates as the sun. On the home, scrolling takes the sky from noon yellow to sunset orange while the plate sets into the cobalt sea. Josefin Sans in capitals for poster titles, Brygada 1918 for text, dish names in italics. The carnet lets a visitor pick dishes, and the picks fill the request form.

## The loop, round by round

| Step | What ran | What came out |
|---|---|---|
| Research | four angles in parallel: French private chefs, international premium, consulting, mobile and SEO acquisition | 59 sites reviewed, one synthesis of six structuring decisions |
| Build | the home and the shared components in the main session, then six page builders in parallel | seven pages in two languages |
| Review | five lenses: finish (Impeccable's reviewer), mobile, desktop, copy, tech | 91 findings; a plan of 55 fixes, 21 findings rejected, 12 questions for the chef |
| Refine 1 | the plan, 8 owners in parallel | 68 items done, 13 not done, every build passing |
| Verdict 1 | Impeccable's finish reviewer, and an art director with cold eyes | finish: 36 of 38 priority fixes resolved; art director: "nothing to rebuild", but 12 items, one critical: the plate did not sell on the first phone screen |
| Refine 2 | a decisions file written from verdict 1 (sun and moon roster, photo and ink discipline, typography, buttons); shared components first, then 7 page owners | 104 items done, 39 not done; one owner's build check failed on a file another owner was editing at the same time |
| Verdict 2 | the same two readers | finish: 15 of 17 resolved, 2 partial, 3 minor left; art director: 8 left, 5 of them major (the private chef page opening on a flat sun with no plate, one weak photo used in too many places, a generic steps section on the home, a cart button repeated 16 times on the carnet, a small portrait on the chef's page) |
| Refine 3 | verdict 2's items, 6 owners | 50 items done, 26 not done, every build passing |

The run had no stop rule yet: the session stopped after the third refine round and committed. No verdict read the site after that round, so whether its 50 items closed verdict 2's five major points was never checked by the loop. `bunshin`'s stop rule (only minor issues left, the tier's round cap, or a round that fixes nothing) was written from this run.

## What is left for the chef

- 110 lines in `src/content/` are marked `À VALIDER` or `À COMPLÉTER` for him to confirm or fill: his name, WhatsApp number, phone, email, the legal notice (entity, SIRET, address), and facts of his career the run would not invent. The live site runs on these blanks: the WhatsApp button opens WhatsApp with the message filled in and no recipient, and the legal notice is incomplete.
- The request form sends through Resend once the chef's account and three environment variables exist; until then it offers WhatsApp or email instead, so no request is lost.

## Media

Filmed from the live site, not from a build: `bin/record.mjs` with the take's `live` option, which sends every request to the network and serves nothing from disk. Takes are in `takes/`.

| File | Viewport | Output | What it shows |
|---|---|---|---|
| `media/clip.webp` | 1440x900 | 1200x750, 7.9 s, 8 fps, quality 15, 693,282 bytes | The home: first screen held 1.2 s, then a scroll from the top to the "Ce qui arrive à table" section (0 to 1980 px, eased in and out) in 5.5 s, then 1.2 s held. The sky turns from noon yellow to sunset orange as the plate sets, the header turns to the compact bar, then the line "La même cuisine, deux façons de la partager", the two doors (Recevoir, Conseiller) and the first plates. |
| `media/home-desktop.png` (cover) | 1440x900 | 1440x900, 890,106 bytes | Home, first screen: OVATIO across the sky, the beetroot plate as the sun on the horizon, "Chef privé méditerranéen, là où vous recevez." |
| `media/home-mobile.png` | 390x844 @2x | 780x1688 | Home on a phone: wordmark, plate-sun, the call to compose a table and the WhatsApp button within reach of a thumb |
| `media/carnet-desktop.png` | 1440x900 | 1440x900 | The carnet, first screen: night sky, the crudo plate cut out as the moon |
| `media/carnet-mobile.png` | 390x844 @2x | 780x1688 | The carnet on a phone |

Notes:

- `clip.webp` encoding: recorded at 24 fps with `--keep-frames`, re-encoded by `takes/encode-clip.py`: every 3rd frame (8 fps), identical frames merged, 1200 px wide, lossy quality 15. The site lays a paper grain over every ink, which makes each frame expensive: a first take scrolling to the formats section (0 to 4520 px) came out at 1.2 MB at quality 22, and the recorder's own encoder only got under budget at 420 px wide. The take was shortened to 1980 px instead. At quality 15 the grain is softened; the type and the photos stay sharp.
- The README cover is `readme-media/chef-ovatio/home-desktop.webp`, the same still as WebP (quality 82, 222 KB).
- Every take logs one failed request, from the live site itself: `/_vercel/insights/script.js` answers 404, because Vercel Web Analytics is not enabled on the project. No console error, no uncaught exception.

## Caption

A real client's site, from his public Instagram profile and two answers: the stack, the lead offer, the languages and the contact in one round of questions, then the direction. Seven pages in French and English, live at chef-ovatio.vercel.app. Scrolling the home, the noon-yellow sky turns to sunset orange as the plate-sun sets behind the cobalt horizon, before the two doors, Recevoir and Conseiller, and the first plates. 1440x900 viewport, scaled to 1200x750.
