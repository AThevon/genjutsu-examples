# genjutsu examples

The recorded runs behind the examples in the [genjutsu](https://github.com/AThevon/genjutsu) README and on [genjutsu.athevon.dev/examples](https://genjutsu.athevon.dev/examples).

Every example here is one real run of the plugin, kept as it came out: the code the run wrote, its receipt (what ran, on which genjutsu commit and model, what it cost, what the build did, which defects are known), the conversation when there was one, and the media filmed from the build. Nothing a run wrote was edited by hand: every receipt counts its human edits, and all of them are 0.

## Live demos

<!-- live-demos:start -->
| Example | Skill | Live demo | Receipt |
|---|---|---|---|
| Nocturne | `paint` | coming soon | [receipt](./nocturne/receipt.md) |
| Étale | `paint` | coming soon | [receipt](./etale/receipt.md) |
| Atelier Grès, firing stages | `cast` | coming soon | [receipt](./pottery-firing/receipt.md) |
| Folio, mark as paid | `cast` | coming soon | [receipt](./invoice-mark-paid/receipt.md) |
| Chef Ovatio | `bunshin` | [chef-ovatio.vercel.app](https://chef-ovatio.vercel.app) | |
<!-- live-demos:end -->

Each demo is the static build of the run's code, as filmed for its media. Chef Ovatio is a real client site built by a `bunshin` run; its source lives in its own repository, not here.

## The examples

| Folder | Skill | How it ran | Shown |
|---|---|---|---|
| [`nocturne/`](./nocturne) | `paint` | conversation | yes |
| [`etale/`](./etale) | `paint` | conversation, the second of two on the same brief | yes |
| [`pottery-firing/`](./pottery-firing) | `cast` | headless, first pass | yes |
| [`invoice-mark-paid/`](./invoice-mark-paid) | `cast` | headless, first pass | yes |
| [`gres-redesign/`](./gres-redesign) | `paint` | conversation, the second of two on the same brief | no: thin execution, see its receipt |
| [`etale-landing/`](./etale-landing) | `paint` | headless, two runs | no: plain, replaced by the `etale` conversation |
| [`nocturne-planetarium/`](./nocturne-planetarium) | `paint` | headless, two runs | no: plain, replaced by the `nocturne` conversation |

Runs that were not shown stay here, with their receipts, so that what was left out is still accounted for.

## How they were made

**Headless.** A one-shot `claude plugin eval` run on a case from the genjutsu repository (`examples/<id>/`: `case.yaml`, `fixture.sh` for the starting project, `prompt.md`, `graders/`), launched through that repository's `examples/run.sh`. Nobody answers genjutsu's questions, so the prompt carries the answers up front and the run marks its own thesis UNVALIDATED.

**Conversation.** A real multi-turn session driven by [`bin/converse.mjs`](./bin/converse.mjs). The first message is `clients/<name>.opening.txt`, literally what a user would type. After each genjutsu reply, a separate read-only agent playing the client answers from its brief, `clients/<name>.md`, until it ends the conversation. The genjutsu session is sandboxed, loads project settings only and no MCP connector, and resumes the same session for each reply.

**Media.** [`bin/record.mjs`](./bin/record.mjs) films a static build in headless Chrome: requests to a fake origin are answered from the build folder on disk through the DevTools protocol, so no server runs, and time is virtual, so clips are smooth however slow the capture. Previews were shot with genjutsu's `shoot.mjs`. Every file in `takes/` is one shot.

## Layout

```
bin/
  converse.mjs           conversation driver
  record.mjs             static-build recorder
clients/                 client briefs and opening messages of the conversations
                         (gres.md is the client of gres-redesign)
<example>/
  receipt.md             the run, its cost, the build, known defects, how the media was made
  receipt.json           the same, as data
  transcript.md          the conversation, verbatim (conversations only)
  source/                the workspace as the run left it, without node_modules and dist
                         (conversations)
  before/                the starting site (gres-redesign only)
  runs/                  raw harness output
    <UTC stamp>/         headless: run.log, report.html, aggregate-result.json, and
                         workspace-N/, the workspace each run left
    conversation-N/      conversations: transcript.md and run.json written by converse.mjs
  takes/                 record.mjs take files and the encode scripts behind media/
  media/                 the stills and clips
  compare/               captures of the two runs side by side (etale-landing only)
```

In the raw output, paths into this repository were made relative to its root; nothing else was changed. `run.log` and `report.html` are the CLI's own output. converse.mjs also writes `calls/` and `session/`, which hold account details and are never committed (see `.gitignore`).

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

`etale-landing` and `nocturne-planetarium` name theirs `build-1` and `build-2`, from `workspace-1` and `workspace-2`. For `gres-redesign`, also run `npm ci && npm run build` in `before/`.

Then film a take:

```sh
node bin/record.mjs --take etale/takes/clip.json --out /tmp/etale-clip
```

It writes the stills and `clip.webp` under `--out` and prints a JSON summary; its header documents every take option.

Re-running a run is billed. For a headless case, from a genjutsu checkout:

```sh
GENJUTSU_EXAMPLES_OUT=/path/to/genjutsu-examples examples/run.sh pottery-firing 1
```

For a conversation, prepare a workspace outside your home directory (genjutsu's `examples/_templates/react`, made by `examples/make-templates.sh`, plus the example's data file), then:

```sh
node bin/converse.mjs --workspace /private/tmp/gj-ex/etale --plugin <genjutsu copy outside $HOME> \
  --opening clients/etale.opening.txt --client clients/etale.md --out etale/runs/conversation-3
```

## License

[MIT](./LICENSE)
