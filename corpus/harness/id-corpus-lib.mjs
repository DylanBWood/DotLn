import { PATHS, countBy, jsonlBytes, makeRng } from "./wo101-support.mjs";

const U32 = 0x1_0000_0000;
const OFFSET_HIGH = 0xcbf29ce4;
const OFFSET_LOW = 0x84222325;
const PRIME_LOW = 0x1b3;
const PRIME_HIGH = 0x100;

export const PUBLISHED_FNV64_VECTORS = Object.freeze([
  Object.freeze({ value: "", utf8Hex: "", expected: "cbf29ce484222325" }),
  Object.freeze({ value: "a", utf8Hex: "61", expected: "af63dc4c8601ec8c" }),
  Object.freeze({
    value: "foobar",
    utf8Hex: "666f6f626172",
    expected: "85944171f73967e8",
  }),
  Object.freeze({ value: "\0", utf8Hex: "00", expected: "af63bd4c8601b7df" }),
  Object.freeze({
    value: "a\0",
    utf8Hex: "6100",
    expected: "089be207b544f1e4",
  }),
  Object.freeze({
    value: "foobar\0",
    utf8Hex: "666f6f62617200",
    expected: "34531ca7168b8f38",
  }),
]);

export const PUBLISHED_VECTOR_SOURCE = Object.freeze({
  title: "RFC 9923 §8.3 Test64 — published FNV64svalues/FNV64bvalues",
  url: "https://www.rfc-editor.org/rfc/rfc9923.html#section-8.3",
  nulMapping:
    "The final three JavaScript strings contain an explicit NUL and correspond to the RFC block tests over strlen+1 bytes, not its C-string tests.",
});

export const HAND_COMPUTED_COMMAND_VECTOR = Object.freeze({
  input: Object.freeze({ workstreamId: "a", decisionIndex: 0, intentIndex: 0 }),
  preimage: "ws:a:0:0",
  expected: "cmd_6b46f97735167cca",
  derivation:
    "Manual per-byte unsigned high:low recurrence from the FNV-1a-64 offset basis; each state is after the named UTF-8 byte.",
  byteTrace: Object.freeze([
    Object.freeze({ byteHex: "77", state: "af63ea4c86020456" }),
    Object.freeze({ byteHex: "73", state: "08cb4507b56d0adf" }),
    Object.freeze({ byteHex: "3a", state: "5e7131194849831f" }),
    Object.freeze({ byteHex: "61", state: "c3d9ebf5d4ea6f1a" }),
    Object.freeze({ byteHex: "3a", state: "b5bb12b8ca5ad360" }),
    Object.freeze({ byteHex: "30", state: "27b41fffd85510f0" }),
    Object.freeze({ byteHex: "3a", state: "cc2329bc988b873e" }),
    Object.freeze({ byteHex: "30", state: "6b46f97735167cca" }),
  ]),
});

export function referenceStableHash(value) {
  let high = OFFSET_HIGH;
  let low = OFFSET_LOW;
  for (const byte of Buffer.from(value, "utf8")) {
    const xorLow = (low ^ byte) >>> 0;
    const lowProduct = xorLow * PRIME_LOW;
    const carry = Math.floor(lowProduct / U32);
    high = (high * PRIME_LOW + xorLow * PRIME_HIGH + carry) >>> 0;
    low = lowProduct >>> 0;
  }
  return `${high.toString(16).padStart(8, "0")}${low.toString(16).padStart(8, "0")}`;
}

export function commandPreimage(
  workstreamId,
  episodeId,
  decisionIndex,
  intentIndex,
) {
  const scope =
    episodeId !== undefined && episodeId.length > 0
      ? `ep:${episodeId}`
      : `ws:${workstreamId}`;
  return `${scope}:${decisionIndex}:${intentIndex}`;
}

export function referenceCommandId(
  workstreamId,
  episodeId,
  decisionIndex,
  intentIndex,
) {
  return `cmd_${referenceStableHash(commandPreimage(workstreamId, episodeId, decisionIndex, intentIndex))}`;
}

function randomAscii(rng, length) {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:+-_.";
  let value = "";
  for (let index = 0; index < length; index++)
    value += alphabet[rng.int(alphabet.length)];
  return value;
}

function randomScalar(rng) {
  while (true) {
    const point = rng.int(0x110000);
    if (point < 0xd800 || point > 0xdfff) return String.fromCodePoint(point);
  }
}

function randomCodeUnits(rng, length) {
  let value = "";
  for (let index = 0; index < length; index++)
    value += String.fromCharCode(rng.int(0x10000));
  return value;
}

function stableRow(id, category, value, extra = {}) {
  const utf8 = Buffer.from(value, "utf8");
  return {
    id,
    category,
    input: value,
    utf8Bytes: utf8.length,
    utf8Hex: utf8.length <= 64 ? utf8.toString("hex") : null,
    expected: referenceStableHash(value),
    ...extra,
  };
}

function buildStableHashRows(seed) {
  const rows = PUBLISHED_FNV64_VECTORS.map((vector, index) => {
    const row = stableRow(
      `hash-published-${String(index).padStart(3, "0")}`,
      "published-anchor",
      vector.value,
      {
        publishedSource: PUBLISHED_VECTOR_SOURCE.url,
        publishedInputMode:
          index < 3
            ? "RFC C-string bytes"
            : "RFC block-test bytes including explicit NUL",
      },
    );
    if (row.expected !== vector.expected || row.utf8Hex !== vector.utf8Hex)
      throw new Error(`published FNV anchor ${index} failed`);
    return row;
  });

  const asciiRng = makeRng(seed, "ids/hash/ascii");
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
  for (let index = 0; index < 256; index++) {
    const numeric = numericStrings[index % numericStrings.length];
    const value = `ascii:${index}:${numeric}:${randomAscii(asciiRng, index % 29)}`;
    rows.push(
      stableRow(
        `hash-ascii-${String(index).padStart(3, "0")}`,
        "ascii-numeric-colon",
        value,
      ),
    );
  }

  const controlRng = makeRng(seed, "ids/hash/control");
  for (let index = 0; index < 256; index++) {
    const first = String.fromCharCode(index % 32);
    const second = String.fromCharCode(
      index % 5 === 0 ? 0x7f : controlRng.int(32),
    );
    const value = `${first}control:${index}:${second}\0tail`;
    rows.push(
      stableRow(
        `hash-control-${String(index).padStart(3, "0")}`,
        "control",
        value,
      ),
    );
  }

  const scalarRng = makeRng(seed, "ids/hash/scalar");
  const boundaries = [0x7f, 0x80, 0x7ff, 0x800, 0xffff, 0x10000, 0x10ffff];
  for (let index = 0; index < 384; index++) {
    let value = `scalar:${index}:`;
    value +=
      index < boundaries.length
        ? String.fromCodePoint(boundaries[index])
        : randomScalar(scalarRng);
    const additions = 1 + scalarRng.int(6);
    for (let part = 0; part < additions; part++)
      value += randomScalar(scalarRng);
    rows.push(
      stableRow(
        `hash-scalar-${String(index).padStart(3, "0")}`,
        "unicode-scalar",
        value,
        index < boundaries.length
          ? { boundaryCodePoint: boundaries[index] }
          : {},
      ),
    );
  }

  const surrogateRng = makeRng(seed, "ids/hash/surrogate");
  const surrogateModes = [
    "lone-high",
    "lone-low",
    "valid-pair",
    "reversed-pair",
    "repeated-high",
    "repeated-low",
  ];
  for (let index = 0; index < 384; index++) {
    const high = 0xd800 + surrogateRng.int(0x400);
    const low = 0xdc00 + surrogateRng.int(0x400);
    const mode = index % 6;
    const fragment =
      mode === 0
        ? String.fromCharCode(high)
        : mode === 1
          ? String.fromCharCode(low)
          : mode === 2
            ? String.fromCharCode(high, low)
            : mode === 3
              ? String.fromCharCode(low, high)
              : mode === 4
                ? String.fromCharCode(high, high)
                : String.fromCharCode(low, low);
    rows.push(
      stableRow(
        `hash-surrogate-${String(index).padStart(3, "0")}`,
        "surrogate-shape",
        `surrogate:${index}:${fragment}`,
        { surrogateMode: surrogateModes[mode] },
      ),
    );
  }

  const normalizationPairs = [
    ["é", "e\u0301"],
    ["Å", "A\u030a"],
    ["ñ", "n\u0303"],
    ["ö", "o\u0308"],
    ["ü", "u\u0308"],
    ["ç", "c\u0327"],
    ["á", "a\u0301"],
    ["í", "i\u0301"],
    ["ó", "o\u0301"],
    ["ú", "u\u0301"],
    ["ý", "y\u0301"],
    ["Č", "C\u030c"],
    ["ž", "z\u030c"],
    ["ǵ", "g\u0301"],
    ["ḱ", "k\u0301"],
    ["ṕ", "p\u0301"],
  ];
  for (let pairIndex = 0; pairIndex < 128; pairIndex++) {
    const [nfc, nfd] =
      normalizationPairs[pairIndex % normalizationPairs.length];
    const prefix = `normalization:${pairIndex}:`;
    const pairId = `normalization-${String(pairIndex).padStart(3, "0")}`;
    rows.push(
      stableRow(`hash-${pairId}-nfc`, "normalization", `${prefix}${nfc}`, {
        pairId,
        form: "NFC",
      }),
    );
    rows.push(
      stableRow(`hash-${pairId}-nfd`, "normalization", `${prefix}${nfd}`, {
        pairId,
        form: "NFD",
      }),
    );
  }

  const longRng = makeRng(seed, "ids/hash/long");
  const longAlphabet = "ab:é😀\0";
  for (let index = 0; index < 256; index++) {
    const targetLength =
      index === 255 ? 65536 : 1 + ((index * 257 + longRng.int(257)) % 4096);
    let value = `length:${index}:`;
    while (value.length < targetLength)
      value += longAlphabet[longRng.int(longAlphabet.length)];
    value = value.slice(0, targetLength);
    rows.push(
      stableRow(
        `hash-length-${String(index).padStart(3, "0")}`,
        "boundary-long",
        value,
        { utf16CodeUnits: value.length },
      ),
    );
  }

  const mixedRng = makeRng(seed, "ids/hash/mixed");
  for (let index = 0; index < 256; index++) {
    const value = `mixed:${index}:${randomCodeUnits(mixedRng, 1 + mixedRng.int(64))}`;
    rows.push(
      stableRow(
        `hash-mixed-${String(index).padStart(3, "0")}`,
        "seeded-mixed-utf16",
        value,
      ),
    );
  }

  return rows;
}

function commandRow(
  id,
  category,
  workstreamId,
  episodeId,
  decisionIndex,
  intentIndex,
  extra = {},
) {
  const input = {
    workstreamId,
    ...(episodeId === undefined ? {} : { episodeId }),
    decisionIndex,
    intentIndex,
  };
  return {
    id,
    category,
    input,
    preimage: commandPreimage(
      workstreamId,
      episodeId,
      decisionIndex,
      intentIndex,
    ),
    expected: referenceCommandId(
      workstreamId,
      episodeId,
      decisionIndex,
      intentIndex,
    ),
    ...extra,
  };
}

function buildCommandIdRows(seed) {
  const rows = [];
  const namespaceRng = makeRng(seed, "ids/command/namespace");
  for (let pairIndex = 0; pairIndex < 256; pairIndex++) {
    const suffix =
      pairIndex === 0
        ? "wsB"
        : `shared:${pairIndex}:${randomAscii(namespaceRng, 5 + namespaceRng.int(18))}`;
    const decisionIndex = pairIndex === 0 ? 3 : namespaceRng.int(10000);
    const intentIndex = pairIndex === 0 ? 0 : namespaceRng.int(100);
    const pairId = `namespace-${String(pairIndex).padStart(3, "0")}`;
    rows.push(
      commandRow(
        `command-${pairId}-episode`,
        "namespace-pair",
        `owner:${pairIndex}`,
        suffix,
        decisionIndex,
        intentIndex,
        { pairId, scope: "episode" },
      ),
    );
    rows.push(
      commandRow(
        `command-${pairId}-workstream`,
        "namespace-pair",
        suffix,
        undefined,
        decisionIndex,
        intentIndex,
        { pairId, scope: "workstream" },
      ),
    );
  }

  const fallbackRng = makeRng(seed, "ids/command/fallback");
  for (let pairIndex = 0; pairIndex < 128; pairIndex++) {
    const workstreamId =
      pairIndex === 0
        ? "a"
        : `fallback:${pairIndex}:${randomAscii(fallbackRng, fallbackRng.int(20))}`;
    const decisionIndex = pairIndex === 0 ? 0 : fallbackRng.int(10000);
    const intentIndex = pairIndex === 0 ? 0 : fallbackRng.int(100);
    const pairId = `fallback-${String(pairIndex).padStart(3, "0")}`;
    rows.push(
      commandRow(
        `command-${pairId}-undefined`,
        "fallback-equivalence",
        workstreamId,
        undefined,
        decisionIndex,
        intentIndex,
        {
          pairId,
          episodeMode: "undefined",
          ...(pairIndex === 0
            ? { handComputedByteTrace: HAND_COMPUTED_COMMAND_VECTOR.byteTrace }
            : {}),
        },
      ),
    );
    rows.push(
      commandRow(
        `command-${pairId}-empty`,
        "fallback-equivalence",
        workstreamId,
        "",
        decisionIndex,
        intentIndex,
        { pairId, episodeMode: "empty" },
      ),
    );
  }

  const controlRng = makeRng(seed, "ids/command/control");
  for (let index = 0; index < 256; index++) {
    const workstreamId = `ws:${index}:${String.fromCharCode(index % 32)}:${randomAscii(controlRng, index % 13)}`;
    const episodeId =
      index % 3 === 0
        ? undefined
        : `ep::${String.fromCharCode((index + 7) % 32)}:${index}`;
    rows.push(
      commandRow(
        `command-control-${String(index).padStart(3, "0")}`,
        "colon-control",
        workstreamId,
        episodeId,
        index,
        index % 17,
      ),
    );
  }

  const unicodeRng = makeRng(seed, "ids/command/unicode");
  const unicodeIds = [
    "é",
    "e\u0301",
    "😀",
    "💩",
    "\ud800",
    "\udc00",
    "汉字",
    "مرحبا",
    "कर्म",
  ];
  for (let index = 0; index < 256; index++) {
    const atom = unicodeIds[index % unicodeIds.length];
    const extra =
      index % 2 === 0
        ? randomScalar(unicodeRng)
        : randomCodeUnits(unicodeRng, 1 + unicodeRng.int(4));
    const workstreamId = `unicode-ws:${index}:${atom}${extra}`;
    const episodeId =
      index % 4 === 0 ? undefined : `unicode-ep:${atom}:${extra}`;
    rows.push(
      commandRow(
        `command-unicode-${String(index).padStart(3, "0")}`,
        "unicode-combining-surrogate",
        workstreamId,
        episodeId,
        index * 17,
        index % 31,
      ),
    );
  }

  const numericIds = [
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
  const safeIndices = [0, 1, 9, 10, 999, 4294967295, Number.MAX_SAFE_INTEGER];
  for (let index = 0; index < 256; index++) {
    const workstreamId = numericIds[index % numericIds.length];
    const episodeId =
      index % 5 === 0 ? undefined : numericIds[(index + 3) % numericIds.length];
    rows.push(
      commandRow(
        `command-numeric-${String(index).padStart(3, "0")}`,
        "numeric-string-edge",
        workstreamId,
        episodeId,
        safeIndices[index % safeIndices.length],
        safeIndices[(index + 2) % safeIndices.length],
      ),
    );
  }

  const longRng = makeRng(seed, "ids/command/long");
  for (let index = 0; index < 256; index++) {
    const length =
      index === 255 ? 32768 : (index * 131 + longRng.int(131)) % 2048;
    const workstreamId =
      index === 0
        ? ""
        : `long-ws:${index}:`.padEnd(length, index % 2 === 0 ? ":" : "界");
    const episodeId =
      index % 3 === 0
        ? undefined
        : index === 1
          ? ""
          : `long-ep:${index}:`.padEnd(Math.floor(length / 2), "é");
    rows.push(
      commandRow(
        `command-long-${String(index).padStart(3, "0")}`,
        "empty-long-id",
        workstreamId,
        episodeId,
        index,
        0,
      ),
    );
  }

  const mixedRng = makeRng(seed, "ids/command/mixed");
  for (let index = 0; index < 256; index++) {
    const workstreamId = randomCodeUnits(mixedRng, mixedRng.int(48));
    const episodeId =
      index % 6 === 0 ? undefined : randomCodeUnits(mixedRng, mixedRng.int(48));
    rows.push(
      commandRow(
        `command-mixed-${String(index).padStart(3, "0")}`,
        "seeded-mixed-tuple",
        workstreamId,
        episodeId,
        mixedRng.int(1_000_000),
        mixedRng.int(10_000),
      ),
    );
  }

  return rows;
}

export function buildIdCorpus(seed) {
  const stableRows = buildStableHashRows(seed);
  const commandRows = buildCommandIdRows(seed);
  const stableBytes = jsonlBytes(stableRows);
  const commandBytes = jsonlBytes(commandRows);
  return {
    stableRows,
    commandRows,
    files: [
      {
        relativePath: "corpus/fixtures/ids/stable-hash-vectors.jsonl",
        absolutePath: `${PATHS.idFixtures}/stable-hash-vectors.jsonl`,
        bytes: stableBytes,
        rows: stableRows.length,
      },
      {
        relativePath: "corpus/fixtures/ids/command-id-vectors.jsonl",
        absolutePath: `${PATHS.idFixtures}/command-id-vectors.jsonl`,
        bytes: commandBytes,
        rows: commandRows.length,
      },
    ],
    summary: {
      stableHash: {
        generatedInputs: stableRows.length,
        categoryCounts: countBy(stableRows, (row) => row.category),
        normalizationPairs: 128,
        publishedAnchors: PUBLISHED_FNV64_VECTORS.length,
      },
      commandId: {
        generatedInputs: commandRows.length,
        categoryCounts: countBy(commandRows, (row) => row.category),
        namespacePairs: 256,
        fallbackPairs: 128,
      },
    },
  };
}
