# WO-132 repair 003 — VER-003 F1

Dispatch: `resume: fix`, using [VER-003](../../verifications/WO-132/VER-003.md)
and the original [work order](../../work-orders/WO-132-machinery-stand-down.md).
The dispatch created checkpoint `refs/dotln/checkpoint/WO-132/13`. F1 is this
repair's sole finding. The seven reported numeric/dash append commands now
identify their actual filenames and are denied when those files are live-gate
inputs. Earlier pathname denials and descriptor-only read admissions remain
covered. [WO-132-D007](decisions.md#wo-132-d007) records the decision and the
append-only correction to D006 and repair 002.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.154.0","model":"gpt-6-astra","effort":"max","source":"operator-attested"}

`codex --version` reported 0.154.0. Model and effort follow the repository's
operator-attested default; no effective-session readback is available. This
session made the implementation writes and spawned no worker. Its explicit
writer reservation was present before implementation edits; the sandbox later
reported reservation liveness unavailable. Codex's automatic enforcement is
not claimed. The hook observations came from generated hooks in isolated Git
fixtures, using this order's own machinery as a disclosed instrument.

## Reproduction and correction

Before editing the adapter, five `/bin/zsh -f -c` commands on zsh 5.9 appended
`probe` to seeded scratch files and exited zero:

| Command suffix after `printf probe` | Actual destination | Adapter before | Adapter after |
| --- | --- | --- | --- |
| `>>&1` | `1` | `[]` | `["1"]` |
| `>>&-` | `-` | `[]` | `["-"]` |
| `>>& 1` | `1` | `[]` | `["1"]` |
| `>>& -` | `-` | `[]` | `["-"]` |
| `1>>&1` | `1` | `[]` | `["1"]` |

The old branch applied the descriptor exception to both `>&` and `>>&`.
The corrected pattern captures the operator separately and skips a numeric
or dash operand only for `>&`. A literal `>>&` operand remains a filename.
Missing, expanded and wildcard operands still return opaque classification.
The [zsh manual](https://zsh.sourceforge.io/Doc/Release/Redirection.html)
and the executed scratch effects agree on this distinction.

The existing parser regression now checks eighteen destination/descriptor
cases and seven opaque cases. The existing live-gate regression tracks files
`1` and `-`, explicitly confirms that both are gate inputs, and checks all
seven commands from VER-003 through `Bash.command`, `exec_command.command`
and `exec_command.cmd`, across `permissions`,
`concurrent-work-requires-worktrees` and `write-observer`: 63 required denials.
Four descriptor-only controls cover the same surfaces: 36 admissions.
The original pathname, ordinary-read and opaque-write cases remain in that
fixture, and writes become admissible after its gate is released.

## Executed checks

| Check | Observation |
| --- | --- |
| New parser and live-hook regressions against the pre-repair runtime | Both failed on `echo marker >>&1`: no filename and no hook denial, 3.48 s |
| `npm run build` | Passed for all four packages; repeated after source formatting |
| `node --test scripts/test-process-debt.mjs scripts/test-harness.mjs` | 90 passed, zero failed, 215.46 s |
| Final formatted build: `node --test --test-name-pattern='VER-003 F1\|WO-132 only the live product gate' scripts/test-process-debt.mjs scripts/test-harness.mjs` | Both passed, zero failed, 31.95 s; confirms the final generated runtime |
| `node scripts/harness.mjs emit`, then `check` | 24 generated surfaces current |
| Authority evidence generation and check | Final revision 004 selected in `docs/evidence/current.json`; nine runtime denials and 27 bundle comparisons checked |
| `npm run test:docs` | All 17 checks passed, zero failed, 66.48 s; includes formatting, publication, current evidence, indexes and document-sensitive package checks |
| `npm run meta` | D007 indexed; cost reconciliation remains advisory |
| `npm run release -- prepare --local` | Target v0.18.0 remains current; component/dependency declarations unchanged |
| Entry-checkpoint evidence comparison | 24 earlier WO-132 evidence/verification files byte-identical; decisions retain the complete earlier prefix; WO-126 through WO-131 evidence unchanged against HEAD |
| `git diff --check`; `git diff --cached --check` | Clean |

Local transcripts: `/tmp/wo132-repair003-before.log`,
`/tmp/wo132-repair003-suites.log`,
`/tmp/wo132-repair003-final-targeted.log`, and the paired
`/tmp/wo132-repair003-shell-before.json` /
`/tmp/wo132-repair003-shell-after.json` observations. Document-check output is
`/tmp/wo132-repair003-docs.log`.
The consequential results above do not depend on those scratch files remaining.

The first authority snapshot in this dispatch, revision 003, was recorded
before the source formatter's final line wrapping. Rebuilding changed the
compiled snapshot identity, so its check correctly reported stale bundle
evidence. Revision 003 is preserved; revision 004 records the final bytes.
The final focused check above ran after that rebuild and regeneration.
The product-guide correction also changed the software-engineer edition's
source lock, which was refreshed from the publication check's observed value.

## Evidence scope and handoff

Only the adapter, its two existing tests, the explanatory write-back and the
associated generated/evidence surfaces changed. No dependency, version, writer
rule, permission setting or utility allowlist changed. All verification reports
remain immutable. The prior timing series and broad acceptance observations
remain those of their original source identities and cutoffs, as VER-003
records; they are not new measurements by this repair.

Final code identity:
`c2e5da2eeddebe2a125c9c13637db1a448896335d55ff3898cdea920b3bd811e`.
This dispatch ran the affected machinery suites and final focused fixture;
it did not run another aggregate `npm test`. The previous product row predates
this source correction. The independent verifier and final reviewer retain
their separate dispatches, and the reviewer runs its required current-source
product gate before publication. No real product-gate input was written while
a gate was live; scratch shell execution and fixture hook admission were
separate observations.

The goal contribution is the repaired protection of the single reviewed gate,
with the seven observed admissions closed and ordinary reads preserved. There
is no additional recurring command or mechanism. Entry process counters were
unavailable (scope `dispatch`, cutoff 2026-09-15T15:15:20.533Z); final counters
remain in ignored observations and the response, unknown when unavailable.
