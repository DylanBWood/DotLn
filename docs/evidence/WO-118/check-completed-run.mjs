// Read-only checks of retained local proof stores. An optional argument selects
// the corrected run directory; otherwise the ignored local pointer is used.
import assert from "node:assert/strict";
import { readFileSync, readdirSync, realpathSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const rows = (file) =>
  readFileSync(file, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const base = resolve(
  process.argv[2] ?? json("docs/control/local/wo118-corrected.json").directory,
);
const binding = json(join(base, "binding.json"));
const result = json(join(base, "run-result.json"));
const resident = rows(join(binding.store, "events.jsonl"));
assert(resident.every((event) => event.actorId === "resident-host"));
assert(
  resident
    .filter((event) => event.payload.origin === "human")
    .every(
      (event) =>
        event.type === "OperatorPresenceObserved" &&
        event.payload.signal.kind === "away",
    ),
);
assert(!resident.some((event) => event.type === "OperatorPresenceChanged"));
const verticalRoot = join(binding.store, "vertical", result.key);
const vertical = rows(join(verticalRoot, "events.jsonl"));
const source = rows(join(verticalRoot, "source/events.jsonl"));
const files = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(join(directory, entry.name))
      : [join(directory, entry.name)],
  );
const all = files(binding.store);
const attempts = all
  .filter((file) => file.endsWith("/events.jsonl"))
  .flatMap((file) =>
    rows(file).filter((event) => event.type === "WorkerAttemptStarted"),
  );
const triages = all
  .filter((file) => /\/triage-[^/]+\.json$/u.test(file))
  .map(json);
const intake = readdirSync(join(binding.store, "issue-intake")).filter((name) =>
  name.endsWith(".json"),
);
assert.deepEqual([attempts.length, triages.length, intake.length], [7, 4, 2]);
assert.equal(
  vertical.filter((event) => event.type === "VerticalStepCompleted").length,
  14,
);
assert.equal(vertical.at(-1).payload.value.status, "resolved");
assert.equal(
  resident.filter((event) => event.type === "IntentAdmitted").length,
  1,
);
const writers = source.filter((event) => event.type === "WorkerAttemptStarted");
assert.equal(writers.length, 2);
assert.equal(writers[0].payload.commandId, writers[1].payload.commandId);
assert.equal(writers[0].episodeId, writers[1].episodeId);
assert.equal(
  source.filter((event) => event.type === "SourceChangeObserved").length,
  1,
);
const stopped = source.findIndex(
  (event) => event.type === "SourceChangeProcessStopped",
);
assert(stopped >= 0 && stopped < source.indexOf(writers[1]));
const actions = json(join(base, "actions.json"));
assert.deepEqual(
  [...new Set(actions.map((event) => event.type))].sort(),
  [
    "actor-kill",
    "ambiguous-answer",
    "incorrect-review-suggestion",
    "resident-SIGTERM",
    "resident-exit",
    "resident-start",
  ].sort(),
);
for (const type of [
  "actor-kill",
  "ambiguous-answer",
  "incorrect-review-suggestion",
])
  assert.equal(actions.filter((event) => event.type === type).length, 1);
assert.equal(
  actions.find((event) => event.type === "actor-kill").residentKeptAlive,
  true,
);
assert.equal(
  actions.find((event) => event.type === "actor-kill").signal,
  "SIGKILL",
);
assert.equal(
  actions.find((event) => event.type === "ambiguous-answer").consumedByRuntime,
  false,
);
assert.equal(
  actions.filter((event) => event.type === "resident-start").length,
  2,
);
assert.equal(
  actions.filter((event) => event.type === "resident-exit").length,
  2,
);
const killed = Date.parse(
  actions.find((event) => event.type === "resident-SIGTERM").at,
);
const steps = vertical.filter(
  (event) => event.type === "VerticalStepCompleted",
);
assert(steps[0].occurredAt <= killed && killed < steps[1].occurredAt);
const controlSetup = json(join(base, "control-author-setup.json"));
assert.equal(
  controlSetup.purpose,
  "incorrect-review-control fixture author mapping",
);
assert.equal(controlSetup.modelJudgmentsSupplied, 0);
assert.equal(
  controlSetup.scope,
  "Recognize only the authorized scratch fixture principal as automation; no triage disposition or authority grant supplied.",
);
const configuredAt = Date.parse(controlSetup.at);
assert(Date.parse(result.startedAt) < configuredAt);
assert(
  configuredAt <
    steps.find((event) => event.payload.command.step === "publish").occurredAt,
);
assert(
  configuredAt <
    Date.parse(
      actions.find((event) => event.type === "incorrect-review-suggestion").at,
    ),
);
const expectedControls = json(
  new URL("./completed-run/control-actions.json", import.meta.url),
);
const setupControls = expectedControls.filter(
  (event) => event.type === "review-control-author-setup",
);
assert.deepEqual(setupControls, [
  {
    type: "review-control-author-setup",
    source: "separate setup receipt",
    ...controlSetup,
  },
]);
assert.deepEqual(
  expectedControls.filter(
    (event) => event.type !== "review-control-author-setup",
  ),
  actions.map((event) => ({
    type: event.type,
    at: event.at,
    ...(event.signal ? { signal: event.signal } : {}),
    ...(event.residentKeptAlive ? { residentKeptAlive: true } : {}),
    ...(event.consumedByRuntime !== undefined
      ? { consumedByRuntime: event.consumedByRuntime }
      : {}),
  })),
);
const wrong = triages.find((record) =>
  record.subject.item.text.startsWith("Set the status back to Pending"),
);
assert.equal(wrong.provenance.kind, "model");
assert.equal(wrong.result.kind, "reject");
assert.equal(wrong.result.evidenceRefs.length, 3);
assert.equal(
  triages.find((record) =>
    record.subject.item.text.startsWith("Remove the trailing whitespace"),
  ).result.kind,
  "accept",
);
const audit = readFileSync(join(base, "audit.txt"), "utf8");
assert.deepEqual(
  JSON.parse(audit.split("GOVERNED RAW JSON\n")[1]).events,
  vertical,
);
assert.equal(vertical.length, 29);
const expectedHuman = json(
  new URL("./completed-run/human-events.json", import.meta.url),
);
const human = resident
  .filter(
    (event) =>
      event.type === "OperatorPresenceObserved" &&
      event.payload.origin === "human",
  )
  .map((event) => ({
    store: "resident",
    eventId: event.eventId,
    type: event.type,
    purpose: "setup",
  }));
const admitted = resident.find((event) => event.type === "IntentAdmitted")
  .payload.draftId;
for (const file of readdirSync(join(binding.root, "docs/control/orders"))
  .sort()
  .filter((name) => name.endsWith(".jsonl")))
  for (const event of rows(join(binding.root, "docs/control/orders", file)))
    if (
      event.type === "WorkOrderIdentityAllocated" &&
      event.provenance?.kind === "intent"
    )
      human.push({
        store: "instance-control",
        eventId: event.workOrderId + ":WorkOrderIdentityAllocated",
        type: event.type,
        purpose:
          event.workOrderId === admitted
            ? "initial-intent"
            : "ambiguous-control-intent",
      });
assert.deepEqual(human, expectedHuman);
assert.equal(human.length, 3);
const target = realpathSync(binding.target);
const git = (args) =>
  execFileSync("git", args, { cwd: target, encoding: "utf8" }).trim();
assert.equal(git(["rev-parse", "--show-toplevel"]), target);
const pr = json(join(base, "pr-observed.json"));
const firstHead = json(join(base, "delivered.json")).headRefOid;
assert.equal(pr.commits.length, 2);
git(["merge-base", "--is-ancestor", firstHead, pr.headRefOid]);
assert.equal(
  git(["rev-list", "--count", firstHead + ".." + pr.headRefOid]),
  "1",
);
assert(
  git(["for-each-ref", "--format=%(objectname) %(refname)", "refs/heads"])
    .split("\n")
    .some((line) =>
      line.startsWith(pr.headRefOid + " refs/heads/dotln-repair-"),
    ),
);
const page = git(["show", pr.headRefOid + ":index.html"]);
assert.match(
  page,
  /<p id="status" role="status" aria-label="Build status">Ready<\/p>/u,
);
assert.match(page, /Scratch welcome/u);
assert(pr.commits.every((commit) => /^fix: /u.test(commit.messageHeadline)));
const verification = all
  .filter(
    (file) =>
      file.includes("/children/verification-") &&
      file.endsWith("/events.jsonl"),
  )
  .flatMap(rows);
const snapshot = verification.find(
  (event) => event.type === "RepairSnapshotPrepared",
).payload.subject.snapshot;
assert.equal(snapshot.observedCommit, pr.headRefOid);
const observed = verification.find(
  (event) => event.type === "VerificationWorkerResultObserved",
);
assert.equal(observed.payload.value.envelope.requiresHuman, false);
assert.equal(observed.payload.value.subjectRevision, pr.headRefOid);
assert.equal(observed.payload.value.evaluations.length, 1);
assert.equal(observed.payload.value.evaluations[0].verdict, "pass");
assert.equal(observed.payload.value.findings.length, 0);
assert.equal(snapshot.contract.acceptanceCriteria.length, 1);
console.log(
  JSON.stringify({
    terminal: "resolved",
    verticalPhases: 14,
    modelLaunches: 13,
    sourceAttempts: 2,
    sourceCommits: 1,
    repairCommits: 1,
    originalCriteria: 1,
    deliveredHeadMatchesVerifier: true,
    auditEvents: 29,
    humanOriginEvents: human.length,
    wrongSuggestion: "model-rejected",
  }),
);
