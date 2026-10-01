# WO-181 decisions

## WO-181-D001

```json
{
  "id": "WO-181-D001",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Add an opt-in review episode to the existing sealed verification host and shared reactor. It follows a passing behavior episode, reads the original contract, pinned diff, baseline and candidate rows and a declared conventions file when present, and emits ReviewCompleted without changing acceptance rows. Preserve behavior finding admission. Route blocking review findings through the existing bounded repair entry, with should and nit findings exposed as known items for WO-182. Out-of-authority paths remain NeedsHuman.",
  "evidence": [
    "WO-181 criteria 1–6 and product 03 VerificationAdapter and DeliveryAdapter",
    "VerificationHost already checks snapshot bytes and permissions before dispatch, recovery and admission; its transport starts fresh episodes",
    "reactor.ts owns verification continuation, authority, leases and producing-episode admission",
    "repair.ts and RepairHost already accept a separately host-recorded review item without broadening surfaces or effect authority",
    "WO-123 is still a future composition; the order requests composition doubles and a catalog carrier, not implementation of the whole vertical"
  ],
  "alternatives": ["Extend the existing host with pinned review context", "Separate review host and reducer", "Merge review into the behavior verdict", "Automatically repair all severities", "NoOp"],
  "rejected": [
    {"option": "Separate host and reducer", "reason": "Duplicates observed snapshot, authority, lease and recovery boundaries."},
    {"option": "Merge review into the behavior verdict", "reason": "Breaks the explicit separation and changes what the behavior verifier may fail."},
    {"option": "Automatically repair all severities", "reason": "Minor suggestions have no scope-expansion authority."},
    {"option": "NoOp", "reason": "Leaves the delivery vertical without its independent implementation judgment."}
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Supply WO-123 with a distinct pre-delivery implementation judgment and typed routing, reducing repeated operator review coordination.",
    "traps": {
      "policyResistance": "Review never rewrites behavior acceptance or invents effect authority.",
      "tragedyOfTheCommons": "One repository writer; two required live reviewer episodes plus a feedback audit, within the 20-agent budget; unknown descendants remain unknown.",
      "driftToLowPerformance": "Require actual separate episodes, source references, sealed bytes and rejection evidence.",
      "escalation": "Reuse the existing host and gates; introduce no new approval step.",
      "successToTheSuccessful": "Reuse follows checked confinement and recovery behavior, not incumbency alone.",
      "shiftingTheBurden": "Typed blocking and known-item routes carry findings to later composition without operator transcription.",
      "ruleBeating": "Reject edits and patches, identity reuse, unpassed behavior and absent convention sources; assert no snapshot mutation.",
      "seekingTheWrongGoal": "Judge the candidate's scope and maintainability rather than count successful worker envelopes."
    },
    "naiveInterventionism": "Keep the review opt-in and preserve historical streams without review context. Probe through the existing synthetic repository and transport doubles before live reviewers.",
    "noOp": "Would leave an explicit work-order criterion and the promised vertical unimplemented."
  },
  "reopenWhen": "The current host cannot preserve fresh-session independence, a declared convention cannot be represented by the sealed file projection, or composition requires more authority than bounded repair permits."
}
```

## WO-181-D002

```json
{
  "id": "WO-181-D002",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep the existing transport; decline a separate transport economy experiment because it duplicates the host boundaries this order must preserve.",
  "question": "Would a separate review transport reduce implementation and validation cost compared with the existing sealed evidence host?",
  "alternatives": ["Existing sealed evidence host", "Separate review transport"],
  "observation": "verification-host.ts already supplies snapshot preflight, transport dispatch, result cache, lease, recovery and read-only admission; review needs those same functions.",
  "evidence": ["Source read of verification-host.ts and verification-protocol.ts before implementation"],
  "budget": {"wallSeconds": 120},
  "execution": "declined",
  "reason": "A second transport duplicates the checked host boundaries; no separate probe is needed to choose reuse.",
  "rejected": [{"option": "Separate transport experiment", "reason": "Duplicates already checked required functionality without an observed cost bottleneck."}],
  "cost": {"wallSeconds": 0, "tokens": null, "commands": ["none; experiment declined before launch"], "source": "No experiment launched; prior required source reads are not an experiment cost measurement."},
  "effect": {"wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["none; no recurring saving measured"], "summary": "No economy improvement claimed."},
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {"lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null},
  "reopenWhen": "Measured review transport overhead dominates an equivalent completed outcome."
}
```

## WO-181-D003

```json
{
  "id": "WO-181-D003",
  "date": "2026-10-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.61.0, the next minor above the observed release baseline v0.60.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.60.1 (local tags)",
    "minor classification declared in docs/work-orders/WO-181-independent-review-episode.md"
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

## WO-181-D004

```json
{
  "id": "WO-181-D004",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "correction",
  "decision": "Preserve the verification capsule's 100,000-character file bound. Move verification state interfaces into verification.ts with the existing reactor re-exports, and review-context and completion-event construction into review.ts. The shared reactor retains all admission and continuation decisions. Re-mint the affected editions and repeat the live rows on these final sources.",
  "misread": "I added the review branches to reactor.ts without first checking its remaining capsule-file capacity; the baseline was already 99,822 bytes.",
  "meant": "The mandatory feedback audit must be able to read every judged source through the existing bounded capsule.",
  "changed": "The initial 104,056-byte reactor failed copySubject with verification contract: repository file before any feedback model launch. Source projection now admits every file, with the largest at 99,655 characters; exported state types and runtime behavior remain covered by the review and legacy fixtures.",
  "evidence": [
    "The first feedback store contains its deterministic audit and VerificationHostConfigured only; no WorkerAttemptStarted exists",
    "A direct source-projection check through readFeedbackSource and copySubject now succeeds at the existing limit",
    "The first Claude and Codex live review rows passed before this source refactor and remain historical observations, not the final-source claim"
  ],
  "rejected": [
    {"option": "Raise the capsule bound", "reason": "The new types and pure construction helpers fit naturally in their companion modules; raising the boundary is unnecessary."},
    {"option": "Omit reactor.ts from the feedback subject", "reason": "It owns the behavior the audit must judge."},
    {"option": "Reuse the old live source identities", "reason": "The final implementation must be judged and recorded at its actual source identity."}
  ],
  "reopenWhen": "A future reactor edit reaches the existing capsule bound or the moved interfaces alter a consumer's behavior."
}
```

## WO-181-D005

```json
{
  "id": "WO-181-D005",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Preserve Claude live attempt 002 as a failed end-to-end proof: its behavior verifier passed both criteria but requested human attention after noticing the planted scope and convention issues. The existing host correctly stopped before review. File the host observation beside the immutable failed receipt and make a fresh synthetic attempt with unchanged runtime and instructions; never clear or ignore the attention flag.",
  "evidence": [
    "claude-live-002.json records one fresh confined CLI process and a failed assertion before review",
    "claude-live-002-stop.json preserves the admitted behavior result: two pass evaluations, requiresHuman true, no reviewer dispatch",
    "The first attempt had passed the same behavior criteria with requiresHuman false and then reported the two review findings"
  ],
  "rejected": [
    {"option": "Ignore requiresHuman when all rows pass", "reason": "Would weaken the existing behavior-verification boundary, outside this order's scope."},
    {"option": "Call the missing review unavailable or passed", "reason": "The harness was available; this attempt stopped at its explicit human-attention request."},
    {"option": "Replace the failed receipt", "reason": "Every live attempt remains an immutable observation."}
  ],
  "reopenWhen": "Repeated fresh attempts cannot reach review without changing the behavior verifier's existing attention policy."
}
```

## WO-181-D006

```json
{
  "id": "WO-181-D006",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Use a fresh Codex behavior-verifier session before the final Claude review row. The order requires each harness as reviewer, not the same harness in both roles. Keep both actors live, blinded and separately identified. Extend only the evidence fixture to select its verifier independently and preserve an observed result on a stopped attempt.",
  "evidence": [
    "Claude attempts 002 and 003 both passed the two behavior criteria but requested attention over the deliberately planted non-behavior defects; neither dispatched review",
    "Codex attempt 002 completed behavior verification and independent review on the final runtime, with both planted findings",
    "WO-181's Model and criterion 4 name the local harnesses as reviewer; its objective requires a different session from verifier and implementer, with no same-harness requirement"
  ],
  "rejected": [
    {"option": "Keep retrying the identical Claude verifier setup", "reason": "Two consecutive attempts stop before the episode this order is proving."},
    {"option": "Bypass the verifier's attention flag or replace it with a double", "reason": "Separate live harness roles preserve the existing hold and strengthen the independence evidence."}
  ],
  "reopenWhen": "The cross-harness setup cannot reach a live Claude review under the unchanged host policies."
}
```

## WO-181-D007

```json
{
  "id": "WO-181-D007",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "correction",
  "decision": "Update the explicit reactor import inventory for the pure verification types and review helpers introduced by D004, and add review.ts to the existing no-host-import assertion. Preserve every kernel-decision ownership check.",
  "misread": "I moved the pure declarations and helpers without updating scenario.test.ts's exact reactor dependency inventory, and began the full gate before this worktree's documented browser setup.",
  "meant": "The architecture assertion must enumerate the approved pure dependencies and continue checking their boundary; the browser suite needs its pinned executable before launch.",
  "changed": "The focused WO-016 AC1 assertion passes with the updated inventory and explicit review.ts purity check. The first full gate was stopped after the architecture and missing-browser failures, with no passing gate row. The runtime source bytes judged by the live reviewers are unchanged.",
  "evidence": ["First full review gate: WO-016 AC1 import inventory failed; browser-evidence reported missing pinned Chromium", "node --test --test-name-pattern='WO-016 AC1' packages/skeleton/dist/test/scenario.test.js passed", "The current worktree's prerequisite download finished before the operator clarified that the permanent change must target future worktrees"],
  "rejected": [{"option": "Remove the import inventory or purity guard", "reason": "The new helpers must remain subject to the existing architecture boundary."}],
  "reopenWhen": "A new dependency introduces host effects into the reactor or its pure helpers."
}
```

## WO-181-D008 — operator expansion: prepare future worktrees

```json
{
  "id": "WO-181-D008",
  "date": "2026-10-01",
  "dispatch": "scope expand: during resume: next",
  "operatorAuthorization": "scope expand: im running into this fucking worktree pinned chromium issue wrt playwright in every fucking work order. fix it permanently now",
  "operatorConstraint": "to be clear, dont fix it in existing work trees. fix it so any work order in the future does not hit the fucking issue",
  "decision": "Expand WO-181 to prepare the pinned headless Chromium during the existing future-worktree bootstrap, before its ready/launch handoff. Use that checkout's installed Playwright CLI and the browser suite's selected cache, preserve explicit cache overrides and stop setup honestly on download failure. Prove the path with a fresh temporary worktree and a cached retry. Do not retrofit other existing worktrees or change browser absence into passing evidence.",
  "evidence": ["The operator's two messages above explicitly authorize this expansion and limit its rollout", "scripts/worktree.mjs start already invokes the target's bootstrap before printing the launch handoff", "scripts/bootstrap.mjs currently prepares npm dependencies, build and hooks but omits Chromium", "packages/browser-evidence/test/scenario.test.mjs selects a per-worktree cache by default", "WO-059-D023 records the recurring prerequisite as accepted and leaves cache/setup redesign outside that earlier repair", "Official Playwright v1.63.0 browsers documentation supports the selected cache and chromium --only-shell installation; the local lockfile pins Playwright 1.63.0"],
  "reopens": {"decisionId": "WO-059-D023", "observation": "The operator reports this failure in every work order and explicitly authorizes a permanent future-worktree setup fix; this order's first full gate also reproduced the missing-browser failure."},
  "alternatives": ["Add the browser prerequisite to existing worktree bootstrap", "Share a new mutable cache across all existing worktrees", "Download implicitly in every product gate", "Keep a manual install instruction", "Skip the browser suite"],
  "rejected": [
    {"option": "Retrofit existing worktrees or add shared-cache lifecycle policy", "reason": "The operator expressly limits the fix to future work orders; isolated caches already have checked selection semantics."},
    {"option": "Download in every gate", "reason": "Worktree creation already owns dependency preparation and can fail before advertising readiness; the gate should judge the prepared environment."},
    {"option": "Keep manual setup", "reason": "Preserves the reported recurring interruption."},
    {"option": "Skip browser proof", "reason": "Missing evidence must remain unavailable and must not produce a green product gate."}
  ],
  "goalAlignment": "Mission and critical path: remove repeated operator environment repair before each future order. Policy resistance and rule beating preserve honest unavailable evidence; drift to low performance requires actual Chromium launch from the fresh fixture. Tragedy of the commons retains per-worktree isolation and records download cost rather than introducing shared mutable state. Shifting the burden moves the prerequisite into existing setup; escalation adds no gate or confirmation. Success to the successful is rejected by reopening D023 on the operator's new evidence. Seeking the wrong goal judges a ready browser, not a printed installation command. Naive Interventionism limits effects to bootstrap; NoOp retains the repeated interruption.",
  "reopenWhen": "A newly bootstrapped worktree still reaches its first gate with missing Chromium, a cache override installs somewhere different from launch, or provisioning cannot recover after a failed download."
}
```

## WO-181-D009

```json
{
  "id": "WO-181-D009",
  "date": "2026-10-01",
  "dispatch": "resume: next; execute operator expansion WO-181-D008",
  "decision": "Keep browser preparation in future-worktree bootstrap. The fresh-worktree proof passes, including a cached retry and an explicit cache in a second new worktree with downloads unavailable. Preserve the default per-worktree isolation and existing negative browser evidence; make no rollout change to existing worktrees.",
  "evidence": ["bootstrap-live-001.json: three real Chromium 153.0.8010.12 launches with installed Playwright 1.63.0 and the current lockfile", "Cold fresh-worktree preparation: 5.481 s, including real npm ci and the browser download; build is a labeled marker double", "Cached retry with an unreachable download host: 0.700 s, no browser download", "Second fresh worktree with explicit cache and npm offline: 1.406 s, no browser download", "Five bootstrap-selected regression cases passed, including cache selection and installation-failure refusal before build/hook preparation", "The initial reactor import-inventory omission is fixed; its focused architecture case passes without changing the live-reviewed runtime sources"],
  "rejected": [{"option": "Claim future setup is network-independent", "reason": "The first installation still requires a reachable download service or an explicitly selected prepared cache."}, {"option": "Change browser absence into a passing gate", "reason": "Automatic setup resolves the repeated prerequisite; it does not supply missing evidence."}],
  "goalAlignment": "D008's scope holds on executable evidence: a fresh setup produces the required browser before readiness, and failures cannot proceed to the ready path. The operator no longer has to discover and repeat a separate install command for a normally created worktree. The measured proof is synthetic and does not establish a recurring token saving; shared-cache lifecycle changes remain unnecessary.",
  "reopenWhen": "A future worktree created through the canonical bootstrap has no usable pinned browser, or a supported cache selection diverges between preparation and test launch."
}
```

## WO-181-D010

```json
{
  "id": "WO-181-D010",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "correction",
  "decision": "Finish documentation preflight before restarting the full frozen-input gate. Keep the product byte ceiling and all browser assertions unchanged.",
  "misread": "I started the second full gate while the preceding documentation preflight still had a running tool session. That preflight reported two bytes over product 07's ceiling, so its following index preparation had not run.",
  "meant": "Dependent preflight and index commands must finish before a full gate starts; prose must fit the existing ceiling.",
  "changed": "Stopped the second gate after 12.6 seconds before any input edit, shortened the in-place bootstrap paragraph and refreshed its publication lock. Separately, the browser suite's first standalone run timed out in ps before assigning its shared fixture baseline; a direct process-table read then took 54 ms and the unchanged suite passed all 19 cases on retry.",
  "evidence": ["The second gate's canonical stop receipt reports no passing row and no active gate", "The document check reported a two-byte overage after the first condensation", "docs/control/local/wo181-browser-retry.log: 19 passed, zero failed, 27.447 seconds"],
  "rejected": [{"option": "Increase the documentation ceiling or relax browser assertions", "reason": "Neither addresses the observed sequencing mistake or the transient host-process timeout."}],
  "reopenWhen": "The unchanged browser suite repeatedly reproduces the host-process timeout or current documentation exceeds its declared ceiling."
}
```

## WO-181-D011

```json
{
  "id": "WO-181-D011",
  "date": "2026-10-01",
  "dispatch": "resume: next; executor handoff",
  "decision": "Hand the independent review primitive and the authorized future-worktree browser prerequisite to independent verification. Retain the staged minor release and the boundaries recorded in D001 and D008.",
  "evidence": ["npm test -- --review: 40 suites passed, zero failed, 85 fresh tasks, 895.10 seconds", "npm run test:docs: 24 suites passed, zero failed, 38.99 seconds, including the nine review cases", "Final-source live review receipts codex-live-002 and claude-live-004 passed; the required live feedback audit judges the current runtime", "bootstrap-live-001: three real Chromium launches after fresh/cached preparation; the bootstrap regressions passed in the full workflow suite", "Publication, planning, current evidence editions and git diff --check passed; no new dependency", "The adjacent queue item for the operator expansion is completed at revision 5"],
  "rejected": [{"option": "Extend this order to the complete delivery composition or retrofit existing worktrees", "reason": "WO-123 and WO-182 own later composition/body work, and the operator expressly limited the browser rollout to future worktrees."}, {"option": "Claim a process-cost improvement from the validation timings", "reason": "The recorded fixtures demonstrate behavior and bounded setup cost, not equivalent recurring work-order outcomes."}],
  "goalAlignment": "D001's mission contribution is observed: a distinct reviewer finds defects that passing behavior tests do not judge, without editing the candidate or turning minor findings into authority. D008 removes the manual browser prerequisite from future worktree launches. Policy resistance, rule beating and low-performance drift retain the original acceptance and unavailable-evidence boundaries. Commons costs are explicit; shifting the burden is reduced by typed routing and automatic setup. Escalation adds no gate or approval, and success to the successful yields to the operator's observed recurring failure. Seeking the wrong goal is checked by real review findings and browser launches. Naive Interventionism keeps both changes at existing host/bootstrap boundaries; NoOp would leave the original gap and repeated setup interruption.",
  "reopenWhen": "Independent verification contradicts a criterion, a future canonical worktree starts without its usable browser, or the later delivery composition needs authority outside these bounds."
}
```

## WO-181-D012 — Verification board: unrecorded Receipt 036 duties

```json
{
  "id": "WO-181-D012",
  "date": "2026-10-01",
  "dispatch": "resume: verify",
  "decision": "Board, not fail, two Receipt 036 duties that the work-order map row assigns to WO-181's executor and that this order's evidence does not record. Neither is a declared acceptance criterion. First, review-episode failure: VER-001 observed the shared host's behavior. A review result with status failed records WorkerInterrupted (worker-incomplete) and returns its envelope. A rejected transport records WorkerInterrupted and throws. In both cases the review command stays pending with state.next review and no ReviewCompleted event; rerunning the host starts a fresh attempt. No committed fixture pins this behavior. Second, derived surfaces: the reviewer judges scope against the contract, the criteria's code surfaces and the diff. No rule for consuming WO-124's derived surfaces is recorded; WO-124 has not landed, so none are present.",
  "evidence": [
    "docs/planning/work-order-map.md WO-181 row, Receipt 036 known issues: 'the executor has the reviewer consume the derived surfaces when present and records the rule' and 'the executor records the stop or retry behavior with a fixture'",
    "docs/planning/refutations/2026-09-30-planning-826842218eb333e2-036.md WO-181 findings criterion:1 and criterion:3, with their reopen conditions",
    "WO-181-D001 to D011 and README.md: no record of either duty",
    "VER-001 probe R4 (session scratch, built dist and fixture.mjs): failed review status leaves next review, pending true, one attempt, no ReviewCompleted; event tail WorkerAttemptStarted, CommandReceipt, WorkerInterrupted",
    "VER-001 probe R5: a rejected review transport records WorkerInterrupted transport-failed, throws, and leaves next review pending with no ReviewCompleted",
    "packages/skeleton/src/review.ts reviewReferences and createReviewContext: the review context carries contract, diff, conventions and sealed files, not derived surfaces"
  ],
  "rejected": [
    {"option": "Fail VER-001", "reason": "Both duties sit outside the order's seven declared criteria; a defect outside them is boarded with its reproduction."},
    {"option": "Leave them only as report sentences", "reason": "An unrecorded duty met during verification needs a named follow-up in the decisions."},
    {"option": "Add the fixture during verification", "reason": "The verifier does not edit the subject it judges."}
  ],
  "followup": "WO-123: when the composition sequences review, add a fixture in which the review episode fails, times out or is unavailable; record whether the composition stops, retries a fresh attempt or hands WO-182 an absent review item. WO-124: when derived surfaces land, carry them in the review context, tell the reviewer that a changed file inside them is not a scope defect, and record that rule here.",
  "reopenWhen": "A composition run or fixture reaches the review step without ReviewCompleted and its stop, retry or publication behavior is unrecorded; or a review episode returns a blocking scope finding for a file in WO-124's derived surfaces for the same order."
}
```

## WO-181-D013

<!-- integration refs/dotln/checkpoint/WO-181/6 -->

```json
{
  "id": "WO-181-D013",
  "date": "2026-10-01",
  "dispatch": "resume: final review; worktree integrate WO-181",
  "decision": "Integrate main at 0ffccab4 (WO-103 as v0.60.2, then WO-102 as v0.60.3) into the uncommitted WO-181 worktree by fast-forward, with no authored conflict. The v0.61.0 target stays current as the next minor above v0.60.3; compiler 0.22.0 and skeleton 0.49.0 do not collide, because upstream left both at 0.21.0 and 0.48.0. Upstream changed no file under packages/, scripts/ or .claude/ and neither manifest, so VER-001's seven judgments rest on unchanged inputs and carry forward, and the product gate was run again on the integrated tree.",
  "evidence": [
    "refs/dotln/checkpoint/WO-181/6",
    "base 2f52501450b55abdb03386352bb651909bb2e134",
    "upstream 0ffccab4afe0ecadd19845032c9ca1ac876c5a28",
    "release preparation: WO-181 target v0.61.0 remains current. Files changed: docs/evidence/WO-181/meta.json, docs/final-reviews/WO-181/PR.md. Meter snapshot: docs/evidence/WO-181/meta.json, 4123 bytes. Tag observation: local snapshot only.",
    "git diff --stat 2f525014 0ffccab4: 62 files; corpus/ fixtures, harness and manifests, the WO-102 and WO-103 records, README.md's release line, the follow-up register, the decisions index, the work-order index and the control projection. Nothing under packages/, scripts/ or .claude/, and neither package.json nor package-lock.json. git ls-remote origin: main at 0ffccab4, newest tag v0.60.3.",
    "The helper first refused 46 intent-to-add entries (the order's evidence, review.ts, review.test.ts and the PR stub) before writing anything; they were staged with git add as its message directs and the second run completed. docs/intake/ holds no ignored file, so no intake backup was required.",
    "After integration, git diff refs/dotln/checkpoint/WO-181/5 -- packages scripts package.json package-lock.json .claude is empty: the integrated source is byte-identical to the subject VER-001 judged (checkpoints /3 to /5 differ only in the report, the control log, D012 and generated projections).",
    "Affected checks on the integrated tree: node scripts/harness.mjs check (31 generated surfaces), npm run publication:check, npm run release -- check-surfaces --local and git diff --check pass. npm test -- --review: 40 passed, 0 failed, 893.41 s, 85 fresh tasks, code identity 2022b44f5f607d8f5bfc760285930c9e88bee7a0178df7045c60b90520bf069c, recorded 2026-10-01T16:57:03.147Z, run after the order's new files were staged.",
    "Evidence editions: upstream changed no registered evidence source; the gate's authority, artifact, harness, verification and feedback evidence suites passed against the WO-181 revision 002 editions."
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

Integration date: 2026-10-01. Original base: `2f52501450b55abdb03386352bb651909bb2e134`.
Fetched main: `0ffccab4afe0ecadd19845032c9ca1ac876c5a28`. Checkpoint: `refs/dotln/checkpoint/WO-181/6`.
Named stash retained: `83271becdb07d6f28ba822c450f428e75d8f53f4` (WO-181 integrate 2026-10-01).
Resolved projections: README.md, docs/control/current.md, docs/planning/followups.json, docs/work-orders/README.md.
Release preparation: WO-181 target v0.61.0 remains current. Files changed: docs/evidence/WO-181/meta.json, docs/final-reviews/WO-181/PR.md. Meter snapshot: docs/evidence/WO-181/meta.json, 4123 bytes. Tag observation: local snapshot only.
Carried-forward claims: main changed none of the files this order's claims rest on. The compiler and skeleton sources, their tests, `scripts/bootstrap.mjs`, `scripts/test-process-debt.mjs`, both manifests and the generated hooks are byte-identical to checkpoint `/5`, and the evidence fixtures and receipts are untouched. VER-001's judgments on criteria 1 to 5 and 7 therefore carry forward on unchanged inputs. Criterion 6's gate was run again on the integrated tree and passed (D013 evidence); the document gate ran with the final-review records in place. FINAL-001 judged the integrated subject.
Authored conflicts observed: none.
Affected checks are printed by the command; results remain untested until executed.

## WO-181-D014 — final review: pass, and three seams the composition inherits

```json
{
  "id": "WO-181-D014",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Pass WO-181 on all seven criteria against the original order and the operator's D008 expansion, on VER-001's probes, this review's reading of the full diff and a fresh product gate on the integrated tree. Concur with D012: the two Receipt 036 duties sit outside the declared criteria and stay boarded. Board three further seams without failing the order. (1) Observed: a capable behavior verifier pre-empts the review. Claude attempts 002 and 003 passed both criteria, named exactly the two planted review defects as out of scope and asked for human attention, so the host held the stream and never dispatched the reviewer; the passing Claude row needed a Codex verifier (D005, D006). The verifier's instructions say nothing about a later review, and changing what the verifier may hold is this order's non-goal, so the composition must decide it. (2) Observed: reactor.ts is 99,655 characters against the capsule's 100,000-character file bound, 345 characters of headroom after D004's move. The next order that edits the reactor meets the refusal D004 met, before any feedback model launch. (3) Inferred from source, not executed: a stream opened with review that applies an in-stream repair touching only some criteria's surfaces would leave the untouched criteria verified at the earlier revision, and createReviewContext then refuses the review dispatch by throwing before any event is appended. It fails closed and no shipped caller reaches it: review requires a snapshot subject and the only driver of in-stream repair application opens no snapshot subject and no review.",
  "evidence": [
    "docs/evidence/WO-181/claude-live-002-stop.json and claude-live-003-stop.json: two pass evaluations, requiresHuman true, summaries naming the README change and the TOTAL local as out of scope; claude-live-002.json and claude-live-003.json: status failed, pendingRow review-claude; claude-live-004.json: verifier transport codex-cli-exec, reviewer transport claude-cli-print, status passed",
    "packages/skeleton/src/verification-protocol.ts transportPrompt: the verifier instruction names no review episode; WO-181 Non-goals: any change to what the behavior verifier may fail",
    "wc -c packages/skeleton/src/reactor.ts: 99655; packages/compiler/src/verification.ts copySubject: file.contents.length <= 100_000; WO-181-D004",
    "packages/skeleton/src/reactor.ts VerificationSubjectSubmitted marks only affected rows stale and dispatch recompiles only rows that are not verified; packages/skeleton/src/review.ts createReviewContext requires each row's last evaluation at the current subject revision; validateReviewOpening requires subject.snapshot; packages/skeleton/src/verification-demo.ts, the only source that records VerificationSubjectSubmitted, names no snapshot and no reviewConventionsPath",
    "Reviewer probe, 2026-10-01, DotLn session scratch against the gate-built dist and fixture.mjs: on the behavior path a finding with class review, with or without a review severity, is refused with finding shape or duplicate, and severity nit without the class with finding shape; the unmodified result is admitted",
    "SHA-256 of the ten runtime sources in codex-live-002.json and claude-live-004.json: 10 of 10 match the integrated files in each; bootstrap-live-001.json's bootstrap and lockfile hashes match",
    "npm test -- --review on the integrated tree: 40 passed, 0 failed, 893.41 s, code identity 2022b44f5f607d8f5bfc760285930c9e88bee7a0178df7045c60b90520bf069c"
  ],
  "followup": "Planner, before WO-123 activates: (1) decide what the composition does when a behavior verifier passes every criterion and asks for human attention over a scope or convention defect that the review episode exists to judge, for example by telling the verifier of a review-enabled stream that non-behavior defects belong to the reviewer; record the choice and prove it with a live Claude verifier, since two of three Claude verifier attempts stopped there. (2) Give reactor.ts headroom under the 100,000-character capsule bound before the next order edits it; 345 characters remain, and FUP-f12a1f894923b2b2's three items are in the same file. (3) If the composition ever reviews a stream that applied an in-stream repair, re-verify every criterion at the repaired revision first, or review a freshly opened stream as the README describes.",
  "rejected": [
    {
      "option": "Fail FINAL-001 and route a repair",
      "reason": "All seven criteria are met. Criterion 4 asks for each harness as the reviewer with a session distinct from the verifier's and the implementer's, which both final rows show; the three seams are outside the criteria and two of them touch this order's non-goals."
    },
    {
      "option": "Change the verifier's instructions or split reactor.ts in this review",
      "reason": "Both are judged feedback sources and behavior; a reviewer does not write a change and certify it."
    },
    {
      "option": "State the seams only in the report",
      "reason": "A limit met in review is boarded here with a named follow-up, not left as a report sentence."
    },
    {
      "option": "Record the third seam as an observed defect",
      "reason": "It was read from source, not run, and no shipped caller reaches it; it is labeled an inference."
    }
  ],
  "reopenWhen": "WO-123 activates or a planning pass amends it; an order edits reactor.ts; or a composition run reaches attention after a fully passing behavior verification."
}
```

Goal alignment: the mission contribution is a second, independent judgment the delivery vertical can sequence, and the live rows show it finding defects that passing tests do not judge without writing or widening scope. Rule beating and seeking the wrong goal: the first seam matters most, because a composition measured only by fixtures with a double verifier would never meet a verifier that stops the stream first, and the review would then rarely run in practice. Drift to low performance: the receipts for the two stopped attempts are kept as failures, not relabeled. Shifting the burden: each seam names the order that must carry it, so the operator does not rediscover it at WO-123. Tragedy of the commons and escalation: this review ran one product gate and no subagents, and adds no gate or approval. Policy resistance and success to the successful: the existing attention hold is left as it is, and its interaction with review goes to planning with evidence. Naive Interventionism: no judged source was edited in review. NoOp would leave the first two seams to be met as a stopped live run and a refused feedback audit in the next delivery order.
