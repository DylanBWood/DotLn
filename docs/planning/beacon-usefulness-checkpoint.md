# Proposed beacon usefulness checkpoint after WO-021

**Status:** candidate comparison plan from the operator's 2026-09-04 WO-020
ideation. No trial has run. This is not an added acceptance criterion, release
gate, automated preference judgment, or change to the current work-order order.

WO-020 tests whether exact metadata encoding works. WO-021 puts the projection
into the real control-plane workflow. That is enough for an initial judgment
about Beacons as an operator surface; it is not a verdict on the complete
DotLn platform or the Protíno application.

## The decision

Does the beacon view help the operator understand current work with less
searching and fewer mistaken inferences than the status surfaces already
available? Is it interesting enough in actual use to retain and develop?
Treat feasibility, usefulness, and interest as separate findings.

## A bounded comparison

Use the same small set of worktrees for both views, including work in progress,
a refusal, a stale observation, an absent beacon, and a self-reported success
that differs from host evidence. These can be controlled fixtures; label them
as such and do not fabricate production incidents. Preserve the canonical
state against which each answer is checked.

First use `resume status` / `current.md` and the work-order index; then use
WO-021's constellation with its normal drill-down. Ask:

1. Which work is active and which needs attention?
2. What is the last evidenced result, and how old is the observation?
3. Which apparent success is only a worker claim?
4. Where do I look for the reason and the next legal action?

Record correct, incorrect, and unavailable answers; the files or commands
needed; and where the user must open deeper evidence. If elapsed time, bytes,
or filesystem operations are compared, state the measurement method, input
size, and host. Do not substitute codebook density for a demonstrated reading
benefit. No private prompt, token, cost, or attention telemetry is collected by
this plan.

## The result to keep

Keep one short receipt: what the mechanism proved; what the comparison showed;
the operator's own reaction; limits and unresolved cases; and a recommendation
to retain, simplify, or defer the feature. If the operator has not tried it,
interest and practical value stay unknown. A maintainer can recommend, but
cannot infer the operator's reaction from green tests.

Use that result to inform the next planning decision without treating it as
automatic authority to skip dependencies, launch workers, or change a release.
For the wider work-system thesis, repeat the value question over one coherent
real worker → independent verification → feedback loop as those rungs land.
For Protíno, use its separately planned playable slice rather than extrapolating
from file metadata.
