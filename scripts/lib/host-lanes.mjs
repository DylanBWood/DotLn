import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  atomicJson,
  delay,
  hostLaneCapacity,
  hostStateRoot,
  ownedProcesses,
  processAlive,
  readHostSnapshot,
  readRecords,
  recordedHostLaneCapacity,
  withHostLock,
} from "./host-resources.mjs";

function capacityUnderLock(directory, derived) {
  const file = join(directory, "lane-capacity.json");
  if (!existsSync(file)) {
    if (!Number.isSafeInteger(derived) || derived < 1 || derived > 8)
      throw new Error("Derived host lane capacity must be one through eight");
    atomicJson(file, { capacity: derived });
  }
  return recordedHostLaneCapacity(directory);
}

export async function acquireHostLaneCapacity({
  directory = hostStateRoot(),
  capacity = hostLaneCapacity(),
  signal,
} = {}) {
  return withHostLock(
    directory,
    "lanes",
    () => capacityUnderLock(directory, capacity),
    { signal },
  );
}

export function laneHolderAlive(record, table) {
  if (!record.released && processAlive(record, table)) return true;
  if (!record.taskRoot) return false;
  const known = new Map(
    (record.members ?? []).map((row) => [row.pid, row.birth]),
  );
  known.uniqueIds = new Set(
    (record.members ?? []).map((row) => row.uniqueId).filter(Boolean),
  );
  return (
    ownedProcesses(table, record.taskRoot.pid, known, {
      birth: record.taskRoot.birth,
      uniqueId: record.taskRoot.uniqueId,
    }).length > 0
  );
}

export function inheritedHostLease(directory, env = process.env) {
  try {
    const token = JSON.parse(env.DOTLN_HOST_LANE_LEASE ?? "null");
    if (
      !token ||
      token.directory !== directory ||
      !token.file.startsWith(join(directory, "lanes") + "/")
    )
      return null;
    const record = JSON.parse(readFileSync(token.file, "utf8"));
    const table = readHostSnapshot({ footprint: false, directory }).processes;
    if (!laneHolderAlive(record, table)) return null;
    const byPid = new Map(table.map((row) => [row.pid, row]));
    const seen = new Set();
    for (
      let row = byPid.get(process.pid);
      row && !seen.has(row.pid);
      row = byPid.get(row.ppid)
    ) {
      if (row.pid === record.pid || row.pid === record.taskRoot?.pid)
        return { file: token.file, record, directory };
      seen.add(row.pid);
    }
    return null;
  } catch {
    return null;
  }
}

function liveHolders(directory) {
  const table = readHostSnapshot({ footprint: false, directory }).processes;
  const rows = readRecords(directory, "lanes");
  const keep = new Set(
    rows.filter((row) => laneHolderAlive(row, table)).map((row) => row.file),
  );
  // A parent reservation survives every live sublease, even after its runner
  // and task root exit. Nested holders consume their parent's slots, not new
  // host capacity. Reclaim only the dead closure.
  let changed = true;
  while (changed) {
    changed = false;
    for (const row of rows)
      if (keep.has(row.file) && row.parent && !keep.has(row.parent)) {
        keep.add(row.parent);
        changed = true;
      }
  }
  return {
    table,
    holders: rows.filter((row) => {
      if (keep.has(row.file)) return true;
      rmSync(row.file, { force: true });
      return false;
    }),
  };
}

export async function acquireHostLanes({
  slots = 1,
  capacity = hostLaneCapacity(),
  worktree,
  task,
  directory = hostStateRoot(),
  signal,
  parentLease = inheritedHostLease(directory),
  waitHeartbeatMs = 30000,
  onWait = (_holders, observation) =>
    console.log(
      `WAIT host lanes for ${task}: ${observation.waitedMs} ms; ${observation.phase === "lock" ? "waiting for the lane registry lock" : `held by ${observation.holders.map((row) => `${row.task} (${row.slots} slots, ${row.ageMs ?? "unknown"} ms old, owner ${row.ownerAlive ? "alive" : "exited"}, ${row.survivingTasks} task processes, ${row.retainedSubleases} retained subleases${row.nested ? ", nested" : ""}${row.released ? ", released" : ""})`).join("; ")}`}`,
    ),
} = {}) {
  if (!Number.isSafeInteger(slots) || slots < 1)
    throw new Error("Host lanes require a positive integer slot request");
  if (parentLease && slots > parentLease.record.slots)
    throw new Error("Nested gate exceeds its inherited lane reservation");
  if (!Number.isFinite(waitHeartbeatMs) || waitHeartbeatMs <= 0)
    throw new Error("Host lane wait heartbeat must be a positive duration");
  let announced = "",
    announcedAt = -Infinity;
  const started = Date.now();
  const waitObservations = [];
  const publishWait = (holders, observation) => {
    waitObservations.push(observation);
    if (waitObservations.length > 32) waitObservations.shift();
    onWait(holders, observation);
  };
  for (;;) {
    if (signal?.aborted) throw new Error("Host lane wait stopped");
    const lockWait = new AbortController();
    const abort = () => lockWait.abort();
    signal?.addEventListener("abort", abort, { once: true });
    let notificationFailed = false;
    let notificationError;
    const heartbeat = setInterval(() => {
      try {
        publishWait([], {
          observedAt: new Date().toISOString(),
          waitedMs: Date.now() - started,
          phase: "lock",
          holders: [],
        });
      } catch (error) {
        notificationFailed = true;
        notificationError = error;
        clearInterval(heartbeat);
        lockWait.abort();
      }
    }, waitHeartbeatMs);
    let result;
    try {
      result = await withHostLock(
        directory,
        "lanes",
        () => {
          // Notifications belong to waiting, never to a newly acquired lease.
          clearInterval(heartbeat);
          if (notificationFailed) throw notificationError;
          if (signal?.aborted) throw new Error("Host lane wait stopped");
          const recordedCapacity = capacityUnderLock(directory, capacity);
          if (slots > recordedCapacity)
            throw new Error(
              `Host lane request ${slots} exceeds recorded capacity ${recordedCapacity}`,
            );
          const { table, holders } = liveHolders(directory);
          const parent =
            parentLease && holders.find((row) => row.file === parentLease.file);
          if (parentLease && !parent)
            throw new Error("Inherited host lane reservation expired");
          const siblings = holders.filter(
            (row) => (row.parent ?? null) === (parent?.file ?? null),
          );
          if (
            siblings.reduce((sum, row) => sum + row.slots, 0) + slots >
            (parent?.slots ?? recordedCapacity)
          )
            return { holders: siblings, allHolders: holders, table };
          const owner = table.find((row) => row.pid === process.pid);
          const file = join(directory, "lanes", `${randomUUID()}.json`);
          const record = {
            pid: owner.pid,
            birth: owner.birth,
            slots,
            capacity: recordedCapacity,
            worktree,
            task,
            ...(parent ? { parent: parent.file } : {}),
            acquiredAt: new Date().toISOString(),
          };
          atomicJson(file, record);
          return { file, record };
        },
        { signal: lockWait.signal },
      );
    } catch (error) {
      // Await the lock helper's cancellation before returning the caller's error.
      if (notificationFailed) throw notificationError;
      throw error;
    } finally {
      clearInterval(heartbeat);
      signal?.removeEventListener("abort", abort);
    }
    if (result.file)
      return {
        ...result,
        waitedMs: Date.now() - started,
        waitObservations,
        update(details) {
          Object.assign(result.record, details);
          atomicJson(result.file, result.record);
        },
        async release() {
          await withHostLock(directory, "lanes", () => {
            Object.assign(result.record, { released: true });
            atomicJson(result.file, result.record);
            liveHolders(directory);
          });
        },
      };
    const identity = result.holders
      .map((row) => row.file)
      .sort()
      .join(",");
    const now = Date.now();
    if (identity !== announced || now - announcedAt >= waitHeartbeatMs) {
      announced = identity;
      announcedAt = now;
      const observation = {
        observedAt: new Date(now).toISOString(),
        waitedMs: now - started,
        phase: "capacity",
        holders: result.holders.map((row) => {
          const members = new Map(
            (row.members ?? []).map((member) => [member.pid, member.birth]),
          );
          members.uniqueIds = new Set(
            (row.members ?? [])
              .map((member) => member.uniqueId)
              .filter(Boolean),
          );
          const acquiredAt = Date.parse(row.acquiredAt);
          return {
            task: row.task,
            slots: row.slots,
            ageMs: Number.isFinite(acquiredAt)
              ? Math.max(0, now - acquiredAt)
              : null,
            ownerAlive: processAlive(row, result.table),
            survivingTasks: row.taskRoot
              ? ownedProcesses(result.table, row.taskRoot.pid, members, {
                  birth: row.taskRoot.birth,
                  uniqueId: row.taskRoot.uniqueId,
                }).length
              : 0,
            nested: Boolean(row.parent),
            released: Boolean(row.released),
            retainedSubleases: result.allHolders.filter(
              (child) => child.parent === row.file,
            ).length,
          };
        }),
      };
      publishWait(result.holders, observation);
    }
    await delay(100);
  }
}
