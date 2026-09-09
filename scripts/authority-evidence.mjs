#!/usr/bin/env node
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
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
  contributorLoadout,
  contributorProgram,
} from "../packages/skeleton/dist/src/loadouts/contributor.js";
import {
  defaultExecutorSupportIds,
  executorSupports,
} from "../packages/skeleton/dist/src/loadouts/executor-supports.js";
import { compilePlanRefuter } from "../packages/skeleton/dist/src/loadouts/plan-refuter.js";
import {
  checkHarness,
  harnessInstallation,
  harnessInstructionBlock,
} from "./lib/harness.mjs";

const [mode, ...extra] = process.argv.slice(2);
assert.ok(
  ["--write", "--check"].includes(mode) && !extra.length,
  "usage: authority-evidence.mjs --write|--check (build and emit the bundle first)",
);
const root = fileURLToPath(new URL("../", import.meta.url));
const directory = new URL("../docs/evidence/WO-042/", import.meta.url);
const read = (path) => readFileSync(join(root, path), "utf8");
const baseline = JSON.parse(
  read("docs/evidence/WO-042/authority-baseline.json"),
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
const compatibility = Object.entries(results).map(([name, result]) => {
  assert.equal(result.ok, true, name);
  const before = baseline.fixtures[name];
  assert.equal(
    result.semanticHash,
    before.semanticHash,
    `${name} semantic hash`,
  );
  assert.equal(
    hash(result.program),
    before.programHash,
    `${name} program bytes`,
  );
  assert.equal(
    hash(result.program.inspection),
    before.inspectionHash,
    `${name} authored inspection bytes`,
  );
  assert.deepEqual(
    {
      ...result.artifactIdentity,
      compilerPackageVersion: before.artifactIdentity.compilerPackageVersion,
    },
    before.artifactIdentity,
    `${name} only the compiler package identity changes`,
  );
  assert.equal(result.artifactIdentity.compilerPackageVersion, "0.8.0");
  return {
    fixture: name,
    semanticHash: result.semanticHash,
    programHash: hash(result.program),
    inspectionHash: hash(result.program.inspection),
    changedArtifactIdentityFields: ["compilerPackageVersion"],
  };
});
const frozen = [
  "packages/skeleton/fixtures/wo003-decision-traces.json",
  "packages/compiler/fixtures/wo029-entropy-reducer.json",
].map((path) => {
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
  const call = /await (?:runHarnessHook|runCommitMessageHook)\(/u.exec(source);
  assert.ok(call, "known generated hook adapter");
  const start = call.index + call[0].length;
  const end = source.indexOf(", feedbackBoundary);", start);
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
  baseline.sourceRevision,
  "--",
  ".agents",
  ".claude",
  "CLAUDE.md",
)
  .trim()
  .split("\n");
const savedBuild = contributorProgram([]);
const equippedBuild = contributorProgram();
const unequipped = harnessInstallation({ program: savedBuild });
const equipped = harnessInstallation({ program: equippedBuild });
const generated = (installation, path) =>
  path === ".claude/harness-manifest.json"
    ? JSON.stringify(installation.manifest, null, 2) + "\n"
    : installation.files.find((file) => file.path === path).contents;
const bundleFiles = bundlePaths.map((path) => {
  const before = prior(path),
    after = generated(unequipped, path);
  if (path === "CLAUDE.md") {
    assert.equal(harnessInstructionBlock(before), after);
    assert.equal(
      read(path).replace(harnessInstructionBlock(read(path)).trimEnd(), ""),
      before.replace(harnessInstructionBlock(before).trimEnd(), ""),
      "hand-written instruction floor",
    );
    return {
      path,
      change: "byte-identical marked block and hand-written floor",
      hash: digest(after),
    };
  }
  if (before === after)
    return { path, change: "byte-identical", hash: digest(after) };
  if (path === ".claude/harness-manifest.json") {
    for (const profile of JSON.parse(before).profiles)
      assert.equal(profile.profile.runtime.skeletonVersion, "0.13.0");
    for (const profile of unequipped.manifest.profiles)
      assert.equal(profile.profile.runtime.skeletonVersion, "0.14.0");
    assert.deepEqual(
      withoutDerivedIdentities(JSON.parse(after)),
      withoutDerivedIdentities(JSON.parse(before)),
      "manifest semantic fields",
    );
    return {
      path,
      change:
        "compiler/skeleton pins, derived hashes and empty grant provenance",
      before: digest(before),
      after: digest(after),
    };
  }
  assert.ok(
    path.startsWith(".claude/hooks/"),
    `unexpected changed bundle surface ${path}`,
  );
  const left = parseHook(before),
    right = parseHook(after);
  assert.equal(left.wrapper, right.wrapper, `${path} hook wrapper`);
  assert.equal(left.config.compilerPackageVersion, "0.7.0");
  assert.equal(right.config.compilerPackageVersion, COMPILER_PACKAGE_VERSION);
  assert.equal(left.config.runtime.skeletonVersion, "0.13.0");
  assert.equal(right.config.runtime.skeletonVersion, "0.14.0");
  if (right.config.policy) assertCompiledFeedback(right.config.policy);
  assert.deepEqual(
    withoutDerivedIdentities(right.config),
    withoutDerivedIdentities(left.config),
    `${path} hook semantics, matchers, envelope and policy definitions`,
  );
  return {
    path,
    change: "compiler/skeleton pins and derived runtime/policy hashes",
    before: digest(before),
    after: digest(after),
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
const overlayFiles = bundlePaths.map((path) => {
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
      const anchor = "Implement the complete bounded deliverable";
      assert.equal(expected.split(anchor).length, 2);
      expected = expected.replace(anchor, fragments.join("\n") + "\n" + anchor);
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
  sourceRevision: baseline.sourceRevision,
  generatedSurfaces: installed.files,
  files: bundleFiles,
  comparison:
    "activation to current unequipped saved build; installed equipment compared separately",
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
for (const [name, value] of [
  ["authority.json", transcript],
  ["bundle-diff.json", bundleDiff],
]) {
  const contents = JSON.stringify(value, null, 2) + "\n";
  if (mode === "--write") {
    mkdirSync(directory, { recursive: true });
    writeFileSync(new URL(name, directory), contents);
  } else
    assert.equal(
      readFileSync(new URL(name, directory), "utf8"),
      contents,
      `stale WO-042 evidence: ${name}`,
    );
}
console.log(
  `${mode === "--write" ? "Recorded" : "Verified"} four unchanged programs, four widening rejections, nine runtime denials, admitted/reverted grants and ${bundlePaths.length} bundle comparisons.`,
);
