#!/usr/bin/env node
import { spawnGit } from "./lib/git.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";
import { createProcessMonitor } from "./lib/process-monitor.mjs";
import {
  acquireHostLaneCapacity,
  acquireHostLanes,
  inheritedHostLease,
} from "./lib/host-lanes.mjs";
import {
  atomicJson,
  hostLaneCapacity,
  hostStateRoot,
  memoryBudgets,
  recordedHostLaneCapacity,
  schedulingBaseline,
  registerProcess,
  taskLauncher,
  holdTaskDescriptors,
} from "./lib/host-resources.mjs";
import {
  ensureHostGuard,
  incidentForProcess,
  registerGuardTree,
} from "./lib/host-guard-state.mjs";
import { availableParallelism, tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { startDeadline } from "../packages/skeleton/src/gate-deadlines.mjs";
import { evidenceSourceContent } from "../packages/skeleton/src/evidence-editions.mjs";
import { gateCriticalPath } from "./lib/gate-timeline.mjs";
import {
  beginGateRun,
  gateTreeHash,
  gateCodeIdentity,
  gateInstanceInputDigest,
  readGateChecks,
  readSharedRefs,
  recordGateChecks,
} from "./lib/gate-evidence.mjs";
import {
  buildOutputAttested,
  buildOutputDigest,
  coveringTaskResults,
} from "./lib/gate-reuse.mjs";
import {
  createReleaseFixtureContext,
  releaseCases,
} from "./lib/release-fixtures.mjs";
import { completeCoverage, suiteEnvironment } from "./lib/suite-evidence.mjs";
import {
  CONFINED_PARTIAL_CHECK,
  OUTSIDE_CONFINEMENT,
  detectHostConfinement,
  outsideOnly,
  confinementRefusal,
} from "./lib/host-confinement.mjs";

import { classifyDocumentFailures } from "./lib/document-failures.mjs";
import { evidenceSources } from "./lib/evidence-sources.mjs";
import {
  STRUCTURAL_TASKS,
  compileStaleRuntime,
} from "./lib/generated-artifacts.mjs";
export { STRUCTURAL_TASKS };
import { findLaunchpad } from "./lib/config.mjs";
import {
  productReadEnvironment,
  productReadObservations,
} from "./lib/product-read-guard.mjs";

const recordedSources = evidenceSources(findLaunchpad());

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
import { isKitRoot } from "../packages/skeleton/src/runtime-inputs.mjs";
export { isKitRoot };
const instanceSelection = (args, repo) =>
  isKitRoot(repo) && !args.includes("--only") && !args.includes("--machinery");
const node = (name, file, options = {}) => ({
  name,
  command: [process.execPath, file],
  ...options,
});
const nodeTests = (name, pattern, options = {}) => ({
  name,
  command: [
    process.execPath,
    "--test",
    "--test-reporter=tap",
    ...(options.skipPattern
      ? [`--test-skip-pattern=${options.skipPattern}`]
      : []),
    ...(options.namePattern
      ? [`--test-name-pattern=${options.namePattern}`]
      : []),
    ...(options.fileConcurrency
      ? [`--test-concurrency=${options.fileConcurrency}`]
      : []),
    pattern,
  ],
  needsBuild: true,
  ...options,
});
const VERTICAL_STATEMENT_PATTERN =
  "composed baseline (?:records source-bound failure judgments|walks requirement-voice wording)|resident consumes source-bound failure judgments|healthy negative wording";
// These shells each own a checked temporary root, Git repository and PATH.
const shell = (name, file) => ({
  name,
  command: ["bash", file],
  needsBuild: true,
});

// Machinery declarations select optional review checks by their own source paths.
export const machinerySources = {
  "sync-fixtures": [
    "scripts/check-role-oracle.mjs",
    "scripts/test-process-debt.mjs",
    "scripts/test-runner.mjs",
    "scripts/structural-checks.mjs",
    "scripts/lib/host-resources.mjs",
    "scripts/lib/gate-scheduling-baseline.json",
    "packages/skeleton/src/evidence-editions.mjs",
    "scripts/lib/evidence-fixture.mjs",
    "scripts/test-sync.mjs",
    "scripts/sync.mjs",
    "scripts/lib/generated-artifacts.mjs",
    "scripts/lib/build-freshness.mjs",
  ],
  "launchpad-planning": [
    "packages/kernel/src/types.ts",
    "packages/compiler/src/harness.ts",
    "packages/console/src/index.ts",
    "scripts/build.mjs",
    "scripts/bootstrap.mjs",
    "scripts/harness.mjs",
    "scripts/license-surfaces.mjs",
    "scripts/target-gate.mjs",
    "scripts/test-target-publication-fixture.mjs",
    "scripts/worktree.mjs",
    "scripts/launchpad.mjs",
    "scripts/kit/",
    "scripts/refute-plan.mjs",
    "scripts/lib/planning-followups.mjs",
    "scripts/lib/planning-conditions.mjs",
    "scripts/lib/plan-",
    "scripts/entropy.mjs",
    "scripts/lib/entropy-review.mjs",
    "scripts/meta.mjs",
    "scripts/lib/meta.mjs",
    "scripts/docs-check.mjs",
    "scripts/check-publication.mjs",
    "scripts/lib/reader-profiles.mjs",
    "scripts/reader.mjs",
    "scripts/work-orders.mjs",
    "scripts/lineage.mjs",
    "scripts/resume.mjs",
    "scripts/release.mjs",
    "scripts/lib/release-kit-runtime.mjs",
    "scripts/lib/release-records.mjs",
    "scripts/lib/harness.mjs",
    "scripts/harness-probe.mjs",
    "scripts/operator-control.mjs",
    "packages/skeleton/src/gate-evidence.mjs",
    "packages/skeleton/src/runtime-inputs.mjs",
    "packages/skeleton/src/writer-teardown.mjs",
    "packages/skeleton/src/usage-observation.mjs",
    "packages/compiler/src/codex-continuation.mjs",
    "scripts/test-launchpad-planning.mjs",
  ],
  "wo107-schema": [
    "corpus/harness/wo107-schema.test.mjs",
    "corpus/harness/profile.mjs",
    "corpus/harness/wo107-records.mjs",
    "corpus/harness/wo107-scenarios.mjs",
    "corpus/harness/wo107-bounded.mjs",
  ],
  "fixture-temp-root": [
    "scripts/test-temp-root.sh",
    "scripts/test-fixture-temp-root.sh",
  ],
  "harness-probe": [
    // Direct entry imports and literal first-party script inputs (WO-174).
    "packages/skeleton/src/discovery-sandbox.ts",
    "packages/skeleton/src/source-change-command.ts",
    "scripts/resume.mjs",
    "scripts/harness-probe.mjs",
    "scripts/lib/copilot-probe.mjs",
    "scripts/lib/copilot-qualification.mjs",
    "scripts/fixtures/copilot-probe-hook.mjs",
    "scripts/lib/subagent-probe.mjs",
    "scripts/fixtures/subagent-probe-hook.mjs",
    "scripts/lib/authority-probe.mjs",
    "scripts/fixtures/authority-effect.mjs",
    "scripts/test-authority-probe.mjs",
    "scripts/lib/writing-worker-probe.mjs",
    "scripts/probe-worker-hosts.mjs",
    "scripts/test-harness-probe.mjs",
    // The probes build their Codex argv and home through the launcher (WO-159).
    "packages/skeleton/src/worker-transport.ts",
  ],
  "harness-fixtures": [
    // Direct entry imports and literal first-party script inputs (WO-174).
    "scripts/lib/bounded-command.mjs",
    "packages/kernel/src/index.ts",
    "packages/compiler/src/artifact-identity.ts",
    "packages/compiler/src/index.ts",
    "packages/compiler/src/operator-control.mjs",
    "packages/skeleton/src/gate-deadlines.mjs",
    "scripts/bootstrap.mjs",
    "scripts/harness-entry.mjs",
    "scripts/harness.mjs",
    "scripts/lib/evidence-preparation.mjs",
    "scripts/lib/gate-evidence.mjs",
    "scripts/lib/harness-runtime.mjs",
    "scripts/lib/terms.mjs",
    "scripts/lib/validation.mjs",
    "scripts/release.mjs",
    "scripts/test-fixture-temporary.mjs",
    "packages/skeleton/src/presence-heartbeat.ts",
    "packages/skeleton/src/presence-signals.ts",
    "packages/skeleton/src/resident-store.ts",
    "scripts/terms.mjs",
    "scripts/harness-context.mjs",
    "scripts/lib/harness-context.mjs",
    "packages/skeleton/src/feedback-boundary.ts",
    "packages/skeleton/src/gate-evidence.mjs",
    "packages/skeleton/src/runtime-inputs.mjs",
    "scripts/test-harness.mjs",
    "scripts/test-runner.mjs",
    "scripts/lib/harness-prune.mjs",
    // Prune usage retention follows preservation's collision names (WO-171).
    "scripts/lib/intake-reconciliation.mjs",
    "scripts/lib/worktree-material.mjs",
    "scripts/lib/worktree-removal.mjs",
    "scripts/lib/git.mjs",
    // The observer's journal-read failure case rewrites the control store's
    // reader in its fixture copy.
    "scripts/lib/control-store.mjs",
    "packages/skeleton/src/writer-teardown.mjs",
    "scripts/lib/stash-drop.mjs",
    // Prune lists stale Codex episode homes through the launcher (WO-159).
    "packages/skeleton/src/worker-transport.ts",
    "scripts/test-observed-facts.mjs",
    "scripts/lib/executor-handoff.mjs",
    "scripts/resume.mjs",
    "scripts/work-orders.mjs",
    "scripts/worktree.mjs",
    "packages/skeleton/src/observed-facts.ts",
    "packages/skeleton/src/correction-observation.mjs",
    "scripts/test-target-harness.mjs",
    "scripts/lib/harness.mjs",
    "packages/compiler/src/harness.ts",
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/version.ts",
    "packages/skeleton/src/subagent-budget.ts",
    "packages/skeleton/src/harness-command.ts",
    "packages/skeleton/src/loadouts/",
  ],
  harness: [
    "scripts/lib/bounded-command.mjs",
    // The check action's stale host-rule report (WO-221), loaded on demand.
    "scripts/lib/target-worktrees.mjs",
    // Direct entry imports and literal first-party script inputs (WO-174).
    "packages/skeleton/src/usage-observation.mjs",
    "scripts/lib/evidence-preparation.mjs",
    "scripts/lib/harness-prune.mjs",
    "scripts/lib/harness-runtime.mjs",
    "packages/skeleton/src/presence-heartbeat.ts",
    "packages/skeleton/src/presence-signals.ts",
    "packages/skeleton/src/resident-store.ts",
    "scripts/harness.mjs",
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/version.ts",
    "packages/skeleton/src/subagent-budget.ts",
    "packages/skeleton/src/gate-evidence.mjs",
    "packages/skeleton/src/runtime-inputs.mjs",
    "scripts/lib/harness.mjs",
    "packages/compiler/src/harness.ts",
    "packages/skeleton/src/loadouts/",
  ],
  // The suite scans every non-test script for a literal document root, so
  // any changed script selects it (WO-169 item 5, WO-085 D014).
  "configuration-root": [
    "scripts/",
    "packages/skeleton/src/runtime-inputs.mjs",
  ],
  "harness-context": [
    "scripts/lib/process-budget.mjs",
    "scripts/lib/harness.mjs",
    "scripts/harness-context.mjs",
    "scripts/lib/harness-context.mjs",
  ],
  "harness-evidence": recordedSources["harness"],
  "plan-refutation": [
    // Direct entry imports and literal first-party script inputs (WO-174).
    "packages/kernel/src/index.ts",
    "scripts/lib/control-store.mjs",
    "scripts/lib/control.mjs",
    "scripts/lib/dependencies.mjs",
    "scripts/lib/legacy-cost.mjs",
    "scripts/lib/terms.mjs",
    "scripts/work-orders.mjs",
    "packages/skeleton/src/plan-refutation-host.ts",
    "packages/skeleton/src/plan-refutation-fake.ts",
    "packages/skeleton/src/worker-transport.ts",
    "scripts/test-plan-refutation.mjs",
    "scripts/refute-plan.mjs",
    "scripts/lib/reader-profiles.mjs",
    "scripts/lib/plan-",
    // plan-failures reads the persisted correction ids through meta.mjs.
    "scripts/lib/meta.mjs",
    "packages/skeleton/src/plan-refutation-protocol.ts",
    "packages/skeleton/src/loadouts/plan-refuter.ts",
    "packages/skeleton/src/entropy-review-protocol.ts",
    "packages/skeleton/src/entropy-review-fake.ts",
    "packages/skeleton/src/loadouts/entropy-reducer.ts",
    "scripts/test-entropy-review.mjs",
    "scripts/entropy.mjs",
    "scripts/lib/entropy-review.mjs",
  ],
  "runner-fixtures": [
    "scripts/check-role-oracle.mjs",
    "scripts/lib/fixture-inputs.mjs",
    "scripts/structural-checks.mjs",
    "scripts/lib/generated-artifacts.mjs",
    "scripts/lib/build-freshness.mjs",
    "scripts/lib/github-body.mjs",
    "scripts/lib/target-gate.mjs",
    "scripts/target-gate.mjs",
    "scripts/lib/target-worktrees.mjs",
    "scripts/harness.mjs",
    "scripts/test-host-guard.test.mjs",
    "scripts/host-guard.mjs",
    "scripts/lib/host-resources.mjs",
    "scripts/lib/gate-scheduling-baseline.json",
    "scripts/lib/host-footprint.c",
    "scripts/lib/host-lock.c",
    "scripts/lib/host-guard-state.mjs",
    "scripts/lib/host-lanes.mjs",
    "scripts/lib/process-monitor.mjs",
    "scripts/lib/bounded-command.mjs",
    "scripts/fixtures/memory-growth.c",
    "scripts/fixtures/detached-descendant.c",
    "scripts/lib/plan-failures.mjs",
    "corpus/harness/bounded-findings.mjs",
    "corpus/harness/wo102-",
    "corpus/harness/generate-cadence-corpus.mjs",
    "scripts/lib/machinery-coverage.mjs",
    "scripts/lib/product-read-guard.mjs",
    "scripts/lib/evidence-sources.mjs",
    // Direct entry imports and literal first-party script inputs (WO-174).
    "packages/compiler/src/artifact-identity.ts",
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/loadouts/contributor.ts",
    "packages/skeleton/src/version.ts",
    "scripts/authority-evidence.mjs",
    "scripts/build.mjs",
    "scripts/fixtures/historical-compiler-loader.mjs",
    "scripts/lib/lifecycle-evidence.mjs",
    "scripts/lib/release-records.mjs",
    "scripts/reactor-identity.mjs",
    "scripts/test-plan-refutation.mjs",
    "scripts/lib/gate-timeline.mjs",
    "scripts/measure-gates.mjs",
    "scripts/lib/gate-evidence.mjs",
    // The passing-row lookup `npm test` reuses and completions read (WO-173).
    "scripts/lib/gate-reuse.mjs",
    "scripts/lib/case-reporter.mjs",
    "scripts/lib/case-marker.mjs",
    "scripts/lib/control-store.mjs",
    "scripts/lib/handoff-ledger.mjs",
    "scripts/lib/planning-conditions.mjs",
    "scripts/license-surfaces.mjs",
    "scripts/lib/host-confinement.mjs",
    "scripts/test-runner.mjs",
    "packages/skeleton/src/evidence-editions.mjs",
    "scripts/test-runner.test.mjs",
    "scripts/test-vertical.mjs",
    "scripts/test-vertical-judgment.mjs",
    "scripts/test-vertical.recovery.mjs",
    "scripts/lib/document-gate-stubs.mjs",
    "scripts/lib/document-failures.mjs",
    "scripts/lib/evidence-jsonl.mjs",
    "scripts/check-registrations.mjs",
    "scripts/test-gate-deadlines.mjs",
    "scripts/test-release-fixtures.mjs",
    "scripts/test-release.sh",
    "scripts/test-reader-fixture.mjs",
    "scripts/test-close-admission.mjs",
    "scripts/lib/worktree-removal.mjs",
    "packages/skeleton/src/writer-teardown.mjs",
    "scripts/lib/suite-evidence.mjs",
    "scripts/lib/release-fixtures.mjs",
    // The release shell runs the library through this entry point (WO-163).
    "scripts/release-fixtures.mjs",
    "packages/skeleton/src/gate-evidence.mjs",
    "packages/skeleton/src/runtime-inputs.mjs",
    "packages/skeleton/src/gate-deadlines.mjs",
    // The 29-case check reads the split launchpad files and their case list.
    "scripts/test-launchpad-export.mjs",
    "scripts/test-launchpad-update.mjs",
    "scripts/test-launchpad-seeds.mjs",
    "scripts/fixtures/launchpad-cases.json",
    "scripts/fixtures/target-worktree-cases.json",
    "scripts/test-target-worktree-",
    "scripts/lib/target-worktree-fixture.mjs",
  ],
  "process-debt": [
    "scripts/lib/fixture-inputs.mjs",
    // Direct entry imports and literal first-party script inputs (WO-174).
    "packages/compiler/src/feedback.ts",
    "packages/compiler/src/index.ts",
    "packages/compiler/src/operator-control.mjs",
    "packages/skeleton/src/feedback-boundary.ts",
    "packages/skeleton/src/feedback-selfhost.ts",
    "packages/skeleton/src/gate-deadlines.mjs",
    "packages/skeleton/src/harness-command.ts",
    "packages/skeleton/src/observed-facts.ts",
    "packages/skeleton/src/writer-teardown.mjs",
    "scripts/bootstrap.mjs",
    "scripts/harness-context.mjs",
    "scripts/harness.mjs",
    "scripts/lib/adjacent-queue.mjs",
    "scripts/lib/gate-evidence.mjs",
    "scripts/lib/harness.mjs",
    "scripts/lib/plan-receipts.mjs",
    "scripts/meta.mjs",
    "scripts/operator-control.mjs",
    "scripts/refute-plan.mjs",
    "scripts/release.mjs",
    "scripts/resume.mjs",
    "scripts/test-beacon-fixture.mjs",
    "scripts/test-fixture-temporary.mjs",
    "packages/skeleton/src/correction-observation.mjs",
    "scripts/lib/meta.mjs",
    "scripts/lib/intake-reconciliation.mjs",
    "scripts/lib/worktree-material.mjs",
    "scripts/lib/worktree-removal.mjs",
    "scripts/lib/git.mjs",
    "packages/skeleton/src/writer-teardown.mjs",
    "scripts/lib/evidence-preparation.mjs",
    "scripts/lib/planning-followups.mjs",
    "scripts/lib/private-paths.mjs",
    "scripts/lib/planning-conditions.mjs",
    "scripts/build.mjs",
    "scripts/work-orders.mjs",
    "scripts/discover.mjs",
    "packages/skeleton/src/usage-observation.mjs",
    "scripts/test-process-debt.mjs",
    "packages/skeleton/fixtures/wo195-role-baseline.json",
    "packages/skeleton/fixtures/wo195-integrated-role-baseline.json",
    "packages/skeleton/fixtures/wo186-role-baseline.json",
    "packages/skeleton/fixtures/wo187-role-baseline.json",
    "packages/skeleton/fixtures/wo196-role-baseline.json",
    "packages/skeleton/fixtures/wo188-role-baseline.json",
    "packages/skeleton/fixtures/wo073-role-baseline.json",
    "packages/skeleton/fixtures/wo191-role-baseline.json",
    "packages/skeleton/fixtures/wo215-role-baseline.json",
    "packages/skeleton/fixtures/wo218-role-baseline.json",
    "scripts/test-helper-reuse.mjs",
    "scripts/lib/helpers.mjs",
    "scripts/lib/git.mjs",
    "scripts/lib/paths.mjs",
    "scripts/test-codex-session.mjs",
    "scripts/lib/harness-runtime.mjs",
    "scripts/lib/lifecycle-evidence.mjs",
    "scripts/lib/receipt-cost.mjs",
    "scripts/lib/worktree-material.mjs",
    "scripts/lib/process-budget.mjs",
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/version.ts",
    "packages/skeleton/src/subagent-budget.ts",
    "packages/skeleton/src/gate-evidence.mjs",
    "packages/skeleton/src/runtime-inputs.mjs",
  ],
  mutation: [
    // Direct entry imports and literal first-party script inputs (WO-174).
    "packages/compiler/src/compile.ts",
    "packages/compiler/src/normalize.ts",
    "packages/kernel/src/index.ts",
    "corpus/mutation/",
  ],
  // The inventories and the import closure they must follow (WO-157 item 12).
  "evidence-sources": [
    "scripts/lib/evidence-fixture.mjs",
    // Direct entry imports and literal first-party script inputs (WO-174).
    "packages/compiler/src/artifact-identity.ts",
    "packages/kernel/src/index.ts",
    "packages/skeleton/src/entropy-review-protocol.ts",
    "packages/skeleton/src/verification.ts",
    "packages/skeleton/src/worker-store.ts",
    "packages/skeleton/test/scenario.test.ts",
    "scripts/build.mjs",
    "scripts/lib/evidence-sources.mjs",
    "scripts/test-evidence-sources.mjs",
    "scripts/feedback-evidence.mjs",
    "packages/skeleton/src/feedback-audit.ts",
    "packages/skeleton/src/evidence-editions.mjs",
  ],
  // Any changed docs path, stub list or registry re-runs the registration
  // check under --review, not only under test:docs (WO-157 item 13).
  registrations: [
    // Direct entry imports and literal first-party script inputs (WO-174).
    "packages/kernel/src/index.ts",
    "docs/",
    "scripts/check-registrations.mjs",
    "scripts/lib/document-gate-stubs.mjs",
    "scripts/lib/document-failures.mjs",
    "scripts/lib/evidence-jsonl.mjs",
    "scripts/test-runner.mjs",
    "packages/kernel/test/fixtures/jsonl-protocols.json",
  ],
  "authority-evidence": recordedSources["authority"],
  "artifact-evidence": recordedSources["artifact-identity"],
  "verification-evidence": recordedSources["verification"],
  "feedback-evidence": recordedSources["feedback"],
  meta: [
    // Direct entry imports and literal first-party script inputs (WO-174).
    "scripts/lib/executor-handoff.mjs",
    "scripts/lib/plan-subject.mjs",
    "packages/skeleton/src/correction-observation.mjs",
    "scripts/lib/control-store.mjs",
    "scripts/lib/control-time.mjs",
    "scripts/lib/planning-followups.mjs",
    "scripts/lib/planning-conditions.mjs",
    "packages/skeleton/src/usage-observation.mjs",
    "scripts/meta.mjs",
    "scripts/lib/meta.mjs",
    "scripts/lib/receipt-cost.mjs",
    "scripts/lib/process-budget.mjs",
  ],
};
const protection = {
  "wo107-schema":
    "the WO-107 baseline's provenance hash matches its pinned collector bytes",
  format: "source and documentation retain the shared formatting rules",
  "fixture-temp-root":
    "temporary fixture cleanup stays inside its owned directory",
  publication:
    "published documentation links and edition locks match current sources",
  index: "the work-order index reflects authority files and lifecycle state",
  lineage:
    "ledger headings, references and chronological index match their source records",
  "lineage-fixtures":
    "ledger ordering and generated indexes preserve source text, anchors and history",
  "harness-probe":
    "host capability probes report observed behavior with bounded evidence",
  "authority-evidence":
    "authority evidence reproduces the registered boundary claims",
  "harness-fixtures":
    "writer, gate, planning, agent-budget and outside-write refusals preserve their boundaries",
  harness: "installed hooks and role text match the generated harness bundle",
  "harness-context":
    "role read contracts resolve and remain within cold-start bounds",
  "harness-evidence":
    "harness claim evidence matches the current bundle and observations",
  "plan-refutation":
    "planning receipts preserve judgments, amendments and carried orders",
  entropy:
    "the Entropy Reducer's receipt chain, filed pairs and disposed findings remain immutable and bound",
  "plan-refutation-current":
    "the current planning horizon retains its admitted receipt chain",
  "artifact-evidence":
    "artifact identity evidence matches the current compiler projection",
  "verification-evidence":
    "verification evidence matches the current result protocol",
  "feedback-evidence":
    "feedback evidence matches its registered sources and live edition",
  mutation:
    "mutation enumeration and execution preserve baselines and result integrity",
  declarations: "declared suite and copied fixture inputs cover direct imports",
  generated:
    "generated records and installed harness bytes are current before suites start",
  host: "host memory pressure admits suites only at a normal pressure level",
  "sync-fixtures":
    "regeneration follows dependencies, preserves manual authority and changes no current artifact",
  "runner-fixtures":
    "suite selection, scheduling, deadlines and diagnostics preserve evidence",
  "process-debt":
    "process observations, follow-ups and lifecycle handoffs retain their sources",
  meta: "decision indexes and process records match their current public sources",
  "evidence-sources":
    "a registered evidence source imports only registered or reasoned-excluded siblings, and a moved request protocol stales the feedback edition",
  registrations:
    "every JSONL under docs/ is an EventEnvelope stream or a classified protocol, and every document-gate script has a runner-fixture stub",
  plan: "planning authority, dependencies and follow-up records remain consistent",

  build: "source compiles into runnable packages",
  "kit-verify": "carried compiled files match the kit manifest",
  "release-surfaces":
    "release claims match component versions and reviewed notes",
  "release-preparation":
    "release preparation preserves source and chooses the classified target",
  "github-body": "published descriptions preserve reviewed content",
  "outward-lint":
    "outward artifacts have conventional shape and redacted vocabulary checks",
  "target-publish":
    "a target branch reaches its remote only from a bound episode, under an operator grant and after the outward lint",
  "target-worktree":
    "target start, selection, recovery and merged teardown keep code separate from launchpad records",
  "license-fixtures":
    "source-only publication preserves license and package privacy",
  "license-surfaces": "shipped license and private-package pins remain valid",
  "publication-fixtures":
    "public editions retain their reviewed source boundaries",
  "backup-intake": "private intake survives backup and recovery",
  resume: "work-order transitions preserve reports and legal phase order",
  checkpoint: "pending work can be recovered from named checkpoints",
  worktree: "isolated work and intake survive publish and close",
  "worktree-integration":
    "integration preserves recovery, both histories and authored conflicts without lifecycle events",
  release: "reviewed releases publish idempotently from merged main",
  kernel: "domain events and human judgment contracts replay consistently",
  compiler: "supports compile to the intended constraints and harness behavior",
  skeleton: "the local runtime executes work within admitted authority",
  console: "operators can inspect current work and recorded evidence",
  "work-orders-fixtures":
    "work-order lookup and dependencies identify executable work",
  "adjacent-queue": "operator steering controls the next bounded repair",
  "resident-bind":
    "binding a resident to the active order reads canonical state, names every stale subject before a launch line, and keeps physical paths in the ignored lane",
  "codex-continuation":
    "Codex restores only its owned unfinished task after compaction, continues once and yields to recovery controls",
  "authority-grants": "workers cannot grant themselves additional authority",
  "artifact-corpus":
    "artifact identity remains stable and collisions are refused",
};
function classifySuite(row) {
  const structural = STRUCTURAL_TASKS.includes(row.name);
  const machinery = Object.hasOwn(machinerySources, row.name);
  const document = Boolean(
    structural ||
    row.document ||
    [
      "release-surfaces",
      "authority-evidence",
      "artifact-evidence",
      "verification-evidence",
      "feedback-evidence",
      "harness",
      "harness-context",
      "harness-evidence",
      "meta",
    ].includes(row.name),
  );
  return {
    ...row,
    machinery,
    structural,
    generated: [
      "release-surfaces",
      "authority-evidence",
      "artifact-evidence",
      "verification-evidence",
      "feedback-evidence",
      "harness",
      "harness-evidence",
      "meta",
      "index",
      "lineage",
      "siblings",
      "publication",
    ].includes(row.name),
    document,
    product: !machinery && !document,
    protects:
      row.protects ??
      protection[row.name] ??
      `${row.name} validates its declared project surface`,
    sources: [...(row.sources ?? []), ...(machinerySources[row.name] ?? [])],
  };
}
export function changedMachinery(repo, table = suites, base = "origin/main") {
  // A sibling advancing main changes neither this branch's code nor its
  // selection. Compare against the shared ancestor, retaining local dirt.
  let mergeBase = spawnGit(["merge-base", "HEAD", base], {
    cwd: repo,
    encoding: "utf8",
  });
  if (mergeBase.status !== 0 && base === "origin/main")
    mergeBase = spawnGit(["merge-base", "HEAD", "main"], {
      cwd: repo,
      encoding: "utf8",
    });
  if (mergeBase.status !== 0) return table.filter((row) => row.machinery);
  base = mergeBase.stdout.trim();
  const run = spawnGit(
    ["diff", "--no-renames", "--name-only", "-z", base, "--"],
    {
      cwd: repo,
      encoding: "utf8",
    },
  );
  if (run.status !== 0) return table.filter((row) => row.machinery);
  // An order's work stays uncommitted until final review (WO-169 D007), so
  // the change includes its untracked files, which the diff omits (WO-173).
  const untracked = spawnGit(
    ["ls-files", "--others", "--exclude-standard", "-z"],
    { cwd: repo, encoding: "utf8" },
  );
  if (untracked.status !== 0) return table.filter((row) => row.machinery);
  const files = [
    ...new Set([...run.stdout.split("\0"), ...untracked.stdout.split("\0")]),
  ]
    .filter(Boolean)
    .filter((file) =>
      table.some(
        (row) =>
          row.machinery &&
          row.sources.some((source) => file.startsWith(source)),
      ),
    )
    .filter((file) => {
      // Reuse the evidence projection: release literals alone change no behavior.
      const before = spawnGit(["show", `${base}:${file}`], {
        cwd: repo,
        encoding: "utf8",
      });
      if (before.status !== 0) return true;
      try {
        return (
          evidenceSourceContent(file, before.stdout) !==
          evidenceSourceContent(file, readFileSync(join(repo, file), "utf8"))
        );
      } catch {
        return true;
      }
    });
  return table.filter(
    (row) =>
      row.machinery &&
      row.sources.some((source) =>
        files.some((file) => file === source || file.startsWith(source)),
      ),
  );
}

/** A suite's inputs for change detection: its declared sources and the
 * repository paths in its own command, a built package path standing for
 * the package. Product suites declare no sources, so their scripts and
 * packages are what the detection can see. */
const detectionSources = (row) => [
  ...(row.sources ?? []),
  ...[...(row.command ?? []), ...(row.args ?? [])]
    .filter(
      (word) =>
        typeof word === "string" &&
        /^(?:scripts|packages|corpus)\//u.test(word),
    )
    .map((word) => word.replace(/dist\/.*$/u, "")),
];

/** Suites whose latest recorded execution of any task did not pass, at any
 * identity: a failure not yet shown fixed leads the next run. Carried and
 * unstarted results are not executions. */
export function lastFailedSuites(rows) {
  const latest = new Map();
  const recordedAt = (row) =>
    typeof row?.recordedAt === "string" ? row.recordedAt : "";
  for (const row of [...rows].sort((a, b) =>
    recordedAt(a).localeCompare(recordedAt(b)),
  )) {
    const observed = row?.taskTimeline ?? row?.cases;
    if (!Array.isArray(observed)) continue;
    for (const result of observed)
      if (
        typeof result?.name === "string" &&
        result.executed === true &&
        !result.reused
      )
        latest.set(
          result.name,
          result.exitCode === 0 && !result.stopped && !result.timedOut,
        );
  }
  return [
    ...new Set(
      [...latest]
        .filter(([, passed]) => !passed)
        .map(([name]) => name.split(":")[0]),
    ),
  ].sort();
}

/** Suites whose inputs changed after the newest gate row was recorded,
 * judged by file modification time: the row's tree hash is a content digest
 * rather than a Git object, so the row's time is the only comparison point.
 * A touch without a content change costs nothing but an earlier place in
 * the queue; without a row every suite is unchanged. */
export function changedSinceLastGate(
  repo,
  table = suites,
  rows = readGateChecks(repo),
) {
  const since = rows
    // Document runs exercise no product suite, so they do not move the mark.
    .map((row) =>
      typeof row?.recordedAt === "string" && row.checkId !== "npm run test:docs"
        ? Date.parse(row.recordedAt)
        : NaN,
    )
    .filter(Number.isFinite)
    .reduce((latest, at) => Math.max(latest, at), -Infinity);
  if (!Number.isFinite(since))
    return { since: undefined, files: [], suites: [] };
  const options = { cwd: repo, encoding: "utf8" };
  const tracked = spawnGit(["ls-files", "-z"], options);
  const untracked = spawnGit(
    ["ls-files", "--others", "--exclude-standard", "-z"],
    options,
  );
  const at = new Date(since).toISOString();
  if (tracked.status !== 0 || untracked.status !== 0)
    return { since: at, files: [], suites: [] };
  const files = [
    ...new Set([
      ...tracked.stdout.split("\0"),
      ...untracked.stdout.split("\0"),
    ]),
  ]
    .filter(Boolean)
    .filter((file) => {
      try {
        return lstatSync(join(repo, file)).mtimeMs > since;
      } catch {
        return false;
      }
    });
  return {
    since: at,
    files,
    suites: table
      .filter((row) =>
        detectionSources(row).some((source) =>
          files.some((file) => file === source || file.startsWith(source)),
        ),
      )
      .map((row) => row.name),
  };
}

const buildSuite = (repo) =>
  isKitRoot(repo)
    ? node("kit-verify", "scripts/launchpad.mjs", {
        args: ["verify"],
        build: true,
        fast: true,
        outputs: [],
      })
    : node("build", "scripts/build.mjs", {
        fast: true,
        build: true,
        outputs: ["packages/*/dist"],
      });

// Every command from the 2026-09-09 chain has one declared owner below. Build
// deletion and shell glob assertions are replaced by atomic-build and expand().
export const suites = [
  {
    name: "format",
    command: ["npm", "run", "format:check", "--silent"],
    fast: true,
    document: true,
    preflight: true,
    instance: "document",
    timeoutMs: 30_000,
  },
  nodeTests("configuration-root", "scripts/test-configuration-root.mjs", {
    needsBuild: false,
    timeoutMs: 30_000,
    protects:
      "configuration and control-plane source declarations hold before suites start",
  }),
  node("registrations", "scripts/check-registrations.mjs", {
    timeoutMs: 30_000,
  }),
  node("declarations", "scripts/structural-checks.mjs", {
    args: ["declarations"],
    timeoutMs: 30_000,
  }),
  node("generated", "scripts/structural-checks.mjs", {
    args: ["generated"],
    timeoutMs: 120_000,
  }),
  node("host", "scripts/structural-checks.mjs", {
    args: ["host"],
    timeoutMs: 10_000,
  }),
  // The published runtime is ignored; its digest rides on the build's result.
  node("build", "scripts/build.mjs", {
    fast: true,
    build: true,
    outputs: ["packages/*/dist"],
  }),
  node("release-surfaces", "scripts/release.mjs", {
    instance: "document",
    args: ["check-surfaces", "--local"],
    fast: true,
    needsBuild: true,
    preflight: true,
  }),
  nodeTests("release-preparation", "scripts/test-release-preparation.mjs"),
  nodeTests("github-body", "scripts/test-github-body.mjs", {
    kit: "core-only: core outward-vocabulary control data",
  }),
  nodeTests("outward-lint", "scripts/test-outward-lint.mjs", {
    kit: "core-only: core outward-vocabulary control data",
    needsBuild: false,
  }),
  nodeTests("target-publish", "scripts/test-target-publish.mjs", {
    kit: "core-only: core outward-vocabulary control data",
  }),
  nodeTests("target-worktree", "scripts/test-target-worktree-start.mjs", {
    args: [
      "scripts/test-target-worktree-publish.mjs",
      "scripts/test-target-worktree-close.mjs",
      "scripts/test-target-worktree-release.mjs",
    ],
    fileConcurrency: 1,
    group: "target-worktree",
    groupLimit: 2,
    sources: [
      "scripts/test-target-worktree-",
      "scripts/lib/target-worktree-fixture.mjs",
    ],
  }),
  nodeTests("vertical", "scripts/test-vertical.mjs", {
    kit: "core-only: core outward-vocabulary control data",
    // Files expand into bounded tasks, partitioning the large statement matrix.
    args: [
      "scripts/test-vertical-judgment.mjs",
      "scripts/test-vertical.recovery.mjs",
    ],
    fileConcurrency: 2,
    loadSlots: 2,
    product: true,
    needs: OUTSIDE_CONFINEMENT,
    protects:
      "filed intent admission, common restartable vertical, repair lineage, readiness, typed stops and directory identity before effects",
  }),
  nodeTests("license-fixtures", "scripts/test-license-surfaces.mjs", {
    kit: "core-only: docs/LEGAL.md and core license fixtures",
  }),
  node("license-surfaces", "scripts/license-surfaces.mjs", {
    instance: "document",
    preflight: true,
    document: true,
  }),
  shell("fixture-temp-root", "scripts/test-fixture-temp-root.sh"),
  shell("publication-fixtures", "scripts/test-publication.sh"),
  shell("backup-intake", "scripts/test-backup-intake.sh"),
  {
    ...shell("resume", "scripts/test-resume.sh"),
    kit: "core-only: core legacy lifecycle and timing observations WO-030",
    document: true,
  },
  nodeTests("launchpad", "scripts/test-launchpad-export.mjs", {
    args: [
      "scripts/test-launchpad-update.mjs",
      "scripts/test-launchpad-seeds.mjs",
    ],
    fileConcurrency: 2,
    loadSlots: 2,
    group: "launchpad-files",
    groupLimit: 2,
    sources: [
      "scripts/test-launchpad-",
      "scripts/lib/launchpad-fixture.mjs",
      "scripts/launchpad.mjs",
      "scripts/kit/",
    ],
    kit: "core-only: package TypeScript and build configuration needed to export",
    // Each file owns two host slots, including its nested kit gates.
    // The fixture builds its committed copy's own packages with the running
    // install's toolchain and reads that copy's dist, never this checkout's.
    // The cold-start comparison reads this checkout's installed floor and
    // skills, so it runs in the launchpad-docs row.
    needsBuild: false,
    skipPattern: "\\[document\\]",
    protects:
      "launchpad export writes only manifest-listed kit files and instance seeds from the scripts' checkout's commit, carries the commit's compiled runtime and the harness bundle the export's own emit writes, refuses a non-empty destination, a dirty pinned input and a local-terms match, and the export passes harness check, activates its first order, emits control Beacons and reserves a Codex writer without package source",
  }),
  nodeTests("launchpad-planning", "scripts/test-launchpad-planning.mjs", {
    kit: "core-only: package TypeScript and build configuration needed to export",
    needsBuild: false,
    protects:
      "the planning command surface runs in an exported instance using its own records and synthetic judgments",
  }),
  nodeTests("launchpad-docs", "scripts/test-launchpad-export.mjs", {
    kit: "core-only: package TypeScript and build configuration needed to export",
    document: true,
    namePattern: "\\[document\\]",
    protects:
      "the cold-start bytes of every role inside an export are not larger than this checkout's",
  }),
  nodeTests("beacon-portability", "scripts/test-beacon-portability.mjs", {
    fast: true,
    // The absent skeleton dist copies are judged against a fresh build.
    needsBuild: true,
    protects:
      "control Beacon leaves keep one build-free home that no script imports from skeleton source or dist, and a copied control plane without the skeleton emits a decodable control Beacon",
  }),
  shell("checkpoint", "scripts/test-checkpoint.sh"),
  {
    ...shell("worktree", "scripts/test-worktree.sh"),
    kit: "core-only: docs/LEGAL.md and core release inputs",
  },
  nodeTests("worktree-integration", "scripts/test-worktree-integration.mjs", {
    kit: "core-only: core source and publication inputs",
    // Its reservation admits only the measured light peers.
    exclusive: true,
    overlap: 2,
  }),
  {
    ...shell("release", "scripts/test-release.sh"),
    kit: "core-only: core TypeScript and release records",
  },
  shell("work-orders-fixtures", "scripts/test-work-orders.sh"),
  node("publication", "scripts/check-publication.mjs", {
    instance: "document",
    fast: true,
    document: true,
    preflight: true,
  }),
  node("docs-check", "scripts/docs-check.mjs", {
    instance: "document",
    document: true,
    preflight: true,
    protects:
      "product byte ceilings, receipt and dispatch boundaries, and repository documentation links hold",
  }),
  nodeTests("docs-check-fixtures", "scripts/test-docs-check.mjs", {
    kit: "core-only: core product roadmap",
    document: true,
    needsBuild: false,
    protects:
      "document checks reject new growth and broken navigation while preserving declared exceptions",
  }),
  node("comment-labels", "scripts/comment-labels.mjs", {
    kit: "core-only: core comment fingerprint baseline",
    document: true,
    needsBuild: true,
    preflight: true,
    protects:
      "a new or changed code comment carries no report-local label and leads with no order identifier; today's lines pass by a baseline that only shrinks",
  }),
  nodeTests("comment-labels-fixtures", "scripts/test-comment-labels.mjs", {
    kit: "core-only: core corpus profile collector",
    document: true,
    protects:
      "the comment check refuses labels and leading identifiers, honours its fingerprint baseline and shrinks it on a fix",
  }),
  node("index", "scripts/work-orders.mjs", {
    instance: "document",
    args: ["index", "--check"],
    fast: true,
    document: true,
    preflight: true,
  }),
  node("siblings", "scripts/siblings.mjs", {
    instance: "document",
    args: ["index", "--check"],
    document: true,
    preflight: true,
    protects:
      "the sibling registry is the generated projection of its declaration, its receipts and this repository's tags and control records; a hand edit or a stale manifest hash refuses",
  }),
  nodeTests("siblings-fixtures", "scripts/test-siblings.mjs", {
    needsBuild: false,
    protects:
      "the registry generator carries each receipt's fields, the kit version from Git and the orders closed between receipts, reads not evidenced where no receipt supplies a field, and refuses a hand-edited entry, a manifest hash that is not the latest receipt's and an undecodable receipt",
  }),
  node("lineage", "scripts/lineage.mjs", {
    instance: "document",
    args: ["index", "--check"],
    document: true,
    preflight: true,
  }),
  nodeTests("lineage-fixtures", "scripts/test-lineage.mjs", {
    kit: "core-only: core idea ledger",
    document: true,
    needsBuild: false,
  }),
  ...["kernel", "compiler", "skeleton", "console"].map((name) =>
    nodeTests(name, `packages/${name}/dist/test/*.test.js`, {
      kit: `core-only: ${name === "console" ? "console fixtures and recorded product evidence" : `${name} package source audits${name === "kernel" ? " and package README" : ""}`}`,
      fast: true,
      packageTest: true,
      ...(name === "skeleton"
        ? {
            sources: [
              "scripts/reactor-identity.mjs",
              "scripts/fixtures/historical-compiler-loader.mjs",
            ],
            // Its native script cases nest `sandbox-exec`, which an outer
            // Seatbelt sandbox refuses (WO-068).
            needs: OUTSIDE_CONFINEMENT,
          }
        : {}),
      skipPattern: "\\[document\\]",
      ...(name === "console" ? {} : { group: "package-tests" }),
      // The outer runner owns parallelism. Node otherwise launches one test
      // process per available CPU on top of every other active suite.
      fileConcurrency: Math.max(
        1,
        Math.min(2, Math.floor(availableParallelism() / 4)),
      ),
    }),
  ),
  nodeTests(
    "browser-evidence",
    "packages/browser-evidence/test/scenario.test.mjs",
    {
      kit: "core-only: browser-evidence package and browser runtime are not shipped",
      fast: true,
      packageTest: true,
      group: "package-tests",
      needs: OUTSIDE_CONFINEMENT,
      sources: ["packages/browser-evidence/", "package-lock.json"],
      protects:
        "standalone browser scenarios produce admitted witnesses, replay and recover owned processes",
      fileConcurrency: 1,
    },
  ),
  ...["kernel", "skeleton", "console"].map((name) =>
    nodeTests(`${name}-docs`, `packages/${name}/dist/test/*.test.js`, {
      kit: `core-only: ${name === "console" ? "console fixtures and recorded product evidence" : `${name} recorded product evidence and documentation`}`,
      document: true,
      namePattern: "\\[document\\]",
      ...(name === "skeleton" ? { needs: OUTSIDE_CONFINEMENT } : {}),
      fileConcurrency: 2,
      protects:
        "current product documentation and recorded inputs agree with their runtime projections",
    }),
  ),
  nodeTests("adjacent-queue", "scripts/test-adjacent-queue.mjs"),
  nodeTests("evidence-sources", "scripts/test-evidence-sources.mjs", {
    kit: "core-only: package sources and recorded evidence editions",
  }),
  nodeTests("resident-bind", "scripts/test-resident-bind.mjs", {
    document: true,
  }),
  nodeTests("derived-orders", "scripts/test-derived-orders.mjs", {
    product: true,
    protects:
      "derived work identity, activation, draft filing, allocation recovery and resident restart remain one control contract",
  }),
  nodeTests("portfolio", "scripts/test-portfolio.mjs", {
    product: true,
    // Its discovery checks and WO-054 witness nest `sandbox-exec`, which an
    // outer Seatbelt sandbox refuses (WO-100-D018).
    needs: OUTSIDE_CONFINEMENT,
    protects:
      "a preauthorized portfolio derives bounded orders from WO-119 candidates, materializes them through WO-120 and advances the presence curve only after WO-052 changes and WO-054 verifies them",
  }),
  nodeTests("codex-continuation", "scripts/test-codex-continuation.mjs"),
  nodeTests("harness-probe", "scripts/test-harness-probe.mjs", {
    kit: "core-only: core security, budget and discovery records plus package sources",
    command: [
      process.execPath,
      "--test",
      "--test-reporter=tap",
      "--test-concurrency=1",
      "scripts/test-harness-probe.mjs",
      "scripts/test-authority-probe.mjs",
    ],
  }),
  nodeTests("authority-grants", "scripts/test-authority-grants.mjs"),
  nodeTests(
    "local-runner-double",
    "scripts/probes/local-runner-smoke.test.mjs",
    {
      kit: "core-only: role-qualification oracle reads core verification report WO-052/VER-001",
      document: true,
      command: [
        process.execPath,
        "--test",
        "--test-reporter=tap",
        "--test-concurrency=1",
        "scripts/probes/local-runner-smoke.test.mjs",
        "scripts/probes/local-runner-load.test.mjs",
        "scripts/probes/local-model-transport-smoke.test.mjs",
        "scripts/probes/local-model-role-qualification.test.mjs",
      ],
      protects:
        "local runner research, WO-110's transport smoke and WO-138's role qualification preserve failures, validate responses and recorded envelopes, keep live inference out of the gate, and observe cancellation using loopback doubles only",
    },
  ),
  node("authority-evidence", "scripts/authority-evidence.mjs", {
    kit: "core-only: core authority evidence edition and historical Git objects",
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  nodeTests("harness-fixtures", "scripts/test-harness.mjs", {
    kit: "core-only: Entropy Reducer baseline history and package sources",
    group: "hook-heavy",
    exclusive: true,
    overlap: 2,
  }),
  node("harness", "scripts/harness.mjs", {
    instance: "runtime",
    args: ["check"],
    fast: true,
    needsBuild: true,
    preflight: true,
  }),
  node("harness-context", "scripts/harness-context.mjs", {
    instance: "document",
    args: ["--check"],
    fast: true,
    needsBuild: true,
    preflight: true,
  }),
  node("harness-evidence", "scripts/harness-evidence.mjs", {
    kit: "core-only: package sources, historical harness baseline and live evidence",
    needsBuild: true,
    preflight: true,
  }),
  node("plan-refutation", "scripts/test-plan-refutation.mjs", {
    kit: "core-only: core reader profiles, planning history, budgets and historical Git objects",
    args: ["--fixtures-only"],
    needsBuild: true,
    protects:
      "planning receipts and Entropy Reducer receipts preserve judgments, blinding, immutability and carried orders",
  }),
  node("plan-refutation-current", "scripts/test-plan-refutation.mjs", {
    instance: "document",
    args: ["--check-only"],
    document: true,
  }),
  nodeTests("wo107-schema", "corpus/harness/wo107-schema.test.mjs", {
    kit: "core-only: historical corpus observations, collector and Git objects",
    needsBuild: true,
  }),
  nodeTests("artifact-corpus", "corpus/harness/wo101-id-corpus.test.mjs", {
    document: true,
  }),
  node("artifact-evidence", "scripts/artifact-identity-evidence.mjs", {
    kit: "core-only: package sources and core artifact-identity evidence edition",
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  node("verification-evidence", "scripts/verification-evidence.mjs", {
    kit: "core-only: package sources and core verification evidence edition",
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  node("feedback-evidence", "scripts/feedback-evidence.mjs", {
    kit: "core-only: core feedback evidence edition",
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  nodeTests("mutation", "corpus/mutation/wo108-selftest.test.mjs"),
  nodeTests("runner-fixtures", "scripts/test-runner.test.mjs", {
    kit: "core-only: package sources, core build inventory and license pins",
  }),
  nodeTests("sync-fixtures", "scripts/test-sync.mjs", {
    needsBuild: false,
    kit: "core-only: the core generated-artifact and evidence-edition inventory",
  }),
  nodeTests("process-debt", "scripts/test-process-debt.mjs", {
    kit: "core-only: historical Git trees, package sources, core budgets and work orders",
    group: "hook-heavy",
    exclusive: true,
    overlap: 2,
  }),
  node("meta", "scripts/meta.mjs", {
    instance: "document",
    args: ["--check"],
    fast: true,
    preflight: true,
  }),
  node("plan", "scripts/refute-plan.mjs", {
    instance: "document",
    args: ["check"],
    document: true,
  }),
  node("reader-profiles", "scripts/reader.mjs", {
    instance: "document",
    args: ["check"],
    document: true,
    protects:
      "committed reader choices, complete example variants, fact anchors, comparison hashes and immutable score subjects agree",
  }),
  nodeTests("reader-fixtures", "scripts/test-reader.mjs", {
    kit: "core-only: core historical publication examples and their recorded comparison",
    document: true,
    needsBuild: false,
    protects:
      "reader commands reject invalid profiles and quotations, select the nearest example, retain tag profiles and record scores idempotently",
  }),
  node("entropy", "scripts/entropy.mjs", {
    args: ["check"],
    document: true,
    instance: "document",
  }),
].map(classifySuite);

export function validateSuites(table) {
  if (
    !table.length ||
    new Set(table.map((row) => row.name)).size !== table.length
  )
    throw new Error("Empty or duplicate suite inventory");
  if (table.filter((row) => row.build).length !== 1)
    throw new Error("Exactly one build must be declared");
  for (const row of table)
    if (
      !row.name ||
      !Array.isArray(row.command) ||
      (!row.command.length && row.name !== "document-barrier")
    )
      throw new Error("Invalid suite declaration");
  for (const row of table)
    if (
      row.loadSlots !== undefined &&
      (!Number.isInteger(row.loadSlots) ||
        row.loadSlots < 1 ||
        row.loadSlots > 8)
    )
      throw new Error(`Invalid scheduler lane reservation: ${row.name}`);
  for (const row of table) {
    if (
      row.overlap !== undefined &&
      (!row.exclusive ||
        !Number.isSafeInteger(row.overlap) ||
        row.overlap < 0 ||
        row.overlap > 2)
    )
      throw new Error(`Invalid exclusive overlap: ${row.name}`);
    if (
      row.groupLimit !== undefined &&
      (!row.group ||
        !Number.isSafeInteger(row.groupLimit) ||
        row.groupLimit < 1)
    )
      throw new Error(`Invalid scheduler group limit: ${row.name}`);
  }
  for (const row of table)
    if (row.needs !== undefined && row.needs !== OUTSIDE_CONFINEMENT)
      throw new Error(`Unknown suite need: ${row.name} needs ${row.needs}`);
  for (const row of table)
    if (row.kit !== undefined && !/^core-only: \S.+/u.test(row.kit))
      throw new Error(`Invalid kit exclusion: ${row.name}`);
  for (const row of table)
    if (
      row.instance !== undefined &&
      (!["runtime", "document"].includes(row.instance) || row.kit)
    )
      throw new Error(`Invalid instance selection: ${row.name}`);
  // A fixture shortens the heartbeat to observe it; a gate never does.
  for (const row of table)
    if (row.heartbeatMs !== undefined)
      throw new Error(`Heartbeat interval is a fixture control: ${row.name}`);
}

const explicitlyIsolated = (row) =>
  Boolean(row.build || row.exclusive || row.loadClass === "isolated");
const overlapSlots = (row, concurrency) =>
  row.exclusive ? Math.min(row.overlap ?? 0, concurrency - 1) : 0;
const reservedSlots = (row, concurrency) =>
  explicitlyIsolated(row)
    ? concurrency - overlapSlots(row, concurrency)
    : Math.min(row.loadSlots ?? 1, concurrency);

export function lightSuiteNames(samples = schedulingBaseline.taskSamples) {
  return new Set(
    samples
      .filter(
        (row) =>
          row.loadClass === "shared" &&
          Number.isFinite(row.durationMs) &&
          row.durationMs >= 0 &&
          row.durationMs < 60_000 &&
          Number.isFinite(row.peakRssBytes) &&
          row.peakRssBytes >= 0 &&
          row.peakRssBytes < 512 * 2 ** 20,
      )
      .map((row) => row.name),
  );
}

export function expand(command, repo) {
  return command.flatMap((part) => {
    if (part.startsWith("--") || !part.includes("*")) return [part];
    if (!/^[^*]+\/\*\.test\.js$/.test(part))
      throw new Error(`Unsupported test glob: ${part}`);
    const directory = dirname(part);
    const paths = existsSync(join(repo, directory))
      ? readdirSync(join(repo, directory))
          .filter((name) => name.endsWith(".test.js"))
          .sort()
          .map((name) => `${directory}/${name}`)
      : [];
    if (!paths.length) throw new Error(`Missing built test suite: ${part}`);
    return paths;
  });
}

export function executeSuite(
  row,
  repo,
  timeoutMs = 900_000,
  onProgress = () => {},
  signal = undefined,
) {
  const started = Date.now();
  const hostDirectory = row.hostDirectory ?? hostStateRoot();
  const limits =
    row.memoryLimits ??
    memoryBudgets(repo, {
      capacity: recordedHostLaneCapacity(hostDirectory),
    });
  let env = row.probe
    ? { ...(row.executionEnvironment ?? process.env) }
    : suiteEnvironment(
        row.executionEnvironment ?? process.env,
        row.gateContext,
      );
  const deadline = startDeadline(`suite:${row.name}`, timeoutMs, { env });
  onProgress({ name: row.name, message: "started", elapsedMs: 0 });
  let command;
  let readGuard;
  let caseMarkers;
  const dropCaseMarkers = () => {
    if (!caseMarkers) return;
    try {
      rmSync(dirname(caseMarkers), { recursive: true, force: true });
    } catch {
      /* A leftover marker directory is harmless; a thrown cleanup is not. */
    }
  };
  try {
    const argv = [...row.command, ...(row.args ?? [])];
    command = row.probe ? argv : expand(argv, repo);
    if (command[0] === process.execPath && command.includes("--test")) {
      const reporters = command.filter((part) =>
        part.startsWith("--test-reporter="),
      );
      const destinations = command.filter((part) =>
        part.startsWith("--test-reporter-destination="),
      );
      const flags = [
        ...(reporters.length ? [] : ["--test-reporter=tap"]),
        `--test-reporter=${pathToFileURL(join(root, "scripts/lib/case-reporter.mjs")).href}`,
        ...Array.from(
          { length: Math.max(0, reporters.length - destinations.length) },
          () => "--test-reporter-destination=stdout",
        ),
        ...(reporters.length ? [] : ["--test-reporter-destination=stdout"]),
        "--test-reporter-destination=stdout",
      ];
      // The test processes append each case's start and end here themselves;
      // reporter events arrive too late to say what is running.
      // Without a place for them the task runs unmarked and names no case.
      try {
        caseMarkers = join(
          mkdtempSync(join(tmpdir(), "dotln-case-markers-")),
          "cases.jsonl",
        );
        writeFileSync(caseMarkers, "");
      } catch {
        dropCaseMarkers();
        caseMarkers = undefined;
      }
      if (caseMarkers) {
        env = { ...env, DOTLN_CASE_MARKERS: caseMarkers };
        flags.unshift(
          `--import=${pathToFileURL(join(root, "scripts/lib/case-marker.mjs")).href}`,
        );
      }
      command.splice(command.indexOf("--test") + 1, 0, ...flags);
    }
    if (row.product && !row.document && !row.build) {
      readGuard = productReadEnvironment(repo, env, row.name, row.activeOrder);
      env = readGuard.env;
    }
    if (row.executionWrapper) command = [...row.executionWrapper, ...command];
  } catch (error) {
    dropCaseMarkers();
    return Promise.resolve({
      name: row.name,
      exitCode: 1,
      durationMs: Date.now() - started,
      output: error.message,
      executed: true,
      failureKind: "setup",
    });
  }
  return new Promise((resolveRun, rejectRun) => {
    // Each POSIX suite owns a process group, including descendants inheriting
    // its pipes. Cancellation signals that group, never a scanned process list.
    const grouped = process.platform !== "win32";
    let launcher;
    try {
      launcher = taskLauncher(hostDirectory);
    } catch (error) {
      dropCaseMarkers();
      rejectRun(error);
      return;
    }
    const child = spawn(launcher, ["--launch", ...command], {
      cwd: repo,
      stdio: ["ignore", "pipe", "pipe", "pipe"],
      env,
      detached: grouped,
    });
    let launchResponse = "";
    child.stdio[3].on("data", (chunk) => {
      launchResponse = (launchResponse + chunk.toString()).slice(0, 128);
      const launchError = /^exec-error (\d+)\n/u.exec(launchResponse);
      if (launchError)
        failure ??= `Task launch failed: ${command[0]} (errno ${launchError[1]})`;
    });
    child.stdio[3].on("error", (error) => {
      if (!resourceFailure && !stopped) {
        failure ??= `Task launch handshake failed: ${error.message}`;
        cancel();
      }
    });
    let output = Buffer.alloc(0),
      diagnostics = Buffer.alloc(0),
      droppedOutputBytes = 0;
    const diagnosticCap = Math.min(
      65536,
      Math.max(256, Math.floor(limits.outputTailBytes / 4)),
    );
    const keepDiagnostic = (bytes) => {
      const joined = Buffer.concat([diagnostics, Buffer.from(bytes)]);
      diagnostics = joined.subarray(Math.max(0, joined.length - diagnosticCap));
    };
    let timedOut = false;
    let stopped = false;
    let failure;
    let killTimer;
    let finishTimer;
    let escalated = false;
    let resourceFailure,
      resourceDetails,
      resourceTask,
      taskRegistration,
      heldDescriptors;
    const ownMonitor = !row.resourceMonitor;
    const monitor =
      row.resourceMonitor ??
      createProcessMonitor({ limits, repo, directory: hostDirectory });
    const terminate = (kind) => {
      try {
        if (grouped && child.pid) process.kill(-child.pid, kind);
        else child.kill(kind);
      } catch (error) {
        if (
          error.code !== "ESRCH" &&
          !(error.code === "EPERM" && resourceFailure === "memory-budget")
        )
          failure ??= error.message;
      }
    };
    const cancel = () => {
      terminate("SIGTERM");
      killTimer ??= setTimeout(() => {
        escalated = true;
        terminate("SIGKILL");
        // A descendant may deliberately leave the group or the host may deny
        // signalling. Its inherited descriptors must not hold the gate open.
        child.unref();
        finishTimer = setTimeout(() => finish(null), 100);
      }, 1000);
    };
    const stop = () => {
      stopped = true;
      onProgress({
        name: row.name,
        message: "stopped by gate request",
        elapsedMs: Date.now() - started,
      });
      cancel();
    };
    if (signal?.aborted) stop();
    else signal?.addEventListener("abort", stop, { once: true });
    const timer = setTimeout(() => {
      timedOut = true;
      deadline.finish(true);
      cancel();
    }, timeoutMs);
    let progressCount = 0;
    const slowestCases = [];
    let lastProgressAt = started;
    let lastMessage = "waiting for the next case report";
    const progress = (message, force = false) => {
      if (progressCount >= 80 && !force) return;
      progressCount++;
      lastProgressAt = Date.now();
      onProgress({
        name: row.name,
        message: message.trimEnd().slice(0, 200).trimEnd(),
        elapsedMs: lastProgressAt - started,
      });
    };
    const heartbeatMs = row.heartbeatMs ?? 15_000;
    // The cases a test process has entered and not left, oldest first. A
    // process that is gone has none.
    const openCases = () => {
      const open = new Map();
      let seen = false;
      try {
        for (const line of readFileSync(caseMarkers, "utf8").split("\n")) {
          let marker;
          try {
            marker = JSON.parse(line);
          } catch {
            continue; // Empty, or a line still being appended.
          }
          seen = true;
          const key = `${marker.pid}:${marker.id}`;
          if (marker.event === "start") open.set(key, marker);
          else if (marker.event === "end") open.delete(key);
        }
      } catch {
        return { seen: false, open: [] };
      }
      const alive = (pid) => {
        try {
          process.kill(pid, 0);
          return true;
        } catch (error) {
          return error.code === "EPERM";
        }
      };
      return {
        seen,
        open: [...open.entries()]
          .filter(([, marker]) => alive(marker.pid))
          .sort(([, a], [, b]) => a.at - b.at || a.id - b.id),
      };
    };
    const namedAt = new Map();
    const entered = (marker, now) =>
      `${marker.name.slice(0, 80)} (entered ${((now - marker.at) / 1000).toFixed(1)} s ago)`;
    // A case is named from its own start and end markers, so never after it
    // ended. Every case that has run for the interval is named on the tick
    // it becomes due and again each interval, even while other cases keep
    // reporting, on as many lines as the names need. A quiet task says what
    // is open, whatever its age.
    const heartbeat = setInterval(() => {
      const now = Date.now();
      const quiet = now - lastProgressAt >= heartbeatMs;
      if (!caseMarkers) {
        if (quiet)
          progress(
            `running task: ${row.name} (reports no cases); last report: ${lastMessage}`,
            true,
          );
        return;
      }
      const { seen, open } = openCases();
      const due = open.filter(
        ([key, marker]) =>
          now - marker.at >= heartbeatMs &&
          now - (namedAt.get(key) ?? 0) >= heartbeatMs,
      );
      if (due.length) {
        const lines = [[]];
        for (const [key, marker] of due) {
          const name = entered(marker, now);
          if (
            lines.at(-1).length &&
            lines.at(-1).join("; ").length + name.length > 150
          )
            lines.push([]);
          lines.at(-1).push(name);
          namedAt.set(key, now);
        }
        for (const names of lines)
          progress(
            `running case${names.length > 1 ? "s" : ""}: ${names.join("; ")}`,
            true,
          );
      } else if (quiet)
        progress(
          `${open.length ? `running case: ${entered(open.at(-1)[1], now)}` : seen ? `no case is open in ${row.name} (between cases, in a hook or in module setup)` : `no case marker from ${row.name} yet`}; last report: ${lastMessage}`,
          true,
        );
    }, heartbeatMs / 3);
    const capture = (stderr = false) => {
      let partial = "";
      let diagnosticLines = 0;
      return (chunk) => {
        const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        const combined = Buffer.concat([output, bytes]);
        const dropped = Math.max(0, combined.length - limits.outputTailBytes);
        droppedOutputBytes += dropped;
        output = combined.subarray(dropped);
        if (stderr) keepDiagnostic(bytes);
        partial += chunk.toString();
        const lines = partial.split("\n");
        partial = lines.pop().slice(-1024);
        for (const line of lines) {
          if (line.startsWith("PROGRESS CASE ")) {
            try {
              const report = JSON.parse(line.slice("PROGRESS CASE ".length));
              // Reporter events supply durations; markers say what runs.
              if (report.event === "end") {
                if (
                  !report.skipped &&
                  Number.isFinite(report.durationMs) &&
                  report.durationMs >= 0
                ) {
                  slowestCases.push({
                    name: report.name,
                    file: report.file,
                    durationMs: report.durationMs,
                    exitCode: report.exitCode,
                  });
                  slowestCases.sort((a, b) => b.durationMs - a.durationMs);
                  slowestCases.length = Math.min(slowestCases.length, 5);
                }
              }
            } catch {
              /* TAP diagnostics still judge malformed extra output. */
            }
            // Case events supply durations, not live progress. Forwarding
            // them spends the bounded slots that diagnostics and a suite's
            // own progress need, and bypasses the usual output throttle.
            continue;
          }
          if (!stderr) {
            if (
              /^(?:\s*not ok \d+|.*(?:AssertionError|Error:|DIAGNOSTIC))/.test(
                line,
              )
            )
              diagnosticLines = 40;
            if (diagnosticLines > 0) {
              keepDiagnostic(line + "\n");
              diagnosticLines--;
            }
          }
          if (/^\s*(?:PROGRESS |# Subtest:|ok \d+ -|not ok \d+ -)/.test(line)) {
            lastMessage = line.trimEnd().slice(0, 200).trimEnd();
            if (
              !progressCount ||
              /^\s*(?:PROGRESS |not ok )/.test(line) ||
              Date.now() - lastProgressAt >= 1000
            )
              progress(lastMessage);
          }
        }
      };
    };
    child.stdout.on("data", capture());
    child.stderr.on("data", capture(true));
    child.on("error", (error) => {
      failure = error.message;
    });
    let finished = false;
    const finish = (code) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      clearTimeout(killTimer);
      clearTimeout(finishTimer);
      clearInterval(heartbeat);
      dropCaseMarkers();
      signal?.removeEventListener("abort", stop);
      const resources = resourceTask ? monitor.finish(resourceTask) : {};
      if (ownMonitor) monitor.close();
      const guardFailure = incidentForProcess(
        hostDirectory,
        child.pid,
        started,
      );
      if (
        ["memory-budget", "monitor-unavailable"].includes(
          guardFailure?.failureKind,
        )
      ) {
        resourceFailure = guardFailure.failureKind;
        resourceDetails ??= guardFailure;
        resources.peakFootprintBytes = Math.max(
          resources.peakFootprintBytes ?? 0,
          guardFailure.measuredPeakFootprintBytes,
        );
        resources.peakRssBytes = Math.max(
          resources.peakRssBytes ?? 0,
          guardFailure.residentBytesAtStop ?? 0,
        );
      }
      let withdrawn = !taskRegistration;
      try {
        taskRegistration?.release();
        withdrawn = true;
      } catch (error) {
        failure ??= `Task registration cleanup unavailable: ${error.message}`;
      }
      child.stdout.destroy();
      child.stderr.destroy();
      // The watch has left the monitor and the registration, so no census can
      // read it once the kernel recycles this endpoint's identity.
      if (withdrawn) heldDescriptors?.release();
      // If withdrawal failed, keep the duplicate until this supervisor exits:
      // a still-published watch must never point at a recycled endpoint.
      const survivors = resources.survivingProcesses ?? [];
      if (survivors.length && !resourceFailure)
        resourceFailure = "surviving-process";
      let renderedOutput = output.toString("utf8");
      if (
        (code !== 0 || failure || timedOut || stopped || resourceFailure) &&
        droppedOutputBytes &&
        diagnostics.length
      )
        renderedOutput = `[retained failure diagnostics]\n${diagnostics.toString("utf8")}\n${renderedOutput}`;
      if (droppedOutputBytes)
        renderedOutput = `[output tail; dropped ${droppedOutputBytes} bytes]\n${renderedOutput}`;
      if (resourceFailure)
        renderedOutput += `\n${resourceFailure} ${JSON.stringify(resourceDetails ?? { survivingProcesses: survivors })}`;
      const durationMs = Date.now() - started;
      deadline.finish();
      let readFailures = [];
      if (readGuard) {
        try {
          readFailures = productReadObservations(readGuard.log).filter(
            (event) => event.kind === "excluded-read",
          );
        } catch (error) {
          failure ??= `Product read observation unavailable: ${error.message}`;
        }
      }
      if (readFailures.length) {
        renderedOutput += `\nProduct read guard: ${readFailures.length} excluded-input observations (${readGuard.log})\n`;
        for (const event of readFailures)
          renderedOutput += `Product read guard: ${event.case} reads ${event.path} (${event.method}); tag the case [document]\n`;
      }
      resolveRun({
        name: row.name,
        durationMs,
        slowestCases: slowestCases.length
          ? slowestCases
          : [
              {
                name: row.name,
                durationMs,
                exitCode: code ?? 1,
                granularity: "task",
              },
            ],
        ...resources,
        droppedOutputBytes,
        ...(resourceDetails ? { memoryFailure: resourceDetails } : {}),
        ...(failure || timedOut || stopped || resourceFailure
          ? {
              failureKind:
                resourceFailure ??
                (failure ? "launch" : timedOut ? "timeout" : "stopped"),
            }
          : {}),
        startedAt: new Date(started).toISOString(),
        finishedAt: new Date().toISOString(),
        exitCode:
          timedOut ||
          stopped ||
          failure ||
          resourceFailure ||
          readFailures.length
            ? 1
            : (code ?? 1),
        ...(readGuard
          ? {
              productReadLog: readGuard.log,
              excludedReads: readFailures.length,
            }
          : {}),
        executed: true,
        ...(stopped ? { stopped: true } : {}),
        output: `${renderedOutput}${failure ? `\n${failure}` : ""}${timedOut ? `\nSuite ${row.name} timed out after ${durationMs} ms` : ""}${stopped ? `\nSuite ${row.name} stopped by gate request after ${durationMs} ms` : ""}`,
      });
    };
    child.on("close", (code) => {
      if (!killTimer || escalated) finish(code);
    });
    // An escaped descendant can keep pipes open after the root exits. Inspect
    // at exit as well as close, kill observed survivors and finish promptly.
    child.on("exit", (code) => {
      finishTimer ??= setTimeout(() => {
        finish(code);
      }, 100);
    });
    if (child.pid) {
      try {
        // The launcher holds the command until the go byte, so it cannot
        // have exited here: a missing row is a census that missed a live
        // process. Retry a bounded number of censuses; a launcher that never
        // appears is a monitor failure, never the task's exit code (WO-112
        // D025).
        const register = row.registerProcess ?? registerProcess;
        for (let attempt = 1; !taskRegistration; attempt++)
          try {
            taskRegistration = register(
              "trees",
              child.pid,
              {
                repo,
                scope: "task",
                task: row.name,
                budgetBytes: limits.taskBytes,
                limits,
              },
              hostDirectory,
            );
          } catch (error) {
            if (
              attempt >= 5 ||
              !error.message.startsWith("Cannot register exited process")
            )
              throw error;
          }
        const ownershipStarted = performance.now();
        try {
          heldDescriptors = holdTaskDescriptors(child.pid, hostDirectory);
          taskRegistration.record.descriptorOwnership = {
            key: taskRegistration.record.id,
            birth: taskRegistration.record.birth,
            descriptors: heldDescriptors.descriptors,
          };
        } finally {
          monitor.stats.samplingCostMs += performance.now() - ownershipStarted;
        }
        atomicJson(taskRegistration.file, taskRegistration.record);
        row.hostLease?.update({
          taskRoot: {
            pid: child.pid,
            birth: taskRegistration.record.birth,
            uniqueId: taskRegistration.record.uniqueId,
          },
        });
        let memberIdentity;
        resourceTask = monitor.add(
          child.pid,
          row.name,
          (kind, details) => {
            resourceFailure = kind;
            resourceDetails = details;
            terminate("SIGKILL");
          },
          limits.taskBytes,
          taskRegistration.record.birth,
          (members) => {
            const identities = members.map(
              ({ pid, birth, pgid, uniqueId }) => ({
                pid,
                birth,
                pgid,
                uniqueId,
              }),
            );
            const next = JSON.stringify(identities);
            if (next === memberIdentity) return;
            Object.assign(taskRegistration.record, { members: identities });
            atomicJson(taskRegistration.file, taskRegistration.record);
            row.hostLease?.update({ members: identities });
            memberIdentity = next;
          },
          taskRegistration.record.uniqueId,
          taskRegistration.record.descriptorOwnership,
        );
        if (!resourceFailure && !signal?.aborted) {
          child.stdio[3].end("g");
          monitor.launched(resourceTask);
        } else child.stdio[3].destroy();
      } catch (error) {
        child.stdio[3].destroy();
        resourceFailure = "monitor-unavailable";
        failure = error.message;
        cancel();
      }
    }
  });
}

/** Weighted lanes, explicit barriers and groups bound process-heavy overlap. */
export async function scheduleSuites(
  table,
  {
    repo = root,
    concurrency,
    parallelism = availableParallelism(),
    execute = executeSuite,
    onResult = () => {},
    onActiveChange = () => {},
    diagnosticContext = {},
    stopRequested = () => false,
    hostLanes,
    acquireLanes = acquireHostLanes,
    reused = new Map(),
    keepGoing = false,
    lightTasks = lightSuiteNames(),
  } = {},
) {
  validateSuites(table);
  const capacity = hostLanes?.capacity ?? hostLaneCapacity(parallelism);
  concurrency ??= capacity;
  if (!Number.isInteger(concurrency) || concurrency < 1)
    throw new Error("Concurrency must be a positive integer");
  if (concurrency > capacity)
    throw new Error(
      `Declared gate concurrency ${concurrency} exceeds host capacity ${capacity}`,
    );
  const build = table.find((row) => row.build);
  const results = [];
  const active = new Map();
  let failedFirst;
  const launchStop = new AbortController();
  const lanes = Array.from({ length: concurrency }, () => ({
    active: null,
    previous: null,
  }));
  const parentLease = hostLanes
    ? hostLanes.parentLease === undefined
      ? inheritedHostLease(hostLanes.directory)
      : hostLanes.parentLease
    : null;
  const executeTask = async (
    row,
    laneIndexes,
    predecessors,
    observation = {
      startedAt: new Date().toISOString(),
      concurrentAtStart: [...active.keys()],
    },
  ) => {
    const { startedAt, concurrentAtStart } = observation;
    const isolated = explicitlyIsolated(row);
    const occupiedSlots = laneIndexes.length;
    const peerConcurrency = isolated
      ? overlapSlots(row, concurrency) + 1
      : Math.max(1, concurrency - occupiedSlots + 1);
    const gateContext = {
      ...diagnosticContext,
      task: row.name,
      loadClass: isolated && peerConcurrency === 1 ? "isolated" : "shared",
      concurrency: peerConcurrency,
      loadFactor: peerConcurrency * 2,
      reservedSlots: occupiedSlots,
      slotCapacity: concurrency,
      hostCapacity: capacity,
    };
    let lease,
      executionStarted = false;
    const observed = (result) => {
      const finishedAt = new Date().toISOString();
      return {
        ...result,
        startedAt,
        finishedAt,
        concurrentAtStart,
        predecessors: [...new Set(predecessors.filter(Boolean))],
        schedulerDurationMs: Date.parse(finishedAt) - Date.parse(startedAt),
        loadClass: gateContext.loadClass,
        loadFactor: gateContext.loadFactor,
        peerCap: gateContext.concurrency - 1,
        reservedSlots: occupiedSlots,
        slotCapacity: concurrency,
        hostCapacity: capacity,
        timeoutMs: row.timeoutMs ?? 900_000,
        lanes: laneIndexes,
        ...(lease
          ? {
              hostLaneWaitMs: lease.waitedMs,
              hostLaneSlots: lease.record.slots,
              ...(lease.waitObservations.length
                ? { hostLaneWaitObservations: lease.waitObservations }
                : {}),
            }
          : {}),
      };
    };
    try {
      if (hostLanes && row.command.length)
        lease = await acquireLanes({
          ...hostLanes,
          signal: hostLanes.signal
            ? AbortSignal.any([hostLanes.signal, launchStop.signal])
            : launchStop.signal,
          parentLease,
          slots: occupiedSlots,
          worktree: repo,
          task: row.name,
        });
      if (stopRequested() || (!keepGoing && failedFirst))
        return {
          name: row.name,
          exitCode: 1,
          executed: false,
          durationMs: 0,
          output: failedFirst
            ? `Not started after ${failedFirst} failed`
            : "Gate stopped while waiting for host lanes",
        };
      executionStarted = true;
      const result = await execute(
        {
          ...row,
          gateContext,
          hostLease: lease,
          ...(lease
            ? {
                executionEnvironment: {
                  ...(row.executionEnvironment ?? process.env),
                  DOTLN_HOST_LANE_LEASE: JSON.stringify({
                    file: lease.file,
                    directory: hostLanes.directory,
                  }),
                },
              }
            : {}),
        },
        repo,
      );
      return observed(result);
    } catch (error) {
      if (executionStarted)
        return observed({
          name: row.name,
          exitCode: 1,
          executed: true,
          durationMs: Date.now() - Date.parse(startedAt),
          output: error.message,
        });
      if (!stopRequested() && !(!keepGoing && failedFirst)) throw error;
      return {
        name: row.name,
        exitCode: 1,
        executed: false,
        durationMs: 0,
        output: error.message,
      };
    } finally {
      await lease?.release();
    }
  };
  const finish = (result) => {
    results.push(result);
    if (result.exitCode !== 0 && !failedFirst) {
      failedFirst = result.name;
      if (!keepGoing) launchStop.abort();
    }
    onResult(result);
  };
  // Structural checks run serially before the build or any selected suite.
  // A failed structural prerequisite is never bypassed by --keep-going.
  const structural = table
    .filter((row) => row.structural || (row.name === "format" && row.preflight))
    .sort(
      (a, b) =>
        STRUCTURAL_TASKS.indexOf(a.name) - STRUCTURAL_TASKS.indexOf(b.name),
    );
  for (const row of structural) {
    onActiveChange([row.name]);
    const result = await executeTask(
      row,
      lanes.map((_, index) => index),
      results.map((entry) => entry.name),
    );
    finish(result);
    onActiveChange([]);
    if (result.exitCode !== 0) {
      for (const pending of table.filter(
        (entry) => !results.some((done) => done.name === entry.name),
      ))
        finish({
          name: pending.name,
          exitCode: 1,
          executed: false,
          durationMs: 0,
          output: `Required ${row.name} structural preflight failed. ${row.name === "format" ? "Run npm run format, then rerun this command." : "Repair the named failure and rerun this command."}\n${result.output ?? ""}`,
        });
      return results;
    }
  }
  // A kit verifies its carried code; no compiler runs in a kit.
  const verifiedKit = build.name === "kit-verify";
  if (verifiedKit) {
    onActiveChange([build.name]);
    finish(
      await executeTask(
        build,
        lanes.map((_, index) => index),
        [],
      ),
    );
    onActiveChange([]);
    if (results.at(-1).exitCode !== 0) return results;
  }
  const format = structural.find((row) => row.name === "format");
  for (const row of table)
    if (
      !structural.includes(row) &&
      !(verifiedKit && row === build) &&
      reused.has(row.name)
    )
      finish(reused.get(row.name));
  if (!verifiedKit && !reused.has(build.name)) {
    onActiveChange([build.name]);
    finish(
      await executeTask(
        build,
        lanes.map((_, index) => index),
        structural.map((row) => row.name),
      ),
    );
  }
  onActiveChange([]);
  for (const lane of lanes)
    lane.previous =
      verifiedKit && format
        ? format.name
        : reused.has(build.name)
          ? null
          : build.name;
  if (results.find((row) => row.name === build.name)?.exitCode !== 0)
    return results;
  const pending = table.filter(
    (row) =>
      row !== build && !structural.includes(row) && !reused.has(row.name),
  );
  for (const row of pending)
    for (const dependency of row.after ?? [])
      if (!table.some((item) => item.name === dependency))
        throw new Error(`Missing dependency: ${dependency}`);
  if (concurrency > 1)
    pending.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const groups = new Map();
  let exclusive = null;
  const groupAvailable = (row) =>
    !row.group || (groups.get(row.group) ?? 0) < (row.groupLimit ?? 1);
  const isLight = (row) => !explicitlyIsolated(row) && lightTasks.has(row.name);
  const canJoin = (row) => {
    if (exclusive) return isLight(row);
    if (!explicitlyIsolated(row)) return true;
    return (
      [...active.keys()].every((name) =>
        isLight(table.find((task) => task.name === name)),
      ) && active.size <= overlapSlots(row, concurrency)
    );
  };
  while (pending.length || active.size) {
    // A stop request ends scheduling at this boundary; the suites already
    // running are ended by their execute adapter and settle below.
    if (stopRequested() || (!keepGoing && failedFirst))
      while (pending.length) {
        const row = pending.pop();
        finish({
          name: row.name,
          exitCode: 1,
          durationMs: 0,
          executed: false,
          output: failedFirst
            ? `Not started after ${failedFirst} failed`
            : "Gate stopped by request before this suite started",
        });
      }
    for (let index = pending.length - 1; index >= 0; index--)
      if (
        (pending[index].after ?? []).some((name) =>
          results.some(
            (result) => result.name === name && result.exitCode !== 0,
          ),
        )
      ) {
        const [row] = pending.splice(index, 1);
        finish({
          name: row.name,
          exitCode: 1,
          durationMs: 0,
          executed: false,
          output: `Required preflight or fixture preparation failed for ${row.name}: ${(row.after ?? []).filter((name) => results.some((result) => result.name === name && result.exitCode !== 0)).join(", ")}`,
        });
      }
    while (lanes.some((lane) => lane.active === null)) {
      const freeLanes = lanes
        .map((lane, index) => ({ lane, index }))
        .filter(({ lane }) => lane.active === null)
        .map(({ index }) => index);
      // A waiting exclusive row drains heavy peers before lower-priority work.
      // Once it starts, only measured light tasks may fill its overlap lanes.
      const head = pending[0];
      if (
        head &&
        explicitlyIsolated(head) &&
        !exclusive &&
        (!canJoin(head) ||
          reservedSlots(head, concurrency) > freeLanes.length) &&
        groupAvailable(head) &&
        (head.after ?? []).every((name) =>
          results.some(
            (result) => result.name === name && result.exitCode === 0,
          ),
        )
      )
        break;
      const index = pending.findIndex(
        (row) =>
          reservedSlots(row, concurrency) <= freeLanes.length &&
          groupAvailable(row) &&
          canJoin(row) &&
          (row.after ?? []).every((name) =>
            results.some(
              (result) => result.name === name && result.exitCode === 0,
            ),
          ),
      );
      if (index < 0) break;
      const [row] = pending.splice(index, 1);
      const isolated = explicitlyIsolated(row);
      if (isolated) exclusive = row;
      if (row.group) groups.set(row.group, (groups.get(row.group) ?? 0) + 1);
      const laneIndexes = freeLanes.slice(0, reservedSlots(row, concurrency));
      const predecessors = [
        build.name,
        ...(row.after ?? []),
        ...laneIndexes.map((index) => lanes[index].previous),
        // A task skipped for a failed dependency never started, so it is not
        // a timeline edge.
        ...results
          .filter(
            (result) =>
              result.startedAt &&
              table.find((task) => task.name === result.name)?.group ===
                row.group &&
              row.group,
          )
          .slice(-1)
          .map((result) => result.name),
      ].filter((name) =>
        results.some((result) => result.name === name && result.startedAt),
      );
      for (const index of laneIndexes) lanes[index].active = row.name;
      const observation = {
        startedAt: new Date().toISOString(),
        concurrentAtStart: [...active.keys()],
      };
      const task = Promise.resolve()
        .then(() => executeTask(row, laneIndexes, predecessors, observation))
        .then((result) => {
          finish(result);
          active.delete(row.name);
          for (const index of laneIndexes) {
            lanes[index].active = null;
            lanes[index].previous = row.name;
          }
          onActiveChange([...active.keys()]);
          if (isolated) exclusive = null;
          if (row.group) groups.set(row.group, groups.get(row.group) - 1);
        });
      active.set(row.name, task);
      onActiveChange([...active.keys()]);
    }
    if (active.size) await Promise.race(active.values());
    else if (pending.length)
      throw new Error("Cyclic or unsatisfied suite dependencies");
  }
  return results;
}

export function expandSuiteTasks(
  selected,
  repo,
  template,
  { first = new Map() } = {},
) {
  // A suite named in `first` leads the queue by the lead it maps to; its
  // expanded tasks (`release:prepare` before `release:case:*`) keep their
  // order among themselves because the lead is added to their own priority.
  const leadOf = (row) =>
    first.get(row.name) ?? first.get(row.name.split(":")[0]) ?? 0;
  const structural = selected
    .filter((row) => row.structural)
    .map((row) => row.name);
  const preflight = selected
    .filter((row) => row.preflight)
    .map((row) => row.name);
  return selected
    .flatMap((row) => {
      if (["launchpad", "target-worktree"].includes(row.name)) {
        const prefix = row.command.slice(0, -1);
        return [row.command.at(-1), ...(row.args ?? [])].map((file) => ({
          ...row,
          name: `${row.name}:file:${basename(file)}`,
          command: [...prefix, file],
          args: [],
          timeoutMs: 900_000,
        }));
      }
      if (row.name === "vertical") {
        // Separate clocks keep queued files and large matrices from spending
        // another task's deadline. Each file owns two host slots.
        const prefix = row.command.slice(0, -1);
        return [row.command.at(-1), ...(row.args ?? [])].flatMap((file) => {
          const task = {
            ...row,
            name: `vertical:file:${basename(file)}`,
            command: [...prefix, file],
            args: [],
          };
          if (basename(file) !== "test-vertical.mjs") return [task];
          // Identical complementary filters retain each current and future case.
          return [
            {
              ...task,
              name: `${task.name}:statements`,
              namePattern: VERTICAL_STATEMENT_PATTERN,
              command: [
                ...prefix,
                `--test-name-pattern=${VERTICAL_STATEMENT_PATTERN}`,
                file,
              ],
            },
            {
              ...task,
              name: `${task.name}:workflow`,
              skipPattern: VERTICAL_STATEMENT_PATTERN,
              command: [
                ...prefix,
                `--test-skip-pattern=${VERTICAL_STATEMENT_PATTERN}`,
                file,
              ],
            },
          ];
        });
      }
      if (row.name === "release") {
        if (!template) throw new Error("Release fixture template is required");
        return [
          {
            ...row,
            name: "release:prepare",
            priority: 100,
            args: ["--prepare-template", template],
          },
          ...releaseCases(repo).map((name) => ({
            ...row,
            name: `release:case:${name}`,
            priority: 60,
            after: ["release:prepare"],
            args: ["--case", name, "--template", template],
          })),
        ];
      }
      if (row.name === "runner-fixtures")
        return [
          {
            ...row,
            args: [
              "scripts/test-release-fixtures.mjs",
              "scripts/test-gate-deadlines.mjs",
              "scripts/test-host-guard.test.mjs",
            ],
          },
        ];
      return [row];
    })
    .map((row) => ({
      ...row,
      priority:
        (row.priority ??
          (row.exclusive
            ? 200
            : ["skeleton", "worktree", "resume"].includes(row.name)
              ? 80
              : 0)) + leadOf(row),
      ...(!row.structural &&
      (structural.length || (!row.build && !row.preflight && preflight.length))
        ? {
            after: [
              ...new Set([
                ...(row.after ?? []),
                ...structural,
                ...(!row.build && !row.preflight ? preflight : []),
              ]),
            ],
          }
        : {}),
    }));
}

export function aggregateSuiteRows(selected, tasks, rows, codeIdentity) {
  return selected.map((suite) => {
    const members = tasks.filter(
      (task) =>
        task.name === suite.name || task.name.startsWith(`${suite.name}:`),
    );
    const observed = rows.filter((row) =>
      members.some((member) => member.name === row.name),
    );
    if (
      members.length === 1 &&
      members[0].name === suite.name &&
      observed.length === 1
    )
      return observed[0];
    const starts = observed
      .filter((row) => row.startedAt)
      .map((row) => Date.parse(row.startedAt));
    const ends = observed
      .filter((row) => row.finishedAt)
      .map((row) => Date.parse(row.finishedAt));
    return {
      name: suite.name,
      exitCode: completeCoverage(members, observed, codeIdentity) ? 0 : 1,
      durationMs:
        starts.length && ends.length
          ? Math.max(...ends) - Math.min(...starts)
          : 0,
      executed: observed.some((row) => row.executed),
      slowestCases: observed
        .flatMap((row) => row.slowestCases ?? [])
        .sort((a, b) => b.durationMs - a.durationMs)
        .slice(0, 5),
      reused: observed.some((row) => row.reused),
      expectedCases: members.map((row) => row.name),
      cases: observed.map(failedOutputOnly),
      output: "",
    };
  });
}

/** A recorded row keeps no passing output at any depth. A case keeps only
 * the output of a failed or unexecuted check, which the gate index stores as
 * an addressed log; a timeline entry carries no output at all. */
export const failedOutputOnly = ({ output, ...row }) => ({
  ...row,
  ...(Array.isArray(row.cases)
    ? { cases: row.cases.map(failedOutputOnly) }
    : {}),
  ...(output && (row.exitCode !== 0 || !row.executed) ? { output } : {}),
});
export const withoutOutput = ({ output, ...row }) => ({
  ...row,
  ...(Array.isArray(row.cases) ? { cases: row.cases.map(withoutOutput) } : {}),
});

export function completeSharedRefs(snapshot) {
  const name = (value) => typeof value === "string" && value.length > 0;
  const count = (value) =>
    value === "unreadable" || (Number.isSafeInteger(value) && value >= 0);
  return (
    snapshot !== null &&
    typeof snapshot === "object" &&
    !Array.isArray(snapshot) &&
    name(snapshot.originMain) &&
    name(snapshot.main) &&
    snapshot.tags !== null &&
    typeof snapshot.tags === "object" &&
    !Array.isArray(snapshot.tags) &&
    count(snapshot.tags.count) &&
    name(snapshot.tags.newest) &&
    count(snapshot.dotlnRefs)
  );
}

// Keep both intervals: a ref may move during the run back to the previous
// row's value. Missing or malformed snapshots supply no comparison baseline;
// their diagnostic metadata must not prevent recording the failed gate.
// Absence is observed and comparable. An unreadable field withholds only its
// own comparison, while the remaining fields keep their observed movement.
export function sharedRefChanges(before, after) {
  if (!completeSharedRefs(before) || !completeSharedRefs(after)) return [];
  const changes = [];
  for (const [field, label] of [
    ["originMain", "origin/main"],
    ["main", "main"],
  ])
    if (
      before[field] !== "unreadable" &&
      after[field] !== "unreadable" &&
      before[field] !== after[field]
    )
      changes.push(`${label} ${before[field]}..${after[field]}`);
  if (
    before.tags.count !== "unreadable" &&
    after.tags.count !== "unreadable" &&
    before.tags.newest !== "unreadable" &&
    after.tags.newest !== "unreadable"
  ) {
    const tags = [];
    if (before.tags.count !== after.tags.count)
      tags.push(`count ${before.tags.count}..${after.tags.count}`);
    if (before.tags.newest !== after.tags.newest)
      tags.push(`newest ${before.tags.newest}..${after.tags.newest}`);
    if (tags.length)
      changes.push(
        `tags ${after.tags.count > before.tags.count && after.tags.newest !== before.tags.newest ? `+${after.tags.newest} ` : ""}(${tags.join(", ")})`,
      );
  }
  if (
    before.dotlnRefs !== "unreadable" &&
    after.dotlnRefs !== "unreadable" &&
    before.dotlnRefs !== after.dotlnRefs
  )
    changes.push(`refs/dotln/ ${before.dotlnRefs}..${after.dotlnRefs}`);
  return changes;
}

export async function runGate(
  args = process.argv.slice(2),
  repo = root,
  options = {},
) {
  if (args.includes("--list")) return runGateChecks(args, repo, options);
  const only = args.indexOf("--only");
  const single =
    only < 0
      ? undefined
      : (options.table ?? suites).find((row) => row.name === args[only + 1]);
  // Review also runs document-reading machinery, so it retains the full
  // refusal. Only a product selection that observes no own records grants
  // report writes; --only must respect the selected suite's declaration. An
  // instance's selections are document runs: its harness row reads the
  // harness surfaces and the root instruction file, which the product read
  // guard excludes, so no product run of them can be observed and the order's
  // record writes stay refused while they run.
  const active = beginGateRun(repo, "scripts/test-runner.mjs", {
    kind:
      instanceSelection(args, repo) ||
      args.includes("--document") ||
      single?.document
        ? "document"
        : args.includes("--review") || args.includes("--full")
          ? "review"
          : args.includes("--machinery") || single?.machinery
            ? "machinery"
            : "product",
  });
  let registration;
  try {
    registration = await registerGuardTree(
      repo,
      process.pid,
      { scope: "gate" },
      options.hostDirectory,
    );
    return await runGateChecks(args, repo, {
      stopRequested: active.stopRequested,
      ...options,
    });
  } finally {
    registration?.release();
    active.release();
  }
}

async function runGateChecks(
  args,
  repo,
  {
    stopRequested = () => false,
    sandbox: sandboxOptions,
    table = suites.map((row) =>
      row.build ? classifySuite(buildSuite(repo)) : row,
    ),
    hostDirectory = hostStateRoot(),
  } = {},
) {
  let document = false,
    machinery = false,
    review = false,
    serial = false,
    list = false,
    confinedPartial = false,
    again = false,
    keepGoing = false,
    only,
    against;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--document") document = true;
    else if (arg === "--machinery") machinery = true;
    else if (arg === "--review" || arg === "--full") review = true;
    else if (arg === "--serial") serial = true;
    else if (arg === "--list") list = true;
    else if (arg === "--keep-going") keepGoing = true;
    else if (arg === "--confined-partial") confinedPartial = true;
    // Both flags run the selection instead of reusing a covering row
    // (WO-173); --fresh keeps the meaning measure-gates.mjs relies on.
    else if (arg === "--fresh" || arg === "--again") again = true;
    else if (
      arg === "--against" &&
      !against &&
      args[index + 1] &&
      !args[index + 1].startsWith("--")
    )
      against = args[++index];
    else if (arg === "--only" && !only) only = args[++index];
    else
      throw new Error(
        "usage: test-runner [--document|--machinery|--review] [--only <suite>] [--against <rev>] [--confined-partial] [--again] [--keep-going] [--serial] [--list]",
      );
  }
  if (against && !document)
    throw new Error("--against requires --document (npm run test:docs)");
  if (only && !table.some((row) => row.name === only))
    throw new Error(`Unknown suite: ${only}`);
  // A consumer checks its installed runtime. Its separate document gate
  // checks coordination records; sibling product checks run in the target.
  // Shipping a fixture makes it available for an explicit diagnostic only.
  const instance = instanceSelection(args, repo);
  let selected = table.filter((row) =>
    row.generated && !only
      ? false
      : instance
        ? row.instance === "runtime" ||
          (document && row.instance === "document")
        : only
          ? row.name === only
          : document
            ? row.document
            : machinery
              ? row.machinery
              : row.product,
  );
  if (review && !instance && !only && !document && !machinery)
    selected = [
      ...new Set([
        ...selected,
        ...changedMachinery(repo, table).filter((row) => !row.generated),
      ]),
    ];
  if (isKitRoot(repo)) {
    const unavailable = table.filter((row) =>
      row.kit?.startsWith("core-only: "),
    );
    if (!instance)
      for (const row of unavailable)
        console.log(
          `kit: ${row.name} not carried (${row.kit.slice("core-only: ".length)})`,
        );
    const requested = unavailable.find((row) => row.name === only);
    if (requested)
      throw new Error(
        `Suite ${requested.name} is not carried in this kit (${requested.kit})`,
      );
    selected = selected.filter((row) => !row.kit?.startsWith("core-only: "));
    const verify = table.find((row) => row.build);
    selected = [verify, ...selected.filter((row) => row !== verify)];
  }
  const structural = STRUCTURAL_TASKS.map((name) =>
    table.find((row) => row.name === name && row.structural),
  ).filter(Boolean);
  selected = [
    ...structural,
    ...selected.filter((row) => !structural.includes(row)),
  ];
  // A focused product selection judges only the generated artifacts its
  // build phase makes current; publication and bookkeeping artifacts are
  // inputs of the complete and document selections, not of one suite. Its
  // structural companion row is partial, so it never stands in for a
  // complete or document selection's structural pass.
  const focusedRow = only ? table.find((row) => row.name === only) : undefined;
  // Only the real structural check reads the flag; a fixture that stands a
  // stub in for the generated row keeps its own command and a whole row.
  const buildPhaseOnly = Boolean(
    focusedRow &&
    !focusedRow.document &&
    !focusedRow.machinery &&
    !focusedRow.structural &&
    selected.some(
      (row) =>
        row.name === "generated" &&
        Array.isArray(row.args) &&
        row.args.includes("generated"),
    ),
  );
  if (buildPhaseOnly)
    selected = selected.map((row) =>
      row.name === "generated"
        ? { ...row, args: [...(row.args ?? []), "--build-phase-only"] }
        : row,
    );
  if (list) {
    for (const row of confinedPartial
      ? selected.filter((row) => !row.needs)
      : selected)
      console.log(
        `${row.name} — protects: ${row.protects}${row.needs ? ` — needs: ${row.needs}` : ""}`,
      );
    return { exitCode: 0 };
  }
  // Compile once when needed: a stale runtime is rebuilt before the reuse
  // lookup and the subject capture, so an ordinary package edit reaches the
  // suites instead of a refusal to run npm run sync first. The compiled
  // output lies outside the code identity. A stale installed harness is
  // reported, never installed here: live hooks change only through the
  // explicit sync step.
  if (!confinedPartial)
    for (const { exitCode } of compileStaleRuntime(repo))
      console.log(
        `compiled the stale runtime before the subject was captured${exitCode ? ` (the build exited ${exitCode}; the structural check judges it)` : ""}`,
      );
  const sharedRefsStart = readSharedRefs(repo);
  const instanceInputDigest = gateInstanceInputDigest(repo);
  const refsStartedAt = Date.now();
  let reused = new Map();
  let reuseIdentity;
  // Plain and review selections compose the latest passing task executions.
  // Installed snapshots and coordination records are outside code identity.
  // Consumer checks must observe them afresh, even after a prior pass.
  if (
    !instance &&
    !again &&
    !only &&
    !document &&
    !machinery &&
    !confinedPartial
  ) {
    const needsBuild = selected.some((row) => row.needsBuild || row.build);
    const inventory = [
      needsBuild
        ? table.find((row) => row.build)
        : { name: "document-barrier", build: true, command: [], outputs: [] },
      ...selected.filter((row) => !row.build),
    ];
    const tasks = expandSuiteTasks(inventory, repo, "<gate-template>");
    let covering;
    try {
      covering = await coveringTaskResults(repo, "npm test", tasks);
      reused = covering.results;
      for (const row of structural) reused.delete(row.name);
      reused.delete("format");
      reused.delete("kit-verify");
      reuseIdentity = covering.codeIdentity;
    } catch (error) {
      console.log(
        `npm test: passing-row lookup unavailable (${error.message}); running the selection`,
      );
    }
    // The build output is ignored and may have been made at another identity.
    // A task that runs here must run against output made at this one: the
    // build's pass is carried beside it only while the output on disk is the
    // one its executing row attested. A row in which no task runs consumes
    // no output and carries the pass as it stands.
    const build = tasks.find((row) => row.build);
    if (reused.size < tasks.length && reused.has(build.name)) {
      const carried = reused.get(build.name);
      if (buildOutputAttested(repo, build, carried))
        reused.set(build.name, { ...carried, outputAttested: true });
      else {
        reused.delete(build.name);
        console.log(
          typeof carried.outputDigest === "string"
            ? "npm test: the build output on disk is not the one the latest passing build at this code identity recorded; building"
            : "npm test: the latest passing build at this code identity attested no output; building",
        );
      }
    }
  }
  // The preflight precedes the build, the diagnostics directory and every
  // suite. Outside a sandbox in force the selection and identity are unchanged.
  const excluded = outsideOnly(selected);
  // Only a selection that needs the outside pays for the probe write.
  const sandbox = excluded.length
    ? detectHostConfinement(repo, sandboxOptions)
    : { marker: null, inForce: false };
  if (confinedPartial) {
    selected = selected.filter((row) => !excluded.includes(row));
    if (!selected.length)
      throw new Error(
        `Nothing remains to run while confined: ${excluded.map((row) => row.name).join(", ")} ${excluded.length === 1 ? "needs" : "need"} the outside`,
      );
  } else if (sandbox.inForce && excluded.length) {
    const base = document
      ? "npm run test:docs"
      : machinery
        ? "npm run test:machinery"
        : "npm test";
    const rest = args.filter(
      (arg) => !["--document", "--machinery"].includes(arg),
    );
    const command = (flags) =>
      `${base}${flags.length ? ` -- ${flags.join(" ")}` : ""}`;
    throw new Error(
      confinementRefusal(
        sandbox,
        excluded,
        command(rest),
        excluded.length < selected.length
          ? command([...rest, "--confined-partial"])
          : undefined,
      ),
    );
  }
  const checkId = only
    ? `suite:${only}`
    : document
      ? "npm run test:docs"
      : machinery
        ? "npm run test:machinery"
        : confinedPartial
          ? CONFINED_PARTIAL_CHECK
          : "npm test";
  const treeHash = gateTreeHash(repo),
    codeIdentity = gateCodeIdentity(repo),
    started = Date.now();
  // Preflight can take time. Results looked up before it belong to that
  // earlier identity, never to a newly captured gate subject.
  if (reused.size && reuseIdentity !== codeIdentity) {
    reused = new Map();
    console.log(
      "npm test: code changed after passing-row lookup; running the selection",
    );
  }
  const needsBuild = selected.some((row) => row.needsBuild || row.build);
  selected = [
    needsBuild
      ? table.find((row) => row.build)
      : { name: "document-barrier", build: true, command: [], outputs: [] },
    ...selected.filter((row) => !row.build),
  ];
  const freshRelease =
    selected.some((row) => row.name === "release") &&
    expandSuiteTasks(selected, repo, "<gate-template>").some(
      (row) => row.name.startsWith("release:") && !reused.has(row.name),
    );
  // A passed preparation task stays passed. Its old disposable template is
  // gone, so a missing release case uses the shell's standalone setup instead
  // of executing that passing task again or trusting an old writable fixture.
  const standaloneRelease = freshRelease && reused.has("release:prepare");
  const fixture =
    freshRelease && !standaloneRelease ? createReleaseFixtureContext() : null;
  const diagnosticRoot = join(repo, "docs/control/local/harness/runner");
  mkdirSync(diagnosticRoot, { recursive: true });
  const peerFile = join(diagnosticRoot, "active.json"),
    deadlineLog = join(diagnosticRoot, "deadlines.jsonl");
  writeFileSync(deadlineLog, "");
  // Host-confinement fixture roots this run's suites create carry this tag, so
  // the gate judges only its own leftovers in the shared temporary directory
  // (WO-157 item 15, WO-063 D005).
  const fixtureTag = randomUUID().slice(0, 8);
  const inheritedLease = inheritedHostLease(hostDirectory);
  const hostCapacity = await acquireHostLaneCapacity({
    directory: hostDirectory,
  });
  const concurrency = serial
    ? 1
    : Math.max(
        1,
        Math.min(inheritedLease?.record.slots ?? hostCapacity, hostCapacity),
      );
  // A complete selection leads with the suites most likely to fail: those
  // whose sources changed after the newest gate row, then those this branch
  // changed. A stale assertion then fails within minutes, not at the end of
  // the run, and a focused rerun of the same suites is never needed first.
  // The order is an optimization: a failure to compute it never fails the
  // selection, and its line never carries the summary's "npm test:" prefix.
  const first = new Map();
  if (!instance && !only && !document && !machinery && !confinedPartial)
    try {
      let rows = [];
      try {
        rows = readGateChecks(repo);
      } catch {
        rows = [];
      }
      for (const row of changedMachinery(repo, table))
        first.set(row.name, 1000);
      for (const name of changedSinceLastGate(repo, table, rows).suites)
        first.set(name, 2000);
      for (const name of lastFailedSuites(rows)) first.set(name, 3000);
      const selectedNames = new Set(selected.map((row) => row.name));
      for (const name of [...first.keys()])
        if (!selectedNames.has(name)) first.delete(name);
      const reason = {
        3000: "last execution failed",
        2000: "changed since the last gate row",
        1000: "changed on this branch",
      };
      if (first.size)
        console.log(
          `scheduled first: ${[...first]
            .sort(([a, x], [b, y]) => y - x || a.localeCompare(b))
            .map(([name, lead]) => `${name} (${reason[lead]})`)
            .join(", ")}`,
        );
    } catch (error) {
      first.clear();
      console.log(`scheduled in declared order: ${error.message}`);
    }
  const tasks = expandSuiteTasks(
    selected,
    repo,
    fixture?.template ?? "<gate-template>",
    { first },
  ).map((row) =>
    standaloneRelease && row.name.startsWith("release:case:")
      ? { ...row, args: ["--case", row.name.slice("release:case:".length)] }
      : row,
  );
  let activeOrder;
  try {
    const { readControl, branchWorkOrder, selectWorkOrder } =
      await import("./lib/control-store.mjs");
    const control = readControl(repo);
    activeOrder = selectWorkOrder(control, { branch: branchWorkOrder(repo) });
    if (
      ["closed", "withdrawn"].includes(
        control.orders.get(activeOrder)?.state.phase,
      )
    )
      activeOrder = undefined;
  } catch {
    /* Standalone fixture without lifecycle authority. */
  }
  const stop = new AbortController();
  const limits = memoryBudgets(repo, { capacity: hostCapacity });
  const completedRows = [];
  let stoppedCheck;
  const recordStopped = (stoppedBy) => {
    if (stoppedCheck || !completedRows.length) return stoppedCheck;
    const recordedAt = new Date().toISOString();
    stoppedCheck = {
      checkId,
      treeHash,
      codeIdentity,
      subject: treeHash,
      ...(instanceInputDigest === undefined ? {} : { instanceInputDigest }),
      durationMs: Date.now() - started,
      exitCode: 1,
      executed: true,
      stopped: true,
      stoppedBy,
      evidenceRef: `host-gate:${codeIdentity}:stopped:${recordedAt}`,
      recordedAt,
      requiredSuites: selected.map((row) => row.name),
      cases: completedRows.map(failedOutputOnly),
      taskTimeline: completedRows.map(withoutOutput),
      unrunSuites: tasks
        .filter((task) => !completedRows.some((row) => row.name === task.name))
        .map((row) => row.name),
    };
    recordGateChecks(repo, [stoppedCheck]);
    return stoppedCheck;
  };
  let resourceGateFailure;
  const monitor = createProcessMonitor({
    limits,
    gatePid: process.pid,
    repo,
    directory: hostDirectory,
    onGateFailure: (details) => {
      resourceGateFailure = details;
      stop.abort();
    },
  });
  let interrupted;
  const terminateGate = (signal) => {
    const incident = incidentForProcess(hostDirectory, process.pid, started);
    if (
      ["memory-budget", "monitor-unavailable"].includes(incident?.failureKind)
    ) {
      resourceGateFailure = incident;
      monitor.failTasks(incident.failureKind, incident);
    } else {
      interrupted = signal;
      recordStopped(signal);
    }
    stop.abort();
    monitor.stopTasks();
  };
  const handlers = Object.fromEntries(
    ["SIGINT", "SIGTERM", "SIGHUP"].map((signal) => [
      signal,
      () => terminateGate(signal),
    ]),
  );
  for (const [signal, handler] of Object.entries(handlers))
    process.on(signal, handler);
  const stopping = () => {
    const incident = incidentForProcess(hostDirectory, process.pid, started);
    if (
      ["memory-budget", "monitor-unavailable"].includes(
        incident?.failureKind,
      ) &&
      !resourceGateFailure
    ) {
      resourceGateFailure = incident;
      monitor.failTasks(incident.failureKind, incident);
      stop.abort();
    }
    if (stopRequested()) {
      if (!resourceGateFailure) recordStopped("request");
      stop.abort();
    }
    return stop.signal.aborted;
  };
  const poll = setInterval(stopping, 500);
  try {
    const taskRows = await scheduleSuites(tasks, {
      repo,
      concurrency,
      stopRequested: stopping,
      diagnosticContext: { peerFile, deadlineLog, fixtureTag },
      hostLanes: {
        directory: hostDirectory,
        capacity: limits.hostLanes,
        signal: stop.signal,
        parentLease: inheritedLease,
      },
      reused,
      keepGoing,
      onActiveChange(names) {
        writeFileSync(`${peerFile}.tmp`, JSON.stringify({ tasks: names }));
        renameSync(`${peerFile}.tmp`, peerFile);
      },
      execute: async (row, cwd) => {
        const result =
          row.name === "document-barrier"
            ? {
                name: row.name,
                exitCode: 0,
                durationMs: 0,
                executed: true,
                output: "",
              }
            : await executeSuite(
                {
                  ...row,
                  resourceMonitor: monitor,
                  memoryLimits: limits,
                  hostDirectory,
                  activeOrder,
                },
                cwd,
                row.timeoutMs ?? 900_000,
                ({ name, message, elapsedMs }) =>
                  console.log(
                    `PROGRESS [${name}] ${(elapsedMs / 1000).toFixed(1)} s ${message}`,
                  ),
                stop.signal,
              );
        if (row.structural) {
          const line = result.output
            ?.split("\n")
            .find((line) => line.startsWith("STRUCTURAL_RESULT "));
          if (line) {
            try {
              const detail = JSON.parse(
                line.slice("STRUCTURAL_RESULT ".length),
              );
              for (const key of ["stale", "cases", "sample"])
                if (detail[key] !== undefined) result[key] = detail[key];
              if (Array.isArray(result.cases))
                result.cases = result.cases.map(failedOutputOnly);
              result.output = result.output
                .split("\n")
                .filter((line) => !line.startsWith("STRUCTURAL_RESULT "))
                .join("\n");
            } catch {
              /* A malformed diagnostic never changes the process verdict. */
            }
          }
        }
        if (!row.build || result.exitCode !== 0) return result;
        // A passing build attests the output it published. An output that
        // cannot be attested leaves the pass without a digest, so it is
        // never carried beside a task that runs.
        let outputDigest;
        try {
          outputDigest = buildOutputDigest(cwd, row.outputs);
        } catch {
          /* Unreadable while this gate holds it: no attestation. */
        }
        if (outputDigest) return { ...result, outputDigest };
        if (Array.isArray(row.outputs))
          console.log(
            `${checkId}: the build's declared output could not be attested (absent, unreadable, or holding a link or special file); no pass of this run will be carried`,
          );
        return result;
      },
      onResult(row) {
        if (row.name === "document-barrier") return;
        if (row.executed && !row.stopped && !row.reused)
          completedRows.push(row);
        if (row.reused) {
          console.log(
            `REUSE ${row.name} from ${row.sourceRow.location} row ${row.sourceRow.recordedAt}`,
          );
          return;
        }
        console.log(
          `${!row.executed ? "SKIP" : row.exitCode === 0 ? "PASS" : "FAIL"} ${row.name} ${(row.durationMs / 1000).toFixed(2)} s`,
        );
        // Successful checks still deliver their explicit diagnostics.
        for (const line of (row.output ?? "").trimEnd().split("\n"))
          if (
            row.exitCode !== 0 ||
            /^(?:ADVISORY|NEWER)\b/u.test(line) ||
            (row.name === "kit-verify" && line.startsWith("kit: "))
          )
            console.log(`  [${row.name}] ${line}`);
      },
    });
    if (stopping() && (interrupted || !resourceGateFailure))
      throw new Error(
        `Gate stopped by ${interrupted ?? "request"} after ${((Date.now() - started) / 1000).toFixed(1)} s; ${stoppedCheck ? `stopped row recorded: ${stoppedCheck.evidenceRef}` : `no check recorded for tree ${treeHash}`}`,
      );
    const failureComparisons = document
      ? await classifyDocumentFailures(repo, tasks, taskRows, {
          against,
          signal: stop.signal,
          execute: async (row, cwd, signal) => {
            const lease = await acquireHostLanes({
              directory: hostDirectory,
              slots: reservedSlots(row, concurrency),
              worktree: repo,
              task: `base:${row.name}`,
              signal,
              parentLease: inheritedLease,
            });
            try {
              return await executeSuite(
                {
                  ...row,
                  hostLease: lease,
                  executionEnvironment: {
                    ...(row.executionEnvironment ?? process.env),
                    DOTLN_HOST_LANE_LEASE: JSON.stringify({
                      directory: hostDirectory,
                      file: lease.file,
                    }),
                  },
                  memoryLimits: limits,
                  resourceMonitor: monitor,
                  hostDirectory,
                },
                cwd,
                900_000,
                undefined,
                signal,
              );
            } finally {
              await lease.release();
            }
          },
        })
      : [];
    for (const observation of failureComparisons)
      console.log(
        `${observation.classification} ${observation.name} against ${observation.base ?? "unavailable"}${observation.reason ? `: ${observation.reason}` : ""}`,
      );
    if (stopping() && (interrupted || !resourceGateFailure))
      throw new Error(
        `Gate stopped during base comparison; ${stoppedCheck ? `stopped row recorded: ${stoppedCheck.evidenceRef}` : "no task completed"}`,
      );
    const rows = aggregateSuiteRows(selected, tasks, taskRows, codeIdentity);
    const unchanged =
      gateCodeIdentity(repo) === codeIdentity &&
      gateInstanceInputDigest(repo) === instanceInputDigest;
    // Every task ran between the build's attestation and this check. An
    // output that changed in between leaves no task's pass tied to this
    // identity's build, exactly as changed code does.
    const buildRow = tasks.find((row) => row.build);
    const built = taskRows.find((row) => row.name === buildRow.name);
    const outputJudged = typeof built?.outputDigest === "string";
    const outputUnchanged =
      !outputJudged || buildOutputAttested(repo, buildRow, built);
    // A passing build that declares outputs and attested none leaves this
    // row's passes tied to no output: the row may pass and supplies nothing.
    const outputUnattested =
      built?.exitCode === 0 && Array.isArray(buildRow.outputs) && !outputJudged;
    // A root that survives every suite's own teardown is a failed gate; the
    // check names it and removes nothing, so the leftover stays diagnosable.
    const abandoned = readdirSync(tmpdir())
      .filter((name) =>
        name.startsWith(`dotln-host-confinement-${fixtureTag}-`),
      )
      .map((name) => join(tmpdir(), name))
      .sort();
    const freshTasks = taskRows.filter((row) => row.executed && !row.reused);
    // Structural tasks and a preflight format run fresh in every selection;
    // a composition whose only fresh tasks are those reused everything else.
    const onlyAlwaysFresh =
      freshTasks.length > 0 &&
      freshTasks.every((row) =>
        tasks.some(
          (task) =>
            task.name === row.name &&
            (task.structural || (task.name === "format" && task.preflight)),
        ),
      );
    const check = {
      checkId,
      treeHash,
      codeIdentity,
      sharedRefs: { start: sharedRefsStart, end: readSharedRefs(repo) },
      ...(instanceInputDigest === undefined ? {} : { instanceInputDigest }),
      subject: treeHash,
      durationMs: Date.now() - started,
      exitCode:
        completeCoverage(tasks, taskRows, codeIdentity) &&
        unchanged &&
        outputUnchanged &&
        !abandoned.length &&
        !resourceGateFailure
          ? 0
          : 1,
      executed: true,
      evidenceRef: `host-gate:${codeIdentity}:${only ?? checkId}`,
      recordedAt: new Date().toISOString(),
      executionMode: again
        ? "forced-fresh"
        : reused.size
          ? "composed"
          : "fresh",
      gateSelection: document
        ? "document"
        : review
          ? "review"
          : machinery
            ? "machinery"
            : only
              ? "single"
              : "plain",
      identityUnchanged: unchanged,
      ...(outputJudged ? { buildOutputUnchanged: outputUnchanged } : {}),
      ...(outputUnattested ? { buildOutputAttested: false } : {}),
      freshReason: again
        ? "requested"
        : instance
          ? "instance-inputs"
          : reused.size
            ? onlyAlwaysFresh
              ? "always-fresh-preflight"
              : freshTasks.length
                ? "missing-passing-tasks"
                : "no-fresh-tasks"
            : "no-passing-tasks",
      freshSuites: freshTasks.length,
      reusedSuites: taskRows.filter((row) => row.reused).length,
      requiredSuites: selected.map((row) => row.name),
      unrunSuites: tasks
        .filter(
          (task) =>
            !taskRows.some((row) => row.name === task.name && row.executed),
        )
        .map((row) => row.name),
      stale: taskRows.flatMap((row) => row.stale ?? []),
      failedFirst:
        taskRows.find((row) => row.exitCode !== 0 && row.executed)?.name ??
        null,
      // A partial row names what it left out; no product-gate consumer reads it.
      ...(confinedPartial
        ? { partial: true, excludedSuites: excluded.map((row) => row.name) }
        : {}),
      ...(sandbox.marker ? { sandbox } : {}),
      ...(abandoned.length ? { abandonedRoots: abandoned } : {}),
      cases: rows.map(failedOutputOnly),
      ...(document ? { failureComparisons } : {}),
      loadClass: {
        sharedCap: concurrency,
        hostCapacity,
        factorPerSlot: 2,
        maxHostLoadPerCpu: 2,
        scheduler: "light-overlap-v2",
      },
      taskTimeline: taskRows.map(withoutOutput),
      memory: {
        ...monitor.close(),
        budgets: limits,
        ...(resourceGateFailure
          ? {
              failure: resourceGateFailure,
              peakFootprintBytes: Math.max(
                monitor.stats.peakFootprintBytes,
                resourceGateFailure.measuredPeakFootprintBytes,
              ),
            }
          : {}),
      },
      deadlineDiagnostics: existsSync(deadlineLog)
        ? readFileSync(deadlineLog, "utf8")
            .split("\n")
            .filter(Boolean)
            .map(JSON.parse)
            .filter(
              (row) =>
                row.hit || process.env.DOTLN_GATE_MEASURE_DEADLINES === "1",
            )
        : [],
    };
    check.criticalPath = gateCriticalPath(check);
    try {
      const { readControl } = await import("./lib/control-store.mjs");
      const active = [...readControl(repo).orders].filter(
        ([, row]) => !["closed", "withdrawn"].includes(row.state.phase),
      );
      if (active.length === 1) check.workOrder = active[0][0];
    } catch {
      /* Standalone fixture. */
    }
    if (stopping() && (interrupted || !resourceGateFailure))
      throw new Error(
        `Gate stopped before recording; ${stoppedCheck ? `stopped row recorded: ${stoppedCheck.evidenceRef}` : "no task completed"}`,
      );
    // Focused rows can supply the order's declared Preflight claims. The
    // complete final-review claim still requires its own fresh review row.
    if (check.exitCode !== 0) {
      let previous;
      try {
        previous = readGateChecks(repo)
          .filter(
            (row) =>
              row.checkId === checkId &&
              Date.parse(row.recordedAt) <= refsStartedAt,
          )
          .at(-1);
      } catch {
        // Unreadable history supplies no baseline. This diagnostic must not
        // prevent recording the failed gate or comparing its own snapshots.
      }
      const changes = [
        ...sharedRefChanges(
          previous?.sharedRefs?.end,
          check.sharedRefs.start,
        ).map((change) => `since previous: ${change}`),
        ...sharedRefChanges(check.sharedRefs.start, check.sharedRefs.end).map(
          (change) => `during run: ${change}`,
        ),
      ];
      if (changes.length)
        console.log(`shared refs moved: ${changes.join("; ")}`);
    }
    const structuralRows = taskRows.filter((row) =>
      structural.some((task) => task.name === row.name),
    );
    const structuralCheck = structural.length
      ? {
          ...check,
          checkId: "structural",
          evidenceRef: `host-gate:${codeIdentity}:structural:${check.recordedAt}`,
          gateSelection: "structural",
          requiredSuites: structural.map((row) => row.name),
          ...(buildPhaseOnly
            ? {
                partial: true,
                partialReason:
                  "generated judged the build-phase artifacts only; a complete or document selection supplies the structural pass",
              }
            : {}),
          exitCode:
            unchanged &&
            completeCoverage(structural, structuralRows, codeIdentity)
              ? 0
              : 1,
          durationMs: structuralRows.length
            ? Math.max(
                ...structuralRows.map(
                  (row) => Date.parse(row.finishedAt) || started,
                ),
              ) - started
            : 0,
          cases: structuralRows.map(failedOutputOnly),
          taskTimeline: structuralRows.map(withoutOutput),
          freshSuites: structuralRows.filter((row) => row.executed).length,
          reusedSuites: 0,
          unrunSuites: structural
            .filter(
              (task) =>
                !structuralRows.some(
                  (row) => row.name === task.name && row.executed,
                ),
            )
            .map((row) => row.name),
        }
      : null;
    recordGateChecks(repo, [
      check,
      ...(structuralCheck ? [structuralCheck] : []),
    ]);
    console.log(
      `${checkId}: ${rows.filter((row) => row.exitCode === 0).length} passed; ${rows.filter((row) => row.exitCode !== 0).length} failed; ${(check.durationMs / 1000).toFixed(2)} s; ${check.freshSuites} fresh tasks${unchanged ? "" : "; code changed"}${outputUnchanged ? "" : "; build output changed during the gate"}${abandoned.length ? `; abandoned fixture roots: ${abandoned.join(", ")}` : ""}${confinedPartial ? `; partial, not product-gate evidence: excluded ${check.excludedSuites.join(", ") || "none"}` : ""}`,
    );
    return check;
  } finally {
    clearInterval(poll);
    monitor.stopTasks();
    monitor.close();
    for (const [signal, handler] of Object.entries(handlers))
      process.off(signal, handler);
    fixture?.cleanup();
  }
}

if (isMainModule(import.meta.url)) {
  try {
    process.exitCode = (await runGate()).exitCode;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
