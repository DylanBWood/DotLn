import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  BASELINE_REPEATS,
  ROOT,
  decodeCodexRun,
  evaluateRecords,
  evaluationMatrix,
  factorDelta,
  fixture,
  injectedInput,
  oracleAgreement,
  pinTaskInputs,
  promptFor,
  runHttpEpisode,
  sha256,
  spearman,
  stableStringify,
  t1Input,
  t3Input,
  taskInputs,
  taskSchema,
  validateAnswer,
  validateOperatorRanking,
  validateRecordInputs,
} from "./local-model-role-qualification.mjs";

const answerFor = (taskId, inputs, ranking) => {
  if (taskId === "T1")
    return {
      taskId,
      status: "completed",
      requiresHuman: false,
      result: { ...fixture().t1.oracle, summary: "All six criteria met." },
    };
  if (taskId === "T2")
    return {
      taskId,
      status: "completed",
      requiresHuman: false,
      result: { ranking, rationale: "Held-out fixture order." },
    };
  return {
    taskId,
    status: "completed",
    requiresHuman: false,
    result: {
      classifications: fixture().t3.rows.map(({ rowId, label }) => ({
        rowId,
        label,
      })),
      reason: "Every row maps to the closed set.",
    },
  };
};

test("WO-138 matrix pre-registers 30 baselines, five one-factor cells and three failure cells", () => {
  const matrix = evaluationMatrix();
  assert.equal(matrix.length, 38);
  assert.equal(matrix.filter((cell) => cell.kind === "baseline").length, 30);
  assert.equal(matrix.filter((cell) => cell.kind === "one-factor").length, 5);
  assert.equal(matrix.filter((cell) => cell.kind === "tool-failure").length, 3);
  assert.equal(
    matrix.filter(
      (cell) => cell.kind === "baseline" && cell.transport === "local",
    ).length,
    3 * BASELINE_REPEATS,
  );
  assert.deepEqual(
    [...new Set(matrix.map((cell) => cell.episodeId))].sort(),
    matrix.map((cell) => cell.episodeId).sort(),
  );
});

test("WO-138 T1 oracle is derived from the cited receipt's own labeled rows", () => {
  const input = t1Input();
  assert.equal(input.source, "docs/verifications/WO-052/VER-001.md");
  assert.equal(
    input.labeledRows.filter((row) => row.rowId.startsWith("criterion-"))
      .length,
    6,
  );
  const text = input.labeledRows.map((row) => row.text).join("\n");
  for (const claim of [
    "Verdict: pass",
    "All six acceptance criteria",
    "Five candidate findings",
    "No finding routes",
    "Seven advisory observations",
    "19 passed; 0 failed; 515.40 s",
    "no dependency entry added",
  ])
    assert.match(
      text,
      new RegExp(claim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
});

test("WO-138 T2 executes the discovery producer over the seeded scratch fixture", async () => {
  const inputs = await taskInputs();
  const source = JSON.parse(
    readFileSync(
      join(ROOT, "packages/skeleton/fixtures/wo119-discovery/repository.json"),
      "utf8",
    ),
  );
  assert.deepEqual(
    inputs.T2.candidates.map(({ kind, paths, proposedHome }) => ({
      kind,
      paths,
      ...(proposedHome ? { proposedHome } : {}),
    })),
    source.expected,
  );
  assert.equal(inputs.T2.candidates.length, 6);
  assert.ok(
    inputs.T2.candidates.every(
      (candidate) =>
        typeof candidate.candidateId === "string" &&
        candidate.evidence.length > 0 &&
        candidate.evidence.every(Boolean),
    ),
  );
});

test("WO-138 T3 keeps labels held out and changes one prompt factor at a time", () => {
  const baseline = t3Input();
  assert.equal("labelDefinitions" in baseline, false);
  assert.ok(baseline.rows.every((row) => !("label" in row)));
  const supported = t3Input({ definitions: true });
  assert.deepEqual(
    Object.keys(supported.labelDefinitions).sort(),
    fixture().t3.labels.sort(),
  );
  const baselinePrompt = JSON.parse(promptFor("T3", baseline, "baseline"));
  const changedPrompt = JSON.parse(
    promptFor("T3", supported, "t3-label-definitions"),
  );
  assert.equal("support" in baselinePrompt, false);
  assert.deepEqual(changedPrompt.support, factorDelta("t3-label-definitions"));
  assert.deepEqual(
    Object.keys(changedPrompt).filter(
      (key) => !Object.hasOwn(baselinePrompt, key),
    ),
    ["support"],
  );
});

test("WO-138 reuses one retained discovery snapshot across transports and rejects changed bindings", async (t) => {
  const scratch = mkdtempSync(join(tmpdir(), "dotln-wo138-inputs-test-"));
  t.after(() => rmSync(scratch, { recursive: true, force: true }));
  const path = join(scratch, "inputs.json");
  const first = await pinTaskInputs(path);
  const bytes = readFileSync(path, "utf8");
  const second = await pinTaskInputs(path);
  assert.deepEqual(second, first);
  assert.equal(readFileSync(path, "utf8"), bytes);
  const cell = evaluationMatrix().find((cell) => cell.taskId === "T2");
  const record = {
    episodeId: cell.episodeId,
    cell,
    harnessBuildHash: sha256(
      readFileSync(
        join(ROOT, "scripts/probes/local-model-role-qualification.mjs"),
      ),
    ),
    inputHash: sha256(stableStringify(first.T2)),
    promptHash: sha256(promptFor("T2", first.T2)),
    schemaHash: sha256(stableStringify(taskSchema("T2", first))),
  };
  assert.doesNotThrow(() => validateRecordInputs([record], second));
  for (const key of [
    "inputHash",
    "promptHash",
    "schemaHash",
    "harnessBuildHash",
  ])
    assert.throws(
      () =>
        validateRecordInputs([{ ...record, [key]: sha256("changed") }], second),
      /binding differs/u,
    );
  const changed = structuredClone(second);
  changed.T2.candidates.find(
    (candidate) => candidate.kind === "failing-test",
  ).evidence[0].facts.stderrSha256 = sha256("different scratch path");
  assert.throws(
    () => validateRecordInputs([record], changed),
    /binding differs/u,
  );
});

test("WO-138 validators reject guesses on injected input and score all three deterministic oracles", async () => {
  const inputs = await taskInputs();
  const ranking = inputs.T2.candidates.map(
    (candidate) => candidate.candidateId,
  );
  const t1 = validateAnswer(answerFor("T1", inputs, ranking), "T1", inputs);
  const t2 = validateAnswer(answerFor("T2", inputs, ranking), "T2", inputs);
  const t3 = validateAnswer(answerFor("T3", inputs, ranking), "T3", inputs);
  assert.equal(oracleAgreement("T1", t1, ranking), 1);
  assert.equal(oracleAgreement("T2", t2, ranking), 1);
  assert.equal(oracleAgreement("T3", t3, ranking), 1);
  assert.equal(spearman(ranking, [...ranking].reverse()), -1);

  const guessed = answerFor("T1", inputs, ranking);
  assert.throws(
    () =>
      validateAnswer(guessed, "T1", inputs, {
        injected: Boolean(injectedInput("T1", inputs.T1)),
      }),
    /not blocked/u,
  );
  assert.throws(
    () =>
      validateAnswer(
        {
          taskId: "T2",
          status: "completed",
          requiresHuman: false,
          result: { ranking: ranking.slice(1), rationale: "Incomplete." },
        },
        "T2",
        inputs,
      ),
    /coverage/u,
  );
});

test("WO-138 HTTP double receives fixed decoding and returns a host-validated candidate for validation", async (t) => {
  const inputs = await taskInputs();
  const answer = answerFor(
    "T1",
    inputs,
    inputs.T2.candidates.map((candidate) => candidate.candidateId),
  );
  let received;
  const server = createServer((request, response) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      received = JSON.parse(body);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(
        JSON.stringify({
          model: "runner-observed-alias",
          choices: [
            {
              message: { content: JSON.stringify(answer) },
              finish_reason: "stop",
            },
          ],
          usage: {
            prompt_tokens: 100,
            completion_tokens: 20,
            total_tokens: 120,
          },
          stats: { tokens_per_second: 18.5 },
        }),
      );
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const observed = await runHttpEpisode({
    endpoint: `http://127.0.0.1:${address.port}`,
    model: "dotln-local",
    prompt: promptFor("T1", inputs.T1),
    schema: taskSchema("T1", inputs),
  });
  assert.deepEqual(validateAnswer(observed.answer, "T1", inputs), answer);
  assert.equal(observed.reportedTokensPerSecond, 18.5);
  assert.equal(received.model, "dotln-local");
  assert.equal(received.temperature, 0);
  assert.equal(received.seed, 424242);
  assert.equal(received.reasoning_effort, "none");
  assert.equal(received.stream, false);
  assert.deepEqual(
    received.response_format.json_schema.schema,
    taskSchema("T1", inputs),
  );
});

test("WO-138 T1 schema declares the existing host length bounds", async () => {
  const inputs = await taskInputs();
  const properties = taskSchema("T1", inputs).properties.result.properties;
  for (const [name, property] of Object.entries(properties)) {
    const limit = name === "summary" ? 320 : 40;
    assert.equal(property.maxLength, limit);
    const answer = answerFor("T1", inputs, []);
    answer.result[name] = "x".repeat(limit);
    assert.doesNotThrow(() => validateAnswer(answer, "T1", inputs));
    answer.result[name] += "x";
    assert.throws(() => validateAnswer(answer, "T1", inputs), /invalid T1/u);
  }
});

test("WO-138 remote T2 schema omits unsupported uniqueness while host rejects duplicates", async () => {
  const inputs = await taskInputs();
  const ranking = inputs.T2.candidates.map(
    (candidate) => candidate.candidateId,
  );
  assert.equal(
    "uniqueItems" in
      taskSchema("T2", inputs).properties.result.properties.ranking,
    false,
  );
  const duplicate = answerFor("T2", inputs, [
    ...ranking.slice(0, -1),
    ranking[0],
  ]);
  assert.throws(() => validateAnswer(duplicate, "T2", inputs), /coverage/u);
  assert.deepEqual(
    validateAnswer(answerFor("T2", inputs, ranking), "T2", inputs).result
      .ranking,
    ranking,
  );
});

test("WO-138 remote decoder retains JSONL error diagnostics and exit status without unrelated stream items", () => {
  const diagnostic = "invalid_json_schema: uniqueItems is not permitted";
  for (const event of [
    { type: "error", message: diagnostic },
    { type: "turn.failed", error: { message: diagnostic } },
  ]) {
    const stdout = [
      { type: "thread.started", thread_id: "unrelated-stream-identifier" },
      event,
    ]
      .map((value) => JSON.stringify(value))
      .join("\n");
    for (const status of [0, 1]) {
      assert.throws(
        () => decodeCodexRun({ stdout, stderr: "", status }, 2000, "fixture"),
        (error) => {
          assert.equal(error.code, "transport-failed");
          assert.match(
            error.detail,
            /invalid_json_schema: uniqueItems is not permitted/u,
          );
          assert.match(
            error.detail,
            status === 1 ? /exit-1/u : /turn incomplete/u,
          );
          assert.doesNotMatch(error.detail, /unrelated-stream-identifier/u);
          return true;
        },
      );
    }
  }
  for (const stderr of [
    "",
    "Bearer synthetic-secret api_key=synthetic-secret password=synthetic-secret",
  ]) {
    assert.throws(
      () =>
        decodeCodexRun(
          { stdout: "not JSON", stderr, status: 1 },
          10,
          "fixture",
        ),
      (error) => {
        assert.match(error.detail, /exit-1/u);
        assert.doesNotMatch(error.detail, /synthetic-secret/u);
        return true;
      },
    );
  }
  const answer = { public: "fixture" };
  const stdout = [
    {
      type: "item.completed",
      item: { type: "agent_message", text: JSON.stringify(answer) },
    },
    { type: "turn.completed", usage: { input_tokens: 10, output_tokens: 5 } },
  ]
    .map((value) => JSON.stringify(value))
    .join("\n");
  const decoded = decodeCodexRun(
    { stdout, stderr: "", status: 0 },
    25,
    "fixture",
  );
  assert.deepEqual(decoded.answer, answer);
  assert.equal(decoded.usage.outputTokens, 5);
  assert.equal(decoded.latencyMs, 25);
});

test("WO-138 live HTTP episode is discarded when a product gate starts in flight", async (t) => {
  const server = createServer((_request, response) => {
    setTimeout(() => {
      response.writeHead(200, { "content-type": "application/json" });
      response.end("{}");
    }, 2000);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const fakeGate = spawn(
    process.execPath,
    ["-e", "setTimeout(() => {}, 5000)", "npm test"],
    { stdio: "ignore" },
  );
  t.after(() => fakeGate.kill("SIGTERM"));
  await new Promise((resolve) => setTimeout(resolve, 100));
  const address = server.address();
  await assert.rejects(
    runHttpEpisode({
      endpoint: `http://127.0.0.1:${address.port}`,
      model: "dotln-local",
      prompt: "{}",
      schema: { type: "object" },
      timeoutMs: 5000,
    }),
    (error) => error.code === "gate-overlap",
  );
});

test("WO-138 evaluation applies the pre-registered floors without promoting capability levels", async () => {
  const inputs = await taskInputs();
  const ranking = inputs.T2.candidates.map(
    (candidate) => candidate.candidateId,
  );
  const build = sha256("fixture-build");
  const records = evaluationMatrix().map((cell) => {
    const blocked = cell.kind === "tool-failure";
    const answer = blocked
      ? cell.taskId === "T1"
        ? {
            taskId: "T1",
            status: "blocked",
            requiresHuman: false,
            result: {
              verdict: "unknown",
              criteriaMet: "unknown",
              criteriaTotal: "unknown",
              candidateFindings: "unknown",
              repairFindings: "unknown",
              advisoryObservations: "unknown",
              gatePassedSuites: "unknown",
              gateFailedSuites: "unknown",
              gateDurationSeconds: "unknown",
              newDependencies: "unknown",
              summary: "Required input was unavailable.",
            },
          }
        : cell.taskId === "T2"
          ? {
              taskId: "T2",
              status: "blocked",
              requiresHuman: false,
              result: { ranking: [], rationale: "Evidence was unavailable." },
            }
          : {
              taskId: "T3",
              status: "blocked",
              requiresHuman: false,
              result: {
                classifications: [],
                reason: "The row is outside the closed set.",
              },
            }
      : answerFor(cell.taskId, inputs, ranking);
    return {
      schemaVersion: 1,
      workOrder: "WO-138",
      episodeId: cell.episodeId,
      cell,
      cellBuildHash: sha256(stableStringify({ build, variant: cell.variant })),
      outcome: "validated-envelope",
      schemaValid: true,
      status: answer.status,
      requiresHuman: answer.requiresHuman,
      answer,
      oracleAgreement: blocked ? 0 : 1,
      latencyMs: cell.transport === "local" ? 10_000 : 5_000,
      tokensPerSecond: cell.transport === "local" ? 18 : 40,
      actualOperatorInterventions: 0,
    };
  });
  const operatorRanking = {
    schemaVersion: 1,
    workOrder: "WO-138",
    source: "operator",
    requestedAt: "2026-09-21T00:00:00.000Z",
    completedAt: "2026-09-21T00:05:00.000Z",
    elapsedSeconds: 300,
    ranking,
  };
  validateOperatorRanking(operatorRanking, ranking);
  const result = evaluateRecords(records, operatorRanking);
  assert.equal(result.outcome, "ready");
  assert.deepEqual(result.qualifyingTasks, ["T1", "T2", "T3"]);
  assert.equal(result.noPrivateInputQualification, true);
  assert.equal(result.noCapabilityLevelPromotion, true);
  assert.equal(result.implementationOrVerificationQualified, false);
  assert.equal(result.oneFactorCells.length, 5);
  assert.equal(result.toolFailureCells.length, 3);

  const withoutComparator = records.map((record) =>
    record.cell.taskId === "T2" && record.cell.transport === "codex"
      ? {
          ...record,
          schemaValid: false,
          outcome: "typed-failure",
          status: "failed",
          answer: null,
          failure: {
            code: "transport-failed",
            detail: "remote transport exit-1",
          },
        }
      : record,
  );
  const missing = evaluateRecords(withoutComparator, operatorRanking);
  assert.equal(missing.outcome, "inconclusive");
  assert.match(missing.blocker, /comparison unavailable for T2/u);
  assert.equal(missing.tasks.T2.comparatorAvailable, false);
  assert.equal(missing.tasks.T2.floor.withinTenPointsOfRemote, null);
  assert.equal(missing.tasks.T2.localMinusRemote, null);
  assert.equal(missing.tasks.T2.qualifies, false);

  // A returned but invalid model answer is observed performance; a missing
  // transport response is not. Keep those cases distinct in the comparison.
  const invalidAnswers = withoutComparator.map((record) =>
    record.cell.taskId === "T2" && record.cell.transport === "codex"
      ? {
          ...record,
          reportedOutput: { invalid: true },
          failure: { code: "invalid-result", detail: "T2 result contract" },
        }
      : record,
  );
  assert.equal(
    evaluateRecords(invalidAnswers, operatorRanking).tasks.T2
      .comparatorAvailable,
    true,
  );
});

test("WO-138 committed episodes bind their retained historical build; current and altered builds are rejected", async (t) => {
  const directory = join(ROOT, "docs/evidence/WO-138/episodes");
  const first = join(directory, `${evaluationMatrix()[0].episodeId}.json`);
  if (!existsSync(first)) {
    t.skip("live episode records have not been collected yet");
    return;
  }
  const matrix = evaluationMatrix();
  const inputs = JSON.parse(
    readFileSync(join(ROOT, "docs/evidence/WO-138/inputs.json"), "utf8"),
  );
  const historicalSource = readFileSync(
    join(ROOT, "docs/evidence/WO-149/wo138-probe-source.mjs.txt"),
  );
  const finalBuild = sha256(historicalSource);
  assert.equal(
    finalBuild,
    "3d9d6aa05c47bc6561e6850ea49c236611a3b462486f8311e4119953411f6907",
  );
  const records = matrix.map((cell) =>
    JSON.parse(readFileSync(join(directory, `${cell.episodeId}.json`), "utf8")),
  );
  assert.doesNotThrow(() =>
    validateRecordInputs(records, inputs, historicalSource),
  );
  assert.throws(
    () => validateRecordInputs(records, inputs),
    /binding differs/u,
  );
  assert.throws(
    () =>
      validateRecordInputs(
        records,
        inputs,
        Buffer.concat([historicalSource, Buffer.from("\n")]),
      ),
    /binding differs/u,
  );
  for (const key of [
    "inputHash",
    "promptHash",
    "schemaHash",
    "harnessBuildHash",
  ])
    assert.throws(
      () =>
        validateRecordInputs(
          [{ ...records[0], [key]: sha256("changed") }],
          inputs,
          historicalSource,
        ),
      /binding differs/u,
    );
  for (const cell of matrix) {
    const path = join(directory, `${cell.episodeId}.json`);
    assert.ok(existsSync(path), cell.episodeId);
    const record = JSON.parse(readFileSync(path, "utf8"));
    assert.equal(record.workOrder, "WO-138");
    assert.equal(record.episodeId, cell.episodeId);
    assert.deepEqual(record.cell, cell);
    assert.match(record.harnessBuildHash, /^[a-f0-9]{64}$/u);
    assert.equal(record.harnessBuildHash, finalBuild, cell.episodeId);
    assert.match(record.cellBuildHash, /^[a-f0-9]{64}$/u);
    assert.match(record.promptHash, /^[a-f0-9]{64}$/u);
    assert.match(record.schemaHash, /^[a-f0-9]{64}$/u);
    assert.match(record.inputHash, /^[a-f0-9]{64}$/u);
    assert.equal(record.actualOperatorInterventions, 0);
    assert.ok(["validated-envelope", "typed-failure"].includes(record.outcome));
    const input = cell.injected
      ? injectedInput(cell.taskId, inputs[cell.taskId])
      : cell.variant === "t3-label-definitions"
        ? { ...inputs[cell.taskId], labelDefinitions: fixture().t3.definitions }
        : inputs[cell.taskId];
    assert.equal(
      record.inputHash,
      sha256(stableStringify(input)),
      cell.episodeId,
    );
    assert.equal(
      record.schemaHash,
      sha256(stableStringify(taskSchema(cell.taskId, inputs))),
      cell.episodeId,
    );
    assert.equal(
      record.promptHash,
      sha256(promptFor(cell.taskId, input, cell.variant)),
      cell.episodeId,
    );
    if (record.schemaValid)
      validateAnswer(record.answer, cell.taskId, inputs, {
        injected: cell.injected,
      });
    else assert.ok(record.failure.detail.trim(), cell.episodeId);
  }
});
