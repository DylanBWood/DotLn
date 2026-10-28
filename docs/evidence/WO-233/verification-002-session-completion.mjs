// VER-002 criterion 5 probe: the completion side of the session prune.
// Through the generated Claude hooks, a dispatched session keeps its printed
// scratch, its staged file and its live-owner worker capture across two
// ordinary turn ends, then loses its own scratch at the Stop after its
// expected completion event, while its live-owner capture and a live sibling
// session's scratch remain. A worker capture whose owning process has ended
// is gone by completion at the latest (its class boundary is that process's
// end, so the probe records, and does not judge, which Stop removed it).
// Exit 1 when any judged observation disagrees.
// Run: node scripts/harness.mjs bounded -- node docs/evidence/WO-233/verification-002-session-completion.mjs
import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
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
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../../../", import.meta.url));
const {
  createFixtureRoot,
  createTemporaryRoot,
  removeTemporaryRoot,
  temporaryProcessIdentity,
  temporaryProcessTable,
} = await import(join(sourceRoot, "scripts/lib/temporary-roots.mjs"));
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
const sha256 = (text) => createHash("sha256").update(text).digest("hex");
const gitOptions = { exec: true, stdio: ["ignore", "pipe", "pipe"] };
const writable = (path) => {
  const info = lstatSync(path);
  if (info.isSymbolicLink()) return;
  chmodSync(path, info.mode | 0o200 | (info.isDirectory() ? 0o700 : 0));
  if (info.isDirectory())
    for (const name of readdirSync(path)) writable(join(path, name));
};

// The fixture repository of verification-001-session-scratch.mjs, unchanged.
function fixture() {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-ver002-completion-")),
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
  // Beyond the VER-001 fixture: the two source modules the copied
  // scripts/lib/host-resources.mjs imports through gate-evidence.mjs, so the
  // fixture's process table is readable and owner liveness is observed.
  for (const path of [
    ...inputs.files,
    "packages/skeleton/src/gate-evidence.mjs",
    "packages/skeleton/src/gate-deadlines.mjs",
  ]) {
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

const sessionA = `ver002-a-${randomUUID()}`;
const sessionB = `ver002-b-${randomUUID()}`;
const input = (root, session, event, extra = {}) => ({
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
const pruneLine = (response) =>
  (response.systemMessage ?? "")
    .split("\n")
    .filter((line) => line.startsWith("Session prune"));

// A process identity that the process table no longer lists.
async function deadIdentity(root) {
  const child = spawn(process.execPath, ["-e", "setTimeout(() => {}, 30000)"], {
    stdio: "ignore",
  });
  await new Promise((resolve) => setTimeout(resolve, 300));
  const identity = temporaryProcessIdentity(child.pid, root);
  const exited = new Promise((resolve) => child.once("exit", resolve));
  child.kill("SIGKILL");
  await exited;
  return identity;
}

const root = fixture();
const cleanup = [];
const observed = {};
try {
  observed.fixtureProcessTableReadable = temporaryProcessTable(root) !== null;
  // Turn 1: the executor's dispatch prints the session scratch.
  const first = invoke(
    root,
    "session",
    input(root, sessionA, "UserPromptSubmit", { prompt: "resume: next" }),
  );
  const scratch = /DotLn session scratch: (\S+?)\. /.exec(
    first.hookSpecificOutput?.additionalContext ?? "",
  )?.[1];
  assert.ok(scratch && existsSync(scratch), "turn 1 printed no scratch");
  cleanup.push(dirname(scratch));
  const record = JSON.parse(
    readFileSync(join(scratch, ".dotln-owner.json"), "utf8"),
  );
  observed.scratchClass = record.class;
  observed.scratchOwnerIsProbe = record.owner.pid === process.pid;
  observed.scratchSessionIsDigest = record.owner.session === sha256(sessionA);
  writeFileSync(join(scratch, "staged-prompt.md"), "state for the next turn\n");

  // A live sibling session's scratch through the same runtime function.
  const host = await import(
    join(root, "packages/skeleton/dist/src/harness-host.js")
  );
  const sibling = host.ensureHarnessSessionScratch(sessionB, root).path;
  cleanup.push(dirname(sibling));
  writeFileSync(join(sibling, "sibling.md"), "sibling state\n");

  // Session A's worker captures: one live owner, one dead owner.
  const liveCapture = createTemporaryRoot(
    join(tmpdir(), "dotln-ver002-capture-live-"),
    {
      class: "worker-capture",
      repository: root,
      owner: { session: sha256(sessionA) },
    },
  );
  cleanup.push(liveCapture);
  const dead = await deadIdentity(root);
  observed.deadIdentityHasBirth = Boolean(dead.birth);
  const deadCapture = createTemporaryRoot(
    join(tmpdir(), "dotln-ver002-capture-dead-"),
    {
      class: "worker-capture",
      repository: root,
      owner: { ...dead, session: sha256(sessionA) },
    },
  );
  cleanup.push(deadCapture);

  // Two ordinary turn ends: nothing of session A is removed.
  observed.stop1 = pruneLine(
    invoke(root, "finish", input(root, sessionA, "Stop")),
  );
  invoke(
    root,
    "session",
    input(root, sessionA, "UserPromptSubmit", {
      prompt: "Answer: yes. Continue.",
    }),
  );
  observed.stop2 = pruneLine(
    invoke(root, "finish", input(root, sessionA, "Stop")),
  );
  observed.afterTurns = {
    scratch: existsSync(scratch),
    staged: existsSync(join(scratch, "staged-prompt.md")),
    liveCapture: existsSync(liveCapture),
    deadCapture: existsSync(deadCapture),
  };

  // The dispatch's expected completion event, then the Stop that ends it.
  const state = JSON.parse(
    readFileSync(
      join(root, "docs/control/local/harness", `${sha256(sessionA)}.json`),
      "utf8",
    ),
  );
  observed.expectedEvent = state.expectedEvent ?? null;
  writeFileSync(
    join(root, "docs/control/orders/WO-999.jsonl"),
    JSON.stringify({ type: state.expectedEvent, workOrderId: "WO-999" }) + "\n",
    { flag: "a" },
  );
  observed.stop3 = pruneLine(
    invoke(root, "finish", input(root, sessionA, "Stop")),
  );
  observed.afterCompletion = {
    scratch: existsSync(scratch),
    scratchParentLeft: existsSync(dirname(scratch))
      ? readdirSync(dirname(scratch))
      : null,
    liveCapture: existsSync(liveCapture),
    deadCapture: existsSync(deadCapture),
    siblingScratch: existsSync(sibling),
    siblingFile: existsSync(join(sibling, "sibling.md")),
  };
} finally {
  for (const path of cleanup.reverse())
    if (existsSync(path)) rmSync(path, { recursive: true, force: true });
  removeTemporaryRoot(root);
}
console.log(JSON.stringify(observed, null, 1));
const expected =
  observed.fixtureProcessTableReadable &&
  observed.scratchClass === "session-scratch" &&
  observed.scratchOwnerIsProbe &&
  observed.scratchSessionIsDigest &&
  observed.deadIdentityHasBirth &&
  observed.afterTurns.scratch &&
  observed.afterTurns.staged &&
  observed.afterTurns.liveCapture &&
  observed.afterCompletion.scratch === false &&
  observed.afterCompletion.deadCapture === false &&
  observed.afterCompletion.liveCapture === true &&
  observed.afterCompletion.siblingScratch === true &&
  observed.afterCompletion.siblingFile === true;
if (!expected) {
  console.error("Criterion 5 observation disagrees; see the fields above.");
  process.exitCode = 1;
}
