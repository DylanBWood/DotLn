import { canonicalStringify, type ArtifactIdentityV1 } from "@dotln/compiler";
import type { Event, JsonValue } from "@dotln/kernel";
import {
  artifactIdentityInputs,
  isArtifactIdentityV1,
  isArtifactRefusalPayload,
  isArtifactRefusalType,
  type ArtifactDriftField,
} from "./artifact-identity.js";

export interface ArtifactIdentityReceipt {
  readonly eventId: string;
  readonly eventType: string;
  readonly status: "matched" | "unverified" | "unavailable" | "refused";
  readonly evidenceLinks: readonly string[];
  readonly identity: Readonly<{
    semanticHash: string;
    compilerContractVersion: string;
    compilerPackageVersion: string;
    componentDefinitionCount: number;
  }> | null;
  readonly reason: string;
  readonly drift: readonly ArtifactDriftField[];
  readonly diagnosticCodes: readonly string[];
}

export interface ArtifactIdentityProjection {
  readonly assurance: "deterministic-content-equality-only";
  readonly availability: "recorded" | "unavailable";
  readonly records: readonly ArtifactIdentityReceipt[];
  readonly limitations: readonly string[];
}

const object = (
  value: JsonValue | undefined,
): Readonly<Record<string, JsonValue>> | undefined =>
  value !== null &&
  value !== undefined &&
  typeof value === "object" &&
  !Array.isArray(value)
    ? (value as Readonly<Record<string, JsonValue>>)
    : undefined;
const summary = (
  identity: ArtifactIdentityV1 | null,
): ArtifactIdentityReceipt["identity"] =>
  identity === null
    ? null
    : {
        semanticHash: identity.semanticHash,
        compilerContractVersion: identity.compilerContractVersion,
        compilerPackageVersion: identity.compilerPackageVersion,
        componentDefinitionCount: identity.componentDefinitions.length,
      };

/** Projection only: a recorded comparison is evidence of agreement, never authenticity. */
export const projectArtifactIdentities = (
  events: readonly Event[],
): ArtifactIdentityProjection => {
  const records: ArtifactIdentityReceipt[] = [];
  for (const event of events) {
    if (event.type === "LoadoutEquipped") {
      const payload = object(event.payload);
      const legacy =
        payload !== undefined && !Object.hasOwn(payload, "payloadVersion");
      const identity =
        payload?.["payloadVersion"] === 2 &&
        isArtifactIdentityV1(payload["artifactIdentity"])
          ? payload["artifactIdentity"]
          : null;
      const comparison =
        identity === null
          ? undefined
          : events.find((candidate) => {
              const trace = object(object(candidate.payload)?.["trace"]);
              return (
                candidate.type === "DecisionRecorded" &&
                candidate.causationId === event.eventId &&
                candidate.workstreamId === event.workstreamId &&
                candidate.episodeId === event.episodeId &&
                trace?.["reactorId"] === "seiri-reactor" &&
                trace["reactorVersion"] === "1" &&
                canonicalStringify(trace["branchPath"]) ===
                  '["LoadoutEquipped","equipped"]' &&
                canonicalStringify(trace["envInputs"]) ===
                  canonicalStringify([
                    "event",
                    ...artifactIdentityInputs(identity, event.eventId),
                  ])
              );
            });
      records.push({
        eventId: event.eventId,
        eventType: event.type,
        status: legacy
          ? "unavailable"
          : comparison === undefined
            ? "unverified"
            : "matched",
        evidenceLinks: [
          event.eventId,
          ...(comparison === undefined ? [] : [comparison.eventId]),
        ].map((id) => `event:${id}`),
        identity: summary(identity),
        reason: legacy
          ? "historical artifact identity unavailable"
          : comparison === undefined
            ? "equip claim has no recorded successful comparison"
            : "equip recomputation matched the pin",
        drift: [],
        diagnosticCodes: [],
      });
    } else if (isArtifactRefusalType(event.type)) {
      if (!isArtifactRefusalPayload(event.payload))
        throw new Error(
          `invalid audit source ${event.eventId} ${event.type}: malformed artifact refusal`,
        );
      const payload = event.payload;
      const references = [
        payload.sourceEventId,
        payload.equippedEventId,
      ].filter((id): id is string => id !== null);
      for (const id of references)
        if (
          !events.some(
            (candidate) =>
              candidate.eventId === id &&
              candidate.workstreamId === event.workstreamId &&
              candidate.episodeId === event.episodeId,
          )
        )
          throw new Error(
            `invalid audit source ${event.eventId} ${event.type}: missing scoped reference ${id}`,
          );
      const decisions = events.filter(
        (candidate) =>
          candidate.type === "DecisionRecorded" &&
          candidate.causationId === (payload.sourceEventId ?? event.eventId) &&
          candidate.workstreamId === event.workstreamId &&
          candidate.episodeId === event.episodeId,
      );
      records.push({
        eventId: event.eventId,
        eventType: event.type,
        status: "refused",
        evidenceLinks: [
          ...new Set([
            ...references,
            ...decisions.map((decision) => decision.eventId),
            event.eventId,
          ]),
        ].map((id) => `event:${id}`),
        identity: summary(payload.pinnedIdentity),
        reason: payload.reason,
        drift: payload.drift,
        diagnosticCodes: payload.diagnostics.map(
          (diagnostic) => diagnostic.code,
        ),
      });
    }
  }
  return {
    assurance: "deterministic-content-equality-only",
    availability: records.length === 0 ? "unavailable" : "recorded",
    records,
    limitations: [
      "FNV equality is not cryptographic integrity, collision resistance, or authenticity",
      "graph and pin can be rewritten together; hidden adapter effects are not excluded",
      "outer confinement evidence is separate and not collected by this receipt",
      "a queued pulse has no artifact stamp; a reused schedule id does not prove its equip of origin",
    ],
  };
};

/** Preserve the authority trace grammar while admitting exactly the v1 pin suffix. */
export const withoutArtifactIdentityInputs = (
  inputs: readonly string[],
): readonly string[] | undefined => {
  const start = inputs.findIndex((input) =>
    input.startsWith("artifactIdentity."),
  );
  if (start === -1) return inputs;
  const suffix = inputs.slice(start);
  return suffix.length === 4 &&
    /^artifactIdentity\.semanticHash:fnv1a64:[0-9a-f]{16}$/u.test(suffix[0]!) &&
    /^artifactIdentity\.compilerContractVersion:\S+$/u.test(suffix[1]!) &&
    /^artifactIdentity\.compilerPackageVersion:\S+$/u.test(suffix[2]!) &&
    /^artifactIdentity\.equippedEventId:\S+$/u.test(suffix[3]!)
    ? inputs.slice(0, start)
    : undefined;
};
