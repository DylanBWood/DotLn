// The document gate's screen for hand-written Markdown and JSON readers. The
// repository reads Markdown through the pinned Prettier parser in
// markdown-links.mjs and JSON with JSON.parse; a source that matches Markdown
// syntax or JSON text with its own pattern is a second reader whose edge cases
// drift from the first. The screen parses the non-test sources in one batch
// with the repository's source reader (source-reading.mjs): regular
// expression literals and the calls and comparisons that test a string all
// come from one syntax tree a batch. It names
// those that read a fence, an ATX heading, a table row, a list item, a bold
// field label or JSON text.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  sourceDialect,
  sourceNodes,
  sourceSyntax as sourceAst,
  sourceTrees as readSources,
} from "../../packages/skeleton/src/source-reading.mjs";
import { runGitPathList } from "./git.mjs";
import { provenVendoredFile } from "./vendored-parser.mjs";

/** The two modules outside the screen: the parser module, which reads
 * Markdown for everyone, and this one, whose patterns describe readers. */
export const SCREEN_EXEMPT = Object.freeze([
  "scripts/lib/markdown-links.mjs",
  "scripts/lib/markdown-screen.mjs",
]);

/** Patterns that resemble Markdown syntax but read other text, each with
 * where it is and why. A line is admitted only by its exact file and pattern. */
export const NOT_MARKDOWN = Object.freeze([
  {
    file: "scripts/test-runner.mjs",
    pattern: "^\\s*# (?=PROGRESS )",
    reason:
      "a line of a test process's own output as node's TAP reporter quotes it, a comment of that format that opens with a number sign; the runner reads its progress marker from behind it",
  },
  {
    file: "scripts/lib/document-kinds.mjs",
    pattern: "^[a-z][a-z0-9+.-]*:|^\\/\\/|^#|^@",
    reason:
      "the kind of a link's destination, read from the destination's own text: a scheme, a protocol-relative address, a fragment's number sign or a mention, none of them a line of a document",
  },
  {
    file: "scripts/lib/review-worker.mjs",
    pattern:
      "^\\s*(?:>\\s*)*(?:[-*+]|\\(?\\d{1,3}(?:\\.\\d{1,3})*[.)]?|[a-z][.)])\\s+",
    reason:
      "an operator's captured message, plain text as it was typed: a point's own marker is set aside so that its words are found when a report quotes them without it",
  },
  {
    file: "scripts/lib/review-worker.mjs",
    pattern: "^\\s{0,3}(\\d{1,3})[.)]\\s",
    reason:
      "the numbers of the numbered points in an operator's captured message, plain text as it was typed, which a planning review's items table must answer",
  },
  {
    file: "packages/skeleton/src/feedback-audit.ts",
    pattern: "^# pass (\\d+)$",
    reason: "the node:test TAP summary's pass count, not a Markdown heading",
  },
  {
    file: "packages/skeleton/src/feedback-audit.ts",
    pattern: "^# fail (\\d+)$",
    reason: "the node:test TAP summary's fail count, not a Markdown heading",
  },
  {
    file: "packages/skeleton/src/feedback-audit.ts",
    pattern: "^# (?:pass|fail) ",
    reason: "the node:test TAP summary lines, not Markdown headings",
  },
  {
    file: "scripts/lib/plan-continuation.mjs",
    pattern: "**Cost:**",
    reason:
      "names the order that installed Cost declarations by the label its criterion quotes; it searches a criterion's text and reads no field",
  },
  {
    file: "scripts/lib/config.mjs",
    pattern: "**",
    reason:
      "a declared disposable path's any-depth wildcard, which stands only as a whole path segment, not bold text",
  },
  {
    file: "scripts/lib/target-worktree-close.mjs",
    pattern: "**",
    reason:
      "a declared disposable path's any-depth wildcard segment, matched against a listed path, not bold text",
  },
  {
    file: "packages/compiler/src/feedback.ts",
    pattern: "^\\*\\s*",
    reason:
      "a block comment's continuation-line asterisk in a comment body the TypeScript source reader extracted, not a Markdown list item",
  },
  {
    file: "scripts/lib/build-overlay.mjs",
    pattern: "<!--\\s*dotln-harness:(?:start|end)\\s*-->",
    reason:
      "a guard over an overlay's configuration strings: it refuses the harness block's marker bytes wherever they stand, a code span included, so no value can open or close the generated block; it reads no document",
  },
  {
    file: "scripts/lib/outward-lint.mjs",
    pattern: "<!---?>",
    reason:
      "HTML's empty comment inside raw HTML the Markdown parser returned, read by the lint's own HTML scanner to decide what a forge renders; it reads no marker",
  },
  {
    file: "scripts/lib/terms.mjs",
    pattern:
      "^[ \\t]*(?:(?:>+|#+|;+|%+|\\/{2,}|\\/\\*+|\\*+|-{2,}|<!--|[-*+])[ \\t]*)*",
    reason:
      "the marks that may open a line in any language (a quotation, a comment in several syntaxes, a list), stepped over so that a name wrapped across lines is read as one name; it reads no structure",
  },
  {
    file: "scripts/lib/harness.mjs",
    pattern: "# target-worker ",
    reason:
      "the comment line that opens this launchpad's block in a target's Git exclude file, a file of ignore patterns, not a Markdown heading",
  },
  {
    file: "scripts/lib/product-read-guard.mjs",
    pattern: "**",
    reason:
      "a file-system glob pattern's any-depth wildcard, which makes the observed read recursive, not bold text",
  },
]);

/** The single readers of chat messages, each the one reader of its message
 * protocol, running inside a hook where no parser can be reached: hooks run in
 * target bundles that carry no scripts tree, and the generated Codex hook
 * embeds its reader's own source. They read a message the operator or the
 * assistant wrote, never a repository document. */
export const CHAT_PROTOCOL_READERS = Object.freeze([
  {
    file: "packages/compiler/src/harness.ts",
    pattern: "^\\s*```[^`]*$",
    reason:
      "the operator prompt's one reader skips the paste fence a prompt may open with before its dispatch line; the generated Codex hook embeds this function's source, so it can call no parser",
  },
  {
    file: "packages/skeleton/src/observed-facts.ts",
    pattern: "^\\s*(`{3,}|~{3,})",
    reason:
      "the hedge scanner leaves fenced text out of an assistant's final chat message in the Stop hook, where no parser can be reached",
  },
]);

/** Readers that require a line or a marker a tool wrote, byte for byte, and
 * refuse anything else a document holds of it, each with where it is and
 * why its strictness is the contract. A test is admitted only by its exact
 * file and text. */
export const EXACT_LINE_READERS = Object.freeze([
  {
    file: "scripts/lib/plan-first.mjs",
    pattern: "<!-- dotln-plan-first-diff:start -->\n",
    reason:
      "a plan-first proposal's diff is the fenced block the shared reader finds with the tool's opening marker line standing exactly against its fence; anything else there and the proposal carries no diff",
  },
  {
    file: "scripts/lib/plan-first.mjs",
    pattern: "\n<!-- dotln-plan-first-diff:end -->\n",
    reason:
      "and the tool's closing marker line standing exactly after that fence",
  },
  {
    file: "scripts/lib/writing-worker-probe.mjs",
    pattern: "\u0000[\\s\\S]*?<!-- dotln-wo044-addendum:end -->",
    reason:
      "the probe replaces its own addendum in the environment record whole, between the two marker texts it wrote there",
  },
  {
    file: "scripts/probes/local-model-role-qualification.mjs",
    pattern: "\\*\\*Verdict: pass\\.\\*\\*",
    reason:
      "the probe requires the verdict line of a committed receipt exactly as that receipt's writer wrote it, as an excerpt it then hashes",
  },
  {
    file: "scripts/resume.mjs",
    pattern: "**Actor attestation:** \u0000",
    reason:
      "a report's first line is the actor header the completion command itself printed for the phase, compared whole before its JSON is parsed",
  },
  {
    file: "scripts/lib/harness-instruction.mjs",
    pattern: "<!-- dotln-harness:start -->",
    reason:
      "the generated harness block of an instruction file is replaced whole on every emit: its two marker texts must each stand exactly once, in order, anywhere in the file, a fenced copy included, or the emit refuses rather than choose a block",
  },
  {
    file: "scripts/lib/harness-instruction.mjs",
    pattern: "<!-- dotln-harness:end -->",
    reason: "the closing marker of the same block, counted the same way",
  },
  {
    file: "scripts/release.mjs",
    pattern: "<!-- DOTLN-RELEASE-BEGIN -->",
    reason:
      "the README's release block is one generated version line between two exact marker lines; the release check refuses any other line that names a marker, so no order can add a second block or a sentence to it",
  },
  {
    file: "scripts/release.mjs",
    pattern: "<!-- DOTLN-RELEASE-END -->",
    reason: "the closing marker line of the same block",
  },
  {
    file: "scripts/lib/release-preparation.mjs",
    pattern: "<!-- DOTLN-RELEASE-BEGIN -->",
    reason:
      "release preparation rewrites the same README block and locates it by the exact marker lines the release check requires",
  },
  {
    file: "scripts/lib/release-preparation.mjs",
    pattern: "<!-- DOTLN-RELEASE-END -->",
    reason: "the closing marker line of the same block",
  },
  {
    file: "scripts/lib/release-history.mjs",
    pattern: "<!-- \u0000:start -->",
    reason:
      "the roadmap's generated release table stands between one ordered pair of exact marker lines; the check refuses a lookalike marker line, so the exempt block cannot be opened twice or by a near-miss",
  },
  {
    file: "scripts/lib/release-history.mjs",
    pattern: "<!-- \u0000:end -->",
    reason: "the closing marker line of the same block",
  },
  {
    file: "scripts/lib/plan-first.mjs",
    pattern: "<!-- dotln-plan-first-diff:start -->",
    reason:
      "a plan-first proposal carries one diff between marker lines the tool wrote; the count of exact opening lines is compared with one before the diff is trusted, and Git's diff framing is read by line",
  },
  {
    file: "scripts/lib/worktree-integration.mjs",
    pattern: "<!-- integration \u0000 -->",
    reason:
      "the integration's own stub marker, which carries its checkpoint ref and which this function wrote into the order's decisions: its bytes anywhere in the file mean the stub is there, so a retry adds no second one",
  },
  {
    file: "scripts/resume.mjs",
    pattern: "**Actor attestation:**",
    reason:
      "a report's one machine-readable actor line, which the completing role writes byte for byte: the completion requires exactly one line with this opening and compares the whole line with the actor it attests",
  },
  {
    file: "scripts/lib/handoff-ledger.mjs",
    pattern:
      "^(?:(?:[-*+]|\\d{1,9}[.)])[ \\t]+)?self-review(?: \\([^()\\r\\n]{1,100}\\))?: found \\d+; fixed \\d+; recorded \\d+(?:; rounds \\d+(?: \\([^()\\r\\n]{1,200}\\))?)?(?:; unreviewed (?:0 lines?(?: \\([^()\\r\\n]{1,200}\\))?|\\d+ lines? \\([^()\\r\\n]{1,200}\\)))?(?![\\w;])",
    reason:
      "the handoff's self-review line is a fixed form the executor writes on one line, with or without a list marker before it; it is read a line of the file at a time by design, so that a copy in a fence is the line and an indented or quoted one is not, as the case table in scripts/test-verification-review.mjs holds for it and retained handoffs were written against",
  },
]);

// A source the product runs: a file under the scripts tree or under a
// package's source tree that the source reader parses (JavaScript or
// TypeScript, as a module, a CommonJS file or with JSX), never a test, a
// fixture or generated output. Where a file stands is this module's rule;
// whether it is source is the reader's, asked of the reader, so that no file
// it can read stands outside the screen whatever its name is.
const SOURCE_ROOT = /^(?:scripts|packages\/[^/]+\/src)\//u;
const isSource = (path) =>
  SOURCE_ROOT.test(path) && sourceDialect(path) !== null;
/** Checks whose task is to read a line as a renderer other than the parser
 * might: each looks for what the parser did not take as structure, so it
 * cannot ask the parser for it. A pattern is admitted only by its exact
 * file and text. */
export const SECOND_READINGS = Object.freeze([
  {
    file: "scripts/docs-check.mjs",
    pattern:
      "^[ \\t]*(?:(?:>|[-*+]|\\d{1,9}[.)]|\\[\\^[^\\]]+\\]:)[ \\t]*)*#{1,6}(?:[ \\t]|$)",
    reason:
      "the heading check looks for a line the parser did not read as a heading and another renderer may show as one: a number sign behind quotation, list or footnote markers",
  },
  {
    file: "scripts/docs-check.mjs",
    pattern:
      "^[ \\t]*(?:(?:>|[-*+]|\\d{1,9}[.)]|\\[\\^[^\\]]+\\]:)[ \\t]*)*(?:=+|-+)[ \\t]*$",
    reason:
      "and the line under it that would make it one, a row of equals signs or hyphens behind the same markers",
  },
]);

// Tests and fixtures are not the repository's readers: a suite file at the
// scripts root, a file named for a test (`*.test.*`) and what stands under
// a test or a fixtures directory. A module that only has a name opening
// with "test-" is a reader like any other: the runner at the scripts root,
// and the shard helper and the selection reader where they stand. The
// carried parser is left out where its bytes are proven, not by its path.
const TEST =
  /^scripts\/test-(?!runner\.mjs$)[^/]*$|(?:^|\/)[^/]*\.test\.[a-z]+$|^scripts\/fixtures\/|\/(?:test|fixtures)\//u;

// Inside a regular expression's source: a line start (an unescaped caret or
// a newline escape), any run of whitespace, group openers and quantifiers,
// then the syntax that opens a Markdown line. A caret that opens a class
// negates it and starts no line.
const LEAD =
  "(?:^|[^\\\\[])(?:\\^|\\\\n|\n)(?:\\(\\?:|\\(\\?=|\\(\\?<[A-Za-z]+>|\\(|\\)|\\|| |\\\\s|\\\\t|\\[[ \\\\t]+\\]|\\[\\\\t ?\\]|[*+?]|\\{\\d*,?\\d*\\})*";
// The whitespace a marker is followed by, as a pattern writes it.
const GAP = "(?: |\\\\s|\\[ \\\\t\\]|\\[\\\\t \\])";
// A newline escape, the indentation a pattern may write after it and the
// groups it may open there: where the line under another begins.
const UNDER =
  "\\\\n(?:\\(\\?:|\\(\\?<[A-Za-z]+>|\\(| |\\\\s|\\\\t|\\[[ \\\\t]+\\]|\\[\\\\t ?\\]|[*+?]|\\{\\d*,?\\d*\\})*";
/** A pattern's source with each bold marker written as a quantified
 * character, a class of one or a group of its own rewritten as the marker
 * itself, so that the forms below read one spelling of it. */
const plainMarkers = (pattern) =>
  pattern
    .replace(/\\\*\{2\}|\[\*\]\{2\}|\[\*\]\[\*\]/gu, "\\*\\*")
    .replace(/_\{2\}|\[_\]\{2\}|\[_\]\[_\]/gu, "__")
    .replace(/\((?:\?:)?(\\\*\\\*|__)\)/gu, "$1");
const REGEX_FORMS = [
  // Three of a fence's character, or a class that holds both characters.
  ["a fence", /```|`\{3|~~~|~\{3|\[(?:`~|~`)\]/u],
  ["a marker comment", /<!--/u],
  [
    "a heading",
    new RegExp(
      `${LEAD}(?:#(?:[ #{(+[*|]|\\\\s|\\\\t|\\)(?:[+*]|\\{))|\\[#\\])`,
      "u",
    ),
  ],
  // A heading written by the line under it: a run of equals signs at a
  // line's start, or a run of equals signs or of hyphens after a newline
  // escape and whatever indentation the pattern allows there, with the
  // quantifier that makes it a run; and the same run
  // written as a class of the two characters, which at a line's start
  // holds the equals sign, or as a repeated group of the two. A row of
  // hyphens alone at a line's start, literal or as a class, is left to its
  // other readings, a front matter's fence and a rule among them.
  [
    "a heading",
    new RegExp(
      `${LEAD}=(?:[+*={])|${UNDER}-(?:[+*]|\\{)|${LEAD}\\[(?:\\\\?-)*=(?:=|\\\\?-)*\\](?:[+*]|\\{)|${UNDER}\\[(?:=|\\\\?-)+\\](?:[+*]|\\{)|${UNDER}(?:=\\|-|-\\|=)\\)(?:[+*]|\\{)`,
      "u",
    ),
  ],
  ["a table row", new RegExp(`${LEAD}\\\\\\|`, "u")],
  [
    "a list item",
    // At a line's start, a bullet or a number and the space after it; or,
    // wherever it stands, the class of the three bullets, or a number, its
    // period or parenthesis and the space after: a marker's shape needs no
    // anchor to be a reading of one.
    new RegExp(
      `${LEAD}(?:-|\\\\\\*|\\\\\\+|\\\\d\\+\\\\\\.|\\[[-*+\\\\]+\\])${GAP}|\\[(?:-\\*\\+|-\\+\\*|\\*-\\+|\\*\\+-|\\+-\\*|\\+\\*-)\\]|\\\\d(?:\\+|\\{\\d*,?\\d*\\})\\)?(?:\\\\\\.|\\[\\.\\)\\]|\\[\\)\\.\\])\\)?${GAP}`,
      "u",
    ),
  ],
  // Two asterisks and not a third: three open another format's lines (a
  // patch envelope's `*** Begin Patch`). A label and its colon after them
  // read a field wherever the pattern stands.
  [
    "a bold field label",
    new RegExp(
      `${LEAD}\\\\\\*\\\\\\*(?!\\\\\\*)|\\\\\\*\\\\\\*(?!\\\\\\*)[\\p{L}][\\p{L} ()?.\\\\-]{0,40}:`,
      "u",
    ),
  ],
  // A bold field by its shape, wherever the pattern stands and however it
  // spells the label (a word, a class, a group of alternatives, a named
  // group): an opening marker of either kind, up to sixty characters with
  // no marker among them, a colon, and the closing marker, which a group
  // may open. Bold text and emphasis have no colon before their closing
  // marker, and a name that opens with two underscores has none at all.
  // The colon of a group's own opening is no label's. Two underscores alone
  // are left to the matched readings.
  [
    "a bold field label",
    /(?:\\\*\\\*(?!\\\*)|__(?!_))(?:(?!\\\*\\\*|__)[^\n]){1,60}?(?<!\(\?):(?:\((?:\?:)?)?(?:\\\*\\\*(?!\\\*)|__(?!_))/u,
  ],
  ["JSON text", /"\)?(?:\\s[*+?]?| )*:/u],
];
// A string a line is tested against or split by: the same openings, as
// literal text, at the string's start or after a line break inside it (a
// text split by "\n## " is read by its headings). A space or a tab follows
// a heading's marks and a list's marker, each of which may be indented, as
// a bold field's label and a table row may: every form here that is read at
// a line's start allows the spaces or tabs Markdown allows before it. An
// indented row is one only where a second pipe closes a cell, since " | "
// alone is a separator many formats share;
// a list's number ends in a period or a parenthesis. A bare "#" (a link fragment) is
// not a heading's opening. A
// table row's opening is a pipe and the space or the dash that follows it,
// or a delimiter row's dashes after a pipe; a pipe alone is left to the
// regular expressions, since as a string it is as often a shell pipe or a
// version range's "||" as a table's.
const STRING_FORMS = [
  ["a fence", /```|~~~/u],
  ["a marker comment", /<!--/u],
  ["a heading", /(?:^|[\r\n])[ \t]*#{1,6}[ \t]/u],
  // A row is a line that opens with a pipe: one whose pipe a space or a
  // hyphen follows; an indented one that a second pipe closes; one that
  // holds two cells, whatever its spacing, so a compact header counts,
  // closed or not; and a separator's dashes. What tells a compact row
  // from a pipe's other uses is the second cell: a third pipe closes it,
  // or text begins it after the second pipe, the first cell being text
  // too. That is where the form ends: a row written without its opening
  // pipe is not read, a pipe inside a line being too common in source to
  // mean a table, and neither is a compact row of one cell or a line that
  // opens with two pipes.
  [
    "a table row",
    /(?:^|[\r\n])\|[ -]|(?:^|[\r\n])[ \t]+\|[ -][^\r\n]*\||(?:^|[\r\n])[ \t]*\|[^|\r\n]*\|[^|\r\n]*\||(?:^|[\r\n])[ \t]*\|[^|\s][^|\r\n]*\|[ \t]*[^|\s]|\| ?:?-{3}/u,
  ],
  ["a list item", /(?:^|[\r\n])[ \t]*(?:[-*+]|\d+[.)])[ \t]/u],
  [
    "a bold field label",
    /(?:^|[\r\n])[ \t]*(?:\*\*(?!\*)|__[\p{L}][\p{L} ()?.-]{0,40}:__)/u,
  ],
  ["JSON text", /"[^"]*"\s*:/u],
];

const STRING_TESTS = new Set([
  "startsWith",
  "endsWith",
  "includes",
  "indexOf",
  "lastIndexOf",
  "split",
  "replace",
  "replaceAll",
]);
// Methods that read a string argument as a regular expression's source.
const PATTERN_TESTS = new Set(["match", "matchAll", "search"]);

const form = (forms, text) => forms.find(([, pattern]) => pattern.test(text));

/** What a regular expression reads, judged by what it matches and not by
 * how it is spelled: the forms above know a marker written plainly, and a
 * pattern may write the same marker as a class, a group, an alternation or
 * a lookahead. Each family holds lines of Markdown, and beside each line
 * the lines that differ from it only by lacking the syntax: the marks
 * replaced by letters, the space after them removed, the marks moved off
 * the line's start, a run cut short. A pattern reads the family when it
 * matches a line and none of that line's others, so one that matches by a
 * line break, a space or a letter the two share reads nothing. What this
 * cannot tell is a pattern loose enough to match one of the others as
 * well (a run of number signs with or without a space after it); the
 * spelled forms name those. A code span's and an emphasis's readers match
 * three backticks as a span, which is why a line with a span stands among
 * a fence's others. The matrix in scripts/test-docs-check.mjs crosses the
 * spellings of each family and holds the screen to all of them. */
export const MATCHED_READINGS = Object.freeze([
  [
    "a fence",
    [
      ["```js", ["abcjs", "`js", "``js", "js", "x `a` y"]],
      ["~~~", ["abc", "~", "~~", "", "x ~a~ y"]],
      ["   ```", ["   abc", "   ``", "   ", "   x `a` y"]],
      ["x\n```", ["x\nabc", "x\n``", "x\n", "x\nx `a` y"]],
    ],
  ],
  [
    "a marker comment",
    [
      [
        "<!-- name:start -->",
        [
          "<! name:start >",
          "<-- name:start -->",
          "!-- name:start -->",
          "ab-- name:start -->",
          "<!- name:start ->",
          " name:start ",
        ],
      ],
      [
        "x\n  <!-- x -->",
        [
          "x\n  <! x >",
          "x\n  <-- x -->",
          "x\n  !-- x -->",
          "x\n  <!- x ->",
          "x\n   x ",
        ],
      ],
    ],
  ],
  [
    "a heading",
    [
      ["## Title", ["Title", "ab Title", "##Title", "#tag", "a ## Title"]],
      [
        "x\n## Title",
        [
          "x\nTitle",
          "x\nab Title",
          "x\n##Title",
          "x\n#tag",
          "x\na ## Title",
          "x ## Title",
        ],
      ],
      [
        "   ## Title",
        ["   Title", "   ab Title", "   ##Title", "   #tag", "   a ## Title"],
      ],
      ["# T", ["T", "a T", "#T", "a # T"]],
    ],
  ],
  // A heading by the line under it. A row of hyphens alone is among the
  // others of a hyphen underline: a pattern that reads the row without the
  // text line above it reads a rule or a front matter's fence.
  [
    "a heading",
    [
      [
        "Title\n===",
        ["Title\nabc", "Title\n", "Title\na=b", "Title\n=x", "Title\na ==="],
      ],
      [
        "Title\n---",
        [
          "Title\nabc",
          "Title\n",
          "---",
          "Title\n-x",
          "Title\n- item",
          "Title\n--flag",
          "Title\na ---",
        ],
      ],
      [
        "Title\n  ---",
        [
          "Title\n  abc",
          "Title\n  ",
          "  ---",
          "Title\n  -x",
          "Title\n  - item",
          "Title\n  a ---",
        ],
      ],
      [
        "Title\n  ===",
        [
          "Title\n  abc",
          "Title\n  ",
          "Title\n  a=b",
          "Title\n  =x",
          "Title\n  a ===",
        ],
      ],
      ["===", ["abc", "", "a=b", "=x", "a ==="]],
    ],
  ],
  [
    "a table row",
    [
      ["| a | b |", ["a | b", "x| a | b |", "  a   b  "]],
      ["|a|b|", ["a|b", "xa|b|", "xaxbx"]],
      ["x\n| a | b |", ["x\na | b", "x\nx| a | b |", "x | a | b |"]],
      ["| --- | --- |", ["--- | ---", "x| --- | --- |"]],
      ["  | a | b |", ["  a | b", "  x| a | b |"]],
    ],
  ],
  [
    "a list item",
    [
      ["- item", ["item", "-item", "a item", "a - item", "-- item", "--item"]],
      ["* item", ["item", "*item", "a item", "a * item", "** item"]],
      ["+ item", ["item", "+item", "a item", "a + item", "++ item"]],
      [
        "1. item",
        [
          "item",
          "1.item",
          "1 item",
          "a. item",
          "a 1. item",
          "1, item",
          "1.. item",
        ],
      ],
      ["2) item", ["item", "2)item", "2 item", "a) item", "a 2) item"]],
      [
        "  - item",
        ["  item", "  -item", "  a item", "  a - item", "  -- item"],
      ],
      [
        "x\n- item",
        [
          "x\nitem",
          "x\n-item",
          "x\na item",
          "x - item",
          "x\na - item",
          "x\n-- item",
        ],
      ],
      [
        "x\n1. item",
        [
          "x\nitem",
          "x\n1.item",
          "x\n1 item",
          "x\na. item",
          "x 1. item",
          "x\na 1. item",
        ],
      ],
      [
        "- [ ] item",
        ["[ ] item", "-[ ] item", "a - [ ] item", "- item", "a [ ] item"],
      ],
    ],
  ],
  // Bold anywhere is no field's label: a line that holds bold text and a
  // colon elsewhere stands among the others.
  [
    "a bold field label",
    [
      ["**Class:** core", ["Class: core", "*Class:* core", "a **b** c: d"]],
      [
        "x\n**Base branch:** main",
        ["x\nBase branch: main", "x\n*Base branch:* main", "x\na **b** c: d"],
      ],
      [
        "  **Class:** core",
        ["  Class: core", "  *Class:* core", "  a **b** c: d"],
      ],
      // The same label written with underscores. A line that only opens
      // with two of them, as a name does, stands among the others.
      [
        "__Class:__ core",
        [
          "Class: core",
          "_Class:_ core",
          "a __b__ c: d",
          "__Class core",
          "__Class__: core",
        ],
      ],
      [
        "x\n__Base branch:__ main",
        [
          "x\nBase branch: main",
          "x\n_Base branch:_ main",
          "x\na __b__ c: d",
          "x\n__Base branch main",
          "x\n__Base branch__: main",
        ],
      ],
      [
        "  __Class:__ core",
        [
          "  Class: core",
          "  _Class:_ core",
          "  a __b__ c: d",
          "  __Class core",
          "  __Class__: core",
        ],
      ],
    ],
  ],
]);
const matchedReadings = new Map();
/** The form a pattern's source reads by matching, with the flags it was
 * written with where the source shows them (a search is stateless here, so
 * `g` and `y` are dropped); a source that does not compile with them is
 * tried as a Unicode pattern and then as a plain one, and one that never
 * compiles reads nothing here. */
function matchedForm(source, flags) {
  const key = `${flags}\u0000${source}`;
  if (matchedReadings.has(key)) return matchedReadings.get(key);
  let pattern;
  for (const use of [flags.replace(/[gy]/gu, ""), "u", ""]) {
    try {
      pattern = new RegExp(source, use);
      break;
    } catch {
      pattern = undefined;
    }
  }
  const found = pattern
    ? MATCHED_READINGS.find(([, pairs]) =>
        pairs.some(
          ([line, others]) =>
            pattern.test(line) && !others.some((other) => pattern.test(other)),
        ),
      )
    : undefined;
  matchedReadings.set(key, found);
  return found;
}

/** The text of a string or template literal, parentheses aside; a
 * template's text is cooked, as the program builds it, so `\\*` in a
 * template reads as the `\*` a pattern then sees, and each substitution
 * reads as one placeholder character, so `^#{2,3} ${title}` keeps its
 * opening. A name the source binds to such a literal reads as the literal:
 * a line compared with a constant is tested against the constant's text,
 * and a substitution that names a constant reads as that constant's text.
 * A `String.raw` template reads as its raw text, which is what a pattern
 * built from it sees: the source reader gives a template's cooked text
 * alone, so the raw text is the source between the template's marks. */
const literalText = (node, K, constants, file) => {
  while (node?.kind === K.ParenthesizedExpression) node = node.expression;
  if (node?.kind === K.Identifier && constants?.has(node.text))
    return constants.get(node.text);
  if (
    node?.kind === K.StringLiteral ||
    node?.kind === K.NoSubstitutionTemplateLiteral
  )
    return node.text;
  // A piece's raw text: the source inside its opening mark (a backquote or
  // a closing brace) and its closing one (a backquote, or a dollar sign and
  // an opening brace).
  const written = (piece, closing) =>
    file.text.slice(piece.getStart(file) + 1, piece.end - closing);
  const pieces = (template, raw) =>
    template.kind === K.NoSubstitutionTemplateLiteral
      ? raw
        ? written(template, 1)
        : template.text
      : [
          raw ? written(template.head, 2) : template.head.text,
          ...template.templateSpans.flatMap((span, index, spans) => [
            (span.expression.kind === K.Identifier &&
              constants?.get(span.expression.text)) ||
              "\u0000",
            raw
              ? written(span.literal, index === spans.length - 1 ? 1 : 2)
              : span.literal.text,
          ]),
        ].join("");
  if (node?.kind === K.TemplateExpression) return pieces(node, false);
  if (
    node?.kind === K.TaggedTemplateExpression &&
    node.tag.kind === K.PropertyAccessExpression &&
    node.tag.expression.kind === K.Identifier &&
    node.tag.expression.text === "String" &&
    node.tag.name.text === "raw" &&
    file
  )
    return pieces(node.template, true);
  return undefined;
};

/** Every regular expression and string test of one read source (see
 * source-reading.mjs) that reads Markdown syntax or JSON text, with its line;
 * a source the parser reports a syntax error in is named as unreadable. */
function screenRead(read) {
  const { path, file } = read;
  if (read.errors.length)
    return [
      {
        file: path,
        line: read.errors[0],
        form: "a source the parser cannot read",
        pattern: null,
      },
    ];
  const K = sourceAst().SyntaxKind;
  const findings = [];
  // A regular expression is asked twice: by how it is spelled, then by what
  // it matches.
  const report = (at, kind, pattern, flags = "u") => {
    const found =
      kind === "regex"
        ? (form(REGEX_FORMS, pattern) ??
          form(REGEX_FORMS, plainMarkers(pattern)) ??
          matchedForm(pattern, flags))
        : form(STRING_FORMS, pattern);
    if (!found) return;
    if (
      [
        ...NOT_MARKDOWN,
        ...CHAT_PROTOCOL_READERS,
        ...EXACT_LINE_READERS,
        ...SECOND_READINGS,
      ].some((row) => row.file === path && row.pattern === pattern)
    )
      return;
    findings.push({
      file: path,
      line: read.line(at.getStart(file)),
      form: found[0],
      pattern,
    });
  };
  const operators = new Set([
    K.EqualsEqualsEqualsToken,
    K.ExclamationEqualsEqualsToken,
    K.EqualsEqualsToken,
    K.ExclamationEqualsToken,
  ]);
  // The names the source binds to a string or a template by `const`: a test
  // against the name is a test against its text. A name the source declares
  // more than once, in any scope, is left unresolved, since the tree is read
  // here without its scopes.
  const constants = new Map();
  const declared = new Map();
  for (const node of sourceNodes(file)) {
    if (
      (node.kind === K.VariableDeclaration ||
        node.kind === K.Parameter ||
        node.kind === K.BindingElement) &&
      node.name?.kind === K.Identifier
    )
      declared.set(node.name.text, (declared.get(node.name.text) ?? 0) + 1);
    if (
      node.kind === K.VariableDeclaration &&
      node.name.kind === K.Identifier &&
      node.initializer &&
      node.parent?.kind === K.VariableDeclarationList &&
      node.parent.flags & sourceAst().NodeFlags.Const
    ) {
      // Constants are read in the source's order, so one built from an
      // earlier one reads whole.
      const text = literalText(node.initializer, K, constants, file);
      if (text !== undefined) constants.set(node.name.text, text);
    }
  }
  for (const [name, count] of declared) if (count > 1) constants.delete(name);
  for (const node of sourceNodes(file)) {
    // A literal is read where the tree places it: a scanner alone takes the
    // slash after a closing parenthesis for a division, so a pattern that
    // follows a condition would go unread.
    if (node.kind === K.RegularExpressionLiteral) {
      const written = file.text.slice(node.getStart(file), node.end);
      const close = written.lastIndexOf("/");
      report(node, "regex", written.slice(1, close), written.slice(close + 1));
    }
    if (
      (node.kind === K.NewExpression || node.kind === K.CallExpression) &&
      node.expression.kind === K.Identifier &&
      node.expression.text === "RegExp"
    ) {
      const pattern = literalText(node.arguments?.[0], K, constants, file);
      // Flags the source does not show as a literal are read as `u`.
      if (pattern !== undefined)
        report(
          node,
          "regex",
          pattern,
          literalText(node.arguments?.[1], K, constants, file) ?? "u",
        );
    }
    if (
      node.kind === K.CallExpression &&
      node.expression.kind === K.PropertyAccessExpression &&
      (STRING_TESTS.has(node.expression.name.text) ||
        PATTERN_TESTS.has(node.expression.name.text))
    ) {
      const value = literalText(node.arguments[0], K, constants, file);
      // A string handed to `match` or `search` is compiled without flags.
      if (value !== undefined)
        report(
          node,
          PATTERN_TESTS.has(node.expression.name.text) ? "regex" : "string",
          value,
          "",
        );
    }
    if (
      node.kind === K.BinaryExpression &&
      operators.has(node.operatorToken.kind)
    )
      for (const side of [node.left, node.right]) {
        const value = literalText(side, K, constants, file);
        if (value !== undefined) report(node, "string", value);
      }
  }
  return findings.sort((a, b) => a.line - b.line);
}

/** Every regular expression and string test of one source that reads
 * Markdown syntax or JSON text, with its line. */
export const screenSource = (path, text) =>
  screenRead(readSources([{ path, source: text }])[0]);

/** The sources the screen reads in a checkout: tracked and untracked,
 * non-ignored product sources that still exist. */
export function screenedSources(root) {
  return [
    ...new Set(
      runGitPathList(root, [
        "ls-files",
        "-z",
        "--cached",
        "--others",
        "--exclude-standard",
      ]),
    ),
  ]
    .filter(
      (path) =>
        isSource(path) &&
        !TEST.test(path) &&
        !SCREEN_EXEMPT.includes(path) &&
        !provenVendoredFile(root, path),
    )
    .sort();
}

/** Every finding in the checkout, and every source the parser refused. The
 * sources are parsed in one batch. */
export function markdownScreen(root, files = screenedSources(root)) {
  const inputs = [];
  for (const path of files) {
    try {
      inputs.push({ path, source: readFileSync(join(root, path), "utf8") });
    } catch (error) {
      // A source that cannot be opened is an error naming it, never a pass.
      if (error.code !== "ENOENT")
        throw new Error(
          `${path} cannot be read (${error.code ?? "unreadable"}); the pattern-reader screen reads every source under scripts/ and packages/*/src/`,
        );
    }
  }
  return readSources(inputs).flatMap((read, index) => {
    // A source the screen selects and the reader parses in no dialect is an
    // error naming it, never a source that passed unread.
    if (!read)
      throw new Error(
        `${inputs[index].path} is selected by the pattern-reader screen, and the source reader parses it in no dialect; the screen reads every source under scripts/ and packages/*/src/`,
      );
    return screenRead(read);
  });
}
