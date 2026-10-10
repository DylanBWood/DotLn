# WO-189 executor handoff

Dispatch: `resume: fix` on 2026-10-10, repairing
[VER-003](../../verifications/WO-189/VER-003.md) F1 under criterion 5 and
taking D020's follow-up. Earlier work stays recorded in D001–D020,
[repair-001](repair-001/README.md), [repair-002](repair-002/README.md) and the
preserved checkpoints; this repair's evidence is [repair-003](repair-003/README.md).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.296","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

The model is the identifier in the session's system context; the effort is
the root session's `CLAUDE_EFFORT`, the selected effort, not a measured one;
the harness version is what `claude --version` printed. The order recommends
executor xhigh. No setting changed except `docs/control/budgets.json`
`subagentCap`, raised to 25 under the operator's authorization and restored to
20 before the gates (D022); it shows no diff.

The rule the repaired guard holds is
[D021](decisions.md#wo-189-d021--repair-close-the-surfaces-where-github-and-the-parser-disagree-and-judge-each-line-twice):
the front page holds no raw HTML outside its marker lines, no parser extension
GitHub does not share, no control or bidirectional character and no 1000-byte
bracketed run; each counted line is read raw and through the parser, line by
line, and must be one sentence in both; the section is named once among the
headings and heading-capable lines; the page, the markers and the budget are
main's record's, and an order is judged on its own change. The page's own
changes are [D023](decisions.md#wo-189-d023--repair-the-front-page-follows-the-operators-recorded-judgment-claims-and-voice-alike).

**Criterion 1:** met — `node docs/evidence/WO-189/inventory-check.mjs` passes with 0 failures over all 131 base blocks (90 keep, 1 move, 40 cut) after the final page and product 07 edits; the alternate candidates are unchanged.
**Criterion 2:** met — the reader key, the three candidates, the reader and scorer records and the checkpoints are unchanged; candidate-1200.md stays as its readers scored it, since three of its reader's quotations quote sentences the corrections replaced (D023).
**Criterion 3:** met — README.md is candidate-1200 (D002) with the changes D023 records from the operator's choice and recorded judgment, listed in [the diff](repair-003/readme-vs-candidate-1200.diff.txt); `frontPageFindings` returns no failure and no notice on the page, so it holds no receipt; the map names all six packages; the document check finds every link; the four commands are unchanged since VER-001's executed evidence, and Try it now names the Node 26 that package.json requires.
**Criterion 4:** met — release preparation, the block rule and the merge normalization are unchanged by this repair, and the passing `npm test -- --review` row covers their suites; the guard admits the one-line release block under the heading.
**Criterion 5:** met — the guard refuses every one of 915 corpus rows it should and admits the rest, before and after formatting; GitHub's renderer, given each row's page, shows no admitted page with a second namesake or more sentences than counted lines ([oracle result](repair-003/github-oracle-result.json)); VER-003's probe reruns unchanged with no mismatch, and VER-001's and VER-002's probes with none missed; `scripts/test-docs-check.mjs` passes 57 of 57 groups, including the comparison that fails against `08845c71`; the passing `npm run test:docs` row runs them.
**Criterion 6:** met — docs/PLAYBOOK.md and product 07 §Documentation freshness and ownership say in place that only an order declaring the page on main edits it, what the page holds, where a proposed sentence goes and that a front-page order applies the operator's recorded judgment; the fifteen-sentence rule and the maintainer comment are absent; both publication editions are CURRENT.
**Criterion 7:** met — the decisions keep the inventory totals and reader scores (D002, D003) and record this repair (D021–D023); FUP-6d95d0885c703ef0 and FUP-de8f8fd8ec8ff654 are allocated to WO-189, FUP-89e29438bd71c524 and FUP-5de3c35ef3d05142 deferred with reopening conditions, and FUP-84bc6f15abd1e45f's retarget stays the close-time duty D006 names; the decisions index and both publication locks are current.
**Criterion 8:** met — `npm run test:docs` passed 32 of 32 suites in 100.60 s (recorded 2026-10-10T21:15:42.862Z) and `npm test -- --review` passed 32 of 32 suites with 84 fresh tasks in 1,410.15 s (recorded 2026-10-10T21:39:40.776Z); `git diff --check` is clean and no untracked file outside the exempt evidence logs carries trailing whitespace; package.json and the lockfile are unchanged, so no dependency is new.

self-review: found 47; fixed 37; recorded 10 — the criteria adversary found 14
(fixed 11, recorded 3) and the design reviewer found 33 (fixed 26, recorded 7);
[self-review](repair-003/self-review.md) lists each finding and its disposition.
Beyond the pair, twenty-three further reviewers attacked, read and verified the
repair in waves (D022); their findings are rows of the corpus.

Goal alignment: the aim was to end the cycle of verification failures without
handing later executors a footgun. The outcome matches it as far as evidence
reaches: the classes the verifications kept finding came from raw HTML and
from where GitHub and the parser disagree, and those surfaces are now closed
rather than modelled; GitHub's own rendering shows no admitted page over its
count. It does not prove no further representation exists: every review wave
found something until the budget was spent, and the corpus, not a claim of
completeness, carries what was found. The README follows the operator's
recorded judgment rather than this session's questions or the executor's taste.

Process cost: entry readback reported 89,215 total tokens (cutoff
2026-10-10T18:13:13.336Z); the handoff readback reported 139,541,529 (cutoff
2026-10-10T21:39:47.856Z), both from `claude-transcript-message-usage` at
dispatch scope. Dollar cost is unavailable. The harness observed 25 subagent
admissions with no unresolved admission; unobserved descendants are unknown.
The 25 agents' own completion records total 6,031,134 tokens. Gate wall time
is recorded above. GitHub's Markdown API rendered synthetic fixture pages
only, under the operator's authorization.

Limits: the corpus records the guard's stated limits (look-alike letters,
digit note marks, lowercase sentences inside code, a stop meeting capitals and
others in D021); a generated block outside the section is judged only by its
writer's check; WO-095, WO-098 and WO-118 promise three sentences against two
lines of headroom, a planning item (D023). The adjacent queue is unchanged.
No background monitor remains. Verification and final review are separate
dispatches.
