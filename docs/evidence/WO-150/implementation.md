# WO-150 implementation — the Tinkerer economy support on by default

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}

The model is a session readback (`claude-opus-5[1m]`); Claude Code exposes no
effective effort readback, so the effort is the order's supplied value carried
forward rather than an observation. The single `--source` takes the weaker of
the two labels.

Dispatch: `resume: next`, 2026-09-21, recorded by the harness before this
procedure loaded. The canonical selection was active WO-150 in its matching
`wo-150` worktree at `/Users/dylanwood/Projects/DotLn-wo150`, one registered
writer. No branch commit, push, PR, tag publication or lifecycle repair was
performed. Zero subagents were spawned against the cap of 20.

`tinkerer-economy` is now default equipment for the executor role.
`executorSupportDefaults["tinkerer-economy"]` is `true`, `defaultExecutorSupportIds`
carries six ids, and an order removes it with `{ "tinkerer-economy": false }`.
The support's paragraph, the switch mechanism, the decline-with-reason path and
every other role are unchanged. The dispatch briefing gained the matching
`Tinkerer — Economy is equipped:` line, which was the one piece of the objective
the default flip alone did not deliver (D007).

Application `v0.39.0` is staged under the declared minor classification, the next
minor above the observed local `v0.38.1` tag; skeleton advances to `0.34.0` with
the console's exact pin. Compiler, kernel and console versions are unchanged, and
no third-party dependency changed.

## Executed evidence

- **Cold start, criterion 2.** Both generated skill roots, every role, against
  `docs/control/budgets.json`: executor 23,154 → **24,327** bytes of a 24,576
  ceiling, **within** by 249; verifier 21,061/25,151, reviewer 22,458/24,576,
  release-close 13,967/16,384, planner 15,033/24,576, refuter 15,690/unset, all
  unchanged by this order. Installed `CLAUDE.md` stays at 6,113 bytes. No
  ceiling moved and no dated acceptance was recorded, because nothing breached
  one. Per-role figures: [cold-start.json](cold-start.json).
- **Equipment, criterion 1.** `contributorConfiguredProgram({})` equips the
  support and `{ "tinkerer-economy": false }` removes it with every other
  support's presence identical on both sides; `executorSupportIds({ "tinkerer-economy": false })`
  equals the defaults minus that id; the authority envelope, work order,
  non-procedure facets and all five other roles are deep-equal across the
  switch. The `.claude` and `.agents` projections of every role are
  byte-identical.
- **Re-baseline, criterion 3.** The opt-out reproduces all twelve
  previous-default role files byte for byte, Origin comment included, so
  `wo079-role-baseline.json` serves unchanged as the opt-out oracle while the
  new `wo150-role-baseline.json` holds this release's default-on bytes. The
  v0.33.2 release snapshot in `wo145-role-baseline.json` is untouched and still
  checked against Git history, and the case now walks the whole fixture chain,
  asserting each recorded `historicalSha256`. Default-on differs from the
  opt-out by the executor's 1,173 bytes and, in the other five roles, by the
  Origin comment alone — WO-145 D003's distinction, now asserted in both
  directions.
- **Gate, criterion 5.** `npm test`: **22 passed, 0 failed, 272.81 s**, 66 fresh
  tasks. `git diff --check` clean. `npm run format:check` clean.
  `node scripts/harness.mjs check`: 31 generated surfaces.
- **Release surfaces.** `npm run release -- check-surfaces --local`: all PASS,
  including `component-version @dotln/skeleton: src changed; observed 0.34.0`
  and all five workspace pins. `npm run release -- prepare --local`:
  `WO-150 target v0.39.0 remains current; no files changed.`
- **Publication.** `npm run publication:check` after the product 05 write-back:
  273/273 headings indexed, both editions current once their source locks were
  refreshed.
- **Evidence editions.** `executor-supports.ts` is a registered source of the
  authority and feedback editions, so both were re-minted as WO-150 revision 001
  and selected in `docs/evidence/current.json`. The feedback edition carries a
  live read-only `claude-cli-print` self-host audit: phase complete, ten passing
  regressions, ten removal failures, 1,192 saved instruction bytes, 244 s, and
  a recorded verifier usage observation of 588,789 tokens and USD 1.503.
  Artifact-identity and verification editions stay at WO-146 and pass unchanged.
  Console self-host, control, refutation and missing fixtures all match.

## Cost of the change, as measured

The support adds 1,173 bytes to every executor dispatch that does not opt out
(1,154 of instruction text and 19 in the support origin id, matching WO-145
D003's measurement at a different release) and permits at most one experiment
per order inside 900 s, declinable with a reason. Because
`defaultExecutorSupportIds` grew from five ids to six, the WO-042 power-set
loops in `executor-supports.test.ts` doubled from 32 to 64 combinations and the
file's runtime rose from 1.43 s to 2.76 s. That recurring cost is recorded in
D002 rather than avoided by narrowing an existing composition check.

This dispatch was itself unequipped — the flip takes effect for dispatches after
merge — so it ran no economy experiment and records none. The first order
dispatched under the default, recording an experiment or a kept-current decline,
is the reopening observation; D005 states it as ten such dispatches.

## Limits

The fixtures prove configuration, not behavior: they establish that the support
is equipped, opt-out-able and isolated to the executor, not that any executor
will find an economy worth testing. No per-order saving is claimed, because no
trial counted its iterations. The token side of the pre-registered reading
remains uncomparable: one of three trials recorded a token count, and that count
is a broad-scope transcript counter, not a causal allocation.

## Follow-up queue

Revision 0, empty at entry and at handoff. The one defect diagnosed during this
dispatch — the missing briefing branch — was inside the order's objective and was
repaired here rather than queued (D007). No item was deferred.
