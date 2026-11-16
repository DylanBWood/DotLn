// The final review's own reading of the rewritten kit guide against its
// base, independent of the order's inventory script and read-only: it writes
// no file and prints one JSON object.
//
//   node docs/evidence/WO-281/final-001/guide-facts.mjs [--base <revision>]
//
// It reads docs/KIT.md at the base revision (the order's merge base where
// none is named) and in the working tree, through the repository's one
// Markdown parser, and reports two things.
//
// The inventory: every heading, code span, line of a fenced block and link
// target of the base, and which of them the candidate lacks. A code span and
// a block line of equal text answer for each other, and an item is compared
// with runs of white space read as one space.
//
// The alignment, which the inventory does not give: each sentence of the
// base's prose, and how many of its content words stand together in some run
// of up to eight adjacent blocks of the candidate (a paragraph, a heading, a
// table row or a fenced block each count as one). A sentence whose words are
// all found in one such run is counted whole. A sentence below that is
// listed with the words the best run lacks, for a reader to check by hand:
// the figure finds a dropped passage and proves no meaning.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  markdownLinks,
  markdownNodes,
  nodeSource,
  parseMarkdown,
} from "../../../../scripts/lib/markdown-links.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const GUIDE = "docs/KIT.md";
const WINDOW = 8;
const args = process.argv.slice(2);
const at = args.indexOf("--base");
const revision =
  at >= 0 ? args[at + 1] : "5edc7798b9eccaa880467d41a28b6a43f4b54226";
if (!revision || args.length > (at >= 0 ? 2 : 0))
  throw new Error("usage: guide-facts.mjs [--base <revision>]");

const base = execFileSync("git", ["show", `${revision}:${GUIDE}`], {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 16 * 1024 * 1024,
});
const candidate = readFileSync(resolve(root, GUIDE), "utf8");
const describe = (text) => ({
  lines: text.split("\n").length - 1,
  sha256: createHash("sha256").update(text).digest("hex"),
});
const oneSpace = (text) => text.replace(/\s+/gu, " ").trim();

// The four kinds of the order's first criterion.
const inventory = (text) => {
  const found = { heading: [], codeSpan: [], blockLine: [], linkTarget: [] };
  for (const node of markdownNodes(parseMarkdown(text))) {
    if (node.type === "heading")
      found.heading.push(
        `${"#".repeat(node.depth)} ${oneSpace(nodeSource(text, node).replace(/^#+/u, ""))}`,
      );
    else if (node.type === "inlineCode")
      found.codeSpan.push(oneSpace(node.value));
    else if (node.type === "code")
      found.blockLine.push(
        ...node.value.split("\n").map(oneSpace).filter(Boolean),
      );
  }
  found.linkTarget.push(...markdownLinks(text).map(({ href }) => href));
  return Object.fromEntries(
    Object.entries(found).map(([kind, items]) => [kind, new Set(items)]),
  );
};
const inBase = inventory(base);
const inCandidate = inventory(candidate);
const commands = new Set([...inCandidate.codeSpan, ...inCandidate.blockLine]);
const kinds = Object.fromEntries(
  Object.keys(inBase).map((kind) => {
    const held =
      kind === "codeSpan" || kind === "blockLine"
        ? commands
        : inCandidate[kind];
    return [
      kind,
      {
        base: inBase[kind].size,
        candidate: inCandidate[kind].size,
        absent: [...inBase[kind]].filter((item) => !held.has(item)),
      },
    ];
  }),
);

// The second-level headings other documents and the suites name, and the
// candidate's own links to its headings.
const secondLevel = (text) =>
  text.split("\n").filter((line) => line.startsWith("## "));
const slug = (heading) =>
  heading
    .replace(/^#+\s*/u, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s/gu, "-");
const slugs = [...inCandidate.heading].map(slug);
const ownLinks = [...inCandidate.linkTarget].filter((href) =>
  href.startsWith("#"),
);

// The alignment of the base's prose.
const STOP = new Set(
  "the a an of to in and or is are it its that which for on with as by at from be this these those then so not no never nor but if when where while who whom whose what how than into onto out up down over under one two each every any all both either neither other another same such only also still already even just more most less least very can may must should would will shall does do did has have had been being was were their they them there here he she his her we our you your i me my own per via".split(
    " ",
  ),
);
const stem = (word) => {
  if (/^\d/u.test(word)) return word;
  let stemmed = word;
  for (const suffix of ["ing", "ed", "es", "ly", "s"])
    if (stemmed.length > 4 && stemmed.endsWith(suffix)) {
      stemmed = stemmed.slice(0, -suffix.length);
      break;
    }
  return stemmed.length > 4 && stemmed.endsWith("e")
    ? stemmed.slice(0, -1)
    : stemmed;
};
// A link is read by its text, and a comment is left out.
const plain = (source) =>
  oneSpace(
    source
      .replace(/\[([^\]]*)\]\([^)]*\)/gu, "$1")
      .replace(/<!--[\s\S]*?-->/gu, " "),
  );
const contentWords = (text) =>
  plain(text)
    .toLowerCase()
    .split(/[^a-z0-9_./@#:-]+/u)
    .map((word) => word.replace(/^[.:/#-]+|[.:/#-]+$/gu, ""))
    .filter((word) => /[a-z0-9]/u.test(word) && !STOP.has(word))
    .map(stem);
const blocks = (text) => {
  const found = [];
  const visit = (node) => {
    if (node.type === "html") return;
    if (node.type === "code")
      found.push({
        line: node.position.start.line,
        kind: "code",
        text: node.value,
      });
    else if (["paragraph", "heading", "tableRow"].includes(node.type))
      found.push({
        line: node.position.start.line,
        kind: node.type,
        text: nodeSource(text, node),
      });
    else for (const child of node.children ?? []) visit(child);
  };
  visit(parseMarkdown(text));
  return found;
};
const candidateBlocks = blocks(candidate);
const candidateWords = candidateBlocks.map(
  (block) => new Set(contentWords(block.text)),
);
const everywhere = new Set(candidateWords.flatMap((words) => [...words]));
const sentences = blocks(base)
  .filter((block) => block.kind === "paragraph" || block.kind === "tableRow")
  .flatMap((block) =>
    plain(block.text)
      .split(/(?<=[.;!?])\s+(?=[A-Z`[(“"'*_])/u)
      .map((sentence) => ({
        baseLine: block.line,
        sentence,
        words: [...new Set(contentWords(sentence))],
      }))
      .filter(({ words }) => words.length >= 4),
  );
const aligned = sentences.map(({ baseLine, sentence, words }) => {
  let best = { score: -1 };
  for (let first = 0; first < candidateWords.length; first++) {
    const run = new Set();
    for (
      let size = 1;
      size <= WINDOW && first + size <= candidateWords.length;
      size++
    ) {
      for (const word of candidateWords[first + size - 1]) run.add(word);
      const score = words.filter((word) => run.has(word)).length / words.length;
      if (score > best.score + 1e-9)
        best = {
          score,
          candidateLine: candidateBlocks[first].line,
          blocks: size,
          lacking: words.filter((word) => !run.has(word)),
        };
    }
  }
  return {
    baseLine,
    candidateLine: best.candidateLine,
    blocks: best.blocks,
    score: Number(best.score.toFixed(2)),
    lacking: best.lacking,
    nowhere: words.filter((word) => !everywhere.has(word)),
    sentence,
  };
});
const histogram = {};
for (const { score } of aligned) {
  const band = (Math.floor(score * 10) / 10).toFixed(1);
  histogram[band] = (histogram[band] ?? 0) + 1;
}

process.stdout.write(
  `${JSON.stringify(
    {
      guide: GUIDE,
      base: { revision, ...describe(base) },
      candidate: describe(candidate),
      inventory: kinds,
      secondLevelHeadings: {
        base: secondLevel(base).length,
        candidate: secondLevel(candidate).length,
        sameTextAndOrder:
          JSON.stringify(secondLevel(base)) ===
          JSON.stringify(secondLevel(candidate)),
      },
      candidateLinksToItsHeadings: {
        distinct: ownLinks.length,
        unresolved: ownLinks.filter((href) => !slugs.includes(href.slice(1))),
        duplicateHeadingSlugs: slugs.length - new Set(slugs).size,
      },
      alignment: {
        window: WINDOW,
        sentences: aligned.length,
        whole: aligned.filter(({ score }) => score === 1).length,
        histogram,
        below080: aligned
          .filter(({ score }) => score < 0.8)
          .sort((left, right) => left.score - right.score),
      },
    },
    null,
    2,
  )}\n`,
);
