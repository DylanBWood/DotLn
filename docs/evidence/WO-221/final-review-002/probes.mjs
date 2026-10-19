// FINAL-002 probes. Each reuses the target-worktree suite's fixture helpers
// (local bare remotes, mocked gh) through a generated copy in system temp, as
// the earlier probes do; the implementation is not edited and nothing reaches
// a real service. A probe asserts the required or safe behavior, so an exit 1
// is a reproduced defect, not a passing check.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const mode = process.argv[2];
const modes = [
  "base-nested-env",
  "base-nested-env-remedy-followed",
  "target-nested-env",
  "refused-close-claims-deletion",
];
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
    `const test = (name, run) => { if (name !== ${JSON.stringify(mode)}) return; const start = Date.now(); try { run(); console.log(JSON.stringify({ probe: name, outcome: "passed", durationMs: Date.now() - start })); } catch (error) { console.log(JSON.stringify({ probe: name, outcome: "failed", error: error.message.slice(0, 2000), durationMs: Date.now() - start })); process.exitCode = 1; } };`,
  )
  .replace(
    /from "(\.[^"]+)"/g,
    (_, file) =>
      `from ${JSON.stringify(pathToFileURL(resolve(root, "scripts", file)).href)}`,
  );

// The cases run inside the generated copy, where the suite's helpers
// (withFixture, publicationSetup, closeOrder, git, write and the fs imports)
// are in scope; this module only serializes them.
const cases = () => {
  const observe = (row) => console.log(JSON.stringify(row));
  const redact = (f, text) =>
    String(text)
      .split(process.execPath)
      .join("<node>")
      .split(f.base)
      .join("<fixture>");
  const closeWide = (f, closeMode) =>
    spawnSync(
      process.execPath,
      [join(f.main, "scripts", "release.mjs"), "close", "WO-999", closeMode],
      {
        cwd: f.main,
        env: f.env,
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
      },
    );
  // Criterion 6's arrangement with one tracked source directory: the order's
  // target change adds `src/app.txt` and a .gitignore that ignores `.env` at
  // any depth and the declared build output; the merge lands through another
  // checkout, so the clone's base checkout stays behind the fetched base.
  const registerAndStart = (f) => {
    publicationSetup(f);
    f.config.classes.fixture.disposable = ["dist", "node_modules"];
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "test: probe registration");
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    f.start();
    write(f.target, ".gitignore", ".env\ndist/\nnode_modules/\n");
    write(f.target, "src/app.txt", "app\n");
    write(f.target, "change.txt", "changed\n");
    git(f.target, "add", "-A");
    git(f.target, "commit", "-qm", "feat: ignore build output");
  };
  const mergeBehindBase = (f) => {
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "commit", "-qm", "Closed target order");
    git(
      f.main,
      "merge",
      "-q",
      "--no-ff",
      "-m",
      "Merge target order records",
      "wo-999",
    );
    git(f.main, "push", "-q", "origin", "main");
    const merger = join(f.base, "merger");
    git(f.base, "clone", "-q", join(f.base, "target.git"), merger);
    git(merger, "config", "user.email", "fixture@example.invalid");
    git(merger, "config", "user.name", "Fixture");
    git(merger, "fetch", "-q", f.clone, "wo-999");
    git(
      merger,
      "merge",
      "-q",
      "--no-ff",
      "-m",
      "Merge target change",
      "FETCH_HEAD",
    );
    git(merger, "push", "-q", "origin", "main");
    return git(merger, "rev-parse", "HEAD");
  };

  // W3-1: criterion 6 says a stray `.env` in either place refuses once
  // naming the path and the registration remedy. A nested `.env` in the
  // clone's base checkout, under a source directory the fetched tree tracks
  // and does not ignore, must be named by its path, never by that directory.
  test("base-nested-env", () =>
    withFixture((f) => {
      registerAndStart(f);
      closeOrder(f);
      mergeBehindBase(f);
      const baseBefore = git(f.clone, "rev-parse", "HEAD");
      write(f.clone, "src/.env", "SECRET=1\n");
      const refused = closeWide(f, "--publish");
      const observed = {
        probe: "base-nested-env",
        exit: refused.status,
        stderr: redact(f, refused.stderr).slice(0, 700),
        namesNestedPath: /source retained: src\/\.env[.,]/u.test(
          refused.stderr,
        ),
        namesSourceDirectory: /source retained: src\/[.,]/u.test(
          refused.stderr,
        ),
        envRetained: existsSync(join(f.clone, "src/.env")),
        baseMoved: git(f.clone, "rev-parse", "HEAD") !== baseBefore,
        targetExists: existsSync(f.target),
      };
      observe(observed);
      assert.notEqual(observed.exit, 0);
      assert.equal(observed.envRetained, true);
      assert.equal(observed.baseMoved, false);
      assert.equal(observed.targetExists, true);
      assert.match(
        refused.stderr,
        /target clone base main has undeclared ignored material; source retained: src\/\.env\. Declare it disposable in the registration or remove it/u,
      );
    }));

  // The consequence of the printed remedy: the refusal names `src/`, the
  // operator declares `src` disposable as it says, and the next publishing
  // close runs. The operator's `.env` must survive a remedy the kit printed.
  test("base-nested-env-remedy-followed", () =>
    withFixture((f) => {
      registerAndStart(f);
      closeOrder(f);
      const fetchedBase = mergeBehindBase(f);
      write(f.clone, "src/.env", "SECRET=1\n");
      const refused = closeWide(f, "--publish");
      const named = /source retained: (\S+?)\. Declare/u.exec(
        refused.stderr,
      )?.[1];
      f.config.classes.fixture.disposable = [
        ...f.config.classes.fixture.disposable,
        named.replace(/\/$/u, ""),
      ];
      write(f.main, "dotln.config.json", JSON.stringify(f.config));
      git(f.main, "add", "-A");
      git(f.main, "commit", "-qm", "test: declare the named path disposable");
      git(f.main, "push", "-q", "origin", "main");
      const rerun = closeWide(f, "--publish");
      const observed = {
        probe: "base-nested-env-remedy-followed",
        firstExit: refused.status,
        named,
        rerunExit: rerun.status,
        rerunStderr: redact(f, rerun.stderr).slice(0, 700),
        cleanupLine: redact(
          f,
          rerun.stdout
            .split("\n")
            .find((line) => line.startsWith("Target worktree")) ?? "",
        ),
        envRetained: existsSync(join(f.clone, "src/.env")),
        trackedSourceRetained: existsSync(join(f.clone, "src/app.txt")),
        baseAtFetched: git(f.clone, "rev-parse", "HEAD") === fetchedBase,
      };
      observe(observed);
      assert.notEqual(observed.firstExit, 0);
      assert.equal(observed.envRetained, true);
    }));

  // The contrast: the same file in the target worktree is named by its path.
  test("target-nested-env", () =>
    withFixture((f) => {
      registerAndStart(f);
      closeOrder(f);
      mergeBehindBase(f);
      write(f.target, "src/.env", "SECRET=1\n");
      const refused = closeWide(f, "--publish");
      const observed = {
        probe: "target-nested-env",
        exit: refused.status,
        stderr: redact(f, refused.stderr).slice(0, 700),
        envRetained: existsSync(join(f.target, "src/.env")),
        targetExists: existsSync(f.target),
      };
      observe(observed);
      assert.notEqual(observed.exit, 0);
      assert.equal(observed.envRetained, true);
      assert.match(
        refused.stderr,
        /target has undeclared ignored material; source retained: src\/\.env\. Declare it disposable in the registration or remove it/u,
      );
    }));

  // W3-2: a publishing close refused after the declared output was planned
  // must not report that output as deleted while every file remains.
  test("refused-close-claims-deletion", () =>
    withFixture((f) => {
      registerAndStart(f);
      closeOrder(f);
      mergeBehindBase(f);
      write(f.target, "dist/out.js", "built\n");
      write(f.target, ".env", "SECRET=1\n");
      const refused = closeWide(f, "--publish");
      const cleanupLine =
        refused.stdout
          .split("\n")
          .find((line) => line.startsWith("Target worktree")) ?? "";
      const observed = {
        probe: "refused-close-claims-deletion",
        exit: refused.status,
        cleanupLine: redact(f, cleanupLine),
        distRemains: existsSync(join(f.target, "dist/out.js")),
        envRetained: existsSync(join(f.target, ".env")),
      };
      observe(observed);
      assert.notEqual(observed.exit, 0);
      assert.equal(observed.distRemains, true);
      assert.equal(observed.envRetained, true);
      assert.doesNotMatch(cleanupLine, /disposable output deleted/u);
    }));
};

source += `\n(${cases.toString()})();\n`;
const scratch = mkdtempSync(join(tmpdir(), "dotln-wo221-final002-"));
const file = join(scratch, `${mode}.mjs`);
writeFileSync(file, source);
try {
  await import(pathToFileURL(file).href);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
