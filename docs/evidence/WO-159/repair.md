# WO-159 repair evidence

Dispatch: `resume: fix`, 2026-09-25, recorded by the harness before this
procedure loaded. Repair source: [VER-001](../../verifications/WO-159/VER-001.md),
findings F1 and F2, retained as [D016](decisions.md#wo-159-d016) and
[D017](decisions.md#wo-159-d017).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.282","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

The model is the operator's session selection (Opus 5.5). The effort is the
root session's `CLAUDE_EFFORT=xhigh`, read from the shell environment
(selected, not effective). The harness version is `claude --version`.

The repair keeps the original scope and the application target `v0.48.0`.
No registered edition source changed, so no edition re-minted. No dependency
was added, no live model episode ran and no subagent was spawned. The recorded
verification report and the [implementation report](implementation.md) are
unchanged. [D018](decisions.md#wo-159-d018) and
[D019](decisions.md#wo-159-d019) record the repairs. D018 also corrects D003's
reading of a probe row as one episode.

| Finding | Repair and executed evidence |
| --- | --- |
| F1 — per-launch isolation in multi-process probe rows | `scripts/lib/writing-worker-probe.mjs` routes every Codex invocation through `isolated(label, launch)`: one `startCodexEpisode` per invocation, its environment handed to that invocation only, finished in `finally`. A row records `codexEpisodes`, one labelled record per invocation in launch order (`concurrent-1` to `concurrent-3`; `exec` and `recovery`; `help`; `exec` otherwise), in place of the single row-level `codexIsolation`. `userScopeSettingsWritten` is true if any invocation's pair is unequal. The probe's Codex stub now logs the home each invocation saw. The WO-044 fixture asserts 12 distinct homes for 12 invocations, the per-row labels, removed homes and equal pairs on every record. It also requires the recorded home digests to equal the SHA-256 of the 11 row launches' homes exactly. Negative control: the same fixture against the probe at `refs/dotln/checkpoint/WO-159/5` fails `no two launches share a home` with 9 distinct homes for 12 invocations. The other five launch sites already pair one episode with one invocation. Removing the row wrapper restored HEAD's indentation of the loop body (net probe diff 470 to 147 lines). |
| F2 — the receipt accepted a false stream digest | `docs/evidence/WO-159/receipt.mjs` `matchSharedStream` reads the feedback edition's verifier stream by value through `feedbackEditionLog`. It re-derives the whole receipt with `buildReceipt` from that stream plus the receipt's own bracketing observations, and requires every top-level field to be equal. That binds the stream digest, row count, terminal event, launch selection, heartbeats, duration and isolation record to the stream. `--check` now requires the stream instead of skipping when it is absent. For the committed receipt, the 2,203,530-byte stream rebuilds in 28 ms and all nine fields re-derive. The fixture refuses eight forgeries that `validateReceipt` still admits, a stream whose start event names another model, and VER-001's 64-zero digest on the committed receipt. |

Follow-ups: FUP-48329a515c2547af (D016) and FUP-d73389529a67a11a (D017) are
recorded `settled` in the register, reopening if independent verification
reproduces either defect on the repaired subject. The worktree queue's one item
(adjacent-0001) stays deferred onto FUP-35bc8736fb13c49a; nothing is running
or next.

Executed checks on the repaired tree, 2026-09-25:

| Check | Result |
| --- | --- |
| `node scripts/harness.mjs evidence` (`npm test`) | 27 passed, 0 failed; 303.14 s; 71 fresh tasks; tree `771c2426108d43e777f3d587709840c1be88aba4` |
| `npm run test:docs` | 21 passed, 0 failed; 23.86 s (authority, verification, artifact, feedback and harness evidence among them) |
| `node --test scripts/test-harness-probe.mjs` | 11 passed, 0 failed |
| `node --test` the two WO-159 skeleton test files | 12 passed, 0 failed |
| `node docs/evidence/WO-159/receipt.mjs --check` | exit 0; the retained feedback verifier stream derives the receipt |
| `git diff --check`; `npm run plan -- check`; `npm run publication:check` | exit 0 |
| `npm run release -- prepare --local` | `v0.48.0` remains current; no files changed |

Economy: [D012](decisions.md#wo-159-d012) is this order's one experiment. It
was read before the repair, and no second experiment was started.

Process cost at entry: 83,891 total tokens, source
`claude-transcript-message-usage`, scope `dispatch`, cutoff
2026-09-25T05:03:42.560Z. At 2026-09-25T05:20:26Z the same counter read
10,903,167 total tokens, most of them cached input (10,670,350). Dollar cost is
unavailable. Final handoff counters are in the ignored harness receipt and the
operator response.

Limits: both repairs are proved with stub and fixture evidence. The
writing-worker probe was not run against the live CLI, because it is a
multi-episode model probe and the defect was control flow. Independent
re-verification and final review remain separate dispatches.
