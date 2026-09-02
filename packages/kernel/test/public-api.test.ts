import type { Decision, EventDraft, JsonValue, Program } from "@dotln/kernel";

const draft: EventDraft<"Test", { value: number }> = {
  schemaVersion: 1,
  type: "Test",
  occurredAt: 0,
  actorId: "actor",
  workstreamId: "ws",
  payload: { value: 1 },
};
const continuation: Program.T = {
  kind: "Emit",
  event: draft,
  next: { kind: "Done" },
};
const decision: Decision<JsonValue> = {
  state: {},
  intents: [],
  continuation,
  schedules: [],
  trace: {
    reactorId: "typecheck",
    reactorVersion: "1",
    branchPath: [],
    envInputs: [],
    cadenceEvaluations: [],
  },
};
void decision;
