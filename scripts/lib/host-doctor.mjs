// The host report: every assumption the kit makes of the machine it runs on,
// each with what was observed, whether it is met, what depends on it and the
// remedy. It reads and refuses nothing. It runs before any install and below
// both floors, so it imports Node's own modules and build-free modules of
// this library only, and it judges with the functions the kit's own checks
// call (the floors, the compiler, the per-lane memory comparison over the
// host's own lane record, the publish helpers' reading of the origin), so
// the report, the host task and the helpers cannot disagree. Its output is
// generic: versions, counts, sizes and yes or no, and never a host name, a
// user name, a URL or an absolute path, so it can be pasted from a managed
// machine.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import {
  availableParallelism,
  homedir,
  hostname,
  totalmem,
  userInfo,
} from "node:os";
import { join } from "node:path";
import { TOOL_ROOT } from "./config.mjs";
import { readHostFeatures } from "./features.mjs";
import { execGit } from "./git.mjs";
import { resolveGitHubPushTarget } from "./github-repository.mjs";
import {
  compilerRemedy,
  judgeLaneMemory,
  memoryBudgets,
  nativeCompiler,
  recordedHostLaneCapacity,
  requiredTaskPeakRss,
  taskLauncher,
} from "./host-resources.mjs";
import {
  judgeRunningGit,
  judgeRunningNode,
  readGitVersion,
} from "./node-engines.mjs";
import { createScratchRoot, removeTemporaryPath } from "./temporary-roots.mjs";

/** The agent CLI of each host an instance can elect, by the feature that
 * elects it. Claude Code is every instance's host. The report looks for no
 * other agent CLI. */
const HOST_CLIS = Object.freeze([
  { host: "Claude Code", command: "claude", feature: null },
  { host: "Codex", command: "codex", feature: "host-codex" },
  { host: "Copilot", command: "copilot", feature: "host-copilot" },
]);

const firstLine = (text) => String(text).split("\n")[0].trim();
const quiet = {
  encoding: "utf8",
  timeout: 10_000,
  stdio: ["ignore", "pipe", "ignore"],
};

/** A name the output must never carry, or null where the host gives none
 * (an account with no entry in the password database has no user name to
 * withhold, and the report still prints). */
const withheld = (read) => {
  try {
    return read();
  } catch {
    return null;
  }
};

/** A probe's answer, or the word that it could not be read. */
const attempt = (probe) => {
  try {
    return { value: probe() };
  } catch (error) {
    return { error };
  }
};

/** The running host's facts, each a value or a function the report calls
 * once. A test passes its own. */
export function hostFacts(root = TOOL_ROOT) {
  const scratch = (use) => {
    const directory = createScratchRoot(join(homeTemporary(), "dotln-doctor-"));
    try {
      return use(directory);
    } finally {
      removeTemporaryPath(directory, { recursive: true, force: true });
    }
  };
  // Every Git read goes through the library's one spawn of Git.
  const git = (args) => firstLine(execGit(["-C", root, ...args], quiet));
  return {
    root,
    nodeVersion: process.version,
    gitVersion: readGitVersion(),
    platform: process.platform,
    // WSL reports Linux and names its kernel's maker; the second
    // generation's kernel carries its own tag, and the first's does not.
    wsl: wslGeneration(
      process.platform === "linux" && existsSync("/proc/version")
        ? readFileSync("/proc/version", "utf8")
        : "",
    ),
    processors: availableParallelism(),
    memoryBytes: totalmem(),
    /** The lanes the host's record gives a gate, which is what the host task
     * sizes a lane by; the count the processors give where no record is
     * written yet. Throws where the record cannot be read. */
    laneCapacity: () => recordedHostLaneCapacity(),
    /** Compiles the lock helper into a directory of its own; throws where
     * the compiler cannot be found or run. */
    compile: () =>
      scratch((directory) => {
        taskLauncher(directory, { compiler: nativeCompiler });
      }),
    /** Makes one symbolic link in a directory of its own; throws where the
     * account or the file system refuses. */
    symlink: () =>
      scratch((directory) => {
        writeFileSync(join(directory, "target"), "");
        symlinkSync("target", join(directory, "link"));
      }),
    /** A Git configuration value as this clone resolves it: null where the
     * key is unset, and the empty string for a key written with no value,
     * which Git reads as true. */
    gitConfig: (key) => {
      try {
        return git(["config", "--get", key]);
      } catch {
        return null;
      }
    },
    /** The `text` and `eol` attributes Git resolves for each tracked file
     * of the kit: the files the kit's manifest lists where this root is an
     * instance's, and every tracked file where it has no manifest. */
    lineAttributes: () => {
      const wide = { ...quiet, maxBuffer: 2 ** 27 };
      let listed = null;
      try {
        listed = new Set(
          JSON.parse(
            readFileSync(join(root, "KIT-MANIFEST.json"), "utf8"),
          ).files.map(({ path }) => path),
        );
      } catch {
        /* No manifest that can be read: every tracked file is judged. */
      }
      const tracked = execGit(["-C", root, "ls-files", "-z"], wide)
        .split("\0")
        .filter((path) => path && (!listed || listed.has(path)));
      if (!tracked.length) return [];
      const fields = execGit(
        ["-C", root, "check-attr", "-z", "--stdin", "text", "eol"],
        {
          ...wide,
          input: `${tracked.join("\0")}\0`,
          stdio: ["pipe", "pipe", "ignore"],
        },
      ).split("\0");
      const files = new Map();
      for (let index = 0; index + 2 < fields.length; index += 3)
        files.set(fields[index], {
          ...files.get(fields[index]),
          [fields[index + 1]]: fields[index + 2],
        });
      return [...files.values()];
    },
    /** The origin's URL, or null where the clone has none. It is judged and
     * never printed. */
    originUrl: () => {
      try {
        return git(["remote", "get-url", "origin"]) || null;
      } catch {
        return null;
      }
    },
    /** The origin as the publish helpers judge it: one target that fetch
     * and push both name. Throws where they would refuse. */
    pushTarget: () => resolveGitHubPushTarget(root),
    /** The first line a tool prints for `--version`, or null where the tool
     * is not on the path. Throws where the tool is there and its version
     * cannot be read (it exits with an error, or does not answer): that is
     * a fact the report could not read, never an absent tool. */
    tool: (command) => {
      try {
        return firstLine(execFileSync(command, ["--version"], quiet));
      } catch (error) {
        if (error?.code === "ENOENT") return null;
        throw error;
      }
    },
    electedHosts: () => readHostFeatures(root),
    // What the output must never carry.
    hostName: withheld(hostname),
    userName: withheld(() => userInfo().username),
    homeDirectory: withheld(homedir),
  };
}
/** Which generation of WSL a Linux kernel's version line names, or null on
 * a kernel that is not Microsoft's. */
export const wslGeneration = (kernel) =>
  /microsoft/iu.test(kernel)
    ? /wsl2|microsoft-standard/iu.test(kernel)
      ? 2
      : 1
    : null;
/** How Git reads a `core.autocrlf` value: its boolean spellings in any
 * case, a key with no value, a number, or `input`. */
export const autocrlfWord = (raw) => {
  if (raw === null || raw === undefined) return "unset";
  const value = String(raw).trim().toLowerCase();
  if (["", "true", "yes", "on"].includes(value)) return "true";
  if (["false", "no", "off"].includes(value)) return "false";
  if (/^[+-]?\d+[kmg]?$/u.test(value))
    return /[1-9]/u.test(value) ? "true" : "false";
  return value === "input" ? "input" : "of a value Git does not read";
};
// The system's temporary directory, read where the helper reads it.
const homeTemporary = () => process.env.TMPDIR || "/tmp";

const bytes = (count) => `${(count / 2 ** 30).toFixed(1)} GiB`;
const version = (line) => /\d+(?:\.\d+)+/u.exec(line ?? "")?.[0] ?? null;
/** What a read of a tool's version found, in the report's words. */
const found = (tool) =>
  tool.error
    ? "found, and its version could not be read"
    : tool.value === null
      ? "not found"
      : `found${version(tool.value) ? ` (${version(tool.value)})` : ""}`;

/** The rows: one for each assumption, with its observed value, its verdict
 * (`met`, `unmet`, `unknown` where the fact could not be read, or `reported`
 * where nothing is judged), the behavior that depends on it and the remedy. */
export function hostReport(root = TOOL_ROOT, facts = hostFacts(root)) {
  const rows = [];
  const row = (id, assumption, observed, verdict, dependsOn, remedy) =>
    rows.push({ id, assumption, observed, verdict, dependsOn, remedy });
  const judged = (admitted) => (admitted ? "met" : "unmet");

  const node = judgeRunningNode(facts.nodeVersion, root);
  row(
    "node",
    "Node is inside the range package.json engines.node declares",
    `Node ${facts.nodeVersion}`,
    judged(node.admitted),
    "every script of the kit, the gate and the hooks",
    node.admitted ? "none" : node.message,
  );
  const git = judgeRunningGit(root, facts.gitVersion);
  row(
    "git",
    "Git is at or above the floor package.json engines.git declares",
    facts.gitVersion === null
      ? "Git did not run"
      : `Git ${version(facts.gitVersion) ?? "of an unread version"}`,
    judged(git.admitted),
    "worktrees, updates and every Git read the scripts make",
    // The judge quotes a version line it cannot read; the report does not.
    git.admitted
      ? "none"
      : typeof facts.gitVersion === "string"
        ? git.message.replaceAll(
            JSON.stringify(facts.gitVersion),
            "a line this report does not repeat",
          )
        : git.message,
  );

  const compiled = attempt(facts.compile);
  // The compiler was reached where the failure is the helpers' own compiler
  // error. Any other error stopped the build before it (a Node below the
  // floor lacks what the build reads its source by), and says nothing of
  // the compiler.
  const compilerFailed =
    compiled.error &&
    /^The native compiler /u.test(String(compiled.error.message));
  row(
    "compiler",
    "a C compiler builds the kit's host helpers",
    !compiled.error
      ? "the lock helper compiled"
      : compilerFailed
        ? "the lock helper did not compile"
        : "the build stopped before the compiler ran",
    !compiled.error ? "met" : compilerFailed ? "unmet" : "unknown",
    "the lock every gate task starts through, and the gate's memory reader",
    !compiled.error
      ? "none"
      : compilerFailed
        ? compilerRemedy(facts.platform)
        : "meet the rows above first (a Node below the floor stops this build), then run this again",
  );

  const capacity = attempt(facts.laneCapacity);
  const lanes = attempt(() => {
    if (capacity.error) throw capacity.error;
    const limits = memoryBudgets(root, {
      capacity: capacity.value,
      physicalBytes: facts.memoryBytes,
    });
    return {
      limits,
      ...judgeLaneMemory({
        limits,
        requiredPeakBytes: requiredTaskPeakRss(root),
        physicalBytes: facts.memoryBytes,
      }),
    };
  });
  row(
    "lane-memory",
    "one gate lane's memory budget covers the largest task this root's gate carries",
    capacity.error
      ? "the host's lane record could not be read"
      : lanes.error
        ? "the budget could not be read"
        : `${facts.processors} logical processors, ${bytes(facts.memoryBytes)} of memory, ${lanes.value.limits.hostLanes} lanes of ${bytes(lanes.value.limits.taskBytes)} each`,
    lanes.error ? "unknown" : judged(!lanes.value.underBudget),
    "the host task of every gate, which refuses a lane too small for its heaviest task",
    capacity.error
      ? 'stop every gate on this host, repair the host\'s lane-capacity.json to {"capacity": N} with N from one through eight, then run this again'
      : lanes.error
        ? "repair docs/control/budgets.json, then run this again"
        : lanes.value.underBudget
          ? lanes.value.remedy
          : "none",
  );

  const linked = attempt(facts.symlink);
  row(
    "symlinks",
    "this account can create a symbolic link",
    linked.error
      ? "a symbolic link could not be created"
      : "a symbolic link was created",
    judged(!linked.error),
    "the workspace links an install makes and the instruction file's second name",
    linked.error
      ? facts.platform === "win32"
        ? "native Windows is unsupported: run the kit under WSL2"
        : "use a file system and an account that permit symbolic links"
      : "none",
  );

  // A file is converted where its attributes say so (`text` set, auto or
  // input, or an `eol` with `text` unspecified), and, where they say
  // nothing, wherever core.autocrlf is true. `-text` converts nothing.
  // core.autocrlf input writes no file differently on checkout: on add it
  // turns a carriage return and line feed into the line feed every kit
  // file already holds, so the bytes the verification hashes are never
  // changed by it, and the row says what it does.
  const conversion = attempt(() => {
    const autocrlf = autocrlfWord(facts.gitConfig("core.autocrlf"));
    const files = facts.lineAttributes();
    const silent = (file) =>
      file.text !== "unset" && !["set", "auto", "input"].includes(file.text);
    const declared = (file) =>
      ["set", "auto", "input"].includes(file.text) ||
      (silent(file) && ["lf", "crlf"].includes(file.eol));
    return {
      autocrlf,
      files: files.length,
      open: files.filter(
        (file) => declared(file) || (autocrlf === "true" && silent(file)),
      ).length,
    };
  });
  const converts = !conversion.error && conversion.value.open > 0;
  row(
    "line-endings",
    "Git converts no line ending of a kit file in this clone",
    conversion.error
      ? "Git's configuration could not be read"
      : `core.autocrlf ${conversion.value.autocrlf}${conversion.value.autocrlf === "input" ? " (Git then converts on add alone, toward the line endings the kit ships)" : ""}; ${conversion.value.open} of ${conversion.value.files} tracked kit files open to conversion`,
    conversion.error ? "unknown" : judged(!converts),
    "the kit's verification, which hashes its files' bytes",
    converts
      ? "keep the kit's .gitattributes line (* -text) and give no kit file a text or eol attribute under it, or run git config core.autocrlf false in this clone; then git add --renormalize ."
      : "none",
  );

  const origin = attempt(facts.originUrl);
  // The helpers' own judgment: one target, the same for fetch and push.
  const forge = attempt(facts.pushTarget);
  // The forge's tool: found with its version, not found, or found and not
  // answering for its version, which leaves the row unknown where nothing
  // else of it is unmet.
  const gh = attempt(() => facts.tool("gh"));
  row(
    "forge",
    "the origin is a forge the publish helpers accept, and the forge's tool is installed",
    `${origin.error || origin.value === null ? "no origin" : forge.error ? "an origin that is not one HOST/OWNER/REPO target for fetch and push" : "a GitHub-form origin (HOST/OWNER/REPO), one target for fetch and push"}; gh ${found(gh)}`,
    origin.error || origin.value === null
      ? "unknown"
      : forge.error || (!gh.error && gh.value === null)
        ? "unmet"
        : gh.error
          ? "unknown"
          : "met",
    "final review's push and pull request, release close's tag and Release, and an update's publish",
    origin.error || origin.value === null
      ? "add the private repository as origin before the first order is published"
      : forge.error
        ? "point origin at one GitHub HOST/OWNER/REPO for both fetch and push"
        : gh.error
          ? "run gh --version to see why it does not answer, then run this again"
          : gh.value === null
            ? "install the GitHub CLI (gh) and sign in"
            : "none",
  );

  const platform =
    facts.platform === "darwin"
      ? ["macOS, which the kit is exercised on", "met", "none"]
      : facts.platform === "linux"
        ? facts.wsl === 1
          ? [
              "WSL1, which the kit is not designed for",
              "unmet",
              "convert the distribution to WSL2 (wsl --set-version <distribution> 2)",
            ]
          : [
              `${facts.wsl ? "WSL2" : "Linux"}, which the kit is designed for and not exercised on`,
              "met",
              "none; report what fails here, since no gate has run on this platform",
            ]
        : facts.platform === "win32"
          ? [
              "native Windows, which is unsupported",
              "unmet",
              "run the kit under WSL2",
            ]
          : [
              // The platform was read: it is one the kit does not run on.
              `${facts.platform}, which the kit has not been designed for`,
              "unmet",
              "use macOS, Linux or WSL2",
            ];
  row(
    "platform",
    "the platform is one the kit runs on",
    platform[0],
    platform[1],
    "every command",
    platform[2],
  );

  // Which hosts the instance has on is a fact like the others: where it
  // cannot be read the report says so, and looks for no elected host's CLI,
  // since a read that failed says neither that a host is on nor that it is
  // off.
  const elected = attempt(facts.electedHosts);
  if (elected.error)
    row(
      "host-elections",
      "the hosts this instance has on can be read",
      "the instance's configuration could not be read",
      "unknown",
      "which agent CLIs this report looks for beside Claude Code's",
      "repair dotln.config.json so the instance's configuration loads, then run this again",
    );
  for (const cli of HOST_CLIS) {
    if (cli.feature && !(elected.value?.[cli.feature] === true)) continue;
    const tool = attempt(() => facts.tool(cli.command));
    row(
      `agent-${cli.command}`,
      `the agent CLI of ${cli.host}, ${cli.feature ? "a host this instance has on" : "every instance's host"}`,
      found(tool),
      "reported",
      "sessions on that host; reported and never judged",
      tool.error
        ? `run ${cli.command} --version to see why it does not answer`
        : tool.value === null
          ? `install ${cli.host}'s CLI if sessions are to run on it`
          : "none",
    );
  }
  return rows.map((entry) => scrub(entry, facts));
}

/** No row carries the host's name, the user's, the home directory, the
 * origin's URL or any absolute path, whatever a probe's own words held. The
 * rows print the report's own words, versions and counts; this is the
 * second guard, for a fact that reaches a row as the host gave it. A name
 * is withheld in any case and as a whole word, so one of two letters is
 * withheld too and no longer word is cut by it. A path's segment and an
 * address's parts are whatever is not white space: a directory or an
 * account may be named in any script, so no class of letters bounds them.
 * A path with a space in a name is withheld up to that space. */
function scrub(entry, facts) {
  const names = [facts.hostName, facts.userName]
    .filter((text) => typeof text === "string" && text.length > 1)
    .sort((a, b) => b.length - a.length)
    .map(
      (name) =>
        new RegExp(
          `(?<![\\p{L}\\p{N}])${name.replace(/[\\^$.*+?()[\]{}|]/gu, (mark) => `\\${mark}`)}(?![\\p{L}\\p{N}])`,
          "giu",
        ),
    );
  const home =
    typeof facts.homeDirectory === "string" && facts.homeDirectory.length > 1
      ? facts.homeDirectory
      : null;
  const clean = (text) => {
    let out = String(text);
    if (home) out = out.replaceAll(home, "<withheld>");
    for (const name of names) out = out.replace(name, "<withheld>");
    return (
      out
        .replace(/\b[a-z][a-z0-9+.-]*:\/\/\S+/giu, "<a URL>")
        // An scp-style remote (user@host:path) and any other user@host.
        .replace(/[^\s@]+@[^\s@]+/gu, "<an address>")
        // An IPv6 literal, bracketed or bare.
        .replace(
          /\[?(?:[0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}\]?(?![\w:])/giu,
          "<an address>",
        )
        // A UNC path, a POSIX absolute path of any depth, a drive path. A
        // slash opens an absolute path where no letter, digit, underscore,
        // period, hyphen or opening angle bracket stands before it:
        // a relative path and `HOST/OWNER/REPO` are the report's own words.
        .replace(/\\\\[^\s\\]+(?:\\\S*)?/gu, "<a path>")
        .replace(/(?<![\p{L}\p{N}_.<-])(?:\/[^\s/]+)+\/?/gu, "<a path>")
        .replace(/\b[A-Za-z]:\\\S*/gu, "<a path>")
    );
  };
  // A row's identity and its judgment are the report's own words, which the
  // exit status and the counts read: no name of this host can rewrite them.
  return Object.fromEntries(
    Object.entries(entry).map(([key, value]) => [
      key,
      ["id", "verdict"].includes(key) ? value : clean(value),
    ]),
  );
}

/** The exit code a report asks for: 1 where a row is unmet. An unknown or a
 * reported row changes nothing. */
export const reportExitCode = (rows) =>
  rows.some((entry) => entry.verdict === "unmet") ? 1 : 0;

/** The report as a table an operator can paste. */
export function renderHostReport(rows) {
  const cell = (text) => String(text).replaceAll("|", "\\|");
  return [
    "DotLn host report: what the kit assumes of this host. It reads and refuses nothing.",
    "",
    "| Assumption | Observed | Verdict | What depends on it | Remedy |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map(
      (entry) =>
        `| ${cell(entry.assumption)} | ${cell(entry.observed)} | ${entry.verdict} | ${cell(entry.dependsOn)} | ${cell(entry.remedy)} |`,
    ),
    "",
    `${rows.filter((entry) => entry.verdict === "unmet").length} unmet, ${rows.filter((entry) => entry.verdict === "unknown").length} unknown, of ${rows.length} rows.`,
  ].join("\n");
}
