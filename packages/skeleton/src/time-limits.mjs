import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { formatDuration } from "./duration.mjs";
import { configuredControlDirectory } from "./temporary-root-records.mjs";

// Every time limit that can end or fail a gate run or a bounded probe is a
// row of the table below: its key, the kit's figure in milliseconds, what it
// bounds and what passing it does. The runner, the structural checks, the
// evidence commands and the host modules read their figures here and keep
// none of their own.
//
// A root's owner changes them in one file, time-limits.json in the control
// root: `set` on a key gives that limit the owner's figure or turns it off,
// `scale` multiplies every figure and `enforce: false` turns every limit
// off. Without the file, or for a key the file leaves at "kit", the kit's
// figure applies, so a release that changes a figure reaches every root that
// had not set its own.
//
// How the figures were chosen: a step a root's own gate runs gets at least
// ten times its slowest passing time in core's gate record, a suite row gets
// at least five minutes, and a row only core's complete run uses gets at
// least three times its slowest passing time.

/** One row of the table. A `grace` row is the wait after a stop that was
 * already decided: it ends nothing on its own, so turning limits off leaves
 * it on.
 * @typedef {{ms: number, bounds: string, miss: string, grace?: true}} TimeLimitRow */

/** A row of the table for a key that names one.
 * @param {number} ms @param {string} bounds @param {string} miss
 * @returns {TimeLimitRow} */
const limit = (ms, bounds, miss) => Object.freeze({ ms, bounds, miss });
/** @param {number} ms @param {string} bounds @param {string} miss
 * @returns {TimeLimitRow} */
const grace = (ms, bounds, miss) =>
  Object.freeze({ ms, bounds, miss, grace: true });

const STRUCTURAL_MISS =
  "the row fails as time, and no later task of the selection runs";
const SUITE_MISS = "the task is ended and its row fails as time";

/** @type {Readonly<Record<string, TimeLimitRow>>} */
export const TIME_LIMITS = Object.freeze({
  "suite.format": limit(
    300_000,
    "the format row: the format check over the checkout",
    STRUCTURAL_MISS,
  ),
  "suite.configuration": limit(
    300_000,
    "the configuration row of an instance: loading its own configuration, roots and registrations",
    `in an instance ${STRUCTURAL_MISS}; in core, where it runs only by name, ${SUITE_MISS}`,
  ),
  "suite.configuration-root": limit(
    300_000,
    "the kit's tests of its configuration loader: a structural row in core, run in an instance only by name",
    `in core ${STRUCTURAL_MISS}; in an instance, where it runs only by name, ${SUITE_MISS}`,
  ),
  "suite.registrations": limit(
    300_000,
    "the registrations row: record streams and document-gate scripts are classified",
    STRUCTURAL_MISS,
  ),
  "suite.declarations": limit(
    300_000,
    "the declarations row: declared suite and fixture inputs cover their imports",
    STRUCTURAL_MISS,
  ),
  "suite.generated": limit(
    600_000,
    "the generated row: every generated-artifact check, one after another",
    STRUCTURAL_MISS,
  ),
  "suite.git-surface": limit(
    300_000,
    "core's Git surface row",
    STRUCTURAL_MISS,
  ),
  "suite.host": limit(
    300_000,
    "the host row: the runtime, Git and memory checks before any suite",
    STRUCTURAL_MISS,
  ),
  "suite.default": limit(
    2_700_000,
    "every other suite row and each file task of a suite, the kit verification and the document rows of an instance among them",
    SUITE_MISS,
  ),
  "suite.stop-grace": grace(
    1_000,
    "the pause between telling an ended task to stop and killing it",
    "the task's processes are killed",
  ),
  "suite.finish-grace": grace(
    100,
    "the pause for a task's output after it exits or is killed",
    "the row is finished without the rest of its output",
  ),
  "suite.guard-record": grace(
    1_000,
    "the wait for the host guard's record of a task it stopped",
    "the row is read without the guard's record",
  ),
  "generated.check": limit(
    180_000,
    "each generated-artifact check, in the generated row and in npm run sync",
    "the check is ended and reported as time; the generated row fails, and sync leaves that artifact unwritten",
  ),
  "generated.runtime-build": limit(
    120_000,
    "core's build of a stale compiled runtime before a selection",
    "the build is ended; the generated check then judges the runtime",
  ),
  "sync.format": limit(
    300_000,
    "the format check and the format write of npm run sync",
    "the step is ended; sync reports the format unread and writes nothing for it",
  ),
  "sync.write": limit(
    300_000,
    "each other writer npm run sync runs: an artifact's regeneration or an evidence edition's mint",
    "the writer is ended; sync reports that artifact unwritten",
  ),
  "license.dry-run": limit(
    240_000,
    "each package's publish dry run in the license check",
    "the dry run is ended and its rule fails, so the license row fails",
  ),
  "index.preflight-suites": limit(
    120_000,
    "the work-order index check's read of the runner's suite names",
    "the index check fails, so the generated row fails",
  ),
  "evidence.npm-test": limit(
    3_600_000,
    "the npm test run of node scripts/harness.mjs evidence",
    "the run is ended and the evidence check fails",
  ),
  "evidence.diff-check": limit(
    150_000,
    "the git diff --check run of node scripts/harness.mjs evidence",
    "the run is ended and the evidence check fails",
  ),
  "evidence.stop-wait": limit(
    20_000,
    "the wait of node scripts/harness.mjs evidence --stop for running gates to end",
    "the command reports the gates still running; run it again to keep waiting",
  ),
  "evidence.record-lock": limit(
    30_000,
    "the wait for the lock on the gate record while a row is written",
    "the row is not recorded and the command that wrote it fails",
  ),
  "evidence.owner-start": limit(
    1_000,
    "the read of a gate owner's start time from the process table, in a gate and in every write or shell hook, whose own bound is fixed",
    "the owner is judged alive by signal alone",
  ),
  "probe.command": limit(
    900_000,
    "a command under node scripts/harness.mjs bounded with no --timeout-seconds",
    "the command is ended and the probe fails as time",
  ),
  "probe.test-selection": limit(
    21_600_000,
    "a test selection under node scripts/harness.mjs bounded, complete or by name; each task inside it keeps its own limit",
    "the selection is ended and the probe fails as time",
  ),
  "host.temp-root": limit(
    2_000,
    "the read of the user's temporary directory, where gates, probes and the guard keep host state; a dispatch reads it too, under the hook's own fixed bound",
    "the gate, probe or guard that asked fails before it starts",
  ),
  "host.census": limit(
    10_000,
    "each native process census of the memory monitor",
    "every running task fails as monitor-unavailable",
  ),
  "host.footprint-fallback": limit(
    20_000,
    "the top reading used when a full census fails",
    "the census fails as monitor-unavailable",
  ),
  "host.pressure-reading": limit(
    10_000,
    "each sysctl reading of that fallback",
    "the reading is recorded as unavailable",
  ),
  "host.descriptor-capture": limit(
    10_000,
    "the descriptor capture at each task's launch",
    "the task fails as monitor-unavailable before it runs",
  ),
  "host.sdk-path": limit(
    60_000,
    "the read of the compiler's SDK path before a native helper is compiled",
    "no native helper is compiled and no gate task can start",
  ),
  "host.helper-compile": limit(
    120_000,
    "the compile of a native helper, once per host and per helper source",
    "no native helper is compiled and no gate task can start",
  ),
  "host.file-events-sample": limit(
    10_000,
    "the sample of the file-events daemon in the host row",
    "the sample is reported as not taken; nothing is refused",
  ),
  "host.lane-reader": limit(
    10_000,
    "the process read of node scripts/harness.mjs lanes",
    "the command reports the reader unavailable",
  ),
  "host.git-version": limit(
    30_000,
    "the read of the running Git's version",
    "the host row, harness check and every test selection refuse with Git unread",
  ),
  "guard.startup": limit(
    5_000,
    "the wait for the host guard to start before a gate or a probe, and at a dispatch under the hook's own fixed bound",
    "the gate or probe fails before any task",
  ),
  "guard.child-stop": grace(
    1_000,
    "the pause between telling an unneeded guard process to stop and killing it",
    "that process is killed",
  ),
  "guard.runner-stop": grace(
    1_000,
    "the guard's pause between telling a gate's runner to stop and killing it",
    "the runner's processes are killed",
  ),
});

/** The instance's file, in the control root. */
export const TIME_LIMITS_FILE = "time-limits.json";
/** The command that lists every key with the figure that applies. */
export const TIME_LIMITS_COMMAND = "npm run limits";
// The longest delay a Node timer holds.
const TIMER_MAXIMUM_MS = 2_147_483_647;
const ABOUT =
  "Time limits of this root's gate, in milliseconds. set: your own figure, null to turn that limit off, or \"kit\" to follow the kit's figure through releases. kit: the kit's figure when this file was last written; nothing reads it. scale multiplies every figure, and enforce false turns every limit off. npm run limits lists what applies; npm run limits -- --write adds a new release's keys and refreshes kit.";

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);
/** @param {unknown} value */
const usableFigure = (value) =>
  typeof value === "number" && Number.isFinite(value) && value > 0;
/** @param {unknown} value */
const shown = (value) => JSON.stringify(value) ?? String(value);

/** A figure as a reader meets it: hours and minutes from a minute up, and
 * always the milliseconds the file holds.
 * @param {number} ms */
export const describeTimeLimit = (ms) =>
  ms >= 60_000 ? `${formatDuration(ms)} (${ms} ms)` : `${ms} ms`;

/** The root-relative path of a root's file, and why it could not be placed
 * when its configuration cannot be read.
 * @param {string} root @returns {{file: string, advisory?: string}} */
function locate(root) {
  try {
    return { file: `${configuredControlDirectory(root)}/${TIME_LIMITS_FILE}` };
  } catch (error) {
    return {
      file: `docs/control/${TIME_LIMITS_FILE}`,
      advisory: `the control root cannot be read from dotln.config.json (${/** @type {Error} */ (error).message}); the kit's time limits apply`,
    };
  }
}

/** The root-relative path of the file that sets a root's time limits.
 * @param {string} root */
export const timeLimitsPath = (root) => locate(root).file;

/** @typedef {{ms: number|null, kitMs: number, set: unknown, source: "kit"|"set"|"off"|"enforce"}} ResolvedTimeLimit */
/** @typedef {{file: string, present: boolean, enforce: boolean, scale: number, limits: Record<string, ResolvedTimeLimit>, unknown: string[], advisories: string[]}} ResolvedTimeLimits */

/** Resolve every key of `table` against a file's parsed content. Each value
 * the resolver cannot use is named in one advisory and the kit's value
 * applies in its place.
 * @param {string} file @param {unknown} content
 * @param {Readonly<Record<string, TimeLimitRow>>} table
 * @returns {Omit<ResolvedTimeLimits, "present">} */
function resolve(file, content, table) {
  /** @type {string[]} */
  const advisories = [];
  /** @param {string} what */
  const unusable = (what) =>
    advisories.push(`${file}: ${what}; the kit's value applies`);
  let source = isObject(content) ? content : {};
  if (content !== undefined && !isObject(content))
    unusable(`the file holds ${shown(content)}, not an object`);
  else if (
    content !== undefined &&
    source.schemaVersion !== undefined &&
    source.schemaVersion !== 1
  ) {
    unusable(
      `schemaVersion ${shown(source.schemaVersion)} is not one this kit reads`,
    );
    source = {};
  }
  let enforce = true;
  if (typeof source.enforce === "boolean") enforce = source.enforce;
  else if (source.enforce !== undefined)
    unusable(`enforce ${shown(source.enforce)} is neither true nor false`);
  let scale = 1;
  if (usableFigure(source.scale)) scale = /** @type {number} */ (source.scale);
  else if (source.scale !== undefined)
    unusable(`scale ${shown(source.scale)} is not a number above zero`);
  let entries = /** @type {Record<string, unknown>} */ ({});
  if (isObject(source.limits)) entries = source.limits;
  else if (source.limits !== undefined)
    unusable(`limits ${shown(source.limits)} is not an object`);
  const unknown = Object.keys(entries).filter(
    (key) => !Object.hasOwn(table, key),
  );
  if (unknown.length)
    advisories.push(
      `${file}: ${unknown.map((key) => shown(key)).join(", ")} ${unknown.length === 1 ? "names" : "name"} no time limit of this kit and ${unknown.length === 1 ? "changes" : "change"} nothing; ${TIME_LIMITS_COMMAND} lists the keys`,
    );
  // A pause after a stop grows with the scale and is never shortened by it:
  // it ends only what was already ended, so less of it buys nothing and
  // would cut off a stopped task's last output.
  /** @param {number} ms @param {boolean} [pause] */
  const applied = (ms, pause = false) =>
    Math.min(
      TIMER_MAXIMUM_MS,
      Math.max(1, Math.round(ms * (pause ? Math.max(1, scale) : scale))),
    );
  /** @type {Record<string, ResolvedTimeLimit>} */
  const limits = {};
  for (const [key, row] of Object.entries(table)) {
    const entry = entries[key];
    let set = /** @type {unknown} */ ("kit");
    if (isObject(entry)) set = entry.set === undefined ? "kit" : entry.set;
    else if (entry !== undefined) {
      unusable(`limits.${key} ${shown(entry)} is not an object`);
    }
    if (set !== "kit" && set !== null && !usableFigure(set)) {
      unusable(
        `limits.${key}.set ${shown(set)} is not a number of milliseconds above zero, null or "kit"`,
      );
      set = "kit";
    }
    if (set === null && row.grace) {
      unusable(`limits.${key}.set null cannot turn off the pause after a stop`);
      set = "kit";
    }
    limits[key] =
      set === null
        ? { ms: null, kitMs: row.ms, set, source: "off" }
        : !enforce && !row.grace
          ? { ms: null, kitMs: row.ms, set, source: "enforce" }
          : set === "kit"
            ? {
                ms: applied(row.ms, row.grace),
                kitMs: row.ms,
                set,
                source: "kit",
              }
            : {
                ms: applied(/** @type {number} */ (set), row.grace),
                kitMs: row.ms,
                set,
                source: "set",
              };
  }
  return { file, enforce, scale, limits, unknown, advisories };
}

/** The last reading of each root's file, kept while the configuration's and
 * the file's identity stand: the memory monitor asks at every sample, and a
 * reading that stands parses nothing.
 * @type {Map<string, {configuration: string, placed: {file: string, advisory?: string}, identity: string, resolved: ResolvedTimeLimits}>} */
const readings = new Map();

/** @param {string} path */
const identity = (path) => {
  const info = statSync(path, { throwIfNoEntry: false });
  return info
    ? `${info.dev}:${info.ino}:${info.mtimeMs}:${info.size}`
    : "absent";
};

/** Every time limit as it applies in `root`: the kit's figures, changed by
 * the root's file where it is present and usable. Nothing here throws for
 * the file's content, and nothing is printed: a value that cannot be used is
 * an advisory of the reading.
 * @param {string} root
 * @param {{table?: Readonly<Record<string, TimeLimitRow>>}} [options]
 * @returns {ResolvedTimeLimits} */
export function timeLimits(root, { table = TIME_LIMITS } = {}) {
  const configuration = identity(join(root, "dotln.config.json"));
  const kept = table === TIME_LIMITS ? readings.get(root) : undefined;
  const placed =
    kept?.configuration === configuration ? kept.placed : locate(root);
  const path = join(root, placed.file);
  const current = identity(path);
  if (kept?.configuration === configuration && kept.identity === current)
    return kept.resolved;
  /** @type {unknown} */
  let content;
  let present = false;
  /** @type {string[]} */
  const unread = placed.advisory ? [placed.advisory] : [];
  // With the control root unread the file's place is not known, so no file
  // is read and the kit's figures apply, as that advisory says.
  if (!placed.advisory)
    try {
      content = JSON.parse(readFileSync(path, "utf8"));
      present = true;
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code !== "ENOENT") {
        present = true;
        unread.push(
          `${placed.file}: the file cannot be read (${/** @type {Error} */ (error).message}); the kit's time limits apply`,
        );
      }
    }
  const resolved = resolve(placed.file, content, table);
  const result = {
    ...resolved,
    present,
    advisories: [...unread, ...resolved.advisories],
  };
  if (table === TIME_LIMITS)
    readings.set(root, {
      configuration,
      placed,
      identity: current,
      resolved: result,
    });
  return result;
}

/** The environment variable through which a command tells the processes it
 * starts that it has printed a root's advisories, so that one unusable value
 * is named once for the whole command. */
const ADVISED = "DOTLN_TIME_LIMITS_ADVISED";

/** Print a root's advisories, once for the command that calls this and the
 * processes it starts. Reading a limit prints nothing: the commands a person
 * or a session starts (the runner, the bounded wrapper, the sync) call this
 * where they begin, and the listing prints them in its own text.
 * @param {string} root
 * @param {{env?: NodeJS.ProcessEnv, print?: (line: string) => void, table?: Readonly<Record<string, TimeLimitRow>>}} [options] */
export function reportTimeLimitAdvisories(
  root,
  { env = process.env, print = (line) => console.error(line), table } = {},
) {
  const { advisories } = timeLimits(root, table ? { table } : {});
  if (!advisories.length) return;
  const mark = createHash("sha256")
    .update([root, ...advisories].join("\n"))
    .digest("hex")
    .slice(0, 16);
  if (env[ADVISED] === mark) return;
  env[ADVISED] = mark;
  for (const text of advisories) print(`ADVISORY time limits: ${text}`);
}

/** One digest of every figure in force in `root`, or undefined where each is
 * the kit's own. A gate row records it beside its code identity: a passing
 * result says what it says only under the limits it ran under, so a pass is
 * carried, and a complete row stands, only where this digest is the one the
 * row recorded. It is taken over the figures that apply and not over the
 * file's bytes: a note, a refreshed `kit` or a `set` equal to the kit's
 * figure changes nothing, while a raised or lowered key, a scale, a limit
 * turned off and `enforce: false` each change it. Undefined for the kit's
 * figures is what a row that names no limits records, since the runner
 * writes the field only where a root's file changed a figure.
 * @param {string} root
 * @param {{table?: Readonly<Record<string, TimeLimitRow>>}} [options]
 * @returns {string|undefined} */
export function timeLimitsDigest(root, options) {
  const { limits } = timeLimits(root, options);
  // Each key with the kit's figure and the one that applies, in key order.
  const figures = Object.entries(options?.table ?? TIME_LIMITS)
    .map(([key, row]) => ({ key, kit: row.ms, ms: limits[key]?.ms ?? null }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  if (figures.every(({ kit, ms }) => ms === kit)) return undefined;
  const digest = createHash("sha256").update("dotln-time-limits-v1\0");
  for (const { key, ms } of figures) digest.update(`${key}\0${ms ?? "off"}\0`);
  return digest.digest("hex");
}

/** The figure in milliseconds that applies to `key` in `root`, or null where
 * the root has turned that limit off. Callers pass it to a child's `timeout`
 * as it is (null sets none) and start no timer for null.
 * @param {string} root @param {string} key
 * @param {{table?: Readonly<Record<string, TimeLimitRow>>}} [options]
 * @returns {number|null} */
export function timeLimit(root, key, options) {
  const entry = timeLimits(root, options).limits[key];
  if (!entry) throw new Error(`Unknown time limit: ${key}`);
  return entry.ms;
}

/** Whether a child's result, or the error its start threw, says the child
 * was ended at its `timeout`.
 * @param {unknown} outcome */
export const endedForTime = (outcome) => {
  const read =
    /** @type {{code?: unknown, error?: {code?: unknown}}|null|undefined} */ (
      outcome
    );
  return read?.code === "ETIMEDOUT" || read?.error?.code === "ETIMEDOUT";
};

/** The key of a suite row's limit: its own where the table has a row for its
 * suite, the default otherwise. A task of an expanded suite follows its
 * suite's name. A suite's name never reaches the default row's key or a
 * pause after a stop, whatever the suite is called.
 * @param {string} name */
export const suiteTimeLimitKey = (name) => {
  const key = `suite.${name.split(":")[0]}`;
  const row = Object.hasOwn(TIME_LIMITS, key) ? TIME_LIMITS[key] : undefined;
  return row && key !== "suite.default" && !row.grace ? key : "suite.default";
};

/** What a step that was ended for time says: its key, the figure that
 * applied, the file that changes it and the command that lists the keys.
 * @param {string} root @param {string} key @param {number|null} [ms] */
export function timeLimitMiss(root, key, ms = timeLimit(root, key)) {
  return `Time limit ${key} reached${ms === null ? "" : `: ${describeTimeLimit(ms)}`}. ${timeLimitsPath(root)} raises it, scales every limit or turns them off; ${TIME_LIMITS_COMMAND} lists every key.`;
}

/** The text of a root's file with every key of the table. What its owner
 * wrote is written back as it stood, even where the resolver cannot use it:
 * `enforce`, `scale`, any field of the owner's own, and each entry, of which
 * an object keeps its `set` and its other fields and takes the table's
 * figure as `kit`, and anything else is left for the resolver to name.
 * Entries this kit has no limit for are kept after the table's.
 * @param {unknown} [previous]
 * @param {{table?: Readonly<Record<string, TimeLimitRow>>}} [options] */
export function renderTimeLimits(previous, { table = TIME_LIMITS } = {}) {
  const source = isObject(previous) ? previous : {};
  const entries = isObject(source.limits) ? source.limits : {};
  /** @type {Record<string, unknown>} */
  const limits = {};
  for (const [key, row] of Object.entries(table)) {
    const entry = entries[key];
    if (entry === undefined) limits[key] = { set: "kit", kit: row.ms };
    else if (isObject(entry)) {
      const { set, kit: _kit, ...own } = entry;
      limits[key] = {
        set: set === undefined ? "kit" : set,
        kit: row.ms,
        ...own,
      };
    } else limits[key] = entry;
  }
  for (const [key, entry] of Object.entries(entries))
    if (!Object.hasOwn(table, key)) limits[key] = entry;
  const {
    schemaVersion: _schemaVersion,
    about: _about,
    enforce,
    scale,
    limits: _limits,
    ...own
  } = source;
  return `${JSON.stringify(
    {
      schemaVersion: 1,
      about: ABOUT,
      enforce: enforce === undefined ? true : enforce,
      scale: scale === undefined ? 1 : scale,
      ...own,
      limits,
    },
    null,
    2,
  )}\n`;
}
