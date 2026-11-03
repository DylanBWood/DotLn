// WO-241 VER-001, criteria 4 and 5: one exported-instance-shaped root (the
// kit's CLAUDE.md template as its floor, a KIT-MANIFEST.json, the kit budget
// template and no package sources), emitted first by the base's scripts and
// then by the candidate's. It compares every emitted file, then elects
// Tinkerer economy off, the legacy overlay route and private-destination on,
// measuring cold starts against the instance's own ceilings and running the
// real outward-lint CLI on two pull-request bodies. Arguments: the worktree
// root and an empty scratch directory. Writes only under scratch.
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

const [worktree, scratch] = process.argv.slice(2);
const base = execFileSync("git", ["-C", worktree, "merge-base", "main", "HEAD"])
  .toString()
  .trim();
const baseTree = join(scratch, "base-tree");
mkdirSync(baseTree, { recursive: true });
execFileSync("sh", [
  "-c",
  'git -C "$0" archive "$1" scripts | tar -x -C "$2"',
  worktree,
  base,
  baseTree,
]);
const root = realpathSync(mkdtempSync(join(scratch, "instance-")));
const log = (...parts) => console.log(...parts);
const write = (path, text) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
};
const writable = (path) => {
  const info = lstatSync(path);
  if (info.isSymbolicLink()) return;
  chmodSync(path, info.mode | 0o200 | (info.isDirectory() ? 0o700 : 0));
  if (info.isDirectory())
    for (const name of readdirSync(path)) writable(join(path, name));
};
const git = (...args) =>
  execFileSync(
    "git",
    [
      "-C",
      root,
      "-c",
      "user.name=Probe",
      "-c",
      "user.email=probe@example.invalid",
      "-c",
      "commit.gpgsign=false",
      ...args,
    ],
    {
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
try {
  git("init", "-q", "-b", "main");
  for (const name of ["compiler", "skeleton", "kernel"]) {
    cpSync(
      join(worktree, `packages/${name}/dist/src`),
      join(root, `packages/${name}/dist/src`),
      { recursive: true },
    );
    writable(join(root, `packages/${name}/dist`));
    cpSync(
      join(worktree, `packages/${name}/package.json`),
      join(root, `packages/${name}/package.json`),
    );
    mkdirSync(join(root, "node_modules/@dotln"), { recursive: true });
    symlinkSync(
      `../../packages/${name}`,
      join(root, `node_modules/@dotln/${name}`),
    );
  }
  cpSync(join(worktree, "packages/beacons"), join(root, "packages/beacons"), {
    recursive: true,
  });
  writable(join(root, "packages/beacons"));
  symlinkSync(
    "../../packages/beacons",
    join(root, "node_modules/@dotln/beacons"),
  );
  symlinkSync(
    join(worktree, "node_modules/typescript"),
    join(root, "node_modules/typescript"),
  );
  for (const path of [
    "packages/skeleton/src/runtime-inputs.mjs",
    "packages/skeleton/src/temporary-root-records.mjs",
    "packages/skeleton/src/duration.mjs",
    "packages/skeleton/src/dispatch-journal.mjs",
    "packages/skeleton/src/test-selection.mjs",
    "packages/skeleton/src/gate-evidence.mjs",
    "packages/skeleton/src/gate-deadlines.mjs",
  ])
    cpSync(join(worktree, path), join(root, path));
  const template = readFileSync(
    join(worktree, "scripts/kit/CLAUDE.template.md"),
    "utf8",
  );
  log(
    "kit template equals the base's:",
    template ===
      readFileSync(join(baseTree, "scripts/kit/CLAUDE.template.md"), "utf8"),
  );
  write(
    ".gitignore",
    "node_modules/\n**/dist/\ndocs/control/local/\n.runtime/\n.dotln-owner.json\n",
  );
  write("CLAUDE.md", template);
  write("KIT-MANIFEST.json", JSON.stringify({ files: [] }) + "\n");
  write(
    "package.json",
    JSON.stringify({ private: true, scripts: { test: "node -e 0" } }, null, 2) +
      "\n",
  );
  write(
    "docs/control/budgets.json",
    readFileSync(join(worktree, "scripts/kit/budgets.template.json")),
  );
  write(
    "docs/control/orders/WO-999.jsonl",
    JSON.stringify({ type: "WorkOrderActivated", workOrderId: "WO-999" }) +
      "\n",
  );
  write("docs/work-orders/WO-999-fixture.md", "# Synthetic work order\n");
  git("add", ".");
  git("commit", "-q", "-m", "fixture");
  const scripts = (tree) => {
    rmSync(join(root, "scripts"), { recursive: true, force: true });
    cpSync(join(tree, "scripts"), join(root, "scripts"), { recursive: true });
  };
  const harness = (...args) => {
    const result = spawnSync(
      process.execPath,
      ["scripts/harness.mjs", ...args],
      {
        cwd: root,
        env: { ...process.env, DOTLN_LAUNCHPAD: root },
        encoding: "utf8",
      },
    );
    const lines = (result.stdout + result.stderr)
      .split("\n")
      .filter((line) => /advisory|error|drift|refus|conflict/iu.test(line));
    return `exit ${result.status}${lines.length ? `: ${lines.slice(0, 3).join(" / ").slice(0, 300)}` : ""}`;
  };
  const walk = (dir) =>
    existsSync(join(root, dir))
      ? readdirSync(join(root, dir), { recursive: true })
          .map((name) => join(dir, name))
          .filter((path) => statSync(join(root, path)).isFile())
      : [];
  const snapshot = () =>
    Object.fromEntries(
      [
        ...new Set([
          "CLAUDE.md",
          ...walk(".claude"),
          ...walk(".agents"),
          ...walk(".codex"),
        ]),
      ]
        .sort()
        .map((path) => [path, readFileSync(join(root, path), "utf8")]),
    );
  const differing = (a, b) =>
    [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(
      (path) => a[path] !== b[path],
    );
  const { measureColdStarts } = await import(
    join(worktree, "scripts/lib/process-budget.mjs")
  );
  const coldStarts = (label) => {
    const profiles = measureColdStarts(root).profiles.filter(
      (row) => row.skillsRoot === ".claude/skills",
    );
    const breaches = measureColdStarts(root).profiles.filter(
      (row) => row.ceiling !== null && row.bytes > row.ceiling,
    );
    log(
      `${label} cold starts (.claude; .agents equal): ${profiles.map((row) => `${row.role} ${row.bytes}${row.ceiling ? ` of ${row.ceiling}` : ""}`).join(", ")}; ceiling breaches ${breaches.length}`,
    );
  };
  const config = (value) => write("dotln.config.json", JSON.stringify(value));
  scripts(baseTree);
  log("base emit", harness("emit"), "| base check", harness("check"));
  const baseAbsent = snapshot();
  scripts(worktree);
  log("candidate check over the base's emission", harness("check"));
  log("candidate emit", harness("emit"), "| check", harness("check"));
  const absent = snapshot();
  log(
    `absent: ${Object.keys(absent).length} emitted files; differing from the base's: ${JSON.stringify(differing(baseAbsent, absent))}`,
  );
  coldStarts("absent");
  config({ version: 1, features: { "tinkerer-economy": false } });
  log("tinkerer-economy false: check before emit", harness("check"));
  log("emit", harness("emit"), "| check", harness("check"));
  const off = snapshot();
  for (const skills of [".claude", ".agents"]) {
    const path = `${skills}/skills/dotln-executor/SKILL.md`;
    log(
      `${path}: Tinkerer text absent ${/Tinkerer — Economy/u.test(absent[path])} -> off ${/Tinkerer — Economy/u.test(off[path])}; bytes ${Buffer.byteLength(absent[path])} -> ${Buffer.byteLength(off[path])}`,
    );
  }
  log(
    "manifest origin ids keep tinkerer-economy:",
    JSON.parse(off[".claude/harness-manifest.json"]).origin.ids.includes(
      "tinkerer-economy",
    ),
  );
  const beyondHeader = differing(absent, off).filter((path) => {
    const a = absent[path].split("\n");
    const b = off[path].split("\n");
    const changed = a
      .map((line, index) => (line === b[index] ? -1 : index))
      .filter((index) => index >= 0);
    return (
      a.length !== b.length ||
      changed.some((index) => !/Origin: \{/u.test(a[index]))
    );
  });
  log(
    `files changed beyond their Origin header line: ${JSON.stringify(beyondHeader)}`,
  );
  coldStarts("tinkerer off");
  write(
    "build/options.json",
    JSON.stringify({ version: 1, unequip: ["tinkerer-economy"] }),
  );
  config({ version: 1, build: { overlay: "build/options.json" } });
  log("legacy overlay unequip: emit", harness("emit"));
  log(
    "  executor without Tinkerer text:",
    !/Tinkerer — Economy/u.test(
      readFileSync(
        join(root, ".claude/skills/dotln-executor/SKILL.md"),
        "utf8",
      ),
    ),
  );
  config({
    version: 1,
    build: { overlay: "build/options.json" },
    features: { "tinkerer-economy": true },
  });
  log("legacy overlay plus features true: emit", harness("emit"));
  rmSync(join(root, "build"), { recursive: true, force: true });
  config({ version: 1, features: { "private-destination": true } });
  log("private-destination true: check before emit", harness("check"));
  log("emit", harness("emit"), "| check", harness("check"));
  const elected = snapshot();
  const secrets = (text) =>
    text.match(/## Secrets\n\n([\s\S]*?)(?=\n\n## )/u)?.[1];
  log(`differing from absent: ${JSON.stringify(differing(absent, elected))}`);
  log(
    "absent Secrets equals the template's:",
    secrets(absent["CLAUDE.md"]) === secrets(template),
  );
  log(
    "text outside Secrets unchanged:",
    elected["CLAUDE.md"].replace(secrets(elected["CLAUDE.md"]), "S") ===
      absent["CLAUDE.md"].replace(secrets(absent["CLAUDE.md"]), "S"),
  );
  log(`elected Secrets:\n${secrets(elected["CLAUDE.md"])}`);
  coldStarts("private-destination on");
  write("docs/control/local/terms.txt", "refuse: fixture-private-project\n");
  write(
    "docs/control/outward-vocabulary.json",
    JSON.stringify({ types: ["feat", "fix"], reviewTerms: [] }),
  );
  for (const body of [
    "A link to https://tracker.fixture-private-project.example/T-1 in the body.",
    "A plain body naming nothing private.",
  ]) {
    const result = spawnSync(
      process.execPath,
      ["scripts/outward-lint.mjs", "pr-body"],
      {
        cwd: root,
        env: { ...process.env, DOTLN_LAUNCHPAD: root },
        input: body,
        encoding: "utf8",
      },
    );
    const status = JSON.parse(result.stdout).checks.localTerms.status;
    log(
      `outward-lint pr-body "${body.slice(0, 24)}...": exit ${result.status}, localTerms ${status}`,
    );
  }
  rmSync(join(root, "dotln.config.json"));
  log("key absent again: emit", harness("emit"), "| check", harness("check"));
  log(
    `differing from the first absent emission: ${JSON.stringify(differing(absent, snapshot()))}`,
  );
} finally {
  writable(root);
  rmSync(root, { recursive: true, force: true });
}
