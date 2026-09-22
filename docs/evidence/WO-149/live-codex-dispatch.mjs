// Explicit live evidence, outside npm test. No transcript bytes or identities
// leave local scratch; the report contains counters and invocation observations.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { TOOL_ROOT } from "../../../scripts/lib/config.mjs";
import { installBeaconFixture } from "../../../scripts/test-beacon-fixture.mjs";
import {
  collectSessionUsage,
  currentCodexSession,
  usageSessionKey,
} from "../../../packages/skeleton/src/usage-observation.mjs";
import { judgeCostLine } from "../../../scripts/lib/receipt-cost.mjs";

const root = TOOL_ROOT;
const local = join(root, "docs/control/local/wo149-live-dispatch.json");
const thread = process.env.CODEX_THREAD_ID;
assert.ok(thread, "Run from a real Codex thread");
const key = usageSessionKey(thread);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const run = (cwd, command, args) => {
  const result = spawnSync(command, args, {
    cwd,
    env: process.env,
    encoding: "utf8",
  });
  assert.equal(
    result.status,
    0,
    `${command} ${args[0]} failed: ${result.stderr}`,
  );
  return result;
};
assert.equal(
  realpathSync(
    run(root, "git", ["rev-parse", "--show-toplevel"]).stdout.trim(),
  ),
  realpathSync(root),
);
const parent = JSON.parse(
  readFileSync(join(root, `docs/control/local/harness/${key}.json`), "utf8"),
);
const usage = () =>
  collectSessionUsage(root, { sessionKey: key, since: parent.startedAt });
const write = (base, path, bytes) => {
  mkdirSync(dirname(join(base, path)), { recursive: true });
  writeFileSync(join(base, path), bytes);
};

if (process.argv[2] === "start") {
  assert.equal(existsSync(local), false, "Preserve an existing live run");
  const fixture = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-wo149-live-")),
  );
  run(fixture, "git", ["init", "-q", "-b", "wo-999"]);
  assert.equal(
    run(fixture, "git", ["rev-parse", "--show-toplevel"]).stdout.trim(),
    fixture,
  );
  write(
    fixture,
    ".gitignore",
    "node_modules/\n**/dist/\ndocs/control/local/\n.control-beacons/\n",
  );
  write(fixture, "package.json", '{"private":true,"type":"module"}\n');
  write(fixture, "CLAUDE.md", "# Live public fixture\n");
  write(
    fixture,
    "docs/work-orders/WO-999-fixture.md",
    "# WO-999 — live Codex fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n\n<!-- dotln-dependencies:start -->\n[]\n<!-- dotln-dependencies:end -->\n",
  );
  write(
    fixture,
    "docs/control/orders/WO-999.jsonl",
    JSON.stringify({
      schemaVersion: 1,
      type: "WorkOrderActivated",
      workOrderId: "WO-999",
      workOrderPath: "docs/work-orders/WO-999-fixture.md",
      recordedAt: new Date().toISOString(),
    }) + "\n",
  );
  cpSync(join(root, "scripts/lib"), join(fixture, "scripts/lib"), {
    recursive: true,
  });
  cpSync(join(root, "scripts/resume.mjs"), join(fixture, "scripts/resume.mjs"));
  installBeaconFixture(fixture);
  mkdirSync(join(fixture, "node_modules/@dotln"), { recursive: true });
  for (const name of ["compiler", "kernel", "skeleton"]) {
    cpSync(
      join(root, `packages/${name}/dist`),
      join(fixture, `packages/${name}/dist`),
      { recursive: true },
    );
    cpSync(
      join(root, `packages/${name}/package.json`),
      join(fixture, `packages/${name}/package.json`),
    );
    symlinkSync(
      `../../packages/${name}`,
      join(fixture, `node_modules/@dotln/${name}`),
    );
  }
  run(fixture, "git", ["add", "."]);
  run(fixture, "git", [
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "-qm",
    "Live fixture baseline",
  ]);
  const sessionPath = join(fixture, `docs/control/local/harness/${key}.json`);
  assert.equal(existsSync(sessionPath), false);
  const entry = usage();
  const before = new Date().toISOString();
  const first = run(fixture, process.execPath, ["scripts/resume.mjs", "next"]);
  const after = new Date().toISOString();
  const bytes = readFileSync(sessionPath);
  const session = JSON.parse(bytes);
  assert.equal(session.role, "executor");
  assert.equal(session.workOrder, "WO-999");
  assert.equal(session.expectedEvent, "ImplementationReady");
  assert.deepEqual(session.authoredPaths, []);
  assert.ok(session.startedAt >= before && session.startedAt <= after);
  assert.equal(
    hash(readFileSync(join(fixture, "scripts/resume.mjs"))),
    hash(readFileSync(join(root, "scripts/resume.mjs"))),
  );
  const second = run(fixture, process.execPath, ["scripts/resume.mjs", "next"]);
  assert.deepEqual(readFileSync(sessionPath), bytes);
  writeFileSync(
    local,
    JSON.stringify(
      {
        fixture,
        sessionKey: key,
        sessionHash: hash(bytes),
        parentStartedAt: parent.startedAt,
        entry,
        before,
        after,
        startedAt: session.startedAt,
        firstExit: first.status,
        secondExit: second.status,
        dispatchSourceHash: hash(
          readFileSync(join(root, "scripts/resume.mjs")),
        ),
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    JSON.stringify({
      fixtureOrder: "WO-999",
      beforePresent: false,
      afterPresent: true,
      firstExit: first.status,
      secondExit: second.status,
      role: session.role,
      startedAt: session.startedAt,
      repeatedBytesIdentical: true,
      entryTokens: entry.usage.totalTokens,
      source: entry.source,
    }),
  );
} else if (process.argv[2] === "finish") {
  const state = JSON.parse(readFileSync(local, "utf8"));
  assert.equal(state.sessionKey, key);
  assert.equal(
    hash(
      readFileSync(
        join(state.fixture, `docs/control/local/harness/${key}.json`),
      ),
    ),
    state.sessionHash,
  );
  assert.equal(
    hash(readFileSync(join(root, "scripts/resume.mjs"))),
    state.dispatchSourceHash,
  );
  const handoff = usage();
  assert.ok(
    handoff.observedAt >= state.after,
    "Need a real counter after the fixture dispatch",
  );
  assert.equal(handoff.source, "codex-transcript-counter");
  assert.equal(state.entry.source, handoff.source);
  const line = `**Process cost:** entry ${state.entry.usage.totalTokens} tokens; handoff ${handoff.usage.totalTokens} tokens; source ${handoff.source}`;
  assert.equal(judgeCostLine(line), null);
  const publicRow = {
    invocation: ["node", "scripts/resume.mjs", "next"],
    fixtureOrder: "WO-999",
    beforePresent: false,
    afterPresent: true,
    firstExit: state.firstExit,
    secondExit: state.secondExit,
    role: "executor",
    expectedEvent: "ImplementationReady",
    adoptedPaths: [],
    before: state.before,
    startedAt: state.startedAt,
    after: state.after,
    repeatedBytesIdentical: true,
    dispatchSourceSha256: state.dispatchSourceHash,
    actor: currentCodexSession(root),
    entry: {
      totalTokens: state.entry.usage.totalTokens,
      source: state.entry.source,
      scope: state.entry.scope,
      observedAt: state.entry.observedAt,
    },
    handoff: {
      totalTokens: handoff.usage.totalTokens,
      source: handoff.source,
      scope: handoff.scope,
      observedAt: handoff.observedAt,
    },
  };
  const destination = join(root, "docs/evidence/WO-149/live-codex-dispatch.md");
  assert.equal(
    existsSync(destination),
    false,
    "Preserve the recorded live row",
  );
  writeFileSync(
    destination,
    `# WO-149 live Codex fixture dispatch\n\n${line}\n\nExecuted outside npm test by the current real Codex session. The fixture began\nwith no session record. The only intervening child invocation was the real\nresume next command; no harness begin was called. A second dispatch preserved\nthe session bytes. The source hash matches the repair's dispatch script.\n\nCounters come from the real parent Codex transcript, read against its actual\nworktree and repair start. Entry was sampled immediately before dispatch and\nhandoff afterward. They cover the parent repair dispatch, not isolated fixture\ncompute. The isolated fixture has a different cwd, so its own automatic usage\nreadback is unavailable; no transcript was copied, modified or synthesized to\noverride that boundary. This row couples the witnessed fixture invocation with\nthe actual launching Codex session's counters. No transcript path, thread id,\nor transcript text is published.\n\n\`\`\`json\n${JSON.stringify(publicRow, null, 2)}\n\`\`\`\n`,
  );
  console.log(line);
} else throw new Error("Use start or finish");
