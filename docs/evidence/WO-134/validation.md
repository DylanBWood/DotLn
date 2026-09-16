# WO-134 executor validation

Dispatch: `resume: next`, 2026-09-16. Actor: Codex CLI 0.154.0,
GPT-6 Astra, max effort, operator-attested under the repository default;
effective model/effort readback is unavailable. The CLI version was observed
with `codex --version`. One writer owned this worktree; a separate agent
performed read-only design and diff review, not formal verification.

| Check | Result | Evidence |
| --- | --- | --- |
| `node scripts/test-plan-refutation.mjs --fixtures-only` | 33 tests passed, 158.94 s | [Fixture transcript](plan-fixtures.txt) |
| `npm run test:docs` | 17 suites passed, 126.89 s | [Document transcript](test-docs.txt) |
| `npm test` outside the host sandbox | 19 suites passed, 63 fresh tasks, 246.71 s | [Product transcript](npm-test.txt) |
| Changed-script Prettier check | Passed | Executed against all four changed scripts |
| `git diff --check` | Passed | Executed before handoff and inline in the completion transition |
| `npm run release -- prepare --local` | v0.23.0 remains current | Local tag snapshot only; patch classification retained |

The added regression exercises two same-day passes in both ledger orders,
both direct and fake external transport dispatches, all-judged receipt ordering,
evidence-only receipts, single and multiple dates, ambiguous unjudged headings,
and same-day/future-dated headings exempted at introduction. Consecutive
full-scope direct judgments with an unchanged subject use distinct saved
requests, retain previous bytes, and can file a legacy pointer. The direct
fixtures finish with a passing two-pass gate. External fake transport supplies
deterministic selection evidence, not a live independent judgment.

The current planning gate admits all 15 historical receipts and six enforced
passes. The targeted run reports equal judged, committed and workspace subject
hashes and no continuation updates. No receipt, package, dependency, capability
or generated application output was changed. The map dispositions, decisions
index, follow-up projection and work-order index are the required write-backs.

An initial document run was stopped before correcting the exemption and saved
request edge cases; no pass was recorded. The first sandboxed product run hit
two existing native-process fixtures: their `sandbox-exec` probe requires an
outside-sandbox runner. Both passed in the approved outside-sandbox focused
run (2 tests, 2.69 s). The sandboxed product run was stopped with no pass
recorded, then the complete product gate passed outside the sandbox. No fixture
was disabled and no native-process source was changed.

The fixture and document runs overlapped, so their times are not additive or
isolated performance measurements. The final targeted regression alone took
20.57 s; its full-suite run took 52.24 s while document checks overlapped.
These observations establish behavior, not a measured reduction in operator
time. The reviewer still owns the final-review product-gate row and integration.

Limits: multiple unjudged headings on the latest enforced date report ambiguity;
they do not acquire invented chronology. Out-of-date-order receipt workflows
remain a reopening condition in [D001](decisions.md). Formal verification,
final review and publication require their separate dispatches.
