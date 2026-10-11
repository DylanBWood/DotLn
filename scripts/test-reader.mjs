import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runGit } from "./lib/git.mjs";
import { main } from "./reader.mjs";
import {
  checkExamples,
  dimensions,
  profileRevision,
  publishedReleases,
  readerScoresAtStart,
  readScores,
  recordCorrection,
  recordScores,
  scorePrompt,
  scoreRows,
  surfaces,
  taggedProfile,
  validateReaderProfiles,
  writingGuidance,
} from "./lib/reader-profiles.mjs";

const source = fileURLToPath(new URL("..", import.meta.url));
const profiles = {
  schemaVersion: 1,
  surfaces: Object.fromEntries(
    surfaces.map((surface) => [
      surface,
      {
        audience: "contributor",
        density: "account",
        identifiers: "where they help",
        machineDetail: "summarized",
        voice: "plain",
      },
    ]),
  ),
};
const digest = (value) =>
  `sha256:${createHash("sha256").update(value).digest("hex")}`;
const write = (root, path, value) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), value);
};
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "dotln-reader-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  runGit(root, ["init", "--quiet", "-b", "main"]);
  runGit(root, ["config", "user.name", "Fixture"]);
  runGit(root, ["config", "user.email", "fixture@example.invalid"]);
  write(root, "README.md", "Reader fixture.\n");
  runGit(root, ["add", "."]);
  runGit(root, ["commit", "--quiet", "-m", "Fixture"]);
  return root;
}
function tag(
  root,
  release,
  text = "A gate records shared refs.\nNo action is needed.\nTransient moves are not covered.\nEvidence is linked here.",
) {
  runGit(root, [
    "tag",
    "-a",
    release,
    "--cleanup=verbatim",
    "-m",
    `DotLn ${release}\n\n${text}\n\nDOTLN-MANIFEST-BEGIN\n{}\nDOTLN-MANIFEST-END\n`,
  ]);
}
function chooseProfile(root, value = profiles) {
  write(root, "docs/control/reader-profiles.json", JSON.stringify(value));
  runGit(root, ["add", "."]);
  runGit(root, [
    "commit",
    "--quiet",
    "--allow-empty",
    "-m",
    "Choose reader profile",
  ]);
}
function answers(root, releases) {
  const available = publishedReleases(root);
  return {
    schemaVersion: 1,
    reader: { model: "fixture-reader", effort: "fixture", source: "fixture" },
    releases: (releases ?? available.map((row) => row.release)).map(
      (release) => ({
        release,
        textSha256: available.find((row) => row.release === release).textSha256,
        answers: [
          { question: "change", quote: "A gate records shared refs." },
          { question: "action", quote: "No action is needed." },
          { question: "limits", quote: "Transient moves are not covered." },
          { question: "evidence", quote: null },
        ],
      }),
    ),
  };
}

test("profiles require exactly the five surfaces, dimensions and named positions", () => {
  assert.equal(validateReaderProfiles(profiles), profiles);
  const mutations = [
    [
      (p) => {
        p.surfaces.unknown = p.surfaces.prTitle;
      },
      /unknown unknown/,
    ],
    [
      (p) => {
        delete p.surfaces.prTitle;
      },
      /missing prTitle/,
    ],
    [
      (p) => {
        p.surfaces.prTitle.length = 20;
      },
      /unknown length/,
    ],
    [
      (p) => {
        delete p.surfaces.prTitle.voice;
      },
      /missing voice/,
    ],
    [
      (p) => {
        p.surfaces.prTitle.voice = "automated";
      },
      /unknown position/,
    ],
    [
      (p) => {
        p.schemaVersion = 2;
      },
      /schemaVersion/,
    ],
  ];
  for (const [mutate, error] of mutations) {
    const invalid = structuredClone(profiles);
    mutate(invalid);
    assert.throws(() => validateReaderProfiles(invalid), error);
  }
});

test("profile revisions ignore JSON layout and key order but change on a choice", () => {
  const reordered = {
    schemaVersion: 1,
    surfaces: Object.fromEntries(
      Object.entries(profiles.surfaces)
        .reverse()
        .map(([surface, values]) => [
          surface,
          Object.fromEntries(Object.entries(values).reverse()),
        ]),
    ),
  };
  assert.notEqual(
    digest(JSON.stringify(profiles)),
    digest(JSON.stringify(reordered)),
  );
  assert.equal(profileRevision(profiles), profileRevision(reordered));
  reordered.surfaces.prTitle.voice = "warm";
  assert.notEqual(profileRevision(profiles), profileRevision(reordered));
});

test("profile and preview cover every surface and name known surfaces on refusal", (t) => {
  const root = fixture(t);
  write(root, "docs/control/reader-profiles.json", JSON.stringify(profiles));
  cpSync(
    join(source, "docs/publication/examples"),
    join(root, "docs/publication/examples"),
    { recursive: true },
  );
  for (const surface of surfaces) {
    const guidance = main(["profile", surface], root);
    assert.match(guidance, new RegExp(`Reader profile \\(${surface}\\)`));
    assert.match(guidance, /Nearest example: .*\/balanced\.md/);
    const shown = main(["preview", surface], root);
    assert.match(shown, /\| record \| balanced \| reader \|/);
    for (const variant of ["record", "balanced", "reader"])
      assert.ok(shown.includes(`/${surface}/${variant}.md`));
  }
  for (const command of ["profile", "preview"])
    assert.throws(
      () => main([command, "README"], root),
      (error) =>
        surfaces.every((surface) => error.message.includes(surface)) &&
        error.message.includes("unknown surface"),
    );
});

test("document check rejects each invalid profile fixture before scoring", (t) => {
  const root = fixture(t);
  for (const mutate of [
    (p) => {
      p.surfaces.extra = p.surfaces.prTitle;
    },
    (p) => {
      delete p.surfaces.releasePage;
    },
    (p) => {
      p.surfaces.prBody.extra = "plain";
    },
    (p) => {
      p.surfaces.prBody.voice = "new position";
    },
  ]) {
    const invalid = structuredClone(profiles);
    mutate(invalid);
    write(root, "docs/control/reader-profiles.json", JSON.stringify(invalid));
    assert.throws(() => main(["check"], root), /unknown|missing/);
  }
});

test("examples retain their fact anchors and a comparison bound to current bytes", (t) => {
  const root = fixture(t);
  cpSync(
    join(source, "docs/publication/examples"),
    join(root, "docs/publication/examples"),
    { recursive: true },
  );
  checkExamples(root);
  const path = "docs/publication/examples/releaseNotes/reader.md";
  write(
    root,
    path,
    readFileSync(join(root, path), "utf8") + "\nA new unsupported claim.\n",
  );
  assert.throws(() => checkExamples(root), /comparison is stale/);
  const illustrations = JSON.parse(
    readFileSync(
      join(root, "docs/publication/examples/illustrations.json"),
      "utf8",
    ),
  );
  for (const [dimension, positions] of Object.entries(dimensions))
    assert.deepEqual(
      Object.keys(illustrations[dimension]).sort(),
      [...positions].sort(),
    );
});

test("guidance remains advisory when editorial files are absent or malformed", (t) => {
  const root = fixture(t);
  assert.match(writingGuidance("prTitle", root), /unavailable/);
  write(root, "docs/control/reader-profiles.json", "broken JSON");
  assert.match(writingGuidance("releaseNotes", root), /unavailable/);
});

test("score prompt uses at most ten unscored published tags and no private repository context", (t) => {
  const root = fixture(t);
  for (let n = 0; n < 12; n++) tag(root, `v1.0.${n}`);
  runGit(root, ["tag", "v2.0.0"]);
  runGit(root, ["tag", "-a", "v3.0.0", "-m", "Unpublished lookalike"]);
  runGit(root, [
    "tag",
    "-a",
    "v4.0.0",
    "-m",
    "DotLn v4.0.0-forged\n\nUnpublished lookalike\n\nDOTLN-MANIFEST-BEGIN\n{}",
  ]);
  const prompt = scorePrompt(root);
  assert.equal((prompt.match(/"release":/g) ?? []).length, 10);
  assert.match(prompt, /v1\.0\.11/);
  assert.doesNotMatch(prompt, /"v1\.0\.[01]"|v2\.0\.0|v3\.0\.0|v4\.0\.0/);
  assert.doesNotMatch(prompt, /DOTLN-MANIFEST|Fixture|reader-profiles\.json/);
  recordScores(answers(root, ["v1.0.11"]), root);
  assert.doesNotMatch(scorePrompt(root), /v1\.0\.11/);
  assert.match(scorePrompt(root), /v1\.0\.1/);
});

test("score record validates every quotation before append, binds the tag's profile and is idempotent", (t) => {
  const root = fixture(t);
  tag(root, "v1.0.0");
  chooseProfile(root);
  tag(root, "v1.0.1");
  const input = answers(root);
  input.releases[1].answers[0].quote = "Invented answer.";
  assert.throws(
    () => recordScores(input, root),
    /v1\.0\.0\/change: quotation is not in the published text: "Invented answer\."/,
  );
  assert.deepEqual(readScores(root), []);
  const good = answers(root);
  assert.deepEqual(recordScores(good, root), { appended: 2, alreadyScored: 0 });
  const path = join(root, "docs/publication/reader-scores.jsonl");
  const original = readFileSync(path, "utf8");
  assert.deepEqual(recordScores(good, root), { appended: 0, alreadyScored: 2 });
  assert.equal(readFileSync(path, "utf8"), original);
  const rows = readScores(root);
  assert.equal(rows[0].profileRevision, profileRevision(profiles));
  assert.equal(rows[1].profileRevision, null);
  assert.match(rows[1].profileReason, /did not exist/);
  assert.equal(rows[0].answers[0].offset, "DotLn v1.0.1\n\n".length);
  assert.equal(rows[0].answers[3].position, null);
  const summary = scoreRows(rows);
  assert.equal(summary[0].found, 3);
  assert.equal(summary[0].questions, 4);
  assert.equal(summary[0].medianPosition, rows[0].answers[1].position);
});

test("malformed score results and changed tags do not silently change a recorded subject", (t) => {
  const root = fixture(t);
  tag(root, "v1.0.0");
  for (const mutate of [
    (input) => {
      input.releases[0].textSha256 = digest("other");
    },
    (input) => {
      input.releases[0].answers[1].question = "change";
    },
    (input) => {
      input.releases[0].answers[1].question = "other";
    },
    (input) => {
      input.releases[0].answers[1].quote = "";
    },
    (input) => {
      input.reader.model = "";
    },
    (input) => {
      input.reader.unexpectedPrivateContext = "fixture sentinel";
    },
  ]) {
    const invalid = answers(root);
    mutate(invalid);
    assert.throws(() => recordScores(invalid, root));
    assert.deepEqual(readScores(root), []);
  }
  recordScores(answers(root), root);
  runGit(root, ["tag", "-d", "v1.0.0"]);
  tag(root, "v1.0.0", "Different release text.");
  const changed = answers(root);
  changed.releases[0].answers.forEach((answer) => {
    answer.quote = null;
  });
  assert.throws(() => recordScores(changed, root), /tag changed/);
});

test("saved scores validate immutable text, profile and first Unicode quote position", (t) => {
  const root = fixture(t);
  chooseProfile(root);
  tag(
    root,
    "v1.0.0",
    "😀 A gate records shared refs.\nNo action is needed.\nTransient moves are not covered.\nA gate records shared refs.",
  );
  recordScores(answers(root), root);
  const original = readScores(root)[0];
  assert.equal(original.answers[0].offset, [..."DotLn v1.0.0\n\n😀 "].length);
  for (const mutate of [
    (row) => {
      row.release = "v9.9.9";
    },
    (row) => {
      row.surface = "prTitle";
    },
    (row) => {
      row.tagObject = "0".repeat(40);
    },
    (row) => {
      row.textSha256 = digest("other text");
    },
    (row) => {
      row.profileRevision = digest("other profile");
    },
    (row) => {
      row.profileReason = "invented reason";
    },
    (row) => {
      row.answers[0].quote = "Invented answer.";
    },
    (row) => {
      row.answers[0].offset = 999;
    },
    (row) => {
      row.answers[0].position = 0.9;
    },
    (row) => {
      row.answers[3].offset = 0;
    },
    (row) => {
      row.reader.unexpectedPrivateContext = "fixture sentinel";
    },
  ]) {
    const row = structuredClone(original);
    mutate(row);
    write(
      root,
      "docs/publication/reader-scores.jsonl",
      JSON.stringify(row) + "\n",
    );
    assert.throws(() => readScores(root));
    assert.equal(readerScoresAtStart(root).readerDue, false);
    assert.ok(readerScoresAtStart(root).unavailable);
  }
  write(
    root,
    "docs/publication/reader-scores.jsonl",
    JSON.stringify(original) + "\n",
  );
  runGit(root, ["tag", "-d", "v1.0.0"]);
  tag(
    root,
    "v1.0.0",
    "A moved tag does not erase the immutable score subject.",
  );
  assert.deepEqual(readScores(root), [original]);
});

test("a due reader batch selects the triggering profile before unrelated newer versions", (t) => {
  const root = fixture(t);
  chooseProfile(root);
  for (let n = 0; n < 3; n++) tag(root, `v1.0.${n}`);
  const changed = structuredClone(profiles);
  changed.surfaces.prTitle.voice = "warm";
  chooseProfile(root, changed);
  for (let n = 0; n < 10; n++) tag(root, `v2.0.${n}`);
  chooseProfile(root);
  assert.equal(readerScoresAtStart(root).readerDue, true);
  const prompt = main(["score"], root);
  assert.equal((prompt.match(/"release":/g) ?? []).length, 3);
  assert.doesNotMatch(prompt, /v2\.0\./);
  recordScores(answers(root, ["v1.0.0", "v1.0.1", "v1.0.2"]), root);
  assert.equal(readerScoresAtStart(root).readerDue, false);
  assert.match(main(["score"], root), /v2\.0\.9/);
});

test("planning asks for one reader after a new profile has three unscored releases, with corrections by surface", (t) => {
  const root = fixture(t);
  chooseProfile(root);
  tag(root, "v1.0.0");
  tag(root, "v1.0.1");
  assert.equal(readerScoresAtStart(root).readerDue, false);
  tag(root, "v1.0.2");
  assert.equal(readerScoresAtStart(root).readerDue, true);
  recordScores(answers(root), root);
  for (let n = 3; n < 6; n++) tag(root, `v1.0.${n}`);
  assert.equal(readerScoresAtStart(root).unscored, 3);
  assert.equal(readerScoresAtStart(root).readerDue, false);
  const changed = structuredClone(profiles);
  changed.surfaces.prTitle.voice = "warm";
  chooseProfile(root, changed);
  for (let n = 6; n < 9; n++) tag(root, `v1.0.${n}`);
  assert.equal(readerScoresAtStart(root).readerDue, true);
  assert.notEqual(
    taggedProfile(root, "v1.0.8").profileRevision,
    taggedProfile(root, "v1.0.0").profileRevision,
  );
  assert.throws(() => recordCorrection("prTitle", "bad", root), /capture-hash/);
  const capture = digest("operator correction fixture");
  assert.equal(recordCorrection("prTitle", capture, root).appended, 1);
  assert.equal(recordCorrection("prTitle", capture, root).appended, 0);
  const figures = readerScoresAtStart(root).figures;
  assert.equal(figures.at(-1).corrections.prTitle, 1);
  assert.equal(figures[0].found, 9);
});
