# WO-123 FINAL-001 — final review

**Verdict:** pass. WO-123 asked for one persisted continuation that carries a filed intent from its issue to a terminal pull-request state, entered by the resident under standing authorization or by `dotln vertical`, with each step's receipt, typed stops, a path-identity refusal and the composition's own baseline, review and delivery decisions, proven with doubles. This review judged the original eight criteria against the subject integrated with `main` at `c44ba6c6`, and all eight are met. VER-005's reading of criterion 5 stands. This review also reproduced seven defects inside the order's own surfaces that no verification had found; the worst was a resident that ran two complete continuations, with two pull requests, for one issue. The operator directed this review to fix them in this session and to have subagents review the fix, so the fixes are here rather than in another repair cycle ([D043](../../evidence/WO-123/decisions.md#wo-123-d043--final-review-fixes-written-under-the-operators-direction-and-reviewed-independently)). Read-only reviewer subagents judged each of three fix batches; the third corrected two operator-path regressions the second batch's reviewer found. A fresh `npm test -- --review` at the reviewed identity passed 34 of 34 suites. Five items stay follow-ups with conditions ([D044](../../evidence/WO-123/decisions.md#wo-123-d044--final-review-pass-dispositions-and-follow-ups)).

**Subject:** [`docs/work-orders/WO-123-vertical-composition.md`](../../work-orders/WO-123-vertical-composition.md) on branch `wo-123`, uncommitted, integrated during this review from base `2816c773008c66b8ab0ac4a0fd73c21b7df9f2d0` to `main` at `c44ba6c60d7a3049f15edc4ce106b2dcc518b551`. The dispatch checkpoint is `refs/dotln/checkpoint/WO-123/21` (`8c060bec`), and the integration checkpoint is `/22`.

- The reports: the recorded `reportHash` of VER-001 to VER-005 each equals the report's current SHA-256.
- The order: it differs from `main` only in its heading's version label, `(version assigned at activation)` → `(v0.67.0)`. The eight criteria are the original text.
- Ideation: no ideation breakout receipt applies. The evidence folder holds none, and the control log records no scope expansion or amendment.
- Carried bytes: before this review's fixes, every non-document path that differed from checkpoint 21 was a path upstream had changed, so VER-005's source bytes entered the integration unchanged ([D041](../../evidence/WO-123/decisions.md#wo-123-d041--integrate-main-at-c44ba6c6-during-final-review), [D042](../../evidence/WO-123/decisions.md#wo-123-d042--integration-resolutions-retained-versions-and-the-integrated-gate)).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.289","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session. Mid-review they directed this review to fix the defects it had found and to spawn subagents to review the fix. They made no choice about the verdict. The harness version comes from `claude --version` (2.1.289). The model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` as this session read it; it is the selected effort, not the effective one. The order recommends `reviewer any`.

Subagent plan, stated before the first spawn: two read-only reviewers against the cap of 20, with 0 observed at entry, each judging a group of items: the new assessment boundary, and the rest of the source diff. After the operator's direction, three more read-only reviewers each judged a batch: the first fix batch, the remaining unreproduced suspects, and the second and third batches (the third by a follow-up message to the same agent). The counter reports 5 subagents, exact-observed, with 15 remaining. No subagent wrote to the repository; each wrote probes only under this session's DotLn scratch.

**Process cost:** entry 85848 tokens; handoff 89426052 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 566aba7e-cc83-4a99-bead-ab19b0b77ed8`.

- Entry was observed at 2026-10-05T21:20:59.291Z.
- Handoff was observed at 23:20:59.677Z, after the final product gate, D045 and the register batches, and before the last document gate and the result transition. It counts 88,649,625 cached input, 546,557 cache-write, 514 uncached input and 229,356 output tokens over 302 steps and 203 commands.
- Both readings count reused cached input, so they do not measure live context. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero. Whether the dispatch total includes the subagents' own tokens is unknown.
- The largest waits were the product gates (862.37 s on the integrated tree, 915.21 s and 986.91 s on the fixed one), the first document gate (756.00 s, mostly queued behind another worktree's gate for shared host lanes) and the two live feedback episodes (52.1 s and 42.0 s).

## Goal-aligned judgment

The mission contribution is the first command and the first resident path that run the delivery loop end to end. WO-112's live proof and WO-118's unattended run build directly on it, so a defect in the resident's admission would surface first in the run nobody watches.

- **Rule beating and seeking the wrong goal:** VER-005's pass and its passing cases were not the goal. This review drove both entries with probes and found two runs for one issue.
- **Fixes that fail:** the first duplicate-draft rule held a draft another entry names, and moving the origin check let the command file a draft before refusing. Independent review caught both before the final gate.
- **Policy resistance:** a reviewer does not write and certify a fix. The operator's direction overrides that here. Its purpose is kept by fresh-context reviewers per batch, tests that fail on the earlier code, the final gate and a fresh live feedback edition.
- **Escalation:** only defects reproduced in this order's surfaces were fixed. Five items stay follow-ups: a worktree registration a kill can leave, the resident's read-once configuration, kill-on-return ending a continuation, the hold reason when authority cannot be bound, and WO-184 D038's G1.
- **Shifting the burden:** the operator gets the fixes now rather than after another repair and verification cycle. Downstream producers still owe `baselineAssessment` (FUP-faae1df8f1022634).
- **Drift to low performance:** each judged-source edit re-minted the feedback edition from a live audit.
- **The commons and success to the successful:** five read-only reviewers in batches, one writer, and sequential bounded probes.
- **Naive Interventionism:** the fixes touch only `vertical.ts`, `vertical-runtime.mjs`, `vertical-transport.mjs`, `dotln.ts`, the skeleton README and the suite.
- **NoOp:** publishing as verified would ship a resident that can open two pull requests for one issue.

## Criterion 5 and how the baseline knows meaning

VER-005 asked final review to say whether criterion 5 requires the composition itself to infer failure from English. It does not.

- The Design says the composition "takes the story's class from the StoryContract". WO-180 D013, which asked for the duty, says it "reads the class from WO-061's StoryContract".
- WO-061's classifications are caller-supplied inferred entries (D005). D005 rejected classifying issue text automatically as "a new inference primitive", and the order says "The order adds no primitive".
- A reviewed `baselineAssessment` bound to the compiled contract's statement identities is the same kind of input. The criterion's own checks hold: a primitive that classes a failing contract new is reported, a defect must reproduce, and missing or unresolved meaning stops before any effect.

D040's reopening condition is therefore not met. D037's "entire refactor" authorization is the executor's own attestation (`docs/control/local/adjacent-work.jsonl` seq 46). This verdict does not rest on it, because the change stays inside the order's surfaces and criteria.

## What this review read

- The whole order, VER-001 to VER-005, the handoff and D001 to D040, plus WO-180 D013 and WO-184 D032, D038 and D013.
- The product write-backs (07 §Derived work and intent and §Declaring a portfolio, 03 §Operator-presence policy) and the skeleton README's §Vertical continuation.
- In source: `resident-state.ts` (the four intent events and their fold), `dotln.ts`, the beacon guard diff, `vertical-transport.mjs`, and `vertical-runtime.mjs` (configuration, issue selection, preparation and both entries). Also `vertical-resident.ts`'s admission loop, `admitIntent`'s binding key, the assessment decoder and the `VERTICAL_STEPS` program.
- The reviewers read the rest of the roughly 4,700 source lines, each naming its reads and probes.

## Criteria

- **Criterion 1:** met. The resident case, the declared negative holds and the durable-hold cases pass in the final gate. The duplicate-draft case lies outside the declared set and is fixed here (D043).
- **Criterion 2:** met. The operator-first restart, convergence, shared-budget and `SIGKILL` cases pass. The two entries now share one draft-selection rule and refuse a changed origin alike.
- **Criterion 3:** met. The capsule, lint, `NeedsHuman`, screen, baseline and readiness-tampering stops pass, and the transport no longer launches a child killed during its authority read.
- **Criterion 4:** met. Case, volume and Unicode variants are refused on the recorded case-insensitive APFS volume with no residue, and the canonical disjoint parent succeeds. `vertical.json`'s own target and worktree parent now meet the same identity rule.
- **Criterion 5:** met, as the section above judges.
- **Criterion 6:** met. Product 07 §Derived work and intent and §Declaring a portfolio and product 03 §Operator-presence policy carry the write-backs in place, with no dated paragraph. The integration put product 07 3,343 bytes over its ceiling, because WO-186 had used WO-123's reserved headroom. At the operator's choice this review condensed WO-123's 07 write-backs to the command, the admission and the `intent` class, leaving the details in the skeleton README. It then raised 07's ceiling by the remaining 1,176 bytes under a planning decision ([D045](../../evidence/WO-123/decisions.md#wo-123-d045--condense-the-product-07-write-backs-and-raise-its-ceiling-by-the-remainder), [planning §1](../../planning/wo-123-integration-ceiling-2026-10-05.md#1-product-07-ceiling)). Product 03 is unchanged. The engineer edition's publication lock was refreshed for the condensed section, and `npm run publication:check` reports both editions current.
- **Criterion 7:** met. All four editions select WO-123 revision 013. It was re-minted after the last `vertical.ts` edit, with a live feedback audit on `codex-cli-exec`, `gpt-6.1-sol`, `max` that completed ten fixtures in 42.0 s ([regeneration-013.json](../../evidence/WO-123/regeneration-013.json)). The feedback check reports that the audit "judged the current source". Revision 011 (the integration's carry) and 012 (the first fix batch) are kept as history.
- **Criterion 8:** met.
  - `npm test -- --review` passed at the final code identity `b917af6db6a9a3b718c2d69144a6cea9c11e1ce4f6da86d99ba61aaf1bc1dd67`: 34 passed, 0 failed, 986.91 s, 84 fresh tasks, recorded 2026-10-05T23:20:06.500Z. Its transcript has no failed case. The same gate passed at `84b33b5d…` after the third fix batch (915.21 s); D045's Prettier reformat of the suite then moved the identity.
  - `npm run test:docs` passed 29 of 29 tasks in 69.81 s at the same identity, with this report, D041 to D045, PR.md and RELEASE-NOTES.md in place. The result transition runs it again inline.
  - `git diff --cached --check` exits 0.
  - Package changes are the skeleton 0.53.0, the beacons 0.1.1 and the console's exact pin; no dependency is added. The fixes add no lint or type suppression.

## Defects fixed in this review

| Defect | How it was found | Fix | Test that fails on the earlier code |
| --- | --- | --- | --- |
| Two filed drafts for one issue, with no `draftId` on its entry, ran two complete continuations in the resident; the command refused | This review's probe: both admitted, 14 receipts each | One shared rule, `draftsFor`: only drafts no other entry names; the resident holds at `admission` | "two filed drafts…", "a draft another entry names…", "a draft that leaves the filed set…" |
| The judgment order, and so the binding key, depended on the host locale | Assessment reviewer's probe: en_US and da_DK orders and hashes differ | `compareText` | "judgment order and binding identity do not depend on the host locale" |
| A kill during the transport's authority read still launched the child | This review's probe against checkpoint 21 | Re-check the kill flag after the await | "transport refuses a child killed while launch authority is read" |
| The README said a pre-assessment continuation holds through the entries; the ledger actually refuses it | Assessment reviewer, from code | README corrected | Documentation only |
| An unreadable target at configuration read became a permanent hold for every configured draft | Suspects reviewer's probe s3 | Unreadable is transient; a readable target's missing or foreign origin still refuses at read, and the resident re-checks at preparation | "an unreadable target leaves the draft undecided…", "a target origin that names another forge…", "the resident holds a draft whose target origin changed…" |
| A volume-alias target spelling loaded and was retried forever | Suspects reviewer's probe s4b | `target` and `worktreeParent` must equal `/bin/pwd -P` | "a volume-alias target spelling is refused…" |
| A paused `dotln vertical` printed the whole state (410,143 bytes, with issue text and paths) | Suspects reviewer's probe s8 | Print the step position only | Reviewed in code; no CLI fixture |

## Register

`npm run plan -- followups --touching --work-order WO-123` returned 31 rows at register revision `b2debb5a818024bd7fd62467a986d203d045d19739e3ece5a23d0454a41fd748`. The row FUP-8369f2b4284e70a8, allocated to this order, was read with `--show`. One `followups --apply` batch disposed 18 rows, and the register moved to `d505d90477c1f10681b04d49af365cdffd0ee6c62da4a1e47b3a2655d6e91ca7`. Each reason cites this report. After D044 was updated to name the final identity, its row was disposed again at source revision 3, and the register is at `c48ea923d437c3e9e75ffec9ed1af4f3da4c1f272343d3a9fb273a94ed16d428`.

| Row | Disposition | Why |
| --- | --- | --- |
| FUP-8369f2b4284e70a8 (WO-162 D004) | settled | Criterion 4 is met, and the identity rule now also covers `vertical.json`'s target and worktree parent. |
| FUP-02bb24fa17b09d6e (D018), FUP-292495966f229bc6 (D019), FUP-2d0fcb555f4a29da (D008), FUP-8a7b975033b4203b (D016), FUP-a7e4faa0d61cba13 (D022) | settled | Repaired and verified by VER-002 or VER-003; the cases pass in the final gate. |
| FUP-6374f558664c418e (D037), FUP-c93cd9075de47176 (D033) | settled | The source-bound assessment is implemented, VER-005 passed it, and this review judged criterion 5 met. |
| FUP-2709c55824da8403 (D026), FUP-a45f36e984a54cff (D021), FUP-a830400bd33152c9 (D034), FUP-ba51f50cadb9dae2 (D027), FUP-fb42e392b945cb45 (D023) | settled | D037 removed the lexical classifier these rows tracked. |
| FUP-cb922b59e013dbf1 (D017, B1) | deferred | Outside the order's criteria and surfaces; no hook failure was met. |
| FUP-faae1df8f1022634 (D040) | deferred | WO-112 and WO-118 must supply `baselineAssessment`. |
| FUP-82750a69c54c2ced (D044) | deferred | The five remaining items, until WO-118 is planned or a condition occurs. |
| FUP-c4e2db6d99a13eb7 (WO-184 D038) | deferred | This order proves the Claude writer path only with doubles. G1 is to be settled before WO-112's first live Claude writer run. |
| FUP-0113 | deferred | D005 records each step's model-input exposure. No live model consumed a screened bundle. |

The other 14 rows were textual matches; this change did not open their seams, and their conditions did not occur.

- FUP-adf6621e7f958dd8: repeated `authority.json` copies are 3.96% of `docs/evidence` bytes (4.93% counting every copy), against a 10% condition.
- FUP-605ef3167ee20e5f: WO-184's R10 held, so nothing went to WO-123.
- FUP-81ae3c4f2fdb7893: `node docs/evidence/WO-184/check-reactor-move.mjs --check` reports "Three original bodies byte-identical; reactor within 92,000 characters." at this subject.
- FUP-4f8cd7989607ad3f: NoOp deduplication is unchanged.
- FUP-f1c7a256bec46737: no role text changed.
- The rest: FUP-fb8cbeabbddef397, FUP-0086, FUP-4b70089b028849f0, FUP-acfe4bfda716d8fb, FUP-d0a9719cc2e4ec55, FUP-e821aa2ced3aa111, FUP-e8f5399db33d0b5a, FUP-fd05316b6030ef73 and FUP-5094b24d6d68d2e4.

## Integration

- `npm run worktree -- integrate WO-123` fast-forwarded from `2816c773` to `main` at `c44ba6c6` (WO-186, v0.66.3), with preservation checkpoint `/22` and named stash `8cf2bac4`. Five authored conflicts were resolved and `--continue` completed generation ([D041](../../evidence/WO-123/decisions.md#wo-123-d041--integrate-main-at-c44ba6c6-during-final-review), [D042](../../evidence/WO-123/decisions.md#wo-123-d042--integration-resolutions-retained-versions-and-the-integrated-gate)).
- Versions: the skeleton keeps 0.53.0 above upstream's 0.52.3, the beacons keep 0.1.1, and the compiler takes upstream's 0.25.2. v0.67.0 stays above v0.66.3, so no retime was due.
- Editions: upstream's compiler release staled revision 010, so revision 011 re-minted three editions and carried the live audit, as the feedback check prescribed.
- The integrated tree's own gate passed 34 of 34 suites (862.37 s) before the fixes.

## Verification sequence

1. **Activation:** 2026-10-05T00:56:57Z.
2. **Implementation** (Codex CLI 0.160.0, `gpt-6-astra`, max): `ImplementationReady` at 04:24:18Z. D001 to D015.
3. **[VER-001](../../verifications/WO-123/VER-001.md)** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh): fail at 05:38:55Z on criterion 5 (F1 to F3), with R1 to R8 and boarded B1 (D016, D017).
4. **Repair** (Codex CLI 0.160.0, `gpt-6.1-sol`, max): 13:42:25Z to 14:53:30Z. D018 to D020.
5. **[VER-002](../../verifications/WO-123/VER-002.md)** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh): fail at 15:32:05Z on criterion 5 (F4), with R9 to R14 (D021, D022).
6. **Repair** (Claude Code 2.1.289, `claude-fable-5-1`, xhigh): 15:32:56Z to 16:44:11Z. D023 to D025.
7. **[VER-003](../../verifications/WO-123/VER-003.md)** (Codex CLI 0.160.0, `gpt-6.1-sol`, max): fail at 17:03:43Z on criterion 5 (F5), with R15 (D026).
8. **Repair** (Codex CLI 0.160.0, `gpt-6.1-sol`, max): 17:10:10Z to 18:42:16Z. D027 to D032.
9. **[VER-004](../../verifications/WO-123/VER-004.md)** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh): fail at 18:58:23Z on criterion 5 (F6) (D033).
10. **Repair** (Codex CLI 0.160.0, `gpt-6.1-sol`, max): 19:04:17Z to 20:39:41Z. D034 to D039 replaced the lexical classifier with source-bound judgments.
11. **[VER-005](../../verifications/WO-123/VER-005.md)** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh): pass at 20:55:24Z (D040).
12. **This review** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh): dispatched 21:20:52Z, checkpoint 21. D041 to D045.

## Executed checks

Every probe outside the gates was read-only or ran under `node scripts/harness.mjs bounded`, one at a time. Transcripts are in this session's DotLn scratch and under `.runtime/wo123/final-review-012/` and `final-review-013/`.

- **State:** `resume status --json`, `harness writer --show`, usage at entry and handoff, `git fetch origin main` and the base comparison.
- **Identity and hashes:** report hashes against the control events; `gateCodeIdentity` before each gate; the README edit after the gate left the identity at `84b33b5d…`.
- **Integration:** the four edition checks at 010 (stale) and 011 (pass), console fixtures, `harness check`, `publication:check`, `release check-surfaces --local`, and the integrated gate.
- **Defect reproductions:** the duplicate-draft probe in both entries, and the old-transport launch probe. The reviewers' probes are named in D043.
- **Fix checks:** focused runs of 5, 17 and 18 related cases; regenerations 012 and 013; the gates at `84b33b5d…` and `b917af6d…`.
- **Document gate:** the first `npm run test:docs` failed on product 07's ceiling and on Prettier formatting of the suite, which D045 resolved. The second failed on the engineer edition's stale publication lock after the condensed 07 section, which was refreshed. The third passed 29 of 29.
- **Register:** the touching listing, `--show` for the allocated row, the `authority.json` byte share, and the `--apply` batch.
- **Clean room:** a search of this order's new evidence, reports and new sources for home paths, host temporary paths and private identifiers found none.

## Observations with no finding

- **A pre-existing reopen candidate.** `npm run meta` reports `REOPEN WO-150-D003` on executor cold-start bytes. This order leaves every role unchanged, so it is not this order's to act on.
- **One release-surface rerun.** Regeneration 013's last check refused the first draft of the release notes, whose angle-bracket placeholders read as raw HTML. The corrected notes passed on the recorded rerun; no source or edition changed.
- **Low items the third reviewer read and did not reproduce.** Two git calls separate the readable check from the origin read, so a target that vanishes between them would be held rather than retried. A restart against a target that cannot be read now gets the transient refusal before it resumes. Both are within the stated rules; the reason text is in D044's follow-up.

## Publication

The verdict is pass, so this review prepares [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md), records `final-review-result pass`, commits the reviewed state and runs `npm run worktree -- publish WO-123` with that title and body. It does not merge, push `main` or publish a release.
