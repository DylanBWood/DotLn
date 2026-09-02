#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productDirectory = path.join(root, "docs/product");
const indexPath = path.join(root, "docs/publication/audience-status-index.md");
const baseOutlinePath = path.join(root, "docs/publication/base-outline.md");
const dualVoicePath = path.join(root, "docs/publication/dual-voice-sample.md");
const editionPaths = [
  path.join(root, "docs/publication/everyday-ai-user-toc.md"),
  path.join(root, "docs/publication/software-engineer-toc.md"),
];
const statuses = new Set([
  "vision",
  "specified",
  "planned",
  "implemented",
  "verified",
  "blocked",
  "deprecated",
]);
const audiences = new Set(["everyday-ai-user", "software-engineer"]);
const editionAudiences = new Map([
  ["everyday-ai-user-toc.md", "everyday-ai-user"],
  ["software-engineer-toc.md", "software-engineer"],
]);

const args = process.argv.slice(2);
const expectStale = args.includes("--expect-stale");
const printLocks = args.includes("--print-locks");
const knownArgs = new Set(["--expect-stale", "--print-locks"]);
const unknownArgs = args.filter((arg) => !knownArgs.has(arg));
if (unknownArgs.length > 0) {
  console.error(`Unknown argument(s): ${unknownArgs.join(", ")}`);
  process.exit(2);
}
if (expectStale && printLocks) {
  console.error("--expect-stale and --print-locks cannot be combined");
  process.exit(2);
}

function relative(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function findBalancedEnd(value, start, open, close) {
  let depth = 0;
  for (let index = start; index < value.length; index += 1) {
    if (value[index] === "\\") {
      index += 1;
      continue;
    }
    if (value[index] === open) depth += 1;
    if (value[index] === close) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function inlineText(value) {
  let result = "";
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (
      character === "\\" &&
      /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(value[index + 1] ?? "")
    ) {
      result += value[index + 1];
      index += 1;
      continue;
    }

    if (character === "`") {
      const marker = value.slice(index).match(/^`+/)?.[0] ?? "`";
      const end = value.indexOf(marker, index + marker.length);
      if (end !== -1) {
        let code = value
          .slice(index + marker.length, end)
          .replace(/[\t\r\n ]+/g, " ");
        if (/^ .* $/.test(code) && !/^ +$/.test(code)) code = code.slice(1, -1);
        result += code;
        index = end + marker.length - 1;
        continue;
      }
    }

    const image = character === "!" && value[index + 1] === "[";
    const bracketStart = image ? index + 1 : index;
    if (value[bracketStart] === "[") {
      const bracketEnd = findBalancedEnd(value, bracketStart, "[", "]");
      if (bracketEnd !== -1) {
        result += inlineText(value.slice(bracketStart + 1, bracketEnd));
        let consumed = bracketEnd;
        if (value[bracketEnd + 1] === "(") {
          const destinationEnd = findBalancedEnd(
            value,
            bracketEnd + 1,
            "(",
            ")",
          );
          if (destinationEnd !== -1) consumed = destinationEnd;
        } else if (value[bracketEnd + 1] === "[") {
          const referenceEnd = findBalancedEnd(value, bracketEnd + 1, "[", "]");
          if (referenceEnd !== -1) consumed = referenceEnd;
        }
        index = consumed;
        continue;
      }
    }

    if (character === "<") {
      const end = value.indexOf(">", index + 1);
      if (end !== -1) {
        const contents = value.slice(index + 1, end);
        if (/^(?:https?:\/\/|mailto:)/i.test(contents)) {
          result += contents.replace(/^mailto:/i, "");
          index = end;
          continue;
        }
        if (/^\/?[A-Za-z][^>]*$/.test(contents)) {
          index = end;
          continue;
        }
      }
    }

    result += character;
  }
  return result;
}

function stripInlineMarkdown(value) {
  let result = inlineText(value).replace(/[~*]/g, "");
  let previous;
  do {
    previous = result;
    result = result
      .replace(
        /(^|[^\p{L}\p{N}])__(?=\S)([\s\S]*?\S)__(?=$|[^\p{L}\p{N}])/gu,
        "$1$2",
      )
      .replace(
        /(^|[^\p{L}\p{N}])_(?=\S)([\s\S]*?\S)_(?=$|[^\p{L}\p{N}])/gu,
        "$1$2",
      );
  } while (result !== previous);
  return result.trim();
}

function comparableLabel(value) {
  return stripInlineMarkdown(value).replace(/\s+/g, " ");
}

function slugBase(value) {
  return stripInlineMarkdown(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\p{Pc} -]/gu, "")
    .trim()
    .replace(/ /g, "-");
}

function fenceOpener(line) {
  const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
  if (!match || (match[1][0] === "`" && match[2].includes("`"))) return null;
  return { character: match[1][0], length: match[1].length };
}

function closesFence(line, fence) {
  const match = line.match(/^ {0,3}(`+|~+)[ \t]*$/);
  return (
    match !== null &&
    match[1][0] === fence.character &&
    match[1].length >= fence.length
  );
}

function headings(markdown) {
  const matches = [];
  const seen = new Set();
  const lines = markdown.match(/.*(?:\n|$)/g) ?? [];
  let offset = 0;
  let fence = null;

  for (const lineWithEnding of lines) {
    const line = lineWithEnding.replace(/\r?\n$/, "");
    if (fence !== null) {
      if (closesFence(line, fence)) fence = null;
      offset += lineWithEnding.length;
      continue;
    }

    const opener = fenceOpener(line);
    if (opener !== null) {
      fence = opener;
      offset += lineWithEnding.length;
      continue;
    }

    const match = line.match(/^ {0,3}(#{1,6})(?:[ \t]+(.*)|[ \t]*)$/);
    if (match) {
      const raw = (match[2] ?? "").replace(/[ \t]+#+[ \t]*$/, "").trimEnd();
      const base = slugBase(raw);
      let anchor = base;
      let suffix = 1;
      while (seen.has(anchor)) {
        anchor = `${base}-${suffix}`;
        suffix += 1;
      }
      seen.add(anchor);
      matches.push({
        anchor,
        level: match[1].length,
        raw,
        start: offset,
      });
    }
    offset += lineWithEnding.length;
  }

  return matches.map((heading, index) => {
    let end = markdown.length;
    for (let next = index + 1; next < matches.length; next += 1) {
      if (matches[next].level <= heading.level) {
        end = matches[next].start;
        break;
      }
    }
    return { ...heading, text: markdown.slice(heading.start, end).trimEnd() };
  });
}

function productFiles() {
  return readdirSync(productDirectory)
    .filter((name) => /^\d{2}-.+\.md$/.test(name))
    .sort();
}

function checkCoverage(failures) {
  const expected = new Map();
  for (const file of productFiles()) {
    const markdown = readFileSync(path.join(productDirectory, file), "utf8");
    for (const heading of headings(markdown)) {
      expected.set(`${file}#${heading.anchor}`, heading.raw);
    }
  }

  const index = readFileSync(indexPath, "utf8");
  const entries = new Map();
  const duplicateKeys = [];
  const rowPattern =
    /^\|\s+\[([^\]]+)\]\(\.\.\/product\/([^#)]+)#([^)]+)\)\s+\|\s+([^|]+?)\s+\|\s+([^|]+?)\s+\|$/gm;
  let row;
  while ((row = rowPattern.exec(index)) !== null) {
    const [, label, file, anchor, audienceCell, status] = row;
    const key = `${file}#${anchor}`;
    const audienceValues = audienceCell.split(",").map((value) => value.trim());
    if (entries.has(key)) duplicateKeys.push(key);
    entries.set(key, { audienceValues, label, status: status.trim() });
  }

  const missing = [...expected.keys()].filter((key) => !entries.has(key));
  const extra = [...entries.keys()].filter((key) => !expected.has(key));
  const invalid = [];
  for (const [key, entry] of entries) {
    const uniqueAudienceValues = new Set(entry.audienceValues);
    if (
      entry.audienceValues.length === 0 ||
      entry.audienceValues.some((value) => !audiences.has(value)) ||
      uniqueAudienceValues.size !== entry.audienceValues.length
    ) {
      invalid.push(`${key}: invalid audience tags`);
    }
    if (!statuses.has(entry.status))
      invalid.push(`${key}: invalid status ${entry.status}`);
    if (
      expected.has(key) &&
      comparableLabel(entry.label) !== comparableLabel(expected.get(key))
    ) {
      invalid.push(`${key}: label does not match source heading`);
    }
  }

  if (
    missing.length ||
    extra.length ||
    duplicateKeys.length ||
    invalid.length
  ) {
    failures.push(
      `index coverage failed: ${missing.length} missing, ${extra.length} extra, ` +
        `${duplicateKeys.length} duplicate, ${invalid.length} invalid`,
      ...missing.map((key) => `missing ${key}`),
      ...extra.map((key) => `extra ${key}`),
      ...duplicateKeys.map((key) => `duplicate ${key}`),
      ...invalid,
    );
  } else {
    console.log(
      `PASS index coverage: ${expected.size}/${expected.size} product headings indexed`,
    );
  }

  return entries;
}

function productLinks(markdown) {
  const links = [];
  const pattern = /\]\(\.\.\/product\/([^#)]+)#([^)]+)\)/g;
  let match;
  while ((match = pattern.exec(markdown)) !== null) {
    links.push({ anchor: match[2], file: match[1] });
  }
  return links;
}

function voiceSection(markdown, title) {
  const marker = `## ${title}`;
  const start = markdown.indexOf(marker);
  if (start === -1) return null;
  const bodyStart = start + marker.length;
  const next = markdown.indexOf("\n## ", bodyStart);
  return markdown.slice(bodyStart, next === -1 ? markdown.length : next);
}

function checkDualVoice(failures) {
  const markdown = readFileSync(dualVoicePath, "utf8");
  const everyday = voiceSection(markdown, "Everyday AI-user voice");
  const engineer = voiceSection(markdown, "Software-engineer voice");
  if (everyday === null || engineer === null) {
    failures.push("dual-voice sample is missing a required voice heading");
    return;
  }
  const everydayLinks = productLinks(everyday).map(
    ({ file, anchor }) => `${file}#${anchor}`,
  );
  const engineerLinks = productLinks(engineer).map(
    ({ file, anchor }) => `${file}#${anchor}`,
  );
  if (
    everydayLinks.length === 0 ||
    JSON.stringify(everydayLinks) !== JSON.stringify(engineerLinks)
  ) {
    failures.push(
      "dual-voice claim links are not identical and in the same order",
    );
  } else {
    console.log(
      `PASS dual-voice links: ${everydayLinks.length} identical claim links per voice`,
    );
  }
}

const revisionCache = new Map();
function sourceAtRevision(revision, file) {
  const key = `${revision}:${file}`;
  if (!revisionCache.has(key)) {
    revisionCache.set(
      key,
      execFileSync("git", ["show", `${revision}:docs/product/${file}`], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }),
    );
  }
  return revisionCache.get(key);
}

function sectionMap(markdown) {
  return new Map(
    headings(markdown).map((heading) => [heading.anchor, heading.text]),
  );
}

const currentSectionCache = new Map();
function currentSections(file) {
  if (!currentSectionCache.has(file)) {
    currentSectionCache.set(
      file,
      sectionMap(readFileSync(path.join(productDirectory, file), "utf8")),
    );
  }
  return currentSectionCache.get(file);
}

const revisionSectionCache = new Map();
function sectionsAtRevision(revision, file) {
  const key = `${revision}:${file}`;
  if (!revisionSectionCache.has(key)) {
    revisionSectionCache.set(key, sectionMap(sourceAtRevision(revision, file)));
  }
  return revisionSectionCache.get(key);
}

function validateLinkAtBase(
  consumer,
  key,
  link,
  revision,
  sharedFiles,
  failures,
) {
  if (!sharedFiles.has(link.file)) {
    failures.push(
      `${consumer} cites a product file outside the shared source set: ${link.file}`,
    );
    return false;
  }
  if (revision === null) return true;

  try {
    if (!sectionsAtRevision(revision, link.file).has(link.anchor)) {
      failures.push(
        `${consumer} cannot resolve base source ${key} at ${revision}`,
      );
    }
  } catch {
    failures.push(`${consumer} cannot read base source ${key} at ${revision}`);
  }
  return true;
}

function checkBaseSourceConsumer(filePath, sharedFiles, failures) {
  const markdown = readFileSync(filePath, "utf8");
  const consumer = relative(filePath);
  const revisionMatch = markdown.match(
    /^Source base revision: `([0-9a-f]{40})`$/m,
  );
  if (!revisionMatch) {
    failures.push(`${consumer} has no full source base revision`);
    return null;
  }

  const revision = revisionMatch[1];
  const uniqueLinks = new Map();
  for (const link of productLinks(markdown)) {
    uniqueLinks.set(`${link.file}#${link.anchor}`, link);
  }
  if (uniqueLinks.size === 0) {
    failures.push(`${consumer} has no product claim links`);
  }

  for (const [key, link] of uniqueLinks) {
    if (
      validateLinkAtBase(
        consumer,
        key,
        link,
        revision,
        sharedFiles,
        failures,
      ) &&
      !currentSections(link.file).has(link.anchor)
    ) {
      failures.push(`${consumer} has an unresolved current link: ${key}`);
    }
  }
  return revision;
}

function normalizeSection(value) {
  return `${value.replace(/\r\n/g, "\n").replace(/\n*$/, "")}\n`;
}

function sourceLock(links, failures, consumer) {
  const hash = createHash("sha256");
  let complete = true;

  for (const [key, link] of [...links].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const section = currentSections(link.file).get(link.anchor);
    if (section === undefined) {
      failures.push(`${consumer} has an unresolved current link: ${key}`);
      complete = false;
      continue;
    }
    hash.update(key);
    hash.update("\0");
    hash.update(normalizeSection(section));
    hash.update("\0");
  }

  return complete ? hash.digest("hex") : null;
}

function checkEdition(filePath, sharedFiles, indexEntries, failures) {
  const markdown = readFileSync(filePath, "utf8");
  const consumer = relative(filePath);
  const label = path.basename(filePath);
  const requiredAudience = editionAudiences.get(label);
  const revisionMatch = markdown.match(
    /^Source base revision: `([0-9a-f]{40})`$/m,
  );
  const lockMatch = markdown.match(/^Source lock:\s+`sha256:([0-9a-f]{64})`$/m);
  if (!revisionMatch) {
    failures.push(`${consumer} has no full source base revision`);
  }
  if (!lockMatch) {
    failures.push(`${consumer} has no SHA-256 source lock`);
  }
  if (!requiredAudience) {
    failures.push(`${consumer} has no declared edition audience`);
  }

  const revision = revisionMatch?.[1] ?? null;
  const expectedLock = lockMatch?.[1] ?? null;
  const uniqueLinks = new Map();
  for (const link of productLinks(markdown))
    uniqueLinks.set(`${link.file}#${link.anchor}`, link);
  if (uniqueLinks.size === 0)
    failures.push(`${consumer} has no product claim links`);

  for (const [key, link] of uniqueLinks) {
    if (
      !validateLinkAtBase(consumer, key, link, revision, sharedFiles, failures)
    ) {
      continue;
    }
    if (
      requiredAudience &&
      !indexEntries.get(key)?.audienceValues.includes(requiredAudience)
    ) {
      failures.push(
        `${consumer} cites ${key} without the ${requiredAudience} audience tag`,
      );
    }
  }

  const lockLinks = new Map(
    [...uniqueLinks].filter(([, link]) => sharedFiles.has(link.file)),
  );
  const actualLock =
    lockLinks.size === uniqueLinks.size
      ? sourceLock(lockLinks, failures, consumer)
      : null;
  return {
    actualLock,
    baseRevision: revision,
    expectedLock,
    filePath,
    links: [...uniqueLinks.values()],
    stale:
      actualLock === null ||
      expectedLock === null ||
      actualLock !== expectedLock,
  };
}

const failures = [];
const indexEntries = checkCoverage(failures);
checkDualVoice(failures);

const sharedFiles = new Set(productFiles());
const baseConsumerRevisions = [baseOutlinePath, dualVoicePath].map((filePath) =>
  checkBaseSourceConsumer(filePath, sharedFiles, failures),
);
const editionResults = editionPaths.map((filePath) =>
  checkEdition(filePath, sharedFiles, indexEntries, failures),
);
const baseRevisions = new Set(
  [
    ...baseConsumerRevisions,
    ...editionResults.map((result) => result.baseRevision),
  ].filter(Boolean),
);
if (baseRevisions.size !== 1)
  failures.push("publication source base revisions do not match");

for (const result of editionResults) {
  const label = path.basename(result.filePath);
  if (printLocks) {
    console.log(`LOCK ${label}: sha256:${result.actualLock ?? "unavailable"}`);
  } else if (!result.stale) {
    console.log(
      `CURRENT ${label}: ${result.links.length} linked source sections match`,
    );
  } else {
    console.log(
      `STALE ${label}: source lock ${result.expectedLock ?? "missing"}; current ${result.actualLock ?? "unavailable"}`,
    );
  }
}

if (printLocks) {
  // Printing is a read-only aid; structural failures still fail below.
} else if (expectStale) {
  const notStale = editionResults.filter((result) => !result.stale);
  if (notStale.length > 0) {
    failures.push(
      `expected every edition to be stale; ${notStale.length} remained current`,
    );
  } else {
    console.log(
      `PASS expected-stale proof: ${editionResults.length}/${editionResults.length} editions flagged stale`,
    );
  }
} else {
  const stale = editionResults.filter((result) => result.stale);
  if (stale.length > 0) failures.push(`${stale.length} edition(s) are stale`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS publication bootstrap checks");
