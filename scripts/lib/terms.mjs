import { docPath } from "./config.mjs";
import { existsSync, readFileSync } from "node:fs";
import { containedRegularFile } from "./paths.mjs";

/** A private term's modes: `refuse` refuses wherever outward text carries the
 * term; `review` makes a match a review item the reviewer confirms. The pure
 * lint keeps its own copy of these two words, because it imports nothing. */
export const localTermModes = Object.freeze(["refuse", "review"]);

const tokens = (text) =>
  text
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .match(/[\p{L}\p{N}]+/gu) ?? [];

/** The private list's lines as terms with their modes. A line is `[mode:]
 * term`: `refuse:` refuses the term wherever outward text carries it;
 * `review:`, or no marker, makes it a review item of an outward publication,
 * read by the reviewer in context. Only the two mode words before a colon are
 * markers, so a term that holds a colon (an address, a host and port) stays
 * the term it was. A term listed twice keeps the stricter mode. Lines
 * beginning with `#` are comments. A mode marker with no term after it
 * refuses naming the line and nothing else. */
export function parseLocalTerms(text) {
  const terms = new Map();
  text.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return;
    const marked = /^(refuse|review)\s*:\s*(.*)$/iu.exec(line);
    const mode = marked ? marked[1].toLowerCase() : "review";
    const body = marked ? marked[2] : line;
    const key = tokens(body).join("");
    if (!key)
      throw new Error(
        `local-terms list line ${index + 1}: ${marked ? "a mode marker with no term" : "no term on the line"}`,
      );
    terms.set(key, terms.get(key) === "refuse" ? "refuse" : mode);
  });
  return terms;
}

// The local list and matches never leave this process, including as hashes.
// A present list with no terms is present with a count of zero. Every match
// refuses here, whatever its mode, because committed text and kit surfaces
// have no reviewer confirmation step; the outward adapter
// (scripts/outward-lint.mjs) reads the modes from the redacted findings and
// makes review-mode matches review items of the publication.
export function checkLocalTerms(root, surfaces) {
  const path = docPath(root, "control", "local/terms.txt");
  if (!existsSync(path)) return { status: "unavailable" };
  if (!containedRegularFile(path, root))
    throw new Error("local-terms list is not a contained regular file");
  const terms = parseLocalTerms(readFileSync(path, "utf8"));
  if (!terms.size) return { status: "present", terms: 0 };
  const maxLength = Math.max(...[...terms.keys()].map((term) => term.length));
  const findings = [];
  for (const { name, text } of surfaces) {
    const words = text
      .split(/\r?\n/)
      .flatMap((line, index) =>
        tokens(line).map((word) => ({ word, line: index + 1 })),
      );
    const counts = new Map();
    // Bound spans by normalized character length, not a fixed token count:
    // separators may split even a single listed word, including across lines.
    for (let start = 0; start < words.length; start++) {
      let candidate = "";
      for (let end = start; end < words.length; end++) {
        candidate += words[end].word;
        if (candidate.length > maxLength) break;
        const mode = terms.get(candidate);
        if (mode) {
          // Keep each match's complete line range without exposing its text
          // or columns. Different ending lines must not share an exemption.
          const key = `${words[start].line}:${words[end].line}:${mode}`;
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
      }
    }
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
  if (findings.length)
    throw new Error(
      `local-terms list present; refused ${JSON.stringify(findings)}`,
    );
  return { status: "present", terms: terms.size };
}
