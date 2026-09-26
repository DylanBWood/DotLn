#!/usr/bin/env node
import { isMainModule } from "./lib/paths.mjs";
import { spawn, spawnSync } from "node:child_process";
import { availableParallelism, tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { startDeadline } from "../packages/skeleton/src/gate-deadlines.mjs";
import { evidenceSourceContent } from "../packages/skeleton/src/evidence-editions.mjs";
import { gateCriticalPath } from "./lib/gate-timeline.mjs";
import {
  beginGateRun,
  gateTreeHash,
  gateCodeIdentity,
  recordGateChecks,
} from "./lib/gate-evidence.mjs";
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
import { findLaunchpad } from "./lib/config.mjs";

const recordedSources = evidenceSources(findLaunchpad());

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
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
// These shells each own a checked temporary root, Git repository and PATH.
const shell = (name, file) => ({
  name,
  command: ["bash", file],
  needsBuild: true,
});

// Machinery declarations select optional review checks by their own source paths.
const machinerySources = {
  "fixture-temp-root": [
    "scripts/test-temp-root.sh",
    "scripts/test-fixture-temp-root.sh",
  ],
  "harness-probe": [
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
    // WO-159: the probes build their Codex argv and home through the launcher.
    "packages/skeleton/src/worker-transport.ts",
  ],
  "harness-fixtures": [
    "packages/skeleton/src/presence-heartbeat.ts",
    "packages/skeleton/src/presence-signals.ts",
    "packages/skeleton/src/resident-store.ts",
    "scripts/terms.mjs",
    "scripts/harness-context.mjs",
    "scripts/lib/harness-context.mjs",
    "packages/skeleton/src/feedback-boundary.ts",
    "packages/skeleton/src/gate-evidence.mjs",
    "scripts/test-harness.mjs",
    "scripts/lib/harness-prune.mjs",
    "scripts/lib/stash-drop.mjs",
    // WO-159: prune lists stale Codex episode homes through the launcher.
    "packages/skeleton/src/worker-transport.ts",
    "scripts/test-observed-facts.mjs",
    "scripts/lib/executor-handoff.mjs",
    "scripts/resume.mjs",
    "scripts/work-orders.mjs",
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
    "packages/skeleton/src/presence-heartbeat.ts",
    "packages/skeleton/src/presence-signals.ts",
    "packages/skeleton/src/resident-store.ts",
    "scripts/harness.mjs",
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/version.ts",
    "packages/skeleton/src/subagent-budget.ts",
    "packages/skeleton/src/gate-evidence.mjs",
    "scripts/lib/harness.mjs",
    "packages/compiler/src/harness.ts",
    "packages/skeleton/src/loadouts/",
  ],
  "configuration-root": [
    "scripts/lib/config.mjs",
    "scripts/test-configuration-root.mjs",
    "scripts/resume.mjs",
    "scripts/work-orders.mjs",
    "scripts/worktree.mjs",
    "scripts/lib/control.mjs",
    "scripts/lib/control-store.mjs",
    "scripts/lib/paths.mjs",
  ],
  "harness-context": [
    "scripts/lib/process-budget.mjs",
    "scripts/lib/harness.mjs",
    "scripts/harness-context.mjs",
    "scripts/lib/harness-context.mjs",
  ],
  "harness-evidence": recordedSources["harness"],
  "plan-refutation": [
    "packages/skeleton/src/plan-refutation-host.ts",
    "packages/skeleton/src/plan-refutation-fake.ts",
    "packages/skeleton/src/worker-transport.ts",
    "scripts/test-plan-refutation.mjs",
    "scripts/refute-plan.mjs",
    "scripts/lib/plan-",
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
    "scripts/lib/gate-timeline.mjs",
    "scripts/measure-gates.mjs",
    "scripts/lib/gate-evidence.mjs",
    "scripts/lib/host-confinement.mjs",
    "scripts/test-runner.mjs",
    "packages/skeleton/src/evidence-editions.mjs",
    "scripts/test-runner.test.mjs",
    "scripts/lib/document-gate-stubs.mjs",
    "scripts/lib/document-failures.mjs",
    "scripts/lib/evidence-jsonl.mjs",
    "scripts/check-registrations.mjs",
    "scripts/test-gate-deadlines.mjs",
    "scripts/test-release-fixtures.mjs",
    "scripts/test-release.sh",
    "scripts/lib/suite-evidence.mjs",
    "scripts/lib/release-fixtures.mjs",
    "packages/skeleton/src/gate-evidence.mjs",
    "packages/skeleton/src/gate-deadlines.mjs",
  ],
  "process-debt": [
    "packages/skeleton/src/correction-observation.mjs",
    "scripts/lib/meta.mjs",
    "scripts/lib/intake-reconciliation.mjs",
    "scripts/lib/evidence-preparation.mjs",
    "scripts/lib/planning-followups.mjs",
    "scripts/build.mjs",
    "scripts/work-orders.mjs",
    "scripts/discover.mjs",
    "packages/skeleton/src/usage-observation.mjs",
    "scripts/test-process-debt.mjs",
    "scripts/test-codex-session.mjs",
    "scripts/lib/harness-runtime.mjs",
    "scripts/lib/lifecycle-evidence.mjs",
    "scripts/lib/receipt-cost.mjs",
    "scripts/lib/process-budget.mjs",
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/version.ts",
    "packages/skeleton/src/subagent-budget.ts",
    "packages/skeleton/src/gate-evidence.mjs",
  ],
  mutation: ["corpus/mutation/"],
  // WO-157 item 12: the inventories and the import closure they must follow.
  "evidence-sources": [
    "scripts/lib/evidence-sources.mjs",
    "scripts/test-evidence-sources.mjs",
    "scripts/feedback-evidence.mjs",
    "packages/skeleton/src/feedback-audit.ts",
    "packages/skeleton/src/evidence-editions.mjs",
  ],
  // WO-157 item 13: any changed docs path, stub list or registry re-runs the
  // registration check under --review, not only under test:docs.
  registrations: [
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
    "packages/skeleton/src/correction-observation.mjs",
    "scripts/lib/control-store.mjs",
    "scripts/lib/control-time.mjs",
    "scripts/lib/planning-followups.mjs",
    "packages/skeleton/src/usage-observation.mjs",
    "scripts/meta.mjs",
    "scripts/lib/meta.mjs",
    "scripts/lib/receipt-cost.mjs",
    "scripts/lib/process-budget.mjs",
  ],
};
const protection = {
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
  "release-surfaces":
    "release claims match component versions and reviewed notes",
  "release-preparation":
    "release preparation preserves source and chooses the classified target",
  "github-body": "published descriptions preserve reviewed content",
  "outward-lint":
    "outward artifacts have conventional shape and redacted vocabulary checks",
  "target-publish":
    "a target branch reaches its remote only from a bound episode, under an operator grant and after the outward lint",
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
  const machinery = Object.hasOwn(machinerySources, row.name);
  const document = Boolean(
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
  let run = spawnSync("git", ["diff", "--name-only", base, "--"], {
    cwd: repo,
    encoding: "utf8",
  });
  if (run.status !== 0) {
    base = "main";
    run = spawnSync("git", ["diff", "--name-only", base, "--"], {
      cwd: repo,
      encoding: "utf8",
    });
  }
  if (run.status !== 0) return table.filter((row) => row.machinery);
  const files = run.stdout
    .split("\n")
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
      const before = spawnSync("git", ["show", `${base}:${file}`], {
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

// Every command from the 2026-09-09 chain has one declared owner below. Build
// deletion and shell glob assertions are replaced by atomic-build and expand().
export const suites = [
  {
    name: "format",
    command: ["npm", "run", "format:check", "--silent"],
    fast: true,
    document: true,
    preflight: true,
  },
  node("build", "scripts/build.mjs", { fast: true, build: true }),
  node("release-surfaces", "scripts/release.mjs", {
    args: ["check-surfaces", "--local"],
    fast: true,
    needsBuild: true,
    preflight: true,
  }),
  nodeTests("release-preparation", "scripts/test-release-preparation.mjs"),
  nodeTests("github-body", "scripts/test-github-body.mjs"),
  nodeTests("outward-lint", "scripts/test-outward-lint.mjs", {
    needsBuild: false,
  }),
  nodeTests("target-publish", "scripts/test-target-publish.mjs"),
  nodeTests("license-fixtures", "scripts/test-license-surfaces.mjs"),
  node("license-surfaces", "scripts/license-surfaces.mjs", {
    preflight: true,
  }),
  shell("fixture-temp-root", "scripts/test-fixture-temp-root.sh"),
  shell("publication-fixtures", "scripts/test-publication.sh"),
  shell("backup-intake", "scripts/test-backup-intake.sh"),
  shell("resume", "scripts/test-resume.sh"),
  nodeTests("beacon-portability", "scripts/test-beacon-portability.mjs", {
    fast: true,
    // The absent skeleton dist copies are judged against a fresh build.
    needsBuild: true,
    protects:
      "control Beacon leaves keep one build-free home that no script imports from skeleton source or dist, and a copied control plane without the skeleton emits a decodable control Beacon",
  }),
  shell("checkpoint", "scripts/test-checkpoint.sh"),
  shell("worktree", "scripts/test-worktree.sh"),
  nodeTests("worktree-integration", "scripts/test-worktree-integration.mjs"),
  shell("release", "scripts/test-release.sh"),
  shell("work-orders-fixtures", "scripts/test-work-orders.sh"),
  node("publication", "scripts/check-publication.mjs", {
    fast: true,
    document: true,
    preflight: true,
  }),
  node("index", "scripts/work-orders.mjs", {
    args: ["index", "--check"],
    fast: true,
    document: true,
    preflight: true,
  }),
  node("lineage", "scripts/lineage.mjs", {
    args: ["index", "--check"],
    document: true,
    preflight: true,
  }),
  nodeTests("lineage-fixtures", "scripts/test-lineage.mjs", {
    document: true,
    needsBuild: false,
  }),
  ...["kernel", "compiler", "skeleton", "console"].map((name) =>
    nodeTests(name, `packages/${name}/dist/test/*.test.js`, {
      fast: true,
      packageTest: true,
      ...(name === "skeleton"
        ? {
            sources: [
              "scripts/reactor-identity.mjs",
              "scripts/fixtures/historical-compiler-loader.mjs",
            ],
            // Its native script cases nest `sandbox-exec`, which an outer
            // Seatbelt sandbox refuses (WO-068 FINAL-001 O4).
            needs: OUTSIDE_CONFINEMENT,
          }
        : {}),
      ...(["skeleton", "console"].includes(name)
        ? { skipPattern: "\\[document\\]" }
        : {}),
      ...(name === "console" ? {} : { group: "package-tests" }),
      // The outer runner owns parallelism. Node otherwise launches one test
      // process per available CPU on top of every other active suite.
      fileConcurrency: Math.max(
        1,
        Math.min(2, Math.floor(availableParallelism() / 4)),
      ),
    }),
  ),
  ...["skeleton", "console"].map((name) =>
    nodeTests(`${name}-docs`, `packages/${name}/dist/test/*.test.js`, {
      document: true,
      namePattern: "\\[document\\]",
      fileConcurrency: 2,
      protects:
        "current product documentation and recorded inputs agree with their runtime projections",
    }),
  ),
  nodeTests("adjacent-queue", "scripts/test-adjacent-queue.mjs"),
  nodeTests("evidence-sources", "scripts/test-evidence-sources.mjs"),
  nodeTests("resident-bind", "scripts/test-resident-bind.mjs"),
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
  nodeTests("configuration-root", "scripts/test-configuration-root.mjs", {
    protects:
      "an absent dotln.config.json reproduces today's layout, a declared launchpad moves every document root and root derivation, and a malformed configuration refuses by path",
  }),
  nodeTests("codex-continuation", "scripts/test-codex-continuation.mjs"),
  nodeTests("harness-probe", "scripts/test-harness-probe.mjs", {
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
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  nodeTests("harness-fixtures", "scripts/test-harness.mjs", {
    group: "hook-heavy",
    exclusive: true,
  }),
  node("harness", "scripts/harness.mjs", {
    args: ["check"],
    fast: true,
    needsBuild: true,
    preflight: true,
  }),
  node("harness-context", "scripts/harness-context.mjs", {
    args: ["--check"],
    fast: true,
    needsBuild: true,
    preflight: true,
  }),
  node("harness-evidence", "scripts/harness-evidence.mjs", {
    needsBuild: true,
    preflight: true,
  }),
  node("plan-refutation", "scripts/test-plan-refutation.mjs", {
    args: ["--fixtures-only"],
    needsBuild: true,
    protects:
      "planning receipts and Entropy Reducer receipts preserve judgments, blinding, immutability and carried orders",
  }),
  node("plan-refutation-current", "scripts/test-plan-refutation.mjs", {
    args: ["--check-only"],
    document: true,
  }),
  nodeTests("artifact-corpus", "corpus/harness/wo101-id-corpus.test.mjs"),
  node("artifact-evidence", "scripts/artifact-identity-evidence.mjs", {
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  node("verification-evidence", "scripts/verification-evidence.mjs", {
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  node("feedback-evidence", "scripts/feedback-evidence.mjs", {
    args: ["--check"],
    needsBuild: true,
    preflight: true,
  }),
  nodeTests("mutation", "corpus/mutation/wo108-selftest.test.mjs"),
  nodeTests("runner-fixtures", "scripts/test-runner.test.mjs"),
  nodeTests("process-debt", "scripts/test-process-debt.mjs", {
    group: "hook-heavy",
    exclusive: true,
  }),
  node("meta", "scripts/meta.mjs", {
    args: ["--check"],
    fast: true,
    preflight: true,
  }),
  node("registrations", "scripts/check-registrations.mjs", {
    document: true,
    needsBuild: true,
  }),
  node("plan", "scripts/refute-plan.mjs", { args: ["check"], document: true }),
  node("entropy", "scripts/entropy.mjs", { args: ["check"], document: true }),
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
        row.loadSlots > 4)
    )
      throw new Error(`Invalid scheduler lane reservation: ${row.name}`);
  for (const row of table)
    if (row.needs !== undefined && row.needs !== OUTSIDE_CONFINEMENT)
      throw new Error(`Unknown suite need: ${row.name} needs ${row.needs}`);
}

const explicitlyIsolated = (row) =>
  Boolean(row.build || row.exclusive || row.loadClass === "isolated");
const reservedSlots = (row, concurrency) =>
  explicitlyIsolated(row)
    ? concurrency
    : Math.min(row.loadSlots ?? 1, concurrency);

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
  const env = suiteEnvironment(
    row.executionEnvironment ?? process.env,
    row.gateContext,
  );
  const deadline = startDeadline(`suite:${row.name}`, timeoutMs, { env });
  onProgress({ name: row.name, message: "started", elapsedMs: 0 });
  let command;
  try {
    command = expand([...row.command, ...(row.args ?? [])], repo);
    if (row.executionWrapper) command = [...row.executionWrapper, ...command];
  } catch (error) {
    return Promise.resolve({
      name: row.name,
      exitCode: 1,
      durationMs: Date.now() - started,
      output: error.message,
      executed: true,
      failureKind: "setup",
    });
  }
  return new Promise((resolveRun) => {
    // Each POSIX suite owns a process group, including descendants inheriting
    // its pipes. Cancellation signals that group, never a scanned process list.
    const grouped = process.platform !== "win32";
    const child = spawn(command[0], command.slice(1), {
      cwd: repo,
      stdio: ["ignore", "pipe", "pipe"],
      env,
      detached: grouped,
    });
    let output = "";
    let timedOut = false;
    let stopped = false;
    let failure;
    let killTimer;
    let finishTimer;
    let escalated = false;
    const terminate = (kind) => {
      try {
        if (grouped && child.pid) process.kill(-child.pid, kind);
        else child.kill(kind);
      } catch (error) {
        if (error.code !== "ESRCH") failure ??= error.message;
      }
    };
    const cancel = () => {
      terminate("SIGTERM");
      killTimer ??= setTimeout(() => {
        escalated = true;
        terminate("SIGKILL");
        // A descendant may deliberately leave the group or the host may deny
        // signalling. Its inherited descriptors must not hold the gate open.
        child.stdout.destroy();
        child.stderr.destroy();
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
    let lastProgressAt = started;
    let lastMessage = "waiting for the next case report";
    const progress = (message) => {
      if (progressCount >= 80) return;
      progressCount++;
      lastProgressAt = Date.now();
      onProgress({
        name: row.name,
        message: message.trimEnd().slice(0, 200).trimEnd(),
        elapsedMs: lastProgressAt - started,
      });
    };
    const heartbeat = setInterval(() => {
      if (Date.now() - lastProgressAt >= 15_000)
        progress(`running; last report: ${lastMessage}`);
    }, 15_000);
    const capture = () => {
      let partial = "";
      return (chunk) => {
        output += chunk.toString();
        partial += chunk.toString();
        const lines = partial.split("\n");
        partial = lines.pop().slice(-1024);
        for (const line of lines)
          if (/^(?:PROGRESS |# Subtest:|ok \d+ -|not ok \d+ -)/.test(line)) {
            lastMessage = line.trimEnd().slice(0, 200).trimEnd();
            if (
              !progressCount ||
              /^(?:PROGRESS |not ok )/.test(line) ||
              Date.now() - lastProgressAt >= 1000
            )
              progress(lastMessage);
          }
      };
    };
    child.stdout.on("data", capture());
    child.stderr.on("data", capture());
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
      signal?.removeEventListener("abort", stop);
      const durationMs = Date.now() - started;
      deadline.finish();
      resolveRun({
        name: row.name,
        durationMs,
        ...(failure || timedOut || stopped
          ? {
              failureKind: failure
                ? "launch"
                : timedOut
                  ? "timeout"
                  : "stopped",
            }
          : {}),
        startedAt: new Date(started).toISOString(),
        finishedAt: new Date().toISOString(),
        exitCode: timedOut || stopped ? 1 : (code ?? 1),
        executed: true,
        ...(stopped ? { stopped: true } : {}),
        output: `${output}${failure ? `\n${failure}` : ""}${timedOut ? `\nSuite ${row.name} timed out after ${durationMs} ms` : ""}${stopped ? `\nSuite ${row.name} stopped by gate request after ${durationMs} ms` : ""}`,
      });
    };
    child.on("close", (code) => {
      if (!killTimer || escalated) finish(code);
    });
  });
}

/** Weighted lanes, explicit barriers and groups bound process-heavy overlap. */
export async function scheduleSuites(
  table,
  {
    repo = root,
    concurrency = Math.max(
      1,
      Math.min(4, Math.floor(availableParallelism() / 2)),
    ),
    execute = executeSuite,
    onResult = () => {},
    onActiveChange = () => {},
    diagnosticContext = {},
    stopRequested = () => false,
  } = {},
) {
  validateSuites(table);
  if (!Number.isInteger(concurrency) || concurrency < 1)
    throw new Error("Concurrency must be a positive integer");
  if (concurrency > 4)
    throw new Error("Declared gate load caps concurrency at four");
  const build = table.find((row) => row.build);
  const results = [];
  const active = new Map();
  const lanes = Array.from({ length: concurrency }, () => ({
    active: null,
    previous: null,
  }));
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
      ? 1
      : Math.max(1, concurrency - occupiedSlots + 1);
    const gateContext = {
      ...diagnosticContext,
      task: row.name,
      loadClass: isolated ? "isolated" : "shared",
      concurrency: peerConcurrency,
      loadFactor: peerConcurrency * 2,
      reservedSlots: occupiedSlots,
      slotCapacity: concurrency,
    };
    const result = await execute({ ...row, gateContext }, repo);
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
      lanes: laneIndexes,
    };
  };
  const finish = (result) => {
    results.push(result);
    onResult(result);
  };
  onActiveChange([build.name]);
  finish(
    await executeTask(
      build,
      lanes.map((_, index) => index),
      [],
    ),
  );
  onActiveChange([]);
  for (const lane of lanes) lane.previous = build.name;
  if (results[0].exitCode !== 0) return results;
  const pending = table.filter((row) => row !== build);
  for (const row of pending)
    for (const dependency of row.after ?? [])
      if (!table.some((item) => item.name === dependency))
        throw new Error(`Missing dependency: ${dependency}`);
  if (concurrency > 1)
    pending.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const groups = new Set();
  let exclusive = false;
  while (pending.length || active.size) {
    // A stop request ends scheduling at this boundary; the suites already
    // running are ended by their execute adapter and settle below.
    if (stopRequested())
      while (pending.length) {
        const row = pending.pop();
        finish({
          name: row.name,
          exitCode: 1,
          durationMs: 0,
          executed: false,
          output: "Gate stopped by request before this suite started",
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
    while (!exclusive && lanes.some((lane) => lane.active === null)) {
      const freeLanes = lanes
        .map((lane, index) => ({ lane, index }))
        .filter(({ lane }) => lane.active === null)
        .map(({ index }) => index);
      const index = pending.findIndex(
        (row) =>
          reservedSlots(row, concurrency) <= freeLanes.length &&
          (!row.group || !groups.has(row.group)) &&
          (!explicitlyIsolated(row) || active.size === 0) &&
          (row.after ?? []).every((name) =>
            results.some(
              (result) => result.name === name && result.exitCode === 0,
            ),
          ),
      );
      if (index < 0) break;
      const [row] = pending.splice(index, 1);
      const isolated = explicitlyIsolated(row);
      if (isolated) exclusive = true;
      if (row.group) groups.add(row.group);
      const laneIndexes = freeLanes.slice(0, reservedSlots(row, concurrency));
      const predecessors = [
        build.name,
        ...(row.after ?? []),
        ...laneIndexes.map((index) => lanes[index].previous),
        // A task skipped for a failed dependency never started, so it is not
        // a timeline edge (VER-001 F1).
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
      ];
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
          if (isolated) exclusive = false;
          if (row.group) groups.delete(row.group);
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

export function expandSuiteTasks(selected, repo, template) {
  const preflight = selected
    .filter((row) => row.preflight)
    .map((row) => row.name);
  return selected
    .flatMap((row) => {
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
            ],
          },
        ];
      return [row];
    })
    .map((row) => ({
      ...row,
      priority:
        row.priority ??
        (row.exclusive
          ? 200
          : ["skeleton", "worktree", "resume"].includes(row.name)
            ? 80
            : 0),
      ...(!row.build && !row.preflight && preflight.length
        ? { after: [...new Set([...(row.after ?? []), ...preflight])] }
        : {}),
    }));
}

export function aggregateSuiteRows(selected, tasks, rows) {
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
      exitCode: completeCoverage(members, observed) ? 0 : 1,
      durationMs:
        starts.length && ends.length
          ? Math.max(...ends) - Math.min(...starts)
          : 0,
      executed: observed.some((row) => row.executed),
      reused: observed.some((row) => row.reused),
      expectedCases: members.map((row) => row.name),
      cases: observed.map(({ output, ...row }) => ({
        ...row,
        ...(output && (row.exitCode !== 0 || !row.executed) ? { output } : {}),
      })),
      output: "",
    };
  });
}

export async function runGate(
  args = process.argv.slice(2),
  repo = root,
  options = {},
) {
  if (args.includes("--list")) return runGateChecks(args, repo, options);
  const active = beginGateRun(repo, "scripts/test-runner.mjs");
  try {
    return await runGateChecks(args, repo, {
      stopRequested: active.stopRequested,
      ...options,
    });
  } finally {
    active.release();
  }
}

async function runGateChecks(
  args,
  repo,
  { stopRequested = () => false, sandbox: sandboxOptions, table = suites } = {},
) {
  let document = false,
    machinery = false,
    review = false,
    serial = false,
    list = false,
    confinedPartial = false,
    only,
    against;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--document") document = true;
    else if (arg === "--machinery") machinery = true;
    else if (arg === "--review" || arg === "--full") review = true;
    else if (arg === "--serial") serial = true;
    else if (arg === "--list") list = true;
    else if (arg === "--confined-partial") confinedPartial = true;
    else if (arg === "--fresh") {
      /* Every invocation is fresh. */
    } else if (
      arg === "--against" &&
      !against &&
      args[index + 1] &&
      !args[index + 1].startsWith("--")
    )
      against = args[++index];
    else if (arg === "--only" && !only) only = args[++index];
    else
      throw new Error(
        "usage: test-runner [--document|--machinery|--review] [--only <suite>] [--against <rev>] [--confined-partial] [--serial] [--list]",
      );
  }
  if (against && !document)
    throw new Error("--against requires --document (npm run test:docs)");
  if (only && !table.some((row) => row.name === only))
    throw new Error(`Unknown suite: ${only}`);
  let selected = table.filter((row) =>
    only
      ? row.name === only
      : document
        ? row.document
        : machinery
          ? row.machinery
          : row.product,
  );
  if (review && !only && !document && !machinery)
    selected = [...new Set([...selected, ...changedMachinery(repo, table)])];
  if (list) {
    for (const row of confinedPartial
      ? selected.filter((row) => !row.needs)
      : selected)
      console.log(
        `${row.name} — protects: ${row.protects}${row.needs ? ` — needs: ${row.needs}` : ""}`,
      );
    return { exitCode: 0 };
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
  const needsBuild = selected.some((row) => row.needsBuild || row.build);
  selected = [
    needsBuild
      ? table.find((row) => row.build)
      : { name: "document-barrier", build: true, command: [] },
    ...selected.filter((row) => !row.build),
  ];
  const fixture = selected.some((row) => row.name === "release")
    ? createReleaseFixtureContext()
    : null;
  const diagnosticRoot = join(repo, "docs/control/local/harness/runner");
  mkdirSync(diagnosticRoot, { recursive: true });
  const peerFile = join(diagnosticRoot, "active.json"),
    deadlineLog = join(diagnosticRoot, "deadlines.jsonl");
  writeFileSync(deadlineLog, "");
  // Host-confinement fixture roots this run's suites create carry this tag, so
  // the gate judges only its own leftovers in the shared temporary directory
  // (WO-157 item 15, WO-063 D005).
  const fixtureTag = randomUUID().slice(0, 8);
  const concurrency = serial
    ? 1
    : Math.max(1, Math.min(4, Math.floor(availableParallelism() / 2)));
  const tasks = expandSuiteTasks(selected, repo, fixture?.template);
  const stop = new AbortController();
  const stopping = () => {
    if (stopRequested()) stop.abort();
    return stop.signal.aborted;
  };
  const poll = setInterval(stopping, 500);
  try {
    const taskRows = await scheduleSuites(tasks, {
      repo,
      concurrency,
      stopRequested: stopping,
      diagnosticContext: { peerFile, deadlineLog, fixtureTag },
      onActiveChange(names) {
        writeFileSync(`${peerFile}.tmp`, JSON.stringify({ tasks: names }));
        renameSync(`${peerFile}.tmp`, peerFile);
      },
      execute: async (row, cwd) =>
        row.name === "document-barrier"
          ? {
              name: row.name,
              exitCode: 0,
              durationMs: 0,
              executed: true,
              output: "",
            }
          : executeSuite(
              row,
              cwd,
              900_000,
              ({ name, message, elapsedMs }) =>
                console.log(
                  `PROGRESS [${name}] ${(elapsedMs / 1000).toFixed(1)} s ${message}`,
                ),
              stop.signal,
            ),
      onResult(row) {
        if (row.name === "document-barrier") return;
        console.log(
          `${row.exitCode === 0 ? "PASS" : "FAIL"} ${row.name} ${(row.durationMs / 1000).toFixed(2)} s`,
        );
        if (row.exitCode !== 0)
          for (const line of (row.output ?? "").trimEnd().split("\n"))
            console.log(`  [${row.name}] ${line}`);
      },
    });
    if (stopping())
      throw new Error(
        `Gate stopped by request after ${((Date.now() - started) / 1000).toFixed(1)} s; no check recorded for tree ${treeHash}`,
      );
    const failureComparisons = document
      ? await classifyDocumentFailures(repo, tasks, taskRows, {
          against,
          signal: stop.signal,
          execute: (row, cwd, signal) =>
            executeSuite(row, cwd, 900_000, undefined, signal),
        })
      : [];
    for (const observation of failureComparisons)
      console.log(
        `${observation.classification} ${observation.name} against ${observation.base ?? "unavailable"}${observation.reason ? `: ${observation.reason}` : ""}`,
      );
    if (stopping())
      throw new Error("Gate stopped during base comparison; no check recorded");
    const rows = aggregateSuiteRows(selected, tasks, taskRows);
    const unchanged = gateCodeIdentity(repo) === codeIdentity;
    // A root that survives every suite's own teardown is a failed gate; the
    // check names it and removes nothing, so the leftover stays diagnosable.
    const abandoned = readdirSync(tmpdir())
      .filter((name) =>
        name.startsWith(`dotln-host-confinement-${fixtureTag}-`),
      )
      .map((name) => join(tmpdir(), name))
      .sort();
    const check = {
      checkId,
      treeHash,
      codeIdentity,
      subject: treeHash,
      durationMs: Date.now() - started,
      exitCode:
        completeCoverage(tasks, taskRows) && unchanged && !abandoned.length
          ? 0
          : 1,
      executed: true,
      evidenceRef: `host-gate:${codeIdentity}:${only ?? checkId}`,
      recordedAt: new Date().toISOString(),
      executionMode: "fresh",
      freshSuites: taskRows.filter((row) => row.executed).length,
      reusedSuites: 0,
      requiredSuites: selected.map((row) => row.name),
      // A partial row names what it left out; no product-gate consumer reads it.
      ...(confinedPartial
        ? { partial: true, excludedSuites: excluded.map((row) => row.name) }
        : {}),
      ...(sandbox.marker ? { sandbox } : {}),
      ...(abandoned.length ? { abandonedRoots: abandoned } : {}),
      cases: rows,
      ...(document ? { failureComparisons } : {}),
      loadClass: {
        sharedCap: concurrency,
        factorPerSlot: 2,
        maxHostLoadPerCpu: 2,
        scheduler: "exclusive-machinery-v1",
      },
      taskTimeline: taskRows
        .filter((row) => row.startedAt)
        .map(({ output, ...row }) => row),
      deadlineDiagnostics: existsSync(deadlineLog)
        ? readFileSync(deadlineLog, "utf8")
            .split("\n")
            .filter(Boolean)
            .map(JSON.parse)
            .filter((row) => row.hit)
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
    if (!only && !machinery) recordGateChecks(repo, [check]);
    console.log(
      `${checkId}: ${rows.filter((row) => row.exitCode === 0).length} passed; ${rows.filter((row) => row.exitCode !== 0).length} failed; ${(check.durationMs / 1000).toFixed(2)} s; ${check.freshSuites} fresh tasks${unchanged ? "" : "; code changed"}${abandoned.length ? `; abandoned fixture roots: ${abandoned.join(", ")}` : ""}${confinedPartial ? `; partial, not product-gate evidence: excluded ${check.excludedSuites.join(", ") || "none"}` : ""}`,
    );
    return check;
  } finally {
    clearInterval(poll);
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
