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
import { sha256Hex as sha256 } from "./lib/helpers.mjs";
import {
  chmodSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defaultRoots, loadConfig } from "./lib/config.mjs";
import { measureColdStarts } from "./lib/process-budget.mjs";
import {
  BUILD_INPUTS,
  EMIT_CLOSURE,
  KIT_FILES,
  TEST_FIXTURE_TREES,
  TEST_SUPPORT_FILES,
} from "./launchpad.mjs";
import { licenseHashes } from "./license-surfaces.mjs";
import { gateCodeIdentity, readGateChecks } from "./lib/gate-evidence.mjs";
import { hasPackageSources } from "./lib/paths.mjs";
import { suites } from "./test-runner.mjs";

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scratch = realpathSync(mkdtempSync(join(tmpdir(), "dotln-launchpad-")));
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
  assert.equal(result.status, 0, `${label}: ${result.stderr || result.stdout}`);
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
  git(destination, ["commit", "-qm", "exported launchpad"]);
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
const linkInstall = (target) => {
  mkdirSync(join(target, "node_modules/@dotln"), { recursive: true });
  for (const entry of readdirSync(join(repository, "node_modules")))
    if (![".bin", "@dotln"].includes(entry))
      symlinkSync(
        join(repository, "node_modules", entry),
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
git(source, [
  "commit",
  "-qm",
  "bounded copy of the work tree with planted instance material",
]);
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

test.after(() => rmSync(scratch, { recursive: true, force: true }));

test("WO-074 criterion 1: a destination that is not an empty directory is refused before any write", () => {
  const occupied = join(scratch, "occupied");
  mkdirSync(occupied);
  writeFileSync(join(occupied, "keep.txt"), "keep\n");
  const refusedFull = runExport(occupied);
  assert.equal(refusedFull.status, 1);
  assert.match(refusedFull.stderr, /destination is not empty/u);
  assert.deepEqual(readdirSync(occupied), ["keep.txt"]);

  const file = join(scratch, "a-file");
  writeFileSync(file, "");
  const refusedFile = runExport(file);
  assert.equal(refusedFile.status, 1);
  assert.match(
    refusedFile.stderr,
    /destination exists and is not a directory/u,
  );
  assert.equal(readFileSync(file, "utf8"), "");
});

const root = typeof process.getuid === "function" && process.getuid() === 0;
test(
  "WO-074 criterion 1: a destination that cannot be read is refused before any write",
  { skip: root ? "runs as root, for whom every directory is readable" : false },
  () => {
    const unreadable = join(scratch, "unreadable");
    mkdirSync(unreadable);
    chmodSync(unreadable, 0o000);
    try {
      const refusedRead = runExport(unreadable);
      assert.equal(refusedRead.status, 1);
      assert.match(refusedRead.stderr, /destination cannot be read/u);
    } finally {
      chmodSync(unreadable, 0o700);
    }
    assert.deepEqual(readdirSync(unreadable), []);
  },
);

test("WO-074 criterion 1: the scripts are byte-identical to UPSTREAM.md's commit, the manifest hashes verify, and the manifest lists every kit file and no seed", () => {
  assert.match(
    exported.stdout,
    /^local-terms list: present \(\d+ texts checked\)$/mu,
  );
  assert.match(
    exported.stdout,
    /^runtime: \d+ compiled files built from the commit's package sources; harness bundle: \d+ surfaces emitted and checked inside the export, \d+ manifest-listed \(CLAUDE\.md's block is checked through \.claude\/harness-manifest\.json\); snapshot \.runtime\/harness\/[0-9a-f]{16}\.$/mu,
  );
  const manifest = manifestOf(kit);
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.commit, commit);
  assert.equal(manifest.tag, "v9.9.9-fixture");
  const upstream = readFileSync(join(kit, "UPSTREAM.md"), "utf8");
  assert.ok(upstream.includes(`\`${commit}\``));
  assert.ok(upstream.includes("`v9.9.9-fixture`"));
  assert.ok(upstream.includes("`example.invalid/owner/launchpad`"));
  assert.ok(
    upstream.includes(
      `\`owner/launchpad@${commit.slice(0, 12)} docs/LEGAL.md\``,
    ),
    "the upstream pointer list names a core document the kit does not carry",
  );
  assert.ok(!existsSync(join(kit, "docs/LEGAL.md")));
  assert.match(
    upstream,
    /^- `packages\/skeleton\/package\.json`, `packages\/skeleton\/dist\/\{src,test\}\/\*\*`: \d+ files, the compiled `@dotln\/skeleton` runtime and tests/mu,
  );
  // The build-free modules stay listed one per line, outside the runtime groups.
  assert.match(upstream, /^- `packages\/skeleton\/src\/gate-evidence\.mjs`$/mu);
  assert.match(
    upstream,
    /^- `\.claude\/\*\*`, `\.agents\/\*\*`, `\.codex\/\*\*`: \d+ files, the Contributor harness bundle/mu,
  );
  const listed = new Map(
    manifest.files.map(({ path, sha256: hash }) => [path, hash]),
  );
  assert.deepEqual(
    [...listed.keys()],
    [...listed.keys()].sort(),
    "manifest paths are sorted",
  );
  for (const [path, hash] of listed)
    assert.equal(sha256(readFileSync(join(kit, path))), hash, path);
  // Every allowlisted tree and explicit file stays byte-identical to its
  // source blob; explicitly excluded core-record fixtures never travel.
  const verbatim = [...KIT_FILES.trees, ...KIT_FILES.files];
  const tree = new Map(
    git(source, ["ls-tree", "-r", "-z", commit, "--", ...verbatim])
      .stdout.split("\0")
      .filter(Boolean)
      .map((entry) => {
        const [meta, path] = entry.split("\t");
        return [path, meta.split(" ")];
      })
      .filter(([path]) => !KIT_FILES.excluded.includes(path)),
  );
  const copied = [...listed.keys()].filter(
    (path) =>
      KIT_FILES.trees.some((tree) => path.startsWith(`${tree}/`)) ||
      KIT_FILES.files.includes(path),
  );
  assert.deepEqual(copied.sort(), [...tree.keys()].sort());
  for (const path of KIT_FILES.excluded)
    assert.ok(!existsSync(join(kit, path)), path);
  for (const path of copied) {
    const [mode, , object] = tree.get(path);
    const bytes = readFileSync(join(kit, path));
    assert.equal(blobId(bytes), object, `${path} differs from ${commit}`);
    const executable = (lstatSync(join(kit, path)).mode & 0o111) !== 0;
    assert.equal(executable, mode === "100755", `${path} mode`);
  }
  for (const path of [
    "scripts/launchpad.mjs",
    "scripts/kit/CLAUDE.template.md",
    "scripts/kit/README.client.md",
    "scripts/kit/gitignore.template",
    "scripts/kit/workstream.template.md",
    "scripts/kit/repository-profile.template.md",
    "packages/skeleton/src/gate-evidence.mjs",
    "packages/compiler/src/attribution.mjs",
    "packages/kernel/package.json",
    "packages/skeleton/dist/src/harness-host.js",
    "packages/compiler/dist/src/index.js",
    ".claude/hooks/permissions.mjs",
    ".claude/settings.json",
    ".claude/skills/dotln-executor/SKILL.md",
    ".agents/skills/dotln-executor/SKILL.md",
    ".codex/config.toml",
    HARNESS_MANIFEST,
    "docs/product/07-execution-guide.md",
    "docs/product/08-publication-compiler.md",
    "docs/PLAYBOOK.md",
    "docs/publication/implementation-overlay-template.md",
    "package.json",
    "package-lock.json",
    "dotln.config.example.json",
    "UPSTREAM.md",
  ])
    assert.ok(listed.has(path), `${path} is a kit file`);
  // Every emitted surface but the operating contract is listed, at the bytes
  // the export's own emit wrote.
  for (const file of harnessManifestOf(kit).installed)
    assert.equal(
      listed.has(file.path),
      file.path !== "CLAUDE.md",
      `${file.path} manifest listing`,
    );
  // What the manifest does not list is a seed, the manifest or the symlink.
  const unlisted = files(kit)
    .filter((path) => !listed.has(path))
    .sort();
  assert.deepEqual(unlisted, [
    ".gitignore",
    "AGENTS.md",
    "AI-HARNESS-SECURITY.md",
    "CLAUDE.md",
    "KIT-MANIFEST.json",
    "README.md",
    "docs/README.md",
    "docs/control/README.md",
    "docs/control/budgets.json",
    "docs/control/doc-baseline.json",
    "docs/control/doc-ceilings.json",
    "docs/decisions/README.md",
    "docs/discovery/README.md",
    "docs/evidence/README.md",
    "docs/final-reviews/README.md",
    "docs/intake/.gitkeep",
    "docs/lineage/idea-ledger.md",
    "docs/observations/README.md",
    "docs/planning/README.md",
    "docs/planning/followups.json",
    "docs/planning/sequence.md",
    "docs/product/README.md",
    "docs/publication/README.md",
    "docs/releases/README.md",
    "docs/repositories/README.md",
    "docs/verifications/README.md",
    "docs/work-orders/WO-001-environment-truth.md",
    "docs/workstreams/README.md",
    "packages/skeleton/loadouts/grants.json",
  ]);
  // Generator-owned READMEs are not seeded: the index and the lineage index
  // would refuse a hand-written file at their paths.
  assert.ok(!existsSync(join(kit, "docs/work-orders/README.md")));
  assert.ok(!existsSync(join(kit, "docs/lineage/README.md")));
  assert.equal(readlinkSync(join(kit, "AGENTS.md")), "CLAUDE.md");
  const contract = readFileSync(join(kit, "CLAUDE.md"), "utf8");
  const block = /<!-- dotln-kit:start -->([\s\S]*)<!-- dotln-kit:end -->/u.exec(
    contract,
  );
  assert.ok(block, "the generated block is marked");
  assert.match(block[1], /UPSTREAM\.md/u);
  assert.match(block[1], /KIT-MANIFEST\.json/u);
  assert.doesNotMatch(
    block[1],
    /\{\{|[0-9a-f]{40}/u,
    "the block carries no placeholder and no commit",
  );
  // The floor directs each role to its generated skill, so a session's
  // directed-read set holds the skill the resume phrase selects (WO-075).
  for (const role of [
    "executor",
    "verifier",
    "reviewer",
    "release-close",
    "planner",
  ])
    assert.ok(
      contract.includes(
        "Read[" + role + "]: `@skills/dotln-" + role + "/SKILL.md`",
      ),
      role + " directive",
    );
  // The harness block follows the floor and the kit block, once.
  assert.equal(contract.split("<!-- dotln-harness:start -->").length, 2);
  assert.ok(
    contract.indexOf("<!-- dotln-kit:end -->") <
      contract.indexOf("<!-- dotln-harness:start -->"),
  );
  // The configuration example is today's layout, byte for byte.
  const configured = join(scratch, "configured");
  mkdirSync(configured);
  cpSync(
    join(kit, "dotln.config.example.json"),
    join(configured, "dotln.config.json"),
  );
  const config = loadConfig(configured);
  assert.deepEqual(config.roots, defaultRoots());
  assert.deepEqual(config.derivedOrders, { first: "WO-900", last: "WO-999" });
  // A starter commits its runtime: the kit never ignores dist (WO-075).
  const ignore = readFileSync(join(kit, ".gitignore"), "utf8").split("\n");
  assert.ok(!ignore.some((line) => /^\/?dist\/?$|tsbuildinfo/u.test(line)));
  assert.ok(ignore.includes("/.runtime/"));
  assert.ok(ignore.includes("/docs/control/local/"));
  assert.ok(ignore.includes("node_modules/"));
  // The export is its own repository on main with no commit yet (WO-075).
  assert.equal(
    realpathSync(git(kit, ["rev-parse", "--show-toplevel"]).stdout.trim()),
    realpathSync(kit),
  );
  assert.equal(git(kit, ["branch", "--show-current"]).stdout.trim(), "main");
  assert.notEqual(run("git", ["rev-parse", "HEAD"], { cwd: kit }).status, 0);
});

test("WO-074 criterion 1: an offline npm ci against the exported lockfile succeeds", () => {
  const lock = JSON.parse(readFileSync(join(kit, "package-lock.json"), "utf8"));
  const kitPackage = JSON.parse(
    readFileSync(join(kit, "package.json"), "utf8"),
  );
  const corePackage = JSON.parse(
    readFileSync(join(repository, "package.json"), "utf8"),
  );
  assert.deepEqual(kitPackage.scripts, corePackage.scripts);
  assert.deepEqual(kitPackage.devDependencies, corePackage.devDependencies);
  assert.equal(kitPackage.private, true);
  assert.equal(kitPackage.license, "Apache-2.0");
  assert.deepEqual(
    lock.packages[""].devDependencies,
    corePackage.devDependencies,
  );
  const workspaces = ["beacons", ...RUNTIME_PACKAGES];
  for (const key of Object.keys(lock.packages))
    assert.ok(
      key === "" ||
        key.startsWith("node_modules/") ||
        workspaces.some((name) => key === `packages/${name}`),
      `${key} is not a kit lockfile entry`,
    );
  for (const name of workspaces) {
    assert.ok(lock.packages[`packages/${name}`], `packages/${name} entry`);
    assert.equal(lock.packages[`node_modules/@dotln/${name}`]?.link, true);
  }
  assert.ok(
    !Object.keys(lock.packages).some((key) =>
      /browser-evidence|playwright/u.test(key),
    ),
  );
  // The export seeded the workspace links its own emit needed; the install
  // replaces them with the same links.
  for (const name of workspaces)
    assert.equal(
      readlinkSync(join(kit, `node_modules/@dotln/${name}`)),
      `../../packages/${name}`,
    );
  const install = run(
    "npm",
    ["ci", "--offline", "--no-audit", "--no-fund", "--loglevel=error"],
    { cwd: kit, timeout: 300_000 },
  );
  assert.equal(install.status, 0, install.stderr || install.stdout);
  for (const name of ["prettier", "typescript", "@types/node"])
    assert.ok(existsSync(join(kit, "node_modules", name)), name);
  for (const name of workspaces)
    assert.equal(
      readlinkSync(join(kit, `node_modules/@dotln/${name}`))
        .replace(/\/$/u, "")
        .split("/")
        .slice(-2)
        .join("/"),
      `packages/${name}`,
    );
});

test("WO-075 criterion 1: the exported runtime is byte-identical to a rebuild at the named commit, sits at the paths the scripts import, is manifest-listed and holds no package source", () => {
  const listed = new Set(manifestOf(kit).files.map(({ path }) => path));
  const runtimePaths = [...listed].filter((path) =>
    /^packages\/(?:kernel|compiler|skeleton|console)\/dist\/(?:src|test)\//u.test(
      path,
    ),
  );
  assert.ok(runtimePaths.length >= 200, `${runtimePaths.length} runtime files`);
  for (const path of files(kit)) {
    // packages/beacons is a build-free workspace exported whole (WO-074); its
    // declaration file is a kit file, not package source to compile.
    assert.doesNotMatch(
      path,
      /^packages\/(?!beacons\/)[^/]+\/src\/.*\.(?:[cm]?ts|tsx)$/u,
      path,
    );
    assert.doesNotMatch(path, /\.tsbuildinfo$/u, path);
    if (/^packages\/[^/]+\/dist\//u.test(path))
      assert.ok(listed.has(path), `${path} is manifest-listed`);
    if (path.startsWith("packages/"))
      assert.ok(
        /^packages\/(?:beacons|kernel|compiler|skeleton|console)\//u.test(path),
        `${path} belongs to a kit workspace`,
      );
  }
  assert.ok(!existsSync(join(kit, "packages/skeleton/src/planted.d.ts")));
  assert.ok(!existsSync(join(kit, "packages/skeleton/dist/src/planted.d.ts")));
  // The pinned runtime files the hooks import are among them, at the paths
  // core's scripts read.
  const profile = harnessManifestOf(kit).profiles[0].profile;
  for (const file of profile.runtime.files)
    assert.ok(listed.has(file.path), `${file.path} is a pinned runtime file`);
  // The rebuild: a clone at the commit, the same install, the same build.
  const clone = join(scratch, "rebuild");
  git(scratch, ["clone", "-q", source, clone]);
  git(clone, ["checkout", "-q", commit]);
  assert.ok(!existsSync(join(clone, "packages/kernel/dist")));
  linkInstall(clone);
  ok(
    run(process.execPath, ["scripts/build.mjs"], { cwd: clone }),
    "rebuild at the commit",
  );
  for (const path of runtimePaths)
    assert.ok(
      readFileSync(join(kit, path)).equals(readFileSync(join(clone, path))),
      `${path} differs from the rebuild at ${commit}`,
    );
  for (const name of RUNTIME_PACKAGES) {
    const built = ["src", "test"]
      .flatMap((output) =>
        files(join(clone, `packages/${name}/dist/${output}`))
          .filter((path) => !path.endsWith(".tsbuildinfo"))
          .map((path) => `packages/${name}/dist/${output}/${path}`),
      )
      .sort();
    assert.deepEqual(
      runtimePaths
        .filter((path) => path.startsWith(`packages/${name}/`))
        .sort(),
      built,
      `${name}: the kit carries exactly the rebuilt dist/src and dist/test`,
    );
  }
});

test("WO-201 criterion 4: verify checks runtime and compiled tests, and reports other kit edits without refusing", () => {
  const verify = (args = [], cwd = kit) =>
    run(
      process.execPath,
      [join(kit, "scripts/launchpad.mjs"), "verify", ...args],
      { cwd },
    );
  const fresh = ok(verify(), "fresh manifest");
  assert.match(
    fresh.stdout,
    new RegExp(`^kit: \\d+ files verified at ${commit}$`, "m"),
  );
  ok(verify([kit], scratch), "explicit directory");
  ok(
    run(process.execPath, [join(kit, "scripts/launchpad.mjs"), "verify"], {
      cwd: kit,
      env: { ...env, DOTLN_LAUNCHPAD: source },
    }),
    "verify the current kit even with an external launchpad override",
  );
  for (const output of ["src", "test"]) {
    const path = manifestOf(kit).files.find(
      ({ path }) =>
        path.startsWith(`packages/kernel/dist/${output}/`) &&
        path.endsWith(".js"),
    ).path;
    const original = readFileSync(join(kit, path));
    try {
      const changed = Buffer.from(original);
      changed[0] ^= 1;
      writeFileSync(join(kit, path), changed);
      const refused = verify();
      assert.equal(refused.status, 1, refused.stdout);
      assert.ok(refused.stderr.includes(path), refused.stderr);
    } finally {
      writeFileSync(join(kit, path), original);
    }
  }
  const script = join(kit, "scripts/bootstrap.mjs");
  const original = readFileSync(script);
  try {
    writeFileSync(
      script,
      Buffer.concat([original, Buffer.from("\n// Instance edit.\n")]),
    );
    const advisory = ok(verify(), "edited kit file");
    assert.equal(
      advisory.stdout
        .split("\n")
        .filter((line) => line.includes("kit files differ")).length,
      1,
    );
    assert.match(
      advisory.stdout,
      /^kit: 1 kit files differ from the manifest$/m,
    );
  } finally {
    writeFileSync(script, original);
  }
});

test("WO-201 criteria 1 to 3: the three gate selections run inside an export", (t) => {
  const started = performance.now();
  const destination = commitExport(join(scratch, "gate-kit"));
  // With no main comparison ref, review selects every machinery row. This
  // makes the three selections together exercise the entire carried inventory.
  git(destination, ["branch", "-m", "instance"]);
  assert.equal(hasPackageSources(destination), false);
  ok(
    run(
      "npm",
      ["ci", "--offline", "--no-audit", "--no-fund", "--loglevel=error"],
      { cwd: destination },
    ),
    "gate kit offline install",
  );
  // Follow the kit's documented first steps: activation creates this
  // instance's own indexes, without importing any of core's control history.
  ok(
    run(
      process.execPath,
      [
        "scripts/resume.mjs",
        "activate",
        "WO-001",
        "docs/work-orders/WO-001-environment-truth.md",
      ],
      { cwd: destination },
    ),
    "activate the kit's first order",
  );
  ok(
    run(process.execPath, ["scripts/meta.mjs"], { cwd: destination }),
    "generate the instance decision index",
  );
  ok(
    run(process.execPath, ["scripts/lineage.mjs", "index"], {
      cwd: destination,
    }),
    "generate the instance lineage index",
  );
  const notCarried = suites
    .filter((row) => row.kit)
    .map(
      (row) =>
        `kit: ${row.name} not carried (${row.kit.slice("core-only: ".length)})`,
    )
    .sort();
  const exclusions = (text) =>
    text
      .split("\n")
      .filter((line) => /^kit: .+ not carried \(/u.test(line))
      .sort();
  const inventory = suites
    .filter((row) => !row.kit)
    .map((row) => (row.build ? "kit-verify" : row.name))
    .sort();
  const selections = [
    { command: ["test"], args: [] },
    { command: ["run", "test:docs"], args: ["--document"] },
    { command: ["test", "--", "--review"], args: ["--review"] },
  ];
  const observed = [];
  const ran = new Set();
  for (const { command, args } of selections) {
    const list = ok(
      run(process.execPath, ["scripts/test-runner.mjs", ...args, "--list"], {
        cwd: destination,
      }),
      "kit suite list",
    );
    assert.deepEqual(exclusions(list.stdout), notCarried);
    const names = list.stdout
      .split("\n")
      .filter((line) => line.includes(" — protects:"))
      .map((line) => line.split(" — ")[0]);
    assert.equal(names[0], "kit-verify");
    assert.ok(!names.includes("build"));
    // These suites use carried inputs and create their own fixture records.
    // Keep them in both product selections even if the declarations change.
    if (!args.includes("--document"))
      for (const name of ["publication-fixtures", "beacon-portability"])
        assert.ok(names.includes(name), `${name} must run in the kit`);
    const before = gateCodeIdentity(destination);
    const selectionStarted = performance.now();
    const result = ok(
      run(
        process.execPath,
        ["scripts/harness.mjs", "bounded", "--", "npm", ...command],
        { cwd: destination },
      ),
      `kit npm ${command.join(" ")}`,
    );
    assert.deepEqual(exclusions(result.stdout), notCarried);
    assert.doesNotMatch(
      result.stdout,
      /PROGRESS \[build\]|scripts\/build\.mjs/u,
    );
    const first = /^PROGRESS \[(?!bounded-probe\])([^\]]+)\]/mu.exec(
      result.stdout,
    );
    assert.equal(first?.[1], "kit-verify", result.stdout);
    const row = readGateChecks(destination).at(-1);
    assert.equal(row.exitCode, 0);
    assert.equal(row.codeIdentity, before);
    assert.equal(gateCodeIdentity(destination), before);
    assert.deepEqual(
      row.cases.map((suite) => suite.name).sort(),
      [...names].sort(),
    );
    for (const suite of row.cases) ran.add(suite.name);
    observed.push({
      command: `npm ${command.join(" ")}`,
      wallDurationMs: Math.round(performance.now() - selectionStarted),
      firstTask: first[1],
      gate: {
        checkId: row.checkId,
        treeHash: row.treeHash,
        codeIdentity: row.codeIdentity,
        evidenceRef: row.evidenceRef,
        recordedAt: row.recordedAt,
        durationMs: row.durationMs,
        exitCode: row.exitCode,
        executed: row.executed,
        identityUnchanged: row.identityUnchanged,
        executionMode: row.executionMode,
        requiredSuites: row.requiredSuites,
        cases: row.cases.map((suite) => ({
          name: suite.name,
          durationMs: suite.durationMs,
          exitCode: suite.exitCode,
          executed: suite.executed,
          reused: Boolean(suite.reused),
          ...(suite.sourceRow
            ? {
                sourceRow: {
                  task: suite.sourceRow.task,
                  recordedAt: suite.sourceRow.recordedAt,
                  codeIdentity: suite.sourceRow.codeIdentity,
                  evidenceRef: suite.sourceRow.evidenceRef,
                },
              }
            : {}),
        })),
      },
    });
  }
  assert.deepEqual([...ran].sort(), inventory);
  const readme = readFileSync(join(destination, "README.md"), "utf8")
    .split("## What runs here, and what does not")[1]
    .split("## Attestations")[0];
  for (const row of suites.filter((row) => row.kit))
    assert.ok(
      readme.includes(
        `| \`${row.name}\` | ${row.kit.slice("core-only: ".length)} |`,
      ),
      `README omission: ${row.name}`,
    );
  for (const { command, gate } of observed) {
    const declared = `- \`${command}\`: ${gate.requiredSuites.map((name) => `\`${name}\``).join(", ")}.`;
    assert.ok(
      readme.includes(declared),
      `README selection differs: ${command}`,
    );
  }
  const unavailableSelections = [];
  for (const name of ["release-surfaces", "runner-fixtures"]) {
    const before = readGateChecks(destination);
    const result = run(
      process.execPath,
      [
        "scripts/harness.mjs",
        "bounded",
        "--",
        "npm",
        "test",
        "--",
        "--only",
        name,
      ],
      { cwd: destination },
    );
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.ok(
      (result.stdout + result.stderr).includes(
        `Suite ${name} is not carried in this kit (${suites.find((row) => row.name === name).kit})`,
      ),
      result.stdout + result.stderr,
    );
    assert.deepEqual(readGateChecks(destination), before);
    unavailableSelections.push({
      name,
      exitCode: result.status,
      gateRecorded: false,
    });
  }
  const editedScript = join(destination, "scripts/bootstrap.mjs");
  const scriptBytes = readFileSync(editedScript);
  try {
    writeFileSync(
      editedScript,
      Buffer.concat([scriptBytes, Buffer.from("\n// Instance edit.\n")]),
    );
    const advisory = ok(
      run(
        process.execPath,
        [
          "scripts/harness.mjs",
          "bounded",
          "--",
          "npm",
          "test",
          "--",
          "--only",
          "kit-verify",
        ],
        { cwd: destination },
      ),
      "gate forwards edited-kit advisory",
    );
    assert.match(
      advisory.stdout,
      /\[kit-verify\] kit: 1 kit files differ from the manifest/u,
    );
  } finally {
    writeFileSync(editedScript, scriptBytes);
  }
  const listed = manifestOf(destination).files;
  const changedPath = listed.find(
    ({ path }) =>
      path.startsWith("packages/kernel/dist/test/") && path.endsWith(".js"),
  ).path;
  const original = readFileSync(join(destination, changedPath));
  const identity = gateCodeIdentity(destination);
  let refused;
  try {
    const changed = Buffer.from(original);
    changed[0] ^= 1;
    writeFileSync(join(destination, changedPath), changed);
    assert.notEqual(
      gateCodeIdentity(destination),
      identity,
      "the ordinary gate identity includes tracked compiled tests",
    );
    refused = run(
      process.execPath,
      ["scripts/harness.mjs", "bounded", "--", "npm", "test"],
      { cwd: destination },
    );
    assert.equal(refused.status, 1);
    assert.ok(
      refused.stdout.includes(changedPath),
      refused.stdout + refused.stderr,
    );
    const failure = readGateChecks(destination).at(-1);
    assert.equal(
      failure.cases.find((row) => row.name === "kit-verify").exitCode,
      1,
    );
    assert.ok(
      failure.cases
        .filter((row) => row.executed)
        .every((row) => row.name === "kit-verify"),
    );
  } finally {
    writeFileSync(join(destination, changedPath), original);
  }
  assert.equal(gateCodeIdentity(destination), identity);
  const bytes = (entries) =>
    entries.reduce(
      (sum, { path }) => sum + readFileSync(join(destination, path)).length,
      0,
    );
  const added = listed.filter(
    ({ path }) =>
      /^packages\/[^/]+\/dist\/test\//u.test(path) ||
      TEST_FIXTURE_TREES.some((tree) => path.startsWith(`${tree}/`)) ||
      TEST_SUPPORT_FILES.includes(path),
  );
  const excludedFixtureBytes = readFileSync(
    join(source, KIT_FILES.excluded[0]),
  ).length;
  t.diagnostic(
    `WO201_GATE_IN_KIT ${JSON.stringify({ selections: observed, notCarried, carried: inventory, unavailableSelections, refusal: { path: changedPath, exitCode: refused.status, trackedCodeIdentityChanged: true }, kitFiles: listed.length, kitBytes: bytes(listed), addedFiles: added.length, addedBytes: bytes(added), excludedFixtureBytes, netFileSetGrowthBytes: bytes(added) - excludedFixtureBytes, durationMs: Math.round(performance.now() - started) })}`,
  );
});

test("WO-075 criterion 2: harness check passes inside the export and refuses a one-byte drift, no hook imports by absolute path, the snapshot is ignored, a second emit changes no listed byte, and every installed Read directive resolves", () => {
  const check = () => harness(kit, "check");
  assert.match(
    ok(check(), "harness check").stdout,
    /^harness check: \d+ generated surfaces/mu,
  );
  const manifest = manifestOf(kit);
  const hooks = manifest.files
    .map(({ path }) => path)
    .filter((path) => /^\.(?:claude|codex)\/hooks\/.*\.mjs$/u.test(path));
  assert.ok(hooks.length >= 14, `${hooks.length} hooks`);
  const snapshot = harnessManifestOf(kit).profiles[0].profile.runtime.snapshot;
  assert.match(snapshot, /^\.runtime\/harness\/[0-9a-f]{16}$/u);
  // The scanner itself rejects the compiler's absolute forms (WO-049's
  // target import root emits file: URLs) and admits the relative ones.
  assert.deepEqual(
    absoluteSpecifiers(
      'await import(new URL("file:///launchpad/.runtime/harness/x/packages/skeleton/dist/src/harness-host.js"));\nimport("/abs/path.js"); import { a } from "/abs/b.js"; import("node:fs"); import("../../.runtime/harness/x/a.js"); import { b } from "./c.js";',
    ).sort((a, b) => a.localeCompare(b)),
    [
      "/abs/b.js",
      "/abs/path.js",
      "file:///launchpad/.runtime/harness/x/packages/skeleton/dist/src/harness-host.js",
    ].sort((a, b) => a.localeCompare(b)),
  );
  let relativeImports = 0;
  for (const path of hooks) {
    const text = readFileSync(join(kit, path), "utf8");
    assert.deepEqual(
      absoluteSpecifiers(text),
      [],
      `${path} imports by an absolute specifier`,
    );
    assert.ok(importSpecifiers(text).length > 0, `${path} imports nothing`);
    if (text.includes(`../../${snapshot}/packages/skeleton/dist/src/`))
      relativeImports += 1;
  }
  assert.ok(relativeImports > 0, "hooks import the snapshot by relative path");
  assert.ok(
    existsSync(
      join(kit, snapshot, "packages/skeleton/dist/src/harness-host.js"),
    ),
  );
  assert.equal(
    run("git", ["check-ignore", "-q", snapshot], { cwd: kit }).status,
    0,
    "the snapshot is ignored",
  );
  // One byte of drift in an emitted hook is refused by name; the restored
  // bytes pass again.
  const hook = join(kit, ".claude/hooks/no-attribution.mjs");
  const original = readFileSync(hook);
  writeFileSync(hook, Buffer.concat([original, Buffer.from(" ")]));
  try {
    const drifted = check();
    assert.equal(drifted.status, 1);
    assert.match(
      drifted.stderr + drifted.stdout,
      /harness drift: \.claude\/hooks\/no-attribution\.mjs/u,
    );
  } finally {
    writeFileSync(hook, original);
  }
  ok(check(), "harness check after the restore");
  // The export's own emit reproduces every listed byte.
  const before = new Map(
    manifest.files.map(({ path }) => [
      path,
      sha256(readFileSync(join(kit, path))),
    ]),
  );
  assert.match(
    ok(harness(kit, "emit"), "second emit").stdout,
    /^harness emit: \d+ generated surfaces/mu,
  );
  for (const [path, hash] of before)
    assert.equal(
      sha256(readFileSync(join(kit, path))),
      hash,
      `${path} changed on re-emit`,
    );
  assert.equal(
    sha256(readFileSync(join(kit, "KIT-MANIFEST.json"))),
    sha256(JSON.stringify(manifest, null, 2) + "\n"),
  );
  // Every Read directive of the installed floor and role skills names a
  // document the kit carries (the reviewer skill cites product 08).
  ok(
    run(process.execPath, ["scripts/harness-context.mjs", "--check"], {
      cwd: kit,
    }),
    "harness-context --check inside the export",
  );
});

// Reads core's installed CLAUDE.md, skills and budgets, which a product task
// may not read: the document gate runs this case (test-runner's launchpad-docs
// row), the product gate skips it.
test("[document] WO-075 criterion 4: the cold-start bytes of each role inside the export are not larger than core's", () => {
  const inside = measureColdStarts(kit);
  const core = measureColdStarts(repository);
  assert.ok(inside.instruction.bytes > 0);
  assert.ok(inside.instruction.bytes <= core.instruction.bytes);
  let compared = 0;
  for (const row of inside.profiles) {
    const match = core.profiles.find(
      (candidate) =>
        candidate.role === row.role && candidate.skillsRoot === row.skillsRoot,
    );
    if (row.bytes === null) continue;
    assert.ok(
      match?.bytes != null,
      `${row.skillsRoot}/${row.role}: core has no row`,
    );
    assert.equal(
      row.skillBytes,
      match.skillBytes,
      `${row.skillsRoot}/${row.role}: the skill differs from core's`,
    );
    assert.ok(
      row.bytes <= match.bytes,
      `${row.role}: export ${row.bytes} bytes against core ${match.bytes}`,
    );
    compared += 1;
  }
  assert.equal(
    compared,
    inside.profiles.filter((row) => row.bytes !== null).length,
    "every installed role in the export was compared",
  );
  assert.ok(compared > 0);
});

test("WO-074 criteria 1, 2 and 5: without package source the export activates its first order, a transition emits a decodable control Beacon, an unmatched attestation records with the advisory, and a Codex dispatch reserves its writer on the carried runtime", async () => {
  assert.ok(
    !files(kit).some((path) => /^packages\/[^/]+\/src\/.*\.ts$/u.test(path)),
    "no TypeScript source in the export",
  );
  // "package source" is TypeScript source (step 1): the skeleton holds the
  // build-free modules the scripts import, the empty grants seed, its
  // package.json and the compiled dist/src (WO-075).
  const skeleton = files(kit)
    .filter((path) => path.startsWith("packages/skeleton/"))
    .sort();
  assert.deepEqual(
    skeleton.filter(
      (path) => !/^packages\/skeleton\/(?:dist|fixtures)\//u.test(path),
    ),
    [
      "packages/skeleton/loadouts/grants.json",
      "packages/skeleton/package.json",
      "packages/skeleton/src/correction-observation.mjs",
      "packages/skeleton/src/evidence-editions.mjs",
      "packages/skeleton/src/gate-deadlines.mjs",
      "packages/skeleton/src/gate-evidence.mjs",
      "packages/skeleton/src/usage-observation.mjs",
      "packages/skeleton/src/writer-teardown.mjs",
    ],
  );
  configureRepository(kit);
  git(kit, ["add", "."]);
  git(kit, ["commit", "-qm", "exported launchpad"]);
  assert.equal(
    git(kit, ["ls-files", "--", ".runtime", "node_modules"]).stdout,
    "",
    "the snapshot and the install stay out of the fork's first commit",
  );
  const resume = (args, options = {}) =>
    run(process.execPath, [join(kit, "scripts/resume.mjs"), ...args], {
      cwd: kit,
      ...options,
    });
  ok(
    resume([
      "activate",
      "WO-001",
      "docs/work-orders/WO-001-environment-truth.md",
    ]),
    "activate",
  );
  const status = JSON.parse(ok(resume(["status", "--json"]), "status").stdout);
  assert.equal(status.workOrder, "WO-001");
  assert.equal(status.phase, "active");
  assert.equal(status.latestVerdict, null);
  // Activation refreshed the generated index at the seeded sequence.
  assert.ok(existsSync(join(kit, "docs/work-orders/README.md")));
  const { controlBeaconAddress, controlBeaconDirectory } = await import(
    pathToFileURL(join(kit, "packages/beacons/src/control-beacon-fs.mjs")).href
  );
  const { decodeSignalSize } = await import(
    pathToFileURL(join(kit, "packages/beacons/src/control-codebook.mjs")).href
  );
  for (const audience of ["public", "verifier"]) {
    const path = join(
      controlBeaconDirectory(kit, audience),
      controlBeaconAddress("WO-001"),
    );
    const metadata = lstatSync(path, { bigint: true });
    assert.deepEqual(decodeSignalSize(metadata.size), {
      status: "decoded",
      state: {
        codebookVersion: 2,
        phase: "active",
        latestVerdict: "unknown",
        effort: "unknown",
        provenance: "host-projected",
      },
    });
  }
  // Criterion 5: the export's discovery record lacks every version.
  assert.ok(!existsSync(join(kit, "docs/discovery/environment.json")));
  mkdirSync(join(kit, "docs/evidence/WO-001"), { recursive: true });
  writeFileSync(
    join(kit, "docs/evidence/WO-001/handoff.md"),
    "# WO-001 handoff (fixture)\n\n**Criterion 1:** unmet — fixture.\n**Criterion 2:** unmet — fixture.\n**Criterion 3:** unmet — fixture.\n**Criterion 4:** unmet — fixture.\n**Criterion 5:** unmet — fixture.\n\nself-review: found 0; fixed 0; recorded 0\n",
  );
  git(kit, ["add", "."]);
  git(kit, ["commit", "-qm", "fixture handoff"]);
  const ready = ok(
    resume([
      "implementation-ready",
      "--harness",
      "claude-code",
      "--harness-version",
      "0.0.0-fixture",
      "--model",
      "fixture-model",
      "--effort",
      "xhigh",
      "--source",
      "operator-attested",
    ]),
    "implementation-ready",
  );
  assert.match(
    ready.stderr,
    /Advisory: attestation recorded as supplied; claude-code 0\.0\.0-fixture effort xhigh has no matching discovery observation\./u,
  );
  const after = JSON.parse(ok(resume(["status", "--json"]), "status").stdout);
  assert.equal(after.phase, "ready-to-verify");
  assert.deepEqual(
    { ...after.latestAttestation, accountLabel: undefined },
    {
      harness: "claude-code",
      harnessVersion: "0.0.0-fixture",
      model: "fixture-model",
      effort: "xhigh",
      source: "operator-attested",
      accountLabel: undefined,
    },
  );
  const readme = readFileSync(join(kit, "README.md"), "utf8");
  assert.match(readme, /a fresh fork has none/u);
  assert.match(readme, /has no matching discovery observation/u);
  assert.match(readme, /until this instance records its own discovery/u);
  // A discovery record that lacks the attested version still advises; one
  // that holds it, observed with the effort, does not.
  mkdirSync(join(kit, "docs/discovery"), { recursive: true });
  writeFileSync(
    join(kit, "docs/discovery/environment.json"),
    JSON.stringify({
      effortReadbackProbe: {
        harnesses: {
          "claude-code": {
            versions: [{ classification: "observed", value: "9.9.9" }],
            effectiveEffortReadback: {
              classification: "observed",
              values: ["xhigh"],
            },
          },
        },
      },
    }),
  );
  const attest = (version) =>
    run(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        'const { parseActor } = await import(process.argv[1]); parseActor("fixture", ["--harness", "claude-code", "--harness-version", process.argv[2], "--model", "fixture-model", "--effort", "xhigh", "--source", "operator-attested"]);',
        pathToFileURL(join(kit, "scripts/resume.mjs")).href,
        version,
      ],
      { cwd: kit },
    );
  const lacking = ok(attest("0.0.0-fixture"), "attest an unrecorded version");
  assert.match(
    lacking.stderr,
    /Advisory: attestation recorded as supplied; claude-code 0\.0\.0-fixture effort xhigh has no matching discovery observation\./u,
  );
  const recorded = ok(attest("9.9.9"), "attest a recorded version");
  assert.doesNotMatch(
    recorded.stderr,
    /Advisory: attestation recorded as supplied/u,
  );
  rmSync(join(kit, "docs/discovery/environment.json"));
  // A Codex session's dispatch needs the writer reservation the runtime
  // provides; with the carried runtime it reserves the writer and records
  // the request (WO-075; WO-074 asserted the refusal without a build).
  const codex = resume(["verify"], {
    env: { ...env, CODEX_THREAD_ID: "fixture-thread" },
  });
  assert.equal(codex.status, 0, codex.stderr || codex.stdout);
  assert.doesNotMatch(
    codex.stderr + codex.stdout,
    /harness runtime is not built/u,
  );
  assert.match(codex.stdout, /^DotLn session: fixture-thread\./mu);
  assert.equal(
    JSON.parse(ok(resume(["status", "--json"]), "status").stdout).phase,
    "verifying",
  );
  const writer = JSON.parse(
    ok(harness(kit, "writer", ["--show"]), "writer --show").stdout,
  );
  assert.equal(writer.reserved, true);
  assert.equal(
    writer.actorId,
    createHash("sha256").update("fixture-thread").digest("hex"),
    "the reservation belongs to the dispatch thread",
  );
  assert.ok(["codex-host", "thread"].includes(writer.owner?.source));
  if (writer.owner.source === "thread") {
    assert.equal(writer.owner.pid, undefined);
    assert.equal(writer.alive, "unknown");
  } else {
    assert.ok(Number.isSafeInteger(writer.owner.pid) && writer.owner.pid > 0);
    assert.equal(writer.alive, true);
  }
});

test("WO-074 criterion 3: the export holds no planted instance material and the manifest lists no instance path", () => {
  const needles = [...Object.keys(planted).map(marker), syntheticHash];
  for (const path of files(kit)) {
    if (lstatSync(join(kit, path)).isSymbolicLink()) continue;
    const bytes = readFileSync(join(kit, path));
    for (const needle of needles)
      assert.ok(!bytes.includes(needle), `${path} carries ${needle}`);
    assert.notEqual(sha256(bytes), syntheticHash, `${path} is the list`);
  }
  for (const [kind, path] of Object.entries(planted))
    assert.ok(
      !existsSync(join(kit, path)),
      `${kind} plant ${path} was exported`,
    );
  assert.ok(!existsSync(join(kit, "docs/control/local/terms.txt")));
  // The emitted harness surfaces are kit files; the operator-owned local
  // settings file, the Beacon outputs and the runtime lane are instance paths.
  const instance = [
    "dotln.config.json",
    "docs/control/",
    "docs/work-orders/",
    "docs/evidence/",
    "docs/verifications/",
    "docs/final-reviews/",
    "docs/workstreams/",
    "docs/repositories/",
    "docs/planning/",
    "docs/intake/",
    ".claude/settings.local.json",
    ".beacons/",
    ".control-beacons/",
    ".runtime/",
    "node_modules/",
  ];
  for (const { path } of manifestOf(kit).files) {
    assert.ok(
      !instance.some((prefix) => path === prefix || path.startsWith(prefix)),
      `${path} is an instance path`,
    );
    assert.ok(!/^packages\/[^/]+\/src\/.*\.ts$/u.test(path), path);
  }
});

test("WO-074 criterion 3: the local-terms check runs over every exported text and prints present, unavailable, or refuses", () => {
  // Present: the synthetic list with no match (the default export above).
  assert.match(
    exported.stdout,
    /^local-terms list: present \(\d+ texts checked\)$/mu,
  );
  assert.doesNotMatch(
    exported.stdout + exported.stderr,
    new RegExp(synthetic.trim(), "u"),
  );
  try {
    // Unavailable: no list, and the summary says no text was checked.
    rmSync(termsPath);
    const absent = ok(
      runExport(join(scratch, "kit-no-list")),
      "export without a list",
    );
    assert.match(
      absent.stdout,
      /^local-terms list: unavailable; no text was checked against a local-terms list$/mu,
    );
    assert.doesNotMatch(absent.stdout, /texts checked/u);
    // Empty: the list is present but holds no term.
    writeFileSync(termsPath, "# only a comment\n\n");
    const emptyTarget = join(scratch, "kit-empty-list");
    const empty = runExport(emptyTarget);
    assert.equal(empty.status, 1);
    assert.match(
      empty.stderr,
      /local-terms list is present but empty or malformed/u,
    );
    assert.ok(!existsSync(emptyTarget), "a refused export writes nothing");
    // A match: refused by file and line, the term never printed.
    writeFileSync(termsPath, "attestations\n");
    const matchTarget = join(scratch, "kit-match");
    const matched = runExport(matchTarget);
    assert.equal(matched.status, 1);
    assert.match(matched.stderr, /local-terms list present; refused \[/u);
    assert.match(matched.stderr, /"file":"README\.md","line":\d+/u);
    assert.doesNotMatch(matched.stderr + matched.stdout, /attestations/u);
    assert.ok(!existsSync(matchTarget), "a refused export writes nothing");
    // A term in the emitted role skills is refused before any write too, and
    // the refusal names a bundle path: the bundle is screened at the bytes
    // the export's emit reproduces.
    writeFileSync(termsPath, "fail-conservative-correction\n");
    const bundleTarget = join(scratch, "kit-bundle-match");
    const bundleMatched = runExport(bundleTarget);
    assert.equal(bundleMatched.status, 1);
    assert.match(bundleMatched.stderr, /local-terms list present; refused \[/u);
    assert.match(
      bundleMatched.stderr,
      /"file":"\.claude\/skills\/dotln-[a-z-]+\/SKILL\.md"/u,
    );
    assert.ok(!existsSync(bundleTarget), "a refused export writes nothing");
  } finally {
    writeFileSync(termsPath, synthetic);
  }
});

test("WO-074 criterion 4: the license files are core's pinned bytes and manifest-listed; --license none writes only LICENSE-PENDING.md", () => {
  const listed = new Set(manifestOf(kit).files.map(({ path }) => path));
  for (const [name, hash] of Object.entries(licenseHashes)) {
    assert.equal(sha256(readFileSync(join(kit, name))), hash, name);
    assert.ok(listed.has(name), `${name} is manifest-listed`);
  }
  assert.ok(!existsSync(join(kit, "LICENSE-PENDING.md")));
  assert.deepEqual(licenseLike(kit), ["LICENSE", "LICENSE-docs", "NOTICE"]);

  const pending = join(scratch, "kit-pending");
  ok(runExport(pending, ["--license", "none"]), "export --license none");
  assert.deepEqual(licenseLike(pending), ["LICENSE-PENDING.md"]);
  const notice = readFileSync(join(pending, "LICENSE-PENDING.md"), "utf8");
  assert.match(notice, /grants no rights/u);
  assert.match(notice, /names no license/u);
  assert.doesNotMatch(notice, /Apache|Creative Commons|CC-BY|MIT|SPDX/u);
  const pendingListed = new Set(
    manifestOf(pending).files.map(({ path }) => path),
  );
  assert.ok(pendingListed.has("LICENSE-PENDING.md"));
  for (const name of Object.keys(licenseHashes))
    assert.ok(!pendingListed.has(name), name);
  assert.equal(
    JSON.parse(readFileSync(join(pending, "package.json"), "utf8")).license,
    "UNLICENSED",
  );
  assert.equal(
    JSON.parse(readFileSync(join(pending, "package-lock.json"), "utf8"))
      .packages[""].license,
    "UNLICENSED",
  );
  assert.match(
    readFileSync(join(pending, "UPSTREAM.md"), "utf8"),
    /--license none/u,
  );

  const bad = runExport(join(scratch, "kit-bad-license"), ["--license", "mit"]);
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /usage: launchpad export <dir> \[--license none\]/u);
});

test("WO-074 design: an export from a work tree that differs from HEAD carries the commit and says so", () => {
  const touched = join(source, "scripts/kit/README.client.md");
  const original = readFileSync(touched, "utf8");
  writeFileSync(touched, `${original}\nuncommitted line\n`);
  try {
    const dirty = ok(
      runExport(join(scratch, "kit-dirty")),
      "export from a dirty tree",
    );
    assert.match(
      dirty.stdout,
      /^advisory: 1 kit path differs from HEAD in the work tree; the export carries commit/mu,
    );
    // The copied template and the README rendered from it are both the
    // commit's bytes; nothing is read from the work tree.
    assert.equal(
      readFileSync(
        join(scratch, "kit-dirty/scripts/kit/README.client.md"),
        "utf8",
      ),
      original,
    );
    assert.equal(
      readFileSync(join(scratch, "kit-dirty/README.md"), "utf8"),
      original,
    );
  } finally {
    writeFileSync(touched, original);
  }
});

test("WO-075 design: a package source that differs from HEAD refuses before any write, so the runtime is the commit's build", () => {
  const touched = join(source, "packages/kernel/src/index.ts");
  const original = readFileSync(touched, "utf8");
  writeFileSync(touched, `${original}// uncommitted\n`);
  try {
    const target = join(scratch, "kit-dirty-source");
    const refused = runExport(target);
    assert.equal(refused.status, 1);
    assert.match(
      refused.stderr,
      /the export builds and emits from the commit, but the work tree differs from HEAD: build inputs: packages\/kernel\/src\/index\.ts\. Commit or stash them/u,
    );
    assert.ok(!existsSync(target), "a refused export writes nothing");
  } finally {
    writeFileSync(touched, original);
  }
});

test("WO-075 VER-001-F1: tracked build and emit bytes hidden by index flags refuse before destination creation", () => {
  for (const flag of ["assume-unchanged", "skip-worktree"])
    for (const path of [
      "packages/kernel/src/index.ts",
      "tsconfig.json",
      "scripts/lib/terms.mjs",
    ]) {
      const touched = join(source, path);
      const original = readFileSync(touched);
      git(source, ["update-index", `--${flag}`, "--", path]);
      try {
        const change = path.endsWith(".ts")
          ? "\nexport const statusHiddenInput = 1;\n"
          : path.endsWith(".mjs")
            ? "\n// status-hidden input\n"
            : "\n";
        writeFileSync(touched, Buffer.concat([original, Buffer.from(change)]));
        assert.equal(
          git(source, ["status", "--porcelain", "--", path]).stdout,
          "",
          `${flag} hides the changed bytes from status`,
        );
        const target = join(
          scratch,
          `kit-hidden-${flag}-${path.replaceAll("/", "-")}`,
        );
        const refused = runExport(target);
        assert.equal(refused.status, 1, refused.stdout);
        assert.ok(refused.stderr.includes(path), refused.stderr);
        assert.match(refused.stderr, /work tree differs from HEAD/u);
        assert.ok(!existsSync(target), "a refused export writes nothing");
      } finally {
        writeFileSync(touched, original);
        git(source, ["update-index", `--no-${flag}`, "--", path]);
      }
    }
});

test("WO-075 VER-001-F1: a missing tracked source hidden by skip-worktree refuses before any write", () => {
  const path = "packages/kernel/src/index.ts";
  const touched = join(source, path);
  const original = readFileSync(touched);
  git(source, ["update-index", "--skip-worktree", "--", path]);
  try {
    rmSync(touched);
    assert.equal(git(source, ["status", "--porcelain", "--", path]).stdout, "");
    const target = join(scratch, "kit-hidden-missing-source");
    const refused = runExport(target);
    assert.equal(refused.status, 1, refused.stdout);
    assert.ok(refused.stderr.includes(path), refused.stderr);
    assert.ok(!existsSync(target), "a refused export writes nothing");
  } finally {
    writeFileSync(touched, original);
    git(source, ["update-index", "--no-skip-worktree", "--", path]);
  }
});

test("WO-075 VER-001-F1: nested compilable files inside ignored source and test directories refuse before any write", () => {
  const exclude = join(source, ".git/info/exclude");
  const original = existsSync(exclude) ? readFileSync(exclude) : null;
  for (const tree of ["src", "test"]) {
    const directory = `packages/kernel/${tree}/ignored inputs`;
    const path = `${directory}/nested/plant.ts`;
    writeFileSync(exclude, `${original ?? ""}\n/${directory}/\n`);
    mkdirSync(dirname(join(source, path)), { recursive: true });
    writeFileSync(join(source, path), "export const ignoredInput = 1;\n");
    try {
      assert.equal(
        git(source, ["status", "--porcelain", "--", directory]).stdout,
        "",
      );
      assert.equal(
        run("git", ["check-ignore", "-q", path], { cwd: source }).status,
        0,
      );
      const target = join(scratch, `kit-ignored-directory-${tree}`);
      const refused = runExport(target);
      assert.equal(refused.status, 1, refused.stdout);
      assert.ok(refused.stderr.includes(path), refused.stderr);
      assert.match(refused.stderr, /uncommitted compilable package files/u);
      assert.ok(!existsSync(target), "a refused export writes nothing");
    } finally {
      rmSync(join(source, directory), { recursive: true, force: true });
      if (original === null) rmSync(exclude, { force: true });
      else writeFileSync(exclude, original);
    }
  }
});

test("WO-075 VER-001-F1: a tracked source replaced by a same-byte symlink under assume-unchanged refuses before any write", () => {
  const path = "packages/kernel/src/index.ts";
  const touched = join(source, path);
  const original = readFileSync(touched);
  const external = join(scratch, "same-byte-source.ts");
  writeFileSync(external, original);
  git(source, ["update-index", "--assume-unchanged", "--", path]);
  try {
    rmSync(touched);
    symlinkSync(external, touched);
    assert.equal(git(source, ["status", "--porcelain", "--", path]).stdout, "");
    const target = join(scratch, "kit-symlink-source");
    const refused = runExport(target);
    assert.equal(refused.status, 1, refused.stdout);
    assert.ok(refused.stderr.includes(path), refused.stderr);
    assert.ok(!existsSync(target), "a refused export writes nothing");
  } finally {
    rmSync(touched);
    writeFileSync(touched, original);
    git(source, ["update-index", "--no-assume-unchanged", "--", path]);
  }
});

test("WO-075 design: the emit closure the export predicts with is pinned to HEAD, named from the import graph, and a dirty copy refuses before any write", () => {
  // The declared closure equals the static import graph of the harness CLI
  // and library under scripts/.
  const closure = new Set();
  const queue = ["scripts/harness.mjs", "scripts/lib/harness.mjs"];
  while (queue.length) {
    const file = queue.shift();
    if (closure.has(file)) continue;
    closure.add(file);
    const text = readFileSync(join(repository, file), "utf8");
    for (const match of text.matchAll(/^import[\s\S]*?from\s+"(\.[^"]+)"/gmu)) {
      const target = join(dirname(file), match[1]);
      if (target.startsWith("scripts/")) queue.push(target);
    }
  }
  assert.deepEqual([...closure].sort(), [...EMIT_CLOSURE]);
  assert.ok(BUILD_INPUTS.includes("scripts/build.mjs"));
  const touched = join(source, "scripts/lib/terms.mjs");
  const original = readFileSync(touched, "utf8");
  writeFileSync(touched, `${original}// uncommitted\n`);
  try {
    const target = join(scratch, "kit-dirty-emit");
    const refused = runExport(target);
    assert.equal(refused.status, 1);
    assert.match(
      refused.stderr,
      /harness emit scripts \(the export's own emit runs the commit's copies\): scripts\/lib\/terms\.mjs/u,
    );
    assert.ok(!existsSync(target), "a refused export writes nothing");
  } finally {
    writeFileSync(touched, original);
  }
  // An ignored file under a package's sources would enter the build unseen.
  const stray = join(source, "packages/kernel/src/stray.ignored.ts");
  writeFileSync(join(source, ".git/info/exclude"), "*.ignored.ts\n");
  writeFileSync(stray, "export const stray = 1;\n");
  try {
    const target = join(scratch, "kit-ignored-source");
    const refused = runExport(target);
    assert.equal(refused.status, 1);
    assert.match(
      refused.stderr,
      /uncommitted compilable package files \(including ignored paths\): packages\/kernel\/src\/stray\.ignored\.ts/u,
    );
    assert.ok(!existsSync(target), "a refused export writes nothing");
  } finally {
    rmSync(stray, { force: true });
    rmSync(join(source, ".git/info/exclude"), { force: true });
  }
  // An ignored file tsc cannot include, the Finder's .DS_Store under src, is
  // not a build input and does not refuse.
  const finder = join(source, "packages/kernel/src/.DS_Store");
  writeFileSync(finder, "");
  try {
    assert.equal(
      run("git", ["check-ignore", "-q", "packages/kernel/src/.DS_Store"], {
        cwd: source,
      }).status,
      0,
    );
    ok(runExport(join(scratch, "kit-finder-file")), "export beside .DS_Store");
  } finally {
    rmSync(finder, { force: true });
  }
});

test("WO-075 design: a TypeScript module under a runtime package's sources travels only as compiled output, which the local-terms screen judges", () => {
  // The declaration-file plant (WO-074) emits nothing; a module that compiles
  // carries its text into dist/src, so the terms screen is what keeps instance
  // material there out of an export.
  const module = "packages/skeleton/src/planted-module.ts";
  writeFileSync(
    join(source, module),
    `export const plantedTerm = "${synthetic.trim()}";\n`,
  );
  git(source, ["add", module]);
  git(source, ["commit", "-qm", "plant a compiled module"]);
  try {
    const target = join(scratch, "kit-compiled-plant");
    const refused = runExport(target);
    assert.equal(refused.status, 1);
    assert.match(refused.stderr, /local-terms list present; refused \[/u);
    assert.match(
      refused.stderr,
      /"file":"packages\/skeleton\/dist\/src\/planted-module\.js"/u,
    );
    assert.doesNotMatch(refused.stderr, new RegExp(synthetic.trim(), "u"));
    assert.ok(!existsSync(target), "a refused export writes nothing");
  } finally {
    git(source, ["reset", "-q", "--hard", "HEAD~1"]);
  }
});

test("WO-075 design: a host Git configuration that would ignore a kit file refuses the export by name, and an export cannot be made from a kit", () => {
  const excludes = join(scratch, "host-excludes");
  writeFileSync(excludes, "dist/\n");
  const target = join(scratch, "kit-host-excludes");
  const refused = run(
    process.execPath,
    [join(source, "scripts/launchpad.mjs"), "export", target],
    {
      cwd: scratch,
      env: {
        ...env,
        GIT_CONFIG_COUNT: "1",
        GIT_CONFIG_KEY_0: "core.excludesFile",
        GIT_CONFIG_VALUE_0: excludes,
      },
    },
  );
  assert.equal(refused.status, 1);
  assert.match(
    refused.stderr,
    /the fork's Git would ignore \d+ kit files, so its first commit would lack them: packages\/compiler\/dist\/src\/.*remove it before exporting again/u,
  );
  // The export is left in place for inspection; no manifest was written.
  assert.ok(existsSync(join(target, "scripts/launchpad.mjs")));
  assert.ok(!existsSync(join(target, "KIT-MANIFEST.json")));
  // A kit carries no package sources, so it cannot export itself.
  const fromKit = run(
    process.execPath,
    [
      join(kit, "scripts/launchpad.mjs"),
      "export",
      join(scratch, "kit-from-kit"),
    ],
    { cwd: scratch },
  );
  assert.equal(fromKit.status, 1);
  assert.match(fromKit.stderr, /package sources, which this checkout lacks/u);
  assert.ok(!existsSync(join(scratch, "kit-from-kit")));
});

test("WO-075 design: a fresh clone of the committed export lacks the ignored snapshot, its hooks report snapshot-missing and delegate to host permissions, and one emit restores the check", () => {
  const committed = commitExport(join(scratch, "kit-committed"));
  const clone = join(scratch, "kit-clone");
  git(scratch, ["clone", "-q", committed, clone]);
  const snapshot =
    harnessManifestOf(clone).profiles[0].profile.runtime.snapshot;
  assert.ok(!existsSync(join(clone, snapshot)));
  assert.ok(
    existsSync(join(clone, "packages/skeleton/dist/src/harness-host.js")),
  );
  // A generated hook without its snapshot: one advisory naming the cause, no
  // denial; the fork runs on the host's permissions until it emits.
  const hook = run(process.execPath, [".claude/hooks/permissions.mjs"], {
    cwd: clone,
    input: JSON.stringify({
      session_id: "fixture-clone-session",
      hook_event_name: "PreToolUse",
      tool_name: "Bash",
      tool_input: { command: "git commit -m 'Generated by AI'" },
      cwd: clone,
    }),
  });
  assert.equal(hook.status, 0, hook.stderr);
  const response = JSON.parse(hook.stdout);
  assert.match(response.systemMessage ?? "", /snapshot-missing/u);
  assert.equal(response.decision, undefined);
  assert.equal(response.hookSpecificOutput?.permissionDecision, undefined);
  // Without the install the clone has no workspace links, so even the check
  // cannot load its runtime; after it, the check names the missing snapshot.
  const unlinked = harness(clone, "check");
  assert.equal(unlinked.status, 1);
  assert.match(
    unlinked.stderr,
    /Cannot find package '@dotln\/|ERR_MODULE_NOT_FOUND/u,
  );
  ok(
    run(
      "npm",
      ["ci", "--offline", "--no-audit", "--no-fund", "--loglevel=error"],
      { cwd: clone, timeout: 300_000 },
    ),
    "npm ci in the clone",
  );
  // The README's order, commit then install, leaves the tree clean: the bin
  // target npm makes executable was written executable by the export.
  assert.equal(git(clone, ["status", "--porcelain"]).stdout, "");
  const before = harness(clone, "check");
  assert.equal(before.status, 1);
  assert.match(
    before.stderr + before.stdout,
    /harness drift: pinned snapshot missing or changed/u,
  );
  // The compiled hook advisory names bootstrap: in a kit it has no build step
  // (no tsconfig.json) and runs the emit that installs the snapshot.
  const bootstrap = ok(
    run(process.execPath, ["scripts/bootstrap.mjs"], { cwd: clone }),
    "bootstrap in the clone",
  );
  assert.match(
    bootstrap.stdout,
    /Worktree ready for Claude or Codex \(1 preparation steps\)\./u,
  );
  assert.doesNotMatch(bootstrap.stdout + bootstrap.stderr, /npm run build/u);
  assert.ok(
    existsSync(
      join(clone, snapshot, "packages/skeleton/dist/src/harness-host.js"),
    ),
  );
  ok(harness(clone, "check"), "check in the clone");
  // The emit reproduced the listed surfaces byte for byte.
  for (const { path, sha256: hash } of manifestOf(clone).files)
    if (/^\.(?:claude|agents|codex)\//u.test(path))
      assert.equal(sha256(readFileSync(join(clone, path))), hash, path);
  const again = run(process.execPath, [".claude/hooks/permissions.mjs"], {
    cwd: clone,
    input: JSON.stringify({
      session_id: "fixture-clone-session-2",
      hook_event_name: "PreToolUse",
      tool_name: "Bash",
      tool_input: { command: "git commit -m 'Generated by AI'" },
      cwd: clone,
    }),
  });
  assert.equal(again.status, 0, again.stderr);
  assert.doesNotMatch(again.stdout, /snapshot-missing/u);
});

test("WO-074 design: a kit file absent at the commit refuses by name, and a destination inside a Git work tree becomes its own repository", () => {
  const inside = join(source, "nested-export");
  const nested = ok(runExport(inside), "export inside a work tree");
  assert.doesNotMatch(
    nested.stdout,
    /^advisory: the destination lies inside/mu,
  );
  assert.equal(
    realpathSync(git(inside, ["rev-parse", "--show-toplevel"]).stdout.trim()),
    realpathSync(inside),
  );
  rmSync(inside, { recursive: true, force: true });
  git(source, [
    "rm",
    "-q",
    "--cached",
    "scripts/kit/pending-license.template.md",
  ]);
  git(source, ["commit", "-qm", "drop a template"]);
  try {
    const target = join(scratch, "kit-absent");
    const refused = runExport(target);
    assert.equal(refused.status, 1);
    assert.match(
      refused.stderr,
      /kit file is absent at [0-9a-f]{12}: scripts\/kit\/pending-license\.template\.md/u,
    );
    assert.ok(!existsSync(target));
  } finally {
    git(source, ["reset", "-q", "--soft", "HEAD~1"]);
    git(source, ["add", "scripts/kit/pending-license.template.md"]);
  }
});

// This case commits a sibling declaration and one kit file into the shared
// copy and leaves the receipts it writes under the copy's evidence root; the
// update case after it commits its own revisions on top and reads none of
// them.
test("WO-078 criterion 1: an export to a declared sibling writes its receipt inside the manifest step and regenerates the entry, and an update records the sibling by its repository name", (t) => {
  const siblings = "docs/siblings/siblings.json";
  write(
    siblings,
    JSON.stringify(
      {
        schemaVersion: 1,
        siblings: [
          {
            id: "starter-fixture",
            purpose: "The exported launchpad fixture.",
            relation: { kind: "export", coreCommit: null },
            capabilityRows: ["launchpad.starter"],
          },
        ],
      },
      null,
      2,
    ) + "\n",
  );
  git(source, ["add", siblings]);
  git(source, ["commit", "-qm", "fixture sibling declaration"]);
  const head = git(source, ["rev-parse", "HEAD"]).stdout.trim();
  const generator = (args) =>
    run(process.execPath, [join(source, "scripts/siblings.mjs"), ...args], {
      cwd: scratch,
    });
  const receiptLine =
    /^sibling receipt: (docs\/evidence\/siblings\/starter-fixture\/([^/\s]+)\.json); sibling registry: docs\/siblings\/README\.md (regenerated|unchanged)$/mu;
  const manifestHash = (directory) =>
    `sha256:${sha256(readFileSync(join(directory, "KIT-MANIFEST.json")))}`;
  const registryPath = join(source, "docs/siblings/README.md");

  // A destination no declaration names writes no receipt and says so.
  const undeclared = join(scratch, "undeclared-destination");
  const plain = ok(
    runExport(undeclared),
    "export to an undeclared destination",
  );
  assert.match(
    plain.stdout,
    /^sibling receipt: none \(undeclared-destination is not declared in docs\/siblings\/siblings\.json\)$/mu,
  );
  assert.equal(existsSync(join(source, "docs/evidence/siblings")), false);
  assert.equal(existsSync(registryPath), false);

  const destination = join(scratch, "starter-fixture");
  const result = ok(runExport(destination), "export to the declared sibling");
  const line = receiptLine.exec(result.stdout);
  assert.ok(line, result.stdout);
  assert.equal(line[3], "regenerated");
  const receipt = JSON.parse(readFileSync(join(source, line[1]), "utf8"));
  assert.deepEqual(Object.keys(receipt).sort(), [
    "buildHash",
    "coreCommit",
    "date",
    "manifestHash",
    "sibling",
  ]);
  assert.equal(receipt.sibling, "starter-fixture");
  assert.equal(receipt.coreCommit, head);
  assert.equal(receipt.manifestHash, manifestHash(destination));
  const snapshot = /snapshot \.runtime\/harness\/([0-9a-f]{16})\.$/mu.exec(
    result.stdout,
  );
  assert.ok(snapshot, result.stdout);
  assert.equal(receipt.buildHash, `fnv1a64:${snapshot[1]}`);
  assert.match(receipt.date, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u);
  assert.equal(line[2], receipt.date.replace(/[:.]/gu, "-"));
  // The receipt is the launchpad's evidence, never the export's content.
  assert.equal(existsSync(join(destination, "docs/evidence/siblings")), false);
  assert.ok(
    !manifestOf(destination).files.some(({ path }) =>
      path.startsWith("docs/evidence/"),
    ),
  );

  // The export regenerated the page itself; no further command is needed.
  const registry = readFileSync(registryPath, "utf8");
  const observations = JSON.parse(
    readFileSync(join(source, "docs/siblings/tag-observations.json"), "utf8"),
  );
  assert.deepEqual(observations.commits[head], {
    tag: null,
    nearest: "v9.9.9-fixture",
  });
  assert.match(
    registry,
    new RegExp(
      `^- \\*\\*Upstream relation:\\*\\* an export of core at commit \`${head}\` \\(the earliest receipt's\\)$`,
      "mu",
    ),
  );
  assert.match(
    registry,
    /^- \*\*Kit version:\*\* none at the commit \(nearest below: `v9\.9\.9-fixture`\)$/mu,
  );
  assert.match(
    registry,
    new RegExp(`^- \\*\\*Core commit:\\*\\* \`${head}\`$`, "mu"),
  );
  assert.match(
    registry,
    new RegExp(
      `^- \\*\\*Manifest hash:\\*\\* \`${receipt.manifestHash}\`$`,
      "mu",
    ),
  );
  assert.match(
    registry,
    new RegExp(`^- \\*\\*Build hash:\\*\\* \`${receipt.buildHash}\`$`, "mu"),
  );
  assert.match(registry, /\| first receipt \| \[/u);
  ok(generator(["index", "--check"]), "the page the export wrote is current");
  // The generator rebuilds the same page from the receipt alone.
  rmSync(registryPath);
  const started = performance.now();
  ok(generator(["index"]), "siblings index");
  const generatorMs = performance.now() - started;
  assert.equal(readFileSync(registryPath, "utf8"), registry);

  // A kit change, then an update into a worktree-named copy whose origin
  // remote names the sibling: the receipt records the declared sibling, and
  // the page regenerates with the new commit and the retained manifest's hash.
  write("scripts/sibling-fixture.txt", "a kit change after the export\n");
  git(source, ["add", "scripts/sibling-fixture.txt"]);
  git(source, ["commit", "-qm", "fixture kit change for the sibling update"]);
  const next = git(source, ["rev-parse", "HEAD"]).stdout.trim();
  const worktree = join(scratch, "Starter-Fixture-wo001");
  cpSync(destination, worktree, { recursive: true, verbatimSymlinks: true });
  git(worktree, [
    "remote",
    "add",
    "origin",
    "https://example.invalid/owner/starter-fixture.git",
  ]);
  const updated = ok(
    run(
      process.execPath,
      [join(source, "scripts/launchpad.mjs"), "export", "--update", worktree],
      { cwd: scratch },
    ),
    "update the declared sibling through its worktree",
  );
  const second = receiptLine.exec(updated.stdout);
  assert.ok(second && second[1] !== line[1], updated.stdout);
  assert.equal(second[3], "regenerated");
  const later = JSON.parse(readFileSync(join(source, second[1]), "utf8"));
  assert.equal(later.sibling, "starter-fixture");
  assert.equal(later.coreCommit, next);
  assert.equal(later.manifestHash, manifestHash(worktree));
  assert.notEqual(later.manifestHash, receipt.manifestHash);
  assert.equal(later.buildHash, receipt.buildHash, "the same runtime build");
  const regenerated = readFileSync(registryPath, "utf8");
  assert.match(
    regenerated,
    new RegExp(
      `^- \\*\\*Manifest hash:\\*\\* \`${later.manifestHash}\`$`,
      "mu",
    ),
  );
  assert.match(
    regenerated,
    /^- \*\*Orders in core that advanced it:\*\* none closed between the compared commits$/mu,
  );
  assert.equal(
    regenerated.split("\n").filter((row) => row.startsWith("| 20")).length,
    2,
  );
  ok(generator(["index", "--check"]), "the page the update wrote is current");
  // The page the export wrote, put back by hand, is stale against the later
  // receipt and the check names that receipt.
  writeFileSync(registryPath, registry);
  const stale = generator(["index", "--check"]);
  assert.equal(stale.status, 1, stale.stdout);
  assert.equal(
    stale.stderr,
    `error: docs/siblings/README.md: the starter-fixture entry records manifest hash \`${receipt.manifestHash}\`, and its latest receipt ${second[1]} records \`${later.manifestHash}\`; run node scripts/siblings.mjs index\n`,
  );
  assert.equal(
    readFileSync(registryPath, "utf8"),
    registry,
    "the check writes nothing",
  );
  ok(generator(["index"]), "siblings index after the update");
  assert.equal(readFileSync(registryPath, "utf8"), regenerated);
  t.diagnostic(
    `sibling receipts ${basename(line[1])} and ${basename(second[1])}; generator wall-clock ${Math.round(generatorMs)} ms; registry ${Buffer.byteLength(regenerated)} bytes`,
  );
});

test("export update preserves ownership, validates actions and keeps the exported resident", async (t) => {
  const kitActions = "scripts/kit/KIT-ACTIONS.json";
  const changed = "scripts/update-changed.txt";
  const unchanged = "scripts/update-unchanged.txt";
  const unchangedModified = "scripts/update-unchanged-modified.txt";
  const modified = "scripts/update-modified.txt";
  const dropped = "scripts/update-dropped.txt";
  const droppedModified = "scripts/update-dropped-modified.txt";
  const added = "scripts/update-added.txt";
  for (const path of [
    changed,
    unchanged,
    unchangedModified,
    modified,
    dropped,
    droppedModified,
  ])
    write(path, "revision A\n");
  git(source, ["add", "scripts"]);
  git(source, ["commit", "-qm", "fixture kit revision A"]);
  const revisionA = git(source, ["rev-parse", "HEAD"]).stdout.trim();
  const base = join(scratch, "update-base");
  ok(runExport(base), "export revision A");
  const prior = manifestOf(base);
  const instance = (name, optIn = false) => {
    const target = join(scratch, `update-${name}`);
    cpSync(base, target, { recursive: true, verbatimSymlinks: true });
    if (optIn)
      writeFileSync(
        join(target, "dotln.config.json"),
        JSON.stringify({ version: 1, kit: { applyInstanceActions: true } }) +
          "\n",
      );
    return target;
  };
  const runUpdate = (target, extra = []) =>
    run(
      process.execPath,
      [
        join(source, "scripts/launchpad.mjs"),
        "export",
        "--update",
        target,
        ...extra,
      ],
      { cwd: scratch },
    );
  const snapshot = (target) =>
    Object.fromEntries(
      files(target)
        .sort()
        .map((path) => [
          path,
          lstatSync(join(target, path)).isSymbolicLink()
            ? `link:${readlinkSync(join(target, path))}`
            : sha256(readFileSync(join(target, path))),
        ]),
    );
  const actions = [
    {
      id: "move-evidence",
      date: "2026-10-10",
      kind: "rename-root",
      root: "evidence",
      from: "docs/evidence",
      to: "records/evidence",
    },
    {
      id: "release-default",
      date: "2026-10-10",
      kind: "add-config-field",
      field: "release.corpus",
      value: true,
    },
    {
      id: "contract-heading",
      date: "2026-10-10",
      kind: "change-phrase",
      from: "# Launchpad\n",
      to: "# Launchpad\n\nUpdated instance contract.\n",
    },
  ];
  write(changed, "revision B\n");
  write(modified, "revision B\n");
  write(added, "new in B\n");
  rmSync(join(source, dropped));
  rmSync(join(source, droppedModified));
  write(kitActions, JSON.stringify({ schemaVersion: 1, actions }) + "\n");
  git(source, ["add", "scripts"]);
  git(source, ["commit", "-qm", "fixture kit revision B"]);
  const revisionB = git(source, ["rev-parse", "HEAD"]).stdout.trim();
  assert.notEqual(revisionA, revisionB);

  await t.test(
    "preview from core preserves every byte and renders the following update's plan",
    () => {
      const declaration = "docs/siblings/siblings.json";
      write(
        declaration,
        JSON.stringify({
          schemaVersion: 1,
          siblings: [
            {
              id: "update-preview",
              purpose: "Preview fixture",
              relation: { kind: "export", coreCommit: null },
              capabilityRows: [],
            },
            {
              id: "starter-fixture",
              purpose: "Existing fixture",
              relation: { kind: "export", coreCommit: null },
              capabilityRows: [],
            },
          ],
        }) + "\n",
      );
      const incoming = git(source, ["rev-parse", "HEAD"]).stdout.trim();
      git(source, ["tag", "preview-fixture"]);
      const rows = (output) =>
        output
          .split("\n")
          .filter((line) =>
            /^(?:kit files:|replace:|add:|remove:|refused:|action:|action plan:)/u.test(
              line,
            ),
          );
      for (const apply of [false, true]) {
        const target = instance(apply ? "preview-apply" : "preview", apply);
        if (apply) {
          writeFileSync(
            join(target, "dotln.config.json"),
            JSON.stringify({
              version: 1,
              kit: { applyInstanceActions: true },
              release: { corpus: false },
            }) + "\n",
          );
        }
        writeFileSync(join(target, modified), "local kit edit\n");
        if (!apply)
          writeFileSync(join(target, added), "instance-owned new path\n");
        const receiptRoot = join(source, "docs/evidence/siblings");
        const registryRoot = join(source, "docs/siblings");
        const before = {
          destination: treeSnapshot(target),
          receipts: treeSnapshot(receiptRoot),
          registry: treeSnapshot(registryRoot),
        };
        const flags = apply ? ["--apply"] : [];
        const started = performance.now();
        const preview = ok(
          runUpdate(target, [...flags, "--preview"]),
          "preview core update",
        );
        const elapsed = Math.round(performance.now() - started);
        assert.deepEqual(
          {
            destination: treeSnapshot(target),
            receipts: treeSnapshot(receiptRoot),
            registry: treeSnapshot(registryRoot),
          },
          before,
        );
        assert.equal(
          existsSync(join(target, "KIT-MANIFEST.pending.json")),
          false,
        );
        assert.ok(
          preview.stdout.includes(`incoming: ${incoming} (preview-fixture)`),
        );
        assert.match(
          preview.stdout,
          /^build: fnv1a64:[0-9a-f]{16} -> fnv1a64:[0-9a-f]{16}$/mu,
        );
        assert.ok(
          preview.stdout.includes(
            `refused: ${modified} (locally modified; prior hash retained: ${prior.files.find((entry) => entry.path === modified).sha256})`,
          ),
        );
        assert.ok(
          preview.stdout.includes(
            apply
              ? `add: ${added}`
              : `refused: ${added} (instance-owned collision; remains instance-owned; retained hash: none)`,
          ),
        );
        assert.ok(preview.stdout.includes(`replace: ${changed}`));
        assert.ok(preview.stdout.includes(`remove: ${dropped}`));
        if (apply) {
          assert.match(preview.stdout, /^action plan: apply: move-evidence/mu);
          assert.match(
            preview.stdout,
            /^action plan: preserved\/already applied: release-default/mu,
          );
          assert.match(preview.stdout, /^receipt: none /mu);
        } else {
          assert.match(
            preview.stdout,
            /^action plan: preserved\/no opt-in: move-evidence/mu,
          );
          assert.match(
            preview.stdout,
            /^receipt: would write docs\/evidence\/siblings\/update-preview\/.*\.json$/mu,
          );
        }
        const updated = ok(runUpdate(target, flags), "apply previewed update");
        assert.deepEqual(rows(preview.stdout), rows(updated.stdout));
        t.diagnostic(
          `core preview ${apply ? "with" : "without"} --apply: ${elapsed} ms; ${rows(preview.stdout).length} matching plan rows; all three trees unchanged`,
        );
      }
      const editedMetadata = instance("preview-unknown-snapshot");
      writeFileSync(
        join(editedMetadata, HARNESS_MANIFEST),
        "local metadata edit\n",
      );
      const editedBefore = treeSnapshot(editedMetadata);
      const editedPreview = ok(
        runUpdate(editedMetadata, ["--preview"]),
        "preview with local snapshot edits",
      );
      assert.match(editedPreview.stdout, /^build: unknown \(/mu);
      assert.ok(
        editedPreview.stdout.includes(
          `refused: ${HARNESS_MANIFEST} (locally modified`,
        ),
      );
      assert.deepEqual(treeSnapshot(editedMetadata), editedBefore);
      ok(runUpdate(editedMetadata), "update preserves local snapshot edits");
      assert.equal(
        readFileSync(join(editedMetadata, HARNESS_MANIFEST), "utf8"),
        "local metadata edit\n",
      );
      const bad = runExport(join(scratch, "preview-without-update"), [
        "--preview",
      ]);
      assert.equal(bad.status, 1);
      assert.match(bad.stderr, /usage:/u);
      assert.equal(existsSync(join(scratch, "preview-without-update")), false);
    },
  );

  await t.test(
    "preview inside a fork reads the fetched starter revision without merging or writing",
    () => {
      const starter = join(scratch, "preview-starter");
      cpSync(base, starter, { recursive: true, verbatimSymlinks: true });
      configureRepository(starter);
      git(starter, ["add", "."]);
      git(starter, ["commit", "-qm", "starter revision A"]);
      const remote = join(scratch, "preview-starter.git");
      git(scratch, ["clone", "--bare", starter, remote]);
      const fork = join(scratch, "preview-fork");
      git(scratch, ["clone", remote, fork]);
      configureRepository(fork);
      const invoke = (ref, cwd = fork) =>
        run(
          process.execPath,
          [join(fork, "scripts/launchpad.mjs"), "preview", "--from", ref],
          { cwd },
        );
      const noOpBefore = treeSnapshot(fork);
      const noOp = ok(invoke("HEAD"), "preview an identical revision");
      assert.match(
        noOp.stdout,
        /^kit files: 0 replaced; 0 added; 0 removed; 0 refused; \d+ unchanged\.$/mu,
      );
      assert.doesNotMatch(noOp.stdout, /^(?:replace|add|remove|refused):/mu);
      assert.ok(noOp.stdout.includes(`unchanged: ${unchanged}`));
      assert.deepEqual(treeSnapshot(fork), noOpBefore);
      ok(runUpdate(starter), "update starter to revision B");
      const starterActions = [
        ...actions,
        {
          id: "starter-action",
          date: "2026-10-12",
          kind: "add-config-field",
          field: "release.readmeBlock",
          value: false,
        },
      ];
      writeFileSync(
        join(starter, kitActions),
        JSON.stringify({ schemaVersion: 1, actions: starterActions }) + "\n",
      );
      // A valid starter edit/re-emit can retain the original manifest hashes.
      const metadata = join(starter, HARNESS_MANIFEST);
      writeFileSync(metadata, readFileSync(metadata, "utf8") + " \n");
      for (const path of [kitActions, HARNESS_MANIFEST])
        assert.notEqual(
          sha256(readFileSync(join(starter, path))),
          manifestOf(starter).files.find((entry) => entry.path === path).sha256,
        );
      git(starter, ["add", "."]);
      git(starter, ["commit", "-qm", "starter revision B"]);
      git(starter, ["push", remote, "main"]);
      git(fork, ["fetch", "origin"]);
      writeFileSync(join(fork, modified), "local kit edit\n");
      writeFileSync(join(fork, unchangedModified), "local-only kit edit\n");
      writeFileSync(join(fork, added), "instance-owned collision\n");
      // Prove the incoming action declaration is read from Git, not this copy.
      writeFileSync(
        join(fork, kitActions),
        JSON.stringify({ schemaVersion: 1, actions: [] }) + "\n",
      );
      const before = treeSnapshot(fork);
      const preview = ok(
        invoke("origin/main"),
        "preview fetched revision inside the instance",
      );
      assert.deepEqual(treeSnapshot(fork), before);
      assert.ok(preview.stdout.includes(`replace: ${changed}`));
      assert.ok(preview.stdout.includes(`unchanged: ${unchanged}`));
      assert.ok(!preview.stdout.includes(`replace: ${unchanged}\n`));
      assert.ok(
        preview.stdout.includes(
          `refused: ${unchangedModified} (locally modified; prior hash retained: ${prior.files.find(({ path }) => path === unchangedModified).sha256}; unchanged upstream; no merge conflict expected)`,
        ),
      );
      assert.ok(preview.stdout.includes(`remove: ${dropped}`));
      assert.ok(
        preview.stdout.includes(`refused: ${modified} (locally modified`),
      );
      assert.ok(
        preview.stdout.includes(`refused: ${added} (instance-owned collision`),
      );
      assert.match(preview.stdout, /^action plan: apply: move-evidence/mu);
      assert.match(preview.stdout, /^action plan: apply: contract-heading/mu);
      assert.match(preview.stdout, /^action plan: apply: starter-action/mu);
      assert.match(
        preview.stdout,
        /^receipt: none \(a starter merge writes no core sibling receipt\)$/mu,
      );
      assert.match(
        preview.stdout,
        /instance actions are manual after the merge/u,
      );
      assert.match(
        preview.stdout,
        /^build: fnv1a64:[0-9a-f]{16} -> fnv1a64:[0-9a-f]{16}$/mu,
      );
      const noRootManifest = invoke("origin/main", scratch);
      assert.equal(noRootManifest.status, 1);
      assert.match(noRootManifest.stderr, /KIT-MANIFEST\.json/u);
      const isolated = ok(
        run(
          process.execPath,
          [
            join(fork, "scripts/launchpad.mjs"),
            "preview",
            "--from",
            "origin/main",
          ],
          {
            cwd: fork,
            env: {
              ...env,
              GIT_DIR: join(source, ".git"),
              GIT_WORK_TREE: source,
              DOTLN_LAUNCHPAD: source,
            },
          },
        ),
        "preview ignores inherited Git routing",
      );
      assert.equal(isolated.stdout, preview.stdout);
      // Already-converged additions and absent removals change no byte either.
      const converged = join(scratch, "preview-converged");
      cpSync(fork, converged, { recursive: true, verbatimSymlinks: true });
      writeFileSync(join(converged, changed), "revision B\n");
      writeFileSync(join(converged, added), "new in B\n");
      rmSync(join(converged, dropped));
      const convergedBefore = treeSnapshot(converged);
      const convergedPreview = ok(
        invoke("origin/main", converged),
        "preview already-converged paths",
      );
      for (const path of [changed, added, dropped]) {
        assert.ok(convergedPreview.stdout.includes(`unchanged: ${path}`));
        assert.ok(
          !convergedPreview.stdout
            .split("\n")
            .some((line) =>
              ["replace", "add", "remove"].some(
                (kind) => line === `${kind}: ${path}`,
              ),
            ),
        );
      }
      assert.deepEqual(treeSnapshot(converged), convergedBefore);

      // All manual actions remain visible even when several cannot fit the fork.
      const unfitActions = [
        {
          id: "empty-release",
          date: "2026-10-12",
          kind: "add-config-field",
          field: "release",
          value: {},
        },
        ...actions,
        {
          id: "invalid-default",
          date: "2026-10-12",
          kind: "add-config-field",
          field: "release.invalidDefault",
          value: true,
        },
        {
          id: "occupied-orders",
          date: "2026-10-12",
          kind: "rename-root",
          root: "workOrders",
          from: "docs/work-orders",
          to: "records/orders",
        },
        starterActions.at(-1),
      ];
      writeFileSync(
        join(starter, kitActions),
        JSON.stringify({ schemaVersion: 1, actions: unfitActions }) + "\n",
      );
      git(starter, ["add", kitActions]);
      git(starter, [
        "commit",
        "-qm",
        "starter actions needing manual resolution",
      ]);
      git(starter, ["push", remote, "main"]);
      git(fork, ["fetch", "origin"]);
      mkdirSync(join(fork, "records"), { recursive: true });
      writeFileSync(join(fork, "records/orders"), "occupied instance path\n");
      for (const contract of [
        "custom contract without the old phrase\n",
        "# Launchpad\n# Launchpad\n",
      ]) {
        writeFileSync(join(fork, "CLAUDE.md"), contract);
        const unfitBefore = treeSnapshot(fork);
        const unfitPreview = ok(
          invoke("origin/main"),
          "preview unfit manual actions",
        );
        assert.ok(unfitPreview.stdout.includes(`replace: ${changed}`));
        assert.ok(unfitPreview.stdout.includes(`unchanged: ${unchanged}`));
        for (const action of unfitActions)
          assert.ok(
            unfitPreview.stdout.includes(`action: ${JSON.stringify(action)}`),
          );
        assert.equal(
          unfitPreview.stdout
            .split("\n")
            .filter((line) => line.startsWith("action plan:")).length,
          unfitActions.length,
        );
        assert.match(
          unfitPreview.stdout,
          /^action plan: cannot apply: contract-heading .*expected one phrase/mu,
        );
        assert.match(
          unfitPreview.stdout,
          /^action plan: cannot apply: invalid-default .*invalidDefault/mu,
        );
        assert.match(
          unfitPreview.stdout,
          /^action plan: cannot apply: occupied-orders .*expected root workOrders/mu,
        );
        assert.match(
          unfitPreview.stdout,
          /^action plan: apply: starter-action/mu,
        );
        assert.deepEqual(treeSnapshot(fork), unfitBefore);
      }
      const noRevision = invoke("absent-revision");
      assert.equal(noRevision.status, 1);
      git(starter, ["rm", "KIT-MANIFEST.json"]);
      git(starter, ["commit", "-qm", "starter with no manifest"]);
      git(starter, ["push", remote, "main"]);
      git(fork, ["fetch", "origin"]);
      const noManifestBefore = treeSnapshot(fork);
      const noManifest = invoke("origin/main");
      assert.equal(noManifest.status, 1);
      assert.match(noManifest.stderr, /KIT-MANIFEST\.json/u);
      assert.deepEqual(treeSnapshot(fork), noManifestBefore);
      writeFileSync(
        join(starter, "KIT-MANIFEST.json"),
        JSON.stringify({
          ...prior,
          files: [{ path: "../escape", sha256: "a".repeat(64) }],
        }),
      );
      git(starter, ["add", "KIT-MANIFEST.json"]);
      git(starter, ["commit", "-qm", "malformed starter manifest"]);
      git(starter, ["push", remote, "main"]);
      git(fork, ["fetch", "origin"]);
      const malformedBefore = treeSnapshot(fork);
      const malformed = invoke("origin/main");
      assert.equal(malformed.status, 1);
      assert.match(malformed.stderr, /malformed prior manifest entry/u);
      assert.deepEqual(treeSnapshot(fork), malformedBefore);
    },
  );

  await t.test(
    "post-manifest failures retain the plan summary and distinguish receipt state",
    () => {
      for (const failure of ["receipt", "registry"]) {
        const target = instance(`failed-${failure}`);
        const host = join(scratch, `receipt-host-${failure}`);
        mkdirSync(join(host, "docs/siblings"), { recursive: true });
        writeFileSync(
          join(host, "docs/siblings/siblings.json"),
          JSON.stringify({
            schemaVersion: 1,
            siblings: [
              {
                id: basename(target),
                purpose: "Failure fixture",
                relation: { kind: "export", coreCommit: null },
                capabilityRows: [],
              },
            ],
          }),
        );
        if (failure === "receipt")
          writeFileSync(
            join(host, "docs/evidence"),
            "blocks receipt directory",
          );
        if (failure === "registry")
          mkdirSync(join(host, "docs/siblings/README.md"));
        // A nonregular registry path fails after the receipt lands.
        const result = run(
          process.execPath,
          [join(source, "scripts/launchpad.mjs"), "export", "--update", target],
          {
            cwd: scratch,
            env: { ...env, DOTLN_LAUNCHPAD: host },
          },
        );
        assert.equal(
          result.status,
          1,
          `${failure}: ${result.stderr}\n${result.stdout}`,
        );
        assert.equal(manifestOf(target).commit, revisionB);
        assert.equal(
          existsSync(join(target, "KIT-MANIFEST.pending.json")),
          false,
        );
        assert.ok(result.stdout.includes(`in ${target}.`));
        assert.ok(result.stdout.includes(`replace: ${changed}`));
        if (failure === "receipt")
          assert.match(
            result.stderr,
            /is complete, but its sibling receipt was not written/u,
          );
        else {
          assert.match(
            result.stderr,
            /receipt .* is written, but the sibling registry was not regenerated/u,
          );
          assert.equal(
            readdirSync(join(host, "docs/evidence/siblings", basename(target)))
              .length,
            1,
          );
        }
        assert.doesNotMatch(result.stdout, /^sibling receipt:/mu);
      }
    },
  );

  await t.test(
    "unmodified files update; edited and dropped edits keep prior hashes on repeated updates",
    () => {
      const target = instance("ownership");
      writeFileSync(join(target, modified), "local kit edit\n");
      writeFileSync(join(target, droppedModified), "local dropped edit\n");
      // A fork that took core's change by hand holds the incoming bytes
      // already: converged, never refused, recorded at the incoming hash.
      writeFileSync(join(target, changed), "revision B\n");
      mkdirSync(join(target, "build"));
      writeFileSync(
        join(target, "build/overlay.json"),
        '{"instance":"overlay"}\n',
      );
      writeFileSync(join(target, "README.md"), "instance front door\n");
      for (const path of [
        "docs/control/budgets.json",
        "docs/control/doc-baseline.json",
        "docs/control/doc-ceilings.json",
        "docs/planning/followups.json",
        "docs/lineage/idea-ledger.md",
      ])
        writeFileSync(join(target, path), `instance-owned ${path}\n`);
      const before = snapshot(target);
      const result = ok(runUpdate(target), "update revision B");
      assert.match(result.stdout, /update without opt-in/);
      assert.match(
        result.stdout,
        /Instance-actions note \(\d{4}-\d{2}-\d{2}\)/,
      );
      assert.match(result.stdout, /contract-heading.*2026-10-10/);
      assert.match(result.stdout, /re-emit: node scripts\/harness.mjs emit/);
      for (const path of [modified, droppedModified])
        assert.ok(result.stdout.includes(`refused: ${path}`));
      assert.ok(!result.stdout.includes(`refused: ${changed}`));
      assert.match(
        result.stdout,
        /^kit files: \d+ replaced; 1 added; 1 removed; 2 refused\.$/m,
      );
      const after = snapshot(target);
      const priorPaths = new Set(prior.files.map(({ path }) => path));
      for (const [path, hash] of Object.entries(before))
        if (
          path !== "KIT-MANIFEST.json" &&
          (!priorPaths.has(path) || [modified, droppedModified].includes(path))
        )
          assert.equal(after[path], hash, `preserved ${path}`);
      assert.equal(readFileSync(join(target, changed), "utf8"), "revision B\n");
      assert.equal(readFileSync(join(target, added), "utf8"), "new in B\n");
      assert.equal(existsSync(join(target, dropped)), false);
      const manifest = manifestOf(target);
      assert.equal(manifest.commit, revisionB);
      assert.ok(
        readFileSync(join(target, "UPSTREAM.md"), "utf8").includes(revisionB),
      );
      for (const { path, sha256: hash } of manifest.files) {
        if ([modified, droppedModified].includes(path))
          assert.equal(
            hash,
            prior.files.find((entry) => entry.path === path).sha256,
          );
        else assert.equal(hash, sha256(readFileSync(join(target, path))), path);
      }
      const again = ok(runUpdate(target), "repeat update");
      for (const path of [modified, droppedModified])
        assert.ok(again.stdout.includes(`refused: ${path}`));
      assert.deepEqual(snapshot(target), after);
      t.diagnostic(result.stdout.trim());
    },
  );

  await t.test(
    "new kit collisions stay instance-owned and refused on repetition",
    () => {
      const target = instance("collision");
      writeFileSync(join(target, added), "instance file at new kit path\n");
      for (let attempt = 0; attempt < 2; attempt++) {
        const result = ok(runUpdate(target), "new path collision");
        assert.ok(
          result.stdout.includes(`refused: ${added} (instance-owned collision`),
        );
        assert.equal(
          readFileSync(join(target, added), "utf8"),
          "instance file at new kit path\n",
        );
        assert.ok(!manifestOf(target).files.some(({ path }) => path === added));
      }
      const converged = instance("converged-add");
      writeFileSync(join(converged, added), "new in B\n");
      rmSync(join(converged, dropped));
      const result = ok(runUpdate(converged), "converged new path");
      assert.ok(!result.stdout.includes("refused:"), result.stdout);
      // Both dropped files leave: the one removed by hand is absent and
      // counted as removed, the other is unmodified in this fresh instance.
      assert.match(
        result.stdout,
        /^kit files: \d+ replaced; 1 added; 2 removed; 0 refused\.$/m,
      );
      const manifest = manifestOf(converged);
      assert.equal(manifest.commit, revisionB);
      assert.equal(
        manifest.files.find(({ path }) => path === added)?.sha256,
        sha256(Buffer.from("new in B\n")),
      );
      assert.ok(!manifest.files.some(({ path }) => path === dropped));
      assert.equal(existsSync(join(converged, dropped)), false);
    },
  );

  await t.test(
    "missing/malformed manifests and unreadable kit inputs refuse before any write",
    () => {
      const mutations = [
        [
          "array-commit",
          (target) => {
            const m = manifestOf(target);
            m.commit = [m.commit];
            writeFileSync(join(target, "KIT-MANIFEST.json"), JSON.stringify(m));
          },
          /KIT-MANIFEST\.json/,
        ],
        [
          "array-hash",
          (target) => {
            const m = manifestOf(target);
            m.files[0].sha256 = [m.files[0].sha256];
            writeFileSync(join(target, "KIT-MANIFEST.json"), JSON.stringify(m));
          },
          /KIT-MANIFEST\.json/,
        ],
        [
          "missing",
          (target) => rmSync(join(target, "KIT-MANIFEST.json")),
          /KIT-MANIFEST\.json/,
        ],
        [
          "malformed",
          (target) => writeFileSync(join(target, "KIT-MANIFEST.json"), "{"),
          /KIT-MANIFEST\.json/,
        ],
        [
          "invalid-path",
          (target) => {
            const m = manifestOf(target);
            m.files[0].path = "../escape";
            writeFileSync(join(target, "KIT-MANIFEST.json"), JSON.stringify(m));
          },
          /KIT-MANIFEST\.json/,
        ],
        [
          "instance-claim",
          (target) => {
            const m = manifestOf(target);
            m.files[0].path = "CLAUDE.md";
            writeFileSync(join(target, "KIT-MANIFEST.json"), JSON.stringify(m));
          },
          /KIT-MANIFEST\.json/,
        ],
        [
          "missing-kit",
          (target) => rmSync(join(target, changed)),
          /update-changed\.txt/,
        ],
        [
          "directory-kit",
          (target) => {
            rmSync(join(target, changed));
            mkdirSync(join(target, changed));
          },
          /update-changed\.txt/,
        ],
        [
          "linked-kit",
          (target) => {
            rmSync(join(target, changed));
            symlinkSync(join(base, changed), join(target, changed));
          },
          /update-changed\.txt/,
        ],
      ];
      for (const [name, mutate, pattern] of mutations) {
        const target = instance(name);
        mutate(target);
        const before = snapshot(target);
        const buildFile = join(source, "packages/skeleton/dist/src/version.js");
        const buildBefore = lstatSync(buildFile);
        const result = runUpdate(target);
        assert.equal(result.status, 1, result.stdout);
        assert.match(result.stderr, pattern);
        assert.equal(
          lstatSync(buildFile).ino,
          buildBefore.ino,
          `${name}: no runtime build`,
        );
        assert.equal(
          lstatSync(buildFile).mtimeMs,
          buildBefore.mtimeMs,
          `${name}: no runtime build`,
        );
        assert.deepEqual(snapshot(target), before, name);
      }
      const target = instance("unreadable");
      chmodSync(join(target, changed), 0);
      try {
        const result = runUpdate(target);
        assert.equal(result.status, 1, result.stdout);
        assert.match(result.stderr, /cannot read.*update-changed\.txt/);
        assert.equal(manifestOf(target).commit, revisionA);
        assert.equal(existsSync(join(target, added)), false);
      } finally {
        chmodSync(join(target, changed), 0o644);
      }
    },
  );

  await t.test(
    "apply requires opt-in and preflights all declared actions",
    () => {
      const target = instance("no-opt-in");
      const before = snapshot(target);
      const denied = runUpdate(target, ["--apply"]);
      assert.equal(denied.status, 1);
      assert.match(denied.stderr, /dotln\.config\.json/);
      assert.deepEqual(snapshot(target), before);
      const invalid = instance("bad-action-input", true);
      writeFileSync(
        join(invalid, "CLAUDE.md"),
        "a custom contract without the declared phrase\n",
      );
      const invalidBefore = snapshot(invalid);
      for (const flags of [["--apply", "--preview"], ["--apply"]]) {
        const refused = runUpdate(invalid, flags);
        assert.equal(refused.status, 1);
        assert.match(refused.stderr, /contract-heading.*CLAUDE\.md/);
        assert.deepEqual(snapshot(invalid), invalidBefore);
        assert.equal(
          existsSync(join(invalid, "KIT-MANIFEST.pending.json")),
          false,
        );
      }
      const unknown = instance("unknown-kind", true);
      const unknownBefore = snapshot(unknown);
      write(
        kitActions,
        JSON.stringify({
          schemaVersion: 1,
          actions: [
            ...actions,
            { id: "unknown", date: "2026-10-10", kind: "shell" },
          ],
        }),
      );
      git(source, ["add", kitActions]);
      git(source, ["commit", "-qm", "fixture unknown action"]);
      const rejected = runUpdate(unknown, ["--apply"]);
      assert.equal(rejected.status, 1);
      assert.match(
        rejected.stderr,
        /KIT-ACTIONS\.json: undeclared action kind shell/,
      );
      assert.deepEqual(snapshot(unknown), unknownBefore);
      write(kitActions, JSON.stringify({ schemaVersion: 1, actions }) + "\n");
      git(source, ["add", kitActions]);
      git(source, ["commit", "-qm", "fixture restore declared actions"]);
      const intoKit = instance("into-kit", true);
      const intoKitBefore = snapshot(intoKit);
      write(
        kitActions,
        JSON.stringify({
          schemaVersion: 1,
          actions: [
            {
              id: "into-kit",
              date: "2026-10-11",
              kind: "rename-root",
              root: "evidence",
              from: "docs/evidence",
              to: "scripts/evidence",
            },
          ],
        }) + "\n",
      );
      git(source, ["add", kitActions]);
      git(source, ["commit", "-qm", "fixture rename into a kit tree"]);
      const kitOwned = runUpdate(intoKit, ["--apply"]);
      assert.equal(kitOwned.status, 1, kitOwned.stdout);
      assert.match(
        kitOwned.stderr,
        /instance root overlaps a protected path: scripts\/evidence/,
      );
      assert.deepEqual(snapshot(intoKit), intoKitBefore);
      write(kitActions, JSON.stringify({ schemaVersion: 1, actions }) + "\n");
      git(source, ["add", kitActions]);
      git(source, ["commit", "-qm", "fixture restore declared actions again"]);
    },
  );

  await t.test(
    "a retry after an update that failed after its kit writes completes with no refusal, at a later commit too",
    {
      skip: root ? "runs as root, for whom every directory is writable" : false,
    },
    () => {
      const target = instance("interrupted", true);
      mkdirSync(join(target, "records"));
      chmodSync(join(target, "records"), 0o500);
      let failed;
      try {
        failed = runUpdate(target, ["--apply"]);
      } finally {
        chmodSync(join(target, "records"), 0o755);
      }
      assert.equal(failed.status, 1, failed.stdout);
      assert.match(failed.stderr, /EACCES|EPERM/);
      // The kit writes and removals landed and the planned manifest is
      // journaled; the manifest itself did not change.
      assert.equal(manifestOf(target).commit, revisionA);
      assert.equal(existsSync(join(target, "KIT-MANIFEST.pending.json")), true);
      assert.equal(readFileSync(join(target, changed), "utf8"), "revision B\n");
      assert.equal(readFileSync(join(target, added), "utf8"), "new in B\n");
      assert.equal(existsSync(join(target, dropped)), false);
      const interruptedBefore = treeSnapshot(target);
      ok(
        runUpdate(target, ["--apply", "--preview"]),
        "preview an interrupted update",
      );
      assert.deepEqual(treeSnapshot(target), interruptedBefore);
      // Core moves on before the retry: a file the failed run wrote changes
      // again upstream and a dropped file returns.
      write(changed, "revision C\n");
      write(dropped, "back in C\n");
      git(source, ["add", "scripts"]);
      git(source, ["commit", "-qm", "fixture kit revision C"]);
      const revisionC = git(source, ["rev-parse", "HEAD"]).stdout.trim();
      try {
        const retried = ok(
          runUpdate(target, ["--apply"]),
          "retry at a later commit",
        );
        assert.ok(!retried.stdout.includes("refused:"), retried.stdout);
        assert.match(retried.stdout, /^applied: move-evidence/m);
        const manifest = manifestOf(target);
        assert.equal(manifest.commit, revisionC);
        for (const { path, sha256: hash } of manifest.files)
          assert.equal(hash, sha256(readFileSync(join(target, path))), path);
        assert.equal(
          readFileSync(join(target, changed), "utf8"),
          "revision C\n",
        );
        assert.equal(
          readFileSync(join(target, dropped), "utf8"),
          "back in C\n",
        );
        assert.equal(
          existsSync(join(target, "KIT-MANIFEST.pending.json")),
          false,
        );
        assert.equal(existsSync(join(target, "records/evidence")), true);
        assert.equal(existsSync(join(target, "docs/evidence")), false);
        t.diagnostic(
          `${failed.stderr.trim().split("\n")[0]}\n${retried.stdout.trim().split("\n").slice(0, 2).join("\n")}`,
        );
      } finally {
        // Restore revision B's kit for the cases after this one.
        write(changed, "revision B\n");
        rmSync(join(source, dropped));
        git(source, ["add", "scripts"]);
        git(source, ["commit", "-qm", "fixture kit revision B restored"]);
      }
    },
  );

  await t.test(
    "a retry after the second of two renames failed adopts the first without moving it again",
    {
      skip: root ? "runs as root, for whom every directory is writable" : false,
    },
    () => {
      const target = instance("two-renames", true);
      write(
        kitActions,
        JSON.stringify({
          schemaVersion: 1,
          actions: [
            ...actions,
            {
              id: "move-verifications",
              date: "2026-10-11",
              kind: "rename-root",
              root: "verifications",
              from: "docs/verifications",
              to: "locked/verifications",
            },
          ],
        }) + "\n",
      );
      git(source, ["add", kitActions]);
      git(source, ["commit", "-qm", "fixture second rename"]);
      try {
        mkdirSync(join(target, "locked"));
        chmodSync(join(target, "locked"), 0o500);
        let failed;
        try {
          failed = runUpdate(target, ["--apply"]);
        } finally {
          chmodSync(join(target, "locked"), 0o755);
        }
        assert.equal(failed.status, 1, failed.stdout);
        assert.match(failed.stderr, /EACCES|EPERM/);
        // The first rename landed; the configuration still names the old root.
        assert.equal(existsSync(join(target, "records/evidence")), true);
        assert.equal(existsSync(join(target, "docs/evidence")), false);
        assert.equal(loadConfig(target).roots.evidence, "docs/evidence");
        const retried = ok(
          runUpdate(target, ["--apply"]),
          "retry after the second rename failed",
        );
        assert.ok(!retried.stdout.includes("refused:"), retried.stdout);
        assert.equal(loadConfig(target).roots.evidence, "records/evidence");
        assert.equal(
          loadConfig(target).roots.verifications,
          "locked/verifications",
        );
        assert.equal(existsSync(join(target, "locked/verifications")), true);
        assert.equal(
          existsSync(join(target, "KIT-MANIFEST.pending.json")),
          false,
        );
      } finally {
        write(kitActions, JSON.stringify({ schemaVersion: 1, actions }) + "\n");
        git(source, ["add", kitActions]);
        git(source, [
          "commit",
          "-qm",
          "fixture restore declared actions after the second rename",
        ]);
      }
    },
  );

  await t.test(
    "opt-in alone leaves instance files untouched; apply lists actions and is repeatable",
    () => {
      const target = instance("apply", true);
      writeFileSync(
        join(target, "docs/evidence/instance.md"),
        "instance evidence\n",
      );
      const contract = readFileSync(join(target, "CLAUDE.md"));
      ok(runUpdate(target), "configured opt-in without --apply");
      assert.deepEqual(readFileSync(join(target, "CLAUDE.md")), contract);
      assert.equal(existsSync(join(target, "records/evidence")), false);
      const result = ok(runUpdate(target, ["--apply"]), "apply actions");
      assert.match(result.stdout, /opted-in update/);
      for (const { id } of actions)
        assert.ok(result.stdout.includes(`applied: ${id}`));
      assert.equal(
        readFileSync(join(target, "records/evidence/instance.md"), "utf8"),
        "instance evidence\n",
      );
      assert.equal(existsSync(join(target, "docs/evidence")), false);
      assert.equal(loadConfig(target).roots.evidence, "records/evidence");
      assert.equal(loadConfig(target).release.corpus, true);
      assert.deepEqual(
        JSON.parse(readFileSync(join(target, "dotln.config.json"), "utf8"))
          .release,
        { corpus: true },
      );
      assert.equal(
        readFileSync(join(target, "CLAUDE.md"), "utf8"),
        contract.toString().replace(actions[2].from, actions[2].to),
      );
      const applied = snapshot(target);
      const repeat = ok(runUpdate(target, ["--apply"]), "repeat actions");
      for (const { id } of actions)
        assert.ok(repeat.stdout.includes(`preserved/already applied: ${id}`));
      assert.deepEqual(snapshot(target), applied);
      t.diagnostic(result.stdout.trim());
    },
  );

  await t.test(
    "declared child roots move with their parent and existing configuration values survive",
    () => {
      const target = instance("declared-child", true);
      writeFileSync(
        join(target, "dotln.config.json"),
        JSON.stringify({
          version: 1,
          kit: { applyInstanceActions: true },
          release: { corpus: false },
          roots: { verifications: "docs/evidence/checks" },
        }) + "\n",
      );
      mkdirSync(join(target, "docs/evidence/checks"));
      writeFileSync(join(target, "docs/evidence/checks/kept.md"), "kept\n");
      const result = ok(
        runUpdate(target, ["--apply"]),
        "move declared child root",
      );
      assert.equal(
        loadConfig(target).roots.verifications,
        "records/evidence/checks",
      );
      assert.equal(
        readFileSync(join(target, "records/evidence/checks/kept.md"), "utf8"),
        "kept\n",
      );
      assert.equal(loadConfig(target).release.corpus, false);
      assert.match(
        result.stdout,
        /^preserved\/already applied: release-default/m,
      );
    },
  );

  await t.test(
    "a running exported resident keeps its log, derived identity and pending cadence",
    () => {
      const target = instance("resident", true);
      configureRepository(target);
      git(target, ["add", "."]);
      git(target, ["commit", "-qm", "fixture resident instance"]);
      const graph = readFileSync(
        join(repository, "packages/skeleton/fixtures/wo067-presence.json"),
        "utf8",
      );
      writeFileSync(join(target, ".runtime/fixture-graph.json"), graph);
      const resume = `
      import assert from 'node:assert/strict';
      import { readFileSync } from 'node:fs';
      import { ResidentHost } from './packages/skeleton/dist/src/resident-host.js';
      import { replayResident } from './packages/skeleton/dist/src/resident-store.js';
      import { materializeOrder } from './scripts/lib/derived-orders.mjs';
      const expected = JSON.parse(readFileSync('.runtime/fixture-expected.json', 'utf8'));
      const host = new ResidentHost({directory: '.runtime/resident', policyId: 'fixture.progressive', now: () => 10, capabilities: () => ['adapter.fixture']});
      await host.start();
      try {
        const before = host.store.read();
        assert.equal(before, expected.log);
        const saved = replayResident(before).state.resident.configuration;
        assert.equal(saved.graph.activeMechanics[0].workOrder.workOrderId, expected.identity);
        const again = await materializeOrder(expected.compiled, {kind: 'runtime', sourceId: 'export-update'}, {root: process.cwd(), activate: false});
        assert.equal(again.workOrderId, expected.identity);
        await host.tick();
        const events = host.store.read().trim().split('\\n').map(JSON.parse);
        const dispatched = events.filter(e => e.type === 'ScriptEpisodeDispatched');
        assert.equal(dispatched.length, 1);
        assert.equal(dispatched[0].payload.dueAt, 10);
        console.log(JSON.stringify({runtime: 'exported packages/skeleton/dist/src/resident-host.js', identity: again.workOrderId, logPreserved: true, nextCadenceDueAt: 10, dispatched: dispatched.length}));
      } finally { host.close(); }
    `;
      const result = ok(
        run(
          process.execPath,
          [
            "--input-type=module",
            "-e",
            `
      import assert from 'node:assert/strict';
      import { readFileSync, writeFileSync } from 'node:fs';
      import { spawnSync } from 'node:child_process';
      import { ResidentHost } from './packages/skeleton/dist/src/resident-host.js';
      import { compileLoadout, requireCompiled } from './packages/compiler/dist/src/index.js';
      import { recordPresence, replayResident } from './packages/skeleton/dist/src/resident-store.js';
      import { residentMachine } from './packages/skeleton/dist/src/resident-state.js';
      import { materializeOrder } from './scripts/lib/derived-orders.mjs';
      const original = JSON.parse(readFileSync('.runtime/fixture-graph.json', 'utf8'));
      const compiled = requireCompiled(compileLoadout(original.graph, {...original.environment, repo: 'self'})).workOrder;
      const derived = await materializeOrder(compiled, {kind: 'runtime', sourceId: 'export-update'}, {root: process.cwd(), activate: false});
      original.graph.activeMechanics[0].workOrder.workOrderId = derived.workOrderId;
      const spec = {kind: 'script', effect: 'repo.inspect', surface: 'fixture.source', resources: {files: 1, lines: 0, tokens: 0}, command: [process.execPath, '-e', "process.stdout.write('ok\\\\n')"], cwd: process.cwd(), timeoutMs: 1000, expectedStdoutSha256: ${JSON.stringify(sha256(Buffer.from("ok\n")))}};
      const configuration = {...original, policyId: 'fixture.progressive', actors: {probe: spec, widen: spec, peak: spec}, evidence: ['verified-input']};
      const host = new ResidentHost({directory: '.runtime/resident', policyId: configuration.policyId, configuration, now: () => 0, capabilities: () => ['adapter.fixture']});
      await host.start();
      try {
        await recordPresence('.runtime/resident', 'away', () => 0);
        await host.tick();
        const log = host.store.read();
        const consoleRun = spawnSync(process.execPath, ['packages/console/dist/src/cli.js', 'live', '--store', '.runtime/resident'], {encoding: 'utf8', input: 'status\\nquit\\n'});
        assert.equal(consoleRun.status, 0, consoleRun.stderr);
        assert.match(consoleRun.stderr, /DotLn live console/);
        assert.match(consoleRun.stderr, /Actors:/);
        assert.doesNotMatch(consoleRun.stderr, /Runtime status unavailable/);
        assert.match(consoleRun.stdout, /Runtime status/);
        assert.equal(residentMachine(replayResident(log).state.resident).due(10), 10);
        writeFileSync('.runtime/resident/resident.json', JSON.stringify(configuration));
        writeFileSync('.runtime/fixture-expected.json', JSON.stringify({log, identity: derived.workOrderId, compiled}));
        const updated = spawnSync(process.execPath, ${JSON.stringify([join(source, "scripts/launchpad.mjs"), "export", "--update", target, "--apply"])}, {encoding:'utf8'});
        assert.equal(updated.status, 0, updated.stderr);
        assert.equal(host.store.read(), log);
      } finally { host.close(); }
      const resumed = spawnSync(process.execPath, ['--input-type=module', '-e', ${JSON.stringify(resume)}], {encoding:'utf8'});
      assert.equal(resumed.status, 0, resumed.stderr);
      process.stdout.write(resumed.stdout);
    `,
          ],
          { cwd: target },
        ),
        "resident across opted-in update",
      );
      assert.match(result.stdout, /"logPreserved":true/);
      assert.match(result.stdout, /"nextCadenceDueAt":10,"dispatched":1/);
      t.diagnostic(result.stdout.trim());
    },
  );

  await t.test(
    "bounded comparison: shared preparation and a staged export produce identical candidate bytes",
    () => {
      const staged = join(scratch, "comparison-export");
      const result = ok(
        run(
          process.execPath,
          [
            "--input-type=module",
            "-e",
            `
      import assert from 'node:assert/strict';
      import { readFileSync } from 'node:fs';
      import { join } from 'node:path';
      import { prepareKit, exportKit } from ${JSON.stringify(pathToFileURL(join(source, "scripts/launchpad.mjs")).href)};
      const start = performance.now();
      const prepared = await prepareKit();
      const preparedMs = performance.now() - start;
      const stagedStart = performance.now();
      await exportKit(${JSON.stringify(staged)});
      const candidates = new Map(prepared.writes.map(file => [file.path, file.bytes]));
      for (const [path, contents] of prepared.bundle.surfaces) candidates.set(path, Buffer.from(contents));
      let bytes = 0;
      for (const {path} of prepared.manifest.files) {
        const file = readFileSync(join(${JSON.stringify(staged)}, path));
        assert.deepEqual(candidates.get(path), file, path);
        bytes += file.length;
      }
      console.log(JSON.stringify({preparedMs: Math.round(preparedMs), stagedExportAndReadMs: Math.round(performance.now() - stagedStart), files: prepared.manifest.files.length, bytes, equal: true}));
    `,
          ],
          { cwd: source },
        ),
        "candidate preparation comparison",
      );
      t.diagnostic(result.stdout.trim());
    },
  );
});
