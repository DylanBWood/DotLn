// WO-052 process double: exercise the emitted Claude guards before the existing
// source-changing double runs its host-selected commands. No vendor invocation.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const [transport, behavior] = process.argv.slice(2);
const raw = readFileSync(0, "utf8");
const request = JSON.parse(raw);
if (transport === "claude") {
  for (const command of [
    request.testCommand,
    "git add -A",
    request.commitCommand,
  ]) {
    for (const hook of [
      "permissions",
      "concurrent-work-requires-worktrees",
      "no-attribution",
    ]) {
      const response = JSON.parse(
        execFileSync(
          process.execPath,
          [join(process.cwd(), `.claude/hooks/${hook}.mjs`)],
          {
            cwd: process.cwd(),
            encoding: "utf8",
            timeout: 10_000,
            env: { ...process.env, CLAUDE_PID: String(process.pid) },
            input: JSON.stringify({
              hook_event_name: "PreToolUse",
              cwd: process.cwd(),
              session_id: request.episodeId,
              tool_name: "Bash",
              tool_input: { command },
            }),
          },
        ),
      );
      assert.notEqual(
        response.hookSpecificOutput?.permissionDecision,
        "deny",
        JSON.stringify(response),
      );
    }
  }
}
process.stdout.write(
  execFileSync(
    process.execPath,
    [
      new URL("./writer-cli.mjs", import.meta.url).pathname,
      transport,
      behavior,
    ],
    { input: raw, encoding: "utf8", timeout: 15_000 },
  ),
);
