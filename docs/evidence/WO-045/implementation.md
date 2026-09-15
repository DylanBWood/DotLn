# WO-045 implementation evidence

Dispatch: `resume: next` on 2026-09-15. The operator explicitly authorized the bounded compiler entry fix and AC4 update after the prelude bypass was demonstrated. This is executor evidence, not the independent verification verdict.

## Delivered behavior

- Kernel `tryDecodeLog` returns `DecodeResult`; `decodeLog` and append's existing-log check throw its line/path diagnostic. Closed schema-1 envelopes retain sequential IDs, finite numeric time and any JSON payload value. Numeric overflow and malformed optional IDs refuse. Iterative payload traversal accepts deep valid JSON without validator stack exhaustion.
- Hook input validates required/configured event fields and all declared optional fields. Plain supplied records are supported; unusual prototypes, declared accessor fields and unreadable inputs refuse. Extra native metadata is retained. The generated entry routes original stdin text into the decoder, preserves session and stateless recovery, and retains the existing event-specific protocol response.
- Local release preparation: application v0.19.0, kernel 0.3.0, skeleton 0.17.0, compiler 0.10.1. No dependency, event-schema, compiler-contract or hash-preimage change. Compiler version participation changes derived policy identity, while the policy contents remain identical.

## Executed evidence before the final gate

| Claim | Executed command / artifact | Observed result |
| --- | --- | --- |
| Malformed envelope and supplied hook boundaries | Kernel store decoder/history tests and skeleton harness-input test; [transcript](decoder-transcript.txt) | 9 tests passed; 22 distinct malformed envelope code/path pairs, each at physical lines 1 and 2; deep JSON and supplied-object cases passed |
| Historical store compatibility | `store-history.test.ts`, using explicit other-protocol path classification | 62 committed EventEnvelope streams / 3,857 events decode and re-encode byte-identically; 38 control/vector/mutation files classified under their own protocols |
| Generated hook malformed-input refusal | WO-045 generated hooks and WO-127 stdin checks in `scripts/test-harness.mjs`; [transcript](hook-transcript.txt) | 2 tests passed, including 10 malformed generated PreToolUse payloads, malformed prompt diagnostics, manifest-sized/chunked UTF-8 input and stateless recovery; malformed ordinary inputs wrote no host state |
| Recovery remains accessible | WO-131 operator-control and generated-prompt cases in `scripts/test-process-debt.mjs`; [transcript](recovery-transcript.txt) | 3 tests passed, covering missing runtime, bad pins, damaged state, live gates, foreign writers and no-Git/no-dependency recovery |
| WO-101 Program corpus | `node --test corpus/harness/wo101-program-corpus.test.mjs`; [transcript](program-corpus-transcript.txt) | 8 tests passed |
| Bundle scope | `node docs/evidence/WO-045/bundle-check.mjs`; [comparison](bundle-comparison.json); `node scripts/harness.mjs check` | 24 generated surfaces match; nine hook files plus manifest changed; only runtime/compiler/derived policy pins and approved entry logic differ |
| Historical live hook records | `node scripts/harness-evidence.mjs` | Four historical role smokes and two historical writer smokes remain valid at their v0.16.0 / WO-042 pin; no new native live-hook claim |
| Evidence editions | Artifact identity, verification, authority checks found prior editions stale; fresh WO-045 editions generated | Original semantic hashes and frozen oracle unchanged; synthetic planted-defect/repair/staleness/replay evidence passed |
| Fresh live feedback | `DOTLN_LIVE_WORKERS=1 npm run dotln -- feedback-audit --store .runtime/feedback-audit-wo045 --transport codex-cli-exec --model gpt-6-astra --effort max`, host approved outside sandbox; then `--record-selfhost` and `--check` | Phase complete; ten passing fixtures and ten removal failures; all independent verifier matrix rows accepted. Source is the declared feedback-audit projection, not a native-hook live episode |

The live audit's 1,192 fewer instruction bytes are its matched projection only, not total workflow token savings. The console selfhost fixture now points to this fresh evidence. Older evidence editions were retained unchanged.

## Write-backs and limits

Product 02 Memory and observation, all changed component READMEs, the capability row, this decisions file and index, and the release/roadmap target are updated. Store capability remains L2 / E0: this order adds no durable-adapter/real-worker recovery proof. Product heading anchors are unchanged. The executor skill substitutes the decisions file/index for this older order's ledger duty.

Valid recovery controls may bypass ordinary validation intentionally; they invent no lifecycle pass and retain host permissions. If the built runtime is wholly unavailable, generated bootstrap fallback remains advisory so recovery stays accessible. Payload meaning remains a reactor responsibility. No continuation decoder, projector, worker-result-store schema or history rewrite is added.

Effective parent model/effort are not exposed by this session's tools. Repository defaults are gpt-6-astra / max; the lifecycle attestation records effective values as unknown rather than claiming readback. The installed CLI reports codex-cli 0.154.0. The live verifier launch explicitly selected gpt-6-astra / max. Entry usage counters were unavailable (scope dispatch, cutoff 2026-09-15T18:32:21.882Z); final counters remain in ignored receipts and the handoff. Read-only advisory workers reviewed boundaries while this executor remained the sole worktree writer.

## Final gate

`node --test scripts/test-harness.mjs` passed all 26 tests in 321.50 seconds; [full transcript](harness-transcript.txt).

`npm test` passed all 19 suites / 62 fresh tasks, zero failures, in 450.49 seconds; [gate transcript](npm-test-transcript.txt). This is the executor product gate; the reviewer retains its separate review dispatch and source-selected machinery checks. `git diff --check` and current `harness check` passed. No code changed after this gate. Final edits only correct report anchors/wording and record these results.

Implementation deliverables and write-backs are complete. The canonical `implementation-ready` transition is the handoff; independent work-order verification remains outstanding by design.
