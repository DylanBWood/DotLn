// Replay deterministic evaluation and the unchanged independent WO-138 audit.
// No inference is performed and no historical record is rewritten.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { TOOL_ROOT } from "../../../scripts/lib/config.mjs";

const source = join(
  TOOL_ROOT,
  "docs/evidence/WO-149/wo138-probe-source.mjs.txt",
);
const originalHash =
  "3d9d6aa05c47bc6561e6850ea49c236611a3b462486f8311e4119953411f6907";
assert.equal(
  createHash("sha256").update(readFileSync(source)).digest("hex"),
  originalHash,
);
const scratch = mkdtempSync(join(tmpdir(), "dotln-wo149-historical-"));
cpSync(
  join(TOOL_ROOT, "docs/evidence/WO-138"),
  join(scratch, "docs/evidence/WO-138"),
  { recursive: true },
);
mkdirSync(join(scratch, "scripts/probes"), { recursive: true });
mkdirSync(join(scratch, "scripts/fixtures"), { recursive: true });
cpSync(
  source,
  join(scratch, "scripts/probes/local-model-role-qualification.mjs"),
);
cpSync(
  join(TOOL_ROOT, "scripts/fixtures/wo138-local-role-qualification.json"),
  join(scratch, "scripts/fixtures/wo138-local-role-qualification.json"),
);
const audit = spawnSync(
  process.execPath,
  [join(scratch, "docs/evidence/WO-138/audit.mjs")],
  { cwd: scratch, encoding: "utf8" },
);
assert.equal(audit.status, 0, audit.stderr);
const args = [
  "scripts/probes/local-model-role-qualification.mjs",
  "evaluate",
  "--episodes",
  "docs/evidence/WO-138/episodes",
  "--operator-ranking",
  "docs/evidence/WO-138/operator-ranking.json",
  "--out",
  join(scratch, "reevaluated.json"),
];
const current = spawnSync(process.execPath, args, {
  cwd: TOOL_ROOT,
  encoding: "utf8",
});
assert.notEqual(current.status, 0);
assert.match(current.stderr, /binding differs/);
const historical = spawnSync(
  process.execPath,
  [...args, "--harness-source", source],
  { cwd: TOOL_ROOT, encoding: "utf8" },
);
assert.equal(historical.status, 0, historical.stderr);
const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const { evaluatedAt: originalAt, ...original } = read(
  join(TOOL_ROOT, "docs/evidence/WO-138/results.json"),
);
const { evaluatedAt: replayAt, ...replayed } = read(
  join(scratch, "reevaluated.json"),
);
assert.ok(Date.parse(replayAt) > Date.parse(originalAt));
assert.deepEqual(replayed, original);
console.log(
  JSON.stringify({
    historicalSourceSha256: originalHash,
    bytes: readFileSync(source).length,
    originalAudit: JSON.parse(audit.stdout),
    currentBuildRejectsHistoricalRecords: true,
    explicitHistoricalEvaluationMatchesOriginalResults: true,
    comparisonExcludesOnly: "evaluatedAt (fresh evaluation timestamp)",
  }),
);
