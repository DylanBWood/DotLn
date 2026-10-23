# WO-225 — Console host contracts

Operator dispatch: `resume: next`, 2026-10-22 (local date). Executor:
`codex-cli` 0.163.0, `gpt-6-astra`, effort `max`, source
`codex-session-readback`. Base: the activated `wo-225` worktree, before
product edits. Existing activation and sibling records were preserved.

## Baseline, before implementation

The bounded `wo225-baseline.mjs` probe collected a temporary launchpad with
a missing requested store, evidence manifest and legacy control log, plus
a synthetic refused-Beacon output in the real constellation format. It
projected the result with the shipped `projectBoard`, then exported the
current tree through `scripts/lib/launchpad-fixture.mjs` and ran
`npm run console -- board --json` there. The successful probe finished at
2026-10-23T01:47:56Z, exit 0; fixture collection took 86 ms.

The board parsed, but all three forbidden-value checks were true: fixture
root, Node binary, and home directory appeared in its serialized strings.
No physical path from the probe is retained here. Leaking sources were:

- Default/requested store status and audit: raw `ENOENT` with the store path.
- Feedback status, audit and maturity: raw missing `docs/evidence/current.json` path.
- Control log: raw missing `docs/control/resume.jsonl` path.
- Release and usage commands: `Command failed: <node-binary>` followed by
  the absolute script path and child stderr.
- Work-order index/history, capability table, publication index, roadmap and
  refutations: raw missing-file/directory paths.
- Refused Beacon `age`: `directory cannot be read: <fixture-root>/refused`.

After adding one order segment but no legacy log, both
`control:canonical-segments` and `resume:status--json` remained unavailable.
The fixture export listed neither console schema; its npm console command
exited 1 with a missing `tsconfig.json` error. Inspection of
`packages/skeleton/src/console-loopback.ts` found only
`/console-commands-v1` and `/console-commands-v1/invoke` route comparisons.

Two initial probe drafts failed before recording a baseline: the first
omitted the required constellation group row; the second redundantly linked
the export's existing workspace links. The corrected probe above passed.
Its fixture repositories were removed by their registered cleanup.

## Source corrections

The order's named `packages/skeleton/test/console-loopback.test.ts` does not
exist at this base. Existing end-to-end loopback and browser-client coverage
is `packages/console/test/console-commands.test.ts`; it is the integration
test surface for the added routes. The current console component is 0.4.5,
not the planning snapshot's 0.4.4. The current execution guide's
§Preflight before the full gate supersedes the order's older repeated
focused-suite sequence: bounded controls, one complete review gate, final
handoff, then the document gate.

Usage at entry: counters unavailable (`session-counters-unavailable`),
scope dispatch, observed 2026-10-23T01:45:12Z. No totals are inferred.

## Implementation probes and review

The no-path counterfactual, instance/export controls and route/snapshot
controls are recorded in [controls.json](controls.json). The real-resident
route case and socket-refusal fixture passed after replacing the forged
Host test's fetch request with raw HTTP. The independent reviews and the
fixed containment finding are in [self-review.md](self-review.md).

Three actual core board CLI collections completed in 1037, 1039 and 1076 ms
on 2026-10-23T02:09:05Z. Keep the planned 30-second freshness and 60-second
child timeout. These measurements cover this local tree, not all instances.

The canonical nested-repository inventory returned an empty list before
final gates; no scratch repository needed removal. Step 10's deterministic
edition and feedback-carry results are recorded in decision WO-225-D014.
Final gate judgments belong in handoff.md after their successful runs.

## Complete review

The fresh `npm test -- --review` completed at 2026-10-23T03:23:32.600Z
with 38 suites passed, 0 failed, 104 fresh tasks and 0 reused suites in
1349.515 s. Decisions D015-D019 preserve the earlier failed/stopped attempts
and their corrections or unresolved timing cause; none supplies a pass.
The [handoff](handoff.md) contains the criterion judgments, final edition
selections and the required subsequent document-gate boundary.
