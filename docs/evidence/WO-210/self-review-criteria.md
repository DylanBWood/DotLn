# Criteria adversary self-review

Reviewer: fresh Codex worker `criteria_adversary`, requested model `gpt-6.1-sol`, effort `max`; read-only, no descendants or tests. Inputs: the work order and the implementation diff. Finding count: 2 (one source-confirmed defect and one untested concern at review).

1. P2 — Self-order claims changed because the runner pattern was global in `scripts/lib/handoff-ledger.mjs`. AC17 requires unchanged self behavior. Fixed by recognizing the target runner only for target orders. The focused handoff/report parser regression passed together with the target-claim checks in 682 ms.
2. P2 — A valid documentation root such as `:(literal)manual` was passed as a Git pathspec in target record/planning staging and tree reads. Fixed with explicit literal pathspecs. The regression confirms the old unescaped tree query misses the real path and that both publication paths work at that root; the expanded three-case probe passed in 80,084 ms.

Disposition: found 2; fixed 2; recorded 0. Independent verification and final review remain separate lifecycle roles.
