import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
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
  readAuthorityGrantRegistry,
  compileRegisteredLoadout,
} from "./lib/authority-grants.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const write = (dir, path, grants) => {
  mkdirSync(dirname(join(dir, path)), { recursive: true });
  writeFileSync(join(dir, path), JSON.stringify(grants) + "\n");
};
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

test("WO-042 AC5/6 Contributor projection and grant bundle carry the enforced envelope and registry provenance", () => {
  const contributor = contributorProgram();
  const projection = projectAuthorityInspection(contributor.loadout);
  assert.deepEqual(
    projection.grants,
    contributor.loadout.authorityEnvelope.allowedEffects,
  );
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
  const program = { ...contributor, loadout, facets: [] };
  const profile = contributorProfiles.find(
    (entry) => entry.harness === "codex-cli",
  );
  const bundle = lowerToHarness(
    program,
    personalFeedback(),
    loadout.authorityEnvelope,
    profile,
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
