#!/usr/bin/env node
// Runs a real multi-turn genjutsu session with an agent playing the client, and records the whole
// conversation. Node 22 or later, zero dependencies, the `claude` CLI on PATH.
//
// One exchange = one message sent to the genjutsu session (the opening line, then each client
// reply) and the genjutsu reply that comes back. After each genjutsu reply a separate, read-only
// client session (Read and Glob, cwd = the workspace, so it can open preview/ and MASTER.md) is
// given the client brief and the whole transcript, and answers with the client's next message, or
// exactly <<DONE>> when the last genjutsu message is a final report with nothing left to answer.
//
// The genjutsu session is sandboxed (writes outside the workspace are refused) and runs with
// --setting-sources project, so the user's own skills and CLAUDE.md stay out of it, and with
// --strict-mcp-config, so the account's claude.ai connectors stay out too (checked on every call
// from the init line: the run stops if any mcp__ tool shows up). It never runs with
// bypassPermissions.
//
// Costs: on --resume, `total_cost_usd` is the session's running total, not the cost of the call
// (seen in the smoke test: the modelUsage counters of call 2 included call 1). Each genjutsu
// exchange records that running total as session_cost_usd and its own share as cost_usd.
//
// Usage:
//   node converse.mjs --workspace <dir> --plugin <dir> --opening <file> --client <file> --out <dir>
//                     [--max-exchanges 20] [--model claude-opus-5-5]
//                     [--client-model claude-opus-5-5] [--budget-usd 25]
//                     [--plugin-source "<text>"] [--call-timeout-min 120] [--resume-run]
//
//   --opening        file holding the literal first message typed by the user (the whole file, trimmed)
//   --client         the client brief (markdown)
//   --plugin-source  where the plugin copy comes from, recorded in run.json
//   --call-timeout-min  hard kill per claude call, in minutes (90 minimum, default 120)
//   --resume-run     continue an interrupted run from <out>/run.json and <out>/transcript.md
//
// Writes, under --out:
//   transcript.md    the conversation, every message verbatim
//   run.json         plugin source, models, session id, per-exchange cost/turns/duration, totals,
//                    timestamps, stop reason (rewritten after every step)
//   calls/           the raw JSON and stderr of every claude call
//   session/         a copy of the genjutsu session log(s) from ~/.claude/projects, at the end
//
// calls/ and session/ are private: the session log carries the account's email, its connector
// names and home paths. Publish transcript.md (after the typography pass that
// run.json.transcript_checks points to) and a trimmed run.json, never those two folders.

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_SOURCE = "fix/skill-arguments on 09c177b (4.1.1 candidate)";
const DONE = "<<DONE>>";
const SANDBOX = JSON.stringify({
  sandbox: { enabled: true, autoAllowBashIfSandboxed: true, allowUnsandboxedCommands: false },
});
// Variables a parent Claude Code session exports; a child session must not inherit them.
const STRIP_ENV = [
  "CLAUDECODE",
  "CLAUDE_CODE_ENTRYPOINT",
  "CLAUDE_CODE_SESSION_ID",
  "CLAUDE_CODE_CHILD_SESSION",
  "CLAUDE_CODE_SESSION_ATTENDED",
  "CLAUDE_CODE_MESSAGING_SOCKET",
  "CLAUDE_CODE_MESSAGING_TOKEN",
  "CLAUDE_PID",
  "CLAUDE_EFFORT",
];

// ---------------------------------------------------------------------------------------------
// Arguments

function parseArgs(argv) {
  const opts = {
    maxExchanges: 20,
    model: "claude-opus-5-5",
    clientModel: "claude-opus-5-5",
    budgetUsd: 25,
    pluginSource: DEFAULT_SOURCE,
    callTimeoutMin: 120,
    resumeRun: false,
  };
  const names = {
    "--workspace": "workspace",
    "--plugin": "plugin",
    "--opening": "opening",
    "--client": "client",
    "--out": "out",
    "--max-exchanges": "maxExchanges",
    "--model": "model",
    "--client-model": "clientModel",
    "--budget-usd": "budgetUsd",
    "--plugin-source": "pluginSource",
    "--call-timeout-min": "callTimeoutMin",
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--resume-run") { opts.resumeRun = true; continue; }
    if (a === "-h" || a === "--help") { usage(0); }
    const key = names[a];
    if (!key || i + 1 >= argv.length) { console.error(`converse: unknown or incomplete option ${a}`); usage(2); }
    opts[key] = argv[++i];
  }
  for (const k of ["workspace", "plugin", "opening", "client", "out"]) {
    if (!opts[k]) { console.error(`converse: --${k} is required`); usage(2); }
    opts[k] = path.resolve(opts[k]);
  }
  for (const k of ["maxExchanges", "budgetUsd", "callTimeoutMin"]) {
    opts[k] = Number(opts[k]);
    if (!Number.isFinite(opts[k]) || opts[k] <= 0) { console.error(`converse: bad value for ${k}`); usage(2); }
  }
  if (opts.callTimeoutMin < 90) {
    console.error("converse: --call-timeout-min is raised to 90 (a genjutsu turn can run 30+ minutes)");
    opts.callTimeoutMin = 90;
  }
  for (const k of ["workspace", "plugin"]) {
    if (!fs.statSync(opts[k], { throwIfNoEntry: false })?.isDirectory()) { console.error(`converse: ${opts[k]} is not a directory`); process.exit(2); }
  }
  for (const k of ["opening", "client"]) {
    if (!fs.statSync(opts[k], { throwIfNoEntry: false })?.isFile()) { console.error(`converse: ${opts[k]} is not a file`); process.exit(2); }
  }
  return opts;
}

function usage(code) {
  console.error(
    "usage: node converse.mjs --workspace <dir> --plugin <dir> --opening <file> --client <file> --out <dir>\n" +
      "                         [--max-exchanges 20] [--model claude-opus-5-5] [--client-model claude-opus-5-5]\n" +
      "                         [--budget-usd 25] [--plugin-source <text>] [--call-timeout-min 120] [--resume-run]",
  );
  process.exit(code);
}

// ---------------------------------------------------------------------------------------------
// Helpers

const now = () => new Date().toISOString();
const log = (msg) => console.log(`[${new Date().toTimeString().slice(0, 8)}] ${msg}`);
const usd = (n) => `$${(n ?? 0).toFixed(4)}`;
const mins = (ms) => `${((ms ?? 0) / 60000).toFixed(1)} min`;

function childEnv() {
  const env = { ...process.env };
  for (const k of STRIP_ENV) delete env[k];
  return env;
}

// Runs one claude call and returns its parsed JSON result. The prompt goes through stdin when
// `stdin` is given, otherwise as the positional argument.
function runClaude({ args, cwd, stdin, timeoutMin, tag, callsDir }) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn("claude", args, { cwd, env: childEnv(), stdio: ["pipe", "pipe", "pipe"] });
    let out = "";
    let err = "";
    let timedOut = false;
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    const timer = setTimeout(() => {
      timedOut = true;
      log(`${tag}: no answer after ${timeoutMin} min, killing the call`);
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 10000).unref();
    }, timeoutMin * 60000);
    const heartbeat = setInterval(() => log(`${tag}: still running (${mins(Date.now() - started)})`), 5 * 60000);
    child.on("error", (e) => (err += `\nspawn error: ${e.message}`));
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      clearInterval(heartbeat);
      fs.writeFileSync(path.join(callsDir, `${tag}.json`), out);
      if (err) fs.writeFileSync(path.join(callsDir, `${tag}.stderr`), err);
      // Works for --output-format json (one result line) and stream-json (init, messages, result).
      // `texts` is every text block the main agent wrote during the call, in order: what a person
      // at the terminal would have read, where `result` is only the last message.
      let json = null;
      let init = null;
      const texts = [];
      for (const line of out.split("\n")) {
        if (!line.startsWith("{")) continue;
        let o;
        try { o = JSON.parse(line); } catch { continue; }
        if (o.type === "result") json = o;
        else if (o.type === "system" && o.subtype === "init") init = o;
        else if (o.type === "assistant" && !o.parent_tool_use_id) {
          for (const b of o.message?.content ?? []) if (b.type === "text" && b.text?.trim()) texts.push(b.text.trim());
        }
      }
      if (!json) { try { json = JSON.parse(out); } catch { /* not JSON */ } }
      resolve({ json, init, texts, code, signal, timedOut, wallMs: Date.now() - started, stderr: err });
    });
    if (stdin != null) child.stdin.end(stdin);
    else child.stdin.end();
  });
}

function callFailure(r) {
  if (r.timedOut) return "timed out";
  if (!r.json) return `no JSON result (exit ${r.code}${r.signal ? `, ${r.signal}` : ""}): ${r.stderr.trim().slice(-400)}`;
  if (r.json.is_error) return `error result (${r.json.subtype}): ${String(r.json.result ?? "").slice(0, 400)}`;
  if (typeof r.json.result !== "string") return `result has no text (${r.json.subtype})`;
  return null;
}

function callStats(r, startedAt) {
  const j = r.json ?? {};
  return {
    started_at: startedAt,
    ended_at: now(),
    session_id: j.session_id ?? null,
    cost_usd: j.total_cost_usd ?? 0,
    num_turns: j.num_turns ?? null,
    duration_ms: j.duration_ms ?? r.wallMs,
    duration_api_ms: j.duration_api_ms ?? null,
    subtype: j.subtype ?? null,
    is_error: j.is_error ?? true,
    permission_denials: Array.isArray(j.permission_denials) ? j.permission_denials.length : null,
    exit_code: r.code,
  };
}

// On --resume the result's total_cost_usd and modelUsage are the session's running totals. The
// call's own cost is the difference with the previous running total, when the counters show it
// is one (every counter of every model at least as high as before); otherwise the call is
// counted whole (a session whose cost state was not restored).
const COUNTERS = ["inputTokens", "outputTokens", "cacheReadInputTokens", "cacheCreationInputTokens"];
function callShare(j, prev) {
  const total = j?.total_cost_usd ?? 0;
  if (!prev) return { cost: total, basis: "first-call" };
  const mu = j?.modelUsage ?? {};
  const grew = Object.entries(prev.model_usage ?? {}).every(([m, p]) => mu[m] && COUNTERS.every((k) => (mu[m][k] ?? 0) >= (p[k] ?? 0)));
  if (total >= prev.cost_usd && grew) return { cost: total - prev.cost_usd, basis: "running-total-delta" };
  return { cost: total, basis: "whole-call" };
}

// Files in the workspace written after `sinceMs`, outside node_modules, dist and dot directories.
function changedFiles(root, sinceMs) {
  const found = [];
  const walk = (dir) => {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name === "node_modules" || e.name === "dist" || e.name.startsWith(".")) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) {
        try { if (fs.statSync(p).mtimeMs >= sinceMs) found.push(path.relative(root, p)); } catch { /* gone */ }
      }
    }
  };
  walk(root);
  return found.sort();
}

function findSessionLogs(ids) {
  const base = path.join(os.homedir(), ".claude", "projects");
  const hits = [];
  let dirs = [];
  try { dirs = fs.readdirSync(base); } catch { return hits; }
  for (const id of ids) {
    for (const d of dirs) {
      const p = path.join(base, d, `${id}.jsonl`);
      if (fs.existsSync(p)) hits.push(p);
    }
  }
  return hits;
}

// ---------------------------------------------------------------------------------------------
// Transcript

function transcriptAppend(file, who, n, text) {
  fs.appendFileSync(file, `## ${who} (${n})\n\n${text.trim()}\n\n`);
}

function clientPrompt(brief, transcript, changed) {
  const files = changed.length
    ? `Files the assistant wrote or changed in the project during its last turn:\n${changed.map((f) => `- ${f}`).join("\n")}`
    : "The assistant wrote no file in the project during its last turn.";
  return [
    "You are playing a client in a real conversation with a design assistant called genjutsu, which is building or redesigning a web page for you.",
    "Your brief, below between <brief> tags, says who you are, what the product is, what you care about and the rules you follow. Stay in that role for the whole conversation.",
    "The conversation so far is below between <transcript> tags. Each message is headed \"client\" (you) or \"genjutsu\" (the assistant).",
    "The project folder is your current directory. When the assistant shows you something it wrote to a file (a preview page under preview/, MASTER.md, the page itself under src/), open it with Read or Glob and look at it before you answer, the way a client would open the page. Never change any file.",
    files,
    "",
    "<brief>",
    brief.trim(),
    "</brief>",
    "",
    "<transcript>",
    transcript.trim(),
    "</transcript>",
    "",
    `Now reply with your next message to genjutsu, and nothing else: only the exact words you would type, with no preamble, no quotation marks, no stage directions and no notes about what you looked at. Type it the way a person types a chat message: plain punctuation, a comma, a full stop or a simple hyphen, never a long dash. If the last genjutsu message is a final report with nothing left to answer, under the rules of your brief, reply exactly ${DONE} and nothing else.`,
  ].join("\n");
}

// ---------------------------------------------------------------------------------------------
// Main loop

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const callsDir = path.join(opts.out, "calls");
  fs.mkdirSync(callsDir, { recursive: true });
  const runFile = path.join(opts.out, "run.json");
  const transcriptFile = path.join(opts.out, "transcript.md");
  const brief = fs.readFileSync(opts.client, "utf8");
  const opening = fs.readFileSync(opts.opening, "utf8").trim();
  if (!opening) { console.error("converse: the opening file is empty"); process.exit(2); }

  let run;
  if (opts.resumeRun) {
    run = JSON.parse(fs.readFileSync(runFile, "utf8"));
    if (!run.session_id) { console.error("converse: run.json has no session id, start a fresh run"); process.exit(2); }
    run.resumed_at = [...(run.resumed_at ?? []), now()];
    run.stop_reason = null;
    run.ended_at = null;
    // A run killed during a genjutsu call (Ctrl-C, crash) leaves an exchange with no reply and its
    // client message already in the transcript: take both back out so the message is sent once.
    const unfinished = run.exchanges.at(-1);
    if (unfinished && !unfinished.reply_received) {
      run.exchanges.pop();
      if (Number.isInteger(unfinished.transcript_offset)) fs.truncateSync(transcriptFile, unfinished.transcript_offset);
      run.next_message ??= { text: unfinished.message, from: unfinished.from };
      run.interrupted_calls = [...(run.interrupted_calls ?? []), unfinished];
      log(`exchange ${unfinished.n} was interrupted before genjutsu replied; it will be sent again (the session may already hold it)`);
    }
    log(`resuming run ${run.session_id} after ${run.exchanges.length} exchange(s)`);
  } else {
    if (fs.existsSync(runFile)) { console.error(`converse: ${runFile} exists; use --resume-run or another --out`); process.exit(2); }
    run = {
      plugin: { dir: opts.plugin, source: opts.pluginSource },
      model: opts.model,
      client_model: opts.clientModel,
      workspace: opts.workspace,
      opening_file: opts.opening,
      client_file: opts.client,
      max_exchanges: opts.maxExchanges,
      budget_usd: opts.budgetUsd,
      session_id: null,
      session_ids: [],
      exchanges: [],
      next_message: { text: opening, from: "opening" },
      totals: null,
      started_at: now(),
      ended_at: null,
      stop_reason: null,
    };
    fs.writeFileSync(transcriptFile, "");
  }

  const totals = () => {
    let g = 0, c = 0, gt = 0, gms = 0, cms = 0;
    for (const x of [...run.exchanges, ...(run.failed_calls ?? []), ...(run.interrupted_calls ?? [])]) {
      g += x.genjutsu?.cost_usd ?? 0;
      gt += x.genjutsu?.num_turns ?? 0;
      gms += x.genjutsu?.duration_ms ?? 0;
      c += x.client?.cost_usd ?? 0;
      cms += x.client?.duration_ms ?? 0;
    }
    return {
      exchanges: run.exchanges.length,
      failed_calls: (run.failed_calls ?? []).length,
      genjutsu_cost_usd: g,
      client_cost_usd: c,
      cost_usd: g + c,
      genjutsu_turns: gt,
      genjutsu_duration_ms: gms,
      client_duration_ms: cms,
    };
  };
  const save = () => {
    run.totals = totals();
    fs.writeFileSync(runFile, JSON.stringify(run, null, 2) + "\n");
  };
  const stop = (reason) => {
    run.stop_reason = reason;
    run.ended_at = now();
    const said = fs.readFileSync(transcriptFile, "utf8");
    run.transcript_checks = {
      em_dashes: (said.match(/\u2014/g) ?? []).length,
      home_path: said.includes(os.homedir()),
      emails: [...new Set(said.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g) ?? [])],
    };
    if (run.transcript_checks.em_dashes || run.transcript_checks.home_path || run.transcript_checks.emails.length) {
      log(`transcript needs a pass before publishing: ${JSON.stringify(run.transcript_checks)}`);
    }
    const logs = findSessionLogs(run.session_ids);
    if (logs.length) {
      const dir = path.join(opts.out, "session");
      fs.mkdirSync(dir, { recursive: true });
      for (const p of logs) fs.copyFileSync(p, path.join(dir, path.basename(p)));
      const text = logs.map((p) => fs.readFileSync(p, "utf8")).join("\n");
      const m = text.match(/genjutsu: modules from (\/[^\s"\\]+)/);
      run.resolver_line = m ? m[0] : null;
      run.session_logs = logs.map((p) => path.join("session", path.basename(p)));
    }
    save();
    const t = run.totals;
    log(`stopped: ${reason}. ${t.exchanges} exchange(s), ${usd(t.cost_usd)} (genjutsu ${usd(t.genjutsu_cost_usd)}, client ${usd(t.client_cost_usd)}), session ${run.session_id}`);
    log(`transcript: ${transcriptFile}`);
  };
  save();

  // If the last exchange got a genjutsu reply but no client answer (interrupted run), ask now.
  while (true) {
    const last = run.exchanges.at(-1);
    const needClient = !run.next_message && last && last.reply_received && !last.client_done;

    if (!needClient && run.next_message) {
      if (run.exchanges.length >= opts.maxExchanges) return stop("max-exchanges");
      if (totals().cost_usd >= opts.budgetUsd) return stop("budget");
      const n = run.exchanges.length + 1;
      const msg = run.next_message;
      const transcriptBefore = fs.statSync(transcriptFile).size;
      const ex = { n, from: msg.from, message: msg.text, reply_received: false, transcript_offset: transcriptBefore };
      run.exchanges.push(ex);
      transcriptAppend(transcriptFile, "client", n, msg.text);
      save();

      const text = msg.text.startsWith("-") ? ` ${msg.text}` : msg.text;
      const args = [
        "-p",
        "--setting-sources", "project",
        "--settings", SANDBOX,
        "--allowedTools", "Bash", "Read", "Write(./**)", "Edit(./**)", "Glob", "Grep", "Skill",
        "--plugin-dir", opts.plugin,
        "--strict-mcp-config",
        "--model", opts.model,
        "--output-format", "stream-json", "--verbose",
        ...(run.session_id ? ["--resume", run.session_id] : []),
        text,
      ];
      log(`exchange ${n}: sending ${msg.from} message to genjutsu${run.session_id ? ` (resume ${run.session_id})` : ""}`);
      const startedAt = now();
      const startedMs = Date.now();
      const r = await runClaude({ args, cwd: opts.workspace, timeoutMin: opts.callTimeoutMin, tag: `${String(n).padStart(2, "0")}-genjutsu`, callsDir });
      ex.genjutsu = callStats(r, startedAt);
      ex.genjutsu.started_ms = startedMs;
      if (r.json) {
        const share = callShare(r.json, run.genjutsu_session_cost);
        ex.genjutsu.session_cost_usd = r.json.total_cost_usd ?? 0;
        ex.genjutsu.cost_usd = share.cost;
        ex.genjutsu.cost_basis = share.basis;
        if (share.basis === "whole-call") log(`exchange ${n}: the session's running cost did not carry over, counting this call whole`);
        run.genjutsu_session_cost = { cost_usd: r.json.total_cost_usd ?? 0, model_usage: r.json.modelUsage ?? {} };
      }
      const mcpTools = (r.init?.tools ?? []).filter((t) => String(t).startsWith("mcp__"));
      ex.genjutsu.mcp_check = r.init ? (mcpTools.length ? "mcp-tools-present" : "clean") : "no-init-line";
      const failure = callFailure(r);
      if (ex.genjutsu.session_id) {
        if (run.session_id && ex.genjutsu.session_id !== run.session_id) log(`exchange ${n}: session id changed ${run.session_id} -> ${ex.genjutsu.session_id}`);
        run.session_id = ex.genjutsu.session_id;
        if (!run.session_ids.includes(run.session_id)) run.session_ids.push(run.session_id);
      }
      if (failure) {
        ex.genjutsu.failure = failure;
        // Keep the message pending, and out of the transcript, so --resume-run sends it again.
        run.exchanges.pop();
        fs.truncateSync(transcriptFile, transcriptBefore);
        run.failed_calls = [...(run.failed_calls ?? []), ex];
        log(`exchange ${n}: genjutsu call failed: ${failure}`);
        return stop("genjutsu-error");
      }
      ex.reply_received = true;
      run.next_message = null;
      transcriptAppend(transcriptFile, "genjutsu", n, r.texts.length ? r.texts.join("\n\n") : r.json.result);
      save();
      if (mcpTools.length) {
        run.mcp_tools_seen = mcpTools.slice(0, 20);
        log(`exchange ${n}: the session exposes ${mcpTools.length} MCP tool(s) (${mcpTools.slice(0, 3).join(", ")}...), stopping`);
        return stop("mcp-tools-present");
      }
      if (!r.init) log(`exchange ${n}: no init line in the output, could not check for MCP tools`);
      log(`exchange ${n}: genjutsu replied, ${ex.genjutsu.num_turns} turns, ${usd(ex.genjutsu.cost_usd)}, ${mins(ex.genjutsu.duration_ms)}; total ${usd(totals().cost_usd)}`);
      continue;
    }

    if (!needClient) return stop("nothing-to-do");

    // Ask the client.
    if (run.exchanges.length >= opts.maxExchanges) return stop("max-exchanges");
    if (totals().cost_usd >= opts.budgetUsd) return stop("budget");
    const n = last.n;
    const changed = changedFiles(opts.workspace, (last.genjutsu?.started_ms ?? 0) - 1000);
    const prompt = clientPrompt(brief, fs.readFileSync(transcriptFile, "utf8"), changed);
    const args = [
      "-p",
      "--setting-sources", "project",
      "--strict-mcp-config",
      "--model", opts.clientModel,
      "--output-format", "json",
      "--allowedTools", "Read", "Glob",
    ];
    log(`exchange ${n}: asking the client (${changed.length} file(s) changed in the workspace)`);
    const startedAt = now();
    const r = await runClaude({ args, cwd: opts.workspace, stdin: prompt, timeoutMin: opts.callTimeoutMin, tag: `${String(n).padStart(2, "0")}-client`, callsDir });
    last.client = callStats(r, startedAt);
    const failure = callFailure(r);
    if (failure || !r.json.result.trim()) {
      last.client.failure = failure ?? "empty reply";
      save();
      log(`exchange ${n}: client call failed: ${last.client.failure}`);
      return stop("client-error");
    }
    const reply = r.json.result.trim();
    last.client_done = true;
    if (reply.includes(DONE)) {
      last.client.reply = reply;
      save();
      log(`exchange ${n}: client replied ${DONE}`);
      return stop("done");
    }
    run.next_message = { text: reply, from: "client" };
    save();
    log(`exchange ${n}: client replied (${usd(last.client.cost_usd)}): ${reply.replace(/\s+/g, " ").slice(0, 140)}`);
    if (totals().cost_usd >= opts.budgetUsd) return stop("budget");
  }
}

main().catch((e) => {
  console.error(`converse: ${e.stack ?? e}`);
  process.exit(1);
});
