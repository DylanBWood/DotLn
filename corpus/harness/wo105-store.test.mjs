import test from "node:test";
import assert from "node:assert/strict";
import {
  appendEvent,
  decodeLog,
  encodeLog,
  replayOutbox,
  pendingCommands,
} from "../../packages/kernel/dist/src/index.js";
import {
  collectOffsets,
  exactFiles,
  fingerprint,
  MANIFEST,
  read,
  readJson,
  SEED,
  sha256,
} from "./wo105-common.mjs";
import {
  buildStoreFiles,
  DEPTH,
  draft,
  generatedLog,
  replayDeterminism,
  SIZES,
  storeFixtures,
} from "./generate-store-corpus.mjs";
import { classifyCut, cutOracle, storeSweep } from "./truncation-sweep.mjs";

test("WO-105 store generator regenerates exact bytes; seed, sizes and duplicate results are material", () => {
  exactFiles(buildStoreFiles(), "check");
  for (const fixture of readJson("corpus/fixtures/store/index.json").fixtures) {
    const log =
      fixture.storage === "json-log-string"
        ? readJson(fixture.path).log
        : read(fixture.path);
    assert.equal(log, storeFixtures().find(({ id }) => id === fixture.id).log);
    assert.equal(Buffer.byteLength(log), fixture.bytes);
    assert.equal(sha256(log), fixture.sha256);
  }
  assert.deepEqual(buildStoreFiles(), buildStoreFiles(SEED));
  assert.notDeepEqual(buildStoreFiles("alternate"), buildStoreFiles());
  assert.deepEqual(
    storeFixtures()
      .filter((fixture) => fixture.kind === "generated")
      .map(({ log }) => decodeLog(log).length),
    SIZES,
  );
  const log = generatedLog(SEED, 8);
  assert.ok(log.includes("escaped\\nline\\r\\n"));
  assert.ok(Buffer.byteLength(log) > log.length, "actual multibyte coverage");
  const events = decodeLog(log);
  assert.deepEqual(
    events[2].payload,
    events[3].payload,
    "semantic result duplicate",
  );
  assert.notEqual(events[2].eventId, events[3].eventId);
  const outbox = replayOutbox(events, { includeTraces: true });
  assert.ok(outbox.traces.some((trace) => trace.branchPath.includes("dedup")));
  assert.equal(pendingCommands(outbox.state).length, 1);
});

test("WO-105 round-trip laws, LF and CRLF append numbering, and 512 monotonic appends", () => {
  for (const { id, log } of storeFixtures().filter(
    ({ id }) => id !== "deep-nesting",
  )) {
    const events = decodeLog(log);
    assert.deepEqual(decodeLog(encodeLog(events)), events, id);
    const next = appendEvent(log, draft({ text: "one\ntwo" }));
    assert.equal(next.event.eventId, `evt_${events.length + 1}`, id);
    assert.deepEqual(decodeLog(next.log), [...events, next.event]);
    replayDeterminism(log);
  }
  let log = "";
  for (let i = 1; i <= 512; i++) {
    const next = appendEvent(log, draft({ n: i, text: "a\nb" }));
    assert.equal(next.event.eventId, `evt_${i}`);
    log = next.log;
  }
  assert.equal(decodeLog(log).length, 512);
  assert.equal(encodeLog(decodeLog(log)), log);
});

test("WO-105 retained CRLF and depth-12000 classifications and replay determinism", () => {
  const fixtures = storeFixtures();
  const crlf = fixtures.find(({ id }) => id === "crlf").log;
  assert.deepEqual(decodeLog(crlf), decodeLog(generatedLog(SEED, 8)));
  assert.equal(encodeLog(decodeLog(crlf)), generatedLog(SEED, 8));
  const deep = fixtures.find(({ id }) => id === "deep-nesting").log;
  let payload = decodeLog(deep)[0].payload;
  let depth = 0;
  while (Array.isArray(payload)) {
    assert.equal(payload.length, 1);
    payload = payload[0];
    depth++;
  }
  assert.equal(depth, DEPTH);
  assert.equal(payload, 0);
  for (const log of [crlf, deep]) replayDeterminism(log);
  // Iterative digest must distinguish nested values; a constant digest cannot
  // accidentally pass the deep-prefix check.
  assert.notEqual(fingerprint([[0]]), fingerprint([[1]]));
  assert.notEqual(fingerprint([[0]]), fingerprint([0]));
});

test("WO-105 classifier self-tests pin empty/full/LF/mid-line and planted silent divergence", () => {
  const log = encodeLog([
    { ...draft({ text: "é🐛\n" }), eventId: "evt_1" },
    { ...draft(), eventId: "evt_2" },
  ]);
  const oracle = cutOracle(log);
  const boundaries = [...oracle.boundaries.keys()];
  assert.equal(boundaries.length, 3);
  for (const offset of boundaries)
    assert.equal(classifyCut(oracle, offset).outcome, "clean-prefix");
  for (const offset of [
    1,
    Buffer.from(log).indexOf(Buffer.from("🐛")) + 1,
    boundaries[1] - 1,
  ])
    assert.equal(classifyCut(oracle, offset).outcome, "loud-failure");
  assert.equal(classifyCut(oracle, 1, () => []).outcome, "silent-divergence");
  assert.equal(
    classifyCut(oracle, boundaries[1], () => []).outcome,
    "silent-divergence",
  );
  assert.equal(
    classifyCut(oracle, 0, () => {
      throw new Error("planted");
    }).outcome,
    "boundary-failure",
  );
  assert.throws(
    () =>
      collectOffsets({ id: "planted", bytes: 1 }, [
        { offset: 0, outcome: "a" },
      ]),
    /incomplete byte sweep/,
  );
  assert.throws(
    () =>
      collectOffsets({ id: "planted", bytes: 1 }, [
        { offset: 1, outcome: "a" },
      ]),
    /missing or repeated/,
  );
});

test("WO-105 every declared store cut pins its prefix, counts, raw digest and compact ranges", () => {
  const result = storeSweep();
  assert.deepEqual(result, readJson(MANIFEST).store);
  assert.equal(result.cutPoints, 72345);
  for (const sweep of result.sweeps) {
    const rows = [];
    for (const { offset, through, ...classification } of sweep.ranges)
      for (let index = offset; index <= through; index++)
        rows.push({
          lane: sweep.lane,
          fixture: sweep.id,
          seed: sweep.seed,
          offset: index,
          ...classification,
        });
    assert.equal(rows.length, sweep.cutPoints);
    rows.forEach((row, index) => assert.equal(row.offset, index));
    assert.equal(
      sha256(rows.map((row) => `${JSON.stringify(row)}\n`).join("")),
      sweep.recordsSha256,
    );
  }
});
