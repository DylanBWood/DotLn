// WO-148 fixtures: a real Git launchpad with an activated order in its own
// worktree, bound by the actual command. Nothing here is synthesized past the
// launchpad itself — the store, the capsule and the binding record are the
// ones an operator would get.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BINDING_SCHEMA_VERSION,
  MISSION_DECISION_LIMIT,
  MISSION_THESIS_HEADINGS,
  STORE_FILES,
  bindingMismatches,
  parseArguments,
} from "./resident-bind.mjs";
import { missionPinFromSource } from "../packages/skeleton/dist/src/mission-check-source.js";
import { missionPin } from "../packages/skeleton/dist/src/mission-check-protocol.js";
import { decodeResidentConfiguration } from "../packages/skeleton/dist/src/resident-state.js";
import {
  compileLoadout,
  requireCompiled,
} from "../packages/compiler/dist/src/index.js";
import { loadConfig } from "./lib/config.mjs";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const sourceRoot = join(scriptRoot, "..");
const command = join(scriptRoot, "resident-bind.mjs");
const dotln = join(sourceRoot, "packages/skeleton/dist/src/dotln.js");

const CONTRACT = `# WO-999 — Fixture order

**Objective:** Add the fixture judge to the declared surface and nothing else.

**Acceptance criteria (all required)**

1. The judge reads its capsule and returns a typed verdict.
2. The fixture records what it observed.

**Non-goals:** Editing the product documents; repairing anything.

**Evidence gate:** the fixture transcript.
`;
const VISION = `# Fixture vision

## The core bet

A local-first compiler and runtime the operator owns.

## What DotLn is not

- Not a hosted service that keeps the operator's work on someone else's host.
- Not a chat wrapper.
`;
const DECISIONS = `# WO-999 decisions

## WO-999-D001

\`\`\`json
{ "id": "WO-999-D001", "decision": "Pin the capsule at declaration." }
\`\`\`
`;
const ACTIVATED = {
  schemaVersion: 1,
  recordedAt: "2026-09-21T09:00:00.000Z",
  type: "WorkOrderActivated",
  workOrderId: "WO-999",
  workOrderPath: "docs/work-orders/WO-999-fixture.md",
};

const write = (root, path, bytes) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), bytes);
};
const git = (root, ...args) => {
  const result = spawnSync(
    "git",
    [
      "-C",
      root,
      "-c",
      "core.hooksPath=/dev/null",
      "-c",
      "commit.gpgsign=false",
      ...args,
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: "Fixture",
        GIT_AUTHOR_EMAIL: "fixture@example.invalid",
        GIT_COMMITTER_NAME: "Fixture",
        GIT_COMMITTER_EMAIL: "fixture@example.invalid",
      },
    },
  );
  assert.equal(result.status, 0, `git ${args.join(" ")}: ${result.stderr}`);
  return result.stdout.trim();
};

/** One launchpad on `main`, one worktree on `wo-999` with the order activated
 * in it and uncommitted work inside the declared surface. `controlRoot`
 * declares WO-069's configured control root instead of the default lane, and
 * `ignoreLane: false` withholds the ignore rule that lane would need. */
function fixture(options = {}) {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-resident-bind-")),
  );
  const launchpad = join(root, "launchpad");
  const controlRoot = options.controlRoot ?? "docs/control";
  const orderSegment = `${controlRoot}/orders/WO-999.jsonl`;
  mkdirSync(launchpad);
  git(launchpad, "init", "--initial-branch=main");
  write(
    launchpad,
    ".gitignore",
    `${options.ignoreLane === false ? "" : `/${controlRoot}/local/\n`}node_modules/\ndist/\n`,
  );
  if (options.controlRoot)
    write(
      launchpad,
      "dotln.config.json",
      `${JSON.stringify(
        { version: 1, roots: { control: options.controlRoot } },
        null,
        2,
      )}\n`,
    );
  write(launchpad, "docs/work-orders/WO-999-fixture.md", CONTRACT);
  write(launchpad, "docs/product/00-vision.md", VISION);
  write(launchpad, "packages/fixture/src/judge.ts", "export const a = 1;\n");
  if (options.decisions)
    write(launchpad, "docs/evidence/WO-999/decisions.md", DECISIONS);
  git(launchpad, "add", "-A");
  git(launchpad, "commit", "-m", "fixture baseline");
  const baseCommit = git(launchpad, "rev-parse", "HEAD");
  const worktree = join(root, "worktree");
  git(launchpad, "worktree", "add", worktree, "-b", "wo-999", "main");
  write(worktree, orderSegment, `${JSON.stringify(ACTIVATED)}\n`);
  // Work in flight: branch commits are forbidden before final review, so the
  // change the capsule supervises is ordinarily uncommitted.
  write(worktree, "packages/fixture/src/judge.ts", "export const a = 2;\n");
  // An excluded build tree, as a bootstrapped worktree carries: the pin's
  // ignored inventory is then non-empty and its salted ids are exercised.
  write(worktree, "packages/fixture/dist/built.js", "export const a = 2;\n");
  return {
    root,
    launchpad,
    worktree,
    baseCommit,
    controlRoot,
    close: (id, at = "2026-09-21T12:00:00.000Z") =>
      appendFileSync(
        join(worktree, orderSegment),
        `${JSON.stringify({
          schemaVersion: 1,
          recordedAt: at,
          type: "FinalReviewCompleted",
          workOrderId: id,
          verdict: "pass",
          finalReviewId: "FINAL-001",
          reportPath: "docs/final-reviews/WO-999/FINAL-001.md",
        })}\n`,
      ),
    dispose: () => rmSync(root, { recursive: true, force: true }),
  };
}

const run = (launchpad, ...args) =>
  spawnSync(process.execPath, [command, ...args], {
    encoding: "utf8",
    cwd: launchpad,
    env: { ...process.env, DOTLN_LAUNCHPAD: launchpad },
  });
const bind = (launchpad, ...extra) =>
  run(
    launchpad,
    "WO-999",
    "--surface",
    "packages/fixture",
    "--transport",
    "codex-cli-exec",
    "--model",
    "fixture-model",
    "--effort",
    "xhigh",
    ...extra,
  );
const storeOf = (stdout) => /^Bound WO-999 to (.+)$/mu.exec(stdout)?.[1];
const withFixture = (options, body) => {
  const context = fixture(options);
  try {
    return body(context);
  } finally {
    context.dispose();
  }
};

test("bind writes a store the runtime accepts and aims at the bound worktree", () =>
  withFixture({ decisions: true }, (context) => {
    const started = Date.now();
    const result = bind(context.launchpad);
    assert.equal(result.status, 0, result.stderr);
    const store = storeOf(result.stdout);
    assert.equal(
      store,
      join(context.launchpad, "docs/control/local/resident/WO-999-1"),
    );
    // Every printed line an operator acts on names this store.
    for (const line of [
      `resident --store '${store}' --policy contributor.mission-check --once`,
      `resident --store '${store}' --policy contributor.mission-check --tick 60000`,
      `presence away --store '${store}'`,
      `presence back --store '${store}'`,
      `status --store '${store}'`,
      `export DOTLN_RESIDENT_STORE='${store}'`,
      `--check '${store}'`,
    ])
      assert.ok(result.stdout.includes(line), `missing printed line: ${line}`);

    const configuration = decodeResidentConfiguration(
      JSON.parse(readFileSync(join(store, "resident.json"), "utf8")),
    );
    assert.deepEqual(Object.keys(configuration.actors), ["mission-check"]);
    const actor = configuration.actors["mission-check"];
    assert.equal(actor.kind, "cli-worker");
    assert.equal(actor.worker.transport, "codex-cli-exec");
    assert.deepEqual(actor.missionSource, {
      root: context.worktree,
      contractPath: "docs/work-orders/WO-999-fixture.md",
      decisionsPath: "docs/evidence/WO-999/decisions.md",
      baseCommit: context.baseCommit,
      declaredSurfaces: ["packages/fixture"],
      decisionLimit: MISSION_DECISION_LIMIT,
      visionPath: "docs/product/00-vision.md",
      thesisHeadings: MISSION_THESIS_HEADINGS.map(([id, title]) => [id, title]),
    });

    // The pinned capsule equals one built by hand from the same inputs. The
    // per-pin salt and the ids it keys are random by construction, so they are
    // compared as a shape rather than byte for byte.
    const comparable = (pin) => ({
      ...pin,
      ignoredSalt: /^[0-9a-f]{64}$/u.test(pin.ignoredSalt),
      ignoredBaseline: pin.ignoredBaseline.map(({ evidence, ...rest }) => ({
        ...rest,
        evidence: /^ignored-entry:sha256:[0-9a-f]{64}$/u.test(evidence),
      })),
    });
    const pinned = missionPin(actor.worker.request.subject);
    assert.equal(
      pinned.ignoredBaseline.length,
      1,
      "ignored inventory is empty",
    );
    assert.deepEqual(
      comparable(missionPinFromSource(actor.missionSource, "WO-999")),
      comparable(pinned),
    );
    // Two pins over the same inventory carry different salts and different
    // ids, which is what keeps a private ignored path out of the capsule.
    assert.notEqual(
      missionPinFromSource(actor.missionSource, "WO-999").ignoredSalt,
      pinned.ignoredSalt,
    );
    assert.notEqual(
      missionPinFromSource(actor.missionSource, "WO-999").ignoredBaseline[0]
        .evidence,
      pinned.ignoredBaseline[0].evidence,
    );

    const binding = JSON.parse(
      readFileSync(join(store, "binding.json"), "utf8"),
    );
    assert.equal(binding.schemaVersion, BINDING_SCHEMA_VERSION);
    assert.equal(binding.workOrder, "WO-999");
    assert.equal(binding.phase, "active");
    assert.equal(binding.worktree, context.worktree);
    assert.equal(binding.branch, "wo-999");
    assert.equal(binding.baseCommit, context.baseCommit);
    assert.equal(binding.baseRef, "main");
    assert.equal(binding.baseSource, "merge-base");
    assert.deepEqual(binding.declaredSurfaces, ["packages/fixture"]);
    assert.equal(binding.store, store);
    assert.equal(binding.storeIndex, 1);
    assert.equal(
      binding.contractSha256,
      spawnSync(process.execPath, [
        "-e",
        `process.stdout.write(require("node:crypto").createHash("sha256").update(require("node:fs").readFileSync(${JSON.stringify(
          join(context.worktree, "docs/work-orders/WO-999-fixture.md"),
        )})).digest("hex"))`,
      ]).stdout.toString(),
    );
    assert.equal(
      binding.canonical.controlPath,
      "docs/control/orders/WO-999.jsonl",
    );
    assert.equal(binding.canonical.events, 1);
    assert.equal(binding.canonical.recordedAt, ACTIVATED.recordedAt);
    assert.ok(Date.parse(binding.boundAt) >= started);

    // The shipped CLI reads the store, and one cycle with the operator present
    // configures the resident without dispatching anything.
    const status = spawnSync(
      process.execPath,
      [dotln, "status", "--store", store],
      {
        encoding: "utf8",
      },
    );
    assert.equal(status.status, 0, status.stderr);
    const once = spawnSync(
      process.execPath,
      [
        dotln,
        "resident",
        "--store",
        store,
        "--policy",
        "contributor.mission-check",
        "--once",
      ],
      { encoding: "utf8" },
    );
    assert.equal(once.status, 0, once.stderr);
    const events = readFileSync(join(store, "events.jsonl"), "utf8");
    assert.match(events, /"ResidentConfigured"/u);
    assert.doesNotMatch(events, /"ScriptEpisodeDispatched"/u);
  }));

test("a bind with no decisions file yet omits the decision window path", () =>
  withFixture({}, (context) => {
    const result = bind(context.launchpad);
    assert.equal(result.status, 0, result.stderr);
    const store = storeOf(result.stdout);
    const binding = JSON.parse(
      readFileSync(join(store, "binding.json"), "utf8"),
    );
    assert.equal(binding.decisionsPath, null);
    const configuration = JSON.parse(
      readFileSync(join(store, "resident.json"), "utf8"),
    );
    assert.ok(
      !Object.hasOwn(
        configuration.actors["mission-check"].missionSource,
        "decisionsPath",
      ),
    );
    assert.match(result.stdout, /decisions {2}none yet/u);
  }));

test("every refusal names the missing thing", () =>
  withFixture({}, (context) => {
    const cases = [
      {
        name: "no worktree",
        args: [
          "WO-997",
          "--surface",
          "packages/fixture",
          "--transport",
          "codex-cli-exec",
          "--model",
          "m",
          "--effort",
          "xhigh",
        ],
        expect: /no worktree for wo-997/u,
      },
      {
        name: "no surface",
        args: [
          "WO-999",
          "--transport",
          "codex-cli-exec",
          "--model",
          "m",
          "--effort",
          "xhigh",
        ],
        expect: /no declared surface/u,
      },
      {
        name: "unknown transport",
        args: [
          "WO-999",
          "--surface",
          "packages/fixture",
          "--transport",
          "telepathy",
          "--model",
          "m",
          "--effort",
          "xhigh",
        ],
        expect: /--transport must be one of/u,
      },
      {
        name: "absolute surface",
        args: [
          "WO-999",
          "--surface",
          "/etc",
          "--transport",
          "codex-cli-exec",
          "--model",
          "m",
          "--effort",
          "xhigh",
        ],
        expect: /declared surface is not repository-relative/u,
      },
    ];
    for (const item of cases) {
      const result = run(context.launchpad, ...item.args);
      assert.equal(result.status, 1, `${item.name} did not refuse`);
      assert.match(result.stderr, item.expect, item.name);
    }
    // A branch whose worktree exists but whose control state never activated
    // the order is an unknown order, not a missing worktree.
    git(
      context.launchpad,
      "worktree",
      "add",
      join(context.root, "other"),
      "-b",
      "wo-998",
      "main",
    );
    const unknown = run(
      context.launchpad,
      "WO-998",
      "--surface",
      "packages/fixture",
      "--transport",
      "codex-cli-exec",
      "--model",
      "m",
      "--effort",
      "xhigh",
    );
    assert.equal(unknown.status, 1);
    assert.match(unknown.stderr, /unknown work order WO-998/u);
    // A closed order refuses by name: its worktree is no longer work in flight.
    context.close("WO-999");
    const closed = bind(context.launchpad);
    assert.equal(closed.status, 1);
    assert.match(closed.stderr, /WO-999 is closed/u);
  }));

test("--check names every mismatch, refuses a launch line and exits non-zero", () =>
  withFixture({}, (context) => {
    const bound = bind(context.launchpad);
    assert.equal(bound.status, 0, bound.stderr);
    const store = storeOf(bound.stdout);

    const fresh = run(context.launchpad, "--check", store);
    assert.equal(fresh.status, 0, fresh.stderr);
    assert.match(fresh.stdout, /matches canonical state/u);
    assert.match(fresh.stdout, /--policy contributor\.mission-check --once/u);

    // Contract bytes edited under the pinned capsule.
    writeFileSync(
      join(context.worktree, "docs/work-orders/WO-999-fixture.md"),
      CONTRACT.replace("and nothing else", "and a repair"),
    );
    const edited = run(context.launchpad, "--check", store);
    assert.equal(edited.status, 1);
    assert.match(edited.stdout, /Stale binding for WO-999/u);
    assert.match(edited.stdout, /mismatch {3}contract bytes:/u);
    assert.doesNotMatch(
      edited.stdout,
      /--policy contributor\.mission-check --once/u,
    );
    assert.doesNotMatch(edited.stdout, /DOTLN_RESIDENT_STORE/u);

    // The order closes under the same binding.
    context.close("WO-999");
    const closed = run(context.launchpad, "--check", store);
    assert.equal(closed.status, 1);
    assert.match(
      closed.stdout,
      /mismatch {3}phase: the binding records active; canonical state records closed/u,
    );

    // The worktree moves.
    const moved = join(context.root, "moved");
    git(context.launchpad, "worktree", "move", context.worktree, moved);
    const relocated = run(context.launchpad, "--check", store);
    assert.equal(relocated.status, 1);
    assert.match(relocated.stdout, /mismatch {3}worktree: the binding names/u);

    // The worktree disappears entirely.
    rmSync(moved, { recursive: true, force: true });
    git(context.launchpad, "worktree", "prune");
    const gone = run(context.launchpad, "--check", store);
    assert.equal(gone.status, 1);
    assert.match(gone.stdout, /no worktree for wo-999 exists now/u);
  }));

test("--check names a store retargeted through any declared source field", () =>
  withFixture({ decisions: true }, (context) => {
    // Two declared surfaces, so a single surface carrying the separator the
    // old comparison joined on is available as a counterexample.
    const bound = bind(context.launchpad, "--surface", "docs/work-orders");
    assert.equal(bound.status, 0, bound.stderr);
    const store = storeOf(bound.stdout);
    const residentPath = join(store, "resident.json");
    const declared = readFileSync(residentPath, "utf8");
    assert.equal(run(context.launchpad, "--check", store).status, 0);

    // Each field is retargeted on its own while the worktree, the phase, the
    // base and the contract bytes stay exactly as they were bound. Every one of
    // them selects part of the subject the resident re-reads at each dispatch.
    for (const [field, value, expected] of [
      [
        "decisionsPath",
        "docs/evidence/WO-998/decisions.md",
        /mismatch {3}store: resident\.json decisionsPath is/u,
      ],
      [
        "visionPath",
        "docs/product/01-elsewhere.md",
        /mismatch {3}store: resident\.json visionPath is/u,
      ],
      [
        "thesisHeadings",
        [["mission", "Another thesis entirely"]],
        /mismatch {3}store: resident\.json thesisHeadings is/u,
      ],
      [
        "decisionLimit",
        1,
        /mismatch {3}store: resident\.json decisionLimit is 1; the binding record says 5/u,
      ],
      [
        // One surface whose text is the two declared ones joined: exactly what
        // a comparison over joined text cannot tell apart from the pair.
        "declaredSurfaces",
        ["packages/fixture, docs/work-orders"],
        /mismatch {3}store: resident\.json declaredSurfaces is/u,
      ],
      [
        // A field the protocol admits and the binding never declares.
        "storyPath",
        "docs/product/00-vision.md",
        /mismatch {3}store: resident\.json declares storyPath/u,
      ],
    ]) {
      const retargeted = JSON.parse(declared);
      retargeted.actors["mission-check"].missionSource[field] = value;
      writeFileSync(residentPath, `${JSON.stringify(retargeted, null, 2)}\n`);
      const checked = run(context.launchpad, "--check", store);
      assert.equal(checked.status, 1, `${field} was accepted as fresh`);
      assert.match(checked.stdout, /Stale binding for WO-999/u, field);
      assert.match(checked.stdout, expected, field);
      assert.doesNotMatch(
        checked.stdout,
        /--policy contributor\.mission-check --once/u,
        `${field} printed a launch line`,
      );
      assert.doesNotMatch(checked.stdout, /DOTLN_RESIDENT_STORE/u, field);
    }

    // A launch line is an instruction to run this store, so a store the runtime
    // would refuse is named rather than read as plain JSON.
    const broken = JSON.parse(declared);
    delete broken.actors["mission-check"].worker;
    writeFileSync(residentPath, `${JSON.stringify(broken, null, 2)}\n`);
    const undecodable = run(context.launchpad, "--check", store);
    assert.equal(undecodable.status, 1);
    assert.match(
      undecodable.stdout,
      /mismatch {3}store: resident\.json is no longer a resident configuration/u,
    );

    // The declared bytes check clean again: the retargeting failed, not the check.
    writeFileSync(residentPath, declared);
    assert.equal(run(context.launchpad, "--check", store).status, 0);
  }));

test("a rebind writes a new store and leaves the old one byte-identical", () =>
  withFixture({}, (context) => {
    const first = bind(context.launchpad);
    assert.equal(first.status, 0, first.stderr);
    const one = storeOf(first.stdout);
    const before = Object.fromEntries(
      readdirSync(one).map((name) => [
        name,
        readFileSync(join(one, name), "utf8"),
      ]),
    );
    const beforeStat = statSync(join(one, "resident.json")).mtimeMs;

    const second = bind(context.launchpad, "--surface", "docs/work-orders");
    assert.equal(second.status, 0, second.stderr);
    const two = storeOf(second.stdout);
    assert.notEqual(one, two);
    assert.equal(
      two,
      join(context.launchpad, "docs/control/local/resident/WO-999-2"),
    );
    assert.deepEqual(
      JSON.parse(readFileSync(join(two, "binding.json"), "utf8"))
        .declaredSurfaces,
      ["packages/fixture", "docs/work-orders"],
    );
    for (const [name, bytes] of Object.entries(before))
      assert.equal(readFileSync(join(one, name), "utf8"), bytes, name);
    assert.equal(statSync(join(one, "resident.json")).mtimeMs, beforeStat);
    assert.deepEqual(
      readdirSync(
        join(context.launchpad, "docs/control/local/resident"),
      ).sort(),
      ["WO-999-1", "WO-999-2"],
    );
  }));

test("the store and its binding record stay in the ignored control lane", () =>
  withFixture({}, (context) => {
    const result = bind(context.launchpad);
    assert.equal(result.status, 0, result.stderr);
    const store = storeOf(result.stdout);
    // Nothing the bind wrote can reach a committed surface of the launchpad.
    assert.equal(
      git(context.launchpad, "status", "--porcelain", "--untracked-files=all"),
      "",
    );
    for (const name of ["resident.json", "binding.json"]) {
      const ignored = spawnSync(
        "git",
        ["-C", context.launchpad, "check-ignore", join(store, name)],
        { encoding: "utf8" },
      );
      assert.equal(ignored.status, 0, `${name} is not in the ignored lane`);
    }
    assert.equal(statSync(join(store, "binding.json")).mode & 0o777, 0o600);
  }));

test("a configured control lane Git can see refuses the bind that would fill it", () =>
  withFixture(
    { controlRoot: "records/state", ignoreLane: false },
    (context) => {
      const refused = bind(context.launchpad);
      assert.equal(refused.status, 1);
      assert.match(refused.stderr, /the resident lane is not ignored/u);
      assert.match(refused.stderr, /records\/state\/local\/resident\//u);
      // The refusal precedes the store: nothing path-bearing was written at all.
      assert.equal(
        existsSync(join(context.launchpad, "records/state/local")),
        false,
      );
      assert.equal(
        git(
          context.launchpad,
          "status",
          "--porcelain",
          "--untracked-files=all",
        ),
        "",
      );
    },
  ));

test("a configured control root with its ignore rule binds into the ignored lane", () =>
  withFixture({ controlRoot: "records/state" }, (context) => {
    const result = bind(context.launchpad);
    assert.equal(result.status, 0, result.stderr);
    const store = storeOf(result.stdout);
    assert.equal(
      store,
      join(context.launchpad, "records/state/local/resident/WO-999-1"),
    );
    assert.equal(
      git(context.launchpad, "status", "--porcelain", "--untracked-files=all"),
      "",
    );
    for (const name of STORE_FILES) {
      const ignored = spawnSync(
        "git",
        ["-C", context.launchpad, "check-ignore", join(store, name)],
        { encoding: "utf8" },
      );
      assert.equal(ignored.status, 0, `${name} is not in the ignored lane`);
    }
    assert.equal(run(context.launchpad, "--check", store).status, 0);
  }));

test("--base takes the operator's commit and is checked against the worktree", () =>
  withFixture({}, (context) => {
    write(
      context.worktree,
      "packages/fixture/src/second.ts",
      "export const b = 1;\n",
    );
    git(context.worktree, "add", "-A");
    git(context.worktree, "commit", "-m", "an integrated sibling's commit");
    const sibling = git(context.worktree, "rev-parse", "HEAD");
    const result = bind(context.launchpad, "--base", sibling);
    assert.equal(result.status, 0, result.stderr);
    const binding = JSON.parse(
      readFileSync(join(storeOf(result.stdout), "binding.json"), "utf8"),
    );
    assert.equal(binding.baseCommit, sibling);
    assert.equal(binding.baseSource, "operator");
    assert.equal(binding.baseRef, null);
    const absent = bind(context.launchpad, "--base", "0".repeat(40));
    assert.equal(absent.status, 1);
    assert.match(absent.stderr, /--base names no commit/u);
  }));

test("argument parsing keeps the declaration literal", () => {
  assert.deepEqual(
    parseArguments([
      "WO-148",
      "--surface",
      "a/b",
      "c/d",
      "--surface",
      "e/f",
      "--transport",
      "claude-cli-print",
      "--model",
      "m",
      "--effort",
      "xhigh",
    ]),
    {
      action: "bind",
      workOrder: "WO-148",
      surfaces: ["a/b", "c/d", "e/f"],
      transport: "claude-cli-print",
      model: "m",
      effort: "xhigh",
      base: undefined,
    },
  );
  // WO-157 item 7: an absent --model or --effort is left for the bind's
  // per-transport default (it was a refusal before).
  assert.deepEqual(
    parseArguments([
      "WO-148",
      "--surface",
      "a",
      "--transport",
      "codex-cli-exec",
      "--effort",
      "x",
    ]),
    {
      action: "bind",
      workOrder: "WO-148",
      surfaces: ["a"],
      transport: "codex-cli-exec",
      model: undefined,
      effort: "x",
      base: undefined,
    },
  );
  assert.deepEqual(parseArguments(["--check", "/tmp/store"]), {
    action: "check",
    store: "/tmp/store",
  });
  for (const [argv, expected] of [
    [["--check", "/a", "--model", "m"], /--check takes a store directory/u],
    [["WO-1", "--surface", "a"], /work order id must look like/u],
    [
      [
        "WO-148",
        "--surface",
        "a",
        "a",
        "--transport",
        "codex-cli-exec",
        "--model",
        "m",
        "--effort",
        "x",
      ],
      /duplicate declared surface a/u,
    ],
    [
      [
        "WO-148",
        "--surface",
        "a",
        "--transport",
        "codex-cli-exec",
        "--model",
        "m",
        "--model",
        "n",
        "--effort",
        "x",
      ],
      /duplicate option --model/u,
    ],
    [["WO-148", "--nope"], /unknown option --nope/u],
    [
      [
        "WO-148",
        "--surface",
        "a",
        "--transport",
        "codex-cli-exec",
        "--effort",
        " ",
      ],
      /--effort needs a value; omit it to take the transport default/u,
    ],
  ])
    assert.throws(() => parseArguments(argv), expected, JSON.stringify(argv));
});

test("bindingMismatches compares the binding, canonical state and the store", () => {
  const binding = {
    workOrder: "WO-148",
    branch: "wo-148",
    phase: "active",
    phaseId: "mission-check",
    worktree: "/w",
    baseCommit: "a".repeat(40),
    baseRef: "origin/main",
    baseSource: "merge-base",
    contractPath: "docs/work-orders/WO-148-x.md",
    contractSha256: "b".repeat(64),
    decisionsPath: "docs/evidence/WO-148/decisions.md",
    declaredSurfaces: ["scripts", "docs/product"],
    decisionLimit: MISSION_DECISION_LIMIT,
    visionPath: "docs/product/00-vision.md",
    thesisHeadings: MISSION_THESIS_HEADINGS.map(([id, title]) => [id, title]),
  };
  const observed = {
    worktree: "/w",
    phase: "active",
    workOrderPath: binding.contractPath,
    baseCommit: binding.baseCommit,
    contractSha256: binding.contractSha256,
    canonical: null,
  };
  const sourceOf = (overrides = {}) => ({
    actors: {
      "mission-check": {
        missionSource: {
          root: binding.worktree,
          contractPath: binding.contractPath,
          decisionsPath: binding.decisionsPath,
          baseCommit: binding.baseCommit,
          declaredSurfaces: [...binding.declaredSurfaces],
          decisionLimit: binding.decisionLimit,
          visionPath: binding.visionPath,
          thesisHeadings: binding.thesisHeadings.map((heading) => [...heading]),
          ...overrides,
        },
      },
    },
  });
  assert.deepEqual(bindingMismatches(binding, observed, sourceOf()), []);
  assert.equal(
    bindingMismatches(
      binding,
      { ...observed, phase: "closed", contractSha256: "c".repeat(64) },
      sourceOf(),
    ).length,
    2,
  );
  // Every field of the store's declared source is named on its own, even when
  // canonical state still matches: each one retargets what the resident reads.
  for (const [field, value] of [
    ["root", "/elsewhere"],
    ["contractPath", "docs/work-orders/WO-147-y.md"],
    ["decisionsPath", "docs/evidence/WO-147/decisions.md"],
    ["baseCommit", "d".repeat(40)],
    ["declaredSurfaces", ["docs"]],
    ["decisionLimit", 1],
    ["visionPath", "docs/product/01-elsewhere.md"],
    ["thesisHeadings", [["mission", "Another thesis entirely"]]],
  ])
    assert.match(
      bindingMismatches(binding, observed, sourceOf({ [field]: value })).join(
        "\n",
      ),
      new RegExp(`store: resident\\.json ${field} is`, "u"),
      field,
    );
  // Declared surfaces are compared element by element. One surface whose text
  // is the pair joined is a different declaration, not the same one.
  assert.match(
    bindingMismatches(
      binding,
      observed,
      sourceOf({ declaredSurfaces: [binding.declaredSurfaces.join(", ")] }),
    ).join("\n"),
    /store: resident\.json declaredSurfaces/u,
  );
  // A source field the binding record never declared is named as well.
  assert.match(
    bindingMismatches(
      binding,
      observed,
      sourceOf({ storyPath: "docs/product/02-story.md" }),
    ).join("\n"),
    /store: resident\.json declares storyPath/u,
  );
  assert.match(
    bindingMismatches(binding, observed, { actors: {} }).join("\n"),
    /declares no mission source/u,
  );
});

test("a moved store keeps its binding, and a directory without one refuses", () =>
  withFixture({}, (context) => {
    const result = bind(context.launchpad);
    const store = storeOf(result.stdout);
    const elsewhere = join(context.root, "retained-store");
    renameSync(store, elsewhere);
    const moved = run(context.launchpad, "--check", elsewhere);
    assert.equal(moved.status, 0, moved.stderr);
    // Accepting the relocation means every command printed has to open the
    // directory that was checked; the original path is only provenance.
    for (const line of [
      `resident --store '${elsewhere}' --policy contributor.mission-check --once`,
      `resident --store '${elsewhere}' --policy contributor.mission-check --tick 60000`,
      `presence away --store '${elsewhere}'`,
      `presence back --store '${elsewhere}'`,
      `status --store '${elsewhere}'`,
      `export DOTLN_RESIDENT_STORE='${elsewhere}'`,
      `--check '${elsewhere}'`,
    ])
      assert.ok(moved.stdout.includes(line), `missing printed line: ${line}`);
    assert.match(moved.stdout, /matches canonical state: .*retained-store$/mu);
    assert.match(moved.stdout, /bound as {3}.*WO-999-1 \(the store has moved/u);
    assert.equal(
      moved.stdout.includes(`'${store}'`),
      false,
      "a printed command still names the directory the store left",
    );
    const empty = join(context.root, "not-a-store");
    mkdirSync(empty);
    const refused = run(context.launchpad, "--check", empty);
    assert.equal(refused.status, 1);
    assert.match(refused.stderr, /binding record is missing/u);
  }));

test("a merge base moved by integrating main is named before any launch line", () =>
  withFixture({}, (context) => {
    const bound = bind(context.launchpad);
    assert.equal(bound.status, 0, bound.stderr);
    const store = storeOf(bound.stdout);
    assert.equal(run(context.launchpad, "--check", store).status, 0);
    // main advances after the bind and the order's branch integrates it, as
    // `worktree integrate` does: the merge base the capsule was pinned against
    // moves, and a capsule counted against the old base would attribute
    // main's merged paths to the order.
    write(
      context.launchpad,
      "packages/fixture/src/main-only.ts",
      "export const m = 1;\n",
    );
    git(context.launchpad, "add", "-A");
    git(context.launchpad, "commit", "-m", "main advances");
    git(context.worktree, "merge", "--no-edit", "main");
    const integrated = run(context.launchpad, "--check", store);
    assert.equal(integrated.status, 1);
    assert.match(
      integrated.stdout,
      /mismatch {3}base commit: the binding records [0-9a-f]{40}; the merge base with main is now [0-9a-f]{40}/u,
    );
    assert.doesNotMatch(
      integrated.stdout,
      /--policy contributor\.mission-check --once/u,
    );
    assert.doesNotMatch(integrated.stdout, /DOTLN_RESIDENT_STORE/u);
    // The bind that follows records the moved base rather than the old one.
    const rebound = bind(context.launchpad);
    assert.equal(rebound.status, 0, rebound.stderr);
    const binding = JSON.parse(
      readFileSync(join(storeOf(rebound.stdout), "binding.json"), "utf8"),
    );
    assert.equal(
      binding.baseCommit,
      git(context.launchpad, "rev-parse", "main"),
    );
    assert.notEqual(binding.baseCommit, context.baseCommit);
  }));

// WO-157 item 7 (WO-100 D007): the always-on judge's default per transport.
test("WO-157 a bind without --model and --effort records the transport's default judge", () =>
  withFixture({}, (context) => {
    for (const [transport, model] of [
      ["codex-cli-exec", "gpt-6-luna"],
      ["claude-cli-print", "claude-sonnet-5"],
    ]) {
      const result = run(
        context.launchpad,
        "WO-999",
        "--surface",
        "packages/fixture",
        "--transport",
        transport,
      );
      assert.equal(result.status, 0, result.stderr);
      const store = storeOf(result.stdout);
      const binding = JSON.parse(
        readFileSync(join(store, "binding.json"), "utf8"),
      );
      assert.equal(binding.model, model);
      assert.equal(binding.effort, "xhigh");
      assert.equal(binding.modelSource, "default");
      assert.equal(binding.effortSource, "default");
      const configuration = decodeResidentConfiguration(
        JSON.parse(readFileSync(join(store, "resident.json"), "utf8")),
      );
      const worker = configuration.actors["mission-check"].worker;
      assert.equal(worker.transport, transport);
      assert.equal(worker.request.model, model);
      assert.equal(worker.request.effort, "xhigh");
      assert.match(
        result.stdout,
        new RegExp(
          `judge {6}${transport}; model ${model} \\(default\\); effort xhigh \\(default\\)`,
          "u",
        ),
      );
      assert.equal(run(context.launchpad, "--check", store).status, 0);
    }
    const unknown = run(
      context.launchpad,
      "WO-999",
      "--surface",
      "packages/fixture",
      "--transport",
      "telepathy",
    );
    assert.equal(unknown.status, 1);
    assert.match(
      unknown.stderr,
      /--transport must be one of claude-cli-print, codex-cli-exec/u,
    );
    context.close("WO-999");
  }));

test("WO-157 a bind with --model and --effort records the operator's choice", () =>
  withFixture({}, (context) => {
    const result = bind(context.launchpad);
    assert.equal(result.status, 0, result.stderr);
    const binding = JSON.parse(
      readFileSync(join(storeOf(result.stdout), "binding.json"), "utf8"),
    );
    assert.equal(binding.modelSource, "operator");
    assert.equal(binding.effortSource, "operator");
    assert.equal(binding.model, "fixture-model");
    const partial = run(
      context.launchpad,
      "WO-999",
      "--surface",
      "packages/fixture",
      "--transport",
      "codex-cli-exec",
      "--model",
      "gpt-6-sol",
    );
    assert.equal(partial.status, 0, partial.stderr);
    const chosen = JSON.parse(
      readFileSync(join(storeOf(partial.stdout), "binding.json"), "utf8"),
    );
    assert.deepEqual(
      [chosen.model, chosen.modelSource, chosen.effort, chosen.effortSource],
      ["gpt-6-sol", "operator", "xhigh", "default"],
    );
    // A stale default-sourced binding is rebound without freezing the default.
    context.close("WO-999");
    const stale = run(context.launchpad, "--check", storeOf(partial.stdout));
    assert.equal(stale.status, 1);
    assert.match(
      stale.stdout,
      /Rebind with .* --transport codex-cli-exec --model gpt-6-sol$/mu,
    );
    assert.doesNotMatch(stale.stdout, /--effort xhigh/u);
  }));

// WO-157 item 6 (WO-100 D006): a portfolio binding compiled under its
// repository's registered authorityProfile, and --check refusing a store that
// was not.
const PORTFOLIO_WRITE = ["git.local", "repo.read", "repo.write", "shell.run"];
const PORTFOLIO = {
  version: 1,
  repo: "scratch",
  mechanics: ["shine", "sort"],
  surfaces: ["docs", "generated", "loose/guide.md", "src"],
  phases: {
    widen: { effects: PORTFOLIO_WRITE, files: 1 },
    peak: { effects: PORTFOLIO_WRITE, files: 2 },
  },
  budget: { episodes: 2, wallMs: 600000 },
  verification: {
    "failing-lint": ["node checks/lint.cjs"],
    "failing-test": ["node checks/test.cjs"],
    "misplaced-file": ["node checks/test.cjs"],
  },
};
function portfolioFixture() {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-resident-bind-portfolio-")),
  );
  const launchpad = join(root, "launchpad");
  mkdirSync(launchpad);
  git(launchpad, "init", "--initial-branch=main");
  write(launchpad, ".gitignore", "/docs/control/local/\n");
  write(launchpad, "packages/skeleton/loadouts/grants.json", "[]\n");
  const config = {
    version: 1,
    repositories: {
      scratch: {
        baseBranch: "main",
        worktreeParent: "../scratch-worktrees",
        repositoryClass: "scratch",
        authorityProfile: {
          authorityEnvelopeId: "fixture.scratch",
          allowedEffects: [...PORTFOLIO_WRITE, "repo.inspect"],
          deniedEffects: ["repo.delete"],
          resourceLimits: { files: 8 },
          requiredEvidence: [],
          expiresAt: Number.MAX_SAFE_INTEGER,
          revocationEventTypes: [],
        },
      },
    },
    portfolios: {
      "gardener-5s": PORTFOLIO,
      "self-5s": { ...PORTFOLIO, repo: "self" },
    },
  };
  write(launchpad, "dotln.config.json", `${JSON.stringify(config, null, 2)}\n`);
  git(launchpad, "add", "-A");
  git(launchpad, "commit", "-m", "fixture launchpad");
  const presence = JSON.parse(
    readFileSync(
      join(sourceRoot, "packages/skeleton/fixtures/wo100-portfolio.json"),
      "utf8",
    ),
  );
  const template = {
    ...presence,
    policyId: "fixture.portfolio",
    actors: {
      probe: {
        kind: "script",
        effect: "repo.inspect",
        surface: "fixture.source",
        resources: { files: 1, lines: 0, tokens: 0 },
        command: [process.execPath, "-e", "0"],
        cwd: root,
        timeoutMs: 20000,
        outputContract: "work-candidates-v1",
      },
      widen: {
        kind: "portfolio",
        effect: "repo.write",
        surface: "fixture.source",
        resources: { files: 1, lines: 0, tokens: 0 },
      },
      peak: {
        kind: "portfolio",
        effect: "repo.write",
        surface: "fixture.source",
        resources: { files: 2, lines: 0, tokens: 0 },
      },
    },
    evidence: ["verified-input"],
  };
  const templatePath = join(root, "template.json");
  writeFileSync(templatePath, `${JSON.stringify(template, null, 2)}\n`);
  let stores = 0;
  return {
    root,
    launchpad,
    template,
    templatePath,
    base: "a".repeat(40),
    /** A resident.json written by hand, with a binding record naming it. */
    handStore(resident, binding = {}) {
      const store = join(root, `hand-${(stores += 1)}`);
      mkdirSync(store);
      writeFileSync(join(store, "resident.json"), JSON.stringify(resident));
      writeFileSync(
        join(store, "binding.json"),
        JSON.stringify({
          schemaVersion: BINDING_SCHEMA_VERSION,
          kind: "portfolio",
          portfolioId: "gardener-5s",
          portfolioVersion: 1,
          repo: "scratch",
          baseCommit: "a".repeat(40),
          policyId: "fixture.portfolio",
          store,
          ...binding,
        }),
      );
      return store;
    },
    dispose: () => rmSync(root, { recursive: true, force: true }),
  };
}
const withPortfolio = (body) => {
  const context = portfolioFixture();
  try {
    return body(context);
  } finally {
    context.dispose();
  }
};
const noLaunchLine = (result) => {
  assert.doesNotMatch(result.stdout, /--policy fixture\.portfolio --once/u);
  assert.doesNotMatch(result.stdout, /DOTLN_RESIDENT_STORE/u);
};

test("WO-157 --check refuses a hand-written portfolio binding whose compiled floor departs from its registered profile, naming the repository and profile", () =>
  withPortfolio((context) => {
    const definition = loadConfig(context.launchpad).portfolios["gardener-5s"];
    // Widen the hand-written floor past the profile: allow repo.delete, drop
    // the denial, and raise the files limit the profile narrows to 8.
    const widened = structuredClone(context.template);
    const active = widened.graph.activeMechanics[0];
    active.authorityEnvelope.deniedEffects = [];
    active.authorityEnvelope.allowedEffects.push("repo.delete");
    active.authorityEnvelope.resourceLimits.files = 16;
    for (const phase of widened.graph.presence[0].phases) {
      phase.scope.changeSize.files = 16;
      phase.envelope.resourceLimits.files = 16;
    }
    const store = context.handStore({
      ...widened,
      portfolio: { definition, baseCommit: context.base },
    });
    const checked = run(context.launchpad, "--check", store);
    const profile =
      "repositories\\.scratch\\.authorityProfile \\(fixture\\.scratch\\)";
    assert.match(
      checked.stdout,
      new RegExp(
        `mismatch {3}profile: ${profile} denies repo\\.delete; the compiled floor fixture\\.portfolio\\.base allows repo\\.delete`,
        "u",
      ),
    );
    assert.match(
      checked.stdout,
      new RegExp(
        `mismatch {3}profile: ${profile} limits files to 8; the compiled floor fixture\\.portfolio\\.base allows 16`,
        "u",
      ),
    );
    assert.match(
      checked.stdout,
      new RegExp(
        `mismatch {3}profile: resident\\.json environment\\.repo is "packages/skeleton/fixtures/repo-tree\\.json"; ${profile} compiles it as "scratch"`,
        "u",
      ),
    );
    assert.equal(checked.status, 1);
    noLaunchLine(checked);
    // A definition that differs from the loaded portfolio is named too.
    const drifted = structuredClone(definition);
    drifted.phases.peak.files = 9;
    const edited = run(
      context.launchpad,
      "--check",
      context.handStore({
        ...context.template,
        portfolio: { definition: drifted, baseCommit: context.base },
      }),
    );
    assert.equal(edited.status, 1);
    assert.match(
      edited.stdout,
      /mismatch {3}portfolio: resident\.json binds a portfolio gardener-5s v1 that differs from portfolios\.gardener-5s in .*dotln\.config\.json/u,
    );
    noLaunchLine(edited);
  }));

test("WO-157 --check refuses a portfolio binding whose registered profile cannot be read, naming why", () =>
  withPortfolio((context) => {
    const config = join(context.launchpad, "dotln.config.json");
    const loaded = readFileSync(config, "utf8");
    const definition = loadConfig(context.launchpad).portfolios["gardener-5s"];
    const store = context.handStore({
      ...context.template,
      portfolio: { definition, baseCommit: context.base },
    });
    writeFileSync(config, "{");
    const invalid = run(context.launchpad, "--check", store);
    assert.equal(invalid.status, 1);
    assert.match(
      invalid.stdout,
      /mismatch {3}profile: no registered authorityProfile is readable for repository scratch: /u,
    );
    noLaunchLine(invalid);
    rmSync(config);
    const absent = run(context.launchpad, "--check", store);
    assert.equal(absent.status, 1);
    assert.match(
      absent.stdout,
      /no registered authorityProfile is readable for repository scratch: the launchpad declares no dotln\.config\.json/u,
    );
    noLaunchLine(absent);
    writeFileSync(config, loaded);
    const self = run(
      context.launchpad,
      "--check",
      context.handStore(
        {
          ...context.template,
          portfolio: {
            definition: loadConfig(context.launchpad).portfolios["self-5s"],
            baseCommit: context.base,
          },
        },
        { portfolioId: "self-5s", repo: "self" },
      ),
    );
    assert.equal(self.status, 1);
    assert.match(
      self.stdout,
      /mismatch {3}profile: portfolio self-5s binds self, which carries no registered authorityProfile/u,
    );
    noLaunchLine(self);
  }));

test("WO-157 a loader-built portfolio binding compiles under its registered profile and passes --check", () =>
  withPortfolio((context) => {
    const bound = run(
      context.launchpad,
      "--portfolio",
      "gardener-5s",
      "--template",
      context.templatePath,
      "--base",
      context.base,
    );
    assert.equal(bound.status, 0, bound.stderr);
    const store = /^Bound portfolio gardener-5s to (.+)$/mu.exec(
      bound.stdout,
    )?.[1];
    assert.ok(store, bound.stdout);
    const declared = JSON.parse(
      readFileSync(join(store, "resident.json"), "utf8"),
    );
    const configuration = decodeResidentConfiguration(declared);
    assert.equal(configuration.environment.repo, "scratch");
    assert.deepEqual(
      configuration.portfolio.definition,
      loadConfig(context.launchpad).portfolios["gardener-5s"],
    );
    assert.equal(
      requireCompiled(
        compileLoadout(configuration.graph, configuration.environment),
      ).authorityEnvelope.authorityEnvelopeId,
      "fixture.portfolio.base+registered:scratch:fixture.scratch",
    );
    const binding = JSON.parse(
      readFileSync(join(store, "binding.json"), "utf8"),
    );
    assert.deepEqual(
      [binding.kind, binding.repo, binding.profileId],
      ["portfolio", "scratch", "fixture.scratch"],
    );
    const checked = run(context.launchpad, "--check", store);
    assert.equal(checked.status, 0, checked.stdout + checked.stderr);
    assert.match(
      checked.stdout,
      /Binding for portfolio gardener-5s matches canonical state/u,
    );
    assert.match(checked.stdout, /--policy fixture\.portfolio --once/u);
    // The same store with its environment edited by hand is refused.
    writeFileSync(
      join(store, "resident.json"),
      JSON.stringify({
        ...declared,
        environment: {
          ...declared.environment,
          repo: "packages/skeleton/fixtures/repo-tree.json",
        },
      }),
    );
    const edited = run(context.launchpad, "--check", store);
    assert.equal(edited.status, 1);
    assert.match(
      edited.stdout,
      /mismatch {3}profile: resident\.json environment\.repo is "packages\/skeleton\/fixtures\/repo-tree\.json"/u,
    );
    noLaunchLine(edited);
    for (const [args, expected] of [
      [
        ["--portfolio", "missing"],
        /no portfolio missing is declared under portfolios/u,
      ],
      [["--portfolio", "self-5s"], /binds self/u],
    ]) {
      const refused = run(
        context.launchpad,
        ...args,
        "--template",
        context.templatePath,
        "--base",
        context.base,
      );
      assert.equal(refused.status, 1);
      assert.match(refused.stderr, expected);
    }
    const shortBase = run(
      context.launchpad,
      "--portfolio",
      "gardener-5s",
      "--template",
      context.templatePath,
      "--base",
      "abc",
    );
    assert.match(
      shortBase.stderr,
      /full 40-hex commit id for a portfolio binding/u,
    );
    writeFileSync(
      context.templatePath,
      JSON.stringify({
        ...context.template,
        portfolio: {
          definition: loadConfig(context.launchpad).portfolios["gardener-5s"],
          baseCommit: context.base,
        },
      }),
    );
    const carried = run(
      context.launchpad,
      "--portfolio",
      "gardener-5s",
      "--template",
      context.templatePath,
      "--base",
      context.base,
    );
    assert.match(carried.stderr, /without a portfolio/u);
  }));

test("WO-157 --check names WorkOrder operations the profile denies, a policy the store does not select and an unregistered prototype-key repository", () =>
  withPortfolio((context) => {
    const bound = run(
      context.launchpad,
      "--portfolio",
      "gardener-5s",
      "--template",
      context.templatePath,
      "--base",
      context.base,
    );
    assert.equal(bound.status, 0, bound.stderr);
    const store = /^Bound portfolio gardener-5s to (.+)$/mu.exec(
      bound.stdout,
    )?.[1];
    const declared = JSON.parse(
      readFileSync(join(store, "resident.json"), "utf8"),
    );
    const binding = JSON.parse(
      readFileSync(join(store, "binding.json"), "utf8"),
    );
    // WorkOrder operations: the forward compile prohibits repo.delete.
    const widened = structuredClone(declared);
    const order = widened.graph.activeMechanics[0].workOrder;
    order.allowedOperations.push("repo.delete");
    order.prohibitedOperations = order.prohibitedOperations.filter(
      (value) => value !== "repo.delete",
    );
    const operations = run(
      context.launchpad,
      "--check",
      context.handStore(widened, binding),
    );
    assert.equal(operations.status, 1);
    assert.match(
      operations.stdout,
      /profile: repositories\.scratch\.authorityProfile \(fixture\.scratch\) denies repo\.delete; the compiled WorkOrder allows repo\.delete/u,
    );
    noLaunchLine(operations);
    // A binding record naming another policy than the store selects.
    const policy = run(
      context.launchpad,
      "--check",
      context.handStore(declared, {
        ...binding,
        policyId: "fixture.portfolio;touch${IFS}/tmp/wo157",
      }),
    );
    assert.equal(policy.status, 1);
    assert.match(
      policy.stdout,
      /store: resident\.json selects policy fixture\.portfolio; the binding record says fixture\.portfolio;touch/u,
    );
    noLaunchLine(policy);
    // A repository named like an Object.prototype key is simply unregistered.
    const prototypeKey = structuredClone(declared);
    prototypeKey.portfolio.definition.repo = "constructor";
    const unregistered = run(
      context.launchpad,
      "--check",
      context.handStore(prototypeKey, { ...binding, repo: "constructor" }),
    );
    assert.equal(unregistered.status, 1);
    assert.match(
      unregistered.stdout,
      /profile: repository constructor has no registered authorityProfile/u,
    );
    noLaunchLine(unregistered);
  }));

test("WO-157 a template grant that differs from its registry entry only in reason binds and passes --check", () =>
  withPortfolio((context) => {
    const grant = {
      grantId: "operator.scratch.inspect",
      version: 1,
      grantedBy: "operator",
      effects: ["net.fetch"],
      repo: "scratch",
    };
    write(
      context.launchpad,
      "packages/skeleton/loadouts/grants.json",
      `${JSON.stringify([{ ...grant, reason: "registry reason" }])}\n`,
    );
    const template = structuredClone(context.template);
    template.graph.authorityGrants = [
      ...(template.graph.authorityGrants ?? []),
      { ...grant, reason: "template reason" },
    ];
    writeFileSync(context.templatePath, JSON.stringify(template));
    const bound = run(
      context.launchpad,
      "--portfolio",
      "gardener-5s",
      "--template",
      context.templatePath,
      "--base",
      context.base,
    );
    assert.equal(bound.status, 0, bound.stderr);
    const store = /^Bound portfolio gardener-5s to (.+)$/mu.exec(
      bound.stdout,
    )?.[1];
    const checked = run(context.launchpad, "--check", store);
    assert.equal(checked.status, 0, checked.stdout + checked.stderr);
  }));
