# WO-048 implementation evidence

Dispatch: `resume: next`, 2026-09-15. This is executor evidence; independent
work-order verification remains a separate dispatch.

## Delivered behavior

Recovery validates locks, receipt wrappers and producing episodes, canonical
command/request keys, stored verification capsules and worker leases before
reclaiming a host lock. Full replay and every saved receipt's concrete request
check run inside acquisition preflight. Both hosts also load cached results
before appending redispatch or lease-expiry events. Malformed state and any
unpublished `.pending` file refuse with the path and remain intact.

The [read inventory](read-paths.md) covers all seven direct byte-read/JSON-parse
sites in the three named modules and their indirect recovery consumers.
Its AST tripwire rejects added ordinary, aliased and namespace reads. The
[corpus](../../../packages/skeleton/fixtures/worker-store-malformed.json)
contains 33 declared shapes; 28 apply to inspection and all 33 to verification.
Additional cases cover lease tails, dangling links, missing contextual preflight
and already-locked host calls. Each case observes refusal, no dispatch/result
acceptance and identical directory entries/file bytes, including Git state.

## Executed evidence before the full gate

| Claim | Evidence | Outcome |
| --- | --- | --- |
| Malformed recovery and inventory | [Final corpus transcript](corpus-final-transcript.txt) | 75 tests passed on the final source; both public recovery paths and direct host calls preserve state |
| Existing worker/verification behavior | [Recovery transcript](recovery-transcript.txt) | 113 tests passed, including the new corpus, unchanged WO-009 rows 2/4/6 and unchanged WO-010 loop/recovery tests; this run preceded the final all-receipt contextual-acquisition check, which the final corpus and full gate cover |
| Generated harness | `node scripts/harness.mjs emit`, `check` | 24 generated surfaces; runtime/component pins refreshed |
| Historical live records | `node scripts/harness-evidence.mjs` | Four historical role smokes and two historical writer smokes pass at their recorded v0.16.0 / WO-042 source; no new native-hook episode claimed |
| Semantic identity | `node scripts/artifact-identity-evidence.mjs --check` | Four current files verified; original semantic hashes and frozen oracle unchanged |
| Authority evidence | `node scripts/authority-evidence.mjs --check` | Existing evidence retained under release-label projection; denials and bundle comparisons pass |
| Verification evidence | [Edition transcript](verification-edition-transcript.txt), `node scripts/verification-evidence.mjs --check` | Four fresh files reproduce planted defect, repair, staleness and replay |
| Fresh live feedback | `DOTLN_LIVE_WORKERS=1 node packages/skeleton/dist/src/dotln.js feedback-audit --store .runtime/feedback-audit-wo048 --transport codex-cli-exec --model gpt-6-astra --effort max`, approved outside sandbox; then `--record-selfhost` and `--check` for revision 001 | Phase complete, all independent verifier rows accepted; ten passing regressions and ten removal failures in [the selected edition](feedback-001/feedback.json) |

The live feedback audit covers its declared source projection. Its 1,192 fewer
instruction bytes are a matched projection measurement, not total workflow
savings. The unnumbered feedback report remains an unselected preliminary
observation; revision 001 records the final source and live verifier.

## Release, write-backs and limits

Application `v0.20.1`, skeleton `0.17.1`; canonical local release preparation
accepted the target against the local v0.20.0 tag snapshot. No new dependency,
persisted schema, compiler/kernel contract, or hash-preimage change. Compiler
and kernel components retain their prior versions. Prior evidence is immutable.

Write-backs cover architecture 03's read-path guarantee, the skeleton runbook,
this inventory and decisions/index, the staged release/roadmap text, and the
two publication outline summaries/source locks made stale by those changes.
The executor skill substitutes the decisions file/index for this older order's
ledger duty. No branch commit or publication is part of this dispatch.

Existing single-writer and acquisition-guard assumptions remain. This does not
provide transactions against an uncooperative same-user writer changing files
during a running host, a new repository-content schema, or authenticity for a
writer able to replace both inputs and evidence. A leftover pending receipt
requires inspection rather than automatic deletion. Current-byte generated
surface checks and corpus snapshots establish the narrower claimed behavior.

Installed CLI observation: `codex-cli 0.154.0`. Effective parent model/effort
readback is unavailable; the completion attestation records unknown rather
than infer it from the repository defaults. The live verifier launch explicitly
selected gpt-6-astra / max. Read-only executor assistance audited the boundary;
the parent remained the sole worktree writer. Entry usage counters are unknown
(source unavailable, scope dispatch, cutoff 2026-09-15T22:32:03.290Z); final
counters stay in ignored receipts and the handoff.

## Full gate

The first attempt overlapped a still-running metadata refresh. The executor
stopped it through `harness evidence --stop`; it ended after 13.1 seconds with
no check recorded. The [stopped transcript](stopped-gate-transcript.txt) is
retained. Metadata generation completed before the replacement gate started;
that gate runs with no concurrent writes to its inputs or success record.

`npm test` passed all 19 suites / 62 fresh tasks, with zero failures, in
262.93 seconds; [full transcript](npm-test-transcript.txt). This includes the
unchanged WO-009/WO-010 tests on the final source. `git diff --check` is clean.
No runtime or test source changed after this gate; final edits record these
results and the handoff. The queue is empty at revision 0.

The implementation, inventory, corpus, fresh evidence, classified local release
and write-backs are complete. `implementation-ready` is the canonical handoff;
independent verification and final review remain their separate dispatches.
