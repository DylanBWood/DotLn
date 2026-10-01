# WO-177 — Codex spawn_agent observation

Observed 2026-10-01 during the executor's `resume: next` dispatch on
Codex CLI 0.159.3. Parent status reported `gpt-6.1-sol` at `max`, source
`codex-session-readback`. The available tool schema names the override fields
`model` and `reasoning_effort`, and allows them with `fork_turns: none`.
These calls used that schema directly; no account or tool setting was changed.

One bounded parent session made two calls. Each worker was instructed to finish
within 120 seconds, verify its cwd and Git root, return only its current-session
status fields, make no repository writes or lifecycle transitions, and spawn no
descendants. The parent remained the sole repository writer. Durations and
per-worker token costs were not separately measured.

| Call | Parameters tried | Tool result | Worker's own status observation |
| --- | --- | --- | --- |
| Explicit selectors | `task_name: spawn_explicit`, `fork_turns: none`, `model: gpt-6.1-sol`, `reasoning_effort: max`; read-only probe message | Accepted; worker returned | `codex-cli`, `0.159.3`, `gpt-6.1-sol`, `max`, `codex-session-readback`, observedAt `2026-10-01T19:32:57.509Z` |
| Omitted selectors | `task_name: spawn_inherited`, `fork_turns: none`; `model` and `reasoning_effort` omitted; read-only probe message | Accepted; worker returned | `codex-cli`, `0.159.3`, `gpt-6.1-sol`, `max`, `codex-session-readback`, observedAt `2026-10-01T19:33:09.673Z` |

Both workers verified the selected worktree and reported WO-177 in phase
`active`. Each ran a read-only Node wrapper around
`npm run resume --silent -- status --json`, parsing and returning only
`currentSession`, `workOrder` and `phase`. Their final messages reported no file
writes, writer reservations, lifecycle transitions, settings changes or
descendant spawns. This is actor-attested behavior, not a hook admission count.

The explicit-selector call establishes that this host accepts both parameter
names with the pinned values. The omitted-selector call observes the same
selected values as the parent, consistent with the tool's documented inheritance.
Neither call varies the pins, probes other models/efforts, or establishes
effective execution values. Effective model and effort remain **unknown**.
There was no refusal and no pending observation. Opaque agent/thread identifiers
and local session paths are excluded from this public record.
