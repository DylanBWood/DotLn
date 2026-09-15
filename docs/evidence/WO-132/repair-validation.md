# WO-132 repair validation

Dispatch: `resume: fix`, failure source
[VER-001](../../verifications/WO-132/VER-001.md). This repair addresses F1 and
the operator-approved bounded F2/F3 repair, plus the missing-duration defect
found in the same reconciliation function. Root was the sole writable agent;
two independent analysis workers reviewed without editing files.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.154.0","model":"gpt-6-astra","effort":"max","source":"operator-attested"}

The installed CLI version was observed with `codex --version`. Model and effort
use the repository's declared session default; effective-session readback was
not exposed. No branch commit or publication was performed.

## Cost reconciliation

The new integration regression first failed with only `adds fixture setup;`
captured. It now passes through work-order Markdown, closed-order collection,
observed gate rows and rendered `PLANNING INPUT`. It tests next-field,
paragraph and end-of-file boundaries, a genuinely wrapped WO-126 authority,
and an empty Cost field. WO-126's complete promise is now 462 characters,
including its removal clause, against the verifier's observed 64 characters.
The live meter also returns complete WO-127–WO-131 promises of 376, 881, 813,
848 and 1,162 characters, each including its removal clause.

The missing-duration regression first reproduced `met` for an undefined
duration. Undefined, null, nonfinite, negative and string durations now retain
their displayed observations but yield `unknown`; an observed zero remains
valid. Existing explicit-bound tests retain the measured boundary shortfall.

VER-001's claim that WO-132's Cost paragraph contains a six-minute ceiling
was incorrect. The paragraph gives an estimate; criterion 6 gives the limit.
No ceiling is inferred from another section or an estimate. D004 records the
correction without editing the immutable verification report.

## Live-gate shell reads

Before the source repair the expanded fixture failed on the `ls scripts`
admission. It now covers `ls`, `head`, a `grep | head` pipeline, and the
`exec_command` shell surface through permissions, writer-isolation and
write-observer hooks. All three retain protected-file and success-record
write denials, including redirection, `tee` and chained `touch`.

`for` loops, substitutions, glob/variable expansion, wrappers and unrecognized
programs remain opaque and refused during the gate. Thus the repair addresses
the ordinary utility reads in F2 and the missing shell-read coverage in F3;
it does not establish a general read-only shell classifier. Writer reservations
and host permissions are unchanged. Tests inspect hook judgments; dangerous
negative payloads are not executed.

## Checks

| Executed check | Result |
| --- | --- |
| `node --test --test-name-pattern=WO-132 scripts/test-process-debt.mjs` | 11 passed, 31.083 seconds |
| `node --test --test-name-pattern=WO-132 scripts/test-harness.mjs` | 9 passed, 32.660 seconds |
| `npm run build` | Passed |
| `node scripts/harness.mjs emit` then `check` | 24 generated surfaces passed; stale build snapshot refreshed |
| `npm run release -- prepare --local` | Existing v0.18.0 target remains current |
| `npm run meta -- --json` | Complete closed-order promises observed; ambiguous ceilings remain unknown |
| `node --test scripts/test-process-debt.mjs scripts/test-harness.mjs` | 89 passed, 212.024 seconds |
| `npm run test:docs` — after selecting authority revision 001 | 17 passed, 0 failed, 67.21 seconds |
| `npm test` | 19 suites passed, 0 failed; 62 fresh tasks, 0 reused; 251.717 seconds |
| `npm run format:check` and `git diff --check` | Passed |
| Historical preservation comparison | 16 original WO-132 evidence/report files match the entry checkpoint; WO-126–WO-131 evidence unchanged |

The product row was recorded at 2026-09-15T13:42:32.121Z, with code identity
`d794edaa781d48cfd9b90251db01adcc97186b376c1cb9eca279bab953f5c430`
and exact tree `1455565ed00875fe59bcd249bbf33259671de09e`.
Its evidence reference is
`host-gate:d794edaa781d48cfd9b90251db01adcc97186b376c1cb9eca279bab953f5c430:npm test`.
Final report edits and the clarification that the opaque loop fixture is a
`for` loop preserve that code identity; publication freshness is checked again.

The first document run failed its stale authority bundle check, with four
dependent checks unable to run (12 passed, 5 reported failed, 40.03 seconds).
The existing immutable-evidence procedure generated and validated authority
revision 001 before selecting it. Both original authority files remain intact.
The successful rerun above includes that revision. The earlier targeted
negative regressions and this stale-evidence run are failure observations,
not passing evidence. Executed local logs are retained under
`/private/tmp/wo132-repair-*.log` for this session.

The prepared compiler 0.10.0, skeleton 0.16.0 and console
0.1.6 classifications remain appropriate within the unpublished application
v0.18.0 deliverable. This repair adds no dependency or further component bump.

The repair's observed outcome is the complete promised-removal text reaching
planning, unavailable measurements staying unknown, and ordinary utility reads
being admitted while protected writes still deny. Both approved adjacent items
are complete. No required implementation work remains; the next role independently
re-verifies this changed source.

## Evidence limits

The original execution calibration and VER-001 remain historical observations
of their own source identities. This repair does not relabel those runs as
evidence for changed bytes. Independent re-verification and final review use
their separate dispatches. The publication source lock was refreshed for the
documented parser and shell-read behavior. Process counters, when unavailable,
are unknown rather than zero and remain in ignored session receipts.
