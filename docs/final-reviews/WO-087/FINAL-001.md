# WO-087 — FINAL-001

**Verdict:** pass. All four criteria are met against the original order and its bound 2026-09-30 amendment. The review reproduced no defect and boarded none. It settled one register row the move discharged ([D013](../../evidence/WO-087/decisions.md#wo-087-d013--final-review-passes-one-register-row-the-move-discharged-is-settled)).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.285","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 83167 tokens; handoff 7940157 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-087 and allocated this path. The actor values are this session's: Claude Code 2.1.285 (`claude --version`), model `claude-opus-5-5`, and effort `xhigh` read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer. Cost scope is this dispatch. The entry sample was taken at 2026-09-30T01:17:07.876Z. The handoff sample, 2026-09-30T01:26:51.152Z, was taken before this report was filed. These are cumulative transcript counters, mostly cached input (7,731,344 of the handoff total). Reasoning tokens and dollar cost were unavailable.

Fan-out plan: no subagents out of the 20 available. The harness observed 0 admissions, and the root was the only writer.

## Subject, integration and evidence

The subject is the working tree over base `c57fd557a4f6617fa64cffc1bfd491140cb082d6`. At this review, `git ls-remote origin refs/heads/main`, `origin/main` and local `main` all read `c57fd557`, so no integration ran. No order was waiting for this review's integration, and no version collided: tags run to v0.56.2, and the order's target is v0.56.3 (D005).

The numbered verification sequence is complete: [VER-001](../../verifications/WO-087/VER-001.md) passed all four criteria. Its SHA-256 recomputes to the `reportHash` in the control log (`9772474b…093ac`). No source or test byte changed after VER-001's checkpoint: `npm test -- --review` found the verifier's fresh row at the executor's code identity.

No ideation breakout receipt applies. The evidence folder holds no ideation receipt, and the only scope change is the operator's 2026-09-30 direction to repair the failing planning checks. That authorization is recorded in [D008](../../evidence/WO-087/decisions.md#wo-087-d008) and specified in [D010](../../evidence/WO-087/decisions.md#wo-087-d010). Two `PlanExecutionAmended` events in `docs/control/plan-refutations.jsonl` bind the amended order bytes. The amendment names the two changed source paths and adds regression and receipt duties to criterion 4. It changes criterion 4's product gate from `npm test` to `npm test -- --review`, which selected the same 31 suites here.

I reviewed:

- the order, its cited map and register sections, the 2026-09-25 standard-pass §5 and §14, and product 07 §Goal-aligned decisions and §Ideation breakout receipt;
- the executor handoff, evidence README, decisions D001–D012, both move-check files, and the register and link-only request files;
- the full diff of `scripts/lib/plan-continuation.mjs` and its three WO-087 fixture groups in `scripts/test-plan-refutation.mjs`;
- every changed document outside the moved block, the publication index removals and both edition headers.

A clean-room screen of the 3,352 added and evidence lines found no local paths or secret shapes. The only URL is the fixture's `example.invalid` destination.

## Criteria

**Criterion 1:** met.

- **Range.** My own scratch probe reads base `c57fd557`. The interval from `## Work-order navigation and identity (candidate)` to the line before `## v0.0.0` is lines 299–1162, 864 lines, and its last line is the v0.0.0 rung's `<!-- prettier-ignore -->`.
- **Roadmap.** The current roadmap equals the base with lines 299–1161 removed, byte for byte: 1,613 lines become 750. The directive stays with its rung, as the amended design requires.
- **Moved text.** The 863 moved lines sit at map lines 2555–3417, after an eight-line [introduction](../../planning/work-order-map.md#moved-from-the-roadmap-2026-09-30). Exactly two lines differ from the base, and in each the prose is equal and only one href changes, to the same file and anchor. The two targets are `13-uifa-roles.md#uifa-showrunner` and `03-architecture.md#candidate--resource-pressure-as-an-environmental-modifier`, each now under `../product/`. Outside the insertion and introduction, the map differs from the base only in line 758's inbound baseline link.
- **Slugs.** All twelve slugs occur once in the map and nowhere in the current roadmap.
- **Publication.** `npm run publication:check` passes: 253/253 product headings indexed, and both editions CURRENT (29 and 45 linked source sections). The audience index loses exactly the twelve moved rows.
- **Docs check.** `node scripts/docs-check.mjs` reports 0 failures and 412 declared historical link occurrences. Product 06 counts 39,975 non-exempt bytes (31,537 exempt) under its lowered 40,775 ceiling, which was 98,323 ([D004](../../evidence/WO-087/decisions.md#wo-087-d004)).
- **Everyday edition.** Two source pointers that named the roadmap's title now name the moved map sections. They are planning links, so the product lock does not cover them, and the docs check resolves them.

**Criterion 2:** met.

- **Totals.** My register probe uses the unchanged `followupStatus`. Base: 771 rows, 191 pending. Before this review's disposition: 779 rows, 192 pending. Duplicates rise from 33 to 40, untriaged from 33 to 34, and every other status count is unchanged.
- **History.** All 771 old rows keep every revision and disposition as an exact prefix, with no other field changed.
- **Moved rows.** FUP-0105 through FUP-0110 and FUP-1aa2504e33959003 are now `duplicate`, each targeting its map row. Each target's title and summary equal the old row's, and each carries the old status and reopening condition exactly: five deferred, two settled.
- **Link-only rows.** FUP-0077 and FUP-0100 keep their duplicate and deferred dispositions at their link-only revisions ([D007](../../evidence/WO-087/decisions.md#wo-087-d007)).
- **Requests.** `register-requests.json` records the seven duplicate requests and the seven carrying requests.
- **Pending work.** No pending row is lost. The one added pending row is D011's FUP-dc58e92c5cafc732, which is untriaged.

**Criterion 3:** met. `docs/README.md` states the roadmap's scope and links the map section. The order was filed on 2026-09-08, before the 2026-09-09 cutoff, so the decisions file and its decisions-index rows discharge the ledger duty. The work-order index marks that substitution.

**Criterion 4:** met.

- **Product gate.** `npm test -- --review` exited 0 by reusing a complete passing row at the unchanged code identity `aa0c11ebec1f7a23acf17afdc3fe716228c803e63b9490734459c86fc7758409`: 31 suites, 370.31 s, recorded 2026-09-30T01:10:20.808Z by the verifier's fresh run. No suite started.
- **Document gate.** `npm run test:docs` passes (see Executed checks).
- **Whitespace, dependencies and suppressions.** `git diff --check` is clean. `package.json`, `package-lock.json` and `packages/` are unchanged, and the new import is the exactly pinned `prettier` 3.9.6 devDependency. The only added `prettier-ignore` strings are code literals, and no suppression directive was added.
- **Continuation.** `npm run plan -- check` exits 0 and reports two `relocated-planning-link` updates, one for product 00 and one for the capability table. No file under `docs/planning/refutations/` changed. `plan-refutations.jsonl` gains only the two amendment events.
- **Admission.** I read the continuation change in full:
  - Vision inputs return to their judged values only after restoring the proved destinations reproduces the whole judged product 00, byte for byte.
  - The capability source keeps the existing prefix and dated-addition validation on the restored text.
  - A relocation must move from `docs/product/` to `docs/planning/` with the same anchor and the same section content once relative links are resolved. The old heading must be gone from the current source, and the anchor must be absent from the judged destination.
  - Any read, parse or resolution error inside the proof yields no admission.
  - `docs/planning/` has no ignored paths, so the public planning root is the whole directory.
- **Refusals.** The fixtures refuse changed target and vision wording, a changed link label, missing and ambiguous anchors, a copy left behind, external, private and symlinked destinations, changed capability history, sequence and roles, rebased code-block text, rewritten comments, and eighteen context-dependent link forms. VER-001's nine independent mutations were all refused.

## Findings and follow-up dispositions

No finding. Observations the review judged and did not board:

- The capability table's introduction still says it was "described by the [roadmap]", and that link now resolves in the planning map. Receipt 034 binds that prefix, and the continuation refuses a changed label by design, so a relabel belongs to a planning pass over the table. The sentence still records where the table was first described.
- WO-030, a closed order, had one navigation link relabelled from Product 06 to the planning map. Filed reports and historical decision strings are unchanged.
- The docs check reports that the generated release history lacks local tags v0.56.1 and v0.56.2. This is advisory, outside the criteria, and release tooling regenerates the table.

`npm run plan -- followups --touching` listed 18 pending rows. Dispositions:

- FUP-07d0d6b377e55321 is **settled** through [final-review-followup-request.json](../../evidence/WO-087/final-review-followup-request.json). It asked where the roadmap's capability progression policies and counterfactual profiling material should live, and it reopened when WO-087 was amended or sequenced. Both moved to the planning map in this change, the destination the 2026-09-25 pass chose (§5; range sized in §14).
- FUP-50a41e39f51a3e01 stays open for planning. This order changed the bound goal standard's bytes, but only a link address the continuation proves. The row's seam, an executor route for wording edits that need fresh refutation, is untouched.
- The seven map rows this order created or carried, FUP-0100, and D011's FUP-dc58e92c5cafc732 stay as recorded.
- The other eight rows are textual matches on shared files and are left as they were: FUP-71fc2efc208f597a, FUP-b7a66e7a4fa7ad20, FUP-0086, FUP-00af89947ed9099f, FUP-50cda1c03ecd8ea8, FUP-acfe4bfda716d8fb, FUP-fd05316b6030ef73 and FUP-f287a595299249ff. FUP-cd1a227413938345, the broader product-ownership item, also stays untriaged for planning; this order is only one step on its route.

## Executed checks

- Final product row: `npm test -- --review`, executed true, exit 0, reused as recorded above.
- `npm run test:docs`: 23 passed, 0 failed, 15.54 s, 23 fresh tasks, run after this report existed. Its first run in this review failed only in `release-surfaces`, and the eight suites that depend on it did not run. The cause was my release notes: a `<slug>` placeholder that the body profile rejects as raw HTML. I reworded that one sentence and the rerun passed. Completion runs the gate again inline.
- Also passing: `npm run publication:check`, `node scripts/docs-check.mjs`, `npm run plan -- check`, `git diff --check`, and my move and register probes in the session scratch.

## Judgment and publication

[D013](../../evidence/WO-087/decisions.md#wo-087-d013--final-review-passes-one-register-row-the-move-discharged-is-settled) compares this outcome with the mission, all eight system traps, Naive Interventionism and NoOp.

The observed outcome:

- The roadmap reads as the release ladder.
- Every moved candidate keeps its words, slug and register history.
- The planning check admits a proved address change without a new planning session, and still refuses changed meaning.

No efficiency gain is claimed. The tradeoff: reusing the verifier's complete row at an unchanged code identity avoided a six-minute rerun, at the cost of not re-executing the suites in this session.

Reviewed PR title: `:truck: Move the roadmap's candidates to the planning map, so the roadmap reads as the release ladder`. The [gitmoji catalog](https://gitmoji.dev/) assigns that shortcode to moving or renaming resources, which is this change's main purpose. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state the upgrade notes and limits. A pass authorizes committing this reviewed state, pushing only `wo-087` and opening its PR. The helper supplies the post-merge release-close handoff.
