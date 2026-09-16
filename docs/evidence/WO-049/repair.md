# WO-049 repair evidence

Dispatch: `resume: fix`, addressing immutable [VER-001](../../verifications/WO-049/VER-001.md),
including its operator-authorized F5. The operator additionally requested the
housekeeping for the newly merged WO-051. Cutoff: before the final integrated
gate; that gate's results and final usage remain in local receipts and the
handoff response.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.154.0","model":"gpt-6-astra","effort":"xhigh","mode":"subagents","raw":"ultra","source":"codex-session-readback"}

| Finding | Repair and evidence |
| --- | --- |
| F1, blocking | Locate one ordered, complete-line marker pair and compare its contents before mutation. Duplicate blocks refuse check, emit and remove without changing the tree, exclude or receipt. Preserve the separator when user content follows; remove a terminal separator only when the prefix hash proves ownership. Fresh installations after removal observe the current exclude baseline. The regression verifies the appended ignore rule still hides its output and `git add -A` stages nothing. |
| F3, adjacent | Claude lifecycle capability reasons now cite C-W4 and explicitly state observed but deliberately omitted. Codex reasons retain unavailable observations; omitted skills cite profile scope rather than a fictitious observation. Actual-profile assertions accompany the compiler's PreToolUse-only fixture. |
| F4, adjacent | Compiler validation rejects literal backslashes before emission; existing space, hash and Unicode roots remain admitted. Invalid relative, dot-segment, newline and backslash roots all refuse in the lowering test. |
| F5, operator-authorized | `ultracode` normalizes to xhigh, subagents and the original raw spelling, including case variation. Lifecycle fixtures retain arbitrary-selector passthrough coverage under a neutral custom label; old reports and control events are unchanged. |
| F2, documented boundary | The attribution pre-check remains installed, while the permission guard still denies opaque test/Git commands. WO-051's allowlist does not override that denial. The order and runbook now state this explicitly; host-authorized execution is a WO-052/WO-053 integration obligation, not a claimed result here. |

Older local exclude registries remain readable. Without a prefix hash proving
separator ownership, removal conservatively retains the newline. No original
exclude content is copied to the registry; only its hash is added. Shared linked-
worktree membership and refusal of modified owned files remain covered.

## Integration and release

Preserved the complete pending tree in the retained named stash
`WO-049 repair preserve before WO-051 integration 2026-09-16T2123Z`; preserved
ignored intake separately. Fast-forwarded the branch from `0eacb54` to main's
`4fbf77c`, then applied that stash by immutable object identity. No implementation
commit was created. The canonical repair-dispatch checkpoint remains retained.

Conflict resolutions regenerate the harness manifest/hooks, control/work-order
projections, publication locks and metadata index. Follow-up entries and their
revisions/dispositions were unioned by identity. Evidence selectors retain
historical editions and select new WO-049 authority and feedback revision 003.
Additive product and runbook text from both orders survives. VER-001 remains
byte-identical to its preserved pre-integration copy.

WO-051 consumed application v0.24.0 and skeleton 0.20.0. The existing minor
classification now stages application v0.25.0, skeleton 0.21.0 and compiler
0.12.0, with unchanged kernel/console versions. `release prepare --local` updated
the order heading, README and dated roadmap note using the shared local tag
snapshot. Component metadata, lockfile and runtime version agree. Publication
and remote release operations remain separate.

Evidence impact: the combined source tree changes worker transport/protocol/store
and feedback-audit inputs, requiring a fresh combined live audit. A read-only
Codex CLI worker using gpt-6-astra at xhigh completed that audit: ten regressions,
ten removal failures, all verifier rows complete, 1192 fewer instruction bytes.
Revision 003 retains the new executor and verifier streams. The console selfhost
fixture was repinned and its JSON, terminal and HTML regenerated. Existing
artifact-identity and synthetic verification editions pass their current checks;
their bytes need no replacement. Earlier live target smoke remains historical:
this repair reruns generated-hook fixtures but does not claim fresh live target
launches.

## Executed checks before the final gate

- Compiler harness tests: 5 passed, 0 failed.
- Target harness tests: 8 passed, 0 failed, including actual capability reasons,
  file/ignore ownership, generated-hook denials and shared-worktree removal.
- `env -u CODEX_THREAD_ID bash scripts/test-resume.sh`: passed, including effort
  normalization, report/actor parity, historical projections and account labels.
  The initial direct run inherited this session's metadata and failed its strict
  status-key assertion. The rerun uses the same absence of session metadata as
  the canonical gate's `suiteEnvironment`; no production workaround was added.
- Publication coverage and both refreshed source locks: passed.
- Artifact identity: four current files verified, frozen oracle unchanged.
- Synthetic verification: four files verified, defect/repair/staleness/replay pass.
- Fresh authority evidence and live feedback audit: recorded; historical editions
  preserved. Generated harness: 24 surfaces refreshed.
- Integration whitespace check: clean; no unresolved merge paths remain.

Two read-only agents reviewed the repair edges and integration impact while the
root remained the sole writer. The edge review tightened marker matching to
complete lines. Entry usage total is unknown (source unavailable, scope dispatch,
cutoff 2026-09-16T21:18:54.338Z); this is not zero. The bounded probes established
the repair before one final integrated gate. Decisions and reopening conditions
are [D007 and D008](decisions.md#wo-049-d007).
