// The second repair's release-history evidence (WO-252-D026). It reads this
// checkout's release tags and runs each release's own harness installer,
// unmodified, beside today's modules, as VER-002's probe did; all writes stay
// under the system temporary directory. Run from the worktree root with
// node scripts/harness.mjs bounded -- node --test docs/evidence/WO-252/repair-3-release-history-probes.mjs
import assert from "node:assert/strict";
import test from "node:test";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { runGit } from "../../../scripts/lib/git.mjs";
import {
  PRE_RECORD_RUNTIME_FILE_LISTS,
  RUNTIME_SNAPSHOT_RECORD,
  provenRuntimeSnapshot,
} from "../../../scripts/lib/harness.mjs";
import {
  createFixtureRoot,
  removeTemporaryPath,
} from "../../../scripts/lib/temporary-roots.mjs";

const checkout = fileURLToPath(new URL("../../../", import.meta.url));
const fixture = JSON.parse(
  readFileSync(
    join(checkout, "scripts/fixtures/wo252-pre-record-snapshots.json"),
    "utf8",
  ),
);
const released = (release) =>
  runGit(
    checkout,
    ["--no-replace-objects", "show", `${release}:scripts/lib/harness.mjs`],
    { trim: false },
  );
const pinnedList = (release) => {
  const text = released(release);
  const start = text.indexOf("const runtimeFiles = [");
  assert.ok(start >= 0, `${release} declares its pinned runtime files`);
  return [
    ...text.slice(start, text.indexOf("]", start)).matchAll(/"([^"]+)"/gu),
  ].map((match) => match[1]);
};
const byList =
  /\.runtime\/harness\/\$\{fnv1a64\(canonicalStringify\(\{ files, inventory \}\)\)\}/u;
const byPinnedFiles =
  /\.runtime\/harness\/\$\{fnv1a64\(JSON\.stringify\(runtimeFiles\)\)\}/u;

test("every release from v0.83.0 to v0.111.1 pinned one of the kept lists and named its snapshot by that list and its inventory, and v0.82.0 by its pinned files alone", (t) => {
  const releases = runGit(checkout, [
    "--no-replace-objects",
    "tag",
    "--list",
    "v*",
    "--sort=v:refname",
  ]).split("\n");
  const first = releases.indexOf("v0.83.0"),
    last = releases.indexOf("v0.111.1");
  assert.ok(first > 0 && last > first, "the release tags are present");
  const used = new Map();
  for (const release of releases.slice(first, last + 1)) {
    const index = PRE_RECORD_RUNTIME_FILE_LISTS.findIndex(
      (list) => JSON.stringify(list) === JSON.stringify(pinnedList(release)),
    );
    assert.ok(index >= 0, `${release} pinned a kept list`);
    assert.match(released(release), byList, release);
    used.set(index, [...(used.get(index) ?? []), release]);
  }
  assert.deepEqual(
    [...used.keys()].sort(),
    PRE_RECORD_RUNTIME_FILE_LISTS.map((_, index) => index),
    "each kept list is a release's",
  );
  assert.match(released(releases[first - 1]), byPinnedFiles);
  t.diagnostic(
    JSON.stringify({
      releases: last - first + 1,
      lists: [...used].map(([index, names]) => ({
        pins: PRE_RECORD_RUNTIME_FILE_LISTS[index].length,
        first: names[0],
        last: names.at(-1),
        releases: names.length,
      })),
      before: releases[first - 1],
    }),
  );
});

test("each release's own installer gives the fixture's runtime the name the fixture records, and the repaired proof takes its record-less snapshot exactly when that name covers its packages", async (t) => {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-release-history-")),
  );
  try {
    const runtime = join(root, "runtime"),
      installers = join(root, "installers"),
      target = join(root, "target");
    for (const [path, text] of Object.entries(fixture.runtime)) {
      mkdirSync(dirname(join(runtime, path)), { recursive: true });
      writeFileSync(join(runtime, path), text);
    }
    // The fixture's runtime is the rule it states: every pinned path, with
    // a line naming it, and the two package manifests.
    for (const row of fixture.releases)
      for (const path of row.pinned)
        assert.equal(fixture.runtime[path], `// ${path}\nexport {};\n`, path);
    // Each installer loads beside today's modules, as the release ran them.
    mkdirSync(join(installers, "scripts/lib"), { recursive: true });
    for (const name of readdirSync(join(checkout, "scripts/lib")))
      if (name.endsWith(".mjs"))
        symlinkSync(
          join(checkout, "scripts/lib", name),
          join(installers, "scripts/lib", name),
        );
    symlinkSync(join(checkout, "packages"), join(installers, "packages"));
    mkdirSync(target);
    const observed = [];
    for (const row of fixture.releases) {
      assert.deepEqual(pinnedList(row.release), row.pinned, row.release);
      const module = join(
        installers,
        "scripts/lib",
        `released-${row.release}.mjs`,
      );
      writeFileSync(module, released(row.release));
      const installer = await import(pathToFileURL(module));
      const installation = installer.harnessInstallation({
        runtimeRoot: runtime,
      });
      assert.equal(installation.runtimeSnapshot, row.snapshot, row.release);
      installer.preserveHarnessRuntime(target, installation);
      const record = existsSync(
        join(target, row.snapshot, RUNTIME_SNAPSHOT_RECORD),
      );
      const proven = provenRuntimeSnapshot(target, row.snapshot);
      assert.equal(record, false, `${row.release} writes no record`);
      assert.equal(
        Boolean(proven),
        row.naming === "pinned list and package inventory",
        row.release,
      );
      observed.push({
        release: row.release,
        snapshot: row.snapshot,
        pins: row.pinned.length,
        proven: Boolean(proven),
      });
    }
    t.diagnostic(JSON.stringify(observed));
  } finally {
    removeTemporaryPath(root, { recursive: true, force: true });
  }
});
