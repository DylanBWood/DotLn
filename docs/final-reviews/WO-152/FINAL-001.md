# WO-152 FINAL-001 — final review

**Verdict:** pass. The deduplication, the regression, the component bump, the
re-minted editions, the live `claude-cli-print` mission-check row and the live
self-host episode are all present at the current subject and independently
re-checked here. VER-001's F1 is resolved and VER-002's pass holds. Final
review made one bounded addition inside the subject's own test file — the
story-contract case the planning pass's independent refutation asked for and
no earlier phase dispositioned — and re-ran the full product gate over it. No
finding routes to repair.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"unknown","source":"operator-attested"}

Human actor: the operator dispatched `resume: final review` in an attended
Claude Code session; the harness recorded the `final-review` dispatch before
this procedure loaded. The harness version is the binary's own `claude
--version` readback and the model is the session's declared model id. Fan-out
plan, stated before the first tool call that could have spawned anything: no
subagents, this review runs in one session. Observed use is 0 of the cap of 20,
`exact-observed`, with 0 unresolved admissions and 0 unlinked children; any
unobserved remainder is unknown.

**The recorded effort is wrong, and the header above reproduces it as
recorded.** The observed effort for this dispatch is `xhigh`: this session's
environment carries `CLAUDE_EFFORT=xhigh` and `~/.claude/settings.json` carries
`modelSettings["claude-opus-5"].effortLevel: "xhigh"`. I recorded `unknown`
without checking either, on the assertion that nobody had supplied an effort
and that Claude Code exposes no readback — two claims about absence that I
never tested, against this project's hard rule to check available evidence
before a factual claim and to obtain what is missing rather than fill the gap.
The operator caught it. The header is left matching the completion actor
because `assertActorHeader` compares the two as an exact string and release
close reads that event; the recorded transition is not repeated to repair a
record. `docs/control/current.md` therefore also carries `Effort drift: xhigh
-> unknown`, which is an artifact of this error and not an observed change.
The full account, including why the stale discovery probe that documents "no
readback" for this harness is boarded rather than edited, is
[D012](../../evidence/WO-152/decisions.md#wo-152-d012).

**Process cost:** entry 82869 tokens; handoff 9553752 tokens; source claude-transcript-message-usage

Both readings have dispatch scope. Their cutoffs are
2026-09-22T14:21:37.965Z and 2026-09-22T14:37:03.488Z. Cost in USD is
unavailable and `reasoningOutputTokens` is null. These are observed cumulative
counters, not limits; the unavailable values did not block the verdict.

## Subject

- Work order: `docs/work-orders/WO-152-mission-check-schema-ids.md`, read in
  full before the diff.
- Branch `wo-152`. `HEAD`, local `main`, `origin/main` and their merge base are
  all `5b4b99cab19eacaeb3d09775480c7ad2fa6dff5e`, re-fetched at review.
  `main` did not move while this order was in flight, so no integration was
  performed and no acceptance claim crosses a moved base.
- The complete verification sequence: [VER-001](../../verifications/WO-152/VER-001.md)
  (fail, F1) and [VER-002](../../verifications/WO-152/VER-002.md) (pass),
  both read in full.
- Ideation receipt: `docs/planning/entropy-reducer-dispatch-2026-09-22.md`
  §§1, 3, 9a, 10 and 11, and its independent refutation
  `docs/planning/refutations/2026-09-22-planning-9244f56be13bcb2f-024.json`,
  whose WO-152 rows I read in source rather than through the receipt's summary.
- Receipts and decisions: `implementation.md`, `repair.md`, `live.json` and
  D001–D009, all read before judgment; D010 and D011 are this review's own.
- No branch commit existed before this review, as the lifecycle requires.

## Goal-aligned outcome

The order's mission contribution is a transport, not a function. A mission
check is how an unattended episode is asked whether the work still matches its
contract, and the emitted JSON Schema is the interface an external CLI either
accepts or refuses. Refused, it fails before any model call, which is why
WO-100's resident and WO-111's hour were left with one usable transport. The
deduplication restores the second one, and the live row shows the restored path
returning a validated judgment rather than a green unit test standing in for
it. NoOp keeps the refusal and the single-transport dependency on the critical
path, so it loses plainly.

The eight traps, against the current subject rather than the order as filed.
**Policy resistance** was the live question on this order and it has been
answered twice: D004's measurement conflicted with a required criterion, VER-001
refused to let the measurement dispose of the criterion, and D008 corrected the
reading rather than the wording. The corrected record is the outcome I want,
because it leaves the narrower registered-source duty as a planning item
instead of as a precedent for waiving criteria. **Tragedy of the commons** and
**escalation** are the real costs here: three paid live episodes, USD 4.24 and
1.74 M tokens for an identity-only edition pair, plus one paid mission check.
The order budgeted that work and the append-only record accounts for every
attempt, including the two that bought nothing; I added no fourth launch and
re-ran no paid episode. **Drift to low performance** is guarded by the gate
itself: 69 fresh tasks and 25 suites at this subject, the same step count the
executor and both verifiers measured, so the new assertions cost no task.
**Rule beating** is the trap this review acted on. The delivered regression
could have passed with the third reference source never exercised, because no
test in the repository sets a story path; that is coverage-shaped evidence
standing in for the claim, and D010 closes it with a negative control rather
than an argument. **Success to the successful** does not apply: nothing here
privileges the already-minted editions. **Shifting the burden to the
intervenor** improves — the criterion-4 conflict is resolved inside the
lifecycle instead of being handed to the operator as a waiver to ratify — while
one queue-hygiene link is deferred to a later executor phase, which is the
phase that owns it. **Seeking the wrong goal** is the standing risk of a
lifecycle that can be completed with green checks; the live row and the two
recorded refusals are the counterweight, because neither is a check this
repository can make pass by itself.

Under Naive Interventionism, the useful functions to preserve were the
validator's membership test, the two other reference kinds, the release-label
normalization D004 measured and the existing regression; none is changed. The
smallest sufficient probe for the one thing left unproven was a single subject
with a story contract and two assertions, not a second document in the shared
fixture that would have moved all 17 tests in the file. The smallest sufficient
probe for everything else was the current strict checkers plus one product
gate, because repeating either paid launch would test no changed subject.

## Instrument disclosure

- The WO-152 regression is part of the subject and is also this review's
  instrument for criteria 1 and 2. I read its generic walk, its non-vacuous
  seven-enum guard and its literal lists in source, then ran my own negative
  control against the delivered source before trusting the green row.
- `scripts/evidence-resident-binding.mjs` produced the filed mission-check row
  and is unchanged by this order. The row establishes the recorded launch; it
  is not evidence of the current schema, which the regression and the gate
  establish.
- The authority and feedback checkers are the mechanisms criterion 4 names, so
  I did not rely on their exit codes alone. I compared the two editions with
  WO-149's byte for byte and field by field myself, and parsed the fresh
  verifier stream myself.
- `npm run meta` and `npm run plan -- followups --sync` wrote generated
  projections during this review (the decisions index and two public follow-up
  rows). Their outputs are projections of records I authored, not independent
  evidence for any claim in this report.

## Executed checks

| Check | Result |
| --- | --- |
| `npm test -- --review` (product gate) | **Pass: 25 suites, 0 failed, 277.28 s, 69 fresh tasks, exit 0.** Recorded row: tree `468ef4ab9373c7263b4421bac343977425b9cada`, code identity `38a779054dd1601b3295df212d3e73510fb8021e4a279385cceea1ffda22b20f`, 2026-09-22T14:32:45.656Z, `partial` absent, sandbox marker `claude-code` with `inForce: false`. |
| Gate identity comparison | The executor's repair gate and the verifier's gate share code identity `41cbc25a`; this review's is `38a77905`. Only the reviewer row binds the story-contract assertion, so the earlier two are not evidence for it. |
| Focused WO-152 regression | **Pass**, 1/1 in 138.17 ms after a fresh build; reports no duplicate item across 7 emitted enums for the unchanged, renumbered and story contracts. |
| Negative control, story source | Deleting the story-contract spread from `missionReferenceIds` and rebuilding fails the new eight-id assertion — `actual` missing `contract:criterion:4` — and nothing else in the file. The source was restored from a copy taken before the control and re-measured at the delivered 10-insertion/3-deletion hunk. |
| Authority edition | **Pass**: two unchanged programs, both named migrations, four widening rejections, nine runtime denials, grant restoration, 34 bundle comparisons. Independently: `cmp` against `WO-149/authority/002/authority.json` exits 0, and the two `bundle-diff.json` files differ in one key, `comparison`. |
| Feedback edition | **Pass**: ten passing regressions, ten removal failures, 1,192 saved instruction bytes, with no retained-audit line. Independently: a recursive field comparison against `WO-149/feedback-002/feedback.json` reports exactly one difference, `.subject`. |
| Fresh self-host stream | Parsed 642 events independently: 3 `WorkerAttemptStarted`, 2 `WorkerInterrupted`, 1 `WorkerCompleted`, 1 `VerificationWorkerResultObserved`, 1 `CommandResult`. Matches the repair receipt's three-attempt account. |
| Live mission-check row | Parsed: label `observed`, one exit-0 `claude-cli-print` run, model `claude-haiku-4-5-20251001`, effort `xhigh` (selected), CLI 2.1.278, validated `drift` verdict, `failure: null`, `blockedReason: null`, 14 changed paths, 0 omitted, 0 changed ignored entries, no physical path filed. |
| Console evidence | **Pass**: all five cases match in JSON, terminal and HTML after the self-host re-pin. |
| `release check-surfaces --local` | **Pass**: 44 PASS rows, 0 FAIL, at v0.41.1 / skeleton 0.35.1. |
| `release prepare --local` | "WO-152 target v0.41.1 remains current; no files changed"; the reviewed PR body's meter block was refreshed to cutoff 2026-09-22T14:35:48.547Z. |
| `check-publication.mjs`, `meta.mjs --check`, `format:check`, `git diff --check` | All pass; `git diff --check` clean after the last edit. |
| Dependency and suppression review | No third-party dependency changes; the manifest and lockfile diffs move only the skeleton version and the console pin. No `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck` or `prettier-ignore` is introduced anywhere in the authored `packages/` diff. |
| Integration | None required: `HEAD`, `main` and `origin/main` are the same commit after a fresh `git fetch`. |

## The verification sequence

**VER-001 (fail, F1) was right, and its finding is the most valuable thing in
this order's record.** It found criteria 1, 2, 3 and 5 met and failed the
subject on criterion 4 alone, against an executor decision (D004) whose
measurement it independently reproduced and did not dispute. Its reasoning is
the one I would want applied to me: a required deliverable is amended by the
operator through `amend-order`, not disposed of by the role that owes it, and a
passing staleness check is not the re-mint the criterion names. It routed one
bounded repair and did not widen.

**VER-002 (pass) judged the repaired subject on evidence I could reproduce.**
Its resolution of F1 rests on comparisons I repeated independently here — the
byte-identical authority edition, the single-field feedback difference, the
three-attempt stream, the repointed `current.json`, the untouched
`docs/evidence/WO-148/decisions.md` — and each held. Its three recorded limits
are accurate and I carry them forward: it did not repeat either paid launch,
the mission check's 46.8-second episode duration is a bound rather than a
measurement, and the `invalid-result` diagnosability gap is owned by D009 and
`FUP-ed431cc1c8ca9a52` rather than fixed. Its closing instruction to final
review — judge the integrated subject and re-mint if integration changes a
registered source — is discharged: nothing was integrated, and the one file this
review changed is in no edition's source list.

**The sequence contains no unsupported claim I could find.** Both reports
disclose their instruments, both record what they did not do, and the executor
recorded the judge's agreement with VER-001's finding (D006) rather than
suppressing it.

## The ideation receipt

The pass that filed this order records the nomination's provenance, its
placement against WO-151, its declined alternatives and its reversal
conditions, and the order's text matches what the receipt says was filed. Its
independent refutation returned `aligned-with-findings` with no hold and seven
known issues across the pass, of which one row is WO-152's. That row names two
things. The first — that the `evidence` enum is built by `missionEvidenceIds`,
which this order does not touch, so the objective's "no enum carries a
duplicate" is guarded for the judged subjects rather than in general — is
correctly scoped by the delivered walk and by D001's reopening condition, and I
add nothing to it. The second is that the regression fixture should carry a
story contract "so the third source's ids are proven kept". That one was not
dispositioned by D001–D009, by VER-001 or by VER-002, and it was true: `storyOf`
returns null unless the source declares a story path, `missionFixture()`
declares none, and no test in the repository referenced `storyPath`,
`storyContract` or `storyId`. The claim in D001 that first-seen order puts "the
story contract's ids next" was therefore carried by inspection alone.

This review closed it rather than boarding it, because the proof is one subject
and two assertions in a file already in the subject diff and the product gate
had to run once either way. See [D010](../../evidence/WO-152/decisions.md#wo-152-d010)
for the measurement, the negative control and the rejected alternatives,
including the fixture-wide change I declined for its blast radius. The
refutation's reopening condition for that row — "a story-contract subject's
clause ids are missing from the emitted reference enum" — now has a test that
fails when it happens.

## Defects met and not fixed

Two, neither in the delivered work; the first is this reviewer's own and is
recorded in [D012](../../evidence/WO-152/decisions.md#wo-152-d012) with the
stale harness discovery probe it exposed.

The second. This order's two deferred
adjacent-queue items carry the literal string `planning` as their disposition
target instead of the public follow-up identifiers the queue's advisory asks
for. The identifiers exist and are synced (`FUP-81651a93f657301a` from D004,
`FUP-ed431cc1c8ca9a52` from D009); only the link is missing.
`scripts/adjacent-work.mjs` refuses queue mutation outside the `active` or
`repairing` phase, and repeating a recorded transition to re-enter one is not
available to any role, so this phase cannot discharge it. It is pre-existing —
`adjacent-0001` carried the same literal target through `implementation-ready`
and VER-001 — non-blocking, and `meta --check` passes with it. It is boarded in
[D011](../../evidence/WO-152/decisions.md#wo-152-d011) with a named follow-up
for the next executor dispatch, synthesized as `FUP-2f3b263bf7099dee`.

## Acceptance criteria

| # | Verdict | Independent evidence at this subject |
| --- | --- | --- |
| 1 | **Met.** | The `contract-clause` branch collects all three sources through a `Set`, which is first-insertion order; `thesis` and `exclusion` return their single projected lists unchanged and `validateMissionCheckResult` is untouched. The regression asserts the six-id unchanged list, the seven-id renumbered union and, as of this review, the eight-id union when a story contract supplies an id of its own. |
| 2 | **Met.** | The generic walk reaches all 7 enums for every judged subject and finds no duplicate item; the `enumPaths.length === 7` guard forbids a vacuous pass and the literal lists forbid an empty-list pass. Two negative controls, the executor's on the `Set` and mine on the story source, each fail exactly one assertion and nothing else. |
| 3 | **Met.** | The filed row records one accepted print-transport invocation against a real bound store with CLI, model and selected-effort provenance, a returned validated verdict, no failure or block, bounded timing and counts-only capsule paths. Operator-review assumption 2 authorizes the launch and the activation is recorded. |
| 4 | **Met.** | Skeleton is 0.35.1 and the console pin and both lockfile locations follow. Both WO-152 revision-001 editions exist, are selected by `docs/evidence/current.json`, pass their strict checkers, and their measured reasons for changing are recorded and reproduced here. The live self-host episode is in the stream with all three attempts. D008 records the correction, D009 the refusals; `docs/evidence/WO-148/decisions.md` has no worktree diff. |
| 5 | **Met.** | `npm test -- --review` green at the reviewed code identity, `git diff --check` clean, no dependency added, no suppression introduced. Fixture effect on the gate step count: **none** — 69 fresh tasks at the executor's, both verifiers' and this review's gates. The new test is one step inside the existing `mission-check` file, measured at 117.4 ms by the executor and 138.2 ms here, against a file that runs in about 6 s. |

## Integration, release and publication

Nothing to integrate: the branch and `origin/main` are the same commit. The
release stays the patch the order declared: `v0.41.1` over the observed
`v0.41.0` tag, `@dotln/skeleton` 0.35.1, no verdict rule, event, hook or
transport change, and a result that validated before this change still
validates. The reviewed `PR.md` and the five-section `RELEASE-NOTES.md` are
committed beside this report with one physical line per prose paragraph, a
gitmoji in the title and no attribution of any kind.

## Limits and handoff

- I did not repeat either paid external launch. Their immutable rows establish
  the historical launches; the regression, the edition checkers and the product
  gate establish the current subject.
- The live mission check's episode duration remains a 46.8-second bound from
  store clock samples, and its effort remains the launch selection rather than
  an effective readback.
- The `evidence` enum's freedom from duplicates is established for the judged
  subjects, not in general; `missionEvidenceIds` is untouched and the generic
  schema check remains a declared non-goal with D001's reopening condition.
- The effort recorded in the control event is `unknown` and wrong; the observed
  value is `xhigh` from two sources named above, corrected in D012 rather than
  by re-recording a closed transition.
- `docs/discovery/environment.json` still classifies claude-code's effective
  effort readback as `not found`, which 2.1.278 falsifies. It is a registered
  feedback evidence source, so correcting it owes an edition re-mint and a paid
  live episode; it is carried as D012's follow-up.
- `adjacent-0001` and `adjacent-0002` remain targeted at the literal string
  `planning`; the retarget is boarded in D011 for the next executor phase.
- Release close consumes the passing gate row recorded above; it runs no suite.
