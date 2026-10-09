# WO-188 decisions

## WO-188-D001 — Note for planning: the Tinkerer support does not modify the phase it is linked to

```json
{
  "id": "WO-188-D001",
  "date": "2026-10-08",
  "dispatch": "resume: next; operator note during execution, recorded without changing the order",
  "decision": "Record the operator's observation as a planning candidate and leave WO-188's text, scope and item 22's disposition unchanged. The observation, paraphrased: a support linked to an active phase is meant to change that phase's behaviour noticeably, as a support gem changes a linked skill; equipping the Tinkerer support on the executor phase barely alters it, and no executor, including one writing new code, has yet been seen running the exploratory comparison it asks for. The product's own definition agrees: a support facet is a typed modifier of the linked mechanic, and only a subset should compile to prompt text. Every executor support today is built by promptSupport, which compiles to one prompt sentence and nothing else. This order's executor applies the current sentence where a fork appears (items 1 and 23 each show one) and records both arms.",
  "evidence": [
    "docs/product/02-domain-model.md line 233 defines a support facet as a typed pure modifier of linked mechanics that declares semantics added and modified, authority changes, evidence requirements and a resource multiplier, and says only a subset compile to prompt text while most compile to guards, schemas, permissions and verifier episodes, each declaring its true cost.",
    "packages/skeleton/src/loadouts/prompt-support.ts builds a support with semanticsAdded of one sentence, semanticsModified empty, evidenceRequirements empty, resourceMultiplier 1, one prompt-fragment emission and extraEpisodes 0. packages/skeleton/src/loadouts/executor-supports.ts builds Tinkerer — Economy, Decision Receipts, Follow-up Queue, Operator Check-In and the three communication levels this way; only Adjacent Repair adds a semanticsModified rewrite of one procedure line. No executor support declares an evidence requirement, a guard, a schema or an extra episode.",
    "The generated executor root (.claude/skills/dotln-executor/SKILL.md at 28d32e26) carries the Tinkerer sentence as one rule among about forty after the numbered steps; the numbered steps themselves (contributor.ts roleSteps.executor) are the same with or without the support; the dispatch briefing of this session lists the equipped supports and prints no line for it (WO-196 removed the experiment briefing line).",
    "The order's observed gap: 64 experiment records under the previous pre-registered rule, 33 declined, 31 run, 15 adopted, 8 measured both arms; Codex executors declined 30 of 38; the median record was written 5.7 minutes after activation. The 2026-10-07 pass counted 71 records, 39 declined.",
    "The current sentence is conditional and unchecked: no gate, handoff line or briefing asks whether a fork appeared, and a run that claims none leaves no record. The one measured comparison in a recent handoff (docs/evidence/WO-199/handoff.md) compared two signal-delivery mechanisms the repair already needed.",
    "The operator raised this during resume: next on 2026-10-08 and asked for a note outside this order; the words are paraphrased here and not quoted."
  ],
  "rejected": [
    {
      "option": "Amend WO-188 or item 22's text under scope expand",
      "reason": "The operator asked for a note that does not change this order; item 22 is WO-196's and closed."
    },
    {
      "option": "Write the observation to the ledger or intake",
      "reason": "The ledger is for operator ideation and planning synthesis; a decision with a followup is the executor's route, and the register sync mints the row planning reads."
    },
    {
      "option": "Rebuild the Tinkerer support in this order as a modifying support",
      "reason": "Changing how a support compiles is a loadout and compiler change outside every criterion here; the support's form is a planning decision."
    }
  ],
  "followup": "Planning: make the Tinkerer support modify the executor phase it is linked to, as product 02 defines a support facet, and decide the same for the other prompt-only executor supports. Levers the compiler already types: semanticsModified that rewrites the executor's implement step into a two-arm step (build the second credible way as a bounded arm, compare on the named axis, keep one, record both); an evidenceRequirement the completion checks, such as a typed handoff block naming the fork and both arms or stating that none appeared, refused at implementation-ready when absent, like the criterion lines; an extra episode for the second arm run as a worker, with resourceMultiplier and extraEpisodes declaring its true cost; a briefing line that prints the trigger together with any experiment the order names; a trigger duty on a new module or script to compare one alternative before its design settles. Measure against the next ten closed orders: how many handoffs name a fork and both arms. Source: this order's executor, after the operator's 2026-10-08 observation.",
  "reopenWhen": "Planning disposes the minted follow-up, or the next ten closed orders include fewer than three recorded comparisons with both arms."
}
```

## WO-188-D002

```json
{
  "id": "WO-188-D002",
  "date": "2026-10-08",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.70.0, the next minor above the observed release baseline v0.69.2, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.69.2 (local tags)",
    "minor classification declared in docs/work-orders/WO-188-boarded-machinery-items.md"
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

## WO-188-D003 — Item 1: a nested repository outside intake is scratch unless the tracked tree declares it; the close removes it and records its head

```json
{
  "id": "WO-188-D003",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 1",
  "decision": "A scratch repository is a nested repository inside an order's worktree that is neither under the intake lane nor declared by the tracked tree as a submodule (a gitlink entry or a .gitmodules path); a repository under the control lane is scratch too. The executor removes each before implementation-ready or repair-complete and declares none; a completion with one present prints one advisory naming it; the reviewer removes any still present; release close removes any left after the preservation check verifies and records, per repository, its worktree, path, head commit, whether a remote-tracking ref of its own holds that head, and the outcome. The declaration machinery is gone: the worktree material action, keep rows, material.json, committedMaterial, recovery bundles and materialState. An operator word stays available through --material [<absolute-worktree>::]<path>=preserve; =disposable states the default; a word naming the intake lane, a declared submodule or no nested repository refuses. Removal runs after the final preservation verification and just before the worktree is removed, with a writability preflight so that a failed removal deletes nothing and owned write bits restored first.",
  "evidence": [
    "scripts/lib/worktree-material.mjs (inventoryMaterial, parseMaterialFlags, materialCloseCommand, scratchRepositoryFacts, removeScratchRepositories), scripts/lib/paths.mjs (declaredSubmodules, describeIgnoredMaterial), scripts/lib/intake-reconciliation.mjs (scratch marking, scratchMaterial), scripts/worktree.mjs (removeScratch, ensureNoIgnoredMaterial, submodule refusal), scripts/release.mjs (removals in the close record, Material retry line), packages/skeleton/src/loadouts/contributor.ts (executor, reviewer and release-close sentences), scripts/lib/lifecycle-evidence.mjs (the completion advisory).",
    "Fixtures: scripts/test-release.sh cases release_case_material (lane, scratch, kept, preserve and intake modes), material_derived, material_settle, release_case_submodule_force, release_case_malformed_material and close_completion through node scripts/test-release-fixtures.mjs; scripts/test-worktree.sh (scratch rule and Scratch removal rows); scripts/test-process-debt.mjs 'a nested repository outside intake ... is scratch', 'reconciliation removes scratch repositories ...' and 'an executor completion records lane material and advises once ...' (node --test --test-name-pattern 'scratch|material' scripts/test-process-debt.mjs); packages/skeleton/test/executor-supports.test.ts for the three role sentences. All pass in this worktree.",
    "Re-observation of the seven sub-items the Design names, each with the fixture that shows it: WO-176 D033 present and narrowed (an inner repository inside a scratch repository leaves with its parent and the parent head is recorded; a bare or unreadable repository outside the control and intake lanes with no other file is invisible to the inventory and leaves with the worktree unrecorded; the preservation walk finds an unreadable repository under a lane by readdir and treats it as scratch: release_case_material scratch mode and the process-debt reconciliation test). D034 a gone: a word scoped through an alias resolves to the physical worktree before comparison (material_settle with the misnamed derived worktree). D034 b gone: a duplicate word after realpath, including a trailing slash, refuses (release_case_malformed_material). D034 f gone for scratch: materialState is deleted; snapshot() still refuses a FIFO elsewhere in the subject. D037 b gone: no keep rows exist (close_completion uses --material .runtime/kept=preserve). D037 c gone: no declarations exist (the worktree material action is removed; scripts/test-process-debt.mjs no longer imports it). D037 g gone: no declare command; a disposable word on intake or on a declared submodule refuses (release_case_material intake mode; release_case_submodule_force).",
    "Nested Git reads run with -c core.hooksPath=/dev/null -c core.fsmonitor=false and --git-dir plus --work-tree pinned, because discovery otherwise falls through to the outer worktree on a broken HEAD; the item 3 fixture plants a reference-transaction hook and a fsmonitor script in a nested repository and asserts no marker. Only the file monitor is a live proof: a flagless ls-files runs it, while no Git call in the close path writes a ref, so the planted reference-transaction hook could not fire either way."
  ],
  "rejected": [
    {
      "option": "Keep the declaration step and the keep rows and only add removal of undeclared repositories",
      "reason": "Operator-review assumption 1 and receipt 038 make an undeclared nested repository scratch without asking; the declaration step existed to carry what the close now records by itself."
    },
    {
      "option": "Preserve control-lane repositories as WO-176 D033's lanes did",
      "reason": "The planner's boundary is the tracked tree and the intake lane; a repository under docs/control/local is nobody's source of record and its head commit is recorded at removal."
    },
    {
      "option": "Read whether a remote held the head with git ls-remote",
      "reason": "A network call at close is neither bounded nor private; the repository's own remote-tracking refs answer the question the record asks, and an unreadable repository records null."
    }
  ],
  "followup": "A bare repository, or an unreadable nested repository outside the control and intake lanes whose directory holds no other file, is invisible to the ls-files inventory and leaves with the worktree without a recorded head; an untracked, unignored nested repository is in no inventory either, so the close keeps it as dirt and blocks instead of removing it. Intended fix: let the inventory walk the ignored tree once for directories that hold a HEAD or a gitfile and record them as scratch with head null when unreadable. Paths: scripts/lib/worktree-material.mjs inventoryMaterial, scripts/lib/intake-reconciliation.mjs. Checks: scripts/test-release.sh release_case_material, scripts/test-process-debt.mjs. Priority low: the record is incomplete, not wrong, and the release close removes nothing it did not list.",
  "reopenWhen": "A close record names a removed repository whose commits no remote or retained ref held and the operator asks to recover it, or an intake or declared-submodule repository is removed by any path."
}
```

## WO-188-D004 — Item 2 not reproduced: WO-195 already builds the release-close command once

```json
{
  "id": "WO-188-D004",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 2",
  "decision": "Record item 2 as not reproduced and change nothing: one exported builder already produces the release-close command in the admitted spelling, and the admission fixture already accepts it.",
  "evidence": [
    "docs/evidence/WO-188/items-2-6-not-reproduced.txt: the transcript of the re-observation at this order's base, which shows WO-195 (2d50a415) landed the builder and its fixture.",
    "Criterion 2's spelling checks remain exercised by scripts/test-close-admission.mjs (the Material retry line and the material close command of item 1 are new printers that it now covers)."
  ],
  "rejected": [
    {
      "option": "Re-implement the builder here",
      "reason": "The code is present and tested at the base; a second copy would be the duplication the item boarded."
    }
  ],
  "reopenWhen": "A printer emits a release-close command that the admission fixture refuses."
}
```

## WO-188-D005 — Item 3: the tag outcome is set before the preflight; material blockers carry the admitted command; nested Git calls run without hooks

```json
{
  "id": "WO-188-D005",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 3",
  "decision": "In the equal-version branch the record's tag outcome is set to already-published as soon as the remote tag is annotated at the head, before the preflight that can refuse. A finish or settle blocker whose reason names a scratch repository, a nested repository, a submodule or a material word carries the material close command over every kept worktree's rows and its disposable form, and the transcript prints it as a Material retry line. Every Git call into a nested repository disables hooks and the file-system monitor and pins --git-dir and --work-tree.",
  "evidence": [
    "scripts/release.mjs (settlePublication, finishPublishedWorktree, the Material retry line), scripts/lib/worktree-material.mjs (NESTED_GIT flags, readNested), scripts/lib/paths.mjs inspection flags.",
    "scripts/test-release.sh createrecovery (the forge double fails first at create, then at authentication after a published tag; the tag outcome is set and the completed Release is carried), material_settle (the blocker prints the material command and every kept worktree), and the planted reference-transaction hook that leaves no marker, of which the file monitor is the one a close read can trigger; node scripts/test-release-fixtures.mjs runs them. A submodule refusal is not a material cause: it carries the plain settle command and no --material form, and it comes before any scratch removal, so the retained worktree keeps its scratch repositories and its intake unit."
  ],
  "rejected": [
    {
      "option": "Print only the one blocking path in the retry command",
      "reason": "A settle over several kept worktrees would need several retries; the admitted command carries every kept row at once."
    }
  ],
  "reopenWhen": "A close record shows a published tag with an unset outcome, or a nested repository's hook leaves a marker in a fixture."
}
```

## WO-188-D006 — Item 4: no forced removal over a submodule; already-published is carried; a dirty derived worktree names the operator; the record exists before flags parse

```json
{
  "id": "WO-188-D006",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 4",
  "decision": "Removal of a subject that holds a submodule gitlink refuses before any proof and never passes --force to git worktree remove; the refusal says the submodule's unpushed commits would be discarded and names the operator terminal as the route. A retry whose tag and Release were completed earlier carries them into the record as already-published with a releaseCarried flag. A derived worktree kept for uncommitted changes gets a remedy that names the operator and the exact settle command. The close record is created before the flags are parsed, so a malformed material word leaves a refused record. The gate's code identity hashes a gitlink entry by its mode and object id; the gate tree hash still refuses a submodule.",
  "evidence": [
    "scripts/worktree.mjs removePreservedWorktree refusal text; scripts/release.mjs settlePublication and the parse-inside-try record; packages/skeleton/src/gate-evidence.mjs gateCodeIdentity gitlink rows (the worktree case reads ls-files -s for pointers; the committed batch excludes them).",
    "scripts/test-release.sh release_case_submodule_force (a derived worktree holding a submodule is refused through settle, never forced), createrecovery (already-published carried), material_derived (dirty derived remedy) and release_case_malformed_material (refused record exists)."
  ],
  "rejected": [
    {
      "option": "Teach gateTreeHash a submodule adapter in this order",
      "reason": "The gate's tree hash is WO-186's selection machinery and the item boards the removal path; a subject with a committed submodule still cannot pass a gate, which the fixture avoids by placing the submodule in a derived worktree."
    }
  ],
  "followup": "gateTreeHash refuses a subject that holds a committed submodule ('Submodule gate evidence needs an explicit adapter'), so an order that commits a gitlink cannot run its gate; gateCodeIdentity already hashes the pointer. Intended fix: hash the gitlink's object id in gateTreeHash the way gateCodeIdentity does and record the nested head in the gate row. Paths: packages/skeleton/src/gate-evidence.mjs. Checks: scripts/test-process-debt.mjs gate identity tests, scripts/test-release.sh release_case_submodule_force. Priority low until an order needs a submodule.",
  "reopenWhen": "A close removes a submodule or forces a removal, or a retry loses a completed Release from its record. A linked worktree of another repository (a .git gitfile) is never scratch: its commits live in the owner, so it is kept and a disposable word on it refuses."
}
```

## WO-188-D007 — Item 5: the prune removes a partial proof that sits beside a whole one

```json
{
  "id": "WO-188-D007",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 5",
  "decision": "After the prune compares a proof with its whole copy, a leftover <proof>.partial regular file beside it is removed; a directory of that name is left as it is.",
  "evidence": [
    "scripts/lib/harness-prune.mjs after the proof comparison; scripts/test-harness.mjs 'a prune removes a leftover partial that sits beside a whole proof'."
  ],
  "rejected": [
    {
      "option": "Remove any .partial entry regardless of type",
      "reason": "Only the file form is the interrupted write the prune understands; another shape is somebody else's."
    }
  ],
  "reopenWhen": "A prune run leaves a .partial file beside a verified proof."
}
```

## WO-188-D008 — Item 6 not reproduced: WO-195 already withholds the close admission under a typed-correction state

```json
{
  "id": "WO-188-D008",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 6",
  "decision": "Record item 6 as not reproduced and change nothing: the admission is withheld while the session holds a typed-correction state at this order's base.",
  "evidence": [
    "docs/evidence/WO-188/items-2-6-not-reproduced.txt (WO-195, 2d50a415); the harness fixtures for the withheld admission pass at the base and in this worktree."
  ],
  "rejected": [
    {
      "option": "Add a second guard",
      "reason": "The behaviour exists; a duplicate guard is the kind of growth this order removes."
    }
  ],
  "reopenWhen": "A release-close publish command is admitted while a typed correction is pending."
}
```

## WO-188-D009 — Item 7: a host task notification is journaled with its own source and is not an operator message

```json
{
  "id": "WO-188-D009",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 7",
  "decision": "promptRoute returns an attribution (operator, unattributed or host-task-notification); recordOperatorMessage writes source host-task-notification when the host queued the prompt as a task notification; plan failures skips those rows from the intervention count, reports them as hostNotifications, and tallies unattributed rows without excluding them.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts promptRoute and recordOperatorMessage; scripts/lib/plan-failures.mjs OperatorMessageObserved handling and summary fields.",
    "scripts/test-harness.mjs and scripts/test-plan-refutation.mjs fixtures for the notification route and the counts."
  ],
  "rejected": [
    {
      "option": "Drop notification prompts from the journal",
      "reason": "The journal is the record of what the host delivered; the count, not the row, is what the correction meter must not include."
    }
  ],
  "followup": "An enqueue row that carries the message text and no recorded command mode is attributed to the operator (promptRoute reads commandMode on queue-operation rows and no record shows the field there), so a host notice recorded in that shape, as WO-142's decisions show, would count as an intervention. Intended fix: an enqueue match with no recorded mode is unattributed, with a fixture in scripts/test-harness.mjs. Paths: packages/skeleton/src/harness-host.ts promptRoute. Checks: npm test -- --only harness-fixtures. Priority low; the shape WO-178 D014 recorded is classified correctly.",
  "reopenWhen": "A host task notification is counted as an operator intervention or an operator prompt is labelled a notification."
}
```

## WO-188-D010 — Item 8: Copilot CLI loads the shared registration with the failed-command event named; the event is registered and answers a failed Bash call at the call itself

```json
{
  "id": "WO-188-D010",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 8; the order's live row",
  "decision": "Observed first: the Copilot probe gained a failure-event mode that registers PostToolUseFailure and PermissionDenied beside the five observed events in the shared Claude-form settings file and has the fixture skill run one failing command. One bounded live launch (the eleventh of twelve) ran under node scripts/harness.mjs bounded on 2026-10-08: Copilot CLI 1.0.89 loaded the file and fired the other hooks 30 times (SessionStart 1, UserPromptSubmit 1, PreToolUse 15, PostToolUse 12, Stop 1); it fired PostToolUseFailure once, for a Read whose payload carried hook_event_name, session_id, timestamp, cwd, tool_name, tool_input.path and error and no tool_use_id; PermissionDenied never fired; the failing command started and Copilot's own log did not mark it failed; both Claude-form denials were observed. Since the file loaded and the other hooks fired, the event is registered: the compiler emits a failure-observer hook on PostToolUseFailure with matcher .*; the host admits the event, decodes its error field, answers a failed Bash call whose error text carries a shell diagnostic with the class guidance at the failure itself, appends one counted row marked failed with the call's use under the same claim the transcript route takes (so that route answers it no second time), counts a failure sent without a call identity once without a mark, and answers and counts nothing when the error carries no diagnostic. The harness host version stays 0.35.0, unchanged since 2026-09-16 when release metadata left the behavioural sources.",
  "evidence": [
    "docs/discovery/copilot-cli-2026-10-08.json and .md (row P11, mode failure-event, priorLaunches 10, launchesStarted 1, cliVersion 1.0.89, exit 0, 31 hook invocations, failureEvent block); scripts/lib/copilot-probe.mjs, scripts/fixtures/copilot-probe-hook.mjs, scripts/test-harness-probe.mjs 'the Copilot failure-event mode names the failed-command event in the shared file, runs one failing command and records what the CLI did' (the stub stands in for a CLI that fires the event; it claims nothing about Copilot).",
    "packages/compiler/src/harness.ts failure-observer hook and showHarnessAdvisory; packages/skeleton/src/harness-host.ts HostHookEvent, HarnessInput.error, the decoder allowlist, protocolRefusal, the observe branch and observeShellDiagnostics; scripts/test-harness.mjs \"the host's failed-command event answers a failed Bash call at the call itself with one counted row, and the transcript route answers it no second time\"; checkHarness counts 34 generated surfaces (33 before).",
    "Live under Claude Code 2.1.295 in this session after the re-emit: a zsh no-match failure at 2026-10-08T23:35:18Z was answered at the failing call with the unmatched-pattern guidance and one row marked failed with its use was appended to docs/control/local/harness/shell-diagnostics.jsonl (the local lane; the row holds the class and scope, not the command)."
  ],
  "rejected": [
    {
      "option": "Leave the event unregistered and meet the criterion by the record",
      "reason": "That branch applies only if Copilot rejected or ignored the file; it loaded it and fired the other hooks."
    },
    {
      "option": "Register a native Copilot failure hook",
      "reason": "Copilot's native hook file names no failed-command event; the shared Claude-form file is the registration both hosts read."
    },
    {
      "option": "Drop the transcript route now that the event answers at the call",
      "reason": "Copilot sends no call identity and marks a non-zero exit as success, so the late route and the unmarked count remain the only answer there; under Claude Code the claim keeps the two routes from answering twice."
    }
  ],
  "reopenWhen": "A Claude Code release stops delivering PostToolUseFailure for a failed Bash call, Copilot CLI starts marking a non-zero shell exit as a failure, or a failed call is answered twice."
}
```

## WO-188-D011 — Item 9: a decision whose dispatch names an operator correction counts as a correction, from the persisted reading

```json
{
  "id": "WO-188-D011",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 9",
  "decision": "isCorrection reads a persisted set of decision ids, docs/evidence/WO-172/direction-agreement.json correctionsNotRecorded, beside the kind and misread rules; plan failures and collectMeta both pass it. An absent record is an empty set; a malformed one is an error naming the file. The dispatch prose is never parsed.",
  "evidence": [
    "scripts/lib/meta.mjs persistedCorrectionIds and isCorrection; scripts/lib/plan-failures.mjs; scripts/test-plan-refutation.mjs fixture over a synthetic control and decision set. plan-failures now imports meta.mjs, so scripts/lib/meta.mjs is a declared machinery source of the plan-refutation suite in scripts/test-runner.mjs."
  ],
  "rejected": [
    {
      "option": "Match the operator-step grammar in dispatch text",
      "reason": "The order's prose-parsing screen forbids it; the hand classification already persisted its reading."
    }
  ],
  "reopenWhen": "A later direction reading records corrections in another file, or the counts for the eleven closed orders disagree with the persisted set. Limit: the persisted set is the reading WO-172 recorded and nothing regenerates it, so a later decision whose dispatch names a correction is counted only once a direction reading adds its id."
}
```

## WO-188-D012 — Item 10: provenance keys are unique within a file

```json
{
  "id": "WO-188-D012",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 10",
  "decision": "operatorWordFindings keys provenance fields by ordinal in document order (provenance, provenance-2, ...), so two attributed fields in one work order yield two keys with their own fingerprints; the repository run reports no current advisory.",
  "evidence": [
    "scripts/docs-check.mjs operatorWordFindings; scripts/test-docs-check.mjs 'a work order with two attributed provenance fields yields two keys'; node scripts/docs-check.mjs prints Operator-word advisories: 0; historical baseline: 334."
  ],
  "rejected": [
    {
      "option": "Key by fingerprint only",
      "reason": "Two identical attributed sentences in one file would collapse into one baseline entry and hide a second quotation."
    }
  ],
  "reopenWhen": "A baseline key collides across two fields of one file."
}
```

## WO-188-D013 — Item 11: a removed release-history block and an unreadable tag annotation fail the check

```json
{
  "id": "WO-188-D013",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 11",
  "decision": "checkReleaseHistory returns a failure, with the message the writer shares, when product 06 lacks its release-history block, and a failure that names the tag when a local release tag's annotation cannot be read; neither throws.",
  "evidence": [
    "scripts/lib/release-history.mjs missingBlock and the guarded newer-tag read; scripts/test-docs-check.mjs fixtures for both."
  ],
  "rejected": [
    {
      "option": "Keep the advisory for the missing block",
      "reason": "A product document whose generated block is gone is wrong, not stale."
    }
  ],
  "reopenWhen": "The check passes a product 06 without its block."
}
```

## WO-188-D014 — Item 12: new Markdown never carries an absolute home or private temporary path; the entropy subject is relative

```json
{
  "id": "WO-188-D014",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 12",
  "decision": "docs-check screens every tracked and untracked Markdown file in its scope for an absolute home path or a private temporary path and fails a line that is not in the baseline; today's 214 lines in 124 files are fingerprinted per file as a counted multiset under doc-baseline.json homePaths, so an immutable report keeps its lines and a new record gets none. The entropy review's subject record and the refutation subject name the repository as '.'. No WO-188 Markdown holds such a path.",
  "evidence": [
    "scripts/docs-check.mjs HOME_PATH, homePathFindings, checkDocs; docs/control/doc-baseline.json homePaths; scripts/lib/entropy-review.mjs subjectRecord; scripts/test-docs-check.mjs and scripts/test-entropy-review.mjs fixtures; node scripts/docs-check.mjs: 214 declared historical home-path lines; 0 failures."
  ],
  "rejected": [
    {
      "option": "Rewrite the 214 historical lines",
      "reason": "Immutable reports stay as written (assumption 7); the screen is forward-only."
    }
  ],
  "reopenWhen": "A later order resolves a failure by adding a line to homePaths instead of writing a relative path or a placeholder. Limits: the screen reads Markdown under the configured document roots and the home and private-temporary roots the planning pass named; a path under /var/tmp, /root or a JSON-escaped form passes it, package READMEs are outside its scope, and an entropy run record still writes its frozen copy's temporary path in scratchRepository."
}
```

## WO-188-D015 — Item 13: the operator-word check is widened, a typed quotation without a capture digest refuses, and eight lines are paraphrased

```json
{
  "id": "WO-188-D015",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 13",
  "decision": "The check reads a decision's evidence, rejected reasons, misread and meant fields, operator-named fields and report or planning paragraphs, fingerprinting each finding under a stable key; 34 earlier keys stay byte-identical and 300 widened findings join them, 334 in all, every one historical. The only refusal is a typed operatorQuote that lacks a captureSha256; the attributed-words regex stays advisory and reports no current finding. Eight lines in six records were paraphrased by the route WO-178 used (WO-112 D062 and D067, WO-185 D017, WO-186 D039, WO-102 D009 and D010, WO-140 D005); WO-187 D039 was a reader defect fixed by anchoring the fence strip; WO-181 D008 is retained because an amendment binds its words. The three register rows those records govern were re-recorded by one batch.",
  "evidence": [
    "scripts/docs-check.mjs operatorWordFindings and operatorQuoteFailures; docs/control/doc-baseline.json operatorWords (334 keys); docs/evidence/WO-188/operator-word-repair.json (343 records: 8 paraphrased, 1 reader fix, 334 retained); docs/control/local/wo188-item13-redispose.json applied to FUP-4feed3b6e7a451ef (settled at revision 3), FUP-a5c6ac8cb40bd52a (deferred at revision 6) and FUP-bdfe7ebb85eb6e22 (settled at revision 2); scripts/test-docs-check.mjs 42 tests."
  ],
  "rejected": [
    {
      "option": "Refuse every regex finding in new text",
      "reason": "The 2026-10-07 pass decided the refusal is for a typed quotation lacking a digest; the regex cannot tell a paraphrase from a quotation."
    }
  ],
  "reopenWhen": "A new record quotes operator words without a capture digest and the check admits it."
}
```

## WO-188-D016 — Item 14: four release-preparation hardenings

```json
{
  "id": "WO-188-D016",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 14",
  "decision": "release prepare --integration refuses once the stub marker is written and names the continuation command, writing nothing; a decisions record reached through a symbolic link, in any mode, refuses with the realpath rule; a lone conflict opener, closer or base marker line is a conflict while a lone ======= is not; regenerate's read of the stub is guarded.",
  "evidence": [
    "scripts/lib/release-preparation.mjs integrationPreparationRefusal, throughLink, decisionsConflicted; scripts/release.mjs prepare guard; scripts/lib/worktree-integration.mjs regenerate; scripts/test-release-preparation.mjs (three new tests) and scripts/test-release.sh prepare_independent."
  ],
  "rejected": [
    {
      "option": "Treat a lone ======= as a conflict",
      "reason": "A Markdown setext underline is that line; the opener and closer are unambiguous."
    }
  ],
  "reopenWhen": "A preparation writes through a link or a conflicted record is prepared."
}
```

## WO-188-D017 — Item 15: the integration fixture overlays the console package and its fixture script; a broken console export fails the suite

```json
{
  "id": "WO-188-D017",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 15",
  "decision": "overlayImplementation copies scripts/console-fixtures.mjs and packages/console from the working tree without build output, dependency links or the console's generated fixtures, whose manifest names the evidence editions of the revision that recorded them. With the export of readFixtureManifest removed in the working tree, five real-generator cases fail because the fixture cannot build the console; with the bytes restored the suite passes.",
  "evidence": [
    "scripts/test-worktree-integration.mjs overlayImplementation and 'the fixture overlay carries the console package and its fixture script from the working tree without build output'; docs/evidence/WO-188/ac15-overlay-evidence.txt: step 2 (broken: 18 pass, 5 fail), step 3 (bytes restored, digest verified), steps 4 to 6 (the first restored run failed two real-generator cases because the overlay carried the regenerated console fixtures manifest that points at this worktree's uncommitted WO-188 feedback edition; the overlay now leaves generated fixtures to the fixture's own tree, and the two cases and the whole suite pass); steps 7 to 9 repeat the removed-export run against the final overlay (five real-generator cases fail on the TypeScript error that names readFixtureManifest in packages/console/test/board.test.ts, through the fixture's own npm run build) and the restored run (23 pass)."
  ],
  "rejected": [
    {
      "option": "Overlay the generated fixtures and the evidence editions they name",
      "reason": "The fixture is a coherent committed tree; carrying uncommitted evidence into it would hide the very staleness the regenerator is meant to catch."
    }
  ],
  "reopenWhen": "A console source change that breaks its regenerator passes the integration suite."
}
```

## WO-188-D018 — Item 16: release list prints a tag whose changed-file list is not an array

```json
{
  "id": "WO-188-D018",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 16",
  "decision": "manifestWorkOrders attributes nothing when notes.changedFiles is a string, an object or a number; release list prints the row with none recorded and no longer throws.",
  "evidence": [
    "scripts/lib/release-tags.mjs manifestWorkOrders; scripts/release.mjs list; packages/console/test/collect.test.ts rewritten block (tags with a string, an object and a number print none recorded)."
  ],
  "rejected": [
    {
      "option": "Coerce a string into a one-item list",
      "reason": "A recorded shape the writer never produced is not evidence of a changed file."
    }
  ],
  "reopenWhen": "release list crashes on a recorded manifest."
}
```

## WO-188-D019 — Item 17: four feed edges

```json
{
  "id": "WO-188-D019",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 17",
  "decision": "namesPath drops leading parent components before matching; the no-main advisory names the order and prints the --touching command, or an unavailable advisory when no order is selected; a refutation export refuses the five reserved lane names before creating anything; a destination outside the repository is judged only on rev-parse status 0 or the not-a-repository status 128 under LC_ALL=C, and any other failure refuses with the reason.",
  "evidence": [
    "scripts/lib/planning-followups.mjs namesPath; scripts/lib/lifecycle-evidence.mjs; scripts/refute-plan.mjs RESERVED_LANE_NAMES and outsideRepository; scripts/test-plan-refutation.mjs and scripts/test-process-debt.mjs fixtures."
  ],
  "rejected": [
    {
      "option": "Treat every rev-parse failure as outside",
      "reason": "A failure that is not Git's not-a-repository message is unknown, and unknown never admits."
    }
  ],
  "reopenWhen": "An export lands on a reserved lane or a path judged outside turns out to be inside."
}
```

## WO-188-D020 — Item 18: the whitespace check reads untracked files, with exemptions by attribute

```json
{
  "id": "WO-188-D020",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 18",
  "decision": "The lifecycle whitespace check copies the index, adds untracked files with intent-to-add from a NUL-separated pathspec, skips the directory entries Git lists for nested repositories, and runs git diff --check over the copy; byte-exact captures are exempt by the -whitespace attribute for docs/evidence/**/*.txt, *.tap, *.log and corpus/manifests/runs/*.log.",
  "evidence": [
    "scripts/lib/lifecycle-evidence.mjs; .gitattributes; scripts/test-process-debt.mjs item 18 fixture (verifies Git lists nested/ and that the check skips it)."
  ],
  "rejected": [
    {
      "option": "Stage the untracked files in the real index",
      "reason": "A completion check must not change the index it judges."
    }
  ],
  "reopenWhen": "An untracked file with trailing whitespace passes completion, or a capture is refused for its bytes."
}
```

## WO-188-D021 — Item 19: the remaining live launch default is pinned

```json
{
  "id": "WO-188-D021",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 19",
  "decision": "plan refute --transport codex-cli-exec launches with TRANSPORT_DEFAULTS' model gpt-6.1-sol at effort max; the six dated-record probe scripts say beside their model literal that they regenerate a dated record; product 07 §Model-specific notes, the security runbook and the refutations README state the default.",
  "evidence": [
    "scripts/refute-plan.mjs; scripts/harness-probe.mjs, scripts/target-worker-smoke.mjs, scripts/harness-live-smoke.mjs, scripts/evidence-mission-check.mjs, scripts/probe-codex-effort.mjs, scripts/evidence-resident-actors.mjs; docs/product/07-execution-guide.md, docs/AI-HARNESS-SECURITY.md, docs/planning/refutations/README.md; scripts/test-plan-refutation.mjs."
  ],
  "rejected": [
    {
      "option": "Repin the dated-record scripts to the current model",
      "reason": "A script that regenerates a dated record keeps the model that record names; the attestation records what ran."
    }
  ],
  "reopenWhen": "The pinned worker model changes."
}
```

## WO-188-D022 — Item 20: the binding check compares the profile identifier

```json
{
  "id": "WO-188-D022",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 20",
  "decision": "resident-bind --check reports a mismatch when the binding record's profileId differs from the repository's authorityProfile, and a missing profileId is a mismatch.",
  "evidence": [
    "scripts/resident-bind.mjs portfolioMismatches; scripts/test-resident-bind.mjs (22 tests)."
  ],
  "rejected": [
    {
      "option": "Admit a missing profileId as legacy",
      "reason": "A binding without a profile cannot be shown to match the envelope it claims."
    }
  ],
  "reopenWhen": "A binding with a foreign profile passes the check."
}
```

## WO-188-D023 — Item 21: two helper duplicates are removed and a detector keeps them out

```json
{
  "id": "WO-188-D023",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 21",
  "decision": "plan-failures reuses sha256Hex and product-read-guard spawns Git through spawnGit; meta.mjs, test-host-guard and test-worktree-integration lost their direct Git spawns; scripts/test-helper-reuse.mjs asserts that no script defines a bare-hex sha256 or spawns Git outside the library, with allowances for scripts/lib/git.mjs, scripts/lib/plan-subject.mjs, the async spawn in scripts/test-harness.mjs and quoted text in the gate-sandbox-race loader.",
  "evidence": [
    "scripts/lib/plan-failures.mjs, scripts/lib/product-read-guard.mjs, scripts/lib/meta.mjs, scripts/test-host-guard.test.mjs, scripts/test-worktree-integration.mjs; scripts/test-helper-reuse.mjs (5 tests)."
  ],
  "rejected": [
    {
      "option": "Allow the detector to match its own sample strings",
      "reason": "The samples are assembled at run time so the detector cannot pass by matching itself."
    }
  ],
  "reopenWhen": "A script spawns Git directly or defines its own digest. The detector also scans untracked scripts and a quoted git followed by a space; scripts/test-process-debt.mjs is allowed for the fixture command strings that quote a Git push inside shell text."
}
```

## WO-188-D024 — Item 22 moved to WO-196; criterion 22's measure recorded, with the executor root larger than at this order's base

```json
{
  "id": "WO-188-D024",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 22",
  "decision": "Item 22 landed in WO-196 (8928dc80): the executor root holds the fork sentence and no instruction to name an experiment before implementation and no per-order duty; the briefing prints no experiment line and prints an order's **Experiment:** header; every generated role root carries the goal-alignment sentence once and none asks for all eight lenses; npm run meta accepts the existing experiment records. The measure this order owes: at the base the executor root was 21,255 bytes; adding the comment sentence and the scratch sentence that criteria 23 and 1 require took it to 21,792, 537 larger, because the fall the planner expected had already happened in WO-196 before this order's base. The executor root held four rules twice, once in a numbered step and again in a later sentence (the status and times rule, the implement-and-prepare rule, the scratch rule and the completion rule), so each restatement was folded into its step: step 4 carries the bump clause, step 5 the scratch rule, and the completion sentence keeps only what the steps do not say. That brings the root to 21,009 bytes, 246 smaller than at the base, with every reviewed rule still stated once. The reviewer root grows by 53 bytes and the release-close root by 166 for the scratch sentence; verifier, planner and refuter are unchanged; every cold start stays under its ceiling, so no ceiling moved and no acceptance was recorded. Criterion 22 is met.",
  "evidence": [
    "docs/evidence/WO-188/role-roots-before.txt (at 28d32e26) and role-roots-after.txt (after node scripts/harness.mjs emit); docs/control/budgets.json limits.coldStartBytes; grep over .claude/skills/dotln-*/SKILL.md and .agents/skills/dotln-*/SKILL.md: 'Goal Alignment: Before a material choice' once per root, no 'eight lenses', no 'pre-register'; scripts/resume.mjs prints the **Experiment:** header; the economy sentence in the executor root."
  ],
  "rejected": [
    {
      "option": "Record the byte clause unmet and hand off with the root 537 bytes larger",
      "reason": "An unmet criterion at handoff is a verification failure and a repair cycle, as the operator said during resume: next on 2026-10-09 (paraphrased); the root stated four rules twice, so stating each once meets the clause without dropping a reviewed rule, and the operator's standing direction that an optimization retains useful instructions holds."
    },
    {
      "option": "Read 'this order's base' as the planner's earlier measurement",
      "reason": "The base is 28d32e26; the criterion's words are judged as written and the off-ramp for an accepted unmet criterion is the operator's waive, never the executor's reading."
    }
  ],
  "reopenWhen": "A later role edit moves a root past its ceiling, or a reader finds a rule the consolidation dropped rather than restated."
}
```

## WO-188-D025 — Item 23: a comment says what the code does; the document gate refuses labels and leading identifiers; the baseline holds registered files only

```json
{
  "id": "WO-188-D025",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 23",
  "decision": "The executor's role text carries the comment rule. scripts/lib/comment-labels.mjs reads every tracked and untracked code file outside the document roots, generated surfaces, build output and dependency trees, takes JavaScript and TypeScript comment bodies from the parser (never a string, template or regex) and shell comments by line, and refuses a line that carries a verification or final-review finding label or a bare F, N or R token, a bare decision number not qualified by its order in the same block, or an order identifier that leads a block. Today's lines pass by fingerprint under docs/control/comment-baseline.json: 48 lines in 21 files, every one an evidence-edition source; the baseline only shrinks, an edited baselined line fails, and a file outside every edition is never baselined. The check and its fixtures run in the document selection. Of the 320 findings at installation (222 order-lead, 74 finding-label, 24 decision-number in 120 files), the 272 in 99 files outside every edition were rewritten: three read-only drafters returned 267 exact edits (517,560 tokens, 674 s), each applied by unique match; every edit changed comment text only, the 23 decision identifiers they qualified exist in their records, and node scripts/comment-labels.mjs passes with 0 failures. Test names that carry identifiers are left alone, as planning recorded. The adversary review widened the check before handoff: a JSDoc body's first row is read without its star and the first non-empty row of a block is judged for a leading identifier, which found 29 more lines (20 in registered files, now baselined; 9 rewritten); a finding named before or after its report without a letter and the bare letters reports use (F, N, R, B, A, M) count; a shell heredoc's data lines are not comments. The baseline holds 81 lines in 27 registered files. Nothing compares the baseline or its admitted map with main's copy, so a later order could add a fingerprint or an admission; the planning receipt's reopening condition for these refusals is the review that catches it.",
  "evidence": [
    "scripts/lib/comment-labels.mjs, scripts/comment-labels.mjs, scripts/test-comment-labels.mjs (5 tests), scripts/test-runner.mjs rows comment-labels and comment-labels-fixtures, scripts/lib/document-gate-stubs.mjs; packages/skeleton/src/loadouts/contributor.ts and packages/skeleton/test/executor-supports.test.ts (the sentence is the executor's alone); docs/control/comment-baseline.json; the drafters' inputs and outcome under this session's scratch (comment-draft-*.json, comment-draft-outcome.json), not retained."
  ],
  "rejected": [
    {
      "option": "Fix only the 67 finding-label lines outside the editions and baseline the other 205 unregistered lines",
      "reason": "The planning document decides the cleanup covers every file that owes no re-mint; a baseline that admits unregistered files would never shrink there. This was the fork the economy sentence names; the chosen arm cost three drafters and the other was not run, so no two-arm comparison is recorded."
    },
    {
      "option": "Fix the 48 lines in registered files too",
      "reason": "The order's non-goals exclude sweeping identifiers from registered sources; the baseline is the designed route and the next order that edits such a file fixes its comments."
    }
  ],
  "reopenWhen": "A later order resolves a comment failure by editing the baseline or suppressing the check instead of fixing the line, or the operator widens the rule to every identifier."
}
```

## WO-188-D026 — Item 24: the meter table omits unavailable cells and rows, body links are absolute, the Release title appears once

```json
{
  "id": "WO-188-D026",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); item 24",
  "decision": "renderMetaTable leaves an unavailable observation blank, drops a dispatch row with nothing observed and ends with one line counting the omissions; a published body's relative links are rewritten absolute to the repository at the reviewed revision or reduced to text, and the body-profile check refuses a relative link; the Release text holds the order's title once with id-only headings. The last closed order's body and Release text were regenerated into evidence.",
  "evidence": [
    "scripts/lib/meta.mjs renderMetaTable; scripts/lib/github-body.mjs absoluteBodyLinks, relativeLinkFailures, githubBodyProfileFailures; scripts/release.mjs releaseEdition, regeneratedPullRequestBody, regeneratedReleaseText; scripts/worktree.mjs publish; docs/evidence/WO-188/wo199-pr-body.md, wo199-release.md and wo199-regeneration.json (unavailableCells 0, one counting line, relative links 0, absolute 4 and 10, title once); scripts/test-github-body.mjs (23), scripts/test-release.sh edition assertions, scripts/test-process-debt.mjs meter tests; docs/product/08-publication-compiler.md §PRs and commits."
  ],
  "rejected": [
    {
      "option": "Print 'unavailable' in the cell",
      "reason": "The word reads as a value; a blank cell and one counting line say what is missing without inventing a number."
    }
  ],
  "reopenWhen": "A regenerated body holds a relative link or an unavailable cell. Limits: links are read by pattern, not by a Markdown parser; an angle-bracket destination, a single-quoted title and a bracketed definition are handled, while a nested bracket in link text and an HTML anchor are neither rewritten nor refused. An order row with every value unavailable is omitted like a dispatch row."
}
```

## WO-188-D027 — Re-mints, versions, role roots and the role oracle

```json
{
  "id": "WO-188-D027",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); steps 15 and 16; release prepare --local",
  "decision": "Compiler 0.25.5 to 0.26.0 (a new hook registration) and skeleton 0.55.1 to 0.56.0 (a new host event, the material machinery, the loadout sentences), with the console and lockfile pins; the console's own version is unchanged; HARNESS_HOST_VERSION stays 0.35.0. release prepare --local assigned v0.70.0 (D002). The harness bundle re-emitted 34 surfaces and checks. All four editions are re-minted as WO-188 editions: artifact-identity and verification as revision 001 by --write; authority as revision 003 by --write, after two re-mints the handoff sequence staled: the formatter changed the generated bundle after 001 was minted, and the executor's consolidation of its restated rules changed it after 002; the writer preserves a minted revision rather than overwrite it, so 001 and 002 stay as written; feedback as revision 001 by --carry from WO-199 feedback-004 (only component release labels moved; no live episode); the console self-host fixture is recorded; every check passes. The role oracle wo188-role-baseline.json chains from wo196 (its bytes digested) and WO-185 upstream, is read by the renamed process-debt test and is a declared machinery source.",
  "evidence": [
    "packages/*/package.json, package-lock.json, packages/compiler/src/artifact-identity.ts; docs/evidence/current.json; docs/evidence/WO-188/edition-checks.txt; docs/evidence/WO-188/role-roots-before.txt and role-roots-after.txt; packages/skeleton/fixtures/wo188-role-baseline.json; scripts/test-process-debt.mjs 'WO-145 optional economy support preserves historical snapshots through WO-188 ...'; scripts/test-runner.mjs machinerySources."
  ],
  "rejected": [
    {
      "option": "Bump the harness host version",
      "reason": "The host version left the behavioural sources on 2026-09-16 and has not moved since; the skeleton version carries the release."
    }
  ],
  "reopenWhen": "An edition check fails at the integrated revision or a later role edit changes a root without a new oracle."
}
```

## WO-188-D028 — Criterion 25: from the two registries, no judged feedback source was edited

```json
{
  "id": "WO-188-D028",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); criterion 25",
  "decision": "The two registries are scripts/lib/evidence-sources.mjs (the registered sources whose edits stale an edition) and FEEDBACK_SOURCE_PATHS in packages/skeleton/src/feedback-audit.ts (59 judged feedback sources, read from the built export). Registered sources this order edits against 28d32e26: package-lock.json, packages/compiler/package.json, packages/compiler/src/artifact-identity.ts, packages/compiler/src/harness.ts, packages/skeleton/package.json, packages/skeleton/src/gate-evidence.mjs, packages/skeleton/src/harness-host.ts, packages/skeleton/src/loadouts/contributor.ts, scripts/lib/paths.mjs. Judged sources touched: package-lock.json, packages/compiler/src/artifact-identity.ts and packages/skeleton/package.json; every change there is a release label or a version pin (the compiler and skeleton versions and their workspace pins), which judgedBehavior excludes and which the feedback carry confirmed as a label move with the judged behaviour unchanged. An earlier draft of this record counted 36 judged sources from a truncated read and named one touched file; the adversary review corrected it. The 48 baselined comment lines in registered files were not edited.",
  "evidence": [
    "git diff --name-only 28d32e26 intersected with each registry at the time of this record; node scripts/feedback-evidence.mjs --carry output: 'only component release labels moved; no live episode'; docs/evidence/WO-188/edition-checks.txt."
  ],
  "rejected": [
    {
      "option": "Run a live feedback episode",
      "reason": "The order names no live row for feedback and the judged behaviour is unchanged; the carry is the designed route."
    }
  ],
  "reopenWhen": "A judged source changes by more than a release label before final review."
}
```

## WO-188-D029 — Write-backs, publication locks and the register rows the close retargets

```json
{
  "id": "WO-188-D029",
  "date": "2026-10-08",
  "dispatch": "resume: next (2026-10-08, executor claude-fable-5-1 at xhigh); criterion 26",
  "decision": "In place and undated: product 07 §Goal-aligned decisions (the lens sentence), §Discipline (the scratch rule, the comment rule, the experiment and goal-alignment sentences), §Workflow closeout and releases (the close removes scratch repositories; the material grammar; the declaration step gone) and §Model-specific notes (item 19); product 05 §Candidate — Tinkerer / Scientist (the support's fork trigger replaces the default-equipment sentence; the forward reference now credits WO-196); docs/AI-HARNESS-SECURITY.md (the launch default and the failed-command clause); docs/planning/refutations/README.md; docs/product/08-publication-compiler.md §PRs and commits. The publication locks were refreshed and npm run publication:check passes. docs/evidence/WO-188/close-register.md prepares the close dispositions for the 23 source rows of the planning table, the Tinkerer candidate row, the WO-187 retarget row and the two follow-ups this record mints; the closing reviewer applies them.",
  "evidence": [
    "git diff 28d32e26 -- docs/product/05-pattern-library.md docs/product/07-execution-guide.md docs/product/08-publication-compiler.md docs/AI-HARNESS-SECURITY.md docs/planning/refutations/README.md docs/publication/; node scripts/check-publication.mjs --print-locks; docs/evidence/WO-188/close-register.md."
  ],
  "rejected": [
    {
      "option": "A dated paragraph per write-back",
      "reason": "Criterion 26 asks for each in place with no dated paragraph; the decisions carry the dates."
    }
  ],
  "reopenWhen": "A product sentence this order wrote disagrees with the generated role text."
}
```

## WO-188-D030 — Verification: unignored nested scratch blocks close

```json
{
  "id": "WO-188-D030",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail criterion 1 in VER-001 and return the unignored nested-repository case to repair in this order. D003 records the case as a low-priority follow-up, but that disposition does not discharge the original criterion's removal of a committed nested repository outside the scratch lanes. Do not edit the implementation in the verifier role or waive the criterion in prose.",
  "evidence": [
    "docs/evidence/WO-188/verifier-001/scratch-release.mjs and checks.txt: two independent fixture executions insert outside-lanes/probe after review. The actual release close publishes in a local forge double, records cleanup blocked, lists no material or removal, and leaves the scratch repository present. The latest bounded replay finished 2026-10-09T02:41:09.196Z, exit 1.",
    "scripts/lib/worktree-material.mjs inventoryMaterial reads ignored directory units and re-included intake units, omitting ordinary untracked nested repositories; scripts/worktree.mjs ensureMaterialClean consequently treats this repository as dirt.",
    "Independent protected-boundary probes retain intake, declared gitlinks and linked worktrees; release_case_submodule_force retains the populated submodule before any scratch deletion. These protections remain repair invariants."
  ],
  "rejected": [
    {
      "option": "Accept the passing ignored-path fixture and leave the unignored case as a nonblocking follow-up",
      "reason": "That would narrow criterion 1 without authorization; outside-lanes/probe is a standalone repository outside intake and the tracked tree."
    },
    {
      "option": "Repair the inventory during verification",
      "reason": "The verifier judges the selected subject independently; implementation changes belong to resume: fix."
    }
  ],
  "reopens": {
    "decisionId": "WO-188-D003",
    "observation": "The documented unignored omission reproduces a blocking close and an absent removal record for the original criterion's outside-lane case; the earlier low-priority disposition cannot stand for this criterion."
  },
  "reopenWhen": "Repair removes the unignored standalone scratch repository without a flag or blocker, records its path, head and remoteHeld, and retains intake, declared submodules and linked worktrees."
}
```

## WO-188-D031 — Verification: valid relative Markdown links bypass publication checks

```json
{
  "id": "WO-188-D031",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail criterion 24 in VER-001. A valid nested link label and a destination with balanced parentheses remain relative after absoluteBodyLinks and are accepted by githubBodyProfileFailures with links enabled. The regenerated WO-199 example passes, but it does not discharge the check's refusal rule for these valid link forms.",
  "evidence": [
    "docs/evidence/WO-188/verifier-001/api-attacks.mjs and checks.txt: the unedited Prettier Markdown parser reads [nested [label]](../evidence/WO-188/decisions.md) and [file](file(1).md) as links. Both return an empty body-profile failure list and unchanged relative destinations. A plain relative link is refused and rewritten as the positive control. Latest bounded replay finished 2026-10-09T02:44:36.275Z, exit 1 with two counterexamples.",
    "scripts/lib/github-body.mjs linkPattern is shared by relativeLinkFailures and absoluteBodyLinks and excludes these two forms; D026 already records the nested-label limit."
  ],
  "rejected": [
    {
      "option": "Treat the disclosed parser limit as a waiver",
      "reason": "There is no operator waiver; criterion 24 requires the body-profile check to refuse a relative link."
    },
    {
      "option": "Judge publication only from the current WO-199 example",
      "reason": "That tests one generated body and leaves the declared refusal bypass intact."
    }
  ],
  "reopens": {
    "decisionId": "WO-188-D026",
    "observation": "Regenerating a body containing either valid link form leaves a rendered relative link and the profile admits it."
  },
  "reopenWhen": "Every rendered relative link in these forms is normalized to an absolute target or removed, and any remaining relative link is refused while code examples and ordinary absolute links retain their behavior."
}
```

## WO-188-D032 — Verification: the full document gate fails in the loopback case

```json
{
  "id": "WO-188-D032",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail criterion 27 in VER-001 because two fresh npm run test:docs runs at the selected subject fail the same bound-resident loopback case with TypeError: fetch failed. Preserve the passing isolated control and committed-base comparisons. The repeated gate failure is observed; its cause and attribution to a particular source edit are not established. The verifier neither changes source nor relaxes the gate to pass it.",
  "evidence": [
    "docs/evidence/WO-188/verifier-001/checks.txt: full document runs recorded 2026-10-09T02:48:25.044Z and 2026-10-09T02:56:15.618Z each show 30 passed, one failed, 31 fresh tasks, with console-docs failing one of 27 cases. Both comparison runs classify current failure/base pass as introduced against 28d32e26fade7b7d2fe6ed00c43707ad58b87f70; that mechanical classification establishes no cause.",
    "The isolated case with a scratch-only fetch error diagnostic passed at 2026-10-09T02:53:13.731Z, bounded duration 14156 ms. No failure cause was emitted. The diagnostic recorded no request headers, tokens or bodies.",
    "The covering executor review gate at code identity c4f2870c166bb356fbc1a432d8ea34e384c5bdbdc7ee6dd0eac6e41ea8af97ee still stands: review selection, 41 suite groups, 93 fresh tasks, exit 0, recorded 2026-10-09T01:56:20.681Z. format:check and git diff --check pass; dependency changes are version pins."
  ],
  "rejected": [
    {
      "option": "Pass criterion 27 from the executor's older document result or the isolated case",
      "reason": "The current full gate is explicitly required and has reproduced a failure twice."
    },
    {
      "option": "Claim an introduced implementation regression from the base comparison alone",
      "reason": "The comparison and the isolated pass do not establish which change, timing condition or interaction caused the failure."
    }
  ],
  "followup": "WO-188 repair: diagnose and resolve the full document gate's bound-resident loopback failure before repair-complete. Reproduction: npm run test:docs; case in packages/console/test/console-commands.test.ts. Inspect packages/skeleton/src/console-loopback.ts, packages/console/src/console-client.ts and scripts/test-runner.mjs as evidence directs, retain safe fetch cause/stack diagnostics without request secrets, and compare isolated and full-suite behavior. Keep the required gate and assertions; establish a fresh passing full document run at the repaired subject. Cause is currently unknown.",
  "reopenWhen": "A repaired subject has a fresh passing full document gate and evidence explaining or bounding the repeated loopback failure; an isolated pass alone is insufficient."
}
```

## WO-188-D033 — Repair of VER-001 F1: a nested repository Git lists as untracked is inventoried like an ignored one

```json
{
  "id": "WO-188-D033",
  "date": "2026-10-09",
  "dispatch": "resume: fix (2026-10-09, executor claude-fable-5-1 at xhigh); VER-001 F1, criterion 1",
  "decision": "Rule the repaired code holds: Git reports a nested repository as one directory unit whether an ignore rule covers it or it is merely untracked, and the inventory reads both listings, so a repository cloned after review under a path no ignore rule covers is scratch like an ignored one. It is named by the completion advisory, excused from the dirt check of a worktree about to go, removed at close with no flag and no blocker, and recorded with its path, its head commit and whether a remote held it. A preserved repository Git lists as untracked is a byte-proven unit that may need --force like a re-included intake unit, because it was archived and verified just before removal. Main keeps every repository it holds, so only its protected intake units are excused from main's dirt check. Intake, declared submodules and linked worktrees keep their boundaries. D030's reopening condition is met.",
  "evidence": [
    "scripts/lib/worktree-material.mjs inventoryMaterial reads git ls-files --others --exclude-standard with and without --ignored and keeps the trailing-slash units; scripts/worktree.mjs ensureMaterialClean excuses every inventoried unit in a worktree that leaves and only intake units in main (leaving: false at finish); removePreservedWorktree admits --force for every preserved row. scripts/lib/paths.mjs is not edited, so no evidence edition is staled.",
    "The verifier's own reproduction passes after the repair: node scripts/harness.mjs bounded -- node docs/evidence/WO-188/verifier-001/scratch-release.mjs exits 0 with publication published, cleanup clean, material outside-lanes/probe disposable, one removal with its head and remoteHeld false, no blocker and the repository gone.",
    "Cases the report did not quote: scripts/test-release.sh release_case_material mode untracked plants a repository at outside-lanes/probe after the reviewed candidate with no ignore rule; the preview records one would-remove row with its head and the publishing close removes it, records the removal and leaves no retained material or recovery lane. scripts/test-process-debt.mjs 'a nested repository outside intake ...' inventories outside-lanes/probe as disposable from the lane, classifies it as an other-lane scratch repository and preserves it under an operator word.",
    "Runs: bash scripts/test-release.sh --case material (69 s), submodule_force, malformed_material and close_completion pass under node scripts/harness.mjs bounded; bash scripts/test-worktree.sh passes (171 s); node --test --test-name-pattern 'nested repository outside intake|linked worktree of another repository|closeout classifies nested|unborn repositories' scripts/test-process-debt.mjs: 4 passed."
  ],
  "rejected": [
    {
      "option": "Excuse every inventoried repository from main's dirt check as well",
      "reason": "Nothing leaves main at a close, so an untracked repository there would stay without a word; main keeps today's refusal, which names the path."
    },
    {
      "option": "Add an ignore rule for the probe path in the fixture instead of reading the untracked listing",
      "reason": "That re-narrows criterion 1 to ignored paths; the verifier's repository has no ignore rule by construction."
    }
  ],
  "reopenWhen": "A close records cleanup blocked or a dirty-worktree blocker for a nested repository outside intake that the tracked tree does not declare, whatever its ignore status; or a preserved untracked unit refuses removal as unpreserved untracked material after its bytes verified."
}
```

## WO-188-D034 — Repair of VER-001 F2: the installed Markdown parser decides what renders as a link; the rewriter reads every single-line inline link

```json
{
  "id": "WO-188-D034",
  "date": "2026-10-09",
  "dispatch": "resume: fix (2026-10-09, executor claude-fable-5-1 at xhigh); VER-001 F2, criterion 24",
  "decision": "Rule the repaired code holds: a published body or Release text carries no relative link the installed Markdown parser renders. The rewriter reads each inline link on one line as CommonMark does: an optional exclamation mark, a label with balanced brackets and backslash escapes, optional spaces, a destination in angle brackets or bare with balanced parentheses, an optional double-quoted, single-quoted or parenthesized title, optional spaces and the closing parenthesis. It writes the link absolute at the reviewed revision with parentheses percent-encoded, so the destination reads the same to a renderer that balances them and to one that does not. A relative link the rewriter cannot see, such as a label or destination split across lines, is refused by the profile check, which walks the parser's link, image and definition nodes. Code spans, fences and indented code hide their links from both. Raw HTML anchors are opaque to the parser and remain outside this rule, as they were for the verifier's oracle. D031's reopening condition is met.",
  "evidence": [
    "scripts/lib/github-body.mjs: inlineLinks, closingBracket, bareDestinationEnd, unescapedIndex and escaped replace the single regular expression; relativeLinkFailures walks the nodes of prettier/plugins/markdown, loaded on first use through createRequire so a caller that never checks links pays nothing; proseLines also skips indented code. The parser is the one scripts/docs-check.mjs already imports; no dependency is added.",
    "The verifier's own reproduction: node scripts/harness.mjs bounded -- node docs/evidence/WO-188/verifier-001/api-attacks.mjs now passes all three link probes, refusing the plain, nested-label and parenthesized forms and rewriting each; its one remaining failure is the executor product gate at the current identity, which the review gate below records.",
    "Cases the report did not quote, in scripts/test-github-body.mjs: a padded destination, a parenthesized title, an escaped bracket in a label, a label holding a code span with a bracket, a link split across two lines that the rewriter leaves and the profile refuses at its line, an indented code block left byte-for-byte, and a nested label written as its own text when no GitHub target exists. node --test scripts/test-github-body.mjs: 25 passed.",
    "Two adjacent defects inside the bound are fixed with it: the rewriter took the label from the masked line, so a label holding a code span was written as spaces; and it rewrote link-shaped text inside indented code. The fixture copies of scripts/lib in scripts/test-release.sh and scripts/test-worktree.sh resolve the launchpad's parser through a node_modules/prettier link in the fixture root, as the launchpad does; the worktree fixture's publish passes through that path."
  ],
  "rejected": [
    {
      "option": "Widen the regular expression by one nesting level",
      "reason": "That closes the two quoted forms and not the class, which is whatever the parser renders as a link."
    },
    {
      "option": "Rewrite through the parser's node offsets as well",
      "reason": "A link split across lines rewritten onto one line changes the body's lines under the profile's soft-wrap reading; a refusal that names the line leaves the author in control of the text."
    },
    {
      "option": "Fall back to the line scanner when the parser is not installed",
      "reason": "A conditional rule; every launchpad has the parser because the document gate imports it, and the fixture copies now resolve it the same way."
    }
  ],
  "reopenWhen": "A body the parser renders with a relative link, image or definition passes githubBodyProfileFailures with links enabled; absoluteBodyLinks changes bytes inside a code span, fence or indented code block; or a publication needs a raw HTML anchor checked."
}
```

## WO-188-D035 — Repair of VER-001 F3: a loopback response closes its connection; the gate failure was a keep-alive timer race that gate load exposed

```json
{
  "id": "WO-188-D035",
  "date": "2026-10-09",
  "dispatch": "resume: fix (2026-10-09, executor claude-fable-5-1 at xhigh); VER-001 F3, criterion 27",
  "decision": "Rule the repaired code holds: every console loopback response carries connection: close and the resident ends the socket after the body, so a caller never writes into an idle socket the resident may have timed out. Cause: Node's HTTP server times out an idle keep-alive socket after five seconds. The bound-resident case runs the resident in the test's own process and compares each served result with synchronous terminal runs on both sides of it; under gate load those runs stall the shared event loop long enough for the server's timer to expire. The client then reuses the socket in the same turn, the server's expired timer fires first in the timers phase and destroys the socket before the poll phase delivers the request bytes, and the client reads ECONNRESET, which fetch reports as 'fetch failed'. Across processes the same class reads a reset or refused connection after any stall longer than the server's window. The loopback sources changed only in comments in this order, so the race was latent at the base and surfaced by load. The client now names the cause of a transport failure, the socket error's code and message, never the token or the request. D032's reopening condition is met once the fresh full document gate below is recorded.",
  "evidence": [
    "docs/evidence/WO-188/repair-001/loopback-probes.txt: under twenty busy processes the unrepaired case failed on its first attempt twice; the traced attempt shows fetch #4 start at 8702 ms, the server socket destroyed at 8703 ms by Socket.socketOnTimeout from processTimers, and the client's read ECONNRESET at 8704 ms. A plain in-process stall of 5.5 s passed in all three server arms (default, connection: close, keepAliveTimeout 0) because the client's own idle timer, when it fires first, reopens the connection; which expired timer runs first decides the outcome, which is why the verifier's isolated control passed.",
    "packages/skeleton/src/console-loopback.ts sets connection: close before any response; packages/console/src/console-client.ts wraps both fetches so a transport failure reads 'console request failed (<code>: <message>)'. The console client still imports no Node API.",
    "Cases the report did not quote, in packages/console/test/console-commands.test.ts: a raw keep-alive request on the loopback port is answered with connection: close and the resident ends the socket itself within five seconds; every transport refusal response carries connection: close. After the repair six consecutive loaded attempts pass with every response connection: close and no keep-alive hint; the plain console suite passes 6 of 6 in 29 s.",
    "Two credible ways differed on one axis, where the idle socket is closed: at the server after each response, or never at the server (keepAliveTimeout 0) leaving the client to close. Both arms passed the simple stall; the chosen arm is the one a reader and a test can observe on every response, and the other remains exposed to Node's headers timeout on an idle socket after a longer stall."
  ],
  "rejected": [
    {
      "option": "Set the server's keepAliveTimeout to 0",
      "reason": "No idle close at the server either, but a longer stall still meets Node's headers timeout on an idle socket, and the rule is observable only indirectly."
    },
    {
      "option": "Retry a reset request in the client",
      "reason": "An invoke is not idempotent: it records a receipt and runs a command."
    },
    {
      "option": "Wait for the first tick in the test or drop the adjacent terminal runs",
      "reason": "The stall is the test's legitimate byte comparison; the race is the resident's to remove."
    },
    {
      "option": "Keep a 5.5 s stall in the test as the regression",
      "reason": "The stall reproduces the failure only when the server's timer wins the timers phase; the raw-socket contract case is deterministic and the loaded probe is recorded."
    }
  ],
  "reopenWhen": "A loopback response is observed without connection: close, a console transport failure reads 'fetch failed' without its cause, or the bound-resident case fails again in a full document gate."
}
```

## WO-188-D036 — Verification: an empty rendered destination survives publication

```json
{
  "id": "WO-188-D036",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Fail criterion 24 in VER-002: the body-profile check admits an empty Markdown destination and actual publication leaves it as a relative link. Record the reproduced class for this order's repair; the verifier does not modify implementation.",
  "evidence": [
    "docs/evidence/WO-188/verifier-002/links.mjs and checks.txt: the installed Markdown parser renders [empty]() as a link with url equal to the empty string. githubBodyProfileFailures with links enabled returns no failure and absoluteBodyLinks leaves it unchanged. Empty angle-bracket destinations, an empty image destination and an empty reference definition show the same predicate gap. Nonempty nested, multiline, fragment, root and parent-escape controls retain their refusal or normalization.",
    "docs/evidence/WO-188/verifier-002/publish.mjs and checks.txt: the actual worktree publish path, using a local bare origin and forge double, publishes [empty]() unchanged; emptyDestinationPublished is true. No external forge was contacted.",
    "scripts/lib/github-body.mjs schemeless requires destination.length > 0; both the parser-based refusal and normalization use it. D034 promises no relative destination the parser renders."
  ],
  "rejected": [
    {
      "option": "Treat an empty URL as absence of a rendered link",
      "reason": "The parser produces a link node with url equal to the empty string and the actual publish capture retains its Markdown. The destination has no absolute scheme."
    },
    {
      "option": "Narrow the criterion to the repaired nonempty examples",
      "reason": "Criterion 24 refuses a relative link and the original criterion was not waived or amended."
    }
  ],
  "reopens": {
    "decisionId": "WO-188-D034",
    "observation": "The original nested-label and parenthesized findings are repaired, but an empty rendered destination bypasses the same refusal and survives publication."
  },
  "followup": "WO-188 repair, VER-002 F1: handle empty rendered link and image destinations under the absolute-or-absent publication contract. Keep refusal and rewrite consistent, with parser and actual-publication assertions for [empty]() and empty angle-bracket forms.",
  "reopenWhen": "The empty-destination probe and actual publication fixture show no surviving relative link: it is rewritten absolute, reduced to plain text or refused by the body profile. Retain all existing link and code controls."
}
```

## WO-188-D037 — Verification: publication rewrites a literal mixed-backtick code span

```json
{
  "id": "WO-188-D037",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Fail VER-002 for a reproduced regression in behavior main had: the new publication normalizer rewrites link-shaped literal text inside a valid mixed-backtick inline code span. Route it as blocking under product 07's main-behavior rule, rather than inventing another unmet acceptance criterion. This defect exists in the original WO-188 implementation as well as its repair.",
  "evidence": [
    "docs/evidence/WO-188/verifier-002/code-spans.mjs and checks.txt: the installed parser renders the two-backtick span containing [sample](file.md) and an embedded single backtick as inlineCode, with no link node. absoluteBodyLinks nevertheless changes its literal file.md to an absolute repository URL. Opposite-order embedded backticks, three-backtick spans, simple code spans and indented code are controls.",
    "docs/evidence/WO-188/verifier-002/publish.mjs and checks.txt: the actual worktree publication capture changes that literal code example from the committed body; the byte-equality assertion fails after publication in a local forge double.",
    "scripts/lib/github-body.mjs proseLines masks only code spans whose contents contain no backtick. git show 28d32e26fade7b7d2fe6ed00c43707ad58b87f70:scripts/worktree.mjs shows publication forwarding the tracked body bytes before this normalizer was added. git show b2167dc1f40a156a27e4f81ee66ea2a00ad319f5:scripts/lib/github-body.mjs shows the same masking predicate before repair.",
    "docs/product/07-execution-guide.md §Verification review and attack routes an observed main-behavior regression as blocking. WO-188-D034 explicitly requires code spans to hide their links from both refusal and rewriting."
  ],
  "rejected": [
    {
      "option": "Rewrite a URL-looking substring even though it is inline code",
      "reason": "The renderer treats the whole span as literal code, so rewriting changes the example rather than resolving a rendered link."
    },
    {
      "option": "Classify this as a new repair-only maintainability follow-up",
      "reason": "The defect was already present in the original WO-188 subject, and the actual publication probe demonstrates behavior changed from main."
    }
  ],
  "reopens": {
    "decisionId": "WO-188-D034",
    "observation": "The documented code-span byte-preservation rule fails for a span with a shorter embedded backtick run, and actual publication changes the committed code example."
  },
  "followup": "WO-188 repair, VER-002 F2: preserve every valid inline code span byte-for-byte during link normalization, including shorter embedded backtick runs. Prefer parser source positions or a scanner that follows the delimiter-run rule; retain existing code fences, indented code and link-label code-span controls.",
  "reopenWhen": "The mixed-backtick preservation probe and actual-publication byte-equality assertion pass while the relative-link guard continues to refuse unresolved rendered links."
}
```

## WO-188-D038 — Repair of VER-002 F1: an empty destination is a relative link; the rewriter writes its text and the profile refuses what survives

```json
{
  "id": "WO-188-D038",
  "date": "2026-10-09",
  "dispatch": "resume: fix (2026-10-09, executor claude-fable-5-1 at xhigh); VER-002 F1, criterion 24",
  "decision": "Rule the repaired code holds: a destination is relative when it carries no scheme and is not protocol-relative, and an empty destination is one of them, since the forge resolves it to the body's own page. The rewriter treats it as it treats a bare fragment or an escaping path and writes the link, image or definition as its text; the profile check names an empty destination in its refusal instead of printing nothing after 'relative link'. One shared predicate decides for both, so refusal and rewriting cannot disagree on it. D036's reopening condition is met.",
  "evidence": [
    "scripts/lib/github-body.mjs: schemeless no longer requires a nonempty destination; resolved already returned null for an empty path, so [empty]() is written as 'empty'; assertGitHubBodyProfile prints 'relative link with an empty destination' when the href is empty.",
    "The verifier's own reproductions: node scripts/harness.mjs bounded -- node docs/evidence/WO-188/verifier-002/links.mjs exits 0 with failed 0 over the empty bare, empty angle-bracket, empty definition and empty image forms, and the publish probe's actual publication through the forge double records emptyDestinationPublished false (docs/evidence/WO-188/repair-002/verifier-002-probes.txt).",
    "Cases the report did not quote, in scripts/test-github-body.mjs: an empty angle-bracket destination with a title and an empty image destination on one line with the bare form, each refused at its line with an empty href and each written as its text, the published line passing the link profile, and the profile's message for the empty form. node --test scripts/test-github-body.mjs: 27 passed.",
    "scripts/test-worktree.sh: the committed fixture body now carries an [empty]() link; the actual publication through the forge double writes it as 'empty' and the fixture fails if '[empty]()' reaches the published body. bash scripts/test-worktree.sh: worktree tests passed."
  ],
  "rejected": [
    {
      "option": "Refuse an empty destination at the profile only and leave the rewriter alone",
      "reason": "The publish step would refuse a body whose stored form shows a well-formed link; writing the text is the treatment every other unresolvable destination already gets."
    },
    {
      "option": "Treat an empty URL as no link",
      "reason": "The parser renders a link node and the forge renders an anchor to the page itself; the rule is about what renders."
    }
  ],
  "reopenWhen": "A body whose parser-rendered link, image or definition has an empty destination passes githubBodyProfileFailures with links enabled, or absoluteBodyLinks leaves such a destination in place."
}
```

## WO-188-D039 — Repair of VER-002 F2: the rewriter masks code and raw HTML at the parser's own positions, so refusal and rewriting share one reading of what is prose

```json
{
  "id": "WO-188-D039",
  "date": "2026-10-09",
  "dispatch": "resume: fix (2026-10-09, executor claude-fable-5-1 at xhigh); VER-002 F2, criterion 24 under the main-behavior rule",
  "decision": "Rule the repaired code holds: the rewriter reads inline links only in text the installed Markdown parser renders as prose. Before a line is scanned, every range the parser reports as an inline code span, a code block or raw HTML is replaced by spaces at the parser's line and column, so a link-shaped sequence inside a code span of any backtick runs, a code span that crosses lines, a fenced or indented code block, or a raw HTML block or tag is never read as a link and keeps its bytes. The hand-written code-span expression and the line-by-line fence and indentation tracker are gone from the rewriter; the parser that already decides what renders as a link (D034) now decides what is code for refusal and rewriting alike. D037's reopening condition is met.",
  "evidence": [
    "docs/evidence/WO-188/repair-002/parser-oracle.txt: the parser's nodes and positions for the mixed-backtick span, both orders of embedded runs, an unmatched opener, an escaped opener, a span closed by the backtick after a backslash, a span across two lines, spans inside a quote and a list item, a span inside a link label, a tab-indented line, a non-ASCII and a non-BMP character, and a carriage-return line ending. The parser follows the delimiter-run rule and counts columns in UTF-16 code units excluding a trailing carriage return, which is what the masking relies on.",
    "The verifier's own reproductions: node scripts/harness.mjs bounded -- node docs/evidence/WO-188/verifier-002/code-spans.mjs exits 0 with failed 0, and the publish probe's actual publication through the forge double leaves the committed code example byte-for-byte (docs/evidence/WO-188/repair-002/verifier-002-probes.txt).",
    "Cases the report did not quote, in scripts/test-github-body.mjs: the opposite embedding order and a three-backtick span on the same line; a code span across two lines with a real link after it on the second line, the span left and the link rewritten; an escaped opening backtick and a span closed by the backtick after a backslash, each leaving a real link that is rewritten; a raw HTML block holding link-shaped text and an inline tag holding one in an attribute, both left; a span inside a quoted line with a real link after it. node --test scripts/test-github-body.mjs: 27 passed, the earlier fence, indented-code, label-code-span and split-link cases among them.",
    "scripts/test-worktree.sh: the committed fixture body carries the mixed-backtick example and the fixture compares the published line byte-for-byte; bash scripts/test-worktree.sh: worktree tests passed."
  ],
  "rejected": [
    {
      "option": "A hand-written scanner that follows the delimiter-run rule",
      "reason": "A second reading of code beside the parser's: the two would still disagree on code spans across lines, on raw HTML and on whatever the parser does next, and each disagreement is this finding again."
    },
    {
      "option": "Rewrite links through the parser's node offsets as well",
      "reason": "D034's reason stands: a link split across lines rewritten onto one line changes the body's lines under the profile's soft-wrap reading; refusing it at its line leaves the author in control."
    },
    {
      "option": "Keep the fence and indentation tracker beside the parser positions",
      "reason": "Two mechanisms for one question; the parser's code nodes cover fenced and indented code inside quotes and list items, which the earlier cases still show."
    }
  ],
  "reopenWhen": "absoluteBodyLinks changes a byte inside a range the installed parser renders as inlineCode, code or html, or a link the parser renders in prose is left relative by the rewriter and passes the profile."
}
```

## WO-188-D040 — Adjacent repair: the sealed release case runs under its own fixture name, so the whole release fixture runs end to end

```json
{
  "id": "WO-188-D040",
  "date": "2026-10-09",
  "dispatch": "resume: fix (2026-10-09, executor claude-fable-5-1 at xhigh); adjacent to VER-002 F2, met while running the order's named check bash scripts/test-release.sh",
  "decision": "Rule the repaired fixture holds: every release case owns the fixture directory named after it. The sealed variant of the close-completion case passes its own name to the shared case body, so a whole-script run, which copies the sealed template once per case into one test root, no longer copies onto the tree the first run left. The runner's per-case invocations, each in its own test root, were never affected, which is why the review gate's release group passed while the order's named check did not.",
  "evidence": [
    "bash scripts/test-release.sh before the fix: exit 1 at 'PROGRESS release case close_sealed started' with 'Fixture destination already contains a repository' (scripts/lib/release-fixtures.mjs copyReleaseTemplate), twice, once concurrently with another fixture and once alone; the close_completion case had passed moments earlier in the same run. scripts/test-release.sh: release_case_close_sealed called release_case_close_completion, whose first line was make_repo close_completion, and no other line named that fixture.",
    "npm test -- --only release before the fix: suite:release 2 passed, 0 failed, 54 fresh tasks, 94.37 s; the runner passes --case and --template per case.",
    "After the fix: bash scripts/test-release.sh --case close_sealed exits 0 with 'release tests passed'; bash scripts/test-release.sh exits 0 end to end with 'release tests passed'."
  ],
  "rejected": [
    {
      "option": "Remove the sealed alias from the case list",
      "reason": "The runner selects the alias by name; removing it drops a gate task."
    },
    {
      "option": "Have make_repo remove an existing fixture directory before copying",
      "reason": "copyReleaseTemplate refuses an occupied destination on purpose, so a case never runs over another case's tree; the alias was the only case that asked it to."
    }
  ],
  "reopenWhen": "A whole-script bash scripts/test-release.sh run refuses a fixture destination, or a case list entry maps onto another case's fixture name."
}
```

## WO-188-D041 — Verification: CR-only Markdown disagrees with the rewriter's line inventory

```json
{
  "id": "WO-188-D041",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-003",
  "kind": "finding",
  "decision": "Record a blocking regression from main in VER-003 and return the line-position mismatch to repair. The installed Markdown parser treats a lone carriage return as a line ending, while proseLines splits only at newline. Code on a later CR-only line is therefore left unmasked or masked against a different physical line. The independent API probe changes both an inline code span after a paragraph and an indented code block inside a list. The actual worktree publication path refuses an otherwise valid committed body with Invalid count value: -2; the same fixture with the recorded base helpers publishes successfully and retains the literal code. The original criterion 24 absolute-or-absent link obligation is met at this subject; the main-behavior rule supplies the blocking route without inventing another criterion.",
  "evidence": [
    "docs/evidence/WO-188/verifier-003/links.mjs and checks.txt: 36 literal-code/HTML cases over LF, CRLF and CR; two CR-only cases fail equality with their source, and the unedited parser reports code nodes with no rendered link. All 24 LF/CRLF cases pass. The base GitHub body profile accepts the two CR-only inputs.",
    "docs/evidence/WO-188/verifier-003/publish.mjs and checks.txt: current-helper publication exits 1 with Invalid count value: -2 after the committed-surface, profile, authorship and authentication controls pass. --baseline installs the recorded HEAD versions of the publication entry points and scripts/lib in the temporary fixture; it exits 0 with publishedLiteralPreserved true. Both use local bare origins and a forge double.",
    "scripts/lib/github-body.mjs proseLines uses markdown.split(\"\\n\") with parser line/column ranges. The base scripts/worktree.mjs passes publicationBody directly to withTemporaryBody; current worktree publication first calls absoluteBodyLinks. The covering current review gate and the 27 GitHub-body fixtures pass, leaving this input class untested there."
  ],
  "rejected": [
    {
      "option": "Treat the passing LF and CRLF controls as all line-ending forms",
      "reason": "The installed parser recognizes CR-only lines too, and the base publication fixture accepts them. The differing coordinate systems are independently observable."
    },
    {
      "option": "Repair the normalizer or rewrite the submitted body in the verifier role",
      "reason": "Verification judges the selected subject and writes evidence. The next executor chooses the bounded implementation repair."
    }
  ],
  "reopens": {
    "decisionId": "WO-188-D039",
    "observation": "Parser positions do not address the rewriter's LF-only line inventory for CR-only input; the code-preservation rule fails and actual publication regresses the recorded base."
  },
  "followup": "WO-188 repair, VER-003 F1: make source-range masking and the rewriter use compatible coordinates for LF, CRLF, CR-only and mixed line endings, preserving code and raw-HTML bytes. Prefer parser offsets or an exact source line inventory. Reproduce the inline/list API failures and the actual publication failure with verifier-003 links.mjs and publish.mjs, retain empty-link and mixed-backtick repair controls, and establish a fresh passing document gate and covering review row.",
  "reopenWhen": "The current publication fixture accepts the CR-only body and preserves its code, and all literal-range controls pass without changing their input bytes."
}
```

## WO-188-D042 — Verification follow-up: a Markdown destination's escapes become literal filename bytes

```json
{
  "id": "WO-188-D042",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-003",
  "kind": "finding",
  "decision": "Board escaped-destination normalization as a nonblocking follow-up. The parser reads file\\(1\\).md as file(1).md, but the rewriter URL-encodes the raw source destination including its backslashes, producing file%5C%281%5C%29.md instead of file%281%29.md. The resulting link is absolute and passes the declared profile, so criterion 24 still holds. Main forwarded a file-relative link into the forge body and did not provide a working repository target for this case; this probe establishes no behavior regression from main.",
  "evidence": [
    "docs/evidence/WO-188/verifier-003/links.mjs escaped-destination-rendered-target and checks.txt: parsedURL file(1).md, sameTarget false, current output includes %5C; relative-link refusal and absolute-or-absent controls pass.",
    "scripts/lib/github-body.mjs inlineLinks slices destination from the source line and resolved applies encodeURI directly. The installed, unedited Markdown parser supplies the contrasting rendered URL."
  ],
  "rejected": [
    {
      "option": "Fail criterion 24 because the absolute URL addresses a different filename",
      "reason": "The declared criterion requires absolute or absent links, which this output satisfies. There is no independently established working main behavior for this relative forge link."
    }
  ],
  "followup": "Publication destination normalization: resolve the parser's rendered destination or decode Markdown backslash escapes before URL encoding, preserving the filename and existing authority/path-escape checks. Add a comparison against the parser URL for escaped parentheses and other escaped punctuation in scripts/test-github-body.mjs; verify actual publication if the shared normalizer changes. Declared surfaces: scripts/lib/github-body.mjs and its publication callers. Priority low; VER-003 F2 is nonblocking and may be handled by the next repair within the adjacent-repair bound.",
  "reopenWhen": "The escaped-parenthesis example resolves to file%281%29.md without encoded backslashes, with the existing path containment and absolute-link refusal controls intact."
}
```

## WO-188-D043 — Repair of VER-003 F1: the rewriter and the profile read the lines the parser counts, under every Markdown line ending

```json
{
  "id": "WO-188-D043",
  "date": "2026-10-09",
  "dispatch": "resume: fix (2026-10-09, executor claude-fable-5-1 at xhigh); VER-003 F1, criterion 24 under the main-behavior rule",
  "decision": "Rule the repaired code holds: the rewriter and the profile read a body as the same physical lines the installed Markdown parser counts. A line ends at a newline, at a carriage return and newline, or at a lone carriage return; each line is kept with the ending that followed it and the body is reassembled byte-for-byte; a leading byte-order mark, which the parser leaves outside its line and column count, is kept outside the inventory too. The parser's line and column therefore address the inventory's lines whatever ending each line uses, so every range it renders as code or raw HTML is masked on the line it names, a link on a carriage-return line is rewritten like any other, and a valid body never fails publication on a coordinate the inventory cannot address. The profile's soft-wrap line numbers and the parser's link line numbers count the same lines. D039's reopening condition, met by D041, is held again.",
  "evidence": [
    "docs/evidence/WO-188/repair-003/line-endings-oracle.txt: the parser's nodes for the three line endings, mixed endings, a tab, a byte-order mark and the escaped, referenced and percent-encoded destinations. A lone carriage return starts a new line as the other two endings do; offsets index the source string; after a byte-order mark both offsets and columns are one short, so the mark is outside the parser's count.",
    "docs/evidence/WO-188/repair-003/verifier-003-probes.txt: the verifier's API attack reports expanded-parser-preservation failures 0 over its 36 literal cases under newline, carriage return and newline, and lone carriage return, the two failing cases among them, and every relative-link refusal passes; the actual publication probe exits 0 with publishedLiteralPreserved true, as does its newline control. The probe's closing assertion, that the escaped-destination finding still reproduces, fails after D044 and is its only nonzero exit.",
    "docs/evidence/WO-188/repair-003/before-repair.txt: the extended unit fixture run against the pre-repair checkpoint refs/dotln/checkpoint/WO-188/13 fails its two new tests, the first by rewriting file.md inside the carriage-return code span; after the repair node --test scripts/test-github-body.mjs passes 29.",
    "Cases the report did not quote, in scripts/test-github-body.mjs: one body mixing the three endings, with a fence closed on a lone-carriage-return line, a raw HTML block on carriage-return-and-newline lines, a code span and a real link on a lone-carriage-return line and a definition ended by carriage return and newline, every ending preserved and the link, the definition and an image rewritten; a leading byte-order mark kept, with the span beside it masked and the link rewritten; a lone-carriage-return body whose soft wrap the profile reports between lines 1 and 2 and whose relative link it reports on line 4, the parser's line.",
    "scripts/test-worktree.sh: the committed body carries a lone-carriage-return paragraph, a code span on such a line and a relative link on a carriage-return-and-newline line; the forge double receives the lines and their code byte-for-byte and the link absolute. node scripts/harness.mjs bounded -- bash scripts/test-worktree.sh: exit 0, worktree tests passed, 91,153 ms."
  ],
  "rejected": [
    {
      "option": "Mask by the parser's offsets over the whole string instead of by line and column",
      "reason": "The oracle shows the offsets index the source string but, like the columns, run one short after a byte-order mark; and the scanner still reads a line at a time, so an inventory split the way the parser splits lines is needed either way and serves the mask, the scan and the profile alike."
    },
    {
      "option": "Normalize every line ending to newline before rewriting",
      "reason": "The published body must keep the committed bytes; a normalized body is a changed body, and the literal-equality rule the verifier's probes assert would fail on every carriage-return line."
    },
    {
      "option": "Leave the profile on its newline-only split",
      "reason": "Its soft-wrap line numbers and the parser's link line numbers share one failure list and one printed line; two line counts in one message is the coordinate disagreement again."
    }
  ],
  "reopenWhen": "absoluteBodyLinks changes a byte inside a range the parser renders as inlineCode, code or html under any line ending, a body that passes the profile fails publication on a coordinate, or the profile and relativeLinkFailures report different line numbers for one physical line."
}
```

## WO-188-D044 — Repair of VER-003 F2: a link is rewritten only where the parser renders one, at the destination the parser renders

```json
{
  "id": "WO-188-D044",
  "date": "2026-10-09",
  "dispatch": "resume: fix (2026-10-09, executor claude-fable-5-1 at xhigh); VER-003 F2, the follow-up D042 boards, taken within the adjacent-repair bound because its fix is the rule D043 already applies at the same positions",
  "decision": "Rule the repaired code holds: a link is rewritten only where the installed Markdown parser renders one, and its destination is the one the parser renders, with backslash escapes and character references resolved. The line scanner still finds each link's extent on its line, but it asks the parser's link, image or definition node at that column whether the sequence is a link and what it addresses; a bracket pair the parser does not render as a link, such as the outer pair around a nested link, keeps its bytes while the scan continues inside it, and a definition is rewritten only where the parser renders one. So an escaped parenthesis, a parenthesis spelled as a character reference and an ampersand spelled as one all address the file they name, a scheme spelled by reference is absolute and stays, and the scanner no longer interprets a destination's spelling on its own.",
  "evidence": [
    "docs/evidence/WO-188/repair-003/verifier-003-probes.txt: the verifier's escaped-destination comparison reports sameTarget true, the rewritten link ending file%281%29.md with no encoded backslash; the probe's closing assertion that the finding still reproduces is what fails.",
    "docs/evidence/WO-188/repair-003/line-endings-oracle.txt: the parser's url for file\\(1\\).md, file&#40;1&#41;.md, a&amp;b.md and file\\_1.md is the resolved name; for &#104;ttps://example.invalid/a it is the absolute URL; for the brackets around a nested link only the inner link is a node; a percent-encoded destination passes through as spelled.",
    "docs/evidence/WO-188/repair-003/before-repair.txt: against the pre-repair checkpoint the new destination test fails on every one of those forms, and the reference-spelled scheme was rewritten to a repository path, a wrong absolute link the report did not quote.",
    "Cases the report did not quote, in scripts/test-github-body.mjs: a parenthesis and an ampersand spelled as character references, an escaped underscore, a scheme spelled by reference left as it is, outer brackets around a nested link left as text while the inner link is rewritten, with and without a GitHub target, and a definition whose destination carries an escaped parenthesis. node --test scripts/test-github-body.mjs: 29 passed.",
    "grep over docs/final-reviews/*/PR.md and docs/releases/*.md: no reviewed body or release note holds a percent-encoded or backslash-escaped destination today."
  ],
  "rejected": [
    {
      "option": "Decode backslash escapes in the scanned destination before encoding",
      "reason": "It closes the quoted case and leaves character references, which the parser also resolves, as the same finding again; a decoder for named references is a second reading of the destination beside the parser's."
    },
    {
      "option": "Keep rewriting a scanned link the parser has no node for, with its raw destination",
      "reason": "Such a sequence is text to the renderer; rewriting it changes what the reader sees and leaves the link inside it relative for the profile to refuse."
    }
  ],
  "followup": "Publication destination encoding: a destination already percent-encoded in the source, such as file%281%29.md, is encoded again by encodeURI to file%25281%2529.md and addresses a different filename from the one the renderer resolves. Decide whether a %XX triplet passes through unchanged, weighing that a %2F passed through reaches the forge as a path separator the containment check never saw; add the comparison against the parser's url to scripts/test-github-body.mjs. Declared surface: scripts/lib/github-body.mjs resolved. Priority low; no reviewed body or release note links this way today.",
  "reopenWhen": "A rendered link's rewritten path differs from the parser's url for the same source once encoded, or a sequence the parser renders as text is rewritten."
}
```

## WO-188-D045 — Observation: the runner's format-preflight fixture failed once under the full review gate and passed alone

```json
{
  "id": "WO-188-D045",
  "date": "2026-10-09",
  "dispatch": "resume: fix (2026-10-09, executor claude-fable-5-1 at xhigh); met while running the order's final gate after the VER-003 repair",
  "decision": "Record, not repair. In the first npm test -- --review after this repair, the scripts/test-runner.test.mjs case 'format preflight stops plain and review before product tasks, and stays fresh across document edits' failed: its fourth nested gate exited 1 as the case expects after the README edit, but the format task's captured output was empty where the file name was expected; the other 40 suites passed. npm test -- --only runner-fixtures then passed the suite in 70.03 s, and the composed review gate is rerun for criterion 27's row. The cause is not established: this repair's diff touches neither the runner nor its fixtures, and one observation without a reproduction does not name the loaded host or anything else. The failure is boarded with its captured diagnostic rather than retried until green and forgotten.",
  "evidence": [
    "docs/evidence/WO-188/repair-003/review-gate-runner-fixtures.txt: the case's diagnostic from the first gate (not ok 128, 'The input did not match the regular expression /README\\.md/', actual ''), the gate's closing row 'npm test: 40 passed; 1 failed; 1469.27 s; 93 fresh tasks', and the isolated rerun's 'PASS runner-fixtures 70.03 s'.",
    "git diff refs/dotln/checkpoint/WO-188/13 --stat: scripts/lib/github-body.mjs, scripts/test-github-body.mjs and scripts/test-worktree.sh are the only code files this repair changes."
  ],
  "rejected": [
    {
      "option": "Rerun the full gate until it passes and record nothing",
      "reason": "A pass after a silent retry hides an observed failure; the failed row stays recorded and the excerpt is kept beside it."
    },
    {
      "option": "Name the loaded host as the cause",
      "reason": "One observation and no reproduction; a premature cause was the trap named for this order's first repair and it holds here."
    }
  ],
  "followup": "Runner fixture under load: the scripts/test-runner.test.mjs case 'format preflight stops plain and review before product tasks, and stays fresh across document edits' once recorded a nested gate that exited 1 with an empty format-task output after the README edit, during a full review gate, and passed alone. Reproduce it under a loaded host or rule that out, and make the case print the nested gate's task rows when the output is empty so the next occurrence names what ran. Declared surfaces: scripts/test-runner.test.mjs, scripts/test-runner.mjs. Priority low.",
  "reopenWhen": "The case fails again in any gate, with or without load."
}
```

## WO-188-D046 — Verification follow-up: rewriting a nested destination can expose another rendered link

```json
{
  "id": "WO-188-D046",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-004",
  "kind": "finding",
  "decision": "Board nested-link normalization as a nonblocking follow-up. For `Outer [a [b]() d](e.md).` the installed Markdown parser initially renders only the empty inner link. Removing its wrapper produces `Outer [a b d](e.md).`, which renders a new relative outer link. The same happens when the inner destination is a fragment or escapes the repository. For `Outer [a ![b]() d](e.md).` the parser initially renders both the outer link and the empty image; the scanner rewrites the outer link and advances past its label, leaving the empty image untouched. The publication profile refuses all four resulting bodies for their remaining rendered relative destination. Criterion 24 allows that refusal; these probes establish no unrelated regression from main and no publication escape.",
  "evidence": [
    "docs/evidence/WO-188/verifier-004/links.mjs nested-null-destination cases and checks.txt: parser nodes before and after normalization, remaining destination e.md or the empty image destination, and relative-link profile failures for all four cases.",
    "scripts/lib/github-body.mjs inlineLinks advances its cursor to the end of each yielded outer link; absoluteBodyLinks rewrites from the original parser inventory once, while githubBodyProfileFailures parses the resulting body again. The latter retains the refusal boundary."
  ],
  "rejected": [
    {
      "option": "Fail criterion 24 or edit implementation during verification",
      "reason": "The declared profile refuses the unresolved links as required, and this read-only role does not change implementation to improve its verdict. No unrelated main behavior has been shown broken."
    },
    {
      "option": "Repeat normalization without checking structural progress",
      "reason": "Repeated parsing may handle the exposed outer link but does not itself address the nested image skipped inside an already absolute outer link; a bounded structural treatment needs explicit evidence."
    }
  ],
  "followup": "Publication nested-link normalization: handle nested rendered image ranges and prevent removing an inner link wrapper from exposing an unresolved outer link. Compare the parser's rendered destinations before and after edits, preserving literal code, source line endings and path-containment rules; keep the profile refusal when normalization cannot complete. Add the four nested-null-destination cases to scripts/test-github-body.mjs and verify actual publication if the shared normalizer changes. Declared surfaces: scripts/lib/github-body.mjs and its publication callers. Priority low; VER-004 F1 is nonblocking.",
  "reopenWhen": "A reviewed body uses a nested empty, fragment or escaping destination and publication refuses after normalization, or any resulting relative destination passes the publication profile."
}
```

## WO-188-D047 — Integration at final review: main moved by WO-074; the editions, the release target and two sibling checks reconciled

<!-- integration refs/dotln/checkpoint/WO-188/18 -->

```json
{
  "id": "WO-188-D047",
  "date": "2026-10-09",
  "dispatch": "resume: final review; worktree integrate WO-188",
  "decision": "Integrate main into the WO-188 worktree at final review. The branch base was 28d32e26fade7b7d2fe6ed00c43707ad58b87f70 and main had moved to e3b386635ae1c22f4f9e583928f5dbcdedbb0cbc (WO-074's launchpad export and its v0.70.0 release preparation), so the helper fast-forwarded the uncommitted branch and re-applied the work from its named stash. One authored conflict, docs/evidence/current.json, where main named WO-074's four editions and the branch WO-188's, is resolved to WO-188 (authority 003, artifact-identity 001, verification 001, feedback 001): this order re-minted every edition at its base against registered sources it edited and criterion 25 judges those editions, while WO-074's were minted before every one of those edits; all four --check commands pass at the integrated tree, so main's one-line root package.json change stales none. The release target is retimed from v0.70.0 to v0.71.0 under the recorded minor classification, because v0.70.0 is published at main's head; the helper rewrote the order heading, the README release line, the meter snapshot and the PR meter. Two of this order's own checks refused main's bytes at the integrated tree and are reconciled as integration bookkeeping, not findings. The comment-label check refused the leading order identifier in scripts/launchpad.mjs line 2 and scripts/test-launchpad.mjs line 1, files no evidence edition registers, so both comments now lead with their explanation and carry the identifier after it, a comment-only edit under item 23's rule for an unregistered file with no behavior changed. The helper-reuse test then refused the bare-hex sha256 that scripts/test-launchpad.mjs defined at its line 57 (found by review worker A), so that definition is replaced by the shared sha256Hex of scripts/lib/helpers.mjs imported under the same local name, the substitution the test's own fixture names as allowed; the helper is the same digest expression, and after it node --test scripts/test-launchpad.mjs passes 10 and scripts/test-helper-reuse.mjs passes 5. The home-path screen refused four lines WO-074 published before the screen existed, docs/evidence/WO-074/criterion-6-local-terms.md lines 7 and 12, docs/final-reviews/WO-074/FINAL-001.md line 92 and docs/verifications/WO-074/VER-001.md line 27, two of them in immutable reports, so their fingerprints join the doc-baseline homePaths multiset as lines that hold a path today, the policy of operator-review assumption 7; this is the integration case the forward-only rule reserves for lines that already exist, never a later order baselining its own. Every acceptance claim VER-004 judged is carried forward with its original evidence: WO-074 touched no surface a criterion names as its own, its scripts/test-runner.mjs and package.json edits being an added suite row and an added script name merged additively, while the three checks of this order that judge every file in the repository were reconciled with its new files as above; the code identity moved from 32a84b4680042faaa4980d10b2c36c6a1fcad5d85d1de6ab0483a015a6d2a637 to the integrated identity FINAL-001 names, and criterion 27's gates run fresh there. The close-register batch in docs/evidence/WO-188/close-register.json applies the dispositions close-register.md prepared.",
  "evidence": [
    "refs/dotln/checkpoint/WO-188/18",
    "base 28d32e26fade7b7d2fe6ed00c43707ad58b87f70; upstream e3b386635ae1c22f4f9e583928f5dbcdedbb0cbc; named stash e98f77a735b89fa0539c40bd4d18c05a475d0c48 retained",
    "release preparation: Retimed WO-188: v0.70.0 → v0.71.0 above the observed release baseline v0.70.0. Files changed: docs/work-orders/WO-188-boarded-machinery-items.md, README.md, docs/evidence/WO-188/meta.json, docs/final-reviews/WO-188/PR.md. Meter snapshot: docs/evidence/WO-188/meta.json, 4194 bytes. Tag observation: local snapshot only.",
    "affected checks at the integrated tree: npm run publication:check (254/254 headings, both outlines CURRENT), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (every pin and publish guard passes), git diff --check over the index, HEAD and the untracked files through a temporary index (clean), authority, artifact-identity, verification and feedback --check (each verified; feedback carried from docs/evidence/WO-199/feedback-004); node scripts/comment-labels.mjs: 2 failures before the two comment rewrites, 0 after, 81 baselined lines unchanged; node scripts/docs-check.mjs: 4 home-path failures before the baseline entries, 0 after, 218 declared historical home-path lines",
    "node --test scripts/test-helper-reuse.mjs: 4 pass, 1 fail before the digest substitution (scripts/test-launchpad.mjs: defines a bare-hex sha256; import sha256Hex from scripts/lib/helpers.mjs), 5 pass after; node --test scripts/test-launchpad.mjs: 10 pass after; docs/evidence/WO-188/final-001/worker-a.md A1",
    "docs/final-reviews/WO-188/FINAL-001.md, Integration and Executed checks"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Point the registry at WO-074's editions, or re-mint WO-188's again at the integrated tree",
      "reason": "WO-074's editions predate every registered source this order edited; WO-188's check current at the integrated tree, so a re-mint would record the same programs under a new revision for nothing."
    },
    {
      "option": "Return the two refused comment lines and the four refused home-path lines through repair and a fresh verification",
      "reason": "Neither is a behavior change or an acceptance defect: a comment rewrite and a baseline entry for lines a sibling published before the checks existed are the reconciliation product 07 §Independent workflows and integration admits, and the immutable reports among them cannot be edited at all."
    },
    {
      "option": "Edit WO-074's evidence record to a placeholder instead of baselining its two lines",
      "reason": "It is a closed sibling's record outside this order's surfaces; the baseline keeps its bytes and the screen still refuses any new line."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance, or a later order resolves a comment-label or home-path failure in its own new lines by editing a baseline instead of the line; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-09. Original base: `28d32e26fade7b7d2fe6ed00c43707ad58b87f70`.
Fetched main: `e3b386635ae1c22f4f9e583928f5dbcdedbb0cbc`. Checkpoint: `refs/dotln/checkpoint/WO-188/18`.
Named stash retained: `e98f77a735b89fa0539c40bd4d18c05a475d0c48` (WO-188 integrate 2026-10-09).
Resolved projections: docs/control/current.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-188: v0.70.0 → v0.71.0 above the observed release baseline v0.70.0. Files changed: docs/work-orders/WO-188-boarded-machinery-items.md, README.md, docs/evidence/WO-188/meta.json, docs/final-reviews/WO-188/PR.md. Meter snapshot: docs/evidence/WO-188/meta.json, 4194 bytes. Tag observation: local snapshot only.
Carried-forward claims: all 27 criteria as VER-004 judged them, with their original evidence; WO-074 touched no surface a criterion names as its own, the three repository-wide checks of this order were reconciled with its new files (two comment lines, four record lines, one digest helper), and criterion 27's two gates are run fresh at the integrated identity FINAL-001 records.
Authored conflicts observed: docs/evidence/current.json, resolved to WO-188's four editions.
Affected checks: executed; every one passed (FINAL-001, Executed checks).

## WO-188-D048 — Final review: five low findings of the host and document-gate review worker, boarded

```json
{
  "id": "WO-188-D048",
  "date": "2026-10-09",
  "dispatch": "resume: final review; FINAL-001 review worker B (harness host, role text, document gate, comment check, body and Release text)",
  "kind": "finding",
  "decision": "Board, not repair: five low findings of the read-only review worker over group B, each outside the criteria as written and breaking no behavior main had, so each is a follow-up by rule. None changes a criterion judgment: criterion 23's check refuses what the order named and passes the explanation, criterion 24's WO-199 regeneration holds and the PR path refuses what survives, criterion 7 as written (an unflushed transcript gives unattributed) is met, and criterion 12's screen refuses new lines and passes the baseline. The worker's report and its probe scripts are kept beside this order's evidence as the reproductions.",
  "evidence": [
    "docs/evidence/WO-188/final-001/worker-b.md: the five findings as returned, with what the worker read and ran",
    "docs/evidence/WO-188/final-001/b1-comment-tokens.mjs: commentLabelFindings over synthetic one-line sources flags finding-label on comments naming an M1 host, an F5 key, R2 storage, A4 paper, a B2 bucket and N1 nodes, and decision-number on a hexadecimal colour; strings, templates, regexes and URLs are left alone",
    "docs/evidence/WO-188/final-001/b2-release-links.mjs: after absoluteBodyLinks over a blockquoted definition and a nested empty link, the parser still renders a relative destination and the no-links profile reports nothing; releaseEdition runs no relativeLinkFailures after rewriting while worktree publish does",
    "docs/evidence/WO-188/final-001/b3-notification-before-flush.mjs: the built recordOperatorMessage journals a task-notification prompt as claude-prompt-hook and unattributed when the transcript has not flushed, and as host-task-notification once the queued_command row is present; plan-failures counts unattributed rows among interventions",
    "docs/evidence/WO-188/final-001/b4-reference-image.mjs: a reference-style image definition is rewritten to a blob URL without the raw query that inline images get",
    "scripts/docs-check.mjs HOME_PATH over the host scratchpad template under the temporary root, a CI runner home and the shared users directory: each matches; the WO-158-D010 template line passes only by its baselined fingerprint in the generated decisions index, and homePaths has no writer and no stale-entry report"
  ],
  "rejected": [
    {
      "option": "Narrow the label regex, add the Release refusal and the raw query, and recognize the notification envelope in this review",
      "reason": "Each is a behavioral change to a judged surface; a reviewer never writes a behavioral fix and certifies it, and none is needed for a criterion to hold."
    },
    {
      "option": "Fail the review and return the five through repair and a fifth verification",
      "reason": "A finding outside the criteria that breaks no behavior main had is a follow-up by rule, never blocking; each is low and reproduced."
    }
  ],
  "followup": "Planning, low priority: (1) scripts/lib/comment-labels.mjs FINDING_LABEL: the bare letter-and-number alternative (a capital F, N, R, B, A or M followed by one or two digits) refuses ordinary comment tokens such as an M1 host, an F5 key, R2 storage, A4 paper, a B2 bucket or N1 nodes, and DECISION_NUMBER reads a hexadecimal colour such as D100 as a decision number; narrow the bare form to the contexts the reports use, or require the report name beside it; reproduction node docs/evidence/WO-188/final-001/b1-comment-tokens.mjs from the repository root. (2) scripts/release.mjs releaseEdition: the Release text is rewritten by absoluteBodyLinks but no relative-link refusal follows, unlike worktree publish, so a blockquoted definition or a nested empty link leaves a relative destination on the Release page; run relativeLinkFailures over each rewritten section and refuse; reproduction b2-release-links.mjs. (3) packages/skeleton/src/harness-host.ts promptRoute and scripts/lib/plan-failures.mjs: a task notification that arrives before the transcript flushes is journaled claude-prompt-hook and unattributed and counted as an intervention; recognize the envelope observed-facts.ts already parses, joined to FUP-d4493f4251e69c87; reproduction b3-notification-before-flush.mjs with a temporary base directory. (4) scripts/lib/github-body.mjs absoluteBodyLinks definition branch: a reference-style image definition is rewritten without the raw query; pass the image flag when a reference image uses the definition; reproduction b4-reference-image.mjs, case referenceImage. (5) scripts/docs-check.mjs HOME_PATH and docs/control/doc-baseline.json homePaths: the screen also refuses generic templates and shared paths (the host scratchpad template under the temporary root, a CI runner home, the shared users directory), and the baseline has no writer and no stale-entry report; decide the template allowance and add a writer that shrinks the baseline. Priority low; each check still refuses what the order named.",
  "reopenWhen": "A document gate fails on a comment token or a template path that names no private location, a Release page carries a relative link after publication, or a host task notification is counted as an operator intervention in a planning failures record."
}
```

## WO-188-D049 — Final review: seven low findings of the release and lifecycle review worker, boarded

```json
{
  "id": "WO-188-D049",
  "date": "2026-10-09",
  "dispatch": "resume: final review; FINAL-001 review worker A (release close, scratch repositories, worktrees, preparation, the planning feed and the lifecycle scripts)",
  "kind": "finding",
  "decision": "Board, not repair: seven low findings of the read-only review worker over group A, each outside the criteria as written and breaking no behavior main had, so each is a follow-up by rule. The worker's one blocking item, the bare-hex sha256 main's scripts/test-launchpad.mjs defined against this order's helper-reuse test, was integration bookkeeping and is resolved in D047. None of the seven changes a criterion judgment: the close still fails safe in every case the worker built, the printed commands are advisory text the tooling never runs, and the duplicate definitions are correct today. The worker's report and its probe scripts are kept beside this order's evidence as the reproductions.",
  "evidence": [
    "docs/evidence/WO-188/final-001/worker-a.md: the eight findings as returned, with what the worker read and ran",
    "docs/evidence/WO-188/final-001/a2-disposable-retry.mjs: a worktree holding an intake repository and a scratch repository yields a disposable retry command naming both; fed back through parseMaterialFlags and inventoryMaterial it throws the protected-intake refusal",
    "docs/evidence/WO-188/final-001/a3-reserved-names-case.mjs: in a scratch repository with the local lane ignored, an export to terms.txt is refused while an export to Terms.txt is written, and on this case-insensitive volume terms.txt then exists with the export in it",
    "docs/evidence/WO-188/final-001/a4-nested-worktree.mjs: a detached worktree of the same repository added inside the subject is inventoried as preserve, and the reconciliation dry run throws the symlink-escape refusal because the tracked AGENTS.md symlink is inside it; no material command is printed",
    "docs/evidence/WO-188/final-001/a5-completion-tree-hash.mjs: a committed nested repository outside the lanes is inventoried disposable and gateTreeHash throws an unnamed candidate tree entry before the scratch advisory runs",
    "scripts/worktree.mjs refuseSubmoduleWorktree quotes the subject with JSON.stringify in an operator command; scripts/lib/worktree-material.mjs NESTED_GIT and scripts/lib/paths.mjs inspectionGitFlags define the nested-Git prefix twice; paths.mjs declaredSubmodules and worktree.mjs refuseSubmoduleWorktree parse gitlink entries twice; scripts/test-process-debt.mjs removes the nested repository before requireLifecycleEvidence runs"
  ],
  "rejected": [
    {
      "option": "Filter the retry to disposable rows, compare reserved names case-insensitively, use shellQuote and share the prefix in this review",
      "reason": "Each is a behavioral or structural change to a judged surface; a reviewer never writes a fix and certifies it, and none is needed for a criterion to hold."
    },
    {
      "option": "Fail the review and return the seven through repair and a fifth verification",
      "reason": "A finding outside the criteria that breaks no behavior main had is a follow-up by rule, never blocking; each is low, fails safe and is reproduced."
    }
  ],
  "followup": "Planning, low priority: (1) scripts/release.mjs finishPublishedWorktree: the disposable retry command names every material row of each kept worktree, so when an intake, linked-worktree or declared-submodule row is among them the printed discard command always refuses; build it from disposable rows only; reproduction node docs/evidence/WO-188/final-001/a2-disposable-retry.mjs with a temporary base directory, from the repository root. (2) scripts/refute-plan.mjs exportDestination: RESERVED_LANE_NAMES is compared case-sensitively, so on a case-insensitive volume an export to a differently cased reserved name lands on the reserved file when it does not yet exist, the private local-terms list among them; compare case-insensitively or check the existing entry by realpath; reproduction a3-reserved-names-case.mjs. (3) scripts/lib/paths.mjs describeIgnoredMaterial and scripts/release.mjs: a worktree of the same repository nested in the subject is classified linked and preserved, the archive then refuses the tracked symlink escape, and the close blocks with no remedy and no settling word, fail-safe but a worse diagnostic than main gave; carry the linked remedy into the blocker and admit a preserve word for it; reproduction a4-nested-worktree.mjs. (4) scripts/lib/lifecycle-evidence.mjs: gateTreeHash runs before the scratch advisory, so a completion holding an unignored scratch repository refuses with an unnamed candidate tree entry before the advisory names it, as on main; run the advisory first or name the path in the refusal, and add an unignored repository to the criterion 1 advisory fixture; reproduction a5-completion-tree-hash.mjs. (5) scripts/worktree.mjs refuseSubmoduleWorktree: quote the subject in the operator command with shellQuote, as the neighbouring remedy does. (6) scripts/lib/worktree-material.mjs and scripts/lib/paths.mjs: one definition of the nested-Git prefix (hooks and file monitor off, explicit git-dir and work-tree) and one parser of gitlink entries, shared by inventory, inspection and the submodule refusal. (7) scripts/test-process-debt.mjs: the nested-repository whitespace step removes the repository before the check runs, so the trailing-slash filter in lifecycle-evidence.mjs is unexercised; keep the repository in place and assert the check passes. Priority low.",
  "reopenWhen": "A close prints a disposable retry that refuses when run as printed, an export lands on a reserved lane file, a nested worktree of the same repository blocks a close without a remedy, or a completion refuses on an unnamed tree entry with a scratch repository present."
}
```
