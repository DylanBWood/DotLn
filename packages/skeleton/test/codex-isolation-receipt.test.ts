import test from "node:test";
import assert from "node:assert/strict";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertCodexIsolationUnchanged,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
  type ProcessRunner,
} from "../src/worker-transport.js";
import { runWorkerDemo } from "../src/worker-demo.js";
import { runVerificationDemo } from "../src/verification-demo.js";
import { WorkerStore } from "../src/worker-store.js";
import type { FixtureTree } from "../src/scenario.js";

// WO-159 AC4: the live receipt lists both digest pairs among its protected
// surfaces, and a receipt whose pairs differ fails the receipt check.
const evidence = new URL("../../../../docs/evidence/WO-159/", import.meta.url);
const {
  buildReceipt,
  matchSharedStream,
  observeLogin,
  trustCensus,
  validateReceipt,
} = await import(new URL("receipt.mjs", evidence).href);
const fixture = JSON.parse(
  readFileSync(
    new URL("../../fixtures/repo-tree.json", import.meta.url),
    "utf8",
  ),
) as FixtureTree;
const fixtureCli = (name: string) =>
  fileURLToPath(new URL(`../../fixtures/${name}`, import.meta.url));
type Receipt = ReturnType<typeof JSON.parse>;
const OTHER = `sha256:${"0".repeat(64)}`;

/** A fixture operator: a user-level Codex home, a fake `codex login status`
 * that authenticates only through the link, and a runner that makes the fake
 * Codex write a trust entry into its home. */
function operator(root: string, inner?: string) {
  const user = join(root, "user-codex");
  mkdirSync(user, { mode: 0o700 });
  writeFileSync(
    join(user, "config.toml"),
    '[projects."/fixture/project"]\ntrust_level = "trusted"\n',
  );
  writeFileSync(join(user, "auth.json"), '{"tokens":{}}', { mode: 0o600 });
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    CODEX_HOME: user,
    ...(inner ? { DOTLN_CODEX_FIXTURE: fixtureCli(inner) } : {}),
  };
  const login = join(root, "codex-login");
  writeFileSync(
    login,
    `#!${process.execPath}\nconst { existsSync } = require("node:fs");\nconst ok = existsSync(require("node:path").join(process.env.CODEX_HOME, "auth.json"));\nconsole.log(ok ? "Logged in using ChatGPT" : "Not logged in");\nprocess.exit(ok ? 0 : 1);\n`,
  );
  chmodSync(login, 0o700);
  const runner: ProcessRunner = (launch) =>
    runWorkerProcess({
      ...launch,
      binary: process.execPath,
      args: [
        fixtureCli("codex-home-cli.mjs"),
        "codex-cli-exec",
        "success",
        ...launch.args,
      ],
    });
  return {
    env,
    login,
    transport: new CodexCliExecWorkOrderTransport(
      runner,
      "0.156.1",
      undefined,
      env,
    ),
  };
}

/** A fixture receipt from the fake codex: the same builder the live row uses. */
async function fixtureReceipt(root: string): Promise<Receipt> {
  const { env, login, transport } = operator(root);
  const before = trustCensus(env);
  const observed = observeLogin({ binary: login, env });
  const store = join(root, "store");
  await runWorkerDemo({
    directory: store,
    fixture,
    transport,
    model: "gpt-6-sol",
    effort: "xhigh",
  });
  // A JSON round trip, as a committed receipt is read.
  return JSON.parse(
    JSON.stringify(
      buildReceipt({
        log: new WorkerStore(store).read(),
        login: observed,
        before,
        after: trustCensus(env),
        timeoutMs: 600_000,
        commandExit: 0,
      }),
    ),
  );
}

test("WO-159 AC4 a fixture receipt passes; unequal pairs and other forgeries fail the receipt check", async () => {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-codex-receipt-test-")),
  );
  try {
    const receipt = await fixtureReceipt(root);
    assert.doesNotThrow(() => validateReceipt(receipt));
    assert.equal(
      receipt.protectedSurfaces.value.codexUserConfiguration.length,
      2,
    );
    assert.equal(receipt.trustBaseline.value.trustedEntriesBefore, 1);
    assert.equal(receipt.episode.value.isolation.isolatedTrustEntries, 1);
    const forgeries: [string, (r: Receipt) => void, RegExp][] = [
      [
        "episode user configuration changed",
        (r) => (r.episode.value.isolation.userConfig.after = OTHER),
        /configuration changed across the episode/u,
      ],
      [
        "episode trust table changed",
        (r) => (r.episode.value.isolation.trustTable.after = OTHER),
        /configuration changed across the episode/u,
      ],
      [
        "login episode configuration changed",
        (r) => (r.authentication.value.isolation.userConfig.after = OTHER),
        /configuration changed across the episode/u,
      ],
      [
        "unreadable configuration called unchanged",
        (r) => {
          r.episode.value.isolation.userConfig.before = "unknown";
          r.episode.value.isolation.userConfig.after = "unknown";
        },
        /configuration changed across the episode/u,
      ],
      [
        "home left behind",
        (r) => (r.episode.value.isolation.homeRemoved = false),
        /home was not removed/u,
      ],
      [
        "worker home without the auth link",
        (r) => (r.episode.value.isolation.authentication = "absent"),
        /no auth link/u,
      ],
      [
        "isolated trust observation dropped",
        (r) => delete r.episode.value.isolation.isolatedTrustEntries,
        /closed shape/u,
      ],
      [
        "isolated trust observation retyped",
        (r) => (r.episode.value.isolation.isolatedTrustEntries = "n/a"),
        /isolated trust entries are observed/u,
      ],
      [
        "configuration carried in an extra field",
        (r) => (r.episode.value.isolation.configCopy = "W3Byb2plY3RzXQ=="),
        /closed shape/u,
      ],
      [
        "one home restated for both launches",
        (r) =>
          (r.authentication.value.isolation.home =
            r.episode.value.isolation.home),
        /each launch has its own home/u,
      ],
      [
        "protected surface restates another pair",
        (r) =>
          (r.protectedSurfaces.value.codexUserConfiguration[1].trustTable.after =
            OTHER),
        /restates a different digest pair/u,
      ],
      [
        "protected surface omitted",
        (r) => r.protectedSurfaces.value.codexUserConfiguration.pop(),
        /both launches are listed/u,
      ],
      [
        "unchanged denied",
        (r) => (r.protectedSurfaces.value.unchanged = false),
        /must be unchanged/u,
      ],
      [
        "trusted-project count changed",
        (r) => (r.trustBaseline.value.trustedEntriesAfter = 2),
        /trusted-project count changed/u,
      ],
      [
        "census of another configuration",
        (r) => {
          r.trustBaseline.value.configBefore = OTHER;
          r.trustBaseline.value.configAfter = OTHER;
        },
        /census read another configuration/u,
      ],
      [
        "login failed in isolation",
        (r) => (r.authentication.value.exitCode = 1),
        /login status failed/u,
      ],
      [
        "login home without the auth link",
        (r) => (r.authentication.value.isolation.authentication = "absent"),
        /no auth link/u,
      ],
      [
        "interrupted episode",
        (r) => (r.episode.value.terminal = "WorkerInterrupted"),
        /did not complete/u,
      ],
      [
        "failed feedback-audit command",
        (r) => (r.episode.value.commandExit = 1),
        /did not complete/u,
      ],
      [
        "stalled episode",
        (r) => (r.episode.value.durationMs = r.episode.value.timeoutMs),
        /stalled or unbounded/u,
      ],
      [
        "prompting launch",
        (r) => (r.launch.value.approvalPolicy = "on-request"),
        /never prompts/u,
      ],
      [
        "unnamed event stream",
        (r) => (r.eventStream.value.sha256 = "not-a-digest"),
        /names the episode/u,
      ],
      [
        "private path",
        (r) => (r.claim = "home /Users/someone/.codex"),
        /private material/u,
      ],
      [
        "credential",
        (r) => (r.claim = "refresh_token present"),
        /private material/u,
      ],
      ["extra field", (r) => (r.configuration = "copied"), /closed shape/u],
      [
        "observation relabelled a claim",
        (r) => (r.episode.epistemic = "launch-claim"),
        /epistemic label/u,
      ],
    ];
    for (const [label, change, message] of forgeries) {
      const forged = structuredClone(receipt);
      change(forged);
      assert.throws(() => validateReceipt(forged), message, label);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("WO-159 AC4 the verification host's own episode record builds a valid receipt", async () => {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-codex-receipt-test-")),
  );
  try {
    const { env, login, transport } = operator(root, "verification-cli.mjs");
    const before = trustCensus(env);
    const observed = observeLogin({ binary: login, env });
    const { log } = await runVerificationDemo({
      directory: join(root, "store"),
      transport,
      model: "gpt-6-sol",
      effort: "unknown",
    });
    const started = log
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line))
      .filter((event) => event.type === "WorkerAttemptStarted");
    assert.ok(started.length >= 1);
    const receipt = buildReceipt({
      log,
      login: observed,
      before,
      after: trustCensus(env),
      timeoutMs: 600_000,
      commandExit: 0,
      workerEpisodeId: started[0].payload.workerEpisodeId,
    });
    assert.doesNotThrow(() => validateReceipt(receipt));
    assert.equal(receipt.episode.value.terminal, "WorkerCompleted");
    assert.equal(receipt.episode.value.isolation.isolatedTrustEntries, 1);
    // The retained stream derives the receipt (VER-001 F2): a digest, count,
    // launch selection or episode fact the stream does not bear is refused.
    assert.equal(matchSharedStream(receipt, log), true);
    const streamForgeries: [string, (r: Receipt) => void, RegExp][] = [
      [
        "well-formed false stream digest",
        (r) => (r.eventStream.value.sha256 = OTHER),
        /records another eventStream/u,
      ],
      [
        "row count",
        (r) => (r.eventStream.value.rows += 1),
        /records another eventStream/u,
      ],
      [
        "terminal event",
        (r) => (r.eventStream.value.terminalEventId = "evt_0"),
        /records another eventStream/u,
      ],
      [
        "launch selection",
        (r) => (r.launch.value.model = "gpt-other"),
        /records another launch/u,
      ],
      [
        "launch harness version",
        (r) => (r.launch.value.harnessVersion = "0.0.1"),
        /records another launch/u,
      ],
      [
        "episode home",
        (r) => (r.episode.value.isolation.home = `sha256:${"1".repeat(64)}`),
        /records another episode/u,
      ],
      [
        "heartbeat count",
        (r) => (r.episode.value.heartbeats += 1),
        /records another episode/u,
      ],
      [
        "episode absent from the stream",
        (r) => (r.eventStream.value.workerEpisodeId = "wep_absent"),
        /exactly one launched episode/u,
      ],
    ];
    for (const [label, change, message] of streamForgeries) {
      const forged = structuredClone(receipt);
      change(forged);
      assert.doesNotThrow(() => validateReceipt(forged), label);
      assert.throws(() => matchSharedStream(forged, log), message, label);
    }
    // A stream whose start event names another launch selection.
    const mismatched = log.replace(
      /("type":"WorkerAttemptStarted".*?"model":)"gpt-6-sol"/u,
      '$1"gpt-other"',
    );
    assert.notEqual(mismatched, log);
    assert.throws(
      () => matchSharedStream(receipt, mismatched),
      /records another launch/u,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("WO-159 AC3 the committed live receipt and trust probe pass the receipt check", () => {
  // The live row is retained evidence: a missing receipt fails, never skips.
  const receipt = JSON.parse(
    readFileSync(fileURLToPath(new URL("live-codex.json", evidence)), "utf8"),
  );
  assert.doesNotThrow(() => validateReceipt(receipt));
  assert.equal(matchSharedStream(receipt), true);
  // VER-001 F2's reproduction: a well-formed false digest passes the syntax
  // check but not the retained stream.
  const forged = structuredClone(receipt);
  forged.eventStream.value.sha256 = OTHER;
  assert.doesNotThrow(() => validateReceipt(forged));
  assert.throws(
    () => matchSharedStream(forged),
    /records another eventStream/u,
  );
  // With the WO-111 source-change prefix the CLI still writes a trust entry;
  // the isolated home kept it out of the user-level configuration.
  const probe = JSON.parse(
    readFileSync(fileURLToPath(new URL("trust-probe.json", evidence)), "utf8"),
  );
  assert.equal(probe.episode.value.exitCode, 0);
  assert.ok(probe.isolatedTrust.value.isolatedTrustEntries >= 1);
  assert.equal(probe.isolatedTrust.value.entryNamesTheScratchTarget, true);
  assert.doesNotThrow(() => assertCodexIsolationUnchanged([probe.isolation]));
  assert.equal(
    probe.userConfiguration.value.trustedEntriesBefore,
    probe.userConfiguration.value.trustedEntriesAfter,
  );
});
