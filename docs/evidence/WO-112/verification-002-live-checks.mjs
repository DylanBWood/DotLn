// VER-002 read-only checks of preserved scratch runs and their current PRs.
// Private selectors and remote response bodies are never emitted or filed.
// node scripts/harness.mjs bounded -- node docs/evidence/WO-112/verification-002-live-checks.mjs
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { decodeLog } from "@dotln/kernel";
import { checkOutwardArtifact } from "../../../scripts/outward-lint.mjs";

const root = realpathSync(
  join(dirname(fileURLToPath(import.meta.url)), "../../.."),
);
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const digest = (value) => createHash("sha256").update(value).digest("hex");
const checked = (program, args, cwd = root) => {
  const result = spawnSync(program, args, {
    cwd,
    encoding: "utf8",
    timeout: 30000,
    maxBuffer: 2 ** 22,
  });
  assert.equal(
    result.status,
    0,
    `${program} read failed (private diagnostics withheld)`,
  );
  return result.stdout.trim();
};
assert.equal(checked("git", ["rev-parse", "--show-toplevel"]), root);
const query = `query($owner:String!,$name:String!,$number:Int!){repository(owner:$owner,name:$name){pullRequest(number:$number){state mergedAt headRefOid headRefName title body commits(first:100){nodes{commit{message}}pageInfo{hasNextPage}}reviewThreads(first:100){nodes{isResolved comments(first:100){nodes{body author{__typename}}pageInfo{hasNextPage}}}pageInfo{hasNextPage}}reviews(first:100){nodes{body author{__typename}}pageInfo{hasNextPage}}}}}`;
for (const [scenario, storeName] of [
  ["representative", "store-rep"],
  ["control", "store-control5"],
]) {
  const binding = json(
    join(root, ".runtime/wo112-repair", storeName, "run-binding.json"),
  );
  const receipt = json(
    join(root, "docs/evidence/WO-112", `repair-${scenario}-run.json`),
  );
  const outward = json(
    join(root, "docs/evidence/WO-112", `repair-${scenario}-outward.json`),
  );
  const streams = readdirSync(join(binding.store, "vertical"))
    .map((directory) =>
      join(
        binding.store,
        "vertical",
        directory,
        "source/publication/events.jsonl",
      ),
    )
    .filter((file) => existsSync(file));
  assert.equal(streams.length, 1, "expected one preserved publication stream");
  const events = decodeLog(readFileSync(streams[0], "utf8"));
  const opening = events.find((event) => event.type === "PullRequestOpened");
  assert.ok(opening, "preserved publication must exist");
  const [host, owner, name] = binding.repositoryId.split("/");
  assert.equal(host, "github.com");
  assert.ok(owner && name);
  const response = JSON.parse(
    checked("gh", [
      "api",
      "--hostname",
      host,
      "graphql",
      "-f",
      `query=${query}`,
      "-F",
      `owner=${owner}`,
      "-F",
      `name=${name}`,
      "-F",
      `number=${opening.payload.number}`,
    ]),
  );
  assert.ok(
    !response.errors,
    "GraphQL read error (private diagnostics withheld)",
  );
  const pr = response.data.repository.pullRequest;
  assert.equal(pr.state, "OPEN");
  assert.equal(pr.mergedAt, null);
  assert.equal(
    pr.headRefOid,
    outward.subjectRevision,
    "current PR head differs from recorded subject",
  );
  assert.equal(
    digest(pr.body),
    outward.pullRequest.bodyHash,
    "current generated body differs",
  );
  assert.equal(pr.commits.pageInfo.hasNextPage, false);
  assert.equal(pr.reviewThreads.pageInfo.hasNextPage, false);
  assert.equal(pr.reviews.pageInfo.hasNextPage, false);
  assert.ok(pr.reviewThreads.nodes.length > 0);
  assert.ok(pr.reviewThreads.nodes.every((thread) => thread.isResolved));
  assert.ok(
    pr.reviewThreads.nodes.every(
      (thread) => !thread.comments.pageInfo.hasNextPage,
    ),
  );
  const observedBodyTexts = new Set(
    receipt.observations.flatMap((observation) =>
      observation.comments
        .filter((comment) => !comment.path)
        .map((comment) => comment.text),
    ),
  );
  const automatedBodies = pr.reviews.nodes.filter(
    (review) => review.author?.__typename === "Bot" && review.body.trim(),
  );
  assert.ok(
    automatedBodies.every((review) => observedBodyTexts.has(review.body)),
    "new or changed automated review body requires inspection",
  );
  if (scenario === "control")
    assert.ok(
      pr.reviewThreads.nodes.some((thread) =>
        thread.comments.nodes.some(
          (comment) =>
            comment.body.includes('"disposition":"rejected"') &&
            comment.body.includes("host-test:0"),
        ),
      ),
    );
  const artifacts = [
    { kind: "branch", text: pr.headRefName },
    { kind: "pr-title", text: pr.title },
    { kind: "pr-body", text: pr.body },
    ...pr.commits.nodes.map(({ commit }) => ({
      kind: "commit",
      text: commit.message.trimEnd(),
    })),
  ];
  const lints = artifacts.map((artifact) => ({
    kind: artifact.kind,
    ...checkOutwardArtifact(binding.launchpad, artifact),
  }));
  assert.ok(
    lints.every((lint) => lint.status === "pass"),
    "outward lint failed",
  );
  const target = realpathSync(binding.target);
  assert.equal(
    checked("git", ["rev-parse", "--show-toplevel"], target),
    target,
  );
  const prefixes = outward.treeGrep.prefixes;
  const terms = [...outward.treeGrep.terms, "scratch-local-only"];
  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const pattern = `(^|[^[:alnum:]_])(${terms.map(escape).join("|")})([^[:alnum:]_]|$)|${prefixes.map(escape).join("|")}`;
  const grep = spawnSync(
    "git",
    ["grep", "-n", "-I", "-i", "-E", pattern, pr.headRefOid, "--"],
    { cwd: target, encoding: "utf8" },
  );
  assert.equal(grep.status, 1, "declared tree grep was not empty");
  assert.equal(grep.stdout, "");
  const paths = checked(
    "git",
    ["ls-tree", "-r", "--name-only", pr.headRefOid],
    target,
  ).split("\n");
  assert.equal(paths.length, outward.treeGrep.trackedFileCount);
  assert.ok(
    paths.every((path) => !prefixes.some((prefix) => path.startsWith(prefix))),
  );
  const cycle =
    Date.parse(receipt.cycle.finishedAt) - Date.parse(receipt.cycle.startedAt);
  assert.equal(cycle, receipt.cycle.wallMs);
  console.log(
    JSON.stringify({
      scenario,
      observedAt: new Date().toISOString(),
      state: pr.state,
      merged: false,
      headMatchesRecordedSubject: true,
      generatedBodyHashMatches: true,
      commits: pr.commits.nodes.length,
      threads: pr.reviewThreads.nodes.length,
      allThreadsResolved: true,
      reviewBodies: pr.reviews.nodes.length,
      nonemptyAutomatedReviewBodies: automatedBodies.length,
      automatedBodyTextsMatchRecordedObservations: true,
      controlRejectionHasRecordedEvidence:
        scenario === "control" ? true : "not-applicable",
      outwardArtifactCount: lints.length,
      allOutwardLintsPass: true,
      treeGrepExit: grep.status,
      trackedFiles: paths.length,
      forbiddenPaths: 0,
      recordedCycleMs: cycle,
      recordedNativeEpisodes: receipt.episodes.length,
      limits:
        "Read-only forge and local-tree checks; no new live worker run. Selectors and response text retained only in their existing ignored source.",
    }),
  );
}
