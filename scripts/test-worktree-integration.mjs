import {
  excludeFixtureOwnership,
  createFixtureRoot,
  copyTemporaryMaterial as cpSync,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import { runGit, spawnGit } from "./lib/git.mjs";
import {
  json as prettyJson,
  write as put,
  sha256Hex as digest,
} from "./lib/helpers.mjs";
import nodeTest, { after } from "node:test";
import { performance } from "node:perf_hooks";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { unionFollowups } from "./lib/planning-followups.mjs";
import { linkDependencies } from "./fixtures/instance-with-history/support.mjs";
import { readControl } from "./lib/control-store.mjs";
import { executionAmendmentSource } from "./lib/plan-continuation.mjs";
import {
  integrationTestCommand,
  releaseLine,
} from "./lib/worktree-integration.mjs";

// Per-case durations from the whole-suite run alone (WO-197), rounded up to
// 0.1 s; each case checks twice its own measurement after fixture cleanup.
const repairedCaseMs = new Map([
  [
    "WO-169 a first invocation with no authored conflict generates at once",
    4100,
  ],
  [
    "WO-169 a pass whose generator fails keeps its checks and names the pending step, not a conflict",
    3200,
  ],
  [
    "WO-086 a conflicted decisions record refuses the collision's record and writes nothing",
    3300,
  ],
  [
    "WO-086 a retime that lands on a continuation is recorded once, in the stub the failed pass withheld",
    4400,
  ],
  [
    "WO-086 an unowned blocked PR directory is preserved while integration retimes",
    4600,
  ],
  [
    "WO-086 a blocked PR file preserves collision inputs for continuation",
    4600,
  ],
  [
    "WO-086 a stub blocked by a regular file retains its saved collision through continuation",
    5900,
  ],
  [
    "WO-086 a record behind a symlinked evidence directory refuses preparation and records the collision once on continuation",
    5000,
  ],
  [
    "WO-086 a record that is a directory refuses preparation and records the collision once on continuation",
    5000,
  ],
  [
    "WO-086 a stub blocked by a regular file with a newer tag during retry retains its saved collision through continuation",
    5400,
  ],
  [
    "WO-086 a tag that lands after the stub is written is recorded once, by release prepare",
    4600,
  ],
]);

// Git integration fixtures need this revision and their own branches and tag.
// Importing every unrelated release tag made each generator inspect hundreds
// of historical control snapshots; no assertion below depends on those tags.
const unregisteredCaseBounds = new Set(repairedCaseMs.keys());
const test = (name, fn) => {
  unregisteredCaseBounds.delete(name);
  return nodeTest(name, async (t) => {
    // Flush the execution-ordered start before synchronous fixture operations.
    await new Promise((resolve) => setImmediate(resolve));
    const started = performance.now();
    try {
      await fn(t);
    } finally {
      console.log(
        "PROGRESS integration case ended " +
          JSON.stringify({
            event: "end",
            name,
            file: "scripts/test-worktree-integration.mjs",
            nesting: 0,
            durationMs: performance.now() - started,
          }),
      );
      const measuredMs = repairedCaseMs.get(name);
      if (measuredMs !== undefined)
        t.after(() =>
          assert.ok(
            performance.now() - started <= 2 * measuredMs,
            `${name} stays within twice its measured ${measuredMs} ms duration`,
          ),
        );
      // Synchronous Git work otherwise holds the worker event loop across cases
      // and makes buffered TAP look like a single unexplained pause.
      await new Promise((resolve) => setImmediate(resolve));
    }
  });
};

const source = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const text = (root, path) => readFileSync(join(root, path), "utf8");
const run = (cwd, command, args) =>
  spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, DOTLN_ACCOUNT_LABEL: "" },
  });
const checked = (cwd, program, args) => {
  const result = run(cwd, program, args);
  assert.equal(
    result.status,
    0,
    `${program} ${args.join(" ")}\n${result.stdout}${result.stderr}`,
  );
  return result.stdout.trim();
};
const fixtureGitOptions = {
  maxBuffer: 32 * 1024 * 1024,
  env: { ...process.env, DOTLN_ACCOUNT_LABEL: "" },
  onFailure: (result, args) =>
    assert.equal(
      result.status,
      0,
      `git ${args.join(" ")}\n${result.stdout}${result.stderr}`,
    ),
};

test("nested material keeps linked-worktree remedies and shares Git inspection primitives", async (t) => {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-nested-material-")),
  );
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const main = join(root, "main");
  mkdirSync(main);
  const git = (cwd, ...args) =>
    runGit(
      cwd,
      [
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        ...args,
      ],
      fixtureGitOptions,
    );
  git(main, "init", "-q", "-b", "main");
  excludeFixtureOwnership(main);
  put(main, ".gitignore", ".runtime/\ndocs/control/local/\n");
  git(main, "add", ".");
  git(main, "-c", "maintenance.auto=false", "commit", "-qm", "test: fixture");
  const subject = join(root, "subject");
  git(main, "worktree", "add", "-q", "-b", "wo-999", subject);
  const linked = join(subject, ".runtime/probe");
  git(main, "worktree", "add", "-q", "--detach", linked);
  const { inventoryMaterial } = await import("./lib/worktree-material.mjs");
  const { reconcileWorktreeMaterial } =
    await import("./lib/intake-reconciliation.mjs");
  const material = inventoryMaterial(subject);
  assert.equal(material[0].linked, true);
  assert.equal(material[0].disposition, "preserve");
  assert.match(material[0].remedy, /git worktree move/);
  assert.throws(
    () =>
      reconcileWorktreeMaterial(subject, main, "WO-999", {
        dryRun: true,
        material,
      }),
    /Nested linked worktree material is preserved: \.runtime\/probe: .*git worktree move/,
  );
  assert.ok(existsSync(join(linked, ".git")));
  // These helpers are shared to keep the safety flags and NUL entry parser
  // consistent across inventory, inspection and teardown.
  for (const [file, helper] of [
    ["scripts/lib/worktree-material.mjs", "nestedGitArgs"],
    ["scripts/lib/paths.mjs", "nestedGitArgs"],
    ["scripts/lib/paths.mjs", "gitlinkPaths"],
    ["scripts/worktree.mjs", "gitlinkPaths"],
  ]) {
    const contents = text(source, file);
    assert.match(
      contents,
      new RegExp(
        `import \\{[^}]*\\b${helper}\\b[^}]*\\} from "(?:\\./lib|\\.)/git\\.mjs"`,
        "su",
      ),
    );
  }
});

test("completion names unignored scratch before tree refusal and checks whitespace with it present", async (t) => {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-completion-scratch-")),
  );
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const git = (cwd, ...args) =>
    runGit(
      cwd,
      [
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        ...args,
      ],
      fixtureGitOptions,
    );
  git(root, "init", "-q");
  excludeFixtureOwnership(root);
  put(root, "tracked.txt", "fixture\n");
  git(root, "add", ".");
  git(root, "-c", "maintenance.auto=false", "commit", "-qm", "test: fixture");
  const nested = join(root, "unignored/scratch");
  mkdirSync(nested, { recursive: true });
  git(nested, "init", "-q");
  excludeFixtureOwnership(nested);
  put(nested, "inner.txt", "inner whitespace \n");
  git(nested, "add", ".");
  git(
    nested,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "test: nested fixture",
  );
  const { checkLifecycleWhitespace, requireLifecycleEvidence } =
    await import("./lib/lifecycle-evidence.mjs");
  checkLifecycleWhitespace(root);
  assert.ok(existsSync(join(nested, ".git")));
  const warnings = [];
  const warning = t.mock.method(console, "warn", (message) =>
    warnings.push(message),
  );
  await assert.rejects(
    requireLifecycleEvidence(root, "implementation-ready", undefined, "WO-999"),
    /candidate|regular|nested/u,
  );
  warning.mock.restore();
  assert.ok(
    warnings.some((message) =>
      /Scratch repositories present: "unignored\/scratch"/u.test(message),
    ),
  );
  put(root, "fresh.txt", "outer whitespace \n");
  assert.throws(
    () => checkLifecycleWhitespace(root),
    /fresh\.txt:1: trailing whitespace/u,
  );
  assert.equal(git(root, "ls-files", "--", "fresh.txt"), "");
});
const entry = (name) => {
  const key = `decision:docs/evidence/WO-998/decisions.md#${name}`;
  return {
    id: `FUP-${createHash("sha256").update(key).digest("hex").slice(0, 16)}`,
    key,
    kind: "decision",
    revisions: [
      {
        hash: "a".repeat(64),
        ref: `docs/evidence/WO-998/decisions.md#${name}`,
        title: name,
        summary: name,
        missing: false,
      },
    ],
    dispositions: [
      {
        sourceRevision: 1,
        status: "open",
        reason: "fixture history",
        reopenWhen: null,
        targets: [],
        at: "2026-09-20T00:00:00Z",
      },
    ],
  };
};
const appendEntry = (root, name) => {
  const path = "docs/planning/followups.json";
  const register = JSON.parse(text(root, path));
  register.entries.push(entry(name));
  put(root, path, prettyJson(register));
};
const claim = (root, version) =>
  put(
    root,
    "README.md",
    text(root, "README.md").replace(
      /This source prepares DotLn `v[^`]+`/,
      `This source prepares DotLn \`${version}\``,
    ),
  );
const generatedConflicts = (root, name) => {
  const manifest = ".claude/harness-manifest.json";
  put(
    root,
    manifest,
    text(root, manifest).replace(
      /"compilerPackageVersion": "[^"]+"/,
      `"compilerPackageVersion": "${name}"`,
    ),
  );
  put(
    root,
    "packages/console/fixtures/expected/control.json",
    `${name} projection\n`,
  );
  const edition = "docs/publication/software-engineer-toc.md";
  if (existsSync(join(root, edition)))
    put(
      root,
      edition,
      text(root, edition).replace(
        /^Source lock:.*$/m,
        `Source lock: \`sha256:${(name === "local" ? "a" : "b").repeat(64)}\``,
      ),
    );
};
const event = (workOrderId, type, extra = {}) =>
  JSON.stringify({
    schemaVersion: 1,
    recordedAt: "2026-09-20T00:00:00.000Z",
    type,
    workOrderId,
    ...extra,
  }) + "\n";

const generatorLog = "docs/control/local/fixture-generator-calls.jsonl";
const generatorStages = [
  "build",
  "harness",
  "release",
  "meta",
  "work-orders",
  "publication",
  "console",
];
const generatorRecord = (stage) => `
const {appendFileSync: recordCall, mkdirSync: makeLogDirectory} = await import("node:fs");
makeLogDirectory("docs/control/local", {recursive:true});
recordCall(${JSON.stringify(generatorLog)}, JSON.stringify({stage:${JSON.stringify(stage)}, argv:process.argv.slice(2)}) + "\\n");
`;
function focusedGenerators(root) {
  for (const [script, stage, args] of [
    ["build", "build", []],
    ["harness", "harness", ["emit"]],
    ["meta", "meta", []],
    ["check-publication", "publication", ["--print-locks"]],
    ["console-fixtures", "console", ["--write"]],
  ]) {
    put(
      root,
      `scripts/${script}.mjs`,
      `import assert from "node:assert/strict";\nassert.deepEqual(process.argv.slice(2), ${JSON.stringify(args)});\n` +
        generatorRecord(stage) +
        (stage === "publication"
          ? `for (const edition of ["software-engineer-toc.md", "everyday-ai-user-toc.md"]) console.log("LOCK " + edition + ": sha256:" + "c".repeat(64));\n`
          : ""),
    );
  }
  // These algorithms remain real: release metering and the work-order index
  // have deliberate filesystem failures in the continuation cases below.
  for (const script of ["release", "work-orders"]) {
    const file = `scripts/${script}.mjs`;
    const source = text(root, file);
    const entry = "if (isMainModule(import.meta.url)) {";
    assert.equal(source.split(entry).length, 2);
    put(root, file, source.replace(entry, entry + generatorRecord(script)));
  }
}

function overlayImplementation(root) {
  for (const path of [
    "dotln.config.json",
    "scripts/work-orders.mjs",
    "scripts/worktree.mjs",
    "scripts/resume.mjs",
    "scripts/release.mjs",
    "scripts/console-fixtures.mjs",
    "scripts/bootstrap.mjs",
    "scripts/launchpad.mjs",
    "scripts/license-surfaces.mjs",
  ])
    cpSync(join(source, path), join(root, path));
  // The fixture's front page holds only what the integration reads: the one
  // generated line between the release markers that preparation rewrites and
  // the merge reconciles. The live page's prose is not this suite's subject.
  put(
    root,
    "README.md",
    "# Integration fixture\n\n<!-- DOTLN-RELEASE-BEGIN -->\nThis source prepares DotLn `v0.0.1`.\n<!-- DOTLN-RELEASE-END -->\n",
  );
  // The working-tree libraries and their compiler, Contributor, Beacon and
  // console peers travel together; static imports must not split across
  // revisions. Build output and dependency links are left out:
  // the fixture rebuilds them from its own sources. The console's generated
  // fixture outputs and their manifest name the evidence editions of the
  // revision that recorded them, so the fixture keeps its own committed copy.
  for (const path of [
    "scripts/lib",
    "packages/compiler",
    "packages/skeleton",
    "packages/beacons",
    "packages/console",
  ])
    cpSync(join(source, path), join(root, path), {
      recursive: true,
      filter: (from) =>
        !/[\\/](?:dist|node_modules)(?:[\\/]|$)|\.tsbuildinfo$|[\\/]packages[\\/]console[\\/]fixtures(?:[\\/]|$)/u.test(
          from.slice(source.length),
        ),
    });
}

let focusedSeed;
const seedState = (root) => ({
  head: runGit(root, ["rev-parse", "HEAD"], fixtureGitOptions),
  refs: runGit(
    root,
    ["for-each-ref", "--format=%(refname) %(objectname)"],
    fixtureGitOptions,
  ),
  dirty: runGit(root, ["status", "--porcelain"], fixtureGitOptions),
});
function focusedSource() {
  if (focusedSeed) {
    assert.deepEqual(seedState(focusedSeed.root), focusedSeed.state);
    return focusedSeed.root;
  }
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-integrate-seed-")),
  );
  try {
    // Recovery cases need real code and Git operations, but not the project's
    // historical objects, old decisions, or unrelated order authorities.
    // The comprehensive real-generator fixtures below still carry all of them.
    const archive = spawnGit(
      [
        "archive",
        "HEAD",
        "scripts",
        "packages",
        ".gitignore",
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "README.md",
        "CLAUDE.md",
        ".claude/harness-manifest.json",
        "docs/control/budgets.json",
        "docs/product",
        "docs/publication/software-engineer-toc.md",
        "docs/publication/everyday-ai-user-toc.md",
      ],
      {
        cwd: source,
        maxBuffer: 128 * 1024 * 1024,
      },
    );
    assert.equal(archive.status, 0, String(archive.stderr));
    const extracted = spawnSync("tar", ["-xf", "-", "-C", root], {
      input: archive.stdout,
      encoding: "utf8",
    });
    assert.equal(extracted.status, 0, extracted.stderr);
    overlayImplementation(root);
    // The archived baseline predates physical ownership markers. A seed's
    // local marker must stay out of every clone and archive it produces.
    put(root, ".gitignore", text(root, ".gitignore") + "\n.dotln-owner.json\n");
    focusedGenerators(root);
    put(
      root,
      "docs/planning/followups.json",
      prettyJson({ schemaVersion: 1, entries: [] }),
    );
    put(
      root,
      "docs/planning/sequence.md",
      "# Fixture sequence\n\n<!-- dotln-work-order-sequence:start -->\n- WO-997 — fixture peer\n\n- WO-998 — integration subject\n\n- WO-999 — fixture peer\n<!-- dotln-work-order-sequence:end -->\n",
    );
    put(root, "docs/lineage/decisions-index.md", "fixture projection\n");
    put(root, "docs/evidence/.gitkeep", "");
    runGit(
      root,
      ["init", "--quiet", "--initial-branch=main"],
      fixtureGitOptions,
    );
    excludeFixtureOwnership(root);
    for (const [key, value] of [
      ["user.name", "Fixture"],
      ["user.email", "fixture@example.invalid"],
      ["maintenance.auto", "false"],
    ])
      runGit(root, ["config", key, value], fixtureGitOptions);
    runGit(root, ["add", "-A"], fixtureGitOptions);
    runGit(
      root,
      [
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "focused integration seed",
      ],
      fixtureGitOptions,
    );
    focusedSeed = { root, state: seedState(root) };
    assert.equal(
      runGit(root, ["ls-files", ".dotln-owner.json"], fixtureGitOptions),
      "",
    );
    assert.equal(focusedSeed.state.dirty, "");
    return root;
  } catch (error) {
    rmSync(root, { recursive: true, force: true });
    throw error;
  }
}
after(() => {
  if (!focusedSeed) return;
  try {
    assert.deepEqual(seedState(focusedSeed.root), focusedSeed.state);
  } finally {
    rmSync(focusedSeed.root, { recursive: true, force: true });
  }
});

function fixture(
  t,
  {
    reviewed = false,
    active = false,
    third = "active",
    authored = true,
    generators = "real",
    kit = false,
    editions = true,
  } = {},
) {
  const temporary = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-integrate-test-")),
  );
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  const origin = join(temporary, "origin.git"),
    main = join(temporary, "main"),
    subject = join(temporary, "wo998");
  const cloneSource = generators === "focused" ? focusedSource() : source;
  // Clone only Git's tracked history. No intake, credentials, ignored runtime
  // state or real remote is copied; every push below goes to this local bare repo.
  checked(temporary, "git", [
    "-c",
    "maintenance.auto=false",
    "clone",
    "--bare",
    "--no-tags",
    "--single-branch",
    "--no-hardlinks",
    "--quiet",
    cloneSource,
    origin,
  ]);
  runGit(origin, ["config", "maintenance.auto", "false"], fixtureGitOptions);
  runGit(origin, ["config", "receive.autogc", "false"], fixtureGitOptions);
  // The fixture's main is the source's own committed revision, not its moving
  // main, so the working-tree overlays below and the committed peers they
  // import come from one revision (WO-115 D015).
  runGit(
    origin,
    [
      "update-ref",
      "refs/heads/main",
      runGit(cloneSource, ["rev-parse", "HEAD"], fixtureGitOptions),
    ],
    fixtureGitOptions,
  );
  checked(temporary, "git", [
    "-c",
    "maintenance.auto=false",
    "clone",
    "--no-tags",
    "--single-branch",
    "--no-hardlinks",
    "--quiet",
    "--branch",
    "main",
    origin,
    main,
  ]);
  for (const [key, value] of [
    ["user.name", "Fixture"],
    ["user.email", "fixture@example.invalid"],
    ["maintenance.auto", "false"],
  ])
    runGit(main, ["config", key, value], fixtureGitOptions);
  if (generators === "real") {
    overlayImplementation(main);
    // Frozen product data bridges the old clone to the reviewed declaration
    // check without reading current coordination records from the source tree.
    const bridge = JSON.parse(
      text(
        source,
        "scripts/fixtures/worktree-integration/wo193-preflight-bridge.json",
      ),
    );
    assert.equal(bridge.schemaVersion, 1);
    const priorLog = text(main, bridge.planningLogPath);
    const amendment = JSON.parse(bridge.amendmentLine);
    assert.ok(
      bridge.amendmentLine.endsWith("\n") &&
        !bridge.amendmentLine.slice(0, -1).includes("\n"),
      "the bridge carries one exact canonical amendment line",
    );
    if (!priorLog.split("\n").includes(bridge.amendmentLine.slice(0, -1))) {
      assert.equal(
        digest(priorLog),
        bridge.priorLogSha256,
        "the amendment follows the fixture's byte-exact planning history",
      );
      const filedOrder = text(main, bridge.orderPath);
      assert.equal(
        filedOrder.split(bridge.oldPreflight).length - 1,
        1,
        "the cloned order has exactly one frozen old Preflight field",
      );
      const repairedOrder = filedOrder.replace(
        bridge.oldPreflight,
        bridge.newPreflight,
      );
      assert.equal(
        filedOrder.replace(bridge.oldPreflight, ""),
        repairedOrder.replace(bridge.newPreflight, ""),
        "the bridge changes no order bytes outside Preflight",
      );
      assert.equal(
        `sha256:${digest(executionAmendmentSource(filedOrder))}`,
        amendment.sourceOrderHash,
      );
      const repairedSource = executionAmendmentSource(
        repairedOrder,
        filedOrder,
      );
      assert.equal(`sha256:${digest(repairedSource)}`, amendment.orderHash);
      assert.equal(repairedSource.length, amendment.orderLength);
      const decisions = [
        ...bridge.decisionText.matchAll(/^```json\n([\s\S]*?)^```/gmu),
      ];
      assert.equal(decisions.length, 1);
      const decision = JSON.parse(decisions[0][1]);
      assert.equal(decision.id, amendment.decisionId);
      const stableDecision = JSON.stringify(decision, (_key, value) =>
        value && typeof value === "object" && !Array.isArray(value)
          ? Object.fromEntries(
              Object.keys(value)
                .sort()
                .map((key) => [key, value[key]]),
            )
          : value,
      );
      assert.equal(`sha256:${digest(stableDecision)}`, amendment.decisionHash);
      put(main, bridge.orderPath, repairedOrder);
      put(main, bridge.decisionPath, bridge.decisionText);
      put(main, bridge.planningLogPath, priorLog + bridge.amendmentLine);
    }
  }
  if (kit) {
    rmSync(join(main, "tsconfig.json"), { force: true });
    for (const name of readdirSync(join(main, "packages")))
      rmSync(join(main, "packages", name, "tsconfig.json"), { force: true });
    put(main, "KIT-MANIFEST.json", "{}\n");
    put(
      main,
      "scripts/launchpad.mjs",
      `import assert from "node:assert/strict";\nassert.deepEqual(process.argv.slice(2), ["verify"]);\n${generatorRecord("kit-verify")}`,
    );
  }
  if (editions !== true)
    for (const name of editions === false
      ? ["software-engineer-toc.md", "everyday-ai-user-toc.md"]
      : ["everyday-ai-user-toc.md"])
      rmSync(join(main, "docs/publication", name), { force: true });
  for (const id of ["WO-997", "WO-998", "WO-999"]) {
    const path = `docs/work-orders/${id}-fixture.md`;
    put(
      main,
      path,
      `# ${id} — integration fixture (v9000.0.1)\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n**Release classification:** patch. Fixture.\n\n**Objective:** Preserve integration.\n\n**Non-goals:** No publication.\n`,
    );
    put(
      main,
      `docs/control/orders/${id}.jsonl`,
      event(id, "WorkOrderActivated", { workOrderPath: path }),
    );
  }
  if (!active)
    put(
      main,
      "docs/control/orders/WO-998.jsonl",
      text(main, "docs/control/orders/WO-998.jsonl") +
        event("WO-998", "ImplementationReady") +
        event("WO-998", "VerificationRequested", {
          verificationId: "VER-001",
          reportPath: "docs/verifications/WO-998/VER-001.md",
        }) +
        event("WO-998", "VerificationCompleted", {
          verificationId: "VER-001",
          verdict: reviewed ? "pass" : "fail",
        }) +
        (reviewed
          ? event("WO-998", "FinalReviewRequested", {
              finalReviewId: "FINAL-001",
              reportPath: "docs/final-reviews/WO-998/FINAL-001.md",
            })
          : event("WO-998", "RepairRequested")),
    );
  if (third === "verifying")
    put(
      main,
      "docs/control/orders/WO-997.jsonl",
      text(main, "docs/control/orders/WO-997.jsonl") +
        event("WO-997", "ImplementationReady") +
        event("WO-997", "VerificationRequested", {
          verificationId: "VER-001",
          reportPath: "docs/verifications/WO-997/VER-001.md",
        }),
    );
  put(
    main,
    "README.md",
    text(main, "README.md").replace(
      /This source prepares DotLn `v[^`]+`/,
      "This source prepares DotLn `v9000.0.0`",
    ),
  );
  put(main, "authored-fixture.md", "base intent\n");
  runGit(main, ["add", "-A"], fixtureGitOptions);
  runGit(
    main,
    [
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "integration fixture base",
    ],
    fixtureGitOptions,
  );
  runGit(main, ["push", "-q", "origin", "main"], fixtureGitOptions);
  runGit(
    main,
    ["worktree", "add", "--quiet", "-b", "wo-998", subject, "main"],
    fixtureGitOptions,
  );
  // Dependencies are read-only links; workspace links point into this fixture.
  mkdirSync(join(subject, "node_modules/@dotln"), { recursive: true });
  for (const name of [
    "typescript",
    "@types",
    "prettier",
    "playwright",
    "playwright-core",
  ])
    symlinkSync(
      join(source, "node_modules", name),
      join(subject, "node_modules", name),
    );
  for (const name of [
    "browser-evidence",
    "compiler",
    "kernel",
    "skeleton",
    "console",
  ]) {
    symlinkSync(
      join(subject, "packages", name),
      join(subject, "node_modules/@dotln", name),
    );
    cpSync(
      join(source, "packages", name, "dist"),
      join(subject, "packages", name, "dist"),
      { recursive: true },
    );
  }
  symlinkSync(
    join(subject, "packages/beacons"),
    join(subject, "node_modules/@dotln/beacons"),
  );
  const before = runGit(subject, ["rev-parse", "HEAD"], fixtureGitOptions);
  if (reviewed) {
    claim(subject, "v9000.0.1");
    generatedConflicts(subject, "local");
    if (authored)
      put(subject, "authored-fixture.md", "reviewed local intent\n");
    put(subject, "docs/lineage/decisions-index.md", "reviewed projection\n");
    appendEntry(subject, "reviewed-local");
    runGit(subject, ["add", "-A"], fixtureGitOptions);
    runGit(
      subject,
      [
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "reviewed fixture work",
      ],
      fixtureGitOptions,
    );
  }
  const reviewedHead = runGit(
    subject,
    ["rev-parse", "HEAD"],
    fixtureGitOptions,
  );
  // Main represents the already merged sibling, and publishes a colliding
  // local tag. No phase of the unrelated third order is consulted.
  put(main, "authored-fixture.md", "upstream intent\n");
  claim(main, "v9000.0.2");
  generatedConflicts(main, "upstream");
  put(main, "docs/lineage/decisions-index.md", "upstream projection\n");
  put(
    main,
    "packages/console/fixtures/expected/control.json",
    "upstream projection\n",
  );
  put(
    main,
    "CLAUDE.md",
    text(main, "CLAUDE.md").replace(
      /<!-- dotln-harness:start -->[\s\S]*?<!-- dotln-harness:end -->/,
      "<!-- dotln-harness:start -->\nupstream generated fragment\n<!-- dotln-harness:end -->",
    ),
  );
  appendEntry(main, "upstream");
  put(
    main,
    "scripts/lib/process-budget.mjs",
    text(main, "scripts/lib/process-budget.mjs") +
      "\n// fixture machinery change\n",
  );
  runGit(main, ["add", "-A"], fixtureGitOptions);
  runGit(
    main,
    ["-c", "maintenance.auto=false", "commit", "-qm", "merged sibling fixture"],
    fixtureGitOptions,
  );
  runGit(main, ["tag", "v9000.0.1"], fixtureGitOptions);
  runGit(
    main,
    ["push", "-q", "origin", "main", "refs/tags/v9000.0.1"],
    fixtureGitOptions,
  );
  const upstream = runGit(main, ["rev-parse", "HEAD"], fixtureGitOptions);
  if (!reviewed) {
    claim(subject, "v9000.0.1");
    generatedConflicts(subject, "local");
    if (authored) put(subject, "authored-fixture.md", "local intent\n");
    put(subject, "docs/lineage/decisions-index.md", "local projection\n");
    put(
      subject,
      "packages/console/fixtures/expected/control.json",
      "local projection\n",
    );
    put(
      subject,
      "CLAUDE.md",
      text(subject, "CLAUDE.md").replace(
        /<!-- dotln-harness:start -->[\s\S]*?<!-- dotln-harness:end -->/,
        "<!-- dotln-harness:start -->\nlocal generated fragment\n<!-- dotln-harness:end -->",
      ),
    );
    appendEntry(subject, "local");
  }
  put(subject, "untracked-fixture.md", "retained untracked bytes\n");
  const control = Object.fromEntries(readControl(subject).sources);
  const calls = () =>
    existsSync(join(subject, generatorLog))
      ? text(subject, generatorLog)
          .trim()
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line))
      : [];
  const invokeStages = (
    expected,
    args,
    releaseArgs = ["prepare", "--local", "--integration"],
  ) => {
    const before = calls().length;
    const result = run(subject, process.execPath, [
      "scripts/worktree.mjs",
      "integrate",
      "WO-998",
      ...args,
    ]);
    if (generators === "focused") {
      const actual = calls().slice(before);
      assert.deepEqual(
        actual.map((row) => row.stage),
        expected,
        result.stdout + result.stderr,
      );
      for (const row of actual) {
        if (row.stage === "work-orders") assert.deepEqual(row.argv, ["index"]);
        if (row.stage === "release") assert.deepEqual(row.argv, releaseArgs);
      }
    }
    return result;
  };
  const stages = generatorStages
    .map((stage) => (kit && stage === "build" ? "kit-verify" : stage))
    .filter((stage) => editions !== false || stage !== "publication");
  const invoke = (...args) => invokeStages(stages, args);
  return {
    temporary,
    origin,
    main,
    subject,
    before,
    reviewedHead,
    upstream,
    control,
    invoke,
    invokeStages,
    generatorStages: stages,
    continueWithStub: (...args) =>
      invokeStages(stages, ["--continue", ...args], ["prepare", "--local"]),
    invokeWithoutRelease: (...args) =>
      invokeStages(
        generatorStages.filter((stage) => stage !== "release"),
        args,
      ),
  };
}

test("instance integration verifies its installed runtime and needs no undeclared publication editions", (t) => {
  const f = fixture(t, {
    generators: "focused",
    authored: false,
    kit: true,
    editions: false,
  });
  const result = f.invoke();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const receipt = JSON.parse(
    text(f.subject, "docs/control/local/integration.json"),
  );
  assert.deepEqual(receipt.pending, []);
  assert.match(result.stdout, /Regenerated: runtime/);
  assert.doesNotMatch(result.stdout, /publication locks/);
  assert.equal(existsSync(join(f.subject, "tsconfig.json")), false);
  assert.equal(
    existsSync(join(f.subject, "docs/publication/software-engineer-toc.md")),
    false,
  );
});

test("instance integration retains a pending refusal for a partially declared publication edition", (t) => {
  const f = fixture(t, {
    generators: "focused",
    authored: false,
    kit: true,
    editions: "partial",
  });
  const result = f.invoke();
  assert.equal(result.status, 1, result.stdout + result.stderr);
  const receipt = JSON.parse(
    text(f.subject, "docs/control/local/integration.json"),
  );
  assert.ok(
    receipt.pending.some((line) => line.startsWith("publication locks:")),
    result.stdout + result.stderr,
  );
  assert.ok(!receipt.pending.some((line) => line.startsWith("runtime:")));
});

test("instance integration keeps dangling declared surfaces pending", (t) => {
  const f = fixture(t, {
    generators: "focused",
    authored: false,
    kit: true,
    editions: "partial",
  });
  assert.equal(f.invoke().status, 1);
  for (const [path, target] of [
    ["docs/publication/software-engineer-toc.md", "missing-edition.md"],
    ["docs/siblings/siblings.json", "missing-siblings.json"],
    ["packages/console/fixtures", "missing-fixtures"],
  ]) {
    rmSync(join(f.subject, path), { recursive: true, force: true });
    mkdirSync(dirname(join(f.subject, path)), { recursive: true });
    symlinkSync(target, join(f.subject, path));
  }
  const result = run(f.subject, process.execPath, [
    "scripts/worktree.mjs",
    "integrate",
    "WO-998",
    "--continue",
  ]);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  const receipt = JSON.parse(
    text(f.subject, "docs/control/local/integration.json"),
  );
  for (const label of [
    "publication locks",
    "sibling registry",
    "selected console fixtures",
  ])
    assert.ok(
      receipt.pending.some((line) => line.startsWith(`${label}:`)),
      JSON.stringify(receipt.pending),
    );
  assert.ok(!receipt.pending.join("\n").includes(f.subject));
  assert.equal(
    existsSync(join(f.subject, "packages/console/missing-fixtures")),
    false,
  );
});

for (const obstacle of ["regular file", "alias loop"])
  test(`instance integration retains optional declaration failures behind a ${obstacle}`, (t) => {
    const f = fixture(t, {
      generators: "focused",
      authored: false,
      kit: true,
      editions: "partial",
    });
    const first = f.invoke();
    assert.equal(first.status, 1, first.stdout + first.stderr);
    assert.match(first.stdout, /Pending: publication locks:/);
    const roots = ["docs/siblings", "docs/publication"];
    const edition = text(
      f.subject,
      "docs/publication/software-engineer-toc.md",
    );
    for (const path of roots) {
      rmSync(join(f.subject, path), { recursive: true, force: true });
      if (obstacle === "regular file") put(f.subject, path, "blocked\n");
      else symlinkSync(path.split("/").at(-1), join(f.subject, path));
    }
    const refused = run(f.subject, process.execPath, [
      "scripts/worktree.mjs",
      "integrate",
      "WO-998",
      "--continue",
    ]);
    assert.equal(refused.status, 1, refused.stdout + refused.stderr);
    const receiptPath = "docs/control/local/integration.json";
    const receipt = JSON.parse(text(f.subject, receiptPath));
    assert.equal(receipt.complete, false, refused.stdout + refused.stderr);
    for (const label of ["sibling registry", "publication locks"])
      assert.ok(
        receipt.pending.some(
          (line) =>
            line.startsWith(`${label}:`) &&
            line.includes(obstacle === "regular file" ? "ENOTDIR" : "ELOOP"),
        ),
        JSON.stringify(receipt.pending),
      );
    assert.ok(!receipt.pending.join("\n").includes(f.subject));
    for (const path of roots) rmSync(join(f.subject, path));
    for (const name of ["software-engineer-toc.md", "everyday-ai-user-toc.md"])
      put(f.subject, `docs/publication/${name}`, edition);
    const continued = f.continueWithStub();
    assert.equal(continued.status, 0, continued.stdout + continued.stderr);
    assert.equal(JSON.parse(text(f.subject, receiptPath)).complete, true);
  });

for (const reviewed of [false, true])
  test(`real Git ${reviewed ? "reviewed merge" : "fast-forward"} preserves recovery, histories and authored conflicts with real generators`, (t) => {
    const f = fixture(t, {
      reviewed,
      third: reviewed ? "verifying" : "active",
    });
    const first = f.invoke();
    assert.equal(first.status, 1, first.stdout + first.stderr);
    assert.match(first.stdout, /Authored conflicts: 'authored-fixture.md'/);
    const receipt = JSON.parse(
      text(f.subject, "docs/control/local/integration.json"),
    );
    assert.ok(
      receipt.checkpointRef.startsWith("refs/dotln/checkpoint/WO-998/"),
    );
    assert.equal(
      runGit(
        f.subject,
        ["show", `${receipt.checkpointRef}:untracked-fixture.md`],
        fixtureGitOptions,
      ),
      "retained untracked bytes",
    );
    assert.ok(
      runGit(f.subject, ["stash", "list"], fixtureGitOptions).includes(
        "WO-998 integrate",
      ),
    );
    assert.equal(
      runGit(f.subject, ["rev-parse", "refs/stash"], fixtureGitOptions),
      receipt.stash,
    );
    assert.equal(
      runGit(f.subject, ["rev-parse", "HEAD"], fixtureGitOptions),
      reviewed ? f.reviewedHead : f.upstream,
    );
    assert.match(
      text(f.subject, "authored-fixture.md"),
      /<<<<<<<.*\n[\s\S]*=======\n[\s\S]*>>>>>>>/,
    );
    // While an authored conflict remains no generator runs (WO-169 item 4),
    // so no `Regenerated:` line is printed over conflict markers (WO-138 D011).
    assert.doesNotMatch(first.stdout, /Regenerated:/);
    assert.deepEqual(
      receipt.pending,
      [
        reviewed
          ? "stash apply and generation await authored merge resolution"
          : "generation awaits authored conflict resolution and --continue",
      ],
      first.stdout,
    );
    assert.match(first.stdout, new RegExp(`Pending: ${receipt.pending[0]}`));
    // The checks and the draft decision describe the generated tree, so the
    // completing pass prints them.
    assert.doesNotMatch(first.stdout, /Affected checks|Reviewer: complete/);
    assert.match(
      first.stdout,
      /--continue; the completing pass prints the affected checks and writes the draft decision\. No lifecycle event or acceptance result was appended\./,
    );
    assert.doesNotMatch(
      text(f.subject, "docs/work-orders/WO-998-fixture.md"),
      /v9000\.0\.2/,
      "release preparation waits for the authored resolution",
    );
    assert.ok(
      !existsSync(join(f.subject, "docs/evidence/WO-998/decisions.md")) ||
        !text(f.subject, "docs/evidence/WO-998/decisions.md").includes(
          receipt.checkpointRef,
        ),
      "the integration stub waits for the authored resolution",
    );
    put(
      f.subject,
      "authored-fixture.md",
      "reviewer retained local and upstream intent\n",
    );
    runGit(f.subject, ["add", "authored-fixture.md"], fixtureGitOptions);
    const hookDir = join(dirname(f.subject), "failing-hooks");
    mkdirSync(hookDir, { recursive: true });
    for (const name of ["pre-commit", "prepare-commit-msg", "post-commit"])
      writeFileSync(
        join(hookDir, name),
        `#!/bin/sh\nprintf invoked > '${join(dirname(f.subject), "hook-called")}'\nexit 1\n`,
        { mode: 0o755 },
      );
    runGit(f.subject, ["config", "core.hooksPath", hookDir], fixtureGitOptions);
    const decisionsFile = join(f.subject, "docs/evidence/WO-998/decisions.md");
    const decisionsIn = () =>
      existsSync(decisionsFile)
        ? [
            ...readFileSync(decisionsFile, "utf8").matchAll(
              /```json\n([\s\S]*?)\n```/g,
            ),
          ].map((match) => JSON.parse(match[1]))
        : [];
    const decisionsBefore = decisionsIn().length;
    const continued = f.invoke("--continue");
    assert.ok(
      !existsSync(join(dirname(f.subject), "hook-called")),
      "helper disables all commit hooks",
    );
    runGit(
      f.subject,
      ["config", "--unset", "core.hooksPath"],
      fixtureGitOptions,
    );
    assert.equal(continued.status, 0, continued.stdout + continued.stderr);
    const after = JSON.parse(
      text(f.subject, "docs/control/local/integration.json"),
    );
    assert.equal(after.complete, true);
    assert.equal(after.phase, reviewed ? "final-review" : "repairing");
    const decision = [
      ...text(f.subject, "docs/evidence/WO-998/decisions.md").matchAll(
        /```json\n([\s\S]*?)\n```/g,
      ),
    ]
      .map((match) => JSON.parse(match[1]))
      .find((row) => row.evidence?.includes(after.checkpointRef));
    assert.equal(
      decision?.dispatch,
      `resume: ${reviewed ? "final review" : "fix"}; worktree integrate WO-998`,
    );
    assert.equal(after.preservationCommit, after.checkpointSha);
    assert.equal(
      after.checkpointRef,
      receipt.checkpointRef,
      "continuation must not create another checkpoint",
    );
    assert.equal(after.stashDropped, receipt.stash);
    assert.equal(runGit(f.subject, ["stash", "list"], fixtureGitOptions), "");
    assert.equal(
      text(f.subject, "untracked-fixture.md"),
      "retained untracked bytes\n",
    );
    const register = JSON.parse(
      text(f.subject, "docs/planning/followups.json"),
    );
    for (const name of [reviewed ? "reviewed-local" : "local", "upstream"])
      assert.deepEqual(
        register.entries.find((row) => row.id === entry(name).id),
        entry(name),
      );
    assert.deepEqual(
      Object.fromEntries(readControl(f.subject).sources),
      f.control,
    );
    assert.match(
      continued.stdout,
      /Affected checks \(not run\):\n  npm test -- --review/,
    );
    assert.match(
      continued.stdout,
      /Reviewer: complete the integration decision/,
    );
    assert.match(continued.stdout, /npm run publication:check/);
    assert.match(continued.stdout, /node scripts\/harness.mjs check/);
    checked(f.subject, process.execPath, ["scripts/harness.mjs", "check"]);
    checked(f.subject, process.execPath, [
      "scripts/console-fixtures.mjs",
      "--check",
    ]);
    checked(f.subject, process.execPath, ["scripts/check-publication.mjs"]);
    checked(f.subject, process.execPath, [
      "scripts/work-orders.mjs",
      "index",
      "--check",
    ]);
    if (reviewed) {
      assert.equal(
        runGit(f.subject, ["rev-parse", "HEAD"], fixtureGitOptions),
        after.mergeCommit,
        "helper records its merge commit",
      );
      assert.equal(
        runGit(
          f.subject,
          ["show", "-s", "--format=%P", after.mergeCommit],
          fixtureGitOptions,
        ),
        `${f.reviewedHead} ${f.upstream}`,
      );
      assert.notEqual(
        run(f.subject, "git", ["rev-parse", "--verify", "MERGE_HEAD"]).status,
        0,
      );
    }
    // Both cases assert the retime and the stub here: in the reviewed case the
    // generators only run after the authored resolution, so the first invoke
    // cannot witness them. Printed values are read back, never asserted twice.
    const heading = text(f.subject, "docs/work-orders/WO-998-fixture.md").split(
      "\n",
    )[0];
    assert.match(heading, /v9000\.0\.2/, "the colliding target is retimed");
    assert.match(
      text(f.subject, "docs/evidence/WO-998/decisions.md"),
      /Carried-forward claims: \*\*reviewer to complete/,
    );
    assert.match(continued.stdout, /Regenerated: integration decision stub/);
    // The record holds the release message as one line closed by one full
    // stop, and still names the conflict the first pass observed.
    const stub = text(f.subject, "docs/evidence/WO-998/decisions.md").split(
      "\n",
    );
    const release = stub.findIndex((line) =>
      line.startsWith("Release preparation: "),
    );
    assert.match(
      stub[release],
      /^Release preparation: Retimed WO-998: v9000\.0\.1 → v9000\.0\.2 above the observed release baseline v9000\.0\.1\. Files changed: [^.].*\. Tag observation: local snapshot only\.$/,
    );
    assert.doesNotMatch(stub[release], /\.\./);
    // The collision is recorded exactly once (WO-086), as this integration
    // decision with the superseded and new targets and the baseline; release
    // preparation appended none of its own and changed no product document,
    // and the README only in its version claim.
    const appended = decisionsIn().slice(decisionsBefore);
    assert.equal(appended.length, 1, JSON.stringify(appended));
    assert.ok(appended[0].evidence.includes(after.checkpointRef));
    assert.ok(
      appended[0].evidence.includes(
        `release preparation: ${stub[release].slice("Release preparation: ".length)}`,
      ),
      JSON.stringify(appended[0].evidence),
    );
    assert.equal(
      runGit(
        f.subject,
        ["diff", "--name-only", f.upstream, "--", "docs/product"],
        fixtureGitOptions,
      ),
      "",
      "no product document changes",
    );
    for (const line of runGit(
      f.subject,
      ["diff", "--unified=0", f.upstream, "--", "README.md"],
      fixtureGitOptions,
    )
      .split("\n")
      .filter((row) => /^[-+](?![-+]{2} )/.test(row)))
      assert.match(
        line,
        /^[-+]This source prepares DotLn `v\d+\.\d+\.\d+`\.$/,
        "the README changes, if at all, only in its version claim",
      );
    assert.match(stub[release + 1], /^Carried-forward claims: /);
    assert.match(
      stub[release + 2],
      /^Authored conflicts observed: authored-fixture\.md\.$/,
    );
    console.log(
      JSON.stringify({
        case: reviewed ? "reviewed merge" : "fast-forward",
        checkpoint: after.checkpointRef,
        droppedStash: after.stashDropped,
        retimed: heading.match(/v\d+\.\d+\.\d+/)[0],
        unchangedControl: true,
        realGenerators: true,
      }),
    );
  });

test("three required refusals leave the tree, index, HEAD and recovery refs unchanged", (t) => {
  const f = fixture(t);
  const snapshot = () => ({
    head: runGit(f.subject, ["rev-parse", "HEAD"], fixtureGitOptions),
    diff: runGit(f.subject, ["diff", "--binary", "HEAD"], fixtureGitOptions),
    status: runGit(
      f.subject,
      ["status", "--porcelain", "--untracked-files=all"],
      fixtureGitOptions,
    ),
    refs: runGit(
      f.subject,
      [
        "for-each-ref",
        "--format=%(refname) %(objectname)",
        "refs/dotln",
        "refs/stash",
      ],
      fixtureGitOptions,
    ),
    index: readFileSync(
      runGit(
        f.subject,
        ["rev-parse", "--git-path", "index"],
        fixtureGitOptions,
      ),
    ),
  });
  const original = snapshot();
  const mismatch = run(f.subject, process.execPath, [
    "scripts/worktree.mjs",
    "integrate",
    "WO-999",
  ]);
  assert.notEqual(mismatch.status, 0);
  assert.match(mismatch.stderr, /matching wo-NNN/);
  assert.deepEqual(snapshot(), original);
  runGit(
    f.subject,
    ["remote", "set-url", "origin", join(f.temporary, "absent.git")],
    fixtureGitOptions,
  );
  const missing = f.invoke();
  assert.notEqual(missing.status, 0);
  assert.deepEqual(snapshot(), original);
  runGit(
    f.subject,
    ["remote", "set-url", "origin", f.origin],
    fixtureGitOptions,
  );
  put(f.subject, "docs/intake/fixture.md", "private fixture intake\n");
  const intake = f.invoke();
  assert.notEqual(intake.status, 0);
  assert.match(intake.stderr, /intake-backup/);
  assert.deepEqual(snapshot(), original);
  assert.equal(
    text(f.subject, "docs/intake/fixture.md"),
    "private fixture intake\n",
  );
  checked(f.subject, "zip", [
    "-q",
    join(f.temporary, "named-backup.zip"),
    "docs/intake/fixture.md",
  ]);
  put(f.subject, "docs/intake/fixture.md", "changed after backup\n");
  const stale = f.invoke(
    "--intake-backup",
    join(f.temporary, "named-backup.zip"),
  );
  assert.notEqual(stale.status, 0);
  assert.match(stale.stderr, /does not preserve/);
  assert.deepEqual(snapshot(), original);
  put(f.subject, "docs/intake/fixture.md", "private fixture intake\n");
  const admitted = f.invoke(
    "--intake-backup",
    join(f.temporary, "named-backup.zip"),
  );
  assert.match(
    admitted.stdout,
    /Checkpoint:/,
    admitted.stdout + admitted.stderr,
  );
  assert.equal(
    text(f.subject, "docs/intake/fixture.md"),
    "private fixture intake\n",
  );
});

test("an intent-to-add entry is refused before any write, and a failed stash leaves no pending receipt", (t) => {
  const f = fixture(t);
  const receiptPath = join(f.subject, "docs/control/local/integration.json");
  const snapshot = () => ({
    head: runGit(f.subject, ["rev-parse", "HEAD"], fixtureGitOptions),
    stage: runGit(f.subject, ["ls-files", "--stage"], fixtureGitOptions),
    status: runGit(
      f.subject,
      ["status", "--porcelain", "--untracked-files=all"],
      fixtureGitOptions,
    ),
    refs: runGit(
      f.subject,
      [
        "for-each-ref",
        "--format=%(refname) %(objectname)",
        "refs/dotln",
        "refs/stash",
      ],
      fixtureGitOptions,
    ),
    stashes: runGit(f.subject, ["stash", "list"], fixtureGitOptions),
    receipt: existsSync(receiptPath),
  });
  put(f.subject, "intent to add.md", "marked with git add -N\n");
  runGit(f.subject, ["add", "-N", "intent to add.md"], fixtureGitOptions);
  const original = snapshot();
  const refused = f.invoke();
  assert.notEqual(refused.status, 0, refused.stdout + refused.stderr);
  assert.match(refused.stderr, /intent-to-add/);
  assert.match(refused.stderr, /'intent to add\.md'/);
  assert.match(refused.stderr, /git add -- 'intent to add\.md'/);
  assert.deepEqual(snapshot(), original);
  assert.equal(original.receipt, false);
  assert.equal(original.stashes, "");
  runGit(f.subject, ["add", "--", "intent to add.md"], fixtureGitOptions);
  // Any other failure of the stash push (here a held index lock) happens after
  // the checkpoint; nothing is stashed, so no pending receipt may remain.
  const lock = resolve(
    f.subject,
    runGit(
      f.subject,
      ["rev-parse", "--git-path", "index.lock"],
      fixtureGitOptions,
    ),
  );
  writeFileSync(lock, "");
  const staged = snapshot();
  const failed = f.invoke();
  rmSync(lock);
  assert.notEqual(failed.status, 0, failed.stdout + failed.stderr);
  assert.match(failed.stderr, /index\.lock/);
  assert.equal(existsSync(receiptPath), false);
  assert.equal(runGit(f.subject, ["stash", "list"], fixtureGitOptions), "");
  assert.equal(
    runGit(f.subject, ["rev-parse", "HEAD"], fixtureGitOptions),
    staged.head,
  );
  assert.equal(
    runGit(f.subject, ["ls-files", "--stage"], fixtureGitOptions),
    staged.stage,
  );
  const fresh = f.invoke();
  assert.equal(fresh.status, 1, fresh.stdout + fresh.stderr);
  assert.match(fresh.stdout, /Authored conflicts: 'authored-fixture.md'/);
  assert.equal(text(f.subject, "intent to add.md"), "marked with git add -N\n");
});

test("a stash Git stores and then fails to finish resumes with --continue; --continue refuses intent-to-add entries", (t) => {
  const f = fixture(t);
  const receiptPath = join(f.subject, "docs/control/local/integration.json");
  // Git stores the stash and then cannot remove an untracked file inside a
  // read-only directory, so the push exits non-zero after moving the work.
  put(f.subject, "locked/untracked.md", "locked untracked bytes\n");
  chmodSync(join(f.subject, "locked"), 0o555);
  t.after(() => {
    if (existsSync(join(f.subject, "locked")))
      chmodSync(join(f.subject, "locked"), 0o755);
  });
  const head = runGit(f.subject, ["rev-parse", "HEAD"], fixtureGitOptions);
  const failed = f.invoke();
  assert.notEqual(failed.status, 0, failed.stdout + failed.stderr);
  assert.match(
    failed.stderr,
    /stash push stored ([0-9a-f]{40}) and then failed; nothing was merged/,
  );
  const retained = /stash push stored ([0-9a-f]{40})/.exec(failed.stderr)[1];
  assert.match(failed.stderr, /--continue once the tree is clean/);
  const pending = JSON.parse(readFileSync(receiptPath, "utf8"));
  assert.equal(pending.stage, "preserved");
  assert.equal(pending.stash, retained);
  assert.equal(
    runGit(f.subject, ["rev-parse", "HEAD"], fixtureGitOptions),
    head,
  );
  assert.equal(
    runGit(
      f.subject,
      ["show", `${retained}^3:locked/untracked.md`],
      fixtureGitOptions,
    ),
    "locked untracked bytes",
  );
  // A dirty tree cannot resume: the retained stash already holds the work.
  chmodSync(join(f.subject, "locked"), 0o755);
  const dirty = f.invoke("--continue");
  assert.notEqual(dirty.status, 0);
  assert.match(
    dirty.stderr,
    /holds this integration's work but the tree is not clean/,
  );
  runGit(f.subject, ["reset", "-q", "--hard", "HEAD"], fixtureGitOptions);
  runGit(f.subject, ["clean", "-q", "-f", "-d"], fixtureGitOptions);
  // An intent-to-add entry is refused at --continue before anything moves.
  put(f.subject, "late.md", "marked late\n");
  runGit(f.subject, ["add", "-N", "late.md"], fixtureGitOptions);
  const receiptBytes = readFileSync(receiptPath);
  const marked = f.invoke("--continue");
  assert.notEqual(marked.status, 0);
  assert.match(
    marked.stderr,
    /refuses intent-to-add entries.*'late\.md'.*--continue again/,
  );
  assert.deepEqual(readFileSync(receiptPath), receiptBytes);
  runGit(f.subject, ["rm", "-q", "--cached", "late.md"], fixtureGitOptions);
  rmSync(join(f.subject, "late.md"));
  // Simulate a crash after Git saved the named stash but before the helper
  // recorded its SHA (WO-160). The tree is clean and --continue must adopt it.
  const stranded = JSON.parse(readFileSync(receiptPath, "utf8"));
  stranded.stash = null;
  writeFileSync(receiptPath, JSON.stringify(stranded));
  const resumed = f.invoke("--continue");
  assert.equal(resumed.status, 1, resumed.stdout + resumed.stderr);
  assert.match(resumed.stdout, /Authored conflicts: 'authored-fixture.md'/);
  const merged = JSON.parse(readFileSync(receiptPath, "utf8"));
  assert.equal(merged.stash, retained);
  assert.notEqual(merged.stage, "preserved");
});

test("a later stash failure with nothing stashed restores the completed receipt it replaced", (t) => {
  const f = fixture(t);
  const receiptPath = join(f.subject, "docs/control/local/integration.json");
  const first = f.invoke();
  assert.equal(first.status, 1, first.stdout + first.stderr);
  put(
    f.subject,
    "untracked-fixture.md",
    readFileSync(join(f.subject, "untracked-fixture.md"), "utf8"),
  );
  put(f.subject, "authored-fixture.md", "explicitly combined intent\n");
  runGit(f.subject, ["add", "authored-fixture.md"], fixtureGitOptions);
  const done = f.invoke("--continue");
  assert.equal(done.status, 0, done.stdout + done.stderr);
  const completed = readFileSync(receiptPath);
  assert.equal(JSON.parse(completed).complete, true);
  put(f.subject, "authored-fixture.md", "work after integration\n");
  const lock = resolve(
    f.subject,
    runGit(
      f.subject,
      ["rev-parse", "--git-path", "index.lock"],
      fixtureGitOptions,
    ),
  );
  writeFileSync(lock, "");
  const noIncoming = f.invoke();
  assert.equal(noIncoming.status, 0, noIncoming.stdout + noIncoming.stderr);
  assert.match(noIncoming.stdout, /the worktree is not behind main/);
  assert.deepEqual(readFileSync(receiptPath), completed);

  // The later attempt needs incoming work to reach preservation again.
  put(f.main, "next-upstream-fixture.md", "new upstream work\n");
  runGit(f.main, ["add", "next-upstream-fixture.md"], fixtureGitOptions);
  runGit(
    f.main,
    [
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "new upstream work after integration",
    ],
    fixtureGitOptions,
  );
  runGit(f.main, ["push", "-q", "origin", "main"], fixtureGitOptions);
  const failed = f.invoke();
  rmSync(lock);
  assert.notEqual(failed.status, 0);
  assert.match(
    failed.stderr,
    /nothing was stashed and no pending receipt remains/,
  );
  assert.deepEqual(readFileSync(receiptPath), completed);
});

test("follow-up union preserves compatible histories and refuses divergent same-entry histories", () => {
  const a = entry("same"),
    b = structuredClone(a);
  b.revisions.push({
    ...a.revisions[0],
    hash: "b".repeat(64),
    summary: "next",
  });
  const state = (entries) => ({ schemaVersion: 1, entries });
  assert.deepEqual(unionFollowups(state([a]), state([b])).entries, [b]);
  const incompatible = structuredClone(b);
  incompatible.revisions[1].summary = "different";
  assert.throws(
    () => unionFollowups(state([b]), state([incompatible])),
    /divergent history/,
  );
  assert.equal(a.revisions.length, 1, "input is immutable");
  const raw = entry("private-display");
  raw.revisions[0].title = "Inspect /Users/fixture-user/x";
  raw.revisions[0].summary = "Inspect /home/fixture-user/y";
  const rewritten = structuredClone(raw);
  rewritten.revisions[0].title = "Inspect <home>/x";
  rewritten.revisions[0].summary = "Inspect <home>/y";
  for (const [left, right] of [
    [raw, rewritten],
    [rewritten, raw],
  ])
    assert.deepEqual(unionFollowups(state([left]), state([right])).entries, [
      rewritten,
    ]);
  assert.deepEqual(unionFollowups(state([]), state([raw])).entries, [
    rewritten,
  ]);
  assert.deepEqual(unionFollowups(state([raw]), state([])).entries, [
    rewritten,
  ]);
  assert.equal(raw.revisions[0].title, "Inspect /Users/fixture-user/x");
  const divergent = structuredClone(rewritten);
  divergent.revisions[0].summary = "A distinct meaning";
  assert.throws(
    () => unionFollowups(state([raw]), state([divergent])),
    /divergent history/u,
  );
});

for (const interrupted of [false, true])
  test(`untracked stash collision remains explicit and recoverable until continuation (interrupted=${interrupted})`, (t) => {
    const f = fixture(t);
    put(f.main, "untracked-fixture.md", "upstream authored addition\n");
    runGit(f.main, ["add", "untracked-fixture.md"], fixtureGitOptions);
    runGit(
      f.main,
      [
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "upstream untracked collision",
      ],
      fixtureGitOptions,
    );
    runGit(f.main, ["push", "-q", "origin", "main"], fixtureGitOptions);
    const first = f.invoke();
    assert.equal(first.status, 1, first.stdout + first.stderr);
    assert.match(
      first.stdout,
      /Untracked stash collisions require explicit resolution/,
    );
    const receipt = JSON.parse(
      text(f.subject, "docs/control/local/integration.json"),
    );
    assert.deepEqual(receipt.untrackedConflicts, ["untracked-fixture.md"]);
    assert.equal(
      runGit(
        f.subject,
        ["show", `${receipt.stash}^3:untracked-fixture.md`],
        fixtureGitOptions,
      ),
      "retained untracked bytes",
    );
    put(
      f.subject,
      "untracked-fixture.md",
      "explicitly combined upstream and local addition\n",
    );
    put(f.subject, "authored-fixture.md", "explicitly combined intent\n");
    runGit(
      f.subject,
      ["add", "untracked-fixture.md", "authored-fixture.md"],
      fixtureGitOptions,
    );
    if (interrupted)
      put(
        f.subject,
        "docs/control/local/integration.json",
        JSON.stringify({ ...receipt, stage: "applying" }),
      );
    const continued = f.invoke(
      "--continue",
      ...(interrupted ? ["--stash-applied"] : []),
    );
    assert.equal(continued.status, 0, continued.stdout + continued.stderr);
    assert.equal(
      text(f.subject, "untracked-fixture.md"),
      "explicitly combined upstream and local addition\n",
    );
    const completed = JSON.parse(
      text(f.subject, "docs/control/local/integration.json"),
    );
    assert.equal(completed.stashDropped, receipt.stash);
    assert.equal(runGit(f.subject, ["stash", "list"], fixtureGitOptions), "");
  });

test("WO-167 --continue judges the recorded phase while the uncommitted control log travels in the stash", (t) => {
  const f = fixture(t, { reviewed: true });
  const log = "docs/control/orders/WO-998.jsonl";
  const bytes = text(f.subject, log);
  runGit(f.subject, ["rm", "-q", "--cached", log], fixtureGitOptions);
  runGit(
    f.subject,
    [
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "the control log stays uncommitted",
    ],
    fixtureGitOptions,
  );
  assert.equal(text(f.subject, log), bytes);
  const first = f.invoke();
  assert.equal(first.status, 1, first.stdout + first.stderr);
  assert.ok(!existsSync(join(f.subject, log)), "the stash holds the log");
  // The README release block still resolves from the recorded order path.
  assert.match(first.stdout, /Authored conflicts: 'authored-fixture.md'\n/);
  const receipt = JSON.parse(
    text(f.subject, "docs/control/local/integration.json"),
  );
  assert.equal(receipt.phase, "final-review");
  put(f.subject, "authored-fixture.md", "explicitly combined intent\n");
  runGit(f.subject, ["add", "authored-fixture.md"], fixtureGitOptions);
  const continued = f.invoke("--continue");
  assert.equal(continued.status, 0, continued.stdout + continued.stderr);
  assert.doesNotMatch(continued.stderr, /requires the selected order/);
  assert.equal(text(f.subject, log), bytes);
  assert.ok(
    JSON.parse(text(f.subject, "docs/control/local/integration.json")).complete,
  );
});

test("WO-169 a first invocation with no authored conflict generates at once", (t) => {
  const f = fixture(t, { authored: false, generators: "focused" });
  const first = f.invoke();
  assert.equal(first.status, 0, first.stdout + first.stderr);
  assert.match(first.stdout, /Authored conflicts: none/);
  assert.match(first.stdout, /Regenerated: integration decision stub/);
  assert.doesNotMatch(first.stdout, /Pending: /);
  assert.match(
    first.stdout,
    /Affected checks \(not run\):\n  npm test -- --review/,
  );
  const receipt = JSON.parse(
    text(f.subject, "docs/control/local/integration.json"),
  );
  assert.equal(receipt.complete, true);
  assert.deepEqual(receipt.pending, []);
  assert.deepEqual(receipt.authored, []);
  assert.match(
    text(f.subject, "docs/evidence/WO-998/decisions.md"),
    /^Authored conflicts observed: none\.$/m,
  );
  assert.equal(text(f.subject, "authored-fixture.md"), "upstream intent\n");
});

test("interrupted stash application has an explicit resolution continuation that retains recovery", (t) => {
  const f = fixture(t, { authored: false, generators: "focused" });
  const first = f.invoke();
  assert.equal(first.status, 0, first.stdout + first.stderr);
  const file = "docs/control/local/integration.json";
  const receipt = JSON.parse(text(f.subject, file));
  put(
    f.subject,
    file,
    JSON.stringify({ ...receipt, stage: "applying", complete: false }),
  );
  const stalled = f.invokeStages([], ["--continue"]);
  assert.equal(stalled.status, 1);
  assert.match(stalled.stderr, /--continue --stash-applied/);
  const recovered = f.continueWithStub("--stash-applied");
  assert.equal(recovered.status, 0, recovered.stdout + recovered.stderr);
  const after = JSON.parse(text(f.subject, file));
  assert.equal(after.complete, true);
  assert.equal(after.stash, receipt.stash);
  assert.equal(after.checkpointRef, receipt.checkpointRef);
  assert.match(after.stashApplication, /actor-attested/);
});

test("interrupted stash continuation refuses tracked work reverted to HEAD and retains recovery", (t) => {
  const f = fixture(t, { authored: false, generators: "focused" });
  const local = "preserved-local.txt";
  put(f.subject, local, "baseline local bytes\n");
  runGit(f.subject, ["add", local], fixtureGitOptions);
  runGit(
    f.subject,
    ["-c", "maintenance.auto=false", "commit", "-qm", "local tracked base"],
    fixtureGitOptions,
  );
  put(f.subject, local, "retained tracked work\n");
  const first = f.invoke();
  assert.equal(first.status, 0, first.stdout + first.stderr);
  const receiptFile = "docs/control/local/integration.json";
  const receipt = JSON.parse(text(f.subject, receiptFile));
  put(
    f.subject,
    receiptFile,
    JSON.stringify({ ...receipt, stage: "applying", complete: false }),
  );
  put(f.subject, local, "baseline local bytes\n");
  runGit(f.subject, ["add", "--", local], fixtureGitOptions);
  const refused = f.invokeStages([], ["--continue", "--stash-applied"]);
  assert.equal(refused.status, 1, refused.stdout + refused.stderr);
  assert.match(
    refused.stderr,
    /retained stash paths have no trace in the tree: 'preserved-local.txt'/u,
  );
  assert.match(
    refused.stderr,
    /git restore --source=[0-9a-f]+ --worktree -- 'preserved-local.txt'/u,
  );
  assert.match(refused.stderr, /git add -- 'preserved-local.txt'/u);
  const pending = JSON.parse(text(f.subject, receiptFile));
  assert.equal(pending.stage, "applying");
  assert.equal(pending.complete, false);
  assert.deepEqual(pending.unrestoredTrackedPaths, [local]);
  assert.equal(pending.stash, receipt.stash);
  assert.equal(pending.checkpointRef, receipt.checkpointRef);
  assert.equal(
    runGit(f.subject, ["show", `${receipt.stash}:${local}`], fixtureGitOptions),
    "retained tracked work",
  );
  put(f.subject, local, "retained tracked work\n");
  runGit(f.subject, ["add", "--", local], fixtureGitOptions);
  const recovered = f.continueWithStub("--stash-applied");
  assert.equal(recovered.status, 0, recovered.stdout + recovered.stderr);
  assert.equal(text(f.subject, local), "retained tracked work\n");
  const after = JSON.parse(text(f.subject, receiptFile));
  assert.equal(after.complete, true);
  assert.equal(after.stash, receipt.stash);
  assert.equal(after.checkpointRef, receipt.checkpointRef);
});

test("an interrupted stash collision is recorded before its resolution can be acknowledged", (t) => {
  const f = fixture(t, { authored: false, generators: "focused" });
  const local = "untracked-fixture.md";
  put(f.main, local, "upstream authored addition\n");
  runGit(f.main, ["add", "--", local], fixtureGitOptions);
  runGit(
    f.main,
    [
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "upstream untracked collision",
    ],
    fixtureGitOptions,
  );
  runGit(f.main, ["push", "-q", "origin", "main"], fixtureGitOptions);
  const first = f.invokeStages([], []);
  assert.equal(first.status, 1, first.stdout + first.stderr);
  const receiptFile = "docs/control/local/integration.json";
  const receipt = JSON.parse(text(f.subject, receiptFile));
  // An interruption before the first collision record was written.
  put(
    f.subject,
    receiptFile,
    JSON.stringify({
      ...receipt,
      stage: "applying",
      complete: false,
      untrackedConflicts: [],
    }),
  );
  const refused = f.invokeStages([], ["--continue", "--stash-applied"]);
  assert.equal(refused.status, 1, refused.stdout + refused.stderr);
  assert.match(
    refused.stderr,
    /untracked stash collisions need explicit acknowledgement: 'untracked-fixture.md'/u,
  );
  assert.match(refused.stderr, /git stash show --include-untracked --patch/u);
  assert.match(refused.stderr, /git add -- 'untracked-fixture.md'/u);
  const pending = JSON.parse(text(f.subject, receiptFile));
  assert.deepEqual(pending.untrackedConflicts, [local]);
  assert.equal(pending.stage, "applying");
  assert.equal(pending.complete, false);
  assert.equal(text(f.subject, local), "upstream authored addition\n");
  assert.equal(
    runGit(
      f.subject,
      ["show", `${receipt.stash}^3:${local}`],
      fixtureGitOptions,
    ),
    "retained untracked bytes",
  );
  put(f.subject, local, "explicitly combined upstream and local addition\n");
  runGit(f.subject, ["add", "--", local], fixtureGitOptions);
  const done = f.invokeStages(f.generatorStages, [
    "--continue",
    "--stash-applied",
  ]);
  assert.equal(done.status, 0, done.stdout + done.stderr);
  const after = JSON.parse(text(f.subject, receiptFile));
  assert.equal(after.complete, true);
  assert.deepEqual(after.untrackedCollisionAcknowledgements, [local]);
  assert.equal(after.stash, receipt.stash);
  assert.equal(after.checkpointRef, receipt.checkpointRef);
});

test("WO-169 a pass whose generator fails keeps its checks and names the pending step, not a conflict", (t) => {
  const f = fixture(t, { authored: false, generators: "focused" });
  // Release preparation reads the decisions record; one with no entry fails it.
  put(f.subject, "docs/evidence/WO-998/decisions.md", "# WO-998 decisions\n");
  const first = f.invoke();
  assert.equal(first.status, 1, first.stdout + first.stderr);
  assert.match(first.stdout, /Authored conflicts: none/);
  assert.match(first.stdout, /Pending: release preparation: /);
  // The stub waits for the preparation it would record (WO-086).
  assert.match(
    first.stdout,
    /Pending: integration decision stub: awaits release preparation/,
  );
  assert.doesNotMatch(first.stdout, /Regenerated: integration decision stub/);
  assert.match(first.stdout, /Affected checks \(not run\):/);
  assert.match(
    first.stdout,
    /Generation ran and left the pending steps above; repair their cause, then run npm run worktree -- integrate WO-998 --continue/,
  );
  assert.doesNotMatch(
    first.stdout,
    /Resolve authored conflicts|Integration mechanics complete/,
  );
  assert.equal(
    JSON.parse(text(f.subject, "docs/control/local/integration.json")).complete,
    false,
  );
});

test("WO-086 a conflicted decisions record refuses the collision's record and writes nothing", (t) => {
  const f = fixture(t, { authored: false, generators: "focused" });
  const path = "docs/evidence/WO-998/decisions.md";
  const conflicted =
    "# WO-998 decisions\n\n<<<<<<< local\nlocal note\n=======\nupstream note\n>>>>>>> upstream\n";
  put(f.subject, path, conflicted);
  const first = f.invoke();
  assert.equal(first.status, 1, first.stdout + first.stderr);
  assert.match(first.stdout, /Authored conflicts: none/);
  assert.match(
    first.stdout,
    /Pending: release preparation: .*docs\/evidence\/WO-998\/decisions\.md has an authored conflict; resolve it, stage it with git add -- docs\/evidence\/WO-998\/decisions\.md, then rerun npm run worktree -- integrate WO-998 --continue\. Nothing was written\./,
  );
  // The stub waits for the preparation that refused; neither writes.
  assert.match(
    first.stdout,
    /Pending: integration decision stub: awaits release preparation/,
  );
  // Never a fallback: no retime, no record, no roadmap or README paragraph.
  assert.equal(text(f.subject, path), conflicted);
  assert.match(
    text(f.subject, "docs/work-orders/WO-998-fixture.md").split("\n")[0],
    /\(v9000\.0\.1\)$/,
  );
  assert.match(
    text(f.subject, "README.md"),
    /This source prepares DotLn `v9000\.0\.1`/,
  );
  assert.equal(
    runGit(
      f.subject,
      ["diff", "--name-only", f.upstream, "--", "docs/product"],
      fixtureGitOptions,
    ),
    "",
  );
});

test("WO-086 a retime that lands on a continuation is recorded once, in the stub the failed pass withheld", (t) => {
  const f = fixture(t, { authored: false, generators: "focused" });
  const path = "docs/evidence/WO-998/decisions.md";
  // An entry-less record fails the preparation's meter before any write.
  put(f.subject, path, "# WO-998 decisions\n");
  const first = f.invoke();
  assert.equal(first.status, 1, first.stdout + first.stderr);
  assert.match(first.stdout, /Pending: release preparation: /);
  assert.equal(text(f.subject, path), "# WO-998 decisions\n");
  assert.match(
    text(f.subject, "docs/work-orders/WO-998-fixture.md").split("\n")[0],
    /\(v9000\.0\.1\)$/,
  );
  // The actor repairs the cause and continues.
  rmSync(join(f.subject, path));
  const continued = f.invoke("--continue");
  assert.equal(continued.status, 0, continued.stdout + continued.stderr);
  assert.match(continued.stdout, /Regenerated: integration decision stub/);
  const rows = [
    ...text(f.subject, path).matchAll(/```json\n([\s\S]*?)\n```/g),
  ].map((match) => JSON.parse(match[1]));
  assert.equal(rows.length, 1, JSON.stringify(rows));
  assert.ok(
    rows[0].evidence.some((item) =>
      item.startsWith(
        "release preparation: Retimed WO-998: v9000.0.1 → v9000.0.2 above the observed release baseline v9000.0.1.",
      ),
    ),
    JSON.stringify(rows[0].evidence),
  );
});

for (const blocker of ["PR directory", "PR file"])
  test(
    blocker === "PR directory"
      ? "WO-086 an unowned blocked PR directory is preserved while integration retimes"
      : "WO-086 a blocked PR file preserves collision inputs for continuation",
    (t) => {
      const f = fixture(t, { authored: false, generators: "focused" });
      const directory = join(f.subject, "docs/final-reviews/WO-998");
      const blocked =
        blocker === "PR directory" ? directory : join(directory, "PR.md");
      if (blocker === "PR directory")
        put(f.subject, "docs/final-reviews/WO-998", "blocked\n");
      else {
        mkdirSync(blocked, { recursive: true });
        // Git preserves files, not empty directories, through the stash.
        writeFileSync(join(blocked, "blocker"), "blocked\n");
      }
      const authority = "docs/work-orders/WO-998-fixture.md";
      const decisions = "docs/evidence/WO-998/decisions.md";
      const headingBefore = text(f.subject, authority);
      const readmeBefore = text(f.subject, "README.md");
      const first = f.invoke();
      if (blocker === "PR directory") {
        assert.equal(first.status, 0, first.stdout + first.stderr);
        assert.equal(text(f.subject, "docs/final-reviews/WO-998"), "blocked\n");
        assert.equal(existsSync(join(directory, "PR.md")), false);
        assert.match(
          text(f.subject, authority).split("\n")[0],
          /\(v9000\.0\.2\)$/,
        );
        assert.equal(
          text(f.subject, "README.md"),
          readmeBefore.replace("v9000.0.1", "v9000.0.2"),
        );
        assert.equal(
          JSON.parse(text(f.subject, "docs/control/local/integration.json"))
            .complete,
          true,
        );
        return;
      }
      assert.equal(first.status, 1, first.stdout + first.stderr);
      assert.match(first.stdout, /Pending: release preparation: /);
      assert.match(first.stdout, /EISDIR/);
      assert.match(
        first.stdout,
        /Pending: integration decision stub: awaits release preparation/,
      );
      assert.equal(text(f.subject, authority), headingBefore);
      assert.equal(text(f.subject, "README.md"), readmeBefore);
      assert.equal(existsSync(join(f.subject, decisions)), false);
      assert.equal(
        runGit(
          f.subject,
          ["diff", "--name-only", f.upstream, "--", "docs/product"],
          fixtureGitOptions,
        ),
        "",
      );
      rmSync(blocked, { recursive: true });
      const continued = f.invoke("--continue");
      assert.equal(continued.status, 0, continued.stdout + continued.stderr);
      assert.match(
        text(f.subject, authority).split("\n")[0],
        /\(v9000\.0\.2\)$/,
      );
      const rows = [
        ...text(f.subject, decisions).matchAll(/```json\n([\s\S]*?)\n```/g),
      ].map((match) => JSON.parse(match[1]));
      assert.equal(rows.length, 1, JSON.stringify(rows));
      assert.ok(
        rows[0].evidence.some((item) =>
          item.startsWith(
            "release preparation: Retimed WO-998: v9000.0.1 → v9000.0.2 above the observed release baseline v9000.0.1.",
          ),
        ),
        JSON.stringify(rows[0].evidence),
      );
      assert.equal(
        runGit(
          f.subject,
          ["diff", "--name-only", f.upstream, "--", "docs/product"],
          fixtureGitOptions,
        ),
        "",
      );
      assert.equal(
        text(f.subject, "README.md"),
        readmeBefore.replace("v9000.0.1", "v9000.0.2"),
      );
      assert.equal(
        JSON.parse(text(f.subject, "docs/control/local/integration.json"))
          .complete,
        true,
      );
    },
  );

test("integration refuses a blocked evidence ancestor before retiming and recovers on continuation", (t) => {
  const f = fixture(t, { authored: false, generators: "focused" });
  const authority = "docs/work-orders/WO-998-fixture.md";
  const receipt = "docs/control/local/integration.json";
  const before = text(f.subject, authority);
  const readmeBefore = text(f.subject, "README.md");
  put(f.subject, "docs/evidence/WO-998", "blocked\n");
  const refused = f.invoke();
  assert.equal(refused.status, 1, refused.stdout + refused.stderr);
  assert.match(
    refused.stdout,
    /Pending: release preparation: .*decisions\.md: document entry is unreadable \(ENOTDIR\)/,
  );
  assert.match(
    refused.stdout,
    /Pending: integration decision stub: awaits release preparation/,
  );
  assert.equal(text(f.subject, authority), before);
  assert.equal(text(f.subject, "README.md"), readmeBefore);
  assert.equal(JSON.parse(text(f.subject, receipt)).release, undefined);
  rmSync(join(f.subject, "docs/evidence/WO-998"));
  const continued = f.invoke("--continue");
  assert.equal(continued.status, 0, continued.stdout + continued.stderr);
  assert.match(text(f.subject, authority).split("\n")[0], /\(v9000\.0\.2\)$/);
  assert.equal(JSON.parse(text(f.subject, receipt)).complete, true);
});

for (const [blocker, newerTag] of [
  ["regular file", false],
  ["regular file with a newer tag during retry", true],
])
  test(`WO-086 a stub blocked by a ${blocker} retains its saved collision through continuation`, (t) => {
    const f = fixture(t, { authored: false, generators: "focused" });
    const directory = join(f.subject, "docs/evidence/WO-998");
    // The meter refuses an existing blocked ancestor before retiming. Create
    // this obstruction after the real preparation succeeds so the fixture
    // reaches the saved-outcome recovery path it is intended to judge.
    const releaseScript = "scripts/release.mjs";
    const releaseSource = text(f.subject, releaseScript);
    const releaseEntry = "    await main();";
    assert.equal(releaseSource.split(releaseEntry).length, 2);
    put(
      f.subject,
      releaseScript,
      releaseSource.replace(
        releaseEntry,
        releaseEntry +
          '\n    if (process.argv.includes("--integration")) writeFileSync("docs/evidence/WO-998", "blocked\\n");',
      ),
    );
    const authority = "docs/work-orders/WO-998-fixture.md";
    const decisions = "docs/evidence/WO-998/decisions.md";
    const receipt = "docs/control/local/integration.json";
    const readmeBefore = text(f.subject, "README.md");
    const first = f.invoke();
    assert.equal(first.status, 1, first.stdout + first.stderr);
    assert.match(first.stdout, /Regenerated: release preparation/);
    assert.match(first.stdout, /Pending: integration decision stub: /);
    assert.match(text(f.subject, authority).split("\n")[0], /\(v9000\.0\.2\)$/);
    assert.equal(existsSync(join(f.subject, decisions)), false);
    const saved = JSON.parse(text(f.subject, receipt)).release;
    assert.match(
      saved,
      /^Retimed WO-998: v9000\.0\.1 → v9000\.0\.2 above the observed release baseline v9000\.0\.1\./,
    );
    if (newerTag) {
      // A second collision must wait until the first outcome is filed.
      runGit(f.main, ["tag", "v9000.0.2"], fixtureGitOptions);
      const blockedRetry = f.invokeWithoutRelease("--continue");
      assert.equal(
        blockedRetry.status,
        1,
        blockedRetry.stdout + blockedRetry.stderr,
      );
      assert.match(blockedRetry.stdout, /Pending: integration decision stub: /);
      assert.match(
        blockedRetry.stdout,
        /Pending: release preparation: awaits integration decision stub/,
      );
      assert.doesNotMatch(
        blockedRetry.stdout,
        /Regenerated: release preparation/,
      );
      assert.equal(JSON.parse(text(f.subject, receipt)).release, saved);
      assert.match(
        text(f.subject, authority).split("\n")[0],
        /\(v9000\.0\.2\)$/,
      );
      assert.equal(
        text(f.subject, "README.md"),
        readmeBefore.replace("v9000.0.1", "v9000.0.2"),
      );
      assert.equal(existsSync(join(f.subject, decisions)), false);
    }
    rmSync(directory);
    if (!newerTag) {
      // Filing the saved stub can succeed before the next prepare fails.
      // The marker then owns the first outcome on every further continuation.
      const pr = join(f.subject, "docs/final-reviews/WO-998/PR.md");
      assert.equal(
        existsSync(pr),
        false,
        "preparation did not create a PR draft",
      );
      mkdirSync(pr, { recursive: true });
      writeFileSync(join(pr, "blocker"), "blocked\n");
      const failedPrepare = f.continueWithStub();
      assert.equal(
        failedPrepare.status,
        1,
        failedPrepare.stdout + failedPrepare.stderr,
      );
      assert.match(
        failedPrepare.stdout,
        /Regenerated: integration decision stub/,
      );
      assert.match(
        failedPrepare.stdout,
        /Pending: release preparation: .*EISDIR/,
      );
      assert.doesNotMatch(
        failedPrepare.stdout,
        /Pending: integration decision stub:/,
      );
      assert.equal(JSON.parse(text(f.subject, receipt)).release, saved);
      assert.ok(
        text(f.subject, decisions).includes(
          `release preparation: ${releaseLine(saved)}`,
        ),
      );
      rmSync(pr, { recursive: true });
    }
    const continued = f.continueWithStub();
    assert.equal(continued.status, 0, continued.stdout + continued.stderr);
    const rows = [
      ...text(f.subject, decisions).matchAll(/```json\n([\s\S]*?)\n```/g),
    ].map((match) => JSON.parse(match[1]));
    assert.equal(rows.length, newerTag ? 2 : 1, JSON.stringify(rows));
    assert.equal(
      rows[0].evidence.filter((item) => item.startsWith("release preparation:"))
        .length,
      1,
    );
    assert.ok(
      rows[0].evidence.includes(`release preparation: ${releaseLine(saved)}`),
      JSON.stringify(rows[0].evidence),
    );
    assert.equal(
      (text(f.subject, decisions).match(/<!-- integration /g) ?? []).length,
      1,
    );
    if (newerTag) {
      assert.deepEqual(rows[1].evidence, [
        "release baseline v9000.0.2 (ancestral local release tags, excluding annotated starter refresh tags)",
        "superseded target v9000.0.2",
        "new target v9000.0.3",
      ]);
      assert.equal(rows[1].dispatch, "resume: fix; release prepare");
      assert.equal(
        rows.filter((row) => JSON.stringify(row).includes("v9000.0.3")).length,
        1,
      );
    }
    const target = newerTag ? "v9000.0.3" : "v9000.0.2";
    assert.ok(
      text(f.subject, authority).split("\n")[0].endsWith(`(${target})`),
    );
    assert.equal(
      text(f.subject, "README.md"),
      readmeBefore.replace("v9000.0.1", target),
    );
    assert.equal(
      runGit(
        f.subject,
        ["diff", "--name-only", f.upstream, "--", "docs/product"],
        fixtureGitOptions,
      ),
      "",
    );
    assert.equal(JSON.parse(text(f.subject, receipt)).complete, true);
  });

// The record's realpath rule refuses a symlinked evidence directory, and a
// directory where the record should be is refused by name instead of
// escaping as a raw error; both leave the collision to the continuation.
for (const blocker of ["symlink", "directory"])
  test(`WO-086 a record ${blocker === "symlink" ? "behind a symlinked evidence directory" : "that is a directory"} refuses preparation and records the collision once on continuation`, (t) => {
    const f = fixture(t, { authored: false, generators: "focused" });
    const directory = join(f.subject, "docs/evidence/WO-998");
    const decisions = "docs/evidence/WO-998/decisions.md";
    if (blocker === "symlink") {
      mkdirSync(join(f.subject, "stub-target"));
      put(f.subject, "stub-target/keep", "preserved through stash\n");
      symlinkSync("../../stub-target", directory);
    } else put(f.subject, `${decisions}/blocker`, "blocked\n");
    const authority = "docs/work-orders/WO-998-fixture.md";
    const receipt = "docs/control/local/integration.json";
    const readmeBefore = text(f.subject, "README.md");
    const first = f.invoke();
    assert.equal(first.status, 1, first.stdout + first.stderr);
    assert.match(
      first.stdout,
      blocker === "symlink"
        ? /Pending: release preparation: .*contained regular file reached through no symlink/
        : /Pending: release preparation: .*contained regular file/,
    );
    assert.match(
      first.stdout,
      /Pending: integration decision stub: awaits release preparation/,
    );
    assert.doesNotMatch(first.stdout, /Regenerated: release preparation/);
    assert.doesNotMatch(first.stdout + first.stderr, /EISDIR/);
    assert.match(text(f.subject, authority).split("\n")[0], /\(v9000\.0\.1\)$/);
    assert.equal(text(f.subject, "README.md"), readmeBefore);
    const saved = JSON.parse(text(f.subject, receipt));
    assert.equal(saved.complete, false);
    assert.equal(saved.release, undefined);
    rmSync(blocker === "symlink" ? directory : join(f.subject, decisions), {
      recursive: true,
    });
    // No outcome was saved, so the continuation prepares with the flag.
    const continued = f.invoke("--continue");
    assert.equal(continued.status, 0, continued.stdout + continued.stderr);
    const rows = [
      ...text(f.subject, decisions).matchAll(/```json\n([\s\S]*?)\n```/g),
    ].map((match) => JSON.parse(match[1]));
    assert.equal(rows.length, 1, JSON.stringify(rows));
    assert.equal(
      rows[0].evidence.filter((item) =>
        item.startsWith(
          "release preparation: Retimed WO-998: v9000.0.1 → v9000.0.2 above the observed release baseline v9000.0.1.",
        ),
      ).length,
      1,
      JSON.stringify(rows[0].evidence),
    );
    assert.equal(
      (text(f.subject, decisions).match(/<!-- integration /g) ?? []).length,
      1,
    );
    assert.ok(
      text(f.subject, authority).split("\n")[0].endsWith("(v9000.0.2)"),
    );
    assert.equal(JSON.parse(text(f.subject, receipt)).complete, true);
  });

test("the fixture overlay carries the console package and its fixture script from the working tree without build output", (t) => {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-integrate-overlay-")),
  );
  t.after(() => rmSync(root, { recursive: true, force: true }));
  overlayImplementation(root);
  for (const path of [
    "packages/console/test/fixtures.ts",
    "packages/console/src/index.ts",
    "scripts/console-fixtures.mjs",
    "scripts/lib/worktree-integration.mjs",
    "scripts/bootstrap.mjs",
    "scripts/launchpad.mjs",
    "scripts/license-surfaces.mjs",
    "packages/skeleton/src/runtime-inputs.mjs",
  ])
    assert.equal(
      readFileSync(join(root, path), "utf8"),
      readFileSync(join(source, path), "utf8"),
      path,
    );
  assert.equal(existsSync(join(root, "packages/console/dist")), false);
  assert.equal(existsSync(join(root, "packages/console/node_modules")), false);
  assert.equal(existsSync(join(root, "packages/console/fixtures")), false);
});

test("WO-086 a tag that lands after the stub is written is recorded once, by release prepare", (t) => {
  const f = fixture(t, { authored: false, generators: "focused" });
  const path = "docs/evidence/WO-998/decisions.md";
  // The subject's target is above main's tag, so the first pass is current.
  put(
    f.subject,
    "docs/work-orders/WO-998-fixture.md",
    text(f.subject, "docs/work-orders/WO-998-fixture.md").replace(
      "(v9000.0.1)",
      "(v9000.0.5)",
    ),
  );
  claim(f.subject, "v9000.0.5");
  // A step after the stub fails: the work-order index refuses its temporary.
  put(f.subject, "docs/work-orders/README.md.tmp", "interrupted\n");
  const first = f.invoke();
  assert.equal(first.status, 1, first.stdout + first.stderr);
  assert.match(first.stdout, /Regenerated: integration decision stub/);
  assert.match(first.stdout, /Pending: work-order index: /);
  assert.match(
    text(f.subject, path),
    /^Release preparation: WO-998 target v9000\.0\.5 remains current\./m,
  );
  // A sibling publishes the colliding version between the passes.
  rmSync(join(f.subject, "docs/work-orders/README.md.tmp"));
  runGit(f.main, ["tag", "v9000.0.5"], fixtureGitOptions);
  const continued = f.continueWithStub();
  assert.equal(continued.status, 0, continued.stdout + continued.stderr);
  assert.match(
    text(f.subject, "docs/work-orders/WO-998-fixture.md").split("\n")[0],
    /\(v9000\.0\.6\)$/,
  );
  const rows = [
    ...text(f.subject, path).matchAll(/```json\n([\s\S]*?)\n```/g),
  ].map((match) => JSON.parse(match[1]));
  // The stub keeps its first-pass line; the collision is its own decision.
  assert.equal(rows.length, 2, JSON.stringify(rows));
  assert.deepEqual(rows[1].evidence, [
    "release baseline v9000.0.5 (ancestral local release tags, excluding annotated starter refresh tags)",
    "superseded target v9000.0.5",
    "new target v9000.0.6",
  ]);
  assert.equal(rows[1].dispatch, "resume: fix; release prepare");
  assert.equal(
    rows.filter((row) => JSON.stringify(row).includes("v9000.0.6")).length,
    1,
    "the collision is recorded exactly once",
  );
});

test("WO-169 the integration record holds each release message as one line with one full stop", () => {
  for (const [message, line] of [
    [
      "Retimed WO-165: v0.51.2 → v0.52.1.\nFiles changed:\n  docs/work-orders/WO-165-fixture.md\n  README.md\nTag observation: local snapshot only.",
      "Retimed WO-165: v0.51.2 → v0.52.1. Files changed: docs/work-orders/WO-165-fixture.md, README.md. Tag observation: local snapshot only.",
    ],
    [
      "WO-160 target v0.51.0 remains current.\nno files changed.\nTag observation: local snapshot only.",
      "WO-160 target v0.51.0 remains current. no files changed. Tag observation: local snapshot only.",
    ],
    ["pending", "pending."],
    // Other line endings are line breaks too, and a listed path keeps its
    // own bytes.
    [
      "Retimed WO-165: v0.51.2 → v0.52.1.\r\nFiles changed:\r\n  docs/odd:\r\n  docs/dotted.\r\nTag observation: origin.\r\n",
      "Retimed WO-165: v0.51.2 → v0.52.1. Files changed: docs/odd:, docs/dotted.. Tag observation: origin.",
    ],
    ["One.\rTwo." + String.fromCharCode(0x2028) + "Three.", "One. Two. Three."],
  ]) {
    assert.equal(releaseLine(message), line);
    assert.doesNotMatch(releaseLine(message), /[\r\n]|\.\.$/);
    assert.ok(!releaseLine(message).includes(String.fromCharCode(0x2028)));
  }
});

test("printed checks use the runner's declared machinery sources, including package code", async (t) => {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-integrate-checks-")),
  );
  t.after(() => rmSync(root, { recursive: true, force: true }));
  runGit(root, ["init", "-q", "-b", "main"], fixtureGitOptions);
  excludeFixtureOwnership(root);
  runGit(root, ["config", "user.name", "Fixture"], fixtureGitOptions);
  runGit(
    root,
    ["config", "user.email", "fixture@example.invalid"],
    fixtureGitOptions,
  );
  put(root, "packages/compiler/src/verification.ts", "// baseline\n");
  runGit(root, ["add", "-A"], fixtureGitOptions);
  runGit(
    root,
    ["-c", "maintenance.auto=false", "commit", "-qm", "baseline"],
    fixtureGitOptions,
  );
  assert.equal(await integrationTestCommand(root, "HEAD"), "npm test");
  put(
    root,
    "packages/compiler/src/verification.ts",
    "// changed machinery source\n",
  );
  assert.equal(
    await integrationTestCommand(root, "HEAD"),
    "npm test -- --review",
  );
});

assert.deepEqual(
  [...unregisteredCaseBounds],
  [],
  "every duration bound must match a declared case, including after a rename",
);

test("the one-line release block reconciles across a merge where main and the subject each changed its version", (t) => {
  const f = fixture(t, { authored: false, generators: "focused" });
  // The only line between the markers differs on both sides, which Git alone
  // would report as a conflict; the fixture sets the two versions, and the
  // test checks that before integrating.
  const blockLine = (root) => {
    const lines = text(root, "README.md").split("\n");
    return lines
      .slice(
        lines.indexOf("<!-- DOTLN-RELEASE-BEGIN -->") + 1,
        lines.indexOf("<!-- DOTLN-RELEASE-END -->"),
      )
      .filter((line) => line.trim());
  };
  assert.equal(blockLine(f.main).length, 1);
  assert.equal(blockLine(f.subject).length, 1);
  assert.notEqual(blockLine(f.main)[0], blockLine(f.subject)[0]);
  const first = f.invoke();
  assert.equal(first.status, 0, first.stdout + first.stderr);
  assert.match(first.stdout, /Authored conflicts: none/);
  const readme = text(f.subject, "README.md").split("\n");
  const begin = readme.indexOf("<!-- DOTLN-RELEASE-BEGIN -->");
  const end = readme.indexOf("<!-- DOTLN-RELEASE-END -->");
  const version = /\((v\d+\.\d+\.\d+)\)$/.exec(
    text(f.subject, "docs/work-orders/WO-998-fixture.md").split("\n")[0],
  )[1];
  assert.deepEqual(
    readme.slice(begin + 1, end).filter((line) => line.trim()),
    [`This source prepares DotLn \`${version}\`.`],
    "exactly the generated line, carrying the integrated heading's version",
  );
});

for (const stop of [
  "locks",
  "partial-snapshot",
  "published-snapshot",
  "reflog-installed",
])
  test(`stash drop stopped at ${stop} keeps a whole proof or names recovery`, (t) => {
    const root = createFixtureRoot(join(tmpdir(), "dotln-stash-stop-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const git = (args) => runGit(root, args, fixtureGitOptions);
    git(["init", "-q"]);
    excludeFixtureOwnership(root);
    git(["config", "user.name", "Fixture"]);
    git(["config", "user.email", "fixture@example.invalid"]);
    put(root, "file.txt", "base\n");
    git(["add", "."]);
    git(["-c", "maintenance.auto=false", "commit", "-qm", "test: base"]);
    for (const value of ["first", "second"]) {
      put(root, "file.txt", `${value}\n`);
      git(["stash", "push", "-m", value]);
    }
    const stash = git(["rev-parse", "refs/stash"]),
      subject = git(["log", "-g", "-1", "--format=%gs", "refs/stash"]);
    const recovery = join(root, "snapshot.json");
    const module = new URL("./lib/stash-drop.mjs", import.meta.url).href;
    const invoke = (interrupt = false) =>
      spawnSync(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          `
      import fs from 'node:fs'; import {syncBuiltinESMExports} from 'node:module';
      const stop=${JSON.stringify(stop)}, recovery=${JSON.stringify(recovery)};
      if (${interrupt}) {
        let opens=0; const open=fs.openSync, write=fs.writeFileSync, link=fs.linkSync, rename=fs.renameSync;
        fs.openSync=(...args)=>{const fd=open(...args);if(stop==='locks'&&String(args[0]).endsWith('.lock')&&++opens===3)process.kill(process.pid,'SIGKILL');return fd;};
        fs.writeFileSync=(file,bytes,...args)=>{if(stop==='partial-snapshot'&&(file===recovery+'.partial'||file===recovery)){write(file,String(bytes).slice(0,8),...args);process.kill(process.pid,'SIGKILL');}return write(file,bytes,...args);};
        fs.linkSync=(...args)=>{const result=link(...args);if(stop==='published-snapshot'&&args[1]===recovery)process.kill(process.pid,'SIGKILL');return result;};
        fs.renameSync=(...args)=>{const result=rename(...args);if(stop==='reflog-installed'&&String(args[0]).endsWith('/logs/refs/stash.lock'))process.kill(process.pid,'SIGKILL');return result;};
        syncBuiltinESMExports();
      }
      const {dropInventoriedStash}=await import(${JSON.stringify(module)});
      dropInventoriedStash(${JSON.stringify(root)},${JSON.stringify(stash)},${JSON.stringify(subject)},recovery);
    `,
        ],
        { encoding: "utf8", env: fixtureGitOptions.env },
      );
    assert.equal(invoke(true).signal, "SIGKILL");
    const held = invoke();
    assert.notEqual(held.status, 0);
    assert.match(
      held.stderr,
      /stash drop lock remains:.*after checking no Git process/u,
    );
    for (const file of ["refs/stash", "logs/refs/stash", "packed-refs"])
      rmSync(
        `${git(["rev-parse", "--path-format=absolute", "--git-path", file])}.lock`,
        { force: true },
      );
    if (stop === "partial-snapshot") assert.equal(existsSync(recovery), false);
    if (["published-snapshot", "reflog-installed"].includes(stop))
      assert.equal(JSON.parse(readFileSync(recovery, "utf8")).stash, stash);
    if (stop === "reflog-installed") {
      const result = invoke();
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /restore refs\/stash and its reflog together from snapshot.json/u,
      );
    } else if (stop === "published-snapshot") {
      put(root, "file.txt", "newer\n");
      git(["stash", "push", "-m", "newer"]);
      const result = invoke();
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /stash recovery snapshot changed.*Preserve the current/u,
      );
    } else {
      const result = invoke();
      assert.equal(result.status, 0, result.stderr);
      assert.equal(JSON.parse(readFileSync(recovery, "utf8")).stash, stash);
    }
  });

test("active integration uses main's current code and preserves another worktree's stash", (t) => {
  const f = fixture(t, {
    active: true,
    authored: false,
    generators: "focused",
  });
  // Commit a sibling stash before the subject's integration. The shared stack
  // must preserve that exact identity when the subject drops its own entry.
  put(f.main, "sibling-untracked.md", "parallel order's recovery\n");
  runGit(
    f.main,
    ["stash", "push", "--include-untracked", "-m", "sibling recovery"],
    fixtureGitOptions,
  );
  const before = runGit(
    f.main,
    ["stash", "list", "--format=%H"],
    fixtureGitOptions,
  );
  for (const name of ["kernel", "compiler", "skeleton", "console"])
    cpSync(
      join(source, "packages", name, "dist"),
      join(f.main, "packages", name, "dist"),
      { recursive: true },
    );
  linkDependencies(f.main);
  // Direct import proves the implementation comes from main even if the
  // target's pre-integration CLI is old. All actual effects target its branch.
  const program = `const {integrateWorktree}=await import(${JSON.stringify(new URL("file://" + join(f.main, "scripts/lib/worktree-integration.mjs")).href)}); const row=await integrateWorktree(process.cwd(), "WO-998"); if(!row.complete)process.exitCode=1;`;
  const result = run(f.main, process.execPath, [
    "--input-type=module",
    "-e",
    program,
  ]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(text(f.subject, "authored-fixture.md"), "upstream intent\n");
  const receipt = JSON.parse(
    text(f.subject, "docs/control/local/integration.json"),
  );
  assert.equal(receipt.phase, "active");
  assert.equal(receipt.stashDropped, receipt.stash);
  assert.equal(
    runGit(f.main, ["stash", "list", "--format=%H"], fixtureGitOptions),
    before,
  );
  const second = run(f.main, process.execPath, [
    "--input-type=module",
    "-e",
    program,
  ]);
  assert.equal(second.status, 0, second.stdout + second.stderr);
  assert.match(second.stdout, /took in nothing/);
  assert.equal(
    runGit(f.main, ["stash", "list", "--format=%H"], fixtureGitOptions),
    before,
  );
});

for (const phase of ["active", "repairing", "final-review"]) {
  test(`integration skips preservation when ${phase} has no incoming commits`, (t) => {
    const f = fixture(t, {
      active: phase === "active",
      reviewed: phase === "final-review",
      authored: false,
      generators: "focused",
    });
    runGit(f.main, ["reset", "--hard", f.before], fixtureGitOptions);
    runGit(
      f.origin,
      ["update-ref", "refs/heads/main", f.before],
      fixtureGitOptions,
    );
    const before = runGit(
      f.subject,
      ["stash", "list", "--format=%H"],
      fixtureGitOptions,
    );
    const sourceBytes = text(f.subject, "untracked-fixture.md");
    const bin = join(f.temporary, "guard-bin");
    mkdirSync(bin);
    const events = join(f.temporary, "preservation-events.jsonl");
    const realGit = checked(source, "/usr/bin/which", ["git"]);
    put(
      bin,
      "git",
      `#!${process.execPath}\nimport {spawnSync} from 'node:child_process';import {appendFileSync} from 'node:fs';const args=process.argv.slice(2);const result=spawnSync(${JSON.stringify(realGit)},args,{stdio:'inherit'});if(args.includes('stash')&&args.includes('push')&&result.status===0){appendFileSync(${JSON.stringify(events)},JSON.stringify({stash:true})+'\\n');process.exit(86);}process.exit(result.status??1);\n`,
    );
    // A package marker makes the executable wrapper an ESM file on every host.
    put(bin, "package.json", '{"type":"module"}\n');
    chmodSync(join(bin, "git"), 0o755);
    const preload = join(f.temporary, "observe-scratch.mjs");
    writeFileSync(
      preload,
      `import fs from 'node:fs';import {syncBuiltinESMExports} from 'node:module';const original=fs.mkdtempSync;fs.mkdtempSync=function(prefix,...args){if(String(prefix).includes('dotln-integrate-merge-'))fs.appendFileSync(${JSON.stringify(events)},JSON.stringify({scratch:true})+'\\n');return original(prefix,...args)};syncBuiltinESMExports();\n`,
    );
    const result = spawnSync(
      process.execPath,
      ["--import", preload, "scripts/worktree.mjs", "integrate", "WO-998"],
      {
        cwd: f.subject,
        encoding: "utf8",
        maxBuffer: 32 * 1024 * 1024,
        env: {
          ...process.env,
          DOTLN_ACCOUNT_LABEL: "",
          PATH: bin + ":" + process.env.PATH,
        },
      },
    );
    const observations = existsSync(events)
      ? text(f.temporary, "preservation-events.jsonl")
          .trim()
          .split("\n")
          .map(JSON.parse)
      : [];
    console.log(
      "WO239 integration control " +
        JSON.stringify({
          phase,
          exitCode: result.status,
          stashPushes: observations.filter((row) => row.stash).length,
          scratchRoots: observations.filter((row) => row.scratch).length,
        }),
    );
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /took in nothing/);
    assert.deepEqual(
      observations,
      [],
      "no transient stash or merge scratch is created",
    );
    assert.equal(
      runGit(f.subject, ["stash", "list", "--format=%H"], fixtureGitOptions),
      before,
    );
    assert.equal(text(f.subject, "untracked-fixture.md"), sourceBytes);
    assert.equal(
      existsSync(join(f.subject, "docs/control/local/integration.json")),
      false,
    );
  });
}

test("final-review integration fetches an advanced origin even when local main is already an ancestor", (t) => {
  const f = fixture(t, {
    reviewed: true,
    authored: false,
    generators: "focused",
  });
  runGit(f.main, ["reset", "--hard", f.before], fixtureGitOptions);
  const result = f.invoke();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /took in nothing/);
  assert.equal(text(f.subject, "authored-fixture.md"), "upstream intent\n");
});

test("integration refuses live lane holders in either the subject or main before preservation", async (t) => {
  const f = fixture(t, {
    active: true,
    authored: false,
    generators: "focused",
  });
  const directory = join(f.temporary, "isolated-host");
  const resources = "scripts/lib/host-resources.mjs";
  for (const checkout of [f.main, f.subject])
    put(
      checkout,
      resources,
      text(checkout, resources).replace(
        "export function hostStateRoot() {",
        `export function hostStateRoot() { return ${JSON.stringify(directory)};`,
      ),
    );
  const { registerProcess } = await import(
    new URL("file://" + join(f.main, resources))
  );
  for (const worktree of [f.subject, f.main]) {
    const lease = registerProcess(
      "lanes",
      process.pid,
      {
        task: "fixture live gate",
        worktree,
        slots: 1,
        acquiredAt: new Date().toISOString(),
      },
      directory,
    );
    try {
      const result = run(f.subject, process.execPath, [
        "scripts/worktree.mjs",
        "integrate",
        "WO-998",
      ]);
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.match(result.stderr, /fixture live gate.*holds host lanes.*retry/);
      assert.equal(
        existsSync(join(f.subject, "docs/control/local/integration.json")),
        false,
      );
      assert.equal(runGit(f.subject, ["stash", "list"], fixtureGitOptions), "");
    } finally {
      lease.release();
    }
  }
});

test("integration guards the primary checkout while a planning pass has it off main, then proceeds", async (t) => {
  const f = fixture(t, {
    active: true,
    authored: false,
    generators: "focused",
  });
  // A planning pass switches the primary checkout to its own branch, so no
  // checkout has main checked out. The active order still takes in local main.
  runGit(f.main, ["switch", "-c", "planning/fixture-pass"], fixtureGitOptions);
  const directory = join(f.temporary, "isolated-host");
  const resources = "scripts/lib/host-resources.mjs";
  for (const checkout of [f.main, f.subject])
    put(
      checkout,
      resources,
      text(checkout, resources).replace(
        "export function hostStateRoot() {",
        `export function hostStateRoot() { return ${JSON.stringify(directory)};`,
      ),
    );
  const { registerProcess } = await import(
    new URL("file://" + join(f.main, resources))
  );
  const lease = registerProcess(
    "lanes",
    process.pid,
    {
      task: "fixture planning gate",
      worktree: f.main,
      slots: 1,
      acquiredAt: new Date().toISOString(),
    },
    directory,
  );
  try {
    const refused = run(f.subject, process.execPath, [
      "scripts/worktree.mjs",
      "integrate",
      "WO-998",
    ]);
    assert.equal(refused.status, 1, refused.stdout + refused.stderr);
    assert.match(
      refused.stderr,
      /fixture planning gate.*holds host lanes.*retry/,
    );
  } finally {
    lease.release();
  }
  const result = run(f.subject, process.execPath, [
    "scripts/worktree.mjs",
    "integrate",
    "WO-998",
  ]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(text(f.subject, "authored-fixture.md"), "upstream intent\n");
});
