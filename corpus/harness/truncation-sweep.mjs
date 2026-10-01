import assert from "node:assert/strict";
import { decodeLog } from "../../packages/kernel/dist/src/index.js";
import { runScenario } from "../../packages/skeleton/dist/src/scenario.js";
import {
  args,
  brief,
  collectOffsets,
  compareLane,
  demoTree,
  fingerprint,
  isMain,
  SEED,
  sha256,
} from "./wo105-common.mjs";
import { replayDeterminism, storeFixtures } from "./generate-store-corpus.mjs";

export function cutOracle(log) {
  const bytes = Buffer.from(log);
  // Independent framing and JSON parsing: never ask decodeLog what its own
  // expected prefix was. Empty and the full final LF are both cut points.
  const boundaries = new Map([[0, []]]);
  const events = [];
  let start = 0;
  for (let i = 0; i < bytes.length; i++)
    if (bytes[i] === 10) {
      events.push(JSON.parse(bytes.subarray(start, i).toString("utf8")));
      boundaries.set(i + 1, [...events]);
      start = i + 1;
    }
  assert.equal(start, bytes.length, "source fixture must be LF terminated");
  return { bytes, boundaries };
}
export function classifyCut(oracle, offset, decoder = decodeLog) {
  const expected = oracle.boundaries.get(offset);
  let decoded;
  try {
    decoded = decoder(oracle.bytes.subarray(0, offset).toString("utf8"));
  } catch (error) {
    return {
      offset,
      outcome: expected ? "boundary-failure" : "loud-failure",
      error: error.message,
    };
  }
  return {
    offset,
    outcome:
      expected && fingerprint(decoded) === fingerprint(expected)
        ? "clean-prefix"
        : "silent-divergence",
    prefixEvents: decoded.length,
  };
}
export function storeSweep(seed = SEED, emit) {
  const fixtures = [
    ...storeFixtures(seed),
    { id: "canonical-demo", kind: "demo", log: runScenario(demoTree()).log },
  ];
  const sweeps = fixtures.map(({ id, log }) => {
    const oracle = cutOracle(log);
    function* rows() {
      for (let offset = 0; offset <= oracle.bytes.length; offset++)
        yield classifyCut(oracle, offset);
    }
    const result = collectOffsets(
      {
        lane: "store",
        id,
        seed,
        bytes: oracle.bytes.length,
        logSha256: sha256(log),
      },
      rows(),
      emit,
    );
    assert.equal(
      result.outcomes["silent-divergence"] ?? 0,
      0,
      `${id}: silent divergence; quarantine as a numbered finding`,
    );
    assert.equal(
      result.outcomes["boundary-failure"] ?? 0,
      0,
      `${id}: boundary failure; quarantine as a numbered finding`,
    );
    assert.equal(result.outcomes["clean-prefix"], oracle.boundaries.size);
    return result;
  });
  const families = fixtures
    .filter((fixture) => fixture.kind === "retained-family")
    .map(({ id, log, expected }) => ({
      id,
      classification: expected,
      ...replayDeterminism(log),
    }));
  for (const family of families)
    emit?.({ lane: "store-family", fixture: family.id, seed, ...family });
  return {
    cutPoints: sweeps.reduce((sum, row) => sum + row.cutPoints, 0),
    sweeps,
    families,
  };
}
if (isMain(import.meta.url)) {
  const { seed, records } = args(process.argv.slice(2));
  const result = storeSweep(
    seed,
    records
      ? (row) => process.stdout.write(`${JSON.stringify(row)}\n`)
      : undefined,
  );
  compareLane("store", result);
  (records ? process.stderr : process.stdout).write(
    `${JSON.stringify(brief("store", result))}\n`,
  );
}
