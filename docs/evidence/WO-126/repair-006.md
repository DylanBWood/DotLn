# WO-126 repair of VER-006

The operator's `resume: fix` selects [VER-006](../../verifications/WO-126/VER-006.md).
F29 and F30 are repaired within criteria 8 and 17. Final full/diff evidence
belongs to the `RepairCompleted` transition after this report, as D022 requires.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.154.0","model":"gpt-6-astra","effort":"max","source":"operator-attested"}

The version is the local CLI observation. Model and effort use the repository's
operator-selected default, without effective-session readback. This Codex session
uses explicit begin/observe/delivered accounting; it claims no automatic hooks.
Its writer reservation is exclusive, with host-process liveness unavailable.

- **F29:** recognized effect programs retain the literal denial floor after
  known Git message/file and search-pattern values are removed. This covers all
  eighteen reported routes, unknown subcommands/options and pipeline input.
  Git grep pager commands keep the screen. Structured checks retain precise
  denied effects; ordinary message, search and wrapper-data controls remain
  admitted. The installed permission hook agrees with the classifier.
- **F30:** each hook retains its diagnostic outcome, with an invocation digest
  when the host supplies a tool-use identity. The meter deduplicates across all
  wired PreToolUse hooks and repeated deliveries. Separate tool uses and sessions
  remain distinct. The fixture also checks that raw identities and command text
  are absent. Historical and identity-free rows keep their original individual
  outcome counts, which can overcount commands; no missing identity is inferred.

Both new regressions failed before the repair in **1.516 s**: the rebase command
was admitted, and one tool use counted as two. The initial repaired pair passed
in **12.041 s**. After adding grep pager and option-boundary cases, all fourteen
affected classifier, attribution and installed-hook tests passed in **20.064 s**:

```sh
node --test --test-name-pattern='effect inventory|executable paths|interpreter programs|literal invocation floor|GitHub request|package execution|assignments and Git|case-folded|effect-program operands|all wired hooks|guard refusals|dynamic executable|commit attribution|installed permission' scripts/test-process-debt.mjs
```

The build passed and the generated harness was refreshed. These are executor
observations of the instrument being changed, backed by direct classification
and separately launched generated hooks in disposable fixtures. Denied payloads
were never executed. The adapter still does not interpret arbitrary script
files, encoded transformations or ambient configuration. The feedback audit's
declared source set is unchanged, so immutable `feedback-002` remains its edition.

The first full gate exposed stale publication source locks and the bundle
comparison; both existing projections were refreshed. The next run passed 36 of
37 suites in 512.26 s, including process-debt, but `release:case:stale_helpers`
exited after worktree setup without an assertion diagnostic. Isolated traced
runs passed with fresh setup, sealed-template setup and the runner's projected
environment. A second full retry failed the same fixture. Temporary error
reporting then accompanied a full-run pass of that fixture, while the console's
host-collection test instead reported `release:list` unavailable. The immediate
causes remain unconfirmed. Temporary diagnostics were removed; no release or
console behavior, timeout or assertion was changed. Failed gate evidence is
retained, and the final retry reuses valid successes at their declared inputs.

Correction recorded on 2026-09-10: the previous repair treated remaining effect
program arguments as data and equated hook outcomes with tool refusals. The
intended boundaries are proven data operands and distinct identity-bearing tool
invocations. [D027–D028](decisions.md#wo-126-d027) record the evidence, alternatives
and reopening conditions; product 02 and 07 carry the resulting behavior.

Cost: bounded operand filtering and one digest per identity-bearing denial replace
the unsafe program-wide exception and duplicate meter counts. No hook, dependency,
recurring command or operator step is added. The two regressions join the existing
suite; the focused checks above precede the existing single full/diff completion
command. Runtime parsing/hash overhead, total context bytes, tokens and full-session
resource cost are unmeasured. No new cap or fast-gate timing claim is inferred.
The existing minor release target and component bumps remain applicable; local
release preparation retains publication controls. Independent verification and
final review remain separate dispatches.
