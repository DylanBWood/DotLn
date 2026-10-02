import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  SURFACE_RULE_PATTERNS,
  SURFACE_SNAPSHOT_BOUND,
  compileStoryContract,
  decodeRepoSurfaceProfile,
  decodeSnapshotIndex,
  decodeSourceBundle,
  deriveSurfaces,
  type RepoSurfaceProfile,
  type SnapshotIndex,
  type SourceBundle,
  type SurfaceInference,
} from "../src/index.js";

interface Case {
  name: string;
  requirements: string[];
  inferences?: { requirement: number; path: string; rationale: string }[];
  threshold?: number;
  surfaces: string[];
  confidence: number;
  kind: "DerivedSurfaces" | "NeedsHuman";
}
const fixture = JSON.parse(
  await readFile(
    new URL("../../fixtures/wo124-impact-surfaces.json", import.meta.url),
    "utf8",
  ),
) as {
  profile: RepoSurfaceProfile;
  files: { path: string; contents: string }[];
  cases: Case[];
};
const index: SnapshotIndex = fixture.files.map(({ path, contents }) => ({
  path,
  size: Buffer.byteLength(contents),
  hash: createHash("sha256").update(contents).digest("hex"),
}));
const contractFor = (requirements: readonly string[]) => {
  const raw: SourceBundle = {
    bundleId: "wo124-synthetic-issue",
    sourceKind: "synthetic-issue",
    revisionId: "r1",
    sections: requirements.map((text, i) => ({
      id: `s-${i}`,
      text,
      span: { sectionId: `s-${i}`, start: 0, end: Buffer.byteLength(text) },
    })),
    discussion: [],
    images: [],
    revisions: [],
  };
  const decoded = decodeSourceBundle(raw, { allowedHosts: [] });
  assert.ok(decoded.ok, JSON.stringify(decoded));
  return compileStoryContract(
    decoded.bundle,
    decoded.bundle.sections.map((section) => ({
      span: section.span,
      class: "requirement",
      rationale:
        "Synthetic requirement classification supplied by the fixture double.",
    })),
  );
};
const inputFor = (scenario: Case) => {
  const contract = contractFor(scenario.requirements);
  const inferences: SurfaceInference[] = (scenario.inferences ?? []).map(
    (entry) => ({
      statementId: contract.statements[entry.requirement]!.statementId,
      path: entry.path,
      rationale: entry.rationale,
    }),
  );
  return {
    contract,
    options: {
      inferences,
      ...(scenario.threshold === undefined
        ? {}
        : { threshold: scenario.threshold }),
    },
  };
};

test("WO-124 criterion 1: fixture surfaces, coverage and candidate paths are pinned", () => {
  for (const scenario of fixture.cases) {
    const { contract, options } = inputFor(scenario);
    const result = deriveSurfaces(contract, fixture.profile, index, options);
    assert.equal(result.kind, scenario.kind, scenario.name);
    assert.equal(result.confidence, scenario.confidence, scenario.name);
    assert.deepEqual(
      result.surfaces.map((entry) => entry.path),
      scenario.surfaces,
      scenario.name,
    );
    assert.ok(
      result.surfaces.every((entry) =>
        index.some((file) => file.path === entry.path),
      ),
    );
    if (
      scenario.name.includes("partial") ||
      scenario.name.includes("missing-path") ||
      scenario.name === "covered-with-candidate"
    )
      assert.ok(
        result.candidates.some((entry) => entry.path === "src/missing.ts"),
        scenario.name,
      );
    if (scenario.name === "empty-directory")
      assert.equal(result.candidates[0]!.path, "src/queue");
    if (scenario.name === "unmapped")
      assert.equal(result.candidates[0]!.reason, "unmapped-requirement");
    if (scenario.name === "explicit")
      assert.deepEqual(result.surfaces[0]!.origins, [
        {
          origin: "rule",
          rule: "named-path",
          statementId: contract.statements[0]!.statementId,
          reference: "src/parser/read.ts",
        },
      ]);
    if (scenario.name === "architecture")
      assert.ok(
        result.surfaces.every((entry) =>
          entry.origins.some(
            (proof) => proof.origin === "rule" && proof.rule === "architecture",
          ),
        ),
      );
    if (scenario.name === "inferred")
      assert.deepEqual(result.surfaces[0]!.origins, [
        {
          origin: "inferred",
          statementId: contract.statements[0]!.statementId,
          rationale: options.inferences[0]!.rationale,
        },
      ]);
  }
  assert.ok(
    Object.isFrozen(SURFACE_RULE_PATTERNS) &&
      Object.isFrozen(SURFACE_RULE_PATTERNS.noun),
  );
});

test("WO-124 criteria 1/2: union keeps inferred overlap and tests are whole scoped commands", () => {
  const contract = contractFor(["Change parser and `src/parser/read.ts`."]);
  const inferences: SurfaceInference[] = [
    {
      statementId: contract.statements[0]!.statementId,
      path: "src/parser/read.ts",
      rationale: "Fixture double independently nominated this file.",
    },
  ];
  const result = deriveSurfaces(contract, fixture.profile, index, {
    inferences,
  });
  assert.deepEqual(
    result.surfaces.map((entry) => entry.path),
    ["src/parser/read.ts", "src/parser/write.ts"],
  );
  assert.deepEqual(
    result.surfaces[0]!.origins.map((proof) => proof.origin).sort(),
    ["inferred", "rule", "rule"],
  );
  assert.deepEqual(result.tests, [
    {
      command: "node --test test/parser.test.mjs",
      origin: "rule",
      surfaces: ["src/parser/read.ts", "src/parser/write.ts"],
    },
    {
      command: "npm run check",
      origin: "rule",
      surfaces: ["src/parser/read.ts", "src/parser/write.ts"],
    },
  ]);
  const command = " npm test -- --scope='shared cache' ";
  const shared = deriveSurfaces(
    contractFor(["Change `src/shared/cache.ts`."]),
    { architecture: [], commands: [{ command, directories: ["src/shared"] }] },
    index,
  );
  assert.equal(
    shared.tests[0]!.command,
    command,
    "spaces, flags and quoting are never rewritten",
  );
});

test("WO-124 criterion 2: canonical outputs are byte-identical, immutable and input-order independent", () => {
  for (const scenario of fixture.cases) {
    const { contract, options } = inputFor(scenario);
    const before = JSON.stringify({
      contract,
      profile: fixture.profile,
      index,
      options,
    });
    const first = deriveSurfaces(contract, fixture.profile, index, options);
    assert.equal(
      JSON.stringify(first),
      JSON.stringify(deriveSurfaces(contract, fixture.profile, index, options)),
    );
    assert.equal(
      JSON.stringify(first),
      JSON.stringify(
        deriveSurfaces(
          contract,
          {
            architecture: [...fixture.profile.architecture].reverse(),
            commands: [...fixture.profile.commands].reverse(),
          },
          [...index].reverse(),
          { ...options, inferences: [...options.inferences].reverse() },
        ),
      ),
    );
    assert.equal(
      JSON.stringify({ contract, profile: fixture.profile, index, options }),
      before,
    );
    assert.ok(Object.isFrozen(first) && Object.isFrozen(first.surfaces));
  }
});

test("WO-124 confidence gate: unavailable snapshot names the bound and retired requirements do not contribute", () => {
  const contract = contractFor([
    "Change `src/parser/read.ts`.",
    "Change `src/missing.ts`.",
  ]);
  const unavailable = deriveSurfaces(contract, fixture.profile, null, {
    threshold: 0,
  });
  assert.equal(unavailable.kind, "NeedsHuman");
  assert.ok(
    unavailable.kind === "NeedsHuman" &&
      unavailable.reason === SURFACE_SNAPSHOT_BOUND,
  );
  assert.deepEqual(unavailable.surfaces, []);
  assert.ok(
    unavailable.candidates.some(
      (candidate) => candidate.path === "src/parser/read.ts",
    ),
  );
  const retired = {
    ...contract,
    statements: contract.statements.map((statement, i) =>
      i === 1 ? { ...statement, status: "superseded" as const } : statement,
    ),
  };
  assert.equal(deriveSurfaces(retired, fixture.profile, index).confidence, 1);
  assert.equal(
    deriveSurfaces({ ...contract, statements: [] }, fixture.profile, index, {
      threshold: 0,
    }).kind,
    "NeedsHuman",
  );
  const nonRequirement = {
    ...contract,
    statements: contract.statements.map((statement) => ({
      ...statement,
      class: "open decision" as const,
    })),
  };
  assert.deepEqual(
    deriveSurfaces(nonRequirement, fixture.profile, index).surfaces,
    [],
  );
});

test("WO-124 criterion 2: invalid profile/index fields refuse with their diagnostic paths", () => {
  const badProfiles: [unknown, string][] = [
    [null, "$.profile"],
    [{ commands: [] }, "$.profile.architecture"],
    [{ architecture: [], commands: [], extra: true }, "$.profile.extra"],
    [{ architecture: new Array(1), commands: [] }, "$.profile.architecture[0]"],
    [{ architecture: [], commands: new Array(1) }, "$.profile.commands[0]"],
    [
      {
        architecture: [{ noun: "parser", directories: new Array(1) }],
        commands: [],
      },
      "$.profile.architecture[0].directories[0]",
    ],
    [
      {
        architecture: [{ noun: "parser", directories: ["../src"] }],
        commands: [],
      },
      "$.profile.architecture[0].directories[0]",
    ],
    [
      { architecture: [{ noun: "", directories: ["src"] }], commands: [] },
      "$.profile.architecture[0].noun",
    ],
    [
      { architecture: [], commands: [{ command: "\n", directories: ["src"] }] },
      "$.profile.commands[0].command",
    ],
    [
      {
        architecture: [],
        commands: [{ command: "node test.mjs", directories: [] }],
      },
      "$.profile.commands[0].directories",
    ],
  ];
  for (const [input, path] of badProfiles)
    assert.throws(
      () => decodeRepoSurfaceProfile(input),
      (error) => error instanceof Error && error.message.includes(path),
    );
  const file = index[0]!;
  const badIndexes: [unknown, string][] = [
    [{}, "$.snapshotIndex"],
    [[], "$.snapshotIndex"],
    [new Array(1), "$.snapshotIndex[0]"],
    [[{ ...file, path: ".git/config" }], "$.snapshotIndex[0].path"],
    [[file, file], "$.snapshotIndex[1].path"],
    [[{ ...file, size: 100_001 }], "$.snapshotIndex[0].size"],
    [[{ ...file, hash: "unknown" }], "$.snapshotIndex[0].hash"],
    [[{ ...file, contents: "extra" }], "$.snapshotIndex[0].contents"],
  ];
  for (const [input, path] of badIndexes)
    assert.throws(
      () => decodeSnapshotIndex(input),
      (error) => error instanceof Error && error.message.includes(path),
    );
  const contract = contractFor(["Change `src/parser/read.ts`."]);
  assert.throws(
    () =>
      deriveSurfaces(
        contract,
        {
          ...fixture.profile,
          commands: [{ command: "x", directories: ["../outside"] }],
        },
        index,
      ),
    /\$\.profile\.commands\[0\]\.directories\[0\]/u,
  );
  assert.throws(
    () => deriveSurfaces(contract, fixture.profile, [{ ...file, hash: "bad" }]),
    /\$\.snapshotIndex\[0\]\.hash/u,
  );
  assert.throws(
    () => deriveSurfaces(contract, fixture.profile, index, { threshold: 1.1 }),
    /\$\.options\.threshold/u,
  );
  assert.throws(
    () =>
      deriveSurfaces(contract, fixture.profile, index, {
        inferences: new Array(1),
      }),
    /\$\.options\.inferences\[0\]/u,
  );
  assert.throws(
    () =>
      deriveSurfaces(contract, fixture.profile, index, {
        inferences: [
          { statementId: "unknown", path: file.path, rationale: "Fixture" },
        ],
      }),
    /\$\.options\.inferences\[0\]\.statementId/u,
  );
});
