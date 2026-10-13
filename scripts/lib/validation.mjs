// Shared structural predicates and diagnostics; each caller supplies its
// own path/error prefix so schema-specific refusals retain their wording.
export const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const isText = (value) =>
  typeof value === "string" &&
  value !== "" &&
  !/[\u0000-\u001f\u007f\u2028\u2029]/u.test(value);

export const requireKnownKeys = (value, known, label, refuse) => {
  for (const key of Object.keys(value))
    if (!known.includes(key))
      throw refuse(
        `unknown ${label} key ${JSON.stringify(key)}; known keys: ${known.join(", ")}`,
      );
};

export const firstDifferingLine = (expected, actual) => {
  const before = actual?.split("\n") ?? [];
  const after = expected.split("\n");
  const line = after.findIndex((value, index) => value !== before[index]);
  return line < 0 ? after.length + 1 : line + 1;
};
