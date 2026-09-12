# WO-125 repair of VER-002

Dispatch: operator `resume: fix`, 2026-09-12. Failure source:
[VER-002](../../verifications/WO-125/VER-002.md), findings F1–F3.
[D004](decisions.md#wo-125-d004) records the diagnosis, selected repair,
alternatives, goal alignment and reopening conditions. Earlier reports and
evidence editions remain intact.

F1 now recognizes case aliases of installed inputs. Existing components use
native on-disk spelling; installed-root and tracked-file comparisons also
respect Git's case-insensitive setting, including prospective build roots.
On this case-insensitive volume, the inherited classifier returned false for
`NODE_MODULES/probe.js`, `Packages/skeleton/dist/src/probe.js` and
`packages/skeleton/DIST/src/probe.js`. The added case regression failed before
repair and now passes, including a package whose build directory does not yet
exist. Its filesystem-dependent case test explicitly skips on a case-sensitive
volume; it executed here.

F2 now walks physical path components before parent normalization, follows
dangling and chained symlink targets, and preserves the raw shell destination
and working-directory traversal. Scratch reproductions admitted writes through
a dangling link and `dirlink/../probe-new.md`; both created protected files and
changed `gateTreeHash`. The new symlink regression failed against inherited
code. A positive directory-link test then exposed Git's refusal to classify
paths below a symlink. Checking the link entry and physical target separately
preserves ignored scratch, while link cycles remain non-admitting. The actual
generated-hook callbacks use the attempted destination and supplied working
directory, preserving symlink traversal rather than substituting a control file.

F3 removes the held stage's 30-second deadline. The owning test signals release
through its existing barrier files and has a five-minute timeout with abort
cleanup that releases both stages and terminates its child. Stage readiness
waits observe that test signal. Existing controls still exercise every hook and
gate stage, normal release and killed-owner recovery. The new path matrix runs
once through the common classifier instead of multiplying it across the same
entry points.

| Executed check                                                                | Result                                                                                                                                                                            |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build --silent`                                                      | Passed after the final runtime changes.                                                                                                                                           |
| `node --test scripts/test-runner.test.mjs`                                    | 18 passed, zero failed or skipped; 8.02 seconds.                                                                                                                                  |
| `node --test --test-name-pattern=WO-125 scripts/test-harness.mjs`             | Four passed, zero failed or skipped; 94.26 seconds. All case aliases, dangling/chained links, parent traversal, explicit working-directory traversal and scratch controls passed. |
| `node scripts/harness.mjs emit`                                               | Regenerated 24 surfaces with the current immutable runtime snapshot.                                                                                                              |
| `node scripts/authority-evidence.mjs --write --edition WO-125 --revision 003` | Recorded four unchanged programs, four widening refusals, nine runtime denials and 27 bundle comparisons. The selector now names this edition.                                    |
| `node scripts/feedback-evidence.mjs --check`                                  | Ten passing regressions, ten expected removal failures, and the source/policy-bound retained live verifier all passed.                                                            |
| `npm run release -- prepare --local`                                          | Target remains application `v0.17.2` and skeleton `0.15.2`; local tag observation and existing publication controls retained.                                                     |
| `git diff --check`                                                            | Passed during repair; the canonical evidence command records the final-tree check.                                                                                                |

The fresh WO-125 feedback revision 001 remains current: this repair changes
none of its declared `FEEDBACK_SOURCE_PATHS`. This directly addresses VER-002
O4's timing observation without claiming that the feedback audit covers gate
path classification or that another live model audit ran. Authority revision
003 binds the new runtime pins, and the generated-hook fixtures exercise the
new behavior. Product 07 and its publication source lock were updated after
reviewing the changed workflow section. No dependency or component compatibility
contract changed; the transport findings already resolved by the prior repair
retain their original tests and discovery evidence.

The complete `npm run harness -- evidence` gate runs after this report,
measurement, output review and release preparation. Its exact-subject full
gate and diff records are the completion authority; `repair-complete` must
record successfully before handoff. The separately dispatched verifier and
final reviewer retain their roles. Generated-hook tests are executable evidence;
this Codex session uses the explicit begin/observe/delivered adapter and does
not claim automatic hooks. Its sole writer reservation is recorded with
liveness unavailable in the sandbox.

The intended outcome is stable independent-verification inputs. The reproduced
escapes now refuse, scratch controls remain admitted, and the fixture no longer
races a stage deadline. The final input comparison remains necessary for
unhooked writes and tool-boundary races. D004's goal and intervention assessment
still applies; no additional process or transport authority was added.

Actor: Codex CLI `0.154.0`, GPT-6 Astra at `max`, source `operator-attested`
under the repository default, not effective-session readback. Entry collection
first lacked a fresh counter; its successful retry measured 153,790 total
tokens. The pre-report observation at 2026-09-12T12:32:15.771Z measured 2,662,033
total tokens, including 2,545,536 cached input, across 28 observed tool steps;
wrapped command count and monetary cost are unavailable. Source:
`codex-transcript-counter`; scope: `dispatch`. Useful work and waiting are both
included. The initial scratch-positive failure and repeated focused checks are
part of that cost. No equivalent alternative was measured, so no comparative
efficiency claim is made. Final current counters are retained by the harness
usage collector at handoff.
