#!/usr/bin/env node
import { formatDuration } from "./lib/duration.mjs";
import { renderCriteriaStatus } from "./lib/criteria-status.mjs";
import { firstDifferingLine } from "./lib/validation.mjs";
import { json } from "./lib/helpers.mjs";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import {
  declaredCriteria,
  readPreflightSuites,
} from "./lib/handoff-ledger.mjs";
import { isMainModule } from "./lib/paths.mjs";
import {
  endedForTime,
  timeLimit,
  timeLimitMiss,
} from "../packages/skeleton/src/time-limits.mjs";
import { isCoreRoot } from "./lib/harness-runtime.mjs";
import {
  defaultDocRelative,
  docPath,
  docRelative,
  findLaunchpad,
  loadConfig,
  recordsStayInInstance,
} from "./lib/config.mjs";
import {
  existsSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, join, posix, sep } from "node:path";

import { DEFAULT_CONTROL_PATHS, controlPaths } from "./lib/control.mjs";
import { readControl, readControls } from "./lib/control-store.mjs";
import { renderAttestation } from "./lib/control-actor.mjs";
import {
  closedDependencySet,
  dependencyReleaseSet,
  historicalDependencyIds,
  inheritedLedgerDuty,
  parseDependencies,
  projectDependencies,
  umbrellaSuccessors,
  withdrawnDependencySet,
} from "./lib/dependencies.mjs";
import { runGit, primaryWorktree } from "./lib/git.mjs";
import { markdownListItems, parseMarkdown } from "./lib/markdown-links.mjs";
import {
  REVIEW_LADDERS,
  readWorkOrder,
  readWorkOrderHeader,
  reviewLadderLines,
} from "./lib/work-order-document.mjs";
import {
  containedRegularFile,
  workOrderAuthorityPath,
  workOrderAuthorityFiles,
} from "./lib/paths.mjs";
import {
  compareVersions,
  localReleaseRecords,
  localReleaseTags,
  semver,
  strictVersionsIn,
} from "./lib/release-records.mjs";
import {
  parseDerivedProvenance,
  allocationSections,
  checkGeneratedSections,
} from "./lib/derived-contract.mjs";
import { parseRepositoryDeclaration } from "./lib/work-order-repository.mjs";
import { recordedRepositoryClone } from "./lib/target-worktrees.mjs";
import {
  parseWorkstreamDeclaration,
  readWorkstreams,
  readWorkstreamObservations,
  projectWorkstreams,
  workstreamObservationsRecord,
  writeWorkstreamObservations,
} from "./lib/work-order-workstream.mjs";
import {
  readReleaseRecord,
  releaseHistoryRecord,
  writeReleaseRecord,
} from "./lib/release-history.mjs";

const toolRoot = findLaunchpad();
const indexPath = defaultDocRelative("workOrders", "README.md");
const planningPath = defaultDocRelative("planning", "sequence.md");
// The default-layout storage names the generated index cites when a caller
// hands it rows without the launchpad they were read from.
const DEFAULT_INDEX_PATHS = {
  legacy: DEFAULT_CONTROL_PATHS.legacy,
  orders: DEFAULT_CONTROL_PATHS.segment("WO-NNN"),
  legacyRelease: defaultDocRelative("releases", "v0.2.0.md"),
  releaseRecord: defaultDocRelative("control", "release-history.json"),
  observationsRecord: defaultDocRelative(
    "control",
    "workstream-observations.json",
  ),
};
// The command that writes the two records the pages' check reads.
const INDEX_COMMAND = "npm run work-orders -- index";
const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const INDEX_SECTIONS = ["Active", "Open"];
const HISTORY_SECTIONS = ["Closed", "Withdrawn", "Superseded", "Historical"];

// This is a tolerant view of existing prose, not another activation validator.
// Unknown fields are named alongside their source path in the rendered details.
export const parseHeader = (
  markdown,
  path,
  // `core`: whether the order is read in core's own root (the index says).
  { historicalIds, core = false } = {},
) => {
  // The header alone: the index reads every order's and none of their bodies.
  const order = readWorkOrderHeader(markdown);
  const title = order.title?.title || undefined;
  // A field the header writes once as `**Label:** value`, its continuation
  // lines joined; absent, repeated or empty reads as unknown, and an order
  // without a title has no header to read.
  const field = (label) => {
    if (!title) return undefined;
    const found = order
      .headerFields(label)
      .filter((field) => field.raw === `${label}:`);
    if (found.length !== 1) return undefined;
    return found[0].value.replace(/\s+/g, " ") || undefined;
  };
  const versions = strictVersionsIn(title ?? "");
  const version = !title
    ? "unknown"
    : title.endsWith("(version assigned at activation)")
      ? "unassigned"
      : versions.length === 1 && semver(versions[0])
        ? versions[0]
        : versions.length || /\bv\d/.test(title)
          ? "malformed"
          : "unassigned";
  const dependencies = parseDependencies(
    markdown,
    path,
    undefined,
    historicalIds,
  );
  return {
    path,
    title: title ?? "unknown",
    version,
    model: field("Model") ?? "unknown",
    effort: field("Effort") ?? "unknown",
    track: ["delivery", "machinery", "evidence"].includes(field("Track"))
      ? field("Track")
      : "unknown",
    cost: field("Cost") ?? "unavailable",
    // Every line that sizes the order's first review round, judged where
    // the order's section is known.
    reviewLadderLines: reviewLadderLines(markdown),
    repository: parseRepositoryDeclaration(markdown, path),
    workstream: parseWorkstreamDeclaration(markdown, path),
    provenance: parseDerivedProvenance(markdown, path),
    ledgerSubstitution: inheritedLedgerDuty(markdown, core),
    dependencies,
    // The umbrella class, read by the index and by activation (WO-190).
    umbrella: umbrellaSuccessors(markdown, dependencies),
  };
};

const readContained = (root, path) => {
  const file = join(root, path);
  if (!containedRegularFile(file, root))
    throw new Error(`${path}: expected a contained regular file`);
  return readFileSync(file, "utf8");
};

const SEQUENCE_START = "<!-- dotln-work-order-sequence:start -->";
const SEQUENCE_END = "<!-- dotln-work-order-sequence:end -->";
// One proposed entry: an order and its short label.
const SEQUENCE_ENTRY = /^(WO-\d{3}) — (\S(?:.*\S)?)$/u;

// Only this explicit operator-authored block selects the proposed order.
// References elsewhere in the map or a Depends on paragraph cannot select it.
// The block holds bulleted entries only; a blank line between two entries
// ends a group, and a group of two is a lane pair.
export const parseSequenceGroups = (markdown, source = planningPath) => {
  const tree = parseMarkdown(markdown);
  const markers = (marker) =>
    tree.children.filter(
      (node) => node.type === "html" && node.value.trim() === marker,
    );
  const starts = markers(SEQUENCE_START);
  const ends = markers(SEQUENCE_END);
  if (
    starts.length !== 1 ||
    ends.length !== 1 ||
    starts[0].position.start.offset >= ends[0].position.start.offset
  )
    throw new Error(`${source}: expected one marked proposed sequence`);
  const from = starts[0].position.end.offset;
  const to = ends[0].position.start.offset;
  const inside = ({ start, end }) => start >= from && end <= to;
  const malformed = () =>
    new Error(`${source}: expected '- WO-NNN — short label'`);
  if (
    tree.children.some(
      (node) =>
        inside({
          start: node.position.start.offset,
          end: node.position.end.offset,
        }) &&
        (node.type !== "list" || node.ordered),
    )
  )
    throw malformed();
  const seen = new Set();
  const groups = [];
  let previous;
  for (const item of markdownListItems(markdown, tree).filter(inside)) {
    const match = SEQUENCE_ENTRY.exec(item.text);
    if (!match) throw malformed();
    const [, id, label] = match;
    if (seen.has(id))
      throw new Error(`${source}: duplicate proposed order ${id}`);
    seen.add(id);
    if (
      !previous ||
      /\n[ \t]*\r?\n/u.test(markdown.slice(previous.end, item.start))
    )
      groups.push([]);
    groups.at(-1).push({ id, label });
    previous = item;
  }
  return groups;
};

export const parseSequence = (markdown, source = planningPath) =>
  parseSequenceGroups(markdown, source).flat();

/** Check current planning topology without changing historical receipt subjects. */
export const checkSequenceTopology = (
  { rows, sequence, groups },
  source = planningPath,
) => {
  const positions = new Map(sequence.map(({ id }, index) => [id, index]));
  const pairs = groups.filter((group) => group.length === 2);
  const failures = [];
  for (const { id, dependencies } of rows) {
    if (!positions.has(id)) continue;
    for (const edge of dependencies.blocking) {
      const target =
        edge.relation === "planning-deferral" ? edge.until : edge.workOrderId;
      // A withdrawn target is a settled entry, as a closed one is (WO-158):
      // the edge still refuses activation but orders nothing in the sequence.
      if (!positions.has(target) || edge.detail === "withdrawn") continue;
      const label = `${id} -> ${target} (${edge.relation})`;
      if (positions.get(id) < positions.get(target))
        failures.push(`${label}: dependency follows its dependent`);
      if (
        pairs.some(
          (pair) =>
            pair.some((row) => row.id === id) &&
            pair.some((row) => row.id === target),
        )
      )
        failures.push(`${label}: blocking edge inside a two-entry pair`);
    }
  }
  if (failures.length) throw new Error(`${source}: ${failures.join("; ")}`);
};

/**
 * Every open order has a place in the sequence (WO-190). An Open row that is
 * neither an umbrella record (listed under Superseded) nor a derived draft
 * (its place is its allocation, admitted by a resident outside the operator's
 * sequence; product 07 §Derived work and intent) or a separate workstream
 * member must appear in the marked sequence. Active orders are shown by the Now line and the Active cards
 * whether or not the sequence names them. Kept apart from
 * checkSequenceTopology, which historical planning receipts still judge.
 */
export const checkSequenceCoverage = (
  { rows, sequence },
  source = planningPath,
) => {
  const placed = new Set(sequence.map(({ id }) => id));
  const missing = rows
    .filter(
      (row) =>
        row.section === "Open" &&
        !row.provenance &&
        !row.separateWorkstream &&
        !placed.has(row.id),
    )
    .map((row) => row.id);
  if (missing.length)
    throw new Error(
      `${source}: open orders absent from the proposed sequence: ${missing.join(", ")}; add each to the marked sequence (an order superseded whole instead takes the **Umbrella record:** label in its leading header plus typed superseded entries; active orders and derived drafts are not judged)`,
    );
};

export const readIndex = (root, releases = localReleaseRecords(root)) => {
  const authorityRoot = docRelative(root, "workOrders");
  const planningSource = docRelative(root, "planning", "sequence.md");
  if (
    !realpathSync(join(root, authorityRoot)).startsWith(
      `${realpathSync(root)}${sep}`,
    )
  )
    throw new Error(
      `${authorityRoot}: directory must remain inside the repository`,
    );
  const control = readControl(root);
  const storage = controlPaths(root);
  const { orders, locations } = control;
  const tagLogs = readControls(
    root,
    releases.map(({ name }) => `refs/tags/${name}`),
  );
  releases = releases.map((release) => {
    const controlSegments = [
      ...tagLogs.get(`refs/tags/${release.name}`).sources.keys(),
    ];
    if (
      release.controlSegments !== undefined &&
      JSON.stringify(release.controlSegments) !==
        JSON.stringify(controlSegments)
    )
      throw new Error(
        `${release.name}: recorded control segment snapshot differs from tagged source`,
      );
    return { ...release, controlSegments };
  });
  const closed = closedDependencySet(control);
  const withdrawn = withdrawnDependencySet(control);
  let dependencyReleases;
  const commitLogs = new Map();
  const prefixMatches = (prior) =>
    [...prior.sources].every(([path, source]) =>
      control.sources.get(path)?.startsWith(source),
    );
  const closeTime = ({ closeOrdinal, closeRecordedAt }, segment) => {
    if (closeRecordedAt) return Date.parse(closeRecordedAt);
    // Legacy close times remain weaker first-commit observations. Ordinals
    // index their own segment; sibling merges cannot shift them.
    const commits = runGit(root, [
      "rev-list",
      "--reverse",
      "HEAD",
      "--",
      segment,
    ])
      .split("\n")
      .filter(Boolean);
    for (const commit of commits) {
      if (!commitLogs.has(commit))
        commitLogs.set(commit, readControl(root, commit));
      const prior = commitLogs.get(commit);
      const events = prior.eventSegments.get(segment) ?? [];
      const prefix = prior.sources
        .get(segment)
        ?.split("\n")
        .slice(0, closeOrdinal)
        .join("\n");
      if (
        events.length >= closeOrdinal &&
        control.sources.get(segment)?.startsWith(prefix)
      )
        return (
          Number(runGit(root, ["show", "-s", "--format=%ct", commit])) * 1000
        );
    }
    return undefined;
  };
  const beforeClose = (evidence, id) => {
    if (releases.length === 0) return undefined;
    const segment = locations.get(id);
    const cutoff = closeTime(evidence, segment);
    return releases
      .filter(({ name, taggedAt }) => {
        if (cutoff === undefined || taggedAt === undefined || taggedAt > cutoff)
          return false;
        const prior = tagLogs.get(`refs/tags/${name}`);
        return (
          (segment !== storage.legacy || prior.sources.has(segment)) &&
          (prior.eventSegments.get(segment)?.length ?? 0) <
            evidence.closeOrdinal &&
          prefixMatches(prior)
        );
      })
      .at(-1);
  };
  const ids = new Set();
  // Asked once, before any order's number is compared with one of core's.
  const core = isCoreRoot(root);
  // A registration that cannot be read says nothing of where records go.
  let registrations = {};
  try {
    registrations = loadConfig(root).repositories;
  } catch {
    registrations = {};
  }
  const rows = workOrderAuthorityFiles(root)
    .map((path) => {
      const id = /^(WO-\d{3})-/.exec(basename(path))?.[1];
      workOrderAuthorityPath(root, id, path);
      if (ids.has(id))
        throw new Error(`duplicate work-order id ${id}: ${path}`);
      ids.add(id);
      const source = readContained(root, path);
      const header = parseHeader(source, path, {
        historicalIds: historicalDependencyIds(root),
        core,
      });
      const evidence = orders.get(id);
      // A derived authority is judged by the section set its allocation was
      // written under (WO-157 item 14).
      if (header.provenance)
        checkGeneratedSections(
          source,
          path,
          evidence?.state.allocation
            ? allocationSections(evidence.state.allocation)
            : undefined,
          { historicalIds: historicalDependencyIds(root) },
        );
      if (evidence && evidence.state.workOrderPath !== path)
        throw new Error(`${id}: control authority path differs from ${path}`);
      const state = evidence?.state;
      if (
        state &&
        state.phase !== "none" &&
        (state.repositoryId !== header.repository?.id ||
          state.baseCommit !== header.repository?.baseCommit)
      )
        throw new Error(
          `${id}: control repository identity differs from ${path}`,
        );
      const historical = !state && historicalDependencyIds(root).has(id);
      if (
        state?.allocation &&
        JSON.stringify(state.provenance) !== JSON.stringify(header.provenance)
      )
        throw new Error(`${id}: control provenance differs from ${path}`);
      // An order whose allocation no longer folds stays visible (WO-157).
      const unreadable = control.unreadable?.has(id);
      const active =
        unreadable ||
        (state && !["closed", "none", "withdrawn"].includes(state.phase));
      // An umbrella record with no lifecycle of its own is settled as
      // superseded; recorded control state, when any exists, wins (WO-190).
      const umbrella =
        !active && !historical && (!state || state.phase === "none")
          ? header.umbrella
          : null;
      const phase = unreadable
        ? "unreadable"
        : state?.phase && state.phase !== "none"
          ? state.phase
          : historical
            ? "historical (time-indexed)"
            : umbrella
              ? "superseded"
              : "draft";
      const section = active
        ? "Active"
        : phase === "closed"
          ? "Closed"
          : phase === "withdrawn"
            ? "Withdrawn"
            : historical
              ? "Historical"
              : umbrella
                ? "Superseded"
                : "Open";
      const dependencies = projectDependencies(
        header.dependencies,
        closed,
        header.dependencies.entries.some(
          (entry) => entry.relation === "satisfied-by-release",
        )
          ? (dependencyReleases ??= dependencyReleaseSet(root))
          : new Set(),
        withdrawn,
      );
      // A conservative token view never decides activation, and a settled
      // order has none to decide; otherwise the typed blocking entries do.
      const conservative = dependencies.source === "conservative-tokens";
      const settled = HISTORY_SECTIONS.includes(section);
      const dependencyStatus =
        conservative || settled
          ? "unknown"
          : dependencies.blocking.length
            ? "blocked"
            : "ready";
      // An open order's ladder line is one of the three sizes, written
      // once; a settled order keeps whatever it closed with.
      if (!settled) {
        const [first, repeated] = header.reviewLadderLines;
        if (repeated)
          throw new Error(
            `${path}:${repeated.line}: ${id} repeats its **Review ladder:** line; an open order declares one of ${REVIEW_LADDERS.join(", ")} once, or no line for the full ladder`,
          );
        if (first && !REVIEW_LADDERS.includes(first.value))
          throw new Error(
            `${path}:${first.line}: ${id} declares **Review ladder:** ${first.value || "with no value"}; an open order declares one of ${REVIEW_LADDERS.join(", ")}, or no line for the full ladder`,
          );
      }
      const dependencyState = conservative
        ? "conservative token view; does not block"
        : settled
          ? "typed; activation not applicable"
          : dependencyStatus === "blocked"
            ? `typed; blocked on ${dependencies.blocking.map((entry) => entry.workOrderId).join(", ")}`
            : "typed; dependency-ready";
      const release = releases.find(({ workOrders }) =>
        workOrders.includes(id),
      );
      let disposition = release
        ? `${release.name} (${release.historical ? "historical record" : release.manifest.workOrder.id === id ? "manifest workOrder.id" : "manifest changedFiles"})`
        : "none recorded";
      if (phase === "closed" && !release) {
        const prior = beforeClose(evidence, id);
        disposition =
          prior &&
          semver(header.version) &&
          compareVersions(header.version, prior.name) < 0
            ? `no-release close (inferred: ${header.version} below ${prior.name} before close)`
            : "unreleased";
      }
      return {
        id,
        ...header,
        // Two of core's orders publish only to a deliverable-ready target.
        deliveryGated: core && DELIVERY_GATED.includes(id),
        umbrella,
        authorityLink: posix.relative(authorityRoot, path),
        hasDecisions: existsSync(
          join(root, docRelative(root, "evidence", `${id}/decisions.md`)),
        ),
        records: state?.targetRecords,
        // A closed target order with no records binding whose repository
        // keeps records in the instance: its records are here.
        recordsInInstance:
          phase === "closed" &&
          state?.repositoryId !== undefined &&
          recordsStayInInstance(registrations[state.repositoryId], state),
        section,
        phase,
        dependencies,
        dependencyState,
        dependencyStatus,
        state,
        repository:
          state?.repositoryId === undefined
            ? header.repository
            : { id: state.repositoryId, baseCommit: state.baseCommit },
        finalReviewVerdict: evidence?.finalReviewVerdict,
        disposition,
        // The declared size of round one, shown on an open order's card.
        reviewLadder: settled ? undefined : header.reviewLadderLines[0]?.value,
      };
    })
    .sort((left, right) => compare(left.id, right.id));
  for (const [id, { state }] of orders)
    if (!ids.has(id))
      throw new Error(
        `${id}: control authority is missing from the catalog: ${state.workOrderPath}`,
      );
  const groups = parseSequenceGroups(
    readContained(
      root,
      existsSync(join(root, planningSource))
        ? planningSource
        : docRelative(root, "planning", "work-order-map.md"),
    ),
    planningSource,
  );
  const sequence = groups.flat();
  for (const { id } of sequence)
    if (!ids.has(id))
      throw new Error(`${planningSource}: unknown proposed order ${id}`);
  // The rows stay in identifier order for every reader; each row carries its
  // place in the sequence (or null), which the index page orders Open cards by.
  const positions = new Map(sequence.map(({ id }, index) => [id, index]));
  const workstreamDocuments = readWorkstreams(root, rows);
  // A closed order predating the field gets its grouping from the validated
  // document. Keep its authority bytes intact and include it in Git facts.
  const membership = new Map(
    workstreamDocuments.flatMap((stream) =>
      stream.members.map((member) => [member.workOrderId, stream.id]),
    ),
  );
  const separate = new Set(
    workstreamDocuments
      .filter((stream) => stream.track === "separate")
      .map((stream) => stream.id),
  );
  for (const row of rows) {
    row.workstream ??= membership.get(row.id);
    row.separateWorkstream = separate.has(row.workstream);
    row.position = row.separateWorkstream
      ? null
      : (positions.get(row.id) ?? null);
  }
  return {
    rows,
    workstreamDocuments,
    releases,
    sequence,
    groups,
    paths: {
      legacy: storage.legacy,
      orders: storage.segment("WO-NNN"),
      legacyRelease: docRelative(root, "releases", "v0.2.0.md"),
      releaseRecord: releaseHistoryRecord(root),
      observationsRecord: workstreamObservationsRecord(root),
      ...(!existsSync(docPath(root, "planning", "work-order-map.md"))
        ? {
            sequenceLink: posix.relative(
              docRelative(root, "workOrders"),
              planningSource,
            ),
          }
        : {}),
    },
  };
};

/** Host observations belong only to explicit index generation. Check and
 * planning readers use the committed observation and never open targets. */
export const readTargetFacts = (root, rows) => {
  const config = loadConfig(root);
  const facts = new Map();
  const git = (clone, args) =>
    runGit(clone, ["--no-replace-objects", ...args], {
      raw: true,
      encoding: "utf8",
      timeout: 10_000,
    });
  const commit = (clone, revision) => {
    const result = git(clone, [
      "rev-parse",
      "--verify",
      `${revision}^{commit}`,
    ]);
    const value = result.stdout?.trim();
    return result.status === 0 && /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u.test(value)
      ? value
      : "unknown";
  };
  for (const row of rows.filter((row) => row.workstream)) {
    let base = row.repository?.baseCommit ?? "unknown";
    let targetCommit = "unknown";
    let integration = "unknown";
    try {
      const id = row.repository?.id ?? "self";
      const repository =
        id === "self" ? { baseBranch: "main" } : config.repositories[id];
      const clone =
        id === "self"
          ? root
          : (recordedRepositoryClone(root, id) ??
            recordedRepositoryClone(primaryWorktree(root), id));
      if (repository && clone) {
        targetCommit = commit(clone, `refs/heads/${repository.baseBranch}`);
        if (id === "self") base = targetCommit;
        if (base !== "unknown" && targetCommit !== "unknown") {
          if (base === targetCommit) integration = "current";
          else {
            const ancestor = git(clone, [
              "merge-base",
              "--is-ancestor",
              base,
              targetCommit,
            ]);
            integration =
              ancestor.status === 0
                ? "behind"
                : ancestor.status === 1
                  ? "diverged"
                  : "unknown";
          }
        }
      }
    } catch {
      // Missing clone maps, checkouts or Git objects are unobserved facts.
    }
    facts.set(`${row.workstream}/${row.id}`, {
      base,
      targetCommit,
      integration,
      stale:
        integration === "unknown"
          ? "unknown"
          : integration === "current"
            ? "no"
            : "yes",
    });
  }
  return facts;
};

const cell = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("|", "&#124;")
    .replaceAll("\\", "&#92;")
    .replaceAll("`", "&#96;")
    .replaceAll("[", "&#91;")
    .replaceAll("]", "&#93;")
    .replace(/\s+/g, " ")
    .trim();
// A value as a reader sees it: the same spacing the page gives it, unescaped.
const plain = (value) => String(value).replace(/\s+/g, " ").trim();
const destination = (path) => path.split("/").map(encodeURIComponent).join("/");
const link = (label, path) => `[${cell(label)}](${destination(path)})`;
const definition = (row) =>
  `[${row.id}]: ${destination(row.authorityLink ?? basename(row.path))}`;

// A card field is built once from parts and rendered twice: as the page's
// Markdown and as the text and links its observation records, so the two
// cannot disagree. A string is a fixed phrase, the same in both; written text
// is escaped on the page and recorded as written; a code span is recorded
// without its marks; a link is recorded by its label and its destination.
const written = (value) => ({ written: value });
const code = (value) => ({ code: value });
const linked = (label, path) => ({ label, path });
const part = (value) => (typeof value === "string" ? { fixed: value } : value);
const pageText = (parts) =>
  parts
    .map(part)
    .map((value) =>
      value.fixed !== undefined
        ? value.fixed
        : value.code !== undefined
          ? `\`${value.code}\``
          : value.path !== undefined
            ? link(value.label, value.path)
            : cell(value.written),
    )
    .join("");
const readerText = (parts) =>
  parts
    .map(part)
    .map(
      (value) =>
        value.fixed ??
        value.code ??
        plain(value.path !== undefined ? value.label : value.written),
    )
    .join("");
const destinations = (parts) =>
  parts
    .map(part)
    .filter((value) => value.path !== undefined)
    .map((value) => destination(value.path));
const field = (label, ...value) => ({
  label: Array.isArray(label) ? label : [label],
  value,
});

const report = (id, verdict, path) =>
  id
    ? [
        path && verdict ? linked(id, `../../${path}`) : written(id),
        " (",
        written(verdict ?? "pending"),
        ")",
      ]
    : ["none recorded"];
const references = (row) =>
  row.dependencies.entries
    .map(
      (entry) =>
        `${entry.workOrderId}: ${entry.relation ? `${entry.relation} (${entry.state}${entry.detail ? `: ${entry.detail}` : ""})` : `${entry.state}${entry.detail ? `: ${entry.detail}` : ""}`}${entry.release ? ` ${entry.release}` : ""}${entry.until ? ` until ${entry.until}` : ""}${entry.by ? ` by ${entry.by}` : ""}${entry.date ? ` dated ${entry.date}` : ""}${entry.reason ? ` — ${entry.reason}` : ""}`,
    )
    .join("; ") || "none declared";

// Open cards follow the sequence; a row without a place (a derived draft)
// comes after them in identifier order. Every other section keeps id order.
const sectionRows = (rows, section) =>
  rows
    .filter((row) => row.section === section)
    .sort((left, right) =>
      section === "Open"
        ? compare(left.position ?? Infinity, right.position ?? Infinity) ||
          compare(left.id, right.id)
        : compare(left.id, right.id),
    );

// The orders whose publication waits for a deliverable-ready target.
const DELIVERY_GATED = ["WO-112", "WO-118"];

// The order's off-ramp events, shown only when recorded (WO-158).
const offRampFields = (state) => [
  ...(state?.boundAcceptances?.length
    ? [
        field(
          "Bound acceptances",
          written(
            state.boundAcceptances
              .map(
                (row) =>
                  `${row.phase} ${row.metric}=${row.ceiling === null ? "as needed" : row.metric === "wallClockMs" ? formatDuration(row.ceiling) : row.ceiling} by ordinal ${row.ordinal}`,
              )
              .join("; "),
          ),
          ".",
        ),
      ]
    : []),
  ...(state?.withdrawal
    ? [
        field(
          "Withdrawal",
          written(
            `${state.withdrawal.disposition} at ordinal ${state.withdrawal.ordinal} — ${state.withdrawal.reason}`,
          ),
          ".",
        ),
      ]
    : []),
  ...(state?.waivedCriteria?.length
    ? [
        field(
          "Waived criteria",
          written(
            state.waivedCriteria
              .map(
                (waiver) =>
                  `${waiver.criterionId} by ordinal ${waiver.ordinal}`,
              )
              .join(", "),
          ),
          ".",
        ),
      ]
    : []),
  ...(state?.defectiveCriteria?.length
    ? [
        field(
          "Defective criteria",
          written(
            state.defectiveCriteria
              .map(
                (record) =>
                  `${record.criterionId} (${record.class}) by ordinal ${record.ordinal}`,
              )
              .join(", "),
          ),
          ".",
        ),
      ]
    : []),
  ...(state?.retractedOffRamps?.length
    ? [
        field(
          "Retracted off-ramps",
          written(
            state.retractedOffRamps
              .map(
                (row) =>
                  `ordinal ${row.ordinal} retracts ordinal ${row.subject.ordinal} (criterion ${row.subject.criterionId})`,
              )
              .join("; "),
          ),
          ".",
        ),
      ]
    : []),
  ...(state?.reopenedHandoffs?.length
    ? [
        field(
          "Reopened handoffs",
          written(
            state.reopenedHandoffs
              .map(
                (row) =>
                  `ordinal ${row.ordinal} reopens ordinal ${row.handoff.ordinal}`,
              )
              .join(", "),
          ),
          ".",
        ),
      ]
    : []),
  ...(state?.corrections?.length
    ? [
        field(
          "Record corrections",
          written(
            state.corrections
              .map(
                (correction) =>
                  `ordinal ${correction.ordinal} corrects ordinal ${correction.subject.ordinal} (${Object.keys(correction.fields).join(", ")})`,
              )
              .join("; "),
          ),
          ".",
        ),
      ]
    : []),
  ...(state?.overrideRecords?.length
    ? [
        field(
          "Override records",
          written(
            state.overrideRecords
              .map((record) => `ordinal ${record.ordinal}`)
              .join(", "),
          ),
          ".",
        ),
      ]
    : []),
];

// The criteria the executor left unmet, each by its later judgment with the
// executor's ordinal beside it; absent when the handoff left none. The status
// line names its own label before its first colon.
const criteriaFields = (state) => {
  const status = renderCriteriaStatus(state);
  if (!status) return [];
  const colon = status.indexOf(": ");
  return [field(status.slice(0, colon), written(status.slice(colon + 2)), ".")];
};

// The card fields, in the order the page shows them.
const cardFields = (row) => {
  const state = row.state;
  return [
    field("State", written(row.phase), "."),
    ...offRampFields(state),
    ...(row.provenance
      ? [field("Provenance", written(JSON.stringify(row.provenance)), ".")]
      : []),
    ...(row.repository
      ? [
          field(
            "Repository",
            written(row.repository.id),
            " @ ",
            written(row.repository.baseCommit),
            ".",
          ),
        ]
      : []),
    field("Application target", written(row.version), "."),
    field("Dependencies", written(row.dependencyState), "."),
    field("References", written(references(row)), "."),
    field(
      "Verification",
      ...report(
        state?.latestVerificationId,
        state?.latestVerdict,
        row.records ? undefined : state?.latestVerificationPath,
      ),
      ".",
    ),
    field(
      "Final review",
      ...report(
        state?.finalReviewId,
        row.finalReviewVerdict,
        row.records ? undefined : state?.finalReviewPath,
      ),
      ".",
    ),
    ...criteriaFields(state),
    ...(row.records
      ? [
          field(
            "Records",
            written(row.records.repositoryId),
            " at commit ",
            written(row.records.commit),
            ".",
          ),
          ...row.records.records.map((record, index) =>
            field(
              ["Record ", written(record.kind), ` ${index + 1}`],
              written(record.path),
              " (",
              written(record.sha256),
              ").",
            ),
          ),
        ]
      : row.recordsInInstance
        ? [
            field(
              "Records",
              "in this instance (",
              code(`repositories.${row.repository.id}.records`),
              " is ",
              code("instance"),
              ").",
            ),
          ]
        : []),
    field("Release", written(row.disposition), "."),
    field("Model", written(row.model)),
    field("Effort", written(row.effort)),
    field("Track", written(row.track ?? "unknown")),
    ...(row.reviewLadder
      ? [field("Review ladder", written(row.reviewLadder))]
      : []),
    ...(row.deliveryGated
      ? [
          field(
            "Delivery",
            "target publication requires ",
            code(
              "worktree publish WO-NNN --target <request> --require-deliverable-ready",
            ),
            " (WO-182); record every absent item before retrying.",
          ),
        ]
      : []),
    ...(row.ledgerSubstitution && !row.records
      ? [
          field(
            "Inherited ledger duty",
            "discharge with ",
            row.hasDecisions
              ? linked(
                  "this order's decisions",
                  `../evidence/${row.id}/decisions.md`,
                )
              : "this order's decisions file when recorded",
            " and its row in ",
            linked("the decisions index", "../lineage/decisions-index.md"),
            "; no lifecycle ledger append.",
          ),
        ]
      : []),
    ...(state?.latestAttestation
      ? [
          field(
            "Latest attestation",
            written(renderAttestation(state.latestAttestation)),
            ".",
          ),
        ]
      : []),
    field(
      "Authority",
      linked(row.path, row.authorityLink ?? basename(row.path)),
    ),
  ];
};

// The latest verification's verdict as a lifecycle reader takes it.
const verificationVerdict = (state) =>
  state?.latestVerificationId && ["pass", "fail"].includes(state.latestVerdict)
    ? state.latestVerdict
    : null;

// One card: its Markdown lines, and its record with the line its heading
// takes on the page, `start` lines from the top.
const renderCard = (row, start) => {
  const fields = cardFields(row);
  return {
    lines: [
      `### ${row.id}`,
      "",
      link(row.title, row.authorityLink ?? basename(row.path)),
      "",
      ...fields.map(
        ({ label, value }) => `- ${pageText(label)}: ${pageText(value)}`,
      ),
      "",
    ],
    record: {
      id: row.id,
      line: start + 1,
      section: row.section,
      title: plain(row.title),
      phase: row.phase,
      dependency: row.dependencyStatus,
      verdict: verificationVerdict(row.state),
      fields: Object.fromEntries(
        fields.map(({ label, value }) => [
          readerText(label),
          readerText(value),
        ]),
      ),
      links: fields.flatMap(({ value }) => destinations(value)),
    },
  };
};

/** The sections each page holds: the work ahead on the index page and every
 * settled order on the history page; every order is in exactly one. */
export const PAGE_SECTIONS = Object.freeze({
  index: INDEX_SECTIONS,
  history: HISTORY_SECTIONS,
});

/** The cards one page holds, in the order it shows them. */
export const pageCards = (rows, page) =>
  PAGE_SECTIONS[page].flatMap((section) => sectionRows(rows, section));

const renderSection = (lines, cards, rows, section) => {
  lines.push(`## ${section}`, "");
  const selected = sectionRows(rows, section);
  if (selected.length === 0) {
    lines.push("None.", "");
    return;
  }
  // The successors an umbrella record names, as the typed entries name them.
  if (section === "Superseded") {
    for (const row of selected)
      lines.push(
        `- [${row.id}] — superseded by ${row.umbrella.successors.join(", ")}`,
      );
    lines.push("");
  }
  for (const row of selected) {
    const card = renderCard(row, lines.length);
    lines.push(...card.lines);
    cards.push(card.record);
  }
};

// A page's sections; the records of the cards they hold.
const renderSections = (lines, rows, page) => {
  const cards = [];
  for (const section of PAGE_SECTIONS[page])
    renderSection(lines, cards, rows, section);
  return cards;
};

// The index page and the records of its cards.
const indexPage = ({ rows, sequence, groups = [], workstreams = [] }) => {
  const byId = new Map(rows.map((row) => [row.id, row]));
  sequence = sequence.filter(({ id }) => !byId.get(id)?.separateWorkstream);
  groups = groups.map((group) =>
    group.filter(({ id }) => !byId.get(id)?.separateWorkstream),
  );
  const active = sectionRows(rows, "Active");
  const pairOf = new Map();
  let pairs = 0;
  for (const group of groups)
    if (group.length === 2) {
      pairs += 1;
      for (const { id } of group) pairOf.set(id, pairs);
    }
  const lines = [
    "# Work orders",
    "",
    active.length
      ? `**Now:** ${active.map((row) => `[${row.id}] — ${cell(row.phase)}`).join("; ")}.`
      : "**Now:** between work orders.",
    "",
    "## Proposed order",
    "",
  ];
  for (const { id, label } of sequence) {
    const row = byId.get(id);
    // Withdrawn entries are settled but unchecked: a check means a pass.
    const done = row.section === "Closed";
    const status = done
      ? "final-reviewed"
      : row.section === "Withdrawn"
        ? `withdrawn: ${row.state.withdrawal?.disposition ?? "unknown"}`
        : row.section === "Active"
          ? row.phase
          : row.section === "Historical"
            ? "historical"
            : row.section === "Superseded"
              ? "superseded"
              : "queued";
    const pair = pairOf.get(id);
    lines.push(
      `- [${done ? "x" : " "}] [${id}] — ${cell(label)} · **${cell(status)}**${pair ? ` · pair ${pair}` : ""}`,
    );
  }
  if (sequence.length === 0) lines.push("No proposed sequence recorded.");
  lines.push(
    "",
    "Order and short labels come from [the proposed sequence](../planning/sequence.md); rows sharing a `pair N` mark are a lane pair, two parallel worktrees, and unmarked rows run one at a time.",
    "Checks mean passing final review. Settled orders (closed, withdrawn, superseded and historical), this index's sources and limits and its release-tag record are on [the history page](HISTORY.md).",
    "The sequence is a recommendation. For the selected order's legal action, use `npm run resume -- status`.",
    "",
    "This file is generated by `npm run work-orders -- index`; actors refresh it at dispatch and outcome.",
    "Edit sequence.md's marked sequence to change the plan; do not cross off entries here.",
    "`npm run work-orders -- index --check` detects changed headers, control state, proposed sequence or recorded observations on either page. Separate workstream members have their place in the grouping; other open orders need a sequence entry unless they are derived drafts.",
    "",
    "Full evidence for the active and sequenced orders follows; the Open cards are in sequence order.",
    "",
  );
  lines.push("## Workstreams", "");
  if (!workstreams.length) lines.push("None.", "");
  for (const stream of workstreams) {
    lines.push(`### ${stream.id}`, "");
    if (stream.track === "separate")
      lines.push("Separate track; outside the proposed serial order.", "");
    for (const member of stream.members)
      lines.push(
        `- [${member.workOrderId}] — repository: ${cell(member.repository)}; base: ${cell(member.base)}; phase: ${cell(member.phase)}; verdict: ${cell(member.verdict)}; integration: ${cell(member.integration)}; stale: ${cell(member.stale)}; observed target: ${cell(member.targetCommit)}.`,
      );
    lines.push("");
  }
  const cards = renderSections(lines, rows, "index");
  // Only the references this page uses: the Now line and the sequence rows.
  const referenced = new Set([
    ...active.map((row) => row.id),
    ...sequence.map(({ id }) => id),
    ...workstreams.flatMap((stream) =>
      stream.members.map((member) => member.workOrderId),
    ),
  ]);
  for (const row of rows)
    if (referenced.has(row.id)) lines.push(definition(row));
  return { text: `${lines.join("\n").trimEnd()}\n`, cards };
};

/** The index page: the active line, the sequence with its lane pairs, and
 * the Active and Open cards. */
export const renderIndex = (index) => indexPage(index).text;

// The history page and the records of its cards.
const historyPage = ({ rows, releases, paths = DEFAULT_INDEX_PATHS }) => {
  const lines = [
    "# Work-order history",
    "",
    "Settled orders: closed, withdrawn, superseded and historical, with the sources and limits of the generated index and its release-tag record. The work ahead, the active and sequenced orders, is on [the index](README.md).",
    "",
    "This file is generated by `npm run work-orders -- index` beside the index; `npm run work-orders -- index --check` judges both pages and names the stale one.",
    "",
  ];
  const cards = renderSections(lines, rows, "history");
  lines.push(...renderSources(releases, paths));
  // Only the references this page uses: the Superseded summary rows.
  for (const row of sectionRows(rows, "Superseded"))
    lines.push(definition(row));
  return { text: `${lines.join("\n").trimEnd()}\n`, cards };
};

/** The history page: every settled card, the sources and limits of the
 * generated index and its release-tag record. */
export const renderHistory = (index) => historyPage(index).text;

/** What the two pages show, as data: each page's cards, each with the line of
 * its heading on that page; the workstream members with the Git facts the
 * last refresh observed; and the release tags that refresh attributed. It is
 * this command's own output (`index --json`) and is never committed: a reader
 * that needs the cards, the resident's launcher or the console's collector,
 * takes them from here and never from a page. */
export const renderRecord = (index) =>
  json({
    schemaVersion: 1,
    index: { cards: indexPage(index).cards },
    history: { cards: historyPage(index).cards },
    workstreams: index.workstreams ?? [],
    releaseTags: index.releases.map(({ name, object, controlSegments }) => ({
      name,
      object,
      controlSegments,
    })),
  });

const renderSources = (releases, paths) => {
  const lines = [
    "## Sources and limits",
    "",
    `- **Two pages (WO-190):** \`README.md\` holds the active line, the proposed sequence with its lane pairs and the Active and Open cards, the Open cards in sequence order; this page holds every settled card (Closed, Withdrawn, Superseded, Historical), these sources and limits and the release tags used. The cards are data only in this command's own output, \`npm run work-orders -- index --json\`; no file records them. What the pages were rendered from that no file of this repository holds is recorded by the refresh: the release tags in \`${paths.releaseRecord}\` and each workstream member's target facts in \`${paths.observationsRecord}\`. Every order file appears on exactly one page. \`index --check\` judges both pages and the record, names the stale one, and refuses an open order that has no place in the sequence unless it is an umbrella record, a derived draft whose place is its allocation, or a member placed in a separate workstream.`,
    `- **Header observation:** each authority's H1, sole strict application version, Model, Effort, optional Track (delivery, machinery or evidence; absent or invalid is unknown), Repository, Workstream and leading typed dependency block (or legacy Depends on paragraph). Invalid typed declarations refuse with the authority path and offending entry; other unknown metadata is attributed by the Authority link. Workstream documents mirror the leading fields. \`${paths.observationsRecord}\` records each member's base, target commit and integration as the last refresh observed them; check reuses those observations without opening targets, and fails naming this command when the record is missing. Refresh with index to observe moved targets. Integration compares the declared base (self uses the launchpad HEAD observed at refresh) with the target's configured base branch (self uses main): current, behind, diverged or unknown; stale is yes, no or unknown. A separate track is omitted from the serial sequence; its complete Open cards follow sequenced cards in identifier order.`,
    "- **Proposed sequence:** the marked block in planning/sequence.md, in operator-selected order; two entries between blank lines are a lane pair. Historical fixtures without that file use the map. Missing/malformed blocks, duplicate IDs, and IDs without an authority refuse. This is not a scheduler or proof of dependency eligibility.",
    `- **Control evidence:** the shared fold of legacy \`${paths.legacy}\` plus \`${paths.orders}\`, reduced independently per work order in segment append order. Closed means a passing final review; it does not independently prove merge or publication. A withdrawn order is listed under Withdrawn on this page with its recorded disposition, unchecked in the proposed order, and never counts as a pass. Report verdicts come from events, not inferred report contents.`,
    "- **Superseded:** an umbrella record is an order superseded whole: the `**Umbrella record:**` label in its leading header plus typed superseded entries. It is listed under Superseded with the successors those entries name, `resume activate` refuses it naming them, and no control event records it (WO-190). Recorded control state, when any exists, wins.",
    `- **Local release evidence:** the earliest numeric annotated DotLn tag whose manifest names the order or a changed final-review path. The manifest-free v0.2.0 exception uses \`${paths.legacyRelease}\`. Other tags are not release evidence. Remote publication is not checked.`,
    "- **Derived dependency status:** the authority's typed block is projected by scripts/lib/dependencies.mjs, also used by status --json and activation. Hard and satisfied-by-close entries require control closure with a passing final-review verdict; an entry over a withdrawn order reads unmet: withdrawn. Satisfied-by-release requires the named local annotated DotLn release in HEAD's ancestry. Planning-deferral waits for its named order's closure or remains unmet for a candidate label; a dated waiver replaces it. Historical evidence, references, waivers and supersessions never block. Without a typed block, distinct Depends on tokens retain a labeled conservative view and never block activation. Closed and historical rows do not imply reactivation work.",
    "- **Inferred no-release close:** only an unmatched closed order with a strict H1 version below a local release whose per-segment tagged control prefix precedes its close and whose tag time is no later than the close observation. That observation is recordedAt, or the first committed close prefix for legacy events (second precision, not recovered append time). Absent evidence stays unreleased. Release inclusion can follow a no-release close; local tags do not prove their remote publication time.",
    "- **Time-indexed history:** historicalWorkOrders in the instance configuration declares its pre-control cases, never completed merely because events are absent. They do not enter the control-closed dependency set; an undeclared set is empty.",
    "",
    `Local annotated release tags used: ${releases.map(({ name }) => `\`${name}\``).join(", ") || "none"}.`,
    "",
    "Release attribution is explicitly refreshed by `index`. Check requires every recorded tag object to remain available and unchanged; newer local release tags are reported without invalidating that attribution snapshot. Typed release dependencies use current local ancestry in both index and status; changing a referenced release's availability can stale the dependency projection. Header/control changes still require regeneration after lifecycle transitions. No command fetches tags.",
    "",
    paths.sequenceLink
      ? `See [the proposed sequence](${paths.sequenceLink}) for this instance's work ahead. Dependency-ready does not grant activation or effect authority.`
      : "See [the human planning map](../planning/work-order-map.md) for recommendation, rationale, tracks, and activation preflight. Dependency-ready does not grant activation or effect authority.",
    "",
  ];
  return lines;
};

/** The release tags the last refresh attributed, as their record holds
 * them: each tag's name and object (an older record's tag may also carry its
 * control segments). */
export const readTagSnapshot = (
  snapshot,
  storage = DEFAULT_CONTROL_PATHS,
  displayPath = defaultDocRelative("control", "release-history.json"),
) => {
  if (!Array.isArray(snapshot))
    throw new Error(
      `${displayPath}: missing or malformed tag snapshot; run npm run work-orders -- index`,
    );
  if (
    !Array.isArray(snapshot) ||
    snapshot.some(
      (tag) =>
        !tag ||
        typeof tag !== "object" ||
        !semver(tag.name) ||
        !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(tag.object) ||
        !["name,object", "controlSegments,name,object"].includes(
          Object.keys(tag).sort().join(","),
        ) ||
        (tag.controlSegments !== undefined &&
          (!Array.isArray(tag.controlSegments) ||
            tag.controlSegments.some(
              (path) =>
                path !== storage.legacy &&
                !new RegExp(
                  `^${storage.orders.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/WO-\\d{3}\\.jsonl$`,
                ).test(path),
            ) ||
            new Set(tag.controlSegments).size !== tag.controlSegments.length)),
    ) ||
    new Set(snapshot.map(({ name }) => name)).size !== snapshot.length
  )
    throw new Error(`${displayPath}: invalid tag snapshot`);
  return snapshot;
};

export const checkIndex = (expected, actual, displayPath = indexPath) => {
  if (expected === actual) return;
  throw new Error(
    `${displayPath} is stale at line ${firstDifferingLine(expected, actual)}; run npm run work-orders -- index`,
  );
};

/** Every order file has a card on exactly one of the two pages, and no page
 * holds a card without an authority; `pages` maps each page's display path to
 * the order ids of the cards it holds. */
export const checkPartition = ({ rows }, pages) => {
  const cards = new Map();
  for (const [path, ids] of Object.entries(pages))
    for (const id of ids) cards.set(id, [...(cards.get(id) ?? []), path]);
  const failures = [];
  for (const row of rows) {
    const on = cards.get(row.id) ?? [];
    if (on.length !== 1)
      failures.push(
        `${row.id} has ${on.length ? `cards on ${on.join(" and ")}` : "no card on either page"}`,
      );
  }
  for (const [id, on] of cards)
    if (!rows.some((row) => row.id === id))
      failures.push(`${id} has a card on ${on.join(" and ")} but no authority`);
  if (failures.length)
    throw new Error(
      `the generated pages do not partition the orders: ${failures.join("; ")}`,
    );
};

// The criteria screen (WO-249): wording that often marks a criterion no
// candidate can meet as written. Its subject is a count, ceiling, cost,
// duration or token figure rather than a behavior; or it reads HEAD or a
// commit range, or asks for a judgment of a later phase, before the final
// review's commit. A regular expression over prose is a screen and never a
// judgment, so a match advises the planner and nothing is refused.
// A figure: digits with their thousands or decimals, outside an identifier
// (an order or decision id, a version); a range's second figure (the 5 of
// 2-5) counts.
const FIGURE = String.raw`(?<![\p{L}\p{N}_.])(?<![\p{L}_]-)\d+(?:[.,]\d+)*`;
const SCREENED_WORDS = String.raw`(?:median|ceiling|budget|cap)s?`;
// A date or a time names when, never a figure the criterion measures.
const withoutDates = (text) =>
  text.replace(/\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?\b/gu, "a date");
// Each screen: its name, its pattern and the text it reads. The later-phase
// phrases are read without emphasis or code marks, which can split them.
const CRITERIA_SCREENS = [
  [
    "a figure with a unit",
    new RegExp(
      String.raw`(?:\$${FIGURE}|${FIGURE}\s?(?:ms|s|min|h|bytes|KB|MB|GB|tokens|USD|%))(?![\p{L}\p{N}_])`,
      "gu",
    ),
    withoutDates,
  ],
  [
    "a median, ceiling, budget or cap beside a figure",
    new RegExp(
      String.raw`${FIGURE}[^\d\n]{0,20}?\b${SCREENED_WORDS}\b|\b${SCREENED_WORDS}\b[^\d\n]{0,20}?${FIGURE}`,
      "giu",
    ),
    withoutDates,
  ],
  ["HEAD", /\bHEAD\b/gu],
  ["git log", /\bgit(?:\s+-{1,2}[\w-]+(?:=\S+)?)*\s+log\b/gu],
  [
    "a revision range",
    /(?<![\w.])[\w^~/$-]*[\w}]\.{2,3}(?:[$\w][\w^~/$-]*|(?=`))/gu,
  ],
  [
    "a later-phase judgment",
    /\b(?:after the review gate|at release close|after the final review)\b/giu,
    (text) => text.replace(/[*_`]/gu, ""),
  ],
];
/** One advisory per open-order criterion whose text a screen matches. An
 * open order whose criteria list the reader refuses is refused by name. */
export function criteriaAdvisories(id, orderText) {
  let declared;
  try {
    declared = declaredCriteria(orderText);
  } catch (error) {
    throw new Error(`${id} ${error.message}`, { cause: error });
  }
  return (declared ?? []).flatMap(({ id: criterion, text }) => {
    const matched = CRITERIA_SCREENS.flatMap(
      ([name, pattern, read = (value) => value]) =>
        [...read(text).matchAll(pattern)].map(
          (match) => `"${match[0]}" (${name})`,
        ),
    );
    return matched.length
      ? [
          `criteria advisory: ${id} criterion ${criterion}: ${matched.join("; ")}`,
        ]
      : [];
  });
}

// Resolve the checkout's own declarations once. A source-only control-plane
// fixture without Preflight tokens needs no runner or compiled runtime.
export function checkPreflightSuites(root, index) {
  const requests = index.rows
    .filter((row) => INDEX_SECTIONS.includes(row.section))
    .flatMap((row) =>
      readPreflightSuites(readContained(root, row.path)).map((suite) => ({
        id: row.id,
        suite,
      })),
    );
  if (!requests.length) return;
  const runner = pathToFileURL(join(root, "scripts/test-runner.mjs")).href;
  const preflightSuitesMs = timeLimit(root, "index.preflight-suites");
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `const {suites}=await import(${JSON.stringify(runner)}); console.log(JSON.stringify(suites.map(({name,kit})=>({name,kit}))));`,
    ],
    {
      cwd: root,
      encoding: "utf8",
      // Null is a limit the root turned off.
      timeout: preflightSuitesMs ?? undefined,
      maxBuffer: 4 * 1024 * 1024,
    },
  );
  const unreadable = () =>
    new Error(
      endedForTime(result)
        ? // Ended for time: the runner was not found unreadable.
          `Preflight suites were not read from scripts/test-runner.mjs: the read was ended for time. ${timeLimitMiss(root, "index.preflight-suites", preflightSuitesMs)}`
        : `Preflight suites cannot be read from scripts/test-runner.mjs (${result.error?.code ?? result.status ?? "unreadable"}); restore this checkout's runner and rerun npm run work-orders -- index --check`,
    );
  if (result.error || result.status !== 0) throw unreadable();
  let declared;
  try {
    declared = JSON.parse(result.stdout);
    if (
      !Array.isArray(declared) ||
      declared.some((row) => typeof row.name !== "string")
    )
      throw unreadable();
  } catch {
    throw unreadable();
  }
  const kit = existsSync(join(root, "KIT-MANIFEST.json"));
  const names = new Set(
    declared
      .filter((row) => !kit || !row.kit?.startsWith("core-only: "))
      .map((row) => row.name),
  );
  const missing = requests.filter(({ suite }) => !names.has(suite));
  if (missing.length)
    throw new Error(
      missing
        .map(
          ({ id, suite }) =>
            `${id}: Preflight suite ${suite} is not declared for this checkout; read npm test -- --list --review and correct its Preflight field`,
        )
        .join("; "),
    );
}

export const main = (args = process.argv.slice(2), root = toolRoot) => {
  if (
    args[0] !== "index" ||
    args.length > 2 ||
    (args.length === 2 && !["--check", "--json"].includes(args[1]))
  )
    throw new Error("usage: work-orders index [--check | --json]");
  const planningSource = docRelative(root, "planning", "sequence.md");
  const pages = {
    readme: {
      path: docRelative(root, "workOrders", "README.md"),
      render: renderIndex,
    },
    history: {
      path: docRelative(root, "workOrders", "HISTORY.md"),
      render: renderHistory,
    },
  };
  // What the pages were rendered from that no file of this repository holds:
  // the release tags and each workstream member's target facts. The refresh
  // writes both records and the check reads them, so the pages are judged
  // without reading a tag again or opening a target checkout.
  const records = [
    releaseHistoryRecord(root),
    workstreamObservationsRecord(root),
  ];
  // The index as the recorded observations give it, for the check and for
  // `--json`: nothing is read from a page.
  const observedIndex = () => {
    const snapshot = readTagSnapshot(
      readReleaseRecord(
        root,
        pages.readme.path,
        INDEX_COMMAND,
        "the work-order index",
      ),
      controlPaths(root),
      records[0],
    );
    // A missing or changed tag object names the record that holds the tags.
    let releases;
    try {
      releases = localReleaseRecords(root, snapshot);
    } catch (error) {
      throw new Error(
        `${records[0]}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    const index = readIndex(root, releases);
    index.workstreams = projectWorkstreams(
      index.workstreamDocuments,
      index.rows,
      readWorkstreamObservations(root),
    );
    return { index, releases };
  };
  if (args.includes("--json")) {
    process.stdout.write(renderRecord(observedIndex().index));
    return;
  }
  for (const page of Object.values(pages)) {
    page.destination = join(root, page.path);
    if (
      existsSync(page.destination) &&
      !containedRegularFile(page.destination, root)
    )
      throw new Error(`${page.path}: expected a contained regular file`);
  }
  if (args.includes("--check")) {
    for (const page of Object.values(pages))
      if (!existsSync(page.destination))
        throw new Error(
          `${page.path} is stale at line 1; run npm run work-orders -- index`,
        );
    const actual = Object.fromEntries(
      Object.entries(pages).map(([key, page]) => [
        key,
        readFileSync(page.destination, "utf8"),
      ]),
    );
    const { index, releases } = observedIndex();
    checkPreflightSuites(root, index);
    checkSequenceTopology(index, planningSource);
    checkSequenceCoverage(index, planningSource);
    for (const [key, page] of Object.entries(pages))
      checkIndex(page.render(index), actual[key], page.path);
    // Both pages now equal their renderings, so the partition is judged on
    // the cards each rendering holds.
    checkPartition(index, {
      [pages.readme.path]: pageCards(index.rows, "index").map((row) => row.id),
      [pages.history.path]: pageCards(index.rows, "history").map(
        (row) => row.id,
      ),
    });
    const names = new Set(releases.map(({ name }) => name));
    const newer = localReleaseTags(root).filter(({ name }) => !names.has(name));
    if (newer.length)
      process.stdout.write(
        `NEWER local release evidence: ${newer.map(({ name }) => name).join(", ")}; additional manifests are not validated by --check; run npm run work-orders -- index to refresh the tag observation\n`,
      );
    // The criteria screen reads every open order: its advisories refuse
    // nothing, and an order whose criteria list cannot be read whole is
    // refused by name.
    for (const row of index.rows.filter((row) =>
      INDEX_SECTIONS.includes(row.section),
    ))
      for (const line of criteriaAdvisories(
        row.id,
        readContained(root, row.path),
      ))
        process.stdout.write(`${line}\n`);
    for (const page of Object.values(pages))
      process.stdout.write(`PASS ${page.path} is current\n`);
  } else {
    const index = readIndex(root);
    index.workstreams = projectWorkstreams(
      index.workstreamDocuments,
      index.rows,
      readTargetFacts(root, index.rows),
    );
    // The two observation records first: a refresh interrupted after them
    // leaves pages the check names stale, never pages without their records.
    if (writeReleaseRecord(root, index.releases))
      process.stdout.write(`Generated ${records[0]}\n`);
    if (writeWorkstreamObservations(root, index.workstreams))
      process.stdout.write(`Generated ${records[1]}\n`);
    const writes = Object.values(pages)
      .map((page) => ({ ...page, expected: page.render(index) }))
      .filter(
        (page) =>
          !existsSync(page.destination) ||
          readFileSync(page.destination, "utf8") !== page.expected,
      );
    // Both temporaries are judged and written before either page is replaced,
    // so an interrupted earlier write refuses before this run moves anything.
    const temporaryExists = (page) =>
      new Error(
        `work-order index temporary already exists: ${page.temporary}; inspect the interrupted index write before retrying`,
      );
    for (const page of writes) {
      page.temporary = `${page.destination}.tmp`;
      if (existsSync(page.temporary)) throw temporaryExists(page);
    }
    const created = [];
    for (const page of writes) {
      try {
        writeFileSync(page.temporary, page.expected, { flag: "wx" });
        created.push(page.temporary);
      } catch (error) {
        // A temporary this run created is removed, so the next run does not
        // read it as an interrupted write.
        for (const path of created) rmSync(path, { force: true });
        throw error.code === "EEXIST" ? temporaryExists(page) : error;
      }
    }
    for (const page of writes) {
      renameSync(page.temporary, page.destination);
      process.stdout.write(`Generated ${page.path}\n`);
    }
  }
};

if (isMainModule(import.meta.url)) {
  try {
    main();
  } catch (error) {
    process.stderr.write(
      `error: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
