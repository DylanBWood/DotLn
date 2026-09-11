import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { installBeaconFixture } from "./test-beacon-fixture.mjs";

const parent = process.argv[2];
assert.ok(parent && isAbsolute(parent) && realpathSync(parent) === parent);
assert.ok(existsSync(join(parent, ".dotln-test-root-owner")));
const root = join(parent, "typed-dependency-resume");
const scripts = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(root, "scripts"), { recursive: true });
mkdirSync(join(root, "docs/work-orders"), { recursive: true });
mkdirSync(join(root, "docs/control/orders"), { recursive: true });
cpSync(join(scripts, "resume.mjs"), join(root, "scripts/resume.mjs"));
cpSync(join(scripts, "lib"), join(root, "scripts/lib"), { recursive: true });
installBeaconFixture(root);
assert.equal(spawnSync("git", ["init", "-q", root]).status, 0);
assert.equal(
  spawnSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: root,
    encoding: "utf8",
  }).stdout.trim(),
  root,
);
const path = "docs/work-orders/WO-099-fixture.md";
const file = join(root, path);
const entry = (workOrderId, relation, extra = {}) => ({
  workOrderId,
  relation,
  reason: "fixture prerequisite",
  ...extra,
});
const authority = (entries) => {
  const block =
    entries === null
      ? "**Depends on:** WO-001 and WO-098 are historical references.\n"
      : `<!-- dotln-dependencies:start -->\n${JSON.stringify(entries)}\n<!-- dotln-dependencies:end -->\n`;
  writeFileSync(
    file,
    `# WO-099 — fixture\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n\n${block}\n**Objective:** fixture.\n`,
  );
};
const call = (...args) =>
  spawnSync(process.execPath, [join(root, "scripts/resume.mjs"), ...args], {
    cwd: root,
    encoding: "utf8",
  });
const segment = join(root, "docs/control/orders/WO-099.jsonl");
const projection = join(root, "docs/control/current.md");
const snapshot = (file) =>
  existsSync(file) ? readFileSync(file, "utf8") : null;
for (const value of [
  entry("WO-098", "hard"),
  entry("WO-098", "satisfied-by-close"),
  entry("WO-098", "satisfied-by-release", { release: "v1.0.0" }),
  entry("WO-098", "planning-deferral", { until: "WO-098", date: "2026-09-08" }),
  entry("WO-098", "planning-deferral", {
    until: "candidate: later",
    date: "2026-09-08",
  }),
]) {
  authority([value]);
  const before = [snapshot(segment), snapshot(projection)];
  const refused = call("activate", "WO-099", path);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /WO-099-fixture.md: activation refused; WO-098/);
  assert.ok(refused.stderr.includes(`(${value.relation})`));
  assert.match(
    refused.stderr,
    /change the relation in this authority file with a dated reviewed note/,
  );
  assert.deepEqual([snapshot(segment), snapshot(projection)], before);
  console.log(
    `PASS activation refuses ${value.relation}${value.until ? ` until ${value.until}` : ""}; no event or projection write`,
  );
}
authority([entry("WO-098", "unrecognized")]);
assert.match(
  call("activate", "WO-099", path).stderr,
  /unknown relation.*offending entry/,
);
assert.equal(existsSync(segment), false);

// Closure with an explicit final-review pass is consumed from another segment.
const closed = [
  {
    type: "WorkOrderActivated",
    workOrderId: "WO-098",
    workOrderPath: "docs/work-orders/WO-098-fixture.md",
  },
  { type: "ImplementationReady", workOrderId: "WO-098" },
  {
    type: "VerificationRequested",
    workOrderId: "WO-098",
    verificationId: "VER-001",
    reportPath: "docs/verifications/WO-098/VER-001.md",
  },
  {
    type: "VerificationCompleted",
    workOrderId: "WO-098",
    verificationId: "VER-001",
    reportPath: "docs/verifications/WO-098/VER-001.md",
    verdict: "pass",
  },
  {
    type: "FinalReviewRequested",
    workOrderId: "WO-098",
    finalReviewId: "FINAL-001",
    reportPath: "docs/final-reviews/WO-098/FINAL-001.md",
  },
  {
    type: "FinalReviewCompleted",
    workOrderId: "WO-098",
    finalReviewId: "FINAL-001",
    reportPath: "docs/final-reviews/WO-098/FINAL-001.md",
    verdict: "pass",
  },
];
const sibling = join(root, "docs/control/orders/WO-098.jsonl");
writeFileSync(
  sibling,
  closed
    .map((event) => JSON.stringify({ schemaVersion: 1, ...event }))
    .join("\n") + "\n",
);
writeFileSync(
  join(root, "docs/work-orders/WO-098-fixture.md"),
  "# WO-098 — fixture\n",
);
const beforeSibling = snapshot(sibling);
authority([
  entry("WO-098", "satisfied-by-close"),
  entry("WO-097", "waived", { date: "2026-09-11" }),
  entry("WO-001", "historical-evidence"),
]);
const accepted = call("activate", "WO-099", path);
assert.equal(accepted.status, 0, accepted.stderr);
assert.equal(snapshot(segment).trim().split("\n").length, 1);
assert.equal(snapshot(sibling), beforeSibling);
const beforeStatus = [snapshot(segment), snapshot(projection)];
const status = call("status", "--json", "--work-order", "WO-099");
assert.equal(status.status, 0, status.stderr);
assert.deepEqual(JSON.parse(status.stdout).dependencies.blocking, []);
assert.deepEqual(
  JSON.parse(status.stdout).dependencies.entries.map((entry) => entry.state),
  ["met", "non-blocking", "non-blocking"],
);
assert.deepEqual([snapshot(segment), snapshot(projection)], beforeStatus);
console.log(
  "PASS met closure and dated waiver activate; selected typed status is read-only; sibling log unchanged",
);

// Fresh legacy authority may still activate with open/historical prose tokens.
const legacyPath = "docs/work-orders/WO-097-legacy.md";
writeFileSync(
  join(root, legacyPath),
  "# WO-097 — legacy\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n\n**Depends on:** WO-001 and WO-096.\n\n**Objective:** fixture.\n",
);
const legacy = call("activate", "WO-097", legacyPath);
assert.equal(legacy.status, 0, legacy.stderr);
const view = JSON.parse(
  call("status", "--json", "--work-order", "WO-097").stdout,
);
assert.equal(view.dependencies.source, "conservative-tokens");
assert.deepEqual(view.dependencies.blocking, []);
console.log("PASS conservative tokens never refuse activation");
