#!/usr/bin/env bash
# Build the live demos into one static folder: bin/build-demos.sh <out dir>
#
# Every demo is the code a run left, built as it stands: the source is copied to a scratch
# folder, `npm ci` installs its lockfile, and `npm run build -- --base /<id>/` builds it under
# its own path. Nothing in the source is edited. demos/index.html and demos/vercel.json are
# copied to the root. The result deploys as a static site (no build step on the host):
#   cd <out dir> && vercel deploy --prod --yes
# Needs Node 22 or later and network (npm ci).
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "usage: bin/build-demos.sh <out dir>" >&2
  exit 64
fi

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(dirname "$HERE")"
mkdir -p "$1"
OUT="$(cd "$1" && pwd)"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/genjutsu-demos.XXXXXX")"
trap 'rm -rf "$WORK"' EXIT

# <id> <source folder, relative to this repository>
DEMOS=(
  "nocturne nocturne/source"
  "etale etale/source"
  "pottery-firing pottery-firing/runs/20261004T162515Z/workspace-1"
  "invoice-mark-paid invoice-mark-paid/runs/20261004T162510Z/workspace-1"
  "gres-redesign gres-redesign/source"
)

for demo in "${DEMOS[@]}"; do
  id="${demo%% *}"
  src="$REPO/${demo#* }"
  echo "== $id <- ${demo#* }"
  rsync -a --exclude node_modules --exclude dist --exclude .cc-writes "$src"/ "$WORK/$id"/
  (cd "$WORK/$id" && npm ci --no-audit --no-fund && npm run build -- --base "/$id/")
  rm -rf "${OUT:?}/$id"
  cp -R "$WORK/$id/dist" "$OUT/$id"
done

cp "$REPO/demos/index.html" "$REPO/demos/vercel.json" "$OUT"/
echo "Demos built in $OUT"
