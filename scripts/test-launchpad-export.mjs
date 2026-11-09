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
  unlinkSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defaultRoots, loadConfig } from "./lib/config.mjs";
import { describeTag, spawnGit } from "./lib/git.mjs";
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
import { hasPackageSources } from "../packages/skeleton/src/runtime-inputs.mjs";
import { namedStarterSeed } from "./lib/starter-seeds.mjs";
import { markdownLinks } from "./docs-check.mjs";
import { suites, STRUCTURAL_TASKS } from "./test-runner.mjs";

import {
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
} from "./lib/launchpad-fixture.mjs";

test("[document] the kit owns its complete guide and the front page is a pinned instance seed", () => {
  const guide = readFileSync(join(kit, "docs/KIT.md"), "utf8");
  assert.equal(
    manifestOf(kit).files.find(({ path }) => path === "docs/KIT.md")?.sha256,
    sha256(guide),
  );
  assert.deepEqual(
    [...guide.matchAll(/^## (.+)$/gm)].map((match) => match[1]),
    [
      "First steps",
      "Plan-first mode",
      "Features",
      "Planning in this instance",
      "Releases in this instance",
      "What runs here, and what does not",
      "Attestations",
      "Kit files and instance files",
      "Taking upstream updates",
      "Opting in to instance actions",
      "Owned cleanup and retention",
      "Document quality",
      "License",
    ],
  );
  assert.doesNotMatch(guide, /DOTLN-RELEASE-(?:BEGIN|END)/u);
  // Changing this seed rewrites each unedited starter copy once. Name that
  // migration in the changing order's decisions and release's Read before upgrading.
  assert.equal(
    sha256(readFileSync(join(repository, "scripts/kit/README.client.md"))),
    "4b60b964df6168c2d9ddef3b806d051d9f3b0e2be5ea40dfef10760909ab9699",
  );
  const seed = readFileSync(join(kit, "README.md"), "utf8");
  assert.equal(
    seed,
    readFileSync(join(kit, "scripts/kit/README.client.md"), "utf8"),
  );
  assert.match(seed, /^# DotLn-Enterprise-Starter$/m);
  assert.match(seed, /\[kit guide\]\(docs\/KIT\.md\)/u);
  assert.equal(
    seed
      .split("<!-- DOTLN-RELEASE-BEGIN -->")[1]
      .split("<!-- DOTLN-RELEASE-END -->")[0]
      .trim(),
    "This source prepares DotLn-Enterprise-Starter `v0.1.0`.",
  );
  assert.ok(!manifestOf(kit).files.some(({ path }) => path === "README.md"));
  // The front page links the map, and the map links the kit guide and each
  // root README the export seeds, so a first pass red-tags none of them
  // (WO-258 step 12).
  assert.match(seed, /\[map\]\(docs\/README\.md\)/u);
  const map = readFileSync(join(kit, "docs/README.md"), "utf8");
  assert.match(map, /\[docs\/KIT\.md\]\(KIT\.md\)/u);
  const linked = new Set(markdownLinks(map).map(({ href }) => `docs/${href}`));
  for (const path of files(kit).filter((path) =>
    /^docs\/[^/]+\/README\.md$/u.test(path),
  ))
    assert.ok(linked.has(path), `the map links ${path}`);
  for (const { href } of markdownLinks(map))
    assert.ok(existsSync(join(kit, "docs", href)), `${href} resolves`);
});

test("WO-254 criterion 5: the exported instance's operator record says a standing rule is recorded only from the operator's direction, with its capture digest", () => {
  const record = readFileSync(join(kit, "AI-HARNESS-SECURITY.md"), "utf8")
    .replace(/\s+/gu, " ")
    .trim();
  assert.ok(
    record.includes(
      "A standing rule enters this record, or any standing document, only from the operator's direction: the planning pass that writes it names it in its Rules recorded block with the operator message's journal reference and capture digest, and `plan check` refuses a rule whose message was a question or that names no message.",
    ),
    record,
  );
});

// Reads core's seeds, instruction and first order to classify them, which a
// product task may not read: the document gate runs this case (test-runner's
// launchpad-docs row), the product gate skips it.
test("[document] WO-238 criteria 1 and 9: an exported instance gives its seeds and first order core's kinds, and its seeds state where history and the kit's explanation live", async () => {
  const { documentKind, documentKinds, readDocumentControl } =
    await import("./lib/document-kinds.mjs");
  const instance = documentKinds(kit);
  // Core's counterparts are classified one path at a time: a product task
  // reads no other order's records.
  const coreKinds = readDocumentControl(repository).kinds;
  const coreKind = (path) =>
    documentKind(repository, path, { kinds: coreKinds }).kind;
  // The eight seeds, by the instance path and the core document of the same
  // role; .gitignore is a seed and no document.
  for (const [seed, counterpart] of [
    ["README.md", "README.md"],
    ["CLAUDE.md", "CLAUDE.md"],
    ["AI-HARNESS-SECURITY.md", "docs/AI-HARNESS-SECURITY.md"],
    ["docs/workstreams/README.md", "docs/workstreams/README.md"],
    ["docs/repositories/README.md", "docs/repositories/README.md"],
    ["docs/control/budgets.json", "docs/control/budgets.json"],
    [
      "docs/work-orders/WO-001-environment-truth.md",
      "docs/work-orders/WO-238-a-document-says-what-is-so.md",
    ],
  ]) {
    assert.equal(instance.get(seed)?.kind, "standing", seed);
    assert.equal(instance.get(seed).kind, coreKind(counterpart), seed);
  }
  assert.equal(instance.has(".gitignore"), false);
  // The paths the kit's own commands write, and the manifest template it
  // carries, hold core's kinds in the instance with the instance's own
  // override list, which the export does not seed.
  const instanceKinds = readDocumentControl(kit).kinds;
  for (const path of [
    "docs/releases/tag-manifest.template.json",
    "docs/proposals/fixture-packet/packet.json",
    "docs/instance/entropy-reducer/runs/REVIEW-001.md",
    "docs/lineage/idea-ledger.md",
    "docs/planning/followups.md",
    "docs/planning/followups.json",
    "docs/planning/cost-table.json",
  ])
    assert.equal(
      documentKind(kit, path, { kinds: instanceKinds }).kind,
      coreKind(path),
      path,
    );
  assert.equal(
    instance.get("docs/releases/tag-manifest.template.json")?.kind,
    "standing",
  );
  const profile = readFileSync(
    join(kit, "docs/repositories/README.md"),
    "utf8",
  );
  assert.doesNotMatch(profile, /\*\*Checked:\*\*/u);
  assert.match(profile, /^\*\*Current at:\*\* <commit>$/mu);
  assert.match(profile, /never its history/u);
  const workstream = readFileSync(
    join(kit, "docs/workstreams/README.md"),
    "utf8",
  );
  assert.match(workstream, /^## Rules$/mu);
  assert.match(
    workstream,
    /member\s+orders and their decisions hold the history/u,
  );
  const instruction = readFileSync(join(kit, "CLAUDE.md"), "utf8");
  const block = instruction.slice(
    instruction.indexOf("<!-- dotln-harness:start -->"),
    instruction.indexOf("<!-- dotln-harness:end -->"),
  );
  const residueProfiles = new Set(
    block
      .split("\n")
      .map((line) => /^([a-z][a-z-]*-\d+\.\d+\.\d+): /u.exec(line)?.[1])
      .filter(Boolean),
  );
  // A fresh export elects no other host and its record shows none, so its
  // block names Claude's residue alone (WO-258).
  assert.deepEqual(
    [...residueProfiles],
    harnessManifestOf(kit).profiles.map((row) => row.profile.profileId),
    "the block names each emitted profile's residue",
  );
  assert.deepEqual(
    harnessManifestOf(kit).profiles.map((row) => row.profile.harness),
    ["claude-code"],
  );
  for (const id of residueProfiles)
    assert.equal(
      block.split("\n").filter((line) => line.startsWith(`${id}: `)).length,
      1,
      `${id} has one residue line`,
    );
  assert.match(
    instruction,
    /^Documents are standing, record or generated\.$/mu,
  );
  const readme = readFileSync(join(kit, "README.md"), "utf8");
  assert.match(readme, /\[kit guide\]\(docs\/KIT\.md\)/u);
  assert.match(readme, /launchpad instance/u);
  const guide = readFileSync(join(kit, "docs/KIT.md"), "utf8");
  for (const heading of [
    "Kit files and instance files",
    "Taking upstream updates",
    "Owned cleanup and retention",
  ]) {
    assert.ok(!readme.includes(`\n## ${heading}\n`), heading);
    assert.ok(guide.includes(`\n## ${heading}\n`), heading);
  }
  assert.ok(existsSync(join(kit, "docs/product/operator-reference.md")));
});

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

test("WO-238: a carried document's link to a moved record keeps its bytes and points upstream to where the record lives at the commit", () => {
  const guide = readFileSync(
    join(kit, "docs/product/07-execution-guide.md"),
    "utf8",
  );
  assert.match(guide, /\]\(\.\.\/planning\/critical-path-2026-09-08\.md\)/u);
  const upstream = readFileSync(join(kit, "UPSTREAM.md"), "utf8");
  assert.ok(
    upstream.includes(
      `\`owner/launchpad@${commit.slice(0, 12)} docs/planning/passes/critical-path-2026-09-08.md\``,
    ),
    "the pointer names the moved record's path at the commit",
  );
  assert.doesNotMatch(
    upstream,
    / docs\/planning\/critical-path-2026-09-08\.md`/u,
  );
});

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
  // A link to a moved record points where the record lives at the commit.
  const moved = new Map(
    JSON.parse(
      readFileSync(join(source, "docs/control/document-moves.json"), "utf8"),
    ).moves.map((move) => [move.from, move.to]),
  );
  for (const [key, ...parts] of KIT_FILES.documents) {
    const path = ["docs", ...(key === "docs" ? [] : [key]), ...parts].join("/");
    if (!path.endsWith(".md")) continue;
    const document = readFileSync(join(kit, path), "utf8");
    for (const { href } of markdownLinks(document)) {
      if (/^[a-z][a-z0-9+.-]*:|^\/\/|^#/iu.test(href)) continue;
      const target = resolve(
        kit,
        dirname(path),
        decodeURIComponent(href.split(/[?#]/u)[0]),
      );
      if (href.includes("AI-HARNESS-SECURITY.md")) {
        assert.equal(target, join(kit, "AI-HARNESS-SECURITY.md"));
        assert.ok(
          !href.includes("#"),
          "instance-owned headings have no core fragment",
        );
      }
      if (!existsSync(target)) {
        const relativeTarget = target.slice(kit.length + 1);
        assert.ok(
          upstream.includes(
            ` ${moved.get(relativeTarget) ?? relativeTarget}\``,
          ),
          `${path}: ${href} has a pinned upstream pointer`,
        );
      }
    }
  }
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
    HARNESS_MANIFEST,
    "docs/product/07-execution-guide.md",
    "docs/product/operator-reference.md",
    "docs/product/08-publication-compiler.md",
    "docs/PLAYBOOK.md",
    "docs/KIT.md",
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
    "docs/decisions/README.md",
    "docs/discovery/README.md",
    "docs/evidence/README.md",
    "docs/final-reviews/README.md",
    "docs/intake/.gitkeep",
    "docs/lineage/README.md",
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
    "dotln.config.json",
    "packages/skeleton/loadouts/grants.json",
  ]);
  // The lineage index is generated from the seed ledger. The work-order index
  // is generated when activation records an order.
  assert.ok(!existsSync(join(kit, "docs/work-orders/README.md")));
  assert.ok(existsSync(join(kit, "docs/lineage/README.md")));
  ok(
    run(process.execPath, ["scripts/lineage.mjs", "index", "--check"], {
      cwd: kit,
    }),
    "seeded lineage index is current",
  );
  // The seeded roots overview says the same: the export seeds that index.
  const overview = readFileSync(join(kit, "docs/README.md"), "utf8");
  assert.match(overview, /its README is the index the export seeds/u);
  assert.doesNotMatch(overview, /once a ledger exists/u);
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
  assert.equal(loadConfig(kit).release.displayName, "DotLn-Enterprise-Starter");
  assert.doesNotMatch(
    readFileSync(join(kit, "docs/README.md"), "utf8"),
    /is absent/u,
  );
  assert.match(
    readFileSync(join(kit, "README.md"), "utf8"),
    /This source prepares DotLn-Enterprise-Starter/u,
  );
  assert.deepEqual(config.roots, defaultRoots());
  const { "plan-first": planFirst, ...otherFeatures } = config.features;
  const { note: planFirstNote, ...planFirstElection } = planFirst;
  assert.deepEqual(planFirstElection, { on: false });
  assert.equal(typeof planFirstNote, "string");
  for (const purpose of [/plan/iu, /diff/iu, /approval/iu])
    assert.match(planFirstNote, purpose);
  assert.deepEqual(otherFeatures, {
    "tinkerer-economy": {
      on: true,
      note: "Compare approaches when a useful fork appears.",
    },
    "private-destination": false,
    "desktop-control": false,
  });
  assert.match(
    readFileSync(join(kit, "docs/KIT.md"), "utf8"),
    /## Features\n/u,
  );
  assert.equal(
    JSON.parse(readFileSync(join(kit, "package.json"), "utf8")).scripts
      .features,
    "node scripts/features.mjs",
  );
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
  // The export's host check and npm read the range core declares.
  assert.equal(kitPackage.engines.node, corePackage.engines.node);
  assert.equal(lock.packages[""].engines.node, corePackage.engines.node);
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
    // Every exported manifest and its lock entry carry core's range.
    assert.equal(
      JSON.parse(
        readFileSync(join(kit, `packages/${name}/package.json`), "utf8"),
      ).engines.node,
      corePackage.engines.node,
      name,
    );
    assert.equal(
      lock.packages[`packages/${name}`].engines.node,
      corePackage.engines.node,
      name,
    );
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
  git(scratch, ["-c", "maintenance.auto=false", "clone", "-q", source, clone]);
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

test("the exported instance checks runtime, coordination records and explicit diagnostics separately", (t) => {
  const started = performance.now();
  const destination = commitWarmExport(join(scratch, "gate-kit"));
  const reuse = ok(
    run(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { join } from "node:path"; import { scratch, commitWarmExport } from ${JSON.stringify(pathToFileURL(join(repository, "scripts/lib/launchpad-fixture.mjs")).href)}; commitWarmExport(join(scratch, "reuse-probe"));`,
      ],
      {
        env: {
          ...env,
          GIT_AUTHOR_DATE: "2001-01-02T00:00:00Z",
          GIT_COMMITTER_DATE: "2001-01-02T00:00:00Z",
        },
        timeout: 300000,
      },
    ),
    "independent warm-cache consumer",
  );
  assert.match(reuse.stdout, /Fixture install: warm cache hit \(0 npm ci\)/);
  // A new consumer has no upstream comparison ref. That must not select
  // every shipped platform fixture for its ordinary review.
  git(destination, ["branch", "-m", "instance"]);
  assert.equal(hasPackageSources(destination), false);
  assert.ok(existsSync(join(destination, "node_modules/typescript")));
  const nestedCase = join(destination, ".runtime/nested-runner.test.mjs");
  mkdirSync(dirname(nestedCase), { recursive: true });
  writeFileSync(
    nestedCase,
    'import test from "node:test"; test("nested runner executes", () => {});\n',
  );
  const nested = ok(
    run(process.execPath, ["--test", "--test-reporter=tap", nestedCase], {
      cwd: destination,
    }),
    "nested Node runner",
  );
  assert.match(nested.stdout, /# tests 1\b/u);
  assert.match(nested.stdout, /# pass 1\b/u);
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
  const guidance = ok(
    run(process.execPath, ["scripts/reader.mjs", "profile", "releasePage"], {
      cwd: destination,
    }),
    "default reader guidance in an instance",
  );
  assert.match(guidance.stdout, /Profile source: balanced default/);
  assert.doesNotMatch(guidance.stdout, /ENOENT|Nearest example:/);
  ok(
    run(process.execPath, ["scripts/lineage.mjs", "index", "--check"], {
      cwd: destination,
    }),
    "the exported lineage index is already current",
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
  const inventory = [
    ...new Set([
      ...STRUCTURAL_TASKS,
      ...suites
        .filter((row) => row.build || (row.instance && !row.generated))
        .map((row) => (row.build ? "kit-verify" : row.name)),
    ]),
  ].sort();
  const selections = [
    { command: ["test"], args: [] },
    { command: ["run", "test:docs"], args: ["--document"] },
    { command: ["test", "--", "--review"], args: ["--review"] },
  ];
  const runtimeState = () =>
    JSON.parse(
      ok(
        run(
          process.execPath,
          [
            "--input-type=module",
            "-e",
            `
    import { createHash } from 'node:crypto';
    import { readFileSync } from 'node:fs';
    import { gateInstanceInputDigest } from './scripts/lib/gate-evidence.mjs';
    import { runtimePackageInventory, runtimeSnapshotPath } from './scripts/lib/harness.mjs';
    const runtime = JSON.parse(readFileSync('.claude/harness-manifest.json', 'utf8')).profiles[0].profile.runtime;
    const inventory = runtimePackageInventory(process.cwd());
    console.log(JSON.stringify({digest: gateInstanceInputDigest(process.cwd()), snapshot: runtime.snapshot,
      predicted: runtimeSnapshotPath(runtime.files, inventory),
      inventory: createHash('sha256').update(JSON.stringify(inventory)).digest('hex')}));
  `,
          ],
          { cwd: destination },
        ),
        "observe exported runtime inputs",
      ).stdout,
    );
  const cleanRuntime = runtimeState();
  assert.equal(cleanRuntime.snapshot, cleanRuntime.predicted);
  const noise = [
    "packages/.DS_Store",
    "packages/skeleton/dist/.DS_Store",
    "packages/skeleton/dist/local.tsbuildinfo",
    "packages/beacons/src/.DS_Store",
    `${cleanRuntime.snapshot}/packages/compiler/dist/.DS_Store`,
  ];
  for (const path of noise) {
    assert.equal(existsSync(join(destination, path)), false);
    writeFileSync(join(destination, path), "incidental host metadata\n");
  }
  const bin = join(destination, "packages/skeleton/dist/src/dotln.js");
  const binMode = lstatSync(bin).mode & 0o777;
  assert.ok(binMode & 0o111);
  chmodSync(bin, 0o700);
  assert.deepEqual(runtimeState(), cleanRuntime);
  const observed = [];
  const ran = new Set();
  for (const { command, args } of selections) {
    const list = ok(
      run(
        process.execPath,
        ["scripts/test-runner.mjs", ...args, "--list", "--selected"],
        {
          cwd: destination,
        },
      ),
      "kit suite list",
    );
    assert.deepEqual(exclusions(list.stdout), []);
    const names = list.stdout
      .split("\n")
      .filter((line) => line.includes(" — protects:"))
      .map((line) => line.split(" — ")[0]);
    assert.deepEqual(names.slice(0, 6), STRUCTURAL_TASKS);
    assert.ok(!names.includes("build"));
    // The recorded Git surface check is core's, as every core-only row is.
    assert.ok(!names.includes("git-surface"));
    assert.deepEqual(
      [...names].sort(),
      args.includes("--document")
        ? inventory
        : [...STRUCTURAL_TASKS, "kit-verify"].sort(),
    );
    for (const name of [
      "target-worktree",
      "publication-fixtures",
      "beacon-portability",
      "resident-bind",
      "artifact-corpus",
    ])
      assert.ok(!names.includes(name), `${name} is a platform diagnostic`);
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
    assert.deepEqual(exclusions(result.stdout), []);
    assert.doesNotMatch(
      result.stdout,
      /PROGRESS \[build\]|scripts\/build\.mjs/u,
    );
    const first = /^PROGRESS \[(?!bounded-probe\])([^\]]+)\]/mu.exec(
      result.stdout,
    );
    assert.equal(first?.[1], "format", result.stdout);
    const row = readGateChecks(destination)
      .filter((row) => row.checkId !== "structural")
      .at(-1);
    assert.equal(row.exitCode, 0);
    assert.equal(row.codeIdentity, before);
    assert.equal(gateCodeIdentity(destination), before);
    assert.equal(row.reusedSuites, 0);
    assert.equal(row.partial, undefined);
    assert.equal(row.excludedSuites, undefined);
    assert.deepEqual(
      row.cases.map((suite) => suite.name).sort(),
      [...names].sort(),
    );
    for (const suite of row.cases) ran.add(suite.name);
    observed.push({
      command: `npm ${command.join(" ")}`,
      listedSuites: names,
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
  // The document check the gate ran reports no unbound standing document, so
  // a first planning pass red-tags none of the seeds (WO-258 criterion 6).
  const documents = ok(
    run(process.execPath, ["scripts/docs-check.mjs"], { cwd: destination }),
    "export document check",
  );
  assert.doesNotMatch(
    documents.stdout + documents.stderr,
    /^UNBOUND /mu,
    documents.stdout,
  );
  assert.match(
    documents.stdout,
    /; 0 standing without a reader binding/u,
    documents.stdout,
  );
  ok(
    run(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `
    import assert from 'node:assert/strict';
    import { readFileSync, rmSync } from 'node:fs';
    import { findGateCheck, readGateChecks, gateInstanceInputDigest } from './scripts/lib/gate-evidence.mjs';
    import { gateCandidates, coveringGateCheck } from './scripts/lib/gate-reuse.mjs';
    import { prepareKitReleaseRuntime } from './scripts/lib/release-kit-runtime.mjs';
    const root = process.cwd();
    const row = readGateChecks(root).filter(row => row.checkId === 'npm test').at(-1);
    assert.equal(findGateCheck(root, 'npm test', row.treeHash).evidenceRef, row.evidenceRef);
    assert.equal((await gateCandidates(root, 'npm test')).rows.at(-1).evidenceRef, row.evidenceRef);
    assert.equal((await coveringGateCheck(root, 'npm test', ['kit-verify', 'generated'])).row.evidenceRef, row.evidenceRef);
    await prepareKitReleaseRuntime(root);
    const runtime = JSON.parse(readFileSync('.claude/harness-manifest.json', 'utf8')).profiles[0].profile.runtime;
    rmSync(runtime.snapshot, {recursive: true});
    await prepareKitReleaseRuntime(root);
    assert.equal(gateInstanceInputDigest(root), row.instanceInputDigest);
  `,
      ],
      { cwd: destination },
    ),
    "metadata leaves evidence consumers and release restoration usable",
  );
  chmodSync(bin, binMode);
  for (const path of noise) rmSync(join(destination, path), { force: true });
  assert.deepEqual(runtimeState(), cleanRuntime);
  const record = join(destination, "docs/invalid-instance-record.md");
  const recordIdentity = gateCodeIdentity(destination);
  try {
    writeFileSync(
      record,
      "# Invalid record\n\n[Missing](missing-coordination-record.md)\n",
    );
    assert.equal(gateCodeIdentity(destination), recordIdentity);
    const invalid = run(
      process.execPath,
      ["scripts/harness.mjs", "bounded", "--", "npm", "run", "test:docs"],
      { cwd: destination },
    );
    assert.equal(invalid.status, 1, invalid.stdout + invalid.stderr);
    const failed = readGateChecks(destination)
      .filter((row) => row.checkId === "npm run test:docs")
      .at(-1);
    assert.equal(failed.codeIdentity, recordIdentity);
    assert.equal(failed.reusedSuites, 0);
    assert.equal(
      failed.cases.find((row) => row.name === "docs-check").exitCode,
      1,
    );
  } finally {
    rmSync(record, { force: true });
  }
  const guide = readFileSync(join(destination, "docs/KIT.md"), "utf8")
    .split("## What runs here, and what does not")[1]
    .split("## Attestations")[0];
  for (const row of suites.filter((row) => row.kit))
    assert.ok(
      guide.includes(
        `| \`${row.name}\` | ${row.kit.slice("core-only: ".length)} |`,
      ),
      `Kit guide omission: ${row.name}`,
    );
  for (const { command, listedSuites } of observed) {
    const declared = `- \`${command}\`: ${listedSuites.map((name) => `\`${name}\``).join(", ")}.`;
    assert.ok(
      guide.includes(declared),
      `Kit guide selection differs: ${command}`,
    );
  }
  const unavailableSelections = [];
  for (const name of ["kernel", "runner-fixtures"]) {
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
    const failure = readGateChecks(destination)
      .filter((row) => row.checkId === "npm test")
      .at(-1);
    assert.equal(
      failure.cases.find((row) => row.name === "kit-verify").exitCode,
      1,
    );
    assert.equal(
      failure.cases.find((row) => row.name === "kit-verify").executed,
      false,
    );
    assert.ok(failure.stale.includes("runtime"));
    assert.equal(failure.failedFirst, "generated");
    assert.ok(
      failure.cases
        .filter((row) => row.executed)
        .every(
          (row) =>
            row.name === "kit-verify" || STRUCTURAL_TASKS.includes(row.name),
        ),
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
test("WO-258 criterion 1: an export with no election and no host in its record emits Claude's surfaces only; an election, an attestation or an observed version adds Codex's, and turning it off removes them", () => {
  const hostPaths = (root) =>
    [".codex", ".agents"].filter((path) => existsSync(join(root, path)));
  // The fresh export itself: nothing under .codex or .agents, Claude's
  // profile alone, and no host surface in the kit manifest.
  assert.deepEqual(hostPaths(kit), []);
  assert.ok(
    !manifestOf(kit).files.some(({ path }) =>
      /^\.(?:codex|agents)\//u.test(path),
    ),
  );
  const clone = commitWarmExport(join(scratch, "wo258-hosts"));
  const profiles = () =>
    harnessManifestOf(clone).profiles.map((row) => row.profile.harness);
  const emit = () => ok(harness(clone, "emit"), "emit");
  const render = () =>
    ok(
      run("npm", ["run", "--silent", "features", "--", "render"], {
        cwd: clone,
      }),
      "features render",
    );
  const codexRow = () =>
    readFileSync(join(clone, "docs/control/FEATURES.md"), "utf8")
      .split("\n")
      .find((line) => line.startsWith("| host-codex |"));
  const config = (features) =>
    writeFileSync(
      join(clone, "dotln.config.json"),
      JSON.stringify(
        {
          version: 1,
          release: { displayName: "DotLn-Enterprise-Starter" },
          ...(features ? { features } : {}),
        },
        null,
        2,
      ) + "\n",
    );
  emit();
  assert.deepEqual(hostPaths(clone), [], "no election, no record");
  assert.deepEqual(profiles(), ["claude-code"]);
  render();
  assert.match(
    codexRow(),
    /^\| host-codex \| instance \| false \| false \| default \|/u,
  );
  const codexSurfaces = [
    ".codex/config.toml",
    ".codex/hooks.json",
    ".codex/hooks/continuation.mjs",
    ".codex/agents/dotln-worker-astra.toml",
    ".agents/skills/dotln-executor/SKILL.md",
  ];
  const assertCodex = (label) => {
    emit();
    for (const path of codexSurfaces)
      assert.ok(existsSync(join(clone, path)), `${label}: ${path}`);
    assert.deepEqual(profiles(), ["claude-code", "codex-cli"], label);
    ok(harness(clone, "check"), `${label}: check`);
  };
  // The election.
  config({ "host-codex": true });
  assertCodex("elected");
  render();
  assert.match(
    codexRow(),
    /^\| host-codex \| instance \| false \| true \| elected \|/u,
  );
  // Turning it off removes the surfaces the previous manifest installed and
  // the directories they emptied.
  config({ "host-codex": false });
  emit();
  assert.deepEqual(hostPaths(clone), [], "turned off");
  assert.deepEqual(profiles(), ["claude-code"]);
  ok(harness(clone, "check"), "turned off: check");
  // An attestation naming codex-cli in the export's own control log.
  config();
  writeFileSync(
    join(clone, "docs/control/resume.jsonl"),
    JSON.stringify({
      schemaVersion: 1,
      recordedAt: "2030-01-02T00:00:00.000Z",
      type: "ImplementationReady",
      workOrderId: "WO-001",
      actor: {
        harness: "codex-cli",
        harnessVersion: "0.153.4",
        model: "fixture",
        effort: "max",
        source: "operator-attested",
      },
    }) + "\n",
  );
  assertCodex("attested");
  render();
  assert.match(
    codexRow(),
    /^\| host-codex \| instance \| false \| true \| inferred: docs\/control\/resume\.jsonl attestations \|/u,
  );
  rmSync(join(clone, "docs/control/resume.jsonl"));
  // An observed codex-cli version in the export's discovery record.
  writeFileSync(
    join(clone, "docs/discovery/environment.json"),
    JSON.stringify({
      effortReadbackProbe: {
        harnesses: {
          "codex-cli": {
            versions: [{ classification: "observed", value: "0.153.4" }],
          },
        },
      },
    }) + "\n",
  );
  assertCodex("observed");
  render();
  assert.match(
    codexRow(),
    /^\| host-codex \| instance \| false \| true \| inferred: docs\/discovery\/environment\.json observed versions \|/u,
  );
});

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
  // A fresh export starts with no cold-start breach: the template's router
  // ceiling is the raised one (WO-258 criterion 7), and the other roles are
  // unset there.
  const router = inside.profiles.find(
    (row) => row.role === "router" && row.bytes !== null,
  );
  assert.equal(router.ceiling, 21220);
  assert.deepEqual(
    inside.profiles
      .filter((row) => row.verdict === "breach")
      .map((row) => `${row.skillsRoot}/${row.role}`),
    [],
  );
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
      "packages/skeleton/src/dispatch-journal.mjs",
      "packages/skeleton/src/duration.mjs",
      "packages/skeleton/src/evidence-editions.mjs",
      "packages/skeleton/src/gate-deadlines.mjs",
      "packages/skeleton/src/gate-evidence.mjs",
      "packages/skeleton/src/runtime-inputs.mjs",
      "packages/skeleton/src/temporary-root-records.mjs",
      "packages/skeleton/src/test-selection.mjs",
      "packages/skeleton/src/usage-observation.mjs",
      "packages/skeleton/src/writer-teardown.mjs",
      "packages/skeleton/test/control-beacon-cli.fixture-inputs.json",
    ],
  );
  configureRepository(kit);
  git(kit, ["add", "."]);
  git(kit, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "exported launchpad",
  ]);
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
  git(kit, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "fixture handoff",
  ]);
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
  const guide = readFileSync(join(kit, "docs/KIT.md"), "utf8");
  assert.match(guide, /a fresh fork has none/u);
  assert.match(guide, /has no matching discovery observation/u);
  assert.match(guide, /until this instance records its own discovery/u);
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
    // Empty: a present list with no term is present with a count of zero
    // (WO-227); the export proceeds and the summary prints no count.
    writeFileSync(termsPath, "# only a comment\n\n");
    const emptyTarget = join(scratch, "kit-empty-list");
    const empty = ok(runExport(emptyTarget), "export with an empty list");
    assert.match(
      empty.stdout,
      /^local-terms list: present \(\d+ texts checked\)$/mu,
    );
    assert.ok(existsSync(emptyTarget), "an empty list refuses nothing");
    // Malformed: a mode marker with no term refuses naming the line, before
    // any write.
    writeFileSync(termsPath, "refuse:\n");
    const malformedTarget = join(scratch, "kit-malformed-list");
    const malformed = runExport(malformedTarget);
    assert.equal(malformed.status, 1);
    assert.match(
      malformed.stderr,
      /local-terms list line 1: a mode marker with no term/u,
    );
    assert.ok(!existsSync(malformedTarget), "a refused export writes nothing");
    // Both kit guidance and the instance seed are screened. Report the file
    // and line of a match without printing the term or writing the export.
    for (const [name, term, location, redaction] of [
      [
        "guide",
        "Attestations",
        /"file":"docs\/KIT\.md","line":\d+/u,
        /attestations/iu,
      ],
      [
        "seed",
        "This source prepares",
        /"file":"README\.md","line":\d+/u,
        /this\s*source\s*prepares/iu,
      ],
    ]) {
      writeFileSync(termsPath, `${term}\n`);
      const matchTarget = join(scratch, `kit-match-${name}`);
      const matched = runExport(matchTarget);
      assert.equal(matched.status, 1);
      assert.match(matched.stderr, /local-terms list present; refused \[/u);
      assert.match(matched.stderr, location);
      assert.doesNotMatch(matched.stderr + matched.stdout, redaction);
      assert.ok(!existsSync(matchTarget), "a refused export writes nothing");
    }
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

test("export refuses a replaced blob hidden by assume-unchanged before destination creation", () => {
  const path = "packages/kernel/src/index.ts";
  const touched = join(source, path);
  const original = readFileSync(touched);
  const object = git(source, ["rev-parse", `HEAD:${path}`]).stdout.trim();
  git(source, ["update-index", "--assume-unchanged", "--", path]);
  try {
    writeFileSync(
      touched,
      Buffer.concat([
        original,
        Buffer.from("\nexport const replacementProbe = 1;\n"),
      ]),
    );
    const replacement = git(source, ["hash-object", "-w", path]).stdout.trim();
    git(source, ["replace", object, replacement]);
    assert.equal(git(source, ["status", "--porcelain", "--", path]).stdout, "");
    const target = join(scratch, "kit-replaced-blob");
    const refused = runExport(target);
    assert.equal(refused.status, 1, refused.stdout);
    assert.match(refused.stderr, /work tree differs from HEAD/);
    assert.ok(!existsSync(target));
  } finally {
    git(source, ["replace", "-d", object]);
    writeFileSync(touched, original);
    git(source, ["update-index", "--no-assume-unchanged", "--", path]);
  }
});

test("describeTag names original objects: a replacement ref cannot redirect the exact or nearest tag", () => {
  const repo = join(scratch, "describe-replace");
  mkdirSync(repo, { recursive: true });
  const identity = [
    "-c",
    "user.name=fixture",
    "-c",
    "user.email=fixture@example.invalid",
  ];
  const run = (args) => {
    const result = git(repo, args);
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  run(["init", "-q", "-b", "main"]);
  run([
    ...identity,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-q",
    "--allow-empty",
    "-m",
    "one",
  ]);
  run([...identity, "tag", "-a", "-m", "v1.0.0", "v1.0.0"]);
  run([
    ...identity,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-q",
    "--allow-empty",
    "-m",
    "two",
  ]);
  const two = run(["rev-parse", "HEAD"]);
  run([
    ...identity,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-q",
    "--allow-empty",
    "-m",
    "three",
  ]);
  run([...identity, "tag", "-a", "-m", "v2.0.0", "v2.0.0"]);
  const three = run(["rev-parse", "HEAD"]);
  run(["replace", two, three]);
  // With the replacement in force Git's own answer for the commit changes;
  // the provenance reader keeps naming the original object's nearest tag.
  const grafted = spawnGit(
    ["-C", repo, "describe", "--tags", "--abbrev=0", two],
    { encoding: "utf8" },
  );
  assert.notEqual(String(grafted.stdout ?? "").trim(), "v1.0.0");
  assert.deepEqual(describeTag(repo, two), { tag: null, nearest: "v1.0.0" });
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
  git(source, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "plant a compiled module",
  ]);
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
  git(scratch, [
    "-c",
    "maintenance.auto=false",
    "clone",
    "-q",
    committed,
    clone,
  ]);
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
  linkWarmInstall(clone);
  // The kit guide's order, commit then install, leaves the tree clean: the bin
  // target npm makes executable was written executable by the export.
  assert.equal(git(clone, ["status", "--porcelain"]).stdout, "");
  const before = harness(clone, "check");
  assert.equal(before.status, 1);
  assert.match(
    before.stderr + before.stdout,
    /harness drift: pinned snapshot missing or changed/u,
  );
  // Older exports lacked the generated lineage index. Bootstrap installs the
  // ignored runtime snapshot without creating an untracked index on main;
  // the documented update branch supplies that index in its reviewed commit.
  ok(git(clone, ["rm", "docs/lineage/README.md"]), "remove the later seed");
  ok(
    git(clone, [
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "test: model an older export",
    ]),
    "record the older seed set",
  );
  const bootstrap = ok(
    run(process.execPath, ["scripts/bootstrap.mjs"], { cwd: clone }),
    "bootstrap in the clone",
  );
  assert.match(
    bootstrap.stdout,
    /Worktree ready for Claude or Codex \(1 preparation steps\)\./u,
  );
  assert.equal(existsSync(join(clone, "docs/lineage/README.md")), false);
  assert.equal(git(clone, ["status", "--porcelain"]).stdout, "");
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
  // A registered target with no local clone mapping is named before any
  // preparation step, with the registration command (WO-257 criterion 9).
  const configPath = join(clone, "dotln.config.json");
  const config = existsSync(configPath)
    ? JSON.parse(readFileSync(configPath, "utf8"))
    : { version: 1 };
  writeFileSync(
    configPath,
    `${JSON.stringify({
      ...config,
      classes: {
        ...(config.classes ?? {}),
        fixture: { checks: [], supports: [] },
      },
      repositories: {
        ...(config.repositories ?? {}),
        "fixture-target": {
          baseBranch: "main",
          worktreeParent: "../targets",
          repositoryClass: "fixture",
          authorityProfile: {
            authorityEnvelopeId: "fixture.target",
            allowedEffects: ["repo.read", "repo.test"],
            deniedEffects: ["repo.push"],
            resourceLimits: {},
            requiredEvidence: [],
            expiresAt: Number.MAX_SAFE_INTEGER,
            revocationEventTypes: [],
          },
        },
      },
    })}\n`,
  );
  const diagnosed = ok(
    run(process.execPath, ["scripts/bootstrap.mjs"], { cwd: clone }),
    "bootstrap with a registered target and no clone mapping",
  );
  assert.match(
    diagnosed.stdout,
    /^Registered target fixture-target has no local clone recorded in docs\/control\/local\/repository-clones\.json of this checkout, the primary checkout or the main worktree \(read: [^)]+\); plan check and the document gate refuse with "recorded target clone unavailable" until it is registered: node scripts\/worktree\.mjs clone fixture-target <absolute path to its clone>$/mu,
  );
  assert.ok(
    diagnosed.stdout.indexOf("Registered target fixture-target") <
      diagnosed.stdout.indexOf("Worktree ready"),
    "the diagnostic precedes the preparation steps",
  );
  mkdirSync(join(clone, "docs/control/local"), { recursive: true });
  writeFileSync(
    join(clone, "docs/control/local/repository-clones.json"),
    `${JSON.stringify({ "fixture-target": clone })}\n`,
  );
  assert.doesNotMatch(
    ok(
      run(process.execPath, ["scripts/bootstrap.mjs"], { cwd: clone }),
      "bootstrap with the mapping recorded",
    ).stdout,
    /Registered target/u,
  );
  // A linked worktree keeps no ignored mapping of its own; the diagnostic
  // reads the primary checkout's as the gates do (round 1's criteria F2).
  // The registration is committed first, so the linked worktree's own
  // configuration registers the target (round 2's consistency F2).
  ok(
    run("git", ["-C", clone, "add", "dotln.config.json"]),
    "stage the registration",
  );
  ok(
    run("git", [
      "-C",
      clone,
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-qm",
      "fixture: register the target",
    ]),
    "commit the registration",
  );
  const linked = join(scratch, "bootstrap-linked-worktree");
  ok(
    run("git", [
      "-C",
      clone,
      "worktree",
      "add",
      "-q",
      "-b",
      "fixture-linked",
      linked,
    ]),
    "linked worktree",
  );
  try {
    assert.match(
      readFileSync(join(linked, "dotln.config.json"), "utf8"),
      /"fixture-target"/u,
      "the linked worktree registers the target",
    );
    assert.doesNotMatch(
      ok(
        run(process.execPath, ["scripts/bootstrap.mjs"], { cwd: linked }),
        "bootstrap in a linked worktree with the primary checkout's mapping",
      ).stdout,
      /Registered target/u,
    );
    // With no mapping anywhere, the linked worktree's diagnostic names the
    // places read, the primary checkout among them.
    rmSync(join(clone, "docs/control/local/repository-clones.json"));
    const unmapped = ok(
      run(process.execPath, ["scripts/bootstrap.mjs"], { cwd: linked }),
      "bootstrap in a linked worktree with no mapping anywhere",
    ).stdout;
    assert.match(
      unmapped,
      /^Registered target fixture-target has no local clone recorded in docs\/control\/local\/repository-clones\.json of this checkout, the primary checkout or the main worktree \(read: [^)]+\); plan check and the document gate refuse/mu,
    );
    assert.ok(
      unmapped.includes(clone),
      "the primary checkout is among the places read",
    );
    writeFileSync(
      join(clone, "docs/control/local/repository-clones.json"),
      `${JSON.stringify({ "fixture-target": clone })}\n`,
    );
  } finally {
    run("git", ["-C", clone, "worktree", "remove", "--force", linked]);
  }
  // A mapping that does not parse is named, not reported as every target
  // missing.
  writeFileSync(join(clone, "docs/control/local/repository-clones.json"), "{");
  assert.match(
    ok(
      run(process.execPath, ["scripts/bootstrap.mjs"], { cwd: clone }),
      "bootstrap with a malformed mapping",
    ).stdout,
    /^Registered target fixture-target: the local clone mapping could not be read \(/mu,
  );
  writeFileSync(
    join(clone, "docs/control/local/repository-clones.json"),
    `${JSON.stringify({ "fixture-target": clone })}\n`,
  );
});

test("WO-226 a fast-forwarded export restores its selected runtime for recovery, harness entry and finish", () => {
  const destination = commitExport(join(scratch, "runtime-update"));
  const upstream = join(scratch, "runtime-update.git");
  const subject = join(scratch, "runtime-update-wo999");
  git(scratch, ["init", "--bare", "-q", "-b", "main", upstream]);
  git(destination, ["remote", "add", "origin", upstream]);
  git(destination, ["push", "-q", "origin", "main"]);
  git(destination, ["worktree", "add", "-q", "-b", "wo-999", subject]);
  const priorSnapshot =
    harnessManifestOf(destination).profiles[0].profile.runtime.snapshot;
  const hostPath = "packages/skeleton/src/harness-host.ts";
  const originalHost = readFileSync(join(source, hostPath), "utf8");
  try {
    write(
      hostPath,
      originalHost + "\nexport const fixtureUpdateMarker = true;\n",
    );
    git(source, ["add", hostPath]);
    git(source, [
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-qm",
      "Fixture changed runtime pins",
    ]);
    ok(
      run(process.execPath, [
        join(source, "scripts/launchpad.mjs"),
        "export",
        "--update",
        subject,
      ]),
      "update the instance branch",
    );
    mkdirSync(join(subject, "docs/work-orders"), { recursive: true });
    mkdirSync(join(subject, "docs/control/orders"), { recursive: true });
    writeFileSync(
      join(subject, "docs/work-orders/WO-999-fixture.md"),
      "# WO-999 fixture\n\n**Model:** fixture\n**Effort:** xhigh\n",
    );
    const events = [
      {
        type: "WorkOrderActivated",
        workOrderPath: "docs/work-orders/WO-999-fixture.md",
      },
      { type: "ImplementationReady" },
      { type: "VerificationRequested", verificationId: "VER-001" },
      {
        type: "VerificationCompleted",
        verificationId: "VER-001",
        verdict: "pass",
      },
      { type: "FinalReviewRequested", finalReviewId: "FINAL-001" },
      {
        type: "FinalReviewCompleted",
        finalReviewId: "FINAL-001",
        verdict: "pass",
      },
    ].map((event) => ({
      schemaVersion: 1,
      recordedAt: "2026-10-21T00:00:00.000Z",
      workOrderId: "WO-999",
      ...event,
    }));
    writeFileSync(
      join(subject, "docs/control/orders/WO-999.jsonl"),
      events.map((event) => JSON.stringify(event)).join("\n") + "\n",
    );
    ok(
      run(process.execPath, ["scripts/resume.mjs", "next"], { cwd: subject }),
      "project the closed synthetic order before merge",
    );
    git(subject, ["add", "."]);
    git(subject, [
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-qm",
      "Fixture merged update and closed order",
    ]);
    git(subject, ["push", "-q", "origin", "HEAD:main"]);
    git(destination, ["fetch", "origin", "main"]);
    git(destination, ["merge", "--ff-only", "origin/main"]);
    const snapshot =
      harnessManifestOf(destination).profiles[0].profile.runtime.snapshot;
    assert.notEqual(snapshot, priorSnapshot);
    assert.equal(existsSync(join(destination, snapshot)), false);
    const hookPath = join(destination, ".claude/hooks/session.mjs");
    const hook = readFileSync(hookPath, "utf8");
    assert.match(hook, /preparation,/);
    const controlHook = join(
      destination,
      ".claude/hooks/fixture-build-control.mjs",
    );
    // A kit's ordinary build is now a no-op. Force the source-build path to
    // keep this control about an unavailable source build, not hook ownership.
    const sourceBuild = [
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        "import { atomicBuild } from './scripts/build.mjs'; atomicBuild();",
      ],
    ];
    writeFileSync(
      controlHook,
      hook.replace("preparation,", `${JSON.stringify(sourceBuild)},`),
    );
    const input = {
      cwd: destination,
      session_id: "export-update-recovery",
      hook_event_name: "UserPromptSubmit",
      prompt: "resume: release close",
    };
    const hookOptions = {
      cwd: destination,
      input: JSON.stringify(input),
      env: { ...env, CLAUDE_PID: String(process.pid), COPILOT_PROJECT_DIR: "" },
    };
    const controlResult = ok(
      run(process.execPath, [controlHook], hookOptions),
      "source-build control",
    );
    assert.match(
      controlResult.stdout,
      /Release-close preparation withheld.*atomicBuild.*tsconfig\.json/s,
    );
    assert.equal(existsSync(join(destination, snapshot)), false);
    rmSync(controlHook);
    const recovered = ok(
      run(process.execPath, [hookPath], hookOptions),
      "export release-close recovery",
    );
    assert.match(recovered.stdout, /Dispatch recorded by the harness/);
    assert.doesNotMatch(recovered.stdout + recovered.stderr, /npm run build/);
    assert.equal(existsSync(join(destination, snapshot)), true);
    const codexEnv = { ...env, CODEX_THREAD_ID: "export-update-recovery" };
    ok(
      run(process.execPath, ["scripts/resume.mjs", "release-close"], {
        cwd: destination,
        env: codexEnv,
      }),
      "reserve the synthetic Codex release-close writer",
    );
    assert.equal(
      existsSync(join(destination, "docs/control/local/harness/writer")),
      true,
    );
    const host = join(
      destination,
      "packages/skeleton/dist/src/harness-host.js",
    );
    const hostBytes = readFileSync(host);
    rmSync(host);
    try {
      const reservation = run(
        process.execPath,
        ["scripts/resume.mjs", "release-close"],
        { cwd: destination, env: codexEnv },
      );
      assert.equal(reservation.status, 1);
      assert.match(
        reservation.stderr,
        /writer reservation unavailable.*node scripts\/bootstrap\.mjs/,
      );
      const entryAdvisory = ok(
        run(process.execPath, ["scripts/resume.mjs", "next"], {
          cwd: destination,
          env: codexEnv,
        }),
        "closed-phase session-entry advisory",
      );
      assert.match(
        entryAdvisory.stderr,
        /session entry unavailable.*node scripts\/bootstrap\.mjs/,
      );
      // The close settles its source-only prerequisites, origin among them,
      // before it prepares or loads any runtime. This fixture's origin is a
      // local path, so the close refuses there and leaves the runtime alone.
      const close = run(
        process.execPath,
        ["scripts/release.mjs", "close", "WO-999", "--publish"],
        { cwd: destination, env: codexEnv },
      );
      assert.equal(close.status, 1);
      assert.match(
        close.stderr,
        /origin must identify exactly one matching GitHub/,
      );
      assert.equal(existsSync(host), false);
      for (const result of [reservation, entryAdvisory, close])
        assert.doesNotMatch(result.stdout + result.stderr, /npm run build/);
    } finally {
      writeFileSync(host, hostBytes);
    }
    ok(
      run(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          "import {releaseHarnessWriter} from './packages/skeleton/dist/src/harness-host.js'; releaseHarnessWriter(process.cwd(), {session_id:'export-update-recovery'});",
        ],
        { cwd: destination },
      ),
      "release synthetic session writer",
    );
    rmSync(join(destination, snapshot), { recursive: true });
    const entry = ok(
      run("npm", ["run", "harness", "--", "check"], { cwd: destination }),
      "export harness entry",
    );
    assert.match(entry.stdout, /carried-runtime restore/);
    assert.doesNotMatch(entry.stdout + entry.stderr, /npm run build/);
    assert.equal(existsSync(join(destination, snapshot)), true);
    rmSync(join(destination, snapshot), { recursive: true });
    const finished = ok(
      run(process.execPath, ["scripts/worktree.mjs", "finish", "WO-999"], {
        cwd: destination,
      }),
      "finish the export's merged worktree",
    );
    assert.match(finished.stdout, /carried-runtime restore/);
    assert.doesNotMatch(finished.stdout + finished.stderr, /npm run build/);
    assert.equal(existsSync(subject), false);
    assert.equal(existsSync(join(destination, snapshot)), true);
    ok(harness(destination, "check"), "restored export remains current");
    const buildAdvice = files(destination)
      .filter(
        (path) =>
          path.startsWith("scripts/") &&
          !/^scripts\/(?:test-|fixtures\/)/u.test(path) &&
          /\.(?:mjs|md)$/u.test(path),
      )
      .flatMap((path) =>
        readFileSync(join(destination, path), "utf8")
          .split("\n")
          .filter((line) => line.includes("npm run build"))
          .map((line) => ({ path, line })),
      );
    assert.deepEqual([...new Set(buildAdvice.map((row) => row.path))].sort(), [
      "scripts/lib/harness-runtime.mjs",
      "scripts/release.mjs",
      "scripts/resume.mjs",
    ]);
    for (const row of buildAdvice.filter(
      (row) => row.path !== "scripts/lib/harness-runtime.mjs",
    ))
      assert.match(
        row.line,
        /isKit(?:Root|Worktree).*node scripts\/bootstrap\.mjs.*npm run build/,
      );
    assert.match(
      readFileSync(join(destination, "docs/KIT.md"), "utf8"),
      /npm run build[\s\S]*carried runtime is the build; nothing to compile[\s\S]*writes nothing/u,
    );
    assert.match(
      readFileSync(
        join(destination, "scripts/lib/harness-runtime.mjs"),
        "utf8",
      ),
      /else \{\s*write\(`Refreshing pinned runtime \(\$\{cause\}\); npm run build/,
    );
    for (const path of files(destination).filter((path) =>
      /^\.(?:claude|codex)\/hooks\/.*\.mjs$/u.test(path),
    ))
      assert.doesNotMatch(
        readFileSync(join(destination, path), "utf8"),
        /run npm run build/,
      );
  } finally {
    write(hostPath, originalHost);
    git(source, ["add", hostPath]);
    git(source, [
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-qm",
      "Restore fixture runtime source",
    ]);
  }
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
  git(source, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "drop a template",
  ]);
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

test("WO-225 kit carries the console schemas and npm console uses the carried build without writes", () => {
  const listed = new Set(manifestOf(kit).files.map((file) => file.path));
  for (const file of [
    "uifa-board-v1.schema.json",
    "runtime-status-v1.schema.json",
  ])
    assert.ok(
      listed.has(`packages/console/${file}`),
      `missing contract ${file}`,
    );
  const before = git(kit, [
    "status",
    "--porcelain=v1",
    "--untracked-files=all",
  ]).stdout;
  const tree = treeSnapshot(kit);
  const built = ok(run("npm", ["run", "build"], { cwd: kit }), "kit build");
  assert.match(
    built.stdout,
    /carried runtime is the build; nothing to compile/u,
  );
  assert.equal(
    git(kit, ["status", "--porcelain=v1", "--untracked-files=all"]).stdout,
    before,
  );
  assert.deepEqual(treeSnapshot(kit), tree, "no-op build writes no file");
  ok(
    run(
      process.execPath,
      [
        "--test",
        "--test-name-pattern=WO-225 carried board schema|WO-114 shared schema",
        "packages/console/dist/test/board.test.js",
        "packages/console/dist/test/runtime-status.test.js",
      ],
      { cwd: kit },
    ),
    "carried schema tests",
  );
  const console = ok(
    run("npm", ["run", "console", "--", "board", "--json"], { cwd: kit }),
    "kit npm console",
  );
  const json = console.stdout.slice(console.stdout.indexOf("{\n"));
  assert.equal(JSON.parse(json).viewModelVersion, "uifa-board-v1");
});
