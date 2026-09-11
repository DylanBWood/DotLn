import { readFileSync } from "node:fs";
import { runGit } from "./git.mjs";
import { workOrderAuthorityPath } from "./paths.mjs";
import { localReleaseTags, semver } from "./release-records.mjs";

export const historicalDependencyIds = new Set(["WO-001", "WO-002"]);
const startMarker = "<!-- dotln-dependencies:start -->";
const endMarker = "<!-- dotln-dependencies:end -->";
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

// Shared header boundary: examples and citations in the body are not metadata.
export function dependencyHeader(markdown) {
  const lines = markdown.replace(/^\uFEFF/, "").split(/\r?\n/);
  const first = lines.findIndex((line) => line.trim());
  const boundary = lines.findIndex(
    (line, index) =>
      index > first &&
      (/^#{1,6}\s/.test(line) || /^\*\*Objective:\*\*/.test(line)),
  );
  return { lines, first, end: boundary < 0 ? lines.length : boundary };
}

export function parseDependencies(markdown, path, workOrderId) {
  workOrderId ??= /(?:^|\/)(WO-\d{3})-/.exec(path)?.[1];
  const { lines, first, end } = dependencyHeader(markdown);
  const positions = (marker) =>
    lines.flatMap((line, index) => (line.trim() === marker ? [index] : []));
  const starts = positions(startMarker);
  const ends = positions(endMarker);
  const refuse = (message, entry) => {
    throw new Error(
      `${path}: dependencies ${message}${entry === undefined ? "" : `; offending entry ${JSON.stringify(entry)}`}`,
    );
  };
  if (!starts.length && !ends.length) {
    const header = lines.slice(first + 1, end);
    const at = header.flatMap((line, index) =>
      line.startsWith("**Depends on:**") ? [index] : [],
    );
    let prose;
    if (/^#\s/.test(lines[first] ?? "") && at.length === 1) {
      const parts = [header[at[0]].slice("**Depends on:**".length).trim()];
      if (parts[0]) {
        for (const line of header.slice(at[0] + 1)) {
          if (!line.trim() || /^\*\*[^*]+:\*\*/.test(line)) break;
          parts.push(line.trim());
        }
        prose = parts.join(" ");
      }
    }
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
    !/^#\s/.test(lines[first] ?? "")
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
    if (id === workOrderId) refuse("self-reference", entry);
    if (seen.has(id)) refuse(`duplicate id ${id}`, entry);
    seen.add(id);
    if (
      historicalDependencyIds.has(id) &&
      ["hard", "satisfied-by-release", "satisfied-by-close"].includes(relation)
    )
      refuse("historical id cannot be a hard or satisfied dependency", entry);
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

export function projectDependencies(order, closedSet, releases = new Set()) {
  const entries = order.entries.map((entry) => {
    if (order.source === "conservative-tokens")
      return {
        ...entry,
        state: closedSet.has(entry.workOrderId)
          ? "control-closed"
          : "not-control-closed",
      };
    let met;
    if (["hard", "satisfied-by-close"].includes(entry.relation))
      met = closedSet.get(entry.workOrderId) === "pass";
    else if (entry.relation === "satisfied-by-release")
      met = releases.has(entry.release);
    else if (entry.relation === "planning-deferral")
      met = idPattern.test(entry.until) && closedSet.has(entry.until);
    return {
      ...entry,
      state: met === undefined ? "non-blocking" : met ? "met" : "unmet",
    };
  });
  return {
    source: order.source,
    entries,
    blocking: entries.filter((entry) => entry.state === "unmet"),
  };
}

export function readDependencies(root, state, control) {
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
  );
  return projectDependencies(
    order,
    closedDependencySet(control),
    order.entries.some((entry) => entry.relation === "satisfied-by-release")
      ? dependencyReleaseSet(root)
      : new Set(),
  );
}

export function dependencyRefusal(path, projection) {
  return `${path}: activation refused; ${projection.blocking
    .map((entry) => {
      const action =
        entry.relation === "satisfied-by-release"
          ? `make annotated DotLn release ${entry.release} available in HEAD's ancestry`
          : entry.relation === "planning-deferral"
            ? idPattern.test(entry.until)
              ? `close ${entry.until}`
              : `resolve candidate ${entry.until}`
            : `close ${entry.workOrderId} with a passing final review`;
      return `${entry.workOrderId} (${entry.relation}): ${entry.reason}; ${action}, or change the relation in this authority file with a dated reviewed note`;
    })
    .join("; ")}`;
}
