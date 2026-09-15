# WO-132 repair 004 — VER-004 F1

Dispatch: `resume: fix`, using [VER-004](../../verifications/WO-132/VER-004.md)
and the original [work order](../../work-orders/WO-132-machinery-stand-down.md).
The dispatch created `refs/dotln/checkpoint/WO-132/17`. F1 is the sole repair
item. Both output-redirect branches now require a plain literal operand prefix;
shell-special prefixes return opaque classification and retain the live-gate
refusal. [D008](decisions.md#wo-132-d008) records the choice and the append-only
correction to D006/D007 and product 07.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.154.0","model":"gpt-6-astra","effort":"max","source":"operator-attested"}

`codex --version` reported 0.154.0. Model and effort follow the repository's
operator-attested default; effective-session readback is unavailable. This
session was the sole coding writer and spawned no worker. Its explicit writer
reservation was present before implementation edits; reservation liveness was
reported unavailable after the short-lived parent exited. Automatic Codex hook
enforcement is not claimed. Generated-hook observations use isolated Git
fixtures and the order's own machinery as a disclosed instrument.

## Reproduction and repair

Before editing the adapter, both new regressions failed on
`ls scripts >!packages/skeleton/dist/src/harness-command.js`: the parser returned
the `!`-prefixed spelling and the generated permissions hook admitted it.
The retained run exited 1 with two failures in 6.46 seconds.

Seven fresh `/bin/zsh -f -c` scratch executions (`>!`, `1>!`, `>>!`, `>&!`,
`>>&!`, `&>!`, `&>>!`) all wrote or appended to `out`, never `!out`. The
adapter returned `["!out"]` for each before the repair. In `/bin/bash -c`,
five forms wrote `!out`; `>>&!` and `&>>!` exited 2. After the repair every
one of these fourteen adapter observations is opaque. Payloads executed only
in temporary directories, never against this worktree's gate inputs.
The [zsh redirection manual](https://zsh.sourceforge.io/Doc/Release/Redirection.html)
and its [filename-expansion rules](https://zsh.sourceforge.io/Doc/Release/Expansion.html#Filename-Expansion)
support treating the shell-dependent prefix conservatively.

The shared check accepts an ASCII letter, digit, dot, underscore or slash at
the start, or the literal dash filename. It retains existing expansion checks
and the distinction between `>&` descriptor operands and `>>&` filenames.
The parser regression pins the ten reported subjects, 216 combinations of
operators/descriptors/spacing/targets with `!` or `=`, and 40 ordinary literal
path cases. This matrix tests classification; it does not claim every spelling
is valid in every shell.

The generated live-gate fixture checks the ten reported commands through
`Bash.command`, `exec_command.command` and `exec_command.cmd`, across
`permissions`, `concurrent-work-requires-worktrees` and `write-observer`:
90 required denials. Four additional spaced/equals subjects add 36 denials.
All earlier pathname/numeric/dash denials and the 36 descriptor-only read
admissions remain. The same writes are admitted by the permissions hook after
the fixture gate is released.

## Executed checks

| Check | Observation |
| --- | --- |
| `npm run build` after final source formatting | All four packages built |
| `node --test scripts/test-process-debt.mjs scripts/test-harness.mjs` | 91 passed, zero failed, 236.45 s; live-gate fixture 52.59 s |
| `node scripts/harness.mjs emit`, then `check` | 24 generated surfaces current |
| Authority evidence generation and check | Revision 005 selected; nine runtime denials and 27 bundle comparisons checked |
| `npm run test:docs` | 17 passed, zero failed, 68.32 s; includes publication, format, evidence, indexes and document-sensitive checks |
| `npm run meta` | D008 indexed; cost observations remain advisory |
| `npm run release -- prepare --local` | Target v0.18.0 remains current; component and dependency declarations unchanged |
| Prior evidence comparison against checkpoint 17 | 30 files byte-identical; decisions retain the complete earlier prefix; WO-126–WO-131 evidence and verification directories unchanged against HEAD |
| `git diff --check`; `git diff --cached --check` | Clean |

The first default authority check still selected revision 004 and correctly
reported its bundle snapshot stale. Revision 005 preserves the final runtime;
after selecting it, the default check and document gate passed. All older
revisions remain intact. The software-engineer edition's source lock follows
the changed product paragraph. Release preparation refreshed only the draft
PR's generated process table.

Local logs: `/tmp/wo132-repair004-before.log`,
`/tmp/wo132-repair004-suites.log`, `/tmp/wo132-repair004-docs.log`,
`/tmp/wo132-repair004-authority.log`, and the paired
`/tmp/wo132-repair004-shell-before.json` / `/tmp/wo132-repair004-shell-after.json`.
The consequential results above do not depend on retaining those scratch files.

## Scope and handoff

Code identity: `8e24bc8c482b8a8f02830b201ac6d2b02c53c1baeb14660decd304ed678e2a43`.
Only the adapter, its two tests, explanatory write-backs and their generated
surfaces changed. No dependency or additional recurring command was added.
The ten reported admissions are closed while descriptor-only reads remain
admitted, preserving the meaning of the single reviewed product gate.

This repair ran the affected machinery suites and document checks. It did not
run an aggregate `npm test`; the earlier product row predates this source
change. The prior timing series and unrelated acceptance evidence retain their
original identities and cutoffs. Independent verification and the reviewer's
required current-source product gate remain separate dispatches. The next real
order's one-gate history and live release publication remain future observations.

Entry process counters were unavailable (source `unavailable`, scope `dispatch`,
cutoff 2026-09-15T16:08:37.176Z). Final counters remain in ignored receipts and
the response, unknown when unavailable.
