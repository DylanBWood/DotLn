#!/usr/bin/env node
import { mkdirSync, readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";
import {
  emitHarness,
  checkHarness,
  emitTargetHarness,
  checkTargetHarness,
  removeTargetHarness,
} from "./lib/harness.mjs";
import {
  beginGateRun,
  requestGateStop,
} from "../packages/skeleton/dist/src/gate-evidence.mjs";
import {
  harnessRoot,
  harnessOutputReadArgs,
  harnessWriterView,
  readHarnessOutput,
  releaseHarnessWriterByOperator,
  runHarnessEvidence,
  beginHarnessSession,
  harnessSessionScratch,
  observeHarnessSession,
  observeHarnessDelivery,
  measureHarnessUsage,
} from "../packages/skeleton/dist/src/harness-host.js";

async function optionalCurrentSession(root, sessionId) {
  try {
    const { currentHarnessSessionReport } =
      await import("./lib/harness-runtime.mjs");
    return (await currentHarnessSessionReport(root, { sessionId })).session;
  } catch {
    return {
      available: false,
      source: "unavailable",
      reason: "Current harness session reader could not be loaded",
    };
  }
}

const usage =
  "usage: harness emit|check [--loadout contributor] [--profile id] [--out dir] | harness emit|check|remove --target worktree [--runtime-root launchpad] [--profile target-worker-claude|target-worker-codex] | harness evidence [--stop|--fail] | harness usage <session> | harness read-output <path> [--offset <byte>] [--length <bytes>] | harness prune [--apply] | harness writer --show | harness writer --release [--force]";
try {
  const root = harnessRoot(process.cwd());
  const [action, ...args] = process.argv.slice(2);
  if (action === "prune") {
    if (args.length > 1 || (args.length === 1 && args[0] !== "--apply"))
      throw new Error("usage: harness prune [--apply]");
    const { pruneHarness } = await import("./lib/harness-prune.mjs");
    console.log(
      JSON.stringify(
        pruneHarness(root, { apply: args[0] === "--apply" }),
        null,
        2,
      ),
    );
  } else if (action === "scratch") {
    if (args.length > 1) throw new Error("usage: harness scratch [session]");
    const session =
      args[0] ??
      (process.env.CODEX_THREAD_ID || process.env.COPILOT_AGENT_SESSION_ID);
    if (!session)
      throw new Error(
        "Use the scratch path printed at role dispatch, or pass the host session ID",
      );
    console.log(harnessSessionScratch(session));
  } else if (action === "begin") {
    const [session, role, flag, file] = args;
    if (
      !session ||
      !role ||
      (flag && !["--adopt-current", "--adopt-file"].includes(flag)) ||
      args.length > (flag === "--adopt-file" ? 4 : 3) ||
      (flag === "--adopt-file" && !file)
    )
      throw new Error(
        "usage: harness begin <session> <role> [--adopt-current|--adopt-file <authored-paths.json>]",
      );
    const adopted =
      flag === "--adopt-file"
        ? JSON.parse(readFileSync(resolve(root, file), "utf8"))
        : flag === "--adopt-current";
    if (flag === "--adopt-file" && !Array.isArray(adopted))
      throw new Error("Authorship adoption must be an explicit path array");
    console.log(
      JSON.stringify({
        ...beginHarnessSession(root, session, role, adopted),
        ...(process.env.CODEX_THREAD_ID || process.env.COPILOT_AGENT_SESSION_ID
          ? { currentSession: await optionalCurrentSession(root, session) }
          : {}),
      }),
    );
  } else if (action === "usage") {
    if (args.length !== 1) throw new Error("usage: harness usage <session>");
    console.log(
      JSON.stringify({
        ...measureHarnessUsage(root, args[0]),
        ...(process.env.CODEX_THREAD_ID || process.env.COPILOT_AGENT_SESSION_ID
          ? { currentSession: await optionalCurrentSession(root, args[0]) }
          : {}),
      }),
    );
  } else if (action === "observe") {
    if (args.length !== 1) throw new Error("usage: harness observe <session>");
    console.log(JSON.stringify(observeHarnessSession(root, args[0])));
  } else if (action === "delivered") {
    if (args.length !== 1)
      throw new Error(
        "usage: harness delivered <session> (actual reader stdout on stdin)",
      );
    observeHarnessDelivery(root, args[0], readFileSync(0, "utf8"));
    console.log("Recorded current-byte tool delivery");
  } else if (action === "read-output") {
    const request = harnessOutputReadArgs(args);
    console.log(
      JSON.stringify(
        readHarnessOutput(root, request.path, request.offset, request.length),
      ),
    );
  } else if (action === "writer") {
    // `--show` is a bounded metadata read; `--release` is an operator action
    // that a governed session's own writer guard still judges.
    const [mode, ...flags] = args;
    const force = flags.includes("--force");
    if (
      !["--show", "--release"].includes(mode) ||
      flags.some((flag) => flag !== "--force") ||
      (mode === "--show" && force)
    )
      throw new Error(usage);
    console.log(
      JSON.stringify(
        mode === "--show"
          ? harnessWriterView(root)
          : releaseHarnessWriterByOperator(root, force),
      ),
    );
  } else if (action === "evidence" && args[0] === "--stop") {
    // The session that started a gate ends it here, in Claude and Codex
    // alike, without an operator step: every live gate process in this
    // worktree reads the request at its next boundary, ends its running
    // suites, records no check and releases its marker.
    if (args.length !== 1)
      throw new Error("harness evidence --stop accepts no other arguments");
    const outcome = requestGateStop(root);
    console.log(JSON.stringify(outcome));
    const label = (run) => `${run.command} (run ${run.runId}, pid ${run.pid})`;
    if (!outcome.requested.length)
      console.log("No active gate in this worktree; nothing to stop.");
    else if (outcome.active.length) {
      console.log(
        `Stop requested; still running: ${outcome.active.map(label).join("; ")}. Each stops at its next boundary and records no check; run this command again to keep waiting.`,
      );
      process.exitCode = 1;
    } else
      console.log(
        `Stopped ${outcome.stopped.map(label).join("; ")}; no check was recorded.`,
      );
  } else {
    if (action === "evidence") {
      const failOnly = args.length === 1 && args[0] === "--fail";
      if (args.length && !failOnly)
        throw new Error(
          "harness evidence accepts no override other than --fail",
        );
      const active = beginGateRun(root, "node scripts/harness.mjs evidence");
      try {
        const { prepareHarnessEvidence } =
          await import("./lib/evidence-preparation.mjs");
        const preparation = prepareHarnessEvidence(root);
        console.log(
          `Prepared owned evidence projections in ${preparation.durationMs.toFixed(1)} ms`,
        );
        if (active.stopRequested())
          throw new Error(
            "Gate stopped by request after preparation; no check recorded",
          );
        const checks = runHarnessEvidence(root, failOnly ? "fail" : undefined);
        console.log(JSON.stringify({ checks }));
        if (checks.some((check) => check.exitCode !== 0 || !check.executed))
          process.exitCode = 1;
        else
          console.log(
            "Final evidence passed. Keep tracked reports at their stated measurement cutoff; gate results remain in docs/control/local/harness/checks.json and usage in docs/control/local/process/usage.jsonl. Read current outputs, record the lifecycle result, refresh its index once and hand off. Report final timings and counters in the response; do not edit reports or rerun generation and the gate solely to copy these results.",
          );
      } finally {
        active.release();
      }
    } else {
      if (!["emit", "check", "remove"].includes(action)) throw new Error(usage);
      const options = {};
      for (let index = 0; index < args.length; index += 2) {
        if (
          ![
            "--loadout",
            "--profile",
            "--out",
            "--target",
            "--runtime-root",
          ].includes(args[index]) ||
          !args[index + 1] ||
          options[args[index].slice(2)]
        )
          throw new Error(usage);
        options[args[index].slice(2)] = args[index + 1];
      }
      if (options.target) {
        if (options.out || options.loadout)
          throw new Error("target does not accept --out or --loadout");
        const operation = {
          emit: emitTargetHarness,
          check: checkTargetHarness,
          remove: removeTargetHarness,
        }[action];
        const result = operation(resolve(root, options.target), {
          profile: options.profile,
          runtimeRoot: resolve(root, options["runtime-root"] ?? "."),
        });
        console.log(`harness ${action}: ${result.files} target surfaces`);
      } else {
        if (action === "remove" || options["runtime-root"])
          throw new Error("remove and --runtime-root require --target");
        const out = resolve(root, options.out ?? ".");
        if (action === "emit") mkdirSync(out, { recursive: true });
        options.termsRoot = root;
        options.instructionFloor = readFileSync(
          resolve(root, "CLAUDE.md"),
          "utf8",
        );
        const result =
          action === "emit"
            ? emitHarness(realpathSync(out), options)
            : checkHarness(realpathSync(out), options);
        console.log(
          `harness ${action}: ${result.files} generated surfaces; local-terms list: ${result.localTerms.status}`,
        );
      }
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
