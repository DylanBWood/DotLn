// Read-only checks of the witnessed starter run: one fresh export of the
// repaired subject carrying the loop, the actor replacement, the resident
// restart, both controls, delivery and review, with the shipped console live
// throughout and the audit view afterward. Each claim is re-derived from the
// retained local run directory and compared with the committed evidence
// beside this file. GitHub-side facts come from the read-only reads the
// recorder kept in that directory (pr-observed.json and pr-threads.json).
// The run directory lives under the system temporary root and can be purged;
// the committed receipt, transcripts and measures then remain the record.
// Usage: node docs/evidence/WO-118/check-witnessed-run.mjs [run-directory]
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  realpathSync,
  statSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

// The scenario the run was driven through.
const STEPS = [
  "bundle",
  "contract",
  "surfaces",
  "derived-order",
  "baseline",
  "source-change",
  "witnesses",
  "verification",
  "review",
  "preparation",
  "lint",
  "publish",
  "observation",
  "resolution",
];
const REFRESH_MS = 1000; // the live console repaints at most once a second
const LONG_STEP_MS = 2 * REFRESH_MS; // a step this long spans two repaints
const LAUNCH_ABORT = 18; // the driver would have stopped the run at this launch
const PLANTED = "Set the status back to Pending";
const DELAYED = "Remove the trailing whitespace";

const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const rows = (file) =>
  readFileSync(file, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const evidence = (name) => new URL(`./witnessed-run/${name}`, import.meta.url);
const repository = fileURLToPath(new URL("../../../", import.meta.url));
const pointer = join(repository, "docs/control/local/wo118-witnessed.json");
const unavailable = (what) => {
  console.error(
    `${what}; the committed receipt, transcripts and measures are the record of this run.`,
  );
  process.exit(2);
};
if (!process.argv[2] && !existsSync(pointer))
  unavailable("No local pointer to the retained run directory");
const base = resolve(process.argv[2] ?? json(pointer).directory);
if (!existsSync(join(base, "binding.json")))
  unavailable("The retained run directory is no longer present");

const binding = json(join(base, "binding.json"));
const result = json(join(base, "run-result.json"));
const actions = json(join(base, "actions.json"));
const commands = json(join(base, "commands.json"));
const receipt = json(evidence("receipt.json"));
const resident = rows(join(binding.store, "events.jsonl"));
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
const time = (row) => Date.parse(row.at);
const first = (type) => actions.find((row) => row.type === type);
const alias = (text) => text.replaceAll(result.key, "<run-key>");
const target = realpathSync(binding.target);
const git = (args) =>
  execFileSync("git", args, {
    cwd: target,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  }).trim();

const steps = vertical.filter(
  (event) => event.type === "VerticalStepCompleted",
);
const stepCommand = (step) =>
  steps.find((event) => event.payload.command.step === step).payload.command
    .commandId;
const started = resident.filter((event) => event.type === "IntentStepStarted");
const settled = resident.filter((event) => event.type === "IntentStepSettled");
const settlementOf = (start) =>
  settled.find((end) => end.payload.commandId === start.payload.commandId);
const last = steps.at(-1);
const terminalAt = last.occurredAt;

// The resident's actors perform every phase transition, and the only
// human-side events are the declared setup, filings and control inputs
// (criterion 1).
assert(resident.every((event) => event.actorId === "resident-host"));
assert(vertical.every((event) => event.actorId === "vertical-host"));
assert(!resident.some((event) => event.type === "OperatorPresenceChanged"));
const humanPresence = resident.filter(
  (event) => event.payload.origin === "human",
);
assert.deepEqual(
  humanPresence.map((event) => [event.type, event.payload.signal.kind]),
  [["OperatorPresenceObserved", "away"]],
);
assert.deepEqual(
  steps.map((event) => event.payload.command.step),
  STEPS,
);
assert(steps.every((event) => event.payload.result === "completed"));
assert.equal(last.payload.value.status, "resolved");
assert(
  !settled.some(
    (event) =>
      event.payload.key === result.key && event.payload.result === "NeedsHuman",
  ),
);
const admissions = resident.filter((event) => event.type === "IntentAdmitted");
const holds = resident.filter((event) => event.type === "IntentHeld");
assert.equal(admissions.length, 1);
assert.equal(holds.length, 1);
assert.equal(admissions[0].payload.draftId, result.representative);
assert.equal(holds[0].payload.draftId, result.ambiguousDraft);
const allocations = readdirSync(join(binding.root, "docs/control/orders"))
  .filter((name) => name.endsWith(".jsonl"))
  .sort()
  .flatMap((name) => rows(join(binding.root, "docs/control/orders", name)))
  .filter((event) => event.type === "WorkOrderIdentityAllocated");
const human = humanPresence.map((event) => ({
  store: "resident",
  eventId: event.eventId,
  type: event.type,
  purpose: "setup",
}));
for (const event of allocations)
  if (event.provenance?.kind === "intent")
    human.push({
      store: "instance-control",
      eventId: event.workOrderId + ":WorkOrderIdentityAllocated",
      type: event.type,
      purpose:
        event.workOrderId === result.representative
          ? "initial-intent"
          : "ambiguous-control-intent",
    });
assert.deepEqual(human, json(evidence("human-events.json")));
assert.equal(human.length, 3);
const derived = allocations.filter(
  (event) => event.provenance?.kind === "runtime",
);
assert.equal(derived.length, 1);
assert.equal(derived[0].workOrderId, receipt.representative.derivedOrder);
// The driver ran only presence and the two filings before the terminal
// state, then the two audits after it.
assert.deepEqual(
  commands.map((row) => row.args.slice(0, 2)),
  [
    ["presence", "away"],
    [
      "intent",
      `Resolve the decision in https://github.com/${binding.repo}/issues/${binding.issues.ambiguous}`,
    ],
    [
      "intent",
      `Implement https://github.com/${binding.repo}/issues/${binding.issues.representative}`,
    ],
    ["audit", "--store"],
    ["audit", "--store"],
  ],
);
assert(Date.parse(commands[2].at) < terminalAt);
assert(Date.parse(commands[3].at) > terminalAt);
// Console input was only requests for status frames, which append no event;
// the driver's closing quit after the run is not recorded among them.
assert(
  json(join(base, "console-inputs.json")).every((row) => row.line === "status"),
);
const authorSetup = json(join(base, "control-author-setup.json"));
assert.equal(authorSetup.modelJudgmentsSupplied, 0);
assert(
  Date.parse(authorSetup.at) < time(first("resident-start")) &&
    Date.parse(authorSetup.at) < Date.parse(commands[1].at),
);
const controlTypes = [
  "actor-kill",
  "resident-SIGTERM",
  "resident-start",
  "resident-exit",
  "ambiguous-answer",
  "incorrect-review-suggestion",
];
const controls = json(evidence("control-actions.json"));
assert.deepEqual(controls[0], {
  type: "review-control-author-setup",
  source: "separate setup receipt",
  ...authorSetup,
});
assert.equal(controls[1].type, "scratch-control-issue-setup");
assert(Date.parse(controls[1].at) < time(first("resident-start")));
assert.deepEqual(
  controls.slice(2),
  actions
    .filter((row) => controlTypes.includes(row.type))
    .map((row) => ({
      type: row.type,
      at: row.at,
      ...(row.signal ? { signal: row.signal } : {}),
      ...(row.residentKeptAlive ? { residentKeptAlive: true } : {}),
      ...(row.consumedByRuntime !== undefined
        ? { consumedByRuntime: row.consumedByRuntime }
        : {}),
    })),
);
for (const type of [
  "actor-kill",
  "ambiguous-answer",
  "incorrect-review-suggestion",
])
  assert(time(first(type)) < terminalAt, `${type} precedes the terminal state`);
assert.equal(first("ambiguous-answer").consumedByRuntime, false);
assert(time(first("ambiguous-answer")) < Date.parse(commands[2].at));

// The killed writer is replaced under the same command and episode without a
// second commit, and the restart between two steps resumes the same identity
// (criterion 2).
const kill = first("actor-kill");
assert.equal(kill.signal, "SIGKILL");
assert.equal(kill.residentKeptAlive, true);
assert(kill.heartbeatsBeforeKill >= 1);
assert.equal(kill.commitsBeforeKill, 0);
assert.equal(kill.dirtyPathsBeforeKill, 0);
const writers = source.filter((event) => event.type === "WorkerAttemptStarted");
assert.equal(writers.length, 2);
assert.equal(writers[0].payload.commandId, writers[1].payload.commandId);
assert.equal(writers[0].episodeId, writers[1].episodeId);
assert.equal(writers[0].payload.commandId, kill.commandId);
const stopped = source.findIndex(
  (event) => event.type === "SourceChangeProcessStopped",
);
assert(stopped >= 0 && stopped < source.indexOf(writers[1]));
assert(
  writers[0].occurredAt < time(kill) && time(kill) < writers[1].occurredAt,
);
assert.equal(
  source.filter((event) => event.type === "SourceChangeObserved").length,
  1,
);
// The resident ledger names the vertical step, not the source host's
// command: the step started and settled once across the writer's death.
for (const events of [started, settled])
  assert.equal(
    events.filter(
      (event) => event.payload.commandId === stepCommand("source-change"),
    ).length,
    1,
  );
const sigterm = time(first("resident-SIGTERM"));
const starts = actions.filter((row) => row.type === "resident-start");
assert.equal(starts.length, 2);
assert.equal(
  actions.filter((row) => row.type === "resident-exit").length,
  starts.length,
);
const bundleSettled = settlementOf(
  started.find((event) => event.payload.commandId === stepCommand("bundle")),
);
const contractStarted = started.find(
  (event) => event.payload.commandId === stepCommand("contract"),
);
assert(bundleSettled.occurredAt < sigterm);
assert(
  sigterm < time(starts[1]) && time(starts[1]) < contractStarted.occurredAt,
);
// No step was in flight across the restart.
assert(
  started.every(
    (event) =>
      settlementOf(event).occurredAt < sigterm ||
      event.occurredAt > time(starts[1]),
  ),
);
assert.equal(
  vertical.filter((event) => event.type === "VerticalOpened").length,
  1,
);
assert(started.every((event) => event.payload.key === result.key));

// Delivery, the delayed comment and the planted suggestion (criterion 3).
assert.equal(git(["rev-parse", "--show-toplevel"]), target);
assert.equal(
  Number(git(["rev-list", "--count", `main..fix/intent-${result.key}`])),
  1,
);
const pr = json(join(base, "pr-observed.json"));
const threads = json(join(base, "pr-threads.json"));
const firstHead = json(join(base, "delivered.json")).headRefOid;
assert.equal(pr.state, "OPEN");
git(["merge-base", "--is-ancestor", firstHead, pr.headRefOid]);
assert.equal(
  git(["rev-list", "--count", `${firstHead}..${pr.headRefOid}`]),
  "1",
);
assert(
  git(["for-each-ref", "--format=%(objectname) %(refname)", "refs/heads"])
    .split("\n")
    .some((line) =>
      line.startsWith(pr.headRefOid + " refs/heads/dotln-repair-"),
    ),
);
assert.equal(pr.commits.length, 2);
assert(pr.commits.every((commit) => /^fix: /u.test(commit.messageHeadline)));
assert.match(
  git(["show", `${pr.headRefOid}:index.html`]),
  /<p id="status" role="status" aria-label="Build status">Ready<\/p>/u,
);
const triages = all
  .filter((file) => /\/triage-[^/]+\.json$/u.test(file))
  .map(json);
const planted = triages.filter((record) =>
  record.subject.item.text.startsWith(PLANTED),
);
assert(planted.length >= 1);
for (const record of planted) {
  assert.equal(record.provenance.kind, "model");
  assert.equal(record.result.kind, "reject");
  assert(record.result.evidenceRefs.length >= 1);
}
const delayed = triages.filter((record) =>
  record.subject.item.text.startsWith(DELAYED),
);
assert(delayed.length >= 1);
assert(
  delayed.every(
    (record) =>
      record.provenance.kind === "model" && record.result.kind === "accept",
  ),
);
assert(threads.length >= 2 && threads.every((thread) => thread.isResolved));
assert.deepEqual(receipt.delivery.threads, {
  total: threads.length,
  resolved: threads.length,
});
// The verification after the repair judged the delivered head against the
// original criteria.
const verification = all
  .filter(
    (file) =>
      file.includes("/children/verification-") &&
      file.endsWith("/events.jsonl"),
  )
  .flatMap(rows);
const snapshot = verification.findLast(
  (event) => event.type === "RepairSnapshotPrepared",
).payload.subject.snapshot;
const verified = verification.findLast(
  (event) => event.type === "VerificationWorkerResultObserved",
).payload.value;
assert.equal(snapshot.observedCommit, pr.headRefOid);
assert.equal(verified.subjectRevision, pr.headRefOid);
assert.equal(verified.envelope.requiresHuman, false);
assert.equal(verified.findings.length, 0);
assert.equal(
  verified.evaluations.length,
  snapshot.contract.acceptanceCriteria.length,
);
assert(verified.evaluations.every((row) => row.verdict === "pass"));
// The instance's outward screen passes the generated branch, title, body and
// commits and every reply the runtime posted on the pull request.
const { checkOutwardArtifact } = await import(
  pathToFileURL(join(binding.root, "scripts/outward-lint.mjs")).href
);
const replies = threads
  .flatMap((thread) => thread.comments.nodes)
  .filter(
    (comment) =>
      comment.author?.login === pr.author.login &&
      !comment.body.startsWith(PLANTED),
  );
assert(replies.length >= 1);
const artifacts = [
  ["branch", pr.headRefName],
  ["pr-title", pr.title],
  ["pr-body", pr.body],
  ...pr.commits.map((commit) => [
    "commit",
    commit.messageHeadline +
      (commit.messageBody ? "\n\n" + commit.messageBody : ""),
  ]),
  ...replies.map((comment) => ["pr-body", comment.body]),
];
const outward = json(evidence("outward.json"));
const lint = artifacts.map(
  ([kind, text]) => checkOutwardArtifact(binding.root, { kind, text }).status,
);
assert(lint.every((status) => status === "pass"));
assert.deepEqual(
  lint,
  outward.lint.map((row) => row.status),
);
const denied = new RegExp(`\\b(?:${outward.publicTerms.join("|")})\\b`, "iu");
const paths = git(["ls-tree", "-r", "--name-only", pr.headRefOid])
  .split("\n")
  .filter(Boolean);
assert.equal(paths.length, outward.trackedFiles);
assert.deepEqual(
  paths.filter((path) => {
    const text = path + "\n" + git(["show", `${pr.headRefOid}:${path}`]);
    return (
      denied.test(text) ||
      outward.pathPrefixes.some((prefix) => text.includes(prefix))
    );
  }),
  [],
);

// The shipped console showed the run's actors, phases, holds and orders while
// it ran, and the audit reproduces the run afterward (criterion 4).
assert(time(first("console-start")) < Date.parse(commands[0].at));
assert(time(first("console-stop")) > terminalAt);
const transcript = readFileSync(join(base, "console-live.txt"), "utf8");
assert.equal(readFileSync(evidence("console.txt"), "utf8"), alias(transcript));
// A live frame painted right after a requested status frame repaints the
// same view, so only change-driven frames count as the console's own report.
const frames = [];
for (const line of transcript.split("\n")) {
  if (line.startsWith("Runtime status (runtime-status-v1)"))
    frames.push({ kind: "status", heading: line, lines: [] });
  else if (line.startsWith("Changed: "))
    frames.push({
      kind: frames.at(-1)?.kind === "status" ? "repaint" : "change",
      heading: line,
      lines: [],
    });
  else frames.at(-1)?.lines.push(line);
}
const actorsOf = (frame) => {
  if (frame.kind === "status") {
    const heading = frame.lines.indexOf("Actors");
    assert(heading >= 0, `status frame without actors: ${frame.heading}`);
    const block = [];
    for (const line of frame.lines.slice(heading + 1)) {
      if (!line.trim()) break;
      block.push(line);
    }
    return block.map((line) => {
      const match = line.match(/^ {2}(\S+): (\S+) · (\w+) · last /u);
      assert(match, `unparsed status actor: ${line}`);
      return { phase: match[1], kind: match[2], availability: match[3] };
    });
  }
  if (frame.lines.some((line) => line.startsWith("Runtime status unavailable")))
    return [];
  const line = frame.lines.find((text) => text.startsWith("Actors: "));
  assert(line, `live frame without actors: ${frame.heading}`);
  return line
    .slice("Actors: ".length)
    .split(", ")
    .map((text) => {
      const match = text.match(/^(\S+): (\S+) \((\w+)\)$/u);
      assert(match, `unparsed actor: ${text}`);
      return { phase: match[1], kind: match[2], availability: match[3] };
    });
};
const working = (frame) =>
  actorsOf(frame).filter(
    (row) => row.kind === "vertical-host" && row.availability === "available",
  );
const holdReason = `intent-needs-human:${holds[0].payload.step}`;
const holdShown = (frame) =>
  frame.lines.some((line) => line.includes(holdReason));
const changes = frames.filter((frame) => frame.kind === "change");
const statusFrames = frames.filter((frame) => frame.kind === "status");
const repaints = frames.filter((frame) => frame.kind === "repaint");
const paintedLive = new Set(
  changes.flatMap((frame) => working(frame).map((row) => row.phase)),
);
// A step that lasted two console refreshes or more was painted live.
const longSteps = started
  .filter(
    (event) =>
      settlementOf(event).occurredAt - event.occurredAt >= LONG_STEP_MS,
  )
  .map(
    (event) =>
      steps.find(
        (step) => step.payload.command.commandId === event.payload.commandId,
      ).payload.command.step,
  );
assert(longSteps.length >= 3);
for (const step of longSteps)
  assert(paintedLive.has(step), `${step} was painted live`);
assert(
  changes.some((frame) => working(frame).length && holdShown(frame)),
  "the hold is on screen while a vertical step runs",
);
assert(
  frames.some((frame) =>
    frame.lines.some((line) =>
      line.startsWith(`  ${receipt.representative.derivedOrder}: active · `),
    ),
  ),
  "the derived order's status is on screen",
);
const observedAt = (frame) => Number(frame.heading.match(/observed (\d+)/u)[1]);
assert(
  statusFrames.some(
    (frame) =>
      observedAt(frame) > time(starts[1]) &&
      actorsOf(frame).some((row) => row.kind === "vertical-host"),
  ),
  "the console kept showing the run after the resident restart",
);
const finalFrame = frames.findLast((frame) => frame.kind !== "status");
assert.deepEqual(
  actorsOf(finalFrame).filter((row) => row.kind === "vertical-host"),
  [],
);
assert(holdShown(finalFrame));
assert.deepEqual(
  {
    frames: frames.length,
    changeFrames: changes.length,
    statusFrames: statusFrames.length,
    repaintsAfterStatus: repaints.length,
    phasesLive: [...paintedLive],
    stepsLastingTwoSecondsOrMore: longSteps,
  },
  {
    frames: receipt.console.frames,
    changeFrames: receipt.console.changeFrames,
    statusFrames: receipt.console.statusFrames,
    repaintsAfterStatus: receipt.console.repaintsAfterStatus,
    phasesLive: receipt.console.phasesLive,
    stepsLastingTwoSecondsOrMore: receipt.console.stepsLastingTwoSecondsOrMore,
  },
);
// Status snapshots: the committed views are the copied files, one per
// settlement plus the hold, kill and terminal state; the restart has a marker
// row and no view. Each view shows the hold and at most one vertical row.
const copies = json(join(base, "snapshots.json"));
const snapshots = json(evidence("status-snapshots.json"));
assert.equal(snapshots.length, copies.length);
copies.forEach((copy, index) => {
  assert.equal(snapshots[index].event, copy.event);
  assert.deepEqual(
    snapshots[index].view,
    copy.file
      ? JSON.parse(alias(readFileSync(join(base, copy.file), "utf8")))
      : null,
  );
});
assert.deepEqual(
  snapshots.filter((row) => !row.view).map((row) => row.event),
  ["resident-restarted"],
);
assert.equal(
  snapshots.filter((row) => row.event === "IntentStepSettled").length,
  STEPS.length,
);
assert.equal(settled.length, STEPS.length);
for (const row of snapshots.filter((row) => row.view)) {
  assert(row.view.holds.some((hold) => hold.reason === holdReason));
  assert(
    row.view.actors.filter((actor) => actor.kind === "vertical-host").length <=
      1,
  );
}
assert.equal(
  snapshots
    .findLast((row) => row.event === "terminal")
    .view.actors.filter((actor) => actor.kind === "vertical-host").length,
  0,
);
// The audit's governed raw view of the vertical store equals the retained
// log, and the committed transcript lists the same events. The resident
// audit holds the ledger as it stood, followed only by later clock samples.
const governed = (text, marker = "GOVERNED RAW JSON\n") =>
  JSON.parse(text.split(marker)[1]).events;
assert.deepEqual(
  governed(readFileSync(join(base, "audit.txt"), "utf8")),
  vertical,
);
assert.deepEqual(
  governed(
    readFileSync(evidence("audit.txt"), "utf8"),
    "GOVERNED RAW JSON — sanitized event fields\n",
  ).map((event) => [event.eventId, event.type]),
  vertical.map((event) => [event.eventId, event.type]),
);
const audited = governed(
  readFileSync(join(base, "resident-audit.txt"), "utf8"),
);
assert.deepEqual(audited, resident.slice(0, audited.length));
assert(
  resident
    .slice(audited.length)
    .every((event) => event.type === "ClockSampled"),
);

// Every measure and parity score is labeled with a method, and the observed
// measures recompute from the stores (criterion 5).
const measures = json(evidence("measures.json"));
const measure = (item) => measures.find((row) => row.item === item).score;
assert(
  measures.every(
    (row) =>
      ["observed", "launch-claim", "unknown"].includes(row.label) &&
      row.method &&
      (row.label === "unknown" || row.evidence),
  ),
);
const parity = measures.filter((row) => row.item.startsWith("Parity: "));
assert.equal(parity.length, 8);
assert(
  parity.every(
    (row) => row.score === "observed-met" && row.label === "observed",
  ),
);
const launches =
  readdirSync(join(binding.store, "issue-intake")).filter((name) =>
    name.endsWith(".json"),
  ).length +
  all
    .filter((file) => file.endsWith("/events.jsonl"))
    .flatMap((file) =>
      rows(file).filter((event) => event.type === "WorkerAttemptStarted"),
    ).length +
  triages.length;
assert(launches < LAUNCH_ABORT);
assert.equal(measure("Native model episode launches"), launches);
assert.equal(receipt.modelLaunches, launches);
assert.equal(
  measure("Representative cycle time ms"),
  vertical.at(-1).occurredAt - vertical[0].occurredAt,
);
assert.equal(
  measure("Driver observation wall ms"),
  Date.parse(result.finishedAt) - Date.parse(result.startedAt),
);
assert.equal(measure("Console frames painted during the run"), frames.length);
assert.equal(
  measure("Phases painted live"),
  `${paintedLive.size} / ${STEPS.length}`,
);

// Each of the five runtime conditions carried from the WO-123 review is
// re-derived here, and none occurred: a killed resolution repair leaving a
// worktree registration, an issue configured after the resident started, an
// operator return under a kill policy, authority that could not be decoded or
// bound, and a writer other than codex-cli-exec.
const worktrees = git(["worktree", "list", "--porcelain"])
  .split("\n\n")
  .filter(Boolean);
const configured = statSync(join(binding.store, "vertical.json")).mtimeMs;
const policy = json(join(binding.store, "resident.json")).graph.presence[0]
  .phases[0].inFlightOnReturn;
const presence = new Set(
  resident
    .filter((event) => event.type === "OperatorPresenceObserved")
    .map((event) => event.payload.signal.kind),
);
const transports = new Set(
  all
    .filter((file) => file.endsWith("/events.jsonl"))
    .flatMap((file) =>
      rows(file).filter((event) => event.type === "WorkerAttemptStarted"),
    )
    .map((event) => event.payload.transport),
);
const occurred = [
  actions
    .filter((row) => row.type === "actor-kill")
    .some((row) => row.step !== "source-change") ||
    worktrees.some(
      (tree) =>
        /^prunable/mu.test(tree) ||
        tree.includes(`worktree ${realpathSync(binding.store)}`),
    ),
  configured >= time(starts[0]),
  policy === "kill" && presence.has("back"),
  !(
    Array.isArray(admissions[0].payload.grants) &&
    admissions[0].payload.grants.length
  ),
  [...transports].some((transport) => transport !== "codex-cli-exec"),
];
assert.deepEqual(occurred, [false, false, false, false, false]);
assert.deepEqual(
  receipt.carryIns.map((row) => [row.item, row.occurred]),
  occurred.map((value, index) => [index + 1, value]),
);
// The admitted intent carries its model-produced baseline assessment.
const input = admissions[0].payload.input;
const baseline =
  input?.baselineAssessment ?? input?.issues?.[0]?.baselineAssessment;
assert.equal(baseline?.producer?.kind, "model");

// The export carried the core build that the run executed.
const exported = json(evidence("export.json"));
assert.equal(exported.consolePresent, true);
assert.deepEqual(exported.runtimeHashes, exported.coreBuildHashes);
const builtNow = Object.fromEntries(
  Object.keys(exported.runtimeHashes)
    .filter((path) => existsSync(join(repository, path)))
    .map((path) => [
      path,
      createHash("sha256")
        .update(readFileSync(join(repository, path)))
        .digest("hex"),
    ]),
);

console.log(
  JSON.stringify({
    terminal: last.payload.value.status,
    phases: steps.length,
    modelLaunches: launches,
    sourceAttempts: writers.length,
    restartBetween: [bundleSettled, contractStarted].map(
      (event) =>
        steps.find(
          (step) => step.payload.command.commandId === event.payload.commandId,
        ).payload.command.step,
    ),
    threadsResolved: threads.length,
    outwardArtifactsPassed: lint.length,
    consoleFrames: {
      total: frames.length,
      changeDriven: changes.length,
      status: statusFrames.length,
      repaints: repaints.length,
    },
    paintedLive: [...paintedLive],
    longSteps,
    snapshots: snapshots.length,
    auditEvents: vertical.length,
    residentAuditEvents: audited.length,
    carriedConditionsOccurred: occurred.filter(Boolean).length,
    currentBuildMatchesExport:
      Object.keys(builtNow).length ===
      Object.keys(exported.runtimeHashes).length
        ? JSON.stringify(builtNow) === JSON.stringify(exported.runtimeHashes)
        : "build absent",
  }),
);
