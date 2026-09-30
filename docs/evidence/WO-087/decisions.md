# WO-087 decisions

Dispatch: `resume: next`, 2026-09-30 UTC. Codex CLI 0.159.0,
gpt-6.1-sol, effort ultra (xhigh with workflows), source
codex-session-readback. One writer and one read-only grouped audit agent;
no descendants planned against the observed session cap of 20.

Ledger duty: the order was originally filed on 2026-09-08, before the
2026-09-09 cutoff. Under the executor skill's legacy substitution rule this
decisions file and its generated decisions-index row discharge criterion 3's
ledger-entry duty; execution does not append planning synthesis to the ledger.

Goal alignment: the order separates the release path from proposed planning
work, reducing roadmap reading and reconciliation. This is navigation work,
not evidence of a new source-to-deliverable capability. Policy resistance and
rule beating: the move, publication coverage, byte ceiling and register must
agree, and an exact text comparison supplements the structural gates. Commons
and shifting the burden: one relocation and link reconciliation now remove
recurring reader searches; the map holds the material for selected reads.
Drift and seeking the wrong goal: preserve every candidate and its history;
lower bytes are useful only with intact navigation and meaning. Escalation and
success to the successful: add no generator or product document and compare
the one-time move with keeping the current location. Naive Interventionism:
preserve the release ladder, generated history, candidate wording, source
provenance and register dispositions; rebase only link destinations. NoOp
keeps 864 lines of candidate policy between release history and the ladder.

## WO-087-D001

```json
{
  "id": "WO-087-D001",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Move the twelve headings in the roadmap's named candidate range into the planning map with their heading levels, slugs and prose unchanged; alter only the two product-relative link destinations in that text. Update live inbound navigation, remove its twelve publication index rows and refresh both edition locks. Preserve historical decision strings, register history and filed reports.",
  "evidence": [
    "At base c57fd557, docs/product/06-roadmap.md has 1,613 lines and 127,932 UTF-8 bytes; the heading-delimited interval is lines 299 through 1162, 864 lines, with twelve headings and seven candidate register rows.",
    "The interval's last line is a prettier-ignore directive attached to the retained v0.0.0 heading. Keep that directive with the ladder: the moved candidate content is 863 lines, and the roadmap's net removal is 863 lines. This preserves the exact candidate content without assigning the next rung's formatting directive to a different heading.",
    "The two moved links needing rebasing are 13-uifa-roles.md#uifa-showrunner and 03-architecture.md#candidate--resource-pressure-as-an-environmental-modifier; the budget-window fragment stays inside the moved content.",
    "scripts/check-publication.mjs covers current product headings only; the moved rows must leave the publication index rather than become planning rows in it.",
    "scripts/lib/planning-followups.mjs retains missing-source revisions and accepts explicit duplicate dispositions; source path changes do not automatically transfer current status."
  ],
  "rationale": "WO-087 and the standard-pass planning document section 5 select the map as the candidate home and forbid rewriting candidates. Retaining the ladder's formatting directive is the smallest correction to the historical line-count boundary; the evidence records both the gross interval and net removal.",
  "rejected": [
    { "option": "Create another numbered product document", "reason": "The order explicitly declines it; candidates already belong in the planning map." },
    { "option": "Summarize or delete candidate text", "reason": "The order requires preserved wording, slugs and pending work." },
    { "option": "Move the trailing prettier-ignore directive to the next map heading", "reason": "It formats the retained release rung rather than candidate content; moving it changes an unrelated heading's formatting behavior." },
    { "option": "Rewrite historical decision evidence strings or filed reports", "reason": "They record their original subject; live Markdown navigation can be repaired without altering that evidence." }
  ],
  "reopenWhen": "A moved heading's text or slug differs beyond link rebasing, a current navigation link fails, or review finds a candidate outside the named interval was changed."
}
```

## WO-087-D003

```json
{
  "id": "WO-087-D003",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Reconcile each of the seven former candidate rows through an explicit duplicate request targeting its new map row, and record the former current disposition on the new target through the same revision-bound batch. Preserve all existing revisions and dispositions byte for byte as history; retain any carried deferred or settled status on the new source.",
  "evidence": [
    "Before the move: 771 total rows, 191 pending; statuses are duplicate 33, declined 55, allocated 117, deferred 141, settled 375, open 13, needs-review 4 and untriaged 33.",
    "The moved entries are FUP-0105, FUP-0106, FUP-0107, FUP-0108, FUP-0109, FUP-0110 and FUP-1aa2504e33959003. Five are deferred and two settled; their historical revisions and dispositions remain on these stable identities.",
    "docs/planning/followups.md and scripts/lib/planning-followups.mjs require explicit duplicate targets; a newly discovered source is initially untriaged. The existing batch command binds all requests to one read revision and writes nothing if any request fails."
  ],
  "rationale": "A location change must not create new planning work or erase the prior disposition. Seven duplicate requests satisfy the order; seven additional target requests preserve the current status and reopening condition. Link-only source revisions are judged separately and retain their disposition when the meaning is unchanged.",
  "rejected": [
    { "option": "Only sync the moved sources", "reason": "The old sources become missing and the new sources are unrelated untriaged rows; identity reconciliation is not automatic." },
    { "option": "Dispose old rows as duplicates while leaving every target untriaged", "reason": "The two settled candidates would become pending solely because their file moved." },
    { "option": "Edit the register directly or copy old histories onto new identities", "reason": "The supported command records dispositions against observed revisions and retains original history where it happened." }
  ],
  "reopenWhen": "A moved target fails to carry its old current disposition, a historical prefix changes, or later planning changes a candidate's substance rather than its address."
}
```

## WO-087-D004

```json
{
  "id": "WO-087-D004",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Lower the roadmap's non-exempt landing size to 39,975 UTF-8 bytes and its ceiling to 40,775 bytes, retaining the documented two per cent headroom and the existing generated-history exemption.",
  "evidence": [
    "scripts/docs-check.mjs productContent measured before 96,395 non-exempt bytes and after 39,975; total bytes fell from 127,932 to 71,512. The generated block stayed 31,537 bytes.",
    "docs/control/doc-ceilings.json sets consolidation's landing size and ceil(size * 1.02); the former roadmap ceiling was 98,323 bytes.",
    "WO-087 criterion 1 requires the lower ceiling; the standard-pass planning document section 5 selects inflow control together with the removal."
  ],
  "rationale": "Keep the existing ceiling policy at the smaller current document size, rather than preserve spare space for the removed candidate material.",
  "rejected": [
    { "option": "Retain the former 98,323-byte ceiling", "reason": "Leaves headroom for almost all removed candidate policy and fails the order's consolidation duty." },
    { "option": "Change the generated-block exemption or other products' ceilings", "reason": "No such change is required or authorized by this relocation." }
  ],
  "reopenWhen": "An authorized later consolidation changes the measured size, or a resolving planning decision authorizes a ceiling increase."
}
```

## WO-087-D002

```json
{
  "id": "WO-087-D002",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep the one-time scratch-script relocation and decline an experiment building reusable migration tooling.",
  "question": "Would reusable relocation tooling repay its preparation cost compared with a one-time scripted move and exact content comparison?",
  "alternatives": ["Build and benchmark a reusable migration tool.", "Use a one-time scratch script with exact section and link comparisons."],
  "observation": "The authority selects one fixed interval in one document; no recurring migration workload or comparable timing baseline is supplied.",
  "budget": { "wallSeconds": 60 },
  "execution": "declined",
  "reason": "A reusable tool adds maintenance and benchmark work without observed recurring use; the current method directly proves this order's preservation obligation.",
  "cost": { "wallSeconds": 0, "tokens": null, "commands": ["No experiment commands run (declined before preparation)."], "source": "Experiment execution cost only: no experiment was launched. Preread and decision-recording cost are part of the session and not separately measured." },
  "effect": { "wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["No comparative benchmark run."], "summary": "No efficiency gain claimed; keep the current method." },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": { "lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null },
  "evidence": ["WO-087 names one fixed candidate interval; existing docs-check and publication scripts already validate links, bytes and coverage."],
  "rejected": [{ "option": "Reusable migration tool experiment", "reason": "No evidence of recurring use to offset added preparation and maintenance." }],
  "reopenWhen": "A later authorized migration supplies repeated comparable moves or demonstrates that one-time relocation scripts cause recurring errors."
}
```

## WO-087-D005

```json
{
  "id": "WO-087-D005",
  "date": "2026-09-30",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.56.3, the next patch above the observed release baseline v0.56.2, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.56.2 (local tags)",
    "patch classification declared in docs/work-orders/WO-087-roadmap-split.md"
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

## WO-087-D006

```json
{
  "id": "WO-087-D006",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "The scratch preservation probe first equated unfiltered repository linkFailures with new document failures. It also used Node's default child-output buffer for the 1 MB-plus retained register, and one read command left a nonexistent shell glob unquoted.",
  "meant": "Judge the moved navigation and any new canonical document failures while retaining declared historical evidence. Scratch reads need enough output buffer and literal program patterns must be quoted. A structured correction also explicitly requires misread, meant and changed fields.",
  "changed": "The scratch probe now checks direct moved-surface links and the canonical baseline-aware docs check, its Git buffer is 8 MB, and the nonexistent glob was removed. Added these missing meant and changed fields after the first document gate refused this correction record; refresh the resulting stale indexes before rerunning.",
  "decision": "Use the canonical docs check's declared historical-link baseline for repository-wide failures and separately require zero raw failures on the moved navigation surfaces. Raise only the scratch Git-read buffer to 8 MB and remove the nonexistent glob from the read query.",
  "evidence": [
    "scripts/docs-check.mjs consumes baseline.links by file, href, reason and occurrence count; its run reported 412 declared historical link occurrences and zero failures.",
    "The scratch script's first Git read failed with ENOBUFS; after its 8 MB buffer correction, text and history comparisons passed before the overly broad raw-link assertion failed on the 412 historical occurrences.",
    "The corrected probe reports zero raw link failures on all ten relocated or updated navigation surfaces and zero canonical document failures; move-check.json records both and the historical count.",
    "zsh rejected an unquoted scripts/test-format* pattern that matched no file; the format gate's actual mapping is scripts/test-runner.mjs to npm run format:check, and .prettierignore excludes authored Markdown and data."
  ],
  "rationale": "A repository-wide historical exception is not a new break caused by this move. The canonical baseline remains untouched, while a stricter direct check proves the changed navigation itself. These are scratch/read corrections, not product changes or a passing claim for the required gates.",
  "rejected": [
    { "option": "Rewrite the 412 historical links or their baseline", "reason": "The existing policy explicitly retains them; no changed navigation failure requires that unrelated expansion." },
    { "option": "Report zero total historical broken links", "reason": "The raw observation is 412; only new canonical failures and the moved surfaces are zero." }
  ],
  "reopenWhen": "A moved surface has a raw link failure, the canonical gate finds a new occurrence, or a historical exception's repair is separately authorized."
}
```

## WO-087-D007

```json
{
  "id": "WO-087-D007",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Preserve FUP-0077's duplicate and FUP-0100's deferred dispositions after their sources gain a link-only revision, using the two revision-bound requests in link-only-requests.json.",
  "evidence": [
    "The only new source bytes for these rows are the bounded-system-baseline link destination changing from product 06 to the planning map; their wording and purpose remain unchanged.",
    "Both prior reopening conditions and targets are copied exactly; FUP-0077 still targets FUP-0106, whose duplicate now resolves to the moved baseline candidate.",
    "move-check.json proves every old register revision and disposition prefix is retained, 771 total rows become 778 and pending rows remain 191. All effective status counts remain the same except duplicate 33 becomes 40."
  ],
  "rationale": "Do not send unchanged work back to planning merely because its navigation address was repaired.",
  "rejected": [
    { "option": "Leave the two rows needs-review after link-only changes", "reason": "Their existing disposition still applies to byte-identical prose and would add artificial pending work." },
    { "option": "Erase the old source revision", "reason": "The register is append-only history; the supported requests record the observed new revision." }
  ],
  "reopenWhen": "Either candidate's substance changes or its recorded reopening condition occurs."
}
```

## WO-087-D008

```json
{
  "id": "WO-087-D008",
  "date": "2026-09-30",
  "dispatch": "resume: next; scope expand: repair failing planning checks",
  "decision": "Under the operator's explicit direction to fix the failing tests during this execution, amend WO-087 to repair planning continuation for a strictly proved location-only vision link relocation. Change scripts/lib/plan-continuation.mjs and add passing/refusal fixtures in scripts/test-plan-refutation.mjs; run npm test -- --review and npm run test:docs, preserve receipt bytes and record the admitted continuation.",
  "operatorAuthorization": "On 2026-09-30 UTC the operator rejected leaving failing tests unresolved and directed the executor to fix them as part of this work after being told the planning checks failed.",
  "evidence": [
    "The read-only audit compares receipt 034 at b174598 with HEAD c57fd557: no fixed input differs. In the workspace only vision:what-dotln-is-not differs; product 00 is otherwise byte-identical after reversing its one bounded-system-baseline href change.",
    "The referenced bounded baseline section is byte-identical in the original roadmap and current map: 3,364 UTF-8 bytes including its heading and separator. The same slug is absent from the new map at the judged revision and absent from the current roadmap.",
    "The earlier test-runner inherited label did not establish cause: WO-172 records passing planning and document checks, and the exact observed difference is introduced by this order's inbound-link repair.",
    "The first product run was stopped with the canonical evidence --stop command after 259.1 s before changing its inputs; no passing check was recorded."
  ],
  "rationale": "The operator requires green checks and authorizes the bounded repair. This improves the meaning-preserving move rather than waiving its evidence. Prove both unchanged vision wording and unchanged relocated target content; never ignore URLs globally or rewrite the independent receipt.",
  "goalAlignment": "Policy resistance and rule beating require the continuation gate to distinguish preserved meaning from changed meaning. Commons, escalation and shifting the burden favor one bounded fixture-backed repair over a new full-horizon planning judgment for a link move. Drift and seeking the wrong goal retain rejection of actual planning changes. Success to the successful does not justify the existing overly strict address check. Naive Interventionism preserves historical receipts and exact hashes and reports an execution update; NoOp leaves this authorized move with failing gates.",
  "rejected": [
    { "option": "Leave the planning failures inherited", "reason": "Exact input comparison disproves that causal claim, and the operator explicitly directs fixing the tests." },
    { "option": "Ignore link destinations when comparing planning inputs", "reason": "A changed target could change planning meaning; location and exact target-section content must be proven." },
    { "option": "Rewrite the receipt or assert a fresh planning pass", "reason": "The independent historical judgment must stay immutable; this is an execution continuation with explicit proof, not new planning judgment." }
  ],
  "reopenWhen": "A regression admits changed planning or target content, the proof misses an ambiguous/private destination, or a future relocation has different supported semantics."
}
```

## WO-087-D009

```json
{
  "id": "WO-087-D009",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "I reported the failing planning check as pre-existing based on the test runner's inherited label, without first comparing the reviewed planning inputs with the base and working tree. I also used immutability language that could imply product documents cannot be edited or that equal byte counts prove content preservation.",
  "meant": "Determine the cause from exact inputs. Product documents remain editable; the continuation check binds selected reviewed content, while filed review records retain their historical bytes. Preservation compares the full content, not just its size.",
  "changed": "The read-only audit established that the reviewed fixed inputs match HEAD and the vision href change introduced here causes the workspace mismatch. The full capability prefix also changes only by its relocated citation. I corrected the causal claim in conversation and implemented the operator-authorized proof-backed continuation repair instead of carrying a claimed inherited failure.",
  "decision": "Treat this order's changed citations as the observed cause and require a proved content-preserving relocation before admitting them. Keep roadmap byte counts only as size evidence and preserve filed review records independently.",
  "evidence": [
    "Receipt 034's judged revision b17459819dd59f929323dfcbd6bed5a57b353498 and HEAD c57fd557a4f6617fa64cffc1bfd491140cb082d6 have identical fixed planning inputs.",
    "Reversing the product 00 bounded-baseline destination restores its exact original content; reversing the capability-table policy destination restores its original prefix while retaining the previously permitted WO-117 dated addition.",
    "move-check.json records complete section and concatenated-content equality after precisely reversing the two necessary nested link rebasings, separately from line and byte counts."
  ],
  "rejected": [{ "option": "Trust the inherited label as a diagnosis", "reason": "It does not compare the specific changed inputs or establish the failure's cause." }],
  "reopenWhen": "New exact input evidence contradicts this diagnosis or any report conflates source size with full-content preservation."
}
```

## WO-087-D010

```json
{
  "id": "WO-087-D010",
  "date": "2026-09-30",
  "dispatch": "resume: next; authorized planning-check repair",
  "operatorAuthorization": "The operator's 2026-09-30 direction recorded in WO-087-D008 requires fixing these failing tests during this execution. This final specification uses the same two implementation/test paths and does not authorize a new planning pass.",
  "decision": "Finish the citation-relocation repair for both the vision source and capability-table prefix. Restore only ordinary inline citation destinations to recover exact reviewed prose. Prove each referenced section moved from product to public planning with the same slug, full preserved content and equivalent resolved relative link targets. Parse headings with the existing pinned Markdown parser, retain the next rung's formatting directive, and reject ambiguous or preexisting targets, copies, private/symlink destinations, fragment-only links and unsupported relative title/reference/image/HTML links. Keep dated capability reassessment validation and historical receipt hashes unchanged.",
  "evidence": [
    "The actual two citations are product 00's bounded-system-baseline link and capability-table's capability-progression-policies link. The second target contains the baseline and its following candidate sections, one necessary nested product link rebase, and the retained next-rung directive at its original boundary.",
    "The grouped independent read-only review found false-admit risks in confusing missing/ambiguous sections, fragment-only and unsupported contextual links, and regex heading boundaries around longer fences. The final helper refuses unsupported forms and uses real Markdown headings; regression fixtures cover each risk.",
    "The focused fixtures cover dirty and committed moves with unchanged receipts, pure citation changes with no new reassessment, prior permitted dated additions, changed prose/labels/targets, missing/duplicate anchors, copies, private and symlink destinations, changed sequence/roles/history, code examples, retained comments and four-backtick fence content.",
    "The --review runner selects the complete plan-refutation fixtures because both changed files are declared machinery inputs; test:docs selects both current planning checks. No registration or dependency change is required."
  ],
  "rationale": "The exact-content proof admits this address change while retaining rejection of changed planning meaning. This is the completed bounded repair described by D008, with the capability citation and independent review's conservative limits made explicit. Goal comparisons and alternatives remain those in D008; extra guards prevent rule beating and drift without creating another product feature.",
  "rejected": [
    { "option": "Ignore all URLs or accept equal content sizes", "reason": "Different targets or different words can have the same size; neither proves preserved meaning." },
    { "option": "Normalize every possible Markdown/HTML link form", "reason": "The actual moved targets need ordinary inline links only; refusing unsupported contexts keeps this repair bounded." },
    { "option": "Edit immutable receipts or request another full planning session", "reason": "The operator-authorized move can be proven against the existing reviewed source without changing its historical judgment." }
  ],
  "reopenWhen": "Full gates fail, a fixture demonstrates a false admit, or a later relocation needs unsupported syntax or different target semantics."
}
```

## WO-087-D011

```json
{
  "id": "WO-087-D011",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Defer the broader planning prompt/source-boundary blind spot to a named planning follow-up. This order repairs the encountered citation checks; it does not change what the independent planning worker receives or add a new planning rehearsal policy.",
  "evidence": [
    "scripts/lib/plan-subject.mjs buildPlanSubject hashes the full What DotLn is not section but exposes only its exclusion bullets to standard.exclusions, omitting the baseline footer link. Capability standard/input rows contain IDs and levels, omitting the introduction; reassessments later constrains the full historical source prefix when row inputs change.",
    "packages/skeleton/src/plan-refutation-protocol.ts planPrompt supplies the projected standard and orders, not those omitted source passages. scripts/lib/plan-direct.mjs prepares that canonical prompt.",
    "The selected WO-087 planning records checked by the read-only audit concentrated on the moved heading range, row reconciliation and ceiling; their passing document gate preceded the actual move. This establishes a specific missing dependency review, not a claim about every prior session."
  ],
  "rationale": "Answer the operator's planning question with checked cause and preserve the concrete wider fix for planning. Revising independent worker context and planning policy requires a separate bounded design; adding it here would enlarge a text relocation and its failing-check repair.",
  "rejected": [{ "option": "Revise canonical planning prompts and rehearsal policy in WO-087", "reason": "Those product/workflow changes exceed the authorized two-file check repair and need their own reviewed scope." }],
  "followup": "Planning: reconcile canonical worker context with continuation source dependencies. Cause: the full What DotLn is not section is hashed while only its bullets are sent to the worker; capability rows omit introductory links but dated reassessment validation freezes the historical source prefix. Fix: expose or explicitly inventory those omitted dependencies and require affected-source review before relocation orders are cut, choosing a bounded representation without changing historic receipt hashes. Paths: scripts/lib/plan-subject.mjs, scripts/lib/plan-direct.mjs, packages/skeleton/src/plan-refutation-protocol.ts, scripts/test-plan-refutation.mjs and the planning role instructions. Checks: reproduce WO-087's hidden footer/intro dependencies in a prompt fixture, then npm test -- --review and test:docs. Priority: normal, in the next planning review of continuation inputs.",
  "reopenWhen": "The named planning follow-up is selected, another continuation dependency is hidden from its reviewer, or the operator directs a separate planning session."
}
```

## WO-087-D012

```json
{
  "id": "WO-087-D012",
  "date": "2026-09-30",
  "dispatch": "resume: next; executor handoff",
  "decision": "Accept the completed documentation move and the operator-authorized citation-check repair on passing executable evidence. Preserve the existing repository metadata slug model, refuse unsupported context-dependent links, and hand off all four criteria as met for independent verification.",
  "evidence": [
    "final-move-check.json repeats full-content and outside-range equality, twelve exact slugs, all 771 original register history prefixes, seven carried dispositions, zero moved-surface broken links and zero new document failures. Relocation totals are 778/191; the one separate D011 planning follow-up produces final totals 779/192.",
    "The same one read-only agent reviewed the planning cause, implementation and final evidence; no descendants were used. Its final implementation review found no remaining material WO-087 defect after the reference/footnote, HTML comment-wrapper, query and fenced-content guards were added.",
    "An early review run was stopped canonically after 82.95 seconds when the independent review found an HTML-node comment-wrapper counterexample and footnote context gap; no passing row was recorded. The source was repaired and all three grouped fixtures passed before restarting the full run.",
    "npm test -- --review recorded exit 0 at 2026-09-30T00:55:24.056Z, with 31 passing suites, 75 fresh tasks and 376,615 ms. npm run test:docs recorded exit 0 at 2026-09-30T00:56:36.771Z, with 23 passing suites and 16,814 ms. gate-checks.json projects both canonical rows at unchanged code identity aa0c11ebec1f7a23acf17afdc3fe716228c803e63b9490734459c86fc7758409.",
    "git diff --check passes, and the diff names no changed filed planning receipt, verification or historical final-review report. No dependency or runtime package changed."
  ],
  "rationale": "The selected candidate home, reduced roadmap, retained history and working navigation satisfy the original goal. The bounded repair passes the complete machinery and current planning checks without rewriting the historical independent judgment. The wider prompt dependency issue has a concrete separate planning identity.",
  "rejected": [{ "option": "Claim completion from the move's size or focused fixtures alone", "reason": "The order requires exact preservation and complete product/document evidence; both complete runs now pass." }],
  "reopenWhen": "Independent verification finds an acceptance mismatch, a supported relocation changes meaning, or a separately selected planning item changes the canonical slug or continuation contract."
}
```

## WO-087-D013 — final review passes; one register row the move discharged is settled

```json
{
  "id": "WO-087-D013",
  "date": "2026-09-30",
  "dispatch": "resume: final review",
  "decision": "Pass WO-087 on all four criteria against the original order and its bound 2026-09-30 amendment (D008, D010). Settle FUP-07d0d6b377e55321, whose reopening condition occurred and whose concern the move discharged. Leave every other row the touching list matched as it is. No defect is boarded: the review reproduced none.",
  "evidence": [
    "An independent scratch probe over base c57fd557 reproduces the range: lines 299-1162 (864 lines), ending in the v0.0.0 rung's prettier-ignore directive. The current roadmap equals the base with lines 299-1161 removed, 1,613 to 750 lines. The 863 moved lines appear at map lines 2555-3417, and exactly two differ, each only by a rebased href to the same file and anchor (13-uifa-roles.md#uifa-showrunner, 03-architecture.md#candidate--resource-pressure-as-an-environmental-modifier). Outside the insertion and its eight-line introduction, the map differs from base only in line 758's inbound link. All twelve slugs occur once in the map and nowhere in the roadmap.",
    "An independent register probe with the unchanged followupStatus reads 771 rows (191 pending) at base and 779 (192 pending) before this review's disposition. All 771 old rows keep every revision and disposition as an exact prefix. The seven moved rows are duplicates of targets with an equal title, summary, status and reopening condition: five deferred, two settled. The one added pending row is D011's FUP-dc58e92c5cafc732.",
    "npm run publication:check passes: 253/253 headings indexed and both editions CURRENT. node scripts/docs-check.mjs reports 0 failures, and product 06 counts 39,975 non-exempt bytes under its 40,775 ceiling. npm run plan -- check exits 0 and reports two relocated-planning-link updates. npm test -- --review reused the verifier's fresh passing row at the unchanged code identity aa0c11ebec1f7a23acf17afdc3fe716228c803e63b9490734459c86fc7758409. git diff --check is clean. package.json, package-lock.json and packages/ are unchanged.",
    "The review read the full diff of scripts/lib/plan-continuation.mjs. Vision inputs return to their judged values only after restoring the proved link destinations reproduces the whole judged product 00 byte for byte. Capability sources keep the existing prefix validation. Every parse, read and resolution failure inside the proof returns null, so the check refuses. The docs/planning root has no ignored paths, so the public planning root is the whole planning directory.",
    "FUP-07d0d6b377e55321 (untriaged, from the 2026-09-28 ideation returns) asked where the roadmap's capability progression policies and counterfactual profiling material should live, and reopened when WO-087 was amended or sequenced. Both sections moved to the planning map in this change, the destination the 2026-09-25 standard pass chose (section 5, range sized in section 14). The item was settled through docs/evidence/WO-087/final-review-followup-request.json."
  ],
  "rationale": "The subject meets the order's objective with the preservation proved in full, not sampled. The operator-authorized check repair admits only a proved address change and still refuses changed meaning. Settling a discharged row keeps the pending feed accurate. Every other match is textual, or is a candidate row this order carried across on purpose.",
  "goalAlignment": "Seeking the wrong goal and drift: the outcome is a roadmap that reads as the release ladder, with every candidate and its history intact. A smaller byte count alone would not show that. Rule beating: the review reran the move, register and check-admission evidence with its own probes rather than relying on the executor's instruments. Policy resistance: the relocation proof and the continuation's refusal of changed planning meaning coexist; the verifier's nine mutations and the fixtures refuse each changed case. Commons and escalation: no new tool, document or gate; one register disposition. Shifting the burden: later relocations of cited sections no longer need a fresh planning session when only the address changes. Success to the successful: the declined alternatives (a new product document, a full planning refutation) were compared on evidence, not on investment. Naive Interventionism: the ladder, generated history, historical reports and receipts are unchanged. NoOp (failing or holding the review) leaves 864 lines of candidate policy in the roadmap and a met order unrouted.",
  "rejected": [
    { "option": "Relabel the capability table's '[roadmap]' link text to name the planning map", "reason": "Receipt 034 binds that source prefix, and the bound continuation refuses a changed label by design. The link resolves to the moved section, and the sentence still records where the table was first described. A wording change belongs to a planning pass over the capability table." },
    { "option": "Leave FUP-07d0d6b377e55321 untriaged for the next planning pass", "reason": "Its condition occurred and the change resolved its question; leaving it pending would send planning a resolved item." },
    { "option": "Re-dispose FUP-50a41e39f51a3e01 with this order as another goal-standard edit", "reason": "The row is already open for planning. This order needed only a proved address change, not an edit to the standard's wording, so the row's seam is unchanged. The report records the observation." }
  ],
  "reopenWhen": "A later verification or review finds a moved section, slug or register history that differs from its base beyond the two recorded link rebasings, or a relocation the continuation admits that changes cited planning meaning."
}
```
