import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

// Legacy standalone lifecycle fixtures exercise the fold without installing the
// Contributor gate contract. A repository that has installed it cannot turn it
// off by deleting the current package entry or budget file.
export function hasLifecycleEvidenceContract(root) {
  const path = join(root, "package.json");
  if (
    existsSync(path) &&
    JSON.parse(readFileSync(path, "utf8")).scripts?.["test:full"]
  )
    return true;
  return (
    spawnSync("git", ["cat-file", "-e", "HEAD:docs/control/budgets.json"], {
      cwd: root,
      stdio: "ignore",
    }).status === 0
  );
}

export async function requireLifecycleEvidence(
  root,
  action,
  verdict,
  workOrder,
) {
  if (!hasLifecycleEvidenceContract(root)) return null;
  if (["implementation-ready", "repair-complete"].includes(action)) {
    const { requirePlanningHandoffs } =
      await import("./planning-followups.mjs");
    requirePlanningHandoffs(root, workOrder);
  }
  const { gateTreeHash, findGateCheck } = await import("./gate-evidence.mjs");
  const treeHash = gateTreeHash(root);
  // A failing verification is an evidence-bearing report, never a green-code claim.
  const required =
    verdict === "fail"
      ? ["git diff --check"]
      : ["npm run test:full", "git diff --check"];
  for (const checkId of required)
    if (!findGateCheck(root, checkId, treeHash))
      throw new Error(
        `Required application check missing, stale, unexecuted, or failing: ${checkId}; current tree requires evidence`,
      );
  const directory = join(root, "docs/control/local/harness");
  const role = {
    "implementation-ready": "executor",
    "repair-complete": "executor",
    "verification-result": "verifier",
    "final-review-result": "reviewer",
  }[action];
  const sessions = (existsSync(directory) ? readdirSync(directory) : [])
    .filter((name) => /^[a-f0-9]{64}\.json$/.test(name))
    .map((name) => JSON.parse(readFileSync(join(directory, name), "utf8")))
    .filter(
      (session) =>
        session.role === role &&
        session.workOrder === workOrder &&
        Array.isArray(session.authoredPaths),
    );
  if (!sessions.length)
    throw new Error(
      "Output authorship unavailable: begin the role's harness session before implementation",
    );
  const session = sessions
    .sort((a, b) => (a.startedAt ?? "").localeCompare(b.startedAt ?? ""))
    .at(-1);
  if (session.remainingWork?.length)
    throw new Error(
      `Required work remains incomplete: ${session.remainingWork.join(", ")}`,
    );
  const { harnessOutputObligations } =
    await import("../../packages/skeleton/dist/src/harness-host.js");
  const obligations = harnessOutputObligations(root, session);
  const missing = obligations.filter((output) =>
    output.obligation === "read"
      ? !(session.reads ?? []).some(
          (read) =>
            read.path === output.path &&
            read.hash === output.hash &&
            read.evidenceRef,
        )
      : !(
          (output.checkId && findGateCheck(root, output.checkId, treeHash)) ||
          findGateCheck(root, "npm run test:full", treeHash)
        ),
  );
  if (missing.length)
    throw new Error(
      `Output not read or checked at its current bytes: ${missing.map((row) => row.path).join(", ")}`,
    );
  return {
    treeHash,
    readCount: obligations.filter((row) => row.obligation === "read").length,
    readBytes: obligations
      .filter((row) => row.obligation === "read")
      .reduce((sum, row) => sum + row.bytes, 0),
    checkCount: obligations.filter((row) => row.obligation === "check").length,
  };
}
