// GitHub's own rendering as the oracle for the front-page guard. For every
// corpus row (the committed corpus plus any rows files named as arguments),
// build the fixture page the corpus fixture builds, ask the guard for its
// verdict on those bytes (the repository's formatter ignores Markdown, so they
// are what lands), and render the page
// through GitHub's Markdown API (README mode). From GitHub's HTML, count the
// headings whose letters and digits name "What runs today" and the sentences a
// reader sees in those sections, apart from the generated version line.
//
//   unsound      the guard admits a page on which GitHub shows a second
//                namesake heading or more sentences than counted lines
//   conservative the guard refuses a page on which GitHub shows one namesake
//                and only the counted sentences: a refusal by design or a
//                footgun, reviewed by hand
//
// Only synthetic fixture text is sent. Renders are cached by content hash in
// the directory named by DOTLN_GITHUB_ORACLE_CACHE (default: a temporary
// directory), so a rerun sends nothing already rendered.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { frontPageShapeFindings } from "../../../../scripts/docs-check.mjs";

const worktree = resolve(import.meta.dirname, "../../../..");
const corpusFiles = [
  join(worktree, "scripts/fixtures/front-page-corpus.json"),
  ...process.argv.slice(2).map((file) => resolve(file)),
];
const cache =
  process.env.DOTLN_GITHUB_ORACLE_CACHE ??
  join(tmpdir(), "dotln-wo189-github-oracle-cache");
mkdirSync(cache, { recursive: true });

// The page frontPageFixture builds in scripts/test-docs-check.mjs, with its
// three-line budget; the two forms must stay identical.
const lineBudget = 3;
const page = (sentences = ["The kernel replays.", "The skeleton runs."]) =>
  `# Page\n\n## What runs today\n\n<!-- DOTLN-RELEASE-BEGIN -->\nThis source prepares DotLn \`v0.1.0\`.\n<!-- DOTLN-RELEASE-END -->\n\n<!-- dotln-what-runs:start -->\n${sentences.map((line) => `${line}\n`).join("")}<!-- dotln-what-runs:end -->\n\n## Next\n\nA closing paragraph.\n`;
const twelve = Array.from(
  { length: 12 },
  (_, index) => `Extra capability ${index + 1} runs.`,
).join("\n");
const pageOf = (row) => {
  let text = page(row.line === undefined ? undefined : [row.line, "Two run."]);
  if (row.replace) text = text.replace(row.replace[0], () => row.replace[1]);
  if (row.section !== undefined) text += `\n${row.section}\n\n${twelve}\n`;
  if (row.append !== undefined) text += `\n${row.append}\n`;
  return text;
};

// GitHub limits how fast content is rendered, so uncached renders are spaced a
// second apart and a refusal for that limit is retried after a pause. With
// DOTLN_GITHUB_ORACLE_OFFLINE set, nothing is sent and only cached renders are
// read, so the guard's verdicts can be listed without the network.
const offline = Boolean(process.env.DOTLN_GITHUB_ORACLE_OFFLINE);
const pause = (ms) =>
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const render = (text) => {
  const key = createHash("sha256").update(text).digest("hex");
  const file = join(cache, `${key}.html`);
  if (existsSync(file)) return readFileSync(file, "utf8");
  if (offline) return null;
  const input = join(cache, `${key}.md`);
  writeFileSync(input, text);
  let result;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    pause(attempt ? 90000 : 1000);
    result = spawnSync(
      "gh",
      [
        "api",
        "--method",
        "POST",
        "/markdown/raw",
        "--input",
        input,
        "-H",
        "Content-Type: text/plain",
      ],
      { encoding: "utf8" },
    );
    if (result.status === 0 || !/rate limit/i.test(result.stderr)) break;
  }
  if (result.status !== 0) throw new Error(`gh api: ${result.stderr}`);
  writeFileSync(file, result.stdout);
  return result.stdout;
};

const decode = (html) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&#x([\da-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
const nameKey = (text) =>
  text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
// A reader's sentence count, taken two independent ways and the larger kept:
// Unicode's sentence segmentation, and terminal punctuation followed by space
// or the end of the text.
const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
const sentenceCount = (text) => {
  const plain = text.replace(/\s+/g, " ").trim();
  if (!plain) return 0;
  const segments = [...segmenter.segment(plain)].filter((part) =>
    /[\p{L}\p{N}]/u.test(part.segment),
  ).length;
  const terminals = (
    plain.match(
      /[\p{Sentence_Terminal}…][\p{Pe}\p{Pf}"']*(?=\s|$)|[。．！？｡](?=\p{L})/gu,
    ) ?? []
  ).length;
  return Math.max(segments, terminals);
};
// GitHub's view: the namesake headings and the sentences shown from each to
// the next heading of the same or a higher level.
function githubView(html) {
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];
  const namesakes = headings.filter(
    (match) => nameKey(decode(match[2])) === "whatrunstoday",
  );
  let sentences = 0;
  for (const heading of namesakes) {
    const from = heading.index + heading[0].length;
    const next = headings.find(
      (match) =>
        match.index > heading.index && Number(match[1]) <= Number(heading[1]),
    );
    const body = html
      .slice(from, next ? next.index : html.length)
      .replace(/<section data-footnotes[\s\S]*$/, "")
      .replace(/<p>This source prepares DotLn <code>[^<]*<\/code>\.<\/p>/, "")
      // Quoted code is not prose unless it holds a stop before a capital, as
      // the guard's stated rule reads it.
      .replace(/<code>([\s\S]*?)<\/code>/g, (_, inner) =>
        /[\p{Sentence_Terminal}…]\S*\s+\p{Lu}/u.test(decode(inner))
          ? inner
          : "code",
      );
    sentences += sentenceCount(decode(body));
  }
  return { namesakes: namesakes.length, sentences };
}

const control = {
  schemaVersion: 1,
  page: "README.md",
  generatedBlocks: [
    {
      start: "<!-- DOTLN-RELEASE-BEGIN -->",
      end: "<!-- DOTLN-RELEASE-END -->",
    },
  ],
  whatRunsToday: {
    start: "<!-- dotln-what-runs:start -->",
    end: "<!-- dotln-what-runs:end -->",
    lineBudget,
  },
};
const rows = corpusFiles.flatMap((file) =>
  JSON.parse(readFileSync(file, "utf8")).rows.map((row) => ({
    ...row,
    file: file.startsWith(worktree) ? file.slice(worktree.length + 1) : file,
  })),
);
const results = [];
for (const row of rows) {
  const text = pageOf(row);
  const failures = frontPageShapeFindings(text, control, "README.md").failures;
  const html = render(text);
  const view = html === null ? null : githubView(html);
  // The lines the page counts: the non-empty lines between the markers.
  const marked = text.split("\n");
  const counted = marked
    .slice(
      marked.indexOf(control.whatRunsToday.start) + 1,
      marked.indexOf(control.whatRunsToday.end),
    )
    .filter((line) => /[^ \t]/.test(line)).length;
  const verdict =
    view === null
      ? failures.length === 0
        ? "admit-unrendered"
        : "refuse-unrendered"
      : failures.length === 0
        ? view.namesakes !== 1 || view.sentences > counted
          ? "unsound"
          : "sound-admit"
        : view.namesakes === 1 && view.sentences <= counted
          ? "conservative"
          : "sound-refuse";
  results.push({
    name: row.name,
    file: row.file,
    source: row.source ?? null,
    expect: row.expect,
    verdict,
    github: view,
    guard: failures[0] ?? null,
    ...(verdict === "unsound" || verdict === "conservative" ? { html } : {}),
  });
}
const tally = Object.groupBy(results, (row) => row.verdict);
console.log(
  JSON.stringify(
    {
      cutoff: new Date().toISOString(),
      renderer: "GitHub REST POST /markdown/raw (README markdown mode)",
      counts: Object.fromEntries(
        Object.entries(tally).map(([key, list]) => [key, list.length]),
      ),
      unsound: (tally.unsound ?? []).map((row) => row.name),
      conservative: (tally.conservative ?? []).map((row) => row.name),
      // Rows whose stated expectation the guard does not meet, for triage.
      unmet: results
        .filter((row) => (row.expect === "admit") !== (row.guard === null))
        .map((row) => ({
          name: row.name,
          expect: row.expect,
          verdict: row.verdict,
          guard: row.guard,
        })),
      results,
    },
    null,
    2,
  ),
);
if (tally.unsound?.length) process.exitCode = 1;
