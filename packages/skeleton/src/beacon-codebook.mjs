// Normative data: docs/product/02-domain-model.md, Beacon codebook v1.
export const BEACON_CODEBOOK = /** @type {const} */ ({
  version: 1,
  base: 8192,
  stride: 64,
  checkMultiplier: 17,
  checkOffset: 11,
  versionRadix: 4,
  outcomeRadix: 3,
  refusalRadix: 4,
  provenances: ["host-projected", "self-reported"],
  classes: [
    ["work-order-dispatch", ["emitted"]],
    ["authority-decision", ["allowed", "denied"]],
    ["recovery", ["redispatched"]],
    ["result", ["returned", "terminated"]],
    ["verification", ["unknown", "failed", "passed"]],
    ["no-op", ["no-op"]],
    ["external-effect", ["requested", "unknown", "observed"]],
  ],
});

const book = BEACON_CODEBOOK;
const V1_FRAME_CODE_LIMIT =
  book.classes.length *
  book.outcomeRadix *
  book.refusalRadix *
  book.provenances.length *
  book.versionRadix;

/** @param {bigint} code */
export const framedSize = (code) =>
  BigInt(book.base) +
  code * BigInt(book.stride) +
  ((code * BigInt(book.checkMultiplier) + BigInt(book.checkOffset)) %
    BigInt(book.stride));

/** @param {import("./beacon.js").BeaconState} state */
export function encodeBeaconState(state) {
  const action = book.classes.findIndex(([name]) => name === state.actionClass);
  /** @type {readonly string[]} */
  const outcomes = book.classes[action]?.[1] ?? [];
  const outcome = outcomes.indexOf(state.outcome);
  const provenance = book.provenances.indexOf(state.provenance);
  if (
    state.codebookVersion !== book.version ||
    action < 0 ||
    outcome < 0 ||
    provenance < 0 ||
    !Number.isInteger(state.refusalCount) ||
    state.refusalCount < 0 ||
    state.refusalCount >= book.refusalRadix
  )
    throw new Error("invalid beacon v1 fields");
  const code =
    (((action * book.outcomeRadix + outcome) * book.refusalRadix +
      state.refusalCount) *
      book.provenances.length +
      provenance) *
      book.versionRadix +
    state.codebookVersion;
  return Number(framedSize(BigInt(code)));
}

/**
 * @param {number | bigint} size
 * @returns {import("./beacon.js").BeaconDecode}
 */
export function decodeBeaconSize(size) {
  const malformed = /** @type {const} */ ({ status: "malformed" });
  if (typeof size === "number" && !Number.isSafeInteger(size)) return malformed;
  const bytes = BigInt(size);
  if (bytes < BigInt(book.base)) return malformed;
  const code = (bytes - BigInt(book.base)) / BigInt(book.stride);
  if (framedSize(code) !== bytes) return malformed;
  const version = Number(code % BigInt(book.versionRadix));
  if (version === 0) return malformed;
  if (version !== book.version)
    return { status: "unknown-codebook", codebookVersion: version };
  if (code >= BigInt(V1_FRAME_CODE_LIMIT)) return malformed;
  let fields = Number(code / BigInt(book.versionRadix));
  const provenance = book.provenances[fields % book.provenances.length];
  fields = Math.floor(fields / book.provenances.length);
  const refusalCount = fields % book.refusalRadix;
  fields = Math.floor(fields / book.refusalRadix);
  const outcomeRank = fields % book.outcomeRadix;
  const entry = book.classes[Math.floor(fields / book.outcomeRadix)];
  if (entry === undefined || provenance === undefined) return malformed;
  const [actionClass, outcomes] = entry;
  const outcome = outcomes[outcomeRank];
  if (outcome === undefined) return malformed;
  return {
    status: "decoded",
    state: {
      codebookVersion: 1,
      actionClass,
      outcome,
      refusalCount,
      provenance,
    },
  };
}
