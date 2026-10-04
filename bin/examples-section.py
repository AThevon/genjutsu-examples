#!/usr/bin/env python3
"""Writes the Examples gallery of the genjutsu README from this repository's manifest.json.

Each example is a recorded run: the literal request, how it ran, the genjutsu
version and commit, the model, first pass or selected from N, the cost, and
links to its receipt, its source, its live demo and, for a conversation, its
transcript, the brief the agent playing the client was given and the first
message it sent. The gallery is generated so that adding an example is one
manifest entry plus its media and receipt, and so that none of those facts can
be dropped by hand.

The block sits between `<!-- genjutsu:examples:start -->` and
`<!-- genjutsu:examples:end -->` in the genjutsu README. That README lives in
another repository, so every image and link in the block is absolute and
pinned to one immutable ref of this repository (a tag, never a branch):
    images     https://raw.githubusercontent.com/<repo>/<ref>/readme-media/...
    files      https://github.com/<repo>/blob/<ref>/<path>
    folders    https://github.com/<repo>/tree/<ref>/<path>
Featured entries are shown in manifest order, each with its media; an entry
with `"featured": false` is a recorded run that is not shown, listed after the
gallery on one line with the reason and its receipt, so that a run left out is
still accounted for.

Usage:
    python3 bin/examples-section.py --ref readme-2026-10-05                  # print the block
    python3 bin/examples-section.py --ref <tag> --readme README.md --write   # replace the region
    python3 bin/examples-section.py --ref <tag> --readme README.md --check   # exit 1 if it differs
    [--manifest manifest.json]

Every path in the manifest is relative to the manifest's directory, the root of
this repository. It refuses, instead of publishing a broken or dishonest
block: an entry missing a required field, an unknown kind or mode, a media,
receipt, transcript, client brief, opening, source or case path that does not
exist, a conversation without its client brief and opening, a media file over
720 KB, a duplicate id, a multi-line prompt, a plugin_source that does not name
the plugin_commit, a manifest with nothing featured, a ref that is a branch
name (main, master, HEAD), and U+2014 (em dash) anywhere in the manifest.

The manifest:
    {
      "repo": "AThevon/genjutsu-examples",
      "demo_site": "https://<demos>.vercel.app",   # or null: relative demo paths are
                                                  # then left out of the block
      "examples": [ ... ]
    }

An entry recorded through genjutsu itself (mode headless or conversation):
    {
      "id": "pottery-firing",                 # [a-z0-9-], unique
      "title": "...",
      "skill": "cast" | "paint" | "bunshin",
      "modules": ["gsap", ...],               # the modules the run loaded
      "kind": "paint-new" | "paint-existing" | "cast" | "bunshin",
      "run": {
        "mode": "headless" | "conversation",
        "harness": "claude plugin eval, Claude Code 2.1.289",
        "plugin_version": "4.1.0",
        "plugin_commit": "09c177b",
        "plugin_source": "fix/skill-arguments on 09c177b (4.1.1 candidate)",  # optional:
                                              # a build that is not the release, said instead
                                              # of the version; must name the commit
        "model": "claude-opus-5-5",
        "date": "2026-10-04",
        "cost_usd": 1.53,                     # what genjutsu cost
        "client_cost_usd": 0.86,              # optional: the agent playing the client
        "exchanges": 8,                       # optional: messages of a conversation
        "turns": 23,
        "selected_from": 1,                   # 1 is a first pass
        "human_edits": 0
      },
      "prompt": "the literal first line of the request",
      "caption": "what the run did and did not do",
      "media": {
        "cover": {"src": "readme-media/<id>/still.png", "alt": "..."},
        "clip":  {"src": "readme-media/<id>/clip.webp", "alt": "..."},   # optional
        "stills": [{"src": "...", "alt": "..."}]                        # may be empty
      },
      "receipt": "<id>/receipt.md",
      "source": "<id>/source",                # the code the run left (a folder)
      "case": "cases/<id>",                   # headless only, optional: the eval case
      "demo": "/<id>/",                       # optional: a path on demo_site, or an https URL
      "transcript": "<id>/transcript.md",     # required for a conversation
      "client": "<id>/client.md",             # required for a conversation: the brief the
                                              # agent playing the client was given
      "opening": "<id>/opening.txt",          # required for a conversation: the first
                                              # message, sent word for word
      "notes": "what else a reader should know, said plainly"
    }

An entry for the run bunshin was extracted from, made before v4.1.0 shipped
(mode bunshin-origin): there was no /genjutsu:bunshin to type and no dollar
figure, so it carries a described request and the published token cost instead:
    {
      "id": "chef-ovatio", "title": "...", "skill": "bunshin", "kind": "bunshin",
      "run": {
        "mode": "bunshin-origin",
        "harness": "Claude Code 2.1.284, one main session ...",
        "plugin_version": "4.0.0", "plugin_commit": "a0f6e09",
        "ran_as": "`paint`, with Impeccable",
        "model": "claude-opus-5-5", "date": "2026-09-29",
        "subagent_tokens": "about 10.5M", "duration": "six to eight hours",
        "main_session": "not measured",
        "loop": "one review, three refine rounds, two verdicts",
        "human_answers": 2, "human_edits": 0
      },
      "request": "what was asked, described (the request itself is private)",
      "caption": "...", "media": {...}, "receipt": "chef-ovatio/receipt.md",
      "demo": "https://...",                  # required: the live site
      "source_note": "why the source is not here",   # instead of source
      "notes": "..."
    }

A recorded run that is not featured needs less: id, title, skill, kind, run
(mode, plugin_version, plugin_commit, date, and plugin_source if any), receipt,
an optional transcript, client and opening (both, for a conversation), optional
source, case and demo, and the reason it is not shown:
    {"id": "...", "featured": false, "reason": "one sentence", ...}

Stdlib only.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

START = "<!-- genjutsu:examples:start -->"
END = "<!-- genjutsu:examples:end -->"
ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "manifest.json"
DASH = "\u2014"
MAX_MEDIA_BYTES = 720 * 1000
IMG_WIDTH = 720
BRANCH_REFS = {"main", "master", "HEAD"}

SKILLS = {"cast", "paint", "bunshin"}
KINDS = {"paint-new", "paint-existing", "cast", "bunshin"}
MODES = {"headless", "conversation", "bunshin-origin"}
TOP_FIELDS = ("id", "title", "skill", "modules", "kind", "run", "prompt", "caption", "media", "receipt",
              "source", "notes")
ORIGIN_FIELDS = ("id", "title", "skill", "kind", "run", "request", "caption", "media", "receipt", "demo",
                 "source_note", "notes")
RUN_FIELDS = ("mode", "harness", "plugin_version", "plugin_commit", "model", "date",
              "cost_usd", "turns", "selected_from", "human_edits")
ORIGIN_RUN_FIELDS = ("mode", "harness", "plugin_version", "plugin_commit", "ran_as", "model", "date",
                     "subagent_tokens", "duration", "main_session", "loop", "human_answers", "human_edits")
UNFEATURED_FIELDS = ("id", "title", "skill", "kind", "run", "receipt", "reason")
UNFEATURED_RUN_FIELDS = ("mode", "plugin_version", "plugin_commit", "date")
RUN_STRINGS = ("harness", "plugin_version", "plugin_commit", "model", "date", "ran_as",
               "subagent_tokens", "duration", "main_session", "loop")
MODE_LABEL = {
    "headless": "one-shot headless run",
    "conversation": "conversation with an agent playing the client",
    "bunshin-origin": "bunshin run, before v4.1.0",
}


class Fail(Exception):
    pass


def find_dashes(node, where: str) -> list[str]:
    if isinstance(node, str):
        return [where] if DASH in node else []
    if isinstance(node, dict):
        return [w for k, v in node.items() for w in find_dashes(k, f"{where}.{k}") + find_dashes(v, f"{where}.{k}")]
    if isinstance(node, list):
        return [w for i, v in enumerate(node) for w in find_dashes(v, f"{where}[{i}]")]
    return []


def need_str(entry: dict, key: str, where: str) -> str:
    v = entry.get(key)
    if not isinstance(v, str) or not v.strip():
        raise Fail(f"{where}: missing or empty field '{key}'")
    return v


def need_int(entry: dict, key: str, where: str, minimum: int) -> int:
    v = entry.get(key)
    if isinstance(v, bool) or not isinstance(v, int) or v < minimum:
        raise Fail(f"{where}: '{key}' must be an integer of at least {minimum}, got {v!r}")
    return v


def check_path(root: Path, rel: str, where: str, media: bool = False, folder: bool = False) -> None:
    if rel.startswith(("/", "./")) or ".." in Path(rel).parts:
        raise Fail(f"{where}: '{rel}' must be relative to the repository root, without ./ or ..")
    p = root / rel
    if folder:
        if not p.is_dir():
            raise Fail(f"{where}: folder '{rel}' does not exist")
        return
    if not p.is_file():
        raise Fail(f"{where}: '{rel}' does not exist")
    if media and p.stat().st_size > MAX_MEDIA_BYTES:
        raise Fail(f"{where}: '{rel}' is {p.stat().st_size} bytes, over the {MAX_MEDIA_BYTES} limit")


def check_media_item(root: Path, item, where: str) -> None:
    if not isinstance(item, dict):
        raise Fail(f"{where}: must be an object with src and alt")
    check_path(root, need_str(item, "src", where), where, media=True)
    need_str(item, "alt", where)


def need_cost(run: dict, key: str, where: str) -> None:
    cost = run[key]
    if isinstance(cost, bool) or not isinstance(cost, (int, float)) or cost <= 0:
        raise Fail(f"{where}: {key} must be a positive number, got {cost!r}")


def validate_run(run, where: str, featured: bool) -> None:
    if not isinstance(run, dict):
        raise Fail(f"{where}: run must be an object")
    rwhere = f"{where}, run"
    if "mode" not in run:
        raise Fail(f"{rwhere}: missing field 'mode'")
    if run["mode"] not in MODES:
        raise Fail(f"{rwhere}: mode must be one of {sorted(MODES)}, got {run['mode']!r}")
    if not featured:
        fields = UNFEATURED_RUN_FIELDS
    else:
        fields = ORIGIN_RUN_FIELDS if run["mode"] == "bunshin-origin" else RUN_FIELDS
    for key in fields:
        if key not in run:
            raise Fail(f"{rwhere}: missing field '{key}'")
    for key in fields:
        if key in RUN_STRINGS:
            need_str(run, key, rwhere)
    if not re.fullmatch(r"\d+\.\d+\.\d+", run["plugin_version"]):
        raise Fail(f"{rwhere}: plugin_version must look like 4.1.0, got {run['plugin_version']!r}")
    if not re.fullmatch(r"[0-9a-f]{7,40}", run["plugin_commit"]):
        raise Fail(f"{rwhere}: plugin_commit must be a commit hash, got {run['plugin_commit']!r}")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", run["date"]):
        raise Fail(f"{rwhere}: date must be YYYY-MM-DD, got {run['date']!r}")
    if "plugin_source" in run:
        source = need_str(run, "plugin_source", rwhere)
        if run["plugin_commit"] not in source:
            raise Fail(f"{rwhere}: plugin_source must name the plugin_commit {run['plugin_commit']!r}")
    if "cost_usd" in fields:
        need_cost(run, "cost_usd", rwhere)
    if "client_cost_usd" in run:
        need_cost(run, "client_cost_usd", rwhere)
    if "exchanges" in run:
        need_int(run, "exchanges", rwhere, 1)
    if "turns" in fields:
        need_int(run, "turns", rwhere, 1)
        need_int(run, "selected_from", rwhere, 1)
    if "human_answers" in fields:
        need_int(run, "human_answers", rwhere, 0)
    if "human_edits" in fields:
        need_int(run, "human_edits", rwhere, 0)


def validate_transcript(root: Path, e: dict, where: str, required: bool) -> None:
    transcript = e.get("transcript")
    if required and not transcript:
        raise Fail(f"{where}: a conversation must link its transcript")
    if transcript is not None:
        if not isinstance(transcript, str) or not transcript.strip():
            raise Fail(f"{where}: transcript must be a path")
        check_path(root, transcript, f"{where}, transcript")


def validate_client(root: Path, e: dict, where: str) -> None:
    """A conversation shows what the agent playing the client was told: its brief
    and the first message it sent. Required for every conversation, featured or not."""
    if e["run"]["mode"] != "conversation":
        for key in ("client", "opening"):
            if key in e:
                raise Fail(f"{where}: '{key}' is only for a conversation")
        return
    for key in ("client", "opening"):
        check_path(root, need_str(e, key, where), f"{where}, {key}")


def validate_links(root: Path, e: dict, where: str) -> None:
    """source and case are folders of this repository; demo is a path on demo_site or an https URL."""
    if "source" in e:
        check_path(root, need_str(e, "source", where), f"{where}, source", folder=True)
    if "case" in e:
        if e["run"]["mode"] != "headless":
            raise Fail(f"{where}: 'case' is only for a headless run")
        check_path(root, need_str(e, "case", where), f"{where}, case", folder=True)
    if "demo" in e:
        demo = need_str(e, "demo", where)
        if not (demo.startswith("https://") or re.fullmatch(r"/[a-z0-9-]+/", demo)):
            raise Fail(f"{where}: demo must be an https URL or a path like /{e['id']}/, got {demo!r}")


def validate(entries, root: Path) -> None:
    if not isinstance(entries, list) or not entries:
        raise Fail("the manifest needs a non-empty 'examples' list")
    seen = set()
    for i, e in enumerate(entries):
        where = f"examples[{i}]"
        if not isinstance(e, dict):
            raise Fail(f"{where}: must be an object")
        featured = e.get("featured", True)
        if not isinstance(featured, bool):
            raise Fail(f"{where}: featured must be true or false, got {featured!r}")
        run = e.get("run")
        origin = isinstance(run, dict) and run.get("mode") == "bunshin-origin"
        for key in (UNFEATURED_FIELDS if not featured else ORIGIN_FIELDS if origin else TOP_FIELDS):
            if key not in e:
                raise Fail(f"{where}: missing field '{key}'")
        ex_id = need_str(e, "id", where)
        where = f"example '{ex_id}'"
        if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", ex_id):
            raise Fail(f"{where}: id must be lowercase letters, digits and hyphens")
        if ex_id in seen:
            raise Fail(f"{where}: duplicate id")
        seen.add(ex_id)
        for key in ("title", "receipt") + (("caption", "notes") if featured else ("reason",)):
            need_str(e, key, where)
        if e["skill"] not in SKILLS:
            raise Fail(f"{where}: skill must be one of {sorted(SKILLS)}, got {e['skill']!r}")
        if e["kind"] not in KINDS:
            raise Fail(f"{where}: kind must be one of {sorted(KINDS)}, got {e['kind']!r}")
        if not e["kind"].startswith(e["skill"]):
            raise Fail(f"{where}: kind {e['kind']!r} does not match skill {e['skill']!r}")
        validate_run(run, where, featured)
        if origin and e["skill"] != "bunshin":
            raise Fail(f"{where}: mode bunshin-origin is only for skill bunshin")
        check_path(root, e["receipt"], f"{where}, receipt")
        validate_transcript(root, e, where, required=featured and run["mode"] == "conversation")
        validate_client(root, e, where)
        validate_links(root, e, where)
        if not featured:
            if "\n" in e["reason"]:
                raise Fail(f"{where}: reason must be one line")
            continue

        if origin:
            need_str(e, "source_note", where)
            if not e["demo"].startswith("https://"):
                raise Fail(f"{where}: the demo of a bunshin-origin run is its live site, an https URL")
            if "\n" in need_str(e, "request", where):
                raise Fail(f"{where}: request must be one line")
        else:
            mods = e["modules"]
            if not isinstance(mods, list) or not all(isinstance(m, str) and m.strip() for m in mods):
                raise Fail(f"{where}: modules must be a list of module names")
            prompt = need_str(e, "prompt", where)
            if "\n" in prompt or "\r" in prompt:
                raise Fail(f"{where}: prompt must be the literal first line of the request, one line")

        media = e["media"]
        if not isinstance(media, dict) or "cover" not in media:
            raise Fail(f"{where}: media needs at least a cover")
        check_media_item(root, media["cover"], f"{where}, media.cover")
        if media.get("clip") is not None:
            check_media_item(root, media["clip"], f"{where}, media.clip")
        stills = media.get("stills", [])
        if not isinstance(stills, list):
            raise Fail(f"{where}: media.stills must be a list")
        for j, st in enumerate(stills):
            check_media_item(root, st, f"{where}, media.stills[{j}]")
    if not any(e.get("featured", True) for e in entries):
        raise Fail("the manifest needs at least one featured example")


class Links:
    """Absolute URLs into this repository, pinned to one ref, and the demo site."""

    def __init__(self, repo: str, ref: str, demo_site: str | None):
        self.repo, self.ref, self.demo_site = repo, ref, demo_site

    def _at(self, rel: str) -> str:
        return f"{quote(self.ref, safe='')}/{quote(rel, safe='/-._~')}"

    def raw(self, rel: str) -> str:
        return f"https://raw.githubusercontent.com/{self.repo}/{self._at(rel)}"

    def blob(self, rel: str) -> str:
        return f"https://github.com/{self.repo}/blob/{self._at(rel)}"

    def tree(self, rel: str) -> str:
        return f"https://github.com/{self.repo}/tree/{self._at(rel)}"

    def demo(self, e: dict) -> str | None:
        demo = e.get("demo")
        if not demo:
            return None
        if demo.startswith("https://"):
            return demo
        return f"{self.demo_site}{demo}" if self.demo_site else None


def load(manifest: Path) -> dict:
    if not manifest.is_file():
        raise Fail(f"manifest not found: {manifest}")
    try:
        data = json.loads(manifest.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise Fail(f"{manifest} is not valid JSON: {exc}") from exc
    dashes = find_dashes(data, "manifest")
    if dashes:
        raise Fail("U+2014 (em dash) in " + ", ".join(dashes) + ": use a hyphen or rephrase")
    if not isinstance(data, dict):
        raise Fail("the manifest must be an object with 'repo' and an 'examples' list")
    repo = data.get("repo")
    if not isinstance(repo, str) or not re.fullmatch(r"[A-Za-z0-9-]+/[A-Za-z0-9._-]+", repo):
        raise Fail(f"the manifest needs 'repo' as owner/name, got {repo!r}")
    demo_site = data.get("demo_site")
    if demo_site is not None and (not isinstance(demo_site, str)
                                  or not re.fullmatch(r"https://[^\s/]+", demo_site)):
        raise Fail(f"demo_site must be null or an https origin without a trailing slash, got {demo_site!r}")
    validate(data.get("examples"), manifest.resolve().parent)
    return data


def check_ref(ref: str) -> str:
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]*", ref or ""):
        raise Fail(f"--ref must be a tag name, got {ref!r}")
    if ref in BRANCH_REFS:
        raise Fail(f"--ref {ref!r} is a branch: pin the README to a tag, which does not move")
    return ref


def code_span(text: str) -> str:
    longest = max((len(m) for m in re.findall(r"`+", text)), default=0)
    fence = "`" * (longest + 1)
    pad = " " if longest or text.startswith("`") or text.endswith("`") else ""
    return f"{fence}{pad}{text}{pad}{fence}"


def plugin_label(run: dict) -> str:
    if run.get("plugin_source"):
        return f"genjutsu {run['plugin_source']}"
    label = f"genjutsu {run['plugin_version']} at `{run['plugin_commit']}`"
    if run.get("ran_as"):
        label += f" ({run['ran_as']})"
    return label


def plural(n: int, word: str) -> str:
    return f"{n} {word}" + ("" if n == 1 else "s")


def provenance(e: dict) -> str:
    run = e["run"]
    parts = [
        f"`{e['skill']}`",
        f"{MODE_LABEL[run['mode']]} ({run['harness']})",
        plugin_label(run),
        f"`{run['model']}`",
    ]
    if run["mode"] == "bunshin-origin":
        parts += [
            f"{run['subagent_tokens']} subagent tokens over {run['duration']} "
            f"(main session {run['main_session']})",
            run["loop"],
            plural(run["human_answers"], "human answer"),
        ]
    else:
        n = run["selected_from"]
        cost = f"${run['cost_usd']:.2f}"
        if run.get("client_cost_usd"):
            cost += f" (plus ${run['client_cost_usd']:.2f} for the agent playing the client)"
        parts += ["first pass" if n == 1 else f"selected from {n} runs", cost]
        if run.get("exchanges"):
            parts.append(plural(run["exchanges"], "exchange"))
        parts.append(plural(run["turns"], "turn"))
    parts += [plural(run["human_edits"], "human edit"), run["date"]]
    return " · ".join(parts)


def intro(entries: list[dict], links: Links) -> list[str]:
    modes = {e["run"]["mode"] for e in entries}
    real = "bunshin-origin" in modes
    lines = [
        ("Recorded runs on fictional clients and one real one" if real else "Recorded runs on fictional clients")
        + ", captured from the code each run left"
        + (" or, for the real client, from the live site" if real else "")
        + ". Each one gives the first line of the request, how it ran, what it cost, and a receipt with "
        "the full prompt, what the run checked, and what it left unverified or got wrong. "
        f"Everything they link lives in [genjutsu-examples](https://github.com/{links.repo}) "
        f"at the tag `{links.ref}`: the code each run wrote, its receipt, its conversation and its media."
    ]
    if links.demo_site:
        lines.append(f"Each one also runs as a [live demo]({links.demo_site}/), built from that code as it stands.")
    if "headless" in modes:
        lines.append(
            "A one-shot headless run is a single `claude plugin eval` session: the prompt answers the "
            "gates up front and nobody replies after that, so there is no conversation to publish."
        )
    if "conversation" in modes:
        lines.append(
            "A conversation is a session in which an agent plays the client and answers the gates; "
            "its full transcript, the brief that agent was given and the first message it sent "
            "are linked."
        )
    if real:
        lines.append(
            "The `bunshin` example is the run `bunshin` was extracted from, made before v4.1.0 shipped: "
            "its cost is in subagent tokens, as genjutsu publishes it, and its request and its client's "
            "material stay private."
        )
    if any(e["run"].get("plugin_source") for e in entries):
        lines.append(
            "A run on a build that is not a release names the branch and commit it ran on "
            "instead of a version."
        )
    return [" ".join(lines)]


def side_links(e: dict, links: Links) -> list[str]:
    out = []
    if e.get("client"):
        out += [f"[Client brief]({links.blob(e['client'])})", f"[First message]({links.blob(e['opening'])})"]
    if e.get("source"):
        out.append(f"[Source]({links.tree(e['source'])})")
    if e.get("case"):
        out.append(f"[Case]({links.tree(e['case'])})")
    demo = links.demo(e)
    if demo:
        out.append(f"[Live demo]({demo})")
    return out


def block_for(e: dict, links: Links) -> list[str]:
    media = e["media"]
    shown = media.get("clip") or media["cover"]
    receipt = links.blob(e["receipt"])
    img = (
        f'<a href="{html.escape(receipt)}"><img src="{html.escape(links.raw(shown["src"]))}" '
        f'alt="{html.escape(shown["alt"])}" width="{IMG_WIDTH}" /></a>'
    )
    out = [f"[Receipt]({receipt})"]
    if e.get("transcript"):
        out.append(f"[Transcript]({links.blob(e['transcript'])})")
    elif e["run"]["mode"] == "headless":
        out.append("No transcript: a one-shot run has no conversation, the full prompt is in the receipt")
    out += side_links(e, links)
    if e.get("source_note"):
        out.append(e["source_note"])
    request = code_span(e["prompt"]) if e.get("prompt") else f"<em>{html.escape(e['request'])}</em>"
    return [
        f"### {e['title']}",
        "",
        img,
        "",
        request,
        "",
        e["caption"],
        "",
        e["notes"],
        "",
        f"<sub>{provenance(e)}</sub>",
        "",
        " · ".join(out),
    ]


def unfeatured_line(e: dict, links: Links) -> str:
    run = e["run"]
    out = [f"[Receipt]({links.blob(e['receipt'])})"]
    if e.get("transcript"):
        out.append(f"[Transcript]({links.blob(e['transcript'])})")
    out += side_links(e, links)
    facts = f"`{e['skill']}`, {MODE_LABEL[run['mode']]}, {plugin_label(run)}, {run['date']}"
    return f"- **{e['title']}**: {facts}. {e['reason']} " + " · ".join(out)


def build(data: dict, ref: str) -> str:
    links = Links(data["repo"], check_ref(ref), data.get("demo_site"))
    entries = data["examples"]
    shown = [e for e in entries if e.get("featured", True)]
    hidden = [e for e in entries if not e.get("featured", True)]
    lines = [START, *intro(shown, links)]
    for e in shown:
        lines += ["", *block_for(e, links)]
    if hidden:
        lines += [
            "",
            "### Recorded, not featured",
            "",
            "These runs were recorded the same way and keep their receipts, but are not shown above, "
            "for the reason given on each line.",
            "",
            *(unfeatured_line(e, links) for e in hidden),
        ]
    lines.append(END)
    out = "\n".join(lines) + "\n"
    if DASH in out:
        raise Fail("the generated block holds U+2014 (em dash)")
    return out


def region(path: Path) -> tuple[str, str, str]:
    if not path.is_file():
        raise Fail(f"no README at {path}")
    text = path.read_text(encoding="utf-8")
    if text.count(START) != 1 or text.count(END) != 1 or text.index(START) > text.index(END):
        raise Fail(f"{path} must hold exactly one {START} ... {END} region")
    head = text[: text.index(START)]
    body = text[text.index(START): text.index(END) + len(END)]
    tail = text[text.index(END) + len(END):]
    return head, body, tail


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--manifest", default=str(DEFAULT_MANIFEST))
    ap.add_argument("--ref", required=True, help="the tag of this repository every link is pinned to")
    ap.add_argument("--readme", metavar="FILE", help="the genjutsu README whose examples region to write or check")
    mode = ap.add_mutually_exclusive_group()
    mode.add_argument("--write", action="store_true", help="replace the examples region of --readme")
    mode.add_argument("--check", action="store_true", help="exit 1 if the examples region of --readme differs")
    args = ap.parse_args()
    try:
        if (args.write or args.check) and not args.readme:
            raise Fail("--write and --check need --readme")
        block = build(load(Path(args.manifest)), args.ref)
        if args.write:
            path = Path(args.readme)
            head, _, tail = region(path)
            path.write_text(head + block.rstrip("\n") + tail, encoding="utf-8")
        elif args.check:
            _, body, _ = region(Path(args.readme))
            if body != block.rstrip("\n"):
                print(f"examples-section: the examples region of {args.readme} is out of date; run "
                      f"python3 bin/examples-section.py --ref {args.ref} --readme {args.readme} --write",
                      file=sys.stderr)
                return 1
            print(f"OK   [examples]: {args.readme} matches {args.manifest} at {args.ref}")
        else:
            sys.stdout.write(block)
    except Fail as e:
        print(f"examples-section: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
