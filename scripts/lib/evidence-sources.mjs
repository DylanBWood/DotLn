import { docRelative } from "./config.mjs";
import { existsSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";
import {
  sourceDialect,
  sourceImports,
} from "../../packages/skeleton/src/source-reading.mjs";
// Source files imported by the evidence tools plus their fixed data/build inputs.
// Generated harness output and selected edition output are deliberately absent.
// Package indexes load their complete export graphs; these are explicit files.
const commonSources = [
  // The harness host loads the shared dispatch reader by its installed root.
  "packages/skeleton/src/duration.mjs",
  "packages/skeleton/src/test-selection.mjs",
  "packages/skeleton/src/dispatch-journal.mjs",
  // What a worker runs: the configuration and the Contributor loadout both
  // read the one table, and the kit's own models are its first rows.
  "packages/skeleton/src/worker-catalog.mjs",
  "packages/skeleton/src/worker-models.mjs",
  "scripts/lib/config.mjs",
  "scripts/lib/control-actor.mjs",
  "scripts/lib/control-store.mjs",
  "scripts/lib/control-time.mjs",
  "scripts/lib/control.mjs",
  "scripts/lib/dependencies.mjs",
  // A work order's header is read through the format's one reader, over the
  // one Markdown parser the scripts carry (WO-275).
  "scripts/lib/work-order-document.mjs",
  "scripts/lib/markdown-links.mjs",
  "scripts/lib/vendor/prettier-markdown.mjs",
  "scripts/lib/derived-contract.mjs",
  "scripts/lib/dispatch-bound.mjs",
  "scripts/lib/duration.mjs",
  "scripts/lib/harness-context.mjs",
  "scripts/lib/process-budget.mjs",
  "scripts/lib/release-tags.mjs",
  "scripts/lib/validation.mjs",
  "package-lock.json",
  "package.json",
  "packages/compiler/package.json",
  "packages/compiler/src/artifact-identity.ts",
  "packages/compiler/src/attribution.mjs",
  "packages/compiler/src/authority.ts",
  "packages/compiler/src/compile.ts",
  "packages/compiler/src/feedback.ts",
  "packages/compiler/src/harness.ts",
  "packages/compiler/src/codex-continuation.mjs",
  "packages/compiler/src/index.ts",
  "packages/compiler/src/normalize.ts",
  "packages/compiler/src/operator-control.mjs",
  "packages/compiler/src/presence-schema.ts",
  "packages/compiler/src/presence.ts",
  "packages/compiler/src/render.ts",
  "packages/compiler/src/seiri.ts",
  "packages/compiler/src/senses.ts",
  // WO-060: the compiler index re-exports the SourceBundle contract.
  "packages/compiler/src/source-bundle.ts",
  // WO-061: the compiler index re-exports the pure StoryContract compiler.
  "packages/compiler/src/story-contract.ts",
  "packages/compiler/src/types.ts",
  "packages/compiler/src/verification.ts",
  "packages/compiler/src/views.ts",
  "packages/compiler/tsconfig.json",
  "packages/beacons/package.json",
  "packages/kernel/package.json",
  "packages/kernel/src/continuation.ts",
  // The kernel package every host imports as `@dotln/kernel` (WO-157).
  "packages/kernel/src/core.ts",
  "packages/kernel/src/index.ts",
  "packages/kernel/src/store.ts",
  "packages/kernel/src/types.ts",
  "packages/kernel/tsconfig.json",
  "packages/skeleton/package.json",
  "packages/skeleton/src/evidence-editions.mjs",
  "packages/skeleton/src/version.ts",
  "packages/skeleton/src/execution-environment.ts",
  "packages/skeleton/src/source-change-environment.ts",
  "packages/skeleton/src/source-change-command.ts",
  "packages/skeleton/src/source-change-host.ts",
  "packages/skeleton/src/host-interruption.ts",
  // The source host dynamically loads native launch and ownership tools.
  "scripts/lib/host-resources.mjs",
  "scripts/lib/gate-scheduling-baseline.json",
  "scripts/lib/host-lock.c",
  "scripts/lib/host-footprint.c",
  "scripts/lib/gate-evidence.mjs",
  "packages/skeleton/src/gate-evidence.mjs",
  "packages/skeleton/src/source-change-state.ts",
  "packages/skeleton/src/source-change-worktree.ts",
  "packages/skeleton/src/reactor.ts",
  "packages/skeleton/src/verification-fold.ts",
  "packages/skeleton/src/repair.ts",
  "packages/skeleton/src/review.ts",
  "packages/skeleton/src/repair-host.ts",
  "packages/skeleton/src/resident-state.ts",
  "packages/skeleton/src/target-publication-policy.ts",
  "packages/skeleton/src/vertical.ts",
  "packages/skeleton/src/presence-signals.ts",
  "packages/skeleton/src/presence-heartbeat.ts",
  "packages/skeleton/src/resident-store.ts",
  "packages/skeleton/src/runtime-status-contract.ts",
  "packages/skeleton/src/worker-store.ts",
  "packages/skeleton/src/verification-protocol.ts",
  "packages/skeleton/src/plan-refutation-protocol.ts",
  // Request protocols the registered transports import (WO-157 item 12).
  "packages/skeleton/src/entropy-review-protocol.ts",
  "packages/skeleton/src/mission-check-protocol.ts",
  "packages/skeleton/src/vertical-judgment-protocol.ts",
  "packages/skeleton/src/change-review-protocol.ts",
  // Runtime siblings the registered hosts and protocols import (WO-157).
  "packages/skeleton/src/artifact-identity.ts",
  "packages/skeleton/src/beacon-perception.ts",
  "packages/beacons/src/control-codebook.mjs",
  "packages/skeleton/src/gate-deadlines.mjs",
  "packages/skeleton/src/loadouts/entropy-reducer.ts",
  "packages/skeleton/src/scenario.ts",
  "packages/skeleton/src/verification-host.ts",
  "packages/skeleton/src/verification-worktree.ts",
  "packages/skeleton/src/worker-status.ts",
  "packages/skeleton/src/worker-transport.ts",
  "packages/skeleton/src/temporary-roots.ts",
  "packages/skeleton/src/temporary-root-records.mjs",
  "scripts/lib/temporary-roots.mjs",
  "packages/beacons/src/beacon-codebook.mjs",
  "packages/beacons/src/beacon-v3-codebook.mjs",
  "packages/skeleton/src/control-beacon.ts",
  "packages/skeleton/src/live-reactor-driver.ts",
  "packages/skeleton/src/loadouts/feedback.ts",
  "packages/skeleton/src/usage-observation.mjs",
  "packages/skeleton/src/usage-reading.mjs",
  "packages/skeleton/src/verification.ts",
  "packages/skeleton/src/worker-protocol.ts",
  "packages/skeleton/src/presence-machine.ts",
  "packages/skeleton/src/actor-catalog.ts",
  "packages/skeleton/src/actor-contract.ts",
  "packages/skeleton/src/cli-actor-contract.ts",
  "packages/skeleton/src/cli-actor.ts",
  "packages/skeleton/src/cli-episode.ts",
  "packages/skeleton/src/handoff-contract.ts",
  "packages/skeleton/src/handoff-actor.ts",
  "packages/skeleton/src/work-candidate.ts",
  "packages/skeleton/src/script-episode.ts",
  "packages/skeleton/src/discovery-sandbox.ts",
  "packages/skeleton/src/discovery-actor.ts",
  "packages/skeleton/src/discovery-cli.ts",
  "packages/skeleton/src/discovery.ts",
  "packages/skeleton/src/sha256.ts",
  "packages/skeleton/src/portfolio.ts",
  "packages/skeleton/src/portfolio-actor.ts",
  "packages/skeleton/src/portfolio-host.ts",
  "packages/skeleton/tsconfig.json",
  "scripts/build.mjs",
  "scripts/lib/build-freshness.mjs",
  "scripts/lib/gate-reuse.mjs",
  "scripts/lib/evidence-sources.mjs",
  // The import reader reads sources through the one source reader.
  "packages/skeleton/src/source-reading.mjs",
  // WO-162: evidence tools consume the shared byte serializers and Git/JSON IO.
  "scripts/lib/helpers.mjs",
  "scripts/lib/harness-instruction.mjs",
  "scripts/lib/git.mjs",
  "scripts/lib/paths.mjs",
  "packages/skeleton/src/runtime-inputs.mjs",
  "tsconfig.json",
];

const authoritySources = (root) => [
  ...commonSources,
  docRelative(root, "evidence", "WO-042/artifact-identity/audit.json"),
  docRelative(
    root,
    "evidence",
    "WO-042/artifact-identity/negative-transcripts.json",
  ),
  docRelative(root, "evidence", "WO-042/artifact-identity/scenario.jsonl"),
  docRelative(
    root,
    "evidence",
    "WO-042/artifact-identity/semantic-hash-inventory.json",
  ),
  docRelative(root, "evidence", "WO-042/authority-baseline.json"),
  docRelative(root, "evidence", "WO-042/authority.json"),
  docRelative(root, "evidence", "WO-042/bundle-diff.json"),
  docRelative(root, "evidence", "WO-042/verification/events.jsonl"),
  docRelative(root, "evidence", "WO-042/verification/matrix.json"),
  docRelative(root, "evidence", "WO-042/verification/stale-status.json"),
  docRelative(root, "evidence", "WO-042/verification/stale-status.txt"),
  "packages/compiler/fixtures/wo029-entropy-reducer.json",
  "packages/compiler/fixtures/wo029-identities.json",
  "packages/compiler/test/authority-fixture.ts",
  "packages/kernel/src/core.ts",
  "packages/kernel/src/index.ts",
  "packages/kernel/src/store.ts",
  "packages/kernel/src/types.ts",
  "packages/skeleton/fixtures/wo003-decision-traces.json",
  "packages/skeleton/src/feedback-boundary.ts",
  "packages/skeleton/src/feedback-source-comments.ts",
  "packages/skeleton/src/gate-deadlines.mjs",
  "packages/skeleton/src/gate-evidence.mjs",
  "packages/skeleton/src/harness-command.ts",
  "packages/skeleton/src/shell-reading.mjs",
  "packages/skeleton/src/document-quality.ts",
  "packages/skeleton/src/harness-host.ts",
  "packages/skeleton/src/dispatch-journal.mjs",
  "packages/skeleton/src/subagent-budget.ts",
  "packages/skeleton/src/observed-facts.ts",
  "packages/skeleton/src/correction-observation.mjs",
  "packages/skeleton/src/loadouts/contributor.ts",
  "packages/skeleton/src/loadouts/entropy-reducer.ts",
  "packages/skeleton/src/loadouts/executor-supports.ts",
  "packages/skeleton/src/loadouts/feedback.ts",
  "packages/skeleton/src/loadouts/goal-alignment.ts",
  "packages/skeleton/src/loadouts/plan-refuter.ts",
  "packages/skeleton/src/loadouts/process-cost.ts",
  "packages/skeleton/src/loadouts/prompt-support.ts",
  "packages/skeleton/src/plan-refutation-protocol.ts",
  "packages/skeleton/src/usage-observation.mjs",
  "packages/skeleton/src/usage-reading.mjs",
  "packages/skeleton/src/worker-protocol.ts",
  "packages/skeleton/src/writer-teardown.mjs",
  "scripts/authority-evidence.mjs",
  "scripts/lib/harness.mjs",
  "scripts/lib/paths.mjs",
  "scripts/lib/terms.mjs",
];

const artifactIdentitySources = (root) => [
  ...commonSources,
  "packages/compiler/fixtures/wo029-entropy-reducer.json",
  "packages/compiler/fixtures/wo029-identities.json",
  "corpus/harness/id-corpus-lib.mjs",
  "corpus/harness/wo101-support.mjs",
  docRelative(root, "evidence", "WO-029/baseline.json"),
  "packages/kernel/src/core.ts",
  "packages/kernel/src/index.ts",
  "packages/kernel/src/store.ts",
  "packages/kernel/src/types.ts",
  "packages/skeleton/fixtures/repo-tree.json",
  "packages/skeleton/fixtures/wo003-decision-traces.json",
  "packages/skeleton/fixtures/wo029-legacy-scenario.jsonl",
  "packages/skeleton/src/artifact-audit.ts",
  "packages/skeleton/src/artifact-identity.ts",
  "packages/skeleton/src/audit.ts",
  "packages/beacons/src/beacon-codebook.mjs",
  "packages/skeleton/src/beacon-perception.ts",
  "packages/beacons/src/beacon-v3-codebook.mjs",
  "packages/skeleton/src/control-beacon.ts",
  "packages/beacons/src/control-codebook.mjs",
  "packages/skeleton/src/loadouts/entropy-reducer.ts",
  "packages/skeleton/src/plan-refutation-protocol.ts",
  "packages/skeleton/src/scenario.ts",
  "packages/skeleton/src/live-reactor-driver.ts",
  "packages/skeleton/src/verification-protocol.ts",
  "packages/skeleton/src/worker-protocol.ts",
  "scripts/artifact-identity-evidence.mjs",
];

const verificationSources = (root) => [
  ...commonSources,
  "packages/kernel/src/core.ts",
  "packages/kernel/src/index.ts",
  "packages/kernel/src/store.ts",
  "packages/kernel/src/types.ts",
  "packages/skeleton/src/artifact-identity.ts",
  "packages/beacons/src/beacon-codebook.mjs",
  "packages/skeleton/src/beacon-perception.ts",
  "packages/beacons/src/beacon-v3-codebook.mjs",
  "packages/beacons/src/control-codebook.mjs",
  "packages/skeleton/src/gate-deadlines.mjs",
  "packages/skeleton/src/plan-refutation-protocol.ts",
  "packages/skeleton/src/verification-demo.ts",
  "packages/skeleton/src/verification-fake.ts",
  "packages/skeleton/src/verification-host.ts",
  "packages/skeleton/src/verification-worktree.ts",
  "packages/skeleton/src/verification-protocol.ts",
  "packages/skeleton/src/verification.ts",
  "packages/skeleton/src/worker-protocol.ts",
  "packages/skeleton/src/worker-status.ts",
  "packages/skeleton/src/worker-store.ts",
  "packages/skeleton/src/worker-worktree.ts",
  "scripts/verification-evidence.mjs",
];

const feedbackSources = (root) => [
  ...commonSources,
  docRelative(root, "discovery", "environment.json"),
  "packages/kernel/src/core.ts",
  "packages/kernel/src/index.ts",
  "packages/kernel/src/store.ts",
  "packages/kernel/src/types.ts",
  "packages/skeleton/src/artifact-identity.ts",
  "packages/beacons/src/beacon-codebook.mjs",
  "packages/skeleton/src/beacon-perception.ts",
  "packages/beacons/src/beacon-v3-codebook.mjs",
  "packages/beacons/src/control-codebook.mjs",
  "packages/skeleton/src/feedback-audit.ts",
  "packages/skeleton/src/feedback-boundary.ts",
  "packages/skeleton/src/feedback-selfhost.ts",
  "packages/skeleton/src/feedback-source-comments.ts",
  "packages/skeleton/src/gate-deadlines.mjs",
  "packages/skeleton/src/gate-evidence.mjs",
  "packages/skeleton/src/harness-command.ts",
  "packages/skeleton/src/shell-reading.mjs",
  "packages/skeleton/src/document-quality.ts",
  "packages/skeleton/src/harness-host.ts",
  "packages/skeleton/src/dispatch-journal.mjs",
  "packages/skeleton/src/subagent-budget.ts",
  "packages/skeleton/src/observed-facts.ts",
  "packages/skeleton/src/correction-observation.mjs",
  "packages/skeleton/src/loadouts/contributor.ts",
  "packages/skeleton/src/loadouts/executor-supports.ts",
  "packages/skeleton/src/loadouts/feedback.ts",
  "packages/skeleton/src/loadouts/goal-alignment.ts",
  "packages/skeleton/src/loadouts/process-cost.ts",
  "packages/skeleton/src/loadouts/prompt-support.ts",
  "packages/skeleton/src/plan-refutation-protocol.ts",
  "packages/skeleton/src/usage-observation.mjs",
  "packages/skeleton/src/usage-reading.mjs",
  "packages/skeleton/src/verification-host.ts",
  "packages/skeleton/src/verification-worktree.ts",
  "packages/skeleton/src/verification-protocol.ts",
  "packages/skeleton/src/verification.ts",
  "packages/skeleton/src/worker-protocol.ts",
  "packages/skeleton/src/worker-store.ts",
  "packages/skeleton/src/worker-transport.ts",
  "packages/skeleton/src/writer-teardown.mjs",
  "packages/skeleton/test/feedback-audit-source.test.ts",
  "packages/skeleton/test/feedback-fixtures.test.ts",
  "packages/skeleton/test/feedback-v2.test.ts",
  "scripts/feedback-commit-msg.mjs",
  "scripts/feedback-evidence.mjs",
];

const harnessSources = (root) => [
  ...commonSources,
  docRelative(root, "control", "budgets.json"),
  docRelative(root, "discovery", "harness-smoke-2026-09-07.json"),
  docRelative(root, "discovery", "harness-smoke-2026-09-07.md"),
  docRelative(root, "discovery", "harness-smoke-2026-09-07/claude-bare.json"),
  docRelative(root, "discovery", "harness-smoke-2026-09-07/claude.json"),
  docRelative(root, "discovery", "harness-smoke-2026-09-07/codex.json"),
  docRelative(root, "evidence", "WO-042/harness-context.json"),
  docRelative(root, "evidence", "WO-042/harness-live/executor-001.json"),
  docRelative(root, "evidence", "WO-042/harness-live/executor-002.json"),
  docRelative(root, "evidence", "WO-042/harness-live/executor-003.json"),
  docRelative(root, "evidence", "WO-042/harness-live/release-close-001.json"),
  docRelative(root, "evidence", "WO-042/harness-live/release-close-002.json"),
  docRelative(root, "evidence", "WO-042/harness-live/reviewer-001.json"),
  docRelative(root, "evidence", "WO-042/harness-live/reviewer-002.json"),
  docRelative(root, "evidence", "WO-042/harness-live/reviewer-003.json"),
  docRelative(root, "evidence", "WO-042/harness-live/verifier-001.json"),
  docRelative(root, "evidence", "WO-042/harness-live/verifier-002.json"),
  docRelative(
    root,
    "evidence",
    "WO-042/harness-live/writer-foreign-dead-001.json",
  ),
  docRelative(
    root,
    "evidence",
    "WO-042/harness-live/writer-foreign-dead-002.json",
  ),
  docRelative(
    root,
    "evidence",
    "WO-042/harness-live/writer-foreign-live-001.json",
  ),
  docRelative(
    root,
    "evidence",
    "WO-042/harness-live/writer-foreign-live-002.json",
  ),
  "packages/skeleton/src/feedback-boundary.ts",
  "packages/skeleton/src/feedback-source-comments.ts",
  "packages/skeleton/src/gate-deadlines.mjs",
  "packages/skeleton/src/gate-evidence.mjs",
  "packages/skeleton/src/harness-command.ts",
  "packages/skeleton/src/shell-reading.mjs",
  "packages/skeleton/src/document-quality.ts",
  "packages/skeleton/src/harness-host.ts",
  "packages/skeleton/src/dispatch-journal.mjs",
  "packages/skeleton/src/subagent-budget.ts",
  "packages/skeleton/src/observed-facts.ts",
  "packages/skeleton/src/correction-observation.mjs",
  "packages/skeleton/src/loadouts/contributor.ts",
  "packages/skeleton/src/loadouts/executor-supports.ts",
  "packages/skeleton/src/loadouts/feedback.ts",
  "packages/skeleton/src/loadouts/goal-alignment.ts",
  "packages/skeleton/src/loadouts/process-cost.ts",
  "packages/skeleton/src/loadouts/prompt-support.ts",
  "packages/skeleton/src/usage-observation.mjs",
  "packages/skeleton/src/usage-reading.mjs",
  "packages/skeleton/src/writer-teardown.mjs",
  "scripts/harness-context.mjs",
  "scripts/harness-evidence.mjs",
  "scripts/lib/harness-context.mjs",
  "scripts/lib/harness.mjs",
  "scripts/lib/paths.mjs",
  "scripts/lib/process-budget.mjs",
  "scripts/lib/terms.mjs",
  "scripts/terms.mjs",
];

/** The recorded source inventory for one launchpad: kit files keep their
 * repository-relative names and document inputs follow the configured roots. */
export const evidenceSources = (root) => ({
  authority: authoritySources(root),
  "artifact-identity": artifactIdentitySources(root),
  verification: verificationSources(root),
  feedback: feedbackSources(root),
  harness: harnessSources(root),
});

// ------------------------------------------------ the import closure (WO-157)

/** Registered siblings a registered source imports but an edition deliberately
 * does not record, each with its reason (WO-157 item 12, WO-151 D001). Every
 * other relative runtime import of a registered source must be registered. */
const BUILD_ONLY =
  "scripts/build.mjs loads it only after compiling, to preserve an installed harness runtime snapshot (harness.mjs) or to test for a main module (paths.mjs); compiled output does not depend on it. The authority and harness editions register it.";
export const evidenceImportExclusions = {
  "*": {
    "packages/skeleton/src/plan-first-boundary.ts":
      "Optional plan-first approval guard. All evidence editions use the default off election; plan-first and harness fixtures judge its activation, freshness and write boundaries.",
    "scripts/lib/plan-first.mjs":
      "Optional plan-first state and candidate helpers. The editions use the default off election; lifecycle and harness fixtures judge this workflow.",
    "scripts/lib/plan-first-screen.mjs":
      "Plan-first document and passage screening, exercised by its lifecycle fixtures rather than the evidence editions.",
    "scripts/lib/temporary-prune.mjs":
      "Lifecycle cleanup runs after a session or gate ends; no edition invokes those cleanup boundaries. Ownership records are registered separately; harness and runner fixtures judge pruning, retention and parallel-worktree safety.",
    "scripts/lib/temporary-prune-summary.mjs":
      "The prune summary plan start applies and update preview prints is outside the editions' judged behavior; planning, update and release fixtures judge it, its deferred and stopped reports and its runtime-unavailable path.",
    "scripts/lib/config.mjs":
      "Resolves the launchpad and its configured document roots; each edition's inputs are registered by the path it resolves, and its repository and portfolio validation is outside every edition's recorded behaviour.",
    "scripts/lib/build-overlay.mjs":
      "Shared instance-overlay schema and file-boundary validation; the editions use the unchanged default Contributor without overlays, while configuration-root and harness fixtures judge this reader.",
    "scripts/lib/feature-registry.mjs":
      "The feature registry and its alias resolver, which the configuration reader validates a declared section through; the features and configuration-root fixtures judge them, and editions run the unchanged default Contributor without electing optional instance features.",
    "scripts/lib/features.mjs":
      "The instance elections reader over the feature registry, judged by the features, configuration-root and harness fixtures; editions run the unchanged default Contributor and do not elect optional instance features.",
    "packages/skeleton/src/local-model-actor.ts":
      "The local-model actor family (WO-110, WO-138), reached through actor-catalog.ts; no edition dispatches a local-model actor: the feedback self-host admits only claude-cli-print and codex-cli-exec, and verification records the fake transport.",
    "packages/skeleton/src/local-model-contract.ts":
      "The local-model actor contract, reached through actor-contract.ts; no edition dispatches a local-model actor.",
    "packages/skeleton/src/mission-check-host.ts":
      "The resident mission-check actor's host, reached through cli-actor.ts; no edition dispatches a mission check. Its request protocol is registered because the registered transports validate it.",
    "packages/skeleton/src/mission-check-source.ts":
      "The resident mission-check actor's source reader, reached through cli-actor.ts; no edition dispatches a mission check.",
    "packages/skeleton/src/runtime-status.ts":
      "The resident writes this disposable read-only UI projection after a durable event. The evidence editions judge worker, verification and feedback behavior from the log and do not consume the status file; its compiler-independent view contract is checked by WO-114 fixtures.",
  },
  authority: {},
  "artifact-identity": {
    "scripts/lib/harness.mjs": BUILD_ONLY,
    "scripts/lib/paths.mjs": BUILD_ONLY,
  },
  verification: {
    "scripts/lib/harness.mjs": BUILD_ONLY,
    "scripts/lib/paths.mjs": BUILD_ONLY,
  },
  feedback: {
    "scripts/lib/harness.mjs": BUILD_ONLY,
    "scripts/lib/paths.mjs": BUILD_ONLY,
  },
  harness: {
    "scripts/lib/branch-terms.mjs":
      "The local-terms screen over a branch's change, reached only through terms.mjs's branch form, which the document gate's terms task and the launchpad publish helpers run; the harness reaches terms.mjs through its check and --plan-first forms, and the runner, worktree and planning fixtures judge the branch screen.",
  },
};

// Imports are read from code tokens (the source reader's sourceImports),
// not from text, so a quote, semicolon or `import` inside a string, template,
// regular expression or comment is never read as syntax. No process starts.

// Each source's specifiers, kept with the text they were read from, so a
// process that asks again for an unchanged source does not read it again.
const specifierMemo = new Map();
/** The runtime specifiers of each path; with `dynamic` false, those the
 * module loads when it is itself loaded. */
function specifiersOf(root, paths, dynamic = true) {
  const result = new Map();
  for (const path of paths) {
    const absolute = join(root, path);
    const key = `${dynamic ? "all" : "static"}:${absolute}`;
    const source = readFileSync(absolute, "utf8");
    const known = specifierMemo.get(key);
    const specifiers =
      known?.source === source
        ? known.specifiers
        : sourceDialect(path) !== null
          ? sourceImports(source, { dynamic })
          : [];
    specifierMemo.set(key, { source, specifiers });
    result.set(path, specifiers);
  }
  return result;
}

/** Repository paths a source imports at run time: relative imports, and
 * `@dotln/<package>` imports at the package's source entry or named leaf. A compiled
 * `dist/(src|test)/x.js` target names its source file; other bare packages
 * are dependencies outside the repository. The option `dynamic: false`
 * leaves out what only an `import()` call loads. */
export const relativeImports = (root, path, options) =>
  relativeImportsOf(root, [path], options).get(path);

/** relativeImports for many sources at once, which parses them in one
 * batch: each path mapped to its imports. */
export function relativeImportsOf(root, paths, options) {
  const specifiers = specifiersOf(root, paths, options?.dynamic !== false);
  return new Map(
    paths.map((path) => [
      path,
      resolvedImports(root, path, specifiers.get(path), options),
    ]),
  );
}

function resolvedImports(root, path, specifiers, { sourcePaths = true } = {}) {
  const found = new Set();
  for (const spec of specifiers) {
    const workspace = /^@dotln\/([^/]+)(?:\/(.+))?$/u.exec(spec);
    if (workspace) {
      if (!sourcePaths) {
        const directory = `packages/${workspace[1]}`;
        const manifest = JSON.parse(
          readFileSync(join(root, directory, "package.json"), "utf8"),
        );
        const select = (value) =>
          typeof value === "string"
            ? value
            : (value?.import ?? value?.node ?? value?.default);
        let target =
          manifest.exports?.[workspace[2] ? `./${workspace[2]}` : "."] ??
          (!workspace[2] ? (manifest.exports ?? manifest.main) : undefined);
        while (target && typeof target !== "string") target = select(target);
        if (typeof target === "string")
          found.add(posix.join(directory, target));
        else
          throw new Error(
            `Copied-fixture import has no declared runtime export: ${spec}`,
          );
        continue;
      }
      const index = workspace[2]
        ? `packages/${workspace[1]}/src/${workspace[2]}`
        : `packages/${workspace[1]}/src/index.ts`;
      if (existsSync(join(root, index))) found.add(index);
      continue;
    }
    if (!spec.startsWith(".")) continue;
    let target = posix.normalize(posix.join(posix.dirname(path), spec));
    const built = /^packages\/([^/]+)\/dist\/(src|test)\/(.+)\.js$/u.exec(
      target,
    );
    if (built && sourcePaths) {
      const stem = `packages/${built[1]}/${built[2]}/${built[3]}`;
      target =
        [".ts", ".mjs"]
          .map((extension) => stem + extension)
          .find((file) => existsSync(join(root, file))) ?? target;
    } else if (
      sourcePaths &&
      target.endsWith(".js") &&
      existsSync(join(root, target.replace(/\.js$/u, ".ts")))
    )
      target = target.replace(/\.js$/u, ".ts");
    found.add(target);
  }
  return [...found].sort();
}

/** `importer imports target` for every relative runtime import of a
 * registered source that the edition neither registers nor excludes. */
export function unregisteredEvidenceImports(root, kind) {
  const sources = evidenceSources(root)[kind];
  if (!sources) throw new Error(`unknown evidence edition: ${kind}`);
  const registered = new Set(sources);
  const excluded = {
    ...evidenceImportExclusions["*"],
    ...evidenceImportExclusions[kind],
  };
  const findings = [];
  const imports = relativeImportsOf(
    root,
    sources.filter((path) => /\.(?:ts|mjs|js|cjs)$/u.test(path)),
  );
  for (const [source, targets] of imports)
    for (const target of targets)
      if (!registered.has(target) && !Object.hasOwn(excluded, target))
        findings.push(`${source} imports ${target}`);
  return findings;
}

/** Run by every edition script before it writes or checks anything. */
export function checkEvidenceImports(root, kind) {
  const findings = unregisteredEvidenceImports(root, kind);
  if (findings.length)
    throw new Error(
      `${findings.map((finding) => `unregistered ${kind} evidence import: ${finding}`).join("\n")}; register it in scripts/lib/evidence-sources.mjs or exclude it there with a reason`,
    );
}
