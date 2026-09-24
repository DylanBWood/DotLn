import { docPath, docRelative } from "./config.mjs";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { coldStartHistory } from "./harness-context.mjs";

export const dispatchKinds = [
  "executor",
  "verifier",
  "reviewer",
  "release-close",
  "planner",
  "refuter",
];
export function readBudgets(root) {
  const path = docPath(root, "control", "budgets.json");
  if (!existsSync(path)) return null;
  const value = JSON.parse(readFileSync(path, "utf8"));
  if (
    value.schemaVersion !== 1 ||
    !value.source ||
    !Array.isArray(value.acceptances)
  )
    throw new Error("Invalid process budget contract");
  const numberOrNull = (entry) =>
    entry === null || (Number.isFinite(entry) && entry >= 0);
  if (
    value.subagentCap !== undefined &&
    value.subagentCap !== null &&
    (!Number.isSafeInteger(value.subagentCap) || value.subagentCap < 0)
  )
    throw new Error("Invalid budget: subagentCap");
  for (const role of dispatchKinds) {
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
  const breaches = rows.filter((row) => row.verdict === "breach");
  if (breaches.length)
    console.warn(
      `Advisory: process budget exceeded: ${breaches.map((row) => `${row.metric}=${row.value ?? row.bytes} > ${row.ceiling}`).join("; ")}`,
    );
}

export function measureColdStarts(root, previous) {
  const budgets = readBudgets(root);
  const roots = [".claude/skills", ".agents/skills"];
  const paths = [
    "CLAUDE.md",
    ...roots.flatMap((skillsRoot) =>
      dispatchKinds.map((role) => `${skillsRoot}/dotln-${role}/SKILL.md`),
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
