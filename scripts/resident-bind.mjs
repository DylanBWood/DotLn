#!/usr/bin/env node
// Bind a resident to the active work. One command reads the canonical control
// state for an order, the worktree the helper created for it and the order's
// own authority file, and writes a fresh store whose `mission-check` actor
// carries a `MissionSource` naming that worktree. Nothing is derived: the
// declared surfaces are exactly the ones typed on the command line, and the
// binding record beside the store is what `--check` compares with canonical
// state before any launch line is printed (WO-148).
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import {
  CONFIG_FILENAME,
  TOOL_ROOT,
  docPath,
  docRelative,
  findLaunchpad,
  loadConfig,
} from "./lib/config.mjs";
import {
  readAuthorityGrantRegistry,
  registeredProfileMismatches,
  registeredRepositoryInputs,
} from "./lib/authority-grants.mjs";
import { failureOf, parseWorktrees, runGit, shellQuote } from "./lib/git.mjs";
import { eventsForOrder, readControl } from "./lib/control-store.mjs";
import { isMainModule, workOrderAuthorityPath } from "./lib/paths.mjs";
import {
  CONTRIBUTOR_MISSION_PHASE,
  CONTRIBUTOR_MISSION_POLICY,
  CONTRIBUTOR_MISSION_SURFACE,
  contributorOutsideAuthority,
  contributorWithSupports,
} from "../packages/skeleton/dist/src/loadouts/contributor.js";
import { buildMissionCheckRequest } from "../packages/skeleton/dist/src/mission-check-host.js";
import {
  missionPinFromSource,
  observeMissionSubject,
} from "../packages/skeleton/dist/src/mission-check-source.js";
import { missionPath } from "../packages/skeleton/dist/src/mission-check-protocol.js";
import { decodeResidentConfiguration } from "../packages/skeleton/dist/src/resident-state.js";
import {
  canonicalStringify,
  compileLoadout,
  requireCompiled,
} from "../packages/compiler/dist/src/index.js";

export const BINDING_SCHEMA_VERSION = "resident-binding-v1";
export const TRANSPORTS = ["claude-cli-print", "codex-cli-exec"];
/** The always-on judge's default per transport, at `xhigh` (WO-157 item 7,
 * WO-100 D007): the model id the CLI itself reports, never an alias. Reopen
 * when Claude Sonnet 5.5 is available (the Claude default moves to it), a
 * default model is withdrawn, or the operator changes a role default. */
export const DEFAULT_JUDGE = Object.freeze({
  "claude-cli-print": Object.freeze({
    model: "claude-sonnet-5",
    effort: "xhigh",
  }),
  "codex-cli-exec": Object.freeze({ model: "gpt-6-luna", effort: "xhigh" }),
});
/** The judge a bind records, with whether each value was chosen or defaulted. */
export function judgeSelection({ transport, model, effort }) {
  if (!Object.hasOwn(DEFAULT_JUDGE, transport))
    refuse(`--transport must be one of ${TRANSPORTS.join(", ")}`);
  const fallback = DEFAULT_JUDGE[transport];
  return {
    model: model ?? fallback.model,
    modelSource: model === undefined ? "default" : "operator",
    effort: effort ?? fallback.effort,
    effortSource: effort === undefined ? "default" : "operator",
  };
}
/** The lane a bound store lives in, under the launchpad's ignored control
 * root. Assumption 1 of the order: not a `.runtime/` directory in the
 * worktree, so a retained store outlives the worktree it judged. */
export const RESIDENT_LANE = "local/resident";
/** The Contributor build's presence policy declares the `mission-check` phase
 * but no `MissionSource`, so it names neither a vision document nor its
 * theses. They are declared here, against this project's own vision, and a
 * heading the document does not carry is skipped rather than refused. */
export const MISSION_THESIS_HEADINGS = [
  ["mission", "Mission — increase the chance of operator flow"],
  ["common-substrate", "Common substrate, local doctrine"],
  ["the-core-bet", "The core bet"],
  ["the-differentiated-interface", "The differentiated interface"],
];
/** The decision window the capsule carries, matching the mission fixture's. */
export const MISSION_DECISION_LIMIT = 5;
/** Every `MissionSource` field the binding record declares. `--check` compares
 * all of them, because each one selects part of the subject `observeMissionSubject`
 * re-reads at every dispatch: a store retargeted through the decisions window,
 * the vision document or its theses judges a different mission than the binding
 * names, even when the worktree, phase, base and contract are untouched
 * (VER-001 F1). A field the store declares and the binding does not — `storyPath`
 * is the one the protocol admits — is named the same way. */
export const DECLARED_SOURCE_FIELDS = [
  "root",
  "contractPath",
  "decisionsPath",
  "baseCommit",
  "declaredSurfaces",
  "decisionLimit",
  "visionPath",
  "thesisHeadings",
];
/** Compiled with the runtime capability the resident host supplies, because
 * the compiled phase is otherwise a NoOp naming `actor.cli-worker` and the
 * cadence would never dispatch (product 03 §Operator-presence policy). */
export const MISSION_ENVIRONMENT_CAPABILITY = "actor.cli-worker";
/** The two files a store holds, in the order bind writes them. */
export const STORE_FILES = ["resident.json", "binding.json"];
const REQUIRED_EVIDENCE = "resolved-worktree";
const BASE_REFS = ["origin/main", "main"];

export const USAGE =
  "usage: resident-bind WO-NNN --surface <path>... " +
  "--transport <claude-cli-print|codex-cli-exec> [--model <model>] " +
  "[--effort <level>] [--base <commit>] | resident-bind --portfolio <id> " +
  "--template <resident.json> --base <40-hex commit> | resident-bind --check <store>";

function refuse(detail) {
  throw new Error(detail);
}
/** An identifier printed into a command line: bare when it is one, quoted
 * when a hand-written record makes it anything else. */
const word = (value) =>
  /^[A-Za-z0-9][A-Za-z0-9._-]*$/u.test(String(value))
    ? String(value)
    : shellQuote(String(value));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const regularFile = (path) =>
  existsSync(path) &&
  lstatSync(path).isFile() &&
  !lstatSync(path).isSymbolicLink();
/** Exact comparison for the declared source: arrays are compared element by
 * element and in order, because `declaredSurfaces` and `thesisHeadings` decide
 * what the resident reads and what it counts as out of surface. Joining them
 * into text would let punctuation inside a path stand in for a boundary. */
const sameStructure = (left, right) =>
  Array.isArray(left) || Array.isArray(right)
    ? Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((item, at) => sameStructure(item, right[at]))
    : left === right;
/** The same directory, whatever route the operator typed to it. */
const samePath = (left, right) => {
  const real = (path) => {
    try {
      return realpathSync(path);
    } catch {
      return null;
    }
  };
  return left === right || (real(left) !== null && real(left) === real(right));
};

const OPTIONS = new Set([
  "--surface",
  "--transport",
  "--model",
  "--effort",
  "--base",
  "--check",
  "--portfolio",
  "--template",
]);

/** Literal arguments only: repeated `--surface` and several paths after one
 * both collect, and every other option takes exactly one value. */
export function parseArguments(argv) {
  const taken = new Map();
  const surfaces = [];
  let workOrder;
  let index = 0;
  while (index < argv.length) {
    const token = argv[index];
    index += 1;
    if (!token.startsWith("--")) {
      if (workOrder !== undefined)
        refuse(`unexpected argument ${JSON.stringify(token)}; ${USAGE}`);
      workOrder = token;
      continue;
    }
    if (!OPTIONS.has(token)) refuse(`unknown option ${token}; ${USAGE}`);
    const values = [];
    while (index < argv.length && !argv[index].startsWith("--")) {
      values.push(argv[index]);
      index += 1;
    }
    if (token === "--surface") {
      if (!values.length)
        refuse("--surface needs at least one repository-relative path");
      surfaces.push(...values);
      continue;
    }
    if (values.length !== 1) refuse(`${token} takes exactly one value`);
    if (taken.has(token)) refuse(`duplicate option ${token}`);
    taken.set(token, values[0]);
  }
  if (taken.has("--check")) {
    if (workOrder !== undefined || surfaces.length || taken.size !== 1)
      refuse(`--check takes a store directory and nothing else; ${USAGE}`);
    return { action: "check", store: taken.get("--check") };
  }
  if (taken.has("--portfolio")) {
    if (
      workOrder !== undefined ||
      surfaces.length ||
      ["--transport", "--model", "--effort"].some((key) => taken.has(key))
    )
      refuse(
        `--portfolio takes --template and --base and nothing else; ${USAGE}`,
      );
    const portfolioId = taken.get("--portfolio");
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u.test(portfolioId))
      refuse(`portfolio id is not a declared identifier: ${portfolioId}`);
    if (!taken.has("--template"))
      refuse(`--portfolio needs --template <resident.json>; ${USAGE}`);
    // A portfolio has no worktree to derive a merge base from, and WO-054
    // prepares only a full commit id (decodePortfolioBinding).
    if (!/^[a-f0-9]{40}$/u.test(taken.get("--base") ?? ""))
      refuse(
        "--base must be the target's full 40-hex commit id for a portfolio binding",
      );
    return {
      action: "portfolio",
      portfolioId,
      template: taken.get("--template"),
      base: taken.get("--base"),
    };
  }
  if (taken.has("--template"))
    refuse(`--template belongs to a portfolio bind; ${USAGE}`);
  if (!/^WO-\d{3}$/.test(workOrder ?? ""))
    refuse(`work order id must look like WO-148; ${USAGE}`);
  if (!surfaces.length)
    refuse(
      "no declared surface; bind refuses without --surface <path> because the " +
        "out-of-surface rule is only as good as the declaration",
    );
  const duplicate = surfaces.find(
    (surface, at) => surfaces.indexOf(surface) !== at,
  );
  if (duplicate) refuse(`duplicate declared surface ${duplicate}`);
  for (const surface of surfaces)
    if (!missionPath(surface))
      refuse(`declared surface is not repository-relative: ${surface}`);
  const transport = taken.get("--transport");
  if (!TRANSPORTS.includes(transport))
    refuse(`--transport must be one of ${TRANSPORTS.join(", ")}`);
  // Absent --model or --effort take the transport's default at bind time;
  // one given blank is refused, not defaulted.
  for (const key of ["--model", "--effort"])
    if (taken.has(key) && !taken.get(key).trim())
      refuse(`${key} needs a value; omit it to take the transport default`);
  return {
    action: "bind",
    workOrder,
    surfaces,
    transport,
    model: taken.get("--model"),
    effort: taken.get("--effort"),
    base: taken.get("--base"),
  };
}

/** The worktree the helper created for this order, located by the branch the
 * order names. A branch without a worktree, or one whose directory is gone,
 * refuses here rather than producing a store aimed at nothing. */
export function orderWorktree(launchpad, workOrderId) {
  const branch = `wo-${workOrderId.slice(workOrderId.indexOf("-") + 1)}`;
  const item = parseWorktrees(launchpad).find(
    (candidate) => candidate.branch === `refs/heads/${branch}`,
  );
  if (!item?.worktree)
    refuse(
      `no worktree for ${branch}; create it with ` +
        `node scripts/worktree.mjs start ${workOrderId} <authority path>`,
    );
  const path = resolve(item.worktree);
  if (!existsSync(path))
    refuse(`the worktree for ${branch} is missing on disk: ${path}`);
  return { branch, worktree: realpathSync(path) };
}

/** Canonical control state for the order, read in its own worktree: that is
 * where activation and every later transition are recorded before merge. */
export function orderControl(worktree, workOrderId) {
  const control = readControl(worktree);
  if (!control.orders.has(workOrderId))
    refuse(
      `unknown work order ${workOrderId} in the canonical control state at ${worktree}`,
    );
  const { state } = control.orders.get(workOrderId);
  const controlPath = control.locations.get(workOrderId);
  const events = eventsForOrder(control, workOrderId);
  return {
    phase: state.phase,
    workOrderPath: state.workOrderPath,
    canonical: {
      controlPath,
      sha256: sha256(readFileSync(join(worktree, controlPath))),
      events: events.length,
      recordedAt: events.at(-1)?.recordedAt ?? null,
    },
  };
}

const commitOf = (worktree, revision) => {
  try {
    return runGit(worktree, ["rev-parse", "--verify", `${revision}^{commit}`]);
  } catch {
    return null;
  }
};

/** The merge base with the `main` the branch was created from, or the commit
 * the operator knows better (WO-079's integrated sibling). */
export function resolveBase(worktree, branch, supplied) {
  if (supplied !== undefined) {
    if (!/^[0-9a-f]{7,64}$/u.test(supplied))
      refuse(`--base must be a hexadecimal commit id: ${supplied}`);
    const commit = commitOf(worktree, supplied);
    if (!commit) refuse(`--base names no commit in ${worktree}: ${supplied}`);
    return { baseCommit: commit, baseRef: null, baseSource: "operator" };
  }
  for (const ref of BASE_REFS) {
    if (!commitOf(worktree, ref)) continue;
    return {
      baseCommit: runGit(worktree, ["merge-base", branch, ref]),
      baseRef: ref,
      baseSource: "merge-base",
    };
  }
  return refuse(
    `neither ${BASE_REFS.join(" nor ")} resolves in ${worktree}; supply --base <commit>`,
  );
}

/** Everything the store and its binding record are built from, read once. */
export function readBindingInputs(launchpad, request) {
  const { workOrder: workOrderId, surfaces } = request;
  const { branch, worktree } = orderWorktree(launchpad, workOrderId);
  const control = orderControl(worktree, workOrderId);
  if (control.phase === "closed" || control.phase === "withdrawn")
    refuse(
      `${workOrderId} is ${control.phase}; a resident binds work in flight, and a ${control.phase} order's store would keep judging a worktree nobody works in`,
    );
  const contractPath = control.workOrderPath;
  workOrderAuthorityPath(worktree, workOrderId, contractPath);
  const decisionsPath = docRelative(
    worktree,
    "evidence",
    `${workOrderId}/decisions.md`,
  );
  const visionPath = docRelative(worktree, "product", "00-vision.md");
  if (!regularFile(join(worktree, visionPath)))
    refuse(`the vision document the capsule reads is missing: ${visionPath}`);
  const base = resolveBase(worktree, branch, request.base);
  const source = {
    root: worktree,
    contractPath,
    ...(regularFile(join(worktree, decisionsPath)) ? { decisionsPath } : {}),
    baseCommit: base.baseCommit,
    declaredSurfaces: [...surfaces],
    decisionLimit: MISSION_DECISION_LIMIT,
    visionPath,
    thesisHeadings: MISSION_THESIS_HEADINGS.map(([id, title]) => [id, title]),
  };
  return {
    branch,
    worktree,
    control,
    base,
    source,
    contractSha256: sha256(readFileSync(join(worktree, contractPath))),
    absentSurfaces: surfaces.filter(
      (surface) => !existsSync(join(worktree, surface)),
    ),
  };
}

/** The Contributor build's graph and environment, with the runtime capability
 * the resident host supplies declared so the compiled phase is ready. */
export const missionConfiguration = (actor) =>
  decodeResidentConfiguration({
    graph: {
      ...contributorWithSupports(),
      authorityGrants: contributorOutsideAuthority,
    },
    environment: {
      environmentId: "contributor.project",
      version: 1,
      capabilities: [MISSION_ENVIRONMENT_CAPABILITY],
      repo: "project",
      baseCommit: "0".repeat(40),
      authorityGrantRegistry: contributorOutsideAuthority,
    },
    policyId: CONTRIBUTOR_MISSION_POLICY,
    actors: { [CONTRIBUTOR_MISSION_PHASE]: actor },
    evidence: [REQUIRED_EVIDENCE],
  });

/** One `mission-check` actor over the declared source. The capsule is pinned
 * here and completed again at every dispatch, so the store judges the work as
 * it then reads while the contract it was given stays fixed. */
export function missionActor(source, workOrderId, request, at = Date.now()) {
  const pin = missionPinFromSource(source, workOrderId);
  const subject = observeMissionSubject(source, pin);
  return {
    kind: "cli-worker",
    effect: "repo.read",
    surface: CONTRIBUTOR_MISSION_SURFACE,
    resources: { files: 0, lines: 0 },
    worker: {
      transport: request.transport,
      request: buildMissionCheckRequest({
        subject,
        model: request.model,
        effort: request.effort,
        cwd: source.root,
        at,
      }),
    },
    missionSource: source,
  };
}

/** The next unused store for this order. A rebind never rewrites a store:
 * configuration is immutable within one, and the old one is retained. */
export function nextStore(launchpad, workOrderId) {
  const lane = docPath(launchpad, "control", RESIDENT_LANE);
  const prefix = workOrderId.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const pattern = new RegExp(`^${prefix}-(\\d+)$`, "u");
  const used = existsSync(lane)
    ? readdirSync(lane)
        .map((name) => pattern.exec(name)?.[1])
        .filter(Boolean)
        .map(Number)
    : [];
  const index = (used.length ? Math.max(...used) : 0) + 1;
  return { lane, index, store: join(lane, `${workOrderId}-${index}`) };
}

/** The store and its binding record carry the operator's physical worktree and
 * store paths, so they may only be written where Git cannot see them. A
 * configured control root (WO-069) moves the lane but carries no ignore rule of
 * its own, and the configuration schema validates containment only, so bind
 * asks Git about the exact files it is about to write and refuses by name when
 * either is visible (criterion 3, VER-001 F3). */
export function assertIgnoredStore(launchpad, store) {
  const lane = docRelative(launchpad, "control", RESIDENT_LANE);
  for (const name of STORE_FILES) {
    const path = join(store, name);
    const asked = spawnSync(
      "git",
      ["-C", launchpad, "check-ignore", "-q", "--", path],
      { encoding: "utf8" },
    );
    if (asked.status === 0) continue;
    if (asked.status === 1)
      refuse(
        `the resident lane is not ignored: Git would see ${path}. A bound store ` +
          "carries physical paths, so bind refuses until the launchpad ignores " +
          `${lane}/ — add it to .gitignore and bind again`,
      );
    refuse(
      `cannot ask Git whether ${path} is ignored in ${launchpad}: ` +
        failureOf(asked, "git check-ignore failed"),
    );
  }
}

const dotln = join(TOOL_ROOT, "packages/skeleton/dist/src/dotln.js");
const bind = join(TOOL_ROOT, "scripts/resident-bind.mjs");

/** The lines a stage session and an outside terminal need, named for one
 * store. They are printed only for a binding that canonical state still
 * matches. */
export function launchLines(store, selected = CONTRIBUTOR_MISSION_POLICY) {
  const at = shellQuote(store);
  const policy = word(selected);
  return [
    "Launch (an outside terminal, with the operator marked away):",
    `  node ${shellQuote(dotln)} resident --store ${at} --policy ${policy} --once`,
    `  node ${shellQuote(dotln)} resident --store ${at} --policy ${policy} --tick 60000`,
    "Presence:",
    `  node ${shellQuote(dotln)} presence away --store ${at}`,
    `  node ${shellQuote(dotln)} presence back --store ${at}`,
    "Status:",
    `  node ${shellQuote(dotln)} status --store ${at}`,
    "Stage session:",
    `  export DOTLN_RESIDENT_STORE=${at}`,
    "Before the next launch:",
    `  node ${shellQuote(bind)} --check ${at}`,
  ];
}

export function describeBinding(binding) {
  const lines = [
    `  worktree   ${binding.worktree} (${binding.branch})`,
    `  phase      ${binding.phase}`,
    `  base       ${binding.baseCommit} (${
      binding.baseSource === "operator"
        ? "operator-supplied"
        : `merge base with ${binding.baseRef}`
    })`,
    `  contract   ${binding.contractPath} (sha256 ${binding.contractSha256})`,
    `  decisions  ${binding.decisionsPath ?? "none yet"}`,
    `  surfaces   ${binding.declaredSurfaces.join(", ")}`,
    `  vision     ${binding.visionPath}`,
    `  judge      ${binding.transport}; model ${binding.model} (${binding.modelSource ?? "source not recorded"}); effort ${binding.effort} (${binding.effortSource ?? "source not recorded"})`,
    `  canonical  ${binding.canonical.controlPath} (sha256 ${binding.canonical.sha256}; ${binding.canonical.events} ${binding.canonical.events === 1 ? "event" : "events"})`,
  ];
  return lines;
}

export function bindOrder(launchpad, request, now = () => new Date()) {
  const judge = judgeSelection(request);
  request = { ...request, model: judge.model, effort: judge.effort };
  const inputs = readBindingInputs(launchpad, request);
  const { lane, index, store } = nextStore(launchpad, request.workOrder);
  assertIgnoredStore(launchpad, store);
  const at = now();
  const actor = missionActor(
    inputs.source,
    request.workOrder,
    request,
    at.getTime(),
  );
  const configuration = missionConfiguration(actor);
  const binding = {
    schemaVersion: BINDING_SCHEMA_VERSION,
    workOrder: request.workOrder,
    phase: inputs.control.phase,
    boundAt: at.toISOString(),
    store,
    storeIndex: index,
    branch: inputs.branch,
    worktree: inputs.worktree,
    baseCommit: inputs.base.baseCommit,
    baseRef: inputs.base.baseRef,
    baseSource: inputs.base.baseSource,
    contractPath: inputs.source.contractPath,
    contractSha256: inputs.contractSha256,
    decisionsPath: inputs.source.decisionsPath ?? null,
    declaredSurfaces: [...inputs.source.declaredSurfaces],
    visionPath: inputs.source.visionPath,
    thesisHeadings: inputs.source.thesisHeadings,
    decisionLimit: inputs.source.decisionLimit,
    policyId: CONTRIBUTOR_MISSION_POLICY,
    phaseId: CONTRIBUTOR_MISSION_PHASE,
    transport: request.transport,
    model: judge.model,
    modelSource: judge.modelSource,
    effort: judge.effort,
    effortSource: judge.effortSource,
    canonical: inputs.control.canonical,
  };
  writeStore(lane, store, configuration, binding);
  return { binding, configuration, absentSurfaces: inputs.absentSurfaces };
}

function writeStore(lane, store, configuration, binding) {
  mkdirSync(lane, { recursive: true, mode: 0o700 });
  if (existsSync(store)) refuse(`store already exists: ${store}`);
  mkdirSync(store, { mode: 0o700 });
  writeFileSync(
    join(store, "resident.json"),
    `${JSON.stringify(configuration, null, 2)}\n`,
    { mode: 0o600 },
  );
  writeFileSync(
    join(store, "binding.json"),
    `${JSON.stringify(binding, null, 2)}\n`,
    { mode: 0o600 },
  );
}

/** WO-157 item 6 (WO-100 D006): a resident bound to a declared portfolio is
 * built from the loaded `portfolios` entry, and its graph and environment are
 * compiled under the bound repository's registered `authorityProfile`, so the
 * profile check the configuration loader performs also holds for the store. */
export function bindPortfolio(launchpad, request, now = () => new Date()) {
  const config = loadConfig(launchpad);
  const id = request.portfolioId;
  if (!Object.hasOwn(config.portfolios, id))
    refuse(
      `no portfolio ${id} is declared under portfolios in ${config.path ?? join(launchpad, CONFIG_FILENAME)}`,
    );
  const definition = config.portfolios[id];
  if (definition.repo === "self")
    refuse(
      `portfolio ${id} binds self, which carries no registered authorityProfile to compile under; register the repository under repositories and name it in the portfolio`,
    );
  const template = readJson(resolve(request.template), "resident template");
  if (
    template === null ||
    typeof template !== "object" ||
    Array.isArray(template) ||
    Object.hasOwn(template, "portfolio")
  )
    refuse(
      "the resident template must be a resident configuration without a portfolio; bind takes the portfolio from the launchpad configuration only",
    );
  const { graph, environment, repository } = registeredRepositoryInputs(
    template.graph,
    template.environment,
    launchpad,
    definition.repo,
  );
  // The runtime's own admission, under the profile-narrowed floor.
  const configuration = decodeResidentConfiguration({
    ...template,
    graph,
    environment,
    portfolio: { definition, baseCommit: request.base },
  });
  // A store this bind writes must pass its own --check.
  const departures = registeredProfileMismatches({
    program: requireCompiled(
      compileLoadout(configuration.graph, configuration.environment),
    ),
    environment: configuration.environment,
    repository,
    registry: readAuthorityGrantRegistry(launchpad),
  });
  if (departures.length)
    refuse(
      `the template does not compile under repositories.${repository.id}.authorityProfile: ${departures.join("; ")}`,
    );
  const { lane, index, store } = nextStore(launchpad, `portfolio-${id}`);
  assertIgnoredStore(launchpad, store);
  const binding = {
    schemaVersion: BINDING_SCHEMA_VERSION,
    kind: "portfolio",
    portfolioId: id,
    portfolioVersion: definition.version,
    repo: repository.id,
    profileId: repository.authorityProfile.authorityEnvelopeId,
    baseCommit: request.base,
    policyId: configuration.policyId,
    templatePath: resolve(request.template),
    boundAt: now().toISOString(),
    store,
    storeIndex: index,
  };
  writeStore(lane, store, configuration, binding);
  return { binding, configuration };
}

export function describePortfolioBinding(binding) {
  return [
    `  portfolio  ${binding.portfolioId} v${binding.portfolioVersion} (repository ${binding.repo})`,
    `  profile    ${binding.profileId} (repositories.${binding.repo}.authorityProfile)`,
    `  base       ${binding.baseCommit} (operator-supplied)`,
    `  policy     ${binding.policyId}`,
    "  note       dotln resident binds no WO-120, WO-052 or WO-054 hosts, so its portfolio phases report the actor unavailable until a caller binds them",
  ];
}

/** Every way a store's portfolio departs from the launchpad's declaration and
 * from its repository's registered profile. A profile that cannot be read is
 * named too: a store whose profile was never checked gets no launch line. */
export function portfolioMismatches(
  launchpad,
  declared,
  configuration,
  binding,
) {
  const portfolio = configuration?.portfolio ?? declared?.portfolio;
  const definition = portfolio?.definition;
  const id = binding.portfolioId ?? definition?.portfolioId;
  const mismatches = [];
  if (!definition)
    return [
      `store: resident.json declares no portfolio; the binding record names portfolio ${id}`,
    ];
  if (binding.kind === "portfolio") {
    if (definition.portfolioId !== binding.portfolioId)
      mismatches.push(
        `portfolio: resident.json binds ${definition.portfolioId}; the binding record says ${binding.portfolioId}`,
      );
    if (definition.repo !== binding.repo)
      mismatches.push(
        `portfolio: resident.json binds repository ${definition.repo}; the binding record says ${binding.repo}`,
      );
    if (portfolio.baseCommit !== binding.baseCommit)
      mismatches.push(
        `portfolio: resident.json binds base ${portfolio.baseCommit}; the binding record says ${binding.baseCommit}`,
      );
  }
  const unreadable = (reason) => [
    ...mismatches,
    `profile: no registered authorityProfile is readable for repository ${definition.repo}: ${reason}`,
  ];
  let config;
  try {
    config = loadConfig(launchpad);
  } catch (error) {
    return unreadable(error instanceof Error ? error.message : String(error));
  }
  if (config.path === null)
    return unreadable(`the launchpad declares no ${CONFIG_FILENAME}`);
  const loaded = Object.hasOwn(config.portfolios, definition.portfolioId)
    ? config.portfolios[definition.portfolioId]
    : undefined;
  if (!loaded)
    mismatches.push(
      `portfolio: portfolios.${definition.portfolioId} is not declared in ${config.path}`,
    );
  else if (canonicalStringify(loaded) !== canonicalStringify(definition))
    mismatches.push(
      `portfolio: resident.json binds a portfolio ${definition.portfolioId} v${definition.version} that differs from portfolios.${definition.portfolioId} in ${config.path}`,
    );
  if (definition.repo === "self")
    return [
      ...mismatches,
      `profile: portfolio ${definition.portfolioId} binds self, which carries no registered authorityProfile to compile under`,
    ];
  const repository = Object.hasOwn(config.repositories, definition.repo)
    ? config.repositories[definition.repo]
    : undefined;
  if (!repository)
    return [
      ...mismatches,
      `profile: repository ${definition.repo} has no registered authorityProfile under repositories in ${config.path}`,
    ];
  let registry;
  try {
    registry = readAuthorityGrantRegistry(launchpad);
  } catch (error) {
    return unreadable(
      `the launchpad's authority registry cannot be read: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  // An undecodable store is already named; its floor cannot be compiled.
  if (configuration === declared) return mismatches;
  return [
    ...mismatches,
    ...registeredProfileMismatches({
      program: requireCompiled(
        compileLoadout(configuration.graph, configuration.environment),
      ),
      environment: configuration.environment,
      repository,
      registry,
    }),
  ];
}

const readJson = (path, label) => {
  if (!regularFile(path)) refuse(`${label} is missing: ${path}`);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    refuse(`${label} is not readable JSON: ${path}: ${error.message}`);
  }
};

export function readBinding(store) {
  const directory = resolve(store);
  const binding = readJson(join(directory, "binding.json"), "binding record");
  if (binding?.schemaVersion !== BINDING_SCHEMA_VERSION)
    refuse(
      `binding record is not ${BINDING_SCHEMA_VERSION}: ${join(directory, "binding.json")}`,
    );
  return { directory, binding };
}

/** What canonical state says now about the subject a binding named. Every
 * field that cannot be read is `null`, which the comparison names as a
 * mismatch rather than passing over. */
export function observeBinding(launchpad, binding) {
  const observed = {
    worktree: null,
    phase: null,
    workOrderPath: null,
    baseCommit: null,
    contractSha256: null,
    canonical: null,
  };
  let worktree;
  try {
    ({ worktree } = orderWorktree(launchpad, binding.workOrder));
  } catch {
    return observed;
  }
  observed.worktree = worktree;
  try {
    const control = orderControl(worktree, binding.workOrder);
    observed.phase = control.phase;
    observed.workOrderPath = control.workOrderPath;
    observed.canonical = control.canonical;
  } catch {
    // An unreadable or order-less control state stays null and is named below.
  }
  try {
    observed.baseCommit =
      binding.baseSource === "operator"
        ? commitOf(worktree, binding.baseCommit)
        : resolveBase(worktree, binding.branch, undefined).baseCommit;
  } catch {
    // Named as a mismatch; a missing base is never silently accepted.
  }
  const contract = join(worktree, binding.contractPath);
  if (regularFile(contract))
    observed.contractSha256 = sha256(readFileSync(contract));
  return observed;
}

/** Every difference between a binding and canonical state, named. A store is
 * stale when this is not empty, and a stale store gets no launch line. */
export function bindingMismatches(binding, observed, configuration) {
  const mismatches = [];
  if (observed.worktree === null)
    mismatches.push(
      `worktree: the binding names ${binding.worktree}; no worktree for ${binding.branch} exists now`,
    );
  else if (observed.worktree !== binding.worktree)
    mismatches.push(
      `worktree: the binding names ${binding.worktree}; ${binding.branch} is now at ${observed.worktree}`,
    );
  if (observed.phase === null)
    mismatches.push(
      `phase: the binding records ${binding.phase}; canonical state for ${binding.workOrder} cannot be read`,
    );
  else if (observed.phase !== binding.phase)
    mismatches.push(
      `phase: the binding records ${binding.phase}; canonical state records ${observed.phase}`,
    );
  if (
    observed.workOrderPath !== null &&
    observed.workOrderPath !== binding.contractPath
  )
    mismatches.push(
      `contract path: the binding names ${binding.contractPath}; canonical state names ${observed.workOrderPath}`,
    );
  if (observed.contractSha256 === null)
    mismatches.push(
      `contract bytes: ${binding.contractPath} cannot be read in the bound worktree`,
    );
  else if (observed.contractSha256 !== binding.contractSha256)
    mismatches.push(
      `contract bytes: the pinned capsule carries sha256 ${binding.contractSha256}; the file now reads ${observed.contractSha256}`,
    );
  if (observed.baseCommit === null)
    mismatches.push(
      `base commit: ${binding.baseCommit} cannot be resolved in the bound worktree`,
    );
  else if (observed.baseCommit !== binding.baseCommit)
    mismatches.push(
      `base commit: the binding records ${binding.baseCommit}; the merge base with ${binding.baseRef} is now ${observed.baseCommit}`,
    );
  const source = configuration?.actors?.[binding.phaseId]?.missionSource;
  if (!source)
    mismatches.push(
      "store: resident.json declares no mission source for the bound phase",
    );
  else {
    for (const field of DECLARED_SOURCE_FIELDS) {
      const stored = source[field] ?? null;
      const declared =
        (field === "root" ? binding.worktree : binding[field]) ?? null;
      if (!sameStructure(stored, declared))
        mismatches.push(
          `store: resident.json ${field} is ${JSON.stringify(stored)}; the binding record says ${JSON.stringify(declared)}`,
        );
    }
    const undeclared = Object.keys(source).filter(
      (field) => !DECLARED_SOURCE_FIELDS.includes(field),
    );
    if (undeclared.length)
      mismatches.push(
        `store: resident.json declares ${undeclared.join(", ")}, which the binding record does not`,
      );
  }
  return mismatches;
}

export function checkBinding(launchpad, store) {
  const { directory, binding } = readBinding(store);
  const declared = readJson(
    join(directory, "resident.json"),
    "resident configuration",
  );
  // The launch line is an instruction to run this store, so the store has to
  // still be one the runtime accepts, not merely readable JSON. A store that
  // no longer decodes is named and its fields are still compared.
  let configuration = declared;
  let undecodable = null;
  try {
    configuration = decodeResidentConfiguration(declared);
  } catch (error) {
    undecodable = error instanceof Error ? error.message : String(error);
  }
  if (binding.kind === "portfolio") {
    const mismatches = portfolioMismatches(
      launchpad,
      declared,
      undecodable ? declared : configuration,
      binding,
    );
    if (!undecodable && configuration.policyId !== binding.policyId)
      mismatches.push(
        `store: resident.json selects policy ${configuration.policyId}; the binding record says ${binding.policyId}`,
      );
    if (undecodable)
      mismatches.unshift(
        `store: resident.json is no longer a resident configuration the runtime accepts: ${undecodable}`,
      );
    return {
      directory,
      binding,
      mismatches,
      notes: [],
      policyId: configuration.policyId,
    };
  }
  const observed = observeBinding(launchpad, binding);
  const mismatches = bindingMismatches(binding, observed, configuration);
  // A mission-shaped record cannot carry a portfolio past the profile rule.
  if (declared?.portfolio !== undefined)
    mismatches.push(
      ...portfolioMismatches(
        launchpad,
        declared,
        undecodable ? declared : configuration,
        binding,
      ),
    );
  if (undecodable)
    mismatches.unshift(
      `store: resident.json is no longer a resident configuration the runtime accepts: ${undecodable}`,
    );
  const notes =
    !mismatches.length &&
    observed.canonical &&
    observed.canonical.sha256 !== binding.canonical.sha256
      ? [
          `  note       the order's control segment gained events since the bind (${binding.canonical.events} → ${observed.canonical.events}) without changing the phase`,
        ]
      : [];
  return {
    directory,
    binding,
    mismatches,
    notes,
    policyId: configuration?.policyId ?? CONTRIBUTOR_MISSION_POLICY,
  };
}

export function main(argv, write = (text) => process.stdout.write(text)) {
  const request = parseArguments(argv);
  const launchpad = findLaunchpad();
  if (request.action === "check") {
    const { directory, binding, mismatches, notes, policyId } = checkBinding(
      launchpad,
      request.store,
    );
    // A retained store may have been moved, and the check admits that. Every
    // command printed here therefore names the directory that was checked; the
    // path the binding was written with stays as provenance (VER-001 F2).
    const provenance = samePath(directory, binding.store)
      ? []
      : [
          `  bound as   ${binding.store} (the store has moved; the lines below name the checked directory)`,
        ];
    const portfolio = binding.kind === "portfolio";
    const subject = portfolio
      ? `portfolio ${binding.portfolioId}`
      : binding.workOrder;
    if (mismatches.length) {
      // A default-sourced model or effort is left to the rebind's default,
      // so a later default change is not recorded as the operator's choice.
      const chosen = (flag, value, source) =>
        source === "default" ? "" : ` ${flag} ${value}`;
      const rebind = portfolio
        ? `node ${shellQuote(bind)} --portfolio ${word(binding.portfolioId)} --template ${shellQuote(binding.templatePath ?? "<resident.json>")} --base ${word(binding.baseCommit)}`
        : `node ${shellQuote(bind)} ${binding.workOrder} --surface ${binding.declaredSurfaces.map(shellQuote).join(" ")} --transport ${binding.transport}${chosen("--model", binding.model, binding.modelSource)}${chosen("--effort", binding.effort, binding.effortSource)}`;
      write(
        `Stale binding for ${subject}: ${directory}\n` +
          `${[
            ...provenance,
            ...mismatches.map((line) => `  mismatch   ${line}`),
          ].join("\n")}\n` +
          `No launch line is printed for a stale binding. Rebind with ${rebind}\n`,
      );
      return 1;
    }
    write(
      `Binding for ${subject} matches canonical state: ${directory}\n` +
        `${[...(portfolio ? describePortfolioBinding(binding) : describeBinding(binding)), ...provenance, ...notes].join("\n")}\n` +
        `${launchLines(directory, policyId).join("\n")}\n`,
    );
    return 0;
  }
  if (request.action === "portfolio") {
    const { binding } = bindPortfolio(launchpad, request);
    write(
      `Bound portfolio ${binding.portfolioId} to ${binding.store}\n` +
        `${describePortfolioBinding(binding).join("\n")}\n` +
        `${launchLines(binding.store, binding.policyId).join("\n")}\n`,
    );
    return 0;
  }
  const { binding, absentSurfaces } = bindOrder(launchpad, request);
  write(
    `Bound ${binding.workOrder} to ${binding.store}\n` +
      `${describeBinding(binding).join("\n")}\n` +
      (absentSurfaces.length
        ? `  note       declared but not present yet: ${absentSurfaces.join(", ")}\n`
        : "") +
      `${launchLines(binding.store).join("\n")}\n`,
  );
  return 0;
}

if (isMainModule(import.meta.url)) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(
      `error: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
