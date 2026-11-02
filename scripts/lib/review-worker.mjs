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
import { join, relative, resolve } from "node:path";
import { docPath, docRelative } from "./config.mjs";
import { runGit, spawnGit } from "./git.mjs";
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
import {
  TRANSPORT_DEFAULTS,
  launchWorker,
  readWire,
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
  "usage: npm run worker -- review --kind criteria|design|consistency|combined --host codex|claude [--order WO-NNN | --subject planning] [--since <tree>] [--round N] [--recheck <report>]... [--dry-run]";

/** @param {readonly string[]} args */
export function parseReviewArgs(args) {
  const options = { recheck: [] };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    const value = () => {
      const next = args[++index];
      if (next === undefined || next.startsWith("--"))
        refuse(`${arg} needs a value; ${REVIEW_USAGE}`);
      return next;
    };
    if (arg === "--kind") options.kind = value();
    else if (arg === "--host") options.host = value();
    else if (arg === "--order") options.order = value();
    else if (arg === "--subject") options.subject = value();
    else if (arg === "--since") options.since = value();
    else if (arg === "--round") options.round = value();
    else if (arg === "--recheck") options.recheck.push(value());
    else if (arg === "--dry-run") options.dryRun = true;
    else refuse(`unknown option ${arg}; ${REVIEW_USAGE}`);
  }
  if (!KINDS.includes(options.kind ?? ""))
    refuse(`--kind must be one of ${KINDS.join(", ")}; ${REVIEW_USAGE}`);
  if (!Object.hasOwn(REVIEW_HOSTS, options.host ?? ""))
    refuse(`--host must be codex or claude; ${REVIEW_USAGE}`);
  if (options.order && options.subject)
    refuse(`--order and --subject are exclusive; ${REVIEW_USAGE}`);
  if (options.subject !== undefined && options.subject !== "planning")
    refuse(`--subject accepts planning only; ${REVIEW_USAGE}`);
  if (options.order !== undefined && !/^WO-\d{3}$/u.test(options.order))
    refuse(`--order names a work order WO-NNN; ${REVIEW_USAGE}`);
  if (options.round !== undefined) {
    if (!/^[1-9]\d{0,2}$/u.test(options.round))
      refuse(`--round is a positive whole number; ${REVIEW_USAGE}`);
    options.round = Number(options.round);
  }
  if (options.since !== undefined && !/^[0-9a-f]{7,64}$/u.test(options.since))
    refuse(`--since names a commit or tree by its object id; ${REVIEW_USAGE}`);
  return options;
}

const branchOf = (root) =>
  runGit(root, ["rev-parse", "--abbrev-ref", "HEAD"]).trim();

/** What is reviewed: the order the flags or the branch name, or a planning
 * branch's documents. */
function resolveSubject(root, options) {
  const branch = branchOf(root);
  if (options.subject === "planning") {
    if (!branch.startsWith("planning/"))
      refuse(
        `--subject planning reviews a planning/ branch; this checkout is on ${branch}`,
      );
    return { subject: "planning", workOrder: null, branch };
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
  return { subject: workOrder, workOrder, branch, orderPath: path };
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

/** The reviews lane: the order's (a repair's under `repair-<n>/`, so its
 * ladder never replaces the execution's reports), or one per planning day.
 * Ignored local state; release close moves an order's lane into its retained
 * lane. */
export const reviewsLane = (
  root,
  subject,
  { date = new Date(), cycle = 0 } = {},
) =>
  docRelative(
    root,
    "control",
    `local/reviews/${subject === "planning" ? `planning-${date.toISOString().slice(0, 10)}` : `${subject}${cycle ? `/repair-${cycle}` : ""}`}`,
  );

/** An earlier report this recheck confirms or refutes, read from its `.json`
 * record, with its findings named by kind and round so several reports'
 * findings stay distinct in one brief. */
function readPrior(root, path) {
  const absolute = resolve(root, path.replace(/\.md$/u, ".json"));
  if (!containedRegularFile(absolute, root))
    refuse(`--recheck ${path}: no readable report record at ${absolute}`);
  let record;
  try {
    record = JSON.parse(readFileSync(absolute, "utf8"));
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

/** The round's instruction, stated from what this launch actually carries: a
 * recheck names its earlier findings, and the combined round names its base
 * and lists earlier findings only when a report was given. */
const ladderRule = ({ kind, round, priors, sinceSource }, admission) => {
  const rule = `${admission[0].toUpperCase()}${admission.slice(1)}.`;
  if (kind === "combined")
    return `This is the last round: one combined review carrying all three briefs over the change since the base below (${sinceSource}). ${rule}${priors.length ? " Recheck the earlier findings listed below where they bear on that change." : ""}`;
  if (round === 1)
    return "This is round 1: review the whole change against its base under your brief.";
  return `This is round ${round}, a recheck: confirm or refute the fixes of the earlier findings listed below on the current tree, and review nothing else. ${rule}`;
};

/** One finding as a Markdown list item, in the brief and in the report. */
const findingLine = (finding) =>
  `- **${finding.id}** (${finding.severity}${finding.basis ? `; ${"criterion" in finding.basis ? `criterion ${finding.basis.criterion}` : `regression: ${finding.basis.regression}`}` : ""}) \`${finding.file || "no single file"}${finding.line ? `:${finding.line}` : ""}\`: ${finding.summary}`;

/** The canonical brief, rendered from the generated worker definition, the
 * executor's reviewer briefs and admission rule, the subject and its diff. */
export async function renderReviewBrief(
  root,
  {
    kind,
    round,
    resolved,
    since,
    sinceSource,
    reviewedTree,
    stat,
    priors,
    documents,
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
  return [
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
    `The checkout is ${root}. The reviewed tree is ${reviewedTree}: this checkout's working tree, untracked files included and ignored files left out, written as a Git tree. The base is ${since} (${sinceSource}). Read the change with \`git diff ${since} ${reviewedTree} -- <path>\` and the files themselves; the stat is:`,
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
  ].join("\n");
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

/** The Markdown report of one record, the helper's own and the one an
 * executor writes for an Agent-route worker's returned text. */
export function renderReport(record) {
  const counts = (severity) =>
    record.findings.filter((finding) => finding.severity === severity).length;
  const tokens = record.tokens.value ?? "unknown";
  return [
    `# Change review: ${record.review.kind}, round ${record.review.round}, ${record.workOrder ?? `planning branch ${record.branch}`}`,
    "",
    `- Host: ${record.host} (\`${record.transport}\` ${record.harnessVersion}); model \`${record.model.value}\` at effort \`${record.effort.value}\`, pinned on the command line; host readback: ${record.readback ? record.readback.models.join(", ") : "none printed"}; effective effort unknown.`,
    `- Reviewed tree \`${record.reviewedTree}\` against \`${record.since}\` (${record.sinceSource}).`,
    `- Started ${record.startedAt}, ended ${record.endedAt}: ${formatDuration(record.durationMs)}; tokens ${tokens} (${record.tokens.source}).`,
    `- Findings: ${record.findings.length} (${counts("blocking")} blocking, ${counts("should-fix")} should-fix, ${counts("note")} notes).`,
    `- Checkout: ${record.checkout.unchanged ? "unchanged across the episode" : `its contents changed during the episode, by the worker or another writer: ${record.checkout.changed.join(", ")}`}.`,
    ...(record.prior.length
      ? [`- Rechecked: ${record.prior.join(", ")}.`]
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

/**
 * Run one change review. Returns the printed line and the written paths; a
 * dry run returns the argv it would launch and writes no report (the reviewed
 * tree's objects still land in the repository's object store).
 * @param {string} root
 * @param {readonly string[]} args
 * @param {{now?: () => Date, write?: (text: string) => void}} [io]
 */
export async function runChangeReview(
  root,
  args,
  { now = () => new Date(), write = (text) => process.stdout.write(text) } = {},
) {
  root = realpathSync(root);
  const options = parseReviewArgs(args);
  const resolved = resolveSubject(root, options);
  const priors = options.recheck.map((path) => readPrior(root, path));
  const round =
    options.round ??
    (priors.length
      ? Math.max(...priors.map((report) => report.record.review.round)) + 1
      : 1);
  requireRoundInputs(options, round, priors, REVIEW_USAGE);
  const latest = priors
    .slice()
    .sort((a, b) =>
      String(a.record.endedAt).localeCompare(String(b.record.endedAt)),
    )
    .at(-1);
  const mergeBase = runGit(root, ["merge-base", "HEAD", "main"]).trim();
  const since = options.since ?? latest?.record.reviewedTree ?? mergeBase;
  const sinceSource = options.since
    ? "named with --since"
    : latest
      ? `the tree ${latest.path} reviewed`
      : "the merge base with main";
  if (
    spawnGit(["-C", root, "cat-file", "-e", `${since}^{tree}`], {
      encoding: "utf8",
    }).status !== 0
  )
    refuse(`--since ${since} names no commit or tree in this repository`);
  const reviewedTree = workingTree(root);
  const stat = runGit(root, [
    "diff",
    "--stat=160,120",
    "--find-renames",
    since,
    reviewedTree,
  ]);
  // A planning branch's documents are what the branch changed since its base,
  // whatever a recheck's narrower delta touched.
  const documents = subjectDocuments(root, resolved, mergeBase);
  const brief = await renderReviewBrief(root, {
    kind: options.kind,
    round,
    resolved,
    since,
    sinceSource,
    reviewedTree,
    stat,
    priors,
    documents,
  });
  const { CHANGE_REVIEW_TOOLS, CHANGE_REVIEW_EFFECT } = await skeleton(
    "change-review-protocol",
  );
  // The launch's pins are the transports' own, the ones the entropy review
  // and the planning refuter launch at.
  const pins = TRANSPORT_DEFAULTS[REVIEW_HOSTS[options.host]];
  const fixture = process.env.DOTLN_WORKER_FIXTURE;
  const transport = fixture ? "fake" : REVIEW_HOSTS[options.host];
  const lane = join(
    root,
    reviewsLane(root, resolved.subject, {
      date: now(),
      cycle: resolved.workOrder ? reviewCycle(root, resolved.workOrder) : 0,
    }),
  );
  const name = `round-${round}-${options.kind}`;
  const reportPath = join(lane, `${name}.md`);
  const jsonPath = join(lane, `${name}.json`);
  // A report is the record a verifier reads; a second launch under the same
  // name never replaces it.
  if (!options.dryRun && (existsSync(reportPath) || existsSync(jsonPath)))
    refuse(
      `${relative(root, reportPath)} already holds this round's ${options.kind} report; a later round takes the next --round, and a report you mean to replace is removed by hand first`,
    );
  const priorFindingIds = priors.flatMap((report) =>
    report.findings.map((finding) => finding.id),
  );
  const episode = `${resolved.subject.toLowerCase()}_${name}_${randomUUID().slice(0, 8)}`;
  const capture = createScratchRoot(join(tmpdir(), "dotln-review-capture-"));
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
      model: pins.model,
      effort: pins.effort,
      cwd: root,
      capture,
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
        argv,
        report: relative(root, reportPath),
        since,
        reviewedTree,
        briefSha256: sha256(brief),
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
    const afterTree = workingTree(root);
    const changed =
      afterTree === reviewedTree
        ? []
        : runGit(root, ["diff", "--name-only", reviewedTree, afterTree])
            .split("\n")
            .filter(Boolean);
    const wire = launched ? readWire(capture, launched.transport) : null;
    const host = {
      host: options.host,
      transport: launched?.transport ?? transport,
      harnessVersion: launched?.harnessVersion ?? "unknown",
      model: { value: pins.model, source: "command-line" },
      effort: { value: pins.effort, source: "command-line" },
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
    const record = {
      schemaVersion: 1,
      kind: "change-review-report",
      workOrder: resolved.workOrder,
      subject: resolved.subject,
      branch: resolved.branch,
      review: { kind: options.kind, round },
      ...host,
      since,
      sinceSource,
      reviewedTree,
      startedAt: launched.startedAt,
      endedAt: launched.endedAt,
      durationMs: launched.durationMs,
      tokens,
      costUsd: wire?.costUsd ?? null,
      turns: wire?.turns ?? null,
      checkout: { unchanged: !changed.length, changed },
      prior: priors.map((report) => report.path),
      priorFindingIds,
      briefSha256: sha256(brief),
      brief,
      findings: result.findings,
      rechecks: result.rechecks,
      filesRead: result.filesRead,
      report: result.report,
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
    const line = `review: ${options.kind} round ${round} found ${result.findings.length} (${blocking} blocking); ${formatDuration(launched.durationMs)}`;
    write(
      `${line}\n${changed.length ? `DotLn advisory: the checkout's contents changed during the review: ${changed.join(", ")}.\n` : ""}${advisory}`,
    );
    return {
      line,
      report: relative(root, reportPath),
      record: relative(root, jsonPath),
      findings: result.findings.length,
      blocking,
    };
  } finally {
    removeTemporaryPath(capture, { recursive: true, force: true });
  }
}

export const RECORD_USAGE =
  "usage: npm run worker -- record --kind criteria|design|consistency|combined --from <returned-text file> [--order WO-NNN] [--round N] [--recheck <report>]... [--since <tree>] [--tokens N] [--duration-ms N]";

/**
 * Record an Agent-route worker's returned text in the reviews lane as the same
 * `.json` record and `.md` report the helper writes, so a verifier reads every
 * round and a fresh helper worker can recheck it whatever route launched it.
 * The text holds the closed findings object, alone or among prose; it is
 * bound by the same validator a launched worker's return meets. The reviewed
 * tree is the working tree when the record is written.
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
  const extra = { from: undefined, tokens: undefined, durationMs: undefined };
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
    else if (arg === "--tokens") extra.tokens = value();
    else if (arg === "--duration-ms") extra.durationMs = value();
    else if (arg === "--host" || arg === "--dry-run")
      refuse(`${arg} is the launch's; ${RECORD_USAGE}`);
    else reviewArgs.push(arg);
  }
  if (!extra.from) refuse(`--from names the returned text; ${RECORD_USAGE}`);
  for (const [name, text] of [
    ["--tokens", extra.tokens],
    ["--duration-ms", extra.durationMs],
  ])
    if (text !== undefined && !/^\d{1,15}$/u.test(text))
      refuse(`${name} is a whole number; ${RECORD_USAGE}`);
  const options = parseReviewArgs([...reviewArgs, "--host", "claude"]);
  const resolved = resolveSubject(root, options);
  const priors = options.recheck.map((path) => readPrior(root, path));
  const round =
    options.round ??
    (priors.length
      ? Math.max(...priors.map((report) => report.record.review.round)) + 1
      : 1);
  requireRoundInputs(options, round, priors, RECORD_USAGE);
  const latest = priors
    .slice()
    .sort((a, b) =>
      String(a.record.endedAt).localeCompare(String(b.record.endedAt)),
    )
    .at(-1);
  const since =
    options.since ??
    latest?.record.reviewedTree ??
    runGit(root, ["merge-base", "HEAD", "main"]).trim();
  const text = readFileSync(resolve(root, extra.from), "utf8");
  // The closed findings object when the worker returned one; a malformed one
  // is refused. A prose report is kept as the worker's report with no
  // findings a later recheck could name, so every round stays readable.
  let value;
  try {
    value = JSON.parse(
      text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1),
    );
  } catch {
    value = undefined;
  }
  const priorFindingIds = priors.flatMap((report) =>
    report.findings.map((finding) => finding.id),
  );
  const { validateChangeReviewResult } = await skeleton(
    "change-review-protocol",
  );
  const structured = value !== undefined;
  const result = structured
    ? validateChangeReviewResult(value, { review: { priorFindingIds } })
    : { findings: [], rechecks: [], filesRead: [], report: text.trim() };
  const lane = join(
    root,
    reviewsLane(root, resolved.subject, {
      date: now(),
      cycle: resolved.workOrder ? reviewCycle(root, resolved.workOrder) : 0,
    }),
  );
  const name = `round-${round}-${options.kind}`;
  const reportPath = join(lane, `${name}.md`);
  const jsonPath = join(lane, `${name}.json`);
  if (existsSync(reportPath) || existsSync(jsonPath))
    refuse(
      `${relative(root, reportPath)} already holds this round's ${options.kind} report; a later round takes the next --round, and a report you mean to replace is removed by hand first`,
    );
  const pins = TRANSPORT_DEFAULTS["claude-cli-print"];
  const endedAt = now().toISOString();
  const record = {
    schemaVersion: 1,
    kind: "change-review-report",
    workOrder: resolved.workOrder,
    subject: resolved.subject,
    branch: resolved.branch,
    review: { kind: options.kind, round },
    host: "claude",
    transport: "agent-tool",
    harnessVersion: "unknown",
    model: { value: pins.model, source: "generated-definition" },
    effort: { value: pins.effort, source: "generated-definition" },
    readback: null,
    since,
    sinceSource: options.since
      ? "named with --since"
      : latest
        ? `the tree ${latest.path} reviewed`
        : "the merge base with main",
    reviewedTree: workingTree(root),
    startedAt: null,
    endedAt,
    durationMs:
      extra.durationMs === undefined ? null : Number(extra.durationMs),
    tokens: {
      value: extra.tokens === undefined ? null : Number(extra.tokens),
      source: extra.tokens === undefined ? "unavailable" : "agent-tool-usage",
    },
    costUsd: null,
    turns: null,
    checkout: { unchanged: true, changed: [] },
    prior: priors.map((report) => report.path),
    priorFindingIds,
    briefSha256: null,
    brief: null,
    findings: result.findings,
    rechecks: result.rechecks,
    filesRead: result.filesRead,
    report: result.report,
    // Whether the worker returned the closed findings object or prose.
    structured,
    returnedText: text,
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
  const line = structured
    ? `review: ${options.kind} round ${round} found ${result.findings.length} (${blocking} blocking); recorded from the Agent route`
    : `review: ${options.kind} round ${round}: recorded the worker's prose report from the Agent route; it holds no findings object a recheck can name`;
  write(`${line}\n`);
  return {
    line,
    report: relative(root, reportPath),
    record: relative(root, jsonPath),
  };
}
