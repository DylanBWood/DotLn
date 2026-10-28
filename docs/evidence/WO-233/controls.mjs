// Reuse the integration suite's bounded fixture builder without executing its
// tests. Each arm has its own local bare remote and disposable worktrees.
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import {
  createFixtureRoot,
  removeTemporaryPath,
} from "../../../scripts/lib/temporary-roots.mjs";

const root = resolve(import.meta.dirname, "../../..");
const scratch = createFixtureRoot(join(tmpdir(), "dotln-cleanup-controls-"));
const base = "bca92e77d03880ec57a83d37eebb85a3a8f7ab76";
try {
  let source = readFileSync(
    join(root, "scripts/test-worktree-integration.mjs"),
    "utf8",
  );
  const first = source.indexOf("const test = (name, fn) => {");
  const end = source.indexOf("\nconst source =", first);
  source =
    source.slice(0, first) +
    "const test = (name) => unregisteredCaseBounds.delete(name);\n" +
    source.slice(end);
  source = source.replace(
    'const source = resolve(dirname(fileURLToPath(import.meta.url)), "..");',
    `const source = ${JSON.stringify(root)};`,
  );
  source = source.replace(
    /(from\s+|import\()"(\.\.?\/[^"\n]+)"/gu,
    (_all, before, specifier) =>
      `${before}${JSON.stringify(pathToFileURL(resolve(root, "scripts", specifier)).href)}`,
  );
  source += `
const controls = [];
for (const active of [false, true]) for (const arm of ["base", "changed"]) {
  const cleanup = [];
  const f = fixture({ after(fn) { cleanup.push(fn); } }, { generators: "focused", authored: false, active });
  try {
    if (arm === "base") put(f.subject, "scripts/lib/worktree-integration.mjs", runGit(source, ["show", "${base}:scripts/lib/worktree-integration.mjs"]));
    const before = runGit(f.subject, ["stash", "list", "--format=%H"]);
    let result;
    if (active && arm === "changed") {
      for (const name of ["kernel", "compiler", "skeleton", "console"])
        cpSync(join(source, "packages", name, "dist"), join(f.main, "packages", name, "dist"), { recursive: true });
      linkDependencies(f.main);
      const program = "const {integrateWorktree}=await import(" + JSON.stringify("file://" + join(f.main, "scripts/lib/worktree-integration.mjs")) + "); await integrateWorktree(process.cwd(), 'WO-998');";
      result = run(f.main, process.execPath, ["--input-type=module", "-e", program]);
    } else result = run(f.subject, process.execPath, ["scripts/worktree.mjs", "integrate", "WO-998"]);
    const after = runGit(f.subject, ["stash", "list", "--format=%H"]);
    const receiptPath = join(f.subject, "docs/control/local/integration.json");
    const receipt = existsSync(receiptPath) ? JSON.parse(readFileSync(receiptPath, "utf8")) : null;
    const count = (value) => value ? value.split("\\n").length : 0;
    const row = { scenario: active ? "active-current-main" : "completed-stash", arm, exitCode: result.status,
      stashBefore: count(before), stashAfter: count(after), complete: receipt?.complete ?? false,
      stashDropped: Boolean(receipt?.stashDropped && receipt.stashDropped === receipt.stash),
      upstreamFile: text(f.subject, "authored-fixture.md"), output: result.stdout + result.stderr };
    controls.push(row);
    console.log(JSON.stringify(row));
  } finally { for (const fn of cleanup.reverse()) fn(); }
}
writeFileSync(${JSON.stringify(join(root, "docs/evidence/WO-233/controls.json"))}, JSON.stringify({ base: "${base}", observedAt: new Date().toISOString(), arms: controls }, null, 2) + "\\n");
assert.equal(controls[0].exitCode, 0);
assert.equal(controls[0].stashAfter - controls[0].stashBefore, 1);
assert.equal(controls[1].exitCode, 0);
assert.equal(controls[1].stashAfter, controls[1].stashBefore);
assert.equal(controls[1].stashDropped, true);
assert.equal(controls[2].exitCode, 1);
assert.match(controls[2].output, /integrate requires the selected order in repairing or final-review/);
assert.equal(controls[3].exitCode, 0);
assert.equal(controls[3].upstreamFile, "upstream intent\\n");
`;
  const file = join(scratch, "controls.mjs");
  writeFileSync(file, source);
  const result = spawnSync(process.execPath, [file], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  process.stdout.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  process.exitCode = result.status ?? 1;
} finally {
  removeTemporaryPath(scratch, { recursive: true, force: true });
}
