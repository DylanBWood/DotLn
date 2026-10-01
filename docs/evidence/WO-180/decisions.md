# WO-180 decisions

The implementation is executor evidence; independent verification and final review remain separate dispatches.

## WO-180-D001

```json
{
  "id": "WO-180-D001",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Reuse prepareWorktreeVerification and VerificationHost for a baseline episode, with the episode context pinned beside the unchanged compiler capsule in the persisted command. The host derives BaselineWitnessed from its named-test witnesses, never from worker prose. A candidate comparison reports typed baseline findings and refuses a pass for a defect test that did not fail as named on the base. The composition consumes a typed baseline disposition before implementation; this order proves that sequence with a double.",
  "evidence": [
    "WO-180 design and criteria 1–6; product 03 VerificationAdapter and DeliveryAdapter; product 06 Source-to-deliverable vertical",
    "verification-worktree.ts already seals the base and executes every named test in an independently confined copy; verification-host.ts dispatches and admits compiler-pinned read-only capsules",
    "reactor.ts records baseline identity and coverage but does not compare baseline outcomes with candidate outcomes; compiler verification.ts closes snapshot evidence and its host-test provenance",
    "WO-123 already declares WO-180 as a hard dependency and names the baseline step in its objective; the composition remains a later order"
  ],
  "alternatives": ["Pinned episode context on the existing host", "New compiler claim or capsule role", "Separate host and acceptance reducer", "Run in the implementer checkout", "NoOp"],
  "rejected": [
    {"option": "New compiler claim or role", "reason": "The baseline is another subject of existing host-run behavior evidence; the order explicitly keeps compiler claim types unchanged."},
    {"option": "Separate reducer", "reason": "Would duplicate lease, authority, recovery and acceptance paths."},
    {"option": "Implementer checkout", "reason": "Does not establish the sealed base and admits mutable implementation context."},
    {"option": "NoOp", "reason": "A candidate pass still supplies no proof that the named regression failed before the change, blocking the promised vertical."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Establish the before-change witness consumed by WO-123 and the independently verified source-to-deliverable loop, reducing operator diagnosis of repairs that never witnessed their reported defect.",
    "traps": {
      "policyResistance": "Keep host ownership and compiler claim admission; baseline completion cannot certify candidate acceptance.",
      "tragedyOfTheCommons": "One writer, no delegated agents; settle judged sources before the required live feedback audit.",
      "driftToLowPerformance": "Require the named nonzero exit, not merely worker success or an unavailable test.",
      "escalation": "Reuse the existing host and evidence gates; no extra workflow gate or approval ritual.",
      "successToTheSuccessful": "Reuse follows observed confinement and recovery behavior, rather than incumbent investment alone.",
      "shiftingTheBurden": "A typed non-reproduction stop reaches composition before implementation; the operator need not infer it from prose.",
      "ruleBeating": "Worker-authored baseline rows refuse; candidate passes cannot hide a non-failing baseline test.",
      "seekingTheWrongGoal": "Prove before/after behavior and honest limitations, rather than count episodes or receipts."
    },
    "naiveInterventionism": "Preserve legacy capsule bytes and old streams when the optional episode context is absent. Probe with the existing synthetic two-clause repository before live harness rows.",
    "noOp": "Leaves the selected baseline gap intact; reopen if the existing host can already establish and expose the same before-change proof."
  },
  "reopenWhen": "The composition needs a baseline witness kind beyond named host-run tests, or historical streams change without episode context."
}
```

## WO-180-D002

```json
{
  "id": "WO-180-D002",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Reuse the checked existing fixture; the probe establishes no measured end-to-end economy improvement.",
  "question": "Can WO-056's existing synthetic repository generator serve the baseline proof instead of duplicating its repository and tests?",
  "alternatives": ["Reuse createFixture and commit the planted defect in its synthetic target", "Duplicate a new repository generator"],
  "evidence": ["The generator probe observed four nonempty fixture files, a committed base and 0.073 seconds of execution; complete preparation and recording elapsed time is unknown."],
  "rejected": [{"option": "Claim an end-to-end saving from this probe", "reason": "No equivalent-outcome comparison or full elapsed cost was measured."}],
  "observation": "The exported generator produced the four expected files and a committed base in 0.073 seconds. Full preparation and recording elapsed time was not measured, so the 180-second experiment budget and an end-to-end saving are not established.",
  "budget": {"wallSeconds": 180},
  "execution": "run",
  "cost": {"wallSeconds": 0.073, "tokens": null, "commands": ["node --input-type=module: import createFixture; generate and inspect four fixture files and committed base"], "source": "Measured generator probe only; preparation and recording duration unknown"},
  "effect": {"wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["Reuse WO-056 createFixture for baseline doubles and live rows"], "summary": "Reuse the checked existing fixture; no equivalent-outcome process improvement is claimed."},
  "outcome": "inconclusive",
  "regression": "unknown",
  "history": {"lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null},
  "reopenWhen": "An equivalent complete proof measures preparation, execution and recording costs for both alternatives."
}
```

## WO-180-D003

```json
{
  "id": "WO-180-D003",
  "date": "2026-10-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.60.0, the next minor above the observed release baseline v0.59.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.59.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-180-baseline-witness-before-any-change.md"
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

## WO-180-D004

```json
{
  "id": "WO-180-D004",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "kind": "correction",
  "decision": "Keep the existing sequence label and select artifact and verification editions through current.json before their supported --write commands.",
  "misread": "I treated a short sequence-label rewrite as necessary for the catalog write-back and assumed the artifact and verification evidence writers accepted authority's edition flags.",
  "meant": "WO-123's generated catalog detail already names the baseline witness before the change through its WO-180 dependency. The two evidence scripts accept only --write or --check and select their destination from current.json.",
  "changed": "Removed only my redundant sequence-label edit; the planning check now passes. Selected new WO-180 destinations in current.json and ran the supported writers without editing historical receipts.",
  "evidence": [
    "work-orders.mjs renders the proposal labels from sequence.md and the detailed dependency reasons from each order",
    "WO-123 catalog reference: WO-180 hard, the baseline witness episode the composition sequences before the change",
    "plan check rejected the label edit as a subject change and passed after its removal",
    "artifact-identity-evidence.mjs and verification-evidence.mjs refused unsupported flags before writing; their inspected mode and currentEvidence code names the supported selection",
    "Valid writes recorded four artifact files and four verification files in WO-180 revision 001"
  ],
  "rejected": [
    {"option": "Change the judged sequence to repeat the existing dependency description", "reason": "The existing catalog detail satisfies the write-back without changing the plan."},
    {"option": "Rewrite historical evidence", "reason": "New immutable destinations preserve the prior observations."}
  ],
  "reopenWhen": "The catalog no longer exposes the dependency's step or a writer's documented selector changes."
}
```

## WO-180-D005

```json
{
  "id": "WO-180-D005",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Retain verification-v1 and result version 1: baseline is optional pinned skeleton context, and absent context keeps the prior closed result shape. Report a non-witnessing base as a typed BaselineComparisonFinding and an unverified candidate criterion, preserving the compiler's existing failure-witness rules. Release skeleton 0.48.0 as a compatible minor, with the console's exact dependency pin following it; other component versions stay at their observed baseline.",
  "evidence": [
    "Seven baseline fixtures pass, covering red base/green candidate, non-reproduction stop, new-story continuation, row injection, wrong failure exit, cached-result recovery and accepted-result-prefix recovery",
    "The unchanged legacy verification suites exercised historical capsules and streams successfully; their only failure in the intermediate 42-case run was the new forgery fixture expecting continuation after a deliberately ignored forged event, corrected to assert that malformed suffix refuses",
    "release check-surfaces --local passes application v0.60.0 above v0.59.0, skeleton 0.48.0 and exact workspace pins; no dependency added",
    "Product 03 is 173954 bytes, +106 against HEAD and within the 400-byte work-order bound; publication locks and 253-heading coverage pass",
    "codex-live-002 and claude-live-002 each record reproduced and a complete repaired candidate with no baseline comparison finding; runtime source identities and skeleton 0.48.0 are recorded",
    "The host store now retains baseline context when reading saved receipts. BaselineWitnessed is a replayable kernel emission after the admitted result, so a crash between admission and the event neither loses nor duplicates the witness"
  ],
  "rejected": [
    {"option": "New compiler claim types or a compiler contract version", "reason": "Existing behavior witnesses and capsule bytes suffice; legacy lowering remains unchanged."},
    {"option": "Manufacture a failing candidate host-test witness when the baseline passed", "reason": "The base limitation is separate from the candidate's actual exit; it prevents a pass without changing an observed test result."},
    {"option": "Treat baseline completion as verified acceptance", "reason": "The baseline matrix stays incomplete and exposes baseline-witnessed; only later candidate evaluations can certify acceptance."}
  ],
  "reopenWhen": "A consumer needs additional baseline witness kinds, changed named tests across snapshots or a new compiler contract."
}
```

## WO-180-D006

```json
{
  "id": "WO-180-D006",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Remove the duplicate baseline-subject recompilation from the BaselineWitnessed fold. Its payload already equals the kernel continuation derived from the admitted pinned command result, and the fold still checks causation, episode ownership and witness integrity. Keep the existing compiler file bound and remint fresh evidence after this source change.",
  "evidence": [
    "The first feedback audit stopped before VerificationOpened and before any model dispatch: verification contract: repository file",
    "readFeedbackSource projected reactor.ts to 100181 characters against the compiler's existing 100000-character file bound",
    "After removing duplicate recompilation the reactor projection is 99728 characters and every feedback source file is within the bound",
    "The final focused suites pass all 42 tests, including baseline witness tampering, forged events, cached recovery, admitted-prefix recovery and unchanged historical verification streams",
    "Authority revision 001, artifact-identity revision 002, verification revision 002 and deterministic feedback revision 002 replace the earlier source editions; the earlier receipts remain historical bytes"
  ],
  "rejected": [
    {"option": "Raise or bypass the compiler's snapshot file bound", "reason": "The redundant new fold code can be removed without weakening an invariant."},
    {"option": "Reuse a pre-change live audit or baseline source identity", "reason": "The judged source changed; new live rows and a fresh feedback store must observe it."}
  ],
  "reopenWhen": "The reactor's feedback projection approaches the bound again or a producer cannot derive the exact BaselineWitnessed payload from its accepted command."
}
```

## WO-180-D007

```json
{
  "id": "WO-180-D007",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Select the final deterministic WO-180 editions and the fresh live Codex feedback audit, and point the console's self-host fixture at that edition. The final live baseline rows are 003 for each harness; earlier rows and source editions are retained as historical observations.",
  "evidence": [
    "codex-live-003: CLI 0.159.2, gpt-6.1-sol/max launch, reproduced and complete candidate with zero baseline findings, 17.458 seconds",
    "claude-live-003: CLI 2.1.286, claude-opus-5-5/xhigh launch, reproduced and complete candidate with zero baseline findings, 10.053 seconds",
    "Both rows record host/live baseline identities and final runtime source hashes; effective model and effort remain unknown",
    "Authority 001, artifact-identity 002 and verification 002 deterministic writers pass; feedback 002 records ten present passes and ten removal assertion failures",
    "Fresh .runtime/wo180-feedback-002 on Codex gpt-6.1-sol/max completed both original audit criteria with ten fixtures and the established 1192-byte matched instruction reduction",
    "Feedback --record-selfhost admitted the current live audit and console --record-current-selfhost re-pinned its expected output"
  ],
  "rejected": [
    {"option": "Carry the earlier live source audit", "reason": "Verification protocol, host, reactor and saved-result sources changed among the judged feedback inputs."},
    {"option": "Claim effective child selections or full vertical delivery", "reason": "The transport observes launch selections only, and this order's candidate/composition actors are explicitly doubles."}
  ],
  "reopenWhen": "A judged feedback source or a recorded baseline runtime source changes before handoff."
}
```

## WO-180-D008

```json
{
  "id": "WO-180-D008",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "kind": "correction",
  "decision": "Honor a completed baseline actor's requiresHuman request before emitting BaselineWitnessed. The host enters attention, and the composition double returns BaselineNeedsHuman without dispatching implementation. Refresh the source editions and live evidence, then rerun the stopped review gate.",
  "misread": "The initial baseline result branch treated every completed actor result as permission to emit the witness, overlooking requiresHuman.",
  "meant": "A completed actor's human-attention request holds the sequence before witness emission and implementation.",
  "changed": "Added the attention branch and a no-implementation regression case, stopped the incomplete gate before editing, and refreshed the deterministic source editions.",
  "evidence": [
    "A probe on the preceding implementation observed actorRequiresHuman true, phase baseline-witnessed and disposition Continue; that result did not preserve the actor's explicit hold",
    "The running review gate was stopped through harness evidence --stop before changing its inputs; it recorded no successful check",
    "The new regression case observes attention, no baseline witness or BaselineWitnessed event, and no implementation dispatch",
    "All 43 focused verification tests pass, including eight baseline cases and unchanged snapshot and legacy verification suites",
    "The current reactor feedback projection is 99822 characters, below the unchanged 100000-character compiler bound",
    "Deterministic authority revision 002, artifact-identity revision 003, verification revision 003 and feedback revision 003 were recorded after the hold correction; prior editions remain immutable historical observations"
  ],
  "rejected": [
    {"option": "Create a witness and Continue despite requiresHuman", "reason": "The existing host attention convention holds the sequence when its actor requests human intervention."},
    {"option": "Count the interrupted review gate as passing", "reason": "Canonical stop recorded no successful check; the corrected subject still requires a complete gate."}
  ],
  "reopenWhen": "The baseline attention recovery contract changes, or a consumer treats an absent witness as permission to implement."
}
```

## WO-180-D009

```json
{
  "id": "WO-180-D009",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Use baseline live rows 004 for both harnesses and feedback revision 003 as the current observations after the human-attention correction. Earlier rows remain historical; this supersedes D007's source selection.",
  "evidence": [
    "codex-live-004: CLI 0.159.2, gpt-6.1-sol/max launch, reproduced, complete candidate and zero comparison findings, 15.467 seconds; result-envelope total 12341 tokens, cost unknown",
    "claude-live-004: CLI 2.1.286, claude-opus-5-5/xhigh launch, reproduced, complete candidate and zero comparison findings, 6.127 seconds; result-envelope total 6647 tokens and cost USD 0.059072",
    "Receipt validation regenerated each witness, matched all seven current runtime source hashes and skeleton 0.48.0, and checked host/live baseline labels, the signed-test host exit 1 and actor tool confinement",
    "Fresh .runtime/wo180-feedback-003 on Codex gpt-6.1-sol/max completed both audit criteria with ten fixtures and the established 1192-byte matched instruction reduction",
    "Feedback --record-selfhost admitted the current source audit in revision 003; console --record-current-selfhost re-pinned its expected output"
  ],
  "rejected": [
    {"option": "Reuse the preceding live source audit", "reason": "The reactor's judged behavior changed to preserve the human-attention hold."},
    {"option": "Claim effective child selections or full delivery composition", "reason": "Selections are observed at launch only, and candidate and composition actors are process doubles."}
  ],
  "reopenWhen": "A judged feedback source or a recorded baseline runtime source changes before handoff."
}
```

## WO-180-D010

```json
{
  "id": "WO-180-D010",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Preserve each overlaid file as a Git blob in the evidence-source fixture's own temporary repository before a case mutates it. This bounded adjacent repair lets fresh uncommitted live-audit sources resolve to their recorded bytes, so the existing assertions can distinguish judged behavior drift from an unresolvable reference. Keep the production resolution rules and refusal assertions unchanged.",
  "evidence": [
    "The review run reported two evidence-source case failures: expected judged behavior changed for worker-store.ts, observed unresolvable edition reference for that path",
    "The current worker-store Git blob 87cd08f20b1e2f8343c5892feb76ed383f027684 does not exist in the project object database; editionCopy overlaid its current bytes without preserving their blob before mutation",
    "Feedback reference resolution first checks matching working-tree bytes and then Git objects; mutating this uncommitted file removed the fixture's only resolvable copy",
    "The gate was stopped canonically before editing and recorded no successful check; adjacent-0001 records cause, scope, priority and the required evidence-source and diff checks",
    "Only scripts/test-evidence-sources.mjs changes for this repair. It is absent from the registered evidence-source inventories, so the current live runtime observations remain on their recorded source identity",
    "All five focused evidence-source cases pass after the repair, including separate judged-drift and unresolvable-reference assertions; formatting and git diff --check pass, and adjacent-0001 is completed"
  ],
  "rejected": [
    {"option": "Loosen the fixture to accept either stale diagnostic", "reason": "The two cases specifically prove that resolvable behavior drift and an unresolvable reference remain distinct."},
    {"option": "Commit the project before final review", "reason": "The project reserves branch commits for final review; the fixture can retain the needed objects inside its own temporary clone."},
    {"option": "Change production reference resolution", "reason": "The observed refusal is correct when the fixture cannot resolve the original source; its setup must preserve the judged bytes."}
  ],
  "reopenWhen": "A fresh live edition references a body the fixture does not overlay or its temporary object database no longer resolves pre-mutation source bytes."
}
```

## WO-180-D011

```json
{
  "id": "WO-180-D011",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "kind": "correction",
  "decision": "Classify the eight baseline cases as document cases and lazily import their historical synthetic fixture inside each case. The product suite skips these document-dependent cases without reading their inputs, and the required document gate executes them. Keep the product read guard unchanged.",
  "misread": "I imported the reused WO-056 fixture at module setup and left the new baseline cases untagged, overlooking the product suite's excluded-document input boundary.",
  "meant": "A case that consumes recorded document inputs belongs to the existing document selection and must load them inside its case context.",
  "changed": "Added the existing [document] tag to all eight cases and replaced the eager module import with an awaited lazy import inside each case.",
  "evidence": [
    "The complete review run passed all 461 skeleton tests but failed that suite's product read guard with eleven excluded-input observations from the reused WO-056 and WO-053 fixture imports at module setup",
    "The runner's product selection skips [document], and skeleton-docs selects that tag; existing WO-056 receipt cases use the same classification",
    "A real product-read-guard probe of the corrected baseline module with the document skip pattern exits 0 and records zero excluded reads",
    "Only test classification and loading changed; the recorded live runtime source hashes and deterministic source editions remain unchanged",
    "After classification, all 43 focused baseline and legacy verification tests pass again"
  ],
  "rejected": [
    {"option": "Exclude the new fixture from the read guard", "reason": "The guard protects the product gate's document-independent code identity."},
    {"option": "Copy the historical fixture into a new product helper", "reason": "The document selection already admits the reused fixture and preserves its recorded provenance."}
  ],
  "reopenWhen": "The baseline proof no longer consumes recorded document inputs or the runner's product/document selection contract changes."
}
```

## WO-180-D012

```json
{
  "id": "WO-180-D012",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Equip the temporary integration fixtures with read-only links to the existing Playwright dependencies and browser-evidence workspace, and install the pinned Chromium headless shell in the project's ignored .runtime/playwright cache. Preserve the existing dependency versions and integration assertions.",
  "evidence": [
    "The completed review run failed the browser suite because its pinned Chromium cache was absent, and integration cases reported TS2307 for the existing browser-evidence package's Playwright import",
    "Integration fixture setup linked only TypeScript, types and Prettier plus four workspace packages; browser-evidence already declares Playwright 1.63.0, installed in the root node_modules",
    "The browser fixture's own unavailable diagnostic names PLAYWRIGHT_BROWSERS_PATH and playwright install chromium --only-shell",
    "Context7 resolved /microsoft/playwright/v1.63.0; its official browsers documentation confirms the custom browser cache and --only-shell installation: https://github.com/microsoft/playwright/blob/v1.63.0/docs/src/browsers.md",
    "adjacent-0002 records the integration fixture's cause, bounded scope, intent, current operator continue direction and required checks",
    "The project-local Chromium installation succeeded, and all nineteen browser evidence cases pass, including process recovery and adverse console capture",
    "All 21 real integration cases pass with the fixture links, git diff --check passes, and adjacent-0002 is completed",
    "The required document gate passes all 24 checks, including skeleton-docs with the eight baseline cases"
  ],
  "rejected": [
    {"option": "Change Playwright or browser component versions", "reason": "The declared dependencies already exist; the fixture and ignored browser cache were incomplete."},
    {"option": "Skip the browser or integration suites", "reason": "The work order requires the complete current review gate."},
    {"option": "Alter global browser settings", "reason": "The repository's explicit project cache supplies the required pinned executable."}
  ],
  "reopenWhen": "The browser package changes its declared dependencies or the fixture cannot resolve them through its read-only links."
}
```

## WO-180-D013

```json
{
  "id": "WO-180-D013",
  "date": "2026-10-01",
  "dispatch": "resume: final review",
  "decision": "Pass WO-180 on all six criteria against the original order, on VER-001's reproductions and this review's fresh product gate at the identity that keys the new test file. Board two seams the composition must carry, without failing the order. (1) Receipt 036's known issue on the order's catalog row (docs/planning/work-order-map.md) directs the executor to treat a contract naming a failing behavior as a defect story before WO-061 lands and to record the class source. Nothing in the landed primitive reads a contract: BaselineStory.kind is a caller input, BaselineWitnessed records the class but not where it came from, and no decision, README or report mentions the duty. A caller that labels a defect story new receives walked and Continue, which skips the non-reproduction stop; that is the hazard the receipt named. (2) Operator-review assumption 2 promises a per-run operator waiver of a non-reproduction stop, recorded in the run's receipt. This order returns BaselineNotReproduced and supplies no waiver, as its README and VER-001 state, and WO-123's text names no waiver. Under the landed comparison rule, a run that proceeds past a waived stop still cannot pass the defect criterion: compareBaseline reports baseline-test-did-not-fail and parseEvidenceResult refuses a pass, so a waiver admits the change, not acceptance of that criterion.",
  "evidence": [
    "docs/planning/work-order-map.md WO-180 row: Receipt 036 known issue (2026-09-30), 'treats a contract that names a failing behavior as a defect story and records the class source; a defect story recorded as walked reopens it'",
    "grep of docs/evidence/WO-180 decisions.md, README.md, handoff.md, fixture.mjs and docs/verifications/WO-180/VER-001.md for WO-061, StoryContract, class source and 036: no match",
    "packages/skeleton/src/verification-protocol.ts: BaselineStory { storyId, kind: new | defect, tests }; createBaselineWitness derives walked from kind new; baselineDisposition returns Continue for walked",
    "WO-180 operator-review assumption 2; docs/evidence/WO-180/README.md and VER-001 limits: the primitive returns the stop and supplies no waiver",
    "grep of docs/work-orders/WO-123-vertical-composition.md for waive and non-reproduction: no match; its objective names the baseline witness before the change (WO-180)",
    "verification-protocol.ts compareBaseline and parseEvidenceResult's 'defect baseline did not fail' refusal; the comparison fixture case refuses a pass on that criterion"
  ],
  "rationale": "Mission and critical path: WO-123 is the first real caller of this primitive and the delivery vertical's composition; both seams decide what it must read and record before a change. Rule beating: a defect story classed new walks past the stop, and an unrecorded class source hides that choice from every later reader. Shifting the burden: without a carrier, the operator would find the missing waiver at the first non-reproducing run. Seeking the wrong goal: a waiver that admits the change but leaves the criterion unpassable may or may not be what the operator meant; recording the interaction lets the planner decide it. Drift to low performance: a carried duty that no record mentions sets a weaker norm for catalog-row duties. Policy resistance, escalation, the commons and success to the successful are immaterial: no gate, refusal or authority changes. Naive Interventionism: a class-source field or a waiver input would change verification-protocol.ts after verification; it is a registered evidence source whose hash both live receipts record, so the editions it stales would be re-minted and both live rows re-run, for inputs that have no producer until WO-061 and WO-123 land. NoOp: both seams would stay only in this report, and WO-123 would activate without them.",
  "rejected": [
    {
      "option": "Fail the order on the receipt-036 duty",
      "reason": "No criterion requires it, the class reader belongs to the composition, and the primitive's witness already records the class it was given; the missing part is where the class came from, which only a contract reader can supply."
    },
    {
      "option": "Add a class-source field or a waiver input in this review",
      "reason": "A reviewer never writes a behavioral change and certifies it; either would need repair and fresh verification."
    }
  ],
  "followup": "Planner, before WO-123 activates: amend WO-123 (or WO-061) to carry two WO-180 seams. (1) When the composition builds a BaselineStory, it reads the class from WO-061's StoryContract once landed and, before that, classes a contract naming a failing behavior as defect; it records the class and its source with the baseline receipt, and a story whose contract names a failing behavior but is classed new is a finding. (2) Operator-review assumption 2's per-run waiver of BaselineNotReproduced is recorded in the run's receipt, and the order decides whether a waived run's defect criterion stays unverified under the comparison rule (current behavior) or the waiver also reaches the comparison. Priority: low; WO-123 is blocked on WO-061, WO-062, WO-124, WO-181 and WO-182.",
  "reopenWhen": "WO-061 or WO-123 activates, a planning pass amends WO-123, or a defect story is recorded as walked."
}
```

## WO-180-D014

```json
{
  "id": "WO-180-D014",
  "date": "2026-10-01",
  "dispatch": "resume: final review",
  "decision": "Record that WO-173-D018's reopening observation occurred again, and stage the new test file before this review's product gate. The executor's passing npm test row (2026-10-01T03:49:11.618Z) and VER-001's fresh rerun (2026-10-01T04:41:39.512Z) were both keyed at code identity 872d29a4030b3c66b1ebd6a633f99b0cb5b1347e06a0515493d375746ed83ccf while packages/skeleton/test/baseline.test.ts was untracked, so neither identity keyed it. VER-001's first, plain npm test -- --review found the executor's row at that identity and started no suite. This review staged the file and ran npm test -- --review at the identity that keys it; that row is the one publication cites.",
  "evidence": [
    "packages/skeleton/src/gate-evidence.mjs gateCodeIdentity: entries from git ls-files -z when no revision is given; docs/ is excluded",
    "git status at this dispatch: ?? packages/skeleton/test/baseline.test.ts",
    "docs/control/orders/WO-180.jsonl ImplementationReady productGate codeIdentity 872d29a4…; VER-001 Executed checks: npm test -- --review (no --again) started no suite, then npm test -- --again --review passed 37 at the same identity",
    "WO-175-D017 recorded the same observation for scripts/lib/planning-conditions.mjs; FUP-7629e03c6573f5cb carries WO-173-D018"
  ],
  "rationale": "Mission: a publication-bound row should stand for the bytes it ships. Rule beating: a reused row passed for a tree it never keyed; VER-001's fresh rerun and this review's staged gate are why no wrong reuse reaches publication. Drift: WO-180 is the third order to record the gap, after WO-174 and WO-175, so the interim rule is not preventing it. Shifting the burden: each reviewer stages and reruns by hand. The other traps are immaterial: no gate or authority changes. Naive Interventionism: the lookup change belongs to the planner's row, not to this review. NoOp: leaves the class open with one more observation recorded.",
  "rejected": [
    {
      "option": "Cite the executor's or VER-001's row in publication",
      "reason": "Neither identity keyed the test file the order adds."
    }
  ],
  "reopens": {
    "decisionId": "WO-173-D018",
    "observation": "WO-180's executor gate row and VER-001's fresh rerun, recorded at code identity 872d29a4… on 2026-10-01T03:49Z and 04:41Z, were computed while the new packages/skeleton/test/baseline.test.ts was untracked, and VER-001's plain npm test -- --review reused the executor's row there without starting a suite. WO-174-D023 and WO-175-D017 recorded the same observation; WO-180 is the third order to record it."
  },
  "reopenWhen": "A planning pass routes FUP-7629e03c6573f5cb, or a gate row is again reused at an identity that missed a new source file."
}
```
