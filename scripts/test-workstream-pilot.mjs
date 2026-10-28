import {
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import "./test-fixture-temporary.mjs";
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { TOOL_ROOT } from "./lib/config.mjs";
import { runGit } from "./lib/git.mjs";
import { write } from "./lib/helpers.mjs";
import {
  KIT_FILES,
  TEST_FIXTURE_TREES,
  TEST_SUPPORT_FILES,
} from "./launchpad.mjs";
import {
  fixtureRepository,
  fixtureCommit,
  streamAuthority,
  streamDocument,
  streamSequence,
  streamSnapshot,
  streamRepositoryProfile,
} from "./test-workstream-index-fixture.mjs";
import { publicationVocabulary } from "./test-target-publication-fixture.mjs";

const scratch = realpathSync(
  createFixtureRoot(join(tmpdir(), "dotln-workstream-pilot-")),
);
const source = join(scratch, "source");
const launchpad = join(scratch, "launchpad");
const targets = join(scratch, "targets");
const env = {
  ...process.env,
  npm_config_offline: "true",
  npm_config_update_notifier: "false",
};
for (const key of [
  "CODEX_THREAD_ID",
  "COPILOT_AGENT_SESSION_ID",
  "CLAUDE_CODE_SESSION_ID",
  "CLAUDE_SESSION_ID",
  "CLAUDE_EFFORT",
  "DOTLN_LAUNCHPAD",
  "DOTLN_ACCOUNT_LABEL",
  "DOTLN_BEACON_KEY_FILE",
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_INDEX_FILE",
  "GIT_COMMON_DIR",
  "GIT_PREFIX",
])
  delete env[key];
const run = (cwd, command, args, extra = {}) =>
  spawnSync(command, args, {
    cwd,
    env,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    timeout: 240_000,
    ...extra,
  });
const ok = (result) => {
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return result.stdout;
};
const node = (root, script, args, cwd = root, extra = {}) =>
  run(
    cwd,
    process.execPath,
    [join(root, "scripts", `${script}.mjs`), ...args],
    extra,
  );
const git = (root, ...args) => runGit(root, args, { env });
const actor = {
  harness: "human",
  harnessVersion: "not-applicable",
  model: "human",
  effort: "unknown",
  source: "operator-attested",
};
const flags = Object.entries(actor).flatMap(([key, value]) => [
  `--${key === "harnessVersion" ? "harness-version" : key}`,
  value,
]);
const report = `# Synthetic pilot judgment\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n\n**Criterion 1:** met — the synthetic target gate asserts the required file.\n`;
const clones = {},
  bases = {},
  orders = {};
const ids = { service: "WO-301", client: "WO-302", docs: "WO-303" };
const json = (root, path) => JSON.parse(readFileSync(join(root, path), "utf8"));
const statusOf = (order) =>
  JSON.parse(
    ok(node(order.root, "resume", ["status", "--json"], order.target)),
  );
const start = (id, repository) => {
  ok(
    node(launchpad, "worktree", [
      "start",
      id,
      `docs/work-orders/${id}-fixture.md`,
    ]),
  );
  const order = {
    id,
    repository,
    root: join(scratch, `launchpad-wo${id.slice(3)}`),
    target: join(targets, `${repository}-wo${id.slice(3)}`),
  };
  orders[id] = order;
  assert.equal(statusOf(order).workOrder, id);
  return order;
};
const resume = (order, ...args) =>
  ok(node(order.root, "resume", args, order.target));
const close = (order) => {
  write(order.target, "delivered.txt", `${order.id} delivered\n`);
  git(order.target, "add", ".");
  git(
    order.target,
    "-c",
    "maintenance.auto=false",
    "commit",
    "--signoff",
    "-qm",
    "test: deliver synthetic target",
  );
  ok(node(order.root, "target-gate", [order.id, "--review"], order.target));
  write(
    order.root,
    `docs/evidence/${order.id}/handoff.md`,
    `${report}\nself-review: found 0; fixed 0; recorded 0\n`,
  );
  resume(order, "implementation-ready", ...flags);
  resume(order, "verify");
  write(order.root, `docs/verifications/${order.id}/VER-001.md`, report);
  resume(order, "verification-result", "pass", ...flags);
  resume(order, "final-review");
  write(order.root, `docs/final-reviews/${order.id}/FINAL-001.md`, report);
  resume(order, "final-review-result", "pass", ...flags);
  assert.equal(statusOf(order).phase, "closed");
  ok(node(order.root, "work-orders", ["index"], order.target));
  const member = streamSnapshot(
    readFileSync(join(order.root, "docs/work-orders/README.md"), "utf8"),
  ).workstreams[0].members.find((member) => member.workOrderId === order.id);
  assert.equal(member.phase, "closed");
  assert.equal(member.verdict, "pass");
};
const mergeRecords = (order) => {
  fixtureCommit(order.root, "Synthetic instance records");
  git(launchpad, "merge", "--ff-only", `wo-${order.id.slice(3)}`);
  git(launchpad, "push", "-q", "origin", "main");
};

before(() => {
  // Commit a bounded source copy so the export builds the exact bytes under
  // review without making a commit on the executor's branch.
  fixtureRepository(source);
  const copy = (path) => {
    mkdirSync(dirname(join(source, path)), { recursive: true });
    cpSync(join(TOOL_ROOT, path), join(source, path), { recursive: true });
  };
  for (const path of new Set([
    "scripts",
    "packages/beacons",
    ...TEST_FIXTURE_TREES,
    ...TEST_SUPPORT_FILES,
    ...KIT_FILES.files,
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "LICENSE",
    "LICENSE-docs",
    "NOTICE",
    ".gitignore",
    "docs/LEGAL.md",
    ...KIT_FILES.documents.map(([root, ...parts]) =>
      [root === "docs" ? "docs" : `docs/${root}`, ...parts].join("/"),
    ),
  ]))
    copy(path);
  for (const { path } of json(TOOL_ROOT, "tsconfig.json").references)
    for (const entry of ["package.json", "tsconfig.json", "src", "test"])
      if (existsSync(join(TOOL_ROOT, path, entry))) copy(`${path}/${entry}`);
  git(
    source,
    "remote",
    "add",
    "origin",
    "https://example.invalid/fixture/core.git",
  );
  fixtureCommit(source, "Workstream pilot export source");
  mkdirSync(join(source, "node_modules/@dotln"), { recursive: true });
  for (const name of readdirSync(join(TOOL_ROOT, "node_modules")))
    if (![".bin", "@dotln"].includes(name))
      symlinkSync(
        join(TOOL_ROOT, "node_modules", name),
        join(source, "node_modules", name),
      );
  for (const name of readdirSync(join(source, "packages")))
    if (existsSync(join(source, "packages", name, "package.json")))
      symlinkSync(
        `../../packages/${name}`,
        join(source, "node_modules/@dotln", name),
      );
  ok(node(source, "launchpad", ["export", launchpad]));
  fixtureRepository(launchpad);
  mkdirSync(targets);
  for (const repository of Object.keys(ids)) {
    const clone = join(scratch, repository);
    fixtureRepository(clone);
    write(clone, "contract.json", '{"version":1,"optionalField":true}\n');
    write(clone, "source.txt", "Synthetic base\n");
    clones[repository] = clone;
    bases[repository] = fixtureCommit(clone, `${repository} base`);
  }
  const config = {
    version: 1,
    classes: { fixture: { checks: [], supports: [] } },
    repositories: {},
  };
  for (const repository of Object.keys(ids))
    config.repositories[repository] = {
      ...streamRepositoryProfile(),
      worktreeParent: "../targets",
      authorityProfile: {
        ...streamRepositoryProfile().authorityProfile,
        allowedEffects: ["repo.read", "repo.write", "repo.test"],
        requiredEvidence: [],
      },
      gate: {
        commands: {
          test: {
            argv: [
              process.execPath,
              "-e",
              "const fs=require('node:fs'); if(!fs.existsSync('source.txt') || !fs.existsSync('delivered.txt')) process.exit(1)",
            ],
            timeoutMs: 5000,
          },
        },
        plain: ["test"],
        review: ["test"],
      },
    };
  write(launchpad, "dotln.config.json", JSON.stringify(config));
  write(
    launchpad,
    "docs/control/outward-vocabulary.json",
    JSON.stringify(publicationVocabulary),
  );
  const members = Object.entries(ids).map(([repositoryId, workOrderId]) => ({
    workOrderId,
    repositoryId,
  }));
  write(
    launchpad,
    "docs/workstreams/WS-001-fixture.md",
    streamDocument({
      id: "WS-001",
      members,
      edges: [{ from: "WO-302", to: "WO-301", relation: "contract-fixture" }],
    }),
  );
  write(
    launchpad,
    "docs/workstreams/WS-002-fixture.md",
    streamDocument({
      id: "WS-002",
      members: [{ workOrderId: "WO-304", repositoryId: "service" }],
      edges: [],
    }),
  );
  for (const { workOrderId, repositoryId } of [
    ...members,
    { workOrderId: "WO-304", repositoryId: "service" },
  ])
    write(
      launchpad,
      `docs/work-orders/${workOrderId}-fixture.md`,
      streamAuthority(
        workOrderId,
        workOrderId === "WO-304" ? "WS-002" : "WS-001",
        { id: repositoryId, base: bases[repositoryId] },
      ) +
        "\n**Acceptance criteria (all required)**\n\n1. The target contains the synthetic delivered file.\n",
    );
  write(
    launchpad,
    "docs/planning/sequence.md",
    streamSequence(["WO-001", ...Object.values(ids), "WO-304"]),
  );
  fixtureCommit(launchpad, "Synthetic three-repository workstream");
  const origin = join(scratch, "launchpad.git");
  git(scratch, "init", "--bare", "-q", "-b", "main", origin);
  git(launchpad, "remote", "add", "origin", origin);
  git(launchpad, "push", "-qu", "origin", "main");
  ok(
    run(launchpad, "npm", [
      "ci",
      "--offline",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
    ]),
  );
  for (const repository of Object.keys(ids))
    ok(node(launchpad, "worktree", ["clone", repository, clones[repository]]));
});

after(() => rmSync(scratch, { recursive: true, force: true }));

test("WO-080 D1 single repository: one member reaches closed from a target worktree", () => {
  const order = start("WO-303", "docs");
  close(order);
  mergeRecords(order);
});

test("WO-080 D2 cross repository: client proceeds against the pinned contract fixture while service lands first", () => {
  const service = start("WO-301", "service");
  const client = start("WO-302", "client");
  const contract = git(
    clones.client,
    "rev-parse",
    `${bases.client}:contract.json`,
  );
  assert.equal(git(client.target, "rev-parse", "HEAD:contract.json"), contract);
  assert.deepEqual(
    JSON.parse(readFileSync(join(client.target, "contract.json"), "utf8")),
    { version: 1, optionalField: true },
  );
  const stream = streamSnapshot(
    readFileSync(join(client.root, "docs/work-orders/README.md"), "utf8"),
  ).workstreams[0];
  assert.deepEqual(stream.edges, [
    { from: "WO-302", to: "WO-301", relation: "contract-fixture" },
  ]);
  close(service);
  git(clones.service, "merge", "--ff-only", "wo-301");
  mergeRecords(service);
  assert.equal(statusOf(service).phase, "closed");
  assert.equal(statusOf(client).phase, "active");
  assert.equal(git(client.target, "rev-parse", "HEAD:contract.json"), contract);
  assert.notEqual(git(clones.service, "rev-parse", "HEAD"), bases.service);
  write(
    client.target,
    "client-proof.json",
    JSON.stringify({ contract, serviceClosed: true }),
  );
  assert.deepEqual(json(client.target, "client-proof.json"), {
    contract,
    serviceClosed: true,
  });
});

test("WO-080 D4 two workstreams on one repository: an occupied worktree refuses a second writer", () => {
  const first = orders["WO-301"];
  const second = start("WO-304", "service");
  assert.notEqual(first.target, second.target);
  const edit = (target, session) => {
    const payload = {
      hook_event_name: "PreToolUse",
      session_id: session,
      cwd: target,
      tool_name: "Edit",
      tool_input: { file_path: join(target, "source.txt") },
    };
    return JSON.parse(
      ok(
        run(
          target,
          process.execPath,
          [
            join(
              target,
              ".claude/hooks/concurrent-work-requires-worktrees.mjs",
            ),
          ],
          {
            input: JSON.stringify(payload),
            env: { ...env, CLAUDE_PID: String(process.pid) },
          },
        ),
      ) || "{}",
    );
  };
  // The target hook owns its launchpad-side state lane. Acquiring through it
  // also proves the first writer was admitted before the collision.
  assert.notEqual(
    edit(first.target, "synthetic-first-stream").hookSpecificOutput
      ?.permissionDecision,
    "deny",
  );
  assert.equal(
    edit(first.target, "synthetic-second-stream").hookSpecificOutput
      ?.permissionDecision,
    "deny",
  );
  assert.notEqual(
    edit(second.target, "synthetic-second-stream").hookSpecificOutput
      ?.permissionDecision,
    "deny",
  );
});

test("WO-080 D6 session restart resumes from resume next in the target worktree under the emitted bundle", () => {
  const order = orders["WO-302"];
  resume(order, "next");
  const beforeRestart = statusOf(order);
  // Another process reconstructs selection from the target registry; no
  // conversation state or explicit work-order argument crosses the restart.
  resume(order, "next");
  const afterRestart = statusOf(order);
  assert.equal(afterRestart.workOrder, "WO-302");
  assert.equal(afterRestart.phase, beforeRestart.phase);
  assert.deepEqual(afterRestart.legalNextActions, [
    "next",
    "implementation-ready",
  ]);
  assert.ok(
    json(order.target, ".claude/target-worker-manifest.json").installed.length >
      0,
  );
  ok(
    node(
      order.root,
      "harness",
      ["check", "--target", order.target, "--runtime-root", launchpad],
      order.target,
    ),
  );
});
