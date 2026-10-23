// Replay the filed kit-record-path probe while admitting the absence of
// forge state when publication refuses before any remote call. The original
// probe is preserved; only its readback and outcome assertions differ.
// Run from the repository root under scripts/harness.mjs bounded.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
const root = resolve(process.argv[2] ?? process.cwd());
const file = join(root, "scripts/test-target-worktree-publish.mjs");
let source = readFileSync(file, "utf8").replace(
  /from "(\.[^"]+)"/g,
  (_, specifier) =>
    `from ${JSON.stringify(new URL(specifier, pathToFileURL(file)).href)}`,
);
source += `
test("verifier refuse-mode term carried only by a kit record path", () =>
  withFixture((f) => {
    const forge = publicationSetup(f);
    f.mapClone();
    f.start();
    write(f.target, "src/board.ts", "export const board = 1;\\n");
    f.ok(f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999", "--review"]));
    f.ok(f.resume(["implementation-ready", ...actorArgs]));
    f.ok(f.resume(["verify"]));
    write(f.orderRoot, "records/verifications/WO-999/VER-001.md",
      "# Verification\\n\\n**Actor attestation:** " + JSON.stringify(actor) + "\\n\\n**Process cost:** unknown; cause no-session\\n");
    f.ok(f.resume(["verification-result", "pass", ...actorArgs]));
    git(f.target, "add", "-A");
    git(f.target, "-c", "maintenance.auto=false", "commit", "-qm", "feat: add the board");
    f.ok(f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999", "--review"]));
    f.ok(f.resume(["final-review"]));
    write(f.orderRoot, "records/final-reviews/WO-999/FINAL-001.md",
      "# Final\\n\\n**Actor attestation:** " + JSON.stringify(actor) + "\\n\\n**Process cost:** unknown; cause no-session\\n");
    f.ok(f.resume(["final-review-result", "pass", ...actorArgs]));
    write(f.orderRoot, "records/evidence/WO-999/decisions.md", "# Decisions\\n\\nAdd the board.\\n");
    // The private list gains a refuse-mode term before the records commit,
    // so every content check the kit runs sees it too.
    const terms = join(f.main, "records/state/local/terms.txt");
    writeFileSync(terms, readFileSync(terms, "utf8") + "refuse: fixture md\\n");
    const records = f.resume(["target-records", ...actorArgs]);
    write(f.orderRoot, "reviewed-body.md", "## Result\\n\\nThe board lands.\\n");
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "-c", "maintenance.auto=false", "commit", "-qm", "docs: record validation");
    const publish = f.worktree("publish", "WO-999", "--target-worktree", "--branch", "feat/board",
      "--title", "feat: add the board", "--body-file", "reviewed-body.md");
    const body = existsSync(forge.state) ? JSON.parse(readFileSync(forge.state, "utf8")).pulls?.[7]?.body ?? "" : "";
    console.log("VERIFIER " + JSON.stringify({
      probe: "kit-row-refuse-term",
      recordsStatus: records.status ?? 0,
      recordsStderr: String(records.stderr ?? "").slice(0, 400),
      publishStatus: publish.status,
      publishStdout: String(publish.stdout ?? "").slice(-600),
      publishStderr: String(publish.stderr ?? "").slice(0, 600),
      publishedRow: body.split("\\n").find((line) => line.includes("WO-999-fixture.md")) ?? null,
    }));
    assert.equal(records.status ?? 0, 0, records.stderr);
    assert.notEqual(publish.status, 0, "a refuse-mode private term in the composed body should refuse the publish");
    assert.match(publish.stderr, /vocabulary\\.local: refuse \\(line \\d+, Change table\\)/u);
    assert.doesNotMatch(publish.stderr, /fixture md|WO-999|work-orders/u);
    assert.equal(existsSync(forge.state), false);
    assert.equal(existsSync(forge.log), false);
    assert.equal(git(join(f.base, "target.git"), "branch", "--list", "feat/board"), "");
  }));
`;

const scratch = mkdtempSync(join(tmpdir(), "wo227-kit-row-"));
try {
  const probe = join(scratch, "kit-row.test.mjs");
  writeFileSync(probe, source);
  const run = spawnSync(
    process.execPath,
    [
      "--test",
      "--test-concurrency=1",
      "--test-name-pattern=verifier refuse-mode term",
      probe,
    ],
    { cwd: root, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
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
