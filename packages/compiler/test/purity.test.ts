import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  compileLoadout,
  seiriEnvironment,
  seiriLoadout,
  type LoadoutGraph,
} from "../src/index.js";

const deepFreeze = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
};

test("WO-008 constraint compiler is deterministic, input-immutable, I/O-free, and has zero runtime dependencies", async () => {
  const packageRoot = fileURLToPath(new URL("../../", import.meta.url));
  const manifest = JSON.parse(
    await readFile(new URL("../../package.json", import.meta.url), "utf8"),
  ) as Readonly<Record<string, unknown>>;
  assert.equal(manifest["dependencies"], undefined);
  assert.equal(manifest["optionalDependencies"], undefined);
  assert.equal(manifest["peerDependencies"], undefined);

  const sourceDirectory = new URL("../../src/", import.meta.url);
  const sourceFiles = (await readdir(sourceDirectory)).filter((file) =>
    file.endsWith(".ts"),
  );
  for (const file of sourceFiles) {
    const source = await readFile(
      new URL(`../../src/${file}`, import.meta.url),
      "utf8",
    );
    const imports = [...source.matchAll(/from\s+"([^"]+)"/gu)].map(
      (match) => match[1]!,
    );
    assert.ok(
      imports.every((specifier) => specifier.startsWith("./")),
      `${file} imports only compiler-local modules: ${imports.join(", ")}`,
    );
    assert.doesNotMatch(
      source,
      /node:(?:fs|child_process|net|http|https|worker_threads)|\bfetch\s*\(/u,
      `${file} must not perform I/O`,
    );
  }
  assert.match(packageRoot, /packages\/compiler\/$/u);

  const input = structuredClone(seiriLoadout) as LoadoutGraph;
  const before = structuredClone(input);
  deepFreeze(input);
  const originalNow = Date.now;
  const originalRandom = Math.random;
  Date.now = () => {
    throw new Error("ambient clock read");
  };
  Math.random = () => {
    throw new Error("ambient randomness read");
  };
  try {
    const first = compileLoadout(input, seiriEnvironment());
    const second = compileLoadout(input, seiriEnvironment());
    assert.deepEqual(second, first);
    assert.deepEqual(input, before);
  } finally {
    Date.now = originalNow;
    Math.random = originalRandom;
  }
});
