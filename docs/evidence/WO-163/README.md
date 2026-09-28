# WO-163 implementation and repair evidence

## Repair — 2026-09-28

`resume: fix` addressed VER-001. The broken links now resolve, the three added
baseline exceptions are removed, and the historical mutation check accurately
states its limited guarantee. The operator authorized the unmet criterion 4;
an independent helper recorded the canonical waiver at ordinal 6. The original
criterion and VER-001 remain unchanged. Independent re-verification is next.

| Finding | Repair and evidence |
| --- | --- |
| F1 | Keep `dotln-generated` and readable textual diffs. Canonical `CriterionWaived` ordinal 6 records the operator's acceptance. Criterion 4 remains **unmet, waived by 6**; no native generated diff-stat marker is claimed. D018 records the investigation and authorization. |
| F2 | Three WO-030 link destinations follow the files into `scripts/lib/`, with a dated relocation note. Historical path labels and counts are unchanged. `doc-baseline.json` is byte-identical to HEAD; `checkDocs` reports zero failures with the original 412 historical occurrences. D017 corrects D005. |
| N1 | Checker comments, diagnostic, output, historical note and D008 now distinguish lexical title presence from active coverage. The verifier's comment-only probe still passes and now prints that limit; absent titles fail. No parser or new sustaining check was added. |

Checks on the repair:

- `npm test -- --review`: 32 suites passed, zero failed; 570.93 seconds,
  76 fresh tasks.
- `npm run test:docs`: 23 passed, zero failed; 12.86 seconds after the
  waiver, repair write-back and follow-up settlements (23 fresh tasks). The
  earlier run also passed in 12.68 seconds.
- Direct historical checker: exit 0; 178 recorded files, 330 current,
  57 unchanged. In-memory comment-only and absent-title probes behaved as
  described above.
- Byte comparisons confirmed the original mutation transcript, summary,
  VER-001, and WO-030 table labels/counts are preserved. The independent
  helper reviewed the repairs and found no further errors.

Actor: Codex CLI 0.157.1, gpt-6-astra, session-selected ultra, normalized to
xhigh with subagents, from Codex session readback. One helper was reused for
read-only assessment/review and the separately authorized waiver recording;
no descendants. The helper's journal role was unobserved, and its executor
check returned null. Writer ownership was transferred sequentially and then
returned to the executor. No verification dispatch or passing verdict was
invented. The next verifier must use `**Criterion 4:** unmet, waived by 6`.

Entry usage: 44,344 tokens, `codex-transcript-counter`, root dispatch scope,
including cached input, cutoff 2026-09-28T01:52:39.084Z. Helper total and dollar
cost are unknown; final counters stay in ignored receipts and the response.
The explicit helper count is 1 of 20; harness-observed coverage does not
establish the full count. D001's existing economy experiment was retained;
no second experiment ran. The adjacent queue remained empty at revision 0.
No product document or dependency changed during repair. `git diff --check`
and the cached-diff check pass. The three repair follow-ups are settled:
FUP-0b0ec2840f54ba3c, FUP-44d1b44c82c77064 and FUP-ca999c98d351e09a.
Criterion 5 still assigns the WO-142 follow-up retargeting to close;
FUP-4050fe828a686c1e is now at source revision 3, which supersedes the original
implementation record’s reference to revision 2. Local release preparation
kept the existing patch target v0.52.9.

## Original implementation record

Recorded 2026-09-27 for `resume: next` by the executor session (Claude Code
2.1.283, `claude-fable-5-1`, effort xhigh read back from the session, which
the operator selected as `ultracode`, so subagents were used: eight of a cap
of twenty, all read-only). This is the
executor's result, ready for independent verification; it is not a
verification verdict or a final review. Local paths are written as
`<worktree>` and `<session-scratch>`.

## Delivered

Three import-only scripts live under `scripts/lib/` and nine files follow them
([D002](decisions.md#wo-163-d002--the-move-nine-files-follow-three-and-the-release-note-pattern-keeps-both-spellings)).
The library's one command block is the entry point
`scripts/release-fixtures.mjs`
([D003](decisions.md#wo-163-d003--the-librarys-command-block-is-run-so-it-becomes-an-entry-point)).
Three one-shot planning inputs are retired, after the one live link to them was
rewritten
([D004](decisions.md#wo-163-d004--three-one-shot-planning-inputs-retire-and-one-live-link-is-rewritten-first)).
The follow-up register carries the generated attribute
([D006](decisions.md#wo-163-d006--the-register-is-marked-generated-and-the-mark-does-not-show-in-a-diff-stat)).
The WO-042 mutation reproduction is a historical record with a narrower check
([D008](decisions.md#wo-163-d008--the-wo-042-mutation-reproduction-is-kept-as-a-historical-record)),
and WO-099 D007 is recorded as discharged since 2026-09-20
([D007](decisions.md#wo-163-d007--wo-099-d007-was-discharged-on-2026-09-20-no-episode-is-run)).

## Implementation choices before VER-001 (historical)

The table records the original implementation handoff. The repair above
supersedes the D005 and criterion 4 rows; the remaining original dispositions
retain their recorded scope.

| Item | What was done | The other route |
| --- | --- | --- |
| Three links in closed WO-030 evidence break when the scripts move ([D005](decisions.md#wo-163-d005--three-historical-link-exceptions-for-closed-wo-030-evidence)) | Three exceptions were added to `docs/control/doc-baseline.json`, a control of the document gate that the order does not name. They are the first exceptions for links that resolved when written. Each names D005 and the baseline's header records the admission | Change the three destinations in the closed README and take the entries out of the baseline |
| Criterion 4's first clause ([D006](decisions.md#wo-163-d006--the-register-is-marked-generated-and-the-mark-does-not-show-in-a-diff-stat)) | Not demonstrated: `git diff --stat` does not show a custom attribute, and the recorded known issue forbids the attribute that would change its output. The second clause is met. Nothing is waived here | Waive the clause after verification, or correct the criterion through planning |
| WO-099 D007 ([D007](decisions.md#wo-163-d007--wo-099-d007-was-discharged-on-2026-09-20-no-episode-is-run)) | Neither of the order's two routes was taken, because the row was discharged on 2026-09-20. One register row, not two, is retargeted at close | Run the episode from the operator's own outside terminal, which overwrites the committed row |
| The sibling order WO-162 ([D011](decisions.md#wo-163-d011--boarded-the-sibling-order-edits-ten-of-the-same-scripts-one-of-them-a-file-this-order-moves)) | Recorded only. Whichever order integrates second must correct one import before `scripts/worktree.mjs` will load | — |

## Where the order's premises did not hold

Each was checked against source before a decision was made.

| The order says | Observed | Decision |
| --- | --- | --- |
| Six importers are updated | Nine files follow the move: five importers and four fixtures that copy or name the files. One pattern in `scripts/release.mjs` follows too | D002 |
| The command block may be unused | `scripts/test-release.sh` ran it at four sites | D003 |
| No receipt, check or document reads the three inputs | `docs/planning/work-order-map.md` line 167 linked to one of them; only one input equals a receipt's entries under its own name | D004 |
| The move touches scripts only | Three links in closed WO-030 evidence point at the old paths and fail the document check | D005 |
| `git diff --stat` shows the register as generated | A custom attribute does not change that output | D006 |
| WO-099 D007's row has waited since 2026-09-20 | WO-099-D010 discharged it that day; its register row was settled on 2026-09-21 | D007 |
| Regenerating the mutation check is preferred | The instrument cannot run on the current tree, and a regenerated record would fail at the next package edit | D008, D009 |
| WO-162 edits disjoint files | On 2026-09-28 its worktree edited ten of the same script paths, one of them a file this order moves | D011 |

## Criteria

The executor reports what it observed; the verifier judges each criterion.

| Criterion | Evidence |
| --- | --- |
| 1 | The three files are under `scripts/lib/`, and every reference in code, tests and harness files resolves there ([greps](greps.txt) section 2; the probe below; the eight suites below). No discovery fixture or harness surface names the files ([greps](greps.txt) section 1). `npm run harness -- check` is in the gate table |
| 2 | [greps](greps.txt) section 4: the only match under `scripts/lib/` is the definition of `isMainModule`. `scripts/test-runner.mjs` keeps every source row it had and gains `scripts/release-fixtures.mjs` in `runner-fixtures` |
| 3 | The three inputs are gone ([greps](greps.txt) section 10). D004 names the receipt that carries each input's entries and the reader grep ([greps](greps.txt) sections 6 to 9). `npm run test:docs` is in the gate table; it passes with three baseline exceptions this order added (D005) |
| 4 | Second clause, observed: the row is present and `git check-attr` reports `dotln-generated: set`, with `diff` and `binary` unspecified ([greps](greps.txt) section 11). First clause, not demonstrated: `git diff --stat` prints the same line counts with the attribute as without it (D006) |
| 5 | Claimed under the criterion's "marked historical" arm. D008 closes WO-142 D008: the reproduction is marked historical [beside its evidence](../WO-042/mutations/README.md), the failing reason is at the top of the tool, and `--check` exits 0 because what it checks is narrower. D007 records WO-099 D007 as already discharged. D010 names the one register row the close retargets |
| 6 | Gate table below; `package.json` and the lockfile are unchanged |

Write-backs: decisions D001 to D013; product 05 §5S / 6S gains one dated
sentence (+123 bytes, 2,544 under its ceiling); product 06 §Release boundary
gains the activation paragraph; both publication locks follow those two
documents; the register gains four rows and one source revision.

## The probe and what it can see

The experiment ([D001](decisions.md#wo-163-d001--economy-experiment-an-import-probe-between-edits-the-suites-once))
used this session script. It is not part of the repository.

```js
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(process.argv[2] ?? ".");
const started = process.hrtime.bigint();
const files = [];
const visit = (directory) => {
  for (const name of readdirSync(directory).sort()) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) visit(path);
    else if (name.endsWith(".mjs")) files.push(path);
  }
};
visit(join(root, "scripts"));

const specifier =
  /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])(\.{1,2}\/[^"'\n]+)\1/g;
const missing = [];
let checked = 0;
for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(specifier)) {
    checked++;
    const target = resolve(dirname(file), match[2]);
    if (!existsSync(target))
      missing.push(`${relative(root, file)} -> ${match[2]}`);
  }
}
const milliseconds = Number(process.hrtime.bigint() - started) / 1e6;
console.log(
  JSON.stringify(
    { files: files.length, specifiers: checked, missing, milliseconds },
    null,
    2,
  ),
);
process.exitCode = missing.length ? 1 : 0;
```

| Tree | Modules | Specifiers | Unresolved | Beyond the pristine 43 |
| --- | ---: | ---: | ---: | --- |
| Pristine, 2026-09-27T23:47:49Z | 168 | 767 | 43 | — |
| After the move and the split, 2026-09-28T00:08:45Z | 169 | 768 | 43 | none |
| Scratch copy, one importer reverted | | | | `scripts/worktree.mjs -> ./github-repository.mjs` |
| Scratch copy, the moved file's import reverted | | | | `scripts/lib/release-notes.mjs -> ./lib/config.mjs` |
| Scratch copy, a name restored to a fixture list | | | | none: not seen |
| Scratch copy, the old path restored in a shell fixture | | | | none: not seen |

The 43 unresolved specifiers of the pristine tree are source text that a file
embeds for a fixture: 35 in `scripts/test-evidence-sources.mjs`, 6 in
`scripts/test-harness.mjs`, 1 in `scripts/test-release-composition.mjs` and 1 in
`scripts/lib/copilot-qualification.mjs`.

## Suites on the moved tree

Run one at a time through the runner, `node scripts/test-runner.mjs --only
<suite>`, before the attribute row, the retirements and the mutation tool
changed, so they are feedback on the move and not the gate. `github-body` ran
at 2026-09-28T00:09:14Z; the other seven ran from 00:09:31Z to 00:17:35Z, 484 s
from the first start to the last exit. Each exited 0 with no failed task.

| Suite | Result | Seconds |
| --- | --- | ---: |
| `github-body` | passed | 0.68 |
| `worktree` | passed | 72.46 |
| `worktree-integration` | passed | 76.88 |
| `release` | passed, 46 tasks | 37.03 |
| `configuration-root` | passed | 3.12 |
| `runner-fixtures` | passed | 15.61 |
| `target-publish` | passed | 12.29 |
| `harness-fixtures` | passed | 264.26 |

## The mutation check before and after

The scratch cases ran the delivered tool against a scratch launchpad that held
copies of the record and of `packages/compiler/test/authority.test.ts`.

| Case | At the base | Delivered |
| --- | --- | --- |
| `node scripts/authority-mutation-evidence.mjs --check` on the worktree | exit 1, `mutation evidence executable subject drift` | exit 0, `Historical record verified against itself` and `178 recorded files, 330 current, 57 unchanged` |
| Scratch copies, unchanged | not run | exit 0 |
| One byte appended to the transcript | not run | exit 1 |
| One verdict changed in the summary | not run | exit 1 |
| One named killing test renamed in the package tests | not run | exit 1, `the record's killing test is no longer in the package tests` |
| A tracked package file missing from the working tree | not run | exit 0; the file counts as changed |
| `--write` | not run: it rewrites the record | exit 1, usage line naming `--check` only |

## Review before the gate

Three read-only reviewers and one skeptic read the change before the gate
([D013](decisions.md#wo-163-d013--review-before-the-gate-and-what-it-changed)).
The skeptic upheld all nineteen findings: four major, thirteen minor and two
duplicates, none blocking, and no defect in the moved code. The two largest
corrections were to this record: D005 had claimed a rule it only extends, and
D006 had presented criterion 4 as met through its parenthetical.

## Follow-ups at the original implementation handoff (historical)

| Register row | Decision | Subject | Proposed disposition |
| --- | --- | --- | --- |
| FUP-0b0ec2840f54ba3c | [D005](decisions.md#wo-163-d005--three-historical-link-exceptions-for-closed-wo-030-evidence) | The route for a link from closed-order evidence to a file a later order moves | operator, then planner |
| FUP-667e12ad11c15caf | [D009](decisions.md#wo-163-d009--boarded-the-mutation-instrument-cannot-run-on-the-current-tree) | The WO-108 mutation instrument cannot load or select a campaign on a current commit | planner, low priority |
| FUP-7932ccddcde95d4f | [D011](decisions.md#wo-163-d011--boarded-the-sibling-order-edits-ten-of-the-same-scripts-one-of-them-a-file-this-order-moves) | One import WO-162 adds to a file this order moves | the second final review |
| FUP-045a0a480f95bcc7 | [D012](decisions.md#wo-163-d012--boarded-two-orders-not-yet-activated-cite-an-old-path) | WO-062 and WO-065 cite `scripts/github-repository.mjs` | planner, before activation |

`npm run meta` minted the four rows; none has a disposition yet. It also gave
FUP-4050fe828a686c1e (WO-142-D008) a second source revision, from D008's
`reopens` object, so that row reads as needing review until the close retargets
it against revision 2. FUP-abcc64ad8f8c79b9 (WO-099-D007) is unchanged and
settled.

## Limits

- The release note pattern was compared over consecutive local tags, which
  approximates each manifest's recorded previous release; remote-only tags were
  not observed. No fixture exercises the two alternatives that changed
  ([D002](decisions.md#wo-163-d002--the-move-nine-files-follow-three-and-the-release-note-pattern-keeps-both-spellings)).
- The relation between each retired input and its receipt is read from content
  and commit order; no receipt records the path it was given
  ([D004](decisions.md#wo-163-d004--three-one-shot-planning-inputs-retire-and-one-live-link-is-rewritten-first)).
- The tool's old `--write` mode was never run: it rewrites closed-order
  evidence. That it could not have run is read from the instrument's code and
  from an in-memory run of its selection
  ([D008](decisions.md#wo-163-d008--the-wo-042-mutation-reproduction-is-kept-as-a-historical-record)).
- The sibling worktree was read through `git status` and `git diff` for the
  shared paths only, and its state is uncommitted
  ([D011](decisions.md#wo-163-d011--boarded-the-sibling-order-edits-ten-of-the-same-scripts-one-of-them-a-file-this-order-moves)).
- Ignored local lanes (`docs/intake`, `docs/control/local`, `.runtime`) were not
  searched for the old paths; every grep reads tracked files.
- Operator-review assumption 1 cannot be confirmed from `docs/README.md`: it
  states no layout rule for `scripts/` and `scripts/lib/`, and no scripts README
  exists. The layout follows the five existing pairs of an entry point and its
  library.

## Operator steering

Actor-attested. The entry announcement and each next action were stated in
chat before they began. One operator message arrived during the dispatch,
`conversation only:` asking for an overview; it was answered without pausing
work and changed no scope. That answer named the baseline exceptions, the map
link and the kept mutation tool as decisions open to veto; no veto arrived,
which is not recorded here as acceptance. The follow-up queue held no item at
revision 0.

## Gate

Each ran on the final source, after the review's corrections. The host probe
found no sandbox in force.

| Check | Result |
| --- | --- |
| `npm test -- --review` | 32 passed, 0 failed, 571.49 s, 76 fresh tasks; recorded 2026-09-28T01:30:23Z for code identity `14fed0639f52…`. The change selected four machinery suites: `configuration-root` 4.22 s, `harness-fixtures` 254.68 s, `runner-fixtures` 17.80 s and `registrations` 0.55 s. `release` passed its 44 cases |
| `npm run test:docs` | 23 passed, 0 failed, 12.86 s at 2026-09-28T01:20:19Z, before this section was written. It was run again after these evidence edits; that run is in the gate rows and the handoff |
| `npm run harness -- check` | exit 0: 31 generated surfaces; it reports the local-terms list as unavailable |
| `npm run publication:check` | both editions current after their locks followed products 05 and 06 |
| `npm run release -- prepare --local` | `WO-163 target v0.52.9 remains current`; the meter snapshot and the pull-request body's meter block written |
| `node scripts/authority-mutation-evidence.mjs --check` | exit 0 |
| `git diff --check` | clean |
| Dependencies | `package.json`, the lockfile and `packages/` unchanged |

The full gate found no path failure, so the probe of D001 missed nothing that
a suite then caught.
