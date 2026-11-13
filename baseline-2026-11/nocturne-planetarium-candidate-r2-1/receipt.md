# nocturne-planetarium-candidate-r2-1 - receipt

Candidate run, round 2: case `nocturne-planetarium`, the genjutsu arm run against the local branch `feat/headless-presence` instead of the released plugin. One recorded run, built unchanged, 0 human edits. Judged blind, so this receipt holds facts only.

| | |
|---|---|
| Arm | candidate-r2 (genjutsu `paint`) |
| Plugin under test | genjutsu 4.1.4 at local commit `e4c31a6` (`feat/headless-presence`, six commits on `d5c614a`) |
| Model | `claude-opus-5-5` (Claude Code 2.1.323, `claude plugin eval`, headless) |
| Date | 2026-11-13 |
| Cost | $2.47 (2.471175) |
| Turns | 36 |
| Duration | 554 s |
| Subagents | 0 |
| Stack | React 19 + Vite + TypeScript, vanilla CSS, no animation library (template react) |
| Build | `npm ci && npm run build` passed on the first try, no edits |
| Human edits | 0 |
| Command | `GENJUTSU=<candidate checkout> ARM_LABEL=candidate-r2 baseline-2026-11/bin/run-arm.sh genjutsu nocturne-planetarium 1` |

## The prompt

As sent (`runs/20261113T200022Z/prompt.md`, front matter left out here):

```
/genjutsu:paint build the landing page for Nocturne, the late program of a planetarium in Lisbon.

The brief. The planetarium and its program are fictional, made up for this example: give the planetarium no name and do not name or suggest any real planetarium or venue. This is everything it has given us:

- Nocturne is the planetarium's after-hours program. On Friday and Saturday nights the dome first shows the night sky above Lisbon as it is that evening, with a narrator, then a 40-minute show. Doors 21:30, first show 22:00, last show 23:30. Tickets 12 EUR, 8 EUR for students, booked at /tickets.
- The hero is the sky over Lisbon as the dome will show it at 22:00 on Friday 9 October 2026. data/stars.json holds the brightest stars of the Yale Bright Star Catalogue (public domain) and the one bright planet above the horizon then, Saturn (from NASA JPL Horizons), with their altitude and azimuth already computed for that place and time, their magnitude and, for stars, their proper name when they have one. It also lists the Moon and the other planets, which are below the horizon or too faint at that time: do not draw them. Use it. Do not invent stars, constellation lines, events or claims that are not in the data or in this brief.
- The page scrolls from dusk to the first show: the program, what is in tonight's sky, the practical information.
- It is for adults in their 20s to 40s looking for an evening out, not school groups. There are no reviews and no attendance numbers yet: the program launches with this page.

Nobody is available to answer questions during this session. Up-front answers to the gates:
- Preview mode: A. Write each preview as a standalone HTML file under preview/ in the project.
- Scope: the landing page. You may write src/, index.html, public/, preview/ and MASTER.md; create nothing outside the project.
- Dependencies are installed (node_modules is present) and `npm run build` works. There is no network: install nothing. Do not start a dev server.

Finish with the final report the pipeline asks for.
```

## The run

- Tool calls: Bash 20, Edit 6, Read 1, Write 8. Skill tool calls: 0 (the slash command expands `paint` in place).
- Graders: page-has-content passed; paint-fired passed; paint-loaded passed. Score 1.00. They check that a page was written and which skill ran, not the page.
- Files written: `MASTER.md`, `index.html`, `preview/design-system.html`, `preview/thesis.html`, `src/App.tsx`, `src/SkyChart.tsx`, `src/index.css`, `src/main.tsx`, `src/sky.ts`, `src/tokens.css`.
- The line the run printed for what it set aside: `Set aside: navy + twinkling particles + nebula; white museum page with photos; sci-fi HUD console; nebula astrophotography. Kept: the observer's all-sky horizon chart (red observing light as accent).`
- The run's last message is kept whole in `runs/20261113T200022Z/trace-facts.json` (`final_message`).

## Tells audit

`audit.py <workspace> --group tells` from the candidate checkout (`tells.md`, `tells.json`): **18 checked, 0 tells to confront.**

## Build and media

`bin/capture.sh` copied the workspace outside the repository, ran `npm ci && npm run build` (log in `build.log`) and shot the build with genjutsu's `shoot.mjs`: served from disk, no server, headless Chrome on macOS. `shots.json` holds what the tool reported.

| File | What | Viewport | Output |
|---|---|---|---|
| `media/desktop.png` | First screen, desktop | 1440x900 | 1440x900, 154 KB |
| `media/desktop-full.png` | Whole page, desktop | 1440x900 | 1440x4100, 495 KB |
| `media/mobile.png` | First screen, phone | 390x844 at 2x | 780x1688, 150 KB |
| `media/mobile-full.png` | Whole page, phone | 390x844 at 2x | 780x9602, 810 KB |

On load: nothing plays on load: the still taken 300 ms after load is the same file as the one taken 4 s after preparation, so it was not kept; the one motion (a pointer ring on the chart) waits for an object to be chosen.

No sideways overflow in any still.
Console errors: 0. Exceptions: 0.
