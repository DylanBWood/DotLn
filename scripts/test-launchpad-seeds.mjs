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
    // The documentation map, which a refresh plans beside the template seeds.
    ["docs/README.md", "docs-map.template.md"],
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
    /3\. The local-terms registration step records the printed status; a\s+refuse-mode match, where one occurred, was fixed before filing, and each\s+context-mode match was read, with the count read recorded\./u,
  );
  assert.doesNotMatch(order, /was\s+refused by the check and fixed/u);
  // Item 4: an empty list refuses nothing; the check names the four files
  // this order writes, the host report among them (WO-276-D177).
  assert.match(
    order,
    /an empty list is `present` with no terms and refuses nothing/u,
  );
  assert.doesNotMatch(order, /an empty list refuses\)/u);
  assert.match(
    order,
    /npm run terms -- check docs\/discovery\/environment\.md docs\/discovery\/environment\.json docs\/discovery\/host-report\.json docs\/evidence\/WO-001\/README\.md/u,
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

/** The words a seed must not hold: an inspection of every harness and the
 * call that once tested each (WO-275 step 1), and any agent harness or model
 * provider other than Claude Code, by name or by its CLI's name. */
const hostScreen = [
  /each AI coding harness/iu,
  /smoke invocation/iu,
  /harmless probe/iu,
  /\b(?:codex|copilot|gemini|openai|gpt|cursor|aider|windsurf|cline|mistral|ollama)\b/iu,
];
// A seed is wrapped prose: a phrase is found across the line break a
// wrap puts inside it.
const seedHostFindings = (text) =>
  hostScreen
    .filter((pattern) => pattern.test(text.replace(/\s+/gu, " ")))
    .map(String);

test("WO-275 criterion 1: a fresh export's first order and security seed inspect only the hosts the instance elects and invoke no harness", () => {
  // The screen itself refuses a first order holding either phrase step 1
  // removes, so a later rewording cannot bring the inspection back unseen.
  assert.deepEqual(
    seedHostFindings("2. Each AI coding harness as installed: version"),
    [String(hostScreen[0])],
  );
  assert.deepEqual(
    seedHostFindings("One smoke invocation per harness surface is permitted"),
    [String(hostScreen[1])],
  );
  assert.equal(seedHostFindings("the Codex CLI").length, 1);
  // A wrap inside a phrase hides nothing (WO-276, the attack on Part G).
  assert.equal(
    seedHostFindings("2. Each AI coding\n   harness as installed: version")
      .length,
    1,
  );
  assert.equal(
    seedHostFindings("One smoke\ninvocation per harness surface is permitted")
      .length,
    1,
  );
  for (const path of [
    "docs/work-orders/WO-001-environment-truth.md",
    "AI-HARNESS-SECURITY.md",
  ]) {
    const seed = readFileSync(join(kit, path), "utf8");
    const flat = seed.replace(/\s+/gu, " ");
    assert.deepEqual(seedHostFindings(seed), [], path);
    // Claude Code is the host, and another is inspected only when the
    // instance's configuration elects it.
    assert.match(flat, /Claude Code/u, path);
    assert.match(
      flat,
      /any other host this instance's `dotln\.config\.json` elects under `features`/u,
      path,
    );
    assert.match(flat, /a fresh instance elects none/u, path);
  }
  const order = readFileSync(
    join(kit, "docs/work-orders/WO-001-environment-truth.md"),
    "utf8",
  ).replace(/\s+/gu, " ");
  assert.match(
    order,
    /Look for no other agent harness or model provider on this machine, ask no version of one, and invoke no harness: no session, print-mode call or model request runs\./u,
  );
  assert.match(order, /This record turns no host on/u);
  assert.match(
    order,
    /it is this instance's own choice, made outside this order, which invokes no harness\./u,
  );
  // The live smoke is named, never permitted here.
  assert.doesNotMatch(order, /record it the same way if run/u);
});

test("WO-275 criteria 3 and 4: a fresh export carries the operator commands page at the kit's version with every block its guide marks, prints it with launchpad commands before any install, and seeds FOR-CORE.md as its template", async () => {
  const { OPERATOR_STEPS, readMarkedBlocks } =
    await import("./lib/operator-commands.mjs");
  const page = readFileSync(join(kit, "docs/OPERATOR.md"), "utf8");
  // The commit's page, carried as a kit file.
  assert.equal(page, readFileSync(join(source, "docs/OPERATOR.md"), "utf8"));
  const listed = manifestOf(kit).files.map(({ path }) => path);
  assert.ok(listed.includes("docs/OPERATOR.md"));
  // It names the kit's version: a strict version, the README claim core
  // generated it from (the sync suite ties the two; this product case reads
  // no core document).
  assert.match(page, /the DotLn kit at `v\d+\.\d+\.\d+`/u);
  // Every block the export's own guide marks, byte for byte, in the cycle's
  // order.
  const { blocks, faults } = readMarkedBlocks(
    readFileSync(join(kit, "docs/KIT.md"), "utf8"),
  );
  assert.deepEqual(faults, []);
  const order = OPERATOR_STEPS.map(([id]) => id);
  let at = 0;
  for (const block of [...blocks].sort(
    (a, b) => order.indexOf(a.step) - order.indexOf(b.step) || a.line - b.line,
  )) {
    const bytes = `${block.fence}${block.info}\n${block.content.join("\n")}\n${block.fence}\n`;
    const found = page.indexOf(bytes, at);
    assert.ok(found >= at, `${block.step} block at guide line ${block.line}`);
    at = found + bytes.length;
  }
  assert.equal(blocks.length >= OPERATOR_STEPS.length, true);
  // Before any install: a copy with no node_modules at all prints the page.
  const bare = join(scratch, "wo275-commands-before-install");
  cpSync(kit, bare, {
    recursive: true,
    verbatimSymlinks: true,
    filter: (path) => basename(path) !== "node_modules",
  });
  assert.equal(existsSync(join(bare, "node_modules")), false);
  const printed = ok(
    run(process.execPath, ["scripts/launchpad.mjs", "commands"], {
      cwd: bare,
    }),
    "launchpad commands before any install",
  );
  assert.equal(printed.stdout, page);
  // The instance's file for core: the template's bytes, a seed and no kit
  // file.
  assert.equal(
    readFileSync(join(kit, "FOR-CORE.md"), "utf8"),
    readFileSync(join(source, "scripts/kit/for-core.template.md"), "utf8"),
  );
  assert.ok(!listed.includes("FOR-CORE.md"));
});

test("WO-276 criteria H1, H2, H7 and H9: before any install a fresh export's host report prints a row for each assumption and the same rows as JSON; the export holds the attributes seed as its template; with stand-in codex and copilot commands on the path the report runs neither until the instance elects that host; and with its library replaced by a file that fails to load, under a Node below the floor, it still prints the Node row with the floor and exits 1", () => {
  // Before any install: a copy with no node_modules at all.
  const bare = join(scratch, "wo276-doctor-before-install");
  cpSync(kit, bare, {
    recursive: true,
    verbatimSymlinks: true,
    filter: (path) => basename(path) !== "node_modules",
  });
  assert.equal(existsSync(join(bare, "node_modules")), false);
  // Stand-ins for three agent CLIs, first on the path, each recording how
  // it was called.
  const bin = join(scratch, "wo276-stand-ins");
  const calls = join(scratch, "wo276-stand-ins.log");
  mkdirSync(bin);
  for (const name of ["claude", "codex", "copilot"]) {
    writeFileSync(
      join(bin, name),
      `#!/bin/sh\necho "${name} $*" >> "${calls}"\necho "${name} 9.9.9"\n`,
    );
    chmodSync(join(bin, name), 0o755);
  }
  const report = (args = []) => {
    writeFileSync(calls, "");
    const result = run(process.execPath, ["scripts/doctor.mjs", ...args], {
      cwd: bare,
      env: { ...env, PATH: `${bin}:${env.PATH}` },
    });
    return {
      ...result,
      calls: readFileSync(calls, "utf8").split("\n").filter(Boolean).sort(),
    };
  };
  const table = report();
  const json = report(["--json"]);
  const rows = JSON.parse(json.stdout);
  assert.deepEqual(
    rows.map((row) => row.id),
    [
      "node",
      "git",
      "compiler",
      "lane-memory",
      "symlinks",
      "line-endings",
      "forge",
      "platform",
      "agent-claude",
    ],
  );
  for (const row of rows) {
    for (const field of [
      "assumption",
      "observed",
      "verdict",
      "dependsOn",
      "remedy",
    ])
      assert.ok(
        typeof row[field] === "string" && row[field],
        `${row.id}: ${field}`,
      );
    assert.ok(
      table.stdout.includes(
        `| ${row.assumption} | ${row.observed} | ${row.verdict} |`,
      ),
      row.id,
    );
  }
  // This host meets what the kit assumes; the fresh export has no origin
  // yet, which is unknown and changes no exit code; and the attributes
  // seed already keeps Git from converting a line ending.
  const verdict = (id) => rows.find((row) => row.id === id).verdict;
  for (const id of [
    "node",
    "git",
    "compiler",
    "lane-memory",
    "symlinks",
    "line-endings",
  ])
    assert.equal(verdict(id), "met", id);
  assert.equal(verdict("forge"), "unknown");
  assert.equal(table.status, 0, table.stderr);
  assert.equal(json.status, 0, json.stderr);
  // The export elects no host and attests none: the Claude CLI's row alone,
  // and neither stand-in was run.
  assert.deepEqual(json.calls, ["claude --version"]);
  const config = JSON.parse(
    readFileSync(join(bare, "dotln.config.json"), "utf8"),
  );
  writeFileSync(
    join(bare, "dotln.config.json"),
    `${JSON.stringify({ ...config, features: { ...config.features, "host-codex": true } }, null, 2)}\n`,
  );
  const elected = report(["--json"]);
  assert.deepEqual(
    JSON.parse(elected.stdout)
      .filter((row) => row.id.startsWith("agent-"))
      .map((row) => [row.id, row.observed]),
    [
      ["agent-claude", "found (9.9.9)"],
      ["agent-codex", "found (9.9.9)"],
    ],
  );
  assert.deepEqual(elected.calls, ["claude --version", "codex --version"]);
  // The attributes seed: the template's bytes, a seed and no kit file.
  assert.equal(
    readFileSync(join(kit, ".gitattributes"), "utf8"),
    readFileSync(join(source, "scripts/kit/gitattributes.template"), "utf8"),
  );
  assert.ok(
    !manifestOf(kit)
      .files.map(({ path }) => path)
      .includes(".gitattributes"),
  );
  // The instance gains the command's script name with the kit's package.
  assert.equal(
    JSON.parse(readFileSync(join(kit, "package.json"), "utf8")).scripts.doctor,
    "node scripts/doctor.mjs",
  );
  // Criterion H2's last clause, on the export's own files: with the
  // report's library replaced by a file that fails to load and a Node below
  // the floor, the entry still prints the Node row with the floor and exits
  // 1. The entry's exported function is called in the export, since the
  // running Node is the one fact its command line cannot stand in for.
  writeFileSync(
    join(bare, "scripts/lib/host-doctor.mjs"),
    "export const hostReport = ;\n",
  );
  const unloadable = run(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'const { doctor } = await import("./scripts/doctor.mjs"); process.exitCode = await doctor([], { nodeVersion: "v18.20.0" });',
    ],
    { cwd: bare, env },
  );
  assert.equal(unloadable.status, 1, unloadable.stderr);
  assert.ok(unloadable.stdout.includes("Node v18.20.0"), unloadable.stdout);
  assert.ok(
    unloadable.stdout.includes(
      JSON.parse(readFileSync(join(bare, "package.json"), "utf8")).engines.node,
    ),
    unloadable.stdout,
  );
  assert.match(
    unloadable.stdout,
    /this Node can load the kit's own modules: unknown/u,
  );
});

test("WO-281: the documentation map's template links the README of every root the export seeds, and one that links fewer is named by the root it leaves out", async () => {
  const { docsMapUnlinked } = await import("./lib/starter-seeds.mjs");
  const links = markdownLinks(
    readFileSync(join(repository, "scripts/kit/docs-map.template.md"), "utf8"),
  ).map(({ href }) => href);
  assert.deepEqual(docsMapUnlinked(links), []);
  // What the export refuses: a map that drops a seeded root's README.
  assert.deepEqual(
    docsMapUnlinked(
      links.filter(
        (href) =>
          !["lineage/README.md", "repositories/README.md"].includes(href),
      ),
    ),
    ["repositories/README.md", "lineage/README.md"],
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
        "docs/README.md",
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
  // The documentation map among them (WO-281): it has a template and is
  // still added where a starter lacks it, since it is no template seed.
  assert.deepEqual(planned.added, [
    "dotln.config.json",
    "docs/README.md",
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
