#!/usr/bin/env node
import { existsSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { isMainModule } from "./lib/paths.mjs";
import {
  appendIncident,
  atomicJson,
  DEFAULT_MEMORY,
  delay,
  ensureHostRoot,
  hostStateRoot,
  killOwned,
  ownedProcesses,
  observeSwapGrowth,
  processAlive,
  readHostSnapshot,
  readRecords,
  withHostLock,
} from "./lib/host-resources.mjs";

function repositoryMissing(repo) {
  try {
    statSync(repo);
    return false;
  } catch (error) {
    // An unreadable repository is not evidence that its registration is stale.
    return error.code === "ENOENT" || error.code === "ENOTDIR";
  }
}

// A supervisor removes a registration before it releases the endpoint that
// the registration's watch names (WO-185 D014). A watch withdrawn by the end
// of this census may have named a recycled descriptor during it, so its tags
// confer nothing; tags of watches still published afterwards were read while
// held.
export function guardCensus(registrations, options, sample = readHostSnapshot) {
  const snapshot = sample({
    ...options,
    descriptorOwners: registrations
      .map((row) => row.descriptorOwnership)
      .filter(Boolean),
  });
  const withdrawn = new Set(
    registrations
      .filter((row) => row.descriptorOwnership && !existsSync(row.file))
      .map((row) => row.descriptorOwnership.key),
  );
  if (withdrawn.size)
    for (const row of snapshot.processes)
      row.descriptorOwners = row.descriptorOwners?.filter(
        (key) => !withdrawn.has(key),
      );
  return snapshot;
}

/** Retire a protected session registration whose repository is gone while
 * another registration of the same live agent root survives, moving its
 * observed history first. Each repository is observed once per sample: read
 * twice, a repository removed between the reads made a registration its own
 * survivor, so it was retired with the history it held (WO-112 D024). */
export function transferDuplicateOwnership(
  registrations,
  rows,
  historyFor,
  missing = repositoryMissing,
) {
  const sessions = registrations.filter(
    (registration) =>
      registration.protected &&
      registration.scope !== "gate" &&
      typeof registration.repo === "string",
  );
  const absent = new Map(
    sessions.map((registration) => [
      registration.id,
      missing(registration.repo),
    ]),
  );
  const existingSessionRoots = new Map();
  for (const registration of sessions)
    if (!absent.get(registration.id) && processAlive(registration, rows))
      existingSessionRoots.set(
        `${registration.pid}:${registration.birth}`,
        registration,
      );
  const retired = new Set();
  for (const registration of sessions) {
    const survivor = existingSessionRoots.get(
      `${registration.pid}:${registration.birth}`,
    );
    // Transfer established ownership before any census mutates histories.
    // A late duplicate cannot rediscover a descendant already reparented.
    if (!survivor || !absent.get(registration.id)) continue;
    const from = historyFor(registration),
      to = historyFor(survivor);
    for (const [pid, birth] of from)
      if (!to.has(pid) || processAlive({ pid, birth }, rows))
        to.set(pid, birth);
    for (const property of ["uniqueIds", "precedingUniqueIds"])
      to[property] = new Set([
        ...(to[property] ?? []),
        ...(from[property] ?? []),
      ]);
    rmSync(registration.file, { force: true });
    retired.add(registration.id);
  }
  return retired;
}

export async function runHostGuard(directory = hostStateRoot()) {
  ensureHostRoot(directory);
  return withHostLock(directory, "guard", async () => {
    const table = readHostSnapshot({ footprint: false, directory }).processes;
    const owner = table.find((row) => row.pid === process.pid);
    const file = join(directory, "guard.json"),
      stopFile = join(directory, "guard.stop");
    rmSync(stopFile, { force: true });
    atomicJson(file, {
      pid: owner.pid,
      birth: owner.birth,
      startedAt: new Date().toISOString(),
      contract: "host-guard-v1",
    });
    const known = new Map(),
      previous = new Map(),
      warned = new Set(),
      infrastructureKnown = new Map(),
      runnerStops = new Map(),
      swapState = {};
    let stopping = false,
      lastFootprint = -Infinity,
      emptySince;
    const stats = {
      samples: 0,
      footprintSamples: 0,
      samplingCostMs: 0,
      peakFootprintBytes: 0,
      incidents: 0,
    };
    const stop = () => {
      stopping = true;
    };
    for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"])
      process.on(signal, stop);
    try {
      while (!stopping) {
        const started = performance.now();
        let sample,
          full = false,
          footprintFailure;
        const registrations = ["sessions", "trees"].flatMap((kind) =>
          readRecords(directory, kind),
        );
        const limits =
          registrations.find((row) => row.limits)?.limits ?? DEFAULT_MEMORY;
        try {
          sample = guardCensus(registrations, { footprint: false, directory });
          const swapGrowth = observeSwapGrowth(swapState, sample.swapBytes);
          if (
            performance.now() - lastFootprint >= limits.footprintIntervalMs ||
            sample.pressure > 1 ||
            swapGrowth
          ) {
            full = true;
            try {
              sample = guardCensus(registrations, { directory });
              observeSwapGrowth(swapState, sample.swapBytes, true);
            } catch (error) {
              footprintFailure = error.message;
            }
            lastFootprint = performance.now();
            stats.footprintSamples++;
          }
          stats.samples++;
        } catch (error) {
          const text = `process/footprint inventory: ${error.message}`;
          if (!warned.has(text)) {
            warned.add(text);
            console.error(
              `DotLn guard unavailable: ${text}; retrying remaining observations`,
            );
          }
          await delay(limits.signalIntervalMs);
          continue;
        }
        for (const signal of sample.unavailable)
          if (!warned.has(signal)) {
            warned.add(signal);
            console.error(
              `DotLn guard signal unavailable: ${signal}; keeping other signals`,
            );
          }
        try {
          const rows = sample.processes;
          const infrastructure = new Set(
            ownedProcesses(rows, process.pid, infrastructureKnown, {
              birth: owner.birth,
              uniqueId: owner.uniqueId,
            }).map((row) => row.pid),
          );
          const attributableRows = rows.filter(
            (row) => !infrastructure.has(row.pid),
          );
          const historyFor = (registration) => {
            let history = known.get(registration.id);
            if (!history) {
              history = new Map(
                (registration.members ?? []).map((row) => [row.pid, row.birth]),
              );
              history.uniqueIds = new Set(
                (registration.members ?? [])
                  .map((row) => row.uniqueId)
                  .filter(Boolean),
              );
              known.set(registration.id, history);
            }
            return history;
          };
          const retired = transferDuplicateOwnership(
            registrations,
            rows,
            historyFor,
          );
          const currentIds = new Set(
            registrations
              .filter((row) => !retired.has(row.id))
              .map((row) => row.id),
          );
          // Explicit task releases follow cleanup; do not retain their histories
          // for the lifetime of a protected agent session.
          for (const id of known.keys())
            if (!currentIds.has(id)) known.delete(id);
          const ownedByRegistration = new Map();
          const live = registrations.filter((registration) => {
            // Lifecycle fixtures can share the real agent ancestor. Retire a
            // deleted duplicate only while another repository owns that root;
            // deleting the last repository cannot end resource supervision.
            if (retired.has(registration.id)) return false;
            // Retain an observed tree after its runner exits, until descendants die.
            const history = historyFor(registration);
            const members = ownedProcesses(
              attributableRows,
              registration.pid,
              history,
              {
                group: !registration.protected,
                birth: registration.birth,
                uniqueId: registration.uniqueId,
                descriptorOwner: registration.descriptorOwnership?.key,
              },
            );
            ownedByRegistration.set(registration.id, members);
            known.set(registration.id, history);
            if (processAlive(registration, rows) || members.length) return true;
            rmSync(registration.file, { force: true });
            known.delete(registration.id);
            return false;
          });
          stats.trackedRegistrations = known.size;
          stats.trackedProcesses = [...known.values()].reduce(
            (sum, history) => sum + history.size,
            0,
          );
          if (!live.length) {
            emptySince ??= Date.now();
            if (existsSync(stopFile) || Date.now() - emptySince > 3000) {
              const retire = await withHostLock(
                directory,
                "guard-start",
                () => {
                  const latest = readHostSnapshot({
                    footprint: false,
                    directory,
                  }).processes;
                  const newlyLive = ["sessions", "trees"]
                    .flatMap((kind) => readRecords(directory, kind))
                    .some(
                      (registration) =>
                        processAlive(registration, latest) ||
                        (registration.members ?? []).some((member) =>
                          processAlive(member, latest),
                        ),
                    );
                  if (newlyLive) return false;
                  rmSync(file, { force: true });
                  return true;
                },
              );
              if (retire) break;
            }
          } else emptySince = undefined;
          const protectedPids = [
            process.pid,
            ...live
              .filter((row) => row.protected || row.scope === "gate")
              .map((row) => row.pid),
          ];
          const protectedSet = new Set(protectedPids);
          const sessionRoots = new Set(
            live
              .filter((row) => row.protected && row.scope !== "gate")
              .map((row) => row.pid),
          );
          for (const [pid, stop] of runnerStops) {
            if (!processAlive(stop, rows)) {
              runnerStops.delete(pid);
              continue;
            }
            if (Date.now() - stop.requestedAt >= 1000) {
              killOwned([stop], {
                protectedPids: protectedPids.filter((value) => value !== pid),
                directory,
              });
              runnerStops.delete(pid);
            }
          }
          const all = new Map(),
            explicitTasks = [],
            gates = [],
            bare = new Map();
          for (const registration of live) {
            const members = ownedByRegistration.get(registration.id);
            for (const row of members)
              if (!sessionRoots.has(row.pid)) all.set(row.pid, row);
            if (registration.scope === "task")
              explicitTasks.push({ registration, members });
            if (registration.scope === "gate")
              gates.push({ registration, members });
          }
          const explicit = new Set(
            explicitTasks.flatMap((task) => task.members.map((row) => row.pid)),
          );
          for (const row of all.values()) {
            if (explicit.has(row.pid)) continue;
            if (protectedSet.has(row.pid)) continue;
            const group = bare.get(row.pgid) ?? [];
            group.push(row);
            bare.set(row.pgid, group);
          }
          if (full) {
            const total = [...all.values()].reduce(
              (sum, row) => sum + Math.max(0, row.footprintBytes),
              0,
            );
            stats.peakFootprintBytes = Math.max(
              stats.peakFootprintBytes,
              total,
            );
            const candidates = [
              ...explicitTasks.map(({ registration, members }) => ({
                scope: "task",
                pid: registration.pid,
                birth: registration.birth,
                task: registration.task,
                repo: registration.repo,
                members,
                budgetBytes:
                  registration.budgetBytes ?? registration.limits.taskBytes,
              })),
              ...[...bare].map(([pgid, members]) => ({
                scope: "task",
                pid:
                  members.find((row) => row.pid === pgid)?.pid ??
                  members[0].pid,
                members,
                repo: live.find(
                  (registration) =>
                    known.get(registration.id)?.get(members[0].pid) ===
                    members[0].birth,
                )?.repo,
                budgetBytes: Math.min(
                  ...live
                    .filter((row) => row.protected || row.scope === "gate")
                    .map((row) => row.limits.taskBytes),
                  sample.physicalBytes * DEFAULT_MEMORY.taskShare,
                ),
              })),
              ...gates.map(({ registration, members }) => ({
                scope: "gate",
                pid: registration.pid,
                birth: registration.birth,
                repo: registration.repo,
                members,
                budgetBytes: registration.limits.gateBytes,
              })),
            ];
            const sum = (members) =>
              members.reduce(
                (value, row) => value + Math.max(0, row.footprintBytes),
                0,
              );
            const hostBudget = Math.min(
              ...live.map((row) => row.limits.hostBytes),
            );
            const hostVictim = candidates.sort(
              (a, b) => sum(b.members) - sum(a.members),
            )[0];
            if (total > hostBudget && hostVictim)
              candidates.unshift({
                ...hostVictim,
                scope: "host",
                budgetBytes: hostBudget,
                aggregateBytes: total,
              });
            const killed = new Set();
            const stopCandidate = (candidate) => {
              const killErrors = [];
              let killedProcesses = [];
              try {
                killedProcesses = killOwned(candidate.members, {
                  protectedPids,
                  directory,
                  onError: (error) => killErrors.push(error),
                });
              } catch (error) {
                killErrors.push({ code: error.code, message: error.message });
              }
              return {
                killedProcesses,
                ...(killErrors.length ? { killErrors } : {}),
              };
            };
            const requestRunnerStop = (candidate) => {
              if (
                !protectedSet.has(candidate.pid) ||
                sessionRoots.has(candidate.pid)
              )
                return;
              const current = readHostSnapshot({
                footprint: false,
                directory,
              }).processes;
              const runner = candidate.members.find(
                (row) => row.pid === candidate.pid,
              );
              if (runner && processAlive(runner, current)) {
                try {
                  process.kill(runner.pid, "SIGTERM");
                } catch (error) {
                  if (error.code !== "ESRCH")
                    console.error(
                      `DotLn runner stop unavailable: ${error.message}`,
                    );
                }
                if (!runnerStops.has(runner.pid))
                  runnerStops.set(runner.pid, {
                    ...runner,
                    requestedAt: Date.now(),
                  });
              }
            };
            for (const candidate of candidates) {
              const unreadable = candidate.members.filter(
                (row) => row.footprintBytes < 0,
              );
              if (unreadable.length) {
                const current = readHostSnapshot({
                  footprint: false,
                  directory,
                }).processes;
                if (unreadable.some((row) => processAlive(row, current))) {
                  const incident = {
                    failureKind: "monitor-unavailable",
                    scope: candidate.scope,
                    pid: candidate.pid,
                    stopId: `${candidate.pid}:${candidate.birth ?? candidate.members.find((row) => row.pid === candidate.pid)?.birth ?? "unknown"}`,
                    repo: candidate.repo,
                    reason:
                      footprintFailure ?? "live process footprint unavailable",
                    budgetBytes: candidate.budgetBytes,
                    measuredPeakFootprintBytes: null,
                    ...stopCandidate(candidate),
                  };
                  appendIncident(directory, incident);
                  console.error(
                    `monitor-unavailable ${JSON.stringify(incident)}`,
                  );
                  requestRunnerStop(candidate);
                  for (const row of incident.killedProcesses)
                    killed.add(row.pid);
                  continue;
                }
              }
              const footprint =
                candidate.aggregateBytes ?? sum(candidate.members);
              const signature = candidate.members
                .map((row) => `${row.pid}:${row.birth}`)
                .sort()
                .join(",");
              previous.set(
                signature,
                Math.max(previous.get(signature) ?? 0, footprint),
              );
              if (
                footprint <= candidate.budgetBytes ||
                candidate.members.every((row) => killed.has(row.pid))
              )
                continue;
              const largest = candidate.members.reduce((a, b) =>
                b.footprintBytes > a.footprintBytes ? b : a,
              );
              const incident = {
                failureKind: "memory-budget",
                scope: candidate.scope,
                pid: candidate.pid,
                stopId: `${candidate.pid}:${candidate.birth ?? candidate.members.find((row) => row.pid === candidate.pid)?.birth ?? "unknown"}`,
                repo: candidate.repo,
                process: largest.name,
                processPid: largest.pid,
                ...(candidate.task ? { task: candidate.task } : {}),
                budgetBytes: candidate.budgetBytes,
                measuredPeakFootprintBytes: previous.get(signature),
                residentBytesAtStop: candidate.members.reduce(
                  (sum, row) => sum + Math.max(0, row.rssBytes),
                  0,
                ),
                source: sample.source,
                ...stopCandidate(candidate),
              };
              appendIncident(directory, incident);
              stats.incidents++;
              console.error(`memory-budget ${JSON.stringify(incident)}`);
              requestRunnerStop(candidate);
              for (const row of incident.killedProcesses) killed.add(row.pid);
            }
            // Peak history is only needed while its process identity is live.
            const liveIdentities = new Set(
              rows.map((row) => `${row.pid}:${row.birth}`),
            );
            for (const signature of previous.keys())
              if (!signature.split(",").some((id) => liveIdentities.has(id)))
                previous.delete(signature);
          }
        } catch (error) {
          const reason = `ownership/cleanup observation: ${error.message}`;
          if (!warned.has(reason)) {
            warned.add(reason);
            console.error(
              `DotLn guard unavailable: ${reason}; preserving registrations and retrying`,
            );
          }
        }
        stats.samplingCostMs += performance.now() - started;
        atomicJson(join(directory, "guard-metrics.json"), {
          ...stats,
          observedAt: new Date().toISOString(),
          unavailable: [...warned],
        });
        await delay(limits.signalIntervalMs);
      }
    } finally {
      for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"])
        process.off(signal, stop);
      rmSync(file, { force: true });
      rmSync(stopFile, { force: true });
    }
    return stats;
  });
}

if (isMainModule(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 2 || args[0] !== "--directory"))
      throw new Error(
        "usage: host-guard [--directory <private-system-temp-root>]",
      );
    await runHostGuard(args[1]);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
