import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { execFileSync, spawn } from "node:child_process";
import {
  chmodSync,
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import {
  compileLoadout,
  compileStoryContract,
  deriveSurfaces,
} from "@dotln/compiler";
import { appendEvent, decodeLog, replay } from "@dotln/kernel";
import {
  initialVerificationRuntime,
  seiriReactor,
  projectRuntimeEnvironment,
} from "../packages/skeleton/dist/src/reactor.js";
import {
  verticalFixture,
  fixtureBaselineAssessment,
  runState,
  json,
  put,
} from "./fixtures/vertical/fixture.mjs";
import { fixtureGit } from "../packages/skeleton/dist/test/source-change-fixture.js";
import {
  readVerticalConfiguration,
  createVerticalEntry,
  runVerticalIssue,
} from "./lib/vertical-runtime.mjs";
import { ResidentHost } from "../packages/skeleton/dist/src/resident-host.js";
import {
  recordPresence,
  replayResident,
  ResidentStore,
} from "../packages/skeleton/dist/src/resident-store.js";
import { WorkerStore } from "../packages/skeleton/dist/src/worker-store.js";
import {
  foldVertical,
  IntentPreparationRefusal,
  nextVerticalCommand,
  VERTICAL_STEPS,
} from "../packages/skeleton/dist/src/vertical.js";
import { fileIntent, replayAllocations } from "./lib/derived-orders.mjs";
import { readControl } from "./lib/control-store.mjs";
import {
  fetchIssueBundle,
  IssueSourceRefusal,
} from "../packages/skeleton/dist/src/github-issue-source.js";
import { createVerticalPrimitives } from "./lib/vertical-primitives.mjs";
import { verticalTransport } from "./lib/vertical-transport.mjs";
import {
  residentVerticalScheduling,
  verticalAuthorityObserver,
} from "../packages/skeleton/dist/src/vertical-scheduling.js";
import { decodeResidentConfiguration } from "../packages/skeleton/dist/src/resident-state.js";

async function addIssue(
  f,
  number,
  prose = `Implement https://github.com/dotln-fixture/target/issues/${number}`,
) {
  const filed = await fileIntent(prose, {
    root: f.launchpad,
    sourceId: `fixture-issue-${number}`,
  });
  const result = await fetchIssueBundle(
    "https://github.com/dotln-fixture/target",
    number,
    { directory: join(f.root, `initial-${number}`), cwd: f.launchpad },
  );
  const inferences = result.bundle.sections.map((s) => ({
    span: s.span,
    class:
      s === result.bundle.sections[0]
        ? "requirement"
        : "current-behavior observation",
    rationale: "Fixture classification.",
  }));
  f.config.issues.push({
    number,
    draftId: filed.workOrderId,
    revisionId: result.bundle.revisionId,
    inferences,
    baselineAssessment: fixtureBaselineAssessment(result.bundle, inferences),
  });
  put(join(f.directory, "vertical.json"), f.config);
  return { ...filed, bundle: result.bundle };
}

async function prepareFixture(f) {
  const cfg = readVerticalConfiguration(f.directory, f.launchpad);
  const entry = createVerticalEntry({
    directory: f.directory,
    configuration: cfg,
    now: f.now,
    external: f.external,
  });
  const phase = compileLoadout(cfg.resident.graph, cfg.resident.environment)
    .program.presence[0].phases[0];
  const input = await entry.ports.prepare(f.filed.workOrder, phase, {
    episodes: 0,
    wallMs: 0,
    tokens: 0,
  });
  const admission = admitIntent(input, cfg.portfolio, cfg.grants);
  assert.equal(admission.kind, "admitted", JSON.stringify(admission));
  return { cfg, entry, phase, input, binding: admission.binding };
}
const purePorts = (calls = []) => ({
  materialize: async (binding) => ({
    workOrder: { ...binding.workOrder, workOrderId: "WO-901" },
    workOrderPath: "fixture",
  }),
  execute: async (command) => {
    calls.push(command.step);
    return {
      result: "completed",
      value:
        command.step === "baseline"
          ? { storyClass: "defect", outcome: "reproduced" }
          : {},
    };
  },
});
async function configureResident(directory, configuration, now) {
  const store = new ResidentStore(directory);
  await store.transaction((tx) =>
    tx.append("ResidentConfigured", { configuration }),
  );
  await recordPresence(directory, "away", now);
  return store;
}
test("WO-123 resident admits an actual filed draft and resumes every completed step through the real primitive hosts", async () => {
  const f = await verticalFixture({
    budget: { episodes: 1 },
    extraHostGrant: true,
  });
  try {
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    let binding, state;
    let previousReceipts = [];
    for (let i = 0; i < 30; i++) {
      const entry = createVerticalEntry({
        directory: f.directory,
        configuration: cfg,
        now: f.now,
        external: f.external,
      });
      const host = new ResidentHost({
        directory: f.directory,
        policyId: cfg.resident.policyId,
        configuration: cfg.resident,
        now: f.now,
        capabilities: () => ["adapter.fixture"],
        vertical: entry.resident,
      });
      await host.start();
      try {
        if (i === 0) await recordPresence(f.directory, "away", f.now);
        f.setTime(120 + i);
        await host.tick();
        const resident = replayResident(host.store.read()).state.resident;
        const decision = resident.intents?.[f.filed.workOrderId];
        if (decision?.kind === "NeedsHuman")
          assert.fail(JSON.stringify(decision));
        binding = decision?.binding;
        if (binding) state = runState(f.directory, binding.key);
        if (state) {
          assert.deepEqual(
            state.receipts.slice(0, previousReceipts.length),
            previousReceipts,
          );
          previousReceipts = structuredClone(state.receipts);
        }
      } finally {
        host.close();
      }
      if (state?.terminal) break;
    }
    assert.equal(
      state?.terminal?.kind,
      "resolved",
      JSON.stringify({ root: f.root, terminal: state?.terminal }),
    );
    assert.deepEqual(
      state.receipts.map((r) => r.command.step),
      VERTICAL_STEPS,
    );
    assert.equal(
      new Set(state.receipts.map((r) => r.command.commandId)).size,
      state.receipts.length,
    );
    assert.deepEqual(f.counts, { baseline: 1, verification: 1, review: 1 });
    const baseline = state.receipts.find((r) => r.command.step === "baseline");
    assert.equal(baseline.value.storyClass, "defect");
    assert.equal(
      baseline.value.storyClassification.source.rule,
      "supplied-assertion-judgments",
    );
    assert.equal(
      baseline.value.classification.source.rule,
      "active-existing-failure-assertion",
    );
    const preparation = state.receipts.find(
      (r) => r.command.step === "preparation",
    );
    const delivery = json(
      join(
        state.receipts.find((r) => r.command.step === "source-change").value
          .store,
        "delivery-preparation.json",
      ),
    );
    assert.deepEqual(delivery.unresolvedMaterialAmbiguities, []);
    assert.ok(delivery.checks.tests.length > 0);
    assert.deepEqual(
      delivery.checks.tests,
      preparation.value.preparation.checks.tests,
    );
    for (const check of ["build", "lint"])
      assert.deepEqual(delivery.checks[check], {
        status: "not-applicable",
        reason: `The contract names no ${check} step.`,
      });
    assert.deepEqual(delivery.monitoring, {
      owner: "resident",
      repositoryId: cfg.repositoryId,
      headRevision: delivery.subjectRevision,
      command: "worktree resolve-pr",
      ciFailure: "classify-before-repair",
      reviewComments: "triage-by-type",
      sourceDrift: "stop",
      terminalState: "human-controlled",
    });
    assert.equal(
      readFileSync(join(f.root, "launches.txt"), "utf8"),
      "dispatch\n",
    );
    // The heading is always emitted; this sentence is not.
    assert.match(
      json(join(f.root, "published.json")).body,
      /^Deliverable-ready: ready; every applicable item is evidenced\.$/mu,
    );
    const verified = state.receipts.find(
      (r) => r.command.step === "verification",
    ).value.prepared.subject;
    const hostRun = delivery.checks.tests.map((id) =>
      verified.evidence.find((e) => e.evidenceId === id),
    );
    for (const evidence of hostRun) {
      assert.deepEqual(
        [
          evidence?.source,
          evidence?.outcome,
          evidence?.subjectRevision,
          evidence?.hostTest?.origin,
          evidence?.hostTest?.command,
        ],
        [
          "live",
          "pass",
          delivery.subjectRevision,
          "host",
          "node fixture-test.mjs",
        ],
      );
    }
    const saved = new WorkerStore(
      join(f.directory, "vertical", binding.key),
    ).read();
    const again = await runVerticalIssue({
      directory: f.directory,
      issue: 1,
      configuration: cfg,
      now: f.now,
      external: f.external,
    });
    assert.equal(again.terminal.kind, "resolved");
    assert.equal(
      new WorkerStore(join(f.directory, "vertical", binding.key)).read(),
      saved,
    );
    await addIssue(f, 10);
    const exhausted = await runVerticalIssue({
      directory: f.directory,
      issue: 10,
      configuration: readVerticalConfiguration(f.directory, f.launchpad),
      now: f.now,
      external: f.external,
    });
    assert.equal(exhausted.kind, "NeedsHuman");
    assert.match(exhausted.reason, /budget exhausted/u);
    assert.equal(
      readFileSync(join(f.root, "launches.txt"), "utf8"),
      "dispatch\n",
    );
  } finally {
    f.close();
  }
});

test("WO-123 one command repairs a blocking independent review, re-verifies and publishes the repaired lineage", async () => {
  const f = await verticalFixture({
    plantReview: true,
    reviewFindings(request, count) {
      return count === 1
        ? [
            {
              class: "review",
              findingId: "one-line",
              criterionId: request.capsule.criteria[0].criterionId,
              severity: "blocking",
              observed: "fixture.txt has an extra blank line.",
              expected: "Keep fixture.txt as a single line.",
              reproductionSteps: ["Read fixture.txt and CONVENTIONS.md."],
              evidenceRefs: [
                "conventions:CONVENTIONS.md",
                "file:fixture.txt",
                "diff",
              ],
              likelySurface: ["fixture.txt"],
            },
          ]
        : [
            {
              class: "review",
              findingId: "minor-wording",
              criterionId: request.capsule.criteria[0].criterionId,
              severity: "should",
              observed: "A future wording improvement is possible.",
              expected: "Keep the accepted behavior.",
              reproductionSteps: ["Read fixture.txt."],
              evidenceRefs: ["contract", "file:fixture.txt"],
              likelySurface: ["fixture.txt"],
            },
          ];
    },
  });
  try {
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const result = await runVerticalIssue({
      directory: f.directory,
      issue: 1,
      configuration: cfg,
      now: () => {
        f.tick();
        return f.now();
      },
      external: f.external,
    });
    assert.equal(
      result.terminal.kind,
      "resolved",
      JSON.stringify({ root: f.root, terminal: result.terminal }),
    );
    assert.equal(
      result.receipts.filter((r) => r.command.step === "repair").length,
      1,
    );
    assert.equal(
      result.receipts.filter((r) => r.command.step === "verification").length,
      2,
    );
    assert.equal(f.counts.review, 2);
    const repaired = result.receipts.find(
      (r) => r.command.step === "repair",
    ).value;
    assert.equal(json(join(f.root, "published.json")).head, repaired.commit);
    assert.match(
      json(join(f.root, "published.json")).body,
      /future wording improvement/u,
    );
    const verification = result.receipts.findLast(
      (r) => r.command.step === "verification",
    );
    const forged = decodeLog(
      new WorkerStore(verification.value.storePath).read(),
    );
    const producers = forged.find((e) => e.type === "VerificationOpened")
      .payload.implementerEpisodeIds;
    assert.ok(producers.length >= 2);
    forged.find(
      (e) => e.type === "WorkerAttemptStarted",
    ).payload.workerEpisodeId = producers[0];
    assert.throws(
      () =>
        replay(
          initialVerificationRuntime(forged[0].workstreamId),
          forged,
          seiriReactor,
          {},
          projectRuntimeEnvironment,
        ),
      /reuse|episode|attempt/u,
    );
    const childPath = join(repaired.store, "events.jsonl");
    const originalBytes = readFileSync(childPath, "utf8");
    const lint = result.receipts.find((r) => r.command.step === "lint").command;
    for (const field of ["workOrder", "authorityEnvelope"]) {
      const events = decodeLog(originalBytes);
      const payload = events.find((e) => e.type === "CommandPersisted").payload
        .command.intent.payload;
      if (field === "workOrder")
        payload.workOrder.objective = "An unrelated contract";
      else payload.authorityEnvelope.resourceLimits.files++;
      writeFileSync(
        childPath,
        events.map((e) => JSON.stringify(e)).join("\n") + "\n",
      );
      await assert.rejects(
        createVerticalPrimitives({
          configuration: cfg,
          directory: join(f.directory, "vertical", result.binding.key),
          now: f.now,
          external: f.external,
        }).execute(lint, result),
        /repair lineage child/u,
      );
      writeFileSync(childPath, originalBytes);
    }
  } finally {
    f.close();
  }
});

for (const failures of [1, 2])
  test(`WO-123 review failure ${failures} uses fresh bounded attempts`, async () => {
    const f = await verticalFixture({ reviewFailures: failures });
    try {
      const result = await runVerticalIssue({
        directory: f.directory,
        issue: 1,
        configuration: readVerticalConfiguration(f.directory, f.launchpad),
        now: () => {
          f.tick();
          return f.now();
        },
        external: f.external,
      });
      assert.equal(f.counts.review, 2);
      const receipts = result.receipts.filter(
        (r) => r.command.step === "review",
      );
      assert.deepEqual(
        receipts.map((r) => r.command.attempt),
        [0, 1],
      );
      const verification = result.receipts.find(
        (r) => r.command.step === "verification",
      );
      const starts = decodeLog(
        new WorkerStore(verification.value.storePath).read(),
      ).filter((e) => e.type === "WorkerAttemptStarted");
      assert.equal(
        new Set(starts.map((e) => e.payload.workerEpisodeId)).size,
        starts.length,
      );
      if (failures === 1)
        assert.equal(
          result.terminal.kind,
          "resolved",
          JSON.stringify(result.terminal),
        );
      else {
        assert.deepEqual(
          [result.terminal.kind, result.terminal.step],
          ["NeedsHuman", "review"],
        );
        assert.ok(!result.receipts.some((r) => r.command.step === "publish"));
        assert.ok(
          !readFileSync(join(f.root, "calls.jsonl"), "utf8").includes(
            '"git-push"',
          ),
        );
      }
    } finally {
      f.close();
    }
  });

import {
  admitIntent,
  baselineClass,
  baselineStoryClass,
  verticalProgram,
} from "../packages/skeleton/dist/src/vertical.js";
import { VerticalHost } from "../packages/skeleton/dist/src/vertical-host.js";
import { verticalResident } from "../packages/skeleton/dist/src/vertical-resident.js";
import { checkPathIdentity } from "./fixtures/vertical/path-identity.mjs";

test("WO-123 admission holds declared negative inputs before materialization or dispatch; filesystem identity refusals leave no residue", async () => {
  const f = await verticalFixture();
  try {
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: f.external,
    });
    const draft = (await entry.ports.drafts())[0];
    const phase = compileLoadout(cfg.resident.graph, cfg.resident.environment)
      .program.presence[0].phases[0];
    const input = await entry.ports.prepare(draft, phase, {
      episodes: 0,
      wallMs: 0,
      tokens: 0,
    });
    const accepted = admitIntent(input, cfg.portfolio, cfg.grants);
    assert.equal(accepted.kind, "admitted", JSON.stringify(accepted));
    assert.equal(
      accepted.binding.statements.surfaceDerivation.beforeAdmission,
      true,
    );
    assert.equal(
      accepted.binding.statements.surfaceDerivation.authorityEnvelopeId,
      phase.effectiveEnvelope.authorityEnvelopeId,
    );
    assert.match(accepted.binding.statements.draftConstraint, /supersedes/u);
    assert.equal(
      baselineClass(
        accepted.binding.contract,
        "new",
        accepted.binding.baselineAssessment,
      ).findings.length,
      1,
    );
    const ambiguous = { ...input, inferences: input.inferences.slice(0, 1) };
    const ambiguousContract = compileStoryContract(
      ambiguous.bundle,
      ambiguous.inferences,
    );
    assert.equal(
      ambiguousContract.criteria.filter((c) => c.status === "active").length,
      1,
    );
    assert.equal(ambiguousContract.openDecisions.length, 1);
    const unavailableSnapshot = { ...input, snapshot: null };
    const derivation = deriveSurfaces(
      accepted.binding.contract,
      input.profile,
      null,
    );
    assert.equal(derivation.kind, "NeedsHuman");
    const cases = [
      [
        "no-portfolio",
        input,
        undefined,
        cfg.grants,
        "admission",
        "portfolio: portfolio must be an object",
      ],
      [
        "over-ceiling",
        input,
        { ...cfg.portfolio, surfaces: ["elsewhere"] },
        cfg.grants,
        "surfaces",
        "derived surfaces exceed the intent portfolio ceiling",
      ],
      [
        "no-criteria",
        { ...input, inferences: [] },
        cfg.portfolio,
        cfg.grants,
        "contract",
        "contract has no executable criteria",
      ],
      [
        "one-ambiguity",
        ambiguous,
        cfg.portfolio,
        cfg.grants,
        "contract",
        `contract has unresolved material decisions: ${ambiguousContract.openDecisions[0].decisionId}`,
      ],
      [
        "malformed-draft",
        { ...input, draft: { ...draft, allowedOperations: "invalid" } },
        cfg.portfolio,
        cfg.grants,
        "admission",
        "draft lists cannot be decoded",
      ],
      [
        "malformed-entry",
        input,
        { ...cfg.portfolio, unexpected: true },
        cfg.grants,
        "admission",
        'portfolio: portfolio has unknown key "unexpected"',
      ],
      [
        "malformed-grant",
        input,
        cfg.portfolio,
        [null],
        "admission",
        "authorityGrants[0] has invalid grant",
      ],
      [
        "missing-grant",
        input,
        cfg.portfolio,
        [],
        "admission",
        "no admitted remote-only target grant for repo.push",
      ],
      [
        "mixed-grant",
        input,
        cfg.portfolio,
        cfg.grants.map((g) => ({
          ...g,
          effects: [...g.effects, "repo.read"],
          operations: [...g.operations, "repo.read"],
        })),
        "admission",
        "no admitted remote-only target grant for repo.push",
      ],
      [
        "host-policy-grant",
        input,
        cfg.portfolio,
        cfg.grants.map((g) => ({ ...g, grantedBy: "host-policy" })),
        "admission",
        "no admitted remote-only target grant for repo.push",
      ],
      [
        "derivation",
        unavailableSnapshot,
        cfg.portfolio,
        cfg.grants,
        "surfaces",
        derivation.reason,
      ],
      [
        "malformed-snapshot",
        { ...input, snapshot: [] },
        cfg.portfolio,
        cfg.grants,
        "surfaces",
        "intent input cannot be decoded",
      ],
      [
        "exhausted-budget",
        {
          ...input,
          spent: {
            episodes: cfg.portfolio.budget.episodes,
            wallMs: 0,
            tokens: 0,
          },
        },
        cfg.portfolio,
        cfg.grants,
        "admission",
        "intent portfolio budget exhausted",
      ],
    ];
    for (const [name, prepared, portfolio, grants, step, reason] of cases) {
      const decision = admitIntent(prepared, portfolio, grants);
      assert.deepEqual(decision, { kind: "NeedsHuman", step, reason }, name);
      if (name === "exhausted-budget") continue;
      // The resident records the pure hold before materialization or Invoke.
      const dir = join(f.root, `held-${name}`);
      let writes = 0;
      const ports = {
        drafts: async () => [prepared.draft],
        portfolio: () => portfolio,
        grants: () => grants,
        prepare: async () => prepared,
        execution: () => {
          writes++;
          throw new Error(`must not dispatch ${name}`);
        },
      };
      const host = new ResidentHost({
        directory: dir,
        configuration: cfg.resident,
        policyId: cfg.resident.policyId,
        now: f.now,
        capabilities: () => ["adapter.fixture"],
        vertical: verticalResident(ports, join(dir, "vertical")),
      });
      await host.start();
      try {
        await recordPresence(dir, "away", f.now);
        f.setTime(f.now() + 20);
        await host.tick();
      } finally {
        host.close();
      }
      const events = decodeLog(host.store.read());
      assert.equal(
        events.filter((e) => e.type === "IntentHeld").length,
        1,
        name,
      );
      assert.deepEqual(
        replayResident(host.store.read()).state.resident.intents[
          prepared.draft.workOrderId
        ],
        decision,
        name,
      );
      assert.ok(
        !events.some((e) =>
          [
            "IntentAdmitted",
            "IntentStepStarted",
            "ScriptEpisodeDispatched",
          ].includes(e.type),
        ),
        name,
      );
      assert.equal(writes, 0);
      assert.ok(!existsSync(join(dir, "vertical")), name);
      assert.ok(!existsSync(join(f.root, "published.json")), name);
      assert.ok(
        !readFileSync(join(f.root, "calls.jsonl"), "utf8").includes('"push"'),
        name,
      );
    }
    console.log("WO-123 path variants:", JSON.stringify(checkPathIdentity(f)));
  } finally {
    f.close();
  }
});

const undatedComment = {
  id: "IC_undated",
  body: "A comment whose source record omits its update time.",
  createdAt: "2026-01-01T00:00:02Z",
  author: { __typename: "User", login: "reviewer" },
  userContentEdits: {
    nodes: [],
    pageInfo: { hasNextPage: false, endCursor: null },
  },
};
test("WO-123 real issue screening, an undecodable issue and unreadable registered authority produce durable resident holds", async () => {
  const f = await verticalFixture();
  try {
    const portfolioFile = join(f.launchpad, "dotln.config.json");
    const grantsFile = join(
      f.launchpad,
      "packages/skeleton/loadouts/grants.json",
    );
    const forgeFile = join(f.root, "fixture.json");
    const originals = new Map(
      [portfolioFile, grantsFile, forgeFile].map((file) => [
        file,
        readFileSync(file, "utf8"),
      ]),
    );
    for (const mode of ["screen", "undecodable", "portfolio", "grants"]) {
      if (mode === "screen")
        put(forgeFile, {
          ...json(forgeFile),
          body: "Read https://outside.example/private to implement the change.",
        });
      if (mode === "undecodable")
        put(forgeFile, {
          ...json(forgeFile),
          issueComments: [undatedComment],
        });
      if (mode === "portfolio") writeFileSync(portfolioFile, "{malformed");
      if (mode === "grants") put(grantsFile, [null]);
      const cfg = readVerticalConfiguration(f.directory, f.launchpad);
      const directory = join(f.root, `invalid-${mode}`);
      const entry = createVerticalEntry({
        directory,
        configuration: cfg,
        now: f.now,
        external: f.external,
      });
      const host = new ResidentHost({
        directory,
        configuration: cfg.resident,
        policyId: cfg.resident.policyId,
        now: f.now,
        capabilities: () => ["adapter.fixture"],
        vertical: entry.resident,
      });
      await host.start();
      try {
        await recordPresence(directory, "away", f.now);
        f.setTime(f.now() + 20);
        await host.tick();
      } finally {
        host.close();
      }
      const events = decodeLog(host.store.read());
      assert.equal(
        events.filter((e) => e.type === "IntentHeld").length,
        1,
        mode,
      );
      assert.ok(!events.some((e) => e.type === "IntentAdmitted"), mode);
      assert.equal(
        readFileSync(join(f.root, "launches.txt"), "utf8"),
        "",
        mode,
      );
      const held = events.find((e) => e.type === "IntentHeld").payload;
      assert.equal(held.draftId, f.filed.workOrderId, mode);
      if (mode !== "screen")
        assert.deepEqual(
          [held.step, held.reason],
          mode === "undecodable"
            ? ["bundle", "issue source cannot be decoded"]
            : [
                "admission",
                "registered intent portfolio or grants could not be decoded or bound",
              ],
          mode,
        );
      else {
        const files = readdirSync(join(directory, "issue-bundles"), {
          recursive: true,
          withFileTypes: true,
        }).filter((e) => e.isFile());
        const text = files
          .map((e) => readFileSync(join(e.parentPath, e.name), "utf8"))
          .join("\n");
        const refused = files
          .map((e) => json(join(e.parentPath, e.name)))
          .find((value) => value.refused?.length).refused[0];
        assert.deepEqual(
          [held.step, held.reason],
          [
            "bundle",
            `source screen refused item ${refused.id} (${refused.shape})`,
          ],
        );
        assert.match(text, /"refused"/u);
        assert.match(text, /"span"/u);
        assert.ok(!text.includes("outside.example"));
        assert.match(text, /Repair `fixture\.txt`\./u);
      }
      for (const [file, bytes] of originals) writeFileSync(file, bytes);
    }
  } finally {
    f.close();
  }
});

for (const mode of ["baseline", "capsule", "lint", "observation"])
  test(`WO-123 real ${mode} refusal stops the composed run at its named step`, async () => {
    const unsafe = "https://outside.example/private";
    const f = await verticalFixture(
      mode === "observation"
        ? {
            forge: {
              reviewComments: [
                {
                  id: "IC_refused",
                  body: unsafe,
                  author: { __typename: "User", login: "reviewer" },
                },
              ],
            },
          }
        : {},
    );
    try {
      if (mode === "baseline") {
        put(join(f.target, "fixture.txt"), "changed by synthetic worker\n");
        fixtureGit(f.target, "add", "fixture.txt");
        fixtureGit(
          f.target,
          "commit",
          "-m",
          "Already satisfies the named behavior",
        );
      }
      if (mode === "lint")
        put(join(f.launchpad, "docs/control/local/terms.txt"), "fixture.txt\n");
      const result = await runVerticalIssue({
        directory: f.directory,
        issue: 1,
        configuration: readVerticalConfiguration(f.directory, f.launchpad),
        now: () => {
          f.tick();
          return f.now();
        },
        external: f.external,
        afterStep(receipt) {
          if (mode === "capsule" && receipt.command.step === "witnesses") {
            const file = join(
              receipt.value.prepared.snapshotPath,
              "fixture.txt",
            );
            chmodSync(file, 0o600);
            writeFileSync(file, "tampered after sealing\n");
            chmodSync(file, 0o400);
          }
        },
      });
      assert.equal(
        result.terminal.step,
        mode === "capsule" ? "verification" : mode,
        JSON.stringify(result.terminal),
      );
      assert.ok(["refused", "NeedsHuman"].includes(result.terminal.kind));
      assert.ok(
        !result.receipts.some(
          (r) =>
            r.command.step ===
            (mode === "observation" ? "resolution" : "publish"),
        ),
      );
      if (mode === "baseline") {
        assert.equal(readFileSync(join(f.root, "launches.txt"), "utf8"), "");
        assert.equal(result.receipts.at(-1).value.outcome, "not-reproduced");
        assert.equal(
          result.terminal.reason,
          "baseline did not reproduce the named failing behavior",
        );
      }
      if (mode === "capsule") assert.equal(f.counts.verification, 0);
      if (mode === "observation") {
        const item = result.receipts
          .at(-1)
          .value.observation.payload.comments.find(
            (c) => c.id === "IC_refused",
          );
        assert.ok(item.refused.shape && item.refused.span);
        assert.equal(item.text, undefined);
        assert.ok(!JSON.stringify(result).includes(unsafe));
      } else
        assert.ok(
          !readFileSync(join(f.root, "calls.jsonl"), "utf8").includes(
            '"git-push"',
          ),
        );
    } finally {
      f.close();
    }
  });

for (const mode of ["absent", "fabricated"])
  test(`WO-123 publication requires deliverable readiness: ${mode} test evidence stops before any remote call`, async () => {
    const f = await verticalFixture();
    try {
      let preparation;
      const result = await runVerticalIssue({
        directory: f.directory,
        issue: 1,
        configuration: readVerticalConfiguration(f.directory, f.launchpad),
        now: () => {
          f.tick();
          return f.now();
        },
        external: f.external,
        afterStep(receipt) {
          if (receipt.command.step === "source-change")
            preparation = join(
              receipt.value.store,
              "delivery-preparation.json",
            );
          if (receipt.command.step !== "preparation") return;
          const written = json(preparation);
          if (mode === "absent") rmSync(preparation);
          else
            put(preparation, {
              ...written,
              checks: { ...written.checks, tests: ["evidence_fabricated"] },
            });
        },
      });
      assert.deepEqual(result.receipts.map((r) => r.command.step).slice(-2), [
        "preparation",
        "lint",
      ]);
      assert.deepEqual(
        [result.terminal.kind, result.terminal.step],
        ["refused", "lint"],
      );
      assert.ok(!existsSync(join(f.root, "published.json")));
      assert.ok(
        !readFileSync(join(f.root, "calls.jsonl"), "utf8").includes("push"),
      );
    } finally {
      f.close();
    }
  });

test("WO-123 executable stop branches and completed-step restarts never dispatch later effects", async () => {
  const f = await verticalFixture();
  try {
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: f.external,
    });
    const phase = compileLoadout(cfg.resident.graph, cfg.resident.environment)
      .program.presence[0].phases[0];
    const input = await entry.ports.prepare(f.filed.workOrder, phase, {
      episodes: 0,
      wallMs: 0,
      tokens: 0,
    });
    const { binding } = admitIntent(input, cfg.portfolio, cfg.grants);
    for (const stop of [
      "baseline",
      "verification",
      "lint",
      "observation",
      "preparation",
      null,
    ]) {
      const directory = join(f.root, `continuation-${stop ?? "complete"}`);
      const calls = [];
      const ports = {
        materialize: async () => ({
          workOrder: { ...binding.workOrder, workOrderId: "WO-901" },
          workOrderPath: "fixture",
        }),
        async execute(command) {
          calls.push(command.step);
          if (command.step === stop)
            return {
              result: stop === "baseline" ? "completed" : "refused",
              value:
                stop === "baseline"
                  ? { storyClass: "defect", outcome: "not-reproduced" }
                  : { reason: `${stop} fixture refusal` },
            };
          return {
            result: "completed",
            value:
              command.step === "baseline"
                ? { storyClass: "defect", outcome: "reproduced" }
                : {},
          };
        },
      };
      let state;
      for (let i = 0; i < 20; i++) {
        state = await new VerticalHost({
          directory,
          binding,
          ports,
          now: f.now,
        }).run({ steps: 1 });
        if (state.terminal) break;
      }
      const count = calls.length;
      const replayed = await new VerticalHost({
        directory,
        binding,
        ports,
        now: f.now,
      }).run();
      assert.deepEqual(replayed, state);
      assert.equal(calls.length, count);
      assert.equal(state.terminal.step, stop ?? "resolution");
      if (stop === "baseline") assert.equal(state.terminal.kind, "NeedsHuman");
      if (stop !== null)
        assert.ok(!calls.includes("publish") || stop === "observation");
      const events = decodeLog(new WorkerStore(directory).read());
      assert.equal(
        events.filter((e) => e.type === "VerticalCommandPersisted").length,
        state.receipts.length,
      );
    }
  } finally {
    f.close();
  }
});

test("WO-123 operator-first restart converges with resident and both entries share the portfolio budget", async () => {
  const f = await verticalFixture({ budget: { episodes: 1 } });
  try {
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    let result = await runVerticalIssue({
      directory: f.directory,
      issue: 1,
      configuration: cfg,
      now: f.now,
      external: f.external,
      steps: 1,
    });
    const original = result.binding;
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: f.external,
    });
    const host = new ResidentHost({
      directory: f.directory,
      configuration: cfg.resident,
      policyId: cfg.resident.policyId,
      now: f.now,
      capabilities: () => ["adapter.fixture"],
      vertical: entry.resident,
    });
    await host.start();
    try {
      await recordPresence(f.directory, "away", f.now);
      f.setTime(125);
      await host.tick();
    } finally {
      host.close();
    }
    result = runState(f.directory, original.key);
    assert.deepEqual(
      result.receipts.map((r) => r.command.step),
      ["bundle", "contract"],
    );
    assert.deepEqual(result.binding, original);
    for (let i = 0; !result.terminal && i < 20; i++) {
      f.tick();
      result = await runVerticalIssue({
        directory: f.directory,
        issue: 1,
        configuration: cfg,
        now: f.now,
        external: f.external,
        steps: 1,
      });
    }
    assert.equal(
      result.terminal.kind,
      "resolved",
      JSON.stringify(result.terminal),
    );
    assert.deepEqual(
      result.receipts.map((r) => r.command.step),
      VERTICAL_STEPS,
    );
    assert.equal(
      new Set(result.receipts.map((r) => r.command.commandId)).size,
      VERTICAL_STEPS.length,
    );
    const second = await addIssue(f, 10);
    const updated = readVerticalConfiguration(f.directory, f.launchpad);
    const next = createVerticalEntry({
      directory: f.directory,
      configuration: updated,
      now: f.now,
      external: f.external,
    });
    const resident = new ResidentHost({
      directory: f.directory,
      configuration: updated.resident,
      policyId: updated.resident.policyId,
      now: f.now,
      capabilities: () => ["adapter.fixture"],
      vertical: next.resident,
    });
    await resident.start();
    try {
      f.tick();
      await resident.tick();
    } finally {
      resident.close();
    }
    const held = replayResident(resident.store.read()).state.resident.intents[
      second.workOrderId
    ];
    assert.equal(held.kind, "NeedsHuman");
    assert.match(held.reason, /budget exhausted/u);
    await addIssue(f, 11);
    const third = await runVerticalIssue({
      directory: f.directory,
      issue: 11,
      configuration: readVerticalConfiguration(f.directory, f.launchpad),
      now: f.now,
      external: f.external,
    });
    assert.equal(third.kind, "NeedsHuman");
    assert.match(third.reason, /budget exhausted/u);
    assert.equal(
      readFileSync(join(f.root, "launches.txt"), "utf8"),
      "dispatch\n",
    );
  } finally {
    f.close();
  }
});

test("WO-123 exact issue identity, phase resource caps and baseline classification", async () => {
  const f = await verticalFixture();
  try {
    const tenth = await addIssue(f, 10);
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: f.external,
    });
    const phase = compileLoadout(cfg.resident.graph, cfg.resident.environment)
      .program.presence[0].phases[0];
    const input = await entry.ports.prepare(tenth.workOrder, phase, {
      episodes: 0,
      wallMs: 0,
      tokens: 0,
    });
    assert.equal(
      input.bundle.revisionId,
      cfg.issues.find((i) => i.number === 10).revisionId,
    );
    assert.equal(input.bundle.bundleId, tenth.bundle.bundleId);
    assert.notEqual(input.bundle.bundleId, f.result.bundle.bundleId);
    const unbound = {
      ...cfg,
      issues: cfg.issues.map(({ draftId, ...issue }) => issue),
    };
    const unboundInput = await createVerticalEntry({
      directory: f.directory,
      configuration: unbound,
      now: f.now,
      external: f.external,
    }).ports.prepare(tenth.workOrder, phase, {
      episodes: 0,
      wallMs: 0,
      tokens: 0,
    });
    assert.equal(unboundInput.bundle.bundleId, tenth.bundle.bundleId);
    const narrowed = {
      ...input,
      phase: {
        ...phase,
        scope: {
          ...phase.scope,
          budget: { ...phase.scope.budget, tokens: 32 },
          changeSize: { ...phase.scope.changeSize, lines: 8 },
        },
      },
    };
    const accepted = admitIntent(narrowed, cfg.portfolio, cfg.grants);
    assert.equal(accepted.kind, "admitted", JSON.stringify(accepted));
    assert.equal(accepted.binding.authority.resourceLimits.lines, 8);
    assert.equal(accepted.binding.authority.resourceLimits.tokens, 32);
    assert.equal(
      admitIntent(
        {
          ...input,
          evidence: [],
          phase: {
            ...input.phase,
            effectiveEnvelope: {
              ...input.phase.effectiveEnvelope,
              requiredEvidence: ["verified-input"],
            },
          },
        },
        cfg.portfolio,
        cfg.grants,
      ).kind,
      "NeedsHuman",
    );
  } finally {
    f.close();
  }
});

const assertionAssessment = (
  contract,
  kinds,
  producer = { kind: "operator", name: "test author" },
) => ({
  schemaVersion: 1,
  contractId: contract.contractId,
  producer,
  assertions: contract.statements
    .filter((s) => s.status === "active" && s.class !== "non-requirement")
    .map((s, index) => ({
      statementId: s.statementId,
      kind: kinds[index] ?? "unresolved",
      rationale:
        "Explicit test annotation of source meaning, independent of runtime wording.",
    })),
});

// These are annotations, not a language-model accuracy evaluation. The runtime
// must execute the *same saved judgment* regardless of tense, vocabulary or language.
for (const [meaning, wordings] of [
  [
    "existing-failure",
    [
      "The response status is 500.",
      "The server returns a 502 Bad Gateway.",
      "The endpoint is returning 500.",
      "Login is not always working.",
      "Login hasn't been working.",
      "The export has been broken since v2.",
      "Login hasn't, for several days, been working.",
      "The response status is `500`.",
      "Login has not (consistently and reliably) been working.",
      "Search returns results belonging to another user.",
      "Saved notes vanish when I reopen the app.",
      "La connexion ne fonctionne plus.",
      "保存后数据消失了。",
      "The request should succeed, but it times out every time.",
    ],
  ],
  [
    "no-existing-failure",
    [
      "Return a 404 for unknown ids.",
      "Guests cannot edit pages.",
      "Guests must not edit pages.",
      "The button is blue.",
      "Supports 500 users.",
      "No error has actually been thrown.",
      "The client never fails.",
      "The endpoint is not returning 500.",
      "The export has never been broken.",
      "If the upload fails, show an error message.",
      "Ajouter un bouton bleu.",
      "Add a status page showing historical outages.",
    ],
  ],
])
  test(`WO-123 saved assertion meanings are deterministic across source wording: ${meaning}`, () => {
    let cases = 0;
    for (const text of wordings)
      for (const role of ["requirement", "current-behavior observation"])
        for (const producer of [
          { kind: "operator", name: "test author" },
          { kind: "model", name: "provider-independent test double" },
        ]) {
          const contract = {
            contractId: `annotated-${cases++}`,
            statements: [
              { statementId: "source", status: "active", class: role, text },
            ],
          };
          const assessment = assertionAssessment(contract, [meaning], producer);
          const host = baselineClass(contract, "new", assessment);
          const selected = baselineStoryClass(contract, assessment);
          const failure = meaning === "existing-failure";
          assert.equal(host.kind, failure ? "defect" : "new", text);
          assert.equal(selected.kind, failure ? "defect" : "new", text);
          assert.deepEqual(
            host.source.statementIds,
            failure ? ["source"] : [],
            text,
          );
          assert.equal(host.findings.length, failure ? 1 : 0, text);
          assert.equal(typeof host.source.assessmentHash, "string");
          assert.deepEqual(host.source.producer, producer);
          assert.equal(baselineClass(contract).kind, "unresolved", text);
        }
    console.log(
      `WO-123 explicit assertion contract: ${cases} source/role/producer combinations`,
    );
  });

test("WO-123 absent, incomplete and unresolved judgments cannot default to new", () => {
  const contract = {
    contractId: "judgment-coverage",
    statements: [
      {
        statementId: "request",
        status: "active",
        class: "requirement",
        text: "Make this work.",
      },
      {
        statementId: "context",
        status: "active",
        class: "current-behavior observation",
        text: "The button is blue.",
      },
    ],
  };
  const complete = assertionAssessment(contract, [
    "no-existing-failure",
    "no-existing-failure",
  ]);
  for (const value of [
    undefined,
    { ...complete, assertions: complete.assertions.slice(1) },
    assertionAssessment(contract, ["unresolved", "no-existing-failure"]),
  ]) {
    assert.equal(baselineClass(contract, "new", value).kind, "unresolved");
    assert.equal(baselineStoryClass(contract, value).kind, "unresolved");
    assert.equal(baselineClass(contract, "new", value).findings.length, 1);
  }
  assert.equal(baselineClass(contract, "new", complete).kind, "new");
});

test("WO-123 assessment decoding rejects stale identities, malformed fields and non-executable sources", () => {
  const contract = {
    contractId: "judgment-identity",
    statements: [
      {
        statementId: "active",
        status: "active",
        class: "requirement",
        text: "Implement it.",
      },
      {
        statementId: "old",
        status: "superseded",
        class: "current-behavior observation",
        text: "Earlier failure.",
      },
      {
        statementId: "ignored",
        status: "active",
        class: "non-requirement",
        text: "An out-of-scope failure.",
      },
    ],
  };
  const a = assertionAssessment(contract, ["no-existing-failure"]);
  for (const value of [
    null,
    {},
    { ...a, schemaVersion: 2 },
    { ...a, contractId: "stale" },
    { ...a, extra: true },
    { ...a, producer: { kind: "regex", name: "fallback" } },
    { ...a, producer: { kind: "unsupplied", name: "none" } },
    { ...a, assertions: [a.assertions[0], a.assertions[0]] },
    ...["old", "ignored", "unknown"].map((statementId) => ({
      ...a,
      assertions: [{ ...a.assertions[0], statementId }],
    })),
    { ...a, assertions: [{ ...a.assertions[0], kind: "new" }] },
    { ...a, assertions: [{ ...a.assertions[0], rationale: "" }] },
    { ...a, assertions: [{ ...a.assertions[0], extra: true }] },
  ]) {
    const checked = baselineClass(contract, "new", value);
    assert.equal(checked.kind, "unresolved", JSON.stringify(value));
    assert.deepEqual(checked.findings, [
      "baseline assertion assessment is invalid or stale",
    ]);
    assert.equal(checked.source.assessmentHash, null);
  }
  assert.equal(baselineClass(contract, "new", a).kind, "new");
});

test("WO-123 admission binds source and judgments, canonicalizes order and preserves inputs", async () => {
  const f = await verticalFixture();
  try {
    const { input, cfg, binding } = await prepareFixture(f);
    const original = structuredClone(input.baselineAssessment);
    const reversed = {
      ...input.baselineAssessment,
      assertions: [...input.baselineAssessment.assertions].reverse(),
    };
    const reordered = admitIntent(
      { ...input, baselineAssessment: reversed },
      cfg.portfolio,
      cfg.grants,
    );
    assert.equal(reordered.kind, "admitted");
    assert.equal(reordered.binding.key, binding.key);
    assert.deepEqual(input.baselineAssessment, original);
    const relabeled = admitIntent(
      {
        ...input,
        baselineAssessment: assertionAssessment(
          binding.contract,
          binding.contract.statements.map(() => "no-existing-failure"),
        ),
      },
      cfg.portfolio,
      cfg.grants,
    );
    assert.equal(relabeled.kind, "admitted");
    assert.notEqual(relabeled.binding.key, binding.key);
    assert.equal(
      baselineClass(binding.contract, undefined, binding.baselineAssessment)
        .kind,
      "defect",
    );
    for (const value of [
      { ...original, contractId: "stale" },
      {
        ...original,
        assertions: [{ ...original.assertions[0], statementId: "unknown" }],
      },
    ]) {
      const held = admitIntent(
        { ...input, baselineAssessment: value },
        cfg.portfolio,
        cfg.grants,
      );
      assert.equal(held.kind, "NeedsHuman");
      assert.equal(held.step, "contract");
      assert.match(held.reason, /^contract baseline assessment /u);
    }
    // Relabeling roles or changing source bytes produces a different contract.
    const roles = input.inferences.map((i) => ({ ...i, class: "requirement" }));
    assert.equal(
      admitIntent({ ...input, inferences: roles }, cfg.portfolio, cfg.grants)
        .kind,
      "NeedsHuman",
    );
    const missing = admitIntent(
      { ...input, baselineAssessment: undefined },
      cfg.portfolio,
      cfg.grants,
    );
    assert.equal(missing.kind, "admitted");
    assert.equal(
      baselineClass(
        missing.binding.contract,
        undefined,
        missing.binding.baselineAssessment,
      ).kind,
      "unresolved",
    );
  } finally {
    f.close();
  }
});

for (const entryKind of ["operator", "resident"])
  for (const mode of ["missing", "incomplete", "unresolved", "stale"])
    test(`WO-123 ${entryKind} holds ${mode} assertion judgments before baseline effects and preserves the stop on restart`, async () => {
      const f = await verticalFixture({
        omitBaselineAssessment: mode === "missing",
      });
      try {
        if (mode !== "missing") {
          const a = f.config.issues[0].baselineAssessment;
          if (mode === "incomplete") a.assertions = a.assertions.slice(1);
          if (mode === "unresolved") a.assertions[0].kind = "unresolved";
          if (mode === "stale") a.contractId = "an-older-contract";
          put(join(f.directory, "vertical.json"), f.config);
        }
        const cfg = readVerticalConfiguration(f.directory, f.launchpad);
        let state;
        if (entryKind === "operator") {
          state = await runVerticalIssue({
            directory: f.directory,
            issue: 1,
            configuration: cfg,
            now: f.now,
            external: f.external,
            steps: 6,
          });
          const restarted = await runVerticalIssue({
            directory: f.directory,
            issue: 1,
            configuration: cfg,
            now: f.now,
            external: f.external,
            steps: 20,
          });
          assert.deepEqual(restarted, state);
        } else {
          const entry = createVerticalEntry({
            directory: f.directory,
            configuration: cfg,
            now: f.now,
            external: f.external,
          });
          const host = new ResidentHost({
            directory: f.directory,
            policyId: cfg.resident.policyId,
            configuration: cfg.resident,
            vertical: entry.resident,
            now: f.now,
            capabilities: () => ["adapter.fixture"],
          });
          await host.start();
          try {
            await recordPresence(f.directory, "away", f.now);
            for (let tick = 0; tick < 12; tick++) {
              f.setTime(120 + tick);
              await host.tick();
            }
          } finally {
            host.close();
          }
          const intent = replayResident(new ResidentStore(f.directory).read())
            .state.resident.intents[f.filed.workOrderId];
          assert.ok(intent);
          state =
            intent.kind === "admitted"
              ? runState(f.directory, intent.binding.key)
              : intent;
          const restartedEntry = createVerticalEntry({
            directory: f.directory,
            configuration: cfg,
            now: f.now,
            external: f.external,
          });
          const restartedHost = new ResidentHost({
            directory: f.directory,
            policyId: cfg.resident.policyId,
            configuration: cfg.resident,
            vertical: restartedEntry.resident,
            now: f.now,
            capabilities: () => ["adapter.fixture"],
          });
          await restartedHost.start();
          try {
            for (let tick = 0; tick < 4; tick++) {
              f.tick();
              await restartedHost.tick();
            }
          } finally {
            restartedHost.close();
          }
          if (mode !== "stale")
            assert.deepEqual(runState(f.directory, intent.binding.key), state);
        }
        if (mode === "stale") {
          assert.equal(state.kind, "NeedsHuman");
          assert.equal(state.step, "contract");
          assert.match(state.reason, /stale contract/u);
        } else {
          assert.deepEqual(state.terminal, {
            kind: "NeedsHuman",
            step: "baseline",
            reason: "baseline assertion classification is unresolved",
          });
          assert.equal(
            state.receipts.at(-1).value.classification.kind,
            "unresolved",
          );
          assert.equal(nextVerticalCommand(state), null);
        }
        assert.equal(f.counts.baseline, 0);
        assert.equal(f.counts.verification, 0);
        assert.equal(f.counts.review, 0);
        assert.equal(readFileSync(join(f.root, "launches.txt"), "utf8"), "");
        const calls = readFileSync(join(f.root, "calls.jsonl"), "utf8");
        assert.equal(calls.includes('"push"'), false);
        assert.equal(calls.includes('"pr","create"'), false);
      } finally {
        f.close();
      }
    });

test("WO-123 a legacy saved binding without assertion judgments stops before primitive execution", async () => {
  const f = await verticalFixture();
  try {
    const { binding } = await prepareFixture(f);
    const legacy = { ...binding };
    delete legacy.baselineAssessment;
    const calls = [];
    const state = await new VerticalHost({
      directory: f.directory,
      binding: legacy,
      ports: purePorts(calls),
      now: f.now,
    }).run({ steps: 6 });
    assert.equal(state.terminal.step, "baseline");
    assert.equal(
      state.terminal.reason,
      "baseline assertion classification is unresolved",
    );
    assert.deepEqual(calls, []);
  } finally {
    f.close();
  }
});

test("WO-123 legacy continuations already past baseline hold before source or publication effects", async () => {
  const f = await verticalFixture();
  try {
    const { binding } = await prepareFixture(f);
    const legacy = { ...binding };
    delete legacy.baselineAssessment;
    for (const stopAt of ["source-change", "publish"]) {
      const directory = join(f.root, `legacy-${stopAt}`);
      const store = new WorkerStore(directory);
      let log = "",
        state;
      const append = (type, payload) => {
        const added = appendEvent(log, {
          schemaVersion: 1,
          type,
          occurredAt: f.now(),
          actorId: "vertical-host",
          workstreamId: `vertical_${legacy.key}`,
          payload,
        });
        state = foldVertical(state, added.event);
        store.append(added.event);
        log = added.log;
      };
      store.acquire();
      try {
        append("VerticalOpened", {
          binding: legacy,
          workOrder: { ...legacy.workOrder, workOrderId: "WO-901" },
          workOrderPath: "legacy-fixture",
          continuation: verticalProgram(legacy.key),
        });
        // Seed the exact old event shape, preserving the unsafe old baseline
        // as history. The updated host must neither rewrite it nor trust it.
        for (let i = 0; i < VERTICAL_STEPS.indexOf(stopAt); i++) {
          const command = nextVerticalCommand(state);
          append("VerticalCommandPersisted", { command });
          append("VerticalStepCompleted", {
            command,
            result: "completed",
            value:
              command.step === "baseline"
                ? { storyClass: "new", outcome: "walked" }
                : {},
          });
        }
        append("VerticalCommandPersisted", {
          command: nextVerticalCommand(state),
        });
      } finally {
        store.release();
      }
      const history = structuredClone(state.receipts);
      const calls = [];
      const makeHost = () =>
        new VerticalHost({
          directory,
          binding: legacy,
          ports: purePorts(calls),
          now: f.now,
        });
      const held = await makeHost().run({ steps: 1 });
      assert.deepEqual(held.terminal, {
        kind: "NeedsHuman",
        step: stopAt,
        reason: "baseline assertion classification is unresolved",
      });
      assert.deepEqual(held.receipts.slice(0, history.length), history);
      assert.deepEqual(calls, []);
      assert.deepEqual(await makeHost().run(), held);
    }
  } finally {
    f.close();
  }
});

for (const entryKind of ["operator host", "resident"])
  for (const failureAsRequirement of [false, true])
    test(`WO-123 ${entryKind} rejects a primitive claiming new against saved failure judgments (${failureAsRequirement})`, async () => {
      const f = await verticalFixture({ failureAsRequirement });
      try {
        const { binding, cfg, entry } = await prepareFixture(f);
        const execution = entry.ports.execution;
        const calls = [];
        entry.ports.execution = (accepted) => {
          const ports = execution(accepted);
          return {
            ...ports,
            execute: async (command, state, active) => {
              calls.push(command.step);
              const result = await ports.execute(command, state, active);
              // A deliberately conflicting primitive claim; the real baseline
              // snapshot, witness and source classification remain inspectable.
              return command.step === "baseline" &&
                result.result === "completed"
                ? { ...result, value: { ...result.value, storyClass: "new" } }
                : result;
            },
          };
        };
        let state;
        if (entryKind === "operator host") {
          const makeHost = () =>
            new VerticalHost({
              directory: join(entry.runs, binding.key),
              binding,
              ports: entry.ports.execution(binding),
              now: f.now,
            });
          state = await makeHost().run();
          assert.deepEqual(await makeHost().run(), state);
        } else {
          const host = new ResidentHost({
            directory: f.directory,
            policyId: cfg.resident.policyId,
            configuration: cfg.resident,
            vertical: entry.resident,
            now: f.now,
            capabilities: () => ["adapter.fixture"],
          });
          await host.start();
          try {
            await recordPresence(f.directory, "away", f.now);
            for (let i = 0; i < 12; i++) {
              f.setTime(120 + i);
              await host.tick();
              const intent = replayResident(host.store.read()).state.resident
                .intents[f.filed.workOrderId];
              if (intent?.kind === "admitted")
                state = runState(f.directory, intent.binding.key);
              if (state?.terminal) break;
            }
            const history = structuredClone(state.receipts);
            f.tick();
            await host.tick();
            assert.deepEqual(
              runState(f.directory, state.binding.key).receipts,
              history,
            );
          } finally {
            host.close();
          }
        }
        assert.deepEqual(state.terminal, {
          kind: "NeedsHuman",
          step: "baseline",
          reason:
            "contract names failing behavior but baseline was classed new",
        });
        const baseline = state.receipts.at(-1);
        assert.equal(baseline.value.storyClass, "new");
        assert.equal(baseline.value.storyClassification.kind, "defect");
        assert.equal(baseline.value.outcome, "reproduced");
        assert.equal(
          baseline.value.classification.source.assessmentHash,
          baseline.value.storyClassification.source.assessmentHash,
        );
        assert.deepEqual(baseline.value.classification.findings, [
          state.terminal.reason,
        ]);
        assert.deepEqual(calls, ["baseline"]);
        assert.equal(f.counts.baseline, 1);
        assert.equal(readFileSync(join(f.root, "launches.txt"), "utf8"), "");
        const remote = readFileSync(join(f.root, "calls.jsonl"), "utf8");
        assert.equal(remote.includes('"push"'), false);
        assert.equal(remote.includes('"pr","create"'), false);
        assert.equal(existsSync(join(f.root, "published.json")), false);
      } finally {
        f.close();
      }
    });

test("WO-123 a requirement naming an existing failure completes the defect loop without a role correction", async () => {
  const f = await verticalFixture({ failureAsRequirement: true });
  try {
    const configuration = readVerticalConfiguration(f.directory, f.launchpad);
    let state;
    for (let i = 0; i < VERTICAL_STEPS.length; i++) {
      f.tick();
      state = await runVerticalIssue({
        directory: f.directory,
        issue: 1,
        configuration,
        now: f.now,
        external: f.external,
        steps: 1,
      });
      if (state.terminal) break;
    }
    assert.equal(state.terminal.kind, "resolved");
    const baseline = state.receipts.find((r) => r.command.step === "baseline");
    assert.equal(baseline.value.storyClass, "defect");
    assert.equal(baseline.value.outcome, "reproduced");
    assert.deepEqual(baseline.value.classification.findings, []);
    assert.equal(
      state.binding.contract.statements.some(
        (s) => s.class === "current-behavior observation",
      ),
      false,
    );
    assert.deepEqual(
      state.receipts.map((r) => r.command.step),
      VERTICAL_STEPS,
    );
    assert.equal(
      readFileSync(join(f.root, "launches.txt"), "utf8"),
      "dispatch\n",
    );
    assert.ok(existsSync(join(f.root, "published.json")));
  } finally {
    f.close();
  }
});

for (const [body, failureAsRequirement] of [
  ...[
    "The endpoint returns status: 500",
    "The response status = 500",
    "HTTP status: 500",
    "Login isn't actually working",
    "Login isn't yet working",
    "Login is not currently working",
    "The gateway returns HTTP code=503",
    "Search isn\u2019t reliably working",
    "Errors are thrown",
    "The parser doesn't throw errors yet uploads fail",
    "The response status is 500",
    "The server returns a 502 Bad Gateway",
    "The endpoint is returning 500",
    "Login is not always working",
    "Login hasn't been working",
    "The export has been broken since v2",
    // Unquoted grammatical products from the repaired families.
    "The HTTP code had consistently been 429",
    "Users have been seeing 504 Gateway Timeout",
    "Login hadn't often been working",
    "The result has remained quite clearly incorrect",
    "The endpoint is returning 429 Too Many Requests",
    "The result is consistently and visibly broken",
    "The response status is `500`",
    "Login has not, actually, been working",
    "Login has not (consistently and reliably) been working",
    "Login hasn't, for several days, been working",
  ].flatMap((text) =>
    [false, true].map((requirement) => [
      `${text}: make \`fixture.txt\` contain changed by synthetic worker.`,
      requirement,
    ]),
  ),
  [
    "Uploads fail for files larger than 10 MB: make `fixture.txt` contain changed by synthetic worker.",
    false,
  ],
  [
    "Uploads fail for files larger than 10 MB: make `fixture.txt` contain changed by synthetic worker.",
    true,
  ],
  [
    "Saving a document throws a TypeError: make `fixture.txt` contain changed by synthetic worker.",
    true,
  ],
  [
    "The export endpoint returns HTTP 500: make `fixture.txt` contain changed by synthetic worker.",
    true,
  ],
  [
    "The image decoder cannot parse JPEGs: make `fixture.txt` contain changed by synthetic worker.",
    true,
  ],
  [
    "Login isn't working: make `fixture.txt` contain changed by synthetic worker.",
    false,
  ],
  [
    "Users see a 404 on the settings page: make `fixture.txt` contain changed by synthetic worker.",
    false,
  ],
  [
    "Login can\u2019t complete: make `fixture.txt` contain changed by synthetic worker.",
    true,
  ],
  [
    "This should be fixed, uploads fail for large files: make `fixture.txt` contain changed by synthetic worker.",
    false,
  ],
  [
    "The importer didn\u2019t finish: make `fixture.txt` contain changed by synthetic worker.",
    true,
  ],
  [
    "The API gives a 503 error: make `fixture.txt` contain changed by synthetic worker.",
    false,
  ],
])
  test(`WO-123 composed baseline records source-bound failure judgments and reproduces across statement roles: ${body} (${failureAsRequirement})`, async () => {
    const f = await verticalFixture({ forge: { body }, failureAsRequirement });
    try {
      const configuration = readVerticalConfiguration(f.directory, f.launchpad);
      let state;
      for (let i = 0; i < 5; i++) {
        f.tick();
        state = await runVerticalIssue({
          directory: f.directory,
          issue: 1,
          configuration,
          now: f.now,
          external: f.external,
          steps: 1,
        });
      }
      const baseline = state.receipts.at(-1);
      assert.equal(baseline.command.step, "baseline");
      assert.equal(baseline.value.classification.kind, "defect");
      assert.equal(
        baseline.value.classification.source.contractId,
        state.binding.contract.contractId,
      );
      assert.equal(
        baseline.value.classification.source.rule,
        "active-existing-failure-assertion",
      );
      const failureStatements = state.binding.contract.statements.filter(
        (s) => s.text === body,
      );
      assert.equal(failureStatements.length, 1);
      assert.equal(
        failureStatements[0].class,
        failureAsRequirement ? "requirement" : "current-behavior observation",
      );
      assert.deepEqual(
        baseline.value.classification.source.statementIds,
        failureStatements.map((s) => s.statementId),
      );
      assert.equal(
        baseline.value.storyClassification.source.rule,
        "supplied-assertion-judgments",
      );
      assert.equal(baseline.value.storyClass, "defect");
      assert.equal(baseline.value.outcome, "reproduced");
      assert.equal(state.terminal, null);
      assert.deepEqual(baseline.value.classification.findings, []);
      assert.deepEqual(
        baseline.value.storyClassification.source.statementIds,
        failureStatements.map((s) => s.statementId),
      );
      assert.equal(readFileSync(join(f.root, "launches.txt"), "utf8"), "");
      assert.ok(!existsSync(join(f.root, "published.json")));
      assert.ok(
        !readFileSync(join(f.root, "calls.jsonl"), "utf8").includes('"push"'),
      );
      assert.ok(
        !readFileSync(join(f.root, "calls.jsonl"), "utf8").includes(
          '"pr","create"',
        ),
      );
    } finally {
      f.close();
    }
  });

for (const body of [
  "No errors are thrown: make `fixture.txt` contain changed by synthetic worker.",
  "No error is ever thrown: make `fixture.txt` contain changed by synthetic worker.",
  "No errors are yet thrown: make `fixture.txt` contain changed by synthetic worker.",
  "The parser doesn't yet throw exceptions: make `fixture.txt` contain changed by synthetic worker.",
  "The build has not yet failed: make `fixture.txt` contain changed by synthetic worker.",
  "The endpoint cannot fail: make `fixture.txt` contain changed by synthetic worker.",
  "The parser can't throw errors: make `fixture.txt` contain changed by synthetic worker.",
  "The parser doesn't throw errors: make `fixture.txt` contain changed by synthetic worker.",
  "The parser cannot yet throw errors: make `fixture.txt` contain changed by synthetic worker.",
  "Show an error message when the upload exceeds 10 MB: make `fixture.txt` contain changed by synthetic worker.",
  "Add retry when the upload fails: make `fixture.txt` contain changed by synthetic worker.",
])
  test(`WO-123 composed baseline walks requirement-voice wording without a failing-behavior finding: ${body}`, async () => {
    const f = await verticalFixture({
      forge: { body },
      failureAsRequirement: true,
      baselineKind: "no-existing-failure",
    });
    try {
      const state = await runVerticalIssue({
        directory: f.directory,
        issue: 1,
        configuration: readVerticalConfiguration(f.directory, f.launchpad),
        now: f.now,
        external: f.external,
        steps: 5,
      });
      const baseline = state.receipts.at(-1);
      assert.deepEqual(
        [baseline.command.step, baseline.result],
        ["baseline", "completed"],
      );
      assert.equal(
        state.binding.contract.statements.filter(
          (s) => s.text === body && s.class === "requirement",
        ).length,
        1,
      );
      assert.equal(baseline.value.storyClass, "new");
      assert.deepEqual(
        [
          baseline.value.classification.kind,
          baseline.value.classification.source.statementIds,
          baseline.value.classification.findings,
        ],
        ["new", [], []],
      );
      assert.equal(baseline.value.outcome, "walked");
      assert.equal(state.terminal, null);
      assert.equal(f.counts.baseline, 1);
    } finally {
      f.close();
    }
  });

for (const wording of [
  "The endpoint returns status: 500",
  "The HTTP code had consistently been 429",
  "Users have been seeing 504 Gateway Timeout",
  "Login hadn't often been working",
  "The result has remained quite clearly incorrect",
])
  for (const failureAsRequirement of [false, true])
    test(`WO-123 resident consumes source-bound failure judgments across statement roles: ${wording} (${failureAsRequirement})`, async () => {
      const body = `${wording}: make \`fixture.txt\` contain changed by synthetic worker.`;
      const f = await verticalFixture({
        forge: { body },
        failureAsRequirement,
      });
      try {
        const cfg = readVerticalConfiguration(f.directory, f.launchpad);
        const entry = createVerticalEntry({
          directory: f.directory,
          configuration: cfg,
          now: f.now,
          external: f.external,
        });
        const host = new ResidentHost({
          directory: f.directory,
          policyId: cfg.resident.policyId,
          configuration: cfg.resident,
          now: f.now,
          capabilities: () => ["adapter.fixture"],
          vertical: entry.resident,
        });
        await host.start();
        let state;
        try {
          await recordPresence(f.directory, "away", f.now);
          for (let i = 0; i < 10; i++) {
            f.setTime(120 + i);
            await host.tick();
            const intent = replayResident(host.store.read()).state.resident
              .intents?.[f.filed.workOrderId];
            if (!intent) continue;
            assert.equal(intent.kind, "admitted");
            state = runState(f.directory, intent.binding.key);
            if (state.receipts.at(-1)?.command.step === "baseline") break;
          }
        } finally {
          host.close();
        }
        const baseline = state.receipts.at(-1);
        const statement = state.binding.contract.statements.find(
          (s) => s.text === body,
        );
        assert.equal(
          statement.class,
          failureAsRequirement ? "requirement" : "current-behavior observation",
        );
        assert.equal(baseline.command.step, "baseline");
        assert.equal(baseline.value.classification.kind, "defect");
        assert.deepEqual(baseline.value.classification.source.statementIds, [
          statement.statementId,
        ]);
        assert.equal(
          baseline.value.classification.source.rule,
          "active-existing-failure-assertion",
        );
        assert.equal(
          baseline.value.storyClassification.source.rule,
          "supplied-assertion-judgments",
        );
        assert.equal(baseline.value.storyClass, "defect");
        assert.equal(baseline.value.outcome, "reproduced");
        assert.deepEqual(
          baseline.value.storyClassification.source.statementIds,
          [statement.statementId],
        );
        assert.deepEqual(baseline.value.classification.findings, []);
        assert.equal(state.terminal, null);
        assert.equal(readFileSync(join(f.root, "launches.txt"), "utf8"), "");
        const calls = readFileSync(join(f.root, "calls.jsonl"), "utf8");
        assert.ok(!calls.includes('"push"'));
        assert.ok(!calls.includes('"pr","create"'));
        assert.ok(!existsSync(join(f.root, "published.json")));
      } finally {
        f.close();
      }
    });

for (const wording of [
  "No errors are thrown",
  "No errors are yet thrown",
  "The parser cannot yet throw errors",
  "The response status is not 500",
  "The result has not been broken",
  "The endpoint is returning 500 rows per page",
  "Login is not only working but working reliably",
  'The API is not returning 500 "Internal Server Error"',
  "The output has not (ever) been wrong",
  "The result has not (consistently and visibly) been wrong",
  "The result is not, in any way, broken",
])
  test(`WO-123 healthy negative wording completes the composed loop without a false baseline hold: ${wording}`, async () => {
    const f = await verticalFixture({
      forge: {
        body: `${wording}: make \`fixture.txt\` contain changed by synthetic worker.`,
      },
      failureAsRequirement: true,
      baselineKind: "no-existing-failure",
    });
    try {
      const configuration = readVerticalConfiguration(f.directory, f.launchpad);
      let state;
      for (let i = 0; i < VERTICAL_STEPS.length; i++) {
        f.tick();
        state = await runVerticalIssue({
          directory: f.directory,
          issue: 1,
          configuration,
          now: f.now,
          external: f.external,
          steps: 1,
        });
        if (state.terminal) break;
      }
      assert.equal(
        state.terminal?.kind,
        "resolved",
        JSON.stringify(state.terminal),
      );
      const baseline = state.receipts.find(
        (r) => r.command.step === "baseline",
      );
      assert.deepEqual(
        [
          baseline.value.storyClass,
          baseline.value.classification.kind,
          baseline.value.classification.findings,
          baseline.value.outcome,
        ],
        ["new", "new", [], "walked"],
      );
      assert.deepEqual(
        state.receipts.map((r) => r.command.step),
        VERTICAL_STEPS,
      );
      assert.equal(
        readFileSync(join(f.root, "launches.txt"), "utf8"),
        "dispatch\n",
      );
      const calls = readFileSync(join(f.root, "calls.jsonl"), "utf8")
        .trim()
        .split("\n")
        .map(JSON.parse);
      assert.equal(
        calls.filter((c) => c.actor === "git-push" && c.args.includes("push"))
          .length,
        1,
      );
      assert.equal(
        calls.filter(
          (c) =>
            c.actor === "forge" && c.args[0] === "pr" && c.args[1] === "create",
        ).length,
        1,
      );
      assert.match(
        json(join(f.root, "published.json")).body,
        /Deliverable-ready: ready; every applicable item is evidenced\./u,
      );
    } finally {
      f.close();
    }
  });

test("WO-123 an unresolved judgment recovers through a refiled draft without rewording the source", async () => {
  const suffix = ": make `fixture.txt` contain changed by synthetic worker.";
  const f = await verticalFixture({
    forge: { body: `Guests cannot edit pages${suffix}` },
    failureAsRequirement: true,
    baselineKind: "unresolved",
  });
  try {
    const run = () =>
      runVerticalIssue({
        directory: f.directory,
        issue: 1,
        configuration: readVerticalConfiguration(f.directory, f.launchpad),
        now: f.now,
        external: f.external,
        steps: 5,
      });
    const held = await run();
    assert.deepEqual(held.terminal, {
      kind: "NeedsHuman",
      step: "baseline",
      reason: "baseline assertion classification is unresolved",
    });
    // The decision and its terminal run are permanent for that draft.
    assert.deepEqual(await run(), held);
    // A reviewed judgment can change without rewriting the original text.
    // Updating the configuration cannot relabel the already admitted draft.
    const originalInferences = structuredClone(f.config.issues[0].inferences);
    f.config.issues[0].baselineAssessment = fixtureBaselineAssessment(
      f.result.bundle,
      originalInferences,
      "no-existing-failure",
    );
    put(join(f.directory, "vertical.json"), f.config);
    assert.deepEqual(await run(), held);
    const refiled = await fileIntent(
      "Implement https://github.com/dotln-fixture/target/issues/1",
      { root: f.launchpad, sourceId: "fixture-issue-1-refiled" },
    );
    assert.notEqual(refiled.workOrderId, f.filed.workOrderId);
    const reviewed = await fetchIssueBundle(
      "https://github.com/dotln-fixture/target",
      1,
      { directory: join(f.root, "reviewed-1"), cwd: f.launchpad },
    );
    assert.equal(reviewed.bundle.revisionId, f.config.issues[0].revisionId);
    f.config.issues[0] = {
      number: 1,
      draftId: refiled.workOrderId,
      revisionId: reviewed.bundle.revisionId,
      inferences: originalInferences,
    };
    f.config.issues[0].baselineAssessment = fixtureBaselineAssessment(
      reviewed.bundle,
      f.config.issues[0].inferences,
      "no-existing-failure",
    );
    put(join(f.directory, "vertical.json"), f.config);
    const recovered = await run();
    assert.notEqual(recovered.binding.key, held.binding.key);
    assert.equal(recovered.binding.draftId, refiled.workOrderId);
    assert.equal(
      recovered.binding.contract.contractId,
      held.binding.contract.contractId,
    );
    assert.notDeepEqual(
      recovered.binding.baselineAssessment,
      held.binding.baselineAssessment,
    );
    const baseline = recovered.receipts.at(-1);
    assert.deepEqual(
      [baseline.command.step, baseline.result, baseline.value.outcome],
      ["baseline", "completed", "walked"],
    );
    assert.deepEqual(baseline.value.classification.findings, []);
    assert.equal(recovered.terminal, null);
    assert.deepEqual(runState(f.directory, held.binding.key), held);
  } finally {
    f.close();
  }
});

test("WO-123 operator restart reconciles a durable resident receipt before its settlement", async () => {
  const f = await verticalFixture();
  try {
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const options = {
      directory: f.directory,
      issue: 1,
      configuration: cfg,
      now: f.now,
      external: f.external,
    };
    const opened = await runVerticalIssue({ ...options, steps: 0 });
    const binding = opened.binding;
    const ledger = new ResidentStore(f.directory);
    const entry = createVerticalEntry(options);
    await recordPresence(f.directory, "away", f.now);
    f.setTime(120);
    const interrupted = new VerticalHost({
      directory: join(entry.runs, binding.key),
      binding,
      ports: entry.ports.execution(binding),
      now: f.now,
      ...residentVerticalScheduling(ledger, binding, f.now, () => [
        "adapter.fixture",
      ]),
      settled: async () => {
        throw new Error("fixture crash before resident settlement");
      },
    });
    await assert.rejects(interrupted.run({ steps: 1 }), /fixture crash/u);
    assert.equal(runState(f.directory, binding.key).receipts.length, 1);
    assert.ok(replayResident(ledger.read()).state.resident.machine.current);
    const resumed = await runVerticalIssue({ ...options, steps: 1 });
    assert.deepEqual(
      resumed.receipts.map((r) => r.command.step),
      ["bundle", "contract"],
    );
    assert.equal(
      replayResident(ledger.read()).state.resident.machine.current,
      null,
    );
    assert.equal(readFileSync(join(f.root, "launches.txt"), "utf8"), "");
  } finally {
    f.close();
  }
});

for (const entryKind of ["operator", "resident"])
  test(`WO-123 ${entryKind} records an expiry stop after a completed-step pause`, async () => {
    const f = await verticalFixture();
    let host;
    try {
      const cfg = readVerticalConfiguration(f.directory, f.launchpad);
      const options = {
        directory: f.directory,
        issue: 1,
        configuration: cfg,
        now: f.now,
        external: f.external,
      };
      let result;
      if (entryKind === "operator")
        result = await runVerticalIssue({ ...options, steps: 1 });
      else {
        const entry = createVerticalEntry(options);
        host = new ResidentHost({
          directory: f.directory,
          configuration: cfg.resident,
          policyId: cfg.resident.policyId,
          now: f.now,
          capabilities: () => ["adapter.fixture"],
          vertical: entry.resident,
        });
        await host.start();
        await recordPresence(f.directory, "away", f.now);
        f.setTime(120);
        await host.tick();
        const decision = replayResident(host.store.read()).state.resident
          .intents[f.filed.workOrderId];
        assert.equal(decision.kind, "admitted");
        result = runState(f.directory, decision.binding.key);
      }
      assert.equal(result.receipts.length, 1);
      const binding = result.binding;
      f.setTime(binding.authority.expiresAt + 1);
      if (entryKind === "operator")
        result = await runVerticalIssue({ ...options, steps: 1 });
      else {
        await host.tick();
        result = runState(f.directory, binding.key);
      }
      assert.equal(result.terminal.kind, "NeedsHuman");
      assert.equal(result.terminal.step, "contract");
      assert.match(result.terminal.reason, /expired/u);
      assert.equal(readFileSync(join(f.root, "launches.txt"), "utf8"), "");
    } finally {
      host?.close();
      f.close();
    }
  });

for (const mode of ["kill", "finish", "revoke"])
  test(`WO-123 in-flight resident step prevents idle expiry and respects ${mode}`, async () => {
    const f = await verticalFixture({
      idleMs: 50,
      onReturn: mode === "finish" ? "finish" : "kill",
    });
    let release,
      started,
      kills = 0;
    let running;
    const began = new Promise((resolve) => {
      started = resolve;
    });
    const wait = new Promise((resolve) => {
      release = resolve;
    });
    const original = f.external.verifier;
    f.external.verifier = {
      ...original,
      dispatch(request, now) {
        const child = original.dispatch(request, now);
        started();
        return {
          ...child,
          completed: wait.then(() => child.completed),
          kill() {
            kills++;
            child.kill();
            release();
          },
        };
      },
    };
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: f.external,
    });
    const host = new ResidentHost({
      directory: f.directory,
      configuration: cfg.resident,
      policyId: cfg.resident.policyId,
      now: f.now,
      capabilities: () => ["adapter.fixture"],
      vertical: entry.resident,
    });
    try {
      await host.start();
      await recordPresence(f.directory, "away", f.now);
      f.setTime(120);
      for (let i = 0; i < 4; i++) await host.tick();
      running = host.tick();
      await began;
      f.setTime(500);
      const ledger = new ResidentStore(f.directory);
      await ledger.transaction((tx) => {
        tx.sample(f.now());
        assert.notEqual(tx.resident.machine.state, "expired");
        assert.ok(tx.resident.machine.current);
      });
      if (mode === "revoke")
        await ledger.transaction((tx) => tx.append("AuthorityRevoked", {}));
      else await recordPresence(f.directory, "returned", f.now);
      if (mode === "finish") release();
      await running;
      const decision = replayResident(host.store.read()).state.resident.intents[
        f.filed.workOrderId
      ];
      const result = runState(f.directory, decision.binding.key);
      assert.equal(result.receipts.at(-1).command.step, "baseline");
      assert.equal(
        result.receipts.at(-1).result,
        mode === "finish" ? "completed" : "refused",
      );
      if (mode !== "finish")
        assert.equal(
          result.receipts.at(-1).value.reason,
          "baseline host failed or was unavailable",
        );
      assert.equal(kills > 0, mode !== "finish");
      assert.equal(readFileSync(join(f.root, "launches.txt"), "utf8"), "");
      await host.tick();
      assert.ok(
        !runState(f.directory, decision.binding.key).receipts.some(
          (r) => r.command.step === "source-change",
        ),
      );
    } finally {
      release();
      await running?.catch(() => {});
      host.close();
      f.close();
    }
  });

test("WO-123 transport refuses a revoked child before calling the external actor", async () => {
  let launches = 0;
  const wrapped = verticalTransport(
    {
      name: "fake",
      harnessVersion: "fixture",
      dispatch() {
        launches++;
        throw new Error("must not launch");
      },
    },
    async () => false,
  );
  const child = wrapped.dispatch({}, () => 0);
  await assert.rejects(child.receipt, /no longer admitted/u);
  await assert.rejects(child.completed, /no longer admitted/u);
  assert.equal(launches, 0);
});

test("WO-123 transport refuses a child killed while launch authority is read", async () => {
  let launches = 0;
  let child;
  const wrapped = verticalTransport(
    {
      name: "fake",
      harnessVersion: "fixture",
      dispatch() {
        launches++;
        return {
          receipt: Promise.resolve({}),
          completed: Promise.resolve({}),
          alive: () => true,
          kill() {},
        };
      },
    },
    async (launching) => {
      if (launching) child.kill();
      return true;
    },
  );
  child = wrapped.dispatch({}, () => 0);
  await assert.rejects(child.receipt, /no longer admitted/u);
  await assert.rejects(child.completed, /no longer admitted/u);
  assert.equal(launches, 0);
});

test("WO-123 judgment order and binding identity do not depend on the host locale", () => {
  const module = new URL(
    "../packages/skeleton/dist/src/vertical.js",
    import.meta.url,
  ).href;
  const program = `
    const { decodeBaselineAssessment, verticalHash } = await import(${JSON.stringify(module)});
    const ids = ["statement:b000000000000002", "statement:aa00000000000001"];
    const contract = {
      contractId: "contract:locale",
      statements: ids.map((statementId) => ({ statementId, status: "active", class: "requirement" })),
    };
    const decoded = decodeBaselineAssessment(contract, {
      schemaVersion: 1,
      contractId: contract.contractId,
      producer: { kind: "operator", name: "locale fixture" },
      assertions: ids.map((statementId) => ({ statementId, kind: "existing-failure", rationale: "Fixture judgment." })),
    });
    console.log(JSON.stringify({
      locale: new Intl.Collator().resolvedOptions().locale,
      order: decoded.assertions.map((a) => a.statementId),
      hash: verticalHash(decoded),
    }));`;
  const runs = ["en_US.UTF-8", "da_DK.UTF-8"].map((lang) =>
    JSON.parse(
      execFileSync(process.execPath, ["--input-type=module", "-e", program], {
        env: { ...process.env, LANG: lang, LC_ALL: lang },
        encoding: "utf8",
      }),
    ),
  );
  // Danish collation orders "aa" after "z", so only that run discriminates.
  assert.match(runs[1].locale, /^da\b/u);
  for (const run of runs)
    assert.deepEqual(run.order, [
      "statement:aa00000000000001",
      "statement:b000000000000002",
    ]);
  assert.equal(runs[0].hash, runs[1].hash);
});

test("WO-123 failed baselines retain their result and reason; only a completed witness can be non-reproduction", async () => {
  const f = await verticalFixture();
  try {
    const { binding } = await prepareFixture(f);
    for (const failure of [
      "throw",
      "refused",
      "NeedsHuman",
      "not-reproduced",
    ]) {
      const calls = [],
        ports = purePorts(calls);
      const execute = ports.execute;
      ports.execute = async (command) => {
        if (command.step !== "baseline") return execute(command);
        calls.push(command.step);
        if (failure === "throw") throw new Error("sensitive external detail");
        return failure === "not-reproduced"
          ? {
              result: "completed",
              value: { storyClass: "defect", outcome: "not-reproduced" },
            }
          : {
              result: failure,
              value: { reason: `baseline ${failure} fixture` },
            };
      };
      const state = await new VerticalHost({
        directory: join(f.root, `failure-${failure}`),
        binding,
        ports,
        now: f.now,
      }).run();
      assert.deepEqual(
        [state.terminal.step, state.terminal.kind],
        [
          "baseline",
          failure === "throw"
            ? "refused"
            : failure === "not-reproduced"
              ? "NeedsHuman"
              : failure,
        ],
      );
      assert.equal(
        state.terminal.reason,
        failure === "throw"
          ? "baseline host failed or was unavailable"
          : failure === "not-reproduced"
            ? "baseline did not reproduce the named failing behavior"
            : `baseline ${failure} fixture`,
      );
      assert.equal(
        state.receipts.at(-1).value.outcome,
        failure === "not-reproduced" ? "not-reproduced" : undefined,
      );
      assert.deepEqual(calls, ["baseline"]);
      assert.ok(!JSON.stringify(state).includes("sensitive external detail"));
    }
  } finally {
    f.close();
  }
});

test("WO-123 composed preparation failures identify their own step and dirty targets remain transient", async () => {
  const f = await verticalFixture();
  try {
    const { cfg, phase } = await prepareFixture(f);
    const spent = { episodes: 0, wallMs: 0, tokens: 0 };
    const prepare = (configuration, draft = f.filed.workOrder) =>
      createVerticalEntry({
        directory: f.directory,
        configuration,
        now: f.now,
        external: f.external,
      }).ports.prepare(draft, phase, spent);
    const refusal = (step, reason, transient) => (error) => {
      assert.ok(error instanceof IntentPreparationRefusal);
      assert.deepEqual(
        [error.step, error.message, error.transient],
        [step, reason, transient],
      );
      return true;
    };
    await assert.rejects(
      prepare(cfg, { ...f.filed.workOrder, workOrderId: "WO-999" }),
      refusal(
        "admission",
        "draft has no unique configured issue binding",
        false,
      ),
    );
    await assert.rejects(
      prepare({
        ...cfg,
        issues: cfg.issues.map((i) => ({
          ...i,
          revisionId: "unreviewed-revision",
        })),
      }),
      refusal(
        "contract",
        "issue revision changed; supplied classification requires review",
        false,
      ),
    );
    const file = join(f.target, "fixture.txt"),
      original = readFileSync(file, "utf8");
    writeFileSync(file, "temporary edit\n");
    await assert.rejects(
      prepare(cfg),
      refusal("surfaces", "target must be a clean Git root", true),
    );
    writeFileSync(file, original);
    assert.ok((await prepare(cfg)).snapshot.length > 0);
    await assert.rejects(
      prepare({ ...cfg, target: join(f.root, "absent-target") }),
      refusal("surfaces", "target repository could not be read", true),
    );
    // The issue's decode and completeness are decisions; the read's
    // conditions are retried. No source detail reaches the reason.
    for (const [code, reason, transient] of [
      ["input", "issue source cannot be decoded", false],
      ["incomplete", "issue source is incomplete", false],
      ["gh", "issue source is unavailable", true],
      ["changed", "issue changed during the read", true],
      ["storage", "issue bundle store is unavailable", true],
    ]) {
      f.external.fetchIssueBundle = async () => {
        throw new IssueSourceRefusal(code, "$.title: quoted source detail");
      };
      await assert.rejects(prepare(cfg), refusal("bundle", reason, transient));
    }
    delete f.external.fetchIssueBundle;
  } finally {
    f.close();
  }
});

test("WO-123 an undecodable issue is held once and a later draft is still prepared and admitted", async () => {
  const f = await verticalFixture();
  let host;
  try {
    const later = await addIssue(f, 10);
    const forge = join(f.root, "fixture.json"),
      original = readFileSync(forge, "utf8");
    const fetched = [];
    f.external.fetchIssueBundle = async (repo, number, options) => {
      fetched.push(number);
      if (number !== 1) return fetchIssueBundle(repo, number, options);
      put(forge, { ...JSON.parse(original), issueComments: [undatedComment] });
      try {
        return await fetchIssueBundle(repo, number, options);
      } finally {
        writeFileSync(forge, original);
      }
    };
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: f.external,
    });
    // The double's refusal is the issue source's own decode refusal.
    await assert.rejects(
      f.external.fetchIssueBundle(
        "https://github.com/dotln-fixture/target",
        1,
        {
          directory: join(f.root, "probe-1"),
          cwd: f.launchpad,
        },
      ),
      (error) => error instanceof IssueSourceRefusal && error.code === "input",
    );
    fetched.length = 0;
    host = new ResidentHost({
      directory: f.directory,
      configuration: cfg.resident,
      policyId: cfg.resident.policyId,
      now: f.now,
      capabilities: () => ["adapter.fixture"],
      vertical: entry.resident,
    });
    await host.start();
    await recordPresence(f.directory, "away", f.now);
    for (let i = 0; i < 5; i++) {
      f.setTime(120 + i);
      await host.tick();
    }
    const resident = replayResident(host.store.read()).state.resident;
    assert.deepEqual(resident.intents[f.filed.workOrderId], {
      kind: "NeedsHuman",
      step: "bundle",
      reason: "issue source cannot be decoded",
    });
    assert.equal(resident.intents[later.workOrderId].kind, "admitted");
    assert.deepEqual(fetched, [1, 10]);
    const events = decodeLog(host.store.read());
    assert.equal(events.filter((e) => e.type === "IntentHeld").length, 1);
    assert.ok(
      runState(f.directory, resident.intents[later.workOrderId].binding.key)
        .receipts.length > 0,
    );
    assert.equal(readFileSync(join(f.root, "launches.txt"), "utf8"), "");
  } finally {
    host?.close();
    f.close();
  }
});

test("WO-123 two filed drafts for one issue without a draft identity are held by the resident and refused by the command", async () => {
  const f = await verticalFixture({ budget: { episodes: 4 } });
  let host;
  try {
    delete f.config.issues[0].draftId;
    put(join(f.directory, "vertical.json"), f.config);
    const second = await fileIntent(
      "Implement https://github.com/dotln-fixture/target/issues/1",
      { root: f.launchpad, sourceId: "fixture-duplicate-issue" },
    );
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    await assert.rejects(
      runVerticalIssue({
        directory: f.directory,
        issue: 1,
        configuration: cfg,
        now: f.now,
        external: f.external,
        steps: 1,
      }),
      /issue matches more than one filed draft/u,
    );
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: f.external,
    });
    host = new ResidentHost({
      directory: f.directory,
      configuration: cfg.resident,
      policyId: cfg.resident.policyId,
      now: f.now,
      capabilities: () => ["adapter.fixture"],
      vertical: entry.resident,
    });
    await host.start();
    await recordPresence(f.directory, "away", f.now);
    for (let i = 0; i < 6; i++) {
      f.setTime(120 + i);
      await host.tick();
    }
    const resident = replayResident(host.store.read()).state.resident;
    for (const draftId of [f.filed.workOrderId, second.workOrderId])
      assert.deepEqual(resident.intents[draftId], {
        kind: "NeedsHuman",
        step: "admission",
        reason: "issue matches more than one filed draft",
      });
    const events = decodeLog(host.store.read());
    assert.equal(events.filter((e) => e.type === "IntentAdmitted").length, 0);
    assert.equal(events.filter((e) => e.type === "IntentHeld").length, 2);
    assert.deepEqual(readdirSync(join(f.directory, "vertical")), []);
    assert.equal(readFileSync(join(f.root, "launches.txt"), "utf8"), "");
  } finally {
    host?.close();
    f.close();
  }
});

const residentTicks = async (f, cfg, times, start = 120) => {
  const entry = createVerticalEntry({
    directory: f.directory,
    configuration: cfg,
    now: f.now,
    external: f.external,
  });
  const host = new ResidentHost({
    directory: f.directory,
    configuration: cfg.resident,
    policyId: cfg.resident.policyId,
    now: f.now,
    capabilities: () => ["adapter.fixture"],
    vertical: entry.resident,
  });
  await host.start();
  try {
    if (start === 120) await recordPresence(f.directory, "away", f.now);
    for (let i = 0; i < times; i++) {
      f.setTime(start + i);
      await host.tick();
    }
    return replayResident(host.store.read()).state.resident.intents ?? {};
  } finally {
    host.close();
  }
};

test("WO-123 a draft another entry names never counts against an entry without a draft identity", async () => {
  const f = await verticalFixture({ budget: { episodes: 4 } });
  try {
    delete f.config.issues[0].draftId;
    put(join(f.directory, "vertical.json"), f.config);
    const followUp = await addIssue(
      f,
      2,
      "Implement https://github.com/dotln-fixture/target/issues/2 (follow-up to https://github.com/dotln-fixture/target/issues/1)",
    );
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const intents = await residentTicks(f, cfg, 3);
    assert.equal(intents[f.filed.workOrderId]?.kind, "admitted");
    assert.notEqual(intents[followUp.workOrderId]?.kind, "NeedsHuman");
  } finally {
    f.close();
  }
});

test("WO-123 an unreadable target leaves the draft undecided and is admitted once readable", async () => {
  const f = await verticalFixture();
  const git = join(f.target, ".git"),
    away = join(f.target, ".git-away");
  try {
    renameSync(git, away);
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    assert.equal(cfg.admissionFailure, undefined);
    assert.deepEqual(await residentTicks(f, cfg, 2), {});
    renameSync(away, git);
    const intents = await residentTicks(f, cfg, 1, 1200);
    assert.equal(intents[f.filed.workOrderId]?.kind, "admitted");
    assert.ok(
      !decodeLog(new ResidentStore(f.directory).read()).some(
        (e) => e.type === "IntentHeld",
      ),
    );
  } finally {
    if (existsSync(away)) renameSync(away, git);
    f.close();
  }
});

test("WO-123 a volume-alias target spelling is refused when the configuration is read", async (t) => {
  const f = await verticalFixture();
  try {
    const alias = `/System/Volumes/Data${f.target}`;
    if (process.platform !== "darwin" || !existsSync(alias)) {
      t.skip(`no volume alias for ${f.target} on ${process.platform}`);
      return;
    }
    put(join(f.directory, "vertical.json"), { ...f.config, target: alias });
    assert.throws(
      () => readVerticalConfiguration(f.directory, f.launchpad),
      /target must be a canonical directory/u,
    );
  } finally {
    f.close();
  }
});

const otherForge = "https://github.com/other-owner/target.git";
const filedObjectives = (root) =>
  [...replayAllocations(readControl(root)).values()]
    .filter((e) => e.provenance.kind === "intent")
    .map((e) => e.compiled.objective);

test("WO-123 a target origin that names another forge refuses the command before it files a draft or resumes", async () => {
  const f = await verticalFixture();
  try {
    const [bound] = f.config.issues;
    f.config.issues.push({
      number: 2,
      inferences: bound.inferences,
      revisionId: bound.revisionId,
    });
    put(join(f.directory, "vertical.json"), f.config);
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const first = await runVerticalIssue({
      directory: f.directory,
      issue: 1,
      configuration: cfg,
      now: f.now,
      external: f.external,
      steps: 1,
    });
    assert.deepEqual(
      first.receipts.map((r) => r.command.step),
      ["bundle"],
    );
    fixtureGit(f.target, "remote", "set-url", "origin", otherForge);
    const moved = readVerticalConfiguration(f.directory, f.launchpad);
    assert.match(
      moved.admissionFailure ?? "",
      /could not be decoded or bound/u,
    );
    for (const issue of [1, 2]) {
      const held = await runVerticalIssue({
        directory: f.directory,
        issue,
        configuration: moved,
        now: f.now,
        external: f.external,
        steps: 1,
      });
      assert.equal(held.kind, "NeedsHuman");
      assert.equal(held.step, "admission");
    }
    assert.deepEqual(
      runState(f.directory, first.binding.key).receipts.map(
        (r) => r.command.step,
      ),
      ["bundle"],
    );
    assert.ok(
      !filedObjectives(f.launchpad).some((o) => o.includes("/issues/2")),
    );
  } finally {
    f.close();
  }
});

test("WO-123 the resident holds a draft whose target origin changed after its configuration was read", async () => {
  const f = await verticalFixture();
  try {
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    fixtureGit(f.target, "remote", "set-url", "origin", otherForge);
    const intents = await residentTicks(f, cfg, 2);
    assert.deepEqual(intents[f.filed.workOrderId], {
      kind: "NeedsHuman",
      step: "admission",
      reason: "target origin differs from the configured forge",
    });
    assert.deepEqual(readdirSync(join(f.directory, "vertical")), []);
  } finally {
    f.close();
  }
});

test("WO-123 a draft that leaves the filed set during a tick is not reported as a duplicate", async () => {
  const f = await verticalFixture();
  try {
    const cfg = readVerticalConfiguration(f.directory, f.launchpad);
    const entry = createVerticalEntry({
      directory: f.directory,
      configuration: cfg,
      now: f.now,
      external: f.external,
    });
    const phase = compileLoadout(cfg.resident.graph, cfg.resident.environment)
      .program.presence[0].phases[0];
    entry.ports.drafts = async () => [];
    const input = await entry.ports.prepare(f.filed.workOrder, phase, {
      episodes: 0,
      wallMs: 0,
      tokens: 0,
    });
    assert.equal(input.draft.workOrderId, f.filed.workOrderId);
  } finally {
    f.close();
  }
});

test("WO-123 an unpreparable draft backs off, is bounded when its failure is unnamed, and never starves a later draft", async () => {
  const f = await verticalFixture();
  try {
    const { cfg, input } = await prepareFixture(f);
    const later = { ...f.filed.workOrder, workOrderId: "WO-902" };
    for (const mode of ["named", "unnamed"]) {
      const directory = join(f.root, `starve-${mode}`);
      const store = await configureResident(directory, cfg.resident, f.now);
      const attempts = [];
      const entry = verticalResident(
        {
          drafts: async () => [f.filed.workOrder, later],
          grants: () => cfg.grants,
          execution: () => purePorts(),
          prepare: async (draft) => {
            attempts.push(draft.workOrderId);
            if (draft.workOrderId !== later.workOrderId)
              throw mode === "named"
                ? new IntentPreparationRefusal(
                    "bundle",
                    "issue source is unavailable",
                    true,
                  )
                : new Error("quoted source detail");
            return { ...input, draft };
          },
        },
        join(directory, "vertical"),
      );
      const tick = (at) => {
        f.setTime(at);
        return entry.tick(store, f.now, () => ["adapter.fixture"]);
      };
      const blocked = () =>
        attempts.filter((id) => id === f.filed.workOrderId).length;
      const intents = () => replayResident(store.read()).state.resident.intents;
      // Each mode's ledger starts at the fixture clock's current reading.
      const origin = f.now() + 20;
      // The first draft's failure does not keep the second from its turn.
      assert.equal(await tick(origin), true);
      assert.deepEqual(attempts, [f.filed.workOrderId, later.workOrderId]);
      assert.equal(intents()[later.workOrderId].kind, "admitted");
      assert.equal(intents()[f.filed.workOrderId], undefined);
      // No retry inside the backoff; one at each doubled deadline.
      let at = origin;
      const deadline = [origin + 1000, origin + 3000];
      for (const next of deadline) {
        for (at += 100; at < next; at += 100) await tick(at);
        assert.equal(blocked(), deadline.indexOf(next) + 1, `${mode} ${at}`);
        await tick(next);
        at = next;
        assert.equal(blocked(), deadline.indexOf(next) + 2, `${mode} ${at}`);
      }
      const held = decodeLog(store.read()).filter(
        (e) => e.type === "IntentHeld",
      );
      if (mode === "named") {
        assert.deepEqual(held, []);
        assert.equal(intents()[f.filed.workOrderId], undefined);
      } else {
        assert.deepEqual(
          held.map((e) => e.payload),
          [
            {
              draftId: f.filed.workOrderId,
              step: "admission",
              reason:
                "intent preparation failed repeatedly outside the named transient conditions",
            },
          ],
        );
        assert.ok(!store.read().includes("quoted source detail"));
        await tick(at + 400000);
        assert.equal(blocked(), 3);
      }
      assert.deepEqual(
        attempts.filter((id) => id === later.workOrderId),
        [later.workOrderId],
      );
    }
  } finally {
    f.close();
  }
});

for (const interruption of ["exception", "presence", "rearm", "revoke"])
  test(`WO-123 transient preparation ${interruption} leaves the draft undecided and retryable`, async () => {
    const f = await verticalFixture();
    try {
      const { cfg, input } = await prepareFixture(f);
      const directory = join(f.root, `retry-${interruption}`);
      const store = await configureResident(directory, cfg.resident, f.now);
      f.setTime(120);
      let attempts = 0;
      const entry = verticalResident(
        {
          drafts: async () => [f.filed.workOrder],
          grants: () => cfg.grants,
          execution: () => purePorts(),
          prepare: async () => {
            if (++attempts === 1) {
              if (interruption === "exception")
                throw new Error("temporary input read failure");
              // A revocation changes no presence generation: only the
              // admission predicate shared with the fold can refuse it.
              if (interruption === "revoke")
                await store.transaction((tx) =>
                  tx.append("AuthorityRevoked", {}),
                );
              else await recordPresence(directory, "returned", f.now);
              if (interruption === "rearm")
                await recordPresence(directory, "away", f.now);
            }
            return input;
          },
        },
        join(directory, "vertical"),
        { steps: 1 },
      );
      assert.equal(
        await entry.tick(store, f.now, () => ["adapter.fixture"]),
        false,
      );
      assert.ok(
        !decodeLog(store.read()).some((e) =>
          ["IntentHeld", "IntentAdmitted", "IntentStepStarted"].includes(
            e.type,
          ),
        ),
      );
      if (interruption === "revoke") {
        // Revoked authority admits nothing later either, and prepares nothing.
        f.setTime(1200);
        assert.equal(
          await entry.tick(store, f.now, () => ["adapter.fixture"]),
          false,
        );
        assert.equal(attempts, 1);
        assert.ok(
          !decodeLog(store.read()).some((e) =>
            ["IntentHeld", "IntentAdmitted"].includes(e.type),
          ),
        );
        return;
      }
      if (interruption === "presence")
        await recordPresence(directory, "away", f.now);
      // An unnamed failure is retried once its first backoff has passed.
      f.setTime(interruption === "exception" ? 1119 : 140);
      if (interruption === "exception") {
        assert.equal(
          await entry.tick(store, f.now, () => ["adapter.fixture"]),
          false,
        );
        assert.equal(attempts, 1);
        f.setTime(1120);
      }
      assert.equal(
        await entry.tick(store, f.now, () => ["adapter.fixture"]),
        true,
      );
      assert.equal(attempts, 2);
      assert.equal(
        decodeLog(store.read()).filter((e) => e.type === "IntentAdmitted")
          .length,
        1,
      );
      assert.ok(!decodeLog(store.read()).some((e) => e.type === "IntentHeld"));
    } finally {
      f.close();
    }
  });

test("WO-123 racing entries converge and a live continuation lock defers the tick without a permanent hold", async () => {
  const f = await verticalFixture();
  let release, acquired;
  try {
    const { cfg, input } = await prepareFixture(f);
    const store = await configureResident(f.directory, cfg.resident, f.now);
    f.setTime(120);
    let preparing;
    const started = new Promise((resolve) => {
      preparing = resolve;
    });
    const wait = new Promise((resolve) => {
      release = resolve;
    });
    const entry = verticalResident(
      {
        drafts: async () => [f.filed.workOrder],
        grants: () => cfg.grants,
        execution: () => purePorts(),
        prepare: async () => {
          preparing();
          await wait;
          return input;
        },
      },
      join(f.directory, "vertical"),
      { steps: 1 },
    );
    const resident = entry.tick(store, f.now, () => ["adapter.fixture"]);
    await started;
    const operator = await runVerticalIssue({
      directory: f.directory,
      issue: 1,
      configuration: cfg,
      now: f.now,
      external: f.external,
      steps: 1,
    });
    release();
    assert.equal(await resident, false);
    assert.equal(
      decodeLog(store.read()).filter((e) => e.type === "IntentAdmitted").length,
      1,
    );
    const holder = new WorkerStore(
      join(f.directory, "vertical", operator.binding.key),
    );
    holder.acquire(() => {});
    acquired = holder;
    assert.equal(
      await entry.tick(store, f.now, () => ["adapter.fixture"]),
      false,
    );
    const busy = await runVerticalIssue({
      directory: f.directory,
      issue: 1,
      configuration: cfg,
      now: f.now,
      external: f.external,
    });
    assert.deepEqual(busy, {
      kind: "NeedsHuman",
      step: "admission",
      reason: "vertical continuation is already running",
    });
    assert.ok(!decodeLog(store.read()).some((e) => e.type === "IntentHeld"));
    holder.release();
    acquired = undefined;
    assert.equal(
      await entry.tick(store, f.now, () => ["adapter.fixture"]),
      true,
    );
    const current = runState(f.directory, operator.binding.key);
    const command = nextVerticalCommand(current);
    const scheduling = residentVerticalScheduling(
      store,
      operator.binding,
      f.now,
      () => ["adapter.fixture"],
    );
    assert.equal(await scheduling.startStep(command), true);
    const other = await addIssue(f, 10);
    const blocked = await runVerticalIssue({
      directory: f.directory,
      issue: 10,
      configuration: readVerticalConfiguration(f.directory, f.launchpad),
      now: f.now,
      external: f.external,
    });
    assert.equal(blocked.kind, "NeedsHuman");
    assert.equal(
      replayResident(store.read()).state.resident.intents[other.workOrderId],
      undefined,
    );
    assert.ok(!decodeLog(store.read()).some((e) => e.type === "IntentHeld"));
  } finally {
    release?.();
    acquired?.release();
    f.close();
  }
});

test("WO-123 an admitted run in another phase does not consume every resident tick", async () => {
  const f = await verticalFixture();
  try {
    const { cfg } = await prepareFixture(f);
    const configuration = structuredClone(cfg.resident);
    const phases = configuration.graph.presence[0].phases;
    phases.push({ ...structuredClone(phases[0]), phaseId: "widen" });
    configuration.portfolio.definition.phases.widen = structuredClone(
      configuration.portfolio.definition.phases.probe,
    );
    configuration.actors.widen = structuredClone(configuration.actors.probe);
    const resident = decodeResidentConfiguration(configuration);
    const operatorCfg = {
      ...cfg,
      resident,
      portfolio: resident.portfolio.definition,
      phaseId: "widen",
    };
    const store = await configureResident(f.directory, resident, f.now);
    f.setTime(120);
    const result = await runVerticalIssue({
      directory: f.directory,
      issue: 1,
      configuration: operatorCfg,
      now: f.now,
      external: f.external,
      steps: 0,
    });
    const entry = verticalResident(
      {
        drafts: async () => [],
        grants: () => cfg.grants,
        prepare: async () => {
          throw new Error("no new draft");
        },
        execution: () => purePorts(),
      },
      join(f.directory, "vertical"),
      { steps: 1 },
    );
    const before = new WorkerStore(
      join(f.directory, "vertical", result.binding.key),
    ).read();
    for (let i = 0; i < 2; i++)
      assert.equal(
        await entry.tick(store, f.now, () => ["adapter.fixture"]),
        false,
      );
    assert.equal(
      new WorkerStore(join(f.directory, "vertical", result.binding.key)).read(),
      before,
    );
    assert.equal(
      replayResident(store.read()).state.resident.machine.state,
      "probe",
    );
  } finally {
    f.close();
  }
});

test("WO-123 an idle resident tick appends one clock sample however many continuations finished or expired", async () => {
  const f = await verticalFixture();
  try {
    const { cfg, input } = await prepareFixture(f);
    const second = { ...f.filed.workOrder, workOrderId: "WO-902" };
    const perTick = {};
    for (const mode of ["none", "resolved", "expired", "both"]) {
      const directory = join(f.root, `idle-${mode}`);
      const store = await configureResident(directory, cfg.resident, f.now);
      let replays = 0;
      const ports = {
        drafts: async () =>
          mode === "none"
            ? []
            : mode === "both"
              ? [f.filed.workOrder, second]
              : [f.filed.workOrder],
        grants: () => cfg.grants,
        prepare: async (draft) => ({ ...input, draft }),
        execution: () => {
          replays++;
          return purePorts();
        },
      };
      const runs = join(directory, "vertical");
      // "expired" and the second of "both" stop one step at a time, so the
      // authority can lapse before their continuation ends.
      const resident = () =>
        verticalResident(ports, runs, mode === "resolved" ? {} : { steps: 1 });
      let entry = resident();
      let at = f.now() + 20;
      const tick = () => {
        f.setTime(++at);
        return entry.tick(store, f.now, () => ["adapter.fixture"]);
      };
      const intents = () =>
        Object.values(
          replayResident(store.read()).state.resident.intents ?? {},
        );
      const terminals = () =>
        intents().map(
          (intent) =>
            decodeLog(
              new WorkerStore(join(runs, intent.binding.key)).read(),
            ).reduce(foldVertical, undefined)?.terminal?.kind,
        );
      if (mode === "resolved" || mode === "both") {
        for (let i = 0; i < 40 && terminals()[0] !== "resolved"; i++)
          await tick();
        assert.equal(terminals()[0], "resolved", mode);
      }
      if (mode === "expired" || mode === "both") {
        for (
          let i = 0;
          i < 40 && intents().length < (mode === "both" ? 2 : 1);
          i++
        )
          await tick();
        assert.equal(intents().length, mode === "both" ? 2 : 1, mode);
        at = intents().at(-1).binding.authority.expiresAt;
        await tick();
        assert.equal(terminals().at(-1), "NeedsHuman", mode);
      }
      const idle = async () => {
        const counts = [];
        for (let i = 0; i < 5; i++) {
          const events = decodeLog(store.read()).length,
            before = replays;
          assert.equal(await tick(), false, mode);
          const added = decodeLog(store.read()).slice(events);
          assert.deepEqual(
            added.map((e) => e.type),
            ["ClockSampled"],
            mode,
          );
          counts.push(replays - before);
        }
        return counts;
      };
      await tick();
      assert.deepEqual(await idle(), [0, 0, 0, 0, 0], mode);
      // A restarted process replays each continuation at most once, when its
      // step would next be due, and appends nothing for it.
      entry = resident();
      const restarted = (await idle()).reduce((sum, n) => sum + n, 0);
      assert.ok(restarted <= intents().length, `${mode} ${restarted}`);
      for (let i = 0; i < 4; i++) await idle();
      assert.deepEqual(await idle(), [0, 0, 0, 0, 0], mode);
      perTick[mode] = 1;
    }
    assert.deepEqual(perTick, { none: 1, resolved: 1, expired: 1, both: 1 });
  } finally {
    f.close();
  }
});

test("WO-123 authority polls keep a stable log and observe presence, revocation and expiry", async () => {
  const f = await verticalFixture();
  try {
    const { cfg, binding } = await prepareFixture(f);
    const directory = join(f.root, "authority-polls");
    const store = await configureResident(directory, cfg.resident, f.now);
    const active = verticalAuthorityObserver(
      store,
      binding,
      f.now,
      (state, launch) =>
        !state.revokedBy.length &&
        state.at < binding.authority.expiresAt &&
        (!launch || !state.present),
    );
    assert.equal(await active(true), true);
    const before = store.read();
    for (let i = 0; i < 200; i++) assert.equal(await active(false), true);
    assert.equal(store.read(), before);
    await recordPresence(directory, "returned", f.now);
    assert.equal(await active(false), true);
    assert.equal(await active(true), false);
    await recordPresence(directory, "away", f.now);
    assert.equal(await active(true), true);
    await store.transaction((tx) => tx.append("AuthorityRevoked", {}));
    assert.equal(await active(false), false);
    const revoked = store.read();
    assert.equal(await active(false), false);
    assert.equal(store.read(), revoked);
    const expiryStore = await configureResident(
      join(f.root, "expiry-polls"),
      cfg.resident,
      f.now,
    );
    const expiry = verticalAuthorityObserver(
      expiryStore,
      binding,
      f.now,
      (state) => state.at < binding.authority.expiresAt,
    );
    assert.equal(await expiry(true), true);
    f.setTime(binding.authority.expiresAt);
    assert.equal(await expiry(false), false);
    const expired = expiryStore.read();
    assert.equal(await expiry(false), false);
    assert.equal(expiryStore.read(), expired);
  } finally {
    f.close();
  }
});

test("WO-123 SIGKILL at every durable step preserves identities and repairs a missing receipt projection", async () => {
  const f = await verticalFixture();
  try {
    const { binding } = await prepareFixture(f);
    const run = (input) =>
      new Promise((resolve, reject) => {
        const child = spawn(
          process.execPath,
          [
            new URL("./fixtures/vertical/crash.mjs", import.meta.url).pathname,
            input,
          ],
          { stdio: ["ignore", "ignore", "pipe"] },
        );
        let error = "";
        child.stderr.on("data", (chunk) => {
          error += chunk;
        });
        child.once("error", reject);
        child.once("close", (code, signal) => resolve({ code, signal, error }));
      });
    for (const kill of [...VERTICAL_STEPS, "receipt-projection"]) {
      const directory = join(f.root, `crash-${kill}`),
        input = join(f.root, `crash-${kill}.json`);
      put(input, { directory, binding, at: f.now(), kill });
      assert.deepEqual(await run(input), {
        code: null,
        signal: "SIGKILL",
        error: "",
      });
      const events = decodeLog(new WorkerStore(directory).read());
      const completed = events
        .filter((e) => e.type === "VerticalStepCompleted")
        .map((e) => e.payload);
      assert.ok(completed.length > 0);
      if (kill === "receipt-projection")
        assert.equal(
          existsSync(
            join(
              directory,
              "receipts",
              `${completed[0].command.commandId}.json`,
            ),
          ),
          false,
        );
      else assert.equal(completed.at(-1).command.step, kill);
      const effectsFile = join(directory, "effects.jsonl");
      const effectsBefore = existsSync(effectsFile)
        ? readFileSync(effectsFile, "utf8")
        : "";
      put(input, { directory, binding, at: f.now() });
      assert.deepEqual(await run(input), { code: 0, signal: null, error: "" });
      const result = json(join(directory, "result.json"));
      assert.equal(result.terminal.kind, "resolved");
      assert.deepEqual(
        result.receipts.map((r) => r.command.step),
        VERTICAL_STEPS,
      );
      assert.deepEqual(result.receipts.slice(0, completed.length), completed);
      const effects = readFileSync(effectsFile, "utf8");
      assert.ok(effects.startsWith(effectsBefore));
      const commands = effects.trim().split("\n").map(JSON.parse);
      assert.equal(
        new Set(commands.map((c) => c.commandId)).size,
        commands.length,
      );
      assert.deepEqual(
        commands.map((c) => c.step),
        VERTICAL_STEPS.slice(4),
      );
      const files = readdirSync(join(directory, "receipts")).filter((file) =>
        file.endsWith(".json"),
      );
      assert.equal(files.length, VERTICAL_STEPS.length);
      for (const receipt of result.receipts)
        assert.deepEqual(
          json(
            join(directory, "receipts", `${receipt.command.commandId}.json`),
          ),
          receipt,
        );
    }
  } finally {
    f.close();
  }
});
