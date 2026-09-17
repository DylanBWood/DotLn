import { recordPresenceObservation } from "./resident-store.js";
import { type PresenceHookEvent } from "./presence-signals.js";

/** Installed profiles have no observed typed/scripted prompt discriminator
 * (WO-044 C-W10 / X-W10). A binding is explicit local host configuration. */
export async function recordHarnessHeartbeat(
  event: PresenceHookEvent,
  input: unknown,
  environment: Readonly<Record<string, string | undefined>> = process.env,
  now = Date.now,
) {
  const directory = environment["DOTLN_RESIDENT_STORE"];
  if (!directory) return;
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("heartbeat requires hook input");
  const source = input as Record<string, unknown>;
  if (
    source["hook_event_name"] !== event ||
    typeof source["session_id"] !== "string"
  )
    throw new Error("heartbeat requires matching event and session");
  const episodeId = environment["DOTLN_RESIDENT_EPISODE_ID"];
  await recordPresenceObservation(
    directory,
    {
      kind: "heartbeat",
      event,
      sessionId: source["session_id"],
      interaction: "unknown",
    },
    episodeId === undefined ? undefined : { episodeId },
    now,
  );
}
