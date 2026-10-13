// Independent read-only VER-002 probes. Run through the bounded wrapper.
// Modes: local, projection, remote (read-only GitHub), checker-negative.
// Retained stores are located by the ignored pointer; no raw selector is emitted.
import assert from "node:assert/strict";
import { readFileSync, readdirSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const json = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const rows = (p) => text(p).trim().split("\n").filter(Boolean).map(JSON.parse);
const files = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(d, e.name)) : [join(d, e.name)],
  );
const base = json(
  join(root, "docs/control/local/wo118-witnessed.json"),
).directory;
const binding = json(join(base, "binding.json"));
const run = json(join(base, "run-result.json"));
const resident = rows(join(binding.store, "events.jsonl"));
const verticalRoot = join(binding.store, "vertical", run.key);
const vertical = rows(join(verticalRoot, "events.jsonl"));
const source = rows(join(verticalRoot, "source/events.jsonl"));
const receipt = json(
  join(root, "docs/evidence/WO-118/witnessed-run/receipt.json"),
);
const moduleAt = (p) => import(pathToFileURL(join(root, p)).href);
const { replayResident } = await moduleAt(
  "packages/skeleton/dist/src/resident-store.js",
);
const { projectRuntimeStatus } = await moduleAt(
  "packages/skeleton/dist/src/runtime-status.js",
);
const { verticalProgram } = await moduleAt(
  "packages/skeleton/dist/src/vertical.js",
);
const record = (_name, value) => console.log(JSON.stringify(value));
const phases = vertical.filter((e) => e.type === "VerticalStepCompleted");
const starts = resident.filter((e) => e.type === "IntentStepStarted");
const settlements = resident.filter((e) => e.type === "IntentStepSettled");
const stepName = (e) =>
  phases.find((p) => p.payload.command.commandId === e.payload.commandId)
    ?.payload.command.step;

if (process.argv[2] === "local") {
  const state = replayResident(text(join(binding.store, "events.jsonl"))).state
    .resident;
  const final = projectRuntimeStatus(
    state,
    resident,
    text(join(binding.root, "docs/work-orders/README.md")),
  );
  assert.equal(
    final.actors.filter((a) => a.kind === "vertical-host").length,
    0,
  );
  assert(final.holds.some((h) => h.reason === "intent-needs-human:contract"));
  assert(final.holds.some((h) => h.reason === "actor-unavailable"));
  const stageResults = [];
  for (const start of starts) {
    const prefix = resident.slice(0, resident.indexOf(start) + 1);
    const restored = replayResident(
      prefix.map((e) => JSON.stringify(e)).join("\n") + "\n",
    ).state.resident;
    const view = projectRuntimeStatus(restored, prefix, null);
    assert.equal(
      view.liveEpisodes.filter((e) => e.actor === "vertical-host").length,
      1,
    );
    assert.equal(
      view.liveEpisodes.find((e) => e.actor === "vertical-host").phase,
      stepName(start),
    );
    assert.equal(view.liveEpisodes[0].launchClaims.source, "none");
    assert(view.holds.some((h) => h.reason === "intent-needs-human:contract"));
    const end = settlements.find(
      (e) => e.payload.commandId === start.payload.commandId,
    );
    const ended = resident.slice(0, resident.indexOf(end) + 1);
    const endedState = replayResident(
      ended.map((e) => JSON.stringify(e)).join("\n") + "\n",
    ).state.resident;
    const settledView = projectRuntimeStatus(endedState, ended, null);
    assert.equal(settledView.liveEpisodes.length, 0);
    assert.equal(
      settledView.actors.filter((e) => e.kind === "vertical-host").length,
      end.payload.terminal ? 0 : 1,
    );
    stageResults.push({
      phase: stepName(start),
      durationMs: end.occurredAt - start.occurredAt,
      liveAtStart: true,
      retiredAtTerminal: end.payload.terminal,
    });
  }
  assert.equal(stageResults.length, 14);
  const committed = text(
    join(root, "docs/evidence/WO-118/witnessed-run/console.txt"),
  );
  assert.equal(
    committed,
    text(join(base, "console-live.txt")).replaceAll(run.key, "<run-key>"),
  );
  const frameParts = committed
    .split(/(?=^Changed: |^Runtime status \(runtime-status-v1\))/mu)
    .filter((s) => s.trim());
  const frames = frameParts.map((body, i) => ({
    body,
    change:
      body.startsWith("Changed:") &&
      !(frameParts[i - 1] ?? "").startsWith("Runtime status ("),
  }));
  const livePhases = [
    ...new Set(
      frames
        .filter((f) => f.change)
        .flatMap((f) =>
          [...f.body.matchAll(/(\S+): vertical-host \(available\)/gu)].map(
            (m) => m[1],
          ),
        ),
    ),
  ];
  for (const step of stageResults.filter((s) => s.durationMs >= 2000))
    assert(livePhases.includes(step.phase));
  const holdWithLive = frames.filter(
    (f) => f.change && /vertical-host \(available\)/u.test(f.body),
  );
  assert(
    holdWithLive.length > 0 &&
      holdWithLive.every((f) => f.body.includes("intent-needs-human:contract")),
  );
  assert(frames.some((f) => f.change && f.body.includes("WO-902: active")));
  assert(!/vertical-host/u.test(frames.at(-1).body));
  const allLogs = files(binding.store).filter((p) =>
    p.endsWith("/events.jsonl"),
  );
  const allEvents = allLogs.flatMap(rows);
  const human = allEvents.filter(
    (e) =>
      e.actorId === "operator" ||
      e.actorId === "console" ||
      e.payload?.origin === "human",
  );
  assert.equal(human.length, 1);
  assert.equal(human[0].type, "OperatorPresenceObserved");
  assert.equal(human[0].payload.signal.kind, "away");
  assert(resident.every((e) => e.actorId === "resident-host"));
  assert(vertical.every((e) => e.actorId === "vertical-host"));
  const sourceAttempts = source.filter(
    (e) => e.type === "WorkerAttemptStarted",
  );
  assert.equal(sourceAttempts.length, 2);
  assert.equal(new Set(sourceAttempts.map((e) => e.episodeId)).size, 1);
  assert.equal(new Set(sourceAttempts.map((e) => e.payload.commandId)).size, 1);
  const stopIndex = source.findIndex(
    (e) => e.type === "SourceChangeProcessStopped",
  );
  assert(stopIndex >= 0 && stopIndex < source.indexOf(sourceAttempts[1]));
  assert.equal(
    source.filter((e) => e.type === "SourceChangeObserved").length,
    1,
  );
  const rawAudit = (name) =>
    JSON.parse(text(join(base, name)).split("GOVERNED RAW JSON\n")[1]).events;
  assert.equal(JSON.stringify(rawAudit("audit.txt")), JSON.stringify(vertical));
  const residentAudit = rawAudit("resident-audit.txt");
  assert.equal(
    JSON.stringify(residentAudit),
    JSON.stringify(resident.slice(0, residentAudit.length)),
  );
  const copied = json(join(base, "snapshots.json"));
  let snapshotCount = 0;
  for (const copy of copied.filter((c) => c.file)) {
    const snapshot = json(join(base, copy.file));
    const possible = resident
      .map((e, i) =>
        e.type === "ClockSampled" && e.payload.at === snapshot.observedAt
          ? i
          : -1,
      )
      .filter((i) => i >= 0);
    let matched = false;
    for (const i of possible) {
      // One clock sample can publish several views; test each subsequent event up to the next clock.
      for (
        let j = i;
        j < resident.length && (j === i || resident[j].type !== "ClockSampled");
        j++
      ) {
        const prefix = resident.slice(0, j + 1);
        const s = replayResident(
          prefix.map((e) => JSON.stringify(e)).join("\n") + "\n",
        ).state.resident;
        const projected = projectRuntimeStatus(s, prefix, null);
        matched ||=
          JSON.stringify([
            projected.actors,
            projected.liveEpisodes,
            projected.holds,
          ]) ===
          JSON.stringify([
            snapshot.actors,
            snapshot.liveEpisodes,
            snapshot.holds,
          ]);
      }
    }
    assert(matched, "snapshot must match one actual resident prefix");
    snapshotCount++;
  }
  const exported = json(
    join(root, "docs/evidence/WO-118/witnessed-run/export.json"),
  );
  for (const [p, digest] of Object.entries(exported.runtimeHashes)) {
    for (const home of [root, binding.root])
      assert.equal(
        createHash("sha256")
          .update(readFileSync(join(home, p)))
          .digest("hex"),
        digest,
      );
  }
  const runtimePaths = files(join(binding.root, "packages"))
    .filter((p) => p.includes("/dist/") && p.endsWith(".js"))
    .map((p) => p.slice(binding.root.length + 1));
  for (const p of runtimePaths)
    assert.equal(
      createHash("sha256")
        .update(readFileSync(join(root, p)))
        .digest("hex"),
      createHash("sha256")
        .update(readFileSync(join(binding.root, p)))
        .digest("hex"),
    );
  record("local-probe", {
    checkedAt: new Date().toISOString(),
    phases: stageResults,
    livePhases,
    changeDrivenFrames: frames.filter((f) => f.change).length,
    liveFramesWithHold: holdWithLive.length,
    snapshotsReplayed: snapshotCount,
    logs: allLogs.length,
    events: allEvents.length,
    humanPresenceEvents: human.length,
    sourceAttempts: sourceAttempts.length,
    verticalAuditEvents: vertical.length,
    residentAuditEvents: residentAudit.length,
    allExportedJsFilesEqualCurrentBuild: runtimePaths.length,
  });
}

if (process.argv[2] === "projection") {
  const commands = (key) => {
    const queue = [verticalProgram(key)],
      seen = new Set(),
      out = [];
    while (queue.length) {
      const p = queue.shift();
      if (seen.has(p)) continue;
      seen.add(p);
      if (p.kind !== "Invoke") continue;
      out.push(p.command.payload);
      queue.push(...Object.values(p.continuationByResult));
    }
    return out;
  };
  const empty = projectRuntimeStatus(undefined, [], null);
  assert.equal(empty.actors.length, 0);
  assert.equal(empty.holds.length, 0);
  const key = "intent_independent",
    cmds = commands(key),
    a = cmds.find((c) => c.step === "bundle"),
    b = cmds.find((c) => c.step === "source-change");
  const start = (c) => ({
    type: "IntentStepStarted",
    occurredAt: 1,
    payload: { key, commandId: c.commandId },
  });
  const end = (c, result, terminal = true) => ({
    type: "IntentStepSettled",
    occurredAt: 2,
    payload: { key, commandId: c.commandId, result, terminal },
  });
  const state = {
    at: 5,
    intents: { "WO-900": { kind: "admitted", binding: { key } } },
    intentStep: null,
  };
  const checks = [];
  for (const result of [
    "completed",
    "refused",
    "NeedsHuman",
    "retry",
    "repair",
  ]) {
    const view = projectRuntimeStatus(state, [start(a), end(a, result)], null);
    assert.equal(view.actors.length, 0);
    assert.equal(view.liveEpisodes.length, 0);
    assert.equal(view.holds.length, result === "completed" ? 0 : 1);
    const duplicate = projectRuntimeStatus(
      state,
      [start(a), end(a, result), end(a, result)],
      null,
    );
    assert.equal(duplicate.holds.length, view.holds.length);
    checks.push(result);
  }
  const later = projectRuntimeStatus(
    { ...state, intentStep: { key, commandId: b.commandId } },
    [start(a), end(a, "completed"), start(b)],
    null,
  );
  assert.equal(later.liveEpisodes.length, 1);
  assert.equal(later.actors[0].phase, "source-change");
  const paused = projectRuntimeStatus(
    state,
    [start(a), end(a, "completed", false)],
    null,
  );
  assert.equal(paused.actors[0].availability, "unknown");
  assert.equal(paused.liveEpisodes.length, 0);
  const foreign = projectRuntimeStatus(
    state,
    [{ ...start(a), payload: { key, commandId: "unknown-private-command" } }],
    null,
  );
  assert.equal(foreign.actors.length, 0);
  const badOrder = projectRuntimeStatus(
    {
      at: 1,
      intents: {
        "private order": {
          kind: "NeedsHuman",
          step: "/private/diagnostic",
          reason: "secret diagnostic",
        },
      },
    },
    [],
    null,
  );
  assert.equal(badOrder.holds[0].order, null);
  assert.equal(badOrder.holds[0].reason, "intent-needs-human");
  assert(!JSON.stringify(badOrder).includes("private"));
  const intents = {},
    events = [];
  for (let i = 0; i < 500; i++) {
    const k = `intent_retired_${i}`,
      c = commands(k).find((c) => c.step === "resolution");
    intents[`synthetic-${i}`] = { kind: "admitted", binding: { key: k } };
    events.push(
      {
        type: "IntentStepStarted",
        occurredAt: i,
        payload: { key: k, commandId: c.commandId },
      },
      {
        type: "IntentStepSettled",
        occurredAt: i,
        payload: {
          key: k,
          commandId: c.commandId,
          terminal: true,
          result: "completed",
        },
      },
    );
  }
  const grown = projectRuntimeStatus(
    { at: 1000, intents, intentStep: null },
    events,
    null,
  );
  assert.equal(grown.actors.length, 0);
  assert.equal(grown.holds.length, 0);
  assert.equal(grown.liveEpisodes.length, 0);
  record("projection-probe", {
    checkedAt: new Date().toISOString(),
    empty: true,
    terminalOutcomes: checks,
    duplicateSettlementsNoDuplicateHold: true,
    staleTerminalDoesNotRetireDifferentLiveCommand: true,
    nonterminalPauseRetained: true,
    unknownCommandOmitted: true,
    privateHoldFieldsOmitted: true,
    finishedContinuations: 500,
    finishedActorRows: grown.actors.length,
  });
}

if (process.argv[2] === "remote") {
  const target = realpathSync(binding.target);
  assert.equal(
    execFileSync("git", ["rev-parse", "--show-toplevel"], {
      cwd: target,
      encoding: "utf8",
    }).trim(),
    target,
  );
  const gh = (args) => {
    const r = spawnSync("gh", args, {
      cwd: target,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
    if (r.status !== 0)
      throw Error(`read-only gh request failed, exit ${r.status}`);
    return JSON.parse(r.stdout);
  };
  const prior = json(join(base, "pr-observed.json"));
  const number = json(join(base, "delivered.json")).number;
  const pr = gh([
    "pr",
    "view",
    String(number),
    "--repo",
    binding.repo,
    "--json",
    "state,title,body,headRefName,headRefOid,commits,reviews,author",
  ]);
  const [owner, name] = binding.repo.split("/");
  const query =
    "query($owner:String!,$name:String!,$number:Int!){repository(owner:$owner,name:$name){pullRequest(number:$number){reviewThreads(first:100){nodes{isResolved comments(first:100){nodes{body author{login}}}}}}}}";
  const data = gh([
    "api",
    "graphql",
    "-f",
    `query=${query}`,
    "-f",
    `owner=${owner}`,
    "-f",
    `name=${name}`,
    "-F",
    `number=${number}`,
  ]);
  const threads = data.data.repository.pullRequest.reviewThreads.nodes;
  assert.equal(pr.headRefOid, prior.headRefOid);
  assert.equal(pr.title, prior.title);
  assert.equal(pr.body, prior.body);
  assert.equal(pr.commits.length, 2);
  assert.equal(threads.length, 2);
  assert(threads.every((t) => t.isResolved));
  const { checkOutwardArtifact } = await import(
    pathToFileURL(join(binding.root, "scripts/outward-lint.mjs")).href
  );
  const comments = threads.flatMap((t) => t.comments.nodes);
  const artifacts = [
    ["branch", pr.headRefName],
    ["pr-title", pr.title],
    ["pr-body", pr.body],
    ...pr.commits.map((c) => [
      "commit",
      c.messageHeadline + "\n" + c.messageBody,
    ]),
    ...comments.map((c) => ["pr-body", c.body]),
    ...pr.reviews.filter((r) => r.body).map((r) => ["pr-body", r.body]),
  ];
  const lint = artifacts.map(
    ([kind, text]) => checkOutwardArtifact(binding.root, { kind, text }).status,
  );
  assert(lint.every((s) => s === "pass"));
  const reply = comments.find((c) =>
    c.body.includes('"disposition":"rejected"'),
  );
  assert(reply && reply.body.includes("evidenceRefs"));
  const git = (args) =>
    execFileSync("git", args, { cwd: target, encoding: "utf8" }).trim();
  const paths = git(["ls-tree", "-r", "--name-only", pr.headRefOid]).split(
    "\n",
  );
  const outward = json(
    join(root, "docs/evidence/WO-118/witnessed-run/outward.json"),
  );
  const terms = new RegExp(`\\b(?:${outward.publicTerms.join("|")})\\b`, "iu");
  for (const p of paths) {
    const s = p + "\n" + git(["show", `${pr.headRefOid}:${p}`]);
    assert(!terms.test(s));
    assert(!outward.pathPrefixes.some((prefix) => s.includes(prefix)));
  }
  assert.equal(git(["rev-list", "--count", `main..${pr.headRefOid}`]), "2");
  assert.equal(
    git(["rev-list", "--count", `main..fix/intent-${run.key}`]),
    "1",
  );
  assert.match(
    git(["show", `${pr.headRefOid}:index.html`]),
    /<p id="status" role="status" aria-label="Build status">Ready<\/p>/u,
  );
  const exposedForms = [
    "verification:vertical",
    "source-event:evt",
    "baseline-event:evt",
    "review-event:evt",
    "delivery-preparation",
    "contract:",
  ].filter((term) =>
    [pr.body, reply.body].some((body) =>
      body.replaceAll("&#95;", "_").includes(term),
    ),
  );
  record("remote-probe", {
    checkedAt: new Date().toISOString(),
    state: pr.state,
    headAndGeneratedTextMatchRecordedRun: true,
    commits: pr.commits.length,
    threads: threads.length,
    resolvedThreads: threads.filter((t) => t.isResolved).length,
    outwardArtifactsPassed: lint.length,
    trackedFiles: paths.length,
    sourceCommits: 1,
    repairCommits: 1,
    runtimeRejectionHasEvidence: true,
    existingFollowupIdentifierForms: exposedForms,
  });
}

if (process.argv[2] === "checker-negative") {
  const subject = join(root, "packages/skeleton/dist/src/runtime-status.js");
  const before = createHash("sha256")
    .update(readFileSync(subject))
    .digest("hex");
  const program = `import fs from 'node:fs'; import {syncBuiltinESMExports} from 'node:module'; import {join} from 'node:path'; import {pathToFileURL} from 'node:url'; const root=process.cwd(); const base=JSON.parse(fs.readFileSync('docs/control/local/wo118-witnessed.json')).directory; const original=fs.readFileSync; const target=join(root,'packages/skeleton/dist/src/runtime-status.js'); fs.readFileSync=(p,...args)=>{const value=original(p,...args); return p===target ? Buffer.isBuffer(value)?Buffer.concat([value,Buffer.from('\\n// synthetic drift\\n')]):value+'\\n// synthetic drift\\n' : value;}; syncBuiltinESMExports(); process.argv[2]=base; await import(pathToFileURL(join(root,'docs/evidence/WO-118/check-witnessed-run.mjs')).href);`;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", program],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0);
  const out = JSON.parse(result.stdout.trim());
  assert.equal(out.currentBuildMatchesExport, false);
  assert.equal(
    createHash("sha256").update(readFileSync(subject)).digest("hex"),
    before,
  );
  record("checker-negative-probe", {
    checkedAt: new Date().toISOString(),
    variation:
      "process-local read interception supplies synthetic extra bytes for the current runtime-status build; no file modified",
    checkerExitCode: result.status,
    currentBuildMatchesExport: out.currentBuildMatchesExport,
    subjectFileUnchanged: true,
  });
}
