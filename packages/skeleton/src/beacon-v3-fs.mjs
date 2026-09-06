import {
  closeSync,
  lstatSync,
  mkdtempSync,
  openSync,
  readSync,
  realpathSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";
import {
  exactHostSize,
  probeBeaconStorage,
  writeBeaconFile,
} from "./beacon-io.mjs";
import {
  BEACON_V3_CODEBOOK,
  MAX_V3_ALLOCATED_BLOCKS,
  MAX_V3_LOGICAL_BYTES,
  decodeV3BeaconSize,
  encodeV3Beacon,
} from "./beacon-v3-codebook.mjs";

/** @typedef {import("./beacon-io.mjs").BeaconStorage & {v3: true, device: bigint}} V3Storage */

/** A fresh bounded ceiling, never a filesystem theoretical maximum. The large
 * probe is attempted only after a zero-block 64 KiB hole has been observed.
 * @param {string} directory @returns {V3Storage}
 */
export function probeV3Storage(directory) {
  const storage = probeBeaconStorage(directory);
  if (!storage.sparse || storage.blockBytes > MAX_V3_ALLOCATED_BLOCKS * 512n)
    throw new Error(
      "v3 requires observed sparse storage within its allocated-block bound; return to planning",
    );
  const stage = mkdtempSync(join(realpathSync(directory), ".v3-probe-"));
  try {
    const observed = { ...storage, maxLogicalBytes: MAX_V3_LOGICAL_BYTES };
    // Only the small JSON prefix is materialized; the remaining bytes are holes.
    const content = '{"recordType":"v3-storage-probe"}\n';
    writeBeaconFile(
      join(stage, "published"),
      "probe.beacon",
      { size: MAX_V3_LOGICAL_BYTES, mtimeMs: 1200001, content },
      observed,
    );
    const path = join(stage, "published/probe.beacon");
    const metadata = lstatSync(path, { bigint: true });
    const fd = openSync(path, "r");
    try {
      const tail = Buffer.alloc(32, 1);
      if (
        readSync(
          fd,
          tail,
          0,
          tail.length,
          Number(MAX_V3_LOGICAL_BYTES - 32n),
        ) !== 32 ||
        !tail.every((value) => value === 0)
      )
        throw new Error("v3 zero tail was not preserved");
    } finally {
      closeSync(fd);
    }
    if (metadata.blocks > MAX_V3_ALLOCATED_BLOCKS)
      throw new Error("v3 allocated-block premise failed");
    return { ...observed, v3: true, device: metadata.dev };
  } catch {
    throw new Error(
      "v3 sparse/size/mtime/rename premise failed; return to planning",
    );
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }
}

/** All host-premise checks precede creation of the destination or staging file.
 * @param {string} directory @param {string} address
 * @param {{size: bigint, mtimeMs: number, content: string}} encoded
 * @param {V3Storage} storage
 */
export function writeV3BeaconFile(directory, address, encoded, storage) {
  if (
    !storage.v3 ||
    !storage.sparse ||
    storage.maxLogicalBytes < MAX_V3_LOGICAL_BYTES ||
    storage.blockBytes > MAX_V3_ALLOCATED_BLOCKS * 512n
  )
    throw new Error("v3 requires the complete observed sparse-storage premise");
  exactHostSize(encoded.size, storage);
  if (
    decodeV3BeaconSize(encoded.size).status !== "decoded" ||
    Buffer.byteLength(encoded.content, "utf8") >
      BEACON_V3_CODEBOOK.maxPrefixBytes
  )
    throw new Error("v3 record exceeds the bounded codebook or prefix");
  // The nearest existing ancestor is the volume on which staging will occur.
  let parent = directory;
  while (true) {
    try {
      if (lstatSync(parent, { bigint: true }).dev !== storage.device)
        throw new Error("v3 storage observation belongs to another device");
      break;
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code !== "ENOENT")
        throw error;
      parent = join(parent, "..");
    }
  }
  writeBeaconFile(directory, address, encoded, storage);
}

/** @param {string} directory @param {string} address
 * @param {import("./control-beacon.js").ControlProjectionRecord} record
 * @param {import("./beacon-provenance.mjs").BeaconProvenance} key @param {V3Storage} storage
 */
export function emitV3Beacon(directory, address, record, key, storage) {
  const state = key.sign(
    {
      codebookVersion: 3,
      phase: record.phase,
      latestVerdict: record.latestVerdict,
      effort: record.effort,
      provenance: record.provenance,
    },
    address,
  );
  const projection = {
    recordType: "control-beacon-projection",
    codebookVersion: 3,
    workOrderId: record.workOrderId,
    recordedAt: record.recordedAt,
    phase: record.phase,
    latestVerdict: record.latestVerdict,
    effort: record.effort,
    provenance: record.provenance,
  };
  const mtimeMs = Date.parse(record.recordedAt);
  if (
    record.provenance !== "host-projected" ||
    record.recordType !== "control-beacon-projection" ||
    !/^WO-\d{3}$/.test(record.workOrderId) ||
    !Number.isSafeInteger(mtimeMs) ||
    mtimeMs < 0 ||
    new Date(mtimeMs).toISOString() !== record.recordedAt
  )
    throw new Error("v3 requires a canonical host control projection");
  writeV3BeaconFile(
    directory,
    address,
    {
      size: encodeV3Beacon(state),
      mtimeMs,
      content: JSON.stringify(projection) + "\n",
    },
    storage,
  );
  return state;
}
