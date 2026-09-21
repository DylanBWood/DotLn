#!/usr/bin/env node
import { docRelative, findLaunchpad } from "./lib/config.mjs";
import { readFileSync, writeFileSync } from "node:fs";
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
export function inspectLedger(source) {
  const lines = source.split("\n");
  const sections = [];
  const errors = [];
  const counts = Object.fromEntries(statuses.map((status) => [status, 0]));
  let section;
  let fence;
  for (const [offset, line] of lines.entries()) {
    const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (fence) {
      if (
        marker?.[0] === fence[0] &&
        marker.length >= fence.length &&
        line.trim() === marker
      )
        fence = undefined;
      continue;
    }
    if (marker) {
      fence = marker;
      // Skipping an example must not join the text on either side into a lead.
      if (section) section.lines.push({ text: "", line: offset + 1 });
      continue;
    }
    if (line.startsWith("## ")) {
      section = {
        heading: line.slice(3),
        line: offset + 1,
        lines: [],
        entries: [],
        tags: 0,
      };
      sections.push(section);
    } else if (section) section.lines.push({ text: line, line: offset + 1 });
  }
  if (fence) errors.push("Unclosed code fence");
  if (!sections.length) errors.push("Ledger has no sections");
  const header = lines.slice(0, (sections[0]?.line ?? 1) - 1).join("\n");
  const declaration = /(?:^|\n)Statuses: ([\s\S]*?)(?:\n\n|$)/.exec(
    header,
  )?.[1];
  const declared = [...(declaration ?? "").matchAll(/`([^`]+)`/g)].map(
    (match) => match[1],
  );
  if (JSON.stringify(declared) !== JSON.stringify(statuses))
    errors.push(
      "Statuses declaration differs from the supported lifecycle set",
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
    let entry;
    for (const row of current.lines) {
      if (/^(?:[-*+]|\d+[.)]) /.test(row.text)) {
        entry = { line: row.line, text: row.text };
        current.entries.push(entry);
      } else if (
        /^ (?:[-*+]|\d+[.)]) /.test(row.text) ||
        (!entry && /^ {2,3}(?:[-*+]|\d+[.)]) /.test(row.text))
      ) {
        errors.push(
          `Line ${row.line}: top-level idea entries must start in column one`,
        );
      } else if (entry) entry.text += `\n${row.text}`;
    }
    for (const item of current.entries) {
      // Tags belong to the lead, never a nested bullet or incidental code span.
      const lead = item.text.split(/\n\s*\n|\n\s+[-*+] /)[0];
      const marker = /^(?:[-*+]|\d+[.)]) /.exec(lead)[0];
      const content = lead.slice(marker.length);
      const title = /^\*\*[\s\S]*?\*\*/.exec(content);
      const tail = title ? content.slice(title[0].length) : content;
      const tagRun = /^\s*((?:`[^`\n]+`\s*)+)/.exec(tail)?.[1] ?? "";
      const tags = [...tagRun.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
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

export function renderIndex(ledger) {
  const missing = ledger.sections.filter((section) => !section.tags);
  return [
    "# Lineage index",
    "",
    "Generated by `node scripts/lineage.mjs index`; check with `node scripts/lineage.mjs index --check` (also in `npm run test:docs`).",
    "",
    "[Idea ledger](idea-ledger.md) · [Resolutions of known tensions](resolutions.md#resolutions-of-known-tensions) · [Public influences](inspirations.md)",
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
  const rendered = renderIndex(ledger);
  if (args[1] === "--check") {
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
