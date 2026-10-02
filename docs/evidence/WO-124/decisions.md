# WO-124 decisions

## WO-124-D001 — Snapshot-bounded derivation

```json
{
  "id": "WO-124-D001",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Extend the existing story-contract module with deriveSurfaces, a typed repository profile, a decoded snapshot file index and exported literal path/noun rules. Derive only from active requirement statements. Resolve named files and demonstrated directories to indexed files, retain all rule/inferred provenance on each unique path, and select complete profile command strings whose declared directories contain those files. Missing paths and empty demonstrated directories remain candidates. A requirement without a surface lowers confidence; default threshold 1 hands off. A missing bounded snapshot hands off with the WO-054 bound. The new skeleton reader reuses assertWorktreeSnapshot before indexing the sealed mount and hashes actual UTF-8 bytes with SHA-256. The pure compiler accepts no ambient filesystem, model or clock.",
  "evidence": [
    "WO-124 Objective, Design and criteria 1-3 declare pure inputs, confidence as the covered share of requirements, default threshold 1, unresolved paths as candidates and whole command selection.",
    "story-contract.ts exposes active/superseded classified statements and draft criteria; deriveSurfaces does not reinterpret non-requirements or retired requirements.",
    "verification-worktree.ts exposes assertWorktreeSnapshot, which validates the capsule and checks the complete read-only physical mount against its snapshot seal, including symlinks, text, size, inventory and mode bounds. That file stays unchanged.",
    "WO-073's profile is a role-loaded Markdown document planned after this order; WO-124 explicitly supplies a typed fixture input and excludes that mapping.",
    "scripts/lib/evidence-sources.mjs registers story-contract.ts in commonSources, shared by authority, artifact-identity, verification, feedback and harness. The new reader has no incoming registered-source import."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Removes hand-entered scope/test selection from the source-to-deliverable route; WO-123 and WO-118 consume this prerequisite. The interface and fixture evidence are usable outside this session without private configuration.",
    "traps": {
      "policyResistance": "Decoded profile/index inputs and the snapshot seal agree on the same bounded files; derivation grants no effects or authority.",
      "tragedyOfTheCommons": "One writer, no spawned agents or live model episode; reuse the existing validator and perform the required shared review gate once after source stabilization.",
      "driftToLowPerformance": "Any uncovered active requirement hands off by default. Missing named paths never become authorized surfaces.",
      "escalation": "No additional lifecycle gate, profile-document loader or automatic scope expansion.",
      "successToTheSuccessful": "Explicit path resolution, demonstrated architecture and supplied inference are each admitted with their own provenance; existing portfolio derivation remains independent.",
      "shiftingTheBurden": "Machine-derived scope/check candidates remove repetitive typing, while a named NeedsHuman result keeps unresolved judgment visible.",
      "ruleBeating": "Fixtures pin actual paths, provenance, command bytes, coverage ratios and malformed field paths; a green count alone cannot substitute for those values.",
      "seekingTheWrongGoal": "The outcome is a reproducible bounded plan input for the delivery loop, not an inferred full dependency graph or an autonomous model episode."
    },
    "naiveInterventionism": "Preserve existing contract compilation/revision, portfolio scope, verification host and snapshot security checks. Existing consumers keep their interfaces. The smallest useful probe is the required fixture contract/profile/index and a host-produced fixture mount; additions are reversible.",
    "noOp": "Leaving the gap retains manual surfaces and commands and blocks the planned composition. The bounded pure interface is authorized and offers a directly executable acceptance test."
  },
  "rejected": [
    { "option": "Let a model freely choose paths or commands", "reason": "Unobserved paths could silently widen scope; supplied inference remains labeled and snapshot-resolved." },
    { "option": "Read WO-073's Markdown profile inside the derivation", "reason": "The typed projection does not yet exist, and effectful document loading conflicts with this order's pure boundary." },
    { "option": "Emit demonstrated directories without resolving their files", "reason": "Explicit indexed files make every selected surface observable and command coverage unambiguous within the sealed snapshot." },
    { "option": "Duplicate the snapshot filesystem walker", "reason": "The existing validator already judges the host seal and bounds; another validator could drift and add maintenance." }
  ],
  "reopenWhen": "WO-073 supplies a typed profile projection, a downstream consumer needs directory surfaces or additional path syntax, the snapshot bounds change, or the declared fixtures fail."
}
```

## WO-124-D002 — Economy experiment declined

```json
{
  "id": "WO-124-D002",
  "kind": "experiment",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "question": "Would a new snapshot walker save recurring work compared with reusing assertWorktreeSnapshot and reading its bounded sealed files?",
  "decision": "Decline a timing experiment and reuse the existing sealed-snapshot validator; claim no measured economy improvement.",
  "alternatives": ["Reuse the existing validator, then index the sealed files", "Implement and benchmark a second snapshot walker"],
  "observation": "The existing exported validator already checks the capsule and full physical read-only inventory, including the bounds the new index must honor. A microbenchmark would not establish implementation/maintenance savings or a recurring per-order benefit for these fixture-only inputs.",
  "evidence": ["packages/skeleton/src/verification-worktree.ts inventory and assertWorktreeSnapshot own the existing host-produced snapshot seal and bounds; WO-124 prohibits editing that source."],
  "rejected": [{ "option": "Benchmark a duplicate walker", "reason": "A runtime microbenchmark would not decide implementation cost, validator drift risk or recurring work savings for these fixture-only inputs." }],
  "budget": { "wallSeconds": 60 },
  "execution": "declined",
  "reason": "The correctness-preserving reuse choice follows directly from checked source; a timing experiment adds work without a credible deciding benefit observation.",
  "cost": { "wallSeconds": 0, "tokens": null, "commands": ["No experiment command executed (declined); source was read as an existing required input"], "source": "No experiment executed; token counters unavailable" },
  "effect": { "wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["No before/after probe executed (declined)"], "summary": "No measured economy improvement claimed" },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": { "lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null },
  "reopenWhen": "A real consumer measures indexing cost or the shared validator no longer admits the required snapshot format."
}
```

## WO-124-D003 — Execution corrections

```json
{
  "id": "WO-124-D003",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Exclude path references from the noun scan, preserving the union when a noun is explicitly present in the remaining prose. Complete the declined experiment record with the common decision fields before release preparation.",
  "misread": "The first noun scan treated the parser segment inside src/parser/read.ts as a separate architecture noun, widening the explicit-file fixture to both parser files. The initial experiment record had the economy fields but omitted the common decision, evidence and rejected-choice fields the metadata parser requires.",
  "meant": "Path syntax resolves only the named path; architecture nouns are literal words in the remaining requirement prose. Every structured decision, including a declined experiment, satisfies the common record schema.",
  "changed": "Both quoted and bare path references are removed from the noun scan. The explicit and partial fixtures now pin one file while the prose-noun fixture still selects its directory's two indexed files. D002 gains the common decision fields and the required nonempty declined-command descriptions without changing its declined outcome.",
  "evidence": ["compiler-tests-initial.txt: 142/143 passed; explicit fixture had the unexpected src/parser/write.ts surface. Corrected compiler-tests.txt: 143/143 passed, including existing purity and story-contract tests.", "snapshot-index-tests.txt: the host-produced mount, UTF-8 byte count, hash, repeated output and physical input-drift refusal pass.", "The first release prepare --local exited before preparing with 'decision requires id, date, dispatch source, evidence, rejected choices and reopening condition'."],
  "rejected": [{ "option": "Widen the expected explicit-file fixture", "reason": "Would hide unrequested directory expansion instead of fixing the declared rule." }],
  "reopenWhen": "A declared path fixture widens via a noun embedded in that path, or the decision schema changes."
}
```

## WO-124-D004 — Release and bounded write-backs

```json
{
  "id": "WO-124-D004",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Prepare the classified application minor locally. Bump @dotln/compiler 0.23.0 to 0.24.0 for the compatible derivation/profile/index exports and @dotln/skeleton 0.49.1 to 0.50.0 for the new host snapshot reader. Update the compiler source release label, dependency pins and lockfile; the console's implementation version stays 0.4.0. Deterministically re-mint authority, artifact-identity and verification as WO-124 revision 001; carry feedback from WO-061 feedback-001, refresh the installed harness snapshot and check its recorded observations, and re-pin the console's four self-host fixture surfaces. Amend only the cited existing product sentences and check publication locks.",
  "evidence": [
    "Observed package.json values at this base: compiler 0.23.0, skeleton 0.49.1 and console 0.4.0; compiler/artifact-identity.ts holds the matching compiler release label.",
    "ProductContent measurement at this base: 03-architecture.md 174319 bytes versus ceiling 176132, headroom 1813; 06-roadmap.md 40649 nonexempt bytes versus ceiling 40775, headroom 126. Write-back additions must fit those current bounds as well as the order's 300/150-byte bounds.",
    "WO-124 Cost, criterion 5 and cited WO-154 D011/WO-162 D012 name these edition, carry and console-pin obligations. story-contract.ts is already registered in all five source inventories; the new reader has no incoming registered-source import and verification-worktree.ts remains unchanged.",
    "The current edition manifest selects WO-061 revision 001 for all four writable suites; earlier editions remain immutable. No source in the feedback verifier's judged-source list changes behavior, so a live model episode is not owed."
  ],
  "rejected": [
    { "option": "Patch-only component releases", "reason": "Both packages add compatible interfaces; the order classifies the change minor." },
    { "option": "Bump the console implementation version", "reason": "Only dependency pins and their label-driven fixture outputs change." },
    { "option": "Raise document ceilings", "reason": "The measured headroom fits concise in-place write-backs within this order's bounds." },
    { "option": "Re-run a live feedback episode", "reason": "The declared deterministic carry handles the compiler label move; no judged behavior source is edited." }
  ],
  "reopenWhen": "A required check identifies changed judged behavior, a fixture changes outside the label-driven four, document bounds are exceeded, or final-review integration moves the release baseline."
}
```

## WO-124-D006 — Correct the confidence explanation

```json
{
  "id": "WO-124-D006",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: next; conversation only explanation",
  "decision": "Correct the executor's chat explanation to the order's declared requirement-coverage gate. Preserve the specified algorithm and its mixed covered/candidate fixture.",
  "misread": "The explanation said a missing named path by itself makes the default gate hand back for human judgment. That overstated the declared confidence definition.",
  "meant": "A missing path always stays a candidate and never becomes a surface. Confidence counts requirements with at least one resolved surface, so a missing path alongside a resolved surface in the same requirement does not reduce confidence; an uncovered requirement does.",
  "changed": "Corrected this claim directly in chat and retained the mixed fixture's DerivedSurfaces result at confidence 1 with src/missing.ts still in candidates. No scope, authority or implementation changed to fit the earlier wording.",
  "evidence": ["WO-124 Design states confidence is the share of requirement statements yielding at least one surface, default 1.", "wo124-impact-surfaces.json covered-with-candidate and fixture-derivations.json retain the two observed parser files and the missing-path candidate at confidence 1; the compiler suite passes that pinned expectation."],
  "rejected": [{ "option": "Make every missing path independently force NeedsHuman", "reason": "Would change the work order's explicit confidence formula to match an inaccurate explanation." }],
  "reopenWhen": "The operator authorizes a separately recorded gate change, or a declared fixture contradicts this coverage definition."
}
```

## WO-124-D005

```json
{
  "id": "WO-124-D005",
  "date": "2026-10-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.64.0, the next minor above the observed release baseline v0.63.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.63.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-124-impact-surfaces-derivation.md"
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

## WO-124-D007 — Observed outputs before required gates

```json
{
  "id": "WO-124-D007",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Keep the fixture-proven derivation, sealed-mount reader, bounded write-backs and WO-124 revision 001 evidence selections. Stage the new code and fixtures so the gate's code identity and component comparison include them; then run the order's required document and review gates before claiming implementation-ready.",
  "evidence": [
    "compiler-tests.txt: all 143 tests pass, including five new derivation tests and existing compiler purity/StoryContract tests. snapshot-index-tests.txt: one passing host-produced mount test reports all four paths with byte sizes and SHA-256 values, including the independently pinned three-byte pi/newline digest and drift refusal.",
    "fixtures-check.txt: all eleven fixture derivations reproduce the 37302-byte fixture-derivations.json exactly; supplied classification and surface inference choices are explicitly fixture doubles.",
    "document-sizes.json: product 03 adds 232 bytes (limit 300), total 174551, headroom 1581; product 06 adds 56 bytes (limit 150), nonexempt total 40705, headroom 70. No ceiling changes.",
    "publication-check.txt: 253/253 indexed headings and both refreshed source locks pass (29 everyday-user and 45 engineer linked sections). The initial stale-lock result was corrected using --print-locks.",
    "authority-check.txt and artifact-identity-check.txt verify their new editions; verification-check.txt verifies planted defect, repair, staleness and replay. feedback-carry.txt and feedback-check.txt preserve WO-181 feedback-002's live audit through WO-061 feedback-001, with ten passing regressions and ten removal failures. No live episode ran.",
    "harness-check.txt verifies 32 generated surfaces; harness-evidence-check.txt checks four historical live role smokes and two historical writer smokes, with no claim of a current live run. harness-context-check.txt passes; local terms are unavailable, not a passing observation.",
    "console-check.txt matches all five cases; the only changed console fixture files are manifest.json and expected/selfhost.html, selfhost.json and selfhost.txt, following the compiler label and selected feedback edition.",
    "verification-worktree.ts has no diff. Release-surface precheck passes but warns that the untracked new reader was not compared; staging before the required gate discharges that omission. Package/lockfile diff changes only existing versions/pins, with no dependency addition."
  ],
  "rejected": [
    { "option": "Claim the review gate from focused tests", "reason": "Criterion 6 separately requires npm test -- --review and npm run test:docs at the complete subject." },
    { "option": "Rewrite historical editions or run another model episode", "reason": "The checked deterministic editions/carry preserve the recorded audit and close the stated evidence duties." }
  ],
  "reopenWhen": "A required gate fails, the code identity changes after its pass, or an unexplained edition/fixture change appears."
}
```

## WO-124-D008 — Correct gate preparation and status inspection

```json
{
  "id": "WO-124-D008",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: next; continue after interrupted tool delivery",
  "decision": "Format the fixture transcript generator and rerun the required document gate. Stop the unintended plain npm test invoked by bare harness evidence, then run the specified review gate. Preserve failed evidence and claim no passing result from the stopped gate.",
  "misread": "The new docs/evidence/WO-124/fixtures.mjs had not been included in the formatting command before the first document gate. During continuation, bare harness evidence was incorrectly used as a status read; it prepares projections and starts npm test. The document gate after D009 was started before refreshing the decisions index for the new decision rows.",
  "meant": "The generator is executable source and must be formatted too. harness evidence --wait observes a gate; the bare command runs evidence, and this order requires npm test -- --review.",
  "changed": "Formatted fixtures.mjs without changing its generated bytes and preserved test-docs-initial.txt. The repeated document gate passed all 24 checks. Stopped the extra plain test through harness evidence --stop before any repository edit, confirmed all three nested active markers stopped and no check recorded, and selected the order's review command. Preserved test-docs-stale-meta.txt and refreshed the decisions index with npm run meta before repeating the document gate after the sparse-slot correction.",
  "evidence": [
    "test-docs-initial.txt: 14 passed, ten failed, 18.47 s; format names only docs/evidence/WO-124/fixtures.mjs and dependent checks did not execute. This is an introduced formatting failure, not a claim of ten independent defects.",
    "After prettier --write, fixtures.mjs --check still reproduces all eleven derivations and 37302 bytes. test-docs-before-sparse-fix.txt: 24 passed, zero failed, 41.42 s, 24 fresh tasks.",
    "scripts/harness.mjs evidence branch calls prepareHarnessEvidence and runHarnessEvidence; --wait is a separate observing branch. The extra gate began 2026-10-01T23:39:57.540Z, stop was requested 23:40:52.508Z, and the stop receipt reports active [] and no check recorded. No gate input was written during that run.",
    "test-docs-stale-meta.txt: format passed; meta alone reports Decisions index is stale, and nine dependent checks did not execute. The command finished before any correction was written."
  ],
  "rejected": [
    { "option": "Ignore formatting or accept the stopped/plain gate for criterion 6", "reason": "Would leave a required preflight failing or substitute an unrecorded, differently selected gate for the specified evidence." },
    { "option": "Leave the accidental gate running and launch review alongside it", "reason": "Adds duplicate work and an overlapping live gate without establishing another required obligation." }
  ],
  "reopenWhen": "A required gate fails on current bytes, or an observing command acquires effects its procedure does not state."
}
```

## WO-124-D009 — Validate empty array slots

```json
{
  "id": "WO-124-D009",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: next; final source read",
  "decision": "Normalize admitted arrays to dense copies before field validation, so an absent slot is validated as undefined and refuses with its indexed field path. Add sparse architecture, command, directory, index and inference inputs to the malformed-input regression. Re-mint the staled deterministic editions as revision 002 and carry feedback into feedback-002 from this order's feedback-001; preserve revision 001. Keep the unpublished component release labels already assigned for the compatible new interfaces.",
  "misread": "The initial list helper returned an Array.isArray-checked input unchanged. Array.map skips absent positions, so profile/index decoding could silently admit an invalid sparse list.",
  "meant": "Every array position in a decoded profile/index/inference list must be validated and any missing entry must refuse with its field path. JSON arrays are dense, but the public functions also admit JavaScript values as inputs.",
  "changed": "surfaceList returns Array.from(value), preserving input order without mutating it and ensuring downstream field validators visit every slot. Stopped the running review gate through the supported command before editing any input; it recorded no check. Existing fixture result bytes and confidence semantics remain unchanged.",
  "evidence": [
    "Direct read-only probe against the first built implementation: decodeSnapshotIndex(new Array(1)) serialized as [null]; decodeRepoSurfaceProfile({architecture:new Array(1),commands:[]}) serialized with architecture [null] instead of refusing.",
    "test-review-stopped.txt and the stop receipt: the initial review gate stopped after 156.9 s, active [] and no check recorded; no passing claim is made from that run.",
    "The malformed-input regression now names $.snapshotIndex[0], $.profile.architecture[0], $.profile.commands[0], $.profile.architecture[0].directories[0] and $.options.inferences[0]."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The delivery composition needs typed, decodable plan inputs; silent missing entries can turn a named validation refusal into an unrelated runtime exception.",
    "traps": "Rule beating and drift to low performance favor field-path validation over an Array.isArray check that appears to validate skipped data. Policy resistance and shifting the burden favor one shared list fix across all five list boundaries. Commons and escalation favor stopping the stale review before editing and then one required run at the corrected subject. The other lenses retain D001's comparison; this adds no gate or authority.",
    "naiveInterventionism": "A one-line shared helper change preserves all dense fixture values, order, existing contracts and commands. The regression exercises the actual skipped-slot class.",
    "noOp": "Leaving a reproduced decode defect contradicts criterion 2's diagnostic boundary; a bounded fix within the existing module is warranted."
  },
  "rejected": [{ "option": "Defer this decode defect because the initial fixtures use JSON", "reason": "The exported decoder accepts JavaScript values and the small repair belongs to the order's existing field-validation deliverable." }],
  "reopenWhen": "A declared malformed input bypasses its indexed field refusal, dense fixture outputs change, or final-review integration changes the subject."
}
```

## WO-124-D010 — Preserve raw transcripts and normalize their whitespace

```json
{
  "id": "WO-124-D010",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: next; handoff diff review",
  "decision": "Preserve exact raw failure/stop transcripts in ignored local receipts, then remove only trailing spaces from their public text copies. Correct D008's reference to the preserved pre-sparse-fix document transcript. Check the complete diff against HEAD before handoff.",
  "misread": "The earlier plain git diff --check inspected unstaged changes and missed six trailing-whitespace lines already staged in two raw transcripts. D008 still named test-docs.txt for the older 41.42-second result after that path was reused for the final 39.62-second document run.",
  "meant": "The whitespace judgment covers both staged and unstaged changes. Historical failed/stopped evidence remains available, and each timing claim names the transcript that actually holds it.",
  "changed": "Saved both original files under docs/control/local/WO-124-transcripts, with raw and normalized SHA-256 values in normalization.json. Removed two trailing-space lines from compiler-tests-initial.txt and four from test-review-stopped.txt without changing any message, failure or exit result. D008 now cites test-docs-before-sparse-fix.txt for the older pass.",
  "evidence": [
    "git diff HEAD --check named compiler-tests-initial.txt lines 165/170 and test-review-stopped.txt lines 1745/1789/1931/1936; plain git diff --check returned zero at the same subject.",
    "Raw compiler transcript SHA-256 2d997a9853db8ecc8b16d87c0be9699fe4f5095472cf53f652870208a245ce4c; raw stopped review SHA-256 89b206d48727ba11eacc03973e0a25b142b5f0723136ddb3c4dd947a2b3254c1. The ignored receipt preserves exact bytes and the normalized copies preserve the observed outcomes.",
    "The review process had finished with exit 0 before these report-only edits; no gate input was changed during a live test."
  ],
  "rejected": [
    { "option": "Delete the failed/stop transcripts or suppress whitespace checking", "reason": "Would discard encountered evidence or weaken a declared criterion instead of repairing its text representation." },
    { "option": "Commit a second raw copy", "reason": "The local receipt preserves exact bytes while the public transcript retains the useful evidence without duplicating the corpus." }
  ],
  "reopenWhen": "The complete staged/unstaged diff contains whitespace errors, a normalized message differs beyond trailing spaces, or a historical result points at the wrong transcript."
}
```

## WO-124-D011 — Existing planning-register seams remain visible

```json
{
  "id": "WO-124-D011",
  "date": "2026-10-01",
  "dispatch": "resume: next; handoff register read",
  "decision": "Leave the eleven touching register rows on their existing planning routes and name the four consumer/contract rows in the handoff. WO-061 D011's activation/module-edit condition has occurred. Its whitespace-image admission, duplicate relations, inline-strike partition and revision-comment issues remain on FUP-2534f4dc631f5ebc; this order does not certify those cases. FUP-aa6dbe9c5ad79995 retains the follows-rule choice. FUP-57ecd19a26362b1c retains the derived-surface review-context consumer and failed-review composition duties. FUP-a8ff3066b5663629 retains the baseline class-source and waiver producer before WO-123. Record these limits rather than disposing any row as satisfied by the derivation fixtures.",
  "evidence": [
    "plan followups --touching --work-order WO-124 and its cursor continuation at revision c7f0f883b0f1d5cdbf8050a0132979466f9498161a1e874811d650b5ebd5d772 list eleven matches among 218 pending rows. The adjacent queue is empty at revision 0.",
    "New inputs selected through that register: docs/evidence/WO-061/decisions.md D010/D011, docs/evidence/WO-181/decisions.md D012 and docs/evidence/WO-180/decisions.md D013. Their existing IDs preserve the outstanding choices and consumer duties; no new follow-up is minted.",
    "WO-061 D011 explicitly routes the four cases to a planner for WO-124 or WO-062. The first three choose compilation/input semantics outside the derivation's fixture claim; the fourth corrects the revision comment. Invalidated IDs may reappear with a changed status or claimType, which this handoff states for consumers. The derivation reads active statements and does not use revision-ID freshness.",
    "WO-181 D012 asks for a review-context carrier when derived surfaces land and a failed-review fixture in WO-123. WO-124's declared primitive takes no review episode and carries no runtime context; packages/skeleton/src/review.ts is not edited here. The register's specific blocking-scope-finding condition was not observed by this executor.",
    "Seven other matches concern release collision hardening, usage pruning, protected historical operator wording, corrected-usage attribution, authority corpus deduplication, register matching and standing writer prose. Their named implementation scripts have no diff; the authority-copy percentage trigger is not measured by this order. No current operator-word advisory appeared in the passed docs-check."
  ],
  "reopens": {
    "decisionId": "WO-061-D011",
    "observation": "WO-124 has activated and extended story-contract.ts. The four compile/revision seams remain explicitly open on FUP-2534f4dc631f5ebc for planning and final-review disposition; they are not fulfilled by this derivation."
  },
  "goalAlignment": "Mission and critical path: the delivery composition now has the missing bounded surfaces/tests primitive, while the recorded compile and review consumers remain visible before real-artifact use. Policy resistance: do not silently change the twelve-class partition or the earlier admission contract. Drift to low performance and rule beating: a passing derivation fixture is not evidence that these other seams are fixed. Commons and escalation: the already observed shared gate does not justify adding an unplanned compile/review redesign or another evidence cycle. Success to the successful: preserve each existing finding rather than treating the new primitive as its resolution. Shifting the burden: name the current FUP identifiers and the activation observation in durable evidence. Seeking the wrong goal: judge the declared derivation, not the number of closed register rows. Naive Interventionism: keep the existing contract/review behavior; even the small revision-comment correction changes a registered source and remains on the explicit planning row, while this handoff supplies the correct consumer warning now. NoOp: leaving these seams only in transient tool output would lose the newly observed reopening condition.",
  "rejected": [
    { "option": "Treat all eleven textual matches as additional acceptance criteria", "reason": "The register is a pointer for judgment, not authority to rewrite the selected order. Its contract choices and downstream runtime carriers need their existing planning route." },
    { "option": "Mark the four named rows satisfied", "reason": "No fixture or implementation delivered here proves their separate compile, review-context, baseline or waiver duties." }
  ],
  "reopenWhen": "Planning assigns one of these duties to an amended order, a real input reaches a recorded compile seam, a review blocks a file within the same order's derived surfaces, or WO-123/WO-112 consumes the primitive."
}
```

## WO-124-D012 — Fixture-proven implementation handoff

```json
{
  "id": "WO-124-D012",
  "date": "2026-10-01",
  "dispatch": "resume: next; implementation handoff",
  "decision": "Judge all six declared criteria met against the fixture-bounded subject and prepare ImplementationReady with the current Codex session attestation. Keep application target v0.64.0, compiler 0.24.0 and skeleton 0.50.0 locally prepared. Select the revision 002 deterministic editions and feedback carry; preserve revision 001 and all encountered failure/stop evidence. Leave independent verification and final review to their separate dispatches.",
  "evidence": [
    "Final source code identity 8d517f6535939d36f5f60a93a2cdf9bfce66143440914f05ad06df25a69e2eb4. npm test -- --review: exit 0, 35 checks passed, zero failed, 80 fresh tasks, 446025 ms, recorded 2026-10-01T23:54:51.858Z. npm run test:docs: exit 0, 24 passed, zero failed, 24 fresh tasks, 39619 ms, recorded 2026-10-01T23:47:15.202Z. Both recorded rows bind that code identity; the new source/tests were staged before running them.",
    "compiler-tests.txt passes all 143 tests, including the five derivation tests and sparse-slot field diagnostics. fixture-derivations.json pins eleven cases and the unavailable-index result; fixtures-check.txt reproduces its 37302 bytes. snapshot-index-tests.txt reports every file, UTF-8 byte sizes and independently pinned SHA-256 values of a host-produced mount and refuses drift. verification-worktree.ts has no diff against HEAD.",
    "document-sizes.json records additions of 232 bytes in product 03 and 56 in product 06, within the 300/150 limits and current ceilings. Publication, release surfaces and the complete document checks pass.",
    "Current editions select WO-124 revision 002 for authority, artifact identity, verification and feedback; the final gates check each. The harness snapshot emission/check covers 32 installed generated surfaces and retains the historical four role/two writer observations without inventing a current live run. The feedback carry retains the earlier live audit without a new episode; the console pins follow it and only the four label-driven self-host fixture files change.",
    "The package-lock and manifest comparison contains only existing component versions and dependency pins; no dependency was added. Source, tests and the fixture generator were read; final authored reports and projections are reviewed at current bytes before recording the completion. Usage is observed separately into ignored receipts and the response, with unavailable counters reported unknown.",
    "Current-session readback from resume briefing: codex-cli 0.160.0, model gpt-6.1-sol, effort max, source codex-session-readback. One writer, no spawned agents; the adjacent queue has no remaining item."
  ],
  "goalAlignment": "Mission and critical path: the primitive supplies reproducible change surfaces and exact profile commands to WO-123/WO-118 without ambient effects. The eight trap comparisons in D001 still hold: decoding and provenance resist policy drift, fixture outputs test claims beyond green counts, uncovered requirements hand off, no gate or authority was added, and candidates remain visible. Naive Interventionism: verification host, portfolio and existing contract consumers keep their behavior; the snapshot reader delegates seal judgment to the existing host. NoOp would retain manual scope/check typing. Outcomes are limited to the pinned fixtures and sealed snapshot bound; no general language-understanding, live inference or downstream composition claim is made. Economy D002 remains kept-current with no measured benefit; failed/stopped preparation and the required full review's waiting time are retained rather than counted as savings.",
  "rejected": [
    { "option": "Claim the whole work order independently verified or published", "reason": "This is executor evidence; neither separate role has judged it and no publication was authorized." },
    { "option": "Re-run the full review solely to copy its results into reports", "reason": "Only report/index text changes after the passing code-identity row; completion runs the document gate inline at those final bytes." }
  ],
  "reopenWhen": "Independent verification finds a declared fixture/criterion mismatch, source code identity changes, a selected edition fails its check, or final-review integration changes the subject or release baseline."
}
```

## WO-124-D013

<!-- integration refs/dotln/checkpoint/WO-124/6 -->

```json
{
  "id": "WO-124-D013",
  "date": "2026-10-02",
  "dispatch": "resume: final review; worktree integrate WO-124",
  "decision": "Integrate main a3da7127 (WO-179 as v0.63.1) into the uncommitted WO-124 branch and carry VER-001's judgments forward on unchanged inputs. Resolve the four authored conflicts as bookkeeping: keep skeleton 0.50.0, WO-124's minor bump, which main's 0.49.2 patch does not collide with, and the console and lockfile pins of it; keep compiler 0.24.0. Re-mint authority evidence on the integrated source as WO-124 revision 003 and select it, because WO-179's role-text change stales both WO-179 revision 002 and WO-124 revision 002; keep artifact identity, verification and feedback on WO-124 revision 002, whose checks pass on the integrated tree. The target stays v0.64.0, the next minor above v0.63.1, under the unchanged minor classification.",
  "evidence": [
    "refs/dotln/checkpoint/WO-124/6",
    "base aa770898e00d7367255405fcc248fa119adc8037",
    "upstream a3da7127b0c52c110e3f48e34cbfe0e3cd1a2570",
    "release preparation: WO-124 target v0.64.0 remains current. Files changed: docs/evidence/WO-124/meta.json, docs/final-reviews/WO-124/PR.md. Meter snapshot: docs/evidence/WO-124/meta.json, 4031 bytes. Tag observation: local snapshot only.",
    "Conflicts: docs/evidence/current.json (main authority WO-179/002, this order WO-124/002), package-lock.json, packages/console/package.json and packages/skeleton/package.json (main skeleton 0.49.2, this order 0.50.0). Resolved to this order's side, then the authority selection moved to revision 003.",
    "authority-evidence.mjs --check on the integrated tree failed on WO-124/002 bundle-diff.json: the .agents and .claude role skill hashes changed (WO-179). --write --edition WO-124 --revision 003 exit 0 (authority-write-003.txt); --check exit 0 (authority-check-003.txt). Revisions 001 and 002 are byte-unchanged.",
    "artifact-identity-evidence.mjs, verification-evidence.mjs and feedback-evidence.mjs --check exit 0 on WO-124 revision 002; console-fixtures.mjs --check matches all five cases; node scripts/harness.mjs check exit 0 on 32 generated surfaces; npm run publication:check and npm run release -- check-surfaces --local exit 0.",
    "Carried-forward claims: git diff --cached refs/dotln/checkpoint/WO-124/2 (VER-001's subject) over packages/compiler/src, packages/compiler/test, packages/compiler/fixtures, both snapshot-index files, verification-worktree.ts, products 03 and 06, scripts/lib/evidence-sources.mjs and the fixture generator is empty, and main changed none of those paths between the two bases. On the integrated build the five WO-124 compiler tests, the snapshot test and fixtures.mjs --check (11 derivations, 37,302 bytes) pass."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Retime skeleton to 0.49.3 or keep main's 0.49.2",
      "reason": "WO-124 adds the readSnapshotIndex export, a compatible minor change; 0.50.0 is unused upstream, so no collision exists to retime."
    },
    {
      "option": "Select WO-179 authority revision 002 or keep WO-124 revision 002",
      "reason": "Neither reproduces on the integrated source; a new revision preserves both."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-02. Original base: `aa770898e00d7367255405fcc248fa119adc8037`.
Fetched main: `a3da7127b0c52c110e3f48e34cbfe0e3cd1a2570`. Checkpoint: `refs/dotln/checkpoint/WO-124/6`.
Named stash retained: `304f8a47e3ff0e92220197d91cef135ad748fd4b` (WO-124 integrate 2026-10-02).
Resolved projections: .claude/harness-manifest.json, .claude/hooks/commit-msg.mjs, .claude/hooks/concurrent-work-requires-worktrees.mjs, .claude/hooks/finish.mjs, .claude/hooks/no-attribution.mjs, .claude/hooks/no-lint-type-disables-as-fixes.mjs, .claude/hooks/permission-denied.mjs, .claude/hooks/permissions.mjs, .claude/hooks/presence-posttooluse.mjs, .claude/hooks/presence-pretooluse.mjs, .claude/hooks/presence-stop.mjs, .claude/hooks/presence-userpromptsubmit.mjs, .claude/hooks/read-observer.mjs, .claude/hooks/session.mjs, .claude/hooks/write-observer.mjs, README.md, docs/control/current.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: WO-124 target v0.64.0 remains current. Files changed: docs/evidence/WO-124/meta.json, docs/final-reviews/WO-124/PR.md. Meter snapshot: docs/evidence/WO-124/meta.json, 4031 bytes. Tag observation: local snapshot only.
Carried-forward claims: every criterion's inputs are byte-unchanged from VER-001's subject and main changed none of them; criteria 1–3 and 5 were rechecked on the integrated tree, and criterion 6's product gate ran again there ([FINAL-001](../../final-reviews/WO-124/FINAL-001.md)).
Authored conflicts observed: docs/evidence/current.json, package-lock.json, packages/console/package.json, packages/skeleton/package.json.
Affected checks: harness check, publication check and local release surfaces exit 0 on the integrated tree; the product gate result is in FINAL-001.

## WO-124-D014 — Final review passes and boards three derivation seams outside the fixtures

```json
{
  "id": "WO-124-D014",
  "date": "2026-10-02",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Pass WO-124 on all six criteria against the original order, on the integrated tree. Board, without failing the order, three behaviors that probes outside the declared fixtures reach. (1) With a caller threshold of 0, a contract whose requirements yield no surface returns DerivedSurfaces with empty surfaces and tests, not NeedsHuman. (2) A requirement covered only by a supplied inferred entry counts toward confidence, so an inference alone can clear the default gate (the order's union and coverage text admits this; the fixture 'inferred' case pins it). (3) The noun rule's boundary class excludes '-', so prose 'parser-other' matches the noun 'parser' and yields the src/parser files with an architecture origin. Dispose the two register rows whose condition this order met (FUP-2534f4dc631f5ebc, FUP-aa6dbe9c5ad79995) as deferred onto the next trigger, since WO-124 left compileStoryContract and revise unchanged and WO-062 does not edit the module. Leave every row this order only matched textually.",
  "evidence": [
    "docs/verifications/WO-124/VER-001.md (pass, no finding) and WO-124-D013 (integration, carried-forward claims).",
    "packages/compiler/src/story-contract.ts deriveSurfaces: the gate is 'confidence < threshold'; a caller threshold of 0 therefore never hands off on coverage. Probe on the integrated build: requirement 'Preserve an unknown subsystem.' with threshold 0 returns kind DerivedSurfaces, confidence 0, surfaces [], tests [], one unmapped-requirement candidate.",
    "add() records covered for every origin, including inferred. Probe: 'Cache records remain consistent.' with one inference for src/shared/cache.ts returns DerivedSurfaces at confidence 1 under the default threshold.",
    "SURFACE_RULE_PATTERNS.noun.boundary is [\\p{L}\\p{N}_]. Probe: 'The parser-other module changes.' returns DerivedSurfaces with src/parser/read.ts and src/parser/write.ts, each with origin rule/architecture, reference 'parser'.",
    "Further probes behaved conservatively and are observations only: a backticked command (`npm test`) and prose 'and/or' become not-in-snapshot candidates; './src/parser/read.ts' stays a candidate and hands off; a plural 'parsers' does not match the noun 'parser' and hands off.",
    "npm run plan -- followups --touching listed eleven rows. FUP-2534f4dc631f5ebc and FUP-aa6dbe9c5ad79995 name 'the next order that edits packages/compiler/src/story-contract.ts' and WO-124 edited it; docs/work-orders/WO-062-github-issue-source-adapter.md names no story-contract.ts edit. FUP-adf6621e7f958dd8's numeric condition did not occur: repeated authority.json blobs are 7,330,686 of 165,396,921 tracked docs/evidence bytes (4.43%, threshold 10%) with this order's three revisions staged."
  ],
  "followup": "Planner, before WO-123 activates (the first composition that turns deriveSurfaces output into a derived order): (1) decide whether a DerivedSurfaces result with no surfaces may become an order, or whether deriveSurfaces refuses a threshold of 0 or the composition treats an empty surface set as NeedsHuman; (2) decide whether a requirement covered only by an inferred entry counts toward the confidence gate, as it does now, or is shown to the operator as a candidate until a rule covers it; (3) decide whether the noun rule treats '-' as a word character, so 'parser-other' prose no longer matches the noun 'parser', and pin a fixture for the chosen reading. Priority: medium for 1 and 2 before WO-123 composes over a real issue; low for 3.",
  "goalAlignment": "Mission and critical path: the independently verified source-to-deliverable loop needs an order's surfaces and tests derived from its contract rather than typed by the operator; WO-124 supplies that pure, labeled primitive to WO-123 and WO-118. Policy resistance and drift to low performance: the default threshold of 1 keeps the hand-off standard, but a caller threshold of 0 and inferred-only coverage are the two places a throughput-minded consumer could pass the gate without rule evidence, so both are boarded for WO-123 rather than left to its executor. Rule beating: the fixtures pin exact outputs, so the evidence cannot pass without the behavior; the noun-boundary false positive is a way a wrong surface carries a correct-looking rule origin, boarded as item 3. Commons: the function is pure; the review cost is one integrated product gate and one authority re-mint, and repeated authority copies stay at 4.43% of evidence bytes. Escalation: no gate or process is added. Success to the successful: WO-073's profile document and the cartographer episode stay open alternatives with recorded reopen conditions. Shifting the burden: NeedsHuman deliberately hands uncovered requirements back to the operator for the first runs (operator-review assumption 1); its rate is unobserved until WO-123 runs. Seeking the wrong goal: the value is unobserved until a real issue composes through it. Naive Interventionism: verification-worktree.ts, compileStoryContract, revise and the portfolio derivation are unchanged; no consumer exists yet; the exports are additive and reversible under a minor bump; the smallest probe was the fixtures plus this review's probes. NoOp: surfaces and tests stay hand-typed and WO-123 stays blocked; passing wins because every declared criterion holds and the seams are consumer decisions with a named route.",
  "rejected": [
    { "option": "Fail the order on the threshold-0 or inferred-coverage behavior", "reason": "Both follow the order's literal Design (the caller passes the threshold; the union includes inferred entries) and lie outside the declared fixtures, which criterion 1 names as a follow-up, not a failure." },
    { "option": "Change the noun boundary or refuse threshold 0 in this review", "reason": "Either is a behavioral change to the derivation; a reviewer never writes a behavioral fix and certifies it, and the choice belongs to the consumer's planning." },
    { "option": "Allocate FUP-2534f4dc631f5ebc and FUP-aa6dbe9c5ad79995 to WO-062", "reason": "WO-062 does not edit story-contract.ts, and allocation would claim coverage no order has." }
  ],
  "reopenWhen": "WO-123's first composed run derives an empty or inferred-only surface set, a rule-origin surface is wrong on a real issue, or a check on the integrated tree fails before merge."
}
```

## WO-124-D015 — Final review removes the operator's home path from two public transcripts

```json
{
  "id": "WO-124-D015",
  "date": "2026-10-02",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "correction",
  "decision": "Replace the operator's absolute worktree prefix with '<worktree>/' in this order's two public transcript copies, changing no other byte, and keep the raw copies in the ignored local control lane, as D010 did for trailing spaces. Nominate, without editing, the older tracked records that hold the same absolute home path, because many are immutable verification and final-review reports and a sweep needs a planning decision.",
  "misread": "D010 normalized the two public transcript copies for trailing spaces only and treated them as publishable; no earlier record of this order screened them for the absolute home path that Node prints in stack and interrupt lines.",
  "meant": "Committed evidence keeps every test name, status and line number but carries no private absolute path; the raw bytes stay available locally.",
  "changed": "Saved the pre-change copies as docs/control/local/final-review/WO-124-compiler-tests-initial.raw.txt (SHA-256 91023fa5793670bc2f5eea8fc383a1a2d8e2807f41005a8f46d19418a31f830b) and WO-124-test-review-stopped.raw.txt (e0975f418ea71a3499f1a1174e6e28e84a61b838536956157d10e3f85db4ed1a). The public copies now hash fab276175d56028fa59c0d60f2967af723d0719257e669e45ae1b16949665cca and e2bea9fc6ecf6ac1aa2bc517b9e28bb936d25d1372f3c8cb0f16d7d888686e95.",
  "evidence": [
    "The final review's clean-room screen of the staged diff against main matched one stack line in docs/evidence/WO-124/compiler-tests-initial.txt and 21 interrupt lines in docs/evidence/WO-124/test-review-stopped.txt carrying the absolute worktree path under the operator's home directory. After the replacement, both files hold no home, private-var or temporary-folder path; the diff is 22 changed lines.",
    "Both transcripts are failure or stop evidence that D003, D009 and D010 cite; the replacement leaves every test name, status and line number intact. Both are under docs/, outside the gate's code identity, and were changed after the passing integrated product gate.",
    "A grep over tracked documentation finds 78 other files with an absolute home path, including docs/final-reviews/WO-042/FINAL-001.md and docs/verifications/WO-162/VER-001.md; no clean-room rule or check refuses one today."
  ],
  "followup": "Planner, low priority, one pass over the corpus policy: decide whether committed records may carry the operator's absolute home path. If not, decide how immutable VER and FINAL reports are treated (left as historical, or corrected through the off-ramp that corrects a filed record), whether evidence transcripts are normalized to a '<worktree>/' placeholder when they are written, and whether the document gate screens new records for such paths. 78 tracked documents held one on 2026-10-02.",
  "rejected": [
    { "option": "Leave the two transcripts as they are, as older records do", "reason": "They are this order's own unpublished evidence, the change is a byte-local substitution, and the operator's standing rule excludes private identifiers." },
    { "option": "Normalize the 78 older records in this review", "reason": "That widens the order beyond its own surfaces and would edit immutable reports." }
  ],
  "reopenWhen": "A planning pass chooses a policy for absolute home paths in committed records, or a new record adds one."
}
```
