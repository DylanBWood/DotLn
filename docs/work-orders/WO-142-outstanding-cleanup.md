# WO-142 — Outstanding cleanup: the follow-up feed stops refilling with records, the defects and nominations that reviews logged and nobody owned are fixed or returned with a reason, stale claims in the live documents match the tree, and local residue has a prune command (version assigned at activation)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any. The breadth, not
the difficulty of any row, is the reason.
**Release classification:** minor. Four inputs that were accepted are now
refused (a claim-free bare `*` pattern, a lens scope with glob characters or
padding, an unknown skeleton CLI argument, an appended event whose assigned
envelope does not decode); two result schemas gain the bound their validators
already enforce; one on-demand command is added. No event, envelope or
predicate version changes. Kernel, compiler, skeleton and console each take
the bump their changed sources require. Assigned at activation under the
standing opt-out default.
**Cost:** adds no recurring step, gate, hook, key, receipt or ritual. Adds
one on-demand command (`harness prune`, never run by a gate), one equality
assertion inside the existing `release check-surfaces`, one anchor-resolution
assertion inside the existing `meta --check`, and one live feedback edition
for this order (the routine cost of any order that edits a feedback source;
model spend unknown until run). Removes, measured on 2026-09-19 at
`3b3533f8`: the pending follow-up feed's refill (235 of 399 register entries
are decision records harvested as follow-ups; the feed grew 359 to 399 in two
days and three passes selected nothing from it); the carried-set eviction
that made the 2026-09-19 refutation re-judge eight orders whose only change
was an activation version stamp; a paid refutation lost whenever a result
fails validation (recorded once, 2026-09-17); the first `npm run test:docs`
failing after every `verify` or `final review` dispatch (four reports); the
live-gate refusal of read-only commands such as `git status` and `tail`
(nine reports; the seventeen reviewer gates recorded since 2026-09-16 ran
303 to 1,178 s, median 793 s, in `docs/control/orders/`); two full gates
lost to a cascade message that hides which dependency failed (WO-048
FINAL-001); and 176 MB of unowned local residue
(27 harness snapshots at 80 MB against a candidate threshold of twenty, and
96 MB under `.git/dotln/suite-success` that no source writes since WO-132).
The order's own wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's 2026-09-19 `planning:` dispatch
asking for one work order that clears logged non-blocking issues, unread
suggestions, low-hanging bugs and continuing debt, with a pass budgeted for
it, captured verbatim in ignored intake. Every row below comes from a
committed verification report, final review, decision record, planning
document, refutation receipt or register row, named in the row; eight
read-only surveys of those surfaces and of the tree produced the rows and
[the planning document](../planning/outstanding-cleanup-2026-09-19.md) §2
and §3 record the method, the counts and what was left out. Planner-
synthesized. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** none open. WO-132 (the stand-down whose rules bound every
row) and WO-139 (the subagent budget module three rows touch) are closed.
**Recommended placement:** first queued entry; lane pair with WO-084, whose
surfaces (`docs/lineage/idea-ledger.md`, `docs/lineage/resolutions.md`,
`docs/lineage/README.md`, `scripts/lineage.mjs`) this order does not touch.
A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-132",
    "relation": "satisfied-by-close",
    "reason": "the stand-down rules every row keeps: no new gate, hook, key or recurring check; document checks live in test:docs"
  },
  {
    "workOrderId": "WO-139",
    "relation": "satisfied-by-close",
    "reason": "the subagent budget module and the amendment route rows B2, B5 and A9 touch"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** [the planning document](../planning/outstanding-cleanup-2026-09-19.md)
§2 (method and limits of the surveys), §3 (the cut rules) and §6 (what was
left out and why); 07-execution-guide.md §Discipline (machinery stand-down;
write once, run once), §Candidate — follow-up register settlement,
§Candidate — local lane retention, §Documentation freshness and ownership;
[followups.md](../planning/followups.md); the report or record named in each
row, at the cited section only.

**Objective:** After this order a planner's pending feed holds items that
ask for something, the defects and nominations that reviews recorded since
WO-003 and that no order owned are either fixed with a named check or
returned with an observed reason, the live documents stop describing closed
orders as pending and four hook refusals as two or three, and the operator
can remove
local residue with one command that first shows what it would delete.

**Observed gap (dated 2026-09-19, `main` at `3b3533f8`, v0.31.1):**

- The follow-up register held 399 entries, 371 pending and 364 never
  triaged. This planning pass disposed the rows; the collector
  (`scripts/lib/planning-followups.mjs:163-176`) still harvests every
  per-order decision record as a follow-up, so the feed refills at the rate
  orders record decisions (40 entries in two days).
- Eight surveys of 116 verification reports, 74 final reviews, 47 refutation
  receipts, the dated planning documents and the tree found the rows below
  present at this commit. Thirteen were re-checked by hand before filing
  (A1, A2, A4, A8, B1, B2a, B3, B7, B8a, B12a, B13, B16c, D1) and all thirteen
  reproduced.
- A survey is model output. Row text is a lead, never proof: the executor
  re-observes each row before changing anything (criterion 1).

**Design (scope discipline):**

- **Row discipline.** Each row ends in exactly one state, recorded in
  `docs/evidence/WO-142/rows.md` with the command that shows it: `fixed`
  (the required result holds and its named check passes), `not-reproduced`
  (the executor's first observation shows the defect absent at activation;
  the observation is recorded), or `returned` (fixing it would need a
  product decision, a new recurring step, a replay-sensitive or worker-input
  change, or live spend beyond the one feedback edition). A returned row
  names what was observed and gets a public follow-up record with a
  reopening condition. At most six rows may be returned, never a starred
  row. A starred row that cannot be fixed inside these bounds stops the
  order for `analysis:`.
- **One regeneration each.** Source rows land before the harness bundle, the
  evidence editions and the generated indexes are regenerated, so each is
  regenerated once. Rows B7, B8 and B9 change edition inputs; the feedback
  edition is recorded once, after every source row.
- **No new mechanism.** No hook, gate suite, recurring check, key, cache or
  receipt kind is added. B3 extends an existing allowlist; A3 and A20(c) add
  assertions inside checks that already run; D1 is an on-demand command.
- **Fences.** `packages/skeleton/src/reactor.ts` is not opened (three
  recorded items wait for the next order that opens it). No row changes a
  worker's input, a replay-sensitive route, the harness runtime pin list or
  a semantic hash, except the Entropy Reducer's, which row B9 versions on
  purpose. The ledger and `docs/lineage/README.md` belong to
  WO-084; the capability table to WO-089; the guide's structure to WO-090.
  Immutable reports and receipts are never edited.
- **Declined alternatives, recorded:** several orders by surface (each pays
  a gate, a verification, a final review and a close for rows that share
  one regeneration; the operator asked for one budgeted pass); a rolling
  boy-scout rule instead of an order (it is the rule that produced this
  backlog: the conditional items attached to WO-068 and WO-135 were not
  exercised); fixing only starred rows (the long tail is the operator's
  complaint); folding WO-084 to WO-090 in (judged contracts with their own
  criteria, see the planning document §4).

**Deliverables:** the rows below; `docs/evidence/WO-142/rows.md`,
`decisions.md` and `README.md`; regenerated bundle, manifest, indexes,
publication locks and evidence editions; the write-backs in criterion 6.

### Part A — planning, control and release tooling (`scripts/`)

| Row   | Defect observed (path)                                                                                                                                                                                                                 | Required result                                                                                                                                                                                                                                                            | Source                                                                                     |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| A1 ★  | every decision record becomes a pending follow-up (`scripts/lib/planning-followups.mjs:163-176`)                                                                                                                                       | a new decision record creates a pending row only when it names a follow-up or another record states that its reopening observation occurred; existing entries, ids and history are byte-preserved; the decisions index still lists every record; fixtures for both forms | 07 §Candidate — follow-up register settlement                                              |
| A2 ★  | `planOrderHash` hashes the title, so an activation version stamp evicts an unchanged order from the carried set (`scripts/lib/plan-direct.mjs:22-30`)                                                                                 | the version parenthetical is outside the hash; an order carried under the old hash stays carried (no full re-judgment is forced); carried-set fixture with a stamped title                                                                                                 | receipt 016, WO-052 criterion 6 known issue                                                |
| A3    | decisions-index fragments are `#wo-nnn-dnnn` while eleven orders title their headings; 47 fragments resolve nowhere (`scripts/lib/meta.mjs:140`); the register's decision refs share the form                                         | fragments derive from the full heading; `meta --check` asserts each resolves                                                                                                                                                                                                | tree survey (link check)                                                                   |
| A4 ★  | the work-order index is refreshed only on the executor's release path, so the first `test:docs` after a `verify` or `final review` dispatch fails (`scripts/resume.mjs:1103`)                                                          | every state-changing transition refreshes it; fixture                                                                                                                                                                                                                       | WO-134 VER-001 L2; WO-135 VER-001 note b; WO-132 VER-002 O8; WO-126 VER-007                |
| A5    | the index renders 90 links to `decisions.md` files that do not exist, 26 on closed orders (`scripts/work-orders.mjs:431-435`); the duty predicate exists twice and drifted (`scripts/work-orders.mjs:83-88`, `scripts/lib/meta.mjs:189-196`) | the link renders only when the file exists; one shared predicate, the tested one                                                                                                                                                                                            | tree survey                                                                                |
| A6    | a draft order whose title carries a product `vN` token renders "Application target: malformed" (`scripts/work-orders.mjs:66-75`; index rows for WO-058, WO-060, WO-114)                                                                | an unassigned title renders unassigned                                                                                                                                                                                                                                      | WO-026 FINAL-001 finding 2                                                                 |
| A7    | five one-off scripts have no test, npm entry or code reference (`scripts/authority-mutation-evidence.mjs`, `scripts/benchmark-build-publication.mjs`, `scripts/probe-beacon.py`, `scripts/probe-codex-effort.mjs`, `scripts/target-worker-smoke.mjs`) although 07 asks ad hoc tools for proportionate tests | each is removed, or named as retained evidence tooling beside the evidence it produced, with its owning order | tree survey; 07 §Operator-opened ideation mode (helper rule) |
| A8 ★  | a `.DS_Store` in `docs/control/orders/` refuses every `resume` command (`scripts/lib/control-store.mjs:108-109`, `scripts/lib/control.mjs:216-218`)                                                                                    | exactly the basenames `scripts/lib/paths.mjs` already calls disposable are skipped; any other stray name still refuses; fixture for both                                                                                                                                    | WO-030 FINAL-001 finding 1                                                                 |
| A9    | thin planning pins: `assert.rejects` without a matcher and no forged `orderLength` (`scripts/test-plan-refutation.mjs:2058-2069`); the leading 24-entry group unpinned (`:2475-2476`); `executionAmendmentSource` not anchored at the string start (`scripts/lib/plan-continuation.mjs:64-70`) | matchers and the `orderLength` case; the group-length pin; the anchored expression with a later-heading fixture                                                                                                                                                             | WO-139 FINAL-002 item 3, VER-001 O2; WO-135 FINAL-001 O2                                   |
| A10   | `RepairCompleted.sourceVerificationId` names the verification even when a final review asked for the repair (`scripts/resume.mjs:976` against `:955-958`)                                                                              | it carries the requesting source; every reader of the field is checked and listed                                                                                                                                                                                           | WO-139 VER-002 §Limits                                                                     |
| A11   | diagnostics that hide their subject: the gate cascade message omits which dependency failed (`scripts/test-runner.mjs:751-767`); progress lines keep trailing whitespace (`:586`, `:603`); checkpoint-time recovery loses the ordinal (`scripts/lib/control-time.mjs:101-106`); account-label validation names no ordinal (`scripts/lib/control.mjs:49`); a stale index temporary fails with a bare EEXIST (`scripts/work-orders.mjs:559-561`); refusal hints omit `--work-order` (`scripts/resume.mjs:176-185`); "resolve candidate candidate: later" (`scripts/lib/dependencies.mjs:218`) | each message names its subject; pinned strings updated                                                                                                                                                                                                                      | WO-048 FINAL-001 obs 8; WO-050 obs 5; WO-028, WO-031, WO-026, WO-030, WO-043 final reviews |
| A12   | publish handoff prints an unquoted `--title` and `worktree publish` drops words after the first (`scripts/resume.mjs:1045`, `scripts/worktree.mjs:355-368`)                                                                            | quoted placeholder; surplus positionals refused; fixture                                                                                                                                                                                                                    | WO-004 VER-002 G2                                                                          |
| A13   | the module-entry guard does not resolve symlinks in ten scripts (for example `scripts/resume.mjs:1158`)                                                                                                                                | one shared helper; one symlink fixture                                                                                                                                                                                                                                      | WO-018, WO-028, WO-030, WO-031 final reviews                                               |
| A14   | release tooling: a lightweight ancestral tag throws instead of printing a FAIL line (`scripts/release.mjs:470`); the uncommitted `check-surfaces` form cannot see untracked component source and says nothing (`:483-492`); the notes parser governs only level-two headings (`scripts/release-notes.mjs:115`); the equal-version refusal fetches before it validates while the text says it creates no tag (`scripts/release.mjs:1423-1425`) | a FAIL line; an "advisory: untracked source not compared" qualifier or the comparison; generated heading shapes refused at every level; the fetch uses a temporary ref or the sentence is corrected                                                                         | WO-041 FINAL-002; WO-023, WO-024 final reviews; WO-004 VER-002 G4                          |
| A15   | release and lifecycle suites: the remote-ref result is proved for tags only (`scripts/test-release.sh:1243`); "GitHub Release metadata differs" and first-parent ordering have no fixture; the AC19 reopen-source assertion sits where source equals latest (`scripts/test-resume.sh:330`); checkpoints asserted for two transitions only; the privacy canary never proves its wrapper ran (`scripts/test-resume.sh:768-777`); backup-intake gaps BK-1, 2, 4, 8 (`scripts/test-backup-intake.sh:29`, `:32`, `scripts/backup-intake.sh:59`); no newline-in-filename fixture for the NUL readers; the weakened private-body negative (`scripts/test-worktree.sh:372-377`) | each named assertion or fixture exists and fails when its subject is reverted (one reverted-subject transcript per item)                                                                                                                                                   | WO-004 VER-002; WO-024, WO-006, WO-003, WO-031, WO-012 reviews; WO-132 FINAL-001 item 2    |
| A16   | dead or duplicated code: unused import (`scripts/worktree.mjs:7`); `shellQuote` twice; `withTemporaryBody` twice (`scripts/release.mjs:1551-1564`, `scripts/worktree.mjs:100-113`); unreferenced exports `snapshotReader`, `currentReader`, `readReleaseNotesFile`; effort rendering computed twice (`scripts/resume.mjs:517-518`)                                  | one definition each; the unreferenced exports removed                                                                                                                                                                                                                        | WO-018 FINAL-001 finding 9; tree survey                                                    |
| A17   | the harness pinned-path pattern `[a-z-]+` would read a future runtime file with a digit, capital or underscore as unavailable (`scripts/lib/harness-runtime.mjs:27`); `scripts/reactor-identity.mjs` and `scripts/fixtures/historical-compiler-loader.mjs` are declared by no machinery suite | widened pattern with fixture; both declared under the suite that exercises them                                                                                                                                                                                             | WO-133 FINAL-002 O3; FINAL-001 item 7                                                      |
| A18   | the DCO sign-off match is case-sensitive on the email and its refusal gives no hint (`scripts/lib/contributions.mjs:28-33`)                                                                                                            | case-insensitive email comparison; the hint                                                                                                                                                                                                                                 | WO-038 FINAL-001 adjudication 3                                                            |
| A19   | tie-breaks that depend on the host locale (`scripts/lib/control.mjs:214`, `scripts/release.mjs:404`, `scripts/check-publication.mjs:476`, `packages/skeleton/src/audit.ts:1130`)                                                       | code-unit comparison; existing goldens unchanged                                                                                                                                                                                                                            | WO-007 FINAL-001 F-5                                                                       |
| A20   | package hygiene: (a) the console package imports three workspaces and declares none; (b) workspace `test` scripts delete `dist` beside the staged build (07 §Discipline, build publication) and the compiler README recommends one; (c) nothing asserts skeleton's exact workspace pins equal the workspace versions; (d) no `engines` field although the runner uses a Node 22 flag | (a) declared pins and a regenerated lockfile; (b) the scripts route through the root build or are removed with the README line; (c) the equality asserted inside `release check-surfaces`; (d) `engines.node`, the floor taken from the Node documentation for `--test-skip-pattern` | tree survey                                                                                |
| A21   | the process-meter table in a pull-request body names no observation cutoff (`scripts/lib/meta.mjs:964-970`) although 07 requires source and cutoff                                                                                   | one caption line                                                                                                                                                                                                                                                            | WO-043 FINAL-001 obs 3                                                                     |
| A22   | probes and evidence helpers: the host probe checks 11 of the 15 flags the transport passes (`scripts/probe-worker-hosts.mjs:70-82`); `/private/tmp` literals in three scripts; `--reproduce-survivors` has no closing baseline (`corpus/mutation/mutate.mjs:858-866`); `measure-gates` prints "outside the sandbox; actor-attested" as a literal (`scripts/measure-gates.mjs:144`); `feedback-evidence` usage does not say `--record-selfhost` needs `--write` first | the four missing flags; `realpathSync(tmpdir())`; the closing baseline; `unknown` unless observed; the hint                                                                                                                                                                 | WO-009 FINAL-001; WO-108 VER-001 O2; WO-128 FINAL-001 item 2; WO-047 FINAL-001 obs 10      |
| A23   | 20 of 44 suites print the generic `protects` text although the README says `--list` explains each suite (`scripts/test-runner.mjs:234-238`); `test:full` and `evidence:artifact` are documented nowhere                               | a protection sentence per suite; each alias documented or removed                                                                                                                                                                                                           | tree survey                                                                                |

### Part B — packages

| Row    | Defect observed (path)                                                                                                                                                                                                                                                  | Required result                                                                                                                                                                                                                                   | Source                                                                  |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| B1 ★   | every non-runtime advisory shares the once-per-session marker `classification`, so the Stop completion advisory was silent in four consecutive sessions (`packages/skeleton/src/harness-host.ts:3180-3188`, `packages/compiler/src/harness.ts:21-34`); untyped hook errors, including an outside-worktree read, are classed `runtime-unavailable` and can claim that marker (`harness-host.ts:3106-3114`) | the marker is keyed by advisory identity; a typed observer-input class keeps such errors out of `runtime-unavailable`; fixture: two distinct advisories in one session both appear once, twenty repeats of one appear once; 07 names which advisories share a key | WO-133 FINAL-002 carried finding and O1; WO-133 D005 nomination         |
| B2 ★   | observed facts: (a) a background `Bash` dispatch is never journaled (`packages/skeleton/src/observed-facts.ts:109`); (b) a task whose completion notice arrived keeps state `dispatched` with growing elapsed (`:194`), reproduced in the 2026-09-19 planning session for all eight tasks; (c) background rows carry no work order or phase (`harness-host.ts:2834-2842`); (d) the Claude briefing prints `unknown (session-identity-unavailable)` beside a hook-supplied block (`scripts/lib/harness-runtime.mjs:103-104`); (e) the cap refusal prints a minimum count without "at least" (`packages/skeleton/src/subagent-budget.ts:255`) | each corrected with a regression in `scripts/test-observed-facts.mjs` or the budget tests                                                                                                                                                         | WO-141 VER-001 F1, FINAL-001 O2, O3, O5; WO-139 FINAL-002 item 7        |
| B3     | during a live gate the guard admits nine programs and refuses `git status`, `git log`, `git diff`, `tail`, `wc`, `ps` and line-range `sed -n` (`packages/skeleton/src/harness-command.ts:370-381`)                                                                       | a bounded read list, each program with a flag allowlist and a fixture pair (the read form admitted, a write-capable form of the same program refused); `find`, `node -e` and any `sed` script other than a bare line-range print stay refused; WO-132's under-refusal history is the standard | WO-132 VER-001 F2; WO-133 FINAL-002 O7; WO-137 and WO-141 final reviews |
| B4     | the refuter result schema lets every finding omit what the validator requires (`packages/skeleton/src/plan-refutation-protocol.ts:622` against `:508-511`); a rejected result is deleted with its temporary directory (`plan-refutation-host.ts:59`, `:86-90`); a Codex dispatch fails in a directory that is not a repository (`:39`) | the schema states the conditional requirement; a rejected result and statement are retained in the ignored local lane and the refusal names the path; the Codex launch works from the temporary directory; fixtures                                | vision-into-use §13 boy-scout items (unowned)                           |
| B5     | subagent cap tests: the only generated-hook `agent_id` case runs after the counter is deleted (`scripts/test-harness.mjs:514`); concurrency is tested at cap one only; a missing `tool_use_id` and a resumed agent are untested                                         | the named cases                                                                                                                                                                                                                                   | WO-139 FINAL-002 items 2 and 4                                          |
| B6     | no test pins that `harness.mjs read-output .env` delegates to the host (`scripts/test-harness.mjs:1677`); two `assert.doesNotThrow` lines cannot fail alone (`packages/skeleton/test/worker.test.ts:180`, `:183`); dead export `lifecycleRequiredChecks` (`packages/skeleton/src/gate-evidence.mjs:820`); version masks that target literals now in `version.ts` (`packages/skeleton/src/evidence-editions.mjs:146-155`) | the delegation pin; value assertions; the export removed; the masks removed or pointed at `version.ts` after confirming no historical edition comparison reads them                                                                                | WO-132 FINAL-001 items 3, 4, 6; WO-133 FINAL-002 O4                     |
| B7 ★   | the verifier's summary bound of 320 is enforced by the parser and stated in neither the result schema nor the prompt (`packages/skeleton/src/verification-protocol.ts:157`, `:361`), a recorded cause of rejected live returns, ahead of WO-056's live verifier          | `maxLength` and one prompt sentence; a bounded rejection diagnostic; the verification edition regenerated                                                                                                                                         | WO-038 FINAL-001 adjudication 5; map evidence candidate                 |
| B8     | the feedback source projection lists three workspaces and omits console, so a console bump over-invalidates feedback editions (`packages/skeleton/src/feedback-audit.ts:79-84`); `discovery-cli.ts` is registered in one inventory of three                             | the list derives from the lockfile's workspace entries; `discovery-cli.ts` is registered in all three; both land before the one feedback edition                                                                                                   | WO-041 FINAL-002 item 3; WO-119 FINAL-001 O6                            |
| B9     | the Entropy Reducer support still says literal weakness first, against the operator's relationship-first correction (`packages/skeleton/src/loadouts/entropy-reducer.ts:723-731`; `docs/instance/entropy-reducer/README.md:24-26`)                                      | versioned support text; residue, compiler fixture and console input regenerated; the recorded run left as history; the pending notes in products 03 and 05 cleared                                                                                | map unallocated candidate (2026-09-04)                                  |
| B10    | the actor board's "other verifier attempts are lease-expired" loop iterates zero rows (`packages/console/test/board.test.ts:367-381`)                                                                                                                                   | a fixture-local store with at least two verifier attempts; the test asserts the loop ran                                                                                                                                                          | WO-039 FINAL-002 F1                                                     |
| B11    | kernel hygiene pair: `appendEvent` decodes the log it extends and never the draft it writes (`packages/kernel/src/store.ts:153-160`); the `stepProgram` default branch throws without the kind and has no pin (`packages/kernel/src/core.ts:239`)                       | the assigned envelope is validated before the write; the message names the kind; both pinned                                                                                                                                                      | R1 replan decision 10; WO-045 and WO-046 final reviews                  |
| B12 ★  | resident: (a) `scope.changeSize` overwrites `scope.budget` on a shared key (`packages/skeleton/src/resident-state.ts:202-205`); (b) NoOp dedupe is keyed on the reason string alone (`packages/skeleton/src/resident-host.ts:134`)                                       | (a) the minimum of the two with a collision test; (b) the key carries the phase and arm generation; only (a) is starred                                                                                                                           | WO-068 FINAL-001 F2, F3                                                 |
| B13    | `scenario.ts` is 750 lines against a bound of 751 and the decided extraction had no owner (`packages/skeleton/src/scenario.ts:189`)                                                                                                                                     | `LiveReactorDriver` in its own module; the bound unchanged; no behavior change                                                                                                                                                                    | R1 replan decision 8; WO-047 FINAL-001 F1                               |
| B14    | test pins: the AC3 coupling grep misses alias and destructure forms (`packages/kernel/test/ac2-replay-store.test.ts:305-317`); the read-inventory tripwire misses a module-local rebinding (`packages/skeleton/test/worker-read-inventory.test.ts:28-53`); the `feedback-selfhost.ts` exemption has no positive pin (`packages/skeleton/test/reactor-slices.test.ts:274`); audit fold messages and the adjacency branch are asserted nowhere (`packages/skeleton/src/audit.ts:476`, `:493`, `:707`, `:748-750`); three WO-108 compiler findings survive (F-00005 to F-00007); the presence tooltip is regex-pinned with no non-discretionary fixture (`packages/compiler/test/presence.test.ts:340-356`) | each assertion or fixture added; none weakened                                                                                                                                                                                                    | WO-047, WO-048, WO-050, WO-007, WO-008, WO-067 final reviews            |
| B15    | diagnostics and small guards: the writer transition-lock refusal names no directory (`packages/skeleton/src/writer-teardown.mjs:48-51`); a malformed-receipt refusal leads with the log path (`packages/skeleton/src/worker-store.ts:264`); the `workerRequestKey` comment understates the key; `ultracode` is normalized in attestation only; the console `attempt` wrapper drops the cause (`packages/console/src/collect.ts:21-30`); one bad `*Loadout` export blanks the Builds panel (`packages/console/src/builds.ts:49`); the skeleton CLI ignores unknown arguments (`packages/skeleton/src/cli.ts:34-42`); the beacon staging sibling is neither ignored nor disposable (`packages/skeleton/src/beacon-io.mjs:215`); `verificationReactor` lives in `src` for one test; one unused import (`packages/skeleton/test/repair.test.ts:3`) | each corrected; unknown CLI arguments refuse                                                                                                                                                                                                      | WO-044, WO-048, WO-051, WO-049, WO-032, WO-020, WO-010, WO-055 reviews  |
| B16 ★  | boundary validators: (a) the lens-scope validator accepts `*`, `docs/*` and padded scopes while its comment says it rejects broad scopes (`packages/skeleton/src/loadouts/entropy-reducer.ts:1162-1180`), the screen in front of ignored intake; (b) a bare `*` pattern compiles claim-free with no diagnostic (`packages/compiler/src/compile.ts:515-545`); (c) the attribution predicate misses an `Assisted-by:` trailer (`packages/compiler/src/attribution.mjs:14`) | (a) the seven fixture strings of WO-023 FINAL-001 finding 5 refuse; (b) an empty prefix refuses with a fixture; (c) the trailer is refused and a human `Co-authored-by` still passes                                                              | WO-023 FINAL-001 findings 3 and 5; WO-011 FINAL-001 finding 3           |

### Part C — live documents

| Row | Stale claim (path)                                                                                                                                                                                                                                                                                                                  | Required result                                                                                                                              | Source                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| C1  | the README release block is 26 sentences against its own bound of fifteen and says hooks refuse three conditions (`README.md:94-159`)                                                                                                                                                                                               | rewritten within fifteen sentences, four refusals; 07 §Documentation freshness states that a "What runs today" write-back rewrites the block | WO-068 D004 (reopening observation fired)                |
| C2  | package READMEs name versions their packages left (`packages/compiler/README.md:1`, `:80`; `packages/skeleton/README.md:1`)                                                                                                                                                                                                         | current or version-free                                                                                                                      | WO-044 deferral; WO-055 FINAL-001 item 5                 |
| C3  | the playbook says hooks refuse two conditions and its planning section omits the planning-branch write refusal, the subagent cap and `plan -- amend-order` (`docs/PLAYBOOK.md:81-84`, `:123-143`); product 02 scopes the gate refusal to the reviewer's gate (`docs/product/02-domain-model.md:566`)                                  | the four refusals as CLAUDE.md states them                                                                                                   | planning survey; WO-132 FINAL-001 item 1                 |
| C4  | closed orders described as pending: `docs/product/03-architecture.md:659-663`, `:696`, `:744`, `:1425`, `:1544-1546`, `:1595`; `docs/product/02-domain-model.md:131`; `packages/skeleton/README.md:848-849`, `:932`; the roadmap's vertical section stops at WO-053 (`docs/product/06-roadmap.md:1549-1564`)                           | each sentence states the recorded outcome and cites its evidence                                                                             | tree survey; WO-051 FINAL-001                            |
| C5  | `worktree sync` is attributed to WO-033, a superseded umbrella (`docs/product/07-execution-guide.md:453`, `docs/PLAYBOOK.md:450`); `CONTRIBUTING.md:23` links a CLAUDE.md anchor that no longer exists                                                                                                                               | WO-079; the live anchor                                                                                                                      | tree survey                                              |
| C6  | three inaccurate sentences on the WO-139 mechanisms (`docs/product/07-execution-guide.md:781-782`, `:1192-1193`) and a doubled "and" (`:1577-1579`, `docs/AI-HARNESS-SECURITY.md:212-215`); the total-cap candidate omits that `SubagentStart` was observed and its ability to deny is untested                                       | corrected to the probe's record                                                                                                              | WO-139 FINAL-002 items 5 and 6                           |
| C7  | the refutation README documents two control events and the log holds a third, `PlanExecutionAmended` (`docs/planning/refutations/README.md:76-99`)                                                                                                                                                                                   | one paragraph                                                                                                                                | planning survey                                          |
| C8  | the harness runbook names Claude Code 2.1.274 and Codex CLI 0.154.0 (`docs/AI-HARNESS-SECURITY.md:8`, `:254`); the sessions run 2.1.277 and 0.155.0                                                                                                                                                                                  | a dated re-check note, scoped to what was re-checked                                                                                         | WO-135 D005 (reopening observation fired)                |
| C9  | `docs/work-orders/codex-downtime-series.md` recommends a closed order first and cites a line that moved                                                                                                                                                                                                                             | marked historical with its date                                                                                                              | planning survey                                          |
| C10 | probes: rule 5 of 07 §Research and guided-operator work orders requires a `probe:` command and four probe scripts have none; discovery checks run with `HOME` and `TMPDIR` inside the target root, undocumented (`packages/skeleton/src/discovery.ts:317-318`); two corpus tests sit outside every inventory (`corpus/README.md:29-38`); `environment.json` uses an undeclared label | rule 5 admits a probe script invoked by path and named in its order (planning decision 7); one runbook sentence; the two tests listed; the label declared | WO-136 and WO-137 final reviews; WO-119 FINAL-001 O5     |

### Part D — local residue

| Row | Observed                                                                                                                                                                                                                                                                      | Required result                                                                                                                                                                                                                                                       | Source                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| D1  | 27 harness snapshots (80 MB) where the manifest pins one; 18 `.advisory` markers; 96 MB under `.git/dotln/suite-success` that no source writes, while `scripts/test-harness.mjs:1073-1075` still alternates on its name; 46 MB of retained close lanes; nothing prunes any | `node scripts/harness.mjs prune` lists by default and deletes only with `--apply`: snapshots no installed manifest pins, markers of ended sessions, the dead cache, and a retained lane only when its order's release is published and its byte proof is kept; a live session's files are never touched; fixtures in a temporary root | 07 §Candidate — local lane retention (threshold fired); WO-133 FINAL-002 O6 |

**Acceptance criteria (all required)**

1. `docs/evidence/WO-142/rows.md` lists every row with one state and the
   command or file that shows it. Each `fixed` row's named check fails when
   its subject is reverted (shown once per row group by a reverted-subject
   transcript or an existing mutant). Each `not-reproduced` row records the
   observation made before any edit. At most six rows are `returned`, none
   starred, each with its observed reason and a public follow-up record.
2. Register: a fixture decision without a follow-up creates no pending row
   and one with a follow-up does; `npm run plan -- followups` on the merged
   tree reports the untriaged count, and the order's decisions file records
   it beside the 2026-09-19 figures (364 before the planning pass settled the
   register, zero after).
3. Carried set: with only a title's version parenthetical changed since the
   latest receipt, `npm run plan -- refute` lists the order as carried; no
   order carried before this change is evicted by it.
4. Hooks: the generated hook set passes `harness check`; the two-advisory
   fixture and the read-list fixture pairs pass; a second writer, a live-gate
   write, a planning-branch source write and a cap breach are still refused.
5. `harness prune` without `--apply` deletes nothing (asserted by a byte
   listing before and after); with `--apply` in the fixture root it removes
   exactly the listed paths. The operator runs the listing on the real
   checkout once and the decisions file records the before and after sizes.
6. Write-backs land: 07 §Candidate — follow-up register settlement and
   §Candidate — local lane retention (results, each heading kept), 07
   §Discipline (the advisory key; the read list), 07 §Documentation freshness
   (row C1), products 03 and 05 (row B9), component READMEs, the decisions
   file with the before and after observations this order's Cost line names;
   `npm run publication:check` passes.
7. `npm test` green once at final review; `npm run test:docs` green;
   `git diff --check` clean; no new dependency; no new suppression.

**Evidence gate:** the rows file and its transcripts; the fixture suites the
rows name; one live feedback edition; `npm test` once at final review. The
next planning pass's feed size, the next refutation's carried set and the
next reviewer session's gate-time commands are the reopening observations.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for operator ideation and planning
synthesis. Record corrections the same day as what was misread, meant and
changed.

**Non-goals:** anything in `packages/skeleton/src/reactor.ts` (the
unreachable continuation guard, the append-only `repairPlans`, the one `any`);
worker-input changes (the writer's auto-memory flag, the `ultra` writer's
multi-agent flag, the absolute store path in the worker prompt); the inert
Seiri evidence gate; beacon command routing; deriving the harness runtime pin
list; the mutation `--check` inside `npm test`; removing the WO-043
dependency-migration path; the append-lock recovery wedge (its own order);
profile re-probes; a home-path screen for reports; a second sign-off-exempt
identity; the `fastGateMs` ceiling; Git checkpoint refs and stashes; the
ledger (WO-084), the capability table (WO-089) and the guide's structure
(WO-090).

**Operator-review assumptions**

1. One order, not several: the rows share one bundle, one edition and one
   gate, and the row file makes partial states visible instead of hiding
   them. If the executor's first day shows the breadth is wrong, Parts A and
   C split from B and D with no row changed.
2. B3 widens an enforcement allowlist inside a cleanup order because nine
   sessions reported the cost; if the operator prefers it judged alone, it
   is returned and filed separately without touching the other rows.
3. D1 deletes only after the operator has seen the listing; retained close
   lanes are pruned only with their byte proof kept.
4. A minor release is acceptable for four narrowed inputs.
