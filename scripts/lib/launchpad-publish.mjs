// The launchpad's own pull requests: a planning pass and a kit update each end
// by pushing their branch and opening a pull request on the repository origin
// names. A session that spells `git push` and `gh pr create` itself meets a
// host classifier that may deny the push, and in a fork a `gh` that resolves to
// the parent. This helper is the one form the emitted allow rule covers: it does
// for these two branches what the target publish does for a registered target's.
// An order's branch keeps its own publish, whose lifecycle preconditions this
// has none of.
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { hasAiAttribution } from "../../packages/compiler/src/attribution.mjs";
import {
  checkOutwardArtifact,
  readOutwardVocabulary,
} from "../outward-lint.mjs";
import { branchChanges } from "./branch-changes.mjs";
import { branchTermFindings, branchTermLines } from "./branch-terms.mjs";
import { docPath } from "./config.mjs";
import { runGit } from "./git.mjs";
import { assertGitHubBodyProfile, withTemporaryBody } from "./github-body.mjs";
import {
  ensureGh,
  executeGh,
  HOST_GIT_READ,
  parseGitHubTarget,
  parsePullRequestUrl,
  pushObservedCommit,
  pushUrl,
  remoteBranchCommit,
  REMOTE_READ_TIMEOUT_MS,
} from "./github-repository.mjs";
import { conventionalTypes, outwardFindingText } from "./outward-lint.mjs";
import { PLANNING_BRANCH } from "./planning-document.mjs";

const KINDS = Object.freeze({
  planning: {
    door: "plan publish",
    shape: PLANNING_BRANCH,
    named: "planning/<date>-<slug>",
  },
  update: {
    door: "update --publish",
    shape: /^chore\/[a-z0-9][a-z0-9._-]*$/u,
    named: "chore/<slug>",
  },
});

/** The instance's vocabulary when it has one. The kit carries none: the file
 * comes with a registered target, and this lint needs only the types. */
const ownVocabulary = (root) =>
  existsSync(docPath(root, "control", "outward-vocabulary.json"))
    ? readOutwardVocabulary(root)
    : { types: conventionalTypes, reviewTerms: [] };

/** What refuses this repository's own title or body. The public review words
 * name the launchpad and its parts, which is what its own pull request is
 * about, so they pass. A private term refuses in either mode: this route has
 * no reviewer's confirmation for a review-mode match to wait for. */
const lintFailures = (root, artifacts) => {
  const vocabulary = ownVocabulary(root);
  const failures = [];
  for (const { kind, text } of artifacts) {
    const result = checkOutwardArtifact(root, { kind, text, vocabulary });
    if (result.checks.localTerms.status === "unavailable")
      failures.push(
        `${kind}: the local-terms list is absent; register it at ${docPath(root, "control", "local/terms.txt")}, where an empty list refuses nothing`,
      );
    for (const finding of result.findings)
      if (finding.rule !== "vocabulary.review")
        failures.push(
          `${kind}: ${outwardFindingText(finding, text)}${finding.span ? ` (line ${finding.span.line})` : ""}`,
        );
  }
  return failures;
};

/** Publish the checkout's planning or update branch: every refusal precedes
 * the first remote mutation, the repository is origin's push URL and nothing
 * else, and a retry after a failed create repeats no push and opens no second
 * pull request. `ready` is the door's own proof the branch holds its work. */
export function publishLaunchpadBranch(
  root,
  { kind, title, bodyFile, base = "main", ready },
) {
  const { door, shape, named } = KINDS[kind];
  const fail = (reason) => new Error(`${door} refused: ${reason}`);
  const read = (args, options) =>
    runGit(root, [...HOST_GIT_READ, ...args], options);
  const branch = read(["symbolic-ref", "--quiet", "--short", "HEAD"], {
    onFailure: () => "",
  });
  if (!branch) throw fail("HEAD names no branch");
  if (branch === base || branch === "main")
    throw fail(
      `${branch} is not published here; switch to its ${named} branch`,
    );
  if (!shape.test(branch))
    throw fail(`branch ${branch} is not a ${named} branch`);
  if (read(["status", "--porcelain"]))
    throw fail(
      "the tree has uncommitted changes, and a pull request carries only commits; commit them and retry",
    );
  ready(branch, fail);
  const commit = read(["rev-parse", "HEAD^{commit}"]);
  const bodyPath = resolve(bodyFile);
  if (!lstatSync(bodyPath, { throwIfNoEntry: false })?.isFile())
    throw fail(`the body ${bodyFile} is not a regular file`);
  const body = readFileSync(bodyPath, "utf8");
  // The files the branch carries are screened as the document gate's terms
  // task screens them: a private term in a line the branch adds refuses by
  // file, line and mode. A malformed list refuses naming its line, never a
  // term.
  let changed;
  try {
    changed = branchTermFindings(root, {
      changes: branchChanges(root, { main: base, committed: true }),
    });
  } catch (error) {
    throw fail(
      `${error.message}; npm run terms -- check <path> reads the same list`,
    );
  }
  if (changed.status === "no merge base")
    throw fail(
      `${changed.reason}, so the files this branch changes cannot be screened`,
    );
  if (changed.findings.length)
    throw fail(
      `the local-terms list refuses lines this branch adds: ${branchTermLines(changed.findings).join("; ")}`,
    );
  const failures = lintFailures(root, [
    { kind: "pr-title", text: title },
    { kind: "pr-body", text: body },
  ]);
  if (failures.length) throw fail(`outward lint: ${failures.join("; ")}`);
  try {
    assertGitHubBodyProfile(body, bodyFile);
  } catch (error) {
    throw fail(error.message);
  }
  if (hasAiAttribution(title) || hasAiAttribution(body))
    throw fail("the title or body contains AI attribution");
  let url, forge;
  try {
    url = pushUrl(root);
    forge = parseGitHubTarget(url);
    if (ensureGh(root).selector.toLowerCase() !== forge.identity)
      throw new Error("origin differs from the repository its push URL names");
    if (
      remoteBranchCommit(url, branch, { timeoutMs: REMOTE_READ_TIMEOUT_MS }) !==
      commit
    )
      pushObservedCommit(root, url, branch, commit);
  } catch (error) {
    throw fail(error.reason ?? error.message);
  }
  const created = withTemporaryBody(body, (path) =>
    executeGh(root, [
      "pr",
      "create",
      "--repo",
      forge.selector,
      "--head",
      branch,
      "--base",
      base,
      "--title",
      title,
      "--body-file",
      path,
    ]),
  );
  const printed =
    created.status === 0 ? created.stdout.trim().split("\n").at(-1) : null;
  if (printed && parsePullRequestUrl(printed, forge) !== null) {
    console.log(
      `Pushed ${branch} at ${commit} and opened ${printed} on ${forge.selector}.`,
    );
    return { url: printed, branch, commit, repository: forge.selector };
  }
  // The create failed or printed something else: a pull request that already
  // holds this head from this branch is this publication, from an earlier
  // attempt; a closed one or another's is not.
  const found = executeGh(root, [
    "pr",
    "view",
    branch,
    "--repo",
    forge.selector,
    "--json",
    "url,state,headRefOid,headRefName,baseRefName",
  ]);
  let observed = null;
  try {
    if (found.status === 0) observed = JSON.parse(found.stdout);
  } catch {
    /* An unreadable answer adopts nothing. */
  }
  if (
    observed?.state === "OPEN" &&
    observed.headRefOid === commit &&
    observed.headRefName === branch &&
    observed.baseRefName === base &&
    parsePullRequestUrl(String(observed.url), forge) !== null
  ) {
    console.log(
      `${branch} at ${commit} is on origin; pull request ${observed.url} was already open on ${forge.selector} and keeps its title and body, which this command does not edit.`,
    );
    return { url: observed.url, branch, commit, repository: forge.selector };
  }
  const said = String(created.stderr || created.stdout || "").trim();
  throw fail(
    `branch ${branch} is pushed at ${commit} but no pull request was opened or found on ${forge.selector}${said ? ` (gh: ${said})` : ""}; inspect the repository, then rerun the same command, which repeats no push`,
  );
}
