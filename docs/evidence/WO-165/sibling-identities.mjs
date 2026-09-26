import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { stripTypeScriptTypes } from "node:module";

// Compare complete current compilations with the entry source, using the same
// installed compiler and unchanged request protocols on both sides.
const root = fileURLToPath(new URL("../../../", import.meta.url));
const inputs = JSON.parse(
  readFileSync(new URL("sibling-identities.json", import.meta.url)),
);
const scratch = mkdtempSync(join(tmpdir(), "dotln-wo165-identities-"));
const source = (path) =>
  execFileSync("git", ["show", `${inputs.sourceRevision}:${path}`], {
    cwd: root,
    encoding: "utf8",
  });
const runtime = (path) =>
  pathToFileURL(join(root, "packages/skeleton/dist/src", path)).href;
try {
  for (const name of ["entropy-reducer", "plan-refuter", "mission-check"]) {
    const path = `packages/skeleton/src/loadouts/${name}.ts`;
    let compiled = stripTypeScriptTypes(source(path));
    for (const specifier of ["@dotln/compiler", "@dotln/kernel"])
      compiled = compiled.replaceAll(
        JSON.stringify(specifier),
        JSON.stringify(import.meta.resolve(specifier)),
      );
    compiled = compiled.replaceAll(
      '"./entropy-reducer.js"',
      '"./entropy-reducer.mjs"',
    );
    for (const name of ["plan-refutation-protocol", "mission-check-protocol"]) {
      const path = `packages/skeleton/src/${name}.ts`;
      assert.equal(
        readFileSync(join(root, path), "utf8"),
        source(path),
        `${name} unchanged`,
      );
      compiled = compiled.replaceAll(
        JSON.stringify(`../${name}.js`),
        JSON.stringify(runtime(`${name}.js`)),
      );
    }
    writeFileSync(join(scratch, `${name}.mjs`), compiled);
  }
  const identities = {};
  for (const [name, entry] of [
    ["plan-refuter", "compilePlanRefuter"],
    ["mission-check", "compileMissionCheck"],
  ]) {
    const old = await import(pathToFileURL(join(scratch, `${name}.mjs`)));
    const current = await import(runtime(`loadouts/${name}.js`));
    const before = old[entry](inputs.revision, inputs.dispatchedAt);
    const after = current[entry](inputs.revision, inputs.dispatchedAt);
    assert.deepEqual(after, before, `${name} complete compilation unchanged`);
    identities[name] = {
      before: before.semanticHash,
      after: after.semanticHash,
    };
  }
  console.log(JSON.stringify({ ...inputs, identities }, null, 2));
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
