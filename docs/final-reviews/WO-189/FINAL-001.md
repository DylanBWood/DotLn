# WO-189 FINAL-001 — final review

**Verdict:** pass. The front page is one short owned document instead of a log: `README.md` is the candidate the operator chose, rewritten from the parts the old page said well, with a map that names all six packages, four commands that run as written, no work-order identifier, decision identifier, date or version outside its one generated line, and a "What runs today" section of nine one-sentence lines against a budget of eleven. The release block between its markers holds only the version line `npm run release -- prepare` writes; `releaseBlockRule` refuses anything else there, and the integration normalization reconciled that line across this review's own merge with `main`. The document check refuses a change to the page outside its generated blocks unless the branch's order carries `**Front page:** README.md` in its leading header on `main`, refuses a record edit, a raw-HTML or parser-extension construct, a second namesake heading and a section over its budget, and names a fix for each; a 915-row corpus and 57 fixture groups hold those refusals, and the same undeclared change passes the check at `08845c71`. The playbook and product 07 say in place which order edits the page and where any other order's proposed sentence goes, and the fifteen-sentence rule and the maintainer comment are gone. All eight criteria are met at the integrated subject; the three blocking findings of VER-001 to VER-003 were each repaired and reproduced by the next report, and VER-004 passed. This review found no new defect: the findings block is empty, VER-004's follow-up F1 is reconciled here, and the order's register rows are settled or re-disposed as [D026](../../evidence/WO-189/decisions.md#wo-189-d026--final-review-pass-at-the-integrated-subject-the-comparison-regenerated-and-the-register-retargeted) records.

**Subject:** [`docs/work-orders/WO-189-front-page.md`](../../work-orders/WO-189-front-page.md) on branch `wo-189`, uncommitted over `main`. The order's base was `c676909066d278c92cacd94d998a42a8fb5d4a9a`; `main` moved to `d17ce0047f7fe196105b47cdacade2c4956d27b4` (WO-077, merged as #201 and published as `v0.74.0`) before this review, and the integration below fast-forwarded the branch onto it with no authored conflict.

- VER-004 judged code identity `8fdbf2796bd4fa15eff2542652428b83aab2cc10a31234bd6e6d2105192ad545`. Before integration this worktree had that identity, and every untracked path and modified tracked file equalled repair-complete checkpoint 19 by blob hash apart from the control segment, the control projection and the work-order index, each changed by its generator. After integration the identity is `ecc2d86a54477cb4ccfb4c5849aaa5e94a8be7c9378b4387f2bbcff33fbb2746`, because `main`'s three commits changed code this order does not touch, so the review gate ran fresh at the integrated tree instead of composing from VER-004's row. [D025](../../evidence/WO-189/decisions.md#wo-189-d025) records both bases, the resolved projections, the carried-forward claims and the component check.
- The order differs from `main` only in its heading's version label, `(v0.74.1)`, the next patch above the published `v0.74.0` ([D018](../../evidence/WO-189/decisions.md#wo-189-d018) retimed it from `v0.73.2` when that tag was local). The eight criteria are the original text.
- No ideation receipt exists for this order: `docs/evidence/WO-189/` holds no `ideation.md`. The nomination provenance is the operator's notes of 2026-10-02 (captured in ignored intake), synthesized by the [2026-10-02 planning pass](../../planning/standard-pass-2026-10-02.md) §7, amended by the 2026-10-07 machinery-reset pass (the typed `**Front page:**` field, one sentence per line, the isolated reader launch, the fallback candidate), and judged `aligned` with no finding by that pass's refutation receipt 041. The order's own Known issues and carry-ins are judged under Known issues below.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.296","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version is what `claude --version` prints (2.1.296) and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at handoff. Every claim the verdict rests on could be run in this session: the four verifiers' probe sources, the three affected suites, the identity readbacks, the integration, the printed affected checks and the two gates. VER-001 to VER-004 reproduced their own findings in their sessions, and the executor's two worker reports were read and judged by them; no claim needed a worker here.

**Process cost:** entry 91976 tokens; handoff 10170440 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 5c76a973-a835-4b5f-82a9-0c20a147c643`.

- Entry was observed at 2026-10-10T22:08:21.422Z, after 2 steps and 1 command: 65,798 cached input, 25,722 cache-write, 4 uncached input and 452 output tokens.
- Handoff was observed at 2026-10-10T23:03:55.067Z, after both gates had passed and the gate figures were filled into this report, the PR body and the release notes, 117 steps and 114 commands in: 9,720,831 cached input, 348,654 cache-write, 1,162 uncached input and 99,793 output tokens; subagents observed 0 of the cap of 20. These are cumulative transcript totals, almost all cached input, so they do not measure live context. The final document gate, the result transition, the commits and the publish step follow the cutoff; their counters are in the ignored receipt and the response.
- Reasoning tokens and dollar cost are unavailable (`counter-unavailable`).
- Tradeoff: the review gate could not be composed, because the integrated identity differs from VER-004's, so the full selection ran fresh (the executor's last fresh run took 1,410.2 s at the previous identity). The verifiers' four probe sources and the three affected suites ran here in under a minute of compute together; the historical `08845c71` fixture extracts that commit's tree on every run, as the order requires. No matched two-way cost experiment was performed and no unmeasured saving is claimed.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-189/FINAL-001.md`.

Read in full: the order; VER-001 to VER-004; the control segment; `handoff.md`, `self-review.md`, `meta.json`, `reader-key.json`, the reader-score summaries of all four rounds; D001 to D003, D006, D013, D018, D021 to D024 and the helper's draft D025; the complete diffs of `scripts/docs-check.mjs`, `scripts/lib/release-preparation.mjs`, `scripts/release.mjs`, `scripts/lib/config.mjs`, `scripts/test-docs-check.mjs`, `scripts/test-release-preparation.mjs`, `scripts/test-release.sh`, `scripts/test-worktree-integration.mjs`, `scripts/test-worktree.sh` and `scripts/test-concurrent-control.mjs`; the new `scripts/lib/front-page-scope.mjs`, `docs/control/front-page.json` and the corpus's header and counts; the whole of `README.md` and its line-by-line difference from `candidate-1200.md`; the `CONTRIBUTING.md`, `docs/PLAYBOOK.md`, product 07 and publication-lock diffs; the repair-003 and verify-004 evidence READMEs and the saved README comparison; product 07 §Independent workflows and integration and §Verification review and attack; product 08 §PRs and commits; the 2026-10-02 planning pass §7, the 2026-10-07 pass's WO-189 lines and refutation receipt 041's WO-189 entry; `package.json` and `docs/control/budgets.json`; and the 28 register rows `followups --touching` lists, over four pages. The regenerated history, index, control and decisions-index projections were judged by their generators' checks.

Reviewed: the complete subject diff against the integrated `main`: 21 modified tracked files (2,629 insertions, 677 deletions), of which `scripts/docs-check.mjs` and `scripts/test-docs-check.mjs` account for 927 and 914 changed lines and `README.md` for 772, plus the untracked order records (the control segment, evidence, verifications and this review's directory), the corpus fixture and the new helper.

Lenses, and why:

- **Correctness and tests:** the guard decides, from Git and a parsed page, which README changes a branch may make, so the lens is whether any shape the four verifiers varied still escapes, and whether the ownership refusal can be switched off from the branch.
- **Authority and private data:** the check reads the record and the order's header at the merge base and the corpus holds synthetic pages only; the lens is whether a branch can grant itself the page and whether anything on the page or in the evidence carries private material.
- **Design and coupling:** one pure shape function serves the check, the corpus and the GitHub oracle; the lens is whether the closed surfaces (no raw HTML, no parser extension, two readings per line) are simpler to hold than the modelled ones they replace.
- **Operator flow:** every refusal names its fix and the next front-page executors meet them first.
- **Maintainer in six months:** the sentence grammar is the densest part of the file; the lens is whether its stated limits and the corpus let the next person change it safely.

Goal alignment:

- **Traps:**
  - Carrying VER-004's pass across an integration whose identity changed, as though the composed row covered the new bytes.
  - Treating the evidence mismatch VER-004 boarded (D024) as a reason to edit the page, which would certify my own change to the subject.
  - Putting the candidate choice back to the operator although D002 records it.
  - Disposing the order's register rows wholesale, or leaving rows allocated to this order to return to open at close.
  - Trusting the green document gate as evidence for the guard, when the checker under review runs inside that gate.
- **What I did:**
  - Read the identity before and after integration, recorded why it changed, and ran the review gate fresh.
  - Regenerated the saved comparison from the actual bytes and recorded that the restorations are not on the page and why they stay off it; no byte of `README.md` changed.
  - Presented the three candidates with their scores and left D002's choice standing.
  - Disposed each row on its own evidence, settling only rows whose work a decision and a verification show done, and re-disposing the planning row with its condition unchanged.
  - Reran the four verifiers' probe sources and the three affected suites at the integrated tree before reading the gate.
- **NoOp:** leaving the order unreviewed keeps the 39,030-byte page and the duty that made most merges touch it, and the four queued orders that promise a front-page sentence keep writing into a block nothing bounds.

Integration: `npm run backup:intake` archived the three intake files into the session scratch, and `npm run worktree -- integrate WO-189 --intake-backup <archive>` checkpointed the work (`refs/dotln/checkpoint/WO-189/20`), kept the named stash `9f91918d62e65f10bcd6ca882ac709e241688a70`, fetched `main`, fast-forwarded the uncommitted branch (preservation commit `22128e20c5dd515cac57e2c986aa83380303e983`, no merge commit), re-applied the work and regenerated the runtime, the harness bundle and manifest, the control projection, the release preparation (`v0.74.1` remains current), the decisions index, the follow-up register, meta, the work-order index and the publication locks. Six projections were resolved without an authored conflict: `README.md`, where `main` carried the old page's block at `v0.74.0` and the branch the rewritten page at `v0.74.1`, kept the rewritten page with its one generated line at `v0.74.1`, the live case of criterion 4's merge claim; the others are generated. Before the helper ran, `git ls-remote` showed origin's `main` at `d17ce004` and `v0.74.0` at that commit. `packages/`, `package.json`, `package-lock.json` and `docs/evidence/current.json` are byte-identical to `main`, so there is no version collision, no dependency and no evidence edition to re-mint. `scripts/lib/config.mjs` differs from `main` only by this order's six `configuredRoots` lines, beside WO-077's `kit` section.

## Earlier findings

- **VER-001 F1** (over-budget prose below the closing marker, a marker pair above the heading, many sentences on one line): repaired by [D013](../../evidence/WO-189/decisions.md#wo-189-d013--repair-what-runs-today-is-judged-as-one-range), which judges the section as one range from its heading to the next heading; VER-002 reran the probe source with no missed refusal, and it still exits 0 here ([result](../../evidence/WO-189/final-001/probe-verify-001-front-page-probes.mjs.json)).
- **VER-001 F2** (legacy wording survives a no-op prepare): repaired by [D014](../../evidence/WO-189/decisions.md#wo-189-d014--adjacent-repair-a-current-target-still-rewrites-the-block-as-its-generated-line); the release-preparation suite's 16 cases pass at the integrated tree, and VER-002 reproduced the normalization.
- **VER-001 F3** (alternate candidates miss an anchor): repaired by [D015](../../evidence/WO-189/decisions.md#wo-189-d015--adjacent-repair-the-b025-anchor-names-the-fact-not-one-pages-wording); VER-002 and VER-004 ran all three candidate anchor checks green.
- **VER-002 F1** (emphasis hides sentence breaks and a namesake heading): repaired by [D017](../../evidence/WO-189/decisions.md#wo-189-d017--repair-one-markdown-grammar-for-sentences-and-headings), then closed by D021; VER-003 reran the probe source with no missed refusal, and it exits 0 here ([result](../../evidence/WO-189/final-001/probe-verify-002-boundary-probes.mjs.json)).
- **VER-003 F1** (parser-extension nodes render as nothing; a raw HTML heading escapes): repaired by [D021](../../evidence/WO-189/decisions.md#wo-189-d021--repair-close-the-surfaces-where-github-and-the-parser-disagree-and-judge-each-line-twice), which refuses raw HTML and the parser's extensions page-wide and reads each counted line twice; VER-004 reran the probe source with no missed refusal, and it exits 0 here ([result](../../evidence/WO-189/final-001/probe-verify-003-boundary-probes.mjs.json)). **VER-003 F2** (orthographic and invisible-character limits) was taken by D021 within the bound; the remaining limits are rows of the corpus and D021's `followup`.
- **VER-004 F1** (the saved README comparison and D023 describe ten restorations the page does not hold): reconciled here. The comparison is regenerated from the actual bytes, and VER-004's own probe rerun unchanged against it reports `currentMatchesSavedDiff: true`, the page's SHA-256 equal to checkpoint 16's, none of the ten phrases on the page, and twelve lines added and eleven removed against the candidate, all of them the accuracy corrections D023's first paragraph records ([result](../../evidence/WO-189/final-001/readme-record-after.json)). The restorations stay off the page by [D026](../../evidence/WO-189/decisions.md#wo-189-d026--final-review-pass-at-the-integrated-subject-the-comparison-regenerated-and-the-register-retargeted): the candidate the operator chose and the readers scored did not carry them, and putting them on the page is a front-page choice a later order makes under D002's reopening. No byte of `README.md` changed in this review.
- **Adversary and improver** (found 23; fixed 22; recorded 1, [`self-review.md`](../../evidence/WO-189/self-review.md)), and the repair's own pair (found 47; fixed 37; recorded 10, [`repair-003/self-review.md`](../../evidence/WO-189/repair-003/self-review.md)): VER-001 to VER-004 read both and reproduced the consequential claims. The one recorded inference from the first pair, an in-flight branch's old multi-line block merging against the one-line page (D005), was exercised live by this integration: the old page on `main` and the rewritten page on the branch merged to the one generated line.

## Criterion judgments

**Criterion 1:** met

- `node docs/evidence/WO-189/inventory-check.mjs` passes here with 0 failures over the 131 blocks of the page at the order's base: 90 keep (22,961 bytes), 1 move (2,638 bytes, the test-runner and toolchain paragraph, now CONTRIBUTING §Toolchain and tests) and 40 cut (13,224 bytes); every moved or cut row names its destination and its literal anchors resolve there. VER-001 judged the four cut rows without a destination as headings or a list label without independent facts, and VER-002 to VER-004 reran the check and both alternate candidates' anchor checks green.

**Criterion 2:** met

- Checkpoint 2 (`refs/dotln/checkpoint/WO-189/2`) holds `reader-key.json` and no candidate; checkpoint 3 holds all three complete candidates (VER-001 to VER-004's artifact probes, carried). Each candidate has six scored answers from a fresh reader that received that candidate and nothing else, launched outside the repository with tools disabled and a replaced system prompt (model readback claude-opus-5-5); the scorer received the key and the answers, never the page, and every quoted line occurs in its candidate. The carried limit stands: the readers' stdin and effective user-level instruction loading are unobserved.
- The scores, for the operator's record (assumption 1):

| Candidate | Prose words | Round 1 | Round 2 (after the self-review edits) | Round 3 | Round 4 (current) |
| --- | ---: | ---: | ---: | ---: | ---: |
| `candidate-1200.md` (chosen) | 1,725 | 12/12 | 12/12 | 11/12 (q2) | 11/12 (q3) |
| `candidate-2000.md` | 2,421 | 12/12 | 11/12 (q2) | not run | not run |
| `candidate-3000.md` | 3,513 | 12/12 | 12/12 | not run | not run |

- Rounds 3 and 4 ran only the chosen candidate after the operator's direction; the round-4 q3 score of 1 fell on text unchanged since round 3, which D002 records as reader and scorer variance. The operator chose the shortest candidate during execution (D002, paraphrased there: good for now, revisitable by a later order), so the full-score fallback is not invoked and no choice is put back to the operator here.

**Criterion 3:** met

- `README.md` is `candidate-1200.md` outside the generated line, with the accuracy corrections D023 records and this review's regenerated comparison lists (twelve lines added, eleven removed): the operator's choice is recorded in D002 and the corrections in D023; the fallback is not invoked.
- `frontPageFindings` on the page returns no failure and no notice (VER-004's probe, rerun here), so the page holds no work-order identifier, decision identifier, date or version outside the generated line in text, code or link paths; the map names `beacons`, `browser-evidence`, `compiler`, `console`, `kernel` and `skeleton`, the six directories under `packages/`; `node scripts/docs-check.mjs` resolves every local link and VER-001's external probe returned HTTP 200 for the Releases link.
- The four runnable commands (`npm install`, `npm run skeleton`, `npm run console -- board`, `npm run dotln -- intent "Describe the work"`) are unchanged since VER-001 executed each on this host in a temporary mirror with the lockfile unchanged; their script mappings and implementations are unchanged by the repairs and by `main`'s three commits, so that evidence carries. Try it names the Node 26 that `package.json` requires.

**Criterion 4:** met

- `planReleasePreparation` writes the block as the single line `This source prepares DotLn \`vX.Y.Z\`.` and refuses, before any write, a second non-empty line or words beside the claim; a current target still rewrites a hand-left block as the generated line with no heading edit and no decision. The 16 cases of `scripts/test-release-preparation.mjs` pass here under the bounded runner, and `scripts/test-release.sh` asserts the two new `releaseBlockRule` refusals (an appended sentence; words beside the claim) in the review gate.
- `npm run release -- check-surfaces --local` reports `PASS release-block: observed v0.74.1` on the actual staged page.
- The one-line merge case of `scripts/test-worktree-integration.mjs` passes here (1 of 1, 4.5 s), and this review's own integration merged `main`'s old block at `v0.74.0` with the branch's one line at `v0.74.1` to exactly the generated line.

**Criterion 5:** met

- The three cases the criterion names are fixtures of `scripts/test-docs-check.mjs`: a README change outside the generated blocks is refused when the order's header at the merge base declares no `**Front page:**` field (and when the field is added on the branch alone, when the branch names no order, and when the record is deleted, edited, relocated through the configuration or given a higher budget), admitted when the header on `main` declares it, and refused when "What runs today" exceeds its budget; the executed historical case extracts `08845c71`'s `scripts/` tree and shows that check admitting the same undeclared change. All 57 groups pass here under the bounded runner (20.2 s), including the 915-row corpus (708 refuse, 207 admit, each judged on its bytes and after the formatter).
- The four verifiers' probe sources, rerun unchanged at the integrated tree, exit 0 with no missed refusal and no mismatch ([verify-001](../../evidence/WO-189/final-001/probe-verify-001-front-page-probes.mjs.json), [verify-002](../../evidence/WO-189/final-001/probe-verify-002-boundary-probes.mjs.json), [verify-003](../../evidence/WO-189/final-001/probe-verify-003-boundary-probes.mjs.json), [verify-004](../../evidence/WO-189/final-001/probe-verify-004-new-probes.mjs.json)); the current page draws no failure and no notice.
- The page, the section's markers and the budget are `main`'s record's: a declared order may add a generated block outside the section but cannot move the page, raise its budget or slip a block under the heading, and a branch that may not change the page and has not is told what `main` shows rather than refused (D021).

**Criterion 6:** met

- `docs/PLAYBOOK.md` §The loop, per work order replaces the sentence that made the README block part of every versioned order with the ownership rule: only an order whose header on `main` carries `**Front page:** README.md` edits the page, within the recorded budget, one sentence per counted line, no raw HTML, no receipt; any other order proposes one sentence in its evidence README, and two waiting proposals file a front-page order. Product 07 §Documentation freshness and ownership replaces the fifteen-sentence write-back sentence in place with the same rule and the one-line release block. Neither `fifteen` nor the maintainer comment occurs in `README.md`, the playbook, product 07 or `CONTRIBUTING.md`. Product 07 measures 185,455 of its 196,693-byte ceiling.

**Criterion 7:** met

- D002 and D003 hold the inventory totals and the scores of every round; D010 to D024 record each finding, repair and retime; D025 and D026 record this review. `npm run meta` has indexed them.
- FUP-84bc6f15abd1e45f is settled at close as D006 directs, naming the committed page, the one-line block rule and the document check, with reopening on a reader reporting the page as a log again; the request and the register revision it named are in [`final-001/followups-request.json`](../../evidence/WO-189/final-001/followups-request.json).
- Both publication editions are CURRENT (`npm run publication:check`, 254 of 254 headings; the software-engineer lock refreshed by the integration).

**Criterion 8:** met

- `npm run test:docs` passes 32 of 32 suites in 113.94 s at the integrated tree (32 fresh tasks), recorded 2026-10-10T22:35:07.625Z, after this report, the PR body and the release notes were written. Two earlier runs of the same gate failed at 22:26 and 22:27 on one cause of this review's own making: D026 linked this report before the file existed, and the document check refused the missing link, which stopped the fifteen suites that depend on it; writing the report corrected it and no other byte changed.
- `npm test -- --review` at code identity `ecc2d86a…` passes 32 suites, 0 failed, 84 fresh tasks, in 1655.53 s, recorded 2026-10-10T23:02:55.907Z as `host-gate:ecc2d86a54477cb4ccfb4c5849aaa5e94a8be7c9378b4387f2bbcff33fbb2746:npm test`; it ran fresh because the identity changed with `main`'s code at integration.
- `git diff --check` and `git diff HEAD --check` are clean and `npm run format:check` reports every matched file formatted. `package.json`, `package-lock.json` and `packages/` are unchanged from `main`; the new code imports only `node:` built-ins, `prettier` (already pinned) and local modules, so no dependency is added, and the source diff introduces no lint, type or formatter suppression.

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

Not findings, each checked:

- **The order's own header carries no `**Front page:**` field, yet the branch changes the page.** The guard admits it through the bootstrap case: the base page carries neither section marker, so only the shape, the budget and the identifier screen are judged ([D001](../../evidence/WO-189/decisions.md#wo-189-d001)). After this merge no branch can reach that state without first failing the shape check, and `npm run plan -- check` refuses a header edit to a judged order on its branch, which D001 records as the probe that ruled out adding the field.
- **The operator-word advisory on D023.** `node scripts/docs-check.mjs` advises that D023 attributes words to the operator without a capture digest. It is advisory (historical baseline 334), was present when VER-004 passed, and D023 is the executor's filed record; this review neither edits it nor counts it.
- **The record's `candidate` and `decision` fields point at the evidence directory.** They are pointers for a reader, read by nothing; the executor's improver asked for machine fields plus pointers (I14) and this is that shape.
- **`configuredRoots` validates another commit's configuration through today's validator.** A base configuration the current validator refuses is reported as a failure naming the path, not thrown; the fixture for a moved control root covers the admitted case, and the refusal case cannot occur on `main` while the document gate validates the configuration there.
- **The historical fixture archives `08845c71` on every run.** The order requires that case; VER-001 measured the suite at 125 s in the gate and it runs in 20 s here under the bounded runner.

## Implementation review

- **Correctness.** The ownership decision reads three things at the merge base: the configuration (for the control root), the record and the order's authority file, so nothing a branch writes can widen its own permission; a working-tree record is read only when the base has none, and a declared order's new record governs only the generated blocks it may add. The shape judgment is a pure function of the page text and the record, which the corpus test and the GitHub oracle call directly; the two readings of each counted line (the parser's rendering and the raw source with markup removed) must both be one sentence, so a construct that hides text from one reading is caught by the other, and the inline node list is closed so a later parser extension is refused rather than rendered as nothing.
- **Design.** Four repairs enumerated spellings and each verification varied the representation; D021 closes the two open surfaces instead (no raw HTML outside the marker lines, none of the parser's unshared extensions, no bidirectional or control character, no 1000-byte bracketed run) and records every decided case as a two-sided corpus row before the check changes. The release side is smaller: one exported `releaseClaimLine`, a refusal in `planReleasePreparation` before any write, and a rule in `releaseBlockRule` that compares the one non-empty line with that string. The merge normalization needed no change; a fixture pins the one-line case.
- **Operator flow.** Each refusal names the line and the fix (move the sentence between the markers, drop the list marker, escape the bracket, list the block in the record, rewrite the line your capability supersedes); the next front-page executors meet these first. A branch that does not touch the page is told what `main` shows and never refused for it.
- **Authority and private data.** The corpus holds synthetic pages only; the GitHub oracle rendered those pages under the operator's authorization, and this review sent nothing to it. The reader runs were launched outside the repository with tools disabled. Nothing on the page, in the evidence or in the fixtures names a managed host, a forge account or an internal service; this review's copied outputs replace local paths with placeholders.
- **Maintainer in six months.** The sentence grammar (`TERMINAL`, `TRAILING`, `SENTENCE_BREAK`, `SPACELESS_JOIN`, `CODE_SENTENCE`) is the part a reader must hold; its comment states each rule and D021 lists its known limits, and the corpus turns every later question into a row whose expectation the test judges. The one thing to remember is that the check runs inside the document gate it also judges: a green gate shows the fixtures passed, and only the probe sources and the corpus show the refusals.

## Follow-up register

`npm run plan -- followups --touching` lists 28 pending rows by textual match at the integrated tree, read over four pages; eleven of this order's own rows are disposed here through one `--apply` batch, and the request file records each reason and the register revision it named.

- **Settled, the work done and verified within the order:** FUP-84bc6f15abd1e45f (the release block regenerated within its rule; D006's close-time retarget); FUP-6e5ddcd44b2e7932 (D010, done by D013); FUP-b5b3e26976408c94 (D011, by D014); FUP-9dd4c0a807c54b02 (D012, by D015); FUP-bfa0c87318fa5974 (D013, reopened by D016 and re-decided by D017 then D021); FUP-4e6c063a2519487e (D016, by D017 then D021); FUP-daa06c89c2fffd1a (D017, reopened by D019 and superseded by D021); FUP-6d95d0885c703ef0 (D019, by D021); FUP-de8f8fd8ec8ff654 (D020, taken by D021 within the bound); FUP-6e12e29626183923 (D024, reconciled here under D026). Each names VER-004's pass and the corpus.
- **Re-disposed as deferred:** FUP-5de3c35ef3d05142 (D023's planning items: WO-095 and WO-118 text against the new page, two lines of headroom against three queued sentences, WO-088's block registration, the Poincaré row's rights fields); its source revision changed when D023 was corrected the same day, and its reopening condition is unchanged.
- **Left as they are, for release close or planning:** FUP-89e29438bd71c524 (D021's recorded guard limits, deferred until an order relies on one or WO-088 is activated without listing its block); FUP-8111fc3dd4c22331 (the dated log in the documentation map, which reopens when WO-189 closes, so release close or the next planning pass reads it).
- **Matched by text only, seam not opened:** FUP-c24585c3b7bebf38 (WO-196 D014, the unused `runGit` import, which this order re-imports and uses); FUP-0a7c93eed06727ce (optimize product 07, which this order grows by one paragraph to 185,455 of 196,693); FUP-1315c82ef74fb832, FUP-c95ffe4a84e49cbb and FUP-4c4ad5ef3c88547f (WO-187 and WO-188 low items naming `docs-check.mjs`); FUP-67a07b670440cf5a (the findings-block judgment; this report's block is measured and empty); FUP-f1c7a256bec46737 (cold-start ceilings; `node scripts/harness-context.mjs --check` reports every bounded role within its ceiling and the refuter unset); FUP-fb8cbeabbddef397 (ER4-005, a recurring gate's cost; this order adds fixtures to the document-check suite, which is suite cost, not history cost); FUP-4b70089b028849f0 (ER5-002, the register itself); FUP-8cfd3ff52146a016, FUP-da471832071118c7, FUP-cc27c2c1a82fed2c, FUP-079f827e1b11eb1e and FUP-fb2a080cc9b597d0 (release-close and `test-release.sh` items this order's block rule does not touch); FUP-acfe4bfda716d8fb and FUP-749c959a41178a3b (the control projection); FUP-fd05316b6030ef73 (the README release line and the writer text); FUP-815e8662408881f1 (`linkHosts` validation in `config.mjs`); FUP-bd3e66761dc301ed (the launchpad's seeded `docs/README.md`, which names the playbook and history).

`npm run meta` reports the standing reopen candidate WO-150-D003 (`coldStartBytes.executor` above 24,576), which earlier reviews also recorded; the executor measures 28,112 and did not change here.

## Known issues and carry-ins

- **The 2026-10-07 pass's stale items** (the page's size, the block's size, the merge count, WO-112 closed, WO-118's sentence into the marked section, the pinned wording): corrected in the order text; the decided items hold at the subject: the typed field is read by `front-page-scope.mjs`, the section holds one sentence per line, the readers were launched in isolation, and the fallback was not needed. Reopen (the operator picks a candidate the scores rank lower): not met; the chosen candidate shares the top round-one score and the operator's choice is recorded.
- **WO-188 item 14 before this order:** WO-188 merged as #196 before activation; the executor rebased over it, and `planReleasePreparation`'s line positions in the order's plan were re-read then.
- **The four queued orders that promise a sentence** (WO-095, WO-098, WO-118; WO-088's generated table): their headers carry `**Front page:** README.md` on `main`, so the check admits them; three sentences against two lines of headroom is the planning item D023 boards (FUP-5de3c35ef3d05142), and WO-088 must list its block in the record (FUP-89e29438bd71c524).
- **The release line names a version that may already be published:** `v0.74.1` is unpublished and the next patch above `v0.74.0`; release close checks the claim against tag truth.
- **The epigraph and the directed phrases** are operator-authored public wording kept by direction; the candidates and the page keep them verbatim, and the rights fields of the Poincaré row in `docs/lineage/inspirations.md` are a planning item on the same row.
- **Operator-review assumptions 1 to 4:** the operator chose during execution; text that left the page moved to `CONTRIBUTING.md` or was already in release notes and evidence (the inventory's destinations); an ordinary order cannot change the page and the four queued orders keep their promise within the budget; the budget is the chosen candidate's count plus two (nine lines, budget eleven).
- **Cost line:** the deliverables match the order's cost; the corpus (286 KB) and the GitHub oracle result (470 KB) are the largest additions, both fixtures and evidence rather than source.

## Release surfaces

- [`PR.md`](PR.md) is written under product 08 §PRs and commits, with one physical line per prose paragraph and the regenerated process meter kept below the prose.
- [`RELEASE-NOTES.md`](RELEASE-NOTES.md) is the five-section patch edition for v0.74.1.

The proposed PR title is `:memo: The front page says what DotLn is in a length a visitor finishes, and only a front-page order can change it`. Its gitmoji is `:memo:`, the catalog's entry for documentation, because the reader-facing change is the page itself; the guard, the block rule, the budget and the corpus belong to the body. The title leads with what a visitor gets and the one rule that keeps it; the last five merged titles run 24, 21, 21, 22 and 20 words, and this title's 22 come from its two clauses, not from the previous title.

## Executed checks

Each probe and suite ran alone under `node scripts/harness.mjs bounded`; each check ran alone. Times are 2026-10-10 UTC.

| Check | Window | Exit | Result |
| --- | --- | --- | --- |
| `node scripts/harness.mjs usage <session>` (entry) | 22:08:21 | 0 | 91,976 tokens, dispatch scope |
| `npm run resume --silent -- status --json` | 22:08 | 0 | phase final-review; FINAL-001 allocated; one legal action |
| hash comparison of every untracked and modified path against checkpoint 19 | 22:11 | 0 | only the control segment, the control projection and the work-order index differ |
| `node docs/evidence/WO-189/inventory-check.mjs` | 22:11 | 0 | 131 blocks; 90 keep, 1 move, 40 cut; 0 failures |
| `npm run plan -- followups --touching` (four pages) | 22:11–22:13 | 0 | 28 rows matched |
| `gateCodeIdentity` before integration | 22:14 | 0 | `8fdbf279…`, equal to VER-004's subject |
| `git ls-remote --heads origin main`; `--tags origin 'v0.7*'` | 22:14 | 0 | `d17ce004`; newest `v0.74.0` at that commit |
| `npm run backup:intake` | 22:14:21 | 0 | archive of 3 files in the session scratch |
| `npm run worktree -- integrate WO-189 --intake-backup <archive>` | 22:14:30–22:14:50 | 0 | checkpoint 20; stash `9f91918d…`; fast-forward; no authored conflict; nine regeneration steps |
| `gateCodeIdentity` after integration | 22:15 | 0 | `ecc2d86a…` |
| `npm run publication:check` | 22:15 | 0 | 254/254 headings; both outlines CURRENT |
| `node scripts/harness.mjs check` | 22:15 | 0 | 34 generated surfaces |
| `npm run release -- check-surfaces --local` | 22:15 | 0 | every license and publish-refusal row passes; `PASS release-block: observed v0.74.1` in the document gate's preflight |
| `node scripts/docs-check.mjs`; `npm run work-orders -- index --check`; `npm run format:check`; `git diff --check`; `git diff HEAD --check`; `node scripts/harness-context.mjs --check` | 22:15–22:16 | 0 each | 15 documents, 0 failures, product 07 at 185,455 of 196,693; both index pages current; all files formatted; clean; six roles within ceilings, refuter unset |
| `git diff main --stat -- packages/ package.json package-lock.json docs/evidence/current.json` | 22:15 | 0 | empty |
| the four verifiers' probe sources (bounded, one at a time) | 22:17:38–22:17:46 | 0 each | no missed refusal, no mismatch; the current page has no failure and no notice |
| `node --test scripts/test-docs-check.mjs` (bounded) | 22:20:28–22:20:48 | 0 | 57 passed, 0 failed, 20.2 s, including the corpus and the executed `08845c71` case |
| `node --test scripts/test-release-preparation.mjs` (bounded) | 22:20:48–22:20:52 | 0 | 16 passed, 0 failed |
| the one-line merge case of `scripts/test-worktree-integration.mjs` (bounded) | 22:20:52–22:20:57 | 0 | 1 passed |
| regenerated `repair-003/readme-vs-candidate-1200.diff.txt`; `verify-004/readme-record.mjs` rerun (bounded) | 22:23 | 0 | `currentMatchesSavedDiff: true`; 12 added, 11 removed against the candidate |
| D025 completed and D026 added; `followups --apply` (11 requests); `npm run meta`; `npm run format`; `git diff --check` | 22:24–22:27 | 0 each | register revision `30cbefd0…`; D025 and D026 indexed; one standing reopen candidate (WO-150-D003); clean |
| `npm run test:docs` (two refused runs, then the pass) | 22:25–22:35 | 1, 1, 0 | the first two refused on this report's missing file (D026's link); the third passed 32 of 32, 113.94 s, 32 fresh tasks, recorded 2026-10-10T22:35:07.625Z |
| `npm test -- --review` (background) | 22:35:18–23:02:56 | 0 | fresh at `ecc2d86a…`: 32 passed, 0 failed, 84 fresh tasks, 1655.53 s, recorded 2026-10-10T23:02:55.907Z |
| `node scripts/harness.mjs usage <session>` (handoff) | 23:03:55 | 0 | 10,170,440 tokens, dispatch scope |

After the gate figures were filled into this report, the PR body and the release notes, `npm run meta`, `npm run format` and `git diff --check` ran again; the result transition runs `npm run test:docs` and `git diff --check` inline on the final bytes.

Repository writes:

- this report, `PR.md` and `RELEASE-NOTES.md`;
- D025's completion and D026;
- the regenerated `docs/evidence/WO-189/repair-003/readme-vs-candidate-1200.diff.txt` and this review's `docs/evidence/WO-189/final-001/` (the probe and suite outputs, the check logs, the register request);
- the eleven register dispositions;
- the regenerated runtime, harness bundle, control, release-preparation, decisions-index, follow-up-register, meta, work-order-index, history and publication-lock projections.

No behavioral source was edited and no byte of `README.md` changed. The intake backup lives in the session scratch; the fixtures' own cleanup removed their temporary repositories, and no scratch repository remains in the worktree.

Goal alignment outcome: matched. The integrated bytes were judged at their own identity with a fresh gate, the evidence mismatch was reconciled without touching the page, the operator's recorded choice stands with the three candidates and their scores on record, each register row was disposed on its own evidence, the guard's refusals were established by the probe sources and the corpus rather than the gate, and the reviewed state is ready to commit.
