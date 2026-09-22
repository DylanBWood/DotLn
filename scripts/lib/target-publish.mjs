import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { canonicalStringify, compileLoadout } from "@dotln/compiler";
import { appendEvent, authorize, decodeLog } from "@dotln/kernel";
import { WorkerStore } from "../../packages/skeleton/dist/src/worker-store.js";
import {
  SOURCE_CHANGE_HOST,
  decodeSourceObservation,
  decodeSourceRequest,
} from "../../packages/skeleton/dist/src/source-change-state.js";
import { projectAcceptanceEvidenceMatrices } from "../../packages/skeleton/dist/src/verification.js";
import { hasAiAttribution } from "../../packages/compiler/src/attribution.mjs";
import { checkOutwardArtifact } from "../outward-lint.mjs";
import {
  acceptanceStatuses,
  assertGitHubBodyProfile,
  generateTargetPullRequest,
  withTemporaryBody,
} from "../github-body.mjs";
import { ensureGh, executeGh } from "../github-repository.mjs";

// The two remote effects of a target publication. The source-change writer
// never exercises them; publication exercises only them (WO-064).
export const PUBLICATION_EFFECTS = Object.freeze(["repo.push", "pr.open"]);
export const TARGET_PUBLISH_HOST = "target-publish-host";

const refuse = (reason) => new Error(`target publish refused: ${reason}`);
const same = (left, right) =>
  canonicalStringify(left) === canonicalStringify(right);
const matches = (pattern, effect) =>
  pattern.endsWith("*")
    ? effect.startsWith(pattern.slice(0, -1))
    : pattern === effect;
const publicationGrant = (grant) =>
  [...grant.effects, ...(grant.operations ?? [])].length > 0 &&
  [...grant.effects, ...(grant.operations ?? [])].every((effect) =>
    PUBLICATION_EFFECTS.includes(effect),
  );

/** The loadout a source-change writer is compiled from: the order's loadout
 * without its publication grants, compiled with no grant registry. The writer
 * never holds a publication effect, and its artifact identity stays one the
 * source-change host admits (WO-064-D002). */
export function writerLoadout(source) {
  return {
    ...source,
    authorityGrants: (source.authorityGrants ?? []).filter(
      (grant) => !publicationGrant(grant),
    ),
  };
}

const REQUEST_KEYS = [
  "schemaVersion",
  "loadout",
  "environment",
  "store",
  "baseBranch",
  "verificationStore",
];
/** A host-owned request. Relative paths resolve beside the request file. */
export function readTargetPublishRequest(path) {
  const file = resolve(path);
  let request;
  try {
    request = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    throw refuse("the target request must be a readable JSON file");
  }
  if (
    request === null ||
    typeof request !== "object" ||
    Array.isArray(request) ||
    Object.keys(request).some((key) => !REQUEST_KEYS.includes(key)) ||
    request.schemaVersion !== 1 ||
    typeof request.loadout !== "string" ||
    typeof request.store !== "string" ||
    typeof request.baseBranch !== "string" ||
    !/^[A-Za-z0-9._/-]+$/u.test(request.baseBranch) ||
    request.environment === null ||
    typeof request.environment !== "object" ||
    Array.isArray(request.environment) ||
    Object.keys(request.environment).sort().join(",") !==
      "baseCommit,capabilities,environmentId,repo,version" ||
    (request.verificationStore !== undefined &&
      typeof request.verificationStore !== "string")
  )
    throw refuse(
      `the target request requires schemaVersion 1, loadout, an environment of exactly environmentId, version, capabilities, repo and baseCommit (the grant registry is host input), store, baseBranch and an optional verificationStore`,
    );
  const base = dirname(file);
  return {
    loadout: resolve(base, request.loadout),
    environment: request.environment,
    store: resolve(base, request.store),
    baseBranch: request.baseBranch,
    verificationStore:
      request.verificationStore === undefined
        ? null
        : resolve(base, request.verificationStore),
  };
}

const git = (cwd, args, options = {}) => {
  const result = spawnSync("git", ["-C", cwd, ...args], {
    maxBuffer: 16 * 1024 * 1024,
    ...options,
  });
  if (result.status !== 0)
    throw refuse(
      `git ${args[0]} failed in the target repository: ${String(result.stderr ?? "").trim()}`,
    );
  return result.stdout;
};
const gitText = (cwd, ...args) =>
  git(cwd, args, { encoding: "utf8" }).replace(/\n$/u, "");

const only = (events, type, label) => {
  const found = events.filter((event) => event.type === type);
  if (found.length !== 1)
    throw refuse(`the source-change store must hold exactly one ${label}`);
  return found[0];
};

/** Read the finished episode without taking its host lock: publication never
 * writes the source-change log. */
function readEpisode(storePath) {
  const store = new WorkerStore(storePath);
  if (existsSync(join(store.directory, "host.lock")))
    throw refuse(
      "the source-change store has a host lock; finish or recover that host first",
    );
  const events = decodeLog(store.read());
  const hosted = events.filter((event) => event.actorId === SOURCE_CHANGE_HOST);
  const requested = only(hosted, "SourceChangeRequested", "request");
  const persisted = only(hosted, "CommandPersisted", "persisted command");
  const observations = hosted.filter(
    (event) => event.type === "SourceChangeObserved",
  );
  if (
    !observations.length ||
    observations.some((event) => !same(event.payload, observations[0].payload))
  )
    throw refuse("the source-change store has no single observed commit");
  const command = persisted.payload.command;
  const receiptPath = join(
    store.directory,
    `${command.commandId}.source-change.json`,
  );
  let receipt;
  try {
    receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
  } catch {
    throw refuse("the source-change effect receipt is missing");
  }
  const observation = decodeSourceObservation(observations[0].payload);
  if (!same(receipt?.observation, observation))
    throw refuse("the effect receipt differs from the observed event");
  return {
    events,
    command,
    request: decodeSourceRequest(requested.payload),
    observation,
    workstreamId: requested.workstreamId,
  };
}

function bind(program, writer, episode, workOrderId) {
  const payload = episode.command.intent.payload;
  const checks = [
    [
      program.workOrder.workOrderId === workOrderId,
      "the compiled WorkOrder id differs from the order",
    ],
    [
      episode.request.workOrderId === workOrderId &&
        episode.observation.workOrderId === workOrderId,
      "the source-change episode belongs to another WorkOrder",
    ],
    [
      episode.request.repo === program.workOrder.repo &&
        episode.request.baseCommit === program.workOrder.baseCommit,
      "the episode's repository or base differs from the compiled WorkOrder",
    ],
    [
      episode.observation.branch === episode.request.branch &&
        payload.branch === episode.request.branch,
      "the observed branch differs from the requested branch",
    ],
    [
      same(payload.artifactIdentity, writer.artifactIdentity) &&
        same(payload.workOrder, writer.program.workOrder) &&
        same(payload.authorityEnvelope, writer.program.authorityEnvelope),
      "the episode was not dispatched from this loadout's writer compilation",
    ],
    [
      typeof payload.commitMessage === "string",
      "the episode lacks its host commit message",
    ],
  ];
  for (const [ok, reason] of checks) if (!ok) throw refuse(reason);
}

function authorizePublication(program, episode, now) {
  const evidence = episode.command.intent.payload.authorityEvidence ?? [];
  PUBLICATION_EFFECTS.forEach((effect, intentIndex) => {
    const grant = (program.grants ?? []).find(
      (entry) =>
        entry.grantedBy === "operator" &&
        entry.effects.includes(effect) &&
        (entry.operations ?? []).includes(effect),
    );
    if (!grant)
      throw refuse(
        `${effect} is not granted in effects and operations by an authority grant with operator provenance`,
      );
    if (
      !program.workOrder.allowedOperations.includes(effect) ||
      program.workOrder.prohibitedOperations.some((pattern) =>
        matches(pattern, effect),
      )
    )
      throw refuse(`${effect} is not an allowed WorkOrder operation`);
    const decision = authorize(
      { kind: "Act", effect, payload: {} },
      program.authorityEnvelope,
      {
        now,
        actorId: TARGET_PUBLISH_HOST,
        workstreamId: episode.workstreamId,
        decisionIndex: 0,
        intentIndex,
        evidence,
        revokedBy: episode.events,
      },
    );
    if (!decision.authorized)
      throw refuse(`${effect}: ${decision.refusal.payload.reason}`);
  });
}

// Re-read the effect from the target's objects: the branch still names the
// observed commit and the base-relative binary diff has the receipt's digest.
function observeTarget(episode) {
  const { repo, baseCommit, branch } = episode.request;
  const { commit, diffHash } = episode.observation;
  if (gitText(repo, "rev-parse", "--show-toplevel") !== realpathSync(repo))
    throw refuse("the episode repository is not a Git root");
  const head = spawnSync(
    "git",
    [
      "-C",
      repo,
      "rev-parse",
      "--verify",
      "--quiet",
      `refs/heads/${branch}^{commit}`,
    ],
    { encoding: "utf8" },
  );
  if (head.status !== 0 || head.stdout.trim() !== commit)
    throw refuse(`branch ${branch} no longer names the observed commit`);
  if (
    spawnSync("git", [
      "-C",
      repo,
      "merge-base",
      "--is-ancestor",
      baseCommit,
      commit,
    ]).status !== 0
  )
    throw refuse("the observed commit does not descend from the base");
  const diff = ["--no-ext-diff", "--no-textconv", "--no-renames"];
  const digest = createHash("sha256")
    .update(git(repo, ["diff", "--binary", ...diff, baseCommit, commit, "--"]))
    .digest("hex");
  if (digest !== diffHash)
    throw refuse("the target diff differs from the effect receipt");
  const fields = gitText(
    repo,
    "diff",
    "--numstat",
    "-z",
    ...diff,
    baseCommit,
    commit,
    "--",
  )
    .split("\0")
    .filter(Boolean);
  const files = fields.map((row) => {
    const [added, deleted, ...path] = row.split("\t");
    return {
      path: path.join("\t"),
      added: added === "-" ? null : Number(added),
      deleted: deleted === "-" ? null : Number(deleted),
    };
  });
  const commits = gitText(
    repo,
    "rev-list",
    "--reverse",
    `${baseCommit}..${commit}`,
  )
    .split("\n")
    .filter(Boolean)
    .map((sha) => ({
      sha,
      message: gitText(repo, "log", "-1", "--format=%B", sha).trimEnd(),
    }));
  return { files, commits };
}

function acceptanceMatrix(path, commit, workOrder) {
  if (path === null) return null;
  let matrices;
  try {
    matrices = projectAcceptanceEvidenceMatrices(
      decodeLog(new WorkerStore(path).read()),
    );
  } catch (error) {
    throw refuse(
      `the verification store cannot be replayed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  const current = matrices.filter(
    (matrix) => matrix.subjectRevision === commit,
  );
  if (current.length !== 1)
    throw refuse(
      "the verification store has no single acceptance matrix for the published head",
    );
  const rows = current[0].rows.map((row) => ({
    description: row.criterion.description,
    status: row.status,
  }));
  if (acceptanceStatuses(workOrder.acceptanceCriteria, rows) === null)
    throw refuse(
      "the acceptance matrix for the published head does not verify this WorkOrder's acceptance criteria",
    );
  return { subjectRevision: commit, rows };
}

function lintArtifacts(launchpad, artifacts) {
  const failures = [];
  for (const { kind, text } of artifacts) {
    const result = checkOutwardArtifact(launchpad, { kind, text });
    if (result.status === "pass") continue;
    const rules = [
      ...new Set(
        result.findings.map((finding) =>
          finding.span
            ? `${finding.rule} (line ${finding.span.line})`
            : finding.rule,
        ),
      ),
    ];
    failures.push(
      result.status === "unavailable"
        ? `${kind} unavailable: local-terms list absent`
        : `${kind} refused: ${rules.join(", ")}`,
    );
  }
  if (failures.length) throw refuse(`outward lint: ${failures.join("; ")}`);
}

function readPublication(publication, commit) {
  return decodeLog(publication.read()).find(
    (event) =>
      event.type === "PullRequestOpened" && event.payload.headSha === commit,
  );
}

/** One target publication. Every refusal precedes the first remote call. */
export function publishTargetOrder({
  launchpad,
  workOrderId,
  request,
  registry,
  now = Date.now(),
  log = (line) => process.stdout.write(`${line}\n`),
}) {
  let source;
  try {
    source = JSON.parse(readFileSync(request.loadout, "utf8"));
  } catch {
    throw refuse("the loadout must be a readable JSON file");
  }
  const compile = (graph, environment, label) => {
    const result = compileLoadout(graph, environment);
    if (!result.ok)
      throw refuse(
        `${label} does not compile: ${result.diagnostics.map((entry) => entry.code).join(", ")}`,
      );
    return result;
  };
  const { program } = compile(
    source,
    { ...request.environment, authorityGrantRegistry: registry },
    "the loadout",
  );
  const writer = compile(
    writerLoadout(source),
    request.environment,
    "the writer loadout (without its publication grants)",
  );
  const episode = readEpisode(request.store);
  bind(program, writer, episode, workOrderId);
  const { branch, repo, baseCommit } = episode.request;
  const { commit } = episode.observation;
  const publication = new WorkerStore(join(request.store, "publication"));
  const already = () => {
    const opened = readPublication(publication, commit);
    if (opened)
      log(
        `Already published ${branch} at ${commit}: pull request #${opened.payload.number} on ${opened.payload.repositoryId}; nothing pushed.`,
      );
    return opened?.payload;
  };
  const previous = already();
  if (previous) return previous;
  authorizePublication(program, episode, now);
  const target = observeTarget(episode);
  const payload = episode.command.intent.payload;
  const head = target.commits.at(-1);
  if (head?.sha !== commit || head.message !== payload.commitMessage.trimEnd())
    throw refuse("the observed commit message differs from the host message");
  const { title, body } = generateTargetPullRequest({
    commitMessage: payload.commitMessage,
    workOrder: program.workOrder,
    tests: {
      before: episode.observation.testBefore,
      after: episode.observation.testAfter,
    },
    diff: { baseCommit, headCommit: commit, files: target.files },
    matrix: acceptanceMatrix(
      request.verificationStore,
      commit,
      program.workOrder,
    ),
  });
  lintArtifacts(launchpad, [
    { kind: "branch", text: branch },
    ...target.commits.map(({ message }) => ({ kind: "commit", text: message })),
    { kind: "pr-title", text: title },
    { kind: "pr-body", text: body },
  ]);
  assertGitHubBodyProfile(body, "generated pull-request body");
  if (hasAiAttribution(title) || hasAiAttribution(body))
    throw refuse("the title or body contains AI attribution");
  // One publisher per episode from here; a concurrent winner is reported.
  publication.acquire();
  try {
    const raced = already();
    if (raced) return raced;
    const repository = ensureGh(repo);
    git(
      repo,
      ["push", "--no-follow-tags", "origin", `${commit}:refs/heads/${branch}`],
      {
        encoding: "utf8",
      },
    );
    const created = withTemporaryBody(body, (bodyPath) =>
      executeGh(repo, [
        "pr",
        "create",
        "--repo",
        repository.selector,
        "--head",
        branch,
        "--base",
        request.baseBranch,
        "--title",
        title,
        "--body-file",
        bodyPath,
      ]),
    );
    if (created.status !== 0)
      throw new Error(
        `branch pushed but pull-request creation failed: ${(created.stderr || created.stdout).trim()}`,
      );
    const url =
      /^https:\/\/([^/\s]+)\/([^/\s]+)\/([^/\s]+)\/pull\/([1-9][0-9]*)$/u.exec(
        created.stdout.trim().split("\n").at(-1) ?? "",
      );
    if (
      !url ||
      `${url[1]}/${url[2]}/${url[3]}`.toLowerCase() !==
        repository.selector.toLowerCase()
    )
      throw new Error(
        `pull request created but its number could not be read for ${repository.selector}; inspect the repository before retrying`,
      );
    const recorded = {
      repositoryId: repository.selector,
      number: Number(url[4]),
      headSha: commit,
    };
    const { event } = appendEvent(publication.read(), {
      schemaVersion: 1,
      type: "PullRequestOpened",
      occurredAt: now,
      actorId: TARGET_PUBLISH_HOST,
      workstreamId: episode.workstreamId,
      correlationId: episode.command.commandId,
      payload: recorded,
    });
    publication.append(event);
    log(
      `Pushed ${branch} at ${commit} and opened pull request #${recorded.number} on ${recorded.repositoryId}.`,
    );
    return recorded;
  } finally {
    publication.release();
  }
}
