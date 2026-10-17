export const isMarkdownName = (name) => name.endsWith(".md");
export const RECORD_EXTENSIONS = Object.freeze([
  ".json",
  ".jsonl",
  ".log",
  ".txt",
]);
export const isRecordName = (name) =>
  RECORD_EXTENSIONS.some((extension) => name.toLowerCase().endsWith(extension));

// Placeholders and relative tails are not private absolute paths; a bare
// temporary-root mention names no file. Records reject the home class only.
export const PRIVATE_PATH =
  /(?<![\w.~-])\/(?:(?:Users|home)\/[A-Za-z0-9_][\w.-]*|(?:private\/)?(?:var\/folders|tmp)\/[A-Za-z0-9_])/u;
// In a record, captured output is often stored as a JSON string, where a path
// can follow an escape such as \n or \t. The escape's letter is a word
// character, so the plain look-behind would skip the path; the second
// look-behind accepts the escape as a boundary. Markdown keeps the plain one.
export const HOME_DIRECTORY =
  /(?:(?<![\w.~-])|(?<=\\(?:[bfnrt]|u[0-9A-Fa-f]{4})))\/(?:Users|home)\/[A-Za-z0-9_][\w.-]*/u;

// Markdown is selected by the same suffix test that lists it, so a bare .md
// basename, whose extname is empty, keeps its rule.
export function privatePathRule(name) {
  if (isMarkdownName(name)) return PRIVATE_PATH;
  return isRecordName(name) ? HOME_DIRECTORY : null;
}

// The 1-based lines a rule matches, testing the whole text first.
export function linesMatching(rule, text) {
  if (!rule?.test(text)) return [];
  return text
    .split("\n")
    .flatMap((line, index) => (rule.test(line) ? [index + 1] : []));
}

export const privatePathLines = (name, text) =>
  linesMatching(privatePathRule(name), text);

// A global replacement judges each look-behind against the original text, so
// a second home prefix written directly after an account name survives one
// pass and the placeholder before it then counts as a boundary. Replacing
// until nothing matches leaves text the home-directory rule does not match,
// which a later projection returns unchanged. Each pass replaces at least one
// home prefix and the placeholder holds none, so the passes end.
export function withoutHomeDirectories(text) {
  const pattern = new RegExp(HOME_DIRECTORY.source, "gu");
  let previous;
  do {
    previous = text;
    text = text.replace(pattern, "<home>");
  } while (text !== previous);
  return text;
}
