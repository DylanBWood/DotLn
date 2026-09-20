# WO-146 Copilot operator qualification

Four required episodes completed.
Every launch must be bare `copilot`, attested by the operator. No helper launches a CLI, changes personal settings or writes DotLn's real control log.
Fresh session identity is checked; cross-session memory remains an operator-controlled independence risk. Final review and release close are untested.

| Attempt | Episode | Role | Phase observed | Result | CLI | Model | Effort | Permissions | Wall-clock ms |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | executor | ready-to-verify | pass | 1.0.86 | claude-sonnet-5 | xhigh | normal | 409314 |
| 2 | 2 | verifier | needs-fix | pass | 1.0.86 | claude-sonnet-5 | xhigh | unknown | 329656 |
| 3 | 3 | fixer | ready-to-verify | pass | 1.0.86 | claude-sonnet-5 | xhigh | all | 161057 |
| 4 | 4 | verifier | verified | pass | 1.0.86 | claude-sonnet-5 | xhigh | all | 188318 |

The companion JSON retains selected readback and completion attestations separately, hook-event batch counts, classified denials, approval observations and usage with source/scope/cutoff. AI credits use the latest valid checkpoint or shutdown totalNanoAiu divided by 1,000,000,000, with a separate session-cumulative source and cutoff; absent counters remain unknown and establish neither tokens nor dollars. Raw transcripts, session identifiers, paths and report text are not retained.
