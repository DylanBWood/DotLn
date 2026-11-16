// VER-001 probe P1 (WO-282 criterion 1): the emit's ownership reading of
// main's harness manifest in layouts the executor's fixture held constant.
// The fixture ran in a repository's own checkout with main beside the branch;
// these arms add a linked worktree (the gitfile layout an update branch
// often has), a repository with no main, main's manifest unreadable and a
// branch whose on-disk manifest is gone. Each arm calls the worktree's
// emitHarness with a one-file installation, so the arm judges the ownership
// test alone, never the bundle a full emit would write.
//
// usage: node emit-layouts.mjs <launchpad> <scratch directory> <results.json>
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

const [launchpad, scratch, output] = process.argv.slice(2);
const { emitHarness } = await import(
  join(launchpad, "scripts/lib/harness.mjs")
);
const { fnv1a64 } = await import(
  join(launchpad, "packages/compiler/dist/src/index.js")
);
const hash = (text) => `fnv1a64:${fnv1a64(text)}`;
const env = {
  ...process.env,
  GIT_CONFIG_NOSYSTEM: "1",
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_AUTHOR_NAME: "Probe",
  GIT_AUTHOR_EMAIL: "probe@example.invalid",
  GIT_COMMITTER_NAME: "Probe",
  GIT_COMMITTER_EMAIL: "probe@example.invalid",
};
for (const name of [
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_COMMON_DIR",
  "GIT_INDEX_FILE",
])
  delete env[name];
const git = (cwd, args) =>
  execFileSync(
    "git",
    ["-c", "core.hooksPath=/dev/null", "-c", "commit.gpgsign=false", ...args],
    { cwd, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  ).trim();
const put = (root, path, text) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
};
const OLD = "# older generated codex config\n";
const NEW = "# current generated codex config\n";
const installation = {
  files: [{ path: ".codex/config.toml", contents: NEW }],
  manifest: {
    build: "none",
    installed: [{ path: ".codex/config.toml", hash: hash(NEW) }],
  },
};
const owned = {
  build: "none",
  installed: [{ path: ".codex/config.toml", hash: hash(OLD) }],
};
const starter = { build: "none", installed: [] };
const manifestText = (manifest) => `${JSON.stringify(manifest, null, 2)}\n`;
const name = (text) =>
  text === null
    ? "absent"
    : text === OLD
      ? "OLD"
      : text === NEW
        ? "NEW"
        : "OTHER";
const base = realpathSync(mkdtempSync(join(scratch, "ver-001-p1-")));
const results = [];
const attempt = (label, root, expect) => {
  const config = join(root, ".codex/config.toml");
  const before = existsSync(config) ? readFileSync(config, "utf8") : null;
  let outcome;
  try {
    emitHarness(root, { features: {}, termsRoot: root }, installation);
    outcome = "emitted";
  } catch (error) {
    outcome = `refused: ${error.message}`;
  }
  const after = readFileSync(config, "utf8");
  results.push({
    label,
    expect,
    outcome,
    configBefore: name(before),
    configAfter: name(after),
    pass: outcome === expect,
  });
};
const seed = (directory, branch) => {
  mkdirSync(directory, { recursive: true });
  git(directory, ["init", "-q", "-b", branch]);
  put(
    directory,
    "CLAUDE.md",
    "# Probe locked floor\nKeep probe source isolated.\n",
  );
  put(directory, ".codex/config.toml", OLD);
  put(directory, ".claude/harness-manifest.json", manifestText(owned));
  git(directory, ["add", "."]);
  git(directory, ["commit", "-qm", "instance emit"]);
};
const refusal =
  "refused: unowned Codex output refuses replacement: .codex/config.toml";
try {
  const linked = (label, edit) => {
    const repository = join(base, `${label}-repository`);
    seed(repository, "main");
    const worktree = join(base, `${label}-worktree`);
    git(repository, ["worktree", "add", "-q", "-b", "update", worktree]);
    put(worktree, ".claude/harness-manifest.json", manifestText(starter));
    if (edit) put(worktree, ".codex/config.toml", `${OLD}# operator edit\n`);
    return worktree;
  };
  attempt(
    "A: linked worktree, starter's manifest on disk, bytes main records",
    linked("a", false),
    "emitted",
  );
  attempt(
    "A2: linked worktree, starter's manifest on disk, operator-edited bytes",
    linked("a2", true),
    refusal,
  );
  const noMain = join(base, "b-repository");
  seed(noMain, "trunk");
  git(noMain, ["switch", "-q", "-c", "update"]);
  put(noMain, ".claude/harness-manifest.json", manifestText(starter));
  attempt("B: no main branch, starter's manifest on disk", noMain, refusal);
  const noManifest = join(base, "c-repository");
  seed(noManifest, "main");
  git(noManifest, ["switch", "-q", "-c", "update"]);
  rmSync(join(noManifest, ".claude/harness-manifest.json"));
  attempt(
    "C: no harness manifest on disk, bytes main records",
    noManifest,
    "emitted",
  );
  const unreadable = join(base, "d-repository");
  seed(unreadable, "main");
  put(unreadable, ".claude/harness-manifest.json", "{not json\n");
  git(unreadable, ["commit", "-qam", "unreadable manifest"]);
  git(unreadable, ["switch", "-q", "-c", "update"]);
  put(unreadable, ".claude/harness-manifest.json", manifestText(starter));
  attempt("D: main's manifest is not JSON", unreadable, refusal);
} finally {
  rmSync(base, { recursive: true, force: true });
}
const record = {
  probe: "P1 emit-layouts",
  observedAt: new Date().toISOString(),
  pass: results.every((row) => row.pass),
  results,
};
writeFileSync(output, `${JSON.stringify(record, null, 2)}\n`);
console.log(JSON.stringify(record, null, 1));
process.exitCode = record.pass ? 0 : 1;
