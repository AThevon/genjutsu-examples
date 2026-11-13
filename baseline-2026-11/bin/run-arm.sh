#!/usr/bin/env bash
# Run one arm of the baseline for real: baseline-2026-11/bin/run-arm.sh <arm> <case> <n>
#
#   arm    none | frontend-design | genjutsu
#   case   minimal-saas (in baseline-2026-11/cases/) or invoice-mark-paid (in cases/)
#   n      the number of this run of that arm (1, 2, ...): names the output folder
#
# Every call is one billed `claude` session (claude-opus-5-5, capped at 8 USD). It follows
# bin/run.sh: the plugin under test is copied outside $HOME, the case is copied into that copy's
# examples/, and `claude plugin eval` runs from the copy with the same flags. What changes per arm
# is only the plugin under test and the first words of the prompt:
#
#   genjutsu          $GENJUTSU (a genjutsu checkout); the prompt as written, slash command first
#   frontend-design   $FRONTEND_DESIGN (Anthropic's frontend-design plugin); the prompt without
#                     its leading slash command
#   none              arms/none/plugin, a plugin that holds nothing but its manifest; the prompt
#                     without its leading slash command
#
# The case's graders that look for a genjutsu pipeline in the trace are dropped from the two
# other arms. Results land in baseline-2026-11/<case>-<arm>-<n>/runs/<UTC stamp>/, with the
# workspace copied out (without node_modules or dist) to workspace-1/.
set -euo pipefail

if [ $# -ne 3 ]; then
  echo "usage: run-arm.sh <none|frontend-design|genjutsu> <case> <n>" >&2
  exit 64
fi
ARM="$1"
ID="$2"
N="$3"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE="$(dirname "$HERE")"
REPO="$(dirname "$BASE")"
WORK=/private/tmp/gj-baseline/eval-$ARM-$ID-$N
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"

if [ -d "$BASE/cases/$ID" ]; then CASE="$BASE/cases/$ID"; else CASE="$REPO/cases/$ID"; fi
if [ ! -f "$CASE/prompt.md" ] || [ ! -f "$CASE/fixture.sh" ]; then
  echo "run-arm.sh: no case named '$ID'" >&2
  exit 64
fi

case "$ARM" in
  genjutsu) PLUGIN="${GENJUTSU:?set GENJUTSU to a genjutsu checkout}" ;;
  frontend-design) PLUGIN="${FRONTEND_DESIGN:?set FRONTEND_DESIGN to the frontend-design plugin directory}" ;;
  none) PLUGIN="$BASE/arms/none/plugin" ;;
  *) echo "run-arm.sh: unknown arm '$ARM'" >&2; exit 64 ;;
esac
if [ ! -f "$PLUGIN/.claude-plugin/plugin.json" ]; then
  echo "run-arm.sh: $PLUGIN has no .claude-plugin/plugin.json" >&2
  exit 64
fi

PREFLIGHT="$(mktemp -d /private/tmp/gj-baseline-preflight.XXXXXX)"
if ! (cd "$PREFLIGHT" && bash "$CASE/fixture.sh"); then
  rm -rf "$PREFLIGHT"
  echo "run-arm.sh: the $ID fixture fails; fix that first (nothing was billed)" >&2
  exit 1
fi
rm -rf "$PREFLIGHT"

OUT="$BASE/$ID-$ARM-$N/runs/$STAMP"
mkdir -p "$WORK"
rsync -a --delete \
  --exclude .git \
  --exclude .in_use \
  --exclude evals/results \
  --exclude /examples \
  --exclude dist \
  --exclude docs/superpowers \
  --exclude node_modules \
  "$PLUGIN"/ "$WORK"/
mkdir -p "$WORK/examples"
rsync -a --delete "$CASE"/ "$WORK/examples/$ID"/

if [ "$ARM" != genjutsu ]; then
  # The bare request: drop the slash command that opens the prompt, and nothing else.
  python3 - "$WORK/examples/$ID/prompt.md" <<'PY'
import re, sys
path = sys.argv[1]
text = open(path, encoding="utf-8").read()
new, count = re.subn(r"(?m)^/genjutsu:[a-z]+ ", "", text, count=1)
if count != 1:
    sys.exit("run-arm.sh: the prompt does not open with a /genjutsu: slash command")
open(path, "w", encoding="utf-8").write(new)
PY
  rm -f "$WORK/examples/$ID/graders"/*-fired.md "$WORK/examples/$ID/graders"/*-loaded.md
  if [ -d "$BASE/arms/$ARM/graders" ]; then cp "$BASE/arms/$ARM/graders"/*.md "$WORK/examples/$ID/graders"/; fi
fi

mkdir -p "$OUT"
cp "$WORK/examples/$ID/prompt.md" "$OUT/prompt.md"
cd "$WORK"

set +e
claude plugin eval . \
  --eval-dir examples \
  --case "$ID" \
  --runs 1 \
  --ablation none \
  --scaffold \
  --allow-tools Bash Write Edit \
  --keep-temp \
  --no-publish \
  --trust-plugin \
  --model claude-opus-5-5 \
  --max-cost-usd 8 \
  --output-dir "$OUT" 2>&1 | tee "$OUT/run.log"
STATUS="${PIPESTATUS[0]}"
set -e

echo
echo "== $ID / $ARM: claude plugin eval exited $STATUS"

# As in bin/run.sh: unseal the kept directory and copy the workspace out. Nothing is executed
# inside the kept directory.
SEAL="$(grep -a 'kept /.*chmod 700 ' "$OUT/run.log" | sort -u | head -1 || true)"
pair="$(printf '%s\n' "$SEAL" | sed -n 's/.*chmod 700 \([^ `]*\) \([^ `]*\)`.*/\1 \2/p' | tr -d "'\"")"
root="${pair%% *}"
sealed="${pair#* }"
if [ -n "$pair" ] && [ -d "$root" ]; then
  chmod 700 "$root" "$sealed"
  if [ -d "$sealed/home/cwd" ]; then
    rsync -a --exclude node_modules --exclude dist "$sealed/home/cwd/" "$OUT/workspace-1/"
    echo "workspace copied to $OUT/workspace-1/ (from $sealed/home/cwd)"
  fi
else
  echo "no seal line in $OUT/run.log; look for 'kept'" >&2
fi
exit "$STATUS"
