import { object } from "../src/values.js";

// A bounded, dependency-free JSON Schema checker for this schema's declared
// vocabulary. It tests the interchange, including serialized null/array values,
// independently from the TypeScript interfaces used by the implementation.
export function schemaMatches(
  value: unknown,
  raw: unknown,
  rootSchema: Record<string, unknown>,
): boolean {
  const schema = object(raw);
  if (schema["$ref"])
    return schemaMatches(
      value,
      object(rootSchema["$defs"])[String(schema["$ref"]).split("/").at(-1)!],
      rootSchema,
    );
  if (
    Object.hasOwn(schema, "const") &&
    JSON.stringify(value) !== JSON.stringify(schema["const"])
  )
    return false;
  if (
    Array.isArray(schema["enum"]) &&
    !schema["enum"].some(
      (entry) => JSON.stringify(entry) === JSON.stringify(value),
    )
  )
    return false;
  if (
    Array.isArray(schema["anyOf"]) &&
    !schema["anyOf"].some((entry) => schemaMatches(value, entry, rootSchema))
  )
    return false;
  if (
    Array.isArray(schema["allOf"]) &&
    !schema["allOf"].every((entry) => schemaMatches(value, entry, rootSchema))
  )
    return false;
  if (
    schema["if"] &&
    !schemaMatches(
      value,
      schemaMatches(value, schema["if"], rootSchema)
        ? schema["then"]
        : schema["else"],
      rootSchema,
    )
  )
    return false;
  const kind =
    value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
  if (
    schema["type"] &&
    !(
      Array.isArray(schema["type"]) ? schema["type"] : [schema["type"]]
    ).includes(kind)
  )
    return false;
  if (typeof value === "string") {
    if (
      typeof schema["minLength"] === "number" &&
      value.length < schema["minLength"]
    )
      return false;
    if (
      typeof schema["pattern"] === "string" &&
      !new RegExp(schema["pattern"], "u").test(value)
    )
      return false;
  }
  if (Array.isArray(value)) {
    if (
      (typeof schema["minItems"] === "number" &&
        value.length < schema["minItems"]) ||
      (typeof schema["maxItems"] === "number" &&
        value.length > schema["maxItems"])
    )
      return false;
    if (
      schema["uniqueItems"] &&
      new Set(value.map((entry) => JSON.stringify(entry))).size !== value.length
    )
      return false;
    if (
      schema["items"] &&
      !value.every((entry) => schemaMatches(entry, schema["items"], rootSchema))
    )
      return false;
  }
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    if (
      Array.isArray(schema["required"]) &&
      !schema["required"].every(
        (key) => typeof key === "string" && Object.hasOwn(record, key),
      )
    )
      return false;
    const properties = schema["properties"] ? object(schema["properties"]) : {};
    for (const [key, item] of Object.entries(record)) {
      if (Object.hasOwn(properties, key)) {
        if (!schemaMatches(item, properties[key], rootSchema)) return false;
      } else if (schema["additionalProperties"] === false) return false;
    }
  }
  return true;
}
