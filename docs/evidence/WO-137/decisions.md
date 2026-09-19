# WO-137 decisions

## WO-137-D001 — Probe the installed runner with bounded sequential calls

```json
{
  "id": "WO-137-D001",
  "date": "2026-09-18",
  "dispatch": "resume: next",
  "decision": "Use the installed LM Studio CLI and existing Qwen3.6 27B Q4_K_M artifact; collect a reproducible client packet with conservative readiness and sequential short calls.",
  "evidence": ["docs/work-orders/WO-137-local-runner-readiness.md", "docs/discovery/local-inference.md", "operator's prior Terminal observations and thermal caution on 2026-09-18", "LM Studio 0.4.24+1 and CLI ff50809 inventory; empty loaded-model list; successful explicit loopback start and completion"],
  "rejected": [
    {"option": "NoOp", "reason": "Leaves the local transport and qualification decisions dependent on the obsolete failed launch."},
    {"option": "Install a runner or download another model", "reason": "Existing artifacts suffice for the bounded experiment; neither change is authorized."},
    {"option": "Parallel generations or long benchmark loops", "reason": "Unnecessary to answer readiness and contrary to the operator's resource caution."},
    {"option": "Treat accepted requests or client abort as complete proof", "reason": "Requires independent response validation and observed runner state."}
  ],
  "reopenWhen": "Three attempts repeat a blocker, the operator stops, thermal pressure is reported, or the bounded session expires."
}
```

The packet is the interface consumed by WO-110 and WO-138. It reduces the
readiness uncertainty on the route toward local model participation in the
source-to-deliverable loop; no model quality or capability promotion follows.
The working CLI start is reused rather than the previously mismatched GUI path.
The API alias is not an artifact identity. Qwen's advertised tool support is
only a selection reason until an actual round trip succeeds.

Policy resistance: respect host permissions and do not change runner settings.
Commons: one loaded model, context 4096, parallelism one, short capped outputs,
idle/thermal checks, and no live inference during product gates. Drift and rule
beating: preserve failed requests, output differences, missing metrics and
independent stop observations. Escalation: no new recurring gate or hook; the
one deterministic probe suite joins the existing test inventory as required by
criterion 4. Success to the successful: this tests the installed candidate,
without excluding a later operator-selected runner. Shifting the burden: record
exact reproducible commands and distinguish manual history from executed steps.
Wrong goal: useful readiness evidence, not maximizing success labels or runs.
Naive Interventionism: keep existing useful runtime behavior, no persistent
configuration changes, no download; unload this session's model and stop this
session's server afterward. NoOp preserves the old unknown and loses to this
small reversible experiment. All unavailable observations remain unavailable.

The operator's resource caution tightens the method: use short requests and
serial repository tests after unloading inference. No thermal safety guarantee
is inferred from LM Studio or from an absence of OS warnings.

Correction: the initial API check failed before server startup. It did not
show that the documented start command failed. The explicit CLI start then
succeeded, status reported port 1234, and both model-list endpoints responded.
The prior operator loading suggestion remains unobserved; this session observed
an empty loaded-model list and performed its own load.

Entry usage: counters unavailable, dispatch scope, cutoff
2026-09-18T22:25:46.902Z. Harness observed zero subagents before delegation;
one read-only documentation helper was then admitted, no descendants. Root is
the sole writer. Current actor readback: Codex CLI 0.155.0, gpt-6-astra,
ultra (xhigh with subagents).

## WO-137-D002 — Operator-authorized gentle staged load test

```json
{
  "id": "WO-137-D002",
  "date": "2026-09-18",
  "dispatch": "resume: next",
  "decision": "Expand WO-137 with the operator-requested two-minute staged sequential load experiment and automatic resource stops, retaining all original readiness obligations.",
  "evidence": ["Operator scope expand on 2026-09-18: let's do it now, referring to the proposed longer load test", "Nine successful protocol probes with cancellation and timeout records", "Native preflight: thermalState 0, memory pressure level 1, 66 percent free memory; pre-existing swap is recorded separately"],
  "rejected": [
    {"option": "NoOp or defer the load test", "reason": "The operator explicitly expanded the current order to perform it now."},
    {"option": "Saturation or concurrent generations", "reason": "Unnecessary for initial stability evidence and contrary to the operator's thermal caution."},
    {"option": "Rely on LM Studio guardrails alone", "reason": "Native resource monitoring and an independent deadline give observable stop conditions."}
  ],
  "reopenWhen": "Monitoring is unavailable, thermal or memory pressure rises, swap grows by 128 MiB, a gate appears, a request fails, the bounded traffic budget expires, or the operator stops."
}
```

This changes the earlier proposed deferral into an authorized experiment now.
The same goal and eight-lens analysis in D001 applies, tightened by one request
at a time, maximum ten requests, 128 output tokens, five seconds idle and two
minutes total traffic. The first two requests form stage one; the collector
inspects health before stage two. Native thermal state must stay nominal and
memory pressure normal; pre-existing swap is not blamed on the experiment.
Resource signals describe the whole host, not causal attribution to LM Studio.
These limits bound exposure rather than guarantee hardware safety. No system
or runner setting is changed. A monitored stop is useful evidence.

## WO-137-D003 — Retain protocol success and bounded-load observations without overclaiming readiness

```json
{
  "id": "WO-137-D003",
  "date": "2026-09-18",
  "dispatch": "resume: next",
  "decision": "File an inconclusive overall readiness packet with the successful protocol and bounded-load observations; stage application v0.30.1 as evidence-only patch without package changes.",
  "evidence": ["docs/discovery/local-runner-2026-09-18.json", "docs/discovery/local-runner-2026-09-18.md", "local v0.30.0 tag", "eight smoke and six load double tests; independent read-only audit"],
  "rejected": [
    {"option": "Promote to ready from seven true protocol booleans", "reason": "The contract also requires complete provenance and metrics; interrupted rates, effective template/default settings and attributable runner egress denial remain unknown."},
    {"option": "Repeat hot requests to fill absent telemetry", "reason": "HTTP, model-log and server-log observations already expose the missing interrupted statistics; no repeated generation creates an absent egress boundary."},
    {"option": "Treat nominal thermal readings as a safety guarantee", "reason": "They are sampled host observations and the native API can report nominal when unsupported or unknown."},
    {"option": "Change product packages or install stronger monitoring", "reason": "Outside this evidence-only implementation and unnecessary for the honest bounded result."}
  ],
  "reopenWhen": "A separately attributable runner boundary and effective template/default-setting and interrupted-token observers are available; or an integrating sibling consumes the staged patch version."
}
```

This meets the mission by replacing the obsolete n=0 launch result with
portable positive protocol evidence and clearly named remaining blockers.
WO-110 can consume the shapes without claiming a qualified transport;
WO-138 still requires a ready row. NoOp after the observed bounded run wins
over more heat, process and ungrounded completeness claims. The commons,
drift, rule-beating and wrong-goal lenses in D001 require those distinctions;
the other lenses and authority remain unchanged.

The read-only audit found four failure-path defects in the new smoke collector:
lost attempts on observer failure, timeout overwritten by cancellation,
empty failed outputs considered equal, and continuation after three failed
smokes. The executor corrected them with double regressions. The load audit
found that synchronous observers could delay cancellation; asynchronous,
bounded, non-overlapping native reads and a slow-observer regression corrected
that before the live load launch. This changes no successful smoke request
shape; no second live smoke was needed. The source remains under scripts/probes;
the existing test inventory includes only its double tests.

The activation left the version placeholder and a noncanonical classification
punctuation. Complete them as application v0.30.1 / patch under the existing
classification, consistent with the README release block; no component changed.
The separately authorized scope amendment remains bound in the planning log.

Same-day correction: the first full serial product gate passed twenty suites
but rejected the new `scripts/probes/*.test.mjs` inventory argument before
executing that suite. I misread the runner's supported glob contract: its
`expand` function admits built `*.test.js` globs, not `*.test.mjs`. Register
the two exact probe test paths, following the existing multi-file suite shape,
with file concurrency one. The focused double tests had passed independently;
that was insufficient evidence of gate integration. Run the actual selected
suite, then the full serial gate on the corrected registration. No live
request shape or product package changes, and no further inference run.

## WO-137-D004 — Integrate main and retime the unpublished target to v0.31.1

```json
{
  "id": "WO-137-D004",
  "date": "2026-09-19",
  "dispatch": "resume: final review",
  "decision": "Integrate main at 4d6dc769 and retime the unpublished application target from v0.30.1 to v0.31.1 under the existing patch classification, with no component bump and no change to scope, acceptance or the recorded outcome.",
  "evidence": ["docs/product/07-execution-guide.md#independent-workflows-and-integration", "docs/evidence/WO-137/decisions.md#wo-137-d003", "docs/product/06-roadmap.md", "README.md", "docs/work-orders/WO-137-local-runner-readiness.md", "origin tag observation v0.31.0 by npm run release -- prepare"],
  "rejected": [
    {"option": "NoOp on the superseded target", "reason": "main publishes v0.31.0, so a v0.30.1 tag would sit below the published baseline and release close would refuse it."},
    {"option": "Route the moved base through repair and a new verification", "reason": "Product 07 names a sibling's publication and a version collision as bookkeeping, never a finding; no source file conflicted and no probe, packet or test byte changed."},
    {"option": "Change the release classification", "reason": "The integrated diff still changes no component source, package version or dependency; patch still describes it."}
  ],
  "reopenWhen": "Another order publishes v0.31.1 before this branch merges, or an integration resolution changes component source and its declared compatibility impact."
}
```

Dispatch: `resume: final review`, recorded 2026-09-19T00:07:04Z. D003 named
this reopening condition ("an integrating sibling consumes the staged patch
version"). The literal collision did not occur; the stronger form did: WO-055
merged as PR #90 and published the minor `v0.31.0`, so `main` moved from
`d428180b` to `4d6dc769` and the staged `v0.30.1` fell below the published
baseline. D003 stays as recorded because it was correct at its own subject.

`npm run release -- prepare`, on origin's tag observation, retimed the order
heading, the README claim and the dated roadmap note to `v0.31.1`; the original
activation paragraph is preserved beside the retiming note. The merge met six
conflicts, none in a source file: the README claim, the roadmap release
boundary (a union of two dated paragraphs), the follow-up register (a union by
entry id: main's 395 entries plus D001–D003, with this branch's fourth revision
of the local-model candidate kept because main never touched that entry), the
control projection, the everyday edition lock and the work-order index, the
last three regenerated by their own commands. `scripts/test-runner.mjs`, the
probes, the packet and the evidence files did not conflict and carry their
verified bytes.

Goal and critical path: the readiness row reaches WO-110 and the post-close
planning checkpoint only once published, and a target below the baseline
blocks that. Policy resistance and escalation: no gate or authority is added;
the helper the execution guide assigns to this stage did the edit. Commons:
one merge, one helper run and one product gate on the integrated tree, no
second live inference and no fresh verification of unchanged claims. Drift and
rule beating: FINAL-001 names the claims re-established on the integrated tree
separately from those carried forward, and the outcome stays `inconclusive`.
Success to the successful and shifting the burden: the integrating session does
this work instead of asking the operator to sequence siblings. Wrong goal: a
publishable honest record, not a green surface check. Naive Interventionism:
the smallest edit that resolves the supersession is one version string in
three surfaces. NoOp loses because the staged target cannot be published.
