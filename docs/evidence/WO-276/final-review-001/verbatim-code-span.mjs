// Final review of WO-276: what the verbatim screen says of a capture's
// sentence copied whole into committed text as plain prose, inside one
// inline code span and inside a fenced block. The capture's words are
// invented and the repository is a fresh one under the scratch directory
// given as argv[2]. Adapted from the review worker's probe of the same
// claim.
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const scratch = process.argv[2];
const lib = (name) =>
  import(pathToFileURL(join(process.cwd(), "scripts/lib", name)).href);
const { verbatimScreen } = await lib("verbatim-screen.mjs");
const { branchChanges } = await lib("branch-changes.mjs");
const { localTermTokens } = await lib("terms.mjs");
const repo = join(scratch, "verbatim-code-span");
rmSync(repo, { recursive: true, force: true });
mkdirSync(join(repo, "docs/planning"), { recursive: true });
const git = (...args) => {
  const run = spawnSync(
    "git",
    ["-C", repo, "-c", "maintenance.auto=false", ...args],
    { encoding: "utf8", env: { ...process.env, GIT_CONFIG_NOSYSTEM: "1" } },
  );
  if (run.status !== 0) throw new Error(`git ${args.join(" ")}: ${run.stderr}`);
  return run.stdout;
};
const sentence =
  "please keep every amber lantern lit beside the northern gate until the third bell rings tonight";
const captures = [
  { digest: `sha256:${"a".repeat(64)}`, words: localTermTokens(sentence) },
];
const result = {};
try {
  git("init", "-q", "-b", "main");
  git("config", "user.name", "probe");
  git("config", "user.email", "probe@example.invalid");
  git("config", "commit.gpgsign", "false");
  writeFileSync(join(repo, "docs/planning/notes.md"), "# Notes\n");
  git("add", ".");
  git("commit", "-qm", "base");
  git("switch", "-q", "-c", "wo-901");
  for (const [form, line] of [
    ["plain prose", `The note says ${sentence}.`],
    ["one inline code span", `The note says \`${sentence}\`.`],
    ["a fenced block", `\`\`\`text\n${sentence}\n\`\`\``],
  ]) {
    writeFileSync(join(repo, "docs/planning/notes.md"), `# Notes\n\n${line}\n`);
    const screened = verbatimScreen(repo, {
      changes: branchChanges(repo),
      captures,
    });
    result[form] = {
      status: screened.status,
      findings: screened.findings.length,
    };
  }
} finally {
  rmSync(repo, { recursive: true, force: true });
}
console.log(JSON.stringify(result, null, 2));
