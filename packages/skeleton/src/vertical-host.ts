import { existsSync, mkdirSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { appendEvent, decodeLog, type JsonValue } from "@dotln/kernel";
import type { WorkOrder } from "@dotln/compiler";
import { WorkerStore } from "./worker-store.js";
import { RetryableTriageError } from "./vertical-judgment-host.js";
import {
  deliverPendingSignal,
  throwIfInterrupted,
} from "./host-interruption.js";
export { interruption, throwIfInterrupted } from "./host-interruption.js";
import {
  baselineClass,
  foldVertical,
  nextVerticalCommand,
  verticalEqual,
  verticalProgram,
  type IntentBinding,
  type VerticalCommand,
  type VerticalReceipt,
  type VerticalState,
} from "./vertical.js";

export interface VerticalPorts {
  materialize(
    binding: IntentBinding,
  ): Promise<{ workOrder: WorkOrder; workOrderPath: string }>;
  /** Real bindings call the existing primitive host; tests replace external actors. */
  execute(
    command: VerticalCommand,
    state: VerticalState,
    active?: (launch: boolean) => Promise<boolean>,
  ): Promise<Omit<VerticalReceipt, "command">>;
}
export interface VerticalHostOptions {
  directory: string;
  binding: IntentBinding;
  ports: VerticalPorts;
  now?: () => number;
  /** A fixture kill boundary, after the step's durable receipt. */
  afterStep?: (receipt: VerticalReceipt) => void;
  /** Recheck resident presence/revocation at every effect boundary. */
  permitted?: () => Promise<boolean>;
  startStep?: (command: VerticalCommand) => Promise<boolean>;
  active?: (launch: boolean) => Promise<boolean>;
  settled?: (receipt: VerticalReceipt, terminal: boolean) => Promise<void>;
  /** Operator interruption preserves the current command for a later run. */
  signal?: AbortSignal;
}
export class VerticalHost {
  readonly store: WorkerStore;
  state: VerticalState | undefined;
  private log = "";
  private readonly now: () => number;
  constructor(readonly options: VerticalHostOptions) {
    this.store = new WorkerStore(options.directory);
    this.now = options.now ?? Date.now;
  }
  private restore = () => {
    this.log = this.store.read();
    this.state = undefined;
    for (const event of decodeLog(this.log)) {
      if (event.workstreamId !== `vertical_${this.options.binding.key}`)
        throw new Error("vertical store identity drift");
      this.state = foldVertical(this.state, event);
    }
    if (this.state && !verticalEqual(this.state.binding, this.options.binding))
      throw new Error("vertical admission drift on restart");
  };
  private append(type: string, payload: unknown) {
    const appended = appendEvent(this.log, {
      schemaVersion: 1,
      type,
      occurredAt: this.now(),
      actorId: "vertical-host",
      workstreamId: `vertical_${this.options.binding.key}`,
      payload: payload as JsonValue,
    });
    const next = foldVertical(this.state, appended.event);
    this.store.append(appended.event);
    this.log = appended.log;
    this.state = next;
  }
  private projectReceipt(receipt: VerticalReceipt) {
    const directory = join(this.options.directory, "receipts");
    const file = join(directory, `${receipt.command.commandId}.json`);
    if (existsSync(file)) return;
    mkdirSync(directory, { recursive: true });
    const temporary = `${file}.tmp`;
    writeFileSync(temporary, JSON.stringify(receipt, null, 2) + "\n");
    renameSync(temporary, file);
  }
  async run({
    steps = Infinity,
  }: { steps?: number } = {}): Promise<VerticalState> {
    this.store.acquire(this.restore);
    try {
      this.restore();
      // A death after the durable event but before projection cannot lose a
      // readable step receipt. Progress remains owned by the event log.
      for (const receipt of this.state?.receipts ?? [])
        this.projectReceipt(receipt);
      const restored = this.state?.receipts.at(-1);
      if (restored)
        await this.options.settled?.(restored, !!this.state!.terminal);
      if (!this.state) {
        const identity = await this.options.ports.materialize(
          this.options.binding,
        );
        this.append("VerticalOpened", {
          binding: this.options.binding,
          workOrder: identity.workOrder,
          workOrderPath: identity.workOrderPath,
          continuation: verticalProgram(this.options.binding.key),
        });
      }
      for (let count = 0; count < steps && !this.state!.terminal; count++) {
        // An interruption stops before the next step. A step that returned
        // despite it keeps its receipt below, so a rerun never repeats it.
        throwIfInterrupted(this.options.signal);
        const command =
          this.state!.pending ?? nextVerticalCommand(this.state!)!;
        if (!this.state!.pending)
          this.append("VerticalCommandPersisted", { command });
        let result: Omit<VerticalReceipt, "command">;
        const expired = this.now() >= this.state!.binding.authority.expiresAt;
        if (
          !expired &&
          this.options.permitted &&
          !(await this.options.permitted())
        )
          break;
        if (
          !expired &&
          this.options.startStep &&
          !(await this.options.startStep(command))
        )
          break;
        if (expired)
          result = {
            result: "NeedsHuman",
            value: { reason: "vertical authority or wall budget expired" },
          };
        else if (command.step === "bundle")
          result = {
            result: "completed",
            value: {
              bundleHash: this.state!.binding.contract.bundleHash,
              sourceRevision: this.state!.binding.contract.revisionId,
            },
          };
        else if (command.step === "contract")
          result = {
            result: "completed",
            value: this.state!.binding.contract as unknown as JsonValue,
          };
        else if (command.step === "surfaces")
          result = {
            result: "completed",
            value: this.state!.binding.derivation as unknown as JsonValue,
          };
        else if (command.step === "derived-order")
          result = {
            result: "completed",
            value: {
              workOrderId: this.state!.workOrder.workOrderId,
              draftId: this.state!.binding.draftId,
            },
          };
        else if (
          !["bundle", "contract", "surfaces", "derived-order"].includes(
            command.step,
          ) &&
          baselineClass(
            this.state!.binding.contract,
            undefined,
            this.state!.binding.baselineAssessment,
          ).kind === "unresolved"
        ) {
          const classification = baselineClass(
            this.state!.binding.contract,
            undefined,
            this.state!.binding.baselineAssessment,
          );
          result = {
            result: "NeedsHuman",
            value: {
              reason: classification.findings[0]!,
              classification: classification as unknown as JsonValue,
            },
          };
        } else if (
          command.step === "preparation" &&
          this.state!.binding.contract.openDecisions.length
        )
          result = {
            result: "NeedsHuman",
            value: {
              reason: "unresolved material ambiguity",
              decisions: this.state!.binding.contract.openDecisions.map(
                (d) => d.decisionId,
              ),
            },
          };
        else {
          // The permitted and start checks above awaited; a signal during
          // them must not start the step.
          throwIfInterrupted(this.options.signal);
          try {
            result = await this.options.ports.execute(
              command,
              this.state!,
              this.options.active,
            );
          } catch (error) {
            if (await deliverPendingSignal(this.options.signal)) throw error;
            if (
              command.step === "resolution" &&
              error instanceof RetryableTriageError
            )
              throw error;
            // External diagnostics can carry source text. Their primitive keeps
            // its own receipt; this boundary records only the named failure.
            result = {
              result: command.step === "review" ? "retry" : "refused",
              value: {
                reason: `${command.step} host failed or was unavailable`,
              },
            };
          }
          if (command.step === "baseline") {
            const value = result.value as Record<string, JsonValue>;
            const classification = baselineClass(
              this.state!.binding.contract,
              value?.["storyClass"] as "new" | "defect" | undefined,
              this.state!.binding.baselineAssessment,
            );
            result = {
              ...result,
              value: {
                ...value,
                classification: classification as unknown as JsonValue,
              },
            };
            if (
              result.result === "completed" &&
              (classification.findings.length ||
                (classification.kind === "defect" &&
                  value?.["outcome"] !== "reproduced"))
            )
              result = {
                result: "NeedsHuman",
                value: {
                  ...(result.value as object),
                  reason:
                    classification.findings[0] ??
                    "baseline did not reproduce the named failing behavior",
                },
              };
          }
        }
        // Primitive observations guard their synchronous children before
        // returning. Deliver a queued signal even on a successful return;
        // an already accepted clean effect keeps its receipt (D010), while
        // the loop stops before the next step and the CLI keeps its exit code.
        await deliverPendingSignal(this.options.signal);
        const receipt: VerticalReceipt = { command, ...result };
        this.append("VerticalStepCompleted", receipt);
        // The event is authoritative; these per-step files are readable receipts.
        this.projectReceipt(receipt);
        await this.options.settled?.(receipt, !!this.state!.terminal);
        this.options.afterStep?.(receipt);
      }
      return this.state!;
    } finally {
      this.store.release();
    }
  }
}
