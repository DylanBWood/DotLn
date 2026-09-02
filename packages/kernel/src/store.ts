import type { Event, EventEnvelope } from "./types.js";
export type JsonlLog = string;
export function appendEvent(
  log: JsonlLog,
  event: Omit<EventEnvelope, "eventId">,
): { readonly log: JsonlLog; readonly event: Event } {
  const eventId = `evt_${log === "" ? 1 : log.trimEnd().split("\n").length + 1}`;
  const assigned = { ...event, eventId } as Event;
  return { log: `${log}${JSON.stringify(assigned)}\n`, event: assigned };
}
export function decodeLog(log: JsonlLog): readonly Event[] {
  return log.trim() === ""
    ? []
    : log
        .trimEnd()
        .split("\n")
        .map((line) => JSON.parse(line) as Event);
}
export function encodeLog(events: readonly Event[]): JsonlLog {
  return (
    events.map((event) => JSON.stringify(event)).join("\n") +
    (events.length ? "\n" : "")
  );
}
