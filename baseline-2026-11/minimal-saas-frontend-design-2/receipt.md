# minimal-saas-frontend-design-2 - receipt

Baseline case `minimal-saas`, arm **frontend-design**, run 2 of 2: the landing page of Ploverdesk, a fictional B2B SaaS, with a brief that asks for a minimal, restrained style. One recorded run, built unchanged, 0 human edits. The comparison with the other arms is in [`../COMPARE.md`](../COMPARE.md).

| | |
|---|---|
| Arm | frontend-design |
| Plugin under test | Anthropic's `frontend-design` plugin 1.1.1 (one skill, `frontend-design:frontend-design`), copied from the `claude-plugins-official` marketplace as installed on the machine |
| Model | `claude-opus-5-5` (Claude Code 2.1.323, `claude plugin eval`, headless) |
| Date | 2026-11-13 |
| Cost | $0.68 (0.676292) |
| Turns | 17 |
| Duration | 167 s |
| Subagents | 0 |
| Stack | React 19 + Vite + TypeScript, vanilla CSS, no animation library (template react) |
| Build | `npm ci && npm run build` passed on the first try, no edits |
| Human edits | 0 |
| Command | `baseline-2026-11/bin/run-arm.sh frontend-design minimal-saas 2` |

## The prompt

The case prompt without its leading slash command. The skill is not named in the prompt. As sent (`runs/20261113T183921Z/prompt.md`):

```
build the landing page for Ploverdesk.

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

From the init event of the run's trace (`runs/20261113T183921Z/trace-facts.json`, written by `bin/trace-facts.py`):

- Plugins: `frontend-design`, `cc-plugin-agents-md`, `cc-plugin-privacy`, `cc-plugin-plugin-authoring`. The three `cc-plugin-*` ones are built into Claude Code.
- Skills added by the plugin under test: `frontend-design:frontend-design`.
- The other 17 skills are Claude Code's built-in ones (deep-research, dataviz, update-config, verify, debug, code-review, simplify, batch, fewer-permission-prompts, doctor, loop, schedule, claude-api, workflow-authoring, run, run-skill-generator, plugin-authoring). No skill from the machine's own configuration is in the list.
- MCP servers: none.
- Skill tool calls: 1, `frontend-design:frontend-design`. The skill triggered on its own description.

## What it built

Header with a demo link and a trial button, the headline "Your team checks only the invoice lines that don't match.", then a bordered panel with an eight-line example invoice from a hardware supplier: after load, by the run's own account, the five matching lines turn grey, the three mismatches keep dark text with the differing cell tinted red and the reason beside it, and a "Show only mismatches" button hides the matched lines. Then four numbered steps, a details list, a closing trial section, a footer line. Cool grey-white ground, Avenir Next, blue-black ink, red only on mismatches. Wrote `MASTER.md`; no previews.

The run's last message is kept whole in `trace-facts.json` (`final_message`).

## Read by eye

Same idea as this arm's first run, executed a little more conventionally: the example invoice is the centre of the page and red marks exactly the cells that disagree, but it now sits in a white bordered card with a button, which pulls it back toward "product screenshot in a box". Still the most informative first screen of the second round: you understand the product from the table before reading the paragraph. Same typeface as run 1, so Avenir Next is this arm's own default, not a choice made for the brief. Below the table: four numbered columns and a details list, the same furniture as run 1.

- One identifiable visual idea: Yes: an example invoice with the mismatched cells marked, and a switch that hides the rest.
- Distinguishable from a default template: Distinguishable on the first screen and a half; standard below.

## Tells audit

`python3 skills/_jutsu/design-audit/scripts/audit.py <workspace> --group tells`, from genjutsu 4.1.3, on `runs/20261113T183921Z/workspace-1` (`tells.md`, `tells.json`): **18 checked, 0 tells to confront.**

## Build and media

`bin/capture.sh` copied the workspace outside the repository, ran `npm ci && npm run build` (log in `build.log`) and shot the build with genjutsu's `shoot.mjs`: served from disk, no server, headless Chrome on macOS. `shots.json` holds what the tool reported.

| File | What | Viewport | Output |
|---|---|---|---|
| `media/desktop.png` | First screen, desktop | 1440x900 | 1440x900, 102 KB |
| `media/desktop-full.png` | Whole page, desktop | 1440x900 | 1440x2860, 290 KB |
| `media/mobile.png` | First screen, phone | 390x844 at 2x | 780x1688, 158 KB |
| `media/mobile-full.png` | Whole page, phone | 390x844 at 2x | 780x9288, 735 KB |
| `media/desktop-full-at-load.png` | Whole page 300 ms after load, before anything played | 1440x900 | 1440x2860, 288 KB |

Page height: 2860 px at 1440, 4644 px at 390. No sideways overflow, no console error, no exception in any still. The only unanswered request is `/favicon.ico`.

## Defects and notes

- Invented example quantities and prices again, labelled "Example data, for illustration"; flagged by the run itself against the brief's "invent no other figure".
- Avenir Next again, with the same fallback caveat as run 1.
- On a phone the eight-line example stacks into labelled values, and the page is the longest of the six at 390 px wide: 4644 px (`media/mobile-full.png`).
- Grader score 1.00: `page-has-content` passed; `skill-fired` passed. The graders only check that a page was written and which skill ran; they do not judge the page.
