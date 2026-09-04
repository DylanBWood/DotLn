import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { semanticHash, type LoadoutGraph } from "@dotln/compiler";
import {
  ENTROPY_REDUCER_REFERENCE_EPISODE_ENDS_AT,
  buildRefutationReport,
  compileReviewerWorkOrder,
  entropyReducerLoadout,
  referenceEntropyReducerResidue,
  renderEntropyReducerResidue,
  validateReviewerOutput,
} from "../src/loadouts/entropy-reducer.js";

const trackedResidueUrl = new URL(
  "../../../../docs/instance/entropy-reducer/RESIDUE.md",
  import.meta.url,
);
const reviewRunUrl = new URL(
  "../../../../docs/instance/entropy-reducer/runs/REVIEW-001.json",
  import.meta.url,
);
const reviewedProgramUrl = new URL(
  "../../../../docs/instance/entropy-reducer/runs/REVIEW-001-COMPILED-PROGRAM.json",
  import.meta.url,
);
const refutationRunUrl = new URL(
  "../../../../docs/instance/entropy-reducer/runs/REFUTATION-001.json",
  import.meta.url,
);

test("WO-023 AC3 regeneration byte-matches the sole tracked residue projection", async () => {
  const tracked = await readFile(trackedResidueUrl, "utf8");
  const generated = referenceEntropyReducerResidue();
  assert.equal(generated, tracked);
  assert.equal(generated.endsWith("\n"), true);
  assert.equal(generated.includes("\r"), false);
  assert.notEqual(
    `${tracked.slice(0, -1)}x\n`,
    generated,
    "a one-byte hand edit cannot pass regeneration",
  );
});

test("WO-023 AC3 every linked support owns exactly one generated paragraph", () => {
  const graph = entropyReducerLoadout(
    ENTROPY_REDUCER_REFERENCE_EPISODE_ENDS_AT,
  );
  const generated = renderEntropyReducerResidue(graph);
  const linkedIds = graph.links.map((link) => link.supportFacetId);
  const markers = [...generated.matchAll(/^<!-- support:([^\n]+) -->$/gmu)].map(
    (match) => match[1]!,
  );
  assert.deepEqual(markers, linkedIds);
  assert.equal(new Set(markers).size, graph.links.length);
  for (const support of graph.supportFacets) {
    assert.equal(
      support.emissions.filter(
        (emission) => emission.kind === "prompt-fragment",
      ).length,
      1,
      `${support.supportFacetId} contributes one prompt fragment`,
    );
    const marker = `<!-- support:${support.supportFacetId} -->\n\n`;
    assert.equal(generated.split(marker).length - 1, 1);
    const after = generated.split(marker)[1]!;
    const paragraph = after.slice(0, after.indexOf("\n\n"));
    assert.match(paragraph, /^\*\*[^\n]+$/u);
  }
});

test("WO-023 AC3 unordered graph permutations preserve residue bytes", () => {
  const graph = entropyReducerLoadout(
    ENTROPY_REDUCER_REFERENCE_EPISODE_ENDS_AT,
  );
  const permuted: LoadoutGraph = {
    ...graph,
    supportFacets: [...graph.supportFacets].reverse(),
    links: [...graph.links].reverse(),
  };
  assert.equal(
    renderEntropyReducerResidue(permuted),
    renderEntropyReducerResidue(graph),
  );
});

test("WO-023 AC3 a semantic edit to every support changes generated residue", () => {
  const graph = entropyReducerLoadout(
    ENTROPY_REDUCER_REFERENCE_EPISODE_ENDS_AT,
  );
  const baseline = renderEntropyReducerResidue(graph);
  graph.supportFacets.forEach((support, supportIndex) => {
    const clone = structuredClone(graph) as LoadoutGraph;
    const mutated: LoadoutGraph = {
      ...clone,
      supportFacets: clone.supportFacets.map((candidate, index) =>
        index === supportIndex
          ? {
              ...candidate,
              semanticsAdded: [
                ...candidate.semanticsAdded,
                `semantic mutation for ${support.supportFacetId}`,
              ],
            }
          : candidate,
      ),
    };
    assert.notEqual(
      renderEntropyReducerResidue(mutated),
      baseline,
      support.supportFacetId,
    );
  });

  for (const field of ["requiredCapabilities", "conflictsWith"] as const) {
    const clone = structuredClone(graph) as LoadoutGraph;
    const first = clone.supportFacets[0]!;
    const mutated: LoadoutGraph = {
      ...clone,
      supportFacets: [
        { ...first, [field]: [`mutation:${field}`] },
        ...clone.supportFacets.slice(1),
      ],
    };
    assert.notEqual(renderEntropyReducerResidue(mutated), baseline, field);
  }

  const emissionMutations = [
    (candidate: LoadoutGraph) => {
      const emission = candidate.supportFacets[0]!.emissions[0] as unknown as {
        order: number;
      };
      emission.order += 1;
    },
    (candidate: LoadoutGraph) => {
      const emission = candidate.supportFacets[1]!.emissions[0] as unknown as {
        schema: Record<string, unknown>;
      };
      emission.schema["mutation"] = true;
    },
    (candidate: LoadoutGraph) => {
      const emission = candidate.supportFacets[3]!.emissions[0] as unknown as {
        required: boolean;
      };
      emission.required = false;
    },
    (candidate: LoadoutGraph) => {
      const emission = candidate.supportFacets[7]!.emissions[0] as unknown as {
        outputContract: Record<string, unknown>;
      };
      emission.outputContract["mutation"] = true;
    },
  ];
  emissionMutations.forEach((mutate, index) => {
    const candidate = structuredClone(graph) as LoadoutGraph;
    mutate(candidate);
    assert.notEqual(
      renderEntropyReducerResidue(candidate),
      baseline,
      `emission mutation ${index + 1}`,
    );
  });

  const costMutation = structuredClone(graph) as LoadoutGraph;
  const firstCost = costMutation.supportFacets[0]!.cost as unknown as {
    mechanismType: string;
  };
  firstCost.mechanismType = "prompt-fragment";
  assert.notEqual(
    renderEntropyReducerResidue(costMutation),
    baseline,
    "cost.mechanismType",
  );
});

test("WO-023 AC3 identity, role, and active stance all flow into generated residue", () => {
  const graph = entropyReducerLoadout(
    ENTROPY_REDUCER_REFERENCE_EPISODE_ENDS_AT,
  );
  const baseline = renderEntropyReducerResidue(graph);
  const mutations: readonly ((candidate: LoadoutGraph) => void)[] = [
    (candidate) => {
      (candidate.identity.dispositions as string[]).push(
        "mutation:disposition",
      );
    },
    (candidate) => {
      (candidate.identity.invariants as string[]).push("mutation:invariant");
    },
    (candidate) => {
      (candidate.role.obligations as string[]).push("mutation:obligation");
    },
    (candidate) => {
      (candidate.activeMechanics[0]!.semantics as string[]).push(
        "mutation:semantics",
      );
    },
    (candidate) => {
      (candidate.activeMechanics[0]!.workOrder.constraints as string[]).push(
        "mutation:constraint",
      );
    },
  ];
  mutations.forEach((mutate, index) => {
    const candidate = structuredClone(graph) as LoadoutGraph;
    mutate(candidate);
    assert.notEqual(
      renderEntropyReducerResidue(candidate),
      baseline,
      `stance mutation ${index + 1}`,
    );
  });
});

test("WO-023 AC3 malformed support participation cannot render a plausible residue", () => {
  const graph = entropyReducerLoadout(
    ENTROPY_REDUCER_REFERENCE_EPISODE_ENDS_AT,
  );
  assert.throws(
    () =>
      renderEntropyReducerResidue({
        ...graph,
        links: [...graph.links, graph.links[0]!],
      }),
    /each linked support exactly once/u,
  );
  assert.throws(
    () =>
      renderEntropyReducerResidue({
        ...graph,
        supportFacets: graph.supportFacets.slice(1),
      }),
    /linked support .* is missing/u,
  );
});

test("WO-023 AC3 residue generation is pure and cannot read the tracked projection", async () => {
  const source = await readFile(
    fileURLToPath(
      new URL("../../src/loadouts/entropy-reducer.ts", import.meta.url),
    ),
    "utf8",
  );
  assert.doesNotMatch(source, /node:fs|readFile|writeFile|RESIDUE\.md/u);
});

test("WO-023 AC7 review receipt preserves the pinned actor, exact compile inputs, and immutable subject", async () => {
  const receipt = JSON.parse(await readFile(reviewRunUrl, "utf8")) as any;
  const reviewedProgram = JSON.parse(
    await readFile(reviewedProgramUrl, "utf8"),
  ) as any;
  assert.equal(receipt.kind, "EntropyReducerReviewRun");
  assert.equal(receipt.phase, "pre-repair implementation review");
  assert.deepEqual(receipt.subject.compileInputs, {
    repo: "/private/tmp/dotln-wo023-review.39AMcD/repo",
    baseCommit: "e3e639fea0c7566e9aa9418dc231bea6b36f4dd7",
    episodeId: "ep_entropy_reducer_20260904_001",
    dispatchedAt: 1788539400000,
    episodeEndsAt: 1788546600000,
  });
  assert.equal(receipt.compilation.semanticHash, "fnv1a64:b81d0609ee2e9fed");
  assert.equal(
    receipt.compilation.compiledProgramRef,
    "docs/instance/entropy-reducer/runs/REVIEW-001-COMPILED-PROGRAM.json",
  );
  assert.equal(
    semanticHash(reviewedProgram),
    receipt.compilation.semanticHash,
    "the committed reviewed program is an independently hashable preimage",
  );
  assert.equal(
    reviewedProgram.workOrder.repo,
    receipt.subject.compileInputs.repo,
  );
  assert.equal(
    reviewedProgram.workOrder.baseCommit,
    receipt.subject.compileInputs.baseCommit,
  );
  assert.equal(
    reviewedProgram.authorityEnvelope.expiresAt,
    receipt.subject.compileInputs.episodeEndsAt,
  );
  assert.deepEqual(
    {
      harness: receipt.actorAttestation.harness,
      model: receipt.actorAttestation.model,
      effort: receipt.actorAttestation.effort,
    },
    { harness: "claude-code", model: "claude-fable-5-1", effort: "max" },
  );
  assert.equal(receipt.subject.sourceStatusByteIdentical, true);
  assert.equal(receipt.subject.scratchStatusByteIdentical, true);
  assert.equal(receipt.confinement.scratchInventory.deltaCount, 75);
  assert.ok(
    receipt.confinement.scratchInventory.deltaPaths.every((path: string) =>
      /^packages\/(?:kernel|compiler|skeleton)\/dist\//u.test(path),
    ),
  );
  assert.equal(receipt.confinement.intakeInventory.byteMetadataIdentical, true);
  assert.equal(
    receipt.disposition.proposalFiling,
    "not authorized and not filed",
  );
  assert.deepEqual(
    validateReviewerOutput(receipt.reviewerOutput, {
      workOrderId: "wo_entropy_review_1",
      episodeId: "ep_entropy_reducer_20260904_001",
    }),
    receipt.reviewerOutput,
  );
  assert.equal(
    compileReviewerWorkOrder(receipt.subject.compileInputs).semanticHash,
    "fnv1a64:eefe230707d23735",
    "the repaired subject is explicitly repinned rather than rewriting the reviewed hash",
  );
});

test("WO-023 AC6 refutation receipt rebuilds exactly and promotes only survived findings", async () => {
  const review = JSON.parse(await readFile(reviewRunUrl, "utf8")) as any;
  const refutation = JSON.parse(
    await readFile(refutationRunUrl, "utf8"),
  ) as any;
  const rebuilt = buildRefutationReport(
    review.reviewerOutput.findings,
    refutation.rawOutput.attempts,
  );
  assert.deepEqual(rebuilt, refutation.report);
  assert.deepEqual(refutation.report.promotedFindingIds, [
    "ER-002",
    "ER-003",
    "ER-001",
    "ER-004",
    "ER-005",
    "ER-006",
    "ER-007",
  ]);
  assert.deepEqual(refutation.report.refutedFindingIds, []);
  assert.deepEqual(refutation.report.blockedFindingIds, []);
  assert.deepEqual(refutation.report.unselectedFindingIds, []);
  assert.equal(refutation.confinement.subject.sourceStatusByteIdentical, true);
  assert.equal(refutation.confinement.subject.scratchStatusByteIdentical, true);
  assert.equal(refutation.confinement.scratchInventory.deltaCount, 0);
  assert.equal(
    refutation.confinement.intakeInventory.byteMetadataIdentical,
    true,
  );
});
