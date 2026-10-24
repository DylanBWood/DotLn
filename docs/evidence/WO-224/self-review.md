# WO-224 independent implementation reviews

The executor used two fresh `codex-spawn-agent` workers, both GPT-6.1 Sol
at max effort, with no descendants. Each received only the active order
and the implementation diff. Both were read-only and ran no executable
checks. Corrections were returned to those same workers for static recheck.

## Criteria adversary

Initial formal findings: 1; fixed: 1; residual: 0. The first implementation sorted
and truncated target lens scopes to 32. A target with 32 flat documentation
files could lose its source directory from every lens. The fix condenses
existing directories without truncation; the added fixture requires the
source directory and the last documentation file in each lens. The worker
confirmed the fix in the updated diff. The full tracked-file census was
unchanged throughout; the defect concerned the lens checklist scopes.

The worker also raised an absent-receipt concern, initially uncounted because
the supplied diff did not establish the existing crash contract. Parent
inspection of `checkEntropyReceipts` confirmed that a trailing filing event
without a pair is a permitted interrupted filing. The new `filedReviews`
helper skips absent pairs, and the existing crash fixture now checks
`entropy subject`. The worker confirmed this second correction too.

After the document gate exposed historical absolute launchpad subjects, both
workers rechecked the compatibility correction. The criteria worker found one
additional P3 issue: selected pending-subject output still returned the old
absolute path during a historical receipt's refutation. The executor added a
shared pending repository classifier and a pending-state assertion to the
synthetic historical regression. The worker confirmed the correction with
cumulative counts of three fixed, zero residual and zero new findings.

## Design and maintainability improver

Formal findings: 1; fixed: 1; residual: 0. Clone resolution originally preceded pending and
consumable-receipt reporting, hiding those recorded actions when a clone map
disappeared. The first correction fixed pending reporting and consumption
without a revision. Recheck found the same defect remained for an explicitly
supplied full recorded commit. The final correction selects recorded commits
directly from immutable receipts; symbolic revisions and fresh subjects still
resolve in the clone. Regression assertions remove the clone mapping during
pending work and after a filed pair, including the explicit full commit form.
The worker confirmed the final correction and its regression assertion, with zero residual findings.
The same worker rechecked the historical compatibility correction and found
zero new or residual findings; its original finding remains fixed.

## Counts and limits

Three formal worker findings plus one worker concern confirmed by parent source
inspection: four distinct issues addressed. Workers made no test, build,
live-review or gate claims. Executable results belong in [handoff.md](handoff.md).
Decision [D013](decisions.md#wo-224-d013--repair-the-independent-review-findings)
records the choices and reopening conditions.
The additional historical compatibility correction is recorded in
[D016](decisions.md#wo-224-d016--preserve-historical-launchpad-subject-semantics).
