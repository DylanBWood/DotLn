import { execFileSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import {
  canonicalStringify,
  type AcceptanceCriterion,
  type RepositoryFile,
  type VerificationEvidence,
  type VerificationSubject,
} from "@dotln/compiler";
import {
  decodeLog,
  type AuthorityEnvelope,
  type Command,
  type Decision,
  type Event,
  type ResultEnvelope,
} from "@dotln/kernel";
import type { VerificationTask } from "@dotln/compiler";
import { WorkerStore } from "./worker-store.js";
import { WorkerWorktrees } from "./worker-worktree.js";
import { WorkerFailure, type WorkerEffort } from "./worker-protocol.js";
import type { WorkOrderTransport } from "./worker-transport.js";
import type { EvidenceWorkerRequest } from "./verification-protocol.js";
import {
  VerificationDriver,
  VerificationHost,
  type VerificationHostOptions,
} from "./verification-host.js";
import {
  projectAcceptanceEvidenceMatrices,
  type AcceptanceEvidenceMatrix,
  type VerificationState,
} from "./verification.js";
import type { RuntimeState } from "./reactor.js";

export const VERIFICATION_WORKSTREAM = "ws_independent_verification";
const selector =
  "export const select = (inventory, policy) => inventory.filter(file => file.generated && (policy.includeReferenced || file.references.length === 0)).map(file => file.path);\n";
const inventory = [
  { path: "unused.tmp", generated: true, references: [] },
  { path: "used.tmp", generated: true, references: ["entry.ts"] },
];
const descriptor = "Synthetic independent verification fixture.\n";
const paths = ["policy.json", "inventory.json", "select.mjs", "README.txt"];
export const verificationFixtureCriteria: readonly AcceptanceCriterion[] = [
  {
    criterionId: "AC-policy",
    description: "The policy schema version is 1.",
    claimType: "state",
    evidenceSource: "synthetic-fixture",
    codeSurfaces: ["policy.json"],
    requiredChecks: ["policy-schema"],
  },
  {
    criterionId: "AC-selection",
    description:
      "Selecting generated files excludes files that are still referenced.",
    claimType: "behavior",
    evidenceSource: "synthetic-fixture",
    codeSurfaces: ["policy.json", "inventory.json", "select.mjs"],
    requiredChecks: ["exclude-referenced"],
  },
  {
    criterionId: "AC-description",
    description: "The fixture has its source descriptor.",
    claimType: "state",
    evidenceSource: "synthetic-fixture",
    codeSurfaces: ["README.txt"],
    requiredChecks: ["fixture-descriptor"],
  },
];
const git = (cwd: string, ...args: string[]) =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 15_000,
  }).trim();
function commit(repository: string, message: string): string {
  git(repository, "add", "--", ...paths);
  execFileSync(
    "git",
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "-c",
      "core.hooksPath=/dev/null",
      "commit",
      "--quiet",
      "-m",
      message,
    ],
    {
      cwd: repository,
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 15_000,
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: "2026-09-06T00:00:00Z",
        GIT_COMMITTER_DATE: "2026-09-06T00:00:00Z",
      },
    },
  );
  return git(repository, "rev-parse", "HEAD");
}
const same = (a: unknown, b: unknown) =>
  canonicalStringify(a) === canonicalStringify(b);
function readFiles(repository: string): readonly RepositoryFile[] {
  if (
    realpathSync(git(repository, "rev-parse", "--show-toplevel")) !==
    realpathSync(repository)
  )
    throw new WorkerFailure("profile-refused");
  return paths.map((path) => {
    const file = join(repository, path);
    if (!lstatSync(file).isFile() || lstatSync(file).isSymbolicLink())
      throw new WorkerFailure("profile-refused");
    return { path, contents: readFileSync(file, "utf8") };
  });
}

/** Real store reads and a real subprocess, over an explicitly synthetic fixture. */
export function witnessVerificationFixture(
  repository: string,
  baseCommit: string,
): VerificationSubject {
  const files = readFiles(repository);
  const revision = git(repository, "rev-parse", "HEAD");
  if (
    git(
      repository,
      "status",
      "--porcelain",
      "--untracked-files=all",
      "--ignored=matching",
    ) !== ""
  )
    throw new WorkerFailure("profile-refused");
  // Only the fixed interpreter may execute. Repairs are declarative JSON data.
  if (files.find((file) => file.path === "select.mjs")?.contents !== selector)
    throw new WorkerFailure("profile-refused");
  const policy = JSON.parse(
    files.find((file) => file.path === "policy.json")!.contents,
  ) as { schemaVersion: number; includeReferenced: boolean };
  const schemaObserved = String(policy.schemaVersion);
  let observed: string;
  let outcome: VerificationEvidence["outcome"];
  const expected = '["unused.tmp"]';
  try {
    observed = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        'import {readFileSync} from "node:fs"; import {select} from "./select.mjs"; console.log(JSON.stringify(select(JSON.parse(readFileSync("inventory.json","utf8")),JSON.parse(readFileSync("policy.json","utf8")))));',
      ],
      {
        cwd: repository,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 5_000,
        maxBuffer: 64_000,
      },
    ).trim();
    outcome = observed === expected ? "pass" : "fail";
  } catch {
    observed = "fixture execution unavailable";
    outcome = "unavailable";
  }
  const record = (
    criterion: AcceptanceCriterion,
    actual: string,
    expected: string,
    outcome: VerificationEvidence["outcome"],
    automatedTest: string | null,
    reproduction: string,
  ): VerificationEvidence => ({
    evidenceId: `${revision}:${criterion.requiredChecks[0]}`,
    criterionId: criterion.criterionId,
    checkId: criterion.requiredChecks[0]!,
    claimType: criterion.claimType,
    source: "synthetic-fixture",
    subjectRevision: revision,
    codeSurfaces: criterion.codeSurfaces,
    automatedTest,
    observed: actual,
    expected,
    outcome,
    reproductionSteps: [reproduction],
  });
  const descriptionObserved = files
    .find((file) => file.path === "README.txt")!
    .contents.trim();
  return {
    repo: "synthetic-verification-fixture",
    baseCommit,
    revision,
    diff: git(
      repository,
      "diff",
      "--no-ext-diff",
      "--no-textconv",
      baseCommit,
      revision,
      "--",
      ...paths,
    ),
    files,
    evidence: [
      record(
        verificationFixtureCriteria[0]!,
        schemaObserved,
        "1",
        schemaObserved === "1" ? "pass" : "fail",
        null,
        "Read policy.json and compare schemaVersion with 1.",
      ),
      record(
        verificationFixtureCriteria[1]!,
        observed,
        expected,
        outcome,
        "fixture.select.exclude-referenced",
        "Run select(inventory, policy) from select.mjs with the checked-in JSON inputs.",
      ),
      record(
        verificationFixtureCriteria[2]!,
        descriptionObserved,
        descriptor.trim(),
        descriptionObserved === descriptor.trim() ? "pass" : "fail",
        null,
        "Read README.txt and compare with the fixture descriptor.",
      ),
    ],
  };
}

function createFixture(repository: string): {
  baseline: VerificationSubject;
  subject: VerificationSubject;
} {
  mkdirSync(repository, { mode: 0o700 });
  git(repository, "init", "--quiet");
  if (
    realpathSync(git(repository, "rev-parse", "--show-toplevel")) !==
    realpathSync(repository)
  )
    throw new WorkerFailure("profile-refused");
  writeFileSync(
    join(repository, "policy.json"),
    JSON.stringify({ schemaVersion: 1, includeReferenced: false }) + "\n",
  );
  writeFileSync(
    join(repository, "inventory.json"),
    JSON.stringify(inventory) + "\n",
  );
  writeFileSync(join(repository, "select.mjs"), selector);
  writeFileSync(join(repository, "README.txt"), descriptor);
  const base = commit(repository, "Synthetic baseline");
  const baseline = witnessVerificationFixture(repository, base);
  // This is the deliberately planted implementation defect, after baseline evidence.
  writeFileSync(
    join(repository, "policy.json"),
    JSON.stringify({ schemaVersion: 1, includeReferenced: true }) + "\n",
  );
  commit(repository, "Plant referenced-file selection defect");
  return { baseline, subject: witnessVerificationFixture(repository, base) };
}

function applyFixtureRepair(
  repository: string,
  state: VerificationState,
): VerificationSubject {
  const { proposal, subject } = state;
  if (!proposal || !subject) throw new WorkerFailure("profile-refused");
  // This adapter admits data repair only. It cannot run proposed source code.
  for (const file of proposal.replacements) {
    if (file.path !== "policy.json") throw new WorkerFailure("profile-refused");
    const data = JSON.parse(file.contents);
    if (
      !same(Object.keys(data).sort(), ["includeReferenced", "schemaVersion"]) ||
      typeof data.includeReferenced !== "boolean" ||
      data.schemaVersion !== 1
    )
      throw new WorkerFailure("profile-refused");
  }
  const expected = subject.files.map(
    (file) =>
      proposal.replacements.find(
        (replacement) => replacement.path === file.path,
      ) ?? file,
  );
  const head = git(repository, "rev-parse", "HEAD");
  if (head === subject.revision) {
    const actual = readFiles(repository);
    // A crash during an already validated write may leave only that proposal dirty.
    if (
      !actual.every(
        (file, index) =>
          same(file, subject.files[index]) || same(file, expected[index]),
      )
    )
      throw new WorkerFailure("profile-refused");
    for (const file of proposal.replacements)
      writeFileSync(join(repository, file.path), file.contents);
    commit(repository, "Apply focused verification repair");
  } else if (
    git(repository, "rev-parse", "HEAD^") !== subject.revision ||
    !same(readFiles(repository), expected)
  )
    throw new WorkerFailure("profile-refused");
  return witnessVerificationFixture(repository, subject.baseCommit);
}

export interface VerificationDemoOptions {
  readonly directory: string;
  readonly transport: WorkOrderTransport<EvidenceWorkerRequest>;
  readonly model: string;
  readonly effort: WorkerEffort;
  readonly now?: () => number;
  readonly maxRepairs?: number;
  readonly authority?: AuthorityEnvelope;
  readonly implementerNarrative?: string;
  readonly onEvent?: (event: Event, state: VerificationState) => void;
  readonly afterResultSaved?: VerificationHostOptions["afterResultSaved"];
  readonly afterRepairApplied?: () => void;
  readonly onRunning?: VerificationHostOptions["onRunning"];
}
export async function runVerificationDemo(
  options: VerificationDemoOptions,
): Promise<{
  envelope: ResultEnvelope;
  matrix: AcceptanceEvidenceMatrix;
  log: string;
  decisions: readonly Decision<RuntimeState>[];
}> {
  const now = options.now ?? Date.now;
  const store = new WorkerStore(options.directory);
  store.acquire();
  try {
    const driver = new VerificationDriver(
      store,
      VERIFICATION_WORKSTREAM,
      options.onEvent,
    );
    const selection = {
      transport: options.transport.name,
      model: options.model,
      effort: options.effort,
      harnessVersion: options.transport.harnessVersion,
    };
    const prior = decodeLog(driver.log).find(
      (event) => event.type === "VerificationHostConfigured",
    );
    if (prior && !same(prior.payload, selection))
      throw new WorkerFailure("profile-refused");
    if (!prior) driver.record("VerificationHostConfigured", now(), selection);
    const repository = join(store.directory, "repository");
    if (driver.state.next === "unopened") {
      const fixture = createFixture(repository);
      driver.record("VerificationOpened", now(), {
        ...fixture,
        criteria: verificationFixtureCriteria,
        implementerEpisodeId: "ep_implementer_1",
        maxRepairs: options.maxRepairs ?? 3,
        authority: options.authority ?? {
          authorityEnvelopeId: "auth_verification_fixture",
          allowedEffects: ["verification.evaluate", "repair.propose"],
          deniedEffects: ["repo.write", "repo.delete", "network"],
          resourceLimits: { episodes: 1 },
          requiredEvidence: ["pinned-subject", "baseline-witness"],
          expiresAt: now() + 60 * 60_000,
          revocationEventTypes: ["VerificationRevoked"],
        },
      });
      driver.feed({
        schemaVersion: 1,
        type: "ImplementationReported",
        occurredAt: now(),
        actorId: "implementer",
        episodeId: "ep_implementer_1",
        workstreamId: VERIFICATION_WORKSTREAM,
        payload: {
          summary:
            options.implementerNarrative ??
            "Implementation self-report: selection is ready.",
        },
      });
    }
    const worktrees = new WorkerWorktrees(
      repository,
      join(store.directory, "worktrees"),
    );
    // An admitted result already ended the attempt even if the process stopped
    // before its status event. Recover that projection without invoking a worker.
    const restoredEvents = decodeLog(driver.log);
    for (const event of restoredEvents) {
      if (event.type !== "CommandResult") continue;
      const result = event.payload as unknown as {
        verificationResultVersion?: number;
        commandId: string;
        workerEpisodeId: string;
        value: { envelope: ResultEnvelope };
      };
      if (
        result.verificationResultVersion !== 1 ||
        restoredEvents.some(
          (entry) =>
            entry.type === "WorkerCompleted" &&
            (entry.payload as { resultEventId?: string }).resultEventId ===
              event.eventId,
        )
      )
        continue;
      driver.record(
        "WorkerCompleted",
        now(),
        {
          commandId: result.commandId,
          workerEpisodeId: result.workerEpisodeId,
          envelope: result.value.envelope,
          resultEventId: event.eventId,
        },
        result.commandId,
      );
    }
    // Finish cleanup if the host stopped after a durable result but before removal.
    for (const event of decodeLog(driver.log)) {
      if (event.type !== "CommandPersisted") continue;
      const command = (event.payload as unknown as { command: Command })
        .command;
      const capsule = (
        command?.intent?.payload as unknown as {
          capsule?: VerificationTask;
        } | null
      )?.capsule;
      if (
        !capsule ||
        command.commandId === driver.state.pending?.command.commandId
      )
        continue;
      const path = join(worktrees.directory, command.commandId);
      if (existsSync(path))
        worktrees.cleanup({
          path,
          repository: worktrees.repository,
          baseCommit: capsule.subject.revision,
        });
    }
    const host = new VerificationHost({
      driver,
      transport: options.transport,
      now,
      ...(options.afterResultSaved
        ? { afterResultSaved: options.afterResultSaved }
        : {}),
      ...(options.onRunning ? { onRunning: options.onRunning } : {}),
    });
    driver.drainContinuation(now());
    let envelope: ResultEnvelope | undefined;
    while (!["complete", "attention"].includes(driver.state.next)) {
      if (driver.state.next === "apply-repair") {
        const subject = applyFixtureRepair(repository, driver.state);
        options.afterRepairApplied?.();
        driver.record("VerificationSubjectSubmitted", now(), {
          subject,
          producingEpisodeId: driver.state.proposal!.envelope.episodeId,
        });
        continue;
      }
      driver.persistNext(now());
      const pending = driver.state.pending!;
      const worktree = worktrees.create(
        pending.command.commandId,
        pending.capsule.subject.revision,
      );
      const mounted = witnessVerificationFixture(
        worktree.path,
        pending.capsule.subject.baseCommit,
      );
      if (!same(mounted, pending.capsule.subject))
        throw new WorkerFailure("profile-refused");
      envelope = await host.run(worktree.path, options.model, options.effort);
      if (envelope.status !== "completed") break;
      worktrees.cleanup(worktree);
      driver.record(
        "WorkerWorktreeRemoved",
        now(),
        {
          commandId: pending.command.commandId,
          baseCommit: worktree.baseCommit,
          clean: true,
        },
        pending.command.commandId,
      );
    }
    if (!envelope) {
      const completed = [...decodeLog(driver.log)]
        .reverse()
        .find((event) => event.type === "WorkerCompleted");
      envelope = (
        completed?.payload as unknown as
          { envelope: ResultEnvelope } | undefined
      )?.envelope;
    }
    if (!envelope) throw new WorkerFailure("profile-refused");
    return {
      envelope,
      matrix: projectAcceptanceEvidenceMatrices(decodeLog(driver.log))[0]!,
      log: driver.log,
      decisions: driver.decisions,
    };
  } finally {
    store.release();
  }
}
