import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { lintOutwardArtifact } from "./lib/outward-lint.mjs";
import { checkOutwardArtifact } from "./outward-lint.mjs";

const policy = JSON.parse(
  readFileSync(
    new URL("../docs/control/outward-vocabulary.json", import.meta.url),
    "utf8",
  ),
);
const cli = fileURLToPath(new URL("./outward-lint.mjs", import.meta.url));
const lint = (kind, text) =>
  lintOutwardArtifact({
    kind,
    text,
    vocabulary: policy,
    localTerms: { status: "present" },
  });
const rules = (result) => result.findings.map((finding) => finding.rule);
const fixture = (t, control = "docs/control") => {
  const root = mkdtempSync(join(tmpdir(), "outward-lint-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, text) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  write(
    "dotln.config.json",
    JSON.stringify({ version: 1, roots: { control } }),
  );
  write(`${control}/outward-vocabulary.json`, JSON.stringify(policy));
  return {
    root,
    write,
    terms: (text) => write(`${control}/local/terms.txt`, text),
  };
};
const run = (root, kind, text, entry = cli) => {
  const result = spawnSync(process.execPath, [entry, kind], {
    input: text,
    encoding: "utf8",
    env: { ...process.env, DOTLN_LAUNCHPAD: root },
  });
  assert.equal(result.signal, null);
  return result;
};

for (const [name, kind, text, expected] of [
  ["conforming subject", "commit", "fix(parser): handle empty input", []],
  [
    "breaking subject and body",
    "commit",
    "feat(api)!: change response\r\n\r\nExplain the compatibility change.\r\n",
    [],
  ],
  ["missing type", "commit", "handle empty input", ["subject.shape"]],
  ["unknown type", "commit", "ship: handle empty input", ["subject.type"]],
  ["72-character subject", "commit", `fix: ${"x".repeat(67)}`, []],
  [
    "overlength subject",
    "commit",
    `fix: ${"x".repeat(68)}`,
    ["subject.length"],
  ],
  [
    "missing blank line",
    "commit",
    "fix: handle input\nExplain why.",
    ["commit.blank-line"],
  ],
  [
    "blank separator is empty",
    "commit",
    "fix: handle input\n \nExplain why.",
    ["commit.blank-line"],
  ],
  ["empty summary", "commit", "fix: ", ["subject.shape"]],
  ["conforming branch", "branch", "fix/handle-empty-input", []],
  ["nonconforming branch", "branch", "feature_Handle_Input", ["branch.shape"]],
  ["unknown branch type", "branch", "ship/handle-input", ["branch.type"]],
  [
    "branch newline is not content",
    "branch",
    "fix/handle-input\n",
    ["branch.shape"],
  ],
  ["ref traversal refused", "branch", "fix/../main", ["branch.shape"]],
  ["conforming PR title", "pr-title", "fix: handle input", []],
  ["PR title shape", "pr-title", "Handle input", ["subject.shape"]],
  [
    "PR title multiline",
    "pr-title",
    "fix: handle input\nmore",
    ["title.single-line"],
  ],
  [
    "body prose and code",
    "pr-body",
    "# Result\n\nOrdinary text\nwrapped freely.\n\n```\ncode\n```",
    [],
  ],
  [
    "control character",
    "pr-body",
    "ordinary\u0000text",
    ["text.control-character"],
  ],
]) {
  test(name, () => {
    const result = lint(kind, text);
    assert.deepEqual(rules(result), expected);
    assert.equal(result.status, expected.length ? "refused" : "pass");
  });
}

test("public vocabulary reports named terms and exact original spans in every artifact", () => {
  for (const [kind, text, term] of [
    ["branch", "fix/dotln-input", "DotLn"],
    ["commit", "fix: handle input\n\nUse launchpad output.", "launchpad"],
    ["pr-title", "fix: remove gems", "gems"],
    ["pr-body", "ordinary\r\nUse Ｄｏｔ－Ｌｎ output.", "DotLn"],
    ["pr-body", "Use ⒹⓞⓣⓁⓝ output.", "DotLn"],
    ["pr-body", "Use Dot\nLn output.", "DotLn"],
  ]) {
    const result = lint(kind, text);
    assert.equal(result.status, "refused");
    const finding = result.findings.find(
      (row) => row.rule === "vocabulary.launchpad",
    );
    assert.equal(finding.term, term);
    assert.equal(finding.span.precision, "exact");
    assert.ok(text.slice(finding.span.start, finding.span.end).length > 0);
  }
  const finding = lint("pr-body", "ok\r\n  Ｄｏｔ－Ｌｎ!").findings[0];
  assert.deepEqual(finding, {
    rule: "vocabulary.launchpad",
    term: "DotLn",
    span: { start: 6, end: 12, line: 2, column: 3, precision: "exact" },
  });
  assert.equal(
    lint("pr-body", "gemstone; unmask; dotlnish; launchpads").status,
    "pass",
  );
});

test("pure calls are deterministic, leave inputs intact, and never imply local coverage", () => {
  const input = Object.freeze({
    kind: "commit",
    text: "fix: handle input",
    vocabulary: policy,
  });
  const first = lintOutwardArtifact(input);
  assert.equal(first.status, "unavailable");
  assert.deepEqual(first.checks, {
    format: { status: "pass" },
    launchpad: { status: "pass" },
    localTerms: { status: "unavailable" },
  });
  first.findings.push({ rule: "caller mutation" });
  assert.deepEqual(lintOutwardArtifact(input).findings, []);
  assert.equal(
    lintOutwardArtifact({ kind: "pr-body", text: "DotLn", vocabulary: policy })
      .status,
    "refused",
  );
  assert.throws(() => lintOutwardArtifact({ kind: "unknown", text: "text" }));
  assert.throws(() => lintOutwardArtifact({ kind: "pr-body", text: 42 }));
  assert.throws(() =>
    lintOutwardArtifact({ ...input, vocabulary: { types: [], terms: [] } }),
  );
  assert.throws(() =>
    lintOutwardArtifact({
      ...input,
      localTerms: { status: "refused", findings: [] },
    }),
  );
});

test("existing local checker refuses synthetic terms without exposing the term or matched text", (t) => {
  const { root, terms } = fixture(t);
  terms(
    "# Synthetic fixture only\nSyntheticForbidden\nWibble Sprocket Cloud\n",
  );
  for (const text of [
    "Synthetic-Forbidden",
    "ordinary\r\nWibble\r\nSprocket Cloud",
    "ordinary\rWibble\rSprocket Cloud",
  ]) {
    const result = checkOutwardArtifact(root, { kind: "pr-body", text });
    assert.equal(result.status, "refused");
    assert.deepEqual(rules(result), ["vocabulary.local"]);
    assert.equal(result.findings[0].count, 1);
    assert.equal(
      result.findings[0].span.line,
      text.startsWith("ordinary") ? 2 : 1,
    );
    assert.equal(result.findings[0].span.precision, "line");
    assert.doesNotMatch(
      JSON.stringify(result),
      /synthetic|forbidden|wibble|sprocket|cloud/i,
    );
  }
  assert.equal(
    checkOutwardArtifact(root, { kind: "pr-body", text: "ordinary text" })
      .status,
    "pass",
  );
  const both = checkOutwardArtifact(root, {
    kind: "pr-body",
    text: "DotLn SyntheticForbidden",
  });
  assert.deepEqual(rules(both), ["vocabulary.launchpad", "vocabulary.local"]);
});

test("missing local list is unavailable while committed vocabulary still runs", (t) => {
  const { root } = fixture(t);
  const safe = checkOutwardArtifact(root, {
    kind: "pr-body",
    text: "ordinary text",
  });
  assert.equal(safe.status, "unavailable");
  const denied = checkOutwardArtifact(root, {
    kind: "pr-body",
    text: "Launchpad text",
  });
  assert.equal(denied.status, "refused");
  assert.equal(denied.checks.localTerms.status, "unavailable");
  assert.deepEqual(rules(denied), ["vocabulary.launchpad"]);
});

test("empty and uncontained local lists refuse without raw errors, and public checks still run", (t) => {
  const { root, terms } = fixture(t);
  terms("# no terms\n");
  let result = checkOutwardArtifact(root, { kind: "pr-body", text: "DotLn" });
  assert.deepEqual(rules(result), [
    "vocabulary.launchpad",
    "local-terms.configuration",
  ]);
  assert.equal(result.status, "refused");
  const other = fixture(t);
  other.write("private.txt", "SyntheticForbidden\n");
  rmSync(join(root, "docs/control/local/terms.txt"));
  symlinkSync(
    join(other.root, "private.txt"),
    join(root, "docs/control/local/terms.txt"),
  );
  result = checkOutwardArtifact(root, {
    kind: "pr-body",
    text: "ordinary text",
  });
  assert.deepEqual(rules(result), ["local-terms.configuration"]);
  assert.doesNotMatch(
    JSON.stringify(result),
    /SyntheticForbidden|private\.txt|outward-lint-/,
  );
});

test("configured control root owns both lists and editable type set", (t) => {
  const { root, write, terms } = fixture(t, "records/control");
  write(
    "records/control/outward-vocabulary.json",
    JSON.stringify({ types: ["fix"], terms: ["PublicFixtureTerm"] }),
  );
  terms("SyntheticForbidden\n");
  assert.equal(
    checkOutwardArtifact(root, { kind: "commit", text: "fix: handle input" })
      .status,
    "pass",
  );
  assert.deepEqual(
    rules(
      checkOutwardArtifact(root, {
        kind: "commit",
        text: "feat: handle input",
      }),
    ),
    ["subject.type"],
  );
  assert.deepEqual(
    rules(
      checkOutwardArtifact(root, {
        kind: "pr-body",
        text: "PublicFixtureTerm SyntheticForbidden",
      }),
    ),
    ["vocabulary.launchpad", "vocabulary.local"],
  );
});

test("copied CLI runs with relocated documents and no default document tree", (t) => {
  const { root, write, terms } = fixture(t, "records/control");
  for (const path of [
    "outward-lint.mjs",
    "lib/outward-lint.mjs",
    "lib/config.mjs",
    "lib/paths.mjs",
    "lib/terms.mjs",
  ])
    write(
      `scripts/${path}`,
      readFileSync(new URL(path, import.meta.url), "utf8"),
    );
  terms("SyntheticForbidden\n");
  const result = run(
    root,
    "commit",
    "fix: handle input",
    join(root, "scripts/outward-lint.mjs"),
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).status, "pass");
});

test("CLI stdin, redacted JSON, framing, and distinct pass/refused/unavailable/error exit codes", (t) => {
  const { root, terms, write } = fixture(t);
  let result = run(root, "commit", "fix: handle input\n");
  assert.equal(result.status, 2);
  assert.equal(
    JSON.parse(result.stdout).checks.localTerms.status,
    "unavailable",
  );
  terms("SyntheticForbidden\n");
  for (const [kind, text] of [
    ["commit", "fix: handle input\n"],
    ["branch", "fix/handle-input\r\n"],
    ["pr-title", "fix: handle input\n"],
  ]) {
    result = run(root, kind, text);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).status, "pass");
  }
  result = run(root, "pr-body", "SyntheticForbidden");
  assert.equal(result.status, 1);
  assert.equal(JSON.parse(result.stdout).findings[0].rule, "vocabulary.local");
  assert.doesNotMatch(result.stdout + result.stderr, /SyntheticForbidden/);
  assert.equal(run(root, "branch", "fix/handle-input\n\n").status, 1);
  assert.equal(run(root, "unknown", "ordinary text").status, 3);
  write("docs/control/outward-vocabulary.json", "malformed SyntheticForbidden");
  result = run(root, "pr-body", "ordinary text");
  assert.equal(result.status, 3);
  assert.doesNotMatch(
    result.stdout + result.stderr,
    /SyntheticForbidden|malformed/,
  );
});
