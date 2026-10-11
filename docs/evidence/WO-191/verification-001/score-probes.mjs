// Criteria 5 and 7 and finding F2 on the real release corpus. This writes the
// score log, commits and tags in the given root, so it refuses any root outside
// the system temporary directory: node score-probes.mjs <scratch-clone>
import { execFileSync } from "node:child_process";
import { readFileSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
import { pathToFileURL } from "node:url";

const root = realpathSync(process.argv[2]);
if (!root.startsWith(`${realpathSync(tmpdir())}${sep}`))
  throw new Error(`refusing: ${root} is not under ${tmpdir()}`);
const lib = await import(
  pathToFileURL(join(root, "scripts/lib/reader-profiles.mjs"))
);
const author = [
  "-c",
  "user.name=Probe",
  "-c",
  "user.email=probe@example.invalid",
];
const git = (...args) =>
  execFileSync("git", ["-C", root, ...author, ...args], { encoding: "utf8" });
const attempt = (label, run) => {
  try {
    console.log(label, "=> OK", JSON.stringify(run()));
  } catch (error) {
    console.log(label, "=> REFUSED:", error.message.slice(0, 220));
  }
};
const releases = lib.publishedReleases(root);
const subject = releases.find((row) => row.release === "v0.69.0");
const sentence = subject.text
  .split("\n")
  .find((line) => line.startsWith("This release"));
const result = (quote) => ({
  schemaVersion: 1,
  reader: { model: "probe", effort: "probe", source: "probe" },
  releases: [
    {
      release: "v0.69.0",
      textSha256: subject.textSha256,
      answers: [
        { question: "change", quote },
        { question: "action", quote: null },
        { question: "limits", quote: null },
        { question: "evidence", quote: null },
      ],
    },
  ],
});
const scores = join(root, "docs/publication/reader-scores.jsonl");
const before = readFileSync(scores, "utf8");
attempt("real corpus: quote not in text", () =>
  lib.recordScores(result("This release makes everything perfect."), root),
);
console.log("  file unchanged:", readFileSync(scores, "utf8") === before);
attempt("real corpus: whitespace-changed quote", () =>
  lib.recordScores(result(sentence.replace(/ /g, "  ")), root),
);
attempt("eleven releases", () =>
  lib.recordScores(
    {
      ...result(null),
      releases: releases.slice(10, 21).map((row) => ({
        release: row.release,
        textSha256: row.textSha256,
        answers: result(null).releases[0].answers,
      })),
    },
    root,
  ),
);
attempt("unknown release", () =>
  lib.recordScores(
    {
      ...result(null),
      releases: [{ ...result(null).releases[0], release: "v9.9.9" }],
    },
    root,
  ),
);
attempt("F2: null answer entries", () =>
  lib.recordScores(
    {
      ...result(null),
      releases: [
        { ...result(null).releases[0], answers: [null, null, null, null] },
      ],
    },
    root,
  ),
);
attempt("real corpus: valid quote", () =>
  lib.recordScores(result(sentence), root),
);
attempt("repeat valid quote (idempotent)", () =>
  lib.recordScores(result(sentence), root),
);
const rows = lib.readScores(root);
console.log("rows now", rows.length, "last", rows.at(-1).release);
writeFileSync(scores, before);
// A committed profile and three tagged releases make one reader due.
git("add", "-A");
git("commit", "-qm", "probe subject");
const tagRelease = (release) =>
  git(
    "tag",
    "-a",
    release,
    "--cleanup=verbatim",
    "-m",
    `DotLn ${release}\n\nProbe release ${release}.\n\nDOTLN-MANIFEST-BEGIN\n{}\nDOTLN-MANIFEST-END\n`,
  );
const due = () => {
  const start = lib.readerScoresAtStart(root);
  return { readerDue: start.readerDue, unscored: start.unscored };
};
console.log("before tags:", JSON.stringify(due()));
tagRelease("v0.74.2");
tagRelease("v0.74.3");
console.log("two tags:", JSON.stringify(due()));
tagRelease("v0.74.4");
console.log("three tags:", JSON.stringify(due()));
console.log(
  "prompt releases:",
  (lib.scorePrompt(root).match(/"release": "v[0-9.]+"/g) ?? []).join(" "),
);
