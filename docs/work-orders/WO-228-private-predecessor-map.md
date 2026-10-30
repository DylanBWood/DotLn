# WO-228 — The private predecessor map: an instance keeps, at a configured instance-owned path, rows that say what its earlier generations did, where each lives, what in the instance now carries it and how faithfully, reads one summary of what is still missing, and turns a missing row into a generic request through WO-193's route; core ships the command, the row schema, a public synthetic seed and the fixtures, and never a row about a real predecessor (version assigned at activation)

**Retired (2026-10-30):** not activatable. The operator's direction of
2026-10-30 (item 3; ignored capture SHA-256
`94d4f4bd85efaf035a89353d6ad88abedf8e1d29c2c298fe1b3d69b62806bd8a`) removes
the work this order planned from this repository; it continues, if at all,
outside it. The text below is kept unchanged as the record of what was
planned, because records link to it and the lifecycle has no withdrawal for an
order that never activated (`withdraw` admits phase `none` only for an
allocated order); WO-088 carries the retired header as a settled state. Its
workstream, WS-002, states the retirement. Recorded by the
[2026-10-30 pass](../planning/node24-features-config-plan-first-no-work-stream-2026-10-30.md).

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Workstream:** WS-002
**Release classification:** minor. One kit command family with its row
schema, templates and seed, one suite, and the `package.json` entry;
no existing refusal weakens. Assigned at activation under the standing
opt-out default.
**Cost:** adds `npm run parity -- init|add|check|report|request`
(`scripts/parity.mjs`, new), the suite `parity` (`scripts/test-parity.mjs`,
new), a seed JSON file under `scripts/kit/`, export and update fixture cases
in `scripts/test-launchpad.mjs`, the `package.json` entry and the product
write-backs step 7 names. Removes the absence of any place where an instance
records what its predecessors did and whether its build does it yet, so "at
least as capable" becomes a count the instance can read, and removes the
predecessor half of WO-193, whose remaining half (the request route) no
longer waits for a step the operator can only take on the work machine.
Re-mints: `package.json` is a common source of the evidence inventories
(`scripts/lib/evidence-sources.mjs`), so each edition whose check the entry
stales is re-minted deterministically, the feedback edition by carry
(`package.json` is not in `FEEDBACK_SOURCE_PATHS`); no live feedback episode.
Declared machinery sources change (`package.json`, `scripts/test-runner.mjs`),
so `npm test -- --review` runs before handoff. Wall-clock and tokens: unknown
until run. Context bytes: this file, about 17,000. Steps: 8.
**Nomination provenance:** the operator's note 16 of 2026-10-02 (ignored
intake; SHA-256 in the ledger section of that date), filed as WO-194 by the
2026-10-02 pass and merged into WO-193 by the 2026-10-13 pass under the
sizing direction; cut out again by the [2026-10-21
pass](../planning/fork-notes-and-operator-questions-2026-10-21.md) on the
operator's direction of that day (ignored capture, SHA-256
`4db8e10536b76209745538e6f54f2563dc7d1b34645a2cba438fd14a7812bab6`, note 8
and the clarifying message): work that mines or works with the predecessor,
launchpad v1, which exists only on the operator's work machine, is a
separate stream, dependent on core orders and never in the serial queue.
Planner-synthesized from WO-193's parity design as it stood at `926b8234`.
Opaque identifier, not a priority. Clean-room screen: applies with force;
every row, fixture and example in this repository is synthetic or quoted
from public generic text, and a need for a predecessor fact is the stop
condition.
**Depends on:** WO-193 (planning-deferral: its step 3 builds `draftRequest`,
which `parity request` calls, and its `requests.route` floor governs the
only way a row's statement leaves an instance; this order activates after
WO-193 closes and on the operator's word from the work machine); WO-207
(reference-only: under its build pin the emitted manifest's `origin`
carries the pinned semantic hash a `unit` or `support` carrier is looked up
in; until it lands, a `build: none` instance refuses such a carrier naming
the build, as WO-193's re-observation of 2026-10-13 decided). WO-074,
WO-076 and WO-077 (closed) fixed the kit manifest, the instance-owned files
and the update this order's fixtures follow.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-193",
    "relation": "planning-deferral",
    "date": "2026-10-21",
    "reason": "the predecessor map calls WO-193's draftRequest and runs under its requests.route floor; the operator activates it from the work machine after WO-193 closes",
    "until": "WO-193"
  },
  {
    "workOrderId": "WO-207",
    "relation": "reference-only",
    "reason": "the build pin decides how a unit or support carrier is looked up in the emitted manifest's origin; whichever runs second reads the other as landed"
  },
  {
    "workOrderId": "WO-074",
    "relation": "satisfied-by-close",
    "reason": "the kit manifest and file set the parity command joins"
  },
  {
    "workOrderId": "WO-076",
    "relation": "satisfied-by-close",
    "reason": "the instance-owned files and emitted build a row's carrier is checked against"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `CLAUDE.md` §Clean Room;
`docs/decisions/0001-personal-clean-room-build.md`; product 12 §Replacing a
successful but costly workflow (the five-row table the seed quotes) and
§Open product choices; product 10 §Candidate — external rule-source import
plans (the mapping statuses); `docs/planning/critical-path-2026-09-08.md`
§The destination in the operator's terms (the parity bullet WO-112
criterion 3 enumerates); WO-193 (the request route, `draftRequest`, the
`requests.route` floor and the Design's first bullet); WO-112 (parity
measured item by item in core) and WO-096 (core's shape rows and what it
declines); WO-207 (the build pin and the manifest's `origin`);
`scripts/lib/evidence-sources.mjs`; `scripts/test-runner.mjs` (`nodeTests`
and `machinerySources`); `scripts/kit/README.client.md` §Kit files and
instance files; `docs/workstreams/WS-002-predecessor-track.md`;
`07-execution-guide.md §Preflight before the full gate`.

**Objective:** An operator moving a team from an earlier workflow can have
the instance's roles list privately, on the operator's guidance, each thing
the earlier generations did, where it lives, what in the instance now
carries it and how faithfully, and can read one summary of what is still
missing. What is missing and belongs in core becomes a generic request
through WO-193's route; nothing else leaves the instance. Core ships the
mechanism and a public seed only; the map's content exists only in the
instance, and this repository never holds a row about a real predecessor.

**Observed gap (dated 2026-10-21 at `main` `926b8234`):**

- No `scripts/parity.mjs`, no `scripts/test-parity.mjs`, no `parity` entry
  in `package.json` and no `parity` suite in `scripts/test-runner.mjs`
  (`ls` and `grep` on 2026-10-21). Product 12 §Replacing a successful but
  costly workflow asks for an inventory of both generations' useful
  behaviors and leaves open where an instance keeps private state; product
  10 proposes the mapping statuses (exact, adapted, lossy, unmapped,
  blocked, unverified) as provisional vocabulary with no schema and no
  command. WO-096 builds typed rows in core from the operator's own
  captured notes and declines importing or paraphrasing any predecessor
  file; WO-112 scores the generic parity sentence in core. Neither gives an
  instance a place for its own private rows.
- WO-193 as filed carried this map as its steps 9 to 13 and criteria 8 to
  13 beside the request route. Its execution in core needs no predecessor,
  but its purpose and its first real use are the work instance, which the
  operator cannot run yet; the operator directed on 2026-10-21 that such
  work leaves the serial queue.
- The kit's manifest excludes instance files (WO-074, v0.70.0) and the
  overlay is instance-owned (WO-076, v0.76.0); nothing instance-owned yet
  records predecessor capability.

**Design (scope discipline):**

- *The floor, first.* Every row, fixture and example in this repository is
  synthetic or quoted from product 12 or the critical-path document, whose
  generic terms are the ones `CLAUDE.md` prescribes; no predecessor
  capability, rule, name or structure is described beyond what those two
  say, and the executor adds none. A need for a predecessor fact is the stop
  condition: stop and flag it. Rejected: rows in core for a real
  predecessor (axis: the clean-room floor).
- *Rows are instance-owned; the registry is ignored.* `parity init` writes
  the rows file from the seed at the configured instance path and creates
  the ignored source registry; neither is in the kit manifest, no export,
  update or receipt command reads either, and no command copies a source's
  bytes. Rejected: a map shared across instances (axis: instances are not
  tracked), and an importer that reads predecessor rule files and proposes
  rows (axis: it needs an observed source and an instance's authority;
  product 10's candidate reopens as an instance order after that instance's
  first order observes its host).
- *A row is typed.* `decodeParityRow` reads `id`; `generation` (the
  instance's label; seed rows carry `v1`); `kind` in `capability`, `rule`;
  `statement` (generic, public terms); `source` `{ registryKey, locator }`,
  or on a seed row `{ document, quote }`; `status` in `exact`, `adapted`,
  `lossy`, `unmapped`, `blocked`, `unverified`; `carrier` `{ kind: "unit" |
  "support" | "profile" | "order", id }` for exact, adapted and lossy;
  `lost` for lossy; `request` or `decision` for unmapped; `blocker` for
  blocked; optional `evidence` path; fixture rows carry `synthetic: true`.
  A refusal names the field as `PARITY_FIELD_<NAME>`. Rejected: free prose
  rows (axis: product 07's screen against deterministic readings of
  natural language).
- *A carrier is looked up, never trusted.* `check` finds a `unit` or
  `support` carrier in the emitted manifest's `origin.ids` (under WO-207's
  build pin, the pinned semantic hash), a `profile` as a document path and
  an `order` as an id in the control log; under `build: "none"` it refuses a
  `unit` or `support` carrier naming the build; it refuses a `lossy` row
  that says nothing is lost and an `unmapped` row with neither a request
  nor a decision; and it searches each row's `source.locator`, `lost` and
  `blocker` as substrings in kit files and request drafts, so a private
  field that leaked is found by text (a paraphrase passes; the floor rests
  on the operator's reading).
- *The summary is a count.* `report` counts by generation, kind and status
  and marks a generation `at-least-as-capable: false` while any `unmapped`,
  `blocked` or `unverified` row remains, listing those ids. Rejected: a
  score (axis: WO-112 scores core's own sentence; an instance reads a count).
- *The only exit is a request.* `parity request <row>` calls WO-193's
  `draftRequest` with the row's `statement` as the body and nothing else;
  the draft then takes WO-193's route (`request check`, `request ready` on
  the operator's word, `request file` under `requests.route`). Rejected:
  reusing WO-096's renderer (axis: a different source; the vocabulary is
  shared when it lands).

**Deliverables:** the command family and its schema; the seed; the suite;
the export and update fixture cases; the re-mints; the write-backs;
decisions and README.

**Acceptance criteria (all required)**

1. In an exported fixture instance, `parity init` writes the rows file from
   the seed at the configured path and creates the ignored registry, a
   second `init` changes no byte, and the kit manifest lists the command,
   the templates, the schema and the seed and neither the rows file nor the
   registry; `git status` shows no tracked change from `init`.
2. `parity add` writes a row and refuses one whose fields do not fit its
   status, naming the field as `PARITY_FIELD_<NAME>`; a table test covers
   every status.
3. `parity check` refuses, naming the row: a carrier absent from a fixture
   build and order set; a `unit` or `support` carrier under a fixture
   `build: none` manifest, naming the build; a `lossy` row that says
   nothing is lost; an `unmapped` row with neither a request nor a
   decision; and a private field's text found in a kit file or a request
   draft.
4. `parity report` over a synthetic set of two generations prints the
   counts and, per generation, whether it is at least as capable, with the
   rows that prevent it.
5. `parity request <row>` writes a request draft whose body is the row's
   generic statement; a test shows that no other field of the row appears
   in the draft.
6. An update fixture leaves the rows file and the registry byte for byte
   unchanged, and an export from a core checkout that holds a synthetic
   rows file writes none of it into the kit.
7. Every row, fixture and example committed by this order is synthetic or
   quoted from product 12 or the critical path document, each seed
   `source.quote` a substring of its `document`; the final review records
   the check that found it so. The write-backs of step 7 state, in product
   12, where an instance keeps this private state and the report as an
   instance's parity measure, in product 10 the mapping statuses in use by
   the instance map, and in the client README the command; `npm run meta
   -- --check` passes.
8. The re-mints of step 6 are recorded; `npm test -- --review` and `npm
   run test:docs` green; `git diff --check` clean; no new dependency. No
   live feedback episode is owed.

**Preflight:** `node --test scripts/test-parity.mjs` for steps 1 to 4 (the
suite step 4 registers), `npm test -- --only runner-fixtures` for step 4,
`npm test -- --only launchpad` for step 5, `npm test -- --only
authority-evidence`, `npm test -- --only artifact-evidence`, `npm test --
--only verification-evidence`, `npm test -- --only feedback-evidence`, `npm
test -- --only harness-evidence` and `npm test -- --only evidence-sources`
for step 6, and `npm run test:docs` when a document changes (step 7), each
under `node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Execution plan (the executor follows these steps in order; observed at `926b8234`, 2026-10-21):**

1. `scripts/parity.mjs` (new): export `decodeParityRow` with the fields and
   refusals of the Design's third bullet. Check: step 4.
2. The seed, a JSON file in `scripts/kit/` (new): the five rows of the
   table in product 12 §Replacing a successful but costly workflow and the
   eight items of the critical path's parity bullet as WO-112 criterion 3
   enumerates them, each `unverified`, each `source.quote` copied verbatim
   from product 12 or the critical path document, written out by the
   executor; nothing parses the table. Check: step 4.
3. Same file: the commands `init`, `add`, `check`, `report` and `request`
   of the Design's second, fourth, fifth and sixth bullets; `package.json`
   gains `"parity": "node scripts/parity.mjs"`; the configured rows path
   joins `SECTION_KEYS` in `scripts/lib/config.mjs` as WO-193's `requests`
   section did (re-read WO-193's step 1 as landed), and the kit's
   `dotln.config.example.json` and `gitignore.template` name the path and
   the ignored registry. Check: step 4.
4. `scripts/test-parity.mjs` (new) over synthetic rows: each status
   (criterion 2), the five refusals (criterion 3), a two-generation report
   (criterion 4), a statement-only draft (criterion 5) and the quote test
   (criterion 7); `nodeTests("parity", "scripts/test-parity.mjs", {
   protects })` joins `suites` in `scripts/test-runner.mjs`. Check: `node
   --test scripts/test-parity.mjs`; `npm test -- --only runner-fixtures`.
5. `scripts/test-launchpad.mjs`: export and update fixture cases for
   criteria 1 and 6. Check: `npm test -- --only launchpad`.
6. Re-mints: point `docs/evidence/current.json` at WO-228 revision 001 for
   each kind the `package.json` entry stales; `npm run build`; `node
   scripts/authority-evidence.mjs --write`, `node
   scripts/artifact-identity-evidence.mjs --write`, `node
   scripts/verification-evidence.mjs --write`; `node
   scripts/feedback-evidence.mjs --carry <the feedback edition selected at
   the base>`. Check: `npm test -- --only` each of `authority-evidence`,
   `artifact-evidence`, `verification-evidence`, `feedback-evidence`,
   `harness-evidence` and `evidence-sources`.
7. Write-backs, in place, each heading re-read at the base: product 12
   §"## Replacing a successful but costly workflow" (where an instance
   keeps this private state; the report as the instance's parity measure)
   and §"## Open product choices"; product 10 §"Candidate — external
   rule-source import plans" (the statuses in use by the instance map);
   `scripts/kit/README.client.md` §Kit files and instance files (the
   command, the rows file and the registry); `docs/evidence/WO-228/decisions.md`;
   `npm run meta`; `npm run publication:check`. Check: `npm run test:docs`.
8. Handoff: `npm run format`; `npm run test:docs`; `npm test -- --review`;
   complete `docs/evidence/WO-228/handoff.md`; `npm run resume --
   implementation-ready <flags>`.

**Evidence gate:** the fixtures and table tests of criteria 1 to 6; the
recorded check of criterion 7; the re-mints; `npm test -- --review` before
`implementation-ready` and at final review, which reuses the last passing
run when the code identity is unchanged. No live row: a real map exists only
in an instance and is never evidence here.

**Write-back duty:** criterion 7 and step 7.

**Known issues and carry-ins:**

- This order is the predecessor half of WO-193 as filed on 2026-10-13
  (its steps 9 to 13, criteria 8 to 13, the parity parts of its criteria 1
  and 12, its product 10 and product 12 write-backs). The 2026-10-21 pass
  removed them from WO-193; nothing in this order is new design.
- Activation waits on the operator's word from the work machine and on
  WO-193's close (the planning-deferral edge). The mechanism is verified in
  core with synthetic rows; the first real map is filled in the work
  instance, outside this repository's evidence.
- Under `build: none` a `unit` or `support` carrier is refused naming the
  build until WO-207's pin lands; whichever of WO-207 and this order runs
  second reads the other as landed.
- The private-field check compares text; a paraphrase passes it. The floor
  rests on the operator's reading, not on the screens.
- An instance that copies predecessor text into its own rows acts inside
  its own boundary; this order guarantees that core's commands never carry a
  row out.
- The product 12 and 10 write-backs add source revisions to the register
  rows that cite those sections (as WO-193's would have); `npm run meta`
  records them and the next pass re-records each.

**Non-goals:** moving any instance content to core; reading or tracking an
instance from core; any row about a real predecessor in this repository;
reading or importing predecessor material; an importer for an organization's
rule stores; a tracker other than the forge's issues; deciding what an
instance may retire; the request route itself (WO-193).

**Operator-review assumptions**

1. Core ships mechanism and public seed rows only; the map's content exists
   only in the instance.
2. Generations are labels the instance chooses; this repository keeps its
   own generic terms.
3. "At least as capable" means no row of that generation is unmapped,
   blocked or unverified.
4. The only way anything derived from a row leaves an instance is a request
   built from its generic statement, through WO-193's route.
5. This order runs when the operator can run it from the work machine, after
   WO-193 closes; it is a member of WS-002 and not of the serial queue.
