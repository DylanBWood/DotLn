import { basename } from "node:path";
const valueOptions = new Set([
  "--prefix",
  "--workspace",
  "-w",
  "--loglevel",
  "--userconfig",
  "--cache",
  "--registry",
]);
/** @param {readonly string[]} words @param {number} start */
const skipOptions = (words, start) => {
  while (words[start]?.startsWith("-")) {
    const option = words[start++];
    if (valueOptions.has(option ?? "")) start++;
  }
  return start;
};
/** @param {readonly string[]} words @param {string} script */
export function npmScriptArgs(words, script) {
  if (basename(words[0] ?? "") !== "npm") return null;
  let index = skipOptions(words, 1);
  if (words[index++] !== "run") return null;
  index = skipOptions(words, index);
  return words[index++] === script ? words.slice(index) : null;
}
/** @param {readonly string[]} words */
export function testSelectionArgs(words) {
  if (basename(words[0] ?? "") === "npm") {
    let index = skipOptions(words, 1);
    const action = words[index++];
    if (action === "run") {
      index = skipOptions(words, index);
      if (!["test", "test:full"].includes(words[index++] ?? "")) return null;
    } else if (action !== "test") return null;
    return words.slice(index);
  }
  if (
    (basename(words[0] ?? "") === "node" || words[0] === process.execPath) &&
    /(?:^|\/)scripts\/test-runner\.mjs$/u.test(words[1] ?? "")
  )
    return words.slice(2);
  return null;
}
/** @param {readonly string[]} words */
export function completeTestSelection(words) {
  const args = testSelectionArgs(words);
  return (
    args !== null &&
    !args.some((arg) =>
      [
        "--only",
        "--document",
        "--list",
        "--machinery",
        "--confined-partial",
      ].includes(arg),
    )
  );
}
/** @param {readonly string[]} words */
export function diagnosticTestSelection(words) {
  return (
    testSelectionArgs(words)?.some((arg) =>
      ["--only", "--list"].includes(arg),
    ) ?? false
  );
}
