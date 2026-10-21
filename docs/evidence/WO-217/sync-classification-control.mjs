// Reproduce the classifier repair without reverting the working tree. The
// copies keep their original import targets except for the two modules under
// this control, so both arms execute the same named regression case.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { runInNewContext } from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const sourcePath = "scripts/lib/generated-artifacts.mjs";
const testPath = "scripts/test-sync.mjs";
const control = JSON.parse(
  readFileSync(join(root, "docs/evidence/WO-217/repair-controls.json"), "utf8"),
).results.find((row) => row.id === "sync-real-checker-reports");
assert.ok(control, "the recorded control must exist");
const scratch = mkdtempSync(join(tmpdir(), "dotln-sync-control-"));
const hash = (text) => createHash("sha256").update(text).digest("hex");
const result = { id: control.id, arms: [] };
try {
  for (const arm of ["positive", "negative"]) {
    const copies = new Map(
      [sourcePath, "scripts/sync.mjs", testPath].map((file, index) => [
        resolve(root, file),
        join(scratch, `${arm}-${index}.mjs`),
      ]),
    );
    for (const [original, destination] of copies) {
      let text = readFileSync(original, "utf8");
      if (original === resolve(root, sourcePath)) {
        if (arm === "negative")
          for (const change of control.reversion) {
            assert.equal(change.path, sourcePath);
            assert.equal(text.split(change.old).length - 1, change.count);
            text = text.replace(change.old, change.new);
          }
        result[`${arm}SourceSha256`] = hash(text);
      }
      text = text.replace(
        /(from\s+|import\()(["'])(\.[^"']+)\2/g,
        (_, prefix, quote, specifier) => {
          const target = resolve(dirname(original), specifier);
          return `${prefix}${quote}${pathToFileURL(copies.get(target) ?? target).href}${quote}`;
        },
      );
      writeFileSync(destination, text);
    }
    const startedAt = new Date().toISOString();
    const started = Date.now();
    const run = spawnSync(
      process.execPath,
      [
        "--test",
        "--test-reporter=tap",
        "--test-name-pattern=^sync classifies real stale reports",
        copies.get(resolve(root, testPath)),
      ],
      { cwd: root, encoding: "utf8", timeout: 30_000 },
    );
    const output = `${run.stdout ?? ""}${run.stderr ?? ""}`;
    assert.equal(run.status, arm === "positive" ? 0 : 1, output);
    assert.match(output, /# tests 1\n/);
    if (arm === "negative")
      assert.match(output, /missing or malformed tag snapshot/);
    result.arms.push({
      arm,
      startedAt,
      durationMs: Date.now() - started,
      exitCode: run.status,
      outputSha256: hash(output),
      output: output
        .split(scratch)
        .join("<scratch>")
        .split(root)
        .join("<repository>"),
    });
  }

  // Compare the compatibility reports with the already-supported explicit
  // marker on the same inputs; this measures coverage, not runtime speed.
  const testSource = readFileSync(join(root, testPath), "utf8");
  const literal = testSource.match(/const reports = (\{[\s\S]+?\n  \});/)[1];
  const reports = runInNewContext(`(${literal})`);
  const { checkArtifact } = await import(pathToFileURL(join(root, sourcePath)));
  const counts = { realReports: 0, explicitMarkers: 0 };
  for (const [name, messages] of Object.entries(reports))
    for (const output of messages) {
      for (const [kind, text] of [
        ["realReports", output],
        ["explicitMarkers", `DOTLN_ARTIFACT_STALE ${name}`],
      ]) {
        assert.equal(
          checkArtifact({ name }, root, () => ({ exitCode: 1, output: text }))
            .stale,
          true,
        );
        counts[kind]++;
      }
    }
  result.comparison = counts;
  console.log(JSON.stringify(result, null, 2));
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
