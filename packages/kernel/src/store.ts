import type { DecodeResult, Event, EventEnvelope } from "./types.js";
export type JsonlLog = string;

const requiredFields = [
  "schemaVersion",
  "eventId",
  "type",
  "occurredAt",
  "actorId",
  "workstreamId",
  "payload",
] as const;
const optionalFields = ["episodeId", "correlationId", "causationId"] as const;
const envelopeFields = new Set<string>([...requiredFields, ...optionalFields]);
const fieldPath = (parent: string, key: string) =>
  /^[A-Za-z_$][\w$]*$/.test(key)
    ? `${parent}.${key}`
    : `${parent}[${JSON.stringify(key)}]`;

/** Schema 1 envelope validation; payload meaning remains the reactor's concern. */
export function tryDecodeLog(log: JsonlLog): DecodeResult<readonly Event[]> {
  const failure = (
    line: number,
    code: string,
    path: string,
    detail: string,
  ): DecodeResult<never> => ({
    ok: false,
    code,
    path,
    message: `Malformed JSONL at line ${line}: ${detail} (${code} at ${path})`,
  });
  if (log === "") return { ok: true, value: [] };
  if (!log.endsWith("\n"))
    return failure(
      log.split("\n").length,
      "MISSING_NEWLINE",
      "$",
      "missing final newline",
    );

  const events: Event[] = [];
  const lines = log.slice(0, -1).split("\n");
  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 1;
    if (line.trim() === "")
      return failure(
        lineNumber,
        "EXPECTED_OBJECT",
        "$",
        "expected a JSON object",
      );
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      return failure(lineNumber, "INVALID_JSON", "$", "invalid JSON");
    }
    if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object")
      return failure(
        lineNumber,
        "EXPECTED_OBJECT",
        "$",
        "expected a JSON object",
      );
    const record = parsed as Record<string, unknown>;
    for (const key of Object.keys(record))
      if (!envelopeFields.has(key))
        return failure(
          lineNumber,
          "UNKNOWN_FIELD",
          fieldPath("$", key),
          "unknown envelope field",
        );
    for (const key of requiredFields)
      if (!Object.hasOwn(record, key))
        return failure(
          lineNumber,
          "MISSING_FIELD",
          `$.${key}`,
          "missing required field",
        );
    if (record.schemaVersion !== 1)
      return failure(
        lineNumber,
        "UNSUPPORTED_SCHEMA",
        "$.schemaVersion",
        "expected schema version 1",
      );
    for (const key of [
      "eventId",
      "type",
      "actorId",
      "workstreamId",
      ...optionalFields,
    ])
      if (Object.hasOwn(record, key) && typeof record[key] !== "string")
        return failure(
          lineNumber,
          "EXPECTED_STRING",
          `$.${key}`,
          "expected a string",
        );
    if (record.eventId !== `evt_${lineNumber}`)
      return failure(
        lineNumber,
        "EVENT_ORDER",
        "$.eventId",
        `expected evt_${lineNumber}`,
      );
    if (typeof record.occurredAt !== "number")
      return failure(
        lineNumber,
        "EXPECTED_NUMBER",
        "$.occurredAt",
        "expected a number",
      );
    if (!Number.isFinite(record.occurredAt))
      return failure(
        lineNumber,
        "EXPECTED_FINITE_NUMBER",
        "$.occurredAt",
        "expected a finite number",
      );

    // JSON.parse excludes non-JSON types, but accepts numeric overflow.
    // A stack keeps deeply nested valid JSON from exhausting the call stack.
    const pending: { value: unknown; path: string }[] = [
      { value: record.payload, path: "$.payload" },
    ];
    while (pending.length) {
      const { value, path } = pending.pop()!;
      if (typeof value === "number" && !Number.isFinite(value))
        return failure(
          lineNumber,
          "NON_JSON_NUMBER",
          path,
          "expected a finite JSON number",
        );
      if (Array.isArray(value)) {
        for (let i = value.length - 1; i >= 0; i--)
          pending.push({ value: value[i], path: `${path}[${i}]` });
      } else if (value !== null && typeof value === "object") {
        for (const [key, child] of Object.entries(value).reverse())
          pending.push({ value: child, path: fieldPath(path, key) });
      }
    }
    events.push(record as unknown as Event);
  }
  return { ok: true, value: events };
}

export function appendEvent(
  log: JsonlLog,
  event: Omit<EventEnvelope, "eventId">,
): { readonly log: JsonlLog; readonly event: Event } {
  const eventId = `evt_${decodeLog(log).length + 1}`;
  const assigned = { ...event, eventId } as Event;
  return { log: `${log}${JSON.stringify(assigned)}\n`, event: assigned };
}
export function decodeLog(log: JsonlLog): readonly Event[] {
  const result = tryDecodeLog(log);
  if (!result.ok) throw new Error(result.message);
  return result.value;
}
export function encodeLog(events: readonly Event[]): JsonlLog {
  return (
    events.map((event) => JSON.stringify(event)).join("\n") +
    (events.length ? "\n" : "")
  );
}
