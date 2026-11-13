# invoice-mark-paid-none-1 - receipt

The no-plugin arm of a pair on the existing fixture `invoice-mark-paid` (Folio, a fictional invoice list whose "Mark as paid" action gives no feedback). The other arm is the run already in this repository, [`../../invoice-mark-paid/`](../../invoice-mark-paid/receipt.md), made with `/genjutsu:cast`. One recorded run, built unchanged, 0 human edits. The comparison is in [`../COMPARE.md`](../COMPARE.md).

| | |
|---|---|
| Arm | none |
| Plugin under test | `arms/none/plugin`, a plugin that holds only its manifest (`baseline-none` 0.0.0): no skill, command, agent, hook or server |
| Model | `claude-opus-5-5` (Claude Code 2.1.323, `claude plugin eval`, headless) |
| Date | 2026-11-13 |
| Cost | $0.91 (0.910362) |
| Turns | 19 |
| Duration | 211 s |
| Subagents | 0 |
| Stack | React 19 + Vite + TypeScript, `motion` 14 installed and unused before the run |
| Build | `npm ci && npm run build` passed on the first try, no edits |
| Human edits | 0 |
| Command | `baseline-2026-11/bin/run-arm.sh none invoice-mark-paid 1` |

The genjutsu arm is not a fresh run: it is the recorded run of 2026-10-04 (genjutsu 4.1.0 at `09c177b`, Claude Code 2.1.289, same model, same fixture, $1.88, 45 turns, 329 s). The two arms therefore differ by more than the plugin: a month, and a Claude Code version.

## The prompt

The prompt of `cases/invoice-mark-paid` without its leading `/genjutsu:cast`; nothing else changed, so it still speaks of "gates" and of "the pipeline". As sent (`runs/20261113T183007Z/prompt.md`):

```
the "Mark as paid" action in our invoice list is dead, make it feel like the money landed

Folio, its user and its clients are fictional, made up for this example.

Nobody is available to answer questions during this session. Up-front answers to the gates:
- Preview mode: A. Write each preview as a standalone HTML file under preview/ in the project.
- Scope: the invoice list and its "Mark as paid" action. You may edit files under src/ and write previews under preview/; create nothing outside the project.
- Dependencies are installed (node_modules is present) and `npm run build` works. There is no network: install nothing. Do not start a dev server.

Finish with the final report the pipeline asks for.
```

## What the session had loaded

From the init event of the run's trace (`runs/20261113T183007Z/trace-facts.json`, written by `bin/trace-facts.py`):

- Plugins: `baseline-none`, `cc-plugin-agents-md`, `cc-plugin-privacy`, `cc-plugin-plugin-authoring`. The three `cc-plugin-*` ones are built into Claude Code.
- Skills added by the plugin under test: none.
- The 17 skills listed are Claude Code's built-in ones (deep-research, dataviz, update-config, verify, debug, code-review, simplify, batch, fewer-permission-prompts, doctor, loop, schedule, claude-api, workflow-authoring, run, run-skill-generator, plugin-authoring). No skill from the machine's own configuration is in the list.
- MCP servers: none. Skill tool calls: 0.

## What it changed

- `src/InvoiceList.tsx`: the clicked row is tinted green and fades back, the old pill fades out and "Paid" springs in with a check mark that draws itself, the button shrinks on press, and "Paid just now, Undo" takes its place for 8 seconds.
- `src/App.tsx`: Paid counts up and Outstanding counts down, a signed amount and a ring show on the Paid card, Undo restores the previous status, and a hidden status line announces the payment.
- `src/AnimatedAmount.tsx` (new): the counting number. `src/index.css`: styles added at the end. `preview/mark-as-paid.html` (new): a standalone preview.

The run's last message is kept whole in `trace-facts.json` (`final_message`).

## Read by eye

More happens than in the genjutsu run, and more of it happens where you clicked. The row turns pale green and fades back, its amount goes green, a check mark draws itself in the new Paid pill, the Paid card takes a green ring and a "+€4,200.00" beside its total while Paid counts up and Outstanding counts down, and "Paid just now · Undo" takes the button's place for eight seconds. As an answer to "make it feel like the money landed" it is the more literal and the more satisfying of the two. It is also less disciplined: four things confirm one click, the Outstanding card loses 4,200.00 with no sign of where it went, and the status cell is empty in the stills at 120 ms and 350 ms after the click (the old pill has left and the Paid pill has not arrived), on the very row the eye is on. It added an Undo nobody asked for and put a check mark in every Paid pill of the list.

## Tells audit

`audit.py --group tells` from genjutsu 4.1.3 on the workspace (`tells.md`, `tells.json`): **18 checked, 0 tells to confront.** The same audit on the genjutsu run's workspace also reports 0 (`../invoice-mark-paid-genjutsu-20261004/tells.md`).

## Build and media

`bin/capture-cast.sh` built the workspace outside the repository (`media/build.log`) and shot it with genjutsu's `shoot.mjs`, in real time, one page load and one click per still. The click is on "Mark as paid" of FOL-2026-032 (Overdue, 4,200.00 EUR). The same script shot the genjutsu run into `../invoice-mark-paid-genjutsu-20261004/media/`.

| File | What |
|---|---|
| `media/rest.png` | 1440x900, before any click |
| `media/click-120ms.png` | 120 ms after the click |
| `media/click-350ms.png` | 350 ms after |
| `media/click-800ms.png` | 800 ms after |
| `media/click-3000ms.png` | 3 s after |
| `media/strip.png` | The four after-click stills, cropped to the cards and the first rows, stacked |
| `media/mobile.png` | 390x844 at 2x, before any click |

No console error and no exception in any still. Stills cannot show easing or rhythm: nothing here judges how the motion feels in time.

## Defects and notes

- The status cell of the clicked row is empty in the stills taken 120 ms and 350 ms after the click (`media/click-120ms.png`, `media/click-350ms.png`); the Paid pill is there at 800 ms.
- The signed amount appears on the Paid card only; Outstanding counts down with no signed amount.
- The run added an Undo (8 s) and a check mark in every Paid pill; neither was asked for.
- mobile.png overflows sideways (page 778 px wide at 390): the fixture has no small-screen rules, as in the genjutsu run.
- Grader score 1.00: `button-has-interaction` passed. It only checks that the list file now holds some motion.
