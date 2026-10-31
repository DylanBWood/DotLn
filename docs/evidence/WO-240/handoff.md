# WO-240 handoff

Attestation: Claude Code 2.1.316, `claude-opus-5-5`, effort `max` read from `CLAUDE_EFFORT` (selected, not effective). The order recommends `xhigh` for the executor; the session ran at the operator's `max`.

Code identity at handoff: `9acc6fd280ba357f29217218918d45b57160e56da41611a72ddaf4c1f778e419`. Both complete runs below are at this identity. Base: `main` at `984f7ca4`, which did not move, so no integration was owed.

## Criteria

**Criterion 1:** met. `engines.node` reads `^24.15.0 || ^26.0.0` in `package.json` and all six `packages/*/package.json`; `package-lock.json` carries it seven times and its diff is seven engines lines with no version, `resolved` or `integrity` line ([D002](decisions.md#wo-240-d002--declare-both-node-lines-and-read-the-range-without-a-dependency)). A test in `runner-fixtures` reads every package and lock entry.

**Criterion 2:** met. The `runner-fixtures` suite, which declares `scripts/structural-checks.mjs`, refuses `22.2.0`, `24.14.0`, `25.9.0`, `27.0.0` and `v24.15.0-rc.1` naming the range and the version, admits `24.15.0`, `24.22.2` and `26.9.0`, and refuses an unparsable string naming it ([D006](decisions.md#wo-240-d006--the-fixture-home-is-runner-fixtures-not-declarations-or-generated) corrects the suite the order named). The `host` row records its duration: 95, 98 and 111 ms before; 91 ms under 24.15.0 and 96 ms under 26.9.0 at this identity ([D014](decisions.md#wo-240-d014--the-host-checks-cost)). Real Node 22.2.0, 21.4.0 and 20.10.0 were each refused ([D003](decisions.md#wo-240-d003--outside-the-range-the-host-task-leads-because-it-is-otherwise-never-reached)).

**Criterion 3:** met. `docs/evidence/WO-240/node24-gate.json` records one complete `npm test -- --review` run under `v24.15.0` with exit code 0, 36 min 7 s, 112 fresh and 0 reused tasks, at the handoff identity. Fixes made for Node 24 are named with their suites and causes in [D011](decisions.md#wo-240-d011--what-the-first-node-24-run-found) and [D016](decisions.md#wo-240-d016--cores-document-gate-failed-on-node-24-where-the-complete-run-cannot-see-it). The search of step 2 and the changes it led to are in [D005](decisions.md#wo-240-d005--put-the-selected-runtime-first-on-every-gate-childs-path); the run had one `node` on PATH ([D010](decisions.md#wo-240-d010--a-recorded-run-forces-every-task-fresh-and-can-reach-one-node-only)).

**Criterion 4:** met. The `launchpad` suite's export case asserts the root range on the generated `package.json`, the lock root and every exported workspace manifest and lock entry, and passed under both lines.

**Criterion 5:** met. `README.md` names both lines; the earlier system was already gone from its founding lesson ([D007](decisions.md#wo-240-d007--the-founding-lesson-sentence-is-already-gone-so-step-5s-second-edit-is-a-noop)); the What runs today block and its line budget are unchanged. `scripts/kit/README.client.md` §First steps names the runtimes and carries the recipe ending in `node scripts/harness.mjs check` and naming the local-terms step, rehearsed under 24.15.0 ([D013](decisions.md#wo-240-d013--the-recipe-is-written-as-rehearsed-on-node-24150)). `npm run publication:check` is green.

**Criterion 6:** met. Editions followed their checks, with causes in [D008](decisions.md#wo-240-d008--run-the-owed-live-feedback-episode-against-the-orders-cost-line), [D009](decisions.md#wo-240-d009--remove-the-stale-off-ramps-registration) and [D015](decisions.md#wo-240-d015--editions-and-the-release); `npm run evidence:artifact -- --check` is green. The feedback edition is a live episode rather than the carry the order expected, and D008 says why.

**Criterion 7:** met. `npm test -- --review` passed under Node 26 at the handoff identity (`host-gate:9acc6fd280ba357f29217218918d45b57160e56da41611a72ddaf4c1f778e419:npm test`, 33 min 45 s, 112 fresh, 0 reused), `npm run test:docs` is run after this file, `git diff --check` is clean and no dependency was added.

## Where this departs from the order

- One live feedback episode ran, against the Cost line's none: `package-lock.json` and `packages/skeleton/package.json` are judged sources (D008).
- The recorded runs pass `--again` and remove other Nodes from PATH, because reuse compares code identity and never the runtime (D010).
- Outside the range the `host` task leads, because on Node 22.2.0 it was otherwise never reached (D003).
- `harness check` and `harness evidence` gained the comparison the ordered README sentence needs (D004). A target gate does not judge Node, so the sentence says so.
- `npm run test:docs` and `npm run test:machinery` also ran under 24.15.0, because a review found core's document gate red there (D016).
- `cd <name>` is added to the recipe, which cannot run without it (D013).

## Known limits

- Reuse crosses Node lines in core: `FUP-3457a1c859fb51d8`, beside the deferred `FUP-03c675456fa8e484`.
- On Node 24 the gate heartbeat cannot name a running test case: `FUP-23eb1282f814be14`.
- On Node 24 an event nested past about 6,100 levels cannot be appended; the `RangeError` comes before any write, and no real stream reaches it (D016).
- Bootstrap, sync, worktree finish, integration, measure-gates and harness evidence's own `npm test` find `npm` by name outside the gate (D005).
- An instance that kept an edited `package.json` is refused by name after an update until its range reads in the kit's form (D002).
- Only 24.15.0 ran on the 24 line, `gh repo create` was not exercised, and live worker episodes ran under Node 26 only.

## Reviews

self-review: found 29; fixed 28; recorded 1

Three `dotln-worker` agents reviewed before the recorded runs and rechecked every change until all three reported `found 0`: criteria adversary 8, 5, 0, 0, 0; design improver 9, 1, 1, 1, 0; consistency reviewer 4, 3, 2, 0, 0. [reviews.md](reviews.md) holds every finding and its disposition. The recorded item is the second half of A3 (D005).

Adjacent queue: empty, revision 0. `followups --touching` listed ten rows; the carried `FUP-4c704bb1ea210f14` is done by D009, the two minted rows above are this order's, `FUP-03c675456fa8e484` is cross-referenced in D010, and the other six only match a path.

## Usage

Dispatch standing at handoff: complete runs 3 of 20, within its bound. Subagents: 3 of 20, plus one live feedback verifier. Token counters are read at completion and reported in the session's result, with their source, scope and cutoff; cost is unknown.
