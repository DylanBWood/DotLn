# WO-226 execution evidence

## Baseline, 2026-10-22

Dispatch: `resume: next`. The selected order is WO-226 at base
`55699291a324265da49667dc90d5809d50f1fbfc`. Before changing
implementation, two synthetic probes ran under `node scripts/harness.mjs
bounded -- node --test`: `baseline-harness.mjs` and `baseline-export.mjs`
in the session scratch directory. Both passed their baseline assertions.
The probes reused the current `scripts/test-harness.mjs` fixture setup and
`scripts/lib/launchpad-fixture.mjs`; no instance or employer data was read.

- An exported kit with canonical closed WO-999 and its ignored selected
  snapshot removed returned `Release-close preparation withheld: runtime
  preparation failed at npm run build --silent: ENOENT` for `tsconfig.json`
  from `.claude/hooks/session.mjs` on `resume: release close`.
- `npm run harness -- check` in that export exited 1 on the same missing
  `tsconfig.json`.
- `refreshHarnessRuntime` with the callback used by `worktree finish`
  printed `Refreshing pinned runtime (snapshot-missing); npm run build.`
  and the callback failed with `Pinned runtime build failed; worktree
  preserved; run node scripts/bootstrap.mjs`. This base probe exercised
  finish's preparation function, not the whole teardown command.
- `node scripts/lib/release-kit-runtime.mjs` in the same export exited 0,
  verified 981 kit files and restored the snapshot in 501.788 ms. This
  single fixture measurement is not a host-wide latency claim.
- The registered-target fixture first admitted its plain helper. Adding
  only `repositories.target.gate` to the worktree configuration then
  returned no permission decision. Source inspection identifies the
  whole-file comparison in `registeredTargetAdmission` as the withholding
  path. A piped helper produced ordinary effect/timing rows and no
  registered-target admission or advisory row.
- A prompt with a blank line, an opening text fence and `planning:` on
  the following line recorded `prefix: null`, `class: unclassified` and
  `role: unknown`.

The export probe constructed the missing-snapshot state directly; the
passing regression fixture also performs the update fast-forward and changes
the hook pin before observing the absent snapshot.
The first export probe failed in setup because it tried to recreate links
the export already installs; removing that redundant setup produced the
passing observation above. A command-path typo also failed before execution.

## Source corrections

The order names `packages/skeleton/test/harness-host.test.ts`, which does
not exist at the base. Its admission and prompt cases are in
`scripts/test-harness.mjs`; those existing fixtures are the test home.
At the base, the fallback hook advisory already named bootstrap. Its recovery
loop still attempted the source build, as the baseline probe showed.

## Validation

`npm test -- --review` passed at 2026-10-22T04:47:12.952Z in 1,581,147 ms:
41 suites, 106 fresh tasks, zero reused tasks and zero unrun suites. Its
code identity was
`3054312198bbe46571a9bac7da6441678812d40879c25eec468fb5f16cff3241`,
unchanged through the run. The canonical evidence wait returned exit 0.

[controls.json](controls.json) records the paired controls of steps 3, 5,
7, 8 and 10, their source cases and the passing gate. The
[handoff](handoff.md) judges all eight criteria. Its final document claim
is consumed only after `npm run test:docs` passes at the completed report
bytes; readiness refuses a stale or absent row.

The [independent reviews](self-review.md) found two issues, both fixed;
their repair reviews reported zero outstanding findings. Complete-gate
repairs and their causes are recorded in decisions D017 through D020.
The focused reproductions passed the instruction-cost regression, both
export planning/update flows and the entire export recovery/finish case;
the complete row above is the acceptance evidence.

Regeneration and publication checks passed. Authority is WO-226/003;
artifact-identity, verification and feedback are WO-226/001. No dependency
was added. The measured instruction cost and its registered optimization
follow-up are in [role-costs.json](role-costs.json) and decision D018.
