// VER-002 replay of one WO-218 repair control in a disposable copy of the
// subject. Run from the repository root, one process at a time:
//   node docs/evidence/WO-218/verification-002/control-replay.mjs <copy> <control-id> [pos,neg]
// The positive arm runs the copy as it stands; the negative arm applies the
// control's recorded reversion (literal, regex, appended text, copied file or
// main's whole file), rebuilding packages for a TypeScript change. The equal-arm
// setup applies to both arms. Every changed byte is restored afterwards. The
// implementation under verification is never edited.
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const BASE = "a66981acfcb4c451f9ef0417c2625ef809e4dc72";
const [copy, id, armsArg = "pos,neg"] = process.argv.slice(2);
const controls = JSON.parse(
  readFileSync("docs/evidence/WO-218/repair-controls.json", "utf8"),
).results;
const spec = controls.find((row) => row.id === id);
if (!copy || !spec)
  throw new Error(`usage: <copy> <control-id>; unknown ${id}`);
const log = process.env.REPLAY_LOG ?? join(copy, "..", "replay.log");
const arms = armsArg.split(",");
const reversion = spec.revertScope ?? spec.reversion ?? [];
const setup = spec.testSetup ?? spec.setup ?? [];

function apply(changes, label) {
  const saved = new Map();
  for (const change of changes) {
    const file = join(copy, change.path);
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      text = null;
    }
    if (!saved.has(change.path)) saved.set(change.path, text);
    if (change.baseFile !== undefined) {
      const base = spawnSync("git", ["show", `${BASE}:${change.baseFile}`], {
        cwd: copy,
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
      });
      if (base.status !== 0) throw new Error(`${label}: no ${change.baseFile}`);
      writeFileSync(file, base.stdout);
    } else if (change.baseFunction !== undefined) {
      // Main's whole function under a new name, appended as the control did.
      const base = spawnSync("git", ["show", `${BASE}:${change.path}`], {
        cwd: copy,
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
      }).stdout;
      const at = base.search(
        new RegExp(`^(?:export )?function ${change.baseFunction}\\(`, "mu"),
      );
      if (at < 0) throw new Error(`${label}: no ${change.baseFunction}`);
      const body = base
        .slice(at, base.indexOf("\n}\n", at) + 2)
        .replace(
          new RegExp(`\\b${change.baseFunction}\\b`, "u"),
          change.rename,
        );
      writeFileSync(file, `${text}\n${body}\n`);
    } else if (change.copyFile !== undefined)
      writeFileSync(file, readFileSync(join(copy, change.copyFile)));
    else if (change.append !== undefined)
      writeFileSync(file, (text ?? "") + change.append);
    else if (text === null) throw new Error(`${label}: missing ${change.path}`);
    else if (change.regex) {
      const pattern = new RegExp(change.old);
      if (!pattern.test(text))
        throw new Error(`${label}: ${change.path} pattern matches nothing`);
      writeFileSync(
        file,
        text.replace(pattern, () => change.new),
      );
    } else {
      const count = text.split(change.old).length - 1;
      if (count !== (change.count ?? 1))
        throw new Error(`${label}: ${change.path} matches ${count} times`);
      writeFileSync(file, text.split(change.old).join(change.new));
    }
  }
  return saved;
}
function restore(saved) {
  for (const [path, text] of saved)
    if (text === null) spawnSync("rm", ["-f", join(copy, path)]);
    else writeFileSync(join(copy, path), text);
}
function build(reason) {
  const run = spawnSync("npm", ["run", "build", "--silent"], {
    cwd: copy,
    encoding: "utf8",
  });
  if (run.status !== 0) throw new Error(`build failed (${reason})`);
}
function run(arm) {
  const started = Date.now();
  const result = spawnSync(
    "node",
    ["scripts/harness.mjs", "bounded", "--", ...spec.command],
    { cwd: copy, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
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
const typescript = (changes) =>
  changes.some((change) => /^packages\/.*\.ts$/u.test(change.path));
const outcome = { id: spec.id, mode: spec.mode };
const setupSaved = apply(setup, "setup");
try {
  if (typescript(setup)) build("setup");
  if (arms.includes("pos")) outcome.pos = run("pos");
  if (arms.includes("neg")) {
    const saved = apply(reversion, "reversion");
    try {
      if (typescript(reversion)) build("reversion");
      outcome.neg = run("neg");
    } finally {
      restore(saved);
      if (typescript(reversion)) build("restore");
    }
  }
} finally {
  restore(setupSaved);
  if (typescript(setup)) build("restore setup");
}
const first = (arm) =>
  arm &&
  (arm.output.match(
    /AssertionError[^\n]*|RangeError[^\n]*|^FAIL[^\n]*|Error: [^\n]*/mu,
  )?.[0] ??
    "");
console.log(
  JSON.stringify({
    id: outcome.id,
    mode: outcome.mode,
    pos: outcome.pos && {
      exit: outcome.pos.exit,
      seconds: outcome.pos.seconds,
    },
    neg: outcome.neg && {
      exit: outcome.neg.exit,
      seconds: outcome.neg.seconds,
      failure: first(outcome.neg),
    },
  }),
);
