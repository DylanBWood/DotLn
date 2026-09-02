import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const WORK_ORDER_ID = "WO-101";
export const RECORDED_SEED = "wo101-seed-20260901";
export const PINNED_BASE_COMMIT = "329820e14c55a46a987b9d788449eca14e42b6db";

export const HARNESS_ROOT = dirname(fileURLToPath(import.meta.url));
export const CORPUS_ROOT = resolve(HARNESS_ROOT, "..");
export const REPO_ROOT = resolve(CORPUS_ROOT, "..");

export const PATHS = Object.freeze({
  programFixtures: resolve(CORPUS_ROOT, "fixtures/program"),
  idFixtures: resolve(CORPUS_ROOT, "fixtures/ids"),
  manifest: resolve(CORPUS_ROOT, "manifests/WO-101.json"),
});

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function jsonBytes(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function jsonlBytes(rows) {
  return rows.length === 0
    ? ""
    : `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`;
}

export function parseJsonl(bytes, label = "JSONL") {
  if (bytes !== "" && !bytes.endsWith("\n"))
    throw new Error(`${label} must end with a newline`);
  return bytes.trimEnd() === ""
    ? []
    : bytes
        .trimEnd()
        .split("\n")
        .map((line, index) => {
          try {
            return JSON.parse(line);
          } catch (error) {
            throw new Error(
              `${label}:${index + 1}: ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        });
}

export function makeRng(seed, lane) {
  const digest = createHash("sha256")
    .update(`${WORK_ORDER_ID}\0${lane}\0${seed}`)
    .digest();
  let state = digest.readUInt32LE(0) >>> 0;
  if (state === 0) state = 0x9e3779b9;
  return Object.freeze({
    nextUint32() {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      state >>>= 0;
      return state;
    },
    int(maxExclusive) {
      if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0)
        throw new Error(`invalid RNG bound ${maxExclusive}`);
      return this.nextUint32() % maxExclusive;
    },
    bool() {
      return (this.nextUint32() & 1) === 1;
    },
  });
}

export function shuffled(values, rng) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    const swap = rng.int(index + 1);
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export function countBy(values, keyOf) {
  const counts = {};
  for (const value of values) {
    const key = String(keyOf(value));
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)),
  );
}

export function deepFreeze(value) {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

export function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

export function errorRecord(run) {
  try {
    return { ok: true, value: run() };
  } catch (error) {
    if (!(error instanceof Error))
      return {
        ok: false,
        error: { name: typeof error, message: String(error) },
      };
    return { ok: false, error: { name: error.name, message: error.message } };
  }
}

export function parseGeneratorArgs(argv) {
  let mode;
  let seed;
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (argument === "--write" || argument === "--check") {
      if (mode !== undefined)
        throw new Error("choose exactly one of --write or --check");
      mode = argument.slice(2);
      continue;
    }
    if (argument === "--seed") {
      if (seed !== undefined)
        throw new Error("--seed may be supplied only once");
      seed = argv[++index];
      if (seed === undefined || seed === "")
        throw new Error("--seed requires a nonempty value");
      continue;
    }
    throw new Error(`unknown argument ${argument}`);
  }
  if (mode === undefined)
    throw new Error("choose exactly one of --write or --check");
  if (seed === undefined) throw new Error("--seed is required");
  return { mode, seed };
}

export function writeExact(path, expected) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp-${process.pid}`;
  writeFileSync(temporary, expected, "utf8");
  renameSync(temporary, path);
}

export function checkExact(path, expected) {
  if (!existsSync(path)) throw new Error(`missing generated artifact ${path}`);
  const actual = readFileSync(path, "utf8");
  if (actual === expected) return;
  let offset = 0;
  const limit = Math.min(actual.length, expected.length);
  while (offset < limit && actual[offset] === expected[offset]) offset++;
  throw new Error(
    `generated artifact drift at ${path} byte ${offset}; expected sha256 ${sha256(expected)}, observed ${sha256(actual)}`,
  );
}

export function fixtureDescriptor(relativePath, bytes, rows) {
  return {
    path: relativePath,
    rows,
    bytes: Buffer.byteLength(bytes),
    sha256: sha256(bytes),
  };
}

export function assertRecordedSeed(seed) {
  if (seed !== RECORDED_SEED)
    throw new Error(
      `seed ${JSON.stringify(seed)} does not match manifest seed ${JSON.stringify(RECORDED_SEED)}`,
    );
}
