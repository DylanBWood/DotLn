// Deterministic artifact-store projection, not a live episode. Live source
// labels below model the host's inputs; no provider or application is launched.
import { createHash } from "node:crypto";
import { deliveryContractHash } from "../../lib/github-body.mjs";

export function readinessFixture() {
  const base = "a".repeat(40),
    head = "b".repeat(40);
  const workOrder = {
    workOrderId: "fixture-ready",
    objective: "Render the requested empty state.",
    acceptanceCriteria: ["The empty state is visible."],
    constraints: ["Change only src/view.ts."],
    nonGoals: ["Other screens"],
    requiredEvidence: ["test", "build", "lint"],
  };
  const diff = "diff --git a/src/view.ts b/src/view.ts\n+empty state\n";
  const diffHash = createHash("sha256").update(diff).digest("hex");
  const files = [
    { path: "src/view.ts", contents: "empty state" },
    { path: "CONVENTIONS.md", contents: "Use the existing component." },
  ];
  const evidence = ["test", "build", "lint", "screenshot"].map((id) => ({
    evidenceId: id,
    criterionId: "AC-empty",
    checkId: id,
    subjectRevision: head,
    source: "live",
    outcome: "pass",
    ...(id === "screenshot"
      ? { witness: { kind: "screenshot" } }
      : {
          hostTest: {
            kind: "host-run-test",
            origin: "host",
            command: id,
            exitCode: 0,
          },
        }),
  }));
  const subject = {
    revision: head,
    baseCommit: base,
    diff,
    files,
    snapshot: { contract: workOrder },
    evidence,
  };
  const result = {
    subjectRevision: head,
    baselineRevision: base,
    reviewerEpisodeId: "reviewer",
    verifierEpisodeIds: ["verifier"],
    implementerEpisodeIds: ["implementer"],
    conventionsPath: "CONVENTIONS.md",
    counts: { blocking: 0, should: 0, nit: 0 },
    findings: [],
    requiresHuman: false,
  };
  const changed = [{ path: "src/view.ts", added: 1, deleted: 0 }];
  const bodyInputs = {
    commitMessage: "feat: render the empty state",
    workOrder,
    tests: { before: { exitCode: 1 }, after: { exitCode: 0 } },
    diff: { baseCommit: base, headCommit: head, files: changed },
    matrix: {
      subjectRevision: head,
      rows: [
        { description: workOrder.acceptanceCriteria[0], status: "verified" },
      ],
    },
  };
  const artifacts = {
    current: {
      ref: `commit:${head}`,
      value: { revision: head, expectedRevision: head },
    },
    contract: { ref: "source-event:contract", value: workOrder },
    implementation: {
      ref: "source-event:implementation",
      value: {
        revision: head,
        baseCommit: base,
        diffHash,
        files: changed,
        episodeIds: ["implementer"],
        startedAt: 10,
        repositoryId: "github.com/fixture/target",
      },
    },
    scope: { ref: "source-event:scope", value: { surfaces: ["src/view.ts"] } },
    baseline: {
      ref: "baseline-event:baseline",
      occurredAt: 1,
      value: {
        capsule: {
          subject: {
            revision: base,
            baseCommit: base,
            snapshot: { contract: workOrder },
          },
        },
        outcome: "reproduced",
        limitation: null,
        evidenceIds: ["baseline-test"],
      },
    },
    verification: {
      ref: "verification:behavior",
      value: {
        subjectRevision: head,
        phase: "complete",
        subject,
        evidence,
        implementerEpisodes: ["implementer"],
        rows: [
          {
            criterion: {
              criterionId: "AC-empty",
              description: workOrder.acceptanceCriteria[0],
              claimType: "visual",
              requiredChecks: ["test", "build", "lint", "screenshot"],
            },
            status: "verified",
            evaluations: [
              {
                verdict: "pass",
                stale: false,
                subjectRevision: head,
                episodeId: "verifier",
                evidenceRefs: evidence.map((entry) => entry.evidenceId),
                provenance: { kind: "host-admitted-verifier" },
              },
            ],
          },
        ],
      },
    },
    review: {
      ref: "review-event:review",
      value: { result, subject: structuredClone(subject) },
    },
    preparation: {
      ref: "delivery-preparation",
      value: {
        schemaVersion: 1,
        workOrderId: workOrder.workOrderId,
        subjectRevision: head,
        contractHash: deliveryContractHash(workOrder),
        diffHash,
        unresolvedMaterialAmbiguities: [],
        checks: { tests: ["test"], build: ["build"], lint: ["lint"] },
        monitoring: {
          owner: "fixture-resident",
          repositoryId: "github.com/fixture/target",
          headRevision: head,
          command: "worktree resolve-pr",
          ciFailure: "classify-before-repair",
          reviewComments: "triage-by-type",
          sourceDrift: "stop",
          terminalState: "human-controlled",
        },
      },
    },
    body: { ref: "#acceptance", value: bodyInputs },
  };
  const store = new Map(
    Object.values(artifacts).map((artifact) => [artifact.ref, artifact.value]),
  );
  const resolveRef = (ref) => {
    const [alias, pointer] = ref.split("#/");
    let value = store.get(alias);
    for (const key of pointer?.split("/") ?? []) value = value?.[key];
    return value;
  };
  return { artifacts, bodyInputs, store, resolveRef };
}
