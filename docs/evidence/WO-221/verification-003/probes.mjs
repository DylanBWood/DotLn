// Independent VER-003 probes. Each reuses the target-worktree suite's fixture
// helpers (local bare remotes, mocked gh) through a generated copy in system
// temp, as the earlier probes do; the implementation is not edited and nothing
// reaches a real service. A probe asserts the safe or required behavior, so an
// exit 1 is a reproduced defect, not a passing check.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const mode = process.argv[2];
const modes = [
  "base-large-undeclared-then-declared",
  "base-over-ceiling",
  "ambient-xdg-and-template-config",
  "target-unwritable-declared-dir",
  "null-advisory-masquerade",
  "target-large-declared",
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
  const receiptOf = (f) =>
    JSON.parse(
      readFileSync(
        docPath(f.main, "control", "local/retained/WO-999/release-close.json"),
        "utf8",
      ),
    );
  // The fixture's own runner caps child output at 4 MiB; this one does not,
  // so an oversized refusal is measured instead of killing the close.
  const closeWide = (f, closeMode, env = {}) =>
    spawnSync(
      process.execPath,
      [join(f.main, "scripts", "release.mjs"), "close", "WO-999", closeMode],
      {
        cwd: f.main,
        env: { ...f.env, ...env },
        encoding: "utf8",
        maxBuffer: 256 * 1024 * 1024,
      },
    );
  const countFiles = (directory) => {
    if (!existsSync(directory)) return 0;
    let count = 0;
    const walk = (current) => {
      for (const entry of readdirSync(current, { withFileTypes: true }))
        if (entry.isDirectory()) walk(join(current, entry.name));
        else count += 1;
    };
    walk(directory);
    return count;
  };
  // Criterion 6's arrangement: the order's target change adds the .gitignore,
  // the merge lands through another checkout, and the clone's base checkout
  // stays behind the fetched base with working-copy rules that predate it.
  const registerAndStart = (f, { disposable, targetIgnore, gate }) => {
    publicationSetup(f);
    f.config.classes.fixture.disposable = disposable;
    if (gate) gate(f);
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    git(f.main, "add", "-A");
    git(f.main, "commit", "-qm", "test: probe registration");
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    f.start();
    write(f.target, ".gitignore", targetIgnore);
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
  const populate = (f, prefix, segment, perPackage, limitBytes) => {
    let pathBytes = 0;
    let files = 0;
    for (let pkg = 0; pathBytes <= limitBytes; pkg += 1)
      for (let index = 0; index < perPackage; index += 1) {
        const file = `${prefix}/@scope/package-${String(pkg).padStart(4, "0")}/${segment}/widget-${String(index).padStart(3, "0")}.js`;
        write(f.clone, file, "export {};\n");
        pathBytes += Buffer.byteLength(file) + 1;
        files += 1;
      }
    return { files, pathBytes };
  };

  // D038's reopen condition at the moving-base arrangement: a large tree the
  // merged tree ignores refuses with the registration remedy while undeclared,
  // then the same tree under a declared root is deleted and the base moves.
  test("base-large-undeclared-then-declared", () =>
    withFixture((f) => {
      registerAndStart(f, {
        disposable: ["node_modules"],
        targetIgnore: "node_modules/\nbower_components/\n",
      });
      closeOrder(f);
      const fetchedBase = mergeBehindBase(f);
      const baseBefore = git(f.clone, "rev-parse", "HEAD");
      const { files, pathBytes } = populate(
        f,
        "bower_components",
        "dist/esm/components",
        50,
        1024 * 1024 + 1,
      );
      const visibleBeforeMerge = git(
        f.clone,
        "ls-files",
        "--others",
        "--exclude-standard",
        "--directory",
      );
      const refused = closeWide(f, "--publish");
      const refusal = {
        exit: refused.status,
        stderrBytes: Buffer.byteLength(refused.stderr),
        stderr: redact(f, refused.stderr).slice(0, 700),
        namedTimes: (refused.stderr.match(/bower_components\//gu) ?? []).length,
        retainedFiles: countFiles(join(f.clone, "bower_components")),
        baseMoved: git(f.clone, "rev-parse", "HEAD") !== baseBefore,
        targetExists: existsSync(f.target),
      };
      renameSync(
        join(f.clone, "bower_components"),
        join(f.clone, "node_modules"),
      );
      const published = closeWide(f, "--publish");
      const receipt = receiptOf(f);
      const completion = {
        exit: published.status,
        cleanupLine: redact(
          f,
          published.stdout
            .split("\n")
            .find((line) => line.startsWith("Target worktree")) ?? "",
        ),
        stderr: redact(f, published.stderr).slice(0, 700),
        baseNodeModulesRemains: existsSync(join(f.clone, "node_modules")),
        baseAtFetched: git(f.clone, "rev-parse", "HEAD") === fetchedBase,
        targetExists: existsSync(f.target),
        receiptBase: receipt.targetCleanup?.disposable?.base,
      };
      observe({
        probe: "base-large-undeclared-then-declared",
        files,
        pathBytes,
        visibleBeforeMerge,
        refusal,
        completion,
      });
      assert.ok(pathBytes > 1024 * 1024);
      assert.equal(visibleBeforeMerge, "bower_components/");
      assert.notEqual(refusal.exit, 0);
      assert.match(
        refused.stderr,
        /target clone base main has undeclared ignored material; source retained: bower_components\/\. Declare it disposable in the registration or remove it; regenerable build output is deleted at close, never moved to scratch\. Then rerun/u,
      );
      assert.equal(refusal.namedTimes, 1);
      assert.equal(refusal.retainedFiles, files);
      assert.equal(refusal.baseMoved, false);
      assert.equal(refusal.targetExists, true);
      assert.equal(completion.exit, 0, published.stderr);
      assert.equal(completion.baseNodeModulesRemains, false);
      assert.equal(completion.baseAtFetched, true);
      assert.equal(completion.targetExists, false);
      assert.deepEqual(completion.receiptBase, [
        { path: "node_modules", files },
      ]);
    }));

  // D039 keeps the 16 MiB candidate-reader ceiling. Past it the close must
  // still refuse with the source retained, and its refusal should name what
  // failed rather than echo the path list.
  test("base-over-ceiling", () =>
    withFixture((f) => {
      registerAndStart(f, {
        disposable: ["node_modules"],
        targetIgnore: "node_modules/\n",
      });
      closeOrder(f);
      mergeBehindBase(f);
      const baseBefore = git(f.clone, "rev-parse", "HEAD");
      const { files, pathBytes } = populate(
        f,
        "node_modules",
        "x".repeat(120),
        250,
        16 * 1024 * 1024 + 256 * 1024,
      );
      const refused = closeWide(f, "--publish");
      let blockerBytes = null;
      try {
        blockerBytes = Math.max(
          ...receiptOf(f).blockers.map((row) =>
            Buffer.byteLength(String(row.reason)),
          ),
        );
      } catch {
        blockerBytes = "unreadable";
      }
      const observed = {
        probe: "base-over-ceiling",
        files,
        pathBytes,
        exit: refused.status,
        stderrBytes: Buffer.byteLength(refused.stderr),
        stderrHasNul: refused.stderr.includes("\0"),
        stderrPathEchoes: (refused.stderr.match(/widget-\d{3}\.js/gu) ?? [])
          .length,
        stderrHead: redact(f, refused.stderr.slice(0, 400)).replaceAll(
          "\0",
          "\\0",
        ),
        stderrTail: redact(f, refused.stderr.slice(-300)).replaceAll(
          "\0",
          "\\0",
        ),
        receiptBlockerBytes: blockerBytes,
        retainedFiles: countFiles(join(f.clone, "node_modules")),
        baseMoved: git(f.clone, "rev-parse", "HEAD") !== baseBefore,
        targetExists: existsSync(f.target),
      };
      observe(observed);
      assert.ok(pathBytes > 16 * 1024 * 1024);
      assert.notEqual(observed.exit, 0);
      assert.equal(observed.retainedFiles, files);
      assert.equal(observed.baseMoved, false);
      assert.equal(observed.targetExists, true);
      assert.ok(
        observed.stderrBytes < 64 * 1024,
        `refusal is ${observed.stderrBytes} bytes and echoes ${observed.stderrPathEchoes} paths`,
      );
    }));

  // FINAL-001 F10's repair at the two ambient sources its test does not
  // exercise: the XDG default excludes file and an init.templateDir setting.
  // Each makes operator material under a declared root look ignored to Git;
  // only the fetched tree may authorize deleting it.
  test("ambient-xdg-and-template-config", () =>
    withFixture((f) => {
      registerAndStart(f, {
        disposable: ["node_modules", "ambient", "tmpl"],
        targetIgnore: "node_modules/\n",
      });
      closeOrder(f);
      mergeBehindBase(f);
      const refsBefore = git(
        f.clone,
        "for-each-ref",
        "--format=%(refname) %(objectname)",
      );
      const xdg = join(f.base, "xdg");
      write(xdg, "git/ignore", "ambient/\n");
      const template = join(f.base, "git-template");
      write(template, "info/exclude", "tmpl/\n");
      const globalConfig = join(f.base, "probe.gitconfig");
      writeFileSync(
        globalConfig,
        `${readFileSync(f.env.GIT_CONFIG_GLOBAL, "utf8")}\n[init]\n\ttemplateDir = ${JSON.stringify(template)}\n`,
      );
      const env = { XDG_CONFIG_HOME: xdg, GIT_CONFIG_GLOBAL: globalConfig };
      write(f.clone, "ambient/keep.txt", "operator material\n");
      write(f.clone, "tmpl/keep.txt", "operator material\n");
      // Both ambient policies are live in this environment.
      const ambientLive = spawnSync(
        "git",
        ["-C", f.clone, "check-ignore", "ambient/keep.txt"],
        { env: { ...f.env, ...env }, encoding: "utf8" },
      ).stdout.trim();
      const live = join(f.base, "template-live");
      spawnSync("git", ["init", "-q", live], { env: { ...f.env, ...env } });
      const templateLive = existsSync(join(live, ".git/info/exclude"))
        ? readFileSync(join(live, ".git/info/exclude"), "utf8").trim()
        : null;
      const rounds = [];
      for (const material of ["ambient", "tmpl"]) {
        for (const closeMode of ["--dry-run", "--publish"]) {
          const result = closeWide(f, closeMode, env);
          rounds.push({
            material,
            mode: closeMode,
            exit: result.status,
            stderr: redact(f, result.stderr).slice(0, 300),
            retained: existsSync(join(f.clone, material, "keep.txt")),
            refsUnchanged:
              git(
                f.clone,
                "for-each-ref",
                "--format=%(refname) %(objectname)",
              ) === refsBefore,
            targetExists: existsSync(f.target),
          });
        }
        rmSync(join(f.clone, material), { recursive: true });
      }
      observe({
        probe: "ambient-xdg-and-template-config",
        ambientLive,
        templateLive,
        rounds,
      });
      assert.equal(ambientLive, "ambient/keep.txt");
      assert.equal(templateLive, "tmpl/");
      for (const round of rounds) {
        assert.notEqual(round.exit, 0, round.stderr);
        assert.match(
          round.stderr,
          new RegExp(`not clean \\(${round.material}/keep\\.txt\\)`, "u"),
        );
        assert.ok(round.retained);
        assert.ok(round.refsUnchanged);
        assert.ok(round.targetExists);
      }
    }));

  // The sibling of FINAL-001 F11 the repair does not name: a declared
  // directory that can be read and searched but not written. The safe
  // behavior refuses before deleting any declared output and names the tree
  // by its role.
  test("target-unwritable-declared-dir", () =>
    withFixture((f) => {
      registerAndStart(f, {
        disposable: ["node_modules", "dist"],
        targetIgnore: "node_modules/\ndist/\n",
      });
      closeOrder(f);
      mergeBehindBase(f);
      const baseBefore = git(f.clone, "rev-parse", "HEAD");
      write(f.target, "dist/out.js", "output\n");
      write(f.target, "node_modules/a.js", "output\n");
      write(f.target, "node_modules/locked/file.js", "output\n");
      const locked = join(f.target, "node_modules/locked");
      const manifest = join(f.target, ".claude/target-worker-manifest.json");
      chmodSync(locked, 0o555);
      let first;
      try {
        const refused = closeWide(f, "--publish");
        first = {
          exit: refused.status,
          stderr: redact(f, refused.stderr).slice(0, 500),
          namesFixturePath: refused.stderr
            .replace(releaseCloseCommand(f.main, "WO-999", "--publish"), "")
            .includes(f.base),
          distOutRemains: existsSync(join(f.target, "dist/out.js")),
          nodeModulesARemains: existsSync(join(f.target, "node_modules/a.js")),
          lockedFileRemains: existsSync(join(locked, "file.js")),
          bundleManifestRemains: existsSync(manifest),
          targetExists: existsSync(f.target),
          baseMoved: git(f.clone, "rev-parse", "HEAD") !== baseBefore,
        };
      } finally {
        if (existsSync(locked)) chmodSync(locked, 0o755);
      }
      const retry = closeWide(f, "--publish");
      const second = {
        exit: retry.status,
        stderr: redact(f, retry.stderr).slice(0, 300),
        targetExists: existsSync(f.target),
      };
      observe({ probe: "target-unwritable-declared-dir", first, second });
      assert.notEqual(first.exit, 0);
      assert.ok(first.targetExists);
      assert.equal(first.baseMoved, false);
      assert.equal(second.exit, 0, retry.stderr);
      assert.equal(first.namesFixturePath, false, first.stderr);
      assert.ok(
        first.distOutRemains && first.nodeModulesARemains,
        "declared output was deleted before the refusal",
      );
    }));

  // Criterion 6 at the size the target worktree's output has: twenty
  // thousand declared files under node_modules beside one file under each of
  // the other declared roots. The publishing close deletes them all.
  test("target-large-declared", () =>
    withFixture((f) => {
      registerAndStart(f, {
        disposable: ["node_modules", ".nx", "dist", ".angular", "coverage"],
        targetIgnore: "node_modules/\n.nx/\ndist/\n.angular/\ncoverage/\n",
      });
      closeOrder(f);
      mergeBehindBase(f);
      let pathBytes = 0;
      let files = 0;
      for (let pkg = 0; pkg < 400; pkg += 1)
        for (let index = 0; index < 50; index += 1) {
          const file = `node_modules/@scope/package-${String(pkg).padStart(4, "0")}/dist/esm/components/widget-${String(index).padStart(3, "0")}.js`;
          write(f.target, file, "export {};\n");
          pathBytes += Buffer.byteLength(file) + 1;
          files += 1;
        }
      for (const file of [
        ".nx/cache/entry",
        "dist/out.js",
        ".angular/cache/22/x.tsbuildinfo",
      ])
        write(f.target, file, "output\n");
      const published = closeWide(f, "--publish");
      const receipt = receiptOf(f);
      const observed = {
        probe: "target-large-declared",
        files,
        pathBytes,
        exit: published.status,
        stderr: redact(f, published.stderr).slice(0, 500),
        cleanupLine: redact(
          f,
          published.stdout
            .split("\n")
            .find((line) => line.startsWith("Target worktree")) ?? "",
        ),
        targetExists: existsSync(f.target),
        receiptTarget: receipt.targetCleanup?.disposable?.target,
      };
      observe(observed);
      assert.ok(pathBytes > 1024 * 1024);
      assert.equal(observed.exit, 0, published.stderr);
      assert.equal(observed.targetExists, false);
      assert.deepEqual(observed.receiptTarget, [
        { path: ".angular", files: 1 },
        { path: ".nx", files: 1 },
        { path: "dist", files: 1 },
        { path: "node_modules", files },
      ]);
    }));

  // D040: an unavailable observation is never reported as no writes. Gate rows
  // whose observation was unavailable carry null; the close's repetition of
  // the advisory should say unavailable, not an empty list.
  test("null-advisory-masquerade", () =>
    withFixture((f) => {
      const stray = join(f.clone, ".angular/cache/stray.tsbuildinfo");
      registerAndStart(f, {
        disposable: [".angular"],
        targetIgnore: ".angular/\n",
        gate: (fixture) => {
          const gate = fixture.config.repositories.target.gate;
          gate.commands["base-write"] = {
            argv: [
              process.execPath,
              "-e",
              `const fs = require('node:fs'); fs.mkdirSync(${JSON.stringify(dirname(stray))}, { recursive: true }); fs.writeFileSync(${JSON.stringify(stray)}, 'cache')`,
            ],
            timeoutMs: 5000,
          };
          gate.plain = ["test", "base-write"];
          gate.review = ["test", "base-write"];
        },
      });
      // The clone's main checkout leaves the base branch while the gate runs,
      // so the gate finds no base checkout to observe and records null; the
      // command still writes into that checkout through its absolute path.
      git(f.clone, "switch", "-q", "--detach");
      closeOrder(f);
      git(f.clone, "switch", "-q", "main");
      const gateRows = readGateChecks(f.orderRoot)
        .filter(
          (row) =>
            typeof row.checkId === "string" &&
            row.checkId.startsWith("target:target:"),
        )
        .map((row) => ({
          checkId: row.checkId,
          baseCheckoutWrites: row.baseCheckoutWrites,
          baseCheckoutWriteCount: row.baseCheckoutWriteCount,
        }));
      mergeBehindBase(f);
      const strayWritten = existsSync(stray);
      const published = closeWide(f, "--publish");
      const receipt = receiptOf(f);
      const observed = {
        probe: "null-advisory-masquerade",
        gateRows,
        strayWritten,
        exit: published.status,
        cleanupLine: redact(
          f,
          published.stdout
            .split("\n")
            .find((line) => line.startsWith("Target worktree")) ?? "",
        ),
        receiptBaseCheckoutWrites: receipt.targetCleanup?.baseCheckoutWrites,
        receiptBaseDisposable: receipt.targetCleanup?.disposable?.base,
      };
      observe(observed);
      assert.equal(observed.exit, 0, published.stderr);
      assert.ok(strayWritten);
      assert.ok(
        gateRows.length > 0 &&
          gateRows.every((row) => row.baseCheckoutWrites === null),
      );
      assert.equal(observed.receiptBaseCheckoutWrites, null);
      assert.match(
        observed.cleanupLine,
        /advisory: gate base-checkout writes unavailable/u,
      );
    }));
};

source += `\n(${cases.toString()})();\n`;
const scratch = mkdtempSync(join(tmpdir(), "dotln-wo221-ver003-"));
const file = join(scratch, `${mode}.mjs`);
writeFileSync(file, source);
try {
  await import(pathToFileURL(file).href);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
