import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import {
  docPath,
  docRelative,
  loadConfig,
  targetDocRelative,
} from "./config.mjs";
import { exportSiblings, readDeclaration } from "./siblings.mjs";
import {
  porcelainEntries,
  porcelainEntryName,
  runGit,
  runGitPathList,
  shellQuote,
} from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";

export const targetRegistryPath = (launchpad) =>
  docPath(launchpad, "control", "local/target-worktrees.json");
export const cloneMapPath = (launchpad) =>
  docPath(launchpad, "control", "local/repository-clones.json");
const targetStartsPath = (launchpad) =>
  docPath(launchpad, "control", "local/target-starts.json");

// Physical pwd resolves directory aliases that realpath can retain, including
// volume aliases. Selection accepts alternate spellings of the same launchpad.
export const directoryIdentity = (directory) => {
  try {
    return execFileSync("/bin/pwd", ["-P"], {
      cwd: directory,
      encoding: "utf8",
      timeout: 5_000,
    }).replace(/\n$/u, "");
  } catch {
    throw new Error(`directory is unreadable: ${directory}`);
  }
};

// Creation still requires the source-change guard's exact directory spelling
// before checking containment or creating any worktree.
export const physicalDirectory = (directory) => {
  try {
    if (
      resolve(directory) === directory &&
      realpathSync.native(directory) === directory &&
      lstatSync(directory).isDirectory() &&
      directoryIdentity(directory) === directory
    )
      return directory;
  } catch {
    throw new Error(`directory is unreadable: ${directory}`);
  }
  throw new Error(`spelling differs from filesystem identity: ${directory}`);
};

const readMap = (file) => {
  if (!existsSync(file)) return {};
  if (!lstatSync(file).isFile() || lstatSync(file).isSymbolicLink())
    throw new Error(`local registry is not a regular file: ${file}`);
  const bytes = readFileSync(file, "utf8");
  let value;
  try {
    value = JSON.parse(bytes);
  } catch {
    throw new Error(`invalid local registry: ${file}`);
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`invalid local registry: ${file}`);
  return value;
};
const writeMap = (root, file, value) => {
  let ancestor = dirname(file);
  while (!existsSync(ancestor)) ancestor = dirname(ancestor);
  physicalDirectory(ancestor);
  runGit(root, ["check-ignore", "--quiet", "--no-index", file]);
  if (runGit(root, ["ls-files", "--", file]))
    throw new Error(`local registry must not be tracked: ${file}`);
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, {
    flag: "wx",
    mode: 0o600,
  });
  renameSync(temporary, file);
};

const operationPath = (root, kind, key) => {
  if (!/^(records|planning)$/u.test(kind) || !/^[a-zA-Z0-9-]+$/u.test(key))
    throw new Error("invalid target operation receipt key");
  return docPath(
    root,
    "control",
    "local/target-operations",
    kind,
    `${key}.json`,
  );
};
export const readTargetOperation = (root, kind, key) => {
  const file = operationPath(root, kind, key);
  return existsSync(file) ? readMap(file) : undefined;
};
export const recordTargetOperation = (root, kind, key, value) =>
  writeMap(root, operationPath(root, kind, key), value);
export const forgetTargetOperation = (root, kind, key) => {
  const file = operationPath(root, kind, key);
  if (existsSync(file)) {
    readMap(file);
    rmSync(file);
  }
};
/** The launchpad files a target order's records commit carries: the order,
 * its decisions file and each report its events record, at the path a
 * recorded correction moved it to. It lives here, not in target-records.mjs,
 * so resume can judge an unfinished removal without loading that module and
 * the outward lint it imports. */
export const targetRecordSources = (
  root,
  state,
  events,
  recordedRepository,
) => {
  const repository =
    recordedRepository ?? loadConfig(root).repositories[state.repositoryId];
  const reports = events
    .map((event) => ({
      ...event,
      reportPath:
        (state.corrections ?? [])
          .filter(
            (correction) =>
              correction.subject.type === event.type &&
              correction.subject.reportPath === event.reportPath &&
              correction.fields.reportPath !== undefined,
          )
          .at(-1)?.fields.reportPath ?? event.reportPath,
    }))
    .filter((event) =>
      ["VerificationCompleted", "FinalReviewCompleted"].includes(event.type),
    );
  const rows = [
    {
      kind: "order",
      source: state.workOrderPath,
      path: targetDocRelative(
        repository,
        "workOrders",
        basename(state.workOrderPath),
      ),
    },
    {
      kind: "decisions",
      source: docRelative(root, "evidence", state.workOrderId, "decisions.md"),
      path: targetDocRelative(
        repository,
        "evidence",
        state.workOrderId,
        "decisions.md",
      ),
    },
    ...reports.map((event) => ({
      kind:
        event.type === "VerificationCompleted"
          ? "verification"
          : "final-review",
      source: event.reportPath,
      expectedHash: event.reportHash,
      path: targetDocRelative(
        repository,
        event.type === "VerificationCompleted"
          ? "verifications"
          : "finalReviews",
        state.workOrderId,
        basename(event.reportPath),
      ),
    })),
  ];
  const unique = new Map();
  for (const row of rows) {
    if (
      unique.has(row.path) &&
      unique.get(row.path).expectedHash !== row.expectedHash
    )
      throw new Error(
        `target records refused: ${row.source}: reports disagree on the recorded hash`,
      );
    unique.set(row.path, row);
  }
  return [...unique.values()];
};

/** Once its event folds, the records action still owes a removal while its
 * saved receipt or a moved source (every record but the order's file) is
 * present; only a rerun of the action finishes that removal. */
export const targetRecordsUnfinished = (root, state, events) =>
  existsSync(operationPath(root, "records", state.workOrderId)) ||
  (Boolean(loadConfig(root).repositories[state.repositoryId]) &&
    targetRecordSources(root, state, events).some((row) => {
      if (row.kind === "order") return false;
      // This check reports and never throws on local state: a source it
      // cannot inspect counts as retained, so the rerun reports it.
      try {
        return movedSourceStat(join(root, row.source)) !== undefined;
      } catch {
        return true;
      }
    }));

/** A moved source's lstat, or undefined when it cannot be on disk: no entry,
 * or a parent that is not a directory. Any other entry, a directory or a
 * link among them, is returned, and the removal retains it. */
export const movedSourceStat = (path) => {
  try {
    return lstatSync(path, { throwIfNoEntry: false });
  } catch (error) {
    if (error.code === "ENOTDIR") return undefined;
    throw error;
  }
};

/** A launchpad script in the form the start handoff prints: it runs from a
 * target worktree, where `npm run` would read the target's package.json.
 * A remedy or briefing command is copy-paste runnable from the target worktree
 * and therefore carries the launchpad's absolute path: the one stated
 * exception to the rule that a refusal names no absolute path. */
export const launchpadInvocation = (launchpad, script) =>
  `DOTLN_LAUNCHPAD=${shellQuote(launchpad)} node ${shellQuote(join(launchpad, `scripts/${script}.mjs`))}`;
/** The target gate runner's command. The runner's own path selects its
 * launchpad (findLaunchpad falls back to the script's location), so it needs
 * no DOTLN_LAUNCHPAD; like launchpadInvocation it carries the absolute path. */
export const targetGateCommand = (launchpad, workOrderId, selection) =>
  `node ${shellQuote(join(launchpad, "scripts/target-gate.mjs"))} ${workOrderId}${selection === "review" ? " --review" : ""}`;
const gitTopLevel = (clone) => {
  physicalDirectory(clone);
  if (
    runGit(clone, ["rev-parse", "--show-toplevel"], {
      onFailure: () => undefined,
    }) !== clone
  )
    throw new Error(`not a Git top level: ${clone}`);
  return clone;
};

/** The clone record lives in the main checkout's ignored map, while the
 * registration that declares the id may still be on an order branch: the id
 * is accepted when the main checkout or the running checkout declares it. */
export const recordRepositoryClone = (
  launchpad,
  id,
  clone,
  { declaredIn } = {},
) => {
  const declares = (root) =>
    Object.hasOwn(loadConfig(root).repositories, id) ||
    exportSiblings(readDeclaration(root)).some((entry) => entry.id === id);
  if (
    !declares(launchpad) &&
    !(
      declaredIn &&
      realpathSync(declaredIn) !== realpathSync(launchpad) &&
      declares(declaredIn)
    )
  )
    throw new Error(`unknown repository id ${JSON.stringify(id)}`);
  gitTopLevel(clone);
  const file = cloneMapPath(launchpad);
  writeMap(launchpad, file, { ...readMap(file), [id]: clone });
};

export const recordedRepositoryClone = (launchpad, id) =>
  readMap(cloneMapPath(launchpad))[id];

export const resolveTargetStart = (launchpad, id) => {
  try {
    const repository = loadConfig(launchpad).repositories[id];
    if (!repository) throw new Error("unknown repository id");
    const clone = readMap(cloneMapPath(launchpad))[id];
    if (typeof clone !== "string") throw new Error("no local clone recorded");
    gitTopLevel(clone);
    const parent = physicalDirectory(
      resolve(launchpad, repository.worktreeParent),
    );
    return { clone, parent, repository };
  } catch (error) {
    throw new Error(`repository ${id}: ${error.message}`);
  }
};

export const targetStartPlan = (
  launchpad,
  declaration,
  workOrderId,
  { recovery = false } = {},
) => {
  const { clone, parent, repository } = resolveTargetStart(
    launchpad,
    declaration.id,
  );
  const branch = `wo-${workOrderId.slice(3)}`;
  const target = join(parent, `${basename(clone)}-wo${workOrderId.slice(3)}`);
  const orderRoot = join(
    dirname(launchpad),
    `${basename(launchpad)}-wo${workOrderId.slice(3)}`,
  );
  const overlaps = (a, b) => a === b || a.startsWith(`${b}${sep}`);
  // Keep sibling names distinct even on case-insensitive filesystems. Refuse
  // case-only pairs on every host so a start plan is portable between them.
  const sameSiblingName =
    dirname(target) === dirname(orderRoot) &&
    basename(target).normalize("NFC").toLowerCase() ===
      basename(orderRoot).normalize("NFC").toLowerCase();
  if (
    sameSiblingName ||
    overlaps(target, orderRoot) ||
    overlaps(orderRoot, target)
  )
    throw new Error(
      `repository ${declaration.id}: target and launchpad worktree paths overlap`,
    );
  if (
    overlaps(target, launchpad) ||
    overlaps(launchpad, target) ||
    overlaps(target, clone) ||
    overlaps(clone, target)
  )
    throw new Error(`repository ${declaration.id}: target overlaps a checkout`);
  if (!recovery && lstatSync(target, { throwIfNoEntry: false }))
    throw new Error(`repository ${declaration.id}: target already exists`);
  if (!recovery && runGit(clone, ["branch", "--list", branch]))
    throw new Error(`repository ${declaration.id}: branch already exists`);
  runGit(clone, [
    "rev-parse",
    "--verify",
    `${declaration.baseCommit}^{commit}`,
  ]);
  if (!recovery && readMap(targetRegistryPath(launchpad))[target])
    throw new Error(`repository ${declaration.id}: target already registered`);
  return {
    target,
    clone,
    branch,
    baseBranch: repository.baseBranch,
    baseCommit: declaration.baseCommit,
    repositoryId: declaration.id,
    workOrderId,
  };
};

export const readTargetStart = (launchpad, workOrderId) =>
  readMap(targetStartsPath(launchpad))[workOrderId];
export const recordTargetStart = (launchpad, entry) => {
  const file = targetStartsPath(launchpad);
  writeMap(launchpad, file, { ...readMap(file), [entry.workOrderId]: entry });
};
export const forgetTargetStart = (launchpad, workOrderId) => {
  const file = targetStartsPath(launchpad);
  const entries = readMap(file);
  delete entries[workOrderId];
  writeMap(launchpad, file, entries);
};

export const recordTargetWorktree = (launchpad, entry) => {
  const file = targetRegistryPath(launchpad);
  writeMap(launchpad, file, { ...readMap(file), [entry.target]: entry });
};
export const forgetTargetWorktree = (launchpad, target) => {
  const file = targetRegistryPath(launchpad);
  const entries = readMap(file);
  delete entries[target];
  writeMap(launchpad, file, entries);
};
export const targetWorktreeForOrder = (launchpad, workOrderId) => {
  const entries = Object.values(readMap(targetRegistryPath(launchpad))).filter(
    (entry) => entry.workOrderId === workOrderId,
  );
  if (entries.length > 1)
    throw new Error(`multiple target worktrees registered for ${workOrderId}`);
  return entries[0];
};
export const registeredOrder = (launchpad, cwd) => {
  const top = runGit(cwd, ["rev-parse", "--show-toplevel"], {
    onFailure: () => undefined,
  });
  if (!top) return undefined;
  const entry = readMap(targetRegistryPath(launchpad))[physicalDirectory(top)];
  if (!entry) return undefined;
  if (entry.launchpad !== directoryIdentity(launchpad))
    throw new Error(
      `target worktree is registered to launchpad ${entry.launchpad}; no order selected. Use DOTLN_LAUNCHPAD=${shellQuote(entry.launchpad)} node ${shellQuote(join(entry.launchpad, "scripts/resume.mjs"))} status`,
    );
  const branch = runGit(top, ["symbolic-ref", "--quiet", "--short", "HEAD"], {
    onFailure: () => undefined,
  });
  if (branch !== `wo-${entry.workOrderId?.slice(3)}`)
    throw new Error("registered target worktree branch differs from its order");
  return entry.workOrderId;
};

/** Bind a review to clean committed target bytes, never to a local path. */
export const reviewedTargetSubject = (
  launchpad,
  state,
  { pendingRecordPaths = [] } = {},
) => {
  const entry = targetWorktreeForOrder(launchpad, state.workOrderId);
  if (!entry) throw new Error("target worktree registry entry is missing");
  const branch = `wo-${state.workOrderId.slice(3)}`;
  const remedy = state.targetSubject
    ? `preserve and move aside the unexpected changes, keeping ${branch} at its bound commit; do not add a commit after the passing review`
    : `commit the reviewed target change on ${branch} before final-review-result pass`;
  if (
    !state.repositoryId ||
    !loadConfig(launchpad).repositories[state.repositoryId] ||
    entry.repositoryId !== state.repositoryId ||
    entry.baseCommit !== state.baseCommit ||
    entry.branch !== branch
  )
    throw new Error(
      "target registry repository, base or branch differs from the activated order",
    );
  const target = physicalDirectory(entry.target);
  const git = (...args) => runGit(target, [...HOST_GIT_READ, ...args]);
  if (git("rev-parse", "--show-toplevel") !== target)
    throw new Error("target is not its registered Git root");
  if (
    runGit(
      target,
      [...HOST_GIT_READ, "symbolic-ref", "--quiet", "--short", "HEAD"],
      { onFailure: () => undefined },
    ) !== branch
  )
    throw new Error(
      `target branch differs from ${branch}; return to the registered branch before continuing; ${remedy}`,
    );
  const entries = porcelainEntries(
    runGitPathList(target, [
      ...HOST_GIT_READ,
      "status",
      "--porcelain=v1",
      "-z",
      "--untracked-files=all",
    ]),
  );
  // Only a plain entry for one of the saved records' own paths is expected.
  const unexpected = entries.filter(
    ({ path, origin }) =>
      origin !== undefined || !pendingRecordPaths.includes(path),
  );
  const named = (rows) => rows.map(porcelainEntryName).join(", ");
  const tracked = unexpected.filter(({ status }) => status !== "??");
  const untracked = unexpected.filter(({ status }) => status === "??");
  if (tracked.length)
    throw new Error(
      `target has tracked changes: ${named(tracked)}${untracked.length ? `; non-ignored untracked files: ${named(untracked)}` : ""}; ${remedy}`,
    );
  if (untracked.length)
    throw new Error(
      `target has non-ignored untracked files: ${named(untracked)}; ${remedy}`,
    );
  const commit = git("rev-parse", "HEAD");
  if (
    runGit(
      target,
      [
        ...HOST_GIT_READ,
        "merge-base",
        "--is-ancestor",
        state.baseCommit,
        commit,
      ],
      { onFailure: () => false },
    ) === false
  )
    throw new Error(
      "target HEAD does not descend from the activated base commit",
    );
  return {
    repositoryId: state.repositoryId,
    branch,
    baseCommit: state.baseCommit,
    commit,
  };
};

// The literal-rule fallback (WO-221): where a host's classifier still runs
// after the hook's admission, `worktree start` writes exactly one order's
// rules for its recorded target worktree, registered origin and branch, and
// `release close` removes them. The rules live in the main checkout's
// untracked local settings (Claude Code) and one Starlark rules file (Codex);
// an ignored sidecar under the control root records what was written, so the
// removal and the drift check judge the exact strings. Nothing names another
// repository and nothing enters user settings.
const hostRulesDirectory = (main) =>
  docPath(main, "control", "local/host-rules");
const hostRulesPath = (main, workOrderId) =>
  join(hostRulesDirectory(main), `${workOrderId}.json`);
const localSettingsPath = (main) => join(main, ".claude/settings.local.json");
const codexRulesPath = (main, workOrderId) =>
  join(main, ".codex/rules", `dotln-${workOrderId}.rules`);
const readLocalSettings = (main) => {
  const file = localSettingsPath(main);
  const stat = lstatSync(file, { throwIfNoEntry: false });
  if (!stat) return {};
  if (!stat.isFile())
    throw new Error(".claude/settings.local.json is not a regular file");
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    throw new Error(
      ".claude/settings.local.json is malformed JSON; repair the file, then retry the same command",
    );
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw new Error(".claude/settings.local.json is not a JSON object");
  return parsed;
};
const writeLocalSettings = (main, settings) => {
  const file = localSettingsPath(main);
  mkdirSync(dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  try {
    writeFileSync(temporary, `${JSON.stringify(settings, null, 2)}\n`, {
      flag: "wx",
      mode: 0o600,
    });
    renameSync(temporary, file);
  } finally {
    rmSync(temporary, { force: true });
  }
};
// Only the absolute node helper gets a prefix rule. Its own parser and
// committed registration bound the effect; raw git/gh and npm prefixes do not.
const hostRuleTable = (entry) => [
  {
    argv: [
      process.execPath,
      join(entry.launchpad, "scripts/worktree.mjs"),
      "publish",
      entry.workOrderId,
      "--target-worktree",
    ],
    prefix: true,
  },
];
export const orderHostRules = (main, entry, selector) => {
  const rows = hostRuleTable(entry);
  const spelled = (row) =>
    row.argv
      .map((word) => (/[\s'"]/u.test(word) ? shellQuote(word) : word))
      .join(" ");
  return {
    claude: rows.map((row) => `Bash(${spelled(row)}${row.prefix ? " *" : ""})`),
    codex: rows.map((row) => row.argv),
    copilot: rows.map(
      (row) => `shell(${spelled(row)}${row.prefix ? ":*" : ""})`,
    ),
  };
};
const codexRulesText = (workOrderId, repositoryId, patterns) =>
  `# dotln:${workOrderId}:start\n${patterns
    .map(
      (pattern) =>
        `prefix_rule(\n    pattern = ${JSON.stringify(pattern)},\n    decision = "allow",\n    justification = ${JSON.stringify(`DotLn ${workOrderId}: registered repository ${repositoryId}`)},\n)\n`,
    )
    .join("")}# dotln:${workOrderId}:end\n`;
const ruleHash = (text) => createHash("sha256").update(text).digest("hex");
const ruleExclusion = (workOrderId) =>
  `/.codex/rules/dotln-${workOrderId}.rules`;
const excludePath = (main) =>
  resolve(main, runGit(main, ["rev-parse", "--git-path", "info/exclude"]));
export const readOrderHostRules = (main, workOrderId) => {
  const sidecar = hostRulesPath(main, workOrderId);
  const stat = lstatSync(sidecar, { throwIfNoEntry: false });
  if (!stat) return undefined;
  let record;
  try {
    if (!stat.isFile()) throw new Error("not a regular file");
    record = JSON.parse(readFileSync(sidecar, "utf8"));
    if (
      record.schemaVersion !== 1 ||
      record.workOrderId !== workOrderId ||
      !Array.isArray(record.claude) ||
      !record.claude.every((rule) => typeof rule === "string") ||
      record.codex !== relative(main, codexRulesPath(main, workOrderId)) ||
      (record.removal !== undefined &&
        (!record.removal ||
          !/^[a-f0-9]{64}$/u.test(record.removal.before ?? "") ||
          !/^[a-f0-9]{64}$/u.test(record.removal.after ?? "")))
    )
      throw new Error("invalid rule ownership record");
  } catch (error) {
    throw new Error(
      `${relative(main, sidecar)}: ${error.message}; repair the host-rule record, then retry the same command`,
    );
  }
  return record;
};
export const validateOrderHostRules = (
  main,
  workOrderId,
  { creating = false } = {},
) => {
  const record = readOrderHostRules(main, workOrderId);
  if (!record && !creating) return undefined;
  readLocalSettings(main);
  for (const file of [codexRulesPath(main, workOrderId), excludePath(main)]) {
    const stat = lstatSync(file, { throwIfNoEntry: false });
    if (stat && !stat.isFile())
      throw new Error(
        `${relative(main, file)} is not a regular file; repair it before retrying`,
      );
  }
  const codex = codexRulesPath(main, workOrderId);
  if (
    existsSync(codex) &&
    (!record ||
      (record.codexHash && ruleHash(readFileSync(codex)) !== record.codexHash))
  )
    throw new Error(
      `${relative(main, codex)} has no matching ownership record; preserve the operator's file and repair the sidecar before retrying`,
    );
  return record;
};
export const writeOrderHostRules = (main, entry, selector) => {
  const previous = validateOrderHostRules(main, entry.workOrderId, {
    creating: true,
  });
  if (previous?.removal)
    throw new Error(
      `host-rule removal is incomplete; run node ${shellQuote(join(main, "scripts/worktree.mjs"))} host-rules --remove ${entry.workOrderId}, then retry the rewrite`,
    );
  const rules = orderHostRules(main, entry, selector);
  const settings = readLocalSettings(main);
  const permissions =
    settings.permissions && typeof settings.permissions === "object"
      ? settings.permissions
      : {};
  const allow = [
    ...(Array.isArray(permissions.allow) ? permissions.allow : []),
  ];
  for (const retired of previous?.claude ?? []) {
    if (rules.claude.includes(retired)) continue;
    const at = allow.indexOf(retired);
    if (at >= 0) allow.splice(at, 1);
  }
  const added = [
    ...new Set([
      ...(previous?.claude ?? []).filter((rule) => rules.claude.includes(rule)),
      ...rules.claude.filter((rule) => !allow.includes(rule)),
    ]),
  ];
  const codexFile = codexRulesPath(main, entry.workOrderId);
  const codexText = codexRulesText(
    entry.workOrderId,
    entry.repositoryId,
    rules.codex,
  );
  const exclusion = ruleExclusion(entry.workOrderId);
  const exclude = excludePath(main);
  const oldExclude = existsSync(exclude) ? readFileSync(exclude, "utf8") : "";
  const excludeOwned =
    previous?.excludeOwned || !oldExclude.split("\n").includes(exclusion);
  const sidecar = hostRulesPath(main, entry.workOrderId);
  mkdirSync(dirname(sidecar), { recursive: true });
  // Ownership is durable before the first settings/rules write. A stopped
  // write can be removed or rewritten from this same record.
  writeFileSync(
    sidecar,
    `${JSON.stringify(
      {
        schemaVersion: 1,
        workOrderId: entry.workOrderId,
        repositoryId: entry.repositoryId,
        target: entry.target,
        claude: added,
        codex: relative(main, codexFile),
        codexHash: ruleHash(codexText),
        excludeOwned,
      },
      null,
      2,
    )}\n`,
  );
  if (excludeOwned && !oldExclude.split("\n").includes(exclusion)) {
    mkdirSync(dirname(exclude), { recursive: true });
    writeFileSync(
      exclude,
      `${oldExclude}${oldExclude && !oldExclude.endsWith("\n") ? "\n" : ""}${exclusion}\n`,
    );
  }
  settings.permissions = {
    ...permissions,
    allow: [...allow, ...added.filter((rule) => !allow.includes(rule))],
  };
  writeLocalSettings(main, settings);
  mkdirSync(dirname(codexFile), { recursive: true });
  writeFileSync(codexFile, codexText);
  return { settings: localSettingsPath(main), codex: codexFile };
};
export const removeOrderHostRules = (main, workOrderId) => {
  const record = validateOrderHostRules(main, workOrderId);
  if (!record) return undefined;
  const settings = readLocalSettings(main);
  const allow = Array.isArray(settings.permissions?.allow)
    ? [...settings.permissions.allow]
    : [];
  const before = ruleHash(JSON.stringify(allow));
  // Journal both sides before changing settings. A retry after that atomic
  // replacement must not remove the operator's surviving identical rule.
  for (const rule of record.claude) {
    const index = allow.indexOf(rule);
    if (index >= 0) allow.splice(index, 1);
  }
  const after = ruleHash(JSON.stringify(allow));
  if (!record.removal) {
    record.removal = { before, after };
    writeMap(main, hostRulesPath(main, workOrderId), record);
  }
  if (before !== record.removal.after) {
    if (before !== record.removal.before || after !== record.removal.after)
      throw new Error(
        `.claude/settings.local.json allow rules changed during removal; preserve the current settings and inspect ${relative(main, hostRulesPath(main, workOrderId))} before retrying host-rules --remove ${workOrderId}`,
      );
    settings.permissions.allow = allow;
    writeLocalSettings(main, settings);
  }
  rmSync(codexRulesPath(main, workOrderId), { force: true });
  if (record.excludeOwned) {
    const exclude = excludePath(main);
    if (existsSync(exclude))
      writeFileSync(
        exclude,
        readFileSync(exclude, "utf8")
          .split("\n")
          .filter((line) => line !== ruleExclusion(workOrderId))
          .join("\n"),
      );
  }
  rmSync(hostRulesPath(main, workOrderId));
  return record;
};
/** Every sidecar whose order has no registered target worktree, or whose
 * rules are no longer all present, named with the remedy (WO-221). */
export const staleOrderHostRules = (main) => {
  const directory = hostRulesDirectory(main);
  if (!existsSync(directory)) return [];
  const registered = new Set(
    Object.values(readMap(targetRegistryPath(main))).map(
      (entry) => entry.workOrderId,
    ),
  );
  const allow = (() => {
    try {
      return readLocalSettings(main).permissions?.allow ?? [];
    } catch {
      return [];
    }
  })();
  const stale = [];
  for (const name of readdirSync(directory).sort()) {
    const workOrderId = name.replace(/\.json$/u, "");
    if (!/^WO-\d{3}$/u.test(workOrderId)) continue;
    const record = readOrderHostRules(main, workOrderId);
    try {
      validateOrderHostRules(main, workOrderId);
    } catch (error) {
      stale.push({
        workOrderId,
        reason: error.message,
        remedy: `Preserve the edited file, restore its owned bytes and sidecar, then run node ${shellQuote(join(main, "scripts/worktree.mjs"))} host-rules --rewrite ${workOrderId}`,
      });
      continue;
    }
    const missing = record.claude.filter((rule) => !allow.includes(rule));
    if (record.removal)
      stale.push({
        workOrderId,
        reason: "host-rule removal is incomplete",
        remedy: `node ${shellQuote(join(main, "scripts/worktree.mjs"))} host-rules --remove ${workOrderId}`,
      });
    else if (!registered.has(workOrderId))
      stale.push({
        workOrderId,
        reason: "no registered target worktree holds this order",
        remedy: `node ${shellQuote(join(main, "scripts/worktree.mjs"))} host-rules --remove ${workOrderId}`,
      });
    else if (missing.length || !existsSync(join(main, record.codex)))
      stale.push({
        workOrderId,
        reason: `rules were edited by hand (${missing.length} of ${record.claude.length} Claude Code rules missing${existsSync(join(main, record.codex)) ? "" : `; ${record.codex} missing`})`,
        remedy: `node ${shellQuote(join(main, "scripts/worktree.mjs"))} host-rules --rewrite ${workOrderId}`,
      });
  }
  return stale;
};
