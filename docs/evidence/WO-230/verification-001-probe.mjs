// WO-230 VER-001 probes, run once under node scripts/harness.mjs bounded --.
// A: the base branch advanced past the commit the subject descends from, so
// the merge base differs from the fetched head (receipt 054, criterion 1).
// B: the fetched base branch is unrelated to the activation base (receipt
// 054, criterion 5). D: a tree equal to the activation base with the remote
// unreachable, then reachable (the refusal order of a fetch-first publish).
import {
  withFixture,
  publicationSetup,
  git,
  actor,
  actorArgs,
} from "../../../scripts/lib/target-worktree-fixture.mjs";
import { write } from "../../../scripts/lib/helpers.mjs";
import { docPath } from "../../../scripts/lib/config.mjs";
import { readFileSync, existsSync, renameSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const verify = (f) => {
  write(
    f.orderRoot,
    "draft-body.md",
    "## Draft\n\nPreserve reviewed behavior.\n",
  );
  f.ok(f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999", "--review"]));
  f.ok(f.resume(["implementation-ready", ...actorArgs]));
  f.ok(f.resume(["verify"]));
  write(
    f.orderRoot,
    "records/verifications/WO-999/VER-001.md",
    `# Verification fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`,
  );
  f.ok(f.resume(["verification-result", "pass", ...actorArgs]));
  return () =>
    f.worktree(
      "publish",
      "WO-999",
      "--target-worktree",
      "--draft",
      "--branch",
      "feat/reviewed-behavior",
      "--title",
      "feat: preserve reviewed behavior",
      "--body-file",
      "draft-body.md",
    );
};
const rowsOf = (body) =>
  [...body.matchAll(/^\| ([^|]+) \| (\d+) \| (\d+) \|$/gm)].map(
    (m) => `${m[1]} +${m[2]} -${m[3]}`,
  );
const closing = (body) => body.trimEnd().split("\n").at(-1);
const pulledBody = (forge) =>
  JSON.parse(readFileSync(forge.state, "utf8")).pulls[7].body;
const out = {};

withFixture((f) => {
  const later = git(f.clone, "rev-parse", "main");
  write(f.clone, "beyond.txt", "after the subject took the base\n");
  git(f.clone, "add", "-A");
  git(f.clone, "-c", "maintenance.auto=false", "commit", "-qm", "test: beyond");
  git(f.clone, "push", "-q", "origin", "main");
  const beyond = git(f.clone, "rev-parse", "HEAD");
  const forge = publicationSetup(f);
  f.mapClone();
  f.start();
  git(f.target, "merge", "--ff-only", later);
  write(f.target, "reviewed.txt", "Reviewed change.\n");
  const result = verify(f)();
  const body = result.status === 0 ? pulledBody(forge) : null;
  out.A = {
    status: result.status,
    rows: body && rowsOf(body),
    closing: body && closing(body),
    head: git(f.target, "rev-parse", "refs/dotln/draft/WO-999"),
    mergeBase: later,
    fetchedHead: beyond,
    activation: f.baseCommit,
    namesBeyond: body ? body.includes("beyond.txt") : null,
  };
});

withFixture((f) => {
  const forge = publicationSetup(f);
  f.mapClone();
  f.start();
  write(f.target, "reviewed.txt", "Reviewed change.\n");
  const draft = verify(f);
  const remote = join(f.base, "target.git");
  const orphan = git(
    remote,
    "commit-tree",
    `${f.baseCommit}^{tree}`,
    "-m",
    "test: rewritten",
  );
  git(remote, "update-ref", "refs/heads/main", orphan);
  const result = draft();
  const body = result.status === 0 ? pulledBody(forge) : null;
  out.B = {
    status: result.status,
    rows: body && rowsOf(body),
    closing: body && closing(body),
    head: git(f.target, "rev-parse", "refs/dotln/draft/WO-999"),
    activation: f.baseCommit,
    remoteMain: orphan,
  };
});

withFixture((f) => {
  const forge = publicationSetup(f);
  f.mapClone();
  f.start();
  const draft = verify(f);
  const remote = join(f.base, "target.git");
  renameSync(remote, `${remote}.offline`);
  const offline = draft();
  renameSync(`${remote}.offline`, remote);
  const eventsPath = docPath(
    f.main,
    "control",
    "local/target-publications/WO-999/events.jsonl",
  );
  const events = existsSync(eventsPath)
    ? readFileSync(eventsPath, "utf8")
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((row) => JSON.parse(row).type)
    : [];
  const online = draft();
  out.D = {
    offline: { status: offline.status, refusal: offline.stderr.trim() },
    eventsAfterOffline: events,
    online: { status: online.status, refusal: online.stderr.trim() },
    forgeCalls: existsSync(forge.log),
  };
});

console.log(JSON.stringify(out, null, 2));
assert.equal(out.A.status, 0);
assert.deepEqual(out.A.rows, ["reviewed.txt +1 -0"]);
assert.equal(out.A.namesBeyond, false);
assert.equal(
  out.A.closing,
  `1 file changed from base ${out.A.mergeBase} to head ${out.A.head}; activated at base ${out.A.activation}, which ${out.A.mergeBase} descends from.`,
);
assert.equal(out.B.status, 0);
assert.deepEqual(out.B.rows, ["reviewed.txt +1 -0"]);
assert.equal(
  out.B.closing,
  `1 file changed from base ${out.B.activation} to head ${out.B.head}.`,
);
assert.equal(out.D.offline.status, 1);
assert.match(
  out.D.offline.refusal,
  /fetch failed for origin base branch main on github\.com\/dotln-fixture\/target/u,
);
assert.equal(out.D.online.status, 1);
assert.match(out.D.online.refusal, /no change to draft/u);
assert.equal(out.D.forgeCalls, false);
