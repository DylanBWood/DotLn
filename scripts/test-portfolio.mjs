// WO-100 end to end: reviewed portfolio text in dotln.config.json, the WO-119
// producer over its fixture repository, WO-120 durable identities in the
// index, and a resident whose derived orders change source through a WO-052
// SourceChangeHost and are judged by a WO-054 VerificationHost. The worker and
// the verifier are doubles over a scratch target; every host is the real one.
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  appendFileSync,
  chmodSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { TOOL_ROOT, docPath, docRelative, loadConfig } from "./lib/config.mjs";
import { materializeOrder, replayAllocations } from "./lib/derived-orders.mjs";
import { readControl } from "./lib/control-store.mjs";
import { readIndex } from "./work-orders.mjs";
import { decodeLog } from "../packages/kernel/dist/src/index.js";
import {
  compileLoadout,
  requireCompiled,
} from "../packages/compiler/dist/src/index.js";
import { discover } from "../packages/skeleton/dist/src/discovery.js";
import {
  decodePortfolio,
  deriveWorkOrders,
  summarizeDerivations,
} from "../packages/skeleton/dist/src/portfolio.js";
import { portfolioExecution } from "../packages/skeleton/dist/src/portfolio-host.js";
import { fixtureVerificationResult } from "../packages/skeleton/dist/src/verification-fake.js";
import { parseEvidenceResult } from "../packages/skeleton/dist/src/verification-protocol.js";
import { ResidentHost } from "../packages/skeleton/dist/src/resident-host.js";
import {
  recordPresence,
  replayResident,
} from "../packages/skeleton/dist/src/resident-store.js";
import { decodeResidentConfiguration } from "../packages/skeleton/dist/src/resident-state.js";

const read = (path) => JSON.parse(readFileSync(join(TOOL_ROOT, path), "utf8"));
const repository = read(
  "packages/skeleton/fixtures/wo119-discovery/repository.json",
);
const presence = read("packages/skeleton/fixtures/wo100-portfolio.json");
const artifactIdentity = read(
  "packages/skeleton/fixtures/wo051-inspection-baseline.json",
).request.artifactIdentity;
const WRITE = ["git.local", "repo.read", "repo.write", "shell.run"];

const git = (cwd, ...args) =>
  execFileSync(
    "git",
    [
      "-c",
      "core.hooksPath=/dev/null",
      "-c",
      "commit.gpgsign=false",
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      ...args,
    ],
    { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  ).trim();
const write = (root, path, source) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), source);
};

/** The reviewed text: 5S maintenance of one registered scratch repository. */
const portfolioText = (overrides = {}) => ({
  version: 1,
  repo: "scratch",
  mechanics: ["shine", "sort"],
  surfaces: ["docs", "generated", "loose/guide.md", "src"],
  phases: {
    widen: { effects: WRITE, files: 1 },
    peak: { effects: WRITE, files: 2 },
  },
  budget: { episodes: 2, wallMs: 600000 },
  verification: {
    "failing-lint": ["node checks/lint.cjs"],
    "failing-test": ["node checks/test.cjs"],
    "misplaced-file": ["node checks/test.cjs"],
  },
  ...overrides,
});
const configuration = (portfolios) => ({
  version: 1,
  repositories: {
    scratch: {
      baseBranch: "main",
      worktreeParent: "../scratch-worktrees",
      repositoryClass: "scratch",
      authorityProfile: {
        authorityEnvelopeId: "fixture.scratch",
        allowedEffects: [...WRITE, "repo.inspect"],
        deniedEffects: ["repo.delete"],
        resourceLimits: { files: 8 },
        requiredEvidence: [],
        expiresAt: Number.MAX_SAFE_INTEGER,
        revocationEventTypes: [],
      },
    },
  },
  portfolios,
});

async function fixture(fn) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-portfolio-")));
  try {
    // The launchpad: WO-120's control plane and the reviewed configuration.
    const launchpad = join(root, "launchpad");
    mkdirSync(launchpad);
    write(
      launchpad,
      "dotln.config.json",
      JSON.stringify(configuration({ "gardener-5s": portfolioText() })),
    );
    write(
      launchpad,
      docRelative(launchpad, "planning", "sequence.md"),
      "# Sequence\n\n<!-- dotln-work-order-sequence:start -->\n<!-- dotln-work-order-sequence:end -->\n",
    );
    mkdirSync(docPath(launchpad, "workOrders"), { recursive: true });
    write(
      launchpad,
      ".gitignore",
      `${docRelative(launchpad, "control", "local")}\n`,
    );
    git(launchpad, "init", "-q", "--initial-branch=main");
    git(launchpad, "add", ".");
    git(launchpad, "commit", "-qm", "Fixture launchpad");
    // The registered scratch target, seeded with WO-119's six candidates.
    const target = join(root, "target");
    mkdirSync(target);
    for (const [path, contents] of Object.entries(repository.files))
      write(target, path, contents);
    write(
      target,
      ".dotln/discovery.json",
      JSON.stringify({
        checks: ["lint", "test"].map((kind) => ({
          kind,
          argv: [process.execPath, `checks/${kind}.cjs`],
          paths: ["src/main.js"],
        })),
        ...repository.conventions,
      }),
    );
    git(target, "init", "-q", "--initial-branch=main");
    git(target, "add", "-A");
    git(target, "commit", "-qm", "Scratch target");
    mkdirSync(join(root, "trees"));
    return await fn({
      root,
      launchpad,
      target,
      base: git(target, "rev-parse", "HEAD"),
    });
  } finally {
    // WO-054 snapshots are read-only; unlock them as WO-055's fixture does.
    const unlock = (path) => {
      const stat = lstatSync(path);
      if (stat.isSymbolicLink()) return;
      chmodSync(path, stat.isDirectory() ? 0o700 : 0o600);
      if (stat.isDirectory())
        for (const name of readdirSync(path)) unlock(join(path, name));
    };
    unlock(root);
    rmSync(root, { recursive: true, force: true });
  }
}

/** The Shine fix for each named check and a wrong fix for any other. */
const shine =
  (...fixes) =>
  (cwd, request) => {
    const file = join(cwd, "src/main.js");
    const check = request.workOrder.objective.includes("lint")
      ? "lint"
      : "test";
    const marker = { lint: "BAD_STYLE ", test: "BROKEN_RESULT" }[check];
    const source = readFileSync(file, "utf8");
    writeFileSync(
      file,
      fixes.includes(check)
        ? source.replace(marker, "")
        : `${source}// attempted\n`,
    );
    git(cwd, "add", "src/main.js");
  };
/** WO-052 double: a writer that edits and commits inside its worktree; the
 * host refuses any committed path outside the declared surfaces. */
function writer(log, edit) {
  return {
    name: "fake",
    harnessVersion: "fixture",
    dispatch(request, now) {
      edit(request.cwd, request);
      git(request.cwd, "commit", "-q", "-F", request.commitMessagePath);
      appendFileSync(log, `${request.workOrder.workOrderId}\n`);
      const sha = git(request.cwd, "rev-parse", "HEAD");
      return {
        receipt: Promise.resolve({
          commandId: request.command.commandId,
          transport: "fake",
          acceptedAt: now(),
        }),
        completed: Promise.resolve({
          envelope: {
            workOrderId: request.workOrder.workOrderId,
            episodeId: request.episodeId,
            status: "completed",
            resultId: `result_${request.command.commandId}`,
            summary: "Synthetic portfolio writer",
            requiresHuman: false,
            observedCommit: {
              sha,
              branch: git(request.cwd, "symbolic-ref", "--short", "HEAD"),
            },
            observedDenials: "unavailable",
          },
        }),
        alive: () => false,
        kill: () => {},
      };
    },
  };
}
/** WO-054 double: the deterministic fixture verifier, judging the host-run
 * evidence in the capsule, with findings naming the order's own surfaces. */
const fixtureVerifier = ({
  requiresHuman = false,
  calls = [],
  surfaces: seen = [],
} = {}) => ({
  name: "fake",
  harnessVersion: "not-applicable",
  dispatch(request, now) {
    calls.push(request.capsule.workOrder.workOrderId);
    seen.push(request.capsule.criteria[0].codeSurfaces);
    const fixture = fixtureVerificationResult(
      request.capsule,
      request.episodeId,
      `result_${request.command.commandId}`,
    );
    const result = {
      ...fixture,
      envelope: { ...fixture.envelope, requiresHuman },
    };
    const surfaces = request.capsule.criteria[0].codeSurfaces;
    return {
      receipt: Promise.resolve({
        commandId: request.command.commandId,
        transport: "fake",
        acceptedAt: now(),
      }),
      completed: Promise.resolve(
        parseEvidenceResult(
          {
            ...result,
            findings: result.findings.map((f) => ({
              ...f,
              likelySurface: [...surfaces],
            })),
          },
          request,
        ),
      ),
      alive: () => false,
      kill: () => {},
    };
  },
});
const verifier = fixtureVerifier();
const materializer =
  (launchpad) =>
  (compiled, provenance, { surfaces }) =>
    materializeOrder(compiled, provenance, {
      root: launchpad,
      surfaces: [...surfaces],
    });

test("the configuration section is the reviewed portfolio text, validated under its registered repository", () =>
  fixture(async ({ launchpad }) => {
    const loaded = loadConfig(launchpad).portfolios["gardener-5s"];
    assert.deepEqual(decodePortfolio(loaded), loaded);
    assert.equal(loaded.portfolioId, "gardener-5s");
    const refuses = (portfolios, pattern) => {
      write(
        launchpad,
        "dotln.config.json",
        JSON.stringify(configuration(portfolios)),
      );
      assert.throws(() => loadConfig(launchpad), pattern);
    };
    refuses(
      {
        wide: portfolioText({
          phases: { peak: { effects: ["repo.delete"], files: 1 } },
        }),
      },
      /portfolios\.wide\.phases\.peak\.effects widens repositories\.scratch\.authorityProfile with repo\.delete/,
    );
    refuses(
      {
        big: portfolioText({ phases: { peak: { effects: WRITE, files: 9 } } }),
      },
      /exceeds repositories\.scratch\.authorityProfile\.resourceLimits\.files/,
    );
    refuses(
      { lost: portfolioText({ repo: "elsewhere" }) },
      /names no registered repository/,
    );
    refuses(
      { odd: portfolioText({ mechanics: ["seiton"] }) },
      /mechanics must be/,
    );
    refuses(
      { odd: { ...portfolioText(), extra: 1 } },
      /unknown portfolios\.odd key/,
    );
  }));

test("WO-100 criteria 1-3: derived orders materialize as indexed records, activate with host-policy provenance, change through WO-052, verify through WO-054, reset from a non-last phase on a failure, advance on a pass and stop at the budget with an in-phase candidate left", () =>
  fixture(async ({ root, launchpad, target, base }) => {
    const definition = decodePortfolio(
      loadConfig(launchpad).portfolios["gardener-5s"],
    );
    const program = requireCompiled(
      compileLoadout(presence.graph, presence.environment),
    );
    const phase = (id) =>
      program.presence[0].phases.find((p) => p.phaseId === id);
    const materialize = materializer(launchpad);

    // Criterion 1: every in-portfolio order becomes a durable, indexed record.
    const { candidates } = discover(target);
    const orders = new Map();
    const outside = new Map();
    for (const id of ["widen", "peak"])
      for (const d of deriveWorkOrders(candidates, definition, phase(id), {
        baseCommit: base,
      }))
        if (d.kind === "order") orders.set(d.order.sourceId, d.order);
        else if (d.kind !== "deferred") outside.set(d.candidateId, d.kind);
    assert.deepEqual(
      [...orders.values()].map((o) => o.candidateId),
      [
        "failing-lint:src/main.js",
        "failing-test:src/main.js",
        "misplaced-file:loose/guide.md",
      ],
    );
    assert.deepEqual([...outside.values()].sort(), [
      "NeedsHuman",
      "ProductSuggestion",
      "ProductSuggestion",
    ]);
    const identities = new Map();
    for (const order of orders.values())
      identities.set(
        order.sourceId,
        await materialize(
          order.workOrder,
          { kind: "runtime", sourceId: order.sourceId },
          {
            surfaces: order.surfaces,
          },
        ),
      );
    const rows = readIndex(launchpad, []).rows;
    for (const order of orders.values()) {
      const { workOrderId, workOrderPath } = identities.get(order.sourceId);
      const row = rows.find((r) => r.id === workOrderId);
      assert.equal(row.phase, "active");
      assert.deepEqual(row.provenance, {
        kind: "runtime",
        sourceId: order.sourceId,
      });
      const authority = readFileSync(join(launchpad, workOrderPath), "utf8");
      assert.match(
        authority,
        new RegExp(`\\*\\*Repository:\\*\\* scratch @ ${base}`),
      );
      assert.match(authority, /host-policy grant portfolio:gardener-5s v1/);
      for (const surface of order.surfaces)
        assert.ok(authority.includes(`- ${surface}`));
    }
    const allocations = replayAllocations(readControl(launchpad));
    assert.equal(allocations.size, orders.size); // suggestions and questions derive nothing
    execFileSync(
      process.execPath,
      [join(TOOL_ROOT, "scripts/work-orders.mjs"), "index", "--check"],
      {
        cwd: launchpad,
        env: { ...process.env, DOTLN_LAUNCHPAD: launchpad },
        stdio: "pipe",
      },
    );

    // Criteria 2 and 3: the resident's activation path through the real hosts.
    const store = join(root, "resident");
    const writes = join(root, "writes.log");
    writeFileSync(writes, "");
    const resident = decodeResidentConfiguration({
      ...presence,
      policyId: "fixture.portfolio",
      actors: {
        probe: {
          kind: "script",
          effect: "repo.inspect",
          surface: "fixture.source",
          resources: { files: 1, lines: 0, tokens: 0 },
          command: [
            process.execPath,
            join(TOOL_ROOT, "packages/skeleton/dist/src/discovery-cli.js"),
            target,
          ],
          cwd: target,
          timeoutMs: 20000,
          outputContract: "work-candidates-v1",
        },
        widen: {
          kind: "portfolio",
          effect: "repo.write",
          surface: "fixture.source",
          resources: { files: 1, lines: 0, tokens: 0 },
        },
        peak: {
          kind: "portfolio",
          effect: "repo.write",
          surface: "fixture.source",
          resources: { files: 2, lines: 0, tokens: 0 },
        },
      },
      evidence: ["verified-input"],
      portfolio: {
        definition: loadConfig(launchpad).portfolios["gardener-5s"],
        baseCommit: base,
      },
    });
    let at = 0;
    const host = new ResidentHost({
      directory: store,
      policyId: resident.policyId,
      configuration: resident,
      now: () => at,
      capabilities: () => ["adapter.fixture"],
      portfolio: portfolioExecution({
        materialize,
        target,
        directory: join(root, "portfolio"),
        source: {
          authorityEvidence: ["verified-input"],
          artifactIdentity,
          worktreeParent: join(root, "trees"),
          launchpadCheckout: TOOL_ROOT,
          model: "fixture",
          effort: "xhigh",
          // A wrong lint fix first, so WO-054 fails an order in widen.
          transport: writer(writes, shine("test")),
        },
        verifier: {
          transport: verifier,
          model: "fixture",
          effort: "xhigh",
        },
        now: () => at,
      }),
    });
    const state = () => replayResident(host.store.read()).state.resident;
    await host.start();
    try {
      await recordPresence(store, "away", () => at);
      at = 10;
      await host.tick();
      assert.equal(state().machine.state, "widen");
      const reasons = () =>
        JSON.stringify(
          decodeLog(host.store.read())
            .filter((e) => e.type === "PortfolioOrderObserved")
            .map((e) => e.payload.reason),
        );
      // widen is not the last phase: a pass would advance to peak, so probe
      // here can only be the failure transition's reset to the first phase.
      at = 20;
      await host.tick();
      assert.equal(state().machine.state, "probe", reasons());
      at = 30;
      await host.tick();
      assert.equal(state().machine.state, "widen");
      at = 40;
      await host.tick();
      assert.equal(state().machine.state, "peak", reasons());
      const events = decodeLog(host.store.read());
      const activations = events.filter(
        (e) => e.type === "PortfolioOrderActivated",
      );
      const observed = events.filter(
        (e) => e.type === "PortfolioOrderObserved",
      );
      assert.deepEqual(
        activations.map((e) => [
          e.payload.activation.phaseId,
          e.payload.activation.order.candidateId,
        ]),
        [
          ["widen", "failing-lint:src/main.js"],
          ["widen", "failing-test:src/main.js"],
        ],
      );
      for (const event of activations) {
        const { activation } = event.payload;
        assert.equal(activation.order.grant.grantedBy, "host-policy");
        assert.deepEqual(activation.provenance, {
          kind: "runtime",
          sourceId: activation.order.sourceId,
        });
      }
      // The same durable identity criterion 1 materialized; no second allocation.
      assert.ok(
        observed.every((e) => e.payload.portfolio),
        JSON.stringify(observed.map((e) => e.payload.reason)),
      );
      assert.deepEqual(
        observed.map((e) => [
          e.payload.portfolio.workOrderId,
          e.payload.portfolio.change.status,
          e.payload.portfolio.verification.verdict,
          e.payload.verified,
        ]),
        activations.map((e, i) => [
          identities.get(e.payload.activation.order.sourceId).workOrderId,
          "observed",
          i === 0 ? "fail" : "pass",
          i !== 0,
        ]),
      );
      assert.equal(replayAllocations(readControl(launchpad)).size, orders.size);
      // Each change touched only its derived surfaces, on its own branch.
      for (const event of observed) {
        const { commit } = event.payload.portfolio.change;
        assert.deepEqual(
          git(target, "diff", "--name-only", base, commit).split("\n"),
          ["src/main.js"],
        );
      }
      assert.equal(git(target, "rev-parse", "HEAD"), base);
      // Criterion 3: peak still admits the Sort move, yet the spent budget is
      // a reasoned NoOp; nothing dispatches past it.
      const left = state();
      assert.ok(
        deriveWorkOrders(
          left.discovery.report.candidates,
          definition,
          phase("peak"),
          { baseCommit: base },
        ).some(
          (d) =>
            d.kind === "order" &&
            d.order.candidateId === "misplaced-file:loose/guide.md" &&
            !left.portfolio.sources.includes(d.order.sourceId),
        ),
      );
      at = 50;
      await host.tick();
      assert.equal(state().machine.state, "peak");
      at = 60;
      await host.tick();
      const after = decodeLog(host.store.read());
      const refused = after.filter((e) => e.type === "ScriptEpisodeRefused");
      assert.equal(refused.length, 1);
      assert.match(
        refused[0].payload.reason,
        /budget exhausted: 2 of 2 episodes/,
      );
      assert.equal(readFileSync(writes, "utf8").trim().split("\n").length, 2);
      assert.equal(
        after.filter(
          (e) =>
            e.type === "ScriptEpisodeDispatched" &&
            e.payload.kind === "portfolio",
        ).length,
        2,
      );
      console.log(
        `# ${JSON.stringify({
          identities: [...identities.values()].map((i) => i.workOrderId),
          activations: activations.map(
            (e) => e.payload.activation.order.candidateId,
          ),
          verdicts: observed.map(
            (e) => e.payload.portfolio.verification.verdict,
          ),
          states: ["widen", "probe", "widen", "peak"],
          noOp: refused[0].payload.reason,
        })}`,
      );
    } finally {
      host.close();
    }
  }));

test("a Sort move passes only when the host sees the exact relocation and its named check passes, also for a check naming no path in both trees; a copy fails before any verifier runs, and a verifier's human escalation fails the order", () =>
  fixture(async ({ root, launchpad, target }) => {
    // A reviewed placement check, committed before the bound base.
    write(
      target,
      "checks/placement.cjs",
      "const fs = require('node:fs'); process.exit(fs.existsSync('docs/guide.md') && !fs.existsSync('loose/guide.md') ? 0 : 1);\n",
    );
    git(target, "add", "checks/placement.cjs");
    git(target, "commit", "-qm", "Placement check");
    const sortChecked = (command) =>
      decodePortfolio({
        ...loadConfig(launchpad).portfolios["gardener-5s"],
        verification: {
          "failing-lint": ["node checks/lint.cjs"],
          "misplaced-file": [command],
        },
      });
    let definition = sortChecked("node checks/placement.cjs");
    const program = requireCompiled(
      compileLoadout(presence.graph, presence.environment),
    );
    const peak = program.presence[0].phases.find((p) => p.phaseId === "peak");
    // Each bound base is a separate durable identity for the same candidate.
    const derivations = [];
    const derive = () =>
      derivations.splice(
        0,
        derivations.length,
        ...deriveWorkOrders(discover(target).candidates, definition, peak, {
          baseCommit: git(target, "rev-parse", "HEAD"),
        }),
      );
    derive();
    const activation = (candidateId) => {
      const { order } = derivations.find(
        (d) => d.kind === "order" && d.order.candidateId === candidateId,
      );
      return {
        portfolioId: definition.portfolioId,
        version: definition.version,
        phaseId: "peak",
        discoveryEpisodeId: "fixture",
        order,
        provenance: { kind: "runtime", sourceId: order.sourceId },
        outcomes: summarizeDerivations(derivations),
      };
    };
    const writes = join(root, "writes.log");
    writeFileSync(writes, "");
    const run = async (candidateId, edit, verifierOptions, directory) => {
      const calls = [];
      const ports = portfolioExecution({
        materialize: materializer(launchpad),
        target,
        directory: join(root, directory),
        source: {
          authorityEvidence: ["verified-input"],
          artifactIdentity,
          worktreeParent: join(root, "trees"),
          launchpadCheckout: TOOL_ROOT,
          model: "fixture",
          effort: "xhigh",
          transport: writer(writes, edit),
        },
        verifier: {
          transport: fixtureVerifier({ ...verifierOptions, calls }),
          model: "fixture",
          effort: "xhigh",
        },
        now: () => 10,
      });
      const a = activation(candidateId);
      const identity = await ports.materialize(a);
      const change = await ports.change(a, identity);
      assert.equal(change.status, "observed");
      return { verdict: await ports.verify(a, identity, change), calls };
    };
    const move = (cwd) => {
      mkdirSync(join(cwd, "docs"), { recursive: true });
      git(cwd, "mv", "loose/guide.md", "docs/guide.md");
    };
    const moved = await run("misplaced-file:loose/guide.md", move, {}, "moved");
    assert.deepEqual(moved.verdict, {
      verdict: "pass",
      criteria: 2,
      passed: 2,
      findings: 0,
    });
    assert.equal(moved.calls.length, 1);
    // A second bound base is a second durable identity; the copy leaves the
    // misplaced file in place, so the host check fails and no verifier runs.
    git(target, "commit", "-q", "--allow-empty", "-m", "Move the base");
    derive();
    const copy = (cwd) => {
      mkdirSync(join(cwd, "docs"), { recursive: true });
      writeFileSync(
        join(cwd, "docs/guide.md"),
        readFileSync(join(cwd, "loose/guide.md")),
      );
      git(cwd, "add", "docs/guide.md");
    };
    const copied = await run(
      "misplaced-file:loose/guide.md",
      copy,
      {},
      "copied",
    );
    assert.deepEqual(copied.verdict, {
      verdict: "fail",
      criteria: 2,
      passed: 0,
      findings: 1,
    });
    assert.deepEqual(copied.calls, []);
    // A lint fix whose host evidence passes still fails on human escalation.
    const escalated = await run(
      "failing-lint:src/main.js",
      shine("lint"),
      { requiresHuman: true },
      "escalated",
    );
    assert.equal(escalated.verdict.verdict, "fail");
    assert.equal(escalated.verdict.passed, 1);
    assert.equal(escalated.calls.length, 1);
    // VER-001 F1: `npm test` names no path in both trees. WO-054 still runs
    // it, over a criterion on the files both trees hold, and admits its verdict.
    definition = sortChecked("npm test");
    const npmTest = (script) => {
      write(
        target,
        "package.json",
        `${JSON.stringify({ private: true, scripts: { lint: "node checks/lint.cjs", test: script } })}\n`,
      );
      git(target, "commit", "-qam", `npm test runs ${script}`);
      derive();
    };
    npmTest("node checks/placement.cjs");
    const shared = git(target, "ls-tree", "-r", "--name-only", "HEAD")
      .split("\n")
      .filter((path) => path !== "loose/guide.md")
      .sort();
    const surfaces = [];
    const pathless = await run(
      "misplaced-file:loose/guide.md",
      move,
      { surfaces },
      "pathless",
    );
    assert.deepEqual(pathless.verdict, {
      verdict: "pass",
      criteria: 2,
      passed: 2,
      findings: 0,
    });
    assert.equal(pathless.calls.length, 1);
    assert.deepEqual(surfaces, [shared]);
    // The same exact move fails when the pathless check fails.
    npmTest("node checks/placement.cjs && node checks/test.cjs");
    const failing = await run(
      "misplaced-file:loose/guide.md",
      move,
      {},
      "pathless-failing",
    );
    assert.deepEqual(failing.verdict, {
      verdict: "fail",
      criteria: 2,
      passed: 1,
      findings: 1,
    });
    assert.equal(failing.calls.length, 1);
    const identities = [...replayAllocations(readControl(launchpad)).keys()];
    assert.equal(identities.length, 5);
    console.log(
      `# ${JSON.stringify({ identities, moved: moved.verdict, copied: copied.verdict, escalated: escalated.verdict, pathless: pathless.verdict, failing: failing.verdict })}`,
    );
  }));
