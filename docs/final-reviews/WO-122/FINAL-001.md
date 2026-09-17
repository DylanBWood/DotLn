# WO-122 FINAL-001 — resident CLI workers and durable human decisions

**Verdict: pass.** The integrated subject meets all five acceptance criteria. No blocking finding requires repair. The reviewer ran the focused actor/writer tests and the full product gate on the combined source; the original live actor row is carried forward with its reported blocked status intact.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.154.0","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

## Subject and integration

Operator dispatch: `resume: final review`, recorded at 2026-09-17T15:07:15.229Z. The operator also requested integration of the merged parallel order, ordinary administrative updates, temporary merge-worktree cleanup and a release-close dry run or equivalent pre-merge checks. Current-session model/effort/version came from the canonical Codex readback. One root coding agent performed the review; no writable subagent was used.

The original subject and VER-001 use base `6029a4cb74361ba066f612af7a302fa54661625a`. The integrating branch fast-forwarded to fetched main `352ada5dbee7f5340bb303d18fbfaec19df7b50e`, also the published v0.28.0 target, before reapplying the original work. Recovery is preserved by `refs/dotln/checkpoint/WO-122/5` and the named stash `WO-122 final-review recovery before main integration 2026-09-17`. The stash was applied by its immutable object id and retained. Ignored intake remained in place.

WO-052's source-change host, reactor slice, worker-store changes and planning records are carried forward from main. Source merges were additive in the evidence inventories and runtime bindings. Conflicts were confined to the generated harness manifest/hooks, current control/evidence projections, follow-up register, roadmap, publication locks, work-order index and console selfhost fixtures. Follow-ups were unioned by entry id, preserving both histories. Generated surfaces were rebuilt; the original VER-001 and all original evidence artifacts remain byte-identical except for the appended integration decision in decisions.md.

The actor implementations, worker transport and actor/writer tests retain their verified bytes. The combined feedback inventory and WO-052's shared runtime changes require new source evidence, recorded at revision 003 for authority, artifact identity, verification and feedback. A fresh read-only feedback audit and separate Codex CLI verifier completed; earlier editions remain immutable. Console selfhost fixtures select revision 003. The harness manifest/check covers the regenerated installed snapshot.

WO-052 consumed application v0.28.0 and skeleton 0.24.0 after those versions were valid for WO-122 at verification. Application v0.29.0 and skeleton 0.25.0 preserve the existing minor classification; the other component versions and third-party dependencies are unchanged. The README, order heading and dated roadmap records agree. [D005](../../evidence/WO-122/decisions.md#wo-122-d005--integrate-the-published-sibling-and-retime-the-additive-release) records the mission contribution, NoOp comparison, all eight system-trap lenses, intervention risks and reopening condition. No behavioral repair was written or certified by this reviewer.

## Acceptance and executed evidence

| Criterion | Judgment and evidence |
| --- | --- |
| 1 — CLI worker | Pass. The resident dispatches writer and inspection requests, stamps the resident episode, records the validated envelope and launch claims, refuses excess nested authority and emits a named unavailable-row NoOp without fallback. The integrated tests reproduce these behaviors; completion claims do not advance a phase as independently verified. |
| 2 — human handoff | Pass. The tests reproduce atomic complete-packet publication, a per-order hold across restart, invalid/repeated/mismatched answer refusal, answer continuation, another order's dispatch and rejection of stale-generation or expired continuation. Replay uses recorded time. |
| 3 — live row | Pass, carried forward. The preserved live.json records a real supervised Codex source-change-v1 launch with actor origin and operator away, a validated envelope and no verified phase promotion. It reports blocked because Node was unavailable to the worker; separate host observations record an edit, a passing test and a commit. The current reviewer did not rerun that actor launch and does not claim the stronger WO-053 result. |
| 4 — write-backs | Pass. Product 03 documents both kinds. D001–D005 and the generated decisions index discharge the pre-2026-09-09 ledger substitution. The work-order index records that substitution. |
| 5 — tests and hygiene | Pass. The focused actor/writer run passed 20/20 in 10.70 s. `npm test -- --review` passed 28 suites, zero failures, 72 fresh tasks in 817656 ms outside the sandbox. Both working and staged `git diff --check` passed. No third-party dependency changed. |

The successful reviewer gate was recorded at 2026-09-17T15:29:26.677Z for tree `93a2339c7e52db5f4f4caf44708cc3222fbe2ff3` and code identity `f88b4ddded749b818f8ccdbf5eb0564a43a17e1e1f98388ab33ce5bef27aa896`. The local transcript is `docs/control/local/wo122-final-review-test.log`; the lifecycle result retains the canonical gate row. All intended source files were staged before the single reviewer gate. Subsequent report, control, release-prose and generated-index updates do not change code identity.

Direct checks also passed: `harness check`, the four selected evidence checks, publication coverage/locks, and release surface/version/license/GitHub-body checks. The complete gate includes the application packages, existing resident/presence/discovery behavior, WO-052 source-change recovery and the changed-source machinery, including release preflight, conflict, cached-gate, composed-evidence and concurrent-close cases.

## Verification sequence and limits

The complete numbered sequence is VER-001, pass. Its minor F1 was accurate: the architecture sentence overgeneralized ScriptEpisodeLost recovery to handoffs. The current sentence distinguishes shared dispatch, script/CLI loss and durable handoff recovery; this is documentation correction only.

The remaining verification observations are limits rather than failed acceptance claims: availability follows dated discovery rows, authentication lifetime is unknown, the handoff directory is relative to the resident store, script declarations have no work-order identity, and a valid live envelope need not claim completion. The production supervisor is exercised by the preserved live collector; focused tests separately cover native process stamps and bounded cancellation. Reduced status values disclose outcomes without copying raw worker output or private paths. Product 03 is the required event write-back for this order. No hostile-process authentication or hostile descendant containment is claimed.

## Release-close request and publication

The actual `npm run release -- close WO-122 --publish --dry-run` was attempted from the verified main checkout. Origin was reachable and main's tracked files were clean. It stopped with `unknown work order WO-122; open orders: none`, because the unmerged order is absent from origin/main. This is an expected pre-merge prerequisite, not a passing full close. A committed-branch preflight invokes the release helper's unchanged manifest, gate, surface, tag and body validators before PR publication; its result is recorded at publication. The eventual merge revision and any later remote changes remain for the post-merge close to judge.

The PR and five-section release notes use the publication contract and disclose compatibility and live-row limits. The title's feature shortcode follows the [gitmoji catalog](https://gitmoji.dev/). No merge, main push, tag, Release or package publication is authorized by this review. After PR merge, the operator dispatches `resume: release close` in main.

No temporary repository or registered worktree was created for integration. Entry and post-test inventories contain only main and wo-122. Disposable test fixtures clean themselves; recovery checkpoints, the integration stash, intake and the live actor scratch evidence are retained. Any release preview is removed by its helper's finally block. This session releases its own writer reservation at handoff.

## Cost and instrument disclosure

Entry measurement: 52256 reported total tokens, source codex-transcript-counter, dispatch scope, cutoff 2026-09-17T15:07:25.671Z. The gate and final counters stay in ignored receipts and the response; cost in USD and wrapped-command totals are unknown. The 817656 ms reviewer gate includes its work and waiting. No process-cost reduction is claimed. The integration removes a recurring operator reconciliation step but adds a fresh combined-source audit and full review gate; correctness and release readiness are the observed outcomes.

The subject includes the source-inventory and harness-generation machinery used to check it. This reviewer inspected those diffs and ran their executable coverage. Explicit session/writer/output tools supply observations; automatic Codex hooks are not claimed. Initial session creation alone did not reserve the writer; the explicit writer hook was then invoked and the sole reservation was observed. Initial generation encountered the conflicted manifest; it succeeded after a valid preserved manifest was supplied as input and regenerated. Release preparation had already applied the retime before encountering that same manifest conflict; its subsequent local-tag check confirmed the current target. The initial release-surface check correctly rejected the unfinished release-note draft; the completed five-section body passes.
