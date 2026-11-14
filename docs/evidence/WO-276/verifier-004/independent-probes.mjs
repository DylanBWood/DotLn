// VER-004: independent local preservation, discovery and cleanup-boundary probes.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  renameSync,
  symlinkSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  workingTree,
  createCheckpoint,
} from "../../../../scripts/lib/checkpoint.mjs";
import {
  screenedSources,
  markdownScreen,
} from "../../../../scripts/lib/markdown-screen.mjs";
import { sourceDialect } from "../../../../packages/skeleton/src/source-reading.mjs";
import { closeLeftoverCodexServers } from "../../../../scripts/lib/codex-background.mjs";
import {
  createScratchRoot,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
const scratch = createScratchRoot(join(tmpdir(), "dotln-ver004-"));
const result = {
  checkpoint: [],
  discovery: [],
  cleanup: [],
  limits:
    "Synthetic local repositories and process rows. Cleanup signals are recorded by a stub; no host process is signalled.",
};
const env = {
  ...process.env,
  GIT_AUTHOR_NAME: "Fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "Fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
};
const git = (cwd, ...args) =>
  execFileSync(
    "git",
    ["-c", "core.hooksPath=/dev/null", "-c", "maintenance.auto=false", ...args],
    { cwd, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  ).trim();
try {
  for (const shape of [
    "directory-to-file",
    "directory-to-link",
    "nested-directory-to-file",
    "ignored-file",
    "case-rename",
    "file-to-directory",
  ]) {
    const repo = join(scratch, shape);
    mkdirSync(join(repo, "component/deep"), { recursive: true });
    git(repo, "init", "-q");
    writeFileSync(join(repo, "component/deep/old.txt"), "before\n");
    writeFileSync(join(repo, "plain.txt"), "plain\n");
    git(repo, "add", "-A");
    git(repo, "commit", "-qm", "Fixture");
    let expected,
      content = "after";
    if (shape === "directory-to-file") {
      rmSync(join(repo, "component"), { recursive: true });
      writeFileSync(join(repo, "component"), "after\n");
      expected = "component";
    }
    if (shape === "nested-directory-to-file") {
      rmSync(join(repo, "component/deep"), { recursive: true });
      writeFileSync(join(repo, "component/deep"), "after\n");
      expected = "component/deep";
    }
    if (shape === "directory-to-link") {
      rmSync(join(repo, "component"), { recursive: true });
      symlinkSync("plain.txt", join(repo, "component"));
      expected = "component";
      content = "plain.txt";
    }
    if (shape === "ignored-file") {
      writeFileSync(join(repo, ".git/info/exclude"), "plain.txt\n");
      writeFileSync(join(repo, "plain.txt"), "after\n");
      expected = "plain.txt";
    }
    if (shape === "case-rename") {
      renameSync(join(repo, "plain.txt"), join(repo, "move"));
      renameSync(join(repo, "move"), join(repo, "PLAIN.txt"));
      expected = "PLAIN.txt";
      content = "plain";
    }
    if (shape === "file-to-directory") {
      rmSync(join(repo, "plain.txt"));
      mkdirSync(join(repo, "plain.txt"));
      writeFileSync(join(repo, "plain.txt/new.txt"), "after\n");
      expected = "plain.txt/new.txt";
    }
    const index = readFileSync(join(repo, ".git/index"));
    const tree = workingTree(repo);
    assert.equal(
      git(repo, "show", "--format=", `${tree}:${expected}`),
      content,
    );
    const names = git(repo, "ls-tree", "-r", "--name-only", tree).split("\n");
    if (shape === "case-rename") assert.ok(!names.includes("plain.txt"));
    if (shape === "directory-to-file" || shape === "directory-to-link")
      assert.ok(!names.includes("component/deep/old.txt"));
    const checkpoint = createCheckpoint(repo, "checkpoint", "WO-999", {
      hookless: true,
    });
    assert.equal(
      git(repo, "rev-parse", `${checkpoint.checkpointRef}^{tree}`),
      tree,
    );
    assert.deepEqual(readFileSync(join(repo, ".git/index")), index);
    result.checkpoint.push({
      shape,
      expected,
      preserved: true,
      indexUnchanged: true,
      checkpointMatches: true,
    });
  }
  const repo = join(scratch, "discovery");
  mkdirSync(repo);
  git(repo, "init", "-q");
  const names = [
    "scripts/.js",
    "packages/example/src/.ts",
    "scripts/line\nbreak.mjs",
    "packages/example/src/.tsx",
    "scripts/nested/.cjs",
    "scripts/reader.mts",
  ];
  const source = "const heading = /^## (.+)$/mu.exec(text);\n";
  for (const name of names) {
    mkdirSync(join(repo, name, ".."), { recursive: true });
    writeFileSync(join(repo, name), source);
  }
  const selected = screenedSources(repo);
  for (const name of names) {
    const findings = markdownScreen(repo, [name]);
    assert.ok(sourceDialect(name));
    assert.ok(selected.includes(name));
    assert.ok(findings.length);
    result.discovery.push({
      path: name,
      selected: true,
      findings: findings.length,
    });
  }
  const home = "/Users/fixture";
  const bin = `${home}/.codex/packages/app-server-daemon/releases/0.169.0-aarch64-apple-darwin/bin`;
  const daemon = {
    pid: 300,
    ppid: 1,
    command: `${bin}/codex app-server daemon pid-update-loop`,
  };
  const server = {
    pid: 200,
    ppid: 300,
    command: `${bin}/codex app-server --listen unix://`,
  };
  for (const [name, live] of [
    ["ended-session", null],
    ["live-standalone-cli", "/opt/homebrew/bin/codex exec --ephemeral -"],
    ["live-packaged-cli", `${bin}/codex exec --ephemeral -`],
    ["live-packaged-interactive", `${bin}/codex`],
  ]) {
    const signals = [];
    const rows = [
      daemon,
      server,
      ...(live ? [{ pid: 900, ppid: 42, command: live }] : []),
    ];
    const message = closeLeftoverCodexServers({
      repository: "/fixture/permanent-project",
      temporary: "/fixture/tmp",
      env: {},
      home,
      rows,
      kill: (pid) => signals.push(pid),
    });
    result.cleanup.push({
      name,
      liveSession: !!live,
      signalledPids: signals,
      liveProcessSignalled: signals.includes(900),
      message,
    });
  }
} finally {
  removeTemporaryPath(scratch, { recursive: true, force: true });
}
writeFileSync(process.argv[2], JSON.stringify(result, null, 2) + "\n");
console.log(
  JSON.stringify({
    checkpoint: result.checkpoint.length,
    discovery: result.discovery.length,
    cleanup: result.cleanup.map(({ name, liveProcessSignalled }) => ({
      name,
      liveProcessSignalled,
    })),
  }),
);
