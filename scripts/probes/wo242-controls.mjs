// Compare the installed pre-change permission hook with this working source.
// The retained runtime named by the base hook is required; no result is guessed.
import assert from "node:assert/strict";
import {
  cpSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
  realpathSync,
  appendFileSync,
} from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { planFixture } from "../lib/plan-first-fixture.mjs";
import { runGit } from "../lib/git.mjs";
import { emitHarness } from "../lib/harness.mjs";
import { planDigest } from "../lib/plan-first.mjs";
import { docPath, docRelative } from "../lib/config.mjs";
import { beginHarnessSession } from "../../packages/skeleton/dist/src/harness-host.js";

const root = process.cwd();
const evidencePath = docPath(root, "evidence", "WO-242/controls.json");
const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
const baseHook = runGit(
  root,
  ["show", `${evidence.baseCommit}:.claude/hooks/permissions.mjs`],
  { trim: false },
);
const snapshot = /"snapshot": "(\.runtime\/harness\/[^"]+)"/.exec(
  baseHook,
)?.[1];
assert.ok(snapshot, "base hook names its retained runtime");
const rows = [];
for (const features of [{}, { "plan-first": false }]) {
  const f = planFixture();
  try {
    const hookRoot = realpathSync(f.root);
    appendFileSync(
      join(f.root, ".gitignore"),
      ".runtime/\nnode_modules/\n**/dist/\n",
    );
    // Hook output inspection rejects outside-pointing source links. This
    // control needs only the same canonical-status stub as the hook fixtures.
    unlinkSync(join(f.root, "scripts"));
    mkdirSync(join(f.root, "scripts"));
    writeFileSync(
      join(f.root, "scripts/resume.mjs"),
      `console.log(${JSON.stringify(JSON.stringify({ workOrder: "WO-099", workOrderPath: docRelative(f.root, "workOrders", "WO-099-test.md"), phase: "active", latestVerdict: null }))});\n`,
    );
    writeFileSync(
      join(f.root, "CLAUDE.md"),
      "# Fixture locked floor\nKeep fixture source isolated.\n",
    );
    writeFileSync(
      join(f.root, "dotln.config.json"),
      JSON.stringify({ version: 1, features }),
    );
    emitHarness(hookRoot);
    cpSync(join(root, snapshot), join(f.root, snapshot), { recursive: true });
    const hook = join(f.root, ".claude/hooks/base-permissions.mjs");
    mkdirSync(join(f.root, ".claude/hooks"), { recursive: true });
    writeFileSync(hook, baseHook);
    for (const session of ["off-control-base", "off-control-candidate"])
      beginHarnessSession(hookRoot, session, "executor");
    for (const [name, tool_name, tool_input] of [
      ["source write", "Edit", { file_path: join(f.root, "hello.txt") }],
      ["read", "Read", { file_path: join(f.root, "hello.txt") }],
      ["push advisory", "Bash", { command: "git push" }],
      [
        "malformed later destination",
        "Bash",
        { command: "touch hello.txt /dev/null/child" },
      ],
    ]) {
      const payload = {
        cwd: hookRoot,
        hook_event_name: "PreToolUse",
        tool_name,
        tool_input,
      };
      const outputs = [hook, join(f.root, ".claude/hooks/permissions.mjs")].map(
        (file, index) => {
          const result = spawnSync(process.execPath, [file], {
            cwd: hookRoot,
            input: JSON.stringify({
              ...payload,
              session_id:
                index === 0 ? "off-control-base" : "off-control-candidate",
            }),
            encoding: "utf8",
          });
          assert.equal(result.status, 0, result.stderr);
          const response = JSON.parse(result.stdout);
          assert.doesNotMatch(
            result.stdout,
            /runtime unavailable|pinned runtime|snapshot-missing/i,
          );
          return result.stdout;
        },
      );
      assert.equal(outputs[0], outputs[1], name);
      rows.push({
        surface: `hook: ${name}`,
        election: Object.hasOwn(features, "plan-first") ? "false" : "absent",
        base: planDigest(outputs[0]),
        candidate: planDigest(outputs[1]),
        equal: true,
        response: JSON.parse(outputs[1]),
      });
    }
  } finally {
    f.cleanup();
  }
}
evidence.rows = evidence.rows.filter((row) => !row.surface.startsWith("hook:"));
evidence.rows.push(...rows);
writeFileSync(evidencePath, JSON.stringify(evidence, null, 2) + "\n");
console.log(
  `Recorded ${rows.length} identical base/current permission-hook controls.`,
);
