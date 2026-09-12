# WO-125 — FINAL-001

**Verdict:** PASS

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.269","model":"claude-fable-5-1","effort":"max","source":"self-reported"}

Claude Code 2.1.269, observed with `claude --version`; the patch sits on the `2.1` line that `docs/discovery/environment.json` records as observed. The model is `claude-fable-5-1`, the exact model ID the session exposes. Effort `max` is the operator's `/model` selection for this session, not an effective-session readback, so the source is self-reported. The order declares the reviewer effort as `any`. This session took no part in the implementation, the three repairs or the four verifications.

## Subject and inputs

Branch `wo-125` at base `6c702b4`, which equals local `main` and, by a read of the remote heads, `origin/main` at review time, so no integration was needed. The subject is uncommitted: 39 modified tracked files (1,646 insertions, 156 deletions) plus 31 untracked files under `docs/control/orders`, `docs/discovery`, `docs/evidence/WO-125`, `docs/verifications/WO-125`, `docs/final-reviews/WO-125`, `packages/skeleton/fixtures` and `scripts`. `FinalReviewRequested` was recorded at 2026-09-12T15:11:27.541Z (checkpoint `refs/dotln/checkpoint/WO-125/17`, `16bbfc1`). Between VER-004's completion checkpoint 16 and checkpoint 17 only the three lifecycle projections changed, and each verification report is byte-identical to its completion checkpoint (VER-001 to checkpoint 4, VER-002 to 8, VER-003 to 12, VER-004 to 16).

Reviewed: the original order with its dated `## Execution record`; every cited section (07 §Model-specific notes and §Goal-aligned decisions, Principle 15, the refutations README's Codex selection sentence, the recorded Codex rows in the runtime map and `environment.md`, `worker-transport.ts`, the `--effort` handling in `scripts/refute-plan.mjs`); the absent `docs/evidence/WO-019/` through the substitutes D001 names (07 §Model-specific notes, the `environment.md` WO-019 addendum and the `environment.json` effort rows); the full subject diff, including the generated hooks and manifest, the discovery record, the evidence editions and the release surfaces; VER-001 through VER-004; the evidence README, the three repair receipts and D001–D005; `package.json`; 08 §PRs and commits; and the critical-path plan's WO-125 nomination.

## Independent checks

- The four runtime modules under `packages/skeleton/dist/src/` (`gate-evidence.mjs`, `harness-host.js`, `harness-command.js`, `worker-transport.js`) are byte-identical, by SHA-256, to the pinned snapshot `.runtime/harness/52e7c7bffd5a00b7` that the manifest and all nine generated hooks import at skeleton `0.15.2`.
- Suites on the fresh build: `worker.test.js` 20/20 (28.4 s); `scripts/test-runner.test.mjs` 19/19 (8.3 s), including the VER-002 case-alias and link-traversal tests and the VER-003 hard-link test; the four WO-125 generated-hook cases in `scripts/test-harness.mjs` 4/4 (119.5 s); the WO-125 plan CLI case in `scripts/test-plan-refutation.mjs` 1/1 (61.3 s).
- An independent transport probe transpiled HEAD's adapter and bound it to the current build. `unknown` produces the same bytes as HEAD and as `codex-unknown-args.json` on `0.153.4`, on `0.154.0` and with the version omitted. On `0.154.0`, each of the five levels reaches the process double with the whole recorded discovery vector after substituting the row's placeholders, and HEAD refused all five. Ten out-of-set values (`minimal`, `none`, `MAX`, empty, leading and trailing space, the newline-plus-`sandbox_mode` injection, `null`, `undefined`, `5`) refuse before any launch and name the discovery record. `max` refuses on `0.153.4` and with the version omitted. Construction admits `codex-cli 0.153.4` and `0.154.0` and refuses `0.154.1`, `0.155.0` and an unparseable string.
- Evidence editions: authority revision 004 carries 4 compatibility, 4 widening and 9 narrowing entries and 27 bundle files; feedback revision 001 carries 10 fixtures and 10 maturity rows; `docs/evidence/current.json` selects both.
- Dependencies are unchanged: the lockfile changes only the skeleton version, and the root `package.json` changes only the `harness` script. `scripts/lib/gate-evidence.mjs` re-exports the source module, so the new entry loads on a fresh clone before its build.
- The Claude branch of `canonicalWorkerArgs` is untouched, and no third transport appears (non-goals).
- Clean-room screen: the added tracked lines and the untracked files carry no home paths, credentials or private identifiers. The retained feedback streams contain only fixture addresses under `example.invalid`, one public no-reply address, package-registry URLs and redaction-pattern source text, as VER-002 O5 found; the two token-like matches were substrings of ordinary words.
- `git diff --check` is clean on the review tree.

## Acceptance criteria

Criterion 1 holds: `codex-effort-2026-09-11.json` has one row per declared level, each with the complete command vector, exit 0, the bounded result, `effortFields: []`, `effectiveEffort: "unknown"` and classification `observed`; the runtime-map table and the `environment.md` addendum mirror them. The live launches were the operator's 2026-09-11 run outside the sandbox and were not repeated in any verification or here.

Criterion 2 holds by the suites and the probe above: observed levels forward exactly and are recorded as `host-launch` claims with effective effort and model `unknown`; `unknown` forwards nothing and no existing Codex fixture changed; unavailable pairs refuse naming the record. VER-001 F1 and F2 are resolved: the adapter checks runtime membership before launch, and an omitted builder version is `unknown`.

Criterion 3 holds with a double: the plan entry with `--transport codex-cli-exec --model gpt-6-astra --effort max` constructs the transport, the argument tail is `-c`, `model_reasoning_effort="max"`, `-`, and the receipt records the launch claim only. The live run remains the operator's.

Criterion 4 holds: the refutations README sentence, 07 §Model-specific notes, the `environment.md` addendum and the runtime-map section agree with the rows; the pre-2026-09-09 ledger duty is discharged by the decisions file (D001–D005) and its five index rows, and the work-order index marks the substitution.

Criterion 5 holds except for the gate on the final bytes, which the completion command records: `git diff --check` is clean; no dependency was added; the hooks and manifest pin the regenerated `0.15.2` snapshot; feedback revision 001 is a fresh edition because runtime source changed, and authority revision 004 binds the final classifier. Application `v0.17.2` is the next patch above the local `v0.17.1`, and only the skeleton component changed.

The operator-authorized Execution record holds as VER-002, VER-003 and VER-004 found and as the generated-hook cases reproduce here: live runs refuse Write, Edit and write-classified shell commands that could change candidate-tree or installed suite inputs, naming the active command and run; ignored scratch stays writable; a dead owner's marker cannot strand writes; case aliases, dangling and chained symlinks, parent traversal after a directory link, a working directory reached through a link and pre-existing hard links are classified; and the final input comparison remains in place.

## Gate

The canonical gate for this review is `npm run harness -- evidence` on the tree containing this report and the publication outputs; the runner's gate record for those bytes is the completion authority, and `final-review-result pass` refuses without a passing `npm run test:full` and `git diff --check` for the exact tree. This report claims no gate result of its own.

## Observations (non-blocking)

1. Subagent spawns are refused for the whole lifetime of a live gate, whatever the agent would do, because the guard admits only classified writes and shells. That is stricter than 07's "Write, Edit and shell writes" sentence. Conservative and consistent with D003's no-bypass rule; a wording addition to 07 is optional.
2. A malformed file in `docs/control/local/harness/active-gates/` makes `activeGateRuns` throw, which fails every guarded tool closed until the file is removed. The directory is local and gate-owned, so no change is requested.
3. The `console` suite's `release:list` source went unavailable under full-gate load in VER-001, VER-003 and VER-004's first run, consistent with the collector's 60 s timeout in code this order does not touch. VER-003 nominated the timeout for a separate order; the nomination lives in the reports and not in the follow-up register. Owner: the next planning pass.
4. The evidence README's "18 passing tests" is the pre-repair count; the repair receipts carry the current 20. Cosmetic.
5. The order's effort drift (`max` then `xhigh`) comes from VER-002's operator-attested `ultracode` session; every verification met the `xhigh+` minimum.
6. Carried forward: admission is by CLI version, not by model; there is no negative acceptance control showing the CLI distinguishes acceptance from silently ignoring the override; the live rows were observed once (VER-001 O1, O3, O4). VER-004 O3's read-observer failure on deduplicated reads was not traced.

## Goal alignment

WO-125 removes a transport prerequisite for a Codex refuter or worker at `max` in the independently verified source-to-deliverable loop on the critical path, and its authorized repair keeps verification inputs stable for every later order. Passing sends the order to publication with the residual limits disclosed. Failing, the NoOp for this decision, would spend a fifth repair-and-verify cycle, which the meter puts at tens of millions of tokens per role for this order, on observations that are wording, cosmetic or already nominated elsewhere; the escalation and commons lenses weigh against it. The verdict rests on the independent probe, the suites and the snapshot identity above, not on the green gate alone, so rule beating is checked and no weaker baseline is normalized: HEAD's fail-closed boundary is restored and narrowed to the observed pairs. Shifting the burden favors the guard, which refuses a mid-run write up front instead of leaving the final comparison or the operator to catch it. Policy resistance appears as the accepted costs D003 and D005 record: opaque shell, spawns and multiply-linked scratch are refused while a gate runs. Success to the successful and seeking the wrong goal are immaterial: neither transport gains authority, and the checks target the stated behavior. The review adds no code, and the series is revertible as one PR. Reopen if a CLI version change requires a re-probe, a multiply-linked file is refused in real work, the operator wants admission scoped by model, or 07's wording should name the spawn refusal.

## Costs and publication

Tokens, measured with `node scripts/harness.mjs usage` (source `claude-transcript-message-usage`, scope `dispatch`): 182,123 at entry (observed 2026-09-12T15:08:22Z, 4 steps, 3 commands); 1,764,443 before this report was written (1,484,399 cached input, 239,138 cache-write input, 40,518 output, 388 uncached input; 85 steps, 84 commands; observed 15:19:25Z). The completion action records the handoff figure. Cost is null; the transcript records no price. The total includes the 119.5 s and 61.3 s fixture runs and waiting. No equivalent alternative review was measured, so no efficiency comparison is claimed.

The reviewed state is committed as four coherent commits (the observed Codex effort selection; the gate input protection; the release preparation and evidence editions; the lifecycle records) and published with `npm run worktree -- publish WO-125 --title <reviewed title> --body-file docs/final-reviews/WO-125/PR.md`. Merge and release close remain the operator's.
