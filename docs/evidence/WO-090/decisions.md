# WO-090 decisions

## WO-090-D007 — Repair this order's unresolved decision anchors; nominate the repo-wide anchor check separately

```json
{
  "id": "WO-090-D007",
  "date": "2026-09-20",
  "dispatch": "resume: final review",
  "decision": "Within the reviewer's bounded cleanup, repair the three short-form decision links in this order's evidence README (D001, D003, D004) to the full GitHub heading slugs, and refresh the two figures the repair superseded: the software-engineer edition lock, which moved again to c0d4e920 after the goal-card edit, and the guide's final size of 1,933 lines and 141,047 bytes. Leave the 41 unresolved decision anchors in closed orders' reports untouched, because those reports are immutable, and nominate a generated anchor check for planning instead of adding one here.",
  "evidence": [
    "reviewer scan of every tracked docs Markdown file plus this order's untracked evidence, resolving each ](path/decisions.md#fragment) link against the target file's heading slugs: 41 unresolved before the repair, concentrated in docs/evidence/WO-056 (11), docs/final-reviews/WO-056 (6), docs/final-reviews/WO-140 (6), docs/evidence/WO-140 (4); 0 remain in docs/evidence/WO-090",
    "docs/evidence/WO-090/decisions.md headings carry titles after an em dash, so the rendered slug is wo-090-dNNN--<title>; a bare #wo-090-d004 resolves nowhere",
    "docs/lineage/decisions-index.md WO-090 rows: all six generated links use the full slug and resolve, so the generator is already correct",
    "docs/publication/software-engineer-toc.md line 5: sha256:c0d4e920af3722b6e05fa9d5daadda9dfb802c35d90c5b30ee195a2e851d5fc9, not the 841fa17c the README recorded before the repair",
    "wc on docs/product/07-execution-guide.md: 1,933 lines, 141,047 bytes at the reviewed subject",
    "docs/verifications/WO-090/VER-002.md limits: the README's split presentation recorded as a readability limit",
    "npx prettier --check on the edited README: pass"
  ],
  "rationale": "Mission and critical path: this order's deliverable is documentation a cold session can navigate, so links that land at the top of a 162-line decisions file and figures that disagree with the bytes are defects in the deliverable itself, not cosmetics. Scale: five corrections inside the one file this order adds. Policy resistance: the closed reports stay immutable and no check is weakened. Commons: the shared defect is a missing check, recorded once here rather than re-diagnosed by the next reviewer. Drift: the acceptance criteria are unchanged and none depends on these links; VER-002's verdict stands on the measurement, which this reviewer reproduced independently. Escalation: no new step, hook or receipt is added by this order. Success to the successful: the generator already emits correct slugs, so the fix is to the hand-written links, not to the generator. Shifting the burden: the follow-up names paths and cases so planning can size the check instead of inheriting an unstated defect. Rule beating: the repaired links are verified by resolving them, not by asserting them. Seeking the wrong goal: the link count is not offered as evidence for any acceptance criterion. Naive Interventionism: each edit is reversible and touches no measured input, no product document and no closed report; the measurement was re-run after the edits and is unchanged. NoOp would ship three new unresolved links in a file this order creates and leave two figures contradicting the bytes beside them.",
  "rejected": [
    {"option": "Repair the 41 unresolved anchors across closed orders' evidence, verification and final-review reports", "reason": "Those reports are immutable records of their own subjects; rewriting them exceeds this order's scope and the reviewer's bounded cleanup."},
    {"option": "Add an anchor-resolution check to the document suite in this order", "reason": "That is machinery, not the bounded documentation relocation this order authorizes; it needs its own order with a declared failure mode for generated and historical links."},
    {"option": "Record the three links as a report sentence and leave them unresolved", "reason": "A defect met must be fixed within the bound or boarded up with a named follow-up; these were inside the bound."}
  ],
  "followup": "Planning: add a document-suite check that resolves in-repo Markdown anchors against their target headings, and decide the disposition of the 41 unresolved decision anchors already in closed reports. The generator emits correct slugs, so the check should cover hand-written links and treat immutable historical reports as declared exceptions rather than failures. Paths: scripts/test-docs or the document suite it selects, docs/evidence/WO-056, docs/evidence/WO-140, docs/final-reviews/WO-056, docs/final-reviews/WO-140. Check a correct link, a short-form link whose heading carries a title, a link to a missing file and a generated index row. Priority: prevents each new order adding unresolved links by hand; no machinery change is authorized by WO-090.",
  "reopenWhen": "A document-suite anchor check lands and declares the historical exceptions, or a closed report is reopened for another authorized reason and can carry its own link repair."
}
```

## WO-090-D006 — Operator-authorized local commits refresh the planning judgment

```json
{
  "id": "WO-090-D006",
  "date": "2026-09-20",
  "dispatch": "resume: fix; operator response to the concrete local-commit exception: Authorize local commits and refutation",
  "decision": "After the live product gate finishes, commit the changed planning inputs (product 07 and WO-090's already-assigned title) and this decision record locally, refresh the canonical planning cost table from this run's actual observations, commit that input locally, then run the canonical pass-scoped planning refutation with one fresh background worker, no inherited conversation and no descendants. File its frozen judgment through the canonical receipt helper and run the document checks. The operator explicitly authorized the required planning-subject and receipt commits before final review; no push, PR, integration or publication is authorized. Preserve independent work-order verification as a separate dispatch.",
  "evidence": [
    "npm run plan -- check: planning pass needs a receipt matching the current subject: observed evidence or goal standard changed",
    "scripts/lib/plan-subject.mjs#buildGoalSubject: goalStandard is the entire Goal-aligned decisions section",
    "scripts/lib/plan-continuation.mjs#checkPlanContinuation: exact goalStandard comparison",
    "scripts/lib/plan-direct.mjs#beginDirectRefutation: committed/workspace subject equality; fileDirectRefutation: receipt commit",
    ".agents/skills/dotln-executor/SKILL.md: No branch commits before final review",
    "operator authorization in this resume: fix session, 2026-09-20",
    "First direct-refutation attempt refused: one judgment per pass requires changed observed evidence; the changed standard alone is not evidence. Product 07 planning deliverables prescribe npm run meta -- --plan-cost to refresh actual meter observations after the subject revision.",
    "git history: guard introduced by 16ecf2cc on 2026-09-15; the goal card's later committed edit was 45765940 on 2026-09-17, a planning pass followed by refutation",
    "npm test: 21 passed, 0 failed, 253.38 seconds, 65 fresh tasks before the local planning-subject commit"
  ],
  "rationale": "Changed evidence revisits D005's process-cost expectation: the edit adds no recurring mechanism, but exact-text planning binding requires a one-off refutation and an operator commit exception even though the rules are preserved. Mission/critical path remain the modest operator-flow improvement, not runtime progress. Policy resistance and escalation are material: the commit-before-refutation requirement conflicts with the executor's no-early-commit rule. The explicit exception resolves this occurrence without weakening either check. Commons and shifting the burden: record the one-off cost and the general conflict instead of silently charging future repairs another rescue. Drift and rule beating: retain exact binding and the real lower-byte criterion. Success to the successful and seeking the wrong goal: use the existing bounded refuter, not a new workflow or proxy pass. Naive Interventionism: stage only the planning inputs and decision provenance; preserve all unrelated working state. NoOp would leave the implemented repair unable to pass the document gate. No latency or amortized saving is claimed for a 252-byte-per-role reduction.",
  "rejected": [
    {"option": "Ignore the planning failure because the edit preserves meaning", "reason": "The gate binds exact text; a self-attested equivalence is not its required judgment."},
    {"option": "Commit before asking for the exception", "reason": "The executor skill explicitly forbids branch commits before final review; resume: fix alone did not suspend that rule."},
    {"option": "Modify the gate or receipt format in this documentation repair", "reason": "That changes the planning authority mechanism and exceeds the bounded relocation/retirement deliverable; the operator authorized local commits and refutation instead."}
  ],
  "followup": "Planning: design an explicit executor route for an authorized edit to the goal standard that requires fresh planning refutation before final review. The present exact-text binding plus committed-subject prerequisite conflicts with no branch commits before final review. Consider a narrow local-subject commit authorization or a preserved reviewable snapshot, retaining independent judgment and immutable subject identity. Paths: scripts/lib/plan-direct.mjs, scripts/lib/plan-continuation.mjs, generated executor source and product 07. Check a rule-preserving documentation edit, a substantive standard change, stale/mismatched snapshots and refusal of unauthorized publication. Priority: remove recurring operator rescue when another execution order edits the bound section; no machinery change is authorized by WO-090.",
  "reopenWhen": "Fresh refutation finds an observed blocking mismatch, the committed subject differs from the reviewed bytes, or another execution order needs to edit the bound goal standard."
}
```

## WO-090-D005 — Retire the duplicated goal-alignment procedure and preserve its unique limits

```json
{
  "id": "WO-090-D005",
  "date": "2026-09-20",
  "dispatch": "resume: fix; repair VER-001 N1 under WO-090's existing objective to retire any paragraph a generated skill or compiled unit already carries",
  "decision": "Replace the All phases introduction in product 07 Goal-aligned decisions with its dated provenance and a pointer to the generated roles' Goal Alignment and Process Cost duties. Keep its evidence-of-benefit, intervention-risk and verification/handoff comparison clauses beside the existing NoOp paragraph, followed by its legal/release-authority and NoOp limits verbatim. Preserve the mission, critical path, accuracy rule, all eight lens questions, platform lens, decision surfaces and mechanism limits. Preserve the original measurement records and VER-001; measure the repaired tree separately against the original activation bytes, using the unchanged WO-039 instrument and WO-999 fixture. The acceptance criterion and generated role text stay unchanged.",
  "evidence": [
    "docs/verifications/WO-090/VER-001.md#n1--criterion-1-first-clause-the-directed-load-totals-are-equal-not-lower",
    "docs/work-orders/WO-090-shorter-cold-start.md#objective",
    "docs/product/07-execution-guide.md#goal-aligned-decisions",
    ".agents/skills/dotln-executor/SKILL.md and all five sibling role skills: identical Goal Alignment and Process Cost duties; the .claude roots carry the same duties",
    "scripts/harness-context.mjs#measureHarnessContext and scripts/lib/harness-context.mjs#directedReads",
    "scripts/test-harness.mjs: WO-132 whole-procedure context reports late and unaccounted reads with advisory growth",
    "docs/evidence/WO-090/README.md#relocation-table"
  ],
  "rationale": "Mission and critical path: remove repeatedly loaded procedure while retaining the operator-flow contract; this is documentation efficiency, not runtime progress. Policy resistance: preserve each duty in its existing generated home and retain the unique limits in the guide. Commons: every measured role receives fewer actual bytes, with no new input. Drift: keep the strict lower-than-activation criterion and report the observed delta. Escalation: no extra workflow step, check, hook or permanent measurement mechanism. Success to the successful: retain the original instrument and consider the earlier no-edit choice on evidence, not author authority. Shifting the burden: repair the duplicate instead of asking the operator to weaken the criterion. Rule beating: the actual loaded text loses a repeated procedure; the fixture, lens questions and acceptance rule are unchanged. Seeking the wrong goal: report directed bytes, not the whole-guide line count, as the outcome. Naive Interventionism: this one-paragraph retirement is reversible, preserves its dated provenance and every unique clause, and is checked against the existing role text before measuring. NoOp leaves a known failed criterion despite an explicitly allowed duplicate-retirement option; reopen if a mapped duty is absent or the real matched measurement fails to fall.",
  "rejected": [
    {"option": "Amend criterion 1 to permit equality", "reason": "No amendment was authorized or needed: the order expressly includes retirement of duplicated procedure, and that option was not exhausted."},
    {"option": "Delete or shorten the eight-lens table or unique goal-card guidance", "reason": "Those rules are not duplicated in the generated skills and must retain their home."},
    {"option": "Claim success from the instrument's frozen legacy lower flag", "reason": "It already passed before WO-090; the repair must lower the current directed totals against this order's activation."}
  ],
  "reopens": {
    "decisionId": "WO-090-D001",
    "observation": "Same-day correction: D001 and VER-001 correctly measured equality for the relocation, but inferred that any reduction required dropping a rule. The checked generated skills already carry the All phases paragraph's procedure; its unique authority limits can remain verbatim. WO-090 explicitly authorizes retiring such duplication. This is a rule-preserving implementation repair, not a criterion amendment. VER-001 remains immutable evidence about the earlier subject."
  },
  "reopenWhen": "A sentence-to-home comparison finds a lost duty, a generated role stops carrying Goal Alignment or Process Cost, or the matched activation-to-repair measurement is not strictly lower for every defined role."
}
```

## WO-090-D001 — The relocated sections were never in any role's directed set; relocate anyway, prune nothing, and put the criterion-1 premise to the operator

```json
{
  "id": "WO-090-D001",
  "date": "2026-09-20",
  "dispatch": "resume: next (Claude Code, operator-selected Fable 5.1); WO-090 Cost line: measure the per-role directed-load totals at activation with scripts/harness-context.mjs because no current total is recorded",
  "decision": "Measure first, then relocate exactly what the objective names and prune nothing. At activation (f24b5d72) WO-039's method (measureHarnessContext over the WO-999 fixture) puts product 07 into each of the four measured roles' directed sets only as the §Goal-aligned decisions subtree (lines 39–121, 6,205 bytes, 83 lines); §Model-specific notes and the Codex sandbox-approval paragraph are in no role's set, so moving them cannot lower any role's total. The relocation still lands (the guide becomes the operating contract with pointers and every paragraph keeps one home), the measurement is recorded before and after (identical: executor 32,855, verifier 30,762, reviewer 36,666, release-close 22,504 bytes in both skill roots), and criterion 1's 'lower for every role' clause is reported as not achievable by this order's design rather than manufactured by trimming the goal card, which is the only guide content in the directed sets.",
  "evidence": [
    "docs/evidence/WO-090/harness-context-before.json",
    "docs/evidence/WO-090/harness-context-after.json",
    "docs/evidence/WO-090/cold-start-before.json",
    "docs/evidence/WO-090/cold-start-after.json",
    "scripts/lib/harness-context.mjs#directedReads",
    "scripts/harness-context.mjs#measureHarnessContext",
    ".claude/skills/dotln-executor/SKILL.md (Goal Alignment line: the one guide read directive)",
    "docs/product/07-execution-guide.md#read-order-for-a-cold-start (directed-input table)"
  ],
  "rationale": "Mission and critical path: this order is documentation hygiene on the operator-flow side, not runtime progress; its value is a guide a cold session can navigate and one home per harness rule. Policy resistance: pruning §Goal-aligned decisions to force a lower number would fight the order's own non-goal (dropping no rule) and design (removal before pruning). Commons: the shared per-role cost is unchanged; nothing new is read. Drift: the explicit standard is the measured directed total, and it is reported as measured. Escalation: no new check, hook or receipt; pointers and one evidence README. Success to the successful: the WO-039 fixture is kept as the measure rather than replaced by a friendlier one. Shifting the burden: the operator now has the measured fact and can amend the criterion once instead of cycling verify and fix. Rule beating: refused; equal totals are recorded as equal. Wrong goal: the guide's line count fell from 2,016 to 1,932 as a consequence and is not claimed as the measure. Naive Interventionism: the section keeps its heading and anchor so sixty order Model lines, five anchor links, the publication index row and cited-section resolution keep working, and the change is reversible by moving the paragraphs back. NoOp: leaving the guide as it was keeps 111 lines of harness observations inside the executor's contract and leaves WO-035's cold-start item unowned; acting costs pointer maintenance only.",
  "rejected": [
    {"option": "Prune duplicated sentences out of §Goal-aligned decisions so every role's total falls", "reason": "The goal card is operator direction and the home of the eight-lens rule; the order forbids dropping a rule and puts removal before pruning. A number produced that way would pass the criterion without the intended behavior."},
    {"option": "Measure with WO-090's own Cites block instead of the WO-999 fixture", "reason": "WO-090 cites §Model-specific notes, the security document and the playbook, so the relocated bytes leave one cited input and enter two others; the number would describe this order's self-reference, not the method the criterion names."},
    {"option": "Stop before editing and ask the operator to amend criterion 1 first", "reason": "The moves, pointers and table are the deliverable whatever the measurement's direction, and the session runs unattended; the measured fact is recorded here for the operator's decision at verification or by amendment."}
  ],
  "followup": "Operator: WO-090 criterion 1 asks for a strictly lower directed-load total per role by WO-039's method; the measured totals are equal before and after because product 07 enters the measured directed sets only through §Goal-aligned decisions. Either amend the criterion (for example to 'not higher, with the relocated sections shown absent from every directed set') and bind it with npm run plan -- amend-order WO-090 WO-090-D001 \"operator authorization and bounded scope\", or accept the equal measurement at verification. A repair cannot change the equality without pruning the goal card.",
  "reopenWhen": "A role's generated skill or the floor gains a read directive that covers product 07 beyond §Goal-aligned decisions, or the measurement fixture starts citing guide sections; then relocation changes the total and the criterion can be judged as written."
}
```

## WO-090-D002 — One home per paragraph: harness readback to the security document, control-time detail to the playbook, the heading stays as a pointer

```json
{
  "id": "WO-090-D002",
  "date": "2026-09-20",
  "dispatch": "resume: next; WO-090 objective and acceptance criterion 2",
  "decision": "Keep the `## Model-specific notes` heading in product 07 as a pointer stub carrying only the behavioral-guidance paragraph, one sentence that restates the attestation contract and points at §Operator resume phrases step 3, and three pointers. Relocate the WO-132 version and effort paragraphs, the Codex thread-readback and account-label paragraph and the WO-126 version-line attestation bullet into a new `## Harness version, model and effort readback` section of docs/AI-HARNESS-SECURITY.md; relocate the three WO-146 Copilot paragraphs into a new `### Selected-session readback, completion and counters` subsection of that document's Copilot section; relocate the WO-028 control-time bullet's sentences that the playbook did not already carry into the playbook's §Resume command surface. Product 07 §Read order gains one paragraph naming the homes and the measured fact.",
  "evidence": [
    "docs/evidence/WO-090/README.md#relocation-table",
    "docs/publication/audience-status-index.md (row model-specific-notes, status specified)",
    "grep 07-execution-guide.md#model-specific-notes: five consumers; grep '§Model-specific notes': sixty work-order Model lines and the Cites blocks of WO-090, WO-102, WO-125 and WO-132",
    "scripts/lib/harness-context.mjs#citedSelectors (a cited section that no longer resolves throws)"
  ],
  "rationale": "Dropping the heading would break five anchor links, the publication index coverage (272 product headings) and cited-section resolution for four orders; the stub costs about twenty lines and keeps every consumer valid. The security document already holds the summary of per-harness readback and counters (its hook-boundary paragraph and the Copilot control table), so the detailed paragraphs join their summaries there; the playbook already holds the WO-028 timing paragraph, so the remaining sentences join it. Neither destination is in any role's directed set, which is criterion 1's second clause.",
  "rejected": [
    {"option": "Delete the heading and rewrite every consumer", "reason": "Sixty immutable work orders and closed evidence name the section; rewriting history is forbidden and the stub is cheaper."},
    {"option": "Move all of §Model-specific notes into one new section of the security document, including the Copilot paragraphs", "reason": "The Copilot section is dated and already owns that harness's observations; splitting the Copilot paragraphs away from it would create two homes."},
    {"option": "Retire the WO-132 and Copilot paragraphs as already carried by the generated executor skill", "reason": "The skill carries the duties in summary (operator-attested fallback, ultra normalization, Copilot readback is CLI-selected) but not the probe record, the account-label grammar, the counter scopes or the session-detection channels; those sentences need a home."}
  ],
  "reopenWhen": "A consumer needs the observations back beside the contract, the security document is split per harness, or the publication index drops the row."
}
```

## WO-090-D003 — The Codex sandbox-approval paragraph is retired with a pointer because three surfaces already carry it

```json
{
  "id": "WO-090-D003",
  "date": "2026-09-20",
  "dispatch": "resume: next; WO-090 objective (retire any paragraph a generated skill or compiled unit already carries)",
  "decision": "Replace the guide's Codex sandbox-approval paragraph in §Operator resume phrases step 2 with a pointer. Its rule is carried by the playbook §Harness safety baseline (which now names `briefing` among the read-only commands, the one fragment the playbook lacked), by docs/AI-HARNESS-SECURITY.md §Why recovery checkpoints warn under sandboxed Codex, and by the generated executor skill's line 'State-changing resume commands require one-invocation outside-sandbox approval in Codex; inspect the exact command, package mapping, and lifecycle-script diff first.'",
  "evidence": [
    "docs/PLAYBOOK.md#harness-safety-baseline",
    "docs/AI-HARNESS-SECURITY.md#why-recovery-checkpoints-warn-under-sandboxed-codex",
    ".claude/skills/dotln-executor/SKILL.md (state-changing resume commands line)",
    "docs/evidence/WO-090/README.md#relocation-table (sentence-by-sentence carriers)"
  ],
  "rationale": "The paragraph described the 2026-09-01 Codex baseline; the operator's current Codex mode is full access with no approval prompts (security document, 2026-09-17), so the rule is harness posture, not lifecycle contract. Three homes remain; the guide keeps a pointer so a Codex session at the old baseline still finds the procedure from the phrase table.",
  "rejected": [
    {"option": "Relocate the paragraph verbatim into the playbook as a fourth copy", "reason": "The playbook paragraph already says the same thing sentence for sentence except `briefing`; a copy would drift."},
    {"option": "Treat the Gate sandbox preflight (WO-140) paragraph in §Discipline as another sandbox paragraph and move it", "reason": "It is the product gate's own contract (declarations, probe, partial results and refusals), not an approval procedure, and no generated skill carries it whole."}
  ],
  "reopenWhen": "The playbook or security document drops the rule, or the generated skill stops carrying the one-invocation approval line."
}
```

## WO-090-D004 — Assign application v0.35.1 as a patch above local v0.35.0 with no component bump

```json
{
  "id": "WO-090-D004",
  "date": "2026-09-20",
  "dispatch": "resume: next; standing release assignment default (patch at activation) and the order's declared patch classification",
  "decision": "Complete the omitted activation target as application v0.35.1 above the latest local annotated tag v0.35.0 (WO-146, merged at f24b5d72). Keep compiler 0.17.0, skeleton 0.31.0, kernel 0.6.0 and console 0.1.7: the deliverable changes documents, one evidence directory and the publication lock only. Prepare the release locally; release prepare reports the target current with no files changed.",
  "evidence": [
    "git tag --list v0.3* (latest v0.35.0) and git describe --tags --abbrev=0 on HEAD",
    "docs/work-orders/WO-090-shorter-cold-start.md (heading and Release classification: patch)",
    "README.md release block",
    "docs/product/06-roadmap.md#release-boundary (WO-090 activation completion note)",
    "npm run release -- prepare --local; npm run release -- check-surfaces --local"
  ],
  "rationale": "The classification was assigned at planning under the standing opt-out default; nothing in the change touches package sources, so no component's compatibility impact changes. A patch keeps the ladder honest: a documentation move ships as a patch, and a sibling that takes v0.35.1 first is retimed by the existing collision route.",
  "rejected": [
    {"option": "No-release close", "reason": "The order declares patch under the standing default; a deferred eligible release needs a reviewed durable reason and none exists."},
    {"option": "Bump skeleton or compiler for the pointer changes", "reason": "No package source changed; version-only bumps select no machinery suite and would misstate compatibility impact."}
  ],
  "reopenWhen": "A sibling release consumes v0.35.1 before integration, or an authorized scope change touches a package source."
}
```
