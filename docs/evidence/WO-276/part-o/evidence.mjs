// Part O's evidence: the Layout section of a fresh export's workstreams page
// (criterion O1), and the four runs of criterion O2 in the exported instance
// of the planning fixture.
//
//   PART_O_PLANNING_OUTPUT=<file> node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-o/evidence.mjs
//
// It writes exported-layout-section.txt and runs.txt beside itself. The
// four runs are the line the planning fixture's long case prints for them:
// PART_O_PLANNING_OUTPUT names the kept output of a run of that case
// already made (a focused run's, or the planning gate's own), and the case
// is run here, about four minutes, only where none is named. Paths of the
// fixture are written as <fixture>.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { kit } from "../../../../scripts/lib/launchpad-fixture.mjs";
import { markdownSection } from "../../../../scripts/lib/markdown-links.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const save = (name, text) => writeFileSync(join(here, name), text);

test("Part O: the exported workstreams page's Layout section", () => {
  const page = readFileSync(join(kit, "docs/workstreams/README.md"), "utf8");
  const layout = markdownSection(page, "Layout", { depths: [2] });
  assert.ok(layout, "the exported page has a Layout section");
  const sentence =
    /For an\s+initiative it also holds a layout \(§Layout\): the plan as it stands, whose\s+planned items are not member orders\./u.exec(
      page.split("\n## ")[0],
    );
  assert.ok(sentence, "the page's opening names the layout");
  save(
    "exported-layout-section.txt",
    [
      "A fresh export's docs/workstreams/README.md: the sentence of its opening that names the layout, then its Layout section whole.",
      "",
      sentence[0],
      "",
      `## Layout${layout.body.trimEnd()}`,
      "",
    ].join("\n"),
  );
});

test("Part O: criterion O2's four runs in the exported instance", () => {
  const environment = { ...process.env };
  delete environment.NODE_TEST_CONTEXT;
  const kept = process.env.PART_O_PLANNING_OUTPUT;
  const ran = kept
    ? { status: 0, stdout: readFileSync(kept, "utf8"), stderr: "" }
    : spawnSync(
        process.execPath,
        [
          "--test",
          "--test-name-pattern=planning and release-close reads run in a fresh exported instance",
          "scripts/test-launchpad-planning.mjs",
        ],
        {
          cwd: root,
          env: environment,
          encoding: "utf8",
          maxBuffer: 256 * 1024 * 1024,
        },
      );
  assert.equal(ran.status, 0, `${ran.stdout}\n${ran.stderr}`.slice(-4000));
  const line = /^LAYOUT-RUNS (.+)$/mu.exec(ran.stdout);
  assert.ok(line, "the planning case printed its layout runs");
  const runs = JSON.parse(line[1]);
  assert.deepEqual(
    runs.map((run) => [run.command, run.exitCode === 0]),
    [
      ["npm run work-orders -- index --check", true],
      ["npm run plan -- check", true],
      ["npm run work-orders -- index --check", false],
      ["npm run plan -- check", false],
    ],
  );
  const setups = [
    "a workstream document with a layout of three planned items and no filed member, committed, the index refreshed",
    "the same tree",
    "a member, WO-905, added to the document's marked block with no order file",
    "the same tree",
  ];
  save(
    "runs.txt",
    `${runs
      .map(
        (run, index) =>
          `## ${run.command}\n\nIn the exported instance: ${setups[index]}.\nExit ${run.exitCode}.\n\n${run.output}\n`,
      )
      .join("\n")}`,
  );
});
