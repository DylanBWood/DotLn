import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  symlinkSync,
  chmodSync,
  existsSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
const root = process.cwd();
const mod = async (p) => import(pathToFileURL(join(root, p)));
const { gitTreeEntry, isolatedGitEnvironment, refStorageBackend } = await mod(
  "scripts/lib/git.mjs",
);
const { readTrackedTextAtHead } = await mod("scripts/worktree.mjs");
const { codeAttributes, gateCodeIdentity, readGateChecks, gateTreeHash } =
  await mod("scripts/lib/gate-evidence.mjs");
const { coveringGateCheck, preflightRows } = await mod(
  "scripts/lib/gate-reuse.mjs",
);
const { createFixtureRoot, removeTemporaryPath } = await mod(
  "scripts/lib/temporary-roots.mjs",
);
const { mainCheckoutIntake } = await mod(
  "packages/skeleton/dist/src/harness-host.js",
);
const floor = join(root, "scripts/fixtures/git-below-floor");
const fixture = (fn) => {
  const dir = createFixtureRoot(join(tmpdir(), "dotln-ver260-"));
  try {
    return fn(dir);
  } finally {
    removeTemporaryPath(dir, { recursive: true, force: true });
  }
};
const put = (r, p, s) => {
  mkdirSync(dirname(join(r, p)), { recursive: true });
  writeFileSync(join(r, p), s);
};
const env = (r) => ({
  ...Object.fromEntries(
    Object.entries(process.env).filter(([n]) => !n.startsWith("GIT_")),
  ),
  ...isolatedGitEnvironment(r),
  GIT_AUTHOR_NAME: "Fixture",
  GIT_AUTHOR_EMAIL: "fixture@example.invalid",
  GIT_COMMITTER_NAME: "Fixture",
  GIT_COMMITTER_EMAIL: "fixture@example.invalid",
});
const git = (r, args, extra = {}) => {
  const q = spawnSync(
    "git",
    ["-c", "core.hooksPath=/dev/null", "-c", "commit.gpgsign=false", ...args],
    { cwd: r, env: env(dirname(r)), encoding: "utf8", ...extra },
  );
  assert.equal(q.status, 0, q.stderr);
  return q.stdout;
};
function repo(base, name = "repo") {
  const r = join(base, name);
  mkdirSync(r);
  git(r, ["init", "-q", "-b", "main"]);
  return r;
}
function commit(r) {
  git(r, ["add", "-A"]);
  git(r, ["commit", "-qm", "Fixture"]);
}
function isolated(r, fn) {
  const saved = { ...process.env };
  Object.keys(process.env)
    .filter((n) => n.startsWith("GIT_"))
    .forEach((n) => delete process.env[n]);
  Object.assign(process.env, env(r), { PATH: `${floor}:${process.env.PATH}` });
  try {
    return fn();
  } finally {
    for (const k of Object.keys(process.env))
      if (!(k in saved)) delete process.env[k];
    Object.assign(process.env, saved);
  }
}

test("literal tree entries preserve whitespace, Unicode and pathspec punctuation under the shim", () =>
  fixture((base) => {
    const r = repo(base);
    const paths = [
      "space name.md",
      "tab\tname.md",
      "line\nname.md",
      "unicodé.md",
      ":(glob)name.md",
      "[ab]*.md",
      "-leading.md",
      "nested/deep/name.md",
    ];
    for (const p of paths) put(r, p, `committed ${p}\n`);
    put(r, "executable.sh", "#!/bin/sh\n");
    chmodSync(join(r, "executable.sh"), 0o755);
    symlinkSync("space name.md", join(r, "linked.md"));
    commit(r);
    isolated(base, () => {
      for (const p of paths) {
        assert.equal(gitTreeEntry(r, "HEAD", p)?.mode, "100644", p);
        assert.equal(readTrackedTextAtHead(r, p, p), `committed ${p}\n`);
      }
      assert.equal(gitTreeEntry(r, "HEAD", "nested")?.type, "tree");
      assert.equal(gitTreeEntry(r, "HEAD", "missing.md"), null);
      assert.equal(gitTreeEntry(r, "HEAD", "linked.md")?.mode, "120000");
      assert.throws(
        () => readTrackedTextAtHead(r, "linked.md", "linked.md"),
        /not tracked as a regular file/,
      );
      assert.equal(gitTreeEntry(r, "HEAD", "executable.sh")?.mode, "100755");
    });
  }));

test("temporary-index and source attribute readings agree with macros, info and global overrides, sparse index and a linked worktree", () =>
  fixture((base) => {
    const r = repo(base);
    put(
      r,
      ".gitattributes",
      "[attr]generated dotln-generated\n*.gen generated\n*.md dotln-documentation\n",
    );
    put(r, "nested/.gitattributes", "keep.gen -dotln-generated\n");
    for (const p of [
      "one.gen",
      "README.md",
      "nested/keep.gen",
      "nested/other.gen",
      "outside/a.txt",
    ])
      put(r, p, "a\n");
    commit(r);
    put(r, ".git/info/attributes", "one.gen -dotln-generated\n");
    const global = join(base, "attrs");
    writeFileSync(global, "outside/** dotln-documentation\n");
    git(r, ["config", "core.attributesFile", global]);
    git(r, ["sparse-checkout", "init", "--cone"]);
    git(r, ["sparse-checkout", "set", "nested"]);
    const linked = join(base, "linked");
    git(r, ["worktree", "add", "-q", "--detach", linked]);
    const ps = [
      "one.gen",
      "README.md",
      "nested/keep.gen",
      "nested/other.gen",
      "outside/a.txt",
    ];
    for (const cwd of [r, linked]) {
      const idx = git(cwd, [
        "rev-parse",
        "--path-format=absolute",
        "--git-path",
        "index",
      ]).trim();
      const before = readFileSync(idx);
      const expected = git(
        cwd,
        [
          "check-attr",
          "--source=HEAD",
          "-z",
          "--stdin",
          "dotln-generated",
          "dotln-documentation",
        ],
        { input: ps.join("\0") + "\0" },
      );
      isolated(base, () => {
        assert.equal(codeAttributes(cwd, "HEAD", ps), expected);
        assert.throws(
          () => codeAttributes(cwd, "missing-revision", ps),
          (e) => e.blockerClass === "host-runtime",
        );
      });
      assert.deepEqual(readFileSync(idx), before);
    }
  }));

test("main-intake accepts an ordinary space-bearing path and leaves a newline path unresolved", () =>
  fixture((base) => {
    for (const name of ["main with spaces", "main\nwith newline"]) {
      const r = repo(base, name);
      put(r, ".gitignore", "docs/intake/\n");
      commit(r);
      const linked = join(base, `${name}-linked`);
      git(r, ["worktree", "add", "-q", "--detach", linked]);
      isolated(base, () => {
        if (name.includes("\n"))
          assert.throws(
            () => mainCheckoutIntake(linked),
            /main checkout ignored intake unavailable/,
          );
        else assert.equal(mainCheckoutIntake(linked), join(r, "docs/intake"));
      });
    }
  }));

test("backend lookup returns files for absent and explicit files configuration under the shim", () =>
  fixture((base) => {
    const r = repo(base);
    isolated(base, () => assert.equal(refStorageBackend(r), "files"));
    git(r, ["config", "core.repositoryformatversion", "1"]);
    git(r, ["config", "extensions.refStorage", "files"]);
    isolated(base, () => assert.equal(refStorageBackend(r), "files"));
  }));

test("current candidate consumes an intact complete review row and its Preflight coverage", async (t) => {
  const identity = gateCodeIdentity(root);
  assert.equal(
    identity,
    "829321f5612f56825c220cfe081dd25a0ffb4f0ef85eda73a18a6c1772d953a4",
  );
  const required = [
    "structural",
    "runner-fixtures",
    "worktree",
    "target-worktree",
    "target-publish",
    "release",
    "harness-fixtures",
    "skeleton",
    "launchpad",
    "host",
  ];
  const rows = readGateChecks(root).filter((r) => r.codeIdentity === identity);
  const review = rows.filter((r) => r.checkId === "npm test").at(-1);
  t.diagnostic(
    JSON.stringify({
      identity,
      rows: rows.map(({ checkId, recordedAt, exitCode, requiredSuites }) => ({
        checkId,
        recordedAt,
        exitCode,
        suites: requiredSuites?.length,
      })),
      reviewFields: Object.keys(review),
    }),
  );
  const complete = await coveringGateCheck(
    root,
    "npm test",
    review.requiredSuites,
    identity,
  );
  assert.ok(
    complete.row,
    JSON.stringify({
      missing: complete.missing,
      displaced: complete.displaced?.tasks,
    }),
  );
  assert.equal(complete.row.exitCode, 0);
  assert.equal(complete.row.requiredSuites.length, 46);
  assert.ok(complete.row.taskTimeline.every((row) => row.exitCode === 0));
  for (const suite of required.slice(1))
    assert.ok(complete.row.requiredSuites.includes(suite), suite);
  t.diagnostic(
    JSON.stringify({
      completeAt: complete.row.recordedAt,
      gateSelection: complete.row.gateSelection,
      taskCount: complete.row.taskTimeline.length,
      checkId: complete.row.checkId,
      coveredPreflight: required.slice(1),
      candidateTree: gateTreeHash(root),
    }),
  );
});
