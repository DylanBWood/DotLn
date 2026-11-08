// Criterion 9's two arms in one replayable run, over the target-worktree
// fixture: a target order's records are filed into the target and the
// launchpad's order branch reaches its bare origin through the merge, then
// every relative link of each filed record is read at the commit its footer
// names with `git cat-file -e` on that origin. The control arm runs
// scripts/lib/target-records.mjs at the base commit 898f95ff and the steps in
// the base's order (file, then commit the instance records); the fixed arm
// runs this tree's module and the new order (commit, then file). Writes
// criterion-9-records.json beside this file; fixtures live in system temp and
// every fixture path is redacted from the record.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join, posix } from "node:path";
import {
  actorArgs,
  closeOrder,
  commitInstanceRecords,
  git,
  publicationSetup,
  withFixture,
} from "../../../scripts/lib/target-worktree-fixture.mjs";
import { markdownLinks } from "../../../scripts/lib/markdown-links.mjs";
import { write } from "../../../scripts/lib/helpers.mjs";

const base = "898f95ffde316ad27c6c696883f21a50791c9383";
const module = "scripts/lib/target-records.mjs";
const output = new URL("./criterion-9-records.json", import.meta.url);
const record = {
  schemaVersion: 1,
  comparison:
    "The same target-worktree fixture in both arms: a reviewed target change, a passing final review, a decisions record linking its evidence file and its order, the filing, the instance commits, and the order branch merged and pushed to the launchpad's bare origin. The control arm replaces only scripts/lib/target-records.mjs with its bytes at the base commit and files before committing the instance records, as the base's next-step text said; the fixed arm commits them first.",
  base,
  module,
  arms: {},
};
const footer =
  /\n\nFiled from the launchpad .+?(?: \(its tree at commit ([0-9a-f]{40,64})\); this record's launchpad path was (\S+), and| at commit ([0-9a-f]{40,64}), where this record's path was (\S+): its)/u;

for (const arm of ["control", "fixed"])
  withFixture((f) => {
    const redact = (text) =>
      String(text ?? "")
        .replaceAll(f.base, "<fixture>")
        .replace(/\/(?:private\/)?var\/folders\/\S+/gu, "<tmp>");
    publicationSetup(f);
    f.mapClone();
    f.start();
    if (arm === "control") {
      const bytes = execFileSync("git", ["show", `${base}:${module}`]);
      writeFileSync(join(f.orderRoot, module), bytes);
      git(f.orderRoot, "add", module);
      git(
        f.orderRoot,
        "-c",
        "maintenance.auto=false",
        "commit",
        "-qm",
        "control arm: the base filing module",
      );
    }
    const moduleSha256 = createHash("sha256")
      .update(readFileSync(join(f.orderRoot, module)))
      .digest("hex");
    writeFileSync(join(f.target, "reviewed.txt"), "Reviewed change.\n");
    git(f.target, "add", "reviewed.txt");
    git(
      f.target,
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "fix: preserve reviewed text",
    );
    closeOrder(f);
    write(
      f.orderRoot,
      "records/evidence/WO-999/decisions.md",
      "# Decisions\n\nThe fixture keeps the reviewed behavior, as [the probe](probe.json) and [the order](../../work-orders/WO-999-fixture.md) show.\n",
    );
    write(f.orderRoot, "records/evidence/WO-999/probe.json", "{}\n");
    const steps = [];
    const file = () => {
      const result = f.resume(["target-records", ...actorArgs]);
      steps.push({
        step: "npm run resume -- target-records <actor flags>",
        exitCode: result.status,
        ...(result.status ? { stderr: redact(result.stderr).trim() } : {}),
      });
      return result.status;
    };
    if (arm === "fixed") {
      // Filed before the records commit, the fixed module refuses naming it.
      assert.notEqual(file(), 0);
      commitInstanceRecords(f);
      steps.push({ step: "commit the instance records" });
      assert.equal(file(), 0);
    } else {
      assert.equal(file(), 0);
      commitInstanceRecords(f, "docs: the instance records, after the filing");
      steps.push({ step: "commit the instance records" });
    }
    commitInstanceRecords(f, "docs: the moved records' removal");
    steps.push({ step: "commit the moved records' removal" });
    git(f.main, "merge", "-q", "--no-ff", "-m", "Merge records", "wo-999");
    git(f.main, "push", "-q", "origin", "main");
    steps.push({
      step: "merge wo-999 and push main to the launchpad's bare origin",
    });
    const origin = join(f.base, "launchpad.git");
    const filed = [];
    for (const path of [
      "docs/evidence/WO-999/decisions.md",
      "docs/verifications/WO-999/VER-001.md",
      "docs/final-reviews/WO-999/FINAL-001.md",
      "docs/work-orders/WO-999-fixture.md",
    ]) {
      const text = readFileSync(join(f.target, path), "utf8");
      const found = footer.exec(text);
      const commit = found[1] ?? found[3];
      const source = found[2] ?? found[4];
      const links = markdownLinks(text.slice(0, found.index))
        .map(({ href }) => decodeURIComponent(href.split("#")[0]))
        .filter((href) => href && !/^[a-z][a-z0-9+.-]*:/iu.test(href))
        .map((href) => {
          const target = posix.normalize(
            posix.join(posix.dirname(source), href),
          );
          const status = spawnSync("git", [
            "--git-dir",
            origin,
            "cat-file",
            "-e",
            `${commit}:${target}`,
          ]).status;
          return { link: href, path: target, catFileExitCode: status };
        });
      filed.push({
        record: path,
        footerCommit: commit,
        footerCommitHoldsTheRecord:
          spawnSync("git", [
            "--git-dir",
            origin,
            "cat-file",
            "-e",
            `${commit}:${source}`,
          ]).status === 0,
        source,
        links,
      });
    }
    const unresolved = filed
      .flatMap((row) => row.links)
      .filter((link) => link.catFileExitCode !== 0).length;
    record.arms[arm] = {
      moduleSha256,
      steps,
      filed,
      linksChecked: filed.reduce((count, row) => count + row.links.length, 0),
      unresolved,
      exitCode: unresolved ? 1 : 0,
    };
  });

writeFileSync(output, JSON.stringify(record, null, 2) + "\n");
console.log(
  JSON.stringify(
    Object.fromEntries(
      Object.entries(record.arms).map(([arm, row]) => [arm, row.exitCode]),
    ),
  ),
);
assert.equal(record.arms.fixed.exitCode, 0);
assert.equal(record.arms.control.exitCode, 1);
assert.ok(record.arms.fixed.linksChecked >= 2);
