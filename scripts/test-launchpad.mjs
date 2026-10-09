// WO-074: launchpad export fixtures, one case per acceptance criterion. The
// order stays uncommitted until final review, so the fixtures commit a bounded
// copy of the work tree into a temporary repository and export from it.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
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
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defaultRoots, loadConfig } from "./lib/config.mjs";
import { licenseHashes } from "./license-surfaces.mjs";

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scratch = realpathSync(mkdtempSync(join(tmpdir(), "dotln-launchpad-")));
const source = join(scratch, "source");
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
  typescript: "packages/skeleton/src/planted.ts",
  evidence: "docs/evidence/WO-074/planted.md",
};
const marker = (kind) => `PLANTED-${kind.toUpperCase()}-7f3a9c`;
const termsPath = join(source, "docs/control/local/terms.txt");
// The cases judge a session that is not a Codex dispatch and exports no
// selected effort; the Codex refusal is asserted with its variable set.
const env = {
  ...process.env,
  CODEX_THREAD_ID: "",
  COPILOT_AGENT_SESSION_ID: "",
  DOTLN_LAUNCHPAD: "",
  DOTLN_BEACON_KEY_FILE: "",
  CLAUDE_EFFORT: "",
  npm_config_update_notifier: "false",
};
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
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
const initRepository = (cwd) => {
  git(cwd, ["init", "-q", "-b", "main"]);
  // Git 2.55 starts a detached repack once objects/17 holds two loose
  // objects; it would write into the tree the fixture removes.
  git(cwd, ["config", "maintenance.auto", "false"]);
  git(cwd, ["config", "user.name", "DotLn Fixture"]);
  git(cwd, ["config", "user.email", "fixture@example.invalid"]);
};
// The command line under test, run from the committed copy's own scripts.
const runExport = (destination, extra = [], cwd = scratch) =>
  run(
    process.execPath,
    [join(source, "scripts/launchpad.mjs"), "export", destination, ...extra],
    { cwd },
  );
const files = (root, directory = "") =>
  readdirSync(join(root, directory), { withFileTypes: true }).flatMap(
    (entry) => {
      const path = directory ? `${directory}/${entry.name}` : entry.name;
      if ([".git", "node_modules"].includes(path)) return [];
      if (entry.isSymbolicLink()) return [path];
      return entry.isDirectory() ? files(root, path) : [path];
    },
  );
const manifestOf = (root) =>
  JSON.parse(readFileSync(join(root, "KIT-MANIFEST.json"), "utf8"));
const licenseLike = (root) =>
  files(root)
    // The license-surfaces check is a script named for what it checks.
    .filter((path) => path !== "scripts/license-surfaces.mjs")
    .filter((path) =>
      /(?:^|\/)(?:LICEN[CS]E|COPYING|NOTICE)(?:[-.][^/]*)?$/iu.test(path),
    )
    .sort();

// A bounded copy of the work tree: the kit's sources, the planted instance
// material, and the synthetic local-terms list in its ignored location.
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
  "package.json",
  "package-lock.json",
  "LICENSE",
  "LICENSE-docs",
  "NOTICE",
  ".gitignore",
  "docs/product/07-execution-guide.md",
  "docs/PLAYBOOK.md",
  "docs/publication/implementation-overlay-template.md",
  // Not a kit file: an upstream pointer the export names and does not carry.
  "docs/LEGAL.md",
])
  copy(path);
for (const directory of ["packages/skeleton/src", "packages/compiler/src"])
  for (const name of readdirSync(join(repository, directory)))
    if (name.endsWith(".mjs")) copy(`${directory}/${name}`);
for (const [kind, path] of Object.entries(planted))
  write(
    path,
    `${marker(kind)}\n${kind === "evidence" ? `synthetic list sha256:${syntheticHash}\n` : ""}`,
  );
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
  // Every scripts/** and packages/beacons/** blob at the commit, and only those.
  const tree = new Map(
    git(source, [
      "ls-tree",
      "-r",
      "-z",
      commit,
      "--",
      "scripts",
      "packages/beacons",
    ])
      .stdout.split("\0")
      .filter(Boolean)
      .map((entry) => {
        const [meta, path] = entry.split("\t");
        return [path, meta.split(" ")];
      }),
  );
  const copied = [...listed.keys()].filter(
    (path) =>
      path.startsWith("scripts/") || path.startsWith("packages/beacons/"),
  );
  assert.deepEqual(copied.sort(), [...tree.keys()].sort());
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
    "docs/product/07-execution-guide.md",
    "docs/PLAYBOOK.md",
    "docs/publication/implementation-overlay-template.md",
    "package.json",
    "package-lock.json",
    "dotln.config.example.json",
    "UPSTREAM.md",
  ])
    assert.ok(listed.has(path), `${path} is a kit file`);
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
    "docs/decisions/README.md",
    "docs/discovery/README.md",
    "docs/evidence/README.md",
    "docs/final-reviews/README.md",
    "docs/intake/.gitkeep",
    "docs/observations/README.md",
    "docs/planning/README.md",
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
  for (const key of Object.keys(lock.packages))
    assert.ok(
      key === "" ||
        key.startsWith("node_modules/") ||
        key === "packages/beacons",
      `${key} is not a kit lockfile entry`,
    );
  assert.ok(
    !Object.keys(lock.packages).some((key) =>
      /skeleton|compiler|kernel|console|browser-evidence/u.test(key),
    ),
  );
  const install = run(
    "npm",
    ["ci", "--offline", "--no-audit", "--no-fund", "--loglevel=error"],
    { cwd: kit, timeout: 300_000 },
  );
  assert.equal(install.status, 0, install.stderr || install.stdout);
  for (const name of [
    "prettier",
    "typescript",
    "@types/node",
    "@dotln/beacons",
  ])
    assert.ok(existsSync(join(kit, "node_modules", name)), name);
  assert.equal(
    readlinkSync(join(kit, "node_modules/@dotln/beacons"))
      .replace(/\/$/u, "")
      .split("/")
      .slice(-2)
      .join("/"),
    "packages/beacons",
  );
});

test("WO-074 criteria 1, 2 and 5: without package source the export activates its first order, a transition emits a decodable control Beacon, and an unmatched attestation records with the advisory", async () => {
  assert.ok(!existsSync(join(kit, "packages/skeleton/src/planted.ts")));
  assert.ok(
    !files(kit).some((path) => /^packages\/[^/]+\/src\/.*\.ts$/u.test(path)),
    "no TypeScript source in the export",
  );
  // "package source" is TypeScript source (step 1): the skeleton holds only
  // the build-free modules the scripts import and the empty grants seed.
  assert.deepEqual(
    files(kit)
      .filter((path) => path.startsWith("packages/skeleton/"))
      .sort(),
    [
      "packages/skeleton/loadouts/grants.json",
      "packages/skeleton/src/correction-observation.mjs",
      "packages/skeleton/src/evidence-editions.mjs",
      "packages/skeleton/src/gate-deadlines.mjs",
      "packages/skeleton/src/gate-evidence.mjs",
      "packages/skeleton/src/usage-observation.mjs",
      "packages/skeleton/src/writer-teardown.mjs",
    ],
  );
  initRepository(kit);
  git(kit, ["add", "."]);
  git(kit, ["commit", "-qm", "exported launchpad"]);
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
  // provides; without a build it refuses and records nothing (README).
  const codex = resume(["verify"], {
    env: { ...env, CODEX_THREAD_ID: "fixture-thread" },
  });
  assert.equal(codex.status, 1);
  assert.match(codex.stderr, /harness runtime is not built/u);
  assert.equal(
    JSON.parse(ok(resume(["status", "--json"]), "status").stdout).phase,
    "ready-to-verify",
  );
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
    ".claude/",
    ".beacons/",
    ".control-beacons/",
    ".runtime/",
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

test("WO-074 design: a kit file absent at the commit refuses by name, and a destination inside a Git work tree is advised", () => {
  const inside = join(source, "nested-export");
  const nested = ok(runExport(inside), "export inside a work tree");
  assert.match(
    nested.stdout,
    /^advisory: the destination lies inside the Git work tree /mu,
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
