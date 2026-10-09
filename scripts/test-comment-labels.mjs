import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { spawnGit } from "./lib/git.mjs";
import { sha256Hex } from "./lib/helpers.mjs";
import {
  checkCommentLabels,
  commentFiles,
  writeCommentBaseline,
} from "./lib/comment-labels.mjs";
import { suites } from "./test-runner.mjs";

const normalized = (text) => text.replace(/\s+/gu, " ").trim();
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "dotln-comment-labels-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  assert.equal(spawnGit(["init", "-q", root]).status, 0);
  const write = (path, source) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), source);
  };
  write("dotln.config.json", JSON.stringify({ version: 1, roots: {} }));
  // The real evidence-source registry is read: scripts/lib/paths.mjs is
  // registered there and scripts/other.mjs is not.
  const baseline = { schemaVersion: 1, admitted: {}, lines: {} };
  const check = (files) => checkCommentLabels(root, { baseline, files });
  return { root, write, baseline, check };
}

test("a new comment line that carries a finding label, a bare decision number or a leading order identifier fails; an explanation passes", (t) => {
  const f = fixture(t);
  f.write(
    "scripts/x.mjs",
    [
      "// VER-001 F1: refuse a symlink",
      "const a = 1;",
      "// keeps its receipt (D010)",
      "const b = 2;",
      "// WO-123: refuse x",
      "const c = 3;",
      "// Refuse a symlinked evidence directory so a copy cannot escape the order.",
      "const d = 4;",
      "// Refuse a symlinked evidence directory so a copy cannot escape (WO-123).",
      "const e = 5;",
      "// The string on the next line holds a label; only comments are judged.",
      'const f = "// VER-001 F1";',
      "const g = `// WO-999: template`;",
      "// Spans a wrap: the receipt of WO-112",
      "// D025 stands, so the number is qualified.",
      "/** Reviewed under WO-173",
      " * D016 names the rule; the block qualifies it. */",
      "const h = 6;",
      "/** WO-172: a recorded correction is a decision. */",
      "const i = 7;",
      "/**",
      " * WO-173 leads on the second line of a block.",
      " */",
      "const j = 8;",
      "// Fixes B3 from the review.",
      "// Stands per finding 3 of VER-002.",
    ].join("\n") + "\n",
  );
  const result = f.check(["scripts/x.mjs"]);
  assert.deepEqual(
    result.findings.map((row) => [row.line, row.kind]),
    [
      [1, "finding-label"],
      [3, "decision-number"],
      [5, "order-lead"],
      [19, "order-lead"],
      [22, "order-lead"],
      [25, "finding-label"],
      [26, "finding-label"],
    ],
  );
  assert.deepEqual(result.failures.slice(0, 3), [
    "scripts/x.mjs:1: comment finding-label; say what the finding changed, in words a reader who has not seen the report understands",
    "scripts/x.mjs:3: comment decision-number; qualify it with its order (WO-NNN D0NN) or say what the decision decided",
    "scripts/x.mjs:5: comment order-lead; lead with what the code does or why; an order identifier may follow the explanation",
  ]);
  assert.equal(result.failures.length, 7);
  // Findings carry fingerprints, never the line's text.
  assert.doesNotMatch(JSON.stringify(result.findings), /refuse a symlink/);
});

test("today's lines pass by fingerprint baseline; an edited baselined line fails and its old entry is stale; a fixed line shrinks the baseline", (t) => {
  const f = fixture(t);
  const file = "scripts/lib/paths.mjs";
  f.write(file, "// VER-001 F1: refuse a symlink\nexport const a = 1;\n");
  const [finding] = f.check([file]).findings;
  f.baseline.lines = { [file]: { [finding.fingerprint]: 1 } };
  assert.equal(
    finding.fingerprint,
    sha256Hex(normalized("VER-001 F1: refuse a symlink")),
  );
  let result = f.check([file]);
  assert.deepEqual(result.failures, []);
  assert.equal(result.baselined, 1);
  // Edited without being fixed: the new line fails and the old entry is stale.
  f.write(file, "// VER-001 F1: refuse a symlink twice\nexport const a = 1;\n");
  result = f.check([file]);
  assert.equal(result.failures.length, 2, JSON.stringify(result.failures));
  assert.match(
    result.failures[0],
    /^scripts\/lib\/paths\.mjs:1: comment finding-label/,
  );
  assert.match(
    result.failures[1],
    /no longer holds 1 baselined comment line; run node scripts\/comment-labels\.mjs --write/,
  );
  assert.deepEqual(result.stale, [
    { file, fingerprint: finding.fingerprint, count: 1 },
  ]);
  // A pasted duplicate exceeds the count.
  f.write(
    file,
    "// VER-001 F1: refuse a symlink\n// VER-001 F1: refuse a symlink\nexport const a = 1;\n",
  );
  assert.equal(f.check([file]).failures.length, 1);
  // Fixed: no finding, one stale entry, and --write shrinks the baseline.
  f.write(
    file,
    "// Refuse a symlink so a copy cannot escape the order.\nexport const a = 1;\n",
  );
  result = f.check([file]);
  assert.equal(result.findings.length, 0);
  assert.equal(result.stale.length, 1);
  // A baseline entry for a file in no evidence edition is refused.
  f.baseline.lines = { "scripts/other.mjs": { [finding.fingerprint]: 1 } };
  f.write("scripts/other.mjs", "// VER-001 F1: refuse a symlink\n");
  result = f.check(["scripts/other.mjs"]);
  assert.match(
    result.failures[0],
    /scripts\/other\.mjs is in no evidence edition and carries no admission/,
  );
  f.baseline.admitted = { "scripts/other.mjs": "a self-hashing fixture" };
  assert.deepEqual(f.check(["scripts/other.mjs"]).failures, []);
});

test("shell comments count, including JavaScript comments inside heredocs; generated and documentation files are left out", (t) => {
  const f = fixture(t);
  f.write(
    "scripts/run.sh",
    "#!/bin/bash\n# WO-044: every blocker\necho ok\nnode - <<'JS'\n// VER-001 F3: a label\nJS\ncat >order.md <<EOF\n# WO-099 — a heading the fixture writes, not a comment\nEOF\ngrep -Fq 'x' <<<\"$output\"\n# WO-001: a here-string opened no heredoc\n# Lists every blocker at once, so clearing them costs one run.\n",
  );
  const result = f.check(["scripts/run.sh"]);
  assert.deepEqual(
    result.findings.map((row) => [row.line, row.kind]),
    [
      [2, "order-lead"],
      [5, "finding-label"],
      [11, "order-lead"],
    ],
  );
  f.write(".gitattributes", "/generated/** dotln-generated\n");
  f.write("generated/x.mjs", "// VER-001 F1\n");
  f.write("docs/evidence/WO-1/probe.mjs", "// F1: a record\n");
  f.write("node_modules/dep/index.js", "// VER-001 F1\n");
  f.write("scripts/kept.mjs", "// WO-001: lead\n");
  assert.deepEqual(commentFiles(f.root), [
    "scripts/kept.mjs",
    "scripts/run.sh",
  ]);
});

test("the baseline writer shrinks, never grows, and the command prints its failures", (t) => {
  const f = fixture(t);
  f.write("scripts/lib/paths.mjs", "// VER-001 F1: refuse a symlink\n");
  f.write("scripts/lib/git.mjs", "// Explains itself.\n");
  writeCommentBaseline(f.root, {
    grow: true,
    date: "2026-10-08",
    decision: "fixture",
  });
  const written = JSON.parse(
    readFileSync(join(f.root, "docs/control/comment-baseline.json"), "utf8"),
  );
  assert.deepEqual(Object.keys(written.lines), ["scripts/lib/paths.mjs"]);
  f.write("scripts/lib/git.mjs", "// WO-001: a new lead\n");
  assert.throws(
    () => writeCommentBaseline(f.root),
    /outside the baseline is fixed, never baselined/,
  );
  const cli = spawnSync(
    process.execPath,
    [join(process.cwd(), "scripts/comment-labels.mjs")],
    {
      cwd: f.root,
      env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
      encoding: "utf8",
    },
  );
  assert.equal(cli.status, 1, cli.stdout + cli.stderr);
  assert.match(cli.stderr, /FAIL scripts\/lib\/git\.mjs:1: comment order-lead/);
  assert.match(
    cli.stdout,
    /FAIL comment labels: 2 code files; 1 baselined lines; 1 failures/,
  );
  f.write("scripts/lib/git.mjs", "// Explains itself.\n");
  f.write(
    "scripts/lib/paths.mjs",
    "// Refuses a symlink so a copy cannot escape.\n",
  );
  const shrunk = writeCommentBaseline(f.root);
  assert.deepEqual(shrunk, { files: 0, lines: 0 });
  const pass = spawnSync(
    process.execPath,
    [join(process.cwd(), "scripts/comment-labels.mjs")],
    {
      cwd: f.root,
      env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
      encoding: "utf8",
    },
  );
  assert.equal(pass.status, 0, pass.stdout + pass.stderr);
});

test("the comment check and its fixtures run only in the document selection", () => {
  for (const name of ["comment-labels", "comment-labels-fixtures"]) {
    const row = suites.find((entry) => entry.name === name);
    assert.equal(row.document, true, name);
    assert.equal(row.product, false, name);
    assert.equal(row.machinery, false, name);
  }
});
