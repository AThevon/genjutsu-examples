---
type: tool_used
arm: both
tool: Bash
input_match: 'load_skill\s+tells\b|load_ref\s+tells\b|/tells/(SKILL|GUIDE)\.md|/tells/references/'
min: 0
max: 0
---

tells is a web module: on a SwiftUI stack no shell call may load or read it (the same guard as
the swiftui-skip eval of genjutsu).
