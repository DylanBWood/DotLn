import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  compileLoadout,
  compileEditableView,
  defineLoadout,
  functionTableFromLoadout,
  statechartJsonFromLoadout,
  encodeCodeDsl,
  decodeCodeDsl,
  encodeFunctionTable,
  decodeFunctionTable,
  encodeStatechartJson,
  decodeStatechartJson,
  normalizeLoadoutGraph,
  renderCompiledDiff,
  requireCompiled,
  seiriLoadout,
  seiriEnvironment,
  type LoadoutGraph,
  type CompilationEnvironment,
  type PresenceNarrowing,
} from "../src/index.js";

const fixture: { graph: LoadoutGraph; environment: CompilationEnvironment } =
  JSON.parse(
    readFileSync(
      new URL(
        "../../../skeleton/fixtures/wo067-presence.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
const compile = (graph = fixture.graph) =>
  compileLoadout(graph, fixture.environment);
const modify = (change: (graph: any) => void): LoadoutGraph => {
  const graph = structuredClone(fixture.graph);
  change(graph);
  return graph;
};

test("WO-121 optional human idle threshold is independent, validated and retained by editable views", () => {
  const graph = modify((g) => {
    g.presence[0].humanIdleMs = 40;
  });
  const policy = requireCompiled(compile(graph)).presence![0]!;
  assert.equal(policy.humanIdleMs, 40);
  assert.equal(policy.decay.idleMs, 100);
  assert.deepEqual(
    compileEditableView(
      decodeCodeDsl(encodeCodeDsl(defineLoadout(graph))),
      fixture.environment,
    ),
    compile(graph),
  );
  assert.equal(requireCompiled(compile()).presence![0]!.humanIdleMs, undefined);
  for (const value of [0, -1, 1.5, "40", null])
    assert.equal(
      compile(
        modify((g) => {
          g.presence[0].humanIdleMs = value;
        }),
      ).ok,
      false,
    );
});

test("WO-067 three phases compile without changing the base or conflating the four axes", () => {
  const source = structuredClone(fixture);
  const program = requireCompiled(compile());
  assert.deepEqual(fixture, source);
  const policy = program.presence![0]!;
  assert.deepEqual(
    policy.phases.map((p) => p.phaseId),
    ["probe", "widen", "peak"],
  );
  assert.deepEqual(policy.axes, [
    "attention",
    "work-scope",
    "effect-authority",
    "external-capability",
  ]);
  assert.deepEqual(
    policy.phases.map((p) => p.effectiveEnvelope.resourceLimits["files"]),
    [1, 3, 8],
  );
  assert.deepEqual(program.authorityEnvelope.allowedEffects, [
    "repo.inspect",
    "repo.read",
    "repo.write",
  ]);
  for (const phase of policy.phases) {
    assert.deepEqual(phase.effectiveEnvelope.deniedEffects, ["repo.delete"]);
    assert.deepEqual(phase.effectiveEnvelope.requiredEvidence, [
      "verified-input",
    ]);
    assert.deepEqual(phase.effectiveEnvelope.revocationEventTypes, [
      "AuthorityRevoked",
    ]);
    assert.equal(phase.effectiveEnvelope.expiresAt, 100000);
  }
  const priorityOnly = requireCompiled(
    compile(
      modify((g) => {
        g.presence[0].phases[0].attentionPriority = 99;
      }),
    ),
  );
  assert.deepEqual(
    priorityOnly.presence![0]!.phases[0]!.effectiveEnvelope,
    policy.phases[0]!.effectiveEnvelope,
  );
});

test("WO-067 every authority dimension narrows the final base, including wildcard denials", () => {
  const attempts: PresenceNarrowing[] = [
    { allowedEffects: ["repo.delete"] },
    { allowedEffects: ["repo.*"] },
    { allowedEffects: ["external.publish"] },
    { resourceLimits: { files: 9 } },
    { resourceLimits: { newResource: 1 } },
    { expiresAt: 100001 },
    { resourceLimits: { toString: 1 } },
    { resourceLimits: { constructor: 1 } },
  ];
  for (const envelope of attempts) {
    const result = compile(
      modify((g) => {
        g.presence[0].phases[0].envelope = envelope;
      }),
    );
    assert.equal(result.ok, false, JSON.stringify(envelope));
    if (result.ok) assert.fail("widening compiled");
    assert.ok(
      result.diagnostics.some(
        (d) =>
          d.code === "AUTHORITY WIDENING" &&
          d.message.includes('phase "probe"'),
      ),
    );
  }
  const wildcard = compile(
    modify((g) => {
      g.activeMechanics[0].authorityEnvelope.deniedEffects.push("repo.*");
    }),
  );
  assert.equal(wildcard.ok, false);
  const baseWildcard = compile(
    modify((g) => {
      g.activeMechanics[0].authorityEnvelope.allowedEffects = ["repo.*"];
      g.presence[0].phases[2].envelope.allowedEffects = ["repo.*"];
    }),
  );
  assert.equal(
    baseWildcard.ok,
    true,
    "a base-equal wildcard peak retains its inherited deletion denial",
  );
  const result = requireCompiled(
    compile(
      modify((g) => {
        g.activeMechanics[0].authorityEnvelope.revocationConditions = [
          { registryId: "base.revoked", version: 1 },
        ];
        g.presence[0].phases[0].envelope = {
          requiredEvidence: [],
          revocationEventTypes: [],
          revocationConditions: [],
          deniedEffects: [],
        };
      }),
    ),
  );
  const envelope = result.presence![0]!.phases[0]!.effectiveEnvelope;
  assert.deepEqual(envelope.requiredEvidence, ["verified-input"]);
  assert.deepEqual(envelope.revocationEventTypes, ["AuthorityRevoked"]);
  assert.deepEqual(envelope.revocationConditions, [
    { registryId: "base.revoked", version: 1 },
  ]);
  assert.deepEqual(envelope.deniedEffects, ["repo.delete"]);
});

test("WO-067 malformed policies refuse naming their field before normalization", () => {
  const cases: readonly [string, (g: any) => void][] = [
    [
      "collection",
      (g) => {
        g.presence = null;
      },
    ],
    [
      "curve",
      (g) => {
        g.presence[0].curve = "automatic-grant";
      },
    ],
    [
      "returnRule",
      (g) => {
        g.presence[0].returnRule = "ignore";
      },
    ],
    [
      "axes",
      (g) => {
        g.presence[0].axes.pop();
      },
    ],
    [
      "phases",
      (g) => {
        g.presence[0].phases = [];
      },
    ],
    [
      "phaseId",
      (g) => {
        g.presence[0].phases[1].phaseId = "probe";
      },
    ],
    [
      "policyId",
      (g) => {
        g.presence.push(g.presence[0]);
      },
    ],
    [
      "idleMs",
      (g) => {
        g.presence[0].decay.idleMs = -1;
      },
    ],
    [
      "expires",
      (g) => {
        g.presence[0].decay.expires = "everything";
      },
    ],
    [
      "kind",
      (g) => {
        g.presence[0].phases[0].entry.cadence.kind = "Calendar";
      },
    ],
    [
      "intervalMs",
      (g) => {
        g.presence[0].phases[0].entry.cadence = {
          kind: "Every",
          intervalMs: 0,
        };
      },
    ],
    [
      "entry",
      (g) => {
        g.presence[0].phases[0].entry.condition = {
          registryId: "x",
          version: 1,
        };
      },
    ],
    [
      "version",
      (g) => {
        g.presence[0].phases[0].entry = {
          condition: { registryId: "x", version: 0 },
        };
      },
    ],
    [
      "files",
      (g) => {
        g.presence[0].phases[0].scope.changeSize.files = 1.5;
      },
    ],
    [
      "budget",
      (g) => {
        g.presence[0].phases[0].scope.budget.tokens = Infinity;
      },
    ],
    [
      "inFlightOnReturn",
      (g) => {
        g.presence[0].phases[0].discretionary = false;
      },
    ],
    [
      "allowEffects",
      (g) => {
        g.presence[0].phases[0].envelope.allowEffects = [];
      },
    ],
  ];
  for (const [field, change] of cases) {
    const result = compile(modify(change));
    assert.equal(result.ok, false, field);
    if (result.ok) assert.fail(field);
    assert.ok(
      result.diagnostics.some((d) => d.message.includes(field)),
      JSON.stringify(result),
    );
  }
});

test("WO-067 three serialized editable views preserve presence and phase order exactly", () => {
  const graph = fixture.graph;
  const views = [
    decodeCodeDsl(encodeCodeDsl(defineLoadout(graph))),
    decodeFunctionTable(encodeFunctionTable(functionTableFromLoadout(graph))),
    decodeStatechartJson(
      encodeStatechartJson(statechartJsonFromLoadout(graph)),
    ),
  ];
  const expected = compile();
  for (const view of views)
    assert.deepEqual(compileEditableView(view, fixture.environment), expected);
  const reordered = compile(
    modify((g) => {
      g.presence[0].phases.reverse();
    }),
  );
  assert.notDeepEqual(reordered, expected);
  assert.deepEqual(
    normalizeLoadoutGraph(normalizeLoadoutGraph(graph)),
    normalizeLoadoutGraph(graph),
  );
  assert.deepEqual(
    normalizeLoadoutGraph({ ...graph, presence: [] }),
    normalizeLoadoutGraph({
      ...graph,
      presence: undefined,
    } as unknown as LoadoutGraph),
  );
});

test("WO-067 empty presence retains exact Seiri semantic bytes; tooltip derives policy values", () => {
  const result = compileLoadout(
    { ...seiriLoadout, presence: [] },
    seiriEnvironment(),
  );
  assert.deepEqual(result, compileLoadout(seiriLoadout, seiriEnvironment()));
  assert.ok(result.ok && result.semanticHash === "fnv1a64:9ca8d0229c6bd8db");
  const tooltip = renderCompiledDiff(undefined, requireCompiled(compile()));
  assert.match(
    tooltip,
    /PULSE\n\+ Presence fixture.progressive v1: progressive/u,
  );
  assert.match(tooltip, /host ceiling=1 files\/20 lines/u);
  assert.match(
    tooltip,
    /INTERRUPT\n\+ Presence fixture.progressive: cancel-on-return/u,
  );
  assert.match(tooltip, /probe: discretionary in-flight kill/u);
  assert.match(tooltip, /widen: discretionary in-flight finish/u);
});

test("WO-142 non-discretionary presence renders the requested-foreground rule", () => {
  const graph = modify((g) => {
    g.presence[0].phases[0].discretionary = false;
    g.presence[0].phases[0].inFlightOnReturn = "finish";
  });
  const tooltip = renderCompiledDiff(
    undefined,
    requireCompiled(compile(graph)),
  );
  assert.match(
    tooltip,
    /fixture\.progressive\/probe: requested foreground continues/u,
  );
  assert.doesNotMatch(
    tooltip,
    /fixture\.progressive\/probe: discretionary in-flight/u,
  );
  assert.match(
    tooltip,
    /fixture\.progressive\/widen: discretionary in-flight finish/u,
  );
});
