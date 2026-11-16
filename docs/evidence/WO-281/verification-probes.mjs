// Independent VER-001 probes. Writes only within the caller's session scratch.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  paragraphsOver,
  longParagraphs,
  paragraphFigure,
} from "../../../scripts/docs-check.mjs";
import { branchChanges } from "../../../scripts/lib/branch-changes.mjs";
import {
  LEGACY_DOCS_MAPS,
  planStarterSeeds,
} from "../../../scripts/lib/starter-seeds.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const scratch = process.argv[2];
assert.ok(
  scratch && resolve(scratch) !== root,
  "Supply the session scratch directory",
);
const dir = mkdtempSync(join(scratch, "ver001-"));
const write = (base, name, text) => {
  mkdirSync(dirname(join(base, name)), { recursive: true });
  writeFileSync(join(base, name), text);
};
const git = (base, ...args) =>
  execFileSync("git", args, {
    cwd: base,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
assert.equal(realpathSync(root), git(root, "rev-parse", "--show-toplevel"));
const sha = (text) => createHash("sha256").update(text).digest("hex");
const results = [];
const init = (name) => {
  const base = join(dir, name);
  mkdirSync(base, { recursive: true });
  git(base, "init", "-q", "-b", "main");
  assert.equal(realpathSync(base), git(base, "rev-parse", "--show-toplevel"));
  return base;
};
const commit = (base) => {
  git(base, "add", "-A");
  git(
    base,
    "-c",
    "user.name=Verification fixture",
    "-c",
    "user.email=probe@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "-qm",
    "fixture",
  );
  return git(base, "rev-parse", "HEAD");
};

// Execute the inventory in a mirror; its record-writing behavior cannot alter
// the executor's immutable readings. The shared Git metadata is read only.
const mirror = join(dir, "inventory");
mkdirSync(join(mirror, "docs/evidence/WO-281"), { recursive: true });
symlinkSync(join(root, ".git"), join(mirror, ".git"));
symlinkSync(join(root, "scripts"), join(mirror, "scripts"));
for (const name of ["inventory.mjs", "decisions.md", "inventory-base.json"])
  copyFileSync(
    join(root, "docs/evidence/WO-281", name),
    join(mirror, "docs/evidence/WO-281", name),
  );
copyFileSync(join(root, "docs/KIT.md"), join(mirror, "docs/KIT.md"));
const inventory = () =>
  spawnSync(
    process.execPath,
    [join(mirror, "docs/evidence/WO-281/inventory.mjs")],
    { cwd: mirror, encoding: "utf8" },
  );
let run = inventory();
assert.equal(run.status, 0, run.stderr + run.stdout);
assert.match(run.stdout, /absent 3 \(named 3, unnamed 0\)/u);
const original = readFileSync(join(root, "docs/KIT.md"), "utf8");
const baseline = JSON.parse(
  readFileSync(join(root, "docs/evidence/WO-281/inventory-base.json"), "utf8"),
);
const baseText = execFileSync(
  "git",
  ["show", `${baseline.commit}:docs/KIT.md`],
  { cwd: root, encoding: "utf8" },
);
assert.equal(sha(baseText), baseline.sha256);
const candidate = JSON.parse(
  readFileSync(
    join(mirror, "docs/evidence/WO-281/inventory-candidate.json"),
    "utf8",
  ),
);
assert.equal(candidate.sha256, sha(original));
assert.deepEqual(
  original.split("\n").filter((line) => line.startsWith("## ")),
  baseText.split("\n").filter((line) => line.startsWith("## ")),
);
assert.equal(
  git(root, "hash-object", "docs/KIT.md"),
  "5e61a637f6f3b776711959d2d0326e17c12ff37c",
);
assert.equal(
  execFileSync("git", ["show", "refs/dotln/checkpoint/WO-281/3:docs/KIT.md"], {
    cwd: root,
    encoding: "utf8",
  }),
  original,
);
results.push({
  probe: "inventory and preserved final reader subject",
  pass: true,
  base: baseline.commit,
  candidateSha256: candidate.sha256,
  absentNamed: 3,
  unnamed: 0,
  baseLongParagraphs: paragraphsOver(baseText, 120).length,
  candidateLongParagraphs: paragraphsOver(original, 120).length,
});
assert.ok(original.includes("`^24.15.0 || ^26.0.0`"));
write(
  mirror,
  "docs/KIT.md",
  original.replaceAll("`^24.15.0 || ^26.0.0`", "the declared Node range"),
);
run = inventory();
assert.equal(run.status, 1, run.stderr + run.stdout);
assert.match(run.stdout, /unnamed: code span.*\^24\.15\.0/u);
results.push({
  probe: "inventory detects an unaccounted removed code span in scratch",
  pass: true,
});
copyFileSync(
  join(root, "docs/evidence/WO-281/map-renderings.mjs"),
  join(mirror, "docs/evidence/WO-281/map-renderings.mjs"),
);
const renderings = execFileSync(
  process.execPath,
  [
    join(mirror, "docs/evidence/WO-281/map-renderings.mjs"),
    "--until",
    baseline.commit,
  ],
  { cwd: mirror, encoding: "utf8" },
);
assert.match(renderings, /5 renderings over 28 commits; 0 unread/u);
const renderingRecord = readFileSync(
  join(mirror, "docs/evidence/WO-281/map-renderings.md"),
  "utf8",
);
for (const hash of LEGACY_DOCS_MAPS) assert.ok(renderingRecord.includes(hash));
results.push({
  probe: "all five historical map hashes reproduced from 28 source revisions",
  pass: true,
});

// A supported edit made solely by deleting a paragraph separator still lists
// the newly joined long paragraph. A strict boundary and nested quote matter.
const pageRoot = init("paragraphs");
const words = (n) => Array(n).fill("word").join(" ");
write(pageRoot, "docs/guide.md", `# Guide\n\n${words(65)}\n\n${words(66)}\n`);
commit(pageRoot);
git(pageRoot, "checkout", "-qb", "probe");
write(pageRoot, "docs/guide.md", `# Guide\n\n${words(65)}\n${words(66)}\n`);
const rows = longParagraphs(pageRoot, {
  kinds: new Map([["docs/guide.md", { kind: "standing" }]]),
  changes: branchChanges(pageRoot),
  kitFiles: null,
  figure: 120,
});
assert.deepEqual(rows, [{ file: "docs/guide.md", line: 3, words: 131 }]);
assert.equal(paragraphsOver(words(120), 120).length, 0);
assert.equal(paragraphsOver(`> ${words(121)}`, 120).length, 1);
assert.equal(
  paragraphsOver(`\`\`\`text\n${words(200)}\n\`\`\``, 120).length,
  0,
);
for (const value of [null, 0, -1, "many", {}, 120.5]) {
  write(
    pageRoot,
    "docs/control/budgets.json",
    JSON.stringify({ documents: { paragraphWords: value } }),
  );
  const read = paragraphFigure(pageRoot);
  assert.equal(read.figure, value === null ? null : 120);
  if (value !== null) assert.ok(read.note);
}
results.push({
  probe:
    "paragraph deletion join, strict threshold, quote, fence, invalid figures and opt-out",
  pass: true,
});

// Exercise the newer template-backed proof route, which the executor's large
// refresh fixture covers only through legacy rendered maps.
const core = init("template-core");
const starter = init("template-starter");
const pairs = [
  ["README.md", "README.client.md"],
  [".gitignore", "gitignore.template"],
  ["CLAUDE.md", "CLAUDE.template.md"],
  ["AI-HARNESS-SECURITY.md", "AI-HARNESS-SECURITY.template.md"],
  ["docs/workstreams/README.md", "workstream.template.md"],
  ["docs/repositories/README.md", "repository-profile.template.md"],
  ["docs/work-orders/WO-001-environment-truth.md", "first-order.template.md"],
  ["docs/control/budgets.json", "budgets.template.json"],
  ["docs/README.md", "docs-map.template.md"],
];
for (const [seed, template] of pairs) {
  const text = `# ${template}\n\nPrior exported content.\n`;
  write(core, `scripts/kit/${template}`, text);
  write(starter, `scripts/kit/${template}`, text);
  write(starter, seed, text);
}
const old = commit(core);
const files = pairs.map(([, template]) => ({
  path: `scripts/kit/${template}`,
  sha256: sha(readFileSync(join(core, `scripts/kit/${template}`))),
}));
write(starter, "KIT-MANIFEST.json", JSON.stringify({ commit: old, files }));
commit(starter);
const newer = "# docs\n\nUpdated documentation map.\n";
write(core, "scripts/kit/docs-map.template.md", newer);
const head = commit(core);
const plan = () =>
  planStarterSeeds({ main: core, head, checkout: starter, remote: "HEAD" });
let planned = plan();
assert.deepEqual(
  planned.rewrites.map((x) => x.path),
  ["docs/README.md"],
);
assert.equal(planned.rewrites[0].bytes, newer);
assert.deepEqual(planned.kept, []);
write(
  starter,
  "docs/README.md",
  "# Our documentation\n\nOwner-edited content.\n",
);
commit(starter);
planned = plan();
assert.deepEqual(planned.rewrites, []);
assert.equal(planned.kept[0].path, "docs/README.md");
assert.match(planned.kept[0].reason, /customized/u);
results.push({
  probe: "prior template-backed map advances; owner-edited map stays",
  pass: true,
});
writeFileSync(
  join(scratch, "verification-results.json"),
  JSON.stringify(results, null, 2) + "\n",
);
console.log(JSON.stringify(results, null, 2));
