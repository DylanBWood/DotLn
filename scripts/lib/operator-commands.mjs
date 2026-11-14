// The operator's commands page: the command blocks of the operator's cycle,
// read from the kit guide's marked blocks in the cycle's order and written,
// with the one sentence each step carries, to a generated page beside the
// guide. Core regenerates and checks the page as one of its generated
// artifacts, reading the guide with the repository's pinned Markdown parser;
// every release ships the page, and `node scripts/launchpad.mjs commands`
// prints it in an instance before any install without importing this module.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { docRelative, findLaunchpad } from "./config.mjs";
import {
  htmlCommentText,
  markdownCodeBlocks,
  markdownHeadings,
  markdownMarkerBlocks,
  parseMarkdown,
} from "./markdown-links.mjs";
import { isMainModule } from "./paths.mjs";

/** The steps of the operator's cycle, in order, with the page's heading for
 * each. A marker names one of these ids, or `aside`. */
export const OPERATOR_STEPS = Object.freeze([
  ["new-instance", "A new instance"],
  ["first-pass", "The first planning pass"],
  ["run-order", "Running an order"],
  ["close-order", "Closing it"],
  ["take-release", "Taking a release"],
  ["register-repository", "Registering a repository"],
  ["tell-core", "Telling core"],
]);

// One HTML comment on the line directly above a fenced block, in the same
// container: the step it belongs to with the step's sentence on exactly one
// of its blocks, the step alone on any other, or `aside` (with an optional
// reason) for a block outside the cycle.
const MARKER =
  /^operator-commands (?<step>[a-z][a-z-]*)(?:: (?<sentence>.*?))?$/u;
// A fence with no language, or one a shell or a terminal session reads, may
// hold commands: each carries a marker, so no command block is left out of
// the page unseen. A language is read past the braces and the attributes
// some renderers write around it (`{.bash}`, `bash{1,2}`).
const SHELL = new Set([
  "",
  "sh",
  "bash",
  "shell",
  "zsh",
  "ksh",
  "fish",
  "console",
  "terminal",
  "sh-session",
  "shell-session",
  "shellsession",
  "shell-script",
  "powershell",
  "pwsh",
  "ps1",
  "bat",
  "cmd",
]);
const languageOf = (lang) =>
  /[a-z][a-z0-9-]*/u.exec((lang ?? "").toLowerCase())?.[0] ?? "";
// A comment that opens as a marker does and is none: a misspelled word, a
// step in another case, text after the step with no colon. Read as an
// ordinary comment it would drop its block from the page in silence.
const NEAR_MARKER = /^operator[-_ ]?commands?\b/iu;

const pagePath = (root) => docRelative(root, "docs", "OPERATOR.md");
const guidePath = (root) => docRelative(root, "docs", "KIT.md");

/** GitHub's heading anchor for the plain headings the kit guide uses. */
const anchor = (heading) =>
  heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/gu, "-");

/** Every fenced block of the guide, as the Markdown parser reads it in any
 * container (a list item or a block quote included), with its marker, the
 * second-level section it sits in and its content bytes, and every fault a
 * reader of the page would meet: an unmarked shell block, a marker that names
 * no step or stands over no block, a step without exactly one sentence or
 * without a block. Faults name the guide's line. */
export function readMarkedBlocks(text, path = "the kit guide") {
  const faults = [];
  const blocks = [];
  const known = new Set([...OPERATOR_STEPS.map(([id]) => id), "aside"]);
  const tree = parseMarkdown(text);
  const sections = markdownHeadings(text, tree)
    .filter((heading) => heading.depth === 2)
    .map(({ start, title }) => ({ offset: start, title }));
  // The fenced blocks, by where each starts; an indented block is not one.
  const fencedAt = new Map(
    markdownCodeBlocks(text, tree).map((block) => [block.start, block]),
  );
  const fenced = (node) =>
    node?.type === "code"
      ? fencedAt.get(node.position.start.offset)
      : undefined;
  const marker = (node) =>
    node?.type === "html"
      ? MARKER.exec(htmlCommentText(node.value) ?? "")?.groups
      : undefined;
  const visit = (node) => {
    const children = node.children ?? [];
    children.forEach((child, index) => {
      const mark = marker(child);
      if (
        !mark &&
        child.type === "html" &&
        NEAR_MARKER.test(htmlCommentText(child.value) ?? "")
      )
        faults.push(
          `${path}:${child.position.start.line}: a comment opens as an operator-commands marker and is not one the page reads; write <!-- operator-commands <step> -->, <!-- operator-commands <step>: <sentence> --> or <!-- operator-commands aside -->, the step in lower case`,
        );
      if (mark) {
        if (!known.has(mark.step))
          faults.push(
            `${path}:${child.position.start.line}: operator-commands marker names an unknown step "${mark.step}"; use one of ${[...known].join(", ")}`,
          );
        const next = children[index + 1];
        if (
          !next ||
          !fenced(next) ||
          next.position.start.line !== child.position.end.line + 1
        )
          faults.push(
            `${path}:${child.position.start.line}: operator-commands marker stands over no fenced block; put it on the line directly above the block's opening fence, in the same container`,
          );
      }
      if (fenced(child)) {
        const previous = children[index - 1];
        const own =
          previous?.position.end.line === child.position.start.line - 1
            ? marker(previous)
            : undefined;
        const { line, fence, info } = fenced(child);
        if (!own) {
          if (SHELL.has(languageOf(child.lang)))
            faults.push(
              `${path}:${line}: a fenced shell block carries no operator-commands marker; mark it with its step (<!-- operator-commands <step> -->) or set it aside (<!-- operator-commands aside -->)`,
            );
        } else if (own.step !== "aside" && known.has(own.step))
          blocks.push({
            step: own.step,
            sentence: own.sentence ?? null,
            section:
              sections.findLast(
                (section) => section.offset < child.position.start.offset,
              )?.title ?? null,
            line,
            info,
            fence,
            content: child.value === "" ? [] : child.value.split("\n"),
          });
      }
      visit(child);
    });
  };
  visit(tree);
  for (const [id] of OPERATOR_STEPS) {
    const own = blocks.filter((block) => block.step === id);
    const sentences = own.filter((block) => block.sentence !== null);
    if (!own.length)
      faults.push(
        `${path}: step ${id} marks no command block; mark the block an operator types for it`,
      );
    else if (sentences.length !== 1)
      faults.push(
        `${path}: step ${id} carries ${sentences.length} sentences (lines ${own.map((block) => block.line).join(", ")}); exactly one of its markers carries the step's sentence`,
      );
  }
  return { blocks, faults };
}

/** The version this source prepares, from the README's release block: the
 * kit's version at a release commit. */
export function kitVersion(root) {
  const readme = readFileSync(join(root, "README.md"), "utf8");
  // The release block holds one line, which names the version in code.
  const [block] = markdownMarkerBlocks(
    readme,
    "DOTLN-RELEASE-BEGIN",
    "DOTLN-RELEASE-END",
  );
  const claim =
    block && /^[^\n]*`(v\d+\.\d+\.\d+)`[^\n]*\n$/u.exec(block.inner);
  if (!claim)
    throw new Error(
      "README.md's release block names no version for the operator commands page",
    );
  return claim[1];
}

/** The page's bytes from the guide's text, or the guide's faults. */
export function renderOperatorPage(root, { guide, version } = {}) {
  const source = guidePath(root);
  guide ??= readFileSync(join(root, source), "utf8");
  const { blocks, faults } = readMarkedBlocks(guide, source);
  if (faults.length) return { faults };
  version ??= kitVersion(root);
  const lines = [
    "# Operator commands",
    "",
    `Generated from \`${source}\` by \`node scripts/lib/operator-commands.mjs\`; edit the kit guide's marked blocks, never this page.`,
    "",
    `The lines an operator types through the cycle of the DotLn kit at \`${version}\`, step by step: each step's sentence, then the command blocks [the kit guide](KIT.md) marks for it, byte for byte, in its order. \`node scripts/launchpad.mjs commands\` prints this page in an instance before any install. The kit guide's linked section says more about each block, and a release's Read before upgrading says what that release changed for an instance.`,
    "",
  ];
  OPERATOR_STEPS.forEach(([id, heading], index) => {
    const own = blocks.filter((block) => block.step === id);
    const sections = [
      ...new Set(own.map((block) => block.section).filter(Boolean)),
    ];
    lines.push(
      `## ${index + 1}. ${heading}`,
      "",
      own.find((block) => block.sentence !== null).sentence,
      "",
    );
    if (sections.length)
      lines.push(
        `In the kit guide: ${sections.map((section) => `[${section}](KIT.md#${anchor(section)})`).join(", ")}.`,
        "",
      );
    for (const block of own) {
      // The page's fence is longer than any run of its character a line of
      // the block opens with, so no line of the block can close it.
      const mark = block.fence[0];
      const longest = Math.max(
        block.fence.length - 1,
        ...block.content
          .map((line) => /^ {0,3}(`+|~+)/u.exec(line)?.[1])
          .map((run) => (run?.[0] === mark ? run.length : 0)),
      );
      const fence = mark.repeat(longest + 1);
      lines.push(`${fence}${block.info}`, ...block.content, fence, "");
    }
  });
  return { page: `${lines.join("\n").trimEnd()}\n` };
}

/** Write the page, or with `check` report whether the committed page is the
 * guide's rendering. A stale page prints the generated-artifact stale line,
 * which authorizes `npm run sync` to rewrite it; a fault in the guide is not
 * staleness and prints the guide's line instead. */
export function writeOperatorPage(root, { check = false } = {}) {
  const path = pagePath(root);
  const { page, faults } = renderOperatorPage(root);
  if (faults) return { exitCode: 1, output: faults.map((f) => `FAIL ${f}`) };
  const current = existsSync(join(root, path))
    ? readFileSync(join(root, path), "utf8")
    : null;
  if (current === page) return { exitCode: 0, output: [`${path} is current`] };
  if (check)
    return {
      exitCode: 1,
      output: [
        `stale ${path}: it differs from the kit guide's marked command blocks; run npm run sync or node scripts/lib/operator-commands.mjs`,
        "DOTLN_ARTIFACT_STALE operator-commands",
      ],
    };
  writeFileSync(join(root, path), page);
  return { exitCode: 0, output: [`Wrote ${path}`] };
}

if (isMainModule(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== "--check")) {
    console.error("usage: node scripts/lib/operator-commands.mjs [--check]");
    process.exitCode = 1;
  } else {
    try {
      const result = writeOperatorPage(findLaunchpad(), {
        check: args[0] === "--check",
      });
      for (const line of result.output)
        (result.exitCode ? console.error : console.log)(line);
      process.exitCode = result.exitCode;
    } catch (error) {
      console.error(`FAIL operator commands page: ${error.message}`);
      process.exitCode = 1;
    }
  }
}
