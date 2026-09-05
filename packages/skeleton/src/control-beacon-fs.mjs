import { createHash, randomBytes } from "node:crypto";
import {
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import {
  canonicalDestination,
  exists,
  probeBeaconStorage,
  validateBeaconDirectory,
  writeBeaconFile,
} from "./beacon-io.mjs";
import {
  BEACON_STALE_AFTER_MS,
  CONTROL_CODEBOOK,
  beaconAge,
  decodeSignalSize,
  decodeGroupBeaconSize,
  encodeControlBeacon,
  encodeGroupBeacon,
  groupCounts,
} from "./control-codebook.mjs";

export const CONTROL_BEACON_ROOT = ".control-beacons";
/** @param {string} text */
const hash = (text) => createHash("sha256").update(text).digest("hex");
/** @param {string} id */
export const controlBeaconAddress = (id) => `${hash(`control:${id}`)}.beacon`;
/** @param {string} root @param {"public" | "verifier"} audience */
export const controlBeaconDirectory = (root, audience = "public") =>
  join(root, CONTROL_BEACON_ROOT, audience);

/** @typedef {import("./control-beacon.js").SignalObservation} SignalObservation */
/** @typedef {import("./control-beacon.js").BeaconWorktree} BeaconWorktree */

/** @param {string} path */
const safeDirectory = (path) => {
  if (canonicalDestination(path) !== resolve(path))
    throw new Error("beacon directory must not contain a symlink");
  if (exists(path) && !lstatSync(path).isDirectory())
    throw new Error("beacon directory is not a directory");
};

/** @param {string} path @param {string} address @returns {SignalObservation} */
export function observeBeaconMetadata(path, address) {
  try {
    const metadata = lstatSync(path, { bigint: true });
    return {
      address,
      size: String(metadata.size),
      mtimeMs: Number(metadata.mtimeNs / 1000000n),
      mtimeNs: String(metadata.mtimeNs),
      decoded: metadata.isFile()
        ? decodeSignalSize(metadata.size)
        : { status: "malformed" },
    };
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code !== "ENOENT")
      throw error;
    return {
      address,
      size: null,
      mtimeMs: null,
      decoded: { status: "absent" },
    };
  }
}

/** @param {SignalObservation} observation */
const phaseRank = ({ decoded }) =>
  decoded.status === "decoded" && decoded.state.codebookVersion === 2
    ? CONTROL_CODEBOOK.phases.indexOf(decoded.state.phase)
    : CONTROL_CODEBOOK.phases.length;

/**
 * The only beacon reads are directory metadata and lstat. No content opens;
 * group caches, claims, sessions, and restricted directories are not enumerated.
 * @param {readonly BeaconWorktree[]} worktrees
 * @param {"public" | "verifier"} audience
 * @returns {readonly SignalObservation[]}
 */
export function sweepControlBeacons(worktrees, audience = "public") {
  if (audience !== "public" && audience !== "verifier")
    throw new Error("invalid beacon audience");
  const seen = new Set();
  const observations = worktrees.flatMap(({ worktree, branch }) => {
    const root = resolve(worktree);
    if (seen.has(root)) throw new Error("duplicate worktree in beacon set");
    seen.add(root);
    const directory = controlBeaconDirectory(root, audience);
    safeDirectory(directory);
    const addresses = new Set(
      exists(directory)
        ? readdirSync(directory).filter((name) =>
            /^[a-f0-9]{64}\.beacon$/.test(name),
          )
        : [],
    );
    const order = /^refs\/heads\/wo-(\d{3})$/.exec(branch ?? "")?.[1];
    if (order) addresses.add(controlBeaconAddress(`WO-${order}`));
    if (!addresses.size) {
      return [
        /** @type {SignalObservation} */ ({
          address: `${hash(root)}:unassigned`,
          size: null,
          mtimeMs: null,
          decoded: { status: "absent" },
        }),
      ];
    }
    return [...addresses].map((name) =>
      observeBeaconMetadata(join(directory, name), `${hash(root)}:${name}`),
    );
  });
  return /** @type {SignalObservation[]} */ (observations).sort(
    (a, b) =>
      phaseRank(a) - phaseRank(b) ||
      (a.address < b.address ? -1 : a.address > b.address ? 1 : 0),
  );
}

/**
 * Trusted host provisioning API. The returned random capability is bound to
 * one work order; only next accepts it, and only that briefing reveals the
 * separate random directory. It is local, ignored session data, not a setting.
 * @param {string} root @param {string} workOrderId
 */
export function issueBeaconSession(root, workOrderId) {
  root = canonicalDestination(resolve(root));
  if (!/^WO-\d{3}$/.test(workOrderId))
    throw new Error("invalid beacon session work order");
  const base = validateBeaconDirectory(join(root, CONTROL_BEACON_ROOT), root, {
    control: true,
  });
  const sessions = join(base, "sessions");
  safeDirectory(sessions);
  mkdirSync(sessions, { recursive: true, mode: 0o700 });
  const token = randomBytes(32).toString("hex");
  const name = randomBytes(32).toString("hex");
  writeFileSync(
    join(sessions, `${hash(token)}.json`),
    JSON.stringify({ workOrderId, name }),
    { mode: 0o600, flag: "wx" },
  );
  return token;
}

/** @param {string} base @param {string} filename */
const sessionRecord = (base, filename) => {
  const path = join(base, "sessions", filename);
  if (!lstatSync(path).isFile()) throw new Error("invalid beacon session");
  const record = JSON.parse(readFileSync(path, "utf8"));
  if (
    !/^WO-\d{3}$/.test(record.workOrderId) ||
    !/^[a-f0-9]{64}$/.test(record.name)
  )
    throw new Error("invalid beacon session");
  return /** @type {{workOrderId: string, name: string}} */ (record);
};

/** @param {string} root @param {string} workOrderId @param {string} token */
export function restrictedBeaconBriefing(root, workOrderId, token) {
  try {
    root = canonicalDestination(resolve(root));
    if (!/^[a-f0-9]{64}$/.test(token)) throw new Error("invalid capability");
    const base = join(root, CONTROL_BEACON_ROOT);
    safeDirectory(join(base, "sessions"));
    const record = sessionRecord(base, `${hash(token)}.json`);
    if (record.workOrderId !== workOrderId)
      throw new Error("different session scope");
    return `Restricted host Beacon directory: ${join(base, "restricted", record.name)}`;
  } catch {
    // Errors never disclose a path or echo the supplied capability.
    throw new Error("beacon session is not authorized for this work order");
  }
}

/**
 * Called only with the canonical control fold by the shared lifecycle helper.
 * Per-file publication is atomic; a failed optional projection never rolls back
 * the already-appended transition or changes its legal result.
 * @param {string} root @param {import("./control-beacon.js").ControlProjectionRecord} record
 */
export function emitControlBeacon(root, record) {
  root = canonicalDestination(resolve(root));
  if (
    record.recordType !== "control-beacon-projection" ||
    record.provenance !== "host-projected" ||
    !/^WO-\d{3}$/.test(record.workOrderId)
  )
    throw new Error("control beacon directories accept host projections only");
  const fields = [
    "recordType",
    "codebookVersion",
    "phase",
    "latestVerdict",
    "effort",
    "provenance",
    "workOrderId",
    "recordedAt",
  ];
  if (Object.keys(record).some((key) => !fields.includes(key)))
    throw new Error("host projection contains undeclared fields");
  const size = encodeControlBeacon(record);
  const mtimeMs = Date.parse(record.recordedAt);
  if (
    !Number.isSafeInteger(mtimeMs) ||
    mtimeMs < 0 ||
    new Date(mtimeMs).toISOString() !== record.recordedAt
  )
    throw new Error(
      "host projection requires a canonical recordedAt timestamp",
    );
  const content = JSON.stringify(record);
  const base = validateBeaconDirectory(join(root, CONTROL_BEACON_ROOT), root, {
    control: true,
  });
  const directories = [
    controlBeaconDirectory(root, "public"),
    controlBeaconDirectory(root, "verifier"),
  ];
  const sessions = join(base, "sessions");
  try {
    safeDirectory(sessions);
    if (exists(sessions))
      for (const filename of readdirSync(sessions)) {
        if (!/^[a-f0-9]{64}\.json$/.test(filename))
          throw new Error("invalid session file");
        const session = sessionRecord(base, filename);
        if (session.workOrderId === record.workOrderId)
          directories.push(join(base, "restricted", session.name));
      }
    for (const directory of directories) safeDirectory(directory);
    const storage = probeBeaconStorage(base);
    for (const directory of directories)
      writeBeaconFile(
        directory,
        controlBeaconAddress(record.workOrderId),
        { size, mtimeMs, content },
        { ...storage, sparse: false },
      );
    return storage;
  } catch {
    throw new Error(
      "host beacon projection unavailable; control transition remains recorded",
    );
  }
}

/** @param {readonly BeaconWorktree[]} worktrees */
export const groupBeaconAddress = (worktrees) =>
  `${hash(JSON.stringify(worktrees.map(({ worktree }) => resolve(worktree)).sort()))}.beacon`;

/**
 * One cache per swept set in the emitting checkout. This host projection uses
 * only public metadata; it is never an agent's recorded perception or authority.
 * @param {string} root @param {readonly BeaconWorktree[]} worktrees @param {number} now
 * @param {import("./beacon-io.mjs").BeaconStorage} storage
 */
export function emitGroupBeacon(root, worktrees, now, storage) {
  const counts = groupCounts(sweepControlBeacons(worktrees));
  const directory = join(root, CONTROL_BEACON_ROOT, "groups");
  safeDirectory(directory);
  writeBeaconFile(
    directory,
    groupBeaconAddress(worktrees),
    { size: encodeGroupBeacon(counts), mtimeMs: now, content: "" },
    storage,
  );
  return counts;
}

/**
 * Each checkout owns its isolated cache. Select a matching file from the set
 * using metadata alone; the read-only command never repairs a missing cache.
 * @param {readonly BeaconWorktree[]} worktrees @param {readonly SignalObservation[]} observations
 */
export function readGroupBeacon(worktrees, observations) {
  const expected = groupCounts(observations);
  const name = groupBeaconAddress(worktrees);
  const candidates = worktrees.map(({ worktree }) => {
    const directory = join(worktree, CONTROL_BEACON_ROOT, "groups");
    safeDirectory(directory);
    const metadata = observeBeaconMetadata(
      join(directory, name),
      `${hash(resolve(worktree))}:${name}`,
    );
    return {
      ...metadata,
      decoded:
        metadata.decoded.status === "absent"
          ? { status: "absent" }
          : metadata.decoded.status === "malformed"
            ? { status: "malformed" }
            : decodeGroupBeaconSize(BigInt(metadata.size ?? 0)),
    };
  });
  return /** @type {import("./control-beacon.js").GroupObservation[]} */ (
    candidates
  )
    .filter(
      ({ decoded }) =>
        decoded.status === "decoded" &&
        decoded.state.counts.every((value, index) => value === expected[index]),
    )
    .sort(
      (a, b) =>
        (b.mtimeMs ?? 0) - (a.mtimeMs ?? 0) ||
        a.address.localeCompare(b.address),
    )[0];
}

/** @param {readonly SignalObservation[]} observations @param {number} now @param {number} threshold @param {import("./control-beacon.js").GroupObservation | undefined} group */
export function renderControlConstellation(
  observations,
  now,
  threshold = BEACON_STALE_AFTER_MS,
  group = undefined,
) {
  const rows = observations.map((observation) => {
    const { address, decoded } = observation;
    const age = beaconAge(observation, now, threshold);
    if (decoded.status !== "decoded")
      return `Beacon ${address} | ${decoded.status} | ${age}`;
    const state = decoded.state;
    const fields =
      state.codebookVersion === 2
        ? `${state.phase} | ${state.latestVerdict} | ${state.effort} | ${state.provenance}`
        : `${state.actionClass}/${state.outcome} | ${state.provenance}`;
    return `Beacon ${address} | ${fields} | ${age} | v${state.codebookVersion} | ${observation.size} bytes`;
  });
  const counts = groupCounts(observations);
  const source = group
    ? `host cache; ${beaconAge(group, now, threshold)}`
    : "derived from this sweep; no matching cache read";
  rows.push(
    `Group Beacon | ${CONTROL_CODEBOOK.phases.map((phase, index) => `${phase}=${counts[index]}`).join(" ")} | group-v1 | ${group?.size ?? encodeGroupBeacon(counts)} bytes (${source})`,
  );
  return rows.join("\n");
}
