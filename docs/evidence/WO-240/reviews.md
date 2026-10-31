# WO-240 independent reviews

Three `dotln-worker` agents (`claude-opus-5-5`, pinned at `xhigh`; no effort
readback) reviewed the finished implementation and its write-backs before the
recorded complete runs, read-only and with nonoverlapping briefs. Each change
went back to all three until every recheck reported `found 0`.

| Round | Criteria adversary | Design improver | Consistency reviewer | Distinct |
| --- | --- | --- | --- | --- |
| First review | 8 | 9 | 4 | 19 |
| Recheck of the repairs | 5 | 1 | 3 | 7 |
| Narrow recheck | 0 | 1 | 2 | 2 |
| One-line recheck | 0 | 1 | 0 | 1 |
| Confirmation | 0 | 0 | 0 | 0 |

That is 34 reports of 29 distinct findings: 28 fixed, and A3 fixed in part with
the remainder recorded in
[WO-240-D005](decisions.md#wo-240-d005--put-the-selected-runtime-first-on-every-gate-childs-path).
[WO-240-D016](decisions.md#wo-240-d016--cores-document-gate-failed-on-node-24-where-the-complete-run-cannot-see-it),
[D017](decisions.md#wo-240-d017--resolve-the-three-independent-reviews) and
[D018](decisions.md#wo-240-d018--resolve-the-reviewers-recheck-of-those-repairs)
carry the decisions.

## First review

| Finding | Severity | What it found | Disposition |
| --- | --- | --- | --- |
| F1 | High | `kernel-docs` failed on Node 24: `JSON.stringify` overflows on the deep-nesting stream, so core's document gate was red in a suite the review selection never runs | Fixture repaired, limit recorded, and `test:docs` and `test:machinery` added to the Node 24 evidence |
| D1, A1 | High | `harness check` read the range from the working directory, so a target's `engines` field caused a false refusal | Fixed: every caller judges the running checkout |
| D2 | Medium | The runner's `nodeVersion` option existed only for a test | Removed; the fixture declares a range in its own `package.json` |
| A2 | Medium | The stale-build guard survived deletion | Fixed: the first-task fixture carries a stale runtime |
| A3 | Low | `harness evidence` could report a cached pass on an outside Node, and its `npm test` child finds `npm` by name | Refusal added; the child recorded in D005 |
| A4 | Low | Reverting `harness-entry` failed nothing | Fixed: the `build` npm script is gone from both fixtures |
| D3, A5 | Low | `enginesRange` had no caller, and `checkHost` was not pinned to the file | Replaced by `packageRoot`, with a fixture file |
| D4, A8 | Low | An unreadable `package.json` read as no constraint | Fixed: it refuses |
| D5 | Low | A comment, and D002, said this reader treats a prerelease as npm does; npm admits `24.16.0-rc.1` | Both corrected |
| D6 to D9 | Low | Four comments were wrong or overclaimed | Corrected |
| A6 | Low | Reader mutants survived | Cases added |
| A7 | Low | No test read a workspace `engines` field | Fixed: the export case reads each one |
| F2 | Low | `CONTRIBUTING.md` said `--review` runs every task fresh | Corrected |
| F3 | Low | ADR-0002 still named the old range as current | Amendment appended |
| F4 | Low | "every gate" overclaimed, because a target gate does not judge Node | Sentences corrected |

## Rechecks

| Finding | Severity | What it found | Disposition |
| --- | --- | --- | --- |
| N1 (all three, from different sides) | Medium | The deep-nesting tolerance held on every Node, for any `RangeError`, and counted the stream as byte-identical | Now below Node 26, for the stack overflow, on that stream, and reported as decoded only |
| R1, R2 | Low | A leading-zero range mutant and `browser-evidence`'s `engines` survived | Cases added, and a test reads every package and lock entry |
| N2 | Low | An unreadable file was told to declare a range, and a byte-order mark broke a valid file | Its own refusal, and the mark is skipped |
| N3 (criteria) | Low | Nothing pinned the rejected launchpad-override route | `DOTLN_LAUNCHPAD` set on the foreign-directory case |
| Consistency N1, N2 | Low | `feature-configuration` missed a reader, and D017's tally did not reconcile | Corrected |
| Design N2, consistency N5 | Low | A readable file with a null field read as unreadable | Fixed: it is no constraint, as npm reads it |
| Consistency N4 | Low | D002's evidence list went stale | Corrected |
| Design N3 | Low | A doc comment and D002 said npm reads a missing file as no constraint; npm stops with `ENOENT` | Both corrected |

The design reviewer disclosed one probe outside its rules: `npm ci` in an empty
temporary directory, which exited 1 with `EUSAGE`, installed nothing and touched
nothing in the repository.
