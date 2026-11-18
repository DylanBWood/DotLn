# WO-287 second verification probes

The probe used the repair's code identity `4e611fb8310d4529b0cb032920bca0767a41db1630cdbbbdbdc52c277ddc32ca`. All command inputs and denial events below were synthetic. The only drive command executed was the read-only account in a disposable Git repository.

## F1. An option's value in the denial record and account

1. In the D1 and D4 fixture in [test-drive.mjs](../../../scripts/test-drive.mjs), use the Claude `streamObservation` reader. Supply a Bash tool-use event followed by its `system/permission_denied` event with decision source `rule`. The value under test is `input.command` on the Bash event.
2. Read `observed().declined.command`. Put the observed denial in the last attempt of a stopped fixture drive, stored at `driveRecordPath(fixtureRoot, "WO-999")`.
3. Point `DOTLN_LAUNCHPAD` at that fixture and invoke `node scripts/drive.mjs why WO-999` from this candidate. Read the shell shape on the line beginning `Ended by:`.

| Bash input in the fixture event | Stored shape and shape printed by `why` |
| --- | --- |
| `cat next` | `cat <operand>` |
| `node --test --test-name-pattern 'orchard-sample' scripts/test-drive.mjs` | `node <flag> <flag> <operand> <operand>` |
| `node --test --test-name-pattern 'drive.mjs' scripts/test-drive.mjs` | `node <flag> <flag> drive.mjs <operand>` |

The account exited zero in all three cases. The independent probe exited one on the assertion that the test-name pattern must be masked in the denial record. The public account printed the same shape. The original filename case and an ordinary name pattern supplied controls. Node takes the argument to `--test-name-pattern` as data. Both pattern values should have been masked.

In [drive-diagnostics.mjs](../../../scripts/lib/drive-diagnostics.mjs), the Node script position stays open after a flag whose arity is unknown to the grammar. It then treats the recognized basename as a script. Reapplying the grammar to the stored shape in [drive-account.mjs](../../../scripts/lib/drive-account.mjs) preserves the mistake. The repair should only retain an operation when the grammar establishes its position. Mask ambiguous words at recording and when rendering stored shapes, and keep a focused test with a flag value that coincides with a known script name.

## Prior findings and gate evidence

Thirteen individual Node tests ran under `node scripts/harness.mjs bounded`, each with a matching TAP result of one pass. The selections covered A6 handoff and gate reuse, the original D1 and D4 redaction cases, A4 phase admission and reported helpers, current Q3 and A10 denial text, D1 and D2 denial attribution, D3 environment, D4 account, D5 router guard, E1 helper stops, and the native role model bindings.

- **VER-001 F1.** In the A6 handoff case the exact successful document row stood with advised, off and passing tasks. The later product selection ran advised tasks again. This is the whole-row and per-task distinction required by the repair.
- **VER-001 F2.** The repaired cases masked filenames and the previously reported search inputs on both recording and display. The test-name-pattern variation above still fails the same requirements.
- **VER-001 F3.** The reported-helper case verified one advisory at the first crossing of each kind of limit, including a native helper after a kit launch. It covered replay, a nested sender, silence at off and stopping further work at refuse.
- **Recorded A4 contradiction.** The original Q3 assertion is preserved in the base Git blob. Its demand for the old recovery direction and A10's requirement for the new guidance still conflict as recorded at ordinal 6. The current Q3 and A10 cases both passed.

The canonical product-claim reader accepted the executor's complete review selection at 11:53:17 UTC on 18 November (47 suites, 124 tasks) at this same code identity. The plain selection at 11:55:05 UTC also passed (38 suites, 113 tasks). The repair's document row included `docs-check-fixtures`, and the report's document gate supplies the matching row for the verifier's tree. Four evidence suites absent from those task results were checked individually at this identity. The `--only` selections for `artifact-evidence`, `authority-evidence`, `harness-evidence` and `verification-evidence` each reported nine passed, zero failed and nine fresh tasks.

The focused tests used local fixtures. The candidate supplied its stream reader, public account, gate index and lifecycle reader. The independent fixture's assertion and two control inputs checked the record and public account directly.
