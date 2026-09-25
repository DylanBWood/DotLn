#!/usr/bin/env node
// Run immediately before filing the human away edge; local physical paths stay ignored.
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TOOL_ROOT } from "../../../scripts/lib/config.mjs";
import { checkoutSnapshot, treeDigest } from "../WO-053/fixture.mjs";

const location = JSON.parse(
  readFileSync(
    join(
      TOOL_ROOT,
      `docs/control/local/wo111/${process.argv.includes("--return-proof") ? "return-location" : "location"}.json`,
    ),
    "utf8",
  ),
);
const worktrees = execFileSync("git", ["worktree", "list", "--porcelain"], {
  cwd: TOOL_ROOT,
  encoding: "utf8",
});
const main = worktrees
  .split("\n\n")
  .map((block) => ({
    path: /^worktree (.+)$/m.exec(block)?.[1],
    branch: /^branch (.+)$/m.exec(block)?.[1],
  }))
  .find((item) => item.branch === "refs/heads/main")?.path;
if (!main) throw new Error("no main worktree is registered");
const checks = Object.fromEntries(
  (process.argv.includes("--return-proof")
    ? ["lint", "test", "move", "standard"]
    : ["lint", "test", "move"]
  ).map((name) => [
    name,
    spawnSync(process.execPath, [`checks/${name}.cjs`], {
      cwd: location.target,
      stdio: "ignore",
    }).status,
  ]),
);
const baseline = {
  observedAt: Date.now(),
  main: checkoutSnapshot(main),
  selected: checkoutSnapshot(TOOL_ROOT),
  target: checkoutSnapshot(location.target),
  sentinel: treeDigest(join(location.root, "trees", "sentinel")),
  checks,
};
writeFileSync(
  join(location.root, "window-baseline.json"),
  `${JSON.stringify(baseline, null, 2)}\n`,
  { flag: "wx", mode: 0o600 },
);
console.log(
  JSON.stringify({
    baselineRecorded: true,
    checks,
    targetMainMatchesSeed: baseline.target.head === location.baseCommit,
  }),
);
