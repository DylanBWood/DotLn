import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

test("CLI banner derives its version from the skeleton package manifest", async () => {
  const packagePath = fileURLToPath(
    new URL("../../package.json", import.meta.url),
  );
  const cliPath = fileURLToPath(new URL("../src/cli.js", import.meta.url));
  const manifest = JSON.parse(await readFile(packagePath, "utf8")) as {
    version?: unknown;
  };
  assert.equal(typeof manifest.version, "string");

  const result = spawnSync(process.execPath, [cliPath], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout.split("\n", 1)[0],
    `@dotln/skeleton v${manifest.version} — Repo Gardener + Seiri`,
  );
});
