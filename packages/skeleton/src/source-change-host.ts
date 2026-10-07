import {
  commandId,
  decodeLog,
  type Command,
  type Event,
  type JsonValue,
} from "@dotln/kernel";
import type { ArtifactIdentityV1 } from "@dotln/compiler";
import type { AuthorityEnvelope, WorkOrder } from "@dotln/kernel";
import { LiveReactorDriver } from "./scenario.js";
import {
  sourceChangeAuthorization,
  selectSourceChangeSlice,
  skeletonStateFromRuntime,
} from "./reactor.js";
import { WorkerStore, workerRequestKey } from "./worker-store.js";
import { projectWorkerStatus } from "./worker-status.js";
import {
  HEARTBEAT_MS,
  LEASE_MS,
  WorkerFailure,
  parseStoredWriterResult,
  validateWriterRequest,
  type WriterRequest,
  type WriterResult,
} from "./worker-protocol.js";
import type {
  CodexEpisodeIsolation,
  WorkOrderTransport,
  TransportDispatch,
} from "./worker-transport.js";
import {
  SOURCE_CHANGE_HOST,
  decodeFocusedTest,
  decodeSourceRequest,
  decodeSharedRepositoryState,
  sameSourceValue,
  type FocusedTestResult,
  type SourceChangeObserved,
  type SourceChangeRefused,
} from "./source-change-state.js";
import {
  SourceChangeWorktree,
  runFocusedTest,
  sourceDigest,
  sourceGit,
} from "./source-change-worktree.js";
import { installSourceChangeCommands } from "./source-change-command.js";
import { isArtifactIdentityV1 } from "./artifact-identity.js";

export interface SourceChangeHostOptions {
  readonly store: WorkerStore;
  readonly workOrder: WorkOrder;
  /** Repair execution parent; the original contract base stays in workOrder. */
  readonly executionBaseCommit?: string;
  readonly repairContext?: JsonValue;
  readonly authorityEnvelope: AuthorityEnvelope;
  /** Evidence already established by the compilation/dispatch host. */
  readonly authorityEvidence: readonly string[];
  readonly artifactIdentity: ArtifactIdentityV1;
  readonly branch: string;
  readonly surfaces: readonly string[];
  /** A Sort move: the one removal a portfolio order may make without
   * `repo.delete`, because the host checks the exact relocation. */
  readonly relocation?: { readonly from: string; readonly to: string };
  readonly worktreeParent: string;
  readonly launchpadCheckout: string;
  readonly testCommand: string;
  readonly commitMessage: string;
  readonly model: string;
  readonly effort: string;
  readonly transport: WorkOrderTransport<WriterRequest>;
  readonly now?: () => number;
  readonly onRunning?: (dispatch: TransportDispatch<WriterResult>) => void;
  readonly afterResult?: () => void;
  readonly afterReceiptSaved?: () => void;
  readonly onEvent?: (event: Event) => void;
}
export type SourceChangeOutcome =
  | { readonly status: "observed"; readonly observation: SourceChangeObserved }
  | { readonly status: "refused"; readonly refusal: SourceChangeRefused };
const json = (value: unknown): JsonValue => value as JsonValue;
// Never signal a saved process identity: PID/group reuse can only cause a
// conservative refusal, not a kill of an unrelated process.
const groupAbsent = (group: number): boolean => {
  try {
    process.kill(-group, 0);
    return false;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ESRCH") return true;
    throw new Error("source-change worker termination is unreadable");
  }
};
const integrityEvents = [
  "SourceChangeProcessStarted",
  "SourceChangeProcessStopped",
  "SourceChangeIntegrityChecked",
];

/** One compiled order, one branch and one host-owned commit receipt. No publication. */
export class SourceChangeHost {
  readonly now: () => number;
  readonly tree: SourceChangeWorktree;
  readonly command: Command;
  readonly workstreamId: string;
  private readonly logicalEpisode: string;
  private driver = new LiveReactorDriver();
  constructor(readonly options: SourceChangeHostOptions) {
    this.now = options.now ?? Date.now;
    if (!isArtifactIdentityV1(options.artifactIdentity))
      throw new Error("source-change compiled artifact identity is invalid");
    const identity = sourceDigest(options.workOrder.workOrderId).slice(0, 24);
    this.workstreamId = `source_${identity}`;
    this.logicalEpisode = `ep_${identity}`;
    this.command = {
      commandId: commandId(this.workstreamId, this.logicalEpisode, 1, 0),
      workstreamId: this.workstreamId,
      episodeId: this.logicalEpisode,
      intent: {
        kind: "Act",
        effect: "repo.write",
        resource: "writers",
        payload: json({
          workOrder: options.workOrder,
          ...(options.executionBaseCommit
            ? { executionBaseCommit: options.executionBaseCommit }
            : {}),
          ...(options.repairContext
            ? { repairContext: options.repairContext }
            : {}),
          authorityEnvelope: options.authorityEnvelope,
          authorityEvidence: options.authorityEvidence,
          artifactIdentity: options.artifactIdentity,
          branch: options.branch,
          surfaces: options.surfaces,
          testCommand: options.testCommand,
          commitMessage: options.commitMessage,
          worktreeParent: options.worktreeParent,
          launchpadCheckout: options.launchpadCheckout,
          model: options.model,
          effort: options.effort,
          transport: options.transport.name,
          harnessVersion: options.transport.harnessVersion,
        }),
      },
    };
    const requested = decodeSourceRequest({
      workOrderId: options.workOrder.workOrderId,
      repo: options.workOrder.repo,
      baseCommit: options.executionBaseCommit ?? options.workOrder.baseCommit,
      branch: options.branch,
      surfaces: options.surfaces,
    });
    if (options.executionBaseCommit)
      sourceGit(
        options.workOrder.repo,
        "merge-base",
        "--is-ancestor",
        options.workOrder.baseCommit,
        options.executionBaseCommit,
      );
    this.tree = new SourceChangeWorktree({
      requested,
      commandId: this.command.commandId,
      parent: options.worktreeParent,
      launchpad: options.launchpadCheckout,
      commitMessage: options.commitMessage,
      change: {
        ...(Number.isFinite(options.authorityEnvelope.resourceLimits["files"])
          ? { files: options.authorityEnvelope.resourceLimits["files"] }
          : {}),
        deletion:
          options.authorityEnvelope.allowedEffects.includes("repo.delete"),
        ...(options.relocation ? { relocation: options.relocation } : {}),
      },
      bundleProfile:
        options.transport.name === "claude-cli-print"
          ? "target-worker-claude"
          : "target-worker-codex",
    });
    validateWriterRequest(this.request("preflight"));
  }
  private request(episodeId: string): WriterRequest {
    const o = this.options;
    return {
      kind: "source-change",
      command: this.command,
      workOrder: o.workOrder,
      authorityEnvelope: o.authorityEnvelope,
      artifactIdentity: o.artifactIdentity,
      episodeId,
      model: o.model,
      effort: o.effort,
      cwd: this.tree.path,
      profile: {
        profileId: "source-change-v1",
        mounts: [{ path: this.tree.path, access: "read-write" }],
        writableSurfaces: [this.tree.path],
        worktreeParent: o.worktreeParent,
        launchpadCheckout: o.launchpadCheckout,
      },
      testCommand: o.testCommand,
      commitMessagePath: this.tree.messagePath,
    };
  }
  private get state() {
    return selectSourceChangeSlice(skeletonStateFromRuntime(this.driver.state));
  }
  private events(): readonly Event[] {
    return decodeLog(this.driver.log);
  }
  private record(type: string, payload: unknown): Event {
    const step = this.driver.feed({
      schemaVersion: 1,
      type,
      occurredAt: this.now(),
      actorId: SOURCE_CHANGE_HOST,
      workstreamId: this.workstreamId,
      episodeId: this.logicalEpisode,
      correlationId: this.command.commandId,
      payload: json(payload),
    });
    this.options.onEvent?.(step.event);
    return step.event;
  }
  private preflight = (): void => {
    this.driver = new LiveReactorDriver();
    this.driver.restore(this.options.store.read());
    if (
      this.state.request &&
      !sameSourceValue(this.state.request, this.tree.options.requested)
    )
      throw new Error("source-change recovery request drift");
    const events = this.events();
    for (const event of events) {
      if (event.type === "ArtifactIdentityEnforcementStarted") continue;
      if (
        event.actorId !== SOURCE_CHANGE_HOST ||
        event.workstreamId !== this.workstreamId
      )
        throw new Error(
          "source-change store belongs to another host or workstream",
        );
      if (
        event.type === "CommandPersisted" &&
        !sameSourceValue(event.payload, { command: this.command })
      )
        throw new Error("source-change persisted request drift");
      if (event.type === "WorkerAttemptStarted") {
        const value = event.payload as unknown as {
          testBefore: unknown;
          requestKey: unknown;
          sharedState?: unknown;
        };
        if (
          decodeFocusedTest(value.testBefore).command !==
          this.options.testCommand
        )
          throw new Error("source-change baseline test command drift");
        if (value.requestKey !== workerRequestKey(this.request("preflight")))
          throw new Error("source-change attempt request drift");
        if (value.sharedState !== undefined) {
          const shared = decodeSharedRepositoryState(value.sharedState);
          if (
            shared.refs.some(
              ([ref]) => ref === `refs/heads/${this.options.branch}`,
            )
          )
            throw new Error(
              "source-change shared baseline includes its own branch",
            );
        }
      }
      if (integrityEvents.includes(event.type)) {
        const p = event.payload as Record<string, JsonValue>;
        const fields = [
          "workerEpisodeId",
          "commandId",
          ...(event.type === "SourceChangeProcessStarted"
            ? ["processGroup"]
            : event.type === "SourceChangeProcessStopped"
              ? ["evidence"]
              : ["outcome", "after"]),
        ];
        const attempt = events.find(
          (entry) =>
            entry.type === "WorkerAttemptStarted" &&
            (entry.payload as Record<string, JsonValue>).workerEpisodeId ===
              p.workerEpisodeId,
        );
        if (
          !attempt ||
          events.indexOf(attempt) >= events.indexOf(event) ||
          p.commandId !== this.command.commandId ||
          Object.keys(p).sort().join(",") !== fields.sort().join(",")
        )
          throw new Error(
            "source-change integrity record has an invalid attempt or shape",
          );
        const preceding = events
          .slice(0, events.indexOf(event))
          .filter(
            (entry) =>
              (entry.payload as Record<string, JsonValue>).workerEpisodeId ===
              p.workerEpisodeId,
          );
        const started = preceding.find(
          (entry) => entry.type === "SourceChangeProcessStarted",
        );
        const stopped = preceding.find(
          (entry) => entry.type === "SourceChangeProcessStopped",
        );
        if (
          (event.type === "SourceChangeProcessStarted" &&
            (started || stopped)) ||
          (event.type === "SourceChangeProcessStopped" && stopped) ||
          (event.type === "SourceChangeIntegrityChecked" && !stopped)
        )
          throw new Error("source-change integrity record order is invalid");
        if (
          event.type === "SourceChangeProcessStarted" &&
          p.processGroup !== null &&
          (!Number.isSafeInteger(p.processGroup) || Number(p.processGroup) <= 1)
        )
          throw new Error("source-change process group is invalid");
        if (
          event.type === "SourceChangeProcessStopped" &&
          ![
            "transport-settled",
            "group-absent",
            "dispatch-not-started",
          ].includes(String(p.evidence))
        )
          throw new Error("source-change termination evidence is invalid");
        if (
          event.type === "SourceChangeProcessStopped" &&
          ((p.evidence === "dispatch-not-started" && started) ||
            (p.evidence !== "dispatch-not-started" && !started) ||
            (p.evidence === "group-absent" &&
              typeof (started!.payload as Record<string, JsonValue>)
                .processGroup !== "number"))
        )
          throw new Error(
            "source-change termination evidence has no matching launch",
          );
        if (event.type === "SourceChangeIntegrityChecked") {
          if (
            !["unchanged", "changed", "unreadable"].includes(String(p.outcome))
          )
            throw new Error("source-change integrity outcome is invalid");
          if (p.outcome === "unreadable") {
            if (p.after !== null)
              throw new Error("source-change unreadable state has bytes");
          } else {
            const before = decodeSharedRepositoryState(
              (attempt.payload as Record<string, JsonValue>).sharedState,
            );
            const after = decodeSharedRepositoryState(p.after);
            if ((p.outcome === "unchanged") !== sameSourceValue(before, after))
              throw new Error(
                "source-change integrity verdict differs from its states",
              );
          }
        }
      }
    }
    const receipt = this.options.store.loadSourceChangeReceipt(
      this.request("preflight"),
    );
    if (
      receipt &&
      (receipt.branch !== this.options.branch ||
        receipt.commit === this.tree.options.requested.baseCommit ||
        !this.state.request)
    )
      throw new Error("source-change receipt differs from its request");
    if (
      this.state.observation &&
      !sameSourceValue(receipt, this.state.observation)
    )
      throw new Error("source-change observation lacks its immutable receipt");
  };
  private acquire(): void {
    this.options.store.acquire(this.preflight);
    this.driver = new LiveReactorDriver(undefined, this.options.store.append);
    this.driver.restore(this.options.store.read());
  }
  private checkAuthority(): void {
    for (const effect of ["git.local", "shell.run"]) {
      if (
        !this.options.workOrder.allowedOperations.includes(effect) ||
        !sourceChangeAuthorization(
          { ...this.command.intent, effect },
          this.options.authorityEnvelope,
          {
            now: this.now(),
            actorId: SOURCE_CHANGE_HOST,
            workstreamId: this.workstreamId,
            episodeId: this.logicalEpisode,
            decisionIndex: 1,
            intentIndex: 0,
            evidence: this.options.authorityEvidence,
            revokedBy: this.events(),
          },
        ).authorized
      )
        throw new WorkerFailure(
          "profile-refused",
          "source-change local command authority",
        );
    }
    const grant = sourceChangeAuthorization(
      this.command.intent,
      this.options.authorityEnvelope,
      {
        now: this.now(),
        actorId: SOURCE_CHANGE_HOST,
        workstreamId: this.workstreamId,
        episodeId: this.logicalEpisode,
        decisionIndex: 1,
        intentIndex: 0,
        evidence: this.options.authorityEvidence,
        revokedBy: this.events(),
      },
    );
    if (
      !grant.authorized ||
      !sameSourceValue(grant.command, this.command) ||
      this.options.authorityEnvelope.resourceLimits.writers !== 1
    )
      throw new WorkerFailure("profile-refused", "source-change authority");
  }
  private attempts() {
    return projectWorkerStatus(this.events()).episodes.filter(
      (episode) => episode.commandId === this.command.commandId,
    );
  }
  private fence(): void {
    for (const attempt of this.attempts()) {
      if (!["starting", "running", "interrupted"].includes(attempt.phase))
        continue;
      if (this.now() < attempt.leaseExpiresAt)
        throw new Error("source-change worker lease has not expired");
      this.record("WorkerLeaseExpired", {
        workerEpisodeId: attempt.episodeId,
        commandId: this.command.commandId,
        leaseExpiresAt: attempt.leaseExpiresAt,
      });
    }
  }
  private before(): FocusedTestResult | undefined {
    const values = this.events()
      .filter((event) => event.type === "WorkerAttemptStarted")
      .map((event) =>
        decodeFocusedTest(
          (event.payload as Record<string, JsonValue>).testBefore,
        ),
      );
    if (values.some((value) => !sameSourceValue(value, values[0])))
      throw new Error("source-change baseline observation drift");
    return values[0];
  }
  private attemptEvents(episodeId: string): readonly Event[] {
    return this.events().filter(
      (event) =>
        (event.payload as Record<string, JsonValue>).workerEpisodeId ===
        episodeId,
    );
  }
  private stopped(episodeId: string): boolean {
    return this.attemptEvents(episodeId).some(
      (event) => event.type === "SourceChangeProcessStopped",
    );
  }
  private recordStopped(
    episodeId: string,
    evidence: "dispatch-not-started" | "transport-settled" | "group-absent",
  ): void {
    if (!this.stopped(episodeId))
      this.record("SourceChangeProcessStopped", {
        workerEpisodeId: episodeId,
        commandId: this.command.commandId,
        evidence,
      });
  }
  private async settle(
    episodeId: string,
    dispatch: TransportDispatch<WriterResult> | undefined,
  ): Promise<void> {
    if (this.stopped(episodeId)) return;
    if (!dispatch) {
      this.recordStopped(episodeId, "dispatch-not-started");
      return;
    }
    // A rejected result may be a decoder failure, but a kill alone never
    // establishes that the writer has stopped changing the repository.
    await dispatch.completed.catch(() => undefined);
    if (dispatch.processGroup) {
      const deadline = Date.now() + 1_000;
      while (!groupAbsent(dispatch.processGroup)) {
        if (Date.now() >= deadline)
          throw new Error("source-change worker group has not terminated");
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }
    if (dispatch.alive())
      throw new Error("source-change worker has not terminated");
    this.recordStopped(episodeId, "transport-settled");
  }
  private recoverTermination(episodeId: string): void {
    if (this.stopped(episodeId)) return;
    const started = this.attemptEvents(episodeId).find(
      (event) => event.type === "SourceChangeProcessStarted",
    );
    const group = (started?.payload as Record<string, JsonValue> | undefined)
      ?.processGroup;
    if (typeof group !== "number")
      throw new Error(
        "source-change recovery lacks worker termination evidence",
      );
    if (!groupAbsent(group))
      throw new Error("source-change prior worker group is still present");
    this.recordStopped(episodeId, "group-absent");
  }
  private checkIntegrity(): string | null {
    const attempt = this.events()
      .filter((event) => event.type === "WorkerAttemptStarted")
      .at(-1);
    if (!attempt) return null;
    const p = attempt.payload as Record<string, JsonValue>;
    const episodeId = String(p.workerEpisodeId);
    if (!this.stopped(episodeId))
      throw new Error("source-change integrity requires a stopped worker");
    if (p.sharedState === undefined)
      throw new Error(
        "source-change recovery lacks a durable shared-state baseline",
      );
    const before = decodeSharedRepositoryState(p.sharedState);
    // Once an attempt failed, later restoration cannot erase the finding.
    const failed = this.attemptEvents(episodeId).find(
      (event) =>
        event.type === "SourceChangeIntegrityChecked" &&
        (event.payload as Record<string, JsonValue>).outcome !== "unchanged",
    );
    if (failed)
      return (failed.payload as Record<string, JsonValue>).outcome === "changed"
        ? "shared-repository-changed"
        : "shared-repository-unreadable";
    let after = null,
      outcome: "unchanged" | "changed" | "unreadable";
    try {
      after = this.tree.sharedState();
      outcome = sameSourceValue(before, after) ? "unchanged" : "changed";
    } catch {
      outcome = "unreadable";
    }
    this.record("SourceChangeIntegrityChecked", {
      workerEpisodeId: episodeId,
      commandId: this.command.commandId,
      outcome,
      after,
    });
    return outcome === "unchanged" ? null : `shared-repository-${outcome}`;
  }
  private closeCommand(outcome: SourceChangeOutcome): SourceChangeOutcome {
    if (!this.events().some((event) => event.type === "CommandResult")) {
      this.checkAuthority();
      this.record("CommandResult", {
        commandId: this.command.commandId,
        result: outcome.status,
        ...outcome,
      });
    }
    const last = this.attempts().at(-1);
    if (last && last.phase !== "completed")
      this.record("WorkerCompleted", {
        workerEpisodeId: last.episodeId,
        commandId: this.command.commandId,
      });
    return outcome;
  }
  private refuse(reason: string): SourceChangeOutcome {
    const refusal = { workOrderId: this.options.workOrder.workOrderId, reason };
    this.record("SourceChangeRefused", refusal);
    return this.closeCommand({ status: "refused", refusal });
  }
  private observe(testBefore: FocusedTestResult): SourceChangeOutcome {
    this.checkAuthority();
    const effect = this.tree.effect(true);
    if (!effect) throw new Error("source-change effect disappeared");
    const testAfter = runFocusedTest(this.tree.path, this.options.testCommand);
    const after = this.tree.effect(true);
    if (!sameSourceValue(effect, after))
      throw new Error("source-change test changed the commit or diff");
    this.checkAuthority();
    const integrity = this.checkIntegrity();
    if (integrity) return this.refuse(integrity);
    const observation: SourceChangeObserved = {
      workOrderId: this.options.workOrder.workOrderId,
      ...effect,
      branch: this.options.branch,
      testBefore,
      testAfter,
    };
    this.options.store.saveSourceChangeReceipt(
      this.request("receipt"),
      observation,
    );
    this.options.afterReceiptSaved?.();
    this.record("SourceChangeObserved", observation);
    return this.closeCommand({ status: "observed", observation });
  }
  async run(): Promise<SourceChangeOutcome> {
    this.acquire();
    try {
      // Replaying an immutable accepted result does not re-adjudicate a
      // historical episode. A saved receipt has already admitted its effect;
      // an unchecked effect still needs its baseline and termination evidence.
      if (this.state.observation)
        return this.closeCommand({
          status: "observed",
          observation: this.state.observation,
        });
      if (this.state.refusal)
        return this.closeCommand({
          status: "refused",
          refusal: this.state.refusal,
        });
      this.checkAuthority();
      if (!this.state.request) {
        this.tree.assertUnused();
        this.record("SourceChangeRequested", this.tree.options.requested);
      }
      if (!this.events().some((event) => event.type === "CommandPersisted"))
        this.record("CommandPersisted", { command: this.command });
      this.fence();
      const saved = this.options.store.loadSourceChangeReceipt(
        this.request("recovery"),
      );
      const prior = this.attempts().at(-1);
      // Receipt persistence follows admission and the final host test. Older
      // admitted logs have no process markers; only an unreceipted attempt
      // needs termination and a new shared-state comparison. Every receipt
      // still needs the exact candidate binding below before replay.
      if (prior && !saved) {
        this.recoverTermination(prior.episodeId);
        const integrity = this.checkIntegrity();
        if (integrity === "shared-repository-unreadable")
          return this.refuse(integrity);
        this.tree.verify();
        if (integrity) return this.refuse(integrity);
      }
      this.tree.prepare();
      if (saved) {
        const effect = this.tree.effect();
        if (
          !effect ||
          effect.commit !== saved.commit ||
          effect.diffHash !== saved.diffHash
        )
          throw new Error("source-change saved effect no longer matches Git");
        this.record("SourceChangeObserved", saved);
        return this.closeCommand({ status: "observed", observation: saved });
      }
      const before = this.before();
      if (this.tree.effect()) {
        if (!before)
          throw new Error("source-change commit lacks its pre-dispatch test");
        return this.observe(before);
      }
      if (this.attempts().length >= 2)
        return this.refuse("recovery-dispatch-exhausted");
      if (!before) this.tree.clean();
      const testBefore =
        before ?? runFocusedTest(this.tree.path, this.options.testCommand);
      if (!before) {
        this.tree.clean();
        if (this.tree.verify() !== this.tree.options.requested.baseCommit)
          throw new Error("source-change baseline test moved HEAD");
      }
      this.checkAuthority();
      const episodeId = `${this.logicalEpisode}_${this.attempts().length + 1}`;
      const request = this.request(episodeId);
      this.record("WorkerAttemptStarted", {
        workerEpisodeId: episodeId,
        commandId: this.command.commandId,
        workOrderId: request.workOrder.workOrderId,
        model: request.model,
        effort: request.effort,
        transport: this.options.transport.name,
        harnessVersion: this.options.transport.harnessVersion,
        mode: "fresh-cli",
        leaseExpiresAt: this.now() + LEASE_MS,
        heartbeatMs: HEARTBEAT_MS,
        leaseMs: LEASE_MS,
        requestKey: workerRequestKey(request),
        testBefore,
        sharedState: this.tree.sharedState(),
      });
      let dispatch: TransportDispatch<WriterResult> | undefined;
      let timer: ReturnType<typeof setInterval> | undefined;
      let heartbeatError: unknown;
      let result: WriterResult;
      // WO-159: a Codex episode ends with its isolation record.
      let codexIsolation: CodexEpisodeIsolation | undefined;
      let revokeCommands = () => {};
      try {
        const removeCommands = installSourceChangeCommands({
          launchpad: this.options.launchpadCheckout,
          target: this.tree.path,
          commandId: this.command.commandId,
          requestKey: workerRequestKey(request),
          episodeId,
          branch: this.options.branch,
          baseCommit: this.tree.options.requested.baseCommit,
          testCommand: this.options.testCommand,
          messagePath: this.tree.messagePath,
          expiresAt:
            Date.now() +
            Math.min(
              180_000,
              this.options.authorityEnvelope.expiresAt - this.now(),
            ),
        });
        let commandsLive = true;
        revokeCommands = () => {
          if (!commandsLive) return;
          removeCommands();
          commandsLive = false;
        };
        dispatch = this.options.transport.dispatch(request, this.now);
        this.record("SourceChangeProcessStarted", {
          workerEpisodeId: episodeId,
          commandId: this.command.commandId,
          processGroup: dispatch.processGroup ?? null,
        });
        const receipt = await dispatch.receipt;
        if (
          receipt.commandId !== this.command.commandId ||
          receipt.transport !== this.options.transport.name
        )
          throw new WorkerFailure(
            "invalid-result",
            "source-change transport receipt",
          );
        this.record("CommandReceipt", {
          ...receipt,
          workerEpisodeId: episodeId,
        });
        timer = setInterval(() => {
          try {
            const attempt = this.attempts().at(-1)!;
            if (this.now() >= attempt.leaseExpiresAt) {
              this.fence();
              dispatch!.kill();
              heartbeatError = new WorkerFailure(
                "interrupted",
                "source-change lease expired",
              );
            } else if (dispatch!.alive()) {
              this.record("WorkerHeartbeat", {
                workerEpisodeId: episodeId,
                commandId: this.command.commandId,
                leaseExpiresAt: this.now() + LEASE_MS,
                evidence: "host-observed-child-process",
              });
            }
          } catch (error) {
            heartbeatError = error;
            dispatch!.kill();
          }
        }, HEARTBEAT_MS);
        this.options.onRunning?.(dispatch);
        const completed = await dispatch.completed;
        codexIsolation = await dispatch.isolation;
        result = parseStoredWriterResult(completed, request);
        if (heartbeatError) throw heartbeatError;
        if (this.now() >= this.attempts().at(-1)!.leaseExpiresAt)
          throw new WorkerFailure("interrupted", "source-change lease expired");
        await this.settle(episodeId, dispatch);
        revokeCommands();
        this.options.afterResult?.();
        this.record("WorkerResultObserved", {
          workerEpisodeId: episodeId,
          commandId: this.command.commandId,
          envelope: result.envelope,
          ...(codexIsolation ? { codexIsolation } : {}),
        });
        const integrity = this.checkIntegrity();
        if (integrity === "shared-repository-unreadable")
          return this.refuse(integrity);
        this.tree.verify();
        if (integrity) return this.refuse(integrity);
        const effect = this.tree.effect();
        if (!effect) return this.refuse("worker-returned-no-commit");
        if (
          !result.envelope.observedCommit ||
          result.envelope.observedCommit.sha !== effect.commit ||
          result.envelope.observedCommit.branch !== this.options.branch
        )
          throw new WorkerFailure(
            "invalid-result",
            "source-change observed commit mismatch",
          );
        return this.observe(testBefore);
      } catch (error) {
        dispatch?.kill();
        await this.settle(episodeId, dispatch);
        revokeCommands();
        codexIsolation ??= await dispatch?.isolation?.catch(() => undefined);
        this.checkIntegrity();
        this.record("WorkerInterrupted", {
          workerEpisodeId: episodeId,
          commandId: this.command.commandId,
          reason:
            error instanceof WorkerFailure ? error.code : "transport-failed",
          ...(codexIsolation ? { codexIsolation } : {}),
        });
        throw error;
      } finally {
        if (timer) clearInterval(timer);
        revokeCommands();
      }
    } finally {
      this.options.store.release();
    }
  }
  finish(): void {
    this.acquire();
    try {
      const receipt = this.options.store.loadSourceChangeReceipt(
        this.request("finish"),
      );
      if (!receipt || !this.state.observation)
        throw new Error(
          "source-change finish requires a persisted receipt and observation",
        );
      this.fence();
      this.tree.finish(receipt.commit, receipt.diffHash);
    } finally {
      this.options.store.release();
    }
  }
}
