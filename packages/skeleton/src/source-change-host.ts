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
  WorkOrderTransport,
  TransportDispatch,
} from "./worker-transport.js";
import {
  SOURCE_CHANGE_HOST,
  decodeFocusedTest,
  decodeSourceRequest,
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
    for (const event of this.events()) {
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
        };
        if (
          decodeFocusedTest(value.testBefore).command !==
          this.options.testCommand
        )
          throw new Error("source-change baseline test command drift");
        if (value.requestKey !== workerRequestKey(this.request("preflight")))
          throw new Error("source-change attempt request drift");
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
      this.tree.prepare();
      const saved = this.options.store.loadSourceChangeReceipt(
        this.request("recovery"),
      );
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
      });
      let dispatch: TransportDispatch<WriterResult> | undefined;
      let timer: ReturnType<typeof setInterval> | undefined;
      let heartbeatError: unknown;
      let result: WriterResult;
      const revokeCommands = installSourceChangeCommands({
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
      try {
        dispatch = this.options.transport.dispatch(request, this.now);
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
        result = parseStoredWriterResult(await dispatch.completed, request);
        if (heartbeatError) throw heartbeatError;
        if (this.now() >= this.attempts().at(-1)!.leaseExpiresAt)
          throw new WorkerFailure("interrupted", "source-change lease expired");
      } catch (error) {
        dispatch?.kill();
        this.record("WorkerInterrupted", {
          workerEpisodeId: episodeId,
          commandId: this.command.commandId,
          reason:
            error instanceof WorkerFailure ? error.code : "transport-failed",
        });
        throw error;
      } finally {
        if (timer) clearInterval(timer);
        revokeCommands();
      }
      this.options.afterResult?.();
      this.record("WorkerResultObserved", {
        workerEpisodeId: episodeId,
        commandId: this.command.commandId,
        envelope: result.envelope,
      });
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
