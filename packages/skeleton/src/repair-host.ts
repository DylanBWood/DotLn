import { join, dirname, basename } from "node:path";
import { mkdirSync, existsSync } from "node:fs";
import {
  appendEvent,
  decodeLog,
  replay,
  type Event,
  type EventDraft,
  type JsonValue,
  type Command,
  type Decision,
} from "@dotln/kernel";
import {
  compileVerificationTask,
  type VerificationSubject,
} from "@dotln/compiler";
import {
  initialState,
  projectRuntimeEnvironment,
  seiriReactor,
  sourceChangeAuthorization,
  type RuntimeState,
} from "./reactor.js";
import {
  REPAIR_HOST,
  noRepairGrants,
  repairEqual,
  repairHash,
  repairCommand,
  repairVerificationProgram,
  type RepairOriginal,
  type RepairGrants,
  type RepairState,
} from "./repair.js";
import {
  SourceChangeHost,
  type SourceChangeHostOptions,
} from "./source-change-host.js";
import { WorkerStore } from "./worker-store.js";
import { runFocusedTest } from "./source-change-worktree.js";
import {
  VerificationDriver,
  VerificationHost,
  preflightVerificationRecovery,
} from "./verification-host.js";
import {
  prepareWorktreeVerification,
  assertWorktreeSnapshot,
} from "./verification-worktree.js";
import type { WorkOrderTransport } from "./worker-transport.js";
import type { EvidenceWorkerRequest } from "./verification-protocol.js";

export interface RepairHostOptions {
  readonly store: WorkerStore;
  readonly original: RepairOriginal;
  readonly grants?: RepairGrants;
  readonly baseline: VerificationSubject;
  readonly subject: VerificationSubject;
  readonly snapshotPath: string;
  /** Retained child stores and verification copies, outside target worktrees. */
  readonly directory: string;
  readonly source: Pick<
    SourceChangeHostOptions,
    | "authorityEvidence"
    | "artifactIdentity"
    | "worktreeParent"
    | "launchpadCheckout"
    | "model"
    | "effort"
    | "transport"
  >;
  readonly verifier: {
    readonly transport: WorkOrderTransport<EvidenceWorkerRequest>;
    readonly model: string;
    readonly effort: string;
  };
  readonly now?: () => number;
  readonly onEvent?: (event: Event) => void;
  /** Fault injection after durable child receipt, before parent observation. */
  readonly afterRepairCommit?: () => void;
  readonly afterSnapshotPrepared?: () => void;
}

/** Host effects are selected by the persisted executable program, not a retry loop. */
export class RepairHost {
  private runtime: RuntimeState = initialState();
  private log = "";
  private lastDecision?: Decision<RuntimeState>;
  readonly now: () => number;
  readonly workstreamId: string;
  constructor(readonly options: RepairHostOptions) {
    this.now = options.now ?? Date.now;
    this.workstreamId = `repair_${repairHash(options.original.workOrder.workOrderId).slice(8)}`;
  }
  get state(): RepairState {
    return this.runtime.repair as unknown as RepairState;
  }
  private opening(): Record<string, unknown> {
    const shell = {
      workstreamId: this.workstreamId,
      round: 0,
      finding: null,
    } as RepairState;
    return {
      original: this.options.original,
      grants: this.options.grants ?? noRepairGrants,
      baseline: this.options.baseline,
      subject: this.options.subject,
      continuation: repairVerificationProgram(shell),
      host: {
        directory: this.options.directory,
        snapshotPath: this.options.snapshotPath,
        source: {
          ...this.options.source,
          transport: {
            name: this.options.source.transport.name,
            harnessVersion: this.options.source.transport.harnessVersion,
          },
        },
        verifier: {
          ...this.options.verifier,
          transport: {
            name: this.options.verifier.transport.name,
            harnessVersion: this.options.verifier.transport.harnessVersion,
          },
        },
      },
    };
  }
  private restore = (): void => {
    this.log = this.options.store.read();
    const events = decodeLog(this.log);
    const opening = events.find((e) => e.type === "RepairOpened");
    if (opening && !repairEqual(opening.payload, this.opening()))
      throw new Error("repair recovery request drift");
    if (
      events.some(
        (e) =>
          e.actorId !== REPAIR_HOST || e.workstreamId !== this.workstreamId,
      )
    )
      throw new Error("repair store contains foreign events");
    this.runtime = replay(
      initialState(),
      events,
      seiriReactor,
      {},
      projectRuntimeEnvironment,
    ).state;
  };
  private feed(type: string, payload: unknown, correlationId?: string): Event {
    const draft: EventDraft = {
      schemaVersion: 1,
      type,
      occurredAt: this.now(),
      actorId: REPAIR_HOST,
      workstreamId: this.workstreamId,
      ...(correlationId ? { correlationId } : {}),
      payload: payload as JsonValue,
    };
    const appended = appendEvent(this.log, draft);
    const decision = seiriReactor(this.runtime, appended.event, {
      now: draft.occurredAt,
      rngState: 0,
      predicates: {},
    });
    this.options.store.append(appended.event);
    this.log = appended.log;
    this.runtime = decision.state;
    this.lastDecision = decision;
    this.options.onEvent?.(appended.event);
    return appended.event;
  }
  sourceHost(): SourceChangeHost {
    const order = this.state.order;
    if (!order) throw new Error("repair has no derived order");
    return new SourceChangeHost({
      ...this.options.source,
      store: new WorkerStore(
        join(this.options.directory, `source-${order.round}`),
      ),
      workOrder: order.workOrder,
      authorityEnvelope: order.authorityEnvelope,
      executionBaseCommit: order.executionBaseCommit,
      repairContext: {
        contract: order.contract,
        contractHash: order.contractHash,
        finding: order.finding,
        tests: order.tests,
        grantIds: order.grantIds,
        round: order.round,
      } as unknown as JsonValue,
      branch: `dotln-repair-${repairHash([this.workstreamId, order.round]).slice(8)}`,
      surfaces: order.surfaces,
      testCommand: order.tests[0]!.command,
      commitMessage: `Repair ${order.finding.findingId}\n`,
      now: this.now,
    });
  }
  private async verify(command: Command): Promise<void> {
    const state = this.state;
    const store = new WorkerStore(
      join(this.options.directory, `verification-${state.round}`),
    );
    const stream = `${this.workstreamId}_verify_${state.round}`;
    const saved = decodeLog(store.read()).find(
      (e) => e.type === "RepairSnapshotPrepared",
    );
    let prepared = saved?.payload as unknown as
      { subject: VerificationSubject; snapshotPath: string } | undefined;
    let path =
      state.round === 0
        ? this.options.snapshotPath
        : (prepared?.snapshotPath ?? "");
    if (
      prepared &&
      (dirname(dirname(path)) !== this.options.directory ||
        basename(path) !== "snapshot" ||
        !new RegExp(`^snapshot-${state.round}-[0-9]+$`, "u").test(
          basename(dirname(path)),
        ))
    )
      throw new Error("repair snapshot receipt path drift");
    if (prepared)
      assertWorktreeSnapshot(
        compileVerificationTask(
          "repair_preflight",
          state.original.criteria,
          prepared.subject,
        ),
        path,
      );
    store.acquire(() =>
      preflightVerificationRecovery(
        store,
        stream,
        () => path,
        this.options.verifier.model,
        this.options.verifier.effort,
      ),
    );
    try {
      const driver = new VerificationDriver(store, stream);
      if (driver.state.next === "unopened") {
        if (state.round > 0 && !prepared) {
          // An interrupted, unpublished preparation remains inspectable. A new
          // attempt never edits or adopts its incomplete files.
          let attempt = 0;
          let directory: string;
          do {
            directory = join(
              this.options.directory,
              `snapshot-${state.round}-${attempt++}`,
            );
          } while (existsSync(directory));
          prepared = prepareWorktreeVerification({
            worktree: this.sourceHost().tree.path,
            baseCommit: state.original.workOrder.baseCommit,
            observedCommit: state.currentCommit,
            repo: state.subject.repo,
            contract: this.options.subject.snapshot!.contract,
            criteria: state.original.criteria,
            tests: state.original.tests,
            directory,
          });
          path = prepared.snapshotPath;
          driver.record("RepairSnapshotPrepared", this.now(), {
            subject: prepared.subject,
            snapshotPath: path,
          });
          this.options.afterSnapshotPrepared?.();
        }
        const subject = state.round === 0 ? state.subject : prepared!.subject;
        const capsule = compileVerificationTask(
          "repair_preflight",
          state.original.criteria,
          subject,
        );
        assertWorktreeSnapshot(capsule, path);
        driver.record("VerificationOpened", this.now(), {
          baseline: state.baseline,
          subject,
          criteria: state.original.criteria,
          implementerEpisodeId: `repair_source_${state.round}`,
          episodeNamespace: stream,
          maxRepairs: 0,
          authority: {
            authorityEnvelopeId: "repair.verifier",
            allowedEffects: ["verification.evaluate"],
            deniedEffects: ["repo.write", "repair.propose"],
            resourceLimits: { episodes: 1 },
            requiredEvidence: [],
            expiresAt: state.original.authorityEnvelope.expiresAt,
            revocationEventTypes:
              state.original.authorityEnvelope.revocationEventTypes,
          },
        });
      }
      if (!driver.state.lastResultEventId) {
        driver.persistNext(this.now());
        await new VerificationHost({
          driver,
          transport: this.options.verifier.transport,
          now: this.now,
        }).run(path, this.options.verifier.model, this.options.verifier.effort);
      }
      const events = decodeLog(driver.log);
      const result = events.find(
        (e) => e.eventId === driver.state.lastResultEventId,
      );
      if (!result)
        throw new Error("repair verification has no admitted result");
      const p = result.payload as Record<string, JsonValue>;
      const persisted = events.find((e) => e.type === "CommandPersisted")!;
      const verifierCommand = (
        persisted.payload as unknown as { command: Command }
      ).command;
      const capsule = (
        verifierCommand.intent.payload as Record<string, JsonValue>
      ).capsule;
      this.feed("RepairCommandResult", {
        commandId: command.commandId,
        result: "completed",
        capsule,
        verifierCommand,
        value: p.value,
      });
    } finally {
      store.release();
    }
  }
  async run(): Promise<RepairState> {
    this.options.store.acquire(this.restore);
    try {
      mkdirSync(this.options.directory, { recursive: true });
      if (!this.runtime.repair) this.feed("RepairOpened", this.opening());
      while (this.state.status === "running") {
        if (this.state.emission) {
          this.feed(this.state.emission.type, this.state.emission.payload);
        } else if (this.state.pending) {
          const command = this.state.pending;
          if (command.intent.effect === "repo.write")
            this.feed("RepairCommandResult", {
              commandId: command.commandId,
              result: "accepted",
            });
          else await this.verify(command);
        } else {
          this.feed("RepairTick", {});
          const intent = this.lastDecision!.intents[0];
          if (intent?.kind === "Act") {
            const kind = intent.effect === "repo.write" ? "write" : "verify";
            this.feed("RepairCommandPersisted", {
              command: repairCommand(this.state, kind),
            });
          } else if (!this.state.emission) {
            // A waiting source observation owns an already-persisted child command.
            const source = this.sourceHost();
            const outcome = await source.run();
            if (outcome.status === "refused")
              this.feed("NeedsHuman", {
                reason: "source change refused",
                offending: outcome.refusal.reason,
              });
            else {
              this.options.afterRepairCommit?.();
              const before = source.tree.effect();
              const tests = this.state.order!.tests.map((test) => {
                if (
                  !sourceChangeAuthorization(
                    { kind: "Act", effect: "shell.run", payload: {} },
                    this.state.order!.authorityEnvelope,
                    {
                      now: this.now(),
                      actorId: REPAIR_HOST,
                      workstreamId: this.workstreamId,
                      decisionIndex: this.state.round,
                      intentIndex: 0,
                      evidence: this.options.source.authorityEvidence,
                      revokedBy: decodeLog(source.options.store.read()),
                    },
                  ).authorized
                )
                  throw new Error("repair test authority expired or revoked");
                const result = runFocusedTest(source.tree.path, test.command);
                if (!repairEqual(before, source.tree.effect()))
                  throw new Error(
                    "repair reproduction changed committed source",
                  );
                return result;
              });
              this.feed(
                "SourceChangeObserved",
                { observation: outcome.observation, tests },
                repairCommand(this.state, "write").commandId,
              );
            }
          }
        }
      }
      return this.state;
    } finally {
      this.options.store.release();
    }
  }
}
