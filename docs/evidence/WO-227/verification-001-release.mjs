// Independent verifier variation of the order's synthetic release fixture.
// The copied tests are skipped; only the appended repeated-recheck case runs.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
const root = resolve(process.argv[2] ?? process.cwd());
const file = join(root, "scripts/test-target-worktree-release.mjs");
let source = readFileSync(file, "utf8").replace(
  /from "(\.[^"]+)"/g,
  (_, specifier) =>
    `from ${JSON.stringify(new URL(specifier, pathToFileURL(file)).href)}`,
);
source += `
test("verifier repeated completed Release recheck preserves the published digest", () =>
  withFixture((f) => {
    const notesPath = "records/final-reviews/WO-999/RELEASE-NOTES.md";
    const r = releaseFixture(f, {
      header: "**Target release notes:** reviewed\\n",
      notes: notesText("The product gains a board."),
    });
    f.ok(r.close("--publish"));
    const originalBody = r.releases()["v0.1.0"].body;
    const originalDigest = digestOf(originalBody);
    r.amendMain(notesPath, notesText("The product gains a board, revised."), "docs: later notes");
    const firstRecheck = r.close("--publish");
    const firstRecordedDigest = r.record().publication.target.body?.digest;
    const secondRecheck = r.close("--publish");
    console.log(JSON.stringify({ probe: "repeated-completed-release-recheck", originalDigest, firstStatus: firstRecheck.status, firstRecordedDigest, secondStatus: secondRecheck.status, secondError: secondRecheck.stderr.trim(), remoteBodyUnchanged: r.releases()["v0.1.0"].body === originalBody }));
    assert.equal(firstRecheck.status, 0, firstRecheck.stderr);
    assert.equal(secondRecheck.status, 0, "A repeated recheck of the same immutable Release should remain existing: " + secondRecheck.stderr);
  }));
`;

const scratch = mkdtempSync(join(tmpdir(), "wo227-release-recheck-"));
try {
  const probe = join(scratch, "recheck.test.mjs");
  writeFileSync(probe, source);
  const run = spawnSync(
    process.execPath,
    [
      "--test",
      "--test-concurrency=1",
      "--test-name-pattern=verifier repeated",
      probe,
    ],
    { cwd: root, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  const redact = (value) =>
    value.replaceAll(scratch, "<tmp>").replaceAll(root, "<worktree>");
  console.log(
    JSON.stringify(
      {
        status: run.status,
        signal: run.signal,
        stdout: redact(run.stdout ?? ""),
        stderr: redact(run.stderr ?? ""),
      },
      null,
      2,
    ),
  );
  process.exitCode = run.status ?? 1;
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
