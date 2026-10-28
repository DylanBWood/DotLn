import {
  createFixtureRoot,
  copyTemporaryMaterial as cpSync,
  ensureTemporaryRoot,
  removeTemporaryPath as rmSync,
} from "./temporary-roots.mjs";
// Launchpad export fixtures, one case per WO-074 acceptance criterion. The
// order stays uncommitted until final review, so the fixtures commit a bounded
// copy of the work tree into a temporary repository and export from it.
// WO-075: the copy carries the package sources and links the running
// checkout's node_modules, so the export builds the runtime it carries and a
// clone of the copy rebuilds it for comparison.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { sha256Hex as sha256 } from "./helpers.mjs";
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  symlinkSync,
  unlinkSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defaultRoots, loadConfig, TOOL_ROOT } from "./config.mjs";
import { measureColdStarts } from "./process-budget.mjs";
import {
  BUILD_INPUTS,
  EMIT_CLOSURE,
  KIT_FILES,
  TEST_FIXTURE_TREES,
  TEST_SUPPORT_FILES,
} from "../launchpad.mjs";
import { licenseHashes } from "../license-surfaces.mjs";
import { gateCodeIdentity, readGateChecks } from "./gate-evidence.mjs";
import { hasPackageSources } from "../../packages/skeleton/src/runtime-inputs.mjs";
import { namedStarterSeed } from "./starter-seeds.mjs";
import { markdownLinks } from "../docs-check.mjs";
import { suites } from "../test-runner.mjs";

const repository = TOOL_ROOT;
const scratch = realpathSync(
  createFixtureRoot(join(tmpdir(), "dotln-launchpad-")),
);
const source = join(scratch, "source");
const RUNTIME_PACKAGES = ["kernel", "compiler", "skeleton", "console"];
const HARNESS_MANIFEST = ".claude/harness-manifest.json";
// Built at runtime from reversed parts: the suite is itself a kit file, and
// the terms check joins consecutive tokens, so the literal must not appear.
const synthetic = `${["term", "synthetic", "wvut", "zyx"].reverse().join("-")}\n`;
const syntheticHash = createHash("sha256").update(synthetic).digest("hex");
const planted = {
  intake: "docs/intake/planted-intake.md",
  settings: ".claude/settings.local.json",
  beacon: ".beacons/planted-beacon",
  controlBeacon: ".control-beacons/public/planted",
  store: ".runtime/planted-store.jsonl",
  // A declaration file: TypeScript source under packages/*/src that the
  // export's build compiles without emitting, so the plant can only travel
  // as source.
  typescript: "packages/skeleton/src/planted.d.ts",
  evidence: "docs/evidence/WO-074/planted.md",
};
const marker = (kind) => `PLANTED-${kind.toUpperCase()}-7f3a9c`;
const plantedText = (kind) =>
  kind === "typescript"
    ? `export declare const planted: "${marker(kind)}";\n`
    : `${marker(kind)}\n${kind === "evidence" ? `synthetic list sha256:${syntheticHash}\n` : ""}`;
const termsPath = join(source, "docs/control/local/terms.txt");
// The cases judge a session that is not a Codex dispatch and exports no
// selected effort; the Codex dispatch is asserted with its variable set.
const env = {
  ...process.env,
  CODEX_THREAD_ID: "",
  COPILOT_AGENT_SESSION_ID: "",
  DOTLN_LAUNCHPAD: "",
  DOTLN_BEACON_KEY_FILE: "",
  CLAUDE_EFFORT: "",
  npm_config_update_notifier: "false",
};
// A nested --test process must start its own runner. The parent's internal
// worker context otherwise makes Node execute a test file without its runner.
delete env.NODE_TEST_CONTEXT;
const blobId = (bytes) =>
  createHash("sha1")
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");

const run = (file, args, options = {}) =>
  spawnSync(file, args, {
    encoding: "utf8",
    env,
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
const ok = (result, label) => {
  assert.equal(
    result.status,
    0,
    `${label}: ${result.stderr}\n${result.stdout}`,
  );
  return result;
};
const git = (cwd, args) =>
  ok(run("git", args, { cwd }), `git ${args.join(" ")}`);
// Git 2.55 starts a detached repack once objects/17 holds two loose objects;
// it would write into the tree the fixture removes.
const configureRepository = (cwd) => {
  git(cwd, ["config", "maintenance.auto", "false"]);
  git(cwd, ["config", "user.name", "DotLn Fixture"]);
  git(cwd, ["config", "user.email", "fixture@example.invalid"]);
};
const initRepository = (cwd) => {
  git(cwd, ["init", "-q", "-b", "main"]);
  configureRepository(cwd);
};
// A committed export of its own, for a case that must not depend on another
// case's commit: the export already initialized the repository.
const commitExport = (destination) => {
  ok(runExport(destination), `export ${destination}`);
  configureRepository(destination);
  git(destination, ["add", "."]);
  git(destination, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "exported launchpad",
  ]);
  return destination;
};
// The command line under test, run from the committed copy's own scripts.
const runExport = (destination, extra = [], cwd = scratch) =>
  run(
    process.execPath,
    [join(source, "scripts/launchpad.mjs"), "export", destination, ...extra],
    { cwd },
  );
// Every path under root but the repository, the install and the ignored
// runtime lane the export's emit installs.
const files = (root, directory = "") =>
  readdirSync(join(root, directory), { withFileTypes: true }).flatMap(
    (entry) => {
      const path = directory ? `${directory}/${entry.name}` : entry.name;
      if ([".git", "node_modules", ".runtime"].includes(path)) return [];
      if (entry.isSymbolicLink()) return [path];
      return entry.isDirectory() ? files(root, path) : [path];
    },
  );
// Preview must preserve every destination byte, including ignored state and
// Git metadata. Record symlinks without traversing their external targets.
const treeSnapshot = (root) => {
  const result = {};
  const visit = (path) => {
    const file = join(root, path);
    const stat = lstatSync(file, { throwIfNoEntry: false });
    if (!stat) result[path] = "absent";
    else if (stat.isSymbolicLink()) result[path] = `link:${readlinkSync(file)}`;
    else if (stat.isDirectory()) {
      result[path] = "directory";
      for (const name of readdirSync(file).sort())
        visit(path ? `${path}/${name}` : name);
    } else result[path] = `${stat.mode}:${sha256(readFileSync(file))}`;
  };
  visit("");
  return result;
};

// A real node_modules for a copy of the checkout: one link per third-party
// entry of the running install and relative links to the copy's own
// workspaces, as atomicBuild stages them, so a package-name import resolves
// inside the copy and never to the running checkout's packages. A directory
// named node_modules is ignored by the copied .gitignore; a link would not be.
const linkInstall = (target, installed = repository) => {
  mkdirSync(join(target, "node_modules/@dotln"), { recursive: true });
  // Keep npm scripts on this install's pinned tools. Relative bin links also
  // resolve workspace commands against the case's own package links.
  cpSync(
    join(installed, "node_modules/.bin"),
    join(target, "node_modules/.bin"),
    {
      recursive: true,
      verbatimSymlinks: true,
    },
  );
  for (const entry of readdirSync(join(installed, "node_modules")))
    if (![".bin", "@dotln"].includes(entry))
      symlinkSync(
        join(installed, "node_modules", entry),
        join(target, "node_modules", entry),
      );
  for (const name of readdirSync(join(target, "packages")))
    if (existsSync(join(target, "packages", name, "package.json")))
      symlinkSync(
        `../../packages/${name}`,
        join(target, "node_modules/@dotln", name),
      );
};
const manifestOf = (root) =>
  JSON.parse(readFileSync(join(root, "KIT-MANIFEST.json"), "utf8"));
const harnessManifestOf = (root) =>
  JSON.parse(readFileSync(join(root, HARNESS_MANIFEST), "utf8"));
const harness = (root, action, args = [], options = {}) =>
  run(process.execPath, ["scripts/harness.mjs", action, ...args], {
    cwd: root,
    ...options,
  });
// Every string specifier a generated hook imports: static `from`, dynamic
// `import(...)` and `new URL(...)` forms. A specifier is admitted when it is
// relative (./, ../) or a node: builtin; an absolute path or a file: URL is not.
const importSpecifiers = (text) =>
  [
    ...text.matchAll(/\bfrom\s*"((?:[^"\\]|\\.)*)"/gu),
    ...text.matchAll(/\bimport\(\s*"((?:[^"\\]|\\.)*)"/gu),
    ...text.matchAll(/new URL\(\s*"((?:[^"\\]|\\.)*)"/gu),
  ].map((match) => match[1]);
const absoluteSpecifiers = (text) =>
  importSpecifiers(text).filter(
    (specifier) =>
      !(
        specifier.startsWith("./") ||
        specifier.startsWith("../") ||
        specifier.startsWith("node:")
      ),
  );
const licenseLike = (root) =>
  files(root)
    // The license-surfaces check is a script named for what it checks.
    .filter((path) => path !== "scripts/license-surfaces.mjs")
    .filter((path) =>
      /(?:^|\/)(?:LICEN[CS]E|COPYING|NOTICE)(?:[-.][^/]*)?$/iu.test(path),
    )
    .sort();

// A bounded copy of the work tree: the kit's sources, the package sources the
// runtime is built from, the planted instance material, and the synthetic
// local-terms list in its ignored location.
const copy = (path) => {
  mkdirSync(dirname(join(source, path)), { recursive: true });
  cpSync(join(repository, path), join(source, path), { recursive: true });
};
const write = (path, text) => {
  mkdirSync(dirname(join(source, path)), { recursive: true });
  writeFileSync(join(source, path), text);
};
mkdirSync(source, { recursive: true });
for (const path of [
  "scripts",
  "packages/beacons",
  ...TEST_FIXTURE_TREES,
  "package.json",
  "package-lock.json",
  ...TEST_SUPPORT_FILES,
  "packages/console/uifa-board-v1.schema.json",
  "packages/console/runtime-status-v1.schema.json",
  "tsconfig.json",
  "LICENSE",
  "LICENSE-docs",
  "NOTICE",
  ".gitignore",
  "docs/product/07-execution-guide.md",
  "docs/product/08-publication-compiler.md",
  "docs/PLAYBOOK.md",
  "docs/publication/implementation-overlay-template.md",
  // Not a kit file: an upstream pointer the export names and does not carry.
  "docs/LEGAL.md",
  "docs/releases/tag-manifest.template.json",
])
  copy(path);
// Every workspace the root project graph references, so the build compiles
// inside the copy; the list comes from tsconfig.json rather than a directory
// listing, which the product read guard counts as a read of the packages tree.
for (const { path } of JSON.parse(
  readFileSync(join(repository, "tsconfig.json"), "utf8"),
).references)
  for (const entry of ["package.json", "tsconfig.json", "src", "test"])
    if (existsSync(join(repository, path, entry)))
      copy(`${path.replace(/^\.\//u, "")}/${entry}`);
for (const [kind, path] of Object.entries(planted))
  write(path, plantedText(kind));
write("docs/control/local/terms.txt", synthetic);
initRepository(source);
git(source, [
  "remote",
  "add",
  "origin",
  "https://example.invalid/owner/launchpad.git",
]);
git(source, ["add", "."]);
// The plants in ignored locations are force-added, so every plant is a blob
// at the exported commit and the allowlist alone has to keep it out.
for (const kind of ["intake", "settings", "beacon", "controlBeacon", "store"]) {
  assert.equal(
    run("git", ["check-ignore", "-q", "--no-index", planted[kind]], {
      cwd: source,
    }).status,
    0,
    `${planted[kind]} must be in an ignored location`,
  );
  git(source, ["add", "-f", "--", planted[kind]]);
}
// Provenance is part of the exported manifest. Keep this synthetic commit
// reproducible so identical source bytes share the same cross-run cache key.
ok(
  run(
    "git",
    [
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "bounded copy of the work tree with planted instance material",
    ],
    {
      cwd: source,
      env: {
        ...env,
        GIT_AUTHOR_NAME: "DotLn Fixture",
        GIT_COMMITTER_NAME: "DotLn Fixture",
        GIT_AUTHOR_EMAIL: "fixture@example.invalid",
        GIT_COMMITTER_EMAIL: "fixture@example.invalid",
        GIT_AUTHOR_DATE: "2000-01-01T00:00:00Z",
        GIT_COMMITTER_DATE: "2000-01-01T00:00:00Z",
      },
    },
  ),
  "reproducible source fixture commit",
);
const commit = git(source, ["rev-parse", "HEAD"]).stdout.trim();
git(source, ["tag", "-a", "v9.9.9-fixture", "-m", "fixture tag"]);
// The build resolves its third-party dependencies through the running
// checkout's install (the copy's lockfile is the same one) and its own
// workspaces through the copy; installed after the commit, so nothing of it is
// a blob at the exported commit.
linkInstall(source);
for (const path of Object.values(planted))
  assert.ok(
    git(source, ["ls-files", "--", path]).stdout.trim(),
    `${path} must be committed`,
  );
assert.equal(
  git(source, ["ls-files", "--", "docs/control/local/terms.txt"]).stdout,
  "",
  "the list stays in its ignored location",
);
assert.equal(
  git(source, ["ls-files", "--", "node_modules"]).stdout,
  "",
  "the install link stays out of the commit",
);
// The default export every case below reads.
const kit = join(scratch, "kit");
const exported = ok(runExport(kit), "export");

// Cache dependencies per worktree and exact exported content/lockfile. Mutable
// Git, records and workspace links always belong to the individual case.
const warmKey = sha256(
  JSON.stringify(manifestOf(kit).files) +
    readFileSync(join(kit, "package-lock.json"), "utf8"),
);
const warmParent = join(repository, ".runtime/fixtures/launchpad");
const warm = join(warmParent, warmKey);
let warmReady = false;
const warmExport = () => {
  if (warmReady) return warm;
  mkdirSync(warmParent, { recursive: true });
  ensureTemporaryRoot(warm, {
    class: "warm-fixture",
    repository,
    cacheKey: warmKey,
  });
  if (!existsSync(join(warm, "ready.json"))) {
    cpSync(kit, join(warm, "export"), {
      recursive: true,
      verbatimSymlinks: true,
      filter: (path) =>
        ![".git", "node_modules", ".runtime"].includes(basename(path)),
    });
    ok(
      run(
        "npm",
        [
          "ci",
          "--offline",
          "--no-audit",
          "--no-fund",
          "--loglevel=error",
          // The cache lives inside the checkout, so make its export the
          // install boundary without inspecting the ancestor's workspaces.
          "--prefix",
          join(warm, "export"),
        ],
        {
          cwd: join(warm, "export"),
          timeout: 300_000,
        },
      ),
      "warm export offline install",
    );
    writeFileSync(
      join(warm, "ready.json"),
      JSON.stringify({ key: warmKey }) + "\n",
    );
    console.log("Fixture install: warm cache miss (1 npm ci)");
  } else console.log("Fixture install: warm cache hit (0 npm ci)");
  writeFileSync(
    join(warmParent, "current.json"),
    JSON.stringify({ key: warmKey }) + "\n",
  );
  warmReady = true;
  return warm;
};
const linkWarmInstall = (target) =>
  linkInstall(target, join(warmExport(), "export"));
const commitWarmExport = (destination) => {
  cpSync(join(warmExport(), "export"), destination, {
    recursive: true,
    verbatimSymlinks: true,
    filter: (path) => !["node_modules", ".runtime"].includes(basename(path)),
  });
  initRepository(destination);
  git(destination, ["add", "."]);
  git(destination, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "exported launchpad",
  ]);
  linkWarmInstall(destination);
  ok(harness(destination, "emit"), "warm clone harness");
  return destination;
};

test.after(() => rmSync(scratch, { recursive: true, force: true }));

const root = typeof process.getuid === "function" && process.getuid() === 0;

export {
  repository,
  scratch,
  source,
  RUNTIME_PACKAGES,
  HARNESS_MANIFEST,
  synthetic,
  syntheticHash,
  planted,
  marker,
  plantedText,
  termsPath,
  env,
  blobId,
  run,
  ok,
  git,
  configureRepository,
  initRepository,
  commitExport,
  commitWarmExport,
  linkWarmInstall,
  runExport,
  files,
  treeSnapshot,
  linkInstall,
  manifestOf,
  harnessManifestOf,
  harness,
  importSpecifiers,
  absoluteSpecifiers,
  licenseLike,
  copy,
  write,
  commit,
  kit,
  exported,
  root,
};
