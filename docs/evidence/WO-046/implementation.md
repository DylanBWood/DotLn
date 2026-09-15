# WO-046 implementation evidence

Dispatch: `resume: next`, 2026-09-15. This is executor evidence; independent
work-order verification and final review require their separate dispatches.

## Delivered behavior

`ExecutableProgramV1` recursively narrows all six executable node kinds and
all continuation edges. Existing constructors select executable overloads when
possible while retaining full `Program.T` authoring. The stepper, decider,
residuals and waits carry the narrowed type; a compile-time equality check pins
the exported kind constant to that union.

`decodeContinuation(unknown)` replaces the unchecked deserializer and returns the
shared `DecodeResult`. Serialized and parsed inputs receive path-addressed
validation of nodes, drafts, Act commands, patterns, predicates and complete
Cadence timeout shapes. Non-JSON data, custom prototypes, cycles, malformed fields
and deferred Program kinds refuse before ordinary or verification state folds.
Serializer bytes and executable semantics are unchanged. Cadence evaluation and
registry lookup retain their existing responsibilities.

## Executed evidence

| Claim | Command or evidence | Observation |
| --- | --- | --- |
| Types and existing kernel behavior | `npm run build --silent`; `node --test packages/kernel/dist/test/*.test.js` | Build passed; 93 kernel tests passed |
| Malformed and deferred continuations; fold boundary | [continuations.tap](continuations.tap) | 10 tests pass; all five deferred kinds on every continuation edge, precise payload paths, malformed JSON, cycles, array prototypes, deep trees and both skeleton read boundaries |
| Corpus round-trip and recorded steps | `node --test corpus/harness/wo101-program-corpus.test.mjs corpus/harness/wo101-deferral-pins.test.mjs` | 10 tests pass; 7,784 trees / 38,920 bounded evaluations; decoded inputs reproduce recorded outputs and unchanged full-vector digest |
| Existing scenario, worker, verification and manual authoring integration | Focused skeleton scenario, worker, verification, entropy-reducer and WO-046 test files | 71 tests pass; crash/lease recovery, WO-003 oracle and replay assertions pass |
| Compatibility and generated bundle | `python3 docs/evidence/WO-046/check-compatibility.py`; [comparison](compatibility.json) | 18 fixture files unchanged; eight artifact/verification evidence outputs byte-identical to the prior edition; nine hook files and manifest differ only in runtime content pins |
| Evidence refresh | Current authority, artifact-identity, verification and feedback generators | New WO-046 editions preserve historical bytes; semantic hashes and artifact identities unchanged |
| Live feedback audit | `DOTLN_LIVE_WORKERS=1 node packages/skeleton/dist/src/dotln.js feedback-audit --store .runtime/feedback-audit-wo046 --transport codex-cli-exec --model gpt-6-astra --effort max`, then `--record-selfhost` and `--check` | Live verifier completed; ten positive fixtures and ten removal failures; independent acceptance matrix complete |

The feedback audit's 1,192 fewer instruction bytes concern its matched projection,
not total workflow savings. No native live-hook episode is claimed.

## Release and write-backs

Local preparation stages application v0.21.0, kernel 0.4.0 and skeleton 0.18.0.
Compiler and console versions, dependency inventory, event schema and hash inputs
are unchanged. Product 02, component READMEs, capability row, roadmap, decisions
and the generated decision index record the change. Capability remains L2 / E0;
this order does not supply real-session Await recovery evidence. The inherited
ledger duty is discharged by the decisions file and its index under the current
executor skill.

The read-only advisory worker found a custom-array-prototype hole, fixed with
an explicit rejection and regression before evidence generation. No adjacent
queue item remains (revision 0). The only writer is this executor.

Effective parent model and effort are unavailable to the session tools. The
repository default is gpt-6-astra / max; the lifecycle records effective values
as unknown. Installed CLI observation: codex-cli 0.154.0. The live verifier was
explicitly launched with gpt-6-astra / max. Entry counters were unknown, source
unavailable, scope dispatch, cutoff 2026-09-15T22:31:40.131Z. Final counters remain
in ignored receipts and the handoff.

## Required final gate

`npm test` passed **19 suites / 62 fresh tasks**, zero failures, in **291.85
seconds**. `git diff --check`, the 24-surface harness check, and the compatibility
comparison passed. All application source was final before that gate; subsequent
changes only record results and move the capability reassessment into its dated
addendum. The historical capability row is preserved.

Implementation obligations and write-backs are complete. The canonical
`implementation-ready` transition records the handoff; verification and final
review remain separate operator dispatches.
