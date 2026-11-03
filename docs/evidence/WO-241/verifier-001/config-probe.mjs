// WO-241 VER-001, criterion 1: the candidate's configuration loader against
// the base's for configurations the base admits, then every named election
// form, invalid value, unknown id and existing-key id. Arguments: the
// worktree root and an empty scratch directory. Writes only under scratch.
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const [worktree, scratch] = process.argv.slice(2);
const git = (...args) => execFileSync("git", ["-C", worktree, ...args]);
const base = git("merge-base", "main", "HEAD").toString().trim();
const baseLib = join(scratch, "base-lib");
mkdirSync(join(baseLib, "scripts/lib"), { recursive: true });
for (const name of ["config.mjs", "validation.mjs"])
  writeFileSync(
    join(baseLib, "scripts/lib", name),
    git("show", `${base}:scripts/lib/${name}`),
  );
const baseExample = JSON.parse(
  git("show", `${base}:scripts/kit/dotln.config.example.json`).toString(),
);
const candidate = await import(join(worktree, "scripts/lib/config.mjs"));
const previous = await import(join(baseLib, "scripts/lib/config.mjs"));
const features = await import(join(worktree, "scripts/lib/features.mjs"));
const root = mkdtempSync(join(scratch, "config-"));
const file = join(root, "dotln.config.json");
const put = (value) =>
  writeFileSync(
    file,
    typeof value === "string" ? value : JSON.stringify(value),
  );
const load = (lib) => {
  try {
    return { ok: true, value: lib.loadConfig(root) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};
let unexpected = 0;
const report = (ok, line) => {
  if (!ok) unexpected += 1;
  console.log(`${ok ? "ok" : "UNEXPECTED"} ${line}`);
};
console.log(`base ${base}`);
const admitted = {
  absent: null,
  "version only": { version: 1 },
  "base kit example": baseExample,
  "core dotln.config.json": JSON.parse(
    readFileSync(join(worktree, "dotln.config.json"), "utf8"),
  ),
  "roots, release, kit, drive, derivedOrders": {
    version: 1,
    roots: { docs: "records" },
    release: { readmeBlock: false, corpus: false },
    kit: { applyInstanceActions: true },
    drive: { sandbox: "off" },
    derivedOrders: { first: "WO-900", last: "WO-950" },
  },
  "desktop-control true": { version: 1, features: { "desktop-control": true } },
  "desktop-control with note": {
    version: 1,
    features: { "desktop-control": { on: true, note: "why" } },
  },
  "empty features": { version: 1, features: {} },
};
for (const [name, value] of Object.entries(admitted)) {
  rmSync(file, { force: true });
  if (value !== null) put(value);
  report(
    JSON.stringify(load(previous)) === JSON.stringify(load(candidate)),
    `loads as the base does: ${name}`,
  );
}
rmSync(file, { force: true });
const named = features.featureRegistry.filter(
  (row) => row.readFrom === `features.${row.id}`,
);
report(
  JSON.stringify(features.readFeatures(root)) ===
    JSON.stringify(
      Object.fromEntries(named.map((row) => [row.id, row.default])),
    ),
  `absent file reads every named election at its default: ${JSON.stringify(features.readFeatures(root))}`,
);
for (const { id } of named)
  for (const value of [
    true,
    false,
    { on: false, note: "n" },
    { on: true },
    { on: true, note: "" },
  ]) {
    put({ version: 1, features: { [id]: value } });
    const result = load(candidate);
    const read = result.ok ? features.readFeatures(root)[id] : result.error;
    report(
      read === (typeof value === "boolean" ? value : value.on),
      `features.${id} = ${JSON.stringify(value)} reads ${JSON.stringify(read)}`,
    );
  }
for (const { id } of named)
  for (const [value, key] of [
    [{ on: "false" }, ".on"],
    [{ on: 1 }, ".on"],
    [{ on: null }, ".on"],
    [{ note: "x" }, ".on"],
    [{ on: true, note: 42 }, ".note"],
    [{ on: true, note: null }, ".note"],
    [{ on: true, note: ["a"] }, ".note"],
    [{ on: true, extra: 1 }, ""],
    [null, ""],
    ["true", ""],
    [0, ""],
    [[], ""],
  ]) {
    put({ version: 1, features: { [id]: value } });
    const result = load(candidate);
    report(
      !result.ok && result.error.includes(`features.${id}${key}`),
      `features.${id} = ${JSON.stringify(value)} refuses naming features.${id}${key}`,
    );
  }
for (const id of [
  "misspelled",
  "Tinkerer-Economy",
  "tinkerer_economy",
  "",
  "__proto__",
  "constructor",
  "toString",
  "features.plan-first",
]) {
  put(`{"version":1,"features":{${JSON.stringify(id)}:true}}`);
  const result = load(candidate);
  report(
    !result.ok &&
      result.error.includes(JSON.stringify(id)) &&
      result.error.includes("npm run features -- list"),
    `unknown id ${JSON.stringify(id)} refuses naming it and npm run features -- list`,
  );
}
for (const row of features.featureRegistry.filter(
  (entry) => entry.readFrom !== `features.${entry.id}`,
)) {
  put({ version: 1, features: { [row.id]: false } });
  const result = load(candidate);
  report(
    !result.ok && result.error.includes(row.readFrom),
    `features.${row.id} refuses naming ${row.readFrom}`,
  );
}
rmSync(root, { recursive: true, force: true });
console.log(`unexpected: ${unexpected}`);
process.exitCode = unexpected ? 1 : 0;
