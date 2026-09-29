# WO-086 — FINAL-001

**Verdict:** pass. All five criteria are met on the integrated subject. The review found seven low-priority hardening items outside the criteria and boarded them ([D024](../../evidence/WO-086/decisions.md#wo-086-d024--final-review-pass-and-the-hardening-items-it-met)). It also made one non-behavioral correction to the release-history notes' final bytes ([D025](../../evidence/WO-086/decisions.md#wo-086-d025--correction-the-release-history-notes-ended-in-a-blank-line)).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.285","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 82678 tokens; handoff 15139693 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`; the canonical phase selected WO-086 and allocated this path. The actor values are this session's: Claude Code 2.1.285 (`claude --version`), model `claude-opus-5-5`, effort `xhigh` read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer. Cost scope is this dispatch. Entry cutoff: 2026-09-29T19:35:53.384Z. Handoff sample: 2026-09-29T19:51:57.451Z, before this report was filed. These are cumulative transcript counters, mostly cached input (14,851,674 of the handoff total); reasoning tokens and dollar cost were unavailable.

Fan-out plan: two read-only reviewers out of the 20 remaining slots, no descendants, each judging a group of criteria. The task notifications report 141,841 and 167,144 subagent tokens over 508 s and 595 s. The harness observed 3 admissions with one unlinked child against the 2 launches. The third is unidentified, and coverage beyond it is unknown. The root was the only writer.

## Subject, integration and evidence

The original base is `3a68c517668555ae201feb8f1d51ee86c9e9ada0`. The repair's canonical `worktree integrate` (D016's operator scope) fast-forwarded it to fetched main `4d7c3319aed15abc9ae80a2ea3badadfcba5e878`. That kept checkpoint `refs/dotln/checkpoint/WO-086/6` and the named stash `99d94205`. The only authored conflict was product 06, resolved in D017. At this review, `git fetch origin` still reported main, `origin/main` and HEAD at `4d7c3319`, so no second integration ran. I completed [D018](../../evidence/WO-086/decisions.md#wo-086-d018)'s carried-forward claims. VER-002 and VER-003 judged all five criteria again on the integrated bytes, so no criterion is carried across bases. The retime from v0.55.1 to v0.56.1 above v0.56.0 changes only the application label. `packages/`, `package.json` and `package-lock.json` equal main, so no component version collides. The order mints no evidence edition.

The numbered verification sequence is complete and unchanged:

- [VER-001](../../verifications/WO-086/VER-001.md) failed criterion 3 on F1: an ancillary output failure after the retime lost collision provenance.
- [VER-002](../../verifications/WO-086/VER-002.md) confirmed F1's repair (D019). It failed criterion 3 on F2, a failed integration stub after a successful retime, which VER-001 had missed.
- [VER-003](../../verifications/WO-086/VER-003.md) passed all five criteria on the D022 repair, with a negative control.

I recomputed their SHA-256 values, and all three match the `reportHash` values in the control log. Source, test and package bytes are unchanged since VER-003's checkpoint 12. This review changed documents only.

I reviewed:

- the full subject diff against `4d7c3319`, including the new `scripts/lib/release-history.mjs`, the `release prepare` and `list` changes in `scripts/release.mjs`, `scripts/lib/release-preparation.mjs`, `regenerate()` and the stub in `scripts/lib/worktree-integration.mjs`, and `productContent` in `scripts/docs-check.mjs`;
- the order, its cited sections of products 07 and 08, the executor handoff and evidence README, and decisions D001–D023;
- every write-back.

Two read-only reviewers probed the code in temporary repositories outside the worktree, and the worktree's status was unchanged afterwards. The release-history reviewer covered the table and the exemption; the collision reviewer covered the collision path. A clean-room screen of the 5,304 added lines found no URLs, local paths or secret shapes.

## Criteria

**Criterion 1:** met.

- `node scripts/release.mjs list --markdown` equals the committed 06 block byte for byte: 115 recorded tags, v0.2.0 through v0.56.0.
- The docs check reports no failure and no newer tag. v0.56.0 is the newest local and origin tag.
- The release-history reviewer ran `node --test scripts/test-docs-check.mjs` fresh: 29/29. The fixtures compare the table with `release list` over four tags, one with a version-free heading (WO-902). They refuse a changed row, report a newer tag and name a missing recorded tag.
- The pre-integration block still staged in the index when this review began (114 tags, no v0.56.0 row), checked against current tags, gave `failures: []` and `newer: ["v0.56.0"]`: a real sibling tag was reported without refusal.
- Probes refused a receipt inside the block, a changed heading, a reordered or extra-key snapshot, and a remade tag. They ignored lightweight and unrelated annotated tags, escaped marker text in titles, and handled CRLF and BOM.

**Criterion 2:** met. I recomputed the seven ranges from `git show`, each line with its final newline: base `3a68c517` lines 23–690, 702–726, 742–858, 2036, 2077–2086 and 2313–2340, and main `4d7c3319` lines 23–33. All seven hash to the SHA-256 values in D008 and D017. Each occurs once in [the release-history notes](../../planning/release-history-notes.md) and zero times in current 06: 66,778 bytes in all. The receipt states its first and last note dates, 2026-08-31 and 2026-09-29. The recomputation was repeated after D025's correction with the same result.

**Criterion 3:** met.

- The collision reviewer ran `node --test scripts/test-release-preparation.mjs` (12/12) and the eight WO-086 cases of `scripts/test-worktree-integration.mjs` (8/8, 112 s) fresh. The cases cover a retime landing on a continuation, both F1 PR blockers, the three F2 stub regressions (a regular file, a symlink, and a newer tag during a blocked retry), a tag landing after the stub, and the conflicted-record refusal, which names its path and writes nothing. VER-003 ran the normal collision fresh in the complete 33-test preparation and integration run.
- The reviewer's probes and my reading of `regenerate()` confirm the rule. A fresh receipt carries no saved outcome. A saved outcome is filed before preparation runs again. Preparation waits while the stub is blocked. A newer collision gets its own decision.
- Activation assignment writes only the heading, the README claim and its decision. No product document changes, and the README changes only its version claim.
- The reviewer reproduced one edge that loses a record (D024 item 1). It needs a hand-run of `release prepare --local --integration` during a pending integration, after its stub or while a saved outcome waits. The helper never passes the flag in those states, and the criterion names the path through `release prepare` and the integrate helper.

**Criterion 4:** met under the bound D004 amendment.

- 06 holds the pointer and the one registered `dotln-release-history` block. 10 holds its pointer and names "a recorded decision".
- The README diff is the version claim only, `v0.56.0` → `v0.56.1`.
- Product 07's sentence names "the integration decision", and its activation duty names the command (D005).
- `docs/README.md` and the ceiling policy name the one registered block.
- The inherited ledger duty is discharged by the decisions file and index row.
- `npm run publication:check` passes.
- `node scripts/docs-check.mjs` gives: 06 counted 96,395, exempt 31,537, ceiling 98,323 = ceil(96,395 × 1.02), above the base's 91,876 by D004's authorized standing-policy exception; 07 counted 154,878 under 157,212; 10 counted 25,744 under 25,825; zero failures. The base counted 90,074 (VER-001).
- The release-history reviewer's probes confirm that an unregistered pair, the same pair in another file, a quoted, fenced or indented pair, and a demoted, quoted or hidden terminating heading exempt nothing. A receipt next to the markers is still reported.
- Outside the markers, 06's only matches for retiming, collision or activation vocabulary are standing policy and two unrelated uses of "collision". The README and CLAUDE.md contain no "retim".
- Observation: the standing Operator default paragraph still names four applications of the default (WO-028, WO-026, WO-020 and WO-030) as clauses. These are policy text, not activation-completion paragraphs, and D004 leaves them to a consolidation.

**Criterion 5:** met.

- `npm test -- --review` exited 0 by reusing the complete passing row at the current code identity; no suite started. The row: 31 suites, 359.03 s, recorded 2026-09-29T19:19:52.302Z, code identity `db26626332e4b7b6264a3a87c2851db3fdd416aad073bb73a041b26d42471e52`, evidence `host-gate:db26626332e4b7b6264a3a87c2851db3fdd416aad073bb73a041b26d42471e52:npm test`. The identity is unchanged because this review changed no source or test byte.
- `git diff --cached --check` is clean after D025. Before it, staging exposed a blank line at the end of the new receipt, a line inside the last hashed range. The verifiers' checks never saw it because the file was untracked. A closing section now follows the range, and no moved byte changed.
- `package.json` and `package-lock.json` are unchanged, and no suppression directive was added.
- `npm run plan -- check` exits 0.
- `npm run test:docs` passes (below).

## Findings and follow-up dispositions

[D024](../../evidence/WO-086/decisions.md#wo-086-d024--final-review-pass-and-the-hardening-items-it-met) boards seven reproduced hardening items as FUP-b7a66e7a4fa7ad20 (open):

1. The `--integration` misuse edge above.
2. Ordinary `release prepare` writes `decisions.md` through a symlinked evidence directory that points inside the repository.
3. A record keeping only a `<<<<<<<` and a `=======` line passes the conflict test.
4. A directory at `decisions.md` aborts a pass with a bare EISDIR before `run()`; continuation still records one complete decision.
5. Removing the whole generated block passes silently, and nothing is exempted.
6. Deleting an older row together with its snapshot entry passes as "newer", which is the index's own rule.
7. A bodiless annotated tag crashes the newer-tag read, as it already crashes `release list`.

None loses a record on a helper path or falsifies a criterion. A reviewer writes no behavior, so none is fixed here. D006 already covers the other observation: two lanes that both run `--write` would meet the snapshot line as an authored conflict.

Dispositions of the rows this change touched:

- FUP-221c4db9233b3476 (F2), FUP-b7c02d7813506c55 (D019) and FUP-5350f61967cf008f (D022) are settled on VER-003.
- FUP-a6b9c4dc86ac8995 (WO-085 O3) and FUP-040634d583e2c517 (V2, V7) are settled: the heading exemption is retired and the one block is registered.
- FUP-406744f5e9966250 is deferred again. Its first defect is fixed; its stash-apply defect is untouched.
- FUP-fa028783f3f6b17f is deferred again. Its PR-draft member recurred: `PR.md` held only the meter block under a `# WO-086` heading.
- FUP-b86a71ffd5b1e334 is deferred. Its WO-117 part is discharged; WO-172's part remains.
- FUP-38ced82ed597d07b (publication-time assignment) waits for its after-close condition; D024 records item 1 as evidence for that judgment.
- The order's own boards D010 and D013 and the other textual matches are left as they were.

## Executed checks

- Final product row: `npm test -- --review`, executed true, exit 0, reused as recorded above.
- `npm run test:docs`: 23 passed, 0 failed, 13.97 s, 23 fresh tasks, exit 0, run once this report existed. Its first run in this review failed only in docs-check, on three links to this then-missing report, and eight suites that depend on that preflight. Completion runs it again inline.
- Also passing: `npm run publication:check`, `npm run plan -- check`, `node scripts/docs-check.mjs`, `git diff --cached --check`, and the two reviewers' focused runs (29/29, 12/12, 8/8).

## Judgment and publication

[D024](../../evidence/WO-086/decisions.md#wo-086-d024--final-review-pass-and-the-hardening-items-it-met) compares this outcome with the mission, all eight system traps, Naive Interventionism and NoOp.

The observed outcome:

- The roadmap's release history is a table the docs check holds to its tags.
- A collision through the helper writes one complete decision and no prose.
- The retired notes survive byte for byte.

Failing the review over edges that need manual misuse would start a fourth repair cycle with every criterion met. Leaving them as report prose would lose them. No performance saving is claimed. The tradeoff: reusing the complete row at an unchanged code identity saved a full rerun of about six minutes, at the cost of not re-executing the suites under this session.

Reviewed PR title: `:technologist: Generate the release history from tags, so a second lane's version collision leaves no prose to read`. The [gitmoji catalog](https://gitmoji.dev/) assigns that shortcode to developer experience, which is the payoff the operator named: parallel orders cost nothing to read about. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state the upgrade notes and limits. A pass authorizes committing this reviewed state, pushing only `wo-086` and opening its PR. The helper supplies the post-merge release-close handoff.
