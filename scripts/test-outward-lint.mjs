import { write as writeFixture } from "./lib/helpers.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  lintOutwardArtifact,
  runtimeIdentifierForms,
} from "./lib/outward-lint.mjs";
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
  const write = (path, text) => writeFixture(root, path, text);
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
  ["gitmoji commit", "commit", "🐛 fix: handle input", []],
  ["gitmoji title", "pr-title", "✨ feat: handle input", []],
  ["gitmoji shortcode title", "pr-title", ":sparkles: feat: handle input", []],
  ["gitmoji shortcode commit", "commit", ":memo: docs: add the guide", []],
  [
    "gitmoji shortcode requires type",
    "pr-title",
    ":memo: Fork requests land",
    ["subject.shape"],
  ],
  ["gitmoji requires type", "pr-title", "✨ Handle input", ["subject.shape"]],
  [
    "gitmoji preserves type refusal",
    "commit",
    "🐛 ship: handle input",
    ["subject.type"],
  ],
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

test("runtime reference forms are refused with exact source spans in every outward kind", () => {
  assert.ok(Object.isFrozen(runtimeIdentifierForms));
  for (const form of runtimeIdentifierForms) {
    const sample = form === "evt_<digits>" ? "evt_123" : form;
    for (const kind of ["branch", "commit", "pr-title", "pr-body"]) {
      const prefix =
        kind === "branch" ? "fix/" : kind === "pr-body" ? "Evidence " : "fix: ";
      const text = `${prefix}${sample}${form.endsWith(":") ? "id" : ""}`;
      const finding = lint(kind, text).findings.find(
        (row) => row.rule === "identifier.runtime",
      );
      assert.deepEqual(finding.span, {
        start: prefix.length,
        end: prefix.length + sample.length,
        line: 1,
        column: prefix.length + 1,
        precision: "exact",
      });
      assert.equal(lint(kind, text).checks.runtime.status, "refused");
    }
  }
  const unicode = "😀\r\n  ＣＯＮＴＲＡＣＴ：id";
  const finding = lint("pr-body", unicode).findings.find(
    (row) => row.rule === "identifier.runtime",
  );
  assert.deepEqual(finding.span, {
    start: 6,
    end: 15,
    line: 2,
    column: 3,
    precision: "exact",
  });
  assert.equal(
    unicode.slice(finding.span.start, finding.span.end),
    "ＣＯＮＴＲＡＣＴ：",
  );
  for (const text of [
    "Independent verification: acceptance matrix for a commit",
    "**Contract:**",
    "verification: ",
    "evt_letters",
    "subcontract:abc",
    "precontract:x",
    "prevt_1",
    "evt_1ABC2",
    "evt_12_external",
    "external-contract:abc",
  ])
    assert.equal(lint("pr-body", text).status, "pass", text);
});

test("runtime references cannot hide behind rendered body escapes", () => {
  for (const encoded of [
    "evt&#95;12",
    "evt&#x5f;12",
    "evt\\_12",
    "delivery-preparation&#35;",
    "delivery-preparation\\#",
    "contract&#58;",
    "&#101;vt_12",
  ]) {
    const suffix = encoded.startsWith("contract") ? "id" : "";
    const text = `Evidence ${encoded}${suffix}.`;
    const finding = lint("pr-body", text).findings.find(
      (row) => row.rule === "identifier.runtime",
    );
    assert.ok(finding, text);
    assert.equal(text.slice(finding.span.start, finding.span.end), encoded);
  }
  assert.equal(
    lint("pr-body", "External evt&#95;12ABC and subcontract&#58;x.").checks
      .runtime.status,
    "pass",
  );
});

test("runtime references cannot hide behind named references, HTML comments or tags, or emphasis in a body", () => {
  const runtimeSpans = (text) =>
    lint("pr-body", text)
      .findings.filter((row) => row.rule === "identifier.runtime")
      .map((row) => text.slice(row.span.start, row.span.end));
  for (const [written, shown] of [
    ["evt&lowbar;12", "evt&lowbar;12"],
    ["evt&UnderBar;12", "evt&UnderBar;12"],
    ["review-event&colon;abc", "review-event&colon;"],
    ["delivery-preparation&num;", "delivery-preparation&num;"],
    ["source-event<!-- -->:abc", "source-event<!-- -->:"],
    [
      "contract<!-- a note\nover two lines -->:abc",
      "contract<!-- a note\nover two lines -->:",
    ],
    ["<b>evt_</b>12", "evt_</b>12"],
    ['<span class="id">evt_</span>34', "evt_</span>34"],
    ["**evt_**123", "evt_**123"],
    ["**evt**_123", "evt**_123"],
    ["source-event:*abc*", "source-event:"],
    ["<code>evt</code>_12", "evt</code>_12"],
    ["_evt_12_", "evt_12"],
    ["__evt_12__", "evt_12"],
    ["evt_~~12~~", "evt_~~12"],
    ["source-event:`abc`", "source-event:"],
    ["<!-- source-event:abc -->", "source-event:"],
    ['<a href="https://example.invalid/evt_12">a link</a>', "evt_12"],
    ['evt_<i title=">"></i>12', 'evt_<i title=">"></i>12'],
    ['evt_<span title="<"></span>12', 'evt_<span title="<"></span>12'],
    [
      'evt_<span\nclass="a"\nid="b"></span>12',
      'evt_<span\nclass="a"\nid="b"></span>12',
    ],
    [
      'evt_<b class="a" title="x\ny"></b>12',
      'evt_<b class="a" title="x\ny"></b>12',
    ],
    ["evt_<?x?>12", "evt_<?x?>12"],
    ["evt_<![CDATA[]]>12", "evt_<![CDATA[]]>12"],
    ["evt_<!X>12", "evt_<!X>12"],
    [
      "[source-event](https://example.invalid):abc",
      "source-event](https://example.invalid):",
    ],
    ["[evt_](https://example.invalid)12", "evt_](https://example.invalid)12"],
    ["[evt](https://example.invalid)_12", "evt](https://example.invalid)_12"],
    ["[evt_][r]12\n\n[r]: https://example.invalid", "evt_][r]12"],
    ["contract:[abc](https://example.invalid)", "contract:"],
    [
      '[evt_](https://example.invalid\n"t")12',
      'evt_](https://example.invalid\n"t")12',
    ],
    ["[twice](see evt&#95;12 below)", "evt&#95;12"],
    ["[1][evt&#95;12]", "evt&#95;12"],
    [
      'delivery-preparation[#](https://example.invalid "a title")',
      "delivery-preparation[#",
    ],
    ["source-event<!--\n#1 -->:abc", "source-event<!--\n#1 -->:"],
    ["evt_<!--\n2. -->12", "evt_<!--\n2. -->12"],
    ["evt_<?\n#?>12", "evt_<?\n#?>12"],
    [
      "contract<!--\n#tag and 3) more -->:x",
      "contract<!--\n#tag and 3) more -->:",
    ],
    ["evt_<!--\n```js` -->12", "evt_<!--\n```js` -->12"],
    ["[evt_][r]12\n\n> [r]: https://example.invalid", "evt_][r]12"],
    [
      "[source-event][r]:abc\n\n1. [r]: https://example.invalid",
      "source-event][r]:",
    ],
    ["[evt_]12\n\n- [evt_]: https://example.invalid", "evt_]12"],
    ["evt&#0000095;12", "evt&#0000095;12"],
    ["evt&#x00005f;12", "evt&#x00005f;12"],
    ["evt_1&#50;", "evt_1&#50;"],
    ["evt_12&#51;", "evt_12&#51;"],
  ])
    assert.deepEqual(runtimeSpans(`Evidence ${written}.`), [shown], written);
  // Inside a block quote, markup is judged on the quote's content.
  for (const [text, shown] of [
    ["> evt_<!--\n> -->12", "evt_<!--\n> -->12"],
    ["> evt_<!--\n> #-->12", "evt_<!--\n> #-->12"],
    ["> source-event<!--\n> x -->:abc", "source-event<!--\n> x -->:"],
    ["> evt_<?\n> ?>12", "evt_<?\n> ?>12"],
    ['> evt_<span\n> class="a">12', 'evt_<span\n> class="a">12'],
    ["> > evt_<!--\n> > -->12", "evt_<!--\n> > -->12"],
    ["- > evt_<!--\n  > -->12", "evt_<!--\n  > -->12"],
    [
      "> [evt_](\n> https://example.invalid)12",
      "evt_](\n> https://example.invalid)12",
    ],
    [
      "> evt_[](\n> https://example.invalid)12",
      "evt_[](\n> https://example.invalid)12",
    ],
    ["> evt_<!--\n-->12", "evt_<!--\n-->12"],
    ["> evt_<!--\nlazy\n> -->12", "evt_<!--\nlazy\n> -->12"],
    ["> a\n> > evt_<!--\n> > -->12", "evt_<!--\n> > -->12"],
    ["[evt_][r x]12\n\n[r\nx]: https://example.invalid", "evt_][r x]12"],
    ["[evt_][r  x]12\n\n[r\n x]: https://example.invalid", "evt_][r  x]12"],
  ])
    assert.deepEqual(runtimeSpans(text), [shown], text);
  for (const text of [
    "**Contract:** Independent verification: acceptance matrix for a commit.",
    "Pipeline my_evt_12 and evt_12_external stay intraword.",
    "A &copy; sign, an &unknown; name and \\_ stay as written.",
    'See [the contract](https://example.invalid "Contract") and [the notes][n].\n\n[n]: https://example.invalid',
    "Undefined [evt_]12 and a bracketed [contract]:x keep their brackets.",
    "[evt_][q]12 keeps its brackets.\n\n> [r]: https://example.invalid",
    "evt&#x0000005f;12 and evt&#00000095;12 show as written.",
    "A heading ends it: evt_<!--\n# -->12",
    "A break ends it: evt_<!--\n***\n-->12",
    "A first item ends it: evt_<!--\n1. a -->12",
    "> A blank quote line ends it: evt_<!--\n>\n> -->12",
    "A quote ends it: evt_<!--\n> -->12",
  ])
    assert.equal(lint("pr-body", text).checks.runtime.status, "pass", text);
  assert.equal(
    lint("commit", "fix: keep evt&lowbar;12 as plain text").checks.runtime
      .status,
    "pass",
  );
});

test("code spans and fenced or indented code show their bytes, so references and escapes in code are not decoded, while raw HTML blocks are never code", () => {
  for (const text of [
    "Code: `evt&#95;12` literally.",
    "Use ``contract&#58;x`` in the example.",
    "```\nevt&#95;12\n```",
    "~~~ text\nsource-event&colon;abc\n~~~",
    "````\n```\nevt\\_12\n````\n",
    "Escapes stay literal in code: `evt\\_12` and `source-event\\:abc`.",
    "Example:\n\n    evt\\_12\n\tcontract&#58;x\n",
    "<details>\n\n```\nevt&#95;12\n```\n\n</details>",
    "Text `evt&#95;12\n#3` done.",
    "Text `evt&#95;12\n2. more` done.",
    "> Text `evt&#95;12\n> x` done.",
    "> ```\n> evt&#95;12\n> ```",
  ])
    assert.equal(lint("pr-body", text).checks.runtime.status, "pass", text);
  for (const [text, shown] of [
    ["Code: `x` and then evt&#95;12.", "evt&#95;12"],
    ["Code: `evt_12` stays a runtime form.", "evt_12"],
    ["```\nreview-event:abc\n```", "review-event:"],
    ["An open `tick\n\nthen evt&#95;12 in the next paragraph`.", "evt&#95;12"],
    ["A paragraph line\n    evt&#95;12 continues it.", "evt&#95;12"],
    ["- a list item\n\n    evt&#95;12 is its paragraph.", "evt&#95;12"],
    [
      "- a list item\nlazy text\n\n    evt&#95;12 is still its paragraph.",
      "evt&#95;12",
    ],
    ["Example:\n\n    code\nevt&#95;12 after the block.", "evt&#95;12"],
    ["Text[^1]\n\n[^1]: note\n\n    evt&#95;12", "evt&#95;12"],
    ["<p>`evt&#95;12`</p>", "evt&#95;12"],
    ["<div>`evt&lowbar;12`</div>", "evt&lowbar;12"],
    ["<div>\n```\nevt&#95;12\n```\n</div>", "evt&#95;12"],
    ["<div>\n`evt&#95;12`\n</div>", "evt&#95;12"],
    ["Para\n<div>`evt&#95;12`</div>", "evt&#95;12"],
    ["- <div>`evt&#95;12`</div>", "evt&#95;12"],
    ["<pre>\n\n    evt&#95;12\n\n</pre>", "evt&#95;12"],
    ["<pre>`evt&#95;12`</pre>", "evt&#95;12"],
    ["<custom-el>\n```\nevt&#95;12\n```", "evt&#95;12"],
    [
      "<table><tr><td>`source-event&colon;abc`</td></tr></table>",
      "source-event&colon;",
    ],
  ]) {
    const finding = lint("pr-body", text).findings.find(
      (row) => row.rule === "identifier.runtime",
    );
    assert.ok(finding, text);
    assert.equal(text.slice(finding.span.start, finding.span.end), shown);
  }
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
    runtime: { status: "pass" },
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
    "lib/validation.mjs",
    "lib/paths.mjs",
    "lib/git.mjs",
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

test("a large fenced body retains its rendered units without an argument limit", () => {
  const body = `\`\`\`text\n${"x".repeat(150000)}\n\`\`\`\n`;
  assert.equal(lint("pr-body", body).checks.runtime.status, "pass");
});
