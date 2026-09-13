# WO-129 repair of VER-001

Operator dispatch: `resume: fix`, 2026-09-13. Failure source:
[VER-001](../../verifications/WO-129/VER-001.md). Actor: Codex CLI `0.154.0`,
GPT-6 Astra at `max`, `operator-attested` under the repository default;
this is not effective-session readback.

F1: npm's checkout-local prefix now has a relative cache identity, alongside
the existing PATH treatment. Execution retains the actual prefix; external
prefixes and other configuration remain distinct inputs. The sibling fixture
now varies both lowercase and uppercase prefix variables. A new fixture
launches real npm processes in two Git worktrees with identical candidate and
installed bytes, using the production runner and a small kernel test.

F2: `authority-evidence` declares `refs/tags/v0.16.0`. The existing Git-state
matrix now tests creating, moving and deleting that tag, while unrelated tags,
branches and identical-byte commits leave this suite's Git identity unchanged.
The tag operations occur only in disposable fixture repositories.

The three targeted regressions failed against the inherited implementation
in 8.219 seconds: the historical tag did not invalidate, differing prefixes
changed the environment digest, and the second npm gate was fresh. After the
repair, `node --test scripts/test-suite-evidence.mjs` passed all 15 tests in
54.061 seconds. The real npm fixture completed in 7.093 seconds and asserted:

| Invocation in fixture                   | Fresh tasks | Reused tasks | Exact tree |
| --------------------------------------- | ----------: | -----------: | ---------- |
| First worktree, `npm test`              |           2 |            0 | Initial    |
| Sibling, `npm run test:full`            |           1 |            1 | Same       |
| Sibling after source change, `npm test` |           2 |            0 | Changed    |

The fresh task in the middle row is build; the executed kernel success is
shared. This is a fixture result, not an additional full-host timing claim.
The original criterion-7 host observations remain in `host-gates.json`.
The final-tree gate is `npm run harness -- evidence`; its executed aggregate
and diff evidence are retained by the host and required by `repair-complete`.

[D005](decisions.md#wo-129-d005) records the correction, alternatives and goal
comparison. Product 07 describes the prefix and tag inputs; the order's execution
record also restores the previously documented transport expansion to that
surface (VER-001 O5). Reviewing publication 08's freshness contract and both
edition outlines added them to the read scope; the engineer edition's source
lock was refreshed, and publication checks pass. Local release preparation
retains application `v0.17.4` and skeleton `0.15.4` with the existing patch
classification and publication controls. The adjacent queue has no unfinished
item. Other projected environment differences still limit reuse (VER-001 O1).

Usage before output review and the final gate: 1,482,393 total tokens,
1,399,168 cached input, source `codex-transcript-counter`, scope `dispatch`,
observed 2026-09-13T03:07:39.241Z. Entry was 141,071 tokens. These cumulative
counts include waiting and exclude routing before registration. Handoff
recollects usage. The new npm probe costs seconds and distinguishes behavior
the prior same-process test missed; no alternate repair cost was measured.
