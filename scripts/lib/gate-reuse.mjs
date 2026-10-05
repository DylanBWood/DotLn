// One code identity serves the runner, claim checks and publication. A runner
// may compose individual executed passes; a claim consumes its complete row.
// Import the skeleton lazily so a copied control plane still loads without it.
import { mainWorktree } from "./git.mjs";
import { createHash } from "node:crypto";
import { lstatSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { join } from "node:path";

/**
 * One digest over every regular file under a build row's declared outputs,
 * by path and bytes. The outputs are ignored files, so the code identity
 * cannot speak for them: a build's executed result records this digest, and
 * its pass is carried beside a task that runs only while the output on disk
 * still has it. A `*` segment matches each directory name; a plain file
 * beside the matched directories is not output. An absent output contributes
 * nothing, so a missing build differs from every published one.
 *
 * There is no digest, and so no attestation, for a row with no `outputs`
 * declaration, for a declaration that names files and matches none, and for
 * an output holding a symbolic link or special file, whose content these
 * bytes would not cover. An empty list declares a build that publishes
 * nothing and is attested trivially. Finder metadata is not output.
 */
export function buildOutputDigest(root, outputs) {
  if (!Array.isArray(outputs)) return undefined;
  const files = [];
  let coverable = true;
  // A path through a plain file names nothing, as an absent path does.
  const entry = (absolute) => {
    try {
      return lstatSync(absolute, { throwIfNoEntry: false });
    } catch (error) {
      if (error.code === "ENOTDIR") return undefined;
      throw error;
    }
  };
  const collect = (absolute, path) => {
    const stat = entry(absolute);
    if (!stat) return;
    if (stat.isDirectory())
      for (const name of readdirSync(absolute))
        collect(join(absolute, name), `${path}/${name}`);
    else if (!stat.isFile()) coverable = false;
    else if (!path.endsWith("/.DS_Store"))
      files.push([path, readFileSync(absolute)]);
  };
  const expand = (absolute, path, segments) => {
    if (!segments.length) return collect(absolute, path);
    const [segment, ...rest] = segments;
    if (segment !== "*")
      return expand(join(absolute, segment), `${path}/${segment}`, rest);
    if (!entry(absolute)?.isDirectory()) return;
    for (const child of readdirSync(absolute, { withFileTypes: true }))
      if (child.isDirectory())
        expand(join(absolute, child.name), `${path}/${child.name}`, rest);
      else if (child.isSymbolicLink()) coverable = false;
  };
  for (const output of outputs)
    expand(root, "", output.split("/").filter(Boolean));
  if (!coverable || (outputs.length && !files.length)) return undefined;
  const digest = createHash("sha256").update("dotln-build-output-v1\0");
  for (const [path, bytes] of files.sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0,
  ))
    digest.update(`${path}\0${bytes.length}\0`).update(bytes);
  return digest.digest("hex");
}

/** The executed build result still describes the output on disk. An output
 * that cannot be read, for instance while another process replaces it, is
 * not attested. */
export function buildOutputAttested(root, row, result) {
  try {
    return (
      typeof result?.outputDigest === "string" &&
      result.outputDigest === buildOutputDigest(root, row.outputs)
    );
  } catch {
    return false;
  }
}

/** The rule `partialGateCheck` applies in the skeleton's gate-evidence module,
 * restated here for the same reason the control fold restates it: any shape
 * of either field other than absent, `false` or an empty list is partial. */
const partialRow = (row) =>
  (row.partial !== undefined && row.partial !== false) ||
  (row.excludedSuites !== undefined &&
    !(Array.isArray(row.excludedSuites) && row.excludedSuites.length === 0));

/** The row shape publication already relies on: executed, passing, whole. */
export const completePassingRow = (row) =>
  row.executed === true &&
  row.exitCode === 0 &&
  !row.stopped &&
  !row.timedOut &&
  !row.failureKind &&
  row.identityUnchanged !== false &&
  row.buildOutputUnchanged !== false &&
  !row.memory?.failure &&
  !row.abandonedRoots?.length &&
  !partialRow(row) &&
  Number.isFinite(row.durationMs) &&
  row.durationMs >= 0 &&
  typeof row.evidenceRef === "string" &&
  row.evidenceRef.length > 0;

/** The main checkout a linked worktree may consult. A standalone fixture, the
 * main checkout itself and a registered main whose directory cannot be
 * resolved all leave the lookup with the worktree's own rows. */
const consultableMain = (root) => {
  try {
    const main = mainWorktree(root);
    return realpathSync(main) === realpathSync(root) ? undefined : main;
  } catch {
    return undefined;
  }
};

/** The document gate follows document bytes the code identity excludes. It is
 * never reused and every completion judges it fresh, so its rows neither
 * supply a pass here nor displace one. */
const DOCUMENT_GATE = "npm run test:docs";

/** Rows at one identity: those of the check a claim names, which alone can
 * supply a pass, and those of the other runs recorded there (a single suite,
 * the machinery inventory, a confined partial), whose results still say how
 * a task last ran. Main's index is read at most once, and only when a caller
 * asks; reads never modify main or copy its index here. */
async function identityRows(root, checkId, codeIdentity) {
  const { gateCodeIdentity, readGateChecks } =
    await import("./gate-evidence.mjs");
  const identity = codeIdentity ?? gateCodeIdentity(root);
  const at = (path) => {
    const rows = readGateChecks(path).filter(
      (row) => row.codeIdentity === identity,
    );
    return {
      rows: rows.filter((row) => row.checkId === checkId),
      other: rows.filter(
        (row) => row.checkId !== checkId && row.checkId !== DOCUMENT_GATE,
      ),
    };
  };
  const here = at(root);
  let main;
  return {
    identity,
    local: here.rows,
    localOther: here.other,
    main() {
      if (main === undefined) {
        const path = consultableMain(root);
        main = path ? at(path) : null;
      }
      return main;
    },
  };
}

/** A worktree with no local observation at this identity may consult main's
 * index. */
export async function gateCandidates(root, checkId, codeIdentity) {
  const index = await identityRows(root, checkId, codeIdentity);
  const main = index.local.length ? null : index.main();
  return main
    ? { codeIdentity: index.identity, rows: main.rows, location: "main" }
    : { codeIdentity: index.identity, rows: index.local, location: "worktree" };
}

/** Row integrity applies to executions under every check, including runs
 * that supply no pass to the product gate. */
const intactExecutionRow = (row) =>
  row.identityUnchanged !== false &&
  row.buildOutputUnchanged !== false &&
  row.buildOutputAttested !== false &&
  !row.stopped &&
  !row.failureKind &&
  !row.timedOut &&
  !row.memory?.failure &&
  !row.abandonedRoots?.length &&
  (row.exitCode === 0 || row.identityUnchanged === true) &&
  Number.isFinite(row.durationMs) &&
  row.durationMs >= 0 &&
  Boolean(row.evidenceRef) &&
  Number.isFinite(Date.parse(row.recordedAt)) &&
  Array.isArray(row.requiredSuites);

/** Passing tasks from a failed attempt are usable only when that attempt
 * ended at the code identity it started with and retained its attested build
 * output. Partial attempts supply no pass even when their execution is intact. */
const carriableRow = (row) => !partialRow(row) && intactExecutionRow(row);

const passingResult = (result) =>
  result.exitCode === 0 &&
  !result.failureKind &&
  !result.stopped &&
  !partialRow(result) &&
  !result.timedOut &&
  Number.isFinite(result.durationMs) &&
  result.durationMs >= 0;

/** The execution of `name` that finished last among these rows. A result
 * carried from another row and a task that never started are not executions:
 * they neither supply a pass nor displace one. A run recorded under another
 * check answers no claim and supplies nothing. When the task's latest run
 * there did not pass, and no gate execution finished after it, that failure
 * is the task's latest run; when it passed, the latest gate execution
 * decides as if the other runs had not happened. Overlapping gates are
 * ordered by when the task finished, then by when its row was recorded.
 * `citesMain` reports a carried result this worktree took from main. */
function latestExecution(rows, other, name, identity) {
  let latest,
    elsewhere,
    citesMain = false;
  const ordered = [
    ...rows.map((row) => [row, true]),
    ...other.map((row) => [row, false]),
  ].sort(([a], [b]) =>
    String(a.recordedAt ?? "").localeCompare(String(b.recordedAt ?? "")),
  );
  for (const [row, supplies] of ordered) {
    if (row.executed !== true) continue;
    const observed = row.taskTimeline ?? row.cases;
    if (!Array.isArray(observed)) continue;
    const named = observed.filter((result) => result?.name === name);
    if (!named.length) continue;
    // A row that repeats a name cannot say which result ran: it counts as an
    // execution of every task it names and supplies nothing.
    const [result] =
      new Set(observed.map((entry) => entry?.name)).size === observed.length
        ? named
        : [];
    if (result?.reused) {
      citesMain ||=
        supplies &&
        result.sourceRow?.location === "main" &&
        result.sourceRow.task === name &&
        result.sourceRow.codeIdentity === identity;
      continue;
    }
    if (result && result.executed !== true) continue;
    if (!supplies && !result) continue;
    const recorded = Date.parse(row.recordedAt);
    const finished = Date.parse(result?.finishedAt);
    const at = Number.isFinite(finished) ? finished : recorded;
    // Rows arrive in recorded order, so an equal finish keeps the later row.
    if (!supplies) {
      if (!elsewhere || !(at < elsewhere.at))
        elsewhere = {
          row,
          at,
          passed: intactExecutionRow(row) && passingResult(result),
        };
    } else if (!latest || !(at < latest.at)) latest = { row, result, at };
  }
  if (elsewhere && !elsewhere.passed && !(elsewhere.at < latest?.at))
    return { row: elsewhere.row, at: elsewhere.at, citesMain };
  return { ...latest, citesMain };
}

/** One execution decision for the runner and the completion claim. The
 * worktree's own executions decide first. Main's decide for a worktree
 * with no row at the identity, and re-validate a pass an earlier row here
 * carried from main; while main cannot be consulted, such a pass has no
 * execution to stand on. */
function decidingExecution(index, name) {
  let latest = latestExecution(
      index.local,
      index.localOther,
      name,
      index.identity,
    ),
    location = "worktree";
  if (!latest.row && (!index.local.length || latest.citesMain)) {
    const main = index.main();
    if (!main) return undefined;
    latest = latestExecution(main.rows, main.other, name, index.identity);
    location = "main";
  }
  return { ...latest, location };
}

/** A deciding execution may be carried only when it finished at a known
 * time in a carriable row. */
function decidingPass(index, name, latest = decidingExecution(index, name)) {
  if (!latest) return undefined;
  const { row, result } = latest;
  return row &&
    result &&
    carriableRow(row) &&
    passingResult(result) &&
    Number.isFinite(Date.parse(result.finishedAt))
    ? { row, result, location: latest.location }
    : undefined;
}

/**
 * Each task's latest executed result at the identity decides whether it is
 * carried: a pass in a carriable row is, and a later failed, stopped or
 * timed-out run, or a later failed gate, is never masked by an older pass.
 * Every carried result names the row that executed it.
 */
export async function coveringTaskResults(root, checkId, tasks, codeIdentity) {
  const index = await identityRows(root, checkId, codeIdentity);
  const results = new Map();
  for (const task of tasks) {
    const pass = decidingPass(index, task.name);
    if (
      !pass ||
      !pass.row.requiredSuites.some(
        (name) => task.name === name || task.name.startsWith(`${name}:`),
      )
    )
      continue;
    const {
      output,
      outputRef,
      startedAt,
      finishedAt,
      predecessors,
      concurrentAtStart,
      lanes,
      schedulerDurationMs,
      hostLaneWaitMs,
      ...retained
    } = pass.result;
    results.set(task.name, {
      ...retained,
      name: task.name,
      executed: true,
      exitCode: 0,
      durationMs: 0,
      reused: true,
      sourceDurationMs: pass.result.durationMs,
      sourceRow: {
        task: task.name,
        codeIdentity: index.identity,
        treeHash: pass.row.treeHash,
        recordedAt: pass.row.recordedAt,
        evidenceRef: pass.row.evidenceRef,
        location: pass.location,
      },
    });
  }
  const main = index.local.length ? null : index.main();
  return {
    codeIdentity: index.identity,
    rows: main?.rows ?? index.local,
    location: main ? "main" : "worktree",
    results,
  };
}

/**
 * The latest complete passing row of `checkId` at `codeIdentity` that still
 * stands and whose required suites include every name in `requiredSuites`,
 * beside every standing candidate and the suites the latest one lacks, so a
 * refusal can name them. A complete row stands while each task it names has,
 * as its latest execution at the identity, that row's own result or a pass
 * that may be carried; `displaced` names the tasks of the latest complete
 * row that no longer do: a later run of the task did not pass, a later gate
 * that ran it failed, or the row that executed it cannot be read. Reading
 * the gate index may throw; the caller decides whether that is an advisory.
 */
export async function coveringGateCheck(
  root,
  checkId,
  requiredSuites,
  codeIdentity,
) {
  const index = await identityRows(root, checkId, codeIdentity);
  const main = index.local.length ? null : index.main();
  const rows = main?.rows ?? index.local;
  const decided = new Map();
  const displacedTasks = (row) => {
    const observed = row.taskTimeline ?? row.cases;
    return (Array.isArray(observed) ? observed : [])
      .map((result) => result?.name)
      .filter((name) => {
        if (!decided.has(name)) {
          const latest = decidingExecution(index, name);
          decided.set(name, {
            own: latest?.row,
            pass: decidingPass(index, name, latest),
          });
        }
        const { own, pass } = decided.get(name);
        return own !== row && !pass;
      });
  };
  const complete = rows.filter(completePassingRow);
  const candidates = complete.filter((row) => !displacedTasks(row).length);
  // A row without the field covers only an empty requirement: publication
  // accepts such a row, so a plain claim does too, while a selection's names
  // cannot be judged covered by a row that names none.
  const covers = (row) =>
    requiredSuites.every((name) =>
      (Array.isArray(row.requiredSuites) ? row.requiredSuites : []).includes(
        name,
      ),
    );
  const latest = candidates.at(-1);
  const newest = complete.at(-1);
  return {
    codeIdentity: index.identity,
    location: main ? "main" : "worktree",
    row: candidates.findLast(covers),
    candidates,
    missing: latest
      ? requiredSuites.filter(
          (name) => !(latest.requiredSuites ?? []).includes(name),
        )
      : [...requiredSuites],
    ...(newest && newest !== latest
      ? { displaced: { row: newest, tasks: displacedTasks(newest) } }
      : {}),
  };
}

/** One line a reader can act on. */
export const describeGateRow = (row) =>
  `recorded ${row.recordedAt ?? "at an unknown time"}, ${(row.durationMs / 1000).toFixed(2)} s, ${Array.isArray(row.requiredSuites) ? row.requiredSuites.length : "unknown"} suites, ${row.evidenceRef}`;
