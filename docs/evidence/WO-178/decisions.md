# WO-178 decisions

## WO-178-D023 — Final review widens D012: every retry release close records prints bare node

```json
{
  "id": "WO-178-D023",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-002",
  "kind": "finding",
  "decision": "Board, not fail, and widen D012's route. Release close records bare node in every retry command it writes, not only in the material retry. scripts/release.mjs builds the command of a finish, settle, cleanup, publication or completion blocker as node, then the quoted main scripts/release.mjs path, then close WO-NNN --publish. That string is the retry a stopped close offers in release-close.json. releaseCloseAdmission admits only the quoted process.execPath helper that worktree publish prints, so none of these retries is admitted, and each keeps the host's previous judgment under Claude auto mode. VER-001 says the publish helper that release close and worktree.mjs print is the admitted bytes. Only worktree.mjs prints it. Criterion 4 names the publish helper text, which worktree publish prints and the hook admits, and nothing regresses, because a command that is not admitted keeps today's judgment. D012's follow-up names only materialCloseCommand, so carrying it out as written would leave these four printers divergent. This is the case the order's objective names first, the close that stopped. Class: exact-spelling divergence between the printer and the admitter, as in D012.",
  "evidence": [
    "scripts/release.mjs lines 1647, 1706, 1751 and 2545 on the integrated tree: each blocker command is built from the bare word node, the shellQuote of the main scripts/release.mjs path and close WO-NNN --publish. materialCloseCommand in scripts/lib/worktree-material.mjs builds the material retry the same way (D012).",
    "process.execPath over scripts/release.mjs, scripts/worktree.mjs and scripts/lib/worktree-material.mjs: the only printed close command that begins with the quoted execPath is the worktree publish release handoff, scripts/worktree.mjs line 601. The other occurrences spawn child processes and print nothing.",
    "packages/skeleton/src/harness-host.ts releaseCloseAdmission compares the whole command for equality with the quoted process.execPath helper, plus canonical --material words after --publish. D012's VER-001 probe executed the bare-node prefix test for the material form and found no match. Main changed neither scripts/release.mjs nor releaseCloseAdmission."
  ],
  "goalAlignment": "Mission: the close that stopped should reach its retry without a classifier verdict, the same as the publish it retries. Rule beating: the fixture builds its admitted strings by hand from the execPath helper, so it cannot see any printer drift, which is how D012 and this widening escaped it. Shifting the burden: without the wider rule, the next executor fixes one printer and the operator meets the other four at the first stopped close. Naive Interventionism: a reviewer does not write the behavioral fix and certify it, and the non-admission is fail-safe. NoOp: leaving D012's route as written strands four printers. Escalation, policy resistance, drift, commons and success to the successful are immaterial: nothing is refused and no burden is added.",
  "rejected": [
    {"option": "Fail FINAL-002 on criterion 4", "reason": "Criterion 4 names the publish helper text and its negatives, and both hold. The retries are outside its enumerated behavior, as D012 found for the material form."},
    {"option": "Admit the bare node spelling", "reason": "A PATH-resolved interpreter widens the exact admission WO-066 D012 and this order keep narrow; unify the printers instead."},
    {"option": "Open a separate follow-up", "reason": "The class, paths, checks and repair rule are D012's; one route with the wider scope keeps one owner."}
  ],
  "reopens": {
    "decisionId": "WO-178-D012",
    "observation": "The divergence covers every retry release close records. The finish, settle, cleanup, publication and completion blocker commands in scripts/release.mjs (lines 1647, 1706, 1751 and 2545 at FINAL-002) also print bare node, beside materialCloseCommand. The repair rule becomes: every close command release close or worktree publish prints, publish handoff and retries alike, comes from one shared spelling that the admission matches, and a fixture admits each printer's own output."
  },
  "reopenWhen": "A live close records a blocker under Claude auto mode, or an order edits a release close printer or releaseCloseAdmission."
}
```

## WO-178-D021 — Verification boards provenance records that share one baseline key

```json
{
  "id": "WO-178-D021",
  "date": "2026-10-01",
  "dispatch": "resume: verify",
  "kind": "finding",
  "decision": "Board, not fail: operatorWordFindings in scripts/docs-check.mjs names every work-order provenance record file#provenance, so two provenance fields in one order share one key. The fingerprint baseline maps a key to one fingerprint. When both fields attribute quoted words to the operator without a capture digest, the baseline can hold only one of them, so the other is reported on every run. Both advisory lines also print the same record name, so the reader cannot tell which field to paraphrase. The repaired reader makes this layout reachable: it now reads a header-paragraph field and a later standalone field in the same order, and WO-018 already has both (its nomination provenance and its amendment provenance). Neither WO-018 field quotes the operator, so the current corpus has no colliding finding and the check reports 0 current advisories. Criterion 6 names one seeded line and silence on the baseline; both hold. Class: record identity not unique within a file.",
  "evidence": [
    "VER-002 probe in DotLn session scratch: a fixture order with a grouped-header **Nomination provenance:** field and a later standalone **Provenance:** field, each quoting synthetic operator words, gives two findings, both keyed docs/work-orders/WO-999-fixture.md#provenance, with distinct fingerprints. A baseline holding either fingerprint still reports 1 current advisory.",
    "docs/work-orders/WO-018-control-plane-consolidation.md lines 17 and 169: two provenance fields in one order; operatorWordFindings reports neither.",
    "scripts/docs-check.mjs operatorWordAdvisories compares baseline[file#record] with each finding's fingerprint; check() pushes record 'provenance' for every provenance text."
  ],
  "goalAlignment": "Mission: a historical operator-word record can be baselined, and a new one can be found and paraphrased. Seeking the wrong goal: two advisories with one name hide which field needs work. Naive Interventionism: the verifier changes no source and leaves the 34 baseline keys valid. NoOp: an order with two attributed provenance fields could never be fully baselined. Rule beating, escalation, policy resistance, shifting the burden, drift, commons and success to the successful are immaterial: the defect adds no refusal and is latent in the current corpus.",
  "rejected": [
    {"option": "Fail criterion 6", "reason": "The seeded finding and the silent baseline hold, and no current record collides. The defect is outside the enumerated behavior."},
    {"option": "Key each record by its field label alone", "reason": "Two fields can share a label, such as two Provenance amendments; the key needs an ordinal or source position."}
  ],
  "followup": "Executor of the next order that edits scripts/docs-check.mjs operator-word records: give each provenance record a key unique within its file, such as provenance, provenance-2 in document order, or the field label plus ordinal. Keep existing single-record keys byte-identical so the 34 baseline entries stay valid. Add a fixture with two attributed provenance fields in one order: each can be baselined by its own fingerprint, and each advisory names its own record. Paths: scripts/docs-check.mjs, scripts/test-docs-check.mjs, docs/control/doc-baseline.json. Checks: node --test scripts/test-docs-check.mjs and npm run test:docs. Priority low.",
  "reopenWhen": "An order with two provenance fields gains an attributed quotation, or an order changes the operator-word record keys."
}
```

## WO-178-D020 — Repair outcome and re-verification handoff

```json
{
  "id": "WO-178-D020",
  "date": "2026-10-01",
  "dispatch": "resume: fix; FINAL-001",
  "decision": "Hand off the repaired reader and bounded historical pass for independent re-verification. D017's field-isolation rule holds in grouped and standalone layouts. The full pass records sixty-one candidates, twenty-seven repair paraphrases, thirty paraphrases across this order and thirty-four retained fingerprints. Preserve FINAL-001 and the seven protected provenance fields. Keep FUP-de7e15d4444da75b allocated to WO-178 through the independent judgments; update FUP-71fc2efc208f597a's deferred observation to the corrected counts. The adjacent queue has no next item. Record repair-complete with the observed Codex actor after reviewing the finished handoff.",
  "evidence": [
    "npm test -- --review: forty-four suites passed, zero failed, eighty-nine fresh tasks, 847.979 seconds; recorded 2026-10-01T18:06:05.066Z at code identity 7706376b6be30fef3db8734d37d32b25d4ed98882a57b6949a4b221cf5e182fc.",
    "npm run test:docs: twenty-four tasks passed, zero failed, 38.803 seconds; recorded 2026-10-01T18:07:08.033Z at the same identity. Completion checks the finished document outputs again.",
    "Planning, publication, release-surface and thirty-two generated-harness checks pass. All twenty-seven final file digests in operator-word-repair.json match, and git diff --check is clean.",
    "Codex session readback: CLI 0.159.3, gpt-6.1-sol, max, source codex-session-readback. Actual supplied max is retained. Entry and handoff usage are observed through harness usage; final counters stay in ignored receipts and the response.",
    "D019 records the locally prepared v0.61.1 patch target. This repair changes scripts and historical prose; it requires no additional package bump or registered-evidence re-mint. Selected edition checks pass."
  ],
  "goalAlignment": "D017's eight-lens comparison stands. The observed outcome closes the coverage gap and tests field isolation while preserving planning bindings, without a new refusal or dependency. No time, token or semantic-classification improvement is inferred from a passing gate. The full review took 847.979 seconds; the historical pass required reading and binding checks. D001 remains the order's only economy experiment.",
  "rejected": [
    {"option": "Treat this gate as independent verification", "reason": "It is executor evidence; verification and final review retain separate dispatches."},
    {"option": "Expand the historical sweep beyond thirty paraphrases", "reason": "The order's bound is reached; the remaining cases have a named historical route."},
    {"option": "Publish the local release during repair", "reason": "Local preparation grants no publication authority."}
  ],
  "reopenWhen": "Independent verification reproduces a missed field or crossed boundary, a retained fingerprint changes, or integration changes an acceptance claim."
}
```

## WO-178-D018 — Correct the coverage claim and preserve approved historical bytes

```json
{
  "id": "WO-178-D018",
  "date": "2026-10-01",
  "dispatch": "resume: fix; FINAL-001 criterion 6",
  "kind": "correction",
  "misread": "D006's twenty-eight-candidate count and the original criterion 6 handoff described the paragraph-start subset as if it covered the declared provenance surface. This repair initially proposed twenty-seven provenance paraphrases before checking every planning binding; seven proposed fields were protected by an execution amendment or the current horizon receipt.",
  "meant": "Read each provenance field independently of its paragraph position. A historical paraphrase must also preserve approved order and decision bytes, even when it removes attributed operator wording. The advisory baseline is a counted exception, not evidence that every retained quote is harmless or removed.",
  "changed": "The repaired reader found sixty-one candidates: thirty-seven provenance fields and twenty-four decision records. The final pass paraphrases twenty unbound provenance fields and seven unbound decision records; D006's three earlier paraphrases make thirty for this order. Seven protected provenance fields keep their original bytes. The remaining thirty-four findings are fingerprinted historical exceptions, including WO-178's classifier/documentation wording and D015's preserved finding. operator-word-repair.json records all sixty-one judgments using record identifiers and digests, never attributed text. No report or planning event is rewritten.",
  "decision": "Keep the field-reader repair and the twenty-seven permitted historical paraphrases. Preserve the seven bound provenance fields and retain the residual sweep on FUP-71fc2efc208f597a through D006 and WO-172-D008. Reuse D017's goal comparison: this fixes coverage while keeping the advisory, capture and immutable-history contracts.",
  "evidence": [
    "Before the implementation change, both added WO-178 tests fail while the original standalone test passes. After the change, node --test scripts/test-docs-check.mjs passes all thirty-two tests.",
    "Full-surface scan at 2026-10-01T17:36:28.358Z: sixty-one findings, twenty-five matching the earlier baseline and thirty-six current. After the twenty-seven final paraphrases: thirty-four findings and no newly introduced candidate.",
    "Planning-check failures identified WO-100 amendment row 17, WO-160 row 26 and changed current-horizon order bytes. Reading every amendment and the latest receipt identifies all seven protected proposed fields: WO-065 row 30, WO-086 row 32, WO-100 row 17, WO-160 row 26, WO-162 row 29, and WO-059/WO-061 in receipt 2026-09-30-planning-826842218eb333e2-036. Each original field is restored exactly; the planning check then passes.",
    "docs/evidence/WO-178/operator-word-repair.json records the complete candidate inventory, each retained reason and every changed record's prior fingerprint and final file digest. The prior handoff count remains historical evidence; the repaired handoff uses this full-surface count."
  ],
  "rejected": [
    {"option": "Withdraw or replace the bindings to permit more paraphrases", "reason": "The repair has no authority to replace approved planning history, and the existing baseline admits retained historical records."},
    {"option": "Add only the newly found provenance fields to the old baseline", "reason": "The full pass also paraphrases seven older decision records and one previously baselined provenance; stale exceptions must leave the active baseline."},
    {"option": "Treat all thirty-four residual matches as operator messages", "reason": "Several match a cited title, planning term, classifier label or documentation. The lexical reader reports candidates without semantic attribution."}
  ],
  "reopens": {
    "decisionId": "WO-178-D006",
    "observation": "The prior surface count was incomplete. The repaired full-surface pass reaches the thirty-record bound; FUP-71fc2efc208f597a retains the thirty-four historical exceptions, including bound records and non-operator lexical matches."
  },
  "reopenWhen": "A retained record changes its fingerprint, a later planning pass permits a protected paraphrase, or a lexical match is used as proof that a message came from the operator."
}
```

## WO-178-D017 — Repair provenance records in every header layout

```json
{
  "id": "WO-178-D017",
  "date": "2026-10-01",
  "dispatch": "resume: fix; FINAL-001 criterion 6 and WO-178-D015",
  "decision": "Use the existing Markdown AST to read each bold provenance field from its label to the next bold header label at a line boundary or the paragraph end. Retain standalone provenance records, decision/dispatch checks, same-record capture citations and historical fingerprints. Exercise grouped headers and an additional field-boundary case, then repeat the bounded paraphrase pass across the complete candidate set. D006 used three of the thirty allowed paraphrases, leaving at most twenty-seven. Keep immutable reports and amendment-bound records intact. Criteria 1 through 5 and 7 carry forward; both declared gates run before repair-complete.",
  "evidence": [
    "scripts/docs-check.mjs operatorWordFindings currently tests only the start of each whole paragraph; renderedText and node source offsets are already available from the pinned Markdown parser.",
    "FINAL-001 and WO-178-D015 reproduce the missed grouped-header layout and require field boundaries, a regression case and renewed full-surface counts.",
    "WO-178-D006 records three prior paraphrases; WO-172-D008 preserves amendment-bound decision bytes and append-only history."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Reliable provenance advisories support the clean-room floor and the planning record used by the independently verified source-to-deliverable loop. The repair removes a reproduced blind spot, not a new planning gate.",
    "traps": {
      "policyResistance": "Use the existing repair transition and retain the advisory contract and capture exception.",
      "tragedyOfTheCommons": "One writer, zero subagents, one focused regression run followed by the required gates; no duplicate economy experiment.",
      "driftToLowPerformance": "Judge the grouped-header layout actually used by work orders rather than accepting paragraph-start-only coverage.",
      "escalation": "No new dependency, refusal, approval step or broad parser replacement.",
      "successToTheSuccessful": "Reuse the parser because it supplies rendered block boundaries; compare it with a line regex rather than relying on its prior investment.",
      "shiftingTheBurden": "Make new matching provenance visible automatically instead of leaving detection to the operator.",
      "ruleBeating": "A neighboring field's digest must not exempt the provenance, and neighboring quoted prose must not create its finding.",
      "seekingTheWrongGoal": "Record actual field coverage and bounded paraphrase counts; zero advisories alone is not evidence of complete removal."
    },
    "naiveInterventionism": "Preserve AST-based exclusion of examples, existing fingerprint identities, privacy and immutable evidence. Probe field boundaries before touching historical records, then paraphrase only unbound records within the order's bound.",
    "noOp": "Retaining the paragraph-start test leaves the reproduced criterion failure unresolved. A regex over raw Markdown risks scanning examples or mixing adjacent fields; the existing AST is the smallest supported repair."
  },
  "economy": "Read WO-178-D001 and retain its completed reader-reuse experiment. No second experiment is started during repair.",
  "rejected": [
    {"option": "Move provenance to a standalone paragraph in every work order", "reason": "Rewrites historical layout instead of repairing the reader and leaves future grouped headers vulnerable."},
    {"option": "Exempt a provenance field with any digest in its header paragraph", "reason": "A capture in a neighboring field does not bind the attributed passage."},
    {"option": "Rewrite all historical candidates or filed reports", "reason": "The thirty-record bound and immutable/amendment-bound history remain in effect; fingerprint the retained records and preserve the existing sweep follow-up."}
  ],
  "reopenWhen": "Another supported header layout is missed, a neighboring field changes the finding, a changed baseline record stays exempt, or the paraphrase pass changes bound evidence."
}
```

## WO-178-D016 — Correction: the reviewer stopped on the operator's question

```json
{
  "id": "WO-178-D016",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "correction",
  "misread": "The reviewer treated the operator's mid-turn question, which asked what the issue was, as a pause. It answered the question and then ended its turn before recording the final-review result. It also offered a fail-or-waive choice the operator had not asked for.",
  "meant": "A question is answered inside the running work. Only an explicit pause or stop interrupts dispatched work. The verdict was the reviewer's to record, and the waive off-ramp was already open to the operator without a held turn.",
  "changed": "After the operator's follow-up, the reviewer recorded FinalReviewCompleted fail for FINAL-001 at 2026-10-01T17:27:43.553Z. It answers later questions without ending the turn.",
  "decision": "Record the stop as the reviewer's failure, not the operator's. FINAL-001's verdict and D015 are unchanged.",
  "evidence": [
    "This dispatch's session: npm run test:docs passed at 2026-10-01T17:26:54.815Z, and the turn then ended with the result unrecorded. The operator's follow-up was observed at 17:27:35.217Z, and the result was appended at 17:27:43.553Z.",
    "docs/control/orders/WO-178.jsonl FinalReviewCompleted, verdict fail, reportHash sha256:cbd02b7843de1442922b5d22b92657a8546370edea08a520fccd476b6753bacd",
    "Reviewer role text: only an explicit pause or stop interrupts work."
  ],
  "rejected": [
    {"option": "Edit FINAL-001 to record the stop", "reason": "A filed report is hash-bound by its result event and is never edited."}
  ],
  "reopenWhen": "A role again ends a turn on an operator question while its dispatched work is unfinished."
}
```

## WO-178-D015 — Final review finding: the operator-word check never reads a provenance field in a header paragraph

```json
{
  "id": "WO-178-D015",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Fail FINAL-001 on criterion 6 and return the finding to repair. operatorWordFindings in scripts/docs-check.mjs reads a work-order provenance record only when a whole Markdown paragraph begins with Provenance: or Nomination provenance:. Work orders usually write that field as one line of the header paragraph, after lines such as Model and Effort. Of the 166 work orders with a bold provenance field, 157 use that layout, WO-178 among them. A provenance field there that attributes quoted words to the operator, with no capture digest, produces no advisory. The criterion 6 fixture writes the field as its own paragraph after the H1, so it passes while the check stays silent on the layout planning actually writes. The order's observed gap 6 is that no check finds a new operator-worded provenance line; on the standard layout none is found. The bounded paraphrase pass in D006 counted 28 candidates. It never saw the 35 header-paragraph fields the check's own patterns match. At least seven of them quote an operator dispatch and cite only 'SHA-256 in the ledger section', with no digest: WO-150, WO-158, WO-160, WO-161, WO-162, WO-163 and WO-166. Their words are not copied here. Class: rule beating, because the fixture's layout hides the declared surface.",
  "evidence": [
    "Reviewer probe, 2026-10-01, in this session's DotLn scratch (probe/header-provenance.mjs), importing the subject's scripts/docs-check.mjs on a fresh fixture root. The same provenance text gives 1 finding as its own paragraph (WO-998) and 0 findings after **Model:** and **Effort:** lines in one paragraph (WO-999).",
    "Reviewer count (probe/count-header.mjs) over docs/work-orders, using the check's own attribution and capture patterns on each bold provenance field up to the next bold header label or blank line. Results: 166 fields, 157 inside a header paragraph, 37 lexical matches without a digest, 35 of them in header paragraphs. A sample of those 35 (probe/sample-header.mjs) shows operator dispatch quotes in WO-150, WO-158 and WO-160 to WO-166. WO-178's own match quotes a classifier label and documentation, not the operator.",
    "node scripts/docs-check.mjs on the subject prints 'Operator-word advisories: 0; historical baseline: 25.' and PASS.",
    "scripts/docs-check.mjs operatorWordFindings tests /^(?:Nomination )?Provenance:/iu against each paragraph node's rendered text. scripts/test-docs-check.mjs's WO-178 case writes '# WO-999 — Fixture' followed by a blank line and the provenance field as its own paragraph.",
    "docs/control/doc-baseline.json operatorWords lists two work-order provenance records, WO-079 and WO-141, both standalone paragraphs."
  ],
  "alternatives": [
    "Fail with the reproduced finding and route it through repair and fresh verification",
    "Pass and board it, as VER-001 boarded D012",
    "Write the fix during review and certify it"
  ],
  "rejected": [
    {"option": "Pass and board it", "reason": "D012's material clause had no criterion of its own. Criterion 6 is this check's report of a provenance line that attributes words to the operator, and on the layout that holds 157 of 166 such fields that report never occurs. The evidence passes without the behavior, which is the rule-beating lens. The operator's waive off-ramp stays available if the gap is to be accepted."},
    {"option": "Write the fix during review", "reason": "Product 07 §Independent workflows and integration: a reviewer never writes a behavioral fix and certifies it."}
  ],
  "followup": "WO-178 resume: fix. Rule the repair must hold: a work-order provenance field is one record wherever it stands. A header-paragraph line, from its bold Provenance or Nomination provenance label to the next bold header label or the paragraph end, is judged exactly as a standalone paragraph is. Add a fixture with the field in the header layout, after Model and Effort lines in one paragraph, and keep the standalone, capture-digest, fingerprint and dispatch cases. Rerun the bounded paraphrase pass over the full candidate set within the order's thirty-record bound (three are used) and baseline the rest by fingerprint. Record the new counts in the order's decisions. WO-178's own provenance field is a lexical match on a classifier label and documentation, so baseline or paraphrase it by the same route. Paths: scripts/docs-check.mjs, scripts/test-docs-check.mjs, docs/control/doc-baseline.json and any paraphrased record. Checks: node --test scripts/test-docs-check.mjs, node scripts/docs-check.mjs, npm run test:docs and npm test -- --review. docs-check.mjs is not a registered evidence or machinery source, so no edition re-mint follows from this file.",
  "goalAlignment": {
    "missionAndCriticalPath": "The planning pass and the clean-room floor rely on this check to surface operator words in new work orders. Gap 6 is that nothing finds a new one, and planning writes provenance in the header layout.",
    "traps": {
      "ruleBeating": "Decides the verdict: the fixture's layout passes while the declared surface is not read.",
      "seekingTheWrongGoal": "Zero current advisories would be read as compliance when the check never looked.",
      "driftToLowPerformance": "Reaching 9 of 166 fields must not become the accepted standard for the check.",
      "shiftingTheBurden": "Without the repair, the operator again notices verbatim words that no check reported.",
      "escalation": "The remedy is bounded to the reader, its fixture and the baseline. No refusal or gate is added.",
      "policyResistance": "Uses the existing repair and verification route.",
      "tragedyOfTheCommons": "One repair and one verification, with no edition re-mint for this file.",
      "successToTheSuccessful": "The verified admission, journals and counts are not reopened."
    },
    "naiveInterventionism": "I changed no implementation. Criteria 1 to 5, 7 and 8 and their evidence carry forward.",
    "noOp": "Publishing as is ships a check that is silent on the layout it was built to read."
  },
  "reopenWhen": "The repair's header-layout fixture passes and the full-surface candidate count is recorded, or the operator waives criterion 6."
}
```

## WO-178-D014 — Verification boards host notifications counted as operator messages

```json
{
  "id": "WO-178-D014",
  "date": "2026-10-01",
  "dispatch": "resume: verify",
  "kind": "finding",
  "decision": "Board, not fail: a host background-task notification is journaled as an operator message and counted as an intervention. In the VER-001 session, a background Bash command finished and the host delivered its completion as a queued command. The prompt hook appended OperatorMessageObserved with prefix null, class unclassified, route unknown, 422 bytes and digest fd116e1a78eff061…. That digest equals the digest of a transcript queued_command attachment whose commandMode is task-notification. The operator typed nothing at that time. failuresAtStart then reported interventions count 2 and unclassified 1, and the unclassified row is that notification. Criterion 2's fixture covers prefixed messages, unprefixed messages and the absence of text, and it passes. The over-count is a live attribution defect outside the criteria. Class: observation attribution.",
  "evidence": [
    "docs/control/local/harness/c2dd8137….jsonl rows 5 and 533: one direction row for the dispatch phrase and one unclassified row at 2026-10-01T16:40:36.677Z, 422 bytes",
    "Session transcript, compared by SHA-256 only (no text copied): the matching queued_command attachment carries commandMode task-notification, with an enqueue at 16:40:34.608Z and a remove at 16:40:36.686Z. The hook's latest transcript row was a PostToolUse hook_success attachment, so the route was recorded as unknown.",
    "node failuresAtStart on the worktree: interventions {count: 2, unclassified: 1}",
    "packages/skeleton/src/harness-host.ts recordOperatorMessage records every UserPromptSubmit carrying a string prompt and a session id. The source is claude-prompt-hook, and nothing reads the host's commandMode."
  ],
  "goalAlignment": "Mission: the planning pass reads intervention counts as the operator's corrections and directions. A host notification inflates them in proportion to background work, which is a seeking-the-wrong-goal and drift risk. Naive Interventionism: a verifier does not repair the implementation. NoOp would leave a row the next pass misreads. The other traps are immaterial here: no refusal, gate or burden changes.",
  "rejected": [
    {"option": "Fail criterion 2", "reason": "The fixture behaviour the criterion names is present and passes fresh. The defect is in live attribution, which the criterion does not judge."},
    {"option": "Treat unclassified rows as noise in the report only", "reason": "A report sentence is not a route; the counts feed every planning pass."}
  ],
  "followup": "Executor of the next order that edits recordOperatorMessage or the planning intervention count: count only messages the host attributes to the operator. When a UserPromptSubmit matches a native queued_command whose commandMode is not an operator prompt (task-notification was observed on Claude Code 2.1.286 on 2026-10-01), record a distinct non-operator source that interventions exclude. Label a message with no attribution evidence unattributed instead of counting it as the operator's. Add fixtures for a task-notification queued_command and for an unflushed transcript. Paths: packages/skeleton/src/harness-host.ts, scripts/lib/plan-failures.mjs, scripts/test-harness.mjs, scripts/test-plan-refutation.mjs. Checks: npm test -- --review. Priority medium; the planning pass reads these counts.",
  "reopenWhen": "A planning pass relies on intervention counts, or the host documents a prompt-source field for UserPromptSubmit."
}
```

## WO-178-D013 — Verification boards the admission's precedence over a typed correction

```json
{
  "id": "WO-178-D013",
  "date": "2026-10-01",
  "dispatch": "resume: verify",
  "kind": "finding",
  "decision": "Board, not fail: the release-close admission returns allow before the correction-narrowed compiled authority is consulted, so a recorded typed-correction state does not withhold it. The VER-001 fixture reproduction records the release-close dispatch, with cwd at main and release-close legal. It then writes the session's correction state: allowedEffects without shell.run, lifecycle.run, repo.write, repo.delete and git.local, the destructive set the correction hook applies. The exact publish helper still returned permissionDecision allow with the first-admission reason. The --force near miss returned the correction advisory that compiled authority does not permit shell.run. The installed contributor bundle sets correctionToken to null and emits no correction-effect hook, so sessions in this repository write no correction state today. The path is latent. Criterion 4's enumerated negatives and every existing refusal fixture hold. The typed-correction response to a Bash call is an advisory, not one of the five refusals. Class: authority ordering.",
  "evidence": [
    "VER-001 scratch copy of scripts/test-harness.mjs (absolute imports, session system-temp): test VERIFIER2-WO178 printed before allow, after allow (with the first-admission reason), nearMiss 'compiled authority does not permit shell.run; host permissions decide.'",
    "packages/skeleton/src/harness-host.ts: releaseCloseAdmission returns before permissionEffect and harnessAuthorization, which apply session.correction",
    "Installed .claude/hooks: no fail-conservative-correction hook, and correctionToken is null in the emitted configurations"
  ],
  "goalAlignment": "Mission: the admission saves a host prompt only for an already-authorized lifecycle step. Escalation and policy-resistance risk: an allow that outranks the operator's correction freezes nothing. Fail-conservative correction requires that a correction only tighten behaviour. The latency lowers urgency but not the rule. Naive Interventionism and NoOp as in D014.",
  "rejected": [
    {"option": "Fail criterion 4", "reason": "Every condition the criterion enumerates was reproduced fresh. A correction state is not among them, and no existing refusal changed."},
    {"option": "Leave it as an inference", "reason": "Reproduced by executing the hook against a recorded correction state."}
  ],
  "followup": "Executor of the next order that edits the permission facet, the typed-correction response or releaseCloseAdmission: withhold the admission whenever the session holds a typed-correction state, or whenever the correction-narrowed compiled authority does not authorize the command's effect. An admission may only turn an already-authorized effect into an explicit allow. Add a fixture with the recorded dispatch, main, a legal release-close and a correction state, and expect no allow. Paths: packages/skeleton/src/harness-host.ts, scripts/test-harness.mjs. Checks: npm test -- --review. Priority low while no DotLn loadout sets a correctionToken, medium once one does.",
  "reopenWhen": "A loadout installed in a DotLn checkout sets a correctionToken, or the order of the permission facet's checks changes."
}
```

## WO-178-D012 — Verification boards the unadmitted material retry spelling

```json
{
  "id": "WO-178-D012",
  "date": "2026-10-01",
  "dispatch": "resume: verify",
  "kind": "finding",
  "decision": "Board, not fail: the material retry that release close prints never matches the admission. materialCloseCommand in scripts/lib/worktree-material.mjs prints a command that starts with the bare word node, followed by the quoted main scripts/release.mjs path, close WO-NNN --publish and one or more --material flags. The material printer feeds both the blocker record and the retry line in scripts/release.mjs. releaseCloseAdmission admits --material flags only after the quoted process.execPath helper, so the printed retry bytes are never admitted and keep today's host judgment. Criterion 4 names the exact publish helper, which is admitted. The design's material clause is implemented literally against that helper. The committed fixture builds its material commands by hand from the execPath helper and never from the printer. Nothing regresses, because a command that is not admitted keeps the host's previous judgment. Class: exact-spelling divergence between the printer and the admitter.",
  "evidence": [
    "VER-001 probe in session system-temp: materialCloseCommand('/synthetic/main', 'WO-999', [{path, worktree}]) printed a command beginning \"node '/synthetic/main/scripts/release.mjs' close WO-999 --publish --material\". Whether it starts with the admitted prefix \"'<process.execPath>' '/synthetic/main/scripts/release.mjs' close WO-999 --publish --material \": false",
    "scripts/release.mjs: the blocker command, the disposable command and the 'Material cleanup retry:' line all come from materialCloseCommand",
    "scripts/test-harness.mjs WO-178 admission fixture: the material suffixes are appended to the hand-built execPath helper"
  ],
  "goalAlignment": "Mission: the close that stopped on undeclared material should reach its retry without a classifier verdict, the same as the publish helper. Rule beating risk: a fixture that builds the admitted string by hand cannot see the printer drift. Naive Interventionism and NoOp as in D014. The other traps are immaterial: no refusal or burden is added.",
  "rejected": [
    {"option": "Fail criterion 4", "reason": "The enumerated helper and negatives hold. The material retry is a design clause with no criterion fixture, and the non-admission is fail-safe."},
    {"option": "Admit the bare node spelling as well", "reason": "A PATH-resolved interpreter widens the exact admission that WO-066 D012 and this order keep narrow. Unify the printer instead."}
  ],
  "followup": "Executor of the next order that edits scripts/lib/worktree-material.mjs, scripts/release.mjs or releaseCloseAdmission: print and admit one byte spelling. Make materialCloseCommand print the quoted process.execPath helper the publish handoff prints, or have the printer and the admission share one function. Add a fixture whose admitted material command is the printer's own output, and keep the near-miss negatives. Paths: scripts/lib/worktree-material.mjs, packages/skeleton/src/harness-host.ts, scripts/test-harness.mjs, scripts/test-release.sh. Checks: npm test -- --review. Priority low; pair it with the first live auto-mode close observation.",
  "reopenWhen": "A live close reaches a material retry under Claude auto mode, or an order edits the material printer or the admission."
}
```

## WO-178-D011 — Executor outcome and handoff limits

```json
{
  "id": "WO-178-D011",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Hand off the implemented order for independent verification after the completion command's fresh document check. The fixtures establish the declared observations, exact helper admission and preserved refusals. They do not establish live Claude auto-mode admission, complete message delivery coverage or reduced operator effort. Preserve the two stopped full runs and the introduced document failure as diagnostic history. All queued carry-in work is complete; D005 and D006 retain the named residual work.",
  "evidence": [
    "npm test -- --review: 43 suites passed, zero failed, 88 fresh tasks, 989415 ms; recorded 2026-10-01T16:29:24.587Z at code identity 38bcda114fb6ad962b5425c535a120afff02fea96169a73d4c614f27059fb3e8",
    "npm run test:docs: 24 tasks passed, zero failed, 39608 ms; recorded 2026-10-01T16:12:41.659Z at the same code identity. Completion reruns this gate after the final handoff and index writes.",
    "git diff --check is clean; adjacent queue revision 5 has one completed item and no next item; current Codex briefing reports gpt-6-astra, max, CLI 0.159.3, source codex-session-readback",
    "The selected authority 003, artifact-identity 001, verification 001 and feedback 001 editions pass their checks. The console fixture follows the selected report while preserving the carried live audit."
  ],
  "goalAlignmentOutcome": {
    "missionAndCriticalPath": "The planning feed can now consume the specified local observations and the exact close has an executable admission path. Live effectiveness remains to be observed at the order's declared first merged close and next planning pass.",
    "traps": {
      "policyResistance": "All existing refusal fixtures pass; no new refusal or recurring permission step was added.",
      "tragedyOfTheCommons": "One writer and no subagents; source and guidance processing are bounded. Repeated gate work is recorded, and unavailable token totals are not estimated.",
      "driftToLowPerformance": "The handoff retains unknown coverage, unclassified rows, failed attempts and the live observation that remains outstanding.",
      "escalation": "The hook requests no retry and runs no model classifier; exact-command near misses receive no admission.",
      "successToTheSuccessful": "D001's reader reuse is retained for shared definitions, without claiming an unmeasured runtime improvement.",
      "shiftingTheBurden": "Recording and aggregation are executable behavior; the verifier still judges the evidence, and reduced operator supervision has not been measured.",
      "ruleBeating": "Both required gates ran successfully; neither the browser failure nor stale fixture assertions were waived or weakened.",
      "seekingTheWrongGoal": "More journal rows are evidence availability, not delivery success. The track reader preserves unknown for absent declarations."
    },
    "naiveInterventionism": "The implementation keeps the lifecycle, privacy floor, gate reuse and immutable source editions. The separate browser setup order remains separate.",
    "noOp": "The documented gaps justify this bounded implementation; no further classifier, broad permission rule, historical sweep or shell interpreter is added to make the handoff appear more complete."
  },
  "rejected": [
    {"option": "Report the first live admission or complete intervention coverage as already proven", "reason": "The current evidence is fixture-based and locally scoped; D006 names the host and Codex observation limits."},
    {"option": "Continue into verification or publication", "reason": "Those are separate lifecycle dispatches; this handoff records implementation readiness only."}
  ],
  "reopenWhen": "Independent verification finds a criterion unsupported, or the first merged Claude auto-mode close or next planning pass contradicts these bounded observations."
}
```

## WO-178-D010 — Refresh the console's selected evidence pin

```json
{
  "id": "WO-178-D010",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Complete D007's edition refresh with the existing console-fixtures --record-current-selfhost generator. Pin the maturity report to WO-178/feedback-001 and regenerate that case's JSON, terminal and HTML projections. Keep the live audit and verification streams pinned to the carried WO-180 edition. This is evidence bookkeeping within the original deterministic re-mint duty, with D002's goal comparison unchanged; no live feedback episode or console behavior change is claimed. The separate browser setup work remains with the operator's other order; D009 performs local cache setup only.",
  "evidence": [
    "First npm run test:docs: 23 tasks passed and console-docs failed; the runner classified the failure introduced against the recorded base.",
    "The console manifest still pinned WO-180/feedback-003/feedback.json, policy fnv1a64:2a9e52ccbdbb8de8; the selected report records fnv1a64:79c5ce2305887e83. projectMechanisms correctly made maturity unavailable because that policy pin did not match.",
    "scripts/console-fixtures.mjs explicitly records the selected maturity report while following a carried edition's original liveAudit paths. After generation, --check confirms all five fixture cases' JSON, terminal and HTML outputs match."
  ],
  "rejected": [
    {"option": "Weaken the console's policy comparison or its answering-cell assertions", "reason": "They correctly detected a stale fixture pin; the canonical generator repairs the selected evidence."},
    {"option": "Rewrite the old live report or run a new live episode", "reason": "The declared carry preserves immutable evidence, and the deterministic report is already current."}
  ],
  "reopenWhen": "The document gate still reports a mismatch after the canonical fixture refresh, or a change affects the live-judged feedback behavior."
}
```

## WO-178-D009 — Correction: install the declared browser prerequisite

```json
{
  "id": "WO-178-D009",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "Started the complete review gate without checking the fresh worktree's browser runtime prerequisite.",
  "meant": "packages/browser-evidence/README.md requires the pinned headless shell in the per-worktree .runtime/playwright cache before its first gate; that directory was absent.",
  "changed": "Stopped the second full run through harness evidence --stop after the browser suite reported unavailable Chromium. Install the existing Playwright 1.63.0 package's pinned headless shell in the ignored local cache, check the browser suite, then rerun the required complete review gate.",
  "decision": "Repair local test setup without changing dependencies or weakening unavailable-browser assertions. The stopped run is diagnostic evidence, never a passing product gate.",
  "evidence": [
    "Second npm test -- --review: browser-evidence failed 13 of 19 tests; its first failure names the pinned-browser install command. The local cache directory is absent.",
    "Canonical stop completed after 975.6 seconds and recorded no check. Harness, process-debt, release, skeleton, compiler, planning-refutation and harness-probe suites had passed; worktree-integration was still running.",
    "packages/browser-evidence/package.json pins playwright 1.63.0; its README declares the local cache and install command. Current official Playwright browser documentation fetched through Context7 confirms --only-shell and PLAYWRIGHT_BROWSERS_PATH.",
    "The declared install completed into .runtime/playwright. node --test packages/browser-evidence/test/scenario.test.mjs then passed all 19 tests in 18.988 seconds, including missing-browser and crash-recovery controls."
  ],
  "rejected": [
    {"option": "Omit the browser suite or call the stopped run green", "reason": "Criterion 8 requires the complete review gate, and unavailable browser witnesses are intentionally failing evidence."},
    {"option": "Change package versions or install a shared global cache", "reason": "The declared per-worktree setup is sufficient and preserves the pinned dependency and other worktrees."}
  ],
  "reopenWhen": "The pinned install succeeds but the browser suite still cannot launch, or the complete gate exposes another failure."
}
```

## WO-178-D008 — Full-gate regression repairs

```json
{
  "id": "WO-178-D008",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Stop the first full review run after it exposed two harness regressions and repair before rerunning. The snapshot fixture's surface count moves from 31 to 32 because the denial hook is new. Keep the malformed-input assertion unchanged: a recovery prompt without a native session id remains available but must not create a session journal. recordOperatorMessage now requires that id; the early recovery path cannot write a guessed unknown-session record. Its default source also identifies Copilot when the shared hook receives that host. Select authority revision 003 after regenerating the final runtime; retain revisions 001 and 002 as earlier execution evidence.",
  "evidence": [
    "First npm test -- --review stopped through harness evidence --stop after 96.3 seconds; no passing check recorded",
    "Focused reproduction: WO-139 expected 31 but received 32 surfaces; WO-045 found an extra journal after two recovery prompts with no session_id",
    "The WO-045 no-host-state assertion remains byte-for-byte unchanged; only the observation precondition and the explicit generated-surface count change"
  ],
  "rejected": [
    {"option": "Weaken malformed-input or recovery assertions to permit an unknown-session journal", "reason": "The existing recovery contract provides access before session identity exists; unassigned writes would fabricate provenance."},
    {"option": "Let the already-failed gate finish every dependent suite", "reason": "A source repair requires a fresh gate; the canonical stop preserves work and records no passing evidence."}
  ],
  "reopenWhen": "Another recovery input creates unassigned state or valid prompt rows lose their native session provenance."
}
```

## WO-178-D005 — Carry-in remedies and retained limits

```json
{
  "id": "WO-178-D005",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Catch malformed decision JSON at its shared reader and report only the public path and constrained heading id. Shell diagnostics now require a known literal whole parameter value for unsplit-word attribution, the whole builtin option, a recognized expansion in a parsed word, or an arithmetic expression with an observable missing operand. Unknown runtime values do not borrow an outer scope's known value. Scope comparisons use the current numeric scope id; commands above 32768 characters, nesting above 64, output beyond 65536 characters and more than 64 candidate lines are outside this advisory's processing budget. The observer classifies before scanning the shared lane and caps combined guidance at 1800 characters, leaving an undisplayed failed use unmarked for a later call. These bounds omit uncertain advice; they do not refuse commands. This is a conservative observer, not a complete zsh interpreter.",
  "evidence": [
    "scripts/test-plan-refutation.mjs WO-178 malformed-decision case: failures and start name WO-999-D001 and its path, without the synthetic parser excerpt",
    "scripts/test-harness.mjs WO-178 carry-in and combined-guidance cases, plus existing WO-172 actual-zsh, generated observer and interrupted/concurrent claim cases",
    "Final focused harness run: 10 tests passed in 22.835 seconds, including scoped unknown values and actual-zsh printed-line controls; the carry-in test took 3.004 ms and includes the three pathological-shape assertions below one second. Final product-gate evidence belongs in handoff.md."
  ],
  "rejected": [
    {"option": "A timed subprocess or full shell parser", "reason": "Deterministic work limits and conservative source checks repair the allocated cases without a new dependency or process per hook."},
    {"option": "Mark every earlier failure answered after truncating the aggregate guidance", "reason": "It would lose answers the agent was never handed; unshown answers remain eligible."}
  ],
  "followup": "Next planning pass, with FUP-d90c46abf5658272 and FUP-01e80ba5ce62c72a: decide a durable cache for failed results with no classified diagnostic and prune interrupted .shell-claim/.prepare- entries independently; classify-once and crash cleanup remain open. Keep ANSI-C escaped quotes, coproc and the - precommand as known unsupported forms. A printed line that names an actually executed head cannot be distinguished from the shell's own error by these text inputs alone. Paths: packages/skeleton/src/harness-command.ts, packages/skeleton/src/harness-host.ts, scripts/lib/harness-prune.mjs. Checks: actual-zsh/generated-observer cases and npm test -- --review. Priority low.",
  "reopenWhen": "An ordinary call reaches the processing bound, loses necessary guidance because of an unsupported form, repeats a costly classification, or a stale claim prevents delivery."
}
```

## WO-178-D006 — Observation coverage and bounded paraphrases

```json
{
  "id": "WO-178-D006",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "The typed prompt row records the hook observation time, UTF-8 digest and byte count, prefix class and lifecycle scope, never message text. UserPromptSubmit has no documented route field: a matching latest native transcript row supplies a correlated route and named source; absent, unflushed or unmatched metadata records unknown. No guarantee is made that every mid-turn or interrupt reaches this event. Codex records the reconstructed canonical dispatch phrase only, labels its source dispatch-only and keeps route unknown. Denials preserve a bounded tool name and bracketed rule label, digest and byte count, never reason/input prose. The five planning counts are observations, not failed judgments; close attempts include dry-run/no-release labels, gate rows are counted rather than distinct runs, medians use the full control record, and absent tracks stay unknown. The lexical operator-word check found 28 historical candidates. Paraphrased 3 unbound records: WO-064-D012 and WO-068-D004 dispatch fields and WO-167-D013 section prose. The remaining 25 are fingerprinted baseline entries, including the bound WO-056-D008; fingerprints detect changed text without copying it. The check is syntactic and does not establish that every quoted term is operator chat or sweep fields outside the declared surfaces.",
  "evidence": [
    "Current official Claude hooks reference read 2026-10-01; WO-172 D008's amendment-bound field constraint",
    "operatorWordFindings before paraphrase: 28; docs-check after paraphrase: zero current advisories, 25 historical; prospective quote, changed-fingerprint and same-record digest fixtures pass",
    "git diff limits the historical changes to the two dispatch fields and one prose line; npm run plan -- check accepts the preserved amendment-bound decisions",
    "FUP-71fc2efc208f597a and FUP-f287a595299249ff retain the historical sweep and fields this syntax does not read"
  ],
  "rejected": [
    {"option": "Infer routes or semantic correction classes when host metadata is missing", "reason": "A prefix and transcript correlation do not prove the operator's semantic intent or full host delivery coverage."},
    {"option": "Rewrite every historical match or move prior register revisions", "reason": "Lexical matches include quoted vocabulary and bound records; the order permits a bounded paraphrase pass and a preserved baseline, not rewriting immutable history."}
  ],
  "reopens": {"decisionId": "WO-172-D008", "observation": "The bounded pass fixes three records and instruments two surfaces; the 25 baseline candidates and other fields remain for FUP-71fc2efc208f597a."},
  "reopenWhen": "A new current advisory appears, a changed baseline record lacks capture provenance, or native hook evidence supplies a reliable route field."
}
```

## WO-178-D007 — Release and evidence bookkeeping

```json
{
  "id": "WO-178-D007",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Stage compatible patch labels for the two behavior-changed components: compiler 0.21.1 and skeleton 0.48.1, with harness host 0.34.1. Console's internal dependency pins and the lockfile follow; its own behavior/version is unchanged. D003 assigned application v0.60.2 from the local baseline. Regenerate the 32 harness surfaces and select fresh deterministic evidence editions after source changes; retain all earlier editions. The feedback live audit is carried by reference because its judged behavior did not change. No commit, push, account setting, live feedback episode or publication is part of executor work. The measured replacement planning paragraph is 216 bytes and the whole security table row is 422 bytes; both edits remain in place within their declared bounds. The publication source lock is refreshed after checking the linked outline still describes the section.",
  "evidence": [
    "release prepare --local assigned v0.60.2 above v0.60.1; component source/version rules in scripts/release.mjs",
    "harness emit and check: 32 generated surfaces; selected evidence scripts preserve immutable paths",
    "docs-check: product 07 is 157210 bytes against ceiling 157212; publication check verifies both linked outlines"
  ],
  "rejected": [
    {"option": "A new dependency, major release or live feedback run", "reason": "No public protocol or dependency shape changes; the declared evidence route is deterministic."},
    {"option": "Raise the product-document ceiling", "reason": "The authorized planning sentence can replace the existing prose within its current ceiling."}
  ],
  "reopenWhen": "Integration changes the release baseline, a component's compatibility impact changes, or an evidence check identifies changed live-judged feedback behavior."
}
```

## WO-178-D004 — Correction: the allocated carry-ins are part of this order

```json
{
  "id": "WO-178-D004",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "The remaining implementation was narrowed to the eight numbered criteria without reading the current dispositions of all provenance-named register rows.",
  "meant": "FUP-01e80ba5ce62c72a explicitly allocates the malformed-decision catch here; FUP-d90c46abf5658272 explicitly allocates the reproducible shell attribution/corroboration repairs and a classification bound, with unsupported shell forms recorded as known.",
  "changed": "Read both current dispositions, announced the missed work, and queued adjacent-0001 before continuing. The full review gate waits for these repairs.",
  "decision": "Repair the carry-ins in the existing readers and classifier. scripts/lib/meta.mjs owns the unsafe JSON.parse that the planning commands call, and packages/skeleton/src/harness-command.ts owns the corroboration and nesting work, so both are necessary subject inputs. D002's eight-lens comparison still applies: source-word evidence reduces false counts, deterministic work bounds limit shared cost, and no new refusal or agent is introduced. A full shell interpreter, semantic message classifier and wholesale historical rewrite would exceed this bounded remedy; leaving allocated defects untouched would retain the operator's supervisory burden.",
  "evidence": [
    "docs/planning/followups.json current dispositions for FUP-01e80ba5ce62c72a and FUP-d90c46abf5658272, read 2026-10-01",
    "WO-172-D053 and WO-172-D059; scripts/lib/meta.mjs readDecisions; harness-command.ts unsplitWord, builtin option match, plain-text substitution/math markers and repeated scope joins"
  ],
  "rejected": [
    {"option": "Declare every cited shell item outside the numbered criteria", "reason": "The provenance names the allocated register rows and their dispositions explicitly require these carry-ins."},
    {"option": "Rebuild shell execution or infer arbitrary runtime variable values", "reason": "This observer can conservatively decline unknown input without affecting host execution."}
  ],
  "reopenWhen": "The regression cases still accept output-only words, a bounded reader exceeds the hook budget in ordinary use, or the register assigns more of the residual work."
}
```

## WO-178-D002 — Bounded observations and one exact admission

```json
{
  "id": "WO-178-D002",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Implement the selected order through the existing generated hooks, journal, canonical lifecycle and planning feed. Hook generation actually lives in packages/compiler/src/harness.ts; changing that emitter and scripts/resume.mjs for the expressly required Codex dispatch observation is necessary to deliver the named behavior. No account setting is changed and no remote publication occurs in execution. The hook admission compares the exact helper spelling, main checkout and recorded release-close dispatch against fresh canonical legal actions; all five existing refusals precede it. Counts expose local coverage and unknowns instead of implying that absent journals mean no interventions. Prefix classification describes the control prefix, not a semantic reading of the message.",
  "evidence": [
    "WO-178 design and criteria 1 through 8; canonical next dispatch on 2026-10-01",
    "packages/compiler/src/harness.ts lowerToHarness emits the hooks; scripts/lib/harness.mjs installs generated surfaces",
    "packages/skeleton/src/harness-host.ts recordDispatch, permission facet and record; scripts/resume.mjs Codex dispatch session entry",
    "Claude official hooks reference read 2026-10-01: https://code.claude.com/docs/en/hooks#pretooluse-decision-control and #permissiondenied; Context7 /websites/code_claude"
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Make failures and interventions visible to the planning pass without recurring manual surveys, and let the already-authorized close reach its reviewed helper. This is machinery supporting the source-to-deliverable loop, not delivery work itself.",
    "traps": {
      "policyResistance": "The exact admission runs only after existing refusals; counts introduce no new gate.",
      "tragedyOfTheCommons": "One writer, no subagents, bounded feed output and existing readers; unknown token counters remain unknown.",
      "driftToLowPerformance": "Fixtures distinguish observed zero from missing coverage and test the near-miss commands.",
      "escalation": "No retry loop or classifier in a hook; the denial advisory names the existing operator routes.",
      "successToTheSuccessful": "Shared folds win on matching behavior, not investment; D001 compares duplication.",
      "shiftingTheBurden": "The journal captures observations automatically and planning counts them without asking a role to remember each incident.",
      "ruleBeating": "Fixture-only admission cannot establish live auto-mode behavior; the first merged live close remains the declared observation.",
      "seekingTheWrongGoal": "Counts inform a pass; neither row volume nor fewer recorded failures is treated as product progress."
    },
    "naiveInterventionism": "Keep the existing lifecycle, refusal paths, privacy floor, gate reuse and immutable history. New records contain digests and constrained metadata. An unreadable observer cannot block a prompt or create an admission.",
    "noOp": "Leaving the current hooks and feed alone preserves the documented gaps; a broad allow rule or a second transcript survey does not provide the specified durable observation. The bounded change is authorized and testable."
  },
  "rejected": [
    {"option": "A wildcard permission allow or a user autoMode setting", "reason": "Wider authority and outside the order; the recorded lifecycle admits only one exact helper family."},
    {"option": "Journal prompt or tool-input text", "reason": "The clean-room floor and order permit only digests and constrained metadata."},
    {"option": "Claim the hook bypasses every host rule", "reason": "The current official documentation says deny and ask rules are still evaluated; the planning citation described a broader guarantee."}
  ],
  "reopenWhen": "The first live Claude auto-mode close denies the exact helper, host hook metadata changes, or the bounded journal coverage prevents a planning pass from interpreting a count."
}
```

## WO-178-D001 — Economy: reuse existing readers

```json
{
  "id": "WO-178-D001",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "kind": "experiment",
  "question": "Can the new counts and Stop line reuse existing phase-attempt and task readers?",
  "alternatives": [
    "Reuse completedPhaseAttempts and observedFacts",
    "Duplicate the timing and task folds"
  ],
  "observation": "Two assertions pass: a 10000 ms completed attempt and a journaled running task. The first probe supplied an invalid non-digest session key and failed; the corrected fixture uses the declared digest contract. The timing generator omits completion time, so the consumer pairs its results with completion events in append order.",
  "budget": {
    "wallSeconds": 300
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 0.007,
    "tokens": null,
    "commands": ["Two in-process node probes of completedPhaseAttempts and observedFacts"],
    "source": "performance.now for corrected probe including imports and fixture preparation; earlier source reading and failed probe are outside this measured duration but inside the 300-second trial"
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["Use the shared readers in the existing planning feed and Stop handler"],
    "summary": "Reuse definitions; no measured runtime or token saving."
  },
  "outcome": "adopted",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "decision": "Use existing readers with small consumer projections.",
  "evidence": [
    "scripts/lib/control-time.mjs completedPhaseAttempts",
    "packages/skeleton/src/observed-facts.ts observedFacts",
    "Two executor-session synthetic assertions"
  ],
  "rejected": [
    {
      "option": "Duplicate the folds",
      "reason": "Creates competing definitions without a required behavior difference."
    }
  ],
  "reopenWhen": "A consumer needs facts the existing reader cannot supply within this scope."
}
```

## WO-178-D003

```json
{
  "id": "WO-178-D003",
  "date": "2026-10-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.60.2, the next patch above the observed release baseline v0.60.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.60.1 (local tags)",
    "patch classification declared in docs/work-orders/WO-178-the-record-holds-what-the-operator-sees.md"
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

## WO-178-D019

```json
{
  "id": "WO-178-D019",
  "date": "2026-10-01",
  "dispatch": "resume: fix; release prepare",
  "decision": "Retime unpublished application target v0.60.2 to v0.61.1, the next patch above the observed release baseline v0.61.0, in the heading and the README version claim. Scope, acceptance, component versions and published tags are unchanged.",
  "evidence": [
    "release baseline v0.61.0 (local tags)",
    "superseded target v0.60.2",
    "new target v0.61.1"
  ],
  "rejected": [
    {
      "option": "A dated roadmap or README paragraph",
      "reason": "A version collision is recorded once, as this decision (WO-086); product documents and the README carry only the version claim."
    }
  ],
  "reopenWhen": "A collision changes scope, acceptance, component versions or a published tag, or needs a hand step beyond this record."
}
```

## WO-178-D022

<!-- integration refs/dotln/checkpoint/WO-178/12 -->

```json
{
  "id": "WO-178-D022",
  "date": "2026-10-01",
  "dispatch": "resume: final review; worktree integrate WO-178",
  "decision": "Integrate main at 54c29c12 (WO-103 v0.60.2, WO-102 v0.60.3, WO-181 v0.61.0 and WO-105 v0.61.1) into the uncommitted WO-178 worktree. The helper fast-forwarded the branch and re-applied the work. Seven authored conflicts were resolved as follows. Component labels: main's WO-181 had already taken compiler 0.22.0 and skeleton 0.49.0, above the staged 0.21.1 and 0.48.1, so this order's compatible patch bumps are retimed to compiler 0.22.1 and skeleton 0.49.1, keeping their declared patch impact. The console's pins, the skeleton's compiler pin, COMPILER_PACKAGE_VERSION and the lockfile follow, and the harness host stays at 0.34.1 because main kept 0.34.0. Evidence: both orders had minted editions from registered sources the other changed, so neither selection held on the merged tree. All four checks failed against main's WO-181 selection. The authority, artifact-identity and verification editions are re-minted deterministically as WO-178 revisions 004, 002 and 002. The feedback edition carries WO-181 revision 002's live audit into WO-178 feedback-002, the route the feedback check itself prints when only component release labels moved, with no live episode. The console self-hosted case is re-pinned to that report. Each earlier edition stays as immutable bytes. The application release retimes from v0.61.1 to v0.61.2 under the recorded patch classification, because WO-105 published v0.61.1. This follows the WO-147-D010 precedent for minting deterministic editions on an integrated tree in final review.",
  "evidence": [
    "refs/dotln/checkpoint/WO-178/12",
    "base 2f52501450b55abdb03386352bb651909bb2e134",
    "upstream 54c29c1294b07c1cbece31f49f31f9fefdc53c73",
    "release preparation: Retimed WO-178: v0.61.1 → v0.61.2 above the observed release baseline v0.61.1. Files changed: docs/work-orders/WO-178-the-record-holds-what-the-operator-sees.md, README.md, docs/evidence/WO-178/meta.json, docs/final-reviews/WO-178/PR.md. Meter snapshot: docs/evidence/WO-178/meta.json, 4100 bytes. Tag observation: local snapshot only.",
    "Intake: docs/intake holds only its three tracked .gitkeep files in this worktree, so no intake backup was owed.",
    "Component versions, git show at 2f525014, v0.61.0 and main: compiler 0.21.0, 0.22.0, 0.22.0; skeleton 0.48.0, 0.49.0, 0.49.0; HARNESS_HOST_VERSION 0.34.0 at all three.",
    "Edition checks on the integrated tree before the re-mint, against main's WO-181 selection: authority-evidence and verification-evidence --check threw assertion diffs, artifact-identity-evidence --check reported four stale WO-181/artifact-identity/002 files, and feedback-evidence --check reported that a compiler release moved the policy hash since WO-181/feedback-002 and printed the --carry route.",
    "After selecting the new revisions in docs/evidence/current.json: authority-evidence --write then --check verified two unchanged programs, the four migrations, four widening rejections, nine runtime denials and 35 bundle comparisons; artifact-identity-evidence verified four current files in WO-178/artifact-identity/002; verification-evidence verified four synthetic files; feedback-evidence --carry docs/evidence/WO-181/feedback-002 then --check verified ten passing regressions and ten removal failures. console-fixtures --record-current-selfhost then --check matched all five cases.",
    "Main changed none of WO-178's source or test files: harness-host.ts, harness-command.ts, packages/compiler/src/harness.ts, plan-failures.mjs, refute-plan.mjs, docs-check.mjs, meta.mjs, resume.mjs, work-orders.mjs, test-harness.mjs, test-plan-refutation.mjs, test-docs-check.mjs and test-work-orders.mjs. Its overlap with this order is product 07 (a different paragraph, merged without conflict; WO-178's planning sentence is intact), the version files, the generated harness surfaces and projections. docs/AI-HARNESS-SECURITY.md is unchanged upstream.",
    "Affected checks on the integrated tree: node scripts/harness.mjs check reported 32 generated surfaces; npm run publication:check passed; npm run release -- check-surfaces --local passed 57 checks and exited 0; node scripts/docs-check.mjs passed with 0 current operator-word advisories against 34 baseline entries; node scripts/refute-plan.mjs check exited 0; git diff --cached --check was clean.",
    "npm test -- --review on the staged integrated tree: 43 suites passed, 0 failed, 810.53 s, 88 fresh tasks, exit 0; code identity 9ee66ec2faa53e1f53b0706e5f00582a0126ffac81e62ffce75214b909252afd, recorded 2026-10-01T19:04:07.060Z. The selection omits evidence-sources because, against main, its only changed declared source is the compiler's release literal, which changedMachinery excludes."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Keep main's WO-181 edition selection",
      "reason": "All four of its checks fail on the merged tree, because WO-178 changed registered sources after WO-181 minted them."
    },
    {
      "option": "Keep WO-178's revision 003, 001, 001 and 001 selection",
      "reason": "Those editions predate WO-181's changes to registered skeleton sources, which are now part of the tree."
    },
    {
      "option": "Run a live feedback episode",
      "reason": "Judged feedback behavior did not change; the carry check refuses a carry when it does, and it accepted this one."
    },
    {
      "option": "Keep compiler 0.21.1 and skeleton 0.48.1",
      "reason": "They are below main's released labels; the patch impact is preserved one step above main instead."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-01. Original base: `2f52501450b55abdb03386352bb651909bb2e134`.
Fetched main: `54c29c1294b07c1cbece31f49f31f9fefdc53c73`. Checkpoint: `refs/dotln/checkpoint/WO-178/12`.
Named stash retained: `c34b6b4810d2bdaedff178a8769c2d45f00b0610` (WO-178 integrate 2026-10-01).
Resolved projections: .claude/harness-manifest.json, .claude/hooks/commit-msg.mjs, .claude/hooks/concurrent-work-requires-worktrees.mjs, .claude/hooks/finish.mjs, .claude/hooks/no-attribution.mjs, .claude/hooks/no-lint-type-disables-as-fixes.mjs, .claude/hooks/permissions.mjs, .claude/hooks/presence-posttooluse.mjs, .claude/hooks/presence-pretooluse.mjs, .claude/hooks/presence-stop.mjs, .claude/hooks/presence-userpromptsubmit.mjs, .claude/hooks/read-observer.mjs, .claude/hooks/session.mjs, .claude/hooks/write-observer.mjs, docs/control/current.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/README.md, packages/console/fixtures/expected/selfhost.html, packages/console/fixtures/expected/selfhost.json, packages/console/fixtures/expected/selfhost.txt.
Release preparation: Retimed WO-178: v0.61.1 → v0.61.2 above the observed release baseline v0.61.1. Files changed: docs/work-orders/WO-178-the-record-holds-what-the-operator-sees.md, README.md, docs/evidence/WO-178/meta.json, docs/final-reviews/WO-178/PR.md. Meter snapshot: docs/evidence/WO-178/meta.json, 4100 bytes. Tag observation: local snapshot only.
Carried-forward claims: main changed none of WO-178's source or test files (`harness-host.ts`, `harness-command.ts`, the compiler's `harness.ts`, `plan-failures.mjs`, `refute-plan.mjs`, `docs-check.mjs`, `meta.mjs`, `resume.mjs`, `work-orders.mjs` and the four test files). VER-001's and VER-002's criterion 1–6 evidence therefore rests on unchanged subject bytes and carries forward. Criterion 7's write-backs are byte-identical: the security row, which main did not touch, and the product 07 planning sentence, beside main's edit to another paragraph. Criterion 8's gates were run on the integrated tree, and every suite passed (D022 evidence). The only behavior-adjacent integration changes are component release labels and deterministic evidence editions, and none changes a contract, authority or acceptance claim.
Authored conflicts observed: docs/evidence/current.json, package-lock.json, packages/compiler/package.json, packages/compiler/src/artifact-identity.ts, packages/console/fixtures/manifest.json, packages/console/package.json, packages/skeleton/package.json.
Affected checks are printed by the command; results remain untested until executed.
