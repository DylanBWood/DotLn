# WO-176 decisions

## WO-176-D037 — final review: defects in the shipped machinery the amended order does not judge

```json
{
  "id": "WO-176-D037",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-002",
  "kind": "finding",
  "decision": "Pass FINAL-002 on the amended criteria and board what its two read-only reviewers found in the shipped declaration, preservation and record machinery, which D035 removed from the criteria. (a) removePreservedWorktree passes --force to git worktree remove whenever a preserved intake repository unit is untracked. --force also disables Git's refusal for working trees with submodules, so a subject with a populated committed submodule that holds unpushed commits loses them. DotLn tracks no submodule today. (b) A keep declaration does not survive a worktree move: the row binds to sha256(realpath(worktree)), and a keep row from another path falls back to the lane, so a .runtime repository is removed with only its commits bundled. Under D035 that is the wanted result for scratch; it contradicts D030's wording. (c) A local declaration made after the last completion is not read, and nothing says so. (d) A retry refused before the already-published path (gh preflight, runtime build or existing-release checks) is recorded refused with tagOutcome null although the tag and Release exist, which is wider than D034(c). A gh view failure after a completed Release is recorded partially-published, and test-release.sh asserts that label. (e) For a dirty derived worktree, both printed remedies (settle, and close --publish) leave it kept; this is wider than D034(d). (f) A malformed close invocation writes no record. (g) An executor can declare a control-lane repository disposable; only intake is refused.",
  "evidence": [
    "(a) scripts/worktree.mjs removePreservedWorktree; git-worktree documentation: working trees with submodules are removed only with --force; reviewer A's module-level reproduction with an embedded repository and a registered submodule, checked against the source by the reviewer; git ls-files -s shows no 160000 entry in DotLn",
    "(b) Reproduced in this review at module level: a completion row preserve/declared for .runtime/keep becomes disposable/lane after git worktree move, and the dry-run reconciliation bundles it and removes it with the worktree. Reviewer B's release-fixture probe, run in this review: close exit 0, record cleanup clean with .runtime/keep disposable/lane, the uncommitted file absent from the retained lane. scripts/lib/worktree-material.mjs:92 and :202-205",
    "(c) scripts/lib/worktree-material.mjs committedMaterial reads only the last committed completion event; reviewer B's probe 4",
    "(d) Reviewer B's release-fixture probe, run in this review: after a full publication, a retry with gh authentication failing recorded outcome refused, tagOutcome null, release null, while origin held the annotated tag and the Release body existed. scripts/release.mjs close catch block; scripts/test-release.sh createrecovery assertions",
    "(e) scripts/worktree.mjs reconcileDerivedWorktrees kept line; scripts/release.mjs finishPublishedWorktree settle blocker; reviewer B's probe 3",
    "(f) Reviewer B's probe, run in this review: close --material scratch-material/x=keep exits 1 and leaves the record bytes unchanged; parseMaterialFlags runs before the record is built",
    "(g) scripts/lib/worktree-material.mjs declareMaterial refuses only the intake lane; reviewer A's probe"
  ],
  "rationale": "D035 judges the order on deleting scratch repositories, and every item here concerns machinery outside that judgment. Only (a) can remove material that is not scratch, and it needs a committed submodule DotLn does not have. Seeking the wrong goal: holding the order for these items would repeat FINAL-001's mistake of judging preservation the operator does not want. NoOp leaves them unowned.",
  "rejected": [
    {"option": "Fail FINAL-002 on (a) or (b)", "reason": "(b) is the operator's wanted outcome for scratch; (a) cannot occur in DotLn without a committed submodule, and the amended criteria do not judge the forced-removal path."},
    {"option": "Repair in the review session", "reason": "A reviewer does not write and certify a behavioral fix."}
  ],
  "followup": "Next order editing removePreservedWorktree in scripts/worktree.mjs or close in scripts/release.mjs, or the D035 simplification, whichever comes first (priority medium for (a), low otherwise). Refuse --force when the subject holds a gitlink, or check submodules before forcing, with a fixture holding a submodule commit. If the D035 simplification removes declarations and keep rows, drop (b), (c) and (g) with them; otherwise make a keep row from another path undeclared, and report an unfiled local declaration at close. Record a retry against a published tag as already published whatever refuses it, and a completed Release as published; correct the createrecovery assertion. Give a dirty derived worktree a remedy that settles it. Write a record for a refused malformed close.",
  "reopenWhen": "A repository that is not scratch is removed by a close, a planning pass counts a published release as refused or partial, or the next order edits these seams."
}
```

## WO-176-D036 — correction: the review role judged scratch deletion as data loss

```json
{
  "id": "WO-176-D036",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-002",
  "misread": "FINAL-001, in this role, judged the removal of a scratch repository that gained a commit after completion as data loss. It failed the order on it (D022) and made Receipt 036's bundle duty required (D024). The planner's order had called such removal 'never'. FINAL-002 began by treating a keep-declared .runtime repository removed after a worktree move as the same class of failure.",
  "meant": "A scratch repository built only to test, verify or help build is always to be removed, and its contents never matter (D035). Removing one is what this order is for.",
  "changed": "FINAL-001 and D022 stay as filed. FINAL-002 judges the amended criteria and does not fail the order because scratch contents were removed. It records the keep-after-move behavior in D037 (b) as consistent with the operator's rule, though not with D030's wording.",
  "decision": "Judge scratch-repository removal by the operator's stated goal, not by the planner's preservation rule.",
  "evidence": ["WO-176-D035", "docs/final-reviews/WO-176/FINAL-001.md, Finding F1", "WO-176-D022, D024, D030"],
  "rejected": [{"option": "Edit FINAL-001", "reason": "A filed report's bytes are bound by its control event; a correction is recorded instead."}],
  "reopenWhen": "A final review fails or holds an order because a scratch repository's contents were removed."
}
```

## WO-176-D035 — operator amendment: judge the order on deleting scratch repositories

```json
{
  "id": "WO-176-D035",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-002; operator messages during the review",
  "kind": "operator-amendment",
  "decision": "Authorization. During FINAL-002 the operator stated, across several messages (paraphrased here): a scratch repository built only to test, verify or help build is to be removed in every case, and its contents never matter; this order was only supposed to remove such repositories; one still present at release close is a stopgap, because the executor or the final review should already have removed it; and the planner should have worked this out. The operator then directed the reviewer to update the order to do only that, with only the criteria for it, and to judge it on that basis. Bounded scope: the Objective and acceptance criteria are rewritten to two criteria. (1) Release close removes a worktree holding a nested repository with commits under a scratch lane, with no declaration or flag; WO-117's shape is the named case, with a failing baseline on b51a58a8. (2) The review and document gates, the diff check and no new dependency. The original six criteria are superseded. No source changes: the declaration command, material rows, --material flag, release-close.json and recovery bundles ship as implemented and verified, without being this order's criteria. The order text carries the amendment and is bound with npm run plan -- amend-order WO-176 WO-176-D035.",
  "evidence": [
    "Operator messages in the FINAL-002 session, 2026-10-01, 14:56Z to 15:03Z",
    "docs/work-orders/WO-176-release-close-finishes-on-the-handoff.md, Operator scope amendment — 2026-10-01",
    "The WO-117 close's own Codex session log of 2026-09-29 (local only): its single blocker was a nested repository with content inside .runtime/wo117-walkthrough/, classified other lane",
    "docs/product/07-execution-guide.md (the WO-139 execution-amendment route)"
  ],
  "rejected": [
    {"option": "Judge the original six criteria", "reason": "They judge declaration, preservation and record machinery the operator says this order was never for. Two final reviews were spent on them."},
    {"option": "Route a repair that strips the extra machinery", "reason": "It costs another fix, verification and review cycle, and the operator directed judging the order on its purpose. Whether to remove the machinery is the follow-up's choice."}
  ],
  "followup": "Planner (priority high): define which nested repositories are scratch, meaning built only to test, verify or help build; the operator left that boundary to the planner. Make the executor remove its scratch repositories before implementation-ready and repair-complete, and the final reviewer remove any that remain before publication. Make release close remove any scratch repository still present without blocking, declaring or preserving it, so that its cleanup is only a backstop. Reproduce with a scratch repository outside the current scratch lanes and with a stale keep declaration, and assert removal with no flag.",
  "reopenWhen": "A release close stops at or preserves a scratch repository, or an executor or final review hands off a worktree that still holds one.",
  "goalAlignment": "Mission: the operator's time, through closes that finish. Seeking the wrong goal and rule beating: the original criteria rewarded preserving scratch material, the opposite of the operator's goal; the amended criterion judges the outcome the operator asked for. Shifting the burden: the follow-up moves removal to the executor and the reviewer, who create and see these repositories. Drift and escalation: no further cycles are spent hardening preservation. Policy resistance: the change uses the existing amendment route. Commons: no source change and no new gate. Success to the successful: the shipped machinery is not credited as the order's purpose. Naive Interventionism: the reviewer changes no source. NoOp would fail or re-judge the order on criteria the operator rejected."
}
```

## WO-176-D034 — verification: close-word, record-accuracy and hardening defects boarded

```json
{
  "id": "WO-176-D034",
  "date": "2026-10-01",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Pass VER-002 on criteria 3 and 4 and board six minor defects outside them. (a) A scoped --material word whose worktree is named through a symlinked alias matches no worktree and is dropped without notice, so an intended preserve on a lane-disposable repository becomes removal (with its bundle). (b) Two words for the same repository are both accepted, and the last one wins: an unscoped word plus a scoped word for the subject, or /wt and /wt/. (c) After a tag push whose Release failed, a retry that fails the gh preflight is recorded refused with tagOutcome null although origin holds the tag. (d) Finish and settle blockers caused by undeclared material carry the bare close --publish command, which stays blocked; the settle reason is cut to its first line. The material blockers carry the working command, so the record has no loop. (e) The recovery step runs git update-ref inside the nested repository, which executes that repository's reference-transaction hook during the close. (f) A lane repository holding an entry the state walk cannot read, such as a FIFO, blocks every close; no --material word settles it. The verifier leaves the implementation unchanged.",
  "evidence": [
    "(a) VER-002 probe2.mjs case 3, session scratch, 2026-10-01: a realpath-scoped preserve word gives preserve/declared; the same word through a symlinked alias gives disposable/lane. Reviewer A (p4-scope-alias.mjs) and reviewer B (a non-canonical /var path, which kept the subject because its repository was undeclared) agree. Cause: inventoryMaterial compares resolve(row.worktree) with realpathSync(root) (scripts/lib/worktree-material.mjs:155-169). The printed commands use Git's resolved worktree paths, and git 2.55.0 reports them resolved, so the printed retries work.",
    "(b) scripts/lib/worktree-material.mjs:300-303 compares the scope before it is resolved, so an unscoped word never conflicts with a scoped one; inventoryMaterial keys words by path, last wins (:161-169). Reviewer B reproduced scratch/x=preserve with <subject>::scratch/x=disposable giving disposable/declared. The bundle keeps commits but not uncommitted files.",
    "(c) scripts/release.mjs:2008-2015: ensureGhPreflight and ensureReleaseRuntime run before tagOutcome is set to already-published, and the close's catch labels such an attempt refused. Reviewer B reproduced it with DOTLN_FIXTURE_GH_FAIL=create then DOTLN_FIXTURE_GH_FAIL=auth: outcome refused, tagOutcome null, remote tag type tag.",
    "(d) scripts/release.mjs:1646-1648 and 1702-1709 name node <main>/scripts/release.mjs close WO-NNN --publish for finish and settle blockers; scripts/test-release.sh material case shows a bare retry staying blocked. Reviewer B, reading the source.",
    "(e) VER-002 probe2.mjs case 4: a reference-transaction hook in .runtime/x wrote its marker during reconcileWorktreeMaterial; reviewer A's p5 shows the same. scripts/lib/worktree-material.mjs:428-442 runs update-ref create and delete in the nested repository.",
    "(f) Reviewer A, p5-liveness.mjs: a FIFO in .runtime/x makes materialState null; the dry run throws 'Repository material changed or cannot be inspected; source retained'; a preserve word refuses a non-regular file and a disposable word re-verifies the null state. Not reproduced by the verifier; consistent with scripts/lib/worktree-material.mjs:66 and 346-355."
  ],
  "rationale": "Mission: every close leaves a record a planning pass can count, and the operator's word at close time is the only remedy for unknown material, so that word must take effect or say why not. Shifting the burden: (a) and (b) let an operator's word be lost or overridden silently; (d) and (f) name remedies that cannot work. Rule beating: the fixtures assert canonical paths and single words. Escalation and commons: each fix sits inside an existing seam, with no new gate or phase. Naive Interventionism: the verifier records and does not repair. None fails a criterion: criterion 3's flag cases and criterion 4's fields hold in the fresh gate, and each defect fails safe or concerns accuracy. NoOp leaves them without an owner.",
  "rejected": [
    {"option": "Fail VER-002 on these items", "reason": "Each lies outside what criteria 3 and 4 declare and judge; a defect outside the declared criteria is boarded with its reproduction, not failed."},
    {"option": "Repair the implementation in the verifier session", "reason": "An independent verifier preserves the judged subject."}
  ],
  "followup": "Next order editing parseMaterialFlags or inventoryMaterial in scripts/lib/worktree-material.mjs, or finishPublishedWorktree or close in scripts/release.mjs (priority low). Refuse, before cleanup, a --material word that resolves to no inventoried worktree and path, compare scopes after realpath, and refuse two words for the same resolved worktree and path. Record a retry after a pushed tag as partially or already published even when gh preflight fails. Give finish and settle blockers caused by material the material command, and keep the full settle reason. Run nested-repository Git commands with hooks disabled. Give a lane repository whose state cannot be read a settling command or name it as an operator-terminal case. Reproduce with an aliased scoped word, conflicting words, create-then-auth gh failures, a hook marker and a FIFO.",
  "reopenWhen": "An operator's close-time word is dropped or overridden at a real close, a planning pass counts a published tag as refused, a nested repository hook runs during a close, or the next order edits these seams."
}
```

## WO-176-D033 — verification: nested object stores escape the state binding and the recovery bundle

```json
{
  "id": "WO-176-D033",
  "date": "2026-10-01",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Pass VER-002 on criteria 1 and 3 and board a recoverability defect, with a narrow data-loss case, outside them. materialState and recoverDisposableRepositories read only the top-level repository's own refs, objects, index and working files. The close deletes every Git object store beneath a removed path. (1) A submodule's store under .git/modules is not in the state, so a commit made inside the submodule after an explicit disposable declaration, then reset away, leaves the state unchanged. The declaration still applies, and the close removes the repository with a commit no bundle holds. (2) The recovery bundle omits repositories nested inside a disposable repository, submodule stores, and bare repositories under a lane (Git lists those as files, so they are never inventoried). It also omits a lane repository created between finish's inventory and its writer lock (module-level; reachability inferred). D026 and D032 say every disposable repository's stored commits are retained; that holds for the top-level repository only. The criteria hold: the removed repository carries an applicable lane classification or executor declaration, which criteria 1 and 3 require to be removed. FINAL-001 F1's undeclared case now blocks. The verifier leaves the implementation unchanged.",
  "evidence": [
    "VER-002 probe2.mjs case 1, session scratch, 2026-10-01: scratch/r with a submodule, declared disposable. After a commit in the submodule the state changes (its new working file); after reset --hard HEAD~1 the state equals the declared one, and the close-time row is disposable/declared. reconcileWorktreeMaterial bundles scratch/r, and the late submodule commit is absent from the bundle ('could not get object info'). Reviewer A's p1b-submodule-content.mjs shows the same and that git worktree remove then deletes it.",
    "VER-002 probe2.mjs case 2: .runtime/x holding an inner repository is inventoried as one disposable/lane row; recovery bundles .runtime/x with one commit and omits the inner commit. Reviewer A's p2-inner-bare.mjs adds the declared scratch/r/inner case and a bare .runtime/bare.git that is never inventoried.",
    "Reviewer A's p6-late-lane-repo.mjs, module-level: a lane repository absent from finish's material is judged fresh by ensureNoIgnoredMaterial and removed without a bundle; scripts/worktree.mjs computes mergedMaterial before refreshHarnessRuntime and the writer lock. Reviewer B reached the same inference from the source.",
    "scripts/lib/worktree-material.mjs:45-99 (state walk skips the top-level .git; refs, objects and index come from the top-level repository) and :360-482 (one bundle per disposable row from that repository's objects)",
    "VER-002 probe.mjs cases A–E reproduce the repaired behavior these gaps sit beside: F1's drift, dirt after a declaration, foreign derived repositories, unreachable top-level commits recovered, and state drift after inventory refused"
  ],
  "rationale": "Mission: a scratch word that turns out wrong should cost a lookup, not lost work (Receipt 036). Seeking the wrong goal and rule beating: the fixtures hold single-level repositories, so a recovery claim for every stored commit is broader than its evidence. Shifting the burden: an operator cannot know that a submodule or inner repository escaped the bundle. Drift: the state binding is the mechanism F1's repair rests on, so its coverage must match what removal deletes. Escalation and commons: fingerprint and bundle every object store under a removed path, or block when one is found; no new phase. Naive Interventionism: the verifier records and does not repair. NoOp leaves a narrow irreversible path and an overstated decision without an owner.",
  "rejected": [
    {"option": "Fail VER-002 on this defect", "reason": "Criteria 1 and 3 require a lane-disposable or declared-disposable repository to be removed, and these repositories carry that classification or declaration. Receipt 036's bundle duty is outside the order's criteria (FINAL-001 D024). A defect outside the declared criteria is boarded with its reproduction, not failed."},
    {"option": "Repair the implementation in the verifier session", "reason": "An independent verifier preserves the judged subject."}
  ],
  "followup": "Next order editing materialState or recoverDisposableRepositories in scripts/lib/worktree-material.mjs, or worktree finish's inventory in scripts/worktree.mjs (priority medium; recoverability, narrow data-loss case). Make the state cover every Git directory and object store the removal deletes (.git/modules/**, inner .git directories, bare repositories), or require a fresh word for a repository that holds one. Bundle or retain every such store before removal. Inventory inside the writer lock, or block on a nested repository missing from the material rows. Correct D026's and D032's 'every disposable repository' claim in that order's decisions. Reproduce with a declared submodule commit-then-reset, an inner repository under .runtime, a bare .runtime/*.git and a repository created after inventory, and assert retention or a cloneable bundle for each.",
  "reopenWhen": "A removed nested, submodule or bare repository's commits are needed and absent from the retained lane, a close removes a repository whose submodule changed after its declaration, or the next order edits the state or recovery helpers."
}
```

## WO-176-D032 — repair outcomes and recovery-duty disposition

```json
{
  "id": "WO-176-D032",
  "date": "2026-10-01",
  "dispatch": "resume: fix; bounded adjacent repair handoff",
  "decision": "Close the reproduced disposal class with fresh lane observations and current worktree/state-bound declarations. Discharge Receipt 036's catalog recovery duty by retaining and verifying every disposable repository's stored commits before removal. The bounded adjacent cases are repaired; moved-main retries and concurrent/unbounded history retain D029's named deferred contract.",
  "evidence": [
    "Current npm test -- --review: 39 suites passed, zero failed, 84 fresh tasks, 785.925 seconds, recorded 2026-10-01T13:36:41.443Z; checks.json snapshots the canonical current code identity",
    "Five WO-176 process cases pass: changed/foreign/legacy rows, stale keep, referenced and unreachable bundle commits, corrupt bundle retention, directory lane and linked metadata boundaries, preservation and both actual executor completions",
    "Current release material case passes: commit/dirt and same-path derived repositories stay retained, subject-only words cannot govern derivatives, combined scoped retries preserve both blockers, record failures retain the true publication result, and post-removal clones recover lane/disposable commits",
    "Current surfaceclose, lower and createrecovery cases assert refusal, no-release and partial-publication values; current worktree and derived cases pass",
    "docs/planning/work-order-map.md WO-176 row and Receipt 036 criterion:3 require recoverability; release-close.json recovery rows now name bundles with digests and commit counts",
    "Product 07 cleanup paragraph: 623 to 663 bytes; complete guide 157209 bytes under ceiling 157212; publication check passes",
    "Original filed FINAL-001 report hash still matches its immutable recorded hash; no verdict or report bytes were changed",
    "Current npm run test:docs: 24 suites passed, zero failed, 35.538 seconds, recorded 2026-10-01T13:39:46.069Z; checks.json snapshots the canonical document row"
  ],
  "disposition": "D019, D020, D022 and D024 are settled by this repair's source and fixtures. D023(a–g,i) are repaired. D023(h,j) are carried by FUP-da471832071118c7; the older aggregate follow-up is linked to that remaining contract. Document checks and repair-complete remain required before handoff.",
  "rejected": [
    {
      "option": "Treat a lane observation as frozen disposal authority",
      "reason": "A later commit or file changes the repository the close must judge."
    },
    {
      "option": "Verify a bundle only against its source",
      "reason": "The soon-to-be-removed source could satisfy prerequisites; the empty-repository import proves independent recovery."
    },
    {
      "option": "Claim every release retry and attempt-history property repaired",
      "reason": "The bounded fixtures do not establish moved-main historical validation or serialized archived storage; D029 retains their owner and reopening conditions."
    }
  ],
  "goalAlignment": "Observed outcome supports reliable, recoverable closeout without a new phase, dependency, agent or completion refusal. Fresh state and surviving commits address drift, rule beating and the wrong goal; scoped executable remedies address policy resistance and shifting the burden. Existing suites and one writer bound commons and escalation costs. Current source is compared against reproduced failures rather than favored by investment. Naive Interventionism retains immutable tags, source retention and the existing byte, symlink, dirt and ownership checks. NoOp would retain the reproduced deletion and leave Receipt 036 undischarged. The stopped 434-second preparation run is retained as cost, not counted as a passing gate; D002's kept-current economy choice is reused without a second experiment.",
  "reopenWhen": "A changed or foreign repository receives stale disposal authority, a removed commit cannot be restored from its recorded bundle, a bounded retry or record path changes publication, or a deferred D029 condition occurs."
}
```

## WO-176-D031 — correction: check the close record after a close

```json
{
  "id": "WO-176-D031",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: fix; review gate preparation",
  "misread": "I inserted the refusal-record assertions after the first matching surface-failure call, inside the check-surfaces-only fixture.",
  "meant": "Only release close writes release-close.json; check-surfaces does not create one.",
  "changed": "Move the assertions into release_case_surfaceclose, after the actual failed close. Stop the review gate before editing and rerun the affected fixtures and complete review.",
  "decision": "Exercise the retained record through the command that owns it, without adding record writes to a surface check.",
  "evidence": ["2026-10-01 review: release:case:surfaces failed ENOENT reading release-close.json; release:case:surfaceclose passed", "Checked both fixture bodies and scripts/release.mjs close record ownership", "Canonical evidence --stop ended run 110aeeb9-910d-4cbb-b447-d0812a4c3e5d after 434 seconds; no gate check recorded"],
  "rejected": [{"option": "Create a record in check-surfaces", "reason": "Would change the product to satisfy a misplaced test."}],
  "reopenWhen": "A record assertion runs without invoking the owning command."
}
```

## WO-176-D029 — deferred release retry and history contract

```json
{
  "id": "WO-176-D029",
  "date": "2026-10-01",
  "dispatch": "resume: fix; bounded adjacent dispositions",
  "decision": "Defer the moved-main retry and concurrent/unbounded close history to the next order owning immutable-release recovery and retained attempt storage. The material state, scoped remedies, recovery bundles and nonfatal record I/O are repaired here.",
  "evidence": [
    "FINAL-001 D023(h): after origin/main moves, ensureExistingRelease still requires the existing tag target to equal current main; the printed retry refuses before cleanup",
    "scripts/release.mjs ensureExistingRelease: weakening the equality without separately validating the historical manifest could accept an unrelated tag",
    "FINAL-001 D023(j) and scripts/release.mjs: previousAttempts retains full history without a lock or limit; concurrent loss is inferred, not reproduced",
    "WO-176-D009 intentionally preserves earlier attempts; truncating the array without an archive would discard recorded outcomes"
  ],
  "rejected": [
    {"option": "Relax tag equality in this material repair", "reason": "Requires a historical-manifest and ancestry contract, with its own positive and negative fixtures; the existing refusal preserves the worktree."},
    {"option": "Trim previousAttempts", "reason": "Would discard evidence, not fix its storage contract."},
    {"option": "No recorded route", "reason": "Would leave operator-facing retry and history limits only in an old report."}
  ],
  "followup": "Next order editing scripts/release.mjs ensureExistingRelease or retained close history (priority medium): reproduce publication with material blocking cleanup, then move origin/main with an unrelated commit and prove a retry validates the immutable original tag/manifest and settles material without republishing. Cover a foreign tag refusal. Archive prior attempts without dropping their bytes and serialize overlapping record updates; use a concurrent fixture to establish no attempt is lost. Update the record consumer and retry command together.",
  "goalAlignment": "Mission: reliable retries and honest retained outcomes. Policy resistance and Naive Interventionism preserve strict immutable publication validation until its historical subject is defined. Commons, escalation and success to the successful favor one separately bounded contract rather than a speculative relaxation. Drift and rule beating require a moved-main and concurrent fixture. Shifting the burden and seeking the wrong goal require a durable owner rather than falsely claiming every retry now succeeds. NoOp on source retains the safe refusal and complete history; the named follow-up removes the unowned obligation.",
  "reopenWhen": "The next release-recovery order edits these seams, a real retry meets moved main, history storage becomes a measured bottleneck, or overlapping closes lose an attempt."
}
```

## WO-176-D030 — stale preservation cannot downgrade to deletion

```json
{
  "id": "WO-176-D030",
  "date": "2026-10-01",
  "dispatch": "resume: fix; source review",
  "decision": "A same-worktree keep declaration whose state changed becomes undeclared, even in a scratch lane. An unbound legacy keep declaration is also conservative. A new scoped operator word settles it. Stale disposal declarations and lane observations retain the fresh lane classification.",
  "evidence": ["Source review: blindly falling back to a disposable lane after a keep declaration changes would delete newly added work that was intended for preservation", "The material regression adds a working file to a declared-preserve repository under .runtime and requires undeclared disposition"],
  "rejected": [{"option": "Automatically dispose of the changed kept repository by lane", "reason": "A lost applicability proof cannot downgrade preservation authority to deletion."}],
  "goalAlignment": "Fail-conservative material handling preserves work. Rule beating and shifting the burden favor an executable changed-keep case; the existing scoped word handles the rare ambiguity. Other traps have no new process or shared-resource effect: one conditional in the same inventory, no added workflow step or dependency. NoOp would retain the new unsafe downgrade.",
  "reopenWhen": "A stale keep declaration permits deletion, or a foreign worktree is treated as the origin of a bound declaration."
}
```

## WO-176-D027 — bounded adjacent repair

```json
{
  "id": "WO-176-D027",
  "date": "2026-10-01",
  "dispatch": "resume: fix; adjacent-0003 revision 1",
  "decision": "Repair the bounded material remedies and record-accuracy defects in the existing source and fixtures. The operator selected 'Repair the bounded adjacent cases (Recommended)' after the scope announcement. Keep moved-main release validation and concurrent/unbounded attempt history on named follow-ups.",
  "evidence": [
    "FINAL-001 D023(b–g,i), D020: per-path commands omit the other blockers; tag errors are relabelled by a message regex; record reads occur before try and finally writes can replace the result; derived inventory can throw outside its guard; file basename rules dispose repository directories; the dispatch assertion checks only key existence",
    "scripts/lib/paths.mjs ignoredLane has no feedback lane; that mount is disposable only while empty",
    "Focused material tests: four pass; end-to-end material case passes, including post-completion commits/dirt and same-path detached derivatives",
    "Adjacent queue revision 15: current intent, actor-attested async check-in and running adjacent-0003"
  ],
  "chosen": "Aggregate every undeclared unit in a scoped retry; keep record failures advisory; set publication state where the push occurs; contain each derived inventory error; limit automatic repository disposal to explicit directory lanes and empty standalone scaffolding; explain completion-time declarations accurately; test actual dispatch values and refusal/no-release outcomes.",
  "rejected": [
    {"option": "NoOp on the bounded cases", "reason": "Keeps misleading remedies, a bookkeeping publication gate and unsafe repository classification at the seam this repair already owns."},
    {"option": "Redesign immutable release validation or add concurrent history storage", "reason": "Those require a separately judged release/history contract; they are not needed to close the reproduced material deletion class."}
  ],
  "goalAlignment": "Mission: safe closeout and truthful records for later consumers. Policy resistance and shifting the burden favor executable combined remedies and advisory bookkeeping. Rule beating and drift require actual state/value assertions. Commons and escalation favor the existing suites and one queued group. Success to the successful compares existing behavior against the failures, rather than retaining it by investment. Seeking the wrong goal prioritizes safe recovery over deletion counts. Naive Interventionism preserves immutable tags, source preservation, writer/gate locks and file-lane behavior; only repository-directory defaults narrow.",
  "reopenWhen": "A combined scoped retry cannot settle its named material, a record failure changes publication, or a repository becomes disposable solely because of its filename or external linked-worktree metadata."
}
```

## WO-176-D028 — correction: regression comments describe behavior

```json
{
  "id": "WO-176-D028",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: fix; operator correction",
  "misread": "I put review-local finding identifiers in the release regression comment and referred to 'the report' in the uncommitted-file regression comment. D016 also calls the verifier mount a disposable feedback lane.",
  "meant": "Tests and source comments must explain the enduring behavior without requiring this order's review. The verifier mount has no feedback lane; its empty standalone repository classification supplies disposal.",
  "changed": "Replace the regression comments with the state-change and cross-worktree invariant, and explain the mount's empty-repository classification. Keep finding provenance in this order's evidence.",
  "decision": "State behavior directly in maintained code and preserve review provenance on the evidence surface.",
  "evidence": ["Operator's correction in this repair session", "Checked scripts/test-release.sh and scripts/test-process-debt.mjs comments", "scripts/lib/paths.mjs ignoredLane and describeIgnoredMaterial"],
  "rejected": [{"option": "Explain the finding identifiers in the code comment", "reason": "Still makes a future maintainer depend on this review rather than understand the test."}],
  "reopenWhen": "A maintained test or source comment needs this order's report to explain its behavior."
}
```

## WO-176-D026 — repair the applicability of recorded material

```json
{
  "id": "WO-176-D026",
  "date": "2026-10-01",
  "dispatch": "resume: fix; FINAL-001 F1, D019, D022 and D024",
  "decision": "Recompute lane dispositions at close. Bind an explicit declaration to a digest of its originating worktree and repository state; a stale or legacy unbound declaration falls back to the current lane. Scope close-time words to one worktree. Before deleting a disposable repository, retain and verify a self-contained bundle of its commits, including unreachable commits, or retain the worktree if recovery cannot be proved.",
  "evidence": [
    "FINAL-001 F1 and D022: an empty other-lane repository gains a commit after completion and is deleted by the replayed lane row",
    "D019 and D023(a): subject declarations are applied by path to detached derived worktrees",
    "scripts/lib/worktree-material.mjs inventoryMaterial: explicit rows replace current classification without an applicability check",
    "scripts/worktree.mjs finish and reconcileDerivedWorktrees: the same committed rows feed each worktree",
    "Receipt 036 criterion:3 and docs/planning/work-order-map.md WO-176 row require recoverability before disposal",
    "WO-176-D002: keep the current shared fixture setup; no second economy experiment"
  ],
  "alternatives": ["Fresh lane classification plus state-bound declarations and verified recovery", "Replay only declared rows without state or worktree binding", "NoOp", "Refuse completion on unknown material"],
  "rejected": [
    {"option": "Replay only declared rows without binding", "reason": "Leaves a stale declaration and the same-path derived-worktree deletion class open."},
    {"option": "NoOp", "reason": "Leaves a reproduced deletion of undeclared commits and the catalog recovery duty unfulfilled."},
    {"option": "Refuse completion", "reason": "The order explicitly records unknown material without adding a completion gate."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Risk reduction for dependable source-to-deliverable closeout; a mistaken scratch word must not destroy saved commits. No direct always-on runtime advance is claimed.",
    "policyResistance": "Completion still records unknown material; cleanup retains it and publication remains independent.",
    "tragedyOfTheCommons": "One writer, existing fixtures and the required review gate; no added dependency or agent.",
    "driftToLowPerformance": "Test mutations after completion and cross-worktree declarations, beyond the fixed-state cases that passed.",
    "escalation": "An applicability check and recovery before the existing removal, without a new lifecycle phase.",
    "successToTheSuccessful": "Keep committed declarations for their explicit authority; lane observations have no authority to freeze future state.",
    "shiftingTheBurden": "Machinery detects drift and retains recovery, instead of requiring operator rescue.",
    "ruleBeating": "Assert surviving commits and cloneable bundles, not only disposition labels.",
    "seekingTheWrongGoal": "Safe, recoverable closeout takes priority over increasing the count of removed worktrees.",
    "naiveInterventionism": "Retain byte, collision, symlink, tracked-dirt and writer/gate guards. A failed snapshot or bundle cannot authorize removal. Use disposable local fixtures as the probe."
  },
  "reopenWhen": "A state change or a different worktree receives a recorded disposable declaration, or a removed commit cannot be recovered from its recorded bundle."
}
```

## WO-176-D001

```json
{
  "id": "WO-176-D001",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Implement the declared/lane material handoff and ignored close record. Reuse the existing preservation byte proof and publication checks, without a completion refusal for undeclared repositories.",
  "evidence": [
    "WO-176 objective, design and criteria 1–6",
    "scripts/lib/paths.mjs: classifyIgnoredMaterial marks .runtime disposable while describeIgnoredMaterial overrides every content repository to non-disposable",
    "scripts/lib/intake-reconciliation.mjs: directory-unit inventory and exclusive collision-preserving copies already verify bytes",
    "scripts/lib/lifecycle-evidence.mjs and scripts/resume.mjs: both executor completions already persist the returned evidence object",
    "scripts/release.mjs: finish/settle advisories currently leave no common outcome record",
    "docs/product/07-execution-guide.md §Goal-aligned decisions"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Keeps the observed scratch-repository blocker and leaves later planning unable to explain a close outcome." },
    { "option": "Refuse an executor completion with undeclared material", "reason": "Adds the gate step WO-176 explicitly declines; the completion records knowledge and the close judges deletion." },
    { "option": "Delete undeclared repositories or move them by session judgment", "reason": "Unknown provenance needs the operator's declaration, not a guessed disposition." },
    { "option": "Commit a new close event", "reason": "Close does not push main; an ignored retained record is the selected consumable interface." }
  ],
  "lenses": {
    "policyResistance": "The executor records undeclared material without blocking; teardown still refuses its deletion.",
    "commons": "Reuse two fixture suites and one preservation helper; no extra agent, gate or dependency.",
    "drift": "Require actual removal, preserved repository contents and retry publication counts in fixtures.",
    "escalation": "One declaration command and a close-time flag replace terminal rescue; no additional workflow phase.",
    "successToSuccessful": "Existing preservation wins on its checked collision/byte behavior, rather than investment alone.",
    "shiftingBurden": "The recorded handoff settles known scratch; the rare unknown repository receives an exact remedy.",
    "ruleBeating": "Read material from committed completion evidence on main; do not rely on session memory or an uncommitted subject declaration at close.",
    "wrongGoal": "Risk reduction for dependable source-to-deliverable flow and fewer unfinished closes; no direct always-on runtime advance claimed.",
    "naiveInterventionism": "Preserve intake, collisions, unsafe-symlink refusals and writer/gate checks. Add disposition selection before the existing guarded teardown, using disposable fixture repositories as the smallest probe."
  },
  "reopenWhen": "A declared repository is lost, a disposable lane still blocks, an uncommitted declaration controls close, or the outcome record cannot explain publication and cleanup independently."
}
```

## WO-176-D002

```json
{
  "id": "WO-176-D002",
  "date": "2026-09-30",
  "dispatch": "resume: next; equipped Tinkerer — Economy",
  "kind": "experiment",
  "decision": "Keep the existing fixture setup; decline a separate optimization experiment and extend the required lifecycle and release cases.",
  "question": "Can the current shared fixture setup cover the new close cases without a separate harness?",
  "alternatives": ["Extend the existing fixture setup", "Create a separate setup and compare its cost"],
  "observation": "scripts/test-process-debt.mjs already exposes nested-repository and lifecycle evidence fixtures; scripts/test-release.sh already creates linked worktrees and counts local stub publication calls.",
  "budget": { "wallSeconds": 300 },
  "execution": "declined",
  "reason": "Source inspection establishes the reusable setup. A separate timing trial would duplicate mandatory behavioral checks before a bottleneck is demonstrated.",
  "cost": { "wallSeconds": 0, "tokens": null, "commands": ["Source inspection of the existing fixtures; no separate experiment executed"], "source": "Actor-attested zero experiment runtime; preparation was not separately timed." },
  "effect": { "wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["Required fixture and review gates retained"], "summary": "No measured saving or adopted optimization claimed." },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": { "lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null },
  "evidence": ["scripts/test-process-debt.mjs WO-044 and WO-173 cases", "scripts/test-release.sh make_repo, commit_candidate, release_case_success"],
  "rejected": [{ "option": "A separate fixture harness", "reason": "The existing setup already supplies the required repository units, linked worktrees and publication counters." }],
  "reopenWhen": "Required checks establish a repeatable setup bottleneck with an equivalent-output improvement."
}
```

## WO-176-D003

```json
{
  "id": "WO-176-D003",
  "date": "2026-10-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.59.1, the next patch above the observed release baseline v0.59.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.59.0 (local tags)",
    "patch classification declared in docs/work-orders/WO-176-release-close-finishes-on-the-handoff.md"
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

## WO-176-D004

```json
{
  "id": "WO-176-D004",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Use one shared material helper for local declarations, completion inventories, committed handoff reads and quoted remedy commands. Close previews select origin/main's committed rows without moving main. Keep protected intake non-disposable even when a declaration says otherwise, and preserve re-included intake repository directories under the actual ignore policy.",
  "evidence": [
    "scripts/resume.mjs already records the returned evidence for ImplementationReady and RepairCompleted; it remains read-only in this order",
    "scripts/lib/control-store.mjs reads committed control blobs and eventsForOrder selects the order's segment",
    "A disposable system-temp probe using the project's .gitignore reports docs/intake/x/ as untracked and no ignored entries",
    "scripts/test-release.sh material case exercises both an older-main preview and actual cleanup of that intake unit",
    "scripts/worktree.mjs now holds the subject writer-reservation lock, checks its writer/gate state and clean tracked bytes, then verifies preservation before removal"
  ],
  "rationale": "The committed handoff is an interface a later session can consume. Existing ignored-file behavior and preservation byte proofs stay useful. Git requires --force only for the precisely inventoried untracked intake units after they have been copied and proven; ordinary untracked work, unsafe symlinks, foreign writers and active gates still retain the source. This removes the documented lane mismatch without weakening the Clean Room floor.",
  "rejected": [
    { "option": "Read the subject's current local declaration at close", "reason": "Would let an unfiled later word override the reviewed handoff; the release fixture proves it stays blocked." },
    { "option": "Change the repository's ignore policy or temporarily edit Git excludes", "reason": "Would change input/tool settings and hide work; inventory the protected units instead." },
    { "option": "Always use Git's force option", "reason": "Unknown and ordinary untracked material must remain protected." },
    { "option": "Add material-specific events or modify resume.mjs", "reason": "The two existing evidence objects already provide the additive field." }
  ],
  "reopenWhen": "A preview consumes the wrong committed revision, a local word changes cleanup, protected intake becomes disposable, or unpreserved bytes can reach the guarded removal."
}
```

## WO-176-D005

```json
{
  "id": "WO-176-D005",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "The first release fixture rewrote an already committed ImplementationReady row to attach material, and expected ensureGitHubRelease to return a URL. The first intake fixture also assumed the project's directory-negating ignore rules hid the repository unit.",
  "meant": "Control history is append-only; the helper returns created/existing; the real intake rules leave the repository directory untracked even though its content is private.",
  "changed": "Attach fixture material when the initial completion row is created, assert the actual publication outcome, and exercise real-policy intake created after the reviewed gate. Keep the initial failed fixture runs as failed preparation rather than product evidence.",
  "decision": "Correct fixture setup and assertions from the checked implementation, without rewriting historical project events or broadening the product gate.",
  "evidence": [
    "First material fixture: control log is not append-only refusal",
    "Second material fixture: actual release value created, expected URL assertion failure",
    "Real-policy intake fixture: gateTreeHash reports Unsupported candidate tree entry",
    "scripts/release.mjs ensureGitHubRelease and packages/skeleton/src/gate-evidence.mjs"
  ],
  "rejected": [{ "option": "Relax the append-only check or assert a fabricated URL", "reason": "The fixture must respect the same contracts the real close consumes." }],
  "reopenWhen": "Fixture history edits or fabricated publication fields reappear."
}
```

## WO-176-D006

```json
{
  "id": "WO-176-D006",
  "date": "2026-10-01",
  "dispatch": "resume: next; adjacent defect diagnosis",
  "decision": "Board the pre-existing file-only gate-tree failure for a protected intake repository present during a gate. WO-176 handles its cleanup when local material is created after the reviewed gate; it does not change the gate's source inventory contract.",
  "evidence": [
    "System-temp probe with the actual .gitignore: docs/intake/x/ is an untracked repository entry",
    "Material shell fixture with that repository before commit_candidate: gateTreeHash refuses Unsupported candidate tree entry",
    "packages/skeleton/src/gate-evidence.mjs gateTreeHash requires each candidate entry to be a regular file or symlink",
    "WO-176 names gate changes outside its subject files and requires no judged feedback source change/no live episode"
  ],
  "rationale": "The cleanup criterion can be proved without widening the gate. Repairing the gate requires a separately judged protected-material tree rule and its registered evidence/live feedback cost; hiding the directory in the fixture would conceal the limitation. NoOp preserves the strict code gate until that bounded repair is assigned.",
  "rejected": [
    { "option": "Change gate-evidence.mjs in this order", "reason": "Outside the named source seam and the no-live-episode scope; it changes a judged feedback source." },
    { "option": "Drop arbitrary untracked directories from gate evidence", "reason": "Could conceal source bytes and recreate the existing untracked-source identity gap." }
  ],
  "followup": "Next order editing packages/skeleton/src/gate-evidence.mjs: define the candidate-tree treatment of a protected intake repository directory re-included by .gitignore. Reproduce with a one-commit nested repository at docs/intake/x before npm test/completion, retain ordinary untracked source coverage, then exercise the gate and completion with the real ignore policy. Priority: low; this does not block cleanup of post-gate material.",
  "reopenWhen": "A protected intake repository is needed during a gate or completion, or the next order edits gateTreeHash."
}
```

## WO-176-D007

```json
{
  "id": "WO-176-D007",
  "date": "2026-10-01",
  "dispatch": "resume: next; write-backs and follow-up routing",
  "decision": "Retarget the two named register rows for this implementation: the ignored close record is supplied here, WO-178 retains its counting/admission work, and the withdrawn-order route remains deferred until a withdrawn order actually exists on a branch. Leave the six unrelated textual matches on their existing routes.",
  "evidence": [
    "Canonical control state and Git branch inventory: withdrawnOnBranch is empty",
    "FUP-ecf9d3b703a0b7d9 currently allocated to WO-176 and WO-178",
    "FUP-3a0c4ea52f8d6d08 latest disposition already defers until an actual withdrawn branch needs the route",
    "Followups --touching returns eight pending matches: FUP-5474f89208c6bb9f, FUP-b7a66e7a4fa7ad20, FUP-3a0c4ea52f8d6d08, FUP-4475529d727a4d25, FUP-8cfd3ff52146a016, FUP-e2cf2122a642d1e0, FUP-e55e258d37cb3f20, FUP-dc1335f4d10f6a75",
    "Product cleanup paragraph changes by 365 added bytes; publication check required a deterministic software-engineer source-lock refresh and then passed"
  ],
  "rejected": [
    { "option": "Build the withdrawn-order route without an observed branch", "reason": "Explicit non-goal and no consumer for it at this cutoff." },
    { "option": "Treat every textual match as a fix assignment", "reason": "The discovery-sandbox, release preparation/listing, corpus entry guards, register matching and integration-overlay seams remain outside this close/material change." },
    { "option": "Claim the real harness publish fixture is supplied", "reason": "FUP-8cfd3ff52146a016 is still the explicit non-goal; the shell fixture uses its existing adapter." }
  ],
  "reopenWhen": "WO-176 closes without its record, WO-178 needs a different record contract, a withdrawn branch needs cleanup, or an existing unrelated row's own condition occurs."
}
```

## WO-176-D008

```json
{
  "id": "WO-176-D008",
  "date": "2026-10-01",
  "dispatch": "resume: next; evidence and release preparation",
  "decision": "Select WO-176 revision 001 for the three deterministic evidence editions and regenerate/check the harness. Retain the current live feedback edition because the judged feedback source and policy are unchanged. Keep every component version: only workflow scripts and product documentation change.",
  "evidence": [
    "authority, artifact-identity and verification --check all reproduced the previous editions; --write recorded the new immutable editions",
    "docs/evidence/WO-176/remint-cost.json: 20.217 s orchestration wall including the selection correction; no live episode or console re-pin needed",
    "feedback-evidence --check: current WO-059 feedback-002 judged the current source, ten passing regressions and ten removal failures",
    "git diff: no packages/*/src, component manifest, root package.json or package-lock.json changes",
    "release prepare --local assigned v0.59.1 above local v0.59.0"
  ],
  "rationale": "The order explicitly calls for deterministic provenance refresh for paths.mjs. Earlier outputs still reproduce, so no behavior change is claimed by re-minting them. The measured group includes the harness and three deterministic editions; a live audit and re-pin are zero operations, not fabricated timings. Publication controls and dependency pins stay in force.",
  "rejected": [
    { "option": "Bump an unchanged component", "reason": "Workflow scripts do not alter a component's src; the release surface rules require bumps only for changed components." },
    { "option": "Run a new live feedback worker", "reason": "The judged feedback sources did not change and the existing edition's check passes; WO-176 explicitly excludes a live row." },
    { "option": "Assume every edition CLI accepts --edition/--revision", "reason": "Only authority exposes those flags here; artifact-identity's attempted command exited 2 without writing. Their canonical selections were then updated and the documented single-mode commands succeeded." }
  ],
  "reopenWhen": "A judged feedback source changes, a component src changes, a deterministic edition fails its current check, or integration consumes the staged patch version."
}
```

## WO-176-D009

```json
{
  "id": "WO-176-D009",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Keep earlier close attempts inside previousAttempts in the one ignored release-close.json record; the top-level fields describe the latest attempt. Preserve unreadable prior bytes as an explicitly unreadable history row rather than deleting evidence or adding a bookkeeping refusal.",
  "evidence": [
    "WO-176 objective: every close leaves a record so later planning can count stopped closes and explain why",
    "The material fixture performs a preview, a published-but-blocked close, a still-blocked retry, then a successful flag retry",
    "Overwriting only the latest fields would lose those earlier outcomes"
  ],
  "rejected": [
    { "option": "Replace the earlier outcome without history", "reason": "A clean retry would erase the stopped-close observation the planning consumer needs." },
    { "option": "Create a new committed event or a second log", "reason": "The selected contract is one ignored retained record and close does not push main." }
  ],
  "reopenWhen": "The history becomes an observed storage bottleneck or a retry loses the outcome it superseded."
}
```

## WO-176-D010

```json
{
  "id": "WO-176-D010",
  "date": "2026-10-01",
  "dispatch": "resume: next; required check registration",
  "decision": "Register the new shared material module in process-debt's declared machinery inputs, and stage it before the product gate. This is the bounded input registration the new fixture requires; it does not change gate selection or reuse policy.",
  "evidence": [
    "uncoveredMachinerySources against current suites reports exactly process-debt / scripts/lib/worktree-material.mjs",
    "scripts/test-process-debt.mjs directly imports the new module",
    "FUP-7629e03c6573f5cb's interim rule: stage new source before a gate so gateCodeIdentity includes its bytes"
  ],
  "rejected": [
    { "option": "Leave the module out of the declaration or suppress the coverage failure", "reason": "Would omit a suite-read input and fail the order's required review check." },
    { "option": "Repair the general untracked-source reuse lookup", "reason": "That existing follow-up remains outside this order; staging discharges the interim rule without claiming the broader repair." }
  ],
  "reopenWhen": "The new module imports another uncovered direct entry input or a gate identity misses an added source file."
}
```

## WO-176-D011

```json
{
  "id": "WO-176-D011",
  "date": "2026-10-01",
  "dispatch": "resume: next; source review during required gate",
  "kind": "correction",
  "misread": "The first close record selected only Codex and Copilot environment session IDs, so a known Claude environment session would be recorded null.",
  "meant": "The repository already recognizes CLAUDE_CODE_SESSION_ID and CLAUDE_SESSION_ID as session identity inputs; criterion 4 requires the known dispatch session.",
  "changed": "Stopped this session's first review gate before editing. Added both existing Claude inputs and release-preview assertions covering each spelling with Claude's selected-effort readback. The stopped run is preparation, not passing evidence; the replacement review result is recorded at handoff.",
  "decision": "Use the four existing harness session variables for the ignored close record, with unknown still null when none is supplied.",
  "evidence": [
    "scripts/lib/off-ramps.mjs SESSION_VARIABLES and scripts/lib/harness-prune.mjs pruneContext",
    "gate-stop-v1 run 25891b67-2ca6-440c-aca8-4228713a5657: stopped, active [], no check recorded; first attempt elapsed 235.5 s",
    "scripts/test-release.sh material lane and preserve previews assert known Claude harness, session and source"
  ],
  "rejected": [{ "option": "Infer a Claude session from its selected effort", "reason": "An effort is not an identity; retain the actual existing environment value when supplied." }],
  "reopenWhen": "A supported harness supplies a known session through a different documented repository input or a fixture records the wrong actor."
}
```

## WO-176-D012

```json
{
  "id": "WO-176-D012",
  "date": "2026-10-01",
  "dispatch": "resume: next; progress diagnosis",
  "kind": "correction",
  "misread": "The repeated last-report line for harness case 87 was described in chat as a stalled run.",
  "meant": "That output is the latest delivered case report, not a measurement of all fixture activity. Later fixture directories were being created while the printed line stayed unchanged.",
  "changed": "Corrected the chat claim from checked filesystem activity and allowed the run to continue. The harness suite then passed in 337.79 seconds; no harness source change was needed.",
  "decision": "Use observed task activity or a completed result to judge progress; do not infer a stall from an unchanged progress label alone.",
  "evidence": [
    "The current suite created later planning/grant fixture directories while last-report still named case 87",
    "The review runner delivered PASS harness-fixtures 337.79 s"
  ],
  "rejected": [{ "option": "Change a harness case based on the progress label", "reason": "No failing case or stopped activity supported such a change." }],
  "reopenWhen": "A completed failure or checked lack of task activity identifies an actual fixture defect."
}
```

## WO-176-D013

```json
{
  "id": "WO-176-D013",
  "date": "2026-10-01",
  "dispatch": "resume: next; operator continue; adjacent-0002",
  "decision": "Repair the stale Node-only staged-build fixture in the already selected process-debt test file: copy browser-evidence and assert its publication stages alongside the existing four workspaces. Keep the build, component sources and dependency pins unchanged.",
  "evidence": [
    "The broad review run delivered one process-debt failure: Node-only staged builds keep installed hooks executable throughout publication; both WO-176 cases passed",
    "Focused reproduction failed TS6053 because the staged browser-evidence/tsconfig.json was absent",
    "Root tsconfig.json references browser-evidence, but that fixture's copy and stage assertion still named only four earlier workspaces",
    "The original broad run no longer has an active marker or an outcome/check row at the continuation boundary; no full passing result is claimed for it",
    "Adjacent queue revision 6 records the bounded intent, actor-attested steering check and running item"
  ],
  "rationale": "The concrete repair is two fixture lists in a named subject file, with the same staged compilation and immutable-hook observations. It is within Adjacent Repair and is necessary for the required review gate. A previous origin alone is not a reason to defer it.",
  "rejected": [
    { "option": "Remove the browser-evidence root build reference or weaken the assertion", "reason": "Would hide a real workspace and stop testing the current build graph." },
    { "option": "Defer the known failing fixture and report the required review green", "reason": "No passing row exists and criterion 6 requires a successful complete review check." }
  ],
  "reopenWhen": "The workspace set changes again or the focused staged-build test fails after the fixture has the complete build graph."
}
```

## WO-176-D014

```json
{
  "id": "WO-176-D014",
  "date": "2026-10-01",
  "dispatch": "resume: next; required review correction",
  "kind": "correction",
  "misread": "The compatibility fixtures were left expecting the earlier manual-move/forced-teardown wording and the release-case inventory before the new material case.",
  "meant": "The order replaces the repository remedy with executable declaration/retry commands and adds a registered release case; the tests must assert that behavior while retaining their deletion, content-leak, writer and gate protections.",
  "changed": "Update scripts/test-worktree.sh to assert the new remedies and distinguish an empty-repository disposal preview from a blocker. Add material to the exact inventory in scripts/test-release-fixtures.mjs; its three focused tests pass.",
  "decision": "Repair the directly affected compatibility assertions without weakening cleanup guards or dropping a suite.",
  "evidence": [
    "Completed review at code identity 0f1436da897826546254b46a61184797d2e1c1ffda1c69129d400a5d6d3621f4: 35 passed, 4 failed, 909.40 s, 84 fresh tasks",
    "Worktree fixture stops at the older refusal wording after its publication checks pass",
    "Runner fixture expected inventory ends at concurrent, while releaseCases includes the new material case",
    "node --test scripts/test-release-fixtures.mjs: 3 passed, 0 failed"
  ],
  "rejected": [{ "option": "Restore manual moves and force advice to satisfy old strings", "reason": "Would defeat the declared handoff and guarded retry behavior the order requires." }],
  "reopenWhen": "The updated assertions no longer prove retention of undeclared material, or the case inventory omits an actual release case."
}
```

## WO-176-D015

```json
{
  "id": "WO-176-D015",
  "date": "2026-10-01",
  "dispatch": "resume: next; adjacent-0002 revision 2 and browser prerequisite",
  "decision": "Extend the bounded fixture repair to integration's read-only links for the existing playwright/playwright-core dependencies and browser-evidence workspace. Provision the lockfile-pinned Chromium headless shell in the selected checkout's ignored .runtime/playwright cache before retrying the review gate.",
  "evidence": [
    "Completed review's integration failures: TS2307 cannot find playwright in the fixture, followed by type errors from that missing module; fixture links still name only typescript, @types and prettier",
    "Completed browser suite's launch-unavailable result prints the project-local pinned install command",
    "packages/browser-evidence/package.json pins playwright 1.63.0; its README requires installing the headless shell in each fresh checkout",
    "Context7 library resolved /microsoft/playwright/v1.63.0; its official browsers.md documents --only-shell and PLAYWRIGHT_BROWSERS_PATH",
    "https://github.com/microsoft/playwright/blob/v1.63.0/docs/src/browsers.md",
    "Queue revision 8 records the revised two-fixture scope and fresh intent; no build or component source change is selected"
  ],
  "rationale": "The fixture setup predates a committed workspace, and the runtime prerequisite is explicitly documented. Reuse the already installed dependency versions and their current binary pin; no manifest, dependency, host browser setting or general build change is needed. The four failing suites are retained in the required selection.",
  "rejected": [
    { "option": "Exclude browser or integration from the review", "reason": "Would leave criterion 6 without its complete required review result." },
    { "option": "Upgrade Playwright or remove its build reference", "reason": "Would widen into component behavior instead of repairing fixture setup and supplying the existing prerequisite." }
  ],
  "reopenWhen": "A complete fixture still fails compilation, the pinned browser cannot launch after provisioning, or a workspace/dependency pin changes."
}
```

## WO-176-D016

```json
{
  "id": "WO-176-D016",
  "date": "2026-10-01",
  "dispatch": "resume: next; required review correction",
  "kind": "correction",
  "misread": "The compatibility assertion update missed the retained-material preview's old empty-scaffolding label for a repository in the disposable feedback lane.",
  "meant": "The shared material inventory now gives that repository its existing lane's disposable disposition, including when it is empty; the preview must assert the corresponding removal label.",
  "changed": "Update that exact assertion and its explanatory comment in scripts/test-worktree.sh. Run the entire worktree suite in the runner's suiteEnvironment before another full review; retain all preservation, dirt, writer and gate assertions.",
  "decision": "Correct the directly affected fixture label without changing the disposition rule or the teardown guards.",
  "evidence": [
    "Completed review at code identity 887389701c0931c956611fbc98efcb8aad6d5931b25d44825d81f2cb3b311f23: 38 passed, 1 failed, 757.471 seconds, 84 fresh tasks",
    "That review passes process-debt, runner-fixtures, browser-evidence, worktree-integration and release material",
    "Focused diagnostic identifies scripts/test-worktree.sh line 625's old preview-label assertion; fixture cleanup errors occur afterward",
    "scripts/lib/worktree-material.mjs selects the disposable feedback lane; renderIntakeReconciliation prints disposable removal for that row",
    "An earlier diagnostic inherited the host Codex session and stopped at fixture dispatch; it is preparation, not product evidence. The final focused command uses scripts/lib/suite-evidence.mjs suiteEnvironment.",
    "The entire focused worktree script exits 0 and reports worktree tests passed, including its six embedded beacon cases."
  ],
  "rejected": [{ "option": "Keep the obsolete label or drop the preview assertion", "reason": "Would obscure the new lane disposition or remove a concrete cleanup observation." }],
  "reopenWhen": "The complete worktree suite still fails, or a disposable repository is reported or treated as protected material."
}
```

## WO-176-D017

```json
{
  "id": "WO-176-D017",
  "date": "2026-10-01",
  "dispatch": "resume: next; required document check correction",
  "kind": "correction",
  "misread": "The cleanup paragraph's allowance of at most 500 added bytes was treated as sufficient for the whole write-back, without checking the guide's separate existing ceiling.",
  "meant": "The order does not raise that ceiling; both authorized write-backs must fit the guide's existing budget.",
  "changed": "Condense only the cleanup paragraph and release-close table row, preserving the declaration/close commands, source-preservation checks, publication independence and outcome record. The guide is 157197 bytes against its unchanged 157212-byte ceiling; the cleanup paragraph grows from 623 to 651 bytes. Refresh the changed publication source lock and rerun the document gate.",
  "decision": "Keep the existing ceiling and fit the two owned write-backs in place.",
  "evidence": [
    "First document gate: docs-check finds the guide 426 bytes over its ceiling; 14 suites pass and 10 fail or are blocked; the result is not passing evidence",
    "Current guide byte count and Git baseline cleanup paragraph comparison: 28 added bytes in the paragraph, 15 bytes of guide headroom",
    "publication:check identifies the changed source lock as 6f5504d32144e52ab437fbcf84c7676f617f26ace147e6ef4e3b3353740f99fd",
    "The source code identity remains the completed review's 27fe5eae102b4a3698f5372b97da4a176fb7395923edcfc7591a00a376b5255d"
  ],
  "rejected": [
    { "option": "Raise the guide ceiling", "reason": "No planning authority supplies a budget increase, and the same two write-backs fit by editing in place." },
    { "option": "Remove unrelated guidance to create space", "reason": "Would widen the bounded write-back instead of condensing its own text." }
  ],
  "reopenWhen": "The concise row or paragraph obscures an executable route or a preservation duty, or the guide exceeds its existing ceiling again."
}
```

## WO-176-D018

```json
{
  "id": "WO-176-D018",
  "date": "2026-10-01",
  "dispatch": "resume: next; operator continue; executor handoff",
  "decision": "Hand off the complete bounded implementation with all six criteria met, the repaired fixture queue item completed and the separate intake gate defect deferred to its recorded follow-up. Keep real publication, independent verification and final review on their own dispatches.",
  "evidence": [
    "checks.json copies the current canonical passing rows: review 39/39 suites, 760.067 seconds, 84 fresh tasks; documents 24/24 suites, 35.698 seconds",
    "Current code identity 27fe5eae102b4a3698f5372b97da4a176fb7395923edcfc7591a00a376b5255d is unchanged by final report and guide write-backs",
    "fixtures.md covers all six material release modes, actual executor completion commands, preserved repository heads, collisions, quoted flag retries and exactly one publication",
    "Adjacent queue revision 11: adjacent-0002 completed with its three required passing checks; adjacent-0001 deferred to FUP-bf51ac5cd8143d98; no next item",
    "The publication check passes after the source-lock refresh, and the guide has 15 bytes of headroom with its ceiling unchanged",
    "The final harness usage readback provides dispatch token counters through codex-transcript-counter; USD cost remains unavailable. Final counts and cutoff stay in the ignored receipt and response."
  ],
  "lenses": {
    "policyResistance": "The actual completion fixtures record undeclared material without refusing; cleanup retains it until an operator declaration.",
    "commons": "One shared material helper and existing fixtures serve the contract; no additional agent, workflow gate or dependency was added.",
    "drift": "Removal, preserved repository heads, byte/collision checks, current full gate rows and retained close attempts establish the bounded result.",
    "escalation": "The declaration and close flag supply an executable remedy within the existing lifecycle; no new phase was created.",
    "successToSuccessful": "Existing preservation was retained because its behavior passes; stale fixture lists and assertions were repaired from observed failures.",
    "shiftingBurden": "Fixtures prove known scratch cleanup follows the filed handoff, while unknown material has a quoted keep/discard retry. The intake gate limitation remains explicitly assigned.",
    "ruleBeating": "A later unfiled declaration cannot override the committed handoff, and publication retries are counted rather than presumed idempotent.",
    "wrongGoal": "The demonstrated contribution is reduced workflow-close risk and a readable outcome contract. Direct always-on runtime progress and production time savings remain unmeasured.",
    "naiveInterventionism": "Writer/gate, tracked-dirt, intake, symlink and collision protections remain tested. Repairs stayed in the named fixture setup and owned write-backs; the guide ceiling was not raised."
  },
  "rejected": [
    { "option": "NoOp on the observed scratch blocker and missing outcome contract", "reason": "Would retain the nominated gap that the passing fixtures now cover." },
    { "option": "Claim a real post-merge close or advance another role", "reason": "Neither is this executor's observation or dispatch." }
  ],
  "economy": {
    "decisionRef": "WO-176-D002",
    "outcome": "kept-current",
    "summary": "The sole optimization experiment was declined; no measured per-order saving or adopted optimization is claimed.",
    "measuredGateCostSeconds": { "successfulReview": 760.067, "successfulDocuments": 35.698, "completedFailedPreparation": [909.4, 757.471, 21.295] },
    "scope": "Recorded complete gate wall times only; interrupted/unrecorded attempts, source preparation, operator waiting and other work are outside this total. Final token observations stay in the ignored receipt; USD cost remains unavailable."
  },
  "reopenWhen": "Independent verification finds an unmet criterion, a real close contradicts the fixture contract, or the deferred intake gate condition is needed."
}
```

## WO-176-D019

```json
{
  "id": "WO-176-D019",
  "date": "2026-10-01",
  "dispatch": "resume: verify",
  "decision": "Pass VER-001 on criteria 1–6 and board a data-loss-class defect outside them. The subject's committed material rows and the close's --material overrides are keyed by path alone, and settlement applies them to every derived worktree. A nested repository in a derived worktree may never have been inventoried by any completion. If its path matches a subject row declared disposable, it becomes declared-disposable, passes the ignored-material check and is removed with that worktree. The same repository is undeclared by its own inventory. The criteria judge the subject worktree; the verifier leaves the implementation unchanged.",
  "evidence": [
    "scripts/worktree.mjs reconcileDerivedWorktrees: inventoryMaterial(path, { declarations }) receives the subject's rows. finish passes mergedDeclarations (committedMaterial at origin/main plus overrides). settle passes committedMaterial at DOTLN_RELEASE_MATERIAL_REVISION or HEAD, plus overrides.",
    "scripts/lib/worktree-material.mjs inventoryMaterial: an explicit row for the same path replaces the lane disposition and source",
    "scripts/lib/intake-reconciliation.mjs inventory walk: a disposable row is pushed straight into nestedRepositories, and ensureNoIgnoredMaterial treats those entries as reconciled",
    "Independent session-scratch reproduction, 2026-10-01. Separate subject and derived repositories each hold a one-commit nested repository at the ignored other-lane path scratch-material/x, with different bytes. inventoryMaterial(derived) alone reports undeclared/lane. With the subject's declared-disposable row it reports disposable/declared. reconcileWorktreeMaterial's dry-run preview lists it as disposable, and the ignored-material filter leaves no blocker. The repository and its commit are still present before removal.",
    "scripts/test-release.sh --case material, disposable mode: git worktree remove deletes an ignored nested repository with its worktree (test ! -e on the subject)"
  ],
  "rationale": "Mission and critical path: a close must finish without discarding material of unknown provenance; the order's fail-conservative rule makes such material the operator's decision. Shifting the burden and policy resistance: a path-keyed word for one worktree silently decides another worktree's repository. Rule beating: the passing fixtures cover the subject only, so they cannot establish derived behavior. Drift and escalation: the existing derived-worktree settlement is the seam; no new phase is needed. Commons and success to the successful: the lane rule and subject handoff stay; only the rows' scope changes. Seeking the wrong goal: counting a finished close as success while a repository is lost would invert the order's purpose. Naive Interventionism: the verifier does not repair the subject it judges. NoOp leaves a rare but irreversible deletion path unrecorded.",
  "rejected": [
    {
      "option": "Fail VER-001 on this defect",
      "reason": "Criteria 1–4 name the subject worktree and the release fixture's subject; a defect outside the declared criteria is boarded with its reproduction, not failed."
    },
    {
      "option": "Repair the implementation in the verifier session",
      "reason": "An independent verifier preserves the judged subject; the repair belongs to an order that owns derived-worktree settlement."
    }
  ],
  "followup": "Next order editing reconcileDerivedWorktrees in scripts/worktree.mjs or finishPublishedWorktree in scripts/release.mjs (priority medium; data-loss class). Bind each committed material row and each --material override to the worktree whose inventory produced it. A derived worktree's nested repository absent from that worktree's own recorded inventory then keeps its lane disposition, so an undeclared other-lane repository blocks with its command. Reproduce with a detached woNNN derived worktree that holds a different one-commit repository at a path the subject declared disposable, and assert that it is retained and named. Keep lane-disposable removal and the subject's behavior unchanged.",
  "reopenWhen": "A derived worktree loses a nested repository at close, the next order edits derived-worktree settlement, or a planning pass decides that subject rows deliberately govern derived worktrees."
}
```

## WO-176-D020

```json
{
  "id": "WO-176-D020",
  "date": "2026-10-01",
  "dispatch": "resume: verify",
  "decision": "Board two operator-facing accuracy defects outside the criteria. (a) The close record marks cleanup blocked for any path-matching worktree that settle keeps because it is checked out on a branch, and gives it a bare release-close command that cannot settle it. When the subject's finish is blocked, settle's kept line for the subject's own path also adds a second settle blocker to the subject row. (b) The completion advisory says 'declare before close', but the same command has already recorded the row as undeclared. A later declaration takes effect only at a later completion; otherwise the close's --material flag decides. After the merge, the finish blocker leads with that same declaration command, which the close never reads. Criterion 1 requires the command, so it stays; its timing and order are the defect.",
  "evidence": [
    "scripts/release.mjs finishPublishedWorktree: the before filter takes any worktree whose path matches the order's wo-number pattern. The after loop marks every worktree it did not remove, or did not preview as would-remove or would-prune, as retained with cleanup blocked. A kept line adds a settle blocker naming node <main>/scripts/release.mjs close WO-NNN --publish.",
    "scripts/worktree.mjs reconcileDerivedWorktrees keeps a non-detached worktree on every run: 'checked out on <branch>, not a detached derivative'",
    "Traced scripts/test-release.sh --case material, unknown mode, 2026-10-01. After publication the advisory reads: npm run worktree -- material 'scratch-material/x' --preserve --reason 'keep this repository'; after publication retry: node '<main>/scripts/release.mjs' close WO-099 --publish --material 'scratch-material/x=preserve'; to discard instead: ...=disposable. It is followed by 'Derived worktree <main>-wo099: kept (checked out on wo-099, not a detached derivative)'.",
    "The same fixture runs the subject declaration after publication, and the retry stays blocked: the close reads only committed rows",
    "scripts/resume.mjs implementation-ready: requireLifecycleEvidence prints the advisory and appendTransition records ImplementationReady in the same command. scripts/lib/worktree-material.mjs committedMaterial reads only the latest ImplementationReady or RepairCompleted event.",
    "scripts/lib/lifecycle-evidence.mjs prints 'Undeclared nested repository ...; declare before close: npm run worktree -- material ...'"
  ],
  "rationale": "Mission and critical path: WO-178 and later planning passes count closes from release-close.json, so a spurious blocked outcome misstates the measure this order introduces, and a remedy that cannot work recreates the stop it removes. Rule beating: the fixtures assert that a material blocker exists, not that every recorded blocker is real. Shifting the burden: an operator who follows the first printed command retries into the same block. Escalation and commons: wording and classification inside existing seams; no new gate. Naive Interventionism: the verifier records the defect and changes nothing. NoOp leaves the record's first consumer to inherit the noise.",
  "rejected": [
    {
      "option": "Treat the declaration command in the finish blocker as a criterion 1 failure",
      "reason": "Criterion 1 requires the other-lane case to block with the declare command, and criterion 3 requires the advisory to name --material; both are present."
    },
    {
      "option": "Repair the implementation in the verifier session",
      "reason": "An independent verifier preserves the judged subject."
    }
  ],
  "followup": "Next order editing finishPublishedWorktree in scripts/release.mjs, the material advisory in scripts/lib/lifecycle-evidence.mjs or ensureNoIgnoredMaterial in scripts/worktree.mjs (priority low). Record a worktree that settle keeps by design (on a branch, not a derivative) without marking cleanup blocked, and stop adding the subject's own settle line as a second blocker. Say in the completion advisory that a declaration takes effect at the next completion, and name the close's --material command for a handoff already filed. After the merge, list the close's --material command first and say when the declaration command applies. Reproduce with a clean close beside a path-matching branch worktree and with the material fixture's unknown mode.",
  "reopenWhen": "A planning pass counts a close as blocked that had no blocker, an operator follows the declaration command at close and the retry blocks again, or WO-178 consumes release-close.json."
}
```

## WO-176-D021

<!-- integration refs/dotln/checkpoint/WO-176/6 -->

```json
{
  "id": "WO-176-D021",
  "date": "2026-10-01",
  "dispatch": "resume: final review; worktree integrate WO-176",
  "decision": "Integrate main at ee9b9db9 (WO-180, v0.60.0) into the uncommitted WO-176 worktree and keep the result for the repair FINAL-001 routes. Resolve both authored conflicts to main's bytes. scripts/test-worktree-integration.mjs: both sides added the same browser-evidence workspace link and Playwright links, and differ only in list order, so WO-176's diff for that file becomes empty. docs/evidence/current.json: keep main's selection (authority WO-180/002, artifact identity and verification WO-180/003, feedback WO-180/003), because each edition's check reproduces on the integrated tree. WO-176's revision 001 editions stay as immutable records and are no longer selected. The application release retimes from v0.59.1 to v0.60.1 under the recorded patch classification; no component version changes.",
  "evidence": [
    "refs/dotln/checkpoint/WO-176/6",
    "base 276db3e18406fc3c7a4aea7dabb4b9a0837255b0",
    "upstream ee9b9db9f716dbe6a94ae1b564bb2d04210f17d0",
    "release preparation: Retimed WO-176: v0.59.1 → v0.60.1 above the observed release baseline v0.60.0. Files changed: docs/work-orders/WO-176-release-close-finishes-on-the-handoff.md, README.md, docs/evidence/WO-176/meta.json, docs/final-reviews/WO-176/PR.md. Meter snapshot: docs/evidence/WO-176/meta.json, 4053 bytes. Tag observation: local snapshot only.",
    "Intake backup before integration: npm run backup:intake into this session's DotLn scratch (3 files); the integrate helper accepted it.",
    "Integrated tree, 2026-10-01: authority-evidence, artifact-identity-evidence, verification-evidence and feedback-evidence --check each pass against main's selected editions. WO-176's artifact-identity/001 and verification/001 files are byte-identical to WO-180's artifact-identity/003 and verification/003, and authority/001/authority.json equals WO-180's authority/002 copy. Only bundle-diff.json differs, because WO-180 regenerated the harness bundle.",
    "scripts/lib/evidence-sources.mjs: scripts/lib/paths.mjs is BUILD_ONLY for the artifact-identity, verification and feedback editions, and feedback staleness is keyed on judged behavior, so the paths.mjs change stales no edition check on the integrated tree.",
    "Affected checks on the integrated tree: npm run publication:check, node scripts/harness.mjs check, npm run release -- check-surfaces --local (57 PASS, exit 0), git diff --check and git diff --cached --check all pass. npm test -- --review: 39 passed, 0 failed, 782.32 s, 84 fresh tasks, code identity 4bfcb5f80ec024b4a980db64b9164f50218ed47600a2cf092fd1fe5ae2f9a6df, recorded 2026-10-01T12:40:38.060Z."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Re-mint the three deterministic editions as WO-176 revision 002",
      "reason": "Main's editions reproduce on the integrated tree, so a new revision would add identical evidence bytes and claim nothing new. Reopen this if the repair changes a registered edition source in a way a check judges."
    },
    {
      "option": "Keep WO-176's edition selection",
      "reason": "Its revision 001 bundle-diff predates WO-180's harness regeneration; main's selection is the one that judged that bundle."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-01. Original base: `276db3e18406fc3c7a4aea7dabb4b9a0837255b0`.
Fetched main: `ee9b9db9f716dbe6a94ae1b564bb2d04210f17d0`. Checkpoint: `refs/dotln/checkpoint/WO-176/6`.
Named stash retained: `11a490588c8a70c56d10abe5d5412c4d19d06985` (WO-176 integrate 2026-10-01).
Resolved projections: README.md, docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-176: v0.59.1 → v0.60.1 above the observed release baseline v0.60.0. Files changed: docs/work-orders/WO-176-release-close-finishes-on-the-handoff.md, README.md, docs/evidence/WO-176/meta.json, docs/final-reviews/WO-176/PR.md. Meter snapshot: docs/evidence/WO-176/meta.json, 4053 bytes. Tag observation: local snapshot only.
Carried-forward claims: main changed none of WO-176's source files (`paths.mjs`, `intake-reconciliation.mjs`, `lifecycle-evidence.mjs`, `worktree-material.mjs`, `worktree.mjs`, `release.mjs`) or their fixtures. The one shared fixture, `test-worktree-integration.mjs`, now holds main's bytes, which carry the same links. VER-001's criterion 1–5 evidence therefore rests on unchanged subject bytes and carries forward. The criterion 6 gates were re-run on the integrated tree, and every suite passed (D021 evidence). FINAL-001 judged the integrated subject and failed it on a finding that holds on both bases (D022); integration did not cause it.
Authored conflicts observed: docs/evidence/current.json, scripts/test-worktree-integration.mjs.
Affected checks are printed by the command; results remain untested until executed.

## WO-176-D022 — final review finding: a frozen completion row deletes an undeclared repository that gained content

```json
{
  "id": "WO-176-D022",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Fail FINAL-001 and return the finding to repair. The close replays the completion's committed material rows as explicit declarations, whatever their source. inventoryMaterial lets an explicit row replace the repository's current classification, so a lane row recorded at completion is frozen. A repository in the other lane that was empty at completion is recorded disposable by the empty-scaffolding rule. If it gains a commit before the close, its own inventory then says undeclared, but the replayed row makes it disposable. The ignored-material check finds no blocker, and git worktree remove deletes it with its commit. On the base the same repository blocks the close. The order's design declines deleting an undeclared repository ('never'), its non-goals exclude deleting undeclared material, operator-review assumption 3 says such a repository still stops cleanup, and criterion 1 requires an other-lane repository with a commit to block with the declare command.",
  "evidence": [
    "Reviewer reproduction, 2026-10-01, in this session's DotLn scratch (f1/probe.mjs), with the worktree's own scripts/lib modules on the integrated tree. A main repository ignores scratch/ and has a linked worktree on wo-999. scratch/x is created with git init only. inventoryMaterial at that point records {scratch/x, other, disposable, source lane, 'empty nested repository (fixture scaffolding; only .git, no commit)'}. A commit is then made inside scratch/x. Its own inventory now reads undeclared, 'nested repository with content'. With the completion rows passed as declarations it reads disposable again, with the stale reason. reconcileWorktreeMaterial's dry run lists it as disposable, the ensureNoIgnoredMaterial filter leaves no blocker, the untracked guard is empty, and git worktree remove without --force deletes scratch/x and its commit.",
    "End-to-end reproduction, 2026-10-01, through the real close. The case drift (this session's DotLn scratch, f1/drift-case.sh) was composed into a scratch copy of scripts/test-release.sh whose WO-176 scripts are byte-identical to the worktree's, using the fixture's own make_repo, commit_candidate and release_close helpers. scratch-material/x was created with git init only before commit_candidate recorded the ImplementationReady material. Commit c6de3c9 was then made inside it, and release_close WO-099 --publish ran. Output: 'nested repository disposable; removed with the worktree', then 'Published annotated v0.2.1 … GitHub Release created'. Both the subject and scratch-material/x were gone afterwards. release-close.json recorded cleanup 'clean', worktree 'removed', and the consumed row {disposable, source lane, reason 'empty nested repository (fixture scaffolding; only .git, no commit)'}.",
    "A read-only review subagent found and reproduced the same path. This review reproduced it independently and does not rely on that run.",
    "scripts/lib/worktree-material.mjs:104-120: an explicit row's disposition, source and reason replace the current classification. committedMaterial returns every row of the latest ImplementationReady or RepairCompleted event, lane rows included.",
    "scripts/worktree.mjs:593-600 (finish preview) and 659-664 (finish after the merge) pass the committed rows and the overrides as declarations. scripts/lib/intake-reconciliation.mjs:94-103 records a disposable row without inspecting the repository again, and worktree.mjs:89-92 then treats it as reconciled.",
    "scripts/lib/lifecycle-evidence.mjs:35 records inventoryMaterial(root) at completion, so every lane classification enters the committed event.",
    "scripts/lib/paths.mjs:272-281: an empty nested repository outside intake is disposable. On the base, a repository with content in the other lane is never disposable (paths.mjs:282-293).",
    "No fixture changes a repository between completion and close. The fresh product gate on the integrated tree passed 39 of 39 because no case reaches this state."
  ],
  "alternatives": [
    "Fail with the reproduced finding and route it through repair and fresh verification",
    "Pass and board it as D019 was boarded",
    "Write the fix during review and certify it"
  ],
  "rejected": [
    {"option": "Pass and board it", "reason": "D019 was boarded because the criteria judge the subject worktree. This path deletes an undeclared repository with content in the subject worktree itself, which is the outcome the order declines as 'never'. The deletion cannot be undone, and the base blocked the same state."},
    {"option": "Write the fix during review", "reason": "Product 07 §Independent workflows and integration: a reviewer never writes a behavioral fix and certifies it."}
  ],
  "followup": "WO-176 resume: fix. Rule the repair must hold: a committed material row governs a repository only in the state it recorded. A repository whose state changed since that completion is judged by its current classification, and an other-lane repository with content and no applicable declaration blocks with its commands. Add regressions for a repository empty at completion that gains a commit before the close (it is retained and named, and the close record's row and reason describe its current state) and for D019's derived worktree (the same mechanism through settlement). D023's items and D024's catalog duty may be taken in the same repair within its bound. Run the worktree and release material cases and npm test -- --review before requesting a fresh verification. paths.mjs is a registered edition source, so re-check the deterministic editions if it changes.",
  "goalAlignment": {
    "missionAndCriticalPath": "A close must finish without discarding material of unknown provenance. That is the order's fail-conservative premise, and WO-178's count depends on closes that are honest about what they removed.",
    "traps": {
      "policyResistance": "The repair works inside the existing route; no new gate or completion refusal.",
      "tragedyOfTheCommons": "One repair and one verification, spent on an irreversible path rather than on a cosmetic one.",
      "driftToLowPerformance": "A passing verification and a green integrated gate do not lower the bar for a reproduced deletion.",
      "escalation": "One rule about when a recorded row applies, not a redesign of the handoff.",
      "successToTheSuccessful": "The committed handoff stays as the source of the executor's word; only lane rows stop overriding the repository's current state.",
      "shiftingTheBurden": "The machinery, not the operator, must notice that a repository changed after the handoff.",
      "ruleBeating": "The fixtures judge repositories whose state is fixed between completion and close, so they pass without the protection the design promises.",
      "seekingTheWrongGoal": "The goal is a close that never deletes an undeclared repository, not one that finishes more often."
    },
    "naiveInterventionism": "The lane rule, the declaration command, the record and the --material flag stay as verified; the remedy is scoped to how a committed row binds to a repository.",
    "noOp": "Publishing would ship a close that can delete commits nobody declared disposable, in a state the base refused."
  },
  "reopenWhen": "A repaired subject retains a repository that gained content after its completion row, a regression covers the subject and derived cases, and a fresh verification judges criteria 1 and 3 on that subject."
}
```

## WO-176-D023 — final review: minor defects recorded for the repair or a follow-up

```json
{
  "id": "WO-176-D023",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Record minor defects met in review and not fixed here. None alone fails a criterion as its fixtures define it. D022's repair may fix any of them within its bound, and any it leaves must be named in that repair's decisions with a follow-up.",
  "evidence": [
    "(a) D019 is broader than recorded. reconcileDerivedWorktrees passes every committed row to inventoryMaterial (scripts/worktree.mjs:215), including lane rows, so a derived worktree's repository with content can become disposable through a subject row nobody declared, such as D022's empty-scaffolding row. Inference from source plus D022's reproduction (review subagent; confirmed by reading).",
    "(b) Several undeclared repositories never settle by the printed commands. materialCloseCommand names one path (scripts/lib/worktree-material.mjs:205-211), each blocker prints its own command (scripts/worktree.mjs:104, scripts/release.mjs material blockers), and overrides do not persist between attempts. The review subagent's probe, with repositories a and b: running a's command blocked on b, and running b's command blocked on a again, each exiting 0 with the worktree kept. The design promises 'the one command that settles it'. Criterion 3's fixture has one repository.",
    "(c) A partially published close is mislabelled. When the tag is pushed and Release creation throws, the record holds publication.outcome 'refused' beside tagOutcome 'published' (VER-001 Limits). On a later retry that fails in the GitHub lookup, the /^tag published;/ match credits the retry with the tag push (review subagent probes P1 and P1b). WO-178 would count a public tag as a refused close.",
    "(d) Record I/O can change the close's result. The finally block's requireMaterialContainment and writeFileSync can throw and replace the real error, including the tag-published rerun text, and they can turn a completed close into exit 1 after the writer was released. The review subagent's probe P3 used a read-only record: the cleanup completed, then the close exited 1 with EACCES. readFileSync and requireMaterialContainment run before the try, so an unreadable record path stops a close before publication, against D009's 'do not turn bookkeeping into a publication gate'.",
    "(e) Settlement throws after the subject is removed. inventoryMaterial for a derived worktree runs outside the try (scripts/worktree.mjs:215). A --material docs/intake/x=disposable override that only a derived worktree matches throws there, after finish has removed the subject and its branch. The remaining derived worktrees go unreported and finish exits nonzero. Inference from source; no data loss.",
    "(f) File-lane rules now dispose of whole repositories. The basename rule (*.tsbuildinfo) and the unanchored beacon-stage pattern (scripts/lib/paths.mjs:113-125) apply in the other lane, and the new base.disposable branch precedes the linked-worktree case. Reviewer probe f1/probe-f3.mjs: work/notes.tsbuildinfo and work/.dotln-beacon-stage-abc123, each holding a commit, and .runtime/wt, a linked worktree of another repository with an uncommitted file, are each inventoried disposable/lane. work/plain is undeclared. This follows the order's literal lane rule; the comment above inspectNestedRepository ('Linked worktrees ... are never disposable here') no longer describes the outcome.",
    "(g) D016's evidence and scripts/test-worktree.sh:577 say the verifier mount is disposable 'by its lane' or in 'the disposable feedback lane'. classifyIgnoredMaterial has no feedback lane; the mount is disposable by the empty-repository rule (paths.mjs:272), the same rule D022 turns on.",
    "(h) After an unrelated commit lands on origin/main, the --material retry refuses in ensureExistingRelease ('already exists remotely for a different or non-annotated object', scripts/release.mjs:1496; the same check is at base line 1486) before cleanup runs. The record says refused with tagOutcome null, and its blocker command repeats the failing retry (review subagent probe P4). This is the base's check, but this order makes that retry the only remedy it prints.",
    "(i) Fixture gaps. scripts/test-release.sh:1764 asserts Object.hasOwn(record.dispatch, 'harness'/'session'), which always holds because the record sets both keys. Record contents are asserted only in the material case; refusal, thrown-error and no-release records are checked for existence only. No case covers several undeclared repositories, a moved main, or a repository changed after completion (D022).",
    "(j) previousAttempts grows without bound, each attempt carrying its full refusal text, and the record is read and written without a lock, so overlapping closes can lose an attempt. Inference from source; not reproduced."
  ],
  "alternatives": ["Record them for the repair or a follow-up", "Fail on each", "Leave them only in the report"],
  "rejected": [
    {"option": "Fail on each", "reason": "Each is outside what the criteria's fixtures judge, a record-accuracy issue, or a coverage gap; D022 already returns the order to repair."},
    {"option": "Leave them only in the report", "reason": "A defect met and not fixed needs a structured follow-up so the register carries it."}
  ],
  "followup": "WO-176 resume: fix, within D022's bound where cheap, otherwise the next order editing finishPublishedWorktree or the material helpers (priority low): print one --material command that carries every undeclared path; label a pushed tag without a Release as partially published and do not credit a retry with an earlier push; keep the record's read and write from changing publication or the exit status; catch a derived worktree's inventory failure as a kept line; decide and record whether the basename and beacon-stage file rules and linked worktrees apply to repositories; correct D016's lane wording and the test-worktree.sh comment; give a moved-main retry a remedy that works; make the dispatch assertion check values and add record assertions for the refusal and no-release paths; bound previousAttempts.",
  "goalAlignment": "Mission: WO-178 and later planning passes count closes from release-close.json, so its labels and printed remedies must be true. Rule beating and drift argue for recording the coverage gaps rather than counting green cases. Shifting the burden: (b) and (h) send the operator round a loop the record says will settle. Escalation and Naive Interventionism keep these out of the failure itself. NoOp would leave them with no owner.",
  "reopenWhen": "The repair fixes or names each item, or a consumer meets one of them in use."
}
```

## WO-176-D024 — final review finding: Receipt 036's catalog duty has no implementation or recorded check

```json
{
  "id": "WO-176-D024",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Record that the catalog row's disposition of Receipt 036's known issue is not discharged, and route it to D022's repair. The row says that within the design the close bundles a repository whose commits no retained ref reaches into the retained lane before removing it, and that the decisions record the check. No WO-176 source creates a bundle or checks reachability, and no decision mentions the receipt. The order's text and citations do not carry the duty, so the executor and VER-001 did not judge it. The refuter's reopening condition has occurred in this order's own fixture: the release material case's lane and disposable modes remove a one-commit nested repository whose commit no other ref reaches.",
  "evidence": [
    "docs/planning/work-order-map.md, WO-176's row: 'Receipt 036 known issue (2026-09-30): a declared or lane-disposable repository is removed at close and removal cannot be undone; within the design the close bundles a repository whose commits no retained ref reaches into the retained lane before removing it, and the decisions record the check; a removed repository a later session needed reopens it.'",
    "docs/planning/refutations/2026-09-30-planning-826842218eb333e2-036.md, WO-176 finding criterion:3 (known-issue); reopenWhen includes 'a fixture shows a nested repository removed while it holds commits no retained ref reaches'.",
    "grep of scripts/lib/worktree-material.mjs, scripts/lib/intake-reconciliation.mjs, scripts/worktree.mjs and scripts/release.mjs finds no git bundle or reachability check; grep of decisions.md D001–D020 finds no mention of Receipt 036.",
    "scripts/test-release.sh release_case_material: the lane mode (.runtime/x) and the disposable mode (scratch-material/x) each commit saved.txt inside the nested repository, and the close removes the subject with it; release:case:material passed in this review's gate. The process-debt lane case preserves or reconciles but removes no worktree.",
    "D022: the deletion paths the bundle would have made recoverable include an undeclared repository with content."
  ],
  "alternatives": ["Route the duty to D022's repair", "Board it for a later order", "Write the bundle step during review"],
  "rejected": [
    {"option": "Board it for a later order", "reason": "The repair already opens the same consumption path, and the duty belongs to this order's catalog row; a later order would reopen the same files."},
    {"option": "Write the bundle step during review", "reason": "A reviewer never writes a behavioral fix and certifies it."}
  ],
  "followup": "WO-176 resume: fix: before the close removes a declared- or lane-disposable nested repository that holds commits, bundle it into docs/control/local/retained/WO-NNN/ (or record why a repository needs none, for example because a retained ref already reaches its commits), name the bundle in release-close.json, and record the check and Receipt 036's disposition in the order's decisions. Otherwise record, with the operator's word, that the catalog duty is declined and keep the receipt's reopening condition.",
  "goalAlignment": "Mission: a scratch declaration that turns out wrong should cost a lookup, not lost work. Shifting the burden and rule beating: the fixtures prove removal, not recoverability. Escalation and Naive Interventionism keep this to one bundle step before an existing removal. NoOp leaves the planner's disposition unfulfilled while the reopening condition already holds in the order's own fixtures.",
  "reopenWhen": "The repair bundles or explicitly declines with a recorded reason, or a later session needs a removed repository's commits."
}
```

## WO-176-D025

```json
{
  "id": "WO-176-D025",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "misread": "FINAL-001 says npm run test:docs passed '24 passed, 0 failed, 35.35 s, with this report and D021–D024 in place'. The 35.35 s row (recorded 2026-10-01T12:52:05.205Z, tree 8484ad08) ran before I edited three table rows of the report: the register and meta rows, and the test:docs row itself. The result transition recorded no new test:docs row.",
  "meant": "The document gate passes with the filed report and D021–D024 in place.",
  "changed": "After the transition, npm run test:docs ran again on the filed bytes (FINAL-001 sha256 7795fee3…, the control log's reportHash): 24 passed, 0 failed, 35.37 s, 24 fresh tasks. FINAL-001 stays as filed, because its bytes are bound by the recorded FinalReviewCompleted event. The verdict and findings do not depend on this figure.",
  "decision": "Correct the timing's subject in the record rather than edit a filed report.",
  "evidence": [
    "gate rows: npm run test:docs exit 0 at 12:52:05.205Z (tree 8484ad08) and FinalReviewCompleted at 12:52:25.774Z (tree 7b3b2978)",
    "post-transition npm run test:docs on the filed bytes: 24 passed, 0 failed, 35.37 s"
  ],
  "alternatives": ["Record the correction", "Edit the filed report", "Leave it uncorrected"],
  "rejected": [
    {"option": "Edit the filed report", "reason": "A filed report's bytes are bound by its control event; reports are never edited."},
    {"option": "Leave it uncorrected", "reason": "A figure attributed to bytes it did not judge must be corrected the same day."}
  ],
  "reopenWhen": "Another FINAL-001 figure is found attributed to bytes it did not judge."
}
```
