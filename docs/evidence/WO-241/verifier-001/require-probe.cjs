// WO-241 VER-001: the desktop-control hook's route to the election
// (packages/skeleton/src/harness-host.ts requires scripts/lib/config.mjs),
// now that config.mjs and features.mjs import each other. Arguments: the
// worktree root and an empty scratch directory.
const { createRequire } = require("node:module");
const { mkdtempSync, rmSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const [worktree, scratch] = process.argv.slice(2);
const root = mkdtempSync(join(scratch, "require-"));
for (const value of [undefined, true, { on: true, note: "x" }, false]) {
  if (value === undefined)
    rmSync(join(root, "dotln.config.json"), { force: true });
  else
    writeFileSync(
      join(root, "dotln.config.json"),
      JSON.stringify({ version: 1, features: { "desktop-control": value } }),
    );
  const { readFeatures } = createRequire(__filename)(
    join(worktree, "scripts/lib/config.mjs"),
  );
  console.log(
    `desktop-control ${JSON.stringify(value)} reads ${readFeatures(root)["desktop-control"]}`,
  );
}
rmSync(root, { recursive: true, force: true });
