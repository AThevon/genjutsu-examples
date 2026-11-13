---
type: tool_used
arm: with-only
tool: Bash
input_match: 'load_skill\s+swiftui-motion\b|/swiftui-motion/(SKILL|GUIDE)\.md'
min: 1
---

Indicator: the SwiftUI motion module was loaded. cast's load table calls for `swiftui-motion` on
every SwiftUI stack, and a module is loaded by a shell call that names it (`load_skill`, or a
read of its entry file). A run that animates the screen from memory, without the module, fails
this.
