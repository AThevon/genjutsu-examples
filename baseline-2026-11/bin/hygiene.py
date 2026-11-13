#!/usr/bin/env python3
"""Normalise one run folder before it is committed: hygiene.py <run folder>

Follows the repository's rules for raw output (README, "Layout"):

- paths into this repository become relative to its root;
- each U+2014 dash in the CLI's own output (run.log, report.html, aggregate-result.json) becomes
  " - ".

One rule is added here, because the baseline keeps what every arm wrote and this repository
holds no literal U+2014: in a file a run wrote (the workspace, and the run's last message in
trace-facts.json), each U+2014 is written as the character reference &#8212;. HTML, JSX text,
JSX string attributes and Markdown all render that reference as the same dash, so the built page
does not change. The script refuses a workspace file where it cannot tell that this holds (any
file that is not .html, .md, .tsx or .jsx), and prints every replaced line so it can be read.
The counts are returned as JSON on the last line.
"""
import json
import pathlib
import sys

DASH = chr(0x2014)
REFERENCE = "&#8212;"


def main(folder):
    run = pathlib.Path(folder).resolve()
    repo = run.parent.parent
    counts = {"cli_output": 0, "written_by_run": {}}
    for path in sorted(run.rglob("*")):
        if not path.is_file() or path.suffix in (".png", ".webp", ".jpg", ".ico"):
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        rel = path.relative_to(run).as_posix()
        new = text.replace(str(repo) + "/", "")
        if DASH in new:
            in_workspace = "/workspace-1/" in "/" + rel
            if in_workspace:
                if path.suffix not in (".html", ".md", ".tsx", ".jsx"):
                    sys.exit(f"hygiene.py: U+2014 in {rel}, a file type where a character reference may not render")
                for number, line in enumerate(new.splitlines(), 1):
                    if DASH in line:
                        print(f"{rel}:{number}: {line.strip()[:160].replace(DASH, REFERENCE)}")
                counts["written_by_run"][rel.split("/workspace-1/", 1)[1]] = new.count(DASH)
                new = new.replace(DASH, REFERENCE)
            elif path.name == "trace-facts.json":
                new = new.replace(DASH, REFERENCE)
            else:
                counts["cli_output"] += new.count(DASH)
                new = new.replace(" " + DASH + " ", " - ").replace(DASH, " - ")
        if new != text:
            path.write_text(new, encoding="utf-8")
    print(json.dumps(counts))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: hygiene.py <run folder>")
    main(sys.argv[1])
