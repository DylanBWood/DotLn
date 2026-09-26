// Shapes named by the build-free Beacon leaves' JSDoc contracts; this module
// has no runtime dependency. The leaves cannot import skeleton TypeScript, so
// the skeleton keeps its own declarations (beacon.ts, control-beacon.ts,
// execution-environment.ts). The codebook-backed unions here derive from the
// same codebook constants as the skeleton's, so their values cannot drift.
type ControlCodebook = typeof import("./control-codebook.mjs").CONTROL_CODEBOOK;
export type BeaconActionClass =
  | "work-order-dispatch"
  | "authority-decision"
  | "external-effect"
  | "result"
  | "verification"
  | "recovery"
  | "no-op";

export type BeaconProvenanceLabel =
  (typeof import("./beacon-codebook.mjs").BEACON_CODEBOOK.provenances)[number];

export interface BeaconState {
  readonly codebookVersion: 1;
  readonly actionClass: BeaconActionClass;
  readonly outcome: string;
  readonly refusalCount: number;
  readonly provenance: BeaconProvenanceLabel;
}

export type BeaconDecode =
  | { readonly status: "decoded"; readonly state: BeaconState }
  | { readonly status: "unknown-codebook"; readonly codebookVersion: number }
  | { readonly status: "malformed" };

export type ControlBeaconState = Readonly<{
  codebookVersion: 2;
  phase: ControlCodebook["phases"][number];
  latestVerdict: ControlCodebook["verdicts"][number];
  effort: ControlCodebook["efforts"][number];
  provenance: ControlCodebook["provenances"][number];
}>;

export type BeaconV3State = Omit<ControlBeaconState, "codebookVersion"> &
  Readonly<{
    codebookVersion: 3;
    keyEpoch: number;
    authenticator: number;
  }>;

export type SignalDecode =
  | Exclude<BeaconDecode, { status: "decoded" }>
  | Readonly<{
      status: "decoded";
      state: BeaconState | ControlBeaconState | BeaconV3State;
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

export interface BeaconMount {
  readonly mountId: string;
  readonly path: string;
  readonly access: "beacon-metadata";
  readonly family: "individual" | "phase-group";
  readonly addresses: readonly string[];
}
