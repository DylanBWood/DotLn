import assert from "node:assert/strict";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  withFixture,
  reviewedRecordsOrder,
  publishRecordsTarget,
  git,
} from "../../../../scripts/lib/target-worktree-fixture.mjs";

// The existing Part N fixture supplies only local remotes and a forge double.
// Change its prior-cycle record from untouched to deleted in the reviewed change.
let result;
withFixture(
  (f) => {
    const originalStart = f.start;
    const path = "docs/evidence/WO-999/decisions.md";
    f.start = (...args) => {
      const value = originalStart(...args);
      rmSync(join(f.target, path));
      return value;
    };
    const { reviewed } = reviewedRecordsOrder(f, "instance");
    assert.equal(existsSync(join(f.target, path)), false);
    const published = publishRecordsTarget(f);
    assert.notEqual(published.status, 0);
    assert.match(
      published.stderr,
      /reviewed target change holds this order's records/u,
    );
    result = {
      scenario:
        "A reviewed target change deletes an earlier cycle's record while current records stay in the instance",
      recordAbsentAtReviewedHead: true,
      changedPaths: git(f.target, "diff", "--name-status", "HEAD^", "HEAD"),
      exitCode: published.status,
      refusal: published.stderr
        .split("\n")
        .find((line) => line.includes("reviewed target change holds")),
    };
  },
  {
    baseFiles: {
      "docs/evidence/WO-999/decisions.md":
        "# Decisions\n\nAn earlier cycle's.\n",
    },
  },
);
writeFileSync(process.argv[2], JSON.stringify(result, null, 2) + "\n");
