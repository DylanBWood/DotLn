import { hasAiAttribution } from "../../packages/compiler/src/attribution.mjs";
import { checkOutwardArtifact } from "../outward-lint.mjs";
import { outwardFindingText } from "./outward-lint.mjs";
import { mainWorktree, runGit } from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import { targetWorktreeForOrder } from "./target-worktrees.mjs";
import { targetBase } from "./target-base.mjs";

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
  const read = (args, options) =>
    runGit(
      entry.target,
      ["--no-replace-objects", ...HOST_GIT_READ, ...args],
      options,
    );
  const baseRef = `refs/remotes/origin/${entry.baseBranch}`;
  const baseTip = read(
    ["rev-parse", "--verify", "--quiet", `${baseRef}^{commit}`],
    {
      onFailure: () => null,
    },
  );
  const { baseCommit, activationBase } = targetBase(
    read,
    subject.baseCommit,
    subject.commit,
    baseTip,
  );
  const commits = targetCommits(entry.target, baseCommit, subject.commit);
  const range = `linted ${commits.length} ${commits.length === 1 ? "commit" : "commits"} from base ${baseCommit} to subject ${subject.commit}${baseCommit !== activationBase ? `; activated at base ${activationBase}` : ""}${baseTip === null ? `; ${baseRef} was absent, using the activation base` : ""}`;
  const refuseCommit = (sha, reason) =>
    refuse(`${range}; commit ${sha}: ${reason}`);
  for (const { sha, message } of commits) {
    const result = checkOutwardArtifact(mainWorktree(launchpad), {
      kind: "commit",
      text: message,
      target: true,
    });
    if (result.checks.format.status !== "pass")
      throw refuseCommit(
        sha,
        `commit message format refused before final review: ${result.findings
          .filter((finding) => /^(?:subject|commit|text)\./u.test(finding.rule))
          .map((finding) => outwardFindingText(finding, message))
          .join(", ")}`,
      );
    // A commit carrying a launchpad identifier cannot be repaired after the
    // review without a new commit; review words wait for the publish, where
    // the reviewer confirms them.
    if (result.checks.launchpadIdentifiers.status !== "pass")
      throw refuseCommit(
        sha,
        `commit message carries a launchpad identifier; repair it before recording final review pass: ${result.findings
          .filter((finding) => finding.rule === "identifier.launchpad")
          .map((finding) => outwardFindingText(finding, message))
          .join(", ")}`,
      );
  }
  const attributed = commits.find(({ message }) => hasAiAttribution(message));
  if (attributed)
    throw refuseCommit(
      attributed.sha,
      "target commit contains AI attribution; repair it before recording final review pass",
    );
}
