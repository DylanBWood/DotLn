# WO-231 decisions

## WO-231-D001 — describe the same base at review and publication

```json
{
  "id": "WO-231-D001",
  "date": "2026-10-25",
  "dispatch": "resume: next",
  "decision": "Move the existing merge-base choice into target-base.mjs with an injected Git reader and no publication imports. Review supplies the existing remote-tracking ref; publication supplies the fetched object after its existing ancestry check and fetch. Keep every recorded activation base and gate binding unchanged. Prefix all three commit-lint refusal paths with the count, described base, subject, activation base when different, and offending commit.",
  "evidence": [
    "The bounded pre-change fixture probe in README.md and controls.json refused final-review-result pass with exit 1 on a 90-character merged subject: 3 commits from activation versus 1 from the merge base.",
    "The cited fork's WO-013 FINAL-002 finding F1, read in its launchpad worktree, records 17 commits from activation versus 1 from the merge base, with the 16 merged commits including 78- and 90-character subjects; the order's own subject is 61 characters.",
    "reviewedTargetSubject binds subject.baseCommit to state.baseCommit; the original lint read that range. describedTargetBase already selected the merge base when activation was its ancestor and otherwise retained activation.",
    "The target-commit-lint module deliberately avoids the publication runtime; target-base.mjs has no imports. The publication diff changes only the helper import and delegation."
  ],
  "rejected": [
    {"option": "NoOp", "reason": "The measured refusal blocks a valid review because of already-merged target history."},
    {"option": "Copy the base-selection rule into the lint", "reason": "The incident was caused by two readers choosing different ranges; sharing the existing choice prevents drift."},
    {"option": "Rebind the activation base or use the subject's parent", "reason": "Activation is the evidence baseline, and a parent comparison drops earlier order commits."},
    {"option": "Raise the subject limit or exempt messages", "reason": "The rules are correct for order commits; only the input range is wrong."}
  ],
  "reopenWhen": "Review and publication disagree on the subject's commit set after the tracking ref is refreshed, or the shared ancestor rule no longer represents the forge's change."
}
```

## WO-231-D002 — keep review local and preserve the conservative fallback

```json
{
  "id": "WO-231-D002",
  "date": "2026-10-25",
  "dispatch": "resume: next",
  "decision": "Read refs/remotes/origin/<baseBranch> without fetching. An absent ref retains the activation range and is named in the refusal. A stale ref can still include merged history; retain that declared limitation, with the explicit range showing which base needs refreshing. Publication keeps its independent fetch and lint. The two original review-lint cases and every publication case remain unedited.",
  "evidence": [
    "The order explicitly excludes a fetch at review and any change to lint rules, targetSubject, targetGate or recorded bases.",
    "fetchRemoteBranch performs effects through a publication lane; reviewedTargetSubject already validates activation ancestry before the review lint runs.",
    "The new paired fixtures take the local fixture origin offline before final-review-result, testing that neither the fetched-ref arm nor the absent-ref fallback requires a remote.",
    "The missing-ref case must still refuse the merged 90-character subject from the 3-commit activation range; the three advanced-base refusal cases judge only the 1-commit described range."
  ],
  "rejected": [
    {"option": "Fetch inside final-review-result", "reason": "This adds a network dependency and effect to a local judgment, outside the order's scope."},
    {"option": "Skip lint when the ref is absent", "reason": "Missing context must retain the previous complete range rather than omit history."},
    {"option": "Change publication tables or closing sentences", "reason": "Publication already uses the correct rule and its output is an explicit compatibility obligation."}
  ],
  "reopenWhen": "A review still refuses a merged commit after a successful fetch, or field evidence shows the retained stale-ref range cannot be diagnosed from the refusal."
}
```

## WO-231-D003

```json
{
  "id": "WO-231-D003",
  "date": "2026-10-25",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.97.1, the next patch above the observed release baseline v0.97.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.97.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "patch classification declared in docs/work-orders/WO-231-final-review-lint-from-the-described-base.md"
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

## WO-231-D004 — extend the existing exact inventory for this order's five cases

```json
{
  "id": "WO-231-D004",
  "date": "2026-10-25",
  "dispatch": "resume: next; complete gate repair",
  "decision": "Add the two new test declarations and their five expanded names to target-worktree-cases.json, and change the runner fixture's exact counts from 67 declarations and 95 names to 69 and 100. Keep its equality, uniqueness, scheduling and deadline assertions. This corrects an omitted test dependency of this order's new cases; no product behavior or acceptance rule changes. Rerun the complete gate after the bounded inventory check passes.",
  "evidence": [
    "The first complete run exited 1 at 2026-10-25T01:43:25.537Z: runner-fixtures failed the inventory assertion, actual 69 versus expected 67, at scripts/test-runner.test.mjs. Its output contains exactly one top-level not-ok case.",
    "That run passed the target-worktree start and publication file tasks and the target-publish suite, but left ten tasks unrun after the inventory failure. gate-runs.json preserves those boundaries.",
    "The inventory test independently collects static declarations and expanded registrations, comparing each with scripts/fixtures/target-worktree-cases.json. The added loops contribute two declarations and five names.",
    "The bounded node --test --test-name-pattern='target-worktree file tasks keep all declared cases' scripts/test-runner.test.mjs reproduction passed 1 test, 0 failures, exit 0 on 2026-10-25T01:44:16.881Z."
  ],
  "rejected": [
    {"option": "Remove the exact-count or snapshot checks", "reason": "The checks correctly found an incomplete inventory; the named cases should be added to the existing contract."},
    {"option": "Treat the passing product tasks as a complete handoff", "reason": "The first complete run failed and skipped required tasks. The executor owes a fresh complete pass."}
  ],
  "reopenWhen": "Another target-worktree case changes the static or expanded inventory, or the complete rerun exposes another mismatch."
}
```

Package component versions stay unchanged: `componentVersionRules` in
`scripts/release.mjs` maps version changes to each `packages/*/src` directory,
and this order changes none. The application patch remains the assigned v0.97.1;
private-package and publication controls remain unchanged.

D004 outcome: the fresh complete run passed at 2026-10-25T02:07:18.989Z,
36 suites and 102 fresh tasks, no failures or unrun tasks, at code identity
`734504dc897e7648c6b214c024892bc2898126f0c5bbc3250c51948ddfd0df60`.
The repaired inventory remained exact, and all prior target publication cases
passed without edits. See [gate-runs.json](gate-runs.json) and
[controls.json](controls.json).

## WO-231-D005 — VER-001 boards a review range a moved tracking ref can empty

```json
{
  "id": "WO-231-D005",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "VER-001 boards planning receipt 055's criterion-4 issue as a reproduced follow-up. With the target clone's refs/remotes/origin/main moved locally onto the subject, final-review-result pass linted 0 commits, appended FinalReviewCompleted and closed the order over an order commit with a 90-character subject; the untouched-ref control refuses that commit. The publish then refused the commit at its lane-fetched lint and opened no pull request, leaving a closed order whose reviewed commit cannot be published without a new commit. No criterion breaks: the objective names the clone's ref as the selector and the order excludes a fetch at review, so any implementation of the specified rule behaves this way, and the publish backstop holds.",
  "evidence": [
    "docs/verifications/WO-231/VER-001.md F2; docs/evidence/WO-231/verification-001-probe.mjs probes B and B-control; docs/evidence/WO-231/verification-001-evidence.json.",
    "scripts/lib/target-commit-lint.mjs resolves refs/remotes/origin/<baseBranch> in the target and passes it to targetBase; a merge base equal to the subject descends from the activation base, so the described range is empty.",
    "scripts/lib/target-publish.mjs describedTargetBase passes fetchRemoteBranch's lane-fetched commit to the same helper; the publish lints changes.commits from that base (probe B: 'outward lint: commit refused: subject.length: 90 of 72 characters', pulls opened 0)."
  ],
  "rejected": [
    {"option": "Route the finding as blocking", "reason": "Criteria 1 to 5 hold; the order's own rule makes the clone's ref the selector and its non-goals exclude a fetch at review, so the change from main's always-activation range is the specified one (WO-226-D021 judged a design-replaced behaviour the same way)."},
    {"option": "Repair the lint in this verification", "reason": "A verifier never edits the implementation it judges; the defect is boarded with its reproduction."}
  ],
  "followup": "The next order that edits scripts/lib/target-commit-lint.mjs or scripts/lib/target-base.mjs. A review range that the clone's tracking ref empties must not pass silently: when the subject is reachable from refs/remotes/origin/<baseBranch>, lint from the activation base instead, and print the linted-range sentence (count, described base, tracking-ref commit, activation base, subject) on a pass as well as on a refusal, so a publish refusal on a commit the review excluded is traceable. Add the moved-ref case and its untouched-ref control to scripts/test-target-worktree-start.mjs.",
  "reopenWhen": "A publish refuses a commit that a passing final review's range excluded, or a writer-observed update of a target clone's refs/remotes/origin/<baseBranch> during an order (receipt 055's condition)."
}
```

## WO-231-D006 — VER-001 boards the unnamed tracking ref and corrects the no-fetch rationale

```json
{
  "id": "WO-231-D006",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "VER-001 boards a follow-up on the refusal's ref diagnostics and records the rationale correction receipt 055 assigned to this order's decisions. The refusal names the count, the described base, the activation base when the two differ, the subject and the offending commit, so criterion 3 holds; it names the tracking ref only when rev-parse fails. When the ref is present but does not advance the described base (stale behind the merged commits, probe A; on unrelated history, probe D), the refusal names neither the ref, its commit nor the remedy, and a ref that resolves to a tree is reported as absent (probe C). Correction: the order's Objective and Design say the reviewer's worktree integrate fetched the clone's base-branch ref. It did not. integrateWorktree requires the launchpad's wo-NNN worktree root and fetches +refs/heads/main:refs/remotes/origin/main there, and fetchRemoteBranch only unbundles objects into the clone. The clone's ref moves at a target close (update-ref), a target planning publication (fetch origin <baseBranch>) or a manual fetch, so it can be stale at review. D002's no-fetch decision stands on its own evidence, and a stale ref falls back to today's range and refusal.",
  "evidence": [
    "docs/verifications/WO-231/VER-001.md F1; docs/evidence/WO-231/verification-001-probe.mjs probes A, C and D; docs/evidence/WO-231/verification-001-evidence.json.",
    "scripts/lib/worktree-integration.mjs integrateWorktree refuses any root but the matching wo-NNN worktree (about line 566) and fetches origin main there (about lines 806 to 813).",
    "scripts/lib/target-worktree-close.mjs moves refs/remotes/origin/<baseBranch> with update-ref (about line 631); scripts/lib/target-planning.mjs runs git fetch --no-tags origin <baseBranch> (about line 240); scripts/lib/github-repository.mjs fetchRemoteBranch runs git bundle unbundle and moves no ref (about lines 264 to 288).",
    "Planning receipt 2026-10-25-planning-880741b26c81a3dd-055, criterion 3, and the WO-231 row of docs/planning/work-order-map.md expected this correction and a refusal naming the ref's commit and the remedy."
  ],
  "rejected": [
    {"option": "Route the finding as blocking", "reason": "Criterion 3 names the count, the described base, the activation clause, the subject and the absent-ref message, and all are present; a stale ref keeps today's conservative refusal."},
    {"option": "Leave the correction in the planning document only", "reason": "Receipt 055 assigned it to this order's decisions, and a later reader of WO-231's evidence would otherwise meet only the Objective's claim."}
  ],
  "followup": "The next order that edits scripts/lib/target-commit-lint.mjs. When refs/remotes/origin/<baseBranch> is present, the refusal names it and the commit it resolved to; when the ref is present but unusable, the refusal says why (not a commit, no merge base with the subject, merge base below the activation base) instead of 'was absent'; and when the described base is the activation base while the ref is present, the refusal names the remedy: fetch <baseBranch> in the target clone and retry. Add the stale-ref, tree-ref and unrelated-ref cases to scripts/test-target-worktree-start.mjs.",
  "reopenWhen": "A target final-review refusal whose named range contains a commit reachable from the remote base branch but not from the clone's refs/remotes/origin/<baseBranch> (receipt 055's condition), or an operator asks which ref a refusal read."
}
```

## WO-231-D007 — integrate main at the activation base with nothing taken in

<!-- integration refs/dotln/checkpoint/WO-231/6 -->

```json
{
  "id": "WO-231-D007",
  "date": "2026-10-25",
  "dispatch": "resume: final review; worktree integrate WO-231",
  "decision": "Integrate main at 522fec0e, the commit the branch already stands on: a no-op merge that took nothing in and met no authored conflict. Every acceptance claim of VER-001 is carried forward unchanged with its original evidence, because the integrated code identity equals the identity the executor handed off and VER-001 judged, and the passing complete review row at that identity is the row the result consumes; no fresh complete run is owed. Component versions and evidence inputs are unchanged, and v0.97.1 remains the current target.",
  "evidence": [
    "refs/dotln/checkpoint/WO-231/6",
    "base 522fec0efea3e841e8b05e3d884084755d0c9bf1",
    "upstream 522fec0efea3e841e8b05e3d884084755d0c9bf1",
    "release preparation: WO-231 target v0.97.1 remains current. Files changed: docs/evidence/WO-231/meta.json. Meter snapshot: docs/evidence/WO-231/meta.json, 4084 bytes. Tag observation: local snapshot only.",
    "gateCodeIdentity read 734504dc897e7648c6b214c024892bc2898126f0c5bbc3250c51948ddfd0df60 at entry, after the integration and after the affected checks: the identity of the complete review row recorded 2026-10-25T02:07:18.989Z (npm test --review, exit 0, 36 required suites, 102 fresh tasks, none unrun or reused, 1,255.725 s) and of VER-001's subject.",
    "Affected checks at the integrated tree, each exit 0 one at a time under node scripts/harness.mjs bounded --: npm run publication:check (255 of 255 headings; both editions current), node scripts/harness.mjs check (35 generated surfaces), npm run release -- check-surfaces --local, npm run meta -- --check (the standing budget advisories, 0 reopen candidates); git diff --check clean and npm run format:check pass before and after the integration.",
    "No path under packages/, package.json or package-lock.json differs from main: compiler 0.31.0, skeleton 0.68.0, console 0.5.0, kernel 0.8.0, beacons 0.1.1 and browser-evidence 0.2.0 stay; the newest tag is v0.97.0 locally and at origin, so v0.97.1 collides with nothing.",
    "Preservation commit d93b72073a34f37a84077169ef873141baad1152, no merge commit, named stash 66a835fe1bdab1a3fc4bc44788a993d33f97a20b retained; intake backup DotLn-wo231-intake-20261025T031237Z.zip (3 files) in the DotLn session scratch."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Run a fresh npm test -- --review after the integration",
      "reason": "The identity, not the dispatch time, says what was tested; it is unchanged, so the executor's passing complete row covers the integrated tree (product 07 §Preflight before the full gate)."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-25. Original base: `522fec0efea3e841e8b05e3d884084755d0c9bf1`.
Fetched main: `522fec0efea3e841e8b05e3d884084755d0c9bf1`. Checkpoint: `refs/dotln/checkpoint/WO-231/6`.
Named stash retained: `66a835fe1bdab1a3fc4bc44788a993d33f97a20b` (WO-231 integrate 2026-10-25).
Resolved projections: none.
Release preparation: WO-231 target v0.97.1 remains current. Files changed: docs/evidence/WO-231/meta.json. Meter snapshot: docs/evidence/WO-231/meta.json, 4084 bytes. Tag observation: local snapshot only.
Carried-forward claims: criteria 1 to 5 as VER-001 judged them, at the unchanged code identity `734504dc…`; FINAL-001 reran the nine review-lint cases (9 of 9, 38.1 s) and VER-001's six probes (25 s) at the integrated tree under the bounded wrapper, with the same outcomes.
Authored conflicts observed: none.
Affected checks: run at the integrated tree, each exit 0 (the evidence list above).

## WO-231-D008 — final review pass at the integrated identity; VER-001's two follow-ups stay boarded and the register rows are disposed

```json
{
  "id": "WO-231-D008",
  "date": "2026-10-25",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes WO-231 at code identity 734504dc897e7648c6b214c024892bc2898126f0c5bbc3250c51948ddfd0df60 with no finding of its own. VER-001's two findings keep their follow-up route: F1 (the refusal names neither the tracking ref, its commit nor the remedy when the ref is present, and reports a ref that peels to no commit as absent) and F2 (a tracking ref moved onto the subject empties the described range, so final-review-result pass records a review over no commit while the publish's lane-fetched lint refuses the commit and opens no pull request). Neither breaks a criterion; F2 is the ordered rule applied to a forged local ref, with the publish as backstop, and F1 is diagnostics. This review does not repair either: a reviewer never writes a behavioral fix and certifies it, a source edit would move the identity and owe a fresh complete run over code no verifier judged, and F2's remedy is a design choice (which fallback an emptied range takes) that deserves its own order and verification. Their register rows FUP-378c5638bf515e52 and FUP-e4fa2bbf7c3968ec are disposed as deferred to the next order that edits scripts/lib/target-commit-lint.mjs or scripts/lib/target-base.mjs, with their decisions' reopening conditions. The two rows the change only matched by path (FUP-1b94e79e02e54e70, the publish refusal for a malformed private list, and FUP-f12aae31bceb9b69, the episode form's described base) stay as they are: this order's edit to scripts/lib/target-publish.mjs is the one-line delegation to targetBase, and neither seam is touched.",
  "evidence": [
    "docs/final-reviews/WO-231/FINAL-001.md: criterion judgments, the executed-check table and the findings block.",
    "docs/evidence/WO-231/verification-001-probe.mjs rerun under node scripts/harness.mjs bounded -- at the integrated tree (exit 0, 25 s): C1 exit 0 with FinalReviewCompleted at the activation base; A refuses without naming the ref or a remedy; B passes the review over 0 commits and the publish refuses 'subject.length: 90 of 72 characters' with 0 pulls opened; B-control refuses the same commit with the range sentence; C says the ref was absent for a ref that peels to a tree; D refuses from the activation base without naming the ref.",
    "node --test --test-name-pattern='target final review' scripts/test-target-worktree-start.mjs under the bounded wrapper: 9 of 9 pass in 38.1 s (the two unchanged cases, the two missingRef arms and the three range-sentence cases, with two further cases whose names carry the phrase).",
    "Product 07 §Independent workflows and integration: 'A reviewer never writes a behavioral fix and certifies it'; §Verification review and attack: a finding outside the criteria that breaks no behavior main had is a follow-up by rule; WO-226-D021 and WO-230-D009 are the precedents for leaving a matched row whose seam the change did not open.",
    "Planning receipt 2026-10-25-planning-880741b26c81a3dd-055: its criterion-3 known issue (the no-fetch rationale and the unnamed remedy) is D006 and F1; its criterion-4 known issue (a locally moved ref shortens the range) is D005 and F2; both reproduced by VER-001, neither changes a judged byte of the order."
  ],
  "rejected": [
    {
      "option": "Repair F1 or F2 in this review within the Boy Scout bound",
      "reason": "Each is a behavioral change to the lint; a reviewer never writes a behavioral fix and certifies it, the identity would move and owe a fresh complete run over unverified code, and F2's fallback is a design choice for its own order."
    },
    {
      "option": "List VER-001's F1 and F2 in this review's findings block as escapes",
      "reason": "The block counts the final review's own findings and its classes measure what escaped verification; both were found and boarded by VER-001, so they are judged in prose under Earlier findings and the block is empty."
    },
    {
      "option": "Route F2 as blocking because main always linted from the activation base",
      "reason": "The order's objective makes the clone's ref the selector and excludes a fetch at review, so the specified rule behaves this way on a forged ref; the publish refuses the commit and opens nothing; routing it blocking would fail five met criteria over a precondition no ordinary flow produces."
    },
    {
      "option": "Resolve the two D005/D006 rows here as settled",
      "reason": "By the operator's 2026-10-17 direction a boarded row is resolved by a work order; a final review may only defer it with its owner and reopening condition."
    }
  ],
  "reopenWhen": "A publish refuses a commit that a passing final review's range excluded; a target final-review refusal whose named range contains a commit reachable from the remote base branch but not from the clone's tracking ref; or an operator asks which ref a refusal read (D005 and D006's conditions)."
}
```
