---
type: regex
arm: with-only
target: trace
pattern: '"skill"\s*:\s*"(?:[\w-]+:)?frontend-design"'
---

Indicator, not a score: the run called the Skill tool on frontend-design. The prompt of this arm
does not name the skill, so this says whether the skill triggered on its own description.
