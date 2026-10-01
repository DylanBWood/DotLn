# WO-181 — FINAL-001

**Verdict:** pass. All seven criteria are met against the original order and the operator's D008 scope expansion. The evidence is VER-001's probes, my own reading of the full diff, one probe of my own and a fresh product gate on the integrated tree. `main` had moved to WO-103 and WO-102 (`v0.60.2`, `v0.60.3`), so I integrated it. Upstream changed nothing under `packages/`, `scripts/` or `.claude/`, so every judgment carries forward and `v0.61.0` stays the target. I concur with VER-001's D012 and board three further seams for the composition in [D014](../../evidence/WO-181/decisions.md#wo-181-d014--final-review-pass-and-three-seams-the-composition-inherits). The one that matters most: a capable behavior verifier can stop the stream before the review runs, which is what the two failed Claude attempts recorded.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.286","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 89260 tokens; handoff 24445658 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-181 and allocated this path. The actor values are this session's:
- Claude Code 2.1.286, from `claude --version`.
- Model `claude-fable-5-1`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Cost scope is this dispatch, read with `node scripts/harness.mjs usage 9156f466-c8ca-4a07-abaf-263a26c7054b`. The entry sample was observed at 2026-10-01T16:38:54.786Z and the handoff sample at 2026-10-01T17:04:51.959Z (133 steps, 85 commands), before this report was filed. Both are cumulative transcript counters; 24,008,749 of the handoff total is cached input. Reasoning tokens and dollar cost were unavailable. The largest wall-clock cost was the product gate (893.41 s). Fan-out plan: no subagents out of the 20 available; the harness observed 0 admissions, and the root was the only writer.

## Subject and evidence

The verified subject is the uncommitted worktree over base `2f52501450b55abdb03386352bb651909bb2e134`. The numbered verification sequence is complete: [VER-001](../../verifications/WO-181/VER-001.md) passed, and no repair followed. The report hashes to the control log's `reportHash` (`7b7d283f…`). Between VER-001's checkpoint `refs/dotln/checkpoint/WO-181/3` and this dispatch's `/5`, only the report, the control log, D012, `current.md`, the decisions index, the register and the work-order index changed. A temporary-index comparison of the whole worktree, untracked files included, against `/5` named only `current.md`, the control log and the work-order index.

Scope expansion. No ideation breakout receipt applies; the evidence folder holds none. The order's text did change after filing: the operator expanded it during execution, and the executor recorded both operator messages in [D008](../../evidence/WO-181/decisions.md#wo-181-d008--operator-expansion-prepare-future-worktrees) and bound the amended order with `npm run plan -- amend-order` (the `PlanExecutionAmended` row for WO-181-D008 in `docs/control/plan-refutations.jsonl`). `npm run plan -- check` exits 0 on the integrated tree. I judged the order as amended: its paragraph of bounded surfaces and criterion 7.

Integration. `origin` and local `main` named `0ffccab4`, six commits past the executor's base, and origin's newest tag is `v0.60.3`. `git diff --stat 2f525014 0ffccab4` touches 62 files: `corpus/` fixtures, harness and manifests, the WO-102 and WO-103 records, `README.md`'s release line and generated projections. `npm run worktree -- integrate WO-181`:
- first refused 46 intent-to-add entries before writing anything, as product 07 describes; I staged them with `git add` as its message directs, which also stages the order's new source files for the gate;
- then checkpointed `/6`, retained the include-untracked stash `83271bec` (`WO-181 integrate 2026-10-01`), fast-forwarded the uncommitted branch with no authored conflict and regenerated the projections;
- left `v0.61.0` current. Compiler 0.22.0 and skeleton 0.49.0 do not collide: upstream left both at 0.21.0 and 0.48.0.

`docs/intake/` holds no ignored file, so no intake backup was needed. After integration, `git diff refs/dotln/checkpoint/WO-181/5 -- packages scripts package.json package-lock.json .claude` is empty, so the integrated source is the bytes VER-001 judged. [D013](../../evidence/WO-181/decisions.md#wo-181-d013) records both bases and the carried-forward claims.

I reviewed:
- the order as amended and its cited sources: product 03 §VerificationAdapter and §DeliveryAdapter, product 06's vertical, product 07 §Goal-aligned decisions and §Independent workflows and integration, product 08 §PRs and commits and §Release-note edition;
- the handoff, the evidence README, `fixture.mjs`, `bootstrap-proof.mjs`, the final live receipts and the two stop records, the bootstrap receipt and D001–D012;
- the full diff:
  - `packages/skeleton/src/review.ts` (new): the review context and its validation, the reference set, finding admission, `ReviewCompleted` construction and `routeReview`;
  - the protocol's review branch in `parseEvidenceResult`, `evidenceResultSchema`, `validateTransportRequest` and `transportPrompt`;
  - the reactor's opening check, review dispatch, review result branch and `ReviewCompleted` fold, and the state types moved to `verification.ts`;
  - the host's recovery branch, `persistNext`'s stop at `reviewed` and the worker store's saved-receipt context;
  - `deriveRepairOrder`'s `independent-review` witness and the compiler's `VerificationFinding` union and `copyFinding`;
  - `review.test.ts` and the adjusted `repair.test.ts` and `scenario.test.ts` cases;
  - `scripts/bootstrap.mjs`, its two new `test-process-debt.mjs` cases and the `worktree start` call site;
  - the product 03 and 07 edits, the browser-evidence README, the map rows and the generated harness, edition, console and publication-lock changes.

The diff matches the order's design. The review reuses the sealed host, so snapshot preflight, leases, fresh-episode admission and recovery are the checked ones. The reducer, not the actor, builds `ReviewCompleted`: the fold accepts the event only when its payload equals the one the reactor constructed from the admitted result, and it must follow that result. Review findings never touch acceptance rows, and repair derivation refuses a review finding without its host review record. The driver decides before it appends, so a refused dispatch writes no event.

Clean-room screen: I searched the tracked diff, VER-001, the control log and then this review's own files for user paths, account identities, private hosts and secret shapes. The only match is the fixture's own privacy-screen pattern. Beyond the lockfile's public registry URLs, the added URLs are the public Playwright documentation, a package project page inside a pinned lockfile copy and the loopback address the bootstrap proof uses as an unreachable download host. D008 quotes the operator's two scope-expansion messages verbatim as its authorization. No lint or type suppression directive was added in source, tests or fixtures; the new test's `any` annotations on fixture values are not directives.

## Criteria

**Criterion 1:** met. `WO-181 AC1` builds on WO-056's repository with a behavior-correct candidate that declares a local `TOTAL` against `CONVENTIONS.md` and adds an unrequested README line. It asserts two blocking findings whose `expected` holds each rule, verified behavior rows left unchanged, three distinct reviewer, verifier and implementer identities, a replay equal to the live state and an unchanged snapshot digest. The test's reviewer is a process double; the live rows of criterion 4 reproduce both findings with real reviewers. VER-001's probe R1 showed the review prompt carries no commit message or implementer narrative.

**Criterion 2:** met. `WO-181 AC2` refuses `edits`, `patch`, `diff`, `files` and `replacements` with `review cannot return edits or diff`, checked before the closed-shape rule so the reason is named. It also refuses a behavior verdict, a foreign severity, a missing class, a missing rule reference, a foreign path, an extra finding key and a reused verifier or implementer identity. VER-001's probe R3 extended this to the envelope, the kind and the subject. My probe covered the opposite direction: on the behavior path a `class: review` finding and a `nit` severity are both refused, so the two finding classes cannot cross.

**Criterion 3:** met. `WO-181 AC3` routes the blocking convention finding through the real `RepairHost`: launches `repairer` then `verifier`, status `complete`, the original criteria and tests, surfaces `["sum.mjs"]` and no grants. `should` and `nit` become `knownItems`, and a minor-only review returns `DeliverableKnownItems` with no launch. A scope finding outside the original surfaces returns `NeedsHuman` (`path outside original surfaces`), and VER-001's probe R6 showed a `should` finding handed straight to `deriveRepairOrder` is refused. The composition is a fixture double of WO-123's sequence, as the criterion asks.

**Criterion 4:** met. [codex-live-002](../../evidence/WO-181/codex-live-002.json) (Codex CLI 0.159.3, launch `gpt-6.1-sol`/`max`) and [claude-live-004](../../evidence/WO-181/claude-live-004.json) (Claude Code 2.1.286, launch `claude-opus-5-5`/`xhigh` as reviewer, after a live Codex verifier) both read `status: passed` and `pendingRow: null`. Each `ReviewCompleted` has two blocking findings carrying the two rules, reviewer `ep_review_2_attempt_1`, verifier `ep_verifier_1_attempt_1` and implementer `ep_synthetic_implementer`, with `snapshotUnchanged: true`. I recomputed SHA-256 over the ten runtime sources each receipt names: 10 of 10 match the integrated files in both. Two limits apply. Independence is evidenced by host-assigned episode identities on separate fresh processes, as WO-056 evidences it; native harness session identifiers are not recorded. And the Claude row's verifier is Codex, because Claude verifier attempts 002 and 003 asked for human attention before review (D005, D006). The criterion asks for each harness as reviewer in a session distinct from the verifier's and the implementer's, which both rows show; the interaction itself is boarded in D014.

**Criterion 5:** met. Product 03 §VerificationAdapter's separate-episodes sentence is replaced in place by one sentence. Its five source lines are 369 bytes with indentation and newlines (VER-001 measured 366 for the sentence alone), within 400, and the file grows from 173,954 to 174,053 bytes. `decisions.md` holds D001–D014 and the decisions index lists them. WO-123's map row names the step: sequence independent review after passing behavior verification, route blocking findings to bounded repair and re-verification, and carry should/nit as WO-182 known items.

**Criterion 6:** met. This review's `npm test -- --review` passed 40 of 40 on the integrated tree (see Executed checks). `npm run test:docs` passes with the final-review records in place. `git diff --check` is clean. The manifests and lockfile change only compiler 0.21.0 to 0.22.0, skeleton 0.48.0 to 0.49.0 and the exact internal pins, so no dependency was added.

**Criterion 7:** met. `worktree start` runs the target checkout's `scripts/bootstrap.mjs` and throws before the launch handoff on a nonzero exit. Bootstrap runs `install chromium --only-shell` through the checkout's own Playwright CLI after `npm ci` and before the build, with `PLAYWRIGHT_BROWSERS_PATH ?? <root>/.runtime/playwright`, the same selection as the browser suite, and `INIT_CWD` set to the new root. The two new cases assert the order of steps, the default and four explicit cache selections, and refusal before build and hooks when the install fails. [bootstrap-live-001](../../evidence/WO-181/bootstrap-live-001.json) records a cold download, a cached retry with the download host unreachable and an explicit cache in a second worktree, each launching Chromium 153.0.8010.12; its bootstrap and lockfile hashes match the integrated files. VER-001 ran a real failure (exit 1, no readiness, no build) and an offline retry. Nothing in the diff touches an existing worktree.

## Catalog-row duties and boarded seams

The order's map row carries two Receipt 036 duties that no executor record discharges: what the composition does when the review episode fails or times out, and the reviewer consuming WO-124's derived surfaces. VER-001 reproduced the first (the command stays pending, no `ReviewCompleted`) and boarded both in D012 with follow-ups to WO-123 and WO-124. I concur: neither is a declared criterion, and both belong to orders that have not landed.

D014 boards three more, with one follow-up for planning before WO-123 activates:
1. **Observed: the verifier can pre-empt the review.** Claude attempts 002 and 003 passed both criteria, named the two planted defects as out of scope and asked for human attention, so the host held the stream and never dispatched the reviewer. The verifier's instruction names no later review. Changing what the verifier may hold is this order's non-goal, so the composition must decide it; a fixture with a double verifier would never show it.
2. **Observed: the reactor has 345 characters of headroom.** `reactor.ts` is 99,655 characters against the audit capsule's 100,000-character file bound after D004's move. The next order that edits it meets D004's refusal before any model launch.
3. **Inferred from source, not executed.** A review-enabled stream that applies an in-stream repair touching only some criteria's surfaces would leave the others verified at the earlier revision, and the review dispatch then throws before any event is appended. It fails closed, and no shipped caller reaches it: review needs a snapshot subject, and the only driver of in-stream repair application opens neither a snapshot subject nor a review.

## Register

`npm run plan -- followups --touching --work-order WO-181` matched 22 pending rows at register revision `b3c263ae…`.

| Rows | Matched | Disposition | Reason |
| --- | --- | --- | --- |
| FUP-f12a1f894923b2b2 | `reactor.ts` | kept open, observation added | Third occurrence of its seam: WO-181 edited `reactor.ts` and paid a live feedback audit, and the executor neither took the three items nor recorded them as left. The row now also names the 345-character headroom. |
| FUP-a07f6c1c479e80db | `scenario.test.ts` | opened | Its condition occurred: the reactor imports a new module, `review.ts`. The named allowlist was extended (D007); whether a transitive purity check passes is still unknown. |
| FUP-cd891042364d172a | not listed; created by D008's reopening | settled | WO-059-D023's manual browser setup is replaced by criterion 7. |
| FUP-005a8af5234cb3f3 | `verification-protocol.ts` | left | Its condition needs two of the five protocol files; WO-181 touches one. |
| FUP-5d191eb1b77b3431 | `reactor.ts` | left | None of its four conditions occurred. The two stopped Claude attempts were attention requests on passing rows, not a finding the verifier could not express. |
| FUP-e821aa2ced3aa111 | `feedback-audit.ts` | left | WO-181 adds one path to the feedback source list and opens none of the named consumers. |
| FUP-757da8687d847eab | `verification-protocol.ts` | left | The review schema is a separate branch; the evaluation `claimType` enum is unchanged. |
| FUP-3a0ac2cbb53c255e, FUP-71a27b368d93f135 | `reactor.ts`, compiler `verification.ts` | left | No planning pass accepted the re-keying, and the compiler change is the finding type only. |
| FUP-adf6621e7f958dd8 | authority copies, product 03 | left | `scripts/authority-evidence.mjs` is untouched. Whole-file duplicate `authority.json` copies are 5,702,700 of 162,684,897 tracked evidence bytes, 3.51%, below 10%. |
| FUP-57ecd19a26362b1c, FUP-a8ff3066b5663629 | WO-181 | left untriaged | D012's and WO-180-D013's follow-ups for WO-123 and WO-124; planning routes them. |
| The other eleven | generated, evidence, product or map files | left | Textual matches only. |

`npm run meta` then synced D013 and D014 (a new untriaged row, FUP-06e91517600ce7a7, carries D014's follow-up), giving register `12be34cd…`. One `npm run plan -- followups --apply` batch of the first three rows against that revision produced `324373ef…`.

## Executed checks

- Integration: `npm run worktree -- integrate WO-181`. Bases `2f525014` → `0ffccab4`, checkpoint `/6`, stash `83271bec`, no authored conflicts.
- Printed affected checks on the integrated tree:
  - `node scripts/harness.mjs check`: 31 generated surfaces.
  - `npm run publication:check`: index coverage 253 of 253, both tables of contents current.
  - `npm run release -- check-surfaces --local`: exit 0.
- Final product row: `npm test -- --review`, recorded 2026-10-01T16:57:03.147Z, after the order's new files were staged.
  - 40 passed, 0 failed, 893.41 s, 85 fresh tasks.
  - Code identity `2022b44f5f607d8f5bfc760285930c9e88bee7a0178df7045c60b90520bf069c`.
  - The row covers `skeleton` (365.00 s), `harness-fixtures` (326.04 s), `worktree-integration` (298.94 s), `process-debt` (122.55 s, which runs `scripts/test-process-debt.mjs` and its bootstrap cases), `evidence-sources` (66.68 s), `browser-evidence` (17.98 s), `console` (18.23 s), `kernel`, `compiler` and the edition and release suites.
- `npm run test:docs`: 24 passed, 0 failed, 35.88 s, 24 fresh tasks, with this report, PR.md, RELEASE-NOTES.md, D013 and D014 in place; `skeleton-docs` passed in 21.29 s. The result transition runs it again inline.
- `node --test packages/skeleton/dist/test/review.test.js` on the output the gate built: the nine review cases, 9 of 9, 6.86 s.
- Receipt check: SHA-256 of the ten runtime sources named by `codex-live-002.json` and `claude-live-004.json`, 10 of 10 matching in each; `bootstrap-live-001.json`'s bootstrap and lockfile hashes match.
- Reviewer probe, in DotLn session scratch against the gate-built `dist` and `fixture.mjs`: on the behavior path, `class: review` with a behavior severity and with `should` are refused (`finding shape or duplicate`), `nit` without the class is refused (`finding shape`), and the unmodified result is admitted.
- Subject check: a temporary-index diff of the whole worktree against `refs/dotln/checkpoint/WO-181/5` before integration, and `git diff` of the source paths against it afterwards.
- `npm run plan -- check`: exit 0. `npm run meta`: D013 and D014 indexed; health line `no observed budget breach; … 1 reopen candidates` (WO-150-D003, as at earlier closes).
- `npm run plan -- followups --apply`: three rows, register `12be34cd…` to `324373ef…`.
- `npm run release -- prepare`: against origin's tags, the `v0.61.0` target remains current; it refreshed the meter snapshot and the PR's meter block.
- `git diff --check` and `git diff --cached --check`: clean.

Not re-run: the live rows (validated by hash, not repeated; a rerun writes new receipts into the executor's evidence) and the cold default-cache browser download (evidenced by the executor's receipt, whose bootstrap hash matches).

## Judgment and publication

D013 and D014 compare their choices with the mission, the eight system traps, Naive Interventionism and NoOp. Against the promised benefit, the observed outcome is:
- A second judge now exists for the delivery vertical to sequence. In both live rows it found the scope and convention defects that passing tests do not judge, wrote nothing and left acceptance rows alone.
- Only blocking findings can start a repair, and a scope finding cannot widen repair authority; minor findings are carried, never applied.
- A newly created worktree prepares its own browser before the launch handoff, which removes the manual step the operator reported meeting in every order.
- The cost was two final live review rows (106.65 s and 43.43 s), one live feedback audit after the judged-source change, and this review's product gate.

No efficiency gain is claimed for the review itself. The tradeoff in this review: I spent one product gate (893.41 s) because integration changed the code identity, and I relied on VER-001's seven review probes and its real bootstrap failure run, repeating only the hash checks and adding one admission probe it had not run.

Reviewed PR title: `:monocle_face: Review a verified candidate in a separate read-only episode, so scope and convention defects are found before delivery`. The [gitmoji catalog](https://gitmoji.dev/) describes that shortcode as data exploration and inspection, and the change's main purpose is an independent inspection of the candidate. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state the limits. A pass authorizes committing this reviewed state, pushing only `wo-181` and opening its PR. The helper supplies the post-merge release-close handoff.
