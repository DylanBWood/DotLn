# WO-044 repair of VER-004 F1

**Dispatch:** `resume: fix`. **Observation cutoff:** 2026-09-15T02:54:34Z.
The subsequent `RepairCompleted` event in `docs/control/orders/WO-044.jsonl`
binds this repair to its final checked tree. Final gate and usage counters stay
in ignored receipts and the handoff response.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.154.0","model":"gpt-6-astra","effort":"xhigh","source":"operator-attested"}

The current session metadata names `ultra`; the operator explicitly corrected
the executor's proposed `max` interpretation: `ultra` means `xhigh` plus
subagents. The handoff therefore records operator-attested `xhigh`, meeting
the order's minimum, without claiming an effective-effort readback or changing
the lifecycle's accepted effort values.

The root README's prepared release block now names compiler `0.9.3` and
skeleton `0.15.12`. Its previous pair, `0.9.2` and `0.15.11`, described the
preceding release's components. The new pair matches both package manifests,
the compiler identity constant and both generated harness profiles. Decision
[D018](decisions.md#wo-044-d018) records the correction and its scope. This
applies product 07's existing release-truth requirement; it introduces no new
product decision or runtime behavior.

## Executed evidence

- An executable comparison of the root README's compiler, skeleton and console
  declarations with their package manifests reproduced the two discrepancies
  before the correction (exit 1). The same comparison passed after it (exit 0);
  console `0.1.5` already matched.
- `npm run release -- prepare --local` exited 0: the classified `v0.17.7`
  target remains current, and preparation changed no files.
- `npm run release -- check-surfaces --local` exited 0. It checks the application
  target, package versions and publication controls; it does not validate bare
  component versions in README prose. The direct comparison supplies that
  narrower evidence. Tag observation is the local snapshot only.
- The final canonical full gate and diff check are recorded by the completion
  event after these write-backs and generated projections.

A read-only audit agent confirmed the component evidence and the current root
README declarations. This executor is the sole writer. Explicit Codex
observation and current-byte delivery records establish delivery, not
independent verification. No live provider probe is needed for this prose
correction; all earlier discovery labels and disclosed limits retain their
original evidence boundaries.

The observed benefit is a prepared release description that agrees with the
components it ships. The existing gate's inability to check these bare prose
versions remains explicit. The audit also identified separate stale package
README declarations; queue item `adjacent-0008` defers those unselected paths
to a documentation planning pass, with cause, proposed correction and checks.
They are not represented as repaired here.

The first entry usage collection had no post-entry counter and refused. A
subsequent collection succeeded from the current Codex transcript; no fabricated
counter or substituted session was used. The canonical gate needs approved
access to the shared success cache in Git's common directory, as documented
by the prior repair's observed sandbox refusal. Its result and the final
measured work and waiting costs remain in the ignored receipts and response.
