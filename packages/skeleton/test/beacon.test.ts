import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { decodeLog, type Event } from "@dotln/kernel";
import {
  consequentialActionClasses,
  projectAuditEvents,
  projectL0Receipt,
  deriveAuditRecords,
} from "../src/audit.js";
import {
  BEACON_CODEBOOK,
  decodeBeaconSize,
  deriveBeaconProjections,
  encodeBeacon,
  encodeBeaconState,
  type BeaconClaimRecord,
  type BeaconState,
} from "../src/beacon.js";
import {
  runScenario,
  replayScenario,
  type FixtureTree,
} from "../src/scenario.js";

const fixture = JSON.parse(
  readFileSync(
    new URL("../../fixtures/repo-tree.json", import.meta.url),
    "utf8",
  ),
) as FixtureTree;
const claim: BeaconClaimRecord = {
  recordType: "beacon-claim",
  codebookVersion: 1,
  provenance: "self-reported",
  scope: { workstreamId: "test", episodeId: "episode" },
  actor: "executor",
  claimedAt: 1200001,
  actionClass: "verification",
  outcome: "passed",
  refusalCount: 0,
};

test("WO-020 normative codebook data matches the blueprint and all seven audit classes", () => {
  const domain = readFileSync(
    new URL("../../../../docs/product/02-domain-model.md", import.meta.url),
    "utf8",
  );
  const block = domain
    .split("### Beacon codebook v1")[1]!
    .match(/```json\n([\s\S]*?)\n```/)!;
  assert.deepEqual(BEACON_CODEBOOK, JSON.parse(block[1]!));
  assert.deepEqual(
    BEACON_CODEBOOK.classes.map(([name]) => name).sort(),
    consequentialActionClasses.map(({ actionClass }) => actionClass).sort(),
  );
});

test("WO-020 AC1 exhausts all 104 v1 states and every integer through twice the maximum", (t) => {
  const assigned = new Map<number, BeaconState>();
  for (const [actionClass, outcomes] of BEACON_CODEBOOK.classes) {
    for (const outcome of outcomes)
      for (let refusalCount = 0; refusalCount < 4; refusalCount++) {
        for (const provenance of ["host-projected", "self-reported"] as const) {
          const state: BeaconState = {
            codebookVersion: 1,
            actionClass,
            outcome,
            refusalCount,
            provenance,
          };
          const size = encodeBeaconState(state);
          assert.ok(!assigned.has(size), "codewords are unique");
          assigned.set(size, state);
          assert.deepEqual(decodeBeaconSize(size), {
            status: "decoded",
            state,
          });
          assert.deepEqual(decodeBeaconSize(BigInt(size)), {
            status: "decoded",
            state,
          });
        }
      }
  }
  assert.equal(assigned.size, 104);
  const largest = Math.max(...assigned.keys());
  assert.equal(largest, 51064);
  // Independent framing oracle includes reserved future frames, which carry no v1 meaning.
  const future = new Map<number, number>();
  for (let code = 0; 8192 + code * 64 <= 2 * largest; code++) {
    if (code % 4 >= 2)
      future.set(8192 + code * 64 + ((code * 17 + 11) % 64), code % 4);
  }
  let malformed = 0;
  let unknown = 0;
  for (let size = 0; size <= 2 * largest; size++) {
    const expected = assigned.get(size);
    const version = future.get(size);
    if (expected !== undefined)
      assert.deepEqual(decodeBeaconSize(size), {
        status: "decoded",
        state: expected,
      });
    else if (version !== undefined) {
      assert.deepEqual(decodeBeaconSize(size), {
        status: "unknown-codebook",
        codebookVersion: version,
      });
      unknown++;
    } else {
      assert.deepEqual(
        decodeBeaconSize(size),
        { status: "malformed" },
        `size ${size}`,
      );
      malformed++;
    }
  }
  t.diagnostic(
    `104 v1 states; maximum=${largest}; integers=0..${2 * largest}; malformed=${malformed}; future frames=${unknown}`,
  );
});

test("WO-020 decoder refuses bad values and never guesses an extended future payload", () => {
  for (const value of [
    -1,
    0.5,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
    -1n,
  ])
    assert.deepEqual(decodeBeaconSize(value), { status: "malformed" });
  const futureCode = 10n ** 30n + 2n;
  assert.deepEqual(
    decodeBeaconSize(
      8192n + futureCode * 64n + ((futureCode * 17n + 11n) % 64n),
    ),
    { status: "unknown-codebook", codebookVersion: 2 },
  );
  for (const update of [
    { codebookVersion: 2 },
    { refusalCount: -1 },
    { refusalCount: 4 },
    { refusalCount: 1.5 },
    { outcome: "emitted" },
    { provenance: "unlabeled" },
  ])
    assert.throws(
      () => encodeBeaconState({ ...claim, ...update } as BeaconState),
      /invalid beacon/,
    );
});

test("WO-020 AC2 live and replay encode identical records without mutating audit or events", () => {
  const live = runScenario(fixture);
  const events = decodeLog(live.log);
  const before = JSON.stringify({ events, audit: projectAuditEvents(events) });
  const host = deriveBeaconProjections(events);
  const replayed = deriveBeaconProjections(
    decodeLog(replayScenario(live.log).log),
  );
  assert.deepEqual(host, replayed);
  assert.deepEqual(host.map(encodeBeacon), replayed.map(encodeBeacon));
  assert.equal(
    JSON.stringify({ events, audit: projectAuditEvents(events) }),
    before,
  );
  assert.equal(host.length, 1);
  assert.equal(host[0]!.refusalCount, 1);
  const receipts = projectL0Receipt(deriveAuditRecords(events)).receipts;
  assert.deepEqual(host[0]!.receipt, receipts.at(-1));
  assert.equal(host[0]!.receipt.action, "schedule.cancel");
  assert.equal(host[0]!.receipt.time, events.at(-1)!.occurredAt);
  assert.deepEqual(JSON.parse(encodeBeacon(host[0]!).content), host[0]);
});

const denied = (
  ordinal: number,
  workstreamId: string,
  episodeId?: string,
): Event => ({
  schemaVersion: 1,
  eventId: `refusal-${ordinal}`,
  type: "CommandRefused",
  occurredAt: 100 - ordinal,
  actorId: "test-actor",
  workstreamId,
  ...(episodeId === undefined ? {} : { episodeId }),
  payload: { reason: "no grant", authorityEnvelopeId: "test-authority" },
});

test("WO-020 fold separates episode scopes, caps cumulative refusals, and obeys append order", () => {
  const events = [
    denied(1, "a|b", "c"),
    denied(2, "a", "b|c"),
    denied(3, "a|b", "c"),
    denied(4, "a|b", "c"),
    denied(5, "a|b", "c"),
    denied(6, "a|b"),
  ];
  const projected = deriveBeaconProjections(events);
  assert.equal(projected.length, 2);
  assert.equal(projected[0]!.refusalCount, 3);
  assert.equal(
    projected[0]!.receipt.time,
    95,
    "latest append wins despite clock regression",
  );
  assert.equal(projected[1]!.refusalCount, 1);
  assert.deepEqual(deriveBeaconProjections([]), []);
  assert.deepEqual(
    deriveBeaconProjections(decodeLog(runScenario(fixture).log).slice(0, 1)),
    [],
  );
});

test("WO-020 host retains the matching L0 links when unaudited events widen projection scope", () => {
  const events = [
    denied(1, "test", "first"),
    {
      ...denied(2, "test", "second"),
      type: "UnauditedObservation",
      payload: {},
    },
  ];
  assert.deepEqual(
    deriveBeaconProjections(events)[0]!.receipt,
    projectAuditEvents(events).receipt.receipts[0],
  );
  assert.equal(
    deriveBeaconProjections(events).length,
    1,
    "no receipt is invented for the second episode",
  );
});

test("WO-020 record encoding preserves UTF-8, labels claims, pads with only newlines and rejects overflow", () => {
  const input = { ...claim, actor: "émetteur 🌱" };
  const encoded = encodeBeacon(input);
  const json = JSON.stringify(input);
  assert.equal(Buffer.byteLength(encoded.content), encoded.size);
  assert.deepEqual(JSON.parse(encoded.content), input);
  assert.match(encoded.content.slice(json.length), /^\n+$/);
  assert.equal(encoded.mtimeMs, input.claimedAt);
  assert.throws(
    () => encodeBeacon({ ...claim, actor: "x".repeat(65536) }),
    /exceeds/,
  );
  for (const claimedAt of [NaN, Infinity, -1, 0.5, 8.64e15 + 1])
    assert.throws(() => encodeBeacon({ ...claim, claimedAt }), /mtime/);
  assert.throws(
    () =>
      encodeBeacon({
        ...claim,
        scope: { workstreamId: "test", episodeId: "" },
      }),
    /requires/,
  );
  assert.throws(
    () =>
      encodeBeacon({
        ...claim,
        provenance: "host-projected",
      } as unknown as BeaconClaimRecord),
    /disagree/,
  );
});
