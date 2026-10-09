import { write as writeFixture } from "./lib/helpers.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { authorize } from "@dotln/kernel";
import {
  COMPOSITION_PRECEDENCE,
  compileLoadout,
  requireCompiled,
  seiriEnvironment,
  lowerToHarness,
  projectAuthorityInspection,
  renderCompiledDiff,
  authorityGrantRegistryHash,
} from "@dotln/compiler";
import {
  authorityFixture,
  authorityGrant,
  authoritySupport,
} from "../packages/compiler/dist/test/authority-fixture.js";
import {
  contributorProgram,
  contributorProfiles,
} from "../packages/skeleton/dist/src/loadouts/contributor.js";
import { personalFeedback } from "../packages/skeleton/dist/src/loadouts/feedback.js";
import {
  COMMITTED_AUTHORITY_GRANTS,
  LOCAL_AUTHORITY_GRANTS,
  applyRegisteredRepositoryProfile,
  applyRepositoryClass,
  registeredProfileMismatches,
  compileRegisteredRepositoryLoadout,
  readAuthorityGrantRegistry,
  compileRegisteredLoadout,
} from "./lib/authority-grants.mjs";
import { CONFIG_FILENAME, loadConfig } from "./lib/config.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const write = (dir, path, grants) =>
  writeFixture(dir, path, JSON.stringify(grants) + "\n");
const guard = (program, effect, evidence = []) =>
  authorize({ kind: "Act", effect, payload: {} }, program.authorityEnvelope, {
    now: 1,
    actorId: "fixture",
    workstreamId: "fixture",
    decisionIndex: 0,
    intentIndex: 0,
    evidence,
    revokedBy: [],
  });

test("WO-042 AC2 trace, effective envelope and runtime authorize agree for every layer and restoration", () => {
  for (const layer of COMPOSITION_PRECEDENCE) {
    const program = requireCompiled(
      compileLoadout(
        authorityFixture([authoritySupport("deny", layer)]),
        seiriEnvironment(),
      ),
    );
    assert.equal(program.effectiveClaims[0].value, "deny");
    assert.equal(guard(program, "repo.inspect").authorized, false);
    assert.equal(
      guard(program, "repo.inspect").refusal.payload.reason,
      "effect denied",
    );
    assert.equal(guard(program, "repo.read").authorized, true);
  }
  const restored = requireCompiled(
    compileLoadout(
      authorityFixture([
        authoritySupport("low", "visual-skin"),
        authoritySupport("high", "safety-invariants", "allow"),
      ]),
      seiriEnvironment(),
    ),
  );
  assert.equal(restored.trace.conflictResolutions[0].winner.value, "allow");
  assert.equal(guard(restored, "repo.inspect").authorized, true);
});

test("WO-042 AC3 host admits only matching grants from the committed and ignored local registries", () => {
  const fixture = mkdtempSync(join(tmpdir(), "dotln-authority-registry-"));
  try {
    write(fixture, COMMITTED_AUTHORITY_GRANTS, []);
    const graph = authorityFixture([], [authorityGrant]);
    assert.equal(
      compileRegisteredLoadout(graph, seiriEnvironment(), fixture).ok,
      false,
    );
    write(fixture, COMMITTED_AUTHORITY_GRANTS, [authorityGrant]);
    let result = compileRegisteredLoadout(graph, seiriEnvironment(), fixture);
    assert.equal(result.ok, true);
    assert.equal(guard(result.program, "repo.delete").authorized, true);
    const local = {
      ...authorityGrant,
      grantId: "local.write",
      grantedBy: "host-policy",
      effects: ["repo.write"],
      operations: [],
    };
    write(fixture, LOCAL_AUTHORITY_GRANTS, [local]);
    result = compileRegisteredLoadout(
      authorityFixture([], [authorityGrant, local]),
      seiriEnvironment(),
      fixture,
    );
    assert.equal(result.ok, true);
    assert.equal(guard(result.program, "repo.write").authorized, true);
    write(fixture, COMMITTED_AUTHORITY_GRANTS, [local]);
    assert.throws(
      () => readAuthorityGrantRegistry(fixture),
      /cannot admit grantedBy host-policy/u,
    );
    write(fixture, COMMITTED_AUTHORITY_GRANTS, [authorityGrant]);
    write(fixture, LOCAL_AUTHORITY_GRANTS, [authorityGrant]);
    assert.throws(
      () => readAuthorityGrantRegistry(fixture),
      /cannot admit grantedBy operator/u,
    );
    write(fixture, LOCAL_AUTHORITY_GRANTS, []);
    rmSync(join(fixture, COMMITTED_AUTHORITY_GRANTS));
    symlinkSync(
      join(root, COMMITTED_AUTHORITY_GRANTS),
      join(fixture, COMMITTED_AUTHORITY_GRANTS),
    );
    assert.throws(
      () => readAuthorityGrantRegistry(fixture),
      /contained regular file/u,
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("WO-071 registered profiles narrow the WorkOrder and widen only through retained grant provenance", () => {
  const fixture = mkdtempSync(join(tmpdir(), "dotln-registered-repository-"));
  try {
    write(fixture, COMMITTED_AUTHORITY_GRANTS, []);
    write(fixture, CONFIG_FILENAME, {
      version: 1,
      classes: { "fixture-class": { checks: [], supports: [] } },
      repositories: {
        target: {
          baseBranch: "main",
          worktreeParent: "../target-worktrees",
          repositoryClass: "fixture-class",
          authorityProfile: {
            authorityEnvelopeId: "target.profile",
            allowedEffects: ["repo.delete", "repo.inspect"],
            deniedEffects: ["repo.inspect"],
            resourceLimits: {},
            requiredEvidence: ["target-registration"],
            expiresAt: Number.MAX_SAFE_INTEGER,
            revocationEventTypes: ["TargetAuthorityRevoked"],
          },
        },
      },
    });
    const graph = authorityFixture();
    const registration = loadConfig(fixture).repositories.target;
    assert.throws(
      () =>
        applyRegisteredRepositoryProfile(
          {
            ...graph,
            authorityGrants: [
              {
                ...authorityGrant,
                grantId: "operator.inspect",
                effects: ["repo.inspect"],
                operations: ["repo.inspect"],
              },
            ],
          },
          {
            ...registration,
            authorityProfile: {
              ...registration.authorityProfile,
              allowedEffects: [],
            },
          },
        ),
      /AUTHORITY WIDENING: existing grant "operator\.inspect".*profile denial "repo\.inspect"/u,
    );
    assert.throws(
      () => applyRegisteredRepositoryProfile(graph, registration),
      /AUTHORITY WIDENING.*without its exact registered-repository grant/u,
    );
    const baseCommit = "b".repeat(40);
    const result = compileRegisteredRepositoryLoadout(
      graph,
      seiriEnvironment(baseCommit),
      fixture,
      "target",
    );
    assert.equal(result.ok, true, JSON.stringify(result.diagnostics));
    const program = requireCompiled(result);
    assert.equal(program.workOrder.repo, "target");
    assert.equal(program.workOrder.baseCommit, baseCommit);
    assert.deepEqual(program.workOrder.allowedOperations, [
      "repo.read",
      "repo.delete",
    ]);
    assert.deepEqual(program.workOrder.prohibitedOperations, [
      "repo.write",
      "repo.inspect",
    ]);
    assert.deepEqual(program.grants, [
      {
        grantId: "registered-repository.target.profile",
        version: 1,
        grantedBy: "registered-repository",
        effects: ["repo.delete"],
        operations: ["repo.delete"],
        repo: "target",
        reason: "Authority profile registered for repository target",
      },
    ]);
    assert.ok(
      program.authorityEnvelope.requiredEvidence.includes(
        "target-registration",
      ),
    );
    assert.ok(
      program.authorityEnvelope.revocationEventTypes.includes(
        "TargetAuthorityRevoked",
      ),
    );
    assert.throws(
      () =>
        compileRegisteredRepositoryLoadout(
          graph,
          seiriEnvironment(baseCommit),
          fixture,
          "absent",
        ),
      /unknown registered repository id "absent"/u,
    );
    assert.throws(
      () =>
        compileRegisteredRepositoryLoadout(
          graph,
          seiriEnvironment(baseCommit),
          fixture,
          "toString",
        ),
      /unknown registered repository id "toString"/u,
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("WO-042 AC5/6 Contributor projection and grant bundle carry the enforced envelope and registry provenance", () => {
  const contributor = contributorProgram();
  const projection = projectAuthorityInspection(contributor.loadout);
  assert.deepEqual(projection.grants, [
    ...contributor.loadout.authorityEnvelope.allowedEffects.filter(
      (effect) => !effect.startsWith("outside.write:"),
    ),
    "outside.write:host-scratchpad (grant contributor.outside-temporary; operator)",
    "outside.write:session-scratch (grant contributor.outside-temporary; operator)",
    "outside.write:system-temp (grant contributor.outside-temporary; operator)",
  ]);
  assert.deepEqual(
    projection.restrictions,
    contributor.loadout.authorityEnvelope.deniedEffects,
  );
  const rendered = renderCompiledDiff(undefined, contributor.loadout);
  assert.ok(rendered.includes("AUTHORED NOTES (non-enforcing)"));
  const loadout = requireCompiled(
    compileLoadout(authorityFixture([], [authorityGrant]), {
      ...seiriEnvironment(),
      authorityGrantRegistry: [authorityGrant],
    }),
  );
  const program = {
    ...contributor,
    loadout,
    facets: [],
    // This fixture admits its unrelated authorityGrant, not Contributor roots.
    roles: contributor.roles.map((role) => ({
      ...role,
      outsideWriteGrants: [],
    })),
  };
  const profile = contributorProfiles.find(
    (entry) => entry.harness === "codex-cli",
  );
  const bundle = lowerToHarness(
    program,
    personalFeedback(),
    loadout.authorityEnvelope,
    profile,
  );
  assert.throws(
    () =>
      lowerToHarness(
        { ...program, roles: contributor.roles },
        personalFeedback(),
        loadout.authorityEnvelope,
        profile,
      ),
    /outside-write root requires an admitted provenance-bearing grant/u,
  );
  assert.deepEqual(bundle.manifest.grants, [authorityGrant]);
  assert.equal(
    bundle.manifest.authorityGrantRegistryHash,
    authorityGrantRegistryHash([authorityGrant]),
  );
  assert.throws(
    () =>
      lowerToHarness(
        program,
        personalFeedback(),
        { ...loadout.authorityEnvelope, allowedEffects: [] },
        profile,
      ),
    /compiled build envelope/u,
  );
  assert.deepEqual(
    JSON.parse(readFileSync(join(root, COMMITTED_AUTHORITY_GRANTS), "utf8")),
    [],
    "this order adds no personal authority",
  );
});

test("WO-073 criterion 1: two repositories in one class", () => {
  const fixture = mkdtempSync(join(tmpdir(), "dotln-repository-class-"));
  try {
    const support = authoritySupport("class-scope");
    const graph = authorityFixture([
      authoritySupport("base-scope", "hard-permissions", "deny", "repo.write"),
    ]);
    graph.activeMechanics[0].authorityEnvelope = {
      ...graph.activeMechanics[0].authorityEnvelope,
      resourceLimits: { files: 8 },
    };
    // An unequipped definition declares a check available to the class.
    graph.supportFacets = [
      ...graph.supportFacets,
      { ...support, evidenceRequirements: ["support-check"] },
      {
        ...authoritySupport("check-catalog"),
        evidenceRequirements: ["class-check"],
      },
    ];
    const classes = {
      shared: { checks: ["class-check"], supports: ["class-scope"] },
    };
    const repository = (id) => ({
      baseBranch: "main",
      worktreeParent: `../${id}-trees`,
      repositoryClass: "shared",
      authorityProfile: {
        authorityEnvelopeId: `${id}.profile`,
        allowedEffects: ["repo.read"],
        deniedEffects: ["repo.delete"],
        resourceLimits: { files: 1 },
        requiredEvidence: [`${id}-check`],
        expiresAt: 500,
        revocationEventTypes: [],
      },
    });
    write(fixture, COMMITTED_AUTHORITY_GRANTS, []);
    write(fixture, CONFIG_FILENAME, {
      version: 1,
      classes,
      repositories: { one: repository("one"), two: repository("two") },
    });
    const registrations = loadConfig(fixture).repositories;
    for (const id of ["one", "two"]) {
      const environment = { ...seiriEnvironment(), repo: id };
      const program = requireCompiled(
        compileRegisteredRepositoryLoadout(graph, environment, fixture, id),
      );
      assert.ok(program.workOrder.requiredEvidence.includes("class-check"));
      assert.ok(program.workOrder.requiredEvidence.includes("support-check"));
      assert.ok(
        !program.phenotype.linkedSupportFacetIds.includes("check-catalog"),
      );
      assert.ok(program.workOrder.requiredEvidence.includes(`${id}-check`));
      for (const check of graph.activeMechanics[0].workOrder.requiredEvidence)
        assert.ok(program.workOrder.requiredEvidence.includes(check));
      assert.ok(
        program.phenotype.linkedSupportFacetIds.includes("class-scope"),
      );
      assert.ok(program.phenotype.linkedSupportFacetIds.includes("base-scope"));
      assert.equal(program.authorityEnvelope.resourceLimits.files, 1);
      assert.equal(program.authorityEnvelope.expiresAt, 500);
      assert.equal(guard(program, "repo.inspect").authorized, false);
      assert.equal(
        guard(program, "repo.read", [`${id}-check`]).authorized,
        true,
      );
      const options = {
        program,
        environment,
        repository: registrations[id],
        classes,
        registry: [],
      };
      assert.deepEqual(registeredProfileMismatches(options), []);
      const missingRepositoryCheck = structuredClone(program);
      missingRepositoryCheck.workOrder.requiredEvidence =
        missingRepositoryCheck.workOrder.requiredEvidence.filter(
          (check) => check !== `${id}-check`,
        );
      assert.deepEqual(
        registeredProfileMismatches({
          ...options,
          program: missingRepositoryCheck,
        }),
        [
          `profile: repositories.${id}.authorityProfile (${id}.profile) requires evidence ${id}-check; the compiled WorkOrder does not`,
        ],
      );
      const tampered = structuredClone(program);
      tampered.workOrder.requiredEvidence =
        tampered.workOrder.requiredEvidence.filter(
          (check) => check !== "class-check",
        );
      tampered.phenotype.linkedSupportFacetIds = [];
      const departures = registeredProfileMismatches({
        ...options,
        program: tampered,
      });
      assert.ok(
        departures.some((line) =>
          /CLASS LAYER: shared.*omits check class-check/.test(line),
        ),
      );
      assert.ok(
        departures.some((line) =>
          /CLASS LAYER: shared.*omits support class-scope/.test(line),
        ),
      );
    }
    for (const declaration of [
      { checks: ["undeclared-check"], supports: [] },
      { checks: [], supports: ["undeclared-support"] },
    ])
      assert.throws(
        () =>
          applyRepositoryClass(graph, registrations.one, {
            shared: declaration,
          }),
        /CLASS LAYER: shared: .*not declared by the launchpad/,
      );
    const widening = structuredClone(graph);
    widening.supportFacets = [
      authoritySupport(
        "class-scope",
        "hard-permissions",
        "allow",
        "repo.delete",
      ),
    ];
    assert.throws(
      () =>
        applyRepositoryClass(widening, registrations.one, {
          shared: { checks: [], supports: ["class-scope"] },
        }),
      /CLASS LAYER: shared: AUTHORITY WIDENING/,
    );
    assert.throws(
      () =>
        applyRegisteredRepositoryProfile(
          applyRepositoryClass(graph, registrations.one, classes),
          {
            ...registrations.one,
            authorityProfile: {
              ...registrations.one.authorityProfile,
              allowedEffects: ["repo.write"],
            },
          },
        ),
      /registered repository one.*without its exact registered-repository grant/,
    );
    const once = applyRepositoryClass(graph, registrations.one, classes);
    assert.deepEqual(
      applyRepositoryClass(once, registrations.one, classes),
      once,
    );
    // The existing profile exception retains its exact grant even with a class.
    const grantedRepository = repository("one");
    grantedRepository.authorityProfile.allowedEffects.push("repo.write");
    write(fixture, CONFIG_FILENAME, {
      version: 1,
      classes,
      repositories: { one: grantedRepository },
    });
    const granted = requireCompiled(
      compileRegisteredRepositoryLoadout(
        graph,
        seiriEnvironment(),
        fixture,
        "one",
      ),
    );
    assert.equal(guard(granted, "repo.write", ["one-check"]).authorized, true);
    assert.ok(
      granted.grants.some(
        (grant) =>
          grant.grantId === "registered-repository.one.profile" &&
          grant.effects.includes("repo.write"),
      ),
    );
    assert.ok(granted.workOrder.requiredEvidence.includes("class-check"));
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
