# WO-044 repair of VER-003 F1

**Dispatch:** `resume: fix`. **Observation cutoff:** 2026-09-15T02:19:38.030Z.
The subsequent `RepairCompleted` event in `docs/control/orders/WO-044.jsonl`
binds this repair to its final checked tree. Final gate and usage counters stay
in ignored receipts and the handoff response.

The documented `npm run harness -- evidence --fail` command previously built,
printed usage and exited 1 before recording any check. The generic paired
options parser rejected the flag before the evidence branch recognized it.
That parser now belongs to the emit/check branch, so evidence reaches its
existing strict selector. The wrapper, runner, preparation and stop behavior
retain their existing implementations. Decision [D017](decisions.md#wo-044-d017)
records the rationale and corrects D014's unsupported public-command claim.

## Executed evidence

- The exact package command reproduced VER-003 F1 before the fix. The updated
  public-command regression also failed with that same usage error at the
  assertion requiring exit 0.
- After the fix, the real package command exited 0 and recorded exactly one
  executed, successful `git diff --check`; it did not run `test:full`.
- Three targeted process-debt tests passed: failure lifecycle requirements,
  the public fail/default commands, and reuse of a current full-gate result.
  The command fixture copies the real entry files, package mapping and
  preparation dependencies. Its build and suite payloads are bounded
  event markers: failure runs the build alone; default runs the build and
  `test:full`. The fail-only receipt cannot satisfy a passing lifecycle gate.
  These three tests also pass under `NODE_OPTIONS=--preserve-symlinks`, the
  replica setting that exposed the initial fixture's dependency-link mistake.
- `node scripts/harness.mjs check` passed all 24 generated surfaces.
- The final canonical full gate and diff check are recorded by the completion
  event, after release preparation and these write-backs.

The execution guide now names the working failure command and its limits;
the software-engineer publication source lock follows that guide change, and
both publication editions pass their checks. Local release
preparation retains this order's classified patch release. This repair adds no
scope beyond F1 and its write-backs. VER-003's nonblocking limits and D016's
planning disposition remain disclosed in their original records. No live
provider probe is needed for this argument-parser repair.

The observed benefit is a working diff-only failure handoff through the normal
operator entry point; no claim is made that build or projection preparation is
removed. A read-only agent reviewed the parser and regression boundary. This
executor remains the only writer and uses explicit Codex session observation
and delivery records; those records do not constitute independent verification.

## Gate follow-up

The first full attempt failed in the new fixture under preserved symlink
resolution. Local dependency copies repair that counterexample. It also
reported EINVAL cleaning a release-preflight replica after the case passed
(cause unestablished), and the sandbox refused the shared Git cache write.
The latter also appears in earlier WO-044 repair and VER-003 logs: WO-129 moved
the cache from the worktree into the Git common directory on September 13,
outside this Codex sandbox's writable roots. The executor missed that existing
host prerequisite. An outside-sandbox retry was stopped when the fixture
failure was diagnosed; no check was recorded for the stopped run. The final
gate runs with approved cache access after the fixture correction. Failed and
stopped attempts remain in the ignored `wo044-fix-ver003-gate*.log` files.
