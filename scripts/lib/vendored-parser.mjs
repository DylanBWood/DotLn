// The carried parser: the scripts hold Prettier's self-contained Markdown
// plugin with its license and its third-party notices, so the lifecycle reads
// Markdown before any install. The copies are the pinned package's own bytes.
// Core's check compares them with the installed package and with the hashes
// recorded beside this module; a Prettier update changes node_modules, the
// check reports the copies stale and npm run sync copies the new files and
// records their hashes. An instance carries the copies and the record as kit
// files: there the record alone says whether a file is the proven copy.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { docRelative, findLaunchpad } from "./config.mjs";
import { sha256Hex as sha256 } from "./helpers.mjs";
import { isMainModule } from "./paths.mjs";

/** Each carried file and the installed file it copies. */
export const VENDORED = Object.freeze([
  [
    "scripts/lib/vendor/prettier-markdown.mjs",
    "node_modules/prettier/plugins/markdown.mjs",
  ],
  ["scripts/lib/vendor/prettier-LICENSE", "node_modules/prettier/LICENSE"],
  [
    "scripts/lib/vendor/prettier-THIRD-PARTY-NOTICES.md",
    "node_modules/prettier/THIRD-PARTY-NOTICES.md",
  ],
]);
/** The record of what was proven: the package's version and each copy's
 * SHA-256, written when the copies are. */
export const VENDORED_RECORD = "scripts/lib/vendored-parser.json";
/** The root file that names the third-party material a kit distributes. It
 * is this repository's own text, written with the copies so that it names
 * their version, and screened as any file is. */
export const THIRD_PARTY_NOTICES = "THIRD_PARTY_NOTICES";

/** The notices file's text for the carried version. */
export const renderThirdPartyNotices = (version) =>
  [
    "Third-party material carried in this repository",
    "",
    "This file lists the third-party files the repository holds and a kit",
    "export distributes. Dependencies that npm installs are not carried here.",
    "",
    `Prettier ${version}, Markdown plugin`,
    "",
    `  Carried file  ${VENDORED[0][0]}`,
    `  Origin        npm package prettier@${version}, file plugins/markdown.mjs,`,
    "                copied byte for byte",
    "  License       MIT",
    `  License text  ${VENDORED[1][0]}`,
    `  Notices       ${VENDORED[2][0]}`,
    "                Prettier's own notices for the packages its published",
    "                files bundle, copied byte for byte",
    "",
    `${VENDORED_RECORD} records the SHA-256 of each of the`,
    "three files, and node scripts/lib/vendored-parser.mjs --check compares",
    "them with the installed package where one is installed.",
    "",
  ].join("\n");

const records = new Map();
// A record that is absent or unreadable proves nothing: every file is then
// read as any other.
const recordFiles = (text) => {
  try {
    const record = JSON.parse(text);
    if (
      record?.schemaVersion === 1 &&
      record.files &&
      typeof record.files === "object" &&
      !Array.isArray(record.files)
    )
      return record.files;
  } catch {
    // Falls through to the empty proof.
  }
  return {};
};
const recorded = (root) => {
  if (!records.has(root)) {
    let text = "";
    try {
      text = readFileSync(join(root, VENDORED_RECORD), "utf8");
    } catch {
      // No record.
    }
    records.set(root, recordFiles(text));
  }
  return records.get(root);
};

/** The proof a record's own text gives, for a caller that judges a tree
 * other than the working one, such as the files a kit export writes: whether
 * `bytes` at `path` are a carried file the record holds. */
export const vendoredProof = (recordText) => {
  const files = recordFiles(recordText ?? "");
  return (path, bytes) =>
    VENDORED.some(([copy]) => copy === path) && files[path] === sha256(bytes);
};

/** Whether `bytes` at `path` are the proven copy: one of the carried files
 * whose bytes hash to what the record holds. A screen that judges this
 * repository's own text leaves out exactly these files, since nothing a
 * session or an owner wrote is in them; a copy that differs by a byte is no
 * longer proven and is screened as any file is. */
export const provenVendoredBytes = (root, path, bytes) =>
  VENDORED.some(([copy]) => copy === path) &&
  recorded(root)[path] === sha256(bytes);

/** The same for the file on disk; a missing file is not proven. */
export function provenVendoredFile(root, path) {
  if (!VENDORED.some(([copy]) => copy === path)) return false;
  try {
    return provenVendoredBytes(root, path, readFileSync(join(root, path)));
  } catch {
    return false;
  }
}

/** Copy the installed files and record their hashes, or with `check` report
 * each copy that differs from the installed file and a record that differs
 * from the copies. */
export function vendorParser(root, { check = false } = {}) {
  const stale = [];
  const files = {};
  for (const [copy, installed] of VENDORED) {
    if (!existsSync(join(root, installed)))
      throw new Error(
        `${installed} is absent; run npm ci so the pinned Prettier is installed`,
      );
    const bytes = readFileSync(join(root, installed));
    files[copy] = sha256(bytes);
    const current = existsSync(join(root, copy))
      ? readFileSync(join(root, copy))
      : null;
    if (current?.equals(bytes)) continue;
    stale.push(copy);
    if (!check) writeFileSync(join(root, copy), bytes);
  }
  const { version } = JSON.parse(
    readFileSync(join(root, "node_modules/prettier/package.json"), "utf8"),
  );
  const record = `${JSON.stringify({ schemaVersion: 1, package: "prettier", version, files }, null, 2)}\n`;
  const held = existsSync(join(root, VENDORED_RECORD))
    ? readFileSync(join(root, VENDORED_RECORD), "utf8")
    : null;
  if (held !== record) {
    stale.push(VENDORED_RECORD);
    if (!check) {
      writeFileSync(join(root, VENDORED_RECORD), record);
      records.delete(root);
    }
  }
  const notices = renderThirdPartyNotices(version);
  const heldNotices = existsSync(join(root, THIRD_PARTY_NOTICES))
    ? readFileSync(join(root, THIRD_PARTY_NOTICES), "utf8")
    : null;
  if (heldNotices !== notices) {
    stale.push(THIRD_PARTY_NOTICES);
    if (!check) writeFileSync(join(root, THIRD_PARTY_NOTICES), notices);
  }
  return stale;
}

/** The legal page names the carried version in prose, which no command
 * writes: after a Prettier update the check names the page until its
 * paragraph is brought up to date. Null when the page names it. */
export function legalPageGap(root) {
  const { version } = JSON.parse(
    readFileSync(join(root, "node_modules/prettier/package.json"), "utf8"),
  );
  const page = docRelative(root, "docs", "LEGAL.md");
  const text = existsSync(join(root, page))
    ? readFileSync(join(root, page), "utf8")
    : "";
  return text.includes(`Prettier ${version}`) &&
    text.includes(VENDORED[0][0]) &&
    text.includes(THIRD_PARTY_NOTICES)
    ? null
    : `${page}: name the carried copy (${VENDORED[0][0]}), its version as "Prettier ${version}" and ${THIRD_PARTY_NOTICES}`;
}

if (isMainModule(import.meta.url)) {
  const check = process.argv[2] === "--check";
  try {
    const root = findLaunchpad();
    const stale = vendorParser(root, { check });
    const gap = check ? legalPageGap(root) : null;
    if (check && (stale.length || gap)) {
      for (const path of stale)
        console.error(
          `stale ${path}: it differs from the pinned Prettier's file or its recorded hash; run npm run sync`,
        );
      if (gap) console.error(`FAIL ${gap}`);
      if (stale.length) console.error("DOTLN_ARTIFACT_STALE vendored-parser");
      process.exitCode = 1;
    } else
      console.log(
        check
          ? "the carried parser, its license and its notices match the pinned Prettier"
          : `carried parser: ${stale.length} file(s) written`,
      );
  } catch (error) {
    console.error(`FAIL vendored parser: ${error.message}`);
    process.exitCode = 1;
  }
}
