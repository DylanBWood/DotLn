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
import { suites } from "./test-runner.mjs";
import { installBeaconFixture } from "./test-beacon-fixture.mjs";

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

test("starter seed floor rule agrees with the harness emit's composition", async () => {
  const { floorFault } = await import("./lib/starter-seeds.mjs");
  const { composeHarnessInstruction } = await import("./lib/harness.mjs");
  const start = "<!-- dotln-harness:start -->",
    end = "<!-- dotln-harness:end -->",
    block = `${start}\ngenerated\n${end}\n`;
  // Every sequence of up to three pieces: text, whitespace, invisible
  // characters and markers, in and out of order.
  const pieces = ["text", " ", "\r\n", "\uFEFF", "\u200B", start, end];
  const floors = [""];
  let level = [""];
  for (let depth = 0; depth < 3; depth++) {
    level = level.flatMap((floor) => pieces.map((piece) => floor + piece));
    floors.push(...level);
  }
  assert.equal(floors.length, 400);
  floors.push(
    "Read[executor]: `@skills/dotln-executor/SKILL.md` — next, fix, status, times.\n",
  );
  const seen = { markers: 0, floor: 0, usable: 0 };
  for (const floor of floors) {
    let emit = null;
    try {
      composeHarnessInstruction(floor, block);
    } catch (error) {
      emit = /ordered marker pair/u.test(error.message) ? "markers" : "floor";
    }
    assert.equal(floorFault(floor), emit, JSON.stringify(floor));
    seen[emit ?? "usable"]++;
  }
  for (const kind of Object.keys(seen)) assert.ok(seen[kind] > 0, kind);
});

test("seed preflight and runtime emit share dependency-free harness composition", async () => {
  const sharedFile = join(repository, "scripts/lib/harness-instruction.mjs");
  const shared = await import(pathToFileURL(sharedFile));
  const runtime = await import("./lib/harness.mjs");
  for (const name of ["harnessInstructionBlock", "composeHarnessInstruction"])
    assert.equal(
      runtime[name],
      shared[name],
      `${name} must retain its shared export`,
    );
  assert.deepEqual(importSpecifiers(readFileSync(sharedFile, "utf8")), []);
  for (const file of ["harness.mjs", "starter-seeds.mjs"]) {
    const contents = readFileSync(
      join(repository, "scripts/lib", file),
      "utf8",
    );
    assert.ok(
      importSpecifiers(contents).includes("./harness-instruction.mjs"),
      `${file} must use the dependency-free composition module`,
    );
  }
  // A copied seed preflight has no compiled package tree. Loading it must not
  // drag in the runtime emitter merely to validate an instruction floor.
  const prebuild = join(scratch, "shared-seed-prebuild");
  cpSync(join(repository, "scripts/lib"), join(prebuild, "scripts/lib"), {
    recursive: true,
  });
  installBeaconFixture(prebuild);
  const loaded = run(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      "const { floorFault } = await import('./scripts/lib/starter-seeds.mjs'); if (floorFault('# Personal floor\\n') !== null) process.exit(1);",
    ],
    { cwd: prebuild },
  );
  ok(loaded, "pre-build seed import");
});

test("follow-up exports refuse reserved local names regardless of case", () => {
  const instance = join(scratch, "reserved-export-names");
  commitExport(instance);
  rmSync(join(instance, "node_modules"), { recursive: true });
  linkInstall(instance);
  for (const name of [
    "Terms.txt",
    "AUTHORITY-GRANTS.JSON",
    "Integration.json",
  ]) {
    const destination = join(instance, "docs/control/local", name);
    const result = run(
      process.execPath,
      ["scripts/refute-plan.mjs", "followups", "--export", destination],
      { cwd: instance },
    );
    assert.notEqual(result.status, 0, name);
    assert.match(result.stderr, /is a name the local control lane reserves/);
    assert.equal(existsSync(destination), false);
  }
});

test("starter staged tree refuses clean-filter changes to verified bytes", async () => {
  const { assertStagedTree } = await import("./lib/starter-refresh.mjs");
  const root = join(scratch, "starter-stage-filter");
  mkdirSync(root);
  initRepository(root);
  writeFileSync(join(root, "KIT-MANIFEST.json"), "verified\n");
  // Keep this file outside Git's racy-timestamp window: changing attributes
  // alone must not restage it by chance through a metadata-cache refresh.
  const priorTime = new Date("2000-01-01T00:00:00Z");
  utimesSync(join(root, "KIT-MANIFEST.json"), priorTime, priorTime);
  writeFileSync(
    join(root, ".git/info/attributes"),
    "KIT-MANIFEST.json filter=fixture\n",
  );
  git(root, ["config", "filter.fixture.clean", "sed s/verified/changed/g"]);
  git(root, ["add", "KIT-MANIFEST.json"]);
  assert.throws(
    () => assertStagedTree(root, ["KIT-MANIFEST.json"]),
    /staged tree differs from verified bytes/,
  );
  rmSync(join(root, ".git/info/attributes"));
  git(root, ["add", "--renormalize", "--", "KIT-MANIFEST.json"]);
  assert.doesNotThrow(() => assertStagedTree(root, ["KIT-MANIFEST.json"]));
  git(root, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "prior verified bytes",
  ]);
  writeFileSync(join(root, "KIT-MANIFEST.json"), "new verified bytes\n");
  writeFileSync(
    join(root, ".git/info/attributes"),
    "KIT-MANIFEST.json filter=fixture\n",
  );
  git(root, [
    "config",
    "filter.fixture.clean",
    "git show HEAD:KIT-MANIFEST.json",
  ]);
  git(root, ["add", "KIT-MANIFEST.json"]);
  assert.equal(git(root, ["diff", "--cached", "--name-only"]).stdout, "");
  assert.throws(
    () => assertStagedTree(root, ["KIT-MANIFEST.json"]),
    /staged tree differs from verified bytes/,
  );
});

test("historical starter floors retain provenance through navigation migration", async () => {
  const { planStarterSeeds } = await import("./lib/starter-seeds.mjs");
  const base = join(scratch, "historical-seed-floor");
  const main = join(base, "core"),
    checkout = join(base, "starter");
  mkdirSync(main, { recursive: true });
  mkdirSync(checkout);
  initRepository(main);
  initRepository(checkout);
  const seeds = [
    ["README.md", "README.client.md"],
    [".gitignore", "gitignore.template"],
    ["CLAUDE.md", "CLAUDE.template.md"],
    ["AI-HARNESS-SECURITY.md", "AI-HARNESS-SECURITY.template.md"],
    ["docs/workstreams/README.md", "workstream.template.md"],
    ["docs/repositories/README.md", "repository-profile.template.md"],
    ["docs/work-orders/WO-001-environment-truth.md", "first-order.template.md"],
    ["docs/control/budgets.json", "budgets.template.json"],
  ];
  const legacy =
    "# Personal floor\n\nRead[executor]: `@skills/dotln-executor/SKILL.md` — next, fix, status, times.\n";
  const block =
    "\n<!-- dotln-harness:start -->\ngenerated\n<!-- dotln-harness:end -->\n";
  for (const [path, name] of seeds) {
    const bytes =
      name === "CLAUDE.template.md"
        ? legacy
        : readFileSync(join(repository, "scripts/kit", name), "utf8");
    for (const [root, file, contents] of [
      [main, `scripts/kit/${name}`, bytes],
      [checkout, `scripts/kit/${name}`, bytes],
      [
        checkout,
        path,
        namedStarterSeed(path, bytes, "DotLn") +
          (path === "CLAUDE.md" ? block : ""),
      ],
    ]) {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      writeFileSync(join(root, file), contents);
    }
  }
  git(main, ["add", "."]);
  git(main, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "historical seed",
  ]);
  const prior = git(main, ["rev-parse", "HEAD"]).stdout.trim();
  writeFileSync(
    join(checkout, "KIT-MANIFEST.json"),
    JSON.stringify({
      commit: prior,
      files: seeds.map(([, name]) => ({
        path: `scripts/kit/${name}`,
        sha256: sha256(readFileSync(join(main, "scripts/kit", name))),
      })),
    }),
  );
  git(checkout, ["add", "."]);
  git(checkout, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "historical export",
  ]);
  const incoming = "# Personal floor\n\nCurrent personal instructions.\n";
  writeFileSync(join(main, "scripts/kit/CLAUDE.template.md"), incoming);
  git(main, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qam",
    "migrate navigation and update floor",
  ]);
  const { rewrites: plans } = planStarterSeeds({
    main,
    head: "HEAD",
    checkout,
    remote: "HEAD",
  });
  assert.deepEqual(
    plans.map(({ path }) => path),
    ["CLAUDE.md"],
  );
  assert.equal(plans[0].bytes, incoming);
});

test("WO-258 criterion 6: the export's WO-001 holds step 10's corrections and UPSTREAM.md names exactly the seeds the export writes", async () => {
  const order = readFileSync(
    join(kit, "docs/work-orders/WO-001-environment-truth.md"),
    "utf8",
  );
  // Criterion 3 asks for the printed status and a fix where a match occurred.
  assert.match(
    order,
    /3\. The local-terms registration step records the printed status, and a\s+match, where one occurred, was fixed before filing\./u,
  );
  assert.doesNotMatch(order, /was\s+refused by the check and fixed/u);
  // Item 4: an empty list refuses nothing; the check names this order's files.
  assert.match(
    order,
    /an empty list is `present` with no terms and refuses nothing/u,
  );
  assert.doesNotMatch(order, /an empty list refuses\)/u);
  assert.match(
    order,
    /npm run terms -- check docs\/discovery\/environment\.md docs\/discovery\/environment\.json docs\/evidence\/WO-001\/README\.md/u,
  );
  // No timebox; the review ladder every order runs.
  assert.doesNotMatch(order, /Timebox/u);
  assert.match(order, /it runs the review ladder every order runs/u);
  const { exportSeedPaths } = await import("./launchpad.mjs");
  const upstream = readFileSync(join(kit, "UPSTREAM.md"), "utf8");
  const listed = upstream
    .split("## Instance seeds\n")[1]
    .split("\n## ")[0]
    .split("\n")
    .flatMap((line) => /^- `([^`]+)`$/u.exec(line)?.[1] ?? []);
  assert.deepEqual(listed, exportSeedPaths());
  for (const path of listed)
    assert.ok(
      lstatSync(join(kit, path), { throwIfNoEntry: false }),
      `${path} is written by the export`,
    );
});

test("WO-258 criterion 6: a refresh plans every absent export seed, removes a retired seed at its kit rendering and keeps a customized one with its reason", async () => {
  const { planSeedChanges, RETIRED_SEEDS, TEMPLATE_SEED_PATHS } =
    await import("./lib/starter-seeds.mjs");
  const { exportSeedPaths } = await import("./launchpad.mjs");
  const checkout = join(scratch, "wo258-seed-changes");
  mkdirSync(checkout);
  initRepository(checkout);
  // A starter exported before dotln.config.json and the lineage index were
  // seeds, still carrying the retired ceilings file at the kit's bytes.
  const present = exportSeedPaths().filter(
    (path) =>
      ![
        "dotln.config.json",
        "docs/lineage/README.md",
        "docs/intake/.gitkeep",
        "AGENTS.md",
      ].includes(path),
  );
  for (const path of present) {
    mkdirSync(dirname(join(checkout, path)), { recursive: true });
    writeFileSync(join(checkout, path), `starter ${path}\n`);
  }
  const ceilings = RETIRED_SEEDS[0];
  assert.equal(ceilings.path, "docs/control/doc-ceilings.json");
  writeFileSync(join(checkout, ceilings.path), ceilings.renderings[0]);
  // A missing template seed keeps its own rules: it is never "added".
  rmSync(join(checkout, "docs/work-orders/WO-001-environment-truth.md"));
  git(checkout, ["add", "."]);
  git(checkout, [
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "old starter",
  ]);
  const planned = planSeedChanges({
    checkout,
    remote: "HEAD",
    exportSeeds: exportSeedPaths(),
  });
  assert.deepEqual(planned.added, [
    "dotln.config.json",
    "docs/intake/.gitkeep",
    "docs/lineage/README.md",
    "AGENTS.md",
  ]);
  assert.ok(planned.added.every((path) => !TEMPLATE_SEED_PATHS.includes(path)));
  assert.deepEqual(planned.removed, [ceilings.path]);
  assert.deepEqual(planned.kept, []);
  // A customized retired seed is kept, with why.
  writeFileSync(
    join(checkout, ceilings.path),
    '{\n  "schemaVersion": 1,\n  "documents": { "docs/KIT.md": 65536 }\n}\n',
  );
  git(checkout, ["commit", "-qam", "customize the ceilings"]);
  const customized = planSeedChanges({
    checkout,
    remote: "HEAD",
    exportSeeds: exportSeedPaths(),
  });
  assert.deepEqual(customized.removed, []);
  assert.deepEqual(customized.kept, [
    {
      path: ceilings.path,
      reason:
        "a retired seed, customized; differs from every rendering the kit wrote",
    },
  ]);
  // A starter that already carries every seed and no retired one plans none.
  git(checkout, ["rm", "-q", ceilings.path]);
  for (const path of planned.added) {
    mkdirSync(dirname(join(checkout, path)), { recursive: true });
    writeFileSync(join(checkout, path), `starter ${path}\n`);
  }
  git(checkout, ["add", "."]);
  git(checkout, ["commit", "-qm", "carry every seed"]);
  assert.deepEqual(
    planSeedChanges({
      checkout,
      remote: "HEAD",
      exportSeeds: exportSeedPaths(),
    }),
    { added: [], removed: [], kept: [] },
  );
});
