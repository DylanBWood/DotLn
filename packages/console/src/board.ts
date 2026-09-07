import type {
  BoardPanel,
  BoardRow,
  BoardSection,
  BoardSources,
  BoardView,
  RoleAnswer,
} from "./types.js";
import { VIEW_MODEL_VERSION } from "./types.js";
import { ProjectionContext } from "./context.js";
import { projectBuilds, projectMechanisms } from "./builds.js";
import { projectControlActors, projectStore } from "./actors.js";
import { projectWork } from "./work.js";
import { projectBlueprint } from "./blueprint.js";
import { at, id, known, unknown } from "./values.js";

const rolesSource = "docs/product/13-uifa-roles.md#the-five-roles";
export const ROLE_ANSWERS: readonly RoleAnswer[] = [
  {
    role: "product-lead",
    question: "Is this still the thing we mean?",
    target: "refutation-verdicts",
    cell: "verdict + reason; latest-refutation.holdStatus",
    source: rolesSource,
  },
  {
    role: "showrunner",
    question:
      "What is active, what is blocked, what closed, and what did the release contain?",
    target: "orders",
    cell: "phase + blockers + dependencyCheck + legalNextActions; releases.workOrders",
    source: rolesSource,
  },
  {
    role: "engineer",
    question:
      "Does this composition express the behavior I mean, and what does it cost?",
    target: "saved-builds",
    cell: "tooltip + semanticHash + hashAgreement",
    source: rolesSource,
  },
  {
    role: "tester",
    question:
      "In this situation, does the equipped behavior do the right thing?",
    target: "compiled-mechanisms",
    cell: "desiredBehavior + fixture.incidentsPrevented + lastActivation; acceptance matrix status and evidence",
    source: rolesSource,
  },
  {
    role: "devops",
    question: "Which repeated step can become a checked mechanism next?",
    target: "compiled-mechanisms",
    cell: "boundary + rung + nextMaturity; capabilities.Next smallest promotable increment",
    source: rolesSource,
  },
];

/** Pure projection: no clock, filesystem, subprocess, network, or lifecycle fold. */
export function projectBoard(sources: BoardSources): BoardView {
  const ctx = new ProjectionContext();
  const savedBuilds = projectBuilds(ctx, sources);
  const mechanisms = projectMechanisms(ctx, sources);
  const stores = (sources.stores ?? []).map((store) =>
    projectStore(ctx, store),
  );
  const definitions: BoardSection = {
    id: "actor-definitions",
    title: "Saved actor definitions",
    status: savedBuilds.status,
    explanation: savedBuilds.explanation,
    rows: savedBuilds.rows
      .filter((row) => row.cells.some((cell) => cell.key === "identity"))
      .map((row): BoardRow => ({
        id: id("definition", row.id),
        title: row.title,
        cells: [
          known(
            "kind",
            "Actor kind",
            "saved definition",
            row.cells[0]!.evidence,
            "A declared identity and role; not a claim that an episode is running",
          ),
          ...row.cells.filter((cell) =>
            ["identity", "role", "semanticHash"].includes(cell.key),
          ),
          unknown(
            "phase",
            "Episode phase",
            row.cells[0]!.evidence,
            "No episode is implied by a saved build",
          ),
        ],
        links: [{ label: "Inspect saved build", target: row.id }],
      })),
  };
  const actorSections = stores.map((store) => store.actors);
  // Link a verifier's recorded implementer reference across stores only if the
  // episode identifies exactly one actor row. Never equate an entire audit with a verdict.
  for (const source of sources.stores ?? []) {
    if (source.audit.status !== "available") continue;
    for (const event of source.audit.value.governedRaw.events) {
      if (event.type !== "VerificationOpened") continue;
      const episode = at(event.payload, "implementerEpisodeId");
      if (typeof episode !== "string") continue;
      const candidates = actorSections
        .flatMap((section) => section.rows)
        .filter((row) =>
          row.cells.some(
            (cell) => cell.key === "episode" && cell.value === episode,
          ),
        );
      const matrix = stores
        .flatMap((store) => store.matrices.rows)
        .find(
          (row) =>
            row.id === id("matrix", `${source.id}:${event.workstreamId}`),
        );
      if (candidates.length !== 1 || !matrix) continue;
      for (let index = 0; index < actorSections.length; index++) {
        const section = actorSections[index]!;
        actorSections[index] = {
          ...section,
          rows: section.rows.map((row) =>
            row === candidates[0]
              ? {
                  ...row,
                  links: [
                    ...row.links,
                    {
                      label: "Independent acceptance evidence",
                      target: matrix.id,
                    },
                  ],
                }
              : row,
          ),
        };
      }
    }
  }
  if (!actorSections.length)
    actorSections.push({
      id: "episode-actors",
      title: "Recorded episodes",
      status: "unavailable",
      explanation: "No worker or audit store was supplied",
      rows: [],
    });
  const controlActors = projectControlActors(ctx, sources);
  const work = projectWork(ctx, sources);
  const blueprint = projectBlueprint(ctx, sources);
  const panels: readonly BoardPanel[] = [
    {
      id: "actors",
      title: "Actors",
      roles: ["showrunner", "engineer", "tester"],
      question:
        "Who is recorded, what are they equipped to do, and what evidence shows their work?",
      sections: [
        ...actorSections,
        controlActors,
        definitions,
        ...stores.map((store) => store.receipts),
      ],
    },
    {
      id: "builds",
      title: "Builds",
      roles: ["engineer"],
      question: ROLE_ANSWERS[2]!.question,
      sections: [savedBuilds, ...stores.map((store) => store.builds)],
    },
    {
      id: "mechanisms",
      title: "Mechanisms",
      roles: ["tester", "engineer", "devops"],
      question: ROLE_ANSWERS[3]!.question,
      sections: [mechanisms, ...stores.map((store) => store.matrices)],
    },
    {
      id: "work",
      title: "Work",
      roles: ["showrunner", "devops"],
      question: ROLE_ANSWERS[1]!.question,
      sections: work,
    },
    {
      id: "blueprint",
      title: "Blueprint",
      roles: ["product-lead", "devops"],
      question: ROLE_ANSWERS[0]!.question,
      sections: blueprint,
    },
  ];
  const targets = [
    ...panels.flatMap((panel) => [
      panel.id,
      ...panel.sections.flatMap((section) => [
        section.id,
        ...section.rows.map((row) => row.id),
      ]),
    ]),
    ...[...ctx.evidence.values()].map((entry) => entry.id),
  ];
  if (new Set(targets).size !== targets.length)
    throw new Error(
      "board source identities produced duplicate navigation targets",
    );
  const targetSet = new Set(targets);
  for (const row of panels.flatMap((panel) =>
    panel.sections.flatMap((section) => section.rows),
  )) {
    for (const link of row.links)
      if (!targetSet.has(link.target))
        throw new Error("board link has no recorded target");
  }
  return {
    viewModelVersion: VIEW_MODEL_VERSION,
    fidelity: "lossy-read-only",
    panels,
    roleAnswers: ROLE_ANSWERS.map((row) => ({ ...row })),
    sources: [...ctx.sources.values()],
    evidence: [...ctx.evidence.values()],
  };
}
