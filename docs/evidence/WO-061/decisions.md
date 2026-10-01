# WO-061 decisions

## WO-061-D008 — Final executor evidence

```json
{
  "id": "WO-061-D008",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Judge all eight WO-061 criteria met on the staged subject and hand off to independent verification. No source changes follow the passing review gate. The declined economy experiment claims no measured improvement.",
  "evidence": [
    "npm run test:docs: 24 passed, zero failed, 39597 ms, 24 fresh tasks; recorded 2026-10-01T22:15:03.547Z.",
    "npm test -- --review: 40 passed, zero failed, 838316 ms, 85 fresh tasks; recorded 2026-10-01T22:29:05.059Z. Both rows bind code identity e584634cbd5b2c85d81c245ed16946397924e37ae5628c1bce546aa73d9408b9, which includes the staged new source, test and fixture files.",
    "compiler-tests.txt: 138 passing tests, including nine new tests. fixtures.mjs --check reproduces the 50353-byte fixture-contracts.json with both revision diffs.",
    "The changed-section diff removes exactly its two prior statement IDs and two draft IDs, preserving the unrelated statement/draft and relations. The supersession diff changes the unedited requirement and its draft to superseded and invalidates the dependent answer relation.",
    "D006 records the initial build, invalid fixture and command-selection failures and their corrections; no failing required final gate is hidden."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The fixture-proven pure source-to-draft interface and explicit invalidation now exist for WO-124 and the later composition. This is the promised prerequisite, not a claim of a working end-to-end delivery loop.",
    "traps": "The evidence holds the original standards: undecided meaning stays open, inferred origin is preserved, no placeholder scope/check is emitted, and unchanged items retain their identity. No new gate, dependency, model episode or publication effect was added. Shared review cost was measured rather than treated as free; recurring operator rescue is not part of compile or revise. The other system lenses retain D001's bounded comparison.",
    "naiveInterventionism": "Existing compiler consumers, mission contracts and publication controls passed the full gate; only the intended new interface and label-driven evidence/pins change.",
    "noOp": "The observed outcome closes the source-to-draft gap the order named. Removing it would restore that prerequisite gap; a downstream interface requirement is the reopening evidence."
  },
  "rejected": [
    { "option": "Repeat the passing review gate without a source change", "reason": "Adds shared execution cost without establishing another obligation." }
  ],
  "reopenWhen": "Independent verification finds a declared criterion unmet, a downstream consumer needs a different contract boundary, or final-review integration changes the subject."
}
```

## WO-061-D009 — Existing register seams stay with planning

```json
{
  "id": "WO-061-D009",
  "date": "2026-10-01",
  "dispatch": "resume: next; handoff register read",
  "decision": "Leave the nine touching register rows on their existing routes. Newly selected inputs WO-180 D013 and WO-182 D006 describe composition duties, not an unmet WO-061 criterion. FUP-a8ff3066b5663629's WO-061-activation reopening condition has occurred: the planner must carry the BaselineStory new/defect classification source and non-reproduction waiver semantics before WO-123 activates. FUP-68937a5651fb775a carries the delivery-preparation.json producer and repeat-publication readiness decision. This contract supplies statement classes, provenance, criterion drafts and open decisions; it does not choose a BaselineStory kind, write baseline receipts, complete repository checks or produce publication preparation. Those changes need the existing planning route and are not silently added here.",
  "evidence": [
    "plan followups --touching and its cursor continuation at revision 01eb98b183323b74c354753d265860c54fb96114b4aa75ec39af206b4474aaaf list nine textual matches among 216 pending rows.",
    "New input docs/evidence/WO-180/decisions.md D013: the primitive consumes a caller-supplied BaselineStory kind, has no source-class reader or waiver producer, and calls for planning before WO-123. Its reopenWhen includes WO-061 activation, recorded in this worktree's control log.",
    "New input docs/evidence/WO-182/decisions.md D006: no producer writes delivery-preparation.json, and the composition must bind the ambiguity inventory, category checks and monitoring owner; repeat-publication readiness needs a separate decision.",
    "Seven other matches concern unchanged release preparation (FUP-b7a66e7a4fa7ad20), usage pruning (FUP-50cda1c03ecd8ea8), resident hold wording (FUP-56b599e15f97e666), historical operator text (FUP-71fc2efc208f597a), corrected-usage attribution (FUP-acfe4bfda716d8fb), authority evidence deduplication (FUP-adf6621e7f958dd8), and standing writer prose (FUP-fd05316b6030ef73). No implementation of those seams changes here; the duplicate-evidence percentage trigger is not measured by this order. Current operator-word advisories are zero in docs-check."
  ],
  "reopens": {
    "decisionId": "WO-180-D013",
    "observation": "WO-061 activated on 2026-10-01. StoryContract source classes/provenance now exist; the composition's class-source and waiver duties remain routed on FUP-a8ff3066b5663629 for planning before WO-123."
  },
  "rejected": [
    { "option": "Add baseline classification, waiver or publication-preparation producers to this compiler order", "reason": "Expands the fixed class contract and crosses into excluded runtime/composition surfaces after the passing gate; the register already names the planning route." },
    { "option": "Dispose these rows as satisfied by classification fixtures", "reason": "No fixture proves their distinct consumer/producer duties." }
  ],
  "reopenWhen": "Planning amends WO-123 or WO-061 with those explicit duties; WO-123, WO-112 or WO-118 activates; or one of the existing register conditions is independently observed."
}
```

## WO-061-D006 — Execution corrections

```json
{
  "id": "WO-061-D006",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Correct the initial type guard, the invalid NUL fixture and the evidence command selection before the required gates.",
  "misread": "The initial SourceSpan guard accessed both union-specific IDs without an in check. The criterion-boundary test included NUL despite consuming decoded SourceBundles. The first artifact/verification write calls assumed those scripts accepted the edition flags supported by authority/feedback.",
  "meant": "Narrow the SourceSpan union explicitly. Test only input the decoder admits. Read each evidence script's own parser: artifact/verification use the current manifest, while authority/feedback support explicit edition arguments.",
  "changed": "Added the in guards; removed only the NUL case, retaining the admitted tab, line-break and length cases; selected WO-061 revision 001 in current.json and used the two scripts' --write calls. The build and all 138 compiler tests pass; all four selected edition checks and the console fixture check pass.",
  "evidence": [
    "Initial build: TS2339 for sectionId/entryId in story-contract.ts; corrected build exits 0.",
    "First focused suite: 8 of 9 pass; the decoder refuses $.sections[0].text with control character. source-bundle.ts permits tab/LF/CR and rejects NUL before compilation.",
    "artifact-identity-evidence.mjs and verification-evidence.mjs require exactly one --write or --check argument, then resolve currentEvidence from the manifest. Initial invalid calls wrote no artifact/verification files. The feedback carry succeeded independently.",
    "compiler-tests.txt: 138 pass, zero fail, including all nine WO-061 fixtures and existing compiler purity tests."
  ],
  "rejected": [
    { "option": "Weaken the SourceBundle decoder or omit the description validation", "reason": "The fixture was invalid; existing contracts do not need to change." }
  ],
  "reopenWhen": "A supported input fails these boundaries or an evidence script changes its selector contract."
}
```

## WO-061-D007 — Observed write-back and edition results

```json
{
  "id": "WO-061-D007",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Keep the implemented compiler, bounded in-place write-backs and selected WO-061 revision 001 editions for the required gates. Preserve all earlier editions. No publication lock bytes need to change: both linked-section locks remain current after the edited sections were checked.",
  "evidence": [
    "Product 12 gains 167 UTF-8 bytes, below 200; total 18164 versus ceiling 18357, leaving 193. Product 06 gains 93 bytes, below 150; nonexempt total 40649 versus ceiling 40775, leaving 126. Neither ceiling changes.",
    "publication:check passes 253/253 indexed headings and both source locks: 29 everyday-user and 45 engineer linked sections current. --print-locks reproduces the existing locks.",
    "harness emit/check: 32 generated surfaces; harness-context --check exits 0. Local terms observation is unavailable and does not claim a pass for that observation.",
    "authority/001 --check: two unchanged programs and the existing migrations, widening rejections, runtime denials and 35 bundle comparisons pass. artifact-identity/001 --check: four files current, Seiri hash/frozen oracle unchanged. verification/001 --check: four files, defect/repair/staleness/replay green.",
    "feedback-001 carries from WO-178 feedback-002 and preserves the live audit at WO-181 feedback-002; its check passes ten regressions and ten removal failures. No new live episode.",
    "console-fixtures --check: all five cases match. Only manifest.json and expected/selfhost.html, .json and .txt change, matching WO-162 D012's four-file cause pattern.",
    "The new module is in commonSources for all five evidence suites. The harness suite checks the existing recorded observations; it has no re-mint write mode."
  ],
  "rejected": [
    { "option": "Rewrite old editions or refresh unchanged publication locks", "reason": "Old evidence is preserved; current lock checks establish the unchanged linked-section identities." }
  ],
  "reopenWhen": "A final gate finds a changed subject, a document bound is exceeded, or an edition/console check names unexplained drift."
}
```

## WO-061-D005 — Component release and evidence obligations

```json
{
  "id": "WO-061-D005",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Bump only @dotln/compiler from 0.22.1 to 0.23.0 for the new public StoryContract v1 types, exported rule data, compile and revise functions. Update its source label, skeleton/console pins and lockfile. Register the new module in commonSources, refresh the installed harness snapshot, deterministically re-mint authority, artifact-identity and verification under WO-061, carry the current feedback edition and re-pin the console self-host fixtures. The harness edition remains a check of its recorded installation/live observations rather than a writable edition. Put the two bounded product write-backs in their cited existing sentences and refresh publication source locks.",
  "evidence": [
    "At activation, compiler package.json and artifact-identity.ts both read 0.22.1; skeleton and console require that exact version. The only added package implementation is compiler/src/story-contract.ts and its export.",
    "WO-061 Cost and criterion 7 name the registration, deterministic re-mints, feedback carry and console re-pin; WO-154 D011 and WO-162 D012 establish the label-driven carry and four console fixture exceptions.",
    "D004 records application v0.63.0 over the observed local v0.62.0 baseline; no activation-completion paragraph is owed in the roadmap.",
    "The new module imports only existing compiler modules. No source the feedback verifier judges changes behavior; artifact-identity.ts changes only its compiler release label."
  ],
  "rejected": [
    { "option": "Patch compiler release", "reason": "The public export and new contract are a compatible surface addition, classified minor by the order." },
    { "option": "Bump skeleton or console", "reason": "Only their dependency pins and label-driven fixtures change, not their package implementation." },
    { "option": "Exclude the new module from evidence", "reason": "The registered compiler index loads this module in every edition." },
    { "option": "Run a live feedback episode", "reason": "No judged behavior changes; the deterministic carry is the named remedy for this compiler label move." }
  ],
  "reopenWhen": "An edition check identifies changed judged behavior, another console fixture changes, final-review integration moves the release baseline, or compatibility impact widens."
}
```

## WO-061-D001 — Pure compile and revision identity

```json
{
  "id": "WO-061-D001",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Add one pure story-contract module. Partition text into disjoint, provenance-bearing statements; specific strike/image rules precede section and question rules. Retain supplied classifications and semantic relations as inferred with their rationale and resolving evidence spans. Preserve source-unit fingerprints and the recorded inference list in StoryContract v1 so revise can retain unchanged classifications without rereading an earlier bundle. revise returns the new contract and explicit lists of invalidated old statement, criterion and relation IDs. Its optional third argument supplies new inference entries, including a new decision's supersedes relation; the two-argument call retains only inferences whose source, target and evidence units remain unchanged. IDs include their entire source-unit fingerprint so any change to a section or entry invalidates every item derived from it. Explicit supersession marks the unedited target and its drafts superseded, and invalidates dependent semantic relations.",
  "evidence": [
    "WO-061 Objective, Design and criteria 1–4: classification is declared or supplied, ambiguity stays open, revision granularity is a section or discussion entry, and supersession requires an explicit relation.",
    "source-bundle.ts defines SourceSpan as half-open UTF-8 byte offsets and resolveSourceSpan verifies character boundaries. sourceBundleHash canonicalizes images; sections and discussion retain document/thread order.",
    "SourceBundle has no semantic-relation field. A fresh supersession therefore needs a supplied inference, never a text heuristic or a positional answer.",
    "mission-check-protocol.ts defines the separate MissionStoryContract; it is read and is not an implementation consumer of this contract."
  ],
  "rejected": [
    { "option": "Classify all text with a model", "reason": "Discards the reproducible structural facts and the rule/inferred distinction required by the order." },
    { "option": "Infer answers or supersession from discussion position", "reason": "Position proves only follows; semantics require supplied evidence." },
    { "option": "Invalidate individual edited spans alone", "reason": "The order requires invalidation of the whole changed section or entry, including every derived draft." },
    { "option": "Store the original bundle or mutate the old contract", "reason": "Fingerprints and recorded inferences suffice for this pure comparison; original contracts remain immutable." },
    { "option": "NoOp", "reason": "Leaves WO-124 without classified source statements and draft criteria, blocking this prerequisite of the source-to-deliverable loop." }
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Preserve operator intent and source changes as a reusable compiler interface. This supplies the StoryContract prerequisite for WO-124's scope/check derivation and WO-123's evidence use.",
    "traps": {
      "policyResistance": "Use SourceBundle byte spans and the existing AcceptanceCriterion checks; do not introduce another verification verdict.",
      "tragedyOfTheCommons": "One writer and no spawned agents; one final review gate after focused fixtures, with usage observed at dispatch and handoff.",
      "driftToLowPerformance": "Undecided classes, unanswered questions and descriptions that cannot pass the existing validator stay open.",
      "escalation": "No new lifecycle gate, dependency, model episode or external effect.",
      "successToTheSuccessful": "Use only evidence-supported rules; explicit caller inferences remain available regardless of provider.",
      "shiftingTheBurden": "Stable identities and explicit invalidation replace operator reconstruction of which old requirements still hold.",
      "ruleBeating": "Pinned fixture expectations, overlapping-span refusals and contract diffs establish the outcome, not a generated receipt count.",
      "seekingTheWrongGoal": "A source-to-draft interface and selective staleness advance the product; they do not claim a complete impact map or delivery loop."
    },
    "naiveInterventionism": "Keep existing exports, verification admission, MissionStoryContract and publication controls. Add one reversible module/export and bounded write-backs; test actual source spans and consumers' validator.",
    "noOp": "The bundle remains data with no compiled requirements or revision guard. Reopen the chosen interface if WO-124 needs a different derivation contract."
  },
  "reopenWhen": "A downstream consumer needs cross-unit derivation, a new class, additional relation kinds or a different revision result; a fixture establishes an incorrect structural rule."
}
```

## WO-061-D003 — Criterion drafts and bounded write-backs

```json
{
  "id": "WO-061-D003",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Emit one live-evidence draft per requirement, without surfaces or checks. Normalize each line break to one space; a description that verificationLine refuses stays an open decision instead of being shortened. A requirement explicitly referencing an image as [image:<bundle image id>] derives a visual draft; other requirements derive behavior drafts. Export that reference syntax with the structural patterns. Re-measure document headroom and keep write-backs in place within 200 added bytes in product 12 and 150 in product 06.",
  "evidence": [
    "verification.ts copyCriterion checks identity/description with verificationLine (nonempty, at most 2000 characters, no control characters), admits visual and behavior, and requires actual nonempty surfaces and checks.",
    "WO-061 Design gives WO-124 ownership of surfaces/checks and requires visual drafts only when a statement references a visual annotation. Classifying an image span as a requirement would overlap a rule-decided span and is refused.",
    "At entry: product 12 is 17997 UTF-8 bytes against ceiling 18357 (360 headroom); product 06 is 40556 nonexempt bytes against ceiling 40775 (219 headroom). Product 06's earlier 1802-byte headroom is no longer current."
  ],
  "rejected": [
    { "option": "Placeholder surfaces/checks", "reason": "They claim scope no source has derived; WO-124 owns the missing fields." },
    { "option": "Truncate long descriptions", "reason": "Changes what the requirement says." },
    { "option": "Treat every requirement near an image as visual", "reason": "Co-location does not prove the statement references that annotation." }
  ],
  "reopenWhen": "WO-124 supplies surfaces/checks as compiler inputs, the description contract widens, or a consumer supplies another explicit visual-reference syntax."
}
```

## WO-061-D002 — Economy experiment declined

```json
{
  "id": "WO-061-D002",
  "kind": "experiment",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Keep focused fixtures during implementation and both required gates on the finished subject; decline a separate benchmark of repeated full-gate runs.",
  "question": "Would benchmarking repeated full review gates improve this bounded compiler order compared with focused fixtures followed by the required gates?",
  "alternatives": [
    "Focused compiler fixtures, then required review/document gates",
    "Repeated full review gates during implementation"
  ],
  "observation": "The order requires both final gates and fixture coverage of the compiler boundary. A benchmark of repeated gates would consume the same shared process work without reducing either obligation; no comparative speedup is established.",
  "evidence": [
    "WO-061 criterion 8 and Evidence gate"
  ],
  "budget": {
    "wallSeconds": 60
  },
  "execution": "declined",
  "cost": {
    "wallSeconds": 0.0003022500000000008,
    "tokens": null,
    "commands": [
      "node inline economy receipt (read order and record declined benchmark)"
    ],
    "source": "performance.now across the source read and first receipt write; shared entry research is not separately attributable."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "Focused story-contract fixtures; npm test -- --review; npm run test:docs"
    ],
    "summary": "No economy improvement claimed; retain the required validation."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "reason": "Repeating the expensive final gate solely to benchmark it does not discharge additional required evidence.",
  "rejected": [
    {
      "option": "Benchmark repeated review gates",
      "reason": "Shared gate work is required once at the final subject; repetition adds cost without a demonstrated benefit."
    }
  ],
  "reopenWhen": "Focused fixture coverage misses a compiler regression found by the full gate, or measured repeated order costs support a bounded runner optimization."
}
```

## WO-061-D004

```json
{
  "id": "WO-061-D004",
  "date": "2026-10-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.63.0, the next minor above the observed release baseline v0.62.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.62.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-061-story-contract-compile.md"
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

## WO-061-D010 — Verification: a same-role entry between a question and its reply leaves no follows fact

```json
{
  "id": "WO-061-D010",
  "date": "2026-10-01",
  "dispatch": "resume: verify",
  "decision": "Pass WO-061 on all eight criteria. Record, without failing the order, one gap in the structural rule that criterion 4's fixtures do not cover. compileStoryContract records follows only when the entry immediately after a question has another role. When the asker posts a second entry before anyone else replies, the thread records no follows fact at all.",
  "evidence": [
    "docs/verifications/WO-061/VER-001.md",
    "packages/compiler/src/story-contract.ts lines 428-446: the follows rule reads only bundle.discussion[i + 1] and records nothing when that entry's author equals the question's.",
    "Reproduction against packages/compiler/dist at code identity e584634cbd5b2c85d81c245ed16946397924e37ae5628c1bce546aa73d9408b9: discussion e-q (reporter, 'Should the panel be compact?'), e-more (reporter, 'It matters on small screens.'), e-reply (reviewer, 'Compact is fine for small screens.') compiles to relations [].",
    "WO-061 Design: 'the next entry by another role is recorded only as the structural fact follows'. Inference: that wording reads most naturally as the first later entry whose role differs, which here is e-reply. In every pinned fixture question, the immediately next entry has another role, so both readings give the same facts. The sameRole test only asserts that e-q2 is not a follows source, which both readings satisfy.",
    "Criterion 4 is judged against its fixtures, and 'a case outside them is a follow-up, not a failure'."
  ],
  "rejected": [
    { "option": "Fail criterion 4", "reason": "The pinned fixtures yield the stated facts, and the order routes a case outside them to a follow-up." },
    { "option": "Repair the rule during verification", "reason": "A verifier does not edit implementation to turn its own verdict green. The repair moves relation IDs and the retained fixture contracts, so it belongs to an order that edits story-contract.ts." }
  ],
  "goalAlignment": "Mission and critical path: WO-124 and WO-112 read StoryContract threads to find candidate answers, so a missing follows fact makes a candidate harder to locate. It never yields a false answers relation, because answers still needs a supplied entry with evidence. Rule beating: the passing fixtures cannot tell the two readings apart, so this record names the case that would. Drift to low performance: the gap is recorded, not normalized. Commons: no extra gate; the existing passing review row at the unchanged code identity is the gate evidence, and a started rerun was stopped without recording a check. Escalation and policy resistance: no new gate or rule. Shifting the burden: the follow-up names its fixture and landing seam. Success to the successful: both readings were judged against the Design text, not against the implementation already built. Seeking the wrong goal: the judgment is the source-to-draft interface, not fixture counts. Naive Interventionism: no source changes here. NoOp (passing without this record) would leave the gap known only through the report prose.",
  "followup": "Planner, for the next order that edits packages/compiler/src/story-contract.ts (WO-124 is the expected one): decide whether follows targets the first later discussion entry by another role, skipping same-role entries, or only the adjacent entry. State the reading in the STORY_RULE_PATTERNS comment. Add a fixture of question, same-role follow-up, reply by another role that pins the chosen fact. Leave WO-061's retained fixture contracts as historical evidence. Priority: low; answers semantics are unaffected.",
  "reopenWhen": "An order edits the follows rule in story-contract.ts, or a consumer relies on follows to locate a candidate answer."
}
```

## WO-061-D011 — Final review: pass, and four compile seams outside the declared fixtures

```json
{
  "id": "WO-061-D011",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Pass WO-061 on all eight criteria against the original order. The basis is VER-001, this review's reading of the full diff, a rerun of the nine WO-061 tests and the fixture-diff check on a fresh build, direct edition, console, harness and publication checks, and the passing product row at the unchanged code identity. main had not moved past the executor's base (v0.62.0, 3a4aa82a), so no integration was needed and v0.63.0 stays the target. Board four seams that the order's fixtures do not reach, without failing the order. (1) compileStoryContract throws 'span must resolve to nonempty text' on a bundle that decodeSourceBundle admits, when an image's referencedBy covers only whitespace: the image rule passes referencedBy through copySpan, which requires nonempty trimmed text, while WO-060 refuses only an empty span. (2) Two identical relation entries yield two relations with the same relationId in one contract. Identical class entries refuse as overlapping, and revise removes duplicates, so compile(bundle, [r, r]) and compile(bundle, [r]) differ in bytes and contractId. (3) A rule span inside a sentence splits what the sentence says. A class entry over 'The panel shows ~~10~~ 20 rows.' refuses (criterion 2 requires this), so a caller can only classify 'The panel shows' and '20 rows.' as two requirements, which derive two fragment drafts. A question entry with an inline strike likewise becomes two question statements and two unanswered open decisions. (4) The StoryContractRevision comment says replacement items have fresh IDs. In fact a superseded statement or draft keeps its ID with a new status, and a draft whose claimType changes because an image in another unit was added or removed keeps its criterionId. Both IDs are correctly listed as invalidated, but a consumer that diffs by ID alone would miss the change.",
  "evidence": [
    "docs/final-reviews/WO-061/FINAL-001.md §Probes: reviewer probes P1-P4 run against packages/compiler/dist built from the staged subject at code identity e584634cbd5b2c85d81c245ed16946397924e37ae5628c1bce546aa73d9408b9",
    "P1: section text 'Panel text.   More text.' with image referencedBy {sectionId:'s', start:11, end:14} decodes ok; compileStoryContract throws 'story contract: span must resolve to nonempty text' (story-contract.ts ruleSpans calls copySpan(bundle, image.referencedBy); source-bundle.ts refuses only referencedBy.start === referencedBy.end)",
    "P2: compileStoryContract(bundle, [rel, rel]) for one supplied answers entry returns relations follows, answers relation:f3deb26d4b44a0a2, answers relation:f3deb26d4b44a0a2",
    "P3: the whole-sentence class entry refuses with 'overlaps rule span {\"end\":22,\"sectionId\":\"s\",\"start\":16}'; the split entries derive drafts 'The panel shows' and '20 rows.'. Entry 'Should we ~~drop~~ keep it?' compiles to question 'Should we', struck '~~drop~~', question 'keep it?' and open decisions unclassified (the section), unanswered, unanswered",
    "P4: requirement 'Match the layout in [image:img].' in s-req with the image referenced by s-img; removing the image in r2 keeps criterion:354b3951ccde02a9 with claimType visual -> behavior and lists that ID in invalidated.criteria; the criterion 3 supersession test asserts the superseded statement keeps its statementId",
    "WO-061 criterion 1 enumerates its bundles (this order's fixtures and WO-060's six valid bundles) and criterion 4 routes cases outside its fixtures to a follow-up; none of the four seams occurs in those bundles"
  ],
  "rejected": [
    { "option": "Fail the order", "reason": "Every criterion holds on the bundles it enumerates. Seam 3 follows from criterion 2's overlap refusal itself, and seams 1, 2 and 4 occur only outside the declared fixtures." },
    { "option": "Fix seams 1, 2 or 4 in this review", "reason": "Each edits story-contract.ts, which changes code identity, the retained fixture contracts and the registered evidence source. A behavior correction by the reviewer returns through repair and a fresh verification (product 07 §Ideation breakout receipt and verification); the boy-scout bound does not cover it." },
    { "option": "Widen the contract so a statement may enclose a rule span", "reason": "That changes criterion 2 and the twelve-class partition, so it needs a planning decision rather than a review edit." },
    { "option": "NoOp: leave the seams only in the report", "reason": "D010's follow-up names only the follows rule, so planning would not carry these into WO-124, the next order that edits the module." }
  ],
  "goalAlignment": "Mission and critical path: WO-124 completes these drafts, and WO-062 and WO-112 feed the compile with real artifacts and model entries. Seam 1 can stop a whole real bundle from compiling, and seam 3 lowers draft quality for edited requirements, so both reach the source-to-deliverable loop. Policy resistance: criterion 2's guard (never overwrite markup) produces seam 3, so this record names the tension instead of weakening the guard. Rule beating: the passing fixtures cannot see these inputs, so the record names the inputs that would. Drift to low performance: recorded, not normalized. Commons: no extra full gate; the product row at the unchanged code identity stands, and the probes ran in under a second. Escalation: no new gate. Shifting the burden: the follow-up names the landing order and the fixtures. Success to the successful: each seam is judged against the order's text, not the implementation. Seeking the wrong goal: the judgment is about the contract consumers will read, not fixture counts. Naive Interventionism: no source change in review. NoOp: covered under rejected.",
  "followup": "Planner, for WO-124 (the next order that edits packages/compiler/src/story-contract.ts), or WO-062 if it lands first: (1) decide whether an image whose referencedBy covers only whitespace derives no statement or is refused by decodeSourceBundle, and pin a fixture so compileStoryContract never throws on an admitted bundle; (2) remove duplicate relation entries in compile as revise already does, or refuse them; (3) decide whether a requirement or question may enclose a struck span as one statement (for example, text with the strike recorded as a nested rule fact), and until then state in the inference-slot contract WO-112 supplies that classifying around an inline strike yields fragment drafts; (4) correct the StoryContractRevision comment: invalidated IDs may reappear in the new contract with a changed value (status or claimType). Priority: low for 2 and 4, medium for 1 and 3 before WO-112 runs on real artifacts.",
  "reopenWhen": "WO-124 or WO-062 activates, an order edits story-contract.ts, or a real bundle fails to compile or yields fragment drafts."
}
```
