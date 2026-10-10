// Reconstruct the README that D023's saved unified diff describes, without
// altering either its scored candidate or the current implementation.
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const root = resolve(import.meta.dirname, "../../../..");
const read = (file) => readFileSync(join(root, file), "utf8");
const mask = (text) =>
  text.replace(
    /<!-- DOTLN-RELEASE-BEGIN -->[\s\S]*?<!-- DOTLN-RELEASE-END -->/,
    "<!-- DOTLN-RELEASE-BEGIN -->\nThis source prepares DotLn `VERSION`.\n<!-- DOTLN-RELEASE-END -->",
  );
const candidate = mask(read("docs/evidence/WO-189/candidate-1200.md"));
const actual = mask(read("README.md"));
const patch = read(
  "docs/evidence/WO-189/repair-003/readme-vs-candidate-1200.diff.txt",
).split("\n");
const source = candidate.split("\n");
const expected = [];
let at = 0;
for (let line = 2; line < patch.length; line++) {
  const hunk = /^@@ -(\d+)(?:,\d+)? \+\d+(?:,\d+)? @@/.exec(patch[line]);
  if (!hunk) continue;
  const begin = Number(hunk[1]) - 1;
  expected.push(...source.slice(at, begin));
  at = begin;
  for (line++; line < patch.length && !patch[line].startsWith("@@"); line++) {
    const mark = patch[line][0];
    if (!mark) continue;
    const value = patch[line].slice(1);
    if (mark === " " || mark === "-") {
      if (source[at] !== value)
        throw new Error(
          `saved patch context mismatch at candidate line ${at + 1}`,
        );
      at++;
    }
    if (mark === " " || mark === "+") expected.push(value);
  }
  line--;
}
expected.push(...source.slice(at));
const described = expected.join("\n");
const normalized = (text) => text.replace(/\s+/g, " ").trim();
const phrases = [
  "showrunner (architect plus scrum master)",
  "Seiri / Sort / 整理",
  "proved the concept and then collapsed under its own success",
  "rules firing wrongly or vanishing when they mattered most",
  "gear for every damage type",
  "The workflow remembers the worker",
  "Deterministic replay is what makes it possible at all",
  "When the instrument you are using to judge is itself the thing under review",
  "Personal, mathematical, and just strange enough",
  "The ambition is not",
];
const git = (...args) => {
  const result = spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
  if (result.status !== 0 && !(args[0] === "diff" && result.status === 1))
    throw new Error(result.stderr);
  return result.stdout;
};
if (git("rev-parse", "--show-toplevel").trim() !== root)
  throw new Error("root mismatch");
const sha = (text) => createHash("sha256").update(text).digest("hex");
console.log(
  JSON.stringify(
    {
      cutoff: new Date().toISOString(),
      savedDiffAppliesToScoredCandidate: true,
      currentMatchesSavedDiff: actual === described,
      currentSha256: sha(read("README.md")),
      checkpoint16Sha256: sha(
        git("show", "refs/dotln/checkpoint/WO-189/16:README.md"),
      ),
      phrases: phrases.map((phrase) => ({
        phrase,
        inSavedDiffResult: normalized(described).includes(phrase),
        inCurrentReadme: normalized(actual).includes(phrase),
      })),
      actualChangesFromCandidate: git(
        "diff",
        "--no-index",
        "--numstat",
        "--",
        "docs/evidence/WO-189/candidate-1200.md",
        "README.md",
      ).trim(),
    },
    null,
    2,
  ),
);
