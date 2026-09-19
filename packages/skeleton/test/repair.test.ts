import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import {
  compileVerificationTask,
  type VerificationFinding,
} from "@dotln/compiler";
import { decodeLog, replay } from "@dotln/kernel";
import {
  initialState,
  seiriReactor,
  projectRuntimeEnvironment,
} from "../src/reactor.js";
import { RepairHost } from "../src/repair-host.js";
import {
  deriveRepairOrder,
  repairContract,
  repairHash,
  repairNextAction,
  type RepairScopeGrant,
} from "../src/repair.js";
import {
  createRepairFixture,
  fixtureHost,
  repairFixtureOptions,
  disposeRepairFixture,
} from "./repair-fixture.js";
import { snapshotResult } from "./verification-worktree-fixture.js";
import { fixtureGit } from "./source-change-fixture.js";
import type { EvidenceWorkerRequest } from "../src/verification-protocol.js";

const rows = (root: string, file: string) =>
  readFileSync(join(root, file), "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((s) => JSON.parse(s));
const findingFor = (
  fixture: Awaited<ReturnType<typeof createRepairFixture>>,
) => {
  const capsule = compileVerificationTask(
    "fixture_verify",
    fixture.original.criteria,
    fixture.subject,
  );
  return snapshotResult({
    capsule,
    episodeId: "fixture",
    command: { commandId: "fixture" },
  } as EvidenceWorkerRequest).findings[0]!;
};

test("WO-055 AC1 pure derivation contains paths, commands, contract and admitted exact grants", async () => {
  const fixture = await createRepairFixture();
  try {
    const finding = findingFor(fixture);
    const input = { ...fixture.original, subject: fixture.subject, round: 0 };
    const before = JSON.stringify(input);
    const result = deriveRepairOrder(finding, input);
    assert.equal(result.kind, "derived");
    if (result.kind !== "derived") return;
    assert.deepEqual(
      result.order.surfaces,
      [...fixture.original.surfaces].sort(),
    );
    assert.deepEqual(
      result.order.tests.map((t) => t.command),
      ["node contract-test.mjs"],
    );
    assert.deepEqual(result.order.authorityEnvelope, input.authorityEnvelope);
    assert.deepEqual(
      result.order.workOrder.allowedOperations,
      input.workOrder.allowedOperations,
    );
    assert.deepEqual(
      result.order.workOrder.prohibitedOperations,
      input.workOrder.prohibitedOperations,
    );
    assert.equal(result.order.workOrder.baseCommit, input.workOrder.baseCommit);
    assert.equal(result.order.executionBaseCommit, fixture.subject.revision);
    assert.equal(
      result.order.contractHash,
      repairHash(repairContract(input.workOrder)),
    );
    assert.equal(result.order.round, 1);
    assert.equal(result.order.roundLimit, 2);
    assert.equal(JSON.stringify(input), before);
    assert.equal(
      deriveRepairOrder({ ...finding, evidenceRefs: [] }, input).kind,
      "NeedsHuman",
    );
    for (const [bad, offending] of [
      [{ ...finding, likelySurface: ["outside.txt"] }, "outside.txt"],
      [
        {
          ...finding,
          reproductionSteps: [...finding.reproductionSteps, "node outside.mjs"],
        },
        "node outside.mjs",
      ],
      [{ ...finding, evidenceRefs: ["missing"] }, "missing"],
    ] as const) {
      const refusal = deriveRepairOrder(bad, input);
      assert.equal(refusal.kind, "NeedsHuman");
      if (refusal.kind === "NeedsHuman")
        assert.equal(refusal.offending, offending);
    }
    for (const kind of ["path", "command"] as const) {
      const extra = kind === "path" ? "outside.txt" : "node outside.mjs";
      const bad: VerificationFinding =
        kind === "path"
          ? { ...finding, likelySurface: [extra] }
          : { ...finding, reproductionSteps: [extra] };
      const grant: RepairScopeGrant = {
        grant: {
          grantId: `grant-${kind}`,
          version: 1,
          grantedBy: "operator",
          effects: [kind === "path" ? "repo.write" : "shell.run"],
          operations: [kind === "path" ? "repo.write" : "shell.run"],
          repo: input.workOrder.repo,
          reason: "Exact fixture repair expansion",
        },
        surfaces: kind === "path" ? [extra] : [],
        tests: kind === "command" ? [extra] : [],
      };
      assert.equal(
        deriveRepairOrder(bad, input, { requested: [grant], registry: [] })
          .kind,
        "NeedsHuman",
      );
      const granted = deriveRepairOrder(bad, input, {
        requested: [grant],
        registry: [grant],
      });
      assert.equal(granted.kind, "derived");
      if (granted.kind === "derived") {
        assert.deepEqual(granted.order.grantIds, [grant.grant.grantId]);
        assert.deepEqual(
          granted.order.authorityEnvelope,
          input.authorityEnvelope,
        );
      }
      const broader = {
        ...grant,
        surfaces: [...grant.surfaces, "unrelated.txt"],
      };
      assert.equal(
        deriveRepairOrder(bad, input, {
          requested: [broader],
          registry: [broader],
        }).kind,
        "NeedsHuman",
      );
    }
  } finally {
    disposeRepairFixture(fixture.root);
  }
});

test("WO-055 AC2 failing source commit repairs once and re-verifies the complete original contract", async () => {
  const fixture = await createRepairFixture();
  try {
    const options = repairFixtureOptions(fixture.root);
    const transport = options.verifier.transport;
    const host = new RepairHost({
      ...options,
      verifier: {
        ...options.verifier,
        transport: {
          ...transport,
          dispatch(request: EvidenceWorkerRequest, now: () => number) {
            const run = transport.dispatch(request, now);
            return {
              ...run,
              completed: run.completed.then((result) =>
                result.kind === "verification"
                  ? {
                      ...result,
                      findings: result.findings.map((finding) => ({
                        ...finding,
                        reproductionSteps: [
                          ...finding.reproductionSteps,
                          "node fixture-test.mjs",
                        ],
                      })),
                    }
                  : result,
              ),
            };
          },
        },
      },
    });
    const state = await host.run();
    assert.equal(state.status, "complete");
    assert.equal(state.round, 1);
    const writers = rows(fixture.root, "repair-launches.jsonl"),
      verifiers = rows(fixture.root, "verifier-launches.jsonl");
    assert.equal(writers.length, 1);
    assert.equal(verifiers.length, 2);
    for (const v of verifiers) {
      assert.deepEqual(
        v.capsule.subject.snapshot.contract,
        repairContract(fixture.original.workOrder),
      );
      assert.deepEqual(v.capsule.criteria, fixture.original.criteria);
    }
    assert.notEqual(
      verifiers[0].episodeId,
      verifiers[1].episodeId,
      "physical verifier episodes are distinct across rounds",
    );
    assert.doesNotMatch(
      JSON.stringify(writers),
      /IMPLEMENTER_NARRATIVE_SENTINEL/u,
    );
    assert.deepEqual(writers[0].prompt.surfaces, state.order!.surfaces);
    assert.deepEqual(
      fixtureGit(
        host.sourceHost().tree.path,
        "diff",
        "--name-only",
        state.order!.executionBaseCommit,
        state.currentCommit,
      ).split("\n"),
      ["fixture.txt"],
    );
    const events = decodeLog(host.options.store.read());
    assert.deepEqual(
      (
        events.find((event) => event.type === "SourceChangeObserved")!
          .payload as any
      ).tests.map((test: any) => test.command),
      ["node contract-test.mjs", "node fixture-test.mjs"],
    );
    const replayed = replay(
      initialState(),
      events,
      seiriReactor,
      {},
      projectRuntimeEnvironment,
    ).state.repair;
    assert.deepEqual(replayed, state);
    assert.equal(events.filter((e) => e.type === "RepairCompleted").length, 1);
    const log = host.options.store.read();
    assert.deepEqual(await fixtureHost(fixture.root).run(), state);
    assert.equal(host.options.store.read(), log);
  } finally {
    disposeRepairFixture(fixture.root);
  }
});

test("WO-055 AC3 two wrong repairs exhaust with last finding and no third source dispatch", async () => {
  const fixture = await createRepairFixture();
  try {
    const host = fixtureHost(fixture.root, true),
      state = await host.run();
    assert.equal(state.status, "exhausted");
    assert.equal(state.round, 2);
    assert.equal(repairNextAction(state), "human");
    assert.equal(rows(fixture.root, "repair-launches.jsonl").length, 2);
    assert.equal(rows(fixture.root, "verifier-launches.jsonl").length, 3);
    const terminal = decodeLog(host.options.store.read()).at(-1)!;
    assert.equal(terminal.type, "RepairExhausted");
    assert.deepEqual((terminal.payload as any).finding, state.finding);
    assert.equal(
      existsSync(join(fixture.root, "repair-children/source-3")),
      false,
    );
  } finally {
    disposeRepairFixture(fixture.root);
  }
});

for (const cut of ["afterRepairCommit", "afterSnapshotPrepared"] as const)
  test(`WO-055 AC4 SIGKILL ${cut} resumes persisted continuation without another repair`, async () => {
    const fixture = await createRepairFixture();
    try {
      const script = `import {RepairHost} from ${JSON.stringify(new URL("../src/repair-host.js", import.meta.url).href)}; import {repairFixtureOptions} from ${JSON.stringify(new URL("./repair-fixture.js", import.meta.url).href)}; await new RepairHost({...repairFixtureOptions(process.argv[1]),[process.argv[2]](){process.kill(process.pid,'SIGKILL');}}).run();`;
      const killed = spawnSync(
        process.execPath,
        ["--input-type=module", "-e", script, fixture.root, cut],
        { encoding: "utf8", timeout: 60000 },
      );
      assert.equal(killed.signal, "SIGKILL", killed.stderr);
      assert.equal(rows(fixture.root, "repair-launches.jsonl").length, 1);
      assert.equal(rows(fixture.root, "verifier-launches.jsonl").length, 1);
      if (cut === "afterRepairCommit")
        mkdirSync(join(fixture.root, "repair-children/snapshot-1-0"));
      const host = fixtureHost(fixture.root);
      const state = await host.run();
      assert.equal(state.status, "complete");
      assert.equal(state.round, 1);
      assert.equal(rows(fixture.root, "repair-launches.jsonl").length, 1);
      assert.equal(rows(fixture.root, "verifier-launches.jsonl").length, 2);
    } finally {
      disposeRepairFixture(fixture.root);
    }
  });

test("WO-055 AC1 refused path or command persists byte-identical envelope and dispatches no writer", async () => {
  for (const kind of ["path", "command"] as const) {
    const fixture = await createRepairFixture();
    try {
      // A valid verifier may name criterion surfaces outside the writer's declared scope.
      const options = repairFixtureOptions(fixture.root);
      const original =
        kind === "path"
          ? { ...options.original, surfaces: ["fixture.txt"] }
          : options.original;
      const transport = options.verifier.transport;
      const verifier =
        kind === "command"
          ? {
              ...options.verifier,
              transport: {
                ...transport,
                dispatch(request: EvidenceWorkerRequest, now: () => number) {
                  const run = transport.dispatch(request, now);
                  return {
                    ...run,
                    completed: run.completed.then((result) => ({
                      ...result,
                      findings:
                        "findings" in result
                          ? result.findings.map((f) => ({
                              ...f,
                              reproductionSteps: [
                                ...f.reproductionSteps,
                                "node outside.mjs",
                              ],
                            }))
                          : [],
                    })),
                  };
                },
              },
            }
          : options.verifier;
      const host = new RepairHost({ ...options, original, verifier });
      const before = JSON.stringify(original.authorityEnvelope);
      const state = await host.run();
      assert.equal(state.status, "needs-human");
      assert.match(
        state.reason!,
        kind === "path" ? /test.mjs/u : /node outside.mjs/u,
      );
      assert.equal(JSON.stringify(state.original.authorityEnvelope), before);
      assert.equal(state.order, null);
      assert.equal(rows(fixture.root, "repair-launches.jsonl").length, 0);
      assert.equal(
        decodeLog(options.store.read()).some(
          (e) =>
            e.type === "RepairCommandPersisted" &&
            (e.payload as any).command.intent.effect === "repo.write",
        ),
        false,
      );
    } finally {
      disposeRepairFixture(fixture.root);
    }
  }
});
