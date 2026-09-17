# WO-137 — Local runner readiness: the installed LM Studio build either serves reproducible noninteractive calls that DotLn can invoke, capture, cancel, time out and evaluate, with full provenance, or leaves a failure artifact that names the blocker (version assigned at activation)

**Model:** any capable model for the agent; the local runner is the subject
of the order, not its actor. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier any; reviewer any.
**Release classification:** patch, evidence-only. A probe client under
`scripts/probes/` and one discovery packet; nothing under `packages/`.
Assigned at activation under the standing opt-out default.
**Cost:** removes the unknown that has held WO-110 and the product 06
candidate since 2026-09-03 (WO-027 recorded `n=0` after the only permitted
launch crashed the service) and the repeated setup explanation the
guided-operator candidate names. Adds one probe client with double-endpoint
tests, one packet and a bounded operator session: budget 90 minutes of
operator time, three attempts per blocker, no model download above 10 GB
without an explicit operator decision. No gate, hook or recurring step;
the live smoke never runs inside `npm test`.

**Nomination provenance:** 06-roadmap.md §Candidate — local-model
usefulness experiments and 07-execution-guide.md §Candidate — guided
operator work orders (operator ideation 2026-09-16 during WO-051,
synthesized in [the breakout receipt](../evidence/WO-051/ideation-local-models.md));
the operator-endorsed third-party brief of 2026-09-17, §4 and §5; the
[2026-09-17 pass](../planning/vision-into-use-2026-09-17.md) §3 (M5) and
§13. Planner-synthesized draft. Clean-room screen: no stop condition.

**Depends on:** WO-027 merged (the probe's row contract and the deferral
condition this order answers; closed).

**Recommended placement:** pair 3 beside WO-054; after WO-136 so the
operator's outside-terminal time is not split between two orders; before
WO-110, which is written from this order's row. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-027",
    "relation": "satisfied-by-close",
    "reason": "the local-inference probe whose deferral condition this order answers"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/discovery/local-inference.md` and
`.json` (WO-027's rows and its deferral condition);
`docs/work-orders/WO-027-local-inference-probe.md`; 06-roadmap.md
§Counterfactual profiling work orders (the profiling contract) and
§Candidate — local-model usefulness experiments; 07-execution-guide.md
§Research and guided-operator work orders;
`docs/work-orders/WO-110-local-model-transport.md` (the consumer of the
row); the runner vendor's CLI and API documentation as cited in the packet.

**Objective:** The question: can the installed runner (LM Studio; the
`lms` CLI at commit `ff50809` was observed on 2026-09-17, newer than the
build WO-027 probed) serve a pinned model over its loopback HTTP API to a
noninteractive client with deterministic output at temperature 0 and a
fixed seed across three repeats, a structured response validated against a
JSON schema, one tool-call round trip, cancellation mid-generation, a client
timeout, and recorded latency and throughput — and which exact setup steps
the operator had to perform to get there. The decision it informs: whether
WO-110 is written from a live row now (outcome `ready`) or waits (outcome
`negative` or `inconclusive`, with the blocker named), and which model
artifact WO-138 pins.

**Observed gap (dated 2026-09-17, `main` at `ec502c9`):**

- WO-027 (2026-09-03): the sole permitted `lms server start` crashed the
  service; load and generation outcomes `n=0`; deferred under a named
  condition (an available runner completes the fixed three-request smoke
  with attributable egress behavior).
- The application is installed and the CLI build changed on 2026-09-15; the
  server is not running and nothing listens on the loopback port; readiness
  of the current build is unknown. The session sandbox cannot start the
  service, so the operator's outside terminal is part of the method.
- Hardware observed: Apple M3 Max, 48 GB.

**Design (scope discipline):**

- Guided: the agent proposes each step from the observed result — start the
  server bound to loopback, list models, load the pinned artifact, run the
  fixed three-request smoke, the determinism triple, the schema request, the
  tool-call round trip, the cancellation and timeout cases — and the
  operator performs what the sandbox cannot from an outside terminal; after
  each step the agent records what was observed and adapts the next step.
  Unexecuted proposals stay distinct from observations. Progress lives in
  the packet so a later session resumes the same order.
- Provenance per the profiling contract: application and CLI versions,
  model artifact and quantization, context length, runtime backend, hardware,
  settings, budget, and the no-egress evidence by WO-027's method where the
  boundary can be attributed.
- Permitted effects: starting and stopping the local server, loading a model
  already on disk or one the operator explicitly downloads, writing under
  `docs/discovery/` and `scripts/probes/`; nothing else.
- Stopping conditions: the budget is spent; a blocker repeats three times;
  `ready` is achieved.
- Live runs happen only when no product gate is running on the host, and
  the packet records that check; the gate bands are timing evidence.
- **Declined alternatives, recorded:** installing another runner without an
  operator choice (a failure artifact may name one as the next action); an
  embedded inference runtime; any quality claim about the model.

**Deliverables:** `scripts/probes/local-runner-smoke.mjs` with
double-endpoint tests; `docs/discovery/local-runner-<date>.md` and `.json`;
the write-backs below.

**Acceptance criteria (all required)**

1. The packet records every step attempted, its observation label, and the
   operator action it required; unexecuted proposals are marked as such.
2. On `ready`: the three-request smoke, the determinism triple (byte-identical
   outputs or the recorded diff), the schema request validated by the
   client, one tool-call round trip, one cancellation observed to stop
   generation within five seconds, one timeout observed, and latency and
   tokens per second for each — all from the client's own records, with the
   provenance fields complete.
3. On `negative` or `inconclusive`: the failure artifact names the attempted
   path, the observed errors reduced to shapes, the ruled-out causes, the
   remaining blocker, and the next useful action or reopening condition; the
   order closes without marking readiness achieved.
4. The probe's double-endpoint tests pass inside `npm test`; the live smoke
   never runs inside `npm test`; live runs were made when no product gate
   was running.
5. Write-backs land: 06 §Candidate — local-model usefulness experiments
   gains a dated readiness paragraph; `docs/discovery/environment.md` gains
   an addendum row; ledger entry. `npm test` green; `git diff --check` clean;
   no new dependency; no change under `packages/`.

**Evidence gate:** the packet; the probe's tests; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** model quality claims; a transport (WO-110); comparisons
(WO-138); installing a different runner without an operator decision; any
change to harness settings; any capability-level claim.

**Operator-review assumptions**

1. The operator is present for the outside-terminal steps and may stop at
   the budget; a failure artifact is a complete close of this order.
2. A model download is an explicit operator decision recorded in the packet
   with its size and license.
