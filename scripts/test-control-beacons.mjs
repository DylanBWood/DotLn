import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseWorktrees } from "./lib/git.mjs";
import { classifyIgnoredMaterial } from "./lib/paths.mjs";
import {
  installBeaconFixture,
  snapshotBeacons,
  assertControlBeacon,
} from "./test-beacon-fixture.mjs";
import {
  controlBeaconAddress,
  controlBeaconDirectory,
  emitControlBeacon,
  groupBeaconAddress,
  issueBeaconSession,
  prepareBeaconDisposal,
  sweepControlBeacons,
} from "../packages/skeleton/src/control-beacon-fs.mjs";
import {
  decodeGroupBeaconSize,
  groupCounts,
} from "../packages/skeleton/src/control-codebook.mjs";
import { validateBeaconDirectory } from "../packages/skeleton/src/beacon-io.mjs";

const owned = process.argv[2];
assert.ok(owned && isAbsolute(owned) && realpathSync(owned) === owned);
assert.ok(existsSync(join(owned, ".dotln-test-root-owner")));
const scripts = dirname(fileURLToPath(import.meta.url));
const root = join(owned, "constellation project");
mkdirSync(root);
const run = (cwd, file, args) =>
  spawnSync(file, args, { cwd, encoding: "utf8" });
const ok = (result) => {
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
const git = (cwd, args) => ok(run(cwd, "git", ["-C", cwd, ...args]));
git(root, ["init", "-b", "main"]);
assert.equal(git(root, ["rev-parse", "--show-toplevel"]).trim(), root);
git(root, ["config", "user.name", "DotLn Test"]);
git(root, ["config", "user.email", "test@example.invalid"]);
cpSync(scripts, join(root, "scripts"), { recursive: true });
cpSync(join(scripts, "../.gitignore"), join(root, ".gitignore"));
installBeaconFixture(root);
mkdirSync(join(root, "docs/work-orders"), { recursive: true });
for (const id of ["WO-097", "WO-098", "WO-099"])
  writeFileSync(
    join(root, `docs/work-orders/${id}-fixture.md`),
    `# ${id} fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n`,
  );
git(root, ["add", "."]);
git(root, ["commit", "-qm", "fixture"]);
const left = join(owned, "constellation left");
const right = join(owned, "constellation right");
git(root, ["worktree", "add", "-b", "wo-098", left]);
git(root, ["worktree", "add", "-b", "wo-099", right]);
const call = (cwd, tool, args) =>
  run(cwd, process.execPath, [join(cwd, `scripts/${tool}.mjs`), ...args]);
const resume = (cwd, args) => ok(call(cwd, "resume", args));
const status = (cwd) => JSON.parse(resume(cwd, ["status", "--json"]));
const actor = [
  "--harness",
  "human",
  "--harness-version",
  "not-applicable",
  "--model",
  "human",
  "--effort",
  "unknown",
  "--source",
  "operator-attested",
];

const token = issueBeaconSession(root, "WO-097");
resume(root, ["activate", "WO-097", "docs/work-orders/WO-097-fixture.md"]);
resume(left, ["activate", "WO-098", "docs/work-orders/WO-098-fixture.md"]);
resume(left, ["implementation-ready", ...actor]);
resume(right, ["activate", "WO-099", "docs/work-orders/WO-099-fixture.md"]);
resume(right, ["implementation-ready", ...actor]);
resume(right, ["verify"]);
for (const checkout of [root, left, right])
  assertControlBeacon(checkout, status(checkout));
const worktrees = parseWorktrees(root);
assert.equal(worktrees.length, 3);
const observations = sweepControlBeacons(worktrees);
assert.deepEqual(
  observations.map(({ decoded }) => decoded.state.phase),
  ["active", "ready-to-verify", "verifying"],
);
const groupPath = join(
  right,
  ".control-beacons/groups",
  groupBeaconAddress(worktrees),
);
assert.deepEqual(
  decodeGroupBeaconSize(lstatSync(groupPath, { bigint: true }).size),
  {
    status: "decoded",
    state: { groupCodebookVersion: 1, counts: groupCounts(observations) },
  },
);
const before = [root, left, right].map(snapshotBeacons);
const logsBefore = [root, left, right].map((checkout) =>
  readFileSync(
    join(checkout, `docs/control/orders/${status(checkout).workOrder}.jsonl`),
  ),
);
const output = ok(call(root, "worktree", ["constellation"]));
assert.equal(output.trim().split("\n").length, 4);
assert.match(output, /host cache; fresh/);
assert.deepEqual([root, left, right].map(snapshotBeacons), before);
assert.deepEqual(
  [root, left, right].map((checkout) =>
    readFileSync(
      join(checkout, `docs/control/orders/${status(checkout).workOrder}.jsonl`),
    ),
  ),
  logsBefore,
);
console.log(
  "PASS three-worktree metadata constellation (opaque fixture addresses shortened here):",
);
console.log(output.replaceAll(/[a-f0-9]{64}/g, "fixture-address").trim());

const file = join(controlBeaconDirectory(left), controlBeaconAddress("WO-098"));
const bytes = lstatSync(file).size;
writeFileSync(file, Buffer.alloc(bytes, 120));
chmodSync(file, 0o000);
assert.throws(() => readFileSync(file), { code: "EACCES" });
assert.equal(
  sweepControlBeacons(worktrees)[1].decoded.state.phase,
  "ready-to-verify",
);
chmodSync(file, 0o600);
renameSync(file, `${file}.absent`);
assert.ok(
  sweepControlBeacons(worktrees).some(
    ({ decoded }) => decoded.status === "absent",
  ),
);
renameSync(`${file}.absent`, file);
console.log(
  "PASS unreadable garbage content still decodes; missing expected worktree beacon is absent",
);

const privateNext = resume(root, ["next", "--beacon-session", token]);
const restricted = privateNext
  .split("Restricted host Beacon directory: ")[1]
  .trim();
const name = restricted.split("/").at(-1);
assert.match(name, /^[a-f0-9]{64}$/);
assert.notEqual(name, token);
assert.ok(existsSync(restricted));
for (const args of [["status"], ["status", "--json"], ["next"], ["times"]])
  assert.ok(!resume(root, args).includes(name));
for (const candidate of [token.slice(1), "0".repeat(64)]) {
  const result = call(root, "resume", ["next", "--beacon-session", candidate]);
  assert.equal(result.status, 1);
  assert.ok(!result.stderr.includes(candidate));
  assert.ok(!result.stderr.includes(name));
}
const wrongScope = call(left, "resume", ["next", "--beacon-session", token]);
assert.equal(wrongScope.status, 1);
assert.ok(!wrongScope.stderr.includes(name));
const otherOrderToken = issueBeaconSession(root, "WO-098");
const activeWrongScope = call(root, "resume", [
  "next",
  "--beacon-session",
  otherOrderToken,
]);
assert.equal(activeWrongScope.status, 1);
assert.match(activeWrongScope.stderr, /not authorized/);
const controlLog = readFileSync(
  join(root, "docs/control/orders/WO-097.jsonl"),
  "utf8",
);
assert.ok(!controlLog.includes(name) && !controlLog.includes(token));
for (const directory of [
  controlBeaconDirectory(root, "verifier"),
  restricted,
]) {
  assert.throws(
    () => validateBeaconDirectory(directory, root),
    /host projections only/,
  );
  if (directory === restricted) {
    assert.equal(lstatSync(directory).mode & 0o777, 0o111);
    assert.throws(() => readdirSync(directory), { code: "EACCES" });
  }
  for (const filename of directory === restricted
    ? [controlBeaconAddress("WO-097")]
    : readdirSync(directory)) {
    const record = JSON.parse(readFileSync(join(directory, filename), "utf8"));
    assert.equal(record.recordType, "control-beacon-projection");
    assert.equal(record.provenance, "host-projected");
    assert.deepEqual(
      Object.keys(record).sort(),
      [
        "codebookVersion",
        "effort",
        "latestVerdict",
        "phase",
        "provenance",
        "recordType",
        "recordedAt",
        "workOrderId",
      ].sort(),
    );
  }
}
const record = JSON.parse(
  readFileSync(join(restricted, controlBeaconAddress("WO-097")), "utf8"),
);
assert.throws(
  () => emitControlBeacon(root, { ...record, provenance: "self-reported" }),
  /host projections only/,
);
assert.throws(
  () => emitControlBeacon(root, { ...record, narrative: "executor claim" }),
  /undeclared fields/,
);
console.log(
  "PASS verifier contains only host records; two independent 256-bit names; restricted name appears only in the authorized active next briefing",
);

for (const path of [
  ".control-beacons",
  ".control-beacons/public/a.beacon",
  ".control-beacons/restricted/fixture/value.beacon",
])
  assert.equal(classifyIgnoredMaterial(path).disposable, true);
for (const path of [
  "docs/intake/dist/x.md",
  "docs/intake/.control-beacons/value",
  "nested/.control-beacons/value",
  ".control-beacons-other/value",
])
  assert.equal(classifyIgnoredMaterial(path).disposable, false);
console.log(
  "PASS anchored Beacon disposal; protected intake and lookalike/nested paths still refuse",
);

// Projection failure is loud but cannot reverse an already-appended transition.
const publicDir = controlBeaconDirectory(root);
chmodSync(publicDir, 0o500);
try {
  const result = call(root, "resume", ["implementation-ready", ...actor]);
  assert.equal(result.status, 0);
  assert.match(
    result.stderr,
    /host beacon projection unavailable; transition recorded, do not retry/,
  );
  assert.equal(status(root).phase, "ready-to-verify");
  assert.equal(
    readFileSync(join(root, "docs/control/orders/WO-097.jsonl"), "utf8")
      .trim()
      .split("\n").length,
    2,
  );
} finally {
  chmodSync(publicDir, 0o700);
}
console.log(
  "PASS filesystem projection failure records exactly one transition and warns without leaking restricted paths",
);
prepareBeaconDisposal(root);
