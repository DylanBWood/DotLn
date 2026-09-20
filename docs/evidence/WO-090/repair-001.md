# WO-090 repair of VER-001 N1

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

**Process cost:** entry counters were unavailable; handoff counters are recorded
in the ignored session receipt and operator response, with their source and cutoff.

The operator dispatched `resume: fix` on 2026-09-20. Canonical status selected
WO-090 and VER-001; the repair preserves that report and all four original
measurement records. The role uses current-session model/effort/version
readback. One fresh background refuter completed under D006, with no
descendants. This is an implementation repair for a fresh verifier
to judge, not a replacement verification verdict.

## Correction and change

VER-001 correctly found equal directed totals for the original relocation.
Its further claim that any reduction required dropping a rule was too broad.
WO-090 expressly includes retiring a paragraph already carried by a generated
skill or compiled unit. The goal card's **All phases** introduction repeats
the generated Goal Alignment procedure. The repair replaces that procedure
with a dated pointer and retains every unique qualification in the same
section. [D005](decisions.md#wo-090-d005--retire-the-duplicated-goal-alignment-procedure-and-preserve-its-unique-limits)
records the evidence, alternatives, mission and eight-trap comparison, and
reopens D001's unsupported impossibility conclusion on the same day.

The eight lens questions, mission, critical path, accuracy rule, platform lens,
decision surfaces and mechanism limits are unchanged. Product 07's cold-start
paragraph now distinguishes the fixture from real orders' citations and names
the measured cause of reduction. The original destinations and pointers remain.
The README's cold-start ceiling wording is also corrected: ten rows are
`within`, and two refuter rows are `unset`; every size is unchanged.

## Rule homes

The original All phases paragraph is the only additional paragraph retired in
this repair. Normalizing whitespace does not change the following comparisons.

| Original clause | Current home |
| --- | --- |
| Dated direction applies to all six phases, including executor/fixer | Dated All phases pointer; Goal Alignment and Process Cost occur in all six generated role skills, in both roots; executor skill explicitly covers repair. |
| Before a material solution, record goal and critical-path contribution | Every generated skill: “Before material choices, record mission/critical-path contribution”. |
| Record evidence of benefit and intervention risks | Retained explicitly in the goal card immediately after its NoOp paragraph. |
| Record the NoOp baseline and compare all eight traps | Generated Goal Alignment line names all eight traps, Naive Interventionism and NoOp; the unchanged NoOp paragraph requires the consequence of no change and why action or inaction wins. All eight questions remain. |
| Revisit the rationale when evidence or scope changes | Every generated skill: “Revisit changed evidence/scope”. |
| Verification and handoff compare observed outcomes with promised benefit | Retained explicitly after the NoOp paragraph; generated skills also require judging outcomes at handoff. |
| Required legal or release actions retain authority; NoOp is no veto or permission to abandon work | Retained verbatim, apart from wrapping, at the end of that same paragraph. |

No new directive, generated skill change or relocated input is needed. This is
the order's duplicate-retirement deliverable; the unique goal-card rules are
not shortened to obtain the result.

## Measurement

Use `measureHarnessContext()` from the unchanged `scripts/harness-context.mjs`,
with the unchanged synthetic WO-999 fixture and both skill roots. Compare each
profile's **after** field across the order's activation and repaired records;
the method's frozen legacy **before** and **lower** fields are not evidence of
this order's improvement.

The activation measurement was independently reconstructed in the repair by
passing every changed tracked file's activation-base bytes through the function's
`overrides` map. It equals the entire original
[harness-context-before.json](harness-context-before.json) object exactly.
That base is `f24b5d72`; use it explicitly after the authorized local commits.
The current measurement is
[harness-context-repair.json](harness-context-repair.json).

| Role | Activation bytes / lines | Repaired bytes / lines | Reduction |
| --- | --- | --- | --- |
| executor | 32,855 / 300 | 32,603 / 299 | 252 bytes / 1 line |
| verifier | 30,762 / 295 | 30,510 / 294 | 252 bytes / 1 line |
| reviewer | 36,666 / 373 | 36,414 / 372 | 252 bytes / 1 line |
| release-close | 22,504 / 239 | 22,252 / 238 | 252 bytes / 1 line |

Both skill roots have these figures. Each guide subtree falls from 6,205 bytes
and 83 lines to 5,953 bytes and 82 lines. Assertions checked strictly fewer
bytes and lines in every profile and identical directed input paths. Both
relocation destinations remain absent. The reduction is modest: 0.7–1.1% of
these totals. No latency or token saving is inferred from bytes.

`measureColdStarts()` produced [cold-start-repair.json](cold-start-repair.json),
deep-equal to the activation record for all twelve profiles: executor 23,154,
verifier 21,061, reviewer 22,279, release-close 13,967, planner 15,033 and
refuter 15,690 bytes in each root. Thus criterion 1's generated-text constraint
is preserved, alongside the actual reduction in its directed-load constraint.

The directed-load method defines four roles; planner and refuter participate
only in the six-role cold-start measurement. Actual orders can add different
cited inputs, so these fixture totals are not estimates of every real session.

## Validation and handoff

The release remains application v0.35.1 with unchanged components, as D004
classified. The repair adds no runtime, fixture, harness or test changes and
does not amend the acceptance criteria. `npm test` passed 21 suites, zero
failures, in 253.38 seconds (65 fresh tasks). The mapped-duty assertions,
publication lock check, release surfaces, 31 generated harness surfaces and
`git diff --check` also passed.
After filing the planning receipt, `npm run test:docs` passed 19 suites,
zero failures, in 18.38 seconds (19 fresh tasks), including both planning checks.

The planning check initially failed because it binds exact goal-card text.
[D006](decisions.md#wo-090-d006--operator-authorized-local-commits-refresh-the-planning-judgment)
records the operator's explicit exception for the local planning-subject and
refutation-receipt commits. This one-off cost was absent from the initial
implementation estimate. The general executor/refutation workflow conflict is
nominated there for planning; changing that machinery is outside this order.
The canonical [planning receipt](../../planning/refutations/2026-09-20-planning-1a0fb634704921a3-021.md)
records **aligned-with-findings**, with no holds, in 413,625 ms from dispatch
to filing. Its pass scope judged WO-146 and the sequence and carried 93
unchanged verdicts by hash; it did not independently verify WO-090. The two
new known issues concern unproven net recurring savings and the declared
cross-session-memory limitation on verifier independence. The helper's planning
check passed with equal judged, committed and workspace subjects. Independent
work-order verification remains separate.

Entry usage observation: 2026-09-20T16:47:10.442Z, source `unavailable`, scope
`dispatch`, all token and dollar counters unknown. Observed subagent admissions
were zero of cap 20; unobserved coverage remains unknown. The parent's explicit
session count is one refuter and zero descendants, not a hook observation.
Final counters and timings stay in ignored receipts and the response.
