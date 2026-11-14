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
/** The package manager Corepack runs for a word that follows it: Corepack
 * runs the manager it is given, at a version or not, with every later word
 * (`corepack npm@11 test` is `npm test`). Null for any other word, one of
 * Corepack's own commands among them.
 * @param {string | undefined} word @returns {string | null} */
export const corepackManager = (word) =>
  /^(npm|npx|pnpm|pnpx|yarn|yarnpkg)(?:@.+)?$/u.exec(word ?? "")?.[1] ?? null;
/** The words as the package manager behind Corepack is given them, or the
 * words themselves where Corepack is not the program.
 * @param {readonly string[]} words @returns {readonly string[]} */
const behindCorepack = (words) => {
  const manager =
    basename(words[0] ?? "") === "corepack" ? corepackManager(words[1]) : null;
  return manager ? [manager, ...words.slice(2)] : words;
};
// npm's words for running a script, and its flags that take no value. Any
// other flag may take one: npm has more of them than a list here would keep.
const runVerbs = new Set([
  "run",
  "run-script",
  "rum",
  "urn",
  // npm also takes any unique abbreviation of a command or an alias, and
  // the camel-case spelling of a hyphenated one: these are the words npm
  // 11.19.1's own table resolves to `run`, five of them also run as
  // commands. `ru` and `r` are not among them, being short for more than
  // one command.
  "ur",
  "run-",
  "run-s",
  "run-sc",
  "run-scr",
  "run-scri",
  "run-scrip",
  "runS",
  "runSc",
  "runScr",
  "runScri",
  "runScrip",
  "runScript",
]);
// Flags at which npm prints its help or its version and runs no script.
const npmAnswersItself = new Set([
  "--help",
  "-h",
  "-?",
  "-H",
  "--usage",
  "--version",
  "-v",
]);
const plainFlag =
  /^(?:-[sqd]+|--(?:silent|quiet|verbose|if-present|ignore-scripts|foreground-scripts|workspaces|include-workspace-root|json|offline|no-[a-z-]+)|-ws|--[a-z-]+=.*)$/u;
/** The lists of words npm may read as its verb and what follows it. npm
 * reads its own flags from every word before the first separator, wherever
 * a flag stands, and takes the other words there in order. Every word
 * behind the separator is taken as written, so a separator before the verb
 * ends npm's flags and the verb is read behind it. A flag may take the next
 * word as its value: a listed one does, a plain one does not, and any other
 * is read both ways, so there are one or two lists. Null where the program
 * is not npm, or where a flag before the separator has npm print its help
 * or its version instead of running anything. npm behind Corepack is npm.
 * @param {readonly string[]} written
 * @returns {string[][] | null} */
function npmWordReadings(written) {
  const words = behindCorepack(written);
  if (basename(words[0] ?? "") !== "npm") return null;
  const rest = words.slice(1);
  const separator = rest.indexOf("--");
  const before = separator < 0 ? rest : rest.slice(0, separator);
  const behind = separator < 0 ? [] : rest.slice(separator + 1);
  if (before.some((word) => npmAnswersItself.has(word))) return null;
  /** @param {(flag: string) => boolean} takesValue */
  const taken = (takesValue) => {
    const kept = [];
    for (let index = 0; index < before.length; index++) {
      const word = before[index] ?? "";
      if (!word.startsWith("-")) kept.push(word);
      else if (
        takesValue(word) &&
        index + 1 < before.length &&
        !(before[index + 1] ?? "").startsWith("-")
      )
        index++;
    }
    return [...kept, ...behind];
  };
  return [
    ...new Map(
      [
        taken((flag) => valueOptions.has(flag)),
        taken((flag) => valueOptions.has(flag) || !plainFlag.test(flag)),
      ].map((reading) => [reading.join("\0"), reading]),
    ).values(),
  ];
}
/** The argument lists npm may hand a script it runs: in each reading of the
 * line (`npmWordReadings`) whose verb is `run` or one of its aliases and
 * whose next word is the script's name, the words after that name. Null
 * where no reading runs that script.
 * @param {readonly string[]} words @param {string} script
 * @returns {string[][] | null} */
export function npmScriptArgReadings(words, script) {
  const readings = (npmWordReadings(words) ?? [])
    .filter(([verb, name]) => runVerbs.has(verb ?? "") && name === script)
    .map((reading) => reading.slice(2));
  return readings.length ? readings : null;
}
/** Where pnpm's or yarn's own words may begin in a line: every word that is
 * no flag and may still be the first such word, the words before it being
 * flags and, after a flag, what may be that flag's value. However many
 * flags take values, the true first word is among them. Null where the
 * program is neither, alone or behind Corepack.
 * @param {readonly string[]} written
 * @returns {{words: readonly string[], starts: number[]} | null} */
function otherManagerStarts(written) {
  const words = behindCorepack(written);
  if (!["pnpm", "yarn", "yarnpkg"].includes(basename(words[0] ?? "")))
    return null;
  const starts = [];
  for (let index = 1; index < words.length; index++) {
    if ((words[index] ?? "").startsWith("-")) continue;
    starts.push(index);
    // A word after a flag may be the flag's value; one after another word
    // is not, and the manager's own words have begun by then. `workspace
    // <name>` and `workspaces foreach` are followed by a command of the
    // same kind, so the reading goes on past them.
    if (
      !(words[index - 1] ?? "").startsWith("-") &&
      !["workspace", "workspaces", "foreach"].includes(words[index] ?? "") &&
      words[index - 1] !== "workspace"
    )
      break;
  }
  return { words, starts };
}
/** The package scripts pnpm or yarn may run for a line, each with the
 * arguments it is handed. Both run a script by `run` (pnpm also by
 * `run-script`) and by the script's bare name, pnpm runs the test script by
 * `test`, `t` and `tst` and after an install by `install-test` and `it`,
 * and both hand the script every later word. Words before the script's name
 * that begin with a dash are the manager's own flags, and any of them may
 * take the next word as its value, so the line is read from every place its
 * own words may begin (`otherManagerStarts`). The reading is wide on
 * purpose: it is used to refuse a gate and to count a launch, and a word
 * that is one of the manager's own commands names no script the kit has.
 * Null where the program is neither.
 * @param {readonly string[]} written
 * @returns {{script: string, args: string[]}[] | null} */
function otherManagerScripts(written) {
  const read = otherManagerStarts(written);
  if (!read) return null;
  const { words, starts } = read;
  /** The first word at or after a place that is no flag.
   * @param {number} from */
  const next = (from) => {
    let index = from;
    while (index < words.length && (words[index] ?? "").startsWith("-"))
      index++;
    return index;
  };
  return starts.map((start) => {
    const verb = words[start] ?? "";
    // pnpm's command that installs and then tests hands the runner
    // nothing.
    if (["install-test", "it"].includes(verb))
      return { script: "test", args: [] };
    const named = ["run", "run-script"].includes(verb)
      ? next(start + 1)
      : start;
    const script = ["t", "tst"].includes(words[named] ?? "")
      ? "test"
      : (words[named] ?? "");
    const args = words.slice(named + 1);
    return { script, args: args[0] === "--" ? args.slice(1) : args };
  });
}
/** The commands pnpm or yarn may run for a line as a program and not as a
 * script: `yarn node …`, `pnpm node …`, either running npm or the other,
 * and `exec`, `run` or `run-script` before any of them, since `run` runs a
 * program where no script has the name. Each is the words from the program
 * on, to be read as if it ran alone. Empty for any other line.
 * @param {readonly string[]} written
 * @returns {(readonly string[])[]} */
export function managerRuns(written) {
  const read = otherManagerStarts(written);
  if (!read) return [];
  const programs = [
    "node",
    "npm",
    "npx",
    "pnpm",
    "yarn",
    "yarnpkg",
    "corepack",
  ];
  /** The first word at or after a place that is no flag.
   * @param {number} from */
  const next = (from) => {
    let index = from;
    while (
      index < read.words.length &&
      (read.words[index] ?? "").startsWith("-")
    )
      index++;
    return index;
  };
  return read.starts
    .map((start) =>
      ["exec", "run", "run-script"].includes(read.words[start] ?? "")
        ? next(start + 1)
        : start,
    )
    .filter((start) => programs.includes(basename(read.words[start] ?? "")))
    .map((start) => read.words.slice(start));
}
/** The argument lists a package script may be handed by a package manager:
 * npm's readings of the line, or pnpm's and yarn's. Null where no reading
 * runs that script.
 * @param {readonly string[]} words @param {string} script
 * @returns {string[][] | null} */
export function packageScriptArgReadings(words, script) {
  const other = (otherManagerScripts(words) ?? [])
    .filter((reading) => reading.script === script)
    .map((reading) => reading.args);
  return npmScriptArgReadings(words, script) ?? (other.length ? other : null);
}
/** The arguments Node's own script runner hands a package script: `node
 * --run <script>` or `--run=<script>` runs it with the words behind the
 * first separator and with none where there is no separator. Null where the
 * words run no such script.
 * @param {readonly string[]} words @param {string} script
 * @returns {string[] | null} */
export function nodeRunScriptArgs(words, script) {
  if (basename(words[0] ?? "") !== "node" && words[0] !== process.execPath)
    return null;
  const separator = words.indexOf("--");
  const before = separator < 0 ? words : words.slice(0, separator);
  const runs = before.some(
    (word, index) =>
      word === `--run=${script}` ||
      (word === "--run" && before[index + 1] === script),
  );
  return runs ? (separator < 0 ? [] : words.slice(separator + 1)) : null;
}
/** The arguments a run of the test runner is given, by any spelling that
 * starts it: npm's test command under any of its names, the `test` or
 * `test:full` script under npm's `run`, pnpm, yarn or Node's own script
 * runner, and the runner run by Node. npm's commands that install and then
 * test pass the runner nothing. Null where the words start no such run.
 * @param {readonly string[]} words
 * @returns {readonly string[] | null} */
export function testSelectionArgs(words) {
  for (const [verb = "", ...rest] of npmWordReadings(words) ?? []) {
    if (npmTestVerbs.has(verb)) return rest;
    if (npmInstallTestVerbs.has(verb)) return [];
    if (runVerbs.has(verb) && ["test", "test:full"].includes(rest[0] ?? ""))
      return rest.slice(1);
  }
  for (const script of ["test", "test:full"]) {
    const ran =
      nodeRunScriptArgs(words, script) ??
      otherManagerScripts(words)?.find((reading) => reading.script === script)
        ?.args;
    if (ran) return ran;
  }
  for (const inner of managerRuns(words)) {
    const ran = testSelectionArgs(inner);
    if (ran) return ran;
  }
  return nodeScriptArgs(words, /(?:^|\/)scripts\/test-runner\.mjs$/u);
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
// The words npm 11.19.1's own table resolves to a command that runs the
// test script: `test` with its aliases and unique abbreviations, and the
// two commands that install and then test, each with its aliases, its
// abbreviations and their camel-case spellings.
const npmTestVerbs = new Set(["test", "tes", "tst", "ts", "t"]);
const npmInstallTestVerbs = new Set([
  "install-test",
  "install-tes",
  "install-te",
  "install-t",
  "installTest",
  "installTes",
  "installTe",
  "installT",
  "it",
  "install-ci-test",
  "install-ci-tes",
  "install-ci-te",
  "install-ci-t",
  "install-ci-",
  "install-ci",
  "installCiTest",
  "installCiTes",
  "installCiTe",
  "installCiT",
  "installCi",
  "clean-install-test",
  "clean-install-tes",
  "clean-install-te",
  "clean-install-t",
  "clean-install-",
  "cleanInstallTest",
  "cleanInstallTes",
  "cleanInstallTe",
  "cleanInstallT",
  "cit",
  "sit",
  "si",
]);
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
/** What follows `bounded` in each reading of an invocation of the bounded
 * probe wrapper: the harness script run by Node, by npm's `run` under any
 * of its spellings, by pnpm or yarn, or by Node's own script runner. Empty
 * where the words are no such invocation.
 * @param {readonly string[]} words
 * @returns {(readonly string[])[]} */
export function boundedArgReadings(words) {
  const direct = nodeScriptArgs(
    words,
    /(?:^|\/)scripts\/harness(?:-entry)?\.mjs$/u,
  );
  const ran = nodeRunScriptArgs(words, "harness");
  /** @type {(readonly string[])[]} */
  const readings = [
    ...(direct ? [direct] : []),
    ...(ran ? [ran] : []),
    ...(packageScriptArgReadings(words, "harness") ?? []),
  ];
  return [
    ...readings
      .filter((rest) => rest[0] === "bounded")
      .map((rest) => rest.slice(1)),
    // What pnpm or yarn runs for the line as a program is read the same.
    ...managerRuns(words).flatMap((inner) => boundedArgReadings(inner)),
  ];
}
/** The commands the bounded probe wrapper may run, one for each reading of
 * the invocation that names one behind the wrapper's separator.
 * @param {readonly string[]} words
 * @returns {(readonly string[])[]} */
const boundedCommands = (words) =>
  boundedArgReadings(words).flatMap((rest) => {
    const separator = rest.indexOf("--");
    return separator === -1 ? [] : [rest.slice(separator + 1)];
  });
/** The command the bounded probe wrapper runs, when this invocation is the
 * wrapper (`node scripts/harness.mjs bounded -- …`, `npm run harness --
 * bounded -- …` or `node --run harness -- bounded -- …`), so the wrapped
 * command is judged as if it ran alone.
 * @param {readonly string[]} words
 * @returns {readonly string[] | null} */
export function boundedCommand(words) {
  return boundedCommands(words)[0] ?? null;
}
/** Whether one invocation starts a test-runner gate in any form: npm's
 * test command under any of its names or arguments, npm's commands that
 * install and then test, a package script that runs the runner under npm's
 * `run`, pnpm, yarn or Node's own script runner, the runner or the target
 * gate run by Node with any options, or any of these inside the bounded
 * probe wrapper. Where a line reads two ways, a gate under either is a
 * gate. A single test under the wrapper is not a gate.
 * @param {readonly string[]} words
 * @returns {boolean} */
export function gateInvocation(words) {
  const wrapped = boundedCommands(words);
  if (wrapped.length) return wrapped.some((inner) => gateInvocation(inner));
  const npm = npmWordReadings(words);
  if (npm)
    return npm.some(
      ([verb = "", name = ""]) =>
        npmTestVerbs.has(verb) ||
        npmInstallTestVerbs.has(verb) ||
        (runVerbs.has(verb) && gateScripts.has(name)),
    );
  if (
    otherManagerScripts(words)?.some(({ script }) => gateScripts.has(script)) ||
    managerRuns(words).some((inner) => gateInvocation(inner))
  )
    return true;
  return (
    [...gateScripts].some(
      (script) => nodeRunScriptArgs(words, script) !== null,
    ) ||
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
