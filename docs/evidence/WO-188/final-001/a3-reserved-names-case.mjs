import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
// Run from the repository root; a temporary base directory is the first argument where one is read.
const repo = process.cwd();
const { main } = await import(`${repo}/scripts/refute-plan.mjs`);
const root = realpathSync(mkdtempSync(join(process.argv[2], "feed-")));
const g = (...args) =>
  execFileSync(
    "git",
    [
      "-C",
      root,
      "-c",
      "user.name=F",
      "-c",
      "user.email=f@example.invalid",
      ...args,
    ],
    { encoding: "utf8" },
  );
g("init", "-q", "-b", "wo-999");
writeFileSync(join(root, ".gitignore"), "docs/control/local/\n");
writeFileSync(join(root, "own.txt"), "x\n");
g("add", ".");
g("commit", "-qm", "base");
mkdirSync(join(root, "docs/control/local"), { recursive: true });
for (const name of [
  "docs/control/local/terms.txt",
  "docs/control/local/Terms.txt",
  "docs/control/local/HARNESS/x.json",
]) {
  try {
    const result = await main(["followups", "--export", name], root);
    console.log(`${name}: exported to ${result.path}`);
  } catch (error) {
    console.log(`${name}: refused: ${error.message}`);
  }
}
const lower = join(root, "docs/control/local/terms.txt");
console.log(
  "terms.txt now exists:",
  existsSync(lower),
  existsSync(lower)
    ? readFileSync(lower, "utf8").slice(0, 60).replace(/\n/g, " ")
    : "",
);
