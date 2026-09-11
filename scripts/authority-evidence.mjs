#!/usr/bin/env node
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { evidenceArgs } from "../packages/skeleton/src/evidence-editions.mjs";
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
import { checkHarness, harnessInstallation } from "./lib/harness.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
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
const directory = new URL(`../${selection.directory}/`, import.meta.url);
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
  assert.equal(
    result.artifactIdentity.compilerPackageVersion,
    COMPILER_PACKAGE_VERSION,
  );
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
  const path = `docs/evidence/WO-042/${name}`;
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
for (const [name, value] of [
  ["authority.json", transcript],
  ["bundle-diff.json", bundleDiff],
]) {
  const contents = JSON.stringify(value, null, 2) + "\n";
  const path = new URL(name, directory);
  if (mode === "--write" && !existsSync(path)) {
    mkdirSync(directory, { recursive: true });
    writeFileSync(path, contents, { flag: "wx" });
  } else
    assert.equal(
      readFileSync(path, "utf8"),
      contents,
      `stale ${editionLabel} evidence: ${name}; select a new edition or revision to preserve existing evidence`,
    );
}
console.log(
  `${mode === "--write" ? "Recorded" : "Verified"} four unchanged programs, four widening rejections, nine runtime denials, admitted/reverted grants and ${comparisonPaths.length} bundle comparisons (including additions and removals).`,
);
