inconclusive: the repaired, matched WO-138 matrix qualifies only T2's fixed
public-input candidate-ranking role; T1 and T3 remain unqualified.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

The [decision packet](decision-packet.md), [results](results.json), retained
[inputs](inputs.json) and 38 [episodes](episodes/) describe the final subject.
All 30 baselines returned schema-valid envelopes. Local median agreements are
0.1 for T1, 0.828571 for T2 and 0.833333 for T3; remote medians are 1.0,
0.828571 and 1.0. Only T2 meets all unchanged floors. Its local median latency
is 12,075.799 ms, median throughput 18.135 tokens/s and intervention count zero.

The executor repaired VER-001 F1's unsupported remote schema and lost errors,
A1's undeclared T1 length bounds, and A2's false comparison pass for an absent
comparator. An independent audit then found nondeterministic T2 input hashes
from scratch-path-dependent stderr. The final collector retains one generated
input snapshot for both transports and validates record bindings before scoring.
The immutable prior subjects remain under `attempts/invalid-schema-007` and
`attempts/unmatched-input-008`; no failed trial or hash was rewritten.

The final probe hash is
`3d9d6aa05c47bc6561e6850ea49c236611a3b462486f8311e4119953411f6907`.
All records name it, and independent recomputation matches all six numerical
distributions. The operator's original ranking and reported 60 seconds are
unchanged. The local artifact is WO-137's pinned Qwen3.6 27B Q4_K_M; the
comparator is gpt-5.6-sol over codex-cli 0.155.1. All live inputs are public
repository fixtures, and runner cleanup was observed.

Product 03 consumes the supported T2 role; product 06 records the inconclusive
disposition and later qualification requirements. The decisions file and its
generated index preserve the execution choices and corrections. A bounded
adjacent planning-header normalization resolves the existing release/parser
disagreement without changing the order's scope or classification. Application
v0.38.1 remains a patch; no package or dependency changed.

[The repair report](repair.md) records the executed checks and limits.
Independent verification and final review remain separate dispatches. No
private-input, writing, implementation, verification or capability-level
promotion follows from this pilot.
