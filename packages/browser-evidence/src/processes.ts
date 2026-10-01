import { execFileSync } from "node:child_process";
import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import type { ProcessIdentity, ProcessRecord } from "./types.js";

/** Match PID, observed start time and command; identity drift is never signalled. */
export function processTable(): ProcessIdentity[] {
  const table = execFileSync("ps", ["-ax", "-o", "pid=,ppid=,lstart=,comm="], {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
    timeout: 5000,
    env: { ...process.env, LC_ALL: "C", TZ: "UTC" },
  });
  return table.split("\n").flatMap((line) => {
    const match = /^\s*(\d+)\s+(\d+)\s+(.{24})\s+(.+)$/u.exec(line);
    return match
      ? [
          {
            pid: Number(match[1]),
            parentPid: Number(match[2]),
            startedAt: match[3]!,
            command: match[4]!,
          },
        ]
      : [];
  });
}
export const sameProcess = (a: ProcessIdentity, b: ProcessIdentity) =>
  a.pid === b.pid && a.startedAt === b.startedAt && a.command === b.command;

export function observeOwned(record: ProcessRecord): void {
  if (record.browserPid === null) return;
  const table = processTable();
  const root = record.processes.find(
    (entry) => entry.pid === record.browserPid,
  );
  if (
    !root ||
    root.parentPid !== record.owner.pid ||
    !table.some((entry) => sameProcess(root, entry))
  )
    return;
  const known = new Set([record.browserPid]);
  for (let changed = true; changed;) {
    changed = false;
    for (const entry of table)
      if (known.has(entry.parentPid) && !known.has(entry.pid)) {
        known.add(entry.pid);
        changed = true;
      }
  }
  for (const entry of table.filter((entry) => known.has(entry.pid)))
    if (!record.processes.some((old) => sameProcess(old, entry)))
      record.processes.push(entry);
}
export function saveProcesses(directory: string, record: ProcessRecord): void {
  const file = join(directory, "processes.json");
  writeFileSync(`${file}.new`, `${JSON.stringify(record, null, 2)}\n`);
  renameSync(`${file}.new`, file);
}
export async function remainingOwned(record: ProcessRecord): Promise<number[]> {
  const until = Date.now() + 5000;
  for (;;) {
    const table = processTable();
    const remaining = record.processes
      .filter((old) => table.some((entry) => sameProcess(old, entry)))
      .map((entry) => entry.pid);
    if (!remaining.length || Date.now() >= until) return remaining;
    await delay(50);
  }
}
export async function recover(directory: string): Promise<number[]> {
  const record = JSON.parse(
    readFileSync(join(directory, "processes.json"), "utf8"),
  ) as ProcessRecord;
  const validIdentity = (entry: ProcessIdentity) =>
    entry &&
    Number.isSafeInteger(entry.pid) &&
    entry.pid > 1 &&
    Number.isSafeInteger(entry.parentPid) &&
    typeof entry.startedAt === "string" &&
    typeof entry.command === "string";
  if (
    record.schemaVersion !== 1 ||
    !validIdentity(record.owner) ||
    !Array.isArray(record.processes) ||
    !record.processes.every(validIdentity) ||
    typeof record.closed !== "boolean" ||
    (record.browserPid !== null &&
      (!Number.isSafeInteger(record.browserPid) || record.browserPid <= 1))
  )
    throw new Error("Invalid browser process record");
  if (record.closed) return [];
  const table = processTable();
  // The owner may change process.title; PID/start time still identify its life.
  if (
    table.some(
      (entry) =>
        entry.pid === record.owner.pid &&
        entry.startedAt === record.owner.startedAt,
    )
  )
    throw new Error(
      "Browser recovery refused: recorded owner is still running",
    );
  // Never include the host or a process outside the recorded browser tree.
  const root = record.processes.find(
    (entry) => entry.pid === record.browserPid,
  );
  const owned = new Set(root ? [root.pid] : []);
  for (let changed = true; changed;) {
    changed = false;
    for (const entry of record.processes)
      if (owned.has(entry.parentPid) && !owned.has(entry.pid)) {
        owned.add(entry.pid);
        changed = true;
      }
  }
  if (
    record.processes.some((entry) => entry.pid === record.owner.pid) ||
    new Set(record.processes.map((entry) => entry.pid)).size !==
      record.processes.length ||
    ((record.browserPid !== null || record.processes.length > 0) &&
      (!root ||
        root.parentPid !== record.owner.pid ||
        owned.size !== record.processes.length))
  )
    throw new Error("Invalid browser ownership record");
  observeOwned(record);
  saveProcesses(directory, record);
  const signalled: number[] = [];
  for (const old of [...record.processes].reverse()) {
    if (!processTable().some((entry) => sameProcess(old, entry))) continue;
    try {
      process.kill(old.pid, "SIGKILL");
      signalled.push(old.pid);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
    }
  }
  const remaining = await remainingOwned(record);
  if (remaining.length)
    throw new Error(
      `Browser recovery incomplete: ${remaining.length} owned process(es)`,
    );
  record.closed = true;
  saveProcesses(directory, record);
  return signalled;
}
