# WO-078 executor handoff

The operator dispatched `resume: fix` for
[VER-002 F1](../../verifications/WO-078/VER-002.md#f1--blocking-the-checks-expected-version-still-comes-from-a-generated-file)
on 2026-10-11. The repaired check validates every captured non-null version
against Git before using it: an exact tag must point at its receipt commit,
and a nearest tag must point at that commit or an ancestor. A coordinated
invented version in both generated files now refuses without changing
either file. An untouched older observation still passes after a later tag
is added. [D012](decisions.md#wo-078-d012--repair-captured-versions-must-be-git-tags-at-or-below-the-receipt-commit)
corrects the prior repair's claim that a second generated file was independent
source evidence. [repair-002.md](repair-002.md) records the repeated verifier
probe, broader regressions, passing gates and limits. Goal alignment matched
the requested repair; no criterion was changed or waived.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.162.1","model":"gpt-6.1-sol","effort":"max","source":"codex-session-readback","accountLabel":"not-applicable"}

**Criterion 1:** met — export and update write exactly `sibling`, `coreCommit`, `manifestHash`, `buildHash` and `date` immediately after their manifest and automatically regenerate the registry and captured observations. The launchpad fixture proves the receipt against manifest bytes and the runtime snapshot, generation without a separate command, a byte-identical rebuild and the update's second receipt. The sibling fixtures reject purpose edits, latest-receipt manifest-hash mismatches and undecodable receipts. The repaired version rule requires literal Git tags at the declared commit relationship, never agreement between generated outputs alone. The repeated verifier probe now rejects its coordinated invented-tag case with exit 1; an untouched later-tag page still passes. Regressions additionally reject real tags at another commit, future or invented nearest tags, revision expressions and removed tags, without writes. Ordinary generation repairs the outputs; missing/malformed/incomplete observations and relocated roots remain covered. Measurements and the removed manual sibling manifest/build lookup (one checkout read per sibling per occasion; wall-clock unmeasured) are in D003 and repair-002.md. Gate: `npm test -- --review` passed at the identity below; launchpad 127,986 ms and siblings-fixtures 12,731 ms.

**Criterion 2:** met — the generated registry carries `DotLn-Enterprise-Starter` and `DotLn-Angular`, with the consumer's `uifa-board-v1` relation. Neither has a receipt here, and all six receipt-supplied fields in each entry read "not evidenced". The no-receipt fixture passes. Gate: `npm run test:docs` and `npm test -- --review` passed.

**Criterion 3:** met — `docs/README.md` Map carries the siblings root, and product 07 names it in the existing root list without a dated paragraph. The decisions and generated index include D012's corrected evidence boundary. Publication locks are current; `npm run publication:check` passed. The captured observation file continues to follow the configured siblings root and is registered with the page as a generated integration projection. Both launchpad generation and relocated-root fixtures pass. Gate: `npm run test:docs` passed, including publication, meta and index checks.

**Criterion 4:** met — `npm test -- --review` passed 38 suites with 0 failed and 90 fresh tasks; `npm run test:docs` passed 33 checks with 0 failed and 33 fresh tasks. Both canonical rows record unchanged code identity and build outputs. `npm run format` completed and `git diff --check` passed. `package.json`, `package-lock.json` and `packages/` are unchanged, so no new dependency or component version bump is required.

self-review: found 0; fixed 0; recorded 0 — separate correctness and maintainability passes by the repair executor, recorded in [repair-002.md](repair-002.md#review-and-passing-gates); no worker launched. The original implementation's two worker reports and 27 findings (24 fixed, 3 recorded) remain in [self-review.md](self-review.md). Existing nonblocking rows retain D004/D009's structured dispositions.

## Executed evidence

Tested code identity:
`08345dada9b32b66aea18810ab01be4c591fc200e234d231d6acc2e06c4f4faa`.

| Command | Recorded at (UTC) | Result | Duration |
| --- | --- | --- | ---: |
| `npm run test:docs` | 2026-10-11T17:21:21.037Z | 33 passed, 0 failed, 33 fresh tasks | 103,848 ms |
| `npm test -- --review` | 2026-10-11T17:45:57.365Z | 38 suites passed, 0 failed, 90 fresh tasks | 1,464,642 ms |

The ignored canonical gate receipts report `executed: true`, `exitCode: 0`,
`identityUnchanged: true` and `buildOutputUnchanged: true`. The executor made
no repository edits or agent launches during the gates; the gates wrote their
own build outputs and receipts. Completion checks the final document state
again. No performance saving is claimed for a check whose earlier passing
version still accepted the reported invention.

`npm run release -- prepare --local` retained application target v0.74.2
(patch). FUP-1e8ba454d811954f is settled through the helper with D012 and
the regression evidence. The adjacent queue is empty at revision 0. No
nested repository was found outside intake, dependency and build directories;
the temporary fixture repositories were removed by their suites. Both
executor-started evidence waiters exited on their gate's completion. No
repair-started background task or agent remains.

The verifier's declared limits remain: coordinated null observations and
substitution of a real tag at the same commit can be genuine older
observations and continue to pass. The check establishes the Git relationship,
without authenticating historical capture time. No actual sibling checkout
was exported or updated. Independent re-verification and final review remain
separate dispatches. Usage is available in ignored receipts; final counters,
their source, scope and cutoff are reported in the response.
