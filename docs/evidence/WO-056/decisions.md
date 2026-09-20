# WO-056 decisions

## WO-056-D001 — Run the live proof through the existing repair loop, with a planted double implementer

```json
{
  "id": "WO-056-D001",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Add docs/evidence/WO-056/fixture.mjs as the planted-defect variant of the WO-053 generator. A process-double implementer plants the defect through the real SourceChangeHost; the live harness under test is the verifier and the repair worker, both dispatched by the unmodified WO-055 RepairHost. The contract has two behavior clauses so the verifier must name the violated one; every criterion's code surface is sum.mjs alone.",
  "evidence": [
    "docs/work-orders/WO-056-live-verification-and-repair.md",
    "docs/product/02-domain-model.md#independent-verification-v1",
    "docs/evidence/WO-053/fixture.mjs",
    "packages/skeleton/src/repair-host.ts",
    "packages/skeleton/src/repair.ts",
    "packages/skeleton/test/repair-fixture.ts",
    "docs/evidence/WO-056/double-pipeline-check-2.json"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Every verification proof stays a process double; the vertical rung's verification sentence remains unevidenced and gate E stays open."
    },
    {
      "option": "A live implementer asked to write a wrong implementation",
      "reason": "The order plants the defect. A model asked to be wrong adds cost and nondeterminism to the fixture's input and proves nothing about blinding."
    },
    {
      "option": "One criterion carrying both the superficial and the contract check, as in the WO-054/055 double fixtures",
      "reason": "With one clause, naming the violated clause is not a discriminating act."
    },
    {
      "option": "Criterion code surfaces that include the test files, as in the double fixtures",
      "reason": "Witness surfaces flow into the derived repair scope; a live worker could then repair the test instead of the module."
    },
    {
      "option": "Copy WO-053's protected-snapshot helpers instead of exporting them",
      "reason": "About fifty duplicated lines. The order's design says the WO-053 generator gains the variant; two export keywords change no WO-053 behavior and no receipt."
    }
  ],
  "reopenWhen": "A live run shows the two-clause contract or the sum.mjs-only surface prevents a legitimate finding or repair, or another order needs the planted implementer itself to be live."
}
```

Operator dispatch: `resume: next`, 2026-09-19. Sources: the order; product 01
Principle 6; product 02 §Independent verification v1; the WO-053 receipt
README; WO-054 and WO-055; `repair-host.ts`, `repair.ts`,
`verification-host.ts`, `verification-worktree.ts`, `source-change-host.ts`,
`worker-transport.ts`, `verification-protocol.ts` and the WO-053/054/055
fixtures. Additional inputs named here because the order did not cite them:
`packages/compiler/src/verification.ts` (what the capsule binds),
`packages/skeleton/src/reactor.ts` (the fold's actor filter, result admission
and persisted-compilation check), `scripts/fixtures/historical-compiler-loader.mjs`
and `scripts/reactor-identity.mjs` (the recorded-identity replay precedent).

Critical-path contribution: gate E of the 2026-09-08 critical path, the first
live evidence that an implementer cannot certify itself. The deliverable is an
evidence record and a regression fixture; no runtime source changes.

Lenses. Rule beating is the material one: a receipt could pass without the
intended behavior if pass flags were free-standing, so `receipt.mjs` derives
every flag's invariants from the recorded facts, the regression fixture
re-executes the replay instead of trusting the recorded summary, and process
doubles can never satisfy the live requirement. Seeking the wrong goal: the
outcome is an observed live catch, repair and re-verification, not receipt
volume; a failed run is filed as a failure and does not close the order.
Shifting the burden: the operator runs three commands per harness and reads
one JSON line; nothing else needs rescue. Commons: one verifier episode, one
worker episode and one re-verification per harness, bounded by the existing
two-round limit and transport budgets. Policy resistance, drift, escalation
and success to the successful are immaterial here: no guard, standard or
process is added or displaced, and the existing hosts are reused because the
order exists to exercise them. Naive Interventionism: WO-053's generator keeps
its behavior and receipts; the smallest probe was a process-double run of the
whole pipeline before any live token is spent.

## WO-056-D002 — Keep the capsule public-safe by construction; never edit hashed bytes

```json
{
  "id": "WO-056-D002",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Criterion 3 needs the receipt's raw event log, and replay recompiles the capsule and refuses any byte drift, so the log cannot be sanitized after the fact. The fixture therefore keeps private bytes out of the capsule: a logical repo label, bare `node <file>` test commands, and tests that print bounded messages instead of stacks. Where a harness needs an absolute Node path (the Codex writer shell inherits no PATH), the collector withholds the log and the fold claim rather than publishing edited bytes.",
  "evidence": [
    "packages/compiler/src/verification.ts (inputHash covers the whole capsule, including commands and witness output)",
    "packages/skeleton/src/reactor.ts (CommandPersisted: persisted compilation drift)",
    "packages/skeleton/src/verification-worktree.ts (confined tests get PATH from the host's Node directory)",
    "packages/skeleton/src/worker-transport.ts (Codex writer: shell_environment_policy.inherit=none)",
    "docs/evidence/WO-053/codex-fixed.json (bare node: exit 127 in the Codex worker shell)",
    "docs/evidence/WO-056/double-pipeline-check-2.json (a bare-style raw log passes the privacy screen)"
  ],
  "rejected": [
    {
      "option": "WO-053's absolute Node path everywhere, substituted with a placeholder in the receipt",
      "reason": "On a machine whose Node lives under a home directory the path is inside the hashed capsule; a substituted log does not replay."
    },
    {
      "option": "Publish a projection of the log instead of the log",
      "reason": "Criterion 3 replays the receipt's event log; a projection cannot be folded."
    },
    {
      "option": "Give the Codex writer a PATH",
      "reason": "Runtime source; this order changes none, and a defect found needs its own bounded order."
    }
  ],
  "followup": "Planner: nominate a bounded order that lets a source-change worker run a path-free named test under the Codex writer profile (for example an admitted PATH entry for the host's Node directory), so capsule-bound commands stay public-safe on both harnesses. Until then a Codex run on a machine with a private Node path can evidence criteria 1 and 2 but not a publicly replayable criterion 3. Priority: low; criterion 1 needs one harness.",
  "reopenWhen": "A live Claude worker cannot resolve bare `node`, or a host test's output is observed to carry a path despite the bounded messages."
}
```

That bare `node` resolves in the Claude worker's shell is an inference, not an
observation: WO-053's `claude-diagnostic` and `claude-fixed` attempts predate
the absolute-path repair and each left one `sum.mjs` commit, and the Claude
writer inherits the host environment. The first live Claude run settles it.

Observed later on 2026-09-20: `claude-live-3`'s worker was given the bare
command as its declared test and completed its round with no refusal and a
correct one-file commit. The host's own runs of that command are observed
(exit 1 before, exit 0 after); the worker's invocation inside its shell is not
separately recorded, so this remains consistent with the inference rather
than a direct observation of it.

## WO-056-D003 — Replay under the receipt's recorded compiler identity

```json
{
  "id": "WO-056-D003",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "The regression fixture replays each published log in a child process whose loader pins COMPILER_PACKAGE_VERSION to the version recorded in the log's capsule, following the WO-050 historical-compiler loader. It compares the re-executed replay with the receipt's recorded one, injects implementer success both after the admitted result and at the still-pending command, and requires byte tampering to refuse.",
  "evidence": [
    "scripts/fixtures/historical-compiler-loader.mjs",
    "scripts/reactor-identity.mjs",
    "packages/skeleton/src/reactor.ts (the capsule is recompiled on replay under the current compiler version)",
    "docs/evidence/WO-056/replay.mjs",
    "A pinned 9.9.9 child passed its version assertion and then refused the 0.16.0 log, 2026-09-19"
  ],
  "rejected": [
    {
      "option": "Replay in-process under the current compiler",
      "reason": "The next compiler version bump, in any unrelated order, would fail this fixture with persisted compilation drift."
    },
    {
      "option": "Skip the replay once versions differ",
      "reason": "The proof would silently stop running."
    },
    {
      "option": "Insert a forged result mid-log",
      "reason": "Event identifiers are positional; the recorded tail would have to be renumbered, which edits the receipt's bytes. A recorded prefix is replayed unedited instead."
    }
  ],
  "reopenWhen": "An event-schema or fold change makes a recorded WO-056 log unreplayable for a reason other than the compiler package version."
}
```

An older log replaying under a newer compiler is untested until a version
bump exists; the inference rests on the WO-050 loader doing the same for
compiled identity.

Correction, 2026-09-20. The third rejected option above was written before the
adversarial pass. Since D005 the replay does follow each pending-position
forgery with the recorded tail, in memory, with the tail's positional event
references shifted by the one inserted event. What stays rejected is editing
the receipt's bytes: the published log is never renumbered, and the prefix it
replays is unedited. What changed is only the in-memory scenario the replay
builds after the forgery.

## WO-056-D004 — File process-double receipts as pipeline and failure checks, excluded from acceptance

```json
{
  "id": "WO-056-D004",
  "date": "2026-09-19",
  "dispatch": "resume: next",
  "decision": "Commit three receipts produced by `add … double`: a full pass, an exhausted repair loop (`--fault wrong-repair`) and a privacy-refused run (`--fault privacy`). They make the collector, validator, replay and failure filing executable evidence before and independent of any live run. Their launch harness is `double`; the regression fixture's live requirement ignores them, and the validator refuses a double relabelled as a live harness.",
  "evidence": [
    "docs/evidence/WO-056/double-pipeline-check-2.json",
    "docs/evidence/WO-056/double-repair-exhausted.json",
    "docs/evidence/WO-056/double-privacy-withheld.json",
    "packages/skeleton/test/live-verification-receipt.test.ts"
  ],
  "rejected": [
    {
      "option": "No committed double receipt",
      "reason": "The first evidence that the collector works, and that a failed run is filed, would be a live run the operator pays for; the fixture's forged-promotion checks would have no unclaimed pass to promote."
    },
    {
      "option": "Generate the double receipts inside the test",
      "reason": "Three full confined repair loops on every package-test run, for shape checks."
    }
  ],
  "reopenWhen": "A double receipt is ever cited as live evidence, or its shape drifts from what the collector emits."
}
```

Two earlier double receipts were produced and deleted the same day, before
any commit, when the replay and the receipt contract changed shape under
D005; no live attempt was involved.

## WO-056-D005 — Adversarial pass: bind facts to the log, make the replay guard-sensitive, always file

```json
{
  "id": "WO-056-D005",
  "date": "2026-09-19",
  "dispatch": "resume: next; operator steering: use 1 subagent to do some adversarial testing",
  "decision": "One read-only subagent attacked the validator, replay, regression fixture and collector. Accepted and fixed: (1) a process double relabelled `claude` validated and counted as live; (2) pass flags held over facts bound to neither the log nor each other; (3) the criterion-3 replay reported the negative retained with the fold's actor and episode guards removed; (4) the privacy screen missed common path and credential shapes and nested shapes were open; (5) the collector could throw instead of filing a failed run; (6) the log's stated compiler version was unbound and read from any actor; (7) the live requirement summed flags across receipts and ignored containment. Pass flags are now claimed by trial validation, so the collector cannot disagree with the contract.",
  "evidence": [
    "Subagent report, 2026-09-19 (59 tool uses; probes retained in session scratch, not in the repository)",
    "Replay against in-memory fold mutants, 2026-09-19: actor filter, implementer-episode check and active-episode check each removed alone give negativeRetained=false; unmodified fold true; the pre-fix replay reported true for all three",
    "docs/evidence/WO-056/double-repair-exhausted.json and double-privacy-withheld.json (failed runs filed)",
    "packages/skeleton/src/reactor.ts:2009-2011 (revocation-typed events are recorded before the actor filter)",
    "verification-1 child store of double-pipeline-check-2: evt_1 RepairSnapshotPrepared carries a physical path; evt_2 onward are path-free"
  ],
  "rejected": [
    {
      "option": "Treat the receipt contract as authentication",
      "reason": "The launch fields in the log are not hash-bound, and a forger with write access can rewrite a log consistently. The contract detects inconsistency and careless relabelling; filing remains the operator's act, and the README says so."
    },
    {
      "option": "Publish the re-verification log so criterion 2 is replayable too",
      "reason": "Its first event records a physical snapshot path and event identifiers are positional, so it cannot be published unedited; making that event path-free is a runtime change."
    },
    {
      "option": "Support a second-round success as a repair pass",
      "reason": "It needs the second finding and its log carried per round. A first-round-only claim fails safe; the operator reruns."
    },
    {
      "option": "Fix the runtime observations below in this order",
      "reason": "No runtime source changes here; a defect found needs its own bounded order."
    }
  ],
  "followup": "Planner: weigh one bounded order over the verification and repair hosts. (a) Record RepairSnapshotPrepared without a physical path, or outside the verification child log, so a re-verification log can be published and replayed. (b) foldVerificationEvent records an authority's revocation-typed events before its actor filter (reactor.ts:2009-2011); the subagent reports that with a non-empty revocationEventTypes an implementer-actor event of that type makes the genuine result refuse. Unreachable in WO-056, whose lists are empty; not reproduced by the executor beyond reading the order of the two checks. (c) The subagent reports that an implementer-actor SourceChangeObserved on a verification workstream makes the projection throw; it fails closed and was not reproduced by the executor. Priority: low for (a) and (c); (b) before any verification authority declares a revocation event type.",
  "reopenWhen": "A live receipt shows a legitimate run the contract refuses to claim, or a forged or inconsistent receipt the contract accepts."
}
```

Goal alignment for this pass. Rule beating was the finding itself: the first
replay and validator could pass without the behavior they named, so the
fixes add controls and a mutant check rather than more assertions of the
same kind. Shifting the burden: a run that fails, or whose text the screen
refuses, now files itself; the operator does not rescue it. Commons: one
subagent of the twenty-agent cap, by operator direction; none further.
Escalation and policy resistance: the contract grew, but every addition
restates a recorded fact or the published log, and the collector derives its
flags from the same code, so there is no second rule set to drift. The
subagent's informational runtime observations are boarded up in the
follow-up above, labeled by who observed what.

## WO-056-D006 — After two failed live attempts, capture the refusal before changing anything

```json
{
  "id": "WO-056-D006",
  "date": "2026-09-20",
  "dispatch": "resume: next (after the operator's first live attempts)",
  "decision": "Both first live attempts failed at the first verifier episode and are filed unchanged. The hosts keep only a failure code, so neither cause is known. The fixture now records each dispatch's transport refusal (code and host-authored detail, at most 160 characters, inside the screened receipt) and keeps two local-only diagnostics in the ignored episode directory: the CLI's stderr tail and a verifier's schema result. No runtime source, prompt or admission rule changed.",
  "evidence": [
    "docs/evidence/WO-056/claude-live.json (verifier exit 0 after 19,866 ms with a structured envelope; host invalid-result; USD 0.26053)",
    "docs/evidence/WO-056/codex-live.json (verifier exit 1 after 142 ms, no JSON output; host transport-failed)",
    "codex features list and codex exec --help at 0.155.1, 2026-09-20: all 23 disabled feature names and every passed flag are still known",
    "packages/skeleton/src/verification-host.ts (WorkerInterrupted records the code; the failure is rethrown without its detail)",
    "packages/skeleton/src/verification-protocol.ts (parseEvidenceResult: every refusal detail is a host literal)",
    "Fake-CLI probe through the live transports, 2026-09-20, receipts in session scratch only: a descriptive `observed` refused as `finding observed versus expected`; a witness-restating finding completed the loop with all five passes"
  ],
  "rejected": [
    {
      "option": "Change the verifier's instructions or the admission rule now",
      "reason": "The refusing rule is not known, and both are runtime source; this order changes none, and a defect found needs its own bounded order."
    },
    {
      "option": "Tell the verifier the expected strings through the fixture's contract text",
      "reason": "That would coach the verifier through the contract to pass the host's rule: the receipt would pass without the behavior the order names."
    },
    {
      "option": "Retain the full vendor output locally",
      "reason": "A worker's stream is a transcript. The stderr tail and the verifier's schema result are the least that settles both causes."
    }
  ],
  "followup": "Operator decision after the diagnostic rerun: if the live verifier's result is refused by an admission rule the verifier is never told (for example that a finding's observed and expected must restate the adverse witness's exact strings), and if Codex 0.155.1 refuses the verification launch arguments, both are runtime defects outside this order. Either expand this order's scope (`scope expand:`) or have the planner cut a bounded order for the verifier's output instructions or result schema and the Codex launch shape; WO-056's live episodes rerun after it. Priority: high; it blocks gate E.",
  "reopenWhen": "A live receipt records its refusal detail, or the CLI's stderr names the launch error."
}
```

Goal alignment. NoOp leaves two failures nobody can explain and invites a
guessed fix. The smallest useful probe is one more verifier episode per
harness (the Claude one cost USD 0.26 and 20 seconds; the Codex one failed in
142 ms before any model call). Rule beating is the live risk here and is why
coaching the verifier through the fixture's contract text was rejected.
Shifting the burden: this costs the operator one more pair of commands; after
it the cause is on the record instead of in a session. The other lenses are
immaterial to a diagnostic that adds no guard and changes no behavior.

## WO-056-D007 — The live proof found two runtime defects; file them and leave the order open

```json
{
  "id": "WO-056-D007",
  "date": "2026-09-20",
  "dispatch": "resume: next (after the diagnostic reruns)",
  "decision": "Record both causes and change no runtime source. (1) A live Claude verifier produced a substantively correct blocking finding on the violated clause and the host refused it as `finding observed versus expected`: admission requires a finding's observed and expected to equal an adverse witness's strings exactly, and derivation requires each reproduction step to be a witness step or an exact named command, but neither the verifier's output instructions nor its result schema says so. Only doubles that copy the witness fields pass. (2) Codex CLI 0.155.1 refuses to launch a verifier in the files-only `worktree-snapshot` mount because no transport shape passes `--skip-git-repo-check`. The order stays open with four failures filed, as its second operator-review assumption provides; it does not reach implementation-ready.",
  "evidence": [
    "docs/evidence/WO-056/claude-live-2.json (episode refusal: invalid-result, finding observed versus expected)",
    "Local diagnostic of claude-live-2 (ignored): AC-positive pass, AC-signed fail, one blocking finding citing the contract witness and sum.mjs, descriptive observed/expected, second reproduction step in the verifier's words",
    "docs/evidence/WO-056/codex-live-2.json (exit 1 after 45 ms; refusal transport-failed, exit-1)",
    "Local diagnostic of codex-live-2 (ignored), stderr: Not inside a trusted directory and --skip-git-repo-check was not specified.",
    "packages/skeleton/src/verification-protocol.ts (parseEvidenceResult: finding observed versus expected; evidenceResultSchema: observed, expected and reproductionSteps are free text; transportPrompt: the verifier instructions do not state either rule)",
    "packages/skeleton/src/repair.ts (deriveRepairOrder: reproduction is not an exact named command)",
    "No occurrence of skip-git-repo-check under packages/skeleton/src or scripts, 2026-09-20"
  ],
  "rejected": [
    {
      "option": "Fix the verifier instructions, schema or Codex launch shape here",
      "reason": "Runtime source. The order forbids it, names any runtime fix a non-goal, classifies itself a patch-level evidence record, and says a defect found needs its own bounded order. The fix would also regenerate bundle pins and a feedback evidence edition."
    },
    {
      "option": "Count the refused Claude result as criterion 1",
      "reason": "Criterion 1 is a live verifier's finding in the loop. A result the host refuses is not admitted, enters no matrix and starts no repair; the substance being right does not make it observed."
    },
    {
      "option": "Coach the verifier through the fixture's contract or README text",
      "reason": "Rule beating: the receipt would pass because the fixture told the verifier the host's strings, not because the product's verifier contract works."
    },
    {
      "option": "Give Codex a Git directory inside the snapshot",
      "reason": "The files-only sealed mount is WO-054's isolation design; the fixture cannot and should not alter it."
    }
  ],
  "followup": "Operator: choose `scope expand:` on WO-056 or a planner-cut bounded order (recommended: a separate order, because the fix changes runtime source and release classification). Its scope: (a) state the finding contract to the verifier — in the verifier output instructions and, where the schema language allows, the result schema — so observed and expected restate a referenced adverse witness and each reproduction step is a referenced witness's step or an exact named command, or deliberately relax the admission rule and give findings a place for the verifier's own analysis; (b) launch the Codex verifier in a files-only snapshot (for example `--skip-git-repo-check` on the evidence-worker shape), with a version observation at 0.155.1; (c) decide whether hosts should retain a refusal's host-authored detail, which WO-056 had to capture in its fixture. Acceptance should include a rerun of WO-056's live episodes. Priority: high; it blocks gate E and every dependent of WO-056.",
  "reopenWhen": "The runtime fix lands, or the operator withdraws the order with a dated note."
}
```

Goal alignment at this boundary. The promised benefit of the order was live
evidence that an implementer cannot certify itself. The observed outcome is
different and still on the critical path: the blinded verifier is
substantively capable, and the host's admission contract is unusable by a
live verifier because it was only ever exercised by doubles that copy the
host's own strings. That is drift the doubles hid, and it is exactly the gap
the order named. Seeking the wrong goal would be making a receipt pass here;
the outcome that serves operator flow is a verifier contract a live model can
satisfy, which is a runtime change with its own order. Shifting the burden:
four failures cost the operator two rounds of commands and about USD 0.52 of
reported Claude usage; the fixture now records refusal details so the next
failure explains itself.

## WO-056-D008 — Operator scope expansion: repair both runtime defects in this order

```json
{
  "id": "WO-056-D008",
  "date": "2026-09-20",
  "dispatch": "scope expand: (operator, 2026-09-20)",
  "decision": "Authorization. The executor offered two routes after D007 and recommended a separate order. The operator's whole reply was the second option pasted back: \"scope expand: on WO-056. I fix both here. That's faster, but it turns an evidence-only patch into a runtime change, with the extra regeneration and release work that brings.\" The executor reads this as the operator's `scope expand:` selecting that option, said so before acting, and proceeded. Bounded scope: (1) state the existing finding contract to the verifier through its output instructions and result schema; (2) add the Codex launch flag for the files-only worktree-snapshot mount. Out of scope: the admission and derivation rules, the finding shape, host retention of refusal details (D007 item c), dependencies and publication. The order text carries the expansion and is bound with `npm run plan -- amend-order WO-056 WO-056-D008`.",
  "evidence": [
    "Operator message, 2026-09-20, quoted above; it arrived as pasted text with no other words",
    "docs/work-orders/WO-056-live-verification-and-repair.md#operator-scope-expansion--2026-09-20",
    "docs/evidence/WO-056/decisions.md#wo-056-d007",
    "docs/product/07-execution-guide.md (scope expand; the WO-139 execution-amendment route)",
    "scripts/lib/evidence-sources.mjs (verification-protocol.ts and worker-transport.ts are pinned feedback sources; verification-protocol.ts is also an authority, artifact-identity and verification source)"
  ],
  "rejected": [
    {
      "option": "A separate bounded order (the executor's recommendation)",
      "reason": "The operator chose speed. The cost the executor named is accepted: four fresh evidence editions, a live repository feedback audit, regenerated pins and a patch release that now carries runtime source."
    },
    {
      "option": "Relax the admission rule so descriptive findings are admitted",
      "reason": "Product 02 requires a finding's observed and expected to match an adverse host witness, so model prose cannot stand in for a host observation. Telling the verifier the rule preserves that guarantee; relaxing it is a product decision nobody made."
    },
    {
      "option": "Add an analysis field to findings so the verifier's diagnosis survives",
      "reason": "It changes the compiler's finding shape and every consumer. The envelope summary carries the diagnosis within 320 characters; a richer field is planning work."
    },
    {
      "option": "Pass the Codex flag on every exec shape",
      "reason": "The inspection and writer vectors are pinned byte-for-byte by WO-009 and WO-051 tests and recorded probes, and they run inside Git worktrees where the flag is not needed."
    }
  ],
  "followup": "Planner: the verifier's own diagnosis has no durable field. claude-live-2's refused result named the cause precisely and the repair worker would never have seen it. Weigh an analysis field on findings, or a contract-bound note passed to the repair capsule, against blinding and prompt-injection risk. Also still open from D007: whether hosts retain a refusal's host-authored detail. Priority: medium.",
  "reopenWhen": "The operator says the pasted reply was not a scope expansion, or a live verifier still cannot satisfy the stated contract."
}
```

Goal alignment. The benefit is the order's own: an observed live catch,
repair and re-verification, now reachable. Risks of intervening in existing
behavior: the verifier prompt and schema are shared by the repository
feedback audit and the WO-010 route, so the schema constraint is limited to
what the admission rule already requires and is conditional on adverse
witnesses existing; the Codex flag is limited to one profile. Policy
resistance: the schema, the instructions and the unchanged admission rule now
say the same thing, and a regression holds them together. Rule beating: the
verifier is told the form of a finding, not which criterion fails or why.
Commons: one more live verifier episode for the feedback audit and one more
pair of WO-056 attempts. Reversibility: two small source edits, uncommitted.

## WO-056-D009 — How the two runtime repairs were bounded

```json
{
  "id": "WO-056-D009",
  "date": "2026-09-20",
  "dispatch": "scope expand: (operator, 2026-09-20), executed through follow-up queue items adjacent-0001 and adjacent-0002",
  "decision": "(1) The finding contract is stated in two places that a live verifier actually receives: the result schema, where observed and expected become an enum of the adverse (`fail`) witnesses' strings and worktree-snapshot reproduction steps an enum of those witnesses' steps plus the named commands; and the output instructions. The enum is omitted when there is no adverse witness, never emitted empty, and legacy-profile steps stay free text. parseEvidenceResult and deriveRepairOrder are untouched. (2) `--skip-git-repo-check` is added to the Codex exec shape only when the request is an evidence-worker request with the worktree-snapshot profile. (3) Evidence editions: authority and feedback move to WO-056; verification and artifact-identity stay at WO-144 because their checks pass against the changed source.",
  "evidence": [
    "packages/skeleton/src/verification-protocol.ts (findingContract, evidenceResultSchema, transportPrompt)",
    "packages/skeleton/src/worker-transport.ts (canonicalWorkerArgs)",
    "packages/skeleton/test/verification-worktree.test.ts: 10 pass (two new WO-056 regressions); verification.test.ts: 17 pass (one new); worker.test.ts: 23 pass, 2026-09-20",
    "Fake-CLI probe through the changed transports, 2026-09-20: all five passes, receipt in session scratch only",
    "npm test 2026-09-20T04:45Z: 20 suites passed, 1 failed; the one failing test is the live-receipt requirement",
    "node scripts/verification-evidence.mjs --check and artifact-identity-evidence.mjs --check: verified against the changed source; authority and feedback checks stale before regeneration",
    "npm run harness -- emit / check: 31 generated surfaces; the hook diff is the runtime snapshot id and its hash only",
    "npm run plan -- check: exit 0; WO-056 listed as an authorized-execution-amendment bound to WO-056-D008"
  ],
  "rejected": [
    {
      "option": "Steps limited to every witness's reproduction step",
      "reason": "deriveRepairOrder resolves a step only against the finding's referenced witnesses; a passing witness's step copied into a finding would be read as a raw command and refused. Adverse witnesses' steps plus the named commands is the set that derives."
    },
    {
      "option": "Instructions only, no schema constraint",
      "reason": "A structured-output schema is the one channel a live CLI enforces. Instructions alone leave the 2026-09-20 failure possible on every run."
    },
    {
      "option": "Reject non-conforming reproduction steps at admission",
      "reason": "That changes the admission rule, which the expansion excludes."
    },
    {
      "option": "Move all four evidence editions to WO-056, as WO-055 did",
      "reason": "Two of them verify unchanged; re-recording them would claim a change that did not happen."
    }
  ],
  "reopenWhen": "A live verifier's structured-output channel rejects or ignores the enum, a legitimate finding needs a step outside the stated set, or Codex refuses the snapshot launch for another reason."
}
```

Whether either live CLI honors a string enum inside an array item is not
observed yet; the schema already used enums for identifiers, and both CLIs
returned structured results against it. The next live attempts settle it.

Observed later on 2026-09-20: both did. `claude-live-3` and `codex-live-3`
returned findings whose `observed`, `expected` and reproduction steps were all
inside the stated values, and the host admitted them. After `main` was
integrated and the skeleton version bumped, the hook diff also carries the
skeleton version.

## WO-056-D010 — Integrate `main` during execution, at the operator's direction

```json
{
  "id": "WO-056-D010",
  "date": "2026-09-20",
  "dispatch": "operator, 2026-09-20: \"also i merged in a parallel work order, so update main\" then \"yes integrate do what you gotta do\"",
  "decision": "Fast-forward this worktree from base 295766dd to origin/main 37a729ca (WO-140, #98) before the live repository feedback audit, instead of leaving integration to final review. The branch had no commit of its own, so no merge commit was made. Preserve first: the whole working tree, tracked and untracked, was written to refs/dotln/checkpoint/WO-056/2 (979d0e52) and verified byte-for-byte, and the 21 overlapping files were also copied to session scratch. All 21 were generated projections (14 hook files, the harness manifest, docs/control/current.md, docs/evidence/current.json, the decisions index, the follow-up register, two publication locks, the work-order index); only those were put back to their committed bytes so the fast-forward could proceed, then every one was regenerated on the integrated tree. No hand-authored file overlapped and no upstream path collided with an untracked file.",
  "evidence": [
    "git status before: wo-056...origin/main [behind 3]; git log HEAD..origin/main: f2dd331d, b9ed8932, 37a729ca",
    "Upstream changed 70 files, among them pinned feedback sources gate-evidence.mjs, harness-host.ts, loadouts/contributor.ts and usage-observation.mjs",
    "refs/dotln/checkpoint/WO-056/2: 0 tracked differences from the working tree; all 21 untracked files present with equal hashes",
    "After integration: harness emit/check 31 surfaces; work-order index; npm run meta; publication check; npm run plan -- check exit 0; verification and artifact-identity editions (WO-144) verify; authority and feedback editions rewritten as WO-056 on the integrated source",
    "docs/product/07-execution-guide.md#independent-workflows-and-integration (the integrating actor owns the merge and the evidence-impact assessment)"
  ],
  "rejected": [
    {
      "option": "Leave integration to final review, as the guide's default has it",
      "reason": "Upstream changed pinned feedback sources, so a live audit recorded on the old base would go stale at integration and the operator would pay for a second one. The operator directed the integration."
    },
    {
      "option": "git stash or autostash",
      "reason": "The stash stack is shared across worktrees and sessions."
    },
    {
      "option": "A merge commit",
      "reason": "No branch commits before final review; a fast-forward needs none."
    }
  ],
  "reopenWhen": "Final review finds a projection this integration left stale, or main moves again before review."
}
```

Evidence-impact assessment. The six live receipts and three double receipts
are unaffected: they were recorded against the repaired runtime at base
295766dd, and upstream changed none of `verification-protocol.ts`,
`worker-transport.ts`, the verification, repair or source-change hosts, the
compiler or the kernel. The published `claude-live-3` log still replays on the
integrated tree. The focused suites and the receipt regression were re-run
after integration. `docs/control/current.md` now carries `main`'s projection
without this order's active block; the guide leaves that to the next legal
transition, and `npm run resume -- status` still reports WO-056 active. The
two pre-integration evidence editions written earlier in this session were
never committed; they are superseded by the integrated ones and remain in
checkpoint 2.

## WO-056-D011 — What a receipt without a published log can still be held to

```json
{
  "id": "WO-056-D011",
  "date": "2026-09-20",
  "dispatch": "resume: next (after the first passing live receipts)",
  "decision": "The first passing Codex receipt withholds its log, and the regression fixture showed that such a receipt could be relabelled to the other live harness and validate. Each episode's reported usage already names the vendor wire its transport decoded (`claude-result-envelope`, `codex-result-envelope`), so the validator now requires a reported usage source to name the launched harness. Forgeries that only a published log or a rehashable bare contract can contradict (a restated summary, the replay's recorded fields, the log's stated version, a contract rewritten under its hash) are asserted only for receipts that publish them; for a withheld log the fixture instead requires that the fold pass is unclaimed.",
  "evidence": [
    "packages/skeleton/test/live-verification-receipt.test.ts failing on `codex-live-3.json: harness relabelled`, then `summary differs from the log`, then `contract rewritten under its hash`, 2026-09-20",
    "docs/evidence/WO-056/claude-live-3.json and codex-live-3.json (episode usage sources)",
    "docs/evidence/WO-056/receipt.mjs; the fixture passes 3 of 3 with all nine receipts present"
  ],
  "rejected": [
    {
      "option": "Drop the relabel forgery for withheld-log receipts",
      "reason": "A cheap recorded fact does bind the harness; using it keeps the check."
    },
    {
      "option": "Require every live receipt to publish its log",
      "reason": "On this machine a Codex worker needs the absolute Node path (D002), and publishing that log would publish a private path or edited bytes."
    }
  ],
  "reopenWhen": "A transport stops reporting a vendor-specific usage source, or the Codex writer can run a path-free command (D002's follow-up), which would let every live receipt publish its log."
}
```

## WO-056-D012 — Final review: correct product 03's two pending-proof sentences here

```json
{
  "id": "WO-056-D012",
  "date": "2026-09-20",
  "dispatch": "resume: final review",
  "decision": "VER-001's non-blocking observation 1 left final review to choose between writing product 03 back now and boarding it up. Two sentences in 03 state that live model verification is still the separate, pending WO-056 proof, and 03 carries no other WO-056 text, so on merge a reader of 03 meets a false claim with no adjacent correction. Both are corrected in place to the landed fact with a link to this order's evidence, within the bounded adjacent-cleanup allowance: the category is exactly the sentences this order falsifies, the edit adds no assessment 03 does not already make, and it keeps 03's stated limit by naming one synthetic repository and one run per harness. 02 and the skeleton README keep their predecessor sentences unchanged, because in both the superseding WO-056 paragraph sits directly below, which is this repository's layered-record convention.",
  "evidence": [
    "docs/product/03-architecture.md:837-838 and :1699-1701 (the corrected sentences)",
    "docs/verifications/WO-056/VER-001.md §Observations 1",
    "docs/evidence/WO-056/implementation.md §Limits (the executor's disclosure)",
    "npm run publication:check exit 0 and npm test -- --review exit 0 after the edit, 2026-09-20"
  ],
  "rejected": [
    {
      "option": "Record a planner follow-up and leave 03 stale",
      "reason": "A two-sentence factual correction would wait a whole planning cycle while the document asserts a pending proof that has landed."
    },
    {
      "option": "Append a dated WO-056 paragraph to 03 as 02 and the README do",
      "reason": "03 makes no claim needing supersession here; only two forward pointers are wrong, and a new paragraph would restate 02 without adding architecture."
    },
    {
      "option": "Revise 03's wider live-verification prose",
      "reason": "Outside the category the observation names and outside the bounded cleanup allowance; the rest of 03 is true at this subject."
    }
  ],
  "reopenWhen": "A later order changes what the live proof evidences, or 03 gains its own WO-056 assessment, at which point these pointers are restated with it."
}
```
