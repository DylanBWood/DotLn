import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
// Run from the repository root; a temporary base directory is the first argument where one is read.
const repo = process.cwd();
const { inventoryMaterial } = await import(
  `${repo}/scripts/lib/worktree-material.mjs`
);
const { describeIgnoredMaterial } = await import(
  `${repo}/scripts/lib/paths.mjs`
);
const { reconcileWorktreeMaterial } = await import(
  `${repo}/scripts/lib/intake-reconciliation.mjs`
);
const base = realpathSync(mkdtempSync(join(process.argv[2], "lw-")));
const main = join(base, "main");
const g = (cwd, ...args) =>
  execFileSync(
    "git",
    [
      "-C",
      cwd,
      "-c",
      "user.name=F",
      "-c",
      "user.email=f@example.invalid",
      ...args,
    ],
    { encoding: "utf8" },
  );
mkdirSync(main);
g(main, "init", "-q", "-b", "main");
writeFileSync(
  join(main, ".gitignore"),
  ".runtime/\ndocs/control/local/\ndocs/intake/\n",
);
writeFileSync(join(main, "CLAUDE.md"), "floor\n");
symlinkSync("CLAUDE.md", join(main, "AGENTS.md"));
g(main, "add", ".");
g(main, "commit", "-qm", "base");
const subject = join(base, "project-wo099");
g(main, "worktree", "add", "-q", "-b", "wo-099", subject);
// A worktree of the same repository created inside the subject, as a probe might.
g(
  main,
  "worktree",
  "add",
  "-q",
  "--detach",
  join(subject, ".runtime/probe-wt"),
);
console.log(
  "row:",
  JSON.stringify(describeIgnoredMaterial(subject, ".runtime/probe-wt/")),
);
const material = inventoryMaterial(subject);
console.log(
  "inventory:",
  JSON.stringify(material.map((r) => [r.path, r.disposition])),
);
try {
  reconcileWorktreeMaterial(subject, main, "WO-099", {
    dryRun: true,
    material,
  });
  console.log("preview: accepted");
} catch (error) {
  console.log("preview refuses:", error.message);
}
