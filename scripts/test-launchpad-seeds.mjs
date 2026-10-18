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
  git(root, ["commit", "-qm", "prior verified bytes"]);
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
