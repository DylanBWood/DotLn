import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { closeSync, existsSync, openSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import {
  atomicJson,
  delay,
  ensureHostRoot,
  hostStateRoot,
  memoryBudgets,
  processAlive,
  readHostSnapshot,
  readRecords,
  registerProcess,
  withHostLock,
} from "./host-resources.mjs";

export function agentAncestor(table, pid = process.pid, env = process.env) {
  const byPid = new Map(table.map((row) => [row.pid, row]));
  const chain = [],
    seen = new Set();
  for (
    let row = byPid.get(pid);
    row && !seen.has(row.pid) && chain.length < 64;
    row = byPid.get(row.ppid)
  ) {
    seen.add(row.pid);
    chain.push(row);
  }
  const declared = chain.find((row) => row.pid === Number(env.CLAUDE_PID));
  return (
    declared ??
    chain.find((row) => /^(?:codex|claude|copilot)(?:$|[-_.])/i.test(row.name))
  );
}

export async function ensureHostGuard(directory = hostStateRoot()) {
  ensureHostRoot(directory);
  return withHostLock(directory, "guard-start", async () => {
    const file = join(directory, "guard.json");
    const live = () => {
      try {
        const record = JSON.parse(readFileSync(file, "utf8"));
        return processAlive(
          record,
          readHostSnapshot({ footprint: false, directory }).processes,
        )
          ? record
          : null;
      } catch (error) {
        if (error.code === "ENOENT") return null;
        throw error;
      }
    };
    const existing = live();
    if (existing) return { ...existing, reused: true };
    const log = openSync(join(directory, "guard.log"), "a", 0o600);
    let child;
    try {
      child = spawn(
        process.execPath,
        [
          join(import.meta.dirname, "../host-guard.mjs"),
          "--directory",
          directory,
        ],
        {
          detached: true,
          stdio: ["ignore", log, log],
        },
      );
      child.unref();
    } finally {
      closeSync(log);
    }
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      const record = live();
      if (record) return { ...record, reused: false };
      if (child.exitCode !== null)
        throw new Error(
          "Host guard exited during startup; inspect its private guard.log",
        );
      await delay(50);
    }
    throw new Error(
      "Host guard startup observation unavailable; inspect its private guard.log",
    );
  });
}

export async function registerAgentSession(
  repo,
  { directory = hostStateRoot(), table, env = process.env } = {},
) {
  const processes =
    table ?? readHostSnapshot({ footprint: false, directory }).processes;
  const owner = agentAncestor(processes, process.pid, env);
  if (!owner)
    return { available: false, reason: "verified agent ancestor unavailable" };
  readRecords(directory, "sessions");
  const id = createHash("sha256")
    .update(`${owner.pid}:${owner.birth}:${repo}`)
    .digest("hex");
  const file = join(directory, "sessions", `${id}.json`);
  atomicJson(file, {
    id,
    pid: owner.pid,
    birth: owner.birth,
    uniqueId: owner.uniqueId,
    repo,
    protected: true,
    limits: memoryBudgets(repo),
    registeredAt: new Date().toISOString(),
  });
  const guard = await ensureHostGuard(directory);
  return {
    available: true,
    pid: owner.pid,
    guardPid: guard.pid,
    source: "verified-process-ancestry",
  };
}

export async function registerGuardTree(
  repo,
  pid,
  details,
  directory = hostStateRoot(),
) {
  const registration = registerProcess(
    "trees",
    pid,
    { repo, limits: memoryBudgets(repo), ...details },
    directory,
  );
  try {
    await ensureHostGuard(directory);
    return registration;
  } catch (error) {
    registration.release();
    throw error;
  }
}

const incidentWarnings = new Set();
export function incidentForProcess(directory, pid, since) {
  const file = join(directory, "latest-incidents", `${pid}.json`);
  try {
    const row = JSON.parse(readFileSync(file, "utf8"));
    return row.pid === pid && Date.parse(row.recordedAt) >= since ? row : null;
  } catch (error) {
    if (error.code !== "ENOENT" && !incidentWarnings.has(error.message)) {
      incidentWarnings.add(error.message);
      console.error(
        `DotLn latest incident unavailable: ${error.message}; local task supervision remains active`,
      );
    }
    return null;
  }
}

export async function releaseAgentSession(repo, directory = hostStateRoot()) {
  const table = readHostSnapshot({ footprint: false, directory }).processes;
  const owner = agentAncestor(table);
  if (owner)
    for (const row of readRecords(directory, "sessions"))
      if (
        row.repo === repo &&
        row.pid === owner.pid &&
        row.birth === owner.birth
      )
        rmSync(row.file, { force: true });
  return stopHostGuardIfIdle(directory);
}

export async function stopHostGuardIfIdle(directory = hostStateRoot()) {
  const table = readHostSnapshot({ footprint: false, directory }).processes;
  const live = ["sessions", "trees"]
    .flatMap((kind) => readRecords(directory, kind))
    .some((row) => processAlive(row, table));
  if (live)
    return { stopped: false, reason: "live registered session or tree" };
  atomicJson(join(directory, "guard.stop"), {
    requestedAt: new Date().toISOString(),
  });
  return { stopped: true };
}
