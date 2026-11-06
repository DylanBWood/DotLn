# WO-257 decisions

## WO-257-D001

```json
{
  "id": "WO-257-D001",
  "date": "2026-11-06",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.119.0, the next minor above the observed release baseline v0.118.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.118.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-257-instance-returns-of-2026-11-03.md"
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

## WO-257-D002 — Correction: the hook received the planning dispatch behind the host's pasted-content wrapper, not the slash command's block

The order's step 11 names the host's command block (`<local-command-caveat>`, `<command-name>`, `<command-message>`, `<command-args>` and `<local-command-stdout>`) as what the prompt hook read before the dispatch line. The journals and transcripts of this host say otherwise. This session's journal row for `resume: next` records 12 bytes with the digest of exactly those twelve bytes, although the model-facing transcript opens with the `/model` block: Claude Code 2.1.318 stores that block as separate transcript entries (the caveat marked `isMeta`) and hands the hook only the operator's text. The 2026-11-06 planning session's row 2 records 9,538 bytes with digest `8c2abb3c…`; the operator's own prompt entry in that session's transcript begins with two blank lines, then `<pasted_content id="…">`, then `planning: standard planning pass +`, and its bytes hash to the same digest. So the host wraps a pasted dispatch in a `pasted_content` element, whose opening tag the reader took as the first content line; the command block never reached the hook. The fix therefore skips both shapes: the command-block elements the order names, each as a whole element, and the paste wrapper's opening tag, before the blanks and the one fence the reader already skipped; an unknown leading element is journaled by name beside the unclassified class, as the order designs.

```json
{
  "id": "WO-257-D002",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "Implement step 11's reader over the host's command block as the order specifies and, as an adjacent repair under the same purpose (a dispatch is read whatever the host wrote before it), over the host's pasted-content wrapper, which the evidence shows is what the hook received; journal an unknown leading element by name.",
  "evidence": [
    "docs/control/local/harness/e5ea1568….jsonl row at 2026-11-06T03:36:26.910Z: prefix resume:, class direction, bytes 12, digest 49f3ef31…, the SHA-256 of the twelve bytes `resume: next`; the model-facing transcript of the same prompt opens with the /model block in separate entries, the caveat marked isMeta",
    "the main checkout's docs/control/local/harness/e0823b0a….jsonl row at 2026-11-06T01:48:36.891Z: prefix null, class unclassified, bytes 9538, digest 8c2abb3c…; the planning session's transcript entry for that prompt is 9,538 bytes beginning with two blank lines and `<pasted_content id=\"e082\">` before `planning: standard planning pass +`, and hashes to 8c2abb3c… (checked with a scratch script over the transcript line)",
    "packages/compiler/src/harness.ts harnessPromptLine (38 to 52) skips blanks and one opening fence only, so the opening tag is the first content line",
    "the host's own system prompt describes text pasted into a message as wrapped in pasted_content tags"
  ],
  "rejected": [
    {
      "option": "Skip only the command block the order names",
      "reason": "The order's purpose and objective (a dispatch is read whatever the host wrote before it) would be missed for the shape every planning session since 2026-10-29 actually carried; the fix would meet criterion 11 and leave the planning sessions unclassified."
    },
    {
      "option": "Treat pasted_content as the unknown element and leave it to the next pass",
      "reason": "The evidence is in hand now; deferring a bounded repair of a named adjacent defect is what Adjacent Repair declines."
    },
    {
      "option": "Read the prefix from any line",
      "reason": "WO-226's quoted-example rule; the order rejects it."
    }
  ],
  "reopenWhen": "A dispatch after this order's release journals unclassified with a known host element before it, or the host changes either shape (the unknown-element name in the journal row says which)."
}
```

## WO-257-D003 — Record: the host's auto-mode classifier denied reading the intake captures from the main checkout

```json
{
  "id": "WO-257-D003",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "Record the host denial and proceed without the captures: the order's nomination provenance carries their hashes, and the evidence for D002 came from the transcript and journal instead. No retry and no workaround.",
  "evidence": [
    "the denied command read the two ignored intake captures under the main checkout (planning-dispatch-2026-11-05-fork-returns-and-review-batches.md and planning-dispatch-2026-11-03-recurring-failures.md) with wc, shasum and head; the refusal was Claude Code's: 'Permission for this action was denied by the Claude Code auto mode classifier … judged this action dangerous (it gave no explanation)', not a DOTLN_HARNESS_REFUSED line",
    "reads outside this worktree before and after it were admitted: the planning session's journal in the main checkout and the transcripts under the home directory"
  ],
  "rejected": [
    {
      "option": "Retry the read in another form",
      "reason": "The denial's intent is the host's to decide; the captures were not needed for any step."
    }
  ],
  "reopenWhen": "Never; this is a record of a host denial for plan failures to count."
}
```

## WO-257-D004 — Step 1: one comparison sentence, and a dispatch-role row only when a record shows the role dispatched

```json
{
  "id": "WO-257-D004",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "renderMetaTable renders one sentence against the previous closed order listing every metric's delta or `unknown`, renders a dispatch-role row only when a completed phase attempt, a usage or journal figure, or a bound event names the role, and names the roles with no record in one sentence below the table (WO-248-D004, FUP-225e0993974f3f4b taken).",
  "evidence": [
    "scripts/lib/meta.mjs renderMetaTable: the collector's row carries attempts (phases), wallClockMs, observedTokens, observedCostUsd, commandsRun, stepCount, boundStops.count and boundAcceptances; an undispatched role has every value null and the bound counts 0 (WO-248-D004's reading of VER-001)",
    "scripts/test-process-debt.mjs, the subject meter case: the sentence lists the seven metrics once, `unknown` where either side is unobserved; release-close and planner rows with no record are named below the table; npm test -- --only process-debt passed (8 passed) on 2026-11-06"
  ],
  "rejected": [
    {
      "option": "Keep one sentence per metric and drop the unknown ones",
      "reason": "The operator's item 5: the twelve-word opening appeared six times on one pull request; the table above carries the figures."
    }
  ],
  "reopenWhen": "A body renders a row for a role with no record, or a reader asks for a metric the sentence omits."
}
```

## WO-257-D005 — Step 2: the kit's sentence, and a typed refusal of an update under a journaled planning or entropy dispatch

```json
{
  "id": "WO-257-D005",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "The planner role text and the kit guide (§Planning in this instance, §Taking upstream updates) state that no planning or entropy pass runs launchpad update, merges upstream or takes a newer starter release unless the operator asks in that session. scripts/launchpad.mjs types it: update --finish, update --publish and export --update read the session's harness journal (a planning: or ideation: OperatorMessageObserved row) and the launchpad's pending entropy pointer, refuse under either naming the operator's in-session request as the route, admit --operator-request --capture <ignored intake file> --capture-hash sha256:<digest> through the off-ramp capture rule, journal the admission with the capture hash as a LaunchpadUpdateAdmitted row, and record the hash in the sibling receipt a from-core update writes (an optional operatorRequest field the decoder admits only when present). A preview and a session with no journaled dispatch are admitted as before; kit.applyInstanceActions is unchanged.",
  "evidence": [
    "scripts/launchpad.mjs updateDispatchHold, admitUpdate, takeOperatorRequest; scripts/lib/siblings.mjs decodeReceipt and writeReceipt; scripts/lib/off-ramps.mjs requireOperatorCapture (the capture must be an ignored, untracked intake file whose hash the caller states)",
    "the entropy pass has no journal row of its own: `planning: entropy reducer` is a planning: row, and a pass in progress leaves docs/control/local/entropy/current-<kind>.json naming a pending file, which the hold reads",
    "scripts/test-launchpad-update.mjs: the finish fixture under a planted planning row is refused, admitted with the capture flags and journaled; the from-core sibling update is refused, previews under the hold and records operatorRequest.captureHash in its receipt"
  ],
  "rejected": [
    {
      "option": "A feature election for 'update before pass'",
      "reason": "The operator's item 12: nobody wants it; a switch for it is the rule again (the order's Design)."
    },
    {
      "option": "The sentence alone",
      "reason": "Receipt 064's hold on criterion 2: the rule is prose only until the command refuses."
    }
  ],
  "reopenWhen": "An instance pass takes an update unasked with no journaled dispatch, or an operator's request has to be recorded from a capture outside the intake root."
}
```

## WO-257-D006 — Record: a sibling receipt for v0.118.0 was uncommitted in this worktree at dispatch

```json
{
  "id": "WO-257-D006",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "Keep the uncommitted sibling refresh (docs/siblings/README.md, docs/siblings/tag-observations.json and the receipt docs/evidence/siblings/DotLn-Enterprise-Starter/2026-11-06T01-42-22-238Z.json) found in the worktree at dispatch; it is the kit's own bookkeeping of WO-255's publication, not this order's change, and final review commits the worktree as it stands.",
  "evidence": [
    "git status at dispatch: the three files modified or untracked; main's last sibling commit is f929a1207 (v0.117.0); the receipt names core commit 772979eac and tag v0.118.0 at 2026-11-06T01:42:22Z; the files' mtime is 22:35 local on 2026-11-05, one minute after the #278 merge the worktree started from"
  ],
  "rejected": [
    {
      "option": "Discard the files",
      "reason": "Preserve work; a sibling publishing the version an order staged is bookkeeping, never a finding (CLAUDE.md §Shared memory)."
    }
  ],
  "reopenWhen": "The final reviewer finds the receipt duplicated on main."
}
```

## WO-257-D007

Release surfaces: the component versions, the role-oracle baseline and the cold-start readings. The role oracle wo257-role-baseline.json points here by the bare anchor, as the register's revision does.

```json
{
  "id": "WO-257-D007",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "npm run release -- prepare --local assigned v0.119.0 to the order heading, and the changed components were bumped with their workspace pins: @dotln/skeleton 0.86.0 (harness-host.ts, loadouts/contributor.ts and version.ts changed), @dotln/compiler 0.42.0 (harness.ts and artifact-identity.ts changed), the console's pins and package-lock.json; HARNESS_HOST_VERSION reads 0.46.0 and COMPILER_PACKAGE_VERSION 0.42.0; the console's own version is unchanged because its source is unchanged. The role oracle's baseline chain gained packages/skeleton/fixtures/wo257-role-baseline.json over wo255-repair-role-baseline.json, recording each root's role and opt-out role hashes and its startup cost after the planner's no-update sentence; scripts/test-process-debt.mjs reads the new head of the chain. The planner root's cold start reads 30,780 bytes against its 24,576-byte ceiling, an advisory the oracle records as the roots' ceilings stand (WO-255-D011; FUP-df9d4f666035fecc holds the optimization).",
  "evidence": [
    "npm run release -- prepare --local on 2026-11-06 wrote v0.119.0 into the order heading and docs/evidence/WO-257/meta.json",
    "the release-surfaces preflight named the changed skeleton and compiler sources and the stale role oracle before the bumps; after them npm run sync reports release-surfaces and role-oracle current",
    "packages/skeleton/fixtures/wo257-role-baseline.json: historicalBaseline wo255-repair-role-baseline.json, decision WO-257-D007, startupCost per root"
  ],
  "rejected": [
    {
      "option": "Bump the console",
      "reason": "Its source is unchanged; only its pins on the skeleton and the compiler moved."
    }
  ],
  "followup": "Optimize the role roots' cold-start bytes with equivalent usefulness: WO-257 added the planner's no-update sentence (618 bytes), leaving the planner at 30,780 bytes against its 24,576-byte ceiling and the executor, verifier, reviewer, release-close and router over their ceilings at the bytes WO-255-D030 recorded; the refuter stays under its ceiling.",
  "reopenWhen": "The release-surfaces check names a component this record does not, or a role root's cold start exceeds its ceiling by more than the planner sentence accounts for."
}
```

## WO-257-D008 — Step 3: the front page is the kit's default entry point, and core keeps its declared entry

```json
{
  "id": "WO-257-D008",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/lib/document-kinds.mjs names README.md as the kit's default entry point front-page with every line in scope, and entryPointNames reads a `How to start: <path>.` line as a link. Core's documents.json keeps its own front-page entry: readDocumentControl returns a declared entryPoints list in place of the defaults, so removing the entry would drop the page from core's entry points, while the default serves an export that declares no list.",
  "evidence": [
    "scripts/lib/document-kinds.mjs defaultEntryPoints, FRONT_PAGE_ENTRY_POINT, entryPointNames (the How-to-start pattern), readDocumentControl (entryPoints: control.entryPoints when declared)",
    "scripts/test-docs-check.mjs 'WO-257 the front page is a default entry point that may link a record, and a `How to start: <path>.` line in the instruction file counts as a link' (docs-check-fixtures)"
  ],
  "rejected": [
    {
      "option": "Remove core's documents.json front-page entry as redundant",
      "reason": "A declared entryPoints list replaces the defaults; core declares the list, so the entry is the override the default would otherwise supply."
    }
  ],
  "reopenWhen": "A declared list is merged with the defaults, or an instance that declares a list without the front page is red-tagged for it again."
}
```

## WO-257-D009 — Step 4: the Read before upgrading lines are derived from the release's changed files; the no-observed-tag remedy follows the page

```json
{
  "id": "WO-257-D009",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/release.mjs criticalNotes derives the Read before upgrading lines from the release's changed files: a change to a generated page's renderer, named in the explicit table GENERATED_PAGE_RENDERERS (the writer script, the module that renders its page and every kit module whose render or format function one of them imports, transitively: scripts/work-orders.mjs with scripts/lib/criteria-status.mjs, scripts/lib/control-actor.mjs and scripts/lib/duration.mjs; scripts/meta.mjs with scripts/lib/meta.mjs, scripts/lib/duration.mjs and scripts/lib/target-record-reader.mjs; scripts/lineage.mjs; scripts/siblings.mjs, which renders the registry itself; the release-preparation test derives that closure from the sources and pins the table), names in one line every changed renderer, a renderer two pages share once, and the regeneration commands to run after the merge before the next document gate reads the pages; a change to the settings emitter criterion 17 names (packages/compiler/src/harness.ts, SETTINGS_EMITTER) or to the committed emitted settings (.claude/settings.json, EMITTED_SETTINGS) names the re-emit and a new session (D022); and a release changing neither adds no line, the derived block carrying its standing source-only line alone (round 1's criteria F6 and F9, design F4, consistency F4 and F10; round 2's criteria F1 and design F1 withdrew round 1's import-closure walk, which printed renderer lines for helpers that render no page, and round 2's consistency F1 keyed the settings line on both triggers); scripts/lib/release-notes.mjs renders the lines it is given. FUP-3c371de4deb7c876 (WO-245-D010) is taken in the same family: scripts/lib/release-preparation.mjs's no-observed-tag remedy names only the heading for a kit root whose README carries no release block, since that root holds no claim to assign, and the heading and README claim elsewhere.",
  "evidence": [
    "scripts/release.mjs GENERATED_PAGE_RENDERERS, SETTINGS_EMITTER, EMITTED_SETTINGS, criticalNotes; scripts/test-release-preparation.mjs 'WO-257 the derived Read before upgrading notices name a generated page's regeneration and the new session an emitted-settings change needs' and the WO-245-D010 remedy case (release-preparation)",
    "scripts/lib/release-preparation.mjs: the remedy's two forms; docs/product/07-execution-guide.md §Workflow closeout and releases states the derivation"
  ],
  "rejected": [
    {
      "option": "Decide the regeneration line from the generated page's own diff",
      "reason": "The page is regenerated after the merge, so at preparation its bytes are current; the renderer's change is the fact the release knows."
    }
  ],
  "reopenWhen": "A page's text starts to come from a function named outside the render or format families the pin reads, or an instance's document gate reads a page before the named command ran."
}
```

## WO-257-D010 — Step 5: the entropy receipt renders the frozen copy under the temporary placeholder, labels the witness, names the confinement and screens its texts before filing

```json
{
  "id": "WO-257-D010",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/lib/entropy-review.mjs renders the frozen copy's Repository line as <tmp>/… (publicTemporaryPath, recorded under confinement.frozenCopy, since the subject keeps the protocol's exact keys the refuter revalidates), labels a target subject's launchpad tree as the planning branch in progress (labelledLaunchpad, witness planning-branch), names the uninstalled copy (dependenciesSentence, confinement.uninstalled) and the unobserved host coordination (confinement.hostCoordination: unobserved) in the confinement sentences, and screens the worker's summary and the receipt's Markdown before the pair is filed: screenWorkerText rewrites the launchpad checkout, the system temporary directory and a home directory to <worktree>, <tmp> and <home> (recorded under publicProjection.rewrittenTexts), and a path none covers refuses naming the text and its line, retains the rejected result at the lane the refusal prints (retainOriginal) and lets the same command refile once the text is corrected; fileReceipt screens the .md and the .json before writing. Every new sentence is gated on its new payload field, so the receipts filed before this order re-render byte for byte.",
  "evidence": [
    "scripts/lib/entropy-review.mjs publicTemporaryPath, labelledLaunchpad, dependenciesSentence, witnessSentence, screenWorkerText, retainOriginal, fileReceipt; scripts/lib/private-paths.mjs privatePathLines and withoutHomeDirectories (the Markdown rule refuses /Users, /home, /var/folders and /tmp paths; records refuse home paths only)",
    "scripts/test-entropy-review.mjs 'WO-257 criterion 5: a target-subject receipt renders the frozen copy as <tmp>/…, labels the launchpad witness, names an uninstalled copy and unobserved host coordination, refuses a stray private path naming the line, and refiles from the retained original with its placeholders' (plan-refutation)",
    "the committed receipts re-render unchanged under checkEntropyReceipts, which the entropy check runs over the pair's receiptHash and renderedHash"
  ],
  "rejected": [
    {
      "option": "Exempt private paths in a receipt's baseline",
      "reason": "The order's non-goal; the receipt is published with the repository."
    },
    {
      "option": "Rewrite the summary silently",
      "reason": "A rewrite is recorded under publicProjection so the pair says what changed."
    }
  ],
  "reopenWhen": "A receipt names a private path the three placeholders do not cover, or a refiled projection fails the pair's hash binding."
}
```

## WO-257-D011 — Step 6: one provenance line per filed record, and the move map stays

```json
{
  "id": "WO-257-D011",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/lib/target-records.mjs ends every record it files into a target with one line, 'Filed from the launchpad <release display name> at commit <HEAD>, where this record is <path>; its relative links resolve there, not in this repository.', hashes the filed bytes into the TargetRecordsCommitted rows and recognizes the line's prefix when a records-only commit is removed. The launchpad is named by its release display name (release.displayName; an unset name is DotLn, the kit's name, and the filing prints an advisory naming the declaration to make), never by its address, since a target may be public while the launchpad is private. The footer claims the launchpad tree's layout, not that the record's bytes are committed there: its commit is the launchpad HEAD when the operation began, kept in the pending operation's binding (launchpadCommit) so a retried filing writes the same bytes, and the removal of the moved sources rebuilds the filed bytes from that commit and the source without reading the target worktree. The private-terms and private-path screens read the source bytes and the display name (its own surface, since the instance's configuration writes it into every filed record); the record's own path and the commit are the kit's frame, as the release-notes renderer's address and path are not reviewed (round 1's criteria F3 and F4, design F4 and F7). FUP-712bb6562937332a (WO-238-D036) is decided: moved records' links are not rewritten and the move map stays; the footer tells a reader where every relative link resolves, which answers the fork's item 6 without changing a record byte above the line.",
  "evidence": [
    "scripts/lib/target-records.mjs: the footer, movedSources carrying path, filedWithFooter in removeMovedTargetRecords, resolveGitHubPushTarget for the repository name",
    "scripts/test-target-worktree-publish.mjs: a record filed into the target fixture ends with the line naming the launchpad repository, the recorded commit and the record's path (target-worktree)"
  ],
  "rejected": [
    {
      "option": "Rewrite each relative link absolute to the launchpad",
      "reason": "The order's non-goal and WO-238-D036's reason: 322 links in moved records, each a record byte."
    }
  ],
  "reopenWhen": "A reader of a moved record still cannot find where its links resolve, or a target's outward lint refuses the footer's words."
}
```

## WO-257-D012 — Step 7: the continuation gate reads product 00 as optional

```json
{
  "id": "WO-257-D012",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/lib/plan-continuation.mjs relocatedLinks reads product 00 and the map through an optional reader: both absent yields no updates and one absent keeps the continuation's refusal, so an export without product 00 passes plan check between an order change and its receipt.",
  "evidence": [
    "scripts/lib/plan-continuation.mjs relocatedLinks optional()",
    "scripts/test-launchpad-planning.mjs: the export fixture without product 00 passes npm run plan -- check between an order change (WO-001's label) and the receipt (launchpad-planning)"
  ],
  "rejected": [
    {
      "option": "Keep product 00 required by the continuation gate",
      "reason": "An export need not carry the thesis page; the subject builder already reads it as optional."
    }
  ],
  "reopenWhen": "An export carries one of the two pages and plan check refuses it for the other."
}
```

## WO-257-D013 — Step 8: the index shows an executor-unmet criterion by its later judgment with the executor's ordinal beside it

```json
{
  "id": "WO-257-D013",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/lib/criteria-status.mjs renders the index card's criteria line and the resume projection's from one judgment: a criterion the handoff left unmet shows its later criterion-level judgment (met by VER-NNN, unmet, waived by ordinal N, or defective (<class>) by ordinal N) with the executor's ordinal beside it, and a criterion with no later judgment keeps the form 'recorded unmet by the executor at ordinal N', so no accepted unmet history is erased.",
  "evidence": [
    "scripts/lib/criteria-status.mjs criteriaJudgments, renderCriteriaStatus; scripts/work-orders.mjs (the card line) and scripts/resume.mjs (the projection) call it",
    "scripts/test-work-orders.mjs 'WO-257 criterion 8: the index shows an executor-unmet criterion by its later judgment with the executor's ordinal beside it, and as the current state only while no later judgment exists' (work-orders-fixtures)"
  ],
  "rejected": [
    {
      "option": "Show the latest judgment only",
      "reason": "The criteria adversary's F10 of 2026-11-04: the executor's record is accepted history."
    }
  ],
  "reopenWhen": "A verdict form outside the four appears, or the index and the projection disagree on a criterion."
}
```

## WO-257-D014 — Step 9: bootstrap diagnoses a registered target with no clone mapping before any check fails

```json
{
  "id": "WO-257-D014",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/bootstrap.mjs prints, before its preparation steps, one line per registered target with no clone recorded in docs/control/local/repository-clones.json, naming the refusal the gates would print (recorded target clone unavailable) and the registration command node scripts/worktree.mjs clone <id> <absolute path to its clone> (missingTargetClones).",
  "evidence": [
    "scripts/bootstrap.mjs missingTargetClones",
    "scripts/test-launchpad-export.mjs: a fixture clone with a registered target and no mapping prints the diagnostic before any check fails (launchpad)"
  ],
  "rejected": [
    {
      "option": "Refuse in bootstrap",
      "reason": "Bootstrap prepares a clone; the gates hold the refusal, and the diagnostic names the registration that clears it."
    }
  ],
  "reopenWhen": "A fresh clone fails docs-check on a missing mapping without the diagnostic."
}
```

## WO-257-D015 — Step 10: every classification declaration is counted before the value is read

```json
{
  "id": "WO-257-D015",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/release.mjs targetReleaseClassification counts every **Target release classification:** header first and refuses more than one naming each line, then validates the one value, read as the reader before this order read it (patch, minor or major at a word boundary after the label, across a line break as well, whatever follows), so a header admitted then stays admitted (round 2's criteria F2 withdrew round 1's whole-line reading, which had widened a refusal the order's classification sentence excludes; round 3's F2 withdrew round 2's first-word reading, which still refused five shapes main admitted; the repair round's F2 found the value on the line after the label, which main's reader admitted across the break, so the value is read by main's expression anchored at each counted label); WO-012-D008's follow-up FUP-2232a29f1061494f is taken.",
  "evidence": [
    "scripts/release.mjs targetReleaseClassification",
    "scripts/test-target-worktree-release.mjs 'WO-257 criterion 10: every classification declaration is counted before the sole value is read, so a valid header beside a malformed duplicate is refused naming both lines' and the three 'WO-257 criterion 10: a classification value followed by … is read as the reader before this order read it, so the count admits that header' cases (target-worktree)"
  ],
  "rejected": [
    {
      "option": "Keep the fork's two-count precheck in each instance profile",
      "reason": "The kit's own count is the protection; a profile precheck is a second copy of the rule."
    }
  ],
  "reopenWhen": "A malformed duplicate passes the count."
}
```

## WO-257-D016 — Step 11: the dispatch line is read past the host's elements, and an unknown leading element is journaled by name

```json
{
  "id": "WO-257-D016",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "packages/compiler/src/harness.ts harnessPromptLine returns the first content line after the host's elements: the slash command's five block elements skipped whole, a pasted_content wrapper's opening tag skipped with the text on its own line kept, then one fence and the blank lines; it returns the line, its index and the leading element's name, and operatorMessageClass journals an unclassified message's leadingElement when its first content line opens an element outside that set. The generated Codex hook embeds the same reader and harnessWorkerWords reads the same line. The cause is corrected in D002: the sessions' unclassified rows came from the wrapper, not the block.",
  "evidence": [
    "packages/compiler/src/harness.ts harnessPromptLine, operatorMessageClass; packages/compiler/test/harness.test.ts 'WO-257 the host's command block and its pasted-content wrapper are skipped before the dispatch line, an unknown leading element is reported by name, and the embedded reader agrees' (compiler)",
    "scripts/test-harness.mjs WO-226 table rows for the block, the wrapper, both before a resume line, prose after the block and a task-notification opening (harness-fixtures)"
  ],
  "rejected": [
    {
      "option": "Read the prefix from any line",
      "reason": "WO-226's quoted-example rule (D002)."
    }
  ],
  "reopenWhen": "A dispatch after this release journals unclassified with a known element before it, or the host changes a shape (the leadingElement field names it)."
}
```

## WO-257-D017 — Step 12: a brief past the ceiling is split into batches over more workers, and the ceiling is one constant in the helper

```json
{
  "id": "WO-257-D017",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/lib/review-worker.mjs bounds a round's documents by its base (the merge base, or the tree --since names: subjectDocuments; a --since tree since which no planning document changed falls back to the branch's base, so a fresh ladder over the branch's own tree reviews the whole branch), measures the brief and splits one past CHANGE_REVIEW_BRIEF_CEILING (400,000 characters) into batches of whole documents (planBatches), one worker per batch with a brief under the ceiling carrying the round's document index with batch numbers; the batch reports merge into the round's one report (mergeBatchResults: findings keyed b<N>.<id>, the Items and Traced consumers tables merged first, each batch's body under its own heading); a batch returning no report records no merged report and names the batch; --dry-run prints the measured size, the ceiling and the batch plan; a document past the per-document cap stays a pointer to the checkout. The constant lives in the helper and names the protocol as its source because packages/skeleton/src/change-review-protocol.ts is a feedback-judged source whose change needs a live feedback episode: the protocol's check is unchanged and every batch brief passes it. FUP-6dfaa29e3f0ba4fd's ceiling half is taken (one named constant) and the budget minutes stay; the row's remainder, the budget and limits as instance configuration, is the follow-up below.",
  "evidence": [
    "scripts/lib/review-worker.mjs CHANGE_REVIEW_BRIEF_CEILING, subjectDocuments, planBatches, documentBlock, demoteHeadings, mergeBatchResults, renderReviewBrief, runChangeReview, renderReport; scripts/lib/review-worker-fake.mjs fixtures per launch",
    "scripts/test-review-worker.mjs 'WO-257 criterion 12: a planning brief past the ceiling is split into batches over more workers with one merged report, a --since round carries only the documents changed since that tree, a batch that returns no report records nothing, and the dry run prints the measured size, the ceiling and the batch plan' (plan-refutation)",
    "git diff -- packages/skeleton/src/change-review-protocol.ts is empty; npm run sync on 2026-11-06 reports feedback-evidence current"
  ],
  "rejected": [
    {
      "option": "Raise the ceiling",
      "reason": "The order's non-goal; a worker's context is the limit."
    },
    {
      "option": "Move the constant into the protocol and run a live feedback episode",
      "reason": "An episode for a constant's location is cost without a judged behavior change; the helper's value equals the protocol's and names it."
    }
  ],
  "followup": "Make the change review's budget (about 30 minutes and 120 tool calls, the 60-minute hard limit), its brief ceiling and its per-document cap instance configuration read from docs/control/budgets.json with the kit's values as defaults, so an operator can size one instance's reviews; the ceiling half of FUP-6dfaa29e3f0ba4fd is taken by WO-257-D017.",
  "reopenWhen": "An operator needs a different review budget for one instance, or a batch brief fails the protocol's check."
}
```

## WO-257-D018 — Step 13: a separate-track workstream's open members are in the judged subject

```json
{
  "id": "WO-257-D018",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/lib/plan-subject.mjs lists, after the sequenced orders, the open members of each track: separate workstream in member order (separateTrackMembers), excluding a closed member and the orders of a workstream without that track; the receipt files them under subject.orders and amendPlanOrder admits them as any judged order, since it reads the receipt's subject.",
  "evidence": [
    "scripts/lib/plan-subject.mjs separateTrackMembers, judged; scripts/lib/plan-receipts.mjs amendPlanOrder unchanged (it reads subject.orders)",
    "scripts/test-plan-refutation.mjs 'WO-257 criterion 13: the open members of a track: separate workstream follow the sequenced orders in the judged subject, the receipt lists them and amend-order admits one; a closed member and a workstream without the track add nothing' (plan-refutation)"
  ],
  "rejected": [
    {
      "option": "A --workstream flag on plan refute",
      "reason": "The order's non-goal; the subject lists the members without an operator flag."
    }
  ],
  "reopenWhen": "A member's sequence entry and its workstream disagree, or a closed member is judged."
}
```

## WO-257-D019 — Step 14: a standing rule's message row is read from the retained lanes too

```json
{
  "id": "WO-257-D019",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/lib/planning-document.mjs checkRulesRecorded reads a rule's message row from the live journal directory and from the retained lanes docs/control/local/retained/WO-NNN/harness/ in this checkout and in main's worktree (journalPlaces), with or without `order` naming the lane; a rule whose row is in no journal is refused naming the live directory and the retained lanes read.",
  "evidence": [
    "scripts/lib/planning-document.mjs journalFileRows, journalPlaces, the refusal text",
    "scripts/test-plan-refutation.mjs rules-recorded case: a row planted only in a retained lane is admitted with and without order, and the refusal names the places read (plan-refutation)"
  ],
  "rejected": [
    {
      "option": "Require order to name the retained lane",
      "reason": "The lane is found from the row; naming it is admitted, not required."
    }
  ],
  "reopenWhen": "A retained lane moves, or a rule's row is read from a journal the operator did not write."
}
```

## WO-257-D020 — Step 15: the projection warning names its remedy, and status --refresh rewrites the file from the fold

```json
{
  "id": "WO-257-D020",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/resume.mjs: the warning names npm run resume -- status --refresh; status --refresh rewrites docs/control/current.md from the fold, appends no control event and prints the same status; the projection's criteria line comes from renderCriteriaStatus (D013).",
  "evidence": [
    "scripts/resume.mjs warnIfProjectionDisagrees, status --refresh, the usage line",
    "scripts/test-resume.sh: current.md edited away from the fold warns naming the command; --refresh rewrites it, appends no event and prints the same status; the next status prints no warning (resume)"
  ],
  "rejected": [
    {
      "option": "Rewrite the projection on every status",
      "reason": "Both status forms are read-only; the rewrite is the operator's named command."
    }
  ],
  "reopenWhen": "The refresh appends an event, or a status form still names no remedy."
}
```

## WO-257-D021 — Step 16: the front page may link a record

```json
{
  "id": "WO-257-D021",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "scripts/lib/document-kinds.mjs documentReport excludes the front page from the records-named refusal: README.md may link a decision record, and the same link from the instruction file's Start here still fails naming the record.",
  "evidence": [
    "scripts/lib/document-kinds.mjs documentReport, the recordsNamed filter on FRONT_PAGE_ENTRY_POINT",
    "scripts/test-docs-check.mjs 'WO-257 the front page is a default entry point that may link a record, and a `How to start: <path>.` line in the instruction file counts as a link' (docs-check-fixtures)"
  ],
  "rejected": [
    {
      "option": "Admit record links from every entry point",
      "reason": "Entry points name standing documents; the front page is the one reader-facing page that shows the repository's state."
    }
  ],
  "reopenWhen": "A reader entry point other than the front page needs a record link."
}
```

## WO-257-D022 — Step 17: the target publish helper's allow rule, and the new-session line

```json
{
  "id": "WO-257-D022",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "packages/compiler/src/harness.ts PUBLISH_HELPER_ALLOW_RULES carries Bash(node scripts/worktree.mjs publish *) beside WO-246's two rules; the emitted .claude/settings.json and the Copilot settings file carry it; scripts/release.mjs criticalNotes prints, when the settings emitter or the committed emitted .claude/settings.json changed (D009), the line naming node scripts/harness.mjs emit and a new session, since the host reads the emitted settings when a session starts.",
  "evidence": [
    "packages/compiler/src/harness.ts PUBLISH_HELPER_ALLOW_RULES; .claude/settings.json and the Copilot settings regenerated by npm run sync, which reports harness current",
    "scripts/test-harness.mjs allow-list case 'three publish helpers' (harness-fixtures); scripts/test-release-preparation.mjs criticalNotes case (release-preparation)"
  ],
  "rejected": [
    {
      "option": "An allow rule for git push or gh",
      "reason": "The order's non-goal."
    }
  ],
  "reopenWhen": "The host re-reads settings mid-session, or the publish helper's argv changes."
}
```

## WO-257-D023 — Step 18: the front page's Map and Try it

```json
{
  "id": "WO-257-D023",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "README.md's Map links docs/README.md and Try it names the public starter with the two routes to start from it, each counted line one sentence of Markdown prose without raw HTML, under this order's **Front page:** declaration; FUP-78158140c6ac12aa (WO-254-D045) is taken.",
  "evidence": [
    "README.md Map and Try it; npm run test:docs's front-page check under the declaration and npm run plan -- documents, recorded in the handoff"
  ],
  "rejected": [
    {
      "option": "Raw HTML in Try it",
      "reason": "The front-page check counts prose lines; the budget is in sentences."
    }
  ],
  "reopenWhen": "The starter's location or its routes change."
}
```

## WO-257-D024 — FUP-1116ba845c557862: product 07's records-branch sentence states the release block

```json
{
  "id": "WO-257-D024",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "Product 07 §Workflow closeout and releases' records-branch sentence states the release block as built: the version is assigned to the heading in every root, the README claim only where the README carries a release block, and a kit root without the markers carries no claim, reported as not carried (taken in step 19).",
  "evidence": [
    "docs/product/07-execution-guide.md, the records-branch sentence; scripts/lib/release-preparation.mjs reads the markers (D009)"
  ],
  "rejected": [
    {
      "option": "Leave the sentence to the next planning pass",
      "reason": "The follow-up was allocated here; the sentence's file is product 07, this order's write-back."
    }
  ],
  "reopenWhen": "The release block's markers change."
}
```

## WO-257-D025 — FUP-3d64b267a45d2f34: the legacy tinkerer-economy overlay route is retired

```json
{
  "id": "WO-257-D025",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "The build overlay's tinkerer-economy choice, accepted with a migration advisory through kit release v0.118.0 (the last release before this one; the advisory still printed there), is refused from v0.119.0: scripts/lib/features.mjs refuses an overlay naming tinkerer-economy in equip or unequip from readFeatures and readFeatureInventory, and scripts/lib/harness.mjs refuses it from the emit and the check, each naming the election features.tinkerer-economy and the entry to remove; the programmatic supports a caller passes keep carrying the switch for the compiler's settings. The kit guide's overlay example unequips process-cost only and §Features states the retirement (taken with step 19's kit-guide write-back, the follow-up's document).",
  "evidence": [
    "scripts/lib/features.mjs RETIRED_OVERLAY_TINKERER, refuseRetiredOverlay; scripts/lib/harness.mjs, the overlay refusal before the switches are applied",
    "scripts/test-features.mjs inventory case: features.tinkerer-economy off with its note is rendered, the overlay's unequip and equip are both refused, a process-cost overlay is admitted (configuration-root, which imports it); scripts/test-harness.mjs 'WO-257 an overlay naming tinkerer-economy is refused with the election's route' and the WO-076 two-unequips case now unequipping process-cost (harness-fixtures)",
    "docs/KIT.md §Features and the overlay example"
  ],
  "rejected": [
    {
      "option": "Keep accepting the overlay with the advisory",
      "reason": "WO-241-D016 named this release for the retirement; the advisory printed twice per emit and the kit guide's own example used the retired route."
    }
  ],
  "reopenWhen": "An instance's overlay still names tinkerer-economy after the update; the refusal names the edit."
}
```

## WO-257-D026 — FUP-a9efc000150d7e9f: a target order's records publication carries its criterion-record lines

```json
{
  "id": "WO-257-D026",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "criterionRecordsApply in scripts/lib/github-body.mjs applies in every repository with a process meter: a target order's records publication body carries the record's criterion lines, written by hand as its last block since release preparation writes nothing for a target order; the refusal, worktree publish's remedy (Add, Remove or Restore the lines), the pass refusal and the stored-body hint say so for a target order; an unmetered repository's body still names none. Product 07's criterion-record paragraph states it (taken with step 1, the pull-request body's family).",
  "evidence": [
    "scripts/lib/github-body.mjs criterionRecordsApply, criterionRecordRefusal; scripts/worktree.mjs, the publish remedy; scripts/resume.mjs storedBodyHint and the pass refusal; docs/product/07-execution-guide.md, the criterion-record paragraph",
    "scripts/test-github-body.mjs, the target case (github-body); scripts/test-launchpad-planning.mjs, the target publish refusal naming the lines to remove (launchpad-planning); scripts/test-off-ramps.mjs, the unmetered wording (resume)"
  ],
  "rejected": [
    {
      "option": "Keep a target order's body free of criterion lines",
      "reason": "WO-249-D012's reason was that preparation writes none; the reviewer's reader needs the record on the body as much as a launchpad order's."
    }
  ],
  "reopenWhen": "A target order's publication names a criterion line its record does not hold, or preparation starts writing a target body."
}
```

## WO-257-D027 — FUP-b40bcf1b69c77008: the registry leaves features.mjs so the configuration reader imports no elections reader

```json
{
  "id": "WO-257-D027",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "The feature registry, aliases and resolver live in scripts/lib/feature-registry.mjs, which imports no configuration reader; scripts/lib/config.mjs validates a declared features section through it, scripts/lib/features.mjs reads the elections through it and re-exports the three names, scripts/harness.mjs, scripts/lib/harness.mjs and packages/skeleton/src/harness-host.ts import readFeatures from features.mjs, config.mjs no longer re-exports it, and the emit closure and the evidence-import exclusions name the new module. The build-overlay reader is unchanged.",
  "evidence": [
    "scripts/lib/feature-registry.mjs; the imports of scripts/lib/config.mjs, scripts/lib/features.mjs, scripts/harness.mjs, scripts/lib/harness.mjs and packages/skeleton/src/harness-host.ts; scripts/launchpad.mjs EMIT_CLOSURE",
    "scripts/lib/evidence-sources.mjs evidenceImportExclusions: the authority, artifact, verification, feedback and harness editions refused the unregistered import until the exclusion was recorded; npm run sync then reports every edition current",
    "scripts/test-configuration-root.mjs and scripts/test-features.mjs import readFeatures from features.mjs (configuration-root)"
  ],
  "rejected": [
    {
      "option": "Register feature-registry.mjs as an evidence source",
      "reason": "It would change five editions' registered inputs for a module whose rows the features fixtures judge; the exclusion keeps the editions' evidence as recorded."
    }
  ],
  "reopenWhen": "A module imports config.mjs and features.mjs in a cycle again; the evidence import check names it."
}
```

## WO-257-D028 — Operator direction: round 1 runs six reviewers, three on Claude and three on Codex

```json
{
  "id": "WO-257-D028",
  "date": "2026-11-06",
  "dispatch": "resume: next; the operator's message of 2026-11-06T04:56:08Z (journal row digest a52b247ba7a8520889ada6e44b856d3290c02c4aa33b18f81e87c6c204d01006, 58 bytes)",
  "decision": "Round 1 of the review ladder runs six reviewers: the criteria, design and consistency kinds each by a Claude dotln-worker (claude-opus-5-5, xhigh) through the Agent tool and by a Codex dotln-worker-astra (gpt-6-astra, max) through npm run worker -- review --host codex --model astra --order WO-257; every launch counts against subagentCap 20. The kit's ladder is unchanged: the direction holds for this order's round 1, and later rounds follow the executor root.",
  "evidence": [
    "the operator's words: use 6x reviewers initially -- 3x opus 5.5 and 3x gpt astra",
    "docs/control/local/harness/e5ea1568….jsonl, the OperatorMessageObserved row at 2026-11-06T04:56:08.314Z"
  ],
  "rejected": [
    {
      "option": "Three reviewers, the kit's ladder",
      "reason": "The operator's direction for this order's round 1 is explicit; the kit default is unchanged."
    }
  ],
  "reopenWhen": "The operator directs a different ladder, or the six reports disagree in a way the rounds cannot resolve."
}
```

## WO-257-D029 — Operator follow-up: an instance election for taking upstream in a pass

```json
{
  "id": "WO-257-D029",
  "date": "2026-11-06",
  "dispatch": "resume: next; the operator's message of 2026-11-06T05:16:18Z (journal row digest ff293fe9f5cebca26d4252b4341462273b40ba24fd52aa46d1be5d6f4d93498f, 110 bytes)",
  "decision": "Not taken here: the operator asked for a dotln.config.json property under which an instance auto-merges upstream (takes a newer starter release or merges upstream in a pass without the in-session request D005 types) and named it a follow-up. This order's non-goals exclude a feature election for updates before a pass and D005 keeps the typed refusal as the default; the follow-up is recorded for the next planning pass.",
  "evidence": [
    "the operator's words: we can add this as a follow up, but it would make sense to have auto merge upstream as a dotln config property",
    "docs/work-orders/WO-257-instance-returns-of-2026-11-03.md, Non-goals: a feature election for updates before a pass"
  ],
  "followup": "Add a features row (for example features.auto-update-upstream, off by default) under which a planning or entropy pass may take a newer starter release or merge upstream without the operator's in-session request, recording the election in the update's journal row and sibling receipt where D005 records the capture hash, and keeping D005's refusal as the default; the operator asked for it on 2026-11-06 as a dotln.config.json property.",
  "rejected": [
    {
      "option": "Take the election in this order",
      "reason": "The order's non-goal; the operator named it a follow-up."
    }
  ],
  "reopenWhen": "The next planning pass allocates the election, or the operator withdraws it."
}
```

## WO-257-D030 — Step 20: the paste-ready block for the fork's next pass

The fork pastes this block into its next pass's capture:

```markdown
Returns of 2026-11-03 to 2026-11-05, answered by core's WO-257 (kit v0.119.0).

First: take v0.119.0 by the operator's request. Under a journaled planning dispatch, `node scripts/launchpad.mjs update --finish` refuses unless the operator asks in that session; record the request with `--operator-request --capture <ignored intake file> --capture-hash sha256:<digest>` (step 2). Strike the instance's standing rule that a pass takes the starter first: the kit's planner sentence now carries the rule the other way. After the merge, run `npm run work-orders -- index` before the next document gate (the release's Read before upgrading line, step 4), re-emit with `node scripts/harness.mjs emit` and start a new session (step 17).

First block (starter v0.112.0):
- Item 2 (the finish fetch's alternates): WO-246's, not here.
- Item 4 (a launch-boundary meter): declined as a candidate; reopen if a second instance order overruns a declared stop.
- Items 5, 7, 8 and 9 (the receipt): step 5. The frozen copy renders as `<tmp>/…`; the summary and the Markdown are screened before filing, a refused text is named with its line and the same command refiles once it is corrected; a target subject's launchpad tree is labelled the planning branch in progress; the confinement sentences name the uninstalled copy and the unobserved host coordination.
- Item 6 (executor-unmet criteria on closed orders): step 8. The index card shows the later judgment with the executor's ordinal beside it.
- Item 7 (a fresh clone without the clone mapping): step 9. Bootstrap prints the diagnostic naming `node scripts/worktree.mjs clone <id> <absolute path>`.
- Item 8 (a malformed duplicate classification header): step 10. Every header is counted; a duplicate is refused naming both lines.

Second block (starter v0.113.0):
- Item 1 (the index card after a merge): step 4. The release names the regeneration.
- Item 3 (the finish's already-held skip): WO-246's.
- Item 4 (thirteen standing documents red-tagged): step 3. README.md is the kit's `front-page` default entry point; an instance that declares `documents.json` lists it there, since a declared list replaces the defaults; a `How to start: <path>.` line counts as a link.
- Item 6 (322 links in moved records): step 6. Each filed record ends with one line naming the launchpad repository, the commit and the path where its links resolve; the links are not rewritten.
- Item 10 (product 00 read by the continuation gate): step 7. Optional.
- Items 5, 7, 8 and 9: step 5, above.

2026-11-04 (starter v0.115.0):
- Item 3 (a front-page link to a record): step 16. Admitted for the front page only.
- Item 5 (the projection warning): step 15. The warning names `npm run resume -- status --refresh`, which rewrites `docs/control/current.md` from the fold and appends no event.
- Item 6 (separate-track members never judged): step 13. The open members of a `track: separate` workstream follow the sequenced orders in the judged subject and are amendable through `amend-order`.

2026-11-05 (starter v0.117.0):
- Item 2 (the target publish helper denied): step 17. `Bash(node scripts/worktree.mjs publish *)` is emitted.
- Item 3 (the record route's host, model, effort and tree): WO-255-D006, v0.118.0.
- Item 4 (separate-track members): step 13.
- Item 5 (the dispatch line behind the host's block): step 11. The reader skips the slash command's block and a pasted dispatch's wrapper; the unclassified rows came from the wrapper (core's WO-257-D002). A message whose first line opens another element is journaled with the element's name.
- Item 6 (a rule given to a closed order's verifier or reviewer): step 14. The plan check reads the retained lanes.
- Item 8 (a brief past the ceiling): step 12. A round's documents are bounded by its base, a brief past the ceiling is split into batches over more workers with one merged report, and no amendment is withdrawn to fit a reviewer.

Also in v0.119.0: the pull-request body's one comparison sentence (step 1); a target order's records publication carries its criterion-record lines by hand (WO-257-D026); the tinkerer-economy overlay choice is refused, elect `features.tinkerer-economy` (WO-257-D025).
```

```json
{
  "id": "WO-257-D030",
  "date": "2026-11-06",
  "dispatch": "resume: next",
  "decision": "The block above names, for the fork's next pass, each returned item's step in this order and its state at v0.119.0, the items of 2026-11-04 and 2026-11-05 included, the items not taken with their homes, and the three actions the fork's next pass takes first.",
  "evidence": [
    "the order's Observed gap sections and Known issues; D005 to D029"
  ],
  "rejected": [
    {
      "option": "A block per fork item in the fork's own words",
      "reason": "The fork's words are intake; the block names the step and the state the fork can check in the kit."
    }
  ],
  "reopenWhen": "The fork reports an item the block misnames."
}
```

## WO-257-D031 — Round 1 of the review ladder: six reports, the fixes made and the findings recorded

```json
{
  "id": "WO-257-D031",
  "date": "2026-11-06",
  "dispatch": "resume: next; review ladder round 1",
  "decision": "Round 1 ran six reviewers on tree 204af0165f27 against be65193081651565 (D028): three Claude dotln-worker agents (criteria 12 findings, 1 blocking; design 17, 0 blocking; consistency 12 as prose) recorded in the subject lane through the record route, and three Codex dotln-worker-astra launches (criteria 7, 6 blocking; design 5; consistency 3, 2 blocking) in the since-lane since-48cc35695eb3. Fixed: the planning subject's separate-track members read the control fold at the subject's revision through the index's own workstream parse, and a receipt filed under the earlier projection (no separateTrack key) is rebuilt by that rule (criteria F1 both hosts, design F1/F2 both hosts, design F6); a split round is recorded batch by batch through the record route (--batch N, the dry run printing every batch's full prompt), a completed batch is journaled when a later one fails, a prior finding a batch carried but did not judge is not held, merged ids stay within the recheck's bound, merged tables align by header name, a document past a batch's room becomes a pointer, and an untracked document counts only when the base tree lacks it (Claude criteria F4/F5, design F1/F2, Codex criteria F5/F6, design F3/F5, consistency F3); the provenance footer names the launchpad tree's layout by a commit kept in the pending operation, screens the display name as its own surface, prints an advisory for an unset name, and the removal rebuilds the filed bytes without the target worktree (criteria F3 both hosts, Codex criteria F4, design F4/F7); the entropy filing screens every string of the worker's output and the refuter's attempts, binds the returned result and statement by digest, names the retained lane and lists the rejected returns the refile corrects (criteria F8 both hosts, design F8); the regeneration lines key on the page writers' import closures and the settings line on the committed .claude/settings.json (criteria F6/F9, design F4, consistency F4/F10 both hosts); bootstrap resolves the clone mapping through the three places the gates read and names a mapping that does not parse (criteria F2, design F5, consistency F5); the prompt reader reports an unclosed known element by name and reads text after a same-line closing tag (design F3); the update hold's entropy case is tested and both dispatch families are named (criteria F7, consistency F6); the retired overlay's release is v0.118.0 and its text is one constant (consistency F7, design F15); the retained lane comes from the close's helper (design F12); product 00's optionality is its explicit absence (design F9); the ceiling is pinned against the protocol by a test (design F10, consistency F9); and the standing documents state the three publish helpers, the five default entry points with the front page's record admission, a target order's criterion lines, the no-update rule in product 07, the index card's criteria line, bootstrap's diagnostic, the read-only status forms beside --refresh, the playbook's remedy and the entropy README's new statements, with the decisions' cited titles made exact (consistency F1/F2/F3/F6/F8/F11/F12, Codex consistency F2, criteria F12).",
  "evidence": [
    "docs/control/local/reviews/WO-257/round-1-criteria.md, round-1-design.md, round-1-consistency.md (Claude, recorded from the Agent route) and since-48cc35695eb3/round-1-criteria.md, round-1-design.md, round-1-consistency.md (Codex)",
    "the changed files of the fix pass: scripts/lib/plan-subject.mjs, work-order-workstream.mjs, plan-receipts.mjs, review-worker.mjs, target-records.mjs, target-worktrees.mjs, target-record-reader.mjs, entropy-review.mjs, planning-document.mjs, plan-continuation.mjs, features.mjs, harness.mjs, scripts/release.mjs, scripts/bootstrap.mjs, packages/compiler/src/harness.ts and their tests; docs/KIT.md, docs/product/07-execution-guide.md, docs/product/08-publication-compiler.md, docs/AI-HARNESS-SECURITY.md, docs/PLAYBOOK.md, docs/instance/entropy-reducer/README.md"
  ],
  "rejected": [
    {
      "option": "Fold the Codex reports' findings into the Claude rechecks only",
      "reason": "Each finding was fixed or recorded on its own; round 2's rechecks confirm the fixes of the Claude findings by their ids, and the Codex findings' fixes are covered by the same whole-change review."
    },
    {
      "option": "Run six reviewers in every round",
      "reason": "The operator's direction names round 1 (initially); later rounds follow the executor root (D028)."
    }
  ],
  "reopenWhen": "Round 2 refutes a fix named here, or the complete run fails on one of these changes."
}
```

## WO-257-D032 — Round 1, recorded and not fixed

```json
{
  "id": "WO-257-D032",
  "date": "2026-11-06",
  "dispatch": "resume: next; review ladder round 1",
  "decision": "Recorded without a change: the journal path and JSONL read helpers duplicated across modules (Claude design F11: a shared dispatch-journal helper is a refactor across five readers, outside this order's bounded fixes); the record admission keyed on the front-page id rather than a declared entry-point attribute (design F13: the id is the kit's default and an instance's declared list names it under that id, as the kit guide now says); runChangeReview's size and the three meanings of brief (design F14: the batch planning is now one function, planRoundBriefs; the renaming is left to a maintenance pass); the receipt's five render switches and the confinement tail copied into both filings (design F16: a render version field would change the pair's hashing rule, which the historical receipts' byte-exact re-rendering pins); the criterion-record remedy branched in four places (design F17); the per-document pointer and the one-worker launch asserted only by a dry run (Claude criteria F10: the pointer is now asserted through a batch's room, and the one-worker launch through the record route's single-batch path); the generated Codex hook tested through a reconstruction of its reader (criteria F11: the emitted hook and the reader are held equal by harness check, and test-codex-continuation.mjs feeds the compiler's classifier, not the file); and the Claude consistency report, recorded as prose with no findings object a recheck can name (its findings are rechecked by the re-tasked worker that wrote them).",
  "evidence": [
    "docs/control/local/reviews/WO-257/round-1-design.md F11, F13, F14, F16, F17; round-1-criteria.md F10, F11; round-1-consistency.md (prose)"
  ],
  "rejected": [
    {
      "option": "Fix every note in this pass",
      "reason": "Each is a maintenance refactor or a test of an equivalence already held by a check; the order's bounded fixes and criteria are the scope."
    }
  ],
  "reopenWhen": "A later order touches the journal readers, the entry-point contract or the receipt renderer, or a recheck needs the consistency findings by id."
}
```

## WO-257-D033 — Two refusals widen in v0.119.0 beside the order's classification sentence

```json
{
  "id": "WO-257-D033",
  "date": "2026-11-06",
  "dispatch": "resume: next; review ladder round 1",
  "decision": "The order's release classification says no refusal widens; two do, each named by the Claude consistency reviewer (F7): an overlay naming tinkerer-economy now refuses the emit, the check and the elections read (D025), and a target release classification header with trailing text, admitted by the earlier regex, is refused by the whole-line count (D015). Neither triggers a derived Read before upgrading line; the final reviewer carries a reviewer-authored Read before upgrading item for both, and the fork's block (D030) carries the overlay change. The classification stays minor: both refusals name their remedy, and no instance record is edited by hand.",
  "evidence": [
    "docs/work-orders/WO-257-instance-returns-of-2026-11-03.md, the Release classification sentence; scripts/lib/features.mjs RETIRED_OVERLAY_TINKERER; scripts/release.mjs targetReleaseClassification",
    "git grep over the repository's orders and fixtures finds no trailing-text classification header (the consistency reviewer's search, 2026-11-06)"
  ],
  "rejected": [
    {
      "option": "Keep the earlier regex for the classification value",
      "reason": "The fork's item 8 and WO-012-D008 ask for the whole line to be counted; a trailing note is a malformed header, not a value."
    }
  ],
  "reopenWhen": "An instance reports either refusal on a record it cannot edit, or the final reviewer judges the classification major."
}
```

## WO-257-D034 — Round 2: renderers named by table in one line, the settings line keyed on both triggers, the classification value read as the first word, batch parts bound to their brief, the after side read at the current revision, and the linked-worktree test proving the lookup

```json
{
  "id": "WO-257-D034",
  "date": "2026-11-06",
  "dispatch": "resume: next; review ladder round 2",
  "decision": "Round 2 re-tasked the three Claude reviewers over the tree d40715b61b6d with their round-1 reports: design held 11 of 17 (F9 not held, five recorded under D032) and noted 2, criteria held 10 of 12 (F10 not held, F11 recorded under D032) and found 2, consistency found 11 of 12 fixed (F5 partially) and found 6. Fixed: the regeneration line names renderers from an explicit table (scripts/release.mjs GENERATED_PAGE_RENDERERS: each page's writer and the library module that renders it) in one line carrying every changed renderer and the union of the commands, so a helper a writer imports prints no line (criteria F1, design F1); the settings line keys on the emitter criterion 17 names and on the committed .claude/settings.json (SETTINGS_EMITTER, EMITTED_SETTINGS; consistency F1), and product 07 and D009 say so; the classification value is the first word after the label, as the reader before this order read it, so a note after the value stays admitted and the second refusal D033 recorded no longer widens (criteria F2; D015); a batch part is bound to the brief its worker received, a changed plan refusing by part number, and a merged refusal names the kept part (design F2); the continuation gate reads the after side's presence at the current revision through afterHas, never the judged revision's paths (design F9); the linked-worktree case commits the registration before the worktree is added and asserts the no-mapping diagnostic names the primary checkout (consistency F2); the pointer-through-room and untracked --since behaviours have regression cases (criteria F10 and F4), and the pointer case exposed that a split resolving to one batch with a pointer reused the whole brief, which carried the pointed document in full and was refused past the ceiling, so planRoundBriefs renders such a batch again; the focused run of the worktree-integration suite over the fixes found its fixture importing the feature reader from the archived HEAD entry point against the working-tree libraries (the emit the integration leaves pending), so scripts/test-worktree-integration.mjs overlays scripts/harness.mjs beside the eight entry points it already takes from the working tree, as its own comment asks; product 07 states the footer's screened display name and kept commit, the prompt reader's two further behaviours and the record synopsis's --batch N (consistency F3, F4, F6); the planner root names a journaled planning: or ideation: dispatch and a pending entropy review or refutation dispatch, re-minting both planner skills and the role oracle under D007 (consistency F5; the planner's cold start reads 30,780 bytes, 618 over WO-255's repair). Recorded, not fixed: design F11, F13, F14, F16 and F17 and criteria F11 stay as D032 records them. One refusal widens in v0.119.0, the retired overlay's (D025, D033); the final reviewer's Read before upgrading item covers it alone.",
  "evidence": [
    "docs/control/local/reviews/WO-257/round-2-design.md, round-2-criteria.md and round-2-consistency.md (recorded from the Agent route at tree d40715b61b6d68cd635b68b6ff722f5f9f790523)",
    "scripts/release.mjs GENERATED_PAGE_RENDERERS, SETTINGS_EMITTER, criticalNotes, targetReleaseClassification; scripts/test-release-preparation.mjs 'WO-257 the derived Read before upgrading notices name a generated page's regeneration and the new session an emitted-settings change needs' (release-preparation); scripts/test-target-worktree-release.mjs, the 'WO-257 criterion 10: a classification value followed by …' cases as they stand after the later rounds (target-worktree)",
    "scripts/lib/review-worker.mjs record route (the brief digest comparison and the merged refusal's kept part); scripts/test-review-worker.mjs 'WO-257 round 2: a document past the room a batch's captures leave is a pointer, and an untracked document unchanged since the named tree is left out' and the changed-plan refusal in 'WO-257 round 1: a split round is recorded batch by batch through the record route, a single report never stands for it, and the dry run prints every batch's prompt' (plan-refutation)",
    "scripts/lib/plan-continuation.mjs relocatedLinks afterHas; scripts/test-launchpad-export.mjs linked-worktree and no-mapping cases (launchpad); packages/skeleton/src/loadouts/contributor.ts planner root; packages/skeleton/fixtures/wo257-role-baseline.json re-minted, npm run sync reporting role-oracle current"
  ],
  "rejected": [
    {
      "option": "Keep the import-closure walk with an exclusion list of helper modules",
      "reason": "The exclusions would be the renderer table by another name, and a helper added later would print a line until excluded; the table names what renders a page."
    },
    {
      "option": "Keep the whole-line classification value",
      "reason": "It widened a refusal the order's classification sentence excludes, and the reader before this order admitted a note after the value; the count the order asks for stands without it."
    },
    {
      "option": "Record the planner root's wording as a residue",
      "reason": "D031 claims both dispatch families are named; the kit guide and product 07 name them, and the one re-mint is bookkeeping under D007."
    }
  ],
  "reopenWhen": "Round 3 reopens any of these, an instance reports a stale generated page with no regeneration line, or a target order's classification header is refused with a value main admitted."
}
```

## WO-257-D035 — Round 3: the renderer table closed over the functions that render page text and pinned, the classification value read as main read it, parts bound to the dry run's brief, and the committed after side tested

```json
{
  "id": "WO-257-D035",
  "date": "2026-11-06",
  "dispatch": "resume: next; review ladder round 3",
  "decision": "Round 3 launched one fresh combined worker (dotln-worker, claude-opus-5-5, xhigh; use 10 of 20) over the delta since the round-2 tree d40715b61b6d with the three round-2 reports and the three Codex round-1 reports as its rechecks: 17 of 19 held, design.2.F2 and consistency.1.F1 not held, and 5 findings (2 blocking). Fixed: the renderer table names a page's writer, the module that renders its page and every kit module whose render or format function one of them imports, transitively (scripts/lib/control-actor.mjs and scripts/lib/duration.mjs join the index's renderers, scripts/lib/duration.mjs and scripts/lib/target-record-reader.mjs the meta table's), a renderer two pages share is named once, and the release-preparation test derives that closure from the sources and pins the table (F1, consistency.1.F1); the classification value is read exactly as the reader before this order read it, patch, minor or major at a word boundary after the label whatever follows, with a word-boundary shape tested beside the note (F2, D015); the record route takes --brief-sha256 <digest> from the dry run and refuses a part whose plan moved since the prompts were made, and a merged refusal names every kept part (F3, design.2.F2; the kit guide and product 07 name the option); the round-2 test's title names what its body covers and D034 cites the batch case for the changed-plan refusal (F4); one afterPresence helper serves both continuation callers, afterHas is required, and the export fixture commits a product 00 after the receipt, removes it from the working tree and asserts the committed judgment refuses it as a changed input while the working-tree judgment sees none (F5). Every round-3 finding is fixed; the ladder ends here, and no reviewer runs after the complete run passes. The round-2 consistency report, recorded as prose, carries no finding ids a recheck can name, so round 3 judged its six findings through the combined consistency trace over the delta rather than by id.",
  "evidence": [
    "docs/control/local/reviews/WO-257/round-3-combined.md and .json (recorded from the Agent route at tree 459acde5d2bc5c400e7a487579c1fae0782788d4; 207,994 tokens, 16 min)",
    "scripts/release.mjs GENERATED_PAGE_RENDERERS, criticalNotes, targetReleaseClassification; scripts/test-release-preparation.mjs 'WO-257 the derived Read before upgrading notices name a generated page's regeneration and the new session an emitted-settings change needs' (release-preparation); scripts/test-target-worktree-release.mjs the two 'WO-257 criterion 10: a classification value followed by …' cases (target-worktree)",
    "scripts/lib/review-worker.mjs record route (--brief-sha256, the kept parts); scripts/test-review-worker.mjs 'WO-257 round 1: a split round is recorded batch by batch through the record route, a single report never stands for it, and the dry run prints every batch's prompt' and 'WO-257 round 2: a document past the room a batch's captures leave is a pointer, and an untracked document unchanged since the named tree is left out' (plan-refutation)",
    "scripts/lib/plan-continuation.mjs afterPresence, relocatedLinks; scripts/test-launchpad-planning.mjs criterion 7 block, the committed product 00 case (launchpad-planning)"
  ],
  "rejected": [
    {
      "option": "Derive the renderers at release preparation from the sources instead of a table",
      "reason": "The table is read where the reader looks and changes with a reviewed edit; the closure lives in the test, where a drift fails the gate instead of printing a surprising line."
    },
    {
      "option": "Record F3, F4 and F5 as residues",
      "reason": "Each fix is bounded and tested, and the ladder's last round leaves no later round to carry them."
    }
  ],
  "reopenWhen": "The complete run fails on a round-3 fix, or the final reviewer finds a page whose text comes from a function the pin's render and format families do not name."
}
```

## WO-257-D036 — The first complete run failed on a fixture list, the one-line repair took a combined round, and the renderer boundary closes here

```json
{
  "id": "WO-257-D036",
  "date": "2026-11-06",
  "dispatch": "resume: next; the first complete run and the repair ladder",
  "decision": "The first complete run (npm test -- --review at tree 45da23035b67, code identity 5cb7286054e9, 11 min, 68 fresh suites) failed on one suite, outward-lint's 'copied CLI runs with relocated documents and no default document tree', whose copied CLI names the kit modules by a fixed list that lacked scripts/lib/feature-registry.mjs; 33 suites were not started after it. The repair adds the module to that list, the fourth fixture list this order's feature split reached (configuration-root, harness-fixtures and dispatch-bound were found before the first run; a grep over every list that copies config.mjs or features.mjs finds no other). The repair diff is one line, so its ladder starts at round three: one combined worker (round 4 in the lane repair-1, use 11 of 20) read the change since the round-3 tree, round 3's fixes included, with the round-3 report as its rechecks: four held, combined.3.F5 not held, and 5 findings (2 blocking). Fixed: the renderer table also names the modules whose projected words or constants the pages carry (scripts/lib/dependencies.mjs and scripts/lib/work-order-workstream.mjs for the index, scripts/lib/siblings.mjs for the sibling index, scripts/features.mjs and scripts/lib/features.mjs for the inventory npm run meta rewrites), and the pin asserts the render and format closure sits inside the table rather than equalling it (F1); the classification value is read by main's expression anchored at each counted label, so a value on the line after the label stays admitted as main admitted it, with that shape tested (F2); a verified --brief-sha256 is kept in the record and product 07 names which dry-run digest to pass (F3); D034 cites the classification cases as they stand (F4); the committed-mode case now discriminates, a product 00 present at the receipt's revision and removed by a later commit refusing by the inventory message where the judged revision's paths would have thrown on the removed page (combined.3.F5). Recorded, not fixed: F5, the merged refusal that names every kept part has no fixture, because each part's report is judged by the same rule when it is recorded and the merged refusal is a second guard behind it. After this round no reviewer runs in this execution or repair; the executor judges the remaining delta, as product 07 §Review ladder says, and the loop the ladder warns of, each round reopening the boundary of a renderer, is closed by this record rather than another round.",
  "evidence": [
    "docs/control/local/harness/checks.json, the npm test row of 2026-11-06T14:19:51Z (exitCode 1, gateSelection review, freshSuites 68); the run's log in the session scratchpad; scripts/test-outward-lint.mjs 'copied CLI runs with relocated documents and no default document tree' (outward-lint)",
    "docs/control/local/reviews/WO-257/repair-1/round-4-combined.md and .json (recorded from the Agent route at tree 122cdd31759bc0ee1d9247c0de247040905064d1; 230,584 tokens, 16 min)",
    "scripts/release.mjs GENERATED_PAGE_RENDERERS and targetReleaseClassification; scripts/test-release-preparation.mjs 'WO-257 the derived Read before upgrading notices name a generated page's regeneration and the new session an emitted-settings change needs' (release-preparation); scripts/test-target-worktree-release.mjs, the four WO-257 criterion 10 cases (target-worktree); scripts/lib/review-worker.mjs recordAgentReview; scripts/test-launchpad-planning.mjs, the committed product 00 block (launchpad-planning)"
  ],
  "rejected": [
    {
      "option": "Classify every module in each writer's import closure as a renderer or a pinned exclusion with a reason",
      "reason": "It would make every later import under scripts/lib fail the gate until classified, a standing tax on orders that touch the kit's scripts; the follow-up below carries the design for a planning pass to weigh."
    },
    {
      "option": "Run a fifth round over the repair round's fixes",
      "reason": "Product 07 ends the ladder at the combined round; each round since round 2 reopened the same boundary with a new example, and the admission rule, not another reviewer, ends that."
    }
  ],
  "reopenWhen": "The second complete run fails on a repair-round fix, or the final reviewer finds a generated page whose text comes from a module the table does not name.",
  "followup": "Weigh an exhaustive classification of each page writer's import closure: every module either in the renderer table or in a pinned exclusion list with its reason, as scripts/lib/evidence-sources.mjs classifies evidence imports, so a new import fails the release-preparation test until someone names what it renders (the repair round's F1 of WO-257, combined review of 2026-11-06)."
}
```

## WO-257-D037 — The second complete run failed on the declared-cases pin, regenerated from the sources without a reviewer round

```json
{
  "id": "WO-257-D037",
  "date": "2026-11-06",
  "dispatch": "resume: next; the second complete run",
  "decision": "The second complete run (npm test -- --review from 2026-11-06T15:05:55Z, 26 min, 95 fresh tasks) failed on one case, runner-fixtures' 'target-worktree file tasks keep all declared cases and two independent deadlines at eight lanes', which pins the test declarations and registered names of the four target-worktree files against scripts/fixtures/target-worktree-cases.json; 11 suites were not started after it. The fixture is an expected-data record maintained by hand, and this order declared three cases it did not list: the publish file's 'WO-257 the provenance footer's display name is screened like the record bytes it joins, and an unset name is an advisory' and the release file's two WO-257 criterion 10 declarations, the second a loop registering three names. The repair regenerates the fixture by the test's own collection (the declaration expression and the stubbed registration import), adding exactly those three declarations and five names (86 to 89, 119 to 124) and removing none. The repair's diff is that regenerated record alone, so the ladder's skip for a round whose preceding change touches only regenerated files or test names applies and no reviewer ran over it; the handoff says so. A focused run of the runner-fixtures suite joins the executor's checks for an order that declares test cases in a file a pin records, since neither the first run nor the focused set of this order reached it.",
  "evidence": [
    "docs/control/local/harness/checks.json, the npm test row started 2026-11-06T15:05:55Z (exitCode 1); the run's log in the session scratchpad: 'not ok 232 … 89 !== 86'",
    "scripts/fixtures/target-worktree-cases.json regenerated on 2026-11-06 by a scratch copy of the test's collection; scripts/test-runner.test.mjs 'target-worktree file tasks keep all declared cases and two independent deadlines at eight lanes' passing under the bounded wrapper (runner-fixtures)",
    "scripts/fixtures/launchpad-cases.json, the sibling pin, passed in the same run: this order added no declaration to the launchpad files"
  ],
  "rejected": [
    {
      "option": "A combined review round over the regenerated fixture",
      "reason": "The diff is a record of names the test derives from the sources; product 07's ladder skips a round whose preceding change touches only regenerated files or test names, and a round would reread code the ladder already closed."
    }
  ],
  "reopenWhen": "The third complete run fails, or a later order's case declarations reach a pin this order's focused set did not name."
}
```

## WO-257-D038 — Verification finds two supported-input failures in the batch merger

```json
{
  "id": "WO-257-D038",
  "date": "2026-11-06",
  "dispatch": "resume: verify; be extra thorough",
  "decision": "Judge criterion 12 unmet and route the two batch-merge defects to this order's repair. The Items reader accepts Location in the subject/Disposition and Where/Status, but the merge matches literal header names and drops the second batch's cells. The merged-ID fallback maps both a valid 52-character first ID and the distinct second ID F1 to b1.F1. Preserve the implementation as the verifier's subject; the repair must preserve accepted table semantics and unique, recheckable finding identities. Consume the executor's passing complete gate at the unchanged code identity and add independent probes rather than treating the gate as proof of these untested combinations.",
  "evidence": [
    "docs/evidence/WO-257/ver-001/probes.mjs, F1 and F2, with the observed results in docs/evidence/WO-257/ver-001/evidence.md",
    "scripts/lib/review-worker.mjs: alignRow, mergedFindingId and mergeBatchResults; itemsTable accepts both header vocabularies",
    "packages/skeleton/src/change-review-protocol.ts: finding IDs are unique strings of up to 64 characters; prior finding IDs must also be unique",
    "docs/control/local/reviews/WO-257/round-3-combined.md had held the column-reordering and ID-length repairs; the verifier varied accepted header vocabulary and the collision between generated and retained IDs"
  ],
  "rejected": [
    {
      "option": "Pass because the complete review gate is green",
      "reason": "The independent fixtures reproduce failures of the required merge on inputs accepted by the existing readers and schema."
    },
    {
      "option": "Repair the merger during verification",
      "reason": "The verifier judges a fixed subject and writes evidence; implementation repair belongs to the next executor phase."
    }
  ],
  "reopenWhen": "The repair preserves every accepted table column's meaning, assigns collision-free finding IDs within the later recheck's length budget, and passes both independent reproductions plus the affected regression checks."
}
```

## WO-257-D039 — Retain the shared-preamble limit as a bounded follow-up

```json
{
  "id": "WO-257-D039",
  "date": "2026-11-06",
  "dispatch": "resume: verify; be extra thorough",
  "decision": "Record the large-capture limit as a follow-up, not a third blocking finding. Two individually admitted captures of 198,980 bytes each leave the fixed preamble, captures and index over 400,000 characters before a document can be added. planBatches deliberately refuses this case, which round 3 already noted. Criterion 12's document partitioning cannot make a fixed preamble smaller, so this observation is not evidence that its document-size guarantee failed. The repair remains focused on the two merge failures in D038.",
  "evidence": [
    "docs/evidence/WO-257/ver-001/probes.mjs, F3 observation; docs/evidence/WO-257/ver-001/evidence.md",
    "scripts/lib/review-worker.mjs: readCaptures admits repeated captures up to 200,000 bytes apiece; planBatches refuses when the fixed inputs alone fill the ceiling",
    "docs/control/local/reviews/WO-257/round-3-combined.md, criteria.1.F5 recheck, already identifies the fixed-input residue",
    "WO-257-D017 separately boards configurable review budgets and limits"
  ],
  "rejected": [
    {
      "option": "Raise the ceiling or remove part of the operator's dispatch",
      "reason": "The order preserves the context ceiling and the full subject; neither action follows from this verification."
    }
  ],
  "followup": "Define and document a full-input route for a planning review whose combined dispatch captures and shared index exceed the brief ceiling, including an aggregate preflight diagnostic and a fixture that preserves all captured messages; coordinate with the configurable-budget follow-up in WO-257-D017.",
  "reopenWhen": "An actual pass reaches the fixed-input limit, or the configurable-budget follow-up changes how captures and the shared index fit into a review."
}
```

## WO-257-D040 — Verification probe corrections and unavailable review evidence

```json
{
  "id": "WO-257-D040",
  "date": "2026-11-06",
  "dispatch": "resume: verify; be extra thorough",
  "decision": "Keep probe setup errors separate from subject failures. The initial direct invocation of test-work-orders.mjs omitted its owned temporary-root argument; its setup assertion is not a product regression. An ad hoc import driver also stopped before the selected case with ERR_INVALID_ARG_TYPE; the canonical scripts/test-work-orders.sh wrapper then passed all 36 cases, including criterion 8. The initial Items probe expected an absent refusal to be undefined, but the reader returns null; correct the assertion and retain only the subsequently reproduced merge failure as a finding. Some repository reads exceeded their output budget; inspect focused source ranges and select verdict-relevant fields for the durable evidence. The repair round's round-4-combined report cited by the executor was unavailable in the active or primary checkout's review and retained lanes; read every available report and independently inspect and probe the later changes, without claiming that missing report was read.",
  "evidence": [
    "docs/evidence/WO-257/ver-001/evidence.md records the corrected invocation and outcomes",
    "scripts/test-work-orders.mjs requires process.argv[2], an absolute physical root and .dotln-test-root-owner before registering its fixtures",
    "scripts/lib/review-worker.mjs: itemsTable returns refusal: null on a valid table",
    "The four path searches were docs/control/local/reviews/WO-257 and docs/control/local/retained/WO-257 in the selected worktree and in the primary checkout; none contained round-4-combined.md or its JSON record"
  ],
  "rejected": [
    {
      "option": "Count setup failures as implementation failures or repeat all product gates",
      "reason": "Neither would establish the disputed behavior; correct the probe contract and run the affected case."
    }
  ],
  "reopenWhen": "The missing report becomes available, or a corrected probe reveals a subject failure beyond those recorded in D038."
}
```

## WO-257-D041 — Preserve batch table semantics and unique finding identities

```json
{
  "id": "WO-257-D041",
  "date": "2026-11-06",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1 and F2 in the shared batch merger. Validation and merging now use the same required-column definitions for Items and Traced consumers; rows are aligned by semantic column, including accepted alternate headings, emphasis and reordered columns, while extra columns retain literal-name matching. Reserve every short batch-prefixed finding ID before allocating unused ordinal fallbacks for long IDs, leaving room for consistency.999. in a later recheck. Validate each merged result, both original and dispatch-screened, before either transport or recorded-part filing. Preserve the existing vocabulary, short identities, full batch bodies and public result schema. The no-op would keep two independently reproduced criterion-12 failures and is rejected. Goal-alignment traps are narrowing accepted inputs to hide the bug and expanding this repair into the separately boarded fixed-preamble limit; neither is needed to close the two findings.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern '^F[12]:' docs/evidence/WO-257/ver-001/probes.mjs: before the repair, both cases failed, F1 losing the second row's disposition and F2 producing duplicate b1.F1 IDs; after the repair, both pass, with b1.F2 and b1.F1 accepted by validation and the recheck",
    "scripts/test-review-worker.mjs: WO-257 repair case covers both transport and recorded-part routes, Items and Traced consumers, different accepted headings and column orders, an extra evidence column, multiple long IDs competing with short IDs before and after them, reuse across batches, final schema validation and an actual later review addressing every merged finding",
    "packages/skeleton/src/change-review-protocol.ts: finding IDs are unique, at most 64 characters; scripts/lib/review-worker.mjs readPrior adds kind and round when binding a later review",
    "VER-001 F3 and WO-257-D039 already record the fixed-preamble limit and its full-input follow-up; this repair changes neither the context ceiling nor the subject"
  ],
  "rejected": [
    {
      "option": "Require identical literal headings from every worker",
      "reason": "The validators already accept alternate headings and arbitrary column order; narrowing them would remove supported input instead of repairing the merger."
    },
    {
      "option": "Assign an ordinal fallback without reserving short IDs from later findings",
      "reason": "That repeats the verified collision class when a long ID appears before the short ID its fallback would take."
    }
  ],
  "reopenWhen": "A supported report loses a required column during merging, a merged ID is not unique or cannot be named by the later recheck, or either filing route bypasses final result validation."
}
```

## WO-257-D042 — Retain later criterion judgments and name the feature registry regeneration

```json
{
  "id": "WO-257-D042",
  "date": "2026-11-06",
  "dispatch": "resume: fix; independent review round 1",
  "decision": "Fix both distinct findings from the three independent Codex reviews of tree 8be6c3903449. Criteria C1 showed that a failed final review restored the executor's old unmet label despite the retained passing verification. The control fold now exposes the verification-completion ordinal, and criterion history compares it with each handoff ordinal. Thus an unrelated phase transition preserves the later judgment, while a fresh repair handoff cannot borrow the earlier pass. Caller-supplied projections without that derived ordinal retain the former phase interpretation. Consistency F1 showed that the new feature registry owns the words rendered into FEATURES.md but was absent from the release regeneration table. Add this known producer and its registry-only regression expectation. Design found no further defect and transferred its independently observed registry omission to consistency instead of duplicating it. No broader import-classification mechanism is added; D036's separate follow-up stays boarded.",
  "evidence": [
    "docs/control/local/reviews/WO-257/repair-3/round-1-criteria.md: C1, real control-fold probe of ImplementationReady(unmet), passing verification, and failed final review; the parent reproduced the same failure and subsequent pass with criteria-final-review-probe.mjs in session scratch",
    "docs/control/local/reviews/WO-257/repair-3/round-1-consistency.md: F1, feature-registry.mjs -> readFeatureInventory -> renderFeatures -> FEATURES.md, written by scripts/meta.mjs; the parent's bounded registry-notice-probe.mjs initially returned only the source-only line, then returned the npm run meta notice after the repair",
    "docs/control/local/reviews/WO-257/repair-3/round-1-design.md: no additional design finding; registry omission transferred to consistency",
    "scripts/test-work-orders.mjs criterion-8 fixture now covers failed final review, repair dispatch, a fresh handoff with the same unmet criterion, a pending verification and its later passing judgment; scripts/test-release-preparation.mjs checks the registry-only notice"
  ],
  "rejected": [
    {
      "option": "Treat any retained passing verdict as a judgment of the current handoff",
      "reason": "RepairCompleted replaces the unmet-criteria ledger but retains the previous verdict until VerificationRequested; the new handoff needs a later verification."
    },
    {
      "option": "Leave the known registry producer to the exhaustive-import-classification follow-up",
      "reason": "D036 already includes modules whose projected words or constants the page carries. This is one concrete missing producer within that boundary, not a new classifier."
    }
  ],
  "reopenWhen": "Another transition makes an earlier verdict judge a later handoff, erases a later criterion judgment without replacing it, or a known generated-page producer is missing from the regeneration table."
}
```

## WO-257-D043 — Keep the historical fold oracle and check new chronology separately

```json
{
  "id": "WO-257-D043",
  "date": "2026-11-06",
  "dispatch": "resume: fix; document-gate repair",
  "decision": "Preserve WO-030's immutable v0.6.0 fold snapshot and its source-prefix hash. The document comparison now checks each added verification ordinal against the matching completion event, then compares the original state fields with the recorded snapshot. No product behavior or historical record is changed. The first complete repair gate passed, but the following document gate found this missed consumer of the new internal field. The complete gate intentionally runs synthetic lifecycle fixtures; the historical comparison belongs to resume-docs. The executor judges this 28-line test delta after the completed review ladder, with no further reviewer after the passing complete run. Test source participates in the code identity, so obtain a fresh complete row and a fresh document row rather than claiming that the earlier complete row covers the changed test.",
  "evidence": [
    "The first repair npm test -- --review row passed all 46 suites and 120 fresh tasks at code identity 39a52b595a49a0ba527288c2679a1c6a9403692e5da7144718034db7c771aba8, recorded 2026-11-06T17:50:06.193Z",
    "The document row recorded 2026-11-06T17:53:45.253Z failed first in resume-docs: scripts/test-control-segments.mjs directly serialized the full current state against docs/evidence/WO-030/legacy-fold.json; the diff consisted of added latestVerificationOrdinal fields. Five later document suites did not run",
    "scripts/test-runner.mjs maps resume to --fixtures-only and resume-docs to --documents-only; packages/skeleton/src/gate-evidence.mjs gateCodeIdentity includes test source bytes",
    "node scripts/harness.mjs bounded -- bash scripts/test-resume.sh --documents-only passed all seven tests after the comparison repair, including unchanged input bytes, per-order legacy state, new completion ordinals, and legacy timing observations",
    "git diff --numstat against the reviewed tree reports 26 added and 2 removed lines in scripts/test-control-segments.mjs; docs/evidence/WO-030/legacy-fold.json is unchanged"
  ],
  "rejected": [
    {
      "option": "Rewrite the v0.6.0 expected record to include current fields",
      "reason": "That would falsify the historical observation instead of preserving its recorded contract."
    },
    {
      "option": "Drop the added field from the comparison without checking it",
      "reason": "The ordinal now affects criterion history and needs an independent assertion against the source event."
    },
    {
      "option": "Keep using the earlier passing complete row",
      "reason": "The changed test has a different code identity, so that row cannot support the final handoff."
    }
  ],
  "reopenWhen": "The original snapshot or input bytes change, another derived field reaches a historical comparison without a separate assertion, or chronology disagrees with the recorded completion event."
}
```

## WO-257-D044 — Verification boards the record route's merge refusal of parts it admitted

```json
{
  "id": "WO-257-D044",
  "date": "2026-11-06",
  "dispatch": "resume: verify",
  "decision": "Record as a follow-up, not a blocking finding, that the Agent route's split-round merge refuses a part shape the route admits. npm run worker -- record --format json --batch N admits each part whose JSON result is followed by prose carrying the Items table, because the body that passes the report rules is the prose; the merge then builds its refusal check from each part's result.report, which lacks the table, so the round is refused with every part kept. The same text recorded as a single report for a round under the ceiling is admitted. Criterion 12 names the launch under the fixture transport, its dry run, its --since round, the single-worker round, the pointer and the missing batch, all of which hold; the part route is this order's own addition (D031, D034, D035), so the defect breaks no criterion as written and no behavior main had. The worker brief's own instruction, the Items table in the result's report field, avoids it.",
  "evidence": [
    "docs/evidence/WO-257/ver-002/probes.mjs, test R1: both parts admitted (round-1-criteria.batch-1.json and round-1-criteria.batch-2.json kept), then the merged report is not recorded: a criteria review given the operator's dispatch answers it in an Items table, and this report has none",
    "docs/evidence/WO-257/ver-002/probes.mjs, test P12-6: the same JSON-then-prose text recorded without --batch for a round under the ceiling is admitted with its finding and an Items table itemsTable accepts",
    "scripts/lib/review-worker.mjs recordAgentReview: judged reads result.report and the prose, passing.body feeds omitted, each part keeps result and omitted, and the merge's recordedReportRefusal reads merged.report, built from the parts' result fields"
  ],
  "rejected": [
    {
      "option": "Judge criterion 12 unmet",
      "reason": "The criterion's clauses name the launch route and its rounds; the record route's part merge is outside its text, and main had no part route to regress."
    },
    {
      "option": "Leave the observation in the report alone",
      "reason": "A defect met and not fixed is recorded with its follow-up and reproduction."
    }
  ],
  "followup": "Make the record route's split-round merge judge and build the merged report from the body each part passed with: keep in the part which body met the report rules (the result's report field or the prose around it) and merge those bodies for both the refusal check and the record, so every shape admitted for a part is admitted in the merge; add a fixture recording a split round whose parts carry their Items table after a JSON result (WO-257 VER-002 F1, reproduction docs/evidence/WO-257/ver-002/probes.mjs test R1).",
  "reopenWhen": "A split round's admitted parts are refused at the merge in an actual pass, or the final reviewer judges the record route within criterion 12."
}
```

## WO-257-D045 — Verification readings and probe corrections of VER-002

```json
{
  "id": "WO-257-D045",
  "date": "2026-11-06",
  "dispatch": "resume: verify",
  "decision": "Record the readings VER-002's verdict rests on, and keep three probe setup errors apart from subject failures. Criterion 4: a release changing no renderer and no settings trigger keeps the authored None. and adds no derived line; the source-only line was unconditional on main and is not a triggered standing line. Criterion 12: a --since tree since which no document changed falls back to the merge base (D017), which bounds a round by its base without narrowing a fresh ladder to nothing; when documents changed since the tree, only they are carried. Criterion 11: the reader keeps text on a pasted_content opening line, so a constructed one-line wrapper whose closing tag follows a trailing fable hides that option while the prefix still classifies; D002's evidence shows the host writing those tags on lines of their own, so this is an observation, not a finding. Criterion 17: the allow rule admits every publish form without a host prompt, as the criterion and the order's recorded authorization name it; the target forms keep a phase check of their own (the draft form refuses unless the order is verified with a passing verification, the final target form without a committed passing final review), and the launchpad's own form, which has none, is D046's follow-up. Probe errors: fixture documents of about 200,000 bytes passed the per-document cap and became pointers, so the brief stayed under the ceiling (corrected to about 180,000 bytes); a worker option placed mid-line was not read, since harnessWorkerWords reads the option at the line's end (corrected input); and a mixed JSON-and-prose part without a format flag was refused by the route's auto format before any merge (corrected with --format json, the documented flag).",
  "evidence": [
    "scripts/release.mjs criticalNotes and releaseEdition; main's scripts/release.mjs criticalNotes already began with the source-only line; docs/evidence/WO-257/ver-002/probes.mjs test P4",
    "scripts/lib/review-worker.mjs subjectDocuments; docs/evidence/WO-257/ver-002/probes.mjs test P12-4",
    "packages/compiler/src/harness.ts harnessPromptLine and harnessWorkerWords; docs/evidence/WO-257/ver-002/probes.mjs test P11; this session's journal row: prefix resume:, prefixLine 0, 14 bytes, with the /model block in the model-facing transcript only",
    "scripts/worktree.mjs publish forms; scripts/lib/target-publish.mjs: the draft form refuses unless verified with a passing verification, the final form without a committed passing final review",
    "scripts/lib/review-worker.mjs MAX_DOCUMENT_BYTES and documentBlock; recordAgentReview's auto-format refusal of mixed text"
  ],
  "rejected": [
    {
      "option": "Count the probe setup errors as subject failures",
      "reason": "Each failed before reaching the claim it meant to test; the corrected probes reach it."
    }
  ],
  "reopenWhen": "A release prints a regeneration or settings line without its trigger, a --since round carries a document unchanged since its tree while another changed, the host writes a dispatch on the pasted_content opening line, or the publish helper runs a form its phase does not admit."
}
```

## WO-257-D046 — Verification boards a phase check for the launchpad publish form the new allow rule admits

```json
{
  "id": "WO-257-D046",
  "date": "2026-11-06",
  "dispatch": "resume: verify",
  "decision": "Record as a follow-up, not a blocking finding, that Bash(node scripts/worktree.mjs publish *) also admits the launchpad's own form, node scripts/worktree.mjs publish WO-NNN --title <title> --body-file <path>, which pushes the order branch and opens a pull request, and which the host prompted for on main. That form reads no phase: it requires a clean order worktree, the committed release surfaces, the body's shape, no attribution and the committed record's criterion lines, but not a committed passing final review, which the final target form requires. The emitted rule is criterion 17's exact text, its breadth is planning receipt 064's recorded known issue for criterion 17, and the order names the operator's acceptance as its authorization, so the implementation holds the recorded rule; the defensive repair belongs in the helper. D045's criterion 17 reading was narrowed to the target forms before filing.",
  "evidence": [
    "main's .claude/settings.json allows the two WO-246 rules only; this tree's adds Bash(node scripts/worktree.mjs publish *)",
    "scripts/worktree.mjs, the launchpad publish branch (ensureClean, release.mjs check-surfaces --committed, the body checks, criterionRecordRefusal): no phase or final-review read; scripts/lib/target-publish.mjs refuses the final target form without a committed passing final review and the draft form unless the order is verified with a passing verification",
    "docs/planning/refutations/2026-11-06-planning-92d06e6e83aa82b0-064.json, criterion 17's known issue: the rule admits every argument form of the publish helper without a host prompt, reopened when the helper is found to publish without checking the active order"
  ],
  "rejected": [
    {
      "option": "Judge criterion 17 unmet, or block on the authority boundary",
      "reason": "The emitted rule is the criterion's exact text under the operator's recorded authorization; the implementation holds the recorded rule."
    },
    {
      "option": "Narrow the allow rule to the target-worktree form",
      "reason": "It would change the rule the criterion and the operator's acceptance name; a refusal in the helper keeps the rule and closes the gap."
    }
  ],
  "followup": "Make node scripts/worktree.mjs publish WO-NNN --title --body-file refuse unless the order's committed control record shows a passing final review, as the final target form does, so the prompt-free allow rule of WO-257 criterion 17 does not rest on a clean order worktree alone; this answers planning receipt 064's criterion 17 known issue (the helper publishing without checking the order).",
  "reopenWhen": "A session publishes an order's branch through the launchpad form before its final review passes, or the helper gains the phase check."
}
```

## WO-257-D048 — Final review: the matched follow-up rows whose conditions this order met

```json
{
  "id": "WO-257-D048",
  "date": "2026-11-06",
  "dispatch": "resume: final review; npm run plan -- followups --touching --work-order WO-257 (46 pending rows name a file this change touches or the order)",
  "decision": "Dispose the rows this order delivered or whose reopening condition its change met, in one --apply batch against register revision b9674e84af0b29888204bfaaca0154ca6478efd70c515fbd945390b727b689a7 (c6d2287e9f775261cb74188c995d1cf8e34283d47b64cbfaebbf03464c452747 after the write), and leave the rows it only matched as they are. Settled: FUP-848fd8e2ac941bc3 (WO-226-D023: admit the host's paste framing before the dispatch line with a case), delivered by D002 and D016, which skip the pasted_content opening tag and the slash command's block with cases in the compiler, harness-fixtures and codex-continuation suites. Deferred again with the met condition named: FUP-eed385be08e5bdd9 (WO-226-D022), because this order re-mints the role oracle as wo257-role-baseline.json and edits scripts/test-gate-followups.mjs; FUP-13db0bc45db31d8d (WO-224-D017), because D014 edits the target subject resolution in scripts/lib/entropy-review.mjs without taking the missing-base message; FUP-1fa649b8d330505b (WO-255-D022), because this order's first two complete runs failed on hand-written inventories its six round-1 reviews did not trace (D036, D037); and the cold-start rows FUP-89b7b9f657765e83, FUP-8dd0eb609946b9d1, FUP-916e24773df0b734 and FUP-957602bc42e32e1d, because the planner's no-update sentence changes the measured overrun (D007 and the oracle: the planner 30,780 bytes against 24,576; the executor 44,358, the verifier 38,638, the reviewer 41,061, release-close 28,638 and the router 17,124, each over its unchanged ceiling). The 38 other matched rows are left as they are: this order's six untriaged nominations (FUP-243b6754001c4051 from D017, FUP-f191f04206f7ec8a from D029, FUP-d8257c65c12af0fa from D036, FUP-33fab5211e3368f5 from D039, FUP-45b8ce20b8b764d0 from D044 and FUP-9cfd1cd290f68d1b from D046), which the next planning pass triages, and FUP-c61f76f60798e1b2 (D007), which the executor deferred on this tree; rows whose condition names a surface this order did not edit (FUP-770baf2f452c669e, the planner root's entropy sentence; FUP-53a2c609d6815549, targetLensBriefs; FUP-589642d0e0c714c8, FUP-911dc28a35dc4c44, FUP-be6721fbdd4b6285 and FUP-dc138fc0fac6a3fc, the hook's release-close admission, target resolution, outside-write path and refusal text, where this order changes only the readFeatures import in harness-host.ts; FUP-c4c7ba9f126d2e4a, plan-continuation's amendment guards; FUP-b99d7ad6940b7ebf, the disposable declarations; FUP-2fe2709d9b33c9e7, the target commit lint; FUP-ac86ee429dee2947, whose condition is a planning allocation alone); and rows whose condition is an event that did not occur (FUP-00af89947ed9099f, FUP-048618f9ee2eb349, FUP-06090c778cc07685, FUP-17ea51254e5a7256, FUP-2ce66cf6a0602982, FUP-6606e739a1ae8678, FUP-7b9896d099301d15, FUP-7f9a27e6ed6c44b3, FUP-912adb42a652b75f, whose guide edit here is judged by a fresh document gate while the complete row's identity keys code, FUP-941fd291e0fd1033, FUP-977e50f635de762d, FUP-9a4929e4a041875f, FUP-b1397fa85cbeba51, FUP-b946c5a767a65862, FUP-c53447a63c6b1031, FUP-d0a9719cc2e4ec55, FUP-dfde4050da06d43b, whose sequence did not recur because each of this order's complete runs started after its ladder had ended, FUP-e4417f76298b1d02, FUP-ea936acad1506e18, FUP-fb8cbeabbddef397 and FUP-fc889fc98e33c547).",
  "evidence": [
    "npm run plan -- followups --touching --work-order WO-257 at register revision b9674e84af0b29888204bfaaca0154ca6478efd70c515fbd945390b727b689a7: 271 pending rows, 46 matched over six pages, read in full.",
    "npm run plan -- followups --apply docs/control/local/followup-request.json: eight requests applied, one settled and seven deferred, revision c6d2287e9f775261cb74188c995d1cf8e34283d47b64cbfaebbf03464c452747.",
    "docs/evidence/WO-226/decisions.md WO-226-D023's followup asks to admit the host's paste framing before the dispatch line with a case; WO-257-D002 and WO-257-D016 deliver it, and VER-002 ran eight prompt shapes through both readers.",
    "WO-257-D007 and packages/skeleton/fixtures/wo257-role-baseline.json: the cold-start bytes named above.",
    "WO-257-D036 and WO-257-D037: the two complete-run failures on hand-written inventories, outward-lint's copied module list and the declared-cases pin."
  ],
  "rejected": [
    {
      "option": "Triage this order's six untriaged nominations here",
      "reason": "Triage is the planning pass's; the final review disposes only what this order delivered or whose condition its change met, and the executor's and verifier's decisions already carry each nomination's reopening condition."
    },
    {
      "option": "Re-defer every matched row with this order named",
      "reason": "A row whose condition did not occur keeps its disposition; a textual match is a pointer for judgment, never a verdict."
    }
  ],
  "reopenWhen": "A settled row's reopening condition occurs, or a later pass reads one of the 38 left rows' conditions as met by this order."
}
```

## WO-257-D047 — Final review: the judgment, one standing-document repair and no source change

```json
{
  "id": "WO-257-D047",
  "date": "2026-11-06",
  "dispatch": "resume: final review; the judgment of WO-257 through VER-002, allocated FINAL-001",
  "decision": "Pass WO-257 at code identity 0649d31c43b5e01cd8b0a61086fa5bdcbb93b74372fd885dd208ab385c73b3b8, the identity of the complete review row recorded 2026-11-06T18:40:18.711Z and of VER-002's subject, recomputed here before and after this review's edits. Main, origin/main and the worktree's merge base all stand at the activation base be65193081651565deb32596d1698d361d6e515d, and npm run worktree -- integrate WO-257 fetched origin and took in nothing. Every criterion holds on evidence run again in this session under the bounded wrapper, outside any gate: VER-001's six probes and VER-002's eight (its R1 failing by design, the boarded D044), the review-worker suite (32 of 32), the compiler suite (16 of 16), the release-preparation suite (25 of 25), the work-orders fixtures (36 of 36), the docs-check (76 of 77, one skipped), target-worktree release (10 of 10) and publish (22 of 22), resume (5 and 12), launchpad update (19 of 19) and export (32 of 32), process-debt (183 of 183), github-body (41 of 41), features (6 of 6) and entropy (36 of 36) suites, while the harness-fixtures, plan-refutation and launchpad-planning re-runs were stopped or never started on the operator's question and stand on the complete row at the identity, harness check (43 generated surfaces), the publication check (256 of 256 headings, both editions current), the documents census (338 standing documents, no red tag), the index check, the release-surfaces check, the format check and git diff --check. One standing-document defect is fixed here and listed as F1 with the follow-up route and the escape class: product 07's prompt-hook paragraph ended in a dated account of the planning dispatches journaled unclassified from 2026-10-29 to 2026-11-06, which belongs in D002; the sentence now states the standing rule, that a row journaled unclassified before the reader skipped the host's elements is a record and stays as written since the fix is forward-only, and links D002 for the account. The publication lock of the software-engineer edition was regenerated by npm run sync for that edit. No source changed in this review, so the complete row stands and no complete run was started. Receipt 064's seventh known issue met its reopening condition on this order, recorded here for the next planning pass: VER-001 failed criterion 12 alone and the repair held the other nineteen criteria for 1 h 55 min and a second verification of 0 h 28 min; npm run meta on this tree names two reopen candidates, rule-beating and seeking-the-wrong-goal worsened over three consecutive order deltas, and twelve budget breaches. Before the material choices, the traps that would have changed the work: accepting the verifiers' passes without running their claims here (each was run again), editing a source in review to take D044's or D046's follow-up (rejected below), quoting the operator's captures in a committed record (their items are named by number only), counting the verifier's own boarded follow-ups again in this report's findings block (they stand in VER-002's block and the register), and shaping the report from an earlier instance (its shape comes from the result transition's rules and the reader's task). The trap that bit was re-running every Preflight suite in a second chain after the first had reproduced the claims the verdict rests on, which spent 0 h 28 min of wall clock against a complete row the rules say to reuse; the operator's question of 2026-11-06T20:48Z stopped it, and this record names it. The NoOp, recording the pass on VER-002 alone, was rejected because the reviewer owns the identity check, the integration, the acceptance judgment, the standing-document judgment, the register rows and the release surfaces.",
  "evidence": [
    "node <session scratch>/gate-audit.mjs: identity 0649d31c43b5e01cd8b0a61086fa5bdcbb93b74372fd885dd208ab385c73b3b8 before the edits and 0649d31c43b5e01cd8b0a61086fa5bdcbb93b74372fd885dd208ab385c73b3b8 (unchanged) after them; the npm test review row of 2026-11-06T18:40:18.711Z intact, passing and standing with 46 required suites and none missing.",
    "git rev-parse main, git merge-base main HEAD and git rev-parse origin/main: all be65193081651565deb32596d1698d361d6e515d; npm run worktree -- integrate WO-257 printed that the worktree is not behind main.",
    "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-257/ver-001/probes.mjs: 6 passed; the same for docs/evidence/WO-257/ver-002/probes.mjs: 7 passed, R1 failed as its header says it must until FUP-45b8ce20b8b764d0 is taken; scripts/test-review-worker.mjs 32 passed; packages/compiler/dist/test/harness.test.js 16 passed; scripts/test-release-preparation.mjs 25 passed; bash scripts/test-work-orders.sh 36 passed; scripts/test-docs-check.mjs 76 passed and 1 skipped; scripts/test-target-worktree-release.mjs 10 passed; scripts/test-target-worktree-publish.mjs 22 passed; bash scripts/test-resume.sh --fixtures-only 5 and 12 passed; scripts/test-launchpad-update.mjs 19 passed; scripts/test-launchpad-export.mjs 32 passed; scripts/test-process-debt.mjs 183 passed; scripts/test-github-body.mjs 41 passed; scripts/test-features.mjs 6 passed; node scripts/test-entropy-review.mjs 36 passed; the harness-fixtures run stopped at 0 h 7 min, plan-refutation and launchpad-planning not started.",
    "node scripts/harness.mjs check: 43 generated surfaces; npm run publication:check after the edit and npm run sync: 256 of 256 headings, 29 and 45 linked sections current; npm run plan -- documents: 338 standing documents, 325 unread, no red tag; npm run work-orders -- index --check, npm run release -- check-surfaces --local, npm run format:check and git diff --check clean.",
    "docs/product/07-execution-guide.md, the prompt-hook paragraph of §Operator-opened planning pass: the dated sentence replaced by the standing rule, linking WO-257-D002; the order's Known issues already say the rows are records and the fix is forward-only.",
    "docs/control/orders/WO-257.jsonl: RepairRequested 2026-11-06T16:49:47.809Z, RepairCompleted 18:44:39.510Z, VerificationRequested 19:32:14.902Z, VerificationCompleted 20:00:00.615Z; docs/planning/refutations/2026-11-06-planning-92d06e6e83aa82b0-064.md, criterion 20's known issue and its reopening observation; npm run meta on this tree: REOPEN rule-beating and seeking-the-wrong-goal, 12 budget breaches."
  ],
  "rejected": [
    {
      "option": "Take D044's merge repair or D046's phase check in this review",
      "reason": "A source edit moves the code identity, owes a 0 h 44 min complete run and its own review ladder, and reaches the merge without independent verification; both are boarded with reproductions and repair rules for the order that takes them."
    },
    {
      "option": "Return the order to repair for the dated sentence in product 07",
      "reason": "The defect is one sentence in a declared write-back surface, repairable within the final review's document authority without moving the code identity; a repair dispatch would cost a cycle for a replacement this review can make and record."
    },
    {
      "option": "Leave the dated sentence as written",
      "reason": "A standing document holds the current state for its reader, and the account belongs in D002, which the replacement links."
    }
  ],
  "reopenWhen": "A planning pass reads receipt 064's seventh known issue or the meter's reopen candidates as needing an allocation, the next order's final review finds the standing-document rule misapplied here, or a dispatch after v0.119.0 journals unclassified with a known host element before it."
}
```
