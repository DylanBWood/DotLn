# WO-198 second repair self-review

Dispatch: `resume: fix`, addressing VER-002 F2 and the operator-approved F3
cleanup. Actor: Codex CLI 0.162.1, gpt-6-astra, effort max, source
codex-session-readback. No worker was launched; the executor skill requires
workers before implementation-ready only. These are two separate root
passes, not independent verification.

Criteria pass: found 0; fixed 0; recorded 0. Read the five criteria, VER-002's
repair rule, the diff from checkpoint 8 and the focused transcript. The catch
contains every operation selecting the diagnostic baseline: read, JSON parse,
sort, filter and Date.parse. It cannot swallow current-run comparison or
recording errors because both remain outside the catch. The two new fixtures
first failed on JSON parsing and Date.parse respectively; after repair they
assert the durable failed row through a direct hot-index read, complete
snapshots and one summary. The timestamp fixture also confirms exactly one
during-run line for all changed fields. Valid-history, legacy, incomplete,
passing and round-trip cases remain passing. No reduced-table task flipped.

Design pass: found 0; fixed 0; recorded 0. The repair adds one exception
boundary at the diagnostic consumer, without changing shared evidence parsing
or pass reuse. The validator export enables direct tests using the same
implementation the caller uses. Its 21 invalid inputs and two valid controls
supplement the two retained integration regressions. Both new fixtures use the
existing disposable-root helpers and teardown; the material inventory is
empty. The before/after shape-case observation is 7851.751 ms versus
981.744 ms plus 0.379 ms, with no claim of repeated-sample precision.

B1 remains on D004's FUP-f5f10101e717d59b: latest-row selection still uses a
snapshot-less host row when that is the last record. The harness writer needs
to preserve its runner's snapshot; searching older rows here would change the
specified interval. D007 records that disposition. A damaged hot index can
still fail at persistence, as on main. No storage-recovery behavior is added.
The full document and review gates are recorded in handoff.md after passing.

Integration assessment after `scope expand: merge in main`: the canonical
helper fast-forwarded to bb84ae82 and reapplied the repair. Upstream's sole
runner edit adds a fixture path to the machinery inventory; neither the
snapshot producer nor the runner test file changed upstream. Read the combined
runner diff and the four conflict resolutions. The pending skeleton patch is
retimed to 0.57.1 above upstream 0.57.0, with its existing console pin; no new
dependency or behavioral conflict resolution. Revision 002 synthetic editions
were written and checked after the integrated build; upstream's feedback
selection checks against its retained live audit. This adds no self-review
finding. D009 and D010 retain authorization, bases, recovery and limitations.
