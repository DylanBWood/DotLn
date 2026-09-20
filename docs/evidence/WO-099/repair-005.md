# WO-099 fifth repair — an ordinary build no longer holds the cadence, and the three documents state the rule the code has

**Source.** [VER-005](../../verifications/WO-099/VER-005.md) failed the fourth
repair on one defect, entirely inside that repair's own new code: the ignored
inventory fingerprinted a git directory-collapsed entry with `lstat`
kind/mode/size/mtime, and a collapsed root's own mtime moves whenever a direct
child is created, removed or renamed. `atomicBuild` creates and removes a
staging directory directly under `.runtime/` and `publishBuildTree` renames
`tsconfig.tsbuildinfo` into each `dist/` (`scripts/build.mjs:52,68`), so one
ordinary `npm run build` moved every build and runtime root off a pin fixed at
actor declaration (`packages/skeleton/src/cli-actor.ts:105`) and every later
pulse held: `drift` outside the declared surfaces, `unknown` inside them, with
neither a human answer nor a verified repair able to retire it. Product 03
§Operator-presence policy, repair-004's retained limits and D031's prose all
asserted the opposite property, which is criterion 4's write-back duty.
[D034](decisions.md#wo-099-d034) owns the repair and its regressions.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"unknown","source":"operator-attested"}

**Process cost:** 4,985,313 total tokens (86 input, 4,811,136 cached input,
126,304 cache-write input, 47,787 output) over 52 observed steps and 51 observed
commands; source `claude-transcript-message-usage`, scope `dispatch`, cutoff
2026-09-20T22:44:26.838Z. Reasoning-output tokens and dollar cost are unknown:
those counters are unavailable in this harness. The operator supplied the model;
no effective in-session effort readback exists here, so effort is recorded as
unknown rather than invented. No subagent was planned or launched against the
cap of 20: count 0, `exact-observed`, remaining 20, uncounted remainder unknown.
One `npm test` gate row was recorded: 261,213 ms at 2026-09-20T22:44:23.569Z,
exit 0, 65 fresh suites, code identity
`39dbb8e14691bbf8924ca22a11260f549f2c45010c58020f7349cabb8a894d62`.

## The finding

| Finding | Repair and executable evidence |
| --- | --- |
| F1 — one ordinary build held the supervisor permanently | The inventory now chooses its bounded `lstat` metadata by entry kind (`packages/skeleton/src/mission-check-source.ts`). A collapsed **directory** is fingerprinted by kind and mode alone, so build and runtime residue under it does not move it off the baseline; it still drifts when it appears, disappears, changes kind or changes mode. A **file**, symlink or other entry keeps kind, mode, size and mtime, so a baselined ignored file whose bytes move is still observed as work. Nothing else changed: no ignored contents are read, no capsule field was added, and the salted-id privacy boundary is untouched. Two regressions hold it, and both fail against the previous fingerprint. |

**Against the repository this supervises.** The verifier's own probe, repeated on
the repaired tree with the same pin, surfaces and base `47910753`:

```json
{"baselineIgnoredEntries":8,
 "quietPulse":{"ignoredEntries":0},
 "afterOrdinaryBuild":{"ignoredEntries":0,"outsideDeclaredSurfaces":0},
 "nextPulseWithNoFurtherWork":{"ignoredEntries":0,"outsideDeclaredSurfaces":0}}
```

VER-005 measured 5 changed entries after the build — four outside the declared
surfaces — and 5 again on the next pulse over no new work. The verdict that
probe still reports over a claimed pass is `drift`, from this worktree's real
out-of-surface tracked changes (`.claude/`, `.agents/`, `packages/console`,
`package-lock.json`), not from any ignored entry; that is the check working.

**The regressions.** `mission-check.fixture.ts` gained an `ignored` option that
writes ignore rules into the base commit and creates the excluded build and
runtime trees before the capsule is pinned — the arrangement D033 named as
missing, and the reason no earlier suite could reach this defect. On it:

- *Source leg.* A worktree with `.runtime/`, `dist/`, `local/` and `.env*`
  excluded, then the build's own two filesystem effects performed literally
  (a staging directory created and removed directly under `.runtime/`, a direct
  child renamed into `dist/`), with an assertion that the collapsed root's mtime
  really moved so the test cannot pass by missing the mechanism. Two consecutive
  pulses report zero ignored entries and `on-mission` over a claimed pass. A
  planted `.env.private` still drifts by opaque evidence with a
  `contract:surfaces` finding and no name in the subject; a rewritten baselined
  `.env` and a removed baselined `local/` still drift. The widened boundary is
  asserted where the suite can see it: a file added directly inside `.runtime/`
  after the pin yields no entry.
- *Resident leg.* A `missionOnly` Contributor-shaped policy, the operator away,
  an honest `on-mission` judge and an ordinary build during the supervised
  interval: two pulses raise no hold and record no `MissionDriftObserved`. This
  is the leg VER-005 demonstrated, where the false hold was cleared by a human
  answer and re-raised on the next pulse over no new work.
- *Negative control.* With only the built copy's rule reverted to
  kind/mode/size/mtime for every kind, both new regressions fail (16 tests, 14
  pass, 2 fail) and all fourteen prior mission regressions still pass, which
  independently confirms VER-005's claim that no existing fixture could reach
  the defect. The source was rebuilt from the repaired bytes afterwards.

## Write-backs

- **Product 03 §Operator-presence policy** now states the kind-dependent rule,
  why a collapsed directory cannot carry its mtime, and the boundary this buys:
  work added, removed or rewritten under a collapsed ignored root stays
  invisible. The previous text promised the baseline property the code did not
  have and disclosed only a nested same-metadata rewrite.
- **repair-004** carries a dated correction naming what its F1 row and retained
  limit claimed, what was meant, and what changed with the fix.
- **D031** carries the same correction beside its prose, and its reopen
  condition — a mutation that preserves the collapsed entry's metadata — is the
  one this repair acted on.
- **D034** records the chosen rule with its four rejected alternatives,
  including VER-005's other two named options and why each was not taken.

## Goal alignment and alternatives

The instrument exists so unattended work continues and stops only on real
drift. A supervisor that holds after every build stops all of it and floods the
one record 02 §Feedback says a returning human reads, which is *seeking the
wrong goal* and *drift to low performance* at once; leaving it while three
documents promise otherwise is the claim-without-evidence the Clean Room floor
forbids. NoOp was therefore not available. Naive Interventionism argues for the
smallest honest change, and this is smaller than the alternatives: no new
declared field (which an over-declaration would silently turn into a blind
spot), no re-pinning ritual (which would still hold once per pin and would adopt
real ignored work as the new baseline), no reading of ignored names or bytes
(which D031 refused and which ordinary builds would defeat anyway, since the
published file set changes whenever a source file is added). *Rule beating* is
answered by the negative control rather than by a green suite: the regressions
fail without the repair. *Escalation* is answered by repairing at the existing
join instead of adding a mechanism. The observed benefit is an instrument that
stays quiet across a build on the repository it supervises; no reduction in
operator effort or workflow tokens is measured or claimed.

## Executed evidence

| Check | Observed result |
| --- | --- |
| `npm test` | 21 passed, 0 failed, 65 fresh tasks, 261.21 s, exit 0; gate row 261,213 ms at 2026-09-20T22:44:23.569Z |
| `node --test packages/skeleton/dist/test/mission-check.test.js` | 16 passed, 0 failed, 5.89 s; [filed transcript](mission-fixtures-005.tap), including both new VER-005 regressions and all prior repairs |
| Negative control on the pre-repair rule | 16 tests, 14 passed, 2 failed — exactly the two new regressions |
| Real-repository probe (pin, quiet pulse, `npm run build`, two pulses) | 8 baseline entries; 0 ignored entries at every pulse, before and after the build |
| `git diff --check` and `git diff --cached --check` | Clean, exit 0 |
| `node scripts/harness.mjs emit` / `check` | 31 generated surfaces refreshed and matched; local-terms list unavailable |
| `node scripts/feedback-evidence.mjs --check` | Selected edition remains current: ten passing regressions, ten removal failures, 1,192 fewer instruction bytes |
| `node scripts/authority-evidence.mjs --check` | Two unchanged programs, four widening rejections, nine runtime denials, 34 bundle comparisons |
| `npm run publication:check` | Both voices current: 30 and 45 linked source sections match |
| `npm run release -- prepare --local` | `WO-099 target v0.37.0 remains current; no files changed` |
| `npm run meta` | Decisions index refreshed; no observed budget breach |

No new dependency was added and no runtime file outside
`mission-check-source.ts` changed, so the dependency comparison and both
evidence editions stand as VER-005 recorded them. `mission-check-source.ts` is
not a registered feedback or authority source
(`scripts/lib/evidence-sources.mjs`), and both editions verify unchanged against
the repaired tree, so no fresh live audit was required or run.

## Limits retained

- The collapsed-directory boundary is now wider, and this is the repair's
  price, stated rather than implied: any change under a baselined collapsed
  ignored root — an addition, a removal or a rewrite — is invisible to the
  check. Previously only a change that did not move the root's metadata was.
  D034's reopen condition names what would reverse it.
- The existing paid unattended row remains the order's one live model run.
  This repair used deterministic fixtures and scratch probes and claims no
  second paid observation. That row predates the fourth repair's capsule
  change, a limit VER-005 already recorded.
- [D027](decisions.md#wo-099-d027)'s deferred `verifier unavailable` wording
  remains disposed in adjacent queue revision 2; this repair changed no
  registered feedback source and did not reopen it. The queue has no running or
  next item.
