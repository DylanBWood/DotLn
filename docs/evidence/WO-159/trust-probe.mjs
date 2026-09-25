#!/usr/bin/env node
// WO-159 trust probe: does the Codex CLI still write a project trust entry
// when launched with WO-111's source-change prefix (-a never exec --ephemeral
// --ignore-user-config --sandbox workspace-write --cd <scratch Git root>), and
// does the isolated home keep it out of the operator's configuration? One
// low-effort one-word episode through the launcher. Retains booleans, counts,
// digests and token usage only.
//
//   node docs/evidence/WO-159/trust-probe.mjs --write
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
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
  codexDigestPairEqual,
  codexExecArgv,
  codexTrustTable,
  startCodexEpisode,
} from "../../../packages/skeleton/dist/src/worker-transport.js";
import { trustCensus } from "./receipt.mjs";

const OUT = fileURLToPath(new URL("trust-probe.json", import.meta.url));
if (process.argv[2] !== "--write" || process.argv.length !== 3)
  throw new Error("usage: trust-probe.mjs --write");
if (existsSync(OUT)) throw new Error("retain the trust probe; it exists");

const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-wo159-trust-probe-")),
);
const git = (...args) =>
  execFileSync("git", args, {
    cwd: scratch,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null" },
  });
git("init", "--quiet", "-b", "probe");
writeFileSync(join(scratch, "fixture.txt"), "synthetic trust probe\n");
git("add", "fixture.txt");
git(
  "-c",
  "user.name=Fixture",
  "-c",
  "user.email=fixture@example.invalid",
  "commit",
  "--quiet",
  "-m",
  "Synthetic trust probe base",
);
const prompt =
  "Reply with exactly the single word TRUST_PROBE_OK and nothing else. Use no tools.";
const args = codexExecArgv({
  approval: "never",
  rest: [
    "--sandbox",
    "workspace-write",
    "--model",
    "gpt-6-sol",
    "-c",
    'model_reasoning_effort="low"',
    "--cd",
    scratch,
    "--json",
    prompt,
  ],
});
const before = trustCensus();
const episode = startCodexEpisode();
const home = episode.env.CODEX_HOME;
const started = Date.now();
let run;
let trustsScratch = false;
try {
  run = spawnSync("codex", args, {
    cwd: scratch,
    env: episode.env,
    encoding: "utf8",
    timeout: 180_000,
    maxBuffer: 16 * 1024 * 1024,
  });
  // Read before the home is removed; only a boolean leaves this process.
  const isolated = join(home, "config.toml");
  trustsScratch =
    existsSync(isolated) &&
    codexTrustTable(readFileSync(isolated, "utf8")).includes(scratch);
} finally {
  episode.finish();
}
const durationMs = Date.now() - started;
const isolation = episode.finish();
const after = trustCensus();
const events = (run.stdout ?? "").split("\n").flatMap((line) => {
  try {
    return [JSON.parse(line)];
  } catch {
    return [];
  }
});
const message = events
  .filter(
    (e) => e.type === "item.completed" && e.item?.type === "agent_message",
  )
  .at(-1)?.item?.text;
const usage = events.filter((e) => e.type === "turn.completed").at(-1)?.usage;
rmSync(scratch, { recursive: true, force: true });
const record = {
  schemaVersion: 1,
  workOrder: "WO-159",
  question:
    "With WO-111's source-change launch prefix, does the Codex CLI write a project trust entry, and does the isolated home keep it out of the user-level configuration?",
  launch: {
    epistemic: "launch-claim",
    value: {
      shape:
        '-a never exec --ephemeral --ignore-user-config --sandbox workspace-write --model gpt-6-sol -c model_reasoning_effort="low" --cd <scratch Git root> --json <one-word prompt>',
      harnessVersion:
        execFileSync("codex", ["--version"], { encoding: "utf8" }).match(
          /\d+\.\d+\.\d+/u,
        )?.[0] ?? "unknown",
    },
  },
  episode: {
    epistemic: "observed",
    value: {
      exitCode: run.status,
      timedOut: run.error?.code === "ETIMEDOUT",
      durationMs,
      replied:
        typeof message === "string" && message.trim() === "TRUST_PROBE_OK",
      usage: usage
        ? {
            inputTokens: usage.input_tokens ?? null,
            cachedInputTokens: usage.cached_input_tokens ?? null,
            outputTokens: usage.output_tokens ?? null,
          }
        : null,
    },
  },
  isolatedTrust: {
    epistemic: "observed",
    value: {
      isolatedTrustEntries: isolation.isolatedTrustEntries,
      entryNamesTheScratchTarget: trustsScratch,
    },
  },
  isolation,
  userConfiguration: {
    epistemic: "observed",
    value: {
      userConfigEqual: codexDigestPairEqual(isolation.userConfig),
      trustTableEqual: codexDigestPairEqual(isolation.trustTable),
      trustedEntriesBefore: before.trustedEntries,
      trustedEntriesAfter: after.trustedEntries,
    },
  },
};
writeFileSync(OUT, JSON.stringify(record, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ ...record, isolation: undefined }));
