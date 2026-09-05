import { decodeBeaconSize, framedSize } from "./beacon-codebook.mjs";

// Independent field space; v1 keeps its episode/receipt meaning unchanged.
export const CONTROL_CODEBOOK = /** @type {const} */ ({
  version: 2,
  phases: [
    "active",
    "ready-to-verify",
    "verifying",
    "needs-fix",
    "repairing",
    "verified",
    "final-review",
    "closed",
  ],
  verdicts: ["unknown", "fail", "pass"],
  efforts: ["unknown", "low", "medium", "high", "xhigh", "max"],
  provenances: ["host-projected", "self-reported"],
  phaseRadix: 8,
  verdictRadix: 3,
  effortRadix: 6,
  provenanceRadix: 2,
  versionRadix: 4,
});
export const MAX_V2_CODE = 1150n;
export const MAX_V2_LOGICAL_BYTES = 81833n;
export const GROUP_CODEBOOK = /** @type {const} */ ({
  family: "phase-group",
  version: 1,
  framingVersion: 3,
  maxMembers: 12,
  radix: 13,
  versionRadix: 4,
});
export const MAX_MEMBERS = GROUP_CODEBOOK.maxMembers;
export const RADIX = BigInt(GROUP_CODEBOOK.radix);
export const MAX_GROUP_CODE = 3011928819n;
export const MAX_GROUP_LOGICAL_BYTES = 192763452654n;
export const BEACON_STALE_AFTER_MS = 20 * 60 * 1000;

/** @typedef {import("./control-beacon.js").ControlBeaconState} ControlBeaconState */
/** @typedef {import("./control-beacon.js").SignalDecode} SignalDecode */

/** @param {readonly string[]} domain @param {string} value */
const rank = (domain, value) => {
  const index = domain.indexOf(value);
  if (index < 0) throw new Error("invalid beacon v2 fields");
  return BigInt(index);
};

/** @param {ControlBeaconState} state */
export function encodeControlBeacon(state) {
  if (state.codebookVersion !== 2) throw new Error("invalid beacon v2 version");
  const b = CONTROL_CODEBOOK;
  const code =
    (((rank(b.phases, state.phase) * BigInt(b.verdictRadix) +
      rank(b.verdicts, state.latestVerdict)) *
      BigInt(b.effortRadix) +
      rank(b.efforts, state.effort)) *
      BigInt(b.provenanceRadix) +
      rank(b.provenances, state.provenance)) *
      BigInt(b.versionRadix) +
    2n;
  return framedSize(code);
}

/** @param {readonly number[]} counts */
export function encodeGroupBeacon(counts) {
  if (
    counts.length !== CONTROL_CODEBOOK.phases.length ||
    counts.some(
      (count) => !Number.isInteger(count) || count < 0 || count > MAX_MEMBERS,
    ) ||
    counts.reduce((sum, count) => sum + count, 0) > MAX_MEMBERS
  )
    throw new Error("group member counts exceed the declared bound");
  const sum = counts.reduce(
    (value, count, index) => value + BigInt(count) * RADIX ** BigInt(index),
    0n,
  );
  return framedSize(sum * 4n + 3n);
}

/** @param {number | bigint} size @returns {SignalDecode} */
export function decodeSignalSize(size) {
  const legacy = decodeBeaconSize(size);
  if (legacy.status !== "unknown-codebook") return legacy;
  const code = (BigInt(size) - 8192n) / 64n;
  if (legacy.codebookVersion === 2) {
    if (code > MAX_V2_CODE) return { status: "malformed" };
    let fields = code / 4n;
    const provenance = CONTROL_CODEBOOK.provenances[Number(fields % 2n)];
    fields /= 2n;
    const effort = CONTROL_CODEBOOK.efforts[Number(fields % 6n)];
    fields /= 6n;
    const latestVerdict = CONTROL_CODEBOOK.verdicts[Number(fields % 3n)];
    const phase = CONTROL_CODEBOOK.phases[Number(fields / 3n)];
    if (!provenance || !effort || !latestVerdict || !phase)
      return { status: "malformed" };
    return {
      status: "decoded",
      state: { codebookVersion: 2, phase, latestVerdict, effort, provenance },
    };
  }
  // Individual v3 remains available to WO-022. A group is a separate family,
  // selected only by the dedicated group directory/decoder, never guessed here.
  return legacy;
}

/** @param {number | bigint} size @returns {import("./control-beacon.js").GroupDecode} */
export function decodeGroupBeaconSize(size) {
  const framed = decodeBeaconSize(size);
  if (
    framed.status !== "unknown-codebook" ||
    framed.codebookVersion !== GROUP_CODEBOOK.framingVersion
  )
    return { status: "malformed" };
  const code = (BigInt(size) - 8192n) / 64n;
  if (code > MAX_GROUP_CODE) return { status: "malformed" };
  let sum = code / 4n;
  const counts = CONTROL_CODEBOOK.phases.map(() => {
    const count = Number(sum % RADIX);
    sum /= RADIX;
    return count;
  });
  if (
    sum !== 0n ||
    counts.reduce((total, count) => total + count, 0) > MAX_MEMBERS
  )
    return { status: "malformed" };
  return { status: "decoded", state: { groupCodebookVersion: 1, counts } };
}

/** @param {readonly import("./control-beacon.js").SignalObservation[]} observations */
export function groupCounts(observations) {
  const counts = CONTROL_CODEBOOK.phases.map(() => 0);
  for (const { decoded } of observations) {
    if (
      decoded.status !== "decoded" ||
      decoded.state.codebookVersion !== 2 ||
      decoded.state.provenance !== "host-projected"
    )
      continue;
    const index = CONTROL_CODEBOOK.phases.indexOf(decoded.state.phase);
    counts[index] = (counts[index] ?? 0) + 1;
  }
  encodeGroupBeacon(counts); // One bound check for pure, file, and rendered forms.
  return counts;
}

/** @param {{mtimeMs: number | null, mtimeNs?: string | null, decoded: {status: string}}} observation @param {number} now @param {number} threshold */
export function beaconAge(observation, now, threshold = BEACON_STALE_AFTER_MS) {
  if (
    !Number.isSafeInteger(now) ||
    now < 0 ||
    !Number.isSafeInteger(threshold) ||
    threshold < 0
  )
    throw new Error("invalid beacon observation time or cadence");
  if (observation.decoded.status === "absent") return "absent";
  if (observation.decoded.status === "unknown-codebook")
    return "unknown-codebook";
  if (observation.decoded.status !== "decoded") return "malformed";
  if (
    observation.mtimeMs === null ||
    !Number.isSafeInteger(observation.mtimeMs) ||
    observation.mtimeMs < 0
  )
    return "malformed";
  if (
    observation.mtimeNs !== undefined &&
    (typeof observation.mtimeNs !== "string" ||
      !/^\d+$/.test(observation.mtimeNs))
  )
    return "malformed";
  const mtime =
    observation.mtimeNs === undefined
      ? BigInt(observation.mtimeMs) * 1000000n
      : BigInt(observation.mtimeNs);
  if (mtime / 1000000n !== BigInt(observation.mtimeMs)) return "malformed";
  const sweptAt = BigInt(now) * 1000000n;
  if (mtime > sweptAt) return "clock-skew";
  return sweptAt - mtime >= BigInt(threshold) * 1000000n ? "stale" : "fresh";
}
