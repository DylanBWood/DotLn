import test from "node:test";
import assert from "node:assert/strict";
import {
  compileEditableView,
  compileLoadout,
  renderCompiledDiff,
  renderViewHashes,
  seiriCodeDslView,
  seiriEnvironment,
  seiriFunctionTableView,
  seiriLoadout,
  seiriStatechartJsonView,
  withLinkedSupports,
} from "../src/index.js";

const compilation = compileLoadout(seiriLoadout, seiriEnvironment());
if (!compilation.ok) throw new Error("Seiri fixture must compile");

test("WO-008 AC5 equipped diff renders the exact Seiri / Sort / 整理 RPG item tooltip", () => {
  assert.equal(
    renderCompiledDiff(undefined, compilation.program),
    [
      "Seiri / Sort / 整理",
      "The Evidence-Bound Sort — COMPILED DIFF",
      "",
      "GRANTS",
      "+ Inventory every fixture path",
      "+ Classify every fixture path",
      "+ Analyze references",
      "+ Propose deletion candidates",
      "",
      "RESTRICTIONS",
      "+ Do not mutate repository contents",
      "+ Deletion remains operator-owned",
      "+ Inspect only the bounded fixture repository",
      "",
      "OBLIGATION",
      "+ Attach inventory, classification, and reference evidence to every candidate",
      "+ Independently verify proposed candidates",
      "",
      "PASSIVE",
      "+ Active only while the operator is absent",
      "",
      "PULSE",
      "+ Re-evaluate every 20 virtual minutes",
      "",
      "INTERRUPT",
      "+ Stop on operator return; queued pulses become a traced NoOp",
      "",
      "COST",
      "+ seiri.absence-cadence — statechart-gate; prompt=0 tokens; runtime=2 predicate-evaluations-per-pulse; episodes=0",
      "+ seiri.evidence-capture — evidence-schema; prompt=0 tokens; runtime=1 schema-validations-per-result; episodes=0",
      "+ seiri.independent-verification — verifier-episode; prompt=0 tokens; runtime=1 verifier-dispatches; episodes=1",
      "+ seiri.read-only — permission-guard; prompt=0 tokens; runtime=1 guard-checks-per-effect; episodes=0",
      "+ seiri.repo-scope — work-order; prompt=0 tokens; runtime=0 operations; episodes=0",
      "",
      "SEMANTIC HASH",
      "  before=none",
      "  after=fnv1a64:9ca8d0229c6bd8db",
    ].join("\n"),
  );
});

test("WO-008 AC5 unequip preview is a real compiled reversal", () => {
  const withoutScope = compileLoadout(
    withLinkedSupports(
      seiriLoadout,
      seiriLoadout.supportFacets
        .map((support) => support.supportFacetId)
        .filter((supportId) => supportId !== "seiri.repo-scope"),
    ),
    seiriEnvironment(),
  );
  assert.equal(withoutScope.ok, true);
  if (!withoutScope.ok) assert.fail("unequipped Seiri did not compile");
  const tooltip = renderCompiledDiff(compilation.program, withoutScope.program);
  assert.match(
    tooltip,
    /RESTRICTIONS\n- Inspect only the bounded fixture repository/u,
  );
  assert.match(
    tooltip,
    /COST\n- seiri\.repo-scope — work-order; prompt=0 tokens; runtime=0 operations; episodes=0/u,
  );
  assert.doesNotMatch(
    tooltip,
    /^\+ Inspect only the bounded fixture repository$/mu,
  );
});

test("WO-008 evidence prints the three equal semantic hashes verbatim", () => {
  const views = [
    ["code-dsl", seiriCodeDslView],
    ["function-table", seiriFunctionTableView],
    ["statechart-json", seiriStatechartJsonView],
  ] as const;
  const hashes = views.map(([view, source]) => {
    const result = compileEditableView(source, seiriEnvironment());
    if (!result.ok) assert.fail(`${view} did not compile`);
    return { view, semanticHash: result.semanticHash };
  });
  assert.equal(
    renderViewHashes(hashes),
    [
      "code-dsl=fnv1a64:9ca8d0229c6bd8db",
      "function-table=fnv1a64:9ca8d0229c6bd8db",
      "statechart-json=fnv1a64:9ca8d0229c6bd8db",
      "views=equivalent",
    ].join("\n"),
  );
});
