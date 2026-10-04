import { performance } from "node:perf_hooks";
import {
  appendIncident,
  hostStateRoot,
  killOwned,
  ownedProcesses,
  observeSwapGrowth,
  readHostSnapshot,
} from "./host-resources.mjs";

export function createProcessMonitor({
  limits,
  gatePid,
  repo,
  directory = hostStateRoot(),
  sample = readHostSnapshot,
  onGateFailure = () => {},
  report = (text) => console.error(text),
} = {}) {
  const tasks = new Map(),
    gateKnown = new Map(),
    unavailable = new Set(),
    swapState = {};
  const stats = {
    samples: 0,
    footprintSamples: 0,
    samplingCostMs: 0,
    peakFootprintBytes: 0,
    peakRssBytes: 0,
    source: null,
  };
  let lastFootprint = -Infinity,
    timer,
    closed = false,
    gateFailure;
  const observe = (full = false) => {
    const started = performance.now();
    let snapshot;
    try {
      snapshot = sample({
        footprint: full,
        directory,
        descriptorOwners: [...tasks.values()]
          .map((task) => task.descriptorOwnership)
          .filter(Boolean),
      });
    } catch (error) {
      const reason = `process inventory/footprint: ${error.message}`;
      if (!unavailable.has(reason)) {
        unavailable.add(reason);
        report(`DotLn monitor unavailable: ${reason}`);
      }
      // Task supervision cannot claim a bound without a readable footprint.
      for (const task of tasks.values())
        task.fail("monitor-unavailable", { reason });
      stats.samplingCostMs += performance.now() - started;
      return [];
    }
    stats.samples++;
    stats.source = snapshot.source;
    for (const signal of snapshot.unavailable ?? [])
      if (!unavailable.has(signal)) {
        unavailable.add(signal);
        report(
          `DotLn monitor signal unavailable: ${signal}; other signals remain active`,
        );
      }
    const swapGrowth = observeSwapGrowth(swapState, snapshot.swapBytes, full);
    if (!full && (snapshot.pressure > 1 || swapGrowth)) {
      stats.samplingCostMs += performance.now() - started;
      return observe(true);
    }
    if (full) {
      stats.footprintSamples++;
      lastFootprint = performance.now();
    }
    const table = snapshot.processes;
    const gateMembers = gatePid
      ? ownedProcesses(table, gatePid, gateKnown)
      : [];
    if (full && gateMembers.length) {
      const peak = gateMembers.reduce(
        (sum, row) => sum + Math.max(0, row.footprintBytes),
        0,
      );
      stats.peakFootprintBytes = Math.max(stats.peakFootprintBytes, peak);
      stats.peakRssBytes = Math.max(
        stats.peakRssBytes,
        gateMembers.reduce((sum, row) => sum + Math.max(0, row.rssBytes), 0),
      );
      if (peak > limits.gateBytes && !gateFailure) {
        gateFailure = {
          failureKind: "memory-budget",
          scope: "gate",
          pid: gatePid,
          process:
            gateMembers.find((row) => row.pid === gatePid)?.name ??
            "exited-root",
          stopId: `${gatePid}:${gateMembers.find((row) => row.pid === gatePid)?.birth ?? "unknown"}`,
          repo,
          budgetBytes: limits.gateBytes,
          measuredPeakFootprintBytes: stats.peakFootprintBytes,
          source: snapshot.source,
        };
        try {
          gateFailure.killedProcesses = killOwned(gateMembers, {
            protectedPids: [gatePid],
            directory,
            onError: (error) => (gateFailure.killErrors ??= []).push(error),
          });
        } catch (error) {
          (gateFailure.killErrors ??= []).push({ message: error.message });
        }
        for (const task of tasks.values())
          task.fail("memory-budget", gateFailure);
        onGateFailure(gateFailure);
        appendIncident(directory, gateFailure, { report });
        report(`memory-budget ${JSON.stringify(gateFailure)}`);
      }
    }
    for (const task of tasks.values()) {
      const members = ownedProcesses(table, task.pid, task.known, {
        birth: task.birth,
        uniqueId: task.uniqueId,
        descriptorOwner: task.descriptorOwnership?.key,
      });
      task.members = members;
      if (full) {
        const footprint = members.reduce(
          (sum, row) => sum + Math.max(0, row.footprintBytes),
          0,
        );
        task.peakFootprintBytes = Math.max(task.peakFootprintBytes, footprint);
        task.peakRssBytes = Math.max(
          task.peakRssBytes,
          members.reduce((sum, row) => sum + Math.max(0, row.rssBytes), 0),
        );
        if (members.some((row) => row.footprintBytes < 0)) {
          if (!unavailable.has("per-process footprint")) {
            unavailable.add("per-process footprint");
            report("DotLn monitor signal unavailable: per-process footprint");
          }
          let current;
          try {
            current = sample({ footprint: false, directory }).processes;
          } catch (error) {
            task.fail("monitor-unavailable", { reason: error.message });
            continue;
          }
          const unreadable = members.filter(
            (row) =>
              row.footprintBytes < 0 &&
              current.some(
                (live) => live.pid === row.pid && live.birth === row.birth,
              ),
          );
          if (unreadable.length)
            task.fail("monitor-unavailable", {
              reason: "live process footprint unavailable",
              pids: unreadable.map((row) => row.pid),
            });
        }
        if (footprint > task.budgetBytes && !task.failed) {
          const incident = {
            failureKind: "memory-budget",
            scope: "task",
            task: task.name,
            repo,
            pid: task.pid,
            stopId: `${task.pid}:${task.birth ?? members.find((row) => row.pid === task.pid)?.birth ?? "unknown"}`,
            process:
              members.find((row) => row.pid === task.pid)?.name ??
              "exited-root",
            budgetBytes: task.budgetBytes,
            measuredPeakFootprintBytes: task.peakFootprintBytes,
            residentBytesAtStop: members.reduce(
              (sum, row) => sum + Math.max(0, row.rssBytes),
              0,
            ),
            source: snapshot.source,
          };
          task.fail("memory-budget", incident);
          appendIncident(directory, incident, { report });
          report(`memory-budget ${JSON.stringify(incident)}`);
        }
      }
      try {
        task.onMembers?.(members);
      } catch (error) {
        const reason = `task ${task.name} membership publication: ${error.message}`;
        if (!unavailable.has(reason)) {
          unavailable.add(reason);
          report(
            `DotLn monitor observation unavailable: ${reason}; task supervision remains active`,
          );
        }
        task.observationUnavailable ??= reason;
      }
    }
    stats.samplingCostMs += performance.now() - started;
    return table;
  };
  const tick = () => {
    const now = performance.now();
    const startup = [...tasks.values()].some(
      (task) => now - task.launchedAt < limits.footprintIntervalMs,
    );
    observe(startup || now - lastFootprint >= limits.footprintIntervalMs);
  };
  timer = setInterval(tick, limits.signalIntervalMs);
  timer.unref();
  return {
    stats,
    add(
      pid,
      name,
      fail,
      budgetBytes = limits.taskBytes,
      birth,
      onMembers,
      uniqueId,
      descriptorOwnership,
    ) {
      const task = {
        pid,
        name,
        budgetBytes,
        fail: (kind, details) => {
          if (task.failed) return;
          task.failed = { kind, details };
          fail(kind, details);
          try {
            const killed = killOwned(task.members, {
              protectedPids: gatePid ? [gatePid] : [],
              directory,
              onError: (error) => {
                (details.killErrors ??= []).push(error);
                report(`DotLn process stop unavailable: ${error.message}`);
              },
            });
            details.killedProcesses = [
              ...new Map(
                [...(details.killedProcesses ?? []), ...killed].map((row) => [
                  row.pid,
                  row,
                ]),
              ).values(),
            ];
          } catch (error) {
            report(
              `DotLn cleanup observation unavailable: ${error.message}; owned process-group stop was sent`,
            );
          }
        },
        birth,
        uniqueId,
        descriptorOwnership,
        onMembers,
        known: new Map(),
        members: [],
        peakFootprintBytes: 0,
        peakRssBytes: 0,
      };
      tasks.set(pid, task);
      observe(true);
      return task;
    },
    launched(task) {
      task.launchedAt = performance.now();
      task.launchSample = setTimeout(
        () => {
          if (!closed && tasks.get(task.pid) === task) observe(true);
        },
        Math.min(100, limits.signalIntervalMs),
      );
      task.launchSample.unref();
    },
    finish(task) {
      clearTimeout(task.launchSample);
      observe(true);
      tasks.delete(task.pid);
      const survivors = task.members.filter((row) => row.pid !== task.pid);
      if (survivors.length) {
        try {
          killOwned(survivors, {
            protectedPids: gatePid ? [gatePid] : [],
            directory,
          });
        } catch (error) {
          report(`DotLn survivor cleanup unavailable: ${error.message}`);
          task.failed ??= {
            kind: "monitor-unavailable",
            details: { reason: error.message },
          };
        }
      }
      return {
        peakFootprintBytes: task.peakFootprintBytes,
        peakRssBytes: task.peakRssBytes,
        memoryBudgetBytes: task.budgetBytes,
        footprintSource: stats.source,
        ...(task.observationUnavailable
          ? { observationUnavailable: task.observationUnavailable }
          : {}),
        ...(task.failed ? { memoryFailure: task.failed.details } : {}),
        ...(survivors.length
          ? {
              survivingProcesses: survivors.map(({ pid, name }) => ({
                pid,
                name,
              })),
            }
          : {}),
      };
    },
    stopTasks() {
      observe(false);
      for (const task of tasks.values()) {
        try {
          killOwned(task.members, {
            protectedPids: gatePid ? [gatePid] : [],
            directory,
          });
        } catch (error) {
          report(`DotLn cleanup unavailable: ${error.message}`);
          task.fail("monitor-unavailable", { reason: error.message });
        }
      }
    },
    failTasks(kind, details) {
      for (const task of tasks.values()) task.fail(kind, details);
    },
    close() {
      if (!closed) {
        closed = true;
        clearInterval(timer);
        for (const task of tasks.values()) clearTimeout(task.launchSample);
      }
      return {
        ...stats,
        unavailable: [...unavailable],
        ...(gateFailure ? { failure: gateFailure } : {}),
      };
    },
  };
}
