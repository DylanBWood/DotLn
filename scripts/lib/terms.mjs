import { docPath } from "./config.mjs";
import { existsSync, readFileSync } from "node:fs";
import { containedRegularFile } from "./paths.mjs";

/** A private term's two classes. A `refuse` entry refuses wherever a screen
 * finds it. A `context` entry never refuses: the screen lists the file and
 * line for the stage at hand to read, and passes. The pure lint keeps its own
 * copy of these two words, because it imports nothing. */
export const localTermModes = Object.freeze(["refuse", "context"]);

/** The words a term or a text is compared by: NFKC, lower case, and runs of
 * letters and digits. The verbatim screen compares the operator's captures by
 * the same words. */
const fold = (text) => text.normalize("NFKC").toLocaleLowerCase("en-US");
export const localTermTokens = (text) =>
  fold(text).match(/[\p{L}\p{N}]+/gu) ?? [];
const tokens = localTermTokens;

// What a writer puts inside one name: spaces and characters that print as
// nothing, hyphens and dashes, periods, underscores, apostrophes, slashes and
// the Markdown marks for emphasis and code. Runs of letters and digits join
// into one candidate across these and, for one entry, across the characters
// that entry itself carries between its runs. A brace, a bracket, a pipe, a
// backslash, a quotation mark or an operator never joins two runs.
const JOINER = /[\s\p{Zs}\p{Cf}\p{Pd}._'’/*`]/u;
// What may open a line before its words: a quotation marker, a comment
// marker or a list marker, each with the spaces after it, so a name wrapped
// inside a quoted or commented block is still one name.
const LINE_OPENING =
  /^[ \t]*(?:(?:>+|#+|;+|%+|\/{2,}|\/\*+|\*+|-{2,}|<!--|[-*+])[ \t]*)*/u;
// A numbered list item's marker, read where a line's first run is its number.
const NUMBERED_ITEM = /^[.)](?:[ \t]|$)/u;

/** The characters of `separator` that the general rule does not join across,
 * once each line's opening markers are set aside. An empty answer means the
 * separator joins for every entry. */
function unjoined(separator) {
  const [first, ...rest] = separator.split("\n");
  let needs = "";
  for (const part of [first, ...rest.map((l) => l.replace(LINE_OPENING, ""))])
    for (const character of part)
      if (!JOINER.test(character) && !needs.includes(character))
        needs += character;
  return needs;
}

/** The private list's lines as entries keyed by their folded words, each
 * with its mode and the characters it carries between its own runs. A mode
 * word alone on a line (`refuse:` or `context:`) opens a section whose lines
 * take that mode until the next such line; `review:` is read as `context:`.
 * A line may also carry its own marker, `[mode:] term`, which it keeps inside
 * any section. A line outside every section with no marker is context. Only
 * the mode words before a colon are markers, so a term that holds a colon (an
 * address, a host and port) stays the term it was. An entry listed in both
 * classes refuses. A `#` at a line's start, or after a space or a tab,
 * begins a comment that runs to the line's end: on a section line the
 * section still opens, and on an entry's line the entry is what stands
 * before it. Read otherwise, a commented section line would open no section
 * and leave its entries in the class before it. */
export function parseLocalTerms(text) {
  const terms = new Map();
  let section = "context";
  text.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.replace(/(?:^|[ \t])#.*$/u, "").trim();
    if (!line) return;
    const marked = /^(refuse|context|review)\s*:\s*(.*)$/iu.exec(line);
    const marker = marked?.[1].toLowerCase().replace("review", "context");
    if (marked && !marked[2]) {
      section = marker;
      return;
    }
    const body = fold(marked ? marked[2] : line);
    const runs = body.match(/[\p{L}\p{N}]+/gu) ?? [];
    if (!runs.length)
      throw new Error(
        `local-terms list line ${index + 1}: no term on the line`,
      );
    const key = runs.join("");
    const prior = terms.get(key);
    // The entry's own spelling always matches: what stands between its runs
    // joins for this entry, beyond what the general rule joins.
    const first = body.indexOf(runs[0]);
    const last = body.lastIndexOf(runs.at(-1)) + runs.at(-1).length;
    let joins = prior?.joins ?? "";
    for (const character of body
      .slice(first, last)
      .replace(/[\p{L}\p{N}]+/gu, ""))
      if (!JOINER.test(character) && !joins.includes(character))
        joins += character;
    terms.set(key, {
      mode: prior?.mode === "refuse" ? "refuse" : (marker ?? section),
      joins,
    });
  });
  return terms;
}

/** How many entries the list holds in each class. */
const classCounts = (terms) => {
  const counts = { refuse: 0, context: 0 };
  for (const { mode } of terms.values()) counts[mode] += 1;
  return counts;
};

/** One finding as a screen prints it: the file, the line or line range and
 * the mode, never the term. */
export const localTermLine = ({ file, line, endLine, count, mode }) =>
  `${file}:${line}${endLine !== line ? `-${endLine}` : ""}: a local term in ${mode} mode${count > 1 ? `, ${count} matches` : ""}`;

/** The lines a screen prints for the stage at hand to read, one for each
 * context-mode finding of a passing check. */
export const localTermContextLines = (result) =>
  (result?.findings ?? []).map(
    (finding) => `CONTEXT ${localTermLine(finding)}`,
  );

// The local list and matches never leave this process, including as hashes.
// A present list with no terms is present with a count of zero. A refuse-mode
// match refuses here, by file, line range, count and mode. A context-mode
// match refuses nothing: it is returned for the caller to list, so the stage
// reads the line beside the entry it matched.
export function checkLocalTerms(root, surfaces) {
  const result = localTermFindings(root, surfaces);
  const refused = (result.findings ?? []).filter(
    (finding) => finding.mode === "refuse",
  );
  if (refused.length)
    throw new Error(
      `local-terms list present; refused ${JSON.stringify(refused)}`,
    );
  return result;
}

/** The check for a caller that prints no status line of its own. A
 * refuse-mode match throws; each context-mode match is listed on standard
 * error, where it cannot break a command's structured standard output. */
export function screenLocalTerms(root, surfaces) {
  const result = checkLocalTerms(root, surfaces);
  for (const line of localTermContextLines(result)) console.error(line);
  return result;
}

/** The same check returning every finding, each a file, a line range, a count
 * and a mode and never the term, with the list's status and its count of
 * entries in each class. */
export function localTermFindings(root, surfaces) {
  const path = docPath(root, "control", "local/terms.txt");
  if (!existsSync(path)) return { status: "unavailable" };
  if (!containedRegularFile(path, root))
    throw new Error("local-terms list is not a contained regular file");
  const terms = parseLocalTerms(readFileSync(path, "utf8"));
  const status = {
    status: "present",
    terms: terms.size,
    ...classCounts(terms),
  };
  if (!terms.size) return { ...status, findings: [] };
  // Every beginning of every entry. The search extends a candidate only while
  // it is one of these, so a text no entry begins like is passed over at its
  // first word, whatever the entries' length.
  const beginnings = new Set();
  for (const term of terms.keys())
    for (let end = 1; end <= term.length; end++)
      beginnings.add(term.slice(0, end));
  // A separator that needs a character no entry carries joins for none.
  const carried = new Set(
    [...terms.values()].flatMap(({ joins }) => [...joins]),
  );
  const findings = [];
  // The matches of one reading of a text, counted by line range and mode.
  const matchesIn = (text) => {
    // Each run with its line and the text that stands before it since the
    // run before, a line break written as one newline.
    const runs = [];
    let pending = "";
    text.split(/\r?\n/).forEach((raw, index) => {
      const line = fold(raw);
      let at = 0;
      for (const match of line.matchAll(/[\p{L}\p{N}]+/gu)) {
        runs.push({
          word: match[0],
          line: index + 1,
          before: pending + line.slice(at, match.index),
        });
        pending = "";
        at = match.index + match[0].length;
      }
      pending += `${line.slice(at)}\n`;
    });
    // What each run needs joined to reach it from the run before.
    const needs = runs.map((run) => unjoined(run.before));
    // A run is a numbered item's marker when it opens its line, markers
    // aside, and a period or a closing parenthesis and a space follow it.
    const numbered = (index) =>
      /^\p{N}+$/u.test(runs[index].word) &&
      runs[index].before.includes("\n") &&
      !unjoined(`\n${runs[index].before.split("\n").at(-1)}`) &&
      NUMBERED_ITEM.test(runs[index + 1].before);
    const counts = new Map();
    // The states one starting run has explored, and the matches it has
    // counted. A numbered item's marker is read both as a number and as set
    // aside, so two paths can reach one state; each state is explored once and
    // each match, one entry from one run to another, is counted once. With
    // the beginnings above, the work for a start is bounded by the runs an
    // entry can span times the entries' beginnings, not by the paths.
    let explored;
    let matched;
    // Bound spans by the entries' own beginnings, not a fixed token count:
    // the rule's separators may split even a single listed word, including
    // across lines.
    const extend = (start, end, candidate, needed) => {
      const state = `${end}\0${candidate}\0${needed}`;
      if (explored.has(state)) return;
      explored.add(state);
      const entry = terms.get(candidate);
      if (
        entry &&
        [...needed].every((character) => entry.joins.includes(character)) &&
        !matched.has(`${end}\0${candidate}`)
      ) {
        matched.add(`${end}\0${candidate}`);
        // Keep each match's complete line range without exposing its text
        // or columns. Different ending lines must not share an exemption.
        const key = `${runs[start].line}:${runs[end].line}:${entry.mode}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      const step = (next, separatorNeeds) => {
        let all = needed;
        for (const character of separatorNeeds) {
          if (!carried.has(character)) return;
          if (!all.includes(character)) all += character;
        }
        const longer = candidate + runs[next].word;
        if (beginnings.has(longer)) extend(start, next, longer, all);
      };
      if (end + 1 >= runs.length) return;
      step(end + 1, needs[end + 1]);
      // A numbered item's marker between two runs is set aside as the other
      // line openings are, and is also still read as the number it is.
      if (end + 2 < runs.length && numbered(end + 1))
        step(
          end + 2,
          unjoined(
            runs[end + 1].before + runs[end + 2].before.replace(/^[.)]/u, ""),
          ),
        );
    };
    for (let start = 0; start < runs.length; start++) {
      if (!beginnings.has(runs[start].word)) continue;
      explored = new Set();
      matched = new Set();
      extend(start, start, runs[start].word, "");
    }
    return counts;
  };
  for (const { name, text } of surfaces) {
    // A text is read as written and, where it holds an escape of a string
    // literal, once more with each escape as the character it stands for,
    // kept to the escape's width so every line keeps its number. JSON text
    // and source text write a line break or a tab inside a string as a
    // backslash and a letter, and that letter is no part of the word after
    // it. Each reading can only add a match.
    const unescaped = text.replace(
      /\\(?:u([0-9a-fA-F]{4})|x([0-9a-fA-F]{2})|[nrtfbv0])/gu,
      (escape, unit, byte) =>
        ((unit ?? byte)
          ? String.fromCodePoint(Number.parseInt(unit ?? byte, 16))
          : ""
        ).padEnd(escape.length, " "),
    );
    const counts = matchesIn(text);
    if (unescaped !== text)
      for (const [key, count] of matchesIn(unescaped))
        counts.set(key, Math.max(counts.get(key) ?? 0, count));
    for (const [key, count] of counts) {
      const [line, endLine, mode] = key.split(":");
      findings.push({
        file: name,
        line: Number(line),
        endLine: Number(endLine),
        count,
        mode,
      });
    }
  }
  return { ...status, findings };
}
