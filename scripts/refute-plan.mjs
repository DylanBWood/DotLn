#!/usr/bin/env node
import { json as prettyJson } from "./lib/helpers.mjs";
import { docPath, docRelative, findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";

import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, relative, resolve, sep } from "node:path";

import { buildPlanSubject } from "./lib/plan-subject.mjs";
import {
  checkPlanGate,
  overridePlanHold,
  disposePlanHold,
  amendPlanOrder,
  withdrawPlanAmendment,
  requireChangedPlanEvidence,
  readReceipts,
  writePlanReceipt,
} from "./lib/plan-receipts.mjs";
import { containedRegularFile } from "./lib/paths.mjs";
import { failureOf, runGit, shellQuote, spawnGit } from "./lib/git.mjs";
import { TRANSPORT_DEFAULTS } from "./lib/entropy-review.mjs";
import { prospectiveRealpath } from "./lib/gate-evidence.mjs";
import {
  branchWorkOrder,
  readControl,
  selectWorkOrder,
} from "./lib/control-store.mjs";
import { reportHarnessRuntime } from "./lib/harness-runtime.mjs";
import { parseActor } from "./resume.mjs";
import {
  beginDirectRefutation,
  fileDirectRefutation,
  latestPlanningPass,
} from "./lib/plan-direct.mjs";
import {
  planningFollowups,
  syncFollowups,
  disposeFollowup,
  disposeFollowups,
  readFollowups,
  changedAgainstMain,
  touchingFollowups,
  exportFollowups,
} from "./lib/planning-followups.mjs";
import {
  exportFailures,
  failuresAtStart,
  isFailuresExport,
  planningFailures,
} from "./lib/plan-failures.mjs";

import {
  planningConditions,
  renderPlanningConditions,
  conditionsAtStart,
} from "./lib/planning-conditions.mjs";

const toolRoot = findLaunchpad();
const usage =
  "plan subject | check | conditions [--slow] | failures […] | refute [--direct] [--scope pass|full] | refute --transport claude-cli-print|codex-cli-exec|fake [--slug <label>] [--model <model>] [--effort <level>] [--dispositions <file>] [--evidence-only] | dispose <receipt-id> <hold-id> <reason> | amend-order <WO-NNN> <WO-NNN-DNNN> <operator-authorization reason> | amend-order <WO-NNN> --withdraw <row-ordinal> <reason> | override <receipt-id> <hold-id> <reason> --capture <ignored-intake-file> --capture-hash sha256:<digest> [actor-flags]";
const followupsUsage =
  "usage: plan followups [--all] [--cursor <cursor>] | --sync | --show <FUP-id> | --apply <request.json or batch.json> | --touching [<path or WO-NNN>…] [--cursor <cursor>] | --touching --work-order <WO-NNN> [--cursor <cursor>] | --export <file> [--all]";
const failuresUsage =
  "usage: plan failures [--all | --since <time>] [--until <time>] [--cursor <cursor>] | failures --export <file> [--all | --since <time>] [--until <time>]";
const followupExport = {
  label: "Follow-up export",
  written: (previous) =>
    typeof previous?.revision === "string" &&
    ["pending", "all"].includes(previous.showing) &&
    Array.isArray(previous.rows),
  other: "a follow-up export",
};
const failuresExport = {
  label: "Failures export",
  written: isFailuresExport,
  other: "a failures export",
};
// A command has no session identity, so it judges the two roots it can
// resolve by itself, on physical paths: inside the checkout only the ignored
// local control lane, outside it only the system temporary directory, which
// holds DotLn session scratch, and there no other checkout or Git directory.
// An existing file is replaced only when an export of the same kind wrote it.
// Names the lane's own tools read are never export targets, even before they
// exist.
const RESERVED_LANE_NAMES = [
  "terms.txt",
  "entropy",
  "resident",
  "authority-grants.json",
  "adjacent-work.jsonl",
  "plan",
  "refutations",
  "process",
  "derived-orders",
  "integration.json",
  "harness",
  "cache",
  "retained",
];
// A temporary destination lies outside every repository. Inside one, Git
// prints a `true` line; outside any, it exits 128 with its not-a-repository
// message. Every other failure leaves the destination unjudged and refused.
function outsideRepository(parent, kind) {
  const probe = spawnGit(
    ["-C", parent, "rev-parse", "--is-inside-work-tree", "--is-inside-git-dir"],
    { encoding: "utf8", env: { ...process.env, LC_ALL: "C" } },
  );
  if (probe.status === 0) return !/true/.test(probe.stdout);
  if (
    !probe.error &&
    probe.status === 128 &&
    /^fatal: not a git repository/mu.test(probe.stderr ?? "")
  )
    return true;
  throw new Error(
    `${kind.label} destination cannot be judged: git rev-parse failed: ${failureOf(probe)}`,
  );
}
function exportDestination(root, name, kind = followupExport) {
  const path = prospectiveRealpath(resolve(root, name));
  const within = (granted) =>
    path.startsWith(`${prospectiveRealpath(granted)}${sep}`);
  let parent = dirname(path);
  while (!existsSync(parent)) parent = dirname(parent);
  const lane = prospectiveRealpath(docPath(root, "control", "local"));
  if (
    !(within(root)
      ? within(lane) &&
        spawnGit(["-C", root, "check-ignore", "-q", "--", path], {
          encoding: "utf8",
        }).status === 0
      : within(tmpdir()) && outsideRepository(parent, kind))
  )
    throw new Error(
      `${kind.label} destination must be a file under the system temporary directory or the ignored local control lane`,
    );
  if (!existsSync(path)) {
    const local = within(lane) ? relative(lane, path).split(sep) : [];
    if (local.length && RESERVED_LANE_NAMES.includes(local[0]))
      throw new Error(
        `${kind.label} destination ${local.join("/")} is a name the local control lane reserves; name another file`,
      );
    return path;
  }
  if (!lstatSync(path).isFile())
    throw new Error(`${kind.label} destination is not a regular file`);
  let previous;
  try {
    previous = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    // Not JSON: not an export.
  }
  if (!kind.written(previous))
    throw new Error(
      `${kind.label} destination exists and is not ${kind.other}; name a new file`,
    );
  return path;
}
// A new file renamed into place: a name that shares its bytes with another is
// replaced, never written through.
function writeExport(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, prettyJson(value), { flag: "wx" });
  try {
    renameSync(temporary, path);
  } catch (error) {
    rmSync(temporary, { force: true });
    throw error;
  }
}
// `plan failures` takes at most one of each flag; `--all` and `--since`
// exclude each other, and an export writes no page cursor (WO-172).
function failuresOptions(rest) {
  const flags = {};
  for (let i = 0; i < rest.length; i++) {
    const key = rest[i];
    if (key === "--all" && !flags.all) {
      flags.all = true;
      continue;
    }
    if (
      !["--since", "--until", "--cursor", "--export"].includes(key) ||
      key in flags ||
      !rest[i + 1] ||
      rest[i + 1].startsWith("--")
    )
      throw new Error(failuresUsage);
    flags[key] = rest[++i];
  }
  if (
    (flags.all && flags["--since"]) ||
    (flags["--export"] && flags["--cursor"])
  )
    throw new Error(failuresUsage);
  return {
    window: {
      all: Boolean(flags.all),
      since: flags["--since"] ?? null,
      until: flags["--until"] ?? null,
    },
    cursor: flags["--cursor"] ?? null,
    export: flags["--export"] ?? null,
  };
}
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
      const request = JSON.parse(readFileSync(path, "utf8"));
      return Array.isArray(request)
        ? disposeFollowups(root, request)
        : disposeFollowup(root, request);
    }
    if (rest[0] === "--touching") {
      // Terms first, then at most one of each flag with its value.
      const terms = [],
        flags = {};
      for (let i = 1; i < rest.length; i++) {
        const flag = ["--cursor", "--work-order"].includes(rest[i]);
        if (
          flag
            ? rest[i] in flags || !rest[i + 1] || rest[i + 1].startsWith("-")
            : rest[i].startsWith("-") || Object.keys(flags).length
        )
          throw new Error(followupsUsage);
        if (flag) flags[rest[i]] = rest[++i];
        else terms.push(rest[i]);
      }
      const cursor = flags["--cursor"] ?? null,
        named = flags["--work-order"];
      if (named !== undefined && (terms.length || !/^WO-\d{3}$/.test(named)))
        throw new Error(followupsUsage);
      // No term: this worktree's change and the order it belongs to, which a
      // completion on a branch that names no order passes explicitly.
      if (!terms.length) {
        const order =
          named ??
          selectWorkOrder(readControl(root), {
            branch: branchWorkOrder(root),
            allowAmbiguous: true,
          });
        return touchingFollowups(root, {
          paths: changedAgainstMain(root).paths,
          orders: order ? [order] : [],
          whole: true,
          cursor,
          continuation: named ? `--work-order ${named}` : null,
        });
      }
      const order = (term) => /^WO-\d{3}$/.test(term);
      return touchingFollowups(root, {
        paths: terms.filter((term) => !order(term)),
        orders: terms.filter(order),
        cursor,
        continuation: terms.map(shellQuote).join(" "),
      });
    }
    if (
      rest[0] === "--export" &&
      (rest.length === 2 || (rest.length === 3 && rest[2] === "--all"))
    ) {
      const path = exportDestination(root, rest[1]);
      const { rows, ...summary } = exportFollowups(root, {
        all: rest.length === 3,
      });
      writeExport(path, { ...summary, rows });
      return { ...summary, exported: rows.length, path };
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
      throw new Error(followupsUsage);
    return planningFollowups(root, { all, cursor: flags[1] ?? null });
  }
  if (command === "conditions") {
    if (rest.length && !(rest.length === 1 && rest[0] === "--slow"))
      throw new Error("usage: plan conditions [--slow]");
    return renderPlanningConditions(
      await planningConditions(root, { slow: rest[0] === "--slow" }),
    );
  }
  if (command === "failures") {
    const options = failuresOptions(rest);
    if (options.export) {
      const path = exportDestination(root, options.export, failuresExport);
      const { rows, observations, ...summary } = exportFailures(
        root,
        options.window,
      );
      writeExport(path, { ...summary, rows, observations });
      const { source, ...printed } = summary;
      return {
        ...printed,
        exported: rows.length,
        exportedObservations: observations.length,
        path,
      };
    }
    return planningFailures(root, {
      ...options.window,
      cursor: options.cursor,
    });
  }
  if (command === "start") {
    reportHarnessRuntime(root);
    if (rest.length !== 1 || !/^[a-z][a-z0-9-]{0,60}$/.test(rest[0]))
      throw new Error("usage: plan start <slug>");
    if (
      runGit(root, ["symbolic-ref", "--short", "HEAD"]) !== "main" ||
      runGit(root, ["status", "--porcelain"])
    )
      throw new Error("plan start requires clean main");
    const followups = planningFollowups(root);
    // What failed since the latest planning receipt, read before the register;
    // a count that cannot be computed never keeps the branch shut (WO-172).
    const failures = failuresAtStart(root);
    const conditions = await conditionsAtStart(root);
    const branch = `planning/${new Date().toISOString().slice(0, 10)}-${rest[0]}`;
    runGit(root, ["switch", "-c", branch]);
    return {
      branch,
      phase: "planning",
      authority: "document-only planning dispatch",
      failures,
      conditions,
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
  if (command === "subject" && !rest.length)
    return buildPlanSubject(root, "HEAD", { goalReview: true });
  if (command === "check" && !rest.length) {
    syncFollowups(root, { check: true });
    return checkPlanGate(root);
  }
  if (command === "dispose") {
    if (rest.length !== 3)
      throw new Error("usage: plan dispose <receipt-id> <hold-id> <reason>");
    return disposePlanHold(root, {
      receiptId: rest[0],
      holdId: rest[1],
      reason: rest[2],
    });
  }
  if (command === "amend-order") {
    if (
      rest.length === 4 &&
      rest[1] === "--withdraw" &&
      /^[1-9]\d*$/.test(rest[2])
    )
      return withdrawPlanAmendment(root, {
        workOrderId: rest[0],
        ordinal: Number(rest[2]),
        reason: rest[3],
      });
    if (rest.length !== 3)
      throw new Error(
        "usage: plan amend-order <WO-NNN> <WO-NNN-DNNN> <operator-authorization reason> | amend-order <WO-NNN> --withdraw <row-ordinal> <reason>",
      );
    return amendPlanOrder(root, {
      workOrderId: rest[0],
      decisionId: rest[1],
      reason: rest[2],
    });
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
    // Identity is optional provenance; the captured direction supplies authority.
    const actor = actorArgs.length
      ? parseActor("plan override", actorArgs)
      : undefined;
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
  if (opt["--direct"] || !opt["--transport"]) {
    if (Object.keys(opt).some((key) => !["--direct", "--scope"].includes(key)))
      throw new Error(
        "Background refutation accepts only --direct and --scope; external options require an explicit --transport",
      );
    return beginDirectRefutation(root, { scope: opt["--scope"] ?? "pass" });
  }
  if (opt["--scope"] && opt["--scope"] !== "full")
    throw new Error(
      "Pass-scoped refutation uses --direct; the external transport judges the full horizon",
    );
  const subject = buildPlanSubject(root, "HEAD", { goalReview: true });
  const receipts = await readReceipts(root);
  const pass = opt["--evidence-only"]
    ? {
        id: `evidence-${opt["--slug"] ?? "plan-refutation"}`,
        kind: "evidence",
        heading: null,
      }
    : await latestPlanningPass(root, receipts);
  if (
    pass.kind === "planning" &&
    buildPlanSubject(root, "HEAD", { workspace: true, goalReview: true })
      .hash !== subject.hash
  )
    throw new Error(
      "commit the planning subject before refutation; draft bytes cannot enter a committed-only brief",
    );
  const history = receipts.filter((receipt) => receipt.pass.id === pass.id);
  if (history.at(-1)?.subject.hash === subject.hash)
    throw new Error("same subject cannot be re-rolled");
  requireChangedPlanEvidence(pass, subject, history);
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
  const name = opt["--transport"];
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
  // The pinned per-transport defaults are the Entropy Reducer's table. Codex
  // launches ignore user configuration, so the effort is always recorded and
  // passed; an unrecorded one would run at the model's own default.
  const model = opt["--model"] ?? TRANSPORT_DEFAULTS[name].model;
  const effort = opt["--effort"] ?? TRANSPORT_DEFAULTS[name].effort;
  const episode = await runPlanRefutation(
    subject,
    transport,
    model,
    effort,
    Date.now,
    docPath(root, "control", "local/refutations"),
  );
  const receipt = await writePlanReceipt(root, {
    pass,
    slug: opt["--slug"] ?? pass.id,
    subject,
    episode,
    dispositions,
  });
  return {
    receipt: docRelative(root, "refutations", `${receipt.receiptId}.md`),
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

if (isMainModule(import.meta.url)) {
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
