#!/usr/bin/env node
import { isMainModule } from "./lib/paths.mjs";
import {
  defaultDocRelative,
  docPath,
  docRelative,
  findLaunchpad,
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
  dependencyHeader,
  dependencyReleaseSet,
  historicalDependencyIds,
  inheritedLedgerDuty,
  parseDependencies,
  projectDependencies,
  umbrellaSuccessors,
  withdrawnDependencySet,
} from "./lib/dependencies.mjs";
import { runGit } from "./lib/git.mjs";
import {
  containedRegularFile,
  parseJson,
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

const toolRoot = findLaunchpad();
const indexPath = defaultDocRelative("workOrders", "README.md");
// The settled orders, the sources and limits and the tag record live on a
// companion page (WO-190), so the page a reader opens for the work ahead
// holds only the active line, the sequence and the Active and Open cards.
const historyPath = defaultDocRelative("workOrders", "HISTORY.md");
const planningPath = defaultDocRelative("planning", "sequence.md");
// The default-layout storage names the generated index cites when a caller
// hands it rows without the launchpad they were read from.
const DEFAULT_INDEX_PATHS = {
  legacy: DEFAULT_CONTROL_PATHS.legacy,
  orders: DEFAULT_CONTROL_PATHS.segment("WO-NNN"),
  legacyRelease: defaultDocRelative("releases", "v0.2.0.md"),
};
const snapshotPrefix = "<!-- dotln-work-order-tags: ";
const historicalIds = historicalDependencyIds;
const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const INDEX_SECTIONS = ["Active", "Open"];
const HISTORY_SECTIONS = ["Closed", "Withdrawn", "Superseded", "Historical"];

// This is a tolerant view of existing prose, not another activation validator.
// Unknown fields are named alongside their source path in the rendered details.
export const parseHeader = (markdown, path) => {
  const { lines, first, end } = dependencyHeader(markdown);
  const title = /^#\s+(.+?)\s*$/.exec(
    (lines[first] ?? "").replace(/[ \t]+#+[ \t]*$/, ""),
  )?.[1];
  const header = lines.slice(first + 1, end);
  const field = (label) => {
    if (!title) return undefined;
    const prefix = `**${label}:**`;
    const positions = header.flatMap((line, index) =>
      line.startsWith(prefix) ? [index] : [],
    );
    if (positions.length !== 1) return undefined;
    const start = positions[0];
    const parts = [header[start].slice(prefix.length).trim()];
    if (!parts[0]) return undefined;
    for (const line of header.slice(start + 1)) {
      if (!line.trim() || /^\*\*[^*]+:\*\*/.test(line)) break;
      parts.push(line.trim());
    }
    return parts.join(" ").replace(/\s+/g, " ");
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
  const dependencies = parseDependencies(markdown, path);
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
    repository: parseRepositoryDeclaration(markdown, path),
    provenance: parseDerivedProvenance(markdown, path),
    ledgerSubstitution: inheritedLedgerDuty(markdown),
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

// Only this explicit operator-authored block selects the proposed order.
// References elsewhere in the map or a Depends on paragraph cannot select it.
export const parseSequenceGroups = (markdown, source = planningPath) => {
  const lines = markdown.split(/\r?\n/);
  const positions = (marker) =>
    lines.flatMap((line, index) => (line.trim() === marker ? [index] : []));
  const starts = positions("<!-- dotln-work-order-sequence:start -->");
  const ends = positions("<!-- dotln-work-order-sequence:end -->");
  if (starts.length !== 1 || ends.length !== 1 || starts[0] >= ends[0])
    throw new Error(`${source}: expected one marked proposed sequence`);
  const seen = new Set();
  const groups = [];
  let group = [];
  for (const line of lines.slice(starts[0] + 1, ends[0])) {
    if (!line.trim()) {
      if (group.length) groups.push(group);
      group = [];
    } else {
      const match = /^- (WO-\d{3}) — (\S(?:.*\S)?)$/u.exec(line);
      if (!match)
        throw new Error(`${source}: expected '- WO-NNN — short label'`);
      const [, id, label] = match;
      if (seen.has(id))
        throw new Error(`${source}: duplicate proposed order ${id}`);
      seen.add(id);
      group.push({ id, label });
    }
  }
  if (group.length) groups.push(group);
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
 * sequence; product 07 §Derived work and intent) must appear in the marked
 * sequence. Active orders are shown by the Now line and the Active cards
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
      (row) => row.section === "Open" && !row.provenance && !placed.has(row.id),
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
  const rows = workOrderAuthorityFiles(root)
    .map((path) => {
      const id = /^(WO-\d{3})-/.exec(basename(path))?.[1];
      workOrderAuthorityPath(root, id, path);
      if (ids.has(id))
        throw new Error(`duplicate work-order id ${id}: ${path}`);
      ids.add(id);
      const source = readContained(root, path);
      const header = parseHeader(source, path);
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
      const historical = !state && historicalIds.has(id);
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
      const dependencyState =
        dependencies.source === "conservative-tokens"
          ? "conservative token view; does not block"
          : HISTORY_SECTIONS.includes(section)
            ? "typed; activation not applicable"
            : dependencies.blocking.length
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
        umbrella,
        authorityLink: posix.relative(authorityRoot, path),
        hasDecisions: existsSync(
          join(root, docRelative(root, "evidence", `${id}/decisions.md`)),
        ),
        section,
        phase,
        dependencies,
        dependencyState,
        state,
        repository:
          state?.repositoryId === undefined
            ? header.repository
            : { id: state.repositoryId, baseCommit: state.baseCommit },
        finalReviewVerdict: evidence?.finalReviewVerdict,
        disposition,
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
  for (const row of rows) row.position = positions.get(row.id) ?? null;
  return {
    rows,
    releases,
    sequence,
    groups,
    paths: {
      legacy: storage.legacy,
      orders: storage.segment("WO-NNN"),
      legacyRelease: docRelative(root, "releases", "v0.2.0.md"),
    },
  };
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
const link = (label, path) =>
  `[${cell(label)}](${path.split("/").map(encodeURIComponent).join("/")})`;
const report = (id, verdict, path) =>
  id
    ? `${path && verdict ? link(id, `../../${path}`) : cell(id)} (${cell(verdict ?? "pending")})`
    : "none recorded";
const definition = (row) =>
  `[${row.id}]: ${(row.authorityLink ?? basename(row.path)).split("/").map(encodeURIComponent).join("/")}`;

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

// The card fields are the page contract both runtime readers parse; they are
// the same on either page.
const renderCard = (row) => {
  const state = row.state;
  return [
    `### ${row.id}`,
    "",
    link(row.title, row.authorityLink ?? basename(row.path)),
    "",
    `- State: ${cell(row.phase)}.`,
    ...offRampLines(state),
    ...(row.provenance
      ? [`- Provenance: ${cell(JSON.stringify(row.provenance))}.`]
      : []),
    ...(row.repository
      ? [
          `- Repository: ${cell(row.repository.id)} @ ${cell(row.repository.baseCommit)}.`,
        ]
      : []),
    `- Application target: ${cell(row.version)}.`,
    `- Dependencies: ${cell(row.dependencyState)}.`,
    `- References: ${cell(row.dependencies.entries.map((entry) => `${entry.workOrderId}: ${entry.relation ? `${entry.relation} (${entry.state}${entry.detail ? `: ${entry.detail}` : ""})` : `${entry.state}${entry.detail ? `: ${entry.detail}` : ""}`}${entry.release ? ` ${entry.release}` : ""}${entry.until ? ` until ${entry.until}` : ""}${entry.by ? ` by ${entry.by}` : ""}${entry.date ? ` dated ${entry.date}` : ""}${entry.reason ? ` — ${entry.reason}` : ""}`).join("; ") || "none declared")}.`,
    `- Verification: ${report(state?.latestVerificationId, state?.latestVerdict, state?.latestVerificationPath)}.`,
    `- Final review: ${report(state?.finalReviewId, row.finalReviewVerdict, state?.finalReviewPath)}.`,
    `- Release: ${cell(row.disposition)}.`,
    `- Model: ${cell(row.model)}`,
    `- Effort: ${cell(row.effort)}`,
    `- Track: ${cell(row.track ?? "unknown")}`,
    `- Cost: ${cell(row.cost)}`,
    ...(["WO-112", "WO-118"].includes(row.id)
      ? [
          "- Delivery: target publication requires `worktree publish WO-NNN --target <request> --require-deliverable-ready` (WO-182); record every absent item before retrying.",
        ]
      : []),
    ...(row.ledgerSubstitution
      ? [
          `- Inherited ledger duty: discharge with ${row.hasDecisions ? `[this order's decisions](../evidence/${row.id}/decisions.md)` : `this order's decisions file when recorded`} and its row in [the decisions index](../lineage/decisions-index.md); no lifecycle ledger append.`,
        ]
      : []),
    ...(state?.latestAttestation
      ? [
          `- Latest attestation: ${cell(renderAttestation(state.latestAttestation))}.`,
        ]
      : []),
    `- Authority: ${link(row.path, row.authorityLink ?? basename(row.path))}`,
    "",
  ];
};

const renderSection = (lines, rows, section) => {
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
  for (const row of selected) lines.push(...renderCard(row));
};

/** The index page: the active line, the sequence with its lane pairs, and
 * the Active and Open cards. Its first line, generated-by sentence, headings
 * and card fields are the contract the resident and the console read. */
export const renderIndex = ({ rows, sequence, groups = [] }) => {
  const byId = new Map(rows.map((row) => [row.id, row]));
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
    "`npm run work-orders -- index --check` detects changed headers, control state, proposed sequence or tag record on either page, and refuses an open order that has no place in the sequence; active orders and derived drafts are not judged.",
    "",
    "Full evidence for the active and sequenced orders follows; the Open cards are in sequence order.",
    "",
  );
  for (const section of INDEX_SECTIONS) renderSection(lines, rows, section);
  // Only the references this page uses: the Now line and the sequence rows.
  const referenced = new Set([
    ...active.map((row) => row.id),
    ...sequence.map(({ id }) => id),
  ]);
  for (const row of rows)
    if (referenced.has(row.id)) lines.push(definition(row));
  return `${lines.join("\n").trimEnd()}\n`;
};

/** The history page: every settled card, the sources and limits of the
 * generated index and its release-tag record. Only the index page is a
 * runtime contract; the console reads this page as a second source. */
export const renderHistory = ({
  rows,
  releases,
  paths = DEFAULT_INDEX_PATHS,
}) => {
  const lines = [
    "# Work-order history",
    "",
    "Settled orders: closed, withdrawn, superseded and historical, with the sources and limits of the generated index and its release-tag record. The work ahead, the active and sequenced orders, is on [the index](README.md).",
    "",
    "This file is generated by `npm run work-orders -- index` beside the index; `npm run work-orders -- index --check` judges both pages and names the stale one.",
    "",
  ];
  for (const section of HISTORY_SECTIONS) renderSection(lines, rows, section);
  lines.push(...renderSources(releases, paths));
  // Only the references this page uses: the Superseded summary rows.
  for (const row of sectionRows(rows, "Superseded"))
    lines.push(definition(row));
  return `${lines.join("\n").trimEnd()}\n`;
};

// The order's off-ramp events, shown only when recorded (WO-158).
const offRampLines = (state) => [
  ...(state?.withdrawal
    ? [
        `- Withdrawal: ${cell(`${state.withdrawal.disposition} at ordinal ${state.withdrawal.ordinal} — ${state.withdrawal.reason}`)}.`,
      ]
    : []),
  ...(state?.waivedCriteria?.length
    ? [
        `- Waived criteria: ${cell(state.waivedCriteria.map((waiver) => `${waiver.criterionId} by ordinal ${waiver.ordinal}`).join(", "))}.`,
      ]
    : []),
  ...(state?.corrections?.length
    ? [
        `- Record corrections: ${cell(state.corrections.map((correction) => `ordinal ${correction.ordinal} corrects ordinal ${correction.subject.ordinal} (${Object.keys(correction.fields).join(", ")})`).join("; "))}.`,
      ]
    : []),
  ...(state?.overrideRecords?.length
    ? [
        `- Override records: ${cell(state.overrideRecords.map((record) => `ordinal ${record.ordinal}`).join(", "))}.`,
      ]
    : []),
];

const renderSources = (releases, paths) => {
  const lines = [
    "## Sources and limits",
    "",
    "- **Two pages (WO-190):** `README.md` holds the active line, the proposed sequence with its lane pairs and the Active and Open cards, the Open cards in sequence order; this page holds every settled card (Closed, Withdrawn, Superseded, Historical), these sources and limits and the release-tag record. Every order file appears on exactly one page. `index --check` judges both pages, names the stale one, and refuses an open order that has no place in the sequence unless it is an umbrella record or a derived draft, whose place is its allocation.",
    "- **Header observation:** each authority's H1, sole strict application version, Model, Effort, optional Track (delivery, machinery or evidence; absent or invalid is unknown), and leading typed dependency block (or legacy Depends on paragraph). Invalid typed declarations refuse with the authority path and offending entry; other unknown metadata is attributed by the Authority link.",
    "- **Proposed sequence:** the marked block in planning/sequence.md, in operator-selected order; two entries between blank lines are a lane pair. Historical fixtures without that file use the map. Missing/malformed blocks, duplicate IDs, and IDs without an authority refuse. This is not a scheduler or proof of dependency eligibility.",
    `- **Control evidence:** the shared fold of legacy \`${paths.legacy}\` plus \`${paths.orders}\`, reduced independently per work order in segment append order. Closed means a passing final review; it does not independently prove merge or publication. A withdrawn order is listed under Withdrawn on this page with its recorded disposition, unchecked in the proposed order, and never counts as a pass. Report verdicts come from events, not inferred report contents.`,
    "- **Superseded:** an umbrella record is an order superseded whole: the `**Umbrella record:**` label in its leading header plus typed superseded entries. It is listed under Superseded with the successors those entries name, `resume activate` refuses it naming them, and no control event records it (WO-190). Recorded control state, when any exists, wins.",
    `- **Local release evidence:** the earliest numeric annotated DotLn tag whose manifest names the order or a changed final-review path. The manifest-free v0.2.0 exception uses \`${paths.legacyRelease}\`. Other tags are not release evidence. Remote publication is not checked.`,
    "- **Derived dependency status:** the authority's typed block is projected by scripts/lib/dependencies.mjs, also used by status --json and activation. Hard and satisfied-by-close entries require control closure with a passing final-review verdict; an entry over a withdrawn order reads unmet: withdrawn. Satisfied-by-release requires the named local annotated DotLn release in HEAD's ancestry. Planning-deferral waits for its named order's closure or remains unmet for a candidate label; a dated waiver replaces it. Historical evidence, references, waivers and supersessions never block. Without a typed block, distinct Depends on tokens retain a labeled conservative view and never block activation. Closed and historical rows do not imply reactivation work.",
    "- **Inferred no-release close:** only an unmatched closed order with a strict H1 version below a local release whose per-segment tagged control prefix precedes its close and whose tag time is no later than the close observation. That observation is recordedAt, or the first committed close prefix for legacy events (second precision, not recovered append time). Absent evidence stays unreleased. Release inclusion can follow a no-release close; local tags do not prove their remote publication time.",
    "- **Time-indexed history:** WO-001 and WO-002 are explicit pre-control cases, never completed merely because events are absent. They do not enter the control-closed dependency set.",
    "",
    `Local annotated release tags used: ${releases.map(({ name }) => `\`${name}\``).join(", ") || "none"}.`,
    "",
    "Release attribution is explicitly refreshed by `index`. Check requires every recorded tag object to remain available and unchanged; newer local release tags are reported without invalidating that attribution snapshot. Typed release dependencies use current local ancestry in both index and status; changing a referenced release's availability can stale the dependency projection. Header/control changes still require regeneration after lifecycle transitions. No command fetches tags.",
    "",
    "See [the human planning map](../planning/work-order-map.md) for recommendation, rationale, tracks, and activation preflight. Dependency-ready does not grant activation or effect authority.",
    "",
  ];
  lines.push(
    `${snapshotPrefix}${JSON.stringify(releases.map(({ name, object, controlSegments }) => ({ name, object, controlSegments })))} -->`,
    "",
  );
  return lines;
};

export const readTagSnapshot = (
  source,
  storage = DEFAULT_CONTROL_PATHS,
  displayPath = historyPath,
) => {
  const records = source
    .split("\n")
    .filter((line) => line.startsWith(snapshotPrefix));
  if (records.length !== 1 || !records[0].endsWith(" -->"))
    throw new Error(
      `${displayPath}: missing or malformed tag snapshot; run npm run work-orders -- index`,
    );
  const snapshot = parseJson(
    records[0].slice(snapshotPrefix.length, -4),
    `${displayPath} tag snapshot`,
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
  const before = actual?.split("\n") ?? [];
  const after = expected.split("\n");
  const line = after.findIndex((value, index) => value !== before[index]);
  throw new Error(
    `${displayPath} is stale at line ${line < 0 ? after.length + 1 : line + 1}; run npm run work-orders -- index`,
  );
};

/** Every order file has a card on exactly one of the two pages, and no page
 * holds a card without an authority; `pages` maps display path to text. */
export const checkPartition = ({ rows }, pages) => {
  const cards = new Map();
  for (const [path, text] of Object.entries(pages))
    for (const [, id] of text.matchAll(/^### (WO-\d{3})$/gm))
      cards.set(id, [...(cards.get(id) ?? []), path]);
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

export const main = (args = process.argv.slice(2), root = toolRoot) => {
  if (
    args[0] !== "index" ||
    args.length > 2 ||
    (args.length === 2 && args[1] !== "--check")
  )
    throw new Error("usage: work-orders index [--check]");
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
    const snapshot = readTagSnapshot(
      actual.history,
      controlPaths(root),
      pages.history.path,
    );
    // The tag record lives on the history page, so a missing or changed tag
    // object names that page.
    let releases;
    try {
      releases = localReleaseRecords(root, snapshot);
    } catch (error) {
      throw new Error(
        `${pages.history.path}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    const index = readIndex(root, releases);
    checkSequenceTopology(index, planningSource);
    checkSequenceCoverage(index, planningSource);
    for (const [key, page] of Object.entries(pages))
      checkIndex(page.render(index), actual[key], page.path);
    checkPartition(
      index,
      Object.fromEntries(
        Object.entries(pages).map(([key, page]) => [page.path, actual[key]]),
      ),
    );
    const names = new Set(releases.map(({ name }) => name));
    const newer = localReleaseTags(root).filter(({ name }) => !names.has(name));
    if (newer.length)
      process.stdout.write(
        `NEWER local release evidence: ${newer.map(({ name }) => name).join(", ")}; additional manifests are not validated by --check; run npm run work-orders -- index to refresh the tag observation\n`,
      );
    for (const page of Object.values(pages))
      process.stdout.write(`PASS ${page.path} is current\n`);
  } else {
    const index = readIndex(root);
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
