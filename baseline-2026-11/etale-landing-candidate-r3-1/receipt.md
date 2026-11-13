# etale-landing-candidate-r3-1 - receipt

Candidate run, round 3: case `etale-landing`, the genjutsu arm run against the local branch `feat/headless-presence` instead of the released plugin. One recorded run, built unchanged, 0 human edits. Judged blind, so this receipt holds facts only.

| | |
|---|---|
| Arm | candidate-r3 (genjutsu `paint`) |
| Plugin under test | genjutsu 4.1.4 at local commit `5e3f9c4` (`feat/headless-presence`, nine commits on `d5c614a`) |
| Model | `claude-opus-5-5` (Claude Code 2.1.323, `claude plugin eval`, headless) |
| Date | 2026-11-13 |
| Cost | $2.92 (2.920762) |
| Turns | 40 |
| Duration | 632 s |
| Subagents | 0 |
| Stack | React 19 + Vite + TypeScript, vanilla CSS, no animation library (template react) |
| Build | `npm ci && npm run build` passed on the first try, no edits |
| Human edits | 0 |
| Command | `GENJUTSU=<candidate checkout> ARM_LABEL=candidate-r3 baseline-2026-11/bin/run-arm.sh genjutsu etale-landing 1` |

## The prompt

As sent (`runs/20261113T202811Z/prompt.md`, front matter left out here):

```
/genjutsu:paint build the landing page for Étale.

The brief. Étale is a fictional product made up for this example, and this is everything its founders have given us:

- Étale is an iPhone app for people who swim in the cold water of Aquatic Park, San Francisco, all year round. It answers one question before you walk down to the beach: when is the water slack (étale is the French word for slack water, the still moment between ebb and flood, when the current is weakest), and how strong the current runs between two slacks.
- Its numbers come from two NOAA CO-OPS stations, and data/tide.json holds one real day of both, 2 October 2026, as fetched from NOAA: the tide predictions of station 9414290 San Francisco, and the slack water and current predictions of station SFB1204 (Alcatraz Island, southwest of, the closest predicted current station, in the bay off the cove). The file names each station, where it is, its datum and its units. Use those numbers and label each one with its date and its station. Slack water is not high or low tide: take the slack times from the current predictions. The app shows no water temperature, so the page must not either. Do not invent any other figure.
- The swimmers it is for train there before work, mostly without a wetsuit. They already know the cove and read the tide themselves on a printed table or a weather site. They want the next slack window at a glance, and an alert the evening before.
- What exists: an iOS beta on TestFlight. No Android, no web app, no prices, no user numbers, no testimonials. The page has one job: get a swimmer onto the TestFlight beta, at /beta.

Nobody is available to answer questions during this session. Up-front answers to the gates:
- Preview mode: A. Write each preview as a standalone HTML file under preview/ in the project.
- Scope: the landing page. You may write src/, index.html, public/, preview/ and MASTER.md; create nothing outside the project.
- Dependencies are installed (node_modules is present) and `npm run build` works. There is no network: install nothing. Do not start a dev server.

Finish with the final report the pipeline asks for.
```

## The run

- Tool calls: Bash 23, Edit 5, Write 11. Skill tool calls: 0 (the slash command expands `paint` in place).
- Graders: page-has-content passed; paint-fired passed; paint-loaded passed. Score 1.00. They check that a page was written and which skill ran, not the page.
- Files written: `MASTER.md`, `index.html`, `preview/design-system.html`, `preview/thesis.html`, `public/favicon.svg`, `src/App.tsx`, `src/CurrentChart.tsx`, `src/TideChart.tsx`, `src/data.ts`, `src/index.css`, `src/main.tsx`, `src/tokens.css`.
- The line the run printed for what it set aside: `Set aside: an app landing with a phone mockup, three feature cards and testimonials; a bare text page with one button and no data; ocean waves and blue gradients; the printed nautical tide table. Kept: the NOAA current prediction, slack as the zero crossing.`
- The run's last message is kept whole in `runs/20261113T202811Z/trace-facts.json` (`final_message`).

## Tells audit

`audit.py <workspace> --group tells` from the candidate checkout (`tells.md`, `tells.json`): **18 checked, 0 tells to confront.**

## Build and media

`bin/capture.sh` copied the workspace outside the repository, ran `npm ci && npm run build` (log in `build.log`) and shot the build with genjutsu's `shoot.mjs`: served from disk, no server, headless Chrome on macOS. `shots.json` holds what the tool reported.

| File | What | Viewport | Output |
|---|---|---|---|
| `media/desktop.png` | First screen, desktop | 1440x900 | 1440x900, 132 KB |
| `media/desktop-full.png` | Whole page, desktop | 1440x900 | 1440x3426, 376 KB |
| `media/mobile.png` | First screen, phone | 390x844 at 2x | 780x1688, 141 KB |
| `media/mobile-full.png` | Whole page, phone | 390x844 at 2x | 780x9352, 773 KB |
| `media/desktop-full-at-load.png` | Whole page 300 ms after load, unprepared | 1440x900 | 1440x3426, 376 KB |

On load: the page plays on load: the still taken 300 ms after load differs from the one taken 4 s after preparation and is kept as `media/desktop-full-at-load.png`; the other stills show the settled state; the one motion is a ring travelling once along the current trace to the 05:57 slack, in 1400 ms.

No sideways overflow in any still.
Console errors: 0. Exceptions: 0.
