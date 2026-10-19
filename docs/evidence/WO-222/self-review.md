# WO-222 executor self-review

Two fresh, read-only workers reviewed only the order and the implementation
diff on 2026-10-19. Both ran Codex `gpt-6.1-sol` at `max`, with no descendants,
edits, tests or network requests. The root executor remains the only writer.
The reviews preceded the complete gate and measured series; pending
measurements and live evidence were not treated as completed work.

## Criteria adversary

Found 0 confirmed findings. The worker found no concrete regression in
criteria 1–4 and confirmed preservation of the substantive case/helper
lines and the 39 declarations expanding to 60 cases.

The worker asked whether the measurement deadline path agreed with the
runner for configured document roots. Initial source inspection confirmed
the paths agreed, but the first complete gate then refused the measurement
script's new literal document root. The executor's initial disposition was
incomplete. The measurement now reads `gate.deadlineDiagnostics` from the
same recorded row as its task timeline, eliminating the duplicated path and
binding the samples to that run directly.

## Design and simplicity improver

Found 1 finding, fixed 1, recorded as unresolved 0. The baseline table called
`criticalPath.workMs` total task work and `criticalPath.waitMs` scheduler
idle. The headings now explicitly say critical-path work and wait. The
numbers are unchanged.

The worker found no confirmed functional defect or case loss. Four
uncertainties were resolved:

- `runGate` supplies `hostLanes.capacity: limits.hostLanes` to the scheduler,
  so the real gate inherits the recorded capacity.
- Explicit multi-lane scheduler fixtures now provide synthetic parallelism
  of 16, avoiding dependence on a smaller test host's observed capacity.
- The measurement consumes the recorded row's deadline diagnostics, as above.
- `runGate` passes `row.timeoutMs ?? 900_000` to `executeSuite`, matching
  the task timeline's recorded `timeoutMs`; `startDeadline` enforces that
  duration unchanged. Inner measured operations derive their bounds from
  the scheduler's declared load.

The executor additionally made the case-inventory assertion collect all 60
expanded names without running case bodies, and removed obsolete blocker
setup from the recorded-capacity clone fixture. These changes subsequently
passed the complete review recorded at
2026-10-19T17:34:15.780Z: 102 fresh tasks, zero failures and no reuse.

## Architecture supplement

The same two workers reviewed only the amended order and the architecture,
product write-back and D012 diff. They were reused, not new agent admissions;
both remained read-only with no probes, network or descendants.

The criteria adversary found 1 issue, fixed 1: product 07 said the exclusive
peer deadline factor was six even on smaller hosts. It now says twice the
declared concurrency, up to six. The architecture description and source
already expressed the variable factor correctly. The design improver found
0 additional issues. Both found the implemented/proposed boundary and the
migration tradeoffs clear.

The workers did not independently verify linked historical figures or external
sources within their two-input review. The executor checked the selected
historical records, current source and named primary references; the architecture
record states that research boundary. The measured series remains a separate
executable obligation.

## Measurement repair supplement

The same two read-only workers reviewed only the order and the diff for the
measurement selector, its regression and the target-publication case bounds.
Both found 0 additional issues. The criteria adversary confirmed that the
selector rejects alias, plain and out-of-window rows; the design improver
confirmed preservation of standalone bounds and use of declared load.

The workers did not execute checks. The root's bounded reproductions passed
as recorded in D013. The root also confirmed that the production measurement
child enables deadline collection, and that the retained failed attempt has
33,590 raw diagnostic samples. The series runs one gate at a time, as its
selection window assumes.

self-review: found 2; fixed 2; recorded 0
