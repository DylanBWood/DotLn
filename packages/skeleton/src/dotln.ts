#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { decodeLog } from "@dotln/kernel";
import { WorkerStore } from "./worker-store.js";
import { projectWorkerStatus, renderWorkerStatus } from "./worker-status.js";
import { runWorkerDemo } from "./worker-demo.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
} from "./worker-transport.js";
import { WorkerFailure, type WorkerEffort } from "./worker-protocol.js";
import type { FixtureTree } from "./scenario.js";
import { runVerificationDemo } from "./verification-demo.js";
import { FakeVerificationTransport } from "./verification-fake.js";
import { runFeedbackSelfhost } from "./feedback-selfhost.js";
import { harnessControl } from "./harness-host.js";
import {
  recordUsageObservation,
  type usageObservation,
} from "./usage-observation.mjs";

const args = process.argv.slice(2);
const command = args.shift();
const options = new Map<string, string>();
const switches = new Set<string>();
try {
  while (args.length) {
    const key = args.shift()!;
    if (["--json", "--beacons"].includes(key)) {
      if (switches.has(key)) throw new Error("duplicate option");
      switches.add(key);
    } else {
      if (
        !["--store", "--transport", "--model", "--effort"].includes(key) ||
        options.has(key)
      )
        throw new Error("unknown or duplicate option");
      const value = args.shift();
      if (!value || value.startsWith("--"))
        throw new Error("missing option value");
      options.set(key, value);
    }
  }
  const directory = options.get("--store");
  if (!directory)
    throw new Error(
      "usage: dotln status --store <directory> [--json] | dotln demo --store <directory> --transport <claude-cli-print|codex-cli-exec> --model <model> --effort <level> [--beacons] | dotln <verify-demo|feedback-audit> --store <directory> [--transport fake|claude-cli-print|codex-cli-exec --model <model> --effort <level>]",
    );
  if (command === "status") {
    if (options.size !== 1 || switches.has("--beacons"))
      throw new Error("status accepts only --store and --json");
    const status = projectWorkerStatus(
      decodeLog(new WorkerStore(directory).read()),
    );
    console.log(
      switches.has("--json")
        ? JSON.stringify(status, null, 2)
        : renderWorkerStatus(status),
    );
  } else if (command === "verify-demo" || command === "feedback-audit") {
    if (switches.size > 0) throw new Error("demo requires no switches");
    const transportName = options.get("--transport") ?? "fake";
    const model =
      options.get("--model") ?? (transportName === "fake" ? "synthetic" : "");
    const effort =
      options.get("--effort") ?? (transportName === "fake" ? "unknown" : "");
    if (
      !["fake", "claude-cli-print", "codex-cli-exec"].includes(transportName) ||
      !model ||
      !["low", "medium", "high", "xhigh", "max", "unknown"].includes(effort)
    )
      throw new Error("demo requires an explicit transport, model and effort");
    if (transportName !== "fake" && process.env.DOTLN_LIVE_WORKERS !== "1")
      throw new Error(
        "live demo requires DOTLN_LIVE_WORKERS=1 on an authenticated runner that permits child CLI execution",
      );
    const startedAt = new Date().toISOString();
    const owner =
      command === "feedback-audit" &&
      existsSync(join(process.cwd(), "docs/control/budgets.json"))
        ? harnessControl(process.cwd()).workOrder
        : null;
    const onUsage = owner
      ? (observation: ReturnType<typeof usageObservation>) =>
          recordUsageObservation(process.cwd(), {
            workOrder: owner,
            role: "verifier",
            startedAt,
            durationMs: Date.now() - Date.parse(startedAt),
            observation,
          })
      : undefined;
    const transport =
      transportName === "fake"
        ? new FakeVerificationTransport()
        : transportName === "claude-cli-print"
          ? new ClaudeCliPrintWorkOrderTransport(undefined, undefined, onUsage)
          : new CodexCliExecWorkOrderTransport(undefined, undefined, onUsage);
    if (command === "feedback-audit") {
      const result = await runFeedbackSelfhost({
        root: process.cwd(),
        directory,
        transport,
        model,
        effort: effort as WorkerEffort,
      });
      console.log(
        JSON.stringify({
          workOrderId: result.workOrder.workOrderId,
          phase: result.matrix.phase,
          fixtures: result.report.fixtures.length,
          savedInstructionBytes: result.report.context.savedBytes,
          verifier: transport.name,
        }),
      );
      if (!result.complete) process.exitCode = 1;
    } else {
      const result = await runVerificationDemo({
        directory,
        transport,
        model,
        effort: effort as WorkerEffort,
      });
      console.log(JSON.stringify(result.envelope));
      if (result.matrix.phase !== "complete") process.exitCode = 1;
    }
  } else if (command === "demo") {
    if (process.env.DOTLN_LIVE_WORKERS !== "1")
      throw new Error(
        "live demo requires DOTLN_LIVE_WORKERS=1 on an authenticated runner that permits child CLI execution",
      );
    const transportName = options.get("--transport");
    const model = options.get("--model");
    const effort = options.get("--effort");
    if (
      !model ||
      !effort ||
      !["low", "medium", "high", "xhigh", "max", "unknown"].includes(effort) ||
      !["claude-cli-print", "codex-cli-exec"].includes(transportName ?? "") ||
      switches.has("--json")
    )
      throw new Error("demo requires an explicit transport, model and effort");
    const transport =
      transportName === "claude-cli-print"
        ? new ClaudeCliPrintWorkOrderTransport()
        : new CodexCliExecWorkOrderTransport();
    const fixture = JSON.parse(
      readFileSync(
        new URL("../../fixtures/repo-tree.json", import.meta.url),
        "utf8",
      ),
    ) as FixtureTree;
    const result = await runWorkerDemo({
      directory,
      fixture,
      transport,
      model,
      effort: effort as WorkerEffort,
      beacons: switches.has("--beacons"),
    });
    // The dispatching session sees exactly the compact envelope, never CLI logs.
    console.log(JSON.stringify(result.envelope));
    if (result.envelope.status !== "completed") process.exitCode = 1;
  } else
    throw new Error("expected status, demo, verify-demo or feedback-audit");
} catch (error) {
  // Unexpected external diagnostics may contain paths or auth details.
  console.error(
    error instanceof WorkerFailure
      ? `worker refused: ${error.code}; pending work is retained`
      : error instanceof Error &&
          /^(usage:|live demo requires|demo requires|expected |status accepts|unknown or duplicate|missing option|duplicate option)/u.test(
            error.message,
          )
        ? error.message
        : "worker host refused; inspect the store and declared environment before retrying",
  );
  process.exitCode = 1;
}
