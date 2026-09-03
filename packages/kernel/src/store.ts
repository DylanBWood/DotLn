import type { Event, EventEnvelope } from "./types.js";
export type JsonlLog = string;

const malformedLine = (lineNumber: number, detail: string): Error =>
  new Error(`Malformed JSONL at line ${lineNumber}: ${detail}`);

function parseLog(log: JsonlLog): readonly Event[] {
  if (log === "") return [];
  if (!log.endsWith("\n"))
    throw malformedLine(log.split("\n").length, "missing final newline");

  return log
    .slice(0, -1)
    .split("\n")
    .map((line, index) => {
      const lineNumber = index + 1;
      if (line.trim() === "")
        throw malformedLine(lineNumber, "expected a JSON object");
      let parsed: unknown;
      try {
        parsed = JSON.parse(line);
      } catch {
        throw malformedLine(lineNumber, "invalid JSON");
      }
      if (
        parsed === null ||
        Array.isArray(parsed) ||
        typeof parsed !== "object"
      )
        throw malformedLine(lineNumber, "expected a JSON object");
      return parsed as Event;
    });
}

export function appendEvent(
  log: JsonlLog,
  event: Omit<EventEnvelope, "eventId">,
): { readonly log: JsonlLog; readonly event: Event } {
  const eventId = `evt_${parseLog(log).length + 1}`;
  const assigned = { ...event, eventId } as Event;
  return { log: `${log}${JSON.stringify(assigned)}\n`, event: assigned };
}
export function decodeLog(log: JsonlLog): readonly Event[] {
  return parseLog(log);
}
export function encodeLog(events: readonly Event[]): JsonlLog {
  return (
    events.map((event) => JSON.stringify(event)).join("\n") +
    (events.length ? "\n" : "")
  );
}
