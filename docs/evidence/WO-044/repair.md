# WO-044 repair — VER-001

**Dispatch:** `resume: fix`, 2026-09-14. **Actor:** Codex CLI 0.154.0,
GPT-6 Astra at max, operator-attested under the repository selection; no
effective-session readback claimed. **Observation cutoff:** 2026-09-14T22:33:28Z.
The subsequent `RepairCompleted` event in `docs/control/orders/WO-044.jsonl`
binds the completed repair to its final checked tree. Final gate counters and
usage stay in ignored receipts and the handoff response.

The original order and its execution amendments remain authoritative.
[D012](decisions.md#wo-044-d012) records the material choices, alternatives,
mission contribution, system-trap comparison and reopening conditions.

| Finding | Repair and executable evidence |
| --- | --- |
| F1 | Missing HEAD no longer proves emptiness. Repository inspection checks all refs, index entries and loose/packed/garbage/alternate object storage; unreadable metadata preserves or refuses. Preservation detects `.git` directly even when Git omits a corrupt nested repository. Regressions preserve another branch's commit, staged-only bytes, dangling objects and broken HEAD; they also call the actual feedback mount cleanup. The archived staged file is recovered with `git show :valuable.txt`. |
| F2 | Teardown checks both current and legacy writer reservations and keeps every unreleased or unreadable holder, including stale holders. Shared registration leases and an exclusive teardown lock live outside the subject, with a second writer/clean/gate check before removal. The actual worktree fixture keeps live and uncertain writers in preview and removal; a contender cannot register while teardown holds the lock. Registration attempts can overlap, preserving the existing owner-refresh and competing-recovery behavior. Abandoned locks or leases refuse teardown pending inspection. |
| F3 | POSIX suites own process groups. Stop/timeout sends SIGTERM, escalates to SIGKILL after one second, and closes the runner's pipe readers with a bounded completion fallback. The regression uses a grandchild that ignores SIGTERM and inherits stdout/stderr. Stopped suites return failure; gate-stop tests record no passing check. Descendants that deliberately escape the group are not claimed terminated. |
| F4 | Sanitized operation rows link a closed fixture-operation name to its request and matched result. Unrelated refusals and absent effects cannot establish permission causation. Claude's live paired control allows the exact command in both runs; only the project deny differs, and only the control creates the file. Codex's live no-terminal row remains ambiguous because it retained no matched request/denial. |
| F5 | Per-launch selectors derive from executed arguments; native background commands retain their own selectors. Historical concurrent/background metadata is corrected to `low`, with correction provenance; help launches select no model. Report prose derives from saved arguments and step selectors. Effective effort remains unobserved. |
| F6 | Owned detached stdout/stderr spools are removed in `finally`, including spawn failure and SIGKILL. The awaited child remains referenced through its final close event. Success/failure/kill regressions leave no spool. The two original spools were identified by their creation times within the recorded launches and exact stdout/stderr layout, then removed without reading their raw contents; the original records carry the correction. |
| F7 | Suite keys use owner-executable bit `0100`. Modes 0645, 0654 and 0655 join the existing 0600 regressions; Git reports no difference and suite keys remain equal. Owner-executable changes and changed bytes still invalidate. |
| F8 | Both installed harnesses now have a detached writing-episode attempt, observed SIGKILL exit, post-kill worktree snapshot and successful fresh recovery on the preserved worktree. Recovery reads the probe's saved state; vendor conversation and transport worker-store recovery are explicitly unavailable in this ephemeral profile. Native background identifiers require an exact listing for the scratch worktree before logs, signals, resume or removal; an unconfirmed-token fixture performs none of those actions. |

The seven live repair attempts are retained beside the original runs under
`docs/discovery/writing-worker-smoke-2026-09-14/` with `repair-1` names.
The report and index select the latest attempt per launch and retain all run
references. At this cutoff the 33 rows comprise 23 observed, eight unavailable
and two ambiguous. Claude's sibling write succeeded in the temporary directory;
the report makes no confinement claim from that launch. Authentication lifetime,
scheduling, idle limits and effective effort retain their stated limits.

Executed checks before cutoff: the six probe tests; the six WO-044 cancellation
and mode tests; three preservation/writer tests; the full worktree shell fixture;
artifact-identity and verification evidence checks; and local release preparation
at v0.17.7. An initial combined targeted run exposed the detached-child lifetime
problem in F6; its probe tests were cancelled, then the corrected probe suite
passed. Output review then caught an unreadable repository being described as
having no commit; its message now names unknown commit state, with the
preservation regression passing. The first repair full gate was stopped through
the session-owned stop route before recording a check. It also exposed the
console replica's old feedback-001 input paths; after updating them to the
selected feedback-002 files, all 17 console fixture tests passed in an isolated
replica. The next full gate exposed two existing writer race regressions: the
repair's broad exclusive registration lock prevented competing recovery and
owner refresh. Shared registration leases now exclude teardown without
serializing those attempts; both existing race tests and the preservation/writer
regressions pass. That gate also encountered sandbox denial writing the shared
Git suite cache. The final full gate is run with access to that cache and covers
the complete corrected source and reports.

The harness runtime change has immutable authority edition `authority/004`.
The corrected feedback mount source has immutable edition `feedback-002`, whose
live Codex audit completed all ten fixtures and its verification matrix at max.
The current-evidence selection and console projection follow those editions;
earlier editions retain their bytes. Compiler 0.9.3 and skeleton 0.15.12 remain
the changed components already assigned to this order's patch release.

Outcome against D012: the synthetic loss and cancellation counterexamples are
rejected at corrected bytes, and the live rows establish the narrower claims
above. Work and waiting include the required live audit and bounded probe
reruns; no token or wall-time reduction is claimed. Verification and final
review remain separate dispatches.
