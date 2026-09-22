import test from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
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
  readControl,
  eventsForOrder,
  openOrders,
} from "./lib/control-store.mjs";
import { controlFromSources } from "./lib/control-store.mjs";
import { parseDependencies } from "./lib/dependencies.mjs";
import { readIndex } from "./work-orders.mjs";
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
const write = (root, path, source) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), source);
};
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
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-derived-")));
  const git = (...args) => {
    const result = spawnSync(
      "git",
      [
        "-c",
        "core.hooksPath=/dev/null",
        "-c",
        "commit.gpgsign=false",
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        ...args,
      ],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
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
    git("init", "--initial-branch=main");
    assert.equal(realpathSync(git("rev-parse", "--show-toplevel")), root);
    git("add", ".");
    git("commit", "-qm", "Fixture base");
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
    const report = (path) =>
      write(
        root,
        path,
        `# Synthetic lifecycle receipt\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`,
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
      mkdtempSync(join(tmpdir(), "dotln-derived-outside-")),
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
