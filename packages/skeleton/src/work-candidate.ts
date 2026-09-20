/** Pure, bounded discovery wire contract. Candidates carry observations, not authority. */
import { sha256Text } from "./sha256.js";
export const WORK_CANDIDATE_KINDS = [
  "failing-lint",
  "failing-test",
  "misplaced-file",
  "stale-generated",
  "repeated-repair",
] as const;
export interface WorkCandidate {
  candidateId: string;
  kind: (typeof WORK_CANDIDATE_KINDS)[number];
  paths: string[];
  evidence: string[];
  proposedHome?: string;
  /** Observed scope only; this is not a repair-effort estimate. */
  size: { files: number };
}
export interface DiscoveryEvidence {
  evidenceId: string;
  source: string;
  facts: Record<string, string | number | string[]>;
}
export interface DiscoveryReport {
  schemaVersion: 1;
  candidates: WorkCandidate[];
  evidence: DiscoveryEvidence[];
}
export function discoveryPath(value: unknown): asserts value is string {
  if (
    typeof value !== "string" ||
    value.length > 240 ||
    !value ||
    value.startsWith("/") ||
    /[\\\x00-\x1f:]/u.test(value) ||
    value
      .split("/")
      .some((part) => !part || part === "." || part === ".." || part === ".git")
  )
    throw new Error("discovery requires a bounded relative path");
}
function object(value: unknown, keys: string[]): Record<string, unknown> {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).some((key) => !keys.includes(key))
  )
    throw new Error("invalid discovery object");
  return value as Record<string, unknown>;
}
const text = (v: unknown): v is string =>
  typeof v === "string" &&
  v.length > 0 &&
  v.length <= 1024 &&
  !/[\x00-\x1f]/u.test(v);
function strings(v: unknown): asserts v is string[] {
  if (
    !Array.isArray(v) ||
    !v.length ||
    v.length > 128 ||
    !v.every(text) ||
    new Set(v).size !== v.length
  )
    throw new Error("invalid discovery string list");
}
export function decodeDiscoveryReport(value: unknown): DiscoveryReport {
  const root = object(value, ["schemaVersion", "candidates", "evidence"]);
  if (
    root.schemaVersion !== 1 ||
    !Array.isArray(root.candidates) ||
    root.candidates.length > 128 ||
    !Array.isArray(root.evidence) ||
    root.evidence.length > 256 ||
    JSON.stringify(value).length > 60000
  )
    throw new Error("invalid discovery report bounds");
  const ids = new Set<string>();
  for (const raw of root.evidence) {
    const row = object(raw, ["evidenceId", "source", "facts"]);
    if (!text(row.evidenceId) || ids.has(row.evidenceId) || !text(row.source))
      throw new Error("invalid discovery evidence");
    ids.add(row.evidenceId);
    if (
      !row.facts ||
      typeof row.facts !== "object" ||
      Array.isArray(row.facts) ||
      Object.keys(row.facts).length > 16
    )
      throw new Error("invalid discovery facts");
    for (const [key, fact] of Object.entries(row.facts)) {
      if (!text(key)) throw new Error("invalid discovery fact key");
      if (Array.isArray(fact)) strings(fact);
      else if (!(
        text(fact) ||
        (typeof fact === "number" && Number.isSafeInteger(fact) && fact >= 0)
      ))
        throw new Error("invalid discovery fact");
    }
  }
  const candidates = new Set<string>();
  for (const raw of root.candidates) {
    const row = object(raw, [
      "candidateId",
      "kind",
      "paths",
      "evidence",
      "proposedHome",
      "size",
    ]);
    if (
      !text(row.candidateId) ||
      candidates.has(row.candidateId) ||
      !WORK_CANDIDATE_KINDS.includes(row.kind as WorkCandidate["kind"])
    )
      throw new Error("invalid discovery candidate");
    candidates.add(row.candidateId);
    strings(row.paths);
    row.paths.forEach(discoveryPath);
    strings(row.evidence);
    if (row.evidence.some((id) => !ids.has(id)))
      throw new Error("unresolved discovery evidence");
    const size = object(row.size, ["files"]);
    if (size.files !== row.paths.length)
      throw new Error("candidate size differs from observed scope");
    if (row.kind === "misplaced-file") discoveryPath(row.proposedHome);
    else if (row.proposedHome !== undefined)
      throw new Error("unexpected proposed home");
  }
  return structuredClone(value) as DiscoveryReport;
}

/** SHA-256 of the canonical wire bytes, kept pure for deterministic log replay. */
export function discoveryOutputSha256(report: DiscoveryReport): string {
  return sha256Text(JSON.stringify(report) + "\n");
}
