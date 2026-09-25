#!/usr/bin/env node
// WO-159 live-row receipt: one Codex worker episode through the transport on
// the operator's host, in an isolated per-episode CODEX_HOME, with the
// user-level Codex configuration and its trust table digested before and
// after. Digests and counts only: never configuration bytes, a project path,
// the auth file or CLI output.
//
//   node docs/evidence/WO-159/receipt.mjs --live --store <new directory>
//     brackets one `dotln feedback-audit` Codex episode; a valid receipt is
//     written to live-codex.json, anything else to live-codex-attempt-N.json
//   node docs/evidence/WO-159/receipt.mjs --check
//     validates the committed live-codex.json and derives it again from the
//     retained verifier stream of the feedback edition that shares its store
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import {
  assertCodexIsolationUnchanged,
  codexTrustTable,
  startCodexEpisode,
  userCodexHome,
} from "../../../packages/skeleton/dist/src/worker-transport.js";
import { FEEDBACK_VERIFIER_LIMITS } from "../../../packages/skeleton/dist/src/verification-protocol.js";
import { feedbackEditionLog } from "../../../packages/skeleton/dist/src/feedback-edition-log.js";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const ROOT = fileURLToPath(new URL("../../../", import.meta.url));
export const LIVE_RECEIPT = join(HERE, "live-codex.json");
/** The feedback edition minted from the same store (D001). */
export const SHARED_EDITION = "docs/evidence/WO-159/feedback-001";
/** Its verifier stream by value: the committed file holds references, which
 * rebuild the store's bytes exactly (WO-154). */
export const sharedStream = () =>
  feedbackEditionLog(ROOT, SHARED_EDITION, "verifier").value;
export const LIVE_SELECTION = {
  transport: "codex-cli-exec",
  model: "gpt-6-sol",
  effort: "xhigh",
};
// Anything that could carry a private path, account or credential.
const PRIVATE =
  /\/Users\/|\/home\/|\/private\/|\/var\/folders\/|\/tmp\/|[A-Za-z]:\\|@[a-z0-9-]+\.[a-z]|eyJ[A-Za-z0-9_-]{8}|sk-[A-Za-z0-9]{8}|access_token|refresh_token|id_token|account_id/iu;
const DIGEST = /^(?:sha256:[0-9a-f]{64}|absent|unknown)$/u;
const SHA = /^sha256:[0-9a-f]{64}$/u;
const TOP = [
  "schemaVersion",
  "workOrder",
  "claim",
  "launch",
  "authentication",
  "episode",
  "eventStream",
  "protectedSurfaces",
  "trustBaseline",
];
const ISOLATION = [
  "schemaVersion",
  "home",
  "authentication",
  "userConfig",
  "trustTable",
  "isolatedTrustEntries",
  "homeRemoved",
];

const sha256 = (bytes) =>
  `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
const keys = (value, expected, label) => {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    !isDeepStrictEqual(Object.keys(value).sort(), [...expected].sort())
  )
    throw new Error(`${label}: closed shape`);
};
const fact = (value, epistemic, expected, label) => {
  keys(value, ["epistemic", "value"], label);
  if (value.epistemic !== epistemic)
    throw new Error(`${label}: epistemic label must be ${epistemic}`);
  keys(value.value, expected, `${label}.value`);
  return value.value;
};
const isolation = (record, label) => {
  keys(record, ISOLATION, label);
  keys(record.userConfig, ["before", "after"], `${label}.userConfig`);
  keys(record.trustTable, ["before", "after"], `${label}.trustTable`);
  if (
    record.isolatedTrustEntries !== null &&
    !(
      Number.isSafeInteger(record.isolatedTrustEntries) &&
      record.isolatedTrustEntries >= 0
    )
  )
    throw new Error(`${label}: isolated trust entries are observed`);
  if (record.authentication !== "symlink")
    throw new Error(`${label}: the isolated home had no auth link`);
  return record;
};

/** Count trusted projects in the user-level configuration: a count and the
 * file digest, never a path. */
export function trustCensus(env = process.env) {
  const path = join(userCodexHome(env), "config.toml");
  if (!existsSync(path)) return { trustedEntries: 0, config: "absent" };
  const bytes = readFileSync(path);
  return {
    trustedEntries: codexTrustTable(bytes.toString("utf8"))
      .split("\n")
      .filter((line) => /trust_level\s*=\s*["']trusted["']/u.test(line)).length,
    config: sha256(bytes),
  };
}

/** `codex login status` under its own isolated home; only the exit code, a
 * logged-in boolean and the auth method's kind are kept. */
export function observeLogin({ binary = "codex", env = process.env } = {}) {
  const episode = startCodexEpisode(env);
  let run;
  try {
    run = spawnSync(binary, ["login", "status"], {
      env: episode.env,
      encoding: "utf8",
      timeout: 30_000,
    });
  } finally {
    episode.finish();
  }
  const text = `${run.stdout ?? ""}${run.stderr ?? ""}`;
  return {
    command: "codex login status",
    exitCode: run.status,
    loggedIn: /logged in/iu.test(text) && !/not logged in/iu.test(text),
    method: /using chatgpt/iu.test(text)
      ? "chatgpt"
      : /api key/iu.test(text)
        ? "api-key"
        : "unknown",
    isolation: episode.finish(),
  };
}

/** Build the receipt from the episode store's log and the bracketing
 * observations. The store's own terminal event carries the isolation record
 * the transport produced. A log with several episodes names the one. */
export function buildReceipt({
  log,
  login,
  before,
  after,
  timeoutMs,
  commandExit,
  workerEpisodeId,
}) {
  const all = log
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  const starts = all.filter(
    (e) =>
      e.type === "WorkerAttemptStarted" &&
      (workerEpisodeId === undefined ||
        e.payload.workerEpisodeId === workerEpisodeId),
  );
  if (starts.length !== 1)
    throw new Error("the live row is exactly one launched episode");
  const episodeId = starts[0].payload.workerEpisodeId;
  const events = all.filter((e) => e.payload?.workerEpisodeId === episodeId);
  const terminal = events.filter((e) =>
    ["WorkerCompleted", "WorkerInterrupted"].includes(e.type),
  );
  if (terminal.length !== 1)
    throw new Error("the episode has exactly one terminal event");
  const launch = starts[0].payload;
  const end = terminal[0];
  const record = end.payload.codexIsolation;
  if (!record) throw new Error("the episode record carries no isolation");
  const surface = (source, value) => ({
    source,
    userConfig: { ...value.userConfig },
    trustTable: { ...value.trustTable },
  });
  return {
    schemaVersion: 1,
    workOrder: "WO-159",
    claim:
      "One Codex worker episode through CodexCliExecWorkOrderTransport ran in an isolated per-episode CODEX_HOME holding only a link to the operator's auth file; codex login status succeeded under another such home; the user-level Codex configuration and its trust table were byte-identical before and after each launch.",
    launch: {
      epistemic: "launch-claim",
      value: {
        command: `dotln feedback-audit --transport ${launch.transport} --model ${launch.model} --effort ${launch.effort}`,
        transport: launch.transport,
        harnessVersion: launch.harnessVersion,
        model: launch.model,
        effort: launch.effort,
        selectionSource: launch.selectionSource,
        approvalPolicy: "never",
      },
    },
    authentication: {
      epistemic: "observed",
      value: {
        command: login.command,
        exitCode: login.exitCode,
        loggedIn: login.loggedIn,
        method: login.method,
        isolation: login.isolation,
      },
    },
    episode: {
      epistemic: "observed",
      value: {
        terminal: end.type,
        commandExit,
        heartbeats: events.filter((e) => e.type === "WorkerHeartbeat").length,
        durationMs: end.occurredAt - starts[0].occurredAt,
        timeoutMs,
        isolation: record,
      },
    },
    eventStream: {
      epistemic: "observed",
      value: {
        rows: all.length,
        sha256: sha256(log),
        workerEpisodeId: episodeId,
        terminalEventId: end.eventId,
      },
    },
    protectedSurfaces: {
      epistemic: "observed",
      value: {
        codexUserConfiguration: [
          surface("codex-login-status", login.isolation),
          surface("worker-episode", record),
        ],
        unchanged: true,
      },
    },
    trustBaseline: {
      epistemic: "observed",
      value: {
        trustedEntriesBefore: before.trustedEntries,
        trustedEntriesAfter: after.trustedEntries,
        configBefore: before.config,
        configAfter: after.config,
      },
    },
  };
}

/** The receipt check: a closed, private shape whose every digest pair is
 * equal, whose homes held the auth link and were removed, whose login
 * succeeded under isolation, whose episode completed within its deadline and
 * whose protected surfaces and trust census restate the same digests. */
export function validateReceipt(receipt) {
  keys(receipt, TOP, "receipt");
  if (receipt.schemaVersion !== 1 || receipt.workOrder !== "WO-159")
    throw new Error("receipt: identity");
  if (typeof receipt.claim !== "string" || !receipt.claim)
    throw new Error("receipt: claim");
  if (PRIVATE.test(JSON.stringify(receipt)))
    throw new Error("receipt: private material");
  const launch = fact(
    receipt.launch,
    "launch-claim",
    [
      "command",
      "transport",
      "harnessVersion",
      "model",
      "effort",
      "selectionSource",
      "approvalPolicy",
    ],
    "launch",
  );
  if (launch.transport !== "codex-cli-exec")
    throw new Error("launch: the live row is a Codex episode");
  if (launch.approvalPolicy !== "never")
    throw new Error("launch: an unattended episode never prompts");
  const auth = fact(
    receipt.authentication,
    "observed",
    ["command", "exitCode", "loggedIn", "method", "isolation"],
    "authentication",
  );
  if (auth.exitCode !== 0 || auth.loggedIn !== true)
    throw new Error("authentication: codex login status failed in isolation");
  const episode = fact(
    receipt.episode,
    "observed",
    [
      "terminal",
      "commandExit",
      "heartbeats",
      "durationMs",
      "timeoutMs",
      "isolation",
    ],
    "episode",
  );
  if (episode.terminal !== "WorkerCompleted" || episode.commandExit !== 0)
    throw new Error("episode: the live episode did not complete");
  if (
    !Number.isSafeInteger(episode.durationMs) ||
    !Number.isSafeInteger(episode.timeoutMs) ||
    episode.durationMs < 0 ||
    episode.durationMs >= episode.timeoutMs
  )
    throw new Error("episode: stalled or unbounded");
  const records = [
    isolation(auth.isolation, "authentication.isolation"),
    isolation(episode.isolation, "episode.isolation"),
  ];
  if (records[0].home === records[1].home)
    throw new Error("isolation: each launch has its own home");
  // The runtime's own receipt check (WO-159): equal pairs, removed homes.
  assertCodexIsolationUnchanged(records);
  const stream = fact(
    receipt.eventStream,
    "observed",
    ["rows", "sha256", "workerEpisodeId", "terminalEventId"],
    "eventStream",
  );
  if (
    !Number.isSafeInteger(stream.rows) ||
    stream.rows < 2 ||
    !SHA.test(stream.sha256) ||
    typeof stream.workerEpisodeId !== "string" ||
    typeof stream.terminalEventId !== "string"
  )
    throw new Error("eventStream: names the episode it was built from");
  const surfaces = fact(
    receipt.protectedSurfaces,
    "observed",
    ["codexUserConfiguration", "unchanged"],
    "protectedSurfaces",
  );
  const listed = surfaces.codexUserConfiguration;
  if (
    !Array.isArray(listed) ||
    listed.length !== 2 ||
    !isDeepStrictEqual(
      listed.map((row) => row?.source),
      ["codex-login-status", "worker-episode"],
    )
  )
    throw new Error("protectedSurfaces: both launches are listed");
  records.forEach((record, index) => {
    keys(listed[index], ["source", "userConfig", "trustTable"], "surface");
    if (
      !isDeepStrictEqual(listed[index].userConfig, record.userConfig) ||
      !isDeepStrictEqual(listed[index].trustTable, record.trustTable)
    )
      throw new Error("protectedSurfaces: restates a different digest pair");
  });
  if (surfaces.unchanged !== true)
    throw new Error("protectedSurfaces: must be unchanged");
  const trust = fact(
    receipt.trustBaseline,
    "observed",
    [
      "trustedEntriesBefore",
      "trustedEntriesAfter",
      "configBefore",
      "configAfter",
    ],
    "trustBaseline",
  );
  if (
    !Number.isSafeInteger(trust.trustedEntriesBefore) ||
    trust.trustedEntriesBefore !== trust.trustedEntriesAfter ||
    !DIGEST.test(trust.configBefore) ||
    trust.configBefore !== trust.configAfter
  )
    throw new Error("trustBaseline: the trusted-project count changed");
  if (
    trust.configBefore !== records[0].userConfig.before ||
    trust.configAfter !== records[1].userConfig.after
  )
    throw new Error("trustBaseline: the census read another configuration");
  return true;
}

/** The retained stream must derive the receipt: the builder, given the stream
 * and the receipt's own bracketing observations, reproduces every field, so
 * the stream digest, row count, launch selection, episode facts and terminal
 * isolation record are each bound to the stream rather than to its syntax. */
export function matchSharedStream(receipt, log = sharedStream()) {
  const trust = receipt.trustBaseline.value;
  const derived = JSON.parse(
    JSON.stringify(
      buildReceipt({
        log,
        login: receipt.authentication.value,
        before: {
          trustedEntries: trust.trustedEntriesBefore,
          config: trust.configBefore,
        },
        after: {
          trustedEntries: trust.trustedEntriesAfter,
          config: trust.configAfter,
        },
        timeoutMs: receipt.episode.value.timeoutMs,
        commandExit: receipt.episode.value.commandExit,
        workerEpisodeId: receipt.eventStream.value.workerEpisodeId,
      }),
    ),
  );
  for (const key of TOP)
    if (!isDeepStrictEqual(derived[key], receipt[key]))
      throw new Error(
        `eventStream: the retained stream records another ${key}`,
      );
  return true;
}

function live(store) {
  if (!store || existsSync(store))
    throw new Error("--live needs a new --store directory");
  if (existsSync(LIVE_RECEIPT))
    throw new Error("a live receipt is already retained; keep it");
  const before = trustCensus();
  const login = observeLogin();
  const run = spawnSync(
    "npm",
    [
      "run",
      "dotln",
      "--silent",
      "--",
      "feedback-audit",
      "--store",
      store,
      "--transport",
      LIVE_SELECTION.transport,
      "--model",
      LIVE_SELECTION.model,
      "--effort",
      LIVE_SELECTION.effort,
    ],
    {
      cwd: ROOT,
      env: { ...process.env, DOTLN_LIVE_WORKERS: "1" },
      stdio: ["ignore", "inherit", "inherit"],
    },
  );
  const after = trustCensus();
  const receipt = buildReceipt({
    log: readFileSync(join(store, "verifier/events.jsonl"), "utf8"),
    login,
    before,
    after,
    timeoutMs: FEEDBACK_VERIFIER_LIMITS.timeoutMs,
    commandExit: run.status,
  });
  let failure = null;
  try {
    validateReceipt(receipt);
  } catch (error) {
    failure = error.message;
  }
  // A failed attempt is retained under its own name; only a valid receipt
  // takes the live path.
  let attempt = 1;
  while (existsSync(join(HERE, `live-codex-attempt-${attempt}.json`)))
    attempt++;
  const path = failure
    ? join(HERE, `live-codex-attempt-${attempt}.json`)
    : LIVE_RECEIPT;
  writeFileSync(path, JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
  console.log(
    JSON.stringify({
      feedbackAuditExit: run.status,
      receipt: path.slice(ROOT.length),
      failure,
    }),
  );
  if (failure) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [mode, flag, store] = process.argv.slice(2);
  if (mode === "--live" && flag === "--store") live(store);
  else if (mode === "--check" && !flag) {
    const receipt = JSON.parse(readFileSync(LIVE_RECEIPT, "utf8"));
    validateReceipt(receipt);
    matchSharedStream(receipt);
    console.log(
      "WO-159 live receipt validated; the retained feedback verifier stream derives it",
    );
  } else
    throw new Error(
      "usage: receipt.mjs --live --store <new directory> | --check",
    );
}
