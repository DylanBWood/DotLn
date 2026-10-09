import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync, realpathSync } from "node:fs";
import { join } from "node:path";
// Run from the repository root; a temporary base directory is the first argument where one is read.
const repo = process.cwd();
const { inventoryMaterial, materialCloseCommand, parseMaterialFlags } =
  await import(`${repo}/scripts/lib/worktree-material.mjs`);
const base = process.argv[2];
const root = realpathSync(mkdtempSync(join(base, "wt-")));
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
g(root, "init", "-q");
writeFileSync(
  join(root, ".gitignore"),
  "docs/intake/*\n!docs/intake/.gitkeep\nscratch/\n",
);
g(root, "add", ".gitignore");
g(root, "commit", "-qm", "base");
for (const p of ["docs/intake/x", "scratch/y"]) {
  const d = join(root, p);
  mkdirSync(d, { recursive: true });
  g(d, "init", "-q");
  writeFileSync(join(d, "f.txt"), "x\n");
  g(d, "add", "f.txt");
  g(d, "commit", "-qm", "c");
}
const rows = inventoryMaterial(root);
console.log(
  "inventory:",
  JSON.stringify(rows.map((r) => [r.path, r.lane, r.disposition])),
);
// release.mjs finishPublishedWorktree: kept = every material row of a retained worktree
const kept = rows.map((row) => ({ path: row.path, worktree: root }));
const disposable = materialCloseCommand("/main", "WO-099", kept, "disposable");
console.log("disposableCommand:", disposable);
const values = [...disposable.matchAll(/--material '([^']*)'/g)].map(
  (m) => m[1],
);
const parsed = parseMaterialFlags(
  values.flatMap((v) => ["--material", v]),
  ["--publish"],
);
try {
  inventoryMaterial(root, {
    overrides: parsed.material,
    overrideWorktree: null,
  });
  console.log("retry inventory: accepted");
} catch (error) {
  console.log("retry inventory refuses:", error.message);
}
