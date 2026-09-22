# WO-152 implementation — mission-check schema without duplicate ids

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}

The model is a session readback (`claude-opus-5[1m]`); Claude Code exposes no
effective effort readback, so the effort is the dispatch's supplied value
(`executor xhigh+`) carried forward rather than an observation. The single
`--source` takes the weaker of the two labels.

The harness version is `2.1.278`, observed twice: `claude --version` on this
machine, and the transport's own readback in the live row, which recorded
`harnessVersion: 2.1.278` for the CLI it launched. `.claude/harness-manifest.json`
still records `observedVersion: 2.1.263` for the registered profile, which is
the value captured when the profile was registered rather than the version
running now. The attested value is the observed one; the discrepancy is named
here rather than carried silently.

Dispatch: `resume: next`, 2026-09-22, recorded by the harness before this
procedure loaded. The canonical selection was active WO-152 in its matching
`wo-152` worktree, with one registered writer. No branch commit, push, PR, tag
publication or lifecycle repair was performed. Zero subagents were spawned
against the cap of 20.

Application `v0.41.1` is staged under the declared patch classification, the
next patch above the observed local `v0.41.0` tag, and `@dotln/skeleton` moves
from 0.35.0 to 0.35.1 with the console's exact pin and both lockfile locations
following. Compiler, kernel and console versions are unchanged and no
third-party dependency changed.

## What changed

`missionReferenceIds` built the `contract-clause` list by concatenating the
pinned contract's clause ids, the story contract's and the observed contract's.
Those lists are identical whenever the contract has not changed mid-episode,
which is the ordinary case, and `missionCheckResultSchema` spreads the result
straight into the emitted `reference` enum — so every clause id appeared twice
and the Claude CLI refused the whole schema before any model call. The three
lists are now collected through a `Set` and spread back, which is first-seen
order: the pinned ids first, the story contract's next, the observed contract's
last, each exactly once. A contract edited mid-episode still contributes its new
ids, because the union is what `structuralMissionFindings` needs to reference.
The `thesis` and `exclusion` branches and `validateMissionCheckResult` are
untouched.

## Executed evidence

- **Reproduction, before any edit.** Against the repository's own mission
  fixture: `missionReferenceIds(subject, 'contract-clause')` returned 12 ids
  for a 6-clause contract, every id twice;
  `$.properties.findings.items.anyOf[0].properties.reference.enum` carried 12
  items with all 6 duplicated; the `thesis` (1), `exclusion` (2), `evidence`
  (3) and `verdict` (3) enums were already clean. This is WO-148 D009's defect
  at this order's fixture scale — D009 observed it at 20 items against a real
  store.
- **Criteria 1 and 2.** `node --test packages/skeleton/dist/test/mission-check.test.js`:
  **17 passed, 0 failed**, `duration_ms 6016.698667`. The new step is
  `WO-152 the emitted schema carries no duplicate enum item, and a mid-episode
  clause change still names the old and the new id` at **117.441541 ms**,
  reporting `no duplicate item across 7 emitted enums, unchanged and renumbered
  contracts`.
- **Negative control, criterion 2.** With the `new Set` removed and the
  workspace rebuilt, the new test fails: `actual` carries all six clause ids
  twice against the six expected, at
  `packages/skeleton/dist/test/mission-check.test.js:1133`. The deduplication
  was restored, the workspace rebuilt and the test passes again. Nothing else
  in the file was touched for the control.
- **The real subject, not only the fixture.** The emitted schema for this
  worktree's own bound capsule — 9 contract clauses, 4 theses, 7 exclusions,
  13 evidence ids and, at that moment, 12 changed paths — carries **no
  duplicate item in any of its 7 enums**. This is what the live row then handed
  to the CLI. The capsule the pulse actually judged carried 14 changed paths,
  because this order's own reports were written between the two observations;
  the enum shape is what the check establishes, and it does not vary with the
  path count.
- **Release, criterion 4 in part.** `node scripts/release.mjs check-surfaces --local`
  failed twice before the bump (`release-block: observed v0.41.0; expected
  exactly one v0.41.1` and `component-version @dotln/skeleton: src changed;
  observed 0.35.0 ... expected a different version`) and passes on all ten
  release rows after it. `npm run release -- prepare --local`: `WO-152 target
  v0.41.1 remains current; no files changed.`

## The live row, criterion 3

`node scripts/evidence-resident-binding.mjs --work-order WO-152 --transport
claude-cli-print --model claude-haiku-4-5-20251001 --effort xhigh --surface <7
paths>`, run from a detached child with no terminal:
[live.json](live.json), label `observed`, 962,261 ms. The collector binds the
order, runs the shipped `dotln presence away --store <store>`, waits the 900 s
Contributor cadence out on the real clock, and then runs `dotln resident
--store <store> --policy contributor.mission-check --once`, which dispatched on
its first attempt (`onceRuns: [{ attempt: 1, exitCode: 0 }]`).

**The criterion this order exists for is met.** An actor-origin launch of the
real Claude CLI 2.1.278 on profile `mission-check-v1`, transport
`claude-cli-print`, model `claude-haiku-4-5-20251001`, effort `xhigh`, returned
a judgment: `verdict: drift`, `failure: null`, `blockedReason: null`. Before
this order's deduplication the identical path exited 1 with no stdout after
1.28 s, rejected at `--json-schema` before any model call (WO-148 D009). The
CLI now accepts the emitted schema. That is the whole objective, and the
verdict's content is a separate observation.

The operator was away before and after, the capsule's root equals the bound
worktree and its contract equals this order, the base commit matches the
binding, and 14 changed paths were carried with 0 omitted and 0 changed ignored
entries. `decisionsDeclared` is `false`: the bind ran at 12:43:02Z, about a
minute before this order's decisions file existed, so the capsule judged the
diff with no decision history.

Episode wall-clock is **bounded, not exact**: the store records clock samples,
not per-episode timestamps. The dispatching pulse sampled at epoch
1790081897497 and the pulse recording the judgment sampled at 1790081944271,
which bounds the CLI episode at **46.8 s**, with one intermediate sample at
1790081927509. No narrower figure is recorded, so none is claimed.

### The judge's three findings

One is host-derived and two are the model's. All three are read here rather
than filed and forgotten.

- `contract:surfaces` against `docs/final-reviews/WO-152/PR.md` — **host-derived,
  and an artifact of the surface list, not drift in the work.** `release prepare
  --local` generates that file, and it is not under any of the seven surfaces
  typed on the bind command. The surfaces are pinned when the store is bound,
  so this could only have been avoided by declaring `docs/final-reviews` up
  front. It is named here so the row's single out-of-surface path is not read
  as a real finding.
- `contract:criterion:3` against `docs/evidence/WO-152/implementation.md` — the
  judge read the `<!-- WO-152-LIVE-ROW -->` placeholder that stood here and
  correctly observed that no live result was recorded. This is the structural
  limit WO-148's own row hit: a row is written only after its own pulse
  returns, so the capsule a pulse observes can never contain the row that pulse
  produces. The finding is **acted on rather than argued with** — this section
  is what replaced the placeholder. Re-running to chase it would only present
  the next judge with the same shape one revision later.
- `contract:criterion:4` against `docs/evidence/WO-152/decisions.md` — the judge
  read WO-152-D004 and reported that declining the edition re-mint "violates
  the stated criterion requirement, though the deviation is documented". **That
  reading is correct and it is not overridden here.** An independent judge
  reaching the same conclusion from the contract alone is corroboration that
  the deviation is real, material and visible. It is not repaired by minting an
  edition on a model's say-so: the measured evidence in D004 is that neither
  edition is stale, and whether a required criterion may go unmet on that
  evidence is the operator's judgment, not this executor's and not the judge's.
  It is surfaced in the handoff for exactly that reason.

## Editions: a recorded deviation from criterion 4

Criterion 4 requires the authority and feedback editions to be "re-minted with
one live self-host episode and the reason each changed". **Neither edition is
stale, so neither was re-minted and no live self-host episode was run.** This
is a deviation from a required criterion and is the operator's to judge; the
full record is WO-152-D004.

The order's Cost line derives that duty from WO-147 D010: `packages/skeleton/package.json`
is a registered evidence source, so a diff touching it carries a live feedback
episode. The premise does not hold for a version-only edit.

- Of the 17 paths this order changes, exactly two are registered in
  `scripts/lib/evidence-sources.mjs` — `package-lock.json` and
  `packages/skeleton/package.json`, both through `commonSources`. The three
  files carrying this order's behavior change
  (`packages/skeleton/src/mission-check-protocol.ts` and the two test files)
  are in no edition's source list.
- `packages/skeleton/src/evidence-editions.mjs` lines 89-106: `projectPackage`
  rewrites a semver `version` field and every `@dotln/*` pin to
  `<component release>` for `package.json`, each component manifest and both
  lockfile locations, under the comment "Component release labels are not the
  behavior recorded by an evidence edition". The carve-out exists for exactly
  this case.
- Measured: running `evidenceSourceContent` over `HEAD` and the working tree
  gives `package-lock.json: raw CHANGED; normalized same
  (9a5a795ab3cd82a6 vs 9a5a795ab3cd82a6)` and
  `packages/skeleton/package.json: raw CHANGED; normalized same
  (810dcc7e05e3b129 vs 810dcc7e05e3b129)`.
- Executed before any edit and again after the bump and a rebuild:
  `node scripts/authority-evidence.mjs --check` exit 0 and
  `node scripts/feedback-evidence.mjs --check` exit 0, the latter printing
  "Retained immutable live feedback audit: behavior source is unchanged apart
  from component release labels."
- WO-147 differed because it changed `packages/skeleton/src/worker-store.ts`, a
  behavior source with no carve-out; its own record says the regenerated
  feedback edition differed "in exactly one field, the subject hash".

Re-minting anyway would have spent a paid live episode — WO-147's ran 320.6 s —
to file a feedback record differing from the retained one only in the component
release label the tooling deliberately ignores. `docs/evidence/WO-148/decisions.md`
was not edited. The rest of criterion 4 is met: the skeleton component version
moves, and this order's decisions file records the sources and the reopening
condition for every choice.

## Adjacent work

- **Deferred (queue item `adjacent-0001`, deferred to planning).** WO-147
  D010's follow-up states the registered-source duty too broadly: it asks for a
  live feedback self-host episode whenever an order edits any registered
  evidence source, but the release-label carve-out means a version-only bump of
  a registered manifest can never make an edition stale. The concrete wording
  fix edits a planning surface carrying another order's register row, and
  disposition of a register row is a planning act, so the item is boarded with
  its cause, fix, paths, checks and priority rather than applied here
  (WO-152-D004).

## Economy experiment

One experiment, within the 900 s budget: whether the regression should build
its own mission fixture or fold into a test that has already paid for one.
Measured mean 91.9 ms to construct a fixture, 29.1 ms to re-observe after a
contract edit, 7.0 ms to dispose; the delivered standalone step measures
117.4 ms against a 6.0 s suite. Outcome `kept-current` — the standalone test is
kept and the ~92 ms saving declined, because folding would make the renumbering
assertions order-dependent on an existing test's own mid-test contract edit.
Recorded as WO-152-D003.

## Gate, criterion 5

`npm test`: **25 passed, 0 failed, 278.44 s, 69 fresh tasks** (gate row
278,445 ms). `git diff --check` clean. `npm run format:check` clean. No new
dependency: the only `package.json` edits are the component release label and
the console's exact pin, and `package.json` at the root is unchanged.

**The fixture's effect on the gate step count.** The regression adds exactly
one `test()` call to an existing file, so the `mission-check` file moves from
16 to 17 steps inside the existing `skeleton` suite. It creates **no new suite
and no new fresh gate task**; the 25 suites and 69 fresh tasks are unchanged by
this order. Measured cost: 117.4 ms when first delivered and 127.2 ms after
formatting, against a `skeleton` suite of 275.80 s and a gate of 278.44 s —
about 0.05% of the gate. The fixture construction behind that number is
measured in WO-152-D003.

Also executed, all exit 0: `node scripts/release.mjs check-surfaces --local`
(44 PASS rows, no FAIL), `npm run release -- prepare --local`,
`node scripts/authority-evidence.mjs --check`,
`node scripts/feedback-evidence.mjs --check`, `node scripts/meta.mjs --check`
and `node scripts/check-publication.mjs`.

## Limits

- The live row's episode wall-clock is bounded at 46.8 s by the store's clock
  samples, not measured per episode; no counter exposes the episode's tokens or
  cost, so both are unknown.
- The row's judge is `claude-haiku-4-5-20251001`; a different model may return
  a different verdict over the same capsule. The criterion asks for a returned
  verdict with its readback, which is what is filed.
- `decisionsDeclared` is `false` for this capsule: the bind preceded this
  order's decisions file, so the judge saw no decision history.
- One of the 14 changed paths the capsule carried is outside the seven declared
  surfaces (`docs/final-reviews/WO-152/PR.md`, generated by `release prepare`),
  which produced the host-derived `contract:surfaces` finding.
- Effort is operator-attested, not an effective readback; Claude Code exposes
  none.
