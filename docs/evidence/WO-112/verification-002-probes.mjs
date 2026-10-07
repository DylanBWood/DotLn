// VER-002 reproductions, using synthetic repositories and observer inputs only.
// Run from the repository root after its normal build:
// node scripts/harness.mjs bounded -- node docs/evidence/WO-112/verification-002-probes.mjs
// Assertions pin the defects observed at this verification subject; a repair
// should make the affected assertion fail. This is evidence, not a passing gate.
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { appendEvent, decodeLog } from "@dotln/kernel";
import { SourceChangeHost } from "../../../packages/skeleton/dist/src/source-change-host.js";
import { WorkerStore } from "../../../packages/skeleton/dist/src/worker-store.js";
import {
  createSourceFixture,
  fixtureGit as git,
  sourceFixtureOptions,
} from "../../../packages/skeleton/dist/test/source-change-fixture.js";
import { resolveReviewComments } from "../../../scripts/lib/review-comment-loop.mjs";
import { PULL_REQUEST_OBSERVER } from "../../../scripts/lib/pull-request-observer.mjs";
import { TARGET_PUBLISH_HOST } from "../../../scripts/lib/target-publish.mjs";

const observations = [];
const emit = (row) => {
  observations.push(row);
  console.log(JSON.stringify(row));
};

// F1: an independently owned sibling worktree makes a legitimate commit while
// the writer is running. The host mistakes its ref advance for writer damage.
{
  const root = createSourceFixture();
  try {
    const repo = join(root, "target");
    const sibling = join(root, "sibling");
    const base = git(repo, "rev-parse", "HEAD");
    git(repo, "worktree", "add", "-b", "independent", sibling, base);
    let siblingCommit;
    const host = new SourceChangeHost({
      ...sourceFixtureOptions(root, () => 10),
      afterResult() {
        writeFileSync(join(sibling, "independent.txt"), "independent work\n");
        git(sibling, "add", "independent.txt");
        git(sibling, "commit", "-m", "Independent synthetic change");
        siblingCommit = git(sibling, "rev-parse", "HEAD");
      },
    });
    const result = await host.run();
    const siblingHead = git(sibling, "rev-parse", "HEAD");
    assert.equal(result.status, "refused");
    assert.equal(result.refusal.reason, "worker-changed-shared-repository");
    assert.notEqual(siblingCommit, base);
    assert.equal(siblingHead, base);
    emit({
      finding: "F1",
      defectObserved: true,
      result: result.refusal.reason,
      independentCommitCreated: true,
      independentBranchRewoundToBase: true,
      independentWorkingTreeStatus: git(sibling, "status", "--short"),
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// F2: restoration follows a writer-controlled alternates symlink. The victim
// is synthetic and inside this disposable fixture, outside the Git root.
{
  const root = createSourceFixture();
  try {
    const repo = join(root, "target");
    git(root, "init", "--bare", join(root, "alternate-a"));
    git(root, "init", "--bare", join(root, "alternate-b"));
    const before = `${join(root, "alternate-a", "objects")}\n`;
    const victimContent = `${join(root, "alternate-b", "objects")}\n`;
    const alternates = join(repo, ".git/objects/info/alternates");
    const victim = join(root, "synthetic-victim.txt");
    writeFileSync(alternates, before);
    writeFileSync(victim, victimContent);
    const host = new SourceChangeHost({
      ...sourceFixtureOptions(root, () => 10),
      afterResult() {
        unlinkSync(alternates);
        symlinkSync(victim, alternates);
      },
    });
    const result = await host.run();
    assert.equal(result.status, "refused");
    assert.equal(result.refusal.reason, "worker-changed-shared-repository");
    assert.notEqual(victimContent, before);
    assert.equal(readFileSync(victim, "utf8"), before);
    emit({
      finding: "F2",
      defectObserved: true,
      result: result.refusal.reason,
      syntheticFileOutsideRepositoryOverwritten: true,
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// F3: a committed writer mutates a shared ref, then returns invalid output.
// The first invocation skips the integrity check; recovery accepts its commit.
{
  const root = createSourceFixture();
  try {
    const options = sourceFixtureOptions(root, () => 10);
    const originalTransport = options.transport;
    let host;
    const transport = {
      name: originalTransport.name,
      harnessVersion: originalTransport.harnessVersion,
      dispatch(request, now) {
        const pending = originalTransport.dispatch(request, now);
        return {
          ...pending,
          completed: pending.completed.then(() => {
            git(host.tree.path, "tag", "stray-after-failure");
            return {};
          }),
        };
      },
    };
    host = new SourceChangeHost({ ...options, transport });
    let firstFailure;
    try {
      await host.run();
      assert.fail("malformed result unexpectedly accepted on first invocation");
    } catch (error) {
      firstFailure = error.message;
      assert.match(firstFailure, /invalid-result/);
    }
    const tagAfterFailure = git(
      options.workOrder.repo,
      "tag",
      "--list",
      "stray-after-failure",
    );
    assert.equal(tagAfterFailure, "stray-after-failure");
    const recovered = await new SourceChangeHost(
      sourceFixtureOptions(root, () => 6000),
    ).run();
    assert.equal(recovered.status, "observed");
    assert.equal(
      git(options.workOrder.repo, "tag", "--list", "stray-after-failure"),
      tagAfterFailure,
    );
    emit({
      finding: "F3",
      defectObserved: true,
      firstFailure,
      unauthorizedTagSurvivesFailure: true,
      recoveryStatus: recovered.status,
      unauthorizedTagSurvivesRecovery: true,
      writerLaunches: readFileSync(join(root, "launches.txt"), "utf8")
        .trim()
        .split("\n").length,
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// F4: keep a review body's stable remote ID but edit its text. The observer is
// a declared double; the real loop and durable event store perform both runs.
{
  const root = mkdtempSync(join(tmpdir(), "dotln-ver002-review-"));
  try {
    const publication = new WorkerStore(join(root, "publication"));
    let clock = 10;
    const record = (actorId, type, payload, causationId) => {
      publication.acquire();
      try {
        const { event } = appendEvent(publication.read(), {
          schemaVersion: 1,
          type,
          occurredAt: ++clock,
          actorId,
          workstreamId: "ws_ver002_synthetic",
          ...(causationId ? { causationId } : {}),
          payload,
        });
        publication.append(event);
        return event;
      } finally {
        publication.release();
      }
    };
    const repositoryId = "github.com/dotln-fixture/target";
    const opening = record(TARGET_PUBLISH_HOST, "PullRequestOpened", {
      number: 7,
      repositoryId,
    });
    let body = "Automated review summary: no additional changes requested.";
    let triageCalls = 0;
    const options = {
      store: root,
      repositoryId,
      number: 7,
      original: { surfaces: ["fixture.txt"], tests: [], criteria: [] },
      now: () => ++clock,
      observe() {
        record(
          PULL_REQUEST_OBSERVER,
          "PullRequestStateObserved",
          {
            number: 7,
            repositoryId,
            headSha: "a".repeat(40),
            checks: [],
            comments: [
              {
                id: "S1",
                class: "automated-review",
                text: body,
                resolved: false,
              },
            ],
          },
          opening.eventId,
        );
      },
      async triage() {
        triageCalls++;
        return body.startsWith("Action required:")
          ? {
              kind: "NeedsHuman",
              criterionId: null,
              reason: "Changed body requires action",
              evidenceRefs: [],
            }
          : {
              kind: "acknowledge",
              criterionId: null,
              reason: "Nonactionable summary",
              evidenceRefs: ["synthetic-contract"],
            };
      },
    };
    const first = await resolveReviewComments(options);
    assert.equal(first.status, "resolved");
    assert.equal(triageCalls, 1);
    body =
      "Action required: the current implementation still violates the acceptance criterion.";
    const second = await resolveReviewComments(options);
    const rows = decodeLog(publication.read());
    assert.equal(second.status, "resolved");
    assert.equal(triageCalls, 1);
    assert.equal(
      rows.filter((row) => row.type === "ReviewBodyJudged").length,
      1,
    );
    assert.equal(
      rows.filter((row) => row.type === "PullRequestStateObserved").at(-1)
        .payload.comments[0].text,
      body,
    );
    emit({
      finding: "F4",
      defectObserved: true,
      firstStatus: first.status,
      changedBodyStatus: second.status,
      triageCalls,
      changedBodyObserved: true,
      changedBodyJudged: false,
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
assert.equal(observations.length, 4);
