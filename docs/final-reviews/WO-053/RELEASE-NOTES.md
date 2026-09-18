## Release overview

For the first time a DotLn-dispatched worker changed source in a repository outside DotLn and the host proved what it touched. In a synthetic scratch repository, a Claude worker and a Codex worker each fixed one wrong function, turned the host's focused test from red to green and committed exactly one file, while the DotLn checkout, the target's main checkout and a sibling sentinel directory stayed byte-identical. A Codex host killed after its worker committed recovered that commit by identity without dispatching a second worker. This patch publishes those receipts, the fixture that produced them, and the bounded writer repairs the live episodes exposed.

The audience is anyone deciding whether the source-change primitive is real: it is, for one bounded task on each installed harness. It is not yet dependable general operation, and the receipts say exactly what they do and do not establish.

## Read before upgrading

Application patch `v0.29.3` stages skeleton `0.25.2`. Kernel, compiler and console versions, event schemas and dependency sets are unchanged; `package-lock.json` moves only the workspace's own skeleton version.

Claude writer episodes now launch with `--output-format json --json-schema` and the transport requires the native `structured_output` in the terminal result; display prose is never parsed as a writer result, so a Claude CLI that cannot return a schema result fails the episode as `invalid-result` rather than being tolerated. The emitted target guard classifies Claude's data-only `StructuredOutput` tool as a read; unknown tools still refuse and the three host-issued effectful Bash routes are unchanged.

The writer prompt now carries explicit bounded inspection instructions for the assigned worktree. These are prompt-level text. Enforcement remains the Codex `dotln-writer` workspace-write profile with network disabled, the compiled Claude guard, and the host's before-and-after checks; nothing here adds a shell classifier or proves filesystem confinement beyond the protected paths the host snapshots.

No account setting, launch default, permission rule or remote effect changes. The regenerated Claude hooks and manifest are pin-only.

## Substantive changes

- Source-change worker, Claude transport: aggregate JSON launch with the result schema; the decoder rejects a terminal lacking `structured_output` or `permission_denials` and takes the denial count from the latter. The pinned canonical launch shape and the process double are updated in the same change, and the double gains `missing-structured` and `invalid-structured` negative behaviours.
- Source-change worker, target guard: `StructuredOutput` is admitted as a data-only read; the emitted-hook regression asserts the admission and that an unknown output tool still refuses.
- Source-change worker, prompt: bounded inspection instructions authorize native reads or a literal list of read-only shell commands run one at a time; the output instructions state that the declared test, `git add -A` and the host's commit command are the only effectful commands authorized.
- Live evidence: an evidence-local fixture creates the synthetic target, compiles the worker loadout through the existing compiler with no supports or grants, runs episodes through the documented `SourceChangeHost` API, and records receipts with protected snapshots, host test results, independent Git identity and the parent handoff byte count. A versioned receipt validator and a regression test pin the shape, the epistemic labels and the privacy screen, and reject forged passes.

## Progressive polish

The root README, roadmap, capability table, planning map and critical-path checkpoint now point at the live receipts; the skeleton README's writer runbook describes the schema result and inspection authorization; the decisions index and follow-up register carry WO-053's three decisions; the evidence manifest selects fresh WO-053 authority and feedback editions and the console selfhost fixtures follow them. The fixture replaces the machine-specific Node executable with a fixed placeholder token in public receipts.

## Evidence and compatibility

Source: branch `wo-053` on base `8471dc7e42aadfa64206771dae09541d6b1942b6`, the commit that carries the published `v0.29.2` tag; the reviewed commit series is on the pull request. Component versions: application `v0.29.3`, skeleton `0.25.2`, compiler `0.13.0`, kernel and console unchanged. No migration is required.

Verification: [VER-001](../../verifications/WO-053/VER-001.md) passed all six acceptance criteria with its own `npm test` run; [FINAL-001](FINAL-001.md) re-derived the handoff byte counts, the loadout-hash split, the recovery invariants and the privacy screen from the receipt bytes and re-ran the review gate — 26 suites passed, 0 failed, 812.79 s, exit 0, recorded `2026-09-18T00:39:01.270Z`.

Known limitations, as the receipts state them: the proof bounds an observed effect on the protected paths, not universal filesystem confinement; the kill lands after the worker has exited, so orphan-worker fencing is unproven; the parent handoff measures the evidence collector's child-stdout sink, and growth of the complete executor conversation is unknown; harness version, model and effort are launch claims with unknown effective readback; cost counters cover successful episodes only and no efficiency claim is made. Independent verification of a worker's change (WO-054), repair-loop orchestration (WO-055), remote publication (WO-064) and the operator's own repositories remain separate work.

Deeper notes: [WO-053 evidence README](../../evidence/WO-053/README.md), [decisions](../../evidence/WO-053/decisions.md), [implementation record](../../evidence/WO-053/implementation.md), [the order](../../work-orders/WO-053-first-external-source-change.md).
