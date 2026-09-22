import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { decodeLog } from "@dotln/kernel";
import {
  compileLoadout,
  requireCompiled,
  type CompiledPresencePhase,
} from "@dotln/compiler";
import { discover } from "../src/discovery.js";
import {
  admitPortfolio,
  decodePortfolio,
  decodePortfolioBinding,
  deriveWorkOrders,
  summarizeDerivations,
  type CandidateKind,
  type Portfolio,
  type PortfolioDerivation,
} from "../src/portfolio.js";
import {
  PORTFOLIO_UNBOUND,
  portfolioAdapter,
  type PortfolioPorts,
} from "../src/portfolio-actor.js";
import { SOURCE_CHANGE_DENIED } from "../src/worker-protocol.js";
import { ResidentHost } from "../src/resident-host.js";
import { recordPresence, replayResident } from "../src/resident-store.js";
import {
  decodeResidentConfiguration,
  portfolioSelection,
  type ResidentConfiguration,
  type ResidentState,
} from "../src/resident-state.js";
import type { ActorSpec } from "../src/actor-contract.js";

const repository = JSON.parse(
  readFileSync(
    new URL("../../fixtures/wo119-discovery/repository.json", import.meta.url),
    "utf8",
  ),
);
const presence = JSON.parse(
  readFileSync(
    new URL("../../fixtures/wo100-portfolio.json", import.meta.url),
    "utf8",
  ),
);
const program = requireCompiled(
  compileLoadout(presence.graph, presence.environment),
);
const policy = program.presence![0]!;
const phase = (id: string): CompiledPresencePhase =>
  policy.phases.find((p) => p.phaseId === id)!;
const WRITE = ["git.local", "repo.read", "repo.write", "shell.run"];
/** The first portfolio: 5S maintenance of a scratch repository (assumption 1). */
const fixturePortfolio = (): Portfolio =>
  decodePortfolio({
    portfolioId: "gardener-5s",
    version: 1,
    repo: "scratch",
    mechanics: ["shine", "sort"],
    surfaces: ["docs", "generated", "loose/guide.md", "src"],
    phases: {
      widen: { effects: WRITE, files: 1 },
      peak: { effects: WRITE, files: 2 },
    },
    budget: { episodes: 2, wallMs: 60000 },
    verification: {
      "failing-lint": ["node checks/lint.cjs"],
      "failing-test": ["node checks/test.cjs"],
      "misplaced-file": ["node checks/test.cjs"],
    },
  });
const BASE = "a".repeat(40);

function scratch(t: { after: (fn: () => void) => void }) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-portfolio-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}
function seed(root: string) {
  for (const [path, contents] of Object.entries(repository.files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), contents as string);
  }
  writeFileSync(
    join(root, ".dotln/discovery.json"),
    JSON.stringify({
      checks: ["lint", "test"].map((kind) => ({
        kind,
        argv: [process.execPath, `checks/${kind}.cjs`],
        paths: ["src/main.js"],
      })),
      ...repository.conventions,
    }),
  );
}
const shape = (d: PortfolioDerivation) =>
  d.kind === "order"
    ? { kind: d.kind, id: d.order.candidateId, surfaces: d.order.surfaces }
    : d.kind === "NeedsHuman"
      ? { kind: d.kind, id: d.candidateId, offending: d.offending }
      : { kind: d.kind, id: d.candidateId };

test("WO-100 derivation over the WO-119 fixture: in-portfolio candidates become bounded orders, the rest suggestions, human questions or deferrals", (t) => {
  const root = scratch(t);
  seed(root);
  const { candidates } = discover(root);
  const portfolio = admitPortfolio(
    fixturePortfolio(),
    policy,
    program.authorityEnvelope,
  );
  const widen = deriveWorkOrders(candidates, portfolio, phase("widen"), {
    baseCommit: BASE,
  });
  assert.deepEqual(widen.map(shape), [
    {
      kind: "order",
      id: "failing-lint:src/main.js",
      surfaces: ["src/main.js"],
    },
    {
      kind: "order",
      id: "failing-test:src/main.js",
      surfaces: ["src/main.js"],
    },
    { kind: "deferred", id: "misplaced-file:loose/guide.md" },
    { kind: "ProductSuggestion", id: "misplaced-file:loose/helper.js" },
    {
      kind: "NeedsHuman",
      id: "stale-generated:generated/obsolete.txt",
      offending: "repo.delete",
    },
    { kind: "ProductSuggestion", id: candidates[5]!.candidateId },
  ]);
  assert.match(candidates[5]!.candidateId, /^repeated-repair:src\/main\.js:/);
  const peak = deriveWorkOrders(candidates, portfolio, phase("peak"), {
    baseCommit: BASE,
  });
  assert.deepEqual(shape(peak[2]!), {
    kind: "order",
    id: "misplaced-file:loose/guide.md",
    surfaces: ["docs/guide.md", "loose/guide.md"],
  });
  assert.deepEqual(peak[2]!.kind === "order" && peak[2]!.order.relocation, {
    from: "loose/guide.md",
    to: "docs/guide.md",
  });
  assert.deepEqual(
    deriveWorkOrders(candidates, portfolio, phase("probe"), {
      baseCommit: BASE,
    }).map((d) => d.kind),
    [
      "deferred",
      "deferred",
      "deferred",
      "ProductSuggestion",
      "NeedsHuman",
      "ProductSuggestion",
    ],
  );
  const within = (surfaces: readonly string[], path: string) =>
    surfaces.some((s) => path === s || path.startsWith(`${s}/`));
  for (const [phaseId, derivations] of [
    ["widen", widen],
    ["peak", peak],
  ] as const) {
    const compiled = phase(phaseId);
    const ceiling = portfolio.phases[phaseId]!;
    for (const d of derivations) {
      if (d.kind !== "order") continue;
      const { order } = d;
      assert.ok(order.surfaces.every((p) => within(portfolio.surfaces, p)));
      assert.ok(order.size.files <= ceiling.files);
      assert.ok(order.size.files <= compiled.scope.changeSize.files);
      assert.equal(order.size.files, order.surfaces.length);
      for (const effect of order.authorityEnvelope.allowedEffects) {
        assert.ok(ceiling.effects.includes(effect), effect);
        assert.ok(compiled.effectiveEnvelope.allowedEffects.includes(effect));
      }
      for (const denied of [
        ...compiled.effectiveEnvelope.deniedEffects,
        ...SOURCE_CHANGE_DENIED,
      ])
        assert.ok(order.authorityEnvelope.deniedEffects.includes(denied));
      assert.ok(
        order.authorityEnvelope.resourceLimits["files"]! <= ceiling.files,
      );
      assert.equal(order.grant.grantedBy, "host-policy");
      assert.equal(order.grant.repo, "scratch");
      assert.deepEqual(order.workOrder.allowedOperations, WRITE);
      assert.equal(order.workOrder.baseCommit, BASE);
      const kind = order.candidateId.split(":")[0] as CandidateKind;
      assert.deepEqual(order.tests, portfolio.verification[kind]);
      // The WO-120 key names every input of the phase-free contract.
      assert.equal(
        order.sourceId,
        `portfolio:gardener-5s@1:${BASE}:${order.candidateId}`,
      );
    }
  }
  // The compiled contract is phase-free, so WO-120 keys one identity per candidate.
  assert.deepEqual(
    widen[0]!.kind === "order" && widen[0]!.order.workOrder,
    peak[0]!.kind === "order" && peak[0]!.order.workOrder,
  );
  const suggestion = widen[5]!;
  assert.equal(suggestion.kind, "ProductSuggestion");
  if (suggestion.kind === "ProductSuggestion") {
    assert.deepEqual(
      suggestion.suggestion.evidenceRefs,
      candidates[5]!.evidence,
    );
    assert.match(suggestion.reason, /standardize is not preauthorized/);
  }
  t.diagnostic(
    JSON.stringify({ widen: widen.map(shape), peak: peak.map(shape) }),
  );
});

test("WO-100 a portfolio is validated under the floor and each phase, and its contract refuses malformed text", () => {
  const good = fixturePortfolio();
  const widened = (phases: Portfolio["phases"]) =>
    admitPortfolio({ ...good, phases }, policy, program.authorityEnvelope);
  assert.throws(
    () => widened({ probe: { effects: ["repo.write"], files: 1 } }),
    /widens .* with repo\.write/,
  );
  assert.throws(
    () => widened({ peak: { effects: ["repo.delete"], files: 1 } }),
    /widens .* with repo\.delete/,
  );
  assert.throws(
    () => widened({ widen: { effects: WRITE, files: 4 } }),
    /exceeds the phase limit of 3/,
  );
  assert.throws(
    () => widened({ elsewhere: { effects: WRITE, files: 1 } }),
    /not compiled/,
  );
  // WO-052 consumes a writer unit; WO-067's fixture floor grants none.
  const bare = JSON.parse(
    readFileSync(
      new URL("../../fixtures/wo067-presence.json", import.meta.url),
      "utf8",
    ),
  );
  const bareProgram = requireCompiled(
    compileLoadout(bare.graph, bare.environment),
  );
  assert.throws(
    () =>
      admitPortfolio(
        { ...good, phases: { widen: { effects: ["repo.write"], files: 1 } } },
        bareProgram.presence![0]!,
        bareProgram.authorityEnvelope,
      ),
    /grants no writer/,
  );
  // WO-054 prepares only a 40-hex base; a SHA-256 id would spend its attempt.
  for (const baseCommit of ["main", "b".repeat(64)])
    assert.throws(
      () => decodePortfolioBinding({ definition: good, baseCommit }),
      /full 40-hex commit id/,
    );
  assert.equal(
    decodePortfolioBinding({ definition: good, baseCommit: BASE }).baseCommit,
    BASE,
  );
  const raw = JSON.parse(JSON.stringify(good));
  for (const [mutate, pattern] of [
    [(p: any) => (p.mechanics = ["seiton"]), /mechanics/],
    [(p: any) => (p.surfaces = ["../outside"]), /surfaces/],
    [(p: any) => (p.budget = { episodes: 0, wallMs: 1 }), /budget/],
    [
      (p: any) => (p.verification["failing-lint"] = ["npm test; rm -rf ."]),
      /verification/,
    ],
    [(p: any) => (p.extra = true), /unknown key/],
  ] as const) {
    const copy = JSON.parse(JSON.stringify(raw));
    mutate(copy);
    assert.throws(() => decodePortfolio(copy), pattern);
  }
});

function residentConfiguration(
  root: string,
  portfolio = fixturePortfolio(),
  peakFiles = 2,
) {
  const discovery: ActorSpec = {
    kind: "script",
    effect: "repo.inspect",
    surface: "fixture.source",
    resources: { files: 1, lines: 0, tokens: 0 },
    command: [
      process.execPath,
      fileURLToPath(new URL("../src/discovery-cli.js", import.meta.url)),
      root,
    ],
    cwd: root,
    timeoutMs: 20000,
    outputContract: "work-candidates-v1",
  };
  const derived = (files: number): ActorSpec => ({
    kind: "portfolio",
    effect: "repo.write",
    surface: "fixture.source",
    resources: { files, lines: 0, tokens: 0 },
  });
  return decodeResidentConfiguration({
    ...presence,
    policyId: "fixture.portfolio",
    actors: { probe: discovery, widen: derived(1), peak: derived(peakFiles) },
    evidence: ["verified-input"],
    portfolio: { definition: portfolio, baseCommit: BASE },
  });
}
const resident = (host: ResidentHost) =>
  replayResident(host.store.read()).state.resident as unknown as ResidentState;
/** What the same recorded state would activate in a phase with a larger
 * budget: a refusal beside it is the budget's, not an empty phase's. */
const withBudget = (
  state: ResidentState,
  budget: Portfolio["budget"],
  phaseId: string,
) => {
  const binding = state.configuration!.portfolio!;
  const selection = portfolioSelection(
    {
      ...state,
      configuration: {
        ...state.configuration!,
        portfolio: {
          ...binding,
          definition: { ...binding.definition, budget },
        },
      },
    },
    phase(phaseId),
  );
  return "activation" in selection
    ? selection.activation.order.candidateId
    : selection.refusal;
};

test("WO-100 a derived order activates with host-policy provenance, runs through the WO-052 and WO-054 doubles, advances only after a pass, resets from a non-last phase on a failed verification and stops at the budget with an in-phase candidate left", async (t) => {
  const root = scratch(t);
  seed(root);
  const store = scratch(t);
  const configuration = residentConfiguration(root);
  const calls: string[] = [];
  let at = 0;
  let next = 900;
  let host: ResidentHost;
  const ports: PortfolioPorts = {
    async materialize(activation) {
      // The activation, with its grant, is durable before any identity exists.
      const recorded = decodeLog(host.store.read()).filter(
        (e) => e.type === "PortfolioOrderActivated",
      );
      assert.equal(
        (recorded.at(-1)!.payload as any).activation.order.sourceId,
        activation.order.sourceId,
      );
      calls.push(`materialize:${activation.order.candidateId}`);
      const id = `WO-${next++}`;
      return {
        workOrderId: id,
        workOrderPath: `docs/work-orders/derived/${id}-derived.md`,
      };
    },
    async change(activation, identity) {
      calls.push(`change:${identity.workOrderId}:${activation.phaseId}`);
      return {
        status: "observed",
        commit: "c".repeat(40),
        branch: "dotln-portfolio-fixture",
        diffHash: "sha256:fixture",
      };
    },
    async verify(activation, identity) {
      const pass = activation.order.candidateId.startsWith("failing-test");
      calls.push(`verify:${identity.workOrderId}:${pass ? "pass" : "fail"}`);
      return {
        verdict: pass ? "pass" : "fail",
        criteria: 1,
        passed: pass ? 1 : 0,
        findings: pass ? 0 : 1,
        tokens: 7,
      };
    },
  };
  host = new ResidentHost({
    directory: store,
    policyId: configuration.policyId,
    configuration,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
    portfolio: ports,
  });
  await host.start();
  try {
    await recordPresence(store, "away", () => at);
    at = 10;
    await host.tick(); // probe: the WO-119 producer, natively
    assert.equal(resident(host).machine!.state, "widen");
    assert.equal(resident(host).discovery!.report.candidates.length, 6);
    at = 20;
    // widen is not the last phase: a pass would advance to peak, so probe
    // here can only be the failure transition's reset to the first phase.
    await host.tick(); // widen: failing lint, verification fails
    assert.equal(resident(host).machine!.state, "probe");
    at = 30;
    await host.tick(); // probe: the producer again
    assert.equal(resident(host).machine!.state, "widen");
    at = 40;
    await host.tick(); // widen: failing test, verified
    const advanced = resident(host);
    assert.equal(advanced.machine!.state, "peak");
    assert.deepEqual(calls, [
      "materialize:failing-lint:src/main.js",
      "change:WO-900:widen",
      "verify:WO-900:fail",
      "materialize:failing-test:src/main.js",
      "change:WO-901:widen",
      "verify:WO-901:pass",
    ]);
    const events = decodeLog(host.store.read());
    const activations = events.filter(
      (e) => e.type === "PortfolioOrderActivated",
    );
    assert.equal(activations.length, 2);
    for (const event of activations) {
      const { activation } = event.payload as any;
      assert.equal(activation.order.grant.grantedBy, "host-policy");
      assert.equal(activation.order.grant.grantId, "portfolio:gardener-5s");
      assert.equal(activation.provenance.kind, "runtime");
      assert.equal(activation.provenance.sourceId, activation.order.sourceId);
      const dispatch = events[events.indexOf(event) - 1]!;
      assert.equal(dispatch.type, "ScriptEpisodeDispatched");
      assert.equal((dispatch.payload as any).kind, "portfolio");
    }
    const observed = events.filter((e) => e.type === "PortfolioOrderObserved");
    assert.deepEqual(
      observed.map((e) => [
        (e.payload as any).verified,
        (e.payload as any).portfolio.workOrderId,
      ]),
      [
        [false, "WO-900"],
        [true, "WO-901"],
      ],
    );
    assert.equal(advanced.portfolio.episodes, 2);
    assert.equal(advanced.portfolio.tokens, 14);
    // Budget: peak still admits the Sort move, yet it is a NoOp with the
    // reason, never a dispatch; one more episode would have activated it.
    assert.equal(
      withBudget(advanced, { episodes: 3, wallMs: 60000 }, "peak"),
      "misplaced-file:loose/guide.md",
    );
    at = 50;
    await host.tick(); // peak: budget spent
    assert.equal(resident(host).machine!.state, "peak");
    at = 60;
    await host.tick();
    const after = decodeLog(host.store.read());
    const refusals = after.filter((e) => e.type === "ScriptEpisodeRefused");
    assert.equal(refusals.length, 1);
    assert.match(
      (refusals[0]!.payload as any).reason,
      /portfolio gardener-5s v1 budget exhausted: 2 of 2 episodes/,
    );
    assert.equal(
      after.filter(
        (e) =>
          e.type === "ScriptEpisodeDispatched" &&
          (e.payload as any).kind === "portfolio",
      ).length,
      2,
    );
    assert.equal(calls.length, 6);
    // Replay is deterministic; a rewritten activation or verdict does not fold.
    const log = host.store.read();
    assert.equal(
      JSON.stringify(replayResident(log)),
      JSON.stringify(replayResident(log)),
    );
    const rewrite = (edit: (event: any) => void) =>
      log
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const event = JSON.parse(line);
          edit(event);
          return JSON.stringify(event);
        })
        .join("\n") + "\n";
    assert.throws(
      () =>
        replayResident(
          rewrite((e) => {
            if (e.type === "PortfolioOrderActivated")
              e.payload.activation.order.surfaces = ["src"];
          }),
        ),
      /portfolio activation differs/,
    );
    assert.throws(
      () =>
        replayResident(
          rewrite((e) => {
            if (e.type === "PortfolioOrderObserved") {
              e.payload.verified = true;
              e.payload.portfolio.verification = {
                verdict: "fail",
                criteria: 1,
                passed: 0,
                findings: 1,
              };
            }
          }),
        ),
      /verification contradicts/,
    );
    t.diagnostic(
      JSON.stringify({
        calls,
        states: ["widen", "probe", "widen", "peak"],
        noOp: (refusals[0]!.payload as any).reason,
      }),
    );
  } finally {
    host.close();
  }
});

test("WO-100 spent wall time or reported tokens refuse the next phase while it still admits a candidate", async (t) => {
  for (const { budget, elapsed, tokens, reason } of [
    {
      budget: { episodes: 5, wallMs: 15 },
      elapsed: 20,
      tokens: 0,
      reason:
        "portfolio gardener-5s v1 budget exhausted: 20 of 15 ms wall time",
    },
    {
      budget: { episodes: 5, wallMs: 60000, tokens: 5 },
      elapsed: 0,
      tokens: 7,
      reason:
        "portfolio gardener-5s v1 budget exhausted: 7 of 5 reported tokens",
    },
  ]) {
    const root = scratch(t);
    seed(root);
    const store = scratch(t);
    const configuration = residentConfiguration(root, {
      ...fixturePortfolio(),
      budget,
    });
    let at = 0;
    const calls: string[] = [];
    const host = new ResidentHost({
      directory: store,
      policyId: configuration.policyId,
      configuration,
      now: () => at,
      capabilities: () => ["adapter.fixture"],
      portfolio: {
        async materialize(activation) {
          calls.push(activation.order.candidateId);
          return {
            workOrderId: "WO-900",
            workOrderPath: "docs/work-orders/derived/WO-900-derived.md",
          };
        },
        async change() {
          at += elapsed; // the episode's own resident-clock duration
          return {
            status: "observed",
            commit: "c".repeat(40),
            branch: "dotln-portfolio-fixture",
            diffHash: "sha256:fixture",
          };
        },
        async verify() {
          return {
            verdict: "pass",
            criteria: 1,
            passed: 1,
            findings: 0,
            tokens,
          };
        },
      },
    });
    await host.start();
    try {
      await recordPresence(store, "away", () => at);
      at = 10;
      await host.tick(); // probe
      at = 20;
      await host.tick(); // widen: failing lint, verified
      const spent = resident(host);
      assert.equal(spent.machine!.state, "peak");
      assert.deepEqual(
        [
          spent.portfolio.episodes,
          spent.portfolio.wallMs,
          spent.portfolio.tokens,
        ],
        [1, elapsed, tokens],
      );
      // Episodes remain, and peak admits the next order: only the spent
      // resource can refuse it.
      assert.equal(
        withBudget(spent, { episodes: 5, wallMs: 60000 }, "peak"),
        "failing-test:src/main.js",
      );
      at += 10;
      await host.tick(); // peak: refused
      at += 10;
      await host.tick();
      const events = decodeLog(host.store.read());
      assert.deepEqual(
        events
          .filter((e) => e.type === "ScriptEpisodeRefused")
          .map((e) => (e.payload as any).reason),
        [reason],
      );
      assert.equal(
        events.filter((e) => e.type === "PortfolioOrderActivated").length,
        1,
      );
      assert.deepEqual(calls, ["failing-lint:src/main.js"]);
    } finally {
      host.close();
    }
  }
});

test("WO-100 an unbound resident reports the portfolio actor unavailable and dispatches nothing", async (t) => {
  const root = scratch(t);
  seed(root);
  const store = scratch(t);
  const configuration: ResidentConfiguration = residentConfiguration(root);
  let at = 0;
  const host = new ResidentHost({
    directory: store,
    policyId: configuration.policyId,
    configuration,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
  });
  await host.start();
  try {
    await recordPresence(store, "away", () => at);
    at = 10;
    await host.tick();
    at = 20;
    await host.tick();
    const events = decodeLog(host.store.read());
    const unavailable = events.filter((e) => e.type === "ActorUnavailable");
    assert.deepEqual(
      unavailable.map((e) => (e.payload as any).reason),
      [PORTFOLIO_UNBOUND],
    );
    assert.equal(
      events.filter((e) => e.type === "PortfolioOrderActivated").length,
      0,
    );
  } finally {
    host.close();
  }
  assert.throws(
    () =>
      residentConfiguration(root, {
        ...fixturePortfolio(),
        phases: { peak: { effects: WRITE, files: 2 } },
      }),
    /portfolio ceiling for its phase/,
  );
  assert.throws(
    () => residentConfiguration(root, fixturePortfolio(), 1),
    /reserves fewer files than its phase ceiling/,
  );
});

test("WO-100 a kill records what WO-052 observed: nothing before the change, the commit and skipped verification after it", async () => {
  const candidate = {
    candidateId: "failing-lint:src/main.js",
    kind: "failing-lint" as const,
    paths: ["src/main.js"],
    evidence: ["failing-lint:src/main.js"],
    size: { files: 1 },
  };
  const derivations = deriveWorkOrders(
    [candidate],
    fixturePortfolio(),
    phase("widen"),
    { baseCommit: BASE },
  );
  const order = derivations[0]!.kind === "order" ? derivations[0]!.order : null;
  assert.ok(order);
  const activation = {
    portfolioId: "gardener-5s",
    version: 1,
    phaseId: "widen",
    discoveryEpisodeId: "fixture",
    order,
    provenance: { kind: "runtime" as const, sourceId: order.sourceId },
    outcomes: summarizeDerivations(derivations),
  };
  const spec: ActorSpec = {
    kind: "portfolio",
    effect: "repo.write",
    surface: "fixture.source",
    resources: { files: 1, lines: 0, tokens: 0 },
  };
  const calls: string[] = [];
  let release!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve));
  const ports: PortfolioPorts = {
    async materialize() {
      calls.push("materialize");
      return {
        workOrderId: "WO-900",
        workOrderPath: "docs/work-orders/derived/WO-900-derived.md",
      };
    },
    async change() {
      calls.push("change");
      await gate;
      return {
        status: "observed",
        commit: "c".repeat(40),
        branch: "dotln-portfolio-fixture",
        diffHash: "sha256:fixture",
        tokens: 3,
      };
    },
    async verify() {
      calls.push("verify");
      throw new Error("verification must not run after a kill");
    },
  };
  const context = { residentStore: "/nonexistent", episodeId: "episode" };
  const early = portfolioAdapter(ports).run(spec, {
    ...context,
    portfolio: activation,
  });
  early.kill();
  const before = await early.completed;
  assert.equal(before.verified, false);
  assert.equal(before.portfolio!.change.status, "refused");
  assert.deepEqual(calls, ["materialize"]);
  const late = portfolioAdapter(ports).run(spec, {
    ...context,
    portfolio: activation,
  });
  await new Promise((resolve) => setImmediate(resolve));
  late.kill();
  release();
  const after = await late.completed;
  assert.equal(after.verified, false);
  assert.deepEqual(after.portfolio!.change, {
    status: "observed",
    commit: "c".repeat(40),
    branch: "dotln-portfolio-fixture",
    diffHash: "sha256:fixture",
  });
  assert.deepEqual(after.portfolio!.verification, {
    verdict: "not-run",
    reason: "killed before verification",
  });
  assert.equal(after.portfolio!.tokens, 3);
  assert.deepEqual(calls, ["materialize", "materialize", "change"]);
});
