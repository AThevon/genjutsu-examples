# minimal-saas-candidate-r1-1 - receipt

Candidate run, round 1: case `minimal-saas`, the genjutsu arm run against the local branch `feat/headless-presence` instead of the released plugin. One recorded run, built unchanged, 0 human edits. Judged blind, so this receipt holds facts only.

| | |
|---|---|
| Arm | candidate-r1 (genjutsu `paint`) |
| Plugin under test | genjutsu 4.1.4 at local commit `8d57853` (`feat/headless-presence`, three commits on `d5c614a`) |
| Model | `claude-opus-5-5` (Claude Code 2.1.323, `claude plugin eval`, headless) |
| Date | 2026-11-13 |
| Cost | $2.14 (2.136269) |
| Turns | 36 |
| Duration | 382 s |
| Subagents | 0 |
| Stack | React 19 + Vite + TypeScript, vanilla CSS, no animation library (template react) |
| Build | `npm ci && npm run build` passed on the first try, no edits |
| Human edits | 0 |
| Command | `GENJUTSU=<candidate checkout> ARM_LABEL=candidate-r1 baseline-2026-11/bin/run-arm.sh genjutsu minimal-saas 1` |

## The prompt

As sent (`runs/20261113T191933Z/prompt.md`, front matter left out here):

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

## The run

- Tool calls: Bash 16, Edit 7, Grep 2, Read 2, Write 8. Skill tool calls: 0 (the slash command expands `paint` in place).
- Graders: page-has-content passed; paint-fired passed; paint-loaded passed. Score 1.00. They check that a page was written and which skill ran, not the page.
- Files written: `MASTER.md`, `index.html`, `preview/design-system.html`, `preview/thesis.html`, `public/favicon.svg`, `src/App.tsx`, `src/components/MatchTable.tsx`, `src/index.css`, `src/main.tsx`, `src/styles/tokens.css`.
- The line the run printed for what it set aside: `Set aside: SaaS routine (gradient hero, dashboard screenshot, logo strip, three feature cards); its opposite, a text-only page with one giant headline; a product dashboard; a spreadsheet grid. Kept: the three source documents (invoice, purchase order, delivery note) read line by line against each other.`
- The run's last message is kept whole in `runs/20261113T191933Z/trace-facts.json` (`final_message`).

## Tells audit

`audit.py <workspace> --group tells` from the candidate checkout (`tells.md`, `tells.json`): **18 checked, 0 tells to confront.**

## Build and media

`bin/capture.sh` copied the workspace outside the repository, ran `npm ci && npm run build` (log in `build.log`) and shot the build with genjutsu's `shoot.mjs`: served from disk, no server, headless Chrome on macOS. `shots.json` holds what the tool reported.

| File | What | Viewport | Output |
|---|---|---|---|
| `media/desktop.png` | First screen, desktop | 1440x900 | 1440x900, 86 KB |
| `media/desktop-full.png` | Whole page, desktop | 1440x900 | 1440x2768, 272 KB |
| `media/mobile.png` | First screen, phone | 390x844 at 2x | 780x1688, 132 KB |
| `media/mobile-full.png` | Whole page, phone | 390x844 at 2x | 780x6698, 544 KB |
| `media/desktop-full-at-load.png` | Whole page 300 ms after load, unprepared | 1440x900 | 1440x2768, 266 KB |

On load: plays one motion on load (matched rows recede); stills taken 4 s after preparation, the state at 300 ms is media/desktop-full-at-load.png.

No sideways overflow in any still.
Console errors: 0. Exceptions: 0.
