inconclusive: WO-137 completed its bounded runner-readiness investigation and
the operator-expanded two-minute load experiment, with successful protocol
observations and explicit remaining provenance/boundary gaps.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.0","model":"gpt-6-astra","effort":"xhigh","mode":"subagents","raw":"ultra","source":"codex-session-readback"}

The [discovery narrative](../../discovery/local-runner-2026-09-18.md) and
[machine-readable packet](../../discovery/local-runner-2026-09-18.json) retain
the work. The installed LM Studio application is 0.4.24+1, CLI ff50809,
response runtime llama.cpp 2.38.0, on Apple M3 Max with 48 GiB. The existing
Qwen3.6 27B Q4_K_M weight and vision projector are separately hashed; alias
dotln-local remains distinct. No model download, package dependency, product
package source, persistent setting or fan-control change occurred.

Explicit CLI start and load worked. The fixed n=3 smoke is byte-identical;
the client validated structured output against its exact schema, checked and
completed one tool round trip, observed mid-generation cancellation and idle
within 164.07 ms, exercised a 100 ms timeout and recovered with READY. Native
responses and independent logs carry timings, model/runtime metadata and the
available token statistics. Earlier operator Terminal observations remain
starting context. The first default-reasoning diagnostic exhausted its short
token cap; the observed request-level reasoning setting produced an answer.
Failures of a displayed variant key and runtime inventory JSON flag are kept.

The operator then explicitly expanded this order to perform a gentle load test
now. D002 and the canonical planning amendment bind that additional authority.
It ran one request at a time, context 4096, maximum 128 output tokens, five
seconds rest, at most ten requests and a two-minute traffic deadline. Nine
requests completed; the tenth timed out at its remaining-budget deadline.
The collector recorded 130 samples with nominal native thermal state, normal
memory pressure and no increase from 1,192.81 MiB existing swap. Rates ranged
17.790–18.673 tokens/s. The first-stage health check preceded continuation.
The final idle observation completed at 120.190 seconds; unload and server
stop were then confirmed. This is a short bounded result, not saturation,
sustained capacity or a hardware-safety guarantee.

Overall readiness remains inconclusive: an attributable no-egress runner
boundary was absent, effective template/default settings were not fully read
back, and interrupted cases yielded no throughput statistics. A during-
generation snapshot found only loopback sockets, which is not prevention or
proof of no traffic over time. The protocol and load successes are usable
evidence for WO-110, whose unavailable-readiness route remains valid; WO-138
still needs its ready prerequisite. No capability or quality promotion is made.

The probe clients and their double tests live under scripts/probes. The existing
test-runner inventory now runs those doubles inside npm test; no live model
command is imported or executed by tests. Four initial collector failure-path
defects and the load monitor's blocking-read issue were corrected after the
read-only audit, with focused regressions. Only two read-only helpers were
used, with no descendants; the executor remained the sole writer.

The required roadmap paragraph, environment addendum and expressly required
ledger write-back are present. The everyday edition's existing roadmap-root
reference was reviewed: the new observation does not alter its summarized
capability distinction, so its source lock was refreshed. The planning check
passed after syncing the newly added decisions. Application v0.30.1 is staged
under the existing patch classification, with no component bump; local release
preparation confirmed that target. No commit, push or publication occurred.

Focused doubles passed fourteen tests, including active-request health abort,
deadline responsiveness with a slow observer, early refusal, output retention,
tool validation, split SSE frames, two independent endpoints and the three-
attempt stop. Full product gate and final document-check results are recorded
in the local gate receipt and executor handoff after this report's cutoff.
The live packet is frozen at its stated observation times; final test timing
and usage counters are not backfilled into live observations.

The first full serial gate passed twenty suites and failed the probe suite
before launch because the inventory used an unsupported `.test.mjs` wildcard.
The registration now names both files explicitly and limits test-file
concurrency to one. D003 records the correction; the actual selected suite
and full serial gate are rerun on that registration. The independent fourteen
double passes were never treated as a passing full gate.
