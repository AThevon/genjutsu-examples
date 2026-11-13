# minimal-saas-genjutsu-1 - receipt

Baseline case `minimal-saas`, arm **genjutsu**, run 1 of 2: the landing page of Ploverdesk, a fictional B2B SaaS, with a brief that asks for a minimal, restrained style. One recorded run, built unchanged, 0 human edits. The comparison with the other arms is in [`../COMPARE.md`](../COMPARE.md).

| | |
|---|---|
| Arm | genjutsu |
| Plugin under test | genjutsu 4.1.3 at commit `5e00595` (`main`) |
| Model | `claude-opus-5-5` (Claude Code 2.1.323, `claude plugin eval`, headless) |
| Date | 2026-11-13 |
| Cost | $1.73 (1.734786) |
| Turns | 29 |
| Duration | 308 s |
| Subagents | 0 |
| Stack | React 19 + Vite + TypeScript, vanilla CSS, no animation library (template react) |
| Build | `npm ci && npm run build` passed on the first try, no edits |
| Human edits | 0 |
| Command | `baseline-2026-11/bin/run-arm.sh genjutsu minimal-saas 1` |

## The prompt

The case prompt as written, `/genjutsu:paint` first. As sent (`runs/20261113T183357Z/prompt.md`):

```
/genjutsu:paint build the landing page for Ploverdesk.

The brief. Ploverdesk is a fictional product made up for this example, and this is everything its founders have given us:

- Ploverdesk is software for the finance teams of mid-size wholesalers, sold to companies, not to individuals. It reads the supplier invoices that arrive by email as PDF, matches every line against the purchase order and the delivery note (a three-way match), and shows a person only the lines that do not match: a wrong quantity, a wrong unit price, a delivery that never arrived. Invoices that match go straight to payment approval.
- Matched invoices are exported to the accounting system as a CSV file or through an API. Data is hosted in Frankfurt, in the EU.
- Price: 290 EUR per month per company, with no limit on users. A 14-day trial needs no credit card.
- The company was founded in 2025 and is six people in Rotterdam. It has no customer logos, no testimonials and no usage numbers to show yet: invent none, and invent no other figure.
- The page has one job: get a finance lead to start the trial, at /trial. A second, quieter link books a demo, at /demo.
- Style: they want it minimal and restrained. Quiet, precise, nothing decorative.

Nobody is available to answer questions during this session: where your process would ask something or wait for an approval, decide yourself and carry on.
- If your process shows previews before it builds, write each one as a standalone HTML file under preview/ in the project.
- Scope: the landing page. You may write src/, index.html, public/, preview/ and MASTER.md; create nothing outside the project.
- Dependencies are installed (node_modules is present) and `npm run build` works. There is no network: install nothing. Do not start a dev server.

Finish with a short report of what you built and what you left unverified.
```

## What the session had loaded

From the init event of the run's trace (`runs/20261113T183357Z/trace-facts.json`, written by `bin/trace-facts.py`):

- Plugins: `genjutsu`, `cc-plugin-agents-md`, `cc-plugin-privacy`, `cc-plugin-plugin-authoring`. The three `cc-plugin-*` ones are built into Claude Code.
- Skills added by the plugin under test: `genjutsu:bunshin`, `genjutsu:cast`, `genjutsu:paint`.
- The other 17 skills are Claude Code's built-in ones (deep-research, dataviz, update-config, verify, debug, code-review, simplify, batch, fewer-permission-prompts, doctor, loop, schedule, claude-api, workflow-authoring, run, run-skill-generator, plugin-authoring). No skill from the machine's own configuration is in the list.
- MCP servers: none.
- Skill tool calls: 0. The slash command expands `paint` in place; the trace shows the run resolving genjutsu's module directory and reading its modules with the skill's loader.

## What it built

Header with the name and one text link to the trial, the headline "Only the invoice lines that don't match reach your desk.", a paragraph, the trial button and a demo link, then three text blocks ("A three-way match on every line"), a three-row table of mismatch kinds with the kind in vermilion, two definition rows, a grey price band, one footer line. White ground, the system sans, near-black ink, one vermilion accent. At 1440 px the text sits in a left column 576 px wide (x 224 to 800) and the two tables reach x = 928; apart from the header link, nothing is placed in the right 500 px of the screen. No animation beyond 140 ms hovers. Wrote `MASTER.md`, `src/tokens.css`, `preview/thesis.html` and `preview/design-system.html`.

The run's last message is kept whole in `trace-facts.json` (`final_message`).

## Read by eye

A well-typeset text document. Nothing is wrong and nothing is there: one narrow left column of system sans on white, no picture of the product, no example, no figure, and more than a third of the screen left blank at desktop width with nothing holding it. Restraint was asked for and this is restraint, but restraint needs one thing to be restrained around, and the page has none; the vermilion that the thesis reserves for mismatches first appears two screens down, on three small table labels. The run wrote in its own design notes that it would show "no drawn product UI and no example numbers" because no screenshot exists and no figure may be invented. That obeys the brief to the letter and removes the only element that made the other arms' pages readable at a glance. A designer would say: this is the wireframe before the design.

- One identifiable visual idea: No. The stated idea (colour spent only on mismatches) is not visible on the first screen.
- Distinguishable from a default template: Distinguishable from a SaaS template only by having less in it. It looks like a default document, not like a default landing page.

## Tells audit

`python3 skills/_jutsu/design-audit/scripts/audit.py <workspace> --group tells`, from genjutsu 4.1.3, on `runs/20261113T183357Z/workspace-1` (`tells.md`, `tells.json`): **18 checked, 0 tells to confront.**

## Build and media

`bin/capture.sh` copied the workspace outside the repository, ran `npm ci && npm run build` (log in `build.log`) and shot the build with genjutsu's `shoot.mjs`: served from disk, no server, headless Chrome on macOS. `shots.json` holds what the tool reported.

| File | What | Viewport | Output |
|---|---|---|---|
| `media/desktop.png` | First screen, desktop | 1440x900 | 1440x900, 88 KB |
| `media/desktop-full.png` | Whole page, desktop | 1440x900 | 1440x2677, 219 KB |
| `media/mobile.png` | First screen, phone | 390x844 at 2x | 780x1688, 143 KB |
| `media/mobile-full.png` | Whole page, phone | 390x844 at 2x | 780x5690, 448 KB |

Page height: 2677 px at 1440, 2845 px at 390. No sideways overflow, no console error, no exception in any still. The only unanswered request is `/favicon.ico`.

## Defects and notes

- No visual on the first screen at either width; the first non-text element is a table 1377 px down the page at 1440 px wide, 1465 px down at 390.
- At 1440 px the text column ends at x = 800 and the tables at x = 928; the header link is the only thing to the right of that.
- System sans only, 400 and 500 weights, modest size steps: no typographic character.
- Grader score 1.00: `page-has-content` passed; `paint-fired` passed; `paint-loaded` passed. The graders only check that a page was written and which skill ran; they do not judge the page.
