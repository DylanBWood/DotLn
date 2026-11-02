import { posix } from "node:path";
import { CRITERION_ID } from "./control.mjs";
// A verification or final-review report declares its findings once, as a JSON
// array between two marker lines (the pattern of dependencies.mjs). The result
// commands read only that block: no prose line is ever counted. A fail's
// blocking entries are its basis; a final review's counts are recorded with the
// immutable result, and planning consumes the event, never the report.
const classes = ["escape", "integration", "new-scope"];
const findingClasses = [...classes, "unclassed"];
const routes = ["blocking", "follow-up", "operator"];
const START = "<!-- dotln-findings:start -->";
const END = "<!-- dotln-findings:end -->";
/** The block as an advisory states it. */
const findingsFormat = `a \`${START}\` line, a JSON array of {"id": "F1", "route": "${routes.join("|")}", "class": "${classes.join("|")}", "summary": "<one line>"} entries ([] for none) and a \`${END}\` line`;
// A marker line is any line whose only letters are a marker's name, so a copy
// behind a quote or list marker, in other case or spacing, or alone in inline
// code is a marker too. A sentence that mentions a marker holds other letters.
const MARKER = /^[^\p{L}]*dotln-findings:(start|end)[^\p{L}]*$/iu;
/** Whether a line is one of the block's marker lines, by the rule above. */
export const isFindingsMarker = (line) => MARKER.test(line);
const ID = /^F[1-9]\d*$/u;
// A writer may fence the array. No line of a JSON array is a fence line, so
// dropping one never changes what a valid array says; a fence line that also
// holds an entry is not one, and stays invalid JSON.
const FENCE_LINE = /^\s*(?:`{3,}|~{3,})[\w-]*\s*$/u;
const oneLine = (value) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  !/[\p{Cc}\p{Zl}\p{Zp}]/u.test(value);
const show = (entry) => {
  const json = [...JSON.stringify(entry)];
  return json.length > 120 ? `${json.slice(0, 120).join("")}…` : json.join("");
};

/**
 * The report's findings block as written: `readable` with its `entries`, or
 * not readable with a `cause` naming the first problem. A block is readable
 * when the report has exactly one start and one end marker line, in that
 * order, around a JSON array whose every entry is an object with an `id`
 * `F<n>` (n from 1, no leading zero) no other entry has, a listed `route` and
 * a one-line `summary`. A second copy of a marker line, an example included,
 * makes the block unreadable rather than half read.
 */
export function readFindingsBlock(text) {
  const unreadable = (cause) => ({ readable: false, cause });
  const lines = text.split(/\r\n?|\n/u);
  const at = (kind) =>
    lines.flatMap((line, index) =>
      MARKER.exec(line)?.[1].toLowerCase() === kind ? [index + 1] : [],
    );
  const starts = at("start");
  const ends = at("end");
  if (!starts.length && !ends.length)
    return unreadable("the report has no findings block");
  if (starts.length !== 1 || ends.length !== 1 || starts[0] > ends[0]) {
    const on = (found) =>
      found.length
        ? `line${found.length === 1 ? "" : "s"} ${found.join(", ")}`
        : "no line";
    return unreadable(
      `the report needs one findings block, and has a start marker on ${on(starts)} and an end marker on ${on(ends)}`,
    );
  }
  let entries;
  try {
    entries = JSON.parse(
      lines
        .slice(starts[0], ends[0] - 1)
        .filter((line) => !FENCE_LINE.test(line))
        .join("\n"),
    );
  } catch {
    return unreadable("the findings block is not valid JSON");
  }
  if (!Array.isArray(entries))
    return unreadable("the findings block is not a JSON array");
  const seen = new Set();
  for (const [index, entry] of entries.entries()) {
    const invalid = (problem) =>
      unreadable(
        `entry ${index + 1} of the findings block ${problem}: ${show(entry)}`,
      );
    if (!entry || typeof entry !== "object" || Array.isArray(entry))
      return invalid("is not an object");
    if (typeof entry.id !== "string" || !ID.test(entry.id))
      return invalid("needs an id F<n>, n from 1 with no leading zero");
    if (seen.has(entry.id)) return invalid(`repeats id ${entry.id}`);
    seen.add(entry.id);
    if (!routes.includes(entry.route))
      return invalid(`needs a route ${routes.join(", ")}`);
    if (!oneLine(entry.summary)) return invalid("needs a one-line summary");
  }
  return { readable: true, entries };
}

/**
 * The findings a report's block declares, decided by the block alone:
 * - an unreadable block (above): `measured` is false and `cause` names why;
 * - a failed review whose block lists no blocking finding: unmeasured, since
 *   a review fails on one;
 * - otherwise `counts` holds one count per entry, by its `class`; an entry
 *   whose class is absent or outside the three classes counts as `unclassed`
 *   and is listed in `unclassed` with whether its route is blocking.
 */
export function reviewFindings(text, { verdict } = {}) {
  const unmeasured = (cause) => ({ measured: false, cause });
  const block = readFindingsBlock(text);
  if (!block.readable) return unmeasured(block.cause);
  const { entries } = block;
  if (
    verdict === "fail" &&
    !entries.some((entry) => entry.route === "blocking")
  )
    return unmeasured(
      "the failed review's findings block lists no blocking finding",
    );
  const counts = Object.fromEntries(findingClasses.map((name) => [name, 0]));
  const unclassed = [];
  for (const entry of entries) {
    const classed = classes.includes(entry.class);
    counts[classed ? entry.class : "unclassed"]++;
    if (!classed)
      unclassed.push({ id: entry.id, blocking: entry.route === "blocking" });
  }
  return { measured: true, counts, unclassed };
}

/** The one advisory a result prints for a reading, or null. */
export function findingsAdvisory(findings) {
  if (!findings.measured)
    return `${findings.cause}; its finding counts are recorded as unmeasured. A report lists its findings in one block: ${findingsFormat}.`;
  if (!findings.unclassed.length) return null;
  const named = [true, false]
    .map((blocking) => [
      blocking ? "blocking finding" : "finding",
      findings.unclassed
        .filter((finding) => finding.blocking === blocking)
        .map((finding) => finding.id),
    ])
    .filter(([, ids]) => ids.length)
    .map(
      ([noun, ids]) =>
        `${noun}${ids.length === 1 ? "" : "s"} ${ids.join(", ")}`,
    )
    .join(" and ");
  return `${named} ${findings.unclassed.length === 1 ? "has" : "have"} no class or one outside ${classes.join(", ")}; counted as unclassed.`;
}

/** The block's form as an advisory states it, for a report that has none. */
export const findingsBlockFormat = findingsFormat;
/** What a blocking entry adds to the block's form. */
export const BASIS_FORMS =
  '"basis": {"criterion": "<id>"} or {"regression": "<the behavior main had>"} and a "reproduction" path';

/**
 * A blocking entry's basis as the one rule reads it: `{criterion}` naming a
 * criterion id (a number is read as its digits), `{regression}` naming the
 * behavior main had, or null when the entry gives neither exactly. Both the
 * fail's judgment and the advisories below read a basis only through this.
 */
export function blockingBasis(entry) {
  const basis = entry?.basis;
  if (basis === null || typeof basis !== "object" || Array.isArray(basis))
    return null;
  const keys = Object.keys(basis);
  if (keys.length !== 1) return null;
  if (keys[0] === "criterion") {
    const id =
      Number.isSafeInteger(basis.criterion) && basis.criterion > 0
        ? String(basis.criterion)
        : basis.criterion;
    return typeof id === "string" && CRITERION_ID.test(id)
      ? { criterion: id }
      : null;
  }
  if (keys[0] === "regression" && oneLine(basis.regression))
    return { regression: basis.regression };
  return null;
}

/**
 * A blocking finding names its basis, the criterion it fails or the behavior
 * main had that the change broke, and its reproduction, a file under the
 * order's evidence directory. A missing or malformed basis advises and never
 * refuses: only a fail's agreement with its own lines is refused. `declared`
 * is the order's criterion ids, or null when they cannot be read; `met` is
 * the criteria the same report judges met, which a basis contradicts. A
 * report's problems make one advisory, or none.
 */
export function blockingBasisAdvisories(
  entries,
  { declared = null, met = [], evidenceRoot, exists = () => true },
) {
  const advisories = [];
  for (const entry of entries) {
    if (entry.route !== "blocking") continue;
    const problems = [];
    const basis = blockingBasis(entry);
    if (!basis) problems.push(`no basis (${BASIS_FORMS})`);
    else if (basis.criterion !== undefined) {
      if (declared !== null && !declared.includes(basis.criterion))
        problems.push(
          `a basis criterion ${basis.criterion} the order does not declare`,
        );
      else if (met.includes(basis.criterion))
        problems.push(
          `a basis criterion ${basis.criterion} the report judges met`,
        );
    }
    const path = entry.reproduction;
    if (
      typeof path !== "string" ||
      posix.normalize(path) !== path ||
      !path.startsWith(`${evidenceRoot}/`)
    )
      problems.push(`no reproduction path under ${evidenceRoot}/`);
    else if (!exists(path))
      problems.push(`a reproduction ${path} that is not a file`);
    if (problems.length)
      advisories.push(
        `blocking finding ${entry.id} has ${problems.join(" and ")}`,
      );
  }
  return advisories.length
    ? [`${advisories.join("; ")}; the result records all the same`]
    : [];
}

export const measuredFindingCounts = (event) =>
  findingClasses.every(
    (name) =>
      Number.isSafeInteger(event.findingCounts?.[name]) &&
      event.findingCounts[name] >= 0,
  )
    ? event.findingCounts
    : null;
