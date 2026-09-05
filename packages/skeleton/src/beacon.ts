import type { Event } from "@dotln/kernel";
import {
  projectAuditEvents,
  type AuditActionClass,
  type L0ReceiptEntry,
} from "./audit.js";

import { BEACON_CODEBOOK, encodeBeaconState } from "./beacon-codebook.mjs";
export {
  BEACON_CODEBOOK,
  encodeBeaconState,
  decodeBeaconSize,
} from "./beacon-codebook.mjs";

export type BeaconProvenance = (typeof BEACON_CODEBOOK.provenances)[number];

export interface BeaconState {
  readonly codebookVersion: 1;
  readonly actionClass: AuditActionClass;
  readonly outcome: string;
  readonly refusalCount: number;
  readonly provenance: BeaconProvenance;
}

export interface BeaconScope {
  readonly workstreamId: string;
  readonly episodeId: string;
}

export interface BeaconProjectionRecord {
  readonly recordType: "beacon-projection";
  readonly codebookVersion: 1;
  readonly provenance: "host-projected";
  readonly refusalCount: number;
  readonly receipt: L0ReceiptEntry;
}

export interface BeaconClaimRecord extends BeaconState {
  readonly recordType: "beacon-claim";
  readonly provenance: "self-reported";
  readonly scope: BeaconScope;
  readonly actor: string;
  readonly claimedAt: number;
}

export type BeaconRecord = BeaconProjectionRecord | BeaconClaimRecord;
export type BeaconDecode =
  | { readonly status: "decoded"; readonly state: BeaconState }
  | { readonly status: "unknown-codebook"; readonly codebookVersion: number }
  | { readonly status: "malformed" };

export function deriveBeaconProjections(
  events: readonly Event[],
): readonly BeaconProjectionRecord[] {
  const episodes = new Map<string, BeaconProjectionRecord>();
  const receipts = projectAuditEvents(events).receipt.receipts;
  for (const receipt of receipts) {
    if (receipt.scope.episodeId === undefined) continue;
    const key = JSON.stringify([
      receipt.scope.workstreamId,
      receipt.scope.episodeId,
    ]);
    const denied =
      receipt.actionClass === "authority-decision" &&
      receipt.outcome === "denied";
    const refusalCount = Math.min(
      3,
      (episodes.get(key)?.refusalCount ?? 0) + Number(denied),
    );
    episodes.set(key, {
      recordType: "beacon-projection",
      codebookVersion: 1,
      provenance: "host-projected",
      refusalCount,
      receipt,
    });
  }
  return [...episodes.values()];
}

export function beaconScope(record: BeaconRecord): BeaconScope {
  const scope =
    record.recordType === "beacon-projection"
      ? record.receipt.scope
      : record.scope;
  if (!scope.workstreamId || !scope.episodeId)
    throw new Error("a beacon requires a workstream and episode");
  return { workstreamId: scope.workstreamId, episodeId: scope.episodeId };
}

export interface EncodedBeacon {
  readonly size: number;
  readonly mtimeMs: number;
  readonly content: string;
}

export function encodeBeacon(record: BeaconRecord): EncodedBeacon {
  beaconScope(record);
  const host = record.recordType === "beacon-projection";
  if (record.provenance !== (host ? "host-projected" : "self-reported"))
    throw new Error("beacon record and provenance disagree");
  const state: BeaconState = {
    codebookVersion: record.codebookVersion,
    actionClass: host ? record.receipt.actionClass : record.actionClass,
    outcome: host ? record.receipt.outcome : record.outcome,
    refusalCount: record.refusalCount,
    provenance: record.provenance,
  };
  const size = encodeBeaconState(state);
  const mtimeMs = host ? record.receipt.time : record.claimedAt;
  if (!Number.isSafeInteger(mtimeMs) || mtimeMs < 0 || mtimeMs > 8.64e15)
    throw new Error(
      "beacon mtime must be a representable nonnegative integer millisecond",
    );
  const json = JSON.stringify(record);
  const bytes = new TextEncoder().encode(json).length;
  if (bytes >= size) throw new Error("beacon record exceeds its codeword size");
  return { size, mtimeMs, content: json + "\n".repeat(size - bytes) };
}
