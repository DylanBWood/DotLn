# WO-227 decisions

## WO-227-D001

```json
{
  "id": "WO-227-D001",
  "date": "2026-10-22",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.91.0, the next minor above the observed release baseline v0.90.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.90.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-227-outward-publication-as-intended.md"
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

## WO-227-D002

```json
{
  "id": "WO-227-D002",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "The public vocabulary's list is `reviewTerms`, an array of words that may be empty, read from the older `terms` key as the same list for one kit release with an advisory naming the new key, and refused when both keys are present. A listed word in outward text is a `vocabulary.review` finding and a `review` status that refuses nothing; the launchpad identifier forms (WO-NNN, WO-NNN-DNNN, FUP-<16 hex>, VER-NNN, FINAL-NNN, REVIEW-NNN, WS-NNN) are refused as whole tokens under `identifier.launchpad` when the caller marks the artifact a target's, on the written and the rendered view like the runtime forms; a caller may label the composed body's parts and exempt a rule inside a part the kit itself writes.",
  "evidence": [
    "The operator's two corrections of 2026-10-21, captured in the planning dispatch's sibling file (SHA-256 7297fbcfdde9fd159807018342365041b26d660355d8aa4dd1a95b86932215a2 at the nineteenth message; planning document §1 and §6.1).",
    "README.md baseline: the fixture target body met vocabulary.launchpad (line 9), vocabulary.launchpad (line 11) with no section, and every identifier form passed.",
    "scripts/test-outward-lint.mjs: WO-227 criterion 1 (a case per form and kind, each paired with the launchpad-artifact control) and the two criterion 2 cases."
  ],
  "rejected": [
    { "option": "Keep vocabulary.launchpad as a refusal", "reason": "The operator's correction: a word is not a leak; the fork's instance met the ban on its own fixture path and its target's subject matter." },
    { "option": "Rename the key silently", "reason": "Kit actions cannot migrate a JSON key (scripts/launchpad.mjs readKitActions), so every instance's publish would refuse until its operator edited the file." },
    { "option": "A hyphen as a word boundary for the identifier forms", "reason": "docs/wo-006-notes.md and fix/handle-wo-006 carry the identifier; a letter, digit or underscore on either side still makes another word." }
  ],
  "reopenWhen": "An instance mints other identifier shapes (WO-193's route names them) or the alias period ends and `terms` is to refuse."
}
```

## WO-227-D003

```json
{
  "id": "WO-227-D003",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "A private list line is `[refuse: | review: ]term`: `refuse:` keeps today's refusal, an unmarked or `review:` line is a review item of a target publication, a term listed twice keeps the stricter mode, a marker naming no mode or a line with no term refuses naming the line, and a present list with no terms is present with a count of zero. checkLocalTerms keeps throwing on any match for its committed-text consumers (planning receipts, follow-ups, entropy review, harness check, kit export, target records, the terms CLI), with the mode in each redacted finding; only the outward adapter turns review-mode matches into a `review` observation.",
  "evidence": [
    "The operator's second correction (the sibling capture above): a private term that is an ordinary word is refused as the system's name, judged in context by the reviewer, which committed text has no step for.",
    "grep of checkLocalTerms consumers: scripts/launchpad.mjs, adjacent-work.mjs, planning-followups.mjs, entropy-review.mjs, harness.mjs, plan-receipts.mjs, target-records.mjs, terms.mjs; none has a confirmation route.",
    "node scripts/terms.mjs check docs/README.md printed `local-terms list: present` against the operator's real list after the change (status only).",
    "scripts/test-outward-lint.mjs: the two WO-227 criterion 3 cases; scripts/test-plan-refutation.mjs AC3 (findings carry mode: review)."
  ],
  "rejected": [
    { "option": "Refuse by default and mark review terms", "reason": "The correction says the ordinary-word case is the common one." },
    { "option": "Admit review-mode matches in committed text", "reason": "The clean-room floor: a private term in committed docs or kit surfaces has no reader confirming it, and this order's scope is outward publication." }
  ],
  "reopenWhen": "An operator wants review-mode terms admitted in committed text under a recorded confirmation; then the consumers gain the adapter's reading in a reviewed change."
}
```

## WO-227-D004

```json
{
  "id": "WO-227-D004",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "The published body is composed by composeTargetBody with the offsets of the reviewed prose, the Change table and the target checks and one row per changed file; lintArtifacts lints every artifact as a target's, labels each finding with its part and, in a Change row, its path, drops the findings of a row whose path the target's base already held (git ls-tree at the base) or which the kit's records commit wrote (targetRecordSources), and refuses review items until --confirm-terms names the composed body's SHA-256. The draft route records DraftPrepared before the lint so a refusal and its confirmation meet the same prepared commit and the printed digest holds.",
  "evidence": [
    "README.md baseline: the refusal named generated rows by line with nothing saying they were generated.",
    "The smoke of the reviewed publish before the kit-row exemption refused the records commit's own paths (docs/work-orders/WO-999-fixture.md and the moved reports), which WO-221 places under the order's paths by design.",
    "git commit-tree stamps the current time, so without the recorded preparation each retry composed a different head and a different digest.",
    "scripts/test-target-worktree-publish.mjs WO-227 criteria 2 and 4; scripts/test-github-body.mjs WO-227 criterion 4; scripts/test-target-publish.mjs WO-227 criterion 2."
  ],
  "rejected": [
    { "option": "Exempt the generated sections entirely", "reason": "An added docs/WO-006-notes.md in a target is a leak the identifier rule must catch." },
    { "option": "A bare --yes or an environment variable", "reason": "It confirms nothing in particular; the digest names the body the reviewer read." },
    { "option": "A fixed commit date for the draft commit", "reason": "A visibly wrong timestamp on the target's draft; the recorded preparation already exists for retries." }
  ],
  "reopenWhen": "The records binding changes where the kit's records land in the target, or a target publication composes a part this list does not name."
}
```

## WO-227-D005

```json
{
  "id": "WO-227-D005",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "A confirmed review is recorded on the publication event (PullRequestOpened, DraftPrepared's successor) as { confirmedDigest, matches, attestation, recordedAt, journal } and appended as a typed row (ReviewTermsConfirmed) to the running session's harness journal when a session variable names a journal the hooks opened; otherwise the row is `unobserved`. The attestation is what the session reports of itself: the harness its session variable names, Claude Code's selected effort when exported, the role its journal recorded, and `unknown` elsewhere; the publish command takes no new actor flags.",
  "evidence": [
    "scripts/lib/off-ramps.mjs SESSION_VARIABLES and the journal keyed by the session id's SHA-256; packages/skeleton/src/harness-host.ts record() for the row shape; meta.mjs and observed-facts.ts read rows by typedEvent and eventId, so an added typed row is tolerated.",
    "scripts/lib/harness-runtime.mjs claudeSessionReport: selected, not effective, effort.",
    "The publish fixtures record attestation keys effort, harness, model, role, source and journal recorded|unobserved."
  ],
  "rejected": [
    { "option": "Five actor flags on worktree publish", "reason": "The step names one flag; the session readback is the attestation other commands derive from the same variables, and unsupplied values stay unknown rather than invented." },
    { "option": "A new control event in the order's segment", "reason": "The control fold has a closed schema; the publication log is the record the order names." }
  ],
  "reopenWhen": "The journal gains a writer the scripts can call, or the operator wants the confirming actor attested by flags."
}
```

## WO-227-D006

```json
{
  "id": "WO-227-D006",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "checkPlanGate returns `advisories`: for each Active or Open order with a **Repository:** declaration, each backticked token of the **Execution plan …:** field that reads as a path (a directory or an extension, no space) and carries a review word of the launchpad's vocabulary or a launchpad identifier is named once; a launchpad order's paths are its own; nothing refuses.",
  "evidence": [
    "scripts/lib/handoff-ledger.mjs readPreflightSuites, the extractor's model; scripts/lib/work-order-repository.mjs parseRepositoryDeclaration.",
    "scripts/test-plan-refutation.mjs WO-227 criterion 5: two advisories for the target order, none for the launchpad order with the same plan."
  ],
  "rejected": [
    { "option": "Scan closed orders too", "reason": "Their plans are history and the advisory serves the author before a draft publish." },
    { "option": "Every backticked token", "reason": "Function names and commands in backticks are not paths and would name false review items." }
  ],
  "reopenWhen": "An order names its paths outside backticks or the Execution plan field changes its label."
}
```

## WO-227-D007

```json
{
  "id": "WO-227-D007",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "release prepare and regeneratedPullRequestBody lift an existing meter block from wherever it stood and append it after the last prose paragraph, collapsing the blank lines around its old place to one and changing no other byte. pullRequestBodyShapeFailures judges a stored body's structure only (first non-blank line a level-one heading; a prose line before the meter block; the meter block last, the published body admitting the product-gate block after it); worktree publish applies it to the current order's stored and published body and check-surfaces to the current order's PR.md, so no historical body is judged.",
  "evidence": [
    "README.md baseline: #223 (WO-221) prose first with the block at line 11; #225, #227, #230, #231 (WO-222, WO-218, WO-223, WO-217) block at line 3 before the prose.",
    "docs/publication/examples/README.md: no command refuses text for its style.",
    "scripts/test-github-body.mjs WO-227 criterion 6; scripts/test-release.sh release_case_meter_shape."
  ],
  "rejected": [
    { "option": "A seeded template with placeholders", "reason": "The meter never manufactures review prose (scripts/release.mjs)." },
    { "option": "A rule on bold lead-ins or paragraph counts", "reason": "Style; the shape is structural." }
  ],
  "reopenWhen": "The stored body gains another generated block whose place the shape must name."
}
```

## WO-227-D008

```json
{
  "id": "WO-227-D008",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "A target order's header `**Target release notes:** reviewed | objective` names the Release body source (objective when absent). Under `reviewed` the body is the order's RELEASE-NOTES.md at the merged revision rendered as the five sections, the order title once under the overview, a link to a record the kit moved into the target written absolute to the target at the tagged commit, any other relative link written as its text, and the close line last; absent or invalid notes refuse before any tag push. The tag message and the body pass the outward lint as a target's text with the kit's frame (the order title, the close line, the record links) exempt from the identifier rule and the record links from the review-word rule, and the registered display name blanked for the word checks. The body's source and SHA-256 are bound in publication.target.body with the confirmation; a recorded confirmation of the same digest stands on retry, changed bytes refuse, and ensureRelease admits the legacy body beside the reviewed one so a Release published before the header stays current.",
  "evidence": [
    "docs/evidence/WO-221/decisions.md D006 and its reopening condition, fired by the fork's 2026-10-21 request.",
    "README.md baseline: the fixture Release body and tag message; neither passed through any lint.",
    "The smoke before the frame exemption refused the legacy body's own title line and the record links the renderer wrote (WO-999 in docs/evidence/WO-999/decisions.md), which the byte-for-byte legacy body and WO-221's records placement make unavoidable.",
    "scripts/test-target-worktree-release.mjs: the two WO-227 criterion 7 cases and the WO-221 case's byte-for-byte legacy body."
  ],
  "rejected": [
    { "option": "Apply the identifier rule to the Release frame", "reason": "The legacy body must stay byte for byte and the close line names the closing order by D006's design; the reviewed text is still judged." },
    { "option": "Move RELEASE-NOTES.md into the target as a bound record", "reason": "The records binding's shape, and every target order would carry notes it does not publish." },
    { "option": "Edit a published Release", "reason": "Product 07's immutability rule; DotLn-Angular v0.1.0 keeps its body." },
    { "option": "Write the moved records' links as relative target paths", "reason": "A Release page has no base path; the absolute link at the tagged commit resolves, as the launchpad edition's links do." }
  ],
  "reopenWhen": "An operator wants the Release frame free of the order identifier, or the records binding renames the moved records; then the frame changes in a reviewed order and admittedBodies keeps the earlier Releases current."
}
```

## WO-227-D009

```json
{
  "id": "WO-227-D009",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Each new case is paired with a control that fails at the base with only its change reverted, run by a scratch runner that swaps one source file for its HEAD bytes, runs the focused case under the bounded wrapper and restores the file; both arms' exit codes are recorded in controls.json beside the suite and case names.",
  "evidence": ["docs/evidence/WO-227/controls.json"],
  "rejected": [
    { "option": "Describe the controls in prose only", "reason": "The order asks for both arms' exit codes." }
  ],
  "reopenWhen": "A case's source moves so the swapped file no longer carries its change."
}
```

## WO-227-D010

```json
{
  "id": "WO-227-D010",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "The kit README's §First steps step 4 states the per-term marker, the empty lists, the three checks, the confirmation flag and the reviewTerms key with its alias; docs/README.md names the vocabulary file's list as review words.",
  "evidence": ["scripts/kit/README.client.md step 4; docs/README.md docs/control entry."],
  "rejected": [
    { "option": "A separate kit page for the lint", "reason": "Step 4 is where the instance registers both lists." }
  ],
  "reopenWhen": "The alias period for the `terms` key ends."
}
```

## WO-227-D011

```json
{
  "id": "WO-227-D011",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "No evidence re-mint and no live feedback episode: none of the files this order edits is in FEEDBACK_SOURCE_PATHS or in scripts/lib/evidence-sources.mjs, and docs/evidence/current.json keeps WO-226's editions.",
  "evidence": [
    "grep of scripts/lib/evidence-sources.mjs: packages/compiler, packages/kernel, packages/skeleton sources, scripts/lib/host-resources.mjs and the scheduling baseline; this order edits scripts/lib/outward-lint.mjs, terms.mjs, target-publish.mjs, github-body.mjs, plan-receipts.mjs, target-commit-lint.mjs, release-notes.mjs, github-repository.mjs, scripts/outward-lint.mjs, scripts/release.mjs, scripts/worktree.mjs and tests.",
    "npm test -- --only evidence-sources within the complete run."
  ],
  "rejected": [
    { "option": "Re-mint the editions anyway", "reason": "Nothing they derive from changed." }
  ],
  "reopenWhen": "A later step edits a registered evidence source."
}
```

## WO-227-D012

```json
{
  "id": "WO-227-D012",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Product 08 §PRs and commits states the stored body's shape and the review semantics of the three checks and notes that the balanced example predates the meter block; §Release-note edition names the target header. Product 07 §Workflow closeout and releases names the header, the lint and the bound digest, and the Outward artifacts bullet reads as the mechanism now works. Both stay under their ceilings.",
  "evidence": [
    "docs/control/doc-ceilings.json: 07-execution-guide.md ceiling 264,473 and 08-publication-compiler.md ceiling 27,354; the sizes after the edits are recorded in handoff.md.",
    "npm run publication:check and npm run test:docs after the edits."
  ],
  "rejected": [
    { "option": "A dated paragraph per correction", "reason": "Write-backs are in place; the planning document and the sibling capture keep the history." }
  ],
  "reopenWhen": "A document gate ceiling or the ratchet rule changes what the sections may say."
}
```

## WO-227-D013

```json
{
  "id": "WO-227-D013",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Three adjacent repairs landed with the change rather than being boarded. The plan refutation receipt and the entropy review receipt store the local list's observation as { status } alone, because the receipt validator admits exactly that key and the term count is the checker's own observation, never a committed record's field. The release composition fixture's stored pull-request body gained its level-one heading, since the shape rule now judges the current order's stored body at check-surfaces. The reviewed-notes close compares the bound digest before the review question, so a retry with changed notes names the changed bytes rather than asking for a new confirmation.",
  "evidence": [
    "scripts/test-plan-refutation.mjs AC3 failed with `local-terms presence missing` from scripts/lib/plan-receipts.mjs validateReceipt once checkLocalTerms returned a term count; scripts/lib/entropy-review.mjs embeds the same observation into its receipt.",
    "release_case_composed_evidence failed at check-surfaces on docs/final-reviews/WO-099/PR.md:1 (heading-first) with the fixture body written by scripts/test-release-composition.mjs.",
    "The reviewed-notes fixture's changed-notes retry met the review refusal before the bound-digest refusal until the comparison moved ahead of the lint."
  ],
  "rejected": [
    { "option": "Record the term count in the receipts", "reason": "A receipt schema change for a value no reader uses, and the count describes the private list." },
    { "option": "Exempt fixture bodies from the shape rule", "reason": "The rule judges the current order's stored body wherever it stands; the fixture is a stored body." }
  ],
  "reopenWhen": "A receipt reader wants the term count, or a fixture needs a stored body without a heading."
}
```

## WO-227-D014

```json
{
  "id": "WO-227-D014",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "The two independent reviews (dotln-worker-fable, claude-fable-5-1 at xhigh by launch selection, effective effort not read back) found twelve design and twelve adversarial items. Fixed: the display-name exemption no longer masks the private list, so a refuse-mode term that contains the name is still refused, and it drops public review words by containment only; the identifier forms take exactly three digits; only the two mode words before a colon are markers, so an existing list whose terms hold colons keeps every term; the bound-digest refusal holds an attempt that pushed the tag and still owes the Release, while a completed Release is rechecked by its recorded digest and stays current under a later header; the meter move trims only newlines; the composed body's Change rows are offsets found from the rendered row text, not line arithmetic, and sections resolve to the narrowest part; one confirm-terms parser validates the flag's value for both commands; the records commit message is linted as a target's and admits a review word; vocabulary advisories print before a refusal; the shared helpers (labelled parts, the meter move, the session key and harness name, the digest) have one owner each; the frame constant and the launchpad-identifier check are named for what they hold; comment tags that only repeated the order number are gone. Recorded, not changed: a review word in a commit or title is confirmed under the composed body's digest, as the order words it; a zero-width character inside an identifier in a commit subject or title is not seen, the same gap the runtime forms have, since only bodies get the rendered view; a three-digit form followed by a hyphenated continuation (final-100-percent) is read as the launchpad form, which the order accepts for the launchpad's own shapes.",
  "evidence": [
    "The reviews' reports in this session; each fixed item has a case in the suites the controls record names.",
    "scripts/test-outward-lint.mjs: the display-name and private-term case, the colon-term parse case, the review-2026 and ws-2024 controls.",
    "scripts/test-target-worktree-release.mjs: the completed legacy Release stays current under the reviewed header without a record edit; a partially published attempt refuses changed notes on its bound digest."
  ],
  "rejected": [
    { "option": "Keep masking the display name for the private list", "reason": "A private term that contains the name slipped through the blank (the review's probe)." },
    { "option": "Treat any word before a colon as a marker", "reason": "Every consumer of the list would refuse an existing term that holds a colon after the kit update." },
    { "option": "Hold a completed Release to the bound digest", "reason": "A published Release is immutable; a later header or edited notes cannot republish it, and the recheck is what the order asks for." }
  ],
  "reopenWhen": "A harness exposes a rendered view of commit subjects, or an instance meets a hyphen-continued name the three-digit forms over-match."
}
```

## WO-227-D015

```json
{
  "id": "WO-227-D015",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "The complete run's failures were fixtures that predated this order's checks, and each was brought to the new rule rather than the rule loosened: pull-request bodies in the worktree shell cases, the launchpad planning and recovery cases and the release composition case gained the level-one heading the shape check requires; the release case inventory and the target-worktree case counts name the added cases; the export's local-terms case, which expected a present empty list to refuse, now expects the export to proceed and print `present`, and gains the malformed-marker case (`refuse:` with no term) refusing by line before any write, as criterion 3 words both.",
  "evidence": [
    "The second and third complete-run rows failed in worktree, runner-fixtures, launchpad-planning and launchpad only; the focused reruns of those suites pass (session journal rows of 2026-10-22).",
    "scripts/test-launchpad-export.mjs: WO-074 criterion 3 case, empty and malformed lists.",
    "scripts/test-runner.test.mjs and scripts/fixtures/target-worktree-cases.json: 58 declarations, 82 names."
  ],
  "rejected": [
    {
      "option": "Admit a body without a heading when it is a fixture's",
      "reason": "The shape check judges the current order's stored body for every instance; a fixture carve-out would leave the rule untested at the shape the kit writes."
    },
    {
      "option": "Keep refusing a present empty private list in the export",
      "reason": "Criterion 3 and the Lists-may-be-empty requirement admit it with a count of zero; the export is one consumer of the same check."
    }
  ],
  "reopenWhen": "A fixture needs a body the shape check refuses for a reason the order did not foresee."
}
```

## WO-227-D016

```json
{
  "id": "WO-227-D016",
  "date": "2026-10-22",
  "dispatch": "resume: next",
  "decision": "Two deferred follow-up rows match this change by text only and are left as they are: FUP-369525016cc270e1 (control and release inputs the product gate copies but its identity excludes) names docs/control/outward-vocabulary.json, whose key this order renames without touching how the gate identifies it; FUP-8111fc3dd4c22331 (the dated log in the documentation map) names docs/README.md, where this order changes two lines of the vocabulary file's description and adds nothing to the dated log. Neither row's seam is opened and neither condition occurred, so neither is fixed or disposed here.",
  "evidence": [
    "npm run plan -- followups --touching at handoff: two rows, both status deferred, matched by file name.",
    "git diff main -- docs/README.md docs/control/outward-vocabulary.json: the reviewTerms key and the two description lines only."
  ],
  "rejected": [
    {
      "option": "Dispose either row in this order",
      "reason": "Disposal belongs to the final review when a seam opens or a condition occurs; a textual match is neither, and widening the order is refused."
    }
  ],
  "reopenWhen": "Either row's own reopen condition occurs."
}
```

## WO-227-D017 — Verification routes three reproduced defects to repair

```json
{
  "id": "WO-227-D017",
  "date": "2026-10-22",
  "dispatch": "resume: verify",
  "decision": "VER-001 fails criteria 3, 6 and 7. F1: lintArtifacts appends the raw generated path to private-term diagnostics, exposing a synthetic refuse-mode or review-mode term in src/cobaltwidget.ts. F2: pullRequestBodyShapeFailures treats any nonempty non-heading line as prose, so an HTML comment, empty code fence, thematic break or table alone satisfies prose-before-meter. F3: a completed reviewed Release recheck after edited notes succeeds but replaces the recorded body digest with the unpublished candidate's digest; a second identical recheck then refuses the unchanged Release. These are reproduced failures of the declared redaction, prose and bound-body contracts, not a request to change the review-word policy. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/verifications/WO-227/VER-001.md findings F1 to F3",
    "docs/evidence/WO-227/verification-001-evidence.json: matrix F1 and F2, releaseRecheck",
    "docs/evidence/WO-227/verification-001-probes.mjs",
    "docs/evidence/WO-227/verification-001-release.mjs",
    "The three original WO-227 target publication and release fixture cases still pass; the independent repeated-recheck case exits 1."
  ],
  "rejected": [
    {
      "option": "NoOp: pass from the complete review row alone",
      "reason": "The passing row does not cover the independently reproduced counterexamples."
    },
    {
      "option": "Patch the implementation during verification",
      "reason": "The read-only verifier must preserve the subject and send criterion failures through repair."
    }
  ],
  "followup": "WO-227 repair: preserve private-term redaction when a finding names a generated path, recognize a real prose paragraph before the meter, and retain the digest of the body actually published across repeated Release rechecks. Add a new variation for each class, including a private review-mode path and more than one completed-release retry.",
  "reopenWhen": "A repair supplies executable counterexamples that now satisfy all three rules, followed by independent re-verification at the repaired code identity."
}
```

## WO-227-D018 — Board the domain-model write-back gap

```json
{
  "id": "WO-227-D018",
  "date": "2026-10-22",
  "dispatch": "resume: verify",
  "decision": "Keep criterion 8 met on its named write-back surfaces, and board the planning carry-in about product 02. Its Harness compiler v1 paragraph still says a present private exclusion list must pass and does not explain review-mode publication confirmation or a present empty list. The named product 07, product 08, kit README and docs map updates are present; product 02 is outside that criterion's named write-backs.",
  "evidence": [
    "docs/product/02-domain-model.md, Harness compiler v1, private exclusion list paragraph",
    "The verify dispatch's planning receipt 052 carry-in for criterion 8",
    "docs/product/07-execution-guide.md Outward artifacts and docs/evidence/WO-227/verification-001-evidence.json empty-list and confirmation probes"
  ],
  "rejected": [
    {
      "option": "Fail criterion 8 or edit product 02 as verifier",
      "reason": "The declared write-backs are present; this remaining documentation gap needs its own recorded follow-up, not a widened criterion or an implementation edit by its judge."
    }
  ],
  "followup": "Planner or next authorized product-document writer: reconcile product 02's private exclusion list paragraph with the publication review/refuse modes and present-empty behavior while preserving the locked clean-room floor and committed-text refusal.",
  "reopenWhen": "Product 02 is next edited for the private-list contract, or an operator needs that paragraph to explain publication confirmation."
}
```

## WO-227-D019 — Retain the identifier normalization limitation as a follow-up

```json
{
  "id": "WO-227-D019",
  "date": "2026-10-22",
  "dispatch": "resume: verify",
  "decision": "Reproduce the executor adversary's zero-width-character limitation and record its actual boundary: inserting U+200B between the hyphen and digits of WO-006 produces no identifier finding in a commit subject, pull-request title or pull-request body. The body result broadens the earlier report's subject/title observation. Criterion 1's seven literal forms, repeated forms, compatibility-width spellings and rendered HTML-split body controls pass; the invisible-character variant is a nonblocking normalization follow-up.",
  "evidence": [
    "docs/evidence/WO-227/self-review.md adversary item 7 and WO-227-D014",
    "docs/evidence/WO-227/verification-001-workers.mjs",
    "docs/evidence/WO-227/verification-001-evidence.json workerReproductions: adversary 7"
  ],
  "rejected": [
    {
      "option": "Claim that the rendered body view catches this character",
      "reason": "The independent body probe returned no finding."
    },
    {
      "option": "Expand criterion 1 to every visually similar spelling",
      "reason": "It declares seven exact identifier forms; the literal controls hold and this normalization behavior has no separately demonstrated main regression."
    }
  ],
  "followup": "Next outward-identifier normalization work: decide and test handling of invisible format characters consistently across subjects, titles and rendered bodies, using the U+200B probe without discarding original source offsets.",
  "reopenWhen": "The identifier normalizer is revised or an instance encounters an invisible-character identifier in an outward artifact."
}
```

## WO-227-D020 — Keep every diagnostic on a private-term row redacted

```json
{
  "id": "WO-227-D020",
  "date": "2026-10-22",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1 in lintArtifacts: the private check's line spans suppress raw path attribution and quoted matched text for every overlapping finding, including a public review word or launchpad identifier on the same generated row. Keep the artifact, rule, line, section and private mode. Unrelated rows retain their path attribution; confirmation semantics and existing-path exemptions stay unchanged. Product 07 and the kit README state the redaction boundary.",
  "evidence": [
    "docs/verifications/WO-227/VER-001.md F1; docs/evidence/WO-227/verification-001-probes.mjs",
    "scripts/lib/target-publish.mjs lintArtifacts previously attached row.path to every finding and printed it after the redacted private mode.",
    "scripts/test-target-publish.mjs adds 27 combinations of explicit refuse, explicit review and unmarked review, overlapping public/identifier findings, and three prose line endings; preview and confirmation controls keep clean-row attribution."
  ],
  "rejected": [
    { "option": "Hide the path only on vocabulary.local", "reason": "Another finding on the same row would still quote the path or the private word when it is also a public review word." },
    { "option": "NoOp", "reason": "The reported refusal and review prompt disclose private text." }
  ],
  "reopenWhen": "The local checker exposes a different redacted span contract or another diagnostic surface quotes private source text."
}
```

## WO-227-D021 — Judge prose with the existing Markdown tree

```json
{
  "id": "WO-227-D021",
  "date": "2026-10-22",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F2 by reusing github-body.mjs's installed Markdown parser. A paragraph with text or inline code supplies prose, including paragraphs in lists and quotations; comments, headings, tables, code blocks, definitions and images alone do not. Preserve the heading-first, meter-last, published product-gate allowance and no-meter behavior. Count LF, CRLF and CR consistently. Product 08 defines this structural reading without an editorial test.",
  "evidence": [
    "docs/verifications/WO-227/VER-001.md F2; the old some(nonempty and not heading) predicate accepts every reported non-prose block.",
    "scripts/lib/github-body.mjs parsedNodes already uses the installed Markdown parser for publication link semantics.",
    "scripts/test-github-body.mjs adds twelve non-prose shapes over three line endings plus ordinary, formatted, list-item and quoted prose controls."
  ],
  "rejected": [
    { "option": "Extend the line blacklist or add a new parser dependency", "reason": "Line heuristics misread multiline Markdown; the established parser already supplies paragraph structure without a dependency change." },
    { "option": "NoOp", "reason": "Hidden comments and code continue to satisfy a required prose paragraph." }
  ],
  "reopenWhen": "A supported Markdown paragraph is rejected or a non-prose block satisfies the check."
}
```

## WO-227-D022 — Bind rechecks to the body the forge actually holds

```json
{
  "id": "WO-227-D022",
  "date": "2026-10-22",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F3 by separating the candidate body from a completed publication's binding. ensureRelease reports the admitted existing bytes or the bytes about to be created through bindBody; the close retains the matching recorded source, digest, review and confirmation, or binds an admitted unrecorded legacy body as objective. A metadata-read failure keeps the known completed binding, and the next retry recognizes that completion through the immutable attempt history. An incomplete initial publication still refuses changed bytes before publication. Product 07 states that later notes cannot replace a published binding.",
  "evidence": [
    "docs/verifications/WO-227/VER-001.md F3 and docs/evidence/WO-227/verification-001-release.mjs: two identical completed-release rechecks fail on the second attempt while the remote body remains unchanged.",
    "scripts/release.mjs previously assigned the candidate digest before ensureRelease admitted an older body; github-repository.mjs returned only existing or created.",
    "scripts/test-target-worktree-release.mjs extends both completed-release cases to three rechecks, preserves the original reviewed confirmation, adds a legacy receipt with no body binding and a transient metadata-read failure followed by recovery, and retains the incomplete-attempt refusal."
  ],
  "rejected": [
    { "option": "Refuse every later note change", "reason": "The declared contract admits existing immutable Releases on recheck; preserving their actual bytes fulfills that contract." },
    { "option": "Copy the prior binding only after a successful recheck", "reason": "A transient read failure would still leave an unpublished candidate digest in the latest retry record." },
    { "option": "NoOp", "reason": "A successful recheck records bytes never published and breaks the next recheck." }
  ],
  "reopenWhen": "A recheck loses the actual published binding or a new publication lifecycle needs a different body source."
}
```

## WO-227-D023 — Correct the mixed-mode regression assertion and restart the complete gate

```json
{
  "id": "WO-227-D023",
  "date": "2026-10-22",
  "dispatch": "resume: fix",
  "decision": "The first repair review run exposed an error in the new test: it expected a private review item in the hard-refusal message when an identifier on the same row refuses. lintArtifacts has always reported hard refusals before review-only items; the observed identifier diagnostic was correctly redacted. Correct only that assertion, retaining the no-private-text assertion for every combination and the private mode/line/section assertion wherever the mode is actually reported. Stop the already-failed full run through evidence --stop and start a fresh complete run after formatting.",
  "evidence": [
    "npm test -- --review: target-publish failed its new criterion 2 case; actual output identifier.launchpad: [redacted] (line 9, Change table), expected vocabulary.local: review.",
    "Stopped row recorded 2026-10-22T17:42:50.219Z, duration 641063 ms, exit 1; supplies no passing gate claim.",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern='WO-227 criterion 2' scripts/test-target-publish.mjs: 1 test passed, exit 0, 3161 ms, 2026-10-22T17:43:20.227Z."
  ],
  "rejected": [
    { "option": "Change publication output to satisfy the new assertion", "reason": "The assertion misread existing refusal precedence; changing product behavior would not repair a demonstrated defect." },
    { "option": "Accept the focused pass as completion", "reason": "The required complete review run remains owed at the repaired identity." }
  ],
  "reopenWhen": "A current-identity complete run fails or the mixed-mode diagnostic reveals private source text."
}
```

## WO-227-D024 — Verification routes the kit-row private-term exemption to repair

```json
{
  "id": "WO-227-D024",
  "date": "2026-10-22",
  "dispatch": "resume: verify",
  "decision": "VER-002 fails criterion 3. lintArtifacts drops every finding but text.control-character on a Change row the kit's records commit wrote, so a refuse-mode private term carried by a moved record's path (the order file's basename) neither refuses nor joins the review list, and the reviewed target publish pushes it. main linted the whole composed body and refused that row; product 07's Outward artifacts bullet and the kit README say kit records are exempt from identifier.launchpad alone and that refuse-mode terms refuse in an added path. VER-001's F1 to F3 repairs hold. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/verifications/WO-227/VER-002.md finding F1",
    "docs/evidence/WO-227/verification-002-kit-row.mjs: the reviewed publish fixture with `refuse: fixture md` added before the records commit; target-records and publish exit 0 and pull request #7's body holds `| docs/work-orders/WO-999-fixture.md | 5 | 0 |`",
    "docs/evidence/WO-227/verification-002-probes.mjs N1: the same row as an ordinary added path refuses with vocabulary.local: refuse and a redacted path; checkOutwardArtifact over the composed body refuses",
    "scripts/lib/target-publish.mjs lintArtifacts, the `row?.existed || row?.kit` skip; scripts/lib/target-records.mjs checks record contents, not record paths"
  ],
  "rejected": [
    {
      "option": "Board it as a follow-up",
      "reason": "It removes a refusal main made on the locked private-list floor, inside the order's declared surface, and contradicts criterion 3 and the order's own written contract."
    },
    {
      "option": "Patch lintArtifacts during verification",
      "reason": "The read-only verifier preserves the subject and routes the criterion failure through repair."
    }
  ],
  "followup": "WO-227 repair: a kit-written Change row is exempt from identifier.launchpad only; private-list findings in either mode keep applying on it (refuse refuses; review joins the review list), with the path redacted as D020 requires. Add a reviewed-publish case whose refuse-mode term only a moved record's path carries, and keep the existing-base-path exemption and the kit identifier exemption.",
  "reopenWhen": "A repair makes the saved kit-row reproduction refuse without printing the term, followed by independent re-verification at the repaired code identity."
}
```

## WO-227-D025 — Board the target planning publication's confirmation gap

```json
{
  "id": "WO-227-D025",
  "date": "2026-10-22",
  "dispatch": "resume: verify",
  "decision": "Board, not block: `plan target-publish` calls lintArtifacts with no confirmation option, so a review word in its branch, title or body now refuses with `rerun with --confirm-terms sha256:…`, a flag its command rejects as usage. main refused the same text under vocabulary.launchpad, so nothing main published is now refused; the route is outside the order's criteria and declared surfaces, which name publishTargetDraft, publishTargetWorktree and the Release close.",
  "evidence": [
    "docs/evidence/WO-227/verification-002-probes.mjs N7: the refusal names --confirm-terms and carries the default `target publish refused:` prefix",
    "scripts/lib/target-planning.mjs publishTargetPlanning calls lintArtifacts without confirmTerms; scripts/refute-plan.mjs target-publish admits exactly the five flags --base, --from, --branch, --title and --body-file"
  ],
  "rejected": [
    {
      "option": "Fail a criterion for it",
      "reason": "No criterion names the planning route and main refused the same text."
    }
  ],
  "followup": "Next outward-lint or target-planning work: give `plan target-publish` the --confirm-terms route the other target publishes have, or print a remedy that route accepts, and use its own refusal prefix.",
  "reopenWhen": "An instance meets a review word in a target planning publication, or the planning route is next edited."
}
```

## WO-227-D026 — Board the publish-surface wording of a malformed private-list marker

```json
{
  "id": "WO-227-D026",
  "date": "2026-10-22",
  "dispatch": "resume: verify",
  "decision": "Board, not block: a mode marker with no term makes checkLocalTerms throw `local-terms list line N: a mode marker with no term`, which step 3 requires and the kit README documents, but the outward adapter turns that exception into status error, so a target publish refuses with `local-terms.configuration` on every artifact and no line. main gave the same unlocated refusal for a malformed list, and the terms check names the line.",
  "evidence": [
    "docs/evidence/WO-227/verification-002-probes.mjs N2 and N2b",
    "scripts/outward-lint.mjs observeLocalTerms returns { status: \"error\" } for any exception other than the redacted match diagnostic"
  ],
  "rejected": [
    {
      "option": "Judge criterion 3's malformed-marker clause unmet",
      "reason": "Step 3 places the line in checkLocalTerms, which names it, and the publish still refuses."
    }
  ],
  "followup": "Next outward-lint work: let the publish refusal for a malformed private list name the list line (never a term), or point at `npm run terms -- check`.",
  "reopenWhen": "An operator meets local-terms.configuration on a publish and cannot locate the line."
}
```

## WO-227-D027 — Apply every non-identifier check to new kit record paths

```json
{
  "id": "WO-227-D027",
  "date": "2026-10-22",
  "dispatch": "resume: fix",
  "decision": "Repair VER-002 F1 by separating the existing-base-path exemption from the kit-record exception in lintArtifacts. A new kit record path exempts identifier.launchpad only; refuse-mode private terms refuse, explicit or unmarked review-mode terms require the composed body's confirmation, and public review words and runtime identifiers keep their checks. Preserve private-row diagnostic redaction and the existing-base-path exemption, including control-character refusal. Correction to D004: its identifier-specific evidence was incorrectly generalized into dropping every non-control finding on kit rows; the product contract meant only the launchpad identifier. The filter and its composer comment now express that narrower rule; the product documents already do.",
  "evidence": [
    "docs/verifications/WO-227/VER-002.md F1 and D024/FUP-182e789079d09c25 select this repair.",
    "Before the repair, node scripts/harness.mjs bounded -- node docs/evidence/WO-227/verification-002-kit-row.mjs exited 1: recordsStatus 0 and publishStatus 0, with docs/work-orders/WO-999-fixture.md in the fixture's published Change table; bounded duration 6038 ms, completed 2026-10-22T18:40:41.189Z.",
    "scripts/test-target-publish.mjs adds explicit refuse, explicit review and unmarked review on a kit path, overlapping public-word redaction, a separate public-word kit path, stale and current confirmation, existing-plus-kit admission, clean kit identifier admission, runtime-identifier refusal and control-character refusal for both new and existing paths.",
    "scripts/test-target-worktree-publish.mjs adds a private term carried only by the moved order basename before target-records, checks refusal before any forge/push/publication-record effect, then confirms that unmarked term in the reviewed publish with its counted confirmation.",
    "Product 07 Discipline Outward artifacts and the kit README already require these private checks; no product-contract change is needed.",
    "repair-ver002-evidence.json records the passing complete review (40 suites, 106 fresh tasks, 1781842 ms), the original N1 now refusing with redacted diagnostics, and the adapted kit-row reproduction exiting 0 with recordsStatus 0, publishStatus 1, no forge state/log and no publication branch. The original filed reproduction remains unchanged: after the repair it fails only while reading forge state that no refused publication creates; repair-ver002-kit-row.mjs makes that read absence-aware and adds side-effect assertions."
  ],
  "rejected": [
    {
      "option": "Retain the broad kit-row exemption or narrow the product documents",
      "reason": "The saved reproduction demonstrates a private-list refusal disappearing on a declared publication surface. NoOp would retain that regression."
    },
    {
      "option": "Remove every kit-row exemption",
      "reason": "The records binding deliberately preserves launchpad identifiers in moved record paths; refusing them would break the accepted publication route."
    },
    {
      "option": "Restore only vocabulary.local on kit rows",
      "reason": "The documented exception is identifier.launchpad alone; public review words and other checks must not be silently dropped either."
    }
  ],
  "reopenWhen": "The records binding changes its identifier contract, or another generated-path diagnostic bypasses a required check or exposes a private term."
}
```

## WO-227-D028 — Board the CRLF byte change of the meter relocation

```json
{
  "id": "WO-227-D028",
  "date": "2026-10-22",
  "dispatch": "resume: verify",
  "decision": "Board, not block: withMeterBlockLast trims only LF around the lifted meter block and joins with LF, so a CRLF stored body whose meter sits between the heading and the prose comes back with mixed line endings (`# T\\r\\n\\r\\n\\n\\r\\n\\r\\nProse.\\r\\n\\n<meter>`), changing bytes outside the block. The shape check still passes and the rendered Markdown only gains blank lines. The input is not reachable through the lifecycle: git diff --check, which every completion runs, reports each CRLF line as trailing whitespace under this repository's default core.whitespace, and none of the 183 tracked stored PR.md bodies holds a CR. main replaced the block in place and kept CRLF bytes elsewhere. The executor's adversary reported CRLF bodies as unbreakable; this qualifies that claim.",
  "evidence": [
    "docs/evidence/WO-227/verification-003-probes.mjs M2 (observation) and M1 (LF bodies: already-last unchanged; top, unterminated and between bodies moved last with no other byte changed)",
    "A temporary repository with a CRLF PR.md: git diff --check exits 2 with `trailing whitespace` on every line; git config --get core.whitespace is unset here",
    "git ls-files 'docs/final-reviews/*/PR.md': 183 files, none containing a carriage return",
    "docs/evidence/WO-227/self-review.md, adversary 'Could not break' list naming CRLF bodies"
  ],
  "rejected": [
    {
      "option": "Judge criterion 6 unmet",
      "reason": "The criterion's case is a stored body the lifecycle admits; a CRLF body is refused by git diff --check before any role completes, and LF bodies keep every other byte."
    }
  ],
  "followup": "Next github-body or release-prepare work: make withMeterBlockLast preserve the body's own line ending (trim CR LF pairs around the lifted block and join with the body's ending), with a CRLF case beside the LF relocation cases.",
  "reopenWhen": "A stored body with CR line endings reaches release prepare or regeneratedPullRequestBody, or an instance's repository sets core.whitespace with cr-at-eol."
}
```

## WO-227-D029

<!-- integration refs/dotln/checkpoint/WO-227/14 -->

```json
{
  "id": "WO-227-D029",
  "date": "2026-10-22",
  "dispatch": "resume: final review; worktree integrate WO-227",
  "decision": "Integrate current main under the final-review dispatch with an external intake backup, retaining the checkpoint and named stash. Original base and fetched main are both 4dfb8052d670d0d9c363f9cf110cd9b8e73395fc; no authored conflict or code change occurred. The v0.91.0 minor target remains above v0.90.0, component sources and versions are unchanged, and no evidence source changed. Carry forward VER-003's unchanged claims and the complete row at code identity 84acede72027d5592a2b6de4d4acebaebe1efb4508ca74e06e560f376ca32ed9, qualified by the independently reproduced criterion 7 escape in D030. Integration itself introduces no finding.",
  "evidence": [
    "refs/dotln/checkpoint/WO-227/14",
    "base 4dfb8052d670d0d9c363f9cf110cd9b8e73395fc",
    "upstream 4dfb8052d670d0d9c363f9cf110cd9b8e73395fc",
    "release preparation: WO-227 target v0.91.0 remains current. Files changed: docs/evidence/WO-227/meta.json. Meter snapshot: docs/evidence/WO-227/meta.json, 4259 bytes. Tag observation: local snapshot only."
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

Integration date: 2026-10-22. Original base: `4dfb8052d670d0d9c363f9cf110cd9b8e73395fc`.
Fetched main: `4dfb8052d670d0d9c363f9cf110cd9b8e73395fc`. Checkpoint: `refs/dotln/checkpoint/WO-227/14`.
Named stash retained: `491add4deb1e5f22ad0ebac8a370f3052b1bd8ee` (WO-227 integrate 2026-10-22).
Resolved projections: none.
Release preparation: WO-227 target v0.91.0 remains current. Files changed: docs/evidence/WO-227/meta.json. Meter snapshot: docs/evidence/WO-227/meta.json, 4259 bytes. Tag observation: local snapshot only.
Carried-forward claims: criteria 1 to 6 and 8 retain VER-003's evidence at the identical code identity, with the saved blocker probes rerun successfully. Criterion 7 is unmet on D030's new counterexample; the prior redaction, prose and repeated-release-recheck repairs hold. Criterion 9's existing complete row passes all 40 suites; the final document gate is recorded after the report's last edit. No component-version collision or evidence re-mint is owed.
Authored conflicts observed: none.
Affected checks: publication:check, harness check and release check-surfaces --local passed on 2026-10-22. The complete review row at the unchanged identity is already passing (2026-10-22T19:13:50.790Z, 1781842 ms). No fresh complete run is started for the reproduced failing candidate. Details are in final-review-evidence.json and FINAL-001.

## WO-227-D030 — Final review routes the authored Release-link exemption to repair

```json
{
  "id": "WO-227-D030",
  "date": "2026-10-22",
  "dispatch": "resume: final review",
  "decision": "Fail criterion 7: targetReleaseNotesBody identifies generated record links by a regex over the completed body that accepts every URL under the target repository's blob path at the tagged commit. An author-written absolute URL to docs/WO-006-notes.md, a path absent from the target and from the moved-record mapping, therefore receives the identifier.launchpad exemption. The synthetic close exits 0 and publishes the identifier in the Release; the otherwise identical link at another revision refuses before any tag push. This is an escape present at VER-003's code identity, not an integration defect. Keep the documented kit-frame exception and repair how its provenance is identified; the reviewer leaves implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-227/final-review-release.mjs: bounded reproduction exits 1 on the expected-refusal assertion; controlStatus 1, candidateStatus 0, publishedIdentifier true, tagPublished true, releaseCreated true, namedPathExists false.",
    "docs/evidence/WO-227/final-review-evidence.json: reproduction finished 2026-10-22T19:46:04.556Z in 7998 ms; local synthetic fixtures only.",
    "scripts/release.mjs:2594-2604 matches all target blob URLs at tagged and exempts identifier.launchpad and vocabulary.review without consulting the moved map or whether the renderer generated the destination.",
    "WO-227 criterion 7 requires outward lint on the Release body; product 07 Workflow closeout and releases and D008 limit this exception to the kit's frame and moved-record links.",
    "All earlier blockers remain repaired: verification-001-probes.mjs reports 22 met and no failed judgments; verification-001-release.mjs and repair-ver002-kit-row.mjs exit 0."
  ],
  "rejected": [
    {
      "option": "NoOp or accept any target-commit URL as a generated record link",
      "reason": "The reproduction publishes a literal launchpad identifier through authored notes, contrary to criterion 7; its path does not exist in the target."
    },
    {
      "option": "Remove the generated-record exemption entirely",
      "reason": "The accepted records binding preserves launchpad identifiers in paths the kit moves; those generated links must keep working."
    },
    {
      "option": "Write a behavioral fix in final review and certify it here",
      "reason": "Product 07 Independent workflows and integration routes an actual acceptance defect to bounded repair and fresh independent verification."
    }
  ],
  "followup": "WO-227 repair: bind the Release-link exemption to destinations actually generated from the moved-record mapping, with source spans preserved; an author-written target URL must retain identifier and review-word checks. Add a regression with a nonexistent target path carrying WO-006 at the tagged commit, its other-revision refusal control and a legitimate generated moved-record-link control. Preserve private-list redaction and the completed-release binding repair, then independently re-verify criterion 7.",
  "reopenWhen": "The saved authored-link reproduction refuses before tag or Release effects while legitimate generated record links still pass, followed by independent verification at the repaired identity."
}
```

## WO-227-D031 — Exempt only the bytes the renderer writes for a moved record

```json
{
  "id": "WO-227-D031",
  "date": "2026-10-22",
  "dispatch": "resume: fix",
  "decision": "Repair FINAL-001 F1 by binding the Release record-link exemption to provenance instead of URL shape. absoluteBodyLinks gains an optional written array that receives the offsets, in the text it returns, of each destination the call wrote; offsets written by an earlier pass move with the copied piece holding them, and its output bytes are unchanged. targetReleaseNotesBody replaces the regex over the finished body with those offsets, placed by each section's position. The rule the repaired code holds: in a reviewed target Release body only the bytes the kit writes are its frame, namely the order title, the close line and, for each relative link the renderer resolves to a moved record, the target address, tagged commit and record path it writes. Every byte the notes' author wrote is judged for identifiers and review words, including an absolute target URL at any commit or with the exact bytes of a written record link, and the query or fragment a record link carries. One exception remains: a fragment may name the closing order's own identifiers, because the close line and the moved records already publish them. That keeps a decision anchor such as #wo-999-d001 working, while another order's identifier there refuses and a review word there is a review item. The target's own address is judged when the author writes it, so the fixture owner dotln-fixture yields a DotLn review item, which waits for confirmation and refuses nothing. Product 07 now states the provenance rule.",
  "evidence": [
    "docs/final-reviews/WO-227/FINAL-001.md F1 and D030/FUP-1d0c6e7432372b1a select this repair.",
    "Before the repair, FINAL-001's saved probe docs/evidence/WO-227/final-review-release.mjs exited 1: controlStatus 1, candidateStatus 0, publishedIdentifier true, tagPublished true.",
    "After the repair, the same unchanged probe exits 0 under node scripts/harness.mjs bounded: controlStatus 1 and candidateStatus 1, both refusing with identifier.launchpad: WO-006 (line 5, reviewed notes); publishedIdentifier, tagPublished and releaseCreated are false.",
    "docs/evidence/WO-227/repair-final001-release.mjs runs seven independent synthetic-fixture cases. The repaired tree meets all seven. A scratch tree that differs only by the checkpoint's release.mjs and github-body.mjs fails the six authored cases: an absent path at the tagged commit, an authored copy of a record link's bytes, another order's identifier in a fragment, the closing order's identifier in a query, a review word in a fragment and an authored address with a review word. It passes the written-record-link control.",
    "docs/evidence/WO-227/repair-final001-links.mjs compares the checkpoint's absoluteBodyLinks with the repaired one over 50000 seeded random Markdown bodies: 0 byte differences, 0 span failures, 754 written spans each holding the repository prefix and no unreported written destination.",
    "scripts/test-github-body.mjs adds the written-offset case: BOM, three line endings, inline link, image, reference definition, an image whose inner link moves when a second pass turns the image into text, and an authored copy of a written destination that is never reported. It fails against the checkpoint module and passes against the repaired one.",
    "scripts/test-target-worktree-release.mjs adds the end-to-end Release case: the FINAL-001 path at another revision and at the tagged commit, the copied record-link bytes, the two fragment cases, the query case and the authored worded address all refuse or wait before any tag push, and the restored notes publish with their written record links and no review items.",
    "A suspected adjacent defect, a code span in a reference-definition label being rewritten from the masked line, was refuted by a bounded probe: the parser does not mask code inside a definition label, and the label keeps its bytes."
  ],
  "rejected": [
    {
      "option": "Keep the URL-shape match and also require the path to be a moved record's target path",
      "reason": "An authored URL to a real moved record would still be exempt, because its bytes are indistinguishable from a written one. The finding requires provenance, not a path membership test."
    },
    {
      "option": "Render with a placeholder revision and find the placeholder afterward",
      "reason": "This still needs a list of written destinations to find where each one ends. It is ambiguous when one written destination is a prefix of another followed by a closing parenthesis, and it hides the contract in a trick instead of stating it in the rewrite's interface."
    },
    {
      "option": "Exempt the whole written destination, its fragment included",
      "reason": "The fragment comes from the author's link, not from the moved-record map, so another order's identifier could ride in a decision anchor; the own-order exception keeps the legitimate anchor."
    },
    {
      "option": "Check each fragment against the moved record's heading anchors",
      "reason": "The repository has no GitHub heading-slug implementation to share. The closing order's identifiers are the only ones the frame and moved records are known to publish."
    },
    {
      "option": "Read the target's own address as a name, as the display name is read",
      "reason": "That widens an exemption the finding says to keep narrow. A review word in an authored address is a review item for the reviewer and never a refusal."
    }
  ],
  "reopenWhen": "Another renderer writes record destinations without reporting them through written; an operator wants record-link fragments judged against the moved record's actual anchors, or the registered target address read as a name like the display name; or the records binding renames moved records or their identifiers."
}
```

## WO-227-D032 — Require the whole match to fit a generated-link exemption

```json
{
  "id": "WO-227-D032",
  "date": "2026-10-22",
  "dispatch": "resume: verify",
  "decision": "VER-004 fails criterion 7. FINAL-001’s authored-URL reproduction is repaired, but a public review-term match crossing from a generated record path into an authored fragment or query is still suppressed. With reviewTerms [\"md launchpad\"], the renderer’s decisions.md#launchpad contains the match md#launchpad. The generated span ends before #, while lintOutwardArtifact selects an exempt section from the match’s start alone and drops the whole finding. The synthetic release close publishes without --confirm-terms, with review and confirmation both null. This violates criterion 7’s required review confirmation and D031’s boundary around only the bytes the renderer writes. It does not challenge contextual review or the legitimate generated-path exemption. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-227/verification-004-probes.mjs: five authored-link variants refuse before tag or Release effects; the compound review-term case exits 1 on its expected-refusal assertion after close exits 0, creates a tag and Release, and records no review or confirmation.",
    "docs/evidence/WO-227/verification-004-boundary.mjs: fragment and query matches occupy offsets [124,136), while the generated destination’s exempt span is [13,126). Both return pass instead of review. An in-memory control that adds end containment returns review for both, retaining the wholly-generated pass and wholly-authored review controls. No repository implementation file is changed.",
    "scripts/lib/outward-lint.mjs:795-813 selects the narrowest section containing the finding’s start and suppresses its rule without checking the finding’s end; scripts/release.mjs:2603-2610 ends the generated span before the authored query or fragment.",
    "docs/evidence/WO-227/verification-004-evidence.json records the bounded runs, consumed complete review row and earlier repair reproductions.",
    "WO-227 criterion 7; product 07 Workflow closeout and releases; WO-227-D031’s explicit rejection of exempting an authored fragment."
  ],
  "rejected": [
    {
      "option": "NoOp or pass from the repaired authored-URL case and complete gate alone",
      "reason": "The independent fixture publishes a configured review match without the required confirmation."
    },
    {
      "option": "Treat every match that starts in generated text as wholly generated",
      "reason": "That grants the generated span authority over authored bytes outside it; the query and fragment are explicitly outside D031’s exemption."
    },
    {
      "option": "Remove generated-path exemptions or patch the judged implementation as verifier",
      "reason": "Generated record links must retain their accepted behavior, and the verifier records a repair rule without changing its subject."
    }
  ],
  "followup": "WO-227 repair: apply a rule exemption only when the complete matched span is inside the authorized exempt region. Keep section labeling separate if necessary. Cover compound review terms crossing into a query or fragment, whole generated-path matches, whole authored-fragment matches, and the end-to-end no-confirmation refusal before any tag or Release effect. Preserve private-list redaction, legitimate record links and completed-release bindings, then independently re-verify criterion 7.",
  "reopenWhen": "Both crossing-span probes require review and the saved release fixture refuses before tag and Release effects without confirmation, while the generated and authored controls retain their expected results."
}
```

## WO-227-D033 — Lift a rule only from a match lying wholly in an exempting part or row

```json
{
  "id": "WO-227-D033",
  "date": "2026-10-22",
  "dispatch": "resume: fix",
  "decision": "Repair VER-004 F1 and close its class, a partial-span exemption suppressing required review, wherever the lint lifts a rule by position. The rule the repaired code holds: an exemption drops a finding only when every byte of the finding's span lies in a part or row that exempts its rule; a match that runs out of a kit-written part, out of a base-held or kit-record Change row, or past a display name into other text is reported. lintOutwardArtifact keeps labelling a finding with the narrowest part holding its start, and now decides the exemption separately: the narrowest part holding a byte changes only at a part's edge, so it checks the span's start and every part edge inside the span, each of which must be governed by a part exempting the rule. lintArtifacts lifts its base-held-path and kit-record exemptions only when the finding ends inside the row its start sits in; the row still names the path and still drives private-line redaction. The display-name ranges already required whole containment and are unchanged. The renderer's record-link offsets from D031 are unchanged, so legitimate record links, decision anchors, moved-record paths and completed-release bindings keep their behavior. Product 07 states the whole-match rule in the target Release paragraph and the Outward artifacts bullet.",
  "evidence": [
    "docs/verifications/WO-227/VER-004.md F1 and D032/FUP-5df244acdc3b9eb7 select this repair.",
    "Before the repair, VER-004's saved probe docs/evidence/WO-227/verification-004-probes.mjs, run on a scratch tree that differs from the worktree only by refs/dotln/checkpoint/WO-227/20's scripts/lib/outward-lint.mjs and scripts/lib/target-publish.mjs, exits 1: the close exits 0, publishes the tag and Release with the authored fragment, and records review null and confirmation null. On the repaired worktree the same unchanged probe exits 0: the close refuses with 1 review item, release-body: vocabulary.review: md launchpad (line 5, record link), before any tag or Release.",
    "docs/evidence/WO-227/repair-ver004-spans.mjs runs nine in-process cases. The repaired tree meets all nine. The scratch base tree fails all four finding cases and passes all five controls. The finding cases are a compound term crossing from a written record path into an authored fragment and into an authored query, which VER-004 quoted, and two it did not: one crossing from a lifting part into an authored part nested inside it, and one running from a base-held Change row's removed count into the added path below it. The controls are a term wholly in a written record path, a term wholly in an authored fragment, a term wholly in a lifting part around a nested authored part, a term running past a display name, and a base-held row's own word with no term joining the rows.",
    "Three suite cases carry the rule: scripts/test-outward-lint.mjs (fragment, query, nested part and display-name crossing with their wholly-inside controls), scripts/test-target-publish.mjs (a base-held row crossing into an added path, with the no-join control) and the Release provenance case in scripts/test-target-worktree-release.mjs (the fragment and query crossings refusing end to end before any tag). On the scratch base tree all three fail at the new assertions (lines 447, 1197 and 1001); on the repaired tree all three pass.",
    "VER-004's isolated probe docs/evidence/WO-227/verification-004-boundary.mjs exits 1 on the repaired tree at its own precondition on line 9, which asserts that the pre-repair predicate text appears once in scripts/lib/outward-lint.mjs. Its four cases are covered in both arms by repair-ver004-spans.mjs; the filed probe is unchanged."
  ],
  "rejected": [
    {
      "option": "Require the narrowest part holding the finding's start to hold its end too, VER-004's in-memory control",
      "reason": "A match starting in a lifting part and ending in an authored part nested inside it would stay lifted, because the outer part holds both ends; the nested-part case shows the gap. It would also report a match that crosses from one exempting part into an adjacent one exempting the same rule."
    },
    {
      "option": "Leave the Change-row exemptions keyed to the match's start, since a row ends in its counts",
      "reason": "Words join across lines, and a count is a word: a binary row ends in the word binary and a numeric count joins a term such as 0day, so a review match can begin in a base-held row and end in an added path. The class closes only if every positional exemption holds the same rule."
    },
    {
      "option": "Report only the part of a crossing match outside the exempt part",
      "reason": "A listed term matches whole tokens; a fragment of it is not a term, so the reviewer could not be told which listed word was found."
    },
    {
      "option": "Remove the record link's review-word exemption",
      "reason": "Every moved record's own path would become a review item, reversing D031's accepted behavior; VER-004 asks to preserve legitimate record links."
    }
  ],
  "reopenWhen": "A caller needs a match that crosses an unlabelled joiner between two kit-written parts to stay exempt; an operator reports that naming a crossing row by the path its match starts in misleads the reviewer; or a new exemption is introduced that decides by a single offset."
}
```

## WO-227-D034 — Preserve the extent of a private match across Change rows

```json
{
  "id": "WO-227-D034",
  "date": "2026-10-22",
  "dispatch": "resume: verify",
  "decision": "VER-005 fails criterion 3. D033 repairs exact public match spans, but private findings retain only the match's starting line. A synthetic private term 0day starts in the removed-count 0 of a base-held a.txt row and ends in the added day.md row. checkOutwardArtifact detects it in refuse or review mode; lintArtifacts drops it because the reported first-line span lies wholly in the base-held row. The draft publication fixture exits 0, pushes its local fixture branch and creates its fake pull request despite refuse mode, with no confirmation. Explicit review and unmarked modes also return review null in the shared helper. Correction to the repair handoff's inference: line-sized private findings do not establish that the actual match is wholly in that line. The same whole-match rule must hold without exposing private text. Earlier blocking reproductions pass. The verifier leaves the implementation unchanged; product 07 already states the required boundary.",
  "evidence": [
    "docs/evidence/WO-227/verification-005-probes.mjs: a public 0day match has span [104,113) and waits for confirmation; the private finding reports only line 9, span [90,107), while the added row begins at 108. Refuse, explicit review and unmarked modes are all suppressed. Clearing only the existing-row flag restores their refusal or review. The byte-by-byte section oracle passes 506 cases.",
    "docs/evidence/WO-227/verification-005-publish.mjs: the production worktree publish --target-worktree --draft route publishes rows | a.txt | 1 | 0 | and | day.md | 1 | 0 |. Publish status 0, fixture branch present, fake pull request present, direct outward check refused, confirmation null. The independent expected-refusal assertion exits 1.",
    "scripts/lib/terms.mjs groups a multi-line match by its starting line and mode; scripts/outward-lint.mjs carries only line, count and mode; scripts/lib/outward-lint.mjs reconstructs a first-line span; scripts/lib/target-publish.mjs applies the base-held-row exemption to that truncated span.",
    "docs/evidence/WO-227/verification-005-evidence.json records the current complete row, earlier reproductions, new observations and the corrected probe setup. WO-227 criterion 3 and product 07 Discipline Outward artifacts require refuse-mode refusal, review-mode confirmation and whole-match containment."
  ],
  "rejected": [
    {
      "option": "NoOp or pass from the public-span repair and complete gate",
      "reason": "The private checker detects the configured match and the production publication helper nevertheless publishes it. A line used to redact a diagnostic is not proof of the full match's extent."
    },
    {
      "option": "Remove existing-path exemptions or expose private matched text",
      "reason": "Criterion 4 preserves the target's existing vocabulary and criterion 3 requires redaction. A repair must retain enough non-text extent information to apply both rules."
    },
    {
      "option": "Repair the implementation during verification",
      "reason": "The verifier records the subject's failure and its repair rule without modifying the code it judges."
    }
  ],
  "followup": "WO-227 repair: retain the full contributing extent of private-term matches through the redacted checker and outward adapter so an existing Change row exempts only a match wholly inside that row. A crossing refuse match must refuse before publication; explicit and unmarked review matches must require and record confirmation. Keep all contributing private text redacted, retain existing-path-only and kit-identifier controls, and add a multi-line variation beyond the reported two-row example.",
  "reopenWhen": "The saved production draft reproduction refuses before any forge or push effect, the shared helper handles both review spellings with confirmation, and wholly base-held private matches keep their accepted exemption, followed by independent re-verification."
}
```

## WO-227-D035 — Carry the complete private line range through exemptions and redaction

```json
{
  "id": "WO-227-D035",
  "date": "2026-10-22",
  "dispatch": "resume: fix",
  "decision": "Repair VER-005 F1 and its class: a private observation must cover every contributing line before a positional exemption or diagnostic redaction uses it. checkLocalTerms groups matches by starting line, ending line and mode, preserving counts only within that same range. The outward adapter admits and forwards endLine; the pure lint validates both endpoints and spans the complete lines inclusively. Missing or invalid ending lines refuse instead of implying a single-line match. The observation remains ephemeral and contains no term, hash or columns. Existing Change-row containment and overlap redaction therefore apply to the complete contributing extent. Separate matches sharing their starting line retain distinct endpoints, so a single-line existing-path match remains exempt while a crossing match is refused or reviewed. Product 07 and the kit README state the range and redaction rule. This answers D034 and FUP-f106e6391fd5dd16; independent re-verification remains required.",
  "evidence": [
    "Before the edit, node scripts/harness.mjs bounded -- node docs/evidence/WO-227/verification-005-probes.mjs exits 1: public review works but refuse, explicit review and unmarked private matches are dropped. After the edit the unchanged probe exits 0: each private span is [90,126), both review spellings require confirmation, refuse mode still refuses with a digest, and the 506-case section oracle passes.",
    "Before the edit, the unchanged verification-005-publish.mjs reproduction exits 1 after a successful synthetic draft push and fake pull request. After the edit it exits 0: publish status 1, remoteBranch false, pullCreated false; vocabulary.local: refuse is reported without the term or path.",
    "New outward-lint coverage checks differently sized overlapping private matches, an intervening blank line, LF/CRLF/CR mapping, and invalid or absent endLine. New target-publish coverage checks two and three Change rows, all three mode spellings, a public word and identifier on the last contributing row, an unrelated path, stale confirmation, and the base-path-only control. The production draft fixture adds the three-row variation, checks refusals before forge/push effects and checks the successful confirmation record.",
    "The complete gate and document row at handoff judge the repair; docs/evidence/WO-227/repair-ver005-evidence.json records the executed results. No dependency or role text changes."
  ],
  "rejected": [
    {
      "option": "NoOp, or infer the endpoint from the starting line",
      "reason": "Both saved reproductions demonstrate publication despite a configured refuse match. The preceding handoff's claim that a private finding's line contains the whole match was incorrect; a token join can span multiple lines."
    },
    {
      "option": "Expose exact private match offsets or its text",
      "reason": "Line ranges are sufficient to judge whole-row containment and redact every contributing row. Exact positions would disclose more of the private match than the existing privacy contract permits."
    },
    {
      "option": "Merge every match starting on one line into its longest range",
      "reason": "Distinct matches can share a start but end on different lines. Keeping separate ranges preserves their individual counts and legitimate single-row exemptions."
    },
    {
      "option": "Remove the existing-path exemption",
      "reason": "Criterion 4 requires the target's existing vocabulary to remain admitted; the problem is lost extent, not the exemption itself."
    }
  ],
  "reopenWhen": "A caller needs private observations with finer-than-line exemptions or a persisted observation protocol; establish a privacy-preserving contract before changing the conservative line-range representation."
}
```

## WO-227-D036 — Correct the evidence-source inventory claim against current checks

```json
{
  "id": "WO-227-D036",
  "date": "2026-10-22",
  "dispatch": "resume: fix",
  "decision": "D011 and the order's Cost text incorrectly said that no edited file was registered in scripts/lib/evidence-sources.mjs. scripts/lib/terms.mjs is registered for the authority and harness evidence. It is absent from FEEDBACK_SOURCE_PATHS. The relevant rule in product 07 requires a deterministic re-mint of editions whose checks become stale, and a live feedback episode only when the judged feedback sources or regenerated report change. npm run sync checked the repaired tree and reported authority, harness and feedback evidence current, as well as every other evidence edition. Retain those current editions: the source-inventory claim is corrected, while the observed checks establish that no re-mint or live episode is needed. The same sync regenerated the publication lock staled by the product write-back. Release prepare --local retained application v0.91.0; no component source or version changed.",
  "evidence": [
    "scripts/lib/evidence-sources.mjs: authoritySources includes terms.mjs at line 184 and harnessSources at line 352; packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS excludes it.",
    "Product 07 Operator-opened planning pass, registered-source and feedback-source duties at lines 1412 to 1425.",
    "npm run sync exits 0: all evidence and harness checks current; publication stale -> current, regenerated. npm run release -- prepare --local exits 0 and retains v0.91.0."
  ],
  "rejected": [
    {
      "option": "Repeat D011's source-inventory assertion",
      "reason": "The checked registration lists contradict it. A passing gate does not make that factual claim true."
    },
    {
      "option": "Re-mint unchanged editions or run a live feedback episode solely because an unrelated registered file changed",
      "reason": "The cited product contract keys those duties to stale edition checks and judged feedback changes respectively; the current checks report neither."
    }
  ],
  "reopenWhen": "An evidence check becomes stale, a feedback-judged source changes, or the regenerated feedback report changes."
}
```

## WO-227-D037

<!-- integration refs/dotln/checkpoint/WO-227/29 -->

```json
{
  "id": "WO-227-D037",
  "date": "2026-10-23",
  "dispatch": "resume: final review; worktree integrate WO-227",
  "decision": "Integrate current main under the final-review dispatch with an intake backup in the session scratch, retaining checkpoint refs/dotln/checkpoint/WO-227/29 and the named stash. Original base and fetched main are both 4dfb8052d670d0d9c363f9cf110cd9b8e73395fc, so the merge was a no-op; no authored conflict, no source change and no code-identity change occurred: the identity stays fb8927c9ee2a173f56cbd05a2a647eda6437f9c2d6c9adc60036bd01a895026d, VER-006's subject. Application v0.91.0 remains the minor target over v0.90.0; no component source or version changed (compiler 0.30.0, skeleton 0.65.0, console 0.4.5, kernel 0.6.0, beacons 0.1.1, browser-evidence 0.1.0), and the authority, harness and feedback edition checks exit 0 at the integrated tree, so no re-mint is owed. Carry forward VER-006's judgments on all nine criteria with the complete review row at that identity (npm test -- --review recorded 2026-10-23T00:07:19.005Z, 40 suites, 106 tasks, exit 0); the fourteen saved reproductions of VER-001 to VER-006 and FINAL-001 rerun at the integrated tree under the bounded runner each exit 0. Integration introduces no finding.",
  "evidence": [
    "refs/dotln/checkpoint/WO-227/29",
    "base 4dfb8052d670d0d9c363f9cf110cd9b8e73395fc",
    "upstream 4dfb8052d670d0d9c363f9cf110cd9b8e73395fc",
    "release preparation: WO-227 target v0.91.0 remains current. Files changed: docs/evidence/WO-227/meta.json. Meter snapshot: docs/evidence/WO-227/meta.json, 4618 bytes. Tag observation: local snapshot only.",
    "code identity before and after integration: fb8927c9ee2a173f56cbd05a2a647eda6437f9c2d6c9adc60036bd01a895026d; coveringGateCheck finds the passing complete review row recorded 2026-10-23T00:07:19.005Z (1774218 ms, 40 required suites, 106 tasks all exit 0) and no displaced task.",
    "fourteen saved reproductions rerun serially under node scripts/harness.mjs bounded at 2026-10-23T01:01:45Z to 01:03:17Z, each exit 0: verification-001-probes, -workers, -release; verification-002-probes; repair-ver002-kit-row; verification-003-probes; final-review-release; repair-final001-links, -release; verification-004-probes; repair-ver004-spans; verification-005-probes, -publish; verification-006-probes.",
    "affected checks at the integrated tree, each exit 0: npm run publication:check (255 of 255 headings, both editions current), node scripts/harness.mjs check (35 surfaces), npm run release -- check-surfaces --local, npm run meta -- --check (the two boarded WO-226 cold-start advisories), git diff --check, npm run format:check, and the authority, harness and feedback evidence checks.",
    "git diff --stat origin/main over packages, package.json, package-lock.json, .claude/skills and .agents/skills is empty: no dependency, component or role-text change."
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

Integration date: 2026-10-23. Original base: `4dfb8052d670d0d9c363f9cf110cd9b8e73395fc`.
Fetched main: `4dfb8052d670d0d9c363f9cf110cd9b8e73395fc`. Checkpoint: `refs/dotln/checkpoint/WO-227/29`.
Named stash retained: `14d52e0cf9d08dfd9934f532d0e99739b2a1a55d` (WO-227 integrate 2026-10-23).
Resolved projections: none.
Release preparation: WO-227 target v0.91.0 remains current. Files changed: docs/evidence/WO-227/meta.json. Meter snapshot: docs/evidence/WO-227/meta.json, 4618 bytes. Tag observation: local snapshot only.
Carried-forward claims: criteria 1 to 9 retain VER-006's evidence at the identical code identity, with every saved blocker reproduction of VER-001 to VER-006 and FINAL-001 rerun successfully at the integrated tree; no claim changed. No component-version collision and no stale evidence edition. The final document gate is recorded after FINAL-002's last edit.
Authored conflicts observed: none.
Affected checks: npm run publication:check, node scripts/harness.mjs check, npm run release -- check-surfaces --local, npm run meta -- --check, git diff --check and npm run format:check each exit 0 on 2026-10-23; the complete review row at the unchanged identity (2026-10-23T00:07:19.005Z, 1774218 ms) is the row FINAL-002 consumes, so no fresh complete run is started. Details are in FINAL-002.

## WO-227-D038 — Final review passes at the integrated identity and settles the three discharged repair rows

```json
{
  "id": "WO-227-D038",
  "date": "2026-10-23",
  "dispatch": "resume: final review",
  "decision": "FINAL-002 passes all nine criteria at code identity fb8927c9ee2a173f56cbd05a2a647eda6437f9c2d6c9adc60036bd01a895026d, the identity the VER-005 repair handed off, VER-006 judged and integration kept. The review read the whole subject diff, reran the fourteen saved reproductions of every earlier blocking finding at the integrated tree, ran the affected and edition checks, and found no defect of its own; the boarded follow-ups D018, D019, D025, D026 and D028 stay on their rows with their repair rules. The register rows that carried the three repair obligations this order discharged are settled here: FUP-1d0c6e7432372b1a (D030, repaired by D031, verified by VER-004 to VER-006), FUP-5df244acdc3b9eb7 (D032, repaired by D033, verified by VER-005 and VER-006) and FUP-f106e6391fd5dd16 (D034, repaired by D035, verified by VER-006); each settlement names its reproduction and its reopening condition, and the two textual matches FUP-369525016cc270e1 and FUP-8111fc3dd4c22331 are left as they are because neither condition occurred (docs/README.md is 21851 bytes against the 25000-byte limb). Planning receipt 052's criterion 3 known issue stands as a constructible condition that has not occurred: no ReviewTermsConfirmed row or confirmedDigest record exists under docs/control, and the first live confirmation is the fork's next target publish under the carrying release. Its criterion 8 known issue occurs when this order lands and is boarded as D018's row for the next authorized product-document writer.",
  "evidence": [
    "docs/final-reviews/WO-227/FINAL-002.md: the criterion judgments, the rerun table and the executed checks.",
    "The fourteen saved reproductions rerun under node scripts/harness.mjs bounded at the integrated tree, each exit 0, recorded in D037 and FINAL-002.",
    "coveringGateCheck at the integrated tree: identity fb8927c9ee2a173f56cbd05a2a647eda6437f9c2d6c9adc60036bd01a895026d, complete review row recorded 2026-10-23T00:07:19.005Z, 40 suites, 106 tasks, exit 0, nothing displaced.",
    "grep -rl 'ReviewTermsConfirmed|confirmedDigest' docs/control returns nothing at the integrated tree.",
    "wc -c docs/README.md: 21851 bytes.",
    "npm run plan -- followups --apply with the three settlement requests, recorded in FINAL-002's register table with the register revision before and after."
  ],
  "rejected": [
    {
      "option": "Leave the three discharged repair rows untriaged for a planning pass",
      "reason": "Each row's condition occurred in this order: its repair landed and independent verification confirmed it, so the final review disposes it with the evidence and a reopening condition, as the register rule directs; a planning pass would only re-read what this record states."
    },
    {
      "option": "Repair D026's publish wording or D028's CRLF relocation in the review",
      "reason": "Each edits a declared source and would move the code identity, owing a fresh complete run and re-verification for a diagnostic wording and a byte change no instance has met; both stay on their rows with their rules."
    },
    {
      "option": "Spawn an adversary to re-attack the subject",
      "reason": "Six verifications, two executor workers and fourteen saved reproductions already judge this subject; the review reran every one at the integrated tree and read the whole diff itself. No claim remained that a worker could add without a live publish, which is a non-goal."
    }
  ],
  "reopenWhen": "A settled row's reopening condition occurs: an authored target URL, query or fragment receives the record-link exemption, a finding whose span runs out of an exempting part or row is dropped, or a private match crossing out of a base-held Change row publishes without refusal or confirmation; or the first live target publish under this release records a confirmation that contradicts a criterion judgment here."
}
```
