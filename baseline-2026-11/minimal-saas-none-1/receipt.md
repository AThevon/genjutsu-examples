# minimal-saas-none-1 - receipt

Baseline case `minimal-saas`, arm **none**, run 1 of 2: the landing page of Ploverdesk, a fictional B2B SaaS, with a brief that asks for a minimal, restrained style. One recorded run, built unchanged, 0 human edits. The comparison with the other arms is in [`../COMPARE.md`](../COMPARE.md).

| | |
|---|---|
| Arm | none |
| Plugin under test | `arms/none/plugin`, a plugin that holds only its manifest (`baseline-none` 0.0.0): no skill, command, agent, hook or server |
| Model | `claude-opus-5-5` (Claude Code 2.1.323, `claude plugin eval`, headless) |
| Date | 2026-11-13 |
| Cost | $0.46 (0.457455) |
| Turns | 12 |
| Duration | 110 s |
| Subagents | 0 |
| Stack | React 19 + Vite + TypeScript, vanilla CSS, no animation library (template react) |
| Build | `npm ci && npm run build` passed on the first try, no edits |
| Human edits | 0 |
| Command | `baseline-2026-11/bin/run-arm.sh none minimal-saas 1` |

## The prompt

The case prompt without its leading slash command. As sent (`runs/20261113T183353Z/prompt.md`):

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

From the init event of the run's trace (`runs/20261113T183353Z/trace-facts.json`, written by `bin/trace-facts.py`):

- Plugins: `baseline-none`, `cc-plugin-agents-md`, `cc-plugin-privacy`, `cc-plugin-plugin-authoring`. The three `cc-plugin-*` ones are built into Claude Code.
- Skills added by the plugin under test: none.
- The other 17 skills are Claude Code's built-in ones (deep-research, dataviz, update-config, verify, debug, code-review, simplify, batch, fewer-permission-prompts, doctor, loop, schedule, claude-api, workflow-authoring, run, run-skill-generator, plugin-authoring). No skill from the machine's own configuration is in the list.
- MCP servers: none.
- Skill tool calls: 0.

## What it built

Header with a demo link and a trial button, an eyebrow line, the headline "See only the invoice lines that don't match.", a drawn panel of five invoice lines (two matched, three flagged in rust, no amounts, captioned "Illustration"), three numbered steps in three columns, two definition lists, the price, a "Who we are" paragraph, a closing call to action and a footer. Warm off-white ground, the system sans, a monospace for labels, one rust accent. No animation. Wrote `MASTER.md` on its own; no previews.

The run's last message is kept whole in `trace-facts.json` (`final_message`).

## Read by eye

A competent, quiet page that is exactly the page everyone expects: eyebrow, two-line headline, grey paragraph, black button, then a bordered card that imitates the product, then three steps numbered 01, 02, 03 in three columns. The warm off-white with one rust accent and monospace labels is the current stock answer to "minimal". The one thing that works is the panel under the hero: it shows the product's promise (flagged lines stand out, the rest recede) before you read anything. No visual idea of its own beyond that; a designer would call it a clean template and would not be able to say which product it belongs to with the copy removed. The left title, right list sections lower down are orderly and forgettable.

- One identifiable visual idea: Partly: the flagged-lines panel. Everything around it is the default.
- Distinguishable from a default template: Not distinguishable from a default "minimal SaaS" template.

## Tells audit

`python3 skills/_jutsu/design-audit/scripts/audit.py <workspace> --group tells`, from genjutsu 4.1.3, on `runs/20261113T183353Z/workspace-1` (`tells.md`, `tells.json`): **18 checked, 1 tell to confront.** Fired: U+2014 (em dash) in displayed text (1).

## Build and media

`bin/capture.sh` copied the workspace outside the repository, ran `npm ci && npm run build` (log in `build.log`) and shot the build with genjutsu's `shoot.mjs`: served from disk, no server, headless Chrome on macOS. `shots.json` holds what the tool reported.

| File | What | Viewport | Output |
|---|---|---|---|
| `media/desktop.png` | First screen, desktop | 1440x900 | 1440x900, 93 KB |
| `media/desktop-full.png` | Whole page, desktop | 1440x900 | 1440x3525, 289 KB |
| `media/mobile.png` | First screen, phone | 390x844 at 2x | 780x1688, 152 KB |
| `media/mobile-full.png` | Whole page, phone | 390x844 at 2x | 780x8440, 601 KB |

Page height: 3525 px at 1440, 4220 px at 390. No sideways overflow, no console error, no exception in any still. The only unanswered request is `/favicon.ico`.

## Defects and notes

- The three steps are numbered 01, 02, 03 above three equal columns (`src/App.tsx:109`); the static tells audit reports neither pattern.
- One U+2014 in displayed text, in the panel's `aria-label` (`src/App.tsx:29`): the one tell the audit reports.
- U+2014 written by the run: src/App.tsx (1). This repository holds no literal U+2014, so the committed copy writes each as the character reference `&#8212;`, which renders as the same dash (`bin/hygiene.py`). Nothing else the run wrote was changed.
- Grader score 1.00: `page-has-content` passed. The graders only check that a page was written and which skill ran; they do not judge the page.
