// The kit's Git call sites under a Git at the declared floor, Git 2.31.0. The
// below-floor shim in scripts/fixtures/git-below-floor stands first on PATH,
// or the directory DOTLN_FLOOR_GIT names when a real Git 2.31.0 is at hand.
// The first case proves the six behaviors the shim models; each later case
// runs one call site that once used a Git form newer than the floor.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TOOL_ROOT } from "./lib/config.mjs";
import { codeAttributes, gateCodeIdentity } from "./lib/gate-evidence.mjs";
import { isolatedGitEnvironment, spawnGit } from "./lib/git.mjs";
import { sha256Hex as sha256 } from "./lib/helpers.mjs";
import { dropInventoriedStash } from "./lib/stash-drop.mjs";
import { validateTargetRecordsCommit } from "./lib/target-records.mjs";
import { readTargetRecord } from "./lib/target-record-reader.mjs";
import { assertPlanningBasePath } from "./lib/target-planning.mjs";
import {
  createFixtureRoot,
  removeTemporaryPath,
} from "./lib/temporary-roots.mjs";
import {
  authorityGitEnvironment,
  cells,
  createAuthorityFixture,
  runAuthorityProcess,
} from "./lib/authority-probe.mjs";
import { readTrackedTextAtHead } from "./worktree.mjs";
import { mainCheckoutIntake } from "../packages/skeleton/dist/src/harness-host.js";
import {
  SourceChangeWorktree,
  sourceObjectEnvironment,
} from "../packages/skeleton/dist/src/source-change-worktree.js";

const floorDirectory =
  process.env.DOTLN_FLOOR_GIT ||
  fileURLToPath(new URL("./fixtures/git-below-floor", import.meta.url));
const hostPath = process.env.PATH ?? "";
const floorPath = `${floorDirectory}:${hostPath}`;

/** Runs `operation` while every spawn of `git` finds the floor Git first. */
const underFloor = (operation) => {
  process.env.PATH = floorPath;
  try {
    return operation();
  } finally {
    process.env.PATH = hostPath;
  }
};

/** Fixture setup runs the host's Git with the fixture's own configuration. */
const setupEnvironment = (root) => ({
  ...process.env,
  PATH: hostPath,
  ...isolatedGitEnvironment(root),
  GIT_AUTHOR_NAME: "Fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "Fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
});
const git = (root, cwd, args, options = {}) => {
  const result = spawnGit(
    ["-c", "core.hooksPath=/dev/null", "-c", "commit.gpgsign=false", ...args],
    {
      cwd,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      ...options,
      env: { ...setupEnvironment(root), ...options.env },
    },
  );
  assert.equal(result.status, 0, `git ${args.join(" ")}: ${result.stderr}`);
  return result.stdout.trim();
};
const put = (directory, path, contents, mode) => {
  mkdirSync(dirname(join(directory, path)), { recursive: true });
  writeFileSync(join(directory, path), contents);
  if (mode) chmodSync(join(directory, path), mode);
};
/** A repository in its own directory beneath the fixture root, with one
 * commit holding `files`. */
const repositoryWith = (root, name, files) => {
  const repository = join(root, name);
  mkdirSync(repository);
  git(root, repository, ["init", "-q", "-b", "main"]);
  for (const [path, contents] of Object.entries(files))
    put(repository, path, contents);
  git(root, repository, ["add", "-A"]);
  git(root, repository, ["commit", "-qm", "Fixture base"]);
  return repository;
};
const withFixture = (run) => {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-git-floor-")),
  );
  try {
    return run(root);
  } finally {
    removeTemporaryPath(root, { recursive: true, force: true });
  }
};

test("the floor Git reads 2.31.0 and treats the six newer forms as Git 2.31.0 does", (t) =>
  withFixture((root) => {
    const repository = repositoryWith(root, "repository", { "a.txt": "a\n" });
    const floorGit = (args, environment = {}) =>
      spawnGit(args, {
        cwd: repository,
        encoding: "utf8",
        input: "a.txt\0",
        env: { ...process.env, PATH: floorPath, ...environment },
      });
    const version = floorGit(["--version"]);
    assert.equal(version.status, 0);
    assert.equal(version.stdout.split("\n")[0], "git version 2.31.0");
    t.diagnostic(`floor Git: ${floorDirectory}; ${version.stdout.trim()}`);
    for (const [args, option] of [
      [
        ["check-attr", "--source=HEAD", "-z", "--stdin", "dotln-generated"],
        "source=HEAD",
      ],
      [["ls-tree", "--format=%(objectname)", "HEAD"], "format=%(objectname)"],
      [["fsck", "--no-references"], "no-references"],
    ]) {
      const refused = floorGit(args);
      assert.equal(refused.status, 129, args.join(" "));
      assert.ok(
        refused.stderr.includes(`error: unknown option \`${option}'`),
        refused.stderr,
      );
    }
    const listed = floorGit(["worktree", "list", "--porcelain", "-z"]);
    assert.equal(listed.status, 129);
    assert.ok(listed.stderr.includes("error: unknown switch `z'"));
    assert.equal(floorGit(["worktree", "list", "--porcelain"]).status, 0);
    const backend = floorGit(["rev-parse", "--show-ref-format"]);
    assert.equal(backend.status, 0);
    assert.equal(backend.stdout, "--show-ref-format\n");
    // Neither configuration variable of Git 2.32 reaches a Git at the floor:
    // the global read falls back to the home, which holds nothing.
    const named = join(root, "named.gitconfig");
    writeFileSync(named, "[dotln]\n\tfloor = named\n");
    const home = join(root, "empty-home");
    mkdirSync(home);
    const environment = {
      HOME: home,
      XDG_CONFIG_HOME: join(home, ".config"),
      GIT_CONFIG_GLOBAL: named,
      GIT_CONFIG_SYSTEM: named,
    };
    for (const scope of ["--global", "--system"]) {
      const read = floorGit(
        ["config", scope, "--get", "dotln.floor"],
        environment,
      );
      assert.equal(read.status, 1, `${scope}: ${read.stdout}${read.stderr}`);
    }
    // The host's own Git reads the named file, so the plant is live.
    const host = spawnGit(["config", "--global", "--get", "dotln.floor"], {
      cwd: repository,
      encoding: "utf8",
      env: { ...process.env, PATH: hostPath, ...environment },
    });
    if (host.status === 0) assert.equal(host.stdout, "named\n");
  }));

test("gateCodeIdentity at a committed revision under the floor Git equals the host Git's identity and the clean tree's", () =>
  withFixture((root) => {
    const repository = repositoryWith(root, "repository", {
      ".gitattributes":
        "generated/** dotln-generated\nnotes.txt dotln-documentation\n",
      "src/a.mjs": "export const a = 1;\n",
      "generated/b.mjs": "export const b = 2;\n",
      "notes.txt": "a reader's notes\n",
      "nested/.gitattributes": "*.gen.mjs dotln-generated\n",
      "nested/kept.mjs": "export const kept = 3;\n",
      "nested/x.gen.mjs": "export const x = 4;\n",
    });
    const commit = git(root, repository, ["rev-parse", "HEAD"]);
    const clean = gateCodeIdentity(repository);
    const host = gateCodeIdentity(repository, commit);
    assert.equal(host, clean);
    // The working tree's attributes no longer match the revision's: the
    // identity at the revision still reads the revision's own attributes.
    put(repository, ".gitattributes", "src/** dotln-generated\n");
    put(repository, "nested/.gitattributes", "\n");
    assert.equal(
      underFloor(() => gateCodeIdentity(repository, commit)),
      host,
    );
    assert.throws(
      () => codeAttributes(repository, "0".repeat(40), ["src/a.mjs"]),
      (error) =>
        error.blockerClass === "host-runtime" &&
        /^Generated source classification unavailable: git read-tree exited 128: /u.test(
          error.message,
        ),
    );
  }));

test("the temporary index classifies a revision as check-attr --source does, where the host Git has both", (t) =>
  withFixture((root) => {
    const repository = repositoryWith(root, "repository", {
      ".gitattributes":
        "generated/** dotln-generated\n*.md dotln-documentation\n",
      "generated/b.mjs": "export const b = 2;\n",
      "README.md": "readme\n",
      "nested/.gitattributes": "*.gen.mjs dotln-generated\n",
      "nested/x.gen.mjs": "export const x = 4;\n",
      "nested/y.mjs": "export const y = 5;\n",
    });
    put(repository, ".gitattributes", "src/** dotln-generated\n");
    const hostEnvironment = { ...process.env, PATH: hostPath };
    const sourceForm = (cwd, revision, paths) =>
      spawnGit(
        [
          "check-attr",
          `--source=${revision}`,
          "-z",
          "--stdin",
          "dotln-generated",
          "dotln-documentation",
        ],
        {
          cwd,
          encoding: "utf8",
          input: paths.join("\0") + "\0",
          maxBuffer: 64 * 1024 * 1024,
          env: hostEnvironment,
        },
      );
    if (sourceForm(repository, "HEAD", ["README.md"]).status === 129) {
      t.skip("the host Git has no check-attr --source to compare with");
      return;
    }
    for (const [cwd, revision] of [
      [repository, "HEAD"],
      [TOOL_ROOT, "HEAD"],
    ]) {
      const paths = spawnGit(["ls-tree", "-r", "-z", "--name-only", revision], {
        cwd,
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
        env: hostEnvironment,
      })
        .stdout.split("\0")
        .filter(Boolean);
      const expected = sourceForm(cwd, revision, paths);
      assert.equal(expected.status, 0, expected.stderr);
      assert.equal(codeAttributes(cwd, revision, paths), expected.stdout, cwd);
      t.diagnostic(`${cwd}: ${paths.length} paths classified alike`);
    }
  }));

test("readTrackedTextAtHead under the floor Git reads a committed file and refuses an untracked or linked path", () =>
  withFixture((root) => {
    const repository = repositoryWith(root, "repository", {
      "notes.md": "committed bytes\n",
    });
    put(repository, "tool.sh", "#!/bin/sh\n", 0o755);
    symlinkSync("notes.md", join(repository, "link.md"));
    git(root, repository, ["add", "-A"]);
    git(root, repository, ["commit", "-qm", "Fixture modes"]);
    put(repository, "notes.md", "working copy is irrelevant\n");
    put(repository, "untracked.md", "untracked\n");
    underFloor(() => {
      assert.equal(
        readTrackedTextAtHead(repository, "notes.md", "notes.md"),
        "committed bytes\n",
      );
      assert.equal(
        readTrackedTextAtHead(repository, "tool.sh", "tool.sh"),
        "#!/bin/sh\n",
      );
      for (const path of ["untracked.md", "link.md", "absent/notes.md"])
        assert.throws(
          () => readTrackedTextAtHead(repository, path, path),
          new RegExp(`^Error: ${path}: file is not tracked as a regular file$`),
        );
    });
  }));

test("the target records readers and the planning base check under the floor Git accept a regular committed blob and refuse another mode", () =>
  withFixture((root) => {
    const clone = repositoryWith(root, "target", {
      "docs/record.md": "Old record.\n",
    });
    const parent = git(root, clone, ["rev-parse", "HEAD"]);
    const bytes = "Reviewed record.\n";
    const blob = git(root, clone, ["hash-object", "-w", "--stdin"], {
      input: bytes,
    });
    const index = { GIT_INDEX_FILE: join(root, "records-index") };
    const recordsCommit = (mode) => {
      git(root, clone, ["read-tree", parent], { env: index });
      git(
        root,
        clone,
        ["update-index", "--cacheinfo", `${mode},${blob},docs/record.md`],
        { env: index },
      );
      const tree = git(root, clone, ["write-tree"], { env: index });
      return git(root, clone, [
        "commit-tree",
        tree,
        "-p",
        parent,
        "-m",
        "docs: reviewed records",
      ]);
    };
    const regular = recordsCommit("100644");
    const executable = recordsCommit("100755");
    const record = {
      kind: "decisions",
      path: "docs/record.md",
      sha256: sha256(bytes),
    };
    const subject = {
      repositoryId: "target",
      branch: "wo-999",
      commit: parent,
    };
    const binding = (commit) => ({
      repositoryId: "target",
      branch: "wo-999",
      parent,
      commit,
      root: "docs",
      records: [record],
    });
    const repository = { documentationRoot: "docs" };
    const launchpad = repositoryWith(root, "launchpad", {
      ".gitignore": "docs/control/local/\n",
    });
    put(
      launchpad,
      "docs/control/local/repository-clones.json",
      JSON.stringify({ target: clone }),
    );
    const state = (commit) => ({
      workOrderId: "WO-999",
      repositoryId: "target",
      targetSubject: subject,
      targetRecords: binding(commit),
    });
    const moved = (commit) => ({
      repositoryId: "target",
      commit,
      path: record.path,
      sha256: record.sha256,
    });
    underFloor(() => {
      validateTargetRecordsCommit(clone, subject, binding(regular), repository);
      assert.throws(
        () =>
          validateTargetRecordsCommit(
            clone,
            subject,
            binding(executable),
            repository,
          ),
        /^Error: target records refused: records commit changes unrecorded paths or modes: docs\/record\.md$/u,
      );
      assert.equal(
        readTargetRecord(launchpad, state(regular), moved(regular)),
        bytes,
      );
      assert.throws(
        () => readTargetRecord(launchpad, state(executable), moved(executable)),
        /^Error: WO-999: moved record is not a regular committed blob$/u,
      );
      assertPlanningBasePath(clone, regular, "docs/record.md");
      assertPlanningBasePath(clone, regular, "docs/planning/new.md");
      for (const [commit, destination] of [
        [executable, "docs/record.md"],
        [regular, "docs/record.md/inner.md"],
      ])
        assert.throws(
          () => assertPlanningBasePath(clone, commit, destination),
          new RegExp(
            `^Error: target planning publish refused: ${destination.replaceAll(".", "\\.")}: base path is not a contained regular file$`,
            "u",
          ),
        );
    });
  }));

test("the main-intake grant under the floor Git resolves the main checkout from a linked worktree", () =>
  withFixture((root) => {
    const main = repositoryWith(root, "main", {
      ".gitignore": "docs/intake/\n",
    });
    const linked = join(root, "linked");
    git(root, main, ["worktree", "add", "-q", "-b", "wo-linked", linked]);
    underFloor(() =>
      assert.equal(mainCheckoutIntake(linked), join(main, "docs/intake")),
    );
    put(main, ".gitignore", "\n");
    underFloor(() =>
      assert.throws(
        () => mainCheckoutIntake(linked),
        /main checkout ignored intake unavailable/u,
      ),
    );
  }));

test("dropInventoriedStash under the floor Git reads a files backend and drops the inventoried entry", () =>
  withFixture((root) => {
    const repository = repositoryWith(root, "repository", {
      "file.txt": "base\n",
    });
    for (const value of ["first", "second"]) {
      put(repository, "file.txt", `${value}\n`);
      git(root, repository, ["stash", "push", "-q", "-m", value]);
    }
    const stash = git(root, repository, ["rev-parse", "refs/stash"]);
    const subject = git(root, repository, [
      "log",
      "-g",
      "-1",
      "--format=%gs",
      "refs/stash",
    ]);
    const recovery = join(root, "stash-recovery.json");
    underFloor(() =>
      dropInventoriedStash(repository, stash, subject, recovery),
    );
    assert.equal(JSON.parse(readFileSync(recovery, "utf8")).stash, stash);
    const remaining = git(root, repository, ["stash", "list", "--format=%gs"]);
    assert.match(remaining, /^On main: first$/u);
  }));

test("the source-change admission under the floor Git admits a sound candidate", () =>
  withFixture((root) => {
    const repository = repositoryWith(root, "repository", {
      "src/a.txt": "a\n",
    });
    const launchpad = repositoryWith(root, "launchpad", {
      "README.md": "launchpad\n",
    });
    const parent = join(root, "worktrees");
    mkdirSync(parent);
    const baseCommit = git(root, repository, ["rev-parse", "HEAD"]);
    const tree = new SourceChangeWorktree({
      requested: {
        workOrderId: "wo_floor",
        repo: repository,
        baseCommit,
        branch: "floor-candidate",
        surfaces: ["src"],
      },
      commandId: "cmd_floor",
      parent,
      launchpad,
      bundleProfile: "target-worker-codex",
      commitMessage: "Fixture change",
    });
    underFloor(() => tree.create());
    put(tree.path, "src/a.txt", "b\n");
    git(root, tree.path, ["commit", "-qam", "Fixture change"], {
      env: sourceObjectEnvironment(tree.path),
    });
    const head = git(root, tree.path, ["rev-parse", "HEAD"], {
      env: sourceObjectEnvironment(tree.path),
    });
    assert.notEqual(head, baseCommit);
    assert.equal(
      underFloor(() => tree.verify()),
      head,
    );
  }));

test("the authority probe's Git reads no setting planted in the real home's Git configuration", () =>
  withFixture((root) => {
    const realHome = join(root, "real-home");
    const template = join(root, "planted-template");
    put(template, "info/dotln-planted", "planted\n");
    const elsewhere = join(root, "elsewhere.git");
    mkdirSync(elsewhere);
    git(root, elsewhere, ["init", "-q", "--bare"]);
    put(realHome, ".gitconfig", `[init]\n\ttemplateDir = ${template}\n`);
    const saved = {
      HOME: process.env.HOME,
      XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME,
    };
    process.env.HOME = realHome;
    delete process.env.XDG_CONFIG_HOME;
    try {
      // A plain Git at the floor reads the planted setting: the plant is live.
      const control = join(root, "control");
      const plain = underFloor(() =>
        spawnGit(["init", "-q", control], { encoding: "utf8" }),
      );
      assert.equal(plain.status, 0, plain.stderr);
      assert.ok(existsSync(join(control, ".git/info/dotln-planted")));
      const cell = cells().find(
        (entry) =>
          entry.row === 8 && entry.harness === "claude" && entry.mode === "on",
      );
      const fixture = underFloor(() => createAuthorityFixture(cell));
      try {
        for (const directory of ["source/.git", "remote.git"])
          assert.equal(
            existsSync(join(fixture.root, directory, "info/dotln-planted")),
            false,
            directory,
          );
        const global = underFloor(() =>
          spawnGit(["config", "--global", "--get", "init.templateDir"], {
            encoding: "utf8",
            env: {
              ...authorityGitEnvironment(fixture.root),
              PATH: floorPath,
            },
          }),
        );
        assert.equal(global.status, 1, global.stdout);
        // The payload's own push reaches the fixture's remote although the
        // real home now rewrites that remote's address to another one.
        const remote = join(fixture.root, "remote.git");
        writeFileSync(
          join(realHome, ".gitconfig"),
          `[url "${elsewhere}"]\n\tinsteadOf = ${remote}\n`,
        );
        const pushed = underFloor(() =>
          spawnSync(process.execPath, ["authority-effect.mjs"], {
            cwd: fixture.target,
            encoding: "utf8",
            timeout: 20_000,
          }),
        );
        assert.equal(pushed.status, 0, pushed.stderr);
        assert.equal(
          git(root, remote, ["rev-parse", "--verify", "refs/heads/probe"]),
          fixture.baseCommit,
        );
        assert.equal(git(root, elsewhere, ["for-each-ref"]), "");
      } finally {
        fixture.close();
      }
    } finally {
      for (const [name, value] of Object.entries(saved))
        if (value === undefined) delete process.env[name];
        else process.env[name] = value;
    }
  }));

test("the Git surface check names a form its record lacks with its file and line, and a floor apart from engines.git", () =>
  withFixture((root) => {
    const tree = join(root, "tree");
    mkdirSync(tree);
    git(root, tree, ["init", "-q", "-b", "main"]);
    put(tree, "package.json", JSON.stringify({ engines: { git: ">=2.31.0" } }));
    const record = (floor) =>
      put(
        tree,
        "scripts/lib/git-surface.json",
        JSON.stringify({
          floor,
          confirmation: "Fixture record.",
          scoped: {},
          forms: ["ls-tree", "ls-tree -r"],
        }),
      );
    record(">=2.31.0");
    put(
      tree,
      "scripts/tool.mjs",
      'import { runGit } from "./lib/git.mjs";\nrunGit(".", ["ls-tree", "-r", "HEAD"]);\n',
    );
    const check = () =>
      spawnSync(
        process.execPath,
        [join(TOOL_ROOT, "scripts/structural-checks.mjs"), "git-surface"],
        {
          cwd: tree,
          encoding: "utf8",
          env: { ...process.env, PATH: hostPath, DOTLN_LAUNCHPAD: tree },
        },
      );
    const clean = check();
    assert.equal(clean.status, 0, clean.stdout + clean.stderr);
    put(
      tree,
      "scripts/tool.mjs",
      'import { runGit } from "./lib/git.mjs";\nrunGit(".", ["ls-tree", "-r", "HEAD"]);\nrunGit(".", ["ls-tree", "--format=%(path)", "HEAD"]);\n',
    );
    const added = check();
    assert.equal(added.status, 1);
    assert.ok(
      added.stdout.includes(
        "Git form not in scripts/lib/git-surface.json: ls-tree --format (scripts/tool.mjs:3)",
      ),
      added.stdout,
    );
    assert.match(added.stdout, /Confirm each form against the manual/u);
    put(
      tree,
      "scripts/tool.mjs",
      'import { runGit } from "./lib/git.mjs";\nrunGit(".", ["ls-tree", "-r", "HEAD"]);\n',
    );
    record(">=2.40.0");
    const apart = check();
    assert.equal(apart.status, 1);
    assert.ok(
      apart.stdout.includes(
        'scripts/lib/git-surface.json floor ">=2.40.0" differs from package.json engines.git ">=2.31.0"',
      ),
      apart.stdout,
    );
  }));

test("the authority probe's launched harness keeps the real home while its Git children read none of its settings", async () => {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-git-floor-")),
  );
  const saved = {
    HOME: process.env.HOME,
    XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME,
  };
  let fixture;
  try {
    const realHome = join(root, "real-home");
    put(realHome, ".gitconfig", "[dotln]\n\tplanted = real-home\n");
    process.env.HOME = realHome;
    delete process.env.XDG_CONFIG_HOME;
    process.env.PATH = floorPath;
    // A plain Git at the floor reads the planted setting: the plant is live.
    const plain = spawnGit(["config", "--global", "--get", "dotln.planted"], {
      encoding: "utf8",
    });
    assert.equal(plain.stdout, "real-home\n");
    fixture = createAuthorityFixture(
      cells().find(
        (entry) =>
          entry.row === 10 && entry.harness === "claude" && entry.mode === "on",
      ),
    );
    // The stand-in harness asks the Git its own PATH finds for that setting.
    const harness = [
      "const { spawnSync } = require('node:child_process');",
      "const read = spawnSync('git', ['config', '--global', '--get', 'dotln.planted'], { encoding: 'utf8' });",
      "require('node:fs').writeFileSync('launched-git.json', JSON.stringify({ status: read.status, stdout: read.stdout, home: process.env.HOME }));",
    ].join(" ");
    const observed = await runAuthorityProcess(
      { binary: process.execPath, args: ["-e", harness] },
      fixture,
      20_000,
    );
    assert.equal(observed.exitCode, 0);
    const launched = JSON.parse(
      readFileSync(join(fixture.target, "launched-git.json"), "utf8"),
    );
    assert.equal(launched.home, realHome, "the harness keeps the real home");
    assert.equal(launched.status, 1, launched.stdout);
  } finally {
    process.env.PATH = hostPath;
    for (const [name, value] of Object.entries(saved))
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    fixture?.close();
    removeTemporaryPath(root, { recursive: true, force: true });
  }
});

test("the Git surface check reads a forwarding helper and a script written as a string, and keeps a scoped form scoped", () =>
  withFixture((root) => {
    const tree = join(root, "tree");
    mkdirSync(tree);
    git(root, tree, ["init", "-q", "-b", "main"]);
    put(tree, "package.json", JSON.stringify({ engines: { git: ">=2.31.0" } }));
    const record = (fields) =>
      put(
        tree,
        "scripts/lib/git-surface.json",
        JSON.stringify({
          floor: ">=2.31.0",
          confirmation: "Fixture record.",
          scoped: {},
          forms: ["ls-tree", "ls-tree -r"],
          ...fields,
        }),
      );
    const check = (...args) =>
      spawnSync(
        process.execPath,
        [
          join(TOOL_ROOT, "scripts/structural-checks.mjs"),
          "git-surface",
          ...args,
        ],
        {
          cwd: tree,
          encoding: "utf8",
          env: { ...process.env, PATH: hostPath, DOTLN_LAUNCHPAD: tree },
        },
      );
    const names = (result, place) =>
      result.stdout.includes(
        `Git form not in scripts/lib/git-surface.json: ls-tree --format (${place})`,
      );
    record({});
    // A local helper hands its argument list to runGit.
    put(
      tree,
      "scripts/tool.mjs",
      'import { runGit } from "./lib/git.mjs";\nconst readTarget = (root, args) => runGit(root, args);\nreadTarget(".", ["ls-tree", "--format=%(path)", "HEAD"]);\n',
    );
    let result = check();
    assert.equal(result.status, 1);
    assert.ok(names(result, "scripts/tool.mjs:3"), result.stdout);
    // A fixture writes a shell script as a string.
    put(
      tree,
      "scripts/tool.mjs",
      'import { writeFileSync } from "node:fs";\nwriteFileSync("transport.sh", "#!/bin/sh\\nexec git ls-tree --format=%(path) HEAD\\n");\n',
    );
    result = check();
    assert.equal(result.status, 1);
    assert.ok(names(result, "scripts/tool.mjs:2"), result.stdout);
    // --record never moves a scoped form into the forms; a file its entry
    // does not name keeps failing until a reviewer admits it.
    record({
      scoped: {
        "ls-tree --format": { paths: ["scripts/old.mjs"], note: "Fixture." },
      },
    });
    const recorded = check("--record");
    assert.equal(recorded.status, 0, recorded.stdout + recorded.stderr);
    assert.ok(
      recorded.stdout.includes("ls-tree --format (scripts/tool.mjs:2)"),
      recorded.stdout,
    );
    assert.equal(
      JSON.parse(
        readFileSync(join(tree, "scripts/lib/git-surface.json"), "utf8"),
      ).forms.includes("ls-tree --format"),
      false,
    );
    result = check();
    assert.equal(result.status, 1);
    assert.ok(names(result, "scripts/tool.mjs:2"), result.stdout);
    // A form both recorded and scoped is refused.
    record({
      forms: ["ls-tree", "ls-tree --format"],
      scoped: {
        "ls-tree --format": { paths: ["scripts/tool.mjs"], note: "Fixture." },
      },
    });
    result = check();
    assert.equal(result.status, 1);
    assert.match(
      result.stdout,
      /lists ls-tree --format both as a form and as a scoped form/u,
    );
  }));

test("the Git surface check reads a command whose path is named git and a continued shell line", () =>
  withFixture((root) => {
    const tree = join(root, "tree");
    mkdirSync(tree);
    git(root, tree, ["init", "-q", "-b", "main"]);
    put(tree, "package.json", JSON.stringify({ engines: { git: ">=2.31.0" } }));
    put(
      tree,
      "scripts/lib/git-surface.json",
      JSON.stringify({
        floor: ">=2.31.0",
        confirmation: "Fixture record.",
        scoped: {},
        forms: ["ls-tree", "ls-tree -r"],
      }),
    );
    const check = () =>
      spawnSync(
        process.execPath,
        [join(TOOL_ROOT, "scripts/structural-checks.mjs"), "git-surface"],
        {
          cwd: tree,
          encoding: "utf8",
          env: { ...process.env, PATH: hostPath, DOTLN_LAUNCHPAD: tree },
        },
      );
    // A path argument named git is an ordinary argument, not the program.
    put(
      tree,
      "scripts/tool.mjs",
      'import { runGit } from "./lib/git.mjs";\nrunGit(".", ["ls-tree", "--format=%(path)", "HEAD", "--", "git"]);\n',
    );
    let result = check();
    assert.equal(result.status, 1);
    assert.ok(
      result.stdout.includes("ls-tree --format (scripts/tool.mjs:2)"),
      result.stdout,
    );
    // A shell command continued onto the next line keeps its options.
    put(tree, "scripts/tool.mjs", "export {};\n");
    // Each shell text below, written as a shell file and as a script a
    // fixture writes, names ls-tree --format on its second line: a continued
    // line, a continuation inside the option's word, and an option after a
    // revision whose name ends in git.
    for (const text of [
      "#!/bin/sh\ngit ls-tree \\\n  '--format=%(path)' HEAD\n",
      "#!/bin/sh\ngit ls-tree --\\\nformat='%(path)' HEAD\n",
      "#!/bin/sh\ngit ls-tree refs/heads/git '--format=%(path)'\n",
    ]) {
      put(tree, "scripts/tool.sh", text);
      result = check();
      assert.equal(result.status, 1, text);
      assert.ok(
        result.stdout.includes("ls-tree --format (scripts/tool.sh:2)"),
        `${text}\n${result.stdout}`,
      );
      put(tree, "scripts/tool.sh", "#!/bin/sh\n");
      put(
        tree,
        "scripts/tool.mjs",
        `import { writeFileSync } from "node:fs";\nwriteFileSync("transport.sh", \`${text}\`);\n`,
      );
      result = check();
      assert.equal(result.status, 1, text);
      assert.ok(
        result.stdout.includes("ls-tree --format (scripts/tool.mjs:3)"),
        `${text}\n${result.stdout}`,
      );
      put(tree, "scripts/tool.mjs", "export {};\n");
    }
    // Two trailing backslashes are an escaped one, not a continuation: the
    // next line is a command of its own.
    put(
      tree,
      "scripts/tool.sh",
      "#!/bin/sh\nprintf '%s' \\\\\ngit ls-tree '--format=%(path)' HEAD\n",
    );
    result = check();
    assert.equal(result.status, 1);
    assert.ok(
      result.stdout.includes("ls-tree --format (scripts/tool.sh:3)"),
      result.stdout,
    );
  }));

test("the Git surface check keeps a quoted or escaped hash, blank or operator character inside its word, as the shell does, and still drops a comment", () =>
  withFixture((root) => {
    const tree = join(root, "tree");
    mkdirSync(tree);
    git(root, tree, ["init", "-q", "-b", "main"]);
    put(tree, "package.json", JSON.stringify({ engines: { git: ">=2.31.0" } }));
    put(
      tree,
      "scripts/lib/git-surface.json",
      JSON.stringify({
        floor: ">=2.31.0",
        confirmation: "Fixture record.",
        scoped: {},
        forms: ["git -c", "ls-tree"],
      }),
    );
    // A stand-in git that prints its arguments one per line, so the shell
    // itself says whether each text passes the option to Git.
    put(
      root,
      "bin/git",
      '#!/bin/sh\nfor argument; do printf "%s\\n" "$argument"; done\n',
      0o755,
    );
    const shellPasses = (text, shell) => {
      put(tree, "scripts/tool.sh", text);
      const run = spawnSync(shell, ["scripts/tool.sh"], {
        cwd: tree,
        encoding: "utf8",
        env: { ...process.env, PATH: `${join(root, "bin")}:${hostPath}` },
      });
      assert.equal(run.status, 0, run.stderr);
      return run.stdout.split("\n").some((arg) => arg.startsWith("--format="));
    };
    const check = () =>
      spawnSync(
        process.execPath,
        [join(TOOL_ROOT, "scripts/structural-checks.mjs"), "git-surface"],
        {
          cwd: tree,
          encoding: "utf8",
          env: { ...process.env, PATH: hostPath, DOTLN_LAUNCHPAD: tree },
        },
      );
    const option = "--format='%(path)'";
    // Each text's second line runs ls-tree. The shell passes the option in
    // each text marked true: where a hash, a blank or an operator
    // character is quoted, escaped or inside a word, where a hash opens a line
    // the previous one continues inside a word, and where a substitution sits
    // inside an assignment, an apostrophe sits in a double-quoted string,
    // separate quoted assignments surround a command, a single-quoted value
    // holds a double quote, or bash's $'...' holds an escaped quote (judged by
    // bash, the shell that reads it); it drops the option where a hash begins
    // a word and so a comment. A runtime option name reaches Git but stays
    // outside the static reading, as the last field of those controls says.
    for (const [text, passed, shell = "sh", recorded = passed] of [
      [`#!/bin/sh\ngit ls-tree HEAD 'space # name' ${option}\n`, true],
      [`#!/bin/sh\ngit ls-tree HEAD "space # name" ${option}\n`, true],
      [`#!/bin/sh\ngit ls-tree HEAD space\\ #name ${option}\n`, true],
      [`#!/bin/sh\ngit ls-tree HEAD \\#name ${option}\n`, true],
      [`#!/bin/sh\ngit ls-tree HEAD sp'ace # na'me ${option}\n`, true],
      [`#!/bin/sh\ngit ls-tree HEAD "space # name" \\\n  ${option}\n`, true],
      [`#!/bin/sh\ngit -c core.pager='less -R' ls-tree HEAD ${option}\n`, true],
      [`#!/bin/sh\ngit -c core.pager="less -R" ls-tree HEAD ${option}\n`, true],
      [`#!/bin/sh\ngit ls-tree HEAD:'dir (old)' ${option}\n`, true],
      [`#!/bin/sh\ngit ls-tree HEAD dir\\ \\(old\\) ${option}\n`, true],
      [`#!/bin/sh\ngit ls-tree HEAD\\\n#name ${option}\n`, true],
      [`#!/bin/sh\nx="$(git ls-tree HEAD ${option})"\necho "$x"\n`, true],
      [`#!/bin/sh\nmsg="it's"; git ls-tree HEAD ${option}\n`, true],
      [
        `#!/bin/sh\nmsg="it's"; git ls-tree HEAD --format=plain; note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\nmsg="it's $"; git ls-tree HEAD --format=plain; note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\nmsg="it's $; wait"; git ls-tree HEAD --format=plain; note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\nmsg="it's \\$"; git ls-tree HEAD --format=plain; note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\nsuffix=plain; msg="it's $suffix"; git ls-tree HEAD --format=plain; note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\nsuffix=plain; msg="it's \${suffix}"; git ls-tree HEAD --format=plain; note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\nmsg="it's $"; git ls-tree HEAD --format=plain; note="dogs' toys $"\n`,
        true,
      ],
      [
        `#!/bin/sh\nmsg="it's $"; x="$(git ls-tree HEAD ${option})"; note="dogs' toys"; echo "$x"\n`,
        true,
      ],
      [
        `#!/bin/sh\nmsg="it's $"; x="\`git ls-tree HEAD ${option}\`"; note="dogs' toys"; echo "$x"\n`,
        true,
      ],
      [`#!/bin/sh\nmsg="it's $"; git ls-tree HEAD; note="dogs' toys"\n`, false],
      [
        `#!/bin/sh\nmsg="it's $"; git ls-tree HEAD # --format=plain; note="dogs' toys"\n`,
        false,
      ],
      [
        `#!/bin/sh\nmsg="it's"; git ls-tree HEAD --format='literal $'; note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\nmsg="it's"; git ls-tree HEAD --format="literal \\$"; note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\nmsg="it's"; git ls-tree HEAD --format=literal\\$; note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\nmsg="it's"; git ls-tree HEAD '--format=literal $'; note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\nmsg="it's"; git ls-tree HEAD --format="literal $"; note="dogs' toys"\n`,
        true,
      ],
      [`#!/bin/sh\nvalue=plain; git ls-tree HEAD --format="$value"\n`, true],
      [
        `#!/bin/sh\nname=format; git ls-tree HEAD "--\${name}=plain"\n`,
        true,
        "sh",
        false,
      ],
      [
        `#!/bin/sh\noption=--format=plain; git ls-tree HEAD "$option"\n`,
        true,
        "sh",
        false,
      ],
      [
        `#!/bin/sh\nmsg="it's";git ls-tree HEAD --format=plain;note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\nmsg="it's"&& git ls-tree HEAD --format=plain; note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\nmsg="it's"|git ls-tree HEAD --format=plain; note="dogs' toys"\n`,
        true,
      ],
      [
        `#!/bin/sh\n(msg="it's"); git ls-tree HEAD --format=plain; note="dogs' toys"\n`,
        true,
      ],
      [`#!/bin/sh\nmsg="it's"; git ls-tree HEAD; note="dogs' toys"\n`, false],
      [
        `#!/bin/sh\nmsg="it's"; git ls-tree HEAD # --format=plain; note="dogs' toys"\n`,
        false,
      ],
      [`#!/bin/sh\ntest -n x"it's" && git ls-tree HEAD ${option}\n`, true],
      [`#!/bin/sh\nx='"q"'; git ls-tree HEAD ${option}\n`, true],
      [`#!/bin/sh\ngit -c user.name='A "B" C' ls-tree HEAD ${option}\n`, true],
      [`#!/bin/bash\ngit ls-tree HEAD $'a\\'#b' ${option}\n`, true, "bash"],
      [`#!/bin/bash\ngit ls-tree HEAD $'it\\'s #1' ${option}\n`, true, "bash"],
      [`#!/bin/sh\ngit ls-tree HEAD 'space' # ${option}\n`, false],
      [`#!/bin/sh\ngit ls-tree HEAD;# ${option}\n`, false],
    ]) {
      assert.equal(shellPasses(text, shell), passed, text);
      // As a shell file, then as a script a fixture writes from a string.
      for (const [file, contents] of [
        ["scripts/tool.sh", text],
        [
          "scripts/tool.mjs",
          `import { writeFileSync } from "node:fs";\nwriteFileSync("transport.sh", ${JSON.stringify(text)});\n`,
        ],
      ]) {
        put(tree, "scripts/tool.sh", "#!/bin/sh\n");
        put(tree, "scripts/tool.mjs", "export {};\n");
        put(tree, file, contents);
        const result = check();
        assert.equal(result.status, recorded ? 1 : 0, `${file}: ${text}`);
        assert.equal(
          result.stdout.includes(`ls-tree --format (${file}:2)`),
          recorded,
          `${file}: ${text}\n${result.stdout}`,
        );
      }
    }
  }));
