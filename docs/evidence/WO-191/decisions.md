# WO-191 decisions

## WO-191-D001

```json
{
  "id": "WO-191-D001",
  "date": "2026-10-11",
  "dispatch": "resume: next",
  "decision": "Keep the order's balanced fallback on all five publication surfaces and compile it to advisory guidance at the existing writing moments. Add only the two declared role sentences, preserving their prior oracle chain. Bump the skeleton component from 0.57.1 to 0.57.2 for its changed loadout; update the console dependency pin and lockfile without changing the console version or the harness host version.",
  "evidence": [
    "docs/work-orders/WO-191-reader-profiles.md: five surfaces, five dimensions and balanced fallback; the final review presents the choices",
    "docs/product/08-publication-compiler.md: audience selection changes sequence, vocabulary and depth, not facts, limits or evidence",
    "docs/evidence/WO-068/decisions.md D004 declines machine limits on prose",
    "packages/skeleton/src/loadouts/contributor.ts: one new reviewer sentence and one new planner sentence; packages/skeleton/fixtures/wo191-role-baseline.json preserves wo073-role-baseline.json",
    "node scripts/harness.mjs emit: 34 generated surfaces; reviewer root 27037 bytes against 28884, planner 18489 against 24576, each measured as CLAUDE.md plus its installed .agents skill"
  ],
  "rationale": "The profile is a choice of presentation. A refusal based on length or style would change the order's purpose. The roots are below their ceilings, so no acceptance or ceiling edit is needed. No operator choice has been recorded during execution.",
  "rejected": [
    { "option": "NoOp", "reason": "Authors would still receive no committed surface-specific guidance and corrections would remain the only setting." },
    { "option": "Refuse or rewrite prose that differs from a profile", "reason": "The order explicitly excludes it and the cited earlier decision describes the incentive to game such checks." },
    { "option": "Ask the operator to choose before implementation", "reason": "The order supplies a fallback and puts that choice at final review, after the examples are reviewable." }
  ],
  "reopenWhen": "The operator chooses a different profile, a surface needs another dimension, or a changed loadout alters runtime behavior beyond guidance."
}
```

The traps that changed implementation were mistaking style for correctness and
introducing a new publication refusal. Guidance is printed beside the existing
draft and never changes it; profile validation belongs to the document check.
The executor remains the only repository writer. The worker plan reserves four
admissions of the session's twenty: examples, a fresh baseline reader, criteria
adversary and design reviewer. Worker readbacks and final findings belong to the
handoff, not to an assumed coverage count.

## WO-191-D002

```json
{
  "id": "WO-191-D002",
  "date": "2026-10-11",
  "dispatch": "resume: next",
  "decision": "Score the immutable human Release text in each annotated tag, with four answers per release, a text hash and tag object identity. A profile revision is the SHA-256 of the validated choices in canonical surface and dimension order, read from that tag; a missing historical file records null and its reason. Typed surface corrections share the score log but are counted separately. Plan start recommends a single fresh reader only for a not-yet-scored current revision with at least three unscored releases.",
  "evidence": [
    "scripts/release.mjs: tagMessage stores the human edition before DOTLN-MANIFEST-BEGIN",
    "scripts/lib/reader-profiles.mjs: scorePrompt, recordScores, taggedProfile, scoreRows and readerScoresAtStart",
    "scripts/test-reader.mjs: comparison of raw JSON hashing and canonical-choice hashing on reordered keys and a changed voice"
  ],
  "rationale": "The immutable Release text gives a reproducible published subject without using today's regenerated prose or mutable forge pages. A formatting-only edit must not pay another reader. Raw-file hashing and canonical-choice hashing are compared on that axis; the latter preserves the setting's identity while a changed choice still changes the revision. Quotation presence and position are indicators, not a judgment of whether an answer is correct or a surface reads well.",
  "rejected": [
    { "option": "NoOp", "reason": "There would be no reproducible baseline or way to compare a later profile revision." },
    { "option": "Hash the exact JSON layout", "reason": "Reordering keys or running a formatter would count as a profile change without changing any instruction." },
    { "option": "Score today's regenerated Release pages", "reason": "They can change with the renderer and would attribute a current rendering to a historical profile." },
    { "option": "Run a reader on every planning pass", "reason": "The order admits this recurring cost only after a changed profile and three releases or at the operator's word." }
  ],
  "reopenWhen": "The operator needs a separate answer-finding measure for titles, PR bodies, commit subjects or release notes; Release-page scores currently make no quality claim about those surfaces, and their typed correction counts retain that distinction."
}
```

## WO-191-D003

```json
{
  "id": "WO-191-D003",
  "date": "2026-10-11",
  "dispatch": "resume: next",
  "decision": "Use v0.73.1 (WO-198) for all five example surfaces and the current ten newest annotated releases, v0.74.1 through v0.69.1, for the baseline. Retain the baseline reader's answers without editorial repair. All ten profile revisions are null because their tags precede reader-profiles.json.",
  "evidence": [
    "Local annotated tag inventory at entry: v0.74.1, v0.74.0, v0.73.1, v0.73.0, v0.72.0, v0.71.1, v0.71.0, v0.70.0, v0.69.2, v0.69.1",
    "v0.73.1 human tag edition and tagged docs/final-reviews/WO-198/RELEASE-NOTES.md; published pull request 200 title/body read with gh pr view; the implementation commit subject in v0.73.0..v0.73.1",
    "docs/evidence/WO-191/baseline-reader.json and baseline-run.json: fresh Claude Code 2.1.296 print run in an empty temporary directory, tools disabled, only project settings and a replaced system prompt; modelUsage reports claude-opus-5-5; xhigh is launch-selected with effective effort unavailable",
    "npm run reader -- score --record docs/evidence/WO-191/baseline-reader.json: appended 10; identical repeat: appended 0, alreadyScored 10"
  ],
  "rationale": "The selected example release is one diagnostic addition after the publication repairs in v0.71.0, with useful limits to preserve. The order's v0.68.0 baseline reference was dated; the criterion asks for the ten most recent releases. The reader found a quotation for all forty questions, which proves presence, not answer quality: for example the action answer on v0.73.1 describes compatibility without directly telling the reader whether to act.",
  "rejected": [
    { "option": "NoOp or a synthetic baseline", "reason": "The criterion requires one real fresh-reader run over published text." },
    { "option": "Keep the planning date's ten tags", "reason": "That would omit the recent publication repairs and would no longer be the ten most recent releases." },
    { "option": "Improve the reader's indirect answers before recording", "reason": "That would replace the observed reader response with the executor's judgment." }
  ],
  "reopenWhen": "The operator rejects text despite unchanged or rising scores, or a later profile comparison needs a different published surface or a stricter human judgment of each answer."
}
```

## WO-191-D004

```json
{
  "id": "WO-191-D004",
  "date": "2026-10-11",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.74.2, the next patch above the observed release baseline v0.74.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.74.1 (local tags)",
    "patch classification declared in docs/work-orders/WO-191-reader-profiles.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-191-D005

```json
{
  "id": "WO-191-D005",
  "date": "2026-10-11",
  "dispatch": "resume: next; executor self-review",
  "decision": "Repair all five independent findings before handoff: preserve the Release-page branch-scope claim and explicit failed verification verdicts in the examples; validate saved scores against their immutable tag subject; reject additional reader metadata; and select the triggering revision's releases when an automatic reader is due. Resolve the record release-note example's relative links against its original tagged location without changing its wording.",
  "evidence": [
    "The independent criteria adversary found two fact-preservation omissions that the original literal anchors did not detect; the branch-scope anchor is now in the catalog and each Release-page example.",
    "The independent design reviewer found three defects: saved rows accepted invented subjects, arbitrary reader keys entered the log, and a due batch could omit all releases of the triggering revision. Its read-only repair review reports all three fixed and no concrete regression.",
    "scripts/test-reader.mjs: 11 targeted fixtures pass, including mutated stored rows, unexpected reader metadata, first Unicode quotation offsets and a current revision hidden behind ten higher-version releases of another revision.",
    "The example-only linkFailures probe found 15 source-relative destinations broken after moving the release-note record to the example directory. The sourceTransform front matter discloses their projection to the original paths at the tagged commit.",
    "The canonical-profile experiment passed both arms: raw JSON hashes changed when only key order changed, canonical-choice hashes stayed equal, and changing a voice position changed the canonical revision."
  ],
  "rationale": "Literal anchors and a score's JSON shape are insufficient evidence for semantic preservation or a published subject. Rechecking immutable content keeps figures reproducible while preserving historical rows if a tag name later moves. Sharing batch selection makes the one-reader condition pay for the revision that caused it. Rejecting unknown metadata keeps unrelated reader context out of the public log.",
  "rejected": [
    { "option": "NoOp and retain shape-only score validation", "reason": "A fabricated row could alter the figures and suppress a reader without a corresponding published text." },
    { "option": "Add a separate automatic-score command and another role instruction", "reason": "One shared selector repairs the mismatch without expanding the declared command or cold-start text." },
    { "option": "Ignore broken links in historical example files", "reason": "The examples are committed navigable documents; resolving destinations preserves the source's evidence while leaving its wording intact." }
  ],
  "reopenWhen": "A later publication shape cannot identify its immutable human text, or independent readers find another claim lost despite passing literal anchors."
}
```

The direct `composed_evidence` fixture launch initially inherited the root Codex
session identity and stopped at a fixture lifecycle reservation because the
fixture has no harness build. That was an invocation error, not evidence of a
publication regression. The corrected launch uses the test runner's existing
`suiteEnvironment` projection; the final gates use that projection normally.
The next launch exposed the new fixture-seeding commit preceding the fixture's
declared author setup; the existing contribution check correctly refused that
unsigned outside-author commit. Seeding now follows that setup, and a failed
publication prints its captured output so the diagnostic survives cleanup.

## WO-191-D006

```json
{
  "id": "WO-191-D006",
  "date": "2026-10-11",
  "dispatch": "resume: next; review-gate repair",
  "decision": "Give the release-preparation and shell publication fixtures synthetic profiles and examples owned by their temporary repositories. Keep the real example and profile checks in the document suite.",
  "evidence": [
    "The first npm test -- --review run reported release-preparation failure after its assertions passed: its product read guard recorded four excluded reads of reader-profiles.json and the three release-note examples.",
    "The executor stopped that gate after 402.4 seconds through harness evidence --stop; no passing gate record was created.",
    "scripts/test-reader-fixture.mjs now supplies synthetic editorial inputs to scripts/test-release-preparation.mjs and both changed scripts/test-release.sh cases. scripts/test-reader.mjs remains in the document gate and checks the committed library."
  ],
  "rationale": "A product fixture must prove command behavior from its own inputs. Depending on editable publication documents made the fixture's result depend on bytes outside product identity, which the existing read guard correctly rejected.",
  "rejected": [
    { "option": "NoOp or relax the product read guard", "reason": "The guard exposed a real test-boundary error; its rule and the existing product checks remain useful." },
    { "option": "Move the entire release-preparation suite to the document gate", "reason": "Its existing product behavior still needs product coverage. Synthetic inputs keep that coverage and let the document suite judge the real editorial artifacts." }
  ],
  "reopenWhen": "A publication fixture begins reading a repository document instead of its own synthetic inputs."
}
```

## WO-191-D007

```json
{
  "id": "WO-191-D007",
  "date": "2026-10-11",
  "dispatch": "resume: next; review-gate repair",
  "decision": "Print the new release-note guidance in ordinary release preparation, while preserving the outcome-only output of worktree integration's internal --integration preparation call.",
  "evidence": [
    "The second full review run passed the repaired release-preparation suite and both publication guidance cases, then failed the existing fast-forward and reviewed-merge integration assertions.",
    "scripts/test-worktree-integration.mjs:903 expects the durable Release preparation line to end with the local tag observation. The new advisory had been appended to that line, including an absent-profile filesystem diagnostic in the synthetic checkout.",
    "scripts/lib/worktree-integration.mjs captures preparation stdout as receipt.release and copies it into the integration decision. scripts/release.mjs already reserves --integration for this internal call and validates its pending receipt.",
    "The executor stopped the second gate after 630.9 seconds; no passing gate row was recorded. The original integration assertions are retained unchanged."
  ],
  "rationale": "The declared writing moment is the author's preparation command. Integration consumes an outcome receipt rather than asking an author to write release notes, so adding editorial advice there changes a durable record unrelated to the requested guidance.",
  "rejected": [
    { "option": "NoOp or broaden the expected integration line to admit guidance", "reason": "That would keep an unintended change to the integration record and admit filesystem diagnostics into committed evidence." },
    { "option": "Parse the new advice out in the integration consumer", "reason": "The existing internal flag already identifies the receipt-producing call; conditional output avoids coupling the consumer to editorial wording." }
  ],
  "reopenWhen": "Integration gains an explicit interactive release-note writing step or preparation adopts a separate structured result channel."
}
```

## WO-191-D008

```json
{
  "id": "WO-191-D008",
  "date": "2026-10-11",
  "dispatch": "resume: next; review-gate repair",
  "decision": "Name the synthetic reader helper scripts/test-reader-fixture.mjs to follow the repository's test-source convention, and update the planning fixture's exact start-result keys for the new readerScores advisory. Preserve the configuration-root checker and the existing 1 KB failure-block limit.",
  "evidence": [
    "The third full review run passed worktree-integration and the repaired publication suites, then failed configuration-root because the synthetic helper's old scripts/fixtures/reader-profiles.mjs name classified it as control-plane source with literal document roots.",
    "The same run passed 85 plan-refutation tests and failed one exact-key assertion: the intended readerScores property appears between failures and conditions. That fixture predates this advisory.",
    "The executor stopped the third review attempt after 1715.3 seconds, including shared-host queue time; no passing full-gate row was recorded. The runner-fixtures and vertical suites were interrupted, not diagnosed as failures.",
    "The planning fixture now also asserts that absent reader profiles yield an unavailable advisory and readerDue false, outside the unchanged bounded failures block."
  ],
  "rationale": "The helper is test data rather than a second configuration owner. Using the existing test-file naming convention keeps the production-source check intact. The planning output deliberately adds a separate block, so its exact-key fixture must describe that output while retaining the old failure-size assertion.",
  "rejected": [
    { "option": "NoOp or add a new checker exception for the helper directory", "reason": "The repository already has a test-source convention; one matching filename avoids a broader exemption." },
    { "option": "Fold reader figures into the failures block", "reason": "The order explicitly places them outside that block and preserves its 1 KB limit." }
  ],
  "reopenWhen": "The test-source convention changes or plan start adopts a different structured advisory channel."
}
```

## WO-191-D009

```json
{
  "id": "WO-191-D009",
  "date": "2026-10-11",
  "dispatch": "resume: next; review-gate repair",
  "decision": "Give both new reader document-suite rows concrete protection descriptions, retaining the runner's existing assertion against generic coverage claims. Rerun the final review with fresh execution after the complete runner suite passes.",
  "evidence": [
    "The fourth review attempt passed plan-refutation, configuration-root, worktree-integration and the publication suites, but runner-fixtures reported two failed tests. The executor stopped the attempt after 799.3 seconds; vertical was interrupted and no passing gate row was recorded.",
    "A bounded reproduction of the two named tests reproduced the protection-description assertion at scripts/test-runner.test.mjs:985 for reader-profiles. Both new reader rows inherited the generic fallback; each now describes the behavior it protects.",
    "The other reported failure, the WO-198 unreadable-shared-tag fixture, passed unchanged in that isolated reproduction. Its assertion diagnostic was outside the host output's retained window, so its cause is unknown; no product cause or repair is claimed.",
    "After adding the descriptions, node scripts/test-runner.mjs --only runner-fixtures passed the complete suite in 79.14 seconds, including the unchanged shared-tag test. The final full review uses --again to execute that check in the full run rather than compose its passing single-suite row."
  ],
  "rationale": "A suite's coverage description is required runner metadata and should say what the new checks establish. An isolated and complete-suite pass do not explain the earlier shared-tag failure, so keep that observation explicit and obtain another full-run result without inventing a cause or weakening its assertions.",
  "rejected": [
    { "option": "NoOp on the generic protection descriptions", "reason": "The existing runner assertion deterministically rejects them." },
    { "option": "Change the shared-tag assertion or infer a tag-reading defect from the test name", "reason": "The named test passes unchanged and no failing assertion diagnostic establishes such a defect." }
  ],
  "reopenWhen": "The shared-tag fixture fails again; retain its complete output and diagnose that concrete assertion before choosing a repair."
}
```

## WO-191-D010

```json
{
  "id": "WO-191-D010",
  "date": "2026-10-11",
  "dispatch": "resume: verify",
  "decision": "Board VER-001 F1 as a follow-up. The document check `node scripts/reader.mjs check`, now a `npm run test:docs` row, re-reads every recorded score's annotated tag object through `git cat-file tag`. When a scored release's tag object is missing from the local object store, the gate fails with a raw Git error that names no release or remedy. A tag can be deleted and pruned, or a clone can be made with `--no-tags` or a shallow history. No acceptance criterion is broken: the gate passes in this worktree, where all ten baseline tags exist, and main had no such row.",
  "evidence": [
    "docs/evidence/WO-191/verification-001/transcript.txt F1: in a scratch clone of the subject, reader check exits 0, still exits 0 after `git tag -d v0.69.1`, and exits 1 with `fatal: git cat-file cdf18c11f9d2f648611b62388c80c602bbdd6877: bad file` after `git reflog expire --expire=now --all` and `git gc --prune=now`",
    "scripts/lib/reader-profiles.mjs readScores calls readPublication(root, row.release, row.tagObject) and taggedProfile(root, row.tagObject) for every score row; readPublication runs `git cat-file tag` through runGit, which throws on a missing object",
    "scripts/test-runner.mjs: the reader-profiles row runs `scripts/reader.mjs check` with document: true; readerScoresAtStart catches the same error and reports the figures as unavailable"
  ],
  "rejected": [
    {
      "option": "Fail criterion 5 or 9",
      "reason": "Both criteria hold on executed evidence in a repository that has its release tags; the failure needs a missing tag object, which the criteria do not cover."
    },
    {
      "option": "Repair the reader during verification",
      "reason": "The verifier does not edit the implementation it judges; the next repair or a later order that edits scripts/lib/reader-profiles.mjs owns the fix."
    }
  ],
  "followup": "The next WO-191 repair, or the next order that edits scripts/lib/reader-profiles.mjs. Rule a repair must hold: a score row whose tag object is absent locally must not fail `npm run test:docs` with a raw Git error. The check either reports the row as unverifiable, naming its release, tag object and the fetch that restores it, or fails with that named diagnostic by explicit decision. A row whose present tag object disagrees with its recorded text hash, profile or quotation positions is still refused. Check: a fixture that scores a release, deletes and prunes its tag object, then runs `reader check`. Priority: low.",
  "reopenWhen": "A contributor's clone, an integration checkout or a release flow runs `npm run test:docs` without every scored release's tag object, or a scored release tag is deleted or re-cut."
}
```

## WO-191-D011

```json
{
  "id": "WO-191-D011",
  "date": "2026-10-11",
  "dispatch": "resume: verify",
  "decision": "Board VER-001 F2 as a follow-up. `npm run reader -- score --record <file>` refuses a result whose answer entry is not an object, such as `answers: [null, null, null, null]`, with a raw `Cannot read properties of null (reading 'question')` TypeError. The message does not name the release or the expected answer shape. Nothing is appended, so no score is corrupted and no criterion is broken.",
  "evidence": [
    "docs/evidence/WO-191/verification-001/transcript.txt, line `F2: null answer entries => REFUSED: Cannot read properties of null (reading 'question')`, followed by a valid record appending one row and an identical repeat appending none",
    "scripts/lib/reader-profiles.mjs recordScores: `new Set(result.answers.map((answer) => answer.question))` dereferences each entry before scoredAnswer validates it"
  ],
  "rejected": [
    {
      "option": "Fail criterion 5",
      "reason": "Criterion 5 asks for a named refusal of a quotation that is not in the text, and that holds. This input is refused before any append; only the diagnostic is unclear."
    }
  ],
  "followup": "The next WO-191 repair, or the next order that edits scripts/lib/reader-profiles.mjs. Rule a repair must hold: a malformed reader result, including a non-object answer or release entry, is refused before any append with a `Reader profiles:` message naming the release and the expected `{question, quote}` shape. Check: extend the malformed-result fixture in scripts/test-reader.mjs with a null answer entry. Priority: low.",
  "reopenWhen": "A fresh reader returns a malformed answer entry during a planning-pass score run, or the score result schema changes."
}
```

## WO-191-D012

<!-- integration refs/dotln/checkpoint/WO-191/6 -->

```json
{
  "id": "WO-191-D012",
  "date": "2026-10-11",
  "dispatch": "resume: final review; worktree integrate WO-191",
  "decision": "Integrate main into the WO-191 worktree at final review. After git fetch, origin/main, local main and the branch base all name b7741e38d68ac659921db757ac19054f84743495, the base the executor built on and VER-001 judged, so the helper checkpointed the work as refs/dotln/checkpoint/WO-191/6, kept the named stash 6dec5abe6a354987f19d15239c349c22bdb2f114, fast-forwarded nothing, re-applied the stash and regenerated the runtime, the harness bundle and manifest, the control projection, the release preparation, the decisions index, the follow-up register, meta, the work-order index, the publication locks and the selected console fixtures. No authored conflict. Regeneration changed only this record's stub, the meter snapshot docs/evidence/WO-191/meta.json, the meter block of docs/final-reviews/WO-191/PR.md and this record's decisions-index row; every judged byte is unchanged, and the code identity read before and after integration, aea7bae9685587ee34e6c3ddd256222d42f252ac5efed2e6e008b2bf68c0a90b, is the identity VER-001 judged and the executor's review row carries. Component check: upstream carries skeleton 0.57.1 and this order advances it to 0.57.2 with the console pin and the lockfile; no upstream commit consumed 0.57.2, so there is no collision, and the application target v0.74.2 stays the next patch above the observed v0.74.1. The evidence editions this order minted (authority, artifact-identity, verification and feedback at WO-191 revision 001) remain the selected ones. Carried-forward claims: criteria 1 to 9 at the integrated subject, which is byte-identical in every judged file to the subject VER-001 judged; they were re-derived here by the printed affected checks (npm run publication:check, node scripts/harness.mjs check and npm run release -- check-surfaces --local, each passing) and by the two gates recorded in FINAL-001.",
  "evidence": [
    "refs/dotln/checkpoint/WO-191/6 (2b2a5407eb85de4aa158e6b51744c07927b805d2); docs/control/local/integration.json: before b7741e38d68ac659921db757ac19054f84743495, upstream b7741e38d68ac659921db757ac19054f84743495, authored [], resolved [], untrackedConflicts [], complete true",
    "git fetch origin main before the helper ran: origin/main, main and HEAD all at b7741e38; git ls-remote --tags origin shows v0.74.1 as the newest tag, equal to the local tag list",
    "git diff refs/dotln/checkpoint/WO-191/6 --stat after regeneration: docs/evidence/WO-191/decisions.md, docs/evidence/WO-191/meta.json, docs/final-reviews/WO-191/PR.md and docs/lineage/decisions-index.md, beside the verifier's untracked files the checkpoint recorded",
    "gateCodeIdentity(root) before integration and after regeneration: aea7bae9685587ee34e6c3ddd256222d42f252ac5efed2e6e008b2bf68c0a90b, the identity on VER-001 and on the executor's npm test -- --review row recorded 2026-10-11T16:42:50.176Z",
    "release preparation: WO-191 target v0.74.2 remains current. Files changed: docs/evidence/WO-191/meta.json, docs/final-reviews/WO-191/PR.md. Meter snapshot: docs/evidence/WO-191/meta.json, 4073 bytes. Tag observation: local snapshot only."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Skip the integration because main had not moved",
      "reason": "The reviewer procedure integrates unconditionally and records the bookkeeping; the helper's own fetch is the evidence that main had not moved, and its regeneration shows the generated projections are current at the integrated tree."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification. The release target or the skeleton version collides again before publication."
}
```

Integration date: 2026-10-11. Original base: `b7741e38d68ac659921db757ac19054f84743495`.
Fetched main: `b7741e38d68ac659921db757ac19054f84743495`. Checkpoint: `refs/dotln/checkpoint/WO-191/6`.
Named stash retained: `6dec5abe6a354987f19d15239c349c22bdb2f114` (WO-191 integrate 2026-10-11).
Resolved projections: none.
Release preparation: WO-191 target v0.74.2 remains current. Files changed: docs/evidence/WO-191/meta.json, docs/final-reviews/WO-191/PR.md. Meter snapshot: docs/evidence/WO-191/meta.json, 4073 bytes. Tag observation: local snapshot only.
Carried-forward claims: criteria 1 to 9 at the integrated subject, byte-identical in every judged file to the subject VER-001 judged; the code identity `aea7bae9…` is unchanged.
Authored conflicts observed: none.
Affected checks: `npm run publication:check`, `node scripts/harness.mjs check` and `npm run release -- check-surfaces --local` passed at the integrated tree; `npm run test:docs` passed 34 of 34 and `npm test -- --review` composed 39 passing suites at the unchanged identity, both recorded in FINAL-001.

## WO-191-D013

```json
{
  "id": "WO-191-D013",
  "date": "2026-10-11",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Pass final review of WO-191 at the integrated subject with no source change. The three examples per surface were presented to the operator in FINAL-001 and in the review response: the title and commit-subject variants in full, the body, release-note and Release-page variants by their preview command, paths and sizes. No operator choice was recorded during execution, verification or this review, so the committed profile stays balanced on all five surfaces, as the order's fallback directs, and the examples stay for a later planning-pass edit previewed first. The two verifier boards, D010 and D011, stay boarded: both sit in the score path, break no criterion and no behavior main had, and a reviewer writes no behavioral fix. Receipt 038's known issues on criteria 5 and 6 and receipt 043's on criteria 4 and 5 are carried unchanged: none of their reopening conditions can be observed before the order lands (an operator correction on a profiled surface, two scoring runs followed by no profile change, reader runs that change no profile), and the one condition that can be checked now, a guidance line or example asking for a form WO-188's body-profile check refuses, was probed by VER-001 over all nine body, note and page variants and found nothing. One observation for planning, not a defect of this order: this review's fresh npm run test:docs row took 1,465.8 s of wall-clock for 223.3 s of summed task work. The format preflight's recorded duration is 6.6 s while its row spans 17:23:15 to 17:46:03, the other 33 tasks ran between 17:46:03 and 17:47:41, and the row's critical path attributes 1,465.6 s to work and 22 ms to waiting, so the runner's own accounting does not say where the time went. The cause is unknown. The executor's handoff records shared-host queue time on its own gate attempts and three sibling worktrees hold integration stashes from the previous day, so a shared-host wait is a candidate, not a finding. The gate passed every suite, and no criterion or receipt condition of this order names a document-gate duration.",
  "evidence": [
    "node scripts/reader.mjs preview prTitle|commitSubject at the integrated tree: the three variants and their positions, quoted in FINAL-001 §The examples, presented",
    "docs/control/reader-profiles.json: every surface balanced; docs/control/orders/WO-191.jsonl holds no operator choice event; D001 records that none was recorded during execution",
    "docs/evidence/WO-191/verification-001/transcript.txt: the body-profile probe over the nine prBody, releaseNotes and releasePage variants reports no githubBodyProfileFailures and no relativeLinkFailures",
    "npm run test:docs row recorded 2026-10-11T17:47:41.090Z at code identity aea7bae9685587ee34e6c3ddd256222d42f252ac5efed2e6e008b2bf68c0a90b: durationMs 1465836, 34 fresh suites, exit 0; format startedAt 2026-10-11T17:23:15.283Z, finishedAt 2026-10-11T17:46:03.776Z, durationMs 6600; sum of case durations 223276 ms; criticalPath workMs 1465587, waitMs 22; VER-001's row at the same identity took 187.88 s and the executor's 97.6 s",
    "npm test -- --review row recorded 2026-10-11T17:49:23.834Z: composed, 39 passed, 6497 ms, 1 fresh task, 90 reused from the executor's row of 2026-10-11T16:42:50.176Z"
  ],
  "rejected": [
    {
      "option": "Choose a profile for the operator from the examples",
      "reason": "The order places the choice with the operator and names balanced as the fallback when none is recorded; a reviewer's taste is not the operator's."
    },
    {
      "option": "Run the fresh reader again at final review",
      "reason": "Operator-review assumption 3 and the planner sentence place scoring with planning after a profile change or at the operator's word; this review changed no profile."
    },
    {
      "option": "Fail or hold the review on the document gate's wall-clock",
      "reason": "The gate passed every suite; the figure is one row with an unknown cause, and nothing in this order's criteria or receipts names a document-gate duration."
    },
    {
      "option": "Repair D010 or D011 in review",
      "reason": "Both are behavioral changes to scripts/lib/reader-profiles.mjs that would need a fresh independent verification, and neither breaks a criterion."
    }
  ],
  "followup": "Planning, low priority: at the next pass, compare this review's fresh document-gate row (1,465.8 s of wall-clock for 223.3 s of task work, recorded 2026-10-11T17:47:41.090Z at code identity aea7bae9…) with the thirty-day median of fresh passing document rows that ER4-005 (FUP-fb8cbeabbddef397) judges, and read the format preflight's start-to-finish span against the runner's critical-path accounting, which attributed that span to work rather than waiting. Rule a repair must hold: a gate row whose task span exceeds its recorded task duration says where the time went, or the critical path reports it as waiting. Check: a runner fixture whose preflight waits on a held host lane records the wait as waiting.",
  "reopenWhen": "The operator records a profile choice or a style correction on a profiled surface; a fresh document gate in this repository again runs longer than 600 s with summed task work under a quarter of its wall-clock; or a scoring run is recorded with no decision citing it."
}
```

The traps that would have changed this review were carrying VER-001's pass across the integration without reading the integrated bytes, choosing a profile the operator had not chosen, spending a fresh 24-minute review gate at an identity whose 91 tasks already passed, and treating one slow document gate as a defect of the reader. The NoOp would leave the order unreviewed, the examples unpresented and the balanced fallback unrecorded as the operator's standing choice.
