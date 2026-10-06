// A final-review report declares its findings once, as a JSON array between two
// marker lines (the pattern of dependencies.mjs). `final-review-result` reads
// only that block: no prose line is ever counted. Counts are recorded with the
// immutable result; planning consumes the event, never reinterprets the report.
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
 * The findings a report's block declares. Every outcome is decided by the
 * block alone:
 * - no marker line, more than one start or end marker line, an end before its
 *   start, invalid JSON, a value that is not an array, or an entry that is
 *   not an object with an `id` `F<n>` (n from 1, no leading zero) no other
 *   entry has, a listed `route` and a one-line `summary`: `measured` is false
 *   and `cause` names the first such problem;
 * - a failed review whose block lists no blocking finding: unmeasured, since
 *   a review fails on one;
 * - otherwise `counts` holds one count per entry, by its `class`; an entry
 *   whose class is absent or outside the three classes counts as `unclassed`
 *   and is listed in `unclassed` with whether its route is blocking.
 * A second copy of a marker line, an example included, makes the report
 * unmeasured rather than half read.
 */
export function reviewFindings(text, { verdict } = {}) {
  const unmeasured = (cause) => ({ measured: false, cause });
  const lines = text.split(/\r\n?|\n/u);
  const at = (kind) =>
    lines.flatMap((line, index) =>
      MARKER.exec(line)?.[1].toLowerCase() === kind ? [index + 1] : [],
    );
  const starts = at("start");
  const ends = at("end");
  if (!starts.length && !ends.length)
    return unmeasured("the report has no findings block");
  if (starts.length !== 1 || ends.length !== 1 || starts[0] > ends[0]) {
    const on = (found) =>
      found.length
        ? `line${found.length === 1 ? "" : "s"} ${found.join(", ")}`
        : "no line";
    return unmeasured(
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
    return unmeasured("the findings block is not valid JSON");
  }
  if (!Array.isArray(entries))
    return unmeasured("the findings block is not a JSON array");
  const seen = new Set();
  for (const [index, entry] of entries.entries()) {
    const invalid = (problem) =>
      unmeasured(
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

export const measuredFindingCounts = (event) =>
  findingClasses.every(
    (name) =>
      Number.isSafeInteger(event.findingCounts?.[name]) &&
      event.findingCounts[name] >= 0,
  )
    ? event.findingCounts
    : null;
