import assert from "node:assert/strict";
import { spawnSync, execFileSync } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  symlinkSync,
  realpathSync,
  openSync,
  closeSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const repo = realpathSync(process.cwd());
const current = await import(
  pathToFileURL(join(repo, "scripts/lib/temporary-roots.mjs")).href
);
const commit = "9139d91eb0b2b5cdcb683f750e48684b43fb95b6";
assert.equal(
  execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: repo,
    encoding: "utf8",
  }).trim(),
  repo,
);
const scratch = realpathSync(
    current.createScratchRoot(join(tmpdir(), "dotln-wo237-baseline-verifier-")),
  ),
  base = join(scratch, "baseline-source");
mkdirSync(base, { recursive: true });
const archive = join(scratch, "baseline.tar");
const descriptor = openSync(archive, "wx");
try {
  execFileSync("git", ["archive", commit], {
    cwd: repo,
    stdio: ["ignore", descriptor, "pipe"],
  });
} finally {
  closeSync(descriptor);
}
const extracted = spawnSync("tar", ["-xf", archive, "-C", base]);
assert.equal(extracted.status, 0);
execFileSync("git", ["-c", "init.templateDir=", "init", "-q", "-b", "main"], {
  cwd: base,
});
assert.equal(
  execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: base,
    encoding: "utf8",
  }).trim(),
  realpathSync(base),
);
mkdirSync(join(base, "node_modules/@dotln"), { recursive: true });
for (const name of readdirSync(join(repo, "node_modules")))
  if (name !== "@dotln")
    symlinkSync(
      join(repo, "node_modules", name),
      join(base, "node_modules", name),
    );
for (const name of readdirSync(join(base, "packages")))
  symlinkSync(
    join(base, "packages", name),
    join(base, "node_modules/@dotln", name),
  );
const build = spawnSync(process.execPath, ["scripts/build.mjs"], {
  cwd: base,
  encoding: "utf8",
  maxBuffer: 16 * 1024 * 1024,
});
writeFileSync(join(scratch, "baseline-build.log"), build.stdout + build.stderr);
assert.equal(build.status, 0, build.stderr);
// Only the assertion-bearing test is current. Every copied product script,
// source module, runtime and library comes from the exact baseline archive.
writeFileSync(
  join(base, "scripts/test-release.sh"),
  readFileSync(join(repo, "scripts/test-release.sh")),
);
const run = spawnSync(
  "bash",
  ["scripts/test-release.sh", "--case", "success"],
  { cwd: base, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
);
const output = run.stdout + run.stderr;
writeFileSync(join(scratch, "baseline-release.log"), output);
const observation = output.match(/^journal lane after close: .*$/m)?.[0];
assert.equal(observation, "journal lane after close: absent");
assert.equal(run.status, 2);
const baseline = await import(
  pathToFileURL(join(base, "packages/skeleton/src/temporary-root-records.mjs"))
    .href
);
const owned = current.ensureTemporaryRoot(
  join(scratch, "baseline-device-fixture"),
  { class: "gate-fixture", repository: repo },
);
const marker = join(owned, current.TEMPORARY_OWNER_FILE),
  record = JSON.parse(readFileSync(marker, "utf8"));
writeFileSync(
  marker,
  JSON.stringify({ ...record, device: record.device + 23 }) + "\n",
);
let refusal;
try {
  baseline.readTemporaryOwner(owned);
} catch (e) {
  refusal = e.message;
}
assert.equal(
  refusal,
  "Temporary owner record is invalid or the directory was replaced",
);
const repaired = current.readTemporaryOwner(owned);
assert.equal(repaired.device, record.device);
current.removeTemporaryRoot(owned, record.token);
const result = {
  schemaVersion: 1,
  baselineCommit: commit,
  productSource:
    "exact git archive of baseline; current assertion-bearing release test only",
  buildExitCode: build.status,
  releaseNegative: { exitCode: run.status, observation },
  deviceNegative: { refusal, currentReadRestamps: true },
  recordedAt: new Date().toISOString(),
};
writeFileSync(
  join(scratch, "baseline-control.json"),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result, null, 2));
