import test from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { setTimeout as delay } from "node:timers/promises";
import { compileVerificationTask } from "../../compiler/dist/src/index.js";
import { parseEvidenceResult } from "../../skeleton/dist/src/verification-protocol.js";
import { replayVerification } from "../../skeleton/dist/src/verification.js";
import { resultId } from "../../skeleton/dist/src/worker-protocol.js";
import { evidenceSourceContent } from "../../skeleton/src/evidence-editions.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
process.env.PLAYWRIGHT_BROWSERS_PATH ??= join(root, ".runtime/playwright");
const { runScenario } = await import("../dist/src/index.js");
const { chromium } = await import("playwright");
const { processTable, sameProcess, observeOwned, recover } =
  await import("../dist/src/processes.js");
const fixture = join(root, "packages/browser-evidence/fixtures/scenario.json");
const scenario = JSON.parse(readFileSync(fixture, "utf8"));
const parent = process.env.DOTLN_BROWSER_EVIDENCE_DIR ?? tmpdir();
mkdirSync(parent, { recursive: true });
const output = mkdtempSync(join(parent, "wo059-browser-"));
const transcript = {
  schemaVersion: 1,
  scope: "WO-059 synthetic browser fixtures",
  rows: [],
};
const record = (row) => {
  transcript.rows.push(row);
  writeFileSync(
    join(output, "fixture-transcript.json"),
    `${JSON.stringify(transcript, null, 2)}\n`,
  );
};
const sha = (bytes) =>
  `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
function readProgressAction(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8")).action;
  } catch (error) {
    if (error instanceof SyntaxError || error.code === "ENOENT")
      return undefined;
    throw error;
  }
}
const independentEnv = (env) =>
  Object.fromEntries(
    Object.entries(env).filter(
      ([name]) => !["NODE_TEST_CONTEXT", "NODE_TEST_WORKER_ID"].includes(name),
    ),
  );
const withoutBrowserPath = (env) =>
  Object.fromEntries(
    Object.entries(env).filter(
      ([name]) =>
        ![
          "PLAYWRIGHT_BROWSERS_PATH",
          "npm_config_playwright_browsers_path",
          "npm_package_config_playwright_browsers_path",
        ].includes(name),
    ),
  );
const installFrom = (reason) => {
  assert.match(reason, /^Pinned Chromium launch unavailable; run /u);
  return reason.slice("Pinned Chromium launch unavailable; run ".length);
};
function installLocations(command, cwd, env) {
  const probe = spawnSync("/bin/zsh", ["-c", `${command} --dry-run`], {
    cwd,
    env,
    encoding: "utf8",
    timeout: 30000,
  });
  assert.equal(probe.status, 0, `${probe.stdout}${probe.stderr}`);
  const locations = [...probe.stdout.matchAll(/Install location: (.+)/gu)].map(
    ([, location]) => location.trim(),
  );
  assert.ok(locations.length > 0, probe.stdout);
  return locations;
}

test("browser component release labels normalize while the pinned browser tree remains evidence input", () => {
  const manifest = JSON.parse(
    readFileSync(join(root, "packages/browser-evidence/package.json"), "utf8"),
  );
  const projected = evidenceSourceContent(
    "packages/browser-evidence/package.json",
    JSON.stringify(manifest),
  );
  assert.equal(
    projected,
    evidenceSourceContent(
      "packages/browser-evidence/package.json",
      JSON.stringify({ ...manifest, version: "0.2.0" }),
    ),
  );
  assert.notEqual(
    projected,
    evidenceSourceContent(
      "packages/browser-evidence/package.json",
      JSON.stringify({ ...manifest, dependencies: { playwright: "1.62.0" } }),
    ),
  );
  const lock = JSON.parse(
    readFileSync(join(root, "package-lock.json"), "utf8"),
  );
  const original = evidenceSourceContent(
    "package-lock.json",
    JSON.stringify(lock),
  );
  lock.packages["packages/browser-evidence"].version = "0.2.0";
  assert.equal(
    original,
    evidenceSourceContent("package-lock.json", JSON.stringify(lock)),
  );
  lock.packages["node_modules/playwright"].version = "1.62.0";
  assert.notEqual(
    original,
    evidenceSourceContent("package-lock.json", JSON.stringify(lock)),
  );
});
const criteriaFor = (input) =>
  input.criteria.map((entry) => ({
    criterionId: entry.criterionId,
    description: `Fixture ${entry.criterionId}`,
    claimType: entry.claimType,
    evidenceSource: "synthetic-fixture",
    codeSurfaces: entry.codeSurfaces,
    requiredChecks: [entry.checkId],
  }));
let baselineEvidence;
function requestFor(input, evidence) {
  const criteria = criteriaFor(input);
  const subject = {
    repo: "synthetic-browser-fixture",
    baseCommit: "synthetic-base",
    revision: "synthetic-candidate",
    diff: "",
    files: [...new Set(criteria.flatMap((entry) => entry.codeSurfaces))].map(
      (path) => ({ path, contents: readFileSync(join(root, path), "utf8") }),
    ),
    evidence,
  };
  const capsule = compileVerificationTask("WO-059-fixture", criteria, subject);
  const event = (type, payload, eventId) => ({
    schemaVersion: 1,
    eventId,
    type,
    actorId: "verification-host",
    workstreamId: "browser-fixture",
    occurredAt: 10,
    payload,
  });
  const events = [
    event(
      "VerificationOpened",
      {
        criteria,
        subject,
        baseline: {
          ...subject,
          revision: "synthetic-base",
          evidence: baselineEvidence.filter((entry) =>
            criteria.some(
              (criterion) => criterion.criterionId === entry.criterionId,
            ),
          ),
        },
        implementerEpisodeId: "implementer",
        maxRepairs: 0,
        authority: {
          authorityEnvelopeId: "synthetic-authority",
          allowedEffects: ["verification.evaluate"],
          deniedEffects: ["repo.write"],
          resourceLimits: { episodes: 1 },
          requiredEvidence: ["pinned-subject", "baseline-witness"],
          expiresAt: 1000,
          revocationEventTypes: ["VerificationRevoked"],
        },
      },
      "opened",
    ),
    event("VerificationDispatchRequested", {}, "dispatch"),
  ];
  const state = replayVerification(events, "browser-fixture");
  assert.ok(
    state.pending,
    "VerificationOpened subject dispatches through the existing reactor",
  );
  assert.deepEqual(
    state.pending.capsule.subject.evidence,
    capsule.subject.evidence,
  );
  return {
    kind: "evidence-worker",
    command: state.pending.command,
    workOrder: state.pending.capsule.workOrder,
    capsule: state.pending.capsule,
    episodeId: "verifier",
    model: "synthetic",
    effort: "unknown",
    cwd: "/synthetic-mount",
    profile: {
      profileId: "verification-snapshot-v1",
      mounts: [{ path: "/synthetic-mount", access: "read" }],
    },
  };
}
const resultFor = (request, verdict = "pass") => ({
  kind: "verification",
  envelope: {
    workOrderId: request.workOrder.workOrderId,
    episodeId: "verifier",
    resultId: resultId(request.command),
    status: "completed",
    summary: "Synthetic browser witness evaluation",
    requiresHuman: false,
  },
  subjectRevision: request.capsule.subject.revision,
  evaluations: request.capsule.criteria.map((entry) => ({
    criterionId: entry.criterionId,
    claimType: entry.claimType,
    verdict,
    evidenceRefs: request.capsule.subject.evidence
      .filter(
        (e) =>
          e.criterionId === entry.criterionId &&
          (verdict !== "pass" || e.outcome === "pass"),
      )
      .map((e) => e.evidenceId),
    exemplarRefs: [],
    dissentRefs: [],
  })),
  findings: [],
});
let baseline;
test("installed pinned browser produces all five kinds admitted from a VerificationOpened subject", async () => {
  const reference = await runScenario(scenario, {
    directory: join(output, "reference"),
    subjectRevision: "synthetic-base",
  });
  assert.equal(reference.availability, "available", reference.reason);
  baselineEvidence = reference.evidence;
  baseline = await runScenario(scenario, {
    directory: join(output, "baseline"),
    subjectRevision: "synthetic-candidate",
  });
  assert.equal(baseline.availability, "available", baseline.reason);
  for (const criterion of scenario.criteria) {
    const witnesses = baseline.evidence.filter(
      (entry) => entry.criterionId === criterion.criterionId,
    );
    assert.deepEqual(
      [...new Set(witnesses.map((entry) => entry.witness.kind))].sort(),
      [
        "accessibility-snapshot",
        "console-capture",
        "dom-snapshot",
        "network-trace",
        "screenshot",
      ],
    );
    assert.ok(
      witnesses.every(
        (entry) =>
          entry.checkId === criterion.checkId && entry.outcome === "pass",
      ),
    );
    assert.equal(
      witnesses.find((entry) => entry.witness.kind === "screenshot").witness
        .criterionId,
      criterion.criterionId,
    );
  }
  const request = requestFor(scenario, baseline.evidence);
  const result = resultFor(request);
  assert.deepEqual(parseEvidenceResult(result, request), result);
  assert.deepEqual(baseline.remainingPids, []);
  const processes = JSON.parse(
    readFileSync(join(baseline.directory, "processes.json"), "utf8"),
  );
  assert.equal(processes.closed, true);
  assert.ok(processes.processes.length > 0);
  assert.equal(
    processTable().filter((entry) =>
      processes.processes.some((old) => sameProcess(entry, old)),
    ).length,
    0,
  );
  assert.ok(readFileSync(join(baseline.directory, "trace.zip")).length > 0);
  const entries = baseline.evidence.filter(
    (entry) => entry.criterionId === "visual",
  );
  for (const [kind, file] of [
    ["screenshot", "screenshot.png"],
    ["dom-snapshot", "dom.html"],
    ["accessibility-snapshot", "accessibility.yml"],
  ])
    assert.equal(
      entries.find((entry) => entry.witness.kind === kind).witness.contentHash,
      sha(readFileSync(join(baseline.directory, file))),
    );
  const network = JSON.parse(
    readFileSync(join(baseline.directory, "network.json"), "utf8"),
  );
  assert.deepEqual(
    network.map((entry) => [
      entry.request.method,
      entry.request.url,
      entry.response.status,
    ]),
    [
      ["GET", "http://fixture.local/", 200],
      ["POST", "http://fixture.local/api/greeting", 200],
    ],
  );
  assert.equal(network[1].request.bodyHash, sha('{"name":"DotLn"}'));
  assert.equal(
    network[1].response.bodyHash,
    sha('{"message":"Hello, DotLn!"}'),
  );
  record({
    id: "five-witnesses-and-admission",
    label: "pass",
    evidence: baseline.evidence,
    browserProcessesClosed: processes.processes.map((entry) => entry.pid),
    traceRetained: true,
  });
});

test("saved scenario replays exact declared DOM, network, accessibility, console and screenshot fields", async () => {
  assert.ok(baseline);
  const replay = await runScenario(join(baseline.directory, "scenario.json"), {
    directory: join(output, "replay"),
    subjectRevision: "synthetic-candidate",
  });
  assert.equal(replay.availability, "available", replay.reason);
  for (const file of [
    "dom.html",
    "network.json",
    "accessibility.yml",
    "console.json",
    "screenshot.png",
  ])
    assert.deepEqual(
      readFileSync(join(replay.directory, file)),
      readFileSync(join(baseline.directory, file)),
      file,
    );
  const fields = JSON.parse(
    readFileSync(join(replay.directory, "replay-fields.json"), "utf8"),
  );
  assert.ok(Object.keys(fields.omitted).length >= 6);
  record({
    id: "saved-replay",
    label: "pass",
    stableFields: fields.stable,
    omittedFields: fields.omitted,
    hashes: Object.fromEntries(
      [
        "dom.html",
        "network.json",
        "accessibility.yml",
        "console.json",
        "screenshot.png",
      ].map((file) => [file, sha(readFileSync(join(replay.directory, file)))]),
    ),
  });
});

test("console error capture binds every scenario criterion and refuses each pass even when omitted", async () => {
  const input = {
    ...scenario,
    scenarioId: "console-error",
    steps: [
      { action: "navigate", path: "/console-error.html" },
      { action: "assertText", selector: "#result", value: "Error captured" },
    ],
  };
  const run = await runScenario(input, {
    directory: join(output, "console-error"),
    subjectRevision: "synthetic-candidate",
  });
  assert.equal(run.availability, "available", run.reason);
  const adverse = run.evidence.filter(
    (entry) => entry.witness.kind === "console-capture",
  );
  assert.equal(adverse.length, input.criteria.length);
  assert.ok(
    adverse.every(
      (entry) =>
        entry.outcome === "fail" &&
        entry.witness.entries.some(
          (message) =>
            message.level === "error" &&
            message.message === "Deliberate fixture error",
        ),
    ),
  );
  for (const criterion of input.criteria) {
    const request = requestFor(
      { ...input, criteria: [criterion] },
      run.evidence.filter(
        (entry) => entry.criterionId === criterion.criterionId,
      ),
    );
    assert.throws(
      () => parseEvidenceResult(resultFor(request), request),
      /console error witness/u,
    );
  }
  record({
    id: "console-error",
    label: "pass",
    adverseWitnesses: adverse,
    refusedCriterionIds: input.criteria.map((entry) => entry.criterionId),
  });
});

test("a failed assertion produces adverse evidence rather than a pass", async () => {
  const input = {
    ...scenario,
    scenarioId: "bad-assertion",
    steps: [
      { action: "navigate", path: "/" },
      { action: "assertText", selector: "#result", value: "Unexpected" },
    ],
  };
  const run = await runScenario(input, {
    directory: join(output, "bad-assertion"),
    subjectRevision: "synthetic-candidate",
  });
  assert.equal(run.availability, "available", run.reason);
  assert.ok(run.evidence.every((entry) => entry.outcome === "fail"));
  assert.throws(
    () =>
      parseEvidenceResult(
        resultFor(requestFor(input, run.evidence)),
        requestFor(input, run.evidence),
      ),
    /unsupported pass/u,
  );
  record({
    id: "failed-assertion",
    label: "pass",
    outcomes: [...new Set(run.evidence.map((entry) => entry.outcome))],
  });
});

test("failed console.assert is adverse for every covered criterion", async () => {
  const input = {
    ...scenario,
    scenarioId: "console-assert",
    steps: [
      { action: "navigate", path: "/console-assert.html" },
      {
        action: "assertText",
        selector: "#result",
        value: "Assertion captured",
      },
    ],
  };
  const run = await runScenario(input, {
    directory: join(output, "console-assert"),
    subjectRevision: "synthetic-candidate",
  });
  assert.equal(run.availability, "available", run.reason);
  const adverse = run.evidence.filter(
    (entry) => entry.witness.kind === "console-capture",
  );
  assert.equal(adverse.length, input.criteria.length);
  for (const entry of adverse) {
    assert.equal(entry.outcome, "fail");
    assert.equal(entry.witness.entries.length, 1);
    assert.equal(entry.witness.entries[0].level, "error");
    assert.match(
      entry.witness.entries[0].message,
      /Deliberate fixture assertion/u,
    );
    const request = requestFor(
      {
        ...input,
        criteria: input.criteria.filter(
          (criterion) => criterion.criterionId === entry.criterionId,
        ),
      },
      run.evidence.filter(
        (evidence) => evidence.criterionId === entry.criterionId,
      ),
    );
    assert.throws(
      () => parseEvidenceResult(resultFor(request), request),
      /console error witness/u,
    );
  }
  record({
    id: "console-assert",
    label: "pass",
    adverseWitnesses: adverse,
    refusedCriterionIds: input.criteria.map((entry) => entry.criterionId),
  });
});

test("console witness retains captured bytes when a late message arrives during trace stop", async (t) => {
  const connect = chromium.connect.bind(chromium);
  let lateMessageObserved = false;
  t.mock.method(chromium, "connect", async (...args) => {
    const browser = await connect(...args);
    const newContext = browser.newContext.bind(browser);
    t.mock.method(browser, "newContext", async (...contextArgs) => {
      const context = await newContext(...contextArgs);
      const stop = context.tracing.stop.bind(context.tracing);
      t.mock.method(context.tracing, "stop", async (options) => {
        const [page] = context.pages();
        const message = page.waitForEvent("console", {
          predicate: (entry) => entry.text() === "Late fixture message",
        });
        await page.evaluate(() => console.error("Late fixture message"));
        await message;
        lateMessageObserved = true;
        return stop(options);
      });
      return context;
    });
    return browser;
  });
  const run = await runScenario(scenario, {
    directory: join(output, "late-console"),
    subjectRevision: "synthetic-candidate",
  });
  assert.equal(run.availability, "available", run.reason);
  assert.equal(lateMessageObserved, true);
  const captured = JSON.parse(
    readFileSync(join(run.directory, "console.json"), "utf8"),
  );
  assert.ok(captured.some((entry) => entry.message === "Greeting rendered"));
  assert.ok(
    captured.every((entry) => entry.message !== "Late fixture message"),
  );
  for (const entry of run.evidence.filter(
    (entry) => entry.witness.kind === "console-capture",
  )) {
    assert.deepEqual(entry.witness.entries, captured);
    assert.equal(entry.witness.contentHash, sha(JSON.stringify(captured)));
    assert.equal(entry.outcome, "pass");
  }
  record({
    id: "console-capture-boundary",
    label: "pass",
    lateMessageObserved,
    capturedEntries: captured,
    returnedHashMatchesSavedEntries: true,
  });
});

test("non-missing browser launch failures remain unavailable without install advice", async (t) => {
  const failures = ["Fixture launch timeout", "Fixture sandbox denial"];
  let failure = failures[0];
  t.mock.method(chromium, "launchServer", async () => {
    throw new Error(failure);
  });
  for (const [index, message] of failures.entries()) {
    failure = message;
    const run = await runScenario(scenario, {
      directory: join(output, `launch-failure-${index}`),
      subjectRevision: "synthetic-candidate",
    });
    assert.equal(run.availability, "unavailable");
    assert.equal(
      run.reason,
      "Pinned Chromium launch failed; browser launch unavailable",
    );
    assert.doesNotMatch(run.reason, /install|Fixture/u);
    assert.ok(
      run.evidence.every(
        (entry) => entry.outcome === "unavailable" && !entry.witness,
      ),
    );
  }
  record({
    id: "non-missing-launch-failures",
    label: "pass",
    injectedFailureClasses: ["timeout", "sandbox-denial"],
    availability: "unavailable",
    installAdvice: false,
    rawDiagnosticExposed: false,
  });
});

test("fixture runs without every connected-server environment variable WO-057 removed", () => {
  const env = { ...process.env };
  for (const name of [
    "CODEX_CI",
    "CODEX_SESSION_ID",
    "CODEX_THREAD_ID",
    "CODEX_VERSION",
  ])
    delete env[name];
  const directory = join(output, "no-server");
  const child = spawnSync(
    process.execPath,
    [
      join(root, "packages/browser-evidence/fixtures/driver.mjs"),
      "run",
      fixture,
      directory,
    ],
    { env, encoding: "utf8", timeout: 30000 },
  );
  assert.equal(child.status, 0, child.stderr);
  assert.equal(JSON.parse(child.stdout).availability, "available");
  const observation = JSON.parse(
    readFileSync(join(directory, "environment.json"), "utf8"),
  );
  assert.deepEqual(observation.present, []);
  record({ id: "no-connected-server", label: "pass", ...observation });
});

test("recovery readiness retries incomplete progress without swallowing other I/O errors", () => {
  const file = join(output, "readiness-progress.json");
  assert.equal(readProgressAction(file), undefined);
  for (const partial of ["", '{"action":', '{"action":"wait"']) {
    writeFileSync(file, partial);
    for (let poll = 0; poll < 3; poll += 1)
      assert.equal(readProgressAction(file), undefined);
  }
  writeFileSync(file, JSON.stringify({ action: "navigate" }));
  assert.equal(readProgressAction(file), "navigate");
  writeFileSync(file, JSON.stringify({ action: "wait" }));
  assert.equal(readProgressAction(file), "wait");
  assert.throws(() => readProgressAction(output), { code: "EISDIR" });
});

test("SIGKILL recovery observes zero recorded browser processes and leaves an unrelated process alive", async () => {
  const directory = join(output, "interrupted");
  const sentinel = spawn(
    process.execPath,
    ["-e", "setInterval(() => {}, 1000)"],
    { stdio: "ignore" },
  );
  const child = spawn(
    process.execPath,
    [
      join(root, "packages/browser-evidence/fixtures/driver.mjs"),
      "hold",
      fixture,
      directory,
    ],
    { env: process.env, stdio: ["ignore", "pipe", "pipe"] },
  );
  const childExit = once(child, "exit");
  try {
    const until = Date.now() + 10000;
    let processes;
    while (Date.now() < until) {
      if (readProgressAction(join(directory, "progress.json")) === "wait") {
        processes = JSON.parse(
          readFileSync(join(directory, "processes.json"), "utf8"),
        );
        if (processes.processes.length >= 2) break;
      }
      await delay(25);
    }
    assert.ok(
      processes?.processes.length >= 2,
      "Held host recorded browser and descendants",
    );
    const before = processTable().filter((entry) =>
      [child.pid, ...processes.processes.map((entry) => entry.pid)].includes(
        entry.pid,
      ),
    );
    assert.ok(before.some((entry) => entry.pid === child.pid));
    assert.ok(before.some((entry) => entry.pid === processes.browserPid));
    // A second live owner cannot recover an active run.
    await assert.rejects(
      runScenario(scenario, {
        directory: join(output, "refused-recovery"),
        subjectRevision: "synthetic-candidate",
        recoverFrom: directory,
      }),
      /owner is still running/u,
    );
    child.kill("SIGKILL");
    const [exitCode, signal] = await childExit;
    assert.equal(signal, "SIGKILL");
    const recovery = await runScenario(scenario, {
      directory: join(output, "recovery"),
      subjectRevision: "synthetic-candidate",
      recoverFrom: directory,
    });
    assert.equal(recovery.availability, "available", recovery.reason);
    const after = processTable().filter((entry) =>
      [child.pid, ...processes.processes.map((entry) => entry.pid)].includes(
        entry.pid,
      ),
    );
    assert.deepEqual(after, []);
    assert.ok(processTable().some((entry) => entry.pid === sentinel.pid));
    assert.deepEqual(recovery.remainingPids, []);
    record({
      id: "host-sigkill-recovery",
      label: "pass",
      recordedHostPid: child.pid,
      recordedBrowserPids: processes.processes.map((entry) => entry.pid),
      before: before.map((entry) => ({
        pid: entry.pid,
        parentPid: entry.parentPid,
        startedAt: entry.startedAt,
        command: basename(entry.command),
      })),
      parentExit: { exitCode, signal },
      recoverySignalledPids: recovery.recoveredPids,
      after,
      unrelatedProcessAlive: true,
    });
  } finally {
    if (child.exitCode === null && child.signalCode === null)
      child.kill("SIGKILL");
    sentinel.kill("SIGKILL");
    await Promise.all([childExit, once(sentinel, "exit")]);
  }
});

test("missing pinned browser returns unavailable evidence and the package suite fails with an install command", () => {
  const missing = join(output, "empty browser cache ' $cache `cache`");
  mkdirSync(missing);
  const env = { ...process.env, PLAYWRIGHT_BROWSERS_PATH: missing };
  const directory = join(output, "unavailable");
  const child = spawnSync(
    process.execPath,
    [
      join(root, "packages/browser-evidence/fixtures/driver.mjs"),
      "run",
      fixture,
      directory,
    ],
    { env, encoding: "utf8", timeout: 30000 },
  );
  assert.equal(child.status, 0, child.stderr);
  const result = JSON.parse(
    readFileSync(join(directory, "result.json"), "utf8"),
  );
  assert.equal(result.availability, "unavailable");
  assert.match(result.reason, /npx playwright install chromium --only-shell/u);
  const command = installFrom(result.reason);
  const locations = installLocations(command, root, withoutBrowserPath(env));
  assert.ok(locations.every((location) => dirname(location) === missing));
  assert.equal(result.evidence.length, scenario.criteria.length * 5);
  assert.ok(
    result.evidence.every(
      (entry) => entry.outcome === "unavailable" && !entry.witness,
    ),
  );
  const request = requestFor(scenario, result.evidence);
  assert.throws(
    () => parseEvidenceResult(resultFor(request), request),
    /unsupported pass/u,
  );
  assert.doesNotThrow(() =>
    parseEvidenceResult(resultFor(request, "unverified"), request),
  );
  const suite = spawnSync(
    process.execPath,
    [
      "--test",
      "--test-name-pattern=installed pinned browser",
      fileURLToPath(import.meta.url),
    ],
    {
      env: independentEnv(env),
      encoding: "utf8",
      timeout: 30000,
    },
  );
  assert.equal(suite.status, 1, `${suite.stdout}${suite.stderr}`);
  assert.match(suite.stdout, /npx playwright install chromium --only-shell/u);
  record({
    id: "missing-browser",
    label: "pass",
    availability: result.availability,
    reason: result.reason,
    evidenceOutcomes: [
      ...new Set(result.evidence.map((entry) => entry.outcome)),
    ],
    refusedPass: true,
    admittedUnverified: true,
    packageSuiteExit: suite.status,
    packageSuiteInstallCommand: command.replace(output, "<fixture-output>"),
    installCacheMatchesLaunch: true,
    shellCharactersPreserved: true,
  });
});

test("fresh worktree suite default prints an install remedy for its actual cache and README setup", () => {
  // npm scans ancestors for workspaces even above a local manifest. Model an
  // independent worktree outside this checkout regardless of capture storage.
  const created = mkdtempSync(join(tmpdir(), "wo059-fresh-worktree-"));
  // Node canonicalizes the copied suite's module URL; macOS tmpdir is a symlink.
  const fresh = realpathSync(created);
  const browserPackage = join(fresh, "packages/browser-evidence");
  const suiteFile = join(browserPackage, "test/scenario.test.mjs");
  mkdirSync(dirname(suiteFile), { recursive: true });
  writeFileSync(suiteFile, readFileSync(fileURLToPath(import.meta.url)));
  for (const name of ["compiler", "skeleton"])
    symlinkSync(join(root, "packages", name), join(fresh, "packages", name));
  for (const name of ["dist", "fixtures"])
    symlinkSync(
      join(root, "packages/browser-evidence", name),
      join(browserPackage, name),
    );
  symlinkSync(join(root, "node_modules"), join(fresh, "node_modules"));
  const captures = join(fresh, "captures");
  const env = independentEnv(
    withoutBrowserPath({
      ...process.env,
      DOTLN_BROWSER_EVIDENCE_DIR: captures,
    }),
  );
  const suite = spawnSync(
    process.execPath,
    ["--test", "--test-name-pattern=^installed pinned browser", suiteFile],
    { cwd: fresh, env, encoding: "utf8", timeout: 30000 },
  );
  assert.equal(suite.status, 1, `${suite.stdout}${suite.stderr}`);
  const [capture] = readdirSync(captures);
  const result = JSON.parse(
    readFileSync(join(captures, capture, "reference/result.json"), "utf8"),
  );
  assert.equal(result.availability, "unavailable");
  const command = installFrom(result.reason);
  const locations = installLocations(command, fresh, env);
  const cache = join(fresh, ".runtime/playwright");
  assert.ok(locations.every((location) => dirname(location) === cache));
  assert.ok(
    locations.some((location) =>
      /^chromium_headless_shell-/u.test(basename(location)),
    ),
  );
  const readme = readFileSync(
    join(root, "packages/browser-evidence/README.md"),
    "utf8",
  );
  const [readmeCommand] =
    readme.match(
      /^PLAYWRIGHT_BROWSERS_PATH=.+ npx playwright install chromium --only-shell$/mu,
    ) ?? [];
  assert.ok(readmeCommand, "README names the cache-scoped install command");
  assert.deepEqual(installLocations(readmeCommand, fresh, env), locations);
  record({
    id: "fresh-worktree-install-remedy",
    label: "pass",
    browserPathSupplied: false,
    packageSuiteExit: suite.status,
    browserCache: "<fresh-worktree>/.runtime/playwright",
    packageSuiteInstallCommand: command.replace(fresh, "<fresh-worktree>"),
    installCacheMatchesLaunch: true,
    readmeInstallLocationsEqual: true,
  });
});

test("default environment caller keeps the platform-default browser install remedy", () => {
  const home = join(output, "empty-default-home");
  mkdirSync(home);
  const env = withoutBrowserPath({
    ...process.env,
    HOME: home,
    XDG_CACHE_HOME: join(home, ".cache"),
    LOCALAPPDATA: home,
  });
  const child = spawnSync(
    process.execPath,
    [
      join(root, "packages/browser-evidence/fixtures/driver.mjs"),
      "run",
      fixture,
      join(output, "default-unavailable"),
    ],
    { env, encoding: "utf8", timeout: 30000 },
  );
  assert.equal(child.status, 0, child.stderr);
  const result = JSON.parse(child.stdout);
  assert.equal(result.availability, "unavailable");
  const command = installFrom(result.reason);
  assert.equal(command, "npx playwright install chromium --only-shell");
  const locations = installLocations(command, root, env);
  assert.ok(locations.every((location) => location.startsWith(`${home}/`)));
  assert.ok(
    locations.some((location) =>
      /^chromium_headless_shell-/u.test(basename(location)),
    ),
  );
  record({
    id: "default-caller-install-remedy",
    label: "pass",
    browserPathSupplied: false,
    installCommand: command,
    platformDefaultCacheSelected: true,
  });
});

test("unsupported scenario inputs fail before filesystem or browser effects", async () => {
  const directory = join(output, "invalid");
  for (const steps of [
    [
      { action: "navigate", path: "//example.invalid/" },
      ...scenario.steps.slice(1),
    ],
    [{ action: "evaluate", script: "1" }],
    [{ action: "navigate", path: "/" }],
  ])
    await assert.rejects(
      runScenario(
        { ...scenario, steps },
        { directory, subjectRevision: "synthetic-candidate" },
      ),
      /scenario/u,
    );
  assert.equal(existsSync(directory), false);
  record({ id: "invalid-input", label: "pass", outputCreated: false });
});

test("capture overflow remains bounded unavailable evidence admitted without a pass", async () => {
  const input = {
    ...scenario,
    scenarioId: "capture-overflow",
    criteria: Array.from({ length: 10 }, (_, index) => ({
      ...scenario.criteria[0],
      criterionId: `visual-${index}`,
    })),
    steps: [
      ...Array.from({ length: 7 }, () => ({ action: "navigate", path: "/" })),
      { action: "assertText", selector: "#result", value: "Ready" },
    ],
  };
  const run = await runScenario(input, {
    directory: join(output, "overflow"),
    subjectRevision: "synthetic-candidate",
  });
  assert.equal(run.availability, "unavailable");
  assert.match(run.reason, /contract bounds/u);
  assert.equal(run.evidence.length, 100);
  assert.ok(run.evidence.every((entry) => entry.outcome === "unavailable"));
  assert.doesNotThrow(() =>
    compileVerificationTask("WO-059-overflow", criteriaFor(input), {
      repo: "synthetic-browser-fixture",
      baseCommit: "synthetic-base",
      revision: "synthetic-candidate",
      diff: "",
      files: [
        {
          path: input.criteria[0].codeSurfaces[0],
          contents: readFileSync(
            join(root, input.criteria[0].codeSurfaces[0]),
            "utf8",
          ),
        },
      ],
      evidence: run.evidence,
    }),
  );
  record({
    id: "capture-overflow",
    label: "pass",
    availability: run.availability,
    reason: run.reason,
    boundedEvidenceCount: run.evidence.length,
  });
});

test("recovery rejects an unrelated recorded process and ignores a stale root identity", async () => {
  const self = processTable().find((entry) => entry.pid === process.pid);
  const directory = join(output, "invalid-ownership");
  mkdirSync(directory);
  const deadOwner = { ...self, pid: 999999999 };
  const recordFile = join(directory, "processes.json");
  writeFileSync(
    recordFile,
    JSON.stringify({
      schemaVersion: 1,
      owner: deadOwner,
      browserPid: self.pid,
      processes: [self],
      closed: false,
    }),
  );
  await assert.rejects(
    runScenario(scenario, {
      directory: join(output, "ownership-refused"),
      subjectRevision: "synthetic-candidate",
      recoverFrom: directory,
    }),
    /ownership record/u,
  );
  assert.ok(processTable().some((entry) => sameProcess(entry, self)));
  const stale = {
    ...self,
    parentPid: deadOwner.pid,
    startedAt: "Wed Jan  1 00:00:00 2000",
  };
  writeFileSync(
    recordFile,
    JSON.stringify({
      schemaVersion: 1,
      owner: deadOwner,
      browserPid: stale.pid,
      processes: [stale],
      closed: false,
    }),
  );
  const run = await runScenario(scenario, {
    directory: join(output, "stale-identity"),
    subjectRevision: "synthetic-candidate",
    recoverFrom: directory,
  });
  assert.equal(run.availability, "available", run.reason);
  assert.deepEqual(run.recoveredPids, []);
  assert.ok(processTable().some((entry) => sameProcess(entry, self)));
  record({
    id: "recovery-identity",
    label: "pass",
    unrelatedRecordRefused: true,
    staleIdentitySignalledPids: run.recoveredPids,
    originalProcessAlive: true,
  });
});

test("a bare browser PID never adopts or signals an unrelated live process", async () => {
  const sentinel = spawn(
    process.execPath,
    ["-e", "setInterval(() => {}, 1000)"],
    {
      stdio: "ignore",
    },
  );
  const sentinelExit = once(sentinel, "exit");
  try {
    const table = processTable();
    const self = table.find((entry) => entry.pid === process.pid);
    const bystander = table.find((entry) => entry.pid === sentinel.pid);
    assert.ok(bystander);
    const directory = join(output, "bare-pid");
    mkdirSync(directory);
    const recordData = {
      schemaVersion: 1,
      owner: { ...self, pid: 999999999 },
      browserPid: sentinel.pid,
      processes: [],
      closed: false,
    };
    observeOwned(recordData);
    assert.deepEqual(
      recordData.processes,
      [],
      "No root identity means no adoption",
    );
    const recordFile = join(directory, "processes.json");
    writeFileSync(recordFile, JSON.stringify(recordData));
    const before = readFileSync(recordFile);
    await assert.rejects(recover(directory), /ownership record/u);
    assert.deepEqual(readFileSync(recordFile), before);
    // A nonempty list containing only an unrelated identity also has no root.
    recordData.processes = [self];
    writeFileSync(recordFile, JSON.stringify(recordData));
    await assert.rejects(recover(directory), /ownership record/u);
    assert.ok(processTable().some((entry) => sameProcess(entry, bystander)));
    assert.equal(sentinel.signalCode, null);
    record({
      id: "bare-pid-bystander",
      label: "pass",
      emptyRecordRefused: true,
      missingRootWithNonemptyListRefused: true,
      adoptedPids: [],
      bystanderPid: sentinel.pid,
      bystanderAlive: true,
      bystanderSignalled: false,
    });
  } finally {
    sentinel.kill("SIGKILL");
    await sentinelExit;
  }
});

test("recovery signals a recorded surviving root and child after owner SIGKILL", async () => {
  const owner = spawn(
    process.execPath,
    [join(root, "packages/browser-evidence/fixtures/process-owner.mjs")],
    { stdio: ["ignore", "ignore", "pipe", "ipc"] },
  );
  const ownerExit = once(owner, "exit");
  let owned = [];
  try {
    const [ready] = await once(owner, "message");
    const table = processTable();
    const ownerIdentity = table.find((entry) => entry.pid === ready.pid);
    owned = [ready.child.pid, ready.child.child.pid].map((pid) =>
      table.find((entry) => entry.pid === pid),
    );
    assert.ok(ownerIdentity);
    assert.ok(owned.every(Boolean));
    assert.equal(owned[0].parentPid, ownerIdentity.pid);
    assert.equal(owned[1].parentPid, owned[0].pid);
    const directory = join(output, "surviving-tree");
    mkdirSync(directory);
    writeFileSync(
      join(directory, "processes.json"),
      JSON.stringify({
        schemaVersion: 1,
        owner: ownerIdentity,
        browserPid: owned[0].pid,
        processes: owned,
        closed: false,
      }),
    );
    const originalTimezone = process.env.TZ;
    const observedStartTimes = [];
    try {
      for (const timezone of ["UTC", "America/New_York"]) {
        process.env.TZ = timezone;
        observedStartTimes.push(
          processTable().find((entry) => entry.pid === owner.pid).startedAt,
        );
      }
    } finally {
      if (originalTimezone === undefined) delete process.env.TZ;
      else process.env.TZ = originalTimezone;
    }
    assert.equal(observedStartTimes[0], observedStartTimes[1]);
    const renamed = once(owner, "message");
    owner.send("rename");
    assert.equal((await renamed)[0].renamed, true);
    const renamedOwner = processTable().find(
      (entry) => entry.pid === owner.pid,
    );
    assert.notEqual(renamedOwner.command, ownerIdentity.command);
    await assert.rejects(recover(directory), /owner is still running/u);
    owner.kill("SIGKILL");
    const [exitCode, signal] = await ownerExit;
    assert.equal(signal, "SIGKILL");
    const before = processTable().filter((entry) =>
      owned.some((identity) => sameProcess(identity, entry)),
    );
    assert.equal(before.length, 2, "Both processes survived their owner");
    const run = await runScenario(scenario, {
      directory: join(output, "surviving-tree-recovery"),
      subjectRevision: "synthetic-candidate",
      recoverFrom: directory,
    });
    assert.equal(run.availability, "available", run.reason);
    assert.deepEqual(
      [...run.recoveredPids].sort(),
      owned.map((entry) => entry.pid).sort(),
    );
    const after = processTable().filter((entry) =>
      owned.some((identity) => sameProcess(identity, entry)),
    );
    assert.deepEqual(after, []);
    assert.equal(
      JSON.parse(readFileSync(join(directory, "processes.json"))).closed,
      true,
    );
    record({
      id: "surviving-owned-tree-recovery",
      label: "pass",
      fixtureKind: "synthetic owned Node process tree",
      recordedOwnerPid: ownerIdentity.pid,
      before: before.map((entry) => ({
        ...entry,
        command: basename(entry.command),
      })),
      ownerExit: { exitCode, signal },
      observedStartTimes,
      renamedOwnerStillRefused: true,
      recoverySignalledPids: run.recoveredPids,
      after,
      freshScenarioAvailability: run.availability,
    });
  } finally {
    if (owner.exitCode === null && owner.signalCode === null)
      owner.kill("SIGKILL");
    for (const identity of [...owned].reverse()) {
      if (
        !identity ||
        !processTable().some((entry) => sameProcess(identity, entry))
      )
        continue;
      try {
        process.kill(identity.pid, "SIGKILL");
      } catch (error) {
        if (error.code !== "ESRCH") throw error;
      }
    }
    await ownerExit;
  }
});

test("observed console errors remain adverse when another capture is unavailable", async () => {
  const input = {
    ...scenario,
    scenarioId: "error-and-overflow",
    steps: [
      ...Array.from({ length: 7 }, () => ({
        action: "navigate",
        path: "/console-error.html",
      })),
      { action: "assertText", selector: "#result", value: "Error captured" },
    ],
  };
  const run = await runScenario(input, {
    directory: join(output, "error-and-overflow"),
    subjectRevision: "synthetic-candidate",
  });
  assert.equal(run.availability, "unavailable");
  const errors = run.evidence.filter(
    (entry) => entry.witness.kind === "console-capture",
  );
  assert.ok(errors.every((entry) => entry.outcome === "fail"));
  assert.ok(run.evidence.every((entry) => entry.outcome !== "pass"));
  const request = requestFor(input, run.evidence);
  assert.throws(
    () => parseEvidenceResult(resultFor(request), request),
    /console error witness/u,
  );
  record({
    id: "console-error-with-unavailable-capture",
    label: "pass",
    availability: run.availability,
    consoleOutcomes: errors.map((entry) => entry.outcome),
    refusedPass: true,
  });
});
