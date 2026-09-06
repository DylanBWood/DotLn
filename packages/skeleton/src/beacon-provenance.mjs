import { createHmac, createSecretKey, randomBytes } from "node:crypto";
import {
  closeSync,
  lstatSync,
  openSync,
  readFileSync,
  realpathSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { canonicalDestination, exists } from "./beacon-io.mjs";
import { v2Ordinal } from "./beacon-v3-codebook.mjs";

/** @typedef {"residue-matched" | "forged-provenance" | "unverifiable-provenance" | "unauthenticated-legacy" | "not-applicable"} ProvenanceCheck */
/** @typedef {import("./beacon-v3-codebook.mjs").BeaconV3State} BeaconV3State */
/** @typedef {{readonly epoch: number, sign: (state: Omit<BeaconV3State, "authenticator" | "keyEpoch">, address: string) => BeaconV3State, check: (state: BeaconV3State, address: string) => ProvenanceCheck}} BeaconProvenance */

// Never print file contents, keys, or provider errors. Keys are host-owned,
// external to every Git checkout, and stay inside this closure after loading.
/** @param {string} path @param {string} repository */
const keyPath = (path, repository) => {
  const target = resolve(path);
  const root = realpathSync(repository);
  const rel = relative(root, target);
  if (
    !isAbsolute(path) ||
    canonicalDestination(target) !== target ||
    rel === "" ||
    (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`))
  )
    throw new Error(
      "beacon key must be a regular private file outside the repository",
    );
  for (let parent = dirname(target); ; parent = dirname(parent)) {
    if (exists(join(parent, ".git")))
      throw new Error("beacon key must be outside every Git checkout");
    if (parent === dirname(parent)) break;
  }
  return target;
};

/** @param {string} path */
const readKey = (path) => {
  try {
    const metadata = lstatSync(path);
    if (
      !metadata.isFile() ||
      (metadata.mode & 0o777) !== 0o600 ||
      metadata.size > 256
    )
      throw new Error();
    const record = JSON.parse(readFileSync(path, "utf8"));
    if (
      Object.keys(record).sort().join(",") !== "epoch,key" ||
      !Number.isInteger(record.epoch) ||
      record.epoch < 0 ||
      record.epoch > 255 ||
      typeof record.key !== "string" ||
      !/^[a-f0-9]{64}$/.test(record.key)
    )
      throw new Error();
    return /** @type {{epoch: number, key: string}} */ (record);
  } catch {
    throw new Error("beacon key unavailable or invalid");
  }
};

/** @param {string} path @param {string} repository */
export function createBeaconKey(path, repository) {
  const target = keyPath(path, repository);
  try {
    writeFileSync(
      target,
      JSON.stringify({ epoch: 0, key: randomBytes(32).toString("hex") }),
      { flag: "wx", mode: 0o600 },
    );
  } catch {
    throw new Error("beacon key creation refused");
  }
  return 0;
}

/** One locked atomic rotation; exhaustion refuses before any replacement.
 * Old key bytes are never retained by this API. Open a fresh handle afterward.
 * @param {string} path @param {string} repository
 */
export function rotateBeaconKey(path, repository) {
  const target = keyPath(path, repository);
  const lock = `${target}.rotation-lock`;
  let fd;
  let temporary;
  try {
    fd = openSync(lock, "wx", 0o600);
    const current = readKey(target);
    if (current.epoch === 255)
      throw new Error(
        "beacon key epoch exhausted; a later codebook is required",
      );
    const epoch = current.epoch + 1;
    temporary = `${target}.rotation-${randomBytes(12).toString("hex")}`;
    writeFileSync(
      temporary,
      JSON.stringify({ epoch, key: randomBytes(32).toString("hex") }),
      { flag: "wx", mode: 0o600 },
    );
    renameSync(temporary, target);
    temporary = undefined;
    return epoch;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("beacon key epoch exhausted")
    )
      throw error;
    throw new Error("beacon key rotation refused");
  } finally {
    if (temporary && exists(temporary)) unlinkSync(temporary);
    if (fd !== undefined) {
      closeSync(fd);
      unlinkSync(lock);
    }
  }
}

/** @param {string} path @param {string} repository @returns {BeaconProvenance} */
export function openBeaconKey(path, repository) {
  const record = readKey(keyPath(path, repository));
  const key = createSecretKey(Buffer.from(record.key, "hex"));
  const epoch = record.epoch;
  /** @param {Omit<BeaconV3State, "authenticator" | "keyEpoch">} state @param {string} address */
  const residue = (state, address) => {
    if (!/^[a-f0-9]{64}\.beacon$/.test(address))
      throw new Error("invalid beacon residue address");
    return createHmac("sha256", key)
      .update(`dotln-beacon-v3\0${address}\0${v2Ordinal(state)}\0${epoch}`)
      .digest()
      .readUInt16BE(0);
  };
  return Object.freeze({
    epoch,
    sign: (state, address) => ({
      ...state,
      codebookVersion: 3,
      keyEpoch: epoch,
      authenticator: residue(state, address),
    }),
    check: (state, address) =>
      state.keyEpoch !== epoch
        ? "unverifiable-provenance"
        : state.authenticator === residue(state, address)
          ? "residue-matched"
          : "forged-provenance",
  });
}
