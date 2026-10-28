import {
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import { write as writeFixture } from "./lib/helpers.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  launchpadIdentifierForms,
  lintOutwardArtifact,
  matchLaunchpadIdentifiers,
  matchReviewTerms,
  runtimeIdentifierForms,
  outwardFindingText,
  subjectLengthLimit,
  validateOutwardVocabulary,
} from "./lib/outward-lint.mjs";
import { checkOutwardArtifact } from "./outward-lint.mjs";
import { checkLocalTerms, parseLocalTerms } from "./lib/terms.mjs";

const policy = JSON.parse(
  readFileSync(
    new URL("../docs/control/outward-vocabulary.json", import.meta.url),
    "utf8",
  ),
);
const cli = fileURLToPath(new URL("./outward-lint.mjs", import.meta.url));
const lint = (kind, text, options = {}) =>
  lintOutwardArtifact({
    kind,
    text,
    vocabulary: policy,
    localTerms: { status: "present" },
    ...options,
  });
const rules = (result) => result.findings.map((finding) => finding.rule);

test("subject-length diagnostics count characters and name the shared limit", () => {
  for (const subject of [
    `fix: ${"x".repeat(85)}`,
    `🐛 fix: ${"x".repeat(83)}`,
  ]) {
    const text = `${subject}\r\n\r\nA separate body.\n`;
    const finding = lint("commit", text).findings.find(
      (row) => row.rule === "subject.length",
    );
    assert.ok(finding);
    assert.equal(
      outwardFindingText(finding, text),
      `subject.length: 90 of ${subjectLengthLimit} characters`,
    );
  }
});
const fixture = (t, control = "docs/control") => {
  const root = createFixtureRoot(join(tmpdir(), "outward-lint-"));
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

test("WO-227 criterion 2: public review words are review items with exact original spans in every artifact and refuse nothing", () => {
  for (const [kind, text, term] of [
    ["branch", "fix/dotln-input", "DotLn"],
    ["commit", "fix: handle input\n\nUse launchpad output.", "launchpad"],
    ["pr-title", "fix: remove gems", "gems"],
    ["pr-body", "ordinary\r\nUse Ｄｏｔ－Ｌｎ output.", "DotLn"],
    ["pr-body", "Use ⒹⓞⓣⓁⓝ output.", "DotLn"],
    ["pr-body", "Use Dot\nLn output.", "DotLn"],
    ["release-body", "Fixture Product v0.1.0\n\nUses the mask layer.", "mask"],
  ]) {
    const result = lint(kind, text);
    assert.equal(result.status, "review", text);
    assert.deepEqual(result.checks.review, { status: "review", matches: 1 });
    const finding = result.findings.find(
      (row) => row.rule === "vocabulary.review",
    );
    assert.equal(finding.term, term);
    assert.equal(finding.span.precision, "exact");
    assert.ok(text.slice(finding.span.start, finding.span.end).length > 0);
    assert.equal(
      outwardFindingText(finding, text),
      `vocabulary.review: ${term}`,
    );
  }
  const finding = lint("pr-body", "ok\r\n  Ｄｏｔ－Ｌｎ!").findings[0];
  assert.deepEqual(finding, {
    rule: "vocabulary.review",
    term: "DotLn",
    span: { start: 6, end: 12, line: 2, column: 3, precision: "exact" },
  });
  assert.equal(
    lint("pr-body", "gemstone; unmask; dotlnish; launchpads").status,
    "pass",
  );
  // The words with their lines, each in the part of the composed body it
  // sits in when the caller names the parts.
  const body =
    "# Result\n\nApply the mask layer.\n\n## Change\n\n| Path |\n| --- |\n| fixtures/launchpad-board.json |\n";
  const change = body.indexOf("## Change");
  const labelled = lint("pr-body", body, {
    sections: [
      { name: "reviewed prose", start: 0, end: change },
      { name: "Change table", start: change, end: body.length },
    ],
  });
  assert.equal(labelled.status, "review");
  assert.deepEqual(
    labelled.findings.map((row) => [
      row.rule,
      row.term,
      row.span.line,
      row.section,
    ]),
    [
      ["vocabulary.review", "mask", 3, "reviewed prose"],
      ["vocabulary.review", "launchpad", 9, "Change table"],
    ],
  );
  // An exempt span (a registered display name) reads as a name, not words.
  const named = "DotLn Angular v0.1.0\n\nThe launchpad board.";
  const exempt = lint("release-body", named, {
    exempt: [{ start: 0, end: "DotLn Angular".length }],
  });
  assert.deepEqual(
    exempt.findings.map((row) => row.term),
    ["launchpad"],
  );
  assert.deepEqual(
    matchReviewTerms("fixtures/gem-board.json", policy.reviewTerms),
    [{ term: "gem", start: 9, end: 12 }],
  );
});

test("WO-227 criterion 2: the vocabulary file names its review list, reads the old key with an advisory and admits an empty list", () => {
  assert.deepEqual(
    validateOutwardVocabulary({ types: ["fix"], reviewTerms: [] }),
    { types: ["fix"], reviewTerms: [], advisories: [] },
  );
  assert.equal(
    lintOutwardArtifact({
      kind: "pr-body",
      text: "DotLn launchpad gems",
      vocabulary: { types: ["fix"], reviewTerms: [] },
      localTerms: { status: "present", terms: 0 },
    }).status,
    "pass",
  );
  const alias = validateOutwardVocabulary({ types: ["fix"], terms: ["gem"] });
  assert.deepEqual(alias.reviewTerms, ["gem"]);
  assert.match(alias.advisories[0], /terms is read as reviewTerms/u);
  assert.deepEqual(
    lint("pr-body", "a gem", { vocabulary: { types: ["fix"], terms: ["gem"] } })
      .advisories,
    alias.advisories,
  );
  assert.throws(
    () =>
      validateOutwardVocabulary({
        types: ["fix"],
        terms: ["gem"],
        reviewTerms: ["gem"],
      }),
    /terms and reviewTerms are both present/u,
  );
  assert.throws(
    () => validateOutwardVocabulary({ types: ["fix"] }),
    /require reviewTerms/u,
  );
  assert.throws(
    () => validateOutwardVocabulary({ types: ["fix"], reviewTerms: ["", 3] }),
    /reviewTerms must be an array of words/u,
  );
  assert.throws(
    () => validateOutwardVocabulary({ types: [], reviewTerms: [] }),
    /require nonempty types/u,
  );
});

test("WO-227 criterion 1: launchpad identifiers refuse in a target's artifacts, pass in the launchpad's own, and spare the kit's fixed texts", () => {
  assert.ok(Object.isFrozen(launchpadIdentifierForms));
  const samples = [
    "WO-006",
    "WO-006-D018",
    "FUP-280abd447f789958",
    "VER-001",
    "FINAL-001",
    "REVIEW-007",
    "WS-001",
  ];
  for (const sample of samples)
    for (const kind of [
      "branch",
      "commit",
      "pr-title",
      "pr-body",
      "release-body",
    ]) {
      const lower = kind === "branch";
      const identifier = lower ? sample.toLowerCase() : sample;
      const prefix = lower
        ? "fix/notes-"
        : kind === "commit" || kind === "pr-title"
          ? "fix: note "
          : "Evidence ";
      const text = `${prefix}${identifier}${lower ? "" : "."}`;
      const target = lint(kind, text, { target: true });
      assert.equal(target.status, "refused", text);
      assert.equal(target.checks.launchpadIdentifiers.status, "refused");
      const finding = target.findings.find(
        (row) => row.rule === "identifier.launchpad",
      );
      assert.deepEqual(finding.span, {
        start: prefix.length,
        end: prefix.length + identifier.length,
        line: 1,
        column: prefix.length + 1,
        precision: "exact",
      });
      assert.equal(
        outwardFindingText(finding, text),
        `identifier.launchpad: ${identifier}`,
      );
      // The control: the same text as a launchpad artifact passes.
      const launchpad = lint(kind, text);
      assert.equal(launchpad.target, false);
      assert.equal(
        launchpad.checks.launchpadIdentifiers.status,
        "not-applicable",
      );
      assert.ok(
        !launchpad.findings.some((row) => row.rule === "identifier.launchpad"),
        text,
      );
    }
  for (const text of [
    "docs: record reviewed change and validation",
    "fix: handle input\n\nCloses #4",
  ])
    assert.equal(lint("commit", text, { target: true }).status, "pass", text);
  assert.equal(lint("pr-body", "Closes #4", { target: true }).status, "pass");
  const title = lint("pr-body", "# WO-006\n\nA launchpad title.");
  assert.equal(title.checks.launchpadIdentifiers.status, "not-applicable");
  assert.equal(title.status, "review");
  assert.equal(
    lint("pr-body", "# WO-006\n\nA launchpad title.", { target: true }).checks
      .launchpadIdentifiers.status,
    "refused",
  );
  for (const text of [
    "prewo-006x",
    "fup-280abd447f78995 is fifteen",
    "WO-06",
    "ws-001a",
    "my_ver-001",
    "review-2026-10-21.md",
    "ws-2024",
    "WO-1000",
  ])
    assert.equal(
      lint("pr-body", text, { target: true }).checks.launchpadIdentifiers
        .status,
      "pass",
      text,
    );
  for (const text of [
    "docs/WO-006-notes.md",
    "fix/handle-wo-006",
    "ＷＯ－００６",
    "WO<!-- -->-006",
    "**WO**-006",
  ])
    assert.equal(
      lint("pr-body", text, { target: true }).checks.launchpadIdentifiers
        .status,
      "refused",
      text,
    );
  assert.deepEqual(
    matchLaunchpadIdentifiers("docs/WO-006-notes.md and fix/wo-007"),
    [
      { identifier: "WO-006", start: 5, end: 11 },
      { identifier: "wo-007", start: 29, end: 35 },
    ],
  );
  // A part the kit itself writes may lift the rule; a review word there stays.
  const orderTitle = "WO-999 — fixture";
  const objectiveText = "The launchpad board.";
  const closeText = "Closed by WO-999; merged main at abc.";
  const framed = `${orderTitle}\n\n${objectiveText}\n\n${closeText}\n`;
  const section = (name, part, exempt) => ({
    name,
    start: framed.indexOf(part),
    end: framed.indexOf(part) + part.length,
    ...(exempt ? { exempt } : {}),
  });
  const result = lint("release-body", framed, {
    target: true,
    // The enclosing part is listed first: the narrowest part wins, not the
    // first listed.
    sections: [
      { name: "whole", start: 0, end: framed.length },
      section("order title", orderTitle, ["identifier.launchpad"]),
      section("objective", objectiveText),
      section("close line", closeText, ["identifier.launchpad"]),
    ],
  });
  assert.equal(result.status, "review");
  assert.deepEqual(
    result.findings.map((row) => [row.rule, row.section]),
    [["vocabulary.review", "objective"]],
  );
});

test("WO-227 criterion 7: a part or an exempt span lifts a rule only over its own bytes, so a match that runs out of it into authored text is still reported", () => {
  const vocabulary = {
    types: ["fix"],
    reviewTerms: ["md launchpad", "decisions", "kit frame", "angular gems"],
  };
  const terms = (result) =>
    result.findings.map((row) => [row.rule, row.term, row.section]);
  // A record link's written address lifts identifiers and review words; the
  // query or fragment the author wrote after it does not.
  const address = `https://github.com/fixture/target/blob/${"a".repeat(40)}/docs/evidence/WO-999/decisions.md`;
  const linked = (rest) => {
    const text = `See [the record](${address}${rest}).`;
    const start = text.indexOf(address);
    return lint("release-body", text, {
      vocabulary,
      target: true,
      sections: [
        { name: "reviewed notes", start: 0, end: text.length },
        {
          name: "record link",
          start,
          end: start + address.length,
          exempt: ["identifier.launchpad", "vocabulary.review"],
        },
      ],
    });
  };
  for (const rest of ["#launchpad", "?launchpad"]) {
    const result = linked(rest);
    assert.equal(result.status, "review");
    assert.deepEqual(terms(result), [
      ["vocabulary.review", "md launchpad", "record link"],
    ]);
  }
  // Wholly inside the address, the identifier and the review word stay lifted.
  assert.equal(linked("#plain").status, "pass");
  // A part nested in a lifting part keeps its own rules: a match that starts
  // in the lifting part and ends in the nested one is reported, while one
  // wholly in the lifting part is not.
  const nested = "Kit frame md launchpad tail.";
  const authored = nested.indexOf("launchpad");
  const result = lint("release-body", nested, {
    vocabulary,
    sections: [
      {
        name: "kit frame",
        start: 0,
        end: nested.length,
        exempt: ["vocabulary.review"],
      },
      { name: "authored", start: authored, end: authored + "launchpad".length },
    ],
  });
  assert.deepEqual(terms(result), [
    ["vocabulary.review", "md launchpad", "kit frame"],
  ]);
  // A display name lifts the review words it holds, not a match that runs on
  // past it.
  const named = lint("release-body", "DotLn Angular gems ship.", {
    vocabulary: { types: ["fix"], reviewTerms: ["DotLn", "angular gems"] },
    exempt: [{ start: 0, end: "DotLn Angular".length }],
  });
  assert.deepEqual(
    named.findings.map((row) => row.term),
    ["angular gems"],
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
    runtime: { status: "pass" },
    launchpadIdentifiers: { status: "not-applicable" },
    review: { status: "pass", matches: 0 },
    localTerms: { status: "unavailable" },
  });
  assert.deepEqual(first.advisories, []);
  first.findings.push({ rule: "caller mutation" });
  assert.deepEqual(lintOutwardArtifact(input).findings, []);
  // An absent local list refuses the publish whatever the review words say.
  assert.equal(
    lintOutwardArtifact({ kind: "pr-body", text: "DotLn", vocabulary: policy })
      .status,
    "unavailable",
  );
  assert.throws(() =>
    lintOutwardArtifact({
      ...input,
      localTerms: {
        status: "review",
        findings: [{ line: 1, endLine: 1, count: 1, mode: "refuse" }],
      },
    }),
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

test("WO-227 criterion 3: a refuse-mode private term refuses by line and mode, an unmarked term is a review item, and neither exposes the term", (t) => {
  const { root, terms } = fixture(t);
  terms(
    "# Synthetic fixture only\nrefuse: SyntheticForbidden\nREFUSE: Wibble Sprocket Cloud\nZorp Quux\nreview: Blorp\n",
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
    assert.equal(result.findings[0].mode, "refuse");
    assert.equal(
      result.findings[0].span.line,
      text.startsWith("ordinary") ? 2 : 1,
    );
    assert.equal(result.findings[0].span.precision, "line");
    assert.equal(result.findings[0].span.end, text.length);
    assert.equal(
      outwardFindingText(result.findings[0], text),
      "vocabulary.local: refuse",
    );
    assert.doesNotMatch(
      JSON.stringify(result),
      /synthetic|forbidden|wibble|sprocket|cloud|zorp|quux|blorp/i,
    );
  }
  for (const text of ["Zorp\nQuux here", "a blorp"]) {
    const result = checkOutwardArtifact(root, { kind: "pr-body", text });
    assert.equal(result.status, "review", text);
    assert.deepEqual(result.checks.localTerms, { status: "review" });
    assert.deepEqual(
      result.findings.map((row) => [
        row.rule,
        row.mode,
        row.count,
        row.span.precision,
      ]),
      [["vocabulary.local", "review", 1, "line"]],
    );
    assert.doesNotMatch(JSON.stringify(result), /zorp|quux|blorp/i);
  }
  const mixed = checkOutwardArtifact(root, {
    kind: "pr-body",
    text: "a blorp\nSyntheticForbidden",
  });
  assert.equal(mixed.status, "refused");
  assert.deepEqual(
    mixed.findings.map((row) => [row.mode, row.span.line]),
    [
      ["review", 1],
      ["refuse", 2],
    ],
  );
  assert.deepEqual(
    checkOutwardArtifact(root, { kind: "pr-body", text: "ordinary text" })
      .checks.localTerms,
    { status: "pass", terms: 4 },
  );
  const both = checkOutwardArtifact(root, {
    kind: "pr-body",
    text: "DotLn SyntheticForbidden",
  });
  assert.equal(both.status, "refused");
  assert.deepEqual(rules(both), ["vocabulary.review", "vocabulary.local"]);
  // The display-name exemption covers public review words only: a private
  // term that merely contains the name is still refused.
  terms("refuse: AcmeCorp\n");
  assert.equal(
    checkOutwardArtifact(root, {
      kind: "release-body",
      text: "AcmeCorp ships the update.",
      target: true,
      exemptText: ["Acme"],
    }).status,
    "refused",
  );
  // A mode marker with no term refuses by line; any other text is the term,
  // a colon included, so an existing list keeps every term it had.
  terms("Fine\nreview :\n");
  assert.throws(
    () => checkLocalTerms(root, []),
    /line 2: a mode marker with no term/u,
  );
  terms("refuse:\n");
  assert.throws(
    () => checkLocalTerms(root, []),
    /line 1: a mode marker with no term/u,
  );
  assert.deepEqual(
    rules(checkOutwardArtifact(root, { kind: "pr-body", text: "x" })),
    ["local-terms.configuration"],
  );
  assert.deepEqual(
    [...parseLocalTerms("refuse: Same Term\nsame term\n# note\n\nOther\n")],
    [
      ["sameterm", "refuse"],
      ["other", "review"],
    ],
  );
  assert.deepEqual(
    [
      ...parseLocalTerms(
        "REFUSE: Acme\nreview : Beta\nhttp://internal.example\nsvc:8080\nblock: Foo\n",
      ),
    ],
    [
      ["acme", "refuse"],
      ["beta", "review"],
      ["httpinternalexample", "review"],
      ["svc8080", "review"],
      ["blockfoo", "review"],
    ],
  );
});

test("private observations retain distinct complete line ranges and reject unknown extents", (t) => {
  const { root, terms } = fixture(t);
  terms("refuse: amber\nrefuse: amber quartz\nreview: amber quartz dawn\n");
  for (const ending of ["\n", "\r\n", "\r"]) {
    const text = ["header", "amber amber", "quartz", "", "dawn", "tail"].join(
      ending,
    );
    const result = checkOutwardArtifact(root, { kind: "pr-body", text });
    assert.deepEqual(
      result.findings.map(({ span, count, mode }) => ({
        text: text.slice(span.start, span.end),
        count,
        mode,
      })),
      [
        { text: "amber amber", count: 2, mode: "refuse" },
        {
          text: ["amber amber", "quartz"].join(ending),
          count: 1,
          mode: "refuse",
        },
        {
          text: ["amber amber", "quartz", "", "dawn"].join(ending),
          count: 1,
          mode: "review",
        },
      ],
    );
    assert.doesNotMatch(JSON.stringify(result), /amber|quartz|dawn/u);
    // An exemption for the starting line lifts only the single-line match.
    const exempt = checkOutwardArtifact(root, {
      kind: "pr-body",
      text,
      sections: [
        {
          name: "existing",
          start: text.indexOf("amber"),
          end: text.indexOf("quartz") - ending.length,
          exempt: ["vocabulary.local"],
        },
      ],
    });
    assert.deepEqual(
      exempt.findings.map(({ count, mode }) => ({ count, mode })),
      [
        { count: 1, mode: "refuse" },
        { count: 1, mode: "review" },
      ],
    );
  }
  for (const endLine of [undefined, null, 0, 1, 2.5, 4, "2"]) {
    assert.throws(
      () =>
        lint("pr-body", "header\nbody\ntail", {
          localTerms: {
            status: "review",
            findings: [{ line: 2, endLine, count: 1, mode: "review" }],
          },
        }),
      /invalid local-terms findings/u,
    );
  }
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
  assert.equal(denied.status, "unavailable");
  assert.equal(denied.checks.localTerms.status, "unavailable");
  assert.deepEqual(rules(denied), ["vocabulary.review"]);
});

test("WO-227 criterion 3: a present list with no terms is present with a count of zero; an uncontained list refuses without raw errors, and public checks still run", (t) => {
  const { root, terms } = fixture(t);
  terms("# no terms\n");
  assert.deepEqual(checkLocalTerms(root, [{ name: "a", text: "anything" }]), {
    status: "present",
    terms: 0,
  });
  let result = checkOutwardArtifact(root, { kind: "pr-body", text: "DotLn" });
  assert.deepEqual(rules(result), ["vocabulary.review"]);
  assert.equal(result.status, "review");
  assert.deepEqual(result.checks.localTerms, { status: "pass", terms: 0 });
  assert.equal(
    checkOutwardArtifact(root, { kind: "pr-body", text: "ordinary" }).status,
    "pass",
  );
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
    JSON.stringify({ types: ["fix"], reviewTerms: ["PublicFixtureTerm"] }),
  );
  terms("refuse: SyntheticForbidden\n");
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
    ["vocabulary.review", "vocabulary.local"],
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
    "lib/temporary-roots.mjs",
    "lib/terms.mjs",
  ])
    write(
      `scripts/${path}`,
      readFileSync(new URL(path, import.meta.url), "utf8"),
    );
  write(
    "packages/skeleton/src/temporary-root-records.mjs",
    readFileSync(
      new URL(
        "../packages/skeleton/src/temporary-root-records.mjs",
        import.meta.url,
      ),
      "utf8",
    ),
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
  terms("refuse: SyntheticForbidden\nZorp\n");
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
  // Review items exit 4; a launchpad identifier refuses only for a target.
  result = run(root, "pr-body", "a zorp and a gem");
  assert.equal(result.status, 4);
  assert.equal(JSON.parse(result.stdout).status, "review");
  assert.doesNotMatch(result.stdout + result.stderr, /zorp/i);
  assert.equal(run(root, "pr-body", "Evidence WO-006").status, 0);
  result = spawnSync(process.execPath, [cli, "pr-body", "--target"], {
    input: "Evidence WO-006",
    encoding: "utf8",
    env: { ...process.env, DOTLN_LAUNCHPAD: root },
  });
  assert.equal(result.status, 1);
  assert.equal(
    JSON.parse(result.stdout).findings[0].rule,
    "identifier.launchpad",
  );
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
