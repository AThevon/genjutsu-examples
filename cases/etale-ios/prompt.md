---
description: Example run. /genjutsu:cast on the push between the day list and the tide detail of Étale for iOS, a fictional slack-water app (SwiftUI, iOS 26, no animation before the run).
tags: [example, apple, swiftui, cast]
runs: 1
max_turns: 150
timeout_seconds: 2400
allowed_tools: [Read, Glob, Grep, Skill]
---

/genjutsu:cast Étale's iOS day list should open into the tide detail as one surface, not a push

Étale is a fictional slack-water app, made up for this example. Its numbers are real NOAA predictions for 2 October 2026.

Nobody is available to answer questions during this session. Up-front answers to the gates:
- Preview mode: A. Write each preview as a standalone HTML file under preview/ in the project.
- Scope: the Today list and the tide detail it opens. You may edit and add Swift files under Etale/ and write previews under preview/; create nothing outside the project. Etale/ is a folder the Xcode project keeps in sync with the disk: a Swift file added there is compiled, so do not edit Etale.xcodeproj.
- The app targets iOS 26 and is built with Xcode 27. Xcode cannot run in this session: do not try to build. There is no network: install nothing.

Finish with the final report the pipeline asks for.
