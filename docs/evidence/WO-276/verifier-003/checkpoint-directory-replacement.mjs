// A supported tracked-directory-to-file replacement, compared with main.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import {
  workingTree,
  createCheckpoint,
} from "../../../../scripts/lib/checkpoint.mjs";
import {
  createScratchRoot,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
const base = "0097fcac608bcaa24c51c8b6d6020fc2382ea141";
const scratch = createScratchRoot(join(tmpdir(), "dotln-ver003-checkpoint-"));
const env = {
  ...process.env,
  GIT_AUTHOR_NAME: "Fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "Fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};
const repo = join(scratch, "repo");
const git = (...args) =>
  execFileSync("git", args, { cwd: repo, env, encoding: "utf8" }).trim();
let result;
try {
  mkdirSync(repo);
  git("init", "-q");
  git("config", "user.name", "Fixture");
  git("config", "user.email", "fixture@example.invalid");
  mkdirSync(join(repo, "component"));
  writeFileSync(join(repo, "component", "old.txt"), "old\n");
  git("add", "-A");
  git("commit", "-qm", "Fixture base");
  rmSync(join(repo, "component"), { recursive: true });
  writeFileSync(join(repo, "component"), "replacement\n");
  const index = readFileSync(join(repo, ".git/index"));
  let source = execFileSync(
    "git",
    ["show", "--format=", `${base}:scripts/lib/checkpoint.mjs`],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  source = source.replace(
    /from "(\.{1,2}\/[^"\n]+)"/gu,
    (_, specifier) =>
      `from ${JSON.stringify(pathToFileURL(resolve(process.cwd(), "scripts/lib", specifier)).href)}`,
  );
  const modulePath = join(scratch, "baseline.mjs");
  writeFileSync(modulePath, source);
  const baseline = await import(pathToFileURL(modulePath).href);
  const before = baseline.workingTree(repo);
  assert.equal(git("show", "--format=", `${before}:component`), "replacement");
  const observe = (run) => {
    try {
      return { returned: run(), error: null };
    } catch (error) {
      return {
        error: {
          code: error.code ?? null,
          message: error.message.replaceAll(repo, "<fixture>"),
        },
      };
    }
  };
  const snapshot = observe(() => workingTree(repo));
  const checkpoint = observe(() =>
    createCheckpoint(repo, "checkpoint", "WO-999", { hookless: true }),
  );
  assert.equal(snapshot.error?.code, "ENOTDIR");
  assert.equal(checkpoint.error?.code, "ENOTDIR");
  assert.deepEqual(readFileSync(join(repo, ".git/index")), index);
  assert.equal(readFileSync(join(repo, "component"), "utf8"), "replacement\n");
  result = {
    base,
    scenario:
      "Commit component/old.txt, then replace component/ with a normal file before checkpointing",
    baseline: { snapshotSucceeded: true, replacementPreserved: true },
    candidate: { snapshot, checkpoint },
    indexBytesUnchanged: true,
    workingFilePreserved: true,
    limit:
      "Actual baseline checkpoint module; relative shared utilities rebound to current tree. Local fixture only, no repository state was discarded.",
  };
} finally {
  removeTemporaryPath(scratch, { recursive: true, force: true });
}
const output = JSON.stringify(result, null, 2) + "\n";
if (process.argv[2]) writeFileSync(process.argv[2], output);
else process.stdout.write(output);
