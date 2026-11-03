// WO-241 VER-001, criterion 1's rename clause and follow-ups D014: copies of
// the candidate's loader with one injected tombstone, accepted at the current
// skeleton version (copy "current") or at another (copy "other"). It reports
// the loader's advisory and refusal, whether the inventory agrees with the
// loader for the old id, and the skeleton version at the newest release tags.
// Arguments: the worktree root and an empty scratch directory.
import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const [worktree, scratch] = process.argv.slice(2);
const skeleton = JSON.parse(
  readFileSync(join(worktree, "packages/skeleton/package.json"), "utf8"),
).version;
const anchor = "export const featureAliases = Object.freeze({});";
const copy = (name, release) => {
  const root = join(scratch, `rename-${name}`);
  mkdirSync(join(root, "scripts/lib"), { recursive: true });
  mkdirSync(join(root, "packages/skeleton/src"), { recursive: true });
  for (const lib of [
    "config",
    "features",
    "build-overlay",
    "validation",
    "paths",
    "git",
    "temporary-roots",
  ])
    cpSync(
      join(worktree, `scripts/lib/${lib}.mjs`),
      join(root, `scripts/lib/${lib}.mjs`),
    );
  cpSync(
    join(worktree, "packages/skeleton/src/temporary-root-records.mjs"),
    join(root, "packages/skeleton/src/temporary-root-records.mjs"),
  );
  cpSync(
    join(worktree, "packages/skeleton/package.json"),
    join(root, "packages/skeleton/package.json"),
  );
  const path = join(root, "scripts/lib/features.mjs");
  const text = readFileSync(path, "utf8");
  if (!text.includes(anchor))
    throw new Error("the alias table anchor moved; update this probe");
  writeFileSync(
    path,
    text.replace(
      anchor,
      `export const featureAliases = Object.freeze({ "old-economy": { successor: "tinkerer-economy", release: ${JSON.stringify(release)} } });`,
    ),
  );
  return root;
};
const warnings = [];
console.warn = (message) => warnings.push(String(message));
const fixture = mkdtempSync(join(scratch, "rename-fixture-"));
writeFileSync(
  join(fixture, "dotln.config.json"),
  JSON.stringify({ version: 1, features: { "old-economy": false } }),
);
for (const [name, release] of [
  ["current", skeleton],
  ["other", "0.0.0-retired"],
]) {
  const root = copy(name, release);
  const config = await import(join(root, "scripts/lib/config.mjs"));
  const features = await import(join(root, "scripts/lib/features.mjs"));
  warnings.length = 0;
  try {
    const loaded = config.loadConfig(fixture).features;
    const row = features
      .readFeatureInventory(fixture)
      .find((entry) => entry.id === "tinkerer-economy");
    console.log(
      `tombstone at ${release}: loads ${JSON.stringify(loaded)}; advisory ${JSON.stringify(warnings[0] ?? null)}`,
    );
    console.log(
      `  readFeatures tinkerer-economy ${features.readFeatures(fixture)["tinkerer-economy"]}; inventory row value ${JSON.stringify(row.value)}, source ${row.source}`,
    );
  } catch (error) {
    console.log(
      `tombstone at ${release}: refuses ${JSON.stringify(error.message.replace(/^.*dotln\.config\.json: /u, ""))}`,
    );
  }
  if (release !== skeleton) continue;
  // The old and the new id together name one election twice.
  writeFileSync(
    join(fixture, "dotln.config.json"),
    JSON.stringify({
      version: 1,
      features: { "old-economy": false, "tinkerer-economy": false },
    }),
  );
  try {
    config.loadConfig(fixture);
    console.log("old and new id together: loads");
  } catch (error) {
    console.log(
      `old and new id together: refuses ${JSON.stringify(error.message.replace(/^.*dotln\.config\.json: /u, ""))}`,
    );
  }
  writeFileSync(
    join(fixture, "dotln.config.json"),
    JSON.stringify({ version: 1, features: { "old-economy": false } }),
  );
}
const git = (...args) =>
  execFileSync("git", ["-C", worktree, ...args])
    .toString()
    .trim();
for (const tag of git("tag", "--sort=-creatordate").split("\n").slice(0, 3))
  console.log(
    `release tag ${tag}: skeleton ${JSON.parse(git("show", `${tag}:packages/skeleton/package.json`)).version}`,
  );
console.log(`candidate (prepares the next release): skeleton ${skeleton}`);
rmSync(fixture, { recursive: true, force: true });
