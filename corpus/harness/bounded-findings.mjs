import { AssertionError } from "node:assert";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { createRequire } from "node:module";

export const FINDINGS_LIMIT = 32;
// The sweep domain is plain records/arrays and scalar values. Type tags make
// special numbers distinct from both null and lookalike user objects; sorted
// keys make equivalent records canonical. Refuse unsupported structures rather
// than silently weaken the replaced structural comparison.
function canonicalValue(value) {
  if (value === null) return ["null"];
  const type = typeof value;
  if (type === "number")
    return [type, Object.is(value, -0) ? "-0" : String(value)];
  if (type === "undefined") return [type];
  if (type === "string" || type === "boolean") return [type, value];
  if (type === "bigint") return [type, String(value)];
  if (
    type !== "object" ||
    Object.getOwnPropertySymbols(value).some((symbol) =>
      Object.prototype.propertyIsEnumerable.call(value, symbol),
    )
  )
    throw new TypeError("Unsupported value in bounded findings");
  const prototype = Object.getPrototypeOf(value);
  if (Array.isArray(value)) {
    if (
      prototype !== Array.prototype ||
      Object.keys(value).some(
        (key) => !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= value.length,
      )
    )
      throw new TypeError("Unsupported array in bounded findings");
    return [
      "array",
      Array.from({ length: value.length }, (_, index) =>
        Object.hasOwn(value, index) ? canonicalValue(value[index]) : ["hole"],
      ),
    ];
  }
  if (prototype !== Object.prototype && prototype !== null)
    throw new TypeError("Unsupported object in bounded findings");
  return [
    "object",
    prototype === null ? "null" : "plain",
    Object.keys(value)
      .sort()
      .map((key) => [key, canonicalValue(value[key])]),
  ];
}
const displayNumber = (_key, value) =>
  typeof value === "number" && (!Number.isFinite(value) || Object.is(value, -0))
    ? { $number: Object.is(value, -0) ? "-0" : String(value) }
    : value;

export function findingsCollector({
  numbered = false,
  limit = FINDINGS_LIMIT,
} = {}) {
  if (!Number.isSafeInteger(limit) || limit < 0 || limit > FINDINGS_LIMIT)
    throw new Error("Findings retention exceeds the fixed limit");
  const digest = createHash("sha256"),
    kept = [];
  let total = 0;
  return {
    add(finding) {
      const value = numbered
        ? {
            number: `WO-102-F${String(total + 1).padStart(3, "0")}`,
            ...finding,
          }
        : finding;
      total++;
      digest.update(JSON.stringify(canonicalValue(value)) + "\n");
      if (kept.length < limit) kept.push(value);
    },
    finish: () => ({ total, kept, digest: digest.digest("hex") }),
  };
}
export function summarizeFindings(findings, options) {
  const collector = findingsCollector(options);
  for (const finding of findings) collector.add(finding);
  return collector.finish();
}
export function assertFindings(
  actual,
  expected,
  label = "Sweep findings changed",
) {
  const wanted = Array.isArray(expected)
    ? summarizeFindings(expected)
    : expected;
  if (
    actual.total !== wanted.total ||
    actual.digest !== wanted.digest ||
    !isDeepStrictEqual(actual.kept, wanted.kept)
  ) {
    // Scalar AssertionError fields cannot invoke a structural collection diff.
    throw new AssertionError({
      actual: actual.total,
      expected: wanted.total,
      operator: "bounded-findings",
      message: `${label}\nfindings total=${actual.total}; kept=${actual.kept.length}; digest=${actual.digest}\n${JSON.stringify(actual.kept, displayNumber)}\nexpected total=${wanted.total}; digest=${wanted.digest}`,
    });
  }
}

// Declared judgment: WO-102 files and direct helper/sweep consumers within
// corpus/harness. Token dataflow follows sweep aliases and collection access;
// numeric indexing selects one bounded finding. This is not a general JS proof.
export function unsafeFindingsAssertions(source) {
  const require = createRequire(import.meta.url);
  const { createScanner, SyntaxKind: K } = require("typescript/unstable/ast");
  const scanner = createScanner(true);
  scanner.setText(source);
  const tokens = [];
  for (let kind = scanner.scan(); kind !== K.EndOfFile; kind = scanner.scan())
    tokens.push({
      kind,
      text: scanner.getTokenText(),
      start: scanner.getTokenStart(),
    });
  const tainted = new Set(),
    sweeps = new Set(["inspectGrid", "inspectPurity", "inspectCorpus"]);
  const comparisons = new Set([
    "deepEqual",
    "deepStrictEqual",
    "notDeepEqual",
    "notDeepStrictEqual",
  ]);
  for (let i = 0; i < tokens.length - 2; i++)
    if (tokens[i + 1].text === "as") {
      if (sweeps.has(tokens[i].text)) sweeps.add(tokens[i + 2].text);
      if (comparisons.has(tokens[i].text)) comparisons.add(tokens[i + 2].text);
    }
  const risky = (expression) =>
    expression.some((token, index) => {
      if (
        token.kind === K.StringLiteral &&
        ['"findings"', "'findings'", '"kept"', "'kept'"].includes(token.text) &&
        expression[index - 1]?.text === "["
      )
        return true;
      if (token.kind !== K.Identifier) return false;
      if (
        tainted.has(token.text) &&
        expression[index + 1]?.text === "[" &&
        expression[index + 2]?.kind === K.NumericLiteral &&
        expression[index + 3]?.text === "]"
      )
        return false;
      return (
        tainted.has(token.text) ||
        (sweeps.has(token.text) && expression[index + 1]?.text === "(") ||
        (token.text === "findings" && expression[index - 1]?.text === ".")
      );
    });
  // A bounded fixed point handles aliases declared before another alias.
  for (let pass = 0; pass < tokens.length; pass++) {
    const size = tainted.size + comparisons.size;
    for (let i = 0; i < tokens.length - 2; i++)
      if (tokens[i].kind === K.Identifier && tokens[i + 1].text === "=") {
        const end = tokens.findIndex(
          (token, index) => index > i + 1 && token.text === ";",
        );
        const rhs = tokens.slice(i + 2, end < 0 ? tokens.length : end);
        if (risky(rhs)) tainted.add(tokens[i].text);
        if (
          rhs.some((token) =>
            comparisons.has(token.text.replace(/^["']|["']$/g, "")),
          )
        )
          comparisons.add(tokens[i].text);
      }
    for (let i = 0; i < tokens.length - 3; i++) {
      if (
        tokens[i].text !== "{" ||
        !["const", "let", "var"].includes(tokens[i - 1]?.text)
      )
        continue;
      const end = tokens.findIndex(
        (token, index) => index > i && token.text === "}",
      );
      if (end < 0 || tokens[end + 1]?.text !== "=") continue;
      for (let j = i + 1; j < end; j++) {
        const alias = tokens[j + 1]?.text === ":" ? tokens[j + 2] : tokens[j];
        if (alias?.kind !== K.Identifier) continue;
        if (["findings", "kept"].includes(tokens[j].text))
          tainted.add(alias.text);
        if (comparisons.has(tokens[j].text)) comparisons.add(alias.text);
      }
    }
    if (size === tainted.size + comparisons.size) break;
  }
  const findings = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    if (!comparisons.has(tokens[i].text.replace(/^["']|["']$/g, ""))) continue;
    const start =
      tokens[i + 1].text === "("
        ? i + 2
        : tokens[i + 1].text === "]" && tokens[i + 2]?.text === "("
          ? i + 3
          : null;
    if (start === null) continue;
    let depth = 1,
      end = start;
    for (; end < tokens.length && depth; end++) {
      if (tokens[end].text === "(") depth++;
      if (tokens[end].text === ")") depth--;
    }
    if (risky(tokens.slice(start, end - 1)))
      findings.push({
        line: source.slice(0, tokens[i].start).split("\n").length,
        remedy:
          "Use assertFindings from bounded-findings.mjs; structural equality must not receive sweep findings.",
      });
  }
  return findings;
}
