# WO-114 FINAL-001 — final review

**Verdict:** pass. WO-114 gives the always-on resident a live, read-only status view. After every recorded event, the resident rewrites `runtime-status-v1.json` in its store by atomic replacement: configured actors, live episodes, presence and armed cadences, coded holds, portfolio budget, and every Active or Open order's phase, dependency state and verdict from the generated index. `console status --store <dir> [--json | --watch]` renders the file and follows its replacements. The sequence had two verifications. [VER-001](../../verifications/WO-114/VER-001.md) failed the first subject on three major defects: per-event fsync spent the WO-143 test's timing margin, the order section depended on which writer published last, and a projection failure could abort durable resident work. It also found three minor defects. The repair fixed all six. [VER-002](../../verifications/WO-114/VER-002.md) passed all five criteria and reproduced every repair with its own probes. It boarded up two minor edge-input defects (N1, N2) in [D013](../../evidence/WO-114/decisions.md#wo-114-d013--ver-002-pass-two-minor-index-source-hardening-defects-boarded-up) with a named follow-up. `main` has not moved since the base, so there was nothing to integrate. This review read the whole subject diff at source and found no acceptance defect. It confirmed N1 and N2 as bounded and passed the product gate on the staged subject.

**Subject:** [`docs/work-orders/WO-114-runtime-status-projection.md`](../../work-orders/WO-114-runtime-status-projection.md) on branch `wo-114`, uncommitted at dispatch, judged at final-review checkpoint `refs/dotln/checkpoint/WO-114/9` (`875fdbf1`). Base `4b6a19cc50e98a437d35b2adf2d392fbf5b12139` (`v0.46.2`). On 2026-09-24, `git fetch` left `origin/main` at that same commit, local and remote tags both end at `v0.46.2`, and the target stays `v0.47.0` under the declared minor classification. The source, test, schema, product, harness and evidence-edition bytes under review equal repair checkpoint `refs/dotln/checkpoint/WO-114/6`, the subject VER-002 judged. Since then only VER-002's D013 and the dispatch projections have changed. Judged source blobs:

- `packages/skeleton/src/resident-store.ts` `db116456`
- `packages/skeleton/src/runtime-status.ts` `6420df9a`
- `packages/skeleton/src/runtime-status-contract.ts` `10189b4d`
- `packages/skeleton/src/dotln.ts` `b2efc9a5`
- `packages/skeleton/src/presence-machine.ts` `623b1223`
- `packages/skeleton/src/resident-host.ts` `d2dc667b`
- `packages/console/src/runtime-status.ts` `a8528cd2`
- `packages/console/src/cli.ts` `7e6d66a4`
- `packages/console/src/index.ts` `330f9e5d`
- `packages/console/runtime-status-v1.schema.json` `c0e33a00`

The judged tree is the working tree with every WO-114 file staged: tree `16f42ef970eed69c5181ccd0f1ab7b5b7fe2d27c`, code identity `4f8c9e7b6d73b0f2585c26a467f881722d86b3f6767098f74be442fc93a36531`. Nothing was committed, pushed or published before the result transition.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.282","model":"claude-opus-5-5[1m]","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no other choice during the review. The harness version comes from `claude --version`, and the model is the session's selected model. Effort `xhigh` is the host's `CLAUDE_EFFORT` value as this session read it: the selected effort, not the effective one. The order asks for `reviewer any`. The subagent plan was zero of the cap of 20, and none was spawned (`harness usage`: 0, exact-observed). Two reasons: the source change is ten files one reader can hold, and each repair already has two independent reproductions, the executor's and VER-002's own probes. This session ran no provider episode.

**Process cost:** entry 82105 tokens; handoff 13218024 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 4742571e-4b50-4456-957b-5ffac2e57e1a`. The entry reading has cutoff 2026-09-24T23:33:55.639Z. The handoff reading has cutoff 2026-09-24T23:52:25.572Z and was taken after the report's content was final and before the result transition. Both include reused cached input. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero. The largest single wait was the reviewer's product gate: 502,032 ms. Final counters stay in ignored receipts and the handoff response.

## Goal-aligned judgment

The order serves the always-on runtime on the current critical path. The operator can see what the resident is doing and where each order stands without supervising a terminal. WO-115's loopback surface and the operator's Angular consumer read the same versioned file. At the first attempt, the likeliest failure was a view that looks right in the host fixture but lies or interferes elsewhere, and VER-001 found exactly that. Helpers and the harness snapshot projected a different index, a disposable write could abort a durable dispatch, and per-event fsync spent an unrelated test's margin. This review therefore weighed the lenses as follows:

- **Rule beating** was the main lens, because five pinned hashes from one writer could pass while every other writer disagreed. The judgment rests instead on three things read at source: every writer reads the lifetime owner's binding (`resident-store.ts:128-158`), and helper stores built without an index read it too; publication runs after the event's fsync inside a `try` whose failure changes neither the log nor the fold (`resident-store.ts:94-105`, `161-177`); and the transaction publishes once more only when no append published (`resident-store.ts:226`). The same judgment rests on VER-002's replay parity across 12 publications from the host, a helper, the real generated hook and ticks. It also rests on this review's end-to-end probe of the shipped CLI (§Checks).
- **Tragedy of the commons.** The shared gate keeps its margin at an unchanged publication count. VER-002 measured the WO-143 test at +1.6% against HEAD with 777 publications. This review's gate passed with that test's 60 s timeout unchanged.
- **Drift to low performance.** Neither the timeout nor the test changed, and the event log keeps its fsync.
- **Policy resistance.** The private binding is configuration, not a second order truth: the generated index stays the only order source, and an absent binding says `unavailable`.
- **Escalation.** No service, dependency, gate step or scheduler was added.
- **Success to the successful.** The recorded alternatives all lost on evidence: a contract in compiler (D004's fixture coupling), per-helper index arguments (D010), and dropping intermediate publications (D010).
- **Shifting the burden.** Watch recovery and failure containment remove operator rescue. N1's generic refusal still leaves a misconfiguration to diagnose, and the D013 follow-up owns that.
- **Seeking the wrong goal.** Status volume is not the goal; the order claims a truthful projection that cannot stop the resident, and the one remaining gap in that claim is N2's special-file input.
- **Naive Interventionism.** This review changed no source, test, product document or edition. Changing `dotln.ts` or `readIndex` now would ship bytes no verifier judged, and N1 needs a behavior decision (start with orders unavailable, or refuse and name the cause) that D013 assigns to the follow-up's owner.
- **NoOp.** Holding back a verified order over two contrived inputs would delay WO-115 and leave the operator without a live view; meanwhile, both inputs stay recorded with a follow-up.

Judged at handoff, the outcome supports the order's goal.

## Criteria

| Criterion | Judgment and evidence |
| --- | --- |
| 1 — fake-clock projection pinned per tick; identical rebuild after restart | **Met.** The executor fixture's five SHA-256 values match the implementation receipt and passed in this review's gate. Its restart deletes the file and compares the complete rebuilt bytes. The writer-parity fixture replays each of seven publications, from start, a presence helper, the installed snapshot's heartbeat and a clock sample, from its own log prefix. Every one is equal to its replay and retains the derived `WO-999` row, and a restart through a store without an index argument reproduces the last bytes. VER-002 extended the parity check to 12 publications, including two real ticks and the generated hook run as a child process, with 0 mismatches. |
| 2 — the text host renders every section and refreshes on change; board fixtures byte-identical | **Met.** The console fixture renders Actors, Live episodes, Presence with cadences, Holds, Budget and Open work orders. `status --store` output equals the renderer, and `--watch` follows an atomic replacement, deduplicates identical views, and survives deletion, malformed JSON and a `runtime-status-v2` file. This review also rendered a resident-written file from the shipped CLI (§Checks). `node scripts/console-fixtures.mjs --check` matched JSON, terminal and HTML for all five board cases, and `packages/console/fixtures` has no diff. |
| 3 — no physical path, session id or host name in the projection | **Met.** The fixtures assert the absence of the store path, the command, working-directory, endpoint, session and host fields, and the synthetic heartbeat session id. The projector copies no raw payload or actor specification: it allowlists fields, accepts order ids only as `WO-NNN` and launch claims only through a restricted pattern that rejects UUID shapes (`runtime-status.ts:8-14`), and reduces holds to coded reasons. VER-002 scanned 12 publications. This review's CLI probe, with the store under a `/var/folders` path, found no path, host name, user name or UUID in the file or the render. The absolute index path lives only in the private 0600 binding file beside the event log. |
| 4 — write-backs: 04 §Plural UI hosts (the contract), console README, ledger entry | **Met, with the two qualifications D013 records.** Product 04 (`04-interfaces.md:299-318`) and the console README's Live runtime status section describe the contract, the index binding, unsynced atomic replacement, failure containment and watch recovery, and each checked claim matches the code on ordinary inputs. N1 is undocumented: the new CLI refusal on a broken launchpad declaration. N2 qualifies "unreadable index data is visibly unavailable" and "a projection failure cannot abort resident work": both fail for a blocking special file at the index path. The order predates 2026-09-09, so its ledger duty is discharged by D001-D013 and their thirteen decisions-index rows, and the work-order index marks the substitution. |
| 5 — `npm test` green; `git diff --check` clean; no new dependency | **Met.** The reviewer's `npm test -- --review` passed 36 of 36 suites (§Checks). `git diff --check` is clean on the staged subject. Root and package dependencies are unchanged apart from the workspace versions: `package-lock.json` changes only skeleton `0.40.0`, console `0.2.0` and console's skeleton pin. Compiler `0.18.0` and kernel `0.6.0` are untouched. |

The **evidence gate** is satisfied: the fixture transcripts (five pinned hashes, writer parity, CLI binding and failure containment) and one `npm test` at this review. The **non-goals** hold. No command surface was added: the status file grants no action and the console only reads. There is no audit projection and no Angular code. The **declined alternatives** hold as well: there is no network service and no second status source, because orders come only from the generated index.

## Findings and readings

No acceptance defect. The readings below were checked at source, and none changes the subject.

- **VER-002-N1, confirmed and bounded.** `dotln.ts:124-130` resolves `docPath(findLaunchpad(), "workOrders", "README.md")` outside any guard. When `DOTLN_LAUNCHPAD` is unset, `findLaunchpad` falls back to the tool root (`scripts/lib/config.mjs:668-680`) and never throws. The refusal therefore needs an explicitly broken declaration: `DOTLN_LAUNCHPAD` naming a missing directory, or a malformed `dotln.config.json`, which `loadConfig` already refuses by path for other commands. `resident-bind.mjs` selects the same launchpad through the same resolver (`resident-bind.mjs:965`) and prints launch lines that run the tool root's `dotln.js`, not the harness snapshot's. The new import follows the existing kit-owned bridge idiom (`dotln.ts:29-33`). The remaining defect is the one D013 names: the refusal message names no cause, and 04 and the README do not state the refusal.
- **VER-002-N2, confirmed.** `ResidentStore.readIndex` reads the bound path with `readFileSync` and no regular-file check (`resident-store.ts:137`), so a FIFO at that path blocks the first transaction while it holds the append and lifetime locks. A missing file, a directory, malformed text or a removed binding target is contained and publishes orders `unavailable`, as the failure fixture shows.
- **Both defects stay boarded up under D013.** The follow-up is `FUP-4656197433cb8b3d`, "Resident index-source hardening". It covers a guarded launchpad resolution with a named cause or an unavailable start, a regular-file check in `readIndex`, an optional sweep of stale `.runtime-status-*.tmp` files, regressions, and the 04 and README corrections. It also carries D013's reopening of D010 (`FUP-76652a110068a684`). This review adds no decision: it met no defect beyond D013's, and D013 already records the board-up and its owner.
- **The contract's placement is within the order's recommendation.** The order suggested compiler or console and asked the executor to record which. The public JSON Schema is a file in console; skeleton defines the producer type and decoder, which console re-exports. D004 records why compiler was abandoned: its version keys the pinned feedback policy hash, so moving it would change the byte-identical board fixtures. D011 corrects D004's wording. The historical D001 and D003 rows in the decisions index still say "compiler" and "compiler 0.19.0". Those records keep their original wording by rule, and D004's same-day correction is the current reading.
- **The first-start binding is sticky by design.** A later host or helper started without an index path reuses the last bound index, and a store that was never bound reports orders `unavailable`. 04 and the README state this, and the failure fixture's restart relies on it.
- **The snapshot fixture does not depend on local state.** The heartbeat fixture imports `.runtime/harness/<id>`, which the committed hook names and Git ignores. `npm run build` creates that snapshot when it is missing (`scripts/lib/harness.mjs:319-335`), so a fresh checkout's gate does not depend on this worktree's local state.
- **Top-level console usage is unchanged.** It still names only `board`; `status` prints its own usage when misused. VER-001 recorded this as an observation without a finding, and this review agrees.
- **Independence across the sequence.** Implementation ran on Codex CLI 0.156.1 with `gpt-6-sol`, and the repair on Codex CLI 0.156.1 with `gpt-6-astra`. VER-001 ran on Claude Code 2.1.282 with `claude-opus-5-5[1m]` and four read-only review subagents; VER-002 ran on the same model with one. This review ran on the same model as both verifiers, in a fresh session without their context. Every verdict was independent of its implementation actor in harness and model.

## Integration with `main`

None required. `origin/main` equals the base `4b6a19cc` after `git fetch`, and `git log HEAD..origin/main` is empty. No sibling release moved a component version: skeleton `0.39.1` → `0.40.0` and console `0.1.11` → `0.2.0` are this order's, and `release check-surfaces --local` confirms each against the `v0.46.2` tag. The selected editions in `docs/evidence/current.json` are WO-114's own: authority `WO-114/002` and feedback `WO-114/001`. Artifact identity and verification are still `main`'s `WO-154/001`, and the gate's four edition checks pass.

## Verification sequence

1. **Implementation** (Codex CLI 0.156.1, `gpt-6-sol`, `xhigh`, [record](../../evidence/WO-114/implementation.md)): the contract, the per-event writer, the text host and the fixtures. Two gate failures were corrected on the way: the compiler placement broke the pinned board fixtures (D004), and the projector called `evaluateCadence` directly, which WO-016 forbids (D005). The harness was regenerated, and authority and feedback revision 001 were minted after a live verifier episode (D006). `npm test`: 27 suites, 344.96 s.
2. **[VER-001](../../verifications/WO-114/VER-001.md)** (Claude Code 2.1.282, `claude-opus-5-5[1m]`, `xhigh`, subagent mode): fail. It found three major defects: F1, an intermittent WO-143 timeout attributed to 9-14 ms per synced publication across 777 publications; F2, the order section varying with the writer; and F3, a projection failure aborting dispatch, start and presence. It found three minor defects: F4, a watch crash and duplicate renders; F5, a schema/decoder disagreement and record inaccuracies; and F6, bidi controls kept in the render. D008 routed the order to repair, and D009 corrected the report's headline.
3. **Repair** (Codex CLI 0.156.1, `gpt-6-astra`, `xhigh`, [record](../../evidence/WO-114/repair.md)): unsynced atomic status writes, a private index binding read by every writer, the CLI's launchpad index, contained publication, a robust watcher, decoder rules aligned with the schema, and bidi sanitization (D010, D011). WO-143 ran in 32.53 s in isolation. Authority was re-minted as revision 002. `npm test`: 27 suites, 293.52 s (D012).
4. **[VER-002](../../verifications/WO-114/VER-002.md)** (Claude Code 2.1.282, `claude-opus-5-5[1m]`, `xhigh`): pass. It ran its own probes rather than rerunning the executor's triggers: injected `ENOSPC`, `EMFILE` and a read-only directory; the real generated hook as a child process; and 40 back-to-back replacements under `--watch`. WO-143 ran within about 1.6% of HEAD. `npm test` passed twice. N1 and N2 were boarded up in D013.
5. **This review**: the source readings above, the end-to-end CLI probe and the product gate on the staged subject.

## Checks run by the reviewer

- `npm test -- --review` on the staged subject, run normally with no sandbox in force (the gate's `claude-code` sandbox probe wrote, `inForce: false`): **36 suites, 0 failed, 502.03 s, 80 fresh tasks, exit 0, not partial, tree `16f42ef970eed69c5181ccd0f1ab7b5b7fe2d27c`, code identity `4f8c9e7b6d73b0f2585c26a467f881722d86b3f6767098f74be442fc93a36531`, recorded 2026-09-24T23:46:18.888Z**. `--review` added nine machinery suites to the 27 product suites because their declared sources changed. The skeleton suite passed, including the WO-143 thirty-round test and the four WO-114 cases. An earlier launch of this command never started, because the DotLn session scratch directory that received its log did not exist yet. It recorded no row and was rerun once the directory existed.
- End-to-end CLI probe in session scratch, using the gate-built `dist` with `DOTLN_LAUNCHPAD` and `DOTLN_RESIDENT_STORE` unset. It wrote a resident configuration built like the fixture, then ran `dotln presence away --store <store>` (exit 0), `dotln resident --store <store> --policy fixture.progressive --once` (exit 0) and `console status --store <store>` (exit 0). The render showed all six sections, and 54 orders came from this launchpad's generated index, including `WO-114: final-review · dependencies ready · verdict pass`. A grep of the file and the render for `/var/`, `/private/`, `/Users/`, the host name, the user name and UUID shapes found nothing. The store held `runtime-status-v1.json` and `.runtime-status-source.json`, both mode 0600, with no leftover `.tmp` file.
- `git diff --cached --check`: clean.
- `node scripts/console-fixtures.mjs --check`: five cases matched JSON, terminal and HTML.
- `npm run publication:check`: PASS, both editions CURRENT (30 and 45 linked sections).
- `node scripts/harness.mjs check`: 31 generated surfaces.
- `npm run release -- check-surfaces --local`: 44 PASS, 0 FAIL, including release block `v0.47.0`, console `0.2.0` and skeleton `0.40.0` against `v0.46.2`, and the exact workspace pin.
- `npm run plan -- check`: exit 0.
- `npm run test:docs` after this report, the PR body and the release notes were written: **21 passed, 0 failed, 23.56 s**. The first run failed `release-surfaces` because the draft release notes wrote a `<dir>` placeholder, which the GitHub body profile reads as raw HTML. The placeholder was replaced in the notes and the PR body with the README's `.runtime/launchpad` example, and the rerun passed.
- `npm run release -- prepare --local`: `WO-114 target v0.47.0 remains current; no files changed`. It also refreshed the PR body's process meter.
- `npx prettier --check` on every added or modified source, JSON and Markdown file: clean.
- The source diff introduces no lint or type suppression. `packages/compiler`, `packages/kernel` and `packages/console/fixtures` are unchanged.
- Clean-room screen: the new evidence, reports and added diff lines contain no employer material, credential, account identifier, token, session link or personal path. The only `/Users/` text is VER-002 naming it as a pattern it searched for.
- Reads at source: the whole subject diff, including the new skeleton and console modules and tests, the schema, `scripts/lib/config.mjs` launchpad resolution, `resident-bind.mjs` launch lines and `scripts/lib/harness.mjs` snapshot preservation. The review also read D001-D013, the implementation and repair records, VER-001 and VER-002, the order, and product 07 §Goal-aligned decisions and 08 §PRs and commits.

## Handoff

The result is `final-review-result pass`. After the transition the reviewer refreshes the index and commits the reviewed state as four commits. It then runs `npm run worktree -- publish WO-114` with the committed [PR body](PR.md), which sits beside this report with the [release notes](RELEASE-NOTES.md). The four commits are:

1. The runtime status contract, writer, console host, tests and component versions.
2. The regenerated harness surfaces and the selected WO-114 authority and feedback editions.
3. The product 04 and console README write-backs, the `v0.47.0` release surfaces and the refreshed publication locks.
4. The record.

The helper's post-merge release-close handoff goes to the operator verbatim. The D013 follow-up `FUP-4656197433cb8b3d` stays open for the planner to place. Checkpoints 1 to 9 are retained.

## Reproduction

From the WO-114 worktree on branch `wo-114`:

```text
npm test -- --review
node --test --test-name-pattern=WO-114 packages/skeleton/dist/test/runtime-status.test.js
node --test --test-name-pattern=WO-114 packages/console/dist/test/runtime-status.test.js
node scripts/console-fixtures.mjs --check
npm run publication:check
node scripts/harness.mjs check
npm run release -- check-surfaces --local
npm run plan -- check
git fetch origin && git log --oneline HEAD..origin/main
```
