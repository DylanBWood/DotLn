// Part F, step F8: each role root's two numbers, by one method for both
// sides. The installed bytes are the instruction file's and the role's
// skill root's, as the meter counts them; the fixed reads are the files and
// sections the root's explicit `Read:` lines name outright, each with the
// lines it resolves to and their bytes.
//
//   node docs/evidence/WO-276/part-f/reads.mjs <tree> <out.json>
//
// <tree> is a commit or a checkpoint ref, whose files are read from Git, or
// the word `worktree` for the files on disk.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fixedReads } from "../../../../scripts/lib/harness-context.mjs";
import { dispatchKinds } from "../../../../scripts/lib/process-budget.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const [tree, out] = process.argv.slice(2);
if (!tree || !out) {
  console.error("usage: reads.mjs <tree|worktree> <out.json>");
  process.exit(2);
}
const commit =
  tree === "worktree"
    ? null
    : execFileSync("git", ["rev-parse", `${tree}^{commit}`], {
        cwd: root,
        encoding: "utf8",
      }).trim();
const read = (path) =>
  commit
    ? execFileSync("git", ["show", `${commit}:${path}`], {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 64_000_000,
        stdio: ["ignore", "pipe", "ignore"],
      })
    : readFileSync(join(root, path), "utf8");
const instruction = Buffer.byteLength(read("CLAUDE.md"));
const roles = [".claude/skills", ".agents/skills"].flatMap((skillsRoot) =>
  dispatchKinds.map((role) => {
    const path = `${skillsRoot}/dotln-${role}/SKILL.md`;
    const skill = read(path);
    const reads = fixedReads(skill, role, read);
    return {
      role,
      skillsRoot,
      skillBytes: Buffer.byteLength(skill),
      installedBytes: instruction + Buffer.byteLength(skill),
      fixedReadBytes: reads.reduce((total, row) => total + row.bytes, 0),
      fixedReads: reads,
    };
  }),
);
writeFileSync(
  join(here, out),
  `${JSON.stringify(
    {
      what: "Each role root's installed bytes (the instruction file plus the role's skill root) and its fixed reads (what the root's explicit Read: lines name outright, a selector that begins with @ left out), read from one tree by scripts/lib/harness-context.mjs's fixedReads as the working tree holds it.",
      command: `node docs/evidence/WO-276/part-f/reads.mjs ${tree} ${out}`,
      tree: commit ?? "worktree",
      instructionBytes: instruction,
      roles,
    },
    null,
    2,
  )}\n`,
);
for (const row of roles.filter((row) => row.skillsRoot === ".claude/skills"))
  console.log(
    `${row.role}: installed ${row.installedBytes} (skill ${row.skillBytes}); fixed reads ${row.fixedReadBytes}`,
  );
const [claude, agents] = [".claude/skills", ".agents/skills"].map((name) =>
  JSON.stringify(
    roles
      .filter((row) => row.skillsRoot === name)
      .map(({ skillsRoot: _root, ...row }) => row),
  ),
);
console.log(`the two skill roots agree: ${claude === agents}`);
