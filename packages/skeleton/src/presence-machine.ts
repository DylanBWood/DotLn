import type {
  CompiledPresencePolicy,
  PresenceTransition,
} from "@dotln/compiler";
import {
  evaluateCadence,
  type JsonValue,
  type PredicateRegistry,
} from "@dotln/kernel";

const field = (state: JsonValue, key: string) =>
  (state as Record<string, JsonValue>)[key];
export const presencePredicates: PredicateRegistry = {
  "dotln.presence.phase-ready": {
    1: ({ state }, params) =>
      field(state, "present") === false &&
      field(state, "phase") === params["phaseId"] &&
      field(state, "policyId") === params["policyId"] &&
      field(state, "inFlight") === false,
  },
  "dotln.presence.returned": {
    1: ({ state }) => field(state, "present") === true,
  },
  "dotln.presence.interrupt-phase": {
    1: ({ state }, params) =>
      field(state, "present") === true &&
      params["discretionary"] === true &&
      params["inFlightOnReturn"] === "kill",
  },
};
export interface PresenceSnapshot {
  state: string;
  present: boolean;
  now: number;
  armedAt: number;
  lastActivity: number;
  generation: number;
  current: {
    id: string;
    generation: number;
    discretionary: boolean;
    status: string;
  } | null;
}

/** The WO-067 table interpreter. All time and outcomes are explicit inputs. */
export class PresenceMachine {
  state: string;
  present = true;
  now = 0;
  armedAt = 0;
  lastActivity = 0;
  generation = 0;
  current: PresenceSnapshot["current"] = null;
  readonly transcript: string[] = [];
  constructor(
    readonly compiled: CompiledPresencePolicy,
    readonly predicates: PredicateRegistry = presencePredicates,
    snapshot?: PresenceSnapshot,
  ) {
    this.state = compiled.statechart.initial;
    if (snapshot) Object.assign(this, structuredClone(snapshot));
  }
  snapshot(): PresenceSnapshot {
    const { state, present, now, armedAt, lastActivity, generation, current } =
      this;
    return { state, present, now, armedAt, lastActivity, generation, current };
  }
  phase() {
    return this.compiled.phases.find((phase) => phase.phaseId === this.state);
  }
  projected() {
    return {
      present: this.present,
      phase: this.state,
      policyId: this.compiled.policyId,
      inFlight: this.current !== null,
    };
  }
  transition(on: PresenceTransition["on"], episode?: string) {
    const transition = this.compiled.statechart.transitions.find(
      (t) => t.from === this.state && t.on === on,
    );
    if (!transition) return;
    if (
      transition.guard === "current-policy-episode-while-absent" &&
      (this.present ||
        !this.current ||
        episode !== this.current.id ||
        this.current.generation !== this.generation)
    )
      return;
    if (transition.guard === "idle-deadline-while-absent") {
      const deadline = evaluateCadence(
        this.compiled.idleCadence,
        this.projected(),
        { now: this.lastActivity, rngState: 0, predicates: this.predicates },
      );
      if (
        this.present ||
        this.current ||
        deadline.dueAt === null ||
        this.now < deadline.dueAt
      )
        return;
    }
    this.state = transition.to;
    for (const action of transition.actions) {
      switch (action) {
        case "arm-phase":
          this.armedAt = this.now;
          this.lastActivity = this.now;
          break;
        case "cancel-pending":
        case "reset-progress":
          this.generation += 1;
          break;
        case "expire-phase":
          this.transcript.push("expired:attention,work-scope,effect-authority");
          break;
        case "finish-discretionary":
          if (this.current?.discretionary) {
            this.current.status = "finishing";
            this.transcript.push("in-flight:finish");
          }
          break;
        case "kill-discretionary":
          if (this.current?.discretionary) {
            this.current = null;
            this.transcript.push("in-flight:kill");
          }
          break;
        case "preserve-foreground":
          break; // Foreground state is owned by its own slice.
      }
    }
    this.transcript.push(`${on}:${this.state}`);
  }
  absence(at = this.now) {
    this.now = at;
    if (!this.present) return;
    this.present = false;
    this.transition("absence");
  }
  returned(at = this.now) {
    this.now = at;
    this.present = true;
    this.transition("return");
  }
  outcome(
    kind: "verified-success" | "failure" | "unverified",
    episode: string,
    at = this.now,
  ) {
    this.now = at;
    if (kind !== "unverified") this.transition(kind, episode);
    if (kind !== "unverified" && this.current?.id === episode) {
      this.current = null;
      this.lastActivity = at;
    }
  }
  /** A durable human question frees the process slot without failing/resetting
   * the policy. Its recorded generation binds the later answer continuation. */
  waitForInput(episode: string) {
    if (this.current?.id === episode) this.current = null;
  }
  due(at: number): number | null {
    this.now = at;
    this.transition("idle-expired");
    const phase = this.phase();
    if (!phase) {
      this.transcript.push(`NoOp:${this.state}`);
      return null;
    }
    const evaluation = evaluateCadence(phase.cadence, this.projected(), {
      now: this.armedAt,
      rngState: 0,
      predicates: this.predicates,
    });
    if (evaluation.dueAt === null || at < evaluation.dueAt) {
      this.transcript.push("NoOp:gate-or-cadence");
      return null;
    }
    if (phase.availability.kind === "NoOp") {
      this.transcript.push(`NoOp:${phase.availability.reason}`);
      return null;
    }
    return evaluation.dueAt;
  }
  dispatch(id: string) {
    const phase = this.phase();
    if (!phase || this.present || this.current)
      throw new Error("presence dispatch is not ready");
    this.current = {
      id,
      generation: this.generation,
      discretionary: phase.discretionary,
      status: "running",
    };
    this.lastActivity = this.now;
    this.transcript.push(`dispatch:${phase.phaseId}`);
  }
}
