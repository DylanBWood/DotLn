import { runGit, runGitPathList, shellQuote, spawnGit } from "./git.mjs";
import { docPath } from "./config.mjs";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inventoryMaterial } from "./worktree-material.mjs";

export async function requireLifecycleEvidence(
  root,
  action,
  verdict,
  workOrder,
) {
  const started = Date.now();
  // Untracked files are read too: they join the diff as intent-to-add entries
  // of a temporary index copy, so Git's own whitespace and attribute rules
  // apply and the real index is never written. A nested repository is listed
  // as a directory and is not a file to add.
  const untracked = runGitPathList(root, [
    "ls-files",
    "--others",
    "--exclude-standard",
    "-z",
  ]).filter((path) => !path.endsWith("/"));
  let scratch, env;
  try {
    if (untracked.length) {
      scratch = mkdtempSync(join(tmpdir(), "dotln-whitespace-"));
      const index = join(scratch, "index");
      const real = runGit(root, [
        "rev-parse",
        "--path-format=absolute",
        "--git-path",
        "index",
      ]);
      if (existsSync(real)) copyFileSync(real, index);
      // The names are literal paths, never pathspec patterns.
      env = {
        ...process.env,
        GIT_INDEX_FILE: index,
        GIT_LITERAL_PATHSPECS: "1",
      };
      const added = spawnGit(
        [
          "add",
          "--intent-to-add",
          "--pathspec-from-file=-",
          "--pathspec-file-nul",
        ],
        { cwd: root, encoding: "utf8", env, input: untracked.join("\0") },
      );
      if (added.status !== 0)
        throw new Error(`git add --intent-to-add failed: ${added.stderr}`);
    }
    const diff = spawnGit(["diff", "--check"], {
      cwd: root,
      encoding: "utf8",
      ...(env ? { env } : {}),
    });
    if (diff.status !== 0)
      throw new Error(`git diff --check failed: ${diff.stdout}${diff.stderr}`);
  } finally {
    if (scratch) rmSync(scratch, { recursive: true, force: true });
  }
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
      advise(`Material inventory unavailable: ${error.message}`);
      material = [];
    }
    // One advisory names every scratch repository still present; the close
    // removes any left and records its head commit.
    const scratch = material.filter((row) => row.disposition === "disposable");
    if (scratch.length)
      advise(
        `Scratch repositories present: ${scratch.map((row) => JSON.stringify(row.path)).join(", ")}; remove each from the worktree root before handoff (${scratch.map((row) => `rm -rf -- ${shellQuote(row.path)}`).join("; ")}); release close removes any left and records its head commit.`,
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
  // The document gate is no longer looked up by tree hash here, which every
  // report write changed; a criterion recorded met that names it makes the
  // completion run it inline (scripts/lib/handoff-ledger.mjs; WO-173).
  if (executor) {
    try {
      const { requirePlanningHandoffs } =
        await import("./planning-followups.mjs");
      requirePlanningHandoffs(root, workOrder);
    } catch (error) {
      advise(error.message);
    }
    // The register rows this change or order touches (WO-169). The advisory
    // carries the rule because no role text names it; it reads and never
    // writes, and a repository without main is judged by its order alone.
    try {
      const { changedAgainstMain, touchingFollowups } =
        await import("./planning-followups.mjs");
      const { branchWorkOrder } = await import("./control-store.mjs");
      const orders = /^WO-\d{3}$/.test(workOrder ?? "") ? [workOrder] : [];
      const changed = changedAgainstMain(root, { required: false });
      const { matched } = touchingFollowups(root, {
        paths: changed.paths,
        orders,
        whole: true,
      });
      // The command selects its order by branch; elsewhere it is told which.
      // With no main to compare with, the change is unknown: the rows are
      // judged by the order alone and the command names it as a term, which
      // the feed answers without main.
      const command =
        changed.base === null
          ? `npm run plan -- followups --touching ${workOrder}`
          : `npm run plan -- followups --touching${orders.length && branchWorkOrder(root) !== workOrder ? ` --work-order ${workOrder}` : ""}`;
      const named =
        changed.base === null
          ? orders
          : ["a file this change touches", ...orders];
      if (matched)
        advise(
          `${matched} pending follow-up ${matched === 1 ? "row names" : "rows name"} ${named.join(" or ")} (a textual match): run ${command}; fix a row inside the Boy Scout bound or record it as left in the order's decisions, never widen the order; the final review disposes a listed row whose seam the change opened or whose condition occurred, and leaves a row it only matched as it is.`,
        );
      else if (changed.base === null && !orders.length)
        advise(
          "Follow-up rows this change touches unavailable: no main to compare with and no order to name; run npm run plan -- followups --touching <path> with the paths this change touches",
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
