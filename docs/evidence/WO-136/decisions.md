# WO-136 decisions

## WO-136-D001 — Measure the existing target boundary in disposable fixtures

```json
{
  "id": "WO-136-D001",
  "date": "2026-09-17",
  "dispatch": "resume: next",
  "decision": "Measure the existing target bundle and exact-command grants in temporary fixtures, preserving per-route host observations and unknowns.",
  "evidence": ["docs/work-orders/WO-136-authority-enforcement-boundary.md", "scripts/lib/writing-worker-probe.mjs", "packages/skeleton/src/harness-host.ts", "packages/skeleton/src/source-change-command.ts", "docs/evidence/WO-052/implementation.md"],
  "rejected": [
    {"option": "NoOp", "reason": "Leaves the authority-mode decision without the requested observations."},
    {"option": "Synthetic enforcement hook or container", "reason": "Measures a different boundary and exceeds this experiment."},
    {"option": "Real credentials or remote", "reason": "Outside the explicit fixture-only authority."}
  ],
  "reopenWhen": "The real target cannot be exercised in scratch, the CLI rejects the shape, or host evidence cannot distinguish routes."
}
```

Dispatch: `resume: next`, 2026-09-17. Sources: the work order, WO-044's
writing-worker probe, `runTargetHarnessHook`, `installSourceChangeCommands`,
WO-052's implementation limits, product 03's authority candidate and product
07's research convention. The current session readback is Codex CLI 0.154.0,
gpt-6-astra, ultra (xhigh with subagents).

Use the existing target emitter and exact-command grant in a temporary
launchpad and linked Git worktrees. Probe effects stay in that fixture: a
random sentinel substitutes for credentials, a loopback listener observes
socket effects, and a local bare remote observes push effects. Copy built
package output into the scratch launchpad; do not alter the kept bundle.
Revocation deletes the actual command grant, then observes the running
command and the next tool call separately. Each compound row retains its
sub-observations rather than extrapolating one route to another.

This supplies the missing evidence for the authority-mode decision preceding
the always-on source-to-deliverable loop. NoOp preserves the unknowns and
cannot answer that decision. A new mediation hook would measure an invented
boundary rather than the shipped one; a container changes the experiment;
real credentials, external remotes and changes to personal settings are
outside its authority. The smallest useful intervention is the probe and
its deterministic tests. A read-proof mismatch is not proof of read denial.

Policy resistance: keep native controls and DotLn refusals separately
attributed. Commons: one sequential operator session, forty launches and
approvals, two attempts only after launch failure, 120 minutes. Drift:
require attempted operations and independent effects. Escalation: add no
recurring gate or permission mechanism. Success to the successful: assess
both harnesses and both sandbox modes. Shifting the burden: the operator
session is a bounded experiment, not the proposed runtime. Rule beating:
absence, self-reports and missing telemetry cannot become prevention or
liveness. Wrong goal: the decision packet must answer mode guarantees,
not maximize successful launches. Naive Interventionism: preserve useful
current containment, use disposable fixtures and retain negative results;
do not offer or select a new operating mode here.

Reopen the design if the actual target bundle cannot be exercised without
touching kept state, the installed CLI rejects the launch shape, or the
host observation cannot distinguish the tested routes. Unavailable cells
and an inconclusive packet are legitimate evidence, not successful proof.

Entry process cost: counters unavailable; dispatch scope; cutoff
2026-09-17T19:48:34.235Z. No counts or cost inferred.

## WO-136-D002 — Complete activation metadata; retain measurement uncertainty

```json
{
  "id": "WO-136-D002",
  "date": "2026-09-17",
  "dispatch": "resume: next",
  "decision": "Assign application v0.29.1 under the declared patch classification, with no component bump; use only the existing granted commands and retain unavailable prompt observations.",
  "evidence": ["scripts/lib/release-preparation.mjs", "docs/work-orders/WO-136-authority-enforcement-boundary.md", "packages/skeleton/src/source-change-command.ts", "scripts/test-authority-probe.mjs"],
  "rejected": [
    {"option": "NoOp on activation placeholder", "reason": "The release helper cannot consume it."},
    {"option": "Change release machinery or infer prompt counts", "reason": "Neither is needed to stage this research honestly."}
  ],
  "reopenWhen": "A sibling publishes the staged application version or a documented native prompt observer becomes available."
}
```

The activation left the order's version placeholder intact. The local tag
inventory's latest version is `v0.29.0`; assign `v0.29.1` under the existing
patch classification and normalize its declaration to the release helper's
documented syntax. No component source changed, so no package bump is needed.
NoOp leaves `release prepare --local` unable to consume the selected order;
changing the helper would expand a metadata correction into machinery work.
Reopen at final-review integration if a sibling publishes this version.

The deterministic review found that `git diff --check` is not an exact
source-change grant. The sustained workflow therefore uses a second execution
of its declared test, preserving ten separately observed calls. It also
excludes scratch-local settings from fixture commits. An inner read or write
error cannot prove that every operation in a compound command was prevented;
only a matched pre-effect invocation refusal supports that claim. Prompt
counts remain unavailable without an actual human-prompt observer. These
choices preserve the intended evidence standard rather than optimizing the
number of passing cells. Reopen with a documented native prompt channel.

Current documentation checked through Context7 and installed CLI help:
[Claude sandbox scope](https://code.claude.com/docs/en/sandboxing),
[Codex sandbox scope](https://learn.chatgpt.com/docs/sandboxing), and
[Codex SDK](https://learn.chatgpt.com/docs/codex-sdk). A raw model API and a
programmatic local harness are different execution boundaries; launching a
child through a sandboxed shell can retain outer restrictions. This supports
the order's outside-terminal measurement protocol and changes no user setting.

The roadmap's activation paragraph changed the everyday edition's source
lock. Its existing chapter descriptions still distinguish implementation,
evidence and planned capability, so review preserved the prose and refreshed
that lock. The software-engineer edition remained current. No new publication
claim or deployment is made.

Correction, 2026-09-17: the first interruption update attributed immediate
parent termination to terminal Ctrl-C. Inspection of Node's readline path
showed it can instead close the interface while the child remains active.
OS-delivered SIGINT/SIGTERM did lack cleanup. The corrected implementation
handles both readline cancellation and process signals, kills the owned
child group, and refuses relaunch after an unobserved hard interruption.
Regression cases cover timeout, both signals, cancellation and descendant
effects. This is probe correctness within D001, not a new runtime guard.

## WO-136-D003 — Explain alternative choices and continue the original budget

```json
{
  "id": "WO-136-D003",
  "date": "2026-09-17",
  "dispatch": "resume: next",
  "decision": "Clarify each operator choice and allow explicit continuation of a clean stop while preserving all recorded attempts and the original budget.",
  "evidence": ["docs/discovery/authority-boundary-2026-09-17/operator-session.json", "docs/discovery/authority-boundary-2026-09-17/claude-on-1-attempt-1.json", "scripts/lib/authority-probe.mjs", "scripts/test-authority-probe.mjs", "docs/evidence/WO-136/operator.md"],
  "rejected": [
    {"option": "NoOp or close the investigation immediately", "reason": "The operator wanted to run the matrix and stopped because the directions were unclear."},
    {"option": "Delete the session or start a new dated run", "reason": "Erases provenance or resets the declared single-session budget."},
    {"option": "Repeat the ambiguous first cell or infer its cause", "reason": "It returned normally; neither retry authority nor causal evidence exists."}
  ],
  "reopenWhen": "The original budget expires, cleanup is uncertain, or continuation cannot preserve every attempt and count."
}
```

The operator correction on this dispatch was that the guide sounded like an
instruction to launch once, skip once and stop once. The run record matches
that account: one launch, one skip, closed after 73.336 seconds. Closure had no
recorded reason, so the explanation is operator-attested. The first child
returned zero with no recorded tool operation or effect. Its ambiguity remains;
the reducer does not retain enough information to explain the missing attempt.

The defect was in the instructions and in treating any unrecognized answer as
skip. Correct both, record future closure reasons, and require the explicit
`--continue-after-stop` attestation to reopen a clean stop. Preserve the original
start, counts, choices and run files. Check every reserved attempt, including
other harness/mode cells; missing results, abnormal returns or uncertain cleanup
refuse continuation. The current session therefore continues at the skipped
second cell with at most thirty-nine further launches before 22:36:52 UTC.
No kept setting, harness launch shape or tested boundary changes.

This repair restores the intended authority measurement prerequisite to the
source-to-deliverable loop. Policy resistance and escalation: preserve the
existing outside-terminal, per-launch authorization and all limits. Commons:
interruption time still consumes the original two-hour budget. Drift and rule
beating: no relabeling, retrying a completed cell or silently skipping on a typo.
Success to the successful: both harnesses and both modes remain in the matrix.
Shifting the burden: explain the choices in the executable prompt so subsequent
operators need no rescue. Wrong goal: gather the requested observations, not a
premature completion receipt. Naive Interventionism: the bounded probe repair
retains existing guards and results; no runtime or settings change is needed.
NoOp would preserve a known usability failure and lose the intended experiment.
Reopen on budget expiry or any failure to establish safe continuation.

## WO-136-D004 — Finish the bounded investigation as inconclusive

```json
{
  "id": "WO-136-D004",
  "date": "2026-09-17",
  "dispatch": "resume: next",
  "decision": "Preserve all forty operator launches, close the research as inconclusive, and repair cross-selection recovery before the executor handoff.",
  "evidence": ["docs/discovery/authority-boundary-2026-09-17.json", "docs/discovery/authority-boundary-2026-09-17/operator-session.json", "scripts/lib/authority-probe.mjs", "scripts/test-authority-probe.mjs"],
  "rejected": [
    {"option": "NoOp on the recovery gap", "reason": "An ordinary filtered resume can overlook a missing reservation in another harness/mode after a hard interruption."},
    {"option": "More launches in this session", "reason": "All forty launches and approvals are spent; completed ambiguous cells cannot be repeated."},
    {"option": "Qualify a sandbox-off mode", "reason": "The incomplete matrix and unavailable prompt telemetry do not support that claim."}
  ],
  "reopenWhen": "The post-close planning checkpoint authorizes a separately budgeted experiment with observable attempts, prompt coverage and revocation ordering."
}
```

The session recorded forty launches across thirty-eight cells in 3,547,940 ms,
including the interruption; two retries consumed the remaining launch slots.
All forty attempt files exist. The packet's latest-attempt matrix and raw
host observations agree. Keep every run and the session unchanged. Expand the
rendered packet to expose all workflow attempts, their counts and the planning
table's remaining unknowns; a retry must not hide an earlier partial result.
The smallest supported proposal is to retain each harness's current mode with
only the guarantees of its labeled cells. Planning makes the operating-mode
decision after close; no configuration is applied here.

Read-only review found that ordinary resume recovered reservations only after
filtering by harness/mode. Explicit continuation already checked all cells.
Recover every reserved attempt before either path admits a launch, record
uncertain cleanup, and refuse further work. This is a bounded correctness
repair in the existing probe. It does not change launch selectors, payloads,
telemetry classification or the completed session's observations.

Goal and critical path: provide an honest authority decision packet before
later operating-mode claims in the source-to-deliverable loop. Policy resistance
and escalation: preserve existing controls and the one-session limit. Commons:
stop at the forty-launch cap; use deterministic checks and two read-only audits,
with one writer. Drift and rule beating: missing effects, missing prompt counts
and delayed telemetry remain unknown. Success to the successful: judge both
harnesses' cells, including inconclusive results. Shifting the burden: repair
cross-selection recovery once and make the next experiment explicit. Wrong goal:
finish the research method, not a confinement or liveness claim. Naive
Interventionism: retain all evidence and useful guards; restrict changes to
recovery and report readability. NoOp leaves a known recovery hole and stale
preparation instructions. Reopen only with a newly authorized experiment or
contradictory host evidence.

Correction, 2026-09-17: the earlier implementation note said missing-observation
recovery refused every relaunch. That was true for explicit continuation but
not for ordinary resume with a different selection. The global reservation
check and regression below discharge that narrower defect; no recorded live
result is reinterpreted as a result of the repaired code.

## WO-136-D005 — Observe descendant readiness before judging cleanup

```json
{
  "id": "WO-136-D005",
  "date": "2026-09-17",
  "dispatch": "resume: next",
  "decision": "Repair only the termination-test fixture: observe a synchronous descendant heartbeat, use a bounded startup allowance, and require descendant exit plus no further effects.",
  "evidence": ["scripts/test-authority-probe.mjs", "docs/evidence/WO-136/implementation.md"],
  "rejected": [
    {"option": "NoOp or retry until green", "reason": "The fixed 250 ms timeout did not establish the descendant-start prerequisite."},
    {"option": "Treat a missing heartbeat as cleanup success", "reason": "That would pass without testing a running descendant."},
    {"option": "Change the production runner", "reason": "The observed ENOENT is in the test's heartbeat read; no production cleanup failure was established."}
  ],
  "reopenWhen": "A ready descendant remains alive after termination, or the bounded startup allowance remains insufficient in executed evidence."
}
```

The full `npm test` passed nineteen suites in 479.00 seconds. Its default
product selection excludes the probe machinery. The separately selected
probe suite passed thirty-one tests and failed the timeout test when
`heartbeat.txt` did not exist after its 250 ms deadline. That deadline covered
two Node startups and the descendant's first delayed heartbeat; the result
establishes an unobserved startup prerequisite, not a cleanup failure.

Write the first heartbeat and owned descendant PID synchronously at startup.
Observe readiness before signal/abort cases, allow three seconds for the
wall-clock timeout, and require readiness in every case. After termination,
check both an unchanged nonempty heartbeat and bounded absence of the owned
PID. The process runner and all live experiment data remain unchanged.

This preserves the authority experiment's cleanup evidence, a prerequisite for
safe bounded research. Rule beating and drift reject an empty-heartbeat pass;
commons adds only bounded fixture time. Policy resistance and escalation retain
the same production cancellation behavior. Success to the successful and
shifting the burden favor an evidence-based fixture over repeated operator
retries. Wrong goal is avoided by testing a real initialized descendant rather
than chasing green output. Naive Interventionism keeps the repair in tests;
NoOp leaves the observed race. Reopen if a ready descendant survives or startup
still exceeds the explicit bound. The existing product gate is retained as
executed evidence; the complete changed machinery suite is rerun.

## WO-136-D006 — Retime the unpublished target to v0.29.2 at integration

```json
{
  "id": "WO-136-D006",
  "date": "2026-09-17",
  "dispatch": "resume: final review",
  "decision": "Integrate main at 83e01cb and retime the unpublished application target from v0.29.1 to v0.29.2 under the existing patch classification, with no component bump and no change to scope or acceptance.",
  "evidence": ["docs/product/07-execution-guide.md#independent-workflows-and-integration", "docs/evidence/WO-136/decisions.md#wo-136-d002", "docs/product/06-roadmap.md", "README.md", "docs/work-orders/WO-136-authority-enforcement-boundary.md"],
  "rejected": [
    {"option": "NoOp on the collision", "reason": "v0.29.1 is already an annotated published tag, so release close would refuse the colliding target."},
    {"option": "Route the collision through repair and a new verification", "reason": "Product 07 names a sibling's publication and a version collision as bookkeeping, never a finding."},
    {"option": "Change the release classification", "reason": "Nothing in the integrated diff changes component source, runtime behaviour or compatibility; the patch classification still describes it."}
  ],
  "reopenWhen": "Another order publishes v0.29.2 before this branch merges, or an integration resolution changes component source and its declared compatibility impact."
}
```

Dispatch: `resume: final review`, 2026-09-17. D002 named this exact reopening
condition — "a sibling publishes the staged application version" — and WO-141
did: `main` advanced from `096323c` to `83e01cb`, which carries the annotated
`v0.29.1` tag this order had staged. D002 stays as recorded, because it was
correct at its own subject; this record carries the correction.

`npm run release -- prepare`, on origin's tag observation, retimed the order
heading, the README claim and the dated roadmap note to `v0.29.2`. The original
activation paragraph is preserved beside the retiming note rather than
rewritten. No component version moved: `release check-surfaces --local` reports
compiler `0.13.0`, console `0.1.6`, kernel `0.5.0` and skeleton `0.25.1` all
unchanged against the `v0.29.1` baseline, and this branch changes no file under
`packages/`, `package.json` or `package-lock.json`.

Goal and critical path: the research packet reaches the post-close planning
checkpoint only if it can be published, and a colliding tag blocks that.
Policy resistance and escalation: the retiming adds no gate and no new
authority; it consumes the helper the execution guide already assigns to this
stage. Commons: one merge, one helper run and the affected checks, not a fresh
verification of unchanged claims. Drift and rule beating: no acceptance claim
is restated as met because the base moved, and the claims re-established on the
integrated tree are named separately from those carried forward with their
original evidence in FINAL-001. Success to the successful and shifting the
burden: the integrating session does this work rather than asking the operator
to sequence sibling phases. Wrong goal: the point is an honest publishable
record, not a green surface check. Naive Interventionism: the smallest edit that
resolves the collision is the version string in three surfaces.

Reopen if another order publishes `v0.29.2` first, or if a later integration
changes component source and therefore its declared compatibility impact.
