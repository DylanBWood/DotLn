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
DotLn has five refusals (WO-135, WO-139, WO-144): it reserves one writer per worktree on any branch, including main; refuses writes to gate inputs or the success record during a live npm test; on planning/ branches refuses repository writes outside docs/ and root Markdown; refuses observable subagent admissions beyond docs/control/budgets.json subagentCap (default 20; null disables); and refuses known outside-project write destinations without a containing root granted by the active role or equipped support. Literal redirects are judged on any program; expansions such as $PWD and a program's own effects remain unobserved under host permissions; grant failures admit with one advisory and preserve the other refusals. Descendants count at their first attributable tool call; unresolved direct/child overlap is a reported minimum, and unobserved agents remain unknown. Inspect the writer with node scripts/harness.mjs writer --show; stop this session's gate with node scripts/harness.mjs evidence --stop; use operator override: for authorized recovery. Claude hooks enforce these five refusals at observed boundaries; Codex carries the duties and grants as role text without automatic enforcement. Copilot reuses the Claude registration: scripted denials hold with allow-all; missing tool-call and child identity leave subagent accounting advisory; WO-146 evidence records interactive qualification. Other tool and completion judgments are advisory and host permissions decide. The separate Codex compaction adapter restores an owned unfinished task and permits one continuation after premature stopping; it never dispatches a role or changes writer ownership.
claude-code-2.1.263: clean-room: Source provenance needs operator judgment; the hand-written Clean Room floor stays locked.
codex-cli-0.153.4: concurrent-work-requires-worktrees: No project hook fired in the bounded Codex probe; the role skill carries the remaining duty.
codex-cli-0.153.4: no-attribution: No project hook fired in the bounded Codex probe; the role skill carries the remaining duty.
codex-cli-0.153.4: no-lint-type-disables-as-fixes: No project hook fired in the bounded Codex probe; the role skill carries the remaining duty.
codex-cli-0.153.4: no-partial-completion: No project hook fired in the bounded Codex probe; the role skill carries the remaining duty.
codex-cli-0.153.4: read-your-own-output: No project hook fired in the bounded Codex probe; the role skill carries the remaining duty.
codex-cli-0.153.4: verify-app-before-done: No project hook fired in the bounded Codex probe; the role skill carries the remaining duty.
codex-cli-0.153.4: contributor.permissions: Pre-effect envelope checks unavailable in this harness; host permission settings decide.
codex-cli-0.153.4: clean-room: Source provenance needs operator judgment; the hand-written Clean Room floor stays locked.
copilot-cli-1.0.86: clean-room: Source provenance needs operator judgment; the hand-written Clean Room floor stays locked.
<!-- dotln-harness:end -->
