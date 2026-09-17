# WO-121 decisions

Dispatch: `resume: next`, 2026-09-16. Executor: GPT-6 Astra, ultra
(xhigh plus workflows), Codex CLI 0.154.0, current-session readback.

## WO-121-D001

```json
{
  "id": "WO-121-D001", "date": "2026-09-16", "dispatch": "resume: next",
  "decision": "Classify explicit presence, hook activity and task progress by signal evidence and resident stamp; installed ambiguous profiles use explicit human commands only.",
  "evidence": ["docs/discovery/writing-worker-smoke-2026-09-14.md", "packages/skeleton/src/presence-signals.ts", "packages/compiler/src/harness.ts"],
  "rejected": [{"option": "NoOp", "reason": "Leaves the resident without the required origin contract."}, {"option": "Infer presence from process tables, input devices or launch paths", "reason": "None establishes human presence; autonomous activity outlives departure."}],
  "reopenWhen": "A harness observation establishes a reliable typed/scripted prompt discriminator."
}
```

The resident currently accepts explicit presence only. WO-044 C-W10 observes
Claude's scripted `UserPromptSubmit` without an interactive discriminator;
X-W10 observes no Codex hooks. Use a pure signal/stamp classifier, with an
explicit interaction observation only where a harness can establish it.
The installed profiles fail toward actor; explicit away/back remain human.
Every tool event is actor regardless of launch path. Task progress has its own
origin. Local heartbeat records carry only event kind, time and session/episode
identity, never prompt/tool content. Resident environment stamps cross both
the adapter and script-supervisor boundaries.

This enables dependable unattended operation without background traffic
cancelling itself. NoOp leaves the missing origin contract unresolved. Reject
process-table/input-device/launch-path inference: none establishes presence.
Reopen the profile fallback only with a new observed discriminator, not vendor
claims or a changed version label.

## WO-121-D002

```json
{
  "id": "WO-121-D002", "date": "2026-09-16", "dispatch": "resume: next",
  "decision": "Keep optional human inactivity, phase decay and actor heartbeat budgets independent, preserving discretionary return guards and foreground authority.",
  "evidence": ["packages/skeleton/src/presence-machine.ts", "packages/skeleton/src/resident-state.ts", "packages/skeleton/test/presence-signals.test.ts", "docs/product/03-architecture.md"],
  "rejected": [{"option": "Share the policy decay clock", "reason": "Would conflate human inactivity with allocation expiry."}, {"option": "Treat actor silence or task progress as human return", "reason": "Neither establishes presence and both could cancel authorized work."}],
  "reopenWhen": "Measured hook gaps justify changing the configured heartbeat budget, or replay/return fixtures expose an authority race."
}
```

`PresenceMachine.lastActivity` and `decay.idleMs` expire absent-policy allocation;
they do not measure human inactivity (product 03; WO-067). Add optional policy
`humanIdleMs`, preserving existing behavior when omitted, and track only human
observations against it. Actor heartbeat deadlines use the resident's separate
`heartbeatBudgetMs` (30 seconds by default). Recorded clocks detect silence
without requiring another heartbeat. Stop remains activity; an observed/lost
resident outcome retires its actor. Progress is neither
presence nor a liveness renewal. Stall state does not invoke a return or cancel
policy work. Existing execution timeout and discretionary kill/finish authority
remain in force. No new actor kind or generalized scheduler is introduced.

Rejected: sharing the decay clock, refreshing presence from task success, or
treating a liveness failure as operator return. Reopen default liveness budget
if measured hook gaps justify a different owner configuration.

## Goal alignment and intervention comparison

The critical-path contribution is trustworthy presence input to the resident,
not more autonomous work by itself. Policy resistance and fixes that fail are
addressed by separate clocks and existing discretionary guards. Commons cost is
bounded local metadata and periodic clock sampling; no model calls per heartbeat.
Drift to low performance is tested by negative no-cancellation fixtures. Escalation
and shifting the burden are reduced by automatic classification and conservative
fallback instead of recurring operator rescue. Success to the successful is not a
reason to trust either harness: both follow observed capabilities. Rule beating
is checked through generated-hook execution and the production fold, not just a
standalone classifier. Seeking the wrong goal is checked by preserving foreground
completion and replay. Naive Interventionism: preserve existing expiry, return,
locking and authority behavior; the smallest useful probe is fake-clock replay
plus real generated hook ingestion. Changes are reversible source/data edits;
no account settings or publication are included. Outcome claims await execution.

Review refinement: check the prior heartbeat deadline before accepting a late
heartbeat, and retain that missed deadline across recovery. Live command times
use monotone logical time when the wall clock moves backward; older replayed
human observations cannot undo newer intent. Sample during in-flight work only
at the next human/actor deadline or after external log changes, avoiding a clock
row for every 20 ms poll. Actor stalls report budget silence, not process death,
and do not revoke authority or kill work.

Entry process cost: dispatch counters unavailable at 2026-09-16T23:25:53.119Z;
tokens, commands, steps and cost are unknown. No cost reduction is claimed.

## WO-121-D003

```json
{
  "id": "WO-121-D003", "date": "2026-09-16", "dispatch": "resume: next",
  "decision": "Complete activation at application v0.26.0, compiler 0.13.0 and skeleton 0.22.0; regenerate heartbeat hooks, dependency pins and current evidence.",
  "evidence": ["docs/work-orders/WO-121-presence-signals-with-origin.md", "packages/compiler/package.json", "packages/skeleton/package.json", "scripts/lib/harness.mjs", "scripts/lib/evidence-sources.mjs"],
  "rejected": [{"option": "No component bump or reuse stale source evidence", "reason": "The additive policy and runtime behavior require minor component releases and current evidence."}],
  "reopenWhen": "Integration consumes a staged version or behavior changes invalidate the selected evidence edition."
}
```

The activation left a version placeholder. The observed local tag maximum is
v0.25.0; the order declares minor. Only compiler and skeleton change behavior;
kernel and console remain fixed. Additional subject inputs are the resident
store/host/state, actor context/supervisor, pure observation and heartbeat modules,
their tests, feedback-source inventory, runtime pin inventory, and test selection.
Target hooks retain their existing PreToolUse-only scope. This pre-2026-09-09
order's ledger duty is discharged by this receipt and the generated decisions
index under the executor procedure; the executor does not edit the idea ledger.

Correction, 2026-09-16: the initial receipt used prose headings without the
required machine-readable decision blocks. Release preparation correctly refused
it. The blocks above now carry the same decisions in the documented shape.

Final review of the implementation found two input-boundary corrections before
handoff: preserve rejection of invalid explicit presence values, and prevent
older replayed actor observations from reviving stalled state. They are included
in the focused fixtures. Feedback/authority revision 002 supersedes revision 001
at the final source cutoff; both remain preserved. Two gate attempts were stopped
before completion (one during projection preparation, one after 60.2 seconds for
these fixes), with no passing check recorded. This is measured extra work, not
a claimed reduction in process cost.

Integration follow-through, 2026-09-17: the completed 447.13-second gate found
the console selfhost snapshot still pinned to WO-049 feedback, whose compilation
identity cannot be projected by this compiler. Use the existing current-selfhost
recorder to select WO-121 feedback edition 002, preserving prior evidence bytes.
Additional subject inputs are the console fixture manifest and three generated
selfhost snapshots. No console production change or component bump is needed.
The release runtime-refresh fixture's isolated rerun passed; the earlier failure
suppressed clone stderr, so its cause remains unknown. `scripts/test-release.sh`
now retains clone failure diagnostics without changing failure admission. NoOp
would leave future failures opaque; no release behavior is changed. Reopen a
functional repair if the surfaced diagnostic identifies a reproducible defect.

Correction: the new foreground fixture proves separate authority remains valid;
it does not execute that separate action. The test diagnostic and implementation
report now say so. The nondiscretionary resident execution and existing WO-067
modeled foreground completion remain the completion evidence.

## WO-121-D004

```json
{
  "id": "WO-121-D004", "date": "2026-09-17", "dispatch": "resume: fix",
  "decision": "Disable automatic maintenance in disposable release fixture repositories before seeding or cloning; preserve release behavior and remove the redundant literal-only foreground authorization assertion.",
  "evidence": ["docs/verifications/WO-121/VER-001.md", "scripts/test-release.sh", "scripts/lib/release-fixtures.mjs", "packages/skeleton/test/presence-signals.test.ts"],
  "rejected": [{"option": "NoOp or retry until green", "reason": "The baseline failed again while a traced receive-pack child repacked the source during the integrator clone."}, {"option": "Use --no-hardlinks alone", "reason": "Git documents that this still copies the local object store; it does not remove concurrent source mutation."}, {"option": "Use --no-local only on the failing clone", "reason": "Transport avoids that copy race but leaves background mutation during template snapshots and fixture cleanup."}],
  "reopenWhen": "A release fixture needs to exercise automatic maintenance, or tracing shows another concurrent object-store writer."
}
```

VER-001 F1 reopened the earlier diagnostic-only choice. The fresh baseline
`bash scripts/test-release.sh --case runtime_refresh` exited 1. Local Trace2
evidence at `.runtime/wo121-repair/baseline-trace.jsonl` shows the
`runtime-close-matching` push's receive-pack child start a detached maintenance
repack at 00:46:24.727Z, the integrator clone start at 00:46:24.730Z and fail
copying a vanished object at 00:46:24.819Z, and that repack finish at
00:46:24.825Z. Thus automatic maintenance and clone overlap are observed,
not merely inferred from an error signature. No execution at `main` is claimed.

Git's [configuration documentation](https://git-scm.com/docs/git-config) says
`maintenance.auto=false` suppresses automatic maintenance after ordinary
commands and `receive.autogc=false` suppresses it after receiving a push.
Its [clone documentation](https://git-scm.com/docs/git-clone) warns that local
copying races concurrent source modification; `--no-hardlinks` retains copying.
Configure only disposable repositories, before their first data writes. Clone
configuration protects main and every integrator; the origin configuration is
preserved by the existing shared-template copier. No global or project Git
settings change. Fresh and template-backed runtime-refresh scenarios plus the
repository gate are the checks; trace the repaired paths for unexpected repacks.

Goal alignment: this removes a recurring verification failure blocking the
resident presence work and its critical-path handoff. Policy resistance/fixes
that fail and shifting the burden are addressed at the competing background
writer, rather than by retries or operator rescue. Commons cost is bounded to
existing scenario runs and one diagnostic trace; no new permanent test tier.
Drift to low performance and rule beating are addressed by retaining every
release assertion and failure exit. Escalation is limited to fixture setup.
Success to the successful is checked by considering transport-based cloning;
seeking the wrong goal is checked by preserving the actual release scenarios,
not merely making the runner report success. Naive Interventionism: production
maintenance and publication remain outside the change, the fixture setup is
reversible, and the smallest useful probe is the failing six-scenario case.

VER-001 O2 identifies a separate bounded cleanup: remove the assertion that
authorizes a request built entirely from literals. The production resident
completion and cancellation checks remain the evidence for criterion 2. This
corrects the earlier claim that those literals established independent authority
across return; they never consumed the return state. No new product decision or
component compatibility change is required.

Entry usage cutoff 2026-09-17T00:45:13.286Z: dispatch counters unavailable;
tokens, commands, steps and cost are unknown. Source: the harness usage receipt.

## WO-121-D005

```json
{
  "id": "WO-121-D005", "date": "2026-09-17", "dispatch": "resume: final review",
  "decision": "Retime the unpublished staging to application v0.27.0 and skeleton 0.23.0 under the recorded minor classification, because WO-119 published v0.26.0 with skeleton 0.22.0 during this order's review; compiler 0.13.0 is unchanged.",
  "evidence": ["docs/product/07-execution-guide.md", "docs/product/06-roadmap.md", "packages/skeleton/package.json", "packages/skeleton/src/version.ts", "README.md", "docs/final-reviews/WO-121/FINAL-001.md"],
  "rejected": [{"option": "Keep the staged v0.26.0 and skeleton 0.22.0", "reason": "Both labels are published at tag v0.26.0 with different bytes; republishing them would collide."}, {"option": "Return the collision through repair and independent re-verification", "reason": "Product 07 records a version collision as integration bookkeeping that is never a finding, a repair or a new verification."}, {"option": "Reclassify the release", "reason": "The additive compatibility impact D003 declared is unchanged; only the labels move."}],
  "reopenWhen": "Another order publishes v0.27.0 or skeleton 0.23.0 before this branch merges."
}
```

D003's own reopening condition — "Integration consumes a staged version" — is met.
The tag `v0.26.0` resolves to `9ecedc5`, the `main` this review merged, and
`release check-surfaces --local` reported `FAIL component-version
@dotln/skeleton: src changed; observed 0.22.0; previous v0.26.0 0.22.0`.
`npm run release -- prepare`, using origin's tag observation, retimed the
application target to `v0.27.0` and wrote the order heading, the README claim
and the dated roadmap note; the skeleton label is retimed by hand in
`packages/skeleton/package.json`, `packages/skeleton/src/version.ts` and the
lockfile workspace entry, because `release prepare` deliberately never alters
component versions. Compiler `0.13.0` is free: `main` publishes `0.12.0`.

D003 is preserved at its recorded subject and is not rewritten; it was correct
when the staged labels were free. Nothing behavioral moves with the labels: the
declared additive minor impact, the acceptance claims and the published tags
are unchanged, and the regenerated bundle differs only in its pins.
