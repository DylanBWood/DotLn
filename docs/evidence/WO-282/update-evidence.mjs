// Reproduce the two ownership outcomes, the preview instruction, and a
// follow-up identity carry using only synthetic state in owned scratch.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { TOOL_ROOT } from "../../../scripts/lib/config.mjs";
import {
  createFixtureRoot,
  removeTemporaryPath,
} from "../../../scripts/lib/temporary-roots.mjs";
import { isolatedGitEnvironment } from "../../../scripts/lib/git.mjs";
import { sha256Hex, json } from "../../../scripts/lib/helpers.mjs";
import { fnv1a64 } from "../../../packages/compiler/dist/src/index.js";
import {
  FOLLOWUPS,
  syncFollowups,
  planningFollowups,
} from "../../../scripts/lib/planning-followups.mjs";
const scratch = createFixtureRoot(join(tmpdir(), "dotln-update-evidence-"));
const env = { ...process.env, ...isolatedGitEnvironment(scratch) };
const run = (cwd, program, args) =>
  spawnSync(program, args, { cwd, env, encoding: "utf8" });
const git = (cwd, args) => {
  const result = run(cwd, "git", args);
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
try {
  const instance = join(scratch, "instance");
  git(TOOL_ROOT, [
    "clone",
    "--quiet",
    "--shared",
    "--no-checkout",
    TOOL_ROOT,
    instance,
  ]);
  git(instance, ["checkout", "-q", "-B", "main", "HEAD"]);
  git(instance, ["config", "user.name", "Fixture"]);
  git(instance, ["config", "user.email", "fixture@example.test"]);
  git(instance, ["config", "core.hooksPath", "/dev/null"]);
  for (const path of [
    "scripts/lib/harness.mjs",
    "scripts/launchpad.mjs",
    "scripts/lib/planning-followups.mjs",
  ])
    cpSync(join(TOOL_ROOT, path), join(instance, path));
  for (const name of ["kernel", "compiler", "skeleton", "console"])
    cpSync(
      join(TOOL_ROOT, "packages", name, "dist"),
      join(instance, "packages", name, "dist"),
      { recursive: true },
    );
  symlinkSync(join(TOOL_ROOT, "node_modules"), join(instance, "node_modules"));
  const harness = (action) =>
    run(instance, process.execPath, ["scripts/harness.mjs", action]);
  const initial = harness("emit");
  assert.equal(initial.status, 0, initial.stderr);
  const manifestPath = ".claude/harness-manifest.json";
  const owned = JSON.parse(readFileSync(join(instance, manifestPath), "utf8"));
  const codex = owned.installed.filter((row) => row.path.startsWith(".codex/"));
  assert.equal(codex.length, 3);
  const configPath = join(instance, ".codex/config.toml");
  const currentConfig = readFileSync(configPath, "utf8");
  const olderConfig = "# Older generated Codex configuration.\n";
  writeFileSync(configPath, olderConfig);
  codex.find(({ path }) => path === ".codex/config.toml").hash =
    `fnv1a64:${fnv1a64(olderConfig)}`;
  writeFileSync(join(instance, manifestPath), json(owned));
  writeFileSync(
    join(instance, "KIT-MANIFEST.json"),
    json({
      schemaVersion: 1,
      commit: git(instance, ["rev-parse", "HEAD"]),
      tag: null,
      files: [{ path: manifestPath, sha256: sha256Hex(json(owned)) }],
    }),
  );
  writeFileSync(
    join(instance, "KIT-ACTIONS.json"),
    json({ schemaVersion: 1, actions: [] }),
  );
  git(instance, ["add", "-A"]);
  git(instance, ["commit", "-qm", "Synthetic instance emit"]);
  git(instance, ["switch", "-q", "-c", "update-fixture"]);
  const starter = {
    ...owned,
    installed: owned.installed.filter((row) => !row.path.startsWith(".codex/")),
  };
  writeFileSync(join(instance, manifestPath), json(starter));
  const accepted = harness("emit"),
    check = harness("check");
  assert.equal(accepted.status, 0, accepted.stderr);
  assert.equal(readFileSync(configPath, "utf8"), currentConfig);
  assert.equal(check.status, 0, check.stderr);
  const preview = run(instance, process.execPath, [
    "scripts/launchpad.mjs",
    "preview",
    "--from",
    "main",
  ]);
  assert.equal(preview.status, 0, preview.stderr);
  assert.match(preview.stdout, /keep this instance's side/);
  assert.match(
    preview.stdout,
    /^re-emitted: \.claude\/harness-manifest\.json$/m,
  );
  writeFileSync(join(instance, manifestPath), json(starter));
  writeFileSync(
    join(instance, ".codex/config.toml"),
    "# Operator-owned edit.\n",
  );
  const beforeFiles = git(instance, ["diff", "--binary", "HEAD"]);
  const refused = harness("emit");
  assert.equal(refused.status, 1, refused.stdout);
  assert.match(
    refused.stderr,
    /unowned Codex output refuses replacement: \.codex\/config\.toml/,
  );
  assert.equal(git(instance, ["diff", "--binary", "HEAD"]), beforeFiles);
  const followups = join(scratch, "followups");
  mkdirSync(join(followups, "docs/product"), { recursive: true });
  git(followups, ["init", "-q", "-b", "main"]);
  writeFileSync(
    join(followups, "docs/product/ideas.md"),
    "## Candidates\n\n- **Files under `**/*.mjs`.** Keep their public descriptions.\n",
  );
  const before = syncFollowups(followups);
  const old = before.entries[0];
  old.key = `candidate:docs/product/ideas.md#candidates::${sha256Hex("Files under `")}`;
  old.id = `FUP-${sha256Hex(old.key).slice(0, 16)}`;
  old.dispositions = [
    {
      sourceRevision: 1,
      status: "settled",
      reason: "Public evidence settled it.",
      reopenWhen: "The source changes.",
      targets: [],
      at: "2026-11-01T00:00:00.000Z",
    },
  ];
  writeFileSync(join(followups, FOLLOWUPS), json(before));
  const after = syncFollowups(followups);
  assert.equal(planningFollowups(followups).pending, 0);
  const scrub = (text) =>
    text
      .replaceAll(instance, "<fixture>")
      .replaceAll(TOOL_ROOT, "<repository>");
  const evidence = {
    observedAt: new Date().toISOString(),
    ownership: {
      admittedExitCode: accepted.status,
      olderOwnedBytesReplaced: true,
      olderConfigHash: sha256Hex(olderConfig),
      emittedConfigHash: sha256Hex(currentConfig),
      checkExitCode: check.status,
      refusedExitCode: refused.status,
      refusal: scrub(refused.stderr.trim()),
      refusedWrites: 0,
      codexPaths: codex.map((row) => row.path),
    },
    preview: {
      command: "node scripts/launchpad.mjs preview --from main",
      exitCode: preview.status,
      output: scrub(preview.stdout),
    },
    followups: { before, after, pending: 0 },
  };
  writeFileSync(
    join(TOOL_ROOT, "docs/evidence/WO-282/update-evidence.json"),
    json(evidence),
  );
  console.log("Ownership arms, preview and follow-up projections recorded.");
} finally {
  removeTemporaryPath(scratch, { recursive: true, force: true });
}
