// Test-only: retain a receipt's recorded compiler identity while executing the
// current matrix fold. Same shape as scripts/fixtures/historical-compiler-loader.mjs;
// the version comes from the receipt instead of a literal.
import assert from "node:assert/strict";
import { register } from "node:module";
import { fileURLToPath } from "node:url";
import { isMainThread } from "node:worker_threads";

const target = new URL(
  "../../../packages/compiler/dist/src/artifact-identity.js",
  import.meta.url,
).href;
const recorded = process.env.DOTLN_WO056_RECORDED_COMPILER ?? "";
if (isMainThread) {
  assert.equal(
    process.argv[1],
    fileURLToPath(new URL("./replay.mjs", import.meta.url)),
  );
  assert.equal(process.argv[2], "--replay-recorded");
  assert.match(recorded, /^\d+\.\d+\.\d+$/u, "recorded compiler version");
  register(import.meta.url);
}

export async function load(url, context, nextLoad) {
  const loaded = await nextLoad(url, context);
  if (url !== target) return loaded;
  const source = String(loaded.source);
  const literal = /export const COMPILER_PACKAGE_VERSION = "\d+\.\d+\.\d+";/g;
  assert.equal(
    [...source.matchAll(literal)].length,
    1,
    "one compiler version declaration",
  );
  return {
    ...loaded,
    source: source.replace(
      literal,
      `export const COMPILER_PACKAGE_VERSION = ${JSON.stringify(recorded)};`,
    ),
  };
}
