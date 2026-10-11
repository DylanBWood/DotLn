// VER-003 independent probe for WO-078 criterion 1's hand-edit refusal after
// the D012 repair. Builds a synthetic launchpad with its own Git history under
// the system temporary directory, never touches the repository under test, and
// prints one JSON observation per case. Every case named "refuse" must exit 1
// and leave every generated output and input byte-identical; every case named
// "pass" must exit 0 with the page unchanged; "limit" cases are recorded only.
// Run from the repository root:
// node scripts/harness.mjs bounded -- node docs/evidence/WO-078/verification-003-probe.mjs
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
const scratch = realpathSync(mkdtempSync(join(tmpdir(), "dotln-ver003-")));
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
    { DOTLN_LAUNCHPAD: root },
  );
const read = (p) => readFileSync(join(root, p), "utf8");
const write = (p, text) => {
  mkdirSync(dirname(join(root, p)), { recursive: true });
  writeFileSync(join(root, p), text);
};
const json = (v) => `${JSON.stringify(v, null, 2)}\n`;
const files = () => {
  const list = [page, obs, decl];
  const receipts = "docs/evidence/siblings/probe-starter";
  for (const name of readdirSync(join(root, receipts)).sort())
    list.push(`${receipts}/${name}`);
  return Object.fromEntries(list.map((p) => [p, read(p)]));
};
const out = [];
let failures = 0;
const kitLine = (text) => text.match(/^- \*\*Kit version:\*\* .*$/mu)[0];

// Edit the page and the observations together, so the page is exactly what
// the generator renders from the edited observations; then judge the check.
const coordinated = (name, expect, change, pageEdit) => {
  const before = files();
  const record = JSON.parse(before[obs]);
  change(record.commits);
  write(obs, json(record));
  write(
    page,
    pageEdit(before[page]).replace(
      /^<!-- dotln-sibling-tags:.*$/mu,
      `<!-- dotln-sibling-tags:${JSON.stringify(record.commits)} -->`,
    ),
  );
  judge(name, expect, before);
};
const judge = (name, expect, restore) => {
  const edited = files();
  const result = gen("index", "--check");
  const after = files();
  const unchanged = JSON.stringify(after) === JSON.stringify(edited);
  const leftovers = readdirSync(join(root, "docs/siblings")).filter((n) =>
    n.endsWith(".tmp"),
  );
  const ok =
    expect === "limit" ||
    (expect === "refuse"
      ? result.status === 1 && unchanged && !leftovers.length
      : result.status === 0 && unchanged);
  if (!ok) failures += 1;
  out.push({
    name,
    expect,
    checkExit: result.status,
    noWrite: unchanged,
    tmpLeftovers: leftovers,
    kitVersionLine: kitLine(edited[page]),
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    ok,
  });
  for (const [p, text] of Object.entries(restore)) write(p, text);
};

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
  const commit = (label) => {
    write("README.md", `${label}\n`);
    git("add", ".");
    git("commit", "-qm", label);
    return git("rev-parse", "HEAD");
  };
  // c0 (v0.9.0) -> c1 (annotated v1.0.0, receipt r1) -> u (untagged,
  // receipt r2) -> c2 (lightweight v2.0.0, a future tag for both receipts);
  // s1 is a side commit off c0 tagged side-1.0, never an ancestor of c1 or u.
  const c0 = commit("c0");
  git("tag", "v0.9.0");
  const c1 = commit("c1");
  git("tag", "-a", "v1.0.0", "-m", "one");
  const u = commit("u");
  const c2 = commit("c2");
  git("tag", "v2.0.0");
  git("checkout", "-q", "-b", "side", c0);
  const s1 = commit("s1");
  git("tag", "side-1.0");
  git("checkout", "-q", "main");
  const fields = {
    sibling: "probe-starter",
    manifestBytes: Buffer.from("{}\n"),
    buildHash: buildHashOf(".runtime/harness/0123456789abcdef"),
  };
  writeReceipt(root, { ...fields, coreCommit: c1 });
  const wait = Date.now() + 5;
  while (Date.now() < wait);
  writeReceipt(root, { ...fields, coreCommit: u });
  assert.equal(gen("index").status, 0);
  const base = gen("index", "--check");
  const baseline = files();
  out.push({
    name: "baseline generation and check",
    expect: "pass",
    checkExit: base.status,
    observations: JSON.parse(baseline[obs]).commits,
    kitVersionLine: kitLine(baseline[page]),
    ok: base.status === 0,
  });
  if (base.status !== 0) failures += 1;
  const v1 = "`v1.0.0`";
  const nearestU = "none at the commit (nearest below: `v1.0.0`)";

  coordinated(
    "H1 r2 nearest invented (v9.9.9) in page and observations",
    "refuse",
    (c) => (c[u].nearest = "v9.9.9"),
    (t) => t.replaceAll(nearestU, nearestU.replace("v1.0.0", "v9.9.9")),
  );
  coordinated(
    "H2 r2 nearest is a real tag at a descendant (future v2.0.0)",
    "refuse",
    (c) => (c[u].nearest = "v2.0.0"),
    (t) => t.replaceAll(nearestU, nearestU.replace("v1.0.0", "v2.0.0")),
  );
  coordinated(
    "H3 r2 nearest is a real tag on a non-ancestor side branch (side-1.0)",
    "refuse",
    (c) => (c[u].nearest = "side-1.0"),
    (t) => t.replaceAll(nearestU, nearestU.replace("v1.0.0", "side-1.0")),
  );
  coordinated(
    "H4 r1 exact tag is a real tag at another commit (v2.0.0)",
    "refuse",
    (c) => (c[c1].tag = "v2.0.0"),
    (t) => t.replace(`| ${v1} |`, "| `v2.0.0` |"),
  );
  coordinated(
    "H5 r1 exact tag is a revision expression resolving to the commit (v1.0.0^{})",
    "refuse",
    (c) => (c[c1].tag = "v1.0.0^{}"),
    (t) => t.replace(`| ${v1} |`, "| `v1.0.0^{}` |"),
  );
  coordinated(
    "H6 r1 exact tag is a full refname of the real tag (refs/tags/v1.0.0)",
    "refuse",
    (c) => (c[c1].tag = "refs/tags/v1.0.0"),
    (t) => t.replace(`| ${v1} |`, "| `refs/tags/v1.0.0` |"),
  );
  coordinated(
    "H7 r1 exact tag is a prefix of the real tag (v1.0)",
    "refuse",
    (c) => (c[c1].tag = "v1.0"),
    (t) => t.replace(`| ${v1} |`, "| `v1.0` |"),
  );
  coordinated(
    "H8 observations add a known non-receipt commit with its real tag",
    "refuse",
    (c) => (c[c0] = { tag: "v0.9.0", nearest: "v0.9.0" }),
    (t) => t,
  );

  // Page-only edits of fields that come from receipts and Git, not from the
  // captured observations.
  const pageOnly = (name, edit) => {
    write(page, edit(baseline[page]));
    judge(name, "refuse", baseline);
  };
  pageOnly("H9 page-only edit of Orders in core that advanced it", (t) =>
    t.replace(
      /^(- \*\*Orders in core that advanced it:\*\* ).*$/mu,
      "$1`WO-999`",
    ),
  );
  pageOnly("H10 page-only edit of Core commit to an earlier real commit", (t) =>
    t.replace(/^(- \*\*Core commit:\*\* ).*$/mu, `$1\`${c1}\``),
  );
  pageOnly("H11 page-only edit of Build hash", (t) =>
    t.replace(/^(- \*\*Build hash:\*\* ).*$/mu, "$1`fnv1a64:fedcba9876543210`"),
  );
  pageOnly("H12 page-only edit of Kit version to the real tag of r1", (t) =>
    t.replace(/^(- \*\*Kit version:\*\* ).*$/mu, `$1${v1}`),
  );

  // A captured tag deleted after generation: the check refuses and the
  // ordinary generator repairs the pair.
  git("tag", "-d", "v1.0.0");
  judge(
    "H13 captured exact tag deleted from Git after generation",
    "refuse",
    {},
  );
  const regen = gen("index");
  const regenCheck = gen("index", "--check");
  out.push({
    name: "H13' generator after the deletion, then check",
    expect: "pass",
    generateExit: regen.status,
    checkExit: regenCheck.status,
    kitVersionLine: kitLine(read(page)),
    ok: regen.status === 0 && regenCheck.status === 0,
  });
  if (regen.status !== 0 || regenCheck.status !== 0) failures += 1;
  git("tag", "-a", "v1.0.0", c1, "-m", "one");
  assert.equal(gen("index").status, 0);
  assert.equal(JSON.stringify(files()), JSON.stringify(baseline));

  // Later tags at r1's commit and at u, nothing edited: newer evidence only.
  git("tag", "v1.0.1", c1);
  git("tag", "v1.5.0", u);
  judge("H14 later tags at both receipt commits, nothing edited", "pass", {});
  git("tag", "-d", "v1.0.1");
  git("tag", "-d", "v1.5.0");

  // Limits in VER-002's recorded class: real tags at or below the commit.
  coordinated(
    "L1 r1 recorded as untagged with the tag at the commit as nearest",
    "limit",
    (c) => (c[c1] = { tag: null, nearest: "v1.0.0" }),
    (t) =>
      t.replace(
        `| ${v1} |`,
        "| none at the commit (nearest below: `v1.0.0`) |",
      ),
  );
  coordinated(
    "L2 r2 nearest substituted by an older ancestor tag (v0.9.0)",
    "limit",
    (c) => (c[u].nearest = "v0.9.0"),
    (t) => t.replaceAll(nearestU, nearestU.replace("v1.0.0", "v0.9.0")),
  );
  // A formatting-only rewrite of the observations, values unchanged.
  write(obs, `${JSON.stringify(JSON.parse(baseline[obs]))}\n`);
  judge("L3 observations minified, values unchanged", "limit", baseline);

  assert.equal(JSON.stringify(files()), JSON.stringify(baseline));
  console.log(
    JSON.stringify(
      {
        cutoff: new Date().toISOString(),
        commits: { c0, c1, u, c2, s1 },
        failures,
        out,
      },
      null,
      2,
    ),
  );
  process.exitCode = failures ? 1 : 0;
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
