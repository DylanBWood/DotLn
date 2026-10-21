// VER-001 replay of one WO-217 repair control in disposable copies. Run from
// the repository root, one process at a time:
//   node docs/evidence/WO-217/verification-001/control-replay.mjs <copy> <base-copy> <control-id> [pos,neg]
// <copy> is a clone of the baseline commit overlaid with the subject's modified
// and untracked files and built; <base-copy> is a built clone of the baseline.
// isolated-reversion: the positive arm runs the copy as it stands; the negative
// arm applies the recorded reversion (a literal replacement, or the whole file
// from the baseline commit), rebuilds packages when a packages/ path changed,
// and restores every byte afterwards. Two literal reversions predate the
// order's formatting pass; formatted-reversions.json holds their old text after
// prettier with the recorded new text unchanged.
// base-met: runs the command in the base copy after copying in only the test
// files the control's testSetup names and the order's control-fixture helper.
// The implementation under verification is never edited.
import {
  appendFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";

const [copy, baseCopy, id, armsArg = "pos,neg"] = process.argv.slice(2);
const spec = JSON.parse(
  readFileSync("docs/evidence/WO-217/repair-controls.json", "utf8"),
).results.find((row) => row.id === id);
if (!copy || !baseCopy || !spec)
  throw new Error(`usage: <copy> <base-copy> <control-id>; unknown ${id}`);
const formatted = JSON.parse(
  readFileSync(
    "docs/evidence/WO-217/verification-001/formatted-reversions.json",
    "utf8",
  ),
)[id];
const reversion = formatted ?? spec.reversion;
const log = process.env.REPLAY_LOG ?? join(copy, "..", "replay.log");
const arms = armsArg.split(",");

function env() {
  const result = { ...process.env };
  delete result.NODE_TEST_CONTEXT;
  // The control's recorded setup: the suite environment of test-worktree.sh.
  if (spec.id === "finish-copy-output") {
    delete result.CODEX_THREAD_ID;
    result.DOTLN_GATE_CHILD = "1";
  }
  return result;
}
function build(where, reason) {
  const run = spawnSync("npm", ["run", "build", "--silent"], {
    cwd: where,
    encoding: "utf8",
  });
  if (run.status !== 0) throw new Error(`build failed (${reason})`);
}
function run(where, arm) {
  const started = Date.now();
  const result = spawnSync(
    "node",
    ["scripts/harness.mjs", "bounded", "--", ...spec.command],
    { cwd: where, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, env: env() },
  );
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  appendFileSync(
    log,
    `\n===== ${spec.id} ${arm} exit=${result.status}\n${output}`,
  );
  return {
    exit: result.status,
    seconds: (Date.now() - started) / 1000,
    output,
  };
}
function apply(where, changes) {
  const saved = new Map();
  for (const change of changes) {
    const file = join(where, change.path);
    const text = existsSync(file) ? readFileSync(file, "utf8") : null;
    if (!saved.has(change.path)) saved.set(change.path, text);
    if (change.baselineCommit) {
      const base = spawnSync(
        "git",
        ["show", `${change.baselineCommit}:${change.path}`],
        { cwd: where, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
      );
      if (base.status !== 0) throw new Error(`no baseline ${change.path}`);
      writeFileSync(file, base.stdout);
    } else {
      if (text === null) throw new Error(`missing ${change.path}`);
      const count = text.split(change.old).length - 1;
      if (count !== (change.count ?? 1))
        throw new Error(`${change.path} old text matches ${count} times`);
      writeFileSync(file, text.split(change.old).join(change.new));
    }
  }
  return saved;
}
function restore(where, saved) {
  for (const [path, text] of saved)
    if (text === null) rmSync(join(where, path), { force: true });
    else writeFileSync(join(where, path), text);
}
const touchesPackages = (changes) =>
  changes.some((change) => change.path.startsWith("packages/"));
const outcome = { id: spec.id, mode: spec.mode };

if (spec.mode === "base-met") {
  const tests = (spec.testSetup ?? []).flatMap((line) => {
    const match =
      /Copy (?:only )?current (?:expanded )?(\S+) onto the exact base/u.exec(
        line,
      );
    return match ? [match[1]] : [];
  });
  if (spec.command.includes("docs/evidence/WO-217/control-fixture.mjs"))
    tests.push("docs/evidence/WO-217/control-fixture.mjs");
  const saved = new Map();
  for (const path of tests) {
    const target = join(baseCopy, path);
    saved.set(path, existsSync(target) ? readFileSync(target, "utf8") : null);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(copy, path), target);
  }
  try {
    outcome.copied = tests;
    outcome.base = run(baseCopy, "base");
  } finally {
    restore(baseCopy, saved);
  }
} else {
  if (arms.includes("pos")) outcome.pos = run(copy, "pos");
  if (arms.includes("neg")) {
    const saved = apply(copy, reversion);
    try {
      if (touchesPackages(reversion)) build(copy, "reversion");
      outcome.neg = run(copy, "neg");
    } finally {
      restore(copy, saved);
      if (touchesPackages(reversion)) build(copy, "restore");
    }
  }
}
const first = (arm) => {
  if (!arm || arm.exit === 0) return undefined;
  for (const pattern of [
    /AssertionError[^\n]*(?:\n[^\n]*){0,3}/u,
    /^FAIL[^\n]*/mu,
    /(?:Range|Type|Syntax)Error[^\n]*/u,
    /Error: [^\n]*/u,
    /✖[^\n]*/u,
  ]) {
    const match = arm.output.match(pattern);
    if (match) return match[0].replace(/\s+/gu, " ").slice(0, 300);
  }
  return "";
};
const counts = (arm) =>
  ["tests", "pass", "fail"]
    .map((key) =>
      [...arm.output.matchAll(new RegExp(`^ℹ ${key} (\\d+)`, "gmu"))]
        .map((match) => Number(match[1]))
        .reduce((sum, value) => sum + value, 0),
    )
    .join("/");
const brief = (arm) =>
  arm && {
    exit: arm.exit,
    seconds: arm.seconds,
    failure: first(arm),
    tests: counts(arm),
  };
console.log(
  JSON.stringify({
    ...outcome,
    pos: brief(outcome.pos),
    neg: brief(outcome.neg),
    base: brief(outcome.base),
  }),
);
