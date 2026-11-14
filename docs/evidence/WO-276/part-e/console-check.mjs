// Part E, criterion E3: with another feedback edition selected than the one
// the console's self-host case reads, the console-fixtures artifact's check
// is current and the expected files keep their bytes.
//
//   node docs/evidence/WO-276/part-e/console-check.mjs <revision>
//
// selects that revision of the feedback edition in docs/evidence/current.json
// for the length of the run, runs the artifact's own check command and the
// board's case on the selected edition, puts the selection back byte for
// byte and writes console-check.json. Run it with no gate live and no other
// writer in the worktree: the selection is a committed file.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const [revision] = process.argv.slice(2);
if (!/^\d{3}$/u.test(revision ?? "")) {
  console.error("usage: console-check.mjs <revision, three digits>");
  process.exit(2);
}
const sha256 = (path) =>
  createHash("sha256")
    .update(readFileSync(join(root, path)))
    .digest("hex");
const selection = "docs/evidence/current.json";
const expectedFiles = ["json", "txt", "html"].map(
  (extension) => `packages/console/fixtures/expected/selfhost.${extension}`,
);
const hashes = () =>
  Object.fromEntries(expectedFiles.map((path) => [path, sha256(path)]));
const run = (command) => {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64_000_000,
  });
  return {
    command: command
      .map((part) => (part === process.execPath ? "node" : part))
      .join(" "),
    exitCode: result.status,
    output: `${result.stdout}${result.stderr}`
      .split("\n")
      .filter((line) => /^(?:\w+: JSON|ℹ (?:tests|pass|fail) )/u.test(line)),
  };
};
const selected = () =>
  JSON.parse(
    spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { currentEvidence } from ${JSON.stringify(pathToFileURL(join(root, "packages/skeleton/src/evidence-editions.mjs")).href)}; console.log(JSON.stringify(currentEvidence(${JSON.stringify(root)}, "feedback").directory));`,
      ],
      { cwd: root, encoding: "utf8" },
    ).stdout,
  );

const { generatedArtifacts } = await import(
  pathToFileURL(join(root, "scripts/lib/generated-artifacts.mjs")).href
);
const artifact = generatedArtifacts(root).find(
  (row) => row.name === "console-fixtures",
);
const manifest = JSON.parse(
  readFileSync(join(root, "packages/console/fixtures/manifest.json"), "utf8"),
);
const original = readFileSync(join(root, selection), "utf8");
const before = { selected: selected(), expected: hashes() };
const moved = JSON.parse(original);
moved.editions.feedback = { ...moved.editions.feedback, revision };
let during;
try {
  writeFileSync(join(root, selection), `${JSON.stringify(moved, null, 2)}\n`);
  during = {
    selected: selected(),
    check: run(artifact.check),
    boardCase: run([
      process.execPath,
      "--test",
      "--test-name-pattern=WO-276 criterion E3",
      "packages/console/dist/test/board.test.js",
    ]),
    expected: hashes(),
  };
} finally {
  writeFileSync(join(root, selection), original);
}
const after = { selected: selected(), expected: hashes() };
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const record = {
  what: "The console-fixtures artifact's check, the one sync and the structural phase run, with another feedback edition selected than the one the self-host case reads: the check is current, the expected files keep their bytes, and the board's case applies its property checks to the edition selected. The selection was changed for the length of the run and put back.",
  command: `node docs/evidence/WO-276/part-e/console-check.mjs ${revision}`,
  selfhostCaseReads: Object.fromEntries(
    ["selfhostAudit", "selfhostVerifier", "maturity"].map((key) => [
      key,
      { path: manifest.inputs[key].path, ref: manifest.inputs[key].ref },
    ]),
  ),
  before,
  during,
  after,
  expectedFilesUnchanged:
    same(before.expected, during.expected) &&
    same(before.expected, after.expected),
  selectionRestored: readFileSync(join(root, selection), "utf8") === original,
  atTheBase:
    "git show main:scripts/console-fixtures.mjs: the artifact's check was the mode --check-current-selfhost, an equality of the manifest's maturity path with the selected edition's feedback.json under the message 'console selfhost fixture must follow the selected feedback edition; run npm run sync', so a selection the manifest did not follow failed with the selected edition's path as the expected value.",
};
writeFileSync(
  join(here, "console-check.json"),
  `${JSON.stringify(record, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    {
      before: before.selected,
      during: during.selected,
      check: during.check,
      boardCase: during.boardCase,
      expectedFilesUnchanged: record.expectedFilesUnchanged,
      selectionRestored: record.selectionRestored,
    },
    null,
    2,
  ),
);
if (
  during.check.exitCode !== 0 ||
  during.boardCase.exitCode !== 0 ||
  !record.expectedFilesUnchanged ||
  !record.selectionRestored ||
  during.selected === before.selected
)
  process.exitCode = 1;
