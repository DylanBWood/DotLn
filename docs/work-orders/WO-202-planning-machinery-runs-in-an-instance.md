# WO-202 — The planning machinery runs in an instance: plan start, the follow-up register, refute and receipt, the entropy review, meta, the work-order index, the document gate, the publication check and what a release close reads, each observed on a fixture export and fixed where the kit lacks it (v0.78.0)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. New instance seeds in the export, inputs
made optional where an instance lacks core's records, one fixture suite and
a client README section; core's own commands keep their behavior. Assigned
at activation under the standing opt-out default.
**Cost:** adds a fixture suite `scripts/test-launchpad-planning.mjs` (one
export, then every command of the planning list run inside it, first as a
probe at the base and then as assertions), its row in
`scripts/test-runner.mjs`, the instance seeds the probe shows missing
(written once by `scripts/launchpad.mjs`, never manifest-listed), optional
handling of core-only inputs in the planning scripts the probe names
(`scripts/refute-plan.mjs`, `scripts/lib/planning-followups.mjs`,
`scripts/docs-check.mjs`, `scripts/check-publication.mjs`,
`scripts/lib/reader-profiles.mjs` and `scripts/meta.mjs` are the candidates
the gap names), and a §Planning in this instance section in
`scripts/kit/README.client.md`. Removes the unobserved state: no planning
pass, refutation, entropy review or document gate has run inside an export,
and an instance today depends on core for its planning. Wall-clock: the new
suite costs one export plus the command list (the probe records each
command's duration); the `launchpad` task's growth is WO-201's watch and
this suite is a separate row. Re-mints: none of the named scripts is a
registered evidence source (`scripts/lib/evidence-sources.mjs`), so no
edition re-mint and no live feedback episode; the launchpad and the runner
are declared machinery sources, so `npm test -- --review` runs before
handoff. Tokens and context bytes are unknown until run.
**Nomination provenance:** operator direction of 2026-10-11, item (b) of the
three-repository route dispatch (captured in ignored intake, SHA-256
`d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`), and
the same dispatch's correction 2 (machinery parity: an instance runs what
core runs, planning passes included). The conversation-only session that
preceded it (ignored capture, SHA-256
`f4fbb3cf35c2608244f373f1b12c404cc724dbb2dc838a80c6795e5d3c287d85`)
found that `npm run plan -- conditions` already reports one row unavailable
in an export and that nothing else has been observed there.
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
the fixture export is a public artifact; no instance content is read.
**Depends on:** WO-201 (hard: the document gate and the review gate run
inside a kit only with its kit mode); WO-075, WO-077 and WO-078 merged
(closed, v0.72.0, v0.74.0, v0.74.3: the export, the update and the receipt
step the fixture exercises).
**Recommended placement:** alone, directly after WO-201 and before WO-203
and WO-118. The operator exports, pushes, forks and opens the instance's
first planning pass once this order has closed (the sequence prose names
the point). This order edits `scripts/launchpad.mjs` (seeds),
`scripts/test-runner.mjs` (one row), the planning scripts the probe names,
`scripts/kit/README.client.md`, product 07 and product 12. WO-201 edits the
launchpad, the runner and the README before it. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-201",
    "relation": "hard",
    "reason": "the document and review gates run inside a kit only with WO-201's kit mode"
  },
  {
    "workOrderId": "WO-078",
    "relation": "satisfied-by-close",
    "reason": "the export's receipt step the fixture runs through"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Operator-opened
planning pass (the commands and artifacts a pass uses) and §Workflow
closeout and releases (what a release close reads); `scripts/refute-plan.mjs`
(`start` from line 347: `planningFollowups`, `failuresAtStart`,
`readerScoresAtStart`, `conditionsAtStart`; `refute`, `receipt`, `check`,
`subject`, `followups`); `scripts/lib/planning-followups.mjs`
(`syncFollowups`); `scripts/meta.mjs` (`--plan-cost`, `cost-table.json`);
`scripts/entropy.mjs` (`subject`, `review`, `refute`, the transports);
`scripts/work-orders.mjs` (`index`, `--check`); `scripts/docs-check.mjs`
(the `doc-ceilings.json` read at line 1437); `scripts/check-publication.mjs`
(the two edition files at lines 16 to 31); `scripts/lib/reader-profiles.mjs`
and `scripts/reader.mjs` (`check`); `scripts/lineage.mjs` (`index`);
`scripts/launchpad.mjs` (`SEEDED_ROOTS` from line 190, the sequence seed at
lines 919 to 933, `prepareKit`); `scripts/kit/README.client.md`;
`.claude/harness-manifest.json` (the planner and refuter skills and the
`dotln-worker` definition the bundle installs); the
[2026-10-11 route planning document](../planning/three-repository-route-2026-10-11.md)
§5.

**Objective:** Inside a fixture export, every command a planning pass and a
release close use either runs or prints its unavailable row by name:
`npm run plan -- start <slug>` on the export's clean `main`, the register's
feed, export and batch apply, `plan -- refute` printing the canonical prompt
from the export's own sequence and orders, `plan -- receipt` filing a fixture
result, `plan -- check`, `plan -- conditions`, `plan -- failures`,
`npm run entropy -- subject` and a `fake`-transport review, `npm run meta`
and `npm run meta -- --plan-cost`, `npm run work-orders -- index` and
`--check`, `node scripts/docs-check.mjs`, `npm run publication:check`,
`node scripts/lineage.mjs index`, `npm run reader -- check`, `npm run test:docs`
(WO-201's kit mode) and the reads a release close performs
(`npm run release -- check-surfaces --local`, `npm run resume -- status`);
what the kit lacks for them is seeded or made optional; and the client README
states which commands an instance's planning pass runs and what each needs.

**Observed gap (dated 2026-10-11, `main` at `82b7fdb7`):**

- The export seeds `docs/planning/sequence.md` (`scripts/launchpad.mjs`
  lines 919 to 933) and one README per seeded root (`SEEDED_ROOTS`, line
  190). Nothing seeds `docs/planning/followups.json`,
  `docs/control/doc-ceilings.json` (read by `scripts/docs-check.mjs` at
  line 1437), `docs/control/plan-refutations.jsonl`,
  `docs/control/budgets.json` (`readBudgets` throws without it, as WO-192's
  step 3 records), `docs/lineage/idea-ledger.md` or the two publication
  edition files `scripts/check-publication.mjs` reads (lines 16 to 31).
- `plan start` (`scripts/refute-plan.mjs` line 347) requires the branch
  `main` and a clean tree, reads the register through `planningFollowups`
  (a stale or absent register refuses entry), counts failures, reads reader
  scores and runs the conditions probe, one of whose rows reaches
  `@dotln/console`, which the kit does not carry (the client README names
  that row as unavailable in an export).
- The Contributor bundle the export emits installs the planner and refuter
  skills and the `dotln-worker` agent definition (core's
  `.claude/harness-manifest.json` lists `.claude/skills/dotln-planner/SKILL.md`,
  `.claude/skills/dotln-refuter/SKILL.md` and `.claude/agents/dotln-worker.md`;
  WO-075 criterion 2 checks the same bundle inside the export), so the
  refutation worker can be dispatched in an instance under Claude Code; no
  record shows it done.
- `npm run reader -- check` re-reads every recorded score's tag object; an
  instance has none of core's release tags, and FUP-8b8eb522d1d136c0 (WO-191
  D010) records that a missing tag object fails the gate with a raw Git
  error naming no release.
- `npm run resume -- status` in a fresh export warns that the projection
  disagrees with the fold before the first activate (FUP-749c959a41178a3b,
  WO-075 D012).
- FUP-a058e82c0bbd9b6d (WO-070 D009) defers plane/kit root resolution for
  the build-free modules and the harness probes until "a launchpad separate
  from the scripts' checkout, or one declaring non-default roots, must run
  these paths"; the fixture export is such a launchpad.
- No planning pass, refutation, entropy review or document gate has run
  inside an export; the record holds no row for any of them.

**Design (scope discipline):**

- Probe first, then fix, then assert. The fixture suite runs the command
  list in the fixture export at the base and writes
  `docs/evidence/WO-202/commands.json`, one row per command: `{ command,
  exitCode, inputs, result, fix }`, before any change. Every fix is the
  smallest kit change that makes the row pass: a seed written once at export
  (never manifest-listed, so an update leaves it alone), or an input made
  optional with its absence reported by name. The suite then asserts the
  final table.
- Seeds are instance files. The register seed is an empty register with the
  current schema; the ceilings seed declares no documents; the budgets seed
  is the kit's defaults with no acceptances; the lineage ledger seed is the
  header only. Each is written by `prepareKit` beside the sequence seed and
  listed in the README.
- Core-only inputs are reported, never emulated: `publication:check` with
  no edition files passes stating that none is declared; the reader check
  with no score rows passes, and a row whose tag object is absent reports
  the row unverifiable naming its release, tag object and the fetch that
  restores it (FUP-8b8eb522d1d136c0's rule); `plan conditions` prints the
  console row as unavailable, as the README already says.
- The refutation runs end to end in the fixture with a fixture result: the
  prompt is built from the export's seeded sequence and pre-drafted order,
  a result in the closed schema is filed by `plan receipt`, and `plan check`
  passes. The entropy review runs `--transport fake` only; a live transport
  is the operator's, in the instance.
- A release close is not performed in the fixture (it publishes); the reads
  it performs are run and recorded.
- **Declined alternatives, recorded:** a planning subset for instances (the
  operator's correction 2: an instance runs what core runs); carrying core's
  register, ceilings or editions into the kit (they are core's instance
  files, correction 4); fixing the planning scripts without the probe (the
  set of failures is the thing to observe); a live refutation or entropy
  episode in the fixture (paid by the operator in the instance, not by the
  gate).

**Execution plan (the executor follows these steps in order; observed at `82b7fdb7`, 2026-10-11):**

1. `scripts/test-launchpad-planning.mjs` (new): export a kit into a bounded
   temporary directory, commit it, `npm ci --offline` as the WO-074
   criterion 1 case does, then run each command of the Objective's list
   with `spawnSync` inside the export; write `docs/evidence/WO-202/commands.json`
   with each command's exit code, the first lines of its output and the
   inputs it tried to read (from its error text). Add the suite as a
   `nodeTests("launchpad-planning", ...)` row in `scripts/test-runner.mjs`
   with its declared sources in `machinerySources`. Check:
   `npm test -- --only launchpad-planning` at the base; the table is the
   probe (criterion 1).
2. `scripts/launchpad.mjs`: add the seeds the probe shows missing, each a
   `seeds.push(path)` beside the sequence seed (lines 919 to 933): the
   register (`docs/planning/followups.json`, the schema
   `scripts/lib/planning-followups.mjs` writes, empty), the ceilings
   (`docs/control/doc-ceilings.json`, no documents), the budgets
   (`docs/control/budgets.json`, defaults without acceptances), the ledger
   header (`docs/lineage/idea-ledger.md`), and any other file the probe
   names. Check: the WO-074 criterion 3 case (the manifest lists no instance
   path) and the WO-078 update case (an update leaves seeds alone).
3. `scripts/check-publication.mjs`: with neither edition file present, pass
   and print `publication: no editions declared`. `scripts/lib/reader-profiles.mjs`
   (`check`): with no score rows, pass; with a row whose tag object is absent,
   report `Reader profiles: <release> unverifiable: tag object <sha> absent;
   run git fetch --tags <remote>` instead of a raw Git error
   (FUP-8b8eb522d1d136c0). Check: cases in `scripts/test-reader.mjs` and the
   fixture table.
4. `scripts/refute-plan.mjs` and `scripts/lib/planning-followups.mjs`: make
   `plan start` succeed on the seeded register and the fixture's clean
   `main`; `plan refute` builds the prompt from the seeded sequence and the
   pre-drafted first order; `plan receipt` files a fixture result; `plan
   check` passes. Check: the fixture table rows for the five commands.
5. `scripts/entropy.mjs`: `subject` in an export names no review and exits
   0; `review --transport fake` files its fixture receipt under the
   instance's roots. Check: the fixture table rows.
6. `scripts/resume.mjs`: if the probe meets FUP-749c959a41178a3b (the
   projection warning in a fresh export), treat an absent projection over an
   empty fold as agreement and add the case to the fixture; otherwise record
   the row as not met.
7. FUP-a058e82c0bbd9b6d: run the build-free module and harness-probe paths
   the row names inside the fixture export; fix a failure within the Boy
   Scout bound or record each in the decisions with the reason it is left.
8. `scripts/kit/README.client.md`: add §"## Planning in this instance" after
   §First steps: the commands a planning pass runs here, the seeds they
   read, the rows that report unavailable, and that the refutation worker
   is dispatched from the planner skill the bundle installs.
9. Write-backs (each heading re-read at the base): `docs/product/07-execution-guide.md`
   §"## Operator-opened planning pass": one sentence that the same commands
   run in an exported instance, with this order's evidence; `docs/product/12-workstream-application.md`
   §"## One workstream across repositories": the machinery-parity sentence
   gains its evidence; `docs/evidence/WO-202/decisions.md`;
   `node scripts/lineage.mjs index --check`;
   `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
10. Handoff sequence: `npm run format`; `npm run test:docs`;
    `npm test -- --review`; complete `docs/evidence/WO-202/handoff.md`;
    `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the probe table at the base; the seeds; the optional-input
changes; the fixture suite and its row; the README section; the write-backs
below.

**Acceptance criteria (all required)**

1. `docs/evidence/WO-202/commands.json` records every command of the
   Objective's list run inside a fixture export at the base before any fix,
   with exit code, output head and the inputs it tried to read; the
   decisions name which rows failed and the fix each received.
2. After the fixes, each command of the list exits 0 inside the fixture
   export or prints its declared unavailable row by name (the console row of
   `plan conditions`), asserted by `scripts/test-launchpad-planning.mjs`;
   `plan start` creates a planning branch in the export, `plan refute`
   prints a prompt built from the export's own sequence and order,
   `plan receipt` files a fixture result and `plan check` passes there;
   `npm run entropy -- subject` exits 0 naming no review and a
   `fake`-transport review files its receipt under the instance's roots.
3. Every seed this order adds is written once at export, listed in the
   client README, absent from `KIT-MANIFEST.json` (the WO-074 criterion 3
   case), and left untouched by an update (the WO-078 update case).
4. With no edition files, `npm run publication:check` passes stating none is
   declared; with no score rows, `npm run reader -- check` passes; a score
   row whose tag object is absent is reported unverifiable naming its
   release, tag object and the restoring fetch, never as a raw Git error
   (fixture case in `scripts/test-reader.mjs`).
5. The client README's §Planning in this instance names the commands an
   instance's planning pass runs, the seeds they read, the rows that report
   unavailable and how the refutation worker is dispatched; the README
   travels manifest-listed.
6. Write-backs land, each in place with no dated paragraph: product 07
   §Operator-opened planning pass (one sentence with this order's evidence);
   product 12 §One workstream across repositories (the parity sentence's
   evidence); the decisions file, with FUP-a058e82c0bbd9b6d's and
   FUP-749c959a41178a3b's outcomes recorded; the publication locks
   refreshed. No byte figure binds these write-backs.
7. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the probe table; the fixture suite's assertions;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`
(the launchpad and the runner are declared machinery sources) and again at
final review.

**Write-back duty:** as listed in criteria 5 and 6.

**Known issues and carry-ins:**

- FUP-a058e82c0bbd9b6d (WO-070 D009, plane/kit root resolution) is
  allocated here: the fixture export is the separate launchpad its trigger
  names; step 7 runs the paths and fixes within the bound or records.
- FUP-8b8eb522d1d136c0 (WO-191 D010, the reader check's raw Git error) is
  allocated here: an instance never holds core's scored release tags; step 3
  applies the row's rule.
- FUP-749c959a41178a3b (WO-075 D012, the projection warning in a fresh
  export) is allocated here within the Boy Scout bound; step 6 records
  whether the probe met it.
- FUP-a4b2cdfb03ddbd2e (WO-191 D011, a malformed reader result refused with
  a raw TypeError) is allocated here within the Boy Scout bound: step 3 edits
  the same module; the executor fixes it with its fixture case or records why
  it is left.
- A live refutation or entropy episode in an instance is the operator's
  first planning pass there, not this fixture; the instance's first pass
  records what the fixture could not.

**Non-goals:** a live refutation or entropy transport inside the fixture;
performing a release close in the fixture; the content of any instance's
planning pass; carrying core's register, ceilings, ledger or editions into
the kit; the gates' kit mode (WO-201); the update's preview and rollback
(WO-203, WO-207).

**Operator-review assumptions**

1. The seeds are the kit's defaults and the instance owns them from the
   first commit; a later kit revision changes a seed only through a
   declared instance action (WO-077), never by overwriting.
2. The operator's instance runs its first planning pass after this order
   closes and records there what the fixture could not observe.
