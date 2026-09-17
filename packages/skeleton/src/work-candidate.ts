/** Pure, bounded discovery wire contract. Candidates carry observations, not authority. */
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
  const bytes = new TextEncoder().encode(JSON.stringify(report) + "\n");
  const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const data = new DataView(padded.buffer);
  data.setUint32(padded.length - 4, bytes.length * 8);
  const h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const rotate = (n: number, bits: number) => (n >>> bits) | (n << (32 - bits));
  const w = new Uint32Array(64);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = data.getUint32(offset + i * 4);
    for (let i = 16; i < 64; i++) {
      const x = w[i - 15]!,
        y = w[i - 2]!;
      w[i] =
        w[i - 16]! +
        (rotate(x, 7) ^ rotate(x, 18) ^ (x >>> 3)) +
        w[i - 7]! +
        (rotate(y, 17) ^ rotate(y, 19) ^ (y >>> 10));
    }
    let [a, b, c, d, e, f, g, z] = h as [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
    ];
    for (let i = 0; i < 64; i++) {
      const t1 =
        (z +
          (rotate(e, 6) ^ rotate(e, 11) ^ rotate(e, 25)) +
          ((e & f) ^ (~e & g)) +
          k[i]! +
          w[i]!) >>>
        0;
      const t2 =
        ((rotate(a, 2) ^ rotate(a, 13) ^ rotate(a, 22)) +
          ((a & b) ^ (a & c) ^ (b & c))) >>>
        0;
      z = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }
    [a, b, c, d, e, f, g, z].forEach((value, i) => {
      h[i] = (h[i]! + value) >>> 0;
    });
  }
  return h.map((value) => value.toString(16).padStart(8, "0")).join("");
}
