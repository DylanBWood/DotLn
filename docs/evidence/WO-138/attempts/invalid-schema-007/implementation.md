inconclusive: WO-138 qualifies only T2's public-input discovery-candidate
ranking role for the local actor kind; T1 and T3 remain unqualified.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-5.6-sol","effort":"xhigh","source":"codex-session-readback"}

The [decision packet](decision-packet.md), [machine-readable result](results.json)
and 38 canonical [episode records](episodes/) carry the result. Thirty baseline
episodes cover three tasks, two transports and five repeats; five one-factor
cells and three unexpected-input cells complete the registered matrix. The
local subject is the pinned Qwen3.6 27B Q4_K_M artifact recorded by WO-137; the
remote comparator is `gpt-5.6-sol` through codex-cli 0.155.1. Runner inventory,
not the request's model field, establishes the local artifact identity.

T2 returned five schema-valid rankings, each at 0.828571 Spearman agreement
with the operator's held-out ordering. Its 12,167.709 ms median latency, 18.094
median tokens/s and zero in-episode interventions meet every registered floor.
T1 returned zero valid local abstractions in five repetitions. T3 returned five
valid classifications but its invariant 0.833333 agreement missed the 0.9
floor and trailed the remote median by 0.166667. The overall outcome is therefore
`inconclusive`, with T2 as the only catalog-qualified task.

The operator reported about 60 seconds for the six-item T2 ranking. The inputs
were deliberately ordinary synthetic repository findings; their opaque IDs
only bind the held-out ordering to the deterministic discovery producer. No
operator intervention occurred inside a model episode.

`scripts/probes/local-model-role-qualification.mjs` builds the source-backed
inputs, runs the fixed matrix, validates every result in host code, computes the
oracles and writes immutable episode files. Its tests cover the matrix, receipt
derivation, real seeded discovery output, held-out labels, validators, HTTP
wire shape, registered floors, canonical records and in-flight gate
cancellation. Importing the probe performs no inference.

The initial live setup exposed collector-only defects, retained under
`attempts/`: a physical temporary-path mismatch, one installed-CLI option
mismatch, server-status output on stderr, and loss of invalid reported output.
The collector was corrected without changing prompts, schemas, oracles, floors
or the cell plan. A later timestamp audit found that point preflights could not
prevent a newly starting product gate from overlapping an in-flight cell. The
first 38-cell set is therefore retained unscored as `gate-race-005`; continuous
gate monitoring was added and the 38 cells were recollected from an empty
directory under one build. Real overlaps during that replacement run were
aborted and left no episode file. I then formatted the probe after collection,
changing its byte hash and making those records stale against the final source.
That set is retained unscored as `postformat-stale-006`; the canonical 38 cells
were collected once more under the formatted source, with one matching hash.

Product 03 now records the dated, narrow T2 catalog role and explicitly keeps
T1, T3, private inputs, source writing and verification out. Product 06 records
the mixed candidate disposition and the next experiments. The planning ledger's
existing adopted WO-138 entry already carries the nomination and reopening
condition; execution does not append a second lifecycle entry. No package
source or dependency changed.

The focused and full gates, publication check, release preparation and final
handoff evidence are recorded by the executor after this report's cutoff. No
commit, push or publication occurs during execution.
