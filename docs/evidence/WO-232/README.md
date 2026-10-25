# Instance history compatibility

The `resume: next` dispatch implements WO-232. The fixture is synthetic;
it copies no instance records. The source reports below were read in the
operator's instance on 2026-10-25 and are summarized by shape only.

| Shape | Field report | Fixture |
| --- | --- | --- |
| A closed amended order gains a Workstream field | `standard-pass-v0-96-1-2026-10-24.md` §2: the v0.96.0 workstream refusal led to fields on closed WO-011 and WO-012, then unmatched amendment refusals and withdrawn bindings | WO-001, an amendment followed by close and then a leading field |
| A workstream contains closed self members | The same pass §2 and WO-080-D015: grouping historical orders must neither require rewriting them nor mark them diverged because an update branch advances | WS-001, two closed self orders and a target member |
| Bound decisions have moved to a target | `latest-upstream-and-core-answers-2026-10-20.md` §12 item 4, `latest-upstream-fixes-2026-10-21.md` §4, and `standard-pass-v0-93-0-2026-10-23.md` §2: the document reader and amendment reader tried to reopen removed launchpad files for WO-004 and WO-006 | WO-003, a bound amendment whose decision and reports move through `target-records` |
| A target order's declared base is behind its base branch | `standard-pass-v0-96-1-2026-10-24.md` §2: WO-013 used a provisional activation base that the target had passed | WO-004, activated at the initial target commit before a later main commit |

The 2026-10-21 UI pass also records the moved-record state. These are the
order's cited inputs, not a new read of private intake. The fixture's
judgments are explicitly synthetic and make no live-model claim.

## Rebuild and replay

From the repository root, outside a gate:

```sh
node scripts/harness.mjs bounded -- node scripts/fixtures/instance-with-history/generate.mjs
node scripts/harness.mjs bounded -- node docs/evidence/WO-232/controls.mjs
```

The generator exports a committed copy of the current workspace, uses
`activate`, `amend-order`, the completion commands, `worktree start` and
`target-records`, and creates the bundle from two refs. It refuses a live
gate. No real forge or live model participates. Its optional positional
destination writes a candidate bundle elsewhere; without one it rebuilds
the committed fixture. A new shape requires a manifest entry and the next
planning pass's decision; ordinary gates never regenerate the bundle.

The control script runs the same suite twice. The base arm replaces only
the three reader files in its disposable core with activation-base bytes;
the exporter, runner, bundle and check sequence are otherwise the same.
`controls.json` records each arm's assertion exit code, every command's exit
code and output, elapsed time, bundle digest and self-member observations.
The negative arm must expose the named amendment refusal and both false
divergence marks; the positive arm must pass every check.

The paired control refreshed at 2026-10-25T15:34:51Z took
25.501 s at the base and 24.293 s at the repaired head. The base failed
planning with `unmatched execution amendment WO-001`; both self members
were `diverged`, stale `yes`. The head passed all five commands and read
both members `current`, stale `no`, with base and target equal to main.
Both arms name bundle SHA-256
`e5ab2fe0db7a4269730fa13e069a4f3bca87e5cce293802d80f37e081a04f6bf`.
The head reader digests match the current files. The complete-review suite
passed in 72.610 s; its concurrent timing and these isolated controls are
not interchangeable measurements.

The separate `verification-001-amendment.mjs` probe binds a field and body
change with the activation-base reader in a disposable clone, then checks
the same records with the repaired reader. It exited 1 before the repair
and 0 afterward, as [D009](decisions.md#wo-232-d009--preserve-the-prior-binding-representation-while-adding-the-field-admission)
records. Permanent plan-refutation cases cover the old binding across three
filed-title shapes, later release labels, execution appendices and rejected
substantive edits. The bundle itself retains its original four shapes;
[D010](decisions.md#wo-232-d010--retain-the-historical-bundle-and-board-its-next-shape-expansion)
and FUP-912bcf619a547236 carry its additional historical-shape coverage.

The separate `verification-002-field-only.mjs` probe checks the writer's route
when grouping is the only change and no active amendment exists. It exited
1 before the second repair and 0 afterward: both the closed and open order
now bind through `amend-order` and pass the following plan check. The
unbound field still refuses. [D012](decisions.md#wo-232-d012--retain-a-grouping-only-amendment-instead-of-erasing-its-change)
records the narrow fallback and [repair-002-evidence.json](repair-002-evidence.json)
records the executions. The prior-binding probe still passes. Permanent
cases also cover grouping beside release-label changes and later execution
records, while retaining substantive-change and horizon refusals.

The third repair applies the exact field admission to both historical title
formats. The unchanged `verification-003-legacy.mjs` moves from exit 1 to
exit 0, including the repository's WO-159 legacy row. The separate
`repair-003-compatibility.mjs` compares the locally retained pre-repair
checkpoint with this reader: 216 identical writer outputs, 770 preserved
matches, 1,164 objective-change refusals and 38 live rows admitting the
added field. Replaying that comparison requires the recorded checkpoint;
it is a local before/after observation, not a dependency of the product gate.
`repair-003-mutation.mjs` runs the same three permanent cases against the
subject and a deliberately widened field pattern: subject pass 3, mutant
fail 3. [D015](decisions.md#wo-232-d015--apply-grouping-admission-independently-of-historical-title-formats)
and [D016](decisions.md#wo-232-d016--test-malformed-fields-at-the-matcher-and-gate)
record the rule and test boundaries; [repair-003-evidence.json](repair-003-evidence.json)
records the probes, failed first review and passing fresh complete review.

## Inspect each shape

Create disposable clones from the repository root:

```sh
instance_history_scratch=$(mktemp -d "${TMPDIR%/}/dotln-history-inspect.XXXXXX")
git clone --quiet --branch main scripts/fixtures/instance-with-history/instance.bundle "${instance_history_scratch}/instance"
git clone --quiet --branch fixture-target scripts/fixtures/instance-with-history/instance.bundle "${instance_history_scratch}/target"
```

Shape (a), the amendment and later field after close, is visible in one
history command:

```sh
git -C "${instance_history_scratch}/instance" log --reverse -p -- docs/work-orders/WO-001-history.md docs/control/orders/WO-001.jsonl docs/control/plan-refutations.jsonl
```

Shape (b), the document and its two closed self members:

```sh
git -C "${instance_history_scratch}/instance" show HEAD:docs/workstreams/WS-001-history.md HEAD:docs/control/orders/WO-001.jsonl HEAD:docs/control/orders/WO-002.jsonl
```

Shape (c), the immutable move binding and bound decision (the launchpad's
decisions path is absent; its target bytes match the move record's digest):

```sh
git -C "${instance_history_scratch}/instance" show HEAD:docs/control/orders/WO-003.jsonl HEAD:docs/control/plan-refutations.jsonl
git -C "${instance_history_scratch}/target" show HEAD:docs/evidence/WO-003/decisions.md
```

Shape (d), the activation base and the target's later history:

```sh
git -C "${instance_history_scratch}/instance" show HEAD:docs/control/orders/WO-004.jsonl
git -C "${instance_history_scratch}/target" log --reverse --oneline
rm -rf -- "${instance_history_scratch}"
```

The suite asserts these shapes directly before applying the update, including
the pre-field parent commit, receipt source, move digest and target ancestry.
It requires the offered reader bytes to be installed, snapshots authored
records and control events across the update and checks, then requires two
self members current at main while the updating branch is one commit ahead.

## Final review

[FINAL-001](../../final-reviews/WO-232/FINAL-001.md) integrated `main` at the
activation base (a no-op merge; [D018](decisions.md#wo-232-d018--integrate-main-at-the-activation-base-with-nothing-taken-in)),
read the identity `98839c72…` unchanged before and after, reran the four
criterion suites as single-suite gates and the five verification probes under
the bounded wrapper with the same outcomes, ran the printed affected checks,
and passed with no finding of its own. VER-001's F2 and VER-004's F6 stay
boarded: F6's register row is deferred to the next order that edits the
admission, and F2's keeps the deferral the second repair recorded
([D019](decisions.md#wo-232-d019--final-review-pass-at-the-integrated-identity-ver-004s-f6-and-ver-001s-f2-stay-boarded-f6s-register-row-is-deferred-and-the-receipts-known-issues-are-judged)).
The committed bundle's own index records the target member `behind`, stale
`yes`, and the bundle's whole history was screened for private identifiers
with none found beyond the exported kit's synthetic test strings.
