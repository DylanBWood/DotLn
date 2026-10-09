import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from "node:fs";
import { join } from "node:path";
// Run from the repository root; a temporary base directory is the first argument where one is read.
const repo = process.cwd();
const { gateTreeHash } = await import(`${repo}/scripts/lib/gate-evidence.mjs`);
const { inventoryMaterial } = await import(
  `${repo}/scripts/lib/worktree-material.mjs`
);
const root = realpathSync(mkdtempSync(join(process.argv[2], "gt-")));
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
writeFileSync(join(root, "a.txt"), "a\n");
g(root, "add", ".");
g(root, "commit", "-qm", "base");
const nested = join(root, "outside-lanes/probe");
mkdirSync(nested, { recursive: true });
g(nested, "init", "-q");
writeFileSync(join(nested, "f.txt"), "x\n");
g(nested, "add", ".");
g(nested, "commit", "-qm", "c");
console.log(
  "inventory:",
  JSON.stringify(inventoryMaterial(root).map((r) => [r.path, r.disposition])),
);
try {
  gateTreeHash(root);
  console.log("gateTreeHash ok");
} catch (e) {
  console.log("gateTreeHash throws:", e.message);
}
