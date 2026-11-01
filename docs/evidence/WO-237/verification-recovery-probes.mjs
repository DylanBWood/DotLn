// Reproduce only the four outstanding recovery claims in WO-237/reviews.md.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const repo = realpathSync(process.cwd());
assert.equal(
  execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: repo,
    encoding: "utf8",
  }).trim(),
  repo,
);
const temp = await import(
  pathToFileURL(join(repo, "scripts/lib/temporary-roots.mjs")).href
);
const { judgeTemporaryRoot } = await import(
  pathToFileURL(join(repo, "scripts/lib/temporary-prune.mjs")).href
);
const container = temp.createFixtureRoot(
  join(tmpdir(), "dotln-wo237-recovery-verifier-"),
);
const results = [];
const owner = {
  pid: 2147483647,
  birth: "dead",
  gateId: undefined,
  suite: undefined,
  session: undefined,
};
const fake = (name) => {
  const root = join(container, name);
  mkdirSync(root);
  execFileSync("git", ["-c", "init.templateDir=", "init", "-q", "-b", "main"], {
    cwd: root,
  });
  assert.equal(realpathSync(root), root);
  return root;
};
const segment = (root, token) =>
  join(root, ".runtime/temporary-roots/roots", `${token}.jsonl`);
const owned = (root, path) => {
  temp.ensureTemporaryRoot(path, {
    class: "gate-fixture",
    repository: root,
    owner,
  });
  const r = temp.readTemporaryOwner(path);
  delete r.fixtureOwner;
  r.createdAt = "2020-01-01T00:00:00Z";
  r.endedAt = r.createdAt;
  temp.writeTemporaryOwner(path, r);
  return r;
};
const move = (root, path, r) => {
  const aside = temp.temporaryRemovalAside(path, r.token);
  appendFileSync(
    segment(root, r.token),
    JSON.stringify({ action: "moving", path, token: r.token, aside }) + "\n",
  );
  renameSync(path, aside);
  return aside;
};
const probe = (name, run) => {
  try {
    results.push({ name, reproduced: true, observed: run() });
  } catch (e) {
    results.push({
      name,
      reproduced: false,
      error: String(e.stack ?? e).replaceAll(container, "<fixture>"),
    });
  }
};
try {
  probe(
    "two stopped removals leave an unbound child and retire its segment",
    () => {
      const root = fake("double-stop"),
        p = join(root, "parent"),
        pr = owned(root, p),
        c = join(p, "child"),
        cr = owned(root, c);
      writeFileSync(join(c, "payload"), "retained\n");
      const pa = move(root, p, pr),
        found = join(pa, "child"),
        ca = move(root, found, cr);
      assert.match(
        temp.temporaryLedgerContradiction(ca, temp.readTemporaryOwner(ca)),
        /does not register/,
      );
      temp.retireTemporaryLedger(root);
      assert.equal(existsSync(segment(root, cr.token)), false);
      assert.equal(readFileSync(join(ca, "payload"), "utf8"), "retained\n");
      return {
        childUnbound: true,
        childSegmentRetired: true,
        payloadRetained: true,
      };
    },
  );
  probe(
    "a child removed from its parents aside is ledgered at its relocated path",
    () => {
      const root = fake("child-finish"),
        p = join(root, "parent"),
        pr = owned(root, p),
        c = join(p, "child"),
        cr = owned(root, c),
        pa = move(root, p, pr),
        found = join(pa, "child");
      temp.removeTemporaryRoot(found, cr.token);
      const rows = temp
        .temporaryLedger(root)
        .filter((r) => r.token === cr.token);
      const removed = rows.filter((r) => r.action === "removed").at(-1);
      assert.equal(removed.path, found);
      assert.notEqual(removed.path, c);
      return {
        registeredPath: "parent/child",
        removalPath: "parent-aside/child",
        pathsDiffer: true,
        parentRetained: existsSync(pa),
      };
    },
  );
  probe(
    "the final owner-marker removal window leaves an empty unmarked aside retained",
    () => {
      const root = fake("marker-window"),
        p = join(root, "root"),
        r = owned(root, p),
        aside = move(root, p, r);
      rmSync(join(aside, temp.TEMPORARY_OWNER_FILE));
      const judged = judgeTemporaryRoot(
        root,
        aside,
        {},
        { processes: [], holders: [], worktrees: [], openPaths: [] },
      );
      assert.ok(judged.retained);
      assert.match(judged.retained.reason, /unmarked root/);
      assert.equal(existsSync(aside), true);
      return { asideExists: true, reason: judged.retained.reason };
    },
  );
  probe(
    "a parent registered elsewhere does not hold its nested childs ledger segment",
    () => {
      const a = fake("owner-a"),
        b = fake("owner-b"),
        p = join(a, "parent"),
        pr = owned(a, p),
        c = join(p, "child"),
        cr = owned(b, c);
      writeFileSync(join(c, "payload"), "retained\n");
      const aside = move(a, p, pr);
      temp.retireTemporaryLedger(b);
      assert.equal(existsSync(segment(b, cr.token)), false);
      assert.equal(
        readFileSync(join(aside, "child/payload"), "utf8"),
        "retained\n",
      );
      return { childSegmentRetired: true, payloadRetained: true };
    },
  );
} finally {
  temp.removeTemporaryPath(container, { recursive: true, force: true });
}
console.log(
  JSON.stringify(
    {
      schemaVersion: 1,
      workOrder: "WO-237",
      recordedAt: new Date().toISOString(),
      results,
    },
    null,
    2,
  ),
);
if (results.some((r) => !r.reproduced)) process.exitCode = 1;
