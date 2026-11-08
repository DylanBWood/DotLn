import {
  excludeFixtureOwnership,
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import { write as writeFixture } from "./lib/helpers.mjs";
import { spawnGit } from "./lib/git.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import {
  chmodSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  unlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { frontPageDeclaration } from "./lib/front-page-scope.mjs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { format } from "prettier";
import {
  disposeFollowup,
  planningFollowups,
  syncFollowups,
} from "./lib/planning-followups.mjs";
import {
  checkDocs,
  dispatchFingerprint,
  linkFailures,
  markdownLinks,
  productContent,
  validDispatch,
  operatorWordAdvisories,
  operatorWordFindings,
  homePathFindings,
  shrinkHomePathBaseline,
  recordFiles,
  frontPageFindings,
  frontPageShapeFindings,
  proseText,
} from "./docs-check.mjs";
import {
  HOME_DIRECTORY,
  PRIVATE_PATH,
  privatePathRule,
  withoutHomeDirectories,
} from "./lib/private-paths.mjs";
import { readDecisions } from "./lib/meta.mjs";
import {
  documentKinds,
  documentReport,
  readerBindings,
  renderRedTagBlock,
} from "./lib/document-kinds.mjs";
import {
  documentRows,
  documentsPage,
  redTagsFor,
} from "./lib/plan-documents.mjs";
import { documentCensus } from "./lib/document-census.mjs";
import { createWorkstreamIndexFixture } from "./test-workstream-index-fixture.mjs";

test("the console workstream document matches the current generated index", () => {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-workstream-document-")),
  );
  try {
    const fixture = createWorkstreamIndexFixture(root);
    assert.equal(
      fixture.readme(),
      readFileSync(
        new URL(
          "../packages/console/fixtures/inputs/workOrderIndex-workstreams.md",
          import.meta.url,
        ),
        "utf8",
      ),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("WO-178 attributed operator words advise by record, with capture and fingerprinted baseline exceptions", (t) => {
  const f = fixture(t);
  f.write(
    "docs/work-orders/WO-999-fixture.md",
    "# WO-999 — Fixture\n\n**Nomination provenance:** The operator\nsaid “synthetic quoted requirement”.\n",
  );
  const first = operatorWordFindings(f.root);
  assert.equal(first.length, 1);
  assert.equal(first[0].record, "provenance");
  assert.doesNotMatch(JSON.stringify(first), /synthetic quoted requirement/);
  const key = `${first[0].file}#${first[0].record}`;
  f.baseline.operatorWords = { [key]: first[0].fingerprint };
  assert.equal(f.check().operatorWords.current, 0);
  assert.equal(f.check().operatorWords.historical, 1);
  f.write(
    first[0].file,
    "# WO-999 — Fixture\n\n**Nomination provenance:** The operator said “a different quote”.\n",
  );
  assert.equal(f.check().operatorWords.current, 1);
  for (const citation of [
    `SHA-256 ${"a".repeat(64)}`,
    `--capture-hash sha256:${"b".repeat(64)}`,
  ]) {
    f.write(
      first[0].file,
      `# WO-999 — Fixture\n\n**Nomination provenance:** The operator said “synthetic quoted requirement”; ${citation}.\n`,
    );
    assert.equal(operatorWordAdvisories(f.root).current, 0);
  }
  f.record('resume: next; operator said "synthetic dispatch quote"');
  assert.equal(operatorWordAdvisories(f.root).current, 1);
  // A digest in another record does not exempt this dispatch.
  assert.equal(f.check().operatorWords.current, 1);
  assert.deepEqual(f.check().failures, []);
  f.record("resume: next; operator requested the fixture change");
  assert.equal(operatorWordAdvisories(f.root).current, 0);
});

// A fixture committed on main with an order branch checked out, so the
// forward-only checks have a merge base to compare the branch with.
const branchFixture = (t) => {
  const f = fixture(t);
  f.write(".gitignore", "docs/intake/\ndocs/control/local/\n");
  f.controls();
  const git = (...args) =>
    assert.equal(
      spawnGit(
        [
          "-C",
          f.root,
          "-c",
          "user.email=fixture@example.invalid",
          "-c",
          "user.name=Fixture",
          "-c",
          "commit.gpgsign=false",
          ...args,
        ],
        { encoding: "utf8" },
      ).status,
      0,
      args.join(" "),
    );
  git("checkout", "-q", "-b", "main");
  git("add", "-A");
  git("commit", "-qm", "base");
  git("checkout", "-q", "-b", "wo-999");
  const cli = () =>
    spawnSync(process.execPath, [script], {
      cwd: f.root,
      env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
      encoding: "utf8",
    });
  return { ...f, git, cli };
};
// Fourteen words the fixture's operator wrote; no committed text may carry
// twelve of them in a row unless the operator asked to save the message.
const CAPTURED =
  "Keep every release note short enough that a reviewer reads it twice before merging today";
const digest = (text) =>
  `sha256:${createHash("sha256").update(text).digest("hex")}`;

test("the verbatim screen fails a changed file carrying a capture's words by file, line and digest, admits a requested quotation, advises under the election and passes without captures (WO-259)", (t) => {
  const f = branchFixture(t);
  // No capture under the intake root: the screen says so and passes.
  f.record("resume: next", { decision: `Recorded: ${CAPTURED}.` });
  let run = f.cli();
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /^verbatim screen: no captures$/mu);
  // One ignored capture: the changed decisions file carrying its words fails
  // naming the file, the line and the capture's digest, never the words.
  const capture = `The operator wrote:\n\n${CAPTURED}.\n`;
  f.write("docs/intake/chats/release-notes.md", capture);
  run = f.cli();
  assert.equal(run.status, 1, run.stdout + run.stderr);
  const line = readFileSync(
    join(f.root, f.evidence, "WO-999/decisions.md"),
    "utf8",
  )
    .split("\n")
    .findIndex((text) => text.includes("Recorded:"));
  assert.ok(
    run.stderr.includes(
      `FAIL ${f.evidence}/WO-999/decisions.md:${line + 1}: 12 or more consecutive words shared with the ignored capture ${digest(capture)}`,
    ),
    run.stderr,
  );
  assert.doesNotMatch(run.stdout + run.stderr, /reviewer reads it twice/u);
  assert.match(
    run.stdout,
    /^verbatim screen: \d+ changed files against 1 captures, a 12-word window; 1 shared runs$/mu,
  );
  // The operator asked to save that message: a typed quotation naming the
  // capture and the request passes; without the request it fails.
  const request = "Save that release note message in the decisions verbatim.\n";
  f.write("docs/intake/chats/request.md", request);
  f.record("resume: next", {
    operatorQuote: {
      text: CAPTURED,
      captureSha256: digest(capture),
      requestedIn: digest(request),
    },
  });
  run = f.cli();
  assert.equal(run.status, 0, run.stdout + run.stderr);
  f.record("resume: next", {
    operatorQuote: { text: CAPTURED, captureSha256: digest(capture) },
  });
  run = f.cli();
  assert.equal(run.status, 1, run.stdout + run.stderr);
  assert.match(
    run.stderr,
    /WO-999-D001: operatorQuote 1 needs requestedIn \(sha256:<digest> of the ignored capture holding the operator's request to save that message\)/u,
  );
  // Elected, the same line advises and the check passes.
  f.record("resume: next", { decision: `Recorded: ${CAPTURED}.` });
  f.write(
    "dotln.config.json",
    JSON.stringify({
      version: 1,
      roots: {},
      features: { "verbatim-operator-words": true },
    }),
  );
  run = f.cli();
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(
    run.stdout,
    /^ADVISORY docs\/evidence\/WO-999\/decisions\.md:\d+: 12 or more consecutive words shared with the ignored capture sha256:[0-9a-f]{64}; .*features\.verbatim-operator-words is elected/mu,
  );
  f.write("dotln.config.json", JSON.stringify({ version: 1, roots: {} }));
  // A changed source file under scripts/ is screened the same way.
  f.record("resume: next");
  f.write("scripts/fixture-tool.mjs", `// ${CAPTURED}.\nexport {};\n`);
  run = f.cli();
  assert.equal(run.status, 1, run.stdout + run.stderr);
  assert.ok(
    run.stderr.includes(
      `FAIL scripts/fixture-tool.mjs:1: 12 or more consecutive words shared with the ignored capture ${digest(capture)}`,
    ),
    run.stderr,
  );
  assert.doesNotMatch(run.stderr, /decisions\.md:\d+: 12 or more/u);
  // A staged path holding a space ends its diff header with a tab; the
  // screen still reads the file by its own name.
  f.write("docs/space dir/notes file.md", `# Notes\n\n${CAPTURED}.\n`);
  f.git("add", "docs/space dir/notes file.md");
  run = f.cli();
  assert.ok(
    run.stderr.includes(
      `FAIL docs/space dir/notes file.md:3: 12 or more consecutive words shared with the ignored capture ${digest(capture)}`,
    ),
    run.stderr,
  );
  f.git("rm", "-q", "--cached", "docs/space dir/notes file.md");
  unlinkSync(join(f.root, "docs/space dir/notes file.md"));
  unlinkSync(join(f.root, "scripts/fixture-tool.mjs"));
  // The requested quotation holds inside its own record only: the same words
  // in another record of the same file are not the operator's request.
  const quoted = {
    id: "WO-999-D001",
    date: "2026-09-26",
    dispatch: "resume: next",
    decision: "Save the release note message as the operator asked.",
    evidence: ["fixture"],
    rejected: [],
    reopenWhen: "The fixture contract changes.",
    operatorQuote: {
      text: CAPTURED,
      captureSha256: digest(capture),
      requestedIn: digest(request),
    },
  };
  const copied = {
    ...quoted,
    id: "WO-999-D002",
    decision: `Carried again: ${CAPTURED}.`,
  };
  delete copied.operatorQuote;
  // Inside the quoting decision itself, the quotation's own text value is
  // the exception and the same words in its decision field are not.
  f.write(
    `${f.evidence}/WO-999/decisions.md`,
    `# Decisions\n\n## WO-999-D001\n\n\`\`\`json\n${JSON.stringify({ ...quoted, decision: `Saved: ${CAPTURED}.` }, null, 2)}\n\`\`\`\n`,
  );
  run = f.cli();
  assert.equal(run.status, 1, run.stdout + run.stderr);
  const quotedLines = readFileSync(
    join(f.root, f.evidence, "WO-999/decisions.md"),
    "utf8",
  ).split("\n");
  const decisionLine =
    quotedLines.findIndex((line) => line.includes("Saved:")) + 1;
  const textLine =
    quotedLines.findIndex((line) => line.includes('"text":')) + 1;
  assert.ok(
    run.stderr.includes(
      `FAIL ${f.evidence}/WO-999/decisions.md:${decisionLine}: 12 or more consecutive words shared with the ignored capture ${digest(capture)}`,
    ),
    run.stderr,
  );
  assert.doesNotMatch(
    run.stderr,
    new RegExp(`decisions\\.md:${textLine}: 12 or more`, "u"),
  );
  // Two equal requested quotations each claim their own text value, and a
  // value written with other valid JSON escapes is still that value.
  const twice = {
    ...quoted,
    operatorQuote: [quoted.operatorQuote, quoted.operatorQuote],
  };
  f.write(
    `${f.evidence}/WO-999/decisions.md`,
    `# Decisions\n\n## WO-999-D001\n\n\`\`\`json\n${JSON.stringify(twice, null, 2)}\n\`\`\`\n`,
  );
  run = f.cli();
  assert.equal(run.status, 0, run.stdout + run.stderr);
  // A sentence of its own: the exception belongs to the capture it names.
  const slashed =
    "Hold the planning branch until every revised paragraph has been read twice over at https://example.invalid/notes";
  f.write("docs/intake/chats/slashed.md", `${slashed}\n`);
  f.write(
    `${f.evidence}/WO-999/decisions.md`,
    `# Decisions\n\n## WO-999-D001\n\n\`\`\`json\n${JSON.stringify(
      {
        ...quoted,
        operatorQuote: {
          text: slashed,
          captureSha256: digest(`${slashed}\n`),
          requestedIn: digest(request),
        },
      },
      null,
      2,
    ).replaceAll("/", "\\/")}\n\`\`\`\n`,
  );
  run = f.cli();
  assert.equal(run.status, 0, run.stdout + run.stderr);
  unlinkSync(join(f.root, "docs/intake/chats/slashed.md"));
  f.write(
    `${f.evidence}/WO-999/decisions.md`,
    `# Decisions\n\n## WO-999-D001\n\n\`\`\`json\n${JSON.stringify(quoted)}\n\`\`\`\n\n## WO-999-D002\n\n\`\`\`json\n${JSON.stringify(copied)}\n\`\`\`\n`,
  );
  run = f.cli();
  assert.equal(run.status, 1, run.stdout + run.stderr);
  assert.ok(
    run.stderr.includes(
      `FAIL ${f.evidence}/WO-999/decisions.md:12: 12 or more consecutive words shared with the ignored capture ${digest(capture)}`,
    ),
    run.stderr,
  );
  assert.doesNotMatch(run.stderr, /decisions\.md:6: 12 or more/u);
});

test("a symlink the branch turns into a file is a changed file, staged or committed (WO-259)", async (t) => {
  const { branchChanges } = await import("./lib/branch-changes.mjs");
  const f = branchFixture(t);
  f.git("checkout", "-q", "main");
  f.write("docs/target.md", "# Target\n");
  symlinkSync("target.md", join(f.root, "docs/linked.md"));
  f.git("add", "-A");
  f.git("commit", "-qm", "a link");
  f.git("checkout", "-q", "wo-999");
  f.git("merge", "-q", "main");
  unlinkSync(join(f.root, "docs/linked.md"));
  f.write("docs/linked.md", "# Linked\n\nNow a file.\n");
  f.git("add", "docs/linked.md");
  assert.deepEqual(
    [...branchChanges(f.root).files.get("docs/linked.md")],
    [1, 2, 3],
  );
  f.git("commit", "-qm", "the link becomes a file");
  assert.deepEqual(
    [...branchChanges(f.root, { committed: true }).files.get("docs/linked.md")],
    [1, 2, 3],
  );
});

test("a deletion that joins a capture's words is the branch's, and an unreadable changed file or capture is an error naming it (WO-259)", (t) => {
  const f = branchFixture(t);
  const words = CAPTURED.split(" ");
  // On main the words stand apart, a guard line between them; beside the
  // guard is a word-bearing line, a blank line or a punctuation-only line.
  const halves = [words.slice(0, 7).join(" "), `${words.slice(7).join(" ")}.`];
  const sides = {
    joined: ["", ""],
    blank: ["\n", "\n"],
    punctuation: ["\n-", "\n-"],
  };
  f.git("checkout", "-q", "main");
  for (const [name, [before, after]] of Object.entries(sides))
    f.write(
      `docs/planning/${name}.md`,
      `# Joined\n\n${halves[0]}${before}\nA guard line.${after}\n${halves[1]}\n`,
    );
  f.git("add", "-A");
  f.git("commit", "-qm", "split text");
  f.git("checkout", "-q", "wo-999");
  f.git("merge", "-q", "main");
  f.write("docs/intake/notes/words.txt", `${CAPTURED}\n`);
  let run = f.cli();
  assert.equal(run.status, 0, run.stdout + run.stderr);
  // Deleting the guard adds no line, yet it joins the twelve-word run.
  for (const [name, [before, after]] of Object.entries(sides))
    f.write(
      `docs/planning/${name}.md`,
      `# Joined\n\n${halves[0]}${before}${after}\n${halves[1]}\n`,
    );
  run = f.cli();
  assert.equal(run.status, 1, run.stdout + run.stderr);
  for (const name of Object.keys(sides))
    assert.ok(
      run.stderr.includes(
        `FAIL docs/planning/${name}.md:3: 12 or more consecutive words shared with the ignored capture ${digest(`${CAPTURED}\n`)}`,
      ),
      `${name}: ${run.stderr}`,
    );
  // A changed file the screen cannot open is an error, never a pass.
  f.write("scripts/locked.mjs", "export {};\n");
  chmodSync(join(f.root, "scripts/locked.mjs"), 0o000);
  run = f.cli();
  assert.equal(run.status, 1, run.stdout + run.stderr);
  assert.match(
    run.stderr,
    /^FAIL docs check: scripts\/locked\.mjs cannot be read \(EACCES\); the screens read every file a branch changes$/mu,
  );
  chmodSync(join(f.root, "scripts/locked.mjs"), 0o644);
  // A capture its owner closed is private material: the check names it in an
  // advisory and reads no other words from it, and never fails on it.
  chmodSync(join(f.root, "docs/intake/notes/words.txt"), 0o000);
  run = f.cli();
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /^verbatim screen: no readable captures$/mu);
  assert.match(
    run.stdout,
    /^ADVISORY docs\/intake\/notes\/words\.txt cannot be read \(EACCES\); the verbatim screen did not read it$/mu,
  );
  chmodSync(join(f.root, "docs/intake/notes/words.txt"), 0o644);
});

test("the verbatim screen reads only what the branch adds: an unchanged file and a run the base already held are not findings (WO-259)", (t) => {
  const f = branchFixture(t);
  // Committed on main before the branch: an unchanged file is not screened.
  f.write("docs/planning/carried.md", `# Carried\n\n${CAPTURED}.\n`);
  f.write("docs/planning/edited.md", "# Edited\n\nA first line.\n");
  f.git("add", "-A");
  f.git("commit", "-qm", "carried text");
  f.git("checkout", "-q", "main");
  f.git("merge", "-q", "--ff-only", "wo-999");
  f.git("checkout", "-q", "wo-999");
  f.write("docs/intake/notes/words.txt", `${CAPTURED}\n`);
  let run = f.cli();
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /0 shared runs$/mu);
  // A changed file is read only at its added lines; and a run the base
  // already held, which a capture merely quotes, is the repository's text.
  f.write(
    "docs/planning/edited.md",
    `# Edited\n\nA first line.\n\nQuoted from the carried page: ${CAPTURED}.\n`,
  );
  run = f.cli();
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(
    run.stdout,
    /1 changed files against 1 captures, .* 0 shared runs$/mu,
  );
  // Off main entirely, nothing is judged and the screen says why.
  const detached = checkDocs(f.root, {
    baseline: f.baseline,
    changes: {
      base: null,
      reason: "no merge base with main",
      files: new Map(),
    },
  });
  assert.deepEqual(detached.failures, []);
  assert.equal(detached.verbatim.status, "no merge base");
});

test("a current record's attributed speech without a capture citation fails where the branch adds it; a historical record keeps its note and a carried one its advisory (WO-259)", (t) => {
  const f = branchFixture(t);
  const speech = "The operator said “keep the fixture short”.";
  const decisions = (order, text) => {
    const row = {
      id: `${order}-D001`,
      date: "2026-09-26",
      dispatch: "resume: next",
      decision: text,
      evidence: ["fixture"],
      rejected: [],
      reopenWhen: "Never.",
    };
    f.write(
      `${f.evidence}/${order}/decisions.md`,
      `# Decisions\n\n## ${order}-D001\n\n\`\`\`json\n${JSON.stringify(row)}\n\`\`\`\n`,
    );
  };
  // Written before the branch: WO-998's record is in the baseline, WO-997's
  // is not; neither is the branch's to judge.
  decisions("WO-998", speech);
  decisions("WO-997", speech);
  const historical = operatorWordFindings(f.root).find(
    (row) => row.record === "WO-998-D001",
  );
  f.baseline.operatorWords = {
    [`${historical.file}#${historical.record}`]: historical.fingerprint,
  };
  f.controls();
  f.git("add", "-A");
  f.git("commit", "-qm", "records before the branch");
  f.git("checkout", "-q", "main");
  f.git("merge", "-q", "--ff-only", "wo-999");
  f.git("checkout", "-q", "wo-999");
  decisions("WO-999", speech);
  const result = f.check();
  assert.deepEqual(result.failures, [
    `${f.evidence}/WO-999/decisions.md#WO-999-D001: operator-attributed words without a capture citation in a record this branch adds or changes; paraphrase the operator and cite the ignored capture by its SHA-256`,
  ]);
  assert.equal(result.operatorWords.historical, 1);
  const run = f.cli();
  assert.equal(run.status, 1, run.stdout + run.stderr);
  assert.match(
    run.stderr,
    /^FAIL docs\/evidence\/WO-999\/decisions\.md#WO-999-D001: /mu,
  );
  assert.match(
    run.stdout,
    /^ADVISORY docs\/evidence\/WO-997\/decisions\.md#WO-997-D001: operator-attributed words need a capture digest/mu,
  );
  assert.doesNotMatch(run.stdout, /ADVISORY docs\/evidence\/WO-99[89]/u);
  assert.match(run.stdout, /historical baseline: 1\.$/mu);
  assert.doesNotMatch(run.stdout + run.stderr, /keep the fixture short/u);
  // A capture citation, or a paraphrase, passes.
  decisions("WO-999", `${speech} Capture SHA-256 ${"c".repeat(64)}.`);
  assert.deepEqual(f.check().failures, []);
  // An order's header is amended field by field: editing another field of
  // the paragraph leaves the provenance record as it was written, and only
  // an edit to the provenance itself makes it the branch's.
  const order = "docs/work-orders/WO-996-fixture.md";
  const header = (depends, provenance) =>
    `# WO-996 — Fixture\n\n**Depends on:** ${depends}\n**Nomination provenance:** ${provenance}\n**Track:** machinery\n`;
  f.write(order, header("none.", speech));
  f.git("add", "-A");
  f.git("commit", "-qm", "an order with attributed provenance");
  f.git("checkout", "-q", "main");
  f.git("merge", "-q", "--ff-only", "wo-999");
  f.git("checkout", "-q", "wo-999");
  f.write(order, header("WO-995 (closed).", speech));
  assert.deepEqual(f.check().failures, []);
  f.write(order, header("WO-995 (closed).", `${speech} Amended.`));
  assert.deepEqual(f.check().failures, [
    `${order}#provenance: operator-attributed words without a capture citation in a record this branch adds or changes; paraphrase the operator and cite the ignored capture by its SHA-256`,
  ]);
});

test("operator-word advisories classify incidental JSON, code and document terms apart from quoted replies", (t) => {
  const f = fixture(t);
  const cases = [
    [
      'The operator inspected:\n\n```json\n{"status":"ready"}\n```',
      "incidental-json",
    ],
    ['The operator inspected `output = "ready"`.', "incidental-code"],
    ['The operator requested the document term "handoff".', "document-term"],
    [
      "The operator requested: “Rename the field 'status' to 'state'.”",
      "attributed-speech",
    ],
    ["The operator instructed “Keep the column ‘name’.”", "attributed-speech"],
    [
      'The operator reviewed the field "status" and the column "owner".',
      "document-term",
    ],
    ["The operator replied “retain the original bytes”.", "attributed-speech"],
    [
      'The operator replied `"retain the original bytes"`.',
      "attributed-speech",
    ],
    [
      'The operator requested `"retain the original bytes"`.',
      "attributed-speech",
    ],
    [
      'The operator instructed `‘preserve the field "status"’`.',
      "attributed-speech",
    ],
    ['The operator inspected `field "status"`.', "incidental-code"],
  ];
  for (const [decision, wordClass] of cases) {
    f.record("resume: next", { decision });
    const findings = operatorWordFindings(f.root);
    assert.equal(findings.length, 1, decision);
    assert.equal(findings[0].wordClass, wordClass, decision);
    const result = f.check();
    assert.deepEqual(
      result.failures,
      [],
      "lexical attribution remains advisory",
    );
    assert.equal(result.operatorWords.currentByClass[wordClass], 1);
    assert.equal(
      result.operatorWords.currentByClass["attributed-speech"],
      wordClass === "attributed-speech" ? 1 : 0,
    );
    const key = `${findings[0].file}#${findings[0].record}`;
    f.baseline.operatorWords = { [key]: findings[0].fingerprint };
    const savedBaseline = JSON.stringify(f.baseline.operatorWords);
    const historical = f.check().operatorWords;
    assert.equal(historical.current, 0);
    assert.equal(historical.historical, 1);
    assert.equal(JSON.stringify(f.baseline.operatorWords), savedBaseline);
    assert.equal(
      operatorWordFindings(f.root)[0].fingerprint,
      findings[0].fingerprint,
    );
    f.baseline.operatorWords = {};
  }
  f.record("resume: next", {
    decision: cases.find(
      ([, wordClass]) => wordClass === "attributed-speech",
    )[0],
  });
  f.controls();
  const cli = spawnSync(process.execPath, [script], {
    cwd: f.root,
    env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
    encoding: "utf8",
  });
  assert.equal(cli.status, 0, cli.stdout + cli.stderr);
  assert.match(
    cli.stdout,
    /Operator-word advisories: 1; incidental JSON: 0; incidental code: 0; document terms: 0; current candidate records: 1/u,
  );
  assert.match(
    cli.stdout,
    /ADVISORY docs\/evidence\/WO-999\/decisions\.md#WO-999-D001:/u,
  );
  f.record("resume: next", {
    operatorQuote: { text: "a typed quotation without a digest" },
  });
  assert.equal(f.check().failures.length, 1);
  assert.match(
    f.check().failures[0],
    /operatorQuote 1 needs text and captureSha256/u,
  );
});

test("WO-178 provenance findings and fingerprints survive grouped header layouts", (t) => {
  const f = fixture(t);
  const file = "docs/work-orders/WO-999-fixture.md";
  for (const label of ["Nomination provenance", "Provenance"]) {
    const field = `**${label}:** The operator\nsaid “synthetic grouped requirement”.`;
    f.write(file, `# WO-999 — Fixture\n\n${field}\n`);
    const standalone = operatorWordFindings(f.root);
    assert.equal(standalone.length, 1);
    for (const [before, after] of [
      ["**Model:** Fixture\n**Effort:** high\n", ""],
      ["**Track:** machinery\n", "\n**Depends on:** no order."],
    ]) {
      f.write(file, `# WO-999 — Fixture\n\n${before}${field}${after}\n`);
      // The record and its fingerprint survive; its lines are the field's
      // own, wherever the header places it.
      const placed = operatorWordFindings(f.root);
      const offset = before.split("\n").length - 1;
      assert.deepEqual(
        placed,
        standalone.map((row) => ({
          ...row,
          line: row.line + offset,
          endLine: row.endLine + offset,
        })),
      );
      const key = `${file}#provenance`;
      assert.equal(
        operatorWordAdvisories(f.root, { [key]: standalone[0].fingerprint })
          .current,
        0,
      );
      f.write(
        file,
        `# WO-999 — Fixture\n\n${before}${field.replace("requirement", "change")}${after}\n`,
      );
      assert.equal(
        operatorWordAdvisories(f.root, { [key]: standalone[0].fingerprint })
          .current,
        1,
      );
    }
  }
});

test("WO-178 capture citations and attributed words stay inside their provenance field", (t) => {
  const f = fixture(t);
  const file = "docs/work-orders/WO-999-fixture.md";
  const digest = `SHA-256 ${"c".repeat(64)}`;
  const field =
    "**Provenance:** The operator uses the **category:** “synthetic field requirement”.";
  for (const [before, after] of [
    [`**Model:** Fixture; ${digest}\n`, ""],
    ["**Effort:** high\n", `\n**Cost:** ${digest}.`],
  ]) {
    f.write(file, `# WO-999 — Fixture\n\n${before}${field}${after}\n`);
    assert.equal(operatorWordFindings(f.root).length, 1);
  }
  f.write(
    file,
    `# WO-999 — Fixture\n\n**Model:** Fixture\n${field}\nCapture: ${digest}.\n**Cost:** The operator said “synthetic other-field quote”.\n`,
  );
  assert.equal(operatorWordFindings(f.root).length, 0);
  f.write(
    file,
    "# WO-999 — Fixture\n\n**Effort:** high\n**Provenance:** A synthesized requirement.\n**Cost:** The operator said “synthetic other-field quote”.\n\n```md\n**Provenance:** The operator said “synthetic example”.\n```\n",
  );
  assert.equal(operatorWordFindings(f.root).length, 0);
});

import { runGate, suites } from "./test-runner.mjs";
import {
  historyEnd,
  historyStart,
  markerLine,
  renderReleaseHistory,
} from "./lib/release-history.mjs";

test("WO-190 the roadmap leads with the work ahead: the index is the list of orders, pending rungs precede the closed ones, no pending rung heading names an order, and the generated release history is last", async (t) => {
  const repoRoot = resolve(".");
  const document = "docs/product/06-roadmap.md";
  const text = readFileSync(join(repoRoot, document), "utf8");
  const lines = text.split("\n");
  assert.ok(!lines.some((line) => line.startsWith("```")), "no fences");
  const at = (matches) =>
    lines.flatMap((line, index) => (matches(line) ? [{ line, index }] : []));
  const headings = at((line) => /^#{1,3} /.test(line));
  const rungs = at((line) => /^## /.test(line));
  assert.ok(rungs.length > 3);
  const intro = lines.slice(0, rungs[0].index).join("\n");
  assert.match(intro, /\]\(\.\.\/work-orders\/README\.md\)/);
  assert.match(intro, /listed once, in the order they are planned to\s+run/);
  // Durable invariants on the live document.
  assert.match(rungs[0].line, /^## Application version pending — /);
  const pending = rungs.filter((row) =>
    /^## Application version pending — /.test(row.line),
  );
  const released = rungs.filter((row) => /^## v0\.\d+\.\d+ /.test(row.line));
  assert.ok(pending.length >= 1 && released.length >= 1);
  const firstReleased = Math.min(...released.map((row) => row.index));
  assert.ok(
    Math.max(...pending.map((row) => row.index)) < firstReleased,
    "a released rung precedes a pending one",
  );
  const ahead = rungs.find((row) => row.line.startsWith("## v1.0.0 "));
  assert.ok(
    ahead && ahead.index < firstReleased,
    "v1.0.0 precedes the closed rungs",
  );
  // No pending heading names an order as its carrier, so none names an
  // umbrella record: the index is the one list of orders.
  for (const { line } of pending)
    assert.doesNotMatch(
      line,
      /WO-\d{3}/,
      `${line} names an order as its carrier`,
    );
  const markers = at(markerLine);
  assert.deepEqual(
    markers.map((row) => row.line),
    [historyStart, historyEnd],
  );
  assert.equal(rungs.at(-1).line, "## Release boundary");
  assert.ok(
    markers[0].index > rungs.at(-1).index,
    "the block lies in the last section",
  );
  assert.equal(
    lines
      .slice(markers[1].index + 1)
      .join("")
      .trim(),
    "",
    "nothing follows the end marker",
  );
  // The exact order and the unchanged rung bodies, judged while the document
  // (its generated block masked) is the one this order landed; a later
  // planning edit retires these two checks as a visible skip, not a pass.
  const record = JSON.parse(
    readFileSync(
      join(repoRoot, "docs/evidence/WO-190/roadmap-order.json"),
      "utf8",
    ),
  );
  const masked = [
    ...lines.slice(0, markers[0].index),
    historyStart,
    historyEnd,
    ...lines.slice(markers[1].index + 1),
  ].join("\n");
  const hash = createHash("sha256").update(masked).digest("hex");
  await t.test(
    "WO-190 the exact heading order and every rung body equal the recorded landing (retires as a skip when the document moves on)",
    (exact) => {
      if (hash !== record.sha256WithoutReleaseHistory) {
        exact.skip(
          `retired: ${document} no longer hashes to roadmap-order.json (hash ${hash.slice(0, 12)})`,
        );
        return;
      }
      assert.deepEqual(
        headings.map((row) => row.line),
        record.headings,
      );
      const base = spawnGit(["show", `${record.baseCommit}:${document}`], {
        cwd: repoRoot,
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
      });
      assert.equal(base.status, 0, base.stderr);
      const bodies = (source) => {
        const result = new Map();
        let heading = null,
          body = [];
        const flush = () => {
          if (heading === null) return;
          while (body.length && !body.at(-1).trim()) body.pop();
          if (body.at(-1) === "<!-- prettier-ignore -->") body.pop();
          while (body.length && !body.at(-1).trim()) body.pop();
          result.set(heading, body.join("\n"));
        };
        for (const line of source.split("\n")) {
          if (/^## /.test(line)) {
            flush();
            heading = line;
            body = [];
          } else if (heading !== null) body.push(line);
        }
        flush();
        return result;
      };
      const before = bodies(base.stdout),
        after = bodies(text);
      assert.equal(before.size, after.size);
      for (const [heading, body] of before) {
        const renamed = record.renamedHeadings[heading] ?? heading;
        assert.ok(after.has(renamed), `${renamed} is missing`);
        if (heading === "## Release boundary") continue; // not a rung; its generated block moved to its end
        assert.equal(after.get(renamed), body, `${renamed}: body text changed`);
      }
    },
  );
});

const script = resolve("scripts/docs-check.mjs");
function fixture(t, roots = {}) {
  const root = createFixtureRoot(join(tmpdir(), "dotln-docs-check-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, source) => writeFixture(root, path, source);
  assert.equal(spawnGit(["init", "-q", root]).status, 0);
  excludeFixtureOwnership(root);
  write("dotln.config.json", JSON.stringify({ version: 1, roots }));
  const docs = roots.docs ?? "docs",
    product = roots.product ?? `${docs}/product`,
    control = roots.control ?? `${docs}/control`,
    evidence = roots.evidence ?? `${docs}/evidence`;
  const source = "# Product\n\n## Stable\n\nA fact.\n";
  write(`${product}/00-fixture.md`, source);
  const baseline = {
    schemaVersion: 1,
    products: {},
    dispatches: {},
    links: [],
  };
  const check = () => checkDocs(root, { baseline });
  const record = (dispatch, extra = {}, heading = "WO-999-D001") => {
    const row = {
      id: "WO-999-D001",
      date: "2026-09-26",
      dispatch,
      decision: "A bounded fixture decision",
      evidence: ["fixture"],
      rejected: [],
      reopenWhen: "fixture changes",
      ...extra,
    };
    write(
      `${evidence}/WO-999/decisions.md`,
      `# Decisions\n\n## ${heading}\n\n\`\`\`json\n${JSON.stringify(row)}\n\`\`\`\n`,
    );
    return { ...row, path: `${evidence}/WO-999/decisions.md` };
  };
  const controls = () => {
    write(`${control}/doc-baseline.json`, JSON.stringify(baseline));
  };
  return {
    root,
    write,
    source,
    product,
    control,
    evidence,
    baseline,
    check,
    record,
    controls,
  };
}

test("a product document's bytes are reported and judge nothing: no ceiling, no overage advisory, and a ceiling file left behind is not read", (t) => {
  const f = fixture(t);
  f.write(`${f.product}/00-fixture.md`, f.source + "é".repeat(5000));
  const result = f.check();
  assert.deepEqual(result.failures, []);
  assert.equal(result.rows[0].bytes, Buffer.byteLength(f.source) + 10000);
  assert.equal(result.rows[0].ceiling, undefined);
  assert.doesNotMatch(result.notices.join("\n"), /ceiling/);
  // An instance that still holds the retired file is judged the same way,
  // even when the file is malformed: nothing reads it.
  f.write(`${f.control}/doc-ceilings.json`, "not json\n");
  assert.deepEqual(f.check().failures, []);
});

test("every document is standing, record or generated by its path, a marker line or the override list", (t) => {
  const f = fixture(t);
  const generated =
    "# Index\n\nThis file is generated by `npm run work-orders -- index`.\n";
  for (const [path, source] of [
    ["README.md", "# Front\n"],
    [
      "CLAUDE.md",
      "# Contract\n\n## Start here\n\nRead `docs/planning/sequence.md`.\n",
    ],
    ["docs/planning/sequence.md", "# Sequence\n"],
    ["docs/control/budgets.json", "{}\n"],
    ["docs/evidence/README.md", "# Evidence selection\n"],
    ["docs/evidence/WO-001/decisions.md", "# Decisions\n"],
    ["docs/evidence/current.json", "{}\n"],
    ["docs/verifications/WO-001/VER-001.md", "# VER-001\n"],
    ["docs/final-reviews/WO-001/FINAL-001.md", "# FINAL-001\n"],
    ["docs/planning/refutations/2030-01-02-planning-x-001.md", "# Receipt\n"],
    ["docs/releases/v0.1.0.md", "# v0.1.0\n"],
    ["docs/decisions/0001-choice.md", "# ADR\n"],
    ["docs/planning/passes/fixture-pass-2030-01-02.md", "# Pass\n"],
    ["docs/planning/loose-pass-2030-01-01.md", "# Pass\n"],
    // Paths the kit's own commands write, whose kinds hold in any instance.
    ["docs/proposals/fixture-packet/packet.json", "{}\n"],
    ["docs/instance/entropy-reducer/runs/REVIEW-001.md", "# Review\n"],
    ["docs/lineage/idea-ledger.md", "# Idea ledger\n"],
    ["docs/planning/followups.md", "# Follow-ups\n"],
    ["docs/planning/followups.json", "{}\n"],
    ["docs/planning/cost-table.json", "{}\n"],
    ["docs/releases/tag-manifest.template.json", "{}\n"],
    ["docs/discovery/probe-2030-01-01/result.json", "{}\n"],
    ["docs/work-orders/README.md", generated],
    ["docs/work-orders/WO-001-fixture.md", "# WO-001\n"],
    ["docs/notes/history.md", "# History\n"],
    [
      "docs/planning/fenced.md",
      "# Fenced\n\n```md\nGenerated by `npm run meta`.\n```\n\n<!-- block:start -->\nGenerated by `npm run meta`.\n<!-- block:end -->\n",
    ],
  ])
    f.write(path, source);
  f.write(
    "docs/control/documents.json",
    JSON.stringify({
      schemaVersion: 1,
      entryPoints: [
        {
          id: "instruction-start-here",
          files: ["CLAUDE.md"],
          heading: "Start here",
        },
      ],
      kinds: [
        {
          path: "docs/evidence/current.json",
          kind: "standing",
          reason: "fixture selection",
        },
        { path: "docs/notes/", kind: "record", reason: "fixture history" },
        {
          path: "docs/planning/cost-table.json",
          kind: "standing",
          reason: "fixture override over a kit kind",
        },
      ],
    }),
  );
  const kinds = documentKinds(f.root);
  const kind = (path) => kinds.get(path)?.kind;
  for (const path of [
    "README.md",
    "CLAUDE.md",
    "docs/planning/sequence.md",
    "docs/control/budgets.json",
    "docs/control/documents.json",
    "docs/evidence/README.md",
    "docs/evidence/current.json",
    "docs/work-orders/WO-001-fixture.md",
    "docs/planning/fenced.md",
    "docs/product/00-fixture.md",
  ])
    assert.equal(kind(path), "standing", path);
  for (const path of [
    "docs/evidence/WO-001/decisions.md",
    "docs/verifications/WO-001/VER-001.md",
    "docs/final-reviews/WO-001/FINAL-001.md",
    "docs/planning/refutations/2030-01-02-planning-x-001.md",
    "docs/releases/v0.1.0.md",
    "docs/decisions/0001-choice.md",
    "docs/planning/passes/fixture-pass-2030-01-02.md",
    "docs/planning/loose-pass-2030-01-01.md",
    "docs/discovery/probe-2030-01-01/result.json",
    "docs/notes/history.md",
  ])
    assert.equal(kind(path), "record", path);
  assert.equal(kind("docs/work-orders/README.md"), "generated");
  assert.match(kinds.get("docs/evidence/current.json").rule, /^override /);
  assert.match(kinds.get("docs/notes/history.md").rule, /^override /);
  // The kit's own paths need no override, and an override still decides.
  for (const [path, value] of [
    ["docs/proposals/fixture-packet/packet.json", "record"],
    ["docs/instance/entropy-reducer/runs/REVIEW-001.md", "record"],
    ["docs/lineage/idea-ledger.md", "record"],
    ["docs/planning/followups.md", "generated"],
    ["docs/planning/followups.json", "generated"],
    ["docs/releases/tag-manifest.template.json", "standing"],
  ]) {
    assert.equal(kind(path), value, path);
    assert.match(kinds.get(path).rule, /^kit /, path);
  }
  assert.equal(kind("docs/planning/cost-table.json"), "standing");
  assert.match(kinds.get("docs/planning/cost-table.json").rule, /^override /);
  // Every listed document has exactly one of the three kinds.
  for (const { kind: value } of kinds.values())
    assert.ok(["standing", "record", "generated"].includes(value));
  // A malformed override refuses by its path.
  f.write(
    "docs/control/documents.json",
    JSON.stringify({ schemaVersion: 1, entryPoints: [], kinds: [] }),
  );
  assert.throws(
    () => documentKinds(f.root),
    /docs\/control\/documents\.json: entryPoints/,
  );
});

test("a reader binding is an entry point, a link from a reachable standing or generated page, or a program that reads it; a record binds nothing", (t) => {
  const f = fixture(t);
  f.write(
    "CLAUDE.md",
    "# Contract\n\n## Start here\n\nRead `docs/guide.md#Start` first.\n\n## Elsewhere\n\n[not an entry](docs/elsewhere.md)\n",
  );
  f.write("docs/guide.md", "# Guide\n\n[next](linked.md)\n");
  f.write("docs/linked.md", "# Linked\n");
  f.write("docs/elsewhere.md", "# Elsewhere\n");
  f.write("docs/island.md", "# Island\n\n[other](island-two.md)\n");
  f.write("docs/island-two.md", "# Island two\n\n[back](island.md)\n");
  f.write("docs/evidence/WO-001/README.md", "[orphan](../../orphan.md)\n");
  f.write("docs/orphan.md", "# Orphan\n");
  f.write("docs/read-by-code.md", "# Data\n");
  f.write(
    "scripts/reader.mjs",
    'export const input = "docs/read-by-code.md";\n',
  );
  f.write("scripts/test-reader.mjs", 'const fixture = "docs/orphan.md";\n');
  const bindings = readerBindings(f.root);
  assert.deepEqual(bindings.get("docs/guide.md").entryPoints, [
    "instruction-start-here",
  ]);
  assert.equal(bindings.get("docs/guide.md").bound, true);
  assert.deepEqual(bindings.get("docs/linked.md").linkedFrom, [
    "docs/guide.md",
  ]);
  assert.equal(bindings.get("docs/linked.md").bound, true);
  assert.equal(bindings.get("docs/read-by-code.md").readByProgram, true);
  assert.equal(bindings.get("docs/read-by-code.md").bound, true);
  // A session reads the whole instruction file, so a link elsewhere in it
  // reaches its target, though only the entry point's own section names it.
  assert.deepEqual(bindings.get("docs/elsewhere.md").entryPoints, []);
  assert.deepEqual(bindings.get("docs/elsewhere.md").linkedFrom, ["CLAUDE.md"]);
  assert.equal(bindings.get("docs/elsewhere.md").bound, true);
  // Pages that only link each other are reached by no reader; a record's
  // link and a test's mention bind nothing.
  for (const path of ["docs/island.md", "docs/island-two.md", "docs/orphan.md"])
    assert.equal(bindings.get(path).bound, false, path);
  assert.deepEqual(bindings.get("docs/orphan.md").linkedFrom, []);
  assert.deepEqual(bindings.get("docs/island.md").linkedFrom, [
    "docs/island-two.md",
  ]);
  assert.deepEqual(
    documentReport(f.root).unbound.filter(
      (path) => path.startsWith("docs/") && !path.startsWith("docs/product/"),
    ),
    ["docs/island-two.md", "docs/island.md", "docs/orphan.md"],
  );
});

test("a program binds the document its reference names and no other: a whole path, its root's key with its path, or a literal no other document shares", (t) => {
  const f = fixture(t);
  f.write("CLAUDE.md", "# Contract\n\n## Start here\n\nNothing yet.\n");
  for (const path of [
    "docs/product/guide.md",
    "docs/planning/guide.md",
    "docs/planning/unique-name.md",
    "docs/planning/other.md",
  ])
    f.write(path, "# Unlinked\n");
  f.write("docs/control/settings.json", "{}\n");
  // A whole repository path names its document only.
  f.write("scripts/a.mjs", 'export const a = "docs/product/guide.md";\n');
  // A bare name two documents share under their roots names neither.
  f.write("scripts/b.mjs", 'export const b = "guide.md";\n');
  // A root's key with the path under it names that root's document.
  f.write(
    "scripts/c.mjs",
    'export const c = (root) => docPath(root, "control", "settings.json");\n',
  );
  // A bare name only one document has names it.
  f.write("scripts/d.mjs", 'export const d = "unique-name.md";\n');
  // A document path inside a longer path names nothing, whether the longer
  // path adds a directory before it or an extension after it, while a
  // sentence may end right after a path it names.
  f.write(
    "scripts/e.mjs",
    'export const e = "packages/x/docs/planning/other.md";\n',
  );
  f.write("docs/planning/extended.md", "# Unlinked\n");
  f.write("docs/planning/extended.md.json", "{}\n");
  f.write("docs/planning/doubled.md", "# Unlinked\n");
  f.write("docs/planning/doubled.md..json", "{}\n");
  f.write("docs/planning/tilde.md", "# Unlinked\n");
  f.write("docs/planning/period.md", "# Unlinked\n");
  f.write("docs/planning/anchored.md", "# Unlinked\n");
  f.write(
    "scripts/f.mjs",
    [
      'export const f = "docs/planning/extended.md.json";',
      'export const g = "docs/planning/doubled.md..json";',
      'export const h = "docs/planning/tilde.md~";',
      "// Reads docs/planning/period.md.",
      'export const i = "docs/planning/anchored.md#section";',
      "",
    ].join("\n"),
  );
  const bindings = readerBindings(f.root);
  const bound = (path) => bindings.get(path).readByProgram;
  assert.equal(bound("docs/product/guide.md"), true);
  assert.equal(bound("docs/planning/guide.md"), false);
  assert.equal(bound("docs/control/settings.json"), true);
  assert.equal(bound("docs/planning/unique-name.md"), true);
  assert.equal(bound("docs/planning/other.md"), false);
  assert.equal(bound("docs/planning/extended.md.json"), true);
  assert.equal(bound("docs/planning/extended.md"), false);
  assert.equal(bound("docs/planning/doubled.md..json"), true);
  assert.equal(bound("docs/planning/doubled.md"), false);
  assert.equal(bound("docs/planning/tilde.md"), false);
  assert.equal(bound("docs/planning/period.md"), true);
  assert.equal(bound("docs/planning/anchored.md"), true);
  assert.deepEqual(
    documentReport(f.root).unbound.filter((path) =>
      path.startsWith("docs/planning/"),
    ),
    [
      "docs/planning/doubled.md",
      "docs/planning/extended.md",
      "docs/planning/guide.md",
      "docs/planning/other.md",
      "docs/planning/tilde.md",
    ],
  );
});

test("an unreadable release history makes the census window unavailable: it counts no read, and plan documents raises no red tag or unread row from it", (t) => {
  const f = fixture(t);
  f.controls();
  f.write(
    "CLAUDE.md",
    "# Contract\n\n## Start here\n\nRead [the guide](docs/guide.md).\n",
  );
  f.write("docs/guide.md", "# Guide\n");
  f.write("docs/orphan.md", "# Orphan\n");
  f.write(
    `docs/control/local/harness/${"b".repeat(64)}.jsonl`,
    `${JSON.stringify({ at: "2030-01-10T00:00:00Z", tool: "Read", reads: [{ path: "docs/guide.md" }] })}\n`,
  );
  const report = documentReport(f.root);
  const rows = (census) =>
    documentRows(f.root, { report, census }).filter((row) =>
      ["docs/guide.md", "docs/orphan.md"].includes(row.path),
    );
  const readable = documentCensus(f.root, { write: false });
  assert.equal(readable.window.unavailable, undefined);
  assert.deepEqual(readable.documents, { "docs/guide.md": 1 });
  assert.deepEqual(rows(readable), [
    { kind: "red-tag", path: "docs/orphan.md", carried: false },
  ]);
  const unreadable = documentCensus(f.root, {
    write: false,
    readTags: () => {
      throw new Error("bad tag object\nat refs/tags/v1.0.0");
    },
  });
  assert.equal(
    unreadable.window.unavailable,
    "the release tags could not be read: bad tag object at refs/tags/v1.0.0",
  );
  assert.deepEqual(unreadable.documents, {});
  assert.equal(unreadable.journals.inWindow, 0);
  assert.deepEqual(rows(unreadable), [
    { kind: "unbound", path: "docs/orphan.md", sessions: null },
  ]);
  assert.equal(
    documentsPage(f.root, { report, census: unreadable }).census.window
      .unavailable,
    unreadable.window.unavailable,
  );
});

// The committed packets are documents, so their delivery is judged in the
// document selection, whose row binds the exact tree: a later edit of a
// packet's deliveredBy changes no code identity and still meets this case.
test("WO-238 the twelve filed packets name the order and the release that carried each, as the release tags record", () => {
  const repository = resolve(import.meta.dirname, "..");
  const directory = join(repository, "docs/proposals");
  // The twelve packets filed before deliveredBy existed, by name, with the
  // order and release that carried each; later packets may be unrouted or
  // await their release.
  const delivered = {
    "content-addressed-evidence-inputs": ["WO-154", "v0.46.0"],
    "behavioral-staleness-key-for-evidence-editions": ["WO-154", "v0.46.0"],
    "cold-start-trend-and-single-source-floor": ["WO-155", "v0.46.1"],
    "isolated-codex-launch-home": ["WO-159", "v0.48.0"],
    "constant-process-console-collection": ["WO-164", "v0.52.7"],
    "entropy-review-delegate-route-agreement": ["WO-165", "v0.52.1"],
    "gate-identity-covers-suite-inputs": ["WO-174", "v0.58.1"],
    "machinery-selection-follows-imports": ["WO-174", "v0.58.1"],
    "reopen-conditions-evaluated-at-planning-entry": ["WO-175", "v0.58.2"],
    "pinned-collector-bytes-observed": ["WO-200", "v0.76.1"],
    "frozen-subject-has-no-route-home": ["WO-219", "v0.94.0"],
    "operator-word-reopen-observable": ["WO-219", "v0.94.0"],
  };
  for (const [name, [order, version]] of Object.entries(delivered)) {
    const packet = JSON.parse(
      readFileSync(join(directory, name, "packet.json"), "utf8"),
    );
    const { workOrderId, release, recordedAt } = packet.deliveredBy;
    assert.equal(workOrderId, order, name);
    assert.equal(release, version, name);
    assert.ok(Number.isFinite(Date.parse(recordedAt)), name);
    // The release tag's manifest names the order that carried the packet.
    const tag = spawnGit(
      ["-C", repository, "cat-file", "-p", `refs/tags/${release}`],
      { encoding: "utf8" },
    );
    if (tag.status === 0)
      assert.ok(tag.stdout.includes(workOrderId), `${name}: ${release}`);
  }
});

test("the docs check refuses an entry point that names a record, reports an unbound standing document and refuses a red tag older than one pass without a disposition", (t) => {
  const f = fixture(t);
  f.controls();
  f.write(
    "CLAUDE.md",
    "# Contract\n\n## Start here\n\nRead [the verification](docs/verifications/WO-001/VER-001.md) and `docs/product/00-fixture.md`.\n",
  );
  f.write("docs/verifications/WO-001/VER-001.md", "# VER-001\n");
  f.write("docs/unread.md", "# Unread\n");
  let result = f.check();
  assert.match(
    result.failures.join("\n"),
    /CLAUDE\.md: entry point instruction-start-here names the record docs\/verifications\/WO-001\/VER-001\.md; an entry point names standing documents only/,
  );
  assert.ok(result.documents.unbound.includes("docs/unread.md"));
  assert.ok(!result.documents.unbound.includes("docs/product/00-fixture.md"));
  assert.match(
    result.documents.notices.join("\n"),
    /^UNBOUND docs\/unread\.md: /m,
  );
  f.write(
    "CLAUDE.md",
    "# Contract\n\n## Start here\n\nRead `docs/product/00-fixture.md`.\n",
  );
  result = f.check();
  assert.deepEqual(result.failures, []);
  // The first pass tags; the next carries the tag and must dispose of it.
  const first = "docs/planning/passes/first-2030-01-01.md";
  const second = "docs/planning/passes/second-2030-01-08.md";
  f.write(
    first,
    `# First\n\n${renderRedTagBlock({ tags: [{ path: "docs/unread.md", since: first }] })}`,
  );
  assert.deepEqual(f.check().failures, []);
  f.write(
    second,
    `# Second\n\n${renderRedTagBlock({ after: first, tags: [{ path: "docs/unread.md", since: first }] })}`,
  );
  assert.match(
    f.check().failures.join("\n"),
    /docs\/planning\/passes\/second-2030-01-08\.md: red tag docs\/unread\.md, tagged by docs\/planning\/passes\/first-2030-01-01\.md, has no disposition/,
  );
  f.write(
    second,
    `# Second\n\n${renderRedTagBlock({ after: first, tags: [{ path: "docs/unread.md", since: first, disposition: "folded into docs/product/00-fixture.md" }] })}`,
  );
  assert.deepEqual(f.check().failures, []);
  f.write(
    second,
    "# Second\n\n<!-- dotln-red-tags:start -->\nnot json\n<!-- dotln-red-tags:end -->\n",
  );
  assert.throws(
    () => f.check(),
    /second-2030-01-08\.md: the red-tag block holds invalid JSON/,
  );
});

test("a Markdown link resolves from its file, and an entry point's reference resolves through a definition anywhere in its file", (t) => {
  const f = fixture(t);
  f.controls();
  f.write("README.md", "# Front\n");
  f.write("docs/README.md", "# Docs map\n");
  f.write(
    "CLAUDE.md",
    "# Contract\n\n## Start here\n\nRead `docs/start.md` and [the verification][v].\n\n## Elsewhere\n\n[v]: docs/verifications/WO-001/VER-001.md\n",
  );
  f.write("docs/start.md", "# Start\n\n[the map](README.md)\n");
  f.write("docs/verifications/WO-001/VER-001.md", "# VER-001\n");
  const bindings = readerBindings(f.root);
  // The link in docs/start.md names docs/README.md, as the document check
  // and a renderer read it, never the root README of the same name.
  assert.deepEqual(bindings.get("docs/README.md").linkedFrom, [
    "docs/start.md",
  ]);
  assert.equal(bindings.get("docs/README.md").bound, true);
  assert.ok(!bindings.get("README.md").linkedFrom.includes("docs/start.md"));
  // The reference under Start here is defined under another heading.
  assert.match(
    f.check().failures.join("\n"),
    /CLAUDE\.md: entry point instruction-start-here names the record docs\/verifications\/WO-001\/VER-001\.md/,
  );
});

test("a reference names one document for every reader: an old path the move map lists names the document where it lives now for the entry points, plan documents, the link check, reader bindings, red tags and the census, and a moved path is never reused", (t) => {
  const f = fixture(t);
  f.controls();
  const record = "docs/planning/passes/history-2030-01-01.md";
  const recordWas = "docs/planning/history-2030-01-01.md";
  const guide = "docs/product/guide.md";
  const guideWas = "docs/old/guide.md";
  f.write(
    "docs/control/document-moves.json",
    JSON.stringify({
      schemaVersion: 1,
      moves: [
        { from: recordWas, to: record, workOrder: "WO-001" },
        { from: guideWas, to: guide, workOrder: "WO-001" },
      ],
    }),
  );
  f.write(record, "# History\n\nRecord text.\n");
  // The moved page keeps its bytes, so its link was written from docs/old/.
  f.write(guide, "# Guide\n\n[the sibling](sibling.md#sibling)\n");
  f.write("docs/old/sibling.md", "# Sibling\n");
  f.write("docs/README.md", `# Docs\n\n[the guide](old/guide.md#guide)\n`);
  const startHere = (body) =>
    f.write(
      "CLAUDE.md",
      `# Contract\n\n## Start here\n\n${body}\n\n## Elsewhere\n\n[h]: ${recordWas}\n`,
    );
  const named = () => {
    const report = documentReport(f.root);
    return {
      report,
      records: report.recordsNamed.map(
        (row) => `${row.entryPoint} ${row.path}`,
      ),
      planned: documentRows(f.root, { report, census: { documents: {} } })
        .filter((row) => row.kind === "record-named")
        .map((row) => row.path),
      failures: f.check().failures.join("\n"),
    };
  };
  // The direct path and the old path the map lists name the same record, as
  // a link with a fragment and as a reference defined under another heading.
  for (const body of [
    `Read [history](${record}#history) and [the docs](docs/README.md).`,
    `Read [history](${recordWas}#history) and [the docs](docs/README.md).`,
    `Read [history][h] and [the docs](docs/README.md).`,
  ]) {
    startHere(body);
    const seen = named();
    assert.deepEqual(seen.records, [`instruction-start-here ${record}`], body);
    assert.deepEqual(seen.planned, [record], body);
    assert.match(
      seen.failures,
      /CLAUDE\.md: entry point instruction-start-here names the record docs\/planning\/passes\/history-2030-01-01\.md/,
    );
    assert.deepEqual(linkFailures(f.root, ["CLAUDE.md"]), [], body);
  }
  // A role's Read line quoting the old path names the record too.
  startHere("Read [the docs](docs/README.md).");
  f.write(".claude/skills/fixture/SKILL.md", `Read: \`${recordWas}\`\n`);
  let seen = named();
  assert.deepEqual(seen.records, [`role-read-lines ${record}`]);
  assert.deepEqual(seen.planned, [record]);
  f.write(".claude/skills/fixture/SKILL.md", "Read: `docs/README.md`\n");
  seen = named();
  assert.deepEqual(seen.records, []);
  assert.equal(seen.failures, "");
  // The moved standing page is reached through its old path, and its own
  // link resolves from the directory it was written in, as the link check
  // reads both.
  assert.deepEqual(linkFailures(f.root, ["docs/README.md", guide]), []);
  const bindings = seen.report.bindings;
  assert.deepEqual(bindings.get(guide).linkedFrom, ["docs/README.md"]);
  assert.equal(bindings.get(guide).bound, true);
  assert.deepEqual(bindings.get("docs/old/sibling.md").linkedFrom, [guide]);
  assert.equal(bindings.get("docs/old/sibling.md").bound, true);
  assert.ok(!seen.report.unbound.includes(guide));
  // A pass that tagged the page at its old path is answered by a later
  // disposition under its new one.
  const first = "docs/planning/passes/first-2030-01-02.md";
  const second = "docs/planning/passes/second-2030-01-09.md";
  f.write(
    first,
    `# First\n\n${renderRedTagBlock({ tags: [{ path: guideWas, since: first }] })}`,
  );
  f.write(
    second,
    `# Second\n\n${renderRedTagBlock({ after: first, tags: [{ path: guide, since: first, disposition: "kept: bound again through the docs map" }] })}`,
  );
  seen = named();
  assert.deepEqual(seen.report.openRedTags, []);
  assert.deepEqual(seen.report.staleRedTags, []);
  assert.equal(seen.failures, "");
  // A session that read the old path, before the move or through a record's
  // link after it, read the page where it lives now.
  const journal = (rows) =>
    f.write(
      `docs/control/local/harness/${"a".repeat(64)}.jsonl`,
      rows.map((row) => JSON.stringify(row)).join("\n") + "\n",
    );
  journal([
    { at: "2030-01-10T00:00:00Z", tool: "Read", reads: [{ path: guideWas }] },
  ]);
  assert.deepEqual(documentCensus(f.root, { write: false }).documents, {
    [guide]: 1,
  });
  // A moved path is never reused: a new file there is refused, and every
  // reader still names the moved page, so no earlier read or record link
  // changes its document.
  f.write(guideWas, "# A new page at the old path\n");
  seen = named();
  assert.match(
    seen.failures,
    /^docs\/old\/guide\.md: the move map lists this path as moved to docs\/product\/guide\.md; a moved path is never reused/mu,
  );
  assert.deepEqual(seen.report.bindings.get(guide).linkedFrom, [
    "docs/README.md",
  ]);
  assert.deepEqual(documentCensus(f.root, { write: false }).documents, {
    [guide]: 1,
  });
  assert.deepEqual(linkFailures(f.root, ["docs/README.md"]), []);
});

test("red tags follow the order passes ran in, and a newer pass carries or disposes every open tag", (t) => {
  const f = fixture(t);
  f.controls();
  f.write(
    "CLAUDE.md",
    "# Contract\n\n## Start here\n\nRead `docs/product/00-fixture.md`.\n",
  );
  f.write("docs/unread.md", "# Unread\n");
  const git = (...args) =>
    assert.equal(
      spawnGit(
        [
          "-C",
          f.root,
          "-c",
          "user.name=Fixture",
          "-c",
          "user.email=fixture@example.invalid",
          "-c",
          "maintenance.auto=false",
          ...args,
        ],
        {
          env: {
            ...process.env,
            GIT_AUTHOR_DATE: "2030-01-01T10:00:00Z",
            GIT_COMMITTER_DATE: "2030-01-01T10:00:00Z",
          },
        },
      ).status,
      0,
      args.join(" "),
    );
  // Two passes on one day whose slugs sort against the order they ran in,
  // committed in the same second: alpha's block names zeta as the pass it
  // follows, so alpha is the newer pass whatever the names and times say.
  const zeta = "docs/planning/passes/zeta-2030-01-01.md";
  const alpha = "docs/planning/passes/alpha-2030-01-01.md";
  const tag = { path: "docs/unread.md", since: zeta };
  f.write(zeta, `# Zeta\n\n${renderRedTagBlock({ tags: [tag] })}`);
  git("add", "-A");
  git("commit", "-qm", "zeta pass");
  const folded = {
    ...tag,
    disposition: "folded into docs/product/00-fixture.md",
  };
  f.write(
    alpha,
    `# Alpha\n\n${renderRedTagBlock({ after: zeta, tags: [folded] })}`,
  );
  git("add", "-A");
  git("commit", "-qm", "alpha pass");
  assert.equal(documentReport(f.root).latestRedTags.file, alpha);
  assert.deepEqual(f.check().failures, []);
  // The same pass committed without its block, in the same second as zeta:
  // Git's history, not the commit time, says alpha came later, so zeta's
  // open tag is undisposed.
  f.write(alpha, "# Alpha\n");
  git("add", "-A");
  git("commit", "-qm", "alpha without its block");
  assert.match(
    f.check().failures.join("\n"),
    /alpha-2030-01-01\.md: red tag docs\/unread\.md, tagged by docs\/planning\/passes\/zeta-2030-01-01\.md, has no disposition \(the newer pass holds no red-tag block\)/,
  );
  // An empty newer block drops the open tag without a disposition.
  f.write(alpha, `# Alpha\n\n${renderRedTagBlock({ after: zeta })}`);
  assert.match(
    f.check().failures.join("\n"),
    /alpha-2030-01-01\.md: red tag docs\/unread\.md, tagged by docs\/planning\/passes\/zeta-2030-01-01\.md, has no disposition \(the newer pass dropped it without a disposition\)/,
  );
  // A third pass that also says nothing does not forget it: the tag stays
  // open from zeta until a block disposes of it, and its document may be gone.
  const third = "docs/planning/passes/third-2030-01-08.md";
  f.write(third, `# Third\n\n${renderRedTagBlock({ after: alpha })}`);
  unlinkSync(join(f.root, "docs/unread.md"));
  const report = documentReport(f.root);
  assert.deepEqual(report.openRedTags, [tag]);
  assert.match(
    f.check().failures.join("\n"),
    /third-2030-01-08\.md: red tag docs\/unread\.md, tagged by docs\/planning\/passes\/zeta-2030-01-01\.md, has no disposition \(the newer pass dropped it without a disposition\)/,
  );
  // The next pass starts from that block: it follows the third pass and
  // carries the removed document's tag for its disposition.
  const next = "docs/planning/passes/next-2030-01-15.md";
  const started = redTagsFor(f.root, next, {
    report,
    rows: documentRows(f.root, { report, census: { documents: {} } }),
  });
  assert.equal(started.after, third);
  assert.deepEqual(
    started.tags.find((row) => row.path === tag.path),
    { ...tag, disposition: "" },
  );
  f.write(
    third,
    `# Third\n\n${renderRedTagBlock({ after: alpha, tags: [{ ...tag, disposition: "removed: no reader" }] })}`,
  );
  assert.deepEqual(f.check().failures, []);
  // Two blocks that follow one pass are refused until the later names the other.
  const fork = "docs/planning/passes/fork-2030-01-08.md";
  f.write(fork, `# Fork\n\n${renderRedTagBlock({ after: alpha })}`);
  assert.throws(
    () => f.check(),
    /docs\/planning\/passes\/(?:fork|third)-2030-01-08\.md and docs\/planning\/passes\/(?:fork|third)-2030-01-08\.md both follow docs\/planning\/passes\/alpha-2030-01-01\.md/,
  );
  unlinkSync(join(f.root, fork));
  // A later pass that holds no block leaves every open tag undisposed.
  f.write(
    third,
    `# Third\n\n${renderRedTagBlock({ after: alpha, tags: [tag] })}`,
  );
  f.write("docs/planning/passes/later-2030-01-20.md", "# Later\n");
  assert.match(
    f.check().failures.join("\n"),
    /later-2030-01-20\.md: red tag docs\/unread\.md, .*\(the newer pass holds no red-tag block\)/,
  );
});

test("receipt and candidate baselines admit only counted labels under their original heading", (t) => {
  const f = fixture(t);
  const additions =
    "\n**Old (2026-09-25):** Existing fact.\n\n### Candidate — old\n\nProposal.\n";
  const original = f.source + additions;
  f.baseline.products["00-fixture.md"] = productContent(
    "00-fixture.md",
    original,
  ).shapes;
  f.write(`${f.product}/00-fixture.md`, original);
  assert.deepEqual(f.check().failures, []);
  f.write(
    `${f.product}/00-fixture.md`,
    original + "\n**New (2026-09-26):** More history.\n\n## Candidate — new\n",
  );
  const failures = f.check().failures.join("\n");
  assert.match(failures, /new receipt; edit the sentence/);
  assert.match(failures, /new candidate; candidates go to the planning map/);
  f.write(
    `${f.product}/00-fixture.md`,
    original.replace(
      "Existing fact.",
      "Existing fact.\n\n**Old (2026-09-25):** Duplicate.",
    ),
  );
  assert.match(f.check().failures.join("\n"), /new receipt/);
  f.write(
    `${f.product}/00-fixture.md`,
    original.replace("## Stable", "## Elsewhere"),
  );
  assert.match(f.check().failures.join("\n"), /new receipt/);
  f.write(
    `${f.product}/00-fixture.md`,
    f.source + "\n**Change (operator direction):** More.\n",
  );
  assert.match(f.check().failures.join("\n"), /new receipt/);
});

test("the Release boundary heading exempts nothing; only the registered release-history block does", (t) => {
  const f = fixture(t);
  const file = "06-roadmap.md";
  const block = renderReleaseHistory(f.root, []);
  const source = `# Roadmap\n\n## Release boundary\n\nPointer.\n\n${block}\n\n## Future\n\nFact.\n`;
  const measured = productContent(file, source);
  assert.equal(measured.exemptBytes, Buffer.byteLength(block));
  assert.equal(
    measured.bytes,
    Buffer.byteLength(source) - Buffer.byteLength(block),
  );
  assert.deepEqual(measured.failures, []);
  f.write(`${f.product}/${file}`, source);
  assert.deepEqual(f.check().failures, []);
  // A dated note under the heading is counted and reported as anywhere else.
  const note =
    "**WO-999 activation completion (2026-09-26):** " + "é".repeat(1000);
  f.write(`${f.product}/${file}`, source.replace("Pointer.", note));
  const result = f.check();
  assert.match(
    result.failures.join("\n"),
    /06-roadmap\.md#release-boundary: new receipt/,
  );
  assert.equal(
    result.rows.find((row) => row.document.endsWith(file)).bytes,
    measured.bytes + Buffer.byteLength(note) - Buffer.byteLength("Pointer."),
  );
  // The registration names one product path: elsewhere the pair exempts nothing.
  for (const other of ["07-guide.md", "archive/06-roadmap.md"]) {
    const elsewhere = productContent(other, source);
    assert.equal(elsewhere.exemptBytes, 0, other);
    assert.equal(elsewhere.bytes, Buffer.byteLength(source), other);
  }
});

test("code fences hide receipt, candidate and link examples; generated links still resolve", (t) => {
  const f = fixture(t);
  const examples =
    "\n````markdown\n```\n## Candidate — example\n**Example (2026-09-26):** [bad](missing.md)\n````\n";
  f.write(
    `${f.product}/00-fixture.md`,
    f.source + examples + "\n`[bad](missing.md)`\n<!-- [bad](missing.md) -->\n",
  );
  assert.deepEqual(f.check().failures, []);
  f.write(
    "docs/generated.md",
    "<!-- index:start -->\n[bad](missing.md)\n<!-- index:end -->\n",
  );
  assert.match(f.check().failures.join("\n"), /missing file: missing.md/);
});

test("handwritten and generated full decision anchors pass; short-form anchors and missing files fail", (t) => {
  const f = fixture(t);
  f.write("docs/target.md", "# Decisions\n\n## WO-999-D001 — a title\n");
  f.write("docs/index.md", "[decision](target.md#wo-999-d001--a-title)\n");
  assert.deepEqual(f.check().failures, []);
  f.write(
    "docs/index.md",
    "[decision](target.md#wo-999-d001)\n[missing](absent.md)\n",
  );
  const failures = f.check().failures.join("\n");
  assert.match(failures, /missing anchor/);
  assert.match(failures, /missing file/);
});

test("references, balanced destinations, duplicate headings, HTML anchors and line URLs", (t) => {
  const f = fixture(t);
  f.write(
    "docs/target_(one).md",
    '# `resume_state`\n\n## Echo\n\n## Echo\n\n## Echo-1\n\n<a id="C1"></a>\n',
  );
  f.write(
    "docs/index.md",
    "[nested [label]](target_(one).md#resume_state)\n[full][ref]\n[ref][]\n[ref]\n[ref]: target_(one).md#echo-1-1\n[html](target_(one).md#C1)\n[line](target_(one).md?plain=1#L1-L3)\n",
  );
  f.write(
    "docs/final-reviews/WO-999/PR.md",
    "[relative](../../target_(one).md#echo-1)\n",
  );
  assert.deepEqual(f.check().failures, []);
  f.write(
    "docs/index.md",
    "[bad line](target_(one).md?plain=1#L999)\n[bad encoding](target%ZZ.md)\n",
  );
  assert.equal(linkFailures(f.root).length, 2);
});

test("historical link exceptions are source/destination/count specific", (t) => {
  const f = fixture(t);
  f.write("docs/old.md", "[old](product/00-fixture.md#gone)\n");
  f.baseline.links = [
    {
      file: "docs/old.md",
      href: "product/00-fixture.md#gone",
      reason: "missing anchor",
      count: 1,
    },
  ];
  assert.deepEqual(f.check().failures, []);
  f.write(
    "docs/old.md",
    "[old](product/00-fixture.md#gone)\n[duplicate](product/00-fixture.md#gone)\n",
  );
  assert.equal(f.check().failures.length, 1);
  f.write("docs/new.md", "[copied](product/00-fixture.md#gone)\n");
  assert.equal(f.check().failures.length, 2);
});

test("dispatch fingerprints exempt only existing bytes, and new dispatches obey prefix and length", (t) => {
  const f = fixture(t);
  const old = f.record("historical wording");
  assert.match(
    f.check().failures.join("\n"),
    /dispatch needs a control prefix/,
  );
  f.baseline.dispatches[`${old.path}#${old.id}`] = dispatchFingerprint(old);
  assert.deepEqual(f.check().failures, []);
  f.record("different unprefixed wording");
  assert.match(f.check().failures.join("\n"), /dispatch needs/);
  f.record("resume: next; record the bounded choice");
  assert.deepEqual(f.check().failures, []);
  for (const prefix of [
    "planning",
    "ideation",
    "resume",
    "scope expand",
    "conversation only",
    "quality pass",
    "analysis",
    "operator override",
  ])
    assert.equal(validDispatch(`${prefix}: ${"a".repeat(240)}`), true);
  assert.equal(validDispatch("resume: " + "a".repeat(241)), false);
  assert.equal(validDispatch("resume:\nquoted block"), false);
  assert.equal(validDispatch("resume: next\u2028more"), false);
  assert.equal(validDispatch("resume: next\u2029more"), false);
  assert.equal(validDispatch("resume:"), false);
});

test("configuration roots and nonignored new documents are used; private and package fixtures are excluded", (t) => {
  const f = fixture(t, {
    docs: "handbook",
    product: "blueprint",
    control: "state",
    evidence: "records",
  });
  f.write(".gitignore", "private.md\n");
  f.write("private.md", "[bad](absent.md)\n");
  f.write("packages/demo/README.md", "[bad](absent.md)\n");
  f.write("handbook/intake/private.md", "[bad](absent.md)\n");
  f.write("state/local/private.md", "[bad](absent.md)\n");
  f.record("resume: next");
  assert.deepEqual(f.check().failures, []);
  f.controls();
  const cli = spawnSync(process.execPath, [script], {
    cwd: tmpdir(),
    env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
    encoding: "utf8",
  });
  assert.equal(cli.status, 0, cli.stdout + cli.stderr);
  assert.match(cli.stdout, /blueprint\/00-fixture.md/);
  assert.match(cli.stdout, /^Documents: \d+ standing, /m);
  f.write("handbook/new.md", "[bad](absent.md)\n");
  const failed = spawnSync(process.execPath, [script], {
    env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
    encoding: "utf8",
  });
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /missing file/);
});

test("document check and fixtures run only in the document selection", () => {
  for (const name of ["docs-check", "docs-check-fixtures"]) {
    const row = suites.find((entry) => entry.name === name);
    assert.equal(row.document, true);
    assert.equal(row.product, false);
    assert.equal(row.machinery, false);
  }
});

test("link extraction ignores remote navigation and escaped examples through resolution", () => {
  assert.deepEqual(
    markdownLinks(
      '\\[example](absent.md)\n`[code](absent.md)`\n[valid](target.md "title")',
    ),
    [{ href: "target.md", line: 3 }],
  );
});

test("render-equivalent indented receipts and live links around escaped backticks stay checked", (t) => {
  const f = fixture(t);
  for (const indent of [" ", "  ", "   "]) {
    f.write(
      `${f.product}/00-fixture.md`,
      f.source + `\n${indent}**New (2026-09-26):** Addition.\n`,
    );
    assert.match(f.check().failures.join("\n"), /new receipt/);
  }
  const source =
    "\\` [broken](missing.md) \\`\n[ref-link][ref]\n\n[ref]:\n  missing-ref.md\n[angle](<missing(.md>)\n";
  assert.deepEqual(
    markdownLinks(source).map((row) => row.href),
    ["missing.md", "missing-ref.md", "missing(.md"],
  );
  f.write("docs/index.md", source);
  assert.equal(linkFailures(f.root).length, 3);
});

test("only real HTML anchors resolve, setext headings resolve, and indented examples are not links", (t) => {
  const f = fixture(t);
  f.write(
    "docs/target.md",
    'Real heading\n============\n\nMultiline\nheading\n---\n\n`<a id="phantom"></a>`\n\n<a data-id="also-phantom"></a>\n\n<a id=real></a>\n',
  );
  f.write(
    "docs/index.md",
    "[setext](target.md#real-heading)\n[multiline](target.md#multiline-heading)\n[html](target.md#real)\n\n    [example](absent.md)\n\n[phantom](target.md#phantom)\n[not-id](target.md#also-phantom)\n",
  );
  const failures = linkFailures(f.root);
  assert.deepEqual(
    failures.map((row) => row.href),
    ["target.md#phantom", "target.md#also-phantom"],
  );
});

test("historical exception counts cannot become fractional or unlimited", (t) => {
  const f = fixture(t);
  for (const count of [0, -1, 1.1, Infinity, "2"]) {
    f.baseline.links = [
      {
        file: "docs/old.md",
        href: "missing.md",
        reason: "missing file",
        count,
      },
    ];
    assert.throws(f.check, /positive safe-integer count/);
  }
});

test("list continuation indentation preserves live links and hides only actual list code", (t) => {
  const f = fixture(t);
  f.write(
    "docs/list.md",
    "- Item\n\n    [nested](missing-one.md)\n\n- Item\n    [continued](missing-two.md)\n\n1. Ordered\n\n    [continued](missing-three.md)\n\n- Item\n\n      [code](not-a-link.md)\n",
  );
  assert.deepEqual(
    linkFailures(f.root).map((row) => row.href),
    ["missing-one.md", "missing-two.md", "missing-three.md"],
  );
});

test("Markdown titles, nested brackets and decoded entities retain live destinations", (t) => {
  const f = fixture(t);
  f.write("docs/target&one.md", "# Fish &amp; Chips\n");
  f.write(
    "docs/index.md",
    "[broken](missing.md (a title))\nAn aside [see [broken](nested.md)].\n[entity](target&amp;one.md#fish--chips)\n",
  );
  assert.deepEqual(
    linkFailures(f.root).map((row) => row.href),
    ["missing.md", "nested.md"],
  );
});

test("list and quoted fences hide examples without hiding later links or nested headings", (t) => {
  const f = fixture(t);
  f.write(
    "docs/target.md",
    "> ## Quoted heading\n\n- ### List heading\n\n## Quoted heading\n",
  );
  f.write(
    "docs/index.md",
    "- ```md\n  [example](not-a-link.md)\n  ```\n\n[live](missing.md)\n\n> ~~~md\n> [example](also-not-a-link.md)\n> ~~~\n\n[quote](target.md#quoted-heading)\n[list](target.md#list-heading)\n[duplicate](target.md#quoted-heading-1)\n",
  );
  assert.deepEqual(
    linkFailures(f.root).map((row) => row.href),
    ["missing.md"],
  );
});

test("a demoted, quoted or hidden terminating heading exempts nothing after the registered block", (t) => {
  const f = fixture(t);
  const file = "06-roadmap.md";
  const block = renderReleaseHistory(f.root, []);
  for (const terminator of [
    "### Future",
    "> ## Future",
    "<!--\n## Future\n-->",
  ]) {
    const source = `# Roadmap\n\n## Release boundary\n\n${block}\n\n${terminator}\n\n**New (2026-09-27):** Receipt.\n\n## Candidate — smuggled\n\n${"é".repeat(3000)}\n`;
    const measured = productContent(file, source);
    assert.equal(measured.exemptBytes, Buffer.byteLength(block), terminator);
    assert.equal(
      measured.bytes,
      Buffer.byteLength(source) - Buffer.byteLength(block),
      terminator,
    );
    f.write(`${f.product}/${file}`, source);
    const result = f.check();
    const failures = result.failures.join("\n");
    assert.match(failures, /: new receipt/, terminator);
    assert.match(failures, /#candidate--smuggled: new candidate/, terminator);
    assert.equal(
      result.rows.find((row) => row.document.endsWith(file)).bytes,
      measured.bytes,
      terminator,
    );
  }
});

test("registered markers exempt only as one ordered pair of exact top-level lines", () => {
  const block = `${historyStart}\n\n**Old (2026-09-27):** inside\n\n${historyEnd}`;
  const receipt = "**New (2026-09-27):** Receipt.";
  for (const [label, source] of [
    ["two pairs", `# Roadmap\n\n${block}\n\n${block}\n`],
    [
      "end before start",
      `# Roadmap\n\n${historyEnd}\n\n${receipt}\n\n${historyStart}\n`,
    ],
    [
      "indented pair",
      `# Roadmap\n\n    ${historyStart}\n    ${receipt}\n    ${historyEnd}\n`,
    ],
    [
      "fenced marker beside a real pair",
      `# Roadmap\n\n\`\`\`\n${historyStart}\n\`\`\`\n\n${block}\n`,
    ],
    [
      "a lookalike start",
      `# Roadmap\n\n${historyStart} trailing\n\n${receipt}\n\n${historyEnd}\n`,
    ],
  ]) {
    const measured = productContent("06-roadmap.md", source);
    assert.equal(measured.exemptBytes, 0, label);
    assert.equal(measured.bytes, Buffer.byteLength(source), label);
    assert.match(
      measured.failures.join("\n"),
      /the registered dotln-release-history block needs exactly one ordered pair of top-level marker lines/,
      label,
    );
  }
});

test("a quoted registered pair is an example: it exempts nothing and registers nothing", () => {
  const source = `# Roadmap\n\n> ${historyStart}\n>\n> **New (2026-09-27):** Receipt.\n>\n> ${historyEnd}\n`;
  const measured = productContent("06-roadmap.md", source);
  assert.equal(measured.exemptBytes, 0);
  assert.equal(measured.bytes, Buffer.byteLength(source));
  assert.deepEqual(measured.failures, []);
  assert.equal(measured.shapes.length, 1);
});

test("marker examples in code, quotes and larger comments never exempt bytes", () => {
  for (const source of [
    "# Product\n\n    <!-- generated:start -->\n    Example\n    <!-- generated:end -->\n",
    "# Product\n\n> <!-- generated:start -->\n> Example\n> <!-- generated:end -->\n",
    "# Product\n\n<!-- generated:start --> is an example\nExample\n<!-- generated:end --> is an example\n",
  ]) {
    const measured = productContent("00-fixture.md", source);
    assert.equal(measured.bytes, Buffer.byteLength(source));
    assert.equal(measured.exemptBytes, 0);
    assert.deepEqual(measured.failures, []);
  }
});

test("rendered list and quote paragraphs and candidate headings remain checked", () => {
  const source =
    "# Product\n\n- **Change (operator direction):** receipt\n\n> **Change (2026-09-26):** receipt\n\n> ## Candidate — quote\n\n- ### Candidate — list\n";
  const shapes = productContent("00-fixture.md", source).shapes;
  assert.equal(shapes.filter((row) => row.kind === "receipt").length, 2);
  assert.equal(shapes.filter((row) => row.kind === "candidate").length, 2);
});

test("handwritten marker pairs cannot bypass bytes, receipts or candidates", (t) => {
  const f = fixture(t);
  const additions =
    "\n<!-- notes:start -->\n\n**New (2026-09-27):** Receipt.\n\n## Candidate — smuggled\n\n" +
    "é".repeat(3000) +
    "\n<!-- notes:end -->\n";
  f.write(`${f.product}/00-fixture.md`, f.source + additions);
  const result = f.check();
  assert.equal(result.rows[0].exemptBytes, 0);
  assert.equal(result.rows[0].bytes, Buffer.byteLength(f.source + additions));
  assert.match(result.failures.join("\n"), /new receipt/);
  assert.match(result.failures.join("\n"), /new candidate/);
});

test("leading BOMs preserve shape detection and count their UTF-8 bytes", (t) => {
  const f = fixture(t);
  const source =
    f.source + "\n**New (2026-09-27):** Receipt.\n\n## Candidate — new\n";
  const plain = productContent("00-fixture.md", source);
  const roadmap = `# Roadmap\n\n## Release boundary\n\n${historyStart}\n\n**Old (2026-09-27):** exempt\n\n${historyEnd}\n\n## Future\n\n**New (2026-09-27):** counted\n`;
  const before = productContent("06-roadmap.md", roadmap);
  for (const count of [1, 2, 3]) {
    const prefix = "\uFEFF".repeat(count);
    const marked = productContent("00-fixture.md", prefix + source);
    assert.deepEqual(marked.shapes, plain.shapes);
    assert.equal(marked.shapes.length, 2);
    assert.equal(marked.bytes, plain.bytes + 3 * count);
    f.write(`${f.product}/00-fixture.md`, prefix + source);
    assert.match(f.check().failures.join("\n"), /new receipt/);
    assert.match(f.check().failures.join("\n"), /new candidate/);
    const after = productContent("06-roadmap.md", prefix + roadmap);
    assert.equal(after.exemptBytes, before.exemptBytes);
    assert.equal(after.bytes, before.bytes + 3 * count);
    assert.deepEqual(after.shapes, before.shapes);
    assert.equal(after.shapes.length, 1);
  }
});

test("stored PR links use file-relative navigation and counted historical exceptions", (t) => {
  const f = fixture(t);
  const file = "docs/final-reviews/WO-998/PR.md";
  const href = "docs/product/00-fixture.md#stable";
  f.write(file, `[old](${href})\n`);
  assert.match(f.check().failures.join("\n"), /missing file/);
  f.baseline.links.push({ file, href, reason: "missing file", count: 1 });
  assert.deepEqual(f.check().failures, []);
  f.write(file, `[old](${href})\n[duplicate](${href})\n`);
  assert.equal(f.check().failures.length, 1);
  f.write(file, "[relative](../../product/00-fixture.md#stable)\n");
  assert.deepEqual(f.check().failures, []);
  f.write("docs/final-reviews/WO-999/PR.md", `[new](${href})\n`);
  assert.equal(f.check().failures.length, 1);
});

test("an unregistered marker pair in the roadmap reports the receipt, the candidate and the bytes inside", (t) => {
  const f = fixture(t);
  const file = "06-roadmap.md";
  const base = "# Roadmap\n\n## Release boundary\n\nPointer.\n";
  const source =
    base +
    "\n<!-- release-notes:start -->\n\n**New (2026-09-27):** Receipt.\n\n## Candidate — smuggled\n\n" +
    "é".repeat(3000) +
    "\n<!-- release-notes:end -->\n";
  f.write(`${f.product}/${file}`, source);
  const result = f.check();
  const row = result.rows.find((entry) => entry.document.endsWith(file));
  assert.equal(row.exemptBytes, 0);
  assert.equal(row.bytes, Buffer.byteLength(source));
  const failures = result.failures.join("\n");
  assert.match(failures, /06-roadmap\.md#release-boundary: new receipt/);
  assert.match(failures, /06-roadmap\.md#candidate--smuggled: new candidate/);
});

// Annotated DotLn tags whose manifests name their orders, one of which has a
// heading with no version, beside a lightweight and an unrelated tag (WO-086).
function taggedFixture(t) {
  const f = fixture(t);
  const git = (args, env = {}) => {
    const result = spawnGit(
      [
        "-C",
        f.root,
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        ...args,
      ],
      { encoding: "utf8", env: { ...process.env, ...env } },
    );
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  };
  const tag = (name, manifest, date, extra = "") =>
    git(
      [
        "tag",
        "-a",
        name,
        "-m",
        `DotLn ${name}${extra}\n\nDOTLN-MANIFEST-BEGIN\n${JSON.stringify(manifest)}\nDOTLN-MANIFEST-END`,
      ],
      { GIT_COMMITTER_DATE: date },
    );
  const manifest = (
    application,
    previousRelease,
    id,
    components,
    changed = [],
  ) => ({
    release: { application, previousRelease },
    workOrder: { id, path: `docs/work-orders/${id}-${slugs[id]}.md` },
    versions: { components },
    notes: { changedFiles: changed },
  });
  const slugs = {
    "WO-900": "origin",
    "WO-901": "alpha",
    "WO-902": "beta",
    "WO-903": "gamma",
    "WO-904": "delta",
  };
  for (const [id, heading] of [
    ["WO-900", "# WO-900 — Origin: the historical release (v0.2.0)"],
    ["WO-901", "# WO-901 — Alpha: the first order (v1.0.0)"],
    ["WO-902", "# WO-902 — Beta order"],
    ["WO-903", "# WO-903 — Gamma: two orders, one tag (v1.1.0)"],
    // Display text that names the marker is neither a marker nor a lookalike.
    [
      "WO-904",
      "# WO-904 — Delta | pipes & <angles> and the `dotln-release-history:end` marker (v1.1.0)",
    ],
  ])
    f.write(
      `docs/work-orders/${id}-${slugs[id]}.md`,
      `${heading}\n\n**Objective:** Fixture.\n`,
    );
  const roadmap = `${f.product}/06-roadmap.md`;
  f.write(
    roadmap,
    `# Roadmap\n\n## Release boundary\n\n${historyStart}\n${historyEnd}\n`,
  );
  const release = (name, entry, date) => {
    f.write(`release-${name}.txt`, `${name}\n`);
    git(["add", "-A"]);
    git(["-c", "maintenance.auto=false", "commit", "-qm", name], {
      GIT_COMMITTER_DATE: date,
      GIT_AUTHOR_DATE: date,
    });
    tag(name, entry, date);
  };
  // The manifest-free first edition joins through its reviewed record, which
  // also holds its component versions.
  f.write(
    "docs/releases/v0.2.0.md",
    "# Historical v0.2.0 record for WO-900\n\n| Field | Value |\n| --- | --- |\n| Component: `@dotln/kernel` | `0.1.0` |\n| Component: `@dotln/skeleton` | `0.2.0` |\n",
  );
  f.write("release-v0.2.0.txt", "v0.2.0\n");
  git(["add", "-A"]);
  git(["-c", "maintenance.auto=false", "commit", "-qm", "v0.2.0"], {
    GIT_COMMITTER_DATE: "2026-01-01T00:00:00Z",
    GIT_AUTHOR_DATE: "2026-01-01T00:00:00Z",
  });
  git(["tag", "-a", "v0.2.0", "-m", "DotLn v0.2.0 — fixture baseline"], {
    GIT_COMMITTER_DATE: "2026-01-01T00:00:00Z",
  });
  release(
    "v1.0.0",
    manifest("v1.0.0", "v0.2.0", "WO-901", { "@dotln/kernel": "1.0.0" }),
    "2026-01-02T00:00:00Z",
  );
  release(
    "v1.0.1",
    manifest("v1.0.1", "v1.0.0", "WO-902", {
      "@dotln/skeleton": "2.0.0",
      "@dotln/kernel": "1.0.1",
    }),
    "2026-01-03T00:00:00Z",
  );
  // 23:30 at -04:00 is the next UTC day.
  release(
    "v1.1.0",
    manifest("v1.1.0", "v1.0.1", "WO-903", { "@dotln/kernel": "1.1.0" }, [
      "docs/final-reviews/WO-904/FINAL-001.md",
    ]),
    "2026-01-04T23:30:00-04:00",
  );
  git(["tag", "v9.0.0"]); // Lightweight, never a release.
  git(["tag", "-a", "v8.0.0", "-m", "Unrelated annotated tag"]);
  const cli = (...args) => {
    const result = spawnSync(
      process.execPath,
      [resolve("scripts/release.mjs"), ...args],
      {
        cwd: f.root,
        encoding: "utf8",
        env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  };
  return { ...f, git, tag, manifest, release, cli, roadmap };
}

test("release list --markdown joins each recorded tag to the orders its manifest names, as release list does", (t) => {
  const f = taggedFixture(t);
  const markdown = f.cli("list", "--markdown");
  const rows = markdown.split("\n").filter((line) => line.startsWith("| `v"));
  assert.deepEqual(rows, [
    "| `v1.1.0` | 2026-01-05 | [WO-903](../work-orders/WO-903-gamma.md) Gamma; [WO-904](../work-orders/WO-904-delta.md) Delta &#124; pipes &amp; &lt;angles&gt; and the &#96;dotln-release-history:end&#96; marker | minor | kernel 1.1.0 |",
    "| `v1.0.1` | 2026-01-03 | [WO-902](../work-orders/WO-902-beta.md) Beta order | patch | kernel 1.0.1, skeleton 2.0.0 |",
    "| `v1.0.0` | 2026-01-02 | [WO-901](../work-orders/WO-901-alpha.md) Alpha | major | kernel 1.0.0 |",
    "| `v0.2.0` | 2026-01-01 | [WO-900](../work-orders/WO-900-origin.md) Origin | initial | kernel 0.1.0, skeleton 0.2.0 |",
  ]);
  // The same tags, applications and orders as the plain listing, newest first.
  const listed = f
    .cli("list")
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => line.split("\t"))
    .map(([tag, , application, orders]) => ({
      tag,
      application,
      orders: orders.split(",").sort(),
    }))
    .reverse();
  assert.deepEqual(
    rows.map((row) => {
      const tag = /^\| `(v[^`]+)`/.exec(row)[1];
      return {
        tag,
        application: tag,
        orders: [...row.matchAll(/\[(WO-\d{3})\]/g)].map(([, id]) => id).sort(),
      };
    }),
    listed,
  );
  assert.match(
    markdown,
    /<!-- dotln-release-tags: \[\{"name":"v0\.2\.0","object":"[0-9a-f]{40}"\},\{"name":"v1\.0\.0",/,
  );
});

test("the docs check holds the table to its recorded tags: it refuses a changed row, reports a newer tag and names a missing one", (t) => {
  const f = taggedFixture(t);
  assert.equal(
    f.cli("list", "--markdown", "--write"),
    "Wrote docs/product/06-roadmap.md: release history of 4 local annotated release tags.\n",
  );
  let result = f.check();
  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.notices, []);
  const committed = readFileSync(`${f.root}/${f.roadmap}`, "utf8");
  // A sibling's newer tag reports and never refuses.
  f.release(
    "v1.1.1",
    f.manifest("v1.1.1", "v1.1.0", "WO-902", { "@dotln/kernel": "1.1.1" }),
    "2026-01-06T00:00:00Z",
  );
  result = f.check();
  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.notices, [
    "NEWER local release tags not in docs/product/06-roadmap.md: v1.1.1; the table stays valid for its recorded tags; run npm run release -- list --markdown --write to add them",
  ]);
  // A row that is not its recorded tag's row refuses at its line; so does a
  // hand-written receipt inside the exempt block.
  const lines = committed.split("\n");
  for (const edited of [
    committed.replace("| minor |", "| patch |"),
    committed.replace(
      "| Version |",
      "**WO-999 activation completion (2026-09-29):** smuggled.\n\n| Version |",
    ),
  ]) {
    f.write(f.roadmap, edited);
    const line =
      edited.split("\n").findIndex((text, index) => text !== lines[index]) + 1;
    assert.deepEqual(f.check().failures, [
      `docs/product/06-roadmap.md:${line}: generated release history differs from the rows of its recorded tags; run npm run release -- list --markdown --write`,
    ]);
  }
  f.write(f.roadmap, committed);
  assert.deepEqual(f.check().failures, []);
  // A recorded tag this checkout lacks, or holds with other bytes, is named.
  f.git(["tag", "-d", "v1.0.1"]);
  assert.deepEqual(f.check().failures, [
    "missing or changed recorded release tag: v1.0.1",
  ]);
  f.tag(
    "v1.0.1",
    f.manifest("v1.0.1", "v1.0.0", "WO-902", { "@dotln/kernel": "1.0.1" }),
    "2026-01-03T00:00:00Z",
    " — re-made",
  );
  assert.deepEqual(f.check().failures, [
    "missing or changed recorded release tag: v1.0.1",
  ]);
  // Regeneration records the tags as they are now.
  f.cli("list", "--markdown", "--write");
  result = f.check();
  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.notices, []);
});

test("the document CLI and gate report the kinds and no ceiling column at default and relocated roots", async (t) => {
  for (const roots of [{}, { docs: "records" }])
    await t.test(roots.docs ?? "default roots", async (t) => {
      const f = fixture(t, roots);
      f.write(`${f.product}/01-extra.md`, f.source + "é".repeat(4000));
      f.controls();
      const cli = spawnSync(process.execPath, [script], {
        cwd: f.root,
        env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
        encoding: "utf8",
      });
      assert.equal(cli.status, 0, cli.stdout + cli.stderr);
      assert.match(
        cli.stdout,
        /^Documents: \d+ standing, \d+ record, \d+ generated; \d+ standing without a reader binding$/m,
      );
      assert.doesNotMatch(cli.stdout + cli.stderr, /Ceiling|ceiling/);
      const binding = "select-launchpad.mjs";
      f.write(binding, "process.env.DOTLN_LAUNCHPAD = process.cwd();\n");
      const table = [
        {
          ...suites.find((row) => row.name === "docs-check"),
          command: [
            process.execPath,
            "--import",
            pathToFileURL(join(f.root, binding)).href,
            script,
          ],
          needsBuild: false,
        },
      ];
      const lines = [];
      const saved = console.log;
      let check;
      try {
        console.log = (line) => lines.push(String(line));
        check = await runGate(["--document", "--serial"], f.root, { table });
      } finally {
        console.log = saved;
      }
      assert.equal(check.exitCode, 0, lines.join("\n"));
      assert.doesNotMatch(lines.join("\n"), /bytes over ceiling/);
    });
});

test("document gate forwards explicit success diagnostics and preserves full failure output", async (t) => {
  const f = fixture(t);
  for (const exitCode of [0, 1]) {
    f.write(
      "scripts/notice.mjs",
      `console.log("ordinary detail");\nconsole.log("ADVISORY fixture notice");\nconsole.log("NEWER fixture history");\nconsole.log("criteria advisory: WO-999 criterion 1: fixture");\nprocess.exitCode = ${exitCode};\n`,
    );
    const lines = [];
    const saved = console.log;
    try {
      console.log = (line) => lines.push(String(line));
      const check = await runGate(["--document", "--serial"], f.root, {
        table: [
          {
            name: "fixture-notices",
            document: true,
            command: [process.execPath, "scripts/notice.mjs"],
          },
        ],
      });
      assert.equal(check.exitCode, exitCode, lines.join("\n"));
      for (const diagnostic of [
        "ADVISORY fixture notice",
        "NEWER fixture history",
        "criteria advisory: WO-999 criterion 1: fixture",
      ])
        assert.equal(
          lines.filter((line) => line.endsWith(diagnostic)).length,
          1,
        );
      assert.equal(
        lines.some((line) => line.endsWith("ordinary detail")),
        exitCode !== 0,
      );
    } finally {
      console.log = saved;
    }
  }
});

test("two attributed provenance fields in one order get their own keys and fingerprints", (t) => {
  const f = fixture(t);
  const file = "docs/work-orders/WO-999-fixture.md";
  f.write(
    file,
    "# WO-999 — Fixture\n\n**Track:** machinery\n**Nomination provenance:** The operator said “synthetic first quote”.\n\n**Provenance:** The operator said “synthetic second quote”.\n",
  );
  const found = operatorWordFindings(f.root);
  assert.deepEqual(
    found.map((row) => row.record),
    ["provenance", "provenance-2"],
  );
  assert.notEqual(found[0].fingerprint, found[1].fingerprint);
  assert.doesNotMatch(JSON.stringify(found), /synthetic/);
  f.baseline.operatorWords = { [`${file}#provenance`]: found[0].fingerprint };
  let result = f.check();
  assert.equal(result.operatorWords.current, 1);
  assert.equal(result.operatorWords.rows[0].record, "provenance-2");
  f.baseline.operatorWords[`${file}#provenance-2`] = found[1].fingerprint;
  result = f.check();
  assert.equal(result.operatorWords.current, 0);
  assert.equal(result.operatorWords.historical, 2);
  // Only the second field's words change: only its record is current.
  f.write(
    file,
    "# WO-999 — Fixture\n\n**Track:** machinery\n**Nomination provenance:** The operator said “synthetic first quote”.\n\n**Provenance:** The operator said “another quote”.\n",
  );
  assert.deepEqual(
    f.check().operatorWords.rows.map((row) => row.record),
    ["provenance-2"],
  );
  // A clean first field still takes the first key, so the second keeps its own.
  f.write(
    file,
    "# WO-999 — Fixture\n\n**Nomination provenance:** Nominated by the planner.\n\n**Provenance:** The operator said “synthetic second quote”.\n",
  );
  assert.deepEqual(
    operatorWordFindings(f.root).map((row) => row.record),
    ["provenance-2"],
  );
  f.baseline.operatorWords = {};
  f.controls();
  const cli = spawnSync(process.execPath, [script], {
    cwd: f.root,
    env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
    encoding: "utf8",
  });
  assert.match(
    cli.stdout,
    /ADVISORY docs\/work-orders\/WO-999-fixture\.md#provenance-2:/,
  );
});

test("the docs check fails on a roadmap whose release-history block is removed and reports a tag whose annotation cannot be read", (t) => {
  const f = taggedFixture(t);
  f.cli("list", "--markdown", "--write");
  assert.deepEqual(f.check().failures, []);
  const committed = readFileSync(`${f.root}/${f.roadmap}`, "utf8");
  const lines = committed.split("\n");
  const first = lines.findIndex((line) => line.includes(historyStart)),
    last = lines.findIndex((line) => line.includes(historyEnd));
  assert.ok(first >= 0 && last > first, "the generated block is present");
  f.write(
    f.roadmap,
    [...lines.slice(0, first), ...lines.slice(last + 1)].join("\n"),
  );
  assert.deepEqual(f.check().failures, [
    `docs/product/06-roadmap.md: no generated release history block; add the ${historyStart} and ${historyEnd} lines where the table belongs, then run npm run release -- list --markdown --write`,
  ]);
  f.write(f.roadmap, committed);
  assert.deepEqual(f.check().failures, []);
  // A header-only tag object holds no annotation to read.
  const head = f.git(["rev-parse", "HEAD"]).trim();
  const object = `object ${head}\ntype commit\ntag v1.2.0\ntagger Fixture <fixture@example.invalid> 1767657600 +0000\n`;
  let made = spawnGit(["-C", f.root, "mktag"], {
    input: object,
    encoding: "utf8",
  });
  if (made.status !== 0)
    made = spawnGit(
      [
        "-C",
        f.root,
        "hash-object",
        "-t",
        "tag",
        "-w",
        "--stdin",
        "--literally",
      ],
      { input: object, encoding: "utf8" },
    );
  assert.equal(made.status, 0, made.stderr);
  f.git(["update-ref", "refs/tags/v1.2.0", made.stdout.trim()]);
  assert.match(f.git(["cat-file", "-p", "v1.2.0"]), /^tag v1\.2\.0$/mu);
  let result;
  assert.doesNotThrow(() => {
    result = f.check();
  });
  assert.deepEqual(result.failures, [
    "docs/product/06-roadmap.md: a local release tag's annotation cannot be read (v1.2.0 is not an annotated tag object); repair or delete the tag",
  ]);
  assert.deepEqual(result.notices, []);
});

test("a home or private temporary path in a document fails at its line; baselined lines pass until edited", (t) => {
  const f = fixture(t);
  const file = "docs/evidence/WO-999/README.md";
  const message =
    "absolute home or private temporary path; write a repository-relative path or a placeholder such as <worktree>/ or <tmp>/";
  f.write(file, "Ran in /Users/fixture-user/work/repo.\n");
  let result = f.check();
  assert.deepEqual(result.failures, [`${file}:1: ${message}`]);
  assert.doesNotMatch(result.failures.join("\n"), /fixture-user/);
  f.baseline.homePaths = {
    [file]: homePathFindings(f.root).map((row) => row.fingerprint),
  };
  result = f.check();
  assert.deepEqual(result.failures, []);
  assert.equal(result.historicalHomePaths, 1);
  // An edited line is a new line, and a pasted duplicate exceeds the count.
  f.write(file, "Ran in /Users/fixture-user/work/other.\n");
  assert.deepEqual(f.check().failures, [`${file}:1: ${message}`]);
  f.write(
    file,
    "Ran in /Users/fixture-user/work/repo.\nRan in /Users/fixture-user/work/repo.\n",
  );
  assert.deepEqual(f.check().failures, [`${file}:2: ${message}`]);
  // Each positive form on its own line; placeholders and relative tails are
  // not paths, and a bare mention names no file.
  f.baseline.homePaths = {};
  f.write(
    file,
    [
      "/private/var/folders/ab/T/x",
      "/tmp/dotln-fixture/x",
      "file:///Users/fixture-user/x",
      "/home/fixture/x",
      "/Users/...",
      "/var/folders/.../T",
      "SCRATCH/tmp/x",
      ".runtime/tmp/x",
      "`/tmp/` alone",
    ].join("\n") + "\n",
  );
  assert.deepEqual(
    f.check().failures.map((line) => Number(line.split(":")[1])),
    [1, 2, 3, 4],
  );
  for (const malformed of [{ [file]: "x" }, { [file]: ["not-a-digest"] }]) {
    f.baseline.homePaths = malformed;
    assert.throws(
      () => f.check(),
      /Historical home-path exceptions require a file and SHA-256 line fingerprints/,
    );
  }
  f.baseline.homePaths = {};
  f.write(file, "Ran in /Users/fixture-user/work/repo.\n");
  f.controls();
  const cli = spawnSync(process.execPath, [script], {
    cwd: f.root,
    env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
    encoding: "utf8",
  });
  assert.equal(cli.status, 1);
  assert.match(
    cli.stderr,
    /FAIL docs\/evidence\/WO-999\/README\.md:1: absolute home/,
  );
  assert.doesNotMatch(cli.stdout + cli.stderr, /fixture-user/);
});

test("records reject new home-path lines by type, root and counted fingerprint without revealing them", (t) => {
  for (const roots of [{}, { docs: "manual", evidence: "proof" }]) {
    const f = fixture(t, roots);
    const docs = roots.docs ?? "docs";
    const evidence = roots.evidence ?? `${docs}/evidence`;
    const source = '{\n  "path": "/Users/fixture-user/x"\n}\n';
    const message =
      "absolute home path in a record; write a repository-relative path or a placeholder such as <home>/ or <worktree>/";
    const files = ["json", "jsonl", "log", "txt"].map(
      (extension) => `${evidence}/WO-999/record.${extension}`,
    );
    for (const file of files) f.write(file, source);
    assert.equal(spawnGit(["add", "--", files[0]], { cwd: f.root }).status, 0);
    assert.deepEqual(recordFiles(f.root), [...files].sort());
    let result = f.check();
    assert.deepEqual(
      result.failures,
      [...files].sort().map((file) => `${file}:2: ${message}`),
    );
    assert.doesNotMatch(result.failures.join("\n"), /fixture-user/u);
    f.baseline.homePaths = Object.fromEntries(
      homePathFindings(f.root, files).map(({ file, fingerprint }) => [
        file,
        [fingerprint],
      ]),
    );
    assert.deepEqual(f.check().failures, []);
    assert.equal(f.check().historicalHomePaths, 4);
    f.write(files[0], source.replace("/x", "/edited"));
    assert.deepEqual(f.check().failures, [`${files[0]}:2: ${message}`]);
    f.write(files[0], source + source);
    assert.deepEqual(f.check().failures, [`${files[0]}:5: ${message}`]);
    for (const file of files)
      f.write(file, "/tmp/fixture/x\n/private/var/folders/ab/T/x\n");
    for (const file of [
      "root.json",
      `${docs}/intake/private.json`,
      `${docs}/control/local/private.json`,
      `${evidence}/probe.mjs`,
      `${evidence}/ignored.json`,
    ])
      f.write(file, source);
    f.write(".gitignore", `${evidence}/ignored.json\n`);
    assert.deepEqual(recordFiles(f.root), [...files].sort());
    assert.deepEqual(f.check().failures, []);
    f.write(files[1], "/home/fixture-user/x\n");
    f.controls();
    const cli = spawnSync(process.execPath, [script], {
      cwd: f.root,
      env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
      encoding: "utf8",
    });
    assert.equal(cli.status, 1);
    assert.ok(cli.stderr.includes(`${files[1]}:1: ${message}`));
    assert.doesNotMatch(cli.stdout + cli.stderr, /fixture-user/u);
  }
});

test("the home placeholder substitution reaches a fixed point that the record rule passes", () => {
  // A second home prefix directly after an account name is left by one pass
  // and would match again; the result below holds no match, so projecting it
  // again changes nothing. A non-adjacent second prefix was already stable.
  for (const [text, expected] of [
    ["/Users/fixture-user/home/other", "<home><home>"],
    [
      "/home/fixture-user/Users/x and /Users/fixture-user/x/home/y",
      "<home><home> and <home>/x/home/y",
    ],
    ["/Users/fixture-user/Users/second/home/third/x", "<home><home><home>/x"],
    ["<home>/home/other", "<home><home>"],
    ["Inspect <home>/x and ~/x", "Inspect <home>/x and ~/x"],
  ]) {
    const once = withoutHomeDirectories(text);
    assert.equal(once, expected, text);
    assert.equal(withoutHomeDirectories(once), once, text);
    assert.doesNotMatch(once, HOME_DIRECTORY, text);
    assert.doesNotMatch(once, /fixture-user/u, text);
  }
});

test("a bare .md basename keeps the Markdown rule the listing gives it", (t) => {
  const f = fixture(t);
  // markdownFiles lists by suffix; the rule must not depend on extname, which
  // is empty for a basename that is only an extension.
  assert.equal(privatePathRule(".md"), PRIVATE_PATH);
  assert.equal(privatePathRule("docs/evidence/.md"), PRIVATE_PATH);
  assert.equal(privatePathRule("notes.md.json"), HOME_DIRECTORY);
  assert.equal(privatePathRule("notes.md.sh"), null);
  const file = "docs/evidence/WO-999/.md";
  f.write(file, "Ran in /Users/fixture-user/work/repo.\n");
  assert.deepEqual(f.check().failures, [
    `${file}:1: absolute home or private temporary path; write a repository-relative path or a placeholder such as <worktree>/ or <tmp>/`,
  ]);
});

test("an unreadable entry or a link to a directory refuses by its own path and never names the root", (t) => {
  const f = fixture(t);
  f.write("docs/evidence/WO-999/README.md", "A readable record set.\n");
  const remedy =
    "replace the link or restore read permission, or move it out of the document roots";
  const refuses = (file, expected) =>
    assert.throws(
      () => f.check(),
      (error) => {
        assert.equal(error.message, expected);
        return true;
      },
      file,
    );
  const link = "docs/evidence/WO-999/link.json";
  symlinkSync(".", join(f.root, link));
  const expected = `${link}: record is not a readable regular file (EISDIR); ${remedy}`;
  refuses(link, expected);
  f.controls();
  const cli = spawnSync(process.execPath, [script], {
    cwd: f.root,
    env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
    encoding: "utf8",
  });
  assert.equal(cli.status, 1);
  assert.ok(cli.stderr.includes(`FAIL docs check: ${expected}`), cli.stderr);
  assert.ok(!(cli.stdout + cli.stderr).includes(f.root));
  rmSync(join(f.root, link));
  // A document is read by the link check before the private-path screen; the
  // same refusal covers it there.
  const documentLink = "docs/evidence/WO-999/link.md";
  symlinkSync(".", join(f.root, documentLink));
  refuses(
    documentLink,
    `${documentLink}: document is not a readable regular file (EISDIR); ${remedy}`,
  );
  rmSync(join(f.root, documentLink));
  // A directory error carries no path, a permission error does; the refusal
  // still names only the repository-relative one. Root can read anything.
  if (process.getuid?.() !== 0)
    for (const [file, kind] of [
      ["docs/evidence/WO-999/locked.json", "record"],
      ["docs/evidence/WO-999/locked.md", "document"],
    ]) {
      f.write(file, "No path here.\n");
      chmodSync(join(f.root, file), 0);
      refuses(
        file,
        `${file}: ${kind} is not a readable regular file (EACCES); ${remedy}`,
      );
      chmodSync(join(f.root, file), 0o644);
      rmSync(join(f.root, file));
    }
});

test("document readers refuse dangling, unreadable and non-file inputs without disclosing their root", (t) => {
  const f = fixture(t);
  const refuses = (operation, file) =>
    assert.throws(operation, (error) => {
      assert.ok(error.message.includes(file), error.message);
      assert.ok(!error.message.includes(f.root), error.message);
      assert.doesNotMatch(error.message, /fixture-user/u);
      return true;
    });
  f.record("resume: next");
  const decision = "docs/evidence/WO-999/decisions.md";
  rmSync(join(f.root, decision));
  symlinkSync("absent.md", join(f.root, decision));
  refuses(() => readDecisions(f.root), decision);
  refuses(f.check, decision);
  rmSync(join(f.root, decision));
  f.record("resume: next");
  const product = "docs/product/dangling.md";
  symlinkSync("absent.md", join(f.root, product));
  refuses(f.check, product);
  rmSync(join(f.root, product));
  const record = "docs/evidence/WO-999/dangling.json";
  symlinkSync("absent.json", join(f.root, record));
  assert.ok(recordFiles(f.root).includes(record));
  refuses(f.check, record);
  rmSync(join(f.root, record));
  if (process.getuid?.() !== 0) {
    for (const [file, operation] of [
      [decision, () => readDecisions(f.root)],
      ["docs/product/00-fixture.md", f.check],
      [
        "outside-list.md",
        () => linkFailures(f.root, ["docs/evidence/WO-999/link.md"]),
      ],
    ]) {
      if (file === "outside-list.md") {
        f.write(file, "# Target\n");
        f.write(
          "docs/evidence/WO-999/link.md",
          "[target](../../../outside-list.md#target)\n",
        );
      }
      chmodSync(join(f.root, file), 0);
      try {
        refuses(operation, file);
      } finally {
        chmodSync(join(f.root, file), 0o644);
      }
    }
    const directory = "docs/product/unreadable";
    mkdirSync(join(f.root, directory));
    chmodSync(join(f.root, directory), 0);
    try {
      refuses(f.check, "docs/product");
    } finally {
      chmodSync(join(f.root, directory), 0o755);
    }
  }
  const linked = fixture(t);
  rmSync(join(linked.root, "docs/product"), { recursive: true });
  symlinkSync("evidence", join(linked.root, "docs/product"));
  assert.throws(
    linked.check,
    /docs\/product: document directory is unreadable \(ENOTDIR\)/u,
  );
  if (process.platform !== "win32") {
    const file = "docs/evidence/WO-999/pipe.json";
    f.write(file, "{}\n");
    assert.equal(spawnGit(["add", "--", file], { cwd: f.root }).status, 0);
    rmSync(join(f.root, file));
    assert.equal(spawnSync("mkfifo", [join(f.root, file)]).status, 0);
    f.controls();
    const cli = spawnSync(process.execPath, [script], {
      cwd: f.root,
      env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
      encoding: "utf8",
      timeout: 2000,
    });
    assert.equal(cli.status, 1, cli.stderr || cli.error?.message);
    assert.match(
      cli.stderr,
      /pipe\.json: record is not a readable regular file \(ENOTFILE\)/u,
    );
    assert.ok(!(cli.stdout + cli.stderr).includes(f.root));
  }
});

test("document diagnostics omit private link text and parser excerpts while preserving baseline identity", (t) => {
  const f = fixture(t);
  const file = "docs/evidence/WO-999/links.md";
  f.write(
    file,
    "[home](/Users/fixture-user/missing.md#anchor)\n[encoded](/home/%66ixture-user/missing.md)\n",
  );
  const links = linkFailures(f.root);
  assert.ok(
    links.some((row) => row.href.includes("fixture-user")),
    "baseline identity retains the original destination",
  );
  const result = f.check();
  assert.ok(result.failures.some((row) => row.endsWith("<private path>")));
  assert.doesNotMatch(
    result.failures.join("\n"),
    /fixture-user|%66ixture-user/u,
  );
  f.baseline.links = links.map(({ file, href, reason }) => ({
    file,
    href,
    reason,
    count: 1,
  }));
  assert.equal(f.check().historicalLinks, links.length);
  f.controls();
  for (const record of ["doc-baseline.json", "documents.json"]) {
    f.controls();
    f.write(`docs/control/${record}`, '{"bad": /Users/fixture-user/invalid}\n');
    assert.throws(
      () => checkDocs(f.root),
      (error) => {
        assert.equal(error.message, `docs/control/${record}: invalid JSON`);
        return true;
      },
    );
  }
  f.record("resume: next", {
    reopenWhen: {
      metric: "/Users/fixture-user/value",
      operator: ">",
      value: 1,
    },
  });
  assert.throws(
    () => readDecisions(f.root),
    /WO-999-D001: unresolved reopening metric <private path>/u,
  );
});

test("bare and case-variant record suffixes share listing and privacy rules", (t) => {
  const f = fixture(t);
  const names = [
    ".json",
    ".jsonl",
    "record.JSON",
    "record.JsonL",
    "record.LOG",
    "record.TxT",
  ];
  const files = names.map((name) => `docs/evidence/WO-999/${name}`);
  for (const file of files) {
    assert.equal(privatePathRule(file), HOME_DIRECTORY);
    f.write(file, '"/home/fixture-user/work"\n');
  }
  assert.deepEqual(recordFiles(f.root), [...files].sort());
  const result = f.check();
  assert.equal(result.failures.length, files.length);
  assert.doesNotMatch(result.failures.join("\n"), /fixture-user/u);
  for (const file of files) f.write(file, '"<home>/work"\n');
  assert.deepEqual(f.check().failures, []);
  assert.equal(privatePathRule("unchanged.MD"), null);
});

test("document listing excludes private and package roots before inspecting unreadable cached entries", (t) => {
  if (process.getuid?.() === 0) return t.skip("root bypasses file permissions");
  const f = fixture(t);
  const directories = [
    "packages/fixture-private",
    "docs/intake/private",
    "docs/control/local/private",
  ];
  const files = directories.map((directory) => `${directory}/cached.json`);
  for (const file of files) f.write(file, '"/Users/fixture-user/excluded"\n');
  assert.equal(
    spawnGit(["add", "-f", "--", ...files], { cwd: f.root }).status,
    0,
  );
  for (const directory of directories) chmodSync(join(f.root, directory), 0);
  try {
    assert.deepEqual(recordFiles(f.root), []);
    const result = f.check();
    assert.deepEqual(result.failures, []);
    // The verbatim screen reads the intake root and names the closed
    // directory there instead of failing on it (WO-259).
    assert.ok(
      result.advisories.includes(
        "docs/intake/private cannot be listed (EACCES); the verbatim screen did not read the captures under it",
      ),
      result.advisories.join("\n"),
    );
  } finally {
    for (const directory of directories)
      chmodSync(join(f.root, directory), 0o755);
  }
});

test("a home path directly after a JSON escape sequence fails the record rule and is substituted", (t) => {
  const f = fixture(t);
  const message =
    "absolute home path in a record; write a repository-relative path or a placeholder such as <home>/ or <worktree>/";
  const files = ["json", "jsonl"].map(
    (extension) => `docs/evidence/WO-999/captured.${extension}`,
  );
  // Captured output stored as a JSON string: the letter of an escape is no
  // word boundary, so the path after it is still a home path.
  const captured =
    '{"output":"first line\\n/Users/fixture-user/x\\t/home/fixture-user/y","unicode":"a\\u000a/home/fixture-user/z"}\n';
  for (const file of files) f.write(file, captured);
  const failures = files.map((file) => `${file}:1: ${message}`);
  let result = f.check();
  assert.deepEqual(result.failures, failures);
  assert.doesNotMatch(result.failures.join("\n"), /fixture-user/u);
  // Markdown keeps its plain boundary: escaped forms in prose stay outside
  // this screen.
  const document = "docs/evidence/WO-999/README.md";
  f.write(document, 'Output: "line\\n/Users/fixture-user/x"\n');
  assert.deepEqual(f.check().failures, failures);
  for (const file of files)
    f.write(file, '{"output":"first line\\n<home>/x\\t<home>/y"}\n');
  assert.deepEqual(f.check().failures, []);
  assert.equal(
    withoutHomeDirectories(
      '"line\\n/Users/fixture-user/x\\t/home/fixture-user/y\\u000a/home/fixture-user/z"',
    ),
    '"line\\n<home>/x\\t<home>/y\\u000a<home>/z"',
  );
});

test("a typed operator quotation needs its capture digest; a quoted field or report paragraph advises by its own record", (t) => {
  const f = fixture(t);
  const path = "docs/evidence/WO-999/decisions.md";
  // The typed field fails the check; every other finding stays an advisory.
  f.record("resume: next", {
    operatorQuote: { text: "synthetic captured words" },
  });
  let result = f.check();
  assert.deepEqual(result.failures, [
    `${path}#WO-999-D001: operatorQuote 1 needs text and captureSha256 (sha256:<digest> of the captured words in ignored intake); paraphrase instead of quoting`,
  ]);
  assert.doesNotMatch(result.failures.join("\n"), /synthetic captured words/);
  f.record("resume: next", {
    operatorQuote: {
      text: "synthetic captured words",
      captureSha256: `sha256:${"d".repeat(64)}`,
    },
  });
  assert.deepEqual(f.check().failures, []);
  for (const quote of [
    [{ text: "x" }],
    { text: "", captureSha256: `sha256:${"d".repeat(64)}` },
    { text: "x", captureSha256: "d".repeat(64) },
    "words",
  ]) {
    f.record("resume: next", { operatorQuote: quote });
    assert.equal(f.check().failures.length, 1, JSON.stringify(quote));
  }
  f.controls();
  const cli = spawnSync(process.execPath, [script], {
    cwd: f.root,
    env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
    encoding: "utf8",
  });
  assert.equal(cli.status, 1);
  assert.match(cli.stderr, /operatorQuote 1 needs text and captureSha256/);
  // Each quoting field advises under its own record.
  const records = () => operatorWordFindings(f.root).map((row) => row.record);
  f.record("resume: next", {
    evidence: ["The operator said “synthetic evidence quote”."],
  });
  assert.deepEqual(records(), ["WO-999-D001/evidence-1"]);
  f.record("resume: next", {
    kind: "correction",
    misread: "The operator said “synthetic”.",
    meant: "a paraphrase",
    changed: "the text",
  });
  assert.deepEqual(records(), ["WO-999-D001/misread"]);
  f.record("resume: next", {
    rejected: [{ option: "x", reason: "The operator said “synthetic”." }],
  });
  assert.deepEqual(records(), ["WO-999-D001/rejected-1.reason"]);
  // An operator-named field attributes its value by its key alone; a marked
  // paraphrase and a capture digest exempt it; a baseline covers it.
  f.record("resume: next", { operatorAuthorization: "synthetic words" });
  const named = operatorWordFindings(f.root);
  assert.deepEqual(
    named.map((row) => row.record),
    ["WO-999-D001/operatorAuthorization"],
  );
  f.baseline.operatorWords = {
    [`${named[0].file}#${named[0].record}`]: named[0].fingerprint,
  };
  assert.equal(f.check().operatorWords.current, 0);
  assert.equal(f.check().operatorWords.historical, 1);
  f.record("resume: next", {
    operatorAuthorization: ["Paraphrase: synthetic", "second words"],
  });
  assert.deepEqual(records(), ["WO-999-D001/operatorAuthorization-2"]);
  f.record("resume: next", {
    operatorAuthorization: "synthetic words",
    evidence: [`SHA-256 ${"a".repeat(64)}`],
  });
  assert.deepEqual(records(), []);
  // A backquote run inside a JSON string no longer leaks the record into the
  // prose the decision-level check reads.
  f.record("resume: next", {
    evidence: ["a line that starts with ``` toggles a fence"],
    rejected: [
      { option: "Ask the operator to authorize the redesign", reason: "x" },
    ],
  });
  assert.deepEqual(records(), []);
  // Reports and planning documents: a paragraph that attributes words is a
  // record keyed by its own content, so an insertion above it keeps the key;
  // a fenced example is no record.
  f.record("resume: next");
  f.write(
    "docs/verifications/WO-999/VER-001.md",
    "# VER-001\n\nThe operator said “synthetic report quote”.\n",
  );
  f.write(
    "docs/planning/fixture-pass.md",
    "# Pass\n\nThe operator said “synthetic planning quote”.\n\n```\nThe operator said “fenced”.\n```\n",
  );
  const documents = operatorWordFindings(f.root);
  assert.deepEqual(
    documents.map((row) => [row.file, row.line]),
    [
      ["docs/planning/fixture-pass.md", 3],
      ["docs/verifications/WO-999/VER-001.md", 3],
    ],
  );
  assert.ok(
    documents.every((row) => /^paragraph-[0-9a-f]{12}$/u.test(row.record)),
  );
  assert.doesNotMatch(JSON.stringify(documents), /synthetic/);
  f.write(
    "docs/verifications/WO-999/VER-001.md",
    "# VER-001\n\nAn inserted paragraph.\n\nThe operator said “synthetic report quote”.\n",
  );
  const moved = operatorWordFindings(f.root).find(
    (row) => row.file === documents[1].file,
  );
  assert.equal(moved.record, documents[1].record);
  assert.equal(moved.line, 5);
});

// A repository whose front page is under guard: a base commit on main with
// the marked page, its control record and the order's authority file (with or
// without the declaration), then a wo-999 branch where the change happens.
// The front page every front-page fixture and corpus row starts from: a
// release block and two counted lines under "What runs today", then "Next".
const frontPageText = ({
  version = "v0.1.0",
  sentences = ["The kernel replays.", "The skeleton runs."],
  closing = "A closing paragraph.",
  lead = "",
} = {}) =>
  `# Page\n\n## What runs today\n\n<!-- DOTLN-RELEASE-BEGIN -->\nThis source prepares DotLn \`${version}\`.\n<!-- DOTLN-RELEASE-END -->\n\n${lead}<!-- dotln-what-runs:start -->\n${sentences.map((line) => `${line}\n`).join("")}<!-- dotln-what-runs:end -->\n\n## Next\n\n${closing}\n`;
function frontPageFixture(
  t,
  { declare = true, lineBudget = 3, basePage, baseBranch = "main" } = {},
) {
  const f = fixture(t);
  const git = (...args) => {
    const result = spawnGit(
      [
        "-C",
        f.root,
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        ...args,
      ],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, `git ${args.join(" ")}\n${result.stderr}`);
    return result.stdout.trim();
  };
  const page = frontPageText;
  const record = {
    schemaVersion: 1,
    page: "README.md",
    generatedBlocks: [
      {
        start: "<!-- DOTLN-RELEASE-BEGIN -->",
        end: "<!-- DOTLN-RELEASE-END -->",
      },
    ],
    whatRunsToday: {
      start: "<!-- dotln-what-runs:start -->",
      end: "<!-- dotln-what-runs:end -->",
      lineBudget,
    },
  };
  const order = (field) =>
    `# WO-999 — Fixture\n\n**Track:** machinery\n${field}\n**Objective:** Fixture.\n`;
  f.write("README.md", basePage ?? page());
  f.write(`${f.control}/front-page.json`, JSON.stringify(record));
  f.write(
    "docs/work-orders/WO-999-fixture.md",
    order(declare ? "**Front page:** README.md" : ""),
  );
  f.controls();
  git("checkout", "-q", "-b", baseBranch);
  git("add", "-A");
  git("-c", "maintenance.auto=false", "commit", "-qm", "base");
  git("checkout", "-q", "-b", "wo-999");
  const frontPage = () =>
    f
      .check()
      .failures.filter((line) =>
        /^(?:README\.md|docs\/control\/front-page\.json)/.test(line),
      );
  return { ...f, git, page, order, record, frontPage };
}

test("the front page changes outside its generated blocks only through an order whose header declared it at the merge base", (t) => {
  const refused = frontPageFixture(t, { declare: false });
  assert.deepEqual(refused.frontPage(), []);
  // The version line is a generated block's interior: free to change.
  refused.write("README.md", refused.page({ version: "v0.2.0" }));
  assert.deepEqual(refused.frontPage(), []);
  refused.write(
    "README.md",
    refused.page({ closing: "An appended sentence." }),
  );
  assert.match(
    refused.frontPage().join("\n"),
    /README\.md: changed outside its generated blocks while WO-999's leading header at the merge base declares no `\*\*Front page:\*\*` field;[^`]* see `git diff [0-9a-f]{12} -- README\.md`/,
  );
  // The same sentence inside the budgeted section is refused the same way.
  refused.write(
    "README.md",
    refused.page({
      sentences: ["The kernel replays.", "A new capability runs."],
    }),
  );
  assert.match(
    refused.frontPage().join("\n"),
    /changed outside its generated blocks/,
  );
  // Adding the field on the branch itself declares nothing: the base is read.
  refused.write(
    "docs/work-orders/WO-999-fixture.md",
    refused.order("**Front page:** README.md"),
  );
  assert.match(
    refused.frontPage().join("\n"),
    /while WO-999's leading header at the merge base declares no `\*\*Front page:\*\*` field/,
  );
  const admitted = frontPageFixture(t, { declare: true });
  admitted.write(
    "README.md",
    admitted.page({ closing: "An appended sentence." }),
  );
  assert.deepEqual(admitted.frontPage(), []);
  // A branch that names no order has no declaration to admit it.
  admitted.git("checkout", "-q", "-b", "planning/fixture");
  assert.match(
    admitted.frontPage().join("\n"),
    /changed outside its generated blocks on branch planning\/fixture, which names no work order/,
  );
});

test("the control record that governs is the merge base's, so a branch cannot switch the guard off", (t) => {
  const f = frontPageFixture(t, { declare: false });
  f.write("README.md", f.page({ closing: "An appended sentence." }));
  const path = `${f.control}/front-page.json`;
  // Deleting the record, raising the budget or redrawing the generated blocks
  // changes nothing about the judgment and is itself refused.
  rmSync(join(f.root, path));
  let found = f.frontPage().join("\n");
  assert.match(
    found,
    /front-page\.json: differs from its version at the merge base with main while WO-999's leading header at the merge base declares no/,
  );
  assert.match(found, /changed outside its generated blocks/);
  f.write(
    path,
    JSON.stringify({
      ...f.record,
      whatRunsToday: { ...f.record.whatRunsToday, lineBudget: 99 },
    }),
  );
  f.write(
    "README.md",
    f.page({ sentences: ["One.", "Two.", "Three.", "Four."] }),
  );
  found = f.frontPage().join("\n");
  assert.match(
    found,
    /front-page\.json: differs from its version at the merge base/,
  );
  assert.match(
    found,
    /"What runs today" holds 4 counted lines \(the non-empty lines between its markers\); the budget in docs\/control\/front-page\.json at the merge base is 3/,
  );
  f.write(
    path,
    JSON.stringify({
      ...f.record,
      generatedBlocks: [
        { start: "<!-- dotln-what-runs:start -->", end: "<!-- never -->" },
      ],
    }),
  );
  found = f.frontPage().join("\n");
  assert.match(
    found,
    /front-page\.json: differs from its version at the merge base/,
  );
  assert.match(
    found,
    /front-page\.json: invalid front-page control record: whatRunsToday markers cannot also bound a generated block/,
  );
  // A declared order may move the record, and its new record must be valid;
  // but the section's budget is the merge base's, so raising it on the branch
  // that fills it admits nothing: planning moves the budget on main.
  const declared = frontPageFixture(t, { declare: true });
  declared.write(
    path,
    JSON.stringify({
      ...declared.record,
      whatRunsToday: { ...declared.record.whatRunsToday, lineBudget: 4 },
    }),
  );
  declared.write(
    "README.md",
    declared.page({ sentences: ["One.", "Two.", "Three.", "Four."] }),
  );
  assert.match(
    declared.frontPage().join("\n"),
    /holds 4 counted lines[^;]*; the budget in docs\/control\/front-page\.json at the merge base is 3\..*planning moves the budget on main/,
  );
  declared.write(path, JSON.stringify({ schemaVersion: 2 }));
  assert.match(
    declared.frontPage().join("\n"),
    /front-page\.json: invalid front-page control record: schemaVersion must be 1/,
  );
  declared.write(path, "{ not json");
  assert.match(
    declared.frontPage().join("\n"),
    /invalid front-page control record: /,
  );
});

test("What runs today keeps one sentence per line within its recorded budget, and the page names no receipt", (t) => {
  const f = frontPageFixture(t, { declare: true, lineBudget: 3 });
  f.write(
    "README.md",
    f.page({ sentences: ["One runs.", "Two runs.", "Three runs."] }),
  );
  assert.deepEqual(f.frontPage(), []);
  f.write(
    "README.md",
    f.page({
      sentences: ["One runs.", "Two runs.", "Three runs.", "Four runs."],
    }),
  );
  assert.match(
    f.frontPage().join("\n"),
    /"What runs today" holds 4 counted lines \(the non-empty lines between its markers\); the budget in docs\/control\/front-page\.json at the merge base is 3/,
  );
  // Blank lines inside the section do not count; two sentences on one line
  // and a line without a terminator are refused; a lost marker fails.
  f.write(
    "README.md",
    f.page({ sentences: ["One runs.", "", "Two runs.", "", "Three runs."] }),
  );
  assert.deepEqual(f.frontPage(), []);
  f.write(
    "README.md",
    f.page({ sentences: ["One runs. Two runs.", "Three runs."] }),
  );
  assert.match(
    f.frontPage().join("\n"),
    /holds more than one sentence; the next starts at "Two runs\."[\s\S]*: "One runs\. Two runs\."/,
  );
  f.write("README.md", f.page({ sentences: ["One runs", "Two runs."] }));
  assert.match(
    f.frontPage().join("\n"),
    /does not end a sentence;[^:]*: "One runs/,
  );
  f.write("README.md", f.page().replace("<!-- dotln-what-runs:end -->\n", ""));
  assert.match(
    f.frontPage().join("\n"),
    /needs exactly one ordered pair of marker lines/,
  );
  // Prose cannot stand between the heading and the opening marker.
  f.write(
    "README.md",
    f.page({ lead: "A lead sentence above the markers.\n\n" }),
  );
  assert.match(
    f.frontPage().join("\n"),
    /README\.md:9: prose under ## What runs today outside the markers <!-- dotln-what-runs:start --> and <!-- dotln-what-runs:end -->/,
  );
  f.write(
    "README.md",
    f.page().replace("## What runs today", "## Capabilities"),
  );
  assert.match(
    f.frontPage().join("\n"),
    /needs the heading ## What runs today/,
  );
  // A generated block that never closes is a shape failure, not a mask.
  f.write("README.md", f.page().replace("<!-- DOTLN-RELEASE-END -->\n", ""));
  assert.match(
    f.frontPage().join("\n"),
    /a generated block opens and never closes with <!-- DOTLN-RELEASE-END -->/,
  );
  // Receipts: identifiers, dates and versions outside a generated block.
  for (const [closing, label] of [
    ["WO-118 added the loop.", "a work-order identifier"],
    ["See D004 for the rule.", "a decision identifier"],
    ["Recorded on 2026-10-09.", "a date"],
    ["Shipped in v0.2.0.", "a version"],
    ["Shipped in 0.2.0.", "a version number"],
  ]) {
    f.write("README.md", f.page({ closing }));
    assert.match(
      f.frontPage().join("\n"),
      new RegExp(
        `README\\.md:\\d+: "[^"]+" is ${label} outside a generated block`,
      ),
      closing,
    );
  }
  // Without any record nothing about the page is judged.
  const bare = fixture(t);
  bare.write("README.md", "# Page\n\nWO-001 shipped v0.1.0 on 2026-01-01.\n");
  assert.deepEqual(
    bare.check().failures.filter((line) => /^README\.md/.test(line)),
    [],
  );
});

test("What runs today is one range from its heading to the next heading: no sentence escapes the count and the markers cannot leave the heading", (t) => {
  const f = frontPageFixture(t, { declare: true, lineBudget: 3 });
  const twelve = Array.from(
    { length: 12 },
    (_, index) => `Extra capability ${index + 1} runs.`,
  ).join("\n");
  const base = f.page();
  const prose = /prose under ## What runs today outside the markers/g;
  // Sentences below the closing marker, before the next heading, are refused
  // one by one and are not hidden by a blank line or by distance.
  f.write(
    "README.md",
    base.replace(
      "<!-- dotln-what-runs:end -->\n",
      `<!-- dotln-what-runs:end -->\n\n${twelve}\n`,
    ),
  );
  let found = f.frontPage();
  // The twelve lines are one run, reported once with its line range.
  assert.equal(found.join("\n").match(prose).length, 1);
  assert.match(found.join("\n"), /README\.md:14-25: prose under/);
  // A subheading does not close the section, so sentences under it are still
  // the section's sentences.
  f.write(
    "README.md",
    base.replace(
      "<!-- dotln-what-runs:end -->\n",
      `<!-- dotln-what-runs:end -->\n\n### More\n\nAnother capability runs.\n`,
    ),
  );
  found = f.frontPage().join("\n");
  assert.equal(found.match(prose).length, 2, found);
  // The pair moved above the heading leaves the heading's sentences
  // uncounted: the placement is refused, which is the one failure that
  // explains the shape.
  const block = base.slice(
    base.indexOf("<!-- dotln-what-runs:start -->"),
    base.indexOf("<!-- dotln-what-runs:end -->") +
      "<!-- dotln-what-runs:end -->".length,
  );
  f.write(
    "README.md",
    base
      .replace(block, twelve)
      .replace("## What runs today", `${block}\n\n## What runs today`),
  );
  found = f.frontPage().join("\n");
  assert.match(
    found,
    /the marker lines <!-- dotln-what-runs:start --> and <!-- dotln-what-runs:end --> stand under ## What runs today and before the next heading; found them at lines 3 and 6/,
  );
  assert.equal(found.match(prose), null);
  // The closing marker cannot stand under the next heading either.
  f.write(
    "README.md",
    base.replace(
      "<!-- dotln-what-runs:end -->\n\n## Next\n",
      "## Next\n\n<!-- dotln-what-runs:end -->\n",
    ),
  );
  assert.match(
    f.frontPage().join("\n"),
    /stand under ## What runs today and before the next heading/,
  );
  // A second section under the same heading is refused as a shape, not
  // counted as two sections.
  f.write("README.md", base + "\n## What runs today\n\nMore runs.\n");
  assert.match(
    f.frontPage().join("\n"),
    /needs exactly one heading ## What runs today; found 2/,
  );
  // Sentences on one line are counted whatever the next one starts with.
  f.write(
    "README.md",
    f.page({
      sentences: [
        "One runs. " +
          Array.from({ length: 12 }, () => "another runs.").join(" "),
        "Two runs.",
      ],
    }),
  );
  found = f.frontPage().join("\n");
  assert.match(
    found,
    /README\.md:10: a "What runs today" line holds more than one sentence; the next starts at "another runs\.[\s\S]*: "One runs\. another runs\./,
  );
  f.write(
    "README.md",
    f.page({ sentences: ["It runs (see below.) and more runs.", "Two runs."] }),
  );
  assert.match(f.frontPage().join("\n"), /holds more than one sentence/);
  // A terminator inside a word, a code span or a link is not a break.
  f.write(
    "README.md",
    f.page({
      sentences: [
        "The [guide](/docs/product/00-fixture.md) and `x.mjs` run, i.e.: fine.",
        "Two runs.",
      ],
    }),
  );
  assert.deepEqual(f.frontPage(), []);
  // Prose under the heading that closes the section is the page's own, judged
  // by the declaration alone.
  f.write("README.md", f.page({ closing: twelve }));
  assert.deepEqual(f.frontPage(), []);
});

test("What runs today judges rendered sentences across inline Markdown, before and after formatting", async (t) => {
  const f = frontPageFixture(t, { declare: true, lineBudget: 3 });
  const valid = [
    [
      "**One runs.**",
      "_Two runs._",
      "[Three runs.](docs/product/00-fixture.md)",
    ],
    ["~~One runs.~~", "`Two runs.`", "***Three runs.***"],
    ["**One runs.", "Two runs.**", "Three runs."],
    ["**One runs.**  ", "_Two runs._", "Three runs."],
    [
      "One runs&#46;",
      "Two runs\\.",
      "The `x.mjs` and [guide](docs/product/00-fixture.md) run.",
    ],
  ];
  const invalid = [
    "**One runs.** **Two runs.** Three runs.",
    "_One runs._ _Two runs._ Three runs.",
    "~~One runs.~~ ~~Two runs.~~ Three runs.",
    "***One runs.*** __Two runs.__ Three runs.",
    "[One runs.](docs/product/00-fixture.md) [Two runs.](docs/product/00-fixture.md) Three runs.",
    "`One runs.` **Two runs.** Three runs.",
    "One runs&#46; Two runs.",
    "One runs\\. Two runs.",
    "**“One runs.”** _‘Two runs.’_ Three runs.",
  ];
  const check = async (sentences, pattern) => {
    const source = f.page({ sentences });
    for (const text of [
      source,
      await format(source, { parser: "markdown", proseWrap: "preserve" }),
    ]) {
      f.write("README.md", text);
      const found = f.frontPage();
      if (pattern) assert.match(found.join("\n"), pattern, text);
      else assert.deepEqual(found, [], text);
    }
  };
  for (const sentences of valid) await check(sentences);
  for (const line of invalid)
    await check([line, "Another runs."], /holds more than one sentence/);
  await check(["**One runs**", "Another runs."], /does not end a sentence/);
  // Invisible or block content cannot masquerade as counted sentence lines.
  for (const line of [
    "One <em>runs.</em> Two runs.",
    "> **One runs.** Two runs.",
    "### **One runs.** Two runs.",
    "<!-- One runs. --> Two runs.",
  ])
    await check([line, "Another runs."], /must be Markdown prose/);
});

test("What runs today uses rendered heading identity and parsed section boundaries across Markdown spellings", async (t) => {
  const f = frontPageFixture(t, { declare: true });
  const headings = [
    "## **What runs today**",
    "## _What runs today_",
    "## `What runs today`",
    "## [What **runs** today](docs/product/00-fixture.md)",
    "## What runs&#32;today",
    "## What runs today ##",
    "##\tWhat runs today",
    "  ## What runs today",
    "**What runs today**\n-------------------",
  ];
  for (const heading of headings) {
    for (const source of [
      f.page().replace("## What runs today", heading),
      f.page() + `\n${heading}\n\nAnother runs.\n`,
    ]) {
      const duplicate = source.startsWith(f.page());
      for (const text of [
        source,
        await format(source, { parser: "markdown", proseWrap: "preserve" }),
      ]) {
        f.write("README.md", text);
        const found = f.frontPage();
        if (duplicate)
          assert.match(
            found.join("\n"),
            /needs exactly one heading ## What runs today; found 2/,
            text,
          );
        else assert.deepEqual(found, [], text);
      }
    }
  }
  // A lower-level or quoted duplicate does not create an unguarded namesake.
  for (const heading of [
    "# What runs today",
    "### What runs today",
    "> ## What runs today",
  ]) {
    f.write("README.md", f.page() + `\n${heading}\n\nAnother runs.\n`);
    assert.match(
      f.frontPage().join("\n"),
      /needs exactly one heading ## What runs today; found 2/,
    );
  }
  f.write("README.md", f.page().replace("## Next", "Next\n----"));
  assert.deepEqual(f.frontPage(), []);
  f.write(
    "README.md",
    f
      .page()
      .replace(
        "<!-- dotln-what-runs:end -->\n\n## Next",
        "**Next**\n--------\n\n<!-- dotln-what-runs:end -->",
      ),
  );
  assert.match(
    f.frontPage().join("\n"),
    /stand under ## What runs today and before the next heading/,
  );
});

// The guard's two-sided corpus: every row names a page shape and whether the
// guard refuses it. A row is added for each bypass or wrongly refused sentence
// found later, before the check changes, so a fix cannot reopen an earlier
// bypass or start refusing prose that earlier passed. DOTLN_FRONT_PAGE_CORPUS
// names an extra rows file, so a reviewer can try candidate rows through this
// same harness before proposing them.
test("front-page corpus: the What runs today guard refuses every recorded bypass and admits every recorded valid page, before and after formatting", async () => {
  // The page's shape is judged without Git: ownership has its own fixtures.
  const control = {
    schemaVersion: 1,
    page: "README.md",
    generatedBlocks: [
      {
        start: "<!-- DOTLN-RELEASE-BEGIN -->",
        end: "<!-- DOTLN-RELEASE-END -->",
      },
    ],
    whatRunsToday: {
      start: "<!-- dotln-what-runs:start -->",
      end: "<!-- dotln-what-runs:end -->",
      lineBudget: 3,
    },
  };
  const read = (file) => JSON.parse(readFileSync(file, "utf8")).rows;
  const rows = [
    ...read(new URL("./fixtures/front-page-corpus.json", import.meta.url)),
    ...(process.env.DOTLN_FRONT_PAGE_CORPUS
      ? read(process.env.DOTLN_FRONT_PAGE_CORPUS)
      : []),
  ];
  const shapes = ["line", "replace", "section", "append"];
  const keys = new Set([
    ...shapes,
    ...["name", "expect", "pattern", "source", "reason", "formatted"],
    ...["limit", "class", "note"],
  ]);
  const twelve = Array.from(
    { length: 12 },
    (_, index) => `Extra capability ${index + 1} runs.`,
  ).join("\n");
  const names = new Set();
  const pageOf = (row) => {
    let text = frontPageText({
      sentences: row.line === undefined ? undefined : [row.line, "Two run."],
    });
    if (row.replace) {
      assert.ok(text.includes(row.replace[0]), `${row.name}: replace target`);
      text = text.replace(row.replace[0], () => row.replace[1]);
    }
    if (row.section !== undefined) text += `\n${row.section}\n\n${twelve}\n`;
    if (row.append !== undefined) text += `\n${row.append}\n`;
    return text;
  };
  const wrong = [];
  for (const row of rows) {
    assert.ok(["refuse", "admit"].includes(row.expect), row.name);
    assert.ok(!names.has(row.name), `duplicate row name ${row.name}`);
    names.add(row.name);
    assert.deepEqual(
      Object.keys(row).filter((key) => !keys.has(key)),
      [],
      `${row.name}: unknown keys`,
    );
    assert.ok(
      shapes.some((key) => key in row),
      `${row.name}: no page shape`,
    );
    const source = pageOf(row);
    for (const text of row.formatted === false
      ? [source]
      : [
          source,
          await format(source, { parser: "markdown", proseWrap: "preserve" }),
        ]) {
      const found = frontPageShapeFindings(
        text,
        control,
        "README.md",
      ).failures.join("\n");
      const held =
        row.expect === "admit"
          ? found === ""
          : found !== "" && (!row.pattern || found.includes(row.pattern));
      if (!held)
        wrong.push(
          `${row.expect} ${JSON.stringify(row.name)}${text === source ? "" : " after formatting"}${row.pattern ? ` (pattern ${JSON.stringify(row.pattern)})` : ""}: ${found || "no failure"}`,
        );
    }
  }
  assert.deepEqual(wrong, []);
});

test("a counted line or heading is judged only from inline node types whose rendered text the check knows; a type a later parser adds is refused", () => {
  assert.deepEqual(
    proseText({
      type: "paragraph",
      children: [
        { type: "text", value: "Shown runs. " },
        { type: "futureNode", value: "Hidden runs." },
      ],
    }),
    { refused: "futureNode" },
  );
  assert.deepEqual(
    proseText({
      type: "heading",
      children: [
        { type: "emphasis", children: [{ type: "text", value: "Shown" }] },
        { type: "inlineCode", value: " runs" },
      ],
    }),
    { text: "Shown runs" },
  );
});

test("the page GitHub shows is the record's page, read through main's configuration and the order's header on main", (t) => {
  // Another README GitHub may show in its place is refused; a .github file
  // that is not a directory is not a README location and breaks nothing.
  const other = frontPageFixture(t, { declare: false });
  other.write(".github/README.md", "# Another page\n");
  assert.match(
    frontPageFindings(other.root).failures.join("\n"),
    /\.github\/README\.md: GitHub may show this README in place of README\.md/,
  );
  rmSync(join(other.root, ".github"), { recursive: true });
  other.write(".github", "not a directory\n");
  other.write("README", "Another page.\n");
  assert.match(
    frontPageFindings(other.root).failures.join("\n"),
    /^README: GitHub may show this README in place of README\.md/m,
  );
  // The page itself is a regular file, not a link to one.
  const linked = frontPageFixture(t, { declare: true });
  linked.write("docs/page-copy.md", linked.page());
  rmSync(join(linked.root, "README.md"));
  symlinkSync(
    join(linked.root, "docs/page-copy.md"),
    join(linked.root, "README.md"),
  );
  assert.match(
    linked.frontPage().join("\n"),
    /README\.md: the front page must be a regular file/,
  );
  // Moving the control root in the configuration on a branch moves nothing:
  // the record is read where main's configuration puts it.
  const moved = frontPageFixture(t, { declare: false });
  const config = JSON.parse(
    readFileSync(join(moved.root, "dotln.config.json"), "utf8"),
  );
  moved.write(
    "dotln.config.json",
    JSON.stringify({
      ...config,
      roots: { ...config.roots, control: "docs/elsewhere" },
    }),
  );
  moved.write("README.md", moved.page({ closing: "An appended sentence." }));
  assert.match(
    moved.frontPage().join("\n"),
    /README\.md: changed outside its generated blocks/,
  );
  // A malformed field on main refuses the change instead of breaking the check.
  const malformed = frontPageFixture(t, { declare: false });
  malformed.git("checkout", "-q", "main");
  malformed.write(
    "docs/work-orders/WO-999-fixture.md",
    malformed.order("**Front page:** README.md (the map only)"),
  );
  malformed.git(
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qam",
    "malformed field",
  );
  malformed.git("checkout", "-q", "wo-999");
  malformed.git("merge", "-q", "main");
  malformed.write(
    "README.md",
    malformed.page({ closing: "An appended sentence." }),
  );
  assert.match(
    malformed.frontPage().join("\n"),
    /field cannot be read: work order has a malformed \*\*Front page:\*\* line/,
  );
  // A generated block the record lists stands on the page.
  const missing = frontPageFixture(t, { declare: true });
  missing.write(
    "README.md",
    missing
      .page()
      .replace(
        /<!-- DOTLN-RELEASE-BEGIN -->[\s\S]*<!-- DOTLN-RELEASE-END -->\n/,
        "",
      ),
  );
  assert.match(
    missing.frontPage().join("\n"),
    /the generated block <!-- DOTLN-RELEASE-BEGIN --> listed in docs\/control\/front-page\.json at the merge base is not on the page/,
  );
});

test("main's record decides the page, the section and its budget: a front-page order cannot move the guard or slip a generated block under the section", (t) => {
  const path = "docs/control/front-page.json";
  // Moving the page to another file is refused, and the page is still judged.
  const moved = frontPageFixture(t, { declare: true });
  moved.write(path, JSON.stringify({ ...moved.record, page: "docs/front.md" }));
  moved.write("docs/front.md", moved.page());
  moved.write(
    "README.md",
    moved.page({
      sentences: ["One runs.", "Two runs.", "Three runs.", "Four runs."],
    }),
  );
  const found = frontPageFindings(moved.root).failures.join("\n");
  assert.match(
    found,
    /moves the front page from README\.md to docs\/front\.md/,
  );
  assert.match(found, /README\.md: "What runs today" holds 4 counted lines/);
  // A generated block the order adds may stand elsewhere, not under the section.
  const added = frontPageFixture(t, { declare: true });
  const block = {
    start: "<!-- capabilities:start -->",
    end: "<!-- capabilities:end -->",
  };
  added.write(
    path,
    JSON.stringify({
      ...added.record,
      generatedBlocks: [...added.record.generatedBlocks, block],
    }),
  );
  const thirteen = Array.from(
    { length: 13 },
    (_, index) => `Hidden ${index + 1} runs.`,
  ).join(" ");
  added.write(
    "README.md",
    added
      .page()
      .replace(
        "<!-- dotln-what-runs:end -->\n",
        `<!-- dotln-what-runs:end -->\n\n${block.start}\n${thirteen}\n${block.end}\n`,
      ),
  );
  assert.match(
    added.frontPage().join("\n"),
    /<!-- capabilities:start --> is a generated block main's record does not list/,
  );
  added.write(
    "README.md",
    added.page({
      closing: `A closing paragraph.\n\n${block.start}\nGenerated text.\n${block.end}`,
    }),
  );
  assert.deepEqual(added.frontPage(), []);
});

test("a page whose base carries no markers is being brought under guard: shape and budget are judged, the change is not compared", (t) => {
  const installing = frontPageFixture(t, {
    declare: false,
    basePage: "# Page\n\nAn older page with no markers at all.\n",
  });
  // The page on main lacks the markers, but this branch does not change
  // it: the finding is main's, reported as a notice, not refused here.
  assert.deepEqual(installing.frontPage(), []);
  assert.match(
    frontPageFindings(installing.root).notices.join("\n"),
    /needs exactly one ordered pair of marker lines.*\(on main; this branch does not change the page\)/,
  );
  installing.write(
    "README.md",
    installing.page({ closing: "Rewritten without a declaration." }),
  );
  assert.deepEqual(installing.frontPage(), []);
  // Without a merge base with main only the shape is judged, with a notice.
  const trunk = frontPageFixture(t, { declare: false, baseBranch: "trunk" });
  trunk.write("README.md", trunk.page({ closing: "An appended sentence." }));
  const result = trunk.check();
  assert.deepEqual(
    result.failures.filter((line) => /^README\.md/.test(line)),
    [],
  );
  assert.match(
    result.notices.join("\n"),
    /README\.md: no merge base with main; the front-page change is not compared/,
  );
});

test("the leading header's Front page field is read as typed data, never from criteria prose", () => {
  const header = (field) =>
    `# WO-999 — Fixture\n\n**Track:** machinery\n${field}\n**Objective:** Fixture README.md prose.\n\n**Acceptance criteria (all required)**\n\n1. README.md is rewritten.\n`;
  assert.equal(frontPageDeclaration(header(""), "wo"), null);
  assert.deepEqual(
    frontPageDeclaration(header("**Front page:** README.md"), "wo"),
    ["README.md"],
  );
  assert.deepEqual(
    frontPageDeclaration(
      header("**Front page:** README.md, docs/README.md"),
      "wo",
    ),
    ["README.md", "docs/README.md"],
  );
  assert.throws(
    () =>
      frontPageDeclaration(
        header("**Front page:** README.md\n**Front page:** README.md"),
        "wo",
      ),
    /duplicate/,
  );
  assert.throws(
    () => frontPageDeclaration(header("**Front page:**"), "wo"),
    /malformed/,
  );
  assert.throws(
    () => frontPageDeclaration(header("**Front page:** ../x.md"), "wo"),
    /malformed/,
  );
  // A field below the Objective is body text, not metadata.
  assert.equal(
    frontPageDeclaration(
      header("").replace("prose.\n", "prose.\n\n**Front page:** README.md\n"),
      "wo",
    ),
    null,
  );
});

test("the refusal is new: the document check at 08845c71 admits the same undeclared change", async (t) => {
  const historical = "08845c71";
  const repository = resolve(import.meta.dirname, "..");
  const present = spawnGit([
    "-C",
    repository,
    "cat-file",
    "-e",
    `${historical}^{commit}`,
  ]);
  if (present.status !== 0) {
    t.skip(`commit ${historical} is not in this clone`);
    return;
  }
  const f = frontPageFixture(t, { declare: false });
  f.write("README.md", f.page({ closing: "An appended sentence." }));
  assert.match(
    f.frontPage().join("\n"),
    /changed outside its generated blocks/,
  );
  // The historical scripts tree runs beside this checkout's installed
  // dependencies; nothing in this repository is written.
  const extracted = createFixtureRoot(
    join(tmpdir(), "dotln-docs-check-historical-"),
  );
  t.after(() => rmSync(extracted, { recursive: true, force: true }));
  const archive = join(extracted, "historical.tar");
  const archived = spawnGit(
    [
      "-C",
      repository,
      "archive",
      "--format=tar",
      "-o",
      archive,
      historical,
      "scripts",
      "packages/skeleton/src",
    ],
    { encoding: "utf8" },
  );
  assert.equal(archived.status, 0, archived.stderr);
  const untar = spawnSync("tar", ["-xf", archive, "-C", extracted], {
    encoding: "utf8",
  });
  assert.equal(untar.status, 0, untar.stderr);
  symlinkSync(
    join(repository, "node_modules"),
    join(extracted, "node_modules"),
  );
  const old = await import(
    pathToFileURL(join(extracted, "scripts/docs-check.mjs")).href
  );
  // The historical check still took the retired ceiling record.
  const before = old.checkDocs(f.root, {
    ceilings: {
      schemaVersion: 1,
      documents: {
        "00-fixture.md": {
          ceiling: 10000,
          nonExemptBytesAtLanding: 10000,
          date: "2026-09-26",
          decision: "fixture",
        },
      },
    },
    baseline: f.baseline,
  });
  assert.deepEqual(
    before.failures.filter((line) => /README\.md: /.test(line)),
    [],
    "the historical check judged nothing about the front page",
  );
});

test("public Shared and explicit scratchpad templates contain no private account; concrete homes and session paths still refuse", (t) => {
  const f = fixture(t),
    file = "docs/evidence/WO-999/templates.md";
  f.write(
    file,
    [
      "/Users/Shared/public/example.txt",
      "/tmp/claude-<uid>/<project key>/<session id>/scratchpad",
      "/private/tmp/claude-<uid>/<project key>/<session id>/scratchpad/notes.md",
    ].join("\n") + "\n",
  );
  assert.deepEqual(
    homePathFindings(f.root).filter((row) => row.file === file),
    [],
  );
  const record = "docs/evidence/WO-999/shared.json";
  f.write(
    record,
    JSON.stringify({ output: "line\n/Users/Shared/public/example.txt" }) + "\n",
  );
  assert.deepEqual(homePathFindings(f.root, [record]), []);
  for (const source of [
    "/home/runner/work/private-project",
    "/Users/SharedPrivate/note.txt",
    "/tmp/claude-501/project/session/scratchpad",
    "/Users/Shared/../private-user/note.txt",
    "/tmp/claude-<uid>/<project key>/<session id>/scratchpad/../private.txt",
  ]) {
    f.write(file, source + "\n");
    assert.equal(
      homePathFindings(f.root).filter((row) => row.file === file).length,
      1,
      source,
    );
  }
});

test("home-path baseline maintenance reports stale entries, shrinks only existing fingerprints and refuses laundering a new line", (t) => {
  for (const roots of [
    {},
    { docs: "manual", control: "state", evidence: "proof" },
  ]) {
    const f = fixture(t, roots),
      evidence = roots.evidence ?? `${roots.docs ?? "docs"}/evidence`,
      control = roots.control ?? `${roots.docs ?? "docs"}/control`;
    const file = `${evidence}/WO-999/README.md`,
      baselineFile = `${control}/doc-baseline.json`;
    const first = "Ran in /Users/fixture-user/one.\n",
      second = "Ran in /Users/fixture-user/two.\n";
    f.write(file, first + second);
    f.baseline.homePaths = {
      [file]: homePathFindings(f.root)
        .filter((row) => row.file === file)
        .map((row) => row.fingerprint),
    };
    const retainedFingerprint = f.baseline.homePaths[file][0];
    f.baseline.operatorWords = {
      "docs/evidence/WO-999/decisions.md#WO-999-D001": "a".repeat(64),
    };
    const operatorWords = structuredClone(f.baseline.operatorWords);
    f.write(file, first);
    f.controls();
    assert.match(
      f.check().notices.join("\n"),
      /STALE .*no longer holds 1 baselined private-path line.*--write-home-path-baseline/u,
    );
    const result = shrinkHomePathBaseline(f.root);
    assert.equal(result.removed, 1);
    let baseline = JSON.parse(readFileSync(join(f.root, baselineFile), "utf8"));
    assert.deepEqual(baseline.homePaths, { [file]: [retainedFingerprint] });
    assert.deepEqual(
      baseline.operatorWords,
      operatorWords,
      "operator-word keys and fingerprints are not rewritten",
    );
    const before = readFileSync(join(f.root, baselineFile));
    f.write(file, first + "New /Users/fixture-other/secret.\n");
    assert.throws(
      () => shrinkHomePathBaseline(f.root),
      /new private-path line is fixed, never baselined/u,
    );
    assert.deepEqual(readFileSync(join(f.root, baselineFile)), before);
    f.write(file, "Use <home>/ or /Users/Shared/public.\n");
    const cli = spawnSync(
      process.execPath,
      [script, "--write-home-path-baseline"],
      {
        cwd: f.root,
        env: { ...process.env, DOTLN_LAUNCHPAD: f.root },
        encoding: "utf8",
      },
    );
    assert.equal(cli.status, 0, cli.stdout + cli.stderr);
    assert.match(cli.stdout, /removed 1 stale fingerprint/u);
    baseline = JSON.parse(readFileSync(join(f.root, baselineFile), "utf8"));
    assert.deepEqual(baseline.homePaths, {});
    assert.deepEqual(baseline.operatorWords, operatorWords);
    assert.doesNotMatch(cli.stdout + cli.stderr, /fixture-user|fixture-other/u);
  }
});

test("WO-257 the front page is a default entry point that may link a record, and a `How to start: <path>.` line in the instruction file counts as a link", (t) => {
  // No documents.json: the kit defaults apply, the front page among them.
  const f = fixture(t);
  const decision = f.record("resume: next").path;
  f.write(
    "CLAUDE.md",
    "# Contract\n\n## Start here\n\nHow to start: README.md.\n",
  );
  f.write(
    "README.md",
    `# Fixture\n\nRead [the guide](docs/guide.md), [the thesis](docs/product/00-fixture.md) and [a decision](${decision}#wo-999-d001).\n`,
  );
  f.write("docs/guide.md", "# Guide\n\n[next](linked.md)\n");
  f.write("docs/linked.md", "# Linked\n");
  const report = documentReport(f.root);
  assert.deepEqual(
    report.names.find((row) => row.entryPoint === "instruction-start-here")
      .names,
    ["README.md"],
    "the How to start line names the front page",
  );
  assert.deepEqual(
    report.names.find((row) => row.entryPoint === "front-page").names,
    [decision, "docs/guide.md", "docs/product/00-fixture.md"].sort(),
  );
  // The front page links what it likes: its record link is admitted.
  assert.deepEqual(report.recordsNamed, []);
  for (const path of ["README.md", "docs/guide.md", "docs/linked.md"])
    assert.equal(report.bindings.get(path).bound, true, path);
  assert.deepEqual(report.bindings.get("README.md").entryPoints, [
    "front-page",
    "instruction-start-here",
  ]);
  assert.deepEqual(report.unbound, []);
  assert.deepEqual(
    documentRows(f.root, { report, census: { documents: {} } }).filter(
      (row) => row.kind === "record-named",
    ),
    [],
  );
  assert.deepEqual(
    f.check().failures.filter((line) => /names the record/u.test(line)),
    [],
  );
  // The same record link from the instruction file's Start here still fails
  // naming the record: the four session entry points stay standing-only.
  f.write(
    "CLAUDE.md",
    `# Contract\n\n## Start here\n\nHow to start: README.md. Read [a decision](${decision}#wo-999-d001).\n`,
  );
  assert.match(
    f.check().failures.join("\n"),
    /CLAUDE\.md: entry point instruction-start-here names the record docs\/evidence\/WO-999\/decisions\.md; an entry point names standing documents only/u,
  );
  // A declared documents.json replaces the defaults, so an instance that
  // declares the front page under the kit's id keeps the admission.
  f.write(
    "docs/control/documents.json",
    JSON.stringify({
      schemaVersion: 1,
      entryPoints: [
        { id: "front-page", files: ["README.md"], heading: "Fixture" },
      ],
      kinds: [],
    }),
  );
  f.write(
    "CLAUDE.md",
    "# Contract\n\n## Start here\n\nHow to start: README.md.\n",
  );
  assert.deepEqual(documentReport(f.root).recordsNamed, []);
});
