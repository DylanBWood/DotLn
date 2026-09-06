import type { BeaconDecode, BeaconState } from "./beacon.js";
import type { CONTROL_CODEBOOK } from "./control-codebook.mjs";
import type { AuthorityEnvelope, Event, ObserveIntent } from "@dotln/kernel";

export type ControlBeaconState = Readonly<{
  codebookVersion: 2;
  phase: (typeof CONTROL_CODEBOOK.phases)[number];
  latestVerdict: (typeof CONTROL_CODEBOOK.verdicts)[number];
  effort: (typeof CONTROL_CODEBOOK.efforts)[number];
  provenance: (typeof CONTROL_CODEBOOK.provenances)[number];
}>;
export type SignalDecode =
  | Exclude<BeaconDecode, { status: "decoded" }>
  | Readonly<{
      status: "decoded";
      state:
        | Readonly<{ [K in keyof BeaconState]: BeaconState[K] }>
        | ControlBeaconState
        | import("./beacon-v3-codebook.mjs").BeaconV3State;
    }>;
export type GroupDecode =
  | Readonly<{ status: "malformed" }>
  | Readonly<{
      status: "decoded";
      state: Readonly<{ groupCodebookVersion: 1; counts: readonly number[] }>;
    }>;
export type SignalObservation = Readonly<{
  address: string;
  size: string | null;
  mtimeMs: number | null;
  mtimeNs?: string | null;
  decoded: SignalDecode | Readonly<{ status: "absent" }>;
  provenanceCheck?: import("./beacon-provenance.mjs").ProvenanceCheck;
  fineSpectrum?: "sensed" | "not-sensed";
}>;
export type BeaconAge =
  | "fresh"
  | "stale"
  | "absent"
  | "clock-skew"
  | "malformed"
  | "unknown-codebook";
export type JudgedBeacon = SignalObservation & Readonly<{ age: BeaconAge }>;
export type GroupObservation = Omit<SignalObservation, "decoded"> &
  Readonly<{ decoded: GroupDecode | Readonly<{ status: "absent" }> }>;

export type ControlProjectionRecord = ControlBeaconState &
  Readonly<{
    recordType: "control-beacon-projection";
    provenance: "host-projected";
    workOrderId: string;
    recordedAt: string;
  }>;
export type BeaconWorktree = Readonly<{ worktree: string; branch?: string }>;
export type BeaconSweepRequest = Readonly<{
  intent: ObserveIntent;
  audience: "public" | "verifier";
  authority: AuthorityEnvelope;
  evidence: readonly string[];
  revokedBy: readonly Event[];
  staleAfterMs: number;
  senses?: readonly import("@dotln/compiler").SenseId[];
  environment?: import("./execution-environment.js").BeaconPerceptionProfile;
}>;

export function renderBeaconGlyphs(
  observations: readonly JudgedBeacon[],
): string {
  return observations
    .map(({ address, age }) => {
      const glyph =
        age === "stale"
          ? "◌ blurred/stale"
          : age === "absent"
            ? "○ absent"
            : age === "clock-skew"
              ? "⚑ flagged/clock-skew"
              : age === "malformed"
                ? "⚑ flagged/malformed"
                : age === "unknown-codebook"
                  ? "⚑ flagged/unknown-codebook"
                  : "✦ fresh";
      return `${glyph} ${address}`;
    })
    .join("  ");
}
