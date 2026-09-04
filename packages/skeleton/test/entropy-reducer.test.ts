import test from "node:test";
import assert from "node:assert/strict";
import {
  authorize,
  stepProgram,
  type ActIntent,
  type AuthorityEnvelope,
} from "@dotln/kernel";
import {
  ENTROPY_REDUCER_ALLOWED_EFFECTS,
  ENTROPY_REDUCER_DENIED_EFFECTS,
  ENTROPY_REDUCER_WORK_ORDER_ID,
  OutputValidationError,
  buildRefutationReport,
  compileReviewerWorkOrder,
  entropyReducerIdentity,
  entropyReducerLensBriefs,
  entropyReducerLoadout,
  entropyReducerMasks,
  entropyReducerRole,
  entropyReducerSupports,
  lensBriefSchema,
  prepareReportEmit,
  reviewerOutputContract,
  selectFindingsForRefutation,
  validateLensBrief,
  validateLensBriefs,
  validateReviewerOutput,
  type FindingEvidenceLabel,
  type FindingSeverity,
  type ProductSuggestion,
  type ReviewerOutput,
  type VerificationFinding,
} from "../src/loadouts/entropy-reducer.js";

const DISPATCHED_AT = 1_000;
const EPISODE_ENDS_AT = 11_000;
const OUTPUT_EXPECTATION = {
  workOrderId: ENTROPY_REDUCER_WORK_ORDER_ID,
  episodeId: "ep_entropy_test",
} as const;

const compileReviewer = () =>
  compileReviewerWorkOrder({
    repo: "/fixture/repository",
    baseCommit: "fixture-base",
    episodeId: "ep_entropy_test",
    dispatchedAt: DISPATCHED_AT,
    episodeEndsAt: EPISODE_ENDS_AT,
  });

const finding = (
  findingId: string,
  overrides: Readonly<{
    severity?: FindingSeverity;
    evidenceLabel?: FindingEvidenceLabel;
    surface?: string;
  }> = {},
): VerificationFinding => {
  const base = {
    findingId,
    criterion: `Criterion for ${findingId}`,
    severity: overrides.severity ?? "major",
    observed: `Observed ${findingId}`,
    expected: `Expected ${findingId}`,
    evidenceRefs: [`evidence:${findingId}`] as const,
    surface: overrides.surface ?? "packages",
    altitude: 8,
    standardization: { kind: "one-off" } as const,
  };
  return overrides.evidenceLabel === "by inspection"
    ? {
        ...base,
        evidenceLabel: "by inspection",
        reproduction: {
          kind: "inspection",
          steps: [`Inspect ${findingId} independently`] as const,
        },
      }
    : {
        ...base,
        evidenceLabel: "measured",
        reproduction: {
          kind: "command",
          command: `node --test ${findingId}.test.js`,
        },
      };
};

const suggestion = (suggestionId = "SUG-001"): ProductSuggestion => ({
  suggestionId,
  submittedBy: "entropy-reducer@1",
  problemOrOpportunity: "Repeated manual verification exports operator cost.",
  scope: "test harness",
  evidenceRefs: ["finding:F-001"],
  affectedUsers: ["operator"],
  affectedSystems: ["test harness"],
  expectedValue: "Move a recurring review check into executable evidence.",
  altitude: 6,
  uncertainty: "Representative false-positive rate is not yet measured.",
  risks: ["A brittle check could reject valid changes."],
  alternatives: ["Retain the manual review step."],
  duplicationHints: ["Search existing test-harness work orders."],
  urgencyRationale: "Schedule only if this remains the evidenced constraint.",
});

const validOutput = (summary = "Review completed with one finding.") =>
  ({
    schemaVersion: 1,
    findings: [finding("F-001")],
    proposalPackets: [
      {
        schemaVersion: 1,
        kind: "ProductSuggestionPacket",
        proposedPath: "docs/proposals/SUG-001/",
        sourceEpisodeId: "ep_entropy_test",
        provenance: ["episode:ep_entropy_test"],
        corroboratingEvidenceRefs: ["finding:F-001"],
        dissentingEvidenceRefs: [],
        suggestion: suggestion(),
      },
    ],
    resultEnvelope: {
      workOrderId: ENTROPY_REDUCER_WORK_ORDER_ID,
      episodeId: "ep_entropy_test",
      status: "completed",
      resultId: "result_entropy_test",
      summary,
      requiresHuman: true,
    },
    cleanRoom: {
      status: "passed",
      stopConditionsFound: false,
      evidenceRefs: ["screen:clean-room"],
    },
  }) as const satisfies ReviewerOutput;

test("WO-023 AC1 compiles the complete reviewer definition through the real compiler", () => {
  const graph = entropyReducerLoadout(EPISODE_ENDS_AT);
  const compiled = compileReviewer();
  const recompiled = compileReviewer();

  assert.equal(entropyReducerIdentity.identityId, "entropy-reducer");
  assert.equal(entropyReducerIdentity.version, 1);
  assert.equal(entropyReducerRole.roleId, "planning-reviewer");
  assert.equal(entropyReducerRole.policyDeltas[0]?.value, "constraint-first");
  assert.deepEqual(
    entropyReducerMasks.map((mask) => mask.mask),
    ["Whiteface", "Contra-Auguste", "Watcher", "Lazzi"],
  );

  assert.equal(graph.activeMechanics.length, 1);
  assert.deepEqual(graph.activeMechanics[0]?.tags, [
    "observe",
    "research",
    "plan",
    "verify",
    "delegate",
    "narrate",
  ]);
  assert.equal(graph.activeMechanics[0]?.tags.includes("mutate"), false);
  assert.equal(graph.activeMechanics[0]?.tags.includes("destructive"), false);
  assert.equal(graph.supportFacets.length, 8);
  assert.equal(graph.links.length, 8);
  assert.equal(graph.containers[0]?.socketBudget, 8);
  assert.deepEqual(
    graph.supportFacets.map((support) => support.supportFacetId).sort(),
    Object.values(entropyReducerSupports)
      .map((support) => support.supportFacetId)
      .sort(),
  );
  for (const support of graph.supportFacets) {
    assert.ok(support.supportedTags.length > 0);
    assert.ok(support.semanticsAdded.length > 0);
    assert.ok(support.emissions.length > 0);
    assert.equal(support.preservesDeterminism, true);
    assert.ok(Number.isFinite(support.cost.promptTokens));
  }

  assert.deepEqual(Object.keys(compiled.workOrder).sort(), [
    "acceptanceCriteria",
    "allowedOperations",
    "baseCommit",
    "constraints",
    "decisions",
    "knownFacts",
    "nonGoals",
    "objective",
    "outputContract",
    "prohibitedOperations",
    "repo",
    "requiredEvidence",
    "workOrderId",
  ]);
  assert.equal(compiled.workOrder.workOrderId, ENTROPY_REDUCER_WORK_ORDER_ID);
  assert.equal(compiled.workOrder.repo, "/fixture/repository");
  assert.equal(compiled.workOrder.baseCommit, "fixture-base");
  assert.deepEqual(compiled.compileInputs, {
    repo: "/fixture/repository",
    baseCommit: "fixture-base",
    episodeId: "ep_entropy_test",
    dispatchedAt: DISPATCHED_AT,
    episodeEndsAt: EPISODE_ENDS_AT,
  });
  for (const field of [
    "acceptanceCriteria",
    "knownFacts",
    "decisions",
    "constraints",
    "nonGoals",
  ] as const)
    assert.ok(compiled.workOrder[field].length > 0, `${field} is populated`);
  assert.deepEqual(
    compiled.workOrder.allowedOperations,
    compiled.authorityEnvelope.allowedEffects,
  );
  assert.deepEqual(
    compiled.workOrder.prohibitedOperations,
    compiled.authorityEnvelope.deniedEffects,
  );
  assert.deepEqual(compiled.workOrder.allowedOperations, [
    ...ENTROPY_REDUCER_ALLOWED_EFFECTS,
  ]);
  assert.deepEqual(compiled.workOrder.prohibitedOperations, [
    ...ENTROPY_REDUCER_DENIED_EFFECTS,
  ]);
  assert.deepEqual(compiled.workOrder.requiredEvidence, ["reproduction"]);
  assert.deepEqual(compiled.authorityEnvelope.requiredEvidence, []);
  assert.deepEqual(compiled.authorityEnvelope.resourceLimits, {
    delegates: 4,
    probes: 32,
  });
  assert.equal(compiled.authorityEnvelope.expiresAt, EPISODE_ENDS_AT);
  assert.deepEqual(compiled.authorityEnvelope.revocationEventTypes, [
    "OperatorStopRequested",
  ]);
  assert.match(compiled.semanticHash, /^fnv1a64:[0-9a-f]{16}$/u);
  assert.equal(recompiled.semanticHash, compiled.semanticHash);
  assert.deepEqual(recompiled.compiledProgram, compiled.compiledProgram);
  assert.equal(compiled.compiledProgram.compilerVersion, "1");
  assert.deepEqual(compiled.reviewerRequirement, {
    harness: "claude-code",
    model: "claude-fable-5-1",
    displayModel: "Claude Fable 5.1",
    effort: "max",
    substitutionPolicy: "different-reviewer-and-must-be-attested",
  });
  assert.deepEqual(compiled.executionBoundary, {
    mode: "operator-mediated-manual",
    deferredProgramKind: "All",
    commandIds: "symbolic-manual-plan",
    resultBinding: "host-validator",
    resourceEnforcement: "authorize-each-operation-and-thread-envelope",
  });
  assert.equal(compiled.compiledProgram.verificationPlan.length, 1);
  assert.equal(
    compiled.compiledProgram.verificationPlan[0]?.episodeId,
    "entropy-reducer-contra-auguste",
  );
  assert.ok(
    compiled.compiledProgram.schemas.some(
      (schema) =>
        schema.schemaId === "dotln.entropy-reducer.lens-brief.v1" &&
        schema.supportFacetId === "entropy-reducer.fan-out-lens",
    ),
  );
  assert.ok(
    compiled.workOrder.knownFacts.includes(
      "The compiled reviewer is claude-fable-5-1 at max effort; a substitution is a different attested actor",
    ),
  );
});

test("WO-023 AC1 assembles the full deferred Program and once cadence", () => {
  const compiled = compileReviewer();
  assert.deepEqual(compiled.cadence, {
    kind: "Once",
    at: DISPATCHED_AT,
  });
  assert.equal(compiled.program.kind, "Sequence");
  if (compiled.program.kind !== "Sequence") assert.fail("expected Sequence");
  assert.equal(compiled.program.programs.length, 6);
  assert.deepEqual(
    compiled.program.programs.map((program) => program.kind),
    ["Invoke", "All", "Invoke", "Emit", "Emit", "Await"],
  );
  const census = compiled.program.programs[0];
  assert.ok(census?.kind === "Invoke");
  assert.equal(census.command.effect, "repo.read.census");
  assert.deepEqual(Object.keys(census.continuationByResult), ["completed"]);
  assert.deepEqual(census.command.payload, {
    scope: "git-tracked-files",
    mode: "read-only",
    source: "git ls-files -z",
    exclude: ["docs/intake/**"],
  });
  assert.throws(
    () =>
      stepProgram(
        census,
        {},
        { now: DISPATCHED_AT, rngState: 1, predicates: {} },
        {
          schemaVersion: 1,
          eventId: "evt_census_failed",
          type: "CommandResult",
          occurredAt: DISPATCHED_AT,
          actorId: "entropy-reducer",
          workstreamId: "ws_entropy_reducer",
          episodeId: "ep_entropy_test",
          payload: { commandId: census.commandId, result: "failed" },
        },
      ),
    /No Invoke continuation for result failed/u,
  );
  const lenses = compiled.program.programs[1];
  assert.ok(lenses?.kind === "All");
  assert.equal(lenses.programs.length, 4);
  assert.ok(
    lenses.programs.every(
      (program) =>
        program.kind === "Invoke" &&
        program.command.effect === "delegate.readonly" &&
        program.command.resource === "delegates",
    ),
  );
  const probes = compiled.program.programs[2];
  assert.ok(probes?.kind === "Invoke");
  assert.equal(probes.command.effect, "probe.run:scratch.review");
  assert.equal(probes.command.resource, "probes");
  assert.deepEqual(Object.keys(probes.continuationByResult), ["completed"]);
  const findings = compiled.program.programs[3];
  const proposals = compiled.program.programs[4];
  const disposition = compiled.program.programs[5];
  assert.ok(findings?.kind === "Emit");
  assert.equal(findings.event.type, "ReviewFindingsReady");
  assert.ok(proposals?.kind === "Emit");
  assert.equal(proposals.event.type, "ProductSuggestionPacketsReady");
  assert.ok(disposition?.kind === "Await");
  assert.equal(disposition.pattern.type, "OperatorDisposition");
  assert.deepEqual(disposition.timeout, {
    kind: "Once",
    at: EPISODE_ENDS_AT,
  });
});

const act = (effect: string): ActIntent => ({
  kind: "Act",
  effect,
  payload: {},
});

const reviewAuthorizationContext = (
  overrides: Partial<Parameters<typeof authorize>[2]> = {},
): Parameters<typeof authorize>[2] => ({
  now: DISPATCHED_AT,
  actorId: "entropy-reducer",
  workstreamId: "ws_entropy_reducer",
  episodeId: "ep_entropy_test",
  decisionIndex: 1,
  intentIndex: 0,
  evidence: [],
  revokedBy: [],
  ...overrides,
});

const authorizeForReview = (
  effect: string,
  envelope: AuthorityEnvelope = compileReviewer().authorityEnvelope,
) => authorize(act(effect), envelope, reviewAuthorizationContext());

test("WO-023 AC2 wildcard authority grants bounded reads and traces write refusals", () => {
  for (const effect of ["repo.read", "repo.read.file"]) {
    const read = authorizeForReview(effect);
    if (!read.authorized) assert.fail(read.refusal.payload.reason);
    assert.equal(read.authorized, true);
    assert.deepEqual(read.trace.branchPath, ["authorized", effect]);
  }

  for (const effect of [
    "repo.write",
    "repo.write.file",
    "git.mutate",
    "git.mutate.commit",
  ]) {
    const refusal = authorizeForReview(effect);
    assert.equal(refusal.authorized, false);
    if (refusal.authorized) assert.fail(`${effect} unexpectedly authorized`);
    assert.equal(refusal.refusal.payload.reason, "effect denied");
    assert.deepEqual(refusal.trace.branchPath, ["refused", "effect denied"]);
    assert.equal(
      refusal.refusal.payload.authorityEnvelopeId,
      "auth_entropy_reducer",
    );
  }

  const prefixOnly = authorizeForReview("xrepo.read.file");
  assert.equal(prefixOnly.authorized, false);
  if (prefixOnly.authorized)
    assert.fail("unanchored prefix unexpectedly matched");
  assert.equal(prefixOnly.refusal.payload.reason, "effect not allowed");

  const denyWins = authorizeForReview("repo.write.file", {
    ...compileReviewer().authorityEnvelope,
    allowedEffects: ["repo.*"],
    deniedEffects: ["repo.write*"],
  });
  assert.equal(denyWins.authorized, false);
  if (denyWins.authorized) assert.fail("broad allow outranked explicit deny");
  assert.equal(denyWins.refusal.payload.reason, "effect denied");
});

test("WO-023 AC2 threads resource ceilings and enforces expiry, stop, and report emission", () => {
  let envelope = compileReviewer().authorityEnvelope;
  for (const [resource, effect, limit] of [
    ["delegates", "delegate.readonly", 4],
    ["probes", "probe.run:scratch.review", 32],
  ] as const) {
    for (let index = 0; index < limit; index++) {
      const result = authorize(
        { kind: "Act", effect, resource, payload: {} },
        envelope,
        reviewAuthorizationContext({ intentIndex: index }),
      );
      if (!result.authorized) assert.fail(result.refusal.payload.reason);
      envelope = result.authority;
    }
    const exceeded = authorize(
      { kind: "Act", effect, resource, payload: {} },
      envelope,
      reviewAuthorizationContext({ intentIndex: limit }),
    );
    assert.equal(exceeded.authorized, false);
    if (exceeded.authorized)
      assert.fail(`${resource} ceiling was not enforced`);
    assert.equal(exceeded.refusal.payload.reason, "resource limit exceeded");
  }

  const expired = authorize(
    act("repo.read"),
    compileReviewer().authorityEnvelope,
    reviewAuthorizationContext({ now: EPISODE_ENDS_AT }),
  );
  assert.equal(expired.authorized, false);
  if (expired.authorized) assert.fail("expired authority was accepted");
  assert.equal(expired.refusal.payload.reason, "authority expired");

  const stopped = authorize(
    act("repo.read"),
    compileReviewer().authorityEnvelope,
    reviewAuthorizationContext({
      revokedBy: [
        {
          schemaVersion: 1,
          eventId: "evt_operator_stop",
          type: "OperatorStopRequested",
          occurredAt: DISPATCHED_AT,
          actorId: "operator",
          workstreamId: "ws_entropy_reducer",
          episodeId: "ep_entropy_test",
          payload: {},
        },
      ],
    }),
  );
  assert.equal(stopped.authorized, false);
  if (stopped.authorized) assert.fail("operator stop did not revoke authority");
  assert.equal(stopped.refusal.payload.reason, "authority revoked");

  const prepared = prepareReportEmit(validOutput(), OUTPUT_EXPECTATION);
  const emitted = authorize(
    prepared.intent,
    compileReviewer().authorityEnvelope,
    reviewAuthorizationContext(),
  );
  if (!emitted.authorized) assert.fail(emitted.refusal.payload.reason);
  assert.equal(emitted.authorized, true);
  assert.equal(emitted.command.intent.effect, "report.emit");
});

test("WO-023 AC2 validates findings and clean-room status before constructing report.emit", () => {
  const missingReproduction = structuredClone(validOutput()) as unknown as {
    findings: Array<Record<string, unknown>>;
  };
  delete missingReproduction.findings[0]?.["reproduction"];
  assert.throws(
    () => prepareReportEmit(missingReproduction, OUTPUT_EXPECTATION),
    (error: unknown) =>
      error instanceof OutputValidationError &&
      error.message === "finding.reproduction must be an object",
  );

  const failedScreen = structuredClone(validOutput()) as unknown as {
    cleanRoom: Record<string, unknown>;
  };
  failedScreen.cleanRoom["status"] = "failed";
  assert.throws(
    () => prepareReportEmit(failedScreen, OUTPUT_EXPECTATION),
    /clean-room result must pass with no stop conditions before report\.emit/u,
  );

  const prepared = prepareReportEmit(validOutput(), OUTPUT_EXPECTATION);
  assert.equal(prepared.intent.kind, "Act");
  assert.equal(prepared.intent.effect, "report.emit");
  assert.deepEqual(prepared.output.findings[0]?.reproduction, {
    kind: "command",
    command: "node --test F-001.test.js",
  });

  const mismatchedEvidence = structuredClone(validOutput()) as unknown as {
    findings: Array<Record<string, unknown>>;
  };
  mismatchedEvidence.findings[0]!["reproduction"] = {
    kind: "inspection",
    steps: ["Read the file"],
  };
  assert.throws(
    () => prepareReportEmit(mismatchedEvidence, OUTPUT_EXPECTATION),
    /measured finding requires command reproduction/u,
  );
});

test("WO-023 AC4 enforces every lens-brief field, no-fix, uniqueness, and the four-brief ceiling", () => {
  const valid = entropyReducerLensBriefs[0]!;
  assert.deepEqual(validateLensBrief(valid), valid);
  assert.equal(lensBriefSchema.properties.files.items.minLength, 1);
  assert.equal(lensBriefSchema.properties.questions.items.minLength, 1);
  assert.equal(lensBriefSchema.properties.outputShape.items.minLength, 1);
  for (const field of [
    "lensId",
    "files",
    "questions",
    "outputShape",
    "wordBudget",
    "noFix",
  ] as const) {
    const candidate = structuredClone(valid) as unknown as Record<
      string,
      unknown
    >;
    delete candidate[field];
    assert.throws(() => validateLensBrief(candidate), {
      name: "OutputValidationError",
    });
  }
  assert.throws(
    () => validateLensBrief({ ...valid, noFix: false }),
    /noFix must be true/u,
  );
  assert.throws(
    () =>
      validateLensBriefs([
        ...entropyReducerLensBriefs,
        { ...valid, lensId: "fifth-lens" },
      ]),
    /exceeds compiled delegate limit 4/u,
  );
  assert.throws(
    () => validateLensBriefs([valid, valid]),
    /lens brief ids must be unique/u,
  );
  assert.equal(compileReviewer().lensBriefs.length, 4);
  assert.ok(
    entropyReducerLensBriefs.every(
      (brief) =>
        !(brief.files as readonly string[]).includes("docs/") &&
        brief.files.every((file) => !file.startsWith("docs/intake")),
    ),
    "default review scopes must not include ignored intake",
  );
  for (const scope of [
    "docs/",
    "docs/intake/",
    "docs//intake/",
    "Docs/Intake/",
    "DOCS//INTAKE/",
    "./docs/intake/",
    "../outside/",
    "/absolute/",
  ])
    assert.throws(
      () => validateLensBrief({ ...valid, files: [scope] }),
      /unsafe or intake-bearing scope/u,
    );
  assert.throws(
    () =>
      compileReviewerWorkOrder({
        repo: "/fixture/repository",
        baseCommit: "fixture-base",
        episodeId: "ep_entropy_test",
        dispatchedAt: DISPATCHED_AT,
        episodeEndsAt: EPISODE_ENDS_AT,
        lensBriefs: [{ ...valid, files: ["docs/intake/"] }],
      }),
    /unsafe or intake-bearing scope/u,
  );
});

test("WO-023 AC5 validates ProductSuggestion packets and enforces a summary under 200 words", () => {
  const contractProperties = reviewerOutputContract.properties;
  assert.deepEqual(Object.keys(contractProperties).sort(), [
    "cleanRoom",
    "findings",
    "proposalPackets",
    "resultEnvelope",
    "schemaVersion",
  ]);
  assert.ok(
    "properties" in contractProperties.proposalPackets.items,
    "proposal packet schema declares its required properties",
  );
  assert.ok(
    "properties" in contractProperties.resultEnvelope,
    "result envelope schema declares its required properties",
  );
  assert.equal(
    JSON.stringify(reviewerOutputContract).includes("maxWordCountExclusive"),
    false,
    "the transport schema uses only declared standard vocabulary",
  );
  const packetSchema = contractProperties.proposalPackets.items;
  assert.ok("properties" in packetSchema);
  const packetProperties = packetSchema.properties;
  assert.match(packetProperties.proposedPath.pattern, /^\^docs\/proposals\//u);
  const suggestionSchema = packetProperties.suggestion;
  assert.ok("properties" in suggestionSchema);
  for (const field of ["risks", "alternatives", "duplicationHints"] as const)
    assert.equal(suggestionSchema.properties[field].items.minLength, 1);
  const findingContract = contractProperties.findings.items;
  assert.ok("oneOf" in findingContract);
  assert.equal(findingContract.oneOf.length, 2);
  assert.deepEqual(
    validateReviewerOutput(validOutput(), OUTPUT_EXPECTATION),
    validOutput(),
  );
  const oneHundredNinetyNine = Array.from(
    { length: 199 },
    (_, index) => `word${index}`,
  ).join(" ");
  assert.equal(
    validateReviewerOutput(
      validOutput(oneHundredNinetyNine),
      OUTPUT_EXPECTATION,
    ).resultEnvelope.summary,
    oneHundredNinetyNine,
  );
  const twoHundred = `${oneHundredNinetyNine} word199`;
  assert.throws(
    () => validateReviewerOutput(validOutput(twoHundred), OUTPUT_EXPECTATION),
    /fewer than 200 words/u,
  );

  const wrongPath = structuredClone(validOutput()) as unknown as {
    proposalPackets: Array<Record<string, unknown>>;
  };
  wrongPath.proposalPackets[0]!["proposedPath"] = "docs/work-orders/SUG-001.md";
  assert.throws(
    () => validateReviewerOutput(wrongPath, OUTPUT_EXPECTATION),
    /docs\/proposals\/<suggestionId>\//u,
  );

  const traversingPath = structuredClone(validOutput()) as unknown as {
    proposalPackets: Array<Record<string, unknown>>;
  };
  const traversingSuggestion = traversingPath.proposalPackets[0]![
    "suggestion"
  ] as Record<string, unknown>;
  traversingSuggestion["suggestionId"] = "../work-orders/escape";
  traversingPath.proposalPackets[0]!["proposedPath"] =
    "docs/proposals/../work-orders/escape/";
  assert.throws(
    () => validateReviewerOutput(traversingPath, OUTPUT_EXPECTATION),
    /safe single path segment/u,
  );

  const blankOptionalItem = structuredClone(validOutput()) as unknown as {
    proposalPackets: Array<{ suggestion: { risks: string[] } }>;
  };
  blankOptionalItem.proposalPackets[0]!.suggestion.risks = [" "];
  assert.throws(
    () => validateReviewerOutput(blankOptionalItem, OUTPUT_EXPECTATION),
    /array of non-empty strings/u,
  );

  const wrongEpisode = structuredClone(validOutput()) as unknown as {
    resultEnvelope: Record<string, unknown>;
  };
  wrongEpisode.resultEnvelope["episodeId"] = "ep_other";
  assert.throws(
    () => validateReviewerOutput(wrongEpisode, OUTPUT_EXPECTATION),
    /result envelope\.episodeId must be ep_entropy_test/u,
  );
});

const findingGrid = (
  count: number,
  evidenceLabel: FindingEvidenceLabel,
): readonly VerificationFinding[] => {
  const surfaces = ["compiler", "skeleton", "docs"] as const;
  const severities = [
    "blocking",
    "major",
    "minor",
  ] as const satisfies readonly FindingSeverity[];
  return Array.from({ length: count }, (_, index) =>
    finding(`F-${String(index + 1).padStart(2, "0")}`, {
      evidenceLabel,
      surface: surfaces[index % surfaces.length]!,
      severity: severities[index % severities.length]!,
    }),
  );
};

test("WO-023 AC6 selects every measured finding and reports zero denominators as not-applicable", () => {
  const measured = findingGrid(3, "measured");
  const selection = selectFindingsForRefutation(measured);
  assert.equal(selection.measuredDenominator, 3);
  assert.equal(selection.measuredStatus, "selected");
  assert.equal(selection.inspectionDenominator, 0);
  assert.equal(selection.inspectionStatus, "not-applicable");
  assert.equal(selection.inspectionSampleSize, 0);
  assert.deepEqual(
    new Set(selection.selectedFindingIds),
    new Set(measured.map((entry) => entry.findingId)),
  );
  assert.deepEqual(selection.measuredSubjects[0], {
    findingId: "F-01",
    command: "node --test F-01.test.js",
  });
  assert.deepEqual(Object.keys(selection.measuredSubjects[0]!).sort(), [
    "command",
    "findingId",
  ]);

  assert.deepEqual(selectFindingsForRefutation([]), {
    measuredDenominator: 0,
    measuredStatus: "not-applicable",
    inspectionDenominator: 0,
    inspectionStatus: "not-applicable",
    inspectionSampleSize: 0,
    selectionRule: "every measured finding and every by-inspection finding",
    measuredSubjects: [],
    inspectionSubjects: [],
    selectedFindingIds: [],
  });
});

test("WO-023 AC6 examines all six-or-fewer inspection findings and deterministically stratifies larger sets", () => {
  const six = findingGrid(6, "by inspection");
  const all = selectFindingsForRefutation(six);
  assert.equal(all.inspectionStatus, "all");
  assert.equal(all.inspectionSampleSize, 6);
  assert.deepEqual(
    new Set(all.selectedFindingIds),
    new Set(six.map((entry) => entry.findingId)),
  );

  const seven = selectFindingsForRefutation(findingGrid(7, "by inspection"));
  assert.equal(seven.inspectionSampleSize, 6);

  const surfaces = ["compiler", "docs", "skeleton"] as const;
  const severities = ["blocking", "major", "minor"] as const;
  const crossed = surfaces.flatMap((surface) =>
    severities.flatMap((severity) =>
      [1, 2].map((ordinal) =>
        finding(`${surface}-${severity}-${ordinal}`, {
          evidenceLabel: "by inspection",
          surface,
          severity,
        }),
      ),
    ),
  );
  const nineteen = [
    ...crossed,
    finding("compiler-blocking-3", {
      evidenceLabel: "by inspection",
      surface: "compiler",
      severity: "blocking",
    }),
  ];
  const selected = selectFindingsForRefutation(nineteen);
  const permuted = selectFindingsForRefutation([...nineteen].reverse());
  assert.equal(selected.inspectionStatus, "sampled");
  assert.equal(selected.inspectionDenominator, 19);
  assert.equal(selected.inspectionSampleSize, 7);
  assert.ok(selected.inspectionSampleSize >= Math.ceil(19 / 3));
  assert.deepEqual(permuted, selected);
  assert.deepEqual(selected.selectedFindingIds, [
    "compiler-blocking-1",
    "compiler-major-1",
    "compiler-minor-1",
    "docs-blocking-1",
    "docs-major-1",
    "docs-minor-1",
    "skeleton-blocking-1",
  ]);
});

test("WO-023 AC6 keeps failed findings attributable but removes them from the promoted set", () => {
  const findings = [
    finding("F-001", { evidenceLabel: "measured" }),
    finding("F-002", { evidenceLabel: "by inspection" }),
  ];
  const report = buildRefutationReport(findings, [
    {
      findingId: "F-001",
      result: "refuted",
      reason: "The command passed after the claimed failure was isolated.",
      evidenceRefs: ["refutation:F-001"],
    },
    {
      findingId: "F-002",
      result: "survived",
      reason: "Independent inspection reproduced the mismatch.",
      evidenceRefs: ["refutation:F-002"],
    },
  ]);
  assert.deepEqual(report.refutedFindingIds, ["F-001"]);
  assert.deepEqual(report.promotedFindingIds, ["F-002"]);
  assert.deepEqual(report.blockedFindingIds, []);
  assert.deepEqual(report.unselectedFindingIds, []);
  assert.equal(report.attempts[0]?.reproduction, findings[0]?.reproduction);
  assert.equal(report.attempts[0]?.result, "refuted");
  assert.throws(
    () => buildRefutationReport(findings, []),
    /missing refutation attempts/u,
  );
  assert.throws(
    () =>
      buildRefutationReport(findings, [
        {
          findingId: "F-001",
          result: "passed",
          reason: "Unrecognized result vocabulary must not cross the boundary.",
          evidenceRefs: ["refutation:F-001"],
        },
      ]),
    /must be survived, refuted, or blocked/u,
  );
  assert.throws(
    () =>
      buildRefutationReport(findings, [
        {
          findingId: "F-001",
          result: "survived",
          reason: "The model added an undeclared field.",
          evidenceRefs: ["refutation:F-001"],
          confidence: 1,
        },
      ]),
    /unexpected fields/u,
  );

  const allRefuted = buildRefutationReport(
    findings,
    findings.map((entry) => ({
      findingId: entry.findingId,
      result: "refuted",
      reason: "Independent reproduction disproved the claim.",
      evidenceRefs: [`refutation:${entry.findingId}`],
    })),
  );
  assert.deepEqual(allRefuted.promotedFindingIds, []);
  assert.deepEqual(allRefuted.refutedFindingIds, ["F-001", "F-002"]);

  const empty = buildRefutationReport([], []);
  assert.equal(empty.selection.measuredStatus, "not-applicable");
  assert.equal(empty.selection.inspectionStatus, "not-applicable");
  assert.deepEqual(empty.promotedFindingIds, []);
  assert.deepEqual(empty.blockedFindingIds, []);
  assert.deepEqual(empty.unselectedFindingIds, []);

  const blocked = buildRefutationReport(
    [findings[0]!],
    [
      {
        findingId: "F-001",
        result: "blocked",
        reason: "The independent fixture could not be constructed safely.",
        evidenceRefs: ["refutation:F-001:blocked"],
      },
    ],
  );
  assert.deepEqual(blocked.promotedFindingIds, []);
  assert.deepEqual(blocked.blockedFindingIds, ["F-001"]);
});
