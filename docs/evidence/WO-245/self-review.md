# WO-245 independent implementation reviews

The executor launched three fresh read-only `codex-spawn-agent` workers after
implementation and its write-backs were complete. Each was selected as
`gpt-6.1-sol` with `max` effort; effective worker readback was unavailable.
The same workers rechecked the selector repair before the complete run.
No worker wrote repository files, launched a gate or spawned descendants.

| Reviewer | Found | Fixed | Recorded | Result |
| --- | ---: | ---: | ---: | --- |
| Criteria adversary (`criteria`) | 1 | 1 | 0 | Raw and normalized redaction assertions strengthened after the scanner repair. |
| Design improver (`design`) | 0 | 0 | 0 | No actionable structure, coupling or error-handling defect. |
| Consistency reviewer (`consistency`) | 3 | 2 | 1 | Selector and remaining guide reference repaired; documentation-sensitive reuse deferred. |

The criteria worker initially reviewed the full production change and acceptance cases,
including unchanged CLAUDE.md and .gitignore refusal coverage. Its one bounded
process selected the two new kit-marker release-preparation tests: 2 passed,
0 failed, exit 0. The selector recheck ran no additional probe and confirmed
that the stopped accidental run supplies no pass.

The design worker reviewed export, seed planning, refresh, release preparation
and close, plus the surrounding write/rollback paths. It transferred the
shared document-input reuse concern to consistency rather than counting it
twice. Its static-import watch was resolved by tracing existing fixture inputs.

Consistency C1: `docs/KIT.md` had lost the old template's test-selection
coverage. Both `launchpad.sources` and `machinerySources["launchpad-planning"]`
now declare it. C2: documentation remains outside core's product code identity;
selectors alone cannot invalidate old product task results after a guide-only
edit. [WO-245-D005](decisions.md#wo-245-d005) records this boundary and deferred
FUP-912adb42a652b75f. This handoff requires a fresh complete review run and a
passing document row for the final exact tree.

The consistency trace checked these producers and consumers:

- `KIT_FILES.documents`, export source reading and manifest hashes; both
  explicit fixture copiers, and the instance-history copier derived from the
  declared list.
- Guide consumers for suite inventory, discovery, build advice and the
  historical update procedure; remaining README readers still judge front
  pages, release claims or historical seeds.
- The seed's SHA-256 pin, default name, guide pointer, manifest exclusion and
  exact release block; the eleven guide headings and absent guide block.
- `planStarterSeeds`'s `{rewrites, kept}` result through refresh and both direct
  test consumers; kept paths and reasons through published fixture rows.
- Optional kit-root markers through preparation and working/committed close
  checks, while malformed blocks and core requirements remain covered.
- Historical seed hashes and the unchanged committed history bundle; the
  customized cloned page protected through update and preparation.
- The new static `runtime-inputs` import through export, prebuild, release,
  worktree, configured, target and Beacon fixture inputs; the leaf is already
  carried by each traced consumer.
- Application v0.108.0 versus seed v0.1.0, unchanged package/dependency and
  installed-guidance inputs, decisions/index/follow-up correspondence, and
  regenerated publication locks.

The four customized README cases publish one incoming kit manifest, so
receipt deduplication preserves the fixture's expected count of two. No
expectation was relaxed for that concern. The initial publication lock failure
and the executor's accidental stopped gate are recorded in the decisions.

Limits: these reviews do not substitute for the separate complete and document
runs, remote starter publication, or a review of the entire historical-record
corpus. The broader documentation-sensitive reuse boundary remains deferred.

After the first complete review run failed its configuration-root preflight,
the executor corrected the new guide pointer to use `defaultDocRelative`.
The consistency review had missed this literal-root coupling. The unchanged
focused test passed all 18 cases; D006 records both results. All three existing
workers rechecked that repair and reported ready for a fresh complete run,
with no additional findings or probes. At that recheck, reviewer counts were 2 found,
1 fixed, 1 recorded; including the gate-found defect gives 3 found, 2 fixed,
1 recorded. No required validation is inferred from these reviews.

The second complete run found one further missed consumer: the local-terms
export test expected its guide-term match in `README.md`. The actual scanner
correctly reported `docs/KIT.md`. D007 records the failure and the repair,
which checks the guide heading and the seed's release claim separately while
retaining file-and-line, redaction and no-write assertions. The named bounded
test passed, 1 test and 0 failures. The subsequent criteria recheck found that
the new case-sensitive raw-term assertions missed lowercase, joined keys
from the scanner's normalization. The final patterns reject raw and normalized
forms. Consistency's expanded trace also found an authority-test comment
still pointing to README First steps; it now names `docs/KIT.md`. That trace
covered embedded path regexes, prose selectors, command extraction, seed
messages and shell references; remaining README uses concern seeds, claims,
history or directory indexes. The bounded scanner test passed again after
both fixes, 1 test and 0 failures, at 2026-11-02T02:15:20.257Z.

All three existing workers rechecked the final repair and reported ready for
the next complete run. Criteria accepted the strengthened redaction patterns;
design found no new coupling or error-handling issue; consistency accepted
the guide reference and matched the decision, index and review counts.
Reviewer totals are 4 found, 3 fixed, 1 recorded; including both gate-found
defects gives 6 found, 5 fixed, 1 recorded. No worker ran a probe during these
final rechecks.
