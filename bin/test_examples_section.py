"""Tests for bin/examples-section.py.

The generator writes the Examples gallery of the genjutsu README from this
repository's manifest.json. What must hold: every entry carries its provenance
(request, mode, version and commit, model, selection, cost) and its receipt;
every image and link is absolute and pinned to the ref it is given, never to a
branch; a missing field, a missing media, receipt, source or case path, a media
file over 720 KB and U+2014 (em dash) are refused instead of published; a
conversation links its transcript, the brief of the agent playing the client
and the first message it sent, and is refused without the last two; the run
bunshin was extracted from is said as such, with its token cost and its human
answers; a recorded run that is not featured is listed after the gallery with
its reason and receipt; --write replaces only its region of the given README
and --check fails when the region is out of date.

    python3 -m unittest discover -s bin -p 'test_*.py'
"""

import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "examples-section.py"
REAL_MANIFEST = Path(__file__).resolve().parents[1] / "manifest.json"
DASH = "\u2014"
REF = "readme-2026-10-05"
BLOB = f"https://github.com/AThevon/genjutsu-examples/blob/{REF}"
TREE = f"https://github.com/AThevon/genjutsu-examples/tree/{REF}"
RAW = f"https://raw.githubusercontent.com/AThevon/genjutsu-examples/{REF}"

ENTRY = {
    "id": "pottery-firing",
    "title": "Pottery studio firing stages",
    "skill": "cast",
    "modules": ["gsap", "tells"],
    "kind": "cast",
    "run": {
        "mode": "headless",
        "harness": "claude plugin eval, Claude Code 2.1.289",
        "plugin_version": "4.1.0",
        "plugin_commit": "09c177b",
        "model": "claude-opus-5-5",
        "date": "2026-10-04",
        "cost_usd": 1.5256,
        "turns": 23,
        "selected_from": 1,
        "human_edits": 0,
    },
    "prompt": "/genjutsu:cast pin the four firing stages",
    "caption": "The page is the starting fixture; the pin is the run's work.",
    "media": {
        "cover": {"src": "readme-media/pottery-firing/still.png", "alt": "the pinned section"},
        "clip": {"src": "readme-media/pottery-firing/clip.webp", "alt": "scrolling the pinned section"},
        "stills": [],
    },
    "receipt": "pottery-firing/receipt.md",
    "source": "pottery-firing/workspace-1",
    "case": "cases/pottery-firing",
    "demo": "/pottery-firing/",
    "notes": "First pass, built unchanged.",
}

ORIGIN = {
    "id": "chef-ovatio",
    "title": "Chef Ovatio: a seven-page site",
    "skill": "bunshin",
    "kind": "bunshin",
    "run": {
        "mode": "bunshin-origin",
        "harness": "Claude Code 2.1.284, one main session",
        "plugin_version": "4.0.0",
        "plugin_commit": "a0f6e09",
        "ran_as": "`paint`, with Impeccable",
        "model": "claude-opus-5-5",
        "date": "2026-09-29",
        "subagent_tokens": "about 10.5M",
        "duration": "six to eight hours",
        "main_session": "not measured",
        "loop": "one review, three refine rounds, two verdicts",
        "human_answers": 2,
        "human_edits": 0,
    },
    "request": "No slash command: bunshin did not exist yet.",
    "caption": "A real client's site.",
    "notes": "The run bunshin was extracted from.",
    "media": {
        "cover": {"src": "readme-media/chef-ovatio/home.webp", "alt": "the home"},
        "clip": {"src": "readme-media/chef-ovatio/clip.webp", "alt": "scrolling the home"},
        "stills": [],
    },
    "receipt": "chef-ovatio/receipt.md",
    "demo": "https://chef-ovatio.vercel.app",
    "source_note": "Source: the client's private repository",
}


class ExamplesSectionTest(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        for rel in ("pottery-firing/receipt.md", "readme-media/pottery-firing/still.png",
                    "readme-media/pottery-firing/clip.webp", "pottery-firing/workspace-1/index.html",
                    "cases/pottery-firing/case.yaml", "chef-ovatio/receipt.md",
                    "readme-media/chef-ovatio/home.webp", "readme-media/chef-ovatio/clip.webp"):
            p = self.tmp / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text("x\n")
        self.manifest = self.tmp / "manifest.json"
        self.demo_site = "https://demos.example.app"
        self.write_manifest([copy.deepcopy(ENTRY)])

    def write_manifest(self, entries, **top):
        data = {"repo": "AThevon/genjutsu-examples", "demo_site": self.demo_site, "examples": entries}
        data.update(top)
        self.manifest.write_text(json.dumps(data, ensure_ascii=False))

    def run_gen(self, *extra, ref=REF):
        args = [sys.executable, str(SCRIPT), "--manifest", str(self.manifest)]
        if ref is not None:
            args += ["--ref", ref]
        return subprocess.run(args + list(extra), capture_output=True, text=True)

    def refused(self, entry, needle, **top):
        self.write_manifest([entry], **top)
        r = self.run_gen()
        self.assertNotEqual(r.returncode, 0, r.stdout)
        self.assertIn(needle, r.stderr)

    def test_block_is_wrapped_in_its_markers(self):
        r = self.run_gen()
        self.assertEqual(r.returncode, 0, r.stderr)
        out = r.stdout.strip().splitlines()
        self.assertEqual(out[0], "<!-- genjutsu:examples:start -->")
        self.assertEqual(out[-1], "<!-- genjutsu:examples:end -->")

    def test_block_carries_the_request_the_provenance_and_the_receipt(self):
        out = self.run_gen().stdout
        self.assertIn("`/genjutsu:cast pin the four firing stages`", out)
        for fact in ("`cast`", "one-shot headless run", "genjutsu 4.1.0 at `09c177b`",
                     "`claude-opus-5-5`", "first pass", "$1.53", "23 turns", "0 human edits"):
            self.assertIn(fact, out)
        self.assertIn(f"[Receipt]({BLOB}/pottery-firing/receipt.md)", out)
        self.assertIn("No transcript", out)
        self.assertIn("The page is the starting fixture", out)

    def test_every_link_is_absolute_and_pinned_to_the_ref(self):
        out = self.run_gen().stdout
        self.assertIn(f'src="{RAW}/readme-media/pottery-firing/clip.webp"', out)
        self.assertIn(f'<a href="{BLOB}/pottery-firing/receipt.md">', out)
        self.assertIn(f"[Source]({TREE}/pottery-firing/workspace-1)", out)
        self.assertIn(f"[Case]({TREE}/cases/pottery-firing)", out)
        self.assertIn("[Live demo](https://demos.example.app/pottery-firing/)", out)
        self.assertNotIn("](./", out)
        self.assertNotIn('src="./', out)
        self.assertNotIn("/main/", out)

    def test_the_ref_is_required_and_never_a_branch(self):
        r = self.run_gen(ref=None)
        self.assertNotEqual(r.returncode, 0)
        for ref in ("main", "master", "HEAD", "a b", ""):
            with self.subTest(ref=ref):
                r = self.run_gen(ref=ref)
                self.assertNotEqual(r.returncode, 0, r.stdout)
                self.assertIn("ref", r.stderr)
        r = self.run_gen(ref="readme-2026-11-01")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("/blob/readme-2026-11-01/pottery-firing/receipt.md", r.stdout)

    def test_a_relative_demo_needs_the_demo_site(self):
        self.demo_site = None
        self.write_manifest([copy.deepcopy(ENTRY)])
        r = self.run_gen()
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertNotIn("Live demo", r.stdout)
        self.assertNotIn("live demo", r.stdout)
        self.demo_site = "https://demos.example.app"
        self.write_manifest([copy.deepcopy(ENTRY)])
        self.assertIn("[live demo](https://demos.example.app/)", self.run_gen().stdout)

    def test_a_bad_demo_site_repo_or_demo_is_refused(self):
        self.refused(copy.deepcopy(ENTRY), "demo_site", demo_site="http://demos.example.app")
        self.refused(copy.deepcopy(ENTRY), "demo_site", demo_site="https://demos.example.app/")
        self.refused(copy.deepcopy(ENTRY), "repo", repo="genjutsu-examples")
        entry = copy.deepcopy(ENTRY)
        entry["demo"] = "pottery-firing"
        self.refused(entry, "demo")

    def test_clip_is_shown_width_limited_and_cover_without_a_clip(self):
        out = self.run_gen().stdout
        self.assertIn('width="720"', out)
        entry = copy.deepcopy(ENTRY)
        del entry["media"]["clip"]
        self.write_manifest([entry])
        out = self.run_gen().stdout
        self.assertIn(f'src="{RAW}/readme-media/pottery-firing/still.png"', out)

    def conversation(self, entry):
        """Turn an entry into a conversation, with its transcript, brief and opening on disk."""
        ex = self.tmp / entry["id"]
        ex.mkdir(parents=True, exist_ok=True)
        for name in ("transcript.md", "client.md", "opening.txt"):
            (ex / name).write_text("t\n")
        entry["run"]["mode"] = "conversation"
        entry.pop("case", None)
        entry["transcript"] = f"{entry['id']}/transcript.md"
        entry["client"] = f"{entry['id']}/client.md"
        entry["opening"] = f"{entry['id']}/opening.txt"
        return entry

    def test_selection_and_conversation_are_said(self):
        entry = self.conversation(copy.deepcopy(ENTRY))
        entry["run"]["selected_from"] = 3
        self.write_manifest([entry])
        r = self.run_gen()
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("selected from 3 runs", r.stdout)
        self.assertIn("conversation with an agent playing the client", r.stdout)
        self.assertIn(f"[Transcript]({BLOB}/pottery-firing/transcript.md)", r.stdout)
        self.assertIn(f"[Client brief]({BLOB}/pottery-firing/client.md)", r.stdout)
        self.assertIn(f"[First message]({BLOB}/pottery-firing/opening.txt)", r.stdout)
        self.assertNotIn("one-shot headless run is", r.stdout)

    def test_a_conversation_without_its_transcript_is_refused(self):
        entry = self.conversation(copy.deepcopy(ENTRY))
        del entry["transcript"]
        self.refused(entry, "transcript")

    def test_a_case_on_a_conversation_is_refused(self):
        entry = self.conversation(copy.deepcopy(ENTRY))
        entry["case"] = "cases/pottery-firing"
        self.refused(entry, "only for a headless run")

    def test_a_conversation_without_its_client_brief_or_opening_is_refused(self):
        for key in ("client", "opening"):
            with self.subTest(key=key):
                entry = self.conversation(copy.deepcopy(ENTRY))
                del entry[key]
                self.refused(entry, key)
            with self.subTest(key=key, missing_file=True):
                entry = self.conversation(copy.deepcopy(ENTRY))
                entry[key] = "pottery-firing/gone.txt"
                self.refused(entry, "gone.txt")
            with self.subTest(key=key, unfeatured=True):
                hidden = self.conversation(self.unfeatured())
                del hidden[key]
                self.write_manifest([copy.deepcopy(ENTRY), hidden])
                r = self.run_gen()
                self.assertNotEqual(r.returncode, 0, r.stdout)
                self.assertIn(key, r.stderr)

    def test_a_client_brief_on_a_headless_run_is_refused(self):
        entry = copy.deepcopy(ENTRY)
        entry["client"] = "pottery-firing/receipt.md"
        self.refused(entry, "only for a conversation")

    def test_an_unfeatured_conversation_lists_its_brief_opening_and_demo(self):
        hidden = self.conversation(self.unfeatured())
        hidden["demo"] = "/old-run/"
        self.write_manifest([copy.deepcopy(ENTRY), hidden])
        r = self.run_gen()
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn(
            f"[Receipt]({BLOB}/old-run/receipt.md) · [Transcript]({BLOB}/old-run/transcript.md)"
            f" · [Client brief]({BLOB}/old-run/client.md) · [First message]({BLOB}/old-run/opening.txt)"
            " · [Live demo](https://demos.example.app/old-run/)",
            r.stdout,
        )

    def test_a_missing_required_field_is_refused(self):
        for key in ("prompt", "caption", "receipt", "notes", "media", "source"):
            with self.subTest(key=key):
                entry = copy.deepcopy(ENTRY)
                del entry[key]
                self.refused(entry, key)
        for key in ("plugin_commit", "model", "cost_usd", "selected_from", "mode"):
            with self.subTest(run_key=key):
                entry = copy.deepcopy(ENTRY)
                del entry["run"][key]
                self.refused(entry, key)

    def test_a_path_that_does_not_exist_is_refused(self):
        entry = copy.deepcopy(ENTRY)
        entry["media"]["clip"]["src"] = "readme-media/pottery-firing/nope.webp"
        self.refused(entry, "nope.webp")
        entry = copy.deepcopy(ENTRY)
        entry["media"]["stills"] = [{"src": "readme-media/pottery-firing/gone.png", "alt": "x"}]
        self.refused(entry, "gone.png")
        entry = copy.deepcopy(ENTRY)
        entry["receipt"] = "pottery-firing/missing.md"
        self.refused(entry, "missing.md")
        entry = copy.deepcopy(ENTRY)
        entry["source"] = "pottery-firing/workspace-9"
        self.refused(entry, "workspace-9")
        entry = copy.deepcopy(ENTRY)
        entry["case"] = "cases/nope"
        self.refused(entry, "cases/nope")
        entry = copy.deepcopy(ENTRY)
        entry["source"] = "pottery-firing/receipt.md"
        self.refused(entry, "folder")

    def test_media_over_720_kb_is_refused(self):
        clip = self.tmp / "readme-media" / "pottery-firing" / "clip.webp"
        clip.write_bytes(b"0" * 720_000)
        self.write_manifest([copy.deepcopy(ENTRY)])
        r = self.run_gen()
        self.assertEqual(r.returncode, 0, r.stderr)
        clip.write_bytes(b"0" * 720_001)
        self.refused(copy.deepcopy(ENTRY), "over the")

    def test_an_unreleased_build_and_the_client_cost_are_said(self):
        entry = copy.deepcopy(ENTRY)
        entry["run"].update(plugin_source="fix/skill-arguments on 09c177b (4.1.1 candidate)",
                            client_cost_usd=0.8589, exchanges=8)
        self.write_manifest([entry])
        r = self.run_gen()
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("genjutsu fix/skill-arguments on 09c177b (4.1.1 candidate)", r.stdout)
        self.assertNotIn("genjutsu 4.1.0 at", r.stdout)
        self.assertIn("$1.53 (plus $0.86 for the agent playing the client)", r.stdout)
        self.assertIn("8 exchanges", r.stdout)
        self.assertIn("names the branch and commit", r.stdout)

    def test_a_plugin_source_that_does_not_name_the_commit_is_refused(self):
        entry = copy.deepcopy(ENTRY)
        entry["run"]["plugin_source"] = "fix/skill-arguments (4.1.1 candidate)"
        self.refused(entry, "plugin_source")

    def test_the_bunshin_origin_run_is_said_as_such(self):
        self.write_manifest([copy.deepcopy(ENTRY), copy.deepcopy(ORIGIN)])
        r = self.run_gen()
        self.assertEqual(r.returncode, 0, r.stderr)
        out = r.stdout
        self.assertIn("### Chef Ovatio: a seven-page site", out)
        self.assertIn("<em>No slash command: bunshin did not exist yet.</em>", out)
        for fact in ("`bunshin`", "bunshin run, before v4.1.0 (Claude Code 2.1.284, one main session)",
                     "genjutsu 4.0.0 at `a0f6e09` (`paint`, with Impeccable)",
                     "about 10.5M subagent tokens over six to eight hours (main session not measured)",
                     "one review, three refine rounds, two verdicts", "2 human answers", "0 human edits",
                     "2026-09-29"):
            self.assertIn(fact, out)
        self.assertIn(
            f"[Receipt]({BLOB}/chef-ovatio/receipt.md) · [Live demo](https://chef-ovatio.vercel.app)"
            " · Source: the client's private repository",
            out,
        )
        self.assertIn("fictional clients and one real one", out)
        self.assertIn("extracted from, made before v4.1.0 shipped", out)
        chef = out[out.index("### Chef Ovatio"):]
        self.assertNotIn("No transcript", chef)
        self.assertNotIn("$", chef.split("<sub>")[1].split("</sub>")[0])
        self.write_manifest([copy.deepcopy(ENTRY)])
        self.assertNotIn("one real one", self.run_gen().stdout)

    def test_the_bunshin_origin_run_needs_its_facts(self):
        for key in ("request", "demo", "source_note"):
            with self.subTest(key=key):
                entry = copy.deepcopy(ORIGIN)
                del entry[key]
                self.refused(entry, key)
        for key in ("subagent_tokens", "duration", "main_session", "loop", "human_answers", "ran_as"):
            with self.subTest(run_key=key):
                entry = copy.deepcopy(ORIGIN)
                del entry["run"][key]
                self.refused(entry, key)
        entry = copy.deepcopy(ORIGIN)
        entry["demo"] = "/chef-ovatio/"
        self.refused(entry, "live site")
        entry = copy.deepcopy(ORIGIN)
        entry["skill"], entry["kind"] = "paint", "paint-new"
        self.refused(entry, "only for skill bunshin")
        entry = copy.deepcopy(ORIGIN)
        entry["request"] = "one\ntwo"
        self.refused(entry, "one line")

    def unfeatured(self):
        (self.tmp / "old-run").mkdir(exist_ok=True)
        (self.tmp / "old-run" / "receipt.md").write_text("receipt\n")
        return {
            "id": "old-run", "featured": False, "title": "First headless run",
            "skill": "paint", "kind": "paint-new",
            "run": {"mode": "headless", "plugin_version": "4.1.0", "plugin_commit": "09c177b",
                    "date": "2026-10-04"},
            "reason": "Plain: a correct page with nothing past a tidy default.",
            "receipt": "old-run/receipt.md",
        }

    def test_an_unfeatured_run_is_listed_after_the_gallery_with_its_reason(self):
        self.write_manifest([copy.deepcopy(ENTRY), self.unfeatured()])
        r = self.run_gen()
        self.assertEqual(r.returncode, 0, r.stderr)
        out = r.stdout
        self.assertIn("### Recorded, not featured", out)
        self.assertLess(out.index("### Pottery studio firing stages"), out.index("### Recorded, not featured"))
        self.assertIn(
            "- **First headless run**: `paint`, one-shot headless run, genjutsu 4.1.0 at `09c177b`, "
            "2026-10-04. Plain: a correct page with nothing past a tidy default. "
            f"[Receipt]({BLOB}/old-run/receipt.md)",
            out,
        )
        self.assertNotIn("### First headless run", out)
        self.write_manifest([copy.deepcopy(ENTRY)])
        self.assertNotIn("Recorded, not featured", self.run_gen().stdout)

    def test_an_unfeatured_run_needs_its_reason_and_its_receipt(self):
        entry = self.unfeatured()
        del entry["reason"]
        self.write_manifest([copy.deepcopy(ENTRY), entry])
        r = self.run_gen()
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("reason", r.stderr)
        entry = self.unfeatured()
        entry["receipt"] = "old-run/gone.md"
        self.write_manifest([copy.deepcopy(ENTRY), entry])
        r = self.run_gen()
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("gone.md", r.stderr)

    def test_a_manifest_with_nothing_featured_is_refused(self):
        self.refused(self.unfeatured(), "featured")

    def test_an_em_dash_anywhere_is_refused(self):
        for path in (("caption",), ("run", "harness"), ("media", "cover", "alt")):
            with self.subTest(path=path):
                entry = copy.deepcopy(ENTRY)
                node = entry
                for k in path[:-1]:
                    node = node[k]
                node[path[-1]] = f"one {DASH} two"
                self.refused(entry, "em dash")

    def test_unknown_kind_mode_and_multiline_prompt_are_refused(self):
        entry = copy.deepcopy(ENTRY)
        entry["kind"] = "sketch"
        self.refused(entry, "kind")
        entry = copy.deepcopy(ENTRY)
        entry["run"]["mode"] = "batch"
        self.refused(entry, "mode")
        entry = copy.deepcopy(ENTRY)
        entry["prompt"] = "/genjutsu:cast one\nsecond line"
        self.refused(entry, "first line")

    def test_duplicate_ids_are_refused(self):
        self.write_manifest([copy.deepcopy(ENTRY), copy.deepcopy(ENTRY)])
        r = self.run_gen()
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("duplicate", r.stderr)

    def test_a_backtick_in_the_prompt_stays_one_code_span(self):
        entry = copy.deepcopy(ENTRY)
        entry["prompt"] = "/genjutsu:cast animate the `Card` hover"
        self.write_manifest([entry])
        out = self.run_gen().stdout
        self.assertIn("`` /genjutsu:cast animate the `Card` hover ``", out)

    def test_write_replaces_only_the_region_and_check_follows(self):
        target = self.tmp / "README.md"
        target.write_text("before\n<!-- genjutsu:examples:start -->\nold\n<!-- genjutsu:examples:end -->\nafter\n")
        self.assertNotEqual(self.run_gen("--readme", str(target), "--check").returncode, 0)
        r = self.run_gen("--readme", str(target), "--write")
        self.assertEqual(r.returncode, 0, r.stderr)
        text = target.read_text()
        self.assertTrue(text.startswith("before\n<!-- genjutsu:examples:start -->\n"))
        self.assertTrue(text.endswith("<!-- genjutsu:examples:end -->\nafter\n"))
        self.assertNotIn("\nold\n", text)
        self.assertEqual(self.run_gen("--readme", str(target), "--check").returncode, 0)
        self.assertNotEqual(self.run_gen("--readme", str(target), "--check", ref="readme-2027-01-01").returncode, 0)
        entry = copy.deepcopy(ENTRY)
        entry["run"]["cost_usd"] = 2.5
        self.write_manifest([entry])
        self.assertNotEqual(self.run_gen("--readme", str(target), "--check").returncode, 0)

    def test_write_and_check_need_a_readme_with_exactly_one_region(self):
        r = self.run_gen("--write")
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("--readme", r.stderr)
        target = self.tmp / "README.md"
        target.write_text("no markers here\n")
        r = self.run_gen("--readme", str(target), "--write")
        self.assertNotEqual(r.returncode, 0)
        self.assertEqual(target.read_text(), "no markers here\n")
        r = self.run_gen("--readme", str(self.tmp / "nope.md"), "--check")
        self.assertNotEqual(r.returncode, 0)

    def test_the_real_manifest_is_valid(self):
        r = subprocess.run([sys.executable, str(SCRIPT), "--manifest", str(REAL_MANIFEST), "--ref", REF],
                           capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stderr)
        ids = [e["id"] for e in json.loads(REAL_MANIFEST.read_text())["examples"] if e.get("featured", True)]
        self.assertEqual(ids, ["nocturne", "chef-ovatio", "pottery-firing", "etale", "invoice-mark-paid"])


if __name__ == "__main__":
    unittest.main()
