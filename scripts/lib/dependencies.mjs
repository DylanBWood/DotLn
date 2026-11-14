import { markdownMarkerLines } from "./markdown-links.mjs";
import { readWorkOrder, readWorkOrderHeader } from "./work-order-document.mjs";
import { readFileSync } from "node:fs";
import { runGit } from "./git.mjs";
import { workOrderAuthorityPath } from "./paths.mjs";
import { CONFIG_FILENAME, findLaunchpad, loadConfig } from "./config.mjs";
import { localReleaseTags, semver } from "./release-tags.mjs";

export const historicalDependencyIds = (root = findLaunchpad()) =>
  new Set(loadConfig(root).historicalWorkOrders);
// Historical judgments read the declaration at their own revision. Its absence
// means an empty set; later configuration must not reinterpret an old receipt.
export const historicalDependencyIdsAt = (reader) => {
  if (!reader.paths.includes(CONFIG_FILENAME)) return new Set();
  const declared = JSON.parse(reader.read(CONFIG_FILENAME));
  const ids = declared.historicalWorkOrders ?? [];
  if (
    !Array.isArray(ids) ||
    ids.some((id) => !/^WO-\d{3}$/u.test(id)) ||
    new Set(ids).size !== ids.length
  )
    throw new Error(
      `${CONFIG_FILENAME}: historicalWorkOrders must be a list of distinct WO-NNN identifiers`,
    );
  return new Set(ids);
};
const START = "dotln-dependencies:start";
const END = "dotln-dependencies:end";
const idPattern = /^WO-\d{3}$/;
const fields = {
  hard: [],
  "satisfied-by-release": ["release"],
  "satisfied-by-close": [],
  "historical-evidence": [],
  "reference-only": [],
  waived: ["date"],
  superseded: ["by"],
  "planning-deferral": ["until", "date"],
};
const oneLine = (value) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  !/[\r\n\u2028\u2029]/u.test(value);
const date = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(value)) &&
  new Date(value).toISOString().slice(0, 10) === value;

// Shared header boundary, as the work-order reader finds it: examples and
// citations in the body are not metadata. The lines, the first non-blank
// line and the line where the header ends serve the marker block below.
export function dependencyHeader(markdown) {
  const order = readWorkOrderHeader(markdown);
  const lines = order.source.split(/\r?\n/);
  const first = lines.findIndex((line) => line.trim());
  const end =
    order.headerEnd >= order.source.length
      ? lines.length
      : order.source.slice(0, order.headerEnd).split(/\r?\n/).length - 1;
  return { lines, first, end, order };
}

// An umbrella record is an order superseded whole (WO-190). The class is the
// exact label in the leading header plus at least one typed superseded entry;
// the successors are those entries' `by` values, never read from prose. A
// label without typed entries, or entries without the label, is not an
// umbrella: the index then lists the order as open work and the sequence
// coverage check names it, rather than guessing.
export const UMBRELLA_LABEL = /^Umbrella record( \(\d{4}-\d{2}-\d{2}\))?$/;
/** The Umbrella record field a read order's leading header declares, or
 * undefined: the notice the index and the dependency migration both read. */
export const umbrellaNotice = (order) =>
  order.header.find((field) => field.colon && UMBRELLA_LABEL.test(field.label));
export function umbrellaSuccessors(markdown, dependencies) {
  const { order } = dependencyHeader(markdown);
  if (!umbrellaNotice(order)) return null;
  if (dependencies.source !== "typed") return null;
  const successors = [
    ...new Set(
      dependencies.entries
        .filter((entry) => entry.relation === "superseded")
        .map((entry) => entry.by),
    ),
  ];
  return successors.length ? { successors } : null;
}
export const umbrellaRecord = (markdown, path, workOrderId) =>
  umbrellaSuccessors(markdown, parseDependencies(markdown, path, workOrderId));

export function parseDependencies(
  markdown,
  path,
  workOrderId,
  historical = historicalDependencyIds(),
) {
  workOrderId ??= /(?:^|\/)(WO-\d{3})-/.exec(path)?.[1];
  const { lines, first, end, order } = dependencyHeader(markdown);
  // A marker is a comment of the document's own text, alone on its line: the
  // same words in a fenced example are code and declare nothing. The
  // header's reading holds the header's comments; the whole document is
  // read only where the markers' words also stand below the header.
  const read =
    order.source.indexOf("dotln-dependencies:", order.headerEnd) < 0
      ? order.lead
      : readWorkOrder(markdown);
  const starts = markdownMarkerLines(read.source, START, read.tree).filter(
    (line) => line < lines.length,
  );
  const ends = markdownMarkerLines(read.source, END, read.tree).filter(
    (line) => line < lines.length,
  );
  const refuse = (message, entry) => {
    throw new Error(
      `${path}: dependencies ${message}${entry === undefined ? "" : `; offending entry ${JSON.stringify(entry)}`}`,
    );
  };
  if (!starts.length && !ends.length) {
    const at = order.headerFields("Depends on");
    let prose;
    // The field's value runs to the next field or the paragraph's end; an
    // empty first line is no declaration.
    if (order.title && at.length === 1 && at[0].lineValue.trim())
      prose = at[0].value
        .split(/\r?\n/u)
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" ");
    return {
      source: "conservative-tokens",
      entries: [
        ...new Set(
          [...(prose ?? "").matchAll(/\bWO-\d{3}\b/g)].map(([id]) => id),
        ),
      ]
        .sort()
        .map((workOrderId) => ({ workOrderId })),
    };
  }
  if (
    starts.length !== 1 ||
    ends.length !== 1 ||
    starts[0] >= ends[0] ||
    starts[0] <= first ||
    ends[0] >= end ||
    lines[starts[0] - 1].trim() ||
    !order.title
  )
    refuse("require one ordered block in leading metadata after a blank line");
  let entries;
  try {
    entries = JSON.parse(lines.slice(starts[0] + 1, ends[0]).join("\n"));
  } catch {
    refuse(
      "require a valid JSON array",
      lines.slice(starts[0] + 1, ends[0]).join("\n"),
    );
  }
  if (!Array.isArray(entries)) refuse("require a JSON array", entries);
  const seen = new Set();
  for (const entry of entries) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry))
      refuse("require an object", entry);
    const { workOrderId: id, relation, reason } = entry;
    if (!idPattern.test(id ?? ""))
      refuse("require a workOrderId WO-NNN", entry);
    if (!Object.hasOwn(fields, relation)) refuse("unknown relation", entry);
    if (!oneLine(reason)) refuse("require a one-line reason", entry);
    if (
      historical.has(id) &&
      ["hard", "satisfied-by-release", "satisfied-by-close"].includes(relation)
    )
      refuse("historical id cannot be a hard or satisfied dependency", entry);
    if (id === workOrderId) refuse("self-reference", entry);
    if (seen.has(id)) refuse(`duplicate id ${id}`, entry);
    seen.add(id);
    const expected = [
      "workOrderId",
      "relation",
      "reason",
      ...fields[relation],
    ].sort();
    if (Object.keys(entry).sort().join(",") !== expected.join(","))
      refuse(`expected fields ${expected.join(", ")}`, entry);
    if (relation === "satisfied-by-release" && !semver(entry.release))
      refuse("require a strict release vX.Y.Z", entry);
    if (fields[relation].includes("date") && !date(entry.date))
      refuse("require a valid date YYYY-MM-DD", entry);
    if (relation === "superseded" && !idPattern.test(entry.by ?? ""))
      refuse("require by WO-NNN", entry);
    if (relation === "planning-deferral" && !oneLine(entry.until))
      refuse("require until naming an order or candidate label", entry);
    if (relation === "planning-deferral" && entry.until === workOrderId)
      refuse("self-reference in until", entry);
  }
  return { source: "typed", entries };
}

// A map retains absent/failed verdicts instead of equating every close with pass.
export const closedDependencySet = (control) =>
  new Map(
    [...control.orders]
      .filter(([, row]) => row.state.phase === "closed")
      .map(([id, row]) => [id, row.finalReviewVerdict]),
  );

// A withdrawn order never closes, so every edge over it is unmet with
// the reason named; the disposition says which terminal outcome it recorded.
export const withdrawnDependencySet = (control) =>
  new Map(
    [...control.orders]
      .filter(([, row]) => row.state.phase === "withdrawn")
      .map(([id, row]) => [id, row.state.withdrawal?.disposition ?? "unknown"]),
  );

// Only local annotated DotLn releases reachable from HEAD satisfy a release edge.
export function dependencyReleaseSet(root) {
  const tags = localReleaseTags(root);
  if (!tags.length) return new Set();
  const merged = new Set(
    runGit(root, ["tag", "--merged", "HEAD", "--list"]).split("\n"),
  );
  return new Set(
    tags.filter(({ name }) => merged.has(name)).map(({ name }) => name),
  );
}

export function projectDependencies(
  order,
  closedSet,
  releases = new Set(),
  withdrawnSet = new Map(),
) {
  const entries = order.entries.map((entry) => {
    const target =
      entry.relation === "planning-deferral" ? entry.until : entry.workOrderId;
    const withdrawn = withdrawnSet.has(target)
      ? { detail: "withdrawn", disposition: withdrawnSet.get(target) }
      : {};
    if (order.source === "conservative-tokens")
      return {
        ...entry,
        state: closedSet.has(entry.workOrderId)
          ? "control-closed"
          : "not-control-closed",
        ...withdrawn,
      };
    let met;
    if (["hard", "satisfied-by-close"].includes(entry.relation))
      met = closedSet.get(entry.workOrderId) === "pass";
    else if (entry.relation === "satisfied-by-release")
      met = releases.has(entry.release);
    else if (entry.relation === "planning-deferral")
      met = idPattern.test(entry.until) && closedSet.has(entry.until);
    // A release edge is met by its release, never by the order closing, so
    // it keeps its own remedy.
    return {
      ...entry,
      state: met === undefined ? "non-blocking" : met ? "met" : "unmet",
      ...(met === false && entry.relation !== "satisfied-by-release"
        ? withdrawn
        : {}),
    };
  });
  return {
    source: order.source,
    entries,
    blocking: entries.filter((entry) => entry.state === "unmet"),
  };
}

// `releaseSet` lets a caller projecting many orders read the release set once.
export function readDependencies(
  root,
  state,
  control,
  releaseSet = () => dependencyReleaseSet(root),
) {
  if (!state.workOrderPath) return null;
  const path = workOrderAuthorityPath(
    root,
    state.workOrderId,
    state.workOrderPath,
  );
  const order = parseDependencies(
    readFileSync(path, "utf8"),
    state.workOrderPath,
    state.workOrderId,
    historicalDependencyIds(root),
  );
  return projectDependencies(
    order,
    closedDependencySet(control),
    order.entries.some((entry) => entry.relation === "satisfied-by-release")
      ? releaseSet()
      : new Set(),
    withdrawnDependencySet(control),
  );
}

export function dependencyRefusal(path, projection) {
  return `${path}: activation refused; ${projection.blocking
    .map((entry) => {
      const target =
        entry.relation === "planning-deferral"
          ? entry.until
          : entry.workOrderId;
      const action =
        entry.detail === "withdrawn"
          ? `${target} is withdrawn (${entry.disposition}) and cannot close as filed; reactivate a changed revision of ${target}`
          : entry.relation === "satisfied-by-release"
            ? `make annotated DotLn release ${entry.release} available in HEAD's ancestry`
            : entry.relation === "planning-deferral"
              ? idPattern.test(entry.until)
                ? `close ${entry.until}`
                : `resolve ${entry.until}`
              : `close ${entry.workOrderId} with a passing final review`;
      return `${entry.workOrderId} (${entry.relation}): ${entry.reason}; ${action}, or change the relation in this authority file with a dated reviewed note`;
    })
    .join("; ")}`;
}

/** `core` is whether the order is read in core's own root, where one order
 * is exempt by its number; said by no caller, it is not. */
export function inheritedLedgerDuty(source, core = false) {
  // An order that never names the ledger has no such criterion, and its body
  // is not parsed to say so; the index asks this of every order.
  if (!/ledger/i.test(source)) return false;
  const order = readWorkOrder(source);
  // The order's own labels: a quoted or a listed example of one opens no
  // section.
  const criteria = order.labels.find((field) =>
    field.label.startsWith("Acceptance criteria"),
  );
  const goals = order.labels.find(
    (field) =>
      field.label === "Non-goals" && field.start > (criteria?.start ?? 0),
  );
  return (
    Boolean(criteria) &&
    /(?:ledger|idea-ledger)/i.test(
      order.source.slice(criteria.start, goals?.start ?? order.source.length),
    ) &&
    !(core && /^WO-126\b/.test(order.title?.title ?? ""))
  );
}
