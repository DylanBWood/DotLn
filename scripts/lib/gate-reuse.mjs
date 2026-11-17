// One code identity serves the runner, claim checks and publication. A runner
// may compose individual executed passes; a claim consumes its complete row.
// Import the skeleton's gate evidence (./gate-evidence.mjs, below) lazily so
// a copied control plane still loads without it.
import { mainWorktree } from "./git.mjs";
import { isKitRoot } from "../../packages/skeleton/src/runtime-inputs.mjs";
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
  row.buildOutputAttested !== false &&
  !row.memory?.failure &&
  !row.abandonedRoots?.length &&
  !partialRow(row) &&
  Number.isFinite(row.durationMs) &&
  row.durationMs >= 0 &&
  Number.isFinite(Date.parse(row.recordedAt)) &&
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

/** The document gate follows document bytes the code identity excludes.
 * Completion consumes its newest passing row recorded for the working tree as
 * it stands; its rows neither supply a product pass here nor displace one. */
const DOCUMENT_GATE = "npm run test:docs";

/** Rows at one identity: those of the check a claim names, which alone can
 * supply a pass, and those of the other runs recorded there (a single suite,
 * the machinery inventory, a confined partial), whose results still say how
 * a task last ran. Main's index is read at most once, and only when a caller
 * asks; reads never modify main or copy its index here. Rows recorded under
 * time limits other than those in force here stay among them, since a later
 * run still displaces an older pass whatever limits it ran under, and
 * `ranUnderLimits` tells which of them may supply one. */
async function identityRows(root, checkId, codeIdentity) {
  const {
    gateCodeIdentity,
    readGateChecks,
    gateInstanceInputDigest,
    gateTimeLimitsDigest,
    ranUnderTimeLimits,
    latestGateExecution,
    intactGateExecutionRow,
    passingGateResult,
    missingGateSuites,
  } = await import("./gate-evidence.mjs");
  const identity = codeIdentity ?? gateCodeIdentity(root);
  const instanceInputDigest = gateInstanceInputDigest(root);
  // The limits this root's next run would start under. Main's rows are
  // judged against them too: a pass main recorded under its own figures is
  // carried here only where this root applies the same ones.
  const limits = gateTimeLimitsDigest(root);
  const at = (path) => {
    const rows = readGateChecks(path).filter(
      (row) =>
        !row.stopped &&
        row.codeIdentity === identity &&
        (instanceInputDigest === undefined ||
          row.instanceInputDigest === instanceInputDigest),
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
    limits,
    ranUnderLimits: (row) => ranUnderTimeLimits(row, limits),
    latestExecution: latestGateExecution,
    intactExecutionRow: intactGateExecutionRow,
    passingResult: passingGateResult,
    missingSuites: missingGateSuites,
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

/** One execution decision for the runner and the completion claim. The
 * worktree's own executions decide first. Main's decide for a worktree
 * with no row at the identity, and re-validate a pass an earlier row here
 * carried from main; while main cannot be consulted, such a pass has no
 * execution to stand on. */
function decidingExecution(index, name) {
  let latest = index.latestExecution(
      index.local,
      index.localOther,
      name,
      index.identity,
    ),
    location = "worktree";
  if (!latest.row && (!index.local.length || latest.citesMain)) {
    const main = index.main();
    if (!main) return undefined;
    latest = index.latestExecution(main.rows, main.other, name, index.identity);
    location = "main";
  }
  return { ...latest, location };
}

/** A deciding execution that passed and finished at a known time in a
 * carriable row, whatever time limits that row ran under. */
function executedPass(index, latest, legacyOwn = false) {
  if (!latest) return undefined;
  const { row, result } = latest;
  return row &&
    result &&
    !partialRow(row) &&
    index.intactExecutionRow(
      legacyOwn ? { ...row, requiredSuites: [] } : row,
    ) &&
    index.passingResult(result) &&
    Number.isFinite(Date.parse(result.finishedAt)) &&
    Date.parse(result.finishedAt) <= Date.parse(row.recordedAt)
    ? { row, result, location: latest.location }
    : undefined;
}

/** A deciding execution may be carried only when it passed in a carriable
 * row that ran under the time limits in force: under other figures its pass
 * says nothing of what these would do. */
function decidingPass(
  index,
  name,
  latest = decidingExecution(index, name),
  legacyOwn = false,
) {
  const pass = executedPass(index, latest, legacyOwn);
  return pass && index.ranUnderLimits(pass.row) ? pass : undefined;
}

/**
 * Each task's latest executed result at the identity decides whether it is
 * carried: a pass in a carriable row is, and a later failed, stopped or
 * timed-out run, or a later failed gate, is never masked by an older pass.
 * A pass recorded under time limits other than those in force is not
 * carried, and `otherLimits` names its task, so the task runs under the
 * figures that apply now and its record names them. Every carried result
 * names the row that executed it.
 */
export async function coveringTaskResults(root, checkId, tasks, codeIdentity) {
  const index = await identityRows(root, checkId, codeIdentity);
  const results = new Map();
  const otherLimits = [];
  for (const task of tasks) {
    const pass = executedPass(index, decidingExecution(index, task.name));
    if (
      !pass ||
      !pass.row.requiredSuites.some(
        (name) => task.name === name || task.name.startsWith(`${name}:`),
      )
    )
      continue;
    if (!index.ranUnderLimits(pass.row)) {
      otherLimits.push(task.name);
      continue;
    }
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
      hostLaneWaitObservations,
      hostLaneWaitRelations,
      hostLaneWait,
      hostLaneSlots,
      laneWaitMs,
      gapMs,
      criticalPath,
      // The source run's suite-end cleanup, not this run's.
      temporaryRootsRemoved,
      temporaryCleanupAdvisory,
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
    otherLimits,
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
 * that ran it failed, or the row that executed it cannot be read. Only a row
 * recorded under the time limits in force can stand; `otherLimits` is the
 * newest passing complete row at the identity recorded under other limits,
 * or while they changed, so a refusal can say why it does not count. Reading
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
    const invalid = (Array.isArray(observed) ? observed : [])
      .map((result) => result?.name)
      .filter((name) => {
        const result = observed.find((entry) => entry?.name === name);
        if (
          typeof name !== "string" ||
          Date.parse(result?.finishedAt) > Date.parse(row.recordedAt)
        )
          return true;
        if (!decided.has(name)) {
          const latest = decidingExecution(index, name);
          decided.set(name, latest);
        }
        const latest = decided.get(name);
        return !decidingPass(
          index,
          name,
          latest,
          latest?.row === row && row.requiredSuites === undefined,
        );
      });
    return [...new Set([...index.missingSuites(row), ...invalid])];
  };
  const passing = rows.filter(completePassingRow);
  // A complete row recorded under other time limits neither stands nor is
  // displaced: its tasks ran under figures that do not apply now.
  const complete = passing.filter(index.ranUnderLimits);
  const otherLimits = passing.filter((row) => !index.ranUnderLimits(row));
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
    timeLimitsDigest: index.limits,
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
    ...(otherLimits.length ? { otherLimits: otherLimits.at(-1) } : {}),
  };
}

/** The newest standing complete review row among a lookup's candidates: a
 * review row that names every suite of `names` and in which each of them ran
 * and passed. The closeout's satisfied form, the final review's claim and
 * the runner's answer to a forced review selection all read this one
 * predicate, so none of them takes a row another refuses.
 * @param {{candidates: any[]}} found @param {readonly string[]} names */
export function standingReviewCandidate(found, names) {
  // A suite's tasks carry its name alone or as a `name:` prefix (release
  // preparation and cases, launchpad and vertical files); every one of them
  // must have passed in the row. The claim stands on each required suite's
  // executed passing task, not on the row's declared list alone.
  const tasksOf = (observed, name) =>
    observed.filter(
      (entry) =>
        typeof entry?.name === "string" &&
        (entry.name === name || entry.name.startsWith(`${name}:`)),
    );
  const executedPass = (candidate) => {
    const observed = candidate.taskTimeline ?? candidate.cases;
    return (
      Array.isArray(observed) &&
      names.every((name) => {
        const tasks = tasksOf(observed, name);
        return tasks.length > 0 && tasks.every((entry) => entry.exitCode === 0);
      })
    );
  };
  return found.candidates.findLast(
    (candidate) =>
      candidate.gateSelection === "review" &&
      names.every((name) =>
        (Array.isArray(candidate.requiredSuites)
          ? candidate.requiredSuites
          : []
        ).includes(name),
      ) &&
      executedPass(candidate),
  );
}

/** An instance's structural phase: the six tasks every selection of an
 * exported kit runs first, in order. Its configuration row loads the
 * instance's own configuration and reports what the loader refuses. This
 * module holds the one copy of each phase; the generated-artifacts module,
 * which loads this one, names the same lists as tasks. */
export const STRUCTURAL_SUITES = Object.freeze([
  "format",
  "configuration",
  "registrations",
  "declarations",
  "generated",
  "host",
]);
/** Core's structural phase, in order. The kit's tests of its configuration
 * loader stand where an instance's configuration row does: they test the
 * kit's own code, whose bytes an instance's kit verification already
 * compares, so an instance runs them only by name. The recorded Git surface
 * check, which an exported kit does not carry, runs before the host task,
 * which stays last so the dispatch bound counts a selection only after every
 * other structural check has passed. */
export const CORE_STRUCTURAL_SUITES = Object.freeze([
  "format",
  "configuration-root",
  "registrations",
  "declarations",
  "generated",
  "git-surface",
  "host",
]);
/** The structural tasks the checkout at `root` runs first, in order, which
 * its structural row must hold. */
export const structuralSuites = (root) =>
  isKitRoot(root) ? STRUCTURAL_SUITES : CORE_STRUCTURAL_SUITES;

/** Handoffs consume focused runs only at the current identity. A later failed
 * execution still displaces a pass through the same lookup used by review;
 * a missing entry names the displaced tasks so a refusal can name the remedy. */
export async function preflightRows(root, codeIdentity, suites) {
  const rows = [],
    missing = [];
  for (const name of ["structural", ...new Set(suites)]) {
    const checkId = name === "structural" ? name : `suite:${name}`;
    const found = await coveringGateCheck(
      root,
      checkId,
      name === "structural" ? [...structuralSuites(root)] : [name],
      codeIdentity,
    );
    const latest = (await gateCandidates(root, checkId, codeIdentity)).rows
      .filter((candidate) => !partialRow(candidate) || candidate.exitCode !== 0)
      .at(-1);
    const row = found.row;
    const { ranUnderTimeLimits } = await import("./gate-evidence.mjs");
    if (
      !row ||
      row.recordedAt !== latest?.recordedAt ||
      row.evidenceRef !== latest?.evidenceRef ||
      (name !== "structural" && row.gateSelection !== "single")
    )
      missing.push({
        suite: name,
        checkId,
        reason: !latest
          ? "no row at the current code identity"
          : latest.exitCode === 0 &&
              !ranUnderTimeLimits(latest, found.timeLimitsDigest)
            ? "latest row ran under time limits that have changed since"
            : "latest row failed or no longer stands",
        displaced: found.displaced?.tasks ?? [],
      });
    else rows.push(row);
  }
  return { codeIdentity, rows, missing };
}

/** One line a reader can act on. */
export const describeGateRow = (row) =>
  `recorded ${row.recordedAt ?? "at an unknown time"}, ${(row.durationMs / 1000).toFixed(2)} s, ${Array.isArray(row.requiredSuites) ? row.requiredSuites.length : "unknown"} suites, ${row.evidenceRef}`;
