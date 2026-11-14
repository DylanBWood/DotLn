// Part I's evidence: criterion I1's three publish outputs and criterion
// I2's preview on the update fixture, the time the publish's reading of the
// merge takes there, and the hook's count for each of criterion I3's four
// spellings.
//
//   node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-i/evidence.mjs
//
// It writes, beside itself: preview.txt (criterion I2), publish.txt
// (criterion I1's three outputs) and results.json. The fixture is the one
// the launchpad suite's case uses (`updateMergeFixture`): a committed export
// with a forge stand-in as its origin, a starter revision under the ref a
// fetch of the starter leaves, and an instance commit on main; both sides
// change the seeded first order and the budgets file.
import test from "node:test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  git,
  scratch,
  updateMergeFixture,
} from "../../../../scripts/lib/launchpad-fixture.mjs";
import { judgeUpdateMerge } from "../../../../scripts/launchpad.mjs";
import { installLaunchpadForge } from "../../../../scripts/test-target-publication-fixture.mjs";
import { kitWorkerLaunch } from "../../../../packages/skeleton/dist/src/harness-host.js";

const here = dirname(fileURLToPath(import.meta.url));
const save = (name, text) => writeFileSync(join(here, name), text);

test("Part I: the publish's three outcomes, the preview's section, the reading's time and the hook's counts", () => {
  const fixture = updateMergeFixture("part-i-update", installLaunchpadForge);
  const { destination, paths, commits } = fixture;
  // Nothing of this host in a saved output: the fixture's directories are
  // named, not printed.
  const plain = (text) =>
    text.replaceAll(destination, "<instance>").replaceAll(scratch, "<scratch>");
  const said = (label, result) =>
    [
      `## ${label}: exit ${result.status}`,
      plain(`${result.stdout}${result.stderr}`).trimEnd(),
      "",
    ].join("\n");
  const results = {
    what: "Part I's observations on the update fixture.",
    command:
      "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-276/part-i/evidence.mjs",
    bothChanged: [paths.budgets, paths.order],
  };

  // Criterion I2: the preview, before any merge.
  const preview = fixture.preview("starter");
  assert.equal(preview.status, 0, preview.stderr);
  const rows = [...preview.stdout.matchAll(/^both changed: (.+)$/gmu)].map(
    (row) => row[1],
  );
  assert.deepEqual(rows, results.bothChanged);
  for (const path of [paths.onlyStarter, paths.added, paths.kitFile])
    assert.ok(!rows.includes(path), path);
  const section = preview.stdout
    .split("\n")
    .filter((line) =>
      /^(?:instance files both sides changed|both changed: )/u.test(line),
    );
  save(
    "preview.txt",
    [
      "# node scripts/launchpad.mjs preview --from starter, in the update fixture: the section step I2 adds.",
      plain(section.join("\n")),
      "",
    ].join("\n"),
  );
  results.preview = { exitCode: preview.status, rows };

  // Criterion I1, first output: the merge as Git made it is refused. The
  // reading is timed here, in this process, on the same branch.
  const merge = fixture.mergeStarter("chore/starter-update-evidence");
  const refused = fixture.publish();
  assert.equal(refused.status, 1, refused.stdout);
  for (const path of results.bothChanged)
    assert.ok(refused.stderr.includes(path), path);
  assert.ok(
    refused.stderr.includes(`git checkout ${commits.instance} -- `),
    refused.stderr,
  );
  assert.match(refused.stderr, /pass --take <path> instead/u);
  const named = JSON.parse(
    git(destination, ["show", "HEAD:KIT-MANIFEST.json"]).stdout,
  ).commit;
  const timings = [];
  for (let run = 0; run < 3; run++) {
    const started = performance.now();
    assert.throws(() => judgeUpdateMerge(destination, named, []));
    timings.push(Math.round(performance.now() - started));
  }
  results.reading = {
    what: "judgeUpdateMerge on the fixture's update branch, three runs, in milliseconds: the starter's revision found by its ref, the merge found, the two files' states read at the base, both sides, the merge and HEAD",
    ms: timings,
  };

  // Third output: one path taken and the other restored.
  git(destination, ["checkout", commits.instance, "--", paths.order]);
  fixture.commitAll("keep the instance's first order");
  const taken = fixture.publish(paths.budgets);
  assert.equal(taken.status, 0, taken.stderr);
  assert.match(taken.stdout, /^taken: docs\/control\/budgets\.json /mu);

  // Second output: a merge commit that holds the instance's bytes for both.
  fixture.mergeStarter("chore/starter-update-evidence-kept", { keep: true });
  fixture.forge.script({});
  const kept = fixture.publish();
  assert.equal(kept.status, 0, kept.stderr);
  assert.doesNotMatch(kept.stdout, /^taken: /mu);

  save(
    "publish.txt",
    [
      "# node scripts/launchpad.mjs update --publish --title <title> --body-file <path>, in the update fixture.",
      `# The update's merge is ${merge.slice(0, 12)}; the instance's side is ${commits.instance.slice(0, 12)}; the starter's revision is ${commits.starter.slice(0, 12)}.`,
      said(
        "1. The merge as Git made it (the budgets merged in silence, the first order settled with the starter's bytes)",
        refused,
      ),
      said(
        "2. A merge commit that holds the instance's bytes for both files",
        kept,
      ),
      said(
        "3. With --take docs/control/budgets.json and the first order restored",
        taken,
      ),
    ].join("\n"),
  );
  results.publish = {
    refused: refused.status,
    kept: kept.status,
    taken: taken.status,
  };

  // Criterion I3: the hook's count for each of the four spellings.
  results.launches = Object.fromEntries(
    [
      "npm run worker -- review",
      "npm run --silent worker -- review",
      "npm run worker --silent -- review",
      "node scripts/worker.mjs review",
    ].map((command) => [command, kitWorkerLaunch(command)?.uses ?? 0]),
  );
  assert.deepEqual(Object.values(results.launches), [1, 1, 1, 1]);

  save("results.json", `${JSON.stringify(results, null, 2)}\n`);
});
