# Design self-review

Reviewer: fresh Codex worker `design_improver`, requested model `gpt-6.1-sol`, effort `max`; read-only, no descendants or tests. Inputs: the work order and the implementation diff. Finding count: 2 confirmed defects.

1. Major — A target records commit preceded its control event, so interruption between them made retry refuse; interruption after the event skipped remaining removals. Fixed with an ignored pending receipt bound to the reviewed parent, target and record hashes. Retry validates the exact records child, appends the missing event, and resumes only hash-verified removals. Changed source bytes remain protected. The real commit/event-boundary regression passed.
2. Major — A failed planning publication preserved its temporary branch but rejected that branch on retry. Fixed with an ignored receipt binding the original inputs, physical worktree and commit. Retry rechecks authority and source bytes, reuses the same validated commit, and consults the publication log before repeating effects. Cleanup removes an empty scratch directory only; a retained extra file survives and the cleanup can resume.

The expanded publication, records recovery and planning retry probe passed in 80,084 ms. The full target-worktree preflight then passed in 172,590 ms gate / 174,020 ms wrapper, including interruption during cleanup after publication and retry without a second pull request.

Disposition: found 2; fixed 2; recorded 0. Independent verification and final review remain separate lifecycle roles.
