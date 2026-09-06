import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  chmodSync,
  closeSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { framedSize } from "../src/beacon-codebook.mjs";
import {
  BEACON_V3_CODEBOOK,
  MAX_V3_ALLOCATED_BLOCKS,
  MAX_V3_CODE,
  MAX_V3_LOGICAL_BYTES,
  decodeV3BeaconSize,
  encodeV3Beacon,
  type BeaconV3State,
} from "../src/beacon-v3-codebook.mjs";
import {
  CONTROL_CODEBOOK,
  decodeSignalSize,
  encodeControlBeacon,
} from "../src/control-codebook.mjs";
import {
  createBeaconKey,
  openBeaconKey,
  rotateBeaconKey,
} from "../src/beacon-provenance.mjs";
import {
  emitV3Beacon,
  probeV3Storage,
  writeV3BeaconFile,
  type V3Storage,
} from "../src/beacon-v3-fs.mjs";
import { controlBeaconAddress } from "../src/control-beacon-fs.mjs";
import type { ControlProjectionRecord } from "../src/control-beacon.js";

const repository = fileURLToPath(new URL("../../../../", import.meta.url));
const first: BeaconV3State = {
  codebookVersion: 3,
  phase: "active",
  latestVerdict: "unknown",
  effort: "unknown",
  provenance: "host-projected",
  keyEpoch: 0,
  authenticator: 0,
};
const last: BeaconV3State = {
  codebookVersion: 3,
  phase: "closed",
  latestVerdict: "pass",
  effort: "max",
  provenance: "self-reported",
  keyEpoch: 255,
  authenticator: 65535,
};
const record: ControlProjectionRecord = {
  recordType: "control-beacon-projection",
  codebookVersion: 2,
  workOrderId: "WO-099",
  phase: "verifying",
  latestVerdict: "pass",
  effort: "max",
  provenance: "host-projected",
  recordedAt: "1970-01-01T00:20:00.001Z",
};

test("WO-022 AC9 v3 data, algebraic product bounds, all residues for representative states, malformed boundaries", (t) => {
  const cardinalities = [8n, 3n, 6n, 2n, 256n, 65536n];
  const product = cardinalities.reduce((a, b) => a * b, 1n);
  assert.equal(product, 4831838208n);
  assert.equal(product * 4n - 1n, MAX_V3_CODE);
  assert.equal(framedSize(MAX_V3_CODE), MAX_V3_LOGICAL_BYTES);
  assert.equal(encodeV3Beacon(last), MAX_V3_LOGICAL_BYTES);
  assert.equal(encodeV3Beacon(first), framedSize(3n));
  assert.deepEqual(decodeV3BeaconSize(encodeV3Beacon(last)), {
    status: "decoded",
    state: last,
  });
  for (const phase of ["active", "repairing", "closed"] as const)
    for (const keyEpoch of [0, 127, 255]) {
      let previous = -1n;
      for (let authenticator = 0; authenticator < 65536; authenticator++) {
        const state = { ...first, phase, keyEpoch, authenticator };
        const size = encodeV3Beacon(state);
        assert.ok(size > previous); // Framing's quotient is the inverse code.
        assert.deepEqual(decodeV3BeaconSize(size), {
          status: "decoded",
          state,
        });
        previous = size;
      }
    }
  // Every inherited field combination crosses the new radix boundaries.
  for (const phase of CONTROL_CODEBOOK.phases)
    for (const latestVerdict of CONTROL_CODEBOOK.verdicts)
      for (const effort of CONTROL_CODEBOOK.efforts)
        for (const provenance of CONTROL_CODEBOOK.provenances)
          for (const keyEpoch of [0, 255])
            for (const authenticator of [0, 65535]) {
              const state = {
                ...first,
                phase,
                latestVerdict,
                effort,
                provenance,
                keyEpoch,
                authenticator,
              };
              assert.deepEqual(decodeV3BeaconSize(encodeV3Beacon(state)), {
                status: "decoded",
                state,
              });
            }
  for (const boundary of [
    3n,
    65535n * 4n + 3n,
    65536n * 4n + 3n,
    256n * 65536n * 4n + 3n,
    MAX_V3_CODE,
  ]) {
    for (const offset of [-1n, 1n])
      assert.equal(
        decodeV3BeaconSize(framedSize(boundary) + offset).status,
        "malformed",
      );
  }
  for (const size of [
    0,
    -1,
    NaN,
    Infinity,
    1.5,
    Number.MAX_SAFE_INTEGER + 1,
    framedSize(MAX_V3_CODE + 4n),
  ])
    assert.equal(decodeV3BeaconSize(size).status, "malformed");
  for (const [key, value] of [
    ["keyEpoch", 256],
    ["keyEpoch", -1],
    ["authenticator", 65536],
    ["authenticator", 0.5],
  ] as const)
    assert.throws(() => encodeV3Beacon({ ...first, [key]: value }), /digit/);
  const domain = readFileSync(
    join(repository, "docs/product/02-domain-model.md"),
    "utf8",
  );
  const normative = domain
    .split("### Beacon codebook v3 — weak keyed provenance")[1]
    ?.match(/```json\n([\s\S]*?)\n```/u)?.[1];
  assert.ok(normative, "v3 normative data is present in the blueprint");
  assert.deepEqual(BEACON_V3_CODEBOOK, JSON.parse(normative));
  t.diagnostic(
    `v2 × epoch × authenticator = 288 × 256 × 65536 = ${product}; MAX_V3_CODE=${MAX_V3_CODE}; MAX_V3_LOGICAL_BYTES=${MAX_V3_LOGICAL_BYTES}; 589824 exhaustive representative residue round trips`,
  );
});

test("WO-022 AC9 maximum v3 is sparse through atomic replacement; unsupported hosts create no file", (t) => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-v3-storage-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const storage = probeV3Storage(root);
  const destination = join(root, "beacons");
  const bytes = {
    size: MAX_V3_LOGICAL_BYTES,
    mtimeMs: 1200001,
    content:
      JSON.stringify({
        ...record,
        codebookVersion: 3,
        phase: last.phase,
        latestVerdict: last.latestVerdict,
        effort: last.effort,
        provenance: last.provenance,
      }) + "\n",
  };
  for (const unsupported of [
    { ...storage, sparse: false },
    { ...storage, v3: false },
    { ...storage, maxLogicalBytes: MAX_V3_LOGICAL_BYTES - 1n },
    { ...storage, blockBytes: 8192n },
    { ...storage, device: storage.device + 1n },
  ])
    assert.throws(() =>
      writeV3BeaconFile(
        destination,
        "fixture.beacon",
        bytes,
        unsupported as V3Storage,
      ),
    );
  assert.deepEqual(readdirSync(root), []);
  for (const size of [
    BigInt(Number.MAX_SAFE_INTEGER) + 1n,
    MAX_V3_LOGICAL_BYTES + 1n,
  ])
    assert.throws(() =>
      writeV3BeaconFile(
        destination,
        "fixture.beacon",
        { ...bytes, size },
        storage,
      ),
    );
  assert.deepEqual(readdirSync(root), []);
  const original = Buffer.alloc;
  Buffer.alloc = ((
    size: number,
    ...args: Parameters<typeof Buffer.alloc> extends [number, ...infer Rest]
      ? Rest
      : never
  ) => {
    assert.ok(size <= 65536, "no dense large buffer may be constructed");
    return original(size, ...args);
  }) as typeof Buffer.alloc;
  try {
    writeV3BeaconFile(destination, "fixture.beacon", bytes, storage);
  } finally {
    Buffer.alloc = original;
  }
  const path = join(destination, "fixture.beacon");
  const before = lstatSync(path, { bigint: true });
  assert.equal(before.size, MAX_V3_LOGICAL_BYTES);
  assert.equal(before.mtimeNs, 1200001000000n);
  assert.ok(before.blocks <= MAX_V3_ALLOCATED_BLOCKS);
  const fd = openSync(path, "r");
  try {
    const prefix = Buffer.alloc(Buffer.byteLength(bytes.content));
    readSync(fd, prefix, 0, prefix.length, 0);
    assert.equal(prefix.toString(), bytes.content);
    for (const position of [
      8192n,
      MAX_V3_LOGICAL_BYTES / 2n,
      MAX_V3_LOGICAL_BYTES - 64n,
    ]) {
      const hole = Buffer.alloc(64, 1);
      assert.equal(readSync(fd, hole, 0, hole.length, Number(position)), 64);
      assert.ok(hole.every((value) => value === 0));
    }
  } finally {
    closeSync(fd);
  }
  writeV3BeaconFile(
    destination,
    "fixture.beacon",
    { ...bytes, mtimeMs: 1200002 },
    storage,
  );
  const after = lstatSync(path, { bigint: true });
  assert.notEqual(after.ino, before.ino);
  assert.equal(after.size, before.size);
  assert.equal(after.mtimeNs, 1200002000000n);
  assert.ok(after.blocks <= MAX_V3_ALLOCATED_BLOCKS);
  assert.deepEqual(readdirSync(destination), ["fixture.beacon"]);
  t.diagnostic(
    `maximum file: logical=${after.size}; blocks=${after.blocks}/${MAX_V3_ALLOCATED_BLOCKS}; blockBytes=${storage.blockBytes}; exact mtime and zero tail preserved through temp/rename; unsupported hosts: no files or directories`,
  );
});

test("WO-022 AC6/8/10 dynamic external keys, forged provenance, replay, unknown/rotated epochs and exhaustion", (t) => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-v3-host-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const keyPath = join(root, "host-key");
  assert.equal(createBeaconKey(keyPath, repository), 0);
  const key = openBeaconKey(keyPath, repository);
  assert.equal(key.epoch, 0);
  const address = controlBeaconAddress(record.workOrderId);
  const storage = probeV3Storage(root);
  const actual = emitV3Beacon(
    join(root, "live"),
    address,
    record,
    key,
    storage,
  );
  // Independent normative preimage: verifying/pass/max/host has v2 ordinal 106.
  const initialSecret = (
    JSON.parse(readFileSync(keyPath, "utf8")) as { key: string }
  ).key;
  const independent = createHmac("sha256", Buffer.from(initialSecret, "hex"))
    .update(["dotln-beacon-v3", address, "106", "0"].join("\0"))
    .digest()
    .readUInt16BE(0);
  assert.equal(actual.authenticator, independent);
  assert.equal(key.check(actual, address), "residue-matched");
  // A self-reporter can write any provenance bit and residue. Make a known bad
  // current-epoch residue; the labels describe the check, never an identity.
  const forged = {
    ...actual,
    authenticator: (actual.authenticator + 1) % 65536,
  };
  writeV3BeaconFile(
    join(root, "forged"),
    address,
    {
      size: encodeV3Beacon(forged),
      mtimeMs: Date.parse(record.recordedAt),
      content: JSON.stringify({ ...record, codebookVersion: 3 }) + "\n",
    },
    storage,
  );
  const decoded = decodeSignalSize(
    lstatSync(join(root, "forged", address), { bigint: true }).size,
  );
  assert.ok(
    decoded.status === "decoded" && decoded.state.codebookVersion === 3,
  );
  assert.equal(key.check(decoded.state, address), "forged-provenance");
  assert.equal(
    key.check({ ...actual, keyEpoch: 71 }, address),
    "unverifiable-provenance",
  );
  // Serialized canonical record replay, not a copied Beacon file.
  const replayRecord = JSON.parse(
    JSON.stringify(record),
  ) as ControlProjectionRecord;
  const rederived = emitV3Beacon(
    join(root, "replay"),
    address,
    replayRecord,
    openBeaconKey(keyPath, repository),
    storage,
  );
  assert.deepEqual(rederived, actual);
  for (const file of ["live", "replay"]) {
    const path = join(root, file, address);
    const metadata = lstatSync(path, { bigint: true });
    assert.equal(metadata.size, encodeV3Beacon(actual));
    assert.equal(
      metadata.mtimeNs,
      BigInt(Date.parse(record.recordedAt)) * 1000000n,
    );
    const fd = openSync(path, "r");
    try {
      const prefix = Buffer.alloc(4096);
      readSync(fd, prefix, 0, prefix.length, 0);
      assert.deepEqual(JSON.parse(prefix.toString().split("\n")[0]!), {
        ...record,
        codebookVersion: 3,
      });
      assert.ok(!prefix.includes(initialSecret));
    } finally {
      closeSync(fd);
    }
  }
  assert.equal(rotateBeaconKey(keyPath, repository), 1);
  const rotated = openBeaconKey(keyPath, repository);
  assert.equal(rotated.check(actual, address), "unverifiable-provenance");
  assert.equal(
    rotated.check({ ...actual, keyEpoch: 71 }, address),
    "unverifiable-provenance",
  );
  const current = rotated.sign({ ...actual, codebookVersion: 3 }, address);
  assert.equal(rotated.check(current, address), "residue-matched");
  for (let epoch = 2; epoch <= 255; epoch++)
    assert.equal(rotateBeaconKey(keyPath, repository), epoch);
  const keyBefore = readFileSync(keyPath);
  const beaconBefore = lstatSync(join(root, "live", address), { bigint: true });
  assert.throws(() => rotateBeaconKey(keyPath, repository), /epoch exhausted/);
  assert.ok(
    readFileSync(keyPath).equals(keyBefore),
    "exhaustion preserves the current secret file",
  );
  assert.equal(openBeaconKey(keyPath, repository).epoch, 255);
  assert.equal(
    lstatSync(join(root, "live", address), { bigint: true }).size,
    beaconBefore.size,
  );
  assert.deepEqual(readdirSync(root).sort(), [
    "forged",
    "host-key",
    "live",
    "replay",
  ]);
  const privateKey = (JSON.parse(keyBefore.toString()) as { key: string }).key;
  assert.ok(
    !JSON.stringify({ actual, rederived, record }).includes(privateKey),
    "no secret in state, replay or projection",
  );
  assert.throws(
    () => createBeaconKey(join(repository, "forbidden-key"), repository),
    /outside/,
  );
  assert.ok(!existsSync(join(repository, "forbidden-key")));
  chmodSync(keyPath, 0o644);
  assert.throws(
    () => openBeaconKey(keyPath, repository),
    /unavailable or invalid/,
  );
  chmodSync(keyPath, 0o600);
  t.diagnostic(
    "current bad residue: forged-provenance; same key/epoch replay: residue-matched; rotated and never-observed epochs: unverifiable-provenance; 255 rotations then exhaustion without key/beacon changes; no retained old-key file",
  );
});
