# WO-125 repair evidence

Dispatch: operator `resume: fix`, followed by the explicit F3 scope expansion
and clarification that only writes which invalidate a gate run should be
locked. Failure source: [VER-001](../../verifications/WO-125/VER-001.md).
[D003](decisions.md#wo-125-d003) records the decisions, scope, alternatives,
operator corrections and reopening conditions.

F1 now refuses runtime values outside `low`, `medium`, `high`, `xhigh`, `max`
and the no-override value `unknown`, before process launch. Explicit levels
still require the observed CLI version. F2 makes an omitted builder version
`unknown`, which cannot authorize explicit effort. Both regressions failed
against the inherited implementation, then passed after repair. The original
`unknown` argument fixture remains unchanged.

F3 registers each gate invocation with its process owner and a unique local
marker. The package entry covers build, preparation and evidence; direct
runner and evidence calls own markers too. Generated pre-tool boundaries
refuse writes that could change candidate Git-tree inputs or installed suite
inputs, naming the active command and run. Ignored scratch writes outside the
input set remain eligible under the existing authority checks. The suite
fingerprint and guard share the dependency/build-root inventory. Tracked
ignored files, new dependency/build roots and symlinks into protected files
remain protected. Native reads and recognized metadata commands remain usable.

An opaque shell command has no proven destination set and remains refused
during a live run. The bounded adapter recognizes literal redirections and
simple file operations; it does not infer arbitrary interpreter effects.
Wildcard-bearing words remain opaque because whole-word quotation does not
prove every character was quoted. Literal destinations resolve from the tool's
actual working directory. Repository helper commands retain their read status
only at the verified root; ordinary Git metadata reads remain available from
other directories.
Normal completion releases the owner's marker; dead owners are ignored.
Process birth observations detect PID reuse where the host process table is
available. Independent nested markers cannot release one another. The final
tree and suite-input comparisons remain necessary for unhooked edits and
tool-boundary races. This is generated-hook enforcement; the repair session
uses Codex's explicit observation adapter and claims no automatic Codex hooks.

| Check                                                             | Executed result                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node --test packages/skeleton/dist/test/worker.test.js`          | 20 passed; zero failed. Includes five admitted levels, durable launch claims, preserved `unknown` bytes, invalid runtime inputs and omitted version.                                                                                                    |
| `node --test --test-name-pattern=WO-125 scripts/test-harness.mjs` | Four passed; zero failed. Real held runner, evidence and package-entry processes reject generated-hook writes before the fixture callback; excluded scratch writes execute; the gate input tree stays unchanged; normal and killed-owner recovery pass. |
| `node --test scripts/test-runner.test.mjs`                        | 16 passed; zero failed. Includes nested ownership, independent worktrees, ignored-but-tracked inputs, prospective installed roots, cleanup on errors and existing scheduling/reuse coverage.                                                            |
| `git diff --check`                                                | Passed before this report; the canonical completion command records the final diff check.                                                                                                                                                               |
| `npm run release -- prepare --local`                              | Application target remains `v0.17.2`; changed skeleton component remains `0.15.2`. Local tag observation only; publication controls retained.                                                                                                           |
| Fresh feedback edition                                            | [Revision 001](feedback-001/feedback.json): ten passing present regressions and ten expected removal failures; a live Codex `max` verifier completed the audit. Its two event streams are retained alongside the report.                                |
| Fresh authority edition                                           | [Revision 002](authority/002/authority.json) and [bundle comparison](authority/002/bundle-diff.json): four unchanged programs, four widening refusals, nine runtime denials and 27 matching comparisons; `--check` passed.                              |

The F3 reproduction first ran a real held gate with the inherited hook logic.
A Write was admitted and the fixture tree changed, reproducing the reported
gap. With the guard installed, every protected attempt is denied. Positive
scratch cases demonstrate the operator's narrower boundary. The active-gate
fixtures take 71.89 seconds together; the runner fixtures take about 6.35
seconds. These are repair checks, not a measurement of production savings.

Current-byte review found a partly quoted wildcard reaching a non-ignored
file through an ignore exception, and a relative path changing meaning under
a tool-supplied working directory. Isolated probes reproduced both. The added
generated-hook regression failed before correction: the old guard admitted
`rm scratch/"protect"*`, which changed the fixture tree. All four held-gate and
dead-owner cases then passed with the corrections, including refused wildcard
redirection, relative writes under another cwd and an opaque script under that
cwd; an explicit-cwd scratch write and Git metadata read remain admitted.

The first full repair gate ran 704.34 seconds: 36 suites passed and the planning
continuation check failed because the authorized repair appendix had a custom
level-two heading. The required `## Execution record` heading now contains the
same scope text. The failure and passing diff check remain recorded; no input
changed during that gate, and the independent planning criteria are preserved.

The final `npm run harness -- evidence` runs after the authored report and
release preparation. Its exact-tree full-gate and diff results are retained in
the host gate record; `repair-complete` requires those results to pass. This
report does not substitute for the separately dispatched work-order verifier
or final reviewer. Original discovery rows and earlier evidence editions are
retained. The publication source lock was refreshed after reviewing the changed
product-07 workflow section; no new dependency was introduced.

The goal is dependable launch selection and stable independent-verification
inputs. The observed negative and positive fixtures support that outcome and
D003's intervention limits. The initial whole-worktree design was narrowed in
response to the operator, preserving useful local scratch work. Frequent CLI
upgrades remain a stated maintenance cost of the order's existing version
policy; this repair adds no transport-version restriction or new readback claim.

Actor: Codex CLI `0.154.0`, GPT-6 Astra at `max`, source
`operator-attested` under the repository default; not effective-session
readback. The first successful usage observation was 144,816 total tokens,
source `codex-transcript-counter`, scope `dispatch`. The latest pre-handoff
observation at 2026-09-12T02:28:07.350Z was 10,389,980 total tokens, including
9,857,536 cached input, over 88 observed tool steps; wrapped command count is
unavailable. This includes the failed full gate and current-byte review.
The separate live feedback verifier used 84,092 result-envelope tokens, which
the existing helper attributes to the verifier role. Counts include useful
work and waiting. No equivalent completed alternative or monetary cost was
measured, so no comparative efficiency or price claim is made. Final current
counters are retained through the harness usage collector at handoff.
