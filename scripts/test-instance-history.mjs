import {
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import "./test-fixture-temporary.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { TOOL_ROOT } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import {
  copyCore,
  fixtureEnvironment,
  json,
  linkDependencies,
  runner,
  write,
} from "./fixtures/instance-with-history/support.mjs";

const fixture = join(TOOL_ROOT, "scripts/fixtures/instance-with-history");
const events = (root, path) =>
  readFileSync(join(root, path), "utf8").trim().split("\n").map(JSON.parse);
const snapshot = (root) =>
  JSON.parse(
    readFileSync(join(root, "docs/work-orders/README.md"), "utf8")
      .split("\n")
      .find((line) => line.startsWith("<!-- dotln-workstreams: "))
      .slice("<!-- dotln-workstreams: ".length, -4),
  );

// The control supplies older reader files in the scratch core; both arms
// otherwise execute this exact clone, update, check and assertion sequence.
export function exerciseHistory({ prepareSource } = {}) {
  const started = performance.now();
  const scratch = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-instance-history-")),
  );
  const c = runner(fixtureEnvironment());
  const core = join(scratch, "core"),
    instance = join(scratch, "instance"),
    target = join(scratch, "target");
  const result = { checks: [], selfMembers: [], elapsedMs: 0 };
  try {
    const manifest = json(fixture, "manifest.json"),
      bundle = join(fixture, manifest.bundle.file);
    assert.equal(
      createHash("sha256").update(readFileSync(bundle)).digest("hex"),
      manifest.bundle.sha256,
      "committed history bundle digest",
    );
    for (const [branch, root] of [
      ["main", instance],
      ["fixture-target", target],
    ]) {
      c.git(scratch, "clone", "-q", "--branch", branch, bundle, root);
      c.configure(root);
    }
    c.git(target, "branch", "-m", "main");
    c.node(instance, "worktree", "clone", "target", target);
    assert.equal(c.git(instance, "rev-parse", "HEAD"), manifest.refs.instance);
    assert.equal(c.git(target, "rev-parse", "HEAD"), manifest.refs.target);
    assert.ok(
      manifest.shapes.some(
        (shape) =>
          shape.id === "closed-self-without-field" && shape.order === "WO-002",
      ),
    );
    assert.doesNotMatch(
      readFileSync(
        join(instance, "docs/work-orders/WO-002-history.md"),
        "utf8",
      ),
      /^\*\*Workstream:\*\*/mu,
    );
    // Establish the shapes from immutable records before the update can act.
    const amendments = events(instance, "docs/control/plan-refutations.jsonl");
    const bound = amendments.find(
      (row) =>
        row.type === "PlanExecutionAmended" && row.workOrderId === "WO-001",
    );
    assert.ok(bound, "WO-001 retains its bound amendment");
    const receipt = json(
      instance,
      `docs/planning/refutations/${bound.receiptId}.json`,
    );
    assert.doesNotMatch(
      c.git(
        instance,
        "show",
        `${receipt.subject.revision}:docs/work-orders/WO-001-history.md`,
      ),
      /^\*\*Workstream:\*\*/mu,
      "the filed order lacked the field",
    );
    assert.doesNotMatch(
      c.git(instance, "show", "HEAD^:docs/work-orders/WO-001-history.md"),
      /^\*\*Workstream:\*\*/mu,
      "the field was added in the final fixture commit",
    );
    assert.ok(
      c
        .git(instance, "show", "HEAD^:docs/control/orders/WO-001.jsonl")
        .split("\n")
        .map(JSON.parse)
        .some(
          (row) =>
            row.type === "FinalReviewCompleted" && row.verdict === "pass",
        ),
      "WO-001 closed before the field was added",
    );
    assert.equal(
      amendments.some((row) => row.type === "PlanExecutionAmendmentWithdrawn"),
      false,
      "no amendment withdrawal in the fixture",
    );
    assert.match(
      readFileSync(
        join(instance, "docs/work-orders/WO-001-history.md"),
        "utf8",
      ),
      /^\*\*Workstream:\*\* WS-001$/mu,
    );
    for (const id of ["WO-001", "WO-002"])
      assert.equal(
        events(instance, `docs/control/orders/${id}.jsonl`).findLast(
          (row) => row.type === "FinalReviewCompleted",
        ).verdict,
        "pass",
        `${id} closed`,
      );
    const moved = events(instance, "docs/control/orders/WO-003.jsonl").find(
      (row) => row.type === "TargetRecordsCommitted",
    );
    assert.ok(moved.records.some((row) => row.kind === "decisions"));
    assert.equal(
      existsSync(join(instance, "docs/evidence/WO-003/decisions.md")),
      false,
    );
    const movedDecision = moved.records.find((row) => row.kind === "decisions");
    const movedBytes = c.run(target, "git", [
      "show",
      `${moved.commit}:${movedDecision.path}`,
    ]);
    c.ok(movedBytes, "WO-003 moved decisions at the bound commit");
    assert.equal(
      createHash("sha256").update(movedBytes.stdout).digest("hex"),
      movedDecision.sha256,
    );
    assert.ok(
      amendments.some(
        (row) =>
          row.type === "PlanExecutionAmended" &&
          row.decisionId === "WO-003-D001",
      ),
    );
    const activation = events(
      instance,
      "docs/control/orders/WO-004.jsonl",
    ).find((row) => row.type === "WorkOrderActivated");
    assert.notEqual(activation.baseCommit, c.git(target, "rev-parse", "main"));
    c.git(target, "merge-base", "--is-ancestor", activation.baseCommit, "main");
    const protectedPaths = c
      .git(
        instance,
        "ls-files",
        "docs/control/orders",
        "docs/control/plan-refutations.jsonl",
        "docs/work-orders/WO-*",
        "docs/workstreams/WS-*",
        "docs/planning/refutations",
        "docs/evidence",
        "docs/verifications",
        "docs/final-reviews",
      )
      .split("\n")
      .filter(Boolean);
    const records = new Map(
      protectedPaths.map((path) => [path, readFileSync(join(instance, path))]),
    );

    copyCore(core, c);
    if (prepareSource) {
      prepareSource(core, c);
      c.commit(core, "test: reader control");
    }
    c.git(instance, "switch", "-qc", "chore/kit-update");
    c.commit(instance, "test: unrelated update branch commit");
    const preview = c.node(
      core,
      "launchpad",
      "export",
      "--update",
      instance,
      "--preview",
    );
    assert.match(preview, /Prune: \d+ candidates; \d+ bytes/);
    result.preview = preview
      .split("\n")
      .find((line) => line.startsWith("Prune:"));
    const update = c.node(
      core,
      "launchpad",
      "export",
      "--update",
      instance,
      "--apply",
    );
    assert.doesNotMatch(
      update,
      /^refused:/mu,
      "the fixture must take the current kit without retaining edited kit files",
    );
    result.update = update
      .split("\n")
      .find((line) => line.startsWith("kit files:"));
    for (const path of [
      "scripts/lib/plan-continuation.mjs",
      "scripts/lib/work-order-workstream.mjs",
      "scripts/work-orders.mjs",
    ])
      assert.deepEqual(
        readFileSync(join(instance, path)),
        readFileSync(join(core, path)),
        `the updated instance runs the offered ${path}`,
      );
    linkDependencies(instance);
    write(
      instance,
      "docs/control/local/terms.txt",
      "SyntheticForbiddenHistoryTerm\n",
    );
    for (const [path, bytes] of records)
      assert.deepEqual(
        readFileSync(join(instance, path)),
        bytes,
        `kit update preserved ${path}`,
      );

    // Run all checks so the base control exposes both independent failures.
    for (const args of [
      ["run", "sync"],
      ["run", "work-orders", "--", "index", "--check"],
      ["run", "plan", "--", "check"],
      ["run", "test:docs"],
      ["run", "work-orders", "--", "index"],
    ]) {
      const before = performance.now(),
        checked = c.run(instance, "npm", args);
      result.checks.push({
        command: `npm ${args.join(" ")}`,
        exitCode: checked.status,
        elapsedMs: Math.round(performance.now() - before),
        output: `${checked.stdout ?? ""}${checked.stderr ?? ""}`,
        ...(checked.error ? { error: checked.error.message } : {}),
      });
    }
    result.selfMembers = snapshot(instance)
      .workstreams.flatMap((stream) => stream.members)
      .filter((member) => member.repository === "self");
    result.main = c.git(instance, "rev-parse", "refs/heads/main");
    result.branch = c.git(instance, "rev-parse", "HEAD");
    for (const [path, bytes] of records)
      assert.deepEqual(
        readFileSync(join(instance, path)),
        bytes,
        `instance checks preserved ${path}`,
      );
    result.integration = exerciseIntegrationClose(instance, scratch, c);
    return result;
  } finally {
    result.elapsedMs = Math.round(performance.now() - started);
    rmSync(scratch, { recursive: true, force: true });
  }
}

// Exercise the installed kit after the immutable-history assertions. All new
// history is synthetic and its remote is another directory in this fixture.
function exerciseIntegrationClose(instance, scratch, c) {
  const order = "WO-005",
    workOrderPath = "docs/work-orders/WO-005-cleanup.md";
  c.commit(instance, "test: current updated kit");
  c.git(instance, "switch", "main");
  c.git(instance, "merge", "--ff-only", "chore/kit-update");
  write(
    instance,
    workOrderPath,
    "# WO-005 — Synthetic cleanup (v9000.0.1)\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Release classification:** patch. Fixture only.\n\n**Objective:** Preserve the synthetic cleanup history.\n\n**Acceptance criteria (all required)**\n\n1. Preserve the synthetic cleanup history.\n\n**Non-goals:** Live publication.\n",
  );
  const readme = readFileSync(join(instance, "README.md"), "utf8");
  write(
    instance,
    "README.md",
    readme.replace(
      /<!-- DOTLN-RELEASE-BEGIN -->[\s\S]*?<!-- DOTLN-RELEASE-END -->/u,
      "<!-- DOTLN-RELEASE-BEGIN -->\nThis source prepares DotLn `v9000.0.1`.\n<!-- DOTLN-RELEASE-END -->",
    ),
  );
  c.commit(instance, "test: synthetic integration authority");
  const origin = join(scratch, "cleanup-origin.git");
  c.git(scratch, "clone", "--bare", "-q", instance, origin);
  c.git(instance, "remote", "set-url", "origin", origin);
  const subject = join(scratch, "cleanup-worktree");
  c.git(instance, "worktree", "add", "-q", "-b", "wo-005", subject);
  linkDependencies(subject);
  c.node(subject, "harness", "emit");
  write(
    subject,
    "docs/control/local/terms.txt",
    "SyntheticForbiddenHistoryTerm\n",
  );
  c.node(subject, "resume", "activate", order, workOrderPath);
  write(instance, "synthetic-main.txt", "New main bytes.\n");
  c.commit(instance, "test: advance main before integration");
  const before = c.git(instance, "stash", "list", "--format=%H");
  c.node(instance, "worktree", "integrate", order);
  const receipt = json(subject, "docs/control/local/integration.json");
  assert.equal(receipt.complete, true);
  assert.equal(receipt.stashDropped, receipt.stash);
  assert.equal(
    readFileSync(join(subject, "synthetic-main.txt"), "utf8"),
    "New main bytes.\n",
  );
  assert.equal(c.git(instance, "stash", "list", "--format=%H"), before);
  const actor = {
    harness: "human",
    harnessVersion: "fixture",
    model: "human",
    effort: "unknown",
    source: "operator-attested",
  };
  const flags = Object.entries(actor).flatMap(([key, value]) => [
    `--${key === "harnessVersion" ? "harness-version" : key}`,
    value,
  ]);
  const report = `# Synthetic judgment\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n\n**Criterion 1:** met — synthetic history preserved.\n`;
  write(
    subject,
    `docs/evidence/${order}/handoff.md`,
    report + "\nself-review: found 0; fixed 0; recorded 0\n",
  );
  c.node(subject, "resume", "implementation-ready", ...flags);
  c.node(subject, "resume", "verify");
  write(subject, `docs/verifications/${order}/VER-001.md`, report);
  c.node(subject, "resume", "verification-result", "pass", ...flags);
  c.node(subject, "resume", "final-review");
  write(subject, `docs/final-reviews/${order}/FINAL-001.md`, report);
  c.node(subject, "resume", "final-review-result", "pass", ...flags);
  c.node(subject, "sync");
  c.commit(subject, "test: synthetic lifecycle close");
  c.git(instance, "merge", "--ff-only", "wo-005");
  c.git(instance, "push", "-q", "origin", "main");
  c.node(instance, "worktree", "finish", order);
  assert.equal(existsSync(subject), false);
  const prune = JSON.parse(c.node(instance, "harness", "prune"));
  assert.deepEqual(
    prune.candidates.filter((row) =>
      ["integration-stash", "temporary-root"].includes(row.kind),
    ),
    [],
    "integration and close leave no stash or stale temporary root",
  );
  return {
    phase: "closed",
    stashBefore: before ? before.split("\n").length : 0,
    stashAfter: c.git(instance, "stash", "list") ? 1 : 0,
    candidates: prune.census,
  };
}

export function assertHistory(result) {
  const failures = result.checks
    .filter((row) => row.exitCode !== 0)
    .map((row) => `${row.command} (exit ${row.exitCode}):\n${row.output}`);
  for (const member of result.selfMembers)
    if (
      member.integration !== "current" ||
      member.stale !== "no" ||
      member.base !== result.main ||
      member.targetCommit !== result.main
    )
      failures.push(
        `${member.workOrderId}: self member must read current at main, stale no; observed ${JSON.stringify(member)}`,
      );
  assert.equal(
    result.selfMembers.length,
    2,
    "two closed self members are checked",
  );
  assert.notEqual(
    result.branch,
    result.main,
    "index refresh runs from an advanced update branch",
  );
  assert.deepEqual(failures, [], failures.join("\n"));
}

if (isMainModule(import.meta.url))
  test("a kit update preserves and admits the committed instance history", (t) => {
    const result = exerciseHistory();
    t.diagnostic(`instance-history fresh wall-clock ${result.elapsedMs} ms`);
    assertHistory(result);
  });
