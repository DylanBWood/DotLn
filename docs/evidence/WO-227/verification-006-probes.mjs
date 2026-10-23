// Independent VER-006 probes of the private line-range repair; all lists,
// paths and terms are synthetic. Run from the repository root under
// scripts/harness.mjs bounded. Exit 1 when a judged case fails.
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.argv[2] ?? process.cwd());
const load = (name) => import(pathToFileURL(join(root, name)).href);
const { checkOutwardArtifact } = await load("scripts/outward-lint.mjs");
const { composeTargetBody } = await load("scripts/lib/github-body.mjs");
const { lintArtifacts } = await load("scripts/lib/target-publish.mjs");
const { digestOf } = await load("scripts/lib/confirm-terms.mjs");
const scratch = mkdtempSync(join(tmpdir(), "wo227-ver006-"));
const observations = [];
const write = (name, text) => {
  const file = join(scratch, name);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
};
const capture = (fn) => {
  try {
    return { returned: fn() };
  } catch (error) {
    return { error: error.message };
  }
};
const setup = (reviewTerms, terms) => {
  write(
    "docs/control/outward-vocabulary.json",
    JSON.stringify({ types: ["fix"], reviewTerms }),
  );
  write("docs/control/local/terms.txt", terms);
};
const body = (files, baseTree, prose = "# Result\n\nThe board changes.\n") => ({
  kind: "pr-body",
  ...composeTargetBody({
    body: prose,
    baseCommit: "a".repeat(40),
    headCommit: "b".repeat(40),
    files,
    baseTree: new Set(baseTree),
  }),
});
const leaks = (value, needles) =>
  needles.filter((needle) => JSON.stringify(value).includes(needle));
const refusesLocally = (outcome, needles) =>
  /vocabulary\.local: refuse/u.test(outcome.error ?? "") &&
  !leaks(outcome, needles).length;

try {
  write("dotln.config.json", JSON.stringify({ version: 1 }));
  const one = { added: 1, deleted: 0 };

  // R1: the table header's last word joins the first, base-held row.
  {
    const artifact = body([{ path: "a.txt", ...one }], ["a.txt"]);
    setup([], "refuse: removed a txt\n");
    const crossing = capture(() => lintArtifacts(scratch, [artifact]));
    setup([], "refuse: a txt\n");
    const control = capture(() => lintArtifacts(scratch, [artifact]));
    observations.push({
      name: "R1 header-to-existing-row private match refuses; row-only control stays exempt",
      meets:
        refusesLocally(crossing, ["a.txt", "removed"]) &&
        control.returned?.review === null,
      crossing,
      control,
    });
  }

  // R2: an existing last row's count joins the generated summary line.
  {
    const artifact = body([{ path: "a.txt", ...one }], ["a.txt"]);
    setup([], "refuse: 0 1 file\n");
    const crossing = capture(() => lintArtifacts(scratch, [artifact]));
    observations.push({
      name: "R2 existing-row-to-summary private match refuses",
      meets: refusesLocally(crossing, ["a.txt"]),
      crossing,
    });
  }

  // R3: a match joining two rows the base both held. Main reported every
  // match in the composed body; the order exempts a base-held path, not a
  // join across two of them. Recorded as an observation, not judged.
  {
    const artifact = body(
      [
        { path: "a.txt", ...one },
        { path: "day.md", ...one },
      ],
      ["a.txt", "day.md"],
    );
    setup([], "refuse: 0day\n");
    observations.push({
      name: "R3 observation: a join across two base-held rows is reported",
      meets: null,
      outcome: capture(() => lintArtifacts(scratch, [artifact])),
    });
  }

  // R4: a three-row review match whose middle, added row carries a public
  // word or an identifier. Every contributing row stays redacted.
  for (const [middle, extra] of [
    ["launchpad-mid.md", "launchpad"],
    ["WO-006-mid.md", "wo 006"],
  ]) {
    const artifact = body(
      [
        { path: "one.md", ...one },
        { path: middle, ...one },
        { path: "end.md", ...one },
      ],
      [],
    );
    setup(["launchpad"], `0 ${extra} mid md 1 0 end\n`);
    const needles = ["one.md", middle, "end.md", "WO-006", "wo-006", "mid"];
    const without = capture(() => lintArtifacts(scratch, [artifact]));
    const preview = capture(() =>
      lintArtifacts(scratch, [artifact], { preview: true }),
    );
    const confirmed = capture(() =>
      lintArtifacts(scratch, [artifact], {
        confirmTerms: digestOf(artifact.text),
      }),
    );
    const identifier = middle.startsWith("WO-");
    observations.push({
      name: `R4 three-row review match with ${identifier ? "an identifier" : "a public word"} on the middle row`,
      meets: identifier
        ? /identifier\.launchpad: \[redacted\]/u.test(confirmed.error ?? "") &&
          !leaks([without, confirmed], needles).length
        : /2 review items wait/u.test(without.error ?? "") &&
          preview.returned?.pending?.items?.length === 2 &&
          confirmed.returned?.review?.matches === 2 &&
          !leaks([without, preview], needles).length,
      without,
      preview,
      confirmed,
    });
  }

  // R5: lone CR and CRLF prose before the table keep the private range on
  // the rows the composed text holds.
  for (const [label, prose] of [
    ["lone CR", "# Result\r\rThe board\rchanges.\r"],
    ["CRLF", "# Result\r\n\r\nThe board\r\nchanges.\r\n"],
  ]) {
    const artifact = body(
      [
        { path: "a.txt", ...one },
        { path: "day.md", ...one },
      ],
      ["a.txt"],
      prose,
    );
    setup([], "refuse: a txt\n");
    const exempt = capture(() => lintArtifacts(scratch, [artifact]));
    setup([], "refuse: 0day\n");
    const crossing = capture(() => lintArtifacts(scratch, [artifact]));
    observations.push({
      name: `R5 ${label} prose: existing-row match exempt, crossing match refuses`,
      meets:
        exempt.returned?.review === null &&
        refusesLocally(crossing, ["a.txt", "day.md"]),
      exempt,
      crossing,
    });
  }

  // R6: a release body's two-line private match spans both whole lines and
  // never prints the term.
  {
    const text = "## Overview\n\nThe cobalt\nwidget ships.\n\nClosed.\n";
    setup([], "refuse: cobalt widget\n");
    const result = checkOutwardArtifact(scratch, {
      kind: "release-body",
      text,
      target: true,
    });
    const [finding] = result.findings;
    observations.push({
      name: "R6 release-body two-line private match spans both lines",
      meets:
        result.status === "refused" &&
        result.findings.length === 1 &&
        text.slice(finding.span.start, finding.span.end) ===
          "The cobalt\nwidget ships." &&
        !leaks(result, ["cobalt", "widget"]).length,
      result,
    });
  }

  // R7: an exempt single-row refuse match and a crossing review match that
  // share their starting line: only the review item remains.
  {
    const artifact = body(
      [
        { path: "a.txt", ...one },
        { path: "day.md", ...one },
      ],
      ["a.txt"],
    );
    setup([], "refuse: a txt\nreview: 0day\n");
    const without = capture(() => lintArtifacts(scratch, [artifact]));
    const confirmed = capture(() =>
      lintArtifacts(scratch, [artifact], {
        confirmTerms: digestOf(artifact.text),
      }),
    );
    observations.push({
      name: "R7 exempt refuse match and crossing review match sharing a start",
      meets:
        /1 review item waits/u.test(without.error ?? "") &&
        /vocabulary\.local: review/u.test(without.error ?? "") &&
        confirmed.returned?.review?.matches === 1 &&
        !leaks(without, ["a.txt", "day.md"]).length,
      without,
      confirmed,
    });
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

console.log(JSON.stringify({ observations }, null, 2));
if (observations.some((observation) => observation.meets === false))
  process.exitCode = 1;
