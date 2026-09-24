import {
  closeSync,
  existsSync,
  fsyncSync,
  lstatSync,
  linkSync,
  unlinkSync,
  mkdirSync,
  openSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { randomUUID } from "node:crypto";
import {
  TOOL_ROOT,
  docRelative,
  findLaunchpad,
  loadConfig,
} from "./config.mjs";
import { controlPaths } from "./control.mjs";
import { readControl } from "./control-store.mjs";
import { workOrderAuthorityFiles, workOrderAuthorityPath } from "./paths.mjs";
import {
  canonical,
  contractDigest,
  validateCompiled,
  validateProvenance,
  validateAllocation,
  renderDerivedAuthority,
  SECTIONS_HASH,
} from "./derived-contract.mjs";

/** Containment applies before mkdir/open too, including every existing parent. */
function containedDestination(root, path) {
  const absolute = resolve(root, path);
  const rel = relative(root, absolute);
  if (!rel || rel.startsWith(`..${sep}`) || rel === "..")
    throw new Error("derived order: destination escapes launchpad");
  let cursor = root;
  for (const segment of rel.split(sep)) {
    cursor = join(cursor, segment);
    try {
      if (lstatSync(cursor).isSymbolicLink())
        throw new Error("derived order: destination may not contain symlinks");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return absolute;
}
function durableCreate(root, path, source) {
  const target = containedDestination(root, path);
  mkdirSync(dirname(target), { recursive: true });
  const temporary = containedDestination(
    root,
    docRelative(root, "control", "local/derived-order-staging", randomUUID()),
  );
  mkdirSync(dirname(temporary), { recursive: true });
  const fd = openSync(temporary, "wx", 0o644);
  try {
    writeFileSync(fd, source);
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
  try {
    // An exclusive hard link publishes only fully written bytes. A crash before
    // publication leaves an ignored-by-catalog temporary, not a torn authority.
    linkSync(temporary, target);
  } finally {
    unlinkSync(temporary);
  }
  const directory = openSync(dirname(target), "r");
  try {
    fsyncSync(directory);
  } finally {
    closeSync(directory);
  }
}
export function replayAllocations(control) {
  const allocations = new Map();
  const requests = new Set();
  for (const events of control.eventSegments.values())
    for (const event of events)
      if (event.type === "WorkOrderIdentityAllocated") {
        validateAllocation(event);
        const key = canonical(event.provenance);
        if (allocations.has(event.workOrderId) || requests.has(key))
          throw new Error(
            "derived order: duplicate allocation or provenance key",
          );
        requests.add(key);
        allocations.set(event.workOrderId, event);
      }
  return allocations;
}
function command(root, file, args) {
  const result = spawnSync(
    process.execPath,
    [join(TOOL_ROOT, "scripts", file), ...args],
    {
      cwd: root,
      env: { ...process.env, DOTLN_LAUNCHPAD: root },
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  if (result.status !== 0)
    throw new Error(
      `derived order: ${file} refused; allocation retained for retry\n${result.stderr || result.stdout || result.error?.message}`,
    );
}
/** A compiled WorkOrder, not a CompiledProgram: rebinding a program after hashing
 * would leave a false semantic/artifact identity. Callers compile downstream
 * programs with the returned workOrderId and retain this authority path. */
export async function materializeOrder(
  compiled,
  provenance,
  {
    root = findLaunchpad(),
    activate = true,
    dependencies = [],
    surfaces = [],
    releaseClassification = "minor",
  } = {},
) {
  root = realpathSync(root);
  compiled = validateCompiled(compiled);
  provenance = validateProvenance(provenance);
  if (
    !["patch", "minor", "major", "unassigned"].includes(
      releaseClassification,
    ) ||
    !Array.isArray(surfaces) ||
    surfaces.some((value) => typeof value !== "string" || !value.trim())
  )
    throw new Error(
      "derived order: invalid release classification or surfaces",
    );
  const config = loadConfig(root);
  if (
    compiled.repo !== "self" &&
    (!Object.hasOwn(config.repositories, compiled.repo) ||
      !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(compiled.baseCommit))
  )
    throw new Error(
      "derived order: repo must be self or a registered public repository id with its full base commit",
    );
  const requestHash = contractDigest({
    compiled,
    provenance,
    dependencies,
    surfaces,
    releaseClassification,
  });
  const lockPath = containedDestination(
    root,
    docRelative(root, "control", "local/derived-orders"),
  );
  const { WorkerStore } = await import(
    pathToFileURL(join(TOOL_ROOT, "packages/skeleton/dist/src/worker-store.js"))
  );
  const lock = new WorkerStore(lockPath);
  const inspect = () => replayAllocations(readControl(root));
  for (let attempt = 0; ; attempt++) {
    try {
      lock.acquire(inspect);
      break;
    } catch (error) {
      if (
        attempt >= 200 ||
        !/already has a live host|recovery is busy/.test(error.message)
      )
        throw error;
      await delay(10);
    }
  }
  try {
    let control = readControl(root);
    const allocations = replayAllocations(control);
    let allocation = [...allocations.values()].find(
      (entry) => canonical(entry.provenance) === canonical(provenance),
    );
    if (allocation && allocation.requestHash !== requestHash)
      throw new Error(
        "derived order: provenance key already names a different contract; use a new sourceId",
      );
    if (!allocation) {
      const used = new Set([
        ...control.orders.keys(),
        ...workOrderAuthorityFiles(root).map(
          (path) => /(?:^|\/)(WO-\d{3})-/.exec(path)?.[1],
        ),
      ]);
      let id;
      for (
        let number = Number(config.derivedOrders.first.slice(3));
        number <= Number(config.derivedOrders.last.slice(3));
        number++
      ) {
        const candidate = `WO-${String(number).padStart(3, "0")}`;
        if (!used.has(candidate)) {
          id = candidate;
          break;
        }
      }
      if (!id)
        throw new Error(
          `derived order: identity range exhausted (${config.derivedOrders.first}..${config.derivedOrders.last})`,
        );
      const workOrderPath = docRelative(
        root,
        "derivedWorkOrders",
        `${id}-derived.md`,
      );
      const workOrder = { ...compiled, workOrderId: id };
      const authority = renderDerivedAuthority(workOrder, provenance, {
        dependencies,
        surfaces,
        releaseClassification,
      });
      workOrderAuthorityPath(root, id, workOrderPath, { requireFile: false });
      containedDestination(root, workOrderPath);
      allocation = {
        schemaVersion: 1,
        type: "WorkOrderIdentityAllocated",
        recordedAt: new Date().toISOString(),
        workOrderId: id,
        workOrderPath,
        provenance,
        requestHash,
        sectionsHash: SECTIONS_HASH,
        compiled: workOrder,
        authority,
      };
      validateAllocation(allocation);
      // The allocation is the durable recovery record. A crash here can leave
      // a missing authority, but never permits another caller to reuse this ID.
      durableCreate(
        root,
        controlPaths(root).segment(id),
        `${JSON.stringify(allocation)}\n`,
      );
    }
    const { workOrderId, workOrderPath, authority } = allocation;
    const file = containedDestination(root, workOrderPath);
    control = readControl(root);
    const state = control.orders.get(workOrderId).state;
    if (!existsSync(file)) {
      if (state.phase !== "none")
        throw new Error(
          "derived order: activated authority is missing; recover its reviewed bytes before retrying",
        );
      durableCreate(root, workOrderPath, authority);
    } else workOrderAuthorityPath(root, workOrderId, workOrderPath);
    if (activate && state.phase === "none") {
      if (readFileSync(file, "utf8") !== authority)
        throw new Error(
          "derived order: authority was edited; review and activate it explicitly with resume activate",
        );
      command(root, "resume.mjs", [
        "activate",
        workOrderId,
        workOrderPath,
        "--work-order",
        workOrderId,
      ]);
    }
    command(root, "work-orders.mjs", ["index"]);
    return {
      workOrderId,
      workOrderPath,
      provenance: structuredClone(provenance),
      workOrder: structuredClone(allocation.compiled),
      phase: readControl(root).orders.get(workOrderId).state.phase,
    };
  } finally {
    lock.release();
  }
}
export async function fileIntent(prose, options = {}) {
  if (typeof prose !== "string" || !prose.trim())
    throw new Error('usage: dotln intent "<prose>"');
  return materializeOrder(
    {
      workOrderId: "draft-intent",
      objective: prose,
      acceptanceCriteria: [
        "Replace this draft criterion with reviewed, executable acceptance criteria before activation.",
      ],
      knownFacts: [],
      decisions: [],
      constraints: ["Human review is required before activation."],
      nonGoals: [],
      repo: "self",
      baseCommit: "unassigned",
      allowedOperations: [],
      prohibitedOperations: [],
      requiredEvidence: ["Human-reviewed contract"],
      outputContract: {},
    },
    { kind: "intent", sourceId: options.sourceId ?? randomUUID() },
    { ...options, activate: false, releaseClassification: "unassigned" },
  );
}

/** Runtime status consumes the same control fold, not a second lifecycle. */
export function projectDerivedOrders(root = findLaunchpad()) {
  return [...readControl(root).orders.values()]
    .filter(({ state }) => state.allocation)
    .map(({ state }) => ({
      workOrderId: state.workOrderId,
      workOrderPath: state.workOrderPath,
      phase: state.phase === "none" ? "draft" : state.phase,
      provenance: state.provenance,
    }));
}
