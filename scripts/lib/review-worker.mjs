// The kit's change review, `npm run worker -- review`. It renders one
// canonical brief from the role text, launches one review worker on Codex or
// Claude through the shared worker launch, writes the worker's report where
// the verifier and the close find it, journals the launch in the session's
// harness journal and, in an unhooked Codex session, counts the launch against
// the subagent cap itself (a hooked Claude session counts the command).
import { randomUUID } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, relative, resolve } from "node:path";
import { docPath, docRelative } from "./config.mjs";
import { runGit } from "./git.mjs";
import { workingTree } from "./checkpoint.mjs";
import { containedRegularFile, workOrderAuthorityPath } from "./paths.mjs";
import { createScratchRoot, removeTemporaryPath } from "./temporary-roots.mjs";
import { dispatchSession } from "./dispatch-bound.mjs";
import {
  eventsForOrder,
  latestActivationAt,
  readControl,
} from "./control-store.mjs";
import { readGateChecks } from "./gate-evidence.mjs";
import { formatDuration } from "./duration.mjs";
import { sha256Hex as sha256 } from "./helpers.mjs";
import { parseMarkdown } from "./markdown-links.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import { boundTargetWorktree } from "./target-worktrees.mjs";
import {
  launchWorker,
  readWire,
  resolveWorkerOption,
  workerOptionNamed,
} from "./worker-launch.mjs";
import { dispatchJournalDirectory } from "../../packages/skeleton/src/dispatch-journal.mjs";

const skeleton = (name) =>
  import(`../../packages/skeleton/dist/src/${name}.js`);
const compiler = (name) =>
  import(`../../packages/compiler/dist/src/${name}.js`);

export const REVIEW_HOSTS = {
  claude: "claude-cli-print",
  codex: "codex-cli-exec",
};
const KINDS = ["criteria", "design", "consistency", "combined"];
const refuse = (message) => {
  throw new Error(message);
};

export const REVIEW_USAGE =
  "usage: npm run worker -- review --kind criteria|design|consistency|combined --host codex|claude [--model opus|fable|sol|astra] [--order WO-NNN [--target <repository-id>] | --subject planning [--capture <file>]...] [--since <tree>] [--round N] [--recheck <report>]... [--dry-run]";

/** @param {readonly string[]} args @param {string} [usage] */
export function parseReviewArgs(args, usage = REVIEW_USAGE) {
  const options = { recheck: [], capture: [] };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    const value = () => {
      const next = args[++index];
      if (next === undefined || next.startsWith("--"))
        refuse(`${arg} needs a value; ${usage}`);
      return next;
    };
    if (arg === "--kind") options.kind = value();
    else if (arg === "--host") options.host = value();
    else if (arg === "--model") options.model = value();
    else if (arg === "--order") options.order = value();
    else if (arg === "--target") options.target = value();
    else if (arg === "--subject") options.subject = value();
    else if (arg === "--capture") options.capture.push(value());
    else if (arg === "--since") options.since = value();
    else if (arg === "--round") options.round = value();
    else if (arg === "--recheck") options.recheck.push(value());
    else if (arg === "--dry-run") options.dryRun = true;
    else refuse(`unknown option ${arg}; ${usage}`);
  }
  if (!KINDS.includes(options.kind ?? ""))
    refuse(`--kind must be one of ${KINDS.join(", ")}; ${usage}`);
  if (!Object.hasOwn(REVIEW_HOSTS, options.host ?? ""))
    refuse(`--host must be codex or claude; ${usage}`);
  if (options.order && options.subject)
    refuse(`--order and --subject are exclusive; ${usage}`);
  if (options.subject !== undefined && options.subject !== "planning")
    refuse(`--subject accepts planning only; ${usage}`);
  if (options.order !== undefined && !/^WO-\d{3}$/u.test(options.order))
    refuse(`--order names a work order WO-NNN; ${usage}`);
  if (options.target !== undefined) {
    if (!options.order)
      refuse(
        `--target binds a registered target's order: name it with --order WO-NNN; ${usage}`,
      );
    if (
      options.target === "self" ||
      !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u.test(options.target)
    )
      refuse(`--target names a registered repository id; ${usage}`);
  }
  if (
    options.capture.length &&
    (options.subject !== "planning" || options.kind !== "criteria")
  )
    refuse(
      `--capture carries the operator's dispatch to a planning subject's criteria review: use it with --kind criteria --subject planning; ${usage}`,
    );
  if (options.round !== undefined) {
    if (!/^[1-9]\d{0,2}$/u.test(options.round))
      refuse(`--round is a positive whole number; ${usage}`);
    options.round = Number(options.round);
  }
  if (options.since !== undefined && !/^[0-9a-f]{7,64}$/u.test(options.since))
    refuse(`--since names a commit or tree by its object id; ${usage}`);
  return options;
}

/** The checkout's working tree written as a Git tree; a registered target's
 * worktree is read with the host's safe Git options, since its repository
 * is not the kit's own. */
const snapshot = (resolved, checkout) =>
  workingTree(checkout, resolved.target ? HOST_GIT_READ : []);

const branchOf = (root) =>
  runGit(root, ["rev-parse", "--abbrev-ref", "HEAD"]).trim();

/** The tree an object id names in the checkout's repository, or a refusal
 * naming the flag that gave it. */
function treeOf(checkout, object, flag) {
  const tree = runGit(
    checkout,
    [...HOST_GIT_READ, "rev-parse", "--verify", "--quiet", `${object}^{tree}`],
    { onFailure: () => "" },
  ).trim();
  if (!/^[0-9a-f]{40,64}$/u.test(tree))
    refuse(`${flag} ${object} names no commit or tree in this repository`);
  return tree;
}

/** A registered target's order: its activation names the repository and the
 * base, and the binding release close and target publication use names the
 * worktree on the order's branch. The reviewer reads that worktree, and
 * nothing writes to it. */
function resolveTarget(root, workOrder, repositoryId) {
  let state;
  try {
    state = readControl(root).orders.get(workOrder)?.state;
  } catch (error) {
    refuse(
      `the control record cannot be read, so ${workOrder}'s target cannot be bound: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (!state?.repositoryId)
    refuse(
      `${workOrder} is not an activated target order; --target reviews a registered target's order`,
    );
  if (state.repositoryId !== repositoryId)
    refuse(
      `${workOrder} is activated for target ${state.repositoryId}, not ${repositoryId}`,
    );
  const { target, branch } = boundTargetWorktree(
    root,
    state,
    `then run the review again`,
  );
  return {
    repositoryId,
    worktree: target,
    baseCommit: state.baseCommit,
    branch,
  };
}

/** What is reviewed: the order the flags or the branch name (with the target
 * worktree it changes, for a registered target's order), or a planning
 * branch's documents. */
function resolveSubject(root, options) {
  const branch = branchOf(root);
  if (options.subject === "planning") {
    if (!branch.startsWith("planning/"))
      refuse(
        `--subject planning reviews a planning/ branch; this checkout is on ${branch}`,
      );
    return { subject: "planning", workOrder: null, branch, target: null };
  }
  const workOrder =
    options.order ??
    (/^wo-(\d{3})$/u.exec(branch)?.[1]
      ? `WO-${/^wo-(\d{3})$/u.exec(branch)[1]}`
      : null);
  if (!workOrder)
    refuse(
      `name the reviewed order with --order WO-NNN (branch ${branch} names none) or use --subject planning`,
    );
  const directory = docPath(root, "workOrders");
  const name = existsSync(directory)
    ? readdirSync(directory).find(
        (entry) => entry.startsWith(`${workOrder}-`) && entry.endsWith(".md"),
      )
    : undefined;
  if (!name) refuse(`${workOrder} has no order file under ${directory}`);
  const path = relative(root, join(directory, name));
  workOrderAuthorityPath(root, workOrder, path);
  const target = options.target
    ? resolveTarget(root, workOrder, options.target)
    : null;
  return {
    subject: workOrder,
    workOrder,
    branch: target?.branch ?? branch,
    orderPath: path,
    target,
  };
}

/** The repair a review belongs to, or 0 for the order's execution. A repair
 * starts with each fix dispatch recorded since the order's latest activation
 * and with each failed complete run in this checkout since then, after which
 * the executor's repair takes the ladder again. An unreadable record reads
 * as the execution, where the overwrite refusal still holds. */
export function reviewCycle(root, workOrder) {
  let control;
  try {
    control = readControl(root);
  } catch {
    return 0;
  }
  const events = eventsForOrder(control, workOrder);
  const activation = events.findLastIndex(
    (event) => event.type === "WorkOrderActivated",
  );
  const fixes = events
    .slice(activation + 1)
    .filter((event) => event.type === "RepairRequested").length;
  const since = latestActivationAt(control, workOrder);
  let failedRuns = 0;
  if (since)
    try {
      failedRuns = readGateChecks(root).filter(
        (row) =>
          row.checkId === "npm test" &&
          ["review", "plain"].includes(row.gateSelection) &&
          row.executed === true &&
          row.exitCode !== 0 &&
          String(row.recordedAt ?? "") >= since,
      ).length;
    } catch {
      // An unreadable gate index counts no failed run.
    }
  return fixes + failedRuns;
}

/** The longest name one directory takes on the file systems the kit runs on. */
const MAX_LANE_BYTES = 255;

/** A planning pass's lane is named by its branch, so every pass, a second
 * one on the same day or one that crosses midnight, keeps its own rounds.
 * The lane is `planning-` and the branch's name after `planning/` with each
 * byte of any other character than a letter, digit, dot, underscore or hyphen
 * written as `%` and two hexadecimal digits, as a URL escapes it. A name of
 * those characters alone keeps its spelling, and every lane decodes back to
 * exactly one branch, so two branches never share a lane, whatever either is
 * named. A name too long for one directory is refused before any worker
 * starts. */
function planningLane(branch) {
  const tail = branch.replace(/^planning\//u, "");
  if (!tail) refuse(`the planning branch ${branch} names no reviews lane`);
  const lane = `planning-${tail.replace(/[^A-Za-z0-9._-]/gu, (character) =>
    [...Buffer.from(character, "utf8")]
      .map((byte) => `%${byte.toString(16).toUpperCase().padStart(2, "0")}`)
      .join(""),
  )}`;
  if (lane.length > MAX_LANE_BYTES)
    refuse(
      `the planning branch ${branch} names a reviews lane of ${lane.length} bytes, longer than the ${MAX_LANE_BYTES} a directory name holds; a shorter branch name has a lane`,
    );
  return lane;
}

/** The newest report record in a subject's lane, its since-<tree>/ ladders
 * included and a repair's own lane left out, or null when the lane holds
 * none. */
function lastReview(lane) {
  const paths = [];
  const visit = (directory, nested) => {
    if (!existsSync(directory)) return;
    for (const name of readdirSync(directory)) {
      const path = join(directory, name);
      if (name.endsWith(".json")) paths.push(path);
      else if (!nested && name.startsWith("since-")) visit(path, true);
    }
  };
  visit(lane, false);
  return (
    paths
      .flatMap((path) => {
        try {
          const record = JSON.parse(readFileSync(path, "utf8"));
          return record?.kind === "change-review-report" &&
            typeof record.reviewedTree === "string"
            ? [{ path, record }]
            : [];
        } catch {
          return [];
        }
      })
      .sort((a, b) =>
        String(a.record.endedAt).localeCompare(String(b.record.endedAt)),
      )
      .at(-1) ?? null
  );
}

/** The reviews lane: the order's (a repair's under `repair-<n>/`, so its
 * ladder never replaces the execution's reports), or the planning branch's.
 * A ladder whose round 1 named its base with --since keeps its reports under
 * `since-<tree>/` inside it. Ignored local state; release close moves an
 * order's lane into its retained lane. */
export const reviewsLane = (root, subject, { branch = "", cycle = 0 } = {}) =>
  docRelative(
    root,
    "control",
    `local/reviews/${subject === "planning" ? planningLane(branch) : `${subject}${cycle ? `/repair-${cycle}` : ""}`}`,
  );

/** An earlier report this recheck confirms or refutes, read from its `.json`
 * record, with its findings named by kind and round so several reports'
 * findings stay distinct in one brief, and the digest of the record it read. */
function readPrior(root, path) {
  const absolute = resolve(root, path.replace(/\.md$/u, ".json"));
  if (!containedRegularFile(absolute, root))
    refuse(`--recheck ${path}: no readable report record at ${absolute}`);
  const text = readFileSync(absolute, "utf8");
  let record;
  try {
    record = JSON.parse(text);
  } catch {
    refuse(`--recheck ${path}: the report record is not JSON`);
  }
  if (
    record?.schemaVersion !== 1 ||
    record.kind !== "change-review-report" ||
    !Array.isArray(record.findings) ||
    !KINDS.includes(record.review?.kind) ||
    !Number.isSafeInteger(record.review?.round) ||
    typeof record.reviewedTree !== "string"
  )
    refuse(`--recheck ${path}: not a change review report record`);
  return {
    path: relative(root, absolute),
    record,
    recordSha256: sha256(text),
    findings: record.findings.map((finding) => ({
      ...finding,
      id: `${record.review.kind}.${record.review.round}.${finding.id}`,
    })),
  };
}

const MAX_DOCUMENT_BYTES = 200_000;
const fence = (text) => {
  const longest = Math.max(
    2,
    ...[...text.matchAll(/`+/gu)].map((match) => match[0].length),
  );
  const marks = "`".repeat(longest + 1);
  return `${marks}\n${text.replace(/\n?$/u, "\n")}${marks}`;
};

/** The operator's dispatch captures a planning criteria review carries. Their
 * bytes reach the worker in the brief; a record keeps only their digests. */
function readCaptures(root, paths) {
  return paths.map((path) => {
    const absolute = resolve(root, path);
    let stat;
    try {
      stat = lstatSync(absolute);
    } catch {
      refuse(`--capture ${path}: no such file`);
    }
    if (!stat.isFile()) refuse(`--capture ${path} is not a regular file`);
    if (stat.size > MAX_DOCUMENT_BYTES)
      refuse(
        `--capture ${path} is ${stat.size} bytes; a brief carries at most ${MAX_DOCUMENT_BYTES}`,
      );
    const bytes = readFileSync(absolute);
    return {
      name: basename(absolute),
      text: bytes.toString("utf8"),
      sha256: sha256(bytes),
      bytes: bytes.length,
    };
  });
}

/** The documents a brief carries: the order's text, or the planning
 * branch's changed planning documents and orders. */
function subjectDocuments(root, resolved, since) {
  if (resolved.workOrder)
    return [
      {
        path: resolved.orderPath,
        text: readFileSync(join(root, resolved.orderPath), "utf8"),
      },
    ];
  const changed = runGit(root, [
    "diff",
    "--name-only",
    "--diff-filter=AM",
    since,
    "--",
    relative(root, docPath(root, "planning")),
    relative(root, docPath(root, "workOrders")),
  ])
    .split("\n")
    .concat(
      runGit(root, [
        "ls-files",
        "--others",
        "--exclude-standard",
        "--",
        relative(root, docPath(root, "planning")),
        relative(root, docPath(root, "workOrders")),
      ]).split("\n"),
    )
    .filter((path) => path.endsWith(".md"));
  const unique = [...new Set(changed)].sort();
  if (!unique.length)
    refuse(
      "this planning branch changes no planning document or work order since its base",
    );
  return unique.map((path) => ({
    path,
    text: readFileSync(join(root, path), "utf8"),
  }));
}

/** The inputs a round needs, required rather than defaulted, so a round's
 * brief and record state what it carried: round 1 reviews the whole change, a
 * later round rechecks a named report, and the combined round names an earlier
 * report or its base. The review and record commands apply the same rules. */
function requireRoundInputs(options, round, priors, usage) {
  if (priors.length && round === 1)
    refuse(
      `round 1 reviews the whole change; a recheck is round 2 or later; ${usage}`,
    );
  if (options.kind !== "combined" && round > 1 && !priors.length)
    refuse(
      `round ${round} rechecks an earlier report: name it with --recheck <report>; ${usage}`,
    );
  if (options.kind === "combined" && !priors.length && !options.since)
    refuse(
      `the combined round reads the change since the tree an earlier round reviewed: name that round's report with --recheck or the tree with --since; ${usage}`,
    );
}

/**
 * The round a launch or a record is, its base, its ladder and its lane. Round
 * 1 reviews the whole change against the merge base with main (a registered
 * target's activation base), or against a base named with --since, which
 * starts a ladder of its own under `since-<tree>/`. A recheck reviews the
 * whole change again against its ladder's base and names the tree its earlier
 * round reviewed. The combined round reads the change since that tree, or
 * since its --since base.
 */
function roundPlan(root, checkout, options, resolved, priors, usage) {
  // The combined round is the ladder's third, so it takes that number when
  // nothing it rechecks says otherwise.
  const round =
    options.round ??
    (priors.length
      ? Math.max(...priors.map((report) => report.record.review.round)) + 1
      : options.kind === "combined"
        ? 3
        : 1);
  requireRoundInputs(options, round, priors, usage);
  const latest = priors
    .slice()
    .sort((a, b) =>
      String(a.record.endedAt).localeCompare(String(b.record.endedAt)),
    )
    .at(-1);
  const changeBase = resolved.target
    ? {
        since: resolved.target.baseCommit,
        sinceSource: `the activation base of target ${resolved.target.repositoryId}`,
      }
    : {
        since: runGit(root, ["merge-base", "HEAD", "main"]).trim(),
        sinceSource: "the merge base with main",
      };
  const subjectLane = join(
    root,
    reviewsLane(root, resolved.subject, {
      branch: resolved.branch,
      cycle: resolved.workOrder ? reviewCycle(root, resolved.workOrder) : 0,
    }),
  );
  // Only a round 1 that names its base starts a ladder of its own; the
  // combined round with --since stays the last round of the ladder it ends.
  let ladder = latest?.record.ladder ?? null;
  const opensLadder =
    round === 1 && options.kind !== "combined" && Boolean(options.since);
  if (opensLadder) {
    const tree = treeOf(checkout, options.since, "--since");
    ladder = { base: tree, lane: `since-${tree.slice(0, 12)}` };
  }
  const base = options.since
    ? { since: options.since, sinceSource: "named with --since" }
    : options.kind === "combined" && latest
      ? {
          since: latest.record.reviewedTree,
          sinceSource: `the tree ${latest.path} reviewed`,
        }
      : ladder
        ? {
            since: ladder.base,
            sinceSource: "the base its round 1 named with --since",
          }
        : changeBase;
  treeOf(
    checkout,
    base.since,
    options.since ? "--since" : `the base (${base.sinceSource})`,
  );
  return {
    round,
    latest,
    ladder,
    ...base,
    // A recheck names the tree its earlier round reviewed, so the worker can
    // read what the fixes changed inside the whole change it reviews again.
    priorTree:
      options.kind !== "combined" && latest ? latest.record.reviewedTree : null,
    documentsBase: changeBase.since,
    // A fresh ladder over the very tree the lane last reviewed is a re-roll,
    // which the launch and the record name in an advisory.
    lastReview: opensLadder ? lastReview(subjectLane) : null,
    lane: ladder ? join(subjectLane, ladder.lane) : subjectLane,
  };
}

/** The advisory a fresh --since round 1 earns when it reviews the tree its
 * lane's last report already reviewed: nothing in it is newer. */
const rerollAdvisory = (root, plan, reviewedTree) =>
  plan.lastReview && plan.lastReview.record.reviewedTree === reviewedTree
    ? `DotLn advisory: this fresh round 1 reviews tree ${reviewedTree}, which ${relative(root, plan.lastReview.path)} already reviewed; nothing in it is newer than that review.\n`
    : "";

/** The round's instruction, stated from what this launch actually carries: a
 * recheck names its earlier findings and reads the whole change again, and
 * the combined round names its base and lists earlier findings only when a
 * report was given. */
const ladderRule = ({ kind, round, priors, sinceSource }, admission) => {
  const rule = `${admission[0].toUpperCase()}${admission.slice(1)}.`;
  if (kind === "combined")
    return `This is the last round: one combined review carrying all three briefs over the change since the base below (${sinceSource}). ${rule}${priors.length ? " Recheck the earlier findings listed below where they bear on that change." : ""}`;
  if (round === 1)
    return "This is round 1: review the whole change against its base under your brief.";
  return `This is round ${round}, a recheck: first confirm or refute the fixes of the earlier findings listed below on the current tree, then review the whole current change against the base below again under your brief. ${rule}`;
};

/** One finding as a Markdown list item, in the brief and in the report. */
const findingLine = (finding) =>
  `- **${finding.id}** (${finding.severity}${finding.basis ? `; ${"criterion" in finding.basis ? `criterion ${finding.basis.criterion}` : `regression: ${finding.basis.regression}`}` : ""}) \`${finding.file || "no single file"}${finding.line ? `:${finding.line}` : ""}\`: ${finding.summary}`;

const ITEM_DISPOSITIONS = ["acted on", "reviewed", "missing"];
/** What a report owes beyond its findings, told to the worker in the brief
 * and checked by `reportRefusal` before anything is recorded. */
const reportRules = (kind, captured) => [
  ...(kind === "consistency"
    ? [
        "End your report with this table, one row per consumer you traced, each naming the command you ran and what it showed; the generated pages and fixture manifests rows are required, and a consistency report without the table is not recorded:",
        "",
        "## Traced consumers",
        "",
        "| Changed contract | Consumer | Command | Result |",
        "| --- | --- | --- | --- |",
        "| generated pages | <path> | <command> | <result> |",
        "| fixture manifests | <path> | <command> | <result> |",
        "",
      ]
    : []),
  ...(captured
    ? [
        "The operator's dispatch for this pass closes this brief. Answer every item and every later message in it in this table, saying where the subject acts on it or reviews it, or `missing`; quote none of the operator's words in your report, and name each item by its number and the subject's location:",
        "",
        "## Items",
        "",
        "| Item | Location in the subject | Disposition |",
        "| --- | --- | --- |",
        `| <number> | <document and section, or order and step> | ${ITEM_DISPOSITIONS.join(", ")} |`,
        "",
      ]
    : []),
];

/** The canonical brief, rendered from the generated worker definition, the
 * executor's reviewer briefs and admission rule, the subject and its diff; a
 * planning criteria review given the operator's dispatch ends with it. The
 * record keeps `recordedBrief`, the same brief with the dispatch's bytes
 * replaced by their digests. */
export async function renderReviewBrief(
  root,
  {
    kind,
    round,
    resolved,
    since,
    sinceSource,
    reviewedTree,
    priorTree = null,
    stat,
    priors,
    documents,
    captures = [],
  },
) {
  const { reviewerBriefs, reviewAdmissionRule, contributorConfiguredProgram } =
    await skeleton("loadouts/contributor");
  const { workerSpecification } = await compiler("harness");
  const worker = contributorConfiguredProgram().workers.find(
    (entry) => entry.name === "dotln-worker",
  );
  if (!worker) refuse("the generated dotln-worker definition is missing");
  const briefs =
    kind === "combined"
      ? ["criteria", "design", "consistency"].map(
          (name) => `- **${name}:** ${reviewerBriefs[name]}`,
        )
      : [reviewerBriefs[kind]];
  const prior = priors.flatMap((report) => report.findings);
  const checkout = resolved.target?.worktree ?? root;
  const rules = reportRules(kind, captures.length > 0);
  const head = [
    `# Change review: ${kind}, round ${round}, ${resolved.workOrder ?? `planning branch ${resolved.branch}`}`,
    "",
    "## Worker",
    "",
    workerSpecification(worker).prompt,
    "",
    "You are one fresh, independent review worker launched by the kit's change review helper. You read this checkout and change nothing in it: no edits, no commits, no index or ref writes, and no command that writes outside your system temporary directory. Under a read-only sandbox a probe that must write may be refused; then judge by reading and say so in your report.",
    "",
    `## Brief${kind === "combined" ? "s" : ""}`,
    "",
    ...briefs,
    "",
    "## Round",
    "",
    ladderRule({ kind, round, priors, sinceSource }, reviewAdmissionRule),
    "",
    "## Change",
    "",
    ...(resolved.target
      ? [
          `This is ${resolved.workOrder}'s change in registered target ${resolved.target.repositoryId}: the checkout below is that target's worktree on ${resolved.target.branch}, and the order is the launchpad's, at ${root}.`,
          "",
        ]
      : []),
    `The checkout is ${checkout}. The reviewed tree is ${reviewedTree}: this checkout's working tree, untracked files included and ignored files left out, written as a Git tree. The base is ${since} (${sinceSource}). Read the change with \`git diff ${since} ${reviewedTree} -- <path>\` and the files themselves, and open your report with the line \`Reviewed tree: ${reviewedTree}\`.${priorTree ? ` The earlier round reviewed tree ${priorTree}; \`git diff ${priorTree} ${reviewedTree}\` shows what its fixes changed.` : ""} The stat is:`,
    "",
    fence(stat.trim() || "(no change)"),
    ...(prior.length
      ? [
          "",
          "## Earlier findings",
          "",
          ...priors.map(
            (report) =>
              `From ${report.path} (${report.record.review.kind}, round ${report.record.review.round}, tree ${report.record.reviewedTree}):`,
          ),
          "",
          ...prior.map(findingLine),
        ]
      : []),
    "",
    `## ${resolved.workOrder ? "The order" : "The planning documents"}`,
    "",
    ...documents.flatMap((document) =>
      Buffer.byteLength(document.text) > MAX_DOCUMENT_BYTES
        ? [
            `${document.path} is ${Buffer.byteLength(document.text)} bytes; read it from the checkout.`,
            "",
          ]
        : [`${document.path}:`, "", fence(document.text), ""],
    ),
    ...(rules.length ? ["## Report", "", ...rules] : []),
  ].join("\n");
  if (!captures.length) return { brief: head, recordedBrief: head };
  const label = (capture) =>
    `${capture.name}, ${capture.bytes} bytes, sha256 ${capture.sha256}:`;
  const dispatch = (body) =>
    [
      "",
      "## The operator's dispatch",
      "",
      ...captures.flatMap((capture, index) => [
        ...(index ? [""] : []),
        label(capture),
        "",
        body(capture),
      ]),
    ].join("\n");
  return {
    // The dispatch closes the brief exactly as the operator wrote it.
    brief: `${head}${dispatch((capture) => capture.text)}`,
    recordedBrief: `${head}${dispatch(() => "(carried to the worker; its bytes are not recorded)")}`,
  };
}

/** One Markdown pipe table under a heading named `title`: its header cells
 * and its rows' cells, or null when no such table follows the heading. */
function tableUnder(text, title) {
  // Only an actual report section can supply its table. Code, quotations and
  // HTML examples have different block nodes even when their text matches.
  const blocks = parseMarkdown(text).children;
  const heading = blocks.findIndex(
    (node) =>
      node.type === "heading" &&
      new RegExp(`^ {0,3}#{1,6}[ \\t]+${title}\\b`, "iu").test(
        text.slice(node.position.start.offset, node.position.end.offset),
      ),
  );
  if (heading < 0) return null;
  const table = blocks[heading + 1];
  if (table?.type !== "table") return null;
  const lines = text
    .slice(table.position.start.offset, table.position.end.offset)
    .split(/\r?\n/u);
  const cells = (line) =>
    line
      .trim()
      .replace(/^\|/u, "")
      .replace(/(?<!\\)\|$/u, "")
      .split(/(?<!\\)\|/u)
      .map((cell) => cell.trim());
  let index = 0;
  const rows = [];
  while (index < lines.length && lines[index].trim().startsWith("|"))
    rows.push(lines[index++]);
  if (
    rows.length < 2 ||
    !cells(rows[1]).every((cell) => /^:?-+:?$/u.test(cell))
  )
    return null;
  return { header: cells(rows[0]), rows: rows.slice(2).map(cells) };
}
/** A cell's words without Markdown emphasis or code marks; a cell still
 * holding the brief's `<placeholder>` says nothing. */
const plain = (cell) => {
  const words = (cell ?? "").replace(/[`*_]/gu, "").trim();
  return /^<[^<>]*>$/u.test(words) ? "" : words;
};
/** Whether a cell says what was done or found: a dash, a question mark or a
 * word for nothing done (n/a, not run, tbd) says nothing, while "none" can
 * be a command's result, such as a search that found nothing. */
const NOTHING =
  /^(?:[-\u2013\u2014.?]+|n\/?a|none|not run|not checked|tbd|todo|skipped)$/iu;
const filled = (cell, { noneIsResult = false } = {}) => {
  const words = plain(cell);
  return (
    Boolean(words) &&
    (!NOTHING.test(words) || (noneIsResult && /^none$/iu.test(words)))
  );
};
/** Each required column's index in a table's header, read from the one cell
 * that names it: a column no cell names is missing, and one that two cells
 * name, or that shares its cell with another column, is ambiguous, so every
 * required cell of a row is read from a column of its own. */
function headerColumns(header, required) {
  const names = header.map((cell) => plain(cell));
  const hits = required.map(([, pattern]) =>
    names.flatMap((name, index) => (pattern.test(name) ? [index] : [])),
  );
  const all = hits.flat();
  const shared = new Set(all.filter((index, at) => all.indexOf(index) !== at));
  return {
    missing: required.filter((_, at) => !hits[at].length).map(([name]) => name),
    ambiguous: required
      .filter(
        (_, at) =>
          hits[at].length > 1 || hits[at].some((index) => shared.has(index)),
      )
      .map(([name]) => name),
    columns: hits.map((list) => list[0]),
  };
}

/** Why a consistency report cannot be recorded: its `Traced consumers` table
 * is missing, lacks a column, is empty, leaves a consumer, command or result
 * unfilled, or has no generated pages or fixture manifests row. Null when it
 * is whole. */
export function tracedConsumersRefusal(text) {
  const named =
    "a consistency report carries a `Traced consumers` table (changed contract, consumer, command, result)";
  const table = tableUnder(text, "Traced consumers");
  if (!table) return `${named}, and this report has none`;
  const { missing, ambiguous, columns } = headerColumns(table.header, [
    ["changed contract", /contract/iu],
    ["consumer", /consumer/iu],
    ["command", /command/iu],
    ["result", /result/iu],
  ]);
  if (missing.length)
    return `${named}; this report's table has no ${missing.join(", ")} column`;
  if (ambiguous.length)
    return `${named}, each in a column of its own; this report's table names ${ambiguous.join(" and ")} in a shared or repeated header cell`;
  const rows = table.rows.filter((row) => row.some((cell) => plain(cell)));
  if (!rows.length)
    return `the \`Traced consumers\` table is empty: ${named} with a row for each consumer traced`;
  // A row traces one consumer: it names the consumer, the command run on it
  // and what that showed.
  const unfilled = rows.filter(
    (row) =>
      !filled(row[columns[1]]) ||
      !filled(row[columns[2]]) ||
      !filled(row[columns[3]], { noneIsResult: true }),
  );
  if (unfilled.length)
    return `the \`Traced consumers\` table has ${unfilled.length} row${unfilled.length === 1 ? "" : "s"} without the consumer traced, the command run or its result`;
  for (const [name, pattern] of [
    ["generated pages", /generated page/iu],
    ["fixture manifests", /fixture manifest/iu],
  ])
    if (!rows.some((row) => pattern.test(plain(row[columns[0]]))))
      return `the \`Traced consumers\` table has no ${name} row; name the command run there and its result`;
  return null;
}

/** The `## Items` table a criteria review given the operator's dispatch
 * returns: a refusal when it is missing, lacks a column, is empty, names a
 * disposition outside acted on, reviewed and missing, leaves a row's item
 * unnamed, or leaves an acted-on or reviewed row without its location in the
 * subject (a missing item has none); else the items it names. */
export function itemsTable(text) {
  const named =
    "a criteria review given the operator's dispatch answers it in an `## Items` table (item, location in the subject, disposition)";
  const table = tableUnder(text, "Items");
  if (!table) return { refusal: `${named}, and this report has none` };
  const { missing, ambiguous, columns } = headerColumns(table.header, [
    ["item", /item/iu],
    ["location", /location|where/iu],
    ["disposition", /disposition|status/iu],
  ]);
  if (missing.length)
    return {
      refusal: `${named}; this report's table lacks one of those columns`,
    };
  if (ambiguous.length)
    return {
      refusal: `${named}, each in a column of its own; this report's table names ${ambiguous.join(" and ")} in a shared or repeated header cell`,
    };
  const rows = table.rows.filter((row) => row.some((cell) => plain(cell)));
  if (!rows.length)
    return { refusal: `the \`## Items\` table is empty: ${named}` };
  const outside = rows.filter(
    (row) => !ITEM_DISPOSITIONS.includes(plain(row[columns[2]]).toLowerCase()),
  );
  if (outside.length)
    return {
      refusal: `the \`## Items\` table's disposition is one of ${ITEM_DISPOSITIONS.join(", ")}; ${outside.length} row${outside.length === 1 ? "" : "s"} name${outside.length === 1 ? "s" : ""} another`,
    };
  const count = (list, noun) =>
    `${list.length} ${noun}${list.length === 1 ? "" : "s"}`;
  const unnamed = rows.filter((row) => !filled(row[columns[0]]));
  if (unnamed.length)
    return {
      refusal: `the \`## Items\` table has ${count(unnamed, "row")} that name${unnamed.length === 1 ? "s" : ""} no item`,
    };
  const unplaced = rows.filter(
    (row) =>
      plain(row[columns[2]]).toLowerCase() !== "missing" &&
      !filled(row[columns[1]]),
  );
  if (unplaced.length)
    return {
      refusal: `the \`## Items\` table has ${count(unplaced, "acted-on or reviewed row")} without the item's location in the subject`,
    };
  return { refusal: null, items: rows.map((row) => plain(row[columns[0]])) };
}

const OMITTED = "[the operator's words, omitted]";
const ITEM_MARKER =
  /^\s*(?:>\s*)*(?:[-*+]|\(?\d{1,3}(?:\.\d{1,3})*[.)]?|[a-z][.)])\s+/u;
/** A text's words, lowercased, with their spans. A JSON escape reads as a
 * space, so words quoted inside a findings object's report field match as
 * they do in prose. */
const wordSpans = (text) => {
  const view = text.replace(/\\(?:u[0-9a-fA-F]{4}|[nrtbf"\\/])/gu, (escape) =>
    " ".repeat(escape.length),
  );
  return [...view.matchAll(/[\p{L}\p{N}]+(?:['\u2019-][\p{L}\p{N}]+)*/gu)].map(
    (match) => ({
      word: match[0].toLowerCase(),
      start: match.index,
      end: match.index + match[0].length,
    }),
  );
};
/** Every string the record keeps from the worker's return, with each passage
 * it quotes from the operator's captures replaced, so no record keeps the
 * operator's words: the report, each finding's summary, file and basis, each
 * recheck's note, each path read and the returned text; only the identifiers
 * and the closed words (severity, outcome) stay as they are. Also how many
 * passages the return held: in its returned text when the record keeps one,
 * else in those fields. A passage is any run of six or more consecutive words
 * of a capture line, its item marker left out and whatever marks or
 * punctuation surround the words, or the three to five words of a whole line
 * of twenty characters or more, marker included, quoted with or without the
 * marker; a shorter line (a heading, a bare item number) is no quotation, and
 * neither are the words the brief's own report rules gave the worker, such as
 * a table's header, even where a capture repeats them. */
function omitDispatch(
  captures,
  kind,
  { report, text, findings, rechecks, filesRead },
) {
  const RUN = 6;
  // The brief's own report rules: words a capture shares with them are the
  // protocol's, which the report must keep for its tables to stand.
  const protocol = new Set();
  const ruled = wordSpans(reportRules(kind, true).join("\n")).map(
    (span) => span.word,
  );
  for (let size = 3; size <= RUN; size++)
    for (let index = 0; index + size <= ruled.length; index++)
      protocol.add(ruled.slice(index, index + size).join(" "));
  const runs = new Set();
  const lines = new Set();
  for (const capture of captures)
    for (const line of capture.text.split(/\r?\n/u)) {
      // An item's marker (a bullet, a number such as 1. or 6.1, a letter
      // such as a)) is not one of its words, so the item's own text quoted
      // without it is found.
      const item = line.replace(ITEM_MARKER, "");
      const words = wordSpans(item).map((span) => span.word);
      if (words.length >= RUN)
        for (let index = 0; index + RUN <= words.length; index++) {
          const run = words.slice(index, index + RUN).join(" ");
          if (!protocol.has(run)) runs.add(run);
        }
      else if (
        words.length >= 3 &&
        line.trim().length >= 20 &&
        !protocol.has(words.join(" "))
      )
        lines.add(words.join(" "));
    }
  const omit = (value) => {
    const body = String(value ?? "");
    const spans = wordSpans(body);
    const joined = (from, size) =>
      spans
        .slice(from, from + size)
        .map((span) => span.word)
        .join(" ");
    const cuts = [];
    for (let index = 0; index < spans.length;) {
      // The longest run of overlapping quoted windows that starts here.
      let last = -1;
      for (
        let window = index;
        window + RUN <= spans.length && runs.has(joined(window, RUN));
        window++
      )
        last = window + RUN - 1;
      if (last < 0)
        for (const size of [5, 4, 3])
          if (index + size <= spans.length && lines.has(joined(index, size))) {
            last = index + size - 1;
            break;
          }
      if (last < 0) {
        index++;
        continue;
      }
      cuts.push([spans[index].start, spans[last].end]);
      index = last + 1;
    }
    let kept = "";
    let at = 0;
    for (const [from, to] of cuts) {
      kept += `${body.slice(at, from)}${OMITTED}`;
      at = to;
    }
    return { body: `${kept}${body.slice(at)}`, count: cuts.length };
  };
  let found = 0;
  const keep = (value) => {
    const kept = omit(value);
    found += kept.count;
    return kept.body;
  };
  const kept = {
    report: keep(report),
    findings: findings.map((finding) => ({
      ...finding,
      summary: keep(finding.summary),
      file: keep(finding.file),
      basis:
        finding.basis &&
        Object.fromEntries(
          Object.entries(finding.basis).map(([key, value]) => [
            key,
            keep(value),
          ]),
        ),
    })),
    rechecks: rechecks.map((recheck) => ({
      ...recheck,
      note: keep(recheck.note),
    })),
    filesRead: filesRead.map(keep),
  };
  if (text === undefined) return { ...kept, text: undefined, count: found };
  const returned = omit(text);
  return { ...kept, text: returned.body, count: returned.count };
}
const omittedAdvisory = (count) =>
  count
    ? `DotLn advisory: ${count} quoted passage${count === 1 ? "" : "s"} of the operator's dispatch ${count === 1 ? "was" : "were"} omitted from the record.\n`
    : "";

/** Why a returned report cannot be recorded as this review, or null. */
function reportRefusal(kind, captured, text) {
  if (kind === "consistency") {
    const reason = tracedConsumersRefusal(text);
    if (reason) return reason;
  }
  return captured ? itemsTable(text).refusal : null;
}

/** Why a report cannot be recorded: the rules it fails as returned, or those
 * the body to be written fails once the dispatch's quoted words are omitted
 * from it, so a recorded report always meets them. */
function recordedReportRefusal(kind, captured, returned, written) {
  const refusal = reportRefusal(kind, captured, returned);
  if (refusal) return refusal;
  const kept = reportRefusal(kind, captured, written);
  return kept ? `with the operator's quoted words omitted, ${kept}` : null;
}

/** The numbered items of the operator's captures that an `## Items` table
 * names no row for: a reading aid for the executor, never a refusal, since a
 * capture's numbering is the operator's own and may count other things. */
function unansweredItems(captures, text) {
  if (!captures.length) return [];
  const answered = new Set(
    (itemsTable(text).items ?? []).flatMap(
      (item) => /\d{1,3}/u.exec(item)?.[0] ?? [],
    ),
  );
  const numbered = captures.flatMap((capture) =>
    [...capture.text.matchAll(/^\s{0,3}(\d{1,3})[.)]\s/gmu)].map(
      (match) => match[1],
    ),
  );
  return [...new Set(numbered)].filter((item) => !answered.has(item));
}

/** One row in the session's harness journal, the same file the hooks write,
 * so `harness usage` and a verifier read the launch beside the session's
 * other calls. Without a session variable there is no journal to write. */
function journalLaunch(root, row) {
  const session = dispatchSession();
  if (!session) return null;
  const directory = dispatchJournalDirectory(root);
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const key = sha256(session);
  const path = join(directory, `${key}.jsonl`);
  if (existsSync(path) && !lstatSync(path).isFile())
    refuse("the session journal is not a regular file");
  appendFileSync(
    path,
    JSON.stringify({
      recordedAt: new Date().toISOString(),
      event: "WorkerLaunched",
      // The session by the key its journal is filed under, never its raw id.
      session: key,
      ...row,
    }) + "\n",
    { mode: 0o600 },
  );
  return path;
}

/** Under Codex no hook sees the command, so the helper charges its own launch
 * to the session's counter before any process starts, with the hook's refusal
 * past the cap. A hooked session has already counted the command. */
async function admitCodexLaunch(root, host) {
  const session = process.env.CODEX_THREAD_ID;
  if (!session) return null;
  const { admitSubagentTool, admitDrivenTool, initializeSubagentCounter } =
    await skeleton("subagent-budget");
  // A Codex session that began no lifecycle dispatch has no counter yet;
  // creating it keeps any existing counts and makes the count hold anyway.
  const missing = initializeSubagentCounter(
    dispatchJournalDirectory(root),
    session,
  );
  if (missing) return { advisory: `DotLn advisory: subagent ${missing}.` };
  const input = {
    session_id: session,
    tool_use_id: `worker-review:${randomUUID()}`,
  };
  const kit = { uses: 1, host };
  const admission = admitSubagentTool(
    root,
    dispatchJournalDirectory(root),
    input,
    false,
    { kit },
  );
  if (admission.refusal) return admission;
  const driven = admitDrivenTool(input, false, { kit });
  return driven?.refusal ? driven : admission;
}

const SOURCE_TEXT = {
  "command-line": "pinned on the command line",
  "generated-definition": "from the generated worker definition",
  "host-default": "the host's default",
  "recorder-attested": "as the recorder attests",
};
const SELECTION_TEXT = {
  "model-flag": "named with --model",
  "dispatch-word": "named by the session's dispatch line",
  "host-default": "the host's default",
  "recorder-attested": "named with --model on record",
};

/** The Markdown report of one record, the helper's own and the one an
 * executor writes for an Agent-route worker's returned text. */
export function renderReport(record) {
  const counts = (severity) =>
    record.findings.filter((finding) => finding.severity === severity).length;
  const tokens = record.tokens.value ?? "unknown";
  return [
    `# Change review: ${record.review.kind}, round ${record.review.round}, ${record.workOrder ?? `planning branch ${record.branch}`}`,
    "",
    `- Host: ${record.host} (\`${record.transport}\` ${record.harnessVersion}); model \`${record.model.value}\` at effort \`${record.effort.value}\`, ${SOURCE_TEXT[record.model.source] ?? record.model.source}${record.option ? `; option ${record.option.name}, ${SELECTION_TEXT[record.option.selection] ?? record.option.selection}` : ""}; host readback: ${record.readback ? record.readback.models.join(", ") : "none printed"}; effective effort unknown.`,
    ...(record.target
      ? [
          `- Target: ${record.target.repositoryId}, worktree \`${record.target.worktree}\`, activation base \`${record.target.baseCommit}\`.`,
        ]
      : []),
    `- Reviewed tree \`${record.reviewedTree}\`${record.reviewedTreeSource ? ` (${record.reviewedTreeSource})` : ""} against \`${record.since}\` (${record.sinceSource})${record.priorReviewedTree ? `; the earlier round reviewed \`${record.priorReviewedTree}\`` : ""}${record.ladder ? `; its ladder's base \`${record.ladder.base}\`` : ""}.`,
    `- Started ${record.startedAt}, ended ${record.endedAt}: ${formatDuration(record.durationMs)}; tokens ${tokens} (${record.tokens.source}).`,
    `- Findings: ${record.findings.length} (${counts("blocking")} blocking, ${counts("should-fix")} should-fix, ${counts("note")} notes).`,
    `- Checkout: ${record.checkout.unchanged ? "unchanged across the episode" : `its contents changed during the episode, by the worker or another writer: ${record.checkout.changed.join(", ")}`}.`,
    ...(record.prior.length
      ? [`- Rechecked: ${record.prior.join(", ")}.`]
      : []),
    ...(record.captures?.length
      ? [
          `- The operator's dispatch: ${record.captures.map((capture) => `${capture.bytes} bytes, sha256 \`${capture.sha256}\``).join("; ")}; its bytes are not recorded.`,
        ]
      : []),
    "",
    "## Findings",
    "",
    ...(record.findings.length ? record.findings.map(findingLine) : ["None."]),
    ...(record.priorFindingIds.length
      ? [
          "",
          "## Rechecks",
          "",
          ...record.priorFindingIds.map((id) => {
            const judged = record.rechecks.find((row) => row.id === id);
            return judged
              ? `- ${id}: ${judged.outcome}. ${judged.note}`
              : `- ${id}: not judged by the worker.`;
          }),
        ]
      : []),
    "",
    "## Files read",
    "",
    ...(record.filesRead.length
      ? record.filesRead.map((path) => `- \`${path}\``)
      : ["None reported."]),
    "",
    "## The worker's report",
    "",
    record.report.trim() || "(empty)",
    "",
  ].join("\n");
}

/** The record fields every route writes for one round: its base, ladder,
 * target, the reports it answered and the dispatch it carried by digest. */
const roundFields = (plan, resolved, priors, captures) => ({
  since: plan.since,
  sinceSource: plan.sinceSource,
  priorReviewedTree: plan.priorTree,
  ladder: plan.ladder,
  target: resolved.target
    ? {
        repositoryId: resolved.target.repositoryId,
        worktree: resolved.target.worktree,
        baseCommit: resolved.target.baseCommit,
      }
    : null,
  prior: priors.map((report) => report.path),
  answered: priors.map((report) => ({
    path: report.path,
    recordSha256: report.recordSha256,
  })),
  captures: captures.map(({ sha256: digest, bytes }) => ({
    sha256: digest,
    bytes,
  })),
});

/**
 * Run one change review. Returns the printed line and the written paths; a
 * dry run returns the argv it would launch and the brief it renders and writes
 * no report (the reviewed tree's objects still land in the repository's
 * object store).
 * @param {string} root
 * @param {readonly string[]} args
 * @param {{write?: (text: string) => void}} [io]
 */
export async function runChangeReview(
  root,
  args,
  { write = (text) => process.stdout.write(text) } = {},
) {
  root = realpathSync(root);
  const options = parseReviewArgs(args);
  const resolved = resolveSubject(root, options);
  const checkout = resolved.target?.worktree ?? root;
  const priors = options.recheck.map((path) => readPrior(root, path));
  const plan = roundPlan(
    root,
    checkout,
    options,
    resolved,
    priors,
    REVIEW_USAGE,
  );
  const { round, since, sinceSource, lane } = plan;
  const option = await resolveWorkerOption(root, options.host, options.model);
  const captures = readCaptures(root, options.capture);
  const reviewedTree = snapshot(resolved, checkout);
  const stat = runGit(checkout, [
    ...HOST_GIT_READ,
    "diff",
    "--stat=160,120",
    "--find-renames",
    since,
    reviewedTree,
  ]);
  // A planning branch's documents are what the branch changed since its base,
  // whatever a recheck's narrower delta touched.
  const documents = subjectDocuments(root, resolved, plan.documentsBase);
  const { brief, recordedBrief } = await renderReviewBrief(root, {
    kind: options.kind,
    round,
    resolved,
    since,
    sinceSource,
    reviewedTree,
    priorTree: plan.priorTree,
    stat,
    priors,
    documents,
    captures,
  });
  const { CHANGE_REVIEW_TOOLS, CHANGE_REVIEW_EFFECT } = await skeleton(
    "change-review-protocol",
  );
  const fixture = process.env.DOTLN_WORKER_FIXTURE;
  const transport = fixture ? "fake" : REVIEW_HOSTS[options.host];
  const name = `round-${round}-${options.kind}`;
  const reportPath = join(lane, `${name}.md`);
  const jsonPath = join(lane, `${name}.json`);
  // A report is the record a verifier reads; a second launch under the same
  // name never replaces it.
  if (!options.dryRun && (existsSync(reportPath) || existsSync(jsonPath)))
    refuse(
      `${relative(root, reportPath)} already holds this round's ${options.kind} report; a later round takes the next --round, a fresh round 1 names its base with --since, and a report you mean to replace is removed by hand first`,
    );
  const priorFindingIds = priors.flatMap((report) =>
    report.findings.map((finding) => finding.id),
  );
  const episode = `${resolved.subject.toLowerCase()}_${name}_${randomUUID().slice(0, 8)}`;
  // The transport writes its wire records here; it is removed afterward.
  const wireDirectory = createScratchRoot(
    join(tmpdir(), "dotln-review-capture-"),
  );
  try {
    const request = {
      kind: "change-review",
      command: {
        commandId: `cmd_review_${episode}`,
        workstreamId: "ws_change_review",
        intent: {
          kind: "Act",
          effect: CHANGE_REVIEW_EFFECT,
          payload: { subject: resolved.subject, kind: options.kind, round },
        },
      },
      episodeId: `ep_review_${episode}`.replace(/[^a-zA-Z0-9_-]/gu, "_"),
      model: option.model,
      effort: option.effort,
      cwd: checkout,
      capture: wireDirectory,
      review: {
        kind: options.kind,
        round,
        subject: resolved.subject,
        priorFindingIds,
      },
      brief,
      profile: {
        profileId: "change-review-v1",
        modelTools: [...CHANGE_REVIEW_TOOLS],
      },
    };
    if (options.dryRun) {
      // The argv does not depend on the CLI's version, so a dry run reads
      // none and runs no CLI; the recorded observation stands in for it.
      const { canonicalWorkerArgs, OBSERVED_CLI_VERSIONS } =
        await skeleton("worker-transport");
      const argv = canonicalWorkerArgs(
        REVIEW_HOSTS[options.host],
        request,
        "<output schema file>",
        OBSERVED_CLI_VERSIONS[options.host],
      );
      const dry = {
        dryRun: true,
        host: options.host,
        binary: options.host,
        option: { name: option.name, selection: option.selection },
        argv,
        report: relative(root, reportPath),
        since,
        reviewedTree,
        briefSha256: sha256(brief),
        ...(rerollAdvisory(root, plan, reviewedTree)
          ? { advisory: rerollAdvisory(root, plan, reviewedTree).trim() }
          : {}),
        brief,
      };
      write(`${JSON.stringify(dry)}\n`);
      return dry;
    }
    const admission = await admitCodexLaunch(root, options.host);
    if (admission?.refusal) {
      write(`${admission.refusal}\n`);
      return { refused: admission.refusal };
    }
    if (admission?.advisory) write(`${admission.advisory}\n`);
    const attemptStarted = new Date();
    let launched;
    let failure = null;
    try {
      launched = await launchWorker(root, request, {
        transport,
        role: `review-${options.kind}`,
        dispatch: request.episodeId,
        workOrder: resolved.workOrder,
        label: "review worker",
        fake: async () => {
          const { fakeReviewTransport } =
            await import("./review-worker-fake.mjs");
          return fakeReviewTransport(fixture, request);
        },
      });
    } catch (error) {
      failure = error instanceof Error ? error.message : String(error);
    }
    // The checkout's contents are compared, not its status lines, so a
    // change to an already modified or untracked file is seen too.
    const afterTree = snapshot(resolved, checkout);
    const changed =
      afterTree === reviewedTree
        ? []
        : runGit(checkout, [
            ...HOST_GIT_READ,
            "diff",
            "--name-only",
            reviewedTree,
            afterTree,
          ])
            .split("\n")
            .filter(Boolean);
    const wire = launched ? readWire(wireDirectory, launched.transport) : null;
    const host = {
      host: options.host,
      transport: launched?.transport ?? transport,
      harnessVersion: launched?.harnessVersion ?? "unknown",
      model: { value: option.model, source: "command-line" },
      effort: { value: option.effort, source: "command-line" },
      option: { name: option.name, selection: option.selection },
      readback: wire?.models?.length
        ? { models: wire.models, source: "claude-print-result-modelUsage" }
        : null,
    };
    // A usage observation carries its counters under `usage`.
    const tokens = {
      value: launched?.usage?.usage?.totalTokens ?? null,
      source: launched?.usage?.source ?? "unavailable",
    };
    const attemptEnded = new Date();
    const journalBase = {
      workOrder: resolved.workOrder,
      subject: resolved.subject,
      branch: resolved.branch,
      ...(resolved.target ? { target: resolved.target.repositoryId } : {}),
      kind: options.kind,
      round,
      ...host,
      startedAt: launched?.startedAt ?? attemptStarted.toISOString(),
      endedAt: launched?.endedAt ?? attemptEnded.toISOString(),
      durationMs: launched?.durationMs ?? attemptEnded - attemptStarted,
      tokens,
      costUsd: wire?.costUsd ?? null,
    };
    // A journal that cannot take the row costs an advisory, never the line
    // or the report the caller reads.
    const journal = (row) => {
      try {
        journalLaunch(root, { ...journalBase, ...row });
        return "";
      } catch (error) {
        return `DotLn advisory: the launch was not journaled: ${error instanceof Error ? error.message : String(error)}.\n`;
      }
    };
    if (!launched) {
      const line = `review: ${options.kind} round ${round}: the worker returned no report (${failure}); ${formatDuration(journalBase.durationMs)}; nothing written to ${relative(root, lane)}`;
      const advisory = journal({ outcome: "no-report", failure });
      write(`${line}\n${advisory}`);
      return { line, report: null, failure };
    }
    const result = launched.returned;
    // No record keeps a passage of the operator's dispatch the worker quoted,
    // and the report written meets the rules the returned one met.
    const omitted = omitDispatch(captures, options.kind, {
      report: result.report,
      findings: result.findings,
      rechecks: result.rechecks,
      filesRead: result.filesRead,
    });
    const refusal = recordedReportRefusal(
      options.kind,
      captures.length > 0,
      result.report,
      omitted.report,
    );
    if (refusal) {
      // A report that lacks what its brief required is not a review: the
      // round is run again, and the findings it returned are only counted.
      const line = `review: ${options.kind} round ${round}: the worker's report is refused, since ${refusal}; it returned ${result.findings.length} findings; ${formatDuration(launched.durationMs)}; nothing written to ${relative(root, lane)}`;
      const advisory = journal({
        outcome: "refused-report",
        failure: refusal,
        findings: result.findings.length,
      });
      write(`${line}\n${advisory}`);
      return { line, report: null, failure: refusal };
    }
    const record = {
      schemaVersion: 1,
      kind: "change-review-report",
      workOrder: resolved.workOrder,
      subject: resolved.subject,
      branch: resolved.branch,
      review: { kind: options.kind, round },
      ...host,
      ...roundFields(plan, resolved, priors, captures),
      reviewedTree,
      reviewedTreeSource: "the working tree the helper launched the worker on",
      startedAt: launched.startedAt,
      endedAt: launched.endedAt,
      durationMs: launched.durationMs,
      tokens,
      costUsd: wire?.costUsd ?? null,
      turns: wire?.turns ?? null,
      checkout: { unchanged: !changed.length, changed },
      priorFindingIds,
      briefSha256: sha256(brief),
      brief: recordedBrief,
      findings: omitted.findings,
      rechecks: omitted.rechecks,
      filesRead: omitted.filesRead,
      report: omitted.report,
      omittedDispatchLines: omitted.count,
    };
    mkdirSync(lane, { recursive: true, mode: 0o700 });
    writeFileSync(jsonPath, `${JSON.stringify(record, null, 2)}\n`, {
      flag: "wx",
      mode: 0o600,
    });
    writeFileSync(reportPath, renderReport(record), {
      flag: "wx",
      mode: 0o600,
    });
    const blocking = result.findings.filter(
      (finding) => finding.severity === "blocking",
    ).length;
    const advisory = journal({
      outcome: "report",
      findings: result.findings.length,
      blocking,
      report: relative(root, reportPath),
    });
    const unanswered = unansweredItems(captures, result.report);
    const line = `review: ${options.kind} round ${round} found ${result.findings.length} (${blocking} blocking); ${formatDuration(launched.durationMs)}`;
    write(
      `${line}\n${changed.length ? `DotLn advisory: the checkout's contents changed during the review: ${changed.join(", ")}.\n` : ""}${unanswered.length ? `DotLn advisory: the Items table names no row for the dispatch's numbered items ${unanswered.join(", ")}.\n` : ""}${omittedAdvisory(omitted.count)}${rerollAdvisory(root, plan, reviewedTree)}${advisory}`,
    );
    return {
      line,
      report: relative(root, reportPath),
      record: relative(root, jsonPath),
      findings: result.findings.length,
      blocking,
    };
  } finally {
    removeTemporaryPath(wireDirectory, { recursive: true, force: true });
  }
}

export const RECORD_USAGE =
  "usage: npm run worker -- record --kind criteria|design|consistency|combined --from <returned-text file> [--format prose|json] [--host claude|codex] [--model <model>] [--effort <level>] [--tree <object>] [--order WO-NNN [--target <repository-id>] | --subject planning [--capture <file>]...] [--round N] [--recheck <report>]... [--since <tree>] [--tokens N] [--duration-ms N]";
const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
/** Whether an object carries a key that only the result itself carries. */
const namesResult = (value) =>
  Object.hasOwn(value, "schemaVersion") || Object.hasOwn(value, "findings");
const FENCE_OPENING = /^ {0,3}(`{3,}|~{3,})(.*)$/u;
const FENCE_CLOSING = /^ {0,3}(`{3,}|~{3,})[ \t]*$/u;

/** The JSON object that opens at `start` in the text and the index just past
 * its closing brace, or null when none parses there; braces inside strings
 * are skipped. */
function objectAt(text, start) {
  let depth = 0;
  let quoted = false;
  for (let index = start; index < text.length; index++) {
    const char = text[index];
    if (quoted) {
      if (char === "\\") index++;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === "{") depth++;
    else if (char === "}" && --depth === 0) {
      try {
        const value = JSON.parse(text.slice(start, index + 1));
        return isPlainObject(value) ? { value, end: index + 1 } : null;
      } catch {
        return null;
      }
    }
  }
  return null;
}

/** Each line of a text: the offset it starts at, the offset of the line
 * after it and its words without a closing carriage return. */
function* linesOf(text) {
  for (let start = 0; ;) {
    const newline = text.indexOf("\n", start);
    const end = newline < 0 ? text.length : newline;
    yield {
      start,
      next: newline < 0 ? text.length : newline + 1,
      line: text.slice(start, end).replace(/\r$/u, ""),
    };
    if (newline < 0) return;
    start = newline + 1;
  }
}

/** Root-level fences that can carry a complete JSON return. Container and
 * inline context are supplied by the shared Markdown parser. */
function fencedBlocks(text, ast) {
  return ast.children.flatMap((node) => {
    if (node.type !== "code") return [];
    const start = node.position.start.offset;
    const end = node.position.end.offset;
    const lines = [...linesOf(text.slice(start, end))];
    const opening = FENCE_OPENING.exec(lines[0].line);
    if (!opening) return [];
    const last = lines.at(-1);
    const closing = lines.length > 1 && FENCE_CLOSING.exec(last.line);
    const closed =
      closing &&
      closing[1][0] === opening[1][0] &&
      closing[1].length >= opening[1].length;
    return [
      {
        start,
        end,
        bodyStart: start + lines[0].next,
        bodyEnd: closed ? start + last.start : end,
      },
    ];
  });
}

/** The recorder supplies the intent of mixed prose and JSON: prose keeps
 * every example, JSON binds exactly one result regardless of surrounding
 * prose. Without a format, accept a whole JSON return (optionally fenced)
 * or plain prose, but refuse any embedded possible result. Neither code
 * context, position, schema validity nor an introduction establishes intent. */
function readReturn(text, format) {
  if (format === "prose") return undefined;
  try {
    const value = JSON.parse(text);
    return format === "json" || (isPlainObject(value) && namesResult(value))
      ? { value, start: 0, end: text.length }
      : undefined;
  } catch {
    // Prose around an object, or no object at all.
  }
  const ast = parseMarkdown(text);
  const fences = fencedBlocks(text, ast);
  const [only] = fences;
  if (
    fences.length === 1 &&
    !text.slice(0, only.start).trim() &&
    !text.slice(only.end).trim()
  ) {
    let value;
    try {
      value = JSON.parse(text.slice(only.bodyStart, only.bodyEnd));
    } catch {
      if (format === "json")
        refuse("--format json: invalid JSON in the result fence");
      value = undefined;
    }
    if (
      value !== undefined &&
      (format === "json" || (isPlainObject(value) && namesResult(value)))
    )
      return { value, start: 0, end: text.length };
  }
  const claims = [];
  // Each opening brace starts a candidate that ends at its balanced close; a
  // brace that never parses moves the scan to the next one, and an object's
  // own braces are not read again.
  for (let from = text.indexOf("{"); from >= 0;) {
    const found = objectAt(text, from);
    if (!found) {
      if (format === "json")
        refuse(
          "--format json: invalid JSON object; put the result alone in the input file",
        );
      from = text.indexOf("{", from + 1);
      continue;
    }
    const at = from;
    from = text.indexOf("{", found.end);
    if (!namesResult(found.value)) continue;
    const fence = fences.find(
      (block) => at >= block.bodyStart && found.end <= block.bodyEnd,
    );
    const fillsFence =
      fence &&
      !text.slice(fence.bodyStart, at).trim() &&
      !text.slice(found.end, fence.bodyEnd).trim();
    claims.push({
      value: found.value,
      start: fillsFence ? fence.start : at,
      end: fillsFence ? fence.end : found.end,
    });
  }
  if (format === "json") {
    if (claims.length !== 1)
      refuse(
        `--format json needs exactly one findings object; found ${claims.length}. Put the result alone in the input file when it also quotes result examples.`,
      );
    return claims[0];
  }
  if (claims.length)
    refuse(
      "mixed review text contains a possible findings object: use --format prose to preserve examples, or --format json to bind one result, including a result followed by prose; nothing was recorded",
    );
  return undefined;
}

/** The tree a returned report says it reviewed, from the `Reviewed tree:`
 * line that opens it, or null; a line quoted later, as from an earlier
 * report, names nothing. */
const namedTree = (text) => {
  const opening =
    String(text ?? "")
      .split(/\r?\n/u)
      .find((line) => line.trim()) ?? "";
  return (
    /^[\s>*_`-]*reviewed tree[*_`]*\s*:?[*_`\s]*([0-9a-f]{40}|[0-9a-f]{64})\b/iu.exec(
      opening,
    )?.[1] ?? null
  );
};

/**
 * Record an Agent-route worker's returned text in the reviews lane as the same
 * `.json` record and `.md` report the helper writes, so a verifier reads every
 * round and a fresh helper worker can recheck it whatever route launched it.
 * The recorder declares mixed input with --format prose|json; an omitted
 * format admits only an unambiguous return or prose. A claimed result is
 * bound by the same validator a launched worker's return
 * meets, and both by the same report rules. The reviewed tree is the one `--tree` names, else the
 * working tree when the record is written, which must then be the tree the
 * report's `Reviewed tree:` line names when it names one. The host, model and
 * effort are what the recorder attests ran, else the host's defaults.
 * @param {string} root
 * @param {readonly string[]} args
 * @param {{now?: () => Date, write?: (text: string) => void}} [io]
 */
export async function recordAgentReview(
  root,
  args,
  { now = () => new Date(), write = (text) => process.stdout.write(text) } = {},
) {
  root = realpathSync(root);
  const extra = {};
  const reviewArgs = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    const value = () => {
      const next = args[++index];
      if (next === undefined || next.startsWith("--"))
        refuse(`${arg} needs a value; ${RECORD_USAGE}`);
      return next;
    };
    if (arg === "--from") extra.from = value();
    else if (arg === "--format") extra.format = value();
    else if (arg === "--tokens") extra.tokens = value();
    else if (arg === "--duration-ms") extra.durationMs = value();
    else if (arg === "--host") extra.host = value();
    else if (arg === "--model") extra.model = value();
    else if (arg === "--effort") extra.effort = value();
    else if (arg === "--tree") extra.tree = value();
    else if (arg === "--dry-run")
      refuse(`${arg} is the launch's; ${RECORD_USAGE}`);
    else reviewArgs.push(arg);
  }
  if (!extra.from) refuse(`--from names the returned text; ${RECORD_USAGE}`);
  if (extra.format !== undefined && !["prose", "json"].includes(extra.format))
    refuse(`--format is prose or json; ${RECORD_USAGE}`);
  for (const [name, text] of [
    ["--tokens", extra.tokens],
    ["--duration-ms", extra.durationMs],
  ])
    if (text !== undefined && !/^\d{1,15}$/u.test(text))
      refuse(`${name} is a whole number; ${RECORD_USAGE}`);
  if (
    extra.model !== undefined &&
    !/^[a-z][a-z0-9.-]{0,63}$/u.test(extra.model)
  )
    refuse(`--model names the model that ran; ${RECORD_USAGE}`);
  if (
    extra.effort !== undefined &&
    !["low", "medium", "high", "xhigh", "max", "unknown"].includes(extra.effort)
  )
    refuse(
      `--effort is low, medium, high, xhigh, max or unknown; ${RECORD_USAGE}`,
    );
  if (extra.tree !== undefined && !/^[0-9a-f]{7,64}$/u.test(extra.tree))
    refuse(`--tree names the reviewed tree by its object id; ${RECORD_USAGE}`);
  const { contributorWorkerOptions, contributorWorkerDefaults } =
    await skeleton("loadouts/contributor");
  // A model named by one of the four options' words or ids carries its host
  // and effort; any other model id is recorded as the recorder states it.
  const named =
    extra.model === undefined
      ? undefined
      : await workerOptionNamed(extra.model);
  const hostName = extra.host ?? named?.[1].host ?? "claude";
  if (!Object.hasOwn(REVIEW_HOSTS, hostName))
    refuse(`--host must be claude or codex; ${RECORD_USAGE}`);
  if (named && named[1].host !== hostName)
    refuse(
      `--model ${extra.model} is a ${named[1].host === "claude" ? "Claude" : "Codex"} option, and --host names ${hostName}; ${RECORD_USAGE}`,
    );
  const options = parseReviewArgs(
    [...reviewArgs, "--host", hostName],
    RECORD_USAGE,
  );
  const resolved = resolveSubject(root, options);
  const checkout = resolved.target?.worktree ?? root;
  const priors = options.recheck.map((path) => readPrior(root, path));
  const plan = roundPlan(
    root,
    checkout,
    options,
    resolved,
    priors,
    RECORD_USAGE,
  );
  const { round, lane } = plan;
  const captures = readCaptures(root, options.capture);
  const text = readFileSync(resolve(root, extra.from), "utf8");
  const priorFindingIds = priors.flatMap((report) =>
    report.findings.map((finding) => finding.id),
  );
  const { validateChangeReviewResult } = await skeleton(
    "change-review-protocol",
  );
  // A claimed findings object is bound by the validator, and a malformed one
  // is refused; a prose report is kept as the worker's report with no
  // findings a later recheck could name, so every round stays readable.
  const claimed = readReturn(text, extra.format);
  const structured = claimed !== undefined;
  const result = structured
    ? validateChangeReviewResult(claimed.value, { review: { priorFindingIds } })
    : { findings: [], rechecks: [], filesRead: [], report: text.trim() };
  // The report rules hold where the worker wrote its report: the claimed
  // result's report field, whose newlines the raw text carries escaped, or
  // the prose around the object. The body that passes, as returned and as it
  // is written with the dispatch's quoted words omitted, is the one recorded.
  const prose = structured
    ? `${text.slice(0, claimed.start)}${text.slice(claimed.end)}`.trim()
    : text.trim();
  const judged = (structured ? [result.report, prose] : [prose]).map(
    (body) => ({
      body,
      refusal: recordedReportRefusal(
        options.kind,
        captures.length > 0,
        body,
        omitDispatch(captures, options.kind, {
          report: body,
          findings: [],
          rechecks: [],
          filesRead: [],
        }).report,
      ),
    }),
  );
  const passing = judged.find((row) => !row.refusal);
  if (!passing)
    refuse(`the returned report is not recorded: ${judged[0].refusal}`);
  // The tree the worker judged: named with --tree, or the working tree now,
  // which a report that names another tree, in its opening line or its
  // result's report field, cannot be recorded against.
  const current = snapshot(resolved, checkout);
  const said =
    namedTree(text) ?? (structured ? namedTree(result.report) : null);
  let reviewedTree = current;
  let reviewedTreeSource = said
    ? "named in the report; the working tree when it was recorded"
    : "the working tree when it was recorded";
  if (extra.tree !== undefined) {
    reviewedTree = treeOf(checkout, extra.tree, "--tree");
    if (said && said !== reviewedTree)
      refuse(
        `the report names reviewed tree ${said}, and --tree names ${reviewedTree}`,
      );
    reviewedTreeSource = "named with --tree";
  } else if (said && said !== current)
    refuse(
      `the report reviewed tree ${said}, and the working tree is now ${current}: name the tree it judged with --tree ${said}`,
    );
  const name = `round-${round}-${options.kind}`;
  const reportPath = join(lane, `${name}.md`);
  const jsonPath = join(lane, `${name}.json`);
  if (existsSync(reportPath) || existsSync(jsonPath))
    refuse(
      `${relative(root, reportPath)} already holds this round's ${options.kind} report; a later round takes the next --round, a fresh round 1 names its base with --since, and a report you mean to replace is removed by hand first`,
    );
  // No record keeps a passage of the operator's dispatch the worker quoted.
  const omitted = omitDispatch(captures, options.kind, {
    report: passing.body,
    text,
    findings: result.findings,
    rechecks: result.rechecks,
    filesRead: result.filesRead,
  });
  const fallback =
    contributorWorkerOptions[contributorWorkerDefaults[hostName]];
  const attested = extra.model !== undefined || extra.effort !== undefined;
  const model = named?.[1].model ?? extra.model ?? fallback.model;
  const effort =
    extra.effort ??
    (named ? named[1].effort : extra.model ? "unknown" : fallback.effort);
  const defaultSource =
    hostName === "claude" ? "generated-definition" : "host-default";
  const record = {
    schemaVersion: 1,
    kind: "change-review-report",
    workOrder: resolved.workOrder,
    subject: resolved.subject,
    branch: resolved.branch,
    review: { kind: options.kind, round },
    host: hostName,
    transport: hostName === "codex" ? "codex-spawn-agent" : "agent-tool",
    harnessVersion: "unknown",
    model: {
      value: model,
      source: extra.model !== undefined ? "recorder-attested" : defaultSource,
    },
    // An effort the recorder states, or the one its named model implies
    // (unknown for a model outside the four options), is the recorder's.
    effort: {
      value: effort,
      source: attested ? "recorder-attested" : defaultSource,
    },
    option: named
      ? { name: named[0], selection: "recorder-attested" }
      : attested
        ? null
        : {
            name: contributorWorkerDefaults[hostName],
            selection: "host-default",
          },
    readback: null,
    ...roundFields(plan, resolved, priors, captures),
    reviewedTree,
    reviewedTreeSource,
    startedAt: null,
    endedAt: now().toISOString(),
    durationMs:
      extra.durationMs === undefined ? null : Number(extra.durationMs),
    tokens: {
      value: extra.tokens === undefined ? null : Number(extra.tokens),
      source: extra.tokens === undefined ? "unavailable" : "agent-tool-usage",
    },
    costUsd: null,
    turns: null,
    checkout: { unchanged: true, changed: [] },
    priorFindingIds,
    briefSha256: null,
    brief: null,
    findings: omitted.findings,
    rechecks: omitted.rechecks,
    filesRead: omitted.filesRead,
    report: omitted.report,
    // Whether the worker returned the closed findings object or prose.
    structured,
    inputFormat: extra.format ?? "auto",
    returnedText: omitted.text,
    omittedDispatchLines: omitted.count,
  };
  mkdirSync(lane, { recursive: true, mode: 0o700 });
  writeFileSync(jsonPath, `${JSON.stringify(record, null, 2)}\n`, {
    flag: "wx",
    mode: 0o600,
  });
  writeFileSync(reportPath, renderReport(record), { flag: "wx", mode: 0o600 });
  const blocking = result.findings.filter(
    (finding) => finding.severity === "blocking",
  ).length;
  const unanswered = unansweredItems(captures, passing.body);
  const notes = `${unanswered.length ? `DotLn advisory: the Items table names no row for the dispatch's numbered items ${unanswered.join(", ")}.\n` : ""}${omittedAdvisory(omitted.count)}${rerollAdvisory(root, plan, reviewedTree)}`;
  const line = structured
    ? `review: ${options.kind} round ${round} found ${result.findings.length} (${blocking} blocking); recorded from the Agent route`
    : `review: ${options.kind} round ${round}: recorded the worker's prose report from the Agent route; it holds no findings object a recheck can name`;
  write(`${line}\n${notes}`);
  return {
    line,
    report: relative(root, reportPath),
    record: relative(root, jsonPath),
  };
}
