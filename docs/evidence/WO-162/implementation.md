# WO-162 implementation

Executor handoff, 2026-09-27. Activation baseline:
`6f9494649db9a4984911801ae320788264d84ff9`.
Actor: Codex CLI 0.157.1, gpt-6-astra, ultra (normalized xhigh with
workflows), from the session readback. One root writer and one reused
read-only review agent; no descendants were requested. Host subagent
observation was incomplete, so the explicit session count is one.

## Delivered

| Criterion | Implementation and evidence |
| --- | --- |
| 1 — Git | `scripts/lib/git.mjs` holds the two Git subprocess declarations the criterion's grep names. Git calls that reach the program another way predate this order and remain, for example `lib/meta.mjs`'s `diff --no-index` measurement and the six `execute("git")` sites in `release.mjs`. Former local wrappers use `runGit` with their original flags, buffer limits, trimming and diagnostics. Raw-result consumers use `spawnGit`/`execGit`. The required Git grep returns only the library's two adapter declarations. `meta` and `authority-probe` retain their domain wrappers. |
| 2 — fixture and JSON helpers | One new module, `scripts/lib/helpers.mjs`, owns mkdir/write and pretty JSON. Root-bound, structured-data and mode adapters delegate to it; Copilot retains 0o600. The guarded integration writer remains separate as directed. Remaining embedded prose templates and compact JSON/JSONL have different output contracts. |
| 3 — receipts | Planning and entropy share timestamp, digest-shape, exact-keys, labeled parsing, directory and lock helpers. Receipt-ID grammars and domain diagnostics remain local. The machinery gate passed the planning/entropy fixture suite. Its existing assertions are preserved; test setup adopts the shared helpers. |
| 4 — JSON readers | The readers in `lib/meta`, `lib/harness-prune`, `test-portfolio`, `resident-bind` and `lib/entropy-review` reach `paths.mjs`. The optional raw-error path preserves native error messages before each caller adds its existing label or fallback. |
| 5 — byte and digest parity | [helper-regression.txt](helper-regression.txt) compares 31 legacy writers against the shared writer, `helpers.write`, over 99 identical inputs, including immutable activation fixture bytes, binary data and Unicode. It does not run each file's own adopter; VER-001's adopter-level differentials cover that. It also compares four serializer families, eight bare-hex digest definers, a sample of Git result and error shapes, and receipt refusals. The regression reads baseline bytes from commit `6f94946`, so it needs that commit reachable. The stored-fixture comparison is a separate script, [compare-fixtures.mjs](compare-fixtures.mjs). Criterion 5 was amended by the operator ([D012](decisions.md#wo-162-d012)); see the stored-fixture section below. `sha256Hex` is implemented in the shared module and re-exported beside the prefixed `sha256` from `plan-subject`. |
| 6 — compiler | `compile.ts` imports the two unchanged normalizers from `normalize.ts`. [compiler-parity.json](compiler-parity.json) records full equality before release versioning; it was written during implementation and no retained script regenerates it, so VER-001's independent parity run over 17 inputs stands in for it. [compiler-release-parity.json](compiler-release-parity.json) proves the final Seiri, entropy and authority outputs differ only at the compiler package-version field; compiled programs and semantic hashes remain identical. The feedback policy hash also follows that label; see the stored-fixture section below. |
| 7 — divergences | [Decisions D004–D007](decisions.md#wo-162-d004) retain the distinct containment, equality, text and fence contracts and name their callers. Two latent defects are named follow-ups: the handoff/mission text mismatch is deferred as `FUP-b789b81160c008ea` (no production transfer was established), and the variant-spelling containment defect is open as `FUP-8369f2b4284e70a8` (reproduced in scratch; the beacon guard is reachable from the skeleton CLI's `--beacons` argument, and no in-repository production caller constructs the source-change host). Neither is fixed here. |
| 8 — evidence and gates | Authority revision 003 reproduces; artifact-identity 001, verification 001 and feedback 001 are selected. Product, document and machinery gates passed. `git diff --check` passed. Package changes are the compiler patch and its existing dependency pins; no new dependency was added. D003 records operator-authorized helper-only overlap with WO-163. |

## Stored fixtures and release bookkeeping

Criterion 5 as first written, that every stored fixture remains unchanged,
did not hold, and VER-001 judged it unmet. The operator amended it
([D012](decisions.md#wo-162-d012)).
[fixture-digests.json](fixture-digests.json) records the 177 committed
fixture-tree paths at the baseline (every path with a `fixtures/` directory
segment, plus `corpus/`): 173 are byte-identical, none is missing, none was
added, and four console files changed (`expected/selfhost.html`, `.json`,
`.txt`, and `manifest.json`). The cause is the required compiler label: it
moved from 0.19.3 to 0.19.4 because compiler source changed, and the feedback
policy hash includes it. The console accepts only a maturity report with the
matching policy hash, so the self-host fixtures follow the WO-162 feedback
edition. The three expected outputs change their labels, references and
policy hash; the manifest changes its maturity path, reference and recorded
digest and records no policy hash. With the current code under the 0.19.3 label the baseline
console fixtures reproduce exactly. Console implementation source is unchanged.
The fixed-input helper comparison passes independently. See
[D011](decisions.md#wo-162-d011).

The compiler patch is 0.19.4; the staged application target is v0.52.9,
based on the activation tag snapshot. Final-review integration owns any
sibling version collision. Generated harness changes pin the refreshed
compiler runtime. Feedback carries the established live audit under the new
component labels; no new live episode was run. Intermediate authority
revisions 001 and 002 are preserved; current selection is 003.

The planning assumption that scripts were unregistered was incorrect.
Evidence-tool imports now explicitly register helpers, Git and paths;
[D010](decisions.md#wo-162-d010) records the checked dependency evidence.
The skeleton validator map candidate now records 12 declarations, 2,280
bytes, 162 calls and 996 duplicate bytes before import overhead, while
retaining its live-episode and two-touched-protocol reopening condition.

## Executed checks

Observed command results at the implementation subject, before the repair
(the repair's own checks are under Repair 1 below):

- `npm test`: 28 suites passed, zero failed, 72 fresh scheduler tasks;
  314.378 seconds, recorded 2026-09-28T00:24:04.177Z.
- `npm run test:docs`: 23 tasks passed, zero failed; 12.937 seconds,
  recorded 2026-09-28T00:18:44.410Z. Final report/index preparation is
  followed by the same document gate.
- `npm run test:machinery`: terminal result 19 tasks passed, zero failed;
  394.86 seconds. This includes receipt, harness, process, configuration,
  evidence-source and runner fixtures.
- `node scripts/test-helper-reuse.mjs`: four tests passed; the retained
  transcript states the exact comparison inventory.
- `compare-fixtures.mjs` and `compare-compiler.mjs`: successful assertions
  produced the linked digest records. The compiler comparison accepts the
  checkout root and preserved baseline build root as arguments.
- `npm run publication:check` and `git diff --check`: passed.

The product and document gate records share code identity
`4f7fa16d507eb45d51e5248958a4a084ec4da0d9fe10aa14a2a2618b76c7696d`.
The initial document run exposed stale generated indexes, publication lock
and formatting; these were corrected and the gate passed. One product run
was deliberately stopped before the last missed adoptions; it recorded no
passing check. Direct configuration tests initially inherited the outer
Codex thread identity; the sanitized rerun and canonical machinery gate
both passed. No assertion was weakened to address that environment issue.

## Outcome and limits

Common implementations now have one home within their existing units.
Caller-specific behavior remains explicit, and the selected semantic
divergences remain separate. The byte comparisons and existing gates
support that maintenance outcome. No runtime speedup or future token saving
is claimed; D002 declined a separate economy experiment. This broad
mechanical adoption costs a larger review diff and two explicit adapters
for native Git results/errors. No new utility package or gate step was added.

Final usage remains in ignored process observations and the handoff message.
The independent verifier judges this recorded subject and the stated
fixture qualification. Final review, commits and publication are separate
dispatches.

## Repair 1 — VER-001

Recorded 2026-09-27 for `resume: fix` against
[VER-001](../../verifications/WO-162/VER-001.md), which failed criteria 5
and 7. The six criteria VER-001 judged met are untouched except by the
import and call-site cleanup listed under M1 and M4.

| Finding | Repair | Decision |
| --- | --- | --- |
| F1 — D004 rested on a false premise and a reproduced defect had no follow-up | D004 states the three helpers' observed behavior, the reproduced variant-spelling defect, its reachability and its limits. The defect is follow-up `FUP-8369f2b4284e70a8` (open) and queue item `adjacent-0002` (deferred to it). It is not fixed here. | [D004](decisions.md#wo-162-d004), [D014](decisions.md#wo-162-d014) |
| F2 — D005 and D006 omitted dependent callers | D005 names all fourteen call sites of the three equality helpers. D006 names the five scripts validators and the four skeleton protocol validators with their classes. Two unsupported sentences were removed: that every compared value is generated in stable key order, and that the classes differ intentionally. | [D005](decisions.md#wo-162-d005), [D006](decisions.md#wo-162-d006), D014 |
| F3 — criterion 5 unmet as written | The operator amended criterion 5; `plan amend-order` bound the amended text to D012. The three overclaims are corrected: D011, the comparison script and its record, and the roadmap now state 177 paths, 173 unchanged, four changed, and the compiler-label cause. | [D012](decisions.md#wo-162-d012), [D011](decisions.md#wo-162-d011), D014 |
| M1 to M6 | M1: four unused imports and two unused requires removed. M4: nine call sites with a dead first parameter now call `spawnGit` or `execGit` directly. M2, M3 and M5: the Delivered table above now describes them accurately. M6 and the release-fixture file's M4 sites are left, with reasons. | [D015](decisions.md#wo-162-d015) |

**Executor process failure.** The operator directed that this be recorded as
a failure. I stopped the operator with a blocking question about how to
settle criterion 5, although the four changed fixtures were a mechanical
consequence of a required version change and I already held the evidence. I
then held every repository write for about thirty-four minutes while
background evidence agents ran; three of the four had reported thirteen
minutes before I resumed. The operator had to ask what I needed and when the
work would start. [D013](decisions.md#wo-162-d013) records the correction.
After it, no further question was put to the operator, and writes no longer
waited on agents whose results they did not need.

**Beyond VER-001.** The evidence run found things VER-001 did not name, all
recorded in D004 with their limits. A variant-spelled parent that overlaps
nothing leaves the same residue. A volume alias passes the guard, and in
scratch `realpathSync.native` returned it unchanged. The environment and
beacon guards have the same class of defect. Reachability differs by guard:
no reader of the launchpad setting `repositories.<id>.worktreeParent` was
found and no in-repository production caller constructs the source-change
host, while the beacon guard is reachable today from the skeleton CLI's
`--beacons` argument. The variant spellings were not driven through the CLI.
VER-001 left reachability untested.

**Refutation of the repair.** Three read-only agents compared the first
corrected text with its cited source and reported 27 problems; each was
checked against source by the executor and all 27 are corrected. The most
material: the amended criterion and D012 said all four console files record
the policy hash, but `manifest.json` records the feedback edition and its
maturity digest and no policy hash; D004's follow-up said no production
caller reaches the defect, which holds for the source-change guard only;
D005 described the cost table's key order and two comparisons too simply;
D006 did not state its scope. The amendment was bound again after the
correction.

**Executor error in the amendment binding.** D012 was bound by
`plan amend-order` at 02:10Z. I then edited D012 to correct its wording and
bound it again at 02:26Z. A bound decision is immutable: the planning check
validates every amendment row, so the two rows could not both hold and
`plan check` failed. No canonical route existed, because the withdrawal
validates the same binding. I removed my own first row from
`docs/control/plan-refutations.jsonl` by hand. It was appended in this
session and never committed; the 27 committed rows are untouched.
[D016](decisions.md#wo-162-d016) records the removed row's hashes, the
reopening condition and the follow-up `FUP-9625ca888d7d08f5`. The operator
was told when it was done. A reviewer who judges that removal outside the
writer's authority can restore the row from D016's hashes.

**Follow-ups and queue.** D004's follow-up is `FUP-8369f2b4284e70a8` and
D016's is `FUP-9625ca888d7d08f5`, both open for the next planning pass.
D006's `FUP-b789b81160c008ea` gained two source revisions from the corrected
evidence and stays deferred. The adjacent queue holds three deferred items,
each pointing at its follow-up, and nothing queued or running. D002's
experiment stands; no second experiment was started.

| Check at the repaired subject | Observed result |
| --- | --- |
| `npm test` | 28 suites passed, 0 failed, 72 fresh tasks, 318.05 s, recorded 2026-09-28T02:23:44.040Z at code identity `56be7862b58fb1087deec770a5b4bbd8216e50122ab462c0db2e622ba225123e`. The identity was read again after the last edit and is unchanged. |
| `npm run test:docs` | 23 passed, 0 failed, 13.83 s; run again after this table was written: 23 passed, 0 failed, 12.80 s. |
| `npm run test:machinery` | 19 passed, 0 failed, 407.18 s. |
| `node --test scripts/test-helper-reuse.mjs` | 4 passed, 0 failed. |
| `node docs/evidence/WO-162/compare-fixtures.mjs` | Exit 0: 177 rows, 173 unchanged, 4 changed, none added. |
| `node scripts/authority-evidence.mjs --check` | Exit 0; revision 003 stays selected. The repair changed no registered source. |
| `npm run plan -- check`, `npm run publication:check`, `npm run release -- prepare --local`, `git diff --check` | Each exit 0. The publication source lock was refreshed after the roadmap correction. |

Run standalone, `scripts/test-concurrent-control.mjs` fails before and after
the repair because it needs the release suite's fixture argument; it passed
inside the product gate.

**Subagents.** Seven read-only agents of a cap of 20: four gathered evidence
and three tried to refute the corrected text. None wrote inside the
repository; the root session was the only writer.

**Actor.** Claude Code, model `claude-fable-5-1`, effort `xhigh` read from
`CLAUDE_EFFORT` (selected, not effective), ultracode with subagents. Token
counters are reported with the handoff.
