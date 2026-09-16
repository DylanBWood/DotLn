# WO-050 implementation evidence

Dispatch: `resume: next`, 2026-09-16. Executor evidence; independent work-order
verification and final review remain separate dispatches.

## Delivered behavior

The existing exported reactor composes internal `SkeletonState` version 1,
selects exactly one walking, worker, verification or feedback fold, and writes
only that fold's slice back into the existing public `RuntimeState`. The
source-change slice is an empty typed slot without a fold. Hosts read exported
selectors; kernel predicates retain their complete previous state context.
Authorization, cadence, event schemas, hash inputs and the one-decider ownership
guard are unchanged. The operator explicitly chose internal composition to
resolve the conflict between a new versioned state shape and byte-identical
complete Decisions. WO-047's projector is pending; reserved public RNG/policy
keys remain in place.

## Acceptance evidence

| Claim | Executed evidence | Result |
| --- | --- | --- |
| Complete Decision and projection identity | [cmp transcript](identity-transcript.txt), [fixed manifest](../../../packages/skeleton/fixtures/wo050-identity.json), `node scripts/reactor-identity.mjs --check` | 19 fixed input cases compare every Decision including state, full semantic projections, and intermediate status/outbox prefixes without normalizing Decision state |
| Frozen scenario and ownership | [focused transcript](focused-transcript.txt), unchanged `scenario.test.ts` | 24 tests pass, including the frozen oracle, ownership import/decider guard, negative fixture, tamper sensitivity and recovery |
| Exclusive slice routing | `reactor-slices.test.ts` | Inventory is checked against actual case/literal handlers; shared event names have one owner per active mode; feedback opening, dynamic verification revocations and unknown observations retain routing |
| Selector-only hosts and reserved source-change slot | `reactor-slices.test.ts` | Grep guard covers scenario, worker/verification/feedback hosts, worker demo and Beacon host; empty typed source-change slot owns no event |
| Compatibility outside fixed logs | `reactor-slices.test.ts` | Malformed-null verification retains the decoder error; custom kernel predicates still receive worker lease fields |
| Runtime pins and editions | generated harness check; [authority](authority-final-edition-transcript.txt), [verification](verification-edition-transcript.txt), [feedback](feedback-final-edition-transcript.txt) | Fresh WO-050 editions preserve prior observations; artifact check retains the original semantic hashes and frozen oracle |

The pre-refactor capture ran against `7fd94aeb2a35c88dc4cf3a618e3138ca02d0b2c3`
before reactor/host edits. WO-009 retained summaries rather than raw worker logs,
so this order captures synthetic subprocess fixtures for both transports and
rows 2/4/6 once, then replays the same bytes. These are not new live worker
observations. Positive verification and feedback cases include the successful
WO-048 editions and a new feedback correction fixture. Original WO-010/011
compiled-artifact logs already refuse today; four cases preserve their exact
successful Decision prefixes and refusal location/message instead of claiming
successful completion. Input digests and complete output digests are frozen in
the manifest. The before/after full output files remain local under `.runtime/`.

The fresh live feedback command was
`DOTLN_LIVE_WORKERS=1 node packages/skeleton/dist/src/dotln.js feedback-audit --store .runtime/feedback-audit-wo050-final --transport codex-cli-exec --model gpt-6-astra --effort max`.
It returned phase `complete`, ten fixtures and 1,192 fewer instruction bytes in
its matched projection. This is a source audit with a read-only model verifier,
not independent WO-050 verification or a total workflow-cost saving. The
selected source edition retains its audit and verifier event streams.

## Release and write-backs

Application `v0.21.2`, skeleton `0.18.2`; local release preparation accepted the
patch target against local tag `v0.21.1`. Compiler and kernel versions stay
unchanged; no dependency, on-disk state schema or event was added. Runtime bundle
pins were regenerated. Write-backs cover architecture 03, the phase-two code
table's honored reversal condition, skeleton README, roadmap/release claim,
publication source summaries/locks, and decisions/index. For this order filed
before 2026-09-09, the executor skill substitutes the decisions file/index for
the ledger entry. No branch commit or publication is part of this dispatch.

Installed harness observation: `codex-cli 0.154.0`. Effective parent model/effort
readback is unavailable; the completion attestation records unknown. The
feedback verifier's launch explicitly selected `gpt-6-astra` / `max`.
A read-only assistant audited coverage and compatibility; the parent remained
the sole writer. Entry counters are unknown, source unavailable, scope dispatch,
cutoff 2026-09-16T00:16:55.891Z. Final counters stay in ignored receipts and the
handoff. No total-cost reduction is claimed.

## Full gate

The first gate was stopped through the canonical command after 94.3 seconds
when the read-only audit identified the future source-change ownership gap;
no check was recorded and no gate input changed while it ran. The
[stopped transcript](stopped-gate-transcript.txt) is retained. The final source
reserves an optional compatibility slot but omits it from current Decisions.
Authority and feedback revision 001 supersede the preserved preliminary editions.
The replacement `npm test` gate passed all 19 suites / 62 fresh tasks with zero
failures in 338.84 seconds; [full transcript](npm-test-transcript.txt). This
includes final-source identity, worker/verification recovery, generated bundle,
fresh feedback and verification editions, publication, formatting and release
surfaces. `git diff --check` is clean. No runtime or test source changed after
that pass. The queue is empty at revision 0. `implementation-ready` is the
canonical executor handoff; work-order verification remains a separate dispatch.
