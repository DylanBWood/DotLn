# WO-155 implementation — cold-start trends with the completeness fallback

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.156.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

Dispatch: `resume: next`, 2026-09-24. Application `v0.46.1` and skeleton
`0.39.1` are prepared locally. Independent verification and final review are
the next lifecycle stages.

The meter now shows each role's installed bytes, ceiling, previous released
edition bytes and delta, and the last acceptance snapshot's bytes and delta.
Both `harness-context --check` and `npm run meta` use the same measurement.
The baseline is the highest reachable local release tag; a sibling's
unintegrated release is excluded. Last acceptance means the first committed
snapshot on HEAD's first-parent history containing the latest global
acceptance, selected by date then record order. Missing history or files stay
unknown with a cause. The comparison never treats a ceiling or a number in
historical reason prose as a byte measurement.

`--check` now explicitly evaluates and prints advisory budget breaches;
no flag prints the measurement alone. The usage line describes that behavior.
The existing budget verdict and acceptance route are unchanged.

## Acceptance evidence

| Criterion | Result and evidence |
| --- | --- |
| 1 — loading completeness | [Six observed paths](skill-loading.json): Codex root and fresh worker, Claude root and fresh Explore worker, Copilot root and fresh task worker. Both Claude and Copilot fresh workers lacked the floor before reading the skill. Observations report delivered context, not loader internals or exactly-once loading. |
| 2 — deduplication | **Declined under criterion 1**, as expressly allowed by the order. The full paragraph remains in each skill. Both generated roots and `CLAUDE.md` are unchanged; the generator check and existing WO-157 role-baseline regression pass. No new role oracle is needed for unchanged output. See [D003](decisions.md#wo-155-d003). |
| 3 — trend and budgets | [Current measurement](cold-start-after.json) is schema 3 and carries the comparison and acceptance source. The meter's drift row includes those same profiles. `docs/control/budgets.json` is byte-unchanged. Tests exercise a breach with `--check`, no-flag output, an unknown option, and CLI/meter equality. |
| 4 — before/after | [Before](cold-start-before.json), [after](cold-start-after.json), and [D005](decisions.md#wo-155-d005). No cold-start reduction is claimed. The two roots have identical role measurements. |
| 5 — release and editions | Skeleton `0.39.1` and its console/lockfile pins; fresh [authority](authority/001/authority.json) and [feedback](feedback-001/edition.json) editions selected in `docs/evidence/current.json`. One live `codex-cli-exec` self-host audit using `gpt-6-astra` / `xhigh` completed on its first attempt with ten fixtures. Selected artifact/verification editions still pass. |
| 6 — checks and write-backs | `npm test -- --review`: **33 passed, 0 failed**, 77 fresh tasks, 562.81 seconds. Focused metric, unchanged-product-prose and role-baseline tests: 4 passed. `git diff --check`, planning, publication, release surfaces, harness emission/evidence and evidence-edition checks passed. Two tests added inside the existing process-debt suite; zero added gate steps, unchanged runner with 56 suite declarations. No new dependency. |

| Role | Before = after bytes | Ceiling | Delta from v0.46.0 | Delta from last acceptance |
| --- | ---: | ---: | ---: | ---: |
| Executor | 25,183 | 29,246 | 0 | 0 |
| Verifier | 21,893 | 25,151 | 0 | +832 |
| Reviewer | 23,071 | 24,576 | 0 | +1,772 |
| Release close | 14,013 | 16,384 | 0 | +1,576 |
| Planner | 16,161 | 24,576 | 0 | Unknown: no acceptance |
| Refuter | 15,736 | Unset | 0 | Unknown: no acceptance |

The two new test cases cover moving release baselines, an unrelated higher
tag, Unicode bytes, older and scoped acceptance records, shallow or absent
history, missing historical/current files, budget preservation and shared
rendered/JSON results. The passing gate's transcript and usage observations
remain in ignored local evidence; its canonical gate row records the tested
code identity. This executor gate does not replace the separately dispatched
final review.

## Decisions and limits

[D001–D005](decisions.md) record the sources, alternatives, goal comparison,
experiment and reopening conditions. The economy probe found equal sizes for
all thirteen files using one tree query instead of thirteen file queries;
per-order time or token savings remain unmeasured.

The original nomination's re-mint premise predates WO-154's behavior key.
All four prior edition checks passed before this order re-minted authority
and feedback. Those two editions changed to satisfy the order's explicit
criterion 5 and record its requested current episode; no stale prior live
audit is alleged. Its 1,192 saved instruction bytes describe the feedback
fixture's matched projection, not this order's cold-start result. The actual
refusals emission lives in `packages/compiler/src/harness.ts`, which required
no edit under the fallback.

Seven worker launches were used across the bounded loading probes and the
one live audit, including descendants. This is an explicit session count;
the Codex hook counter did not observe those admissions. No second writable
coding agent operated in this worktree. Raw session identifiers/transcripts
and final usage counters remain in ignored receipts and the handoff.

Reopen deduplication when fresh workers in every supported harness receive
the complete floor before their role skill. The current observations support
retaining the complete skills.
