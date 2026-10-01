import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const SEED = "wo105-crash-20261001";
export const BASE = "2b1af1abfd947068c402daa1ee24b447fc81b1af";
export const MANIFEST = "corpus/manifests/WO-105.json";
export const OBSERVATIONS = "corpus/manifests/WO-105-observations.jsonl";
export const GOLDEN = `corpus/fixtures/golden-traces/WO-105-demo-${BASE.slice(0, 8)}.json`;
export const jsonBytes = (value) => `${JSON.stringify(value, null, 2)}\n`;
export const read = (name) => readFileSync(resolve(ROOT, name), "utf8");
export const readJson = (name) => JSON.parse(read(name));
export const sha256 = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
export const demoTree = () =>
  readJson("packages/skeleton/fixtures/repo-tree.json");
export const isMain = (url) =>
  process.argv[1] !== undefined &&
  url === pathToFileURL(resolve(process.argv[1])).href;

export function rng(seed) {
  let state = 2166136261;
  for (const byte of Buffer.from(seed))
    state = Math.imul(state ^ byte, 16777619) >>> 0;
  return () => (state = (Math.imul(state, 1664525) + 1013904223) >>> 0);
}

// A non-recursive structural digest also supports the 12,000-level payload.
export function fingerprint(value) {
  const hash = createHash("sha256");
  const pending = [value];
  while (pending.length) {
    const item = pending.pop();
    if (Array.isArray(item)) {
      hash.update(`array:${item.length}:`);
      for (let i = item.length - 1; i >= 0; i--) pending.push(item[i]);
    } else if (item !== null && typeof item === "object") {
      const keys = Object.keys(item).sort();
      hash.update(`object:${JSON.stringify(keys)}:`);
      for (let i = keys.length - 1; i >= 0; i--) pending.push(item[keys[i]]);
    } else hash.update(`${typeof item}:${JSON.stringify(item)};`);
  }
  return hash.digest("hex");
}

export function exactFiles(files, mode) {
  for (const [name, bytes] of Object.entries(files)) {
    assert.match(
      name,
      /^corpus\/(fixtures\/(store|golden-traces|skeleton-trees)|manifests)\//,
    );
    if (mode === "write") {
      mkdirSync(dirname(resolve(ROOT, name)), { recursive: true });
      writeFileSync(resolve(ROOT, name), bytes);
    } else assert.equal(read(name), bytes, `regeneration differs: ${name}`);
  }
}

export function args(argv, modes = []) {
  let seed = SEED;
  let mode;
  let records = false;
  const seen = new Set();
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    assert.ok(!seen.has(flag), `duplicate flag: ${flag}`);
    seen.add(flag);
    if (flag === "--seed") seed = argv[++i];
    else if (modes.includes(flag.slice(2))) {
      assert.equal(mode, undefined, "choose one mode");
      mode = flag.slice(2);
    } else if (flag === "--records" && !modes.length) records = true;
    else throw new Error(`unknown argument: ${flag}`);
  }
  assert.equal(seed, SEED, "use the manifest's recorded seed");
  if (modes.length)
    assert.ok(mode, `select ${modes.map((m) => `--${m}`).join(" or ")}`);
  return { seed, mode, records };
}

// Every offset produces a raw JSONL row. Adjacent identical classifications are
// losslessly compressed only for committed observations, never to skip execution.
export function collectOffsets(meta, rows, emit = () => {}) {
  const digest = createHash("sha256");
  const ranges = [];
  const outcomes = {};
  let cutPoints = 0;
  for (const row of rows) {
    assert.equal(
      row.offset,
      cutPoints,
      `${meta.id}: missing or repeated offset`,
    );
    const record = {
      lane: meta.lane,
      fixture: meta.id,
      seed: meta.seed,
      ...row,
    };
    const bytes = `${JSON.stringify(record)}\n`;
    digest.update(bytes);
    emit(record);
    cutPoints++;
    outcomes[row.outcome] = (outcomes[row.outcome] ?? 0) + 1;
    const { offset, ...classification } = row;
    const previous = ranges.at(-1);
    const key = JSON.stringify(classification);
    if (previous?.key === key) previous.through = offset;
    else ranges.push({ offset, through: offset, key, ...classification });
  }
  assert.equal(cutPoints, meta.bytes + 1, `${meta.id}: incomplete byte sweep`);
  return {
    ...meta,
    cutPoints,
    outcomes,
    recordsSha256: digest.digest("hex"),
    ranges: ranges.map(({ key: _key, ...range }) => range),
  };
}

export function compareLane(lane, result) {
  const expected = readJson(MANIFEST)[lane];
  assert.deepEqual(
    result,
    expected,
    `${lane} observations differ from the manifest`,
  );
}
export const brief = (lane, result) => ({
  lane,
  seed: SEED,
  cutPoints: result.cutPoints,
  fixtures: result.sweeps.map(
    ({ id, bytes, cutPoints, outcomes, recordsSha256 }) => ({
      id,
      bytes,
      cutPoints,
      outcomes,
      recordsSha256,
    }),
  ),
  families: result.families,
});
