import { validateRecordedAt } from "./control-time.mjs";

const attestedEventTypes = new Set([
  "ImplementationReady",
  "VerificationCompleted",
  "RepairCompleted",
  "FinalReviewCompleted",
]);
export const CONTROL_LOG_SCHEMA_VERSION = 1;

export const parseControlEvents = (source) =>
  source
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        throw new Error(`invalid control event at line ${index + 1}`);
      }
    });

const emptyState = () => ({
  workOrderId: undefined,
  workOrderPath: undefined,
  phase: "none",
  latestVerificationId: undefined,
  latestVerificationPath: undefined,
  latestVerdict: undefined,
  finalReviewId: undefined,
  finalReviewPath: undefined,
  failureSourceId: undefined,
  failureSourcePath: undefined,
  latestCheckpointSha: undefined,
  latestCheckpointRef: undefined,
  checkpointUnavailable: false,
  latestAttestation: undefined,
  effortPairs: [],
  effortDeclarationValidated: false,
});

const scanControl = (events, visit) => {
  const states = new Map();
  let state = emptyState();
  for (const [index, event] of events.entries()) {
    validateRecordedAt(event, `at line ${index + 1}`);
    state = states.get(event?.workOrderId) ?? emptyState();
    switch (event?.type) {
      case "WorkOrderActivated":
        Object.assign(state, {
          workOrderId: event.workOrderId,
          workOrderPath: event.workOrderPath,
          phase: "active",
          latestVerificationId: undefined,
          latestVerificationPath: undefined,
          latestVerdict: undefined,
          finalReviewId: undefined,
          finalReviewPath: undefined,
          failureSourceId: undefined,
          failureSourcePath: undefined,
          latestCheckpointSha: undefined,
          latestCheckpointRef: undefined,
          checkpointUnavailable: false,
          latestAttestation: undefined,
          effortPairs: [],
          effortDeclarationValidated: event.effortDeclarationValidated === true,
        });
        break;
      case "ImplementationReady":
        state.phase = "ready-to-verify";
        break;
      case "VerificationRequested":
        Object.assign(state, {
          phase: "verifying",
          latestVerificationId: event.verificationId,
          latestVerificationPath: event.reportPath,
          latestVerdict: undefined,
        });
        break;
      case "VerificationCompleted":
        Object.assign(state, {
          phase: event.verdict === "pass" ? "verified" : "needs-fix",
          latestVerificationId: event.verificationId,
          latestVerificationPath: event.reportPath,
          latestVerdict: event.verdict,
          failureSourceId:
            event.verdict === "fail" ? event.verificationId : undefined,
          failureSourcePath:
            event.verdict === "fail" ? event.reportPath : undefined,
        });
        break;
      case "RepairRequested":
        state.phase = "repairing";
        break;
      case "RepairCompleted":
        state.phase = "ready-to-verify";
        break;
      case "FinalReviewRequested":
        Object.assign(state, {
          phase: "final-review",
          finalReviewId: event.finalReviewId,
          finalReviewPath: event.reportPath,
        });
        break;
      case "FinalReviewCompleted":
        Object.assign(state, {
          phase: event.verdict === "pass" ? "closed" : "needs-fix",
          failureSourceId:
            event.verdict === "fail" ? event.finalReviewId : undefined,
          failureSourcePath:
            event.verdict === "fail" ? event.reportPath : undefined,
        });
        break;
      default:
        throw new Error(
          `unknown control event type at line ${index + 1}: ${event?.type ?? "missing"}`,
        );
    }
    if (
      attestedEventTypes.has(event.type) &&
      event.workOrderId === state.workOrderId &&
      event.actor &&
      typeof event.actor.harness === "string" &&
      typeof event.actor.harnessVersion === "string" &&
      typeof event.actor.model === "string" &&
      typeof event.actor.effort === "string" &&
      typeof event.actor.source === "string"
    ) {
      state.latestAttestation = event.actor;
      const pair = {
        effort: event.actor.effort,
        raw: typeof event.actor.raw === "string" ? event.actor.raw : undefined,
      };
      if (
        !state.effortPairs.some(
          (existing) =>
            existing.effort === pair.effort &&
            (existing.raw ?? null) === (pair.raw ?? null),
        )
      )
        state.effortPairs.push(pair);
    }
    if (
      typeof event.checkpointSha === "string" &&
      typeof event.checkpointRef === "string"
    ) {
      Object.assign(state, {
        latestCheckpointSha: event.checkpointSha,
        latestCheckpointRef: event.checkpointRef,
        checkpointUnavailable: false,
      });
    } else if (event.workOrderId === state.workOrderId) {
      Object.assign(state, {
        latestCheckpointSha: undefined,
        latestCheckpointRef: undefined,
        checkpointUnavailable: true,
      });
    }
    states.set(event.workOrderId, state);
    visit?.(state, event, index + 1);
  }
  return state;
};

export const fold = (events) => scanControl(events);

// Project every order through the same event switch, retaining source ordinals.
// The observer adds index evidence; it cannot change lifecycle behavior.
export const foldWorkOrders = (events) => {
  const orders = new Map();
  const current = scanControl(events, (state, event, ordinal) => {
    if (!state.workOrderId) return;
    const prior = orders.get(state.workOrderId);
    const finalReviewVerdict =
      event.type === "FinalReviewRequested" ||
      event.type === "WorkOrderActivated"
        ? undefined
        : event.type === "FinalReviewCompleted"
          ? event.verdict
          : prior?.finalReviewVerdict;
    orders.set(state.workOrderId, {
      state: structuredClone(state),
      finalReviewVerdict,
      closeOrdinal: state.phase === "closed" ? ordinal : undefined,
      closeRecordedAt: state.phase === "closed" ? event.recordedAt : undefined,
    });
  });
  return { current, orders };
};

export const LEGACY_CONTROL_PATH = "docs/control/resume.jsonl";
export const CONTROL_ORDERS_PATH = "docs/control/orders";
export const orderSegmentPath = (id) => `${CONTROL_ORDERS_PATH}/${id}.jsonl`;

// Direct support for the old log: no event moves and its ordinals stay global.
// New segments have local ordinals. The layout is storage, not event schema.
export const foldSegments = (legacy, segments = new Map()) => {
  const at = (path, events) => {
    try {
      return foldWorkOrders(events);
    } catch (error) {
      throw new Error(`${path}: ${error.message}`);
    }
  };
  const { current: legacyState, orders } = at(LEGACY_CONTROL_PATH, legacy);
  const locations = new Map(
    [...orders.keys()].map((id) => [id, LEGACY_CONTROL_PATH]),
  );
  for (const [path, events] of [...segments].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const id = /^docs\/control\/orders\/(WO-\d{3})\.jsonl$/.exec(path)?.[1];
    if (!id)
      throw new Error(`${path}: invalid control segment name at ordinal 1`);
    if (events.length === 0)
      throw new Error(`${path}: missing activation at ordinal 1`);
    for (const [index, event] of events.entries()) {
      if (event?.workOrderId !== id)
        throw new Error(
          `${path}: foreign workOrderId at ordinal ${index + 1}; expected ${id}`,
        );
      if (index === 0 && event.type !== "WorkOrderActivated")
        throw new Error(`${path}: expected activation at ordinal 1`);
    }
    if (locations.has(id))
      throw new Error(
        `${path}: ${id} already belongs to ${locations.get(id)} at ordinal 1`,
      );
    const folded = at(path, events);
    orders.set(id, folded.orders.get(id));
    locations.set(id, path);
  }
  return { legacy: legacyState, orders, locations };
};
