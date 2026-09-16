// Test-only: retain WO-050's compiler identity while executing current reactor code.
import assert from "node:assert/strict";
import { register } from "node:module";
import { fileURLToPath } from "node:url";
import { isMainThread } from "node:worker_threads";

const target = new URL(
  "../../packages/compiler/dist/src/artifact-identity.js",
  import.meta.url,
).href;
if (isMainThread) {
  assert.equal(
    process.argv[1],
    fileURLToPath(new URL("../reactor-identity.mjs", import.meta.url)),
  );
  assert.equal(process.argv[2], "--check-historical");
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
      'export const COMPILER_PACKAGE_VERSION = "0.11.1";',
    ),
  };
}
