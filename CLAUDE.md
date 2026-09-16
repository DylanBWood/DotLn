# DotLn

## Clean Room — locked floor

Personal work only. Never import employer code, configuration, identifiers,
internal services, credentials, or secrets. Stop and flag suspect material;
derive decisions from this project's public sources. Refer to the predecessor
as `v1`; use enterprise tracker, ticket artifact, and constrained managed host
as generic terms. No support or generated configuration may weaken this floor.

`docs/intake/` is ignored, single-copy source material. Synthesize and rewrite
ordinary raw ideation. Exact wording is allowed only for an operator-authored
public draft explicitly marked ready to file, with direct-filing provenance
recorded on the committed surface. Its compaction-safety capture is a sibling
record, never a source to mine. The same clean-room screen always applies.

## Evidence before claims — hard rule

Never guess. Check available source, implementation, documentation or executable
evidence before making a factual claim or choosing an action that depends on it.
If evidence is missing, say what is unknown and obtain it; never fill the gap
with an invented fact. Label an inference and state its supporting evidence.
Do not wait for the operator to challenge a claim before checking it.

When wrong, state the specific error, the checked evidence and the correction
directly. A wording change does not correct an unsupported claim or decision.

## Shared memory

Intake → product synthesis → planning/work orders → execution. Record product
decisions now, with sources and reopening conditions.
Each order owns model/effort assignments. No branch commits before final review.
Preserve work, intake and recovery refs; use canonical recovery.
Verification judges its recorded subject: a sibling publishing the version an
order staged is not a finding and never routes to repair. Final review
integrates main and retimes under the existing classification (product 07
§Independent workflows and integration).

## Start here

Whole `resume:` phrases select their skill through canonical status.
`@skills`: `.claude/skills` in Claude, `.agents/skills` in Codex.
`AGENTS.md` symlinks here.

Read[executor]: `@skills/dotln-executor/SKILL.md` — next, fix, status, times.
Read[verifier]: `@skills/dotln-verifier/SKILL.md` — verify.
Read[reviewer]: `@skills/dotln-reviewer/SKILL.md` — final review.
Read[release-close]: `@skills/dotln-release-close/SKILL.md` — release close.
Read[planner]: `@skills/dotln-planner/SKILL.md` — planning or ideation.

Expand skill read/review selectors from order/report paths. Read cited sections;
name new inputs.

Always admit `analysis:` (pause for diagnosis/direction) and `operator override:`
(suspend DotLn gates for authorized recovery), despite repo/harness failures.
Preserve work; invent no dispatch/pass. Exit: either prefix plus `off`.
Codex: `node scripts/operator-control.mjs analysis|override|off|status`.
Host permissions apply.

<!-- dotln-harness:start -->
Capabilities and residue: .claude/harness-manifest.json; planning: refute[ full] selects dotln-refuter.
DotLn reserves one writer per worktree on any branch, including main, and refuses writes to gate inputs or the success record during a live npm test. Inspect the writer with node scripts/harness.mjs writer --show; stop this session's gate with node scripts/harness.mjs evidence --stop. Claude hooks enforce these two invariants; Codex carries the same duties as role text. Every other hook judgment is advisory and host permissions decide.
claude-code-2.1.263: clean-room: Source provenance needs operator judgment; the hand-written Clean Room floor stays locked.
codex-cli-0.153.4: concurrent-work-requires-worktrees: No project hook fired in the bounded Codex probe; the role skill carries the remaining duty.
codex-cli-0.153.4: no-attribution: No project hook fired in the bounded Codex probe; the role skill carries the remaining duty.
codex-cli-0.153.4: no-lint-type-disables-as-fixes: No project hook fired in the bounded Codex probe; the role skill carries the remaining duty.
codex-cli-0.153.4: no-partial-completion: No project hook fired in the bounded Codex probe; the role skill carries the remaining duty.
codex-cli-0.153.4: read-your-own-output: No project hook fired in the bounded Codex probe; the role skill carries the remaining duty.
codex-cli-0.153.4: verify-app-before-done: No project hook fired in the bounded Codex probe; the role skill carries the remaining duty.
codex-cli-0.153.4: contributor.permissions: Pre-effect envelope checks unavailable in this harness; native sandbox and approval remain host controls.
codex-cli-0.153.4: clean-room: Source provenance needs operator judgment; the hand-written Clean Room floor stays locked.
<!-- dotln-harness:end -->
