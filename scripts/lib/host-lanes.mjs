import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  atomicJson,
  delay,
  hostStateRoot,
  ownedProcesses,
  processAlive,
  readHostSnapshot,
  readRecords,
  withHostLock,
} from "./host-resources.mjs";

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
  capacity = 4,
  worktree,
  task,
  directory = hostStateRoot(),
  signal,
  parentLease = inheritedHostLease(directory),
  onWait = (holders) =>
    console.log(
      `WAIT host lanes for ${worktree} / ${task}; held by ${holders.map((row) => `${row.worktree} / ${row.task} (${row.slots})`).join("; ")}`,
    ),
} = {}) {
  if (
    !Number.isInteger(slots) ||
    slots < 1 ||
    slots > capacity ||
    capacity !== 4
  )
    throw new Error(
      "Host lanes require one through four slots of the shared four",
    );
  if (parentLease && slots > parentLease.record.slots)
    throw new Error("Nested gate exceeds its inherited lane reservation");
  let announced = "",
    waitedMs = 0;
  const started = Date.now();
  for (;;) {
    if (signal?.aborted) throw new Error("Host lane wait stopped");
    const result = await withHostLock(
      directory,
      "lanes",
      () => {
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
          (parent?.slots ?? capacity)
        )
          return { holders: siblings };
        const owner = table.find((row) => row.pid === process.pid);
        const file = join(directory, "lanes", `${randomUUID()}.json`);
        const record = {
          pid: owner.pid,
          birth: owner.birth,
          slots,
          worktree,
          task,
          ...(parent ? { parent: parent.file } : {}),
          acquiredAt: new Date().toISOString(),
        };
        atomicJson(file, record);
        return { file, record };
      },
      { signal },
    );
    if (result.file)
      return {
        ...result,
        waitedMs,
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
    if (identity !== announced) {
      announced = identity;
      onWait(result.holders);
    }
    await delay(100);
    waitedMs = Date.now() - started;
  }
}
