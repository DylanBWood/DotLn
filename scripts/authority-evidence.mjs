#!/usr/bin/env node
import { docRelative, findLaunchpad } from "./lib/config.mjs";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import {
  evidenceArgs,
  sameEvidenceSourceContent,
} from "../packages/skeleton/src/evidence-editions.mjs";
import { evidenceSources } from "./lib/evidence-sources.mjs";
import {
  COMPOSITION_PRECEDENCE,
  COMPILER_PACKAGE_VERSION,
  assertCompiledFeedback,
  canonicalStringify,
  compileEditableView,
  compileLoadout,
  defineLoadout,
  functionTableFromLoadout,
  projectAuthorityInspection,
  renderCompiledDiff,
  requireCompiled,
  seiriEnvironment,
  seiriLoadout,
  statechartJsonFromLoadout,
} from "@dotln/compiler";
import { authorize } from "@dotln/kernel";
import {
  authorityFixture,
  authorityGrant,
  authoritySupport,
} from "../packages/compiler/dist/test/authority-fixture.js";
import { entropyReducerLoadout } from "../packages/skeleton/dist/src/loadouts/entropy-reducer.js";
import {
  CONTRIBUTOR_MISSION_POLICY,
  contributorLoadout,
  contributorLoadoutBeforeMissionCheck,
  contributorProgram,
} from "../packages/skeleton/dist/src/loadouts/contributor.js";
import {
  defaultExecutorSupportIds,
  executorSupports,
} from "../packages/skeleton/dist/src/loadouts/executor-supports.js";
import {
  compilePlanRefuter,
  planRefuterLoadout,
} from "../packages/skeleton/dist/src/loadouts/plan-refuter.js";
import { checkHarness, harnessInstallation } from "./lib/harness.mjs";

const root = findLaunchpad();
const { args, selection } = evidenceArgs(
  root,
  "authority",
  process.argv.slice(2),
);
const [mode] = args;
assert.ok(
  args.length === 1 && ["--write", "--check"].includes(mode),
  "usage: authority-evidence.mjs --write|--check [--edition WO-NNN] [--revision NNN] (build and emit the bundle first)",
);
const editionLabel = selection.label;
const directory = pathToFileURL(`${join(root, selection.directory)}/`);
const read = (path) => readFileSync(join(root, path), "utf8");
const baseline = JSON.parse(
  read(docRelative(root, "evidence", "WO-042/authority-baseline.json")),
);
const digest = (contents) =>
  `sha256:${createHash("sha256").update(contents).digest("hex")}`;
const hash = (value) => digest(canonicalStringify(value));
const git = (...args) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
const prior = (path) => git("show", `${baseline.sourceRevision}:${path}`);
const results = {
  seiri: compileLoadout(seiriLoadout, seiriEnvironment()),
  entropy: compileLoadout(
    entropyReducerLoadout(11000),
    baseline.fixtures.entropy.artifactIdentity.compilationEnvironment,
  ),
  contributor: compileLoadout(
    contributorLoadout,
    baseline.fixtures.contributor.artifactIdentity.compilationEnvironment,
  ),
  planRefuter: compilePlanRefuter("fixture", 0),
};
// Reconstruct each historical subject before comparing its authorized migration.
const entropyFixturePath =
  "packages/compiler/fixtures/wo029-entropy-reducer.json";
const oldEntropyGraph = JSON.parse(prior(entropyFixturePath));
const shapeFirstId = "entropy-reducer.shape-first";
const oldShapeFirst = oldEntropyGraph.supportFacets.find(
  (support) => support.supportFacetId === shapeFirstId,
);
assert.equal(oldShapeFirst.version, 1);
// WO-100 (operator scope expansion, WO-100-D007): the compiled reviewer moved
// from Claude Fable 5.1 at max to Claude Opus 5.5 at xhigh, versioning Seisō.
const seisoId = "seiso-shine";
const oldReviewerFact =
  "The compiled reviewer is claude-fable-5-1 at max effort; a substitution is a different attested actor";
const newReviewerFact =
  "The compiled reviewer is claude-opus-5-5 at xhigh effort; a substitution is a different attested actor";
const migrateReviewer = (workOrder) => {
  assert.equal(
    workOrder.knownFacts.filter((fact) => fact === oldReviewerFact).length,
    1,
    "historical entropy reviewer fact",
  );
  return {
    ...workOrder,
    knownFacts: workOrder.knownFacts.map((fact) =>
      fact === oldReviewerFact ? newReviewerFact : fact,
    ),
  };
};
const migratedEntropyGraph = {
  ...oldEntropyGraph,
  activeMechanics: oldEntropyGraph.activeMechanics.map((active) =>
    active.activeMechanicId !== seisoId
      ? active
      : {
          ...active,
          version: 2,
          workOrder: migrateReviewer(active.workOrder),
        },
  ),
  supportFacets: oldEntropyGraph.supportFacets.map((support) =>
    support.supportFacetId !== shapeFirstId
      ? support
      : {
          ...support,
          version: 2,
          semanticsAdded: [
            "transfer an operator analogy's intended relationship before evaluating load-bearing literal details",
          ],
          emissions: support.emissions.map((emission, index) =>
            index === 0
              ? {
                  ...emission,
                  text: "For an operator analogy, extract the intended relationship first and carry that useful relation across mechanisms; evaluate a literal detail only when a claim depends on it.",
                }
              : emission,
          ),
          inspection: {
            ...support.inspection,
            obligations: [
              "Preserve the intended relationship first; examine literal details only when load-bearing",
            ],
          },
        },
  ),
};
assert.equal(
  canonicalStringify(entropyReducerLoadout(11000)),
  canonicalStringify(migratedEntropyGraph),
  "WO-142 changes only Shape-First version, semantic phrase, prompt fragment and inspection obligation; WO-100 only the compiled reviewer fact and Seisō's version",
);
assert.equal(
  canonicalStringify(JSON.parse(read(entropyFixturePath))),
  canonicalStringify(migratedEntropyGraph),
  "the recorded current entropy fixture matches the exact authorized migration",
);
const oldEntropy = compileLoadout(
  oldEntropyGraph,
  baseline.fixtures.entropy.artifactIdentity.compilationEnvironment,
);
assert.equal(oldEntropy.ok, true, "historical entropy compilation");
const currentEntropyIdentity = JSON.parse(
  read("packages/compiler/fixtures/wo029-identities.json"),
)["entropy-reducer"];
// WO-132's inspection migration remains independently reconstructed below.
const oldPlanSource = prior("packages/skeleton/src/loadouts/plan-refuter.ts");
const oldStrings = (pattern) => {
  const match = oldPlanSource.match(pattern);
  assert.ok(match, "historical plan-refuter inspection source");
  return [...match[1].matchAll(/"(?:\\.|[^"\\])*"/gu)].map(([literal]) =>
    JSON.parse(literal),
  );
};
const oldQuestions = oldStrings(
  /export const PLAN_REFUTER_QUESTIONS = \[([\s\S]*?)\] as const;/u,
);
const oldConstraints = oldStrings(/constraints: \[([\s\S]*?)\]/u);
const oldOutputSchema = oldPlanSource.match(
  /outputContract: \{ schema: ("[^"\n]+") \}/u,
);
assert.ok(oldOutputSchema, "historical plan-refuter output contract");
assert.equal(oldConstraints[1], "No drift finding without a vision passage");
const migratedInspection = {
  acceptanceCriteria: [
    "For each order, which critical-path gate does it unblock and what is the NoOp cost in the records?",
    "How do all eight system traps apply to the order's own process cost?",
    "Does the Cost line name a removal larger than the addition?",
    "Does failure of the mechanism degrade to the old behavior rather than refusing?",
  ],
  constraints: oldConstraints.map((text, index) =>
    index === 1
      ? "Only observed failure or vision contradiction holds; hypothetical issues name reopening observations"
      : text,
  ),
  outputContract: { schema: "plan-goal-review-v1" },
};
const currentPlan = planRefuterLoadout(
  baseline.fixtures.planRefuter.artifactIdentity.authorityExpiresAt,
);
assert.deepEqual(
  currentPlan.role.obligations,
  migratedInspection.acceptanceCriteria,
);
const oldPlan = compileLoadout(
  {
    ...currentPlan,
    role: { ...currentPlan.role, obligations: oldQuestions },
    activeMechanics: currentPlan.activeMechanics.map((active) => ({
      ...active,
      workOrder: {
        ...active.workOrder,
        acceptanceCriteria: oldQuestions,
        constraints: oldConstraints,
        outputContract: { schema: JSON.parse(oldOutputSchema[1]) },
      },
    })),
  },
  baseline.fixtures.planRefuter.artifactIdentity.compilationEnvironment,
);
assert.equal(oldPlan.ok, true, "historical plan-refuter compilation");
// WO-099 gave the Contributor build its own presence policy, which is a new
// reviewed identity (WO-099 D009). The build saved at WO-042's date declared no
// presence policy, so its identity is reproduced from that graph here rather
// than by editing a filed receipt. Both compile in this one run.
assert.equal(
  contributorLoadoutBeforeMissionCheck.presence,
  undefined,
  "the historical Contributor graph declares no presence policy",
);
assert.deepEqual(
  contributorLoadout.presence.map((policy) => policy.policyId),
  [CONTRIBUTOR_MISSION_POLICY],
  "the current Contributor graph adds only the mission-check policy",
);
assert.deepEqual(
  { ...contributorLoadout, presence: null },
  { ...contributorLoadoutBeforeMissionCheck, presence: null },
  "the two Contributor graphs differ only by that policy",
);
const oldContributor = compileLoadout(
  contributorLoadoutBeforeMissionCheck,
  baseline.fixtures.contributor.artifactIdentity.compilationEnvironment,
);
assert.equal(oldContributor.ok, true, "historical Contributor compilation");
assert.notEqual(
  results.contributor.semanticHash,
  oldContributor.semanticHash,
  "the current build carries its own reviewed identity",
);
const compatibility = Object.entries(results).map(([name, result]) => {
  assert.equal(result.ok, true, name);
  const before = baseline.fixtures[name];
  const historical =
    name === "planRefuter"
      ? oldPlan
      : name === "entropy"
        ? oldEntropy
        : name === "contributor"
          ? oldContributor
          : result;
  assert.equal(
    historical.semanticHash,
    before.semanticHash,
    `${name} historical semantic hash`,
  );
  assert.equal(
    hash(historical.program),
    before.programHash,
    `${name} historical program bytes`,
  );
  assert.equal(
    hash(historical.program.inspection),
    before.inspectionHash,
    `${name} historical authored inspection bytes`,
  );
  assert.deepEqual(
    {
      ...historical.artifactIdentity,
      compilerPackageVersion: before.artifactIdentity.compilerPackageVersion,
    },
    before.artifactIdentity,
    `${name} historical compilation changes only compiler package identity`,
  );
  assert.equal(
    result.artifactIdentity.compilerPackageVersion,
    COMPILER_PACKAGE_VERSION,
  );
  if (name === "planRefuter") {
    assert.deepEqual(
      result.program,
      {
        ...oldPlan.program,
        workOrder: { ...oldPlan.program.workOrder, ...migratedInspection },
      },
      "WO-132 changes only the plan-refuter questions, hold constraint and output schema",
    );
    assert.deepEqual(
      result.program.authorityEnvelope,
      oldPlan.program.authorityEnvelope,
      "plan-refuter authority envelope is unchanged",
    );
    assert.deepEqual(
      result.program.ambientEffects,
      oldPlan.program.ambientEffects,
      "plan-refuter ambient effects are unchanged",
    );
    assert.deepEqual(
      result.program.workOrder.allowedOperations,
      oldPlan.program.workOrder.allowedOperations,
      "plan-refuter allowed operations are unchanged",
    );
    assert.deepEqual(
      result.program.workOrder.prohibitedOperations,
      oldPlan.program.workOrder.prohibitedOperations,
      "plan-refuter denied operations are unchanged",
    );
    assert.equal(
      result.artifactIdentity.componentDefinitions.length,
      before.artifactIdentity.componentDefinitions.length,
    );
    assert.deepEqual(
      result.artifactIdentity,
      {
        ...before.artifactIdentity,
        compilerPackageVersion: COMPILER_PACKAGE_VERSION,
        semanticHash: result.semanticHash,
        componentDefinitions: before.artifactIdentity.componentDefinitions.map(
          (entry, index) => ({
            ...entry,
            definitionHash:
              result.artifactIdentity.componentDefinitions[index]
                .definitionHash,
          }),
        ),
      },
      "plan-refuter identity changes only release, semantic and component-definition hashes",
    );
  }
  if (name === "entropy") {
    assert.deepEqual(
      result.artifactIdentity,
      {
        ...currentEntropyIdentity,
        compilerPackageVersion: COMPILER_PACKAGE_VERSION,
      },
      "current entropy matches its explicitly recorded identity",
    );
    for (const field of ["authorityEnvelope", "ambientEffects"])
      assert.deepEqual(
        result.program[field],
        oldEntropy.program[field],
        `entropy ${field} is unchanged`,
      );
    assert.deepEqual(
      result.program.workOrder,
      migrateReviewer(oldEntropy.program.workOrder),
      "entropy work order, allowed and prohibited operations change only in the compiled reviewer fact",
    );
    const definitions = result.artifactIdentity.componentDefinitions;
    const migrated = [shapeFirstId, seisoId];
    assert.deepEqual(
      definitions.filter((entry) => !migrated.includes(entry.componentId)),
      before.artifactIdentity.componentDefinitions.filter(
        (entry) => !migrated.includes(entry.componentId),
      ),
      "all other entropy component definitions remain unchanged",
    );
    const previousSeiso = before.artifactIdentity.componentDefinitions.find(
      (entry) => entry.componentId === seisoId,
    );
    const currentSeiso = definitions.find(
      (entry) => entry.componentId === seisoId,
    );
    assert.deepEqual(currentSeiso, {
      ...previousSeiso,
      version: 2,
      definitionHash: currentSeiso.definitionHash,
    });
    assert.notEqual(currentSeiso.definitionHash, previousSeiso.definitionHash);
    const previous = before.artifactIdentity.componentDefinitions.find(
      (entry) => entry.componentId === shapeFirstId,
    );
    const current = definitions.find(
      (entry) => entry.componentId === shapeFirstId,
    );
    assert.deepEqual(current, {
      ...previous,
      version: 2,
      definitionHash: current.definitionHash,
    });
    assert.notEqual(current.definitionHash, previous.definitionHash);
    assert.deepEqual(
      result.artifactIdentity,
      {
        ...before.artifactIdentity,
        compilerPackageVersion: COMPILER_PACKAGE_VERSION,
        semanticHash: result.semanticHash,
        componentDefinitions: definitions,
      },
      "entropy identity changes only release, semantic and two versioned component definitions",
    );
  }
  const changedArtifactIdentityFields = Object.keys(
    result.artifactIdentity,
  ).filter(
    (field) =>
      canonicalStringify(result.artifactIdentity[field]) !==
      canonicalStringify(before.artifactIdentity[field]),
  );
  assert.deepEqual(
    changedArtifactIdentityFields,
    ["planRefuter", "entropy"].includes(name)
      ? ["compilerPackageVersion", "semanticHash", "componentDefinitions"]
      : // WO-099 D009: the Contributor build gained its own presence policy, so
        // the live build carries a new reviewed identity while the historical
        // graph compiled above still reproduces the saved one exactly.
        name === "contributor"
        ? ["compilerPackageVersion", "semanticHash"]
        : ["compilerPackageVersion"],
  );
  return {
    fixture: name,
    semanticHash: result.semanticHash,
    programHash: hash(result.program),
    inspectionHash: hash(result.program.inspection),
    changedArtifactIdentityFields,
    ...(name === "entropy"
      ? {
          migration: {
            source: docRelative(
              root,
              "workOrders",
              "WO-142-outstanding-cleanup.md",
            ),
            criterion: "B9",
            historicalFixture: `${baseline.sourceRevision}:${entropyFixturePath}`,
            previousSemanticHash: before.semanticHash,
            changedSupportFields: [
              "version",
              "semanticsAdded[0]",
              "emissions[0].text",
              "inspection.obligations[0]",
            ],
            changedProgramFields: [
              "componentManifest",
              "phenotype.semantics",
              "promptFragments",
              "inspection.obligations",
            ],
            authorityUnchanged: true,
            effectsUnchanged: true,
          },
          reviewerMigration: {
            source: docRelative(
              root,
              "workOrders",
              "WO-100-preauthorized-portfolio.md",
            ),
            decision: "WO-100-D007",
            previousReviewer: "claude-fable-5-1 at max",
            reviewer: "claude-opus-5-5 at xhigh",
            changedActiveFields: ["version", "workOrder.knownFacts[3]"],
            changedProgramFields: ["componentManifest", "workOrder.knownFacts"],
            authorityUnchanged: true,
            effectsUnchanged: true,
          },
        }
      : {}),
    ...(name === "planRefuter"
      ? {
          migration: {
            source: docRelative(
              root,
              "workOrders",
              "WO-132-machinery-stand-down.md",
            ),
            criterion: "AC11",
            previousSemanticHash: before.semanticHash,
            changedProgramFields: [
              "workOrder.acceptanceCriteria",
              "workOrder.constraints[1]",
              "workOrder.outputContract.schema",
            ],
            changedComponentDefinitionFields:
              result.artifactIdentity.componentDefinitions.flatMap(
                (entry, index) =>
                  entry.definitionHash !==
                  before.artifactIdentity.componentDefinitions[index]
                    .definitionHash
                    ? [`componentDefinitions[${index}].definitionHash`]
                    : [],
              ),
            authorityUnchanged: true,
            effectsUnchanged: true,
          },
        }
      : {}),
  };
});
const frozen = [
  "packages/skeleton/fixtures/wo003-decision-traces.json",
  "packages/compiler/fixtures/wo029-entropy-reducer.json",
].map((path) => {
  if (path === entropyFixturePath) {
    assert.equal(
      canonicalStringify(JSON.parse(read(path))),
      canonicalStringify(migratedEntropyGraph),
    );
    return {
      path,
      previousHash: digest(prior(path)),
      hash: digest(read(path)),
      unchanged: false,
      migration:
        "WO-142 B9 Shape-First v2 and WO-100-D007 reviewer claude-opus-5-5 at xhigh (Seisō v2); historical bytes verified through oldEntropy",
    };
  }
  assert.equal(read(path), prior(path), `${path} frozen bytes`);
  return { path, hash: digest(read(path)), unchanged: true };
});

const guard = (program, effect) =>
  authorize({ kind: "Act", effect, payload: {} }, program.authorityEnvelope, {
    now: 1,
    actorId: "fixture",
    workstreamId: "fixture",
    decisionIndex: 0,
    intentIndex: 0,
    evidence: [],
    revokedBy: [],
  });
const permission = (field) => ({
  ...authoritySupport("emission"),
  claims: [],
  emissions: [
    {
      kind: "permission-guard",
      emissionId: `permission.${field}`,
      allowedEffects: [],
      deniedEffects: [],
      allowedOperations: [],
      prohibitedOperations: [],
      [field]: ["repo.delete"],
    },
  ],
});
const widening = [
  authoritySupport("f2", "safety-invariants", "allow", "repo.delete"),
  authoritySupport("absent", "hard-permissions", "allow", "remote.send"),
  permission("allowedEffects"),
  permission("allowedOperations"),
].map((support) => {
  const result = compileLoadout(
    authorityFixture([support]),
    seiriEnvironment(),
  );
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.every((entry) => entry.code === "AUTHORITY WIDENING"),
  );
  return { support: support.supportFacetId, ...result };
});
const narrowing = COMPOSITION_PRECEDENCE.map((layer) => {
  const result = requireCompiled(
    compileLoadout(
      authorityFixture([authoritySupport("deny", layer)]),
      seiriEnvironment(),
    ),
  );
  const denied = guard(result, "repo.inspect");
  const allowed = guard(result, "repo.read");
  assert.equal(denied.authorized, false);
  assert.equal(allowed.authorized, true);
  return {
    layer,
    effects: result.authorityEnvelope,
    operations: {
      allowed: result.workOrder.allowedOperations,
      denied: result.workOrder.prohibitedOperations,
    },
    claims: result.effectiveClaims,
    runtime: { denied, allowed },
  };
});
const restored = requireCompiled(
  compileLoadout(
    authorityFixture([
      authoritySupport("lower", "visual-skin"),
      authoritySupport("higher", "safety-invariants", "allow"),
    ]),
    seiriEnvironment(),
  ),
);
assert.equal(guard(restored, "repo.inspect").authorized, true);
const graph = authorityFixture([], [authorityGrant]);
const environment = {
  ...seiriEnvironment(),
  authorityGrantRegistry: [authorityGrant],
};
const grant = compileLoadout(graph, environment);
assert.equal(grant.ok, true);
const unadmitted = compileLoadout(graph, seiriEnvironment());
assert.equal(unadmitted.ok, false);
const reverted = compileLoadout({ ...graph, authorityGrants: [] }, environment);
const base = compileLoadout(authorityFixture(), seiriEnvironment());
assert.equal(reverted.semanticHash, base.semanticHash);
assert.equal(guard(grant.program, "repo.delete").authorized, true);
assert.equal(guard(reverted.program, "repo.delete").authorized, false);
const views = [
  defineLoadout(graph),
  functionTableFromLoadout(graph),
  statechartJsonFromLoadout(graph),
].map((view) => {
  const result = compileEditableView(view, environment);
  assert.equal(result.ok, true);
  assert.equal(result.semanticHash, grant.semanticHash);
  return { view: view.view, semanticHash: result.semanticHash };
});
const projections = Object.entries({
  seiri: results.seiri.program,
  contributor: results.contributor.program,
  grant: grant.program,
}).map(([fixture, program]) => ({
  fixture,
  effective: program.authorityEnvelope,
  projection: projectAuthorityInspection(program),
  rendered: renderCompiledDiff(undefined, program),
}));

// Generated runtime/policy hashes are derived from the executing compiler pin.
// Compare every other hook configuration byte and every wrapper byte exactly.
const parseHook = (source) => {
  const heartbeat = /await recordHarnessHeartbeat\(("[^"]+"), input\);/u.exec(
    source,
  );
  if (heartbeat) {
    const event = JSON.parse(heartbeat[1]);
    assert.ok(
      ["UserPromptSubmit", "PreToolUse", "PostToolUse", "Stop"].includes(event),
    );
    assert.match(
      source,
      /packages\/skeleton\/dist\/src\/presence-heartbeat\.js/,
    );
    return { config: { kind: "presence", event }, wrapper: source };
  }
  const call = /await (?:runHarnessHook|runCommitMessageHook)\(/u.exec(source);
  assert.ok(call, "known generated hook adapter");
  const start = call.index + call[0].length;
  const end = source.indexOf(", feedbackBoundary", start);
  assert.ok(end > start);
  return {
    config: JSON.parse(source.slice(start, end)),
    wrapper: source.slice(0, start) + "<configuration>" + source.slice(end),
  };
};
const withoutDerivedIdentities = (value) => {
  if (Array.isArray(value)) return value.map(withoutDerivedIdentities);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, item]) => {
      if (key === "grants" && Array.isArray(item) && !item.length) return [];
      if (key === "authorityGrantRegistryHash" && item === null) return [];
      if (
        [
          "compilerPackageVersion",
          "skeletonVersion",
          "hash",
          "policyHash",
          "feedbackPolicyHash",
        ].includes(key)
      )
        return [[key, "<derived identity>"]];
      return [[key, withoutDerivedIdentities(item)]];
    }),
  );
};
const bundlePaths = git(
  "ls-tree",
  "-r",
  "--name-only",
  "v0.16.0",
  "--",
  ".agents",
  ".claude",
  "CLAUDE.md",
)
  .trim()
  .split("\n");
const savedBuild = contributorProgram([]);
// Isolate the executor equipment comparison; shared role supports have their
// own all-role projection fixtures and remain in the installed default build.
const equippedBuild = contributorProgram(defaultExecutorSupportIds);
const unequipped = harnessInstallation({ program: savedBuild });
const equipped = harnessInstallation({ program: equippedBuild });
const currentPaths = (installation) =>
  [
    ...new Set([
      ...installation.files.map((file) => file.path),
      ".claude/harness-manifest.json",
    ]),
  ].sort();
assert.deepEqual(currentPaths(equipped), currentPaths(unequipped));
const generated = (installation, path) =>
  path === ".claude/harness-manifest.json"
    ? JSON.stringify(installation.manifest, null, 2) + "\n"
    : (installation.files.find((file) => file.path === path)?.contents ?? null);
// WO-042 proved its version-specific bundle migration. Retain those exact
// observations; WO-126 intentionally changes the procedure and hook policy.
// Current authority semantics are exercised above, and current support-only
// projection remains an exact comparison below.
const historicalEvidence = [
  "authority.json",
  "bundle-diff.json",
  "artifact-identity/semantic-hash-inventory.json",
  "artifact-identity/scenario.jsonl",
  "artifact-identity/audit.json",
  "artifact-identity/negative-transcripts.json",
  "verification/events.jsonl",
  "verification/matrix.json",
  "verification/stale-status.json",
  "verification/stale-status.txt",
].map((name) => {
  const path = docRelative(root, "evidence", `WO-042/${name}`);
  assert.equal(read(path), git("show", `v0.16.0:${path}`), path);
  return { path, hash: digest(read(path)), unchanged: true };
});
const comparisonPaths = [
  ...new Set([...bundlePaths, ...currentPaths(unequipped)]),
].sort();
const bundleFiles = comparisonPaths.map((path) => {
  const before = bundlePaths.includes(path)
    ? git("show", `v0.16.0:${path}`)
    : null;
  const after = generated(unequipped, path);
  if (after !== null && path.startsWith(".claude/hooks/")) {
    const { config } = parseHook(after);
    if (config.kind !== "presence")
      assert.equal(config.compilerPackageVersion, COMPILER_PACKAGE_VERSION);
    if (config.policy) assertCompiledFeedback(config.policy);
  }
  return {
    path,
    change:
      before === null
        ? "added"
        : after === null
          ? "removed"
          : before === after
            ? "unchanged"
            : "changed",
    before: before === null ? null : digest(before),
    after: after === null ? null : digest(after),
  };
});

assert.deepEqual(
  equippedBuild.loadout.authorityEnvelope,
  savedBuild.loadout.authorityEnvelope,
);
assert.deepEqual(equippedBuild.loadout.workOrder, savedBuild.loadout.workOrder);
assert.deepEqual(
  equippedBuild.facets.filter((facet) => facet.kind !== "role-procedure"),
  savedBuild.facets,
);
assert.deepEqual(
  equippedBuild.roles.filter((role) => role.name !== "executor"),
  savedBuild.roles.filter((role) => role.name !== "executor"),
);
const supports = executorSupports.filter((support) =>
  defaultExecutorSupportIds.includes(support.supportFacetId),
);
const fragments = supports.flatMap((support) =>
  support.emissions.flatMap((emission) =>
    emission.kind === "prompt-fragment" ? [emission.text] : [],
  ),
);
const savedHash = unequipped.manifest.origin.semanticHash;
const equippedHash = equipped.manifest.origin.semanticHash;
assert.notEqual(savedHash, equippedHash);
const overlayFiles = currentPaths(unequipped).map((path) => {
  const before = generated(unequipped, path),
    after = generated(equipped, path);
  if (path === ".claude/harness-manifest.json") {
    let normalized = after.replaceAll(equippedHash, savedHash);
    for (const [index, profile] of equipped.manifest.profiles.entries())
      normalized = normalized.replaceAll(
        profile.loadout.targetHash,
        unequipped.manifest.profiles[index].loadout.targetHash,
      );
    const withoutSupportOrigins = (value) => {
      if (Array.isArray(value)) return value.map(withoutSupportOrigins);
      if (!value || typeof value !== "object") return value;
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
          key,
          key === "ids"
            ? item.filter((id) => !defaultExecutorSupportIds.includes(id))
            : withoutSupportOrigins(item),
        ]),
      );
    };
    assert.deepEqual(
      withoutSupportOrigins(withoutDerivedIdentities(JSON.parse(normalized))),
      withoutDerivedIdentities(JSON.parse(before)),
      "overlay manifest changes only support origins and derived build/file identities",
    );
  } else {
    let expected = before.replaceAll(savedHash, equippedHash);
    if (path.endsWith("dotln-executor/SKILL.md")) {
      expected = expected.replace(
        /<!-- Origin: (\{[^\n]+\}) -->/u,
        (_match, raw) => {
          const origin = JSON.parse(raw);
          origin.ids = [...origin.ids, ...defaultExecutorSupportIds].sort();
          return `<!-- Origin: ${canonicalStringify(origin)} -->`;
        },
      );
      for (const support of supports)
        for (const modifier of support.semanticsModified)
          expected = expected.replace(modifier.from, modifier.to);
      const anchor = expected
        .split("\n")
        .find((line) =>
          line.startsWith("Run `npm run resume --silent -- status --json`"),
        );
      assert.ok(anchor);
      expected = expected.replace(anchor, anchor + "\n" + fragments.join("\n"));
    }
    assert.equal(after, expected, `${path} exact declared support projection`);
    if (path.startsWith(".claude/hooks/"))
      assert.deepEqual(
        parseHook(after).config,
        parseHook(before).config,
        `${path} unchanged host behavior`,
      );
  }
  return {
    path,
    change:
      before === after
        ? "byte-identical"
        : path.endsWith("dotln-executor/SKILL.md")
          ? "declared executor support fragments, repair modifier and build identity"
          : "support origins and derived build/file identities only",
    before: digest(before),
    after: digest(after),
  };
});
const installed = checkHarness(root, {
  instructionFloor: read("CLAUDE.md"),
  termsRoot: root,
});
const transcript = {
  sourceRevision: baseline.sourceRevision,
  compilerPackageVersion: COMPILER_PACKAGE_VERSION,
  compatibility,
  frozen,
  widening,
  narrowing,
  restoration: {
    trace: restored.trace,
    envelope: restored.authorityEnvelope,
    runtime: guard(restored, "repo.inspect"),
  },
  explicitGrant: {
    unadmitted,
    applied: grant.program.grants,
    trace: grant.program.trace,
    envelope: grant.program.authorityEnvelope,
    operations: grant.program.workOrder.allowedOperations,
    runtime: guard(grant.program, "repo.delete"),
    beforeHash: base.semanticHash,
    grantedHash: grant.semanticHash,
    revertedHash: reverted.semanticHash,
    views,
  },
  projections,
};
const bundleDiff = {
  sourceRevision: "v0.16.0",
  historicalEvidence,
  generatedSurfaces: installed.files,
  files: bundleFiles,
  comparison: `v0.16.0 to ${editionLabel} unequipped build; current support-only projection compared separately`,
  supportEquipment: {
    supportIds: defaultExecutorSupportIds,
    savedHash,
    equippedHash,
    authorityUnchanged: true,
    hostBehaviorUnchanged: true,
    otherRoleProceduresUnchanged: true,
    files: overlayFiles,
  },
};
const files = new Map([
  ["authority.json", JSON.stringify(transcript, null, 2) + "\n"],
  ["bundle-diff.json", JSON.stringify(bundleDiff, null, 2) + "\n"],
]);
const preserved =
  mode === "--check" &&
  [...files].some(
    ([name, contents]) =>
      readFileSync(new URL(name, directory), "utf8") !== contents,
  ) &&
  sameEvidenceSourceContent(
    root,
    [...files.keys()].map((name) => `${selection.directory}/${name}`),
    evidenceSources(root).authority,
  );
for (const [name, contents] of files) {
  const path = new URL(name, directory);
  if (mode === "--write" && !existsSync(path)) {
    mkdirSync(directory, { recursive: true });
    writeFileSync(path, contents, { flag: "wx" });
  } else if (!preserved)
    assert.equal(
      readFileSync(path, "utf8"),
      contents,
      `stale ${editionLabel} evidence: ${name}; select a new edition or revision to preserve existing evidence`,
    );
}
if (preserved)
  console.log(
    "Retained immutable authority evidence: behavior source is unchanged apart from component release labels.",
  );
console.log(
  `${mode === "--write" ? "Recorded" : "Verified"} two unchanged programs, the WO-132 plan-refuter, WO-142 Shape-First and WO-100 reviewer migrations, four widening rejections, nine runtime denials, admitted/reverted grants and ${comparisonPaths.length} bundle comparisons (including additions and removals).`,
);
