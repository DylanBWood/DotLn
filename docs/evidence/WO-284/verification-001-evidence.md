# WO-284 independent verification evidence

Recorded 2026-11-17 for [VER-001](../../verifications/WO-284/VER-001.md).

## Subject and consumed evidence

The independently read standing complete review row has code identity
`e092cbf784c70638a87324eaf3eb87b6f007c0b25a2dd2c419aed8c2eee8f302`,
recorded `2026-11-17T04:17:19.412Z`, exit 0, 47 suites and 124 fresh tasks.
Its evidence reference is
`host-gate:e092cbf784c70638a87324eaf3eb87b6f007c0b25a2dd2c419aed8c2eee8f302:npm test`.
The probe reads this row through `standingReviewRow` and records its fields in
[the result capture](verification-001-results.json). It supplies the structural
and all declared Preflight rows. The same-identity plain row passed at
`2026-11-17T04:19:56Z`, with 38 suites, 7 fresh tasks and 106 reused tasks.
No complete gate was rerun by this verifier.

The implementation formatting check passed. The executor's complete gate took
0 h 58 min and its plain gate 0 h 1 min; reusing their unchanged subject avoids
repeating that work. The verifier instead attacked configuration changes after
a pass, the specific transition the existing passing tests omit.

The earlier document row is not used for the new verification report. The
final document gate is run after the report and generated decisions index are
written; its result is appended below before the lifecycle result is recorded.

## F1: effective limits are absent from reuse eligibility

Run from this worktree:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-284/verification-001-probe.mjs
```

The probe uses the actual resolver, runner, gate index and closeout reader in a
registered disposable Git fixture. It records a passing complete review row,
changes only the supported limits file, and checks the resulting rows. The
fixture is removed in `finally`. Exit 1 deliberately reports the reproduced
contract failures; unexpected assertion failures also exit nonzero.

Observed:

1. Raising `suite.default` from 0 h 45 min to 1 h 30 min resolves correctly,
   but the new review selection reuses a task with the old figure in its record.
2. Changing `scale` to `0.00001` keeps the code identity and passing review
   standing. Closeout prints satisfied and lists only the document gate.
3. `--review --again` returns exit 0 with `executed: false`.
4. `--review --again --reason` executes the same task under the new figure and
   exits 1, with `failureKind: timeout` and `timeLimitKey: suite.default`.

Exact machine figures and the closeout/runner messages are in
[verification-001-results.json](verification-001-results.json). For example:

```json
{
  "raised": { "resolvedTimeoutMs": 5400000, "reusedTaskTimeoutMs": 2700000 },
  "scaled": { "resolvedTimeoutMs": 27, "unforcedExecuted": false },
  "reasonedRun": { "exitCode": 1, "failureKind": "timeout" }
}
```

Expected: a task record and the standing pass used for current claims must
reflect the current effective limits. A settings change that can change the
result must not be hidden by prose-only reuse. The check is against criterion 1,
not a claim that a deliberately tiny figure should pass. It also satisfies the
planning receipt's explicit reopening condition for closeout after a limits
change. The direct reproduction uses a core-style root and the real closeout
reader; it does not claim a second full exported-instance run or an end-to-end
integration command under changed limits.

The cause is visible in `gateCodeIdentity`'s exclusion of the control document
and `identityRows`' matching only code identity and instance runtime inputs.
Repair must make runner task reuse, standing complete rows, closeout and the
forced-run answer agree on the relevant effective configuration. Preserve
prose-only reuse and add transition regressions for numeric entries, `scale`,
`null` and `enforce`, including configured control roots and installed instances.

## Independent passing checks

[Check receipts](verification-001-checks.json) retain reproduction commands, exit codes,
times and output-drop counts. Each command ran serially under the bounded
wrapper, outside a repository gate.

| Check | Observed result |
| --- | --- |
| Runner's WO-284 cases | Five passed: fresh settings, timeout diagnostics, reuse/forced-run behavior, host children, AST inventory |
| Configuration limits and writer cases | Fifteen passed, including next-release kit values and owner overrides |
| Closeout criterion 6 case | Passed, including missing, failed and unreadable standing evidence and the briefing/integration paths |
| Sync timeout case | Passed; generated timeout remains a named time failure |
| Emitted guidance case | Passed for the reviewer and executor roots |
| Live feedback audit | Passed: ten regressions, ten removal failures and 1,192 fewer matched instruction bytes |
| Implementation formatting | Passed |
| Independent instance selection/configuration probe | Passed for plain, document and review selections; kit configuration tests appear only by name, and an invalid own configuration is refused with its field named |

The last probe's source is
[verification-001-instance-selection.mjs](verification-001-instance-selection.mjs).
The F1 probe also passes checks for disabled enforcement, one advisory for an
invalid value, scaled fallback, preservation of owner data during `--write`,
listing every table key, and same-process relocation of the control directory.

The exported instance's three one-third selections and failing arm are consumed
from the complete row and the executor's per-task capture in
[evidence.md](evidence.md#the-exported-instances-gate-at-one-third-of-every-figure).
The test reads each task's own result. This does not establish cold guard
startup room; that previously recorded limit remains in D030's follow-up.

## Review scope and limits

Read the work order, cited product and census sections, cited prior decisions,
the full tracked implementation diff, new resolver and CLI, related tests and
documentation, and all execution review rounds. Nested round-2 reports were
decoded in scratch before reading. The driver architecture stays a planning
artifact under D019. There was no earlier verification report. No new lint or
type suppression directive was found in the source diff.

No worker was launched and no implementation file was changed. The bounded
wrapper, timeout runner, evidence reader and closeout reader are themselves
under verification. Independent assertions and retained result fields support
the judgment; their self-reported pass alone does not establish F1's outcome.
No clean-room, credential or authority-boundary finding was observed within the
reviewed surfaces. Retained nonblocking limitations and reopening conditions
are boarded in D030. Output-selection errors and their correction are D028. D031 records the
first document-gate failure and clarifies command provenance; the two
invocations containing session-only paths are annotated in the receipts.

## Document validation

The first `npm run test:docs` attempt recorded `2026-11-17T05:03:48.053Z`
exited 1 after 0 h 2 min. `docs-check` named exactly three failures: the new
dispatch fields in D028, D029 and D030 lacked their required control prefix.
The record format was corrected within verifier authority, documented in
D031, and the projections regenerated before rerunning the document gate.
The implementation identity remains unchanged.

### Final passing gate

After the D031 correction and `npm run meta`, `npm run test:docs` passed:
29 tasks, all fresh, none failed, in 0 h 3 min. The repeated branch terms scan
screened 120 changed files and found zero refuse lines and zero context lines;
zero matched lines required contextual reading. The generated decision index
contains D028 through D031 and the named follow-up is projected.

The passing row excludes only this order's evidence directory from its document
projection. This appended receipt therefore preserves the report's validated
candidate. The report itself is unchanged after the gate.

```json
{
  "checkId": "npm run test:docs",
  "recordedAt": "2026-11-17T05:08:26.171Z",
  "exitCode": 0,
  "durationMs": 164325,
  "treeHash": "e412fe8b07c025cec9aefee30577e0bf071c2f48",
  "documentTreeHash": "bbc7f6dfa9f898ba8dda25827ecf60562826a952",
  "documentTreeExcludes": "docs/evidence/WO-284",
  "codeIdentity": "e092cbf784c70638a87324eaf3eb87b6f007c0b25a2dd2c419aed8c2eee8f302",
  "evidenceRef": "host-gate:e092cbf784c70638a87324eaf3eb87b6f007c0b25a2dd2c419aed8c2eee8f302:npm run test:docs",
  "freshSuites": 29,
  "reusedSuites": 0,
  "taskCount": 29
}
```
