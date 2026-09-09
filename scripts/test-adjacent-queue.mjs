import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  ADJACENT_QUEUE,
  applyAdjacentCommand,
  nextAdjacentItem,
  readAdjacentQueue,
} from "./lib/adjacent-queue.mjs";
import { main } from "./adjacent-work.mjs";
import { runGit } from "./lib/git.mjs";

const workOrder = "WO-999";
const at = "2030-01-02T12:00:00.000Z";
const spec = (summary, priority = 10) => ({
  summary,
  cause: "A reproduced fixture boundary mismatch.",
  fix: "Correct the bounded predicate and preserve the required rejection.",
  paths: ["src/fixture.mjs"],
  checks: ["node --test fixture.test.mjs"],
  priority,
});
const fixture = (run) => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-adjacent-")));
  try {
    return run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};
const apply = (
  root,
  action,
  actor = "executor",
  expectedRevision = readAdjacentQueue(root, workOrder).revision,
) =>
  applyAdjacentCommand(
    root,
    workOrder,
    { expectedRevision, actor, action },
    at,
  );
const item = (root, index = 0) => {
  const value = readAdjacentQueue(root, workOrder).items[index];
  return { itemId: value.id, itemRevision: value.revision };
};
const announce = (root, index = 0, level = "intent") =>
  apply(root, {
    kind: "announce",
    ...item(root, index),
    level,
    statement:
      level === "intent"
        ? "I intend to repair the named fixture next within its queued paths."
        : "I recommend the named fixture repair.",
  });
const checkIn = (root, channel = "message-boundary") =>
  apply(root, {
    kind: "check-in",
    channel,
    observation: "Synthetic actor-attested message checkpoint.",
  });
const start = (root, index = 0) =>
  apply(root, { kind: "start", ...item(root, index) });

test("WO-042 queued fixes require diagnosis, announcement, steering checkpoint and current priority", () =>
  fixture((root) => {
    assert.equal(readAdjacentQueue(root, workOrder).revision, 0);
    assert.throws(
      () =>
        apply(root, {
          kind: "queue",
          item: { ...spec("incomplete"), cause: "" },
        }),
      /diagnosed cause/u,
    );
    apply(root, { kind: "queue", item: spec("first", 20) });
    apply(root, { kind: "queue", item: spec("second", 10) });
    assert.equal(
      nextAdjacentItem(readAdjacentQueue(root, workOrder)).id,
      item(root, 1).itemId,
    );
    assert.throws(() => start(root, 1), /announcement/u);
    announce(root, 1);
    assert.throws(() => start(root, 1), /check-in/u);
    checkIn(root, "unavailable");
    assert.throws(() => start(root, 1), /check-in/u);
    checkIn(root);
    assert.throws(() => start(root), /priority/u);
    start(root, 1);
    announce(root);
    checkIn(root);
    assert.throws(() => start(root), /already running/u);
    assert.throws(
      () => apply(root, { kind: "complete", ...item(root, 1), results: [] }),
      /incomplete/u,
    );
    assert.throws(
      () =>
        apply(root, {
          kind: "complete",
          ...item(root, 1),
          results: [
            {
              command: spec("x").checks[0],
              exitCode: 1,
              evidenceRef: "fixture-failure",
            },
          ],
        }),
      /passing/u,
    );
    apply(root, {
      kind: "complete",
      ...item(root, 1),
      results: [
        {
          command: spec("x").checks[0],
          exitCode: 0,
          evidenceRef: "fixture-pass",
        },
      ],
    });
    assert.equal(
      readAdjacentQueue(root, workOrder).items[1].status,
      "completed",
    );
    assert.throws(() => start(root), /fresh operator-message/u);
    checkIn(root);
    assert.equal(start(root).items[0].status, "running");
  }));

test("WO-042 operator steering supersedes queued intent without erasing history", () =>
  fixture((root) => {
    for (const label of ["veto", "known", "defer", "revise"])
      apply(root, { kind: "queue", item: spec(label) });
    announce(root, 3);
    checkIn(root);
    const before = readFileSync(join(root, ADJACENT_QUEUE), "utf8");
    const priorItem = item(root, 3);
    const priorRevision = readAdjacentQueue(root, workOrder).revision;
    apply(
      root,
      {
        kind: "revise",
        ...priorItem,
        changes: { paths: ["src/other.mjs"], priority: 0 },
        reason: "Operator changed scope and order.",
      },
      "operator",
    );
    assert.throws(
      () => apply(root, { kind: "start", ...priorItem }),
      /stale item/u,
    );
    assert.throws(
      () =>
        apply(
          root,
          {
            kind: "check-in",
            channel: "message-boundary",
            observation: "Old queue observation.",
          },
          "executor",
          priorRevision,
        ),
      /stale queue/u,
    );
    assert.throws(() => start(root, 3), /announcement/u);
    announce(root, 3);
    checkIn(root);
    for (const [index, status, target] of [
      [0, "vetoed", null],
      [1, "known-issue", null],
      [2, "deferred", "planning"],
    ])
      apply(
        root,
        {
          kind: "dispose",
          ...item(root, index),
          status,
          reason: "Synthetic operator disposition.",
          target,
        },
        "operator",
      );
    assert.throws(() => start(root, 3), /fresh operator-message/u);
    checkIn(root);
    start(root, 3);
    assert.ok(
      readFileSync(join(root, ADJACENT_QUEUE), "utf8").startsWith(before),
    );
    assert.deepEqual(
      readAdjacentQueue(root, workOrder).items.map(({ status }) => status),
      ["vetoed", "known-issue", "deferred", "running"],
    );
  }));

test("WO-042 a recommendation waits for attributed operator direction and fresh check-in", () =>
  fixture((root) => {
    apply(root, { kind: "queue", item: spec("recommended") });
    announce(root, 0, "recommendation");
    checkIn(root);
    assert.throws(() => start(root), /operator-directed/u);
    assert.throws(
      () =>
        apply(root, {
          kind: "direct",
          ...item(root),
          reason: "Self-approved.",
        }),
      /operator direction/u,
    );
    apply(
      root,
      {
        kind: "direct",
        ...item(root),
        reason: "Operator directed this queued repair.",
      },
      "operator",
    );
    assert.throws(() => start(root), /check-in/u);
    checkIn(root, "async-input");
    assert.equal(start(root).items[0].status, "running");
  }));

test("WO-042 queue persistence refuses escape, truncation, stale writers and foreign work", () =>
  fixture((root) => {
    const outside = join(root, "outside");
    mkdirSync(outside);
    mkdirSync(join(root, "docs"));
    symlinkSync(outside, join(root, "docs/control"));
    assert.throws(() => readAdjacentQueue(root, workOrder), /symlink/u);
    rmSync(join(root, "docs/control"));
    apply(root, { kind: "queue", item: spec("contained") });
    assert.throws(() => readAdjacentQueue(root, "WO-998"), /mismatch/u);
    const path = join(root, ADJACENT_QUEUE);
    const source = readFileSync(path, "utf8");
    writeFileSync(path, source.trimEnd());
    assert.throws(
      () => readAdjacentQueue(root, workOrder),
      /incomplete queue tail/u,
    );
    writeFileSync(path, source);
    const lock = join(root, "docs/control/local/adjacent-work.lock");
    mkdirSync(lock);
    assert.throws(() => checkIn(root), /writer active/u);
    rmSync(lock, { recursive: true });
    assert.throws(
      () =>
        apply(root, {
          kind: "queue",
          item: { ...spec("escape"), paths: ["../outside"] },
        }),
      /paths/u,
    );
    assert.equal(readFileSync(path, "utf8"), source);
  }));

test("WO-042 actual queue CLI uses the selected work order and read-only listing", () =>
  fixture((root) => {
    runGit(root, ["init", "-q", "-b", "wo-999"]);
    mkdirSync(join(root, "docs/control/orders"), { recursive: true });
    const controlPath = join(root, "docs/control/orders/WO-999.jsonl");
    const activation = {
      schemaVersion: 1,
      type: "WorkOrderActivated",
      workOrderId: workOrder,
      workOrderPath: "docs/work-orders/WO-999-fixture.md",
      recordedAt: at,
    };
    writeFileSync(controlPath, JSON.stringify(activation) + "\n");
    assert.equal(main(["list"], root).revision, 0);
    const request = join(root, "request.json");
    writeFileSync(
      request,
      JSON.stringify({
        expectedRevision: 0,
        actor: "executor",
        action: { kind: "queue", item: spec("CLI candidate") },
      }),
    );
    assert.equal(
      main(["apply", "--file", request], root).next,
      "adjacent-0001",
    );
    const source = readFileSync(join(root, ADJACENT_QUEUE), "utf8");
    assert.equal(main(["list"], root).revision, 1);
    assert.equal(readFileSync(join(root, ADJACENT_QUEUE), "utf8"), source);
    writeFileSync(
      controlPath,
      JSON.stringify(activation) +
        "\n" +
        JSON.stringify({ ...activation, type: "ImplementationReady" }) +
        "\n",
    );
    assert.throws(
      () => main(["apply", "--file", request], root),
      /executor\/fixer phase/u,
    );
    assert.equal(main(["list"], root).items.length, 1);
  }));
