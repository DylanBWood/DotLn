# Codex continuation after compaction

The operator expanded WO-054 after Codex answered an old side question after
compaction and stopped with unfinished authorized work. The generated Codex
contributor adapter now restores the saved task and can request one immediate
continuation. It requires no polling process, pending command or helper agent.

## Behavior

`PostCompact` records the compacted turn. `SessionStart` with `source: compact`
delivers the unfinished work order, role, phase and expected completion event as
developer context. The context tells the assistant to continue from the handoff,
inspect existing commands and agents, and treat old side questions as steering.
If that turn still stops with the same task unfinished, synchronous `Stop`
requests one continuation. A duplicate event or `stop_hook_active: true` cannot
request another. This is bounded assistance, not a guarantee that a model will
finish every task; a real blocker remains reportable.

Only an existing root session with matching saved task, canonical active phase,
outstanding completion event and its own writer reservation qualifies. The
adapter does not dispatch lifecycle commands, acquire/release a writer, replay
a work order, start a worker or inspect the model transcript. It observes the
canonical read-only status and writer commands. Ordinary non-compacted stops
return before those commands. Missing or malformed observations leave native
stopping available and report an advisory where applicable.

The adapter does not interpret conversational strings or maintain a separate
pause/resume latch. The operator clarified that the defect is automatic
compaction followed by an answer to an old message and idle; see
[the correction and decision](decisions.md#wo-054-d005). Neither prompt text nor
the assistant's final reply chooses whether that unfinished task is restored.
Ordinary user instructions remain the assistant's responsibility. Native
interruption remains with Codex; there is no custom `Interrupt` subscription.
`analysis:` and `operator override:` retain their existing formal recovery
control, checked before repository reads and again before continuation. A side
question or `conversation only:` does not erase the task.
Generated hooks make no additional tool/write refusal. The one Stop continuation
is the explicit scope expansion's exception to otherwise advisory completion
judgments, recorded in [D002](decisions.md#wo-054-d002).

## Native probe

[Sanitized native evidence](codex-native-probe.json) records a Codex CLI 0.155.0
scratch repository with project-local `.codex/hooks.json` beside a comment-only
`.codex/config.toml`. The requested model was `gpt-6-astra`, effort `ultra`; hook
inputs independently observed the model, not effective effort. No project source,
credentials or persistent account settings were copied or changed. The one-off
probe trusted only its inspected scratch hooks through launch arguments.

Observed sequence: SessionStart(startup), PreCompact(auto), PostCompact(auto),
SessionStart(compact), Stop(false), Stop(true), SessionEnd. The first final reply
contained the compact-context marker. The second contained both that marker and
the Stop-continuation marker. The only payload-reading command had already
completed; no background process or subagent supplied a wake-up. Session and turn
continuity were checked without publishing their identifiers. Exit status was 0.
This proves the native event and continuation mechanism, independently of the
synthetic policy tests; it does not establish desktop activation.

The initial probe had an incorrectly quoted dotted project-trust override and
produced no hooks. The corrected object-shaped override proved project loading;
the failed configuration is not evidence of unavailable hooks. Historical
0.153.4 generic-hook observations remain unchanged. The 0.155.0 continuation
observation is separate and is excluded from target-worker profiles.

Primary contracts: [official Codex hooks](https://learn.chatgpt.com/docs/hooks),
[0.155.0 hook runtime](https://github.com/openai/codex/blob/rust-v0.155.0/codex-rs/core/src/hook_runtime.rs),
[hook schema](https://github.com/openai/codex/blob/rust-v0.155.0/codex-rs/hooks/src/schema.rs),
[configuration loader](https://github.com/openai/codex/blob/rust-v0.155.0/codex-rs/config/src/loader/mod.rs)
and [override parser](https://github.com/openai/codex/blob/rust-v0.155.0/codex-rs/config/src/overrides.rs).

The [generated-policy native probe](codex-generated-probe.json) then ran the
actual emitted continuation implementation on Codex CLI 0.155.0. Its scratch
status/session/writer records were synthetic; hook delivery, compaction, model
requests and the foreground file write were native. The user prompt omitted the
selected work-order ID. After compaction the model replied `INITIAL_PROGRESS
WO-999`; the actual Stop hook requested continuation, and the model wrote
`recovered.txt` containing `WO-999` and replied `RECOVERED WO-999`. Three automatic
compactions produced exactly one continuation receipt. No external wake-up,
subagent or background task was used, and the process exited 0. Recorded hashes
identify the pre-repair generated surfaces, preserved as historical evidence.
They do not identify the current repaired entry. The wrapper initialized and
observed fixture records but added no context or continuation decision.

A direct invocation of the generated SessionStart(compact) entry against this
worktree also restored the actual WO-054 executor, active phase and outstanding
ImplementationReady event in about two seconds. This checks production state
reading; it is an explicit hook invocation, not evidence of desktop activation.

Neither original native probe exercised an interruption or a typed pause/stop
prompt. The original claims about those paths rested on source inspection and
synthetic policy tests, not native delivery. The repair removes that custom
prompt parser and interruption latch; it makes no new native interruption claim.

The [repair native probe](codex-repair-native-probe.json) repeats the operator's
reported sequence using the current generated bytes on Codex CLI 0.155.0:
automatic compaction, first final reply `INITIAL_PROGRESS WO-999`, an actual
generated `Stop` continuation, a foreground write of `recovered.txt` containing
`WO-999`, then `RECOVERED WO-999`. Four automatic compactions produced exactly
one continuation receipt in the same native session and turn. The process exited
0 in 165.494 seconds, with no external wake-up or background worker. A read-only
repair helper ran the isolated episode; the fixer checked all generated hashes
against this worktree before filing the sanitized result. Ownership/status were
synthetic, and the first premature final reply was deliberately elicited. This
tests the failure sequence without claiming to reproduce the whole desktop
conversation or establish activation there.

## Activation and verification

The bundle owns `.codex/hooks/continuation.mjs`, `.codex/hooks.json` and a
comment-only `.codex/config.toml`. Emission refuses to overwrite pre-existing
unowned configuration before making any bundle write. Unrelated Codex files
are preserved. The compiled source module is runtime-pinned; the generated entry
is recorded and checked by the installation manifest.

Codex's native project/hook trust must admit the generated definitions; review
them through `/hooks`. Changed definitions can require renewed trust. No user
configuration or trust setting is changed by this implementation. In the checked
0.155.0 loader, a linked worktree obtains hook definitions from the root checkout,
so the root checkout must contain the integrated bundle before its worktrees can
activate these definitions. The command itself resolves the active worktree's
Git root. Merely generating files on this branch does not prove activation in
the running desktop session.

`node --test scripts/test-codex-continuation.mjs` exercises native-shaped inputs,
the actual emitted entry, one-shot delivery, unchanged lifecycle/writer state,
the old-message-reply failure sequence, recovery-control races,
foreign/completed/malformed tasks and subagent exclusion. Prompt text does not
create or clear recovery state outside the existing formal control commands.
The suite is part of the default product gate. Installer and target-profile
tests check configuration preservation and keep contributor recovery out of
ordinary workers. Native capability evidence and deterministic policy tests
support separate claims; neither is substituted for the other.

## Correction (2026-09-25, WO-159)

Two sentences above overstated what was observed. The Native probe says no
persistent account settings were changed and that the probe trusted its
scratch hooks only through launch arguments; Activation and verification says
no user configuration or trust setting is changed by this implementation.
Both describe the continuation bundle's own emission, which writes only the
three owned `.codex/` files and still does. Neither held for DotLn's Codex
launches. The user-level configuration held trusted project entries for
DotLn scratch targets, including one each for the `dotln-codex-compact-probe`
and `dotln-codex-compact-probe2` families this order's native probes used
([WO-111 diagnosis](../WO-111/codex-trust-diagnosis.md); attribution by family
name is an inference), and WO-111's live source-change launches added two more
([VER-001 B1](../../verifications/WO-111/VER-001.md)).

[WO-159](../WO-159/decisions.md) routes every DotLn-launched Codex worker,
verifier and probe through one launcher with a per-episode `CODEX_HOME`. A
live probe with WO-111's source-change launch prefix observed the Codex CLI
0.156.1 writing a trust entry for its scratch target into that isolated home,
while the user-level `config.toml` and its trust table stayed byte-identical
([trust probe](../WO-159/trust-probe.json); [live row](../WO-159/live-codex.json)).
The existing entries remain the operator's to remove. The bytes above are
unchanged.
