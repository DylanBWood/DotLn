import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const root = mkdtempSync(join(tmpdir(), "dotln-ignore-comparison-"));
try {
  assert.equal(
    spawnSync("git", ["-C", root, "init", "--quiet", "--template="]).status,
    0,
  );
  writeFileSync(join(root, ".gitignore"), "node_modules/\n");
  const paths = Array.from(
    { length: 80000 },
    (_, i) => `node_modules/${"é".repeat(70)}/line\n${i}.js`,
  );
  const input = paths.join("\0") + "\0";
  assert.ok(Buffer.byteLength(input) > 12 * 1024 * 1024);
  assert.ok(Buffer.byteLength(input) < 16 * 1024 * 1024);
  const invoke = (part, maxBuffer) =>
    spawnSync(
      "git",
      [
        "-C",
        root,
        "-c",
        "core.excludesFile=",
        "check-ignore",
        "--no-index",
        "-z",
        "--stdin",
      ],
      { input: part, encoding: "utf8", maxBuffer },
    );
  const rows = [];
  for (const arm of ["16MiB", "256KiB-batches"]) {
    const started = performance.now();
    let output = "";
    let calls = 0;
    const chunks =
      arm === "16MiB"
        ? [input]
        : Array.from(
            { length: Math.ceil(paths.length / 1200) },
            (_, i) => paths.slice(i * 1200, (i + 1) * 1200).join("\0") + "\0",
          );
    for (const part of chunks) {
      const result = invoke(
        part,
        arm === "16MiB" ? 16 * 1024 * 1024 : 1024 * 1024,
      );
      assert.equal(result.status, 0, result.error?.message);
      output += result.stdout;
      calls++;
    }
    assert.equal(output, input);
    rows.push({
      arm,
      calls,
      durationMs: Math.round(performance.now() - started),
      bytes: Buffer.byteLength(input),
      paths: paths.length,
      exact: true,
    });
  }
  console.log(JSON.stringify(rows));
} finally {
  rmSync(root, { recursive: true, force: true });
}
