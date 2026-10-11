// VER-002 independent probe for WO-078 criterion 1's hand-edit refusal after
// the D010 repair. Builds a synthetic launchpad with its own Git history under
// the system temporary directory, never touches the repository under test, and
// prints one JSON observation per case. Case C's check exit 0 reproduces
// VER-002 F1; a repaired subject exits 1 there. Run from the repository root:
// node scripts/harness.mjs bounded -- node docs/evidence/WO-078/verification-002-probe.mjs
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const repository = realpathSync(resolve(process.argv[2] ?? process.cwd()));
const { writeReceipt, buildHashOf } = await import(
  pathToFileURL(join(repository, "scripts/lib/siblings.mjs"))
);
const scratch = realpathSync(mkdtempSync(join(tmpdir(), "dotln-ver002-")));
const root = join(scratch, "launchpad");
const page = "docs/siblings/README.md";
const obs = "docs/siblings/tag-observations.json";
const decl = "docs/siblings/siblings.json";
const run = (command, args, cwd, extra = {}) =>
  spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, ...extra },
  });
const git = (...args) => {
  const r = run("git", args, root);
  assert.equal(r.status, 0, `git ${args.join(" ")}: ${r.stderr}`);
  return r.stdout.trim();
};
const gen = (...args) =>
  run(
    process.execPath,
    [join(repository, "scripts/siblings.mjs"), ...args],
    scratch,
    {
      DOTLN_LAUNCHPAD: root,
    },
  );
const read = (p) => readFileSync(join(root, p), "utf8");
const write = (p, text) => {
  mkdirSync(dirname(join(root, p)), { recursive: true });
  writeFileSync(join(root, p), text);
};
const json = (v) => `${JSON.stringify(v, null, 2)}\n`;
const out = [];
const note = (name, value) => out.push({ name, ...value });
try {
  mkdirSync(root);
  git("init", "-q", "-b", "main");
  git("config", "maintenance.auto", "false");
  git("config", "user.name", "Probe");
  git("config", "user.email", "probe@example.invalid");
  write(
    decl,
    json({
      schemaVersion: 1,
      siblings: [
        {
          id: "probe-starter",
          purpose: "Synthetic export.",
          relation: { kind: "export", coreCommit: null },
          capabilityRows: ["launchpad.starter"],
        },
      ],
    }),
  );
  write("README.md", "probe\n");
  git("add", ".");
  git("commit", "-qm", "base");
  const commit = git("rev-parse", "HEAD");
  git("tag", "-a", "v1.0.0", "-m", "first");
  const { path: receiptPath } = writeReceipt(root, {
    sibling: "probe-starter",
    coreCommit: commit,
    manifestBytes: Buffer.from("{}\n"),
    buildHash: buildHashOf(".runtime/harness/0123456789abcdef"),
  });
  assert.equal(gen("index").status, 0);
  const base = gen("index", "--check");
  assert.equal(base.status, 0, base.stderr);
  const page0 = read(page);
  const obs0 = read(obs);
  const receipt0 = read(receiptPath);
  const decl0 = read(decl);
  note("baseline", {
    checkExit: base.status,
    kitVersionLine: page0.match(/^- \*\*Kit version:\*\* .*$/mu)[0],
    observations: JSON.parse(obs0),
  });

  // A: VER-001 F1 as filed: page-only edit of visible version and embedded record.
  write(page, page0.replaceAll("v1.0.0", "v9.8.7-forged"));
  const a = gen("index", "--check");
  note("A page-only compound edit (VER-001 F1)", {
    checkExit: a.status,
    expectedExit: 1,
    stderr: a.stderr.trim(),
  });
  write(page, page0);

  // B: observation-only edit, page untouched.
  write(obs, obs0.replaceAll("v1.0.0", "v9.8.7-forged"));
  const b = gen("index", "--check");
  note("B observation-only edit", {
    checkExit: b.status,
    expectedExit: 1,
    stderr: b.stderr.trim(),
  });
  write(obs, obs0);

  // C: coordinated edit of both generated files to a tag Git never held.
  write(page, page0.replaceAll("v1.0.0", "v9.8.7-forged"));
  write(obs, obs0.replaceAll("v1.0.0", "v9.8.7-forged"));
  const c = gen("index", "--check");
  const tagExists = run(
    "git",
    ["rev-parse", "-q", "--verify", "refs/tags/v9.8.7-forged"],
    root,
  );
  note("C coordinated page + observation edit, invented tag", {
    checkExit: c.status,
    expectedExitIfRefused: 1,
    stdout: c.stdout.trim(),
    stderr: c.stderr.trim(),
    pageKitVersionLine: read(page).match(/^- \*\*Kit version:\*\* .*$/mu)[0],
    forgedTagExistsInGit: tagExists.status === 0,
    gitTagsAtCommit: git("tag", "--points-at", commit),
    receiptUnchanged: read(receiptPath) === receipt0,
    declarationUnchanged: read(decl) === decl0,
  });
  // The ordinary generator, run after C, reverts both files from Git.
  const regen = gen("index");
  note("C' generator after the coordinated edit", {
    exit: regen.status,
    stdout: regen.stdout.trim(),
    pageRestored: read(page) === page0,
    observationsRestored: read(obs) === obs0,
  });

  // D: coordinated edit erasing the version (tag null, nearest null).
  const erased = JSON.parse(obs0);
  erased.commits[commit] = { tag: null, nearest: null };
  write(obs, json(erased));
  write(
    page,
    page0
      .replace(
        /^- \*\*Kit version:\*\* .*$/mu,
        "- **Kit version:** none at the commit",
      )
      .replace(/\| `v1\.0\.0` \|/u, "| none at the commit |")
      .replace(
        /^<!-- dotln-sibling-tags:.*$/mu,
        `<!-- dotln-sibling-tags:${JSON.stringify({ [commit]: { tag: null, nearest: null } })} -->`,
      ),
  );
  const d = gen("index", "--check");
  note("D coordinated edit erasing a real tag", {
    checkExit: d.status,
    stdout: d.stdout.trim(),
    stderr: d.stderr.trim(),
  });
  assert.equal(gen("index").status, 0);
  assert.equal(read(page), page0);

  // E: legitimate later tag at the same commit, nothing edited.
  git("tag", "-a", "v1.1.0", commit, "-m", "later");
  const e = gen("index", "--check");
  note("E later tag, no edit", {
    checkExit: e.status,
    expectedExit: 0,
    stdout: e.stdout.trim(),
    pageUnchanged: read(page) === page0,
  });
  // F: real later tag substituted into both files.
  write(page, page0.replaceAll("v1.0.0", "v1.1.0"));
  write(obs, obs0.replaceAll("v1.0.0", "v1.1.0"));
  const f = gen("index", "--check");
  note("F coordinated substitution of a real later tag at the commit", {
    checkExit: f.status,
    stdout: f.stdout.trim(),
    stderr: f.stderr.trim(),
  });
  git("tag", "-d", "v1.1.0");
  assert.equal(gen("index").status, 0);

  // G: a receipt temporary left by an interrupted writeReceipt.
  const dir = join(root, dirname(receiptPath));
  const leftover = `${readdirSync(dir)[0]}.0f0e0d0c-0000-4000-8000-000000000000.tmp`;
  writeFileSync(join(dir, leftover), "{");
  const g = gen("index", "--check");
  note("G leftover receipt temporary", {
    checkExit: g.status,
    stdout: g.stdout.trim(),
    stderr: g.stderr.trim(),
  });
  rmSync(join(dir, leftover));
  console.log(
    JSON.stringify(
      {
        cutoff: new Date().toISOString(),
        reproducedF1: c.status === 0,
        out,
      },
      null,
      2,
    ),
  );
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
