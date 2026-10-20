import { spawnGit, runGit, ensureClean, mainWorktree } from "./git.mjs";
import {
  findLaunchpad,
  loadConfig,
  docPath,
  CONFIG_FILENAME,
} from "./config.mjs";
import {
  COMMITTED_AUTHORITY_GRANTS,
  readAuthorityGrantRegistry,
} from "./authority-grants.mjs";
import { readControl, eventsForOrder } from "./control-store.mjs";
import {
  reviewedTargetSubject,
  targetWorktreeForOrder,
} from "./target-worktrees.mjs";
import { containedRegularFile } from "./paths.mjs";
import { validateTargetRecordsCommit } from "./target-records.mjs";
import { repairedPublicationEpisode } from "./target-repair.mjs";
import { checkTargetHarness } from "./harness.mjs";

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  lstatSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { canonicalStringify, compileLoadout } from "@dotln/compiler";
import { appendEvent, authorize, decodeLog } from "@dotln/kernel";
import { WorkerStore } from "../../packages/skeleton/dist/src/worker-store.js";
import {
  SOURCE_CHANGE_HOST,
  decodeSourceObservation,
  decodeSourceRequest,
} from "../../packages/skeleton/dist/src/source-change-state.js";
import {
  replayVerification,
  VERIFICATION_HOST,
} from "../../packages/skeleton/dist/src/verification.js";
import { repairContract } from "../../packages/skeleton/dist/src/repair.js";
import { hasAiAttribution } from "../../packages/compiler/src/attribution.mjs";
import { checkOutwardArtifact } from "../outward-lint.mjs";
import { targetCommits } from "./target-commit-lint.mjs";
import {
  acceptanceStatuses,
  deliverableReady,
  deliveryContractHash,
  assertGitHubBodyProfile,
  generateTargetPullRequest,
  targetNativeReference,
  targetChangeSection,
  targetGateSection,
  withTemporaryBody,
} from "./github-body.mjs";
import {
  ensureGh,
  executeGh,
  parseGitHubTarget,
  parsePullRequestUrl,
  HOST_GIT_READ,
  pushUrl,
  pushObservedCommit,
} from "./github-repository.mjs";
import { redactPaths } from "./git.mjs";

export { pushUrl, pushObservedCommit } from "./github-repository.mjs";

// Remote effects owned by the publication host, never the source-change writer.
export const PUBLICATION_EFFECTS = Object.freeze([
  "repo.push",
  "pr.open",
  "pr.thread.resolve",
]);
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
  "baselineStore",
  "reviewStore",
  "repositoryId",
  "repairStores",
];
/** A host-owned request. Relative paths resolve beside the request file. */
export function readTargetPublishRequest(path, launchpad = findLaunchpad()) {
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
    typeof request.repositoryId !== "string" ||
    !/^[A-Za-z0-9._/-]+$/u.test(request.baseBranch) ||
    request.environment === null ||
    typeof request.environment !== "object" ||
    Array.isArray(request.environment) ||
    Object.keys(request.environment).sort().join(",") !==
      "baseCommit,capabilities,environmentId,repo,version" ||
    (request.repairStores !== undefined &&
      (!Array.isArray(request.repairStores) ||
        request.repairStores.length > 2 ||
        request.repairStores.some((p) => typeof p !== "string" || !p))) ||
    ["verificationStore", "baselineStore", "reviewStore"].some(
      (key) => request[key] !== undefined && typeof request[key] !== "string",
    )
  )
    throw refuse(
      `the target request requires schemaVersion 1, loadout, an environment of exactly environmentId, version, capabilities, repo and baseCommit (the grant registry is host input), store, baseBranch, repositoryId and optional verificationStore, baselineStore and reviewStore`,
    );
  const base = dirname(file);
  const repository = parseGitHubTarget(`https://${request.repositoryId}`);
  if (repository.selector !== request.repositoryId)
    throw refuse("repositoryId must be canonical HOST/OWNER/REPO");
  const registration =
    loadConfig(launchpad).repositories[request.environment.repo];
  return {
    automationLogins: registration?.automationLogins ?? [],
    linkHosts: registration?.linkHosts ?? [],
    repositoryId: request.repositoryId,
    loadout: resolve(base, request.loadout),
    environment: request.environment,
    store: resolve(base, request.store),
    baseBranch: request.baseBranch,
    ...(request.repairStores === undefined
      ? {}
      : { repairStores: request.repairStores.map((p) => resolve(base, p)) }),
    verificationStore:
      request.verificationStore === undefined
        ? null
        : resolve(base, request.verificationStore),
    baselineStore:
      request.baselineStore === undefined
        ? null
        : resolve(base, request.baselineStore),
    reviewStore:
      request.reviewStore === undefined
        ? null
        : resolve(base, request.reviewStore),
  };
}

// A writer can alter the target's common Git configuration. The confined
// focused test cannot; host Git reads suppress executable target configuration.
const HOOKLESS = HOST_GIT_READ;
const targetGitOptions = {
  trim: false,
  encoding: null,
  onFailure: (result, args) => {
    throw refuse(
      `git ${args[HOOKLESS.length]} failed in the target repository: ${String(result.stderr ?? "").trim()}`,
    );
  },
};
/** Compile the original publisher again, never a repair worker's authority.
 * All local bindings and grants are checked before gh or a remote Git call. */
function reviewPublicationContext(
  { workOrderId, request, registry, now },
  effects,
) {
  const source = JSON.parse(readFileSync(request.loadout, "utf8"));
  const published = compileLoadout(source, {
    ...request.environment,
    authorityGrantRegistry: registry,
  });
  const writer = compileLoadout(writerLoadout(source), request.environment);
  if (!published.ok || !writer.ok)
    throw refuse("review publication loadout does not compile");
  const originalEpisode = readEpisode(request.store);
  bind(published.program, writer, originalEpisode, workOrderId);
  const episode = repairedPublicationEpisode(
    originalEpisode,
    writer,
    request.repairStores ?? [],
    readEpisode,
    observeTarget,
  );
  authorizePublication(published.program, episode, now, effects);
  const url = pushUrl(episode.request.repo, { selector: request.repositoryId });
  const publication = new WorkerStore(join(request.store, "publication"));
  const opened = decodeLog(publication.read()).filter(
    (event) =>
      event.actorId === TARGET_PUBLISH_HOST &&
      event.type === "PullRequestOpened" &&
      event.payload.headSha === episode.observation.commit &&
      event.payload.repositoryId === request.repositoryId,
  );
  if (opened.length !== 1)
    throw refuse(
      "review continuation requires exactly one recorded PullRequestOpened",
    );
  return {
    program: published.program,
    writer,
    episode,
    publication,
    opened: opened[0],
    url,
  };
}

/** The CLI's host-authored repair file cannot replace the original writer,
 * its authority, contract or named tests before dispatching a child. */
export function bindReviewRepairInput(options, repair) {
  const { writer, episode } = reviewPublicationContext(
    { ...options, now: options.now ?? Date.now() },
    [],
  );
  const original = repair?.original;
  const contract = repairContract(writer.program.workOrder);
  if (
    !original ||
    !same(original.workOrder, writer.program.workOrder) ||
    !same(original.authorityEnvelope, writer.program.authorityEnvelope) ||
    !same(repair.source?.artifactIdentity, writer.artifactIdentity) ||
    !same(
      original.criteria?.map((criterion) => criterion.description),
      writer.program.workOrder.acceptanceCriteria,
    ) ||
    !Array.isArray(original.surfaces) ||
    !original.surfaces.length ||
    ![repair.baseline, repair.subject].every(
      (subject) =>
        subject &&
        subject.baseCommit === episode.request.baseCommit &&
        same(subject.snapshot?.contract, contract) &&
        same(subject.snapshot?.tests, original.tests),
    ) ||
    repair.baseline.repo !== repair.subject.repo ||
    repair.baseline.revision !== episode.request.baseCommit ||
    repair.subject.revision !== episode.observation.commit
  )
    throw refuse(
      "the repair input differs from the recorded original writer, contract or tests",
    );
}
const recordReviewEffect = (context, type, payload, now) => {
  const { event } = appendEvent(context.publication.read(), {
    schemaVersion: 1,
    type,
    actorId: TARGET_PUBLISH_HOST,
    occurredAt: now,
    workstreamId: context.episode.workstreamId,
    causationId: context.opened.eventId,
    payload,
  });
  context.publication.append(event);
  return event;
};

/** A real WO-054 acceptance matrix is required for the exact child head. */
export function pushRepairedHead(options) {
  const {
    request,
    repairStore,
    verificationStore,
    itemKey,
    now = Date.now(),
  } = options;
  const context = reviewPublicationContext({ ...options, now }, ["repo.push"]);
  const repair = readEpisode(repairStore);
  const { commit } = repair.observation;
  const payload = {
    itemKey,
    repositoryId: request.repositoryId,
    number: context.opened.payload.number,
    headSha: commit,
    branch: context.episode.publicationBranch ?? context.episode.request.branch,
  };
  const previous = () =>
    decodeLog(context.publication.read()).find(
      (event) =>
        event.actorId === TARGET_PUBLISH_HOST &&
        event.type === "PullRequestRepairPushed" &&
        event.causationId === context.opened.eventId &&
        same(event.payload, payload),
    );
  if (previous()) return previous();
  if (
    repair.request.repo !== context.episode.request.repo ||
    repair.request.workOrderId !==
      `${context.program.workOrder.workOrderId}_repair_1`
  )
    throw refuse("the repair episode belongs to another order or repository");
  if (
    spawnGit([
      "-C",
      repair.request.repo,
      ...HOOKLESS,
      "merge-base",
      "--is-ancestor",
      context.opened.payload.headSha,
      commit,
    ]).status !== 0
  )
    throw refuse(
      "the repaired head does not descend from the recorded pull-request head",
    );
  const matrix = acceptanceMatrix(
    verificationStore,
    commit,
    context.program.workOrder,
  );
  if (!matrix || matrix.rows.some((row) => row.status !== "verified"))
    throw refuse("the repaired head is not independently verified");
  const target = observeTarget(repair);
  lintArtifacts(options.launchpad, [
    { kind: "branch", text: payload.branch },
    ...target.commits.map(({ message }) => ({ kind: "commit", text: message })),
  ]);
  context.publication.acquire();
  try {
    const raced = previous();
    if (raced) return raced;
    // Binding precedes the remote availability/authentication calls too.
    const repository = ensureGh(repair.request.repo);
    if (
      repository.selector.toLowerCase() !== request.repositoryId.toLowerCase()
    )
      throw refuse("origin differs from the requested repository");
    pushObservedCommit(
      repair.request.repo,
      context.url,
      repair.request.branch,
      commit,
      payload.branch,
    );
    return recordReviewEffect(context, "PullRequestRepairPushed", payload, now);
  } finally {
    context.publication.release();
  }
}

/** Evidence-backed structured rejection is the only posted body. Mutation
 * output is checked but never retained as raw provider text. */
export function disposeReviewThread(options) {
  const { request, item, itemKey, judgment, now = Date.now() } = options;
  const context = reviewPublicationContext({ ...options, now }, [
    "pr.thread.resolve",
  ]);
  if (
    item.class !== "automated-review" ||
    item.role !== "automation" ||
    item.refused ||
    !item.threadId
  )
    throw refuse("only an admitted automated review thread can be disposed");
  if (
    !["accept", "reject"].includes(judgment.kind) ||
    !judgment.evidenceRefs?.length ||
    judgment.evidenceRefs.some((ref) => typeof ref !== "string" || !ref)
  )
    throw refuse(
      "thread disposition requires a judgment with evidence references",
    );
  const publishedHead =
    decodeLog(context.publication.read())
      .filter(
        (event) =>
          event.actorId === TARGET_PUBLISH_HOST &&
          event.type === "PullRequestRepairPushed" &&
          event.causationId === context.opened.eventId &&
          event.payload.repositoryId === request.repositoryId &&
          event.payload.number === context.opened.payload.number,
      )
      .at(-1)?.payload.headSha ?? context.opened.payload.headSha;
  if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(publishedHead))
    throw refuse("recorded published head is not a commit id");
  const mappedRefs = judgment.evidenceRefs
    .map((ref) =>
      targetNativeReference(ref, {
        head: publishedHead,
        base: context.episode.request.baseCommit,
      }),
    )
    .filter((ref) => ref !== null);
  const body = canonicalStringify({
    disposition: judgment.kind === "reject" ? "rejected" : "repaired",
    evidenceRefs: mappedRefs.length ? mappedRefs : [`commit ${publishedHead}`],
    omittedReferences: judgment.evidenceRefs.length - mappedRefs.length,
  });
  lintArtifacts(options.launchpad, [{ kind: "pr-body", text: body }]);
  const payload = {
    itemKey,
    itemId: item.id,
    threadId: item.threadId,
    repositoryId: request.repositoryId,
    number: context.opened.payload.number,
    disposition: judgment.kind,
    evidenceRefs: judgment.evidenceRefs,
  };
  const previous = () =>
    decodeLog(context.publication.read()).find(
      (event) =>
        event.actorId === TARGET_PUBLISH_HOST &&
        event.type === "PullRequestThreadDisposed" &&
        event.causationId === context.opened.eventId &&
        same(event.payload, payload),
    );
  if (previous()) return previous();
  const host = request.repositoryId.split("/")[0];
  const mutation = (name, query, variables, field) => {
    const result = executeGh(context.episode.request.repo, [
      "api",
      "graphql",
      "--hostname",
      host,
      "-f",
      `query=mutation ${name}${query}`,
      ...Object.entries(variables).flatMap(([key, value]) => [
        "-f",
        `${key}=${value}`,
      ]),
    ]);
    let data;
    try {
      data = JSON.parse(result.stdout);
    } catch {
      throw refuse(`gh ${name} returned invalid JSON`);
    }
    if (result.status !== 0 || data.errors?.length || !data.data?.[field])
      throw refuse(
        `gh ${name} failed (exit ${result.status ?? "unavailable"})`,
      );
    return data.data[field];
  };
  context.publication.acquire();
  try {
    const raced = previous();
    if (raced) return raced;
    ensureGh(context.episode.request.repo);
    if (judgment.kind === "reject") {
      const posted = decodeLog(context.publication.read()).find(
        (event) =>
          event.type === "PullRequestRejectionPosted" &&
          event.payload.itemKey === itemKey,
      );
      if (!posted) {
        const reply = mutation(
          "DotlnRejectReview",
          "($thread: ID!, $body: String!) { addPullRequestReviewThreadReply(input: {pullRequestReviewThreadId: $thread, body: $body}) { comment { id } } }",
          { thread: item.threadId, body },
          "addPullRequestReviewThreadReply",
        );
        if (typeof reply.comment?.id !== "string")
          throw refuse("rejection reply has no comment identifier");
        recordReviewEffect(context, "PullRequestRejectionPosted", payload, now);
      }
    }
    const result = mutation(
      "DotlnResolveReview",
      "($thread: ID!) { resolveReviewThread(input: {threadId: $thread}) { thread { id isResolved } } }",
      { thread: item.threadId },
      "resolveReviewThread",
    );
    if (
      result.thread?.id !== item.threadId ||
      result.thread.isResolved !== true
    )
      throw refuse("thread resolution response mismatch");
    return recordReviewEffect(
      context,
      "PullRequestThreadDisposed",
      payload,
      now,
    );
  } finally {
    context.publication.release();
  }
}
const gitText = (cwd, ...args) =>
  runGit(cwd, [...HOOKLESS, ...args], {
    ...targetGitOptions,
    ...{ encoding: "utf8" },
  }).replace(/\n$/u, "");

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

export function authorizePublication(
  program,
  episode,
  now,
  effects = ["repo.push", "pr.open"],
) {
  const evidence = episode.command.intent.payload.authorityEvidence ?? [];
  effects.forEach((effect, intentIndex) => {
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
  const head = spawnGit(
    [
      "-C",
      repo,
      ...HOOKLESS,
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
    spawnGit([
      "-C",
      repo,
      ...HOOKLESS,
      "merge-base",
      "--is-ancestor",
      baseCommit,
      commit,
    ]).status !== 0
  )
    throw refuse("the observed commit does not descend from the base");
  const diff = ["--no-ext-diff", "--no-textconv", "--no-renames"];
  const digest = createHash("sha256")
    .update(
      runGit(
        repo,
        [
          ...HOOKLESS,
          ...["diff", "--binary", ...diff, baseCommit, commit, "--"],
        ],
        targetGitOptions,
      ),
    )
    .digest("hex");
  if (digest !== diffHash)
    throw refuse("the target diff differs from the effect receipt");
  return targetChanges(repo, baseCommit, commit);
}

/** Observe the same commit objects for episode and session publication. */
export function targetChanges(repo, baseCommit, commit) {
  const diff = ["--no-ext-diff", "--no-textconv", "--no-renames"];
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
  const commits = targetCommits(repo, baseCommit, commit);
  return { files, commits };
}

export function authorizeRegisteredPublication(
  repository,
  registry,
  now,
  workstreamId,
) {
  return authorizeRegisteredEffects(repository, registry, now, workstreamId, [
    "repo.push",
    "pr.open",
  ]);
}

/** Every listed effect needs one operator grant naming the repository with
 * the effect among its effects and operations, and the kernel's judgment
 * of the registered profile (expiry and revocation included). */
export function authorizeRegisteredEffects(
  repository,
  registry,
  now,
  workstreamId,
  effects,
) {
  const grant = registry.find(
    (entry) =>
      entry.grantedBy === "operator" &&
      entry.repo === repository.id &&
      effects.every(
        (effect) =>
          entry.effects.includes(effect) && entry.operations?.includes(effect),
      ),
  );
  if (!grant)
    throw refuse(
      `${effects.join(" and ")} require an admitted operator grant naming ${repository.id} in repo and ${effects.length > 1 ? "all" : "the"} effects and operations`,
    );
  for (const [intentIndex, effect] of effects.entries()) {
    const decision = authorize(
      { kind: "Act", effect, payload: {} },
      repository.authorityProfile,
      {
        now,
        actorId: TARGET_PUBLISH_HOST,
        workstreamId,
        decisionIndex: 0,
        intentIndex,
        evidence: [],
        revokedBy: [],
      },
    );
    if (!decision.authorized)
      throw refuse(`${effect}: ${decision.refusal.payload.reason}`);
  }
}

/** Session publication reads the registration and the grant registry from
 * main's committed bytes, requiring the working files to match: the
 * publishing branch cannot authorize itself. */
function committedRegistration(main, repositoryId) {
  for (const file of [CONFIG_FILENAME, COMMITTED_AUTHORITY_GRANTS]) {
    const committed = runGit(main, [...HOST_GIT_READ, "show", `HEAD:${file}`], {
      trim: false,
      onFailure: () => null,
    });
    if (
      committed === null ||
      !containedRegularFile(join(main, file), main) ||
      readFileSync(join(main, file), "utf8") !== committed ||
      !/^100(?:644|755) blob /u.test(
        runGit(main, [...HOST_GIT_READ, "ls-tree", "HEAD", "--", file]),
      )
    )
      throw refuse(
        `main's publication authority must match its committed ${file}; merge the authorized authority change into main before publication`,
      );
  }
  const repository = loadConfig(main).repositories[repositoryId];
  if (!repository)
    throw refuse(
      `repository ${repositoryId} is not registered in main's committed authority`,
    );
  return repository;
}

/** The tree of the target worktree's working copy, staged through a
 * temporary index so HEAD and the real index stay untouched. */
function workingTree(target) {
  const scratch = mkdtempSync(join(tmpdir(), "dotln-target-draft-"));
  try {
    const env = { ...process.env, GIT_INDEX_FILE: join(scratch, "index") };
    const inTarget = (args) => {
      const result = spawnGit(["-C", target, ...HOST_GIT_READ, ...args], {
        encoding: "utf8",
        env,
        maxBuffer: 16 * 1024 * 1024,
      });
      if (result.status !== 0)
        throw refuse(
          `git ${args[0]} failed while reading the target's working tree: ${String(result.stderr ?? "").trim()}`,
        );
      return result.stdout.trim();
    };
    inTarget(["read-tree", "HEAD"]);
    inTarget(["add", "-A", "--", "."]);
    return inTarget(["write-tree"]);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

/** Update a pull request's title and body through gh; a failure after the
 * push names the retry. */
function editPullRequest(cwd, forge, number, title, body) {
  const edited = withTemporaryBody(body, (bodyPath) =>
    executeGh(cwd, [
      "pr",
      "edit",
      String(number),
      "--repo",
      forge.selector,
      "--title",
      title,
      "--body-file",
      bodyPath,
    ]),
  );
  if (edited.status !== 0)
    throw refuse(
      `branch pushed but pull request #${number} could not be updated (exit ${edited.status ?? "unavailable"}); rerun the same command`,
    );
}

const draftRecord = (publication) =>
  decodeLog(publication.read())
    .filter(
      (event) =>
        event.type === "PullRequestOpened" && event.payload.draft === true,
    )
    .at(-1)?.payload;

/** The opt-in draft form (WO-221): at verified with a passing verification,
 * a commit object from the target worktree's tree is pushed to the declared
 * branch under a draft pull request, with HEAD and the index untouched. The
 * closed-phase publish of the same order reuses that branch and pull
 * request. Core declares no draft step and no actor; the instance's order
 * names both. */
export function publishTargetDraft({
  launchpad,
  workOrderId,
  branch,
  title,
  body,
  now = Date.now(),
  log = (line) => process.stdout.write(`${line}\n`),
}) {
  const control = readControl(launchpad);
  const state = control.orders.get(workOrderId)?.state;
  if (!state) throw refuse(`${workOrderId} is not an activated order`);
  if (!state.repositoryId)
    throw refuse(`${workOrderId} is not a registered target order`);
  const verification = eventsForOrder(control, workOrderId)
    .filter((event) => event.type === "VerificationCompleted")
    .at(-1);
  if (state.phase !== "verified" || verification?.verdict !== "pass")
    throw refuse(
      `the draft form is legal at verified with a passing verification; ${workOrderId} is ${state.phase}`,
    );
  const entry = targetWorktreeForOrder(launchpad, workOrderId);
  if (
    !entry ||
    entry.repositoryId !== state.repositoryId ||
    entry.baseCommit !== state.baseCommit
  )
    throw refuse("target worktree registry differs from the activated order");
  const main = mainWorktree(launchpad);
  const repository = committedRegistration(main, state.repositoryId);
  authorizeRegisteredPublication(
    repository,
    readAuthorityGrantRegistry(main),
    now,
    workOrderId,
  );
  const boundUrl = pushUrl(entry.target);
  const forge = parseGitHubTarget(boundUrl);
  const read = (args) => runGit(entry.target, [...HOST_GIT_READ, ...args]);
  const headBefore = read(["rev-parse", "HEAD"]);
  const statusBefore = read(["status", "--porcelain"]);
  if (read(["symbolic-ref", "--short", "HEAD"]) !== entry.branch)
    throw refuse(`target worktree is not on ${entry.branch}`);
  const tree = workingTree(entry.target);
  if (tree === read(["rev-parse", `${state.baseCommit}^{tree}`]))
    throw refuse(
      "the target's working tree equals the base; no change to draft",
    );
  try {
    checkTargetHarness(entry.target, { runtimeRoot: entry.runtimeRoot });
  } catch (error) {
    throw refuse(`target bundle ownership is not valid: ${error.message}`);
  }
  const publication = new WorkerStore(
    docPath(main, "control", "local/target-publications", workOrderId),
  );
  const previous = draftRecord(publication);
  const prepared = decodeLog(publication.read())
    .filter((event) => event.type === "DraftPrepared")
    .at(-1)?.payload;
  for (const recorded of [previous, prepared].filter(Boolean)) {
    if (
      recorded.repositoryId.toLowerCase() !== forge.identity ||
      (entry.origin && entry.origin !== forge.identity)
    )
      throw refuse(
        "origin differs from the recorded draft repository; restore the recorded origin before retrying",
      );
    if (recorded.branch !== branch)
      throw refuse(
        `one pull request per order: the draft is on ${recorded.branch}; use --branch ${recorded.branch}`,
      );
  }
  if (entry.origin && entry.origin !== forge.identity)
    throw refuse("origin differs from the registered target repository");
  if (previous && read(["rev-parse", `${previous.headSha}^{tree}`]) === tree) {
    pushObservedCommit(
      entry.target,
      boundUrl,
      entry.branch,
      previous.headSha,
      branch,
      {
        sourceRef: previous.headSha,
        lease: previous.headSha,
        pullRequest: previous.number,
      },
    );
    log(
      `Already published draft at tree ${tree}: pull request #${previous.number} on ${previous.repositoryId} from ${previous.branch}; nothing pushed.`,
    );
    return previous;
  }
  if (previous && previous.branch !== branch)
    throw refuse(
      `one pull request per order: the draft is on ${previous.branch}; use --branch ${previous.branch}`,
    );
  const retainedCommit =
    prepared?.tree === tree &&
    prepared.parent === headBefore &&
    prepared.title === title
      ? prepared.headSha
      : null;
  const commit = retainedCommit
    ? { status: 0, stdout: retainedCommit }
    : spawnGit(
        [
          "-C",
          entry.target,
          ...HOST_GIT_READ,
          "commit-tree",
          tree,
          "-p",
          headBefore,
          "-m",
          title,
        ],
        { encoding: "utf8" },
      );
  if (commit.status !== 0)
    throw refuse(
      `git commit-tree failed: ${redactPaths(String(commit.stderr ?? "").trim(), [[entry.target, "<target>"]])}`,
    );
  const draftCommit = commit.stdout.trim();
  const changes = targetChanges(entry.target, state.baseCommit, draftCommit);
  const publishedBody = `${body.trimEnd()}\n\n${targetChangeSection({ baseCommit: state.baseCommit, headCommit: draftCommit, files: changes.files })}\n`;
  lintArtifacts(main, [
    { kind: "branch", text: branch },
    { kind: "commit", text: title },
    { kind: "pr-title", text: title },
    { kind: "pr-body", text: publishedBody },
  ]);
  assertGitHubBodyProfile(publishedBody, "draft target body");
  if (hasAiAttribution(title) || hasAiAttribution(publishedBody))
    throw refuse("target publication contains AI attribution");
  // The lane fetches a ref, so the draft commit gets one under refs/dotln;
  // no branch moves and the index is untouched.
  const sourceRef = `refs/dotln/draft/${workOrderId}`;
  read(["update-ref", sourceRef, draftCommit]);
  publication.acquire();
  try {
    if (!retainedCommit) {
      const { event } = appendEvent(publication.read(), {
        schemaVersion: 1,
        type: "DraftPrepared",
        occurredAt: now,
        actorId: TARGET_PUBLISH_HOST,
        workstreamId: workOrderId,
        correlationId: workOrderId,
        payload: {
          repositoryId: forge.selector,
          branch,
          headSha: draftCommit,
          tree,
          parent: headBefore,
          title,
        },
      });
      publication.append(event);
    }
    const resolved = ensureGh(entry.target);
    if (resolved.selector.toLowerCase() !== forge.identity)
      throw refuse("origin differs from the bound target repository");
    pushObservedCommit(
      entry.target,
      boundUrl,
      entry.branch,
      draftCommit,
      branch,
      {
        sourceRef,
        ...(previous
          ? { lease: previous.headSha, pullRequest: previous.number }
          : prepared
            ? { lease: prepared.headSha, allowAbsent: true }
            : {}),
      },
    );
    let payload;
    if (previous) {
      editPullRequest(
        entry.target,
        forge,
        previous.number,
        title,
        publishedBody,
      );
      payload = { ...previous, headSha: draftCommit };
    } else {
      const created = withTemporaryBody(publishedBody, (bodyPath) =>
        executeGh(entry.target, [
          "pr",
          "create",
          "--draft",
          "--repo",
          forge.selector,
          "--head",
          branch,
          "--base",
          repository.baseBranch,
          "--title",
          title,
          "--body-file",
          bodyPath,
        ]),
      );
      let number =
        created.status === 0
          ? parsePullRequestUrl(created.stdout, forge)
          : null;
      if (number === null) {
        const found = executeGh(entry.target, [
          "pr",
          "view",
          branch,
          "--repo",
          forge.selector,
          "--json",
          "number,headRefOid,headRefName,baseRefName,isDraft",
        ]);
        try {
          const observed = JSON.parse(found.stdout);
          if (
            found.status === 0 &&
            observed.isDraft === true &&
            observed.headRefOid === draftCommit &&
            observed.headRefName === branch &&
            observed.baseRefName === repository.baseBranch &&
            Number.isInteger(observed.number)
          )
            number = observed.number;
        } catch {
          /* A missing or ambiguous pull request cannot be adopted. */
        }
      }
      if (number === null)
        throw refuse(
          "branch pushed but draft pull-request creation or lookup failed; its prepared commit is retained, so rerun the same command after inspecting the repository",
        );
      payload = {
        repositoryId: forge.selector,
        number,
        headSha: draftCommit,
        draft: true,
        branch,
      };
    }
    const { event } = appendEvent(publication.read(), {
      schemaVersion: 1,
      type: "PullRequestOpened",
      occurredAt: now,
      actorId: TARGET_PUBLISH_HOST,
      workstreamId: workOrderId,
      correlationId: workOrderId,
      payload,
    });
    publication.append(event);
    if (
      read(["rev-parse", "HEAD"]) !== headBefore ||
      read(["status", "--porcelain"]) !== statusBefore
    )
      throw refuse(
        "the target worktree changed while the draft was published; inspect it before retrying",
      );
    log(
      `Pushed draft ${branch} at ${draftCommit} and ${previous ? "updated" : "opened"} draft pull request #${payload.number} on ${forge.selector}; HEAD and the index are unchanged.`,
    );
    return payload;
  } finally {
    publication.release();
  }
}

/** Publish a session's bound review; no source-change episode is synthesized. */
export function publishTargetWorktree({
  launchpad,
  workOrderId,
  branch,
  title,
  body,
  now = Date.now(),
  log = (line) => process.stdout.write(`${line}\n`),
}) {
  ensureClean(launchpad);
  const control = readControl(launchpad, "HEAD");
  const state = control.orders.get(workOrderId)?.state;
  const review = eventsForOrder(control, workOrderId)
    .filter((event) => event.type === "FinalReviewCompleted")
    .at(-1);
  if (state?.phase !== "closed" || review?.verdict !== "pass")
    throw refuse(`${workOrderId} has no committed passing final review`);
  const subject = review.targetSubject;
  if (!subject)
    throw refuse(`${workOrderId} final review has no targetSubject`);
  const observed = reviewedTargetSubject(launchpad, state);
  const records = state.targetRecords;
  if (!records)
    throw refuse(`${workOrderId} has no committed TargetRecordsCommitted`);
  const gate = review.targetGate;
  if (
    !gate ||
    gate.commit !== subject.commit ||
    gate.repositoryId !== subject.repositoryId ||
    gate.selection !== "review"
  )
    throw refuse(
      `${workOrderId} has no passing targetGate bound to the reviewed commit ${subject.commit}`,
    );
  if (observed.commit !== records.commit)
    throw refuse(
      `target commit ${observed.commit} differs from records commit ${records.commit} after reviewed commit ${subject.commit}; review the changed target before publication`,
    );
  if (subject.commit === subject.baseCommit)
    throw refuse(
      "reviewed target commit equals the base; no target change to publish",
    );
  const entry = targetWorktreeForOrder(launchpad, workOrderId);
  const main = mainWorktree(launchpad);
  const repository = committedRegistration(main, subject.repositoryId);
  validateTargetRecordsCommit(entry.target, subject, records, repository);
  authorizeRegisteredPublication(
    repository,
    readAuthorityGrantRegistry(main),
    now,
    workOrderId,
  );
  const boundUrl = pushUrl(entry.target);
  const forge = parseGitHubTarget(boundUrl);
  if (entry.origin && entry.origin !== forge.identity)
    throw refuse("origin differs from the registered target repository");
  const changes = targetChanges(
    entry.target,
    subject.baseCommit,
    records.commit,
  );
  const manifestPath = ".claude/target-worker-manifest.json";
  const manifestFile = join(entry.target, manifestPath);
  try {
    checkTargetHarness(entry.target, { runtimeRoot: entry.runtimeRoot });
  } catch (error) {
    throw refuse(`target bundle ownership is not valid: ${error.message}`);
  }
  const owned = new Set([manifestPath]);
  if (lstatSync(manifestFile, { throwIfNoEntry: false })) {
    if (!containedRegularFile(manifestFile, entry.target))
      throw refuse("target bundle manifest is not a contained regular file");
    for (const file of JSON.parse(readFileSync(manifestFile, "utf8")).installed)
      owned.add(file.path);
  }
  const bundleChanges = changes.files.filter((file) => owned.has(file.path));
  if (bundleChanges.length)
    throw refuse(
      `target changes include installed bundle files: ${bundleChanges.map((file) => file.path).join(", ")}`,
    );
  const publishedBody = `${body.trimEnd()}\n\n${targetChangeSection({ baseCommit: subject.baseCommit, headCommit: records.commit, files: changes.files })}\n\n${targetGateSection(gate)}\n`;
  lintArtifacts(main, [
    { kind: "branch", text: branch },
    ...changes.commits.map(({ message }) => ({
      kind: "commit",
      text: message,
    })),
    { kind: "pr-title", text: title },
    { kind: "pr-body", text: publishedBody },
  ]);
  assertGitHubBodyProfile(publishedBody, "reviewed target body");
  if (
    hasAiAttribution(title) ||
    hasAiAttribution(publishedBody) ||
    changes.commits.some(({ message }) => hasAiAttribution(message))
  )
    throw refuse("target publication contains AI attribution");
  const publication = new WorkerStore(
    docPath(main, "control", "local/target-publications", workOrderId),
  );
  return publishBoundTargetCommit({
    target: entry.target,
    sourceBranch: entry.branch,
    commit: records.commit,
    branch,
    title,
    body: publishedBody,
    repository,
    forge,
    boundUrl,
    publication,
    workstreamId: workOrderId,
    now,
    log,
  });
}

/** Shared remote lane after each route has checked its own local authority. */
export function publishBoundTargetCommit({
  target,
  sourceBranch,
  commit,
  branch,
  title,
  body,
  repository,
  forge,
  boundUrl,
  publication,
  workstreamId,
  now,
  log,
}) {
  const prior = () => readPublication(publication, commit)?.payload;
  const already = (recorded) => {
    if (recorded.repositoryId.toLowerCase() !== forge.identity)
      throw refuse(
        "origin differs from the recorded publication repository; restore the recorded origin before retrying",
      );
    log(
      `Already published commit ${commit}: pull request #${recorded.number} on ${recorded.repositoryId}; nothing pushed.`,
    );
    return recorded;
  };
  const previous = prior();
  if (previous) return already(previous);
  publication.acquire();
  try {
    const raced = prior();
    if (raced) return already(raced);
    const resolved = ensureGh(target);
    if (resolved.selector.toLowerCase() !== forge.identity)
      throw refuse("origin differs from the bound target repository");
    // A draft opened at verified is reused: the reviewed commit replaces the
    // draft head under a lease, the title and body are updated and the pull
    // request is marked ready. One pull request per order (WO-221).
    const draft = draftRecord(publication);
    if (draft && draft.repositoryId.toLowerCase() !== forge.identity)
      throw refuse(
        "origin differs from the recorded draft repository; restore the recorded origin before retrying",
      );
    if (draft && draft.branch !== branch)
      throw refuse(
        `one pull request per order: the draft is on ${draft.branch}; publish with --branch ${draft.branch}`,
      );
    pushObservedCommit(
      target,
      boundUrl,
      sourceBranch,
      commit,
      branch,
      draft ? { lease: draft.headSha, pullRequest: draft.number } : {},
    );
    if (draft) {
      editPullRequest(target, forge, draft.number, title, body);
      const ready = executeGh(target, [
        "pr",
        "ready",
        String(draft.number),
        "--repo",
        forge.selector,
      ]);
      if (ready.status !== 0)
        throw refuse(
          `branch pushed and pull request updated but not marked ready (exit ${ready.status ?? "unavailable"}); rerun the same command`,
        );
      const payload = {
        repositoryId: forge.selector,
        number: draft.number,
        headSha: commit,
        reusedDraft: draft.headSha,
      };
      const { event } = appendEvent(publication.read(), {
        schemaVersion: 1,
        type: "PullRequestOpened",
        occurredAt: now,
        actorId: TARGET_PUBLISH_HOST,
        workstreamId,
        correlationId: workstreamId,
        payload,
      });
      publication.append(event);
      log(
        `Pushed ${branch} at ${commit} over draft ${draft.headSha} and marked pull request #${payload.number} on ${forge.selector} ready.`,
      );
      return payload;
    }
    const created = withTemporaryBody(body, (bodyPath) =>
      executeGh(target, [
        "pr",
        "create",
        "--repo",
        forge.selector,
        "--head",
        branch,
        "--base",
        repository.baseBranch,
        "--title",
        title,
        "--body-file",
        bodyPath,
      ]),
    );
    if (created.status !== 0)
      throw refuse(
        `branch pushed but pull-request creation failed (exit ${created.status ?? "unavailable"})`,
      );
    const number = parsePullRequestUrl(created.stdout, forge);
    if (number === null)
      throw refuse(
        "pull request created but its number could not be read; inspect the repository before retrying",
      );
    const payload = {
      repositoryId: forge.selector,
      number,
      headSha: commit,
    };
    const { event } = appendEvent(publication.read(), {
      schemaVersion: 1,
      type: "PullRequestOpened",
      occurredAt: now,
      actorId: TARGET_PUBLISH_HOST,
      workstreamId,
      correlationId: workstreamId,
      payload,
    });
    publication.append(event);
    log(
      `Pushed ${branch} at ${commit} and opened pull request #${payload.number} on ${forge.selector}.`,
    );
    return payload;
  } finally {
    publication.release();
  }
}

function verificationArtifacts(path) {
  if (path == null) return [];
  try {
    const store = new WorkerStore(path);
    if (existsSync(join(store.directory, "host.lock")))
      throw new Error("finish or recover the evidence host first");
    const events = decodeLog(store.read());
    const streams = [
      ...new Set(
        events
          .filter(
            (event) =>
              event.type === "VerificationOpened" &&
              event.actorId === VERIFICATION_HOST,
          )
          .map((event) => event.workstreamId),
      ),
    ];
    return streams.map((id) => ({
      events,
      state: replayVerification(events, id),
    }));
  } catch (error) {
    throw refuse(
      `the verification store cannot be replayed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function acceptanceArtifacts(artifacts, path, commit, workOrder) {
  if (path == null) return { matrix: null, verification: null };
  const current = artifacts.filter(
    ({ state }) => state.subject?.revision === commit,
  );
  if (current.length !== 1)
    throw refuse(
      "the verification store has no single acceptance matrix for the published head",
    );
  const state = current[0].state;
  const rows = state.rows.map((row) => ({
    description: row.criterion.description,
    status: row.status,
  }));
  if (acceptanceStatuses(workOrder.acceptanceCriteria, rows) === null)
    throw refuse(
      "the acceptance matrix for the published head does not verify this WorkOrder's acceptance criteria",
    );
  return {
    matrix: { subjectRevision: commit, rows },
    verification: {
      ref: `verification:${state.workstreamId}`,
      value: {
        subjectRevision: commit,
        phase: state.next,
        subject: state.subject,
        rows: state.rows,
        evidence: state.evidence,
        implementerEpisodes: state.implementerEpisodes,
      },
    },
  };
}

function acceptanceMatrix(path, commit, workOrder) {
  return acceptanceArtifacts(
    verificationArtifacts(path),
    path,
    commit,
    workOrder,
  ).matrix;
}

function readDeliveryPreparation(storePath) {
  const file = join(storePath, "delivery-preparation.json");
  const stat = lstatSync(file, { throwIfNoEntry: false });
  if (!stat) return null;
  if (!stat.isFile())
    throw refuse("delivery-preparation.json must be a regular file");
  let value;
  try {
    value = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    throw refuse("delivery-preparation.json must contain valid JSON");
  }
  const object = (entry) =>
    entry !== null && typeof entry === "object" && !Array.isArray(entry);
  const lines = (entries) =>
    Array.isArray(entries) &&
    entries.every((entry) => typeof entry === "string" && entry.trim());
  const notApplicable = (key, entry) =>
    ["build", "lint"].includes(key) &&
    object(entry) &&
    Object.keys(entry).sort().join(",") === "reason,status" &&
    entry.status === "not-applicable" &&
    typeof entry.reason === "string" &&
    entry.reason.trim();
  const keys = [
    "schemaVersion",
    "workOrderId",
    "subjectRevision",
    "contractHash",
    "diffHash",
    "unresolvedMaterialAmbiguities",
    "checks",
    "monitoring",
  ];
  if (
    !object(value) ||
    Object.keys(value).some((key) => !keys.includes(key)) ||
    value.schemaVersion !== 1 ||
    typeof value.workOrderId !== "string" ||
    !value.workOrderId.trim() ||
    !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(value.subjectRevision ?? "") ||
    ![value.contractHash, value.diffHash].every(
      (hash) => typeof hash === "string" && /^[a-f0-9]{64}$/u.test(hash),
    ) ||
    (value.unresolvedMaterialAmbiguities !== undefined &&
      !lines(value.unresolvedMaterialAmbiguities)) ||
    (value.checks !== undefined &&
      (!object(value.checks) ||
        Object.entries(value.checks).some(
          ([key, entries]) =>
            !["tests", "build", "lint"].includes(key) ||
            (!lines(entries) && !notApplicable(key, entries)),
        ))) ||
    (value.monitoring !== undefined &&
      (!object(value.monitoring) ||
        Object.keys(value.monitoring).sort().join(",") !==
          "ciFailure,command,headRevision,owner,repositoryId,reviewComments,sourceDrift,terminalState" ||
        Object.values(value.monitoring).some(
          (entry) => typeof entry !== "string" || !entry.trim(),
        )))
  )
    throw refuse(
      "delivery-preparation.json has an invalid typed preparation shape",
    );
  return { ref: "delivery-preparation", value };
}

// Fixed aliases keep private filesystem paths out of the outward artifact.
function readinessArtifacts(request, episode, target, workOrder, bodyInputs) {
  const verificationLog = verificationArtifacts(request.verificationStore);
  const acceptance = acceptanceArtifacts(
    verificationLog,
    request.verificationStore,
    episode.observation.commit,
    workOrder,
  );
  const baselineLog = request.baselineStore
    ? verificationArtifacts(request.baselineStore)
    : verificationLog;
  const reviewLog = request.reviewStore
    ? verificationArtifacts(request.reviewStore)
    : verificationLog;
  const baseline = baselineLog.filter(
    ({ state, events }) =>
      state.baselineWitness?.capsule.subject.revision ===
        episode.request.baseCommit &&
      deliveryContractHash(
        state.baselineWitness.capsule.subject.snapshot?.contract,
      ) === deliveryContractHash(workOrder) &&
      events.some(
        (event) =>
          event.actorId === VERIFICATION_HOST &&
          event.workstreamId === state.workstreamId &&
          event.type === "BaselineWitnessed" &&
          same(event.payload, state.baselineWitness),
      ),
  );
  const review = reviewLog.filter(
    ({ state }) =>
      state.reviewCompleted?.subjectRevision === episode.observation.commit,
  );
  const sourceRef = (type) =>
    `source-event:${
      episode.events.find(
        (event) => event.actorId === SOURCE_CHANGE_HOST && event.type === type,
      ).eventId
    }`;
  return {
    matrix: acceptance.matrix,
    artifacts: {
      current: {
        ref: `commit:${episode.observation.commit}`,
        value: {
          revision: episode.observation.commit,
          expectedRevision: episode.observation.commit,
        },
      },
      contract: { ref: sourceRef("CommandPersisted"), value: workOrder },
      implementation: {
        ref: sourceRef("SourceChangeObserved"),
        value: {
          revision: episode.observation.commit,
          baseCommit: episode.request.baseCommit,
          diffHash: episode.observation.diffHash,
          files: target.files,
          repositoryId: request.repositoryId,
          startedAt: Math.min(
            ...episode.events
              .filter(
                (event) =>
                  event.actorId === SOURCE_CHANGE_HOST &&
                  event.type === "WorkerAttemptStarted",
              )
              .map((event) => event.occurredAt),
          ),
          episodeIds: episode.events
            .filter(
              (event) =>
                event.actorId === SOURCE_CHANGE_HOST &&
                event.type === "WorkerAttemptStarted",
            )
            .map((event) => event.payload.workerEpisodeId),
        },
      },
      scope: {
        ref: sourceRef("SourceChangeRequested"),
        value: { surfaces: episode.request.surfaces },
      },
      baseline:
        baseline.length === 1
          ? {
              ref: `baseline-event:${
                baseline[0].events.find(
                  (event) =>
                    event.actorId === VERIFICATION_HOST &&
                    event.workstreamId === baseline[0].state.workstreamId &&
                    event.type === "BaselineWitnessed",
                ).eventId
              }`,
              occurredAt: baseline[0].events.find(
                (event) =>
                  event.actorId === VERIFICATION_HOST &&
                  event.workstreamId === baseline[0].state.workstreamId &&
                  event.type === "BaselineWitnessed",
              ).occurredAt,
              value: baseline[0].state.baselineWitness,
            }
          : null,
      verification: acceptance.verification,
      review:
        review.length === 1
          ? {
              ref: `review-event:${
                review[0].events.find(
                  (event) =>
                    event.actorId === VERIFICATION_HOST &&
                    event.workstreamId === review[0].state.workstreamId &&
                    event.type === "ReviewCompleted",
                ).eventId
              }`,
              value: {
                result: review[0].state.reviewCompleted,
                subject: review[0].state.subject,
              },
            }
          : null,
      preparation: readDeliveryPreparation(request.store),
      body: {
        ref: "#acceptance",
        value: { ...bodyInputs, matrix: acceptance.matrix },
      },
    },
  };
}

export function lintArtifacts(launchpad, artifacts) {
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
  requireDeliverableReady = false,
  preview = false,
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
  const originalEpisode = readEpisode(request.store);
  bind(program, writer, originalEpisode, workOrderId);
  const episode = repairedPublicationEpisode(
    originalEpisode,
    writer,
    request.repairStores ?? [],
    readEpisode,
    observeTarget,
  );
  const { repo, baseCommit } = episode.request;
  const branch = episode.publicationBranch ?? episode.request.branch;
  const { commit } = episode.observation;
  const publication = new WorkerStore(join(request.store, "publication"));
  const already = () => readPublication(publication, commit)?.payload;
  const reportAlready = (opened) => {
    log(
      `Already published ${branch} at ${commit}: pull request #${opened.number} on ${opened.repositoryId}; nothing pushed.`,
    );
    return opened;
  };
  const previous = already();
  if (previous && !requireDeliverableReady && !preview)
    return reportAlready(previous);
  authorizePublication(program, episode, now);
  const boundUrl = pushUrl(repo, { selector: request.repositoryId });
  const target = observeTarget(episode);
  const payload = episode.command.intent.payload;
  const head = target.commits.at(-1);
  if (head?.sha !== commit || head.message !== payload.commitMessage.trimEnd())
    throw refuse("the observed commit message differs from the host message");
  const bodyInputs = {
    commitMessage: payload.commitMessage,
    workOrder: program.workOrder,
    tests: {
      before: episode.observation.testBefore,
      after: episode.observation.testAfter,
    },
    diff: { baseCommit, headCommit: commit, files: target.files },
  };
  const readiness = readinessArtifacts(
    request,
    episode,
    target,
    program.workOrder,
    bodyInputs,
  );
  const absent = deliverableReady(readiness.artifacts).filter(
    (row) => row.status === "absent",
  );
  if (requireDeliverableReady && absent.length)
    throw refuse(
      `deliverable-ready evidence absent: ${absent.map((row) => row.item).join("; ")}`,
    );
  if (previous && !preview) return reportAlready(previous);
  const { title, body } = generateTargetPullRequest({
    ...bodyInputs,
    matrix: readiness.matrix,
    readinessArtifacts: readiness.artifacts,
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
  if (preview)
    return {
      title,
      body,
      branch,
      commit,
      readiness: deliverableReady(readiness.artifacts),
    };
  // One publisher per episode from here; a concurrent winner is reported.
  publication.acquire();
  try {
    const raced = already();
    if (raced) return reportAlready(raced);
    const repository = ensureGh(repo);
    if (
      repository.selector.toLowerCase() !== request.repositoryId.toLowerCase()
    )
      throw refuse("origin differs from the requested repository");
    pushObservedCommit(repo, boundUrl, episode.request.branch, commit, branch);
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
