#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { decodeLog } from "@dotln/kernel";
import { compileVerificationTask } from "@dotln/compiler";
import {
  deriveRepairOrder,
  repairContract,
  repairNextAction,
} from "../../../packages/skeleton/dist/src/repair.js";
import {
  createRepairFixture,
  fixtureHost,
  disposeRepairFixture,
} from "../../../packages/skeleton/dist/test/repair-fixture.js";
import { snapshotResult } from "../../../packages/skeleton/dist/test/verification-worktree-fixture.js";
import { fixtureGit } from "../../../packages/skeleton/dist/test/source-change-fixture.js";
const mode = process.argv[2];
assert.ok(["--write", "--check"].includes(mode));
const output = {
  schemaVersion: 1,
  provenance:
    "Synthetic writer/verifier doubles; real scratch Git commits, macOS confined verification checks and host SIGKILL. No live model repair claim.",
  projection:
    "Portable assertions omit physical paths, random commit identities, raw output and equality hashes; full source and executable assertions are in fixture.mjs and repair.test.ts.",
  cases: [],
};
const launches = (root, name) =>
  readFileSync(join(root, name), "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
for (const kind of ["success", "exhaustion", "kill-recovery"]) {
  const fixture = await createRepairFixture();
  try {
    assert.equal(
      process.platform,
      "darwin",
      "recorded proof requires macOS confinement",
    );
    const capsule = compileVerificationTask(
      "portable_verify",
      fixture.original.criteria,
      fixture.subject,
    );
    const finding = snapshotResult({
      capsule,
      episodeId: "fixture",
      command: { commandId: "fixture" },
    }).findings[0];
    const input = { ...fixture.original, subject: fixture.subject, round: 0 };
    const derivation = deriveRepairOrder(finding, input);
    assert.equal(derivation.kind, "derived");
    const negative = [
      { ...finding, likelySurface: ["outside.txt"] },
      {
        ...finding,
        reproductionSteps: [...finding.reproductionSteps, "node outside.mjs"],
      },
      { ...finding, evidenceRefs: [] },
    ].map((f) => deriveRepairOrder(f, input));
    assert.ok(negative.every((d) => d.kind === "NeedsHuman"));
    let kill = null;
    if (kind === "kill-recovery") {
      const code = `import {RepairHost} from ${JSON.stringify(new URL("../../../packages/skeleton/dist/src/repair-host.js", import.meta.url).href)}; import {repairFixtureOptions} from ${JSON.stringify(new URL("../../../packages/skeleton/dist/test/repair-fixture.js", import.meta.url).href)}; await new RepairHost({...repairFixtureOptions(process.argv[1]),afterRepairCommit(){process.kill(process.pid,'SIGKILL');}}).run();`;
      const result = spawnSync(
        process.execPath,
        ["--input-type=module", "-e", code, fixture.root],
        { encoding: "utf8", timeout: 60000 },
      );
      assert.equal(result.signal, "SIGKILL", result.stderr);
      kill = {
        signal: result.signal,
        writerDispatchesBeforeResume: launches(
          fixture.root,
          "repair-launches.jsonl",
        ).length,
      };
    }
    const host = fixtureHost(fixture.root, kind === "exhaustion"),
      state = await host.run();
    const writers = launches(fixture.root, "repair-launches.jsonl"),
      verifiers = launches(fixture.root, "verifier-launches.jsonl");
    assert.equal(
      state.status,
      kind === "exhaustion" ? "exhausted" : "complete",
    );
    assert.equal(writers.length, kind === "exhaustion" ? 2 : 1);
    assert.ok(
      verifiers.every(
        (v) =>
          JSON.stringify(v.capsule.subject.snapshot.contract) ===
          JSON.stringify(repairContract(fixture.original.workOrder)),
      ),
    );
    const events = decodeLog(host.options.store.read());
    output.cases.push({
      kind,
      status: state.status,
      nextAction: repairNextAction(state),
      round: state.round,
      writerDispatches: writers.length,
      verifierDispatches: verifiers.length,
      contractUnchanged: true,
      derivedSurfaces: derivation.order.surfaces,
      derivedTests: derivation.order.tests.map((t) => t.command),
      refusedInputs: negative.map(({ kind, offending }) => ({
        kind,
        offending,
      })),
      repairDiffPaths: fixtureGit(
        host.sourceHost().tree.path,
        "diff",
        "--name-only",
        state.order.executionBaseCommit,
        state.currentCommit,
      ).split("\n"),
      originalTestOutcomes: fixture.subject.evidence.map((e) => ({
        command: e.automatedTest,
        outcome: e.outcome,
      })),
      finalTestOutcomes: state.subject.evidence.map((e) => ({
        command: e.automatedTest,
        outcome: e.outcome,
      })),
      lastFinding: state.finding
        ? {
            criterionId: state.finding.criterionId,
            severity: state.finding.severity,
            observed: state.finding.observed,
            expected: state.finding.expected,
            likelySurface: state.finding.likelySurface,
          }
        : null,
      eventTypes: events.map((e) => e.type),
      kill,
    });
  } finally {
    disposeRepairFixture(fixture.root);
  }
}
const path = new URL("repair-proof.json", import.meta.url),
  text = JSON.stringify(output, null, 2) + "\n";
if (mode === "--write") writeFileSync(path, text, { flag: "wx" });
else assert.equal(readFileSync(path, "utf8"), text);
console.log(
  `${mode === "--write" ? "Recorded" : "Checked"} bounded repair, exhaustion, containment and SIGKILL recovery proof.`,
);
