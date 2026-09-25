import { docPath } from "./config.mjs";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

export async function requireLifecycleEvidence(
  root,
  action,
  verdict,
  workOrder,
) {
  const started = Date.now();
  const diff = spawnSync("git", ["diff", "--check"], {
    cwd: root,
    encoding: "utf8",
  });
  if (diff.status !== 0)
    throw new Error(`git diff --check failed: ${diff.stdout}${diff.stderr}`);
  const {
    gateTreeHash,
    findGateCheck,
    readGateChecks,
    partialGateCheck,
    recordGateChecks,
  } = await import("./gate-evidence.mjs");
  const treeHash = gateTreeHash(root);
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
  const advisories = [];
  const advise = (message) => {
    advisories.push(message);
    console.warn(`Advisory: ${message}`);
  };
  const gate =
    action === "final-review-result" && verdict !== "fail"
      ? findGateCheck(root, "npm test", treeHash)
      : null;
  if (action === "final-review-result" && verdict !== "fail" && !gate)
    advise(
      "No passing product gate at this code identity; the reviewer runs npm test before publication.",
    );
  if (["implementation-ready", "repair-complete"].includes(action)) {
    let documents;
    let documentRowsUnavailable = false;
    try {
      documents = readGateChecks(root, treeHash)
        .filter((row) => row.checkId === "npm run test:docs")
        .at(-1);
    } catch (error) {
      documentRowsUnavailable = true;
      advise(
        `Latest npm run test:docs for current tree unavailable: ${error.message}`,
      );
    }
    if (
      !documentRowsUnavailable &&
      (!documents ||
        documents.exitCode !== 0 ||
        documents.executed !== true ||
        partialGateCheck(documents) ||
        !Number.isFinite(documents.durationMs) ||
        documents.durationMs < 0 ||
        typeof documents.evidenceRef !== "string" ||
        !documents.evidenceRef.trim())
    )
      advise(
        `Latest npm run test:docs for current tree: ${documents ? `not passing (${documents.evidenceRef ?? "no reference"}, ${documents.recordedAt ?? "unknown cutoff"})` : "missing"}; run npm run test:docs before handoff.`,
      );
    try {
      const { requirePlanningHandoffs } =
        await import("./planning-followups.mjs");
      requirePlanningHandoffs(root, workOrder);
    } catch (error) {
      advise(error.message);
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
  return { treeHash, ...(productGate ? { productGate } : {}), advisories };
}
