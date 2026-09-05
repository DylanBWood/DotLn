import type { Event } from "@dotln/kernel";
import {
  projectAuditEvents,
  type AuditActionClass,
  type L0ReceiptEntry,
} from "./audit.js";

// Normative data: docs/product/02-domain-model.md, Beacon codebook v1.
export const BEACON_CODEBOOK = {
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
} as const;

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

const book = BEACON_CODEBOOK;
const V1_FRAME_CODE_LIMIT =
  book.classes.length *
  book.outcomeRadix *
  book.refusalRadix *
  book.provenances.length *
  book.versionRadix;

const framedSize = (code: bigint): bigint =>
  BigInt(book.base) +
  code * BigInt(book.stride) +
  ((code * BigInt(book.checkMultiplier) + BigInt(book.checkOffset)) %
    BigInt(book.stride));

export function encodeBeaconState(state: BeaconState): number {
  const action = book.classes.findIndex(([name]) => name === state.actionClass);
  const outcomes: readonly string[] = book.classes[action]?.[1] ?? [];
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

export function decodeBeaconSize(size: number | bigint): BeaconDecode {
  const malformed = { status: "malformed" } as const;
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
  const provenance = book.provenances[fields % book.provenances.length]!;
  fields = Math.floor(fields / book.provenances.length);
  const refusalCount = fields % book.refusalRadix;
  fields = Math.floor(fields / book.refusalRadix);
  const outcomeRank = fields % book.outcomeRadix;
  const [actionClass, outcomes] =
    book.classes[Math.floor(fields / book.outcomeRadix)]!;
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
