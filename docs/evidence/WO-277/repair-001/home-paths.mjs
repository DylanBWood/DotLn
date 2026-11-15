// The rule the repaired status capture holds, read over every line this order
// writes: no line names a place on this machine by its home directory. The
// capture's two location fields read <worktree>, the kit's placeholder for
// the worktree root, and every other field is the capture's own. Beyond the
// two lines the verification quoted, it reads each line this order adds (every
// line of a new file, the added lines of a changed one) with the document
// gate's own rule for the file's type, then with the home-directory pattern
// whatever the type (the scripts, which the gate's record rule does not read,
// among them), and looks for this account's name standing alone. Lines the
// order did not write are not judged: a generated page can carry an older
// line the gate admits. It records counts, paths and line numbers, never a
// matched line or the name. Run it from the repository's root under the
// bounded wrapper with `node --test` and this file's path; it writes
// home-paths.json beside itself.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, writeFileSync } from "node:fs";
import { homedir, userInfo } from "node:os";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import {
  HOME_DIRECTORY,
  linesMatching,
  privatePathLines,
  privatePathRule,
} from "../../../../scripts/lib/private-paths.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repository = join(here, "../../../..");
// The order's merge base, and the checkpoint the verification was requested
// at, which holds the capture as the executor wrote it.
const BASE = "b8591a7307703d2cd454e51ac0c0557dc10d48d0";
const ORIGINAL = "refs/dotln/checkpoint/WO-277/3";
const CAPTURE = "docs/evidence/WO-277/status.json";
const sha256 = (text) => createHash("sha256").update(text).digest("hex");

const git = (args) => {
  const result = spawnSync("git", args, {
    cwd: repository,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};

// The line numbers a changed file holds that the base did not: the new side
// of each hunk of a diff with no context.
const addedLines = (path) => {
  const lines = new Set();
  const diff = git([
    "diff",
    "-U0",
    "--no-color",
    "--no-ext-diff",
    BASE,
    "--",
    path,
  ]);
  for (const hunk of diff.matchAll(
    /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gmu,
  )) {
    const start = Number(hunk[1]);
    const count = hunk[2] === undefined ? 1 : Number(hunk[2]);
    for (let line = start; line < start + count; line++) lines.add(line);
  }
  return lines;
};

test("no line this order writes names a home directory", () => {
  const isFile = (path) => {
    const full = join(repository, path);
    return existsSync(full) && lstatSync(full).isFile();
  };
  const changed = git(["diff", "--name-only", "-z", BASE, "--"])
    .split("\0")
    .filter(Boolean)
    .filter(isFile);
  const created = git(["ls-files", "--others", "--exclude-standard", "-z"])
    .split("\0")
    .filter(Boolean)
    .filter(isFile);
  const files = [...new Set([...changed, ...created])].sort();
  const written = new Map(changed.map((path) => [path, addedLines(path)]));
  // The account's name as the host reports it and as the home directory
  // spells it; a word boundary keeps a longer word that contains it apart.
  const names = [...new Set([userInfo().username, basename(homedir())])];
  const standing = new RegExp(
    names
      .map(
        (name) =>
          `(?<![\\w.-])${name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}(?![\\w-])`,
      )
      .join("|"),
    "iu",
  );
  const byType = {};
  const outsideGateRule = [];
  const gateLines = {};
  const anyTypeLines = {};
  const nameLines = {};
  let linesRead = 0;
  for (const path of files) {
    const text = readFileSync(join(repository, path), "utf8");
    // A new file is written whole; a changed file only at its added lines.
    const mine = written.get(path);
    const own = (lines) =>
      mine ? lines.filter((line) => mine.has(line)) : lines;
    linesRead += mine ? mine.size : text.split("\n").length;
    const type = extname(path) || "(none)";
    byType[type] = (byType[type] ?? 0) + 1;
    if (!privatePathRule(path)) outsideGateRule.push(path);
    const gate = own(privatePathLines(path, text));
    if (gate.length) gateLines[path] = gate;
    const any = own(linesMatching(HOME_DIRECTORY, text));
    if (any.length) anyTypeLines[path] = any;
    const named = own(linesMatching(standing, text));
    if (named.length) nameLines[path] = named;
  }

  // The capture as the executor wrote it, read from the checkpoint and never
  // printed, against the capture as it stands.
  const before = git(["show", `${ORIGINAL}:${CAPTURE}`]);
  const after = readFileSync(join(repository, CAPTURE), "utf8");
  const original = JSON.parse(before);
  const current = JSON.parse(after);
  const expected = structuredClone(original);
  expected.route.cwd = "<worktree>";
  expected.route.launchpad = "<worktree>";
  const capture = {
    original: `${ORIGINAL}:${CAPTURE}`,
    originalSha256: sha256(before),
    currentSha256: sha256(after),
    originalLocationFieldsHeldHomeDirectory:
      HOME_DIRECTORY.test(original.route.cwd) &&
      HOME_DIRECTORY.test(original.route.launchpad),
    originalHomeDirectoryLines: linesMatching(HOME_DIRECTORY, before),
    currentHomeDirectoryLines: linesMatching(HOME_DIRECTORY, after),
    fieldsChanged: ["route.cwd", "route.launchpad"],
    placeholder: "<worktree>",
    everyOtherFieldEqual: isDeepStrictEqual(current, expected),
  };
  const result = {
    recordedAt: new Date().toISOString(),
    base: BASE,
    filesRead: files.length,
    filesNew: created.length,
    filesChanged: changed.length,
    linesRead,
    filesByType: byType,
    filesOutsideGateRecordRule: outsideGateRule,
    gateRuleLines: gateLines,
    homeDirectoryLinesInAnyType: anyTypeLines,
    accountNamesSearched: names.length,
    accountNameLines: nameLines,
    capture,
  };
  writeFileSync(
    join(here, "home-paths.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  assert.deepEqual(gateLines, {});
  assert.deepEqual(anyTypeLines, {});
  assert.deepEqual(nameLines, {});
  assert.equal(capture.originalLocationFieldsHeldHomeDirectory, true);
  assert.deepEqual(capture.currentHomeDirectoryLines, []);
  assert.equal(capture.everyOtherFieldEqual, true);
});
