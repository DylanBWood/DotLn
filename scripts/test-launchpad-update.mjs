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

test("starter refresh publishes one verified commit and preserves every refusal boundary", async (t) => {
  const { releaseCloseSummary } = await import("./release.mjs");
  // Release close prints each refresh row through its summary line.
  const printed = (row) =>
    releaseCloseSummary({
      workOrderId: "WO-001",
      publication: { outcome: "no-release", tag: null },
      starterRefresh: [row],
      cleanup: { outcome: "clean", worktrees: [] },
      blockers: [],
      reportPath: "release-close.md",
    })
      .split("\n")
      .find((line) => line.startsWith("Starter refresh "));
  const root = join(scratch, "starter-refresh-fixture");
  mkdirSync(root);
  const core = join(root, "core");
  git(scratch, ["clone", "--quiet", source, core]);
  configureRepository(core);
  linkInstall(core);
  for (const name of RUNTIME_PACKAGES)
    cpSync(
      join(source, "packages", name, "dist"),
      join(core, "packages", name, "dist"),
      { recursive: true },
    );
  const seed = join(root, "seed"),
    remote = join(root, "starter.git"),
    checkout = join(root, "checkout");
  mkdirSync(seed);
  initRepository(seed);
  writeFileSync(join(seed, "README.md"), "initial readme\n");
  chmodSync(join(seed, "README.md"), 0o755);
  writeFileSync(join(seed, "keep.txt"), "initial retained file\n");
  const initialConfiguration =
    JSON.stringify(
      {
        version: 1,
        release: { displayName: "Initial Starter", corpus: false },
      },
      null,
      2,
    ) + "\n";
  writeFileSync(join(seed, "dotln.config.json"), initialConfiguration);
  git(seed, ["add", "."]);
  git(seed, ["commit", "-qm", "initial starter"]);
  const initial = git(seed, ["rev-parse", "HEAD"]).stdout.trim();
  git(root, ["clone", "--quiet", "--bare", seed, remote]);
  git(root, ["clone", "--quiet", remote, checkout]);
  configureRepository(checkout);
  const coreUrl = "https://github.com/refresh-fixture/core.git",
    starterUrl = "https://github.com/refresh-fixture/starter-fixture.git";
  git(core, ["remote", "set-url", "origin", coreUrl]);
  git(checkout, ["remote", "set-url", "origin", starterUrl]);
  const global = join(root, "gitconfig");
  writeFileSync(
    global,
    `[url "${remote.slice(0, -4)}"]\n insteadOf = ${starterUrl.slice(0, -4)}\n[url "${source}"]\n insteadOf = ${coreUrl}\n[user]\n name = DotLn Fixture\n email = fixture@example.invalid\n[commit]\n gpgSign = false\n`,
  );
  // The sibling's Release goes through gh; this double records what the
  // refresh creates and answers a later view with it (WO-221).
  const bin = join(root, "bin");
  mkdirSync(bin);
  const ghState = join(root, "gh-state.json");
  const ghAuthRefusal = join(root, "gh-auth-refusal");
  writeFileSync(
    join(bin, "gh"),
    `#!${process.execPath}
import { existsSync, readFileSync, writeFileSync } from "node:fs";
const args = process.argv.slice(2);
const state = ${JSON.stringify(ghState)};
const authRefusal = ${JSON.stringify(ghAuthRefusal)};
const read = () => (existsSync(state) ? JSON.parse(readFileSync(state, "utf8")) : {});
const flag = (name) => args[args.indexOf(name) + 1];
if (process.env.GH_REPO || process.env.GH_HOST) process.exit(65);
if (args[0] === "auth" && existsSync(authRefusal)) process.exit(1);
if (args[0] === "--version" || args[0] === "auth") process.exit(0);
if (args[0] === "release" && args[1] === "view") {
  const release = read()[args[2]];
  if (!release) { console.error("release not found"); process.exit(1); }
  console.log(JSON.stringify({ body: release.body, name: release.name, isDraft: false, isPrerelease: false, assets: [] }));
  process.exit(0);
}
if (args[0] === "release" && args[1] === "create") {
  const releases = read();
  releases[args[2]] = { name: flag("--title"), body: readFileSync(flag("--notes-file"), "utf8"), repo: flag("--repo") };
  writeFileSync(state, JSON.stringify(releases));
  console.log("https://" + flag("--repo") + "/releases/tag/" + args[2]);
  process.exit(0);
}
process.exit(64);
`,
  );
  chmodSync(join(bin, "gh"), 0o755);
  const releases = () =>
    existsSync(ghState) ? JSON.parse(readFileSync(ghState, "utf8")) : {};
  const refreshTemp = join(root, "refresh-temporary");
  mkdirSync(refreshTemp);
  const fixtureEnv = {
    ...env,
    TMPDIR: refreshTemp,
    TMP: refreshTemp,
    TEMP: refreshTemp,
    PATH: `${bin}:${env.PATH}`,
    GIT_CONFIG_GLOBAL: global,
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_TERMINAL_PROMPT: "0",
  };
  const sibling = "starter-fixture";
  const declaration = join(core, "docs/siblings/siblings.json");
  mkdirSync(dirname(declaration), { recursive: true });
  writeFileSync(
    declaration,
    JSON.stringify({
      schemaVersion: 1,
      siblings: [
        {
          id: sibling,
          purpose: "Fixture export",
          relation: { kind: "export", coreCommit: null },
          capabilityRows: [],
        },
      ],
    }),
  );
  git(core, ["add", "."]);
  git(core, ["commit", "-qm", "declare starter refresh"]);
  const map = join(core, "docs/control/local/repository-clones.json");
  mkdirSync(dirname(map), { recursive: true });
  const mapCheckout = (value = checkout) =>
    writeFileSync(map, JSON.stringify({ [sibling]: value }));
  mapCheckout();
  const runCore = (code) =>
    run(process.execPath, ["--input-type=module", "-e", code], {
      cwd: core,
      env: fixtureEnv,
    });
  const refresh = (tag, head, dryRun = false) => {
    const result = ok(
      runCore(
        `import {refreshStarters} from './scripts/lib/starter-refresh.mjs'; console.log('REFRESH '+JSON.stringify(await refreshStarters({main:process.cwd(),tag:${JSON.stringify(tag)},head:${JSON.stringify(head)},dryRun:${dryRun}})));`,
      ),
      "refresh driver",
    );
    const rows = JSON.parse(
      result.stdout
        .split("\n")
        .find((line) => line.startsWith("REFRESH "))
        .slice(8),
    );
    assert.ok(
      !JSON.stringify(rows).includes(root),
      "no machine-local path in row",
    );
    return rows;
  };
  const refs = () =>
    git(remote, ["for-each-ref", "--format=%(refname) %(objectname)"]).stdout;
  // A scenario that rewinds the starter's main also drops the release tags
  // the rewound main no longer reaches, as a rewound starter would; a tag
  // left on an unreachable commit refuses the next refresh by name (WO-221).
  const rewindRemoteMain = () => {
    git(checkout, ["push", "--force", remote, "main"]);
    for (const name of git(remote, ["tag", "-l"])
      .stdout.split("\n")
      .filter(Boolean))
      if (
        run(
          "git",
          ["merge-base", "--is-ancestor", `${name}^{commit}`, "main"],
          {
            cwd: remote,
          },
        ).status !== 0
      )
        git(remote, ["tag", "-d", name]);
  };
  const remoteHead = () =>
    git(remote, ["rev-parse", "refs/heads/main"]).stdout.trim();
  const state = () =>
    git(core, ["status", "--porcelain", "--untracked-files=all"]).stdout;
  const worktrees = () =>
    git(checkout, ["worktree", "list", "--porcelain"]).stdout;
  const pending = () => {
    const dir = join(core, "docs/control/local/sibling-receipts", sibling);
    return existsSync(dir)
      ? readdirSync(dir)
          .sort()
          .map((name) => JSON.parse(readFileSync(join(dir, name), "utf8")))
      : [];
  };
  const measured = (name, fn) => {
    const start = performance.now();
    try {
      return fn();
    } finally {
      t.diagnostic(
        `starter case ${name}: ${Math.round(performance.now() - start)} ms`,
      );
    }
  };
  let tag = "v10.0.0",
    head = git(core, ["rev-parse", "HEAD"]).stdout.trim();
  git(core, ["tag", tag]);
  const beforeCore = state();
  const wrongRemote = join(root, "wrong-repository.git");
  git(checkout, ["config", `url.${wrongRemote}.insteadOf`, starterUrl]);
  // Compare the checkout-configured transport with the host-owned lane. The
  // longer local rewrite wins even with a fixture-global GitHub mapping.
  const direct = run(
    "git",
    [
      "-c",
      "core.hooksPath=/dev/null",
      "ls-remote",
      starterUrl,
      "refs/heads/main",
    ],
    { cwd: checkout, env: fixtureEnv },
  );
  assert.notEqual(direct.status, 0);
  const wrongPath = join(root, "redirected-temporary-path");
  git(checkout, [
    "config",
    `url.${wrongPath}.insteadOf`,
    realpathSync(refreshTemp),
  ]);
  const beforeAuthenticationRefusal = refs();
  writeFileSync(ghAuthRefusal, "fixture authentication unavailable\n");
  try {
    const refused = measured(
      "j authentication refusal",
      () => refresh(tag, head)[0],
    );
    assert.equal(
      refs(),
      beforeAuthenticationRefusal,
      "authentication failure must precede every remote write",
    );
    assert.equal(refused.outcome, "refused", JSON.stringify(refused));
    assert.match(refused.reason, /gh authentication is required/u);
    assert.equal(git(checkout, ["rev-parse", "HEAD"]).stdout.trim(), initial);
    assert.deepEqual(releases(), {});
    assert.deepEqual(pending(), []);
  } finally {
    rmSync(ghAuthRefusal);
  }
  git(remote, ["tag", tag, initial]);
  const beforeTagRefusal = refs();
  try {
    const refused = measured(
      "j conflicting tag refusal",
      () => refresh(tag, head)[0],
    );
    assert.equal(
      refs(),
      beforeTagRefusal,
      "a conflicting release tag must refuse before the refresh push",
    );
    assert.equal(refused.outcome, "refused", JSON.stringify(refused));
    assert.match(refused.reason, /starter tag .*not the refresh commit/u);
    assert.equal(git(checkout, ["rev-parse", "HEAD"]).stdout.trim(), initial);
    assert.deepEqual(releases(), {});
    assert.deepEqual(pending(), []);
  } finally {
    git(remote, ["tag", "-d", tag]);
  }
  const first = measured("j first export", () => refresh(tag, head)[0]);
  assert.equal(first.outcome, "refreshed", JSON.stringify(first));
  assert.equal(first.firstExport, true);
  t.diagnostic(
    `fetch comparison: checkout-configured arm refused (${direct.status}); host-owned lane reached only the bound starter`,
  );
  git(checkout, ["config", "--unset", `url.${wrongRemote}.insteadOf`]);
  git(checkout, ["config", "--unset", `url.${wrongPath}.insteadOf`]);
  assert.deepEqual(first.kept, ["dotln.config.json", "keep.txt"]);
  assert.deepEqual(first.replaced, ["README.md"]);
  assert.equal(
    readFileSync(join(checkout, "dotln.config.json"), "utf8"),
    initialConfiguration,
  );
  assert.match(
    readFileSync(join(checkout, "README.md"), "utf8"),
    /This source prepares Initial Starter/u,
  );
  assert.match(
    git(checkout, ["ls-files", "--stage", "README.md"]).stdout,
    /^100644 /,
  );
  assert.equal(git(remote, ["rev-parse", "main^"]).stdout.trim(), initial);
  assert.equal(git(remote, ["rev-list", "--count", "main"]).stdout.trim(), "2");
  // Core's tag name lands on the refresh commit and the sibling's Release
  // points at it, so a fork can name the release it takes (WO-221).
  assert.deepEqual(first.siblingTag, { tag, outcome: "published" });
  assert.equal(first.siblingRelease, "created");
  assert.equal(
    git(remote, ["rev-parse", `${tag}^{commit}`]).stdout.trim(),
    remoteHead(),
  );
  assert.equal(git(remote, ["cat-file", "-t", tag]).stdout.trim(), "tag");
  assert.equal(releases()[tag].name, `Initial Starter ${tag}`);
  assert.equal(
    releases()[tag].repo,
    "github.com/refresh-fixture/starter-fixture",
  );
  assert.match(
    releases()[tag].body,
    /core's Release v10\.0\.0 \(github\.com\/refresh-fixture\/core\); core commit [0-9a-f]{40}/u,
  );
  assert.equal(refs().split("\n").filter(Boolean).length, 2);
  assert.equal(git(checkout, ["status", "--porcelain"]).stdout, "");
  assert.equal(
    git(checkout, ["rev-parse", "HEAD"]).stdout.trim(),
    remoteHead(),
  );
  assert.equal(
    readFileSync(join(checkout, "keep.txt"), "utf8"),
    "initial retained file\n",
  );
  assert.notEqual(
    readFileSync(join(checkout, "README.md"), "utf8"),
    "initial readme\n",
  );
  assert.ok(lstatSync(join(checkout, "AGENTS.md")).isSymbolicLink());
  assert.equal(manifestOf(checkout).commit, head);
  assert.equal(manifestOf(checkout).tag, tag);
  assert.equal(
    pending().at(-1).manifestHash,
    `sha256:${sha256(readFileSync(join(checkout, "KIT-MANIFEST.json")))}`,
  );
  assert.equal(state(), beforeCore);
  const cleanWorktrees = worktrees();
  assert.equal(cleanWorktrees.match(/^worktree /gm).length, 1);
  const verifyFresh = (name) => {
    const clone = join(root, name);
    git(root, ["clone", "--quiet", remote, clone]);
    ok(
      run(process.execPath, ["scripts/launchpad.mjs", "verify"], {
        cwd: clone,
        env: fixtureEnv,
      }),
      "fresh clone kit verify",
    );
    // Workspace links are the no-install links the export's self-check uses.
    mkdirSync(join(clone, "node_modules/@dotln"), { recursive: true });
    for (const name of ["kernel", "compiler", "skeleton", "beacons"])
      symlinkSync(
        `../../packages/${name}`,
        join(clone, "node_modules/@dotln", name),
      );
    ok(
      run(process.execPath, ["scripts/harness.mjs", "emit"], {
        cwd: clone,
        env: fixtureEnv,
      }),
      "fresh clone harness emit",
    );
    ok(
      run(process.execPath, ["scripts/harness.mjs", "check"], {
        cwd: clone,
        env: fixtureEnv,
      }),
      "fresh clone harness check",
    );
  };
  verifyFresh("first-fresh");
  // A fork names the release it takes: the preview resolves the starter's tag.
  {
    const fork = join(root, "preview-from-tag");
    git(root, ["clone", "--quiet", remote, fork]);
    const preview = ok(
      run(
        process.execPath,
        ["scripts/launchpad.mjs", "preview", "--from", tag],
        {
          cwd: fork,
          env: fixtureEnv,
        },
      ),
      "preview from the starter tag",
    );
    assert.match(
      preview.stdout,
      new RegExp(
        `^incoming: ${head} \\(${tag.replaceAll(".", "\\.")}\\)$`,
        "mu",
      ),
    );
  }
  t.diagnostic(`starter first-export phases: ${JSON.stringify(first.timings)}`);
  // Initial-commit refusals share a second local remote and perform no kit preparation.
  const other = join(root, "initial-checkout"),
    otherRemote = join(root, "initial.git");
  git(root, ["clone", "--quiet", "--bare", seed, otherRemote]);
  git(root, ["clone", "--quiet", otherRemote, other]);
  configureRepository(other);
  git(other, ["remote", "set-url", "origin", starterUrl]);
  const setRemote = (file) =>
    writeFileSync(
      global,
      readFileSync(global, "utf8").replace(
        /^\[url "[^\n]+"\]\n insteadOf = [^\n]+/u,
        `[url "${file.slice(0, -4)}"]\n insteadOf = ${starterUrl.slice(0, -4)}`,
      ),
    );
  setRemote(otherRemote);
  mapCheckout(other);
  const initialRef = git(otherRemote, ["rev-parse", "main"]).stdout;
  writeFileSync(join(other, "dirty"), "dirty");
  assert.match(
    measured("k initial dirty", () => refresh(tag, head)[0]).reason,
    /changes/,
  );
  rmSync(join(other, "dirty"));
  git(other, ["commit", "--allow-empty", "-qm", "ahead"]);
  assert.match(
    measured("k initial ahead", () => refresh(tag, head)[0]).reason,
    /ahead.*diverged/,
  );
  git(other, ["reset", "--hard", initial]);
  git(other, [
    "remote",
    "set-url",
    "origin",
    "https://github.com/another-owner/starter-fixture.git",
  ]);
  assert.match(
    measured("k initial misbound", () => refresh(tag, head)[0]).reason,
    /push URL/,
  );
  git(other, ["remote", "set-url", "origin", starterUrl]);
  git(other, ["rm", "dotln.config.json"]);
  git(other, ["commit", "-qm", "fixture without declared configuration"]);
  git(other, ["push", otherRemote, "main"]);
  const withoutConfiguration = git(otherRemote, ["rev-parse", "main"]).stdout;
  writeFileSync(join(other, ".git/info/exclude"), "dotln.config.json\n");
  writeFileSync(join(other, "dotln.config.json"), initialConfiguration);
  for (const preview of [true, false]) {
    const ignored = refresh(tag, head, preview)[0];
    assert.equal(ignored.outcome, "refused");
    assert.match(
      ignored.reason,
      /local dotln\.config\.json is untracked or ignored/,
    );
    assert.equal(
      git(otherRemote, ["rev-parse", "main"]).stdout,
      withoutConfiguration,
    );
    assert.equal(
      readFileSync(join(other, "dotln.config.json"), "utf8"),
      initialConfiguration,
    );
  }
  git(other, ["add", "-f", "dotln.config.json"]);
  git(other, ["commit", "-qm", "restore declared configuration"]);
  git(other, ["push", otherRemote, "main"]);
  mkdirSync(join(other, "KIT-MANIFEST.json"));
  writeFileSync(join(other, "KIT-MANIFEST.json", "child"), "collision");
  git(other, ["add", "."]);
  git(other, ["commit", "-qm", "initial type collision"]);
  git(other, ["push", otherRemote, "main"]);
  const collided = git(otherRemote, ["rev-parse", "main"]).stdout;
  assert.match(
    measured("j initial collision", () => refresh(tag, head)[0]).reason,
    /type collision/,
  );
  assert.equal(git(otherRemote, ["rev-parse", "main"]).stdout, collided);
  assert.notEqual(initialRef, collided);
  setRemote(remote);
  mapCheckout();
  // Template changes must reach the unmodified starter copies.
  writeFileSync(
    join(core, "scripts/kit/README.client.md"),
    readFileSync(join(core, "scripts/kit/README.client.md"), "utf8") +
      "\nFixture kit revision.\n",
  );
  writeFileSync(
    join(core, "scripts/kit/first-order.template.md"),
    readFileSync(join(core, "scripts/kit/first-order.template.md"), "utf8") +
      "\nFixture first-order revision.\n",
  );
  writeFileSync(
    join(core, "scripts/kit/CLAUDE.template.md"),
    readFileSync(join(core, "scripts/kit/CLAUDE.template.md"), "utf8") +
      "\nFixture contract revision.\n",
  );
  git(core, ["add", "."]);
  chmodSync(join(core, "scripts/lib/github-body.mjs"), 0o755);
  git(core, ["add", "scripts/lib/github-body.mjs"]);
  git(core, ["add", "scripts/kit/README.client.md"]);
  git(core, ["commit", "-qm", "advance kit"]);
  tag = "v10.1.0";
  head = git(core, ["rev-parse", "HEAD"]).stdout.trim();
  git(core, ["tag", tag]);
  const prior = remoteHead(),
    seedReadme = readFileSync(join(checkout, "README.md"), "utf8"),
    floor = readFileSync(join(checkout, "CLAUDE.md"), "utf8");
  const beforeUpdate = state();
  // A merged release can be ahead of local main when close previews its
  // fast-forward. Checkout refusals must still be visible before publication.
  git(core, ["reset", "--hard", first.coreCommit]);
  const previewBefore = {
    refs: refs(),
    head: git(checkout, ["rev-parse", "HEAD"]).stdout,
    trees: worktrees(),
    receipts: JSON.stringify(pending()),
  };
  const behindPreview = measured(
    "preview with core behind",
    () => refresh(tag, head, true)[0],
  );
  assert.equal(behindPreview.outcome, "preview");
  assert.deepEqual(behindPreview.siblingTag, { tag, outcome: "preview" });
  assert.equal(behindPreview.siblingRelease, "preview");
  assert.equal(behindPreview.siblingReleaseTitle, `Initial Starter ${tag}`);
  assert.match(behindPreview.reason, /would refresh/);
  assert.equal(behindPreview.coreCommit, head);
  assert.equal(
    refresh(tag, head)[0].outcome,
    "skipped",
    "real close retains its main-head guard",
  );
  rmSync(map);
  assert.match(refresh(tag, head, true)[0].reason, /no recorded checkout/);
  mapCheckout();
  writeFileSync(join(checkout, "untracked"), "preview dirt");
  assert.match(refresh(tag, head, true)[0].reason, /changes/);
  rmSync(join(checkout, "untracked"));
  git(checkout, [
    "remote",
    "set-url",
    "origin",
    "https://github.com/wrong-owner/starter-fixture.git",
  ]);
  assert.match(refresh(tag, head, true)[0].reason, /push URL/);
  git(checkout, ["remote", "set-url", "origin", starterUrl]);
  assert.equal(refs(), previewBefore.refs);
  assert.equal(git(checkout, ["rev-parse", "HEAD"]).stdout, previewBefore.head);
  assert.equal(worktrees(), previewBefore.trees);
  assert.equal(JSON.stringify(pending()), previewBefore.receipts);
  assert.equal(
    git(core, ["rev-parse", "HEAD"]).stdout.trim(),
    first.coreCommit,
  );
  git(core, ["reset", "--hard", head]);
  // Every committed customization refuses before a push, including a file
  // mode, absent path, symlink and an ancestor redirected outside the tree.
  for (const kind of [
    "bytes",
    "mode",
    "missing",
    "symlink",
    "ancestor",
    "contract-tail",
    "contract-markers",
  ]) {
    if (kind === "contract-tail")
      writeFileSync(
        join(checkout, "CLAUDE.md"),
        floor + "\nKeep these operator instructions.\n",
      );
    if (kind === "contract-markers")
      writeFileSync(
        join(checkout, "CLAUDE.md"),
        floor + "\n<!-- dotln-harness:start -->\n",
      );
    if (kind === "bytes")
      writeFileSync(join(checkout, "README.md"), "Customized starter.\n");
    if (kind === "mode") chmodSync(join(checkout, "README.md"), 0o755);
    if (["missing", "symlink"].includes(kind))
      rmSync(join(checkout, "README.md"));
    if (kind === "symlink")
      symlinkSync("scripts/kit/README.client.md", join(checkout, "README.md"));
    if (kind === "ancestor") {
      rmSync(join(checkout, "docs/work-orders"), { recursive: true });
      symlinkSync(
        join(root, "outside-orders"),
        join(checkout, "docs/work-orders"),
      );
    }
    git(checkout, ["add", "-A"]);
    git(checkout, ["commit", "-qm", `test: seed ${kind}`]);
    git(checkout, ["push", remote, "main"]);
    const protectedRefs = refs(),
      protectedHead = remoteHead();
    for (const preview of [true, false]) {
      const refusal = refresh(tag, head, preview)[0];
      assert.equal(refusal.outcome, "refused", JSON.stringify(refusal));
      assert.match(
        refusal.reason,
        kind === "ancestor"
          ? /docs\/work-orders\/WO-001/
          : kind.startsWith("contract-")
            ? /CLAUDE\.md/
            : /README\.md/,
      );
      assert.equal(refs(), protectedRefs);
      assert.equal(
        git(checkout, ["rev-parse", "HEAD"]).stdout.trim(),
        protectedHead,
      );
      assert.deepEqual(refusal.rewrittenSeeds, []);
    }
    git(checkout, ["reset", "--hard", prior]);
    rewindRemoteMain();
  }
  // Fail cleanup before removal, then after Git unregisters the worktree.
  // Both retries reuse this update's one kit preparation and published commit.
  const wrapperDirectory = join(root, "git-wrapper");
  mkdirSync(wrapperDirectory);
  const realGit = ok(run("which", ["git"]), "locate fixture git").stdout.trim();
  const fault = join(root, "cleanup-fault");
  const wrapper = join(wrapperDirectory, "git");
  writeFileSync(
    wrapper,
    `#!${process.execPath}\nconst {spawnSync}=require('node:child_process');
const {readFileSync,existsSync}=require('node:fs');
const {basename,dirname}=require('node:path');
const args=process.argv.slice(2);
const removing=args.includes('worktree')&&args.includes('remove')&&basename(dirname(args.at(-1))).startsWith('dotln-starter-refresh-');
const fault=${JSON.stringify(fault)}, real=${JSON.stringify(realGit)};
if(removing&&existsSync(fault)){if(readFileSync(fault,'utf8')==='after') {const result=spawnSync(real,args,{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1);}process.stderr.write('injected disposable cleanup failure\\n');process.exit(77);}
const result=spawnSync(real,args,{stdio:'inherit'});process.exit(result.status??1);
`,
  );
  chmodSync(wrapper, 0o755);
  const priorPath = fixtureEnv.PATH;
  fixtureEnv.PATH = `${wrapperDirectory}:${priorPath}`;
  writeFileSync(fault, "before");
  const update = measured(
    "a update with cleanup fault",
    () => refresh(tag, head)[0],
  );
  assert.equal(update.outcome, "refused", JSON.stringify(update));
  assert.match(update.reason, /disposable refresh cleanup failed/);
  assert.doesNotMatch(update.reason, /\bundefined\b/u);
  assert.match(update.reason, /push landed/u);
  assert.notEqual(update.before, update.after);
  assert.match(
    git(remote, ["ls-tree", "main", "scripts/lib/github-body.mjs"]).stdout,
    /^100755 /u,
  );
  const cleanupRecord = join(
    core,
    "docs/control/local/starter-refresh",
    `${sibling}.json`,
  );
  assert.ok(existsSync(cleanupRecord));
  const owned = JSON.parse(readFileSync(cleanupRecord, "utf8"));
  assert.equal(
    dirname(owned.scratch),
    realpathSync(refreshTemp),
    "refresh scratch remains inside the fixture's declared temporary parent",
  );
  assert.ok(existsSync(owned.worktree));
  assert.equal(worktrees().match(/^worktree /gm).length, 2);
  const publishedRefs = refs();
  // Retained recovery can fail before the caller knows its checkout. Neither
  // those failures nor malformed ignored inputs may disclose their contents.
  const savedCleanup = readFileSync(cleanupRecord, "utf8"),
    savedMap = readFileSync(map, "utf8"),
    privateCheckout = "/dotln-fixture-private/check out",
    privateMapValue = "/dotln-fixture-other-checkout";
  const privacyCases = [
    {
      record: JSON.stringify({ ...owned, checkout: privateCheckout }),
      map: JSON.stringify({ [sibling]: privateCheckout }),
      reason: /unreadable/,
    },
    {
      record: privateCheckout,
      map: savedMap,
      reason: /cleanup record is invalid JSON/,
    },
    ...[null, false, 0, privateCheckout, []].map((value) => ({
      record: JSON.stringify(value),
      map: savedMap,
      reason: /cleanup record is not an object/,
    })),
    ...[null, false, 8675309, [], {}].map((value) => ({
      record: JSON.stringify({ ...owned, checkout: value }),
      map: JSON.stringify({ [sibling]: value }),
      reason: /cleanup ownership does not match/,
    })),
    {
      record: savedCleanup,
      map: privateMapValue,
      reason: /invalid local registry/,
    },
  ];
  const privacyTrees = worktrees();
  for (const input of privacyCases) {
    for (const dryRun of [true, false]) {
      writeFileSync(cleanupRecord, input.record);
      writeFileSync(map, input.map);
      const savedTemporaryBase = fixtureEnv.TMPDIR;
      let refused;
      try {
        if (input.temporaryBase) fixtureEnv.TMPDIR = input.temporaryBase;
        refused = refresh(tag, head, dryRun)[0];
      } finally {
        if (savedTemporaryBase === undefined) delete fixtureEnv.TMPDIR;
        else fixtureEnv.TMPDIR = savedTemporaryBase;
      }
      assert.equal(refused.outcome, "refused");
      assert.match(refused.reason, input.reason);
      assert.ok(
        !JSON.stringify(refused).includes("/dotln-fixture-"),
        "no private path or source excerpt in refusal",
      );
      assert.equal(readFileSync(cleanupRecord, "utf8"), input.record);
      assert.equal(readFileSync(map, "utf8"), input.map);
      assert.equal(refs(), publishedRefs);
      assert.equal(worktrees(), privacyTrees);
      assert.ok(existsSync(owned.worktree));
    }
  }
  writeFileSync(cleanupRecord, savedCleanup);
  writeFileSync(map, savedMap);
  // Remapping a clone cannot adopt another checkout's cleanup objects. Both
  // preview and retry explain how to restore the original cleanup binding.
  const replacement = join(root, "replacement-checkout");
  git(root, ["clone", "--quiet", remote, replacement]);
  configureRepository(replacement);
  git(replacement, ["remote", "set-url", "origin", starterUrl]);
  const replacementHead = git(replacement, ["rev-parse", "HEAD"]).stdout,
    retainedRecord = readFileSync(cleanupRecord, "utf8"),
    retainedTrees = worktrees();
  mapCheckout(replacement);
  for (const dryRun of [true, false]) {
    const remapped = refresh(tag, head, dryRun)[0];
    assert.equal(remapped.outcome, "refused");
    assert.match(
      remapped.reason,
      /inspect the ignored .*starter-refresh.*restore its checkout with worktree clone starter-fixture <absolute-path>.*retry close.*replacement checkout/,
    );
    assert.equal(readFileSync(cleanupRecord, "utf8"), retainedRecord);
    assert.equal(worktrees(), retainedTrees);
    assert.equal(refs(), publishedRefs);
    assert.equal(
      git(replacement, ["rev-parse", "HEAD"]).stdout,
      replacementHead,
    );
    assert.equal(git(replacement, ["status", "--porcelain"]).stdout, "");
  }
  mapCheckout();
  // Reconstruct the durable state if the commit succeeded but its subsequent
  // journal rewrite failed. No branch was created yet in that failure window.
  git(checkout, [
    "update-ref",
    "-d",
    `refs/heads/${owned.branch}`,
    owned.commit,
  ]);
  writeFileSync(
    cleanupRecord,
    JSON.stringify({ ...owned, branch: null, commit: null }),
  );
  writeFileSync(fault, "after");
  const partial = refresh(tag, head)[0];
  assert.equal(partial.outcome, "refused");
  assert.match(partial.reason, /injected disposable cleanup failure/);
  assert.equal(worktrees().match(/^worktree /gm).length, 1);
  assert.ok(existsSync(cleanupRecord));
  const partialRecord = readFileSync(cleanupRecord, "utf8");
  writeFileSync(
    cleanupRecord,
    JSON.stringify({ ...JSON.parse(partialRecord), inode: owned.inode + 1 }),
  );
  const unsafePreview = refresh(tag, head, true)[0];
  assert.equal(unsafePreview.outcome, "refused");
  assert.match(unsafePreview.reason, /scratch identity changed/);
  assert.ok(existsSync(owned.scratch));
  writeFileSync(cleanupRecord, partialRecord);
  const previewCleanup = refresh(tag, head, true)[0];
  assert.equal(previewCleanup.outcome, "preview");
  assert.match(previewCleanup.reason, /would finish pending.*cleanup/);
  assert.ok(existsSync(cleanupRecord));
  assert.equal(readFileSync(cleanupRecord, "utf8"), partialRecord);
  fixtureEnv.PATH = priorPath;
  const retryTemp = join(root, "different-temporary-base");
  mkdirSync(retryTemp);
  fixtureEnv.TMPDIR = retryTemp;
  const recovered = measured("cleanup recovery", () => refresh(tag, head)[0]);
  fixtureEnv.TMPDIR = refreshTemp;
  assert.equal(recovered.outcome, "current", JSON.stringify(recovered));
  assert.deepEqual(recovered.timings, {});
  assert.equal(refs(), publishedRefs);
  assert.equal(existsSync(cleanupRecord), false);
  assert.equal(existsSync(owned.scratch), false);
  assert.equal(
    git(checkout, ["branch", "--list", "dotln-starter-refresh-*"]).stdout,
    "",
  );
  assert.equal(update.firstExport, false);
  assert.equal(git(remote, ["rev-parse", "main^"]).stdout.trim(), prior);
  // main and the two starter tags the refreshes pushed.
  assert.equal(refs().split("\n").filter(Boolean).length, 3);
  assert.equal(
    git(remote, ["rev-parse", `${tag}^{commit}`]).stdout.trim(),
    remoteHead(),
  );
  assert.equal(releases()[tag].name, `Initial Starter ${tag}`);
  assert.equal(manifestOf(checkout).commit, head);
  assert.equal(manifestOf(checkout).tag, tag);
  assert.equal(
    readFileSync(join(checkout, "README.md"), "utf8"),
    namedStarterSeed(
      "README.md",
      readFileSync(join(core, "scripts/kit/README.client.md"), "utf8"),
      "Initial Starter",
    ),
  );
  assert.equal(
    readFileSync(join(checkout, "dotln.config.json"), "utf8"),
    initialConfiguration,
  );
  assert.deepEqual(update.rewrittenSeeds, [
    "CLAUDE.md",
    "docs/work-orders/WO-001-environment-truth.md",
    "README.md",
  ]);
  assert.match(
    readFileSync(join(checkout, "CLAUDE.md"), "utf8"),
    /Fixture contract revision\./u,
  );
  assert.equal(git(checkout, ["status", "--porcelain"]).stdout, "");
  assert.equal(worktrees(), cleanWorktrees.replace(first.after, update.after));
  assert.equal(state(), beforeUpdate);
  assert.equal(pending().length, 2);
  assert.deepEqual(Object.keys(pending().at(-1)), [
    "sibling",
    "coreCommit",
    "manifestHash",
    "buildHash",
    "date",
  ]);
  verifyFresh("update-fresh");
  t.diagnostic(`starter update phases: ${JSON.stringify(update.timings)}`);
  const stableRefs = refs();
  const current = measured("b current", () => refresh(tag, head)[0]);
  assert.equal(current.outcome, "current", JSON.stringify(current));
  // The retry finds the tag and the Release and reports both current.
  assert.deepEqual(current.siblingTag, { tag, outcome: "current" });
  assert.equal(current.siblingRelease, "current");
  assert.equal(pending().length, 2);
  assert.equal(refs(), stableRefs);
  const unreadableCache = join(checkout, ".runtime/finder-unreadable");
  mkdirSync(unreadableCache, { recursive: true });
  writeFileSync(
    join(unreadableCache, "retained.txt"),
    "retained ignored data\n",
  );
  chmodSync(unreadableCache, 0);
  try {
    for (const dryRun of [true, false]) {
      const scanned = refresh(tag, head, dryRun)[0];
      assert.equal(scanned.outcome, "current", JSON.stringify(scanned));
      assert.ok(scanned.finderMetadata.every((scan) => scan.durationMs >= 0));
      if (process.getuid?.() !== 0)
        assert.ok(
          scanned.finderMetadata.some((scan) =>
            scan.skippedIgnoredDirectories.includes(
              ".runtime/finder-unreadable",
            ),
          ),
        );
    }
  } finally {
    chmodSync(unreadableCache, 0o755);
    rmSync(unreadableCache, { recursive: true });
  }
  const pendingDirectory = join(
    core,
    "docs/control/local/sibling-receipts",
    sibling,
  );
  rmSync(join(pendingDirectory, readdirSync(pendingDirectory).sort().at(-1)));
  assert.equal(refresh(tag, head)[0].outcome, "current");
  assert.equal(pending().length, 2);
  // A tag with the release's name on a commit the starter's main does not
  // reach refuses the next refresh by name; the tag restored, it is current.
  const taggedObject = git(remote, [
    "rev-parse",
    `refs/tags/${tag}`,
  ]).stdout.trim();
  const ghBytes = readFileSync(join(bin, "gh"));
  git(remote, ["update-ref", "-d", `refs/tags/${tag}`]);
  writeFileSync(join(bin, "gh"), `#!${process.execPath}\nprocess.exit(1);\n`);
  const beforeAuthFailure = refs();
  const noAuthentication = refresh(tag, head)[0];
  assert.equal(
    noAuthentication.outcome,
    "refused",
    JSON.stringify(noAuthentication),
  );
  assert.equal(
    refs(),
    beforeAuthFailure,
    "gh preflight precedes a missing tag push",
  );
  writeFileSync(join(bin, "gh"), ghBytes);
  git(remote, ["update-ref", `refs/tags/${tag}`, taggedObject]);
  // Neither an initial ancestor without a manifest nor a prior release's
  // refresh proves this tag belongs to the current core release.
  for (const candidate of [initial, first.after]) {
    git(remote, ["merge-base", "--is-ancestor", candidate, "main"]);
    const releasesBefore = releases();
    git(remote, ["update-ref", `refs/tags/${tag}`, candidate]);
    const before = refs();
    const refusedAncestor = refresh(tag, head)[0];
    assert.equal(
      refusedAncestor.outcome,
      "refused",
      JSON.stringify(refusedAncestor),
    );
    assert.match(
      refusedAncestor.reason,
      /not the refresh commit.*proven prior refresh of the same core release/u,
    );
    assert.equal(refs(), before);
    assert.deepEqual(releases(), releasesBefore);
  }
  git(remote, ["update-ref", `refs/tags/${tag}`, taggedObject]);
  git(checkout, ["switch", "-q", "--detach"]);
  git(checkout, ["commit", "-q", "--allow-empty", "-m", "stray side commit"]);
  const strayCommit = git(checkout, ["rev-parse", "HEAD"]).stdout.trim();
  git(checkout, ["push", "-q", remote, `${strayCommit}:refs/heads/stray`]);
  git(checkout, ["switch", "-q", "main"]);
  git(remote, ["update-ref", `refs/tags/${tag}`, strayCommit]);
  const strayTag = refresh(tag, head)[0];
  assert.equal(strayTag.outcome, "refused", JSON.stringify(strayTag));
  assert.match(
    strayTag.reason,
    new RegExp(
      `starter tag ${tag.replaceAll(".", "\\.")} exists at ${strayCommit}, not the refresh commit`,
      "u",
    ),
  );
  // The original annotated tag object goes back and the stray branch goes.
  git(remote, ["update-ref", `refs/tags/${tag}`, taggedObject]);
  git(remote, ["update-ref", "-d", "refs/heads/stray"]);
  assert.equal(refresh(tag, head)[0].outcome, "current");
  assert.equal(refs(), stableRefs);
  git(checkout, ["reset", "--hard", prior]);
  assert.equal(
    measured("c behind", () => refresh(tag, head)[0]).outcome,
    "current",
  );
  assert.equal(
    git(checkout, ["rev-parse", "HEAD"]).stdout.trim(),
    update.after,
  );
  const refuseUnchanged = (name, pattern) => {
    const before = refs(),
      checkoutHead = git(checkout, ["rev-parse", "HEAD"]).stdout;
    const row = measured(name, () => refresh(tag, head)[0]);
    assert.equal(row.outcome, "refused", JSON.stringify(row));
    assert.match(row.reason, pattern);
    assert.equal(refs(), before);
    assert.equal(git(checkout, ["rev-parse", "HEAD"]).stdout, checkoutHead);
  };
  writeFileSync(join(checkout, "keep.txt"), "tracked edit");
  refuseUnchanged("d tracked", /changes/);
  writeFileSync(join(checkout, "keep.txt"), "initial retained file\n");
  writeFileSync(join(checkout, "untracked"), "untracked");
  refuseUnchanged("d untracked", /changes/);
  rmSync(join(checkout, "untracked"));
  git(checkout, ["commit", "--allow-empty", "-qm", "local ahead"]);
  refuseUnchanged("e ahead", /ahead.*diverged/);
  const peer = join(root, "peer");
  git(root, ["clone", "--quiet", remote, peer]);
  configureRepository(peer);
  git(peer, ["commit", "--allow-empty", "-qm", "remote advances"]);
  git(peer, ["push", "origin", "main"]);
  refuseUnchanged("e diverged", /ahead.*diverged/);
  git(checkout, [
    "reset",
    "--hard",
    git(peer, ["rev-parse", "HEAD"]).stdout.trim(),
  ]);
  for (const url of [
    "https://github.com/refresh-fixture/wrong.git",
    "https://github.com/wrong-owner/starter-fixture.git",
  ]) {
    git(checkout, ["remote", "set-url", "origin", url]);
    refuseUnchanged("f misbound", /push URL/);
  }
  git(checkout, ["remote", "set-url", "origin", starterUrl]);
  // No checkout, non-root, wrong branch and empty remote need no preparation.
  rmSync(map);
  refuseUnchanged("missing checkout", /no recorded/);
  mapCheckout(join(checkout, "scripts"));
  refuseUnchanged("non-root", /top level/);
  mapCheckout();
  git(checkout, ["switch", "-c", "other"]);
  refuseUnchanged("wrong branch", /must be on main/);
  git(checkout, ["switch", "main"]);
  const empty = join(root, "empty.git");
  git(root, ["init", "--quiet", "--bare", empty]);
  setRemote(empty);
  const absent = refresh(tag, head)[0];
  assert.equal(absent.outcome, "refused");
  assert.match(absent.reason, /remote ref|main/);
  setRemote(remote);
  const futureHead = head,
    futureTag = tag;
  git(core, ["commit", "--allow-empty", "-qm", "main moved beyond tag"]);
  assert.equal(
    measured("i main past tag", () => refresh(tag, head)[0]).outcome,
    "skipped",
  );
  git(core, ["reset", "--hard", first.coreCommit]);
  assert.equal(
    measured("i later manifest", () => refresh("v10.0.0", first.coreCommit)[0])
      .outcome,
    "skipped",
  );
  git(core, ["reset", "--hard", futureHead]);
  assert.equal(
    refresh("v10.0.0", futureHead)[0].outcome,
    "skipped",
    "real close retains its immutable-tag guard when main matches head",
  );
  const declared = readFileSync(declaration);
  rmSync(declaration);
  assert.deepEqual(
    measured("h no declaration", () => refresh(tag, head)),
    [],
  );
  writeFileSync(declaration, declared);
  const dryBefore = git(checkout, ["rev-parse", "HEAD"]).stdout,
    receiptsBefore = JSON.stringify(pending());
  const currentPreview = measured(
    "preview",
    () => refresh(futureTag, futureHead, true)[0],
  );
  assert.equal(currentPreview.outcome, "current");
  assert.match(currentPreview.reason, /preview/);
  assert.equal(git(checkout, ["rev-parse", "HEAD"]).stdout, dryBefore);
  assert.equal(JSON.stringify(pending()), receiptsBefore);
  // Reproduce a kit-only refresh: the manifest already names this release,
  // but its seed still matches an older export reachable in starter history.
  writeFileSync(join(checkout, "README.md"), seedReadme);
  git(checkout, ["add", "README.md"]);
  git(checkout, ["commit", "-qm", "test: historical kit-only refresh"]);
  git(checkout, ["push", remote, "main"]);
  const seedOnlyRefs = refs();
  const seedPreview = refresh(tag, head, true)[0];
  assert.equal(seedPreview.outcome, "preview", JSON.stringify(seedPreview));
  assert.deepEqual(seedPreview.seedChanges, ["README.md"]);
  assert.match(printed(seedPreview), /; seeds would change: README\.md; tag /u);
  assert.match(printed(seedPreview), /GitHub Release preview \([^)]+\)\.$/u);
  assert.doesNotMatch(printed(seedPreview), /seeds published/u);
  assert.equal(refs(), seedOnlyRefs);
  const seedOnly = refresh(tag, head)[0];
  assert.equal(seedOnly.outcome, "refreshed", JSON.stringify(seedOnly));
  assert.deepEqual(seedOnly.rewrittenSeeds, ["README.md"]);
  assert.match(
    printed(seedOnly),
    new RegExp(`-> ${seedOnly.after}; seeds published: README\\.md; tag `, "u"),
  );
  const seedOnlyPublished = refs();
  assert.equal(refresh(tag, head)[0].outcome, "current");
  assert.equal(refs(), seedOnlyPublished);
  // Refresh keeps an absent legacy configuration absent, and a configured
  // name belongs to the destination rather than the incoming starter seed.
  const identityHead = git(checkout, ["rev-parse", "HEAD"]).stdout.trim();
  for (const displayName of [null, "Example Starter"]) {
    const configurationPath = join(checkout, "dotln.config.json");
    if (displayName === null) rmSync(configurationPath, { force: true });
    else
      writeFileSync(
        configurationPath,
        JSON.stringify({ version: 1, release: { displayName } }, null, 2) +
          "\n",
      );
    const heldConfiguration = existsSync(configurationPath)
      ? readFileSync(configurationPath, "utf8")
      : null;
    writeFileSync(join(checkout, "README.md"), seedReadme);
    git(checkout, ["add", "-A"]);
    git(checkout, ["commit", "-qm", "test: instance-owned release identity"]);
    git(checkout, ["push", remote, "main"]);
    const renamed = refresh(tag, head)[0];
    assert.equal(renamed.outcome, "refreshed", JSON.stringify(renamed));
    assert.equal(
      existsSync(configurationPath)
        ? readFileSync(configurationPath, "utf8")
        : null,
      heldConfiguration,
    );
    assert.ok(
      readFileSync(join(checkout, "README.md"), "utf8").includes(
        `This source prepares ${displayName ?? "DotLn"} `,
      ),
    );
    assert.equal(refresh(tag, head)[0].outcome, "current");
  }
  git(checkout, ["reset", "--hard", identityHead]);
  rewindRemoteMain();
  // A seed whose incoming template did not change can remain customized or
  // absent without obstructing unrelated kit updates. The planner keeps it.
  const seedHead = git(checkout, ["rev-parse", "HEAD"]).stdout.trim();
  const unchangedReadme = readFileSync(join(checkout, "README.md"));
  for (const kind of ["custom", "missing", "mode", "symlink"]) {
    if (kind === "custom")
      writeFileSync(
        join(checkout, "README.md"),
        Buffer.concat([
          unchangedReadme,
          Buffer.from("\nStarter customization.\n"),
        ]),
      );
    if (["missing", "symlink"].includes(kind))
      rmSync(join(checkout, "README.md"));
    if (kind === "mode") chmodSync(join(checkout, "README.md"), 0o755);
    if (kind === "symlink")
      symlinkSync("scripts/kit/README.client.md", join(checkout, "README.md"));
    git(checkout, ["add", "-A"]);
    git(checkout, ["commit", "-qm", `test: preserve unchanged ${kind} seed`]);
    const planned = ok(
      runCore(
        `import {planStarterSeeds} from './scripts/lib/starter-seeds.mjs'; console.log(JSON.stringify(planStarterSeeds({main:process.cwd(),head:${JSON.stringify(head)},checkout:${JSON.stringify(checkout)},remote:'HEAD'})));`,
      ),
      "unchanged template preserves customized seed",
    );
    assert.deepEqual(JSON.parse(planned.stdout), []);
    git(checkout, ["reset", "--hard", seedHead]);
  }
  // Verification reads CLAUDE.md as its emit floor and .gitignore as its
  // ignore rules. A kit-only release changes no seed template, so a kept copy
  // it cannot use refuses by path in both modes before any write, while a
  // usable customization or mode survives verification and publication. The
  // starter at its own release verifies nothing and stays current in both
  // modes. Broken markers are repaired, keeping the operator's text.
  const keptTag = tag,
    keptCoreHead = head;
  git(core, ["commit", "--allow-empty", "-qm", "kit-only release"]);
  tag = "v10.1.1";
  head = git(core, ["rev-parse", "HEAD"]).stdout.trim();
  git(core, ["tag", tag]);
  for (const [path, kind, refusal, remedy] of [
    [".gitignore", "missing", /\.gitignore \(missing\)/u],
    [".gitignore", "symlink", /\.gitignore \(not a regular file\)/u],
    [".gitignore", "mode", null],
    ["CLAUDE.md", "missing", /CLAUDE\.md \(missing\)/u],
    ["CLAUDE.md", "symlink", /CLAUDE\.md \(not a regular file\)/u],
    ["CLAUDE.md", "floor", /CLAUDE\.md \(no hand-written floor/u],
    [
      "CLAUDE.md",
      "markers",
      /CLAUDE\.md \(harness markers are not one ordered pair\)/u,
      /no seed replaced or pushed\. Repair CLAUDE\.md to keep its hand-written text with one ordered <!-- dotln-harness:start --> … <!-- dotln-harness:end --> pair or no markers, or restore CLAUDE\.md from scripts\/kit\/CLAUDE\.template\.md in a reviewed starter change/u,
    ],
    ["CLAUDE.md", "custom", null],
  ]) {
    const target = join(checkout, path),
      bytes = readFileSync(target, "utf8");
    if (["missing", "symlink"].includes(kind)) rmSync(target);
    if (kind === "symlink")
      symlinkSync(
        path === "CLAUDE.md"
          ? "scripts/kit/CLAUDE.template.md"
          : "scripts/kit/gitignore.template",
        target,
      );
    if (kind === "mode") chmodSync(target, 0o755);
    if (kind === "floor")
      writeFileSync(
        target,
        bytes.slice(bytes.indexOf("<!-- dotln-harness:start -->")),
      );
    if (kind === "custom")
      writeFileSync(target, bytes + "\nKeep these operator instructions.\n");
    if (kind === "markers")
      writeFileSync(target, bytes + "\n<!-- dotln-harness:start -->\n");
    git(checkout, ["add", "-A"]);
    git(checkout, ["commit", "-qm", `test: unchanged ${path} ${kind}`]);
    git(checkout, ["push", remote, "main"]);
    const keptRefs = refs(),
      keptHead = remoteHead(),
      keptTrees = worktrees();
    git(core, ["reset", "--hard", keptCoreHead]);
    for (const preview of [true, false])
      assert.equal(
        refresh(keptTag, keptCoreHead, preview)[0].outcome,
        "current",
        `${path} ${kind}`,
      );
    assert.equal(refs(), keptRefs);
    git(core, ["reset", "--hard", head]);
    for (const preview of refusal ? [true, false] : []) {
      const row = refresh(tag, head, preview)[0];
      assert.equal(row.outcome, "refused", `${path} ${kind}`);
      assert.match(row.reason, refusal);
      assert.match(
        row.reason,
        remedy ??
          new RegExp(
            `no seed replaced or pushed\\. Restore ${path.replace(".", "\\.")} from scripts/kit/`,
            "u",
          ),
      );
      assert.deepEqual(row.rewrittenSeeds, []);
      assert.equal(refs(), keptRefs);
      assert.equal(
        git(checkout, ["rev-parse", "HEAD"]).stdout.trim(),
        keptHead,
      );
      assert.equal(worktrees(), keptTrees);
    }
    if (!refusal) {
      const kept = refresh(tag, head)[0];
      assert.equal(kept.outcome, "refreshed", JSON.stringify(kept));
      assert.deepEqual(kept.rewrittenSeeds, []);
      assert.equal(manifestOf(checkout).commit, head);
      assert.match(
        git(checkout, ["ls-files", "--stage", path]).stdout,
        kind === "mode" ? /^100755 / : /^100644 /,
      );
      if (kind === "custom")
        assert.match(
          readFileSync(target, "utf8"),
          /<!-- dotln-harness:end -->\n\nKeep these operator instructions\.\n$/u,
        );
    }
    git(checkout, ["reset", "--hard", seedHead]);
    rewindRemoteMain();
  }
  // Remove the floor on the remote while the next release changes the
  // contract template: the planner refuses the customized copy by path.
  const contract = readFileSync(join(checkout, "CLAUDE.md"), "utf8");
  writeFileSync(
    join(checkout, "CLAUDE.md"),
    contract.slice(contract.indexOf("<!-- dotln-harness:start -->")),
  );
  git(checkout, ["add", "CLAUDE.md"]);
  git(checkout, ["commit", "-qm", "fixture missing floor"]);
  git(checkout, ["push", remote, "main"]);
  writeFileSync(
    join(core, "scripts/kit/CLAUDE.template.md"),
    readFileSync(join(core, "scripts/kit/CLAUDE.template.md"), "utf8") +
      "\nChanged contract template.\n",
  );
  git(core, ["add", "scripts/kit/CLAUDE.template.md"]);
  git(core, ["commit", "-qm", "next release"]);
  head = git(core, ["rev-parse", "HEAD"]).stdout.trim();
  tag = "v10.2.0";
  git(core, ["tag", tag]);
  const beforeFailed = refs(),
    failedHead = git(checkout, ["rev-parse", "HEAD"]).stdout,
    priorReceipts = JSON.stringify(pending());
  const failed = measured("g customized contract", () => refresh(tag, head)[0]);
  assert.equal(failed.outcome, "refused", JSON.stringify(failed));
  assert.match(failed.reason, /starter seed.*CLAUDE.md/);
  assert.equal(refs(), beforeFailed);
  assert.equal(git(checkout, ["rev-parse", "HEAD"]).stdout, failedHead);
  assert.equal(git(checkout, ["status", "--porcelain"]).stdout, "");
  assert.equal(JSON.stringify(pending()), priorReceipts);
  assert.equal(worktrees().match(/^worktree /gm).length, 1);
  // A kept .gitignore that no longer ignores node_modules/ lets Git stage
  // the verification's workspace links after the proven contract seed is
  // written. The refusal names those paths and nothing reports a seed as
  // published.
  git(checkout, ["reset", "--hard", seedHead]);
  rewindRemoteMain();
  const ignoreRules = readFileSync(join(checkout, ".gitignore"), "utf8");
  assert.match(ignoreRules, /^node_modules\/$/mu);
  writeFileSync(
    join(checkout, ".gitignore"),
    ignoreRules.replace(/^node_modules\/\n/mu, ""),
  );
  git(checkout, ["add", ".gitignore"]);
  git(checkout, ["commit", "-qm", "test: starter stops ignoring dependencies"]);
  git(checkout, ["push", remote, "main"]);
  const writtenRefs = refs(),
    writtenHead = git(checkout, ["rev-parse", "HEAD"]).stdout,
    writtenReceipts = JSON.stringify(pending());
  const wouldWrite = refresh(tag, head, true)[0];
  assert.equal(wouldWrite.outcome, "preview", JSON.stringify(wouldWrite));
  assert.deepEqual(wouldWrite.seedChanges, ["CLAUDE.md"]);
  assert.match(printed(wouldWrite), /; seeds would change: CLAUDE\.md; tag /u);
  assert.match(printed(wouldWrite), /GitHub Release preview \([^)]+\)\.$/u);
  const afterWrite = measured(
    "g refused after seed write",
    () => refresh(tag, head)[0],
  );
  assert.equal(afterWrite.outcome, "refused", JSON.stringify(afterWrite));
  assert.ok(Number.isInteger(afterWrite.timings.verification));
  assert.match(
    afterWrite.reason,
    /staged outside the plan: node_modules\/@dotln\/[a-z]+ \(added link\).*One possible cause is ignore rules.*compare the starter's \.gitignore with scripts\/kit\/gitignore\.template/u,
  );
  // The contract seed was written and staged: only the links differ.
  assert.doesNotMatch(afterWrite.reason, /planned but not staged/u);
  assert.deepEqual(afterWrite.rewrittenSeeds, []);
  assert.match(
    printed(afterWrite),
    /^Starter refresh starter-fixture: refused; staged change set differs/u,
  );
  assert.doesNotMatch(printed(afterWrite), /seeds (?:published|would change)/u);
  assert.equal(refs(), writtenRefs);
  assert.equal(git(checkout, ["rev-parse", "HEAD"]).stdout, writtenHead);
  assert.equal(git(checkout, ["status", "--porcelain"]).stdout, "");
  assert.equal(JSON.stringify(pending()), writtenReceipts);
  assert.equal(worktrees().match(/^worktree /gm).length, 1);
  // Verification can still refuse after writing the contract seed. Such a
  // refusal neither publishes nor reports a seed.
  const refusedAfterWrite = (name, setup) => {
    git(checkout, ["reset", "--hard", seedHead]);
    rewindRemoteMain();
    setup();
    const before = refs(),
      beforeHead = git(checkout, ["rev-parse", "HEAD"]).stdout,
      receipts = JSON.stringify(pending());
    const row = measured(name, () => refresh(tag, head)[0]);
    assert.equal(row.outcome, "refused", JSON.stringify(row));
    assert.ok(Number.isInteger(row.timings.verification));
    assert.deepEqual(row.rewrittenSeeds, []);
    assert.doesNotMatch(printed(row), /seeds (?:published|would change)/u);
    assert.equal(refs(), before);
    assert.equal(git(checkout, ["rev-parse", "HEAD"]).stdout, beforeHead);
    assert.equal(git(checkout, ["status", "--porcelain"]).stdout, "");
    assert.equal(JSON.stringify(pending()), receipts);
    assert.equal(worktrees().match(/^worktree /gm).length, 1);
    return row;
  };
  // A starter file in the harness's owned hook directory stops the export's
  // own emit, which names it.
  const unowned = refusedAfterWrite("g failed verification", () => {
    mkdirSync(join(checkout, ".claude/hooks"), { recursive: true });
    writeFileSync(
      join(checkout, ".claude/hooks/operator-custom.mjs"),
      "// operator hook\n",
    );
    git(checkout, ["add", "-A"]);
    git(checkout, ["commit", "-qm", "test: starter adds an unowned hook"]);
    git(checkout, ["push", remote, "main"]);
  });
  assert.match(
    unowned.reason,
    /harness emit failed.*unowned harness output refuses replacement: \.claude\/hooks\/operator-custom\.mjs/su,
  );
  assert.match(
    printed(unowned),
    /^Starter refresh starter-fixture: refused; the export's own harness emit failed/u,
  );
  // A managed kit file's executable bit is part of the applied plan even
  // when its bytes match. Kept instance seeds retain their own modes above.
  git(checkout, ["reset", "--hard", seedHead]);
  rewindRemoteMain();
  chmodSync(join(core, "scripts/lineage.mjs"), 0o755);
  git(core, ["add", "scripts/lineage.mjs"]);
  git(core, ["commit", "-qm", "test: mode-only kit change"]);
  head = git(core, ["rev-parse", "HEAD"]).stdout.trim();
  tag = "v10.2.1";
  git(core, ["tag", tag]);
  const modeOnly = measured(
    "g mode-only kit change",
    () => refresh(tag, head)[0],
  );
  assert.equal(modeOnly.outcome, "refreshed", JSON.stringify(modeOnly));
  assert.match(
    git(checkout, ["ls-files", "--stage", "scripts/lineage.mjs"]).stdout,
    /^100755 /u,
  );
  assert.equal(manifestOf(checkout).commit, head);
});
