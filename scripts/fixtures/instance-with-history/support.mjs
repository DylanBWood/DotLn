import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { TOOL_ROOT, defaultDocRelative } from "../../lib/config.mjs";
import {
  KIT_FILES,
  TEST_FIXTURE_TREES,
  TEST_SUPPORT_FILES,
} from "../../launchpad.mjs";

export const fixtureEnvironment = () => {
  const env = {
    ...process.env,
    npm_config_offline: "true",
    npm_config_update_notifier: "false",
  };
  for (const key of [
    "CODEX_THREAD_ID",
    "COPILOT_AGENT_SESSION_ID",
    "COPILOT_PROJECT_DIR",
    "CLAUDE_CODE_SESSION_ID",
    "CLAUDE_SESSION_ID",
    "CLAUDE_EFFORT",
    "DOTLN_LAUNCHPAD",
    "DOTLN_ACCOUNT_LABEL",
    "DOTLN_BEACON_KEY_FILE",
    "GIT_DIR",
    "GIT_WORK_TREE",
    "GIT_INDEX_FILE",
    "GIT_COMMON_DIR",
    "GIT_PREFIX",
  ])
    delete env[key];
  return env;
};
export const write = (root, path, value) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(
    join(root, path),
    typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`,
  );
};
export const json = (root, path) =>
  JSON.parse(readFileSync(join(root, path), "utf8"));
export const runner = (env = fixtureEnvironment()) => {
  const run = (cwd, command, args) =>
    spawnSync(command, args, {
      cwd,
      env,
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
  const ok = (result, label) => {
    assert.equal(
      result.status,
      0,
      `${label}: ${result.error?.message ?? ""}\n${result.stdout}\n${result.stderr}`,
    );
    return result.stdout;
  };
  const git = (cwd, ...args) =>
    ok(run(cwd, "git", args), `git ${args.join(" ")}`).trim();
  const node = (root, script, ...args) =>
    ok(
      run(root, process.execPath, [`scripts/${script}.mjs`, ...args]),
      `${script} ${args.join(" ")}`,
    );
  const configure = (root) => {
    for (const [key, value] of [
      ["user.name", "History Fixture"],
      ["user.email", "fixture@example.invalid"],
      ["maintenance.auto", "false"],
      ["commit.gpgsign", "false"],
    ])
      git(root, "config", key, value);
  };
  const init = (root) => {
    mkdirSync(root, { recursive: true });
    git(root, "init", "-q", "-b", "main");
    configure(root);
  };
  const commit = (root, message) => {
    git(root, "add", ".");
    git(
      root,
      "-c",
      "maintenance.auto=false",
      "commit",
      "--allow-empty",
      "--signoff",
      "-qm",
      message,
    );
    return git(root, "rev-parse", "HEAD");
  };
  return { run, ok, git, node, configure, init, commit };
};

// Build/export the current bytes from a committed scratch copy. The real
// worktree stays uncommitted, and package imports resolve to this copy.
export function copyCore(root, commands, source = TOOL_ROOT) {
  commands.init(root);
  const copy = (path) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    cpSync(join(source, path), join(root, path), {
      recursive: true,
      filter: (file) =>
        !file.endsWith("/instance-with-history/instance.bundle"),
    });
  };
  for (const path of new Set([
    "scripts",
    "packages/beacons",
    ...TEST_FIXTURE_TREES,
    ...TEST_SUPPORT_FILES,
    ...KIT_FILES.files,
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "LICENSE",
    "LICENSE-docs",
    "NOTICE",
    ".gitignore",
    ".prettierignore",
    ".prettierrc.json",
    defaultDocRelative("docs", "LEGAL.md"),
    ...KIT_FILES.documents.map(([root, ...parts]) =>
      defaultDocRelative(root, ...parts),
    ),
  ]))
    copy(path);
  for (const { path } of json(source, "tsconfig.json").references)
    for (const entry of ["package.json", "tsconfig.json", "src", "test"])
      if (existsSync(join(source, path, entry))) copy(`${path}/${entry}`);
  commands.git(
    root,
    "remote",
    "add",
    "origin",
    "https://example.invalid/fixture/core.git",
  );
  commands.commit(root, "test: current kit source");
  linkDependencies(root, source);
}

export function linkDependencies(root, source = TOOL_ROOT) {
  mkdirSync(join(root, "node_modules/@dotln"), { recursive: true });
  if (!existsSync(join(root, "node_modules/.bin")))
    symlinkSync(
      join(source, "node_modules/.bin"),
      join(root, "node_modules/.bin"),
    );
  for (const entry of readdirSync(join(source, "node_modules")))
    if (
      ![".bin", "@dotln"].includes(entry) &&
      !existsSync(join(root, "node_modules", entry))
    )
      symlinkSync(
        join(source, "node_modules", entry),
        join(root, "node_modules", entry),
      );
  for (const name of readdirSync(join(root, "packages")))
    if (
      existsSync(join(root, "packages", name, "package.json")) &&
      !existsSync(join(root, "node_modules/@dotln", name))
    )
      symlinkSync(
        `../../packages/${name}`,
        join(root, "node_modules/@dotln", name),
      );
}
