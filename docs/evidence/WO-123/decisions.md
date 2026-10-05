# WO-123 decisions

Dispatch: `resume: next`, 2026-10-04 (local date). The canonical status selects
WO-123, active, with all hard dependencies met. Session readback reports Codex
CLI 0.160.0, `gpt-6-astra`, effort `max`, `codex-session-readback`. One writer;
no delegated coding agents. The required live feedback episode is a separate
bounded model invocation specified by the order.

## WO-123-D001 — One continuation, existing primitive hosts

```json
{
  "id": "WO-123-D001",
  "date": "2026-10-04",
  "dispatch": "resume: next",
  "decision": "Use an executable Invoke continuation in its own pure module, persisted through the existing inspected worker store. Resident and operator entries share admission, materialization and the continuation. Admission preflight reads and screens the issue, compiles the StoryContract and derives surfaces at the default threshold before any source worker; its receipts become the first continuation receipts. The registered intent portfolio supplies the target and phase ceiling, never the draft's self target. The derived identity is allocated before opening the compiled source-worker program. Keep the existing primitive hosts and their independent artifact checks.",
  "evidence": [
    "WO-123 Design and criteria 1-5 explicitly allow surface derivation before admission with its authority recorded",
    "scripts/lib/derived-orders.mjs fileIntent files an inactive self/unassigned draft; materializeOrder preserves provenance identity and refuses changed inputs",
    "scripts/lib/review-comment-loop.mjs persists an executable Invoke program and validates each command and result on replay",
    "packages/skeleton/src/resident-store.ts orders durable event append before dispatch; resident-host.ts admits actor work only under the current compiled phase",
    "WO-180 D013, WO-181 D012/D014 and WO-182 D006 identify the class-source, review-retry and delivery-preparation obligations"
  ],
  "rejected": [
    { "option": "Separate command and resident workflows", "reason": "They would duplicate progression and leave restart parity unproved." },
    { "option": "Activate the unmodified draft as self", "reason": "Its target, criteria and authority are placeholders; the accepted target comes from the registered portfolio." },
    { "option": "Replace primitive hosts or broaden their protocols", "reason": "The order composes their existing boundaries; derived surfaces in review and screen extensions remain explicit non-goals." },
    { "option": "NoOp", "reason": "The closed primitives still have no resident-admitted end-to-end caller, blocking WO-112 and WO-118." }
  ],
  "reopenWhen": "An executable fixture shows the existing primitive interfaces cannot preserve identity, authority or the required readiness artifacts."
}
```

Mission and critical path: remove manual coordination between the existing
source-to-deliverable primitives, enabling WO-112 and then WO-118. Policy
resistance and fixes that fail: intersect the portfolio, phase and admitted
grants and retain each primitive's refusal. Commons and escalation: one writer,
bounded fixtures and one required live feedback episode; no new gate. Drift to
low performance and rule beating: stops remain typed, and restart tests count
actual dispatches and receipts. Shifting the burden: both entries persist the
same recoverable work. Success to the successful: a new coordinator was weighed
against the existing executable subset; its explicit result branches suffice.
Seeking the wrong goal: terminal behavior and evidence, not receipt volume, are
the outcome. Naive Interventionism: retain the useful host locks, authorization,
screen and independent verification; prove the new composition with doubles
before any live proof, which belongs to later orders. NoOp leaves the gap above.

## WO-123-D002 — Economy: retain the executable subset

```json
{
  "id": "WO-123-D002",
  "kind": "experiment",
  "date": "2026-10-04",
  "dispatch": "resume: next",
  "decision": "Retain the existing executable Invoke and inspected-store method; decline a separate optimization benchmark.",
  "question": "Does the existing executable subset require replacement to compose these hosts economically?",
  "alternatives": ["Reuse Invoke result branches and inspected stores", "Build and benchmark another coordinator"],
  "observation": "The review-comment loop already persists Invoke commands and validates result progression, and the source, verification and repair hosts already retain child episode identities. No observed limitation justifies a second coordinator benchmark.",
  "budget": { "wallSeconds": 600 },
  "execution": "declined",
  "reason": "The source inspection resolves the structural choice; a comparative benchmark would not establish the order's behavioral criteria.",
  "cost": { "wallSeconds": 0, "tokens": null, "commands": ["No experiment launched; required source inspection only"], "source": "Experiment declined before launch. Prerequisite source reads belong to implementation preparation, whose separate cost was not measured." },
  "effect": { "wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["Focused composition fixtures", "npm test -- --review", "npm run test:docs"], "summary": "Current mechanism retained; no measured saving claimed." },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": { "lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null },
  "evidence": ["WO-123-D001 source observations"],
  "rejected": [{ "option": "A new orchestration framework", "reason": "No demonstrated behavior requires it, and it would duplicate the existing continuation semantics." }],
  "reopenWhen": "A later composition demonstrates a material measured cost or missing behavior in the existing executable subset."
}
```

## WO-123-D003 — Directory identity before containment

```json
{
  "id": "WO-123-D003",
  "date": "2026-10-04",
  "dispatch": "resume: next",
  "decision": "Add the host's physical directory identity to canonical spelling checks before containment and recheck the parent, launchpad and target immediately before worktree creation. Keep the three containment helpers and their distinct root-equality semantics.",
  "evidence": [
    "WO-162 D004 and allocated FUP-8369f2b4284e70a8",
    "Bounded Node probe at 2026-10-05T01:01:56Z on darwin: case and volume variants have the same inode; realpathSync accepts both; native realpath accepts the volume alias; /bin/pwd -P with each directory as cwd returns the canonical spelling for both variants"
  ],
  "rejected": [
    { "option": "Use realpathSync.native alone", "reason": "The volume alias remains unchanged in the executed probe." },
    { "option": "Merge containment rules", "reason": "Root equality deliberately differs between the three existing callers." },
    { "option": "Check only after git worktree add", "reason": "The named defect leaves a branch, directory and registration before that check." }
  ],
  "reopenWhen": "A constructed variant on the declared filesystem is accepted, or another supported host cannot obtain an authoritative directory identity."
}
```

## WO-123-D004 — Bind publication to completed repair lineage

```json
{
  "id": "WO-123-D004",
  "date": "2026-10-04",
  "dispatch": "resume: next",
  "decision": "Read and replay at most two completed bounded RepairHost stores before target publication. Validate their original writer, unexpanded scope, original baseline, execution parents, child effect receipts and final sealed cumulative diff. Keep original logs unchanged and publish the final observed repair commit on the original outward branch. Preserve every source-worker episode in verification and review through an optional implementerEpisodeIds opening field; the old single-episode opening remains byte-compatible. Use a fixed conventional message for behavior repairs. Outward lint and every deliverable-ready row remain required.",
  "evidence": [
    "scripts/lib/target-publish.mjs bind requires the original WorkOrder id and base; packages/skeleton/src/repair-host.ts emits a suffixed child id and a new execution parent",
    "The executed repaired-candidate fixture reached readiness but was refused on independence: the original VerificationOpened retained only its last implementer while readiness requires every producer",
    "node --test --test-name-pattern='one command' scripts/test-vertical.mjs passed through source, review repair, all-criterion verification, independent review, readiness, real local Git push and fake-forge resolution at 2026-10-05T01:44:50Z",
    "Actor-attested adjacent queue adjacent-0001 revision 3 records announcement, steering opportunity, scope and checks"
  ],
  "rejected": [
    { "option": "Publish the original commit after a repair", "reason": "It would publish a different revision from the verified candidate." },
    { "option": "Overwrite source receipts or relax readiness", "reason": "That would obscure provenance or remove the very conjunction the order requires." },
    { "option": "Teach the review result about derived surfaces", "reason": "The order expressly leaves that protocol unchanged; the step receipt records surfaces alongside the existing findings." },
    { "option": "NoOp", "reason": "A passing repair could never pass the existing publisher's original-episode binding." }
  ],
  "reopenWhen": "An executed lineage fixture admits a different contract, unverified head, widened scope, reused producer identity or unrelated child store."
}
```

The same eight-lens comparison as D001 applies: this closes a demonstrated
critical-path gap, keeps the authority and evidence checks, adds no new worker
primitive or remote permission, and makes one bounded consumer projection.
The before/after fixture is the deciding observation, not additional receipt
volume. Review failures wait for the existing five-second host lease and then
receive one fresh attempt; a second failure stops at review.

## WO-123-D005 — Host-owned inputs and model-input exposure

```json
{
  "id": "WO-123-D005",
  "date": "2026-10-04",
  "dispatch": "resume: next",
  "decision": "Both entries converge at the accepted binding and VerticalOpened. A store's vertical.json names the physical registered target, forge selector, phase, worktree parent, profile, exact issue revision and supplied StoryContract classifications, worker selection, and optional declared conventions and browser scenario. The resident records IntentAdmitted before materialization or the first Invoke. It can resume one completed step per tick; the operator command drains the same continuation. The draft remains unchanged. Unknown classification or changed issue revision holds rather than being guessed. Reserve token ceilings where usage is absent, and bound portfolio wall time from its first admission.",
  "evidence": [
    "WO-061 classifications are caller-supplied inferred entries; unclassified text is an open decision",
    "WO-124 deriveSurfaces defaults to complete requirement coverage and accepts the existing typed profile/index",
    "WO-059's installed runScenario targets its declared synthetic application and emits synthetic-fixture witnesses",
    "The executed resident fixture starts with fileIntent, restarts after every completed step, reaches resolution through the existing hosts and is reopened by the operator entry without another worker or receipt"
  ],
  "rejected": [
    { "option": "Classify unknown issue text as requirements automatically", "reason": "That would bypass the compiler's open-decision contract and invent a new inference primitive." },
    { "option": "Relabel synthetic browser witnesses as live target evidence", "reason": "The installed adapter proves its fixture application only. A target visual claim without live witnesses stops explicitly." },
    { "option": "Treat missing token usage as zero", "reason": "Reserving the admitted ceiling avoids silently replenishing a bounded portfolio." },
    { "option": "A new ModelInputPlan protocol", "reason": "FUP-0113's carry-in asks for the exposure decision; explicit step records below suffice for this bounded composition without changing capsule schemas." }
  ],
  "reopenWhen": "A supplied classification episode or a target-capable browser adapter lands, or measured token receipts justify releasing reserved portfolio budget."
}
```

Exposure by step: bundle/contract/surfaces/admission send nothing to a model.
The source worker sees only its compiled WorkOrder and assigned target checkout.
Baseline sees the sealed base, contract and host-run named-test rows. Behavior
verification sees the sealed candidate, original contract, diff and host-run
rows, with the baseline comparison. Independent review sees the same sealed
candidate, contract, diff, baseline, verified rows and unchanged conventions;
its existing protocol gets no derived-surfaces field. A repair sees the original
contract and the specific bounded finding, never the initial worker transcript.
Preparation, lint, publication and observation send nothing to a model; review
resolution uses the existing supplied triage judgments and bounded repair host.
Issue/discussion/review text is screened at decode with only its forge host
allowed. Source snapshots retain the existing file/text bounds. Context bytes
and tokens are unknown until each model episode runs; the fixture actors are
doubles, not live-model evidence. The continuation assumes durable completed-step
receipts; the already-carried external-success/pre-receipt crash window is not
claimed solved.

## WO-123-D006 — Two requested independent implementation reviews

```json
{
  "id": "WO-123-D006",
  "date": "2026-10-04",
  "dispatch": "resume: next",
  "decision": "After implementation and focused checks, request one read-only adversarial review and one read-only principal software engineer improvement review. The executor remains the only writer, evaluates every critique and fixes supported findings before handoff. These reviews do not replace the later verifier or final-review dispatch.",
  "evidence": ["Operator: at the end of implementation, spawn an adversarial subagent + 1 principal software engineer improver subagent to get confirmations off of or critiques"],
  "rejected": [{ "option": "Delegate concurrent writes in this worktree", "reason": "One writer per worktree remains the project rule; the operator asked for confirmations and critiques." }],
  "reopenWhen": "The operator changes the review request."
}
```

Fan-out plan: two read-only agents, no descendants, reused for follow-up. The
required live feedback actor is a separate invocation. The session cap is 20;
entry readback observed zero subagents, and none had been spawned when this
plan was recorded.

The two agents completed their initial and follow-up inspections read-only.
Their supported critiques and resulting changes are recorded in D008; neither
inspection is a substitute for executable checks or the independent verifier.

## WO-123-D007

```json
{
  "id": "WO-123-D007",
  "date": "2026-10-05",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.67.0, the next minor above the observed release baseline v0.66.2, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.66.2 (local tags)",
    "minor classification declared in docs/work-orders/WO-123-vertical-composition.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-123-D008 — Close the requested reviews' concrete gaps

```json
{
  "id": "WO-123-D008",
  "date": "2026-10-04",
  "dispatch": "resume: next; operator-requested implementation reviews",
  "decision": "Use one replay-validated resident admission ledger for both entries, with operator provenance changing only scheduling. Match issue identities exactly. Intersect all phase resource caps, use only the resident-admitted host grants, and hold unsupported mixed local/remote grants before dispatch. Track resident steps through the existing presence interpreter and guard each worker launch and running process against return, revocation and expiry. Reconcile a completed receipt with its resident settlement from either entry. Record expiry as a named terminal stop even when scheduling refuses more effects. Classify existing failures from a bounded active assertion rule, keeping requirement-only negations out of the defect class. Bind each repair child to the complete actual derived work order, envelope, surfaces, test command, execution parent and repair context; retain every producer identity for independence checks.",
  "evidence": [
    "Read-only adversarial review by /root/wo123_adversarial: separate operator accounting, issue-number prefix collision, grant subset mismatch, mixed-grant incompatibility and expiry-before-disposition findings",
    "Read-only principal software engineer review by /root/wo123_principal: reverse-entry recovery, in-flight presence accounting, phase resource caps, baseline classification and complete repair-child binding findings",
    "scripts/test-vertical.mjs executes shared-budget exhaustion in both entry orders, exact issue 1/10 matching, phase cap narrowing, repair producer-reuse and payload-tamper refusals, in-flight kill/finish/revocation, receipt-before-settlement recovery and expiry through both entries",
    "The baseline cases include a healthy current observation, a new requirement that must return an error and must not crash, a failing check whose result is not saved, and an export that does not work"
  ],
  "rejected": [
    { "option": "Keep separate command accounting", "reason": "It replenished the standing portfolio budget and prevented operator-first resident convergence." },
    { "option": "Treat a vertical primitive as untracked resident work", "reason": "Idle and return policy would not describe the actual in-flight worker." },
    { "option": "Discard unsupported grant effects silently", "reason": "Admission would promise authority the existing publisher could not consume." },
    { "option": "Reject every sentence containing not or must as a defect source", "reason": "Ordinary existing-failure assertions include those words in their explanation." },
    { "option": "Add another coordinator or primitive", "reason": "Existing resident scheduling and worker transport boundaries can enforce these corrections." }
  ],
  "reopenWhen": "An executed fixture shows another entry-accounting divergence, policy escape, classification error or repair binding mismatch within the declared set."
}
```

New inputs are the two requested read-only review reports and their follow-up
critiques; no employer or private source material was used. D001's eight-trap,
Naive Interventionism and NoOp comparison still favors correcting observed
behavior at existing boundaries. The bounded assertion rule is not a general
natural-language classifier. Unclassified source remains an open decision.
Final check outcomes and review confirmations belong to the handoff evidence.

## WO-123-D009 — Component compatibility

```json
{
  "id": "WO-123-D009",
  "date": "2026-10-04",
  "dispatch": "resume: next",
  "decision": "Bump @dotln/skeleton from 0.52.2 to 0.53.0 for the additive intent portfolio, continuation and command; bump @dotln/beacons from 0.1.0 to 0.1.1 for the directory-identity refusal. Refresh their internal dependency pins and lockfile only. Keep the harness protocol version and all other component versions unchanged. Prepare application v0.67.0 locally without publication.",
  "evidence": [
    "WO-123 declares a minor application release",
    "Existing portfolio shapes and absent implementerEpisodeIds retain their previous decoding behavior",
    "Variant-spelled or unreadable paths now refuse before containment; canonical paths retain the existing containment semantics",
    "npm run release -- prepare --local assigned v0.67.0 from the observed local v0.66.2 baseline in D007"
  ],
  "rejected": [
    { "option": "Bump every component", "reason": "Only the skeleton and beacon implementations changed." },
    { "option": "Add a dependency", "reason": "The composition uses the existing compiler, hosts and Node facilities." }
  ],
  "reopenWhen": "A compatibility check finds a protocol break or another component's implementation must change."
}
```

## WO-123-D010 — Current evidence and the required live audit

```json
{
  "id": "WO-123-D010",
  "date": "2026-10-04",
  "dispatch": "resume: next",
  "decision": "Select fresh WO-123 revision 001 editions for authority, artifact identity, verification and feedback; preserve previous editions. Register vertical.ts in the common evidence closure and feedback subject because resident-state imports it. Re-emit and check the installed harness, re-pin the console to the new live self-host stream, and regenerate its projections. After the last judged source edit, run the required live feedback audit with codex-cli-exec, gpt-6.1-sol, max and DOTLN_LIVE_WORKERS=1, then record and check it.",
  "evidence": [
    "regeneration.json records every command, UTC endpoints, measured wall time and exit code; all 15 commands passed",
    "Whole regeneration and checks: 66.780 seconds; live audit including the command's build: 55.051 seconds",
    "feedback --check reports: Live feedback audit docs/evidence/WO-123/feedback-001 judged the current source",
    "The audit completed ten regression fixtures and ten removal controls; the matched instruction projection saved 1192 bytes, which is not a workflow-token or cost claim",
    "The evidence import-closure checks pass; the new host, scheduling and runtime adapters are not imported by a registered evidence source. They are exercised by the vertical integration suite, not represented as independently live-judged files",
    "composition-check.json records all 20 focused cases passing and both requested reviewers' final read-only confirmations"
  ],
  "rejected": [
    { "option": "Carry the previous live audit through changed judged behavior", "reason": "Criterion 7 requires a fresh episode after the last judged edit." },
    { "option": "Rewrite old evidence", "reason": "Editions preserve the observations at their recorded subject." },
    { "option": "Describe the synthetic composition as a live delivery proof", "reason": "That proof remains WO-112's responsibility." }
  ],
  "reopenWhen": "A subsequent judged-source change requires a new feedback edition and live audit, or a checker reports stale evidence."
}
```

The two requested collaboration agents plus this one live verifier are the
three actor invocations explicitly planned for this session; no descendant
was requested. Host observation coverage is reported separately at handoff.

## WO-123-D011 — Beacon compatibility and final material accounting

```json
{
  "id": "WO-123-D011",
  "date": "2026-10-04",
  "dispatch": "resume: next",
  "decision": "Keep the new physical-directory refusal while preserving canonicalDestination's existing provenance-key-file caller: an existing file uses its containing directory for directory identity, and a missing descendant of a non-directory refuses. Canonicalize positive beacon fixture roots and expect the earlier identity refusal for aliases. Update the existing command-list assertion to include vertical. Preserve retained implementation diagnostics through the canonical worktree material registry.",
  "evidence": [
    "The first npm test -- --review attempt reported the old CLI command-list expectation and the beacon directory-identity refusal in WO-020 positive fixtures; the executor stopped that gate before editing, with no passing check recorded",
    "packages/beacons/src/beacon-provenance.mjs calls canonicalDestination on existing private key files; treating that file itself as a process cwd was incorrect",
    "Bounded node --test over audit-command, beacon-fs, control-beacon-cli, control-beacon, senses and senses-v3: 31 passed, 0 failed in 2.599 seconds at 2026-10-05T02:56:28.167Z, including key rotation, replay and canonical control-log re-derivation",
    "The focused vertical admission/path-identity fixture passed again in 4.046 seconds at 2026-10-05T02:57:27.115Z; case, volume and Unicode variants were all constructed and refused without residue",
    "harness check still reports 32 current generated surfaces; no judged feedback-source file changed after the live audit",
    "The adversarial reviewer inspected the final file/directory distinction read-only and found no remaining blocker in that focused scope",
    "The canonical material commands declared 33 repositories preserved in copies of 15 retained synthetic fixture roots; every recorded repository state was readable, and the original roots remain unchanged"
  ],
  "rejected": [
    { "option": "Weaken the directory guard to accept the legacy alias fixture", "reason": "The order requires physical spelling before containment; the positive fixture must supply that spelling." },
    { "option": "Treat every canonicalDestination input as a directory", "reason": "The inspected existing key-file caller requires regular-file handling." },
    { "option": "Discard diagnostic repositories at handoff", "reason": "The executor preserves work and declares retained material through the existing registry." }
  ],
  "reopenWhen": "An existing canonical file/directory caller regresses, a declared path variant passes, or retained fixture state changes before completion."
}
```

New inputs are the first full-gate failure output and the named existing beacon
and CLI tests. Ordinary test fixtures keep their established temporary-root
teardown; this records retained diagnostic material, not a global temporary
cleanup. Absolute host locations and material state receipts stay in ignored
control storage.

## WO-123-D012 — Fixture document roots

```json
{
  "id": "WO-123-D012",
  "date": "2026-10-04",
  "dispatch": "resume: next",
  "decision": "Resolve the vertical fixture's sequence, work-order directory, local ignore entry, vocabulary and local terms through the existing docPath/docRelative configuration helpers. Keep the configuration-root guard unchanged.",
  "evidence": [
    "The second full gate passed skeleton and vertical but reported the six hard-coded document-root literals in scripts/fixtures/vertical/fixture.mjs; it was stopped before editing at 2026-10-05T03:08:59Z, with no passing gate row recorded",
    "The first direct configuration test invocation passed the corrected literal-root check but inherited the executor's Codex session into synthetic lifecycle checkouts without their harness build; that invocation is not claimed passing",
    "Using the existing suiteEnvironment helper used by the full gate, the bounded configuration-root suite passed all 14 tests in 4.446 seconds at 2026-10-05T03:10:49.293Z",
    "Only the fixture helper changed; no registered or feedback-judged source changed after revision 001's live audit"
  ],
  "rejected": [
    { "option": "Exclude the new fixture from the configuration-root guard", "reason": "The existing configuration helpers express its paths directly and keep the fixture valid under configured roots." },
    { "option": "Change production lifecycle admission for the direct fixture invocation", "reason": "The full gate already supplies an explicit offline fixture environment; the invocation should use that existing environment." }
  ],
  "reopenWhen": "A configured-root fixture no longer resolves the same intended documents, or the full gate reports another regression."
}
```

New inputs are the second gate's configuration-root failure and the current
configuration helpers and fixture environment. The correction retains D001's
scope and existing guards; no new capability or dependency is introduced.

## WO-123-D013 — Register the vertical suite in its inventory assertion

```json
{
  "id": "WO-123-D013",
  "date": "2026-10-04",
  "dispatch": "resume: next",
  "decision": "Add vertical to the runner fixture's explicit outside-confinement inventory and name its existing native source/verification-host reason. Keep the inventory assertion and the runner's environmental declaration unchanged.",
  "evidence": [
    "The third full gate passed vertical in 140.97 seconds, skeleton in 372.28 seconds, configuration-root and every regenerated evidence checker, but the runner inventory assertion expected the pre-vertical list",
    "The executor stopped that gate before editing at 2026-10-05T03:25:34Z; no passing gate row was recorded",
    "The complete scripts/test-runner.test.mjs file passed all 46 tests with the gate's suiteEnvironment in a bounded command at 2026-10-05T03:30:45.520Z; its 291.123 seconds includes waiting for shared host lanes",
    "The additional process and deadline files selected by the registered runner-fixtures suite remain part of the final full gate"
  ],
  "rejected": [
    { "option": "Remove the vertical suite's outside-confinement declaration", "reason": "Its production hosts nest the existing native confinement boundary; the fixture inventory must describe that requirement." },
    { "option": "Replace the exact inventory assertion with a permissive check", "reason": "The existing assertion can admit the one intended addition while continuing to detect unintended declarations." }
  ],
  "reopenWhen": "The vertical suite no longer needs the nested native boundary, or the full runner fixtures report a different failure."
}
```

The new input is the runner's current suite-inventory assertion and its failed
comparison. This is a correction to the suite registration already in scope;
it changes no production behavior, evidence subject or dependency.

## WO-123-D014 — Preserve the unexplained worktree fixture result

```json
{
  "id": "WO-123-D014",
  "date": "2026-10-04",
  "dispatch": "resume: next",
  "decision": "Retain the failed full-gate row and rerun the unchanged worktree fixture with command tracing under the existing suite environment, then rerun the required full gate. Make no production or fixture-assertion change without a reproduced cause.",
  "evidence": [
    "The fourth full gate completed at 2026-10-05T03:42:21.820Z: 38 suites passed and worktree failed; 611.536 seconds, code identity e7d7d7ac021a015c5f861fea936550595e86e44b1fb0b428ae1272805bc80d54",
    "The worktree case exited 1 after release-note validation and before the wrapped-PR-body success message; its retained output contains no failed assertion message. It passed in the second and third gate attempts",
    "The same scripts/test-worktree.sh passed under bash -x and suiteEnvironment with no source change: bounded command exit 0, 91.974 seconds, completed 2026-10-05T03:46:28.108Z",
    "The failed row, selected output and successful command trace remain in ignored local control storage. The failure's cause is unknown; the pass does not establish a timing or resource cause"
  ],
  "rejected": [
    { "option": "Count the isolated pass as the complete product gate", "reason": "Criterion 8 requires a passing complete npm test -- --review row at the current code identity." },
    { "option": "Change publication behavior or weaken the fixture without a reproduced cause", "reason": "The available evidence does not establish which assertion or underlying operation caused that exit." }
  ],
  "reopenWhen": "The failure recurs with a diagnostic identifying its assertion or cause."
}
```

New inputs are the fourth full-gate result and the unchanged fixture's traced
pass. The earlier progress update missed the failure line; the executor
corrected that statement when reading the completed gate.

## WO-123-D015 — Extend the verification wrapper and preserve the original fold

```json
{
  "id": "WO-123-D015",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Validate the optional cumulative implementer lineage in foldVerificationOpening, then copy it into both independence arrays after the original opening fold succeeds. Preserve all three original extracted branch bodies and the unchanged WO-184 checker. Select fresh revision 002 evidence after this judged-source correction.",
  "evidence": [
    "The fifth full gate passed 39 suites with zero failures in 520.432 seconds at 2026-10-05T03:56:35.778Z; the subsequent documentation gate failed WO-184's original-body hash assertion for VerificationOpened (3754 bytes versus the recorded 3178)",
    "WO-184's extraction checker, criterion 11 and repair decisions preserve the original branch bodies; the existing foldVerificationOpening wrapper already supplies the extension point",
    "After moving the extension into that wrapper, node docs/evidence/WO-184/check-reactor-move.mjs --check passed unchanged and the bounded build passed at 2026-10-05T04:01:11.479Z",
    "Both requested read-only reviewers rechecked the final wrapper: optional lineage validates bounds, unique safe IDs and primary membership; both independence arrays receive copies; an absent optional field preserves legacy behavior. Neither found a remaining blocker in this focused check",
    "The complete bounded node scripts/test-vertical.mjs passed all 20 tests after the move in 119.222 seconds at 2026-10-05T04:08:32.195Z; composition-check-002.json records the actual host result",
    "regeneration-002.json records 16 successful sequential commands in 74.204 seconds, completed 2026-10-05T04:10:21.063Z; the new live feedback audit used codex-cli-exec, gpt-6.1-sol, max, and DOTLN_LIVE_WORKERS=1, taking 62.575 seconds",
    "Authority, artifact, verification and feedback revision 002 checks passed; the feedback check says it judged current source, with ten passing regressions and ten removal failures. Console projections match and harness check reports 32 current generated surfaces"
  ],
  "rejected": [
    { "option": "Update the historical branch hashes to accept the extension inside the original fold", "reason": "The existing wrapper supports the new behavior while retaining the recorded compatibility obligation." },
    { "option": "Reuse revision 001's live feedback or the fifth full-gate pass for the changed subject", "reason": "Criterion 7 requires an audit after the last judged-source edit and criterion 8 requires a current passing product gate." },
    { "option": "Spawn additional review agents", "reason": "The two requested reviewers could recheck the bounded correction and both were reused." }
  ],
  "reopenWhen": "The wrapper changes legacy behavior, a producer is admitted as its own verifier, or a current evidence or full-gate check fails."
}
```

The new inputs are the documentation-gate failure, WO-184's original-body
checker and its wrapper-preservation decisions, and both reviewers' final
rechecks. The executor initially placed the extension in the wrong function;
the correction preserves the old bodies and keeps producer independence in
the existing extension layer. Starting full validation before checking these
smaller compatibility contracts caused avoidable repeat cycles; the operator
raised that execution cost and the executor acknowledged it.

The first revision-002 regeneration attempt stopped at the artifact command's
unsupported selection flags after 0.904 seconds. Its ignored receipt is
retained. Artifact and verification selection now use their existing manifest
interface; no production command or historical edition was changed. Revision
001 remains historical, while `docs/evidence/current.json` selects 002. The
1192-byte matched-projection result is not a claim of workflow time or token
savings. The final product and documentation gates are recorded in the handoff.

## WO-123-D016 — Verification: fail on criterion 5; repair items for the resident path

```json
{
  "id": "WO-123-D016",
  "date": "2026-10-05",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 on criterion 5 alone; criteria 1-4 and 6-8 are met. F1: no fixture drives a surface derivation that returns NeedsHuman. The suite's 'derivation' case passes snapshot [], which makes deriveSurfaces throw a decode refusal, so admitIntent returns its generic 'intent input cannot be decoded' from the catch at packages/skeleton/src/vertical.ts:416-427, and the derivation branch at vertical.ts:284-287 never runs. The case asserts only that a step and a reason are present (scripts/test-vertical.mjs:437-440). F2: no fixture has one unresolved material ambiguity. The 'ambiguous' case (test-vertical.mjs:391) compiles 0 active criteria and 2 open decisions, so it would hold even without the open-decision check at vertical.ts:280-283. F3: a contract that names a failing behavior in ordinary words is classed new, no finding is reported, and the story is walked to publication. baselineClass (vertical.ts:452-496) recognizes failure only through one bounded pattern. The primitive takes story.kind from that rule (scripts/lib/vertical-primitives.mjs:371-383), and the host re-checks with the class the same rule produced (vertical-host.ts:176-181), so in production the 'classed new' finding can never fire. Its only fixture calls the pure function with a hand-supplied 'new' (test-vertical.mjs:379-382). The production branches behind F1 and F2 behave correctly; their fixtures are missing, while the handoff states they exist. Eight further findings sit inside the order's declared surfaces and contradict no criterion; they go to the repair's Adjacent Repair (R1-R8 in VER-001).",
  "evidence": [
    "Root verifier probe (DotLn session scratch root/own-probe.mjs, bounded, current dist): admitIntent with snapshot [] returns {NeedsHuman, surfaces, 'intent input cannot be decoded'}, and deriveSurfaces([]) throws 'surface derivation: $.snapshotIndex: expected 1 to 100 files'. With snapshot null the admission holds at surfaces with the derivation's own reason 'snapshot unavailable: requires 1 to 100 regular UTF-8 files, ...'.",
    "Same probe: compileStoryContract(bundle, []) has 0 active criteria and 2 open decisions. Keeping either single inference gives 1 active criterion and 1 open decision, and admitIntent holds at step contract. grep -n unresolved scripts/test-vertical.mjs finds nothing.",
    "Same probe: 'Uploads fail for files larger than 10 MB.', 'Saving a document throws a TypeError.' and 'The export endpoint returns HTTP 500.', as a requirement or as a current-behavior observation, each give produced class new and 0 host findings. 'The check is failing.' and 'The build fails.' give defect.",
    "An independent sub-verifier composed a run whose contract reads 'Uploads fail for files larger than 10 MB: make fixture.txt contain changed by synthetic worker.' Every step completed. The baseline recorded storyClass new, outcome walked and findings []. The run published a Deliverable-ready body through a real local git push and resolved, although the target's test fails at the base. This is WO-180 D013's hazard ('a defect story classed new is walked and skips the non-reproduction stop'), which the order's Observed gap names.",
    "Adjacent Repair findings R1-R8, each reproduced by a sub-verifier and confirmed by an independent checker in DotLn session scratch: R1 vertical-host.ts:189-201 turns a thrown, held or killed defect-class baseline into 'baseline did not reproduce the named failing behavior'. R2 an admitted vertical bound to another presence phase makes every resident tick return true before dispatch until expiry (vertical-resident.ts:119); concurrent operator and resident entries throw out of ResidentHost.run (vertical-resident.ts:152-201, vertical-host.ts:79); a phase re-armed during preparation makes the resident append an IntentAdmitted its own fold rejects (resident-state.ts:681-704). R3 transient preparation and scheduling conditions are recorded as permanent IntentHeld that neither entry can re-admit (vertical-resident.ts:141-185, vertical-runtime.mjs:428-457). R4 the transport's 20 ms authority poll appends a ClockSampled event and replays the whole resident log on every call: 78-88 events in about 3 s, with mean transaction time rising from 34.9 ms to 156.4 ms over 2,005 samples. R5 the identity refusal sits in the shared canonicalDestination (packages/beacons/src/beacon-io.mjs:70-78), so one worktree Git registered under a case-variant spelling makes sweepControlBeacons throw for the whole set, where HEAD swept 2. R6 test gaps: no fixture for an existing unreadable directory (the missing-path checks also pass at HEAD); no run-level assertion of the baseline class and source, of delivery-preparation.json or of the screen hold's step; the negative no-dispatch list names ResidentDispatchRequested and VerticalCommandPersisted, which cannot appear in the resident log, and omits IntentStepStarted; the restart identity check is implied by the step assertion; no fixture SIGKILLs a process (independent SIGKILL probes after source-change and after publish did resume at the next step with no repeated effect). R7 the 07 sentence 'a grant that mixes local and remote authority is held before dispatch' holds only when no remote-only grant covers the effect; otherwise the mixed grant is filtered out at compile (vertical-primitives.mjs:129-140). publishTargetOrder's preview option (scripts/lib/target-publish.mjs:1055, 1151-1158) is recorded in no decision or in adjacent-0001. R8 the guards' pwd trimEnd refuses a canonical name ending in whitespace; preparation refusals lose their reason under step bundle; a death between VerticalStepCompleted and the receipt-file write leaves that file missing for good; the path-identity record names no filesystem (this host: APFS, case-insensitive, /dev/disk3s5).",
    "Criteria 1-4 and 6-8 rest on: the root's bounded rerun of node scripts/test-vertical.mjs (20 passed, 0 failed, 120.9 s, finished 2026-10-05T04:29:08Z, with case, volume and Unicode variants constructed on darwin); the executor's npm test -- --review row at code identity 7f90a4a3a69694ca76e33375cb0f645742c2329840b85da39cfdcb294fd182f7 (39 suites, 2026-10-05T04:20:50.088Z, identity unchanged at report time); npm run test:docs rows at the same identity (04:12:00Z, 04:24:16Z); git diff --check clean; read-only evidence checks for authority, artifact identity, verification and feedback, plus console fixtures, harness check and publication check, all passing."
  ],
  "reopens": {
    "decisionId": "WO-123-D008",
    "observation": "An executed composition shows a classification error within the declared set: 'Uploads fail for files larger than 10 MB' is classed new and walked to publication, and the classed-new check compares the rule with its own output."
  },
  "goalAlignment": {
    "missionAndCriticalPath": "The composition unblocks WO-112 and WO-118, whose unattended runs depend on the resident never walking a defect story past its baseline and never dispatching on an unsettled derivation or ambiguity. F3 lets an ordinary defect report reach publication without reproduction. F1 and F2 leave two declared holds with no regression guard while the handoff says they are covered.",
    "traps": "Rule beating weighs against passing criterion 5 on fixtures that reach a different refusal or compare a class with itself. Seeking the wrong goal weighs against counting the 20 passing cases as proof of the declared decisions. Shifting the burden weighs for one repair batch with stated rules rather than leaving R1-R8 to WO-112's live run. Escalation weighs against failing criteria 1-4 on R2-R6, whose clauses hold. Drift to low performance is answered by executed reproductions for every item. Policy resistance, the commons and success to the successful are unchanged by the verdict.",
    "naiveInterventionism": "The verifier edits no subject source; probes ran in DotLn session scratch against the current build and the executor's fixture.",
    "noOp": "Passing would file a claim that the derivation and ambiguity holds and the classed-new finding are fixture-proven, and would carry a walked defect story into WO-112's live proof."
  },
  "rejected": [
    {"option": "Judge criterion 5 met because the production branches for F1 and F2 behave correctly", "reason": "The criterion states that these decisions hold in fixtures with doubles. The fixtures named for them reach a different refusal, and the handoff states otherwise."},
    {"option": "Treat F3 as a phrasing case outside the declared set", "reason": "The criterion's clause is a contract that names a failing behavior and is classed new; base-form 'fail' is the ordinary wording of that case, and the clause's check cannot fire in production because it compares the rule with itself."},
    {"option": "Fail criteria 1-4 on R2-R6", "reason": "Each of their clauses holds at the subject; the findings concern liveness, accounting and coverage beyond those clauses."},
    {"option": "Board R1-R8 to a later order", "reason": "Each sits in a surface this order declares (its continuation modules, fixtures, beacon-io.mjs, product 07) or in adjacent-0001's paths, so the Adjacent Repair rule keeps them in this order."},
    {"option": "Repair during verification", "reason": "The verifier does not edit the subject it judges."}
  ],
  "followup": "WO-123 resume: fix. (F1) The 'derivation' negative gives admitIntent a decodable input for which deriveSurfaces itself returns NeedsHuman (snapshot null, or an index without the named file). It asserts step surfaces, the derivation's exact reason, one IntentHeld carrying it, no IntentAdmitted or IntentStepStarted, no vertical store and writes 0. Every negative case asserts its expected step and reason, not their presence. (F2) A fixture with at least one active criterion and exactly one unresolved material ambiguity holds with a reason that names the ambiguity, records IntentHeld and makes no git push or PR call. The combined reason at vertical.ts:280-283 is split so that 'no executable criteria' and 'unresolved material decisions' can be told apart. (F3) A contract whose active statements assert an existing failure is classed defect, or is held NeedsHuman as unclassified, and is never silently new. At minimum this covers fail/fails/failed/failing, throws or errors, 'is not working', error statuses, and can't/cannot/does not followed by any verb. The class checked for the 'classed new' finding comes from a signal independent of the rule that assigns it, for example the contract's supplied statement classes. A composed-run fixture asserts the defect class, its source on the baseline receipt, and a NeedsHuman finding or non-reproduction stop. (R1-R8) Settle through Adjacent Repair or a recorded reasoned deferral, under the rules VER-001 states for each. Checks: node scripts/test-vertical.mjs, npm test -- --review, npm run test:docs, and a fresh live feedback episode if a judged source changes (criterion 7).",
  "reopenWhen": "A repair settles F1-F3 or the operator waives criterion 5; a repair changes admission, scheduling or path-identity behavior that criteria 1-4 judge; or a later run shows a defect story recorded as walked."
}
```

## WO-123-D017 — Boarded: the harness runtime snapshot misses unlisted transitive imports

```json
{
  "id": "WO-123-D017",
  "date": "2026-10-05",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board, without failing WO-123, a defect outside its criteria and declared surfaces. The installed harness runtime snapshot is keyed only by the hand-listed runtimeFiles in scripts/lib/harness.mjs:91-138. resident-state.js is listed and now imports vertical.js, which is not listed. Re-emitting therefore kept snapshot .runtime/harness/a883fdb19c420283 (created 2026-10-05T02:17Z): its resident-state.js matches the current build, but its vertical.js, vertical-host.js and verification-fold.js do not, while node scripts/harness.mjs check reports 32 current surfaces. verification-fold.js (WO-184) was already unlisted, so the limit predates this order. No hook failure was observed in this session, and the impact on a hook that folds intent events is unknown.",
  "evidence": [
    "cmp of .runtime/harness/a883fdb19c420283/packages/skeleton/dist/src/{vertical,vertical-host,verification-fold,resident-state,portfolio}.js against packages/skeleton/dist/src, run by the root verifier before its 2026-10-05T05:28:30Z usage readback: the first three differ; resident-state.js and portfolio.js are the same",
    ".claude/hooks/session.mjs imports harness-host.js from .runtime/harness/a883fdb19c420283",
    "scripts/lib/harness.mjs:91-138 lists resident-state.js and reactor.js but neither vertical.js nor verification-fold.js; runtimeSnapshot = .runtime/harness/<fnv1a64 of the listed paths and hashes>"
  ],
  "rejected": [
    {"option": "Fail WO-123 on it", "reason": "No WO-123 criterion or declared surface covers the harness runtime list, and the limit predates the order."},
    {"option": "Repair it in WO-123 through Adjacent Repair", "reason": "scripts/lib/harness.mjs is outside the order's declared surfaces and adjacent-0001's paths."}
  ],
  "followup": "Planner: nominate an order that keys the harness runtime snapshot on the full import closure of its listed files (or lists every transitive import and checks the list against that closure), so that harness check fails when an installed snapshot module differs from the build. Reproduction: build, then cmp the snapshot's vertical.js with packages/skeleton/dist/src/vertical.js while harness check passes.",
  "reopenWhen": "A hook fails or misbehaves on a stale transitive module, or an order lists or closes the runtime import set."
}
```

## WO-123-D018 — Repair the criterion-5 evidence and independent class check

```json
{
  "id": "WO-123-D018",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-001",
  "decision": "Separate the no-criterion and unresolved-decision refusals. Exercise the derivation's own NeedsHuman result with a decodable unavailable snapshot, and one open decision alongside an active criterion. Select baseline story class from supplied current-behavior observations; independently screen all active contract assertions for existing failures at the host boundary. A failing requirement classified as new stops with a finding before source work. Expand the bounded assertion vocabulary and keep modal/healthy negative controls. Preserve the existing primitive hosts, authority and event identities.",
  "misread": "The previous handoff called a malformed empty snapshot a derivation NeedsHuman fixture and a zero-criterion contract a one-ambiguity fixture. It also called a pure hand-supplied class contradiction proof of the production check.",
  "meant": "Criterion 5 requires the named branch in an executed composition fixture and an independent signal capable of contradicting baseline selection.",
  "changed": "The repair changes those fixtures, distinct refusal reasons, baseline class selection and its host consistency check; the handoff is rewritten after current checks.",
  "evidence": [
    "VER-001 F1-F3 and WO-123-D016",
    "vertical.ts combines the two contract checks and recognizes only a bounded subset of failure phrasing",
    "vertical-primitives.mjs selects story.kind from baselineClass; vertical-host.ts checks that same rule's selected kind",
    "StoryContract retains caller-supplied statement classes and their source spans; WO-180-D013 requires the composition to record and judge class source"
  ],
  "rejected": [
    {"option": "NoOp or waive criterion 5", "reason": "The missing evidence and silent walked-defect path would reach WO-112; repair is within the existing order and operator dispatch."},
    {"option": "Assign baseline kind from the safety text rule alone", "reason": "Its consistency check could never detect a conflicting supplied classification."},
    {"option": "Introduce another inference primitive or change StoryContract", "reason": "The supplied classes already provide the independent signal, and ambiguity stays a human decision."}
  ],
  "reopenWhen": "A composed failing-behavior contract reaches source work with story class new and no finding, or a fixture passes after removing the branch it claims to judge."
}
```

Mission and critical path: prevent a silently walked defect from reaching the
WO-112/WO-118 loop proof. Rule beating and drift to low performance require
branch-specific fixtures; seeking the wrong goal requires actual no-dispatch
and file assertions. Policy resistance keeps primitive refusals and the
independent class signal. Shifting the burden favors one bounded repair batch.
Commons and escalation favor one writer and focused checks before the required
gate. Success to the successful compares the supplied contract signal with the
current self-comparison rather than retaining it because it exists. Naive
Interventionism keeps the compiler and verification protocol unchanged. NoOp
retains the demonstrated publication hazard. D002's existing declined economy
experiment remains the sole experiment for this order; no new one is launched.

## WO-123-D019 — Preserve refusal provenance and retryable resident scheduling

```json
{
  "id": "WO-123-D019",
  "date": "2026-10-05",
  "dispatch": "resume: fix; adjacent-0002 revision 1",
  "decision": "Apply baseline non-reproduction only to completed admitted witnesses. Share the fold's admission and step-start scheduling predicates with the host. Recheck phase identity and generation after preparation, reuse an existing ledger decision, and treat a live continuation holder as no work this tick. Persist only intrinsic input holds; unknown preparation failures and scheduling changes leave the draft undecided. Cache in-flight authority observation until the resident log changes or an authority, human-idle or actor-heartbeat deadline is reached, retaining launch, kill-on-return, finish-on-return, revocation and expiry checks.",
  "evidence": ["VER-001 R1-R4", "resident-state.ts rejects unavailable, not-due and repeated admissions/step starts", "resident-host.ts observes changed stores or deciding deadlines instead of sampling every 20 ms", "WorkerStore preserves live-holder refusal and inspects dead holders before recovery"],
  "rejected": [
    {"option": "NoOp", "reason": "A stale phase can starve other work and transient failures can permanently consume an otherwise valid draft."},
    {"option": "Swallow log corruption or weaken the store lock", "reason": "Retryable scheduling must preserve the authoritative fold and single-writer refusal."},
    {"option": "Add a hold-release event or another scheduler", "reason": "Leaving transient conditions undecided and sharing existing predicates repairs the observed races with less state."},
    {"option": "Slow the authority polling interval", "reason": "It would delay return/revocation detection while retaining per-poll log growth."}
  ],
  "reopenWhen": "A scheduling race appends an event the fold rejects, a transient condition records IntentHeld, a blocked continuation prevents other ready work, or unchanged in-flight polls append samples."
}
```

The D018 mission and eight-lens comparison applies. The useful scheduling,
replay, lock and authority functions stay; the smallest useful probes are
concurrent-entry, re-arm, other-phase, retry and poll-count fixtures. No time or
token saving is claimed without measurement. Corrupt logs still refuse; the
retry policy applies to known scheduling races and live-holder contention.

The repaired composition passed 34 of 34 cases in 143.030 seconds
([composition-check-003.json](composition-check-003.json)). The polling fixture
performs 200 unchanged observations without adding a log byte and detects an
authority revocation appended through the same `ResidentStore` object. Its
cache therefore tracks the byte position it observed under the append lock,
rather than the store object's latest transaction position. A reached deadline
is not repeatedly sampled after its outcome is known. Real in-flight kill,
finish and revocation fixtures still exercise the transport.

## WO-123-D020 — Recover projections and isolate beacon identity refusals

```json
{
  "id": "WO-123-D020",
  "date": "2026-10-05",
  "dispatch": "resume: fix; adjacent-0002 revision 1",
  "decision": "Keep explicit beacon/source-change path identity refusals, stripping only pwd's output newline. A multi-worktree beacon sweep reports only the variant-spelled row as refused with its directory path; group-cache reads skip that row, and group emission uses the remaining metadata. Disposal and direct writes retain their single-root refusal naming the offending directory. Missing per-step receipt files are rebuilt from authoritative events on restore, using atomic projection replacement. Host-composed preparation refusals keep typed, text-free step/reason metadata; a dirty target is retryable. Fixtures assert the actual receipt/preparation/hold files, identity across restarts, an existing mode-000 directory, all completed-step SIGKILL boundaries and the missing-projection crash window. Record observed filesystem type, volume and case sensitivity.",
  "evidence": ["VER-001 R5-R8", "canonicalDestination is shared by directory guards, sweep, group-cache read/emit, disposal and provenance-key callers", "VerticalStepCompleted is fsynced before receipt-file projection", "publishTargetOrder preview returns after readiness, body generation and outward lint, before acquiring the publication lock or making remote calls"],
  "preview": "The vertical lint step calls publishTargetOrder with preview true to run the same candidate/readiness/body/outward checks before the publish step. The default remains false and follows the existing locked publication path; preview authorizes no push or PR.",
  "rejected": [
    {"option": "NoOp or accept whole-sweep refusal", "reason": "One operator-registered variant would hide unrelated healthy worktrees, and a recoverable projection crash would leave a required receipt missing."},
    {"option": "Canonicalize variant user inputs before checking containment", "reason": "It would weaken criterion 4's explicit spelling, intake and ignore refusals."},
    {"option": "Promote receipt files above the event log", "reason": "The durable events already bind progression; files are reconstructed readable projections."}
  ],
  "reopenWhen": "A variant input passes a guard, a refused row hides a healthy beacon, a canonical whitespace-ending directory is refused, or a completed event lacks its receipt file after restart."
}
```

This bounded batch advances the same critical-path loop. Policy resistance
keeps strict user-input guards while isolating multi-row readers; rule beating
uses real SIGKILL and file assertions; shifting the burden removes recurring
manual receipt repair. Commons and escalation favor one batch and the existing
gates. Drift and seeking the wrong goal retain evidence of terminal behavior,
not case counts alone. Success to the successful weighs the event-derived
projection against keeping an unrecoverable file write. Naive Interventionism
keeps codebooks, primitive protocols, the default publisher and provenance-key
handling. NoOp preserves the demonstrated regressions. B1 remains the separate
planner follow-up in D017; this batch changes no harness snapshot registry.

The same passing composition result records APFS on `/dev/disk3s5`, observed
case-insensitive, with case, volume and Unicode variants constructed. Mode-000
directories refuse; whitespace-ending directories pass the three identity
guards; broader writer request validation remains in force. A variant-spelled
Git registration produces one named beacon refusal while the healthy row and
group cache remain available. The SIGKILL driver kills after every one of the
14 completed steps and before the first receipt-file projection, then asserts
the unchanged earlier receipts, no repeated effect identity and all 14 files.
That driver uses pure execution ports; the production primitive composition
and resident restarts use the order's separate synthetic actor fixtures.

The first complete repair run passed 31 of 34 cases. Two old assertions still
expected a killed baseline to be rewritten as non-reproduction; the repair
preserves its actual `refused` result and named host-failure reason. The new
whitespace positive control also supplied a mount outside its changed parent
and invoked broader writer validation. It now exercises the identity guard
with a contained mount. The affected five-case rerun and the complete 34-case
run passed. Failed raw output remains in ignored local storage; no production
refusal, authority guard or protocol was weakened to pass these assertions.

Current authored-output review also found the R7 mixed-grant overstatement in
`packages/skeleton/README.md`. Adjacent-0002 revision 2 adds this named input
and aligns it with product 07 and the tested admission filter. Leaving two
different rules would mislead a store operator; this correction changes no
grant or publisher behavior. Git marks that README `dotln-documentation`,
outside the product gate's code identity. The document gate judges the revised
wording; the fresh feedback audit's judged source is unchanged.

The first repair document gate stopped at `docs-check`: this order's product
03 write-back exceeded its existing ceiling by 90 bytes, and nine dependent
tasks did not execute. The paragraph was tightened in place and the two
publication locks refreshed; no ceiling or requirement was changed.

## WO-123-D021 — Verification: fail on criterion 5; failure wording still walks to publication

```json
{
  "id": "WO-123-D021",
  "date": "2026-10-05",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Fail VER-002 on criterion 5 alone; criteria 1-4 and 6-8 are met, and F1, F2, R1 and the R2-R8 repairs hold except as WO-123-D022 records. F4: the F3 repair leaves ordinary failure wording inside VER-001's minimum categories classed new. baselineClass (packages/skeleton/src/vertical.ts:456-505) matches an error status only after return or respond, 'is not working' only uncontracted, can't and doesn't only with an ASCII apostrophe, and skips a failure verb whenever a modal appears earlier in the same sentence, including across a comma or colon. The primitive's selection (baselineStoryClass over supplied current-behavior observations) and the host check (baselineClass over every active statement) share that vocabulary, so a miss is silent on both sides: the run records story class new, host kind new, no finding and a walked baseline, then publishes a Deliverable-ready pull request. This is WO-180 D013's hazard, named in the order's Observed gap, and D018's reopening condition. Adjacent findings inside the order's declared surfaces, none contradicting another criterion: R9, the publication readiness requirement and host-run test evidence are not fixture-asserted, although the handoff says readiness is asserted; R10, requirements without a modal that mention an error, a status or a prohibition are held at baseline as 'contract names failing behavior but baseline was classed new', contrary to baselineClass's doc comment; R14, an unreadable beacon directory in one registered worktree aborts the whole beacon sweep with an error that no longer names the path.",
  "evidence": [
    "Root verifier probe DotLn session scratch root/composed.mjs (bounded, against the subject's own modules; outputs root/c1.out-c5.out, 2026-10-05T15:22Z): 'Login isn't working', 'Users see a 404 on the settings page', 'Login can’t complete' and 'This should be fixed, uploads fail for large files', each followed by ': make `fixture.txt` contain changed by synthetic worker.' and supplied as a current-behavior observation, give storyClass new, host classification new, findings [], outcome walked, 14 completed steps, 1 writer launch, 1 push, a body reading 'Deliverable-ready: ready; every applicable item is evidenced.' and terminal resolved. The control 'Login is not working' takes the defect path with outcome reproduced.",
    "Sub-verifier A (scratch A/class-probe.mjs and A/composed-probe.mjs, real compileStoryContract, baselineStoryClass and baselineClass): bare error statuses ('Users see a 404', 'Checkout shows HTTP 500'), 'isn't working', U+2019 'doesn’t' and 'can’t', 'threw', and 'fail' after an earlier modal across ':' or ',' are classed new by both functions in both statement classes. All 9 requirement statements without a modal that mention errors, statuses or prohibitions ('Show an error message…', 'Return a 404…', 'Add retry when the upload fails.', 'Guests cannot edit pages.' and others) are held with the classed-new finding; a composed 'Show an error message when the upload exceeds 10 MB' requirement stops NeedsHuman at baseline with 0 launches.",
    "Sub-verifier A mutations in a scratch copy: removing the derivation NeedsHuman branch or changing its reason, and removing the open-decision need, each fail the admission negative test (F1, F2 hold). Replacing baselineStoryClass with the self-comparison fails the composed baseline cases (F3's independence holds for the matched vocabulary). Removing R1's completed-result gate fails the kill, revoke and failed-baseline tests. Setting requireDeliverableReady false at scripts/lib/vertical-primitives.mjs:346 passes the full vertical suite 34/34 (153.8 s), and a fabricated test-evidence id with readiness off also passes. The root verifier read the only readiness assertion, /Deliverable-ready/ at scripts/test-vertical.mjs:234-237, which matches the heading scripts/lib/github-body.mjs:770 always emits.",
    "Sub-verifier C (scratch C/p7-eacces-row.mjs and C/p7-head.mjs): mode 000 on one registered worktree's beacon directory makes sweepControlBeacons throw 'spawnSync /bin/pwd EACCES' for the whole set; HEAD's modules threw 'EACCES … scandir <path>'. The root verifier read packages/beacons/src/control-beacon-fs.mjs:98-114, which isolates only BeaconDirectoryIdentityError rows, and beacon-io.mjs:79-87.",
    "Criteria 1-4 and 6-8 rest on: the executor's npm test -- --review row at code identity ad11446bba857146997e8f26b19c4c9e45194b8a30f64c974cdf0098e868e99b (39 suites, 2026-10-05T14:34:56.489Z) and npm run test:docs rows at the same identity, equal to gateCodeIdentity at verification; untracked sources byte-equal to validation.json's hashes and last modified at 14:21:23Z, before the gate began; sub-verifier B's full rerun of node scripts/test-vertical.mjs (34/34, 149.8 s) and its real-primitive SIGKILL chain through runVerticalIssue (14 children, each killed after one durable step; resolved with 1 writer launch, 1 push, 1 PR and unique command ids); sub-verifier C's path-identity probe on APFS /dev/disk3s5, case-insensitive (84 checks, 0 failures, no worktree, branch or registration residue, canonical disjoint parent accepted) and its read-only authority, artifact identity, verification, feedback, console, harness and publication checks, all passing."
  ],
  "reopens": {
    "decisionId": "WO-123-D018",
    "observation": "A composed failing-behavior contract reaches source work with story class new and no finding: the operator-supplied current-behavior observation 'Login isn't working' is walked, published and resolved."
  },
  "goalAlignment": {
    "missionAndCriticalPath": "WO-112's live proof and WO-118's unattended run inherit this classification. A defect report in ordinary wording reaching publication without reproduction is the hazard the order exists to close.",
    "traps": "Rule beating weighs against passing on the literal vocabulary list while contractions, typographic apostrophes, bare statuses and comma-joined modals of the same categories walk. Seeking the wrong goal weighs against counting 34 passing cases as proof that defect stories never walk. Shifting the burden weighs against leaving the hazard to WO-112. Escalation and oscillation are bounded by judging the next repair only on the named categories in ordinary spellings; other wording is a follow-up. Drift to low performance is answered by executed composed runs. Policy resistance, the commons and success to the successful are unchanged by the verdict.",
    "naiveInterventionism": "The verifier edits no subject source; probes ran in DotLn session scratch and the fixtures' system-temp roots.",
    "noOp": "Passing would file a claim that F3 is repaired while an ordinary defect report publishes without reproduction."
  },
  "rejected": [
    {"option": "Judge criterion 5 met because the listed vocabulary and the four composed failureAsRequirement cases pass", "reason": "The clause is a contract that names a failing behavior and is classed new. A contraction, a typographic apostrophe, a bare error status and a comma-joined modal are ordinary spellings of the categories VER-001's F3 rule named as the minimum, and each reaches publication without a finding."},
    {"option": "Treat the missed spellings as outside criterion 5's declared set", "reason": "Each is inside a category VER-001 named. Wording outside those categories (time out, loses data, does nothing, won't, stopped working) is a follow-up here, not a failure."},
    {"option": "Fail criteria 1, 2 or 4 on R9-R14 or WO-123-D022's items", "reason": "Their clauses hold at the subject."},
    {"option": "Board R9, R10 or R14", "reason": "Each sits in the order's declared surfaces (vertical.ts, the composition fixtures, beacon-io.mjs and adjacent-0002's control-beacon-fs.mjs), so Adjacent Repair keeps them in this order."},
    {"option": "Repair during verification", "reason": "The verifier does not edit the subject it judges."}
  ],
  "followup": "WO-123 resume: fix. (F4) F3's rule stands: a contract whose active statements assert an existing failure is classed defect, or held NeedsHuman as unclassified, and is never silently new. Within the categories VER-001 named (fail/fails/failed/failing; throws or errors; 'is not working'; error statuses; can't/cannot/does not followed by any verb), every inflection and contraction is covered with ASCII and U+2019 apostrophes (isn't/aren't/wasn't working, doesn't, didn't, can't, threw). An error status counts wherever an active statement names one, not only after return or respond (a 404, HTTP 500, status 502, a 500 error). A modal suppresses only the clause it governs, not a failure verb in a later clause joined by a comma, colon or conjunction. A composed-run fixture per group asserts the defect class with its source and either the reproduction or the classed-new finding, with no launch, push or PR on the finding path. Wording outside these categories (time out, loses data, does nothing, won't, stopped working) is a recorded follow-up with a reopening condition, unless the repair holds an unrecognized active current-behavior observation as unclassified. (R9) A fixture fails when the publish step runs without requireDeliverableReady, and when delivery-preparation.json's tests names an id that is not a host-run evidence record of the order's named tests; the next handoff states readiness coverage as the fixtures establish it. (R10) A requirement-voice statement, such as an imperative ('Show an error message…', 'Return a 404…', 'Log errors…') or a conditional clause ('when the upload fails'), is not reported as naming existing failing behavior. Where requirement voice and a failure assertion cannot be told apart lexically ('Guests cannot edit pages.' against 'The client can't authenticate.'), a decision may accept the hold and name the recovery for a held draft; baselineClass's doc comment states the behavior. The R10 repair keeps every F4 case and the four failureAsRequirement composed cases on the finding path. (R14) In multi-row beacon readers (sweep, group read and emit), a row whose directory identity cannot be read is that row's refusal naming its directory, as identity-mismatch rows are; otherwise a decision accepts the whole-sweep refusal for this case, with a fixture. Single-root guards keep refusing. Checks: node scripts/test-vertical.mjs, npm test -- --review, npm run test:docs, and a fresh live feedback episode if a judged source changes (criterion 7). Alternative to F4: the operator waives criterion 5 with npm run resume -- waive 5, naming their words.",
  "reopenWhen": "A repair settles F4 or the operator waives criterion 5; a repair changes which statements the baseline classes defect; or a later run records a defect story as walked."
}
```

## WO-123-D022 — Verification: resident preparation starves on an undecodable issue

```json
{
  "id": "WO-123-D022",
  "date": "2026-10-05",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Record three adjacent findings on the resident path inside the order's declared surfaces; none fails a criterion. R11: an intent whose issue source cannot be decoded or is incomplete is retried on every tick without a record, and every later draft is starved. vertical-resident.ts:152-154 returns false for any error that is not a non-transient IntentPreparationRefusal, while fetchIssueBundle and requireCompleteIssueBundle throw IssueSourceRefusal, and :138-140 picks the first undecided draft on every tick. At checkpoint 3 the same failure was a durable hold. R3's rule names decode among the intent's own inputs whose holds are durable. R12: the resident log grows on every tick in proportion to the intents ever admitted, because each tick replays a VerticalHost for every admitted intent, including authority-expired ones, and each replay's settlement samples the clock. R13: no fixture isolates the admission guard (intentAdmissionReady), and the durable-hold fixture asserts step and reason only partly. R2's raced cases, R3's transient and intrinsic holds otherwise, and R4's in-flight polling hold.",
  "evidence": [
    "Sub-verifier B probe1.mjs part B (scratch B/probe1.out): a real IssueSourceRefusal ('issue source read refused: $.data.repository.issue.comments.nodes[0].updatedAt: required field absent') gives 12 resident ticks returning false, 12 fetches of issue 1, 0 of issue 10, intents {} and only ClockSampled and ActorUnavailable events. The root verifier read vertical-resident.ts:132-160, scripts/lib/vertical-runtime.mjs:300-316 and packages/skeleton/src/github-issue-source.ts:750-760, and checkpoint 3's vertical-resident.ts:141-149, which held such a failure as 'intent preparation could not be decoded or read'.",
    "Sub-verifier B probe2.mjs (scratch B/probe2.out), with one admitted intent: ResidentHost alone appends 1 ClockSampled per tick; with the vertical idle, 2 per tick (302 B); after the intent's authority expired, 3 per tick (471 B), unchanged after presence returned. The root verifier read vertical-resident.ts:51-131 and vertical-scheduling.ts:109-121.",
    "Sub-verifier B probe5.mjs: with mutation M1 (intentAdmissionReady removed at vertical-resident.ts:170) the targeted transient, other-phase, racing and polls tests still pass. A revocation during preparation then throws 'intent admission outside the current resident phase' (B/probe5-M1.out), where the subject returns false with no event (B/probe5-none.out). The root verifier read the durable-hold fixture at scripts/test-vertical.mjs:697-778: the portfolio and grants modes assert only the IntentHeld count, and the screen mode asserts its step but no reason.",
    "Holding repairs, from sub-verifier B: (R2) a run bound to a left phase no longer consumes every tick, so another draft is admitted and runs; racing entries and a re-armed phase do not throw; corrupt logs, out-of-phase step starts, repeated admissions and store identity drift still throw. (R4) over 1,500 ms of in-flight polling, 0 events are appended in 3 runs; revocation, presence return and expiry kill the child within 42-74 ms. Mutations that always return true, drop the step-start guard, rethrow the live-holder error or sample on every poll each fail their test."
  ],
  "reopens": {
    "decisionId": "WO-123-D019",
    "observation": "One draft whose issue source cannot be decoded prevents every later draft's preparation: 12 ticks, 12 fetches of issue 1, 0 of issue 10, no record."
  },
  "rejected": [
    {"option": "Fail criterion 1 on R11", "reason": "Criterion 1's negative set names an undecodable draft or entry, and both still record IntentHeld. The issue source's refusal is outside that set but inside the declared surfaces, so it goes to Adjacent Repair."},
    {"option": "Hold every unknown preparation error durably", "reason": "D019's retryable conditions (presence change, re-arm, live holder, dirty target) remain correct. The defect is that the intent's own decode input is treated as unknown, and that one draft starves the rest."},
    {"option": "NoOp", "reason": "One malformed issue would silently stop all intent admission in WO-118's unattended run."}
  ],
  "followup": "WO-123 resume: fix, with WO-123-D021. (R11) A failure of the intent's own inputs, including the issue source's decode, completeness or screen refusal (IssueSourceRefusal from fetchIssueBundle or requireCompleteIssueBundle), is a durable IntentHeld with its step and a text-free reason, as draft, entry and grant decode failures are. Only a named set of transient conditions stays undecided. Its retry is bounded, backed off or visible in a record, and a draft that cannot be prepared does not stop later undecided drafts from being prepared. Products 07 and 03 state the result. (R12) A terminal or authority-expired continuation is not replayed and settled on every tick. Settlement appends only when an IntentStepSettled is missing, so appends per idle tick do not grow with the number of intents ever admitted. (R13) A fixture interrupts preparation with a change that leaves the resident generation unchanged (a revocation or a dispatch hold) and asserts false, no event and no throw. The durable-hold fixture's screen, portfolio and grants modes assert their expected step and reason.",
  "reopenWhen": "A repair settles R11-R13; a decode refusal of an intent's own input leaves its draft undecided; or one draft that cannot be prepared prevents another draft's preparation."
}
```

## WO-123-D023 — Read failure assertions clause by clause, and requirement voice as no assertion

```json
{
  "id": "WO-123-D023",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-002",
  "decision": "Replace the single sentence-scoped pattern in baselineClass with a clause-scoped rule that both the selection (supplied current-behavior observations) and the host check (every active statement) share. A cue asserts existing failure: the fail family with its noun, the throw, error and crash families, a negative auxiliary (does/do/did/could not, cannot, can't, with either apostrophe, with or without a following verb), 'not working' in full or contracted, a broken state, and an HTTP error status wherever a statement names one (after HTTP, status, code or error; before error, status, response, page or code; or after an article or a reporting verb when no counted noun or unit follows). A cue is not an assertion when its own clause negates it or puts it in requirement voice. Clauses end at a comma, colon, semicolon, dash, parenthesis and at and, or, nor, but, yet, so, because, however, although, though, whereas. Requirement voice is a modal earlier in the same clause; in a requirement-class statement, a clause that opens with a listed imperative or a negative imperative at the start of a sentence, after a colon, or after another imperative or a leading condition; a condition (when, if, unless, once, in case) attached to such a clause; and a bare base-form verb or status that shares the previous clause's modal after and, or, nor or a comma. An imperative keeps its finite cues ('Update fails on Windows'). A clause that asks for a fix or repair always asserts. A statement the contract classes as a current-behavior observation never gets the imperative reading. The suppression vocabulary is not widened: the modal list is unchanged, and need to, have to and want stay out because the same words phrase defect reports.",
  "recovery": "A requirement the rule cannot tell from an assertion is reported as 'contract names failing behavior but baseline was classed new' and stops at baseline before any worker. That stop is permanent for the draft and its run. The operator rewords the issue in requirement voice or classes the statement as a current-behavior observation in vertical.json, files a new intent and binds its draft, revision and classifications; the refiled draft is admitted under a new key and the held run is unchanged. A composed fixture executes this path.",
  "acceptedHolds": [
    "a prohibition written as a plain statement: 'Guests cannot edit pages.'",
    "a present-tense description that names an error or status: 'The API returns 404 for unknown ids.'",
    "an imperative whose opening verb is not in the listed set, or a want, need to or have to sentence, when it carries a cue"
  ],
  "evidence": [
    "VER-002 F4 and R10, WO-123-D021",
    "Bounded probe of 107 statements against the built baselineClass (DotLn session scratch class-probe.mjs): the 17 earlier cases, VER-002's quoted spellings in both statement classes, unquoted spellings of the same categories, R10's quoted requirements and numeric, negated and healthy controls; 0 mismatches after two corrections found by the fixtures (a bare verb after 'but' was read as an imperative; a status after a shared reporting verb was not shared)",
    "scripts/test-vertical.mjs 'exact issue identity, phase resource caps and baseline classification' holds the table; eleven composed baseline runs assert the class, both sources and either the reproduction or the finding with no launch, push or pull request; two composed runs walk requirement-voice wording with no finding; one composed run holds 'Guests cannot edit pages' and recovers through a refiled draft",
    "Mutations, each restored and re-hashed (scratch mutate.mjs): an ASCII-only apostrophe fails 3 of 12 classification and composed cases; a sentence-scoped modal fails 2 of 12; asserting every imperative cue fails 3 of 3"
  ],
  "rejected": [
    {"option": "NoOp or waive criterion 5", "reason": "An ordinary defect report would still publish without reproduction in WO-112's and WO-118's runs."},
    {"option": "Add alternations to the one pattern", "reason": "A sentence-scoped modal check cannot limit a modal to its clause, and one pattern cannot separate requirement voice from an assertion; VER-002 found both."},
    {"option": "Hold every current-behavior observation the rule does not recognize as unclassified", "reason": "A healthy context statement ('The button is blue.') would stop every story that carries one."},
    {"option": "Add time-outs, lost data, 'won't' and 'stopped working' now", "reason": "They are outside the categories VER-001 named and each widens the surface on which requirement wording is held; recorded as the follow-up."},
    {"option": "Treat need to, have to and want as requirement markers", "reason": "'I have to reload when it crashes' and 'I want to report that uploads fail' are defect reports; suppressing them would walk a defect silently."},
    {"option": "Class wording the rule cannot tell apart as new", "reason": "The cost of a wrong hold is a refiled draft; the cost of a wrong walk is a published change with no reproduction."},
    {"option": "A model or a new inference primitive", "reason": "The order adds no primitive, and the supplied statement classes remain the first signal."}
  ],
  "followup": "Planner: decide whether the baseline class needs failure wording outside the families this rule reads (a timeout, lost or missing data, 'does nothing', 'won't', 'stopped working', 'no longer works', an exception or error class named without a verb), and whether an active current-behavior observation the rule cannot class should be held as unclassified instead of read as new. Reproduction: baselineClass over a single current-behavior observation 'The export times out.' returns new. Also weigh the one accepted miss inside the families: a requirement-class statement that opens with a listed imperative word used as a noun and whose only cue is a noun or base form ('Log errors on rotate.') reads as an imperative.",
  "reopenWhen": "A composed contract whose active statement asserts failure in the families above reaches source work with story class new and no finding; an imperative, modal or conditional requirement is reported as failing behavior; or a held draft cannot be recovered by a refiled draft."
}
```

Mission and critical path: the classification decides whether WO-112's and
WO-118's runs reproduce a defect before changing it. Rule beating and drift to
low performance: the table is mutation-checked and each group has a composed
run, so the vocabulary cannot pass without the behavior. Seeking the wrong
goal: the measure is that no failure assertion in the named families walks,
not the count of cases. Policy resistance and fixes that fail: R10's false
holds and F4's misses pull in opposite directions, so the rule suppresses only
on positive requirement-voice evidence and reports the rest. Escalation: the
vocabulary stays inside the categories VER-001 named, with the remainder a
recorded follow-up. Shifting the burden: a wrong hold costs the operator one
refiled draft, named above and executed in a fixture. Commons: one pure
function, no new module, registry row or gate. Success to the successful: the
existing pattern was replaced, not extended, because its scope was the defect.
Naive Interventionism keeps the supplied observation classes, the independent
host check, the finding text and the baseline primitive unchanged. NoOp leaves
the publication hazard. D002 remains the order's one economy experiment.

## WO-123-D024 — Decide the intent's own inputs, back off the read's conditions, and leave finished work alone

```json
{
  "id": "WO-123-D024",
  "date": "2026-10-05",
  "dispatch": "resume: fix; adjacent-0003 revision 1",
  "decision": "A refusal of the intent's own inputs is a durable IntentHeld: the draft, the entry, the grants, and now the issue source's decode ('issue source cannot be decoded'), completeness ('issue source is incomplete') and screen refusal, each with its step and a fixed reason that carries no source detail. The named transient set stays undecided: an unavailable forge, an issue changed during the read, an unavailable bundle store, an unclean target and an unreadable target, beside the scheduling changes and live holders WO-123-D019 named. An undecided draft is retried after a delay that doubles from 1 s to 5 min on the resident clock, and the same tick goes on to the next undecided draft. A failure outside the named set is retried twice and held at its third consecutive failure with a fixed reason, so one flicker burns no draft and nothing is retried silently without bound. A continuation runs in a tick only when its step can start, resume or settle, or its expiry stop is unrecorded; a continuation seen terminal is not run again by that process; a settlement is appended only when it is missing. An idle tick therefore appends its one clock sample whatever the number of intents ever admitted. The operator entry records the same durable issue-source holds and returns a transient condition to the operator without a record.",
  "limits": "The delay and the set of finished continuations are process memory: a restarted resident retries at once and replays each continuation at most once, when its step would next be due. The vertical tick's own clock sample and the resident host's remain, one each per tick. No resident event, state field or fold rule was added.",
  "evidence": [
    "VER-002 R11-R13, WO-123-D022",
    "scripts/test-vertical.mjs: the durable-hold fixture asserts step and reason for the screen, undecodable-issue, portfolio and grants modes; 'an undecodable issue is held once and a later draft is still prepared and admitted' drives the forge double's own IssueSourceRefusal (code input) through ResidentHost: fetches [1, 10], one IntentHeld, draft 10 admitted, where VER-002 observed 12 fetches of issue 1 and none of issue 10",
    "'an unpreparable draft backs off, is bounded when its failure is unnamed, and never starves a later draft': the later draft is admitted in the first tick; the blocked one is retried only at +1 s and +3 s; the named condition records nothing; the unnamed one records one IntentHeld at its third failure and the thrown text is absent from the log",
    "'an idle resident tick appends one clock sample however many continuations finished or expired': for no intent, a resolved one, an expired one and both, every idle tick appends exactly one ClockSampled and opens no execution port; after a restart each continuation is replayed at most once",
    "Bounded probe through ResidentHost (DotLn session scratch idle-host-probe.mjs, 2026-10-05T16:37:27Z): with one terminal continuation, each of eight idle host ticks appends two ClockSampled events, the vertical's and the host's, where VER-002 measured three per tick after an expiry",
    "'transient preparation revoke': a revocation during preparation changes no presence generation and the tick returns false with no event",
    "Bounded probe of the operator entry (DotLn session scratch operator-hold-probe.mjs, 2026-10-05T16:30:09Z; no fixture asserts this): an unavailable forge returns NeedsHuman 'issue source is unavailable' with no IntentHeld; an undecodable issue records IntentHeld with entry operator, step bundle and 'issue source cannot be decoded'; the same draft returns that hold after the issue is corrected, with no launch",
    "Mutations, each restored and re-hashed: without the terminal memory, with a sample on every settlement replay, without intentAdmissionReady, with the decode refusal marked transient, and with a return in place of the move to the next draft, the named fixtures fail (1 of 1, 1 of 1, 1 of 1, 3 of 3, 1 of 1)"
  ],
  "rejected": [
    {"option": "NoOp", "reason": "One malformed issue would stop all intent admission in an unattended run, and the ledger would grow with every intent ever admitted."},
    {"option": "Hold an unnamed failure on first sight", "reason": "VER-001 R3 found that a single preparation exception must not consume a draft."},
    {"option": "Retry an unnamed failure without bound", "reason": "VER-002 R11 found the silent, recordless retry; three attempts then a visible hold bounds it."},
    {"option": "A resident event for each deferral, or a terminal marker in resident state", "reason": "Either changes the fold of a judged source and adds an event per failure or per continuation; process memory needs neither. Reopen below if restart replay becomes material."},
    {"option": "Drop the tick's own clock sample", "reason": "Expiry, due and backoff decisions would read the previous tick's clock."},
    {"option": "Pass the issue source's message through as the reason", "reason": "It can carry a field path or source detail; the code is recorded as a fixed reason instead."}
  ],
  "changes": "WO-123-D019, which WO-123-D022 reopened, left every unknown preparation failure undecided. An issue-source decode refusal is now a decision, the retryable conditions are a named set, and an unnamed failure is bounded. D019's other rules stand.",
  "reopenWhen": "A refusal of an intent's own input leaves its draft undecided; a named transient condition records IntentHeld; one draft that cannot be prepared prevents another's preparation; an idle tick's appends vary with the number of admitted intents; or the per-restart replay of finished continuations becomes a measured cost."
}
```

The D023 mission statement applies: WO-118's unattended resident inherits
this path. Policy resistance: VER-001 R3 (do not burn a draft on a flicker)
and VER-002 R11 (do not retry without record) are both held by bounding only
the unnamed case. Commons and drift: per-tick work and ledger growth no longer
scale with history. Rule beating: each rule has a fixture a mutation fails.
Shifting the burden: a held draft is visible and refiled once; a transient one
needs no operator. Escalation and Naive Interventionism: no event type, fold
rule, lock or gate changed, and corrupt logs, drift and `drafts()` failures
still refuse as D019 decided. NoOp keeps the starvation.

Correction, same day: this decision was first filed with a `reopens` object
naming D019. That field records a new reopening observation, and D022 had
already recorded this one; D024 is its repair. The field was replaced with
`changes` before any gate ran. The follow-up register's row for D019
(FUP-292495966f229bc6) keeps the two sync revisions this produced; its current
revision equals the one before.

## WO-123-D025 — Assert readiness where it is enforced, and name an unreadable beacon row

```json
{
  "id": "WO-123-D025",
  "date": "2026-10-05",
  "dispatch": "resume: fix; adjacent-0003 revision 1",
  "decision": "R9: two composed runs change delivery-preparation.json after the preparation step, one removing it and one replacing its test references with an id that names no evidence; each must stop refused at lint with no publish step, push or pull request. The passing composition asserts the sentence 'Deliverable-ready: ready; every applicable item is evidenced.' instead of the heading the body always emits, and that every referenced test is a live, passing, host-origin record of the named command at the delivered revision. No production code changed for R9. R14: BeaconDirectoryIdentityError carries its reason; an identity the guard cannot read raises it as 'directory identity cannot be read' naming the directory, in place of the bare spawn error. The sweep reports a row whose directory identity or listing cannot be read as that row's refusal with its directory and reason and still sweeps the other rows; the group read skips such a row; group emission sweeps the same way. Single-root guards (validation, emission, disposal, session mounts) keep refusing, and now name the directory.",
  "evidence": [
    "VER-002 R9 and R14, WO-123-D021",
    "scripts/test-vertical.mjs 'publication requires deliverable readiness': the absent case refuses with 'No unresolved material ambiguity; Tests/build/lint; Monitored loop' absent and the fabricated case with 'Tests/build/lint' absent, both at lint; with requireDeliverableReady set false both fail (mutation, restored)",
    "scripts/fixtures/vertical/path-identity.mjs: on a second registered worktree, a mode-000 public directory gives one refusal 'directory identity cannot be read' with its path; a searchable but unlistable directory (mode 0300) and a sealed .control-beacons parent give 'directory cannot be read'; the healthy row is swept, the constellation prints the path, the group read does not throw, validateBeaconDirectory refuses naming the directory, and emitting into a sealed groups directory refuses naming it. With the typed error replaced by the bare spawn error the fixture fails (mutation, restored)",
    "packages/skeleton/dist/test/beacon-fs.test.js and control-beacon.test.js: 18 of 18"
  ],
  "rejected": [
    {"option": "NoOp for R9", "reason": "The handoff claimed readiness coverage that a mutation removing the requirement survived."},
    {"option": "Accept the whole-sweep refusal by decision", "reason": "One unreadable worktree would hide every healthy one, the same harm R5's row refusal removed."},
    {"option": "Swallow every sweep error as a row refusal", "reason": "Only an unreadable or variant-spelled directory is that row's condition; other errors still refuse the sweep."}
  ],
  "reopenWhen": "A composition publishes without the readiness requirement or with a test reference that is not host-run evidence while the suite passes; an unreadable beacon directory aborts a multi-row read or is reported without its path; or a single-root guard passes a directory whose identity it cannot read."
}
```

The same mission applies: readiness is the last check before a remote effect,
and the beacon sweep is how an operator sees every worktree at once. Rule
beating: both rules are mutation-checked. Naive Interventionism: R9 adds
assertions only, and R14 changes which error a refusal carries, not what
refuses. NoOp leaves an unasserted requirement and an unnamed refusal.

## WO-123-D026 — Verification: ordinary status labels and modified negative predicates still walk

```json
{
  "id": "WO-123-D026",
  "date": "2026-10-05",
  "dispatch": "resume: verify; VER-003",
  "kind": "finding",
  "decision": "Fail VER-003 on criterion 5 alone. F5 (high): ordinary spellings inside the existing error-status and not-working families still evade both baseline selection and the host check. 'The endpoint returns status: 500', 'The response status = 500' and 'Login isn't actually working' are silently new, with no finding and a walked baseline; composed runs publish a Deliverable-ready body and resolve. The colon splits the status label from its number before failureCues reads the clause, STATUS_LABEL admits no equals separator, and NOT_WORKING requires working immediately after the negative auxiliary. The same lexical rule underlies both signals, so different statement-class inputs do not catch these shared misses. R15 (medium, adjacent): 'No errors are thrown' is healthy negated wording but is reported as an existing failure. The error noun is suppressed; the later thrown cue ignores the negated subject. A requirement-class composed run holds NeedsHuman at baseline with no worker. Criteria 1-4 and 6-8 are met; the earlier quoted cases, readiness checks, issue-source holds, scheduling controls and beacon-row isolation pass. The wider vocabulary and accepted noun/imperative ambiguity remain D023's separate planner follow-up; B1 remains D017's boarded item.",
  "evidence": [
    "Independent direct classification probe against the current built vertical module, 2026-10-05T16:51:43.065Z: status: 500, HTTP status: 500, status = 500, isn't actually working and is not currently working each give host kind new, selected kind new and findings [] in both supplied statement classes. Controls status 500, a 404, isn't working and fail give host kind defect; a requirement-class failure gives the classed-new finding. No errors are thrown gives host kind defect in both classes; never throws errors, passes with no errors and the button is blue give new.",
    "The operator asked during this verification whether criterion 5 is feasible and why it repeatedly fails. Assessment from VER-001 through VER-003 and the current source: the review, readiness, derivation and ambiguity obligations now pass; remaining failures share one lexical classifier used for selection and host checking. A further wording patch does not by itself remove that shared false-negative mode. An explicit reviewed story-kind input or a conservative unresolved-classification hold is a design alternative for the repair to assess; this question authorizes no implementation change or criterion amendment.",
    "Independent resident composed probe, 2026-10-05T16:55:53.666Z: current-behavior observation 'The endpoint returns status: 500: make `fixture.txt` contain changed by synthetic worker.' records storyClass new, host kind new, findings [], outcome walked, all 14 steps, one worker launch, one local fixture push, one fixture PR creation, the exact Deliverable-ready ready sentence and terminal resolved. The synthetic Git actor redirects the target URL to a local bare remote; the forge actor is a process double.",
    "Corrected operator composed probe, bounded exit 0, 49.940 seconds, 2026-10-05T16:58:08.634Z: requirement-class status: 500, observation-class isn't actually working and requirement-class status = 500 each record the same walked/new/no-finding result, all 14 steps, one worker, one local push, one fixture PR and terminal resolved. Each run advances the fixture clock between single-step resumptions. The status 500 observation control reproduces at baseline; the No errors are thrown requirement stops NeedsHuman at baseline with zero workers, pushes and PRs.",
    "The first three exploratory operator runs used a constant clock and stopped at lint because baseline.occurredAt equaled implementation.startedAt. scripts/lib/github-body.mjs requires baseline.occurredAt < implementation.startedAt. These runs establish no classification defense; the corrected probe advances time and reaches publication. Earlier raw outputs remain in session scratch.",
    "Root verifier rerun of node scripts/test-vertical.mjs: 49 passed, 0 failed, 211.339 bounded seconds, completed 2026-10-05T16:51:33.092Z. All case, volume and Unicode variants were constructed on case-insensitive APFS /dev/disk3s5. The suite includes readiness tampering, durable issue-source holds, retry bounds, admission revocation, idle history, unreadable beacon rows and SIGKILL at all completed-step boundaries.",
    "Source/checkpoint probe: all 17 hashes in validation.json match the current authored bytes and checkpoint WO-123/10; code identity c21128ff6ff619a84e57b69b837d0d4229df0aaaad921324272994bf6f84569a matches the executor's complete npm test row (39 suites, 89 fresh tasks, exit 0, 2026-10-05T16:27:08.125Z). Independent revision-004 authority, artifact identity, verification and feedback checks, console, harness, publication and git diff --check all passed at 2026-10-05T16:58:25.114Z; feedback reports that the live episode judged the current source."
  ],
  "reopens": {
    "decisionId": "WO-123-D023",
    "observation": "An existing-failure assertion inside the declared families reaches source work and publication with story class new and no finding: the resident walks status: 500 and resolves, and the operator walks both punctuated status labels and isn't actually working."
  },
  "goalAlignment": {
    "missionAndCriticalPath": "WO-112 and WO-118 inherit this composition. The order's baseline is meant to distinguish an existing failure from new work before a source worker and publication; F5 defeats that boundary and R15 burdens a healthy draft with a false hold.",
    "traps": "Policy resistance keeps the independent supplied classes and existing hosts. The commons favors one writer and bounded sequential probes. Drift to low performance and seeking the wrong goal require terminal outcomes, not 49 passing cases alone. Escalation keeps this repair inside the existing error-status, not-working and negated-failure families. Success to the successful does not preserve a shared lexical miss because the same rule supplies two checks. Shifting the burden names one repair and recovery for the false hold. Rule beating rejects treating punctuation and an ordinary adverb as different failure categories.",
    "naiveInterventionism": "The verifier edits no implementation, contract, product ceiling or historical report. Consume the matching product gate and rerun the focused composition; record the remaining defects for the authorized repair role.",
    "noOp": "A pass would carry reproduced publication without baseline reproduction into the live successor and leave the healthy false hold undocumented."
  },
  "rejected": [
    {"option": "Pass because the 49 existing cases and VER-002's literal examples pass", "reason": "The independent composed runs violate criterion 5 using ordinary spellings inside its already named families."},
    {"option": "Treat increasing regex coverage as evidence of a reliable classification boundary", "reason": "The same vocabulary still supplies both checks. The next repair must explain its boundary and remaining uncertainty, comparing explicit reviewed classification or an unresolved-classification hold before choosing another wording patch."},
    {"option": "Board F5 with the wider vocabulary in D023", "reason": "A status label separator or an adverb in not-working does not add a timeout, lost-data or other new family."},
    {"option": "Fail another criterion on R15", "reason": "The declared holds and terminal paths still work; this additional false hold is an adjacent defect inside vertical.ts."},
    {"option": "Treat the constant-clock lint refusals as protection against F5", "reason": "The readiness timestamp check caused those refusals; advancing time removes them without changing the failure wording."},
    {"option": "Repair the rule during verification", "reason": "The verifier judges the recorded subject and routes implementation changes to resume: fix."}
  ],
  "followup": "WO-123 resume: fix. (F5) Preserve D021/D023's rule: an active existing-failure assertion inside the declared families is selected defect or held with the classed-new finding before source work, never silently new. Cover HTTP/status/code labels separated from a 4xx or 5xx value by ordinary colon or equals punctuation, without losing label context at clause splitting, and a negative not-working predicate with an ordinary intervening adverb (isn't actually working; is not currently working). Keep ASCII and U+2019 contractions, healthy, modal, imperative and conditional controls. Add composed cases in both supplied statement classes, with advancing time; assert class and source, reproduction or a baseline finding, and zero worker, push and PR on the finding path. (R15) A passive predicate with a negated failure subject such as No errors are thrown must not assert existing failure; preserve positive errors-are-thrown and earlier negated controls, and execute a healthy requirement without the false baseline hold. Keep D023's accepted ambiguity recovery and separate wider-vocabulary follow-up. Checks: node scripts/test-vertical.mjs, npm test -- --review, npm run test:docs and a fresh live feedback episode after any judged-source edit (criterion 7).",
  "reopenWhen": "The repair settles F5 and R15; an existing-failure assertion in these families silently walks again; or a negated healthy statement is reported as an existing failure."
}
```

## WO-123-D027 — Preserve status units and predicate polarity within the declared families

```json
{
  "id": "WO-123-D027",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-003",
  "decision": "Keep the supplied StoryContract classes as the reviewed selection input and the host's existing classed-new finding. Repair the bounded lexical check structurally: a labeled HTTP 4xx/5xx status, including colon or equals separators, is one unit whose internal punctuation cannot break its clause; a negative working predicate admits intervening adverbs; a negated failure subject retains its polarity through a passive predicate. Preserve clause-local modal, imperative and conditional controls. Exercise both supplied classes, advancing time between composed steps, and include status-code and adverb examples VER-003 did not quote. This repairs the named language families; it is not a general semantic classifier.",
  "evidence": [
    "VER-003 F5 and R15, WO-123-D026: independently composed failures publish without reproduction and a healthy passive statement falsely holds",
    "packages/skeleton/src/vertical.ts failureCues/assertsExistingFailure: CLAUSE_BREAK splits a colon, STATUS_LABEL reads only the number's preceding clause text, NOT_WORKING requires adjacency, and NEGATED cannot carry subject negation to thrown",
    "scripts/lib/vertical-primitives.mjs selects baselineStoryClass from supplied observations; vertical-host.ts independently checks all active statement classes with baselineClass",
    "scripts/test-vertical.mjs already pins imperative/modal/conditional controls, accepted ambiguity recovery and zero later effects on a baseline finding",
    "D002 was read before repair and remains the order's sole economy experiment: declined, kept-current, no measured saving",
    "Adjacent-0004 revision 1 records the diagnosed cause, concrete repair, named paths, checks, announcement and actor-attested steering boundary"
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "WO-112 and WO-118 consume this baseline boundary. Their runs must reproduce an existing defect or stop before source work while healthy requirements remain usable.",
    "traps": "Policy resistance compares failure and healthy controls together. The commons uses one writer and sequential bounded probes. Drift to low performance preserves the reproduction standard. Escalation adds no input, primitive or gate. Success to the successful explicitly compares replacing the classifier's authority with a reviewed story-kind input. Shifting the burden repairs passive false holds rather than requiring rewording those healthy statements. Rule beating checks class sources and source/push/PR effects, not case counts alone. Seeking the wrong goal measures the baseline boundary needed by the successors.",
    "naiveInterventionism": "Preserve the existing contract, reviewed supplied classes, primitive witness and ambiguity recovery. Make the language repair reversible in vertical.ts and judge the smallest composed boundary before the required complete gate.",
    "noOp": "VER-003's publication without reproduction and healthy false hold persist. Both contradict the intended baseline behavior, so inaction loses."
  },
  "rejected": [
    {"option": "Add an explicit reviewed story-kind field in this repair", "reason": "It could improve selection for wording the lexical rule misses, but a new input alone would not detect a contradicting failure statement: criterion 5 still needs the host check. The current supplied classes already provide reviewed selection and the independent contradiction path. A new per-story protocol and its resident/operator migration are a broader design choice; reopen under D023's existing planner question if the bounded classifier cannot support the intended vocabulary."},
    {"option": "Hold every observation with no recognized failure as unresolved", "reason": "Healthy context such as The button is blue would hold ordinary new stories. There is no explicit unresolved story-kind producer distinguishing that context from an unrecognized failure. Keep D023's planner question rather than silently replacing healthy-new behavior."},
    {"option": "Add only VER-003's literal phrases to a regex", "reason": "That leaves internal label punctuation, modifier adjacency and passive subject polarity as the causes. Use complete status units, an adverb grammar and passive polarity instead, with unquoted cases and controls."},
    {"option": "Broaden to timeouts, missing data or the accepted noun/imperative ambiguity", "reason": "Those remain D023's separately recorded planning choice and are not the language families F5/R15 reopen."}
  ],
  "limits": "Selection and host checking still share the lexical parser. Different supplied classes expose a contradiction when the parser recognizes failure, but do not eliminate shared false negatives outside its bounded grammar. D023's broader vocabulary and unresolved-classification planning question remains open; this repair claims the executed families and controls, not unrestricted English understanding.",
  "reopenWhen": "A composed active assertion in the declared families silently walks again, a healthy control falsely holds, or planning supplies a reviewed story-kind/unresolved-classification contract."
}
```

## WO-123-D028 — Correct the queue check-in's elapsed-time claim

```json
{
  "id": "WO-123-D028",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-003",
  "decision": "Correct the unsupported elapsed-time sentence in adjacent queue sequence 31 through a new canonical check-in; preserve the append-only original event.",
  "misread": "The executor wrote more than 60 seconds without checking the queue timestamps.",
  "meant": "Sequence 30 was recorded at 17:13:07.698 UTC and sequence 31 at 17:13:36.712 UTC: 29.014 seconds. No operator steering message is present in this conversation; no inbox readback is claimed.",
  "changes": "Sequence 33 explicitly corrects that interval and records the present boundary and unchanged running item. The correction was stated in chat on the same day. No implementation or check result was discarded.",
  "evidence": ["Read-only timestamp extraction from docs/control/local/adjacent-work.jsonl for WO-123 sequences 29-32", "npm run adjacent -- apply --file .runtime/wo123/repair-005/check-in-correction.json exited 0"],
  "rejected": [{"option": "Edit sequence 31 or leave the overstatement", "reason": "The operational record is append-only and its elapsed-time claim was unsupported."}],
  "reopenWhen": "A later queue observation claims an interval without checking its recorded endpoints."
}
```

## WO-123-D029 — Observed repair outcome and fresh evidence edition

```json
{
  "id": "WO-123-D029",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-003",
  "decision": "Retain D027's repaired grammar on the executed evidence. F5's error-status separators and working adverbs are now recognized in both supplied statement classes. The observation selection reproduces; the requirement selection produces the classed-new baseline finding before source work. R15's healthy passive requirement now completes the composed loop. Retain D023's broader planner question and D017's boarded B1 without widening this repair. Select immutable evidence revision 005 and preserve revisions 001-004; no new module or registry row is needed.",
  "evidence": [
    "composition-check-005.json: node scripts/test-vertical.mjs passed 71/71, no failures or skips, completed 2026-10-05T17:26:26.825Z in 299.599 bounded seconds",
    "Both classes execute status: 500, status = 500, HTTP status: 500, isn't actually working, is not currently working, unquoted HTTP code=503 and U+2019 isn't reliably working; every finding asserts zero worker launches, Git pushes and PR creations",
    "Resident status: 500 cases independently execute both supplied classes; the healthy No errors are thrown requirement reaches resolved with all fourteen receipts, one worker, one local fixture push and one fixture PR",
    "regeneration-005.json: all eighteen sequential generation/check commands passed in 77.233 seconds; the fresh live feedback episode ran 17:27:25.982-17:28:26.614 UTC on codex-cli-exec, gpt-6.1-sol, max with live workers enabled, after the final judged-source edit",
    "Feedback check: Live feedback audit docs/evidence/WO-123/feedback-005 judged the current source. Authority, artifact, verification, console, harness, publication and release-surface checks passed",
    "Publication check reports 253/253 headings indexed and both locks current; measured whole-file bytes are 166837 for product 07 against its 166907 ceiling, and 176725 for product 03 against 176807",
    "Release prepare --local retained v0.67.0; manifest/lockfile diffs contain component versions and internal pins only, with no added dependency",
    "The 69 distinct scratch roots named by the completed composition transcript no longer exist after their fixtures' normal teardown; retained material is accounted separately through the existing material registry"
  ],
  "corrections": [
    "The original-source red classifier test failed on status:503 being new; the first focused run then passed 32 of 35 cases. Its three failures were newly authored fixture mistakes: resident time had not reached the ready phase and the healthy-loop counter used git instead of the observed git-push actor. The corrected focused run passed 4/4; the complete 71-case suite passed afterward.",
    "D028 and adjacent queue sequence 33 correct the unsupported more-than-60-seconds check-in claim using the recorded 29.014-second interval.",
    "The final build and the composition command initially overlapped for approximately one second because the executor started the next command after the build tool yielded a running session. The preceding completed build had identical classifier logic. The recorded command endpoints do not establish when the tested external episodes began; the earlier claim that the build completed before them was unsupported and is corrected here. Regeneration explicitly awaited each command's completion. This is a scheduling error, not a claimed sequential build/composition measurement."
  ],
  "goalAlignment": {
    "outcome": "D027's intended baseline boundary holds in the executed families: defect observations reproduce, contradicted new stories stop before effects, and the healthy passive requirement completes. Earlier composition obligations remain exercised by the complete suite.",
    "traps": "Policy resistance is judged with positive and healthy controls together. The commons counts the complete work and its failed fixture probes rather than claiming a free repair. Drift to low performance retains reproduction. Escalation introduces no field or gate. Success to the successful keeps D027's explicit-input comparison visible. Shifting the burden removes R15's false hold. Rule beating judges both class sources and effects. Seeking the wrong goal is the usable successor baseline, not seventy-one as a proxy.",
    "naiveInterventionism": "The original primitive contracts, admission authority, bounded review, readiness and draft recovery passed alongside the changed grammar.",
    "noOp": "The original-source test and VER-003 establish the old miss; the passing composed outcomes justify retaining this repair."
  },
  "rejected": [{"option": "Claim unrestricted classification reliability from the passing suite", "reason": "Both signals still share a bounded parser. The broader vocabulary and unresolved-classification contract remain a planning choice."}],
  "reopenWhen": "Independent verification contradicts these outcomes or a composed failure within the documented grammar silently reaches source work."
}
```

## WO-123-D030 — Preserve predicate units and include new sources in the gate identity

```json
{
  "id": "WO-123-D030",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-003",
  "decision": "Continue adjacent-0004 within its F5/R15 paths. Protect complete negative-working and negated-failure predicate spans from internal clause breaks, alongside labeled status spans. Keep contrastive yet outside those spans as a clause boundary. Stage the fifteen authored source/test paths already listed in validation.json, without a commit, so the existing documented gate identity includes their working bytes. Rebuild and execute the complete composition, a new immutable evidence edition with fresh live feedback, and the full product/document gates at the resulting subject.",
  "evidence": [
    "The bounded modifier probe at 17:33:25.836-17:33:25.898 UTC prints both supplied classes: Login isn't yet working is silently new; The parser doesn't yet throw exceptions, The build has not yet failed and No errors are yet thrown are falsely defect. This is diagnostic output, not an asserting passing test.",
    "vertical.ts includes yet in both ADVERB and CLAUSE_BREAK but protects only labeled status spans before clause segmentation. D027's predicate grammar is therefore split before its polarity checks.",
    "npm test -- --review at 17:30:30.684-17:30:31.921 UTC exited zero by reusing the 16:27:08.125Z row at identity c21128ff; its output explicitly says no suite started. The earlier chat description of a running fresh product gate was wrong.",
    "gate-evidence.mjs:628-650 documents tracked source bytes and staging new source files before the reviewer's gate, then obtains paths with git ls-files. Git status shows the authored vertical source and fixture paths are still untracked. No gate is active: evidence --stop reported nothing to stop.",
    "D029's overlapping command endpoints do not establish the start of external fixture episodes; its unsupported timing sentence was corrected in place before filing the current handoff."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The successor baseline must preserve failure and healthy polarity, and its product evidence must name the actual source under judgment.",
    "traps": "Policy resistance compares the failing working predicate with healthy negatives and contrastive clauses. The commons retains the failed and reused probes and repeats only checks invalidated by this source edit. Drift to low performance requires fresh execution. Escalation changes no protocol, primitive or gate. Success to the successful keeps D027's reviewed-input comparison and rejects another literal exception. Shifting the burden preserves healthy wording. Rule beating includes all authored source bytes in the gate identity. Seeking the wrong goal judges reproduction, holds and effects rather than a zero exit from reuse.",
    "naiveInterventionism": "Reuse the existing polarity grammar and documented staging procedure. Keep conjunction scoping outside recognized units and avoid changing the evidence framework.",
    "noOp": "The confirmed yet miss contradicts the documented grammar; leaving new sources untracked would allow an old product row to stand in for the repaired source."
  },
  "rejected": [
    {"option": "Remove yet from the clause separators", "reason": "Contrastive yet separates an asserted failure from a preceding modal or healthy clause. Preserve it outside complete predicate units."},
    {"option": "Change the gate identity implementation", "reason": "The implementation explicitly documents the staging prerequisite. Satisfying it is a reversible worktree operation within the work order, while changing the gate would widen the repair."},
    {"option": "Force a fresh run while leaving sources untracked", "reason": "It could execute now, but later authored-source edits would still evade the tracked code identity. Stage the declared paths so ordinary current-subject checks remain meaningful."}
  ],
  "limits": "The lexical parser remains shared and bounded as recorded in D023/D027. Staging grants no commit or publication authority; the next verifier still independently judges the repaired subject.",
  "reopenWhen": "A recognized predicate is split internally again, a contrastive clause loses its assertion, or the recorded gate identity omits an authored source path."
}
```

## WO-123-D031 — Carry healthy auxiliary negation through its predicate and failure-noun object

```json
{
  "id": "WO-123-D031",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-003; adjacent-0005",
  "decision": "Repair the encountered healthy-negation defect within the existing classifier and fixtures. Include cannot in the immediate negation grammar and recognize a negative auxiliary followed by the existing healthy infinitive as governing its failure-noun object, with an optional article. Protect the same complete unit from internal modifier breaks. Preserve positive failure verbs, failover's distinct word boundary, and contrastive clauses. Finish adjacent-0004's recorded checks, then start the separately announced adjacent-0005 at a fresh actor-attested steering boundary. A new source edit requires composition, immutable revision 007 with fresh live feedback, and full product/document gates again.",
  "evidence": [
    "The revision 006 product gate genuinely executed and passed 39 suites, 89 fresh tasks, at code identity ad93e255, recorded 2026-10-05T17:54:02.627Z in 541.428 seconds. This does not judge the next source edit.",
    "The bounded asserting negation-review probe at 17:54:32.432-17:54:32.500 UTC exited 1. Both supplied classes misclassify The endpoint cannot fail, The parser can't throw errors, The parser doesn't throw errors and The parser cannot yet throw errors as defect. Cannot failover and the positive throws errors control are correctly defect.",
    "NEGATIVE_AUXILIARY and HEALTHY_VERB deliberately suppress a healthy infinitive, but NEGATED omits the single-word cannot and checks only the suffix before each cue. The later error noun therefore loses its governing verb's polarity. This is within the existing negative-auxiliary/failure-word families, not D023's timeout or lost-data vocabulary.",
    "The earlier status, working-modifier, passive-subject and contrastive-yet repairs remain proven by composition-check-006.json; their fixtures and immutable editions are retained."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "WO-112/WO-118 need a baseline that reproduces defects and permits healthy requirements without recurring false holds.",
    "traps": "Policy resistance compares healthy object nouns with positive verbs and contrastive clauses. The commons records the extra audit and complete gate rather than claiming a free cleanup. Drift to low performance retains fresh current-subject execution. Escalation adds no field, primitive or gate. Success to the successful retains D027's reviewed-input comparison but uses the existing explicit healthy-verb intent for this small repair. Shifting the burden removes four reproducible false holds. Rule beating exposes the missed healthy inputs despite a passing complete row. Seeking the wrong goal judges usable baseline behavior rather than stopping at the zero exit.",
    "naiveInterventionism": "Keep the grammar bounded to the existing auxiliary/infinitive and failure-word categories, optional articles and current modifiers. Keep positive clauses outside the recognized span. No semantic-parser or protocol redesign.",
    "noOp": "The confirmed healthy phrases keep producing baseline findings and operator rewording. The small repair is within the declared surfaces and shared checks, so intervention wins despite its additional validation cost."
  },
  "rejected": [
    {"option": "Board it solely because the full gate passed or it predates this repair", "reason": "The adjacent-repair duty prefers a bounded repair; executable evidence now shows the false holds in the classifier's existing families."},
    {"option": "Add cannot alone to NEGATED", "reason": "That fixes the immediate fail cue but leaves failure-noun objects after a healthy negated verb as positive cues."},
    {"option": "Negate the rest of the sentence whenever a negative auxiliary appears", "reason": "A later contrastive clause can assert a real failure. Carry polarity only through the recognized predicate/object prefix."},
    {"option": "Expand to arbitrary object syntax or the broader vocabulary question", "reason": "Keep that planning question and the bounded parser limit in D023/D027; this repair recognizes the executed ordinary predicate and article forms."}
  ],
  "reopenWhen": "A recognized healthy auxiliary/infinitive or its failure-noun object falsely holds, or preserving its span suppresses a later positive failure clause."
}
```

## WO-123-D032 — Final current-subject repair outcome and retained boundaries

```json
{
  "id": "WO-123-D032",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-003",
  "decision": "Retain the repaired declared grammar on the final current-subject evidence. F5 status labels and modified negative-working assertions reproduce or stop with the classed-new finding before source work in both supplied classes. R15 and the separately encountered healthy auxiliary/object false holds no longer obstruct the executed healthy requirements. Select immutable edition 007, preserve all earlier attempts and editions, and complete adjacent-0004 and adjacent-0005 with their actual checks. Hand off for separate re-verification; do not widen the bounded lexical parser or claim unrestricted classification reliability.",
  "evidence": [
    "composition-check-007.json: 84/84 passing, zero failures or skips; completed 2026-10-05T18:04:13.715Z. Both supplied classes, advancing clocks, source/class assertions, zero worker/push/PR on findings, contrastive clauses and all fourteen-step healthy negative requirements execute alongside the existing admission, restart, path, review and readiness obligations.",
    "regeneration-007.json: all 18 sequential generation/check commands passed in 70.422 seconds, completed 2026-10-05T18:06:25.791Z. Fresh live feedback uses codex-cli-exec, gpt-6.1-sol, max with live workers enabled; its check reports that revision 007 judged the current source.",
    "Full product gate: 39 suites, 89 fresh tasks, 0 reused, exit 0; 547.3 seconds, recorded 2026-10-05T18:16:12.808Z, code identity defd9f05bd531daf2ba21f45bbc8db7d857f61689eb5a25c9472330dc68c568d.",
    "Standalone documentation gate: 24 tasks, 24 fresh, 0 reused, exit 0; 772.384 seconds, recorded 2026-10-05T18:31:35.802Z. Its transcript records WAIT host lanes for this worktree's build while WO-186 holds slots. The measured whole gate includes scheduler waiting; it is not isolated execution time. Final report/index writes follow this row, and repair-complete checks documentation again inline.",
    "Canonical adjacent queue revision 39: all 5 items completed, including adjacent-0004 and adjacent-0005 with three actual result references each.",
    "All seventeen authored/repaired sources were written before composition 007. Fifteen originally untracked source/test paths were staged without a commit to satisfy the documented tracked-source code identity. No source changed after the final composition, remints, live feedback or full product gate.",
    "Publication check: 253/253 headings, both locks current. Whole-file bytes remain product 07 166837/166907 and product 03 176725/176807. Local release preparation passed for staged v0.67.0, skeleton 0.53.0 and beacons 0.1.1; no dependency was added.",
    "Canonical material inventory at 2026-10-05T18:06:55.127Z: 33 nested repositories, all preserved, none undeclared. Composition 007 records normal teardown of its 82 named scratch roots.",
    "Read-only touching-followups pages inspect 24 textual pointers. Existing D017/B1 FUP-cb922b59e013dbf1 and D023 FUP-fb42e392b945cb45 remain planning inputs. This diagnostic read grants no change to another order or a broader language contract."
  ],
  "corrections": [
    "D028/queue sequence 33 correct the unchecked elapsed-time claim; D029 corrects the unsupported external-episode timing claim; D030 corrects the product attempt that reused an older row and ran no suites; D031 preserves the healthy-control defect found after the genuinely passing revision 006 gate.",
    "Three direct syntax checks of ignored report helpers ran without the bounded wrapper. Application probes and regeneration use recorded bounded supervision; gates supervise their own tasks. No universal bounded-command claim is made."
  ],
  "goalAlignment": {
    "outcome": "The executed successor baseline now distinguishes recognized existing failures from healthy negative requirements before source work. Resident/operator composition, durable holds, completed-step restart, review and publication readiness remain exercised. Verification must independently judge this repair.",
    "traps": "Policy resistance judges failure, healthy and contrastive controls together. The commons retains the failed/reused attempts and the additional gate/wait cost. Drift to low performance requires fresh current-subject results. Escalation adds no field, primitive or dependency. Success to the successful preserves D027's explicit-input comparison and shared-parser limit. Shifting the burden repairs false holds rather than requiring rewording the executed healthy forms. Rule beating judges source/class and zero subsequent effects, not passing counts alone. Seeking the wrong goal is the successor's usable baseline boundary.",
    "naiveInterventionism": "Keep the repair in the existing grammar, fixtures and named write-backs. Preserve admission, continuation, review/readiness and evidence contracts; defer the larger classification and harness-closure questions to their recorded planning inputs.",
    "noOp": "VER-003 and the recorded red probes show the prior silent publication and false holds. The current executed outcomes justify keeping these bounded repairs rather than preserving those defects."
  },
  "rejected": [
    {
      "option": "Treat the reused first product attempt or revision 006 pass as final repair evidence",
      "reason": "The first attempt ran no suites, and revision 006 predates the auxiliary/object repair. Revision 007 has a fresh complete row at the full tracked source identity."
    },
    {
      "option": "Claim a classifier redesign or economy improvement",
      "reason": "Selection and host checking still share a bounded lexical parser. D002 remains the sole declined, kept-current economy experiment; no saving is measured or claimed."
    },
    {
      "option": "Repair B1 or broaden failure vocabulary during handoff",
      "reason": "D017 and D023 already record those planning questions and their reopening conditions. The completed checks judge the authorized bounded repair."
    }
  ],
  "limits": "Shared lexical selection/checking, accepted ambiguity recovery, process-local preparation/backoff memory, external-success receipt gaps, local synthetic target actors and one APFS volume retain the handoff's stated limits. Final usage counters remain in ignored receipts and the operator response, not this tracked report.",
  "reopenWhen": "Independent re-verification contradicts these outcomes, a recognized active failure silently walks, a recognized healthy predicate falsely holds, or planning supplies the broader classification/import-closure contract."
}
```

## WO-123-D033 — Verification: reported statuses, modified or perfect not-working and broken states still walk

```json
{
  "id": "WO-123-D033",
  "date": "2026-10-05",
  "dispatch": "resume: verify; VER-004",
  "kind": "finding",
  "decision": "Fail VER-004 on criterion 5 alone. F5 and R15 are repaired as quoted, and criteria 1-4 and 6-8 are met. F6 (high): ordinary wording inside the error-status, not-working and broken-state families that D023 and D027 name still evades both baseline selection and the host check. Both supplied statement classes return storyClass new, host kind new and no finding for these inputs. A status joined to its label by a copula: 'The response status is 500', 'The HTTP status was 503', 'The status code is 502', 'The response code was 500'. A status after a progressive reporting verb: 'The endpoint is returning 500', 'keeps returning 500', 'We are getting 500s from checkout', 'Users are seeing 404 on the settings page'. A status followed by its reason phrase after a reporting verb: 'The server returns a 502 Bad Gateway', 'The API returns 404 Not Found', 'responds with 401 Unauthorized', 'Requests get a 503 Service Unavailable'. A not-working predicate modified by 'always': 'Login is not always working', 'Login isn't always working'. Not working in the perfect: 'Login has not been working since Monday', 'Login hasn't been working'. A broken state outside is/are/was/were/currently/still: 'The export has been broken since v2', 'The checkout page seems broken', 'Pagination appears broken', 'The total looks wrong'. Twelve composed operator runs over six of these wordings publish a Deliverable-ready body and resolve. Each run makes one worker launch, one local push and one fixture PR. Causes in packages/skeleton/src/vertical.ts: LABELED_ERROR_STATUS (511-512) joins label and value only by whitespace, colon, equals or 'of'; REPORTED and REPORTED_FINITE (500-503) list no progressive forms; STATUS_OPEN (515-516) admits only the end of the clause, punctuation or a listed preposition after an unlabeled value, so a reason phrase drops it, although D023 defines the family as a status 'after an article or a reporting verb when no counted noun or unit follows'; ADVERB (456) omits 'always', which HEALTHY_VERB and NEGATED add; NOT_WORKING (461-463) admits no auxiliary between the negation and 'working'; BROKEN_STATE (465-466) reads only six leading words. This is the fourth consecutive criterion-5 failure of the same shared classifier (VER-001 F3, VER-002 F4, VER-003 F5, VER-004 F6), and D027's own reopening condition, an active assertion in the declared families silently walking, is met. B1 remains D017's boarded item; D023's wider vocabulary remains its planner follow-up.",
  "evidence": [
    "Independent direct classification probe over the current built module (packages/skeleton/dist/src/vertical.js, rebuilt from the current source at 2026-10-05T18:44:45.011Z), bounded exit 0, 2026-10-05T18:50:09.974Z-18:50:10.047Z: every F6 wording above gives selected new, host new and zero findings in both the current-behavior observation and requirement classes. Controls 'The endpoint returns status 500', 'The endpoint returns status: 500', 'Login isn't actually working', 'The app crashes on launch', 'The page does not load', 'The link is broken', 'Login is still not working' and 'The endpoint returns 500 Internal Server Error' give host defect, selected defect for the observation class and the classed-new finding for the requirement class. Healthy controls 'The endpoint returns status 200', 'Returns 500 rows per page', 'No errors are thrown' and 'The button is blue' give new with no finding.",
    "Independent composed operator probe, bounded exit 0, 129.162 seconds, 2026-10-05T18:50:30.867Z-18:52:40.029Z: verticalFixture and runVerticalIssue with steps 1, advancing the fixture clock before each resumption. For 'The response status is 500', 'The server returns a 502 Bad Gateway', 'The endpoint is returning 500', 'Login is not always working', 'Login hasn't been working' and 'The export has been broken since v2', each followed by ': make `fixture.txt` contain changed by synthetic worker.', in both supplied classes, all twelve runs record storyClass new (supplied-current-behavior-observation), host kind new (active-existing-failure-assertion), findings [], outcome walked, all 14 steps, one worker launch, one local push, one fixture PR creation, the exact 'Deliverable-ready: ready; every applicable item is evidenced.' sentence and terminal resolved.",
    "Instrument control with the same probe, bounded exit 0, 13.998 seconds, 2026-10-05T18:52:50.427Z-18:53:04.426Z: 'The endpoint returns status: 500' reproduces at baseline in the observation class and stops NeedsHuman at baseline with the classed-new finding and zero launches, pushes and PRs in the requirement class.",
    "Both entries build the same ports and VerticalHost (scripts/lib/vertical-runtime.mjs:387 and :562), and the baseline step calls baselineStoryClass (scripts/lib/vertical-primitives.mjs:371) and baselineClass (packages/skeleton/src/vertical-host.ts:191). The resident consequence is inferred from that shared path and VER-003's resident probe; it was not rerun for F6.",
    "Root verifier rerun of node scripts/test-vertical.mjs: 84 passed, 0 failed, 0 skipped, 308.646 bounded seconds, 2026-10-05T18:44:49.692Z-18:49:58.338Z. Case, volume and Unicode variants were all constructed on case-insensitive APFS /dev/disk3s5, darwin.",
    "The current code identity defd9f05bd531daf2ba21f45bbc8db7d857f61689eb5a25c9472330dc68c568d equals the executor's fresh, complete npm test -- --review row (39 suites, 89 fresh tasks, exit 0, 2026-10-05T18:16:12.808Z). Untracked paths are under docs/ only, outside the identity. Sequential bounded checks at 2026-10-05T18:54:02Z-18:54:07Z all exited 0: revision-007 authority, artifact identity, verification and feedback, console fixtures, harness and publication. The feedback check reports that the live audit judged the current source. git diff --check is clean, and the manifest diff changes component versions and internal pins only."
  ],
  "reopens": {
    "decisionId": "WO-123-D027",
    "observation": "A composed active assertion in the declared families silently walks again: status values joined to their label by a copula, reported by a progressive verb or followed by their reason phrase, 'not always working', 'hasn't been working' and 'has been broken' each publish and resolve with story class new and no finding in both supplied classes."
  },
  "goalAlignment": {
    "missionAndCriticalPath": "WO-112 and WO-118 inherit this baseline. A defect report that walks as new is changed without reproduction and published as ready, which is the WO-180 D013 hazard the order's Observed gap names.",
    "traps": "Rule beating: the passing table counts quoted cases, while ordinary tense, aspect and reason-phrase variants of the same families walk; the measure is terminal behavior. Seeking the wrong goal: 84 passing cases are not the criterion. Fixes that fail and policy resistance: each wording patch has closed the quoted spellings and left the family open, four times. Escalation: this finding adds no family beyond D023 and D027's own definitions. Drift to low performance: the reproduction standard is kept and the fixtures are not relabeled. Success to the successful: D027 rejected the structural alternatives; its reopening condition is now met, so they are compared again on new evidence. Shifting the burden: a walked defect costs a published unreproduced change, which is worse than a false hold that costs one refiled draft. The commons: one writer, sequential bounded probes and no implementation edit by the verifier.",
    "naiveInterventionism": "The verifier edits no implementation, contract, criterion or earlier report. It consumes the matching product gate, reruns the focused composition and checks, and routes the defect to resume: fix.",
    "noOp": "A pass would carry publication without reproduction into WO-112 and WO-118 for ordinary bug-report wording."
  },
  "rejected": [
    {"option": "Pass because the 84 cases and VER-003's quoted spellings pass", "reason": "Independent composed runs violate criterion 5 with ordinary wording inside the families the order's decisions declare."},
    {"option": "Board F6 under D023's wider-vocabulary follow-up", "reason": "D023 lists timeouts, lost data, does nothing, won't, stopped working, no longer works and named exception classes as outside. A copula, a progressive reporting verb, a reason phrase after a reported status, the adverb always, the perfect aspect and a linking verb add no new failure family. The reason-phrase case contradicts D023's own definition of the status family."},
    {"option": "Treat only the copula, progressive, reason-phrase and always cases as findings, and the perfect-aspect and linking-verb cases as follow-ups", "reason": "'Hasn't been working' asserts not working, and 'has been broken' and 'seems broken' assert a broken state; D023 names these families without restricting tense or copula. All of them walked to publication."},
    {"option": "Fail another criterion", "reason": "Admission, convergence, typed stops, path identity, write-backs, re-mints and gates hold at this subject; F6 bears only on criterion 5's failing-behavior clause."},
    {"option": "Repair the classifier during verification", "reason": "The verifier judges the recorded subject and routes implementation changes to resume: fix."}
  ],
  "followup": "WO-123 resume: fix. (F6) Hold D021, D023 and D027's rule over the families, not over quoted spellings: an active statement asserting existing failure inside the error-status, not-working or broken-state family is selected defect or held with the classed-new finding before source work, in both supplied statement classes, and never silently new. Within the families this covers a 4xx/5xx value joined to a status, code or HTTP label by a copula in any tense; a value after a reporting verb in any tense or aspect, including progressive, with or without its reason phrase (Bad Gateway, Not Found, Unauthorized, Service Unavailable); a negative working predicate with any ordinary adverb, including always, and in perfect or progressive aspect (hasn't been working); and a broken, incorrect or wrong state in any tense or aspect or after a linking verb (has been broken, seems broken, looks wrong). Preserve the counted-noun and unit controls (500 rows, 500 ms, 500 users), healthy statuses (status 200) and the negation, modal, imperative and conditional controls. Because four consecutive repairs closed only quoted spellings and D027's reopening condition is now met, state the grammar the cases are derived from and test cases drawn from it beyond this report's examples. Compare D027's rejected alternatives again (a reviewed story-kind input; an unresolved-classification hold) before another lexical patch, and ask the operator if the chosen route changes the criterion's bound. Composed cases in both classes, with advancing time, assert class and source, reproduction or the baseline finding, and zero worker, push and PR on the finding path. Checks: node scripts/test-vertical.mjs, npm test -- --review, npm run test:docs and a fresh live feedback episode after any judged-source edit (criterion 7).",
  "reopenWhen": "The repair settles F6, an active assertion in these families silently walks again, a healthy control falsely holds, or planning supplies a reviewed story-kind or unresolved-classification contract."
}
```

## WO-123-D034 — Repair predicate families rather than individual phrasings

```json
{
  "id": "WO-123-D034",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-004",
  "decision": "Replace tense-specific phrase recognition in the three F6 families with predicate units: normalize auxiliary contractions; recognize negative working through an auxiliary/modifier sequence, state anchors with their local polarity, and HTTP error values through labeled or reporting predicates. Reporting verbs include base, finite, progressive and participle forms. Labels admit copulas and auxiliary chains. A status reason phrase is part of its value, not a counted quantity or clause negation. Keep the existing supplied-class selection, host finding, clause-local requirement voice and healthy controls. Test grammatical cross-products and composed consequences in both classes and both entries, with advancing time and zero later effects on a finding.",
  "evidence": [
    "VER-004 F6 and D033: four consecutive criterion-5 failures of the shared phrase classifier; twelve composed counterexamples publish without reproduction.",
    "vertical.ts: narrow label connectors, finite-only reporting list, adjacency-only NOT_WORKING and copula-only BROKEN_STATE are the shared causes. Existing requirement-voice and polarity fixtures constrain their replacement.",
    "IANA HTTP Status Code Registry, https://www.iana.org/assignments/http-status-codes/, read 2026-10-05: registered 4xx/5xx descriptions distinguish status reason phrases from arbitrary counted nouns. The parser performs no network read.",
    "D002 read at repair entry: the sole economy experiment remains declined, kept-current; no saving claimed. No collaboration agents planned or spawned. Entry usage total 45202, codex-transcript-counter, dispatch scope, cutoff 2026-10-05T19:04:19.821Z; cumulative reported traffic, not occupancy."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "WO-112 and WO-118 need a defect reproduced or held before source work; a healthy new story must remain executable.",
    "traps": "Policy resistance and fixes that fail: judge positive and healthy controls together over grammatical products, not quoted spellings. Commons: one writer, zero collaboration agents, sequential supervised probes and measured required gates. Drift to low performance: preserve criterion 5 and the reproduction standard. Escalation: add no field, primitive, dependency or gate. Success to the successful: reconsider explicit reviewed story-kind and unresolved-classification contracts on the new failure evidence. Shifting the burden: repair the predicate grammar instead of asking the operator to reword these failure reports. Rule beating: assert class sources, reproduction or finding, and no later worker/push/PR effects in both entries. Seeking the wrong goal: usable baseline behavior is the measure, not test count.",
    "naiveInterventionism": "Preserve admission, durable identity, supplied classifications, recovery and all primitive contracts. Confine code changes to the existing baseline interpreter and discriminating tests. The other acceptance obligations remain required.",
    "noOp": "The independently observed silent publication remains if nothing changes. Four prior repairs show that another list of quoted forms is insufficient."
  },
  "rejected": [
    {"option": "Add a reviewed story-kind input", "reason": "It could improve selection but does not discharge criterion 5's contradiction check. It changes the resident/operator input contract and requires a producer and migration. No such broader contract is supplied by this dispatch."},
    {"option": "Hold every unrecognized observation as unresolved", "reason": "It would stop healthy context such as The button is blue and change new-story behavior. Keep healthy statements without a declared failure cue usable; ambiguous wording inside a recognized family retains the existing conservative finding."},
    {"option": "Add only the VER-004 phrases", "reason": "It repeats the approach independently falsified four times. Derive cases from predicate grammar, including unquoted tense, aspect, modifier, polarity and reason-phrase variants."},
    {"option": "Broaden to timeouts, lost data or a new inference primitive", "reason": "Those remain D023's separate planning contract. No criterion or declared family is changed."}
  ],
  "reopens": {"decisionId": "WO-123-D027", "observation": "VER-004 establishes another composed silent walk in D027's declared families. Its structural alternatives were compared again before implementation."},
  "reopenWhen": "A grammatical product inside a declared family silently walks, a healthy control falsely holds, or planning supplies the broader reviewed-story-kind/unresolved-classification contract."
}
```

## WO-123-D035 — Preserve presentation inside predicate units and reject premature completion evidence

```json
{
  "id": "WO-123-D035",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-004; adjacent-0006",
  "decision": "Normalize complete adverb parentheticals and balanced presentation around status data before recognizing predicate units. Preserve the original statement and its identity. Include presentation, negation and quantity cross-products in the independent grammar matrix and composed failure/healthy fixtures. Treat the earlier 121-case complete suite as diagnostic history, because its source predates this correction; require a fresh complete current-subject gate and feedback edition before handoff.",
  "evidence": [
    "The initial complete composition ran 2026-10-05T19:13:35.130Z–19:22:29.774Z, exited 0 with 121 passed and no failures or skips. Its ignored composition.json/log are retained, but it does not judge the final source.",
    "The separate asserting presentation challenge ran at 19:22:34.478Z–19:22:34.678Z and exited 1 with 17 supplied-class mismatches. It exposed missed quoted-status and parenthetical negative-working assertions, and false holds for quoted negated reasons and parenthetical healthy states. The earlier passing suite was insufficient evidence for those inputs.",
    "The corrected challenge ran at 19:23:57.363Z–19:23:57.597Z and passed all fourteen wordings. Further quantity controls require normalization to preserve a following counted noun, rather than interpreting a decorated number alone as HTTP context.",
    "The final-focused bounded run at 19:25:23.605Z–19:25:58.850Z exited 0: eight selected tests passed, including 3564 supplied-class grammar cases, quoted-status and parenthetical-modifier failures in both supplied classes, and healthy negated presentation controls. Full composition and product/document gates still follow.",
    "The operator asked what the work order does, why it repeatedly fails, and why sentences cannot be deterministically tagged. The response distinguishes the existing explicit statement-role labels from story kind: the latter is inferred from content, and criterion 5 also requires a contradiction check. No operator statement supplies a replacement input schema, producer or authorization to amend the criterion. Continue the authorized bounded repair and retain D034's compared alternatives.",
    "The HTTP phrase comparison also read official RFC 2616 section 10.4, RFC 7231 section 6.5, RFC 4918 section 11.2 and RFC 2324 section 2.3.2 for the documented historical names. These are static public vocabulary sources, not a runtime network dependency."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "A defect must reproduce or hold before source work in the successor loop; healthy requirements must remain executable.",
    "traps": "D034's eight-trap comparison still applies. The new evidence particularly refutes rule beating by passing count, drift to low performance through stale completion evidence, and shifting the burden to operator rewording. Commons cost includes both the early complete run and the final fresh gate. Policy resistance judges failure, healthy polarity and quantity controls together; escalation adds no field or primitive; success to the successful preserves the explicit-input comparison; seeking the wrong goal measures the pre-effect baseline boundary.",
    "naiveInterventionism": "Only complete presentation units are normalized; punctuation containing an independent assertion remains a clause boundary. Do not change inputs, authority, restart or downstream primitives.",
    "noOp": "The asserting red challenge shows that leaving presentation untreated preserves silent walks and false holds in the declared families."
  },
  "rejected": [
    {"option": "Hand off on the 121-case pass", "reason": "The later asserting probe falsifies its coverage, and the final source has changed."},
    {"option": "Strip all punctuation or treat every quoted number as an error", "reason": "Independent clauses, numeric quantities and healthy negation must retain their meaning."},
    {"option": "Silently replace inference with explicit story-kind tagging", "reason": "D034 compares that broader contract; this operator question does not supply or authorize its producer and migration, nor discharge the current contradiction criterion."}
  ],
  "reopens": {"decisionId": "WO-123-D034", "observation": "An adversarial presentation probe failed after the first complete composition passed; the additional unit normalization and discriminating fixtures are required."},
  "reopenWhen": "Presentation within a declared predicate family changes classification, polarity or quantity recognition, or a fresh current-subject gate fails."
}
```

## WO-123-D036 — Keep grouped and prepositional modifiers inside the predicate

```json
{
  "id": "WO-123-D036",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-004; adjacent-0006",
  "decision": "Recognize coordination in a complete adverb group. Recognize a prepositional noun-phrase modifier by its grammatical slot before an anchored predicate, excluding finite predicates, negation, failure anchors and independent-clause words; normalize that slot to a neutral parser-only adverb. Preserve original contract text and source identity. Apply the same rule to complete parenthetical presentations. Add positive and healthy cross-products, a contrastive assertion control and full composed consequences. Preserve edition 008 and its completed 127-test composition as the earlier subject, then mint 009 with fresh live feedback and complete current-subject gates.",
  "evidence": [
    "composition-check-008.json: 127 tests pass, zero failures or skips; completed 2026-10-05T19:38:04.530Z, identity 4944c267f1a78dc685739f85a8512804437b904279e764164fd86e90bbacffa1. It predates this additional modifier repair and is not final-current evidence.",
    "The asserting grouped-before probe ran 2026-10-05T19:38:27.533Z–19:38:27.753Z, exit 1, sixteen supplied-class mismatches across ten wordings. Parenthetical coordinated adverbs missed negative-working assertions and falsely held healthy states. Prepositional modifiers such as for several days and in any way produced the same errors, with and without parenthetical presentation.",
    "ADVERB_PHRASE retained successive single adverbs but omitted their coordination. The modifier chain intentionally excludes prepositions and articles, so a complete noun-phrase modifier fell outside that slot. Removing those delimiters globally would lose clause and quantity controls.",
    "grouped-after: ten wordings, zero mismatches, exit 0 at 2026-10-05T19:40:10.990Z. grouped-matrix: 3646 supplied-class cases and both selected tests pass at 2026-10-05T19:40:11.523Z. The control containing although uploads fail still asserts failure; This is not the working directory remains healthy. Full current-subject validation follows."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The successor baseline must retain an assertion or healthy polarity across ordinary modifiers rather than forcing operator rewording.",
    "traps": "D034's eight-trap comparison remains applicable. This red probe again rejects rule beating through a passing complete count, keeps fresh evidence rather than drift to low performance, and repairs the cause rather than shifting rewording to the operator. Commons cost includes the earlier complete run and the required new source validation. Policy resistance retains positive, healthy and independent-clause controls; escalation changes no contract or primitive; success to the successful retains the explicit-input alternative; seeking the wrong goal judges the pre-effect baseline.",
    "naiveInterventionism": "Normalize only the grammatical modifier slot. Exclude independent predicate and failure words so another assertion cannot be erased. No input, authority, continuation or primitive contract changes.",
    "noOp": "The recorded red probe establishes sixteen silent-walk or false-hold mismatches inside the same declared predicate families."
  },
  "rejected": [
    {"option": "Hand off on the 127-test pass", "reason": "The additional asserting probe falsifies grouped-modifier coverage and the source changes again."},
    {"option": "Admit all prepositions and articles as individual modifier words", "reason": "Those delimiters protect noun, quantity and clause boundaries; recognize the complete anchored modifier slot instead."},
    {"option": "Strip all parenthetical content", "reason": "A parenthetical can contain an independent failure assertion whose evidence must remain visible."}
  ],
  "reopens": {"decisionId": "WO-123-D034", "observation": "Coordinated and prepositional modifiers are grammatical variants within the declared working/state families; the focused asserting probe requires their repair."},
  "reopenWhen": "A grouped modifier loses an assertion or local polarity, or modifier normalization erases another assertion."
}
```

## WO-123-D037 — Make assertion meaning an explicit, persisted input

```json
{
  "id": "WO-123-D037",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-004; adjacent-0006 revision 2",
  "decision": "Replace the implicit English predicate grammar with a complete baselineAssessment of existing-failure, no-existing-failure or unresolved for each active executable StoryContract statement. Bind judgments and their rationale and producer to the compiled contract ID, persist them in the admitted binding, and include them in its identity. Missing judgments become unresolved; stale or malformed judgments refuse at contract admission; unresolved or legacy bindings stop before baseline effects. Select the story from supplied observations and independently check all executable statements for a failure supplied as new. Preserve reproduction, authority, restart, review and delivery obligations. A model can produce the reviewed input, but this repair makes no provider selection or measured accuracy claim.",
  "authorization": "The operator asked why sentences cannot be deterministically tagged, raised cheap or local model interpretation, warned against brittle repair, then explicitly authorized small fixes or an entire refactor to complete the fix. This changes the existing issue input and baseline implementation within the order's algorithm-agnostic design; it neither edits nor waives a judged criterion.",
  "evidence": [
    "VER-004 is the fourth independent lexical failure; F6 shows both baseline selection and checking share the same missed predicates.",
    "D035 and D036 record separate asserting challenges that failed after full composition passes; another passing phrase matrix does not establish a dependable semantic boundary.",
    "scripts/lib/vertical-runtime.mjs already takes reviewed issue revision and StoryInference inputs from vertical.json; packages/compiler/src/story-contract.ts binds statements to source spans, text, classification and source fingerprints. This is the existing producer boundary for the additional assertion judgments.",
    "WO-123 Design and criterion 5 require class and source, a finding for failing behavior classed new, and non-reproduction NeedsHuman. They do not require regex or an English inference engine. The compiler, intent filing and primitive protocols stay intact.",
    "The latest operator steering permits an entire refactor. The previous conclusion that this dispatch supplies no authority for an explicit input was too narrow; that authorization is now explicit."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "WO-112 and WO-118 need reliable pre-source admission and baseline routing from public issue material. A saved meaning judgment makes runtime behavior reproducible and uncertainty explicit.",
    "traps": "Policy resistance: preserve the independent contradiction and reproduction checks instead of accepting a story-kind claim alone. Fixes that fail: remove lexical fallback rather than expanding phrases. Commons: one writer, no collaboration agents, sequential bounded probes and required measured checks; preserve earlier failed and diagnostic evidence. Drift to low performance: missing and unknown labels cannot silently mean new. Escalation: add no gate, dependency, provider or primitive. Success to the successful: replace the repeatedly falsified method using the changed evidence. Shifting the burden: do not demand rewording to satisfy a parser; a host model or operator can judge the original text with context. Rule beating: source identity, missing/stale input and both entry effects are tested, with no claim that schema validation proves semantic accuracy. Seeking the wrong goal: unchanged source work and publication standards remain the outcome, not phrase coverage or a speculative 99% score.",
    "naiveInterventionism": "Keep the compiler, screened source, reviewed configuration, persisted continuation, authority and primitive hosts. Replace only the semantic boundary and its callers. Old bindings with no assessment are safely held; old receipts and terminal histories are preserved. New judgments require a new admitted identity and cannot relabel an old receipt.",
    "noOp": "It leaves the independently demonstrated silent-new classification. Further grammar patches were already falsified during this dispatch."
  },
  "rejected": [
    {"option": "Finish the grammar patch on its latest passing matrix", "reason": "Two additional red challenges after full passes show that phrase coverage does not close the semantic category."},
    {"option": "Treat an absent failure cue or absent tag as new", "reason": "That is the unsafe default responsible for the recurring silent walk."},
    {"option": "Accept one unbound story-kind flag", "reason": "It lacks statement/source provenance and cannot establish the required contradiction check."},
    {"option": "Call a newly selected cheap or local model during every execution or restart", "reason": "Provider selection and accuracy evaluation are untested, and repeated judgments would make a saved continuation depend on a changing answer. Consume a validated persisted assessment through the existing reviewed input instead."}
  ],
  "reopens": {"decisionId": "WO-123-D034", "observation": "Further red challenges and explicit operator refactor authorization overturn retaining the grammar and missing-cue default-new choices. D035 and D036 remain truthful diagnostic history."},
  "reopenWhen": "A malformed, incomplete, stale or unresolved assessment reaches baseline effects; a contradictory failure passes as new; or a measured model evaluation supports selecting an automatic producer. Supplied semantic accuracy remains a judgment obligation, not a property inferred from deterministic decoding."
}
```

## WO-123-D038 — Let assertion judgments select story kind across statement roles

```json
{
  "id": "WO-123-D038",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-004; adjacent-0006 revision 2",
  "decision": "Select defect whenever any active executable statement has an existing-failure judgment, regardless of whether that statement is a requirement, observation or another executable role. A requirement can request a fix and describe a real bug together. Keep the host's independent comparison of the primitive's claimed story class with all saved judgments: a caller claiming new against an existing failure is still a finding. Also validate unresolved or legacy assessments before every post-admission primitive step, so an old continuation already past baseline cannot resume source or publication effects. Preserve historical receipts and append a named stop at the next step.",
  "evidence": [
    "The first fourteen explicit-assessment tests pass. Their annotated requirement/existing-failure combinations demonstrate that retaining observation-only selection still chooses new despite an explicit failure fact; the host then holds it. This is safe but needlessly contradicts the new input and requires a role correction.",
    "WO-123 Design says a contract naming failing behavior is a defect story. Statement roles describe a statement's function and are not an assertion that no existing failure is present. The explicit assertion judgment supplies that missing fact.",
    "vertical-host.ts's first assessment guard checks only the baseline command. An older persisted continuation whose baseline already completed can resume at source-change or publish without that check. Replay preserves old bindings and receipts, so a guard must cover the next effect rather than rewrite history."
  ],
  "reopens": {"decisionId": "WO-123-D037", "observation": "Use all source-bound failure judgments for selection instead of retaining observation-only selection. Broaden the legacy guard to every primitive step after the four admission receipts. The explicit schema, conservative missing-input behavior and unchanged acceptance criteria stand."},
  "goalAlignment": {
    "missionAndCriticalPath": "Route actual bugs to reproduction without a redundant manual role correction, while preventing any unassessed legacy continuation from proceeding to source work or publication.",
    "traps": "D037's eight-trap comparison applies. Shifting the burden and policy resistance specifically favor one explicit failure fact over competing role-based selection. Fixes that fail and rule beating require a real contradictory-caller test, and migration tests after both baseline and review. Drift to low performance preserves reproduction and the required finding. Commons retains one writer and measured checks; escalation adds no primitive or gate; success to the successful rejects preserving the earlier role rule merely because it already has fixtures; seeking the wrong goal measures accurate routing and absence of later effects.",
    "naiveInterventionism": "Preserve role-based criteria, surfaces and work-order derivation; change only baseline selection. Keep both successful and unsafe legacy receipts as immutable history and stop before the next effect. Terminal histories remain readable.",
    "noOp": "Explicitly known failures supplied in requirements keep needing a role correction, and an already advanced legacy run can bypass the missing-assessment check."
  },
  "rejected": [
    {"option": "Retain observation-only selection", "reason": "It creates an avoidable conflict with the explicit assertion fact for mixed requirement/failure statements."},
    {"option": "Delete the independent claimed-class check", "reason": "Criterion 5 still requires a finding when a primitive caller claims new against a failure."},
    {"option": "Rewrite old baseline or admission receipts", "reason": "It destroys recovery history and misrepresents what the older subject judged."}
  ],
  "reopenWhen": "An explicit failure in any executable role avoids reproduction, a claimed-new conflict reaches source effects, or an unassessed legacy run resumes a later primitive."
}
```

## WO-123-D039 — Final assessment boundary outcome

```json
{
  "id": "WO-123-D039",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-004; adjacent-0006 revision 2",
  "decision": "Retain the source-bound explicit assessment implementation after complete current-subject composition, fresh product and documentation gates and final-source live feedback pass. The implicit English grammar is removed. Close the diagnosed queue item on actual evidence, preserve every diagnostic run and prior verification, and hand off for separate independent verification. Do not describe tagged fixture controls as a model accuracy evaluation.",
  "evidence": [
    "Final composition 151/151, zero failures/skips, 540.916 seconds, code identity f6a2f75a61c444b205abd06ef8f72ef0097bac2bd72297a592ebb8bd2ced0da1. Its 104 explicitly annotated source/role/producer combinations test execution and validation, not semantic model accuracy.",
    "Both entries hold missing/incomplete/unresolved/stale judgments without baseline/source/remote effects. Existing failures reproduce across statement roles; deliberately conflicting primitive-new claims retain the required finding and zero later effects. A requirement describing a bug completes the defect loop without a role correction. Eleven healthy controls complete all fourteen steps. Old runs already past baseline hold before source-change and publish while preserving all historical receipts. A refiled intent with a resolved judgment recovers without rewording the source.",
    "Product: 39 suites, 89 fresh tasks, 0 reused, exit 0, 756.579 seconds. Documentation: exit 0, 39.782 seconds. Times include scheduler and host waiting.",
    "Final source regeneration: all 18 commands pass in 57.480129959 seconds. Fresh live feedback configured codex-cli-exec, gpt-6.1-sol, max completes ten fixtures after final judged-source edits. Editions 008 and 009 are earlier incurred work; 010 is current.",
    "The first structural prototype passed 145 tests in 536.340468458 seconds; it predates all-role selection and the post-baseline legacy guard and is diagnostic only. D035/D036 preserve the red challenges after grammar-suite passes. The economy decision D002 remains declined/kept-current, no second experiment or saving claimed.",
    "One writer, zero collaboration agents. Current source/test identity tracks the seventeen validated paths; no branch commit, external dependency, live target publication or criterion waiver. Local release remains v0.67.0, skeleton 0.53.0, beacons 0.1.1. Final fixture roots are normally removed; canonical nested-repository inventory has no undeclared material."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The pre-source boundary now consumes saved meaning judgments, makes uncertainty a stop, and routes explicit failures directly to reproduction. It preserves the source-to-deliverable continuation needed by WO-112/WO-118.",
    "traps": "D037/D038 comparisons stand. Actual outcomes remove lexical fallback and redundant role correction without weakening authority, reproduction, review or publication. Rule beating is constrained by fresh subject identity, zero-effect assertions, migration and preserved diagnostic failures; no claim of model accuracy or independent verdict is made. Commons cost includes every earlier passing/red run, the structural prototype, final composition, fresh gates and required live episodes. Escalation adds no gate or provider. The implementation serves correct routing instead of phrase coverage.",
    "naiveInterventionism": "The compiler, issue screen, intent filing, portfolio/grants and primitive protocols stay intact. Existing receipts remain history, and unassessed legacy work stops before its next primitive.",
    "noOp": "The four independently observed lexical failures and two additional red challenges make retaining the parser unjustified; current-subject outcomes support the structural replacement."
  },
  "rejected": [
    {
      "option": "Publish a guarantee of near-99% cheap/local-model semantic accuracy",
      "reason": "No such producer or accuracy evaluation ran. The runtime consumes reviewed model/operator judgments; this audit evaluates feedback source conformance, not issue-classification accuracy."
    },
    {
      "option": "Mark the work order independently verified or closed",
      "reason": "This executor supplies a repair result only. The separate verifier/reviewer dispatches own their verdicts."
    }
  ],
  "reopenWhen": "A stale, malformed, incomplete or unresolved assessment reaches a primitive; a failure tagged in any executable role skips reproduction; a conflicting-new claim proceeds; or a legacy run bypasses the pre-effect hold. A proposed automatic classifier must be judged on measured task-specific semantic accuracy."
}
```

## WO-123-D040 — Verification: pass; source-bound assertion judgments discharge criterion 5

```json
{
  "id": "WO-123-D040",
  "date": "2026-10-05",
  "dispatch": "resume: verify; VER-005",
  "decision": "Pass VER-005. All eight criteria are met at code identity f6a2f75a61c444b205abd06ef8f72ef0097bac2bd72297a592ebb8bd2ced0da1. F6 is repaired by changing how the composition knows what a statement means, not by adding more wording. D037 and D038 replace the lexical classifier with a reviewed baselineAssessment bound to the compiled contract and statement identities. An existing-failure judgment selects defect in any executable role, and the defect must reproduce. A primitive claiming new against that judgment is criterion 5's finding. Missing or unresolved judgments hold at baseline before any snapshot, worker, push or pull request. Stale or malformed judgments hold at contract. VER-004's repair rule ('selected defect, or held before source work, never silently new') holds for every judgment state the composition can receive. The order requires the class to come from the StoryContract with its source recorded, as WO-180 D013 asked. It does not require the composition itself to parse English. Like D005's supplied statement classes, the judgment is reviewed per-issue input bound to the exact source revision. A wrong no-existing-failure judgment therefore walks as new, with its producer and assessment hash recorded. That is the producer's accuracy boundary, not a defect of this order. vertical.json and its runtime are new in this order, so the added field changes no earlier contract. The judged criteria and earlier reports are unchanged.",
  "evidence": [
    "Code identity computed with gateCodeIdentity equals the executor's fresh, complete npm test -- --review row (39 suites, 89 fresh tasks, exit 0, 2026-10-05T20:29:22.820Z) and the test:docs row (exit 0, 2026-10-05T20:31:36.316Z). Untracked paths are under docs/ only.",
    "git diff against refs/dotln/checkpoint/WO-123/15 (VER-004's subject): the repair changes only vertical.ts, vertical-host.ts, vertical-primitives.mjs, vertical-runtime.mjs, the vertical fixture and suite, the skeleton README, product 07, one publication TOC line and regenerated console fixtures. No path-identity guard, resident-state, portfolio or dotln.ts source changed.",
    "Independent composed probe (ver005-probe.mjs in the DotLn session scratch), bounded exit 0, 2026-10-05T20:46:10.221Z-20:47:17.376Z, driving the executor's verticalFixture through runVerticalIssue and ResidentHost with advancing time. 'The response status is 500' as an observation and as a requirement, and an unquoted 'Checkout totals are off by one cent for EUR orders' as a requirement (operator) and observation (resident), each with an existing-failure judgment: storyClass defect, outcome reproduced, findings [], all 14 steps, terminal resolved, one launch, one push, one PR. The same F6 wording judged no-existing-failure walks as new to resolved, with producer and assessment hash recorded. A missing assessment holds at baseline in both entries (unsupplied producer; zero baseline, verification and review dispatches, launches, pushes and PRs). Adding a judgment to vertical.json afterwards leaves the held run byte-identical. An unsupplied producer resolving a statement, and judgments bound to a contract compiled with different roles, hold at contract. A model-produced assessment with one unresolved statement holds at baseline.",
    "Direct probe on the rebuilt module, bounded exit 0, 2026-10-05T20:46:02Z: baselineClass(contract, 'new', existing-failure requirement) gives defect with the finding 'contract names failing behavior but baseline was classed new'. Failure plus unresolved selects unresolved. A judged non-requirement, a string schemaVersion, a multi-line rationale and a non-array assertions field each give 'baseline assertion assessment is invalid or stale' with no hash.",
    "Sequential bounded checks 2026-10-05T20:48:13Z-20:48:24Z, all exit 0: authority --check (WO-123 revision 010), artifact identity, verification, feedback --check (WO-123 revision 010; 'Live feedback audit docs/evidence/WO-123/feedback-010 judged the current source'), console fixtures, harness check, npm run publication:check and release check-surfaces --local. git diff --check and git diff --cached --check are clean. All four current editions select WO-123 revision 010. regeneration-010.json records the live feedback episode at 2026-10-05T20:04:12.604Z on codex-cli-exec, gpt-6.1-sol, max, after vertical.ts and vertical-host.ts were last written (20:02:24Z per validation.json).",
    "Test names in the staged suite versus the working tree: four removed cases tested the removed lexical classifier and are replaced by assessment, legacy-guard and composed-judgment cases. No path-identity, admission, convergence, stop, review or readiness case was removed. The diff adds no lint or type suppression. Manifest changes are component versions and internal pins only.",
    "The 'operator authorizes an entire refactor' basis in D037 is executor-attested (docs/control/local/adjacent-work.jsonl seq 46 states 'actor-attested conversation evidence, not an inbox readback'). This verifier did not observe the operator's words. The verdict does not rest on that authority, because the change stays inside the order's declared surfaces and criteria."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "WO-112 and then WO-118 need a baseline that reproduces a defect or stops before source work, and a healthy story that completes. Both entries now do so for every judgment state, and uncertainty is a stop instead of a silent new story.",
    "traps": "Rule beating: the judgment could become a label that only the suite checks. The probes therefore drive the composed runs, their effects and both entries, not the passing count, and record that a wrong judgment walks. Seeking the wrong goal: the measure is routing before source work, not wording coverage. Fixes that fail and policy resistance: four lexical repairs failed. The structural route VER-004 asked to be compared is judged on its own behavior, and missing input no longer defaults to new. Escalation: no new criterion, family or producer is demanded of this order. Drift to low performance: the reproduction standard and the classed-new finding are kept. Success to the successful: the D027 alternative that VER-004 reopened is accepted on new evidence, not because it is newer. Shifting the burden: semantic accuracy moves to the judgment's producer. This is stated as a limit, and the planner follow-up names the downstream orders that must supply it. The commons: one writer, zero subagents, sequential bounded probes and the matching product gate consumed rather than rerun.",
    "naiveInterventionism": "The verifier edits no implementation, criterion or earlier report. It adds this decision, VER-005 and one planner follow-up for downstream orders.",
    "noOp": "Refusing to record a verdict would leave WO-112 blocked on a subject that meets its criteria, with no new evidence to justify the delay."
  },
  "rejected": [
    {"option": "Fail criterion 5 because a wrong no-existing-failure judgment walks", "reason": "The order takes the class from reviewed, supplied contract inputs (D005, WO-180 D013). A wrong judgment is a producer error with its source recorded, of the same kind as a wrong supplied statement class. No criterion requires the composition to be its own semantic producer."},
    {"option": "Require missing judgments to hold at admission (IntentHeld) rather than at baseline", "reason": "Criterion 1 lists its held inputs as a declared set, and a missing judgment is not in it. The baseline hold occurs before any baseline, source or remote effect, which the repair rule requires."},
    {"option": "Rerun npm test", "reason": "The current code identity equals the executor's fresh, complete passing row. The gate is rerun only to reproduce a finding or on an identity change."},
    {"option": "Ask the operator to confirm D037's authorization", "reason": "The verdict does not depend on it. The input is this order's own configuration, and the criteria are unchanged."}
  ],
  "followup": "Planner: WO-112's labeled inference episode and WO-118's interpretation of the filed intent must also produce each issue's baselineAssessment (vertical.json issues[].baselineAssessment, packages/skeleton/README.md §Vertical continuation) next to its inferences, bound to the compiled contract. Without it the run holds at baseline with 'baseline assertion classification is unresolved'. Amend those orders' text when they are next planned. Choosing an automatic producer stays under D005's and D037's reopening conditions.",
  "reopenWhen": "A missing, unresolved, stale or malformed judgment reaches a baseline, source or remote effect; an existing-failure judgment avoids reproduction; a primitive claim of new against a failure judgment proceeds; an unassessed legacy run passes its next primitive; or final review finds that the order requires the composition itself to infer failure from English."
}
```

## WO-123-D041 — Integrate main at c44ba6c6 during final review

<!-- integration refs/dotln/checkpoint/WO-123/22 -->

```json
{
  "id": "WO-123-D041",
  "date": "2026-10-05",
  "dispatch": "resume: final review; worktree integrate WO-123",
  "decision": "Integration mechanics are complete in the final-review worktree. HEAD fast-forwarded from 2816c773 to main at c44ba6c6 (WO-186, v0.66.3), and the named stash re-applied this order's uncommitted work. D042 records the five authored resolutions, the component-version assessment, the revision 011 re-mint, the affected checks and the integrated product gate.",
  "evidence": [
    "refs/dotln/checkpoint/WO-123/22",
    "base 2816c773008c66b8ab0ac4a0fd73c21b7df9f2d0",
    "upstream c44ba6c60d7a3049f15edc4ce106b2dcc518b551",
    "release preparation: WO-123 target v0.67.0 remains current. Files changed: docs/evidence/WO-123/meta.json, docs/final-reviews/WO-123/PR.md. Meter snapshot: docs/evidence/WO-123/meta.json, 4515 bytes. Tag observation: local snapshot only."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-05. Original base: `2816c773008c66b8ab0ac4a0fd73c21b7df9f2d0`.
Fetched main: `c44ba6c60d7a3049f15edc4ce106b2dcc518b551`. Checkpoint: `refs/dotln/checkpoint/WO-123/22`.
Named stash retained: `8cf2bac4faa230c23b23cc0877c581553ce8a186` (WO-123 integrate 2026-10-05).
Resolved projections: .claude/harness-manifest.json, .claude/hooks/commit-msg.mjs, .claude/hooks/concurrent-work-requires-worktrees.mjs, .claude/hooks/finish.mjs, .claude/hooks/no-attribution.mjs, .claude/hooks/no-lint-type-disables-as-fixes.mjs, .claude/hooks/permission-denied.mjs, .claude/hooks/permissions.mjs, .claude/hooks/presence-posttooluse.mjs, .claude/hooks/presence-pretooluse.mjs, .claude/hooks/presence-stop.mjs, .claude/hooks/presence-userpromptsubmit.mjs, .claude/hooks/read-observer.mjs, .claude/hooks/session.mjs, .claude/hooks/write-observer.mjs, README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/README.md, packages/console/fixtures/expected/selfhost.html, packages/console/fixtures/expected/selfhost.json, packages/console/fixtures/expected/selfhost.txt.
Release preparation: WO-123 target v0.67.0 remains current. Files changed: docs/evidence/WO-123/meta.json, docs/final-reviews/WO-123/PR.md. Meter snapshot: docs/evidence/WO-123/meta.json, 4515 bytes. Tag observation: local snapshot only.
Carried-forward claims: completed by the final reviewer in D042. Every non-document path that differs from checkpoint 21 (VER-005's subject plus the dispatch's projections) is a path upstream also changed, so the authored WO-123 source bytes carried into the integration unchanged; criteria 1 to 7 carry forward on VER-005's evidence and the integrated gate. Criterion 8 is judged on this review's own gates.
Authored conflicts observed: docs/evidence/current.json, package-lock.json, packages/console/fixtures/manifest.json, packages/console/package.json, packages/skeleton/package.json.
Affected checks were printed by the command and executed on the integrated tree, as D042 records.

## WO-123-D042 — Integration resolutions, retained versions and the integrated gate

```json
{
  "id": "WO-123-D042",
  "date": "2026-10-05",
  "dispatch": "resume: final review; worktree integrate WO-123",
  "decision": "Resolve the five authored conflicts as bookkeeping, keep the order's release under its minor classification, and re-mint the editions upstream's compiler release staled. The evidence selector keeps this order's editions. The skeleton keeps 0.53.0 above upstream's 0.52.3, the beacons keep 0.1.1 above 0.1.0, and the compiler takes upstream's 0.25.2 because this order changes no compiler source. The console pins skeleton 0.53.0, and the lock file carries the same three versions. The console fixture capture keeps upstream's WO-186 sentence beside this order's ten edition sentences, and its self-hosted input follows this order's current feedback edition. v0.67.0 remains above upstream's v0.66.3, so no retime was due. Authority, artifact identity and verification revision 010 were stale only by the compiler's release label, so revision 011 re-minted them deterministically. Feedback revision 010's own check named a moved policy hash and prescribed a carry, so revision 011 carries its live audit with no live episode.",
  "evidence": [
    "npm run worktree -- integrate WO-123: checkpoint refs/dotln/checkpoint/WO-123/22, named stash 8cf2bac4faa230c23b23cc0877c581553ce8a186, bases 2816c773 -> c44ba6c6; authored conflicts docs/evidence/current.json, package-lock.json, packages/console/fixtures/manifest.json, packages/console/package.json, packages/skeleton/package.json. --continue regenerated the runtime, harness bundle, control projection, release preparation, decisions index, register, meta, work-order index, publication locks and console fixtures, with no authored conflict left.",
    "git diff --name-only refs/dotln/checkpoint/WO-123/21 against the working tree, outside docs/: 63 paths differ, and every one is a path upstream changed between 2816c773 and c44ba6c6. The merged scripts/test-runner.mjs and scripts/test-runner.test.mjs keep this order's vertical suite registration and its OUTSIDE_CONFINEMENT inventory row.",
    "Edition checks before the re-mint, each bounded: authority revision 010 stale (compilerPackageVersion 0.25.1 vs 0.25.2); artifact identity 010 stale on four files; verification 010 stale; feedback 010 'a compiler release moved the policy hash ... carry its live audit into a new edition ... (no live episode)'. After selecting revision 011: authority --write, artifact-identity --write, verification --write and feedback --carry docs/evidence/WO-123/feedback-010 ('only component release labels moved; no live episode') each exit 0, and the console fixtures were re-recorded.",
    "Affected checks on the integrated tree, each bounded, all exit 0: authority, artifact identity, verification and feedback --check at revision 011, console fixtures --check, node scripts/harness.mjs check, npm run publication:check, npm run release -- check-surfaces --local.",
    "npm test -- --review on the integrated tree at code identity 3877cc12d75afd9eeb00409024d4e5d75fcdcf7f3885bafa91f7bb7454da1eef: 34 passed, 0 failed, 862.37 s, 84 fresh tasks, recorded 2026-10-05T21:40:28.277Z, including the vertical suite (666.83 s). This gate preceded D043's fix; D044 records the final gate."
  ],
  "rejected": [
    {"option": "Select upstream's WO-186 editions", "reason": "They predate this order's registered sources (vertical.ts, resident-state.ts, portfolio.ts and the source-change guards) and would not judge the integrated tree."},
    {"option": "Run a live feedback episode for revision 011", "reason": "The feedback check judged the behavior unchanged and named the carry; the order's live episode follows a judged-source edit, which D043 then made and revision 012 records."},
    {"option": "Retime the release", "reason": "v0.67.0 is above upstream's v0.66.3 and skeleton 0.53.0 above 0.52.3; nothing collided."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "WO-112 and WO-118 build on main; integrating now publishes the composition on the current base.",
    "traps": "Rule beating: the old VER-005 row is not a proxy for the integrated tree, so the gate ran fresh. Drift to low performance: stale editions are re-minted rather than relabelled. Shifting the burden: conflicts are resolved here, not left to the release close. Commons: one writer, sequential bounded checks. Escalation and success to the successful: no new producer or check. Policy resistance and seeking the wrong goal: the measure is a passing integrated subject, not a clean merge alone.",
    "naiveInterventionism": "No behavioral source changed during integration; the resolutions touch only versions, selectors and fixture capture.",
    "noOp": "Without integration the branch would publish against an outdated base and stale editions."
  },
  "reopenWhen": "An authored resolution changes behavior, a component label collides with a later upstream release before publication, or an edition check fails on the published subject."
}
```

## WO-123-D043 — Final review fixes, written under the operator's direction and reviewed independently

```json
{
  "id": "WO-123-D043",
  "date": "2026-10-05",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Fix in this final review the defects it reproduced inside the order's own surfaces, instead of returning the order to repair, because the operator directed it. (F1) Two filed drafts that reference one issue whose entry has no draftId were both admitted by the resident and ran two complete continuations, while the command refused the same input. Both entries now share one selection rule, draftsFor: an entry without draftId selects only drafts that reference its issue and that no other entry names, and the resident records a durable admission hold when another selectable draft exists. (F2) decodeBaselineAssessment sorted judgments with a bare localeCompare, so the binding key depended on the process locale; it now uses the compiler's compareText. (F3) verticalTransport read its kill flag only before awaiting launch authority; it now checks again after the await. (F4) The skeleton README said a continuation saved before baselineAssessment holds before its next primitive through either entry; in fact the resident ledger refuses to replay its admission, and the README now says so. (F5) readVerticalConfiguration read the target's origin inside a catch-all, so a momentarily unreadable target became a permanent IntentHeld for every configured draft, contradicting D024. Now a target that cannot be read is no decision: the configuration loads, the command returns a transient refusal before it matches or files a draft, and the resident leaves the draft undecided and retries. A readable target whose origin is missing or names another forge still refuses at configuration read in both entries, before any draft is filed or a saved run resumes, and the resident, which reads its configuration once, checks the origin again before it prepares a draft. (F6) target and worktreeParent were checked with realpathSync.native alone, which keeps a volume alias, so an alias spelling loaded and was retried forever; both must now equal /bin/pwd -P in the directory, as D003 requires of the guards. (F7) dotln vertical printed the whole paused state (410,143 bytes in one probe, with the issue text and absolute paths); it now prints the step position only. The README also states that a running resident reads vertical.json once at start.",
  "authorization": "Mid-review, after this review reported the reproduced duplicate-draft defect and two subagent reviews, the operator wrote to fix it and to spawn subagents to review the fix. That direction overrides the role rule that a reviewer does not write and certify a behavioral fix. The rule's purpose is kept by independent review: read-only reviewer subagents with fresh contexts judged each batch of the fix, another confirmed the remaining suspects with probes, and the product gate and a fresh live feedback edition judge the result. No criterion, earlier report or waiver changes.",
  "evidence": [
    "F1 reproduction before the fix (final-review probe, bounded, 2026-10-05T21:41:54Z-21:42:42Z): issue 1's entry without draftId and drafts WO-900 and WO-901 both referencing it; the resident admitted both (keys 605a067b..., 65e6ece0...) and each store reached 14 receipts. The command on the same input refused: 'issue matches more than one filed draft'.",
    "First fix reviewer: the first F1 rule also counted a draft that another entry names by draftId, so a follow-up draft citing issue 1 held WO-900 permanently; the refined rule excludes drafts another entry names, as issueFor does, and refuses only when another selectable draft exists.",
    "F2 reproduction (assessment reviewer, bounded probe): the same input decoded under en_US gave order [aa..., b...] and hash 0baa7a2c53961a26, and under da_DK and nb_NO [b..., aa...] and 783877c06903743c; the IntentAdmitted fold re-runs admitIntent and compares bindings, so replay under the other locale throws.",
    "F3 reproduction (bounded probe against checkpoint 21's transport): a kill() issued while active(true) was awaited still launched the child (launches 1, receipt resolved); the fixed transport refuses it (launches 0, 'vertical child launch is no longer admitted').",
    "F4: resident-state.ts throws 'intent admission differs from its recorded inputs' when a recorded binding lacks baselineAssessment, because admitIntent always sets it; the host guard is reachable only behind that refusal.",
    "F5 reproduction (remaining-suspects reviewer, probe s3): with the target's .git renamed only while vertical.json was read, the resident recorded IntentHeld admission 'registered intent portfolio or grants could not be decoded or bound', still held after the condition cleared and in the command. F6 (probe s4b): a /System/Volumes/Data alias target loaded; the command returned NeedsHuman surfaces 'target must be a clean Git root' and the resident retried 12 ticks over 80 simulated minutes. F7 (probe s8): a paused run printed 410,143 bytes.",
    "Second-batch reviewer (bounded probes against the current and the pre-review runtime): moving the origin check wholly into preparation made the command file a draft before refusing a mismatched origin, and let an operator restart resume a saved run after the origin changed; the pre-review runtime refused both before any effect. The third batch restores the configuration-read refusal for a readable target and keeps the transient handling for an unreadable one.",
    "New tests in scripts/test-vertical.mjs: a child killed while launch authority is read; judgment order under en_US and da_DK; two filed drafts held by the resident and refused by the command; a draft another entry names does not count; an unreadable target leaves the draft undecided and is admitted once readable; a volume-alias target is refused at configuration read; a mismatched origin refuses the command before it files a draft or resumes; the resident holds a draft whose origin changed after its configuration was read; a draft that leaves the filed set during a tick is not reported as a duplicate. The first reviewer ran the first three against checkpoint 21 copies and each failed there; the second ran the duplicate, unreadable-target and alias tests against the pre-review runtime and each failed there. Focused run after the third batch: 18 of 18 related cases pass, including the declared-negative, durable-hold, preparation-failure, operator-first restart, undecodable-issue and transient-preparation cases.",
    "Evidence revision 012 was minted after the first batch with a live feedback episode; the second batch edited vertical.ts again (compareText), so revision 013 re-mints every edition with a fresh live episode on codex-cli-exec, gpt-6.1-sol, max. regeneration-012.json and regeneration-013.json record the commands."
  ],
  "rejected": [
    {"option": "Fail the review and return the order to repair", "reason": "The operator directed the fix in this session. Without that direction it would be the rule-consistent route, as WO-185's final review took."},
    {"option": "Hold the duplicate drafts transiently", "reason": "An entry that can select two drafts is a property of the intent's own inputs, which D024 makes a decision; durable matches 'draft has no unique configured issue binding'. A new draft bound by draftId recovers."},
    {"option": "Re-read vertical.json on every resident tick", "reason": "It restructures how both entries share the configuration and binding drift checks; the README now states the restart, and D044 carries the change as a follow-up."},
    {"option": "Change kill-on-return into a resumable interruption", "reason": "VER-001 to VER-002 judged the killed-step provenance against R1's rule; changing it is a product decision for D044's follow-up, not a defect fix."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "WO-118's unattended run inherits the resident path; duplicate runs, locale-dependent identities, permanent holds on transient reads and unrefused aliases would each surface there first.",
    "traps": "Rule beating: each fix has a test that fails on the earlier code, not just a passing count. Fixes that fail: the first F1 rule's false positive was caught by independent review and corrected before the gate. Escalation: only defects reproduced in this order's surfaces are fixed; S6, S9, S10 and WO-184 D038 G1 stay follow-ups. Shifting the burden: the operator does not wait for another repair cycle for defects this review can fix and have reviewed. Drift to low performance: the live feedback edition is re-minted after every judged-source edit. Commons: five read-only reviewer subagents against a cap of 20, each judging a batch of items, and one writer. Success to the successful and seeking the wrong goal: the verdict rests on the reviewed fix and the final gate, not on VER-005's earlier pass.",
    "naiveInterventionism": "Changes stay in vertical.ts, vertical-runtime.mjs, vertical-transport.mjs, dotln.ts, the skeleton README and the suite; no guard, fold, portfolio or primitive contract changes.",
    "noOp": "Publishing without the fixes would ship a resident that can open two pull requests for one issue."
  },
  "reopenWhen": "An entry selects two drafts in either entry, a binding key differs by host locale, a kill during launch authority starts a child, an unreadable target produces a durable hold, a mismatched origin files a draft or resumes a saved run, an alias-spelled target or worktree parent loads, or a paused command prints the binding or bundle."
}
```

## WO-123-D044 — Final review pass, dispositions and follow-ups

```json
{
  "id": "WO-123-D044",
  "date": "2026-10-05",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Pass WO-123 on its eight original criteria at the integrated and fixed subject, code identity b917af6db6a9a3b718c2d69144a6cea9c11e1ce4f6da86d99ba61aaf1bc1dd67. Criterion 5 does not require the composition to infer failure from English: the Design takes the story class from the StoryContract, WO-180 D013 asked the composition to read it from WO-061's contract, whose classifications D005 records as caller-supplied, and the order adds no inference primitive. A reviewed baselineAssessment bound to the compiled statement identities is that input, so D040's reopening condition is not met. D037's operator authorization stays executor-attested and the verdict does not rest on it. D043's seven fixes hold under three batches of independent review and this gate. Five items found here stay outside the fix: they are recorded with conditions in this decision's follow-up. Register rows this order opened and its repairs discharged are settled, and rows naming WO-123 that it did not discharge keep or gain a condition.",
  "evidence": [
    "npm test -- --review at code identity 84b33b5d... after the third fix batch: 34 passed, 0 failed, 915.21 s, 84 fresh tasks, recorded 2026-10-05T22:29:17.078Z. After D045's whitespace-only formatting of the suite, npm test -- --review at the final identity b917af6d...: 34 passed, 0 failed, 986.91 s, 84 fresh tasks, recorded 2026-10-05T23:20:06.500Z; the vertical suite passed in 695.34 s. git diff --cached --check exit 0 before each gate.",
    "Evidence revision 013 (regeneration-013.json): authority, artifact identity, verification and feedback written and checked, a live feedback audit on codex-cli-exec, gpt-6.1-sol, max completing ten fixtures in 42.0 s after the last vertical.ts edit, console fixtures, harness check and publication check, all exit 0; the release-surface check passed on its recorded rerun after the reviewed notes' placeholders were corrected. vertical.ts did not change after that episode.",
    "The recorded reportHash of VER-001 to VER-005 each equals the report's SHA-256. The order differs from main only in its heading's version label.",
    "WO-180 D013 followup: 'it reads the class from WO-061's StoryContract once landed ... records the class and its source with the baseline receipt, and a story whose contract names a failing behavior but is classed new is a finding.' WO-123 D005 evidence: 'WO-061 classifications are caller-supplied inferred entries'; rejected 'Classify unknown issue text as requirements automatically ... invent a new inference primitive'.",
    "docs/control/local/adjacent-work.jsonl seq 46: 'actor-attested conversation evidence, not an inbox readback'.",
    "Remaining-suspects reviewer probes s6, s9b and the in-flight kill test: a killed resolution repair leaves a worktree registration; a running resident admits with its start-up vertical.json and durably holds a draft for an issue added later; a kill-on-return ends the continuation as refused with a host-failure reason.",
    "WO-184 D038's G1 (code reading in WO-184's review): writerSandboxProfile in discovery-sandbox.ts leaves .git and claude.local.md writable to the confined test command; discovery-sandbox.ts and worker-transport.ts are outside this order's criteria and declared surfaces."
  ],
  "rejected": [
    {"option": "Fail criterion 5 because a wrong no-existing-failure judgment walks", "reason": "The class comes from a reviewed input with its producer and hash recorded, as the Design and WO-180 D013 ask; the composition's own finding and reproduction rules hold."},
    {"option": "Fix the five remaining items in this review", "reason": "Each needs a product choice (S10), a restructuring of the shared configuration (S9) or a change outside this order's surfaces (G1); the resolution-repair registration is D005's declared crash window, and the placeholder holds are pre-existing designed behavior. None breaks a criterion."},
    {"option": "Rerun the live feedback audit after the third batch", "reason": "The third batch changed only scripts/lib/vertical-runtime.mjs, the README and the suite, none a judged or registered source; feedback --check judged revision 013 current."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Passing publishes the composition WO-112 and WO-118 need, with the defects their unattended path would meet first fixed and the rest named.",
    "traps": "Rule beating and seeking the wrong goal: the verdict rests on probes of both entries, the fixes' discriminating tests and a fresh gate, not on VER-005's count. Drift to low performance and shifting the burden: each unfixed item has a condition and an owner. Escalation: no new criterion or scope is added. Policy resistance, commons and success to the successful: D043 records how the operator's direction and the reviewer rule were reconciled.",
    "naiveInterventionism": "No product document, criterion or earlier report changes in this decision.",
    "noOp": "Without a recorded result the branch cannot be published, and WO-112 stays blocked on a subject that meets its criteria."
  },
  "followup": "Planner, with WO-118's planning and before its unattended run: (1) the resolution repair's raw git worktree add --detach under the store path (scripts/lib/vertical-primitives.mjs, near lines 718-737) has no directory-identity check, and a kill between the add and its removal leaves a registration; prune or remove a leftover before adding and check identity first. (2) A running resident reads vertical.json once at start (packages/skeleton/src/dotln.ts), so an issue added later durably holds its draft as having no configured binding; re-read issue bindings and inferences at each preparation, or keep the documented restart. (3) Under a kill return policy an operator's return ends the in-flight continuation as refused with '<step> host failed or was unavailable', while product 03 says 'then holds later steps'; decide whether a return-kill is a resumable interruption, or give it a distinct reason. (4) When registered authority cannot be decoded or bound, the resident's drafts() lists configured draftIds and unreadable-issue placeholders, so holds can be recorded for ids never filed, and the command's refusal names no cause ('registered intent portfolio or grants could not be decoded or bound', also for a mismatched origin); record one store-level hold that names its cause. A target that is not itself a Git root but sits inside another repository has its parent's origin judged before the clean-root check. (5) WO-184 D038's G1 and G2 (FUP-c4e2db6d99a13eb7) remain: settle them before the first live Claude writer run through the vertical (WO-112), or run live workers on codex-cli-exec until then.",
  "reopenWhen": "A probe or live run shows criterion 5's finding or reproduction rule failing for a supplied judgment, a D043 fix regresses, or one of the five follow-up conditions occurs in WO-112's or WO-118's run."
}
```

## WO-123-D045 — Condense the product 07 write-backs and raise its ceiling by the remainder

```json
{
  "id": "WO-123-D045",
  "date": "2026-10-05",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Resolve the product 07 ceiling collision the integration exposed by the route the operator chose: condense WO-123's 07 write-backs to what criterion 6 names, the dotln vertical command, the resident's admission with its standing-authorization statement and the intent portfolio class, leaving the details in the skeleton README, then raise 07's ceiling by the remainder, 1,176 bytes, from 166,907 to 168,083. The planning document docs/planning/wo-123-integration-ceiling-2026-10-05.md section 1 records the decision that docs/control/doc-ceilings.json cites. Also reformat the suite with Prettier, which the document gate's format check required; the change is whitespace only.",
  "authorization": "Asked during the review which way to resolve the collision, the operator chose 'Trim, then raise ~1.2 KB' over raising the full 3,343 bytes or stopping for a planning pass.",
  "evidence": [
    "npm run test:docs at code identity 84b33b5d... (recorded 2026-10-05T22:47:48.633Z): docs-check 'docs/product/07-execution-guide.md: 3343 bytes over ceiling'; format '[warn] scripts/test-vertical.mjs'.",
    "Product 07 sizes: 163,471 bytes at base 2816c773; 166,877 at main c44ba6c6 (WO-186 added 3,406 against its 700-byte reservation); 166,844 at checkpoint 21 (WO-123 added 3,373 against its 2,900-byte reservation); 170,250 merged; 168,083 after condensing, 1,206 bytes above main.",
    "docs/control/doc-ceilings.json policy: 'An increase requires a resolving planning-document decision in the entry'; scripts/docs-check.mjs planningDecision requires a docs/planning path with a resolving anchor. WO-170 and WO-176 fitted owned write-backs inside an unchanged ceiling; here 30 bytes remained, fewer than any write-back criterion 6 names."
  ],
  "rejected": [
    {"option": "Raise the full 3,343 bytes", "reason": "The README already carries the detail; the operator chose the smaller raise."},
    {"option": "Shorten other orders' text in 07 to make room", "reason": "The ceiling policy lowers a ceiling by what consolidation frees, so it cannot make room, and the text is not this order's."},
    {"option": "Stop for a planning pass", "reason": "The operator chose to resolve it in this review."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The integrated subject must pass its document gate to publish; criterion 6's write-backs stay in place.",
    "traps": "Rule beating: the write-backs keep what criterion 6 names rather than being cut to fit a count. Drift to low performance: the raise is the smallest that fits and stays within WO-123's reservation. Shifting the burden: the collision is resolved here, with the next planning pass resetting the ceiling. Escalation: no other order's text changes.",
    "naiveInterventionism": "Only WO-123's own paragraphs in 07 and the one ceiling entry change.",
    "noOp": "The document gate refuses the result transition while 07 is over its ceiling."
  },
  "reopenWhen": "The next planning pass measures 07 and resets its ceiling from the write-backs still queued, or a reader needs a detail the condensed write-back moved to the README."
}
```
