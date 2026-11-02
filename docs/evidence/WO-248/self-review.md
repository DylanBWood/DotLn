# WO-248 independent implementation reviews

These are the executor's retained summaries of three independent worker reports.
All three started after implementation and write-backs were complete, then
rechecked the final diff after the consistency repair. All finished before the
complete gate. No worker edited this worktree or launched a gate or descendant.
The executor remains the sole writer.

Worker type: `codex-spawn-agent`. Requested pins: `gpt-6.1-sol`, effort `max`,
`fork_turns: none`; no independent effective-model or effective-effort readback
was supplied. The explicit session count is three worker admissions, reused for
the second round, within the cap of twenty. The harness usage command reported
zero observed subagents with an unknown uncounted remainder; it did not observe
these host admissions and does not replace the explicit count.

## Criteria adversary

Worker: `/root/criteria_review`. Found 0; fixed 0; recorded 0 in both rounds.
Reviewed the order, collector ordering, renderer and terminal output, both
release callers, changed process-debt assertions, the release meter fixture and
duration/body helpers. Subject isolation, selected closed subjects, unknown and
zero cells, comparison references and old-block replacement were covered.

The bounded single test “the subject meter has one value per cell and labelled
closed-order comparisons” passed: one test, zero failures. The final recheck
confirmed the added direct-dependency declaration; no changed rendering or new
concern justified rerunning the probe. The collector's existing five-closed-order
selection is the order's stated boundary, not a request to expand history.

Limits: no full gate, document/version judgment or GitHub viewport judgment.

## Design improver

Worker: `/root/design_review`. Found 0; fixed 0; recorded 0 in both rounds.
Reviewed the renderer, both release callers, collector metric construction,
affected fixtures and shared duration helpers. The change keeps subject and
comparison logic local, reuses duration formatting and removes compound-cell
and omission-count machinery. Both production callers pass their subject.
No additional abstraction was warranted. The final machinery declaration
introduced no design concern. No probe was needed.

Limits: read-only maintainability inspection; no criterion verdict, adversarial
test design, documentation/version judgment or visual rendering check.

## Consistency reviewer

Worker: `/root/consistency_review`. One distinct finding; fixed 1; recorded or
deferred 0 after recheck. F1 identified the new direct `github-body.mjs` import
in `test-process-debt.mjs` missing from `machinerySources["process-debt"]`.
The bounded existing declaration-inventory test failed with
`process-debt: uncovered scripts/lib/github-body.mjs`, then passed after the
executor added that source. Both runs executed one test. The repair and its
reason are [D003](decisions.md#wo-248-d003).

The final report confirmed these producer/consumer paths:

| Producer | Consumer and disposition |
| --- | --- |
| Meter renderer | Process-debt shape, selected closed-order and missing/zero assertions agree. |
| Direction collection and detailed terminal output | Revised assertions preserve the removed Work-table metrics in terminal text. |
| Named subject in both release callers | Stored-body fixture checks two open orders, replacement and final-block placement. |
| Generic marker and body helpers | Existing github-body checks remain valid; their direct dependency is declared. |
| Script modules | Whole-library fixture copies and kit export include them; case names and inventories remain valid. |
| Product 07 | Publication source lock and kit inclusion agree with the new shape. |
| Decisions, control, work order and indexes | Anchors, active phase, satisfied dependencies and v0.110.1 target agree. |
| Package and evidence surfaces | No component source, dependency or lockfile changed; no role-oracle or evidence-edition re-mint is needed. |

Limits: no release shell case, full/document gate, publication checker or remote
publication check run by the worker. Historical stored bodies remain historical;
raw journal provenance behind the bounded meter snapshot was not audited.

## Disposition

self-review: found 1; fixed 1; recorded 0

The complete review gate subsequently passed at the unchanged reviewed code
identity; [validation.json](validation.json) projects its relevant evidence.
No worker was restarted after that pass.
