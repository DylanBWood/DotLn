import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

type PlanState = { phase: string; workOrderId: string };
type PlanModule = {
  selectedPlanState(root: string, order: string): PlanState | undefined;
  planFirstRefusal(root: string, state: PlanState): string | null;
  planFirstContext(
    root: string,
    state: PlanState,
  ): {
    directory: string;
    evidenceDirectory: string;
    intakeDirectory: string;
  };
  readPlanCandidate(root: string, state: PlanState): { path: string };
};

export function planFirstElected(root: string): boolean {
  const configPath = join(root, "dotln.config.json");
  if (!existsSync(configPath)) return false;
  const config = JSON.parse(readFileSync(configPath, "utf8")) as {
    features?: { "plan-first"?: boolean | { on: boolean } };
  };
  const feature = config.features?.["plan-first"];
  return feature === true || (typeof feature === "object" && feature.on);
}

/** The runtime and the lifecycle use the same freshness judgment. Off keeps
 * old consumers independent of the new helper, including historical fixtures. */
export function planFirstBoundary(
  root: string,
  order: string | undefined,
): {
  refusal: string | null;
  directory?: string;
  candidate?: string;
  evidenceDirectory?: string;
  intakeDirectory?: string;
} {
  if (!planFirstElected(root)) return { refusal: null };
  if (!order) throw new Error("plan-first requires the dispatched order");
  const api = createRequire(import.meta.url)(
    join(root, "scripts/lib/plan-first.mjs"),
  ) as PlanModule;
  const state = api.selectedPlanState(root, order);
  if (!state) throw new Error("plan-first selected order is unavailable");
  if (state.phase !== "active") return { refusal: null };
  const refusal = api.planFirstRefusal(root, state);
  const context = api.planFirstContext(root, state);
  let candidate: string | undefined;
  try {
    candidate = api.readPlanCandidate(root, state).path;
  } catch {
    // A missing or invalid draft grants no outside write, but must not
    // prevent explaining and repairing it in the conversation or records.
  }
  return {
    refusal,
    ...context,
    ...(candidate ? { candidate } : {}),
  };
}
