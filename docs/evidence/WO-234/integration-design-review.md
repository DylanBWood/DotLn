# WO-234 integrated design review

Findings: 2; fixed in source: 2; recorded/deferred: 0; remaining: 0.

1. Each historical meter snapshot is read and shape-checked independently; an unreadable snapshot increments boundStops.unreadableSnapshots while other observations survive. The regression includes damaged snapshots and a retained valid stop.
2. phaseDispatchAnchor and its callers name the original unfinished-attempt anchor accurately. Its comment explains why the earliest dispatch preserves elapsed time and consumed runs.

The same fresh reviewer rechecked both fixes; no new design findings remain. The phase-projection observation was transferred to the criteria reviewer and is counted there only. This is source review, not passing executable evidence.

Fresh independent codex-spawn-agent, fork_turns none, selected gpt-6.1-sol/max; effective readback unknown. Read-only throughout; no probes, tests, gates, lifecycle actions or descendants.

After the complete-run regression, the same reviewer rechecked the narrow screening option. Full effect classification keeps its existing default; only the admission operand view disables that stage, while wrapper/literal/grammar checks remain. The reviewer found no new design issue or need for a second parser. Counts remain 2 fixed, 0 open.
