#!/usr/bin/env bash
# Scaffold for the etale-ios example, run by `claude plugin eval --scaffold` in the run's empty
# workspace. Étale on iOS, a fictional slack-water app for Aquatic Park: a SwiftUI app for iOS 26
# (Etale.xcodeproj, sources in Etale/), one real day of NOAA data in Etale/tide.json (the same
# file as the web examples). This is the "before" state: the Today list opens the tide detail of
# a slack water with the system push of NavigationStack, and no file holds an animation, a
# transition or a spring of any kind, so a run that leaves Etale/TodayView.swift untouched fails
# list-opens-detail.
#
# app/Etale.xcodeproj is generated from project.yml (XcodeGen) and committed, so nothing needs
# XcodeGen here. Etale/ is a folder the project keeps in sync with the disk: a Swift file added
# there is compiled without a project edit. The fixture builds for an iOS 26.5 simulator with
# Xcode 27.2: see etale-ios/receipt.md.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "$HERE/app/Etale.xcodeproj/project.pbxproj" ] || [ ! -f "$HERE/app/Etale/tide.json" ]; then
  echo "etale-ios: $HERE/app is missing the Xcode project or tide.json" >&2
  exit 1
fi

cp -R "$HERE/app"/. .
