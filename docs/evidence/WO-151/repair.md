# WO-151 repair — VER-001 findings

Dispatch: `resume: fix`, 2026-09-22, recorded by the harness before this
procedure loaded. Subject: the three findings VER-001 routed to repair, with
their structured follow-ups WO-151-D012, D013 and D014. VER-001 and the
implementation record are unchanged; this record adds WO-151-D015 through D018.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}

The harness exposes no effective model or effort readback, so the model and
effort above are the operator-supplied values carried by the dispatch briefing,
not a session measurement; the version is what `claude --version` reports at
handoff. The reviewer and refuter this repair launched are a separate actor:
`claude-fable-5-1` at `max` on claude-code 2.1.278, recorded in REFUTATION-003
as `command-line-readback-and-invocation`.

**Process cost:** entry counters were unavailable
(`counter-unavailable`, 2026-09-22T14:27:14Z); at handoff
`node scripts/harness.mjs usage 76c698d3-3524-49a4-a029-f159cd9c6eb3` reports
totalTokens 27,129,408 (input 294, cached input 26,666,694, cache write
359,919, output 102,501), reasoning tokens and dollars unavailable, source
`claude-transcript-message-usage`, scope `dispatch`, cutoff
2026-09-22T15:00:01Z, over 153 recorded steps and 134 commands. Observed
subagents 0 against the configured cap of 20, with 20 remaining and an unknown
unobserved remainder: no agent was spawned, and the one external worker this
repair launched is a transport episode, not a subagent. That episode cost 458 s
and USD 2.8989 (list); the two cheaper alternatives to it are weighed in D017.

## Findings and repairs

1. **Finding 1 — a changed tracked status could orphan a pending dispatch
   (D012 → D015).** `review` and `refute` now refuse a new dispatch while one
   of that kind is pending, whatever subject it names, and the refusal names
   the open episode, its subject prefix, its frozen copy and both recovery
   commands. The check runs before the frozen copy is made, so a refusal no
   longer clones about 250 MB it would immediately abandon. The refutation
   route had no pending check at all — an adjacent defect of the same class,
   repaired by the same guard. The regression dirties a second tracked path
   between two explicit reviews of one commit and asserts the first pointer,
   its frozen copy and its single pending record survive, that `discard` then
   releases that copy, and that the refused call made no second copy in the
   lane. A negative control with the pre-repair admission restored in place
   fails exactly that test (14 pass, 1 fail) and the file was restored
   byte-identical afterwards.
2. **Finding 2 — the authority edition was stale (D013 → D018).** WO-151
   authority revision 002 was minted after every other repair byte settled and
   the current-evidence selector was repointed at it; revision 001 keeps its
   bytes as the record of what the order bound before its role text settled.
   `node scripts/authority-evidence.mjs --check` exits 0 over 34 bundle
   comparisons. Clearing that preflight surfaced two further document rows
   this repair then fixed: the two publication editions were relocked, because
   this repair edited a linked product subtree, and the decisions index was
   refreshed. `npm run test:docs` now reports **20 passed, 0 failed, 20 fresh
   tasks**, with `PASS entropy` among them, against the 13 passed and 7 failed
   VER-001 recorded.
3. **Finding 3 — the live refutation had no post-episode confinement witness
   (D014 → D016 for the shape, D017 for the live evidence).** A refutation
   receipt now records the source repository's tracked status at dispatch and
   at filing with its byte-identity, the frozen copy's inventory before and
   after, the delta, the excluded manifest paths and the denied-tool list, and
   renders them in the immutable projection. Drift is recorded rather than
   refused, because a refutation's subject is always the named commit the
   challenged receipt carries, which the working tree cannot move — the same
   binding D009 recorded for the explicit review route. `REFUTATION-003` is
   that evidence live: the pinned route on claude-code 2.1.278, identity
   `entropy-reducer@1`, 458 s over 21 turns at USD 2.8989, tracked status
   `349dc6df…` before and after with `trackedStatusByteIdentical: true`, the
   frozen copy inventoried at 2,971 paths before and 3,811 after for a delta
   of 840, all build output, and zero denied tool calls. All four blinded
   subjects were attempted and all four survived again, so the survivor set the
   next planning pass reads is unchanged. `REFUTATION-002` keeps its bytes as
   the first live refutation; the disposition path resolves the latest
   refutation for a review, which `npm run entropy -- subject` now names.

## Defects met inside the repair

- **An immutability regression this repair introduced and closed.** The first
  rendering change read the new confinement fields unconditionally, so
  `npm run entropy -- check` crashed on `REFUTATION-002`, which was filed
  before those fields existed. A filed pair's bytes are immutable and the check
  re-renders every receipt, so the line is now emitted only for a receipt that
  carries the observation, and a fixture strips the fields from a filed receipt
  and asserts the projection is still itself. Recorded in D016.
- **A hash quoted in D009 does not match the receipt it cites.** D009's
  evidence line gives the review episode's after-hash as `e12b94d5…`;
  `REVIEW-002` records `349dc6df…`. The two are the same tracked status hashed
  with and without the trailing newline git prints, which the host's own helper
  trims before hashing. The receipt's value is the authoritative one; D009
  keeps its recorded bytes and its decision is unaffected. Recorded as the
  correction in D017.
- **Two documentation sentences that overstated the mechanism.** The operator
  guide said a second `review` was refused only "for the same subject", and the
  security document said the host "refuses a return whose tracked status
  moved" without naming the route-conditional guard D009 recorded. Both now
  describe what the code does, and product 03 names the inventory and both
  episodes.

## Checks executed (2026-09-22)

| Command | Result |
| --- | --- |
| `node scripts/test-entropy-review.mjs --fixtures-only` | 16 tests, 16 pass, 0 fail |
| `npm test` | **25 passed, 0 failed, 278.29 s, 69 fresh tasks** |
| `npm run test:docs` | **20 passed, 0 failed, 27.92 s, 20 fresh tasks** |
| `npm run entropy -- check` | `status: ok`; REVIEW-002, REFUTATION-002, REFUTATION-003 bound; two pre-mechanism pairs |
| `node scripts/authority-evidence.mjs --check` | exit 0, 34 bundle comparisons |
| `npm run publication:check` | 274/274 headings; both editions CURRENT (30 and 45 linked sections) |
| `git diff --check` | clean |
| `npm run release -- prepare --local` | `WO-151 target v0.42.0 remains current; no files changed` |

Two negative controls were executed and their subject files restored
byte-identical: the pre-repair dispatch admission (14 pass, 1 fail) and a
suppressed after-inventory (15 pass, 1 fail). The `gateStepCount` of 69 above
is the plain product gate; the 77 the order's known-issues note predicts is the
review selection the final reviewer runs, one above WO-149's 76.

## Limits

- Effective model and effort stay `unknown` at every level: this session's
  attestation is operator-supplied, and the launched worker's is an invocation
  readback, not a measurement.
- `REFUTATION-003` establishes that the tracked status did not move and
  inventories what the frozen copy gained; it does not prove the worker could
  not have escaped its copy. Claude does not path-confine a shell command, and
  the receipt says so.
- The live row was not re-reviewed: `REVIEW-002` already carries its
  before-and-after evidence, and D011 settled that a filed, undisposed review
  is a subject rather than a reason to buy another episode.
- Dispositions remain the operator's act inside a `planning: entropy reducer`
  pass; this repair disposed nothing, and `check` reports 0 dispositions and
  0 packets.
- Met and not fixed: both live refuters returned their attempts payload as the
  public session statement instead of prose, so that field adds nothing the
  bound report does not already carry. The host records what was returned. The
  follow-up is named in D017.

## Follow-up queue

Four items, all completed with their executed checks:
`adjacent-0001` (the pending-dispatch guard), `adjacent-0002` (the refutation
after-state), `adjacent-0003` (the live evidence at the repaired shape) and
`adjacent-0004` (the authority edition and the document gate). Nothing is
deferred or dismissed. The operator's one message during the repair asked what
a pending dispatch guard is; it was answered and carried no redirection.
