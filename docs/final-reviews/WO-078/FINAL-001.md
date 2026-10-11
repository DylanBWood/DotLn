# WO-078 FINAL-001 — final review

**Verdict:** pass. WO-078 gives core a generated sibling registry and makes every kit export and update write the receipt it is built from. All four criteria are met at the integrated subject. VER-001's and VER-002's escapes stay repaired: the verifier's VER-003 probe, rerun here unchanged at the integrated tree, refuses all thirteen attack cases with no write and passes its two legitimate cases. Main moved under the order (WO-191, published as v0.74.2), which integrated with no authored conflict and retimed the release to v0.74.3; that is bookkeeping, recorded in [D013](../../evidence/WO-078/decisions.md#wo-078-d013--integration-main-fast-forwarded-under-the-work-with-no-conflict-v0742-retimed-to-v0743), not a finding. This review found no defect. [D014](../../evidence/WO-078/decisions.md#wo-078-d014--final-review-pass-at-the-integrated-subject-two-allocated-register-rows-disposed) records the pass and the register dispositions.

**Subject:** [`docs/work-orders/WO-078-sibling-registry.md`](../../work-orders/WO-078-sibling-registry.md) on branch `wo-078`, uncommitted over `main` at `cd1dce608f4739c4a61c3d2659ef197503f05b83` after integration from its base `b7741e38d68ac659921db757ac19054f84743495`. `git ls-remote origin refs/heads/main`, `origin/main` and local `main` all name `cd1dce60`.

- VER-003 passed code identity `08345dada9b32b66aea18810ab01be4c591fc200e234d231d6acc2e06c4f4faa`, and the executor's complete `npm test -- --review` row stands at that identity (2026-10-11T17:45:57.365Z, exit 0, 38 suites, 90 fresh tasks, 1,464,642 ms). The subject's own bytes are unchanged since: the three new modules, the three `docs/siblings/` files, VER-003 and the handoff are byte-identical to checkpoint 14, and the tracked subject files differ from it only by main's own additions. The integrated gate code identity is `da2101f0dfdcf2ee87a68a410ab8f266749b21c2b3957e0e438f17b1b11601a0`; it differs because main's code moved, so this review ran the product gate fresh at that identity (38 suites, 90 fresh tasks, exit 0, recorded 2026-10-11T19:00:01.876Z), and `npm run format` and the document gate before and after it left the identity unchanged. This review edited no code byte.
- The recorded `reportHash` of VER-001, VER-002 and VER-003 each equals the report's current SHA-256.
- The order differs from `main` only in its heading's version label, now `(v0.74.3)` after the retime; the four criteria are the original text.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.296","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version` and the session's execpath, and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at handoff. Every claim the verdict rests on could be run in this session, and the verifier's committed probe reproduces the repaired class directly.

**Process cost:** entry 93111 tokens; handoff 6651533 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 5841518b-98bb-4258-9c95-79475deb8f4d`. Entry was observed at 2026-10-11T18:16:29.464Z. Handoff was observed at 19:00:26.875Z, after the product gate and before this report's final bytes, at 90 steps and 85 commands; it counts 6,252,370 cached input, 316,344 cache-write, 966 uncached input and 81,853 output tokens. These are cumulative transcript totals, almost all cached input, so they do not measure live context. Reasoning tokens and dollar cost are unavailable. Wall clock from entry to the handoff reading was about 44 minutes, 23 of them the product gate. Final counters after the result transition are in the ignored receipts and the response. Tradeoff: the review gate could not reuse the executor's tasks, because main's code moved the identity; it ran fresh on the integrated tree, which is the one product gate product 07's integration list requires.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-078/FINAL-001.md`.

Read in full: the order; VER-001, VER-002 and VER-003; D001 to D013; `handoff.md`, `repair-001.md`, `repair-002.md`, `self-review.md` and `fixtures.md`; the verifier evidence for VER-001 and VER-002; the control segment; product 07 §Where the control plane finds its documents, §Independent workflows and integration, §Verification review and attack and §Discipline (the handoff sequence); product 08 §PRs and commits and §Release-note edition.

Reviewed: the complete subject diff against the base and, after integration, against `main`: `scripts/launchpad.mjs`, `scripts/lib/git.mjs`, `scripts/lib/config.mjs`, `scripts/lib/document-gate-stubs.mjs`, `scripts/lib/worktree-integration.mjs`, `scripts/test-runner.mjs`, `scripts/test-configuration-root.mjs` and `scripts/test-launchpad.mjs`; the new `scripts/siblings.mjs`, `scripts/lib/siblings.mjs` and `scripts/test-siblings.mjs` in full; `.gitattributes`; `docs/siblings/README.md`, `siblings.json` and `tag-observations.json` at current bytes; `docs/README.md`, product 07 and the publication lock; the generated projections.

Lenses, and why:

- **Correctness and rule beating:** a generated-entry check must take its expectation from independent inputs, and both verification failures were in that class.
- **Operator flow and recovery:** receipt and regeneration share one command, and an interrupted update must recover.
- **Authority and private data:** receipts and the declaration enter the committed evidence tree, and sibling ids are public repository names.
- **Release surfaces:** final review is acceptance, and main moved.

Goal alignment:

- **Traps:** deferring to three judgments because the third passed; re-litigating VER-002's recorded limits (oscillation); treating main's move, the version collision or the regenerated projections as findings; patching the judged generator.
- **What I did:** re-ran the committed VER-003 probe at the integrated tree and read every refusal path in the source; judged the limit cases inside D011's category and recorded them as limits; followed product 07's integration list and recorded the retime as bookkeeping; edited no code.
- **NoOp:** leaving the order unreviewed keeps WO-083's first export without a receipt and the starter's version in memory.

Integration: `npm run worktree -- integrate WO-078` fetched `main` three commits ahead of the base (WO-191 and its records). The branch held no commit, so the helper checkpointed the work (`refs/dotln/checkpoint/WO-078/14`, preservation commit `713de661b8503e55b0639a8037480a406563f59e`), fast-forwarded HEAD to `main` with no merge commit, re-applied the named stash `26a402c91bca3877d4a38693420c9aeddb6ecde6` and regenerated the runtime, the harness bundle, the control projection, the release preparation, the decision stub, the indexes, the sibling registry, the publication locks and the console fixtures. It resolved four generated projections and reported no authored conflict. Release preparation retimed the order from v0.74.2 to v0.74.3 above the observed baseline v0.74.2 (WO-191's tag, on origin and locally). This order changes no package manifest, lockfile, `packages/` file or evidence edition; main's console and skeleton bumps are WO-191's, consumed as published, so no component version collides and nothing is re-minted. D013 records the carried-forward claims. The three printed affected checks passed on the integrated tree, and the review gate is below.

## Earlier findings

- **VER-001 F1 (blocking, criterion 1): stays repaired.** The page-only forgery of the displayed version and the embedded record exits 1 in the sibling fixture `refuses a forged visible version and embedded record without trusting either copy on the page`, and in VER-003's probe cases H9 to H12 rerun here. The page's embedded record is output only and is compared byte for byte.
- **VER-002 F1 (blocking, criterion 1): stays repaired.** The coordinated edit of the page and `tag-observations.json` to an invented tag exits 1 with no stdout, names the observation file and writes nothing: the fixture `refuses a coordinated invented version in the page and captured observations without a write`, and VER-003's probe H1 to H8 rerun here. `validateRecordedTags` requires an exact tag in `git tag --points-at <commit>` and a nearest tag in `git tag --merged <commit>`, by literal name, before `commitFacts` uses a captured value.
- **D009's three rows (follow-up):** the post-build refusal of an absent still-carried kit file, the omitted summary after a post-manifest failure and the duplicated small validators are still present on source review, break no criterion and keep their structured follow-up (FUP-584d6021928bdfdb, untriaged for planning).
- **D004's carry-ins:** FUP-eaad73517ca2a395 is fixed and is now settled on D004; FUP-06de60fa5d19fe5a was left with D004's reason and is deferred back to the register (Follow-up register, below).
- **Planning receipt 043's two criterion 1 known issues:** a leftover receipt temporary still refuses the check by path (VER-002 G, VER-003), which is the documented undecodable-receipt refusal; this repository holds no receipts, so its reopening condition has not occurred. The second issue's pricing trigger has not fired: D003 records the removed lookup's wall-clock as unmeasured.

## Criterion judgments

**Criterion 1:** met

- **The receipt inside the manifest step.** `exportKit` resolves the destination before `prepareKit` and before any write; `closeWithReceipt` runs right after `writeFileSync(KIT_MANIFEST)` and, in `updateKit`, right after the manifest replacement and the journal's removal. The receipt holds exactly the five fields (`decodeReceipt` refuses any other set). The launchpad fixture `WO-078 criterion 1` proves an undeclared destination writes nothing and says why; an export to the declared sibling writes the receipt (its manifest hash against the written manifest's bytes, its build hash against the printed snapshot, its name against its date), regenerates the page in the same command, and the page passes `index --check`; a removed page is rebuilt byte-identical; an update through a worktree-named copy whose origin names the sibling writes a second receipt at the new commit; the page put back by hand fails the check naming the receipt and is not rewritten. That case runs in the `launchpad` row of the review gate (Executed checks) and in the executor's row at the verified identity.
- **The declared refusal set.** A hand-edited entry is named by its first differing line, a manifest hash that disagrees with the latest receipt by that receipt's path, and a receipt that does not decode by its path, each without a write: the sibling fixtures (15 cases, `siblings-fixtures` row) and VER-003's probe, rerun here twice at the integrated tree (exit 0, `"failures": 0`, final cutoff 2026-10-11T18:21:30.729Z): H1 to H13 exit 1 with every input and output byte-identical and no temporary left, H13′ and H14 exit 0 with the page unchanged.
- **Measurements and the removed work.** The fixtures record the generator's wall-clock and the table's bytes (`t.diagnostic`: 40 ms and 1,897 bytes with no receipts, 97 ms and 3,134 bytes with two, 104 ms and 2,564 bytes in the launchpad case at the executor's run). D003 names the removed lookup, one sibling-checkout read per sibling per occasion before every update, planning pass or receipt that names the sibling, with its wall-clock unmeasured, as the Cost line counts it.

**Criterion 2:** met

`docs/siblings/README.md`, read at current bytes after the helper regenerated it, carries `DotLn-Enterprise-Starter` (an export of core whose commit is not evidenced, capability row `launchpad.starter`) and `DotLn-Angular` (a consumer of contract version `uifa-board-v1`, no rows declared). In both entries, kit version, core commit, manifest hash, build hash, last receipt and orders that advanced it read `not evidenced`. `docs/evidence/siblings/` does not exist, and `tag-observations.json` records no commit. The fixture `WO-078 criterion 2` asserts the twelve absent fields over a synthetic launchpad, in the `siblings-fixtures` row.

**Criterion 3:** met

- `docs/README.md` §Map names `docs/siblings/` with the generator and the declaration, and names the receipts under `docs/evidence/`. Product 07 §Where the control plane finds its documents gains `siblings` in its root list in place: a one-line diff, no dated paragraph. `ROOT_SEGMENTS` declares the root and `scripts/test-configuration-root.mjs` expects it.
- The decisions file holds D001 to D014, indexed by `npm run meta`. The software-engineer source lock is refreshed, and `npm run publication:check` reports both editions CURRENT (254 of 254 headings; 45 linked sections for the software-engineer edition).
- Gate: `npm run test:docs`, under Executed checks, including the `publication`, `meta`, `index`, `siblings` and registration rows.

**Criterion 4:** met

- `npm test -- --review` passed at the integrated code identity `da2101f0…`: 38 suites, 0 failed, 90 fresh tasks, 1,371,160 ms, exit 0, identity and build outputs unchanged, recorded 2026-10-11T19:00:01.876Z (`launchpad`, `siblings-fixtures`, `configuration-root` and `worktree-integration` among its required suites). The executor's complete row at the verified identity (2026-10-11T17:45:57.365Z, 38 suites, 90 fresh tasks, exit 0) covers the same subject bytes before main moved.
- `npm run test:docs` passed at the same identity: 35 checks, 0 failed, 102,136 ms, recorded 2026-10-11T18:36:52.054Z, with the `siblings`, `index`, `meta`, `publication` and `registrations` rows; the result transition runs it again inline on the final bytes.
- `git diff --check` is clean before and after integration.
- No new dependency: this order changes no `package.json`, `package-lock.json` or `packages/` file; the lockfile and manifest changes in the integrated tree are WO-191's published bumps.

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

Not findings, and why:

- **The version collision.** WO-191 published v0.74.2 while this order carried that target. Product 07 §Independent workflows and integration names a version collision as bookkeeping the integration records; release preparation retimed the heading and the README claim, and D013 holds the record.
- **VER-003's limits L1 to L3 and VER-002's cases D and F.** Coordinated edits of both generated files that name only tags Git holds at or below the receipt commit pass, and the check prints the live tag as newer evidence. They can arise from a genuine older observation, the verifier recorded them inside D011's anti-oscillation category, and no criterion names them. Raising them here would move that boundary without new evidence.
- **H13.** A captured tag deleted from Git after generation refuses the `siblings` document row until `node scripts/siblings.mjs index` regenerates the pair. VER-003 recorded it as widening planning receipt 043's first known issue; the refusal names the file and the command, and its reopening condition has not occurred.
- **Main's move and the regenerated projections.** A new base and regenerated projections are never a finding by the same section.

## Implementation review

- **Correctness.** Every refusal path in `writeRegistry` throws before either output is written: receipts are read and decoded first, `commitFacts` validates each captured observation against Git before rendering, and the check's coverage comparison and `checkRegistry` precede the `PASS` line. Generation prepares both temporaries before replacing either and refuses a pre-existing temporary. `writeReceipt` writes beside the final name and links into place, so a same-date collision refuses. `planUpdate`'s journal semantics hold on reading: a path absent from the pending plan was dropped by the interrupted run, so its absence is a removal and its return at a later commit an addition; a path the plan still lists must exist. `planInstanceActions` adopts a rename that landed without its configuration write. The literal-name membership test resists the revision and refname spellings that would beat an `rev-parse` comparison (H5, H6, H7).
- **Design.** `describeTag` now lives once in `scripts/lib/git.mjs` and serves the kit manifest and the registry. The two modules keep small private copies of the configuration loader's validators and their own first-differing-line computation; D009 boards the extraction for a second consumer, which is the right bound for this order.
- **Platform fit.** The declaration and the receipt are typed JSON with positive validation and unknown-key refusal; the relocated-root fixture shows the pair following `roots.siblings` and the receipts following `roots.evidence`, so an exported instance can carry the same registry.
- **Operator flow.** No command is added: the export and the update regenerate the page themselves and print the receipt path, and every refusal names the file and `node scripts/siblings.mjs index`. The later-tag case prints newer evidence instead of turning every worktree's document gate red at release close.
- **Authority and private data.** A receipt carries a sibling id, a commit, two hashes and a date. The declaration's purposes are marked as operator-stated intentions, and their vocabulary (the Angular consumer's stack, `uifa-board-v1`, `launchpad.starter`) is in product 03 and 04, the console's types and the capability table. Fixture and scratch exports write nothing into core's evidence tree.
- **Maintainer in six months.** The generator's header comment and the page's own second paragraph state the rule: captured observations keep an older version current, and Git decides whether a captured name may be used. The one subtlety is that a captured observation is validated for relationship, not for capture time, which VER-002 and VER-003 record as the limit class.

## Follow-up register

`npm run plan -- followups --touching` listed 19 pending rows by textual match over this order's surfaces before integration. Disposed at this review, through the helper (`docs/control/local/final-001-followups-WO-078.json`):

- **FUP-eaad73517ca2a395 (WO-077 D007), settled on D004.** Its seam was opened: the three update defects are fixed in this order's edit of `scripts/launchpad.mjs`, with the update fixtures in the passing review rows.
- **FUP-06de60fa5d19fe5a (WO-074 D010), deferred.** The order left it with D004's reason (a configuration field, product 07 text and the publish check's fixtures are outside its surfaces); its reopening condition is unchanged, and the row returns to the register as its allocation foresaw.

Left as they are: this order's own rows for D004, D009 and D010 (FUP-c6da24aea75994e6, FUP-584d6021928bdfdb and FUP-995f9b2aacc209d2), untriaged for planning; FUP-e624167a7f6555f6 (WO-074 D011, fixture data in the kit), a planning judgment D004 names as left; and every other row, which the change matched on text alone (the stash-apply stage of `scripts/lib/worktree-integration.mjs`, the runner's reporter selection, the configuration loader's `linkHosts` validation, the document map's dated log) without opening its seam or meeting its reopening condition. FUP-1e8ba454d811954f, FUP-88ceacf550262cea and FUP-8c5dc05351e8c130 were settled by the repairs.

## Release surfaces

- [`PR.md`](PR.md) is written under product 08 §PRs and commits, one physical line per prose paragraph, above the regenerated process meter.
- [`RELEASE-NOTES.md`](RELEASE-NOTES.md) is the five-section patch edition for v0.74.3.

The proposed PR title is `:sparkles: Every kit export and update writes a receipt, and a generated registry shows what each sibling repository carries`. Its gitmoji is `:sparkles:`, because the order adds a capability (the registry, the receipts and the check) rather than repairing one. The title leads with what the operator sees change, the receipt and the registry, and leaves the refusal set, the update repairs and the version to the body. The last eight merged subjects run from 56 to 173 characters; this title's length comes from its two clauses, not from the previous title.

## Executed checks

Probes ran alone under `node scripts/harness.mjs bounded`. Times are 2026-10-11 UTC.

| Check | Window | Exit | Result |
| --- | --- | --- | --- |
| `node docs/evidence/WO-078/verification-003-probe.mjs` (VER-003's probe, unchanged) | 18:19:25–18:19:27 | 0 | `"failures": 0`; H1–H13 refuse (exit 1, no write), H13′ and H14 pass |
| the same probe, output captured to session scratch | 18:21:28–18:21:30 | 0 | `"failures": 0`, cutoff 18:21:30.729Z; the same rows |
| `npm run worktree -- integrate WO-078` | checkpoint 14 at 18:23:17 | 0 | fast-forward, no authored conflict, retime v0.74.2 → v0.74.3; D013 |
| `npm run publication:check` | 18:23:55 | 0 | 254 of 254 headings; both editions CURRENT |
| `node scripts/harness.mjs check` | 18:23:55 | 0 | 34 generated surfaces |
| `npm run release -- check-surfaces --local` | 18:23:55 | 0 | six packages refuse publish as expected |
| `npm run plan -- followups --apply docs/control/local/final-001-followups-WO-078.json` | 18:27 | 0 | two rows disposed; register revision `6bb4da75…` |
| `npm run meta`; `npm run work-orders -- index`; `npm run format` | 18:33:12–18:33:16 | 0 | D013 and D014 indexed; the standing reopen candidate WO-150-D003 (executor cold start above 24,576 bytes) reported, unrelated to this order |
| `npm run test:docs` | 18:33:22–18:33:53 | 1 | `release-surfaces` preflight refused the release notes: a code span with angle brackets read as raw HTML at line 8; the remaining rows did not run; reworded in the notes and the PR body |
| `npm run format`, then `npm run test:docs` | 18:35:02–18:36:52 | 0 | 35 passed, 0 failed, 102.14 s, 35 fresh tasks, at identity `da2101f0…` |
| `npm test -- --review` | 18:37:09–19:00:01 | 0 | 38 passed, 0 failed, 1,371.16 s, 90 fresh tasks, at identity `da2101f0…`; nothing written under the repository and no agent started while it ran |
| `git diff --check` after the gate | 19:00 | 0 | clean |

The gate rows were filled into this report, `PR.md`, `RELEASE-NOTES.md` and D014 after the product gate; those are document edits, and the result transition runs `npm run test:docs` and `git diff --check` inline on the final bytes.

Repository writes:

- this report, `PR.md` and `RELEASE-NOTES.md`;
- D013's completion and D014;
- the follow-up register dispositions;
- the regenerated decisions index, meter, work-order index and projections the helper and `npm run meta` own.

No implementation source was edited. Probe fixtures were created in system temp, and each fixture's own cleanup removed them. Scratch output went to the DotLn session scratch directory. No scratch repository is in the worktree, and no reviewer-started background task or agent remains.

Goal alignment outcome: matched. Each criterion was re-derived from the fixtures, the probe rerun or the current bytes at the integrated subject; the recorded limits stayed in their category; the collision was recorded as bookkeeping; no code was edited; and the reviewed state is ready to commit.
