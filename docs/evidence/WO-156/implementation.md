# WO-156 implementation — plan subject path pattern

Dispatch: `resume: next`, 2026-09-24. Actor attestation: Codex CLI 0.156.1,
`gpt-6-sol`, effort `xhigh`, source `codex-session-readback`.

## Delivered

`scripts/lib/plan-subject.mjs` now resolves the configured work-order root
once per subject call and creates each sequence-id expression outside the
committed-path filter. `scripts/lib/config.mjs` and all Git reads are unchanged.
The new `scripts/test-plan-refutation.mjs` case commits a two-order sequence
with 256 unrelated paths, counts `statSync`, and pins the fixture subject JSON
hash. The red check against the original builder made 543 calls and failed its
below-100 bound; the edited builder made 10 calls and passed with the same JSON
hash `sha256:85f125dae6144d26d6f714021665654645a8a5c985292f04083a135be42f87ef`.

On the same assigned worktree, `plan subject` stdout before and after hashes
to `2eccf9e2858f85b24c658ed3d826eca29716b8b893e3ce1baf9978868051a9ed`;
`plan check` stdout hashes to
`b11acd1eff3152523eaed0ef113c8223ddb8c98e31d53a627305fe60ce4476e8`
on both runs. Scratch transcripts include the four compared stdout files and
the red and green regression output; the measured figures are in
[decisions.md](decisions.md).

## Timing on this host

| Check | Before | After |
| --- | ---: | ---: |
| `node scripts/refute-plan.mjs check` wall time | 17.86 s | 2.85 s |
| `test:docs` `plan` task | 25.27 s | 3.25 s |
| `test:docs` `plan-refutation-current` task | 25.20 s | 3.19 s |
| Complete `test:docs` wall time | 30.80 s | 24.41 s |

Both `test:docs` runs passed 21 tasks. The overall gate runs tasks concurrently,
so its wall-time reduction is smaller than the two task reductions. The order's
under-2-second target remains unmet. A single post-change CPU profile sampled
synchronous Git spawning in 1,079 of 2,479 samples; WO-156-D003 files the
remaining cost as `FUP-3dc0266d6b87b939` for a separate scope.

## Release and evidence

Application `v0.46.1` is the assigned patch over the observed local `v0.46.0`
tag. The work-order heading, README release claim, and roadmap release boundary
name it; `npm run release -- prepare --local` found the target current. No
component source or dependency changed, so component versions stay fixed.
The product 07 cold-gate candidate records the local after figure, and both
publication edition source locks have been refreshed and checked.

The regression adds one case to the existing plan-refutation suite and no new
test-runner task. The document gate remains 21 fresh tasks; its before and
after runs both passed. The final `npm run test:docs` passed 21 tasks, 0
failures, in 25.36 s. The complete plan-refutation fixture suite passed 62
cases, 0 failures, in 32.24 s. `npm test` passed 27 suites, 0 failures, in
293.03 s with 71 fresh tasks. `git diff --check` is clean. The remaining
under-2-second target is recorded explicitly above and in WO-156-D003.
