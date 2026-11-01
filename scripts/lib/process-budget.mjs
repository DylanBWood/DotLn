import { formatDuration } from "./duration.mjs";
import { docPath, docRelative } from "./config.mjs";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { coldStartHistory } from "./harness-context.mjs";
import { validateRetention } from "./temporary-roots.mjs";
import { readControl, eventsForOrder } from "./control-store.mjs";
import { completedPhaseAttempts } from "./control-time.mjs";

export const dispatchKinds = [
  "executor",
  "verifier",
  "reviewer",
  "release-close",
  "planner",
  "refuter",
  "router",
];
export function readBudgets(root, { cutoff } = {}) {
  const path = docPath(root, "control", "budgets.json");
  if (!existsSync(path)) return null;
  const value = JSON.parse(readFileSync(path, "utf8"));
  value.retention = validateRetention(value.retention);
  if (
    value.schemaVersion !== 1 ||
    !value.source ||
    !Array.isArray(value.acceptances)
  )
    throw new Error("Invalid process budget contract");
  const numberOrNull = (entry) =>
    entry === null || (Number.isFinite(entry) && entry >= 0);
  let attempts;
  const localWallClock = (phase) => {
    if (!attempts) {
      const control = readControl(root);
      attempts = [...control.orders.keys()].flatMap((order) => [
        ...completedPhaseAttempts(
          eventsForOrder(control, order).filter(
            (event) =>
              !cutoff || (event.recordedAt && event.recordedAt <= cutoff),
          ),
        ),
      ]);
    }
    const samples = attempts
      .filter(
        (attempt) =>
          attempt.phase === phase &&
          Number.isFinite(attempt.elapsedMs) &&
          attempt.elapsedMs >= 0,
      )
      .map((attempt) => attempt.elapsedMs)
      .sort((a, b) => a - b);
    const middle = Math.floor(samples.length / 2);
    const medianMs =
      samples.length === 0
        ? null
        : samples.length % 2
          ? samples[middle]
          : (samples[middle - 1] + samples[middle]) / 2;
    return {
      source: "consumer-local completed phase attempts",
      phase,
      sampleCount: samples.length,
      medianMs,
      multiplier: 4,
      minimumMs: 8 * 60 * 60 * 1000,
      cutoff: cutoff ?? null,
      ceiling: Math.max(4 * (medianMs ?? 0), 8 * 60 * 60 * 1000),
    };
  };
  if (
    value.subagentCap !== undefined &&
    value.subagentCap !== null &&
    (!Number.isSafeInteger(value.subagentCap) || value.subagentCap < 0)
  )
    throw new Error("Invalid budget: subagentCap");
  if (
    value.drivenSessionCeiling !== undefined &&
    value.drivenSessionCeiling !== null &&
    (!Number.isSafeInteger(value.drivenSessionCeiling) ||
      value.drivenSessionCeiling < 0)
  )
    throw new Error("Invalid budget: drivenSessionCeiling");
  if (
    value.drivenPhaseTimeoutMs != null &&
    (!Number.isSafeInteger(value.drivenPhaseTimeoutMs) ||
      value.drivenPhaseTimeoutMs <= 0 ||
      value.drivenPhaseTimeoutMs > 2147483647)
  )
    throw new Error("Invalid budget: drivenPhaseTimeoutMs");
  for (const role of dispatchKinds) {
    // Budget seeds belong to the instance; updating a pre-router kit must
    // not require rewriting its operator-owned budget document.
    if (role === "router") {
      value.dispatches ??= {};
      value.dispatches.router ??= { tokens: null, costUsd: null };
      value.limits ??= {};
      value.limits.coldStartBytes ??= {};
      value.limits.coldStartBytes.router ??= null;
    }
    const dispatch = value.dispatches?.[role];
    for (const limits of [
      dispatch,
      ...(role === "executor" && dispatch?.repair !== undefined
        ? [dispatch.repair]
        : []),
    ]) {
      if (!limits || typeof limits !== "object" || Array.isArray(limits))
        throw new Error(`Invalid dispatch budget for ${role}`);
      for (const metric of ["wallClockMs", "completeRuns"]) {
        if (limits[metric] === undefined) limits[metric] = null;
        if (metric === "wallClockMs" && limits[metric] === "local-median") {
          const phase =
            role === "executor"
              ? limits === dispatch
                ? "implementation"
                : "repair"
              : role === "verifier"
                ? "verification"
                : role === "reviewer"
                  ? "finalReview"
                  : undefined;
          if (!phase)
            throw new Error(`No completed-phase timing source for ${role}`);
          limits.wallClockBasis = localWallClock(phase);
          limits[metric] = limits.wallClockBasis.ceiling;
        }
        if (!numberOrNull(limits[metric]))
          throw new Error(`Invalid budget: ${role}.${metric}`);
      }
    }
    if (
      !numberOrNull(value.dispatches?.[role]?.tokens) ||
      !numberOrNull(value.dispatches?.[role]?.costUsd) ||
      !numberOrNull(value.limits?.coldStartBytes?.[role])
    )
      throw new Error(`Invalid budget for ${role}`);
  }
  for (const name of [
    "fastGateMs",
    "readCapBytes",
    "sequenceBytes",
    "prBodyBytes",
    "passRefutationMs",
  ])
    if (!numberOrNull(value.limits?.[name]))
      throw new Error(`Invalid budget: ${name}`);
  for (const entry of value.acceptances) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
      !Number.isFinite(Date.parse(entry.date)) ||
      !entry.metric ||
      !entry.dispatch ||
      !entry.reason ||
      !Number.isFinite(entry.ceiling) ||
      entry.ceiling < 0
    )
      throw new Error(
        "Budget acceptance needs date, metric, ceiling, dispatch and reason",
      );
  }
  return value;
}

export function budgetVerdict(budgets, metric, value, ceiling, scope) {
  if (ceiling === null || ceiling === undefined) return "unset";
  if (!Number.isFinite(value)) return "unavailable";
  if (value <= ceiling) return "within";
  const acceptance = budgets?.acceptances.find(
    (entry) =>
      entry.metric === metric &&
      (!entry.scope || entry.scope === scope) &&
      value <= entry.ceiling,
  );
  return acceptance ? "accepted" : "breach";
}

export function requireBudgets(rows) {
  const durationOrValue = (metric, value) =>
    /Ms$/u.test(metric) ? formatDuration(value) : value;
  const breaches = rows.filter((row) => row.verdict === "breach");
  if (breaches.length)
    console.warn(
      `Advisory: process budget exceeded: ${breaches.map((row) => `${row.metric}=${durationOrValue(row.metric, row.value ?? row.bytes)} > ${durationOrValue(row.metric, row.ceiling)}`).join("; ")}`,
    );
}

/** The files the meter counts as one role's cold start under one skills root:
 * the floor and the role's installed skill. */
export const coldStartPaths = (skillsRoot, role) => [
  "CLAUDE.md",
  `${skillsRoot}/dotln-${role}/SKILL.md`,
];

export function measureColdStarts(root, previous) {
  const budgets = readBudgets(root);
  const roots = [".claude/skills", ".agents/skills"];
  const paths = [
    ...new Set(
      roots.flatMap((skillsRoot) =>
        dispatchKinds.flatMap((role) => coldStartPaths(skillsRoot, role)),
      ),
    ),
  ];
  const history = coldStartHistory(root, {
    previous,
    budgetPath: docRelative(root, "control", "budgets.json"),
    acceptances: budgets?.acceptances ?? [],
    paths,
  });
  const bytes = (path) =>
    existsSync(join(root, path)) ? readFileSync(join(root, path)).length : null;
  const oldBytes = (path) => history.previous.get(path) ?? null;
  const instruction = {
    path: "CLAUDE.md",
    bytes: bytes("CLAUDE.md"),
    previousBytes: oldBytes("CLAUDE.md"),
  };
  const profiles = roots.flatMap((skillsRoot) =>
    dispatchKinds.map((role) => {
      const path = `${skillsRoot}/dotln-${role}/SKILL.md`;
      const skillBytes = bytes(path),
        previousSkillBytes = oldBytes(path);
      const value =
        skillBytes === null || instruction.bytes === null
          ? null
          : skillBytes + instruction.bytes;
      const previousBytes =
        previousSkillBytes === null || instruction.previousBytes === null
          ? null
          : previousSkillBytes + instruction.previousBytes;
      const ceiling = budgets?.limits.coldStartBytes[role] ?? null;
      const metric = `coldStartBytes.${role}`;
      const acceptance = history.accepted.get(metric);
      const acceptedSkillBytes = acceptance?.sizes.get(path) ?? null;
      const acceptedFloorBytes = acceptance?.sizes.get("CLAUDE.md") ?? null;
      const acceptanceBytes =
        acceptedSkillBytes === null || acceptedFloorBytes === null
          ? null
          : acceptedSkillBytes + acceptedFloorBytes;
      return {
        role,
        skillsRoot,
        path,
        skillBytes,
        bytes: value,
        previousBytes,
        previousCause:
          previousBytes === null ? "edition-snapshot-unavailable" : null,
        delta:
          value === null || previousBytes === null
            ? null
            : value - previousBytes,
        ceiling,
        lastAcceptance: {
          date: acceptance?.date ?? null,
          ceiling: acceptance?.ceiling ?? null,
          revision: acceptance?.revision ?? null,
          source: acceptance?.source ?? null,
          bytes: acceptanceBytes,
          delta:
            value === null || acceptanceBytes === null
              ? null
              : value - acceptanceBytes,
          cause: !acceptance
            ? "no-acceptance"
            : (acceptance.cause ??
              (acceptanceBytes === null
                ? "acceptance-files-unavailable"
                : null)),
        },
        metric,
        verdict: budgetVerdict(
          budgets,
          `coldStartBytes.${role}`,
          value,
          ceiling,
        ),
      };
    }),
  );
  return {
    schemaVersion: 3,
    comparisonEdition: history.edition,
    method:
      "Installed CLAUDE.md plus the installed role skill only; UTF-8 source bytes, no task documents or estimated tokens. Previous edition is the highest reachable local vX.Y.Z release tag (or explicit comparison). Last acceptance uses the first committed snapshot on HEAD's first-parent history containing the role's latest global acceptance (date, then record order); it does not infer a measurement from the ceiling or reason prose. Missing history or files are null with a cause.",
    instruction,
    profiles,
  };
}
