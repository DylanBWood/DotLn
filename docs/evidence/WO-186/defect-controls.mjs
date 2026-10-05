// Run after the repaired cases pass. Each deliberate production defect lives
// in a declared disposable repository; no live source or gate row is changed.
import {
  cpSync,
  lstatSync,
  rmSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  symlinkSync,
  writeFileSync,
  openSync,
  closeSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { performance } from "node:perf_hooks";
import { createHash } from "node:crypto";
const root = resolve(import.meta.dirname, "../../..");
const finalMatrix = ["--final-matrix", "--final-matrix-diagnostic"].includes(
  process.argv[2],
);
const diagnostic = process.argv[2] === "--final-matrix-diagnostic";
if (process.argv.length > (finalMatrix ? 3 : 2))
  throw Error("Only --final-matrix is supported");
const git = (args, cwd = root) =>
  execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 64000000 });
const inventory = git([
  "ls-files",
  "--cached",
  "--others",
  "--exclude-standard",
  "-z",
])
  .split("\0")
  .filter(Boolean);
const cases = [
  {
    name: "harness",
    file: "packages/skeleton/dist/src/harness-host.js",
    before: "if (view.alive === true && !force)",
    after: "if (false && view.alive === true && !force)",
    args: [
      "--test",
      "--test-reporter=tap",
      "--test-name-pattern=^WO-039 an operator release judges, retires and journals one observed reservation$",
      "scripts/test-harness.mjs",
    ],
    detects: /an unforced release removed the live replacement/,
  },
  {
    name: "integration",
    file: "scripts/lib/worktree-integration.mjs",
    before: '.join(". ")}.',
    after: '.join(". ")}..',
    args: [
      "--test",
      "--test-reporter=tap",
      "--test-name-pattern=real Git.*real generators|WO-169 the integration record holds each release message",
      "scripts/test-worktree-integration.mjs",
    ],
    detects: /AssertionError/,
  },
  {
    name: "lock-matrix",
    file: "packages/skeleton/dist/src/resident-store.js",
    before: 'openSync(this.store.logPath, "a", 0o600)',
    after:
      'openSync(this.store.logPath, type === "ScriptEpisodeLost" ? "w" : "a", 0o600)',
    args: [
      "--test",
      "--test-reporter=tap",
      "--test-name-pattern=^WO-143 once and loop restart at every acquisition filesystem boundary, including killed reclaimers$",
      "packages/skeleton/dist/test/resident.test.js",
    ],
    detects: /AssertionError/,
  },
];
const result = [];
for (const item of cases) {
  if (finalMatrix && item.name !== "lock-matrix") continue;
  const local = `docs/control/local/harness/wo186-mutants/${item.name}${finalMatrix ? "-async" : ""}${diagnostic ? "-diagnostic" : ""}`,
    repo = join(root, local);
  if (existsSync(repo))
    throw Error("Mutant already exists; preserve and inspect: " + local);
  mkdirSync(join(root, "docs/control/local/harness/wo186-mutants"), {
    recursive: true,
  });
  git([
    "clone",
    "--quiet",
    "--no-hardlinks",
    "--no-tags",
    "--single-branch",
    root,
    repo,
  ]);
  git(["config", "maintenance.auto", "false"], repo);
  for (const file of inventory) {
    const from = join(root, file);
    if (!existsSync(from)) continue;
    const to = join(repo, file);
    mkdirSync(join(to, ".."), { recursive: true });
    if (lstatSync(from).isSymbolicLink() && existsSync(to)) rmSync(to);
    cpSync(from, to, { recursive: true, verbatimSymlinks: true });
  }
  for (const name of readdirSync(join(root, "packages")))
    if (existsSync(join(root, "packages", name, "dist")))
      cpSync(
        join(root, "packages", name, "dist"),
        join(repo, "packages", name, "dist"),
        { recursive: true },
      );
  mkdirSync(join(repo, "node_modules/@dotln"), { recursive: true });
  for (const name of [
    "typescript",
    "@types",
    "prettier",
    "playwright",
    "playwright-core",
  ])
    if (existsSync(join(root, "node_modules", name)))
      symlinkSync(
        join(root, "node_modules", name),
        join(repo, "node_modules", name),
      );
  for (const name of readdirSync(join(root, "node_modules/@dotln")))
    symlinkSync(
      join(repo, "packages", name),
      join(repo, "node_modules/@dotln", name),
    );
  execFileSync(
    process.execPath,
    [
      join(root, "scripts/worktree.mjs"),
      "material",
      local,
      "--disposable",
      "--reason",
      "WO-186 isolated public production-defect control; evidence retained in the order",
    ],
    { cwd: root, encoding: "utf8" },
  );
  const source = readFileSync(join(repo, item.file), "utf8");
  if (source.split(item.before).length !== 2)
    throw Error("Production mutation must match once: " + item.file);
  writeFileSync(join(repo, item.file), source.replace(item.before, item.after));
  const log = join(repo, "defect-control.log"),
    fd = openSync(log, "wx");
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const started = performance.now();
  let run;
  try {
    run = spawnSync(process.execPath, item.args, {
      cwd: repo,
      env,
      stdio: ["ignore", fd, fd],
    });
  } finally {
    closeSync(fd);
  }
  const output = readFileSync(log, "utf8"),
    detected =
      run.status === 1 &&
      item.detects.test(output) &&
      /not ok/.test(output) &&
      (!finalMatrix ||
        (/EVENT_ORDER/.test(output) &&
          [...output.matchAll(/^\s*not ok \d+ - cell /gm)].length === 8));
  result.push({
    case: item.name,
    productionFile: item.file,
    mutation: { before: item.before, after: item.after },
    exitCode: run.status,
    detected,
    recordedAt: new Date().toISOString(),
    ...(finalMatrix
      ? {
          testSourceSha256: createHash("sha256")
            .update(
              readFileSync(
                join(root, "packages/skeleton/test/resident.test.ts"),
              ),
            )
            .digest("hex"),
          causalDiagnostic:
            "All eight cells reject a log whose ScriptEpisodeLost append truncates its existing event prefix; EVENT_ORDER is emitted by the real event decoder.",
        }
      : {}),
    wallMs: performance.now() - started,
    log: relative(root, log),
    repository: local,
    failingCases: [...output.matchAll(/^\s*not ok \d+ - (.+)$/gm)].map(
      (match) => match[1],
    ),
  });
  console.log(JSON.stringify(result.at(-1)));
  if (!detected) throw Error("Inspect an unproven defect control: " + local);
}
writeFileSync(
  join(
    root,
    `docs/evidence/WO-186/defect-controls${finalMatrix ? "-async" : ""}${diagnostic ? "-diagnostic" : ""}.json`,
  ),
  JSON.stringify({ schemaVersion: 1, result }, null, 2) + "\n",
);
