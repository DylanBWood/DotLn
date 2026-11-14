// Part N's evidence: the outputs of criteria N2 to N5 on the target fixture,
// the index card of the order under each registration value, and the
// listing of the target branch and of the records branch after criterion N2.
//
//   node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-n/evidence.mjs
//
// It writes records.txt beside itself. Paths of the fixture and of the host
// are written as <fixture>, <launchpad> and <node>.
import test from "node:test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { write } from "../../../../scripts/lib/helpers.mjs";
import {
  actorArgs,
  commitInstanceRecords,
  git,
  publishRecordsOrder,
  publishRecordsTarget,
  reviewedRecordsOrder,
  withFixture,
} from "../../../../scripts/lib/target-worktree-fixture.mjs";
import {
  readIndex,
  renderHistory,
  renderIndex,
} from "../../../../scripts/work-orders.mjs";

const here = dirname(fileURLToPath(import.meta.url));

test("Part N: the records flow under each registration value", () => {
  const out = [];
  const say = (heading, lines) => out.push(`## ${heading}`, "", ...lines, "");
  const plain = (f, text) =>
    String(text)
      .replaceAll(f.orderRoot, "<launchpad>")
      .replaceAll(f.main, "<main>")
      .replaceAll(f.base, "<fixture>")
      .replaceAll(process.execPath, "<node>")
      .replaceAll(tmpdir(), "<tmp>");
  const lines = (f, text, pattern) =>
    plain(f, text)
      .split("\n")
      .filter((line) => pattern.test(line))
      .map((line) => (line.length > 700 ? `${line.slice(0, 700)} […]` : line));
  const offered = (f) =>
    JSON.parse(f.ok(f.resume(["status", "--json"]))).legalNextActions;
  const listing = (repository, revision) =>
    git(repository, "ls-tree", "-r", "--name-only", revision).split("\n");
  // The order's card in the index, as the index renders it from the order
  // worktree's committed state: its Records line, or that it has none.
  const card = (f) => {
    // The lifecycle fixture carries no planning map, which the index reads:
    // an empty one, written after the publishes, which need a clean tree.
    write(
      f.orderRoot,
      "records/planning/work-order-map.md",
      "# Plan\n\n<!-- dotln-work-order-sequence:start -->\n\n<!-- dotln-work-order-sequence:end -->\n",
    );
    const index = readIndex(f.orderRoot);
    const rendered = `${renderIndex(index)}\n${renderHistory(index)}`;
    const records = rendered
      .split("\n")
      .filter((line) => /^- Record(?:s| [a-z-]+ \d+): /u.test(line));
    return records.length
      ? records.map((line) => plain(f, line))
      : ["(the card holds no Records line)"];
  };
  const filed = (f) => {
    f.ok(f.resume(["target-records", ...actorArgs]));
    commitInstanceRecords(f, "docs: the moved records' removal");
    return git(f.target, "rev-parse", "HEAD");
  };

  // Criterion N2: registered instance.
  withFixture((f) => {
    const { reviewed, passed, planFirst } = reviewedRecordsOrder(f, "instance");
    const step = f.resume(["target-records", ...actorArgs]);
    assert.notEqual(step.status, 0);
    const target = publishRecordsTarget(f);
    assert.equal(target.status, 0, target.stderr);
    const order = publishRecordsOrder(f);
    assert.equal(order.status, 0, order.stderr);
    say('Criterion N2: repositories.target.records is "instance"', [
      `The reviewed target commit: ${reviewed}`,
      `final-review-result pass printed: ${lines(f, passed, /Recorded final review pass/u).join(" ")}`,
      `Offered after the pass (status --json, legalNextActions): ${offered(f).join(", ")}`,
      `resume target-records: exit ${step.status}; ${lines(f, step.stderr, /target-records refused/u).join(" ")}`,
      `The target publish: exit ${target.status}; ${lines(f, target.stdout, /pull request/u).join(" ")}`,
      `The published target head: ${git(join(f.base, "target.git"), "rev-parse", "refs/heads/fix/preserve-reviewed-text")}`,
      `The order publish: exit ${order.status}; ${lines(f, order.stdout, /^WO-999: target order records no release/u).join(" ")}`,
      `The plan-first directory (criterion N5): ${plain(f, planFirst)}`,
      "",
      "The target branch as published (git ls-tree -r --name-only):",
      ...listing(
        join(f.base, "target.git"),
        "refs/heads/fix/preserve-reviewed-text",
      ).map((path) => `  ${path}`),
      "",
      "The records branch on the instance's origin, the order's own paths (git ls-tree -r --name-only refs/heads/wo-999, lines naming WO-999):",
      ...listing(join(f.base, "launchpad.git"), "refs/heads/wo-999")
        .filter((path) => /WO-999/u.test(path))
        .map((path) => `  ${path}`),
      "",
      "The order's index card (criterion N6):",
      ...card(f).map((line) => `  ${line}`),
    ]);
  });

  // Criterion N3: registered target.
  withFixture((f) => {
    const { reviewed, passed, planFirst } = reviewedRecordsOrder(f, "target");
    const before = offered(f);
    const targetWithout = publishRecordsTarget(f);
    const orderWithout = publishRecordsOrder(f);
    assert.notEqual(targetWithout.status, 0);
    assert.notEqual(orderWithout.status, 0);
    const records = filed(f);
    const target = publishRecordsTarget(f);
    assert.equal(target.status, 0, target.stderr);
    const order = publishRecordsOrder(f);
    assert.equal(order.status, 0, order.stderr);
    say('Criterion N3: repositories.target.records is "target"', [
      `The reviewed target commit: ${reviewed}`,
      `final-review-result pass printed: ${lines(f, passed, /Recorded final review pass/u).join(" ")}`,
      `Offered after the pass: ${before.join(", ")}`,
      `The target publish without the step: exit ${targetWithout.status}; ${lines(f, targetWithout.stderr, /TargetRecordsCommitted/u).join(" ")}`,
      `The order publish without the step: exit ${orderWithout.status}; ${lines(f, orderWithout.stderr, /TargetRecordsCommitted/u).join(" ")}`,
      `The records commit the step made: ${records}`,
      `The target publish with it: exit ${target.status}; ${lines(f, target.stdout, /pull request/u).join(" ")}`,
      `The published target head: ${git(join(f.base, "target.git"), "rev-parse", "refs/heads/fix/preserve-reviewed-text")}`,
      `The order publish with it: exit ${order.status}; ${lines(f, order.stdout, /^WO-999: target order records no release/u).join(" ")}`,
      `The plan-first directory (criterion N5): ${plain(f, planFirst)}`,
      "",
      "The order's index card (criterion N6):",
      ...card(f).map((line) => `  ${line}`),
    ]);
  });

  // Criterion N4: filed under the default, then the registration changes.
  withFixture((f) => {
    reviewedRecordsOrder(f);
    const records = filed(f);
    f.config.repositories.target.records = "instance";
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    git(f.main, "add", "-A");
    git(
      f.main,
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "test: keep this repository's records in the instance",
    );
    git(f.main, "push", "-q", "origin", "main");
    const target = publishRecordsTarget(f);
    assert.equal(target.status, 0, target.stderr);
    const order = publishRecordsOrder(f);
    assert.equal(order.status, 0, order.stderr);
    say(
      "Criterion N4: records filed under the default, then the registration set to instance",
      [
        `The records commit: ${records}`,
        `The published target head: ${git(join(f.base, "target.git"), "rev-parse", "refs/heads/fix/preserve-reviewed-text")}`,
        `The order publish: exit ${order.status}; ${lines(f, order.stdout, /^WO-999: target order records no release/u).join(" ")}`,
      ],
    );
  });
  writeFileSync(join(here, "records.txt"), out.join("\n"));
});
