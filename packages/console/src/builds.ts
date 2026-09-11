import {
  canonicalStringify,
  compileEditableView,
  compileFeedbackUnits,
  compileLoadout,
  defineLoadout,
  feedbackMaturity,
  functionTableFromLoadout,
  renderCompiledDiff,
  statechartJsonFromLoadout,
  type CompilationEnvironment,
  type FeedbackObservation,
  type FeedbackUnit,
  type LoadoutGraph,
} from "@dotln/compiler";
import type {
  BoardRow,
  BoardSection,
  BoardSources,
  LoadoutSource,
} from "./types.js";
import { ProjectionContext } from "./context.js";
import {
  array,
  at,
  fact,
  id,
  known,
  number,
  object,
  optionalString,
  string,
  unknown,
} from "./values.js";

export const INSPECTION_EXPIRES_AT = 86_400_000;

export function exportedLoadouts(
  exports: Readonly<Record<string, unknown>>,
  ref: string,
  environment: CompilationEnvironment,
): readonly LoadoutSource[] {
  const rows: LoadoutSource[] = [];
  for (const name of Object.keys(exports).sort()) {
    const item = exports[name];
    // Existing saved factories share the explicit expiry argument. No other
    // exported function is invoked (compile/dispatch/transport are not factories).
    const value: unknown =
      typeof item === "function" && /Loadout$/u.test(name)
        ? (item as (expiresAt: number) => unknown)(INSPECTION_EXPIRES_AT)
        : item;
    if (
      at(value, "schemaVersion") !== 1 ||
      typeof at(value, "loadoutId") !== "string"
    )
      continue;
    rows.push({
      ref: `${ref}#${name}`,
      graph: value as LoadoutGraph,
      environment,
    });
  }
  return rows;
}

export function projectBuilds(
  ctx: ProjectionContext,
  sources: BoardSources,
): BoardSection {
  return ctx.section(
    "saved-builds",
    "Saved builds",
    sources.loadouts,
    "skeleton:loadout-exports",
    (values) => {
      const seen = new Set<string>();
      return values.flatMap(({ graph, environment, ref }): BoardRow[] => {
        const key = canonicalStringify([graph, environment]);
        if (seen.has(key)) return [];
        seen.add(key);
        const evidence = ctx.ref(
          ref,
          "loadout + explicit inspection environment",
        );
        const compiled = compileLoadout(graph, environment);
        if (!compiled.ok)
          return [
            {
              id: id("build", ref),
              title: graph.loadoutId,
              cells: [
                known("compilation", "Compilation", "refused", evidence),
                known(
                  "diagnostics",
                  "Diagnostics",
                  compiled.diagnostics.map((entry) => entry.message),
                  evidence,
                ),
              ],
              links: [],
            },
          ];
        const views = [
          ["code-dsl", defineLoadout(graph)],
          ["function-table", functionTableFromLoadout(graph)],
          ["statechart-json", statechartJsonFromLoadout(graph)],
        ] as const;
        const hashes = views.map(([view, input]) => {
          const result = compileEditableView(input, environment);
          if (!result.ok) throw new Error("editable view failed compilation");
          return known(
            `hash.${view}`,
            `${view} hash`,
            result.semanticHash,
            evidence,
          );
        });
        return [
          {
            id: id("build", ref),
            title: graph.identity.name,
            cells: [
              known("loadout", "Loadout", graph.loadoutId, evidence),
              known(
                "identity",
                "Identity",
                graph.identity.identityId,
                evidence,
              ),
              known("role", "Role", graph.role.name, evidence),
              known(
                "semanticHash",
                "Loadout semantic hash",
                compiled.semanticHash,
                evidence,
              ),
              ...hashes,
              known(
                "hashAgreement",
                "Three views",
                hashes.every((cell) => cell.value === compiled.semanticHash)
                  ? "equivalent"
                  : "different",
                evidence,
              ),
              known(
                "environment",
                "Inspection environment",
                environment.environmentId,
                evidence,
                "Saved build preview; its expiry is a fixed inspection input, not a live grant",
              ),
              known(
                "items",
                "Equipped items",
                [
                  ...graph.activeMechanics.map(
                    (item) => `${item.name} (${item.activeMechanicId})`,
                  ),
                  ...graph.supportFacets
                    .filter((item) =>
                      graph.links.some(
                        (link) => link.supportFacetId === item.supportFacetId,
                      ),
                    )
                    .map((item) => `${item.name} (${item.supportFacetId})`),
                ],
                evidence,
              ),
              known(
                "tooltip",
                "Mechanics and declared costs",
                renderCompiledDiff(undefined, compiled.program),
                evidence,
                "Compiler renderCompiledDiff(undefined, program); original terms remain primary",
              ),
            ],
            links: [],
          },
        ];
      });
    },
  );
}

/** The retained audit report is already a maturity fold. Reconstruct only the
 * selected fixture observations defined by its documented causal-pair method,
 * and prove equality with that fold; never turn a self-host run into live counts. */
export function observationsFromReport(
  value: unknown,
  units?: readonly FeedbackUnit[],
): readonly FeedbackObservation[] {
  const report = object(value);
  if (report["contractVersion"] !== "feedback-audit-v1")
    throw new Error("unsupported maturity report");
  return array(report["fixtures"]).map((item) => {
    const fixture = object(item);
    const unitId = string(fixture["unitId"]);
    const present = object(fixture["present"]),
      removed = object(fixture["removed"]);
    if (
      present["exitCode"] !== 0 ||
      present["passed"] !== 1 ||
      present["failed"] !== 0 ||
      removed["exitCode"] !== 1 ||
      removed["passed"] !== 0 ||
      removed["failed"] !== 1 ||
      !array(removed["captured"]).some(
        (line) => typeof line === "string" && line.includes("ERR_ASSERTION"),
      )
    )
      throw new Error("maturity causal pair unavailable");
    return {
      unitId,
      episodeId: `regression_${unitId}`,
      source: "fixture",
      activated: true,
      prevented: units
        ? units.find((unit) => unit.unitId === unitId)?.enforcement === "hard"
        : true,
      falseActivation: false,
      overridden: false,
    };
  });
}

export function projectMechanisms(
  ctx: ProjectionContext,
  sources: BoardSources,
): BoardSection {
  return ctx.section(
    "compiled-mechanisms",
    "Compiled mechanisms",
    sources.feedbackUnits,
    "skeleton:feedback-units",
    (units, ref) => {
      const program = compileFeedbackUnits(units);
      const maturity = ctx.note(
        sources.maturity ?? {
          ref: "feedback:maturity",
          status: "unavailable",
          reason: "Source not supplied",
        },
      );
      let observations: readonly FeedbackObservation[] | undefined;
      let folded: ReturnType<typeof feedbackMaturity> | undefined;
      let maturityReason =
        maturity.status === "unavailable"
          ? maturity.reason
          : "Maturity report does not match the compiled policy and recorded observations";
      if (maturity.status === "available") {
        try {
          observations = observationsFromReport(maturity.value, units);
          folded = feedbackMaturity(program, observations);
          if (
            at(maturity.value, "policyHash") !== program.policyHash ||
            canonicalStringify(at(maturity.value, "maturity")) !==
              canonicalStringify(folded)
          )
            throw new Error("maturity mismatch");
        } catch {
          observations = undefined;
          folded = undefined;
          ctx.note({
            ref: maturity.ref,
            status: "unavailable",
            reason: maturityReason,
          });
        }
      }
      return program.units.map((unit): BoardRow => {
        const evidence = ctx.ref(ref, `unit:${unit.unitId}@${unit.version}`);
        const mechanism = program.mechanisms.find(
          (item) => item.unitId === unit.unitId,
        )!;
        const row = folded?.find((item) => item.unitId === unit.unitId);
        const countEvidence = ctx.ref(
          maturity.ref,
          `maturity:${unit.unitId}; fixtures:${unit.unitId}`,
        );
        const last = observations
          ?.filter((item) => item.unitId === unit.unitId && item.activated)
          .at(-1);
        const counts = [
          "eligibleEpisodes",
          "activations",
          "incidentsPrevented",
          "falseActivations",
          "overrides",
        ] as const;
        return {
          id: id("mechanism", unit.unitId),
          title: unit.unitId,
          cells: [
            known("version", "Version", unit.version, evidence),
            known(
              "policyHash",
              "Feedback policy hash",
              program.policyHash,
              evidence,
            ),
            known("rung", "Mechanism rung", mechanism.rung, evidence),
            known("mechanism", "Mechanism", mechanism.kind, evidence),
            known("boundary", "Host boundary", unit.trigger, evidence),
            known("scope", "Scope", unit.scope, evidence),
            known(
              "enforcement",
              "Enforcement",
              mechanism.enforcement,
              evidence,
            ),
            known(
              "desiredBehavior",
              "Intended behavior",
              unit.desiredBehavior,
              evidence,
            ),
            known(
              "rationale",
              "Why this rung",
              unit.mechanism.rationale,
              evidence,
            ),
            ...(["fixture", "live"] as const).flatMap((source) => [
              row
                ? known(
                    `${source}.observation`,
                    `${source} observations`,
                    row[source].eligibleEpisodes === 0
                      ? "unobserved"
                      : "observed",
                    countEvidence,
                  )
                : {
                    ...unknown(
                      `${source}.observation`,
                      `${source} observations`,
                      countEvidence,
                      maturityReason,
                    ),
                    status: "unavailable" as const,
                  },
              ...counts.map((key) =>
                row
                  ? known(
                      `${source}.${key}`,
                      `${source} ${key}`,
                      number(row[source][key]),
                      countEvidence,
                    )
                  : {
                      ...unknown(
                        `${source}.${key}`,
                        `${source} ${key}`,
                        countEvidence,
                        maturityReason,
                      ),
                      status: "unavailable" as const,
                    },
              ),
            ]),
            last
              ? known(
                  "lastActivation",
                  "Last recorded activation",
                  `${last.source}: ${last.episodeId}`,
                  countEvidence,
                  "Fixture episode id reconstructed from the audit generator's named causal-pair convention; no activation timestamp was collected",
                )
              : unknown(
                  "lastActivation",
                  "Last recorded activation",
                  countEvidence,
                  folded ? "Unobserved" : maturityReason,
                ),
            known(
              "nextMaturity",
              "Next maturity condition",
              unit.nextMaturityCondition,
              evidence,
            ),
          ],
          links: [],
        };
      });
    },
  );
}
