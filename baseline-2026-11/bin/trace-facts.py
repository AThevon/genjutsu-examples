#!/usr/bin/env python3
"""Pull the checkable facts of one run out of its trace: trace-facts.py <trace.jsonl>

The trace itself is not committed (it holds session identifiers). This prints, as JSON, what the
baseline needs from it: what the session had loaded when it started (model, tools, skills,
plugins, MCP servers, from the trace's init event), every Skill tool call, how many times each
tool was called, the run's cost, turns and duration, and its last message.
"""
import collections
import json
import sys


def main(path):
    init, result, last_text = None, None, None
    skill_calls, tools = [], collections.Counter()
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            event = json.loads(line)
            kind = event.get("type")
            if kind == "system" and event.get("subtype") == "init" and init is None:
                init = event
            elif kind == "result":
                result = event
            elif kind == "assistant" and not event.get("parent_tool_use_id"):
                for block in event.get("message", {}).get("content", []):
                    if block.get("type") == "tool_use":
                        tools[block["name"]] += 1
                        if block["name"] == "Skill":
                            skill_calls.append(block.get("input"))
                    elif block.get("type") == "text" and block.get("text", "").strip():
                        last_text = block["text"]
    facts = {
        "session_start": {
            "model": init.get("model"),
            "claude_code_version": init.get("claude_code_version"),
            "permission_mode": init.get("permissionMode"),
            "tools": init.get("tools"),
            "mcp_servers": init.get("mcp_servers"),
            "skills": init.get("skills"),
            "plugins": [
                {key: plugin.get(key) for key in ("name", "source", "version", "path") if plugin.get(key)}
                for plugin in init.get("plugins", [])
            ],
            "agents": init.get("agents"),
        },
        "skill_tool_calls": skill_calls,
        "tool_calls": dict(sorted(tools.items())),
        "result": {
            "cost_usd": result.get("total_cost_usd"),
            "turns": result.get("num_turns"),
            "duration_ms": result.get("duration_ms"),
            "stop": result.get("terminal_reason") or result.get("subtype"),
            "is_error": result.get("is_error"),
            "permission_denials": len(result.get("permission_denials") or []),
            "subagents_spawned": (result.get("subagent_stats") or {}).get("spawned"),
        } if result else None,
        "final_message": (result or {}).get("result") or last_text,
    }
    json.dump(facts, sys.stdout, indent=2, ensure_ascii=False)
    sys.stdout.write("\n")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: trace-facts.py <trace.jsonl>")
    main(sys.argv[1])
