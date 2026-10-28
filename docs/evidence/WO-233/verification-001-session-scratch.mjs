// VER-001 F3 probe: a session's scratch must survive an ordinary turn end.
// Exit 1 when a turn-end Stop removes the scratch of a session whose owning
// host process is still alive; exit 0 when the scratch and its file survive.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-233/verification-001-session-scratch.mjs
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  chmodSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../../../", import.meta.url));
const { createFixtureRoot, removeTemporaryRoot } = await import(
  join(sourceRoot, "scripts/lib/temporary-roots.mjs")
);
const { runGit } = await import(join(sourceRoot, "scripts/lib/git.mjs"));
const { write, json } = await import(
  join(sourceRoot, "scripts/lib/helpers.mjs")
);
const { emitHarness } = await import(
  join(sourceRoot, "scripts/lib/harness.mjs")
);
const { observedSpawnSync: spawnSync, deadlineLimit } = await import(
  join(sourceRoot, "packages/skeleton/src/gate-deadlines.mjs")
);

// As in scripts/test-harness.mjs: the probe process stands in for the host.
process.env.CLAUDE_PID = String(process.pid);
const gitOptions = { exec: true, stdio: ["ignore", "pipe", "pipe"] };
const writable = (path) => {
  const info = lstatSync(path);
  if (info.isSymbolicLink()) return;
  chmodSync(path, info.mode | 0o200 | (info.isDirectory() ? 0o700 : 0));
  if (info.isDirectory())
    for (const name of readdirSync(path)) writable(join(path, name));
};

// The fixture repository of scripts/test-harness.mjs fixture(), unchanged.
function fixture() {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-ver001-scratch-")),
  );
  runGit(root, ["init", "-b", "wo-999"], gitOptions);
  for (const name of ["compiler", "skeleton", "kernel"]) {
    cpSync(
      join(sourceRoot, `packages/${name}/dist/src`),
      join(root, `packages/${name}/dist/src`),
      { recursive: true },
    );
    writable(join(root, `packages/${name}/dist`));
    cpSync(
      join(sourceRoot, `packages/${name}/package.json`),
      join(root, `packages/${name}/package.json`),
    );
    mkdirSync(join(root, "node_modules/@dotln"), { recursive: true });
    symlinkSync(
      `../../packages/${name}`,
      join(root, `node_modules/@dotln/${name}`),
    );
  }
  cpSync(join(sourceRoot, "packages/beacons"), join(root, "packages/beacons"), {
    recursive: true,
  });
  writable(join(root, "packages/beacons"));
  symlinkSync(
    "../../packages/beacons",
    join(root, "node_modules/@dotln/beacons"),
  );
  symlinkSync(
    join(sourceRoot, "node_modules/typescript"),
    join(root, "node_modules/typescript"),
  );
  write(
    root,
    ".gitignore",
    "node_modules/\n**/dist/\ndocs/control/local/\n.runtime/\n.dotln-owner.json\n",
  );
  write(
    root,
    "CLAUDE.md",
    "# Fixture locked floor\nKeep fixture source isolated.\n",
  );
  write(root, "fixture.ts", "export const value = 1;\n");
  write(
    root,
    "package.json",
    json({ private: true, scripts: { test: "node -e 0" } }),
  );
  write(
    root,
    "scripts/resume.mjs",
    'import {readFileSync} from "node:fs"; console.log(readFileSync("docs/control/fixture-status.json", "utf8"));\n',
  );
  const inputs = JSON.parse(
    readFileSync(
      join(sourceRoot, "scripts/test-harness.fixture-inputs.json"),
      "utf8",
    ),
  );
  cpSync(join(sourceRoot, "scripts/lib"), join(root, "scripts/lib"), {
    recursive: true,
  });
  for (const path of inputs.files) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    cpSync(join(sourceRoot, path), join(root, path));
  }
  write(
    root,
    "docs/control/fixture-status.json",
    json({
      workOrder: "WO-999",
      workOrderPath: "docs/work-orders/WO-999-fixture.md",
      phase: "active",
      latestVerdict: null,
    }),
  );
  write(
    root,
    "docs/control/orders/WO-999.jsonl",
    JSON.stringify({ type: "WorkOrderActivated", workOrderId: "WO-999" }) +
      "\n",
  );
  write(
    root,
    "docs/work-orders/WO-999-fixture.md",
    "# Synthetic work order\nRead fixture.ts and run npm test.\n",
  );
  runGit(root, ["add", "."], gitOptions);
  runGit(
    root,
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-m",
      "Create fixture",
    ],
    gitOptions,
  );
  emitHarness(root);
  return root;
}

const session = `ver001-probe-${randomUUID()}`;
const input = (root, event, extra = {}) => ({
  cwd: root,
  session_id: session,
  hook_event_name: event,
  ...extra,
});
const invoke = (root, name, payload) => {
  const run = spawnSync(
    process.execPath,
    [join(root, `.claude/hooks/${name}.mjs`)],
    {
      cwd: root,
      env: process.env,
      input: JSON.stringify(payload),
      encoding: "utf8",
      timeout: deadlineLimit(1000, 20_000),
    },
  );
  assert.equal(run.status, 0, run.stderr);
  return JSON.parse(run.stdout || "{}");
};

const root = fixture();
let scratch;
const observed = {};
try {
  // Turn 1: the executor's dispatch prints the session scratch.
  const first = invoke(
    root,
    "session",
    input(root, "UserPromptSubmit", { prompt: "resume: next" }),
  );
  scratch = /DotLn session scratch: (\S+?)\. /.exec(
    first.hookSpecificOutput?.additionalContext ?? "",
  )?.[1];
  assert.ok(scratch && existsSync(scratch), "turn 1 printed no scratch");
  const owner = JSON.parse(
    readFileSync(join(scratch, ".dotln-owner.json"), "utf8"),
  ).owner;
  writeFileSync(join(scratch, "staged-prompt.md"), "state for the next turn\n");
  // Turn 1 ends with no background task, as when the session asks a question.
  const stop = invoke(root, "finish", input(root, "Stop"));
  observed.stopPrune = (stop.systemMessage ?? "")
    .split("\n")
    .filter((line) => line.startsWith("Session prune"));
  observed.phaseAfterTurn1 = JSON.parse(
    readFileSync(join(root, "docs/control/fixture-status.json"), "utf8"),
  ).phase;
  // Turn 2: an ordinary follow-up prompt with no role phrase.
  const second = invoke(
    root,
    "session",
    input(root, "UserPromptSubmit", { prompt: "Answer: yes. Continue." }),
  );
  observed.turn2PrintsScratch = /session scratch/.test(
    second.hookSpecificOutput?.additionalContext ?? "",
  );
  observed.scratchExists = existsSync(scratch);
  observed.stagedFileExists = existsSync(join(scratch, "staged-prompt.md"));
  observed.ownerPid = owner.pid;
  observed.ownerAlive = owner.pid === process.pid;
} finally {
  if (scratch && existsSync(dirname(scratch)))
    rmSync(dirname(scratch), { recursive: true, force: true });
  removeTemporaryRoot(root);
}
console.log(JSON.stringify(observed));
if (!observed.stagedFileExists && observed.ownerAlive) {
  console.error(
    "F3 reproduced: a turn-end Stop removed a live session's scratch and its staged file.",
  );
  process.exitCode = 1;
}
