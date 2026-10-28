# WO-236 independent consistency review

Worker: `codex-spawn-agent`, fresh `consistency_reviewer`; requested model
`gpt-6.1-sol`, effort `max`. Returned 2026-10-28 during `resume: next`.
The worker verified cwd/Git root and reviewed the order, diff and selected
untracked outputs read-only. It ran no suite or generator, made no write
and spawned no descendant.

Found 1; fixed 1; recorded 0; open 0.

**C1 — Test dependency declaration, fixed.**
[test-process-debt.mjs](../../../scripts/test-process-debt.mjs) reads the
new WO-236 role baseline, but its declared inputs omitted that fixture.
The executor added it beside WO-233 in
[test-runner.mjs](../../../scripts/test-runner.mjs), preserving historical
entries. The worker re-read and confirmed the remedy.

Other checked metadata agrees: component versions and exact lockfile
pins, v0.101.0 preparation, product/security/kit write-backs, twelve
installed role hashes, thirty historical baseline links, twelve
cold-start measurements and effective ceilings, and twenty-seven console
fixture input hashes.

Disposition: [D009](decisions.md#wo-236-d009). At the first review's cutoff,
final synchronization, refreshed head controls, complete validation and
the final handoff write-back check remained the executor's duty. The same
worker is retained for that final write-back review.

## Supplemental review after the stopped complete run

The same worker returned after re-reading the two expectation changes.
New independent findings 1; fixed 1; recorded 0; open 0.
Cumulative independent counts: found 2; fixed 2; recorded 0.

- **Gate-discovered remedy confirmed.** The first pass missed the exact
  authority-projection expectation. The explicit target-worktree effect,
  `contributor.target-worktree` and operator provenance are now present in
  [test-authority-grants.mjs](../../../scripts/test-authority-grants.mjs).
  The unrelated-grant refusal remains intact.
- **C2 — Exact writer-envelope expectation, found and fixed.**
  [writer.test.ts](../../../packages/skeleton/test/writer.test.ts) also
  omitted the added effect. It now includes that effect while preserving
  the denied effects and `{ writers: 1 }` limit. The worker re-read and
  accepted the remedy.

No further omissions were found in the scanned current source/test
expectations. Other inspected comparisons use dynamic envelopes or
intentionally unrelated synthetic grants. Both corrected tests already
belong to registered suites; neither adds fixture inputs nor changes the
live-feedback source set. The review remained read-only, with no suite,
command generator, write or descendant. Dispositions:
[D010](decisions.md#wo-236-d010) and [D011](decisions.md#wo-236-d011).

## Supplemental review after the second complete run

The same reviewer confirmed both current consumers now select WO-236 with
WO-233 as parent. All six keyed startup-cost records agree with the twelve
installed-root measurements, nominal limits, accepted ceilings, parent
hashes, historical costs and historical follow-ups. The gate-discovered
startup-byte mismatch is separate from independently found review issues.

**C3 — Direct startup-test inputs, found and fixed.** The startup-cost test
reads `docs/control/budgets.json` and `CLAUDE.md`, but the process-debt source
list omitted both. The executor added both paths; the worker re-read and
confirmed the declarations and [D013](decisions.md#wo-236-d013). The helper,
current role fixture and imported budget module were already declared.

The remaining-consumer scan across scripts, packages and corpus found no
other current selector or schema mismatch. The two gate-discovered remedies
are both reviewed. Cumulative independent counts: found 3; fixed 3;
recorded 0; open 0. These checks were read-only inspection and metadata
arithmetic; no suites, generators, writes or descendants. Final handoff
write-back review remains owed after complete validation.

## Original-scope inventory and final pre-gate corrections

The reviewer withdrew its earlier broad no-omissions claim. Its subsequent
bounded inventory traced the changed kind/effects through compiler validation,
manifest lowering, Contributor authority consumers, both current oracle
selectors, startup costs and declared inputs, host launch producers and captured
expectations, versions/edition pins, generated guidance and duplicated current
operational summaries. Dynamically constructed names and arbitrary prose
paraphrases remain outside exhaustive lexical proof; external fork/live-host
behavior was not inspected.

**C4 — Duplicated operational grant summary, found and fixed.** Product 07's
Machinery stand-down summary still named five kinds and said the default roles
carry only the common three grants. It now states the sixth kind, preserves
those common grants and names the executor's registration, physical-launchpad
and active/repairing conditions. The same reviewer read and confirmed the fix.

The third gate-discovered failure was the second launch-output consumer in the
release fixture. The exact quoted launchpad cwd and target add-dir are now
required there. The reviewer read that correction and retained neighboring
publication-rule assertions. Parent-provided executable evidence is the named
release-case reproduction: one executed pass, zero skipped, 493,725 ms.

Current independent counts: found 4; fixed 4; recorded 0; open 0 within the
inspected original scope. Three gate-discovered expectation repairs are counted
separately. These inventory and remedy checks were read-only; no suites,
probes, generators, writes or integration commands were run by the reviewer.

The operator subsequently directed all newly raised process/documentation
issues into follow-ups. Durable review/preflight machinery, role-procedure
changes and document reorganization are deferred; the proposed design was not
implemented. Final handoff write-back review remains after complete validation.

## Final write-back review after the passing complete run

The same worker reviewed the final handoff, decisions, register and corresponding
metadata after complete validation. Cumulative independent counts: found 5;
fixed 5; recorded 0; open 0 within the inspected scope.

**C5 — Structured-decision fragments, found and fixed.** Seven Markdown links
used short decision fragments although the rendered headings include descriptive
titles. The role oracle also used the short D007 provenance fragment. Six explicit
HTML aliases in decisions.md preserve those stable references without changing
the tested oracle or product-document bytes. The reviewer re-read the remedy;
37 decision references, 12 register references and 25 direct Markdown
destinations resolved.

The reviewer confirmed the handoff's ten distinct fixed defects: two criteria,
one design, five consistency and three gate observations, minus the shared
launch defect. The actual register contains twelve operator issues, eleven
deferred and the idea-ledger issue allocated to WO-088. The scoped diff preserves
the operator's prohibition on implementing their proposed fixes here.

Inspected metadata agreed: package pins and selected editions, twelve role
hashes, thirty historical baseline links, twelve startup measurements,
twenty-seven console input hashes, thirty-four installed hashes and 246 runtime
hash comparisons. The passing complete row agrees with the handoff's identity,
duration, 41 suite results and 107 fresh tasks. The reported usage source, scope,
cutoff and unavailable monetary cost agree with the ignored receipt metadata.

This was a bounded, read-only review. The worker ran no suites or generators,
did not inspect every task transcript and did not test external live hosts.
Runner/waiter exits, current code identity and matching head-control runtime
digests are parent-observed evidence. The final document gate and
ImplementationReady transition remained owed at this review's cutoff.
