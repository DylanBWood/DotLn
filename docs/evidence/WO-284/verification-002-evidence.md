# WO-284 verification 002 evidence

Observed on 2026-11-17 at code identity
`e03bcca317eae92cb7ea8c5b7d5fbb7b9d4403b6beea8f2b46c91c6ab02a9c77`.
The verifier did not change implementation files. The complete repair source
diff and full probe logs remain in ignored session scratch; the
[machine receipt](verification-002-checks.json) selects fields relevant to the
verdict and retains every task of the exported-instance measurement.

## Executed checks

Each probe ran serially under `node scripts/harness.mjs bounded --`.

| Check | Result |
| --- | --- |
| VER-001's unchanged `verification-001-probe.mjs` | Exit 0; zero contract failures. Raised limit recorded; changed scale removes standing and forces actual execution. Its deliberately small timeout fails as expected. |
| Runner cases matching `WO-284 criterion 1`, `criterion 7`, `criterion 4`, and `criteria 1 and 2` | Five tests pass: fresh and reused settings, installed-instance readers, forced execution, structural expiry and source inventory. |
| New `verification-002-probe.mjs` | Five independent assertion groups pass across a main checkout and linked worktree. |
| Export case `the exported instance checks runtime, coordination records and explicit diagnostics separately` | One test passes, including all three selections at one-third figures and the failing timeout arm. |
| Worktree integration case matching `^WO-284 criterion 6` | One test passes; actual briefing and integration forms, including changed limits and unavailable index. |
| Configuration cases matching `time limits resolve` and `limits lists every key` | Sixteen reported tests pass. |
| `npm run format:check` before verifier records | Exit 0; all matched files use Prettier style. |

The original probe and all existing cases ran from their repository paths.
The independent probe first ran from session scratch; its source is preserved
here, formatted and rerun before handoff. The receipt records the final
execution. It creates only temporary fixture repositories and removes them.

## Consumed product evidence

The standing-row reader and raw record fields agree:

- Complete review: recorded `2026-11-17T07:53:35.669Z`, exit 0, 47 suites,
  124 tasks, 0 h 51 min. Every task was fresh.
- Plain selection: recorded `2026-11-17T07:55:51.177Z`, exit 0, 38 suites,
  7 fresh tasks and 106 carried tasks, 0 h 1 min.
- Executor's document row: recorded `2026-11-17T08:09:57.550Z`, exit 0.
  This is entry evidence; the new verifier report requires the final document
  row below.

The current code identity matches both product rows. No complete repository
run was started by this verifier. The local gate/reuse instruments are part
of the subject; the fixture assertions test their decisions directly.

## Review and provenance

The repair is compared with the subject VER-001 judged, retained by checkpoint
4, through the repair handoff at checkpoint 6. The repair's complete source
diff, tests, documentation changes and consumer paths were read. Generated
snapshot and edition outputs are checked by the established generators and
gate rows. The current repair combined report and all earlier review findings
and rechecks were read; nested round-2 records were decoded before reading.

New inputs are the repair handoff and review, the changed effective-limit
readers and tests, the current gate rows, and this verification's linked-worktree
probe. Cited order authority and prior decisions were read. Unchanged claims
carry VER-001's evidence as the re-verification rule permits.

D030 and D034 retain existing limitations with named follow-ups. This report
adds no unimplemented product finding. D037 records the verifier's repeated
read-output truncation and its bounded-read correction; D038 records why the
repair passes and the existing complete row is consumed.

## Final document check

`node scripts/terms.mjs branch` passed with 127 changed files screened, zero
refuse lines and zero context lines; zero matched lines required contextual
reading. The list was not printed.

The first document attempt, recorded `2026-11-17T08:38:56.716Z`, exited 1.
Its only failed check was `docs-check`: the verifier's new D037 and D038
dispatch fields lacked the required control prefix. D039 records the error
and correction. The failed row remains in the machine receipt. The passing
replacement is recorded below before the result is filed.

The replacement `npm run test:docs` passed at `2026-11-17T08:43:58.908Z`: 29
tasks passed, zero failed, 0 h 2 min. The actual `validDispatch` function also
accepted all three verifier decisions before this run. The code identity
remained unchanged. Candidate tree: `8ff82537893a455574c9998ddf932be2bcd838c7`;
document projection: `05d4da357a563fe65a5e418889ba00b177cb0143`, excluding only
`docs/evidence/WO-284`. These receipt-only additions lie inside that exclusion
and preserve the passing row. The allocated verification report is unchanged
after the passing gate.

The first completion invocation was refused before recording: its flags
omitted the optional account label that the report includes. D039 also
records this correction. The next invocation supplies
`--account-label not-applicable`, preserving the reviewed report and its
passing document row. Canonical status after the refusal remained verifying.
