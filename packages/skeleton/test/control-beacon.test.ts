import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  realpathSync,
  rmSync,
  lstatSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  decodeLog,
  encodeLog,
  type Event,
  type JsonValue,
} from "@dotln/kernel";
import {
  BEACON_CODEBOOK,
  decodeBeaconSize,
  encodeBeaconState,
} from "../src/beacon.js";
import { framedSize } from "../src/beacon-codebook.mjs";
import {
  CONTROL_CODEBOOK,
  GROUP_CODEBOOK,
  MAX_V2_CODE,
  MAX_V2_LOGICAL_BYTES,
  MAX_GROUP_CODE,
  MAX_GROUP_LOGICAL_BYTES,
  MAX_MEMBERS,
  RADIX,
  BEACON_STALE_AFTER_MS,
  beaconAge,
  decodeSignalSize,
  decodeGroupBeaconSize,
  encodeControlBeacon,
  encodeGroupBeacon,
  groupCounts,
} from "../src/control-codebook.mjs";
import {
  exactHostSize,
  probeBeaconStorage,
  writeBeaconFile,
} from "../src/beacon-io.mjs";
import {
  controlBeaconAddress,
  controlBeaconDirectory,
  emitGroupBeacon,
  groupBeaconAddress,
  sweepControlBeacons,
} from "../src/control-beacon-fs.mjs";
import {
  observeBeaconSweep,
  replayBeaconSweep,
} from "../src/beacon-observe.js";
import { initialState, seiriReactor, seiriPredicates } from "../src/reactor.js";
import {
  renderGlyphScene,
  replayScenario,
  runScenario,
  type FixtureTree,
} from "../src/scenario.js";
import type {
  BeaconSweepRequest,
  ControlBeaconState,
  SignalObservation,
} from "../src/control-beacon.js";

const state: ControlBeaconState = {
  codebookVersion: 2,
  phase: "active",
  latestVerdict: "unknown",
  effort: "unknown",
  provenance: "host-projected",
};
const observation = (mtimeMs: number): SignalObservation => ({
  address: "fixture",
  size: String(encodeControlBeacon(state)),
  mtimeMs,
  decoded: { status: "decoded", state },
});
const now = BEACON_STALE_AFTER_MS + 10;
const request: BeaconSweepRequest = {
  intent: { kind: "Observe", subject: "control-beacons" },
  audience: "public",
  authority: {
    authorityEnvelopeId: "fixture-beacon-grant",
    allowedEffects: ["observe.beacons.public"],
    deniedEffects: [],
    resourceLimits: { beaconSweeps: 1 },
    requiredEvidence: [],
    expiresAt: now + 1,
    revocationEventTypes: [],
  },
  evidence: [],
  revokedBy: [],
  staleAfterMs: BEACON_STALE_AFTER_MS,
};

test("WO-021 normative v2 and phase-group data match the blueprint", () => {
  const domain = readFileSync(
    new URL("../../../../docs/product/02-domain-model.md", import.meta.url),
    "utf8",
  );
  for (const [heading, codebook] of [
    ["### Beacon codebook v2 — control state", CONTROL_CODEBOOK],
    ["### Beacon group codebook v1 — phase counts", GROUP_CODEBOOK],
  ] as const) {
    const block = domain.split(heading)[1]!.match(/```json\n([\s\S]*?)\n```/)!;
    assert.deepEqual(codebook, JSON.parse(block[1]!));
  }
});

test("WO-021 v2 exhaustively round-trips every field, retains v1, and pins numeric bounds", (t) => {
  const sizes = new Set<bigint>();
  for (const phase of CONTROL_CODEBOOK.phases)
    for (const latestVerdict of CONTROL_CODEBOOK.verdicts)
      for (const effort of CONTROL_CODEBOOK.efforts)
        for (const provenance of CONTROL_CODEBOOK.provenances) {
          const value = {
            codebookVersion: 2 as const,
            phase,
            latestVerdict,
            effort,
            provenance,
          };
          const size = encodeControlBeacon(value);
          assert.deepEqual(decodeSignalSize(size), {
            status: "decoded",
            state: value,
          });
          assert.deepEqual(decodeBeaconSize(size), {
            status: "unknown-codebook",
            codebookVersion: 2,
          });
          assert.ok(!sizes.has(size));
          sizes.add(size);
        }
  assert.equal(sizes.size, 288);
  assert.equal(
    [...sizes].reduce((a, b) => (a > b ? a : b)),
    MAX_V2_LOGICAL_BYTES,
  );
  assert.equal(MAX_V2_CODE, 8n * 3n * 6n * 2n * 4n - 2n);
  assert.equal(framedSize(MAX_V2_CODE), MAX_V2_LOGICAL_BYTES);
  assert.equal(CONTROL_CODEBOOK.phaseRadix, CONTROL_CODEBOOK.phases.length);
  assert.equal(CONTROL_CODEBOOK.verdictRadix, CONTROL_CODEBOOK.verdicts.length);
  assert.equal(CONTROL_CODEBOOK.effortRadix, CONTROL_CODEBOOK.efforts.length);
  assert.equal(
    CONTROL_CODEBOOK.provenanceRadix,
    CONTROL_CODEBOOK.provenances.length,
  );
  for (const [actionClass, outcomes] of BEACON_CODEBOOK.classes)
    for (const outcome of outcomes)
      for (const provenance of BEACON_CODEBOOK.provenances)
        for (let refusalCount = 0; refusalCount < 4; refusalCount++) {
          const value = {
            codebookVersion: 1 as const,
            actionClass,
            outcome,
            provenance,
            refusalCount,
          };
          assert.deepEqual(decodeSignalSize(encodeBeaconState(value)), {
            status: "decoded",
            state: value,
          });
        }
  for (const size of [
    NaN,
    Infinity,
    -1,
    1.1,
    Number.MAX_SAFE_INTEGER + 1,
    MAX_V2_LOGICAL_BYTES + 1n,
    framedSize(MAX_V2_CODE + 4n),
  ])
    assert.equal(decodeSignalSize(size).status, "malformed");
  for (const [key, value] of [
    ["phase", "other"],
    ["effort", "ultracode"],
    ["latestVerdict", "other"],
    ["provenance", "other"],
    ["codebookVersion", 1],
  ])
    assert.throws(
      () =>
        encodeControlBeacon({
          ...state,
          [key as string]: value,
        } as ControlBeaconState),
      /invalid beacon/,
    );
  t.diagnostic(
    `v2: ${sizes.size} states; MAX_V2_CODE=${MAX_V2_CODE}; dense bytes=${MAX_V2_LOGICAL_BYTES}; all 104 v1 states retain meaning`,
  );
});

test("WO-021 group exhaustively proves the bounded additive lattice", (t) => {
  const sizes = new Set<bigint>();
  const counts = CONTROL_CODEBOOK.phases.map(() => 0);
  const visit = (index: number, remaining: number): void => {
    if (index === counts.length) {
      const size = encodeGroupBeacon(counts);
      assert.ok(!sizes.has(size), `collision at ${counts}`);
      sizes.add(size);
      assert.deepEqual(decodeGroupBeaconSize(size), {
        status: "decoded",
        state: { groupCodebookVersion: 1, counts: [...counts] },
      });
      assert.deepEqual(decodeSignalSize(size), {
        status: "unknown-codebook",
        codebookVersion: 3,
      });
      return;
    }
    for (let count = 0; count <= remaining; count++) {
      counts[index] = count;
      visit(index + 1, remaining - count);
    }
  };
  visit(0, MAX_MEMBERS);
  assert.equal(sizes.size, 125970);
  assert.equal(RADIX, BigInt(MAX_MEMBERS + 1));
  assert.equal(GROUP_CODEBOOK.version, 1);
  assert.equal(MAX_GROUP_CODE, BigInt(MAX_MEMBERS) * RADIX ** 7n * 4n + 3n);
  assert.equal(framedSize(MAX_GROUP_CODE), MAX_GROUP_LOGICAL_BYTES);
  assert.equal(
    [...sizes].reduce((a, b) => (a > b ? a : b)),
    MAX_GROUP_LOGICAL_BYTES,
  );
  for (const values of [
    [13, 0, 0, 0, 0, 0, 0, 0],
    [6, 7, 0, 0, 0, 0, 0, 0],
    [-1, 0, 0, 0, 0, 0, 0, 0],
    [0.5, 0, 0, 0, 0, 0, 0, 0],
    [],
  ])
    assert.throws(() => encodeGroupBeacon(values), /bound/);
  assert.equal(
    decodeGroupBeaconSize(framedSize((6n + 7n * RADIX) * 4n + 3n)).status,
    "malformed",
  );
  assert.equal(
    decodeGroupBeaconSize(framedSize(MAX_GROUP_CODE + 4n)).status,
    "malformed",
  );
  const members = Array.from({ length: 12 }, (_, i): SignalObservation => {
    const value = {
      ...state,
      phase: CONTROL_CODEBOOK.phases[i % 8]!,
      effort: CONTROL_CODEBOOK.efforts[i % 6]!,
      latestVerdict: CONTROL_CODEBOOK.verdicts[i % 3]!,
    };
    return {
      address: `member-${i}`,
      mtimeMs: 0,
      size: String(encodeControlBeacon(value)),
      decoded: { status: "decoded", state: value },
    };
  });
  assert.deepEqual(groupCounts(members), [2, 2, 2, 2, 1, 1, 1, 1]);
  assert.deepEqual(
    groupCounts([
      ...members,
      {
        ...observation(0),
        decoded: {
          status: "decoded",
          state: { ...state, provenance: "self-reported" },
        },
      },
    ]),
    groupCounts(members),
  );
  assert.throws(() => groupCounts([...members, observation(0)]), /bound/);
  t.diagnostic(
    `group: ${sizes.size} vectors, no collisions; 12 members across all 8 phases; logical maximum=${MAX_GROUP_LOGICAL_BYTES}`,
  );
});

test("WO-021 maximum dense/sparse files obey allocation bounds; unsupported sizes create nothing", (t) => {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-control-beacon-")),
  );
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const storage = probeBeaconStorage(root);
  const rejected = join(root, "never-created");
  for (const size of [
    Number.MAX_SAFE_INTEGER + 1,
    BigInt(Number.MAX_SAFE_INTEGER) + 1n,
    storage.maxLogicalBytes + 1n,
  ])
    assert.throws(
      () =>
        writeBeaconFile(
          rejected,
          "value.beacon",
          { size, mtimeMs: now, content: "" },
          storage,
        ),
      /representable|ceiling/,
    );
  assert.deepEqual(readdirSync(root), []);
  assert.throws(
    () => exactHostSize(81833n, { ...storage, maxLogicalBytes: 81832n }),
    /ceiling/,
  );
  const dense = join(root, "dense");
  writeBeaconFile(
    dense,
    "value.beacon",
    { size: MAX_V2_LOGICAL_BYTES, mtimeMs: now, content: '{"fixture":true}' },
    { ...storage, sparse: false },
  );
  const denseStat = lstatSync(join(dense, "value.beacon"), { bigint: true });
  assert.equal(denseStat.size, MAX_V2_LOGICAL_BYTES);
  assert.ok(
    denseStat.blocks * 512n <=
      ((MAX_V2_LOGICAL_BYTES + storage.blockBytes - 1n) / storage.blockBytes) *
        storage.blockBytes,
  );
  assert.equal(denseStat.mtimeNs, BigInt(now) * 1000000n);
  assert.deepEqual(
    JSON.parse(readFileSync(join(dense, "value.beacon"), "utf8")),
    { fixture: true },
  );
  // Even the dense fallback supports a small group without inventing sparse truth.
  writeBeaconFile(
    join(root, "dense-group"),
    "value.beacon",
    {
      size: encodeGroupBeacon([12, 0, 0, 0, 0, 0, 0, 0]),
      mtimeMs: now,
      content: "",
    },
    { ...storage, sparse: false },
  );
  if (storage.sparse) {
    writeBeaconFile(
      join(root, "group"),
      "value.beacon",
      { size: MAX_GROUP_LOGICAL_BYTES, mtimeMs: now, content: "" },
      storage,
    );
    const groupStat = lstatSync(join(root, "group/value.beacon"), {
      bigint: true,
    });
    assert.equal(groupStat.size, MAX_GROUP_LOGICAL_BYTES);
    assert.ok(groupStat.blocks * 512n <= storage.blockBytes);
    assert.deepEqual(decodeGroupBeaconSize(groupStat.size), {
      status: "decoded",
      state: { groupCodebookVersion: 1, counts: [0, 0, 0, 0, 0, 0, 0, 12] },
    });
    t.diagnostic(
      `stat: v2 size=${denseStat.size} blocks=${denseStat.blocks}; group size=${groupStat.size} blocks=${groupStat.blocks}; filesystem block=${storage.blockBytes}`,
    );
  }
  for (let index = 0; index < 12; index++) {
    const value = { ...state, phase: CONTROL_CODEBOOK.phases[index % 8]! };
    writeBeaconFile(
      controlBeaconDirectory(root),
      controlBeaconAddress(`fixture-${index}`),
      {
        size: encodeControlBeacon(value),
        mtimeMs: now,
        content: JSON.stringify(value),
      },
      { ...storage, sparse: false },
    );
  }
  const trees = [{ worktree: root }];
  const members = sweepControlBeacons(trees);
  assert.equal(members.length, 12);
  assert.deepEqual(groupCounts(members), [2, 2, 2, 2, 1, 1, 1, 1]);
  if (storage.sparse) {
    emitGroupBeacon(root, trees, now, storage);
    const stat = lstatSync(
      join(root, ".control-beacons/groups", groupBeaconAddress(trees)),
      { bigint: true },
    );
    assert.deepEqual(decodeGroupBeaconSize(stat.size), {
      status: "decoded",
      state: { groupCodebookVersion: 1, counts: groupCounts(members) },
    });
    assert.ok(stat.blocks * 512n <= storage.blockBytes);
    t.diagnostic(
      `12 actual member files -> group counts=2,2,2,2,1,1,1,1; group blocks=${stat.blocks}`,
    );
  }
});

test("WO-021 age retains sub-millisecond metadata at skew and cadence boundaries", () => {
  const future = {
    ...observation(now),
    mtimeNs: String(BigInt(now) * 1000000n + 1n),
  };
  const justFresh = { ...observation(10), mtimeNs: "10000001" };
  assert.equal(beaconAge(future, now), "clock-skew");
  assert.equal(beaconAge(justFresh, now), "fresh");
  assert.equal(
    beaconAge({ ...observation(10), mtimeNs: "10000000" }, now),
    "stale",
  );
  assert.equal(
    beaconAge({ ...observation(10), mtimeNs: "invalid" }, now),
    "malformed",
  );
  assert.equal(
    beaconAge({ ...observation(now), decoded: { status: "malformed" } }, now),
    "malformed",
  );
  assert.equal(
    beaconAge(
      { ...observation(now), decoded: { status: "unknown-codebook" } },
      now,
    ),
    "unknown-codebook",
  );
  const result = observeBeaconSweep(
    "",
    request,
    [],
    now,
    () => {},
    () => [future, justFresh],
  );
  assert.deepEqual(
    result.state.beaconObservations.map(({ age }) => age),
    ["clock-skew", "fresh"],
  );
  assert.deepEqual(replayBeaconSweep(result.log).decisions, result.decisions);
});

test("WO-021 authorization precedes every beacon stat; refusals and one authorized perception replay", (t) => {
  let reads = 0;
  let durable = "";
  const observations = [
    observation(11),
    observation(10),
    observation(9),
    observation(now + 1),
    {
      address: "missing",
      size: null,
      mtimeMs: null,
      decoded: { status: "absent" as const },
    },
  ];
  const read = () => {
    assert.equal(decodeLog(durable).at(-1)?.type, "CommandPersisted");
    reads++;
    return observations;
  };
  for (const authority of [
    { ...request.authority, allowedEffects: [] },
    { ...request.authority, deniedEffects: ["observe.*"] },
    { ...request.authority, expiresAt: now },
    { ...request.authority, resourceLimits: { beaconSweeps: 0 } },
    { ...request.authority, requiredEvidence: ["absent-grant-proof"] },
  ]) {
    const refused = observeBeaconSweep(
      "",
      { ...request, authority },
      [],
      now,
      (log) => {
        durable = log;
      },
      read,
    );
    assert.equal(refused.authorized, false);
    assert.equal(reads, 0);
    assert.equal(
      decodeLog(refused.log).filter(({ type }) => type === "CommandRefused")
        .length,
      1,
    );
    assert.ok(
      !decodeLog(refused.log).some(({ type }) => type === "BeaconObserved"),
    );
    assert.deepEqual(
      replayBeaconSweep(refused.log).decisions,
      refused.decisions,
    );
  }
  const result = observeBeaconSweep(
    "",
    request,
    [],
    now,
    (log) => {
      durable = log;
    },
    read,
  );
  assert.equal(reads, 1);
  assert.equal(result.authorized, true);
  assert.equal(
    decodeLog(result.log).filter(({ type }) => type === "BeaconObserved")
      .length,
    1,
  );
  assert.deepEqual(
    result.state.beaconObservations.map(({ age }) => age),
    ["fresh", "stale", "stale", "clock-skew", "absent"],
  );
  const replayed = replayBeaconSweep(result.log);
  assert.deepEqual(result.decisions, replayed.decisions);
  assert.deepEqual(result.state, replayed.state);
  assert.match(
    renderGlyphScene(result.state),
    /blurred\/stale.*flagged\/clock-skew.*○ absent/u,
  );
  assert.deepEqual(
    result.state.beaconObservations.map(({ age }) => age),
    observations.map((item) => beaconAge(item, now)),
  );
  const changed = encodeLog(
    decodeLog(result.log).map((event) =>
      event.type === "BeaconObserved"
        ? {
            ...event,
            payload: {
              ...(event.payload as object),
              observations: [observation(now)],
            } as JsonValue,
          }
        : event,
    ),
  );
  assert.notDeepEqual(
    replayBeaconSweep(changed).state.beaconObservations,
    result.state.beaconObservations,
  );
  t.diagnostic(
    "refused: 0 metadata reads, 1 CommandRefused, 0 BeaconObserved; authorized: 1 sweep, 1 BeaconObserved; complete decisions and glyph replay identical",
  );
});

test("WO-021 observation state cannot change the same authority decision; reactor uses no ambient clock", () => {
  const event: Event = {
    schemaVersion: 1,
    eventId: "evt_request",
    type: "BeaconSweepRequested",
    occurredAt: now,
    actorId: "fixture",
    workstreamId: "ws_beacon_control",
    payload: { ...request, decisionIndex: 0 } as unknown as JsonValue,
  };
  const env = { now, rngState: 17, predicates: seiriPredicates };
  const prior = initialState();
  const baseline = seiriReactor(prior, event, env);
  const original = Date.now;
  Date.now = () => {
    throw new Error("ambient time");
  };
  try {
    for (const age of [
      "fresh",
      "stale",
      "absent",
      "clock-skew",
      "malformed",
      "unknown-codebook",
    ] as const) {
      const result = seiriReactor(
        { ...prior, beaconObservations: [{ ...observation(0), age }] },
        event,
        env,
      );
      assert.deepEqual(result.trace, baseline.trace);
      assert.deepEqual(result.state.beaconSweep, baseline.state.beaconSweep);
    }
  } finally {
    Date.now = original;
  }
});

test("WO-016 identity extends to live sweep events appended to the walking skeleton", () => {
  const fixture = JSON.parse(
    readFileSync(
      new URL("../../fixtures/repo-tree.json", import.meta.url),
      "utf8",
    ),
  ) as FixtureTree;
  const scenario = runScenario(fixture);
  const live = observeBeaconSweep(
    scenario.log,
    request,
    [],
    now,
    () => {},
    () => [observation(0)],
  );
  const replayed = replayScenario(live.log);
  assert.deepEqual(live.decisions, replayed.decisions);
  assert.equal(renderGlyphScene(live.state), replayed.glyphScene);
  assert.match(replayed.glyphScene, /blurred\/stale/);
});
