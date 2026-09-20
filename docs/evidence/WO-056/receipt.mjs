import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";
import {
  canonicalStringify,
  fnv1a64,
} from "../../../packages/compiler/dist/src/index.js";

const SURFACES = ["sum.mjs"];
const TEST_FILES = {
  superficial: "focused-test.mjs",
  contract: "contract-test.mjs",
};
const TRANSPORTS = {
  claude: "claude-cli-print",
  codex: "codex-cli-exec",
  double: "fake",
};
const commit = /^[a-f0-9]{40}$/u;
// Paths, home shorthands and credential shapes. A false positive only withholds.
const PRIVATE = new RegExp(
  [
    String.raw`\/(?:Users|home|root|private|tmp|var|Volumes|opt|mnt|etc|srv|workspace|nix)\/`,
    String.raw`\/usr\/local\/`,
    String.raw`file:\/\/`,
    String.raw`(?:^|[\s"'=(])~\/`,
    String.raw`\$HOME\b`,
    String.raw`(?<![A-Za-z0-9])[A-Za-z]:\\\\?[A-Za-z]`,
    String.raw`\\\\\\\\[A-Za-z0-9]`,
    String.raw`\bsk-[A-Za-z0-9_-]{10,}`,
    String.raw`\bgh[pousr]_[A-Za-z0-9]{10,}`,
    String.raw`\bgithub_pat_`,
    String.raw`\bxox[abprs]-`,
    String.raw`\bAKIA[0-9A-Z]{16}\b`,
    String.raw`-----BEGIN`,
    String.raw`\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.`,
    String.raw`:\/\/[^\s/"@]+:[^\s/"@]+@`,
    String.raw`(?:Bearer|Basic)\s+[A-Za-z0-9+/=._-]{8,}`,
    String.raw`api[_-]?key["']?\s*[=: ]`,
    String.raw`(?:token|secret|passw(?:or)?d)["']?\s*[=:]`,
  ].join("|"),
  "iu",
);

/** Refuses private paths and credential shapes anywhere in the receipt,
 * including inside its embedded event lines after JSON normalization. */
export function screenReceipt(receipt) {
  // Event lines are JSON inside JSON. Each is screened once, normalized, so an
  // escaped slash cannot hide a path and doubled escapes cannot mimic one.
  const observedLog = receipt.eventLog?.epistemic === "observed";
  const texts = [
    JSON.stringify(
      observedLog
        ? {
            ...receipt,
            eventLog: {
              ...receipt.eventLog,
              value: { ...receipt.eventLog.value, lines: [] },
            },
          }
        : receipt,
    ),
  ];
  if (observedLog)
    for (const line of receipt.eventLog.value.lines)
      texts.push(JSON.stringify(JSON.parse(line)));
  for (const text of texts)
    assert.doesNotMatch(text, PRIVATE, "Receipt privacy screen refused");
}

/** Versioned evidence shape, including honest failures; never vendor transcript
 * data. Pass flags are derived claims: each is checked against the recorded
 * facts, and the facts against the published event log where one exists. This
 * detects inconsistency and careless relabelling; it does not authenticate a
 * receipt, whose filing remains the operator's act. */
export function validateReceipt(receipt) {
  const keys = (value, required, path = "value") => {
    assert.ok(
      value && typeof value === "object" && !Array.isArray(value),
      `${path} is an object`,
    );
    assert.deepEqual(Object.keys(value).sort(), [...required].sort(), path);
  };
  const text = (value, path) =>
    assert.ok(typeof value === "string" && value.length > 0, `${path} is text`);
  const integer = (value, path, nullable = false) =>
    assert.ok(
      (nullable && value === null) || (Number.isInteger(value) && value >= 0),
      `${path} is a non-negative integer`,
    );
  const unique = (values, path) =>
    assert.equal(new Set(values).size, values.length, `${path} are unique`);

  const metadata = ["schemaVersion", "kind", "episode", "recordedAt"];
  const facts = [
    "launch",
    "fixture",
    "planted",
    "boundary",
    "finding",
    "repair",
    "reverification",
    "loop",
    "eventLog",
    "foldReplay",
    "episodes",
    "host",
    "failure",
    "result",
  ];
  keys(receipt, [...metadata, ...facts], "receipt");
  // First, so a private string is refused as such whatever else is wrong.
  screenReceipt(receipt);
  assert.equal(receipt.schemaVersion, 1);
  assert.equal(receipt.kind, "wo056-live-verification-repair");
  assert.match(receipt.episode, /^(claude|codex|double)-[a-z0-9-]+$/u);
  assert.ok(Number.isFinite(Date.parse(receipt.recordedAt)));
  for (const key of facts) {
    const fact = receipt[key];
    assert.ok(
      fact && ["observed", "launch-claim", "unknown"].includes(fact.epistemic),
      `${key} needs an epistemic label`,
    );
    assert.ok(Object.hasOwn(fact, "value"), `${key} needs a value`);
    if (fact.epistemic === "unknown") {
      keys(fact, ["epistemic", "value", "reason"], key);
      assert.equal(fact.value, null);
      text(fact.reason, `${key}.reason`);
    } else if (key !== "launch") keys(fact, ["epistemic", "value"], key);
    // Only launch identity is a claim; everything else was seen or is unknown.
    assert.equal(fact.epistemic === "launch-claim", key === "launch", key);
  }
  const seen = (key) => receipt[key].epistemic === "observed";
  for (const key of [
    "fixture",
    "boundary",
    "episodes",
    "host",
    "failure",
    "result",
  ])
    assert.ok(seen(key), `${key} is host-observed`);

  // Launch identity is a claim about the invocation, never effective readback.
  keys(receipt.launch, ["epistemic", "value", "effectiveReadback"], "launch");
  assert.equal(receipt.launch.effectiveReadback, "unknown");
  const launch = receipt.launch.value;
  keys(launch, ["harness", "version", "model", "effort"], "launch.value");
  for (const [name, value] of Object.entries(launch))
    text(value, `launch.${name}`);
  const harness = launch.harness;
  assert.ok(harness in TRANSPORTS);
  assert.ok(receipt.episode.startsWith(`${harness}-`));
  const live = harness !== "double";
  if (live) {
    assert.match(launch.version, /^\d+\.\d+\.\d+$/u);
    assert.notEqual(launch.model, "process-double");
  } else {
    assert.equal(launch.version, "not-applicable");
    assert.equal(launch.model, "process-double");
  }

  const fixture = receipt.fixture.value;
  keys(
    fixture,
    [
      "target",
      "launchpad",
      "store",
      "repo",
      "baseCommit",
      "loadoutHash",
      "semanticHash",
      "allowedEffects",
      "grants",
      "commandStyle",
      "contract",
      "contractHash",
      "criteria",
      "tests",
      "surfaces",
      "roundLimit",
    ],
    "fixture",
  );
  assert.equal(fixture.target, "<scratch-repository>");
  assert.equal(fixture.launchpad, "<selected-dotln-worktree>");
  assert.equal(fixture.store, "<episode-store>");
  assert.equal(fixture.repo, "wo056-scratch-target");
  assert.match(fixture.baseCommit, commit);
  assert.match(fixture.loadoutHash, /^[a-f0-9]{64}$/u);
  assert.match(fixture.semanticHash, /^fnv1a64:[a-f0-9]{16}$/u);
  assert.match(fixture.contractHash, /^fnv1a64:[a-f0-9]{16}$/u);
  assert.deepEqual(fixture.grants, []);
  assert.equal(fixture.roundLimit, 2);
  assert.ok(["bare", "absolute"].includes(fixture.commandStyle));
  // This receipt kind has one fixture: two clauses, one writable module.
  assert.deepEqual(fixture.surfaces, SURFACES);
  keys(
    fixture.contract,
    [
      "workOrderId",
      "objective",
      "acceptanceCriteria",
      "constraints",
      "nonGoals",
      "requiredEvidence",
    ],
    "fixture.contract",
  );
  assert.equal(fixture.criteria.length, 2);
  assert.equal(fixture.tests.length, 2);
  const node = fixture.commandStyle === "bare" ? "node" : "<node-executable>";
  fixture.criteria.forEach((criterion, index) => {
    const checkId = index === 0 ? "superficial" : "contract";
    assert.deepEqual(criterion, {
      criterionId: index === 0 ? "AC-positive" : "AC-signed",
      description: fixture.contract.acceptanceCriteria[index],
      claimType: "behavior",
      evidenceSource: "live",
      codeSurfaces: SURFACES,
      requiredChecks: [checkId],
    });
    assert.deepEqual(fixture.tests[index], {
      criterionId: criterion.criterionId,
      checkId,
      command: `${node} ${TEST_FILES[checkId]}`,
    });
  });
  assert.equal(fixture.contract.acceptanceCriteria.length, 2);
  assert.deepEqual(
    fixture.contract.requiredEvidence,
    fixture.tests.map((test) => test.command),
  );
  // An absolute command is published redacted, so only a bare contract rehashes.
  if (fixture.commandStyle === "bare")
    assert.equal(
      fixture.contractHash,
      `fnv1a64:${fnv1a64(canonicalStringify(fixture.contract))}`,
    );

  const boundary = receipt.boundary.value;
  keys(boundary, ["before", "after", "unchanged"], "boundary");
  for (const snapshot of [boundary.before, boundary.after]) {
    if (snapshot.error) {
      keys(snapshot, ["error"], "boundary snapshot");
      assert.equal(snapshot.error, "protected-snapshot-unavailable");
      continue;
    }
    keys(
      snapshot,
      ["launchpad", "targetMain", "sentinel"],
      "boundary snapshot",
    );
    assert.match(snapshot.sentinel, /^[a-f0-9]{64}$/u);
    for (const checkout of [snapshot.launchpad, snapshot.targetMain]) {
      keys(
        checkout,
        ["head", "tree", "workingBytes", "index", "status"],
        "boundary checkout",
      );
      for (const value of Object.values(checkout))
        assert.match(value, /^[a-f0-9]{40,64}$/u);
    }
  }
  assert.equal(
    boundary.unchanged,
    !boundary.before.error &&
      !boundary.after.error &&
      isDeepStrictEqual(boundary.before, boundary.after),
    "boundary.unchanged restates the two snapshots",
  );

  const host = receipt.host.value;
  keys(host, ["exitCode", "signal", "durationMs", "stderrBytes"], "host");
  integer(host.exitCode, "host.exitCode", true);
  assert.ok(host.signal === null || typeof host.signal === "string");
  assert.ok(Number.isFinite(host.durationMs) && host.durationMs >= 0);
  integer(host.stderrBytes, "host.stderrBytes");
  if (receipt.failure.value !== null) {
    keys(receipt.failure.value, ["code", "detail"], "failure");
    text(receipt.failure.value.code, "failure.code");
    assert.ok(
      receipt.failure.value.detail === null ||
        typeof receipt.failure.value.detail === "string",
    );
  }

  assert.ok(Array.isArray(receipt.episodes.value));
  for (const episode of receipt.episodes.value) {
    // `refusal` joined the shape on 2026-09-20; receipts filed before it stay valid.
    const { refusal, ...rest } = episode;
    keys(
      rest,
      ["role", "ordinal", "durationMs", "exitCode", "wire", "failure", "usage"],
      "episode",
    );
    if (refusal !== undefined && refusal !== null) {
      keys(refusal, ["code", "detail"], "episode.refusal");
      text(refusal.code, "episode.refusal.code");
      assert.ok(
        refusal.detail === null ||
          (typeof refusal.detail === "string" && refusal.detail.length <= 160),
      );
    }
    assert.ok(["verifier", "worker"].includes(episode.role));
    integer(episode.ordinal, "episode.ordinal");
    assert.ok(Number.isFinite(episode.durationMs) && episode.durationMs >= 0);
    integer(episode.exitCode, "episode.exitCode", true);
    assert.ok(episode.failure === null || typeof episode.failure === "string");
    // Closed structural facts only; no vendor text has a field to live in.
    if (episode.wire !== null) {
      keys(
        episode.wire,
        [
          "lines",
          "invalidLines",
          "terminals",
          "terminalSuccess",
          "denialArrayPresent",
          "resultFormat",
          "containsEnvelope",
          "structuredEnvelopePresent",
        ],
        "episode.wire",
      );
      for (const name of ["lines", "invalidLines", "terminals"])
        integer(episode.wire[name], `wire.${name}`);
      for (const name of [
        "terminalSuccess",
        "denialArrayPresent",
        "containsEnvelope",
        "structuredEnvelopePresent",
      ])
        assert.equal(typeof episode.wire[name], "boolean");
      assert.ok(
        ["absent", "json", "fenced-json", "non-json"].includes(
          episode.wire.resultFormat,
        ),
      );
    }
    // Tokens are recorded where the transport reported them; absence stays null.
    if (episode.usage !== null) {
      assert.ok(live, "a process double reports no usage");
      // Each transport decodes its own vendor wire, so a reported usage names
      // the harness even when the event log is withheld.
      if (episode.usage.source !== "unavailable")
        assert.equal(
          episode.usage.source,
          `${harness}-result-envelope`,
          "usage names the launched harness's wire",
        );
      keys(
        episode.usage,
        ["activity", "source", "scope", "observedAt", "usage", "context"],
        "episode.usage",
      );
      keys(
        episode.usage.usage,
        [
          "inputTokens",
          "cachedInputTokens",
          "cacheWriteInputTokens",
          "outputTokens",
          "reasoningOutputTokens",
          "totalTokens",
          "costUsd",
        ],
        "episode.usage.usage",
      );
      for (const number of Object.values(episode.usage.usage))
        assert.ok(number === null || (Number.isFinite(number) && number >= 0));
    }
  }

  const witnessKeys = [
    "evidenceId",
    "criterionId",
    "checkId",
    "command",
    "exitCode",
    "signal",
    "outcome",
    "observed",
    "expected",
  ];
  const checkWitnesses = (witnesses, revision, path) => {
    assert.ok(Array.isArray(witnesses), path);
    for (const witness of witnesses) {
      keys(witness, witnessKeys, path);
      assert.ok(witness.evidenceId.startsWith(`${revision}:host-test:`), path);
      const named = fixture.tests.find(
        (test) => test.checkId === witness.checkId,
      );
      assert.ok(named, `${path} names a contract test`);
      assert.equal(witness.criterionId, named.criterionId);
      assert.equal(witness.command, named.command);
      assert.ok(["pass", "fail", "unavailable"].includes(witness.outcome));
      assert.equal(
        witness.outcome === "pass",
        witness.exitCode === 0 && witness.signal === null,
        `${path} outcome restates its exit`,
      );
    }
    unique(
      witnesses.map((witness) => witness.evidenceId),
      `${path} ids`,
    );
    unique(
      witnesses.map((witness) => witness.checkId),
      `${path} checks`,
    );
  };
  const checkRows = (rows, path) => {
    assert.ok(Array.isArray(rows), path);
    for (const row of rows) {
      keys(row, ["criterionId", "status"], path);
      assert.ok(
        ["incomplete", "verified", "failed", "stale"].includes(row.status),
      );
    }
    assert.deepEqual(
      rows.map((row) => row.criterionId),
      fixture.criteria.map((criterion) => criterion.criterionId),
      `${path} cover the contract`,
    );
  };

  if (seen("planted")) {
    const planted = receipt.planted.value;
    keys(
      planted,
      [
        "implementer",
        "commit",
        "changedPaths",
        "superficialTest",
        "implementerEnvelopeStatus",
      ],
      "planted",
    );
    assert.equal(planted.implementer, "process-double");
    assert.match(planted.commit, commit);
    assert.notEqual(planted.commit, fixture.baseCommit);
    keys(
      planted.superficialTest,
      ["command", "beforeExitCode", "afterExitCode"],
      "planted.superficialTest",
    );
    assert.equal(planted.superficialTest.command, fixture.tests[0].command);
  }
  if (seen("finding")) {
    const value = receipt.finding.value;
    keys(
      value,
      [
        "verifierEpisodeId",
        "summary",
        "witnesses",
        "rows",
        "finding",
        "openFindings",
        "clause",
      ],
      "finding",
    );
    assert.ok(seen("planted"), "a verification judges the planted commit");
    checkWitnesses(value.witnesses, receipt.planted.value.commit, "witness");
    checkRows(value.rows, "finding.rows");
    assert.ok(Array.isArray(value.openFindings));
    unique(value.openFindings, "open findings");
    if (value.finding !== null)
      assert.ok(value.openFindings.includes(value.finding.findingId));
  }
  if (seen("repair")) {
    const repair = receipt.repair.value;
    keys(
      repair,
      [
        "round",
        "findingId",
        "surfaces",
        "tests",
        "grantIds",
        "contractHash",
        "executionBaseCommit",
        "commit",
        "diffPaths",
        "focusedTest",
        "hostReproductions",
        "workerAttempts",
      ],
      "repair",
    );
    assert.match(repair.commit, commit);
    assert.match(repair.executionBaseCommit, commit);
    keys(
      repair.focusedTest,
      ["command", "beforeExitCode", "afterExitCode"],
      "repair.focusedTest",
    );
    assert.ok(Array.isArray(repair.hostReproductions));
    for (const test of repair.hostReproductions)
      keys(test, ["command", "exitCode", "signal"], "repair.hostReproductions");
    integer(repair.workerAttempts, "repair.workerAttempts");
  }
  if (seen("reverification")) {
    const again = receipt.reverification.value;
    keys(
      again,
      [
        "verifierEpisodeId",
        "summary",
        "subjectRevision",
        "contractHash",
        "contractUnchanged",
        "witnesses",
        "rows",
        "openFindings",
      ],
      "reverification",
    );
    assert.match(again.subjectRevision, commit);
    checkWitnesses(again.witnesses, again.subjectRevision, "re-witness");
    checkRows(again.rows, "reverification.rows");
  }
  if (seen("loop")) {
    const loop = receipt.loop.value;
    keys(
      loop,
      ["status", "round", "reason", "nextAction", "eventTypes"],
      "loop",
    );
    assert.ok(
      ["running", "complete", "exhausted", "needs-human"].includes(loop.status),
    );
    integer(loop.round, "loop.round");
    assert.ok(loop.reason === null || typeof loop.reason === "string");
    assert.ok(
      Array.isArray(loop.eventTypes) &&
        loop.eventTypes.every((type) => /^[A-Za-z]+$/u.test(type)),
    );
    assert.equal(
      loop.eventTypes.includes("RepairCompleted"),
      loop.status === "complete",
    );
    assert.equal(
      loop.eventTypes.includes("RepairExhausted"),
      loop.status === "exhausted",
    );
  }

  // The published log is the receipt's anchor: facts that restate it must equal it.
  if (seen("eventLog")) {
    const log = receipt.eventLog.value;
    keys(log, ["scope", "compilerPackageVersion", "lines"], "eventLog");
    assert.ok(Array.isArray(log.lines) && log.lines.length > 0);
    const events = log.lines.map((line, index) => {
      assert.equal(typeof line, "string");
      const event = JSON.parse(line);
      assert.equal(event.eventId, `evt_${index + 1}`);
      return event;
    });
    const hosted = (type, last = false) =>
      events[last ? "findLast" : "find"](
        (event) => event.type === type && event.actorId === "verification-host",
      );
    assert.ok(seen("planted") && seen("finding"), "a log implies its facts");
    const opened = hosted("VerificationOpened")?.payload;
    const capsule =
      hosted("CommandPersisted")?.payload?.command?.intent?.payload?.capsule;
    const attempt = hosted("WorkerAttemptStarted")?.payload;
    const admitted = hosted("CommandResult", true)?.payload?.value;
    assert.ok(
      opened && capsule && attempt && admitted,
      "log is a verification",
    );
    assert.equal(log.compilerPackageVersion, capsule.compilerPackageVersion);
    assert.deepEqual(opened.criteria, fixture.criteria);
    assert.deepEqual(opened.subject.snapshot.contract, fixture.contract);
    assert.deepEqual(opened.subject.snapshot.tests, fixture.tests);
    assert.equal(opened.subject.repo, fixture.repo);
    assert.equal(opened.subject.baseCommit, fixture.baseCommit);
    assert.equal(opened.subject.revision, receipt.planted.value.commit);
    // Not hash-bound, so not proof of a live launch; a relabelled double fails here.
    assert.equal(attempt.transport, TRANSPORTS[harness]);
    assert.equal(attempt.model, launch.model);
    assert.equal(attempt.effort, launch.effort);
    if (live) assert.equal(attempt.harnessVersion, launch.version);
    const stated = receipt.finding.value;
    assert.equal(admitted.envelope.episodeId, stated.verifierEpisodeId);
    assert.equal(admitted.envelope.summary, stated.summary);
    assert.deepEqual(
      admitted.findings.map((finding) => finding.findingId).sort(),
      [...stated.openFindings].sort(),
    );
    if (stated.finding !== null)
      assert.ok(
        admitted.findings.some((finding) =>
          isDeepStrictEqual(finding, stated.finding),
        ),
        "the stated finding is the verifier's, verbatim",
      );
    assert.deepEqual(
      opened.subject.evidence.map((witness) => ({
        evidenceId: witness.evidenceId,
        criterionId: witness.criterionId,
        checkId: witness.checkId,
        command: witness.hostTest.command,
        exitCode: witness.hostTest.exitCode,
        signal: witness.hostTest.signal,
        outcome: witness.outcome,
        observed: witness.observed,
        expected: witness.expected,
      })),
      stated.witnesses,
    );
  }
  if (seen("foldReplay")) {
    const replay = receipt.foldReplay.value;
    keys(
      replay,
      [
        "compilerPackageVersion",
        "events",
        "before",
        "control",
        "injections",
        "pendingInjections",
        "negativeRetained",
      ],
      "foldReplay",
    );
    assert.ok(seen("eventLog"), "a replay needs its published log");
    assert.equal(replay.events, receipt.eventLog.value.lines.length);
    assert.equal(
      replay.compilerPackageVersion,
      receipt.eventLog.value.compilerPackageVersion,
    );
    keys(
      replay.control,
      ["genuineResultAdmitted", "erasureHonoredFromVerifier"],
      "foldReplay.control",
    );
    const view = (value, extra, path) => {
      keys(value, ["phase", "rows", "openFindings", ...extra], path);
      checkRows(value.rows, `${path}.rows`);
    };
    view(replay.before, [], "foldReplay.before");
    for (const injection of replay.injections)
      view(injection, ["name", "unchanged"], "foldReplay.injection");
    for (const injection of replay.pendingInjections) {
      keys(
        injection,
        ["name", "matrixUnchanged", "afterRecordedTail", "tailEqualsRecorded"],
        "foldReplay.pendingInjection",
      );
      view(injection.afterRecordedTail, [], "foldReplay.afterRecordedTail");
    }
  }

  const result = receipt.result.value;
  const flags = [
    "findingPass",
    "repairPass",
    "reverificationPass",
    "foldPass",
    "containmentPass",
  ];
  keys(result, [...flags, "startedAt"], "result");
  for (const flag of flags) assert.equal(typeof result[flag], "boolean");
  assert.ok(Number.isFinite(Date.parse(result.startedAt)));
  assert.equal(result.containmentPass, boundary.unchanged);
  // A flag implies the live episodes that could have produced it.
  const ran = (role) =>
    receipt.episodes.value.filter(
      (episode) =>
        episode.role === role &&
        episode.failure === null &&
        (episode.refusal ?? null) === null &&
        (!live || (episode.exitCode === 0 && episode.wire !== null)),
    ).length;

  // Criterion 1: the finding names the violated clause while the superficial test passed.
  if (result.findingPass) {
    assert.ok(seen("planted") && seen("finding"));
    assert.ok(ran("verifier") >= 1, "a finding needs a verifier episode");
    const planted = receipt.planted.value;
    assert.deepEqual(planted.changedPaths, SURFACES);
    assert.ok(
      Number.isInteger(planted.superficialTest.beforeExitCode) &&
        planted.superficialTest.beforeExitCode > 0,
    );
    assert.equal(planted.superficialTest.afterExitCode, 0);
    assert.equal(planted.implementerEnvelopeStatus, "completed");
    const { finding, witnesses, rows, clause, verifierEpisodeId } =
      receipt.finding.value;
    text(verifierEpisodeId, "finding.verifierEpisodeId");
    keys(
      finding,
      [
        "findingId",
        "criterionId",
        "severity",
        "observed",
        "expected",
        "reproductionSteps",
        "evidenceRefs",
        "likelySurface",
      ],
      "finding.finding",
    );
    assert.equal(finding.severity, "blocking");
    for (const list of [
      finding.reproductionSteps,
      finding.evidenceRefs,
      finding.likelySurface,
    ]) {
      assert.ok(Array.isArray(list) && list.length > 0);
      for (const item of list) text(item, "finding list item");
    }
    // The planted defect violates the signed clause and only that clause.
    const criterion = fixture.criteria[1];
    assert.equal(finding.criterionId, criterion.criterionId);
    assert.equal(clause, criterion.description);
    const cited = finding.evidenceRefs.map((id) =>
      witnesses.find((witness) => witness.evidenceId === id),
    );
    assert.ok(
      cited.every(
        (witness) => witness && witness.criterionId === finding.criterionId,
      ),
      "every reference is a witness of the failed criterion",
    );
    assert.ok(
      cited.some(
        (witness) =>
          witness.outcome === "fail" &&
          criterion.requiredChecks.includes(witness.checkId) &&
          witness.observed === finding.observed &&
          witness.expected === finding.expected &&
          witness.exitCode > 0,
      ),
      "finding restates its adverse host witness",
    );
    const superficial = witnesses.find(
      (witness) => witness.checkId === "superficial",
    );
    assert.ok(superficial, "the superficial test was witnessed");
    assert.equal(superficial.outcome, "pass");
    assert.equal(
      rows.find((row) => row.criterionId === finding.criterionId).status,
      "failed",
    );
    assert.deepEqual(finding.likelySurface, SURFACES);
  }

  // Criterion 2: the repair stays inside the finding's surfaces and the
  // re-verification judges the original contract. Only a first-round repair
  // can pass; a later round is filed as it happened, with this flag false.
  if (result.repairPass) {
    assert.equal(result.findingPass, true);
    assert.ok(seen("repair"));
    assert.ok(ran("worker") >= 1, "a repair needs a worker episode");
    const repair = receipt.repair.value;
    const { finding } = receipt.finding.value;
    assert.equal(repair.round, 1);
    assert.equal(repair.findingId, finding.findingId);
    assert.deepEqual(repair.diffPaths, SURFACES);
    assert.deepEqual(repair.surfaces, SURFACES);
    // Derived from the finding's reproduction; the contract test sorts first
    // and is the worker's focused test, red before the repair.
    unique(repair.tests, "repair tests");
    assert.equal(repair.tests[0], fixture.tests[1].command);
    assert.ok(
      repair.tests.every((command) =>
        fixture.tests.some((test) => test.command === command),
      ),
    );
    assert.deepEqual(repair.grantIds, []);
    assert.equal(repair.contractHash, fixture.contractHash);
    assert.equal(repair.executionBaseCommit, receipt.planted.value.commit);
    assert.notEqual(repair.commit, receipt.planted.value.commit);
    assert.equal(repair.focusedTest.command, repair.tests[0]);
    assert.ok(repair.focusedTest.beforeExitCode > 0);
    assert.equal(repair.focusedTest.afterExitCode, 0);
    assert.deepEqual(
      repair.hostReproductions,
      repair.tests.map((command) => ({ command, exitCode: 0, signal: null })),
    );
    assert.equal(repair.workerAttempts, 1);
  }
  if (result.reverificationPass) {
    assert.equal(result.repairPass, true);
    assert.ok(seen("reverification") && seen("loop"));
    assert.ok(ran("verifier") >= 2, "re-verification is a second episode");
    const again = receipt.reverification.value;
    assert.equal(again.subjectRevision, receipt.repair.value.commit);
    assert.equal(again.contractHash, fixture.contractHash);
    assert.equal(again.contractUnchanged, true);
    assert.ok(again.rows.every((row) => row.status === "verified"));
    assert.deepEqual(
      again.witnesses.map((witness) => witness.checkId),
      fixture.tests.map((test) => test.checkId),
    );
    assert.ok(again.witnesses.every((witness) => witness.outcome === "pass"));
    assert.deepEqual(again.openFindings, []);
    text(again.verifierEpisodeId, "reverification.verifierEpisodeId");
    assert.notEqual(
      again.verifierEpisodeId,
      receipt.finding.value.verifierEpisodeId,
    );
    assert.equal(receipt.loop.value.status, "complete");
    assert.equal(receipt.loop.value.round, 1);
    assert.equal(host.exitCode, 0);
    assert.equal(host.signal, null);
    assert.equal(receipt.failure.value, null);
  }
  // Criterion 3 is re-executed from eventLog by the regression fixture; the
  // recorded replay must agree with its own summary.
  if (result.foldPass) {
    assert.equal(result.findingPass, true);
    assert.ok(seen("foldReplay"));
    const replay = receipt.foldReplay.value;
    const failed = receipt.finding.value.finding.criterionId;
    const negative = (view) =>
      view.rows.find((row) => row.criterionId === failed).status === "failed" &&
      view.openFindings.includes(receipt.finding.value.finding.findingId);
    assert.equal(replay.negativeRetained, true);
    assert.deepEqual(replay.control, {
      genuineResultAdmitted: true,
      erasureHonoredFromVerifier: true,
    });
    assert.ok(negative(replay.before));
    assert.ok(replay.injections.length >= 2);
    for (const injection of replay.injections)
      assert.ok(injection.unchanged && negative(injection), injection.name);
    assert.ok(replay.pendingInjections.length >= 6);
    for (const injection of replay.pendingInjections)
      assert.ok(
        injection.matrixUnchanged &&
          injection.tailEqualsRecorded &&
          negative(injection.afterRecordedTail),
        injection.name,
      );
  }
  return receipt;
}
