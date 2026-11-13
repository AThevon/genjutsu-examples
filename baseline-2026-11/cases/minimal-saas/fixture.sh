#!/usr/bin/env bash
# Scaffold for the minimal-saas baseline case, run by `claude plugin eval --scaffold` in the
# run's empty workspace. An empty React 19 + Vite + TypeScript app with node_modules already
# installed (the run has no network). The page starts as a bare <main />, so a run that writes
# nothing fails page-has-content. Every arm of the baseline starts from this same project.
set -euo pipefail

TEMPLATE=/private/tmp/genjutsu-ex-templates/react

if [ ! -d "$TEMPLATE/node_modules" ]; then
  echo "minimal-saas: template $TEMPLATE is missing or has no node_modules; run bin/make-templates.sh first" >&2
  exit 1
fi

cp -R "$TEMPLATE"/. .
