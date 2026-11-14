#!/usr/bin/env node
import { docRelative, findLaunchpad } from "./lib/config.mjs";
import {
  inlineSource,
  markdownCodeBlocks,
  markdownListItems,
  markdownNodes,
  markdownSections,
  parseMarkdown,
} from "./lib/markdown-links.mjs";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const statuses = [
  "adopted",
  "preserved",
  "raw",
  "superseded",
  "transformed",
  "rejected",
  "deferred",
  "candidate",
  "open",
  "specified",
];
const provenance = [
  "recovered",
  "north-star",
  "tension",
  "operator-directed",
  "operator-authorized",
];
/** The ledger's sections: each level-2 heading with the body under it. The
 * plan's readers find a planning pass among these same sections. */
export const ledgerSections = (source, tree = parseMarkdown(source)) =>
  markdownSections(source, tree).filter((section) => section.depth === 2);

export function inspectLedger(source) {
  // The pinned parser reads the ledger, so a quoted example inside a code
  // block is never a heading, an entry or a tag.
  const tree = parseMarkdown(source);
  const errors = [];
  const counts = Object.fromEntries(statuses.map((status) => [status, 0]));
  const sections = ledgerSections(source, tree).map((section) => ({
    heading: section.title,
    line: section.line,
    start: section.start,
    end: section.bodyEnd,
    entries: [],
    tags: 0,
  }));
  if (markdownCodeBlocks(source, tree).some((block) => !block.closed))
    errors.push("Unclosed code fence");
  // The header is everything above the first section; its Statuses
  // paragraph declares the lifecycle set in code spans.
  const declaration = tree.children.find(
    (node) =>
      node.type === "paragraph" &&
      node.position.start.offset < (sections[0]?.start ?? source.length) &&
      inlineSource(source, node).startsWith("Statuses: "),
  );
  const declared = declaration
    ? [...markdownNodes(declaration)]
        .filter((node) => node.type === "inlineCode")
        .map((node) => node.value)
    : [];
  if (JSON.stringify(declared) !== JSON.stringify(statuses))
    errors.push(
      "Statuses declaration differs from the supported lifecycle set",
    );

  const entries = markdownListItems(source, tree);
  const atMargin = (item) =>
    item.start === 0 || source[item.start - 1] === "\n";
  // The inline content of each item's first paragraph, by the item's offset.
  const leads = new Map(
    [...markdownNodes(tree)]
      .filter((node) => node.type === "listItem")
      .map((node) => [
        node.position.start.offset,
        node.children[0]?.type === "paragraph" ? node.children[0].children : [],
      ]),
  );
  let previousDate = "9999-99-99";
  let founding = false;
  let previousChat = 12;
  for (const current of sections) {
    const { heading, line } = current;
    const date = /\b\d{4}-\d{2}-\d{2}\b/.exec(heading)?.[0];
    const chat = /^Chat (\d{3})$/.exec(heading);
    const reference = heading === "Images (reference corpus)";
    current.reference = reference;
    if (heading === "Resolutions of known tensions") {
      errors.push(
        `Line ${line}: Resolutions belongs in resolutions.md; no sections may remain below its old boundary`,
      );
    } else if (reference) {
      if (founding) errors.push(`Line ${line}: duplicate founding boundary`);
      founding = true;
    } else if (chat) {
      const number = Number(chat[1]);
      if (!founding || number !== previousChat - 1 || number < 1)
        errors.push(
          `Line ${line}: founding chats must follow Images in descending order`,
        );
      previousChat = number;
    } else if (founding) {
      errors.push(`Line ${line}: section below the founding corpus boundary`);
    } else if (
      !date ||
      !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) ||
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
    ) {
      errors.push(`Line ${line}: section needs a valid YYYY-MM-DD date`);
    } else {
      if (date > previousDate)
        errors.push(`Line ${line}: section is out of newest-first date order`);
      previousDate = date;
    }

    // Images is a source inventory, not a list of lifecycle-bearing ideas.
    if (reference) continue;
    // Each item of the section's top-level lists is an idea entry, and it
    // starts in column one: an indented one is not nested under an entry.
    const items = entries.filter(
      (item) => item.start > current.start && item.start < current.end,
    );
    for (const item of items)
      if (!atMargin(item))
        errors.push(
          `Line ${item.line}: top-level idea entries must start in column one`,
        );
    current.entries = items.filter(atMargin);
    for (const item of current.entries) {
      // Tags belong to the lead, never a nested bullet or incidental code
      // span: the code spans that open the entry's first paragraph, after its
      // bold title when it has one.
      const inline = leads.get(item.start) ?? [];
      const tags = [];
      for (const node of inline[0]?.type === "strong"
        ? inline.slice(1)
        : inline) {
        if (node.type === "inlineCode") tags.push(node.value);
        else if (
          node.type !== "break" &&
          (node.type !== "text" || node.value.trim())
        )
          break;
      }
      const lifecycle = tags.filter((tag) => statuses.includes(tag));
      if (!lifecycle.length)
        errors.push(
          `Line ${item.line}: unlabeled entry (lifecycle tag required in lead)`,
        );
      for (const tag of tags) {
        if (!statuses.includes(tag) && !provenance.includes(tag))
          errors.push(
            `Line ${item.line}: unknown status or provenance tag ${tag}`,
          );
      }
      if (new Set(tags).size !== tags.length)
        errors.push(`Line ${item.line}: duplicate entry tag`);
      for (const tag of lifecycle) counts[tag]++;
      current.tags += lifecycle.length;
    }
  }
  return { sections, counts, errors };
}

const link = (section) =>
  `[${section.heading.replaceAll("|", "\\|").replaceAll("[", "\\[").replaceAll("]", "\\]")}](idea-ledger.md?plain=1#L${section.line})`;

export function renderIndex(
  ledger,
  { resolutions = true, inspirations = true } = {},
) {
  const missing = ledger.sections.filter((section) => !section.tags);
  return [
    "# Lineage index",
    "",
    "Generated by `node scripts/lineage.mjs index`; check with `node scripts/lineage.mjs index --check` (also in `npm run test:docs`).",
    "",
    [
      "[Idea ledger](idea-ledger.md)",
      ...(resolutions
        ? [
            "[Resolutions of known tensions](resolutions.md#resolutions-of-known-tensions)",
          ]
        : []),
      ...(inspirations ? ["[Public influences](inspirations.md)"] : []),
    ].join(" · "),
    "",
    "Insert dated sessions immediately below the ledger header, newest first. Preserve existing same-day order and entry order. The founding Images/Chat corpus stays last; Resolutions has its own surface.",
    "",
    `Sections: ${ledger.sections.length}. Idea entries: ${ledger.sections.reduce((sum, section) => sum + section.entries.length, 0)}. Counts are lifecycle-tag memberships in entry leads; an entry can carry more than one lifecycle tag. Images is a reference inventory and is not counted as idea entries.`,
    "",
    "| Status | Count |",
    "| --- | ---: |",
    ...statuses.map((status) => `| \`${status}\` | ${ledger.counts[status]} |`),
    "",
    "## Sections lacking a lifecycle tag",
    "",
    ...(missing.length
      ? missing.map(
          (section) =>
            `- ${link(section)} — ${section.reference ? "reference inventory" : "prose-only section; no idea entries"}.`,
        )
      : ["None."]),
    "",
    "## Section locations",
    "",
    "| Section | Line | Idea entries | Lifecycle tags |",
    "| --- | ---: | ---: | ---: |",
    ...ledger.sections.map(
      (section) =>
        `| ${link(section)} | ${section.line} | ${section.entries.length} | ${section.tags} |`,
    ),
    "",
  ].join("\n");
}

export function main(args = process.argv.slice(2), root = findLaunchpad()) {
  if (
    args[0] !== "index" ||
    args.length > 2 ||
    (args[1] && args[1] !== "--check")
  )
    throw new Error("usage: lineage index [--check]");
  const ledgerPath = docRelative(root, "lineage", "idea-ledger.md");
  const indexPath = docRelative(root, "lineage", "README.md");
  const ledger = inspectLedger(readFileSync(resolve(root, ledgerPath), "utf8"));
  if (ledger.errors.length) throw new Error(ledger.errors.join("\n"));
  const rendered = renderIndex(ledger, {
    resolutions: existsSync(
      resolve(root, docRelative(root, "lineage", "resolutions.md")),
    ),
    inspirations: existsSync(
      resolve(root, docRelative(root, "lineage", "inspirations.md")),
    ),
  });
  if (args[1] === "--check") {
    // An absent index means its generating command has not run here, as in
    // an older export: name the file by its repository-relative path and the
    // command that writes it.
    if (!existsSync(resolve(root, indexPath)))
      throw new Error(
        `Missing ${indexPath}; run node scripts/lineage.mjs index`,
      );
    if (readFileSync(resolve(root, indexPath), "utf8") !== rendered)
      throw new Error(`Stale ${indexPath}; run node scripts/lineage.mjs index`);
    console.log(`PASS lineage index: ${ledger.sections.length} sections`);
  } else {
    writeFileSync(resolve(root, indexPath), rendered);
    console.log(`Generated ${indexPath}`);
  }
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
