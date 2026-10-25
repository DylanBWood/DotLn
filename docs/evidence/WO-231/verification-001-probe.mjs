// WO-231 VER-001 probes, run once under node scripts/harness.mjs bounded --.
// C1: criterion 1's passing arm with the fixture origin online (the executor's
// case takes it offline). A: a stale tracking ref behind the merged commit the
// order took (receipt 055, criterion 3). B: the tracking ref moved onto the
// subject over a nonconforming order commit, then the publish (receipt 055,
// criterion 4), with its control at the untouched ref. C: the ref resolves to
// a tree. D: the ref names unrelated history.
import {
  withFixture,
  publicationSetup,
  prepareFinalReview,
  closeOrder,
  git,
  actorArgs,
} from "../../../scripts/lib/target-worktree-fixture.mjs";
import { write } from "../../../scripts/lib/helpers.mjs";
import { docPath } from "../../../scripts/lib/config.mjs";
import { readControl } from "../../../scripts/lib/control-store.mjs";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const long = (letter) => `fix: ${letter.repeat(85)}`;
const out = {};
const refusal = (stderr, names) => {
  let line = stderr
    .split("\n")
    .filter((text) => /refused/u.test(text))
    .join(" | ");
  for (const [sha, name] of Object.entries(names))
    line = line.replaceAll(sha, `<${name}>`);
  return line;
};
const review = (f) => {
  prepareFinalReview(f);
  const segment = docPath(f.orderRoot, "orders", "WO-999.jsonl");
  const before = readFileSync(segment);
  const result = f.resume(["final-review-result", "pass", ...actorArgs]);
  const events = readFileSync(segment, "utf8").trim().split("\n");
  return {
    result,
    appended: !before.equals(readFileSync(segment)),
    last: JSON.parse(events.at(-1)),
    state: readControl(f.orderRoot).orders.get("WO-999").state,
  };
};
const mergedOnMain = (f, letter) => {
  git(f.clone, "commit", "--allow-empty", "-qm", long(letter));
  git(f.clone, "push", "-q", "origin", "main");
  return git(f.clone, "rev-parse", "HEAD");
};
const takeMain = (f) => {
  git(f.target, "fetch", "-q", "origin", "main");
  git(f.target, "merge", "--ff-only", "refs/remotes/origin/main");
};
const commit = (f, message) => {
  git(f.target, "commit", "--allow-empty", "-qm", message);
  return git(f.target, "rev-parse", "HEAD");
};

withFixture((f) => {
  const merged = mergedOnMain(f, "w");
  f.mapClone();
  f.start();
  takeMain(f);
  const subject = commit(f, "fix: keep the reviewed range");
  const { result, last, state } = review(f);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(last.type, "FinalReviewCompleted");
  assert.equal(last.targetSubject.baseCommit, f.baseCommit);
  assert.equal(last.targetSubject.commit, subject);
  out.C1 = {
    exit: result.status,
    lastEvent: last.type,
    recordedBaseIsActivation: state.baseCommit === f.baseCommit,
    activationRange: Number(
      git(f.target, "rev-list", "--count", `${f.baseCommit}..${subject}`),
    ),
    describedRange: Number(
      git(f.target, "rev-list", "--count", `${merged}..${subject}`),
    ),
  };
});

withFixture((f) => {
  const merged = mergedOnMain(f, "x");
  f.mapClone();
  f.start();
  takeMain(f);
  const subject = commit(f, "fix: preserve reviewed behavior");
  git(f.target, "update-ref", "refs/remotes/origin/main", f.baseCommit);
  const { result, appended } = review(f);
  assert.equal(result.status, 1);
  assert.equal(appended, false);
  out.A = {
    exit: result.status,
    appended,
    refusal: refusal(result.stderr, {
      [f.baseCommit]: "activation",
      [subject]: "subject",
      [merged]: "merged",
    }),
    namesTrackingRef: result.stderr.includes("refs/remotes/origin/main"),
    namesRemedy: /fetch/u.test(result.stderr),
  };
});

for (const moved of [true, false])
  withFixture((f) => {
    const forge = publicationSetup(f);
    f.mapClone();
    f.start();
    git(f.target, "merge", "--ff-only", "refs/remotes/origin/main");
    write(f.target, "reviewed.txt", "Reviewed change.\n");
    git(f.target, "add", "-A");
    git(f.target, "commit", "-qm", long("y"));
    const subject = git(f.target, "rev-parse", "HEAD");
    if (moved) git(f.target, "update-ref", "refs/remotes/origin/main", subject);
    const id = moved ? "B" : "B-control";
    if (!moved) {
      const { result, appended } = review(f);
      assert.equal(result.status, 1);
      out[id] = {
        reviewExit: result.status,
        appended,
        refusal: refusal(result.stderr, {
          [f.baseCommit]: "activation",
          [subject]: "subject",
        }),
      };
      return;
    }
    closeOrder(f);
    const state = readControl(f.orderRoot).orders.get("WO-999").state;
    write(
      f.orderRoot,
      "records/evidence/WO-999/decisions.md",
      "# Decisions\n\nPreserve reviewed behavior.\n",
    );
    f.ok(f.resume(["target-records", ...actorArgs]));
    write(
      f.orderRoot,
      "reviewed-body.md",
      "## Result\n\nPreserve reviewed behavior.\n",
    );
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "commit", "-qm", "docs: preserve reviewed behavior");
    const publish = f.worktree(
      "publish",
      "WO-999",
      "--target-worktree",
      "--branch",
      "fix/reviewed-behavior",
      "--title",
      "fix: preserve reviewed behavior",
      "--body-file",
      "reviewed-body.md",
    );
    let forgeState = null;
    try {
      forgeState = JSON.parse(readFileSync(forge.state, "utf8"));
    } catch {}
    out[id] = {
      reviewExit: 0,
      phaseAfterReview: state.phase,
      reviewedCommitIsSubject: state.targetSubject?.commit === subject,
      publishExit: publish.status,
      publishRefusal: refusal(publish.stderr, {
        [f.baseCommit]: "activation",
        [subject]: "subject",
      }),
      pullsOpened: Object.keys(forgeState?.pulls ?? {}).length,
    };
  });

withFixture((f) => {
  mergedOnMain(f, "x");
  f.mapClone();
  f.start();
  takeMain(f);
  const subject = commit(f, "fix: preserve reviewed behavior");
  const tree = git(f.target, "rev-parse", "HEAD^{tree}");
  git(f.target, "update-ref", "refs/remotes/origin/main", tree);
  const { result } = review(f);
  out.C = {
    exit: result.status,
    saysAbsent: /refs\/remotes\/origin\/main was absent/u.test(result.stderr),
    activationRange: Number(
      git(f.target, "rev-list", "--count", `${f.baseCommit}..${subject}`),
    ),
  };
});

withFixture((f) => {
  f.mapClone();
  f.start();
  const subject = commit(f, long("z"));
  const tree = git(f.target, "rev-parse", "HEAD^{tree}");
  const orphan = git(f.target, "commit-tree", tree, "-m", "unrelated");
  git(f.target, "update-ref", "refs/remotes/origin/main", orphan);
  const { result } = review(f);
  out.D = {
    exit: result.status,
    refusal: refusal(result.stderr, {
      [f.baseCommit]: "activation",
      [subject]: "subject",
    }),
    namesTrackingRef: result.stderr.includes("refs/remotes/origin/main"),
  };
});

console.log(JSON.stringify(out, null, 2));
