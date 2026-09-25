# WO-159 implementation — Codex episode isolation (v0.48.0)

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.282","model":"claude-opus-5-5","effort":"xhigh","mode":"subagents","raw":"ultracode","source":"claude-session-readback"}

The model is the operator's `/model` selection at dispatch (Opus 5.5). The
effort is the operator's ultracode selection; Claude Code exports the root
session's selected effort as `CLAUDE_EFFORT=xhigh` (selected, not effective).
The harness version is `claude --version`. The live rows ran on the operator's
local Codex CLI 0.156.1 with `gpt-6-sol` at `xhigh` (the feedback verifier
episode) and `low` (the trust probe).

Dispatch: `resume: next`, 2026-09-25, recorded by the harness before this
procedure loaded; active WO-159 in its matching `wo-159` worktree with one
registered writer. No branch commit, push, PR, tag or lifecycle repair was
performed. Independent verification and final review remain separate
dispatches.

## What changed, by criterion

| Criterion | Evidence |
| --- | --- |
| 1 — fixture | [D003](decisions.md#wo-159-d003). `packages/skeleton/fixtures/codex-home-cli.mjs` is a fake `codex` that reads `$CODEX_HOME/auth.json` and appends a trust entry to `$CODEX_HOME/config.toml`. Test `WO-159 AC1 a fake codex that trusts its target leaves the user-level file byte-identical` (`packages/skeleton/test/codex-episode.test.ts`): the fixture user-level file is byte-identical, the episode record carries equal before/after pairs with `isolatedTrustEntries` 1, the isolated home is gone, and the fixture auth bytes appear in no record, store file or stderr. The same file covers the argv builder, the trust-table projection (inline, literal-key and array cases), home resolution, an unequal pair on a user-level change, a home that cannot be removed (recorded `homeRemoved: false`) and the stale-home rule. |
| 2 — one launch site | [D004](decisions.md#wo-159-d004), [D005](decisions.md#wo-159-d005). `git grep -l -e '"--ephemeral"' -- ':(glob)packages/*/src/**' scripts` lists only `packages/skeleton/src/worker-transport.ts`; the order's literal pathspec `packages/*/src` matches no file in Git's wildcard semantics and now lists nothing. The six named sites and a seventh, `scripts/probe-codex-effort.mjs`, call `codexExecArgv` and `startCodexEpisode`; `probe-worker-hosts.mjs` reads its checklist from `CODEX_EXEC_SHARED_FLAGS`. Test `WO-159 AC2 …` runs the corrected command. The probe Codex stub refuses any `CODEX_HOME` but an isolated one, and each writing-worker Codex row records its isolation (`scripts/test-harness-probe.mjs`). A real `node scripts/probe-worker-hosts.mjs` run isolated both Codex invocations with equal pairs. |
| 3 — live row | [D012](decisions.md#wo-159-d012), [D013](decisions.md#wo-159-d013); [live-codex.json](live-codex.json). `codex login status` exited 0 under an isolated home holding only the auth link; one `codex-cli-exec` `gpt-6-sol` `xhigh` feedback verifier episode completed through the transport in 19,490 ms (deadline 600,000 ms, 19 heartbeats, approval policy never); both launches' user `config.toml` and trust-table pairs are equal and both homes were removed. `node docs/evidence/WO-159/receipt.mjs --check` validates it and matches its terminal event in the committed feedback store. A writer-shape [trust probe](trust-probe.json) with WO-111's source-change prefix observed the CLI writing its scratch trust entry into the isolated home while the user file stayed byte-identical. |
| 4 — protected surfaces and receipt check | [D003](decisions.md#wo-159-d003), [D010](decisions.md#wo-159-d010). The live receipt lists both launches' digest pairs under `protectedSurfaces.codexUserConfiguration`; `validateReceipt` calls the runtime's exported `assertCodexIsolationUnchanged`. Tests `WO-159 AC4 …` (`packages/skeleton/test/codex-isolation-receipt.test.ts`) build fixture receipts from a worker-host store and a verification-host store with the live builder and refuse 26 forgeries, each by its expected message, including unequal user-config and trust-table pairs. The worker, verification and source-change hosts record `codexIsolation` on their episode events; a resident CLI observation carries `isolation`. |
| 5 — WO-054 correction | [D015](decisions.md#wo-159-d015). A dated correction is appended below the existing bytes of [codex-continuation.md](../WO-054/codex-continuation.md) (the original is an unchanged prefix); the capability table gains a WO-159 dated reassessment covering Codex launch containment and WO-054's continuation row. |
| 6 — editions | [D014](decisions.md#wo-159-d014). Authority, verification and feedback re-minted as WO-159/001 and selected by `docs/evidence/current.json`; artifact identity stays at WO-154/001. The verification files are byte-identical to WO-154's, and both deterministic editions verify again on regeneration. The feedback edition was recorded from the live Codex episode after every source edit had settled: "Live feedback audit docs/evidence/WO-159/feedback-001 judged the current source." The harness bundle was re-emitted (31 surfaces). |
| 7 — gates | See §Checks run. No new dependency; `git diff --check` clean. |

## Other write-backs and decisions

- Release: application `v0.48.0`, `@dotln/skeleton` 0.41.0, the console pin and
  lockfile follow ([D011](decisions.md#wo-159-d011)). The heading label was bound
  with `plan amend-order` under the standing release-assignment default because
  the order was filed without the release placeholder; the operator may veto.
  `release check-surfaces --local` passes and `release prepare --local` reports
  `v0.48.0` current.
- Product 03's progressive absence candidate gains the sentence that the
  containment precondition is met; the roadmap records the activation.
- Receipt 028's three known issues are carried ([D006](decisions.md#wo-159-d006)):
  stale homes are removed by the next launch and listed by `harness prune`; the
  live row completed without prompt or stall; an unbuildable home refuses.
- An independent read-only review (four agents) ran before any edition was
  minted; all 17 findings were settled ([D010](decisions.md#wo-159-d010)).
- Trust baseline: the live row recorded 43 trusted entries before and after, the
  file as it stood; the operator had edited it to one entry without saving and
  saved at 04:40:38Z, after which a count-only census shows 1 entry and none in
  a DotLn scratch family ([D013](decisions.md#wo-159-d013)).
- Follow-ups minted: FUP-e398c79e1b32e94b (whether Claude launches leave
  user-level state, D009), FUP-35bc8736fb13c49a (resident supervisor signal
  handling, D010; queue item adjacent-0001 deferred onto it) and
  FUP-57741bfb0c1f7f35 (sibling orders filed without the release placeholder,
  D011). FUP-3c34a8ffbf61376f and its duplicate settle at close (D015).

## Checks run

All on the final tree, 2026-09-25:

- `node scripts/harness.mjs evidence`: `npm test` 27 passed, 0 failed, 297.63 s,
  71 fresh tasks (tree `8f24791e5f35bd90ff31f0add8caac576d0d2d8c`); exit 0.
- `npm run test:docs`: 21 passed, 0 failed, 23.72 s (authority, verification,
  artifact and feedback evidence, harness, harness-context, plan, format,
  publication among them).
- `git diff --check`: clean. No dependency added.
- `node docs/evidence/WO-159/receipt.mjs --check`: validated; its terminal event
  matches the committed feedback store.
- `npm run release -- check-surfaces --local`: exit 0; `npm run release --
  prepare --local`: `v0.48.0` remains current.
- `npm run plan -- check` and `npm run publication:check`: exit 0.
- Targeted, serially: the WO-159 skeleton tests 12 of 12; worker, verification,
  writer, resident-actors, source-change-host, verification-worktree,
  feedback-host, mission-check and portfolio 119 of 119;
  `scripts/test-harness-probe.mjs` 11, `scripts/test-authority-probe.mjs` 26,
  `local-model-role-qualification.test.mjs` 13, `test-configuration-root.mjs` 13,
  and the prune test.
- `node scripts/probe-worker-hosts.mjs` against the real CLI (no model call):
  both Codex invocations isolated, equal pairs, homes removed.

## Limits

- The live row exercises the inspection shape; the writer shape was observed
  only by the one-word trust probe, not by a source-change episode. The WO-111
  portfolio was not rerun (a non-goal).
- Claude and Copilot launches are not isolated and were not measured.
- Tests that run the real process runner with the default environment digest
  the host's own Codex home and link its auth file into a temporary home; they
  assert shape only (D008, D010 F7).
- Wall-clock, tokens and context bytes of this order's own session are in the
  handoff; the live verifier episode used 208,174 tokens and the trust probe
  14,385.
