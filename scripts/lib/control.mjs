import { validateAllocation, canonical } from "./derived-contract.mjs";
import { validateRecordedAt } from "./control-time.mjs";
import { validateAccountLabel } from "./control-actor.mjs";
import { defaultRoots, docRelative } from "./config.mjs";

const attestedEventTypes = new Set([
  "ImplementationReady",
  "VerificationCompleted",
  "RepairCompleted",
  "FinalReviewCompleted",
]);
export const CONTROL_LOG_SCHEMA_VERSION = 1;
/** The code a failed allocation validation carries (WO-157 item 14). */
export const ALLOCATION_REFUSED = "DOTLN_ALLOCATION_REFUSED";

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
  repositoryId: undefined,
  baseCommit: undefined,
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
    try {
      validateAccountLabel(event?.actor?.accountLabel);
    } catch (error) {
      throw new Error(`${error.message} at ordinal ${index + 1}`);
    }
    state = states.get(event?.workOrderId) ?? emptyState();
    switch (event?.type) {
      case "WorkOrderIdentityAllocated":
        try {
          validateAllocation(event);
        } catch (error) {
          // Scoped to its own segment by foldSegments (WO-157 item 14).
          throw Object.assign(error, { code: ALLOCATION_REFUSED });
        }
        if (state.workOrderId)
          throw new Error(`duplicate identity allocation at line ${index + 1}`);
        Object.assign(state, {
          workOrderId: event.workOrderId,
          workOrderPath: event.workOrderPath,
          allocation: event,
          provenance: event.provenance,
        });
        break;
      case "WorkOrderActivated":
        if (state.allocation && state.workOrderPath !== event.workOrderPath)
          throw new Error(
            `allocated authority path differs at line ${index + 1}`,
          );
        if (
          (event.repositoryId === undefined) !==
            (event.baseCommit === undefined) ||
          (event.repositoryId !== undefined &&
            (event.repositoryId === "self" ||
              !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u.test(event.repositoryId) ||
              !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u.test(event.baseCommit)))
        )
          throw new Error(
            `invalid registered repository identity at line ${index + 1}`,
          );
        Object.assign(state, {
          workOrderId: event.workOrderId,
          workOrderPath: event.workOrderPath,
          repositoryId: event.repositoryId,
          baseCommit: event.baseCommit,
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
        ...(event.actor.mode ? { mode: event.actor.mode } : {}),
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

/** Control storage under one launchpad's configured roots. */
export const controlPaths = (root) => {
  const orders = docRelative(root, "orders");
  return {
    legacy: docRelative(root, "control", "resume.jsonl"),
    orders,
    segment: (id) => `${orders}/${id}.jsonl`,
  };
};

// The default layout, for peers that hold no launchpad: the plane itself
// resolves storage through `controlPaths` so a configured root moves it.
export const LEGACY_CONTROL_PATH = `${defaultRoots().control}/resume.jsonl`;
export const CONTROL_ORDERS_PATH = defaultRoots().orders;
export const orderSegmentPath = (id) => `${CONTROL_ORDERS_PATH}/${id}.jsonl`;
export const DEFAULT_CONTROL_PATHS = {
  legacy: LEGACY_CONTROL_PATH,
  orders: CONTROL_ORDERS_PATH,
  segment: orderSegmentPath,
};

// Direct support for the old log: no event moves and its ordinals stay global.
// New segments have local ordinals. The layout is storage, not event schema.
export const foldSegments = (
  legacy,
  segments = new Map(),
  { legacyPath = LEGACY_CONTROL_PATH, ordersPath = CONTROL_ORDERS_PATH } = {},
) => {
  const at = (path, events) => {
    try {
      return foldWorkOrders(events);
    } catch (error) {
      throw Object.assign(new Error(`${path}: ${error.message}`), {
        code: error.code,
      });
    }
  };
  // An allocation whose retained authority no longer validates makes only its
  // own order unreadable; storage-integrity errors still refuse every read.
  const unreadable = new Map();
  const { current: legacyState, orders } = at(legacyPath, legacy);
  const locations = new Map([...orders.keys()].map((id) => [id, legacyPath]));
  for (const [path, events] of [...segments].sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0,
  )) {
    const id = new RegExp(
      `^${ordersPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/(WO-\\d{3})\\.jsonl$`,
    ).exec(path)?.[1];
    if (!id)
      throw new Error(`${path}: invalid control segment name at ordinal 1`);
    if (events.length === 0)
      throw new Error(`${path}: missing activation at ordinal 1`);
    for (const [index, event] of events.entries()) {
      if (event?.workOrderId !== id)
        throw new Error(
          `${path}: foreign workOrderId at ordinal ${index + 1}; expected ${id}`,
        );
      if (
        index === 0 &&
        !["WorkOrderActivated", "WorkOrderIdentityAllocated"].includes(
          event.type,
        )
      )
        throw new Error(`${path}: expected activation at ordinal 1`);
    }
    if (locations.has(id))
      throw new Error(
        `${path}: ${id} already belongs to ${locations.get(id)} at ordinal 1`,
      );
    let folded;
    try {
      folded = at(path, events);
    } catch (error) {
      if (error.code !== ALLOCATION_REFUSED) throw error;
      unreadable.set(id, { path, message: error.message });
      locations.set(id, path);
      continue;
    }
    orders.set(id, folded.orders.get(id));
    locations.set(id, path);
  }
  const allocationKeys = new Set();
  for (const { state } of orders.values())
    if (state.allocation) {
      const key = canonical(state.provenance);
      if (allocationKeys.has(key))
        throw new Error(
          "duplicate derived provenance key across control segments",
        );
      allocationKeys.add(key);
    }
  return { legacy: legacyState, orders, locations, unreadable };
};
