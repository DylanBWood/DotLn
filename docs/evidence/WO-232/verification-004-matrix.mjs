// VER-004 probe: criterion 3 over every amendment representation this probe
// can construct. It enumerates line endings, filed-title states, an existing
// execution record, the bound change, the binding writer (current, activation
// base, or the pre-v0.51.0 placeholder form) and the later change, then
// compares the activation-base reader with the subject at the matcher. Where
// the local VER-003 checkpoint ref resolves, it also compares that subject's
// reader and writer. Exits 1 on a disagreement with the expected outcome, a
// regression from either earlier reader, or a changed writer output. Writes
// only to system temp.
import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "../../../scripts/lib/plan-subject.mjs";
import * as subject from "../../../scripts/lib/plan-continuation.mjs";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const baseline = "a81561976c8629834a5a18623b097fa4d7d8681a";
const previous = "refs/dotln/checkpoint/WO-232/11";
const git = (...args) =>
  execFileSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-wo232-ver004-matrix-")),
);
const impl = { subject };
try {
  cpSync(join(root, "scripts"), join(scratch, "scripts"), {
    recursive: true,
    filter: (path) => !path.includes("/fixtures/instance-with-history/"),
  });
  for (const name of ["packages", "node_modules", "package.json"])
    symlinkSync(join(root, name), join(scratch, name));
  const load = async (name, revision) => {
    const file = join(scratch, `scripts/lib/plan-continuation.${name}.mjs`);
    writeFileSync(
      file,
      git("show", `${revision}:scripts/lib/plan-continuation.mjs`),
    );
    impl[name] = await import(file);
  };
  await load("base", baseline);
  try {
    git("rev-parse", "--verify", "--quiet", `${previous}^{commit}`);
    await load("previous", previous);
  } catch {
    // The checkpoint ref is local recovery state; the base comparison stands alone.
  }
} catch (error) {
  rmSync(scratch, { recursive: true, force: true });
  throw error;
}

const raw = readFileSync(
  join(
    root,
    "docs/work-orders/WO-231-final-review-lint-from-the-described-base.md",
  ),
  "utf8",
);
const plainTitle = raw.match(/^# [^\n]+/u)[0].replace(/ \(v0\.97\.1\)$/u, "");
const body = raw.replace(/^# [^\n]+/u, plainTitle);
const titleStates = {
  unlabelled: (t) => t,
  placeholder: (t) =>
    t.replace(plainTitle, `${plainTitle} (version assigned at activation)`),
  labelled: (t) => t.replace(plainTitle, `${plainTitle} (v1.2.0)`),
};
const label = (t, v) =>
  t.replace(
    /^# [^\r\n]+/u,
    (title) =>
      title
        .replace(/ \(version assigned at activation\)$/u, "")
        .replace(/ \(v\d+\.\d+\.\d+\)$/u, "") + ` (${v})`,
  );
const field = (t, nl, id = "WS-001", before = "**Track:**") =>
  t.replace(before, `**Workstream:** ${id}${nl}${before}`);
const edit = {
  boundCriterion: (t) =>
    t.replace(
      "1. In the target-worktree start fixture",
      "1. In the amended target-worktree start fixture",
    ),
  criterion: (t) =>
    t.replace(
      "2. The two existing cases stand without edits",
      "2. The two existing cases stand with edits",
    ),
  objective: (t) =>
    t.replace(
      "**Objective:** When a registered",
      "**Objective:** Whenever a registered",
    ),
  dependency: (t) =>
    t.replace(
      `"the outward lint's commit rules`,
      `"the changed outward lint's commit rules`,
    ),
  cost: (t) =>
    t.replace(
      "**Cost:** adds one small module",
      "**Cost:** adds two small modules",
    ),
};
const record = (t, nl, text = "Later evidence.") =>
  t.trimEnd() + `\n\n## Execution record${nl}${nl}${text}${nl}`;
const writers = {
  current: (amended, filed) =>
    impl.subject.executionAmendmentSource(amended, filed),
  base: (amended, filed) => impl.base.executionAmendmentSource(amended, filed),
  // The pre-v0.51.0 writer bound the placeholder form without the filed source.
  placeholder: (amended) => impl.base.executionAmendmentSource(amended),
};
const bounds = {
  activationOnly: (t) => t,
  criterion: (t) => edit.boundCriterion(t),
  fieldOnly: (t, nl) => field(t, nl),
  fieldAndCriterion: (t, nl) => field(edit.boundCriterion(t), nl),
};

const rows = [];
let writerChecks = 0;
const writerDiffs = [];
for (const nl of ["\n", "\r\n"])
  for (const [titleName, titleOf] of Object.entries(titleStates))
    for (const existingRecord of [false, true]) {
      let filed = titleOf(body);
      if (existingRecord) filed = record(filed, "\n", "Filed evidence.");
      filed = filed.replaceAll("\r\n", "\n").replaceAll("\n", nl);
      for (const [boundName, boundOf] of Object.entries(bounds))
        for (const [writerName, write] of Object.entries(writers)) {
          const amended = label(boundOf(filed, nl), "v1.2.3");
          const bound = write(amended, filed);
          const sourceOrderHash = sha256(
            impl.subject.executionAmendmentSource(filed),
          );
          if (
            sourceOrderHash !==
            sha256(impl.base.executionAmendmentSource(filed))
          )
            throw new Error("the filed source hash representation differs");
          // amend-order refuses an amendment equal to the filed source.
          if (sha256(bound) === sourceOrderHash) continue;
          const row = {
            sourceOrderHash,
            orderHash: sha256(bound),
            orderLength: bound.length,
          };
          const boundHasField = /\*\*Workstream:\*\*/u.test(bound);
          const withField = (t) => field(t, nl);
          const changes = {
            asIs: [amended, true],
            retimed: [label(amended, "v1.2.4"), true],
            laterRecord: [record(amended, nl), true],
            criterionOnly: [edit.criterion(amended), false],
          };
          if (!/\*\*Workstream:\*\*/u.test(amended))
            Object.assign(changes, {
              field: [withField(amended), true],
              fieldFirst: [field(amended, nl, "WS-001", "**Model:**"), true],
              fieldRetimedRecord: [
                record(label(withField(amended), "v1.2.4"), nl),
                true,
              ],
              fieldCriterion: [edit.criterion(withField(amended)), false],
              fieldObjective: [edit.objective(withField(amended)), false],
              fieldDependency: [edit.dependency(withField(amended)), false],
              fieldCost: [edit.cost(withField(amended)), false],
              fieldTwice: [field(withField(amended), nl, "WS-002"), false],
              fieldWS1: [field(amended, nl, "WS-1"), false],
              fieldWS0001: [field(amended, nl, "WS-0001"), false],
              fieldTrailingSpace: [field(amended, nl, "WS-001 "), false],
              fieldTab: [field(amended, nl, "WS-001\t"), false],
              fieldDoubleSpace: [
                amended.replace(
                  "**Track:**",
                  `**Workstream:**  WS-001${nl}**Track:**`,
                ),
                false,
              ],
              fieldLowercase: [
                amended.replace(
                  "**Track:**",
                  `**workstream:** WS-001${nl}**Track:**`,
                ),
                false,
              ],
              fieldSuffix: [field(amended, nl, "WS-001x"), false],
              fieldAndBlankLineBeforeObjective: [
                amended.replace(
                  "**Objective:**",
                  `**Workstream:** WS-001${nl}${nl}**Objective:**`,
                ),
                false,
              ],
              fieldAmongCriteria: [
                amended.replace(
                  "\n2. The two existing cases",
                  `\n**Workstream:** WS-001${nl}2. The two existing cases`,
                ),
                false,
              ],
              fieldWithoutLineEnd: [
                amended.replace(
                  "**Track:**",
                  "**Workstream:** WS-001**Track:**",
                ),
                false,
              ],
            });
          else
            // A field the writer normalized away is unbound grouping; a field
            // inside the bound bytes stays bound.
            Object.assign(changes, {
              fieldChanged: [
                amended.replace("WS-001", "WS-002"),
                !boundHasField,
              ],
              fieldRemoved: [
                amended.replace(/\*\*Workstream:\*\* WS-001\r?\n/u, ""),
                !boundHasField,
              ],
              fieldMoved: [
                amended
                  .replace(/\*\*Workstream:\*\* WS-001\r?\n/u, "")
                  .replace(
                    "**Model:**",
                    `**Workstream:** WS-001${nl}**Model:**`,
                  ),
                !boundHasField,
              ],
            });
          for (const [change, [after, expected]] of Object.entries(changes)) {
            if (after === amended && change !== "asIs")
              throw new Error(`edit ${change} changed nothing`);
            if (impl.previous)
              for (const filedArg of [filed, undefined, amended]) {
                writerChecks++;
                if (
                  impl.subject.executionAmendmentSource(after, filedArg) !==
                  impl.previous.executionAmendmentSource(after, filedArg)
                )
                  writerDiffs.push(change);
              }
            rows.push({
              nl: nl === "\n" ? "LF" : "CRLF",
              title: titleName,
              existingRecord,
              bound: boundName,
              writer: writerName,
              change,
              expected,
              ...Object.fromEntries(
                Object.entries(impl).map(([name, m]) => [
                  name,
                  m.matchesExecutionAmendment(filed, after, row),
                ]),
              ),
            });
          }
        }
    }
rmSync(scratch, { recursive: true, force: true });

const key = (r) =>
  [r.nl, r.title, r.existingRecord, r.bound, r.writer].join("|");
// A binding is live when some reader admits the order exactly as bound.
const live = new Set(
  rows.filter((r) => r.change === "asIs" && (r.base || r.subject)).map(key),
);
const judged = rows.filter((r) => live.has(key(r)));
const wrong = judged.filter((r) => r.subject !== r.expected);
const regressions = judged.filter(
  (r) => (r.base && !r.subject) || (r.previous && !r.subject),
);
const summary = {
  baseline,
  previous: impl.previous ? previous : "unavailable",
  rows: rows.length,
  liveBindings: live.size,
  judgedRows: judged.length,
  expectedAdmissions: judged.filter((r) => r.expected).length,
  subjectAdmissions: judged.filter((r) => r.subject).length,
  disagreements: wrong.length,
  regressions: regressions.length,
  widenedOverBase: judged.filter((r) => r.subject && !r.base).length,
  widenedOverPrevious: impl.previous
    ? judged
        .filter((r) => r.subject && !r.previous)
        .map((r) => `${key(r)}|${r.change}`)
    : "unavailable",
  writerChecks,
  writerDiffs: writerDiffs.length,
  deadBindings: rows
    .filter((r) => r.change === "asIs" && !live.has(key(r)))
    .map(key),
};
console.log(JSON.stringify({ summary, wrong, regressions }, null, 2));
process.exitCode =
  wrong.length || regressions.length || writerDiffs.length ? 1 : 0;
