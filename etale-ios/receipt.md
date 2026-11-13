# etale-ios - cast, SwiftUI

**Two runs of the same case, told in order.** The first native example: every other one here is a web page. Run 1 was made on genjutsu 4.1.3; its defects pointed at three gaps in genjutsu's modules; those were fixed; run 2 is the same prompt, the same model, the same fixture and the same harness on the fixed plugin. One run each time, each built unchanged on the first try, 0 human edits. Run 2 was not picked among several: it is the only run made after the fix.

**What is the runs' work here:** the way a slack row opens into its tide detail. The starting app (`cases/etale-ios/app`: the Today screen, its copy, the NOAA data, the tide curve, the alert switch) was written by hand for this case and held no animation: a row pushed the detail with the system transition of `NavigationStack` (`before/push.webp`).

- **Run 1** replaced that push with a hand-built card that grows out of the row. To do it, it rewrote the list and the detail screen (487 lines), gave up the navigation stack, the bar and the edge-swipe back, and left a drag-to-close that flickers on every frame.
- **Run 2** used the system zoom transition (`matchedTransitionSource` on the row, `navigationTransition(.zoom)` on the detail): 78 lines added, none removed. The stack, the bar, the back button and the edge-swipe back are all still there, the two screens look at rest exactly as they did, and no drag flickers. Its audit ran the new check of the code against the modules it loaded and reported two problems, both true. It has smaller defects of its own, listed under run 2.

**What this pair does not prove.** Run 2 named the zoom transition in its thesis before it had read a single module, as the pipeline orders it (thesis, then load): the choice came from the model, not from the fixed `swiftui-motion`. The same model with the same prompt did not make that choice in run 1. With one run on each side, nothing here says how much of the difference is the fix and how much is chance. What the fixed plugin can be seen doing in run 2 is narrower: the modules it read afterwards agree with the thesis instead of being silent, and the audit prints the new check.

| | Run 1 | Run 2 |
|---|---|---|
| genjutsu | 4.1.3 at `5e00595` | 4.1.4 plus the two module-fix commits that shipped in 4.2.0, at `3e0d6d3` (branch `fix/native-shared-element`) |
| Model, harness | claude-opus-5-5, Claude Code 2.1.323, `claude plugin eval`, headless | the same |
| Date | 2026-11-13 | 2026-11-13 |
| Cost | $3.42 | $1.53 |
| Turns | 22 | 22 |
| Duration | 898 s | 330 s |
| Swift changed | 3 files, 487 insertions, 78 deletions | 3 files, 78 insertions, 0 deletions |
| Build | succeeded on the first try, no compiler warning | succeeded on the first try, no compiler warning |
| Transition | hand-built overlay above the stack | system zoom, inside the stack |
| Navigation bar, back button, edge-swipe back | gone | kept (filmed) |
| Drag to close | flickers on every frame | the system's own, monotonic (0 reversals over 78 frames at 60 fps) |
| Screens at rest | both restyled | unchanged from the starting app |
| Audit: loaded modules against the code | no such check in 4.1.3 | printed: 2 problems, 1 note, 2 "no departure" |
| Human edits | 0 made, 1 needed | 0 made, 0 needed to ship the transition; 1 choice to revisit (below) |

## The prompt

The same for both runs, word for word:

```
/genjutsu:cast Étale's iOS day list should open into the tide detail as one surface, not a push

Étale is a fictional slack-water app, made up for this example. Its numbers are real NOAA predictions for 2 October 2026.

Nobody is available to answer questions during this session. Up-front answers to the gates:
- Preview mode: A. Write each preview as a standalone HTML file under preview/ in the project.
- Scope: the Today list and the tide detail it opens. You may edit and add Swift files under Etale/ and write previews under preview/; create nothing outside the project. Etale/ is a folder the Xcode project keeps in sync with the disk: a Swift file added there is compiled, so do not edit Etale.xcodeproj.
- The app targets iOS 26 and is built with Xcode 27. Xcode cannot run in this session: do not try to build. There is no network: install nothing.

Finish with the final report the pipeline asks for.
```

Nobody answered the gates. The skill's "When nobody is answering" rule applied, and each run marked its own thesis **UNVALIDATED**. Neither run could build: each wrote its Swift without a compiler and said so in the first lines of its report.

## Run 1: genjutsu 4.1.3, a hand-built overlay

**It compiles and it runs. It is not ready to ship:** the drag that closes the detail flickers on every frame, the lines that travel run over each other mid-flight, and the run gave up the system's edge-swipe back to get its effect. Its media is in `media/`, its code in `runs/20261113T184049Z/workspace-1`.

| | |
|---|---|
| Skill | `/genjutsu:cast` |
| genjutsu | 4.1.3 at commit `5e00595` (the v4.1.3 tag plus two README-only commits) |
| Model | claude-opus-5-5 (Claude Code 2.1.323, `claude plugin eval`, headless) |
| Date | 2026-11-13 |
| Cost | $3.42 (3.423506) |
| Turns | 22 |
| Duration | 898 s (14 min 58 s) in the run's trace; the harness prints 900 s for the whole case |
| Subagents | 0 |
| Stack | SwiftUI, iOS 26.0 deployment target, Swift 5 language mode with MainActor default isolation, no dependency |
| Build | `xcodebuild` for the iOS 26.5 simulator (Xcode 27.2, iOS 27.2 SDK) succeeded on the first try, no compiler error, no compiler warning |
| Human edits | 0 made. 1 would be needed for the drag defect (one line, below) |

### What it decided

**Interaction thesis (UNVALIDATED, nobody was here to approve it)**, quoted from the final report:

> Tapping a slack row grows that row's own card into the full tide detail.
> - The card's clip opens from the row's frame to the whole screen.
> - The row's three lines (time, turn, next current) move to their places in the detail header, and the time scales up to the 56 pt hero.
> - All of it runs on one `spring(duration: 0.45, bounce: 0)`, which never overshoots: slack water is the moment the current stands still.
> - The rest of the detail fades in after the card has mostly grown (0.2 s ease-out, 0.15 s delay) and fades out first when closing (0.12 s ease-in).
> - Dragging the header down collapses the card back into its row.

**Allowed patterns:** none.

**Variant picked:** B, "the lines move", from three. A only grows the card. C also draws the tide curve.

**Assumptions it made**, in its words "answers I filled in myself":

- The feel is still and exact, no bounce.
- The edge-swipe back is gone: the detail is an overlay, not a navigation screen. In its place: a drag on the header (past 120 pt, or a flick headed past 240 pt), a close button that Esc also triggers, and the VoiceOver escape gesture. The run calls this "a deliberate trade against the usual iOS swipe-back".
- The list is no longer a `List` but a `ScrollView` that keeps the grouped look, each slack row on its own 16 pt card, "because the row's card is what grows".
- The next-current line moved into the detail's header, under the turn, instead of a "Current" row lower down.

**Modules loaded** (its `load_skill` calls): motion-principles, mobile-principles, swiftui-motion. Not loaded: none. `tells`, a web module, was never requested.

### It showed before it wrote

- `preview/thesis.html` (`media/preview.png`): the thesis, the allowed patterns, a phone mock-up that performs the opening, the spring plotted with its formula, the numbers, a Reduce Motion toggle. It says on the page that it approximates timing and curve only, not SwiftUI's rendering.
- `preview/variants.html` (`media/preview-variants.png`): the three variants side by side with one trigger for all three.

Both are HTML approximations of a native screen. Nothing in them was compiled, and the build below is what shows whether the thesis holds in SwiftUI.

### What changed

3 Swift files, 487 insertions, 78 deletions against the starting app. `Etale.xcodeproj`, `EtaleApp.swift`, `TideData.swift` and `tide.json` are untouched.

- `Etale/SlackSurface.swift` (new, 126 lines): the motion constants, the store of each row's frames in the window, the clip shape that grows from the row to the screen (`RevealShape`, animated through `animatableData`), and `travels(from:progress:)`, a `visualEffect` that moves a detail line from where it sat in the row.
- `Etale/TodayView.swift` (rewritten): the `List` became a `ScrollView` of cards; each slack row is a `Button` on its own card that reports the frames of its time, turn, next-current line and bell; the detail is mounted in a `ZStack` above the `NavigationStack`; `open`, `expand` and `close` drive the one spring and hand VoiceOver focus back to the row.
- `Etale/TideDetailView.swift` (rewritten): the detail as a full-screen layer clipped by `RevealShape`, its header with a close button, the content that fades, the row's bell, the header drag, and the Reduce Motion path. `TideCurve` is unchanged.

What a user sees at rest, compared with the starting app (`before/today.png` and `before/detail.png` against `media/today.png` and `media/detail.png`):

- Today: the three slack rows are three separate cards instead of one grouped list, without the disclosure chevrons, and the row's time is set in the rounded design so that it matches the detail's large time.
- Detail: no navigation bar, no "Slack 10:31" title and no back button; a close button top right; one white surface with dividers instead of grouped sections; the "Current" row is gone (its text is the third line of the header).

### The build

```sh
cd etale-ios
cp -R runs/20261113T184049Z/workspace-1 build-20261113T184049Z-1
cd build-20261113T184049Z-1
xcodebuild -project Etale.xcodeproj -scheme Etale -configuration Debug \
  -destination "platform=iOS Simulator,id=<udid of an iPhone 17 on iOS 26.5>" \
  -derivedDataPath /private/tmp/etale-ios-run-dd CODE_SIGNING_ALLOWED=NO build
```

`** BUILD SUCCEEDED **` on the first try, with no error and no warning from the Swift compiler (the only warning in the log is Xcode's "Metadata extraction skipped, no AppIntents.framework dependency found", which the starting app prints too). The run had named three places where it expected the compiler might refuse (`nonisolated struct`, the `onGeometryChange` closures, whether `visualEffect` interpolates under the spring): none did, and the lines do travel.

### Its own audit

**10 checks, 2 problems, 5 for you to run.**

- Problems it found: the rows have no disabled look while the detail is open (they are only made untappable, under the card); the layout spacing is literal numbers (the project has no spacing tokens).
- Listed but not counted: `secondaryLabel` on white computes to 3.4:1, under 4.5:1 for 15 pt text; it is the system colour and the starting app already used it.
- Reduced motion: honoured, with `file:line` (`TodayView.swift:18`, `:108`, `TideDetailView.swift:20`).
- Left unverified, for you to run: the build, Instruments > Animation Hitches, Reduce Motion and Dynamic Type at 200%, VoiceOver, Full Keyboard Access.

What the captures add to that: the build passes unchanged, the opening and the closing do what the thesis says, and the Reduce Motion path is a real cross-fade. They also show three things the audit could not see without running the app: the drag flickers, the travelling lines overlap, and large type breaks the hand-off between the row and the header. The audit did not count the loss of the edge-swipe back as a problem, although `mobile-principles`, which it loaded, says of that gesture "Never override".

### Does the motion match the thesis

Measured on the recordings at 60 frames a second (`takes/segments.py` on frames dumped by `takes/frames.swift`).

- **The card grows from the row to the screen: yes.** `media/open-early.png` (about 70 ms after the tap) and `media/open-mid.png` (about 170 ms): the clip starts on the row's card and reaches the screen edges, the corner radius goes from 16 pt to 0.
- **The three lines travel and the time scales to 56 pt: yes**, with the overlaps listed below.
- **No overshoot: yes.** No frame shows the card or a line past its final place.
- **The rest fades in after, and leaves first: yes.** The curve, the "Slack comes" line and the switch are at partial opacity in `media/open-mid.png` and gone before the card has shrunk in `media/close-mid.png`.
- **Dragging the header down collapses the card: it does collapse, but the drag itself is broken** (first defect).
- **Timing.** The picture changes for 0.8 s after the opening tap and 0.9 s after the closing tap: a spring declared at 0.45 s spends about as long again settling its last pixels. The system push it replaces changes the picture for about 0.43 s (opening) and 0.63 s (back), in `before/push.webp`.

### Defects the run introduced

- **The drag that closes the detail flickers.** `Etale/TideDetailView.swift:177`, `DragGesture(minimumDistance: 10)`, reads the finger in the header's own coordinate space, and the header is inside the surface that the same drag moves (`.offset(y: drag)`, line 65) and scales (line 64). Each frame the surface moves, the translation is measured again from the moved header, and the two answers alternate: over a 300 pt drag the top of the large time sits at 447, 490, 458, 508, 470, 526, 482, 546 px on successive frames (3 px to a point), and the gap between the two positions keeps growing as the finger goes down (`media/defect-drag.webp`, filmed at 60 fps; `media/defect-drag-a.png` and `-b.png` are two consecutive frames, 17 ms apart). Letting go still collapses the card. **What a human would have to change: one line**, `DragGesture(minimumDistance: 10, coordinateSpace: .global)`. Tried in a copy outside this repository: it builds and the same drag then moves monotonically, without alternation. Not applied here: the build is shown as the run left it.
- **The time and the turn overlap in flight.** The time scales from 20 pt to 56 pt about its leading edge while the turn line travels from the row's second column to the header's left margin, so for the first frames of the opening and the last of the closing the two are drawn over each other: "10:31" with "Ebb turns to flood" across its last digits (`media/open-early.png`, `media/close-mid.png`). About 70 ms on the way in, longer on the way out, where the spring is slow.
- **The travelling lines cross the content that fades in.** Mid-opening the next-current line passes over the divider and the "Tide height, metres above MLLW" label, both already partly visible (`media/open-mid.png`).
- **The edge-swipe back is gone, and so is the navigation bar.** The run says so and offers a header drag (broken, above), a close button and the accessibility escape. The detail is no longer a navigation destination: no back button, no title, no swipe from the left edge. SwiftUI has had a system transition for exactly this request since iOS 18 (`matchedTransitionSource` on the row and `.navigationTransition(.zoom(sourceID:in:))` on the destination), which keeps the stack, the bar and the interactive back gesture; the run did not consider it, and no genjutsu module mentions it (see "Notes").
- **The screens were restyled to make the effect possible.** Nobody asked for a new list: the grouped `List`, its separators and chevrons were replaced by hand-drawn cards, and the detail lost its grouped sections and its "Current" row. The result is plainer than the starting detail: one white surface, its lower half empty (`media/detail.png`).
- **With large type the hand-off jumps.** At the accessibility-large text size the row wraps its turn and next-current lines over several short lines, the header sets them on one and two, and the travel starts from the row's frame with the header's line breaks: the text re-breaks on the first frame, and the two-line next-current line lands across the divider on its way (`media/large-type-today.png`, `media/large-type-mid.png`). The settled detail is fine (`media/large-type-detail.png`). One size was filmed, not the 200% the audit asks for.
- **A one-pixel pop after closing.** The collapsed surface stays over the row until the spring is logically finished, then is swapped for the real row: the time's glyphs change by about a pixel (a 56 pt face scaled down is not the 20 pt face) 1.1 to 1.2 s after the Close tap. Barely visible.

Suspected from the code, not demonstrated:

- **The list cannot be tapped for about a second after Close.** `TodayView.swift:94` disables hit testing on the whole list while `selected` is set, and `selected` is cleared in the completion of `withAnimation(..., completionCriteria: .removed)` (line 151), which the recording places 1.1 to 1.2 s after the tap. A second row tapped inside that second would do nothing. The driver waits for the app to be idle before each tap, so the takes cannot show it.
- A tap on Close while the card is still opening, and a second row tapped while the first collapses: the code has guards for both, neither was filmed.
- **The release of the drag decides on the same broken number.** `TideDetailView.swift:184` compares the local-space translation with 120 pt, the value that alternates during the drag, so whether a release between about 120 and 240 pt closes or springs back may depend on which of the two positions the last frame was in. Only the 300 pt drag was filmed.
- **Under Reduce Motion, a row reopened within 0.2 s of Close may lose its header drag.** `close()` clears `selected` at once and resets `isExpanded` in the completion of the 0.2 s fade (`TodayView.swift:141` to `:147`); a row tapped inside that window sets `isExpanded = true`, then the pending completion sets it back to `false`, and `collapseDrag` ignores every drag while it is false. The detail still shows and the close button still works.
- **The row's frames are read once, at the tap** (`TodayView.swift:117`). If the text size changes while the detail is open, the card collapses onto where the row was, not where it is.
- **The growing clip is not free.** The run's audit is right that no layout property is animated, but the spring redraws a clip path every frame over a full-screen layer that holds a `ScrollView` and the stroked curve. Whether that hitches on a phone is the unmeasured item below.

Read in the code, not a defect: every API the run used exists at the iOS 26.0 deployment target and none is deprecated (`visualEffect` and `withAnimation(_:completionCriteria:_:completion:)` are iOS 17, `onGeometryChange` and `scrollBounceBehavior` older). The close button is drawn by hand (an `xmark` on `tertiarySystemFill`) instead of using a system close button, so it does not take the iOS 26 look of the rest of the system.

Not the run's: the starting app sets the large time at a fixed 56 pt, which does not grow with Dynamic Type, and its rows wrap badly at large sizes. The run kept both.

### Not verified here

A simulator on a Mac shows what the code draws, not how a phone feels.

- No real device. Frame pacing, hitches and 120 Hz were not measured: Instruments > Animation Hitches was not run, and a simulator recording cannot stand in for it.
- VoiceOver: the focus move to the header on open and back to the row on close, the modal trait, the escape gesture.
- Full Keyboard Access and the Esc shortcut on the close button.
- The flick that closes (predicted end past 240 pt), and a drag released before 120 pt.
- Opening a row after the list has scrolled (the screen fits on an iPhone 17, so the takes never scroll).
- Dynamic Type beyond the one size filmed, right-to-left, Increase Contrast, landscape (the app is portrait only) and iPad (iPhone only).
- Haptics: the code has none and the report claims none.
- Dark appearance was filmed once (`media/dark-mid.png`, `media/dark-detail.png`) and looks right; its contrast was not computed, as the audit says.

### Media

Filmed on the iPhone 17 simulator, iOS 26.5, 1206x2622 px (402x874 pt at 3x), with `xcrun simctl io <udid> recordVideo --codec=h264` while a UI test performed the taps. The status bar is overridden (`xcrun simctl status_bar <udid> override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3`).

**The taps.** `simctl` cannot tap. The driver is `takes/driver`: a UI test bundle in an Xcode project of its own, with no target application, that launches the installed app by bundle identifier (`com.example.etale`) and taps it through XCUITest. **It is not part of the app build**: the app's project and code are not touched, and the same driver filmed the starting app. XCUITest draws no pointer, so the clips show no finger. `takes/driver/take.sh` starts the recording, runs one test and stops the recording.

**The encode.** This machine has no ffmpeg, and ImageMagick cannot decode H.264 without it. `takes/frames.swift` dumps the frames with AVFoundation, and `takes/encode-clip.py` encodes them with `magick` the way `bin/record.mjs` does. `takes/make-media.sh` holds every cut and every command; the recordings themselves (14 to 20 MB each) are not committed. Time is real, not virtual: these are screen recordings.

| File | Output | What it shows |
|---|---|---|
| `media/clip.webp` | 402x874, 10 s, 24 fps, q66, 658 KB | The run's build. Tap the 10:31 row at about 0.6 s: its card grows to the screen, the three lines travel, the curve and the switch fade in. Close at about 3.2 s: the content leaves, the card shrinks back into its row. The same on the 16:17 row at about 5.7 s and 8.4 s. No pointer is drawn. The time-over-turn overlap is visible at each start and end. |
| `media/today.png` | 603x1311 | The Today screen at rest, as the run rewrote it. |
| `media/open-early.png` | 603x1311 | About 70 ms after the tap: the card has left the row; "10:31" overlaps "Ebb turns to flood". |
| `media/open-mid.png` | 603x1311 | About 170 ms after the tap: the card near full size, the lines over the half-faded label and divider, the curve at partial opacity. |
| `media/detail.png` | 603x1311 | The detail, settled. |
| `media/close-mid.png` | 603x1311 | About 320 ms after Close: the card almost back on its row, content gone, the time over the turn line. |
| `media/alert.webp` | 402x874, 5 s, 24 fps, q66, 208 KB | The switch "Alert me 15 minutes before" turned on in the detail, then Close: the bell is on the 10:31 row when the card lands. |
| `media/alert-row.png` | 603x1311 | The row with its bell after that. |
| `media/defect-drag.webp` | 320x696, 1.5 s, 60 fps, q62, 542 KB | The defect: the header dragged down 300 pt in one second. The surface alternates between two positions on successive frames. A browser that drops frames shows less of it than the stills. |
| `media/defect-drag-a.png`, `media/defect-drag-b.png` | 603x1311 | Two consecutive frames of that drag, 17 ms apart: the surface about 35 pt down, then about 74 pt down with the list's title showing above it. |
| `media/reduced.webp` | 402x874, 4.2 s, 24 fps, q66, 189 KB | Reduce Motion on (`xcrun simctl spawn <udid> defaults write com.apple.Accessibility ReduceMotionEnabled -bool YES`, app relaunched): the detail cross-fades over the list in about 0.2 s, nothing grows or travels; the same back. |
| `media/reduced-mid.png` | 603x1311 | The middle of that cross-fade: list and detail superimposed. |
| `media/dark-mid.png`, `media/dark-detail.png` | 603x1311 | Dark appearance, mid-opening and settled. |
| `media/large-type-today.png`, `media/large-type-mid.png`, `media/large-type-detail.png` | 603x1311 | Text size accessibility-large (`xcrun simctl ui <udid> content_size accessibility-large`): the list, mid-opening (the defect above), and the settled detail. |
| `media/preview.png` | 1280x900 | `preview/thesis.html`, first screen, shot with `bin/record.mjs` (`takes/preview-thesis.json`). |
| `media/preview-variants.png` | 1280x900 | `preview/variants.html`, first screen (`takes/preview-variants.json`). |
| `before/push.webp` | 402x874, 12.4 s, 24 fps, q66, 704 KB | The starting app, same driver test: the system push to the detail and back, twice. |
| `before/today.png`, `before/push-mid.png`, `before/detail.png` | 603x1311 | The starting app: the list, mid-push, the detail. |

**Caption for the clip:** The starting app pushed its tide detail like any navigation stack. The run replaced the push: the tapped row's card grows into the detail and shrinks back, on one spring with no bounce. iPhone 17 simulator, built unchanged. The run rewrote both screens to do it, and its drag-to-close flickers (see the receipt).

### Notes

- **The harness.** `bin/run.sh` was run from a copy with two values changed: the cost ceiling (15 USD instead of 30) and the directory of the plugin copy (`/private/tmp/genjutsu-eval-ex-ios`, so as not to collide with another run on the same machine). `bin/run.sh /path/to/genjutsu etale-ios 1 .` is the same run. The fixture needs no template and no npm: it copies `cases/etale-ios/app`.
- **Grader score 1.00, five of five.** `cast-fired`, `cast-loaded`, `list-opens-detail`, `swiftui-motion-loaded` (one shell call loading the module) and `tells-never-requested` (none).
- **The starting app** was built and launched before the run (Xcode 27.2, iPhone 17 simulator on iOS 26.5): `before/`. Its project is generated by XcodeGen from `cases/etale-ios/project.yml` and committed.
- **What genjutsu did not give the run.** `skills/_jutsu/swiftui-motion/SKILL.md:28` answers "Shared element transitions" with `matchedGeometryEffect` only, and neither that module, `swiftui-graphics` nor `mobile-principles` names `navigationTransition(.zoom)` and `matchedTransitionSource`, the iOS 18 API for a list item that opens into its detail while keeping the navigation stack and its back gesture. `swiftui-motion/SKILL.md:267` teaches `DragGesture().onChanged { value in offset = value.translation }` without saying that a gesture attached to the view it moves must read its translation in `.global` or a named space (`references/gestures-swiftui.md:53` presents `coordinateSpace:` as "useful for cross-view drags"); that is the drag defect. And `mobile-principles/SKILL.md:194` says of the edge-swipe back "Never override", which the run loaded, set aside in one sentence, and did not count in its audit.
- **Where the numbers come from.** Cost, turns, score, model and Claude Code version are in `runs/20261113T184049Z/aggregate-result.json`. The tokens, the 898 s and the subagent count are in the run's trace (`trace.jsonl` in the harness's kept temp directory), which is not committed, like every other example's.
- **Checked a second time.** A separate pass replayed the trace's `Write` calls: the three Swift files published here are byte for byte what the run wrote, with timestamps inside the run's 15 minutes. It rebuilt a fresh copy of `workspace-1` with new derived data (Xcode 27.2, iPhone 17 simulator, iOS 26.5): `** BUILD SUCCEEDED **`, no compiler error or warning. That pass read frames of the committed clips, not the recordings: the growth, the travel, the overlaps, the drag flicker and the Reduce Motion cross-fade are in them; the 0.8 s and 0.9 s timings and the one-pixel pop were not measured again.
- The run wrote its thesis page before loading its modules, as the pipeline orders it (thesis, then load), so the thesis was fixed before `swiftui-motion` was read.
- The previews show a 9:12 status bar (the app's fixed clock) and bold system fonts that differ from the simulator's; they are throwaway mock-ups, not the build.

## What was fixed in genjutsu between the runs

Two commits on genjutsu's branch `fix/native-shared-element`, `fd4e1da` and `3e0d6d3`, on top of v4.1.4 (`d5c614a`). They are not released: the plugin still calls itself 4.1.4. Run 2 ran on a copy of that branch at `3e0d6d3`. Each gap named in run 1's notes, and the file that now answers it:

- **The system transition for "a row opens its detail".** `skills/_jutsu/swiftui-motion/SKILL.md:28` now answers "Row or card opens a pushed or presented screen" with `navigationTransition(.zoom(sourceID:in:))` and `matchedTransitionSource(id:in:)`, and keeps `matchedGeometryEffect` for a shared element inside one hierarchy. A new section at line 112, "Shared element transitions", gives the sample, its availability, and what a hand-built overlay costs (line 144: the edge-swipe back, the bar, the VoiceOver escape, state restoration).
- **A drag that moves its own view.** `skills/_jutsu/swiftui-motion/SKILL.md:310` says a gesture that sits inside the `.offset` it drives reads in `.global` or a named ancestor, and why; the examples there, in `skills/_jutsu/swiftui-motion/references/gestures-swiftui.md` (the rule is at line 55) and in `skills/_jutsu/mobile-principles/references/gestures-deep.md` now pass `coordinateSpace: .global`.
- **"Never override" became a default with its reason.** `skills/_jutsu/mobile-principles/SKILL.md:194`: keep the edge-swipe back by default; replacing the navigation stack is a cost the thesis states, loss by loss; on iOS 18 and later the zoom transition keeps all of it.
- **The audit confronts the code with the modules.** `skills/cast/SKILL.md:674` (and the same lines in `skills/paint/SKILL.md` and `skills/bunshin/SKILL.md`): a new check, "Loaded modules against code". Every rule of a loaded module that the written code departs from is either licensed by a sentence of the validated thesis or a problem; an UNVALIDATED thesis licenses nothing.
- **Dated claims.** `skills/_jutsu/VERSIONS.md`, two rows dated 2026-11-13: the zoom navigation transition and the `DragGesture` coordinate space.

## Run 2: the fixed plugin, the system zoom transition

**It compiles, it runs, and the transition is the system's.** Its code is in `runs/20261113T201315Z/workspace-1`, its media in `media/run-2/`.

| | |
|---|---|
| Skill | `/genjutsu:cast` |
| genjutsu | 4.1.4 plus the two module-fix commits that shipped in 4.2.0, at `3e0d6d3` (branch `fix/native-shared-element`; the harness prints "4.1.4") |
| Model | claude-opus-5-5 (Claude Code 2.1.323, `claude plugin eval`, headless) |
| Date | 2026-11-13 |
| Cost | $1.53 (1.529563) |
| Turns | 22 |
| Duration | 330 s (5 min 30 s) in the run's trace; the harness prints 331 s for the whole case |
| Subagents | 0 |
| Stack | SwiftUI, iOS 26.0 deployment target, Swift 5 language mode with MainActor default isolation, no dependency |
| Build | `xcodebuild` for the iOS 26.5 simulator (Xcode 27.2, iOS 27.2 SDK) succeeded on the first try, no compiler error, no compiler warning |
| Human edits | 0 made |

### What it decided

**Interaction thesis (UNVALIDATED, nobody was here to approve it)**, quoted from the final report:

> Opening a slack from the Today list uses iOS 26's zoom navigation transition (`.matchedTransitionSource` on the row, `.navigationTransition(.zoom)` on the detail). The row grows into the tide detail as one surface and shrinks back into its own place on dismiss, including by dragging. Once the detail lands, the curve's slack marker settles in: the dashed rule draws top to bottom and the dot grows from 0.5 to 1. It runs on a critically damped `.spring(duration: 0.45, bounce: 0)` after a 0.35 s delay, because at slack the water stops and nothing in this app overshoots. With Reduce Motion on, the detail uses the system's automatic transition and the marker is already in place.

The thesis misdates the API: the zoom navigation transition is not new in iOS 26, it shipped in iOS 18. The code is right at this deployment target either way.

**Allowed patterns:** "the dashed marker rule and dot on the tide curve (already in the app, now drawn once on arrival)".

**Variant picked:** B, from three: the zoom starts from a surface coloured like the list cell, with 12 pt corners. A starts from the bare row. C also makes the "Next slack water" header open its slack, and was left out as outside the scope.

**Assumptions it made**, in its words "in place of questions":

- The users are people who swim or paddle at Aquatic Park, opening a slack time to check the tide.
- "It stays a navigation destination. The back button, edge swipe and title bar keep working, and dismissing is interactive."
- Variant B, because "A started from bare text and flashed the wrong colour on dismiss". The run could not run anything, so that sentence describes its HTML mock-up, not SwiftUI.

**Modules loaded** (its `load_skill` calls): motion-principles, mobile-principles, swiftui-motion. Not loaded: none. `tells` was never requested.

**The order matters.** The run wrote `preview/thesis.html`, zoom transition included, before its first `load_skill` call: in the trace, the first occurrence of the word "zoom" is the run's own thesis page, and nothing it had read until then (the app's sources, the `cast` skill) names that API. The fixed modules were read after, and agree with it.

### It showed before it wrote

- `preview/thesis.html` (`media/run-2/preview.png`): the thesis, the allowed patterns, a phone mock-up, the numbers in a table, a Reduce Motion toggle, and the status UNVALIDATED.
- `preview/variants.html` (`media/run-2/preview-variants.png`): the three variants side by side, B marked "Picked in this headless run".

Both are HTML approximations of a native screen, as in run 1.

### What changed

3 Swift files, 78 insertions, 0 deletions against the starting app. `Etale.xcodeproj`, `EtaleApp.swift`, `TideData.swift` and `tide.json` are untouched.

- `Etale/TideTransition.swift` (new, 55 lines): the motion constants, `slackTransitionSource` (the row as the zoom's source, with a cell-coloured background and 12 pt corners) and `slackZoomTransition`, a `ViewModifier` that applies `.navigationTransition(.zoom(sourceID:in:))` unless Reduce Motion is on.
- `Etale/TodayView.swift` (3 lines added): a `@Namespace`, the source on each `SlackRow`, the zoom on the destination. The `List`, the `NavigationStack`, the `NavigationLink` and `navigationDestination` are as they were.
- `Etale/TideDetailView.swift` (20 lines added, all inside `TideCurve`): the marker's dashed rule is trimmed in from the top and its dot scales from 0.5 and fades in, once, on appear; drawn at rest under Reduce Motion.

**It did not redesign anything.** At rest the two screens are the starting app's: `media/run-2/today.png` against `before/today.png` and `media/run-2/detail.png` against `before/detail.png` differ only by video-compression noise. Of 790,533 pixels, 66 (today) and 0 (detail) differ by more than 2% of the colour range (5 of 255), scattered one by one along text edges over the whole height; the largest difference is 25 of 255 and 5 of 255. Counting every pixel that differs at all gives 26,705 and 1,810: these are frames of an H.264 recording, not screenshots. The grouped list, its chevrons, the navigation bar, its title, the back button, the grouped sections and the "Current" row are all there.

### The build

```sh
cd etale-ios
cp -R runs/20261113T201315Z/workspace-1 build-20261113T201315Z-1
cd build-20261113T201315Z-1
xcodebuild -project Etale.xcodeproj -scheme Etale -configuration Debug \
  -destination "platform=iOS Simulator,id=<udid of an iPhone 17 on iOS 26.5>" \
  -derivedDataPath /private/tmp/etale-ios-run2-dd CODE_SIGNING_ALLOWED=NO build
```

`** BUILD SUCCEEDED **` on the first try, with new derived data, no error and no warning from the Swift compiler. The only warning in the log is the one the starting app prints too: `warning: Metadata extraction skipped, no AppIntents.framework dependency found`.

### Its own audit

**"11 checked, 2 problems", 3 handed over.** Both problems come from the new check.

The check "Loaded modules against code" printed this (quoted, shortened only where marked):

> - **Problem:** motion-principles says no UI interaction should take more than 500 ms. The marker starts at 0.35 s and settles after about 0.8 s (`TideTransition.swift:12,15,17`). The detail can be read and used at once, so nothing waits on the marker. But the unvalidated thesis is what asks for this [...], so it stays listed as a problem for you to accept or cut.
> - **Problem, untested:** the 0.35 s delay is a guess at how long the system zoom takes. The system sets that duration, not the app, so the marker may start a little before or after the zoom lands. Check it on a device.
> - **Note:** if Reduce Motion changes while a detail is open, the detail rebuilds and its marker draws again. This is minor.
> - mobile-principles: edge swipe kept, so no departure. swiftui-motion: the zoom sits on the detail's root view, so no departure.

**Was it true?** Checked against the modules, the code and the film:

- The 500 ms rule exists (`skills/_jutsu/motion-principles/SKILL.md:211`, "Never exceed 500ms on a UI interaction"), and 0.35 s of delay plus a 0.45 s spring is 0.8 s on paper. The run did what the new rule asks: its thesis is UNVALIDATED, so the thesis sentence licenses nothing and the departure is reported as a problem, with the sentence quoted. **True.** On film the marker is visibly finished sooner, about 0.55 s after the first frame of the zoom: the spring's tail is too small to see.
- The delay is a guess: **true, and the film shows by how much.** The zoom's picture stops moving about 0.45 s after its first frame; the rule starts to draw at 0.33 s, during the last 2 px of the zoom's settling, and the dot appears at 0.45 s (`media/run-2/marker-mid.png`). It reads as the marker arriving with the landing, not after it.
- "Edge swipe kept": **true**, filmed (`media/run-2/edge-swipe.webp`).
- "The zoom sits on the detail's root view": **true** (`TodayView.swift:61`, through the modifier at `TideTransition.swift:52`), and the zoom runs.
- The note about Reduce Motion changing mid-screen: plausible from the code (the modifier's two branches are two different views); not tried.

**What the check did not list.** Under Reduce Motion the run falls back to the system push, a full-screen sideways slide (`media/run-2/reduced.webp`). `skills/_jutsu/swiftui-motion/SKILL.md:403` says that under reduced motion "large translations [...] must be neutralized". The slide is the system's own and is what the starting app did, and the audit passed its Reduce Motion check on that basis; a strict reading of the module would have listed it as a departure. And no check could see the source-background defect below without running the app.

The rest of the audit: thesis against code with `file:line` for every sentence, exit animations, no layout property animated, focus, five states, tokens, semantics all pass; contrast "did not compute a ratio" for the system colour it added; `tells` not run. Handed over, UNVERIFIED: the build, Instruments > Animation Hitches, Reduce Motion with Dynamic Type at 200%.

### Does the motion match the thesis

Measured on the recordings at 60 frames a second (`takes/segments.py`, and `takes/track.py`, which follows the blue tide curve frame by frame).

- **The row grows into the detail as one surface and shrinks back: yes.** `media/run-2/open-early.png` (about 35 ms after the first frame) and `media/run-2/open-mid.png` (about 100 ms): the detail leaves from the row, the list dims behind it, the bar's title and back button are already there. `media/run-2/close-mid.png`: the detail shrinks onto the row and cross-fades into it.
- **Dismiss by dragging: yes, two ways, both interactive.** The edge swipe from the leading edge (`media/run-2/edge-swipe.webp`, `media/run-2/edge-swipe-mid.png`) and a drag down (`media/run-2/drag-down.webp`, `media/run-2/drag-down-mid.png`): the detail follows the finger, shrinks, and on release lands on its row.
- **Does any drag flicker: no.** Over the same 300 pt downward drag as run 1's defect take, the tide curve's top edge moves 1171 to 1874 px in 31 steps with 0 reversals over 78 frames at 60 fps; over the edge swipe its left edge moves 94 to 873 px with 0 reversals until the release, where it turns once towards the row. The motion comes in uneven steps with short plateaus (XCUITest's synthetic drag, or the simulator's pacing); it never goes back.
- **The marker settles after the landing: about at the landing**, see the audit above.
- **Nothing overshoots: yes.**
- **Reduce Motion: honoured as the thesis says.** The zoom is off, the detail arrives with the system push, the marker is in place from the first frame (`media/run-2/reduced.webp`, `media/run-2/reduced-mid.png`). The edge-swipe back still works with Reduce Motion on (filmed, not published).
- **Timing.** The picture changes for about 0.45 s after the opening tap (0.57 s with the marker) and 0.55 s on the way back, against 0.43 s and 0.63 s for the system push it replaces, and 0.8 s and 0.9 s for run 1.

Also filmed: the alert switch turned on in the detail, then back, the bell is on the row when the zoom lands (`media/run-2/alert.webp`, `media/run-2/alert-row.png`); dark appearance (`media/run-2/dark-mid.png`, `media/run-2/dark-detail.png`), which looks right; text size accessibility-large (`media/run-2/large-type-today.png`, `media/run-2/large-type-mid.png`, `media/run-2/large-type-detail.png`): the zoom runs, the row's wrapped text cross-fades into the detail for a frame or two, nothing breaks.

### Defects the run introduced

- **A white box shows around the row after the detail lands back.** The run gave the zoom's source a background of its own (`TideTransition.swift:29` to `:33`: `secondarySystemGroupedBackground`, 12 pt corners), so that the zoom starts from "a surface coloured like the list cell". When the detail lands back the cell is still highlighted grey and that highlight fades over about 0.4 s: for that time the source's white rounded rectangle sits inside the grey cell, narrower than it (it stops before the chevron), then the two colours meet and it disappears (`media/run-2/defect-source-box.png`; it shows at the end of every return in `media/run-2/clip.webp`). Measured on the recording at 60 fps: the cell outside the box is at its darkest (184 of 255) while the detail is still shrinking over it; when the zoom has landed, about 0.5 s after Back, it is already at 251 against the box's 255, stays there, and snaps to white 0.92 s after Back. So the box is on screen for about 0.4 s at a faint contrast: easy to see in a still, slight at full speed. In dark appearance the two colours are closer and it is barely visible. This is the one visible thing run 2 added that a reviewer would ask to remove; dropping the configuration closure of `matchedTransitionSource` is the likely change, not tried here.
- **The marker's delay is a constant guessed against a duration the system owns.** It happens to fall right on this simulator (above). If the system zoom is slower on a device or changes in a later iOS, the marker will draw during the zoom. The run's audit says so itself.
- **The marker may draw a second time if Reduce Motion changes while the detail is open** (the run's own note): the modifier's two branches are two different views, so the detail is rebuilt and its `onAppear` runs again. Read in the code (`TideTransition.swift:49`, `TideDetailView.swift:116`), not tried.
- **Under Reduce Motion the transition is the system push**, a full-screen slide, not a cross-fade (see the audit). That is the starting app's behaviour, kept; run 1 had a real 0.2 s cross-fade there.

Suspected from the code, not demonstrated:

- **The marker's one-time flag lives in a `List` row.** `markerSettled` is `@State` of `TideCurve` (`TideDetailView.swift:70`), which sits in a row of the detail's `List`, and the settle starts in that row's `onAppear` (line 116). A `List` builds its rows lazily. Where the detail scrolls (large text sizes, a smaller phone), a curve below the fold would start its 0.35 s delay only when it scrolls in, and if the list drops the row's state while it is off screen the marker would draw again on the way back. On the iPhone 17 at the default size the detail does not scroll, so no take can show it.

Not the run's: the starting app's row wraps its second line when the bell shows (`media/run-2/alert-row.png`), its rows wrap badly at large text sizes and its 56 pt time does not grow with Dynamic Type. The run changed none of it. While a zoom is dragged, the source row is hidden in the list and leaves a gap (`media/run-2/edge-swipe-mid.png`): that is how the system transition works.

What run 1 did that run 2 no longer does: no flickering drag, no text overlapping in flight, no lost edge swipe or bar, no restyled screens, no hand-off jump at large type, no second of dead list after closing (the list is a plain `List`, nothing disables it).

What run 2 does less of than run 1, to be fair to run 1: there is no bespoke choreography. Run 1's three lines travelled to their places in the header on a spring the thesis owned; in run 2 the system cross-fades the row into the detail and owns the curve. The only motion that is Étale's own is a 10 pt dot and a dashed rule. For "one surface, not a push" that is the right trade on iOS; as a show of what the plugin can author, it is modest.

### Not verified here

- No real device and no iOS 18 runtime: frame pacing, hitches, 120 Hz. Instruments > Animation Hitches was not run.
- VoiceOver, Full Keyboard Access. Nothing custom was added, so the system's behaviour is expected, and not checked.
- An edge swipe or a drag released early (the detail should spring back), and a tap during the zoom.
- Opening a row after the list has scrolled; the 16:17 row at the accessibility-large size (it is below the fold there and the driver cannot reach it, so only the 10:31 row was filmed at that size).
- Dynamic Type beyond the one size filmed, right-to-left, Increase Contrast, iPad.
- What the system zoom itself does under Reduce Motion: the run switches it off, so it was never seen.
- Dark appearance contrast (filmed once, not computed).

### Media

Same device, recorder, status bar, driver and encode as run 1 (see run 1's "Media"). The cuts and commands are in `takes/make-media-run-2.sh`; the recordings are not committed.

**What changed in the driver, and why.** `takes/driver/EtaleDriver/EtaleDriver.swift` drove run 2's build with the same tests, with two changes:

- `testEdgeSwipeBack` is new: a 300 pt drag from the leading edge. Run 1's overlay had no such gesture to film.
- `testAlert` now taps the switch at its trailing end instead of its centre. In the starting app and in run 2 the toggle is a `List` row, one switch element as wide as the row, and a tap at its centre lands on the label and changes nothing (the first take of run 2 showed exactly that: no switch, no bell). Run 1's hand-built detail took a centre tap. This is the driver's adaptation to the screen, not an edit to the app.

`testDragClose` is unchanged: the same downward drag that showed run 1's flicker.

| File | Output | What it shows |
|---|---|---|
| `media/run-2/clip.webp` | 402x874, 12.3 s, 24 fps, q62, 693 KB | Run 2's build. Tap the 10:31 row at about 0.6 s: the detail zooms out of the row, the marker settles on the curve. Back button at about 4.1 s: the detail shrinks into its row. The same on the 16:17 row at about 7.4 s and 10.9 s. No pointer is drawn. The white box is visible on the row at the end of each return. |
| `media/run-2/today.png` | 603x1311 | The Today screen at rest: the starting app's, unchanged. |
| `media/run-2/open-early.png` | 603x1311 | About 35 ms after the first frame of the zoom. |
| `media/run-2/open-mid.png` | 603x1311 | About 100 ms: the detail near full size, the list dimmed behind. |
| `media/run-2/marker-mid.png` | 603x1311 | About 370 ms: the zoom all but landed, the dashed rule drawn, the dot not yet. |
| `media/run-2/detail.png` | 603x1311 | The detail, settled: navigation bar, title, back button, grouped sections. |
| `media/run-2/close-mid.png` | 603x1311 | About 170 ms after Back: the detail shrinking onto its row. |
| `media/run-2/defect-source-box.png` | 603x1311 | About 0.6 s after Back: the white source rectangle inside the still-grey 10:31 cell. |
| `media/run-2/edge-swipe.webp` | 402x874, 2.4 s, 24 fps, q62, 424 KB | The edge-swipe back: a 300 pt drag from the leading edge over one second, then release. |
| `media/run-2/edge-swipe-mid.png` | 603x1311 | Mid-swipe: the detail under the finger, smaller, the list behind with a gap where the row is. |
| `media/run-2/drag-down.webp` | 402x874, 2.4 s, 24 fps, q62, 384 KB | The same downward drag as run 1's `media/defect-drag.webp`: the detail follows and shrinks, no alternation. |
| `media/run-2/drag-down-mid.png` | 603x1311 | Mid-drag. |
| `media/run-2/alert.webp` | 402x874, 5 s, 24 fps, q66, 212 KB | The switch "Alert me 15 minutes before" turned on, then Back: the bell is on the 10:31 row. |
| `media/run-2/alert-row.png` | 603x1311 | The row with its bell after that. |
| `media/run-2/reduced.webp` | 402x874, 4.5 s, 24 fps, q66, 375 KB | Reduce Motion on: the system push and pop, no zoom, the marker in place from the first frame. |
| `media/run-2/reduced-mid.png` | 603x1311 | The middle of that push. |
| `media/run-2/dark-mid.png`, `media/run-2/dark-detail.png` | 603x1311 | Dark appearance, mid-zoom and settled. |
| `media/run-2/large-type-today.png`, `media/run-2/large-type-mid.png`, `media/run-2/large-type-detail.png` | 603x1311 | Text size accessibility-large: the list, mid-zoom, the settled detail. |
| `media/run-2/preview.png` | 1280x900 | `preview/thesis.html`, first screen (`takes/preview-thesis-run-2.json`). |
| `media/run-2/preview-variants.png` | 1280x900 | `preview/variants.html`, first screen (`takes/preview-variants-run-2.json`). |

**Caption for the clip:** The same case on the fixed plugin. The run used the system zoom transition: the tapped row opens into its tide detail and shrinks back, the navigation bar and the swipe back stay, and the slack marker settles on the curve. iPhone 17 simulator, built unchanged. A white box shows on the row for a moment after each return (see the receipt).

### Notes

- **The harness.** The same copy of `bin/run.sh` as run 1 (cost ceiling 15 USD, plugin copied to `/private/tmp/genjutsu-eval-ex-ios`), pointed at the genjutsu worktree on `fix/native-shared-element`, clean at `3e0d6d3`. One run was made and it is this one.
- **Grader score 1.00, five of five**, the same five graders as run 1. Run 1 scored 1.00 too, with its flickering drag: these graders check that the skill fired, loaded its module and touched the list, not whether the motion is good.
- **Where the numbers come from.** Cost, turns, score, model and Claude Code version are in `runs/20261113T201315Z/aggregate-result.json`. The tokens, the 330 s and the subagent count are in the run's trace, which is not committed.
- **Hygiene.** In `run.log` and `report.html` the path into this repository was made relative and each U+2014 dash became "-", as the README says. The run's final report sets three of its headings with that dash; they are quoted here without it.
- **Checked a second time.** A separate pass replayed the trace's three `Write` calls and six `Edit` calls on the starting app: the three Swift files and the two previews published here are byte for byte what the run wrote. It rebuilt a fresh copy of `workspace-1` with new derived data (Xcode 27.2, iPhone 17 simulator, iOS 26.5): `** BUILD SUCCEEDED **`, no compiler error or warning. It dumped the recordings of the two drags again at 60 fps and followed the curve with its own script: the downward drag goes 1171 to 1874 px without ever going back, the edge swipe 94 to 873 px and turns once at the release; in the committed clips, the same tracker counts 0 reversals in `media/run-2/drag-down.webp` and 56 in run 1's `media/defect-drag.webp`. It searched the trace: nothing before the thesis page names the zoom API, the edge swipe or a shared element, and the plugin copy the harness ran is identical to `3e0d6d3`. It checked the cost, turns, duration, tokens and subagent count against the trace, the audit quotes against the run's final report, and the `file:line` citations against genjutsu at `3e0d6d3`. It corrected the pixel counts of the screens at rest, which had been read from an ImageMagick figure that is not a pixel count, and added the measurement of the white box, the misdated API and the `List` row item above. Not done again: no new recording was filmed, and the opening and closing timings were not measured a second time beyond the opening of the 10:31 row (zoom about 0.45 s, dot at 0.45 s: the same).
