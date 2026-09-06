# WO-010 executor evidence

Implementation subject: [WO-010](../../work-orders/WO-010-independent-verification.md), application target `v0.12.0` above published `v0.11.0` (`1a81e008611731883d43eb19743c5dcb9205b062`). Compiler `0.5.0` and skeleton `0.11.0` change; kernel `0.2.1` and the existing event-envelope/compiled-loadout schema versions are unchanged. No dependency was added.

Executor: Codex CLI `0.153.4`, GPT-6 Astra, `max`, `operator-attested` under the execution guide's 2026-09-04 default. The installed harness version was observed with `codex --version`; model and effort are not effective-session readback. This receipt is executor evidence, not independent verification of the implementation.

## Acceptance mapping

| Criterion                                                       | Named executable evidence                                                                                                                                                                                                                                                                                             | Recorded result                                                                                                                                                                                              |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AC1 — planted defect → finding → repair → green re-verification | `WO-010 AC1/2/3/5 <transport> dispatch → finding → fresh focused repair → re-verification uses the kernel loop`, in [verification.test.ts](../../../packages/skeleton/test/verification.test.ts), for both CLI transports                                                                                             | [events.jsonl](events.jsonl): first verifier fails `AC-selection`, a fresh repairer proposes `policy.json`, another verifier passes the affected criteria                                                    |
| AC2 — structural blinding and no implementer certification      | Compiler test `WO-010 AC2 verifier compilation positively selects nested context, is pure and cannot retain implementer prose`; skeleton tests `implementer-emitted events and repair results cannot certify acceptance` and `claim types, evidence sources, observations, subject and result shape are host-checked` | Sentinel narrative stays out of all three launches. Forged events, roles, subjects, evidence and unsupported passes cannot update acceptance                                                                 |
| AC3 — full typed findings and focused repair WorkOrders         | Compiler test `WO-010 AC3 only complete blocking findings compile focused repair WorkOrders`; skeleton test `WO-010 AC3 each blocking finding has its own compiled repair; repair limits stop without greenwashing`                                                                                                   | Failure records criterion, severity, observed/expected, reproduction, evidence and likely surface. Two blocking findings produce two distinct compiled plans. Execution rechecks after each applied repair   |
| AC4 — substantive repair stales affected evidence               | Compiler test `WO-010 AC4 repair radius follows changed dependency surfaces and fails closed on unknown surfaces`; skeleton test `WO-010 AC4/5 dotln status exposes stale evidence mid-workstream and is read-only`                                                                                                   | [stale-status.txt](stale-status.txt) and [stale-status.json](stale-status.json) show `AC-policy` and `AC-selection` stale, with `AC-description` still verified                                              |
| AC5 — matrix throughout the workstream                          | The two transport end-to-end tests, the mid-repair status test, and the pure replay test                                                                                                                                                                                                                              | Rows begin incomplete, acquire passing/failing evidence, become stale on the changed subject, and retain historical evidence in the [final matrix](matrix.json). Status reads leave the store byte-identical |

## Witnessed loop

The host creates a synthetic repository and runs a baseline where selection excludes referenced files. It then deliberately changes the JSON policy to include referenced files. This is original fixture data; no intake, operator repository contents or employer material is used.

The recorded loop is compactly indexed by these events:

| Event                                 | Evidence                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `evt_2 VerificationOpened`            | Baseline and candidate snapshots, criteria and explicit host authority; every row initially incomplete              |
| `evt_5 CommandPersisted`              | Blinded verifier capsule, pinned diff/source/evidence and authorized command                                        |
| `evt_9 CommandResult`                 | Verifier observes `["unused.tmp","used.tmp"]`, expects `["unused.tmp"]`, records blocking finding and evidence refs |
| `evt_14 CommandPersisted`             | Fresh focused repair capsule for `policy.json`                                                                      |
| `evt_18 CommandResult`                | Repair proposal only, with no acceptance certification                                                              |
| `evt_22 VerificationSubjectSubmitted` | Host-applied source change; the fold derives two stale rows                                                         |
| `evt_24 CommandPersisted`             | Fresh verifier capsule for the changed subject and affected criteria                                                |
| `evt_28 CommandResult`                | New passing evidence; old stale evaluations remain in history                                                       |

All witnesses are explicitly `synthetic-fixture`. The behavior check runs a real Node subprocess over the pinned fixture interpreter and JSON inputs; state claims use actual file reads. The default transport is deterministic. Both production CLI adapters additionally pass the same loop through local subprocess doubles of their respective wire formats. No live model call or live-integration proof is claimed by this work order.

## Failure and recovery evidence

The focused suite checks killed workers, unavailable models in both transports, malformed or forged passes, incomplete output, original-producing-episode preservation on cached-result recovery, authority/revocation/lease fencing, and pure replay. Additional tests cover a crash after an admitted result but before its completion event, a committed repair before its subject event, and an explicit human disposition that holds a repair proposal. Dirty or drifted mounts use WO-009's existing tested worktree guard. The preexisting WO-009 worker suite passes against the extended transport/store contract, including a compile-time fixture for the original inspection-only adapter signature.

The implementation uses the kernel's existing `Program.Invoke`, result continuation, `authorize`, append-only event codec and outbox. The new verification branch is inside the existing typed `seiriReactor`; the live driver and kernel replay compare the complete Decision sequence. The small `verification.ts` surface only projects that shared reactor. The evidence generator runs the mechanism under test, so it is not an independent oracle; the acceptance tests separately assert actual fixture output, denial cases, event order, stale/unaffected row behavior, physical episode/worktree separation and durable recovery.

The first full-suite run found one architecture failure: WO-016's decider-ownership guard rejected a separate verification decision module. The implementation was corrected to route verification through the existing typed reactor and kernel replay; the guard still forbids kernel deciders at the edge. Its import inventory now admits the pure verification protocol and checks that the new projection/protocol leaves perform no I/O. The focused identity test compares all Decisions, not only the final matrix.

## Final validation — 2026-09-06

The final `npm test` run exited 0: all 263 package tests and all 8 WO-101 corpus tests passed, with zero failures, skips or cancellations. The gate also passed the shell lifecycle/worktree/release fixtures, formatting, 230/230 publication heading coverage and both source locks, generated work-order index, unchanged legacy semantic-hash/oracle checks, and both four-file evidence receipts. The architecture correction separately passed 35 focused tests before the full rerun.

`release check-surfaces` passed against the published `v0.11.0` tag: source target `v0.12.0`, changed/bumped compiler `0.5.0`, unchanged kernel `0.2.1`, changed/bumped skeleton `0.11.0`, and no premature final-review bodies. Its first sandboxed GitHub query was denied by network isolation; the approved one-time read-only retry passed. The [CLI smoke](cli-smoke.txt) executes the documented `verify-demo` command and checks the status projection for three verified criteria, no running episodes and no pending commands. `git diff --check` is clean.

## Reproduction and documentation

```sh
npm ci --ignore-scripts
npm run build
node --test packages/compiler/dist/test/verification.test.js packages/skeleton/dist/test/verification.test.js
npm run evidence:verification -- --check
npm test
```

`evidence:verification -- --write` regenerates the four synthetic loop artifacts after an intentional source change. `evidence:artifact -- --write` records the current compiler-version edition under [artifact-identity/](artifact-identity/); prior WO-029 and WO-022 receipts remain unchanged. Both checks are in `npm test`.

Factual write-back covers the pinned payload/staleness/matrix contract in product 02, the transport/verification port in product 03, application assignment and capability boundary in roadmap 06, schema/component distinctions in product 10, the root and package READMEs, planning recommendation, publication heading index and both audience routes, plus the append-only lineage entry. The generated work-order index is refreshed at the prescribed dispatch/result boundaries. The existing manual `resume: verify` workflow remains this repository's independent implementation gate.

The implementation remains bounded to host-read repository snapshots, two claim types and declarative JSON policy repair in a synthetic fixture. General source-writing providers, visual/network evidence, independent code review, post-PR loops and rating projections remain outside WO-010. There is no additional scope or permission deviation.
