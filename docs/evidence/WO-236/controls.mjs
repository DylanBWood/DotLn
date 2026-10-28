import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createFixtureRoot,
  removeTemporaryPath,
} from "../../../scripts/lib/temporary-roots.mjs";
import { emitHarness } from "../../../scripts/lib/harness.mjs";
import { beginHarnessSession } from "../../../packages/skeleton/dist/src/harness-host.js";

// Run base before rebuilding, then head after rebuilding. Each arm uses that
// build's generated hook and pinned runtime, with the same fixture and inputs.
const arm = process.argv[2];
assert.ok(["base", "head"].includes(arm));
const root = process.cwd();
const base = realpathSync(
  createFixtureRoot(join(tmpdir(), "dotln-target-control-")),
);
const launchpad = join(base, "launchpad");
const target = join(base, "target");
const temporary = join(base, "temporary");
const session = "target-control";
const digest = (value) => createHash("sha256").update(value).digest("hex");
const write = (file, content) => {
  mkdirSync(join(launchpad, file, ".."), { recursive: true });
  writeFileSync(join(launchpad, file), content);
};
try {
  for (const directory of [launchpad, target, temporary]) mkdirSync(directory);
  execFileSync("git", ["init", "-q", "-b", "wo-999"], { cwd: launchpad });
  write(".gitignore", ".runtime/\ndocs/control/local/\n");
  write(
    "CLAUDE.md",
    "# Fixture locked floor\nKeep synthetic source isolated.\n",
  );
  write("dotln.config.json", JSON.stringify({ version: 1 }));
  write(
    "scripts/resume.mjs",
    'console.log(JSON.stringify({workOrder:"WO-999",workOrderPath:"docs/work-orders/WO-999.md",phase:"active",latestVerdict:null}));\n',
  );
  write("docs/work-orders/WO-999.md", "# Synthetic target order\n");
  write(
    "docs/control/local/target-worktrees.json",
    JSON.stringify({ [target]: { workOrderId: "WO-999", target, launchpad } }),
  );
  execFileSync("git", ["add", "."], { cwd: launchpad });
  execFileSync(
    "git",
    [
      "-c",
      "core.hooksPath=/dev/null",
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-qm",
      "Create synthetic launchpad",
    ],
    { cwd: launchpad },
  );
  emitHarness(launchpad);
  beginHarnessSession(launchpad, session, "executor");
  const manifest = JSON.parse(
    readFileSync(join(launchpad, ".claude/harness-manifest.json"), "utf8"),
  );
  const rows = [];
  for (const [tool, tool_input] of [
    [
      "Edit",
      { file_path: join(target, "file.txt"), old_string: "x", new_string: "y" },
    ],
    ["Write", { file_path: join(target, "file.txt"), content: "y" }],
    ["Bash", { command: `printf y > '${target}/file.txt'` }],
  ]) {
    const result = spawnSync(
      process.execPath,
      [join(launchpad, ".claude/hooks/permissions.mjs")],
      {
        cwd: launchpad,
        encoding: "utf8",
        timeout: 20_000,
        env: {
          ...process.env,
          CODEX_THREAD_ID: "",
          CLAUDE_PID: String(process.pid),
          TMPDIR: temporary,
          TMP: temporary,
          TEMP: temporary,
        },
        input: JSON.stringify({
          cwd: launchpad,
          session_id: session,
          hook_event_name: "PreToolUse",
          tool_name: tool,
          tool_input,
        }),
      },
    );
    assert.equal(result.status, 0, result.stderr);
    const response = JSON.parse(result.stdout);
    const admitted =
      response.hookSpecificOutput?.permissionDecision !== "deny" &&
      response.decision !== "block";
    assert.equal(admitted, arm === "head", JSON.stringify(response));
    rows.push({
      tool,
      processExitCode: result.status,
      criterionExitCode: admitted ? 0 : 1,
      response,
    });
  }
  const journal = readFileSync(
    join(launchpad, "docs/control/local/harness", `${digest(session)}.jsonl`),
    "utf8",
  )
    .trim()
    .split("\n")
    .map(JSON.parse)
    .filter((row) => row.outsideWrite);
  assert.equal(journal.length, 3);
  assert.ok(
    journal.every(
      (row) =>
        row.outsideWrite.status === (arm === "head" ? "granted" : "refused"),
    ),
  );
  if (arm === "head")
    for (const row of journal) {
      assert.equal(row.outsideWrite.kind, "target-worktree");
      assert.equal(row.outsideWrite.originId, "contributor.executor");
      assert.equal(
        row.outsideWrite.authorityGrantId,
        "contributor.target-worktree",
      );
    }
  const file = "docs/evidence/WO-236/controls.json";
  const controls = existsSync(file)
    ? JSON.parse(readFileSync(file, "utf8"))
    : {
        schemaVersion: 1,
        comparison:
          "Identical synthetic launchpad registration, active executor and three write requests; each arm runs its own emitted permission hook and pinned runtime. Hook protocol exits zero even for a refusal; criterionExitCode is zero only when the requested admission is present. Base runs the unchanged activation build before any rebuild; head runs the changed build.",
      };
  controls[arm] = JSON.parse(
    JSON.stringify({
      observedAt: new Date().toISOString(),
      sourceRevision: execFileSync("git", ["rev-parse", "HEAD"], {
        cwd: root,
        encoding: "utf8",
      }).trim(),
      runtimeDigests: Object.fromEntries(
        [
          "compiler/dist/src/harness.js",
          "skeleton/dist/src/harness-host.js",
          "skeleton/dist/src/loadouts/contributor.js",
        ].map((file) => [
          file,
          digest(readFileSync(join(root, "packages", file))),
        ]),
      ),
      executorGrants: manifest.profiles[0].outsideWriteGrants.find(
        (row) => row.role === "executor",
      ),
      rows,
      journal,
    }).replaceAll(base, "<fixture>"),
  );
  writeFileSync(file, JSON.stringify(controls, null, 2) + "\n");
  console.log(
    JSON.stringify({
      arm,
      processExitCodes: rows.map((row) => row.processExitCode),
      criterionExitCodes: rows.map((row) => row.criterionExitCode),
      journalStatuses: journal.map((row) => row.outsideWrite.status),
    }),
  );
} finally {
  removeTemporaryPath(base, { recursive: true, force: true });
}
