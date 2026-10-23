// VER-005: vary the existing target-draft fixture with a synthetic private
// term spanning an existing-path row and an added-path row. All remote
// effects stay in the disposable fixture's bare Git repository and fake gh.
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
source += `\nconst awaitCheck = await import(${JSON.stringify(pathToFileURL(join(root, "scripts/outward-lint.mjs")).href)});\n`;
source += `
test("VER-005 private match crossing Change rows", () =>
  withFixture((f) => {
    write(f.clone, "a.txt", "Before.\\n");
    git(f.clone, "add", "-A");
    git(f.clone, "-c", "maintenance.auto=false", "commit", "-qm", "feat: add the base file");
    git(f.clone, "push", "-q", "origin", "main");
    const base = git(f.clone, "rev-parse", "HEAD");
    const forge = publicationSetup(f);
    write(f.main, f.order, "# WO-999 — target lifecycle fixture\\n\\n**Model:** any.\\n**Effort:** executor any; verifier any; reviewer any.\\n**Repository:** target @ " + base + "\\n");
    git(f.main, "add", "-A");
    git(f.main, "-c", "maintenance.auto=false", "commit", "-qm", "test: declare the base file");
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    f.start();
    write(f.target, "a.txt", "Before.\\nAfter.\\n");
    write(f.target, "day.md", "A day.\\n");
    write(f.orderRoot, "draft-body.md", "## Draft\\n\\nThe board changes.\\n");
    f.ok(f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999", "--review"]));
    f.ok(f.resume(["implementation-ready", ...actorArgs]));
    f.ok(f.resume(["verify"]));
    write(f.orderRoot, "records/verifications/WO-999/VER-001.md", "# Verification fixture\\n\\n**Actor attestation:** " + JSON.stringify(actor) + "\\n\\n**Process cost:** unknown; cause no-session\\n");
    f.ok(f.resume(["verification-result", "pass", ...actorArgs]));
    const terms = join(f.main, "records/state/local/terms.txt");
    writeFileSync(terms, readFileSync(terms, "utf8") + "refuse: 0day\\n");
    const publish = f.worktree("publish", "WO-999", "--target-worktree", "--draft", "--branch", "feat/board", "--title", "feat: add the board", "--body-file", "draft-body.md");
    const body = existsSync(forge.state) ? JSON.parse(readFileSync(forge.state, "utf8")).pulls?.[7]?.body ?? "" : "";
    const { checkOutwardArtifact } = awaitCheck;
    const direct = checkOutwardArtifact(f.main, { kind: "pr-body", text: body, target: true });
    const store = join(docPath(f.main, "control", "local/target-publications", "WO-999"), "events.jsonl");
    const opened = existsSync(store) ? readFileSync(store, "utf8").trim().split("\\n").map(JSON.parse).findLast((event) => event.type === "PullRequestOpened") : null;
    console.log("VER005_PUBLICATION " + JSON.stringify({
      publishStatus: publish.status,
      diagnostic: publish.stderr.trim(),
      remoteBranch: git(join(f.base, "target.git"), "branch", "--list", "feat/board") !== "",
      pullCreated: Boolean(body),
      rows: body.split("\\n").filter((line) => /^\\| (?:a\\.txt|day\\.md) /u.test(line)),
      directStatus: direct.status,
      directFindings: direct.findings,
      confirmation: opened?.payload.confirmation ?? null,
    }));
    assert.notEqual(publish.status, 0, "a private refuse-mode match extending into the added row must refuse before publication");
    assert.equal(existsSync(forge.log), false);
    assert.equal(git(join(f.base, "target.git"), "branch", "--list", "feat/board"), "");
  }));
`;
const scratch = mkdtempSync(join(tmpdir(), "wo227-ver005-publish-"));
try {
  const probe = join(scratch, "publish.test.mjs");
  writeFileSync(probe, source);
  const run = spawnSync(
    process.execPath,
    ["--test", "--test-concurrency=1", "--test-name-pattern=^VER-005 ", probe],
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
