# etale-ios - cast, SwiftUI

**First pass.** One recorded run, built unchanged on the first try, 0 human edits. The first native example: every other one here is a web page.

**What is the run's work here:** the way a slack row opens into its tide detail, and everything it rewrote to get there. The starting app (`cases/etale-ios/app`: the Today screen, its copy, the NOAA data, the tide curve, the alert switch) was written by hand for this case and held no animation: a row pushed the detail with the system transition of `NavigationStack` (`before/push.webp`). The run replaced that push with a card that grows out of the row, and to do it rewrote the list and the detail screen, so the two screens also look different at rest (see "What changed").

**It compiles and it runs. It is not ready to ship:** the drag that closes the detail flickers on every frame, the lines that travel run over each other mid-flight, and the run gave up the system's edge-swipe back to get its effect. All of it is listed under "Defects".

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

## The prompt

```
/genjutsu:cast Étale's iOS day list should open into the tide detail as one surface, not a push

Étale is a fictional slack-water app, made up for this example. Its numbers are real NOAA predictions for 2 October 2026.

Nobody is available to answer questions during this session. Up-front answers to the gates:
- Preview mode: A. Write each preview as a standalone HTML file under preview/ in the project.
- Scope: the Today list and the tide detail it opens. You may edit and add Swift files under Etale/ and write previews under preview/; create nothing outside the project. Etale/ is a folder the Xcode project keeps in sync with the disk: a Swift file added there is compiled, so do not edit Etale.xcodeproj.
- The app targets iOS 26 and is built with Xcode 27. Xcode cannot run in this session: do not try to build. There is no network: install nothing.

Finish with the final report the pipeline asks for.
```

Nobody answered the gates. The skill's "When nobody is answering" rule applied, and the run marked its own thesis **UNVALIDATED**. The run could not build: it wrote 487 lines of Swift without a compiler and said so in the first sentence of its report.

## What it decided

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

## It showed before it wrote

- `preview/thesis.html` (`media/preview.png`): the thesis, the allowed patterns, a phone mock-up that performs the opening, the spring plotted with its formula, the numbers, a Reduce Motion toggle. It says on the page that it approximates timing and curve only, not SwiftUI's rendering.
- `preview/variants.html` (`media/preview-variants.png`): the three variants side by side with one trigger for all three.

Both are HTML approximations of a native screen. Nothing in them was compiled, and the build below is what shows whether the thesis holds in SwiftUI.

## What changed

3 Swift files, 487 insertions, 78 deletions against the starting app. `Etale.xcodeproj`, `EtaleApp.swift`, `TideData.swift` and `tide.json` are untouched.

- `Etale/SlackSurface.swift` (new, 126 lines): the motion constants, the store of each row's frames in the window, the clip shape that grows from the row to the screen (`RevealShape`, animated through `animatableData`), and `travels(from:progress:)`, a `visualEffect` that moves a detail line from where it sat in the row.
- `Etale/TodayView.swift` (rewritten): the `List` became a `ScrollView` of cards; each slack row is a `Button` on its own card that reports the frames of its time, turn, next-current line and bell; the detail is mounted in a `ZStack` above the `NavigationStack`; `open`, `expand` and `close` drive the one spring and hand VoiceOver focus back to the row.
- `Etale/TideDetailView.swift` (rewritten): the detail as a full-screen layer clipped by `RevealShape`, its header with a close button, the content that fades, the row's bell, the header drag, and the Reduce Motion path. `TideCurve` is unchanged.

What a user sees at rest, compared with the starting app (`before/today.png` and `before/detail.png` against `media/today.png` and `media/detail.png`):

- Today: the three slack rows are three separate cards instead of one grouped list, without the disclosure chevrons, and the row's time is set in the rounded design so that it matches the detail's large time.
- Detail: no navigation bar, no "Slack 10:31" title and no back button; a close button top right; one white surface with dividers instead of grouped sections; the "Current" row is gone (its text is the third line of the header).

## The build

```sh
cd etale-ios
cp -R runs/20261113T184049Z/workspace-1 build-20261113T184049Z-1
cd build-20261113T184049Z-1
xcodebuild -project Etale.xcodeproj -scheme Etale -configuration Debug \
  -destination "platform=iOS Simulator,id=<udid of an iPhone 17 on iOS 26.5>" \
  -derivedDataPath /private/tmp/etale-ios-run-dd CODE_SIGNING_ALLOWED=NO build
```

`** BUILD SUCCEEDED **` on the first try, with no error and no warning from the Swift compiler (the only warning in the log is Xcode's "Metadata extraction skipped, no AppIntents.framework dependency found", which the starting app prints too). The run had named three places where it expected the compiler might refuse (`nonisolated struct`, the `onGeometryChange` closures, whether `visualEffect` interpolates under the spring): none did, and the lines do travel.

## Its own audit

**10 checks, 2 problems, 5 for you to run.**

- Problems it found: the rows have no disabled look while the detail is open (they are only made untappable, under the card); the layout spacing is literal numbers (the project has no spacing tokens).
- Listed but not counted: `secondaryLabel` on white computes to 3.4:1, under 4.5:1 for 15 pt text; it is the system colour and the starting app already used it.
- Reduced motion: honoured, with `file:line` (`TodayView.swift:18`, `:108`, `TideDetailView.swift:20`).
- Left unverified, for you to run: the build, Instruments > Animation Hitches, Reduce Motion and Dynamic Type at 200%, VoiceOver, Full Keyboard Access.

What the captures add to that: the build passes unchanged, the opening and the closing do what the thesis says, and the Reduce Motion path is a real cross-fade. They also show three things the audit could not see without running the app: the drag flickers, the travelling lines overlap, and large type breaks the hand-off between the row and the header. The audit did not count the loss of the edge-swipe back as a problem, although `mobile-principles`, which it loaded, says of that gesture "Never override".

## Does the motion match the thesis

Measured on the recordings at 60 frames a second (`takes/segments.py` on frames dumped by `takes/frames.swift`).

- **The card grows from the row to the screen: yes.** `media/open-early.png` (about 70 ms after the tap) and `media/open-mid.png` (about 170 ms): the clip starts on the row's card and reaches the screen edges, the corner radius goes from 16 pt to 0.
- **The three lines travel and the time scales to 56 pt: yes**, with the overlaps listed below.
- **No overshoot: yes.** No frame shows the card or a line past its final place.
- **The rest fades in after, and leaves first: yes.** The curve, the "Slack comes" line and the switch are at partial opacity in `media/open-mid.png` and gone before the card has shrunk in `media/close-mid.png`.
- **Dragging the header down collapses the card: it does collapse, but the drag itself is broken** (first defect).
- **Timing.** The picture changes for 0.8 s after the opening tap and 0.9 s after the closing tap: a spring declared at 0.45 s spends about as long again settling its last pixels. The system push it replaces changes the picture for about 0.43 s (opening) and 0.63 s (back), in `before/push.webp`.

## Defects the run introduced

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

## Not verified here

A simulator on a Mac shows what the code draws, not how a phone feels.

- No real device. Frame pacing, hitches and 120 Hz were not measured: Instruments > Animation Hitches was not run, and a simulator recording cannot stand in for it.
- VoiceOver: the focus move to the header on open and back to the row on close, the modal trait, the escape gesture.
- Full Keyboard Access and the Esc shortcut on the close button.
- The flick that closes (predicted end past 240 pt), and a drag released before 120 pt.
- Opening a row after the list has scrolled (the screen fits on an iPhone 17, so the takes never scroll).
- Dynamic Type beyond the one size filmed, right-to-left, Increase Contrast, landscape (the app is portrait only) and iPad (iPhone only).
- Haptics: the code has none and the report claims none.
- Dark appearance was filmed once (`media/dark-mid.png`, `media/dark-detail.png`) and looks right; its contrast was not computed, as the audit says.

## Media

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

## Notes

- **The harness.** `bin/run.sh` was run from a copy with two values changed: the cost ceiling (15 USD instead of 30) and the directory of the plugin copy (`/private/tmp/genjutsu-eval-ex-ios`, so as not to collide with another run on the same machine). `bin/run.sh /path/to/genjutsu etale-ios 1 .` is the same run. The fixture needs no template and no npm: it copies `cases/etale-ios/app`.
- **Grader score 1.00, five of five.** `cast-fired`, `cast-loaded`, `list-opens-detail`, `swiftui-motion-loaded` (one shell call loading the module) and `tells-never-requested` (none).
- **The starting app** was built and launched before the run (Xcode 27.2, iPhone 17 simulator on iOS 26.5): `before/`. Its project is generated by XcodeGen from `cases/etale-ios/project.yml` and committed.
- **What genjutsu did not give the run.** `skills/_jutsu/swiftui-motion/SKILL.md:28` answers "Shared element transitions" with `matchedGeometryEffect` only, and neither that module, `swiftui-graphics` nor `mobile-principles` names `navigationTransition(.zoom)` and `matchedTransitionSource`, the iOS 18 API for a list item that opens into its detail while keeping the navigation stack and its back gesture. `swiftui-motion/SKILL.md:267` teaches `DragGesture().onChanged { value in offset = value.translation }` without saying that a gesture attached to the view it moves must read its translation in `.global` or a named space (`references/gestures-swiftui.md:53` presents `coordinateSpace:` as "useful for cross-view drags"); that is the drag defect. And `mobile-principles/SKILL.md:194` says of the edge-swipe back "Never override", which the run loaded, set aside in one sentence, and did not count in its audit.
- **Where the numbers come from.** Cost, turns, score, model and Claude Code version are in `runs/20261113T184049Z/aggregate-result.json`. The tokens, the 898 s and the subagent count are in the run's trace (`trace.jsonl` in the harness's kept temp directory), which is not committed, like every other example's.
- **Checked a second time.** A separate pass replayed the trace's `Write` calls: the three Swift files published here are byte for byte what the run wrote, with timestamps inside the run's 15 minutes. It rebuilt a fresh copy of `workspace-1` with new derived data (Xcode 27.2, iPhone 17 simulator, iOS 26.5): `** BUILD SUCCEEDED **`, no compiler error or warning. That pass read frames of the committed clips, not the recordings: the growth, the travel, the overlaps, the drag flicker and the Reduce Motion cross-fade are in them; the 0.8 s and 0.9 s timings and the one-pixel pop were not measured again.
- The run wrote its thesis page before loading its modules, as the pipeline orders it (thesis, then load), so the thesis was fixed before `swiftui-motion` was read.
- The previews show a 9:12 status bar (the app's fixed clock) and bold system fonts that differ from the simulator's; they are throwaway mock-ups, not the build.
