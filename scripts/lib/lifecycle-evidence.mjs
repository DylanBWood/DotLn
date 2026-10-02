import { spawnGit } from "./git.mjs";
import { docPath } from "./config.mjs";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  inventoryMaterial,
  materialDeclareCommand,
} from "./worktree-material.mjs";

export async function requireLifecycleEvidence(
  root,
  action,
  verdict,
  workOrder,
) {
  const started = Date.now();
  const diff = spawnGit(["diff", "--check"], {
    cwd: root,
    encoding: "utf8",
  });
  if (diff.status !== 0)
    throw new Error(`git diff --check failed: ${diff.stdout}${diff.stderr}`);
  const { gateTreeHash, findGateCheck, recordGateChecks } =
    await import("./gate-evidence.mjs");
  const treeHash = gateTreeHash(root);
  const executor = ["implementation-ready", "repair-complete"].includes(action);
  const checksClaims = executor || action === "verification-result";
  const advisories = [];
  const advise = (message) => {
    advisories.push(message);
    console.warn(`Advisory: ${message}`);
  };
  let material;
  if (executor) {
    try {
      material = inventoryMaterial(root);
    } catch (error) {
      advise(`Material declarations unavailable: ${error.message}`);
      try {
        material = inventoryMaterial(root, { declarations: [] });
      } catch (error) {
        advise(`Material inventory unavailable: ${error.message}`);
        material = [];
      }
    }
    for (const row of material)
      if (row.disposition === "undeclared")
        advise(
          `Undeclared nested repository ${JSON.stringify(row.path)}; this completion records undeclared. Before another executor completion declare: ${materialDeclareCommand(row.path)}; at close use --material.`,
        );
  }
  // The whitespace check refuses; its row is bookkeeping. A gate index that
  // cannot be read or written never refuses a completion and is left as it
  // is. An executor completion reports it once, with the gate claims it
  // leaves as stated (requireGateClaims); any other completion reports it here.
  let gateIndexError;
  try {
    recordGateChecks(root, [
      {
        checkId: "git diff --check",
        treeHash,
        subject: treeHash,
        durationMs: Date.now() - started,
        exitCode: 0,
        executed: true,
        evidenceRef: `inline-diff:${treeHash}`,
        recordedAt: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    // A parse error quotes the damaged bytes; an advisory is one line.
    gateIndexError = error.message.replace(/\s+/gu, " ").trim();
    if (!checksClaims)
      advise(
        `Gate index unavailable: ${gateIndexError}; the git diff --check row is not recorded.`,
      );
  }
  const gate =
    action === "final-review-result" && verdict !== "fail"
      ? findGateCheck(root, "npm test", treeHash)
      : null;
  if (action === "final-review-result" && verdict !== "fail" && !gate)
    advise(
      "No passing product gate at this code identity; the reviewer runs npm test before publication.",
    );
  // WO-173: the document gate is no longer looked up by tree hash here, which
  // every report write changed; a criterion recorded met that names it makes
  // the completion run it inline (scripts/lib/handoff-ledger.mjs).
  if (executor) {
    try {
      const { requirePlanningHandoffs } =
        await import("./planning-followups.mjs");
      requirePlanningHandoffs(root, workOrder);
    } catch (error) {
      advise(error.message);
    }
    // WO-169: the register rows this change or order touches. The advisory
    // carries the rule because no role text names it; it reads and never
    // writes, and a repository without main is judged by its order alone.
    try {
      const { changedAgainstMain, touchingFollowups } =
        await import("./planning-followups.mjs");
      const { branchWorkOrder } = await import("./control-store.mjs");
      const orders = /^WO-\d{3}$/.test(workOrder ?? "") ? [workOrder] : [];
      const { matched } = touchingFollowups(root, {
        paths: changedAgainstMain(root, { required: false }).paths,
        orders,
        whole: true,
      });
      // The command selects its order by branch; elsewhere it is told which.
      const command = `npm run plan -- followups --touching${orders.length && branchWorkOrder(root) !== workOrder ? ` --work-order ${workOrder}` : ""}`;
      if (matched)
        advise(
          `${matched} pending follow-up ${matched === 1 ? "row names" : "rows name"} ${["a file this change touches", ...orders].join(" or ")} (a textual match): run ${command}; fix a row inside the Boy Scout bound or record it as left in the order's decisions, never widen the order; the final review disposes a listed row whose seam the change opened or whose condition occurred, and leaves a row it only matched as it is.`,
        );
    } catch (error) {
      advise(
        `Follow-up rows this change touches unavailable: ${error.message}`,
      );
    }
  }
  const directory = docPath(root, "control", "local/harness");
  const role = {
    "implementation-ready": "executor",
    "repair-complete": "executor",
    "verification-result": "verifier",
    "final-review-result": "reviewer",
  }[action];
  try {
    const session = (existsSync(directory) ? readdirSync(directory) : [])
      .filter((name) => /^[a-f0-9]{64}\.json$/.test(name))
      .map((name) => ({
        ...JSON.parse(readFileSync(join(directory, name), "utf8")),
        sessionKey: name.slice(0, -5),
      }))
      .filter((row) => row.role === role && row.workOrder === workOrder)
      .sort((a, b) => (a.startedAt ?? "").localeCompare(b.startedAt ?? ""))
      .at(-1);
    if (!session) advise("Session authorship and output reads unavailable.");
    else {
      const { harnessOutputObligations, measureHarnessSessionUsage } =
        await import("../../packages/skeleton/dist/src/harness-host.js");
      const missing = harnessOutputObligations(root, session).filter(
        (row) =>
          row.obligation === "read" &&
          !(session.reads ?? []).some(
            (read) =>
              read.path === row.path &&
              read.hash === row.hash &&
              read.evidenceRef,
          ),
      );
      if (missing.length)
        advise(
          `Outputs not read at current bytes: ${missing.map((row) => row.path).join(", ")}`,
        );
      try {
        measureHarnessSessionUsage(root, session, session.sessionKey);
      } catch (error) {
        advise(`Usage unknown: ${error.message}`);
      }
      if (session.remainingWork?.length)
        advise(
          `Session reports remaining work: ${session.remainingWork.join(", ")}`,
        );
    }
  } catch (error) {
    advise(`Session observations unavailable: ${error.message}`);
  }
  const productGate =
    gate &&
    Object.fromEntries(
      [
        "checkId",
        "treeHash",
        "codeIdentity",
        "durationMs",
        "evidenceRef",
        "recordedAt",
        "executed",
        "exitCode",
      ].map((key) => [key, gate[key]]),
    );
  // `gateIndexError` is for the gate claims and never reaches the event.
  return {
    treeHash,
    ...(executor ? { material } : {}),
    ...(productGate ? { productGate } : {}),
    advisories,
    ...(checksClaims && gateIndexError ? { gateIndexError } : {}),
  };
}
