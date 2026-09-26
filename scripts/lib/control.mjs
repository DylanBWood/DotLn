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

// WO-158 off-ramps. Each is a typed event with its own `resume` route; the
// fold validates their shape here and `resume` judges their legality.
export const WITHDRAWAL_DISPOSITIONS = ["failed", "superseded", "abandoned"];
export const CORRECTABLE_ATTESTATION_FIELDS = [
  "model",
  "effort",
  "source",
  "harnessVersion",
];
export const CORRECTABLE_FIELDS = [
  ...CORRECTABLE_ATTESTATION_FIELDS,
  "reportPath",
  "checkpointRef",
  "checkpointSha",
  // A recorded passing final review that carries no product gate is bound to
  // one by the gate's evidence reference; the event carries the whole row
  // (WO-115 D026).
  "productGate",
];
const HEX_64 = /^[a-f0-9]{64}$/u;
const TREE_HASH = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u;
/** The rule `partialGateCheck` applies in packages/skeleton/src/gate-evidence.mjs,
 * restated here because the control fold runs in a copied control plane that
 * carries no skeleton source (WO-070): any shape of either field other than
 * absent, `false` or an empty list marks a partial row. */
const partialRow = (row) =>
  (row.partial !== undefined && row.partial !== false) ||
  (row.excludedSuites !== undefined &&
    !(Array.isArray(row.excludedSuites) && row.excludedSuites.length === 0));
/** The bound gate row publication and release close consume from committed
 * control history, where the local gate rows may be absent. Partial rows are
 * judged by the same rule publication applies. */
export const validProductGate = (gate, evidenceRef) =>
  Boolean(gate) &&
  typeof gate === "object" &&
  !Array.isArray(gate) &&
  gate.checkId === "npm test" &&
  gate.executed === true &&
  gate.exitCode === 0 &&
  !partialRow(gate) &&
  HEX_64.test(gate.codeIdentity ?? "") &&
  TREE_HASH.test(gate.treeHash ?? "") &&
  Number.isFinite(gate.durationMs) &&
  gate.durationMs >= 0 &&
  typeof gate.evidenceRef === "string" &&
  gate.evidenceRef.length > 0 &&
  (evidenceRef === undefined || gate.evidenceRef === evidenceRef) &&
  Number.isFinite(Date.parse(gate.recordedAt));
export const CRITERION_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u;
const SHA256_DIGEST = /^sha256:[0-9a-f]{64}$/u;
const offRampText = (value) =>
  typeof value === "string" &&
  value.trim() !== "" &&
  !/[\u0000-\u001F\u007F-\u009F\u2028\u2029]/u.test(value);
const completeActor = (actor) =>
  actor &&
  typeof actor === "object" &&
  ["harness", "harnessVersion", "model", "effort", "source"].every((key) =>
    offRampText(actor[key]),
  );
const offRampEvent = (event, at) => {
  const refuse = (detail) => {
    throw new Error(`invalid ${event.type} ${detail} at line ${at}`);
  };
  if (!completeActor(event.actor)) refuse("actor attestation");
  if (!offRampText(event.reason)) refuse("reason");
  const capture = () => {
    if (!offRampText(event.capture) || !SHA256_DIGEST.test(event.captureHash))
      refuse("operator capture");
  };
  switch (event.type) {
    case "CriterionWaived":
      if (!CRITERION_ID.test(event.criterionId ?? "")) refuse("criterionId");
      capture();
      break;
    case "WorkOrderWithdrawn":
      if (!WITHDRAWAL_DISPOSITIONS.includes(event.disposition))
        refuse("disposition");
      if (!SHA256_DIGEST.test(event.orderHash ?? "")) refuse("orderHash");
      if (
        event.reactivationNotes !== undefined &&
        (!Array.isArray(event.reactivationNotes) ||
          !event.reactivationNotes.every((note) => SHA256_DIGEST.test(note)))
      )
        refuse("reactivationNotes");
      capture();
      break;
    case "RecordCorrected": {
      const fields = event.fields;
      if (
        !Number.isSafeInteger(event.subject?.ordinal) ||
        event.subject.ordinal < 1 ||
        event.subject.ordinal >= at
      )
        refuse("subject ordinal");
      if (
        !fields ||
        typeof fields !== "object" ||
        Array.isArray(fields) ||
        Object.keys(fields).length === 0
      )
        refuse("fields");
      // A verdict is never corrected: a later VER-NNN or a failing final
      // review is its route, and report bytes are never rewritten.
      for (const [name, value] of Object.entries(fields))
        if (!CORRECTABLE_FIELDS.includes(name) || !offRampText(value))
          refuse(`field ${name}`);
      if (
        fields.productGate !== undefined &&
        !validProductGate(event.evidence?.productGate, fields.productGate)
      )
        refuse("productGate evidence");
      // A gate binds to a recorded final review and nothing else, even when
      // the event is hand-appended rather than written by `resume correct`.
      if (
        fields.productGate !== undefined &&
        event.subject?.type !== "FinalReviewCompleted"
      )
        refuse("productGate subject");
      break;
    }
    case "OperatorOverrideRecorded":
      for (const list of [event.bypassed, event.effects])
        if (!Array.isArray(list) || !list.length || !list.every(offRampText))
          refuse("bypassed or effects list");
      if (event.capture !== undefined || event.captureHash !== undefined)
        capture();
      break;
  }
};

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
  // WO-158 projections stay undefined until their event appears, so folds of
  // histories without off-ramps keep their recorded shape.
  waivedCriteria: undefined,
  withdrawal: undefined,
  corrections: undefined,
  overrideRecords: undefined,
});

const effortPair = (actor) => ({
  effort: actor.effort,
  ...(actor.mode ? { mode: actor.mode } : {}),
  raw: typeof actor.raw === "string" ? actor.raw : undefined,
});
const addEffortPair = (pairs, pair) => {
  if (
    !pairs.some(
      (existing) =>
        existing.effort === pair.effort &&
        (existing.raw ?? null) === (pair.raw ?? null),
    )
  )
    pairs.push(pair);
};

const scanControl = (events, visit) => {
  const states = new Map();
  // Attested completions of each order's current activation by ordinal, so a
  // RecordCorrected event can project the corrected attestation.
  const attested = new Map();
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
          waivedCriteria: undefined,
          withdrawal: undefined,
          corrections: undefined,
          overrideRecords: undefined,
        });
        attested.set(event.workOrderId, []);
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
      // WO-158: none of these changes the phase except the withdrawal, and
      // none is an attested completion of the order's own work.
      case "CriterionWaived":
        offRampEvent(event, index + 1);
        state.waivedCriteria = [
          ...(state.waivedCriteria ?? []),
          {
            criterionId: event.criterionId,
            ordinal: index + 1,
            reason: event.reason,
            captureHash: event.captureHash,
            recordedAt: event.recordedAt,
          },
        ];
        break;
      case "WorkOrderWithdrawn":
        offRampEvent(event, index + 1);
        Object.assign(state, {
          phase: "withdrawn",
          withdrawal: {
            disposition: event.disposition,
            reason: event.reason,
            ordinal: index + 1,
            orderHash: event.orderHash,
            ...(event.reactivationNotes
              ? { reactivationNotes: event.reactivationNotes }
              : {}),
            captureHash: event.captureHash,
            recordedAt: event.recordedAt,
          },
        });
        break;
      case "RecordCorrected": {
        offRampEvent(event, index + 1);
        const subject = events[event.subject.ordinal - 1];
        if (subject?.workOrderId !== event.workOrderId)
          throw new Error(
            `invalid RecordCorrected subject ordinal at line ${index + 1}`,
          );
        const fields = event.fields;
        const rows = attested.get(event.workOrderId) ?? [];
        const row = rows.find(
          (entry) => entry.ordinal === event.subject.ordinal,
        );
        if (row) {
          row.actor = {
            ...row.actor,
            correctedBy: [...(row.actor.correctedBy ?? []), index + 1],
          };
          for (const name of CORRECTABLE_ATTESTATION_FIELDS)
            if (fields[name] !== undefined) row.actor[name] = fields[name];
          // A corrected effort is the recorded value; the supplied spelling
          // and mode described the value it replaces.
          if (fields.effort !== undefined) {
            delete row.actor.mode;
            delete row.actor.raw;
          }
          state.latestAttestation = rows.at(-1).actor;
          state.effortPairs = [];
          for (const entry of rows)
            addEffortPair(state.effortPairs, effortPair(entry.actor));
        }
        if (fields.reportPath !== undefined) {
          if (
            subject.verificationId !== undefined &&
            subject.verificationId === state.latestVerificationId
          )
            state.latestVerificationPath = fields.reportPath;
          if (
            subject.finalReviewId !== undefined &&
            subject.finalReviewId === state.finalReviewId
          )
            state.finalReviewPath = fields.reportPath;
          const reportId = subject.verificationId ?? subject.finalReviewId;
          if (reportId !== undefined && reportId === state.failureSourceId)
            state.failureSourcePath = fields.reportPath;
        }
        state.corrections = [
          ...(state.corrections ?? []),
          {
            ordinal: index + 1,
            subject: event.subject,
            fields,
            previous: event.previous,
            reason: event.reason,
            recordedAt: event.recordedAt,
            ...(event.evidence ? { evidence: event.evidence } : {}),
          },
        ];
        break;
      }
      case "OperatorOverrideRecorded":
        offRampEvent(event, index + 1);
        state.overrideRecords = [
          ...(state.overrideRecords ?? []),
          {
            ordinal: index + 1,
            bypassed: event.bypassed,
            effects: event.effects,
            reason: event.reason,
            ...(event.captureHash ? { captureHash: event.captureHash } : {}),
            recordedAt: event.recordedAt,
          },
        ];
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
      addEffortPair(state.effortPairs, effortPair(event.actor));
      if (!attested.has(event.workOrderId)) attested.set(event.workOrderId, []);
      attested
        .get(event.workOrderId)
        .push({ ordinal: index + 1, actor: event.actor });
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
      // The event that closed the order keeps the close ordinal; a later
      // correction in `closed` (binding a product gate) does not reorder the
      // closed orders (WO-115 D026).
      closeOrdinal:
        state.phase === "closed" ? (prior?.closeOrdinal ?? ordinal) : undefined,
      closeRecordedAt:
        state.phase === "closed"
          ? (prior?.closeRecordedAt ?? event.recordedAt)
          : undefined,
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
