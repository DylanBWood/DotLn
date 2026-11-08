// Criterion 8 in one replayable run against a shared clone of this checkout
// with its working tree laid over it, in system temp: the real
// `node scripts/discover.mjs harness claude-code` on a discovery record
// without `versions`, twice, then `npm run resume -- status` with the record
// hand-broken. Writes criterion-8-discovery.json beside this file with every
// path redacted; the clone is removed afterwards.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../..");
const output = new URL("./criterion-8-discovery.json", import.meta.url);
const scratch = mkdtempSync(join(tmpdir(), "dotln-wo259-discovery-"));
const clone = join(scratch, "repository");
const redact = (text) =>
  String(text ?? "")
    .replaceAll(clone, "<clone>")
    .replaceAll(root, "<checkout>")
    .replace(/\/(?:private\/)?var\/folders\/\S+/gu, "<tmp>")
    .replace(/\/Users\/[^\s/]+/gu, "<home>");
try {
  execFileSync("git", [
    "-c",
    "maintenance.auto=false",
    "clone",
    "--quiet",
    "--shared",
    root,
    clone,
  ]);
  const listed = (...args) =>
    execFileSync("git", ["-C", root, ...args], { encoding: "utf8" })
      .split("\0")
      .filter(Boolean);
  for (const path of [
    ...listed("diff", "-z", "--name-only", "--no-renames", "HEAD"),
    ...listed("ls-files", "-z", "--others", "--exclude-standard"),
  ])
    if (existsSync(join(root, path))) {
      mkdirSync(dirname(join(clone, path)), { recursive: true });
      cpSync(join(root, path), join(clone, path));
    } else rmSync(join(clone, path), { force: true });
  symlinkSync(join(root, "node_modules"), join(clone, "node_modules"));
  const record = join(clone, "docs/discovery/environment.json");
  writeFileSync(
    record,
    JSON.stringify(
      { effortReadbackProbe: { harnesses: { "claude-code": {} } } },
      null,
      2,
    ) + "\n",
  );
  const run = (args) => {
    const result = spawnSync(process.execPath, args, {
      cwd: clone,
      encoding: "utf8",
      env: { ...process.env, DOTLN_LAUNCHPAD: clone },
    });
    return {
      exitCode: result.status,
      stdout: redact(result.stdout).trim(),
      stderr: redact(result.stderr).trim(),
    };
  };
  const rows = [];
  for (const attempt of ["first", "second"]) {
    const result = run(["scripts/discover.mjs", "harness", "claude-code"]);
    const printed = JSON.parse(result.stdout);
    const stored = JSON.parse(readFileSync(record, "utf8")).effortReadbackProbe
      .harnesses["claude-code"];
    rows.push({
      run: attempt,
      command: "node scripts/discover.mjs harness claude-code",
      exitCode: result.exitCode,
      status: printed.status,
      recorded: printed.recorded,
      version: printed.value,
      versionsStored: stored.versions.length,
      versionLinesStored: stored.versionLines.length,
    });
  }
  writeFileSync(record, '{"effortReadbackProbe":{"harnesses":');
  const status = run(["scripts/resume.mjs", "status"]);
  const line = status.stdout
    .split("\n")
    .find((text) => text.startsWith("Discovery record:"));
  const evidence = {
    schemaVersion: 1,
    comparison:
      "A shared clone of this checkout with the working tree laid over it; the discovery record starts as a claude-code entry without versions, then is hand-broken for status.",
    discover: rows,
    brokenRecordStatus: {
      command: "npm run resume -- status",
      exitCode: status.exitCode,
      line,
      namesMissingObservation: /has no matching discovery observation/u.test(
        status.stdout + status.stderr,
      ),
    },
  };
  writeFileSync(output, JSON.stringify(evidence, null, 2) + "\n");
  console.log(
    JSON.stringify({
      first: rows[0].status,
      second: rows[1].status,
      status: line,
    }),
  );
  assert.equal(rows[0].status, "recorded");
  assert.equal(rows[0].versionsStored, 1);
  assert.equal(rows[1].status, "already recorded");
  assert.equal(rows[1].versionsStored, 1);
  assert.equal(rows[1].versionLinesStored, 1);
  assert.match(
    line ?? "",
    /^Discovery record: docs\/discovery\/environment\.json cannot be parsed \(/u,
  );
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
