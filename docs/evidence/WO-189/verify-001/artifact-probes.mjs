import { readFileSync, readdirSync, realpathSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  markdownLinks,
  linkFailures,
} from "../../../../scripts/docs-check.mjs";
const root = resolve(import.meta.dirname, "../../../..");
const base = "docs/evidence/WO-189";
const read = (file) => readFileSync(join(root, file), "utf8");
const json = (file) => JSON.parse(read(join(base, file)));
const git = (...args) => {
  const r = spawnSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (r.status !== 0) throw new Error(r.stderr);
  return r.stdout.trim();
};
if (realpathSync(git("rev-parse", "--show-toplevel")) !== realpathSync(root))
  throw new Error("root mismatch");
const sha = (text) => createHash("sha256").update(text).digest("hex");
const keyPath = join(base, "reader-key.json");
const keyRef = "refs/dotln/checkpoint/WO-189/2",
  candidatesRef = "refs/dotln/checkpoint/WO-189/3";
const keyFiles = git("ls-tree", "-r", "--name-only", keyRef, "--", base).split(
  "\n",
);
const candidateFiles = git(
  "ls-tree",
  "-r",
  "--name-only",
  candidatesRef,
  "--",
  base,
).split("\n");
const candidates = ["candidate-1200", "candidate-2000", "candidate-3000"];
const keyTime = git("show", "-s", "--format=%cI", keyRef),
  candidateTime = git("show", "-s", "--format=%cI", candidatesRef);
const checkpoint = {
  keyTime,
  candidateTime,
  keyBeforeCandidates: Date.parse(keyTime) < Date.parse(candidateTime),
  sameKeyBytes:
    sha(git("show", `${keyRef}:${keyPath}`)) === sha(read(keyPath).trim()),
  keyCheckpointCandidates: keyFiles.filter((file) =>
    /candidate-\d+\.md$/.test(file),
  ),
  candidatesAtLaterCheckpoint: candidates.every((name) =>
    candidateFiles.includes(join(base, `${name}.md`)),
  ),
};
const normalize = (text) => text.replace(/\s+/g, " ").trim();
const maskRelease = (text) =>
  text.replace(
    /<!-- DOTLN-RELEASE-BEGIN -->[\s\S]*?<!-- DOTLN-RELEASE-END -->/,
    "<!-- DOTLN-RELEASE-BEGIN -->\n<!-- DOTLN-RELEASE-END -->",
  );
const effective = [
  ["candidate-1200", "reader-scores.json", ""],
  ["candidate-2000", "reader-scores-round2.json", "-round2"],
  ["candidate-3000", "reader-scores-round2.json", "-round2"],
];
const readerRecords = effective.map(([name, scoreFile, suffix]) => {
  const scores = json(scoreFile).rows.filter((row) => row.candidate === name);
  const reader = json(`reader-runs/${name}-reader${suffix}.json`);
  const scorer = json(`reader-runs/${name}-scorer${suffix}.json`);
  const answers = reader.output.structured_output.answers;
  const rawScores = scorer.output.structured_output.scores;
  const args = reader.launch.args;
  const get = (flag) => args[args.indexOf(flag) + 1];
  const page = normalize(read(join(base, `${name}.md`)));
  const rows = scores.map((row) => {
    const answer = answers.find((a) => a.id === row.question);
    const score = rawScores.find((s) => s.id === row.question);
    return {
      question: row.question,
      score: row.score,
      agreesWithRaw:
        answer?.answer === row.answer &&
        score?.score === row.score &&
        score?.reason === row.reason,
      quotesPresent:
        answer?.quotes?.every((quote) => page.includes(normalize(quote))) ??
        false,
    };
  });
  return {
    candidate: name,
    statuses: [reader.status, scorer.status],
    sixQuestions:
      scores.length === 6 &&
      new Set(scores.map((row) => row.question)).size === 6,
    total: scores.reduce((sum, row) => sum + row.score, 0),
    readerOutsideRepository: !reader.launch.cwd.startsWith(root),
    toolsDisabled: get("--tools") === "",
    projectSettingsOnly: get("--setting-sources") === "project",
    defaultSystemPromptReplaced: args.includes("--system-prompt"),
    modelReadback: Object.keys(reader.output.modelUsage),
    effortLaunch: get("--effort"),
    rows,
  };
});
const readme = read("README.md");
const fileLinks = linkFailures(root, [
  "README.md",
  ...candidates.map((name) => join(base, `${name}.md`)),
]);
const external = markdownLinks(readme).filter((row) =>
  /^https?:/.test(row.href),
);
const packages = readdirSync(join(root, "packages"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const result = {
  checkpoint,
  readerRecords,
  readmeMatchesChosenOutsideRelease:
    maskRelease(readme) === maskRelease(read(join(base, "candidate-1200.md"))),
  packageMapComplete: packages.every((name) =>
    readme.includes(`packages/${name}/`),
  ),
  packages,
  fileLinkFailures: fileLinks,
  externalLinks: external.map((row) => row.href),
  manifestsUnchanged:
    git("diff", "--name-only", "--", "package.json", "package-lock.json") ===
    "",
};
console.log(JSON.stringify(result, null, 2));
if (
  !checkpoint.keyBeforeCandidates ||
  !checkpoint.sameKeyBytes ||
  checkpoint.keyCheckpointCandidates.length ||
  !checkpoint.candidatesAtLaterCheckpoint ||
  readerRecords.some(
    (r) =>
      !r.sixQuestions ||
      r.statuses.some((n) => n !== 0) ||
      r.rows.some((row) => !row.agreesWithRaw || !row.quotesPresent),
  ) ||
  !result.readmeMatchesChosenOutsideRelease ||
  !result.packageMapComplete ||
  fileLinks.length ||
  !result.manifestsUnchanged
)
  process.exitCode = 1;
