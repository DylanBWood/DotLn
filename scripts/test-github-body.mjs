import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  assertGitHubBodyProfile,
  githubBodyProfileFailures,
} from "./github-body.mjs";

const prettierConfig = JSON.parse(
  await readFile(new URL("../.prettierrc.json", import.meta.url), "utf8"),
);
assert.deepEqual(
  {
    printWidth: prettierConfig.printWidth,
    proseWrap: prettierConfig.proseWrap,
  },
  { printWidth: 80, proseWrap: "preserve" },
);

const longParagraph =
  "This ordinary paragraph is intentionally longer than eighty characters so the reader, not the source author, owns its viewport wrapping.";
const longListItem =
  "- This list-item paragraph is intentionally longer than eighty characters and remains one physical source line for responsive rendering.";

assert.equal(githubBodyProfileFailures(`${longParagraph}\n`).length, 0);
assert.equal(githubBodyProfileFailures(`${longListItem}\n`).length, 0);

assert.throws(
  () =>
    assertGitHubBodyProfile(
      "This paragraph was wrapped by an author at a fixed column, even though it is one logical\nparagraph and should be left for the reader to wrap.\n",
      "PR.md",
    ),
  /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
);
assert.throws(
  () =>
    assertGitHubBodyProfile(
      "- This list item was wrapped by an author at a fixed column, even though it is one logical\n  list-item paragraph and should be left for the reader to wrap.\n",
      "RELEASE-NOTES.md",
    ),
  /RELEASE-NOTES\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
);

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
assert.equal(githubBodyProfileFailures(structuralMarkdown).length, 0);

assert.throws(
  () =>
    assertGitHubBodyProfile(
      "- This list item starts on one line but its accidental continuation is hidden by indentation.\n    The continuation is still prose within the list item, not an indented code block.\n",
      "PR.md",
    ),
  /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
);
assert.throws(
  () =>
    assertGitHubBodyProfile(
      "An even pair of trailing backslashes ends in a literal backslash, not a Markdown hard break.\\\\\nThis adjacent line is therefore still a prose soft wrap.\n",
      "PR.md",
    ),
  /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
);
assert.throws(
  () =>
    assertGitHubBodyProfile(
      "This paragraph starts before a top-level pseudo-fence.\n    ```text\nThis is adjacent prose because a four-space fence cannot interrupt that paragraph.\n    ```\n",
      "PR.md",
    ),
  /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
);
assert.throws(
  () =>
    assertGitHubBodyProfile(
      "This paragraph was wrapped immediately before an autolink.\n<https://example.invalid/path>\n",
      "PR.md",
    ),
  /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
);
assert.throws(
  () =>
    assertGitHubBodyProfile(
      "> This quoted paragraph starts with an explicit quote marker.\nIts lazy continuation is still part of the quoted paragraph and must not hide a source wrap.\n",
      "RELEASE-NOTES.md",
    ),
  /RELEASE-NOTES\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
);
assert.throws(
  () =>
    assertGitHubBodyProfile(
      "A prose line may contain A | B without becoming a table.\nThis adjacent prose line must still be detected as a source wrap.\n",
      "PR.md",
    ),
  /PR\.md: accidental GitHub prose soft wrap between lines 1 and 2/,
);

console.log("GitHub body profile tests passed");
