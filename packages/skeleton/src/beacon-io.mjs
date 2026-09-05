import { execFileSync } from "node:child_process";
import {
  closeSync,
  ftruncateSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  realpathSync,
  renameSync,
  rmSync,
  utimesSync,
  writeSync,
} from "node:fs";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path";
import {
  MAX_GROUP_LOGICAL_BYTES,
  MAX_V2_LOGICAL_BYTES,
} from "./control-codebook.mjs";

/** @param {string} root @param {string} path */
const inside = (root, path) => {
  const rel = relative(root, path);
  return (
    rel === "" ||
    (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`))
  );
};

/** @param {string} path */
export const exists = (path) => {
  try {
    lstatSync(path);
    return true;
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT")
      return false;
    throw error;
  }
};

// Resolve existing ancestors too, including aliases to a forbidden intake path.
/** @param {string} path */
export const canonicalDestination = (path) => {
  let ancestor = path;
  /** @type {string[]} */
  const tail = [];
  while (!exists(ancestor)) {
    tail.unshift(basename(ancestor));
    ancestor = dirname(ancestor);
  }
  return join(realpathSync(ancestor), ...tail);
};

/** @param {string} directory @param {string} repository @param {{control?: boolean}} options */
export function validateBeaconDirectory(
  directory,
  repository,
  { control = false } = {},
) {
  if (!directory.trim()) throw new Error("--beacons requires a directory");
  const requested = resolve(directory);
  const destination = canonicalDestination(requested);
  const root = realpathSync(repository);
  for (const path of [requested, destination]) {
    const parts = path.split(sep);
    if (!control && parts.includes(".control-beacons"))
      throw new Error(
        "control beacon directories accept host projections only",
      );
    if (parts.some((part, i) => part === "docs" && parts[i + 1] === "intake"))
      throw new Error("beacons cannot be written under docs/intake");
    if (inside(root, path)) {
      const gitRoot = realpathSync(
        execFileSync("git", ["-C", root, "rev-parse", "--show-toplevel"], {
          encoding: "utf8",
        }).trim(),
      );
      if (gitRoot !== root)
        throw new Error("beacon repository must be the Git root");
      try {
        execFileSync(
          "git",
          [
            "-C",
            root,
            "check-ignore",
            "--quiet",
            "--",
            `${relative(root, path)}/`,
          ],
          { stdio: "pipe" },
        );
      } catch {
        throw new Error(
          "a beacon directory inside the repository must be gitignored",
        );
      }
    }
  }
  if (exists(destination) && !lstatSync(destination).isDirectory())
    throw new Error("beacon destination is not a directory");
  return destination;
}

/**
 * @typedef {{maxLogicalBytes: bigint, sparse: boolean, blockBytes: bigint}} BeaconStorage
 * @typedef {{size: number | bigint, mtimeMs: number, content: string}} BeaconFile
 */

/** @param {number | bigint} size @param {BeaconStorage} storage */
export function exactHostSize(size, storage) {
  if (typeof size === "number" && !Number.isSafeInteger(size))
    throw new Error("beacon size is not exactly representable by the host API");
  const bytes = BigInt(size);
  if (bytes < 0n || bytes > BigInt(Number.MAX_SAFE_INTEGER))
    throw new Error("beacon size is not exactly representable by the host API");
  if (bytes > storage.maxLogicalBytes)
    throw new Error("beacon size exceeds the observed filesystem ceiling");
  if (storage.blockBytes <= 0n)
    throw new Error("invalid filesystem block bound");
  return Number(bytes);
}

/**
 * A bounded probe, not a search for the filesystem's theoretical maximum.
 * Sparse promotion is tested first at 64 KiB; only that observed lowering may
 * probe the largest group size. A dense host retains the reproduced v2 ceiling.
 * @param {string} directory
 * @returns {BeaconStorage}
 */
export function probeBeaconStorage(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const stage = mkdtempSync(join(directory, ".probe-"));
  try {
    const path = join(stage, "value");
    const fd = openSync(path, "wx", 0o600);
    try {
      ftruncateSync(fd, 65536);
    } finally {
      closeSync(fd);
    }
    let metadata = lstatSync(path, { bigint: true });
    const blockBytes = metadata.blksize;
    const sparse = metadata.size === 65536n && metadata.blocks === 0n;
    const maximum = sparse ? MAX_GROUP_LOGICAL_BYTES : MAX_V2_LOGICAL_BYTES;
    const probeFd = openSync(path, "r+");
    try {
      if (sparse) ftruncateSync(probeFd, Number(maximum));
      else {
        const bytes = Buffer.alloc(Number(maximum), 10);
        writeAll(probeFd, bytes);
      }
    } finally {
      closeSync(probeFd);
    }
    metadata = lstatSync(path, { bigint: true });
    if (
      metadata.size !== maximum ||
      (sparse && metadata.blocks * 512n > blockBytes)
    )
      throw new Error("filesystem did not preserve the bounded beacon probe");
    return { maxLogicalBytes: maximum, sparse, blockBytes };
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }
}

/** @param {number} fd @param {Uint8Array} bytes */
const writeAll = (fd, bytes) => {
  let offset = 0;
  while (offset < bytes.length) {
    const written = writeSync(fd, bytes, offset, bytes.length - offset);
    if (written === 0) throw new Error("beacon write made no progress");
    offset += written;
  }
};

/**
 * The same validated temp-file/rename boundary serves v1, v2, and group files.
 * Size refusal precedes any allocation. Sparse group files intentionally have
 * no content; their complete disclosed value is in the independent codebook.
 * @param {string} directory @param {string} address
 * @param {BeaconFile} encoded @param {BeaconStorage} storage
 */
export function writeBeaconFile(directory, address, encoded, storage) {
  const size = exactHostSize(encoded.size, storage);
  const bytes = Buffer.from(encoded.content, "utf8");
  if (bytes.length > size)
    throw new Error("beacon record exceeds its codeword size");
  if (
    !Number.isSafeInteger(encoded.mtimeMs) ||
    encoded.mtimeMs < 0 ||
    encoded.mtimeMs > 8.64e15
  )
    throw new Error(
      "beacon mtime is not a representable nonnegative millisecond",
    );
  if (!/^[a-zA-Z0-9.-]+\.beacon$/.test(address))
    throw new Error("invalid beacon address");
  if (canonicalDestination(directory) !== directory)
    throw new Error("beacon directory changed since validation");
  const destination = join(directory, address);
  if (exists(destination) && !lstatSync(destination).isFile())
    throw new Error("beacon address is occupied by a non-regular file");
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const staging = mkdtempSync(join(dirname(directory), ".dotln-beacon-stage-"));
  try {
    const temporary = join(staging, "value");
    const fd = openSync(temporary, "wx", 0o600);
    try {
      writeAll(fd, bytes);
      if (storage.sparse) ftruncateSync(fd, size);
      else {
        const padding = Buffer.alloc(Math.min(65536, size - bytes.length), 10);
        let remaining = size - bytes.length;
        while (remaining > 0) {
          const chunk = padding.subarray(
            0,
            Math.min(remaining, padding.length),
          );
          writeAll(fd, chunk);
          remaining -= chunk.length;
        }
      }
    } finally {
      closeSync(fd);
    }
    utimesSync(temporary, encoded.mtimeMs / 1000, encoded.mtimeMs / 1000);
    let metadata = lstatSync(temporary, { bigint: true });
    if (metadata.mtimeNs !== BigInt(encoded.mtimeMs) * 1_000_000n) {
      const centered = encoded.mtimeMs / 1000 + 0.0000005;
      utimesSync(temporary, centered, centered);
      metadata = lstatSync(temporary, { bigint: true });
    }
    if (
      metadata.size !== BigInt(size) ||
      metadata.mtimeNs !== BigInt(encoded.mtimeMs) * 1_000_000n
    )
      throw new Error(
        "filesystem did not preserve the exact beacon size/mtime",
      );
    const allocatedBound = storage.sparse
      ? storage.blockBytes
      : ((BigInt(size) + storage.blockBytes - 1n) / storage.blockBytes) *
        storage.blockBytes;
    if (metadata.blocks * 512n > allocatedBound)
      throw new Error("beacon exceeds its declared allocated-block bound");
    renameSync(temporary, destination);
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}
