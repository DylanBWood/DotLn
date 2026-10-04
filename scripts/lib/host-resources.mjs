import { execFileSync, spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  closeSync,
  existsSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { totalmem } from "node:os";
import { performance } from "node:perf_hooks";
import { docPath } from "./config.mjs";
import { checksPath } from "./gate-evidence.mjs";
import { dirname } from "node:path";

export const DEFAULT_MEMORY = Object.freeze({
  taskShare: 1 / 4,
  gateShare: 1 / 2,
  hostShare: 2 / 3,
  signalIntervalMs: 1000,
  footprintIntervalMs: 4000,
  outputTailBytes: 1024 * 1024,
  hostLanes: 4,
});

// Compare growth since the last footprint census, rather than a guard's
// lifetime start. A completed census or reclaimed swap starts a new window.
export function observeSwapGrowth(state, swapBytes, footprint = false) {
  if (!Number.isFinite(swapBytes) || swapBytes < 0) return false;
  state.baseline ??= swapBytes;
  const due = swapBytes - state.baseline > 128 * 2 ** 20;
  if (footprint || swapBytes < state.baseline) state.baseline = swapBytes;
  return due;
}

// TMPDIR is deliberately ignored: test roots, clones and exported instances
// must rendezvous on the same host. This is within the system-temp role grant.
export function hostStateRoot() {
  const base =
    process.platform === "darwin"
      ? execFileSync("/usr/bin/getconf", ["DARWIN_USER_TEMP_DIR"], {
          encoding: "utf8",
          timeout: 2000,
        }).trim()
      : "/tmp";
  if (!base.startsWith("/")) throw new Error("Host temporary root unavailable");
  return join(base, `dotln-host-v1-${process.getuid?.() ?? "user"}`);
}

export function ensureHostRoot(directory = hostStateRoot()) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const info = lstatSync(directory);
  if (
    !info.isDirectory() ||
    info.isSymbolicLink() ||
    (process.getuid && info.uid !== process.getuid()) ||
    info.mode & 0o077
  )
    throw new Error("Host coordination root must be a private owned directory");
  return directory;
}

export function memoryBudgets(repo) {
  let configured = {};
  try {
    configured =
      JSON.parse(readFileSync(docPath(repo, "control", "budgets.json"), "utf8"))
        .memory ?? {};
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const limits = { ...DEFAULT_MEMORY, ...configured };
  for (const key of ["taskShare", "gateShare", "hostShare"])
    if (!(limits[key] > 0 && limits[key] <= 1))
      throw new Error(`Invalid memory budget ${key}`);
  for (const key of [
    "signalIntervalMs",
    "footprintIntervalMs",
    "outputTailBytes",
    "hostLanes",
  ])
    if (!Number.isSafeInteger(limits[key]) || limits[key] < 1)
      throw new Error(`Invalid resource budget ${key}`);
  // Every clone and exported instance takes from one count of host lanes, so
  // no checkout can configure its own (acquireHostLanes refuses any other).
  if (limits.hostLanes !== DEFAULT_MEMORY.hostLanes)
    throw new Error(
      `Invalid resource budget hostLanes: every clone on the host shares ${DEFAULT_MEMORY.hostLanes} lanes`,
    );
  return {
    ...limits,
    physicalBytes: totalmem(),
    taskBytes: Math.floor(totalmem() * limits.taskShare),
    gateBytes: Math.floor(totalmem() * limits.gateShare),
    hostBytes: Math.floor(totalmem() * limits.hostShare),
  };
}

export function atomicJson(file, value) {
  const prepared = `${file}.${randomUUID()}.prepare`;
  writeFileSync(prepared, JSON.stringify(value) + "\n", {
    mode: 0o600,
    flag: "wx",
  });
  renameSync(prepared, file);
}

// The Command Line Tools compiler matches xcrun's SDK on hosts that have it;
// /usr/bin/clang selects Xcode's toolchain where only Xcode is installed.
export function nativeCompiler() {
  if (process.platform !== "darwin") return { compiler: "cc", args: [] };
  const tools = "/Library/Developer/CommandLineTools/usr/bin/clang";
  return {
    compiler: existsSync(tools) ? tools : "/usr/bin/clang",
    args: [
      "-isysroot",
      execFileSync("/usr/bin/xcrun", ["--show-sdk-path"], {
        encoding: "utf8",
        timeout: 5000,
      }).trim(),
    ],
  };
}

const binaries = new Map();
function nativeBinary(directory, name) {
  const cached = binaries.get(name);
  if (cached && existsSync(cached)) return cached;
  const source = join(import.meta.dirname, `${name}.c`);
  const digest = createHash("sha256")
    .update(readFileSync(source))
    .digest("hex")
    .slice(0, 16);
  const binary = join(ensureHostRoot(directory), `${name}-${digest}`);
  if (!existsSync(binary)) {
    const prepared = `${binary}.${randomUUID()}.prepare`;
    try {
      const { compiler, args } = nativeCompiler();
      execFileSync(
        compiler,
        [...args, "-O2", "-std=c11", source, "-o", prepared],
        {
          timeout: 30_000,
          maxBuffer: 65536,
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
      renameSync(prepared, binary);
    } finally {
      rmSync(prepared, { force: true });
    }
  }
  binaries.set(name, binary);
  return binary;
}
export const taskLauncher = (directory) => nativeBinary(directory, "host-lock");

function macTopFootprint(sample) {
  const processes = sample.processes;
  const top = execFileSync(
    "/usr/bin/top",
    ["-l", "1", "-s", "0", "-stats", "pid,ppid,mem"],
    {
      encoding: "utf8",
      timeout: 5000,
      maxBuffer: 4 * 1024 * 1024,
    },
  );
  const byPid = new Map(processes.map((row) => [row.pid, row]));
  for (const line of top.split("\n")) {
    const match = /^\s*(\d+)\s+\d+\s+(\d+(?:\.\d+)?)([KMGT]?)\b/.exec(line);
    if (match && byPid.has(Number(match[1])))
      byPid.get(Number(match[1])).footprintBytes =
        Number(match[2]) *
        1024 ** (" KMGT".indexOf(match[3]) > 0 ? " KMGT".indexOf(match[3]) : 0);
  }
  const unavailable = ["native-reader (using top MEM fallback)"];
  let pressure = -1,
    swapBytes = -1;
  for (const key of ["kern.memorystatus_vm_pressure_level", "vm.swapusage"]) {
    try {
      const value = execFileSync("/usr/sbin/sysctl", ["-n", key], {
        encoding: "utf8",
        timeout: 2000,
      });
      if (key === "vm.swapusage")
        swapBytes = Number(value.match(/used\s*=\s*([\d.]+)M/)?.[1]) * 2 ** 20;
      else pressure = Number(value.trim());
    } catch {
      unavailable.push(key);
    }
  }
  return {
    ...sample,
    processes,
    pressure,
    swapBytes,
    source: "top.MEM",
    unavailable,
  };
}

export function parseNativeSnapshot(output) {
  const processes = [];
  let physicalBytes, pressure, swapBytes;
  for (const line of output.trim().split("\n")) {
    const fields = line.split(/\s+/);
    if (fields[0] === "H") {
      physicalBytes = Number(fields[1]);
      pressure = Number(fields[2]);
      swapBytes = Number(fields[3]);
    } else if (fields[0] === "P") {
      processes.push({
        pid: Number(fields[1]),
        ppid: Number(fields[2]),
        pgid: Number(fields[3]),
        birth: fields[4],
        footprintBytes: Number(fields[5]),
        rssBytes: Number(fields[6]),
        name: fields[7],
        uniqueId: fields[8] && fields[8] !== "0" ? fields[8] : null,
        parentUniqueId: fields[9] && fields[9] !== "0" ? fields[9] : null,
        descriptorOwners: fields.slice(10),
      });
    }
  }
  if (!(physicalBytes > 0))
    throw new Error("Native physical memory observation unavailable");
  if (!processes.length)
    throw new Error("Native process ownership census unavailable");
  return {
    processes,
    physicalBytes,
    pressure,
    swapBytes,
    source: "proc_pid_rusage.ri_phys_footprint",
    unavailable: [
      ...(pressure < 0 ? ["pressure"] : []),
      ...(swapBytes < 0 ? ["swap"] : []),
      ...(processes.some((row) => !row.uniqueId)
        ? ["original-parent unique identity"]
        : []),
    ],
  };
}

function portableSnapshot() {
  // Linux accounts resident + swapped private memory, including off-heap
  // allocations. macOS uses its actual physical-footprint ledger above.
  if (process.platform !== "linux")
    throw new Error("Footprint reader unavailable on this platform");
  const processes = readdirSync("/proc")
    .filter((name) => /^\d+$/.test(name))
    .flatMap((name) => {
      try {
        const stat = readFileSync(`/proc/${name}/stat`, "utf8");
        const end = stat.lastIndexOf(")"),
          fields = stat.slice(end + 2).split(" ");
        if (fields[0] === "Z") return [];
        const info = readFileSync(`/proc/${name}/status`, "utf8");
        if (Number(info.match(/^Uid:\s+(\d+)/m)?.[1]) !== process.getuid())
          return [];
        const rssBytes =
          Number(info.match(/^VmRSS:\s+(\d+)/m)?.[1] ?? 0) * 1024;
        const swap = Number(info.match(/^VmSwap:\s+(\d+)/m)?.[1] ?? 0) * 1024;
        return [
          {
            pid: Number(name),
            ppid: Number(fields[1]),
            pgid: Number(fields[2]),
            birth: fields[19],
            footprintBytes: rssBytes + swap,
            rssBytes,
            name: stat.slice(stat.indexOf("(") + 1, end),
          },
        ];
      } catch {
        return [];
      }
    });
  return {
    processes,
    physicalBytes: totalmem(),
    pressure: -1,
    swapBytes: -1,
    source: "linux-resident-plus-swap",
    unavailable: ["pressure", "host-swap"],
  };
}

// The kernel recycles a freed socket's identity and descriptor number at once,
// so a census can trust a watch only while its supervisor still holds the
// captured endpoint (D014). Each watch names a duplicate held until `release`,
// which the caller runs only after withdrawing the watch from every census
// input: its monitor entry and its registration.
export function holdTaskDescriptors(pid, directory) {
  const held = [];
  const release = () => {
    for (const fd of held.splice(0)) closeSync(fd);
  };
  if (process.platform !== "darwin") return { descriptors: [], release };
  try {
    const descriptors = execFileSync(
      nativeBinary(directory, "host-footprint"),
      ["--capture", String(pid), String(process.pid)],
      { encoding: "utf8", timeout: 2000, maxBuffer: 4096 },
    )
      .trim()
      .split("\n")
      .map((line) => {
        const [, supervisorPid, birth, fd, handle] = line.split(" ");
        // No event-loop turn has run since the capture, so the stream cannot
        // have closed this descriptor yet; the duplicate is that endpoint.
        held.push(openSync(`/dev/fd/${fd}`, "r"));
        return { pid: Number(supervisorPid), birth, fd: held.at(-1), handle };
      });
    return { descriptors, release };
  } catch (error) {
    release();
    throw error;
  }
}

export function readHostSnapshot({
  footprint = true,
  directory,
  descriptorOwners = [],
} = {}) {
  const started = performance.now();
  let sample;
  if (process.platform === "darwin") {
    const binary = nativeBinary(directory, "host-footprint");
    const census = (full) =>
      parseNativeSnapshot(
        execFileSync(
          binary,
          [
            ...(full ? [] : ["--light"]),
            ...descriptorOwners.flatMap(({ key, descriptors, birth = "0.0" }) =>
              descriptors.map(
                ({ pid, birth: supervisorBirth, fd, handle }) =>
                  `${key}:${pid}:${supervisorBirth}:${fd}:${handle}:${birth}`,
              ),
            ),
          ],
          {
            encoding: "utf8",
            timeout: 2000,
            maxBuffer: 4 * 1024 * 1024,
          },
        ),
      );
    // Ownership always comes from the same kernel identity reader. A ps
    // fallback's second-precision lstart cannot reclaim native registrations.
    try {
      sample = census(footprint);
    } catch (error) {
      if (!footprint) throw error;
      sample = macTopFootprint(census(false));
    }
  } else sample = portableSnapshot();
  return {
    ...sample,
    costMs: performance.now() - started,
    observedAt: new Date().toISOString(),
  };
}

export function processAlive(owner, table) {
  return table.some(
    (row) => row.pid === owner.pid && row.birth === owner.birth,
  );
}

export function ownedProcesses(
  table,
  rootPid,
  known = new Map(),
  { group = true, birth, uniqueId, descriptorOwner } = {},
) {
  const root = table.find((row) => row.pid === rootPid);
  const expected = birth ?? known.get(rootPid);
  const rootMatches = root && (!expected || root.birth === expected);
  const uniqueIds = (known.uniqueIds ??= new Set());
  if (uniqueId) uniqueIds.add(uniqueId);
  if (rootMatches && root.uniqueId) uniqueIds.add(root.uniqueId);
  const owned = new Map(
    table
      .filter(
        (row) =>
          (row.pid === rootPid && rootMatches) ||
          (group && rootMatches && row.pgid === rootPid) ||
          known.get(row.pid) === row.birth ||
          (descriptorOwner && row.descriptorOwners?.includes(descriptorOwner)),
      )
      .map((row) => [row.pid, row]),
  );
  // Iterative closure also retains observed detached descendants after reparenting.
  let changed = true;
  while (changed) {
    changed = false;
    for (const row of table)
      if (
        !owned.has(row.pid) &&
        (owned.has(row.ppid) ||
          (row.parentUniqueId && uniqueIds.has(row.parentUniqueId)))
      ) {
        owned.set(row.pid, row);
        if (row.uniqueId) uniqueIds.add(row.uniqueId);
        changed = true;
      }
  }
  if (rootMatches) known.set(root.pid, root.birth);
  for (const row of owned.values()) {
    known.set(row.pid, row.birth);
    if (row.uniqueId) uniqueIds.add(row.uniqueId);
  }
  for (const pid of known.keys()) if (!owned.has(pid)) known.delete(pid);
  // Keep the preceding census too: a parent can exit after enumeration while
  // its newborn child is not in that census yet. Do not grow lifetime history.
  const currentIds = new Set(
    [...owned.values()].map((row) => row.uniqueId).filter(Boolean),
  );
  if (uniqueId) currentIds.add(uniqueId);
  const precedingIds = known.precedingUniqueIds ?? new Set();
  known.uniqueIds = new Set([...currentIds, ...precedingIds]);
  known.precedingUniqueIds = currentIds;
  return [...owned.values()];
}

export function killOwned(
  members,
  {
    protectedPids = [],
    directory,
    sample = readHostSnapshot,
    sendSignal = (pid, signal) => process.kill(pid, signal),
    onError = (error) =>
      console.error(`DotLn process stop unavailable: ${error.message}`),
  } = {},
) {
  const current = sample({ footprint: false, directory }).processes;
  const protectedSet = new Set([process.pid, ...protectedPids]);
  const protectedGroups = new Set(
    current.filter((row) => protectedSet.has(row.pid)).map((row) => row.pgid),
  );
  // Use the revalidated member's current group. A process can call setsid
  // between the footprint census and this stop; its old pgid is not authority.
  const alive = members.flatMap((row) =>
    !protectedSet.has(row.pid) && processAlive(row, current)
      ? [current.find((live) => live.pid === row.pid)]
      : [],
  );
  const groups = new Set(
    alive
      .map((row) => row.pgid)
      .filter((pgid) => pgid > 1 && !protectedGroups.has(pgid)),
  );
  const send = (pid) => {
    try {
      sendSignal(pid, "SIGKILL");
      return true;
    } catch (error) {
      if (error.code !== "ESRCH")
        onError({ pid, code: error.code, message: error.message });
      return false;
    }
  };
  const signalledGroups = new Set([...groups].filter((pgid) => send(-pgid)));
  // A member can leave its group after even this census. Also target its
  // revalidated PID, and continue after a denied group or member signal.
  return alive.flatMap(({ pid, pgid, name }) =>
    send(pid) || signalledGroups.has(pgid) ? [{ pid, name }] : [],
  );
}

export function appendIncident(
  directory,
  incident,
  { report = console.error } = {},
) {
  const row = {
    contract: "host-memory-incident-v1",
    recordedAt: new Date().toISOString(),
    ...incident,
  };
  const attempt = (destination, write) => {
    try {
      write();
    } catch (error) {
      (incident.recordingUnavailable ??= []).push({
        destination,
        code: error.code,
        reason: error.message,
      });
      row.recordingUnavailable = incident.recordingUnavailable;
      report(
        `DotLn incident ledger unavailable (${destination}): ${error.message}; resource stop remains active and its typed details are reported`,
      );
    }
  };
  attempt("host incidents", () =>
    writeFileSync(
      join(ensureHostRoot(directory), "incidents.jsonl"),
      JSON.stringify(row) + "\n",
      { flag: "a", mode: 0o600 },
    ),
  );
  attempt("latest incident", () => {
    const latest = join(directory, "latest-incidents");
    mkdirSync(latest, { recursive: true, mode: 0o700 });
    atomicJson(join(latest, `${incident.pid}.json`), row);
  });
  // Never touch the gate's success record while it runs. This separate ignored
  // ledger counts bare/wrapped stops that have no gate row for plan failures.
  if (incident.repo) {
    attempt("checkout incidents", () => {
      const local = dirname(checksPath(incident.repo));
      mkdirSync(local, { recursive: true });
      const { repo, ...countable } = row;
      writeFileSync(
        join(local, "memory-incidents.jsonl"),
        JSON.stringify(countable) + "\n",
        { flag: "a", mode: 0o600 },
      );
    });
  }
  return row;
}

export function readRecords(directory, kind) {
  const folder = join(ensureHostRoot(directory), kind);
  mkdirSync(folder, { recursive: true, mode: 0o700 });
  return readdirSync(folder)
    .filter((name) => name.endsWith(".json"))
    .flatMap((name) => {
      try {
        return [
          {
            ...JSON.parse(readFileSync(join(folder, name), "utf8")),
            file: join(folder, name),
          },
        ];
      } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
      }
    });
}

export function registerProcess(
  kind,
  pid,
  details = {},
  directory = hostStateRoot(),
) {
  const owner = readHostSnapshot({
    footprint: false,
    directory,
  }).processes.find((row) => row.pid === pid);
  if (!owner) throw new Error(`Cannot register exited process ${pid}`);
  readRecords(directory, kind);
  const id = randomUUID(),
    file = join(directory, kind, `${id}.json`);
  const record = {
    id,
    pid,
    birth: owner.birth,
    uniqueId: owner.uniqueId,
    registeredAt: new Date().toISOString(),
    ...details,
  };
  atomicJson(file, record);
  return { record, file, release: () => rmSync(file, { force: true }) };
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A kernel advisory lock has no stale-owner unlink race. The helper holds it
// until this owner's pipe closes, including SIGKILL/crash of this process.
export async function withHostLock(
  directory,
  name,
  operation,
  { signal } = {},
) {
  ensureHostRoot(directory);
  const helper = spawn(
    nativeBinary(directory, "host-lock"),
    [join(directory, `${name}.flock`)],
    { stdio: ["pipe", "pipe", "pipe"] },
  );
  const exited = new Promise((resolve) => {
    helper.once("close", resolve);
    helper.once("error", resolve);
  });
  const abort = () => helper.kill("SIGKILL");
  signal?.addEventListener("abort", abort, { once: true });
  try {
    await new Promise((resolve, reject) => {
      let output = "";
      helper.on("error", reject);
      helper.once("exit", () =>
        reject(
          new Error(
            signal?.aborted
              ? "Host lane wait stopped"
              : "Host lock helper exited before acquisition",
          ),
        ),
      );
      helper.stdout.on("data", (chunk) => {
        output += chunk;
        if (output.includes("LOCKED\n")) resolve();
      });
      if (signal?.aborted) abort();
    });
    signal?.removeEventListener("abort", abort);
    return await operation();
  } finally {
    signal?.removeEventListener("abort", abort);
    if (helper.stdin && !helper.stdin.destroyed) helper.stdin.end();
    await exited;
  }
}
