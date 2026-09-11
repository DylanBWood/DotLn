import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

export const dispatchKinds = [
  "executor",
  "verifier",
  "reviewer",
  "release-close",
  "planner",
  "refuter",
];
export function readBudgets(root) {
  const path = join(root, "docs/control/budgets.json");
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
    throw new Error(
      `Process budget exceeded without a dated acceptance: ${breaches.map((row) => `${row.metric}=${row.value ?? row.bytes} > ${row.ceiling}`).join("; ")}`,
    );
}

export function measureColdStarts(root, previous = "v0.16.0") {
  const budgets = readBudgets(root);
  const bytes = (path) =>
    existsSync(join(root, path)) ? readFileSync(join(root, path)).length : null;
  const oldBytes = (path) => {
    const run = spawnSync("git", ["show", `${previous}:${path}`], {
      cwd: root,
      maxBuffer: 2 * 1024 * 1024,
    });
    return run.status === 0 ? run.stdout.length : null;
  };
  const instruction = {
    path: "CLAUDE.md",
    bytes: bytes("CLAUDE.md"),
    previousBytes: oldBytes("CLAUDE.md"),
  };
  const profiles = [".claude/skills", ".agents/skills"].flatMap((skillsRoot) =>
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
      return {
        role,
        skillsRoot,
        path,
        skillBytes,
        bytes: value,
        previousBytes,
        delta:
          value === null || previousBytes === null
            ? null
            : value - previousBytes,
        ceiling,
        metric: `coldStartBytes.${role}`,
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
    schemaVersion: 2,
    comparisonEdition: previous,
    method:
      "Installed CLAUDE.md plus the installed role skill only; source bytes, no task documents or estimated tokens.",
    instruction,
    profiles,
  };
}
