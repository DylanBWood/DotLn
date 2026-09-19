# Local runner readiness — 2026-09-18

inconclusive: live protocol behavior passed, but this session did not establish
the full readiness contract's attributable no-egress boundary and complete
per-case throughput/provenance. This is a useful successful-inference row, not
a claim that WO-027's entire deferral condition has been discharged.

Work order: [WO-137](../work-orders/WO-137-local-runner-readiness.md).
The [JSON packet](local-runner-2026-09-18.json) retains client requests,
outputs, latencies, server statistics and independent model-state observations.
The [decisions](../evidence/WO-137/decisions.md) record the operator dispatch,
alternatives, corrections and explicit load-test scope expansion.

## Setup and provenance

The operator's earlier normal-Terminal start, model-list response and
`No models loaded` error are **operator-reported starting context**, not
completion evidence. The earlier suggested interactive load and cleanup were
not confirmed. The GUI path previously suggested did not match the interface;
this session used the CLI. The initial curl check here failed before starting
the server; the explicit CLI start succeeded. Loaded-model inventory was empty.

- Application: LM Studio `0.4.24+1`, read from the installed bundle.
- CLI: embedded commit `ff50809`, observed with `lms --version`.
- Actual response runtime: `llama.cpp-mac-arm64-apple-metal-advsimd`, `2.38.0`.
- Hardware: Apple M3 Max, 48 GiB unified memory, 16 physical cores; coarse
  values from `sysctl`, no device identifiers retained.
- Installed model: `lmstudio-community/Qwen3.6-27B-GGUF`,
  `Qwen3.6-27B-Q4_K_M.gguf`, 16,547,398,784 bytes;
  SHA-256 `33625d8dc3a5dd8d88c324d47db58561b11f7072816287078bfe58b4c55782f9`.
  Architecture `qwen35`, 27B, Q4_K_M; metadata read from GGUF and runner.
- Accompanying vision projector: `mmproj-Qwen3.6-27B-BF16.gguf`,
  931,145,856 bytes; SHA-256
  `b5d6d9c7063068ce85130bae1d7851eadae1f81f9ecfae82112adffd4b736b45`.
  No images were sent. The runner inventory's aggregate size differs from
  the individual weight size; both are retained rather than conflated.
- License: Apache-2.0, [publisher card](https://huggingface.co/lmstudio-community/Qwen3.6-27B-GGUF).
  The card identifies Qwen/Qwen3.6-27B as the base model. No download occurred.
- Load: context 4096, parallel predictions 1, GPU offload `max`;
  speculative draft MTP and simple draft both reported false. The CLI reported
  first load 9.90 seconds and reload 3.30 seconds, 16.28 GiB each.
- API alias: `dotln-local`; this is not the model artifact's identity.
- Decoding: temperature 0, top-p 1, seed 424242, explicit stop
  `<|im_end|>`, and request-level `reasoning_effort: none`. Other sampling
  defaults are not claimed pinned. The runtime's applied prompt-template
  override was not independently read back. The embedded GGUF template is
  observed; it has an `enable_thinking` branch and XML-style tool syntax.

The first diagnostic completion used the 64-token cap entirely for reasoning
and returned empty answer content. A second diagnostic with
`reasoning_effort: none` returned `READY`, two output tokens and zero reasoning
tokens. This setting is **observed on this version**, not inferred from an
official compatibility promise. No settings file was edited.

## Executed protocol experiment

Run: 22:33:01.330–22:33:25.492 UTC. One request at a time, one-second rests,
maximum 128 output tokens, at most 30 seconds per normal request. Each row
includes a host process check finding zero product gates, an OS thermal report
with no recorded warnings, and a subsequent idle/zero-queue observation.
These are point observations, not a cross-worktree reservation or certified
temperature measurement. Nine requests were issued in 24.162 seconds.

| Case | Observed result | Client latency ms | Server tokens/s |
| --- | --- | ---: | ---: |
| Fixed story 1 | Completed, 16 tokens | 1952.65 | 18.874 |
| Fixed story 2 | Completed, byte-identical | 1425.70 | 18.951 |
| Fixed story 3 | Completed, byte-identical | 1323.36 | 18.916 |
| Schema | Parsed object validates against the exact schema | 1746.04 | 18.899 |
| Tool call | `add` arguments exactly `a=2`, `b=3` | 4073.06 | 18.908 |
| Tool result | Matching tool response `5`; model answer `5` | 1224.92 | 18.160 |
| Cancellation | First content delta, generating state, then abort | 904.77 | unavailable |
| Timeout | 100 ms client deadline, observed abort at about 102 ms | 102.01 | unavailable |
| Recovery | OpenAI-compatible endpoint returned `READY` | 297.52 | 18.184 from separate model log |

The same fixed three-request smoke supplies the determinism triple. All three
answer byte strings equal `Dawn broke over the churning sea. He found a brass
key.`; reasoning strings are empty. This is n=3 under this warm runner
lifetime, not determinism across restarts or all prompts. It is not a quality
evaluation of the requested story. No cold/warm benchmark is inferred.

Schema validation is independent client code for the declared fixed schema:
object, exactly `ok` and `count`, boolean `ok`, integer `count` equal to 3.
The tool is a deterministic in-process integer addition, never a shell or
filesystem tool. Returned arguments and the matching call ID were checked
before returning the result. No general-purpose JSON Schema implementation
or transport capability is advertised by this probe.

Cancellation captured a first content delta at 730.75 ms and model state
`generating` before abort at 903.72 ms. The client settled 1.05 ms later;
the first subsequent state query returned idle with zero queued requests
163.02 ms after settlement: an observed upper bound of 164.07 ms after abort,
within five seconds. Independent server logs showed a disconnect, a cancel
operation and a slot release about 53 ms later. The timeout also generated
disconnect/cancel/release records; unlike cancellation, it occurred before
the first client token, so it is not evidence of cancelling mid-generation.

Native completed responses carry runtime, model_info and server statistics.
The OpenAI-compatible recovery response exposed empty stats; the separately
observed model-output log supplied its 18.184 tokens/s sample. Cancelled and
timed-out requests returned no usage/rate statistics, model-output logs emitted
no completed prediction for those cases, and server logs gave cancellation
and release without throughput. These three observation paths do not justify
inventing token counts or substituting SSE chunk counts for tokens.

## Boundary and claim limits

The harness in this session permitted host execution and networking. The runner
was started normally on IPv4 loopback; no outer deny-egress sandbox was in
effect and no runner setting was changed. Loopback binding only controls
incoming connections. It does not deny outbound traffic. WO-027's historical
failed launch and ambiguous boundary self-tests remain unchanged.

The native socket observation in the JSON packet removes addresses, PIDs and
instance references and reports only counts and address classes. A snapshot
with no non-loopback sockets cannot establish absence of outbound traffic
over the run or attribute prevention to a boundary. There is no no-egress
guarantee or sandboxed harness qualification here.

Ruled out for this session: an unavailable API after explicit start, absence of
an installed candidate, inability to load that artifact, inability to complete
noninteractive inference, schema failure, tool protocol failure, nondeterminism
in this triple, and failure to stop this cancellation within five seconds.
Remaining unknowns: attributable non-local egress denial, the effective runtime
template/default sampling stack, and rate measurements for interrupted cases.
Further heat-producing repeats cannot establish a boundary that was absent.

WO-110 may use these positive protocol observations to design its adapter,
while recording overall readiness as unavailable under its admitted path.
WO-138's required `ready` preflight remains unsatisfied. The next useful
experiment is a separately attributable runner boundary with successful
loopback and denied external controls, applied to the actual runner lifetime,
plus a way to observe effective template/settings and interrupted token counts.
Reopen when those observations can be collected without changing unauthorized
settings. No model suitability, quality or capability level is promoted.

## Reproduction and cleanup

With the pinned artifact already present:

```sh
export PATH="$HOME/.lmstudio/bin:$PATH"
lms server start --bind 127.0.0.1 --port 1234
lms server status
lms load qwen/qwen3.6-27b --identifier dotln-local --context-length 4096 --parallel 1 --gpu max -y
node scripts/probes/local-runner-smoke.mjs --live --out <new-json-path>
lms unload dotln-local
lms server stop
```

Do not reuse an existing run destination. Model listing's displayed variant
`qwen/qwen3.6-27b@q4_k_m` was rejected by this installed CLI's load command;
the model key without that suffix succeeded. `lms runtime ls --json` was also
rejected; plain `lms runtime ls` worked. Error bodies were preserved. The
operator's prior GUI instruction was not repeated.

The original smoke was followed by observed unload, empty loaded-model list
and stopped server. The operator then explicitly expanded this work order to
reload the same artifact and run the bounded load experiment below. Its
observations and final cleanup are recorded with their own cutoff.

## Operator-expanded staged load test

Authorized by explicit `scope expand:` during this dispatch; see D002 and the
canonical planning amendment. The load experiment ran 22:42:55.124–22:44:55.314 UTC.
The two-minute traffic limit stopped the run; its final idle observation and
recording completed at 120.190 seconds. Ten requests were attempted serially,
each capped at 128 output tokens with five-second rests. The first nine
completed; the last was interrupted by its deadline limited to the remaining
session budget. Its client status is `timeout`; the load-level stop reason is
`duration-limit`, followed by observed idle/zero queued work.

The first-stage check after two requests at 21.458 seconds observed nominal
thermal state, normal memory pressure and no swap growth, then recorded
`continue-to-stage-two`. All 130 health samples reported thermal state 0 and
memory pressure 1. Swap stayed at the already-existing 1,192.81 MiB. Completed
request latency ranged 7.301–8.098 seconds and server throughput
17.790–18.673 tokens/s. These samples include periodic monitoring overhead and
prompt cache effects; they are not a benchmark comparison. The native nominal
state's unsupported/unknown caveat still applies.

One socket inventory was bracketed by `generating` state before and after:
seven runner-related processes, six Internet sockets, all loopback. It is a
useful during-generation snapshot, not proof that outbound traffic was
prevented or never occurred outside that instant.

Automatic stop conditions: any thermal state other than nominal, memory
pressure other than normal, at least 128 MiB incremental swap, unavailable
monitoring, a detected product gate, an unexpected request failure, non-idle
runner after a request, operator signal, ten requests or the two-minute limit.
Native readers are asynchronous and individually bounded; observations never
overlap, so a slow reader cannot block the client deadline. Fault-injection
tests exercise a warning during an active HTTP request and a slow observer
spanning the deadline. Stop detection is sampled, not continuous prevention.

At 22:45:10.507 UTC, final cleanup was observed: model unloaded, loaded-model
list empty, server stopped; thermal state 0, memory pressure 1, swap unchanged.
No stress utility, fan control, new model, runtime update or persistent setting
was installed. The result supports only tolerance of this short bounded load.

To reproduce after explicitly starting and loading the pinned model, use
`node scripts/probes/local-runner-load.mjs --live --packet <readiness-json>`.
It requires an existing readiness packet without a prior load result, records
incrementally, and never overwrites a previous load observation. Start/load and
the final `lms unload dotln-local` / `lms server stop` remain explicit operator
or authorized executor steps. The CLI defaults enforce the authorized run;
the exported test functions accept shorter durations/rests for doubles.

## Documentation sources

Official documentation was retrieved during this session through Context7 and
vendor pages, then checked against installed CLI help and actual responses:
[loading](https://lmstudio.ai/docs/cli/local-models/load),
[native v0 responses](https://lmstudio.ai/docs/developer/rest/endpoints),
[chat parameters](https://lmstudio.ai/docs/developer/openai-compat/chat-completions),
[structured output](https://lmstudio.ai/docs/developer/openai-compat/structured-output),
[tool calls](https://lmstudio.ai/docs/developer/openai-compat/tools),
[logs](https://lmstudio.ai/docs/cli/serve/log-stream),
[generation status changelog](https://lmstudio.ai/docs/developer/api-changelog).
The SDK's [cancellation documentation](https://lmstudio.ai/docs/typescript/llm-prediction/cancelling-predictions)
was not treated as proof of HTTP abort behavior; that behavior was observed.

Apple's [thermal-state documentation](https://developer.apple.com/documentation/foundation/processinfo/thermalstate-swift.enum)
and installed Foundation header map nominal/fair/serious/critical to 0/1/2/3.
The header cautions that unsupported or unknown thermal state returns nominal.
Apple XNU's [memory-pressure sysctl implementation](https://github.com/apple-oss-distributions/xnu/blob/main/bsd/kern/kern_memorystatus_notify.c)
and [flags](https://github.com/apple-oss-distributions/xnu/blob/main/bsd/sys/event_private.h)
map normal/warning/critical to 1/2/4. Thresholds and duration here are this
experiment's conservative choices, not manufacturer safety certification.
