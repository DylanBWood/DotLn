// VER-002 replay of WO-217 repair controls in a disposable copy. Run from the
// repository root, one process at a time:
//   node docs/evidence/WO-217/verification-002/control-replay.mjs <copy> [control-id ...]
// <copy> is a clone of the baseline commit overlaid with the subject's modified
// and untracked files and built. With no ids, every isolated-reversion control
// runs. The positive arm runs the copy as it stands; the negative arm applies
// the recorded reversion exactly as repair-controls.json holds it (a literal
// replacement with its recorded count, or the whole file from the baseline
// commit), rebuilds packages when a packages/ path changed, and restores every
// byte afterwards. Unlike VER-001's driver, no formatted override is applied:
// the record itself must match the current subject (VER-001 F2, D088).
// The implementation under verification is never edited.
import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const [copy, ...ids] = process.argv.slice(2);
const all = JSON.parse(
  readFileSync("docs/evidence/WO-217/repair-controls.json", "utf8"),
).results;
const selected = ids.length
  ? ids.map((id) => all.find((row) => row.id === id) ?? { id, missing: true })
  : all.filter((row) => row.mode === "isolated-reversion");
const log = process.env.REPLAY_LOG ?? join(copy, "..", "replay.log");

function env(spec) {
  const result = { ...process.env };
  delete result.NODE_TEST_CONTEXT;
  // The control's recorded setup: the suite environment of test-worktree.sh.
  if (spec.id === "finish-copy-output") {
    delete result.CODEX_THREAD_ID;
    result.DOTLN_GATE_CHILD = "1";
  }
  return result;
}
function build(reason) {
  const run = spawnSync("npm", ["run", "build", "--silent"], {
    cwd: copy,
    encoding: "utf8",
  });
  if (run.status !== 0) throw new Error(`build failed (${reason})`);
}
function run(spec, arm) {
  const started = Date.now();
  const result = spawnSync(
    "node",
    ["scripts/harness.mjs", "bounded", "--", ...spec.command],
    {
      cwd: copy,
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      env: env(spec),
    },
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
function apply(changes) {
  const saved = new Map();
  for (const change of changes) {
    const file = join(copy, change.path);
    const text = existsSync(file) ? readFileSync(file, "utf8") : null;
    if (!saved.has(change.path)) saved.set(change.path, text);
    if (change.baselineCommit) {
      const base = spawnSync(
        "git",
        ["show", `${change.baselineCommit}:${change.path}`],
        { cwd: copy, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
      );
      if (base.status !== 0) throw new Error(`no baseline ${change.path}`);
      writeFileSync(file, base.stdout);
    } else {
      const current = readFileSync(file, "utf8");
      const count = current.split(change.old).length - 1;
      if (count !== (change.count ?? 1))
        throw new Error(`${change.path} old text matches ${count} times`);
      writeFileSync(file, current.split(change.old).join(change.new));
    }
  }
  return saved;
}
function restore(saved) {
  for (const [path, text] of saved)
    if (text !== null) writeFileSync(join(copy, path), text);
}
const first = (arm) => {
  if (!arm || arm.exit === 0) return undefined;
  for (const pattern of [
    /AssertionError[^\n]*(?:\n[^\n]*){0,3}/u,
    /^FAIL[^\n]*/mu,
    /(?:Range|Type|Syntax)Error[^\n]*/u,
    /Error: [^\n]*/u,
    /(?:✖|not ok)[^\n]*/u,
  ]) {
    const match = arm.output.match(pattern);
    if (match) return match[0].replace(/\s+/gu, " ").slice(0, 300);
  }
  return "";
};
const counts = (arm) =>
  ["tests", "pass", "fail"]
    .map((key) =>
      [...arm.output.matchAll(new RegExp(`^(?:ℹ|#) ${key} (\\d+)`, "gmu"))]
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

for (const spec of selected) {
  const outcome = { id: spec.id, suite: spec.suite, mode: spec.mode };
  try {
    if (spec.missing) throw new Error("unknown control");
    if (spec.mode !== "isolated-reversion")
      throw new Error(`mode ${spec.mode}`);
    const pos = run(spec, "pos");
    const saved = apply(spec.reversion);
    const packages = spec.reversion.some((c) => c.path.startsWith("packages/"));
    let neg;
    try {
      if (packages) build("reversion");
      neg = run(spec, "neg");
    } finally {
      restore(saved);
      if (packages) build("restore");
    }
    Object.assign(outcome, { pos: brief(pos), neg: brief(neg) });
    outcome.reproduced = pos.exit === 0 && neg.exit !== 0;
  } catch (error) {
    outcome.error = error.message;
    outcome.reproduced = false;
  }
  console.log(JSON.stringify(outcome));
}
