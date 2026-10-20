import { hasAiAttribution } from "../../packages/compiler/src/attribution.mjs";
import { checkOutwardArtifact } from "../outward-lint.mjs";
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
    });
    if (result.checks.format.status !== "pass")
      throw refuse(
        `commit message format refused before final review: ${result.findings
          .filter((finding) => /^(?:subject|commit|text)\./u.test(finding.rule))
          .map((finding) => finding.rule)
          .join(", ")}`,
      );
  }
  if (commits.some(({ message }) => hasAiAttribution(message)))
    throw refuse(
      "target commit contains AI attribution; repair it before recording final review pass",
    );
}
