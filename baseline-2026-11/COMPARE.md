# Baseline, November 2026: nothing, frontend-design, genjutsu

Does genjutsu make a headless page visibly better than no plugin, and than Anthropic's official `frontend-design` skill? This folder holds one attempt to find out, published as it came out.

**Short answer: not on this brief.** On a landing page with an explicit request for a minimal, restrained style, `frontend-design` produced the best page in both rounds, the no-plugin runs came second, and genjutsu's `paint` came last in both rounds while costing about 3.7 times a no-plugin run. On the one `cast` pair, the no-plugin run is at least as good as the genjutsu run. Nothing was tuned, re-run or selected: every run launched is here.

Read the limits before quoting any of this: two runs per arm, one brief, one reader (see "How far this goes").

## What was run

All eight runs: `claude-opus-5-5`, Claude Code 2.1.323, `claude plugin eval` headless with the flags of [`bin/run.sh`](../bin/run.sh) (`--ablation none --scaffold --allow-tools Bash Write Edit`), launched on 2026-11-13 through [`bin/run-arm.sh`](./bin/run-arm.sh). Same fixture for every arm (the empty React 19 + Vite + TypeScript template), same prompt, one difference: the genjutsu arm's prompt opens with `/genjutsu:paint`, the others with the bare request.

| Arm | Plugin under test | Prompt |
|---|---|---|
| none | [`arms/none/plugin`](./arms/none/plugin/.claude-plugin/plugin.json): a manifest and nothing else | bare |
| frontend-design | Anthropic's `frontend-design` 1.1.1, from the `claude-plugins-official` marketplace | bare; the skill is not named, it triggered by itself in both runs |
| genjutsu | genjutsu 4.1.3 at `5e00595` | `/genjutsu:paint` + the same text |

The case is [`cases/minimal-saas`](./cases/minimal-saas/prompt.md): the landing page of Ploverdesk, a fictional B2B SaaS that matches supplier invoices against purchase orders, with the facts a client would give and the line "they want it minimal and restrained. Quiet, precise, nothing decorative."

**Isolation.** `claude plugin eval` runs each session in its own temporary home, so nothing from the machine's Claude configuration is loaded. Each run folder keeps the proof in `runs/<stamp>/trace-facts.json`, taken from the init event of the run's trace: the skill list of the `none` runs holds only Claude Code's 17 built-in skills; the `frontend-design` runs add exactly `frontend-design:frontend-design`; the genjutsu runs add exactly `genjutsu:paint`, `genjutsu:cast` and `genjutsu:bunshin`. No MCP server in any run. The machine has other design skills installed for its user; none of them appears in any list.

## Costs

| Run | Cost | Turns | Duration |
|---|---|---|---|
| [`minimal-saas-none-1`](./minimal-saas-none-1/receipt.md) | $0.46 | 12 | 110 s |
| [`minimal-saas-none-2`](./minimal-saas-none-2/receipt.md) | $0.46 | 14 | 102 s |
| [`minimal-saas-frontend-design-1`](./minimal-saas-frontend-design-1/receipt.md) | $0.64 | 13 | 166 s |
| [`minimal-saas-frontend-design-2`](./minimal-saas-frontend-design-2/receipt.md) | $0.68 | 17 | 167 s |
| [`minimal-saas-genjutsu-1`](./minimal-saas-genjutsu-1/receipt.md) | $1.73 | 29 | 308 s |
| [`minimal-saas-genjutsu-2`](./minimal-saas-genjutsu-2/receipt.md) | $1.64 | 24 | 267 s |
| [`invoice-mark-paid-none-1`](./invoice-mark-paid-none-1/receipt.md) | $0.91 | 19 | 211 s |
| **Total launched for this baseline** | **$6.52** | | |

The genjutsu arm of the cast pair was not launched here: it is the run of 2026-10-04 already in [`../invoice-mark-paid/`](../invoice-mark-paid/receipt.md) ($1.88, 45 turns, 329 s).

All seven new runs built with `npm ci && npm run build` on the first try, unchanged. None could build in its own sandbox (npm and node are blocked there), so none of them saw its page.

## Tells audit

`python3 skills/_jutsu/design-audit/scripts/audit.py <workspace> --group tells`, from genjutsu 4.1.3, on each workspace (`tells.md` and `tells.json` in each run folder). 18 checks each.

| Run | Tells to confront | Which |
|---|---|---|
| minimal-saas-none-1 | 1 | U+2014 in displayed text (an `aria-label`) |
| minimal-saas-none-2 | 0 | |
| minimal-saas-frontend-design-1 | 0 | |
| minimal-saas-frontend-design-2 | 0 | |
| minimal-saas-genjutsu-1 | 0 | |
| minimal-saas-genjutsu-2 | 0 | |
| invoice-mark-paid-none-1 | 0 | |
| invoice-mark-paid (genjutsu, 2026-10-04) | 0 | |

The audit does not separate the arms. It also misses things the eye sees at once in the no-plugin pages: three steps numbered 01, 02, 03 over three equal columns in `none-1`, a U+2014 in the page title of `none-2` (in `index.html`, outside the folder the audit reads). A page can pass all 18 checks and still be the default page.

## The minimal case, side by side

Left to right in every image: **none, frontend-design, genjutsu**. Stills by genjutsu's `shoot.mjs` through [`bin/capture.sh`](./bin/capture.sh), on macOS, at least 4 seconds after load so that on-load motion has ended. Each run folder holds the full-size stills in `media/`.

### Round 1

First screen, 1440x900:

![Round 1, first screens: none, frontend-design, genjutsu](./compare/minimal-saas-run-1-desktop.png)

Whole page, 1440 px wide:

![Round 1, whole pages: none, frontend-design, genjutsu](./compare/minimal-saas-run-1-desktop-full.png)

Whole page, 390 px wide:

![Round 1, whole pages on a phone: none, frontend-design, genjutsu](./compare/minimal-saas-run-1-mobile-full.png)

### Round 2

First screen, 1440x900:

![Round 2, first screens: none, frontend-design, genjutsu](./compare/minimal-saas-run-2-desktop.png)

Whole page, 1440 px wide:

![Round 2, whole pages: none, frontend-design, genjutsu](./compare/minimal-saas-run-2-desktop-full.png)

Whole page, 390 px wide:

![Round 2, whole pages on a phone: none, frontend-design, genjutsu](./compare/minimal-saas-run-2-mobile-full.png)

## Read by eye

Written by the agent that ran the baseline (Claude), from the screenshots, with the instruction not to be kind to genjutsu. One reader, not a panel.

### none

What a designer says in ten seconds: "clean, and I have seen it a hundred times." Both runs give the same page: an eyebrow line, a two-line headline, a grey paragraph, a dark button with a quiet link, a bordered card under the hero that imitates the product, three numbered steps in three columns, then title-left, list-right sections on warm off-white with one rust accent. Round 2 only changes the button to green and adds a pricing card with check marks. The card under the hero is the one useful thing: in round 1 it shows five invoice lines with three flagged, and you understand the product from it. There is no visual idea beyond that card, and with the copy removed nobody could say which product the page is for. It is the default "minimal SaaS" template, competently filled in. It is also complete, legible on a phone, and persuasive enough.

### frontend-design

What a designer says in ten seconds: "the table is the page, good." Both runs put a worked example at the centre: a supplier invoice set as a ruled table with its order and delivery figures, where the lines that match recede (in round 1 they fold away 1.6 s after load, leaving three) and the figures that disagree are red with the reason written beside them. That is one identifiable idea, it is the product's own promise acted out, and it is the only thing in the six pages you would remember an hour later. Red is used for nothing else. Avenir Next gives the text a voice the system-font pages lack. Below the example both runs fall back to standard furniture (four numbered columns, a details list), and the type scale is timid. Two real reservations. The example invents quantities and prices, which the brief forbids ("invent no other figure"); both runs said so themselves and labelled the data as an example. And Avenir Next is a font of Apple systems, not a web font: the same typeface in both runs means it is this skill's habit, and off a Mac the page loses it.

### genjutsu

What a designer says in ten seconds: "this is the wireframe; where is the design?" Round 1 is a narrow left column of system sans on white: a headline, a paragraph, a button, then text blocks, with no picture of the product, no example, and more than a third of a 1440 px screen left empty from top to bottom. The accent the run's thesis reserves for mismatches first appears two screens down, on three table labels. Round 2 is better (a table of cases with the disagreeing document tinted amber, which is a small real idea) but the table describes cases in words instead of showing an invoice, sits below the first screen, starts 128 px to the left of everything else, and the header holds the name and nothing more. Neither page has an identifiable visual idea on its first screen. Neither looks like a SaaS template, but only because they hold less: they look like default documents. What they do well is not visible in a screenshot and is taken here from the code and the runs' own reports: tokens in one file, contrast computed from the colour values, 44 px targets, a reduced-motion path, one label per action, no invented figure, no U+2014, and a plain list of what was not verified.

Why it happened is in the run's own notes. `MASTER.md` of round 1, assumption A6: "No product screenshot exists, and no figure may be invented, so the page shows no drawn product UI and no example numbers." genjutsu's tells module lists "a fake product drawn in divs" among the patterns to read for, and the question it attaches is "does a real screenshot, recording or component of the product exist, and if not, does the page need a picture of it at all?" The brief also forbids invented figures. With nobody to ask, `paint` answered no to both and removed the element that carries the other arms' pages, without putting anything in its place.

### Ranking, minimal case

1. **frontend-design**, in both rounds.
2. **none**, in both rounds.
3. **genjutsu**, in both rounds.

Confidence: high that frontend-design is first (same result twice, and for the same reason). Moderate that none is ahead of genjutsu: it rests on preferring a familiar page that shows the product over an unfamiliar page that shows nothing, and a reader who weighs "does not look generated" above everything could reverse it for round 2. Would a non-designer see the difference? Yes for first against last: one page shows an invoice with the wrong figures in red, the other is paragraphs. Between none and frontend-design it is a matter of degree that a non-designer would feel more than name.

On the question that prompted this baseline (a public video judged a minimal genjutsu page "closer to a typical AI design"): these two genjutsu pages do not look like the typical generated SaaS page, the no-plugin pages do. But they are not better for it. They avoid the template by leaving things out.

## The cast pair

Fixture `invoice-mark-paid` (the Folio invoice list whose "Mark as paid" does nothing visible). Left: the no-plugin run of this baseline. Right: the genjutsu run of 2026-10-04. Same click (FOL-2026-032, Overdue, 4,200.00 EUR), stills at 120 ms, 350 ms, 800 ms and 3 s after it, by [`bin/capture-cast.sh`](./bin/capture-cast.sh).

![The click, none on the left, genjutsu on the right, at 120 ms, 350 ms, 800 ms and 3 s](./compare/invoice-mark-paid-click.png)

**none.** The row turns pale green and fades back, its amount goes green, a check mark draws itself in the Paid pill, the Paid card takes a ring and a "+€4,200.00" while Paid counts up and Outstanding counts down, and "Paid just now, Undo" replaces the button for eight seconds. It answers "make it feel like the money landed" literally, at the place you clicked. It is also busy (four confirmations for one click), the Outstanding card loses the amount with no sign, the status cell of the clicked row is empty in the stills at 120 ms and 350 ms, and it added an Undo and a check mark on every Paid pill that nobody asked for.

**genjutsu.** One idea, stated in its thesis and visible in the stills: the amount leaves Outstanding (−€4,200.00) and lands in Paid (+€4,200.00) while both totals count. The pill is already Paid at 120 ms, the button is gone, nothing else moves. It is the more disciplined of the two and the easier to defend in a design review. It gives nothing on the row itself, so the eye, which is on the row, has to travel up to the cards to see anything; and it has the focus defect recorded in its receipt.

**Ranking, cast pair:** none first by a short head, genjutsu second. Low confidence: a designer could argue either way (richer feedback against a cleaner idea), and stills cannot judge easing or rhythm, which is where `cast` claims its value. What can be said firmly: there is no visible advantage for genjutsu here, a non-designer would likely prefer the left column, and the genjutsu run cost twice as much ($1.88 against $0.91). The pair is also not clean: the genjutsu arm is a month older (genjutsu 4.1.0, Claude Code 2.1.289).

## What this says about headless paint

In order of weight, for the minimal case:

1. **Imagery.** The gap is here. genjutsu's pages have no first-screen visual, because the tells module warns against a product drawn in divs and, when no screenshot exists, only asks whether the page needs a picture at all. The other arms answered with a labelled example of the product's own data, set as a document, not as fake chrome. `paint` needs a positive rule for this situation, not only a prohibition.
2. **Layout.** One narrow column with the rest of a desktop screen unused (round 1), two unrelated left edges and a header with nothing in it (round 2), a first phone screen that ends in empty space. Restraint was read as absence.
3. **Typography.** The system sans at two weights with small size steps in both runs. Defensible (no network in the run, no third-party request), but it gives the page no voice; frontend-design got one from a single named face.
4. **Motion.** None in either genjutsu page beyond hovers, by its own thesis. frontend-design's one motion (matched lines folding away once) carries its idea. Not a defect in itself, but `paint` did not consider motion as a way to state the idea.
5. **Colour.** Fine. One accent with one meaning in every arm; no difference worth reporting.
6. **Copy.** Fine in every arm, and nearly the same: all six pages found the same headline idea. genjutsu's is the plainest and has one label per action.

And one about cost: genjutsu spent $1.64 to $1.73 where the other arms spent $0.46 to $0.68, on previews, a design-system file and an audit, none of which shows in the page.

## How far this goes

- Two runs per arm, one brief, one model, one day. The ranking was the same in both rounds, which is something; it is not a measurement.
- One reader: the agent that ran it. No blind panel.
- The brief says "invent no other figure". The arm that obeyed it most strictly (genjutsu) lost; the arm that broke it with labelled example data (frontend-design) won. A brief that allowed example data might close part of the gap. The prompt was written before any run and not changed.
- The prompt is neutral so that every arm can read it: it says "where your process would ask something or wait for an approval, decide yourself", not the "Up-front answers to the gates" wording of the existing cases. genjutsu's "When nobody is answering" rule applied and both runs marked their theses UNVALIDATED. This is headless `paint`, with no client to talk to, which is not how `paint` is meant to be used; the conversation examples in this repository are the other half of the picture.
- Captured on macOS: `frontend-design`'s Avenir Next is present there and nowhere else.
- No run could build or look at its own page.
- The cast pair compares a new run with a month-old one, on stills.

## Layout of this folder

```
COMPARE.md               this file
bin/
  run-arm.sh             runs one arm of one case (billed)
  trace-facts.py         what a run's session had loaded, its Skill calls, cost and last message
  hygiene.py             repository rules applied to a run folder before it is committed
  capture.sh             builds a minimal-saas workspace, shoots it, runs the tells audit
  capture-cast.sh        builds an invoice-mark-paid workspace and shoots one click
cases/minimal-saas/      the case: case.yaml, fixture.sh, prompt.md, graders/
arms/                    the empty plugin of the none arm; the extra grader of the frontend-design arm
compare/                 the side-by-side images above
<case>-<arm>-<n>/
  receipt.md, receipt.json
  runs/<UTC stamp>/      run.log, report.html, aggregate-result.json, prompt.md (as sent),
                         trace-facts.json, workspace-1/ (without node_modules and dist)
  media/                 the stills; shots.json and build.log beside them or in the run folder
  tells.md, tells.json   the tells audit
invoice-mark-paid-genjutsu-20261004/   stills of the existing genjutsu run, for the cast pair
```

Raw output follows the repository's rules: paths into the repository are relative to its root, each U+2014 in the CLI's own output became " - ", and no trace is committed. One rule is added: where a run itself wrote a U+2014 (four files, in the `none` and `frontend-design` arms, never in genjutsu's), the committed copy holds the character reference `&#8212;`, which renders as the same dash; each receipt counts them.

To run an arm again (billed), after `bin/make-templates.sh`:

```sh
GENJUTSU=/path/to/genjutsu baseline-2026-11/bin/run-arm.sh genjutsu minimal-saas 3
FRONTEND_DESIGN=/path/to/frontend-design baseline-2026-11/bin/run-arm.sh frontend-design minimal-saas 3
baseline-2026-11/bin/run-arm.sh none minimal-saas 3
python3 baseline-2026-11/bin/trace-facts.py /private/tmp/e-XXXXXX/out/trace.jsonl > baseline-2026-11/minimal-saas-none-3/runs/<stamp>/trace-facts.json
python3 baseline-2026-11/bin/hygiene.py baseline-2026-11/minimal-saas-none-3
baseline-2026-11/bin/capture.sh baseline-2026-11/minimal-saas-none-3 /path/to/genjutsu
```
