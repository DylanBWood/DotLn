# WO-115 FINAL-003 — final review

**Verdict:** pass. This is the second final review of WO-115, over the tree that [FINAL-002](FINAL-002.md) passed plus the lifecycle repair the operator directed afterwards ([D026](../../evidence/WO-115/decisions.md#wo-115-d026--repair-the-gate-identity-and-bind-a-product-gate-by-correction-at-the-operators-direction)). FINAL-002 judged the console parity contract, the loopback, the clients, the receipts and the write-backs on evidence that stands unchanged: every console source is byte-identical to the bytes it and VER-005 judged. What is new is the repair: the documentation-marked READMEs leave the product gate's code identity, and a recorded passing final review that carries no product gate can bind one, once, on exactly the bytes its pass recorded. An adversarial read and an independent verification by a second model shaped the repair's final form, [VER-006](../../verifications/WO-115/VER-006.md) judged the whole tree pass on all five criteria and on the repair claims, with one low fold finding deferred as D026's named follow-up, and this review's own gate passed at the tree's code identity and is carried by the pass it records. I found no defect requiring repair.

**Subject:** [`docs/work-orders/WO-115-console-parity-contract.md`](../../work-orders/WO-115-console-parity-contract.md) on branch `wo-115`, re-activated from `closed` on 2026-09-26 because FINAL-002's pass predates the repair; HEAD `13f09a1e` over `main` `f73b7e18`, which after `git fetch origin` is still `origin/main`. The reviewed bytes are the eight commits above `main`: the five FINAL-002 reviewed, the repair, the regenerated harness surfaces with authority edition `WO-115/003`, and the records. Code identity, computed here with `gateCodeIdentity`, is `81d0244ca535c662f94ac4b0e418debd6ff50935686227a7af36e6d639586518`; the console sources are byte-identical to checkpoint 22, VER-005's subject.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.283","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator, after the publish helper refused the FINAL-002 branch, directed in this session that the defect be fixed permanently in this branch, that an adversarial reviewer and a verifier be spawned, and that the result be a pull request ready to merge with no rule beating and no gotchas for release close or a later order. This session wrote the repair, spawned one adversarial and two verifying Opus 5.5 subagents in total (3 of the cap of 20, exact-observed), and recorded every transition. Effort `xhigh` is the host's `CLAUDE_EFFORT` value: selected, not effective.

**Process cost:** entry 86292 tokens; handoff 60176189 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage a960084a-b043-4b56-b5ba-1b37335e2de7`; the entry reading is the one FINAL-002 recorded at 2026-09-26T15:05:14.684Z, because this session's dispatch spans both reviews, and the handoff reading was observed at 2026-09-26T17:03:42.703Z (349 steps, 253 commands) after this judgment was complete. Reasoning tokens and dollar cost are unavailable, which means unknown, not zero. The three subagents' tokens are theirs, not in this counter.

## Goal-aligned judgment

The order's goal is unchanged from FINAL-002. The repair's goal is that a passing review never becomes a dead end at publication and that a README edit never locks a release, without the gate binding anything but the judged bytes.

- **Rule beating** is the lens that mattered. The first draft of the repair let a correction bind any passing gate at the current tree, which would have let this very branch tie FINAL-002's verdict to seven source files it never judged; the adversarial read caught it. The final rule binds only a row on the bytes the pass recorded in its checkpoint, still the working tree, once, and this order took a fresh cycle rather than the shortcut.
- **Seeking the wrong goal:** a blanket README exclusion would have dropped the kernel README that the kernel suite reads; the identity now excludes only paths Git marks `dotln-documentation`, and the marked four are read by no suite.
- **Shifting the burden:** the recovery no longer needs the operator; `closed` admits exactly one correction, and `activate` from `closed` is the route when a subject changes after its pass.
- **Policy resistance:** the result transition is unchanged; it still records a pass without a gate when none matches, as product 07 requires, and the repair route makes that state repairable instead of terminal.
- **Commons, escalation, success to the successful, drift, Naive Interventionism, NoOp:** one attribute, one filter clause, one correctable field with its refusals, three fixture changes and one product paragraph; no new gate or approval; the override the machinery already had was rejected in favor of the durable route; deadlines and assertions untouched; doing nothing would leave every order one README sentence from the same refusal.

## Criteria

- **Criterion 1:** met. FINAL-002's evidence stands: the console sources are byte-identical, the console suite passed inside this review's gate, and the real-binary probe FINAL-002 recorded needs no repeat. VER-006 confirmed the console sources byte-identical to checkpoint 22 and ran the console suite itself (5 of 5).
- **Criterion 2:** met. Unchanged sources, the refusal fixtures passed inside this review's gate; VER-006 confirmed the refusal fixtures ran on unchanged sources.
- **Criterion 3:** met. Unchanged sources, receipts and replay passed inside this review's gate; VER-006 confirmed replay reads receipts and reruns nothing on unchanged sources.
- **Criterion 4:** met. FINAL-002's write-backs stand; product 07 gains the identity and correction rules, the generated role skills are unchanged because a shared role edit takes a new pinned role baseline this repair does not add, the publication lock is current, and D026 records the repair with its alternatives and reopening condition. `npm run publication:check` passes.
- **Criterion 5:** met. `npm test -- --review` passed on the subject (**39 suites, 0 failed, 598.78 s, 83 fresh tasks, exit 0**; see Checks). `git diff --check` is clean, no suppression was added, and the manifests and lockfile are as FINAL-002 judged: no dependency.

## The repair, judged

- **Identity.** `gateCodeIdentity` excludes paths Git marks `dotln-documentation`; `.gitattributes` marks the compiler, console, skeleton and corpus READMEs; the kernel README stays unmarked because `packages/kernel/test/ac7-readme-map.test.ts` reads it. The runner test pins a marked README as excluded and an unmarked README and a Markdown input as counted.
- **Binding.** `resume correct --set productGate=<evidenceRef>` is the only correction legal in `closed`; it refuses a missing, failing or partial row, a row whose identity differs from the pass's checkpoint identity, a working tree that moved since, a non-review subject, a review that already carries a gate, and a repeat; the event carries the whole row; the fold refuses an invalid row, a mismatched reference and a non-review subject; a correction in `closed` leaves the close ordinal alone. `reviewedProductGate` reads the latest bound row from committed history and still refuses a row whose identity differs from the published revision. The off-ramps fixture now tracks its scripts so its working-tree and checkpoint identities agree, and it exercises every refusal above.
- **Deferred, boarded.** VER-006 found the fold checks a binding's declared subject type but not the event at that ordinal; `resume correct` cannot write such an event and `reviewedProductGate` ignores it, so publication is unaffected. D026 carries the named follow-up. The stale comment at the head of the off-ramps fixture's closed-order block is left for that follow-up, because a comment edit would move the gate key again.
- **Not exercised end to end:** a `release close` on a merged `main` with a bound row; it is traced in code by both agents and VER-006. WO-115's own history carries no correction event, and the notes tell the operator to update `main` before the first `release close` after this lands.

## Verification sequence

FINAL-002 records the first sequence (VER-001 to VER-005 and FINAL-001). After FINAL-002's pass: the publish helper refused for want of a product gate on the pass event (D025's corrections); the operator directed the repair (D026); an adversarial Opus 5.5 read found the binding loophole, the kernel README input, the closed-phase side effects and the shared evidence reference, and an Opus 5.5 verification probed the fold, the binding and the committed-history read; both are repaired in the committed form. The order was re-activated from `closed`; VER-006 (Opus 5.5, a subagent of this session at the operator's direction) judged the whole tree pass on all five criteria and on the repair claims, with one low fold finding deferred as D026's named follow-up; this review ran the review gate and records the pass.

## Checks

| Check | Result |
| --- | --- |
| `git fetch origin`; `git log HEAD..origin/main` | empty; `origin/main` = `main` = `f73b7e18` |
| Console sources vs checkpoint 22 | byte-identical |
| `node --test scripts/test-runner.test.mjs` | 41 passed, 0 failed |
| `npm test -- --only resume` (build and resume suites, including the off-ramps fixture) | 2 passed, 0 failed |
| `node scripts/harness.mjs check` | 31 generated surfaces |
| `node scripts/authority-evidence.mjs --check` (edition `WO-115/003`) | verified; 34 bundle comparisons |
| `node scripts/feedback-evidence.mjs --check` | retained live audit `WO-070/feedback-001`; judged behavior unchanged |
| `npm run publication:check` | PASS; both editions CURRENT |
| `npm test -- --review` (Claude Code shell; no confinement in force) | **39 passed, 0 failed, 598.78 s, 83 fresh tasks, exit 0**, recorded 2026-09-26T16:56:22.882Z; tree `02f60c7e…`, code identity `81d0244c…`; the row’s sandbox field reads marker `claude-code`, probe written, `inForce: false`, so the full selection ran: the 28 product suites plus the eleven machinery suites whose declared sources changed since the base, among them `runner-fixtures`, `process-debt`, `harness-fixtures`, `harness`, `registrations` and the four edition checks; an earlier review gate over the repair (598 s) failed `beacon-portability` and `process-debt` on two reviewer slips since reverted |
| `git diff --check`; `git diff --check --cached` | clean |
| `npm run test:docs` after this report | **13 passed; 8 failed; 7.20 s; 14 fresh tasks** on the first run, before this cell was filled; the rerun after filling it precedes the result transition and is reported in the handoff response |

## Handoff

Result: `final-review-result pass`. This review commits the records, pushes `wo-115` and opens its pull request. It merges nothing and publishes no release, tag or package. After merge, update `main` before `release close`.
