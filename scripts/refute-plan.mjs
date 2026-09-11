#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  buildPlanSubject,
  PLAN_LEDGER,
  planningPasses,
} from "./lib/plan-subject.mjs";
import {
  checkPlanGate,
  overridePlanHold,
  readReceipts,
  writePlanReceipt,
} from "./lib/plan-receipts.mjs";
import { containedRegularFile } from "./lib/paths.mjs";
import { runGit } from "./lib/git.mjs";
import { parseActor } from "./resume.mjs";
import {
  beginDirectRefutation,
  fileDirectRefutation,
} from "./lib/plan-direct.mjs";
import {
  planningFollowups,
  syncFollowups,
  disposeFollowup,
  readFollowups,
} from "./lib/planning-followups.mjs";

const toolRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const usage =
  "plan subject | check | refute [--slug <label>] [--transport claude-cli-print|codex-cli-exec|fake] [--model <model>] [--effort <level>] [--dispositions <file>] [--evidence-only] | override <receipt-id> <hold-id> <reason> --capture <ignored-intake-file> --capture-hash sha256:<digest> <actor-flags>";
const options = (args, allowed) => {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (!allowed.includes(key) || key in out) throw new Error(usage);
    if (["--evidence-only", "--direct"].includes(key)) out[key] = true;
    else {
      const value = args[++i];
      if (!value || value.startsWith("--")) throw new Error(usage);
      out[key] = value;
    }
  }
  return out;
};

export async function main(args = process.argv.slice(2), root = toolRoot) {
  if (runGit(root, ["rev-parse", "--show-toplevel"]) !== root)
    throw new Error("plan command must use its Git root");
  const [command, ...rest] = args;
  if (command === "followups") {
    if (rest.length === 1 && rest[0] === "--sync") {
      syncFollowups(root);
      return planningFollowups(root);
    }
    if (rest.length === 2 && rest[0] === "--apply") {
      const path = resolve(root, rest[1]);
      if (!containedRegularFile(path, root))
        throw new Error("Follow-up request must be a contained regular file");
      return disposeFollowup(root, JSON.parse(readFileSync(path, "utf8")));
    }
    if (rest.length === 2 && rest[0] === "--show") {
      syncFollowups(root, { check: true });
      const entry = readFollowups(root).entries.find(
        (row) => row.id === rest[1],
      );
      if (!entry) throw new Error("Unknown follow-up identifier");
      return entry;
    }
    const all = rest[0] === "--all";
    const flags = all ? rest.slice(1) : rest;
    if (flags.length && !(flags.length === 2 && flags[0] === "--cursor"))
      throw new Error(
        "usage: plan followups [--all] [--cursor <cursor>] | --sync | --show <FUP-id> | --apply <request.json>",
      );
    return planningFollowups(root, { all, cursor: flags[1] ?? null });
  }
  if (command === "start") {
    if (rest.length !== 1 || !/^[a-z][a-z0-9-]{0,60}$/.test(rest[0]))
      throw new Error("usage: plan start <slug>");
    if (
      runGit(root, ["symbolic-ref", "--short", "HEAD"]) !== "main" ||
      runGit(root, ["status", "--porcelain"])
    )
      throw new Error("plan start requires clean main");
    const followups = planningFollowups(root);
    const branch = `planning/${new Date().toISOString().slice(0, 10)}-${rest[0]}`;
    runGit(root, ["switch", "-c", branch]);
    return {
      branch,
      phase: "planning",
      authority: "document-only planning dispatch",
      followups,
    };
  }
  if (command === "receipt") {
    const [result, ...flags] = rest;
    const opt = options(flags, ["--statement", "--dispositions"]);
    if (!result || !opt["--statement"])
      throw new Error(
        "usage: plan receipt <result.json> --statement <statement.txt> [--dispositions <file>]",
      );
    let dispositions = [];
    if (opt["--dispositions"]) {
      const path = resolve(root, opt["--dispositions"]);
      if (!containedRegularFile(path, root))
        throw new Error("dispositions must be a contained regular file");
      dispositions = JSON.parse(readFileSync(path, "utf8"));
    }
    return fileDirectRefutation(root, result, opt["--statement"], {
      dispositions,
    });
  }
  if (command === "subject" && !rest.length) return buildPlanSubject(root);
  if (command === "check" && !rest.length) {
    syncFollowups(root, { check: true });
    return checkPlanGate(root);
  }
  if (command === "override") {
    const [receiptId, holdId, reason, ...flags] = rest;
    const opt = options(flags, [
      "--capture",
      "--capture-hash",
      "--harness",
      "--harness-version",
      "--model",
      "--effort",
      "--source",
      "--account-label",
    ]);
    const actorArgs = Object.entries(opt)
      .filter(([key]) => !["--capture", "--capture-hash"].includes(key))
      .flat();
    // Share the lifecycle parser, including observed-version effort checks and
    // WO-031's explicit flag / acting-session environment account label.
    const actor = parseActor("plan override", actorArgs);
    const event = await overridePlanHold(root, {
      receiptId,
      holdId,
      reason,
      actor,
      capture: opt["--capture"],
      captureHash: opt["--capture-hash"],
    });
    return {
      type: event.type,
      receiptId,
      holdId,
      recordedAt: event.recordedAt,
      actor: event.actor,
    };
  }
  if (command !== "refute") throw new Error(usage);
  const opt = options(rest, [
    "--slug",
    "--transport",
    "--model",
    "--effort",
    "--dispositions",
    "--evidence-only",
    "--direct",
    "--scope",
  ]);
  if (opt["--direct"]) {
    if (Object.keys(opt).some((key) => !["--direct", "--scope"].includes(key)))
      throw new Error(
        "Direct refutation uses the receiving session; only --scope is accepted",
      );
    return beginDirectRefutation(root, { scope: opt["--scope"] ?? "pass" });
  }
  if (opt["--scope"] && opt["--scope"] !== "full")
    throw new Error(
      "Pass-scoped refutation uses --direct; the external transport judges the full horizon",
    );
  const subject = buildPlanSubject(root);
  const passes = planningPasses(readFileSync(join(root, PLAN_LEDGER), "utf8"));
  const latest = passes.sort((a, b) => b.date.localeCompare(a.date))[0];
  const pass = opt["--evidence-only"]
    ? {
        id: `evidence-${opt["--slug"] ?? "plan-refutation"}`,
        kind: "evidence",
        heading: null,
      }
    : latest && { id: latest.id, kind: "planning", heading: latest.heading };
  if (!pass) throw new Error("no dated planning-pass ledger heading");
  if (
    pass.kind === "planning" &&
    buildPlanSubject(root, "HEAD", { workspace: true }).hash !== subject.hash
  )
    throw new Error(
      "commit the planning subject before refutation; draft bytes cannot enter a committed-only brief",
    );
  const history = (await readReceipts(root)).filter(
    (receipt) => receipt.pass.id === pass.id,
  );
  if (history.at(-1)?.subject.hash === subject.hash)
    throw new Error("same subject cannot be re-rolled");
  const tail = history.slice(-3);
  if (
    tail.length === 3 &&
    tail.every(
      (item) =>
        item.result.planVerdict === "hold" &&
        item.subject.orders.map(({ workOrderId }) => workOrderId).join(",") ===
          tail[0].subject.orders
            .map(({ workOrderId }) => workOrderId)
            .join(","),
    )
  )
    throw new Error(
      "third consecutive hold stops this planning pass; operator override or next pass required",
    );
  let dispositions = [];
  if (opt["--dispositions"]) {
    const file = resolve(root, opt["--dispositions"]);
    if (!containedRegularFile(file, root))
      throw new Error("dispositions must be a contained regular file");
    try {
      dispositions = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      throw new Error("invalid disposition JSON");
    }
  }
  const { runPlanRefutation } =
    await import("../packages/skeleton/dist/src/plan-refutation-host.js");
  const { ClaudeCliPrintWorkOrderTransport, CodexCliExecWorkOrderTransport } =
    await import("../packages/skeleton/dist/src/worker-transport.js");
  const { FakePlanRefutationTransport } =
    await import("../packages/skeleton/dist/src/plan-refutation-fake.js");
  const name = opt["--transport"] ?? "claude-cli-print";
  const { recordUsageObservation } =
    await import("../packages/skeleton/src/usage-observation.mjs");
  const startedAt = new Date().toISOString();
  const onUsage = (observation) =>
    recordUsageObservation(root, {
      workOrder: null,
      role: "refuter",
      dispatch: pass.id,
      startedAt,
      durationMs: Date.now() - Date.parse(startedAt),
      observation,
    });
  const transport =
    name === "claude-cli-print"
      ? new ClaudeCliPrintWorkOrderTransport(undefined, undefined, onUsage)
      : name === "codex-cli-exec"
        ? new CodexCliExecWorkOrderTransport(undefined, undefined, onUsage)
        : name === "fake"
          ? new FakePlanRefutationTransport()
          : null;
  if (!transport) throw new Error("unknown plan transport");
  const model =
    opt["--model"] ??
    (name === "claude-cli-print"
      ? "claude-fable-5-1"
      : name === "codex-cli-exec"
        ? "gpt-6-astra"
        : "fixture");
  const effort =
    opt["--effort"] ?? (name === "codex-cli-exec" ? "unknown" : "max");
  if (!["low", "medium", "high", "xhigh", "max", "unknown"].includes(effort))
    throw new Error("unsupported plan effort");
  const episode = await runPlanRefutation(subject, transport, model, effort);
  const receipt = await writePlanReceipt(root, {
    pass,
    slug: opt["--slug"] ?? pass.id,
    subject,
    episode,
    dispositions,
  });
  return {
    receipt: `docs/planning/refutations/${receipt.receiptId}.md`,
    subjectHash: subject.hash,
    verdict: receipt.result.planVerdict,
    holds: receipt.holds.map(({ id, workOrderId, criterionId }) => ({
      id,
      workOrderId,
      criterionId,
    })),
    localTerms: receipt.localTerms.status,
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main()
    .then((result) =>
      process.stdout.write(
        `${typeof result === "string" ? result : JSON.stringify(result, null, 2)}\n`,
      ),
    )
    .catch((error) => {
      // Worker failures carry sanitized codes, never raw model/CLI output.
      console.error(
        error instanceof Error ? error.message : "plan command failed",
      );
      process.exitCode = 1;
    });
}
