import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  controlBeaconAddress,
  controlBeaconDirectory,
} from "../packages/skeleton/src/control-beacon-fs.mjs";
import { decodeSignalSize } from "../packages/skeleton/src/control-codebook.mjs";

const source = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../packages/skeleton/src",
);
// Bootstrap fixtures intentionally have no dependencies or ignored built output.
export const installBeaconFixture = (root) => {
  mkdirSync(join(root, "packages/compiler/src"), { recursive: true });
  cpSync(
    join(source, "../../compiler/src/attribution.mjs"),
    join(root, "packages/compiler/src/attribution.mjs"),
  );
  const destination = join(root, "packages/skeleton/src");
  mkdirSync(destination, { recursive: true });
  for (const name of [
    "gate-deadlines.mjs",
    "gate-evidence.mjs",
    "usage-observation.mjs",
    "beacon-codebook.mjs",
    "control-codebook.mjs",
    "beacon-io.mjs",
    "control-beacon-fs.mjs",
    "beacon-v3-codebook.mjs",
    "beacon-v3-fs.mjs",
    "beacon-provenance.mjs",
  ])
    cpSync(join(source, name), join(destination, name));
};
export const snapshotBeacons = (root) => {
  const base = join(root, ".control-beacons");
  const visit = (path) => {
    const metadata = lstatSync(join(base, path), { bigint: true });
    return [
      [
        path,
        metadata.ino,
        metadata.size,
        metadata.mtimeNs,
        metadata.ctimeNs,
      ].map(String),
      ...(metadata.isDirectory() && (Number(metadata.mode) & 0o400) !== 0
        ? readdirSync(join(base, path))
            .sort()
            .flatMap((child) => visit(join(path, child)))
        : []),
    ];
  };
  return existsSync(base) ? visit("") : [];
};

export const assertControlBeacon = (root, status) => {
  for (const audience of ["public", "verifier"]) {
    const path = join(
      controlBeaconDirectory(root, audience),
      controlBeaconAddress(status.workOrder),
    );
    const metadata = lstatSync(path, { bigint: true });
    assert.deepEqual(decodeSignalSize(metadata.size), {
      status: "decoded",
      state: {
        codebookVersion: 2,
        phase: status.phase,
        latestVerdict: status.latestVerdict ?? "unknown",
        effort: status.latestAttestation?.effort ?? "unknown",
        provenance: "host-projected",
      },
    });
    assert.equal(
      metadata.mtimeNs,
      BigInt(Date.parse(status.recordedAt)) * 1000000n,
    );
    const current = readFileSync(join(root, "docs/control/current.md"), "utf8");
    assert.ok(current.includes(`Phase: ${status.phase}`));
  }
};
if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  if (process.argv[3] === "snapshot")
    console.log(JSON.stringify(snapshotBeacons(process.argv[2])));
  else if (process.argv[3] === "assert")
    assertControlBeacon(
      process.argv[2],
      JSON.parse(readFileSync(process.argv[4], "utf8")),
    );
  else installBeaconFixture(process.argv[2]);
}
