import { delimiter } from "node:path";

export function suiteEnvironment(env = process.env, gateContext) {
  // Offline fixture execution omits proxy credentials and unrelated session
  // metadata. Scheduler context names only the current load and diagnostics.
  const names = new Set([
    "PATH",
    "HOME",
    "TMPDIR",
    "TMP",
    "TEMP",
    "SHELL",
    "LANG",
    "TZ",
    "CI",
    "DOTLN_GATE_CHILD",
    "BASH_ENV",
    "ENV",
    "CODEX_HOME",
    "CLAUDE_CODE_EXECPATH",
    "CLAUDE_PID",
    "CLAUDE_EFFORT",
    "SystemRoot",
    "COMSPEC",
    "PATHEXT",
  ]);
  const child = Object.fromEntries(
    Object.entries(env).filter(
      ([name]) =>
        (names.has(name) ||
          /^(?:LC_|NODE_|npm_config_|NPM_CONFIG_|DOTLN_|GIT_|XDG_)/.test(
            name,
          )) &&
        !/(?:^|_)proxy(?:_|$)/i.test(name) &&
        // A harness session injects Git configuration for its own checkouts
        // (safe.directory entries, transport settings). That is invocation
        // metadata; each suite observes its own fixture Git configuration.
        !/^GIT_CONFIG_(?:COUNT|PARAMETERS|KEY_\d+|VALUE_\d+)$/.test(name),
    ),
  );
  child.DOTLN_GATE_CHILD = "1";
  // The stop lineage (WO-044) is runner-owned: the runner ends its own suites
  // on a stop request, and its run ids change every run, so the lineage is
  // not inherited by independently requested fixture gates.
  delete child.DOTLN_GATE_RUNS;
  // Nested npm scripts prepend the same tool directories again. Keep the first
  // occurrence of each exact entry: executable precedence, relative entries,
  // the current-directory entry and paths that may be created later all remain.
  // Repeated failed exec searches are especially costly under a process sandbox.
  if (typeof child.PATH === "string")
    child.PATH = [...new Set(child.PATH.split(delimiter))].join(delimiter);
  // A runner fixture may itself execute under node --test. Its private worker
  // marker would make a nested --test invocation silently omit discovered tests.
  delete child.NODE_TEST_CONTEXT;
  if (gateContext) {
    child.DOTLN_GATE_LOAD_CLASS = gateContext.loadClass;
    child.DOTLN_GATE_CONCURRENCY = String(gateContext.concurrency);
    child.DOTLN_GATE_LOAD_FACTOR = String(gateContext.loadFactor);
    child.DOTLN_GATE_TASK = gateContext.task;
    if (gateContext.peerFile) child.DOTLN_GATE_PEER_FILE = gateContext.peerFile;
    if (gateContext.deadlineLog)
      child.DOTLN_GATE_DEADLINE_LOG = gateContext.deadlineLog;
    // A nested gate's own tag overrides an inherited one (WO-157 item 15).
    if (gateContext.fixtureTag)
      child.DOTLN_GATE_FIXTURE_TAG = gateContext.fixtureTag;
  }
  return child;
}

/** Every declared task must actually execute and pass exactly once. */
export function completeCoverage(table, rows) {
  return (
    rows.length === table.length &&
    new Set(rows.map((row) => row.name)).size === rows.length &&
    table.every((job) =>
      rows.some(
        (row) =>
          row.name === job.name && row.exitCode === 0 && row.executed === true,
      ),
    )
  );
}
