import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  absoluteBodyLinks,
  assertGitHubBodyProfile,
  githubBodyProfileFailures,
  deliverableReady,
  relativeLinkFailures,
} from "./lib/github-body.mjs";
import { readinessFixture } from "./fixtures/target-publish/readiness.mjs";

const prettierConfig = JSON.parse(
  await readFile(new URL("../.prettierrc.json", import.meta.url), "utf8"),
);
await test("GitHub prose profile case 1", () => {
  assert.deepEqual(
    {
      printWidth: prettierConfig.printWidth,
      proseWrap: prettierConfig.proseWrap,
    },
    { printWidth: 80, proseWrap: "preserve" },
  );
});

const longParagraph =
  "This ordinary paragraph is intentionally longer than eighty characters so the reader, not the source author, owns its viewport wrapping.";
const longListItem =
  "- This list-item paragraph is intentionally longer than eighty characters and remains one physical source line for responsive rendering.";

await test("GitHub prose profile case 2", () => {
  assert.equal(githubBodyProfileFailures(`${longParagraph}\n`).length, 0);
});
await test("GitHub prose profile case 3", () => {
  assert.equal(githubBodyProfileFailures(`${longListItem}\n`).length, 0);
});

await test("GitHub prose profile case 4", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "This paragraph was wrapped by an author at a fixed column, even though it is one logical\nparagraph and should be left for the reader to wrap.\n",
        "PR.md",
      ),
    /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});
await test("GitHub prose profile case 5", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "- This list item was wrapped by an author at a fixed column, even though it is one logical\n  list-item paragraph and should be left for the reader to wrap.\n",
        "RELEASE-NOTES.md",
      ),
    /RELEASE-NOTES\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});

await test("relative links are refused only when asked, and never inside code", () => {
  const body =
    [
      "Read [the record](../../evidence/WO-1/README.md) and ![a figure](figures/a.png).",
      "",
      "An absolute [link](https://github.com/o/r/blob/abc/docs/x.md) and a [mail](mailto:a@b.c) pass.",
      "",
      "A protocol-relative [one](//example.invalid/x) passes; a bare [fragment](#top) is relative.",
      "",
      "Inline code keeps `[a](../b.md)` and the fence below keeps its link.",
      "",
      "```",
      "[fenced](../c.md)",
      "```",
      "",
      "[ref]: ../../decisions.md",
    ].join("\n") + "\n";
  assert.equal(githubBodyProfileFailures(body).length, 0);
  assert.deepEqual(
    relativeLinkFailures(body).map((row) => [row.line, row.href]),
    [
      [1, "../../evidence/WO-1/README.md"],
      [1, "figures/a.png"],
      [5, "#top"],
      [13, "../../decisions.md"],
    ],
  );
  assert.equal(githubBodyProfileFailures(body, { links: true }).length, 4);
  assert.throws(
    () => assertGitHubBodyProfile(body, "PR.md", { links: true }),
    /PR\.md:1: relative link \.\.\/\.\.\/evidence\/WO-1\/README\.md; a published body links absolute/,
  );
  assert.doesNotThrow(() => assertGitHubBodyProfile(body, "PR.md"));
});

await test("relative links are written absolute at the reviewed revision; escaping ones and bare fragments become text", () => {
  const body =
    [
      'Read [the record](../../evidence/WO-1/README.md#top) and ![a figure](figures/a.png "Figure").',
      "An escaping [link](../../../../outside.md) and a [fragment](#top) become text; `[code](../x.md)` stays.",
      "An absolute [link](https://example.invalid/x) stays.",
      "",
      "[ref]: ../../decisions.md",
      "[gone]: ../../../../outside.md",
    ].join("\n") + "\n";
  const published = absoluteBodyLinks(body, {
    from: "docs/final-reviews/WO-1/PR.md",
    repository: { host: "github.com", selector: "github.com/o/r" },
    revision: "abc123",
  });
  assert.equal(
    published,
    [
      'Read [the record](https://github.com/o/r/blob/abc123/docs/evidence/WO-1/README.md#top) and ![a figure](https://github.com/o/r/blob/abc123/docs/final-reviews/WO-1/figures/a.png?raw=true "Figure").',
      "An escaping link and a fragment become text; `[code](../x.md)` stays.",
      "An absolute [link](https://example.invalid/x) stays.",
      "",
      "[ref]: https://github.com/o/r/blob/abc123/docs/decisions.md",
      "",
    ].join("\n") + "\n",
  );
  assert.equal(relativeLinkFailures(published).length, 0);
  // Without a GitHub target every relative link is written as its text.
  assert.equal(
    absoluteBodyLinks("See [the record](../x.md).\n", {
      from: "docs/a/PR.md",
      repository: null,
      revision: "abc",
    }),
    "See the record.\n",
  );
});

await test("angle-bracket destinations, single-quoted titles and bracketed definitions are links too, written with an encoded path", () => {
  const body =
    [
      "See [a space](<../a b.md>) and [a title](../t.md 'Title').",
      "",
      "[def]: <../d e.md>",
    ].join("\n") + "\n";
  assert.deepEqual(
    relativeLinkFailures(body).map((row) => row.href),
    ["../a b.md", "../t.md", "../d e.md"],
  );
  const published = absoluteBodyLinks(body, {
    from: "docs/a/PR.md",
    repository: { host: "github.com", selector: "github.com/o/r" },
    revision: "abc",
  });
  assert.equal(
    published,
    [
      "See [a space](https://github.com/o/r/blob/abc/docs/a%20b.md) and [a title](https://github.com/o/r/blob/abc/docs/t.md 'Title').",
      "",
      "[def]: https://github.com/o/r/blob/abc/docs/d%20e.md",
    ].join("\n") + "\n",
  );
  assert.equal(relativeLinkFailures(published).length, 0);
});

await test("valid link forms with nested brackets, balanced parentheses, padding, titles and escapes are rewritten; a link split across lines is refused by the parser-backed profile; indented code stays", () => {
  const body =
    [
      "A [nested [label]](../evidence/WO-188/decisions.md) and a [file](file(1).md) with balanced parentheses.",
      "",
      "A [padded]( ../p.md ) destination, a [paren](../q.md (Paren title)) title and an [esc\\]aped](../e.md) label.",
      "",
      "A label holding code [`a]b`](../c.md), an escaped \\[bracket](../n.md) and an absolute [link](https://example.invalid/x).",
      "",
      "[two",
      "lines](../m.md)",
      "",
      "    [literal](../code.md)",
    ].join("\n") + "\n";
  assert.deepEqual(
    relativeLinkFailures(body).map((row) => [row.line, row.href]),
    [
      [1, "../evidence/WO-188/decisions.md"],
      [1, "file(1).md"],
      [3, "../p.md"],
      [3, "../q.md"],
      [3, "../e.md"],
      [5, "../c.md"],
      [7, "../m.md"],
    ],
  );
  const published = absoluteBodyLinks(body, {
    from: "docs/final-reviews/WO-1/PR.md",
    repository: { host: "github.com", selector: "github.com/o/r" },
    revision: "abc",
  });
  assert.equal(
    published,
    [
      "A [nested [label]](https://github.com/o/r/blob/abc/docs/final-reviews/evidence/WO-188/decisions.md) and a [file](https://github.com/o/r/blob/abc/docs/final-reviews/WO-1/file%281%29.md) with balanced parentheses.",
      "",
      "A [padded](https://github.com/o/r/blob/abc/docs/final-reviews/p.md) destination, a [paren](https://github.com/o/r/blob/abc/docs/final-reviews/q.md (Paren title)) title and an [esc\\]aped](https://github.com/o/r/blob/abc/docs/final-reviews/e.md) label.",
      "",
      "A label holding code [`a]b`](https://github.com/o/r/blob/abc/docs/final-reviews/c.md), an escaped \\[bracket](../n.md) and an absolute [link](https://example.invalid/x).",
      "",
      "[two",
      "lines](../m.md)",
      "",
      "    [literal](../code.md)",
    ].join("\n") + "\n",
  );
  // The split link is the one rendered relative link left, and the profile
  // refuses it rather than publishing it.
  assert.deepEqual(
    githubBodyProfileFailures(published, { links: true })
      .filter((row) => row.kind === "relative-link")
      .map((row) => [row.line, row.href]),
    [[7, "../m.md"]],
  );
  // Without a GitHub target a nested label is written as its own text.
  assert.equal(
    absoluteBodyLinks("See [the [record]](../x.md).\n", {
      from: "docs/a/PR.md",
      repository: null,
      revision: "abc",
    }),
    "See the [record].\n",
  );
});

await test("an empty destination is a relative link: the profile refuses it and the rewriter writes the link's text", () => {
  const body =
    [
      'An [empty]() link, one [in brackets](<> "Title") and an ![empty image]() each render with an empty destination.',
      "",
      "[empty-def]: <>",
    ].join("\n") + "\n";
  assert.deepEqual(
    relativeLinkFailures(body).map((row) => [row.line, row.href]),
    [
      [1, ""],
      [1, ""],
      [1, ""],
      [3, ""],
    ],
  );
  assert.throws(
    () => assertGitHubBodyProfile(body, "PR.md", { links: true }),
    /PR\.md:1: relative link with an empty destination; a published body links absolute/,
  );
  const published = absoluteBodyLinks(body, {
    from: "docs/final-reviews/WO-1/PR.md",
    repository: { host: "github.com", selector: "github.com/o/r" },
    revision: "abc",
  });
  assert.equal(
    published,
    "An empty link, one in brackets and an empty image each render with an empty destination.\n\n\n",
  );
  assert.equal(githubBodyProfileFailures(published, { links: true }).length, 0);
});

await test("code and raw HTML the parser renders keep their bytes whatever their backtick runs or line count; an escaped or closed backtick leaves a real link", () => {
  const body =
    [
      "A span `` [sample](file.md) ` literal `` with a shorter run inside, the opposite order `[a](b.md) `` x` and a longer run ``` [c](d.md) `` y ``` stay.",
      "",
      "A span opened here `[two](lines.md)",
      "closes here` and this [link](after.md) is real.",
      "",
      "An escaped \\`[opener](esc.md)` is a link; so is the one after `code\\`[closed](span.md)`.",
      "",
      "<div>",
      "[html block](block.md)",
      "</div>",
      "",
      'An inline <span title="[tag](attr.md)">tag</span> keeps its attribute.',
      "",
      "> A quoted `` [q](q.md) ` r `` span stays and its [link](quoted.md) is real.",
    ].join("\n") + "\n";
  assert.deepEqual(
    relativeLinkFailures(body).map((row) => [row.line, row.href]),
    [
      [4, "after.md"],
      [6, "esc.md"],
      [6, "span.md"],
      [14, "quoted.md"],
    ],
  );
  const published = absoluteBodyLinks(body, {
    from: "docs/final-reviews/WO-1/PR.md",
    repository: { host: "github.com", selector: "github.com/o/r" },
    revision: "abc",
  });
  const at = "https://github.com/o/r/blob/abc/docs/final-reviews/WO-1";
  assert.equal(
    published,
    [
      body.split("\n")[0],
      "",
      "A span opened here `[two](lines.md)",
      `closes here\` and this [link](${at}/after.md) is real.`,
      "",
      `An escaped \\\`[opener](${at}/esc.md)\` is a link; so is the one after \`code\\\`[closed](${at}/span.md)\`.`,
      "",
      "<div>",
      "[html block](block.md)",
      "</div>",
      "",
      'An inline <span title="[tag](attr.md)">tag</span> keeps its attribute.',
      "",
      `> A quoted \`\` [q](q.md) \` r \`\` span stays and its [link](${at}/quoted.md) is real.`,
    ].join("\n") + "\n",
  );
  // No rendered relative link remains; the two-line span is a soft wrap the
  // prose profile refuses on its own terms.
  assert.deepEqual(
    githubBodyProfileFailures(published, { links: true }).map((row) => [
      row.kind ?? "soft-wrap",
      row.line,
    ]),
    [["soft-wrap", 4]],
  );
});

await test("code and raw HTML keep their bytes under every Markdown line ending, a link on such a line is rewritten, a leading byte-order mark stays, and the profile counts the lines the parser counts", () => {
  const options = {
    from: "docs/final-reviews/WO-1/PR.md",
    repository: { host: "github.com", selector: "github.com/o/r" },
    revision: "abc",
  };
  const at = "https://github.com/o/r/blob/abc/docs/final-reviews";
  // A lone carriage return ends a line: a code span after such a paragraph
  // break and an indented code block inside a list item keep their bytes.
  for (const source of [
    "Intro\r\r`` [sample](file.md) ` literal ``",
    "- code:\r\r      [sample](file.md)",
  ])
    assert.equal(absoluteBodyLinks(source, options), source);
  // One body mixing the three line endings: a fence closed on a lone
  // carriage-return line, a raw HTML block on carriage-return-and-newline
  // lines, a code span and a real link on a lone carriage-return line, and a
  // definition ended by carriage return and newline.
  const body =
    "Intro\n\n```md\r[fenced](../c.md)\r```\r\r<div>\r\n[html](../h.md)\r\n</div>\r\n\r\nA span `[code](../x.md)` and a [link](../l.md) here.\r\r[def]: ../d.md\r\n\nLast ![figure](f.png).";
  const published = absoluteBodyLinks(body, options);
  assert.equal(
    published,
    `Intro\n\n\`\`\`md\r[fenced](../c.md)\r\`\`\`\r\r<div>\r\n[html](../h.md)\r\n</div>\r\n\r\nA span \`[code](../x.md)\` and a [link](${at}/l.md) here.\r\r[def]: ${at}/d.md\r\n\nLast ![figure](${at}/WO-1/f.png?raw=true).`,
  );
  assert.deepEqual(published.match(/\r\n|\r|\n/gu), body.match(/\r\n|\r|\n/gu));
  assert.equal(githubBodyProfileFailures(published, { links: true }).length, 0);
  // A leading byte-order mark is outside the parser's column count; the
  // rewriter keeps it and still masks the span and rewrites the link.
  assert.equal(
    absoluteBodyLinks("﻿`[code](../x.md)` and a [link](../l.md).\n", options),
    `﻿\`[code](../x.md)\` and a [link](${at}/l.md).\n`,
  );
  // The profile's soft-wrap line numbers and the parser's link line numbers
  // count the same lines when a body uses lone carriage returns.
  const wrapped =
    "First prose line\rsecond prose line\r\rA [relative](x.md) link.\r";
  assert.deepEqual(githubBodyProfileFailures(wrapped, { links: true }), [
    { line: 2, previousLine: 1 },
    { line: 4, href: "x.md", kind: "relative-link" },
  ]);
  assert.throws(
    () => assertGitHubBodyProfile(wrapped, "PR.md"),
    /soft wrap between lines 1 and 2/,
  );
});

await test("a destination is the one the parser renders: backslash escapes and character references resolve before the path is encoded, a reference-spelled scheme stays absolute, and brackets the parser does not render as a link keep their bytes while the link inside them is rewritten", () => {
  const options = {
    from: "docs/final-reviews/WO-1/PR.md",
    repository: { host: "github.com", selector: "github.com/o/r" },
    revision: "abc",
  };
  const at = "https://github.com/o/r/blob/abc/docs/final-reviews/WO-1";
  const body =
    [
      "An [escaped](file\\(1\\).md) name, a [reference](file&#40;1&#41;.md) name and an [ampersand](a&amp;b.md) name address the files they spell.",
      "",
      "An [underscore](file\\_1.md) and a [scheme](&#104;ttps://example.invalid/x) spelled by reference.",
      "",
      "Outer [a [b](c.md) d](e.md) brackets are text around the one link.",
      "",
      "[def]: file\\(1\\).md",
    ].join("\n") + "\n";
  assert.deepEqual(
    relativeLinkFailures(body).map((row) => [row.line, row.href]),
    [
      [1, "file(1).md"],
      [1, "file(1).md"],
      [1, "a&b.md"],
      [3, "file_1.md"],
      [5, "c.md"],
      [7, "file(1).md"],
    ],
  );
  const published = absoluteBodyLinks(body, options);
  assert.equal(
    published,
    [
      `An [escaped](${at}/file%281%29.md) name, a [reference](${at}/file%281%29.md) name and an [ampersand](${at}/a&b.md) name address the files they spell.`,
      "",
      `An [underscore](${at}/file_1.md) and a [scheme](&#104;ttps://example.invalid/x) spelled by reference.`,
      "",
      `Outer [a [b](${at}/c.md) d](e.md) brackets are text around the one link.`,
      "",
      `[def]: ${at}/file%281%29.md`,
    ].join("\n") + "\n",
  );
  assert.equal(githubBodyProfileFailures(published, { links: true }).length, 0);
  // Without a GitHub target the rendered link, not the outer brackets, is
  // written as its text.
  assert.equal(
    absoluteBodyLinks("Outer [a [b](c.md) d](e.md) brackets.\n", {
      from: "docs/a/PR.md",
      repository: null,
      revision: "abc",
    }),
    "Outer [a b d](e.md) brackets.\n",
  );
});

const structuralMarkdown = `# Heading

First paragraph.

Second paragraph.

- First distinct item.
- Second distinct item.

> Quoted line with an intentional hard break.  
> Next quoted line.

| Column A | Column B |
| -------- | -------- |
| value    | value    |

Column A | Column B
-------- | --------
value | value

Column A \\| literal | Column B
------------------- | --------
value | value

\`\`\`text
code stays
on its own lines
\`\`\`

    indented code

    - literal bullet in indented code
    next indented code line

- List item containing a nested fenced block.
    \`\`\`text
    nested code
    stays exempt
    \`\`\`
`;
await test("GitHub prose profile case 6", () => {
  assert.equal(githubBodyProfileFailures(structuralMarkdown).length, 0);
});

await test("GitHub prose profile case 7", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "- This list item starts on one line but its accidental continuation is hidden by indentation.\n    The continuation is still prose within the list item, not an indented code block.\n",
        "PR.md",
      ),
    /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});
await test("GitHub prose profile case 8", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "An even pair of trailing backslashes ends in a literal backslash, not a Markdown hard break.\\\\\nThis adjacent line is therefore still a prose soft wrap.\n",
        "PR.md",
      ),
    /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});
await test("GitHub prose profile case 9", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "This paragraph starts before a top-level pseudo-fence.\n    ```text\nThis is adjacent prose because a four-space fence cannot interrupt that paragraph.\n    ```\n",
        "PR.md",
      ),
    /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});
await test("GitHub prose profile case 10", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "This paragraph was wrapped immediately before an autolink.\n<https://example.invalid/path>\n",
        "PR.md",
      ),
    /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});
await test("GitHub prose profile case 11", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "> This quoted paragraph starts with an explicit quote marker.\nIts lazy continuation is still part of the quoted paragraph and must not hide a source wrap.\n",
        "RELEASE-NOTES.md",
      ),
    /RELEASE-NOTES\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});
await test("GitHub prose profile case 12", () => {
  assert.throws(
    () =>
      assertGitHubBodyProfile(
        "A prose line may contain A | B without becoming a table.\nThis adjacent prose line must still be detected as a source wrap.\n",
        "PR.md",
      ),
    /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
  );
});

// The target pull-request generator is pure over its artifacts (WO-064).
const { generateTargetPullRequest } = await import("./lib/github-body.mjs");
const { lintOutwardArtifact } = await import("./lib/outward-lint.mjs");
const vocabulary = JSON.parse(
  await readFile(
    new URL("../docs/control/outward-vocabulary.json", import.meta.url),
    "utf8",
  ),
);
const base = "a".repeat(40);
const head = "b".repeat(40);
const artifacts = (overrides = {}) => ({
  commitMessage: "feat(parser): accept empty input\n\nHost body line.\n",
  workOrder: {
    objective:
      "Accept\nempty input *without* @someone #12 <b>markup</b> | pipes.",
    acceptanceCriteria: ["Empty input returns []", "Other input is unchanged"],
    nonGoals: [],
  },
  tests: {
    before: { exitCode: 1, signal: null },
    after: { exitCode: null, signal: "SIGTERM" },
  },
  diff: {
    baseCommit: base,
    headCommit: head,
    files: [
      { path: "src/parse_input.ts", added: 3, deleted: 1 },
      { path: "assets/logo.png", added: null, deleted: null },
    ],
  },
  ...overrides,
});

await test("WO-064 target pull request: title, escaped contract, matrix and diff", () => {
  const { title, body } = generateTargetPullRequest(
    artifacts({
      matrix: {
        subjectRevision: head,
        rows: [
          { description: "Empty input returns []", status: "verified" },
          { description: "Other input is unchanged", status: "stale" },
        ],
      },
    }),
  );
  assert.equal(title, "feat(parser): accept empty input");
  assert.equal(
    `${body.split("## Deliverable-ready")[0].trimEnd()}\n`,
    `## Contract

**Objective:** Accept empty input &#42;without&#42; &#64;someone &#35;12 &#60;b&#62;markup&#60;/b&#62; &#124; pipes.

**Non-goals:** none declared

## Acceptance

| Criterion | Status |
| --- | --- |
| Empty input returns &#91;&#93; | verified |
| Other input is unchanged | stale |

Independent verification: acceptance matrix for ${head}: 1 verified, 0 failed, 1 stale, 0 incomplete.

Focused test observed by the host: exit 1 before the change, signal SIGTERM after it.

## Change

| Path | Added | Removed |
| --- | ---: | ---: |
| src/parse&#95;input.ts | 3 | 1 |
| assets/logo.png | binary | binary |

2 files changed from base ${base} to head ${head}.
`,
  );
  assert.equal(githubBodyProfileFailures(body).length, 0);
});

await test("WO-182 AC1/AC2: fourteen evidenced rows resolve in the fixture artifact store and render through outward lint", () => {
  const fixture = readinessFixture();
  const rows = deliverableReady(fixture.artifacts);
  assert.equal(rows.length, 14);
  assert.equal(new Set(rows.map((row) => row.id)).size, 14);
  for (const row of rows) {
    assert.equal(row.status, "evidenced", row.item);
    assert.ok(row.evidenceRefs.length > 0);
    for (const ref of row.evidenceRefs)
      assert.notEqual(fixture.resolveRef(ref), undefined, ref);
  }
  const { body } = generateTargetPullRequest({
    ...fixture.bodyInputs,
    readinessArtifacts: fixture.artifacts,
  });
  assert.match(
    body,
    /## Deliverable-ready\n\nDeliverable-ready: ready; every applicable item is evidenced\./u,
  );
  assert.equal(body.match(/\| evidenced \|/gu).length, 14);
  for (const row of rows)
    for (const ref of row.evidenceRefs)
      assert.ok(body.includes(ref.replaceAll("#", "&#35;")), ref);
  assert.equal(githubBodyProfileFailures(body).length, 0);
  assert.equal(
    lintOutwardArtifact({
      kind: "pr-body",
      text: body,
      vocabulary,
      localTerms: { status: "present" },
    }).status,
    "pass",
  );
});

await test("WO-182 AC1: missing baseline/review name their events; declared nonvisual stories are not applicable", () => {
  const { artifacts } = readinessFixture();
  artifacts.baseline = null;
  artifacts.review = null;
  const rows = deliverableReady(artifacts);
  assert.match(
    rows.find((row) => row.id === "baseline").reason,
    /BaselineWitnessed/u,
  );
  assert.match(
    rows.find((row) => row.id === "independent").reason,
    /ReviewCompleted/u,
  );
  assert.equal(rows.find((row) => row.id === "baseline").status, "absent");
  assert.equal(rows.find((row) => row.id === "independent").status, "absent");
  artifacts.verification.value.rows[0].criterion.claimType = "behavior";
  const visual = deliverableReady(artifacts).find((row) => row.id === "visual");
  assert.equal(visual.status, "not-applicable");
  assert.match(visual.reason, /no visual claims/u);
  artifacts.verification = null;
  assert.equal(
    deliverableReady(artifacts).find((row) => row.id === "visual").status,
    "absent",
  );
});

await test("WO-182 carries minor independent review findings into known items without widening scope", () => {
  const { artifacts, bodyInputs } = readinessFixture();
  artifacts.review.value.result.counts.should = 1;
  artifacts.review.value.result.findings = [
    {
      class: "review",
      severity: "should",
      observed: "A helper name could be clearer.",
      expected: "Use the existing naming convention.",
      evidenceRefs: ["diff", "file:src/view.ts"],
    },
  ];
  const before = structuredClone(artifacts);
  const { body } = generateTargetPullRequest({
    ...bodyInputs,
    readinessArtifacts: artifacts,
  });
  assert.match(
    body,
    /Known review items \(recorded without expanding scope\):/u,
  );
  assert.match(body, /\| should \| A helper name could be clearer\./u);
  assert.match(body, /Deliverable-ready: ready;/u);
  assert.deepEqual(artifacts, before);
});

await test("WO-182 refuses stale, failed, unbound, synthetic or self-reviewed evidence as readiness", () => {
  const mutations = [
    [
      "source-revision",
      (a) => {
        a.current.value.revision = "c".repeat(40);
      },
    ],
    [
      "ambiguity",
      (a) => {
        a.preparation.value.unresolvedMaterialAmbiguities.push("unanswered");
      },
    ],
    [
      "ambiguity",
      (a) => {
        a.preparation.value.contractHash = "c".repeat(64);
      },
    ],
    [
      "baseline",
      (a) => {
        a.baseline.value.capsule.subject.revision = "c".repeat(40);
      },
    ],
    [
      "baseline",
      (a) => {
        a.baseline.occurredAt = 11;
      },
    ],
    [
      "baseline",
      (a) => {
        a.baseline.value.outcome = "not-reproduced";
      },
    ],
    [
      "repo-native",
      (a) => {
        a.review.value.result.conventionsPath = null;
      },
    ],
    [
      "scope",
      (a) => {
        a.scope.value.surfaces = ["other.ts"];
      },
    ],
    [
      "checks",
      (a) => {
        delete a.preparation.value.checks.lint;
      },
    ],
    [
      "checks",
      (a) => {
        a.verification.value.evidence[1].hostTest.exitCode = 1;
      },
    ],
    [
      "live-behavior",
      (a) => {
        a.verification.value.evidence[0].source = "synthetic";
      },
    ],
    [
      "visual",
      (a) => {
        delete a.verification.value.evidence[3].witness;
      },
    ],
    [
      "acceptance",
      (a) => {
        a.verification.value.rows[0].status = "incomplete";
      },
    ],
    [
      "acceptance",
      (a) => {
        a.verification.value.rows[0].evaluations[0].stale = true;
      },
    ],
    [
      "acceptance",
      (a) => {
        a.verification.value.rows[0].criterion.description = "Other contract";
      },
    ],
    [
      "independent",
      (a) => {
        a.review.value.result.reviewerEpisodeId = "implementer";
      },
    ],
    [
      "independent",
      (a) => {
        a.review.value.result.verifierEpisodeIds = ["unrelated"];
      },
    ],
    [
      "final-diff",
      (a) => {
        a.review.value.subject.diff += "unreviewed";
      },
    ],
    [
      "final-diff",
      (a) => {
        a.review.value.result.counts.blocking = 1;
      },
    ],
    [
      "grounded-body",
      (a) => {
        a.body.value.diff.headCommit = "c".repeat(40);
      },
    ],
    [
      "monitoring",
      (a) => {
        a.preparation.value.monitoring.sourceDrift = "ignore";
      },
    ],
  ];
  for (const [id, mutate] of mutations) {
    const artifacts = structuredClone(readinessFixture().artifacts);
    mutate(artifacts);
    assert.equal(
      deliverableReady(artifacts).find((row) => row.id === id).status,
      "absent",
      id,
    );
  }
});

await test("WO-064 target pull request: refuses a matrix for another revision and missing artifacts", () => {
  assert.throws(
    () =>
      generateTargetPullRequest(
        artifacts({
          matrix: {
            subjectRevision: base,
            rows: [{ description: "x", status: "verified" }],
          },
        }),
      ),
    /acceptance matrix must describe the published head/,
  );
  assert.throws(
    () => generateTargetPullRequest(artifacts({ commitMessage: "\n" })),
    /commit subject is empty/,
  );
  assert.throws(
    () =>
      generateTargetPullRequest(
        artifacts({ diff: { baseCommit: base, headCommit: head, files: [] } }),
      ),
    /invalid diff summary/,
  );
  assert.throws(
    () =>
      generateTargetPullRequest(
        artifacts({ tests: { before: { exitCode: 1 }, after: {} } }),
      ),
    /after test outcome is missing/,
  );
});

await test("WO-064 target pull request: a same-head matrix speaks only for this WorkOrder's criteria", () => {
  const withRows =
    (rows, workOrder = artifacts().workOrder) =>
    () =>
      generateTargetPullRequest(
        artifacts({ workOrder, matrix: { subjectRevision: head, rows } }),
      );
  const refused =
    /acceptance matrix criteria must be the WorkOrder's acceptance criteria/;
  // An unrelated verified row at the published head.
  assert.throws(
    withRows(
      [{ description: "Unrelated behavior works", status: "verified" }],
      {
        ...artifacts().workOrder,
        acceptanceCriteria: ["Input is rejected safely"],
      },
    ),
    refused,
  );
  const empty = { description: "Empty input returns []", status: "verified" };
  const other = { description: "Other input is unchanged", status: "failed" };
  for (const rows of [
    [empty],
    [
      empty,
      other,
      { description: "Unrelated behavior works", status: "verified" },
    ],
    [empty, { ...other, description: "Other input is unchanged." }],
  ])
    assert.throws(withRows(rows), refused);
  // Correspondence is by criterion, so the table keeps the contract's order.
  const { body } = withRows([other, empty])();
  assert.match(
    body,
    /\| Criterion \| Status \|\n\| --- \| --- \|\n\| Empty input returns &#91;&#93; \| verified \|\n\| Other input is unchanged \| failed \|\n/u,
  );
});

await test("WO-064 target pull request: contract text naming launchpad vocabulary is refused by the lint", () => {
  const { body } = generateTargetPullRequest(
    artifacts({
      workOrder: {
        ...artifacts().workOrder,
        objective: "Mirror the DotLn launchpad layout.",
      },
    }),
  );
  const result = lintOutwardArtifact({
    kind: "pr-body",
    text: body,
    vocabulary,
    localTerms: { status: "present" },
  });
  assert.equal(result.status, "refused");
  assert.deepEqual(
    result.findings.map((finding) => [finding.rule, finding.term]),
    [
      ["vocabulary.launchpad", "DotLn"],
      ["vocabulary.launchpad", "launchpad"],
    ],
  );
});

await test("WO-184 criterion 8: build/lint not-applicable requires a reason and supplies no evidence", () => {
  const fixture = readinessFixture();
  const checks = fixture.artifacts.preparation.value.checks;
  const verification = fixture.artifacts.verification.value;
  verification.evidence = verification.evidence.filter(
    (entry) => entry.checkId !== "lint",
  );
  verification.subject.evidence = verification.subject.evidence.filter(
    (entry) => entry.checkId !== "lint",
  );
  for (const row of verification.rows)
    for (const evaluation of row.evaluations)
      evaluation.evidenceRefs = evaluation.evidenceRefs.filter(
        (id) => id !== "lint",
      );
  checks.lint = {
    status: "not-applicable",
    reason: "No lint step in this target.",
  };
  let row = deliverableReady(fixture.artifacts).find(
    (entry) => entry.id === "checks",
  );
  assert.equal(row.status, "evidenced");
  assert.match(row.reason, /lint not-applicable: No lint step/);
  assert.ok(!verification.evidence.some((entry) => entry.checkId === "lint"));
  const complete = structuredClone(verification.evidence);
  verification.evidence = verification.evidence.filter(
    (entry) => entry.checkId !== "test",
  );
  verification.subject.evidence = verification.subject.evidence.filter(
    (entry) => entry.checkId !== "test",
  );
  assert.equal(
    deliverableReady(fixture.artifacts).find((entry) => entry.id === "checks")
      .status,
    "absent",
  );
  verification.evidence = complete;
  verification.subject.evidence = complete;
  checks.build = {
    status: "not-applicable",
    reason: "No build step in this target.",
  };
  row = deliverableReady(fixture.artifacts).find(
    (entry) => entry.id === "checks",
  );
  assert.equal(row.status, "evidenced");
  assert.match(row.reason, /build not-applicable/);
  checks.tests = { status: "not-applicable", reason: "Attempted bypass." };
  assert.equal(
    deliverableReady(fixture.artifacts).find((entry) => entry.id === "checks")
      .status,
    "absent",
  );
  checks.tests = ["test"];
  checks.lint.reason = " ";
  assert.equal(
    deliverableReady(fixture.artifacts).find((entry) => entry.id === "checks")
      .status,
    "absent",
  );
});
