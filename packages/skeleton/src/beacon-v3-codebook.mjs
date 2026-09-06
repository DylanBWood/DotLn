import { decodeBeaconSize, framedSize } from "./beacon-codebook.mjs";
import { CONTROL_CODEBOOK, encodeControlBeacon } from "./control-codebook.mjs";

// Individual family only. The phase-group family has its own directory/decoder.
export const BEACON_V3_CODEBOOK = /** @type {const} */ ({
  version: 3,
  inheritedVersion: 2,
  fieldOrder: [
    "phase",
    "latestVerdict",
    "effort",
    "provenance",
    "keyEpoch",
    "authenticator",
  ],
  phaseRadix: 8,
  verdictRadix: 3,
  effortRadix: 6,
  provenanceRadix: 2,
  epochRadix: 256,
  authenticatorRadix: 65536,
  versionRadix: 4,
  maxCode: "19327352831",
  maxLogicalBytes: "1236950589434",
  maxAllocatedBlocks: "8",
  maxPrefixBytes: 4096,
  padding: "sparse-zero-tail",
});
export const MAX_V3_CODE = 19327352831n;
export const MAX_V3_LOGICAL_BYTES = 1236950589434n;
export const MAX_V3_ALLOCATED_BLOCKS = 8n; // stat.blocks units are 512 bytes.

/** @typedef {Omit<import("./control-beacon.js").ControlBeaconState, "codebookVersion"> & {codebookVersion: 3, keyEpoch: number, authenticator: number}} BeaconV3State */
/** @typedef {{status: "decoded", state: BeaconV3State} | {status: "malformed"}} BeaconV3Decode */

/** @param {number} value @param {number} radix */
const digit = (value, radix) => {
  if (!Number.isInteger(value) || value < 0 || value >= radix)
    throw new Error("invalid beacon v3 digit");
  return BigInt(value);
};

/** @param {Omit<import("./control-beacon.js").ControlBeaconState, "codebookVersion">} state */
export function v2Ordinal(state) {
  const size = encodeControlBeacon({ ...state, codebookVersion: 2 });
  return (size - 8192n) / 64n / 4n;
}

/** @param {BeaconV3State} state */
export function encodeV3Beacon(state) {
  if (state.codebookVersion !== 3) throw new Error("invalid beacon v3 version");
  const code =
    ((v2Ordinal(state) * 256n + digit(state.keyEpoch, 256)) * 65536n +
      digit(state.authenticator, 65536)) *
      4n +
    3n;
  return framedSize(code);
}

/** Pure arithmetic only: a well-formed residue is not a verified residue.
 * @param {number | bigint} size @returns {BeaconV3Decode}
 */
export function decodeV3BeaconSize(size) {
  const framed = decodeBeaconSize(size);
  if (framed.status !== "unknown-codebook" || framed.codebookVersion !== 3)
    return { status: "malformed" };
  const code = (BigInt(size) - 8192n) / 64n;
  if (code > MAX_V3_CODE) return { status: "malformed" };
  let fields = code / 4n;
  const authenticator = Number(fields % 65536n);
  fields /= 65536n;
  const keyEpoch = Number(fields % 256n);
  fields /= 256n;
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
    state: {
      codebookVersion: 3,
      phase,
      latestVerdict,
      effort,
      provenance,
      keyEpoch,
      authenticator,
    },
  };
}
