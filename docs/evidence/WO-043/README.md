# WO-043 implementation evidence

The work-order index and selected lifecycle JSON status now share typed
dependency truth. Activation refuses unmet typed entries before appending an
event or creating a checkpoint; legacy token references never refuse it.
The application target is `v0.17.1` (patch).

- [Fixture results](fixture-results.json) retain the executed parser,
  projection, ancestry, stale-index, status-parity and activation transcripts.
  The index suite passed all 16 cases; the resume suite passed, including the
  new no-append refusal cases and its existing lifecycle/status fixtures.
- [Migration comparison](migration.json) compares all 85 open authorities
  with their prose and the revised seed graph: 245 typed entries. WO-052 has
  hard dependencies on WO-049, WO-050 and WO-051; all six current umbrellas
  carry only supersessions. The four corpus nodes lacked graph edges and
  were transcribed from prose. All 40 closed/historical authorities retain
  their HEAD bytes, including WO-042, whose projection has no blocker.
- [Decisions](decisions.md) record the migration exceptions, release
  assignment and rejected alternatives. Product 06, product 07, the playbook,
  lane rule, planning map and publication surfaces carry the new semantics.
  The planning continuation guard recognizes only the reviewed transcription,
  keeping its immutable receipts and rejecting changes to dependency meaning.
- [Meter baseline](meta-baseline.json) and [dispatch observation](meta.json)
  retain observed costs and their sources. Historical gaps stay historical;
  current Codex/Claude token collection is mandatory under the repair below.
  The fixture transcript's TAP duration is a test-runner observation, not
  the whole dispatch's elapsed time.

The final application gate is `npm run harness -- evidence`, which supplies
the full test inventory (including the fast gate's suites) and `git diff
--check`. Its current-tree checks and output delivery are enforced again by
`resume implementation-ready`; the completion event identifies that evidence.
Standalone fixture measurements above precede that final gate.

The first full run passed 35 suites and failed two: the planning continuation
guard did not recognize the required migration, and the console reported its
live release-list source unavailable. The planning repair and same-day
correction are recorded in D004. A standalone release list succeeded; the
canonical retry retains passing checks and reruns both failed integrations.

Actor: Codex CLI `0.154.0`, GPT-6 Astra, `max`, operator-attested under the
repository default. The CLI version was observed locally; no effective-session
effort readback is claimed. The executor uses the lifecycle command it changes;
temporary repositories independently exercise its consequential behavior.
Verification and final review require separate dispatches.

The [2026-09-11 repair receipt](repair-001.md) covers VER-001 F1 and the
operator-authorized command, usage, automatic-support and shared goal/cost
expansions. Its full-gate and repair-complete records govern the current handoff.

Two verification reports differ from the bytes stored at their completion
checkpoints. The differences are expected.

- **VER-001.** The report first said token usage was null, although the session
  transcript carried the counts. Its token line now states the measured
  5,278,902 tokens (14:10:36Z to 14:52:40Z), which VER-002 reproduces from
  source. That line is the only difference from its bytes at
  `refs/dotln/checkpoint/WO-043/4`.
- **VER-002.** The report was rewritten at the operator's direction to include
  findings F3–F5. Its bytes at `refs/dotln/checkpoint/WO-043/8` are the earlier
  report, which contained F2 only. The verdict, fail, is unchanged.

To compare a report with a checkpoint, compare `git hash-object <report>` with
`git rev-parse <checkpoint>:<report>`. Do not use `git diff <checkpoint> --
<report>`: the reports are untracked, so it wrongly shows them as deleted.
VER-001's current bytes equal its bytes at `refs/dotln/checkpoint/WO-043/5`.
