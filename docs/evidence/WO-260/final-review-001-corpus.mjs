// FINAL-001 observation for WO-260: which script files the kit carries outside
// scripts/ and packages/, whether the Git surface check reads them, and what
// its own reader names in them. The check lists the files under scripts/ and
// packages/ only, so the kit's test support files under corpus/ are placed
// under scripts/ of a scratch tree that holds the real record and read there.
// The probe exits 0 while the observation FINAL-001 reports still holds: the
// check reads none of those files, and their forms are recorded except
// `apply --unidiff-zero`. Run from the worktree root:
//   node scripts/harness.mjs bounded -- node docs/evidence/WO-260/final-review-001-corpus.mjs
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const mod = (path) => import(pathToFileURL(join(root, path)).href);
const { TEST_SUPPORT_FILES } = await mod("scripts/launchpad.mjs");
const { checkGitSurface, readGitSurface, readGitSurfaceRecord } = await mod(
  "scripts/lib/git-surface.mjs",
);
const { createFixtureRoot, removeTemporaryPath } = await mod(
  "scripts/lib/temporary-roots.mjs",
);
const { isolatedGitEnvironment } = await mod("scripts/lib/git.mjs");

// The script files the kit carries that the check's two directories do not
// hold: a source extension the reader takes, or a shell shebang.
const carried = TEST_SUPPORT_FILES.filter(
  (path) =>
    !/^(?:scripts|packages)\//u.test(path) &&
    (/\.(?:mjs|cjs|js|ts|sh)$/u.test(path) ||
      /^#!\s*\S*\/(?:env\s+)?(?:ba|z|da)?sh\b/u.test(
        readFileSync(join(root, path), "utf8").slice(0, 64),
      )),
);
const readHere = new Set(readGitSurface(root).map(({ file }) => file));
const readOutside = [...readHere].filter(
  (file) => !/^(?:scripts|packages)\//u.test(file),
);

const scratch = createFixtureRoot(join(tmpdir(), "dotln-final260-001-"));
let observed;
try {
  const tree = join(scratch, "tree");
  mkdirSync(join(tree, "scripts/lib"), { recursive: true });
  const init = spawnSync("git", ["init", "-q"], {
    cwd: tree,
    encoding: "utf8",
    env: { ...process.env, ...isolatedGitEnvironment(scratch) },
  });
  assert.equal(init.status, 0, init.stderr);
  writeFileSync(
    join(tree, "package.json"),
    JSON.stringify({ engines: { git: readGitSurfaceRecord(root).floor } }),
  );
  cpSync(
    join(root, "scripts/lib/git-surface.json"),
    join(tree, "scripts/lib/git-surface.json"),
  );
  for (const path of carried) {
    mkdirSync(dirname(join(tree, "scripts", path)), { recursive: true });
    cpSync(join(root, path), join(tree, "scripts", path));
  }
  const readings = readGitSurface(tree);
  const record = readGitSurfaceRecord(root);
  const forms = [...new Set(readings.map(({ form }) => form))].sort();
  const check = checkGitSurface(tree);
  observed = {
    carried,
    filesTheCheckReadsOutsideItsTwoDirectories: readOutside,
    carriedFilesNamingGit: [
      ...new Set(readings.map(({ file }) => file.replace(/^scripts\//u, ""))),
    ].sort(),
    forms,
    unrecorded: forms.filter((form) => !record.forms.includes(form)),
    checkOverTheCopies: {
      exitCode: check.exitCode,
      firstLine: check.output.split("\n")[0],
    },
    checkOverThisRepository: checkGitSurface(root).exitCode,
  };
} finally {
  removeTemporaryPath(scratch, { recursive: true, force: true });
}
console.log(JSON.stringify(observed, null, 2));
assert.deepEqual(observed.filesTheCheckReadsOutsideItsTwoDirectories, []);
assert.deepEqual(observed.unrecorded, ["apply --unidiff-zero"]);
assert.equal(observed.checkOverTheCopies.exitCode, 1);
assert.equal(observed.checkOverThisRepository, 0);
