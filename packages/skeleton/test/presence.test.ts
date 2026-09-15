import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  compileLoadout,
  requireCompiled,
  type LoadoutGraph,
  type CompilationEnvironment,
  type CompiledPresencePolicy,
  type PresenceTransition,
} from "@dotln/compiler";
import {
  authorize,
  evaluateCadence,
  type PredicateRegistry,
  type JsonValue,
} from "@dotln/kernel";

const fixture: { graph: LoadoutGraph; environment: CompilationEnvironment } =
  JSON.parse(
    readFileSync(
      new URL("../../fixtures/wo067-presence.json", import.meta.url),
      "utf8",
    ),
  );
const program = requireCompiled(
  compileLoadout(fixture.graph, fixture.environment),
);
const policy = program.presence![0]!;
const field = (state: JsonValue, key: string) =>
  (state as Record<string, JsonValue>)[key];
const predicates: PredicateRegistry = {
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
  "fixture.enabled": { 1: (_context, params) => params["enabled"] === true },
};

/** Bounded test host for emitted data, not a resident runtime or scheduler. */
class FixtureHost {
  state: string;
  present = true;
  now = 0;
  armedAt = 0;
  lastActivity = 0;
  generation = 0;
  serial = 0;
  current:
    | { id: string; generation: number; discretionary: boolean; status: string }
    | undefined;
  foreground = "running";
  foregroundAuthority = {
    authorityEnvelopeId: "fixture.requested-foreground",
    allowedEffects: ["foreground.edit"],
    deniedEffects: [],
    resourceLimits: { "foreground-steps": 1 },
    requiredEvidence: ["explicit-request"],
    expiresAt: 100000,
    revocationEventTypes: [],
  };
  readonly transcript: string[] = [];
  constructor(readonly compiled: CompiledPresencePolicy = policy) {
    this.state = compiled.statechart.initial;
  }
  phase() {
    return this.compiled.phases.find((phase) => phase.phaseId === this.state);
  }
  completeForeground() {
    const result = authorize(
      {
        kind: "Act",
        effect: "foreground.edit",
        resource: "foreground-steps",
        payload: {},
      },
      this.foregroundAuthority,
      {
        now: this.now,
        actorId: "fixture",
        workstreamId: "foreground",
        episodeId: "requested-task",
        decisionIndex: 0,
        intentIndex: 0,
        evidence: ["explicit-request"],
        revokedBy: [],
      },
    );
    assert.ok(
      result.authorized,
      "requested foreground can still execute under its own authority",
    );
    assert.equal(
      result.authority.authorityEnvelopeId,
      "fixture.requested-foreground",
    );
    assert.equal(result.authority.resourceLimits["foreground-steps"], 0);
    this.foreground = "completed";
    this.transcript.push("foreground:completed-under-own-authority");
  }
  projected() {
    return {
      present: this.present,
      phase: this.state,
      policyId: this.compiled.policyId,
      inFlight: this.current !== undefined,
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
        { now: this.lastActivity, rngState: 0, predicates },
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
            this.current = undefined;
            this.transcript.push("in-flight:kill");
          }
          break;
        case "preserve-foreground":
          assert.equal(this.foreground, "running");
          break;
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
    if (kind !== "unverified" && this.current?.id === episode)
      this.current = undefined;
  }
  pulse(at: number) {
    this.now = at;
    this.transition("idle-expired");
    const phase = this.phase();
    if (!phase) {
      this.transcript.push(`NoOp:${this.state}`);
      return;
    }
    const evaluation = evaluateCadence(phase.cadence, this.projected(), {
      now: this.armedAt,
      rngState: 0,
      predicates,
    });
    if (evaluation.dueAt === null || at < evaluation.dueAt) {
      this.transcript.push("NoOp:gate-or-cadence");
      return;
    }
    if (phase.availability.kind === "NoOp") {
      this.transcript.push(`NoOp:${phase.availability.reason}`);
      return;
    }
    this.current = {
      id: `episode-${++this.serial}`,
      generation: this.generation,
      discretionary: phase.discretionary,
      status: "running",
    };
    this.lastActivity = at;
    this.transcript.push(`dispatch:${phase.phaseId}`);
  }
  batch(at: number, events: readonly ("return" | "pulse" | "success")[]) {
    assert.equal(
      this.compiled.statechart.returnPrecedence,
      "before-dispatch-and-outcome",
    );
    const id = this.current?.id ?? "stale";
    for (const event of [...events].sort(
      (a, b) => Number(b === "return") - Number(a === "return"),
    )) {
      if (event === "return") this.returned(at);
      if (event === "pulse") this.pulse(at);
      if (event === "success") this.outcome("verified-success", id, at);
    }
  }
}

test("WO-067 fixture: hold, verified-only advance, failure reset, peak/reset/loop", (t) => {
  const host = new FixtureHost();
  host.pulse(0);
  assert.equal(host.state, "present");
  host.absence(1);
  host.pulse(10);
  assert.equal(host.current, undefined);
  host.pulse(11);
  const first = host.current!.id;
  host.outcome("unverified", first);
  assert.equal(host.state, "probe");
  host.outcome("verified-success", "foreground");
  assert.equal(host.state, "probe");
  host.outcome("verified-success", first, 12);
  assert.equal(host.state, "widen");
  host.pulse(22);
  host.outcome("failure", host.current!.id, 23);
  assert.equal(host.state, "probe");
  host.outcome("verified-success", first);
  assert.equal(host.state, "probe");
  for (let loop = 0; loop < 2; loop += 1) {
    for (const expected of ["widen", "peak", "probe"]) {
      host.pulse(host.now + 10);
      host.outcome("verified-success", host.current!.id, host.now + 1);
      assert.equal(host.state, expected);
    }
  }
  assert.deepEqual(
    host.transcript.filter((line) => line.startsWith("dispatch:")),
    [
      "dispatch:probe",
      "dispatch:widen",
      "dispatch:probe",
      "dispatch:widen",
      "dispatch:peak",
      "dispatch:probe",
      "dispatch:widen",
      "dispatch:peak",
    ],
  );
  t.diagnostic(host.transcript.join(" | "));
});

test("WO-067 fixture: return kills or finishes discretionary work, preserves foreground and wins races", (t) => {
  for (const events of [
    ["pulse", "success", "return"],
    ["return", "success", "pulse"],
  ] as const) {
    const host = new FixtureHost();
    host.absence();
    host.pulse(10);
    host.batch(11, events);
    assert.equal(host.state, "present");
    assert.equal(host.current, undefined);
    assert.equal(host.foreground, "running");
    assert.ok(host.transcript.includes("in-flight:kill"));
    assert.deepEqual(
      host.transcript.filter((line) => line.startsWith("dispatch:")),
      ["dispatch:probe"],
    );
    host.completeForeground();
    t.diagnostic(host.transcript.join(" | "));
  }
  const finish = new FixtureHost();
  finish.absence();
  finish.pulse(10);
  finish.outcome("verified-success", finish.current!.id, 11);
  finish.pulse(21);
  const oldEpisode = finish.current!.id;
  finish.returned(22);
  assert.equal(finish.current?.status, "finishing");
  finish.pulse(23);
  finish.absence(24);
  finish.pulse(34);
  assert.equal(
    finish.current?.id,
    oldEpisode,
    "finishing episode prevents overlapping policy dispatch",
  );
  finish.outcome("verified-success", oldEpisode, 35);
  assert.equal(finish.state, "probe");
  finish.pulse(36);
  assert.notEqual(finish.current?.id, oldEpisode);
  assert.equal(finish.foreground, "running");
  finish.completeForeground();
  t.diagnostic(finish.transcript.join(" | "));
});

test("WO-067 fixture: idle deadline expires phase allocation and requires a fresh absence edge", (t) => {
  const host = new FixtureHost();
  host.absence();
  host.now = 99;
  host.transition("idle-expired");
  assert.equal(host.state, "probe");
  host.pulse(100);
  assert.equal(host.state, "expired");
  host.absence(101);
  host.pulse(102);
  assert.equal(host.state, "expired");
  host.returned(103);
  host.absence(104);
  host.pulse(114);
  assert.equal(host.current?.status, "running");
  assert.equal(host.foreground, "running");
  host.completeForeground();
  t.diagnostic(host.transcript.join(" | "));
});

test("WO-067 fixture: a preauthorized portfolio effect with an unavailable adapter emits NoOp", (t) => {
  const grant = {
    grantId: "fixture.portfolio",
    version: 1,
    grantedBy: "operator" as const,
    effects: ["portfolio.publish"],
    operations: ["portfolio.publish"],
    repo: fixture.environment.repo,
    reason:
      "Explicit optional portfolio fixture; no real adapter or destination",
  };
  const graph: LoadoutGraph = {
    ...fixture.graph,
    authorityGrants: [grant],
    presence: [
      {
        ...fixture.graph.presence![0]!,
        phases: fixture.graph.presence![0]!.phases.map((phase) => ({
          ...phase,
          envelope: {
            ...phase.envelope,
            allowedEffects: ["portfolio.publish"],
          },
          requiredCapabilities: ["adapter.portfolio"],
        })),
      },
    ],
  };
  const result = requireCompiled(
    compileLoadout(graph, {
      ...fixture.environment,
      authorityGrantRegistry: [grant],
    }),
  );
  const host = new FixtureHost(result.presence![0]!);
  host.absence();
  host.pulse(10);
  assert.equal(host.current, undefined);
  assert.deepEqual(result.presence![0]!.sourceGrantIds, ["fixture.portfolio"]);
  assert.match(
    host.transcript.at(-1)!,
    /NoOp:.*unavailable external capability: adapter.portfolio/u,
  );
  assert.equal(
    compileLoadout(graph, fixture.environment).ok,
    false,
    "graph grant alone cannot authorize the base",
  );
  t.diagnostic(host.transcript.join(" | "));
});

test("WO-067 fixture: real kernel authorizer enforces every phase ceiling and inherited restrictions", () => {
  const context = {
    now: 1,
    actorId: "fixture",
    workstreamId: "fixture",
    episodeId: "fixture",
    decisionIndex: 0,
    intentIndex: 0,
    evidence: ["verified-input"],
    revokedBy: [],
  };
  for (const phase of policy.phases) {
    for (const effect of [
      "repo.inspect",
      "repo.read",
      "repo.write",
      "repo.delete",
      "unknown",
    ]) {
      const act = { kind: "Act" as const, effect, payload: {} };
      const narrowed = authorize(act, phase.effectiveEnvelope, context);
      const base = authorize(act, program.authorityEnvelope, context);
      assert.ok(!narrowed.authorized || base.authorized);
      assert.equal(
        narrowed.authorized,
        phase.effectiveEnvelope.allowedEffects.includes(effect),
      );
    }
    const act = {
      kind: "Act" as const,
      effect: "repo.inspect",
      resource: "files",
      payload: {},
    };
    let remaining = phase.effectiveEnvelope;
    for (let file = 0; file < phase.scope.changeSize.files; file += 1) {
      const result = authorize(act, remaining, {
        ...context,
        intentIndex: file,
      });
      assert.ok(result.authorized);
      remaining = result.authority;
    }
    assert.equal(authorize(act, remaining, context).authorized, false);
    assert.equal(
      authorize(
        { kind: "Act", effect: "repo.inspect", payload: {} },
        phase.effectiveEnvelope,
        { ...context, evidence: [] },
      ).authorized,
      false,
    );
  }
});

test("WO-067 fixture: condition entry and every emitted cadence execute in the kernel subset", () => {
  const graph: LoadoutGraph = {
    ...fixture.graph,
    presence: [
      {
        ...fixture.graph.presence![0]!,
        phases: [
          {
            ...fixture.graph.presence![0]!.phases[0]!,
            entry: {
              condition: {
                registryId: "fixture.enabled",
                version: 1,
                params: { enabled: true },
              },
            },
          },
        ],
      },
    ],
  };
  const conditional = requireCompiled(
    compileLoadout(graph, fixture.environment),
  ).presence![0]!;
  const host = new FixtureHost(conditional);
  host.absence();
  host.pulse(0);
  assert.equal(host.current?.status, "running");
  for (const phase of policy.phases) {
    const result = evaluateCadence(
      phase.cadence,
      {
        present: false,
        phase: phase.phaseId,
        policyId: policy.policyId,
        inFlight: false,
      },
      { now: 5, rngState: 7, predicates },
    );
    assert.equal(result.dueAt, 15);
    assert.equal(result.rngState, 7);
    const interrupted = evaluateCadence(
      {
        kind: "Gate",
        cadence: { kind: "After", delayMs: 0 },
        conditionRef: phase.statechartGate.interruptionCondition,
      },
      { present: true },
      { now: 0, rngState: 0, predicates },
    );
    assert.equal(
      interrupted.dueAt,
      phase.inFlightOnReturn === "kill" ? 0 : null,
    );
  }
});
