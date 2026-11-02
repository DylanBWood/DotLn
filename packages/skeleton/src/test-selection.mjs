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
/** npm's own spellings of its test command. */
const npmTestActions = new Set(["test", "t", "tst"]);
/** The package scripts that start a test-runner gate. */
const gateScripts = new Set([
  "test",
  "test:full",
  "test:docs",
  "test:machinery",
]);
/** Node's options whose separate value Node never runs: a pattern, a name, a
 * number or a file it writes or reads as data. A script path given as one of
 * these values is not the script. Module loaders (`--require`, `--import`,
 * `--loader`) are absent because Node runs what they name; an option missing
 * here can only make a path count, never let a script pass. */
const nodeDataOptions = new Set([
  "--test-name-pattern",
  "--test-skip-pattern",
  "--test-reporter",
  "--test-reporter-destination",
  "--test-concurrency",
  "--test-shard",
  "--redirect-warnings",
  "--title",
  "--env-file",
  "--env-file-if-exists",
  "--input-type",
  "--disable-warning",
  "--inspect-port",
  "--watch-path",
  "--stack-size",
  "--diagnostic-dir",
  "--report-dir",
  "--report-directory",
  "--report-filename",
  "--cpu-prof-dir",
  "--cpu-prof-name",
  "--heap-prof-dir",
  "--heap-prof-name",
  "--localstorage-file",
  "-C",
  "--conditions",
]);
/** The words after a named script in a Node invocation, or null when the
 * program is not Node or no word names that script. The script is found by
 * its own path wherever it stands, so no Node option spelling (a flag, a
 * flag with a separate value, `--`) can hide it, and a script Node loads
 * through an option such as `--require` is found too; a path that is the
 * value of an option Node does not run is passed over.
 * @param {readonly string[]} words
 * @param {RegExp} script
 * @returns {readonly string[] | null} */
export function nodeScriptArgs(words, script) {
  if (basename(words[0] ?? "") !== "node" && words[0] !== process.execPath)
    return null;
  const index = words.findIndex(
    (word, position) =>
      position > 0 &&
      !word.startsWith("-") &&
      script.test(word) &&
      !nodeDataOptions.has(words[position - 1] ?? ""),
  );
  return index === -1 ? null : words.slice(index + 1);
}
/** The command the bounded probe wrapper runs, when this invocation is the
 * wrapper (`node scripts/harness.mjs bounded -- …` or `npm run harness --
 * bounded -- …`), so the wrapped command is judged as if it ran alone.
 * @param {readonly string[]} words
 * @returns {readonly string[] | null} */
export function boundedCommand(words) {
  const harness = npmScriptArgs(words, "harness");
  const rest =
    nodeScriptArgs(words, /(?:^|\/)scripts\/harness(?:-entry)?\.mjs$/u) ??
    (harness && (harness[0] === "--" ? harness.slice(1) : harness));
  if (!rest || rest[0] !== "bounded") return null;
  const separator = rest.indexOf("--", 1);
  return separator === -1 ? null : rest.slice(separator + 1);
}
/** Whether one invocation starts a test-runner gate in any form: npm's test
 * command under any spelling or arguments, a package script that runs the
 * runner, the runner or the target gate run by Node with any options, or any
 * of these inside the bounded probe wrapper. A single test under the wrapper
 * is not a gate.
 * @param {readonly string[]} words
 * @returns {boolean} */
export function gateInvocation(words) {
  const wrapped = boundedCommand(words);
  if (wrapped) return gateInvocation(wrapped);
  if (basename(words[0] ?? "") === "npm") {
    let index = skipOptions(words, 1);
    const action = words[index++] ?? "";
    if (npmTestActions.has(action)) return true;
    if (action !== "run" && action !== "run-script") return false;
    index = skipOptions(words, index);
    return gateScripts.has(words[index] ?? "");
  }
  return (
    nodeScriptArgs(
      words,
      /(?:^|\/)scripts\/(?:test-runner|target-gate)\.mjs$/u,
    ) !== null
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
