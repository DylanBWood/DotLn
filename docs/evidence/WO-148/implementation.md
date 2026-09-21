# WO-148 implementation — bind a resident to the active order

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}

The model is a session readback (`claude-opus-5[1m]`); Claude Code exposes no
effective effort readback, so the effort is the order's supplied value carried
forward rather than an observation. The single `--source` takes the weaker of
the two labels.

Dispatch: `resume: next`, 2026-09-21, recorded by the harness before this
procedure loaded. The canonical selection was active WO-148 in its matching
`wo-148` worktree — the sibling checkout `worktree start` created, whose
physical path this order's criterion 3 keeps out of every committed surface —
with one registered writer. No branch commit, push, PR, tag publication or
lifecycle repair was performed. Zero subagents were spawned against the cap
of 20.

`node scripts/resident-bind.mjs WO-NNN --surface <path>... --transport
<claude-cli-print|codex-cli-exec> --model <model> --effort <level> [--base
<commit>]` reads the canonical control state for the order in that order's own
worktree, locates the worktree through `git worktree list` by the branch the
order names, takes the base commit as the merge base with the `main` the
branch was created from, and writes
`<control lane>/local/resident/WO-NNN-<n>/`. The store holds the Contributor
build's graph and environment, the mission-only presence policy and one
`mission-check` actor whose `MissionSource` names that worktree, the order's
authority file as its contract, its decisions file when one exists, the vision
document and exactly the surfaces typed on the command line. Beside it,
`binding.json` records the order, phase, worktree, branch, base, contract
path and hash, surfaces, judge and the canonical control segment read.
`--check <store>` compares that record with canonical state, names every
mismatch and prints no launch line for a stale binding.

Application `v0.40.0` is staged under the declared minor classification, the
next minor above the observed local `v0.39.0` tag. No package `src` changed —
the only package edit is `packages/skeleton/README.md` — so compiler, kernel,
skeleton and console versions are unchanged and no third-party dependency
changed.

## Executed evidence

- **Fixtures, criteria 1, 2 and 3.** `node --test scripts/test-resident-bind.mjs`:
  10 tests, 0 failures, `duration_ms 3180.065041`. Each case builds a real Git
  launchpad on `main`, a linked worktree on `wo-999` carrying the activation
  event untracked, and uncommitted work inside the declared surface, then runs
  the real command as a child process.
  - Criterion 1: the written store decodes through `decodeResidentConfiguration`;
    its single `mission-check` actor's `MissionSource` is asserted field for
    field against the fixture's worktree root, authority path, decisions path,
    merge-base commit, declared surfaces, decision window and vision path;
    `missionPinFromSource` over that source equals `missionPin` of the pinned
    subject, compared whole except for the per-pin random salt and the ids it
    keys, which are asserted as shapes; the shipped `dotln status --store` and
    `dotln resident --store <store> --policy contributor.mission-check --once`
    both exit 0, the log gains `ResidentConfigured`, and nothing dispatches
    while the operator is present; and every printed launch, presence, status,
    export and recheck line is asserted to name that store.
  - Criterion 2: an unknown order, a closed order, a missing worktree, a bind
    with no surface, an unknown transport and a non-repository-relative
    surface each refuse with the cause named; `--check` against an edited
    contract, a closed order, a moved worktree and a pruned worktree each
    report the mismatch, exit 1 and print no launch or `DOTLN_RESIDENT_STORE`
    line; a rebind writes `WO-999-2` while every byte and the mtime of
    `WO-999-1` are unchanged.
  - Criterion 3: after a bind, `git status --porcelain --untracked-files=all`
    in the fixture launchpad is empty and `git check-ignore` matches both
    `resident.json` and `binding.json`; `binding.json` is mode 0600.
- **Release, criterion 6 in part.** `node scripts/release.mjs check-surfaces --local`
  exit 0: `PASS release-block: observed v0.40.0; expected v0.40.0 (work-order
  target v0.40.0; latest local tag v0.39.0)` and all four component versions
  `no bump required`. `npm run release -- prepare --local`: `WO-148 target
  v0.40.0 remains current; no files changed.`
- **Publication, criterion 5.** `node scripts/check-publication.mjs` exit 0
  after refreshing both edition source locks that the product 03 write-back
  invalidated: `CURRENT everyday-ai-user-toc.md: 30 linked source sections
  match`, `CURRENT software-engineer-toc.md: 45 linked source sections match`.
- **Decision index.** `node scripts/meta.mjs --check` exit 0 over the eleven
  decisions recorded in [decisions.md](decisions.md).
- **Gate, criterion 6.** `npm test`: **23 passed, 0 failed, 336.39 s, 67 fresh
  tasks**, including the new `resident-bind` suite. `git diff --check` clean.
  `npm run format:check` clean. No dependency changed: `package.json` and both
  lockfile-governed package manifests are untouched.

## What the order said and what the code says

Three of the order's own statements did not survive contact with the source,
and each is recorded as a correction rather than quietly worked around.

- The objective describes "the vision path and thesis headings the Contributor
  build's mission policy uses". `CONTRIBUTOR_MISSION_POLICY` declares neither,
  and no `MissionSource` at all; the only ones in the repository are the
  mission fixture's. The command declares them (D003).
- The same store could not have dispatched at all as described: the saved
  Contributor environment declares `capabilities: []`, so the compiled phase
  is the `NoOp` product 03 already documents, checked before the host's own
  runtime capability list. The store's environment adds `actor.cli-worker`
  and nothing else (D003).
- The cost section estimates "a binding record of a few hundred bytes". The
  measured record for WO-148 is 1,494 bytes, and `resident.json` beside it is
  290,006 bytes, which is the larger cost the estimate did not name (D002).

## The live row, criterion 4

`node scripts/evidence-resident-binding.mjs --work-order WO-148 --transport
codex-cli-exec --model gpt-6-astra --effort xhigh --surface <15 paths>`, run
from a detached child with no terminal:
[live.json](live.json), label `observed`, 981,173 ms. The collector binds the
order, runs the shipped `dotln presence away --store <store>`, waits the 900 s
Contributor cadence out on the real clock, and then runs
`dotln resident --store <store> --policy contributor.mission-check --once`,
which dispatched on its first attempt (`onceRuns: [{ attempt: 1, exitCode: 0 }]`).
No clock is injected and no host is driven in process.

What the row records: an actor-origin launch of the real Codex CLI 0.155.1 on
profile `mission-check-v1`, the operator away before and after, the capsule's
root equal to the bound worktree and its contract equal to this order, 20
changed paths all inside the 15 declared surfaces with 0 omitted and 0 changed
ignored entries, and the base commit matching the binding. The verdict is
`drift`; a hold was raised and one `MissionDriftObserved` correction recorded.
Criterion 4 admits that: the row proves aim, not the work.

Both of the judge's findings were acted on rather than filed and forgotten.

- `contract:criterion:3` against `docs/evidence/WO-148/implementation.md`: this
  report carried one unredacted absolute operator worktree path. It is a real
  breach of criterion 3 and it is fixed above — the sentence now names the
  worktree without its physical path. The repository's earlier reports carry
  the same shape; this order's criterion is stricter, and only this order's
  own files were changed (D011).
- `contract:criterion:4` against `docs/evidence/WO-148/live.json`: the judge
  read the *previous* row, which described the superseded in-process collector
  with advanced policy time. A row is written only after its own pulse
  returns, so the capsule a pulse observes can never contain the row that
  pulse produces. The filed row states that limit, and the collector that
  produced it no longer advances a clock; re-running to chase this finding
  would only present the next judge with this row instead.

An earlier pass of the same collector, superseded by the one above, observed
19 changed paths under the same binding and returned `drift` naming
`contract:criterion:4` and `exclusion:what-dotln-is-not:6`. Those two findings
are what produced D010's correction: the collector now runs the shipped
`--once`, and a row is labelled `observed` only when a judgment came back.

## Adjacent work

- **Repaired (queue item `adjacent-0001`, completed).** The README release
  block still told readers the Tinkerer economy support "stays off by default
  while the three-order trial establishes whether its savings justify its
  cost". WO-150 made that false and its write-backs never reached the README.
  One sentence was corrected inside the same block this order already edits
  for the release version; `release check-surfaces --local` and
  `check-publication` both pass (D008).
- **Deferred (queue item `adjacent-0002`, deferred).** No `claude-cli-print`
  mission check can run: `missionReferenceIds` concatenates the pinned and
  observed contract clause ids, which are identical whenever the contract has
  not changed mid-episode, so `missionCheckResultSchema` emits an enum with
  every id twice and the Claude CLI refuses it — `--json-schema is not a valid
  JSON Schema: ... enum must NOT have duplicate items (items ## 9 and 19 are
  identical)` — exiting 1 with no stdout after 1.28 s. A negative control with
  the same binary, model, effort and every other flag but no `--json-schema`
  succeeds, so it is the schema and not the CLI, model, effort or
  authentication. The repair edits the shared mission-check result schema,
  which this order's classification excludes; it is recorded with its exact
  cause and reproduction in D009 and nominated for a separate order.

The queue is empty at handoff: `npm run adjacent -- list` shows
`adjacent-0001` completed and `adjacent-0002` deferred, with `next: null`.

## Handoff advisories

`npm run resume -- implementation-ready` recorded `WO-148 is ready for
verification` and raised two advisories. Neither blocks the transition; both
are stated here rather than left in terminal scrollback.

- **The deferred queue item's target is prose, not a follow-up identifier.**
  `adjacent-0002` was disposed as `deferred` before `npm run meta` had
  synthesized a public identifier for WO-148-D009's `followup`, so its
  `target` names the intended order in words. The public identifier now
  exists — `FUP-e2877e300cc8813a`, keyed to
  `docs/evidence/WO-148/decisions.md#wo-148-d009` — and D009 is the public
  record of the defect, its cause, its reproduction and its reopening
  condition. Only the queue field is wrong, and the queue refuses mutation
  outside the executor and fixer phases, so it was not rewritten after the
  transition. The ordering — dispose, then sync, then link — is the lesson;
  the follow-up itself is not lost.
- **Output reads.** The transition listed twelve authored outputs as not yet
  read at their current bytes, because this session composed and verified them
  through shell reads rather than the host's own read path. Each was read at
  its final bytes immediately after the transition.

## Economy experiment

D007, run and adopted: the fixtures use a minimal synthetic launchpad rather
than a copied `docs/` tree. Copying `docs/` once measured `real 1.46` for
154 MB across 2,368 files; the delivered suite builds ten minimal launchpads,
does its own `git init`, commit and `worktree add`, runs the real bind, and
finishes in 3.18 s in total. The copy alternative would have added about
14.6 s and about 1.5 GB of temporary writes per suite run. Measured cost of
the experiment itself: 214 s of a 900 s budget; token cost null, because the
only counter available is cumulative and dispatch-scoped.
