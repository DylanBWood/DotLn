import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  utimesSync,
  writeFileSync,
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
import type { Event } from "@dotln/kernel";
import {
  beaconScope,
  decodeBeaconSize,
  deriveBeaconProjections,
  encodeBeacon,
  type BeaconClaimRecord,
  type BeaconDecode,
  type BeaconRecord,
} from "./beacon.js";

const inside = (root: string, path: string): boolean => {
  const rel = relative(root, path);
  return (
    rel === "" ||
    (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`))
  );
};

const exists = (path: string): boolean => {
  try {
    lstatSync(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
};

// Resolve existing ancestors too, including aliases to a forbidden intake path.
const canonicalDestination = (path: string): string => {
  let ancestor = path;
  const tail: string[] = [];
  while (!exists(ancestor)) {
    tail.unshift(basename(ancestor));
    ancestor = dirname(ancestor);
  }
  return join(realpathSync(ancestor), ...tail);
};

export function validateBeaconDirectory(
  directory: string,
  repository: string,
): string {
  if (!directory.trim()) throw new Error("--beacons requires a directory");
  const requested = resolve(directory);
  const destination = canonicalDestination(requested);
  const root = realpathSync(repository);
  for (const path of [requested, destination]) {
    const parts = path.split(sep);
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

// Only producer identity and scope affect the address. No status/version digits.
export function beaconAddress(record: BeaconRecord): string {
  const producer =
    record.recordType === "beacon-projection"
      ? ["host"]
      : ["executor", record.actor];
  return (
    createHash("sha256")
      .update(JSON.stringify([producer, beaconScope(record)]))
      .digest("hex") + ".beacon"
  );
}

const emit = (directory: string, record: BeaconRecord): void => {
  const encoded = encodeBeacon(record); // Refuse unencodable data before any write.
  if (canonicalDestination(directory) !== directory)
    throw new Error("beacon directory changed since validation");
  const destination = join(directory, beaconAddress(record));
  if (exists(destination) && !lstatSync(destination).isFile())
    throw new Error("beacon address is occupied by a non-regular file");
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  // Sibling staging keeps temporary entries entirely outside the observed directory.
  const staging = mkdtempSync(join(dirname(directory), ".dotln-beacon-stage-"));
  try {
    const temporary = join(staging, "value");
    writeFileSync(temporary, encoded.content, {
      encoding: "utf8",
      mode: 0o600,
      flag: "wx",
    });
    utimesSync(temporary, encoded.mtimeMs / 1000, encoded.mtimeMs / 1000);
    let metadata = lstatSync(temporary, { bigint: true });
    // Node's seconds-to-microseconds conversion can truncate an integer-ms
    // target one microsecond early (observed at 1,200,001 ms). Center that
    // microsecond bin, then require the exact requested timestamp before rename.
    if (metadata.mtimeNs !== BigInt(encoded.mtimeMs) * 1_000_000n) {
      const centered = encoded.mtimeMs / 1000 + 0.0000005;
      utimesSync(temporary, centered, centered);
      metadata = lstatSync(temporary, { bigint: true });
    }
    if (
      metadata.size !== BigInt(encoded.size) ||
      metadata.mtimeNs !== BigInt(encoded.mtimeMs) * 1_000_000n
    )
      throw new Error(
        "filesystem did not preserve the exact beacon size/mtime",
      );
    renameSync(temporary, destination);
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
};

export function createBeaconWriter(directory: string, repository: string) {
  const destination = validateBeaconDirectory(directory, repository);
  return {
    directory: destination,
    project(events: readonly Event[]): void {
      const records = deriveBeaconProjections(events);
      // Check the complete batch before emitting its first file. Atomicity is per file.
      for (const record of records) encodeBeacon(record);
      for (const record of records) emit(destination, record);
    },
    claim(record: BeaconClaimRecord): void {
      if (
        record.recordType !== "beacon-claim" ||
        record.provenance !== "self-reported"
      )
        throw new Error(
          "the executor channel accepts self-reported claims only",
        );
      emit(destination, record);
    },
  };
}

export interface BeaconObservation {
  readonly address: string;
  readonly size: bigint;
  readonly mtimeNs: bigint;
  readonly decoded: BeaconDecode;
}

export function sweepBeacons(directory: string): readonly BeaconObservation[] {
  return readdirSync(directory)
    .flatMap((address): BeaconObservation[] => {
      try {
        // lstat is the non-following metadata operation: a symlink cannot lend its target's state.
        const stat = lstatSync(join(directory, address), { bigint: true });
        return [
          {
            address,
            size: stat.size,
            mtimeNs: stat.mtimeNs,
            decoded: stat.isFile()
              ? decodeBeaconSize(stat.size)
              : { status: "malformed" },
          },
        ];
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
        throw error;
      }
    })
    .sort((a, b) =>
      a.size < b.size
        ? -1
        : a.size > b.size
          ? 1
          : a.address < b.address
            ? -1
            : a.address > b.address
              ? 1
              : 0,
    );
}

export function renderConstellation(
  observations: readonly BeaconObservation[],
): string {
  return [
    "BEACON CONSTELLATION (metadata only; size order)",
    "bytes | mtime (UTC) | state | refusals | provenance | codebook | address",
    ...observations.map(({ address, size, mtimeNs, decoded }) => {
      const prefix = `${size} | ${new Date(Number(mtimeNs / 1_000_000n)).toISOString()}`;
      if (decoded.status === "malformed")
        return `${prefix} | malformed | — | — | — | ${address}`;
      if (decoded.status === "unknown-codebook")
        return `${prefix} | unknown-codebook | — | — | ${decoded.codebookVersion} | ${address}`;
      const state = decoded.state;
      return `${prefix} | ${state.actionClass}/${state.outcome} | ${state.refusalCount === 3 ? "3+" : state.refusalCount} | ${state.provenance} | ${state.codebookVersion} | ${address}`;
    }),
  ].join("\n");
}
