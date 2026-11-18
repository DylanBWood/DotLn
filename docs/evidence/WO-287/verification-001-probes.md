# WO-287 independent verification probes

On 2026-11-18 the verifier checked implementation-ready checkpoint `5285a2ff3311ab207bfd02e0c521a35186e374e5` against base `b08b8e811`. The product code identity was `0b962aecb6357c0b4a3ca7d87787905cdf4902d726606af02ff1137b4b52502e`. The following observations use the candidate's own entry points in disposable fixtures. The Git object for the base supplied the old test and the old gate lookup in the two comparisons below.

## A passing instance gate at handoff

Use the A6 instance fixture in [test-runner.test.mjs](../../../scripts/test-runner.test.mjs). It runs the document selection in a temporary repository. Its format and index tasks can pass, advise, or be switched off. Immediately after each real selection finishes, call the same lookup the completion uses. In the fixture, `f.repo` is the root and `checked` is the object returned by the gate.

```js
const { requireDocumentRow } = await import("./lib/handoff-ledger.mjs");
const { gateTreeHash } = await import("./lib/gate-evidence.mjs");
const exactTree = checked.treeHash === gateTreeHash(f.repo);
const handoff = await requireDocumentRow(f.repo);
```

The base comparison loaded `scripts/lib/gate-reuse.mjs` from `b08b8e811` and asked its `coveringGateCheck(f.repo, "npm run test:docs", [])` whether the same locally recorded row stood for that tree. The probe used each lookup on the same bytes before changing the fixture for the next selection.

| Format and index | Selection exit | Recorded task state | Exact tree | Base lookup | Candidate handoff |
| --- | --- | --- | --- | --- | --- |
| Both fail under the instance defaults | 0 | Both advised | Yes | Accepted | Reported the row missing or failed |
| Both stops explicitly off | 0 | Both off | Yes | Accepted | Reported the row missing or failed |
| Both pass with stops set to refuse | 0 | Both passed | Yes | Accepted | Accepted |

The new exclusion in `executedPass` correctly prevents later selections from carrying an advised or off task as a pass. `coveringGateCheck` also applies that exclusion to the deciding result of the completed selection itself. D007 explicitly requires that selection to support handoff. Repair the distinction between accepting a whole selection and reusing a task in a subsequent selection. The three rows above and the existing later-selection reuse case exercise both obligations.

## Command operands in the drive record and report

Use the Claude stream reader with an ordinary Bash tool-use event, then the corresponding `system/permission_denied` event. Supply `decision_reason_type: "rule"` and a fixture tool-use id. Use the reader's actual `observed().declined` and other observed fields in an interrupted `next` attempt on fixture order `WO-999`. Write that record at `driveRecordPath(fixtureRoot, "WO-999")` in a temporary Git repository on `main`. Run `node scripts/drive.mjs why WO-999` with `DOTLN_LAUNCHPAD` set to that fixture. The synthetic events describe the commands. The probe ran only the report command.

| Input in the event | Retained command shape | Command printed by `why` |
| --- | --- | --- |
| `cat next` | `cat next` | `cat next` |
| `cat orchard-sample` | `cat <operand>` | `cat <operand>` |
| `cat worktree` | `cat worktree` | `cat worktree` |

All three records identified Bash, the phase worker and the rule that decided the denial. With `cat`, the second word is a filename in every row. `commandShape` in [drive-diagnostics.mjs](../../../scripts/lib/drive-diagnostics.mjs) checks a word against a common vocabulary in every position. The retained input in rows one and three fails D1 and its appearance in the public report fails D4. Repair both the recording and the rendering of previously recorded shapes. Keep the program, supported subcommands and flags in their appropriate positions and mask data arguments.

## The first observed helper overrun

Use the A4 drive fixture in [test-drive.mjs](../../../scripts/test-drive.mjs). Choose an instance with per-spawner cap one and drive ceiling eight. Admit the phase through `admitWorker`, create one `workerObservers` for the admitted worker, and deliver two distinct child observations from its same native session. The second crosses the cap. Repeat with cap two and drive ceiling one, where the first child crosses the ceiling. Capture what the driver prints from before phase admission through the last observation. The fixture supplies the notifications without launching a provider worker.

| Stop level | Phase admitted within budget | Uses after crossing per-spawner cap / drive ceiling | Advisories on crossing | Further work stopped |
| --- | --- | --- | --- | --- |
| `advise` | Yes | 3 / 2 | 0 | No |
| `off` | Yes | 3 / 2 | 0 | No |
| `refuse` | Yes | 3 / 2 | 0 | Yes |

The counter includes the phase admission. The missing advisory is observable at the first supported child notification crossing either limit. In [drive-session.mjs](../../../scripts/lib/drive-session.mjs), `workerObservers().onSubagent` tests the limits after recording the children and acts only at `refuse`. Report the crossed limit, the stop and its purpose at `advise`. The existing direct launch and review-helper cases cover admission before a launch. This check covers what Codex reports after admission.

## The incompatible baseline assertion

Load the unmodified `scripts/test-harness.mjs` blob from `b08b8e811` at that test module's ordinary URL, leaving its relative imports and generated hooks on the candidate. Select `WO-276 criterion Q3: on a planning branch` under the bounded Node test runner. One case ran and failed on an exact string equality. The hook denied the ordinary fixture write to `scripts/new.mjs`. The old assertion required the recovery override as its directions. The candidate named `planning-branch`, its configuration line and where the owner can set it. The current case and the A10 case pass on that response. A4's demand that this baseline case pass unchanged is incompatible with A10. The lifecycle recorded the contradiction at ordinal 6.

## Controls and coverage

The verifier resolved all 35 named selections in [the handoff case list](handoff-case-runs.md), ran each in its own bounded invocation and required an actual passing test result. All 35 passed, comprising 43 Node test results. The A4 review-helper case also passed alone. In a separate fixture the public features commands returned 91 stops and 43 rules, including 10 feedback units. One unknown feature, one unknown stop and one invalid stop level produced one warning each. Valid explicit levels took effect in the same configuration.

The recorded complete review and plain selection had 47 and 38 suites respectively. The verifier checked their code identity against the current checkout and consumed those results. The last document gate for this verification is recorded by the lifecycle result. No external publication was exercised by the drive fixtures.
