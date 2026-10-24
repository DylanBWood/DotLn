import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  absoluteBodyLinks,
  assertGitHubBodyProfile,
  assertPullRequestBodyShape,
  composeTargetBody,
  githubBodyProfileFailures,
  deliverableReady,
  pullRequestBodyShapeFailures,
  relativeLinkFailures,
  targetNativeReference,
  targetReadinessEvidence,
  targetChangeSection,
  targetGateSection,
  withMeterBlockLast,
} from "./lib/github-body.mjs";
import { readinessFixture } from "./fixtures/target-publish/readiness.mjs";

const prettierConfig = JSON.parse(
  await readFile(new URL("../.prettierrc.json", import.meta.url), "utf8"),
);
await test("target gate section prints only reviewed outcomes and aggregate time", () => {
  const text = targetGateSection({
    commit: "a".repeat(40),
    names: ["test", "lint"],
    selection: "review",
    durationMs: 321,
    argv: ["/private/command"],
    evidenceRef: "internal:reference",
  });
  assert.match(text, /test \| Passed/u);
  assert.match(text, /lint \| Passed/u);
  assert.ok(text.includes("a".repeat(40)));
  assert.match(text, /Total duration: 321 ms/u);
  assert.doesNotMatch(text, /private|internal|argv|evidenceRef/u);
});
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

test("publication links decode escaped paths before containment and encode them once", () => {
  const options = {
    from: "docs/PR.md",
    repository: { selector: "github.com/fixture/project" },
    revision: "reviewed",
  };
  const body = absoluteBodyLinks(
    "[a](file%281%29.md) [b](%2e%2e%2f%2e%2e%2fsecret.md) [c](dir%2ffile.md) [d](percent%25.md)",
    options,
  );
  assert.ok(body.includes("/docs/file%281%29.md"), body);
  assert.ok(body.includes("/docs/dir/file.md"), body);
  assert.ok(body.includes("/docs/percent%25.md"), body);
  assert.doesNotMatch(body, /secret\.md|%2528|%2525/);
  assert.deepEqual(relativeLinkFailures(body), []);
  const queried = absoluteBodyLinks(
    "[read](README.md?plain=1#section) ![image](pic.png?size=2)",
    options,
  );
  assert.ok(queried.includes("README.md?plain=1#section"));
  assert.ok(queried.includes("pic.png?size=2&raw=true"));
});

test("publication normalizes nested images and links exposed by inner removal", () => {
  const options = {
    from: "docs/PR.md",
    repository: { selector: "github.com/fixture/project" },
    revision: "reviewed",
  };
  for (const inner of ["[b]()", "[b](#here)", "[b](../../outside)", "![b]()"])
    for (const ending of ["\n", "\r\n", "\r"]) {
      const source = `Outer [a ${inner} d](e.md).${ending}\`[code]()\`${ending}`;
      const body = absoluteBodyLinks(source, options);
      assert.deepEqual(relativeLinkFailures(body), [], body);
      assert.ok(body.includes("/docs/e.md"), body);
      assert.ok(body.endsWith(`\`[code]()\`${ending}`));
      assert.equal(absoluteBodyLinks(body, options), body);
      assert.deepEqual(
        relativeLinkFailures(absoluteBodyLinks(source, { from: "docs/PR.md" })),
        [],
      );
    }
});
test("publication reports the offsets of each destination it wrote and none of an authored one", () => {
  const options = {
    from: "docs/PR.md",
    repository: { selector: "github.com/fixture/project" },
    revision: "reviewed",
  };
  const url = (path) =>
    `https://github.com/fixture/project/blob/reviewed/${path}`;
  for (const ending of ["\n", "\r\n", "\r"]) {
    // The authored link carries the same bytes as the first written one. The
    // image's inner link is written by the first pass and moves when the
    // second pass turns the image, whose path leaves the repository, into
    // its text.
    const source = `﻿[a](a.md) and [authored](${url("docs/a.md")}).${ending}![pic](p.png)${ending}![see [r](r.md)](../../../outside.png)${ending}${ending}[d]: d.md "title"${ending}`;
    const written = [];
    const body = absoluteBodyLinks(source, { ...options, written });
    assert.equal(body, absoluteBodyLinks(source, options));
    assert.deepEqual(
      written.map(({ start, end }) => body.slice(start, end)),
      [
        url("docs/a.md"),
        url("docs/p.png?raw=true"),
        url("docs/r.md"),
        url("docs/d.md"),
      ],
    );
    assert.ok(body.includes(`see [r](${url("docs/r.md")})`), body);
    const authored = body.indexOf(url("docs/a.md"), written[0].end);
    assert.ok(authored > written[0].end, body);
    assert.ok(
      written.every(
        ({ start, end }) =>
          end <= authored || start >= authored + url("docs/a.md").length,
      ),
    );
    // A body that is already absolute reports nothing written.
    const again = [];
    assert.equal(absoluteBodyLinks(body, { ...options, written: again }), body);
    assert.deepEqual(again, []);
  }
});
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
      `An [escaped](${at}/file%281%29.md) name, a [reference](${at}/file%281%29.md) name and an [ampersand](${at}/a%26b.md) name address the files they spell.`,
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
    "Outer a b d brackets.\n",
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

await test("WO-210 target references admit commits, contained paths and acceptance criteria only", () => {
  for (const [ref, expected] of [
    [`${head}:src/view.ts`, `src/view.ts at ${head}`],
    [`commit:${base}`, `commit ${base}`],
    [`commit:${head}:src/view.ts`, `src/view.ts at ${head}`],
    ["file:src/view.ts", `src/view.ts at ${head}`],
    ["head", `commit ${head}`],
    ["base", `commit ${base}`],
    ["contract:criterion:0", "acceptance criterion 1"],
    ["#contract", "Contract section"],
    ["#acceptance", "Acceptance section"],
    ["diff", `Change section from ${base} to ${head}`],
    ["source-event:abc", null],
    ["review-event:abc", null],
    ["delivery-preparation#/checks", null],
    ["evt_123", null],
    ["file:../private.txt", null],
    ["file:/private.txt", null],
    ["file:~/private.txt", null],
    ["file:~someone/private.txt", null],
    ["file:C:/private.txt", null],
    ["file:C:private.txt", null],
    [`${head}:~/private.txt`, null],
    [`${head}:D:/private.txt`, null],
    ["npm test -- /machine/path", null],
    [null, null],
  ])
    assert.equal(
      targetNativeReference(ref, { head, base }),
      expected,
      String(ref),
    );
  const input = artifacts();
  const generated = generateTargetPullRequest(input).body;
  assert.equal(
    generated.split("## Change\n")[1].split("\n\n## Deliverable-ready")[0],
    targetChangeSection(input.diff).slice("## Change\n".length),
  );
});

await test("target references omit a path holding a reserved, invisible or look-alike character, a leading tilde or a stray space", () => {
  for (const [ref, expected] of [
    ["file:src/a.ts", `src/a.ts at ${head}`],
    ["file:docs/read me.md", `docs/read me.md at ${head}`],
    ["file:src/e\u0301.ts", `src/e\u0301.ts at ${head}`],
    [`${base}:src/\u00e9.ts`, `src/\u00e9.ts at ${base}`],
    ["file:src/routes/+page.svelte", `src/routes/+page.svelte at ${head}`],
    ["file:app/[id].tsx", `app/[id].tsx at ${head}`],
    ["file:@scope/pkg/index.ts", `@scope/pkg/index.ts at ${head}`],
    ["file:a%20b.ts", `a%20b.ts at ${head}`],
    ["file:docs/a,b (draft) ~1.md", `docs/a,b (draft) ~1.md at ${head}`],
    ["file:a*.ts", null],
    ["file:a?.ts", null],
    ["file:a|b.ts", null],
    ['file:a"b.ts', null],
    ["file:a'b.ts", null],
    ["file:a<b>.ts", null],
    ["file:a`b.ts", null],
    ["file:src/~backup/a.ts", null],
    ["file:&#47;home&#47;someone&#47;notes.txt", null],
    [`${head}:docs/a&b.md`, null],
    // A long segment ending in a reserved character is refused at once.
    [`file:src/${"a".repeat(48)}*.ts`, null],
    ["file:file:/home/someone/notes.txt", null],
    [`${head}:src/file:/home/someone/notes.txt`, null],
    [`commit:${head}:https:/example/notes.txt`, null],
    [`commit:${head}:file:/home/someone/notes.txt`, null],
    [`${head}: /home/someone/notes.txt`, null],
    ["file: /home/someone/notes.txt", null],
    ["file:src/a.ts ", null],
    ["file:docs/read  me.md", null],
    ["file:\u00a0/home/someone", null],
    ["file:\u3000/home/someone", null],
    ["file:\ufeff/home/someone", null],
    ["file:\u200b/etc/hosts", null],
    ["file:\u2060~/notes.txt", null],
    ["file:\u202e/etc/hosts", null],
    ["file:src/a.ts\u0085", null],
    ["file:\uff5e/notes.txt", null],
    ["file:\uff0fhome/someone", null],
    ["file:\uff0e\uff0e/etc/hosts", null],
    ["file:\u034f/home/someone/notes.txt", null],
    ["file:\ufe0f/home/someone/notes.txt", null],
    ["file:\u{e0100}/home/someone/notes.txt", null],
    ["file:\u115f/home/someone/notes.txt", null],
    ["file:\u1160/home/someone/notes.txt", null],
    ["file:\u2800/home/someone/notes.txt", null],
    ["file:file\ua789/home/someone/notes.txt", null],
    ["file:C\ua789/Windows/notes.txt", null],
    ["file:file\u2236/home/someone", null],
    ["file:\u2044home\u2044someone", null],
    ["file:\u29f8home\u29f8someone", null],
    ["file:\u2215home\u2215someone", null],
    ["file:\u223c/notes.txt", null],
    ["file:\u301c/notes.txt", null],
    ["file:src/ /home/someone", null],
    ["file:src /home/someone", null],
    ["file:src/\u0301a.ts", null],
    ["file:src/a\u2060b.ts", null],
  ])
    assert.equal(
      targetNativeReference(ref, { head, base }),
      expected,
      JSON.stringify(ref),
    );
  const { artifacts, bodyInputs } = readinessFixture();
  artifacts.review.value.result.counts.should = 1;
  artifacts.review.value.result.findings = [
    {
      class: "review",
      severity: "should",
      observed: "A helper name could be clearer.",
      expected: "Use the existing naming convention.",
      evidenceRefs: [
        "file:src/view.ts",
        "file:file:/home/someone/notes.txt",
        "file: /home/someone/notes.txt",
        "file:\u200b/home/someone/notes.txt",
      ],
    },
  ];
  const { body } = generateTargetPullRequest({
    ...bodyInputs,
    readinessArtifacts: artifacts,
  });
  assert.ok(body.includes(`src/view.ts at ${head}; 3 references omitted`));
  assert.doesNotMatch(body, /home|someone/u);
});

await test("WO-182 AC1/AC2: fourteen evidenced rows resolve in the fixture artifact store and render through outward lint", () => {
  const fixture = readinessFixture();
  for (const entry of fixture.artifacts.verification.value.evidence)
    if (entry.hostTest)
      entry.hostTest.command = "fixture-check /unpublished/machine-path";
  const rows = deliverableReady(fixture.artifacts);
  assert.equal(rows.length, 14);
  assert.equal(new Set(rows.map((row) => row.id)).size, 14);
  for (const row of rows) {
    assert.equal(row.status, "evidenced", row.item);
    assert.ok(row.evidenceRefs.length > 0);
    for (const ref of row.evidenceRefs)
      assert.notEqual(fixture.resolveRef(ref), undefined, ref);
  }
  const inputsBefore = structuredClone(fixture.artifacts);
  const { body } = generateTargetPullRequest({
    ...fixture.bodyInputs,
    readinessArtifacts: fixture.artifacts,
  });
  assert.match(
    body,
    /## Deliverable-ready\n\nDeliverable-ready: ready; every applicable item is evidenced\./u,
  );
  assert.equal(body.match(/\| evidenced \|/gu).length, 14);
  assert.ok(Object.isFrozen(targetReadinessEvidence));
  assert.deepEqual(
    Object.keys(targetReadinessEvidence),
    rows.map((row) => row.id),
  );
  for (const row of rows) {
    const text = targetReadinessEvidence[row.id]
      .replaceAll("{head}", head)
      .replaceAll("{base}", base);
    assert.ok(body.includes(`| ${row.item} | evidenced | ${text} |`), row.id);
  }
  assert.deepEqual(deliverableReady(fixture.artifacts), rows);
  assert.deepEqual(fixture.artifacts, inputsBefore);
  assert.match(body, /[1-9][0-9]* evidence references omitted/u);
  assert.ok(!body.includes("/unpublished/machine-path"));
  assert.doesNotMatch(
    body,
    /source-event:|baseline-event:|review-event:|verification:[^ ]|contract:[^ ]|delivery-preparation#|evt_[0-9]/iu,
  );
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
      evidenceRefs: [
        "diff",
        "file:src/view.ts",
        "contract:criterion:0",
        "source-event:hidden",
        "unknown-alias",
      ],
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
  assert.ok(
    body.includes(
      `src/view.ts at ${head}; acceptance criterion 1; 2 references omitted`,
    ),
  );
  assert.doesNotMatch(body, /source-event:|unknown-alias|contract:criterion:/u);
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

await test("WO-227 target pull request: contract text naming launchpad vocabulary is a review item for the reviewer, never a refusal", () => {
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
  assert.equal(result.status, "review");
  assert.deepEqual(
    result.findings.map((finding) => [finding.rule, finding.term]),
    [
      ["vocabulary.review", "DotLn"],
      ["vocabulary.review", "launchpad"],
    ],
  );
});

await test("WO-227 criterion 6: a stored pull-request body opens with a level-one heading, carries prose before the meter block and ends with it; the published body admits the product-gate block", () => {
  const meter =
    "<!-- dotln-process-meter:start -->\n\nObservation cutoff: x.\n\n<!-- dotln-process-meter:end -->";
  const gate =
    "<!-- dotln-product-gate:start -->\n## Product gate\n\nPassed.\n<!-- dotln-product-gate:end -->";
  const good = `# WO-999\n\nThe change in one paragraph.\n\n${meter}\n`;
  assert.deepEqual(pullRequestBodyShapeFailures(good), []);
  assert.doesNotThrow(() => assertPullRequestBodyShape(good, "PR.md"));
  for (const block of [
    "<!-- reviewer placeholder -->",
    "<!--\nA hidden paragraph.\n-->",
    "```\n```",
    "~~~text\nCode is not a prose paragraph.\n~~~",
    "    An indented code block.",
    "---",
    "| Item | Value |\n| --- | --- |\n| One | Two |",
    "A setext heading\n================",
    "[reference]: https://example.invalid",
    "[^note]: An unreferenced footnote.",
    "<div>\nA raw HTML block.\n</div>",
    "![An image alone](https://example.invalid/image.png)",
  ])
    for (const ending of ["\n", "\r\n", "\r"]) {
      const body = `# Result\n\n${block}\n\n${meter}\n`.replaceAll(
        "\n",
        ending,
      );
      assert.deepEqual(
        pullRequestBodyShapeFailures(body).map((row) => row.rule),
        ["prose-before-meter"],
        JSON.stringify({ block, ending }),
      );
    }
  for (const prose of [
    "An ordinary paragraph.",
    "**Emphasis** and a [link](https://example.invalid) with `code`.",
    "- A list-item paragraph.",
    "> A quoted paragraph.",
    "<!-- A comment. -->\n\nVisible prose follows.",
  ])
    assert.deepEqual(
      pullRequestBodyShapeFailures(`# Result\n\n${prose}\n\n${meter}\n`),
      [],
      prose,
    );
  assert.deepEqual(
    pullRequestBodyShapeFailures(`Prose first.\n\n# WO-999\n\n${meter}\n`).map(
      (row) => row.rule,
    ),
    ["heading-first"],
  );
  assert.deepEqual(
    pullRequestBodyShapeFailures(`## WO-999\n\nProse.\n\n${meter}\n`).map(
      (row) => row.rule,
    ),
    ["heading-first"],
  );
  assert.deepEqual(
    pullRequestBodyShapeFailures(`\n\n# WO-999\n\nProse.\n\n${meter}\n`),
    [],
  );
  const meterFirst = `# WO-999\n\n${meter}\n\nThe prose came after the block.\n`;
  assert.deepEqual(
    pullRequestBodyShapeFailures(meterFirst).map((row) => row.rule),
    ["prose-before-meter", "meter-last"],
  );
  assert.throws(
    () => assertPullRequestBodyShape(meterFirst, "PR.md"),
    /^Error: PR\.md:3: pull-request body shape: a prose paragraph must stand between the heading and the process-meter block$/u,
  );
  const trailing = `# WO-999\n\nProse.\n\n${meter}\n\nA paragraph after the block.\n`;
  assert.deepEqual(
    pullRequestBodyShapeFailures(trailing).map((row) => [row.rule, row.line]),
    [["meter-last", 10]],
  );
  assert.throws(
    () => assertPullRequestBodyShape(trailing, "PR.md"),
    /PR\.md:10: pull-request body shape: the process-meter block must be the last block$/u,
  );
  const published = `# WO-999\n\nProse.\n\n${meter}\n\n${gate}\n`;
  assert.deepEqual(
    pullRequestBodyShapeFailures(published).map((row) => row.rule),
    ["meter-last"],
  );
  assert.deepEqual(
    pullRequestBodyShapeFailures(published, { published: true }),
    [],
  );
  assert.throws(
    () =>
      assertPullRequestBodyShape(`${published}\nMore.\n`, "PR.md", {
        published: true,
      }),
    /must be the last block, followed only by the product-gate block$/u,
  );
  // Without a meter block the shape is the heading alone.
  assert.deepEqual(pullRequestBodyShapeFailures("# WO-999\n\nProse.\n"), []);
  assert.deepEqual(pullRequestBodyShapeFailures("# WO-999\n"), []);
});

await test("WO-227 criterion 4: the composed target body names its parts and the Change rows by path, marking paths the base held and paths the kit's records wrote", () => {
  const files = [
    { path: "fixtures/launchpad-board.json", added: 12, deleted: 0 },
    { path: "docs/WO-006-notes.md", added: 3, deleted: 0 },
    { path: "src/mask.ts", added: 1, deleted: 1 },
    { path: "docs/work-orders/WO-999-fixture.md", added: 9, deleted: 0 },
  ];
  const composed = composeTargetBody({
    body: "## Draft\n\nPreserve the board.\n",
    baseCommit: base,
    headCommit: head,
    files,
    baseTree: new Set(["src/mask.ts"]),
    kitPaths: new Set(["docs/work-orders/WO-999-fixture.md"]),
    gate: "## Target checks\n\nReviewed commit: `x`.",
  });
  assert.equal(
    composed.text,
    `## Draft\n\nPreserve the board.\n\n${targetChangeSection({ baseCommit: base, headCommit: head, files })}\n\n## Target checks\n\nReviewed commit: \`x\`.\n`,
  );
  assert.deepEqual(
    composed.sections.map((section) => [
      section.name,
      composed.text.slice(section.start, section.end).split("\n")[0],
    ]),
    [
      ["reviewed prose", "## Draft"],
      ["Change table", "## Change"],
      ["Target checks", "## Target checks"],
    ],
  );
  assert.deepEqual(
    composed.rows.map((row) => [
      composed.text.slice(row.start, row.end),
      row.existed,
      row.kit,
    ]),
    [
      ["| fixtures/launchpad-board.json | 12 | 0 |", false, false],
      ["| docs/WO-006-notes.md | 3 | 0 |", false, false],
      ["| src/mask.ts | 1 | 1 |", true, false],
      ["| docs/work-orders/WO-999-fixture.md | 9 | 0 |", false, true],
    ],
  );
  // Each row's span is one table line of the Change part.
  for (const row of composed.rows) {
    assert.ok(row.start >= composed.sections[1].start);
    assert.ok(row.end <= composed.sections[1].end);
    assert.equal(composed.text[row.end], "\n");
    assert.equal(composed.text[row.start - 1], "\n");
  }
  // Without a gate section the body ends with the Change table.
  const draft = composeTargetBody({
    body: "## Draft\n",
    baseCommit: base,
    headCommit: head,
    files: files.slice(0, 1),
  });
  assert.equal(
    draft.text,
    `## Draft\n\n${targetChangeSection({ baseCommit: base, headCommit: head, files: files.slice(0, 1) })}\n`,
  );
  assert.deepEqual(
    draft.sections.map((section) => section.name),
    ["reviewed prose", "Change table"],
  );
  assert.equal(
    draft.text.slice(draft.rows[0].start, draft.rows[0].end),
    "| fixtures/launchpad-board.json | 12 | 0 |",
  );
});

await test("the described base adds activation context without changing table row offsets", () => {
  const input = {
    body: "## Result\n\nPreserve the board.\n",
    baseCommit: base,
    headCommit: head,
    files: [{ path: "board.txt", added: 1, deleted: 0 }],
  };
  const legacy = composeTargetBody(input);
  assert.deepEqual(
    composeTargetBody({ ...input, activationBase: base }),
    legacy,
  );
  const activationBase = "c".repeat(40);
  const advanced = composeTargetBody({ ...input, activationBase });
  assert.deepEqual(advanced.rows, legacy.rows);
  assert.equal(
    advanced.text,
    legacy.text.replace(
      /\.\n$/u,
      `; activated at base ${activationBase}, which ${base} descends from.\n`,
    ),
  );
});

await test("WO-227 criterion 6: the meter block moves after the last prose paragraph and changes no other byte", () => {
  const begin = "<!-- dotln-process-meter:start -->";
  const end = "<!-- dotln-process-meter:end -->";
  assert.equal(
    withMeterBlockLast(
      `# WO-999\n\n${begin}\n\nold table\n\n${end}\n\nFirst paragraph.\n\nSecond paragraph.\n`,
      "new table",
    ),
    `# WO-999\n\nFirst paragraph.\n\nSecond paragraph.\n\n${begin}\nnew table\n${end}\n`,
  );
  assert.equal(
    withMeterBlockLast(`# WO-999\n\nProse.\n`, "table"),
    `# WO-999\n\nProse.\n\n${begin}\ntable\n${end}\n`,
  );
  assert.equal(
    withMeterBlockLast(
      `# WO-999\n\nProse.\n\n${begin}\nold\n${end}\n`,
      "table",
    ),
    `# WO-999\n\nProse.\n\n${begin}\ntable\n${end}\n`,
  );
  // A prose line's trailing spaces are a Markdown hard break and stay.
  assert.equal(
    withMeterBlockLast(
      `# WO-999\n\n${begin}\n\nold\n\n${end}\n\nLine one  \nline two.  \n`,
      "table",
    ),
    `# WO-999\n\nLine one  \nline two.  \n\n${begin}\ntable\n${end}\n`,
  );
});

await test("WO-227 criterion 7: a link map writes a moved record's target path absolute to the target and every other relative link as its text", () => {
  const notes =
    "See [D001](../../evidence/WO-999/decisions.md#wo-999-d001), [the plan](../../planning/plan.md) and [the site](https://example.invalid/x).";
  const moved = new Map([
    [
      "docs/evidence/WO-999/decisions.md",
      "records/evidence/WO-999/decisions.md",
    ],
  ]);
  assert.equal(
    absoluteBodyLinks(notes, {
      from: "docs/final-reviews/WO-999/RELEASE-NOTES.md",
      repository: { selector: "github.com/dotln-fixture/target" },
      revision: "c".repeat(40),
      map: (path) => moved.get(path) ?? null,
    }),
    `See [D001](https://github.com/dotln-fixture/target/blob/${"c".repeat(40)}/records/evidence/WO-999/decisions.md#wo-999-d001), the plan and [the site](https://example.invalid/x).`,
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
