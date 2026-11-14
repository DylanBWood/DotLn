// Compare three comment checks over every code file the check reads and over
// the regression inputs: main's, the candidate VER-001 judged (the checkpoint
// taken at the repair's dispatch), and the repaired check in the working
// tree. Main's column is main's comment-check bytes at the order's base, its
// relative imports bound to today's scripts/lib, and the comment bodies it
// locates come from today's built feedback comment reader
// (packages/skeleton/dist/src/feedback-source-comments.js, which now calls the
// source reader's sourceTrees and treeTokens), as the verifier's reproducer
// also takes them: the column is main's line numbering, block grouping,
// shell and here-document rules and labels over today's tree reading of
// what a comment is, and it needs that build to be current. Usage:
//   node docs/evidence/WO-276/repair-001/comment-reader-comparison.mjs [out.json]
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  createScratchRoot,
  removeTemporaryPath,
} from "../../../../scripts/lib/temporary-roots.mjs";
import { feedbackSourcesComments } from "../../../../packages/skeleton/dist/src/feedback-source-comments.js";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const BASE = "0097fcac608bcaa24c51c8b6d6020fc2382ea141";
const JUDGED = "refs/dotln/checkpoint/WO-276/63";
const out = process.argv[2];
const scratch = createScratchRoot(join(tmpdir(), "dotln-wo276-repair-1-"));

/** A revision's comment check, its relative imports bound to today's tree. */
async function checkAt(revision, name) {
  let text = execFileSync(
    "git",
    ["show", `${revision}:scripts/lib/comment-labels.mjs`],
    { cwd: root, encoding: "utf8" },
  );
  text = text.replace(
    /from "(\.{1,2}\/[^"]+)"/gu,
    (_, specifier) =>
      `from ${JSON.stringify(pathToFileURL(resolve(root, "scripts/lib", specifier)).href)}`,
  );
  const path = join(scratch, `${name}.mjs`);
  writeFileSync(path, text);
  return import(pathToFileURL(path).href);
}

const key = (finding) =>
  `${finding.file ?? ""}:${finding.line}:${finding.kind}:${finding.fingerprint}`;

try {
  const main = await checkAt(BASE, "main");
  const judged = await checkAt(JUDGED, "judged");
  const repaired = await import(
    pathToFileURL(resolve(root, "scripts/lib/comment-labels.mjs")).href
  );
  const empty = { schemaVersion: 1, admitted: {}, lines: {} };

  // Every code file the repaired selector admits in today's tree.
  const files = repaired.commentFiles(root);
  const timed = (check) => {
    const started = performance.now();
    const result = check.checkCommentLabels(root, { baseline: empty, files });
    return {
      ms: Math.round(performance.now() - started),
      findings: result.findings.map(key).sort(),
    };
  };
  const repository = {
    main: timed(main),
    judged: timed(judged),
    repaired: timed(repaired),
  };

  // The regression inputs: the report's four, then the cases this repair
  // adds that the report did not quote.
  const extensions = [
    ".js",
    ".cjs",
    ".mjs",
    ".ts",
    ".cts",
    ".mts",
    ".jsx",
    ".tsx",
  ];
  const page = [
    "export const Page = () => (",
    "  <p>",
    "    // WO-998: text the page shows, not a comment",
    "    {/* WO-997: a comment inside the markup */}",
    "  </p>",
    ");",
  ].join("\n");
  const inputs = [
    [
      "report",
      "component.tsx",
      "// WO-999: renders a view\nexport const View = () => <div />;\n",
    ],
    [
      "report",
      "component.jsx",
      "// WO-999: renders a view\nexport const View = () => <div />;\n",
    ],
    [
      "report",
      "module.mjs",
      "// WO-999: exports a value\nexport const value = 1;\n",
    ],
    [
      "report",
      "matcher.mjs",
      'const ready = true; const text = "sample";\nif (ready) /[/*] D123/.test(text);\n',
    ],
    ...extensions.map((extension) => [
      "added",
      `view${extension}`,
      "// WO-999: renders a view\nexport const value = 1;\n",
    ]),
    ["added", "page.jsx", `${page}\n`],
    ["added", "page.tsx", `${page}\n`],
    [
      "added",
      "regex-after-block.mjs",
      [
        'const ready = true; const text = "sample";',
        "if (ready) /[/*] D123/.test(text);",
        "while (!ready) /[/*] VER-001 F1/.test(text);",
        "function after() {}",
        "/[/*] D124/.test(text);",
        "if (ready) /x/.test(text); // kept by D125, a real trailing comment",
        "export const done = after;",
        "/* WO-996: a real block comment after the regular expressions */",
      ].join("\n") + "\n",
    ],
    [
      "added",
      "matcher.sh",
      [
        "#!/bin/bash",
        "node - <<'JS'",
        'const text = "sample";',
        "if (text) /[/*] D126/.test(text);",
        "// D127 opens its line, a real comment",
        "JS",
      ].join("\n") + "\n",
    ],
    // The review's first finding: separators the compiler's line map counts
    // as line breaks and a line feed does not.
    [
      "review",
      "separators.mjs",
      [
        "// Explains why the value is fixed.",
        'const s = "a b"; // WO-123: a trailing comment after a line separator',
        "// D123 closes the block the two lines above open.",
        "const t = `a b`;",
        "// D124 after a paragraph separator in a template.",
        "const u = 1;\r// D125 after a lone carriage return.",
      ].join("\n") + "\n",
    ],
    [
      "review",
      "separators.sh",
      [
        "#!/bin/bash",
        "node - <<'JS'",
        'const s = "a b";',
        "// D126 a real comment after a line separator",
        "JS",
      ].join("\n") + "\n",
    ],
    // The review's second finding: here-documents in other languages, which
    // the judged candidate and the repair read as modules and main read for
    // lines that open with two slashes. Recorded as a known difference.
    [
      "review",
      "heredoc-css.sh",
      [
        "#!/bin/bash",
        "cat > page.css <<'CSS'",
        "/* D123 layout */",
        "p { margin: 0; }",
        "CSS",
      ].join("\n") + "\n",
    ],
    [
      "review",
      "heredoc-ignore.sh",
      [
        "#!/bin/bash",
        "cat > .gitignore <<'EOF'",
        "/*",
        "!/src",
        "see D123 for why",
        "EOF",
      ].join("\n") + "\n",
    ],
    [
      "review",
      "heredoc-markdown.sh",
      [
        "#!/bin/bash",
        "cat > notes.md <<'MD'",
        "# Notes",
        "```js",
        "// WO-123: example",
        "```",
        "MD",
      ].join("\n") + "\n",
    ],
  ].map(([source, path, text]) => ({ source, path, text }));

  // Each reader judges the inputs as files of a fixture repository too, so
  // the selector is exercised; Node confirms the module inputs are valid.
  const fixture = join(scratch, "fixture");
  mkdirSync(fixture);
  execFileSync("git", ["init", "-q", fixture]);
  writeFileSync(
    join(fixture, "dotln.config.json"),
    JSON.stringify({ version: 1, roots: {} }),
  );
  for (const input of inputs)
    writeFileSync(join(fixture, input.path), input.text);
  for (const path of ["matcher.mjs", "regex-after-block.mjs", "separators.mjs"])
    execFileSync(process.execPath, ["--check", join(fixture, path)]);
  const bodies = feedbackSourcesComments(
    inputs.map(({ path, text }) => ({ path, source: text })),
  );
  const rows = (findings) => findings.map((f) => [f.line, f.kind]);
  const perInput = inputs.map((input, index) => ({
    source: input.source,
    path: input.path,
    main: rows(
      main.commentLabelFindings(input.path, input.text, bodies[index]),
    ),
    judged: rows(judged.commentLabelFindings(input.path, input.text)),
    repaired: rows(repaired.commentLabelFindings(input.path, input.text)),
  }));
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const result = {
    schemaVersion: 1,
    what: "Comment findings of main's check, the candidate VER-001 judged and the repaired check, over every code file the check reads in this tree with an empty baseline and over the regression inputs; a finding is file, line, kind and the fingerprint of its line",
    base: BASE,
    judged: JUDGED,
    repository: {
      files: files.length,
      findings: {
        main: repository.main.findings.length,
        judged: repository.judged.findings.length,
        repaired: repository.repaired.findings.length,
      },
      repairedEqualsMain: same(
        repository.repaired.findings,
        repository.main.findings,
      ),
      repairedEqualsJudged: same(
        repository.repaired.findings,
        repository.judged.findings,
      ),
      ms: {
        main: repository.main.ms,
        judged: repository.judged.ms,
        repaired: repository.repaired.ms,
      },
    },
    inputs: perInput.map((row) => ({
      ...row,
      repairedEqualsMain: same(row.repaired, row.main),
      judgedEqualsMain: same(row.judged, row.main),
    })),
  };
  const text = JSON.stringify(result, null, 2) + "\n";
  if (out) writeFileSync(out, text);
  else process.stdout.write(text);
} finally {
  removeTemporaryPath(scratch, { recursive: true, force: true });
}
