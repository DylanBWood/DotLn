import { fnv1a64 } from "@dotln/compiler";
import type { Cell, Scalar, Source } from "./types.js";

export const object = (value: unknown): Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new Error("expected an object");
  return value as Record<string, unknown>;
};
export const array = (value: unknown): readonly unknown[] => {
  if (!Array.isArray(value)) throw new Error("expected an array");
  return value;
};
export const string = (value: unknown): string => {
  if (typeof value !== "string") throw new Error("expected text");
  return value;
};
export const strings = (value: unknown): readonly string[] =>
  array(value).map(string);
export const number = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value))
    throw new Error("expected a finite number");
  return value;
};
export const optionalObject = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
export const optionalString = (value: unknown): string | undefined =>
  typeof value === "string" && value.length > 0 ? value : undefined;
export const at = (value: unknown, ...keys: readonly string[]): unknown =>
  keys.reduce((part: unknown, key) => optionalObject(part)[key], value);

export const available = <T>(ref: string, value: T): Source<T> => ({
  ref,
  status: "available",
  value,
});
export const unavailable = (
  ref: string,
  reason = "Source not supplied",
): Source<never> => ({ ref, status: "unavailable", reason });

export const known = (
  key: string,
  label: string,
  value: Scalar | readonly Scalar[],
  evidence: readonly string[],
  explanation: string | null = null,
): Cell => ({ key, label, status: "known", value, explanation, evidence });
export const unknown = (
  key: string,
  label: string,
  evidence: readonly string[],
  explanation = "Not recorded by this source",
): Cell => ({
  key,
  label,
  status: "unknown",
  value: null,
  explanation,
  evidence,
});
export const fact = (
  key: string,
  label: string,
  value: unknown,
  evidence: readonly string[],
  explanation: string | null = null,
): Cell => {
  if (value === undefined || value === null || value === "unknown")
    return unknown(
      key,
      label,
      evidence,
      explanation ?? "Not recorded by this source",
    );
  if (
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  )
    return known(key, label, value, evidence, explanation);
  if (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "string" ||
        typeof item === "boolean" ||
        (typeof item === "number" && Number.isFinite(item)),
    )
  )
    return known(key, label, [...value] as Scalar[], evidence, explanation);
  throw new Error("unsupported cell value");
};

/** Compact navigation keys only; projectBoard refuses duplicate targets. */
export const id = (family: string, key: string): string =>
  `${family}-${fnv1a64(key)}`;
