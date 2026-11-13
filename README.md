# genjutsu examples

The recorded runs behind the examples in the [genjutsu](https://github.com/AThevon/genjutsu) README and on [genjutsu.athevon.dev/examples](https://genjutsu.athevon.dev/examples).

Every example here is one real run of the plugin (six for `etale-ios`, every run made of that prompt, told in order in one receipt), kept as it came out: the code the run wrote, its receipt (what ran, on which genjutsu commit and model, what it cost, what the build did, which defects are known), the conversation when there was one, and the media filmed from the build. Nothing a run wrote was edited by hand, with one exception, named in its receipt: every receipt counts its human edits, all of them are 0 but chef-ovatio's, one fix made to its live site after the run (its door titles crossed their photos in an ink that could not be read there).

The genjutsu repository keeps none of this. Its README gallery is generated from [`manifest.json`](./manifest.json) here, and every image and link in it points at a tag of this repository, so what it shows cannot move under it.

## The examples

| Folder | Skill | How it ran | In the gallery | Demo |
|---|---|---|---|---|
| [`nocturne/`](./nocturne) | `paint` | conversation | yes | `/nocturne/` |
| [`chef-ovatio/`](./chef-ovatio) | `bunshin` | the run `bunshin` was extracted from, before v4.1.0 | yes | [chef-ovatio.vercel.app](https://chef-ovatio.vercel.app) |
| [`pottery-firing/`](./pottery-firing) | `cast` | headless, first pass | yes | `/pottery-firing/` |
| [`etale/`](./etale) | `paint` | conversation, the second of two on the same brief | yes | `/etale/` |
| [`invoice-mark-paid/`](./invoice-mark-paid) | `cast` | headless, first pass | yes | `/invoice-mark-paid/` |
| [`etale-ios/`](./etale-ios) | `cast` | headless, SwiftUI: six runs of one prompt across four genjutsu commits; four used the system transition, two hand-built an overlay | yes, run 2, one of the six; all six and their defects are in the same receipt | none: a native app |
| [`gres-redesign/`](./gres-redesign) | `paint` | conversation, the second of two on the same brief | no: thin execution, see its receipt | `/gres-redesign/` |
| [`etale-landing/`](./etale-landing) | `paint` | headless, two runs | no: plain, replaced by the `etale` conversation | |
| [`nocturne-planetarium/`](./nocturne-planetarium) | `paint` | headless, two runs | no: plain, replaced by the `nocturne` conversation | |

Runs that are not in the gallery stay here, with their receipts, so that what was left out is still accounted for.

## Live demos

Each demo is the code a run left, built as it stands under its own path: [`bin/build-demos.sh`](./bin/build-demos.sh) copies the run's code, installs its lockfile and builds it with `--base /<id>/`, without touching a line. The index page is [`demos/index.html`](./demos/index.html). The static result is live at https://genjutsu-examples.vercel.app (Vercel project `genjutsu-examples`); rebuilding it from this repository gives the same files byte for byte.

Chef Ovatio is not built here: it is a real client's site, live on the client's own deployment, and its code is the client's private repository. `etale-ios` has no demo: it is an iOS app, built with Xcode and filmed in the simulator.

## How they were made

**Headless.** A one-shot `claude plugin eval` run on a case in [`cases/`](./cases) (`case.yaml`, `fixture.sh` for the starting project, `prompt.md`, `graders/`), launched through [`bin/run.sh`](./bin/run.sh). Nobody answers genjutsu's questions, so the prompt carries the answers up front and the run marks its own thesis UNVALIDATED.

**Conversation.** A real multi-turn session driven by [`bin/converse.mjs`](./bin/converse.mjs). The first message is the example's `opening.txt`, literally what a user would type. After each genjutsu reply, a separate read-only agent playing the client answers from its brief, the example's `client.md`, until it ends the conversation. The genjutsu session is sandboxed, loads project settings only and no MCP connector, and resumes the same session for each reply.

**The run `bunshin` was extracted from.** `chef-ovatio` is a site built for a real private chef from his public Instagram profile, in one Claude Code session with genjutsu 4.0.0's `paint` and Impeccable, the night `bunshin` was written from it. There was no `/genjutsu:bunshin` yet, the request and the client's material are private, and the cost is the figure genjutsu publishes for that run (about 10.5M subagent tokens over six to eight hours; the main session was not measured). Its receipt says what the run was given, the two answers a person gave it, and every round of its loop.

**Media.** [`bin/record.mjs`](./bin/record.mjs) films a static build in headless Chrome: requests to a fake origin are answered from the build folder on disk through the DevTools protocol, so no server runs, and time is virtual, so clips are smooth however slow the capture. A take with `live` films a deployed site instead (Chef Ovatio). Previews were shot with genjutsu's `shoot.mjs`. Every file in `takes/` is one shot. `etale-ios` is filmed another way, since it is not a web page: screen recordings of the iPhone simulator while a UI test performs the taps, cut and encoded by the scripts in its `takes/` (its receipt says how).

## Layout

```
manifest.json            every example, the source of the genjutsu README gallery
bin/
  examples-section.py    writes the gallery block of a genjutsu README from manifest.json
  test_examples_section.py
  record.mjs             static-build (or live-site) recorder
  converse.mjs           conversation driver
  run.sh                 runs a headless case against a genjutsu checkout
  make-templates.sh      builds the templates the case fixtures copy
  build-demos.sh         builds the live demos
cases/                   the headless eval cases, and _templates/ (sources and lockfiles)
demos/                   the demos index page and its vercel.json
baseline-2026-11/        headless paint against no plugin and frontend-design on one minimal brief, see its COMPARE.md
readme-media/            the images of the genjutsu README's hero and gallery (one cover and
                         one clip per featured example)
  takes/                 the take and the encode script behind hero-site.webp
<example>/
  receipt.md             the run, its cost, the build, known defects, how the media was made
  receipt.json           the same, as data
  transcript.md          the conversation, verbatim (conversations only)
  client.md              the brief of the agent playing the client (conversations only)
  opening.txt            the first message, sent word for word (conversations only)
  source/                the workspace as the run left it, without node_modules and dist
                         (conversations)
  before/                the starting site (gres-redesign) or captures of the starting app
                         (etale-ios)
  runs/                  raw harness output
    <UTC stamp>/         headless: run.log, report.html, aggregate-result.json, and
                         workspace-N/, the workspace each run left
    conversation-N/      conversations: transcript.md and run.json written by converse.mjs
  takes/                 record.mjs take files and the encode scripts behind media/; for
                         etale-ios, also the UI test driver that performs the taps
  media/                 the stills and clips (etale-ios: run 1's, and run N's in run-N/)
  compare/               captures of the two runs side by side (etale-landing only)
```

In the raw output, paths into this repository were made relative to its root (and follow the files when they moved, such as a brief moved next to its example); each U+2014 dash in the CLI's own output (`run.log`, `report.html`) became " - ", as in the transcripts, and so did the one in the `<title>` of a preview page that run 3 of `etale-ios` wrote; nothing else was changed. converse.mjs also writes `calls/` and `session/`, which hold account details and are never committed (see `.gitignore`).

## Rebuild and re-record

You need Node 22 or later, Chrome, and ImageMagick's `magick` with WebP. Some encode scripts in `takes/` also use Python 3 with Pillow and numpy.

Every take points at a build copy next to `takes/` (`../build/dist`, `../build-1/dist`, ...). Those copies are not committed; make them from the run's code:

```sh
# a conversation: build/ from source/
cd etale
cp -R source build
(cd build && npm ci && npm run build)

# a headless run: build-<stamp>-<n>/ from runs/<stamp>/workspace-<n>/
cd pottery-firing
cp -R runs/20261004T162515Z/workspace-1 build-20261004T162515Z-1
(cd build-20261004T162515Z-1 && npm ci && npm run build)
```

`etale-landing` and `nocturne-planetarium` name theirs `build-1` and `build-2`, from `workspace-1` and `workspace-2`. For `gres-redesign`, also run `npm ci && npm run build` in `before/`. Chef Ovatio's takes and the README hero's need no build: they film the live site. `etale-ios` needs Xcode and an iPhone simulator instead of npm; its receipt gives the `xcodebuild` command for each run and how the takes were filmed.

Then film a take:

```sh
node bin/record.mjs --take etale/takes/clip.json --out /tmp/etale-clip
```

It writes the stills and `clip.webp` under `--out` and prints a JSON summary; its header documents every take option.

The README hero is cut from one take of genjutsu.athevon.dev and has its own encode script, which replaces the recorder's encoder (`--max-kb` is raised only so that the recorder's own encoder stops at its first attempt). Film it again whenever the site's homepage changes:

```sh
node bin/record.mjs --take readme-media/takes/hero-site.json --out /tmp/hero-site --max-kb 100000 --keep-frames
python3 readme-media/takes/encode-hero.py /tmp/hero-site/frames readme-media/hero-site.webp 70 1200 0:123:16 123=900,134:162:20 162=1500 217=1700 254=800,267:311:8,311=500 320=1900
```

The frame numbers are the take's own, so a changed take needs its cuts found again. `readme-media/hero-site-poster.png` is its first frame at 1200 px.

The demos:

```sh
bin/build-demos.sh /tmp/genjutsu-demos
cd /tmp/genjutsu-demos && vercel deploy --prod --yes
```

Re-running a run is billed. For a headless case, build the templates once (`bin/make-templates.sh`, needs network), then, with a genjutsu checkout:

```sh
bin/run.sh /path/to/genjutsu pottery-firing 1 .
```

The plugin is copied outside your home directory, `cases/` is copied into that copy's `examples/` (`--eval-dir` must sit inside the plugin), and the run lands in `pottery-firing/runs/<UTC stamp>/` (without the last argument, in `results/`, which is not committed).

For a conversation, prepare a workspace outside your home directory (`cases/_templates/react` built by `bin/make-templates.sh`, plus the example's data file), then:

```sh
node bin/converse.mjs --workspace /private/tmp/gj-ex/etale --plugin <genjutsu copy outside $HOME> \
  --opening etale/opening.txt --client etale/client.md --out etale/runs/conversation-3
```

## The genjutsu README gallery

The gallery between `<!-- genjutsu:examples:start -->` and `<!-- genjutsu:examples:end -->` in the genjutsu README is written from `manifest.json`, with every image and link pinned to a tag of this repository:

```sh
python3 bin/examples-section.py --ref readme-2026-10-05 --readme /path/to/genjutsu/README.md --write
python3 bin/examples-section.py --ref readme-2026-10-05 --readme /path/to/genjutsu/README.md --check
python3 -m unittest discover -s bin -p 'test_*.py'
```

A clip or cover narrower than 720 px (a phone screen) carries its `width` in the manifest and is shown at that width. It refuses a missing file, a media file over 720 KB, a conversation without its brief and first message, a branch as the ref, and an em dash anywhere. To change what the gallery shows: commit here, tag (`readme-YYYY-MM-DD`), push the tag, then regenerate the block with that tag.

## License

[MIT](./LICENSE)
