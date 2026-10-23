# WO-219 executor handoff

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.164.0","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

All fifty allocated follow-ups have terminal dispositions recorded after
activation: 34 settled, 13 declined with reasons and three deferred with
selected safe defaults. The combined decline/packet count is 16 of 50,
within the cap of 16. The separately authorized moved execution-amendment
repair is included. Application v0.94.0 is prepared locally.

The VER-001 repair corrects the missing closed-order override write-back
and prevents a linked checkout from creating a pending record that the
next start cannot carry. The shared runtime-unavailable advice follows the
same route. The immutable failed verification remains the judgment of its
original subject; D076–D078 and the repair evidence below judge this repair.

## Acceptance judgments

**Criterion 1:** met — each of the fifty exact `npm run plan -- followups
--show` commands passed and reported a terminal disposition on its latest
source revision, dated after activation at 2026-10-23T13:49:39.138Z.
[repair-ver001-followups.json](repair-ver001-followups.json) rechecks every
command, exit, disposition, date and output digest after the repair; the
original read remains in [followups-show.json](followups-show.json). The three deferred ids have packets
below and reopening conditions naming the WO-219 pull request. None of the
fifty remains untriaged, open or allocated.

**Criterion 2:** met — the settled rows link their decisions to fixture
files, named cases and isolated positive/reversion controls, or to observed
already-met behavior at the baseline. [row-dispositions.json](row-dispositions.json)
and the README after table map every row to that evidence.
[repair-controls.json](repair-controls.json) contains 109 demonstrated
positive-0/reversion-1 pairs, of which one is superseded by the final
inventory control: 108 active proofs, including two supplemental checks.
The declared Preflight routes cover all nonsupplemental controls. The
three insensitive mutations are excluded from the proof set, with their
outcomes retained. [control-audit.json](control-audit.json) independently
audits the original selected logs; [runner-integration-audit.json](runner-integration-audit.json)
audits both final runner pairs. [base-controls.json](base-controls.json)
retains seven baseline observations. The two sentence-only rows use the
criterion's document exception, naming the changed section and baseline.
The fresh review's two classifier repairs have separate sensitive controls
in [self-review-controls.json](self-review-controls.json).
The verification repair adds sensitive routing and advisory controls in
[repair-ver001-controls.json](repair-ver001-controls.json), including a
detached linked-worktree case beyond the report's branch-worktree example.

**Criterion 3:** met — all thirteen declines record present harm, the
source evidence, rejected alternatives and a reversal condition in
[decisions.md](decisions.md). Planning nominations are declined to planning
without designing a replacement order. Counting the three operator packets
beside the thirteen declines gives sixteen, below one third of fifty.

**Criterion 4:** met — the final actual `followups --touching` read matches
17 pending records. Of this order's fifty rows, only its three
permitted deferred packets remain pending. The README names every other
match, preserving other-batch and candidate dispositions. The baseline and
current readers return identical continuation pages on the same final
register and changed-file inputs. Exact function and status-set equality
is rechecked on all three current pages in
[repair-ver001-followups.json](repair-ver001-followups.json); the earlier
16-row observation remains in [followups-touching.json](followups-touching.json).
[D062](decisions.md#wo-219-d062) and [touching-audit.json](touching-audit.json)
explain the eight initially matched outside-batch records. D072 and the same
audit's final addendum cover three additional matches from the later fixture
edits; all eleven retain their dispositions. The two new boarded observations
are identified below. The additional verification observation D075 /
FUP-938f66ad9b65e086 remains untriaged for planning and is named in README.

**Criterion 5:** met — the README before and after tables contain all fifty
ids, source restatements, decisions and checks. Pending count was 162 before
and 167 after implementation. Verification added D074 and D075, reaching
169; settling the repaired D074 follow-up leaves 168. The original fifty
allocated rows were already counted closed: their three packets and two
newly boarded implementation observations added five pending records.
No reduction from those fifty rows is claimed. [Before](followups-before.json),
[implementation after](followups-after.json) and
[repair after](repair-ver001-followups.json) retain revisions and cutoffs.

**Criterion 6:** met — product write-backs, security wording and the entropy
instance instructions describe the changed behavior in place. The runner
inventory and selected execution views are distinguished in product 07.
Publication checking passed; the final document gate includes the metadata
index check. The earlier criterion 6 judgment missed row 41's closed-order
route: D076 corrects product 07 §Operator recovery controls and product 03
§Corpus policy in place. D077 binds the main-checkout refusal, usable remedy
and shared fallback wording to that contract. D060 records the encountered WO-193 future-suite metadata
repair, canonically amended under WO-193-D001: its criteria and step-4
registration duties remain unchanged.

**Criterion 7:** met — `npm test -- --review` passed at 2026-10-23T22:06:34.512Z,
with 42 required suites, 108 executed task rows, zero failed
rows and zero unrun tasks. [repair-ver001-gate.json](repair-ver001-gate.json)
records the repair pass; [gate-runs.json](gate-runs.json) retains the original
implementation pass and all seven earlier unsuccessful attempts. The final current-tree
`npm run test:docs` row is required and consumed by repair completion;
`git diff --check` is clean. [regeneration.json](regeneration.json) records
the original sync and publication checking. The repair sync regenerated
WO-219 authority revision 005; artifact-identity, verification and feedback
revision 001 remained current under their checks (D078). There
are no new dependencies or changed external package entries. The changed
registered sources have their deterministic editions. Comparing edited
feedback sources through the existing judged-behavior projection finds no
changed judged behavior; only normalized internal component labels differ,
so no live feedback episode is owed.

The repair changes no `FEEDBACK_SOURCE_PATHS` file. Its shared advisory is a
registered evidence input; the deterministic sync/check result above is its
regeneration evidence, not an exemption inferred from the size of the edit.

**Criterion 8:** met — [moved-amendment-controls.json](moved-amendment-controls.json)
and its public replay driver record four separate exits for the same closed
target fixture: contained decisions pass fixed and reverted (0/0); moved
decisions pass fixed and fail with only the local precheck restored (0/1).
The moved case has a control-segment binding and no launchpad decisions
file. The fixed cases still reject a changed decision hash and an absent
decision id, preserving the log. The full plan-refutation suite includes
both locations. `amendmentDecision` now uses the existing bound reader;
`validateAmendment` retains the exact decision-hash comparison. Inspection
found no other decisions-file containment check on the amendment/writeback
path. Unrelated evidence-ref readers are unchanged. D061 binds the explicit
scope authorization and added criterion through canonical `plan amend-order`;
D063 records the result. The README has the requested **Read before
upgrading** line for v0.94.0.

## Deferred packets with selected defaults

These are the three expressly permitted packets, not requests for an
operator response. The executor selected and documented each safe default
under D003. The complete rationale, alternatives and conditional reopening
routes are in [operator-packets.json](operator-packets.json).

- **FUP-16a4af39c710459b / D014:** use selected effort readback for this
  execution, keep unavailable Claude mode unknown and preserve the filed
  WO-186 VER-001 actor. WO-186-D039 distinguishes mode from selected effort;
  no supported mode readback or historical-correction authorization was
  established. Codex ultra behavior is preserved. Reopen at review of the
  WO-219 pull request for the reserved Claude representation/historical
  correction policy, or when the host provides mode readback. Any later
  correction must use the canonical route and preserve filed report bytes.
- **FUP-a6cf30a8b7bc4a83 / D031:** record explicit selected effort for new
  Claude completions, preserve legacy historical normalization and leave
  unsupported mode unknown. WO-172-D014's old spaced-spelling observation
  has no located current failing matcher; no fix is claimed for it. Reopen
  at review of the WO-219 pull request for the cross-harness record policy,
  on supported mode readback, or on a captured failure at a named matcher.
  A later change is bounded to representation/readback and the demonstrated
  matcher, preserving existing records.
- **FUP-b3454d6ce3594ef3 / D035:** retain the current direction reader as a
  bounded rule-derived observation and preserve both historical batteries
  untuned. The held-out result remains 70/80, below the stated 95/100 target;
  it is not a passing validation. Reopen at review of the WO-219 pull
  request for the reserved choice between that advisory observation and a
  prospective structured field. Any changed reader requires a fresh
  independently labelled battery; no acceptance threshold changes here.

## Independent review and gate repairs

self-review: found 2; fixed 2; recorded 0

Two fresh read-only `codex-spawn-agent` workers, both `gpt-6.1-sol` at `max`,
received only the order and frozen diff. The criteria adversary reported one
mixed-quotation classification defect, then one inline-code variant during
its focused repair review: found 2, fixed 2, recorded 0. The design improver
reported found 0, fixed 0, recorded 0. Their reports and review boundaries
are retained under [self-review](self-review/criteria.md); the design report
is [design.md](self-review/design.md). Both repairs have executed positive
and single-reversion failures. The second repair was verified by the root;
no later worker acceptance is claimed. Four earlier research helpers plus
these two reviewers satisfy the requested minimum: six distinct workers,
reused for follow-up work. Only the root wrote this worktree or ran probes.

D065 records the first complete gate's compiler version mismatch and the
repair aligning the embedded version with the prepared component manifest.
That run was canonically stopped; its harness-fixtures cancellation is not
an independent assertion failure. D066 records the second complete gate's
four runner integration failures. A read-only `--list --selected` view now
lets handoff consumers request actual execution selection while ordinary
`--list --review` retains the required full inventory. The correction
fixture first creates a distinct unbound review before testing a wrong
identity, preserving the one-correction contract and existing assertions.
All four failing cases passed, and the primary runner file passed 165 tests.
The complete passing run additionally covers its three auxiliary fixture
files. Prior incomplete runs supply no complete passing claim.

D067 records two legacy expectations missed during integration. The role-cost
fixture now binds the current oracle to its byte-hashed predecessor, retains
the earlier savings and historical headroom assertions, and checks current
per-role growth and actual headroom without changing ceilings. The closed-order
fixture expects the already-authorized explicit-refresh guidance while
requiring written:false and byte-identical preservation of its snapshot.
Both formerly failing cases pass in [process-fixtures-recheck.json](process-fixtures-recheck.json);
no runtime behavior was changed for these fixture repairs.

D068 records the fourth run's stale emitted-role wording expectation. The
fixture now independently pins both authorized decision-ownership sentences,
requires them exactly once across every profile/role/economy setting, and
refuses both replaced arbitration phrases. The focused case passes in
[role-wording-recheck.json](role-wording-recheck.json); generated role text
was unchanged by this fixture correction. D004 also records a preparatory
format/sync overlap: both commands were awaited and formatting was rerun
after sync before the next complete gate began.

D069 repairs the real-generator fixture's old WO-193 metadata under the
current checker by carrying only the approved field repair, decision and
exact amendment when absent from cloned history. It asserts the unchanged
history prefix and all non-Preflight order bytes; the bridge is skipped
once committed. Two collision evidence arrays now expect the selected
ancestral-tag wording, preserving stdout and collision assertions. All four
previously failing cases pass in [integration-fixtures-recheck.json](integration-fixtures-recheck.json).

D070 corrects that first overlay's use of live source coordination records:
all 40 integration assertions passed in run 6, but the product-read guard
correctly refused 18 excluded-input reads. The approved bridge is now frozen
in a declared product fixture; full-source order hashes, stable decision
hash and the history prefix are checked against clone-derived bytes. The
suite retains product classification and its read guard.
[integration-read-guard-recheck.json](integration-read-guard-recheck.json)
records the guarded reproduction separately from the complete pass.

D071 records the seventh run's remaining export-fixture consumer of the old
review-list meaning. Its three-command prediction loop now requests
`--list --selected`; every execution command and assertion remains unchanged.
The complete run reached all selected tasks and had one failing fixture.
[export-selection-recheck.json](export-selection-recheck.json) records the
entire formerly failing case passing, including its later runtime, README,
evidence-consumer and explicit diagnostic assertions.

D073 records the first final document gate's five record errors and one stale
baseline notice. The same WO-193 decision was corrected and canonically rebound
without changing order bytes or earlier events; the D072 anchor now resolves.
Published examples use prose or an explicit fixture-derived placeholder whose
resolved mutation is byte-identical to the recorded control. The baseline writer
removed one obsolete fingerprint, admitted none and preserved all other fields.
These document repairs preserve the complete passing code identity. The failed
document attempt and repair checks are retained in [gate-runs.json](gate-runs.json).

## Outcome, cost and limits

### VER-001 repair

F1 is repaired in the product sections and the shared fallback advice.
F2 is repaired by refusing a closed-order pending write outside main,
preserving capture and control bytes, and printing a shell-quoted command
that selects the original order in main. Both branch and detached linked
checkouts execute that remedy in the fixture; the final gate uses portable
`sh`. The negative routing control failed before the refusal, and the
positive control passed afterward. The old advisory failed its direct
probe and the repaired advisory passed; the complete gate also executes
the emitted missing-runtime hook fixture. No cross-checkout writer was
introduced. D074 / FUP-d0af6cc30bccf70d is settled by those repairs.

F3 remains a planning observation, D075 / FUP-938f66ad9b65e086: the first
verification failed on a missing product write-back. This repair does not
dispose the planning receipt's reopened policy question. All fifty original
dispositions and the eleven pre-existing outside-batch matches are unchanged.

The repair outcome matches the bounded scope in D076 and D077. The complete
review took 1668026 ms, including waiting, at code identity
`effd942bf8351214bbefe46b32655ddc03e4981f7cb3d6e6e0aaaf0477faf940`.
The existing v0.94.0 release preparation remains appropriate; no additional
component bump or live feedback episode is owed (D078). No new worker was
launched during repair; the fresh-worker rule applies before
implementation-ready, whose reviews remain recorded above.

Repair usage was read from `codex-transcript-counter`, dispatch scope, at
cutoff 2026-10-23T22:07:08.874Z. Final counters stay in the ignored receipt
and the operator response; monetary cost remains unknown. A bounded
`inventoryMaterial` check at 2026-10-23T22:08:48.249Z returned an empty
inventory. The fixtures removed their temporary repositories. All repair
gate commands and waiters finish before repair completion; verification
remains a separate dispatch.

### Original implementation record

The outcome matches the amended scope. The executor owns implementation,
NoOp and deferral decisions; it requested no routine arbitration or criterion
change. The fifty asks are disposed with their evidence and limits, and the
single authorized field defect is reproduced and repaired. No other item
from the fork's 2026-10-23 pass is included. The actual fork update and
release publication remain later lifecycle actions.

The original passing complete run took 1674159 ms at code identity
`1e40476b807fa965dfd33c6a917dd9cef7920a6b35505e29bf59bed84a957409`. Its wall duration includes waiting. The seven earlier complete
attempts and focused repair checks are retained, not hidden by the final
pass. The append comparison tested both canonical decoded returns and an
explicit round-trip admission alternative; D007 selected canonical returns
while the stored corpus round-trip passed 533 streams and 25,019 events.

Two additional observations remain boarded. D008 / FUP-d2646e66a2dfdb40
preserves the immutable WO-105 manifest and defers its historical dynamic-demo
input-binding mismatch, observed identically at the checked base and changed
source. That historical sweep is not claimed green. D009 /
FUP-e08668268dea62b1 boards equivalent-usefulness cold-start optimization:
executor 29,484 bytes exceeds 29,246 by 238; reviewer 29,584 exceeds 28,884
by 700. Every ceiling and historical oracle is unchanged. The current
standing product rule retires the older ceiling-raise/acceptance route;
the new role oracle preserves the prior byte-exact snapshot and history.

Original implementation usage was read at handoff from `codex-transcript-counter`, dispatch scope,
with cutoff 2026-10-23T19:52:05.258Z. Final counters remain in the ignored receipt and
the operator response; monetary cost is unknown. Six workers were actually
spawned. Harness-observed admissions are zero with an unknown unobserved
remainder; that incomplete counter does not replace the explicit count.

D072 preserves three additional outside-batch matches. Role optimization remains
deferred with its current overrun recorded; D067 now asserts current installed
headroom while its separately boarded row remains untriaged. The unrelated
WO-225 nested schema-test child still inherits `NODE_TEST_CONTEXT` and checks
only exit status; the complete pass is not proof that those two child cases
ran. Its untriaged follow-up remains named in README, without claiming a fix.

The owned remote-free control clones were removed, with their heads, logs
and digests retained in [cleanup.json](cleanup.json). No nested disposable
repository remains outside intake. All executor-started gate commands and
waiters finish before implementation completion; no separate monitor remains.
Independent verification and final review are separate dispatches.
