# WO-231 evidence

The target review lint now shares publication's described-base selection while
preserving the activation base in lifecycle records. Review reads the clone's
existing remote-tracking ref and performs no fetch.

## Before measurement

The bounded `wo231-baseline.mjs` probe used the existing target-worktree fixture
before any implementation edit on 2026-10-25. It added a conforming 90-character
subject to the target's main branch, fetched that branch, fast-forwarded the order
onto it and added one conforming order commit. `final-review-result pass` exited 1:
`subject.length: 90 of 72 characters`. No completion event was appended. The old
range contained three commits; the merge-base range contained one. The probe
itself exited 0 after asserting that refusal and cleaned up its temporary repos.
[controls.json](controls.json) records the transition's exit code and diagnostic.

The cited fork's WO-013 FINAL-002 was read in its launchpad order worktree
(DotLn-Instance-wo013), rather than its paired target worktree. Its finding F1
records 17 commits from activation, 16 already merged, and one from the merge base;
the merged subjects measure 78 and 90 characters, and the order's subject 61.
Nothing in either fork worktree was changed.

## Regression cases

`scripts/test-target-worktree-start.mjs` adds the same integrated history as the
before probe, paired with an absent-ref case that retains the activation range.
Both make the fixture origin unavailable before review to exercise the no-fetch
contract. The passing case checks the appended FinalReviewCompleted event and its
unchanged activation base. Three refusal cases check the range, activation context,
subject and offending commit before format, identifier and attribution findings.
The original nonconventional and 90-character cases remain unchanged.

The existing target publication fixtures are unchanged, including the paired
activation/integrated draft tables and final publication's activation clause.
The complete review run covers these and the named Preflight suites. Results are
recorded in the handoff after execution; no live forge or model evaluation is used.

## Completed validation

The fresh complete review run passed on 2026-10-25 at 02:07:18.989Z: 36 suites,
102 fresh tasks, zero reused tasks, zero failures and no unrun tasks, in 1,255.725 s.
Code identity: `734504dc897e7648c6b214c024892bc2898126f0c5bbc3250c51948ddfd0df60`.
Both code and build identities stayed unchanged during the run. This covers the
named Preflight suites, both original lint controls, all five new cases, the
unchanged publication cases, and export/update compatibility.

The first complete run failed on the runner's exact inventory, which this order's
new cases had not updated: 69 declarations versus the expected 67. Its target
start and publication file tasks passed, but ten required tasks were unrun. D004
records the repair, preserving the exact inventory checks at 69 declarations and
100 expanded names; its bounded reproduction passed before the fresh complete run.
[gate-runs.json](gate-runs.json) retains both runs' outcomes without composing a
passing claim from the failed attempt.

`npm run publication:check` passed for both editions and all 255 indexed product
headings; `node scripts/harness.mjs check` passed for 35 generated surfaces.
`npm run sync` reported every artifact current after the inventory repair, with
no evidence-edition re-mint. The complete run's generated checks also passed.
The nested-repository scan found only the worktree's own `.git`; no cleanup was
needed. [self-review.md](self-review.md) records both independent workers and the
resolution of their shared evidence gap. [handoff.md](handoff.md) judges each
criterion; the completion record binds the final document gate to those bytes.

## Final review

[FINAL-001](../../final-reviews/WO-231/FINAL-001.md) integrated `main` at the
activation base (a no-op merge; [D007](decisions.md#wo-231-d007--integrate-main-at-the-activation-base-with-nothing-taken-in)),
read the identity `734504dc…` unchanged before and after, reran the nine
review-lint cases and VER-001's six probes under the bounded wrapper with the
same outcomes, ran the printed affected checks, and passed with no finding of
its own. VER-001's two follow-ups stay boarded and their register rows are
deferred to the next order that edits the lint
([D008](decisions.md#wo-231-d008--final-review-pass-at-the-integrated-identity-ver-001s-two-follow-ups-stay-boarded-and-the-register-rows-are-disposed)).
