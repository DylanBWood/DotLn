import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { commandId, stableHash } from "../../packages/kernel/dist/src/index.js";
import {
  HAND_COMPUTED_COMMAND_VECTOR,
  PUBLISHED_FNV64_VECTORS,
  commandPreimage,
  referenceCommandId,
  referenceStableHash,
} from "./id-corpus-lib.mjs";
import { PATHS, REPO_ROOT, countBy, parseJsonl } from "./wo101-support.mjs";

const manifest = JSON.parse(readFileSync(PATHS.manifest, "utf8"));
const stablePath = manifest.fixtures.find((fixture) =>
  fixture.path.endsWith("stable-hash-vectors.jsonl"),
).path;
const commandPath = manifest.fixtures.find((fixture) =>
  fixture.path.endsWith("command-id-vectors.jsonl"),
).path;
const stableRows = parseJsonl(
  readFileSync(`${REPO_ROOT}/${stablePath}`, "utf8"),
  stablePath,
);
const commandRows = parseJsonl(
  readFileSync(`${REPO_ROOT}/${commandPath}`, "utf8"),
  commandPath,
);

test("WO-101 independent pair-arithmetic hash is planted on published FNV-1a-64 values", () => {
  assert.equal(
    manifest.ids.publishedVectorSource.url,
    "https://www.rfc-editor.org/rfc/rfc9923.html#section-8.3",
  );
  assert.match(
    manifest.ids.publishedVectorSource.nulMapping,
    /block tests over strlen\+1 bytes/,
  );
  for (const vector of PUBLISHED_FNV64_VECTORS) {
    assert.equal(
      Buffer.from(vector.value, "utf8").toString("hex"),
      vector.utf8Hex,
    );
    assert.equal(referenceStableHash(vector.value), vector.expected);
    assert.equal(stableHash(vector.value), vector.expected);
  }
  assert.equal(referenceStableHash("é"), "0ac21707b7181e01");
  assert.equal(referenceStableHash("e\u0301"), "c0c9d418ee802e1f");
  assert.notEqual(referenceStableHash("é"), referenceStableHash("e\u0301"));
  assert.deepEqual(
    countBy(
      stableRows.filter((row) => row.category === "published-anchor"),
      (row) => row.publishedInputMode,
    ),
    {
      "RFC C-string bytes": 3,
      "RFC block-test bytes including explicit NUL": 3,
    },
  );
});

test("WO-101 every stable-hash fixture agrees byte-for-byte across independent and shipped implementations", () => {
  assert.equal(stableRows.length, 2054);
  const ids = new Set();
  for (const row of stableRows) {
    assert.equal(ids.has(row.id), false, `duplicate stable-hash id ${row.id}`);
    ids.add(row.id);
    assert.equal(Buffer.byteLength(row.input, "utf8"), row.utf8Bytes, row.id);
    if (row.utf8Hex !== null)
      assert.equal(
        Buffer.from(row.input, "utf8").toString("hex"),
        row.utf8Hex,
        row.id,
      );
    const reference = referenceStableHash(row.input);
    assert.equal(reference, row.expected, `${row.id}: reference drift`);
    assert.equal(
      stableHash(row.input),
      row.expected,
      `${row.id}: shipped drift`,
    );
    assert.match(row.expected, /^[0-9a-f]{16}$/);
  }
  assert.deepEqual(
    countBy(stableRows, (row) => row.category),
    manifest.ids.counts.stableHash.categoryCounts,
  );
});

test("WO-101 every command-id tuple agrees across the typed reference and shipped implementation", () => {
  assert.equal(commandRows.length, 2048);
  const ids = new Set();
  for (const row of commandRows) {
    assert.equal(
      ids.has(row.id),
      false,
      `duplicate command-id vector id ${row.id}`,
    );
    ids.add(row.id);
    const { workstreamId, episodeId, decisionIndex, intentIndex } = row.input;
    assert.equal(
      commandPreimage(workstreamId, episodeId, decisionIndex, intentIndex),
      row.preimage,
      `${row.id}: preimage drift`,
    );
    assert.equal(
      referenceCommandId(workstreamId, episodeId, decisionIndex, intentIndex),
      row.expected,
      `${row.id}: reference drift`,
    );
    assert.equal(
      commandId(workstreamId, episodeId, decisionIndex, intentIndex),
      row.expected,
      `${row.id}: shipped drift`,
    );
    assert.match(row.expected, /^cmd_[0-9a-f]{16}$/);
  }
  assert.deepEqual(
    countBy(commandRows, (row) => row.category),
    manifest.ids.counts.commandId.categoryCounts,
  );
});

test("WO-101 normalization pairs explicitly preserve byte-honest NFC/NFD differences", () => {
  const pairs = new Map();
  for (const row of stableRows.filter(
    (row) => row.category === "normalization",
  )) {
    const pair = pairs.get(row.pairId) ?? {};
    pair[row.form] = row;
    pairs.set(row.pairId, pair);
  }
  assert.equal(pairs.size, 128);
  for (const [pairId, pair] of pairs) {
    assert.ok(pair.NFC && pair.NFD, `${pairId}: incomplete pair`);
    assert.notEqual(
      pair.NFC.input,
      pair.NFD.input,
      `${pairId}: inputs collapsed`,
    );
    assert.notEqual(
      Buffer.from(pair.NFC.input, "utf8").toString("hex"),
      Buffer.from(pair.NFD.input, "utf8").toString("hex"),
      `${pairId}: bytes collapsed`,
    );
    assert.notEqual(
      pair.NFC.expected,
      pair.NFD.expected,
      `${pairId}: byte-distinct pair unexpectedly shares its pinned hash`,
    );
    assert.equal(
      pair.NFC.input.normalize("NFD"),
      pair.NFD.input,
      `${pairId}: labels do not describe an actual canonical pair`,
    );
  }
  const first = pairs.get("normalization-000");
  assert.equal(first.NFC.expected, referenceStableHash("normalization:0:é"));
  assert.equal(
    first.NFD.expected,
    referenceStableHash("normalization:0:e\u0301"),
  );
});

test("WO-101 surrogate probes distinguish encoding equivalence from a hash collision", () => {
  const replacement = referenceStableHash("\ufffd");
  assert.equal(replacement, "6f6d661b9658624a");
  assert.equal(referenceStableHash("\ud800"), replacement);
  assert.equal(referenceStableHash("\udc00"), replacement);
  assert.equal(Buffer.from("\ud800", "utf8").toString("hex"), "efbfbd");
  assert.equal(Buffer.from("\udc00", "utf8").toString("hex"), "efbfbd");
});

test("WO-101 namespace pairs re-derive the swallowed-command incident with only ep:/ws: changed", () => {
  const pairs = new Map();
  for (const row of commandRows.filter(
    (row) => row.category === "namespace-pair",
  )) {
    const pair = pairs.get(row.pairId) ?? {};
    pair[row.scope] = row;
    pairs.set(row.pairId, pair);
  }
  assert.equal(pairs.size, 256);
  for (const [pairId, pair] of pairs) {
    assert.ok(
      pair.episode && pair.workstream,
      `${pairId}: incomplete namespace pair`,
    );
    assert.equal(
      pair.episode.preimage.slice(3),
      pair.workstream.preimage.slice(3),
      `${pairId}: more than namespace tag changed`,
    );
    assert.match(pair.episode.preimage, /^ep:/);
    assert.match(pair.workstream.preimage, /^ws:/);
    assert.notEqual(
      pair.episode.expected,
      pair.workstream.expected,
      `${pairId}: namespace-tag regression`,
    );
  }
  const incident = pairs.get("namespace-000");
  assert.equal(incident.episode.preimage, "ep:wsB:3:0");
  assert.equal(incident.episode.expected, "cmd_9f0a119f70ab47ff");
  assert.equal(incident.workstream.preimage, "ws:wsB:3:0");
  assert.equal(incident.workstream.expected, "cmd_bc1ac4ef335409c4");
});

test("WO-101 empty episode IDs exactly equal undefined fallback IDs", () => {
  const pairs = new Map();
  for (const row of commandRows.filter(
    (row) => row.category === "fallback-equivalence",
  )) {
    const pair = pairs.get(row.pairId) ?? {};
    pair[row.episodeMode] = row;
    pairs.set(row.pairId, pair);
  }
  assert.equal(pairs.size, 128);
  for (const [pairId, pair] of pairs) {
    assert.ok(
      pair.undefined && pair.empty,
      `${pairId}: incomplete fallback pair`,
    );
    assert.equal(
      pair.undefined.preimage,
      pair.empty.preimage,
      `${pairId}: fallback preimage drift`,
    );
    assert.equal(
      pair.undefined.expected,
      pair.empty.expected,
      `${pairId}: fallback hash drift`,
    );
  }
  const hand = pairs.get("fallback-000");
  assert.equal(hand.undefined.preimage, "ws:a:0:0");
  assert.equal(hand.undefined.expected, "cmd_6b46f97735167cca");
  assert.deepEqual(
    hand.undefined.handComputedByteTrace,
    HAND_COMPUTED_COMMAND_VECTOR.byteTrace,
  );
});

test("WO-101 corpus includes empty, very long, control, colon, numeric-string, and Unicode ID families", () => {
  assert.ok(stableRows.some((row) => row.input === ""));
  assert.ok(stableRows.some((row) => row.input.length >= 65536));
  assert.ok(stableRows.some((row) => row.input.includes("\0")));
  assert.ok(commandRows.some((row) => row.input.workstreamId === ""));
  assert.ok(commandRows.some((row) => row.input.workstreamId.length >= 32768));
  const stableControls = stableRows
    .filter((row) => row.category === "control")
    .map((row) => row.input)
    .join("");
  for (let codePoint = 0; codePoint < 32; codePoint++)
    assert.ok(
      stableControls.includes(String.fromCharCode(codePoint)),
      `missing C0 byte U+${codePoint.toString(16).padStart(4, "0")}`,
    );
  assert.ok(
    stableControls.includes(String.fromCharCode(0x7f)),
    "missing DEL control byte",
  );

  const boundaryRows = stableRows.filter(
    (row) => row.boundaryCodePoint !== undefined,
  );
  const scalarBoundaries = boundaryRows.map((row) => row.boundaryCodePoint);
  assert.deepEqual(
    scalarBoundaries,
    [0x7f, 0x80, 0x7ff, 0x800, 0xffff, 0x10000, 0x10ffff],
  );
  for (const row of boundaryRows)
    assert.ok(
      row.input.includes(String.fromCodePoint(row.boundaryCodePoint)),
      `boundary metadata is not present in ${row.id}`,
    );
  const surrogateRows = stableRows.filter(
    (row) => row.category === "surrogate-shape",
  );
  assert.deepEqual(
    countBy(surrogateRows, (row) => row.surrogateMode),
    {
      "lone-high": 64,
      "lone-low": 64,
      "repeated-high": 64,
      "repeated-low": 64,
      "reversed-pair": 64,
      "valid-pair": 64,
    },
  );
  const isHigh = (value) => value >= 0xd800 && value <= 0xdbff;
  const isLow = (value) => value >= 0xdc00 && value <= 0xdfff;
  for (const row of surrogateRows) {
    const fragment = row.input.replace(/^surrogate:\d+:/, "");
    const units = [...fragment].flatMap((character) =>
      character.length === 1
        ? [character.charCodeAt(0)]
        : [character.charCodeAt(0), character.charCodeAt(1)],
    );
    if (row.surrogateMode === "lone-high")
      assert.ok(units.length === 1 && isHigh(units[0]), row.id);
    else if (row.surrogateMode === "lone-low")
      assert.ok(units.length === 1 && isLow(units[0]), row.id);
    else if (row.surrogateMode === "valid-pair")
      assert.ok(
        units.length === 2 && isHigh(units[0]) && isLow(units[1]),
        row.id,
      );
    else if (row.surrogateMode === "reversed-pair")
      assert.ok(
        units.length === 2 && isLow(units[0]) && isHigh(units[1]),
        row.id,
      );
    else if (row.surrogateMode === "repeated-high")
      assert.ok(
        units.length === 2 && isHigh(units[0]) && isHigh(units[1]),
        row.id,
      );
    else if (row.surrogateMode === "repeated-low")
      assert.ok(
        units.length === 2 && isLow(units[0]) && isLow(units[1]),
        row.id,
      );
    else assert.fail(`unknown surrogate mode ${row.surrogateMode}`);
  }

  const commandControls = commandRows
    .filter((row) => row.category === "colon-control")
    .map((row) => row.preimage)
    .join("");
  for (let codePoint = 0; codePoint < 32; codePoint++)
    assert.ok(
      commandControls.includes(String.fromCharCode(codePoint)),
      `command preimages miss C0 U+${codePoint.toString(16).padStart(4, "0")}`,
    );
  const numericStrings = [
    "0",
    "-0",
    "+0",
    "00",
    "01",
    "1e3",
    "1E+3",
    "NaN",
    "Infinity",
    "9007199254740991",
    "9007199254740992",
  ];
  const numericRows = commandRows.filter(
    (row) => row.category === "numeric-string-edge",
  );
  for (const value of numericStrings)
    assert.ok(
      numericRows.some(
        (row) =>
          row.input.workstreamId === value || row.input.episodeId === value,
      ),
      `missing numeric-string ID ${value}`,
    );
  const safeIndices = [0, 1, 9, 10, 999, 4294967295, Number.MAX_SAFE_INTEGER];
  for (const value of safeIndices)
    assert.ok(
      numericRows.some(
        (row) =>
          row.input.decisionIndex === value || row.input.intentIndex === value,
      ),
      `missing safe index ${value}`,
    );
  const unicodeRows = commandRows.filter(
    (row) => row.category === "unicode-combining-surrogate",
  );
  for (const value of [
    "é",
    "e\u0301",
    "😀",
    "💩",
    "\ud800",
    "\udc00",
    "汉字",
    "مرحبا",
    "कर्म",
  ]) {
    assert.ok(
      unicodeRows.some(
        (row) =>
          row.input.workstreamId.includes(value) ||
          row.input.episodeId?.includes(value),
      ),
      `missing Unicode command ID atom ${JSON.stringify(value)}`,
    );
  }
  assert.ok(
    commandRows.some(
      (row) =>
        row.input.workstreamId.includes(":") ||
        row.input.episodeId?.includes(":"),
    ),
    "missing embedded-colon IDs",
  );
  for (const category of [
    "colon-control",
    "unicode-combining-surrogate",
    "numeric-string-edge",
    "empty-long-id",
    "seeded-mixed-tuple",
  ]) {
    assert.equal(
      commandRows.filter((row) => row.category === category).length,
      256,
      category,
    );
  }
});
