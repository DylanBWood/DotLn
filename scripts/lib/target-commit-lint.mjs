import { hasAiAttribution } from "../../packages/compiler/src/attribution.mjs";
import { checkOutwardArtifact } from "../outward-lint.mjs";
import { outwardFindingText } from "./outward-lint.mjs";
import { mainWorktree, runGit } from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import { targetWorktreeForOrder } from "./target-worktrees.mjs";

const refuse = (reason) => new Error(`target publish refused: ${reason}`);
const gitText = (repo, ...args) =>
  runGit(repo, ["--no-replace-objects", ...HOST_GIT_READ, ...args], {
    trim: false,
    encoding: "utf8",
    onFailure: (result) => {
      throw refuse(
        `git ${args[0]} failed in the target repository: ${String(result.stderr ?? "").trim()}`,
      );
    },
  }).replace(/\n$/u, "");

export function targetCommits(repo, baseCommit, commit) {
  return gitText(repo, "rev-list", "--reverse", `${baseCommit}..${commit}`)
    .split("\n")
    .filter(Boolean)
    .map((sha) => ({
      sha,
      message: gitText(repo, "log", "-1", "--format=%B", sha).trimEnd(),
    }));
}

// Final review reads commit objects without loading the publication runtime.
export function lintReviewedTargetCommits(launchpad, state, subject) {
  const entry = targetWorktreeForOrder(launchpad, state.workOrderId);
  const commits = targetCommits(
    entry.target,
    subject.baseCommit,
    subject.commit,
  );
  for (const { message } of commits) {
    const result = checkOutwardArtifact(mainWorktree(launchpad), {
      kind: "commit",
      text: message,
      target: true,
    });
    if (result.checks.format.status !== "pass")
      throw refuse(
        `commit message format refused before final review: ${result.findings
          .filter((finding) => /^(?:subject|commit|text)\./u.test(finding.rule))
          .map((finding) => outwardFindingText(finding, message))
          .join(", ")}`,
      );
    // A commit carrying a launchpad identifier cannot be repaired after the
    // review without a new commit; review words wait for the publish, where
    // the reviewer confirms them.
    if (result.checks.launchpadIdentifiers.status !== "pass")
      throw refuse(
        `commit message carries a launchpad identifier; repair it before recording final review pass: ${result.findings
          .filter((finding) => finding.rule === "identifier.launchpad")
          .map((finding) => outwardFindingText(finding, message))
          .join(", ")}`,
      );
  }
  if (commits.some(({ message }) => hasAiAttribution(message)))
    throw refuse(
      "target commit contains AI attribution; repair it before recording final review pass",
    );
}
