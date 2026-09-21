#!/usr/bin/env node
// WO-148's live row: one operator-run bind of a real in-flight order, then one
// detached resident cycle with the operator marked away, so the cadence judges
// the worktree the command aimed it at rather than a synthetic one. The filed
// row carries counts, shapes and explicit observations only: no physical path,
// no capsule text and no raw transport output reaches a committed surface.
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { closeSync, mkdirSync, openSync, writeFileSync } from "node:fs";
import { dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { decodeLog } from "@dotln/kernel";
import { docPath, findLaunchpad } from "./lib/config.mjs";
import { bindOrder, RESIDENT_LANE } from "./resident-bind.mjs";
import {
  ResidentStore,
  replayResident,
} from "../packages/skeleton/dist/src/resident-store.js";
import { structuralMissionFindings } from "../packages/skeleton/dist/src/mission-check-protocol.js";
import { CONTRIBUTOR_MISSION_POLICY } from "../packages/skeleton/dist/src/loadouts/contributor.js";

const root = findLaunchpad();
const local = docPath(root, "control", "local/wo148-live");
const dotln = join(root, "packages/skeleton/dist/src/dotln.js");
/** The Contributor mission cadence, plus the margin and retries the collector
 * needs because it observes a real clock instead of advancing one. */
const CADENCE_MS = 900_000;
const MARGIN_MS = 15_000;
const RETRY_MS = 30_000;
const ONCE_ATTEMPTS = 5;
const wait = (ms) => new Promise((done) => setTimeout(done, ms));
const runDotln = (args) =>
  spawnSync(process.execPath, [dotln, ...args], {
    cwd: root,
    encoding: "utf8",
    timeout: 900_000,
  });
const readStore = (store) => new ResidentStore(store).read();
const flag = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : fallback;
};
const surfaces = process.argv.flatMap((value, index) =>
  process.argv[index - 1] === "--surface" ? [value] : [],
);
const workOrder = flag("work-order");
const transport = flag("transport", "claude-cli-print");
const model = flag("model", "claude-haiku-4-5-20251001");
const effort = flag("effort", "xhigh");
if (!workOrder || !surfaces.length)
  throw new Error(
    "usage: evidence-resident-binding --work-order WO-NNN --surface <path> [--surface <path>...] [--transport <name>] [--model <model>] [--effort <level>]",
  );
const output = docPath(root, "evidence", `${workOrder}/live.json`);

if (process.argv[2] === "--child") {
  const started = Date.now();
  // The bind under observation: canonical state and the order's own worktree,
  // exactly as an operator would run it.
  const { binding, configuration } = bindOrder(root, {
    action: "bind",
    workOrder,
    surfaces,
    transport,
    model,
    effort,
    base: undefined,
  });
  const store = binding.store;
  mkdirSync(local, { recursive: true });
  writeFileSync(
    join(local, "scratch.json"),
    `${JSON.stringify({ store, worktree: binding.worktree })}\n`,
    { mode: 0o600 },
  );
  // Nothing here drives the host in process: the shipped `dotln presence` and
  // `dotln resident --once` commands are run against the bound store on the
  // real clock, which is the path criterion 4 names. The Contributor cadence
  // is one pulse every 900 s, so the collector waits it out before the first
  // `--once` and keeps asking until one cycle dispatches or the attempts run
  // out. Recorded time is never faked.
  let row;
  {
    const marked = runDotln(["presence", "away", "--store", store]);
    if (marked.status !== 0)
      throw new Error(`dotln presence away failed: ${marked.stderr}`);
    const state = () => replayResident(readStore(store)).state.resident;
    const awayBefore = !state().present;
    await wait(CADENCE_MS + MARGIN_MS);
    const onceRuns = [];
    for (let attempt = 1; attempt <= ONCE_ATTEMPTS; attempt++) {
      const once = runDotln([
        "resident",
        "--store",
        store,
        "--policy",
        CONTRIBUTOR_MISSION_POLICY,
        "--once",
      ]);
      onceRuns.push({ attempt, exitCode: once.status });
      if (
        once.status !== 0 ||
        decodeLog(readStore(store)).some(
          (event) => event.type === "CliWorkerObserved",
        )
      )
        break;
      if (attempt < ONCE_ATTEMPTS) await wait(RETRY_MS);
    }
    const resident = state;
    const events = (type) =>
      decodeLog(readStore(store)).filter((event) => event.type === type);
    const observed = events("CliWorkerObserved").at(-1)?.payload?.worker;
    const held = resident().dispatchHeld;
    const subject = observed?.subject;
    const declared = binding.declaredSurfaces;
    const covered = (path) =>
      declared.some(
        (surface) => path === surface || path.startsWith(`${surface}/`),
      );
    const changed = subject?.observation?.diff?.changedPaths ?? [];
    const launched = observed?.launch?.origin === "actor";
    const away = awayBefore && !resident().present;
    // `observed` means the whole path ran: an actor-origin launch while the
    // operator was away that came back with a judgment. A launch that reached
    // the CLI and returned nothing is `blocked` and names what stopped it, so
    // the row never reads as a completed judgment it did not obtain.
    const blockedReason = !launched
      ? "no actor-origin CLI launch was recorded"
      : !away
        ? "the operator was not away across the pulse"
        : observed?.result
          ? null
          : `the launch returned no judgment: ${observed?.failure ?? "unknown failure"}`;
    row = {
      workOrder,
      recordedAt: new Date().toISOString(),
      label: blockedReason === null ? "observed" : "blocked",
      blockedReason,
      launch:
        "detached Node parent with no terminal → bind → dotln presence away → dotln resident --once → supervised CLI mission-check-v1",
      onceRuns,
      transport,
      model,
      effort,
      harnessVersion: observed?.launch?.harnessVersion ?? "unknown",
      origin: observed?.launch?.origin ?? "unknown",
      profile: observed?.launch?.profileId ?? "unknown",
      operatorAwayBeforeAndAfter: away,
      // What the bind itself produced, without naming a physical path.
      binding: {
        phaseAtBind: binding.phase,
        storeUnderControlLane: store.startsWith(
          `${docPath(root, "control", RESIDENT_LANE)}${sep}`,
        ),
        storeIndex: binding.storeIndex,
        baseSource: binding.baseSource,
        baseRef: binding.baseRef,
        contractPath: binding.contractPath,
        decisionsDeclared: binding.decisionsPath !== null,
        declaredSurfaceCount: declared.length,
        capsuleRootIsBoundWorktree:
          configuration.actors[binding.phaseId].missionSource.root ===
          binding.worktree,
        capsuleContractIsTheOrder:
          subject?.observation?.contract?.workOrderId === workOrder,
      },
      // Counted against the bound worktree, never named: the capsule's paths
      // are this session's own work in progress.
      capsulePaths: subject
        ? {
            changed: changed.length,
            insideDeclaredSurfaces: changed.filter(covered).length,
            outsideDeclaredSurfaces: changed.filter((p) => !covered(p)).length,
            omitted: subject.observation.diff.omittedPaths.length,
            ignoredEntriesChanged:
              subject.observation.diff.ignoredEntries.length,
            baseCommitMatchesBinding:
              subject.observation.diff.baseCommit === binding.baseCommit,
          }
        : "absent",
      verdict: observed?.result?.verdict ?? "absent",
      findingReferences: (observed?.result?.findings ?? []).map(
        (finding) => `${finding.kind}:${finding.reference}`,
      ),
      hostDerivedFindings: subject
        ? structuralMissionFindings(subject).map(
            (finding) => `${finding.kind}:${finding.reference}`,
          )
        : [],
      failure: observed?.failure ?? null,
      hostChecks: {
        holdRaised: Boolean(held),
        holdVerdict: held?.verdict ?? "absent",
        correctionRecorded: events("MissionDriftObserved").length,
        dispatched: events("ScriptEpisodeDispatched").length,
        phaseAfterPulse: resident().machine.state,
      },
      durationMs: Date.now() - started,
      limits: [
        "One bind of one real in-flight order and one real launch; the row proves aim, not the work",
        "Real clock throughout: the collector waits the 900 s Contributor cadence out and then runs the shipped dotln resident --once until one cycle dispatches; no clock is injected and no host is driven in process",
        "A judgment is an observation about this diff, not verification of the work; any verdict is an admissible row",
        "Authentication lifetime unknown; no raw transcript, capsule text, physical path or session identity is filed",
        "Changed paths are counted and classified, never named",
        "The capsule is pinned when the store is bound, so it judges the worktree as it read at that moment, not as it reads when this row is filed",
      ],
    };
    writeFileSync(output, `${JSON.stringify(row, null, 2)}\n`);
    // The row's own subject: the bind aimed a real store at a real worktree
    // while the operator was away. The judge's verdict never gates this.
    assert.equal(row.binding.storeUnderControlLane, true);
    assert.equal(row.operatorAwayBeforeAndAfter, true);
    assert.equal(row.hostChecks.dispatched, 1);
  }
} else {
  mkdirSync(local, { recursive: true });
  mkdirSync(dirname(output), { recursive: true });
  const fd = openSync(join(local, "collector.log"), "w", 0o600);
  const child = spawn(
    process.execPath,
    [fileURLToPath(import.meta.url), "--child", ...process.argv.slice(2)],
    { cwd: root, detached: true, stdio: ["ignore", fd, fd] },
  );
  const code = await new Promise((done, reject) => {
    child.once("error", reject);
    child.once("close", done);
  });
  closeSync(fd);
  process.stdout.write(
    `${workOrder} live collector exit ${code}; counts-only row: ${output}\n`,
  );
  process.exitCode = code ?? 1;
}
