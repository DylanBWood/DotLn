// FINAL-001 probes. Each reuses the target-worktree suite's fixture helpers
// (local bare remotes, mocked gh) through a generated copy in system temp, as
// the VER-002 probes do; the implementation is not edited and nothing reaches
// a real service.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const mode = process.argv[2];
const modes = ["base-large-ignored-tree"];
if (!modes.includes(mode))
  throw new Error(`Specify one of: ${modes.join(", ")}`);
let source = readFileSync(
  join(root, "scripts/test-target-worktree.mjs"),
  "utf8",
);
const cut = source.indexOf('test("target release preparation');
if (cut < 0) throw new Error("fixture helper boundary missing");
source = source
  .slice(0, cut)
  .replace(
    'import test from "node:test";',
    `const test = (name, run) => { if (name !== ${JSON.stringify(mode)}) return; const start = Date.now(); try { run(); console.log(JSON.stringify({ probe: name, outcome: "passed", durationMs: Date.now() - start })); } catch (error) { console.log(JSON.stringify({ probe: name, outcome: "failed", error: error.message, durationMs: Date.now() - start })); process.exitCode = 1; } };`,
  )
  .replace(
    /from "(\.[^"]+)"/g,
    (_, file) =>
      `from ${JSON.stringify(pathToFileURL(resolve(root, "scripts", file)).href)}`,
  );
source += String.raw`
const observe = (row) => console.log(JSON.stringify(row));
const ignoreLocalSettings = (f) =>
  write(
    f.main,
    ".gitignore",
    readFileSync(join(f.main, ".gitignore"), "utf8") +
      "/.claude/settings.local.json\n",
  );
// Bring the fixture order to a merged, closed state ready for release close.
const closable = (f) => {
  publicationSetup(f);
  ignoreLocalSettings(f);
  write(f.main, "dotln.config.json", JSON.stringify(f.config));
  git(f.main, "add", "-A");
  git(f.main, "commit", "-qm", "test: probe registration");
  git(f.main, "push", "-q", "origin", "main");
  f.mapClone();
  f.start();
  write(f.target, "change.txt", "changed\n");
  git(f.target, "add", "-A");
  git(f.target, "commit", "-qm", "Target change");
  closeOrder(f);
  git(f.orderRoot, "add", "-A");
  git(f.orderRoot, "commit", "-qm", "Closed target order");
  git(f.main, "merge", "-q", "--no-ff", "-m", "Merge target order records", "wo-999");
  git(f.main, "push", "-q", "origin", "main");
  git(f.clone, "merge", "-q", "--no-ff", "-m", "Merge target change", "wo-999");
  git(f.clone, "push", "-q", join(f.base, "target.git"), "main:main");
};

// A populated ignored tree in the clone's base checkout, declared disposable:
// Design C says the close deletes it. Twenty thousand files whose paths
// exceed one mebibyte stand for an installed node_modules.
test("base-large-ignored-tree", () =>
  withFixture(
    (f) => {
      f.config.classes.fixture.disposable = ["node_modules"];
      closable(f);
      let pathBytes = 0;
      let files = 0;
      for (let pkg = 0; pkg < 400; pkg += 1) {
        const directory = "node_modules/@scope/package-" + String(pkg).padStart(4, "0") + "/dist/esm/components";
        for (let index = 0; index < 50; index += 1) {
          const file = directory + "/widget-" + String(index).padStart(3, "0") + ".js";
          write(f.clone, file, "export {};\n");
          pathBytes += file.length + 1;
          files += 1;
        }
      }
      const ignoredBefore = git(
        f.clone,
        "check-ignore",
        "node_modules/@scope/package-0000/dist/esm/components/widget-000.js",
      );
      const baseBefore = git(f.clone, "rev-parse", "HEAD");
      const closed = f.close("--publish");
      observe({
        probe: "base-large-ignored-tree",
        files,
        ignoredPathBytes: pathBytes,
        ignoredBefore: Boolean(ignoredBefore),
        exit: closed.status,
        stderr: closed.stderr.replace(/\/[^\s']*dotln-target-worktree-[^\s']*/g, "<tmp>").slice(0, 500),
        baseNodeModulesRemains: existsSync(join(f.clone, "node_modules")),
        baseMoved: git(f.clone, "rev-parse", "HEAD") !== baseBefore,
        targetExists: existsSync(f.target),
      });
      assert.equal(closed.status, 0, closed.stderr);
      assert.equal(existsSync(join(f.clone, "node_modules")), false);
    },
    { baseIgnore: "node_modules/\n" },
  ));
`;
const scratch = mkdtempSync(join(tmpdir(), "dotln-wo221-final001-"));
const file = join(scratch, `${mode}.mjs`);
writeFileSync(file, source);
try {
  await import(pathToFileURL(file).href);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
