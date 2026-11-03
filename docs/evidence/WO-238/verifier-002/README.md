# WO-238 VER-002 evidence

Observed on 2026-11-03 against code identity
`5813fed9602dd97c047875cd8441271c35b8ce2ca7a0864f10a32268d63ede2f`.
The [verification report](../../../verifications/WO-238/VER-002.md) owns the
criterion judgments and verdict.

## Independent probes

Run from the selected worktree root:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-238/verifier-002/attacks.mjs
node scripts/harness.mjs bounded -- node docs/evidence/WO-238/verifier-002/navigation.mjs
```

[attacks.json](attacks.json) records the passing reference forms, program
reader collisions, release-window boundary, retained-session deduplication,
moved-document identity, unavailable-window behavior and stable pagination.
The audit compares all 53 moved records with base, all 26 external dependency
entries, the 14 generated role hashes and their before/after cold-start
measurements. It also checks the current complete row against both plain
and review selections instead of assuming a complete row covers them.

The audit was run twice: its second run excludes local workspace links from
the external-dependency count and records the gate's fresh-task count as
well as its case rows. Both runs passed. The retained result is the second,
observed at 2026-11-03T15:51:22.495Z. Its real census saw 282 journal files,
26 in-window sessions, 13 observed and 13 unobserved; the scan took 356 ms.
These raw units are measurement data; the operator-facing duration rounds
to 0 h 0 min. Codex reads are explicitly unobserved.

The navigation probe ran at 2026-11-03T15:55:29.205Z and passed all three
assertions of the known limitation. The moved record's `sequence.md` link
and product 07's two old goal-section paths do not exist as ordinary
relative targets; their map-resolved targets do exist. This supports the
report's disclosed limit, not a claim that renderer navigation was fixed.
The existing dispositions are D002, D036 and D037 in
[decisions.md](../decisions.md).

## Production reproductions and gate reuse

[checks.json](checks.json) records exact commands, start/finish times,
exit codes and selected results from the session's bounded command output.
All eight recorded runs exit zero with no dropped bounded output. The
focused Node cases number twelve: seven document-kind/reference/red-tag
cases, four lens/census/handoff cases and one end-to-end disposal case.
The separately executed `routed_after_preparation` release case observes a
refusal before either tag or Release publication, then successful close
after routing supplies the release. Its Git and publication effects are
confined to the existing test fixture.

The implementation formatting check and publication check pass. The
publication result covers 256 of 256 product headings, both voice-link
checks and both current edition locks.

The executor's complete review row at 2026-11-03T15:37:45.532Z has the same
code identity, exits zero, and records 45 passing cases and 119 fresh tasks.
It covers all 45 currently selected review suites and all 37 plain
selections. Its 3,088,949 ms duration is 0 h 51 min. No new complete product
run was needed. [handoff-checks.json](handoff-checks.json) records the final
document row and its own-evidence identity for the completed candidate.

The verifier reviewed the complete implementation and all earlier worker
rounds, but edits only this verification's report, evidence and generated
decision index. The code under test, including the gate instrument itself,
is not changed to obtain a pass.
