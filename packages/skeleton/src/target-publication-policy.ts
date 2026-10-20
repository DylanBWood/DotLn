import { authorize } from "@dotln/kernel";
import type { AuthorityEnvelope } from "@dotln/compiler";

export const TARGET_PUBLICATION_EFFECTS = ["repo.push", "pr.open"] as const;

// The host supplies the observed profile and time; this judgment has no IO.
export function targetPublicationRefusal(
  profile: AuthorityEnvelope,
  workstreamId: string,
  now: number,
): string | null {
  for (const [intentIndex, effect] of TARGET_PUBLICATION_EFFECTS.entries()) {
    const decision = authorize({ kind: "Act", effect, payload: {} }, profile, {
      now,
      actorId: "target-publish-host",
      workstreamId,
      decisionIndex: 0,
      intentIndex,
      evidence: [],
      revokedBy: [],
    });
    if (!decision.authorized)
      return `${effect}: ${decision.refusal.payload.reason}`;
  }
  return null;
}
