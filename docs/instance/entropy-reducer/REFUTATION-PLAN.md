# Entropy Reducer refutation plan v1

This plan governs the fresh Contra-Auguste episode that challenges an Entropy Reducer review. It is a verification plan, not permission to fix findings or promote suggestions. The episode uses Claude Code with Claude Fable 5.1 at `max`; its harness version, selected model, effort, and evidence source are recorded beside the run. A substitute is identified as a different reviewer.

## Blinding and inputs

The refuter receives no original reviewer narrative, observed-versus-expected conclusion, severity argument, proposal, or desired survival count. For each `measured` finding it receives only the typed `{ findingId, command }` subject produced by `selectFindingsForRefutation()`. For each selected `by inspection` finding it receives only `{ findingId, steps }`. Repository state and the command or steps are the evidence source; finding IDs exist only for attribution.

The subject repository, control plane, remotes, settings, and operator decisions remain read-only. Any perturbation runs in an isolated scratch copy. Every delegated or probe operation must be authorized separately while threading the returned resource envelope; a number inside an intent payload does not itself enforce a resource ceiling.

## Deterministic selection

Every `measured` finding is selected. When there are zero, the measured denominator is `not-applicable`, never a synthetic pass.

Every `by inspection` finding is selected when that denominator is six or fewer. Above six, the sample size is `max(6, ceil(denominator / 3))`. Findings are partitioned by exact surface and severity, each stratum is ordered by code-unit finding ID, strata are ordered by code-unit `surface + severity`, and selection proceeds round-robin across strata until the target is met. This makes selection independent of input order and avoids locale-dependent sorting. A zero inspection denominator is `not-applicable`.

## Attempts and disposition

Each selected subject produces exactly one attempt with `findingId`, `result` (`survived`, `refuted`, or `blocked`), a non-empty reason, and evidence references. The report joins the original reproduction back only after the blinded attempt. It states both denominators, selection status and rule, sample size, reproduction, result, and reason.

A `refuted` finding leaves the promoted finding set but remains in the immutable report with reviewer and refuter attribution. Only a selected finding whose attempt `survived` remains eligible for operator consideration. A `blocked` attempt stays in `blockedFindingIds`, and an unsampled inspection finding stays in `unselectedFindingIds`; neither is laundered into a pass or called refuted. There is no survival quota and no vote: an all-refuted run is a valid result, while zero selected findings yields explicit `not-applicable` denominators.

The typed `Program.All` node remains deferred in the current kernel. Therefore this plan is followed through an operator-mediated manual dispatch, and the host validator binds returned data before `report.emit`. That limitation must appear in the run receipt rather than being described as an automated workflow.
