# WO-090 FINAL-001 — final review of the shorter cold start

**Verdict: pass.** All four acceptance criteria hold at the reviewed subject, judged against the order exactly as written. The verification sequence is VER-001 (fail, one finding) and VER-002 (pass); I judged both, and I reproduced criterion 1's measurement from the instrument and the activation bytes rather than from any recorded file. No finding routes to repair. Five defects I met inside this order's own evidence README — three decision links that resolve nowhere and two figures the repair superseded — are fixed here and recorded as [WO-090-D007](../../evidence/WO-090/decisions.md#wo-090-d007--repair-this-orders-unresolved-decision-anchors-nominate-the-repo-wide-anchor-check-separately), whose follow-up nominates the missing anchor check and the 41 unresolved links already sitting in closed reports.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"unknown","source":"operator-attested"}

Actor: Claude Code, `claude --version` on the operator's PATH reports `2.1.278 (Claude Code)`. The model is `claude-opus-5[1m]`, this session's declared identity, the same line VER-001 and VER-002 ran. Effort is `unknown`: this harness exposes no effective-effort readback and nobody supplied a value for this dispatch, so the order's `reviewer any` recommendation is recorded as a recommendation, not as an observation. Dispatch: `resume: final review`, recorded by the harness as `npm run resume -- final-review`; I did not repeat it, and read the projected briefing instead. Fan-out plan, stated before any spawn and unchanged at handoff: zero subagents against the cap of 20 in `docs/control/budgets.json`, because the subject is three documents, one evidence directory and two reports in one worktree, and splitting that across agents would cost more context than it saves. Usage reports 0 admissions, `countKind: exact-observed`, 20 remaining; the unobserved remainder is unknown.

**Process cost:** entry 82694 tokens; handoff 5524937 tokens; source claude-transcript-message-usage

Both readings are `scope: dispatch` from `node scripts/harness.mjs usage 02e0caaf-1da0-4a59-b724-41e693fac0a0`; entry at 2026-09-20T17:20:59.474Z, handoff at 2026-09-20T17:30:43.243Z, which is this report's counter cutoff, taken before the report was written and before the result transition, so both remain uncounted. Dollars and reasoning-output tokens are unavailable from this counter and are therefore unknown, not zero. Cached input is 5,331,749 of the handoff total, most of it accumulated across the 256-second gate wait.

## Subject, integration and evidence boundary

Reviewed the original [work order](../../work-orders/WO-090-shorter-cold-start.md); the complete verification sequence, [VER-001](../../verifications/WO-090/VER-001.md) and [VER-002](../../verifications/WO-090/VER-002.md); the executor's [evidence README](../../evidence/WO-090/README.md), [decisions](../../evidence/WO-090/decisions.md) D001 to D006, [repair-001](../../evidence/WO-090/repair-001.md) and the six measurement records; and the ideation receipt the repair filed, [2026-09-20-planning-1a0fb634704921a3-021](../../planning/refutations/2026-09-20-planning-1a0fb634704921a3-021.md).

Subject: branch `wo-090` at HEAD `03e6f9e9` plus the uncommitted working tree. `main`, the merge base and the activation base are all `f24b5d72`, so there was nothing to integrate and no check to retime. The diff above that base is 16 tracked files, 9,830 insertions and 472 deletions, of which 9,699 insertions are the committed planning refutation receipt pair and the refreshed planning cost table; plus the untracked evidence, verification, final-review and control-segment paths. No package, script, test, hook, generated skill or fixture changed — I confirmed that from the diff's own file list, not from the README's claim.

Three local commits sit between the base and HEAD (`8454883d`, `247e4c6c`, `03e6f9e9`). The executor attests explicit operator authorization for that exception in [D006](../../evidence/WO-090/decisions.md#wo-090-d006--operator-authorized-local-commits-refresh-the-planning-judgment), and VER-002 recorded that it can observe the authorization only as that attestation. I am in the same position: I integrate those commits as the reviewed state, and I record that their authorization rests on the executor's attestation rather than on an utterance either of us observed. Their content is the goal-card edit, the decision records, the refreshed cost table and the planning receipt — no source, and nothing that changes an acceptance criterion.

## What I reproduced independently

I called `measureHarnessContext()` from the unchanged `scripts/harness-context.mjs` twice from session scratch: once against the current tree, and once with every changed tracked file that exists at `f24b5d72` overridden to its base bytes through the function's own `overrides` map. Sixteen tracked files changed; thirteen exist at the base and were overridden; the three added since are directed inputs of no role.

| Role | Activation (bytes / lines) | Reviewed | Delta | Strictly lower |
| --- | --- | --- | --- | --- |
| executor | 32,855 / 300 | 32,603 / 299 | −252 / −1 | yes |
| verifier | 30,762 / 295 | 30,510 / 294 | −252 / −1 | yes |
| reviewer | 36,666 / 373 | 36,414 / 372 | −252 / −1 | yes |
| release-close | 22,504 / 239 | 22,252 / 238 | −252 / −1 | yes |

Eight profiles, four roles in each of the two skill roots, every one strictly lower in bytes and in lines. My live run is deep-equal to the recorded [harness-context-repair.json](../../evidence/WO-090/harness-context-repair.json) and my reconstructed activation side is deep-equal to the recorded [harness-context-before.json](../../evidence/WO-090/harness-context-before.json), so both recorded records are confirmed rather than assumed, and my run agrees with VER-002's to the byte. I also re-ran the measurement after my own edits to this order's evidence: still deep-equal, because nothing I touched is a directed input.

I re-ran `measureColdStarts` from `scripts/lib/process-budget.mjs`: all twelve profiles are deep-equal to both the activation record and [cold-start-repair.json](../../evidence/WO-090/cold-start-repair.json); no row rose; ten report `within` and two refuter rows report `unset`, because `docs/control/budgets.json` sets no refuter ceiling — the wording VER-001 asked for and the repair corrected.

I dumped the union of directed input paths for all eight profiles in both directions: identical lists, and neither `docs/AI-HARNESS-SECURITY.md` nor `docs/PLAYBOOK.md` appears in any of them, before or after. Exactly one changed file, `docs/product/07-execution-guide.md`, is a directed input at all, and only as its `#Goal-aligned decisions` subtree.

I resolved every relative link the change adds across the guide, the security document, the playbook and this order's evidence — 32 links, each against its target file's real heading slugs. All resolve now; the three that did not are the corrections below. I checked the two anchors a reader is most likely to follow by hand: `#harness-version-model-and-effort-readback` (security document line 309) and `#selected-session-readback-completion-and-counters` (line 843), and the `#copilot-control-table` target the relocated Copilot paragraph now points at (line 816).

## Acceptance results

| Criterion | Judgment |
| --- | --- |
| 1 — directed total lower for every role; nothing relocated newly directed; no cold-start byte rises | **Met, all three clauses, reproduced above.** Clause 1: eight of eight profiles strictly lower, −252 bytes and −1 line each. I did not rest this on the method's frozen legacy `lower` flag, which was already true at `f24b5d72` and would be satisfied by the empty change. Clause 2: the directed path lists are identical and both relocation destinations are absent from every set. Clause 3: all twelve cold-start profiles are byte-identical to the activation record. |
| 2 — the relocation table accounts for every removed paragraph | **Met.** The guide has three removed regions and the table has eleven rows. I read each removed region at `f24b5d72` against its named home: the step-2 sandbox paragraph's seven rules are in the playbook §Harness safety baseline, which now carries `briefing` in its read-only list and names itself the rule's home; the §Model-specific notes paragraphs arrive in the security document's two new sections with their relative links correctly rebased from `../` to the `docs/` level; the WO-028 control-time sentences the playbook lacked are in its §Resume command surface; row 10 stayed in the guide with "lives here" reworded to "lives in this repository". For row 11, the repair's retirement, I checked the equipping claim at the files rather than in prose: `Goal Alignment:` and `Process Cost:` each occur once in all six role skills in both roots, and the unique clauses — evidence of benefit, intervention risk, the verification/handoff comparison, and the legal/release-authority and NoOp limits — are retained verbatim in the guide immediately after the unchanged NoOp paragraph. No rule lost a home, so the non-goal and operator-review assumption 1 both hold. |
| 3 — write-backs land; publication locks | **Met.** 07 §Read order carries the homes paragraph and the measured fact, including that the harness-observation moves alone left the totals unchanged and that real orders add their own cited sections. The security document's two new sections and the playbook's two edits exist at the lines above and hold the relocated text. The ledger duty is substituted under the pre-2026-09-09 rule: seven `WO-090-D00*` rows are in the decisions index and the work-order index marks the substitution. `npm run publication:check`: PASS, 272 of 272 headings, both editions CURRENT. Release write-backs carry `v0.35.1` in the order heading, `README.md` and the roadmap's release-boundary note. |
| 4 — `npm test` green; `git diff --check` clean | **Met, re-run by me.** `npm test -- --review`: **21 passed, 0 failed, 255.55 s, 65 fresh tasks**, external `/usr/bin/time -p real` 255.93 s, run outside the harness sandbox after my last edit. `git diff --check` and `git diff --cached --check`: clean, exit 0. |

## The verification sequence

VER-001 failed the order on one finding: the directed totals were equal, not lower, because the relocated sections were never in any role's directed set. That measurement was right, and I reproduced it — my reconstructed activation side matches VER-001's table to the byte. Its second-order conclusion, that no implementation respecting the order could lower any total, was too broad, and the repaired subject falsifies it: the order's objective expressly includes retiring a paragraph a generated skill already carries, and the goal card's **All phases** introduction was exactly that. The executor recorded the correction as [D005](../../evidence/WO-090/decisions.md#wo-090-d005--retire-the-duplicated-goal-alignment-procedure-and-preserve-its-unique-limits), reopening D001 the same day, and VER-002 agreed against its own evidence. I agree with all of it, and I record that the fail verdict was the right call on the subject it judged: a pass on equal totals, or on the vacuous frozen-flag reading, would have let a falsified planning premise close inside a passed order.

Both verifiers disclosed that their instrument is part of their subject — `scripts/harness-context.mjs` is both criterion 1's named method and the measuring tool, and the usage counters behind their cost lines are the WO-126 channel the relocated text describes. Both responded by rebuilding the activation side from base bytes rather than trusting the recorded JSON. That is the right response and I did the same, including re-running the measurement after my own edits.

VER-002's limits stand and I judge them here rather than repeating them. The magnitude limit is the substantive one and I carry it into the release text below. The split presentation of the evidence README is improved but not removed by my corrections: its criterion-1 section still states the superseded "not met" account, correctly scoped by the opening paragraph to the subject VER-001 judged, and I left that historical account intact rather than rewriting a record of what was measured. The lost enumeration of the six equipped roles is real: the retired sentence named executor/fixer, verifier, reviewer, planner, refuter and release-close, and the pointer now says only "the generated role skills". I verified the fact holds in all twelve skill files, so no rule lost a home, but a reader of the guide alone can no longer see the list.

## Corrections I made in this review

Five defects inside `docs/evidence/WO-090/README.md`, all fixed, all recorded in D007 with their evidence:

- `[D001]`, `[D003]` and `[D004]` used short-form anchors such as `decisions.md#wo-090-d004`. Those headings carry titles after an em dash, so the rendered slug is `wo-090-d004--assign-application-…`, and the short form resolves nowhere. Repaired to the full slugs and re-resolved.
- The software-engineer edition's source lock was recorded as `841fa17c…`. The repair's goal-card edit moved it again; the file now carries `c0d4e920…`. The README records both steps.
- The guide's size was recorded as 1,932 lines and 141,127 bytes. That was the post-relocation figure; the reviewed subject is 1,933 lines and 141,047 bytes. Both are now stated with what each describes.

I did not touch the 41 unresolved decision anchors already in closed orders' evidence, verification and final-review reports — concentrated in WO-056, WO-140 and WO-139 — because those reports are immutable records of their own subjects. The generated decisions index emits correct slugs, so the gap is a missing check over hand-written links; D007's follow-up names it with paths and cases for planning. That is a nomination, not an authorization.

## Gates run at this review

- `npm test -- --review` — **21 suites passed, 0 failed, 255.55 s, 65 fresh tasks**, run after my last edit and outside the harness sandbox.
- `npm run publication:check` — PASS, 272 of 272 product headings, both editions CURRENT.
- `node scripts/harness.mjs check` — 31 generated surfaces agree.
- `npx prettier --check` on both files I edited — pass.
- `git diff --check` and `git diff --cached --check` — clean.
- `npm run meta` — decisions index and follow-up register refreshed after D007; `npm run work-orders -- index` refreshed after the result.

No source changed in this review, so the gate above is the product gate for this subject and the document changes I made after it are reports, decisions and generated documents, which do not invalidate code identity.

## Limits and disposition

**Magnitude.** Criterion 1 sets no threshold and is met, but the whole measured improvement is 252 bytes and one line per role — 0.7% to 1.1% of these totals — and all of it comes from the one retired paragraph. The order's headline work, relocating §Model-specific notes and the sandbox paragraph, contributes exactly zero to the directed totals, because those sections were never directed reads. The guide is 83 lines and 6,245 bytes smaller and its harness observations now have one home each, which is the order's real outcome; the directed-load criterion is met by a different, smaller effect than the Cost line predicted. No latency, token or dollar saving is inferred from bytes anywhere in this order, and none should be.

**Fixture scope.** The measurement's task is the synthetic WO-999 fixture. A real order's cold start also pulls its own Cites block, and WO-090's own citations include §Model-specific notes, so under a self-referential measurement the relocated bytes would leave one cited input and enter two others. The guide's new §Read order paragraph now says this.

**Text-level scope for harness claims.** The relocated Codex and Copilot paragraphs were reviewed as text arriving intact at their named homes. I ran no live Codex or Copilot session and re-probed no harness behavior; those remain the immutable records of WO-126, WO-132 and WO-146.

**Instruments under description.** The subject is documentation about this harness and I used that harness to judge it. That is disclosure, not independent proof of the mechanisms the relocated text describes.

**The ideation receipt is not a verification.** The pass-scoped planning refutation `2026-09-20-planning-1a0fb634704921a3-021` records **aligned-with-findings** with no holds, at committed subject `247e4c6c`, judging one order and the sequence and carrying 93 unchanged verdicts by hash. It did not independently judge WO-090's implementation, and its own two known issues — unproven net recurring savings and the declared cross-session-memory limitation on verifier independence — stand. Nothing in it blocks this review.

**Goal alignment.** Mission and critical path: operator-flow documentation hygiene, not runtime progress; the review's value is a checked outcome rather than a cleared phase. Rule beating was the live trap and is why I rebuilt the activation side myself and refused the frozen `lower` flag — the standard that produced VER-001's fail, applied to a subject that now meets it. Drift: I report the small magnitude beside the met criterion rather than letting a passed clause stand in for the promised benefit. Escalation: this review adds no step, check, hook or receipt; the anchor check is nominated to planning, not built here. Shifting the burden: the five defects I met were inside the bound, so I fixed them instead of handing the operator a list. Naive Interventionism: I changed no product document, no measured input, no closed report and no acceptance criterion, and I re-ran the measurement after editing to prove it. NoOp: refusing this order over 252 bytes would substitute my judgment for the criterion the operator set, and would strand a relocation that gives every harness rule one home.

## Release and handoff

Application **v0.35.1**, a patch above local `v0.35.0`, with compiler `0.17.0`, skeleton `0.31.0`, kernel `0.6.0` and console `0.1.7` unchanged, as [D004](../../evidence/WO-090/decisions.md#wo-090-d004--assign-application-v0351-as-a-patch-above-local-v0350-with-no-component-bump) classified. The order heading, the README release claim and the roadmap's activation-completion note all carry it, and no package source changed. The reviewed PR body and the five-section release notes sit beside this report.

This review authorizes committing the reviewed state, pushing the `wo-090` branch and opening its pull request, and nothing further. Merge, main, tag and Release remain the operator's and release close's.
