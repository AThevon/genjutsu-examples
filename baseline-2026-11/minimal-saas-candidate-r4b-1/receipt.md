# minimal-saas-candidate-r4b-1 - receipt

Candidate run, round 4, arm B: case `minimal-saas`, the genjutsu arm run against the local branch `feat/headless-presence-bound` (arm A's text plus a bound on the values of a first-screen example) instead of the released plugin. One recorded run, built unchanged, 0 human edits. Judged blind, so this receipt holds facts only.

| | |
|---|---|
| Arm | candidate-r4b (genjutsu `paint`) |
| Plugin under test | genjutsu 4.2.0 at local commit `1548e63` (`feat/headless-presence-bound`, one commit on `164cd3e`) |
| Model | `claude-opus-5-5` (Claude Code 2.1.325, `claude plugin eval`, headless) |
| Date | 2026-11-13 |
| Cost | $1.95 (1.947248) |
| Turns | 34 |
| Duration | 349 s |
| Subagents | 0 |
| Stack | React 19 + Vite + TypeScript, vanilla CSS, no animation library (template react) |
| Build | `npm ci && npm run build` passed on the first try, no edits |
| Human edits | 0 |
| Command | `GENJUTSU=<candidate checkout> ARM_LABEL=candidate-r4b MAX_COST_USD=3.4 baseline-2026-11/bin/run-arm.sh genjutsu minimal-saas 1` |

## The prompt

As sent (`runs/20261113T210311Z/prompt.md`, front matter left out here):

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

- Tool calls: Bash 17, Edit 5, Read 4, Write 7. Skill tool calls: 0 (the slash command expands `paint` in place).
- Graders: page-has-content passed; paint-fired passed; paint-loaded passed. Score 1.00. They check that a page was written and which skill ran, not the page.
- Files written: `MASTER.md`, `index.html`, `preview/design-system.html`, `preview/thesis.html`, `src/App.tsx`, `src/index.css`, `src/main.tsx`, `src/tokens.css`.
- The line the run printed for what it set aside: `Set aside: SaaS hero with feature cards and logo strip; one centred sentence; ledger grid; Swiss minimal type. Kept: the auditor's tick-and-tie sheet.`
- The run's last message is kept whole in `runs/20261113T210311Z/trace-facts.json` (`final_message`).

## Tells audit

`audit.py <workspace> --group tells` from the candidate checkout (`tells.md`, `tells.json`): **18 checked, 0 tells to confront.**

## Build and media

`bin/capture.sh` copied the workspace outside the repository, ran `npm ci && npm run build` (log in `build.log`) and shot the build with genjutsu's `shoot.mjs`: served from disk, no server, headless Chrome on macOS. `shots.json` holds what the tool reported.

| File | What | Viewport | Output |
|---|---|---|---|
| `media/desktop.png` | First screen, desktop | 1440x900 | 1440x900, 103 KB |
| `media/desktop-full.png` | Whole page, desktop | 1440x900 | 1440x2036, 190 KB |
| `media/mobile.png` | First screen, phone | 390x844 at 2x | 780x1688, 152 KB |
| `media/mobile-full.png` | Whole page, phone | 390x844 at 2x | 780x6032, 434 KB |
| `media/desktop-full-at-load.png` | Whole page 300 ms after load, unprepared | 1440x900 | 1440x2036, 190 KB |

On load: the page plays on load: the still taken 300 ms after load differs from the one taken 4 s after preparation and is kept as `media/desktop-full-at-load.png`; the other stills show the settled state; the one motion is the row of agreeing lines in the example fading from ink to grey over 400 ms, half a second after load.

No sideways overflow in any still.
Console errors: 0. Exceptions: 0.
