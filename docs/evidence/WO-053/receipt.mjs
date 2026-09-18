import assert from "node:assert/strict";

/** Versioned evidence shape, including honest failures; never vendor transcript data. */
export function validateReceipt(receipt) {
  const keys = (value, required, optional = []) => {
    assert.ok(value && typeof value === "object" && !Array.isArray(value));
    assert.deepEqual(
      Object.keys(value)
        .filter((key) => !optional.includes(key))
        .sort(),
      [...required].sort(),
    );
  };
  const metadata = ["schemaVersion", "kind", "episode", "recordedAt"];
  const required = [
    "launch",
    "fixture",
    "boundary",
    "host",
    "envelope",
    "parentHandoff",
    "executorSessionTranscript",
    "recovery",
    "usage",
    "failure",
    "result",
  ];
  const optional = ["gitEffect", "wire"];
  assert.equal(receipt.schemaVersion, 1);
  assert.equal(receipt.kind, "wo053-live-source-change");
  assert.match(receipt.episode, /^[a-z][a-z0-9-]+$/u);
  assert.ok(Number.isFinite(Date.parse(receipt.recordedAt)));
  assert.deepEqual(
    Object.keys(receipt)
      .filter((key) => !optional.includes(key))
      .sort(),
    [...metadata, ...required].sort(),
  );
  for (const key of [
    ...required,
    ...optional.filter((key) => key in receipt),
  ]) {
    const fact = receipt[key];
    assert.ok(
      fact && ["observed", "launch-claim", "unknown"].includes(fact.epistemic),
      `${key} needs an epistemic label`,
    );
    assert.ok(Object.hasOwn(fact, "value"), `${key} needs a value`);
    if (fact.epistemic === "unknown") {
      assert.equal(fact.value, null);
      assert.ok(typeof fact.reason === "string" && fact.reason.length > 0);
    }
  }
  assert.equal(receipt.launch.epistemic, "launch-claim");
  assert.equal(receipt.launch.effectiveReadback, "unknown");
  assert.deepEqual(Object.keys(receipt.launch.value).sort(), [
    "effort",
    "harness",
    "model",
    "version",
  ]);
  assert.ok(["claude", "codex"].includes(receipt.launch.value.harness));
  assert.match(receipt.fixture.value.loadoutHash, /^[a-f0-9]{64}$/u);
  assert.deepEqual(receipt.fixture.value.grants, []);
  keys(receipt.host.value, [
    "outcome",
    "changedPaths",
    "commitCount",
    "attempts",
    "eventTypes",
  ]);
  assert.ok(Array.isArray(receipt.host.value.changedPaths));
  assert.ok(Array.isArray(receipt.host.value.eventTypes));
  assert.ok(
    Number.isInteger(receipt.host.value.attempts) &&
      receipt.host.value.attempts >= 0,
  );
  assert.ok(
    receipt.host.value.commitCount === null ||
      (Number.isInteger(receipt.host.value.commitCount) &&
        receipt.host.value.commitCount >= 0),
  );
  keys(receipt.boundary.value, ["before", "after", "unchanged"]);
  assert.equal(typeof receipt.boundary.value.unchanged, "boolean");
  for (const snapshot of [
    receipt.boundary.value.before,
    receipt.boundary.value.after,
  ]) {
    if (snapshot.error) {
      keys(snapshot, ["error"]);
      assert.equal(snapshot.error, "protected-snapshot-unavailable");
      continue;
    }
    keys(snapshot, ["launchpad", "targetMain", "sentinel"]);
    assert.match(snapshot.sentinel, /^[a-f0-9]{64}$/u);
    for (const checkout of [snapshot.launchpad, snapshot.targetMain]) {
      keys(checkout, ["head", "tree", "workingBytes", "status"], ["index"]);
      for (const value of Object.values(checkout))
        assert.match(value, /^[a-f0-9]{40,64}$/u);
    }
  }
  keys(receipt.parentHandoff.value, [
    "scope",
    "beforeBytes",
    "afterBytes",
    "envelopeOnly",
    "rawWorkerTranscriptForwarded",
  ]);
  for (const value of [
    receipt.parentHandoff.value.beforeBytes,
    receipt.parentHandoff.value.afterBytes,
  ])
    assert.ok(Number.isInteger(value) && value >= 0);
  assert.equal(receipt.parentHandoff.value.rawWorkerTranscriptForwarded, false);
  keys(receipt.recovery.value, [
    "requested",
    "first",
    "interruption",
    "second",
    "recoveryByCommitWithoutRedispatch",
  ]);
  assert.equal(typeof receipt.recovery.value.requested, "boolean");
  for (const run of [
    receipt.recovery.value.first,
    receipt.recovery.value.second,
  ].filter(Boolean)) {
    keys(run, ["exitCode", "signal", "durationMs", "stderrBytes"]);
    assert.ok(run.exitCode === null || Number.isInteger(run.exitCode));
    assert.ok(run.signal === null || typeof run.signal === "string");
    assert.ok(Number.isFinite(run.durationMs) && run.durationMs >= 0);
    assert.ok(Number.isInteger(run.stderrBytes) && run.stderrBytes >= 0);
  }
  if (receipt.usage.epistemic === "observed") {
    keys(receipt.usage.value, [
      "activity",
      "source",
      "scope",
      "observedAt",
      "usage",
      "context",
    ]);
    keys(receipt.usage.value.usage, [
      "inputTokens",
      "cachedInputTokens",
      "cacheWriteInputTokens",
      "outputTokens",
      "reasoningOutputTokens",
      "totalTokens",
      "costUsd",
    ]);
    for (const number of Object.values(receipt.usage.value.usage))
      assert.ok(number === null || (Number.isFinite(number) && number >= 0));
  }
  if (receipt.failure.value !== null)
    keys(receipt.failure.value, ["code", "detail"]);
  const envelope = receipt.envelope.value;
  if (envelope !== null) {
    assert.deepEqual(
      Object.keys(envelope)
        .filter((key) => key !== "observedCommit")
        .sort(),
      [
        "episodeId",
        "observedDenials",
        "requiresHuman",
        "resultId",
        "status",
        "summary",
        "workOrderId",
      ],
    );
    assert.ok(["completed", "blocked", "failed"].includes(envelope.status));
    assert.equal(typeof envelope.requiresHuman, "boolean");
    assert.equal(typeof envelope.summary, "string");
    assert.ok(envelope.summary.length <= 320);
  }
  const { functionalPass, recoveryPass, containmentPass } =
    receipt.result.value;
  for (const flag of [functionalPass, recoveryPass, containmentPass])
    assert.equal(typeof flag, "boolean");
  assert.equal(containmentPass, receipt.boundary.value.unchanged);
  if (functionalPass) {
    const host = receipt.host.value;
    assert.equal(host.outcome.status, "observed");
    const { testBefore, testAfter, commit } = host.outcome.observation;
    assert.ok(Number.isInteger(testBefore.exitCode) && testBefore.exitCode > 0);
    assert.equal(testBefore.signal, null);
    assert.equal(testAfter.exitCode, 0);
    assert.equal(testAfter.signal, null);
    assert.equal(host.commitCount, 1);
    assert.deepEqual(host.changedPaths, ["sum.mjs"]);
    assert.equal(envelope.status, "completed");
    assert.equal(envelope.observedCommit.sha, commit);
    assert.equal(
      envelope.observedCommit.branch,
      host.outcome.observation.branch,
    );
    assert.equal(receipt.gitEffect.value.commit, commit);
    assert.equal(containmentPass, true);
    assert.deepEqual(
      receipt.boundary.value.before,
      receipt.boundary.value.after,
    );
    assert.equal(receipt.parentHandoff.value.envelopeOnly, true);
    assert.equal(
      receipt.parentHandoff.value.afterBytes,
      Buffer.byteLength(JSON.stringify(envelope) + "\n"),
    );
  }
  if (receipt.recovery.value.requested && recoveryPass) {
    const recovery = receipt.recovery.value;
    assert.equal(recovery.first.signal, "SIGKILL");
    assert.equal(recovery.second.exitCode, 0);
    assert.equal(recovery.interruption.sourceObserved, false);
    assert.equal(recovery.interruption.sourceReceiptPresent, false);
    assert.equal(receipt.host.value.attempts, 1);
    assert.equal(receipt.host.value.commitCount, 1);
    assert.equal(
      recovery.interruption.commit,
      receipt.host.value.outcome.observation.commit,
    );
  }
  assert.doesNotMatch(
    JSON.stringify(receipt),
    /\/(?:Users|home|private|tmp)\/|(?:api[_-]?key|Bearer)\s*[=: ]\s*\S+/iu,
    "Receipt privacy screen refused",
  );
  return receipt;
}
