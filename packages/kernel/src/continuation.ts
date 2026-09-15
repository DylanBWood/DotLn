import type { DecodeResult, ExecutableProgramV1 } from "./types.js";

type Shape = Readonly<Record<string, string>>;
const fieldPath = (parent: string, key: string) =>
  /^[A-Za-z_$][\w$]*$/.test(key)
    ? `${parent}.${key}`
    : `${parent}[${JSON.stringify(key)}]`;
class InvalidContinuation extends Error {
  constructor(readonly result: Extract<DecodeResult<never>, { ok: false }>) {
    super(result.message);
  }
}
function refuse(code: string, path: string, detail: string): never {
  throw new InvalidContinuation({
    ok: false,
    code,
    path,
    message: `Invalid continuation: ${detail} (${code} at ${path})`,
  });
}

const programShapes: Readonly<Record<string, Shape>> = {
  Done: {},
  Emit: { event: "event", next: "program" },
  Invoke: {
    commandId: "string",
    command: "command",
    continuationByResult: "programMap",
  },
  Await: { pattern: "pattern", timeout: "cadence", next: "program" },
  Guard: {
    conditionRef: "predicate",
    whenTrue: "program",
    whenFalse: "program",
  },
  Sequence: { programs: "program[]" },
};
const cadenceShapes: Readonly<Record<string, Shape>> = {
  Once: { at: "number" },
  After: { delayMs: "number" },
  Every: { intervalMs: "number", startAt: "number?" },
  Burst: { count: "number", intervalMs: "number" },
  Calendar: { expression: "string", timezone: "string" },
  Window: { cadence: "cadence", start: "number", end: "number" },
  While: { cadence: "cadence", conditionRef: "predicate" },
  Until: { cadence: "cadence", conditionRef: "predicate" },
  Gate: { cadence: "cadence", conditionRef: "predicate" },
  Sequence: { cadences: "cadence[]" },
  Merge: { cadences: "cadence[]" },
  Race: { cadences: "cadence[]" },
  Repeat: { cadence: "cadence", count: "number" },
  Backoff: {
    initialMs: "number",
    factor: "number",
    maxMs: "number",
    attempt: "number",
    jitter: "number",
  },
};
const shapes: Readonly<Record<string, Shape>> = {
  event: {
    schemaVersion: "schema1",
    type: "string",
    occurredAt: "number",
    actorId: "string",
    workstreamId: "string",
    payload: "json",
    episodeId: "string?",
    correlationId: "string?",
    causationId: "string?",
  },
  command: {
    kind: "act",
    effect: "string",
    resource: "string?",
    payload: "json",
  },
  pattern: { type: "string", correlationId: "string?", commandId: "string?" },
  predicate: { registryId: "string", version: "number", params: "jsonObject?" },
};

/** Check parsed values too: stringify must not erase closures, holes or accessors. */
function validateJson(value: unknown): void {
  const active = new Set<object>();
  const pending: { value: unknown; path: string; leave?: boolean }[] = [
    { value, path: "$" },
  ];
  while (pending.length) {
    const item = pending.pop()!;
    const { value: child, path } = item;
    if (
      child === null ||
      typeof child === "string" ||
      typeof child === "boolean"
    )
      continue;
    if (typeof child === "number") {
      if (!Number.isFinite(child))
        refuse("NON_JSON_NUMBER", path, "expected a finite JSON number");
      continue;
    }
    if (typeof child !== "object")
      refuse("NON_JSON_VALUE", path, "expected JSON data");
    if (item.leave) {
      active.delete(child);
      continue;
    }
    if (active.has(child)) refuse("CYCLIC_VALUE", path, "cyclic JSON data");
    const array = Array.isArray(child);
    const prototype = Object.getPrototypeOf(child);
    if (
      array
        ? prototype !== Array.prototype
        : prototype !== Object.prototype && prototype !== null
    )
      refuse("NON_JSON_OBJECT", path, "expected a plain JSON object");
    active.add(child);
    pending.push({ value: child, path, leave: true });
    const descriptors = Object.getOwnPropertyDescriptors(child);
    if (array) {
      for (let i = 0; i < child.length; i++)
        if (!Object.hasOwn(descriptors, String(i)))
          refuse("NON_JSON_VALUE", `${path}[${i}]`, "array hole");
    }
    for (const key of Reflect.ownKeys(descriptors).reverse()) {
      if (array && key === "length") continue;
      if (typeof key !== "string")
        refuse("NON_JSON_VALUE", path, "symbol property");
      const at =
        array && /^(0|[1-9]\d*)$/.test(key)
          ? `${path}[${key}]`
          : fieldPath(path, key);
      const descriptor = descriptors[key]!;
      if (!descriptor.enumerable || !Object.hasOwn(descriptor, "value"))
        refuse("NON_JSON_VALUE", at, "expected an enumerable data property");
      if (array && (!/^(0|[1-9]\d*)$/.test(key) || Number(key) >= child.length))
        refuse("NON_JSON_VALUE", at, "unexpected array property");
      pending.push({ value: descriptor.value, path: at });
    }
  }
}

/** Decode serialized or parsed persisted data before it enters the stepper. */
export function decodeContinuation(
  value: unknown,
): DecodeResult<ExecutableProgramV1> {
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return {
        ok: false,
        code: "INVALID_JSON",
        path: "$",
        message: "Invalid continuation: invalid JSON (INVALID_JSON at $)",
      };
    }
  }
  try {
    validateJson(parsed);
    const pending = [{ value: parsed, path: "$", type: "program" }];
    while (pending.length) {
      const { value: child, path, type } = pending.pop()!;
      if (type === "json") continue;
      if (type === "string" || type === "number") {
        if (typeof child !== type)
          refuse(`EXPECTED_${type.toUpperCase()}`, path, `expected a ${type}`);
        continue;
      }
      if (type === "schema1" || type === "act") {
        if (child !== (type === "schema1" ? 1 : "Act"))
          refuse(
            "INVALID_LITERAL",
            path,
            `expected ${type === "schema1" ? "schema version 1" : "Act"}`,
          );
        continue;
      }
      if (type.endsWith("[]")) {
        if (!Array.isArray(child))
          refuse("EXPECTED_ARRAY", path, "expected an array");
        for (let i = child.length - 1; i >= 0; i--)
          pending.push({
            value: child[i],
            path: `${path}[${i}]`,
            type: type.slice(0, -2),
          });
        continue;
      }
      if (child === null || typeof child !== "object" || Array.isArray(child))
        refuse("EXPECTED_OBJECT", path, "expected an object");
      const record = child as Record<string, unknown>;
      if (type === "jsonObject") continue;
      if (type === "programMap") {
        for (const [key, branch] of Object.entries(record).reverse())
          pending.push({
            value: branch,
            path: fieldPath(path, key),
            type: "program",
          });
        continue;
      }
      let shape: Shape;
      if (type === "program" || type === "cadence") {
        if (!Object.hasOwn(record, "kind"))
          refuse("MISSING_FIELD", `${path}.kind`, "missing required field");
        if (typeof record.kind !== "string")
          refuse("EXPECTED_STRING", `${path}.kind`, "expected a string");
        const choices = type === "program" ? programShapes : cadenceShapes;
        if (!Object.hasOwn(choices, record.kind)) {
          const deferred =
            type === "program" &&
            ["Choose", "All", "Race", "Repeat", "Compensate"].includes(
              record.kind,
            );
          refuse(
            deferred ? "DEFERRED_PROGRAM_KIND" : "UNKNOWN_KIND",
            `${path}.kind`,
            `${type} ${record.kind} ${deferred ? "evaluation is deferred" : "is unknown"}`,
          );
        }
        shape = { kind: "string", ...choices[record.kind] };
      } else shape = shapes[type]!;
      for (const key of Object.keys(record))
        if (!Object.hasOwn(shape, key))
          refuse("UNKNOWN_FIELD", fieldPath(path, key), "unknown field");
      for (const [key, expected] of Object.entries(shape).reverse()) {
        if (!Object.hasOwn(record, key)) {
          if (expected.endsWith("?")) continue;
          refuse(
            "MISSING_FIELD",
            fieldPath(path, key),
            "missing required field",
          );
        }
        pending.push({
          value: record[key],
          path: fieldPath(path, key),
          type: expected.replace(/\?$/, ""),
        });
      }
    }
    return { ok: true, value: parsed as ExecutableProgramV1 };
  } catch (error) {
    if (error instanceof InvalidContinuation) return error.result;
    return {
      ok: false,
      code: "NON_JSON_VALUE",
      path: "$",
      message:
        "Invalid continuation: unreadable JSON data (NON_JSON_VALUE at $)",
    };
  }
}
