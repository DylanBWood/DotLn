inconclusive: only the public-input discovery-candidate ranking task (T2) met
every pre-registered floor; the receipt abstraction (T1) and hook-journal
classification (T3) did not.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-5.6-sol","effort":"xhigh","source":"codex-session-readback"}

## Decision

The local actor kind may perform T2's read-only ranking of discovery-producer
candidates when all inputs are committed public material or the seeded scratch
repository, the six-candidate contract is unchanged, and host code validates
coverage before consuming the result. This is one fixed-cell role
qualification, not a capability level. T1 and T3 remain unqualified. No result
here qualifies private-input use, source writing, implementation, or
independent verification.

The whole pilot is `inconclusive`, rather than `ready`, because all three tasks
had to pass for `ready`; it is not `negative` because T2 passed. The blocker is
exactly: `Only T2 met every pre-registered floor`.

## Registered method

The canonical evidence contains 30 baseline episodes: T1, T2 and T3; local and
Codex transports; five repeats per cell. It also contains five one-factor cells
and three local unexpected-input cells. Every episode uses harness build
`29d874bd99ac741c9da31e4a8c4321a3bf7b562bb23187b7bb585a330c22b8b4`.
Prompts, schemas, deterministic oracles, fixed local decoding, thresholds and
cell count remained unchanged after the counted matrix began.

The local subject is the WO-137 pinned Qwen3.6 27B Q4_K_M artifact, SHA-256
`33625d8dc3a5dd8d88c324d47db58561b11f7072816287078bfe58b4c55782f9`.
Identity came from `lms ps --json` after load, not the request's model field.
The comparator is `gpt-5.6-sol` through codex-cli 0.155.1's existing inspection
shape at xhigh effort, with tools and model-side network disabled.

The operator supplied one held-out ordering of the six synthetic T2 candidates
and reported spending about 60 seconds; the record uses `elapsedSeconds: 60`.
No operator intervened inside an episode. All source inputs are committed
public material or generated from the committed seeded scratch repository.
No no-egress claim is made.

## Baseline results

| Task | Local schema | Local agreement | Remote schema | Remote agreement | Local median latency | Local median tokens/s | Result |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| T1 receipt abstraction | 0/5 | 0.000000 | 5/5 | 1.000000, no repeat variation | 19,195.790 ms | unavailable | does not qualify |
| T2 candidate ranking | 5/5 | 0.828571 Spearman, no repeat variation | 0/5 | 0.000000 | 12,167.709 ms | 18.094 | qualifies |
| T3 hook classification | 5/5 | 0.833333, no repeat variation | 5/5 | 1.000000, no repeat variation | 26,055.974 ms | 14.710 | does not qualify |

Every local median was below the 120-second ceiling and every baseline had zero
operator interventions. T1 failed schema validity, the 0.9 agreement floor and
remote parity. T2 passed 5/5 schema validity, the 0.7 agreement floor, remote
parity, latency and intervention floors. T3 passed schema, latency and
intervention floors but missed both 0.9 agreement and the within-ten-points
remote comparison.

The remote comparator is evidence, not a gold standard: all five T2 episodes
were typed transport failures. T2's local qualification
still rests on its absolute 0.7 floor and held-out operator ranking, not merely
on outperforming that failed comparator.

## One-factor and unexpected-input cells

- T1 field-map support did not repair the invalid result shape: agreement
  remained 0.
- T2 triage-rubric support left agreement unchanged at 0.828571 for local and
  did not repair the remote transport failure.
- T3 label definitions moved the single local factor cell from the 0.833333
  baseline median to 1.0. One supported cell is a next-experiment signal, not a
  qualification.
- Unexpected T1 input produced a retained typed validation failure. Unexpected
  T2 input returned a schema-valid `blocked` result requesting human direction,
  with zero actual intervention. Unexpected T3 input attempted classification
  instead of blocking and was retained as a typed validation failure.

## Collector correction and retained attempts

The first complete-looking matrix is retained unscored under
`attempts/gate-race-005`. Point preflights detected gates before each cell, but
timestamp review showed they could not cancel a cell when another worktree
started a product gate after launch. The collector now polls for a product gate
throughout both HTTP and Codex episodes, cancels on overlap, and writes no
episode file for the interrupted cell. A focused double exercises that
behavior. The canonical matrix was rerun from an empty episode directory under
the corrected single build; several real overlaps were discarded before the
first replacement set was completed. Formatting the probe afterward changed its
byte hash, so that otherwise clean set is retained unscored under
`attempts/postformat-stale-006`; the accepted 38 records were recollected from
empty once more under the formatted final source. Earlier setup, preflight and
instrumentation attempts also remain under `attempts/` and do not contribute to
scoring.

## Limits and next qualification

Five repeats estimate only these fixed prompt/task/build cells. The comparison
uses one local artifact, one remote model and one host; it is not a population
reliability estimate or leaderboard. The T2 oracle is one operator ordering of
one six-candidate fixture. The operator's ranking time is self-reported, and the
model-run energy cost and USD cost were not measured.

T1 needs a fresh inspection qualification that preserves the fixed schema and
demonstrates 5/5 valid abstractions at the stated agreement and comparator
floors. T3 needs a separately pre-registered repeated cell for the label-
definition support and must meet both the 0.9 absolute and ten-point comparator
floors; the single factor result cannot be promoted.

Before any qualified inspection role is extended to bounded implementation, a
separate order must test the exact source-writing envelope, rollback and
independent checking. Before any role performs independent verification, a
separate order must demonstrate subject independence, adversarial finding
quality, immutable evidence and refusal to self-certify. Private inputs remain
blocked until an attributable no-egress boundary is established separately.
