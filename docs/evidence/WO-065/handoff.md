# WO-065 handoff ledger

Executor judgments before `repair-complete` for VER-001 F1-F3. The [repair evidence](README.md), [decisions](decisions.md), [repair fixtures](repair-fixtures.txt), [executed subject](repair-subject.json) and [repair smoke](repair-smoke.json) supply detail. Actor: Codex CLI 0.158.0, gpt-6-astra, max, codex-session-readback.

**Criterion 1:** met. F1 corrected: GraphQL Bot actors without a suffix classify as automation/automated-review; User and the other admitted non-bot types do not. Reporter, CI failure and resolved behavior, pagination, correlation, latest-state dedup and changed-head/comment behavior pass. Unknown or missing actor types refuse at their field path. The 17-test target-publish suite and full review gate pass; D003/D011 record the correction.

**Criterion 2:** met. Every WO-060 declared secret shape and URL form has a refused item with shape and UTF-8 span, now also a source field path; rejected text/hashes are absent and forge links and safe peers survive. F2/F3 additionally keep malformed strings and screened metadata local to their item, with optional spans and safe placeholders; D012 states the limits.

**Criterion 3:** met. Unrecorded numbers, malformed JSON/field types, unknown enum values, partial GraphQL errors and gh failures refuse with safe reasons and field paths where applicable and append nothing. Invalid forge hosts refuse before gh. Decoded strings refused by the screen are retained as refused items, distinct from structural decoding failure.

**Criterion 4:** met. The original authorized live smoke in smoke.json records one correlated observation and zero on the second read. The repaired reader re-observed the retained open PR twice and appended nothing; independent head/number and correlation agree (repair-smoke.json). The live PR has zero checks/comments, so classification and screening rest on fixtures.

**Criterion 5:** met. Product 02 gains 433 bytes within the 450-byte bound: base 147835, current 148268, ceiling 150611, headroom 2343. D003/D005 are corrected and D011-D013 record repair decisions and outcomes. The decisions index and publication source locks are refreshed. D008, product 05 and the ledger preserve the authorized specification-only breakout; its separate implementation follow-up stays open.

**Criterion 6:** met. `npm test -- --review` passed 30 checks, 0 failed, 74 fresh tasks in 320.69 s at code identity `ae532e8cbdb854aeb3f48be132bb502fa0549fb766485e8bdf865726a153957d`, recorded 2026-09-29T01:35:55.843Z (`host-gate:ae532e8cbdb854aeb3f48be132bb502fa0549fb766485e8bdf865726a153957d:npm test`). `npm run test:docs` passed 23 checks in 13.44 s and runs again inline after final write-backs. `git diff --check` and explicit new-file whitespace checks are clean; manifests and lockfile are unchanged, with no new dependency.
