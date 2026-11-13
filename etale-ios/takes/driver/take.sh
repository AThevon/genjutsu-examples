#!/usr/bin/env bash
# Film one driver test: take.sh <simulator udid> <test method> <out dir>
# Starts `xcrun simctl io <udid> recordVideo`, runs the one XCUITest of EtaleDriver that performs the taps on
# the installed app (com.example.etale), then stops the recording with SIGINT. Writes <out dir>/<test>.mp4 and
# <test>.log (the DRIVER lines: seconds since app launch at each tap). Build the driver once before:
#   xcodebuild -project EtaleDriver.xcodeproj -scheme EtaleDriver -destination "platform=iOS Simulator,id=<udid>" \
#     -derivedDataPath /private/tmp/etale-ios-driver-dd build-for-testing
set -euo pipefail
UDID="$1"; TEST="$2"; OUT="$3"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DD="${ETALE_DRIVER_DD:-/private/tmp/etale-ios-driver-dd}"
mkdir -p "$OUT"
rm -f "$OUT/$TEST.mp4"
xcrun simctl io "$UDID" recordVideo --codec=h264 --force "$OUT/$TEST.mp4" >"$OUT/$TEST.rec.log" 2>&1 &
REC=$!
sleep 2
set +e
xcodebuild -project "$HERE/EtaleDriver.xcodeproj" -scheme EtaleDriver \
  -destination "platform=iOS Simulator,id=$UDID" -derivedDataPath "$DD" \
  test-without-building -only-testing:"EtaleDriver/EtaleDriver/$TEST" >"$OUT/$TEST.xcodebuild.log" 2>&1
STATUS=$?
set -e
kill -INT "$REC"; wait "$REC" || true
grep -E "^DRIVER |error:|Test Case .*(passed|failed)" "$OUT/$TEST.xcodebuild.log" | tee "$OUT/$TEST.log"
exit "$STATUS"
