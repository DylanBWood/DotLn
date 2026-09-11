# WO-044 — Writing-worker and unattended-launch harness truth: observe what the installed harnesses do when a tool-enabled worker runs in a foreign worktree under that worktree's own hooks, and when a resident process launches them with no operator present (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model for the probe script and the record. The live
rows need the actual local harnesses (Claude Code; Codex where installed),
run from a terminal outside the sandbox, and must state the harness version,
model, and effort actually launched (07-execution-guide.md §Model-specific
notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. A discovery record and a probe-script
extension; no runtime capability, no generated configuration change.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
C2), cut as a bounded order at the operator's same-day correction that the
horizon's orders be small: one capability boundary, one seam, one falsifiable
outcome, one rollback unit. Planner-synthesized draft; the dispatch and the
correction are preserved in the pass's ignored intake captures, whose hashes
are in the ledger section of that date. Opaque identifier, not a priority.
The clean-room screen found no stop condition.
**Depends on:** WO-039 merged (the phase-zero record and `scripts/harness-probe.mjs`
this order extends; satisfied at the `33e2c25` merge); WO-009 merged (the
canonical launch shapes this order varies; satisfied at `v0.10.0`).
**Recommended placement:** immediately after WO-042 activates, in any free
lane; it edits only `scripts/harness-probe.mjs` and `docs/discovery/`. The
first mandatory replan checkpoint follows its record. A recommendation, not a
dependency token.

**Cites (read these sections):** 01-principles.md Principle 15 (environment
truth before architecture; epistemic labels); 03-architecture.md §Runtime
primitive catalogs (harness, orchestration, transport and execution
environment as separate rows) and §Ports `WorkOrderTransport` (the canonical
launch shapes, `--tools ""`, `--safe-mode`, the Codex read-only profile);
09-audit-resilience-privacy.md §Privacy and minimization;
`docs/discovery/harness-smoke-2026-09-07.md` (the row shape and privacy
reduction this order repeats) and `docs/discovery/environment.md` (the WO-004
and WO-009 addenda); `scripts/harness-probe.mjs`;
`packages/skeleton/src/worker-transport.ts` (`canonicalWorkerArgs`);
`docs/AI-HARNESS-SECURITY.md` §Current posture.

**Objective:** Record, before any lowering or transport rule is written, what
the installed harnesses actually do when launched non-interactively as a
worker that must edit files inside a Git worktree that is not DotLn: which
tool-allowlist form admits editing and a bounded shell, whether that
worktree's own project settings and generated hooks apply in that launch
mode, whether the sandbox confines writes to the worktree, whether a hook
under the worktree can import a runtime by absolute path, which
worktree-local instruction surfaces exist, what the structured result looks
like with tools enabled, how kill and recovery behave, and what happens when
a non-interactive parent process launches the harness with no operator
present: authentication lifetime without an interactive login, permission
behavior with no terminal, the harness's own scheduled-task surface and
whether it can launch a governed session, idle cost, concurrent-session
limits, kill and recovery of a resident-launched episode, and, in each
launch mode, which hook events fire for a scripted prompt and whether the
hook input lets a non-interactive session be told from a typed one (the
rows WO-121's presence classifier reads).

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Every real transport launches Claude with `--tools ""` and `--safe-mode` and
  Codex with a read-only named filesystem profile
  (`worker-transport.ts:179-253`); the WO-039 phase-zero record observed hooks
  and skills in interactive scratch sessions of this repository, never a
  print-mode or exec-mode worker with tools in a foreign worktree.
- The critical path's next two orders (the target-worktree bundle and the
  source-change transport profile) would otherwise be designed from vendor
  documentation, which Principle 15 forbids.

**Design (scope discipline):**

- Extend `scripts/harness-probe.mjs` with a `--writing-worker` mode that
  creates a scratch Git repository outside this checkout with one file, one
  trivial test script, a `.claude/settings.json` deny rule, one generated-shape
  PreToolUse hook that refuses a fixture command, and a local instruction
  file; then launches each harness once per row with the operator's
  authentication and records field shapes only.
- Rows for Claude Code: tool allowlist form (`--tools` with names or
  `--allowedTools`) that admits Edit, Write and a bounded Bash; whether the
  scratch worktree's `permissions.deny` and the hook fire in print mode; a
  write inside the worktree and a write to a sibling directory; a hook whose
  import is an absolute `file://` path; which instruction files load
  (`CLAUDE.md`, any local variant); the JSON result envelope with tools
  enabled; `--no-session-persistence`; SIGKILL mid-episode and what the
  worktree holds afterward; which hook events fire for the scripted initial
  prompt in print mode and whether the hook input marks the session
  non-interactive. Rows for Codex: `workspace-write` with named
  filesystem permissions granting the worktree, the equivalent hook and
  instruction rows, the scripted-prompt hook row, and the JSONL result.
- Unattended rows for each harness: launch from a detached parent with no
  terminal and the operator's stored authentication (does it run, and for
  how long before a login is demanded); a permission prompt with no terminal
  (refused, hung or auto-denied); the harness's scheduled-task or cron
  surface (what it offers; whether a scheduled launch loads the worktree's
  settings and hooks); idle cost of a session left open; the concurrent
  session limit observed; SIGKILL of a resident-launched episode and its
  recovery from the worker store.
- Labels are observed, blocked, unavailable or ambiguous per row; every row
  cites its command; paths, session ids and host names reduce to shapes
  before the record is committed.
- **Declined alternatives, recorded:** assuming print mode behaves like an
  interactive session (the phase-zero record shows they differ under
  `--bare`); probing on this repository's worktree (the question is a foreign
  worktree); any production emit or settings change.

**Deliverables:** the probe mode; `docs/discovery/writing-worker-smoke-<date>.md`
and `.json` with per-harness sanitized run files; a dated addendum in
`docs/discovery/environment.md`; the write-backs below.

**Acceptance criteria (all required)**

1. The record carries one labeled row for each Claude question above and each
   Codex question, every row naming the command shape it ran and the observed
   field shapes, with no absolute path, session id or host name.
2. At least one refusal produced by the scratch worktree's own generated hook
   in the worker's launch mode is recorded, or an explicit row states that no
   hook fired and what was tried; the same for a settings deny.
3. The write-containment rows record a write inside the worktree and an
   attempted write to a sibling path with the harness's observed response.
4. The instruction-surface row states which files the worker loaded and which
   worktree-local surface, if any, exists for a bundle's marked block.
5. The kill row records the worktree state and the harness exit after a
   SIGKILL mid-episode, for an operator-launched and a resident-launched
   episode.
6. The unattended rows record, per harness, detached launch and
   authentication lifetime, no-terminal permission behavior, the scheduled
   surface and whether it loads the worktree's settings and hooks, idle
   cost, and the concurrent limit, each observed, blocked, unavailable or
   ambiguous; WO-068 designs its launcher from these rows.
7. Write-backs land: `docs/discovery/README` index or equivalent pointer,
   `environment.md` addendum, ledger entry; the planning map's checkpoint note
   is answered with a one-line disposition.
8. `npm test` green; `git diff --check` clean; no runtime source, generated
   configuration, user setting or dependency changes.

**Evidence gate:** the record and its JSON; the probe transcripts reduced to
shapes; `npm test`.

**Write-back duty:** as listed in criterion 7.

**Non-goals:** any transport, profile or bundle change (WO-049, WO-051); the
resident host itself (WO-068); user settings; Codex hook enforcement claims;
benchmarking; the operator's repositories.

**Operator-review assumptions**

1. The operator runs the live rows from an outside terminal, as WO-039's
   smokes were run.
2. An unavailable row is a valid result; the next orders design from it.
