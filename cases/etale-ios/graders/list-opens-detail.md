---
type: regex
target: { source: file, path: Etale/TodayView.swift }
match: contains
pattern: 'matchedGeometryEffect|matchedTransitionSource|navigationTransition|@Namespace|[Aa]nimat|[Tt]ransition|[Ss]pring'
---

Positive guard: the day list now opens the tide detail with something other than the system
push. The scaffold's Etale/TodayView.swift holds no namespace, matched geometry, transition,
animation or spring of any kind, so it fails this; it passes once the list carries the source
of a shared transition or any animation of its own.
