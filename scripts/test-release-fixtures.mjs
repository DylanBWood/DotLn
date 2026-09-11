import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import {
  copyReleaseTemplate,
  createReleaseFixtureContext,
  releaseCases,
  saveReleaseTemplate,
} from "./lib/release-fixtures.mjs";

const repo = resolve(import.meta.dirname, "..");
test("case inventory includes all pre-existing release scenarios plus preflight and rejects duplicates", (t) => {
  const expected =
    "preflight surfaces surfaces_local_snapshot prepare_independent license_surfaces surfaces_committed_readme surfaces_lower surfaces_first surfaces_component surfaces_non_source surfaces_new_component surfaceclose surfaceclose_linked bodyclose dirty settings_scope nonmain divergence malformed missinggh unauthenticated splitorigin lower failures cadence_missing cadence_inconsistent conflict localconflict nestedtag prepare missinglocalprevious pushfail refrecovery createrecovery stale_helpers success edition firstrelease cached_evidence concurrent".split(
      " ",
    );
  assert.deepEqual(releaseCases(repo), expected);
  const root = mkdtempSync(join(tmpdir(), "dotln-case-list-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "scripts"));
  writeFileSync(
    join(root, "scripts/test-release.sh"),
    "release_case_one() {\n}\nrelease_case_one() {\n}\n",
  );
  assert.throws(() => releaseCases(root), /duplicated/);
  assert.throws(
    () =>
      execFileSync("bash", ["scripts/test-release.sh", "--case", "missing"], {
        cwd: repo,
        stdio: "pipe",
      }),
    /unknown release case/,
  );
});

test("sealed fixture copies share no mutable refs or files and refuse a changed template", (t) => {
  const root = mkdtempSync(join(tmpdir(), "dotln-fixture-copy-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const fixture = join(root, "fixture");
  mkdirSync(fixture);
  const git = (...args) => execFileSync("git", args, { stdio: "pipe" });
  git("init", "--bare", join(fixture, "origin.git"));
  git("clone", join(fixture, "origin.git"), join(fixture, "project"));
  const project = join(fixture, "project");
  git("-C", project, "config", "user.name", "Fixture");
  git("-C", project, "config", "user.email", "fixture@example.invalid");
  writeFileSync(join(project, "input.txt"), "original\n");
  git("-C", project, "add", ".");
  git("-C", project, "commit", "-qm", "Fixture");
  git(
    "-C",
    project,
    "config",
    "url.fixture.insteadOf",
    "https://example.invalid/template",
  );
  const template = join(root, "template"),
    first = join(root, "first"),
    second = join(root, "second");
  saveReleaseTemplate(fixture, template);
  copyReleaseTemplate(template, first);
  copyReleaseTemplate(template, second);
  const file = (base) => join(base, "project/input.txt");
  assert.notEqual(lstatSync(file(first)).ino, lstatSync(file(second)).ino);
  writeFileSync(file(first), "changed\n");
  git("-C", join(first, "project"), "tag", "only-first");
  assert.equal(readFileSync(file(second), "utf8"), "original\n");
  assert.equal(readFileSync(file(template), "utf8"), "original\n");
  assert.equal(git("-C", join(second, "project"), "tag").toString(), "");
  assert.equal(git("-C", join(template, "project"), "tag").toString(), "");
  assert.throws(() =>
    git(
      "-C",
      join(second, "project"),
      "config",
      "--get",
      "url.fixture.insteadOf",
    ),
  );
  writeFileSync(file(template), "tampered\n");
  assert.throws(
    () => copyReleaseTemplate(template, join(root, "third")),
    /changed after preparation/,
  );
});

test("fixture context cleans only its owned temporary root", () => {
  const context = createReleaseFixtureContext();
  const directory = resolve(context.template, "..");
  const marker = join(directory, ".owner");
  const token = readFileSync(marker);
  writeFileSync(marker, "different-owner");
  assert.throws(() => context.cleanup(), /Refusing cleanup/);
  assert.ok(existsSync(directory));
  writeFileSync(marker, token);
  context.cleanup();
  assert.equal(existsSync(directory), false);
});
