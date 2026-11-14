// Independent boundary variations beyond the repaired fixtures.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import {
  createScratchRoot,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
import {
  screenedSources,
  screenSource,
  markdownScreen,
} from "../../../../scripts/lib/markdown-screen.mjs";
import { sourceTrees as readSources } from "../../../../packages/skeleton/src/source-reading.mjs";
import {
  workingTree,
  createCheckpoint,
} from "../../../../scripts/lib/checkpoint.mjs";
import {
  readWorkOrder,
  readWorkOrderHeader,
} from "../../../../scripts/lib/work-order-document.mjs";
const scratch = createScratchRoot(join(tmpdir(), "dotln-ver003-boundaries-"));
const env = {
  ...process.env,
  GIT_AUTHOR_NAME: "Fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "Fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};
const git = (root, ...args) =>
  execFileSync("git", args, { cwd: root, env, encoding: "utf8" }).trim();
const result = { sourceDiscovery: [], checkpoints: [], headerParity: [] };
try {
  const root = join(scratch, "source");
  mkdirSync(root);
  git(root, "init", "-q");
  const source = "export const reads = text => /^## /.test(text);\n";
  const names = [
    "scripts/reader.js",
    "scripts/.js",
    "scripts/nested/.js",
    "packages/example/src/reader.ts",
    "packages/example/src/.ts",
    "packages/example/src/nested/.ts",
  ];
  for (const name of names) {
    mkdirSync(join(root, name, ".."), { recursive: true });
    writeFileSync(join(root, name), source);
  }
  const selected = screenedSources(root),
    findings = markdownScreen(root);
  const readings = readSources(names.map((path) => ({ path, source })));
  for (const [index, name] of names.entries()) {
    const direct = screenSource(name, source);
    result.sourceDiscovery.push({
      path: name,
      sharedReaderAccepts: Boolean(readings[index]),
      directFindings: direct.length,
      checkoutSelected: selected.includes(name),
      checkoutFindings: findings.filter((f) => f.file === name).length,
    });
  }
  execFileSync(process.execPath, ["--check", join(root, "scripts/.js")], {
    encoding: "utf8",
  });
  result.hiddenJavaScriptSyntaxAccepted = true;
  const repo = join(scratch, "checkpoint");
  mkdirSync(repo);
  git(repo, "init", "-q");
  const files = [
    "plain.txt",
    "assumed.txt",
    "skipped.txt",
    "ignored.txt",
    "directory/nested.txt",
    "removed.txt",
    "line\nbreak.txt",
  ];
  for (const name of files) {
    mkdirSync(join(repo, name, ".."), { recursive: true });
    writeFileSync(join(repo, name), "original\n");
  }
  git(repo, "add", "-A");
  git(repo, "commit", "-qm", "Fixture base");
  git(repo, "update-index", "--assume-unchanged", "assumed.txt");
  git(repo, "update-index", "--skip-worktree", "skipped.txt");
  for (const name of files.filter((name) => name !== "removed.txt"))
    writeFileSync(join(repo, name), "changed\n");
  writeFileSync(
    join(repo, ".gitignore"),
    "ignored.txt\nforced.txt\nforced-link\nuntracked-ignored.txt\n",
  );
  writeFileSync(join(repo, "forced.txt"), "forced\n");
  symlinkSync("plain.txt", join(repo, "forced-link"));
  git(repo, "add", "-f", "forced.txt", "forced-link");
  writeFileSync(join(repo, "untracked-ignored.txt"), "excluded\n");
  rmSync(join(repo, "removed.txt"));
  const indexBefore = readFileSync(join(repo, ".git/index"));
  const tree = workingTree(repo);
  for (const name of [
    ...files.filter((name) => name !== "removed.txt"),
    "forced.txt",
  ]) {
    const content = git(repo, "show", "--format=", `${tree}:${name}`);
    assert.equal(content, name === "forced.txt" ? "forced" : "changed");
  }
  assert.equal(
    git(repo, "show", "--format=", `${tree}:forced-link`),
    "plain.txt",
  );
  const paths = git(repo, "ls-tree", "-r", "--name-only", "-z", tree).split(
    "\0",
  );
  assert.ok(!paths.includes("removed.txt"));
  assert.ok(!paths.includes("untracked-ignored.txt"));
  assert.deepEqual(readFileSync(join(repo, ".git/index")), indexBefore);
  result.checkpoints.push({
    case: "ignored tracked, forced file/link, assume-unchanged, skip-worktree, newline path, deletion",
    passed: true,
    indexBytesUnchanged: true,
  });
  let baseSource = execFileSync(
    "git",
    [
      "show",
      "--format=",
      "0097fcac608bcaa24c51c8b6d6020fc2382ea141:scripts/lib/checkpoint.mjs",
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  baseSource = baseSource.replace(
    /from "(\.{1,2}\/[^"\n]+)"/gu,
    (_, specifier) =>
      `from ${JSON.stringify(pathToFileURL(resolve(process.cwd(), "scripts/lib", specifier)).href)}`,
  );
  const baselinePath = join(scratch, "baseline-checkpoint.mjs");
  writeFileSync(baselinePath, baseSource);
  const baseline = await import(pathToFileURL(baselinePath).href);
  rmSync(join(repo, "directory"), { recursive: true });
  writeFileSync(join(repo, "directory"), "replacement file\n");
  const baseTree = baseline.workingTree(repo);
  assert.equal(
    git(repo, "show", "--format=", `${baseTree}:directory`),
    "replacement file",
  );
  result.directoryReplacementBaseline = {
    base: "0097fcac608bcaa24c51c8b6d6020fc2382ea141",
    passed: true,
    limit:
      "Actual baseline module; relative shared utilities rebound to current tree",
  };
  try {
    const changed = workingTree(repo);
    assert.equal(
      git(repo, "show", "--format=", `${changed}:directory`),
      "replacement file",
    );
    result.checkpoints.push({
      case: "tracked directory replaced with file",
      passed: true,
    });
  } catch (error) {
    result.checkpoints.push({
      case: "tracked directory replaced with file",
      passed: false,
      code: error.code ?? null,
      message: error.message.replaceAll(repo, "<fixture>"),
    });
  }
  git(repo, "config", "user.name", "Fixture");
  git(repo, "config", "user.email", "fixture@example.invalid");
  try {
    createCheckpoint(repo, "checkpoint", "WO-999", { hookless: true });
    result.currentCheckpointAction = { passed: true };
  } catch (error) {
    result.currentCheckpointAction = {
      passed: false,
      code: error.code ?? null,
      message: error.message.replaceAll(repo, "<fixture>"),
    };
  }
  const cases = [
    [
      "reference title across blank",
      '# WO-999 — Fixture\n\n**Model:** capable\n\n[ref]: /url "start\n**Objective:** fake\n\nend"\n\n**Track:** machinery\n\n**Objective:** real\n\nBody.\n',
    ],
    [
      "body reference changes leading bracketed label",
      "# WO-999 — Fixture\n\n[**Model:** capable]\n\n**Track:** machinery\n\n**Objective:** real\n\n[**Model:** capable]: /url\n",
    ],
  ];
  for (const [name, source] of cases) {
    const full = readWorkOrder(source),
      header = readWorkOrderHeader(source);
    const keys = ["source", "title", "leadStart", "headerEnd", "header"];
    const project = (x) => Object.fromEntries(keys.map((k) => [k, x[k]]));
    let equal = true;
    try {
      assert.deepEqual(project(header), project(full));
    } catch {
      equal = false;
    }
    result.headerParity.push({ name, equal });
  }
} finally {
  removeTemporaryPath(scratch, { recursive: true, force: true });
}
writeFileSync(process.argv[2], JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result));
