# WO-058 — FINAL-001

**Verdict:** pass. All seven criteria are met against the original order, and I accept `verification-v1` for operator-review assumption 1. The review staged the three new source files that the earlier gate identity excluded and ran a fresh product gate at the staged identity. It settled one follow-up row whose condition this order met and boarded one low-severity, pre-existing schema gap ([D010](../../evidence/WO-058/decisions.md#wo-058-d010)).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.285","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 86365 tokens; handoff 11964356 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-058 and allocated this path. The actor values are this session's: Claude Code 2.1.285 (`claude --version`), model `claude-opus-5-5`, and effort `xhigh` read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer. Cost scope is this dispatch. The entry sample was taken at 2026-09-30T17:55:02.207Z and the handoff sample at 2026-09-30T18:11:13.633Z, before this report was filed. These are cumulative transcript counters, mostly cached input (11,747,637 of the handoff total). Reasoning tokens and dollar cost were unavailable.

Fan-out plan: no subagents out of the 20 available. The harness observed 0 admissions, and the root was the only writer.

## Subject, integration and evidence

The subject is the working tree over base `dd141ad16dbd60e39ffb5afab21df57689cf4b79`. At this review, `git ls-remote origin refs/heads/main`, `origin/main` and local `main` all read `dd141ad1`, so no integration ran. No version collided: tags end at v0.57.0, and the order's target is v0.58.0 (D003).

The numbered verification sequence is complete: [VER-001](../../verifications/WO-058/VER-001.md) passed all seven criteria. Its SHA-256 recomputes to the `reportHash` in the control log (`c53c90bb…0494`). At dispatch, every authored file had the same blob as the verifier's subject checkpoint `refs/dotln/checkpoint/WO-058/3`. The only differences were VER-001 itself, the control log and the generated projections.

No ideation breakout receipt applies. The evidence folder holds none, and the control log records no scope expansion or amendment after activation. The order's 2026-09-28 amendment is a planning-pass amendment made before activation, and I judged the order as amended.

I reviewed:

- the order; its cited sections of products 02 and 10; WO-154 D011 and WO-162 D012; and product 07's goal-alignment and ideation-receipt sections;
- the executor's handoff, README and decisions D001–D009;
- the full diff of `packages/compiler/src/verification.ts`, `packages/skeleton/src/verification-protocol.ts` and the version constant;
- both new `verification-witness.test.ts` suites and `packages/compiler/fixtures/wo058-verification.json`;
- the diffs of products 02 and 10, the package manifests and lock, `docs/evidence/current.json`, the re-emitted harness (which changes only hashes, snapshot paths and release labels) and the console re-pin.

A clean-room screen of every new file and both product documents found no user path, session scratch path, account identity or secret shape. The only URLs are the public npm registry, Prettier's public repository and the reserved `example.test` host in the fixture. The only absolute paths are the fixtures' synthetic `/fixture/repository`, `/relocated/repository` and `/synthetic-mount`.

## Criteria

**Criterion 1:** met — `parseEvidenceResult` refuses a visual `pass` unless the cited evidence includes a passing `screenshot` (`visual pass requires screenshot`). At decode, `copyWitness` requires the screenshot's `criterionId` to equal its evidence item's, and admission's `claim-typed evidence` rule requires every cited item to belong to the criterion. Skeleton `WO-058 AC1` shows a refusal for DOM and accessibility evidence only, with rows unchanged. It also shows `unverified` admitted as `incomplete`, the screenshot case admitted as `verified`, and a pass that omits the screenshot refused. The existing rules still run after the new check; VER-001's probe of an uncited failing DOM witness beside the screenshot was refused as `contradictory witness`.

**Criterion 2:** met — The same structure applies to network criteria and a passing `network-trace` (`network pass requires trace`). `WO-058 AC2` covers the refusal, the admitted `unverified`, the verified trace, an omitted trace and a trace bound to another criterion (`claim-typed evidence`). The unavailable-witness test refuses an `unavailable` trace as `unsupported pass`.

**Criterion 3:** met — The console rule runs before `unsupported pass` and scans the whole subject, not just cited evidence. It matches entries for the criterion on one of its required checks that hold an error, so an omitted capture still refuses. At decode, a capture holding an error must have outcome `fail`. That makes it a failing witness, and a cited `fail` passes `unsupported failure`. `WO-058 AC3` binds one capture to each of the two fixture criteria. It refuses a pass whether or not the captures are cited and admits a `fail` that cites them, and both rows become `failed` with `host-admitted-verifier` provenance. `CommandResult`, `CriterionVerified` and `EvaluationRecorded` events from the implementer fold to an identical state. Info and warn entries, and an error on an unrequired check, keep the existing behavior.

**Criterion 4:** met — Decode refusals name their paths: an undeclared criterion claim type at `$.criteria[i].claimType`, and a witness kind at `$.subject.evidence[i].witness.kind`. Malformed hashes, fields and extra fields also name their paths. `git diff HEAD --name-only -- '*/test/*'` names only the two added suites, so no existing test changed. The unchanged verification suites, including WO-010's and WO-011's recorded streams and WO-154's release-label replay, pass inside the gate below. The Design's version test holds: no recorded capsule carries a witness, a witness-free item lowers with no `witness` key, and VER-001 re-lowered all 179 recorded capsules to identical bytes. Product 10 records v1 with compiler 0.21.0 and skeleton 0.47.0, and result version 1 is unchanged (D004).

On assumption 1, I accept v1 and do not require v2. This is inference from source: the pre-change `copySubject` returns only named fields, and `assertVerificationTask` compares a re-lowering byte for byte. An older reader therefore refuses a capsule that uses a new claim type (`claim type`) or a witness (`compiled capsule drift`). Keeping the version fails closed rather than misreading.

**Criterion 5:** met — Product 02 grows from 148,729 to 149,450 bytes (+721 ≤ 800; ceiling 150,611). Product 10 shrinks from 25,744 to 25,665 bytes (−79 ≤ 200; ceiling 25,825). Both edits replace text in place with no dated paragraph. Product 02 replaces the deferral sentence, extends the claim-type union and adds one bullet for the witness kinds and rules. It also points the worktree-snapshot profile's sentence at subjects without that profile. Product 10's consolidation keeps the section's contract facts and drops the stale "current artifact evidence is under WO-010" pointer. The decisions file holds D001–D010, the index carries D010, and both publication source locks were refreshed by the executor and pass `npm run test:docs`.

**Criterion 6:** met — `docs/evidence/current.json` selects WO-058 revision 001 for authority, artifact-identity, verification and feedback. The feedback edition records transport `codex-cli-exec`, CLI 0.159.2, `gpt-6.1-sol` at `max`, which is one of the two configurations the order allows, with one attempt (D008). No judged source changed after the episode: this review edited no source, and `feedback-evidence` passed in the gate below. The console change is the three `selfhost` expected outputs and `manifest.json`, which pins `WO-058/feedback-001`, the set WO-162 D012 admits.

**Criterion 7:** met — The final product gate and document gate pass (below). `git diff --check` is clean. The lock diff changes only workspace release labels and exact pins, so no dependency was added. `git diff -- packages/kernel packages/skeleton/src/reactor.ts packages/console/src` is empty.

## Findings and follow-up dispositions

**Gate identity.** The three new source files were untracked. `gateCodeIdentity` keys `git ls-files`, so the executor's and verifier's row at `afb17aaf…` passed with the suites present but did not key them. I staged them, as the review procedure requires, and ran a fresh gate. The staged identity passed, so this is not a defect in the subject.

**Boarded, low severity.** `evidenceResultSchema` gives evaluations a `claimType` enum of all four claim types beside a separate `criterionId` enum. A result that pairs a criterion with another claim type is schema-valid, and admission refuses it as `evaluation criterion`. The gap already existed between `state` and `behavior`. The Design's additive enum members widen it to four values for every capsule, and WO-058's own self-host capsule mixes state and behavior. No live refusal of this shape is observed. Fixing it edits a judged source, which would require another live episode and four re-minted editions under criterion 6. D010's `followup` routes it to the next order that edits `verification-protocol.ts` and re-mints the feedback edition.

`npm run plan -- followups --touching` listed eight pending rows at register `56ca7968…`. One request, [final-review-followup-request.json](../../evidence/WO-058/final-review-followup-request.json), settled one row, and the register moved to `c7b08cce…`. The sync then added D010's follow-up.

| Row | Matched | Disposition | Why |
| --- | --- | --- | --- |
| FUP-c31c7bcab9270f49 (WO-157 D024) | `verification-protocol.ts` | settled | Its condition, an order that edits `evidenceResultSchema`, occurred. The tightening already landed with WO-157 item 16 (`4001a2b7`, 2026-09-24), and that test passes unchanged. The executor's D006 described this but left the disposition to this review. |
| FUP-005a8af5234cb3f3 | `verification-protocol.ts` | left | The condition needs two of the five protocol files; this order touches one. |
| FUP-adf6621e7f958dd8 | the new `authority.json` | left | Repeated `authority.json` copies are 6,624,946 of 158,399,410 evidence bytes (4.18%), below its 10%. `scripts/authority-evidence.mjs` is untouched. |
| FUP-71a27b368d93f135 | `verification.ts` | left | No source-worker profile or named-test launch changed, and the live verifier satisfied its contract in one attempt. |
| FUP-b7a66e7a4fa7ad20 | decisions file | left | No release preparation, integrate helper or history check is edited. |
| FUP-50cda1c03ecd8ea8 | meter snapshot | left | The harness-prune byte-proof writer is untouched. |
| FUP-acfe4bfda716d8fb | `current.md` | left | No usage attribution is touched. |
| FUP-fd05316b6030ef73 | README, product 02, work-order index | left | The product 02 edit is in the verification section, not the writer text. |

The adjacent queue is empty (revision 0). Process meter (`npm run meta`, advisory): no observed budget breach and no reopen candidates.

## Executed checks

- Final product row: `npm test -- --review`, 34 passed, 0 failed, 402.66 s, 78 fresh tasks, at code identity `fd8769db8b505d5f4880b4b2120ce98859be570844c9b763e68c3d553cddfe2a` (recorded 2026-09-30T18:07:49.659Z). The row covers the build, the compiler, skeleton and console suites, and the authority, harness, artifact, verification and feedback evidence suites.
- Focused, run directly after the gate's build: the nine WO-058 tests pass (`node --test` on both built witness suites), and so does `WO-157 item 16`.
- `npm run test:docs` passes with this report in the tree, and completion runs it again inline.
- Also passing: `git diff --check` and my blob, hash, size and share probes.

## Judgment and publication

[D010](../../evidence/WO-058/decisions.md#wo-058-d010) compares this outcome with the mission, all eight system traps, Naive Interventionism and NoOp.

The observed outcome:

- WO-059 has closed, hash-bound witness shapes to produce, and WO-061 has the `visual` claim type.
- A visual or network pass without its witness, or with a bound console error, is refused by the host's existing admission path. No verdict comes from any other source.
- Every recorded capsule still replays byte for byte.

No efficiency gain is claimed. The tradeoff: I spent one extra product gate, about 403 s, so the committed tests are part of the gate's key. I relied on VER-001's probes and 179-capsule re-lowering instead of repeating them, and I did not repeat the live episode.

Reviewed PR title: `:safety_vest: Admit a visual or network pass only with a screenshot or request trace, so browser evidence is checked instead of narrated`. The [gitmoji catalog](https://gitmoji.dev/) assigns that shortcode to code related to validation, and the change's main purpose is admission rules. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state the limits. A pass authorizes committing this reviewed state, pushing only `wo-058` and opening its PR. The helper supplies the post-merge release-close handoff.
