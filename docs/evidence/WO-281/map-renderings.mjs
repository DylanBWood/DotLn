// Every rendering of the seeded documentation map (an instance's
// docs/README.md) that an export of core wrote while the export rendered it
// in code: the provenance of LEGACY_DOCS_MAPS in scripts/lib/starter-seeds.mjs.
// For each commit of main that touched scripts/launchpad.mjs, the script
// takes the expression that built the map as that commit wrote it, evaluates
// it with that commit's seeded roots, and groups the results by their bytes.
//
//   node docs/evidence/WO-281/map-renderings.mjs [--until <revision>]
//        [--starter-map <path to a starter's docs/README.md>]
//
// --until names the last revision read (default: the merge base of HEAD and
// main, the base this order's rewrite left). --starter-map compares one
// starter's copy with the renderings and says which it is; the path is read
// and never written into the record. The record is map-renderings.md beside
// this file.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defaultDocRelative } from "../../../scripts/lib/config.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../..");
const args = process.argv.slice(2);
const option = (name) => {
  const at = args.indexOf(`--${name}`);
  return at < 0 ? undefined : args.splice(at, 2)[1];
};
const starterMap = option("starter-map");
const git = (...argv) =>
  execFileSync("git", argv, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
const until = option("until") ?? git("merge-base", "HEAD", "main").trim();
if (args.length) throw new Error(`unread: ${args.join(" ")}`);

const commits = git(
  "log",
  "--format=%H %ad",
  "--date=short",
  "--reverse",
  until,
  "--",
  "scripts/launchpad.mjs",
)
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [hash, date] = line.split(" ");
    return { hash, date };
  });
const sha = (text) => createHash("sha256").update(text).digest("hex");

// The source of the bracketed expression that opens at `from`: its matching
// close, with strings and template expressions skipped.
const bracketed = (source, from) => {
  let depth = 0;
  let quote = null;
  for (let at = from; at < source.length; at++) {
    const character = source[at];
    if (quote) {
      if (character === "\\") at += 1;
      else if (character === quote) quote = null;
      else if (quote === "`" && character === "$" && source[at + 1] === "{") {
        let inner = 1;
        at += 2;
        while (inner && at < source.length) {
          if (source[at] === "{") inner += 1;
          else if (source[at] === "}") inner -= 1;
          at += 1;
        }
        at -= 1;
      }
      continue;
    }
    if (character === '"' || character === "'" || character === "`")
      quote = character;
    else if ("[({".includes(character)) depth += 1;
    else if ("])}".includes(character)) {
      depth -= 1;
      if (!depth) return source.slice(from, at + 1);
    }
  }
  throw new Error("the expression does not close");
};

const renderings = new Map();
const unread = [];
const marker = 'defaultDocRelative("docs", "README.md"),';
for (const commit of commits) {
  const source = git("show", `${commit.hash}:scripts/launchpad.mjs`);
  const at = source.indexOf(marker);
  // Before the seed existed, and from the commit that made it a template.
  if (at < 0 || source[source.indexOf("[", at + marker.length) - 1] === "(")
    continue;
  try {
    const lines = bracketed(source, source.indexOf("[", at + marker.length));
    const roots = bracketed(
      source,
      source.indexOf("{", source.indexOf("const SEEDED_ROOTS")),
    );
    const linkAt = source.lastIndexOf("const mapLink", at);
    const mapLink =
      linkAt < 0
        ? "undefined"
        : source
            .slice(
              source.indexOf("=", linkAt) + 1,
              source.indexOf(";\n", linkAt),
            )
            .trim();
    const text = new Function(
      "defaultDocRelative",
      "posix",
      `const SEEDED_ROOTS = ${roots}; const mapLink = ${mapLink}; return ${lines}.join("\\n");`,
    )(defaultDocRelative, posix);
    const key = sha(text);
    const held = renderings.get(key);
    if (held) held.last = commit;
    else renderings.set(key, { first: commit, last: commit, text });
  } catch (error) {
    unread.push(`${commit.hash.slice(0, 9)}: ${error.message}`);
  }
}

const short = (commit) => `\`${commit.hash.slice(0, 9)}\` (${commit.date})`;
const record = [
  "# The maps an export rendered in code",
  "",
  `Written by \`node docs/evidence/WO-281/map-renderings.mjs\` over the ${commits.length} commits of \`scripts/launchpad.mjs\` up to \`${until.slice(0, 9)}\`. Each row is one text an export wrote as an instance's \`docs/README.md\`, with the first and last commit that wrote it; ${unread.length ? `${unread.length} commits could not be read: ${unread.join("; ")}` : "every commit that held the seed was read"}.`,
  "",
  "| SHA-256 | Bytes | First commit | Last commit |",
  "| --- | --- | --- | --- |",
  ...[...renderings].map(
    ([key, { first, last, text }]) =>
      `| \`${key}\` | ${Buffer.byteLength(text)} | ${short(first)} | ${short(last)} |`,
  ),
  "",
];
if (starterMap) {
  const key = sha(readFileSync(starterMap, "utf8"));
  const at = [...renderings.keys()].indexOf(key);
  record.push(
    `The starter's own copy, read from its checkout when this record was written, has SHA-256 \`${key}\`: ${at < 0 ? "none of the rows above" : `row ${at + 1} above`}.`,
    "",
  );
}
writeFileSync(join(here, "map-renderings.md"), record.join("\n"));
console.log(
  `${renderings.size} renderings over ${commits.length} commits; ${unread.length} unread; docs/evidence/WO-281/map-renderings.md`,
);
