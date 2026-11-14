import {
  excludeFixtureOwnership,
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import { copyFixtureFiles } from "./lib/fixture-inputs.mjs";
import { runGit } from "./lib/git.mjs";
import { write } from "./lib/helpers.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { TOOL_ROOT, docPath, docRelative, loadConfig } from "./lib/config.mjs";
import {
  materializeOrder,
  fileIntent,
  replayAllocations,
  projectDerivedOrders,
} from "./lib/derived-orders.mjs";
import { checkGeneratedSections } from "./lib/derived-contract.mjs";
import {
  declaredCriteria,
  readHandoffLedger,
  readReportGateClaims,
} from "./lib/handoff-ledger.mjs";
import { LIST_UNREAD } from "./lib/work-order-document.mjs";
import { missionContract } from "./lib/mission-documents.mjs";
import { parsePlanOrder } from "./lib/plan-subject.mjs";
import {
  readControl,
  eventsForOrder,
  openOrders,
  selectWorkOrder,
} from "./lib/control-store.mjs";
import { controlFromSources } from "./lib/control-store.mjs";
import { parseDependencies } from "./lib/dependencies.mjs";
import { criteriaAdvisories, readIndex } from "./work-orders.mjs";
import {
  compileLoadout,
  requireCompiled,
} from "../packages/compiler/dist/src/index.js";
import { ResidentHost } from "../packages/skeleton/dist/src/resident-host.js";
import { replayResident } from "../packages/skeleton/dist/src/resident-store.js";

const fixtureGraph = () =>
  JSON.parse(
    readFileSync(
      join(TOOL_ROOT, "packages/skeleton/fixtures/wo067-presence.json"),
      "utf8",
    ),
  );
function compiled() {
  const { graph, environment } = fixtureGraph();
  return requireCompiled(
    compileLoadout(graph, { ...environment, repo: "self" }),
  ).workOrder;
}
const run = (root, script, args = [], success = true) => {
  const result = spawnSync(
    process.execPath,
    [join(TOOL_ROOT, script), ...args],
    {
      cwd: root,
      env: { ...process.env, DOTLN_LAUNCHPAD: root, CODEX_THREAD_ID: "" },
      encoding: "utf8",
    },
  );
  if (success) assert.equal(result.status, 0, result.stderr || result.stdout);
  return result;
};
async function fixture(fn, config) {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-derived-")),
  );
  const fixtureGitFlags = [
    "-c",
    "core.hooksPath=/dev/null",
    "-c",
    "commit.gpgsign=false",
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
  ];
  const fixtureGitOptions = {
    cwd: root,
    maxBuffer: 1024 * 1024,
    onFailure: (result) => assert.equal(result.status, 0, result.stderr),
  };
  try {
    if (config)
      write(
        root,
        "dotln.config.json",
        JSON.stringify({ version: 1, ...config }),
      );
    write(
      root,
      docRelative(root, "planning", "sequence.md"),
      "# Sequence\n\n<!-- dotln-work-order-sequence:start -->\n<!-- dotln-work-order-sequence:end -->\n",
    );
    mkdirSync(docPath(root, "workOrders"), { recursive: true });
    write(
      root,
      ".gitignore",
      `${docRelative(root, "control", "local")}\nruntime-store/\n`,
    );
    runGit(
      root,
      [...fixtureGitFlags, "init", "--initial-branch=main"],
      fixtureGitOptions,
    );
    excludeFixtureOwnership(root);
    assert.equal(
      realpathSync(
        runGit(
          root,
          [...fixtureGitFlags, "rev-parse", "--show-toplevel"],
          fixtureGitOptions,
        ),
      ),
      root,
    );
    runGit(root, [...fixtureGitFlags, "add", "."], fixtureGitOptions);
    runGit(
      root,
      [
        ...fixtureGitFlags,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "Fixture base",
      ],
      fixtureGitOptions,
    );
    return await fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
const provenance = (sourceId) => ({ kind: "runtime", sourceId });

test("compiled order materializes, activates and shares index, status and lifecycle", async () =>
  fixture(async (root) => {
    const source = compiled();
    const result = await materializeOrder(
      source,
      provenance("compiled-fixture"),
      { root, surfaces: ["fixture.source"] },
    );
    assert.equal(result.workOrderId, "WO-900");
    assert.equal(result.workOrder.workOrderId, result.workOrderId);
    assert.notEqual(source.workOrderId, result.workOrderId); // caller's compiled input is immutable
    const authority = readFileSync(join(root, result.workOrderPath), "utf8");
    assert.equal(checkGeneratedSections(authority, result.workOrderPath), true);
    assert.equal(
      parseDependencies(authority, result.workOrderPath).source,
      "typed",
    );
    const index = readIndex(root, []);
    assert.equal(index.rows[0].phase, "active");
    assert.equal(index.rows[0].authorityLink, "derived/WO-900-derived.md");
    assert.deepEqual(index.rows[0].provenance, result.provenance);
    run(root, "scripts/work-orders.mjs", ["index", "--check"]);
    const indexText = readFileSync(
      docPath(root, "workOrders", "README.md"),
      "utf8",
    );
    assert.match(indexText, /\[WO-900\]: derived\/WO-900-derived\.md/);
    assert.match(indexText, /Authority: .*\]\(derived\/WO-900-derived\.md\)/);

    const status = JSON.parse(
      run(root, "scripts/resume.mjs", [
        "status",
        "--json",
        "--work-order",
        result.workOrderId,
      ]).stdout,
    );
    assert.equal(status.phase, "active");
    assert.deepEqual(status.provenance, result.provenance);
    assert.ok(status.legalNextActions.includes("implementation-ready"));
    const args = [
      "implementation-ready",
      "--harness",
      "fixture",
      "--harness-version",
      "1",
      "--model",
      "fixture",
      "--effort",
      "xhigh",
      "--source",
      "fixture",
      "--work-order",
      result.workOrderId,
    ];
    // A derived order declares numbered criteria, so each executor completion
    // reads the handoff ledger, one line per criterion (WO-173).
    const ledger = () =>
      write(
        root,
        docRelative(root, "evidence", `${result.workOrderId}/handoff.md`),
        `${declaredCriteria(
          readFileSync(join(root, result.workOrderPath), "utf8"),
        )
          .map(({ id }) => `**Criterion ${id}:** met. Fixture evidence.`)
          .join("\n")}\n`,
      );
    ledger();
    run(root, "scripts/resume.mjs", args);
    assert.equal(
      readControl(root).orders.get(result.workOrderId).state.phase,
      "ready-to-verify",
    );
    assert.equal(projectDerivedOrders(root)[0].phase, "ready-to-verify");
    const runtime = JSON.parse(
      run(root, "packages/skeleton/dist/src/dotln.js", [
        "status",
        "--store",
        join(root, "runtime-store"),
        "--json",
      ]).stdout,
    );
    assert.deepEqual(runtime.derivedOrders, projectDerivedOrders(root));
    const flags = args.slice(1);
    const actor = {
      harness: "fixture",
      harnessVersion: "1",
      model: "fixture",
      effort: "xhigh",
      source: "fixture",
    };
    // A failed receipt names its basis in its findings block (WO-249).
    const report = (path, verdict = "pass") =>
      write(
        root,
        path,
        `# Synthetic lifecycle receipt\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n${verdict === "fail" ? `\n<!-- dotln-findings:start -->\n${JSON.stringify([{ id: "F1", route: "blocking", class: "escape", summary: "A fixture regression.", basis: { regression: "the fixture behavior main had" }, reproduction: `docs/evidence/${result.workOrderId}/regression.md` }])}\n<!-- dotln-findings:end -->\n` : ""}`,
      );
    for (const verdict of ["fail", "pass"]) {
      run(root, "scripts/resume.mjs", [
        "verify",
        "--work-order",
        result.workOrderId,
      ]);
      report(
        readControl(root).orders.get(result.workOrderId).state
          .latestVerificationPath,
        verdict,
      );
      run(root, "scripts/resume.mjs", [
        "verification-result",
        verdict,
        ...flags,
      ]);
      if (verdict === "fail") {
        run(root, "scripts/resume.mjs", [
          "fix",
          "--work-order",
          result.workOrderId,
        ]);
        ledger();
        run(root, "scripts/resume.mjs", ["repair-complete", ...flags]);
      }
    }
    run(root, "scripts/resume.mjs", [
      "final-review",
      "--work-order",
      result.workOrderId,
    ]);
    report(
      readControl(root).orders.get(result.workOrderId).state.finalReviewPath,
    );
    run(root, "scripts/resume.mjs", ["final-review-result", "pass", ...flags]);
    assert.equal(
      readControl(root).orders.get(result.workOrderId).state.phase,
      "closed",
    );
    const count = eventsForOrder(readControl(root), result.workOrderId).length;
    await materializeOrder(source, provenance("compiled-fixture"), {
      root,
      surfaces: ["fixture.source"],
    });
    assert.equal(
      eventsForOrder(readControl(root), result.workOrderId).length,
      count,
    );
  }));

test("allocation replay, interrupted authority recovery and retry preserve one identity", async () =>
  fixture(async (root) => {
    const one = await materializeOrder(compiled(), provenance("retry"), {
      root,
      activate: false,
    });
    const control = readControl(root);
    const replay = controlFromSources(control.sources);
    assert.deepEqual(
      [...replayAllocations(control)],
      [...replayAllocations(replay)],
    );
    unlinkSync(join(root, one.workOrderPath)); // simulate crash after durable allocation
    const recovered = await materializeOrder(compiled(), provenance("retry"), {
      root,
    });
    assert.equal(recovered.workOrderId, one.workOrderId);
    const again = await materializeOrder(compiled(), provenance("retry"), {
      root,
    });
    assert.equal(again.workOrderId, one.workOrderId);
    assert.deepEqual(
      eventsForOrder(readControl(root), one.workOrderId).map((e) => e.type),
      ["WorkOrderIdentityAllocated", "WorkOrderActivated"],
    );
    await assert.rejects(
      materializeOrder(
        { ...compiled(), objective: "Different contract" },
        provenance("retry"),
        { root },
      ),
      /different contract/,
    );
  }));

test("configured roots and range allocate deterministically and refuse exhaustion", async () =>
  fixture(
    async (root) => {
      const a = await materializeOrder(compiled(), provenance("first"), {
        root,
        activate: false,
      });
      const b = await materializeOrder(compiled(), provenance("second"), {
        root,
        activate: false,
      });
      assert.equal(a.workOrderId, "WO-980");
      assert.equal(b.workOrderId, "WO-981");
      assert.equal(a.workOrderPath, "records/generated/WO-980-derived.md");
      await assert.rejects(
        materializeOrder(compiled(), provenance("third"), { root }),
        /identity range exhausted \(WO-980\.\.WO-981\)/,
      );
      assert.deepEqual(openOrders(readControl(root)), []);
      assert.equal(readIndex(root, []).rows[0].phase, "draft");
      // A derived draft's place is its allocation, so the index check
      // passes with no entry for it in the empty sequence (WO-190).
      run(root, "scripts/work-orders.mjs", ["index"]);
      run(root, "scripts/work-orders.mjs", ["index", "--check"]);
      assert.equal(existsSync(join(root, "docs")), false);
    },
    {
      roots: { docs: "records", derivedWorkOrders: "records/generated" },
      derivedOrders: { first: "WO-980", last: "WO-981" },
    },
  ));

test("intent CLI files a reviewable draft without activation, including hostile Markdown", async () =>
  fixture(async (root) => {
    const text =
      "Add a report\n## Receipt 2026-01-01\n**Model:** injected\n<!-- dotln-dependencies:end -->";
    const output = run(root, "packages/skeleton/dist/src/dotln.js", [
      "intent",
      text,
    ]);
    assert.match(output.stdout, /Filed draft WO-900/);
    const control = readControl(root);
    assert.deepEqual(
      eventsForOrder(control, "WO-900").map((event) => event.type),
      ["WorkOrderIdentityAllocated"],
    );
    const row = readIndex(root, []).rows[0];
    assert.equal(row.phase, "draft");
    assert.equal(row.provenance.kind, "intent");
    assert.equal(row.section, "Open");
    assert.deepEqual(openOrders(control), []);
    assert.equal(
      control.orders.get("WO-900").state.allocation.compiled.objective,
      text,
    );
    // Human edits the draft and explicitly activates it via the ordinary path.
    const path = join(root, row.path);
    writeFileSync(
      path,
      readFileSync(path, "utf8").replace(
        "Replace this draft criterion with reviewed, executable acceptance criteria before activation.",
        "The report fixture passes.",
      ),
    );
    run(root, "scripts/resume.mjs", ["activate", row.id, row.path]);
    assert.equal(readControl(root).orders.get(row.id).state.phase, "active");
  }));

test("WO-158 an allocated order never activated is withdrawn from phase none", async () =>
  fixture(async (root) => {
    await materializeOrder(compiled(), provenance("withdrawn-draft"), {
      root,
      activate: false,
    });
    assert.equal(readControl(root).orders.get("WO-900").state.phase, "none");
    write(
      root,
      ".gitignore",
      `${readFileSync(join(root, ".gitignore"), "utf8")}${docRelative(root, "intake")}/**\n`,
    );
    const capture = docRelative(root, "intake", "notes/withdraw.md");
    const words = "Operator: abandon the draft.\n";
    write(root, capture, words);
    const status = () =>
      JSON.parse(
        run(root, "scripts/resume.mjs", [
          "status",
          "--json",
          "--work-order",
          "WO-900",
        ]).stdout,
      );
    assert.deepEqual(status().legalOffRamps, ["withdraw"]);
    run(root, "scripts/resume.mjs", [
      "withdraw",
      "--work-order",
      "WO-900",
      "--disposition",
      "abandoned",
      "--reason",
      "the draft is no longer wanted",
      "--capture",
      capture,
      "--capture-hash",
      `sha256:${createHash("sha256").update(words).digest("hex")}`,
      "--harness",
      "human",
      "--harness-version",
      "not-applicable",
      "--model",
      "human",
      "--effort",
      "unknown",
      "--source",
      "operator-attested",
    ]);
    assert.equal(status().phase, "withdrawn");
    assert.equal(status().withdrawal.disposition, "abandoned");
    assert.deepEqual(
      eventsForOrder(readControl(root), "WO-900").map((event) => event.type),
      ["WorkOrderIdentityAllocated", "WorkOrderWithdrawn"],
    );
    assert.equal(readIndex(root, []).rows[0].section, "Withdrawn");
  }));

test("typed blockers retain a recoverable allocation and ordinary activation refusal", async () =>
  fixture(async (root) => {
    await assert.rejects(
      materializeOrder(compiled(), provenance("blocked"), {
        root,
        dependencies: [
          {
            workOrderId: "WO-500",
            relation: "hard",
            reason: "Fixture prerequisite",
          },
        ],
      }),
      /Fixture prerequisite/,
    );
    const state = readControl(root).orders.get("WO-900").state;
    assert.equal(state.phase, "none");
    assert.equal(existsSync(join(root, state.workOrderPath)), true);
    assert.deepEqual(
      eventsForOrder(readControl(root), "WO-900").map((event) => event.type),
      ["WorkOrderIdentityAllocated"],
    );
  }));

function childMaterialize(root, sourceId) {
  const source = `import {materializeOrder} from ${JSON.stringify(pathToFileURL(join(TOOL_ROOT, "scripts/lib/derived-orders.mjs")).href)}; console.log(JSON.stringify(await materializeOrder(${JSON.stringify(compiled())},${JSON.stringify(provenance(sourceId))},{root:${JSON.stringify(root)},activate:false})));`;
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["--input-type=module", "-e", source],
      {
        cwd: root,
        env: { ...process.env, CODEX_THREAD_ID: "" },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let out = "",
      err = "";
    child.stdout.on("data", (s) => (out += s));
    child.stderr.on("data", (s) => (err += s));
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve(JSON.parse(out)) : reject(new Error(err || out)),
    );
  });
}
test("two processes serialize allocations, including the same retry key", async () =>
  fixture(async (root) => {
    const pair = await Promise.all([
      childMaterialize(root, "concurrent-a"),
      childMaterialize(root, "concurrent-b"),
    ]);
    assert.deepEqual(pair.map((r) => r.workOrderId).sort(), [
      "WO-900",
      "WO-901",
    ]);
    const same = await Promise.all([
      childMaterialize(root, "same"),
      childMaterialize(root, "same"),
    ]);
    assert.deepEqual(
      same.map((r) => r.workOrderId),
      ["WO-902", "WO-902"],
    );
    assert.equal(replayAllocations(readControl(root)).size, 3);
  }));

test("generated shape and provenance refuse malformed edits and symlink destinations", async () =>
  fixture(async (root) => {
    const result = await fileIntent("Safe draft", { root, sourceId: "shape" });
    const path = join(root, result.workOrderPath),
      source = readFileSync(path, "utf8");
    assert.throws(
      () =>
        checkGeneratedSections(
          source + "\n## Receipt 2026-01-01\n",
          result.workOrderPath,
        ),
      /stable sections/,
    );
    assert.throws(
      () =>
        checkGeneratedSections(
          source + "\n### Receipt 2026-01-01\n",
          result.workOrderPath,
        ),
      /stable sections/,
    );
    writeFileSync(
      path,
      source.replace('"sourceId":"shape"', '"sourceId":"changed"'),
    );
    const refused = run(
      root,
      "scripts/resume.mjs",
      ["activate", result.workOrderId, result.workOrderPath],
      false,
    );
    assert.notEqual(refused.status, 0);
    assert.match(refused.stderr, /provenance differs/);
    assert.equal(
      readControl(root).orders.get(result.workOrderId).state.phase,
      "none",
    );
    writeFileSync(path, source);
    const destination = docPath(root, "derivedWorkOrders");
    const held = destination + "-held";
    mkdirSync(held);
    // A new configured derived root that is a symlink must refuse before allocation.
    symlinkSync(held, join(root, "linked"), "dir");
    write(
      root,
      "dotln.config.json",
      JSON.stringify({ version: 1, roots: { derivedWorkOrders: "linked" } }),
    );
    await assert.rejects(
      materializeOrder(compiled(), provenance("symlink"), { root }),
      /symlink|directory must remain inside/,
    );
    assert.equal(readControl(root).orders.size, 1);
  }));

test("invalid configured ranges refuse with the configuration path", async () =>
  fixture(
    async (root) => {
      assert.throws(
        () => loadConfig(root),
        /dotln.config.json.*first must not exceed/s,
      );
    },
    { derivedOrders: { first: "WO-999", last: "WO-900" } },
  ).catch((error) => {
    // fixture preparation resolves roots before invoking the body too.
    assert.match(error.message, /dotln.config.json.*first must not exceed/s);
  }));

test("a resident restarts with a derived compiled identity and unchanged control provenance", async () =>
  fixture(async (root) => {
    const original = fixtureGraph();
    const materialized = await materializeOrder(
      compiled(),
      provenance("resident-fixture"),
      { root },
    );
    original.graph.activeMechanics[0].workOrder.workOrderId =
      materialized.workOrderId;
    const spec = {
      kind: "script",
      effect: "repo.inspect",
      surface: "fixture.source",
      resources: { files: 1, lines: 0, tokens: 0 },
      command: [process.execPath, "-e", "process.stdout.write('ok\\n')"],
      cwd: root,
      timeoutMs: 1000,
      expectedStdoutSha256: createHash("sha256").update("ok\n").digest("hex"),
    };
    const configuration = {
      ...original,
      policyId: "fixture.progressive",
      actors: { probe: spec, widen: spec, peak: spec },
      evidence: ["verified-input"],
    };
    const directory = join(root, "runtime-store");
    write(root, "runtime-store/resident.json", JSON.stringify(configuration));
    const first = new ResidentHost({
      directory,
      policyId: configuration.policyId,
      now: () => 0,
    });
    await first.start();
    await first.tick();
    first.close();
    const restarted = new ResidentHost({
      directory,
      policyId: configuration.policyId,
      now: () => 1,
    });
    await restarted.start();
    try {
      await restarted.tick();
      const saved = replayResident(restarted.store.read()).state.resident
        .configuration;
      const resumed = requireCompiled(
        compileLoadout(saved.graph, saved.environment),
      ).workOrder;
      assert.equal(resumed.workOrderId, materialized.workOrderId);
      const again = await materializeOrder(
        compiled(),
        provenance("resident-fixture"),
        { root },
      );
      assert.equal(again.workOrderId, resumed.workOrderId);
      assert.deepEqual(
        projectDerivedOrders(root)[0].provenance,
        materialized.provenance,
      );
      assert.equal(replayAllocations(readControl(root)).size, 1);
    } finally {
      restarted.close();
    }
  }));

test("existing handwritten identities are preserved, UI filing shares the catalog, and active recovery does not restore a stale draft", async () =>
  fixture(async (root) => {
    const handwritten =
      "# WO-900 — Handwritten fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n";
    write(
      root,
      docRelative(root, "workOrders", "WO-900-handwritten.md"),
      handwritten,
    );
    const result = await materializeOrder(
      compiled(),
      { kind: "ui", sourceId: "ui-fixture" },
      { root },
    );
    assert.equal(result.workOrderId, "WO-901");
    assert.equal(
      readFileSync(
        docPath(root, "workOrders", "WO-900-handwritten.md"),
        "utf8",
      ),
      handwritten,
    );
    assert.equal(readIndex(root, []).rows.length, 2);
    unlinkSync(join(root, result.workOrderPath));
    await assert.rejects(
      materializeOrder(
        compiled(),
        { kind: "ui", sourceId: "ui-fixture" },
        { root },
      ),
      /activated authority is missing/,
    );
    assert.equal(existsSync(join(root, result.workOrderPath)), false);
  }));

test("direct activation refuses a derived authority root redirected outside the launchpad", async () =>
  fixture(async (root) => {
    const outside = realpathSync(
      createFixtureRoot(join(tmpdir(), "dotln-derived-outside-")),
    );
    try {
      const name = "WO-950-derived.md";
      writeFileSync(
        join(outside, name),
        "# WO-950 — Outside fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n",
      );
      symlinkSync(outside, join(root, "external-derived"), "dir");
      write(
        root,
        "dotln.config.json",
        JSON.stringify({
          version: 1,
          roots: { derivedWorkOrders: "external-derived" },
        }),
      );
      const result = run(
        root,
        "scripts/resume.mjs",
        ["activate", "WO-950", `external-derived/${name}`],
        false,
      );
      assert.notEqual(
        result.status,
        0,
        "outside authority activation must refuse",
      );
      assert.match(result.stderr, /invalid work-order authority path/);
      assert.equal(readControl(root).orders.size, 0);
    } finally {
      rmSync(outside, { recursive: true, force: true });
    }
  }));

// An allocation event keeps folding after the generated section list changes,
// and a corrupt one refuses only its order (WO-157 item 14, WO-120 D007).
test("WO-157 an allocation written under a superseded section set folds after the list changes", async () =>
  fixture(async (root) => {
    const kept = await materializeOrder(compiled(), provenance("superseded"), {
      root,
      activate: false,
    });
    const tool = realpathSync(
      createFixtureRoot(join(tmpdir(), "dotln-sections-")),
    );
    try {
      mkdirSync(join(tool, "scripts"));
      cpSync(join(TOOL_ROOT, "scripts/lib"), join(tool, "scripts/lib"), {
        recursive: true,
      });
      symlinkSync(join(TOOL_ROOT, "packages"), join(tool, "packages"));
      symlinkSync(join(TOOL_ROOT, "node_modules"), join(tool, "node_modules"));
      const contract = join(tool, "scripts/lib/derived-contract.mjs");
      const before = readFileSync(contract, "utf8");
      const after = before.replace(
        /(const sections = \[[^\]]*)\];/u,
        '$1  "Evidence",\n];',
      );
      assert.notEqual(after, before, "the fixture changes the section list");
      writeFileSync(contract, after);
      copyFixtureFiles(
        TOOL_ROOT,
        tool,
        "scripts/test-derived-orders.fixture-inputs.json",
      );
      const later = await import(
        pathToFileURL(join(tool, "scripts/lib/control-store.mjs")).href
      );
      const laterIndex = await import(
        pathToFileURL(join(tool, "scripts/work-orders.mjs")).href
      );
      let control;
      assert.doesNotThrow(() => {
        control = later.readControl(root);
      }, "a historical allocation folds after the section list changes");
      assert.equal(
        control.orders.get(kept.workOrderId).state.allocation.workOrderId,
        kept.workOrderId,
      );
      // The index judges the derived file by its allocation's section set.
      assert.equal(
        laterIndex
          .readIndex(root)
          .rows.find((row) => row.id === kept.workOrderId)?.phase,
        "draft",
      );
      // The pre-WO-157 shape carries no digest and folds as the WO-120 set.
      const segment = join(
        root,
        docRelative(root, "orders", `${kept.workOrderId}.jsonl`),
      );
      const events = readFileSync(segment, "utf8")
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
      delete events[0].sectionsHash;
      writeFileSync(
        segment,
        events.map((event) => `${JSON.stringify(event)}\n`).join(""),
      );
      assert.doesNotThrow(() => later.readControl(root));
    } finally {
      rmSync(tool, { recursive: true, force: true });
    }
  }));

test("WO-157 a corrupt allocation authority refuses only its own order", async () =>
  fixture(async (root) => {
    const corrupt = await materializeOrder(compiled(), provenance("corrupt"), {
      root,
      activate: false,
    });
    const readable = await materializeOrder(
      compiled(),
      provenance("readable"),
      { root },
    );
    const segment = join(
      root,
      docRelative(root, "orders", `${corrupt.workOrderId}.jsonl`),
    );
    const events = readFileSync(segment, "utf8")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    events[0].authority = events[0].authority.replace(
      "## Surfaces",
      "## Surfaces edited",
    );
    writeFileSync(
      segment,
      events.map((event) => `${JSON.stringify(event)}\n`).join(""),
    );
    let control;
    assert.doesNotThrow(() => {
      control = readControl(root);
    }, "one corrupt allocation leaves every other control read available");
    assert.equal(
      control.orders.get(readable.workOrderId).state.phase,
      "active",
    );
    assert.throws(
      () => selectWorkOrder(control, { workOrder: corrupt.workOrderId }),
      new RegExp(
        `unreadable work order ${corrupt.workOrderId}: .*${corrupt.workOrderId}\\.jsonl: .*requires stable sections`,
        "u",
      ),
    );
    run(root, "scripts/resume.mjs", [
      "status",
      "--work-order",
      readable.workOrderId,
    ]);
    const refused = run(
      root,
      "scripts/resume.mjs",
      ["status", "--work-order", corrupt.workOrderId],
      false,
    );
    assert.notEqual(refused.status, 0);
    assert.match(refused.stderr, new RegExp(`${corrupt.workOrderId}\\.jsonl`));
    // Without an explicit selection the unreadable order is named, never
    // passed over, and the index keeps it visible.
    const unselected = run(root, "scripts/resume.mjs", ["status"], false);
    assert.notEqual(unselected.status, 0);
    assert.match(
      unselected.stderr,
      new RegExp(`unreadable work order ${corrupt.workOrderId}: `, "u"),
    );
    const row = readIndex(root).rows.find(
      (candidate) => candidate.id === corrupt.workOrderId,
    );
    assert.equal(row?.phase, "unreadable");
    // Reads are scoped; the derived-order write path still refuses while a
    // retained allocation is corrupt, naming it, rather than allocating past it.
    await assert.rejects(
      materializeOrder(compiled(), provenance("after"), {
        root,
        activate: false,
      }),
      new RegExp(
        `${corrupt.workOrderId}-derived\\.md: generated authority requires stable sections`,
        "u",
      ),
    );
  }));

test("criterion ledger excludes an explicit dated retirement while preserving active numbering", () => {
  const criteria = declaredCriteria(`**Acceptance criteria (all required)**

1. The struck input remains a required test.
2. Struck by the 2026-10-21 pass and not judged: retained provenance.
3. Active final gate.
4. Struck by the 2026-10-21 pass: no explicit retirement from judgment.
`);
  assert.deepEqual(
    criteria.map((row) => row.id),
    ["1", "3", "4"],
  );
});

// Criteria 77 to 80 of WO-276 as the planning pass filed it, byte for byte.
// The third line of criterion 78 opens with the placeholder <option>, the
// name of an HTML block element, three spaces in where the item's text
// starts at four: the parser ends the list there and holds every later line,
// to the next blank line, as one raw block.
const WO276_FILED_CRITERIA = [
  "77. (J1) In a fixture instance whose configuration gives one option a",
  "   model and an effort, `node scripts/harness.mjs emit` writes that",
  "   option's worker definition with those two values and `node",
  "   scripts/harness.mjs check` passes; with the section absent, the",
  "   emitted worker definitions equal the ones the same tree emits from a",
  "   configuration that never held it. In the update fixture, an instance",
  "   that emitted with the section set is shown no worker definition as",
  "   locally modified by the update plan, and `node scripts/launchpad.mjs",
  "   verify` reports none as differing.",
  "78. (J2) In the same fixture, `npm run worker -- review --kind criteria --host",
  "   claude --order <id> --dry-run` and `npm run plan -- refute --model",
  "   <option>` each print a launch that names the configured model and",
  "   effort, and the drive's launch for a phase carries them in its",
  "   arguments, with `workers.verifierEffort` applied to the verifier's.",
  "79. (J3) A `workers` section with an unknown key, an option name outside the",
  "   compiled four, an effort outside the host's levels or a negative price",
  "   is refused when the configuration loads, naming the key.",
  "80. (J4) A launch that fails because its model was refused reports the",
  "   `workers` key that named the model, shown with the fixture launcher's",
  "   failing double.",
];
const criteriaSection = (lines) =>
  `**Acceptance criteria (all required)**\n\n${lines.join("\n")}\n\n**Non-goals:** none.\n`;
const unreadList = (line, pattern) => (error) => {
  assert.equal(error.code, LIST_UNREAD);
  assert.match(error.message, new RegExp(`\\bline ${line} `, "u"));
  assert.match(error.message, pattern);
  return true;
};
const RAW_BLOCK = /raw HTML block.*code span.*backslash.*re-wrap/su;

test("WO-276 F52: a criteria list the parser reads as shorter than written is refused, naming the line and the remedy, and never returned shorter", () => {
  // This order as filed: the reader refuses at the placeholder's line, where
  // it returned criteria 77 and 78 alone.
  assert.throws(
    () => declaredCriteria(criteriaSection(WO276_FILED_CRITERIA)),
    unreadList(14, RAW_BLOCK),
  );
  // Re-wrapped so that no line opens with the tag, as the order itself was,
  // the same criteria read whole.
  const rewrapped = [...WO276_FILED_CRITERIA];
  rewrapped.splice(
    10,
    2,
    "   claude --order <id> --dry-run` and `npm run plan -- refute --model <option>`",
    "   each print a launch that names the configured model and",
  );
  assert.deepEqual(
    declaredCriteria(criteriaSection(rewrapped)).map(({ id }) => id),
    ["77", "78", "79", "80"],
  );
  // The same class in shapes the failed review did not try: another element's
  // name, and a paragraph between items, which takes the items after it as
  // its own text because a list that does not start at one cannot interrupt
  // a paragraph.
  for (const [lines, line, pattern] of [
    [
      [
        "10. The page lists each open order with its",
        "   <legend> and nothing else.",
        "11. The second criterion holds.",
        "12. `npm test -- --review` passes.",
      ],
      4,
      RAW_BLOCK,
    ],
    [
      [
        "1. The first criterion holds.",
        "",
        "A note on the list.",
        "2. The second criterion holds.",
        "3. `npm test -- --review` passes.",
      ],
      6,
      /criterion 2, which the paragraph that begins on line 5 holds as its text/u,
    ],
  ])
    assert.throws(
      () => declaredCriteria(criteriaSection(lines)),
      unreadList(line, pattern),
    );
  // A label alone on its line whose paragraph runs on takes the items after
  // it as its text.
  assert.throws(
    () =>
      declaredCriteria(
        "**Acceptance criteria (all required)**\n2. The second criterion.\n3. The third.\n",
      ),
    unreadList(2, /criterion 2, which the label's own paragraph holds/u),
  );
  // A label or a heading the parser reads inside the list, where the block
  // then ends: a bold label opening a paragraph indented short of a two-digit
  // item's text, which takes the items after it as its own; a wrapped line
  // that opens with a number sign, under a two-digit item and under a
  // one-digit one.
  for (const [lines, line, kind] of [
    [
      [
        "9. Nine holds.",
        "10. Ten holds.",
        "",
        "   **Check:** the case named for criterion 10.",
        "11. Eleven holds.",
        "12. `npm run test:docs` passes.",
        "13. `npm test -- --review` passes.",
      ],
      6,
      "a label",
    ],
    [
      [
        "9. Nine holds.",
        "10. The page lists the",
        "   # Commands, and refuses a page without it.",
        "11. Eleven holds.",
        "12. Twelve holds.",
      ],
      5,
      "a heading",
    ],
    [
      [
        "1. The page lists the",
        "  # Commands, and refuses a page without it.",
        "2. Two holds.",
        "3. Three holds.",
      ],
      4,
      "a heading",
    ],
  ])
    assert.throws(
      () => declaredCriteria(criteriaSection(lines)),
      unreadList(line, new RegExp(`reads as ${kind} inside the list`, "u")),
    );
  // What that label or heading leads, to the next label or heading, is read
  // as well: a wrapped line that opens with a number sign and is followed by
  // one more wrapped line, which the parser makes a paragraph holding the
  // items after it, under a two-digit item and under a one-digit one; and a
  // note between the closing heading or label and the items that go on.
  for (const [lines, line, kind, goesOn] of [
    [
      [
        "9. Nine holds.",
        "10. The page lists the",
        "   # Commands section, and refuses a page",
        "   without it.",
        "11. Eleven holds.",
        "12. `npm run test:docs` passes.",
        "13. `npm test -- --review` passes.",
      ],
      5,
      "a heading",
      "criterion 11 on line 7",
    ],
    [
      [
        "1. The page lists the",
        "  # Commands section, and refuses a page",
        "  without it.",
        "2. `npm run test:docs` passes.",
        "3. `npm test -- --review` passes.",
      ],
      4,
      "a heading",
      "criterion 2 on line 6",
    ],
    [
      [
        "9. Nine holds.",
        "10. The page lists the",
        "   # Commands, and refuses a page.",
        "",
        "   A note on the page.",
        "",
        "11. Eleven holds.",
        "12. Twelve holds.",
      ],
      5,
      "a heading",
      "criterion 11 on line 9",
    ],
    [
      [
        "9. Nine holds.",
        "10. Ten holds.",
        "",
        "   **Check:** the case named for criterion 10.",
        "",
        "   A note.",
        "11. Eleven holds.",
        "12. Twelve holds.",
      ],
      6,
      "a label",
      "criterion 11 on line 9",
    ],
  ])
    assert.throws(
      () => declaredCriteria(criteriaSection(lines)),
      unreadList(
        line,
        new RegExp(`reads as ${kind} inside the list, and ${goesOn}`, "u"),
      ),
    );
  // A label or a heading the author set at the margin between groups of
  // criteria ends the list there too, and the refusal says so and names the
  // remedy for a group, not for a wrapped line.
  for (const [between, kind] of [
    ["**Part B:**", "a label"],
    ["### Part B criteria", "a heading"],
  ])
    assert.throws(
      () =>
        declaredCriteria(
          criteriaSection([
            "1. One holds.",
            "2. Two holds.",
            "",
            between,
            "",
            "3. Three holds.",
            "4. Four holds.",
          ]),
        ),
      unreadList(
        6,
        new RegExp(
          `sets ${kind} between the criteria, which ends their list there, and criterion 3 on line 8 goes on after it: the criteria are one numbered list under their label, so name a group in its items' text`,
          "u",
        ),
      ),
    );
  // Text that holds no item of the list is the author's and is read past: a
  // comment between two items, after which the list goes on, and the text a
  // derived order writes under its criteria (a paragraph, a bulleted list and
  // a code block) read whole.
  assert.deepEqual(
    declaredCriteria(
      criteriaSection([
        "1. The first criterion holds.",
        "<!-- the second criterion was moved to Part B -->",
        "2. The second criterion holds.",
      ]),
    ).map(({ id }) => id),
    ["1", "2"],
  );
  assert.deepEqual(
    declaredCriteria(
      '## Acceptance criteria\n\n1. One.\n2. Two.\n\nRequired evidence:\n- a passing case\n- a record\n\nOutput contract (JSON):\n\n    {"type":"object"}\n\n## Non-goals\n\n- none\n',
    ).map(({ id }) => id),
    ["1", "2"],
  );
  // Unchanged: an early order's criteria written as the label's prose hold no
  // list, and a heading's list reads as a label's does.
  assert.equal(
    declaredCriteria(
      "**Acceptance criteria:** the scenario runs twice and\nproduces identical traces.\n\n**Non-goals:** none.\n",
    ),
    null,
  );
  assert.deepEqual(
    declaredCriteria(
      "## Acceptance criteria\n\n1. One.\n2. Two.\n\n## Non-goals\n",
    ).map(({ id }) => id),
    ["1", "2"],
  );
});

test("WO-276 F52: whatever stands between the block's closing label or heading and the criteria that go on, the list is refused, and a later section's own list ends the reading", () => {
  // The family, generated: how the block can close (a wrapped line the parser
  // reads as a heading, a label indented short of the item's text, a label
  // or a heading set at the margin), what can stand after it (nothing, a
  // note, a second label, a second heading), and how the numbering goes on
  // (swallowed by a paragraph, or as a list after a blank line). Every one
  // reads short to the parser; every one is refused, at the closing line,
  // naming the criterion that goes on.
  const closings = [
    [
      ["   # Commands section, and refuses a page"],
      5,
      "reads as a heading inside the list",
    ],
    [
      ["", "   **Check:** the case named for criterion 10."],
      6,
      "reads as a label inside the list",
    ],
    [["", "**Part B:**"], 6, "sets a label between the criteria"],
    [["", "### Part B criteria"], 6, "sets a heading between the criteria"],
  ];
  const between = [
    [],
    ["", "   A note on the page."],
    ["", "   **Evidence:** the run's log."],
    ["", "   ## Usage section."],
  ];
  const resumptions = [
    ["   without it.", "11. Eleven holds.", "12. Twelve holds."],
    ["", "11. Eleven holds.", "12. Twelve holds."],
  ];
  let refused = 0;
  for (const [closing, line, says] of closings)
    for (const middle of between)
      for (const goesOn of resumptions) {
        const lines = [
          "9. Nine holds.",
          "10. The page lists the",
          ...closing,
          ...middle,
          ...goesOn,
        ];
        const at = lines.indexOf("11. Eleven holds.") + 3;
        assert.throws(
          () => declaredCriteria(criteriaSection(lines)),
          unreadList(
            line,
            new RegExp(
              `${says}.*criterion 11 on line ${at} goes on after it`,
              "u",
            ),
          ),
          lines.join("\n"),
        );
        refused += 1;
      }
  assert.equal(refused, 32);
  // The reviewers' own shapes beside the family: a label followed straight
  // by a second one; a one-digit item's wrapped heading, a blank line and a
  // second heading; and a group's label followed by a second label.
  for (const [lines, line, says] of [
    [
      [
        "9. Nine holds.",
        "10. Ten holds.",
        "",
        "   **Check:** the case named for criterion 10.",
        "   **Note:** a note.",
        "11. Eleven holds.",
        "12. Twelve holds.",
      ],
      6,
      "reads as a label inside the list, and criterion 11 on line 8",
    ],
    [
      [
        "1. The page lists the",
        "  # Commands section,",
        "",
        "  ## Usage section.",
        "2. Two holds.",
        "3. Three holds.",
      ],
      4,
      "reads as a heading inside the list, and criterion 2 on line 7",
    ],
    [
      [
        "1. One holds.",
        "2. Two holds.",
        "",
        "**Part B:**",
        "",
        "**More:**",
        "",
        "3. Three holds.",
        "4. Four holds.",
      ],
      6,
      "sets a label between the criteria, which ends their list there, and criterion 3 on line 10",
    ],
  ])
    assert.throws(
      () => declaredCriteria(criteriaSection(lines)),
      unreadList(line, new RegExp(says, "u")),
    );
  // A complete list followed by a section with a numbered list of its own,
  // which starts at one, or by prose with no item of the number that would
  // come next, is read whole.
  assert.deepEqual(
    declaredCriteria(
      "**Acceptance criteria (all required)**\n\n1. One holds.\n2. Two holds.\n\n**Non-goals:** none.\n\n## Execution plan\n\nThe steps, in order.\n\n1. Build.\n2. Run.\n3. Record.\n",
    ).map(({ id }) => id),
    ["1", "2"],
  );
  assert.deepEqual(
    declaredCriteria(
      "**Acceptance criteria (all required)**\n\n1. One holds.\n2. Two holds.\n\n**Non-goals:** none.\n\nA closing note that runs on\nto 3 lines and ends.\n",
    ).map(({ id }) => id),
    ["1", "2"],
  );
});

test("WO-276 F52: the handoff, the mission contract and a pass's filed orders meet the same refusal, and a stored receipt's subject still reads the list on", (t) => {
  const repo = createFixtureRoot(join(tmpdir(), "dotln-criteria-refused-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const workOrderPath = "docs/work-orders/WO-999-fixture.md";
  const order = `# WO-999 — Fixture (v9.9.9)\n\n**Model:** any.\n\n**Effort:** executor high; verifier high; reviewer high.\n\n**Objective:** fixture.\n\n${criteriaSection(
    [
      "1. The first criterion holds.",
      "2. The command prints the chosen value as",
      "<section> and nothing else.",
      "3. The third criterion holds.",
      "4. `npm run test:docs` passes.",
      "5. `npm test -- --review` passes.",
    ],
  )}`;
  write(repo, workOrderPath, order);
  write(
    repo,
    "docs/evidence/WO-999/handoff.md",
    "**Criterion 1:** met — fixture.\n**Criterion 2:** met — fixture.\nself-review: found 0; fixed 0; recorded 0\n",
  );
  const state = { workOrderId: "WO-999", workOrderPath };
  // An unreadable authority reads as no criteria and is not checked; a list
  // the reader refuses is not that, and the completion and the claims a
  // report's met lines make both refuse.
  assert.throws(
    () => readHandoffLedger(repo, state),
    unreadList(13, RAW_BLOCK),
  );
  assert.throws(
    () => readReportGateClaims(repo, state, "docs/evidence/WO-999/handoff.md"),
    unreadList(13, RAW_BLOCK),
  );
  assert.throws(() => missionContract(order), unreadList(13, RAW_BLOCK));
  // A pass that files or checks the order refuses it by path; a subject
  // rebuilt from a revision for a receipt filed before reads all five.
  assert.throws(
    () => parsePlanOrder(order, workOrderPath, "WO-999", { filing: true }),
    (error) =>
      error.message.startsWith(
        `${workOrderPath}: acceptance criteria: line 13 `,
      ) && error.cause?.code === LIST_UNREAD,
  );
  assert.deepEqual(
    parsePlanOrder(order, workOrderPath, "WO-999").criteria.map(({ id }) => id),
    [1, 2, 3, 4, 5].map((n) => `criterion:${n}`),
  );
});

test("a criteria list is refused wherever a block holds a line the line reader read as an item, whatever its number, by every reader, and a list that skips a number or prose after a complete list reads as before", (t) => {
  // The line reader the lifecycle used before the shared parser read every
  // line that opens a numbered item, to the next label or heading at the
  // margin, as an item with the number written on it, so a list that skips
  // a number keeps its identifiers. Where the parser leaves such a line
  // inside another block, the list is refused whatever the number: a
  // skipped one, a falling one or a repeated one is an item lost with its
  // text and the gate it names. Each shape below is one the line reader
  // read with more items than the parser.
  const fence = "```";
  for (const [lines, line, says] of [
    // A wrapped tag, a wrapped number sign and a label indented short of a
    // two-digit item's text, each before a skipped number.
    [
      [
        "1. The command prints",
        "  <option> and the result.",
        "3. `npm run test:docs` passes.",
        "4. `npm test -- --review` passes.",
      ],
      4,
      /raw HTML block.*holds criterion 3 on line 5/u,
    ],
    [
      [
        "1. The command prints",
        "  # Commands and the result.",
        "3. `npm run test:docs` passes.",
        "4. `npm test -- --review` passes.",
      ],
      4,
      /reads as a heading inside the list, and criterion 3 on line 5/u,
    ],
    [
      [
        "9. Nine holds.",
        "10. Ten holds.",
        "",
        "   **Check:** the fixture.",
        "12. `npm run test:docs` passes.",
        "13. `npm test -- --review` passes.",
      ],
      6,
      /reads as a label inside the list, and criterion 12 on line 7/u,
    ],
    // A paragraph that takes an item after a skip as its own text, and a
    // two-digit item's wrapped tag before a skip of three.
    [
      [
        "1. One holds.",
        "2. Two holds.",
        "",
        "A note on the list.",
        "4. Four holds.",
        "5. Five holds.",
      ],
      7,
      /criterion 4, which the paragraph that begins on line 6 holds/u,
    ],
    [
      [
        "10. The page lists each open order with its",
        "   <legend> and nothing else.",
        "14. Fourteen holds.",
        "15. Fifteen holds.",
      ],
      4,
      /raw HTML block.*holds criterion 14 on line 5/u,
    ],
    // A swallowed item whose number falls below the last one read, and one
    // that repeats a number an item holds, with the gate it names.
    [
      [
        "1. One holds.",
        "3. The command prints",
        "  <option> and the result.",
        "2. Two holds.",
      ],
      5,
      /raw HTML block.*holds criterion 2 on line 6/u,
    ],
    [
      [
        "1. One holds.",
        "2. The command prints",
        "  <option> and the result.",
        "2. `npm test -- --review` passes.",
      ],
      5,
      /raw HTML block.*holds criterion 2 on line 6/u,
    ],
    // A wrapped line that opens a fence of backticks or of tildes, which
    // holds the items after it as code: with the next number, with a skip,
    // under a two-digit item, and closed again before the last item.
    ...[
      [`  ${fence}json fence and nothing else.`, "2. Two holds.", 2],
      [`  ${fence}json fence and nothing else.`, "3. Three holds.", 3],
      ["  ~~~ fence and nothing else.", "2. Two holds.", 2],
    ].map(([wrapped, next, number]) => [
      [
        "1. The reply wraps its JSON in a",
        wrapped,
        next,
        "9. `npm test -- --review` passes.",
      ],
      4,
      new RegExp(
        `fenced code block.*holds criterion ${number} on line 5.*closing fence`,
        "u",
      ),
    ]),
    [
      [
        "10. The reply wraps its JSON in a",
        `   ${fence}json fence and nothing else.`,
        "14. Fourteen holds.",
        "15. Fifteen holds.",
      ],
      4,
      /fenced code block.*holds criterion 14 on line 5/u,
    ],
    [
      [
        "1. The reply wraps its JSON in a",
        `  ${fence}json fence, then`,
        "2. Two holds.",
        `  ${fence} and nothing else.`,
        "3. Three holds.",
      ],
      4,
      /fenced code block.*holds criterion 2 on line 5/u,
    ],
    // A wrapped heading in the last criterion: the line reader read on to
    // the next label or heading at the margin, so a note's line there that
    // opens with any number was an item to it.
    [
      [
        "1. One holds.",
        "2. The page lists the",
        "  # Commands section.",
        "",
        "A note that wraps onto",
        "2026. It holds.",
      ],
      5,
      /reads as a heading inside the list, and criterion 2026 on line 8/u,
    ],
  ])
    assert.throws(
      () => declaredCriteria(criteriaSection(lines)),
      unreadList(line, says),
      lines.join("\n"),
    );
  // What reads as written, each as the line reader read it: a skip with the
  // tag escaped, or with a quotation or a bulleted list between the items
  // (the parser ends each at the item after it); a fence indented into the
  // item it belongs to; a group's label at the margin after which the
  // numbering skips, which ended the line reader's list as well (only the
  // next number after a label at the margin goes on, since prose after the
  // criteria may open a line with any other); and prose, a comment, a fence
  // and a later section's list after a complete list, whose lines open with
  // numbers no criterion holds.
  const after = (lines, rest) =>
    `**Acceptance criteria (all required)**\n\n${lines.join("\n")}\n\n${rest}`;
  for (const [text, ids] of [
    [
      criteriaSection([
        "1. The command prints",
        "  \\<option> and the result.",
        "3. `npm run test:docs` passes.",
        "4. `npm test -- --review` passes.",
      ]),
      ["1", "3", "4"],
    ],
    [
      criteriaSection([
        "1. One holds.",
        "",
        "> A quoted note.",
        "3. Three holds.",
        "4. Four holds.",
      ]),
      ["1", "3", "4"],
    ],
    [
      criteriaSection(["1. One holds.", "- a note on it", "3. Three holds."]),
      ["1", "3"],
    ],
    [
      criteriaSection([
        "1. The reply is",
        "",
        `   ${fence}json`,
        "   {}",
        `   ${fence}`,
        "",
        "3. Three holds.",
      ]),
      ["1", "3"],
    ],
    [
      criteriaSection([
        "1. One holds.",
        "2. Two holds.",
        "",
        "**Part B:**",
        "",
        "5. Five holds.",
        "6. Six holds.",
      ]),
      ["1", "2"],
    ],
    [
      after(
        ["1. One.", "2. Two.", "3. Three."],
        "**Non-goals:** the log keeps only the last\n10. Older entries are pruned by hand.\n",
      ),
      ["1", "2", "3"],
    ],
    [
      after(
        ["1. One.", "2. Two.", "3. Three."],
        "**Non-goals:** none.\n\n## Background\n\nThe rule was set in the pass of\n2026. It has not changed since.\n",
      ),
      ["1", "2", "3"],
    ],
    [
      after(
        ["1. One.", "2. Two."],
        "**Non-goals:** none.\n\n## Notes\n\n<!-- a note on\n5. a retired step -->\n",
      ),
      ["1", "2"],
    ],
    [
      after(
        ["1. One.", "2. Two."],
        "**Non-goals:** none.\n\n## Follow-ups\n\n5. Fifth.\n6. Sixth.\n",
      ),
      ["1", "2"],
    ],
    [
      after(
        ["1. One.", "3. Three."],
        "**Non-goals:** the list keeps\n2. as a reserved number.\n",
      ),
      ["1", "3"],
    ],
    [
      after(
        ["1. One.", "2. Two.", "3. Three."],
        `**Non-goals:** none.\n\n## Example\n\n${fence}\n4. a numbered example\n${fence}\n`,
      ),
      ["1", "2", "3"],
    ],
    [
      after(
        ["1. One holds.", "2. The page lists the", "  # Commands section."],
        "**Non-goals:** none.\n\n## Execution plan\n\n1. Build.\n2. Run.\n",
      ),
      ["1", "2"],
    ],
    [
      after(
        ["1. One holds.", "3. Three holds.", "4. Four holds."],
        "**Non-goals:** none.\n\n## Execution plan\n\nThe steps, in order.\n\n1. Build.\n2. Run.\n",
      ),
      ["1", "3", "4"],
    ],
    [
      after(
        ["9. Nine holds.", "11. Eleven holds."],
        "**Non-goals:** none.\n\n## Execution plan\n\n1. Build.\n2. Run.\n",
      ),
      ["9", "11"],
    ],
  ])
    assert.deepEqual(
      declaredCriteria(text).map(({ id }) => id),
      ids,
      text,
    );
  // Every reader of the list meets the same refusal on an existing order
  // that skips a number: the handoff (where a judgment of the first item
  // alone had passed), the claims a report's met lines make, the mission
  // contract, the index's criteria screen and a pass's filing; for a wrapped
  // tag and for a wrapped fence. The same order with the tag escaped hands
  // off with every item judged.
  const repo = createFixtureRoot(join(tmpdir(), "dotln-criteria-skipped-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const workOrderPath = "docs/work-orders/WO-999-fixture.md";
  const state = { workOrderId: "WO-999", workOrderPath };
  const orderWith = (wrapped) =>
    `# WO-999 — Fixture (v9.9.9)\n\n**Model:** any.\n\n**Effort:** executor high; verifier high; reviewer high.\n\n**Objective:** fixture.\n\n${criteriaSection(
      [
        "1. The command prints",
        `  ${wrapped} and the result.`,
        "3. `npm run test:docs` passes.",
        "4. `npm test -- --review` passes.",
      ],
    )}`;
  for (const [wrapped, block] of [
    ["<option>", "raw HTML block"],
    [`${fence}json`, "fenced code block"],
  ]) {
    const order = orderWith(wrapped);
    write(repo, workOrderPath, order);
    write(
      repo,
      "docs/evidence/WO-999/handoff.md",
      "**Criterion 1:** met — fixture.\nself-review: found 0; fixed 0; recorded 0\n",
    );
    const swallowed = unreadList(
      12,
      new RegExp(`${block}.*criterion 3 on line 13`, "u"),
    );
    assert.throws(() => readHandoffLedger(repo, state), swallowed);
    assert.throws(
      () =>
        readReportGateClaims(repo, state, "docs/evidence/WO-999/handoff.md"),
      swallowed,
    );
    assert.throws(() => missionContract(order), swallowed);
    assert.throws(
      () => criteriaAdvisories("WO-999", order),
      (error) => error.cause?.code === LIST_UNREAD,
    );
    assert.throws(
      () => parsePlanOrder(order, workOrderPath, "WO-999", { filing: true }),
      (error) => error.cause?.code === LIST_UNREAD,
    );
  }
  write(repo, workOrderPath, orderWith("\\<option>"));
  write(
    repo,
    "docs/evidence/WO-999/handoff.md",
    "**Criterion 1:** met — fixture.\n**Criterion 3:** met — fixture.\n**Criterion 4:** met — fixture.\nself-review: found 0; fixed 0; recorded 0\n",
  );
  const ledger = readHandoffLedger(repo, state);
  assert.deepEqual(ledger.met, ["1", "3", "4"]);
  assert.deepEqual(ledger.claims.document, ["3"]);
  assert.deepEqual(ledger.claims.review, ["4"]);
  assert.deepEqual(
    missionContract(orderWith("\\<option>")).criteria.map(
      ({ number }) => number,
    ),
    [1, 3, 4],
  );
});
