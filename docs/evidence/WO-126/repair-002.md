# WO-126 repair of VER-002

The operator's `resume: fix` dispatch selects VER-002 and preserves the original
order and earlier evidence. This executor runs Codex CLI 0.153.4, GPT-6 Astra
at max under the repository's operator-attested default; effective effort
readback is unavailable. Independent verification remains a separate dispatch.

| Finding | Repair and evidence                                                                                                                                                                                                                                                                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F10     | Normalize supported wrappers, groups, conditional command lists and literal `eval`/shell commands. Unknown wrappers containing denied invocations and unsupported syntax refuse with a classification reason. Fixtures cover the report's shapes, nested wrappers and literal-data controls; generated permission hooks exercise representative forms.            |
| F11     | Extract actual commit invocations and literal message/file operands through the same parser. Searches and examples stay data; missing or dynamic message bytes get a named refusal. A generated attribution hook admits a plain message and rejects a synthetic session trailer in a message file.                                                                |
| F12     | Preserve expansion provenance. Dynamic program and effect-subcommand operands refuse; single-quoted/escaped dollars and ordinary path/data expansions remain data. Fixtures cover Git, GitHub and package managers.                                                                                                                                               |
| F13     | Give `harness-fixtures` and `process-debt` exclusive scheduler execution. Hooks record process uptime through evaluation, including module loading, in the existing journal; the meter derives count, total, mean and peak. Fixtures prove isolation, timings and unchanged global concurrency.                                                                   |
| F14     | With no input or running-executable variable, follow the ancestor process chain before PATH. A generated session hook with a process double observes 2.1.266 while PATH reports 2.2.9; input and environment precedence and unavailable-ancestor fallback have separate cases.                                                                                    |
| F15     | Allow console to overlap skeleton; both own independent fixture roots. Retain the package file-concurrency bound, suite inventory and 120-second budget. Cold timing is recorded below.                                                                                                                                                                           |
| F16     | Execute and fingerprint the same reviewed inherited environment. Proxy variables and undeclared metadata are absent from both. Tests prove child-process absence, stability across synthetic proxy rotation, invalidation of relevant variables, and actual suite reuse across a document edit plus proxy rotation. Evidence lists selected names without values. |

The focused command/version regressions passed six tests, including generated
hooks. Four command and hook tests passed again after closing the `xargs`
stdin gap: unknown appended words cannot supply a program, subcommand or commit
message option; replacement forms require an explicit adapter. A fixed
`xargs git status` and commit paths protected by `--` remain supported.
The runner and input-evidence regressions passed nineteen tests, and the final
full gate passed all 37 suites.

[Measured results](repair-002-results.json) retain each canonical command,
source tree, execution mode, input-observation cost and selected suite timings.
The final-source cold `npm test -- --fresh` passed twelve suites in 104.956 s,
15.044 s below the unchanged 120 s budget. Skeleton and console started together
and finished in 100.060 s and 60.606 s. The separate `npm run test:full` passed
in 441.732 s with 75 fresh and three reused tasks; the reused package results
identify that cold run as their source. The exclusive harness and process-debt
suites executed successfully in 50.083 s and 36.790 s.

The earlier 101.403 s fast attempt failed only stale publication source locks;
the 499.174 s cold full attempt failed only stale generated authority bundle
evidence. Both failed observations remain recorded. Their derivatives were
refreshed and passed in the final-source runs. The verifier's 115.39–116.32 s
cold fast observations and this session use different harness environments;
these are single-host observations, not a matched benchmark. The final
completion record binds subsequent receipt and generated-index refreshes to
their own validated tree.

The changes add no dependency, hook, operator step or recurring context read.
Command normalization is in-process. Version fallback adds one bounded process
table observation when the stronger channels are absent. Each hook timing adds
one small journal row, with no new subprocess or session-file read. The scheduler
trades hook-fixture overlap for isolation and removes console's unnecessary
wait for skeleton. The environment projection removes inert cache misses while
retaining both input observations and the exact-tree completion aggregate.
The final cold fast gate's two input observations cost 1.497 s, 24 subprocesses
and 414,077,290 bytes hashed; those bytes are filesystem input, not context
delivery. The full run's observations cost 1.282 s. Fixture assertions verify
that hook timings reach the per-order and per-role meter. Live Claude hook
latency and this session's total token/dollar costs are unavailable; the token
and dollar caps remain unset. The receipt and measurement projection are
one-time repair evidence and add no recurring procedure.

The feedback audit's declared source files are unchanged by this repair;
its immutable WO-126 feedback-002 edition remains the applicable source audit.
The changed harness runtime receives a newly pinned generated snapshot and
current executable fixtures. This distinction does not extend the feedback
audit to files outside its declared subject.

Decisions [D011](decisions.md#wo-126-d011), [D012](decisions.md#wo-126-d012)
and [D013](decisions.md#wo-126-d013) record alternatives and reopening conditions.
The process-double version test establishes the missing-environment path, not
a live Claude session observation. Scheduling bounds this gate's processes;
unrelated host load remains outside it. No complete shell interpreter or
general dependency inference is claimed.
