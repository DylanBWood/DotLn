import {
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./temporary-roots.mjs";
import { execGit } from "./git.mjs";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { TOOL_ROOT } from "./config.mjs";

const paths = (...args) =>
  execGit(["-C", TOOL_ROOT, ...args], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean);

/** A shared clone carrying the working tree's bytes, the built packages and
 * the installed dependencies, so its edition scripts check what the gate
 * checks. Sources stay real files: the feedback audit refuses a symlink.
 * With `workspace`, @dotln resolves to the copy's own packages, so a build
 * in the copy is the compiler every replay loads (WO-154 VER-001). */
export function editionCopy(t, { workspace = false } = {}) {
  const parent = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-evidence-sources-")),
  );
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const copy = join(parent, "repository");
  execGit([
    "-c",
    "maintenance.auto=false",
    "clone",
    "--quiet",
    "--shared",
    TOOL_ROOT,
    copy,
  ]);
  for (const path of [
    ...paths("diff", "-z", "--name-only", "HEAD"),
    ...paths("ls-files", "-z", "--others", "--exclude-standard"),
  ]) {
    const target = join(copy, path);
    if (existsSync(join(TOOL_ROOT, path))) {
      mkdirSync(dirname(target), { recursive: true });
      cpSync(join(TOOL_ROOT, path), target);
      // Fresh audit references may name uncommitted source bytes. Preserve
      // them in this fixture's object database before a case mutates the file.
      execGit(["-C", copy, "hash-object", "-w", "--", path]);
    } else rmSync(target, { force: true });
  }
  for (const name of ["kernel", "compiler", "skeleton", "console"])
    cpSync(
      join(TOOL_ROOT, "packages", name, "dist"),
      join(copy, "packages", name, "dist"),
      { recursive: true },
    );
  if (workspace) {
    mkdirSync(join(copy, "node_modules/@dotln"), { recursive: true });
    for (const name of readdirSync(join(TOOL_ROOT, "node_modules")))
      if (name !== "@dotln")
        symlinkSync(
          join(TOOL_ROOT, "node_modules", name),
          join(copy, "node_modules", name),
        );
    for (const name of readdirSync(join(TOOL_ROOT, "node_modules/@dotln")))
      symlinkSync(
        join(copy, "packages", name),
        join(copy, "node_modules/@dotln", name),
      );
  } else
    symlinkSync(join(TOOL_ROOT, "node_modules"), join(copy, "node_modules"));
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => !["DOTLN_LAUNCHPAD", "NODE_TEST_CONTEXT"].includes(key),
    ),
  );
  const run = (...args) =>
    spawnSync(process.execPath, ["scripts/feedback-evidence.mjs", ...args], {
      cwd: copy,
      encoding: "utf8",
      env,
    });
  const check = () => run("--check");
  const restore = (path) =>
    writeFileSync(join(copy, path), readFileSync(join(TOOL_ROOT, path)));
  return { copy, env, check, run, restore };
}
