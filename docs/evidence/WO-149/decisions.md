# WO-149 decisions — Codex sessions begin at dispatch

## WO-149-D009

```json
{
  "id": "WO-149-D009",
  "date": "2026-09-21",
  "dispatch": "resume: final review",
  "decision": "Record, without repairing it inside this review, that a Codex lifecycle dispatch whose session begin throws for any reason other than the already-began refusal fails the whole command after its transition is already appended. Pass the order on its acceptance criteria and leave D001's visible-failure design standing; carry the residual risk as a named follow-up rather than reversing a judged executor decision at final review.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts:1578-1600: beginHarnessSessionOnce absorbs only the exact string 'Session already began; do not erase its observations' and rethrows every other error, reproduced by an executed probe in which beginHarnessSessionOnce(root, 'wo149-review-probe', 'not-a-role') rethrew 'Invalid harness session'",
    "scripts/resume.mjs:1153-1175 calls it with no catch; the surrounding handler at 1214-1220 converts a post-transition failure into the 'Completion recorded; final handoff failed' guidance only when releaseExecutorWriter is set, and that is assigned only in implementation-ready (line 903) and repair-complete (line 1010), not in any of the five Codex dispatches",
    "verify (line 927), fix (line 999) and final-review (line 1035) append their transitions inside their case blocks, before the begin at line 1157, and process.stdout.write(message) at line 1226 sits after the try, so a throw exits 1, suppresses the dispatch briefing carrying the allocated report path, and leaves a recorded transition that the role text forbids repeating",
    "Both independent planning refutation receipts recorded the same path: 2026-09-21-planning-9d2888b45f687bc6-022 and 2026-09-21-planning-1457ac11ba15715d-023 state under failureBehavior that an unguarded failure 'would refuse lifecycle work for a measurement concern' and that 'the mechanism should log and proceed with a cause code'; docs/planning/standard-pass-2026-09-21.md records it as a known issue and not a hold",
    "No acceptance criterion requires it: criterion 1 covers the repeat dispatch raising nothing and the no-thread case, and VER-002 passed all five criteria on this subject",
    "The adjacent unbuilt-runtime branch at scripts/resume.mjs:1171-1175 already demonstrates the convention a follow-up should use: a named stderr advisory and an admitted dispatch"
  ],
  "rejected": [
    {
      "option": "Fix it here as bounded boy-scout cleanup by catching the begin and writing an advisory",
      "reason": "It changes error-handling behavior rather than cleaning an adjacent path, and it reverses D001's recorded decision after an independent verifier passed that subject. The reviewer edit would ship the one behavior in this order that no independent verification judged."
    },
    {
      "option": "Fail the order into repair",
      "reason": "Every acceptance criterion is met and reproduced in VER-002, the plan disposed this path as a known issue rather than a hold, and the risk needs an unwritable session store, a stale dist bundle or a control-read failure to bite."
    },
    {
      "option": "Leave it as a final-review report sentence",
      "reason": "A defect met and not fixed has to be reopenable from the order's own decisions file, not only from a review narrative."
    }
  ],
  "followup": "File a work order that makes Codex dispatch session entry advisory rather than refusing: catch every begin failure in scripts/resume.mjs, write a named stderr advisory in the form the unbuilt-runtime branch already uses, and let the dispatch print its briefing and exit 0, so a measurement concern never withholds an allocated report path for a transition the control log has already recorded. It must keep D001's requirement that no failure is hidden, and cover next, fix, verify, final-review and release-close with a fixture that makes the begin throw.",
  "reopenWhen": "A Codex dispatch is observed exiting non-zero from the session-entry call, the begin gains another caller that records a transition before it, or the follow-up lands and makes the dispatch advisory."
}
```

Goal alignment: this is process tooling on the operator-flow path, not the source-to-deliverable critical path, and the judgement is scaled to that. The comparison the eight traps ask for is between fixing here, failing into repair and boarding up. Policy resistance and shifting the burden to the intervenor both argue against a reviewer editing source that no independent verification judged; drift to low performance and seeking the wrong goal both argue against passing with the residual risk recorded nowhere reopenable. Naive Interventionism prefers the smallest durable act, which is the named follow-up above. NoOp — passing with only a report sentence — is rejected because the order's own decisions file is the surface a later planner reads.

## WO-149-D008

```json
{
  "id": "WO-149-D008",
  "date": "2026-09-21",
  "dispatch": "resume: fix; complete review gate; adjacent-0002",
  "decision": "Add a WO-149 current-role oracle for both economy-enabled and economy-disabled generation. Keep every prior role snapshot unchanged and verify the historical chain. Check the current opt-out against its contemporaneous oracle, and assert that only the economy paragraph disappears from executor prose while all other role prose remains identical.",
  "evidence": [
    "The complete npm test -- --review run ended 31 passed, 1 failed, 526.82 seconds, 76 fresh tasks; the failure was the WO-145 optional economy snapshot assertion in process-debt",
    "The test still selected wo150-role-baseline.json and expected disabled roles to reproduce WO-079, although WO-149 changes the shared Codex entry sentence and verifier effort/cap text",
    "Read-only comparison confirms stripping origin metadata and the one economy paragraph makes current enabled and disabled executor prose equal"
  ],
  "rejected": [
    {"option": "Overwrite WO-150 or WO-079 snapshot hashes", "reason": "Those snapshots are historical evidence, not current expectations."},
    {"option": "Remove the hash checks or skip process-debt", "reason": "That would weaken current generation and historical-preservation coverage."},
    {"option": "NoOp and leave the failed gate for review", "reason": "It repeats the incomplete handoff the operator explicitly rejected."}
  ],
  "reopenWhen": "A later authorized role change alters current generated bytes, or opt-out changes text beyond the economy paragraph and origin metadata."
}
```

D007's goal alignment applies: this repairs the actual full-gate failure without
changing product behavior, adding an inference run, altering historical evidence
or removing a check. It is a regression repair, not a second economy experiment.

## WO-149-D007

```json
{
  "id": "WO-149-D007",
  "date": "2026-09-21",
  "dispatch": "resume: fix; operator scope expand: please stop trying to cut corners. wasting my time",
  "decision": "Close all four VER-001 findings before repair-complete and execute the full review selection. Preserve the WO-138 probe as an exact, hash-checked historical source artifact before using TOOL_ROOT in its current implementation. Historical evaluation must explicitly select those retained source bytes; new evaluation defaults to the current source and must reject historical or altered build bindings. Exercise the actual no-session usage command and report a missing runtime at dispatch. Produce a live Codex fixture-dispatch receipt with attributable invocation evidence and actual counters.",
  "evidence": [
    "VER-001 findings 1 and 2 independently require repair; findings 3 and 4 identify missing command coverage and silent degradation",
    "The configuration-root guard and the committed WO-138 episode test both enforce useful invariants; the latter currently assumes historical evidence always describes current source",
    "All 38 WO-138 episode records bind the original 56,244-byte probe; its independent audit also reads that original path",
    "Operator expansion requires complete repair; no work-order criterion is weakened or waived"
  ],
  "reopens": {
    "decisionId": "WO-149-D003",
    "observation": "VER-001 makes the versioned boundary part of the repair, and the operator explicitly expands scope to complete it rather than carry the known failing gate forward."
  },
  "correction": {
    "misread": "The repair initially copied D003's a007dd48 prefix into the expected historical-source hash without reading the current episode bindings, then misattributed the resulting test failure to the archive copy.",
    "meant": "All 38 current committed episodes and HEAD's 56,244-byte source bind 3d9d6aa05c47bc6561e6850ea49c236611a3b462486f8311e4119953411f6907. The retained copy is byte-identical to that source.",
    "changed": "The regression assertion now pins the checked source and episode hash; no archived source or historical record was altered."
  },
  "rejected": [
    {"option": "NoOp or another known-issue handoff", "reason": "The review selection remains red and the live acceptance artifact remains absent."},
    {"option": "Rewrite historical episode hashes or exempt the probe from the root guard", "reason": "Either would invalidate the evidence or weaken a useful invariant."},
    {"option": "Rerun the complete inference matrix", "reason": "The historical claim can remain bound to its exact original source without new paid inference; the current root change can be checked deterministically."},
    {"option": "Treat a receipt grammar assertion as a command test", "reason": "VER-001 demonstrates that the actual command contradicts that assertion."}
  ],
  "reopenWhen": "Historical source cannot be independently verified, current runs accept the wrong build, or the complete review gate or live dispatch evidence fails."
}
```

Repair goal alignment: restoring honest executable evidence supports operator
flow and the existing critical path. Policy resistance is addressed by satisfying
both root and provenance guards. Commons and escalation favor deterministic
historical validation over repeating 38 inference episodes. Drift, rule beating
and seeking the wrong goal are checked by the live artifact, actual command
tests and full review selection. Success to the successful is checked by comparing
versioning, rerunning and NoOp; shifting the burden is checked by finishing the
repair here. Naive Interventionism preserves historical records and strict
current-build validation; the changes are local and reversible. D002 remains
the order's sole economy experiment; no second experiment is started.

Dispatch: `resume: next` on 2026-09-21, Codex CLI 0.155.1 executor, model
`gpt-5.6-sol`, effort `xhigh` (`codex-session-readback`). Authority:
`docs/work-orders/WO-149-codex-sessions-begin.md`.

## WO-149-D001

```json
{
  "id": "WO-149-D001",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-149 objective and design",
  "decision": "Add `beginHarnessSessionOnce` beside the existing strict `beginHarnessSession` primitive and call it from `scripts/resume.mjs` for the five Codex lifecycle dispatches after the command is admitted and before current-session or usage observations are read. Map next/fix to executor, verify to verifier, final-review to reviewer and release-close to release-close. Only a non-empty CODEX_THREAD_ID activates the call. The strict explicit-begin API keeps its repeat refusal; only the lifecycle adapter treats that exact refusal as an idempotent no-op.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts: beginHarnessSession creates the role, work-order, expected-event, startedAt, usage-session key, authorship baseline and subagent counter; beginHarnessSessionOnce delegates to it and absorbs only its exact already-began refusal",
    "scripts/resume.mjs: codexDispatchRoles and the post-admission call run before currentHarnessSessionReport and observedFactsReport",
    "scripts/test-process-debt.mjs WO-149 fixture: a synthetic next dispatch creates an executor/WO-999/ImplementationReady session with a bounded start time and no adopted authorship; a repeated next leaves the JSON byte-identical; an empty thread writes no new record",
    "The same fixture measures 16 tokens from the recorded Codex transcript with source codex-transcript-counter and cutoff 2030-01-01T00:00:02.000Z, and judgeCostLine accepts the resulting counter line and the no-session line",
    "node scripts/harness.mjs check: 31 generated surfaces pass after regeneration",
    "Cold-start measurement in both skill roots after the operator's D005 verifier note: executor 24,412/24,576 bytes; verifier 21,365/25,151; reviewer 22,543/24,576; release-close 13,967/16,384; planner 15,033/24,576; refuter 15,690 with its ceiling unset"
  ],
  "rejected": [
    {
      "option": "NoOp — keep asking Codex operators to run harness begin manually",
      "reason": "WO-099 FINAL-001 measured 0 real Codex readings and 8 unknown readings, while the dispatch already has the thread identity and role. NoOp preserves recurring rescue and leaves the per-harness comparison without a Codex column."
    },
    {
      "option": "Copy Copilot's active-dispatch-unavailable fallback",
      "reason": "That would make the failure graceful but would keep counters unknown. Codex already exposes a transcript counter and a stable thread identity; only the begun record is missing."
    },
    {
      "option": "Catch every begin failure in scripts/resume.mjs",
      "reason": "It would hide invalid roles, missing identities, snapshot failures and future host errors. The host adapter recognizes only the established already-began refusal and keeps every other failure visible."
    },
    {
      "option": "Add a Codex hook",
      "reason": "The repository has no Codex project hook boundary, and the order explicitly excludes adding one. The lifecycle command is already the common path for the five dispatches."
    }
  ],
  "reopenWhen": "Codex gains an automatic prompt-entry hook with the same role and lifecycle evidence, a lifecycle dispatch can read usage before the adapter runs, or a real dispatch produces a rewritten or mismatched session record."
}
```

Goal and critical path: this process-tooling order improves operator flow by
removing a recurring rescue and restoring real Codex process-cost evidence. It
does not reorder the source-to-deliverable critical path or claim product
feature progress; it makes the verification/review evidence on that path
comparable across harnesses.

System traps, scaled to the bounded change. Policy resistance is avoided by
leaving strict explicit begin behavior intact and adding one lifecycle-only
adapter. The session-begin commons cost is one existing snapshot/record
operation per new Codex thread and 85 cold-start bytes in each affected role,
with no new hook, agent, gate, command or dependency. D005 separately adds 219
bytes to the verifier role for the operator-authorized effort and cap rule.
Drift to low performance is reversed rather
than normalized: the result is measured counters, not a more polished unknown.
Escalation is bounded to five existing dispatches and one fixture. Success to
the successful is checked by comparing the existing strict primitive, the
Copilot fallback, a hook and NoOp rather than selecting the already-invested
path by default. Shifting the burden is the live benefit: the operator no longer
runs `harness begin` by hand. Rule beating is checked by asserting the session
bytes, role/start fields, measured source/cutoff and receipt-line admission in
one fixture, not merely the presence of a call. Seeking the wrong goal is
checked by the order's future live verification row; generated files or a green
fixture alone cannot satisfy it. Naive Interventionism preserves Claude's hook,
Copilot's fallback, the strict API and all counter formats, and the single
dispatch call is reversible. NoOp is rejected above with the dated 0-real/8-
unknown observation and reopens only if the counter no longer needs a begun
record.

## WO-149-D002

```json
{
  "id": "WO-149-D002",
  "kind": "experiment",
  "date": "2026-09-21",
  "dispatch": "resume: next; Tinkerer — Economy equipped by default (WO-150)",
  "decision": "Reuse the existing process-debt lifecycle fixture for WO-149 instead of adding a new test file or test-runner suite.",
  "question": "Can one existing real-resume fixture prove session creation, dispatch role and start time, repeated-dispatch byte identity, no-thread behavior, Codex counters with source/cutoff and receipt-line admission without adding another suite?",
  "alternatives": [
    "Extend scripts/test-process-debt.mjs beside its existing real-resume and process-cost fixtures",
    "Create a dedicated WO-149 test file and add it to the test runner"
  ],
  "observation": "The existing repo({runtime:true}) fixture already copies the real resume path, runtime bundle, control state and transcript machinery. Reuse is adopted only if one focused case can make every required assertion legibly and pass on its own.",
  "budget": { "wallSeconds": 300 },
  "execution": "run",
  "cost": {
    "wallSeconds": 225.695,
    "tokens": null,
    "commands": [
      "npm run work-orders -- index",
      "inspect the existing Tinkerer records and process-debt fixture with rg/sed"
    ],
    "source": "Measured from the current Codex transcript timestamps between the announced 300-second economy question and the stated decision that the existing fixture was viable; transcript content and identity were not emitted. Tokens are null because no experiment-scoped counter exists. Implementation and its later regression command are evidence of the adopted effect, not charged to this bounded method-selection experiment."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node --test --test-reporter=spec --test-name-pattern='WO-149' scripts/test-process-debt.mjs"
    ],
    "summary": "The one focused case passed in 429.092208 ms and covers all seven observations named in the question. No test-runner entry or additional fixture bootstrap was added. Per-order savings remain null because no dedicated-suite alternative was built and measured."
  },
  "outcome": "adopted",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": "2026-09-21",
    "experimentsSinceAdoption": 0
  },
  "evidence": [
    "scripts/test-process-debt.mjs repo({runtime:true}) already provides the real resume script, built harness host, canonical control segment and isolated transcript directories",
    "Focused executable result: 1 test passed, 0 failed, case duration 429.092208 ms"
  ],
  "rejected": [
    {
      "option": "Add a dedicated WO-149 suite and test-runner entry",
      "reason": "The existing fixture expresses every required observation in one case; a new suite would duplicate its repository bootstrap and add a runner edge without expanding behavioral coverage."
    }
  ],
  "reopenWhen": "The combined case becomes hard to diagnose, a later criterion needs a different fixture boundary, or the process-debt suite's shared bootstrap makes this case materially slower or flaky."
}
```

## WO-149-D003

```json
{
  "id": "WO-149-D003",
  "date": "2026-09-21",
  "dispatch": "resume: next; Adjacent Repair item adjacent-0001",
  "decision": "Do not repair the configured-root failure inside WO-149. Restore scripts/probes/local-model-role-qualification.mjs byte-for-byte after the concrete TOOL_ROOT repair made the configuration-root suite pass but invalidated the committed WO-138 episode bindings. Dispose adjacent-0001 as a known issue and leave both guards honest.",
  "evidence": [
    "npm test -- --only configuration-root on the unmodified probe: failure at scripts/test-configuration-root.mjs because the probe independently derives ../.. from import.meta.url",
    "Bounded probe: importing TOOL_ROOT and setting ROOT = TOOL_ROOT made npm test -- --only configuration-root pass, 2 tasks and 0 failures",
    "The same bounded probe made scripts/probes/local-model-role-qualification.test.mjs fail its committed-episode check: all records retain harnessBuildHash a007dd483a489256db157f8ff2c790d520717a01afd5496a8d0eea9df0ec4ced while the edited probe was 3d9d6aa05c47bc6561e6850ea49c236611a3b462486f8311e4119953411f6907",
    "After restoring the probe, git diff --exit-code for that path passed and all 13 local-model role qualification tests passed again"
  ],
  "rejected": [
    {
      "option": "Keep the TOOL_ROOT repair and update the 38 recorded harnessBuildHash values",
      "reason": "Those hashes bind executed episodes to the source that produced them. Rewriting them without rerunning the episodes would fabricate evidence."
    },
    {
      "option": "Exclude scripts/probes from the configured-root guard or add a one-file exception",
      "reason": "That changes the guard to make the check pass without resolving its detected second root derivation; WO-149 has no authority or evidence to weaken the configured-root invariant."
    },
    {
      "option": "Leave the adjacent edit in place and defer only the episode check",
      "reason": "That would knowingly ship a probe whose committed result set no longer matches its asserted final build."
    }
  ],
  "followup": "File a dedicated work order to reconcile the local-model role qualification probe with the single TOOL_ROOT derivation. It must either rerun and independently validate the full immutable episode matrix against the repaired probe or introduce a reviewed versioned boundary that preserves the original episode subject while new runs use TOOL_ROOT; checks include configuration-root, all 13 probe tests and the affected product gate.",
  "reopenWhen": "A work order authorizes rerunning or versioning the WO-138 episode subject, or the configured-root contract is independently changed with evidence that this probe is outside its scope."
}
```

## WO-149-D004

```json
{
  "id": "WO-149-D004",
  "date": "2026-09-21",
  "dispatch": "resume: next; required local release preparation",
  "decision": "Complete the missed activation assignment as application v0.40.2, the next patch above the observed local annotated v0.40.1 tag. Stage skeleton 0.34.2 because its harness-host, Contributor loadout and verifier-limit source change; keep compiler, kernel and console package versions unchanged, and move only the console's exact skeleton pin to 0.34.2.",
  "evidence": [
    "docs/work-orders/WO-149-codex-sessions-begin.md declares exactly one patch classification but retained the activation placeholder",
    "docs/control/orders/WO-149.jsonl carries no release version field, so no assigned value can be recovered from canonical activation state",
    "git tag --sort=-v:refname reports v0.40.1 as the highest local annotated release",
    "packages/skeleton/package.json was 0.34.1 and packages/console/package.json pinned @dotln/skeleton 0.34.1 before preparation",
    "Only packages/skeleton/src/harness-host.ts, packages/skeleton/src/loadouts/contributor.ts and packages/skeleton/src/verification-protocol.ts change package production source; compiler, kernel and console production source are unchanged"
  ],
  "rejected": [
    {
      "option": "Leave the placeholder and bypass release preparation",
      "reason": "The executor contract requires a locally prepared classified release, and the helper correctly refuses an unassigned application target."
    },
    {
      "option": "Assign a minor or major application target",
      "reason": "That contradicts the order's explicit patch classification and its compatibility-preserving behavior."
    },
    {
      "option": "Bump compiler, kernel or console package versions",
      "reason": "Their production sources and public contracts are unchanged; the console manifest changes only to retain its exact workspace pin to the changed skeleton package."
    }
  ],
  "reopenWhen": "A higher local annotated release is integrated before final review, or another integrated change consumes skeleton 0.34.2; rerun release preparation under the unchanged patch classification."
}
```

## WO-149-D005

```json
{
  "id": "WO-149-D005",
  "date": "2026-09-21",
  "dispatch": "resume: next; operator authorization after the fresh feedback edition required a live verifier",
  "decision": "Adopt the operator's verifier direction as a shared role rule: independent verifiers use xhigh rather than max, and a verifier launch may cap provider spend at USD 5 when its transport exposes a hard dollar-cap control. Raise the source-heavy feedback verifier limit from USD 3 to USD 5. Run WO-149's auxiliary feedback self-host with claude-cli-print at xhigh so the cap is enforced; keep acceptance criterion 3's later work-order verification Codex-specific.",
  "evidence": [
    "Operator direction in this dispatch: all verifiers can cap at $5 and use xhigh instead of max",
    "packages/skeleton/src/verification-protocol.ts previously declared FEEDBACK_VERIFIER_LIMITS.maxBudgetUsd as 3.00",
    "packages/skeleton/src/worker-transport.ts forwards that value to Claude through --max-budget-usd, while the Codex argument vector has no dollar-cap option",
    "packages/skeleton/src/loadouts/contributor.ts and docs/product/07-execution-guide.md now state the xhigh selection and distinguish an enforced provider cap from a recorded limit"
  ],
  "correction": {
    "misread": "I described the authorized Codex feedback verifier as capped at USD 3 before checking the transport argument construction.",
    "meant": "The verifier envelope declared USD 3, but only claude-cli-print received an enforceable --max-budget-usd argument; codex-cli-exec did not.",
    "changed": "The live auxiliary verifier uses Claude at xhigh with the new hard USD 5 cap, and the durable note refuses to call an unenforced Codex limit a cap."
  },
  "rejected": [
    {
      "option": "Launch Codex and describe its recorded USD 5 limit as a hard cap",
      "reason": "The observed Codex argument vector has no dollar-budget control, so that claim would be unsupported."
    },
    {
      "option": "Keep max because earlier feedback editions used it",
      "reason": "The operator explicitly selected xhigh; historical immutable editions retain the effort actually used in their own runs."
    },
    {
      "option": "Rewrite the newly minted revision 001 evidence after changing registered sources",
      "reason": "Evidence editions are immutable. Revision 001 remains as superseded residue and the completed subject is minted at revision 002."
    }
  ],
  "reopenWhen": "A supported Codex dollar-cap control is observed, the operator changes the verifier effort policy, or USD 5 proves insufficient or wasteful for the source-heavy verifier profile."
}
```

## WO-149-D006

```json
{
  "id": "WO-149-D006",
  "date": "2026-09-21",
  "dispatch": "resume: next; fresh authority and feedback evidence after D005",
  "decision": "Select immutable WO-149 authority and feedback revision 002 for the completed source. Retain revision 001 as superseded residue because D005 changed registered authority and feedback sources after it was minted. Record the live self-host only after its retained recovery attempt completed both verification criteria.",
  "evidence": [
    "docs/evidence/current.json selects WO-149 revision 002 for authority and feedback while artifact identity and verification remain at WO-146",
    "node scripts/authority-evidence.mjs --check verified 34 bundle comparisons and the authority invariants",
    "node scripts/feedback-evidence.mjs --check verified ten passing regressions, ten removal failures and 1,192 saved instruction bytes",
    "The live claude-cli-print verifier used Claude Sonnet 5, xhigh, CLI 2.1.278, a 600-second timeout and an enforced USD 5 per-launch cap",
    "Attempt 1 ran 211,040 ms and was retained as WorkerInterrupted invalid-result; attempt 2 reused the same command and pinned subject, completed in 162,325 ms, and produced a complete two-criterion matrix",
    "npm run meta reads the two verifier usage observations as 870,211 tokens/USD 1.506 and 849,511 tokens/USD 1.403, totaling 1,719,722 tokens and USD 2.909 across 376,872 ms",
    "docs/evidence/WO-149/feedback-002 retains the 36,438-byte audit stream and 1,915,032-byte verifier stream; the console selfhost fixture was repinned and all five console cases match"
  ],
  "rejected": [
    {
      "option": "Record revision 001 or copy an earlier self-host stream",
      "reason": "Revision 001 predates D005's registered source changes, and an earlier stream judged a different subject hash."
    },
    {
      "option": "Treat the first invalid-result as passing or edit its raw response",
      "reason": "The transport intentionally discards raw model output and retains only the typed refusal; only the host-admitted second attempt supports the completed matrix."
    },
    {
      "option": "Erase the failed attempt after recovery",
      "reason": "The append-only verification stream must retain the first refusal, lease expiry and distinct recovery episode."
    }
  ],
  "reopenWhen": "A registered authority or feedback source changes again, the selected revision fails its check, or review finds that the accepted recovery attempt did not judge the recorded subject bytes."
}
```
