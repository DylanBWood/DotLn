#!/usr/bin/env node
import {
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import { boundTemporaryRoots } from "./lib/temporary-prune.mjs";
import { formatPruneReport } from "./lib/temporary-prune-summary.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { buildFreshness } from "./lib/build-freshness.mjs";
import { releaseSteps, withReleaseStep } from "./lib/release-steps.mjs";
import {
  hasPackageSources,
  isKitRoot as isKitWorktree,
} from "../packages/skeleton/src/runtime-inputs.mjs";
import { json as prettyJson, sha256Hex as sha256 } from "./lib/helpers.mjs";
import {
  harnessRuntimeCause,
  claudeSessionReport,
  currentHarnessSessionReport,
  refreshHarnessRuntime,
} from "./lib/harness-runtime.mjs";
import { exportSiblings, readDeclaration } from "./lib/siblings.mjs";
import {
  docPath,
  docRelative,
  findLaunchpad,
  loadConfig,
  validateConfig,
  CONFIG_FILENAME,
} from "./lib/config.mjs";

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { release as osRelease, tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import {
  parseReleaseNotes,
  releaseNoteHeadings,
  releaseNotesPathFor,
  targetReleaseNotesSource,
} from "./lib/release-notes.mjs";
import {
  HOST_GIT_READ,
  ensureGhFor,
  ensureRelease,
  environmentWithoutGhRepo,
  parseGitHubTarget,
  pushAnnotatedTag,
  pushUrl,
  remoteTags as remoteTagsAt,
  resolveGitHubPushTarget,
} from "./lib/github-repository.mjs";
import {
  absoluteBodyLinks,
  relativeLinkFailures,
  assertGitHubBodyProfile,
  assertPullRequestBodyShape,
  labelledParts,
  withMeterBlockLast,
  withTemporaryBody,
} from "./lib/github-body.mjs";
import { digestOf, takeConfirmTerms } from "./lib/confirm-terms.mjs";
import {
  applyReleasePreparation,
  integrationPreparationRefusal,
  planReleasePreparation,
  releaseClaimLine,
} from "./lib/release-preparation.mjs";
import { licenseSurfaceRules } from "./license-surfaces.mjs";
import {
  failureOf,
  mainWorktree as findMainWorktree,
  parseWorktrees,
  removeMergedBranch,
  releaseCloseCommand,
  shellQuote,
  spawnGit,
  runGit,
  runGitPathList,
} from "./lib/git.mjs";
import {
  parseJson,
  readJsonFile,
  workOrderAuthorityPath,
  ignoredLane,
} from "./lib/paths.mjs";
import { materialSummary } from "./lib/material-summary.mjs";
import { CONTROL_LOG_SCHEMA_VERSION, statusProjection } from "./resume.mjs";
import {
  readControl,
  readControls,
  controlFromSources,
  addedSegmentEvents,
  eventsForOrder,
  latestClosedOrder,
  openOrders,
  branchWorkOrder,
  selectWorkOrder,
} from "./lib/control-store.mjs";
import { executorWriterRelease } from "./lib/executor-handoff.mjs";
import {
  removeUnregisteredWorktree,
  retainedWorktreeRemovalSubjects,
} from "./lib/worktree-removal.mjs";
import { withHostLock } from "./lib/host-resources.mjs";
import { releaseListCache } from "./lib/release-list-cache.mjs";
import {
  recordedRepositoryClone,
  targetRecordSources,
  targetWorktreeForOrder,
} from "./lib/target-worktrees.mjs";
import {
  inventoryMaterial,
  materialCloseCommand,
  materialFlagValue,
  parseMaterialFlags,
  requireMaterialContainment,
} from "./lib/worktree-material.mjs";
import {
  renderReleaseHistory,
  writeReleaseHistory,
} from "./lib/release-history.mjs";
import {
  humanLayerFromAnnotation,
  manifestFromAnnotation,
  releaseAnnotations,
} from "./lib/release-tags.mjs";

import {
  compareVersions,
  historicalWorkOrders,
  humanLayerFromTag,
  isDotLnRelease,
  localReleaseRecords,
  localTags,
  isStarterTag,
  manifestFromTag,
  manifestWorkOrders,
  reviewedProductGate,
  semver,
  strictVersionsIn,
  tagAnnotation,
} from "./lib/release-records.mjs";

const toolRoot = findLaunchpad();
// Dry-run reads the prospective merge revision while leaving main in place.
let sourceRevision = "HEAD";
let previewRuntimeRoot;

const evidenceCommands = [
  "npm ci",
  "npm test",
  "node packages/skeleton/dist/src/cli.js",
  "git status --porcelain",
];
const currentEvidenceCommands = [
  "npm run test:full",
  "node packages/skeleton/dist/src/cli.js",
  "git status --porcelain",
];
const templateShape = {
  schemaVersion: 1,
  release: {
    application: null,
    commit: null,
    subject: null,
    committedAt: null,
    previousRelease: null,
    distribution: null,
  },
  workOrder: { id: null, path: null },
  versions: { root: null, components: {} },
  schemas: {
    eventEnvelope: null,
    controlLog: null,
    ir: null,
    artifactConfiguration: null,
    transformationSet: null,
  },
  cadence: { evaluable: [], deferred: [] },
  toolchain: { node: null, npm: null, typescript: null, platform: null },
  evidence: [],
  notes: {
    visiblePayoff: null,
    critical: [],
    operatorActions: [],
    changes: [],
    changedFiles: [],
    reviewArtifacts: [],
    knownLimitations: [],
  },
};
const retainedClosePath = (root, order) =>
  docRelative(root, "control", `local/retained/${order}/release-close.json`);
const closeAttemptsRoot = (root, order) =>
  docRelative(root, "control", `local/retained/${order}/attempts/`);
const readableCloseAttempt = (attempt, order) =>
  attempt &&
  attempt.schemaVersion === 1 &&
  attempt.workOrderId === order &&
  Array.isArray(attempt.previousAttempts ?? []);
const flatCloseAttempt = ({
  previousAttempts: _previous,
  archivedAttempts: _archives,
  historyFailure: _failure,
  retainedHistoryAttempt: _retained,
  ...attempt
}) => attempt;
const historyRecoveryCommand = (root, order) => {
  const code =
    "const {reanchorCloseHistory}=await import(process.argv[1]); await reanchorCloseHistory(process.argv[2],process.argv[3]);";
  return `node --input-type=module -e ${shellQuote(code)} ${shellQuote(import.meta.url)} ${shellQuote(root)} ${shellQuote(order)}`;
};
const closeHistoryFailure = (root, order, archive, cause) =>
  `Close history cannot be read safely: ${archive} (${cause}); publication stopped and parsed history retained. Restore that immutable archive, or, after proving it unrecoverable, re-anchor the retained record with ${historyRecoveryCommand(root, order)}, then rerun the release-close command`;

// A retry never serializes a readable record inside an unreadableRecord string.
// Failure retries carry the same flat history instead of archiving themselves.
export function readCloseHistory(root, order) {
  const file = retainedClosePath(root, order);
  requireMaterialContainment(root, file);
  if (!existsSync(join(root, file)))
    return { previousAttempts: [], recoveryAttempts: [] };
  const bytes = readFileSync(join(root, file), "utf8");
  let parsed;
  try {
    parsed = JSON.parse(bytes);
  } catch {
    return {
      previousAttempts: [{ unreadableRecord: bytes }],
      recoveryAttempts: [],
    };
  }
  if (!readableCloseAttempt(parsed, order))
    return {
      previousAttempts: Array.isArray(parsed?.previousAttempts)
        ? parsed.previousAttempts
        : [],
      archivedAttempts: [],
      invalidHistoryRecord: parsed,
      historyFailure: closeHistoryFailure(
        root,
        order,
        file,
        "invalid parsed history record",
      ),
      recoveryAttempts: [],
    };
  const previousAttempts = parsed.historyFailure
    ? parsed.previousAttempts
    : [...(parsed.previousAttempts ?? []), flatCloseAttempt(parsed)].slice(-8);
  const result = {
    previousAttempts,
    archivedAttempts: [...(parsed.archivedAttempts ?? [])],
    recoveryAttempts: parsed.retainedHistoryAttempt
      ? [parsed.retainedHistoryAttempt]
      : [],
  };
  const retainFailure = () => {
    result.previousAttempts = parsed.previousAttempts ?? [];
    result.retainedHistoryAttempt =
      parsed.retainedHistoryAttempt ?? flatCloseAttempt(parsed);
    result.recoveryAttempts.push(result.retainedHistoryAttempt);
  };
  const archive = docRelative(
    root,
    "control",
    `local/retained/${order}/attempts/${sha256(bytes)}.json`,
  );
  if (!parsed.historyFailure) {
    result.archivedAttempts = [
      ...new Set([...result.archivedAttempts, archive]),
    ];
    try {
      requireMaterialContainment(root, archive);
      mkdirSync(dirname(join(root, archive)), { recursive: true, mode: 0o700 });
      if (!existsSync(join(root, archive)))
        writeFileSync(join(root, archive), bytes, { flag: "wx", mode: 0o600 });
    } catch (error) {
      result.historyFailure = closeHistoryFailure(
        root,
        order,
        archive,
        error.code ?? "archive write failed",
      );
      retainFailure();
      return result;
    }
  }
  const prefix = closeAttemptsRoot(root, order).replace(/\/$/u, "") + "/";
  for (const name of result.archivedAttempts) {
    const namedArchive =
      typeof name === "string" &&
      name.startsWith(prefix) &&
      /^[a-f0-9]{64}\.json$/u.test(name.slice(prefix.length));
    try {
      if (!namedArchive) throw new Error("outside order history");
      requireMaterialContainment(root, name);
      const content = readFileSync(join(root, name), "utf8");
      if (!name.endsWith(`/${sha256(content)}.json`))
        throw new Error("archive hash differs");
      const attempt = JSON.parse(content);
      if (!readableCloseAttempt(attempt, order))
        throw new Error("archive belongs to another order");
      result.recoveryAttempts.push(
        ...(attempt.previousAttempts ?? []),
        ...(attempt.retainedHistoryAttempt
          ? [attempt.retainedHistoryAttempt]
          : []),
        flatCloseAttempt(attempt),
      );
    } catch (error) {
      result.historyFailure = closeHistoryFailure(
        root,
        order,
        namedArchive ? name : `${file}#archivedAttempts`,
        error.code ?? "invalid immutable archive",
      );
      retainFailure();
      return result;
    }
  }
  if (
    parsed.invalidHistoryRecord !== undefined ||
    (parsed.historyFailure && !result.archivedAttempts.length)
  ) {
    result.invalidHistoryRecord = parsed.invalidHistoryRecord;
    result.historyFailure = parsed.historyFailure;
    retainFailure();
  }
  return result;
}

// Explicit recovery retains the parsed attempts and the unavailable archive
// names, and starts a fresh content-addressed anchor without claiming recovery
// of bytes no longer available. It performs no release or cleanup effect.
export function reanchorCloseHistory(root, order) {
  if (!/^WO-\d{3}$/u.test(order))
    throw new Error("history recovery requires WO-NNN");
  return withHostLock(
    docPath(root, "control", "local/release-close-locks"),
    order,
    () => {
      const file = retainedClosePath(root, order);
      requireMaterialContainment(root, file);
      const record = JSON.parse(readFileSync(join(root, file), "utf8"));
      if (!readableCloseAttempt(record, order) || !record.historyFailure)
        throw new Error(
          "history recovery requires a retained record with a history failure",
        );
      const unavailableArchives = record.archivedAttempts ?? [];
      const anchor = {
        ...record,
        previousAttempts: record.previousAttempts ?? [],
        archivedAttempts: [],
        historyFailure: undefined,
        invalidHistoryRecord: undefined,
        historyReanchored: {
          source: file,
          unavailableArchives,
          ...(record.invalidHistoryRecord !== undefined
            ? { uninterpretedRecord: record.invalidHistoryRecord }
            : {}),
          recordedAt: new Date().toISOString(),
        },
      };
      const bytes = JSON.stringify(anchor, null, 2) + "\n";
      const archive = docRelative(
        root,
        "control",
        `local/retained/${order}/attempts/${sha256(bytes)}.json`,
      );
      requireMaterialContainment(root, archive);
      mkdirSync(dirname(join(root, archive)), { recursive: true, mode: 0o700 });
      if (!existsSync(join(root, archive)))
        writeFileSync(join(root, archive), bytes, { flag: "wx", mode: 0o600 });
      writeFileSync(
        join(root, file),
        JSON.stringify({ ...anchor, archivedAttempts: [archive] }, null, 2) +
          "\n",
        { mode: 0o600 },
      );
      return archive;
    },
  );
}

let closeTranscript = null;
const writeOutput = (text) => {
  if (closeTranscript) closeTranscript.push(String(text));
  else process.stdout.write(text);
};
// A refusal after this order's tag was published, in this attempt or an
// earlier one, is never a plain refusal: the tag outcome is carried, a Release
// an earlier attempt completed is carried and marked, and the outcome says
// what still stands. Returns whether the publication had already settled.
const settlePublication = (record, refusal) => {
  const publication = record.publication;
  const tagged = ["published", "already-published"];
  if (
    publication.target?.policy === "declared" &&
    !publication.target.release
  ) {
    publication.target.outcome = tagged.includes(publication.target.tagOutcome)
      ? "partially-published"
      : "refused";
    publication.target.refusal = refusal;
    return false;
  }
  if ([...tagged, "no-release"].includes(publication.outcome)) return true;
  const earlier = [
    ...(record.recoveryAttempts ?? record.previousAttempts ?? []),
  ]
    .reverse()
    .filter(
      (attempt) =>
        attempt?.publication &&
        (!publication.tag ||
          !attempt.publication.tag ||
          attempt.publication.tag === publication.tag),
    );
  if (!tagged.includes(publication.tagOutcome)) {
    const previous = earlier.find((attempt) =>
      tagged.includes(attempt.publication.tagOutcome),
    );
    if (previous) {
      publication.tag ??= previous.publication.tag;
      publication.tagOutcome = "already-published";
    }
  }
  if (publication.release === null) {
    const previous = earlier.find((attempt) =>
      ["created", "existing"].includes(attempt.publication.release),
    );
    if (previous) {
      publication.release = previous.publication.release;
      publication.releaseCarried = true;
    }
  }
  publication.outcome = tagged.includes(publication.tagOutcome)
    ? publication.release
      ? "already-published"
      : "partially-published"
    : "refused";
  publication.refusal = refusal;
  return false;
};
export function releaseCloseSummary(record) {
  const line = (value) =>
    String(value).replace(/\s+/gu, " ").trim().slice(0, 1000);
  const publication = record.publication;
  const lines = [
    publication.target?.policy === "declared"
      ? `${record.workOrderId}${record.dryRun ? " dry run" : ""}: registered target; no launchpad tag is due.`
      : publication.outcome === "no-release" && publication.tag === null
        ? `${record.workOrderId}${record.dryRun ? " dry run" : ""}: no-release; no tag or GitHub Release is due.`
        : `${record.workOrderId}${record.dryRun ? " dry run" : ""}: ${publication.outcome}; tag ${publication.tag ?? "unknown"}; GitHub Release ${publication.release ?? (record.dryRun ? "would reconcile/create" : "not verified")}${publication.releaseCarried ? " (carried from an earlier attempt)" : ""}.`,
  ];
  // Keep the small concluding outcome sentences useful to existing consumers.
  for (const text of closeTranscript ?? [])
    for (const textLine of text.split("\n"))
      if (
        /^(Published annotated |Prepared and validated |v[0-9].* is already published|WO-\d{3} closes |Dry run:)/u.test(
          textLine,
        )
      )
        lines.push(line(textLine));
  for (const row of record.starterRefresh ?? [])
    lines.push(
      `Starter refresh ${row.sibling}: ${row.outcome}; ${line(row.reason ?? `${row.before} -> ${row.after}`)}${row.outcome === "refreshed" ? `; ${row.before} -> ${row.after}` : ""}${row.rewrittenSeeds?.length ? `; seeds published: ${row.rewrittenSeeds.join(", ")}` : ""}${row.seedChanges?.length ? `; seeds would change: ${row.seedChanges.join(", ")}` : ""}${row.siblingTag ? `; tag ${row.siblingTag.tag}: ${row.siblingTag.outcome}; GitHub Release ${row.siblingRelease ?? "not verified"}${row.siblingReleaseTitle ? ` (${row.siblingReleaseTitle})` : ""}` : ""}.`,
    );
  lines.push(`Cleanup: ${record.cleanup.outcome}.`);
  if (record.prune) lines.push(formatPruneReport(record.prune));
  if (publication.target?.policy === "declared")
    lines.push(
      `Target release ${publication.target.repositoryId}: ${publication.target.outcome}; tag ${publication.target.tag ?? "unknown"}; GitHub Release ${publication.target.release ?? (record.dryRun ? "would create" : "not verified")}${publication.target.title ? `; title ${publication.target.title}` : ""}.`,
    );
  // The Release text's source and what the reviewer owes or confirmed.
  if (publication.target?.body) {
    const { source, digest, review, confirmation } = publication.target.body;
    const items = (count) => `${count} review item${count === 1 ? "" : "s"}`;
    lines.push(
      `Target release body: ${source}; ${
        review?.pending
          ? `${items(review.pending.length)} ${review.pending.length === 1 ? "waits" : "wait"} for --confirm-terms ${digest}: ${line(review.pending.join("; "))}`
          : review?.matches
            ? `${items(review.matches)} confirmed under ${digest}${confirmation ? `; journal row ${confirmation.journal}` : ""}`
            : `no review items; digest ${digest}`
      }.`,
    );
  }
  if (record.targetCleanup) {
    const cleanup = record.targetCleanup;
    const deleted = [
      ...(cleanup.disposable?.target?.map(
        (row) => `${row.path} (${row.files})`,
      ) ?? []),
      ...(cleanup.baseDisposablePolicy !== "judge-only"
        ? (cleanup.disposable?.base?.map(
            (row) => `base ${row.path} (${row.files})`,
          ) ?? [])
        : []),
    ];
    lines.push(
      `Target worktree ${cleanup.path}; branch ${cleanup.branch}: ${cleanup.outcome}; base disposable policy ${cleanup.baseDisposablePolicy ?? "delete"}${cleanup.baseDisposablePolicy === "judge-only" ? " (base output retained)" : ""}${deleted.length ? `; disposable output ${record.dryRun ? "would be deleted" : cleanup.outcome === "removed" ? "deleted" : "planned for deletion"}: ${deleted.join(", ")}` : ""}${cleanup.baseCheckoutWrites === null ? "; advisory: gate base-checkout writes unavailable" : cleanup.baseCheckoutWrites?.length ? `; advisory: gate commands wrote into the base checkout: ${cleanup.baseCheckoutWrites.join(", ")}` : ""}.`,
    );
  }
  for (const row of record.cleanup.worktrees)
    lines.push(`Worktree ${row.path}: ${row.outcome}.`);
  for (const row of record.removals ?? [])
    lines.push(
      `Scratch repository ${row.path} in ${row.worktree}: ${row.outcome}; head ${row.head ?? "unknown"}; remote held ${row.remoteHeld === null ? "unknown" : row.remoteHeld}.`,
    );
  if (record.cleanup.branch)
    lines.push(
      `Branch ${record.cleanup.branch.name}: ${record.cleanup.branch.outcome}.`,
    );
  for (const blocker of record.blockers.filter((row) => !row.resolved)) {
    lines.push(
      `${blocker.action === "starter-refresh" ? "Starter-refresh" : "Cleanup/publication"} blocker (${blocker.action}): ${line(blocker.reason)}`,
    );
    if (blocker.operator) lines.push(`Operator: ${blocker.operator}`);
    lines.push(`Retry: ${blocker.command}`);
    if (blocker.disposableCommand)
      lines.push(
        `Operator disposable disposition: ${blocker.disposableCommand}`,
      );
  }
  if (publication.outcome === "prepared")
    lines.push(`Publish: ${record.retryCommand}`);
  lines.push(`Full report: ${record.reportPath}`);
  return lines.join("\n") + "\n";
}
const execute = (command, args, options = {}) =>
  spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    ...options,
  });
const outputOf = (result) => `${result.stdout ?? ""}${result.stderr ?? ""}`;
const optionalGitFile = (root, revision, path) => {
  const result = execute("git", ["-C", root, "show", `${revision}:${path}`]);
  if (result.status !== 0) return undefined;
  return result.stdout;
};
const releaseDisplayName = (root, revision) => {
  if (!revision) return loadConfig(root).release.displayName;
  const source = optionalGitFile(root, revision, CONFIG_FILENAME);
  return source === undefined
    ? "DotLn"
    : validateConfig(CONFIG_FILENAME, source).release.displayName;
};
const repositoryFile = (root, path, revision) => {
  if (!revision) return readFileSync(join(root, path), "utf8");
  const source = optionalGitFile(root, revision, path);
  if (source === undefined)
    throw new Error(`${path}: file is missing from ${revision}`);
  return source;
};
const controlEventsAt = (root, revision) => {
  if (!revision) return [];
  const control = readControl(root, revision);
  return [...control.eventSegments].flatMap(([segment, events]) =>
    events.map((event, index) => ({ event, segment, ordinal: index + 1 })),
  );
};
const addedControlEvents = (root, parent, commit) =>
  addedSegmentEvents(
    parent ? readControl(root, parent) : controlFromSources(new Map()),
    readControl(root, commit),
    `${parent ?? "the empty history"} and ${commit}`,
  );
const ensureTrackedClean = (root) => {
  const dirty = runGit(root, ["status", "--porcelain", "--untracked-files=no"]);
  if (dirty)
    throw new Error(
      `tracked working tree is not clean: ${dirty.split("\n")[0]}`,
    );
};
const reportLocalMaterial = (root, listMaterial = false) => {
  for (const [label, flags] of [
    ["untracked", ["--others", "--exclude-standard"]],
    ["ignored", ["--others", "--ignored", "--exclude-standard"]],
  ]) {
    const paths = runGitPathList(root, ["ls-files", "-z", ...flags]);
    // Installed output is routine; retained local material remains visible.
    const local = paths.filter(
      (path) =>
        !/^(?:node_modules|packages\/[^/]+\/dist|\.runtime)\//.test(path),
    );
    if (local.length) {
      const summary = materialSummary(
        local.map((path) => ({ path, class: ignoredLane(path, root) })),
      );
      writeOutput(
        `Advisory: retained ${label} material: ${JSON.stringify(summary)}${
          listMaterial
            ? `\n${local
                .sort()
                .map((path) => `  ${path}`)
                .join("\n")}`
            : "; use --list-material for paths"
        }\n`,
      );
    }
  }
};
// Release close fetches, lists tags, pushes the tag and creates the Release
// over the network. Prove reachability before any local prerequisite so a
// session without egress learns it first, not last (WO-044).
const ensureOriginReachable = (root) => {
  const repository = resolveGitHubPushTarget(root);
  const probe = execute(
    "git",
    ["ls-remote", "--exit-code", "--heads", "origin", "main"],
    { cwd: root, timeout: 60_000 },
  );
  if (probe.status !== 0)
    throw new Error(
      `release close needs network egress to ${repository.host} (git fetch, git ls-remote, the tag push and the GitHub Release); origin is unreachable from this session: ${failureOf(probe, "git ls-remote failed")}. Run the authorized close from a session with egress; host approval governs any outside-sandbox execution.`,
    );
  return repository;
};
const remoteTags = (root) => {
  const rows = runGit(root, ["ls-remote", "--tags", "origin"]);
  const tags = new Map();
  for (const row of rows.split("\n").filter(Boolean)) {
    const [object, ref] = row.split(/\s+/);
    const peeled = /\^\{\}$/.test(ref);
    const name = ref.replace(/^refs\/tags\//, "").replace(/\^\{\}$/, "");
    const prior = tags.get(name) ?? { name };
    tags.set(
      name,
      peeled
        ? { ...prior, target: object, annotated: true }
        : { ...prior, object, target: prior.target ?? object },
    );
  }
  return tags;
};
const latestVersion = (...maps) => {
  const versions = [
    ...new Set(
      maps.flatMap((map) => [...map.keys()]).filter((name) => semver(name)),
    ),
  ];
  return versions.sort(compareVersions).at(-1);
};
// Worktrees share tag refs. A sibling's release is not this subject's baseline
// until the subject integrates that history; publication still checks origin.
const ancestralLocalTags = (root) => {
  const reachable = new Set(
    runGit(root, [
      "for-each-ref",
      "--merged=HEAD",
      "--format=%(refname:strip=2)",
      "refs/tags",
    ]).split("\n"),
  );
  const tags = [...localTags(root)];
  const annotations = releaseAnnotations(
    root,
    tags.map(([, tag]) => tag),
  );
  return new Map(
    tags.filter(
      ([name, tag]) =>
        reachable.has(name) && !isStarterTag(root, name, tag, annotations),
    ),
  );
};
const nestedTagConflict = (tag, ...maps) =>
  maps
    .flatMap((map) => [...map.keys()])
    .find((name) => name.startsWith(`${tag}/`));
const assertShape = (actual, expected, path = "$") => {
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual))
      throw new Error(`release manifest template has wrong shape at ${path}`);
    return;
  }
  if (expected !== null && typeof expected === "object") {
    if (actual === null || typeof actual !== "object" || Array.isArray(actual))
      throw new Error(`release manifest template has wrong shape at ${path}`);
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);
    if (
      expectedKeys.length !== actualKeys.length ||
      expectedKeys.some((key, index) => key !== actualKeys[index])
    )
      throw new Error(`release manifest template has wrong fields at ${path}`);
    for (const key of expectedKeys)
      assertShape(actual[key], expected[key], `${path}.${key}`);
  }
};
const controlState = (projection, source) => {
  if (
    !projection ||
    typeof projection !== "object" ||
    Array.isArray(projection) ||
    typeof projection.phase !== "string" ||
    !(
      projection.workOrder === null || typeof projection.workOrder === "string"
    ) ||
    !(
      projection.workOrderPath === null ||
      typeof projection.workOrderPath === "string"
    )
  )
    throw new Error(`cannot read control state: invalid ${source}`);
  return {
    workOrderId: projection.workOrder ?? undefined,
    workOrderPath: projection.workOrderPath ?? undefined,
    phase: projection.phase,
    ...(projection.repositoryId
      ? {
          repositoryId: projection.repositoryId,
          baseCommit: projection.baseCommit,
        }
      : {}),
  };
};
const parseControlState = (root, workOrderId) => {
  const result = execute(
    process.execPath,
    [
      join(root, "scripts/resume.mjs"),
      "status",
      "--json",
      ...(workOrderId ? ["--work-order", workOrderId] : []),
    ],
    { cwd: root },
  );
  if (result.status !== 0)
    throw new Error(
      `cannot read control state: ${failureOf(result, "resume status failed")}`,
    );
  return controlState(
    parseJson(result.stdout, "resume status --json output"),
    "resume status --json output",
  );
};
const parseControlStateAt = (root, revision, workOrderId) => {
  const control = readControl(root, revision);
  const selected = selectWorkOrder(control, {
    workOrder: workOrderId,
    branch: branchWorkOrder(root),
    latestClosed: latestClosedOrder(control, root, revision),
  });
  return controlState(
    statusProjection(control, selected),
    `${revision}:control segments`,
  );
};
const paragraph = (markdown, label) => {
  const match = new RegExp(
    `\\*\\*${label}:\\*\\*\\s+([^\\n]+(?:\\n(?!\\n|\\*\\*|#)[^\\n]+)*)`,
  ).exec(markdown);
  return match?.[1].replace(/\s+/g, " ").trim();
};
const readWorkOrderAuthority = (
  root,
  state,
  revision,
  { versioned = true } = {},
) => {
  if (!/^WO-\d{3}$/.test(state.workOrderId ?? ""))
    throw new Error(
      `invalid current work-order id: ${state.workOrderId ?? "none"}`,
    );
  workOrderAuthorityPath(root, state.workOrderId, state.workOrderPath, {
    requireFile: !revision,
  });
  const markdown = repositoryFile(root, state.workOrderPath, revision);
  const heading = markdown.split("\n", 1)[0];
  const versions = strictVersionsIn(heading);
  if (versioned && (versions.length !== 1 || !semver(versions[0])))
    throw new Error(
      `work-order heading must contain exactly one strict vX.Y.Z version: ${heading}`,
    );
  return {
    id: state.workOrderId,
    path: state.workOrderPath,
    version: versioned ? versions[0] : undefined,
    title: heading.replace(/^#\s*/, ""),
    objective:
      paragraph(markdown, "Objective") ??
      "No objective paragraph was found in the work-order authority.",
    nonGoals:
      paragraph(markdown, "Non-goals") ??
      "No non-goals paragraph was found in the work-order authority.",
  };
};
const workOrderAuthority = (root, state, revision) => {
  if (state.phase !== "closed")
    throw new Error(
      `release close requires a closed work order; observed ${state.workOrderId ?? "none"} in phase ${state.phase ?? "unknown"}`,
    );
  return readWorkOrderAuthority(root, state, revision);
};
const packageVersions = (root, revision) => {
  const components = Object.fromEntries(
    componentPackages(root, revision).map(({ name, version }) => [
      name,
      version,
    ]),
  );
  const rootPackage = parseJson(
    repositoryFile(root, "package.json", revision),
    revision ? `${revision}:package.json` : join(root, "package.json"),
  );
  return {
    root: typeof rootPackage.version === "string" ? rootPackage.version : null,
    components,
  };
};
const componentPackages = (root, revision) => {
  const packageRoot = join(root, "packages");
  const manifestPaths = revision
    ? runGitPathList(root, [
        "ls-tree",
        "-r",
        "--name-only",
        "-z",
        revision,
        "--",
        "packages",
      ]).filter((path) => /^packages\/[^/]+\/package\.json$/.test(path))
    : readdirSync(packageRoot, { withFileTypes: true })
        .filter((item) => item.isDirectory())
        .map((item) => `packages/${item.name}/package.json`)
        .filter((path) => existsSync(join(root, path)));
  return manifestPaths
    .map((manifestPath) => {
      const directory = manifestPath.split("/")[1];
      const manifest = parseJson(
        repositoryFile(root, manifestPath, revision),
        revision ? `${revision}:${manifestPath}` : join(root, manifestPath),
      );
      if (
        typeof manifest.name !== "string" ||
        typeof manifest.version !== "string"
      )
        throw new Error(
          `component package lacks name/version: ${join(root, manifestPath)}`,
        );
      return {
        directory,
        name: manifest.name,
        version: manifest.version,
        dependencies: manifest.dependencies ?? {},
      };
    })
    .filter(Boolean)
    .sort((left, right) =>
      left.name < right.name ? -1 : left.name > right.name ? 1 : 0,
    );
};

const isKitRoot = (root, revision) =>
  !hasPackageSources(root) &&
  (revision
    ? optionalGitFile(root, revision, "KIT-MANIFEST.json") !== undefined
    : existsSync(join(root, "KIT-MANIFEST.json")));

const releaseBlockRule = (
  root,
  authority,
  latest,
  revision,
  localOnly = false,
) => {
  const targetOrder = authority.version === undefined;
  const displayName = releaseDisplayName(root, revision);
  const expected = targetOrder
    ? latest
    : !latest || compareVersions(authority.version, latest) > 0
      ? authority.version
      : latest;
  const expectation = targetOrder
    ? `one strict version${latest ? ` at or above ${latest}` : ""}`
    : expected;
  const context = `(${targetOrder ? "target order records no release" : `work-order target ${authority.version}`}; latest ${localOnly ? "local tag" : "published"} ${latest ?? "none"})`;
  const source = repositoryFile(root, "README.md", revision);
  const lines = source.split("\n").map((line) => line.replace(/\r$/, ""));
  const beginMarker = "<!-- DOTLN-RELEASE-BEGIN -->";
  const endMarker = "<!-- DOTLN-RELEASE-END -->";
  const malformedMarker = lines.findIndex(
    (line) =>
      /DOTLN-RELEASE-(?:BEGIN|END)/.test(line) &&
      line !== beginMarker &&
      line !== endMarker,
  );
  if (malformedMarker >= 0) {
    return {
      pass: false,
      line: `FAIL release-block: observed malformed release marker at README.md:${malformedMarker + 1}; expected exact marker lines and exactly one ordered block containing exactly the generated version line for ${expectation} ${context}`,
    };
  }
  const begins = lines
    .map((line, index) => (line === beginMarker ? index : -1))
    .filter((index) => index >= 0);
  const ends = lines
    .map((line, index) => (line === endMarker ? index : -1))
    .filter((index) => index >= 0);
  if (begins.length !== 1 || ends.length !== 1 || begins[0] >= ends[0]) {
    const remedy =
      begins.length === 0 && ends.length === 0 && isKitRoot(root, revision)
        ? `; on the next order's dispatch follow the refreshed starter README's update-pull-request procedure first, then record the repair in the order's decisions. Only if that update leaves the block absent, add exactly these three lines once: ${JSON.stringify(beginMarker)}, ${JSON.stringify(releaseClaimLine(expected ?? "v0.1.0", displayName))}, ${JSON.stringify(endMarker)}`
        : "";
    return {
      pass: false,
      line: `FAIL release-block: observed ${begins.length} begin marker(s), ${ends.length} end marker(s), order ${begins[0] < ends[0] ? "begin-before-end" : "invalid"}; expected exactly one ordered block containing exactly the generated version line for ${expectation} ${context}${remedy}`,
    };
  }
  // Between the markers stands the one line release preparation writes and
  // nothing else, so no order can append a sentence to the block.
  const content = lines
    .slice(begins[0] + 1, ends[0])
    .filter((line) => line.trim());
  const versions = strictVersionsIn(content[0] ?? "");
  const claim = releaseClaimLine(
    targetOrder ? (versions[0] ?? latest ?? "v0.1.0") : expected,
    displayName,
  );
  if (content.length !== 1) {
    return {
      pass: false,
      line: `FAIL release-block: observed ${content.length === 0 ? "no line" : `${content.length} non-empty lines`} between the markers; expected exactly the generated line ${JSON.stringify(claim)}; move other text outside the markers and rerun npm run release -- prepare ${context}`,
    };
  }
  if (
    versions.length !== 1 ||
    (targetOrder
      ? latest && compareVersions(versions[0], latest) < 0
      : versions[0] !== expected)
  ) {
    return {
      pass: false,
      line: `FAIL release-block: observed ${versions.length === 0 ? "no strict version" : versions.join(", ")}; expected ${targetOrder ? expectation : `exactly one ${expected}`} ${context}`,
    };
  }
  if (content[0] !== claim) {
    return {
      pass: false,
      line: `FAIL release-block: observed line ${JSON.stringify(content[0])}; expected exactly the generated line ${JSON.stringify(claim)}; move other text outside the markers and rerun npm run release -- prepare ${context}`,
    };
  }
  return {
    pass: true,
    line: `PASS release-block: observed ${versions[0]}; expected ${expectation} ${context}`,
  };
};

const componentVersionRules = (root, latest, local, remote, revision) => {
  const components = componentPackages(root, revision);
  if (!latest) {
    return components.map((component) => ({
      pass: true,
      line: `PASS component-version ${component.name}: observed ${component.version} with no previous release; expected no source-change bump baseline`,
    }));
  }

  let previous;
  try {
    previous = publishedTag(latest, local, remote);
  } catch (error) {
    return components.map((component) => ({
      pass: false,
      line: `FAIL component-version ${component.name}: cannot compare with ${latest}: ${error.message}`,
    }));
  }
  let previousManifest;
  let manifestError;
  try {
    const localTag = local.get(latest);
    if (!localTag || localTag.objectType !== "tag")
      throw new Error(`local annotated tag ${latest} is unavailable`);
    previousManifest = manifestFromTag(root, latest);
  } catch (error) {
    manifestError = error instanceof Error ? error.message : String(error);
  }

  return components.map((component) => {
    const diffArgs = [
      "diff",
      "--no-renames",
      "--name-only",
      "-z",
      previous.target,
    ];
    if (revision) diffArgs.push(revision);
    diffArgs.push("--", `packages/${component.directory}/src`);
    const changed = runGitPathList(root, diffArgs).length > 0;
    const priorVersion =
      previousManifest?.versions?.components?.[component.name];
    if (!changed) {
      return {
        pass: true,
        line: `PASS component-version ${component.name}: src unchanged; observed ${component.version}; previous ${latest} ${typeof priorVersion === "string" ? priorVersion : "not required"}; expected no bump required`,
      };
    }
    if (typeof priorVersion !== "string") {
      if (manifestError) {
        return {
          pass: false,
          line: `FAIL component-version ${component.name}: src changed; observed ${component.version}; expected a previous component version from ${latest} (${manifestError})`,
        };
      }
      const priorManifestPath = `packages/${component.directory}/package.json`;
      const priorPackageSource = optionalGitFile(
        root,
        previous.target,
        priorManifestPath,
      );
      if (priorPackageSource !== undefined) {
        const priorPackage = parseJson(
          priorPackageSource,
          `${latest}:${priorManifestPath}`,
        );
        if (priorPackage.name === component.name) {
          return {
            pass: false,
            line: `FAIL component-version ${component.name}: src changed; observed ${component.version}; expected a previous component version from ${latest} (missing manifest component entry)`,
          };
        }
      }
      return {
        pass: true,
        line: `PASS component-version ${component.name}: src changed; observed ${component.version}; previous ${latest} no component with this identity; expected first-version baseline`,
      };
    }
    const pass = !changed || component.version !== priorVersion;
    return {
      pass,
      line: `${pass ? "PASS" : "FAIL"} component-version ${component.name}: src ${changed ? "changed" : "unchanged"}; observed ${component.version}; previous ${latest} ${priorVersion}; expected ${changed ? "a different version" : "no bump required"}`,
    };
  });
};

const githubBodyRule = (root, state, revision) => {
  const candidates = [
    docRelative(root, "finalReviews", `${state.workOrderId}/PR.md`),
    releaseNotesPathFor(state.workOrderId, root),
  ];
  const bodies = candidates.flatMap((path) => {
    if (!revision) {
      return existsSync(join(root, path))
        ? [{ path, source: readFileSync(join(root, path), "utf8") }]
        : [];
    }
    const source = optionalGitFile(root, revision, path);
    return source === undefined ? [] : [{ path, source }];
  });
  try {
    for (const { path, source } of bodies) {
      if (path === releaseNotesPathFor(state.workOrderId, root))
        parseReleaseNotes(source, path);
      // The current order's stored pull-request body has a shape: a
      // level-one heading first, prose, the meter block last. This rule reads
      // the current order's file only, so no historical body is judged.
      else assertPullRequestBodyShape(source, path);
      assertGitHubBodyProfile(source, path);
    }
    return {
      pass: true,
      line: `PASS github-body-profile: observed ${bodies.length === 0 ? "no current final-review bodies yet" : bodies.map(({ path }) => path).join(", ")}; expected one physical line per prose paragraph or list-item paragraph, and a stored pull-request body with its heading first, prose and the meter block last`,
    };
  } catch (error) {
    return {
      pass: false,
      line: `FAIL github-body-profile: observed ${error instanceof Error ? error.message : String(error)}; expected one physical line per prose paragraph or list-item paragraph, and a stored pull-request body with its heading first, prose and the meter block last`,
    };
  }
};

const workspacePinRules = (root, revision) => {
  const components = componentPackages(root, revision);
  const versions = new Map(
    components.map(({ name, version }) => [name, version]),
  );
  return components.flatMap((component) =>
    Object.entries(component.dependencies)
      .filter(([name]) => name.startsWith("@dotln/"))
      .map(([name, pin]) => {
        const version = versions.get(name);
        const pass = version !== undefined && pin === version;
        return {
          pass,
          line: `${pass ? "PASS" : "FAIL"} workspace-pin ${component.name} -> ${name}: observed ${pin}; expected exact workspace version ${version ?? "missing"}`,
        };
      }),
  );
};

const checkSurfaces = (root, options = {}) => {
  const revision = options.revision;
  const state =
    options.state ??
    (revision
      ? parseControlStateAt(root, revision, options.expectedWorkOrderId)
      : parseControlState(root, options.expectedWorkOrderId));
  const expectedWorkOrderId = options.expectedWorkOrderId;
  if (
    revision &&
    (state.phase !== "closed" ||
      (expectedWorkOrderId && state.workOrderId !== expectedWorkOrderId))
  )
    throw new Error(
      `committed surface check requires closed ${expectedWorkOrderId ?? "work-order"} control state; observed ${state.workOrderId ?? "none"} in phase ${state.phase}`,
    );
  const authority =
    options.authority ??
    readWorkOrderAuthority(root, state, revision, {
      versioned: !state.repositoryId,
    });
  const local =
    options.local ??
    (options.localOnly ? ancestralLocalTags(root) : localTags(root));
  const remote =
    options.remote ??
    (options.localOnly
      ? new Map(
          [...local].map(([name, tag]) => [
            name,
            { ...tag, annotated: tag.objectType === "tag" },
          ]),
        )
      : remoteTags(root));
  const latest = latestVersion(remote);
  const rules = [
    releaseBlockRule(root, authority, latest, revision, options.localOnly),
    ...componentVersionRules(root, latest, local, remote, revision),
    ...workspacePinRules(root, revision),
    githubBodyRule(root, state, revision),
    ...licenseSurfaceRules(root, revision),
  ];
  if (!revision) {
    const untracked = runGitPathList(root, [
      "ls-files",
      "--others",
      "--exclude-standard",
      "-z",
      "--",
      "packages",
    ]).filter((path) => /^packages\/[^/]+\/src\//.test(path));
    if (untracked.length)
      rules.push({
        pass: true,
        line: `advisory: untracked source not compared (${untracked.length} component source path(s))`,
      });
  }
  return {
    passed: rules.every(({ pass }) => pass),
    report: `${rules.map(({ line }) => line).join("\n")}\n`,
  };
};
const exactSchemaVersion = (source, pattern, name) => {
  const match = pattern.exec(source);
  if (!match)
    throw new Error(`cannot derive ${name} schema version from source`);
  return Number(match[1]);
};
const builtKernelCadence = (root) => {
  const moduleUrl = pathToFileURL(
    join(previewRuntimeRoot ?? root, "packages/kernel/dist/src/index.js"),
  ).href;
  const probe = `
    const kernel = await import(${JSON.stringify(moduleUrl)});
    const constructors = Object.entries(kernel.Cadence ?? {}).map(
      ([name, factory]) => ({
        name,
        kind: typeof factory === "function" ? factory()?.kind : null,
      }),
    );
    process.stdout.write(JSON.stringify({
      cadencePresent: kernel.Cadence !== undefined,
      constructors,
      all: kernel.CADENCE_KINDS ?? null,
      evaluable: kernel.EVALUABLE_CADENCE_KINDS ?? null,
    }));
  `;
  const result = execute(
    process.execPath,
    ["--input-type=module", "--eval", probe],
    { cwd: root },
  );
  if (result.status !== 0)
    throw new Error(
      `cannot load built kernel cadence exports: ${failureOf(result, "kernel import failed")}`,
    );
  const projection = parseJson(
    result.stdout,
    "built @dotln/kernel cadence exports",
  );
  if (
    projection?.cadencePresent !== true ||
    !Array.isArray(projection.constructors) ||
    !Array.isArray(projection.all) ||
    !Array.isArray(projection.evaluable)
  )
    throw new Error("built kernel cadence constants are missing");
  const allKinds = [...projection.all];
  const evaluable = [...projection.evaluable];
  const constructorKinds = projection.constructors.map(
    (constructor) => constructor?.name,
  );
  const allKindSet = new Set(allKinds);
  const evaluableSet = new Set(evaluable);
  const constructorKindSet = new Set(constructorKinds);
  if (
    allKinds.length === 0 ||
    allKindSet.size !== allKinds.length ||
    allKinds.some(
      (kind) => typeof kind !== "string" || !/^[A-Za-z_$][\w$]*$/.test(kind),
    ) ||
    constructorKindSet.size !== projection.constructors.length ||
    constructorKindSet.size !== allKindSet.size ||
    allKinds.some((kind) => !constructorKindSet.has(kind)) ||
    projection.constructors.some(
      (constructor) =>
        !constructor ||
        typeof constructor !== "object" ||
        typeof constructor.name !== "string" ||
        !/^[A-Za-z_$][\w$]*$/.test(constructor.name) ||
        constructor.kind !== constructor.name ||
        !allKindSet.has(constructor.name),
    ) ||
    evaluable.length === 0 ||
    evaluableSet.size !== evaluable.length ||
    evaluable.some((kind) => typeof kind !== "string" || !allKindSet.has(kind))
  )
    throw new Error(
      "built kernel cadence constants are inconsistent with the Cadence type union",
    );
  return {
    evaluable,
    deferred: allKinds.filter((kind) => !evaluableSet.has(kind)),
  };
};
const compatibility = (root) => {
  const types = repositoryFile(
    root,
    isKitRoot(root, sourceRevision)
      ? "packages/kernel/dist/src/types.d.ts"
      : "packages/kernel/src/types.ts",
    sourceRevision,
  );
  const eventEnvelope = exactSchemaVersion(
    types,
    /export interface EventEnvelope[^\{]*\{\s*readonly schemaVersion:\s*(\d+)/s,
    "event-envelope",
  );
  const cadence = builtKernelCadence(root);
  return {
    schemas: {
      eventEnvelope: { min: eventEnvelope, max: eventEnvelope },
      controlLog: {
        min: CONTROL_LOG_SCHEMA_VERSION,
        max: CONTROL_LOG_SCHEMA_VERSION,
      },
      ir: null,
      artifactConfiguration: null,
      transformationSet: null,
    },
    cadence,
  };
};
const versionOutput = (command, args, cwd, label) => {
  const result = execute(command, args, { cwd });
  if (result.status !== 0)
    throw new Error(
      `cannot derive ${label}: ${failureOf(result, `${command} failed`)}`,
    );
  return result.stdout.trim();
};
const toolchain = (root) => {
  const lock = JSON.parse(
    repositoryFile(root, "package-lock.json", sourceRevision),
  );
  return {
    node: process.version,
    npm: versionOutput("npm", ["--version"], root, "npm version"),
    typescript:
      lock.packages?.["node_modules/typescript"]?.version ??
      lock.packages?.[""]?.devDependencies?.typescript ??
      "unknown",
    platform: `${process.platform} ${osRelease()}`,
  };
};
const gitIdentity = (root) => ({
  commit: runGit(root, ["rev-parse", sourceRevision]),
  subject: runGit(root, ["log", "-1", "--format=%s", sourceRevision]),
  committedAt: runGit(root, ["log", "-1", "--format=%cI", sourceRevision]),
});
const changedSubjects = (root, previousRelease) => {
  const range = previousRelease
    ? `${previousRelease}..${sourceRevision}`
    : sourceRevision;
  return runGit(root, ["log", "--reverse", "--format=%s", range])
    .split("\n")
    .filter(Boolean);
};
const changedFiles = (root, previousRelease) => {
  const args = previousRelease
    ? [
        "diff",
        "--no-renames",
        "--name-only",
        "-z",
        `${previousRelease}..${sourceRevision}`,
      ]
    : ["ls-tree", "-r", "--name-only", "-z", sourceRevision];
  return runGitPathList(root, args).sort();
};
const reviewArtifacts = (root, workOrderId) =>
  [
    docRelative(root, "verifications"),
    docRelative(root, "finalReviews"),
  ].flatMap((parent) =>
    runGitPathList(root, [
      "ls-tree",
      "-r",
      "--name-only",
      "-z",
      sourceRevision,
      "--",
      `${parent}/${workOrderId}`,
    ]).filter((path) => path.endsWith(".md")),
  );
const firstParentCommits = (
  root,
  previousRelease,
  release = sourceRevision,
) => {
  const range = previousRelease ? `${previousRelease}..${release}` : release;
  const output = runGit(root, [
    "rev-list",
    "--first-parent",
    "--reverse",
    range,
  ]);
  return output === "" ? [] : output.split("\n");
};
const firstParentOf = (root, commit) => {
  const result = execute("git", ["-C", root, "rev-parse", `${commit}^1`]);
  return result.status === 0 ? result.stdout.trim() : undefined;
};
const changedReleaseNotesAt = (root, parent, commit) => {
  const paths = parent
    ? runGitPathList(root, [
        "diff",
        "--no-renames",
        "--name-only",
        "-z",
        parent,
        commit,
        "--",
        docRelative(root, "finalReviews"),
      ])
    : runGitPathList(root, [
        "diff-tree",
        "--no-renames",
        "--root",
        "--no-commit-id",
        "--name-only",
        "-z",
        "-r",
        commit,
        "--",
        docRelative(root, "finalReviews"),
      ]);
  const reviews = docRelative(root, "finalReviews");
  return paths
    .map((path) =>
      new RegExp(
        `^${reviews.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/(WO-\\d{3})/RELEASE-NOTES\\.md$`,
      ).exec(path),
    )
    .filter(Boolean)
    .map((match) => ({ id: match[1], path: match[0] }))
    .sort((left, right) =>
      left.path < right.path ? -1 : left.path > right.path ? 1 : 0,
    );
};
const passedFinalReview = (event) =>
  event?.type === "FinalReviewCompleted" &&
  event.verdict === "pass" &&
  /^WO-\d{3}$/.test(event.workOrderId ?? "");
const notesContractWasActive = (root, revision) =>
  controlEventsAt(root, revision).some(
    ({ event }) => passedFinalReview(event) && event.workOrderId === "WO-024",
  );
const workOrderTitleAtHead = (root, workOrderId) => {
  const activation = controlEventsAt(root, sourceRevision)
    .map(({ event }) => event)
    .filter(
      (event) =>
        event.type === "WorkOrderActivated" &&
        event.workOrderId === workOrderId,
    )
    .at(-1);
  const authorityPath = activation?.workOrderPath ?? "";
  try {
    if (!activation) throw new Error("activation is missing");
    workOrderAuthorityPath(root, workOrderId, authorityPath, {
      requireFile: false,
    });
  } catch {
    throw new Error(
      `cannot resolve work-order authority for release notes: ${workOrderId}`,
    );
  }
  const source = optionalGitFile(root, sourceRevision, authorityPath);
  if (source === undefined)
    throw new Error(
      `cannot read work-order authority from HEAD for release notes: ${workOrderId}`,
    );
  const heading = source.split("\n", 1)[0];
  const match = new RegExp(`^#\\s+${workOrderId}\\s+—\\s+(.+)$`).exec(heading);
  if (!match)
    throw new Error(`invalid work-order heading for release notes: ${heading}`);
  return match[1];
};
const legacyReleaseNotes = (workOrderId, subjects) => ({
  sections: {
    "Release overview":
      "Reviewed release-overview prose is unavailable for this work order.",
    "Read before upgrading": "None.",
    "Substantive changes": `**Fallback: no reviewed notes for ${workOrderId} (predates WO-024); commit subjects:**\n\n${
      subjects.length > 0
        ? subjects.map((subject) => `- ${subject}`).join("\n")
        : "- No first-parent commit subject was found."
    }`,
    "Progressive polish": "None.",
    "Evidence and compatibility":
      "Reviewed evidence prose is unavailable because this work order predates the release-notes artifact contract.",
  },
});
const releaseNoteEntries = (root, previousRelease) => {
  const commits = firstParentCommits(root, previousRelease);
  const records = commits.map((commit) => {
    const parent = firstParentOf(root, commit);
    const events = addedControlEvents(root, parent, commit);
    return {
      commit,
      events,
      completed: events
        .filter(passedFinalReview)
        .map((event) => event.workOrderId),
      changedNotes: changedReleaseNotesAt(root, parent, commit),
      subject: runGit(root, ["show", "-s", "--format=%s", commit]),
    };
  });
  const entries = [];
  const byId = new Map();
  let contractActive = notesContractWasActive(root, previousRelease);

  records.forEach((record, recordIndex) => {
    const { changedNotes, completed } = record;
    const orderedIds = [
      ...completed,
      ...changedNotes
        .map(({ id }) => id)
        .filter((id) => !completed.includes(id)),
    ];

    for (const id of orderedIds) {
      const activatesContract = id === "WO-024" && completed.includes(id);
      if (activatesContract) contractActive = true;
      let entry = byId.get(id);
      if (!entry) {
        entry = {
          id,
          title: workOrderTitleAtHead(root, id),
          legacy: !contractActive,
          notesChanged: false,
          lastRelevantIndex: recordIndex,
        };
        byId.set(id, entry);
        entries.push(entry);
      }
      if (activatesContract) entry.legacy = false;
      if (completed.includes(id)) entry.completionIndex = recordIndex;
      if (changedNotes.some((notes) => notes.id === id))
        entry.notesChanged = true;
      entry.lastRelevantIndex = recordIndex;
    }
  });

  return entries.map((entry) => {
    const path = releaseNotesPathFor(entry.id, toolRoot);
    const activationIndex = records.findIndex(
      ({ events }, index) =>
        index <= entry.lastRelevantIndex &&
        events.some(
          (event) =>
            event.type === "WorkOrderActivated" &&
            event.workOrderId === entry.id,
        ),
    );
    const start = activationIndex >= 0 ? activationIndex : 0;
    const end = Math.max(
      entry.completionIndex ?? entry.lastRelevantIndex,
      entry.lastRelevantIndex,
    );
    const subjects = records
      .slice(start, end + 1)
      .map(({ subject }) => subject);
    let parsed;
    if (entry.notesChanged || !entry.legacy) {
      const source = optionalGitFile(root, sourceRevision, path);
      if (source === undefined)
        throw new Error(`${path}: release-notes file is missing from HEAD`);
      parsed = parseReleaseNotes(source, path);
    } else {
      parsed = legacyReleaseNotes(entry.id, subjects);
    }
    return {
      id: entry.id,
      title: entry.title,
      legacy: entry.legacy,
      path: entry.notesChanged ? path : undefined,
      ...parsed,
    };
  });
};
const criticalNotes = (files, evidence) => {
  const notes = [
    "Source-only release: no package, binary, container, or hosted artifact is published.",
  ];
  if (files.some((path) => /^packages\/[^/]+\/package\.json$/.test(path)))
    notes.push(
      "Component version metadata changed; inspect the manifest's separate version axes.",
    );
  if (
    files.some(
      (path) =>
        path === "packages/kernel/src/types.ts" ||
        path === "packages/kernel/dist/src/types.d.ts" ||
        /schema|compatibility/i.test(path),
    )
  )
    notes.push(
      "Schema or compatibility surfaces changed; inspect the manifest ranges and complete changed-file list.",
    );
  if (
    files.some((path) =>
      /^scripts\/(?:resume|worktree|release|(?:lib\/)?(?:release-notes|github-repository))\./.test(
        path,
      ),
    )
  )
    notes.push(
      "Workflow authority, recovery, or publication tooling changed; inspect the operator guide and release evidence.",
    );
  if (files.includes("package-lock.json"))
    notes.push(
      evidence.length === 1 && evidence[0]?.command === "npm test"
        ? "The locked dependency graph changed; the release manifest records the reviewer’s npm test evidence for this code identity."
        : "The locked dependency graph changed; release evidence was run after a fresh npm ci.",
    );
  return notes;
};
const baseManifest = (
  root,
  authority,
  previousRelease,
  evidence,
  recordedToolchain,
) => {
  const templateRelative = docRelative(
    root,
    "releases",
    "tag-manifest.template.json",
  );
  const templatePath = join(root, templateRelative);
  const template = JSON.parse(
    repositoryFile(root, templateRelative, sourceRevision),
  );
  if (template.schemaVersion !== 1)
    throw new Error(`unsupported release manifest template: ${templatePath}`);
  assertShape(template, templateShape);
  const identity = gitIdentity(root);
  const compatible = compatibility(root);
  const files = changedFiles(root, previousRelease);
  const editionEntries = releaseNoteEntries(root, previousRelease);
  const editionWorkOrders =
    editionEntries.length > 0
      ? editionEntries.map(({ id }) => id)
      : [authority.id];
  return {
    ...template,
    release: {
      ...template.release,
      application: authority.version,
      commit: identity.commit,
      subject: identity.subject,
      committedAt: identity.committedAt,
      previousRelease: previousRelease ?? null,
      distribution: "source-only",
    },
    workOrder: {
      ...template.workOrder,
      id: authority.id,
      path: authority.path,
    },
    versions: {
      ...template.versions,
      ...packageVersions(root, sourceRevision),
    },
    ...compatible,
    toolchain: {
      ...template.toolchain,
      ...(recordedToolchain ?? toolchain(root)),
    },
    evidence,
    notes: {
      visiblePayoff: authority.objective,
      critical: criticalNotes(files, evidence),
      operatorActions: [
        "Read the compatibility fields and known limitations before consuming this source release.",
      ],
      changes: changedSubjects(root, previousRelease),
      changedFiles: files,
      reviewArtifacts: editionWorkOrders.flatMap((workOrderId) =>
        reviewArtifacts(root, workOrderId),
      ),
      knownLimitations: [authority.nonGoals],
    },
  };
};
/** Exercise the closed-order builder without publication, evidence or writes. */
export function previewReleaseManifest(root, workOrderId) {
  const previous = sourceRevision;
  try {
    sourceRevision = runGit(root, ["rev-parse", "HEAD"]);
    const state = parseControlStateAt(root, sourceRevision, workOrderId);
    const authority = workOrderAuthority(root, state, sourceRevision);
    return baseManifest(root, authority, latestVersion(localTags(root)), []);
  } finally {
    sourceRevision = previous;
  }
}

const firstDifference = (expected, actual, path = "$") => {
  if (Object.is(expected, actual)) return undefined;
  if (
    typeof expected !== "object" ||
    expected === null ||
    typeof actual !== "object" ||
    actual === null
  )
    return path;
  if (Array.isArray(expected) !== Array.isArray(actual)) return path;
  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(actual);
  if (
    expectedKeys.length !== actualKeys.length ||
    expectedKeys.some((key, index) => key !== actualKeys[index])
  )
    return `${path}<keys>`;
  for (const key of expectedKeys) {
    const difference = firstDifference(
      expected[key],
      actual[key],
      `${path}${Array.isArray(expected) ? `[${key}]` : `.${key}`}`,
    );
    if (difference) return difference;
  }
  return undefined;
};
const validateEvidence = (evidence) => {
  if (
    Array.isArray(evidence) &&
    evidence.length === 1 &&
    evidence[0]?.command === "npm test"
  ) {
    const row = evidence[0];
    if (
      row.exitCode !== 0 ||
      row.executed !== true ||
      !/^[a-f0-9]{64}$/.test(row.codeIdentity ?? "") ||
      !/^[a-f0-9]{64}$/.test(row.outputSha256 ?? "") ||
      ![row.reviewedTree, row.mergeTree].every((tree) =>
        /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(tree ?? ""),
      ) ||
      !Number.isFinite(row.durationMs) ||
      row.durationMs < 0 ||
      !Number.isFinite(Date.parse(row.recordedAt)) ||
      !row.evidenceRef
    )
      throw new Error("invalid reviewer product-gate evidence");
    return;
  }
  const commands =
    Array.isArray(evidence) &&
    evidence[0]?.command === currentEvidenceCommands[0]
      ? currentEvidenceCommands
      : evidenceCommands;
  if (!Array.isArray(evidence) || evidence.length !== commands.length)
    throw new Error(
      "manifest evidence rows do not match the declared release gate",
    );
  evidence.forEach((row, index) => {
    if (
      row.command !== commands[index] ||
      row.exitCode !== 0 ||
      !/^[a-f0-9]{64}$/.test(row.outputSha256 ?? "")
    )
      throw new Error(`invalid evidence row ${index + 1}: ${commands[index]}`);
    if (
      commands === currentEvidenceCommands &&
      (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/.test(row.treeHash ?? "") ||
        !Number.isFinite(row.durationMs) ||
        row.durationMs < 0)
    )
      throw new Error(
        "release evidence requires exact tree identity and duration",
      );
  });
};
const validateManifest = (root, manifest) => {
  validateEvidence(manifest.evidence);
  if (
    manifest.evidence.length === 1 &&
    manifest.evidence[0].command === "npm test"
  ) {
    const expectedEvidence = releaseEvidence(root, manifest.workOrder?.id);
    if (firstDifference(expectedEvidence, manifest.evidence))
      throw new Error(
        "release evidence differs from the recorded reviewer product gate or merge tree",
      );
  }
  const state = parseControlStateAt(
    root,
    sourceRevision,
    manifest.workOrder?.id,
  );
  const authority = workOrderAuthority(root, state, sourceRevision);
  const expected = baseManifest(
    root,
    authority,
    manifest.release?.previousRelease ?? undefined,
    manifest.evidence,
  );
  const difference = firstDifference(expected, manifest);
  if (difference)
    throw new Error(
      `release manifest differs from repository truth at ${difference}`,
    );
  return manifest;
};
const validatePublishedManifest = (root, manifest) => {
  validateEvidence(manifest.evidence);
  if (
    manifest.evidence.length === 1 &&
    manifest.evidence[0].command === "npm test" &&
    firstDifference(
      releaseEvidence(root, manifest.workOrder?.id),
      manifest.evidence,
    )
  )
    throw new Error(
      "published evidence differs from its recorded reviewer product gate",
    );
  const recorded = manifest.toolchain;
  const lock = JSON.parse(
    repositoryFile(root, "package-lock.json", sourceRevision),
  );
  const lockedTypescript =
    lock.packages?.["node_modules/typescript"]?.version ??
    lock.packages?.[""]?.devDependencies?.typescript;
  if (
    !recorded ||
    !/^v\d+/.test(recorded.node ?? "") ||
    !/^\d+\.\d+\.\d+/.test(recorded.npm ?? "") ||
    recorded.typescript !== lockedTypescript ||
    typeof recorded.platform !== "string" ||
    recorded.platform.length === 0
  )
    throw new Error(
      "published manifest contains an invalid recorded toolchain",
    );
  const state = parseControlStateAt(
    root,
    sourceRevision,
    manifest.workOrder?.id,
  );
  const authority = workOrderAuthority(root, state, sourceRevision);
  const expected = baseManifest(
    root,
    authority,
    manifest.release?.previousRelease ?? undefined,
    manifest.evidence,
    recorded,
  );
  const difference = firstDifference(expected, manifest);
  if (difference)
    throw new Error(
      `published manifest differs from tagged source truth at ${difference}`,
    );
  return manifest;
};
const releaseEvidence = (root, workOrderId, options) => {
  const gate = reviewedProductGate(root, workOrderId, sourceRevision, options);
  return [
    {
      command: "npm test",
      exitCode: 0,
      executed: true,
      outputSha256: gate.outputSha256 ?? sha256(JSON.stringify(gate)),
      codeIdentity: gate.codeIdentity,
      reviewedTree: gate.treeHash,
      mergeTree: runGit(root, ["rev-parse", `${sourceRevision}^{tree}`]),
      durationMs: gate.durationMs,
      recordedAt: gate.recordedAt,
      evidenceRef: gate.evidenceRef,
    },
  ];
};
const releaseRuntimeCause = (root) =>
  harnessRuntimeCause(root) ||
  (!buildFreshness(root).current && "source or compiled output changed") ||
  (!["skeleton", "kernel"].every((name) =>
    existsSync(
      join(
        root,
        `packages/${name}/dist/src/${name === "kernel" ? "index.js" : "cli.js"}`,
      ),
    ),
  ) &&
    "release runtime missing");
const ensureReleaseRuntime = (root) => {
  if (!releaseRuntimeCause(root)) return;
  if (existsSync(join(root, "KIT-MANIFEST.json")) && !hasPackageSources(root)) {
    writeOutput("Preparing the carried release runtime (no source build).\n");
    const prepared = execute(
      process.execPath,
      [join(root, "scripts/lib/release-kit-runtime.mjs"), root],
      { cwd: root },
    );
    if (prepared.status !== 0)
      throw new Error(
        `release kit runtime preparation failed: ${failureOf(prepared, "carried runtime unavailable")}`,
      );
    return;
  }
  writeOutput(
    "Building release metadata runtime (no installation or test suite).\n",
  );
  const built = execute(process.execPath, [join(root, "scripts/build.mjs")], {
    cwd: root,
  });
  if (built.status !== 0)
    throw new Error(
      `release metadata build failed: ${failureOf(built, "build unavailable; install dependencies separately")}`,
    );
  const remaining = releaseRuntimeCause(root);
  if (remaining)
    throw new Error(
      `Built runtime still ${remaining}; checkout preserved; run node scripts/bootstrap.mjs`,
    );
};
const assertReleaseRuntime = (root) => {
  const cause = releaseRuntimeCause(root);
  if (cause)
    throw new Error(
      `Release runtime ${cause}; close entry must prepareRuntimeBeforeLoad before loading built modules`,
    );
};
const prepareRuntimeBeforeLoad = (root) => {
  ensureReleaseRuntime(root);
  assertReleaseRuntime(root);
};
const withPreviewRuntime = (root, operation) => {
  // This is an unregistered preview directory, never a release worktree. Its
  // temporary index and build output are removed without moving main or any branch.
  const temporary = createFixtureRoot(join(tmpdir(), "dotln-release-preview-"));
  try {
    const env = {
      ...process.env,
      GIT_INDEX_FILE: join(temporary, ".preview-index"),
    };
    runGit(root, ["read-tree", sourceRevision], { env });
    runGit(root, ["checkout-index", "--all", `--prefix=${temporary}/`], {
      env,
    });
    rmSync(join(temporary, ".preview-index"));
    const kitPreview =
      existsSync(join(temporary, "KIT-MANIFEST.json")) &&
      !hasPackageSources(temporary);
    if (kitPreview) {
      // Resolve workspace imports from the preview's carried packages even
      // when main still has an older installed runtime.
      mkdirSync(join(temporary, "node_modules/@dotln"), { recursive: true });
      for (const name of readdirSync(join(temporary, "packages")))
        if (existsSync(join(temporary, "packages", name, "package.json")))
          symlinkSync(
            `../../packages/${name}`,
            join(temporary, "node_modules/@dotln", name),
          );
      if (existsSync(join(root, "node_modules")))
        for (const name of readdirSync(join(root, "node_modules")))
          if (name !== "@dotln")
            symlinkSync(
              join(root, "node_modules", name),
              join(temporary, "node_modules", name),
            );
    } else if (existsSync(join(root, "node_modules")))
      symlinkSync(join(root, "node_modules"), join(temporary, "node_modules"));
    // Installed dist can satisfy a byte-identical source preview without build.
    const kernelDelta = runGit(root, [
      "diff",
      "--name-only",
      "HEAD",
      sourceRevision,
      "--",
      "packages/kernel",
      "packages/skeleton",
    ]);
    if (kitPreview) {
      ensureReleaseRuntime(temporary);
      previewRuntimeRoot = temporary;
    } else if (
      !kernelDelta &&
      existsSync(join(root, "packages/kernel/dist/src/index.js")) &&
      existsSync(join(root, "packages/skeleton/dist/src/cli.js"))
    ) {
      previewRuntimeRoot = root;
    } else {
      ensureReleaseRuntime(temporary);
      previewRuntimeRoot = temporary;
    }
    return operation(previewRuntimeRoot);
  } finally {
    previewRuntimeRoot = undefined;
    rmSync(temporary, { recursive: true, force: true });
  }
};
const displayValue = (value) =>
  value === null || value === undefined ? "none" : String(value);
const schemaRange = (range) => {
  if (range === null || range === undefined) return "none";
  if (typeof range !== "object") return String(range);
  return range.min === range.max
    ? String(range.min)
    : `${displayValue(range.min)}–${displayValue(range.max)}`;
};
const machineEvidence = (manifest) => {
  const components = Object.entries(manifest.versions.components).sort();
  const schemas = Object.entries(manifest.schemas);
  const reviews = manifest.notes.reviewArtifacts;
  return [
    `- Source: \`${manifest.release.application}\` at \`${manifest.release.commit}\``,
    `- Previous release: ${manifest.release.previousRelease ? `\`${manifest.release.previousRelease}\`` : "none"}`,
    `- Application version: \`${manifest.release.application}\``,
    `- Root workspace version: ${manifest.versions.root ? `\`${manifest.versions.root}\`` : "unversioned"}`,
    "- Component versions:",
    ...(components.length > 0
      ? components.map(([name, version]) => `  - \`${name}\`: \`${version}\``)
      : ["  - None."]),
    "- Schema ranges:",
    ...schemas.map(([name, range]) => `  - \`${name}\`: ${schemaRange(range)}`),
    "- Cadence kinds:",
    `  - Evaluable: ${manifest.cadence.evaluable.length > 0 ? manifest.cadence.evaluable.map((kind) => `\`${kind}\``).join(", ") : "none"}`,
    `  - Deferred: ${manifest.cadence.deferred.length > 0 ? manifest.cadence.deferred.map((kind) => `\`${kind}\``).join(", ") : "none"}`,
    "- Release evidence:",
    ...manifest.evidence.map(
      (row) =>
        `  - \`${row.command}\`: exit ${row.exitCode}; output SHA-256 \`${row.outputSha256}\`${row.codeIdentity ? `; code identity \`${row.codeIdentity}\`; reviewed tree \`${row.reviewedTree}\`; merge tree \`${row.mergeTree}\`` : ""}`,
    ),
    "- Review lineage:",
    ...(reviews.length > 0
      ? reviews.map((path) => `  - \`${path}\``)
      : ["  - None recorded."]),
    `- Changed files: ${manifest.notes.changedFiles.length} (complete list in the canonical manifest embedded in the annotated tag)`,
    `- Distribution: ${manifest.release.distribution}`,
  ].join("\n");
};
const releaseEdition = (root, manifest) => {
  const entries = releaseNoteEntries(
    root,
    manifest.release.previousRelease ?? undefined,
  );
  if (entries.length === 0)
    throw new Error("release range contains no reviewed work order");
  // Reviewed notes link file-relative; on the Release page those resolve
  // nowhere, so they are written absolute to the repository at the release
  // commit, or as plain text where no GitHub target resolves.
  let repository = null;
  try {
    repository = resolveGitHubPushTarget(root);
  } catch {
    repository = null;
  }
  const absolute = (id, heading, text) => {
    const path = releaseNotesPathFor(id, root);
    const rewritten = absoluteBodyLinks(text, {
      from: path,
      repository,
      revision: manifest.release.commit,
    });
    const remaining = relativeLinkFailures(rewritten);
    if (remaining.length)
      throw new Error(
        `${path} # ${heading}, section line ${remaining[0].line}: relative link remains after rewrite; write an absolute destination or remove the unsupported link layout before retrying release close`,
      );
    return rewritten;
  };
  const lines = [
    `${releaseDisplayName(root, manifest.release.commit)} ${manifest.release.application}`,
  ];
  for (const heading of releaseNoteHeadings) {
    lines.push("", `## ${heading}`);
    for (const entry of entries) {
      // Every section heading carries the identifier alone; the title is
      // named once, under the overview.
      lines.push(
        "",
        `### ${entry.id}`,
        ...(heading === releaseNoteHeadings[0]
          ? ["", `**${entry.title}**`]
          : []),
        "",
        absolute(entry.id, heading, entry.sections[heading]),
      );
    }
    if (heading === "Read before upgrading") {
      lines.push(
        "",
        "### Derived from the diff",
        "",
        "These notices are machine-classified from the release diff and follow the reviewer-authored items above.",
        "",
        ...manifest.notes.critical.map((item) => `- ${item}`),
      );
    }
    if (heading === "Evidence and compatibility") {
      lines.push(
        "",
        "### Machine-derived release evidence",
        "",
        machineEvidence(manifest),
      );
    }
  }
  return lines.join("\n");
};
const tagMessage = (root, manifest) =>
  `${releaseEdition(root, manifest)}\n\nDOTLN-MANIFEST-BEGIN\n${JSON.stringify(manifest, null, 2)}\nDOTLN-MANIFEST-END\n`;
/** The Release text of a published tag as a close would render it now, with
 * the commit range bound at the tag's own commit. */
export function regeneratedReleaseText(root, tag) {
  const manifest = manifestFromTag(root, tag);
  const previous = sourceRevision;
  sourceRevision = manifest.release.commit;
  try {
    return releaseEdition(root, manifest);
  } finally {
    sourceRevision = previous;
  }
}
/** A stored pull-request body with its meter block rendered from the current
 * collection and its links written absolute at the given revision. */
export async function regeneratedPullRequestBody(root, workOrderId, revision) {
  const { collectMeta, renderMetaTable } = await import("./lib/meta.mjs");
  const path = docRelative(root, "finalReviews", `${workOrderId}/PR.md`);
  const source = readFileSync(join(root, path), "utf8");
  const body = withMeterBlockLast(
    source,
    renderMetaTable(await collectMeta(root)),
  );
  let repository = null;
  try {
    repository = resolveGitHubPushTarget(root);
  } catch {
    repository = null;
  }
  return absoluteBodyLinks(body, { from: path, repository, revision });
}
const ensureExistingRelease = (root, tag, head, local, remote, workOrderId) => {
  const localTag = local.get(tag);
  const remoteTag = remote.get(tag);
  if (!remoteTag)
    throw new Error(
      `${tag} exists only locally; inspect it and publish or remove it manually`,
    );
  if (
    !remoteTag.annotated ||
    spawnGit([
      "-C",
      root,
      "--no-replace-objects",
      "merge-base",
      "--is-ancestor",
      remoteTag.target,
      head,
    ]).status !== 0
  )
    throw new Error(
      `${tag} already exists remotely for a different or non-annotated object`,
    );
  if (
    localTag &&
    (localTag.objectType !== "tag" ||
      localTag.target !== remoteTag.target ||
      localTag.object !== remoteTag.object)
  )
    throw new Error(`${tag} differs between local and origin`);
  if (!localTag)
    runGit(root, ["fetch", "origin", `refs/tags/${tag}:refs/tags/${tag}`]);
  const previousRevision = sourceRevision;
  sourceRevision = remoteTag.target;
  try {
    const manifest = validatePublishedManifest(
      root,
      manifestFromTag(root, tag),
    );
    if (
      manifest.workOrder.id !== workOrderId ||
      manifest.release.commit !== remoteTag.target
    )
      throw new Error(`${tag} belongs to another order or commit`);
    const expected = tagMessage(root, manifest);
    const actual = tagAnnotation(root, tag);
    if (actual !== expected)
      throw new Error(
        `${tag} annotation differs from its generated manifest and notes`,
      );
    return { manifest, humanLayer: releaseEdition(root, manifest) };
  } finally {
    sourceRevision = previousRevision;
  }
};
const publishedTag = (name, local, remote) => {
  const remoteTag = remote.get(name);
  const localTag = local.get(name);
  if (!remoteTag?.annotated)
    throw new Error(
      `latest published version ${name} is absent or is not an annotated origin tag`,
    );
  if (
    localTag &&
    (localTag.objectType !== "tag" ||
      localTag.object !== remoteTag.object ||
      localTag.target !== remoteTag.target)
  )
    throw new Error(`${name} differs between local and origin`);
  return remoteTag;
};
const updateMain = (root, listMaterial = false) => {
  ensureTrackedClean(root);
  reportLocalMaterial(root, listMaterial);
  if (runGit(root, ["symbolic-ref", "--short", "HEAD"]) !== "main")
    throw new Error("release close must run from the main branch checkout");
  runGit(root, ["fetch", "origin", "main"]);
  runGit(root, ["merge", "--ff-only", "origin/main"]);
  if (
    runGit(root, ["rev-parse", "HEAD"]) !==
    runGit(root, ["rev-parse", "origin/main"])
  )
    throw new Error("main is not synchronized with origin/main");
};
const finishPublishedWorktree = (
  root,
  workOrderId,
  dryRun,
  record,
  overrides,
) =>
  withReleaseStep(record, "worktree-removal", () =>
    finishPublishedWorktreeOperation(
      root,
      workOrderId,
      dryRun,
      record,
      overrides,
    ),
  );
const finishPublishedWorktreeOperation = async (
  root,
  workOrderId,
  dryRun = false,
  record,
  overrides = [],
) => {
  const cleanup = { outcome: "clean", worktrees: [] };
  if (record) record.cleanup = cleanup;
  try {
    const branch = `wo-${workOrderId.slice(3)}`;
    const registered = parseWorktrees(root);
    const subject = registered.find(
      (item) => item.branch === `refs/heads/${branch}`,
    );
    const priorRows = new Map();
    for (const attempt of record?.recoveryAttempts ??
      record?.previousAttempts ??
      [])
      for (const row of attempt.cleanup?.worktrees ?? [])
        priorRows.set(resolve(row.path), row);
    const previousSubject = [
      ...(record?.recoveryAttempts ?? record?.previousAttempts ?? []),
    ]
      .reverse()
      .find(
        (attempt) =>
          attempt.cleanup?.subject?.path &&
          priorRows.get(resolve(attempt.cleanup.subject.path))?.outcome ===
            "retained",
      )?.cleanup.subject;
    const subjectPath = subject?.worktree ?? previousSubject?.path;
    if (subjectPath) cleanup.subject = { path: resolve(subjectPath) };
    const receiptSubjects = retainedWorktreeRemovalSubjects(root, workOrderId, {
      knownSubjects: [
        ...[...priorRows]
          .filter(([, row]) => ["retained", "removed"].includes(row.outcome))
          .map(([path]) => path),
        ...(subjectPath ? [subjectPath] : []),
      ],
    });
    // Without readable history a receipt does not identify primary versus
    // derivative. Keep the branch until every recovered candidate is gone.
    const unidentifiedSubjects = [
      ...receiptSubjects,
      ...[...priorRows]
        .filter(
          ([, row]) => row.outcome === "retained" && row.unidentifiedSubject,
        )
        .map(([path]) => path),
    ];
    const branchExisted = Boolean(runGit(root, ["branch", "--list", branch]));
    const suffix = workOrderId.slice(3);
    const before = registered.filter(
      (item) =>
        item.worktree &&
        resolve(item.worktree) !== root &&
        (item === subject ||
          item.branch === `refs/heads/${branch}` ||
          (item.detached &&
            item.worktree
              .split(/[\\/]/u)
              .some((part) =>
                new RegExp(`(?:^|[^0-9a-z])wo${suffix}(?![0-9])`, "i").test(
                  part,
                ),
              ))),
    );
    // Git may have unregistered a derivative before removal failed too. Keep
    // every surviving retained path visible on retries; its proof and the
    // current registration/writer/gate checks still decide disposal.
    const retainedPaths = [
      subjectPath,
      ...[...priorRows]
        .filter(([, row]) => row.outcome === "retained")
        .map(([path]) => path),
      ...receiptSubjects,
    ].filter(Boolean);
    const owned = new Map();
    for (const attempt of record?.recoveryAttempts ??
      record?.previousAttempts ??
      [])
      for (const saved of attempt.ownedTemporaryRoots ?? [])
        owned.set(saved.path, saved);
    for (const checkout of new Set([
      ...before.map((row) => row.worktree),
      ...retainedPaths,
    ]))
      for (const saved of boundTemporaryRoots(checkout))
        owned.set(saved.path, saved);
    if (record) record.ownedTemporaryRoots = [...owned.values()];
    for (const retained of new Set(retainedPaths.map((path) => resolve(path))))
      if (
        retained !== root &&
        existsSync(retained) &&
        !before.some((item) => resolve(item.worktree) === retained)
      )
        before.push({ worktree: retained, leftover: true });
    for (const item of before) {
      const path = resolve(item.worktree);
      let material = [],
        inventoryError;
      try {
        if (existsSync(path))
          material = inventoryMaterial(path, {
            overrides,
            overrideWorktree: subjectPath ?? null,
          });
      } catch (error) {
        inventoryError = error.message;
        // The rows themselves are still worth recording: a blocker's material
        // command names every kept worktree's repositories from them.
        try {
          material = inventoryMaterial(path);
        } catch {
          material = [];
        }
      }
      cleanup.worktrees.push({
        path,
        material,
        outcome: "pending",
        blockers: [],
        ...(unidentifiedSubjects.includes(path)
          ? { unidentifiedSubject: true }
          : {}),
        ...(inventoryError ? { inventoryError } : {}),
      });
      if (record)
        record.material.push(
          ...material.map((row) => ({ ...row, worktree: path })),
        );
    }
    const outputs = [];
    const actions = subject?.worktree ? ["finish", "settle"] : ["settle"];
    for (const action of actions) {
      try {
        const finished = execute(
          process.execPath,
          [
            join(dryRun ? toolRoot : root, "scripts/worktree.mjs"),
            action,
            workOrderId,
            ...(dryRun ? ["--dry-run"] : []),
            ...(record?.listMaterial ? ["--list-material"] : []),
            ...overrides.flatMap((row) => [
              "--material",
              materialFlagValue(row),
            ]),
          ],
          { cwd: root },
        );
        outputs.push(finished.stdout ?? "");
        if (finished.stdout) writeOutput(finished.stdout);
        for (const line of (finished.stdout ?? "").split("\n"))
          if (line.startsWith("Scratch removal: ")) {
            const removal = JSON.parse(line.slice("Scratch removal: ".length));
            const previous = record?.removals.find(
              (row) =>
                row.worktree === removal.worktree && row.path === removal.path,
            );
            if (previous) Object.assign(previous, removal);
            else record?.removals.push(removal);
          } else if (line.startsWith("Worktree removal proof: ")) {
            const proof = JSON.parse(
              line.slice("Worktree removal proof: ".length),
            );
            const row = cleanup.worktrees.find(
              (item) => item.path === proof.subject,
            );
            if (row) row.preservationReceipt = proof.receipt;
            if (proof.subject === subjectPath)
              cleanup.subject.preservationReceipt = proof.receipt;
          }
        if (finished.status !== 0)
          throw new Error(failureOf(finished, `${action} failed`));
      } catch (error) {
        const command = releaseCloseCommand(root, workOrderId);
        cleanup.outcome = "blocked";
        record?.blockers.push({
          action,
          ...(action === "finish" && subjectPath && existsSync(subjectPath)
            ? { path: resolve(subjectPath) }
            : {}),
          reason: error.message,
          command,
        });
        writeOutput(
          `Advisory: ${dryRun ? "prospective" : "published release"} cleanup blocker: ${error.message}\n`,
        );
      }
    }
    const after = new Set(
      parseWorktrees(root).map((item) => resolve(item.worktree)),
    );
    for (const row of cleanup.worktrees) {
      if (!after.has(row.path) && existsSync(row.path)) {
        try {
          row.preservationReceipt = removeUnregisteredWorktree(
            root,
            row.path,
            workOrderId,
            { dryRun },
          );
          if (dryRun)
            outputs.push(`Derived worktree ${row.path}: would remove`);
          for (const blocker of record?.blockers ?? [])
            if (
              blocker.path === row.path &&
              ["finish", "settle"].includes(blocker.action)
            )
              blocker.resolved = true;
        } catch (error) {
          record?.blockers.push({
            action: "leftover",
            path: row.path,
            reason: `Leftover directory retained: ${row.path}: ${error.message}`,
            command: releaseCloseCommand(root, workOrderId),
          });
        }
      }
    }
    for (const row of cleanup.worktrees) {
      const output = outputs.join("\n");
      if (!dryRun && !after.has(row.path) && !existsSync(row.path))
        row.outcome = "removed";
      else if (
        dryRun &&
        (output.includes(`Derived worktree ${row.path}: would remove`) ||
          output.includes(`Derived worktree ${row.path}: would prune`) ||
          (row.path === subjectPath &&
            output.includes(`Dry run: would fetch main`)))
      )
        row.outcome = "would-remove";
      else {
        row.outcome = "retained";
        cleanup.outcome = "blocked";
        row.blockers = (record?.blockers ?? []).filter(
          (blocker) =>
            !blocker.resolved &&
            (blocker.path === row.path ||
              blocker.worktree === row.path ||
              (!blocker.path &&
                !blocker.worktree &&
                blocker.action ===
                  (row.path === subjectPath ? "finish" : "settle"))),
        );
        const lines = output.split("\n");
        const kept =
          row.path === subjectPath
            ? -1
            : lines.findIndex((line) =>
                line.startsWith(`Derived worktree ${row.path}: kept`),
              );
        if (kept >= 0) {
          // The whole reason: the kept line and the indented lines that
          // continue it. A remedy that is the operator's is named apart.
          const reason = [lines[kept]];
          for (
            let index = kept + 1;
            index < lines.length && lines[index].startsWith("  ");
            index++
          )
            reason.push(lines[index]);
          const operator = /; operator: (.*?), then retry with /u.exec(
            lines[kept],
          )?.[1];
          const blocker = {
            action: "settle",
            path: row.path,
            reason: reason.join("\n"),
            command: releaseCloseCommand(root, workOrderId),
            ...(operator ? { operator } : {}),
          };
          row.blockers.push(blocker);
          record?.blockers.push(blocker);
        }
        if (!row.blockers.length) {
          const blocker = {
            action: "leftover",
            path: row.path,
            reason: `Worktree retained: ${row.path}: ${row.inventoryError ?? "cleanup did not remove this path"}`,
            command: releaseCloseCommand(root, workOrderId),
          };
          row.blockers.push(blocker);
          record?.blockers.push(blocker);
        }
      }
    }
    // A blocker a nested repository caused carries the material command
    // naming every kept worktree's repositories, so the operator can settle
    // it with a word, and the discarding form of that command.
    const kept = cleanup.worktrees
      .filter((row) => row.outcome === "retained")
      .flatMap((row) =>
        row.material.map((material) => ({
          path: material.path,
          worktree: row.path,
          protected:
            material.lane === "intake" || material.submodule || material.linked,
        })),
      );
    const materialCaused = (reason) =>
      /\b(?:scratch repository|nested repository|material word)\b/iu.test(
        reason ?? "",
      );
    if (kept.length)
      for (const blocker of record?.blockers ?? [])
        if (
          !blocker.resolved &&
          ["finish", "settle"].includes(blocker.action) &&
          materialCaused(blocker.reason)
        )
          Object.assign(blocker, {
            command: materialCloseCommand(root, workOrderId, kept),
            ...(kept.some((row) => !row.protected)
              ? {
                  disposableCommand: materialCloseCommand(
                    root,
                    workOrderId,
                    kept.filter((row) => !row.protected),
                    "disposable",
                  ),
                }
              : {}),
          });
    const retries = new Set(
      (record?.blockers ?? [])
        .filter((blocker) => !blocker.resolved && blocker.disposableCommand)
        .map((blocker) => blocker.command),
    );
    for (const command of retries) writeOutput(`Material retry: ${command}\n`);
    const subjectRemoved =
      (!subjectPath ||
        (!after.has(resolve(subjectPath)) && !existsSync(subjectPath))) &&
      unidentifiedSubjects.every(
        (path) => !after.has(path) && !existsSync(path),
      );
    const subjectWouldRemove =
      (!subjectPath ||
        (!after.has(resolve(subjectPath)) && !existsSync(subjectPath)) ||
        cleanup.worktrees.some(
          (row) => row.path === subjectPath && row.outcome === "would-remove",
        )) &&
      unidentifiedSubjects.every(
        (path) =>
          (!after.has(path) && !existsSync(path)) ||
          cleanup.worktrees.some(
            (row) => row.path === path && row.outcome === "would-remove",
          ),
      );
    cleanup.branch = {
      name: branch,
      outcome: branchExisted ? "retained" : "absent",
    };
    if (branchExisted && (dryRun ? subjectWouldRemove : subjectRemoved)) {
      try {
        if (dryRun) cleanup.branch.outcome = "would-delete";
        else {
          if (runGit(root, ["branch", "--list", branch]))
            removeMergedBranch(root, branch);
          cleanup.branch.outcome = "deleted";
        }
      } catch (error) {
        record?.blockers.push({
          action: "branch",
          reason: error.message,
          command: releaseCloseCommand(root, workOrderId),
        });
      }
    }
    try {
      const { pruneHarness } = await import("./lib/harness-prune.mjs");
      const prune = await withReleaseStep(record, "prune", () =>
        pruneHarness(root, {
          apply: !dryRun,
          scope: "close",
          ownedTemporaryRoots: record?.ownedTemporaryRoots ?? [],
          preserveOrders: [workOrderId],
        }),
      );
      if (record) record.prune = prune;
      writeOutput(`${formatPruneReport(prune)}\n`);
    } catch (error) {
      const blocker = {
        action: "prune",
        reason: error.message,
        command: releaseCloseCommand(root, workOrderId),
      };
      if (record)
        record.prune = {
          candidates: [],
          removed: [],
          retained: [],
          bytes: 0,
          census: [],
          blockers: [blocker],
        };
      record?.blockers.push(blocker);
    }
    cleanup.outcome =
      cleanup.worktrees.some((row) => row.outcome === "retained") ||
      cleanup.branch.outcome === "retained" ||
      record?.blockers.some((row) => !row.resolved)
        ? "blocked"
        : "clean";
  } catch (error) {
    cleanup.outcome = "blocked";
    record?.blockers.push({
      action: "cleanup",
      reason: error.message,
      command: releaseCloseCommand(root, workOrderId),
    });
    writeOutput(
      `Advisory: ${dryRun ? "prospective" : "published release"} cleanup blocker: ${error.message}\n`,
    );
  }
};
const executeGh = (root, args) => {
  return execute("gh", args, {
    cwd: root,
    env: environmentWithoutGhRepo(),
  });
};
const ensureGhPreflight = (
  root,
  repository = resolveGitHubPushTarget(root),
) => {
  const available = executeGh(root, ["--version"]);
  if (available.status !== 0)
    throw new Error(
      "gh is required before tag creation; install GitHub CLI and retry",
    );
  const authenticated = executeGh(root, [
    "auth",
    "status",
    "--hostname",
    repository.host,
  ]);
  if (authenticated.status !== 0)
    throw new Error(
      "gh authentication is required before tag creation; run gh auth login and retry",
    );
  return repository;
};
const firstDifferingLine = (expected, actual) => {
  const expectedLines = expected.split("\n");
  const actualLines = actual.split("\n");
  const count = Math.max(expectedLines.length, actualLines.length);
  for (let index = 0; index < count; index += 1) {
    if (expectedLines[index] !== actualLines[index])
      return {
        number: index + 1,
        expected: expectedLines[index],
        actual: actualLines[index],
      };
  }
  return undefined;
};
const viewedGitHubRelease = (root, repository, tag) => {
  const viewed = executeGh(root, [
    "release",
    "view",
    tag,
    "--repo",
    repository.selector,
    "--json",
    "body,name,isDraft,isPrerelease,assets",
  ]);
  if (viewed.status !== 0) {
    const reason = failureOf(viewed, "GitHub Release lookup failed");
    if (/\brelease not found\b/i.test(reason)) return undefined;
    throw new Error(
      `tag published; GitHub Release state not verified and no create was attempted; rerun the same command: ${reason}`,
    );
  }
  try {
    const release = parseJson(viewed.stdout, `${tag} GitHub Release metadata`);
    if (
      typeof release.body !== "string" ||
      typeof release.name !== "string" ||
      typeof release.isDraft !== "boolean" ||
      typeof release.isPrerelease !== "boolean" ||
      !Array.isArray(release.assets)
    )
      throw new Error("release metadata has the wrong shape");
    return release;
  } catch (error) {
    throw new Error(
      `tag published; GitHub Release state not verified and no create was attempted; rerun the same command: ${tag} returned invalid metadata (${error instanceof Error ? error.message : String(error)})`,
    );
  }
};
const releaseTitle = (tag, humanLayer) =>
  humanLayer.startsWith(`DotLn ${tag} — `)
    ? `DotLn ${tag}`
    : humanLayer.split("\n", 1)[0];
const ensureGitHubRelease = (
  root,
  repository,
  tag,
  expectedBody,
  expectedTitle,
) => {
  const existing = viewedGitHubRelease(root, repository, tag);
  if (existing !== undefined) {
    if (
      existing.name !== expectedTitle ||
      existing.isDraft ||
      existing.isPrerelease ||
      existing.assets.length > 0
    )
      throw new Error(
        `${tag} GitHub Release metadata differs: expected title ${JSON.stringify(expectedTitle)}, not draft, not prerelease, and no assets`,
      );
    const difference = firstDifferingLine(expectedBody, existing.body);
    if (difference)
      throw new Error(
        `${tag} GitHub Release body differs at line ${difference.number}: expected ${JSON.stringify(difference.expected ?? "<missing>")}; observed ${JSON.stringify(difference.actual ?? "<missing>")}`,
      );
    return "existing";
  }
  let created;
  try {
    created = withTemporaryBody(
      expectedBody,
      (bodyPath) =>
        executeGh(root, [
          "release",
          "create",
          tag,
          "--repo",
          repository.selector,
          "--verify-tag",
          "--title",
          expectedTitle,
          "--notes-file",
          bodyPath,
        ]),
      "RELEASE.md",
    );
  } catch (error) {
    throw new Error(
      `tag published; GitHub Release not created; rerun the same command: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (created.status !== 0)
    throw new Error(
      `tag published; GitHub Release not created; rerun the same command: ${failureOf(created, "gh release create failed")}`,
    );
  return "created";
};
const projectedReleaseBody = (tag, humanLayer) =>
  `${humanLayer}\n\nRender these notes locally with \`npm run release -- notes ${tag}\`; inspect the canonical manifest with \`npm run release -- manifest-from-tag ${tag}\`.\n`;
const backfillReleaseBody = (tag, humanLayer) => {
  const historicalLinks =
    tag === "v0.2.0"
      ? "\n\nHistorical records: [manifest](../../blob/main/docs/releases/v0.2.0.md) and [notes](../../blob/main/docs/releases/v0.2.0-notes.md)."
      : "";
  return `**Notes as generated at close; predates WO-024's release-note edition.**\n\n${humanLayer}${historicalLinks}\n`;
};
const publishTag = (root, tag, commit, message, tagger, publication) => {
  const body = `object ${commit}\ntype commit\ntag ${tag}\ntagger ${tagger}\n\n${message}`;
  const made = execute("git", ["-C", root, "mktag"], { input: body });
  if (made.status !== 0)
    throw new Error(
      `cannot create annotated tag object: ${failureOf(made, "git mktag failed")}`,
    );
  const object = made.stdout.trim();
  const pushed = execute("git", [
    "-C",
    root,
    "push",
    "--no-follow-tags",
    "origin",
    `${object}:refs/tags/${tag}`,
  ]);
  if (pushed.status !== 0)
    throw new Error(
      `tag push failed; no local tag ref was created: ${failureOf(pushed, "git push failed")}`,
    );
  publication.tagOutcome = "published";
  publication.tagObject = object;
  try {
    runGit(root, ["update-ref", `refs/tags/${tag}`, object, ""]);
  } catch (error) {
    throw new Error(
      `tag published; GitHub Release not created; rerun the same command: cannot record the local tag ref (${error instanceof Error ? error.message : String(error)})`,
    );
  }
  return object;
};
// A refresh failure is a completion blocker of an already published release.
// Declaration and import failures are recorded here too; none changes its
// publication or cleanup outcome.
const refreshPublishedStarters = (
  root,
  head,
  tag,
  workOrderId,
  dryRun,
  record,
) =>
  withReleaseStep(record, "starter-refresh", () =>
    refreshPublishedStartersOperation(
      root,
      head,
      tag,
      workOrderId,
      dryRun,
      record,
    ),
  );
const refreshPublishedStartersOperation = async (
  root,
  head,
  tag,
  workOrderId,
  dryRun,
  record,
) => {
  try {
    if (!exportSiblings(readDeclaration(root)).length) return;
    const { refreshStarters } = await import("./lib/starter-refresh.mjs");
    record.starterRefresh = await refreshStarters({
      main: root,
      head,
      tag,
      dryRun,
    });
  } catch (error) {
    record.starterRefresh = [
      {
        sibling: "declaration",
        outcome: "refused",
        reason: String(error.message).replaceAll(root, "<launchpad>"),
      },
    ];
  }
  for (const row of record.starterRefresh.filter(
    (row) => row.outcome === "refused",
  )) {
    record.blockers.push({
      action: "starter-refresh",
      reason: `${row.sibling}: ${row.reason}`,
      command: releaseCloseCommand(root, workOrderId),
    });
    process.exitCode = 1;
  }
};

// A target release is opt-in (WO-221): `repositories.<id>.release.policy:
// declared` plus the order's `**Target release classification:**` header. The
// next tag comes from the target's remote `v*` tags (none means v0.1.0), the
// annotated tag lands on the merged base and the target's GitHub Release
// follows; an equal tag on the same commit is an idempotent retry and a
// differing one refuses. Absent policy keeps today's no-release.
const targetReleaseClassification = (root, state, revision) => {
  const markdown = repositoryFile(root, state.workOrderPath, revision);
  const headers = [
    ...markdown.matchAll(
      /^\*\*Target release classification:\*\*\s*(patch|minor|major)\b/gmu,
    ),
  ];
  if (headers.length !== 1)
    throw new Error(
      `repositories.${state.repositoryId}.release.policy is declared, but ${state.workOrderPath} carries ${headers.length ? `${headers.length} **Target release classification:** headers` : "no **Target release classification:** patch | minor | major header"}; exactly one is needed`,
    );
  return headers[0][1];
};
// The order title and the close line of a target Release text name the
// closing order on purpose: that is the text WO-221-D006 chose, and the legacy
// body keeps it byte for byte. The identifier rule is lifted inside that frame
// alone; the reviewed text is judged for identifiers and every part for words.
const KIT_FRAME_EXEMPT = ["identifier.launchpad"];
// The Release body of a target order whose header names the reviewed notes:
// the five sections of its RELEASE-NOTES.md at the merged revision,
// the order title once under the overview and the close line last. The notes
// link launchpad-relative, which resolves nowhere on the target's Release
// page: a link to a record the records commit moved into the target is
// written absolute to the target at the tagged commit; any other link becomes
// its text. Absent or invalid notes refuse before any tag push.
//
// Only the bytes this renderer writes for a moved record (the target's
// address, the tagged commit and the record's path) are the kit's frame. A
// URL the notes' author wrote stays authored text under every check, even at
// the same address, commit and bytes as a record link, and so does a query
// or fragment the author's relative link carried, except that a fragment may
// name the closing order's own identifiers: the close line and the moved
// records already publish them, as a decision's anchor does.
const targetReleaseNotesBody = (
  root,
  state,
  revision,
  { title, closeLine, forge, tagged, repository, matchLaunchpadIdentifiers },
) => {
  const path = releaseNotesPathFor(state.workOrderId, root);
  const source = optionalGitFile(root, revision, path);
  if (source === undefined)
    throw new Error(
      `${path}: **Target release notes:** reviewed needs the reviewed notes at the merged revision, and the file is absent; source retained`,
    );
  const { sections } = parseReleaseNotes(source, path);
  const moved = new Map(
    targetRecordSources(
      root,
      state,
      eventsForOrder(readControl(root, revision), state.workOrderId),
      repository,
    ).map((row) => [row.source, row.path]),
  );
  const ownIdentifier = new RegExp(
    `^${state.workOrderId}(?:-d[0-9]{3})?$`,
    "iu",
  );
  const parts = [];
  const recordLinks = [];
  // A section's rendered text with each destination the rewrite wrote, at
  // its offset in the body once the section lands after the parts before it.
  // Every written destination is a moved record's, since an unmapped link
  // becomes its text.
  const links = (text) => {
    const written = [];
    const rendered = absoluteBodyLinks(text, {
      from: path,
      repository: forge,
      revision: tagged,
      map: (resolved) => moved.get(resolved) ?? null,
      written,
    });
    const at = parts.reduce((length, [, part]) => length + part.length, 0);
    for (const { start, end } of written) {
      // The written path percent-encodes `?` and `#`, so the first of them
      // starts the query or fragment the author's link carried.
      const kitEnd = start + rendered.slice(start, end).search(/[?#]|$/u);
      recordLinks.push({
        name: "record link",
        start: at + start,
        end: at + kitEnd,
        // A moved record's address and order path are the target's own
        // records (WO-221), read like a path its base already holds.
        exempt: [...KIT_FRAME_EXEMPT, "vocabulary.review"],
      });
      const fragment = rendered.slice(start, end).indexOf("#");
      const fragmentStart = fragment < 0 ? end : start + fragment;
      for (const match of matchLaunchpadIdentifiers(
        rendered.slice(fragmentStart, end),
      ))
        if (ownIdentifier.test(match.identifier))
          recordLinks.push({
            name: "record link",
            start: at + fragmentStart + match.start,
            end: at + fragmentStart + match.end,
            exempt: KIT_FRAME_EXEMPT,
          });
    }
    return rendered;
  };
  for (const heading of releaseNoteHeadings) {
    parts.push(["reviewed notes", `## ${heading}\n\n`]);
    if (heading === releaseNoteHeadings[0])
      parts.push(
        ["order title", `**${title}**`, KIT_FRAME_EXEMPT],
        ["", "\n\n"],
      );
    parts.push(["reviewed notes", `${links(sections[heading])}\n\n`]);
  }
  parts.push(["close line", closeLine, KIT_FRAME_EXEMPT], ["", "\n"]);
  const body = labelledParts(parts);
  return { text: body.text, sections: [...recordLinks, ...body.sections] };
};
const nextTargetVersion = (latest, classification) => {
  const parts = semver(latest);
  const axis = { major: 0, minor: 1, patch: 2 }[classification];
  parts[axis]++;
  for (let index = axis + 1; index < parts.length; index++) parts[index] = 0;
  return `v${parts.join(".")}`;
};
const prepareTargetRelease = async (
  root,
  state,
  revision,
  { dryRun, publish, record, entry, confirmTerms },
) => {
  const repository = loadConfig(root).repositories[state.repositoryId];
  const target = (record.publication.target = {
    repositoryId: state.repositoryId,
    policy: repository?.release?.policy ?? "no-release",
    outcome: "no-release",
    tag: null,
    release: null,
  });
  if (target.policy !== "declared") return;
  const classification = targetReleaseClassification(root, state, revision);
  // The release is an effect of the registered repository: the operator
  // grant must name it and the kernel judges the profile's expiry and
  // revocation, as it does for the publication effects.
  const { authorizeRegisteredEffects } =
    await import("./lib/target-publish.mjs");
  const { readAuthorityGrantRegistry } =
    await import("./lib/authority-grants.mjs");
  authorizeRegisteredEffects(
    repository,
    readAuthorityGrantRegistry(root),
    Date.now(),
    state.workOrderId,
    ["release.close"],
  );
  const clone = recordedRepositoryClone(root, state.repositoryId);
  if (typeof clone !== "string")
    throw new Error(
      `no recorded clone for ${state.repositoryId}; use worktree clone ${state.repositoryId} <absolute-path>`,
    );
  const merged = runGit(clone, [
    ...HOST_GIT_READ,
    "rev-parse",
    `refs/remotes/origin/${repository.baseBranch}^{commit}`,
  ]);
  const url = pushUrl(clone);
  const forge = parseGitHubTarget(url);
  // A tag an earlier attempt of this close published is this close's tag,
  // whatever the base has done since; otherwise only tags the merged base
  // reaches set the baseline, including a different order's tag already on
  // the merged commit, and the candidate name held by a
  // commit the base does not reach refuses by name.
  const tags = remoteTagsAt(url);
  const attempts = [
    ...(record.recoveryAttempts ?? record.previousAttempts ?? []),
  ]
    .reverse()
    .filter(
      (attempt) =>
        !attempt.dryRun &&
        ["attempting", "published", "already-published"].includes(
          attempt.publication?.target?.tagOutcome,
        ),
    )
    .map((attempt) => attempt.publication.target);
  const earlier = attempts[0];
  // A failed recheck can follow a completed publication. Retain that known
  // completion while its body, tag and commit binding remain the same.
  const completed = attempts.find(
    (attempt) =>
      attempt.release &&
      attempt.body?.digest &&
      attempt.body.digest === earlier?.body?.digest &&
      attempt.tag === earlier.tag &&
      attempt.commit === earlier.commit,
  );
  const origin = entry?.origin ?? earlier?.origin;
  if (
    !origin ||
    forge.identity !== origin ||
    (earlier?.origin && earlier.origin !== origin)
  )
    throw new Error(
      `target release origin differs from the recorded origin for ${state.repositoryId}; source retained. Restore the registered origin before retrying`,
    );
  const reaches = (commit) =>
    execute("git", [
      "-C",
      clone,
      ...HOST_GIT_READ,
      "merge-base",
      "--is-ancestor",
      commit,
      merged,
    ]).status === 0;
  const versions = new Map(
    [...tags].filter(([name, row]) => semver(name) && reaches(row.target)),
  );
  const latest = latestVersion(versions);
  const tag = earlier?.tag
    ? earlier.tag
    : latest
      ? nextTargetVersion(latest, classification)
      : "v0.1.0";
  const existing = tags.get(tag)?.target ?? null;
  // The first publication attempt owns both the name and the commit. A
  // retry must not adopt a moved remote tag or a subsequently advanced base.
  const tagged = earlier?.tag ? earlier.commit : merged;
  if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u.test(tagged ?? ""))
    throw new Error(
      `target release tag ${tag} has no valid recorded commit; source retained. Inspect the earlier release-close receipt before retrying`,
    );
  Object.assign(target, {
    classification,
    latest: latest ?? null,
    tag,
    commit: tagged,
    origin,
    title: `${repository.release.displayName ?? state.repositoryId} ${tag}`,
  });
  if (existing && existing !== tagged)
    throw new Error(
      `target release tag ${tag} exists on ${forge.selector} at ${existing}, not the ${earlier?.tag ? "recorded release commit" : `merged ${repository.baseBranch}`} ${tagged}; source retained`,
    );
  const authority = readWorkOrderAuthority(root, state, revision, {
    versioned: false,
  });
  // The Release text: the order names its body source; the legacy
  // body stays byte for byte, and both pass the outward lint under the
  // instance vocabulary and local list with the display name read as a name.
  const displayName = repository.release.displayName ?? state.repositoryId;
  const closeLine = `Closed by ${state.workOrderId}; merged ${repository.baseBranch} at ${tagged}.`;
  const legacyBody = `${authority.title}\n\n${authority.objective}\n\n${closeLine}\n`;
  const notesSource = targetReleaseNotesSource(
    repositoryFile(root, state.workOrderPath, revision),
    state.workOrderPath,
  );
  const { text: body, sections: bodySections } =
    notesSource === "reviewed"
      ? targetReleaseNotesBody(root, state, revision, {
          title: authority.title,
          closeLine,
          forge,
          tagged,
          repository,
          matchLaunchpadIdentifiers: (await import("./lib/outward-lint.mjs"))
            .matchLaunchpadIdentifiers,
        })
      : labelledParts([
          ["order title", authority.title, KIT_FRAME_EXEMPT],
          ["", "\n\n"],
          ["objective", authority.objective],
          ["", "\n\n"],
          ["close line", closeLine, KIT_FRAME_EXEMPT],
          ["", "\n"],
        ]);
  const tagMessage = labelledParts([
    ["release title", target.title],
    ["", "\n\n"],
    ["order title", authority.title, KIT_FRAME_EXEMPT],
    ["", "\n\n"],
    ["close line", closeLine, KIT_FRAME_EXEMPT],
  ]);
  const { lintArtifacts, reviewConfirmation } =
    await import("./lib/target-publish.mjs");
  const say = (line) => writeOutput(`${line}\n`);
  const digest = digestOf(body);
  // An attempt that pushed the tag and still owes the Release publishes the
  // bytes it bound; changed notes or order text refuse, like a moved tag,
  // before any review question is asked of the new bytes. A completed Release
  // is immutable and is rechecked below against its recorded digest.
  if (earlier?.body?.digest && !completed && earlier.body.digest !== digest)
    throw new Error(
      `target release body (${notesSource}) differs from the bytes the recorded attempt bound; the reviewed notes or the order text changed after the tag attempt; source retained. Restore them before retrying`,
    );
  // The confirmation a recorded attempt holds stands for the same digest.
  const recordedConfirmation = earlier?.body?.confirmation?.confirmedDigest;
  const lint = lintArtifacts(
    root,
    [
      {
        kind: "release-body",
        text: tagMessage.text,
        sections: tagMessage.sections,
        exemptText: [displayName],
      },
      {
        kind: "release-body",
        text: body,
        sections: bodySections,
        exemptText: [displayName],
        confirms: true,
      },
    ],
    {
      confirmTerms:
        confirmTerms ??
        (recordedConfirmation === digest ? recordedConfirmation : undefined),
      preview: dryRun,
      prefix: "target release refused: ",
      log: say,
    },
  );
  const candidateBody = {
    source: notesSource,
    digest,
    review: lint.pending
      ? { pending: lint.pending.items }
      : lint.review
        ? { matches: lint.review.matches }
        : null,
  };
  target.body = completed ? { ...completed.body } : candidateBody;
  if (lint.pending)
    say(
      `Target release body review items, confirmed at publication with --confirm-terms ${lint.pending.digest}: ${lint.pending.items.join("; ")}`,
    );
  if (publish) ensureGhFor(clone, forge);
  target.outcome = dryRun ? "preview" : "prepared";
  if (dryRun || !publish) return;
  candidateBody.confirmation =
    reviewConfirmation(root, state.workOrderId, lint.review, Date.now(), say) ??
    null;
  // The caller judges all cleanup and publication prerequisites before any
  // deletion. This closure keeps the tag, commit and origin fixed afterward.
  return () => {
    if (!existing) {
      target.tagOutcome = "attempting";
      try {
        pushAnnotatedTag(clone, url, {
          sourceRef: tagged,
          commit: tagged,
          tag,
          message: tagMessage.text,
          tagger: runGit(clone, ["var", "GIT_COMMITTER_IDENT"]),
        });
      } catch (error) {
        // A transport may report failure after the remote accepted the tag.
        // Keep the attempted binding even when its remote observation fails.
        try {
          if (remoteTagsAt(url).get(tag)?.target === tagged)
            target.tagOutcome = "published";
        } catch {
          /* binding remains attempting */
        }
        throw error;
      }
      target.tagOutcome = "published";
    } else target.tagOutcome = "already-published";
    target.release = ensureRelease(
      clone,
      forge,
      tag,
      target.title,
      body,
      // A Release published before the display name keeps its default
      // title, and one published with the legacy body before the order
      // named the reviewed notes keeps that body; any other title or body
      // still refuses.
      {
        admittedTitles: [
          ...new Set([target.title, `${state.repositoryId} ${tag}`]),
        ],
        admittedBodies: [...new Set([body, legacyBody])],
        admittedBodyDigests: earlier?.body?.digest ? [earlier.body.digest] : [],
        bindBody: (publishedBody) => {
          const publishedDigest = digestOf(publishedBody);
          target.body =
            publishedDigest === earlier?.body?.digest
              ? { ...earlier.body }
              : publishedDigest === digest
                ? candidateBody
                : {
                    source: "objective",
                    digest: publishedDigest,
                    review: null,
                    confirmation: null,
                  };
        },
      },
    );
    target.outcome = target.release === "existing" ? "current" : "published";
  };
};

const closePrerequisites = (root, workOrderId, parsed, record) => {
  const { flags } = parsed;
  if (resolve(process.cwd()) !== root)
    throw new Error(
      `release close must run from the main control-plane checkout: ${root}`,
    );
  const dryRun = flags.includes("--dry-run");
  const targetOrder =
    targetWorktreeForOrder(root, workOrderId) ||
    readControl(root).orders.get(workOrderId)?.state.repositoryId;
  const reachable = targetOrder
    ? (runGit(root, ["ls-remote", "--exit-code", "--heads", "origin", "main"]),
      { host: "origin" })
    : ensureOriginReachable(root);
  if (dryRun)
    writeOutput(
      `Origin reachable: ${reachable.host} (git ls-remote)${targetOrder ? "." : "; publication also needs gh authentication there."}\n`,
    );
  if (dryRun) {
    ensureTrackedClean(root);
    reportLocalMaterial(root, flags.includes("--list-material"));
    runGit(root, ["fetch", "origin", "main"]);
    sourceRevision = runGit(root, ["rev-parse", "origin/main"]);
    const ancestor = execute("git", [
      "-C",
      root,
      "merge-base",
      "--is-ancestor",
      "HEAD",
      sourceRevision,
    ]);
    if (ancestor.status !== 0)
      throw new Error("main cannot fast-forward to origin/main");
  } else updateMain(root, flags.includes("--list-material"));
  const state = parseControlStateAt(root, sourceRevision, workOrderId);
  if (state.workOrderId !== workOrderId)
    throw new Error(
      `merged control state is for ${state.workOrderId ?? "none"}, not ${workOrderId}`,
    );
  if (state.repositoryId) {
    if (state.phase !== "closed")
      throw new Error(
        `release close requires a closed work order; observed ${state.phase}`,
      );
    return { state };
  }
  // These checks depend only on source and Git. Refuse an invalid release
  // before preparing or importing its compiled runtime.
  const authority = workOrderAuthority(root, state, sourceRevision);
  record.publication.tag = authority.version;
  let local = localTags(root);
  const remote = remoteTags(root);
  const latest = latestVersion(remote);
  let previous = latest ? publishedTag(latest, local, remote) : undefined;
  if (latest && !local.has(latest)) {
    runGit(root, [
      "fetch",
      "origin",
      `refs/tags/${latest}:refs/tags/${latest}`,
    ]);
    local = localTags(root);
    previous = publishedTag(latest, local, remote);
  }
  const surfaceCheck = checkSurfaces(root, {
    state,
    revision: sourceRevision,
    expectedWorkOrderId: workOrderId,
    authority,
    local,
    remote,
  });
  writeOutput(surfaceCheck.report);
  if (!surfaceCheck.passed) {
    record.publication.outcome = "refused";
    record.publication.refusal = surfaceCheck.report.trim();
    record.blockers.push({
      action: "publication",
      reason:
        surfaceCheck.report
          .split("\n")
          .filter((line) => line.startsWith("FAIL "))
          .join("; ") || "Release surface validation failed",
      command: releaseCloseCommand(root, workOrderId),
    });
    process.exitCode = 1;
    return undefined;
  }
  const head = runGit(root, ["rev-parse", sourceRevision]);
  const remaining = openOrders(readControl(root, sourceRevision));
  const mainStatus = remaining.length
    ? `Main tracked files are clean; in-flight orders: ${remaining.join(", ")}.`
    : "Main tracked files are clean and between work orders.";
  const context = { state, authority, local, remote, latest, head, mainStatus };
  if (latest && compareVersions(authority.version, latest) < 0) return context;
  const blockingTag = nestedTagConflict(authority.version, local, remote);
  if (blockingTag)
    throw new Error(
      `release tag ${authority.version} is blocked by nested tag ${blockingTag}`,
    );
  const existing = latest && compareVersions(authority.version, latest) === 0;
  if (existing) {
    const remoteTag = remote.get(authority.version);
    if (remoteTag?.annotated && remoteTag.target === head)
      record.publication.tagOutcome = "already-published";
  } else {
    if (latest) {
      const ancestor = execute("git", [
        "-C",
        root,
        "merge-base",
        "--is-ancestor",
        previous.target,
        head,
      ]);
      if (ancestor.status !== 0)
        throw new Error(
          `latest release ${latest} is not an ancestor of ${head}`,
        );
    }
    if (local.has(authority.version) || remote.has(authority.version))
      throw new Error(`release tag already exists: ${authority.version}`);
  }
  if (flags.includes("--publish") && !dryRun) {
    context.repository = ensureGhPreflight(root);
    if (!existing)
      context.tagger = runGit(root, ["var", "GIT_COMMITTER_IDENT"]);
  }
  return context;
};

const close = async (root, workOrderId, parsed, record, context) => {
  const {
    state,
    authority,
    local,
    remote,
    latest,
    head,
    mainStatus,
    repository,
    tagger,
  } = context;
  const { flags, material: overrides, confirmTerms } = parsed;
  const publish = flags.includes("--publish");
  const dryRun = flags.includes("--dry-run");
  if (state.repositoryId) {
    record.publication.outcome = "no-release";
    const targetPolicy =
      loadConfig(root).repositories[state.repositoryId]?.release?.policy ??
      "no-release";
    record.publication.target = {
      repositoryId: state.repositoryId,
      policy: targetPolicy,
      outcome: targetPolicy === "declared" ? "not-attempted" : "no-release",
      tag: null,
      release: null,
    };
    if (targetPolicy === "declared")
      record.publication.outcome = "not-attempted";
    if (publish || dryRun) {
      const { closeTargetWorktree } =
        await import("./lib/target-worktree-close.mjs");
      const entry = targetWorktreeForOrder(root, state.workOrderId);
      await withReleaseStep(record, "worktree-removal", () =>
        closeTargetWorktree(root, state, true, record, {
          retryMode: dryRun ? "--dry-run" : "--publish",
        }),
      );
      const publishRelease = await prepareTargetRelease(
        root,
        state,
        sourceRevision,
        {
          dryRun,
          publish,
          record,
          entry,
          confirmTerms,
        },
      );
      try {
        if (!dryRun)
          await withReleaseStep(record, "worktree-removal", () =>
            closeTargetWorktree(root, state, false, record),
          );
      } catch (error) {
        record.cleanup.outcome = "blocked";
        throw error;
      }
      // The target branch is proven merged by the close; a declared target
      // release tags that merged base and creates the target's Release.
      publishRelease?.();
      await finishPublishedWorktree(
        root,
        workOrderId,
        dryRun,
        record,
        overrides,
      );
    }
    const target = record.publication.target;
    writeOutput(
      target && target.policy === "declared"
        ? `${workOrderId} closes a registered target; target release ${target.tag}: ${target.outcome}${target.release ? ` (GitHub Release ${target.release})` : ""}; no launchpad tag is due.\n`
        : `${workOrderId} closes a registered target; no release tag is due in either repository.\n`,
    );
    return;
  }
  if (latest && compareVersions(authority.version, latest) < 0) {
    record.publication.outcome = "no-release";
    if (!dryRun)
      refreshHarnessRuntime(
        root,
        () => assertReleaseRuntime(root),
        writeOutput,
      );
    if (publish || dryRun)
      await finishPublishedWorktree(
        root,
        workOrderId,
        dryRun,
        record,
        overrides,
      );
    writeOutput(
      `${workOrderId} closes ${authority.version}, below latest release ${latest}; no release tag is due. ${mainStatus}\n`,
    );
    return;
  }
  if (latest && compareVersions(authority.version, latest) === 0) {
    if (!dryRun) assertReleaseRuntime(root);
    const inspectExisting = () =>
      ensureExistingRelease(
        root,
        authority.version,
        head,
        local,
        remote,
        workOrderId,
      );
    const existing = dryRun
      ? withPreviewRuntime(root, inspectExisting)
      : inspectExisting();
    record.publication.tagOutcome = "already-published";
    if (dryRun) {
      record.publication.outcome = "preview";
      writeOutput(
        `Dry run: would fast-forward main to ${head}, validate the recorded reviewer gate, and reconcile the existing Release.\n${JSON.stringify(existing.manifest, null, 2)}\n`,
      );
      await finishPublishedWorktree(root, workOrderId, true, record, overrides);
      if (publish)
        await refreshPublishedStarters(
          root,
          existing.manifest.release.commit,
          authority.version,
          workOrderId,
          true,
          record,
        );
      return;
    }
    const projection = publish
      ? ensureGitHubRelease(
          root,
          repository,
          authority.version,
          projectedReleaseBody(authority.version, existing.humanLayer),
          releaseTitle(authority.version, existing.humanLayer),
        )
      : undefined;
    record.publication.outcome = "already-published";
    record.publication.release = projection ?? null;
    if (publish) {
      await finishPublishedWorktree(
        root,
        workOrderId,
        false,
        record,
        overrides,
      );
      await refreshPublishedStarters(
        root,
        existing.manifest.release.commit,
        authority.version,
        workOrderId,
        false,
        record,
      );
    }
    writeOutput(
      `${authority.version} is already published from ${existing.manifest.release.commit}${projection ? `; GitHub Release ${projection}` : ""}. ${mainStatus}\n`,
    );
    return;
  }
  const prepareManifest = (installationRoot = root) =>
    validateManifest(
      root,
      baseManifest(
        root,
        authority,
        latest,
        releaseEvidence(root, workOrderId, {
          liveInstance: true,
          installationRoot,
        }),
      ),
    );
  let manifest;
  if (dryRun) manifest = withPreviewRuntime(root, prepareManifest);
  else {
    assertReleaseRuntime(root);
    manifest = prepareManifest();
  }
  if (dryRun) {
    record.publication.outcome = "preview";
    writeOutput(
      `Dry run: would fast-forward main to ${head}, run surface checks, build missing or mismatched pinned runtime, validate this reviewer-gate manifest, ${publish ? "create and push the annotated tag and create the Release" : "prepare the release"}, then attempt worktree cleanup. No suite, install or CLI smoke runs.\n${JSON.stringify(manifest, null, 2)}\n`,
    );
    await finishPublishedWorktree(root, workOrderId, true, record, overrides);
    if (publish)
      await refreshPublishedStarters(
        root,
        head,
        authority.version,
        workOrderId,
        true,
        record,
      );
    return;
  }
  const humanLayer = releaseEdition(root, manifest);
  const message = tagMessage(root, manifest);
  if (!publish) {
    record.publication.outcome = "prepared";
    writeOutput(
      `Prepared and validated ${authority.version} for ${head}. To create and push only the annotated tag and create its matching GitHub Release, run:\n  ${releaseCloseCommand(root, workOrderId)}\n`,
    );
    return;
  }
  const tagObject = publishTag(
    root,
    authority.version,
    head,
    message,
    tagger,
    record.publication,
  );
  const projection = ensureGitHubRelease(
    root,
    repository,
    authority.version,
    projectedReleaseBody(authority.version, humanLayer),
    releaseTitle(authority.version, humanLayer),
  );
  record.publication.outcome = "published";
  record.publication.release = projection;
  ensureTrackedClean(root);
  await finishPublishedWorktree(root, workOrderId, false, record, overrides);
  await refreshPublishedStarters(
    root,
    head,
    authority.version,
    workOrderId,
    false,
    record,
  );
  writeOutput(
    `Published annotated ${authority.version} (${tagObject}) for ${head}; GitHub Release ${projection}. ${mainStatus}\n`,
  );
};

const requireLocalAnnotatedRelease = (root, tag) => {
  if (!semver(tag)) throw new Error(`invalid release tag: ${tag ?? "missing"}`);
  const local = localTags(root).get(tag);
  if (!local || local.objectType !== "tag")
    throw new Error(`local annotated release tag is unavailable: ${tag}`);
  return local;
};
const renderPublishedNotes = (tag) => {
  requireLocalAnnotatedRelease(toolRoot, tag);
  const annotation = tagAnnotation(toolRoot, tag);
  const humanLayer = humanLayerFromAnnotation(annotation);
  if (!isDotLnRelease(annotation, tag))
    throw new Error(`${tag} is not a DotLn release tag`);
  writeOutput(`${humanLayer}\n`);
};
const releaseWorkOrdersForRanges = (root, ranges) => {
  if (!ranges.length) return [];
  // Keep Git's exact reachability semantics for each range, but share its
  // commit/parent views across ranges and read release-note diffs in one batch.
  const parents = new Map();
  const commitsByRange = ranges.map(({ previous, release }) => {
    const output = runGit(root, [
      "rev-list",
      "--first-parent",
      "--reverse",
      "--parents",
      previous ? `${previous}..${release}` : release,
    ]);
    return output
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [commit, parent] = line.split(" ");
        parents.set(commit, parent);
        return commit;
      });
  });
  const revisions = [...new Set([...parents].flat().filter(Boolean))];
  const controls = new Map();
  // Bound temporary aggregate reads. A batch may exceed Git's output buffer
  // even when each accepted historical view fits, so retry those separately.
  for (let offset = 0; offset < revisions.length; offset += 16) {
    const batch = revisions.slice(offset, offset + 16);
    let views;
    try {
      views = readControls(root, batch);
    } catch {
      views = new Map(
        batch.map((revision) => [revision, readControl(root, revision)]),
      );
    }
    for (const [revision, control] of views) controls.set(revision, control);
  }
  const notes = new Map();
  if (parents.size) {
    const reviews = docRelative(root, "finalReviews");
    const pattern = new RegExp(
      `^${reviews.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/(WO-\\d{3})/RELEASE-NOTES\\.md$`,
    );
    const commits = [...parents];
    for (let offset = 0; offset < commits.length; offset += 16) {
      const batch = commits.slice(offset, offset + 16);
      let output;
      try {
        output = runGitPathList(
          root,
          [
            "diff-tree",
            "--stdin",
            "--root",
            "-r",
            "--no-renames",
            "--name-only",
            "-z",
            "--",
            reviews,
          ],
          {
            input:
              batch
                .map(([commit, parent]) =>
                  parent ? `${commit} ${parent}` : commit,
                )
                .join("\n") + "\n",
          },
        );
      } catch {
        // An aggregate diff can overflow while every individual diff fits.
        for (const [commit, parent] of batch)
          notes.set(
            commit,
            changedReleaseNotesAt(root, parent, commit).map(({ path }) => path),
          );
        continue;
      }
      let current;
      for (const entry of output) {
        if (parents.has(entry)) {
          current = [];
          notes.set(entry, current);
        } else if (pattern.test(entry)) {
          if (!current)
            throw new Error("release-note diff batch lacks a commit header");
          current.push(entry);
        }
      }
    }
    for (const [commit, paths] of notes)
      notes.set(
        commit,
        paths.sort().map((path) => pattern.exec(path)[1]),
      );
  }
  const empty = controlFromSources(new Map());
  const attributed = new Map(
    [...parents].map(([commit, parent]) => [
      commit,
      [
        ...addedSegmentEvents(
          parent ? controls.get(parent) : empty,
          controls.get(commit),
          `${parent ?? "the empty history"} and ${commit}`,
        )
          .filter(passedFinalReview)
          .map((event) => event.workOrderId),
        ...(notes.get(commit) ?? []),
      ],
    ]),
  );
  return commitsByRange.map((commits) => [
    ...new Set(commits.flatMap((commit) => attributed.get(commit))),
  ]);
};
// Each tag's derived record is cached by its immutable tag object: an
// unchanged tag costs no Git read, and only new or moved tags are read, in one
// batch (WO-164).
export const listPublishedReleases = (
  root = toolRoot,
  { cold = false } = {},
) => {
  const tags = localTags(root);
  const cache = cold
    ? { get: () => undefined, set: () => {}, save: () => {} }
    : releaseListCache(root);
  const candidates = [...tags.values()]
    .filter(({ name, objectType }) => semver(name) && objectType === "tag")
    .sort((left, right) => compareVersions(left.name, right.name));
  const annotations = releaseAnnotations(
    root,
    candidates.filter(({ name, object }) => !cache.get(name, object)),
  );
  const facts = new Map(
    candidates.map(({ name, object }) => {
      const cached = cache.get(name, object);
      if (cached) return [name, cached];
      const annotation = annotations.get(name);
      if (!isDotLnRelease(annotation, name))
        return [name, { object, dotln: false }];
      let manifest;
      try {
        manifest = manifestFromAnnotation(annotation, name);
      } catch {
        manifest = undefined;
      }
      // The attribution is used only when the range attributes nothing; a
      // manifest that cannot be read, or whose changed-file list is not a
      // list, attributes nothing and the row prints without attribution.
      const attribution = manifestWorkOrders(manifest, root);
      return [
        name,
        {
          object,
          dotln: true,
          // Kept as the text the row prints; a record whose previous release
          // is neither text nor null stays uncached (release-list-cache.mjs).
          application: `${manifest?.release?.application ?? name}`,
          previousRelease: manifest?.release?.previousRelease,
          manifestWorkOrders: attribution,
          between: null,
        },
      ];
    }),
  );
  const releases = candidates.filter(({ name }) => facts.get(name).dotln);
  const ranges = releases.map((item, index) => {
    const fact = facts.get(item.name);
    const previous = fact.previousRelease ?? releases[index - 1]?.name;
    // The range is reusable only while both ends name immutable tag objects;
    // tag names are read as tag refs, so the range and its key agree.
    const tagged = typeof previous === "string" && tags.has(previous);
    const bound =
      previous === undefined
        ? null
        : tagged
          ? tags.get(previous).object
          : undefined;
    const workOrders =
      bound !== undefined &&
      fact.between?.previous === (previous ?? null) &&
      fact.between.previousObject === bound
        ? fact.between.workOrders
        : undefined;
    return {
      item,
      fact,
      previous,
      bound,
      workOrders,
      range: {
        previous: tagged ? `refs/tags/${previous}` : previous,
        release: `refs/tags/${item.name}`,
      },
    };
  });
  const missing = ranges.filter(({ workOrders }) => workOrders === undefined);
  const derived = releaseWorkOrdersForRanges(
    root,
    missing.map(({ range }) => range),
  );
  missing.forEach((range, index) => {
    range.workOrders = derived[index];
  });
  const rows = ranges.map(
    ({ item, fact, previous, bound, workOrders: between }) => {
      cache.set(item.name, {
        ...fact,
        between:
          bound === undefined
            ? null
            : {
                previous: previous ?? null,
                previousObject: bound,
                workOrders: between,
              },
      });
      const workOrders = [...between];
      if (workOrders.length === 0) workOrders.push(...fact.manifestWorkOrders);
      if (workOrders.length === 0)
        workOrders.push(...historicalWorkOrders(root, item.name));
      return {
        tag: item.name,
        commit: item.target,
        application: fact.application,
        workOrders,
      };
    },
  );
  for (const { name } of candidates)
    if (!facts.get(name).dotln) cache.set(name, facts.get(name));
  cache.save();
  writeOutput("TAG\tCOMMIT\tAPPLICATION\tWORK ORDERS\n");
  for (const row of rows)
    writeOutput(
      `${row.tag}\t${row.commit}\t${row.application}\t${row.workOrders.join(",") || "none recorded"}\n`,
    );
};
const publishHistoricalNotes = (tag) => {
  if (!semver(tag)) throw new Error(`invalid release tag: ${tag ?? "missing"}`);
  const root = findMainWorktree(toolRoot);
  if (resolve(process.cwd()) !== root)
    throw new Error(
      `release publish-notes must run from the main control-plane checkout: ${root}`,
    );
  let local = localTags(root);
  const repository = resolveGitHubPushTarget(root);
  const remote = remoteTags(root);
  publishedTag(tag, local, remote);
  if (!local.has(tag)) {
    runGit(root, ["fetch", "origin", `refs/tags/${tag}:refs/tags/${tag}`]);
    local = localTags(root);
  }
  const localTag = local.get(tag);
  const remoteTag = remote.get(tag);
  if (
    localTag?.objectType !== "tag" ||
    localTag.object !== remoteTag?.object ||
    localTag.target !== remoteTag?.target
  )
    throw new Error(`${tag} differs between local and origin`);
  const annotation = tagAnnotation(root, tag);
  const humanLayer = humanLayerFromAnnotation(annotation);
  if (!isDotLnRelease(annotation, tag))
    throw new Error(`${tag} is not a DotLn release tag`);
  if (notesContractWasActive(root, tag))
    throw new Error(
      `${tag} is at or after WO-024's release-note contract and cannot be published as historical notes; recover its GitHub Release by rerunning the matching release close with --publish`,
    );
  ensureGhPreflight(root, repository);
  const projection = ensureGitHubRelease(
    root,
    repository,
    tag,
    backfillReleaseBody(tag, humanLayer),
    releaseTitle(tag, humanLayer),
  );
  writeOutput(
    `GitHub Release ${projection} for historical annotated ${tag}.\n`,
  );
};

const main = async () => {
  sourceRevision = "HEAD";
  previewRuntimeRoot = undefined;
  const [action, ...args] = process.argv.slice(2);
  if (action === "close") {
    const workOrderId = args[0];
    if (!/^WO-\d{3}$/u.test(workOrderId ?? ""))
      throw new Error(
        "usage: release close WO-NNN [--publish] [--dry-run] [--list-material] [--material <path>=disposable|preserve] [--confirm-terms sha256:<digest>]",
      );
    // The record exists before the flags are judged: a malformed word is
    // recorded as a refusal, never a silent exit. `--confirm-terms`, which
    // confirms the target Release text's review items, is read out first.
    const closeArgs = args.slice(1);
    let parsed, parseError;
    try {
      const confirmTerms = takeConfirmTerms(closeArgs);
      parsed = {
        ...parseMaterialFlags(closeArgs, [
          "--publish",
          "--dry-run",
          "--list-material",
        ]),
        confirmTerms,
      };
    } catch (error) {
      parseError = error;
      parsed = {
        flags: closeArgs.filter((arg) =>
          ["--publish", "--dry-run"].includes(arg),
        ),
        material: [],
      };
    }
    const root = findMainWorktree(toolRoot);
    return withHostLock(
      docPath(root, "control", "local/release-close-locks"),
      workOrderId,
      async () => {
        const recordPath = docRelative(
          root,
          "control",
          `local/retained/${workOrderId}/release-close.json`,
        );
        let harness = null;
        try {
          harness =
            (!process.env.CODEX_THREAD_ID &&
            !process.env.COPILOT_AGENT_SESSION_ID
              ? claudeSessionReport()
              : null
            )?.session ?? (await currentHarnessSessionReport(root)).session;
        } catch {
          // A command outside a known dispatch still records its unknown actor.
        }
        const record = {
          schemaVersion: 1,
          workOrderId,
          startedAt: new Date().toISOString(),
          steps: releaseSteps(),
          dryRun: parsed.flags.includes("--dry-run"),
          listMaterial: parsed.flags.includes("--list-material"),
          dispatch: {
            harness: harness?.harness ?? null,
            session:
              process.env.CODEX_THREAD_ID ||
              process.env.COPILOT_AGENT_SESSION_ID ||
              process.env.CLAUDE_CODE_SESSION_ID ||
              process.env.CLAUDE_SESSION_ID ||
              null,
            source: harness?.source ?? "unknown",
          },
          publication: {
            requested: parsed.flags.includes("--publish"),
            outcome: "not-started",
            tag: null,
            tagOutcome: null,
            release: null,
            refusal: null,
          },
          cleanup: { outcome: "not-attempted", worktrees: [] },
          starterRefresh: [],
          material: [],
          removals: [],
          overrides: parsed.material,
          blockers: [],
          previousAttempts: [],
          recordAdvisories: [],
          retryCommand: releaseCloseCommand(root, workOrderId),
          reportPath: docRelative(
            root,
            "control",
            `local/retained/${workOrderId}/release-close-${new Date().toISOString().replace(/[:.]/gu, "-")}.txt`,
          ),
        };
        closeTranscript = [];
        const recordAdvisory = (error) => {
          const message = `Close record unavailable: ${String(error.message).replace(/\s+/gu, " ").trim()}`;
          // The record is written twice; a failure the second write repeats
          // is reported once.
          if (record.recordAdvisories.includes(message)) return;
          record.recordAdvisories.push(message);
          process.stderr.write(`Advisory: ${message}\n`);
        };
        const writeCloseRecord = () => {
          try {
            requireMaterialContainment(root, recordPath);
            const file = join(root, recordPath);
            mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
            writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`, {
              mode: 0o600,
            });
          } catch (error) {
            recordAdvisory(error);
          }
        };
        try {
          const { recoveryAttempts, ...history } = readCloseHistory(
            root,
            workOrderId,
          );
          Object.assign(record, history);
          Object.defineProperty(record, "recoveryAttempts", {
            value: recoveryAttempts,
          });
        } catch (error) {
          recordAdvisory(error);
        }
        // A release-close dispatch keeps the writer through publication. Only a
        // successful, non-preview close is its completion and releases that actor.
        const completing =
          !parseError &&
          parsed.flags.includes("--publish") &&
          !parsed.flags.includes("--dry-run");
        let releaseWriter;
        try {
          if (parseError) throw parseError;
          if (record.historyFailure) throw new Error(record.historyFailure);
          const context = await withReleaseStep(record, "prerequisites", () =>
            closePrerequisites(root, workOrderId, parsed, record),
          );
          if (!context) return;
          await withReleaseStep(record, "runtime", () =>
            prepareRuntimeBeforeLoad(root),
          );
          if (completing) {
            const writerRoot = realpathSync(process.cwd());
            try {
              releaseWriter = await executorWriterRelease(writerRoot);
            } catch (error) {
              if (
                !existsSync(
                  join(
                    writerRoot,
                    "packages/skeleton/dist/src/harness-host.js",
                  ),
                )
              )
                throw new Error(
                  `Release-close runtime is not built in ${writerRoot}; writer reservation retained. Run ${isKitWorktree(writerRoot) ? "node scripts/bootstrap.mjs" : "npm run build"} in the main checkout, then retry release close.`,
                  { cause: error },
                );
              throw error;
            }
          }
          const result = await withReleaseStep(record, "publication", () =>
            close(root, workOrderId, parsed, record, context),
          );
          // Releasing the writer runs the session-end prune, so its time
          // belongs to the prune row.
          if (!process.exitCode && record.cleanup.outcome !== "blocked")
            await withReleaseStep(record, "prune", () => releaseWriter?.());
          return result;
        } catch (error) {
          const published = settlePublication(record, error.message);
          record.blockers.push({
            action: published ? "completion" : "publication",
            reason: error.message,
            command: releaseCloseCommand(root, workOrderId),
          });
          throw error;
        } finally {
          await withReleaseStep(record, "record", async () => {
            record.recordedAt = new Date().toISOString();
            try {
              requireMaterialContainment(root, record.reportPath);
              mkdirSync(dirname(join(root, record.reportPath)), {
                recursive: true,
                mode: 0o700,
              });
              writeFileSync(
                join(root, record.reportPath),
                closeTranscript.join(""),
                {
                  mode: 0o600,
                },
              );
            } catch (error) {
              recordAdvisory(error);
            }
            writeCloseRecord();
          });
          // Seal the completed timing row after the timed transcript/receipt write.
          record.recordedAt = new Date().toISOString();
          writeCloseRecord();
          process.stdout.write(releaseCloseSummary(record));
          closeTranscript = null;
        }
      },
    );
  }
  if (action === "prepare") {
    if (
      args.some((arg) => !["--local", "--integration"].includes(arg)) ||
      new Set(args).size !== args.length
    )
      throw new Error("usage: release prepare [--local] [--integration]");
    const localOnly = args.includes("--local");
    const state = parseControlState(toolRoot);
    // `worktree integrate` passes --integration while its integration
    // decision is still to be written; that decision records a collision, so
    // this command appends no second one (WO-086). Anywhere else the flag
    // would leave the collision unrecorded, so it needs that pending receipt.
    if (args.includes("--integration")) {
      let pendingIntegration;
      try {
        pendingIntegration = JSON.parse(
          readFileSync(
            docPath(toolRoot, "control", "local", "integration.json"),
            "utf8",
          ),
        );
      } catch {
        pendingIntegration = undefined;
      }
      if (
        pendingIntegration?.workOrder !== state.workOrderId ||
        pendingIntegration.complete !== false ||
        pendingIntegration.stage !== "applied"
      )
        throw new Error(
          `release prepare --integration is worktree integrate's and needs its pending integration of ${state.workOrderId ?? "the selected order"}; run npm run release -- prepare --local without it`,
        );
      const refusal = integrationPreparationRefusal(
        toolRoot,
        state.workOrderId,
        pendingIntegration,
      );
      if (refusal)
        throw new Error(
          `release prepare --integration refuses: ${refusal}; run npm run worktree -- integrate ${state.workOrderId} --continue. Nothing was written.`,
        );
    }
    if (state.repositoryId) {
      if (
        realpathSync(runGit(toolRoot, ["rev-parse", "--show-toplevel"])) !==
        realpathSync(toolRoot)
      )
        throw new Error("release prepare requires the Git root");
      if (
        runGit(toolRoot, ["branch", "--show-current"]) !==
        state.workOrderId.toLowerCase()
      )
        throw new Error(
          "release prepare requires the selected wo-NNN worktree",
        );
      if (
        ![
          "active",
          "ready-to-verify",
          "verifying",
          "needs-fix",
          "repairing",
          "verified",
          "final-review",
        ].includes(state.phase)
      )
        throw new Error(
          "release prepare requires an unpublished, open work order",
        );
      readWorkOrderAuthority(toolRoot, state, null, { versioned: false });
      writeOutput(
        `${state.workOrderId}: target order records no release; no files changed.\n`,
      );
      return;
    }
    const latest = latestVersion(
      localOnly ? ancestralLocalTags(toolRoot) : remoteTags(toolRoot),
    );
    const plan = planReleasePreparation(
      toolRoot,
      state,
      latest,
      new Date().toISOString().slice(0, 10),
      {
        integration: args.includes("--integration"),
        observation: localOnly
          ? "ancestral local release tags, excluding annotated starter refresh tags"
          : "origin tags",
      },
    );
    // The meter reads every decisions record; read it before any edit, so an
    // unreadable record refuses with nothing written (WO-086).
    const metering = existsSync(docPath(toolRoot, "control", "budgets.json"));
    const meterModule = metering ? await import("./lib/meta.mjs") : undefined;
    const meta = metering ? await meterModule.collectMeta(toolRoot) : undefined;
    const ancillary = [];
    let snapshotLine = "";
    if (metering) {
      const { renderMetaTable, writeOrderSnapshot } = meterModule;
      // The order's bounded meter snapshot, from the same collection, written
      // only where the order's session journals are.
      const snapshot = writeOrderSnapshot(toolRoot, meta, state.workOrderId);
      if (snapshot.written) ancillary.push(join(toolRoot, snapshot.path));
      snapshotLine = snapshot.reason
        ? `Meter snapshot not written: ${snapshot.reason}.\n`
        : `Meter snapshot: ${snapshot.path}, ${snapshot.bytes} bytes.\n`;
      const path = docPath(
        toolRoot,
        "finalReviews",
        state.workOrderId,
        "PR.md",
      );
      // Release preparation owns the meter, while the reviewer owns creation
      // of the PR draft. A meter snapshot never manufactures review prose.
      if (existsSync(path)) {
        const source = readFileSync(path, "utf8");
        const next = withMeterBlockLast(source, renderMetaTable(meta));
        if (next !== source) {
          writeFileSync(path, next);
          ancillary.push(path);
        }
      }
    }
    // Ancillary filesystem outputs must succeed before the target changes.
    // A failed output then leaves the original collision inputs for retry;
    // the plan's own writer restores any partial core edit (WO-086).
    const written = [...applyReleasePreparation(plan), ...ancillary];
    const outcome =
      plan.target === plan.previous
        ? `${state.workOrderId} target ${plan.target} remains current.${plan.edits.length ? " The README release block is rewritten as its generated line." : ""}`
        : plan.assigned
          ? `Assigned ${state.workOrderId}: ${plan.target}, the next ${plan.classification} above the observed release baseline ${plan.latest}.`
          : `Retimed ${state.workOrderId}: ${plan.previous} → ${plan.target} above the observed release baseline ${plan.latest}.`;
    writeOutput(
      `${outcome}\n${plan.decision ? `Recorded ${plan.decision} in ${relative(toolRoot, plan.edits.at(-1).path)}.\n` : ""}${written.length ? `Files changed:\n${written.map((path) => `  ${relative(toolRoot, path)}`).join("\n")}` : "no files changed."}\n${snapshotLine}Tag observation: ${localOnly ? "local snapshot only" : "origin"}.\n`,
    );
    // Integration stores this output as its release-outcome receipt; writing
    // guidance belongs to the operator's preparation command.
    if (!args.includes("--integration")) {
      const { writingGuidance } = await import("./lib/reader-profiles.mjs");
      writeOutput(`${writingGuidance("releaseNotes", toolRoot)}\n`);
    }
    return;
  }
  if (action === "sync-surfaces") {
    if (args.length) throw new Error("usage: release sync-surfaces");
    const state = parseControlState(toolRoot);
    const written = [];
    if (!state.repositoryId) {
      // Regenerate only the owned claim from its assigned authority. The
      // preparation planner still checks containment and protects authored
      // prose, but no tag observation can assign or retime a target here.
      const plan = planReleasePreparation(
        toolRoot,
        state,
        undefined,
        new Date().toISOString().slice(0, 10),
        { repairClaim: true },
      );
      written.push(...applyReleasePreparation(plan));
    }
    const history = writeReleaseHistory(toolRoot);
    if (history.changed) written.push(history.path);
    writeOutput(
      `Release surfaces synchronized from existing authority; ${written.length} file(s) changed.\n`,
    );
    return;
  }
  if (action === "check-surfaces") {
    const localOnly = args.includes("--local");
    const selection = args.filter((arg) => arg !== "--local");
    if (
      args.filter((arg) => arg === "--local").length > 1 ||
      selection.length > 2 ||
      (selection.length > 0 && selection[0] !== "--committed") ||
      (selection.length === 2 && !/^WO-\d{3}$/.test(selection[1]))
    )
      throw new Error(
        "usage: release check-surfaces [--local] [--committed [WO-NNN]]",
      );
    if (
      localOnly &&
      selection.length === 0 &&
      existsSync(join(toolRoot, "KIT-MANIFEST.json")) &&
      readControl(toolRoot).orders.size === 0
    ) {
      writeOutput(
        "release: no work order or release declared; release surfaces unavailable in this fresh instance\n",
      );
      return;
    }
    const result = checkSurfaces(toolRoot, {
      revision: selection.includes("--committed") ? sourceRevision : undefined,
      expectedWorkOrderId: selection[1],
      localOnly,
    });
    if (localOnly)
      writeOutput(
        "Tag observation: local ancestors of HEAD only; publication checks origin.\n",
      );
    writeOutput(result.report);
    if (!result.passed) process.exitCode = 1;
    return;
  }
  if (action === "validate") {
    const [path] = args;
    if (!path || args.length !== 1)
      throw new Error("usage: release validate <manifest.json>");
    validateManifest(toolRoot, readJsonFile(resolve(process.cwd(), path)));
    writeOutput(`Validated ${path}.\n`);
    return;
  }
  if (action === "manifest-from-tag") {
    const [tag] = args;
    if (!tag || args.length !== 1)
      throw new Error("usage: release manifest-from-tag vX.Y.Z");
    writeOutput(prettyJson(manifestFromTag(toolRoot, tag)));
    return;
  }
  if (action === "notes") {
    const [tag] = args;
    if (!tag || args.length !== 1)
      throw new Error("usage: release notes vX.Y.Z");
    return renderPublishedNotes(tag);
  }
  if (action === "list") {
    if (args.length === 0) return listPublishedReleases();
    // The roadmap's generated release history (WO-086). The default listing
    // above is unchanged; the console parses its bytes.
    if (args.length === 1 && args[0] === "--markdown") {
      writeOutput(
        `${renderReleaseHistory(toolRoot, localReleaseRecords(toolRoot))}\n`,
      );
      return;
    }
    if (
      args.length === 2 &&
      args[0] === "--markdown" &&
      args[1] === "--write"
    ) {
      const written = writeReleaseHistory(toolRoot);
      writeOutput(
        `${written.changed ? "Wrote" : "Unchanged"} ${written.path}: release history of ${written.tags} local annotated release tags.\n`,
      );
      return;
    }
    throw new Error("usage: release list [--markdown [--write]]");
  }
  if (action === "publish-notes") {
    const [tag] = args;
    if (!tag || args.length !== 1)
      throw new Error("usage: release publish-notes vX.Y.Z");
    return publishHistoricalNotes(tag);
  }
  throw new Error(
    "usage: release prepare [--local] [--integration] | release check-surfaces [--local] [--committed [WO-NNN]] | release sync-surfaces | release close WO-NNN [--publish] | release validate <manifest.json> | release manifest-from-tag vX.Y.Z | release notes vX.Y.Z | release list [--markdown [--write]] | release publish-notes vX.Y.Z",
  );
};

if (isMainModule(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    process.stderr.write(
      `error: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
