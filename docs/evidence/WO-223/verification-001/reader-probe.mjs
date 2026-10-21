// VER-001 reader probe for WO-223. `probes.mjs add-probes <snapshot>` copies
// this file to <snapshot>/scripts/; run it there with node --test under the
// bounded wrapper. It prints one PROBE-READER line: the same moved record read
// in five arrangements of the synthetic target-worktree fixture.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readDecisions } from "./lib/meta.mjs";
import { readTargetRecord } from "./lib/target-record-reader.mjs";
import {
  cloneMapPath,
  targetWorktreeForOrder,
} from "./lib/target-worktrees.mjs";
import { readControl } from "./lib/control-store.mjs";
import { write } from "./lib/helpers.mjs";
import {
  withFixture,
  publicationSetup,
  closeOrder,
  actorArgs,
  git,
} from "./lib/target-worktree-fixture.mjs";

const attempt = (fn) => {
  try {
    return { ok: true, value: fn() };
  } catch (error) {
    return { ok: false, error: error.message.slice(0, 400) };
  }
};

test("VERIFIER PROBE reader lookup variations", () =>
  withFixture((f) => {
    publicationSetup(f);
    f.mapClone();
    f.start();
    closeOrder(f);
    const decision = {
      id: "WO-999-D001",
      date: "2026-10-20",
      dispatch: "resume: next",
      decision: "Keep the fixture behavior.",
      evidence: ["Fixture commit."],
      rejected: [],
      reopenWhen: "The fixture contract changes.",
    };
    write(
      f.orderRoot,
      "records/evidence/WO-999/decisions.md",
      `# Decisions\n\n## WO-999-D001\n\n\`\`\`json\n${JSON.stringify(decision)}\n\`\`\`\n`,
    );
    f.ok(f.resume(["target-records", ...actorArgs]));
    const state = readControl(f.orderRoot).orders.get("WO-999").state;
    const record = readDecisions(f.orderRoot)[0].targetRecord;
    const read = (root) => () =>
      readTargetRecord(root, state, record).includes(decision.id);
    const out = {
      phase: state.phase,
      registryInOrderRoot: Boolean(
        targetWorktreeForOrder(f.orderRoot, "WO-999")?.clone,
      ),
      registryInMain: Boolean(targetWorktreeForOrder(f.main, "WO-999")?.clone),
      mapInMain: existsSync(cloneMapPath(f.main)),
      mapInOrderRoot: existsSync(cloneMapPath(f.orderRoot)),
    };
    const mapping = readFileSync(cloneMapPath(f.main));
    // R1: the primary stays on main; its mapping (the only one) is removed
    // while both registry entries for the order remain.
    rmSync(cloneMapPath(f.main));
    out.r1FromOrderRoot = attempt(read(f.orderRoot));
    out.r1FromMain = attempt(read(f.main));
    writeFileSync(cloneMapPath(f.main), mapping);
    // R2: a prunable worktree entry whose directory is gone, with the
    // primary on a planning branch and no worktree on main.
    const extra = join(f.base, "launchpad-extra");
    git(f.main, "worktree", "add", "-q", extra, "-b", "probe-extra");
    rmSync(extra, { recursive: true, force: true });
    git(f.main, "switch", "-q", "-c", "planning/probe");
    out.r2Prunable = attempt(read(f.orderRoot));
    // R3: a worktree on main without a mapping beside the primary holding it.
    const mainWorktree = join(f.base, "launchpad-main");
    git(f.main, "worktree", "add", "-q", mainWorktree, "main");
    out.r3PrimaryBeforeMain = attempt(read(f.orderRoot));
    // R4: the running checkout is that main worktree.
    out.r4FromMainWorktree = attempt(read(mainWorktree));
    // R5: the decisions reader from the order worktree in this arrangement.
    out.r5ReadDecisions = attempt(() => readDecisions(f.orderRoot).length);
    console.log("PROBE-READER " + JSON.stringify(out));
    assert.ok(true);
  }));
