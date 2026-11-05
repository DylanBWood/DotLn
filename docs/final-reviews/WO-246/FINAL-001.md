# WO-246 — FINAL-001

**Verdict:** pass. All eight criteria are met on the repaired subject. One finding is boarded as a follow-up; none blocks.

**Date:** 2026-11-05.

**Subject:** the repaired implementation of [WO-246](../../work-orders/WO-246-the-launchpads-own-pull-requests.md), preparing v0.117.0, with its complete verification sequence: [VER-001](../../verifications/WO-246/VER-001.md) (fail, criterion 3) and [VER-002](../../verifications/WO-246/VER-002.md) (pass). Integration took in nothing: `main`, `origin/main` and the branch's merge base all read `bdf30849`. The code identity is `45cb66bd2092a9b7732c244e148c09f6f8e68006fef6d298df3dddb0178973c2`, the one VER-002 judged. The reviewer changed no implementation file.

**Actor:** Claude Code 2.1.318, claude-fable-5-1, selected effort xhigh, read back from the host's `CLAUDE_EFFORT`. That is the selected effort, not an effective one, and it differs from the order's reviewer recommendation of high; no setting was changed. No worker was launched and no verdict was delegated.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.318","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

**Process cost:** entry 159207 tokens; handoff 17110215 tokens; source claude-transcript-message-usage

The counters cover this dispatch, with entry cutoff 2026-11-05T14:15:42.962Z and report-preparation cutoff 2026-11-05T14:31:04.206Z. The latter includes 16,731,209 cached input tokens; provider cost is unknown. At that cutoff the phase had used 0 h 16 min of its 8 h 0 min bound and no complete run. Final counters stay in the ignored receipt and the response. Reusing the standing complete row avoided a second run of about 0 h 38 min; the reviewer's own probes and focused cases took about 0 h 2 min of machine time. No monetary saving is inferred.

## Findings

<!-- dotln-findings:start -->
[
  {
    "id": "F1",
    "route": "follow-up",
    "class": "escape",
    "summary": "The attribution predicate's gitmoji pattern holds three invisible literal characters where the lint's copy of the pattern uses escapes."
  }
]
<!-- dotln-findings:end -->

**F1 — follow-up, not fixed.** `LEADING_GITMOJI` in `packages/compiler/src/attribution.mjs`, which the repair added, holds a literal U+FE0F twice and a literal U+200D once. `scripts/lib/outward-lint.mjs` writes the same gitmoji pattern with backslash-u escapes for those two code points. The characters cannot be seen in an editor or a diff, so a later edit or a text-normalizing tool can drop or double one with nothing to show for it, and the two spellings can drift apart unseen. The behavior is correct today: the cases that open a line with a variation selector and with a joined emoji refuse, in the reviewer's own run. It fails no criterion and breaks no behavior `main` had, so by rule it is a follow-up. Its class is escape, because it was in the verified subject and inside verification's review of the repair diff. Fixing it here would edit a judged feedback source after the passing complete run: a new code identity, a fresh complete run and a third live feedback episode, to change no behavior. [D030](../../evidence/WO-246/decisions.md#wo-246-d030--final-review-f1-the-attribution-pattern-holds-invisible-characters) records it with its follow-up, which the register carries as FUP-d3faf79614bdf66c.

## Criterion judgments

**Criterion 1:** met. The lint's `pr-title` branch admits a gitmoji followed by a subject and keeps the conventional type and the 72-character limit on the `commit` kind alone. `scripts/test-outward-lint.mjs` names each string the criterion names: `✨ Handle input` and `:memo: Plan the pass` pass as titles and refuse as commits, `fix: handle input` and `:sparkles: feat: handle input` pass as both, and `Handle input` refuses as both. VER-001's probe, rerun here, compares 1,920 commit inputs with the pre-order lint and finds them identical, admits five titles and refuses four. `publishTargetDraft` lints its title as `pr-title` only; `scripts/test-target-publish.mjs` passes a long title in core's form and refuses `:memo: Plan the pass` as a commit. The reviewed-commit lint's refusal of an untyped branch commit (`scripts/test-target-worktree-start.mjs`, `subject.shape`) is in the target-worktree suite of the complete row.

**Criterion 2:** met. The reviewer ran both door cases and both pass: `WO-246 plan publish` and `WO-246 update --publish`, each against a GitHub-shaped origin on an unresolvable host rewritten to a local bare repository, with a gh double. Reading `scripts/lib/launchpad-publish.mjs` agrees with them: the branch shape, the clean tree, the door's own proof, the lint, the body profile and the attribution check all precede the first remote call; the repository is origin's push URL, which the gh preflight must match; the push is skipped when the remote branch already holds the commit; the create names `--repo`, `--head` and `--base`; and after a failed create only an open pull request with the same head commit, branch and base is adopted. `update --publish` refuses until the two provenance files name one commit that is neither the one where the branch left `main` nor the one `main` names now, and until `harness check` and the lineage index check pass.

**Criterion 3:** met. The reviewer ran `WO-246 a fork's clone refuses…`, which passes, and reran both verification probes. VER-001's probe, which exited 1 at VER-001, exits 0: `gh pr list`, `gh pr create --title x`, `gh issue list` and `gh pr view 1` are refused across two hosts with one owner and name, and its ordinary, same-repository and explicit-selector controls hold. VER-002's probe passes its 84 judgments over 12 further pairs. The source agrees: a repository's identity is its canonical host, owner and name; `-R`, `--repo` with a value, `GH_REPO=` with a value, a pull-request or issue URL and a stored `gh-resolved` default admit; `gh repo set-default` is no pull-request or issue command; a clone with no `upstream` returns no fork; and an unreadable clone admits with one advisory. The registered target's `gh pr` parse reads the same words through `ghCommand`, and its regressions are in the harness-fixtures suite of the complete row. The judgment's duration is recorded in D007, D020 and D024: one Git configuration read, about 5 to 7 ms.

**Criterion 4:** met. Both planner roots name `npm run plan -- publish`. `node scripts/harness.mjs check` passes with 42 generated surfaces. `node scripts/harness-context.mjs` measures each planner root at 29,643 bytes against its 24,576-byte ceiling, 359 over the previous measurement, and D009 and D011 record those bytes against that ceiling. The criterion asks for the record, and the overrun is boarded as FUP-8b1f9bcc240a1483 with no ceiling raised.

**Criterion 5:** met. The reviewer ran `WO-226 update finish…` and `a borrowing lane…`, and both pass: a checkout that already holds origin's `main` finishes with no fetch and no bundle, the lane's `objects/info/alternates` names the checkout's store, the default bound is ten minutes, `--fetch-timeout` overrides it, and a stalled read or fetch under a low bound refuses naming the bound and the by-hand finish with refs, `HEAD` and tree unchanged. VER-002's probe adds a slow read with a stalled fetch under one shared deadline. The target close and the target publish make the one `fetchIntoCheckout` call that `update --finish` makes, which a case in the launchpad suite holds them to, and their existing cases are in the complete row. The two target-specific stall messages have no committed case (D015, D018); the reviewer read them and ran neither.

**Criterion 6:** met. The emitted `.claude/settings.json` gains exactly four lines: `permissions.allow` with `Bash(node scripts/launchpad.mjs update --publish *)` and `Bash(node scripts/refute-plan.mjs publish *)`. No rule names `git push` or `gh`, and the deny list is unchanged. `WO-246 the emitted settings…` asserts this on the file and passes in the reviewer's run. Both planner roots name the node spelling. D008 and D010 cite the host's auto-mode and permissions pages, read 2026-11-05. That these two rules count as narrow to the host is the executor's labeled inference, and no live classifier was exercised.

**Criterion 7:** met. `docs/KIT.md` §Planning in this instance, §Taking upstream updates and §Hooks state the two helpers, the repository rule and its remedies, and the finish's bound with its by-hand fallback. Product 07 §Operator-opened planning pass states the push and the pull request through the helper. `npm run publication:check` passes in the reviewer's run: 256 of 256 product headings indexed and both voice indexes current.

**Criterion 8:** met. `npm test -- --review` stands on the passing complete row at the current code identity, recorded 2026-11-05T12:37:20.449Z: review selection, exit 0, 44 required suites, none unrun, identity and build output unchanged, no displaced task. `git diff --check` is clean. The package and lockfile changes are the internal `@dotln/compiler` 0.40.0 and `@dotln/skeleton` 0.84.0 versions and their pins, so there is no new dependency. The `npm run test:docs` claim stands on the passing document row produced after this report's last edit, which `final-review-result` consumes; no complete gate was run in this phase.

## Verification sequence

VER-001 failed on one blocking finding, F1 against criterion 3: two remotes with one owner and name on different hosts were read as one repository. The repair made host part of identity (D024), and its own review found and fixed two further defects before the complete run: an alias fold with no end anchor, and a shortcode gitmoji that hid AI attribution from the predicate (D025). VER-002 judged the repair and passed. This review reproduced the blocker's repair with VER-001's own committed probe before any other work, and found nothing in the repair diff that fails a criterion.

The latest planning judgment of this order, receipt 063, lists five known issues, and each has an outcome in the subject. A pull-request or issue URL names its repository and admits, and the refusal names `-R <upstream>` for a deliberate reach of the parent. The decisions record the operator's choice of the two allow rules (D010); the reviewer relies on that record, because the session journals hold no text of the operator's words. An unreadable clone admits with an advisory. The ten-minute bound rests on one fetch measured here (2.5 s for 49 MB, D005) and the fork's nineteen-minute stall, which is thin; `--fetch-timeout` is the remedy on `update --finish`, and D005 names when to reopen it for the target routes. The fifth is a planning matter. A target close stopped by the bound records the `base-fetch` blocker class, which receipt 062 asked about. The two intake captures the order cites hash to the SHA-256 values it records, read by hash alone in the main checkout.

## Integration, gates and review

`npm run worktree -- integrate WO-246` reported that the worktree is not behind `main`, so there was no conflict, no retimed version and no new source. The reviewer therefore reused the passing complete review row and ran, each under the bounded wrapper and one at a time: VER-001's probe, VER-002's probe, the seven focused cases, `harness check`, `harness-context` and the publication check. All passed. [D029](../../evidence/WO-246/decisions.md#wo-246-d029--final-review-accepts-the-repaired-subject-on-its-own-reproductions-and-the-standing-complete-row) records the traps named before that choice and the alternatives.

The whole source diff was read: the hook judgment and its command reader, the publish helper and its two doors, the borrowing fetch and its three callers, the title lint, the attribution predicate, the emitter's allow rules and the planner sentence. Generated surfaces were judged through their source and `harness check`. Three things were checked beyond the criteria. The new refusal ends with "Use operator override: for authorized recovery", and that is true of it: the emitted hook returns an open override's message before the evaluator loads. The helper's push is a plain push with no lease or force, read in `pushObservedCommit`, so by Git's default a remote branch that has diverged is refused, not overwritten; no case runs that path. And the allow rules widen what a session may run unprompted to these two scripts alone, each of which refuses on `main`, off its branch shape, on a dirty tree and on lint or attribution failure before any push.

## Standing documents

Each changed standing document was read as a diff. `docs/KIT.md`, product 07, product 03, `docs/AI-HARNESS-SECURITY.md` and `docs/PLAYBOOK.md` replace or extend the passage that states the rule, in the present tense, with links to the decisions; none adds a dated account under a standing heading. ADR-0005 gains one dated line in its Amendments section, which is that section's purpose. The refusal count reads nine in every place that states it: the instruction, the security guide, the playbook, product 07 and the features page.

## Follow-up register

`npm run plan -- followups --touching --work-order WO-246` listed 33 pending rows. [D031](../../evidence/WO-246/decisions.md#wo-246-d031--final-review-the-matched-follow-up-rows-whose-conditions-this-order-met) disposes the eight whose condition this change met and leaves the other 25 as matched. FUP-97b67590057d75b4, VER-001's repair rule, is settled. FUP-1b94e79e02e54e70 (a malformed private list's refusal names no line) and FUP-eed385be08e5bdd9 (the role oracle's retained inequality) are deferred again with their conditions recorded as met. The five older cold-start rows are deferred again, because this order's reviewed rules moved the measured overrun. The order's own rows stand: FUP-8b1f9bcc240a1483 and FUP-9b6d69455e1ca796 deferred by the executor, and FUP-b946c5a767a65862, FUP-1b6dd806a8985632 and F1's FUP-d3faf79614bdf66c for the next planning pass to triage.

## Limits and untested

- No real forge was touched: both doors ran against a gh double, and no real pull request was opened by them. This order's own pull request is opened by `worktree publish`, the order route, not by the new helper.
- No allow rule was probed against a live host classifier, and whether a running session picks up a settings change is unknown. A fresh session after the merge is the safe assumption.
- A fork stays exposed until it takes this release. `gh repo set-default origin` in the fork's clone closes the gap today.
- The recorded limits of the judgment stand as the handoff lists them: shell scope and gh's flag table (D016), a remote named `github` or a differently cased `upstream` (D026), an SSH alias in the publish binding (D027), and a hand-edited provenance (D013).
- Codex and Copilot tool calls are unhooked or unjudged here, so under them the repository rule is role text. Linux hosts are untested.
- Three mistakes of the reviewer's own, each corrected before filing. Its first read of the context report parsed the wrapper's own first line and failed; the planner rows were then read directly from the saved output, and no verdict rests on the failed read. The first draft of this report held the two invisible characters of F1 where it meant to name their escapes; a byte check found them and the sentence now names them in plain words. And the first document gate run failed its structural preflight on the reviewer's release notes, which wrote command placeholders in angle brackets that the reviewed-notes parser refuses as raw HTML; the notes now spell them in capitals, pass that parser when called directly, and the gate was run again.

## Outcome

The outcome matches the dispatch and the order's objective. The traps named before the review's one material choice held: reproducing the blocker and reading the diff found nothing the criteria fail on, and the one defect found was boarded because fixing it would have cost a complete run for no change in behavior. The reviewed change is committed and published as the order's pull request for the operator's merge; the reviewer merges nothing.
