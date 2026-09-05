import assert from "node:assert/strict";
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import {
  controlBeaconAddress,
  controlBeaconDirectory,
  sweepControlBeacons,
} from "../packages/skeleton/src/control-beacon-fs.mjs";
import {
  CONTROL_CODEBOOK,
  decodeGroupBeaconSize,
  encodeControlBeacon,
  encodeGroupBeacon,
  groupCounts,
} from "../packages/skeleton/src/control-codebook.mjs";
import {
  probeBeaconStorage,
  writeBeaconFile,
} from "../packages/skeleton/src/beacon-io.mjs";

const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== "--smoke"))
  throw new Error("usage: node scripts/benchmark-beacon.mjs [--smoke]");
const smoke = args[0] === "--smoke";
const root = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-beacon-benchmark-")),
);
const rounds = smoke ? 3 : 50;
const measure = (read) => {
  for (let i = 0; i < 5; i++) read();
  const samples = Array.from({ length: rounds }, () => {
    const start = performance.now();
    read();
    return performance.now() - start;
  }).sort((a, b) => a - b);
  return {
    medianMs: Number(samples[Math.floor(samples.length / 2)].toFixed(4)),
    p95Ms: Number(samples[Math.ceil(samples.length * 0.95) - 1].toFixed(4)),
  };
};
try {
  const storage = probeBeaconStorage(root);
  const results = [];
  for (const members of smoke ? [3, 12] : [3, 12, 100, 1000]) {
    const fixture = join(root, String(members));
    const beaconDir = controlBeaconDirectory(fixture);
    const compactDir = join(fixture, "compact-records");
    mkdirSync(compactDir, { recursive: true });
    for (let index = 0; index < members; index++) {
      const state = {
        codebookVersion: 2,
        phase: CONTROL_CODEBOOK.phases[index % 8],
        latestVerdict: CONTROL_CODEBOOK.verdicts[index % 3],
        effort: CONTROL_CODEBOOK.efforts[index % 6],
        provenance: "host-projected",
      };
      writeBeaconFile(
        beaconDir,
        controlBeaconAddress(`fixture-${index}`),
        {
          size: encodeControlBeacon(state),
          mtimeMs: 1200000,
          content: JSON.stringify(state),
        },
        { ...storage, sparse: false },
      );
    }
    const metadataRead = () => sweepControlBeacons([{ worktree: fixture }]);
    const observations = metadataRead();
    observations.forEach((value, index) =>
      writeFileSync(
        join(compactDir, `${String(index).padStart(4, "0")}.json`),
        JSON.stringify(value),
      ),
    );
    const indexPath = join(fixture, "index.json");
    writeFileSync(indexPath, JSON.stringify(observations));
    const compactRead = () =>
      readdirSync(compactDir)
        .sort()
        .map((name) =>
          JSON.parse(readFileSync(join(compactDir, name), "utf8")),
        );
    const indexRead = () => JSON.parse(readFileSync(indexPath, "utf8"));
    assert.deepEqual(compactRead(), observations);
    assert.deepEqual(indexRead(), observations);
    const allocated = (directory) =>
      readdirSync(directory).reduce(
        (sum, name) => sum + lstatSync(join(directory, name)).blocks * 512,
        0,
      );
    const result = {
      members,
      equalObservationPayloads: true,
      metadataSweep: measure(metadataRead),
      compactJsonPerMember: measure(compactRead),
      singleJsonIndex: measure(indexRead),
      allocatedFileDataBytes: {
        beacons: allocated(beaconDir),
        compactJsonPerMember: allocated(compactDir),
        singleJsonIndex: lstatSync(indexPath).blocks * 512,
      },
    };
    if (members <= 12) {
      const counts = groupCounts(observations);
      const size = encodeGroupBeacon(counts);
      const directory = join(fixture, "group");
      if (size <= storage.maxLogicalBytes) {
        writeBeaconFile(
          directory,
          "value.beacon",
          { size, mtimeMs: 1200000, content: "" },
          storage,
        );
        const groupRead = () =>
          decodeGroupBeaconSize(
            lstatSync(join(directory, "value.beacon"), { bigint: true }).size,
          );
        assert.deepEqual(groupRead(), {
          status: "decoded",
          state: { groupCodebookVersion: 1, counts },
        });
        writeFileSync(join(fixture, "counts.json"), JSON.stringify(counts));
        const jsonCountsRead = () =>
          JSON.parse(readFileSync(join(fixture, "counts.json"), "utf8"));
        assert.deepEqual(jsonCountsRead(), counts);
        Object.assign(result, {
          phaseCountsOnly: {
            groupBeacon: measure(groupRead),
            jsonCounts: measure(jsonCountsRead),
            logicalBytes: String(size),
            allocatedFileDataBytes:
              lstatSync(join(directory, "value.beacon")).blocks * 512,
          },
        });
      }
    }
    results.push(result);
  }
  console.log(
    JSON.stringify(
      {
        observedAt: new Date().toISOString(),
        node: process.version,
        platform: process.platform,
        scope:
          "synthetic temporary fixtures; one process; warm local filesystem cache; no concurrent writer or crash",
        sameDeviceAsCheckout:
          lstatSync(root).dev === lstatSync(process.cwd()).dev,
        rounds,
        warmups: 5,
        groupMemberLimit: 12,
        storageAccounting:
          "allocated file-data blocks only; excludes inodes, directories and filesystem metadata",
        observationsBeyondGroupLimit:
          "100 and 1000 exercise individual reader scaling only; the group codebook refuses more than 12 members",
        results,
      },
      null,
      2,
    ),
  );
} finally {
  rmSync(root, { recursive: true, force: true });
}
