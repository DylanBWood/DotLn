# WO-126 repair of VER-001

Authority is the operator's `resume: fix` dispatch and the subsequent explicit
Node-only build decision. VER-001 remains immutable. The executor is Codex CLI
0.153.4, GPT-6 Astra at max, operator-attested; effective effort readback is
unavailable. Verification remains a separate dispatch.

| Finding | Repair and executable evidence                                                                                                                                                                                                                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1      | Normalize path-qualified programs and supported wrappers before effect classification; process-debt cases cover denied Git, GitHub, package and shell invocations. Unsupported indirection refuses with a classification reason.                                                                                                |
| F2      | Bound package test-file concurrency to at most two within the existing outer runner. Preserve the suite inventory, build barrier and exclusive package group. The existing 120-second fast-gate budget is unchanged.                                                                                                            |
| F3      | Preserve quoted multiline arguments and shell continuations. Scope Git directory overrides to global options so `git rev-parse --git-dir` stays a read. Tests distinguish invocation effects from literal argument data and named classifier refusal from missing runtime.                                                      |
| F4      | Use staged Node-only compilation and atomic file replacement. A fixture builds with an empty PATH and invokes installed hooks continuously and at publication boundaries. Publication tests check complete old/new file bytes, stale removal and symlink refusal. The operator's amendment is in the execution record and D007. |
| F5      | Prefer the exposed running executable over PATH; preserve an explicit hook version and record the observed channel. Conflicting executable/PATH fixtures cover discovery and the session warning.                                                                                                                               |
| F6      | Record snapshot duration, file/byte count and subprocess count in the existing journal, aggregated per order and dispatch. Correct the omitted recurring cost in the execution record; tests check observed counts and unavailable values.                                                                                      |
| F7      | Emit the aggregate Stop finalizer only; remove three unwired unit hooks from the generated bundle. Nine live hook paths remain, including the Git hook. Bundle and existing unit-policy subprocess fixtures remain covered.                                                                                                     |
| F8      | Bound hot cache metadata to 256 rows, archive older rows by tree, omit passing stdout and preserve failure output separately. Stress, historical lookup, exact-tree invalidation and concurrent-writer cases retain useful evidence. Historical disk use is not capped.                                                         |
| F9      | Accept the generated artifact's declared suite or full gate at the exact tree. A failing verifier can validate its index without proving code green; missing, wrong and stale checks still refuse.                                                                                                                              |

## Publication comparison retained for future decisions

The [repair timing observation](repair-timings.json) records a successful
108.72-second fast gate (12 suites) and 43.21-second document gate. The existing
120-second fast budget is unchanged. These are observations of their named
trees; final exact-tree checks cover subsequent write-backs.

[Raw samples](build-comparison.json) cover five alternating paired runs on one
macOS arm64 host, Node 22.2.0 and Python 3.11.7, with 254 compiled files
(1,845,748 bytes) across four packages and four small changing canaries.
Every resulting file matched its staged candidate.

| Method                               |   Minimum |    Median |   Maximum | Publication subprocesses |
| ------------------------------------ | --------: | --------: | --------: | -----------------------: |
| Node per-file replacement            |  27.96 ms |  28.24 ms |  29.05 ms |                        0 |
| Historical Python directory exchange | 341.74 ms | 346.46 ms | 362.13 ms |                        4 |

This measures publication only, excluding compilation, copying, hashing,
validation and version probes. Python is invoked through the host's PATH, so
interpreter resolution/startup contributes to that method. Five local samples
do not establish other-host performance or total build savings. The methods
have different guarantees: Python exchanges each package directory atomically;
Node replaces complete files, so ordinary `dist` changes until the build barrier
finishes. Both publish packages sequentially. Installed hooks read an immutable
pinned snapshot throughout. Use
`node scripts/benchmark-build-publication.mjs --compare-python` only when the
optional interpreter is already available; the normal build and gates do not
need it. Retain this edition when making later comparisons.

VER-001 measured approximately 137 ms and 6,937,496 bytes per warm authorship
snapshot. Claude takes two snapshots per writing tool (four Git subprocesses),
so that observation implies about 274 ms and 13.9 MB hashed per pair, excluding
hook startup and other guards. Current measurements are in the meter's
`authorship*` fields. Explicit Codex batches are labeled and are not represented
as automatic per-tool hooks. Snapshot bytes are not context-delivery bytes.
The 02:54:25 UTC repair meter observation recorded five explicit snapshots:
667.44 ms total, 133.49 ms mean, 35,102,051 bytes hashed and ten Git subprocesses.
This measures the snapshots themselves, excluding adapter startup and output
obligation calculation; it is not a claim about complete per-tool latency.

The final gate records in the local exact-tree cache cover the handoff subject.
The original gate-timing and meter baselines retain their original observations;
subsequent repair measurements belong to separate records. The same-session
[ideation breakout](ideation-alternatives.md) preserves a candidate mechanism for
eliciting such alternatives routinely without claiming it is implemented here.
