# Standard planning pass, 2026-10-19

## 1. Subject, authority and provenance

The operator opened `planning:` with no further text on 2026-10-19 at
13:14Z in Claude Code (Fable 5.1, effort max, host-selected). The dispatch
is captured verbatim in ignored intake
(`docs/intake/notes/planning-standard-pass-2026-10-19.md`, SHA-256
`c41f303ccdffd4c8f4d7e7e2b8d75287adb03bc04e0612f1ce56aaa47523f39e`), a
sibling record, never a source to mine. The subject is the register's
existing rows, the failures and conditions since receipt 047, WO-221's
close and the dated requests to core that the operator's instance (the
fork, checked out as `DotLn-Instance`) kept in its own committed planning
document of 2026-10-18, read on the operator's machine without a write.
This document is planner synthesis of public repository evidence; the
clean-room screen found no suspect material: the fork is the operator's
own public instance, and no target or employer material enters.

Entry was clean `main` at `f577979e`, WO-221 closed (v0.85.0, released
2026-10-19T13:12Z with the starter refreshed and tagged) and no active
order. The pass runs on `planning/2026-10-19-standard-pass`, created by
`plan start`. Only the parent writes this planning checkout.

Fan-out, planned against `subagentCap` 20 with 0 admissions observed at
entry: one background refuter after the subject is committed; no research
worker, because every input is a repository record, the fork's committed
document or this checkout's gate index. The planner wrote every artifact.

Aim, as read: retire WO-221 from the sequence, place the rows its close
boarded, re-dispose every reopening condition that fired since receipt
047, and decide the gate-cost order WO-221 D019 deferred to planning.
Traps named before the material choices: filing one order per finding
(the fixed cycle is the cost, so WO-221's 33 findings go to the batch that
owns their subsystem); reading the fork's dated notes as operator direction
(they are evidence; each disposition here carries its own reopening
condition); accepting the lane inference of §4 as a measured gain (the
order's acceptance is a before-and-after series, not the estimate); and
the NoOp of leaving D019 deferred, which every later order would pay at
each complete run.

## 2. Entry observations

`plan start` and `plan failures` in the window since receipt 047
(2026-10-18T16:40Z): 1 failed verification (WO-221 VER-001), 1 failed
final review (FINAL-001, 20 escapes), 2 repairs, 1 order made ready, 1
failed first verification, 0 corrections, 0 off-ramps and 4 execution
amendments (WO-221 D016 recorded twice, D017 and D028). FINAL-002 recorded
13 escapes; the sixteen measured final reviews of the ten most recent
orders recorded 158 escapes, 9.9 per review. Local records: 1 release
close, 0 host denials, 4 interventions (2 at release close classed as
direction, 2 unclassified), 3 long phases (all WO-221), 0 repeated gate
runs at a green identity, and the eight recent closes split six delivery
and two machinery. The record totals stand at 147 failed verifications,
22 failed final reviews, 172 repairs, 178 orders made ready, 86 failed
first verifications, 181 corrections, 6 off-ramps and 76 amendments.

Canonical status reads `closed`, VER-003 pass, FINAL-002 pass, legal next
`release-close, next, activate` (the close ran: the tag, the Release and
the starter's v0.85.0 exist). Process health: no budget breach; WO-221
tokens 319,282,941; first verification failed in 6 of the last 8 closed
orders; one reopen candidate (WO-150-D003). WO-221's phases from the
control events: implementation 523 minutes against a 74-minute median,
verification 52 against 17, repair 82 against 44, final review 47 against
25; the order closed about twenty and a half hours after receipt 047. The
register held 164 pending rows at entry: 1 open, 8 untriaged (seven boarded
by WO-221's close, one from WO-216 D035) and 155 deferred, of 1,189 rows.
No reader run is due.

**Routing the failed reports.**

- **WO-221 VER-001** (criteria 2, 3, 6 and 9): two acceptance mismatches
  and two defects. Criteria 2 and 3 fixed a host configuration form the
  planner had written from a documentation read (ownership markers inside
  `.claude/settings.local.json`; per-repository prefix rules in
  `.codex/config.toml`) that neither host supports (D002, D024, D025); the
  verifier failed them as written and the operator's amendment replaced
  them (D028). Carried: the planning screen in §11. Criteria 6 and 9 were
  repairable defects (already-ignored base material escaping the close
  judgment; a release retry adopting a moved tag), repaired (D022, D023,
  D030, D031).
- **WO-221 FINAL-001**: the base ignore judgment's spawn had no output
  buffer, so a populated ignored base tree made the close refuse, a state
  main's close completed; reproduced with 20,000 files and repaired (D038,
  D039). The review boarded nineteen follow-ups; §5 places them.
- **The three operator scope expansions and the recovery contract** (D016
  to D020) changed the gate process mid-order: the bounded wrapper applies
  no probe deadline to a complete selection; every phase reuses the passing
  complete row at an unchanged code identity; the complete run leads with
  changed and failed suites and the focused-before-complete refusal is
  removed; completion consumes validation and runs no gate. Product 07
  carries them (WO-221's write-backs); one passage of the planning section
  still stated the WO-216 rule they replaced, which §11 corrects.
- **The long phases** are the order's own record: three failed complete
  runs, one stopped at the wrapper's deadline and a forty-minute focused
  sequence before any passing run (D018's evidence), then the repairs.

## 3. Reopening observations

`plan conditions` at 13:15Z (34.7 s; load 3.0 on 16 CPUs):

| Measure | Observation | Threshold | Holds |
| --- | --- | --- | --- |
| Plan check, median of three | 3.277 s | 8 s | no |
| Release table lag | 1 tag | 3 tags | no |
| Latest two closed orders, distinct evidence blob bytes | 469,961 and 571,216 | 1 MB in two consecutive orders | no |
| Evidence path growth since Monday 00:00 UTC | 1,075,594 bytes | 10 MB | no |
| collectSources | 0.804 s | 3 s | no |
| Uncached release listing | 3.560 s | 10 s | no |
| status --all --json | 6,358,055 bytes | 32 MB | no |
| Work-order index | 1.879 s | 10 s | no |
| Document gate and docs-check (`--slow`) | not measured | 30 s / 15 s | unknown |
| Plain gate, thirty-day median | 293.3 s | 360 s | no |
| gate-task vertical | 722.7 s against a 753.9 s median (74 samples) | 1,130.8 s | no |
| gate-task vertical:file:test-vertical.mjs | 723.5 s, no earlier sample | none | unknown |
| gate-task target-worktree | 611.3 s against a 126.6 s median (38 samples) | 189.8 s | yes |
| coldStartBytes.executor | 29,214 | 24,576 (WO-150-D003) | yes; the ceiling is 29,246 |

**The target-worktree task.** The 2026-10-18 pass read its 502 s row as
the load of a complete run and set the condition that a fresh
`npm test -- --only target-worktree` row above 77 s outside a complete run
would make it worth an order. Two such rows exist: 517 s at
2026-10-18T22:29Z and 506 s at 23:53Z, and the suite ran 503 to 624 s in
every complete row of the window. WO-221 D009 put criterion 5's real-Git
cases in it; it is one 171,587-byte file of 38 tests under one deadline,
and in the passing run of 10:58Z it held one lane from second 29 to second
640 while the first exclusive suite waited for the lanes to drain. The
condition occurred; WO-222 takes the file split (§4).

**The cold start** is 29,214 bytes, up 671 since 2026-10-18 (WO-221's
release-close deletion sentence and the complete-run sentences), 32 bytes
under its 29,246 ceiling; the operator's reserved efficiency pass
(FUP-f1c7a256bec46737 stays open, unchanged reading). WO-219's known
issues now carry the number.

**WO-216's measured claim** (FUP-182984d482ca59ca, fired at WO-216's
close): its Cost line named three statistics with baselines, read by
planning over the five closes after it. The first close is WO-221, and the
gate index rows of this checkout in its window (2026-10-18T16:40Z to
2026-10-19T13:12Z) read: fifteen complete runs (four stopped, eight
failed, three passed) against a baseline of eleven per closed order; no
structural-class failure inside a run longer than two minutes against
1.3; and 691 gate task minutes against 545. Two of three are not below
their baseline at close one of five. The window is not an ordinary one:
the operator's three scope expansions changed the gate process mid-order,
each costing a complete run (D020's own account names three failed
complete runs, one stopped and a forty-minute focused sequence before any
of them), and the fail-fast lead ordering D018 added then ended the eight
failed runs in 5 to 18 minutes rather than 21 to 36. The reading continues
at the next four closes; the row is deferred with that condition (§9).

**The cold-gate row** (FUP-e96221b106cd136a, allocated to WO-216 with the
condition that the pass after its close reads the complete-run rows):
read in §4 and allocated to WO-222.

**FINAL-001's follow-ups** (FUP-3a4c476e4e8099bd, deferred by WO-221 D040
with the condition that the next planning pass places them): placed in
§5.

**The order-size rule** (product 07 §Operator-opened planning pass)
reopens when the complete run's median falls to half its 24.9 minutes or
merged orders fail first verification more often than five of eight. The
6 of 8 figure counts every closed order. One merged order has closed,
WO-210, and it failed its first verification: one observation against an
eight-order baseline, as the 2026-10-17 pass read it; the 2026-10-18
pass's sentence that no merged order had run overlooked WO-210, and this
pass corrects it. WO-221 was five mechanisms in one order rather than a
merge; VER-001 failed criteria of three of them (trust, the close, the
release) and FINAL-001 failed on the close alone while eleven criteria
held, so receipt 047's composition observation occurred and is recorded
here as one more observation for the rule, not as its trigger. Neither
condition is read as occurred.

**Receipt 047's seven known issues on WO-221**, read against FINAL-002 and
the close: the feedback edition (issue 1) did not change, the authority
edition was re-minted as WO-221/011 and no live episode was owed; the
blocked qualification rows (issue 2) are blocked because no episode ran and
no write-back states a host's outcome; the per-order relaunch on Codex and
Copilot (issue 3) was not observed, since no episode ran, and the release
notes name the step; the trust root widened from the session (issue 4) did
not occur as stated and is widened in substance by FINAL-002 F6, now a
WO-218 finding; irreversible deletion (issue 5) occurred only after a
person declares the misnamed directory the refusal names (F1), a WO-218
finding; the moved draft head (issue 6) occurred with Git's raw rejection
and no remedy (F13), a WO-218 finding; the composition cost (issue 7)
occurred twice, as above. The three live host qualifications stay
`blocked`, so WO-221's title claim is not yet shown on any host; the
fork's upgrade order is where it is first shown (§6).

**The 2026-10-18 NoOps due at WO-221's close**, re-read: a kit-default
draft at verified (no operator request, no second instance; holds); the
candidates for instance-declared routes, marked core-operator decisions
and a reviewer rule against override packets (no fork target close since,
WO-207 open, and WO-221's two final reviews offered no override; each
holds); kit deletion of remote branches (the forge setting is the fork's
WO-010; holds). The measure the 2026-10-18 pass asked this close to
reread, the operator's hand steps on the fork's next target order, cannot
be read yet: the fork's 2026-10-18 pass decided that its WO-005 waits for
the upgrade order that takes the starter at v0.85.0 (its D4 and D6), and
no target order has run there since WO-004. It is reread when one runs.

**Two passes ending with more pending rows** (FUP-74362527b75d12f5): the
2026-10-18 pass began at 160 and ended at 155; this pass begins at 164
(WO-221's close added nine rows) and ends at 159 (§9). The condition does
not fire.

## 4. The gate: WO-221's runs, the levers and WO-222

The complete rows of this checkout's gate index in WO-221's window, read
with `readGateChecks` and `gateCriticalPath`:

| Row (UTC) | Wall-clock | Outcome | First failure |
| --- | ---: | --- | --- |
| 2026-10-18 21:03 | 898 s | stopped | the probe wrapper's 900 s deadline (SIGTERM; D016) |
| 21:11 | 368 s | stopped | — |
| 21:46 | 1,250 s | failed | skeleton |
| 22:15 | 1,498 s | failed | target-worktree |
| 23:05 | 2,153 s | failed | launchpad:file:test-launchpad-export.mjs (D019's measurement row) |
| 23:31 | 598 s | stopped | — |
| 2026-10-19 00:31 | 848 s | stopped | — (the run after the forty-minute focused sequence, D018) |
| 02:00 | 301 s | failed | harness-fixtures |
| 02:07 | 299 s | failed | harness-fixtures |
| 02:15 | 400 s | failed | process-debt |
| 02:29 | 661 s | failed | skeleton |
| 03:15 | 2,538 s | passed | — (VER-001's standing row) |
| 07:55 | 2,238 s | passed | — (FINAL-001's standing row) |
| 10:10 | 1,053 s | failed | target-worktree |
| 10:58 | 2,757 s | passed | — (VER-003's and FINAL-002's row) |

Fifteen runs, 297.7 minutes of complete-run wall-clock for one order.
After D018's lead ordering (from 02:00Z) a failed run ended in 5 to 18
minutes; before it, in 21 to 36. The passing runs took 37 to 46 minutes.

The passing row of 10:58Z, task by task: 2,757 s of wall-clock for 4,840 s
of task work, so 1.76 of the four lanes were busy on average, with 129 ms
of scheduler wait on the critical path. `harness-fixtures` (292 s),
`process-debt` (103 s) and `worktree-integration` (167 s) each held all
four lanes alone, 562 s in which three lanes idled. `target-worktree` ran
611 s on one lane from second 29, and `harness-fixtures` started at second
640: the exclusive row waited for it. The four vertical files ran at two
slots each (465, 299, 446 and 355 s), `skeleton` 253 s, the launchpad
update and export files 239 and 154 s, `launchpad-planning` 220 s,
`sync-fixtures` 162 s, `worktree` 126 s, `target-publish` 121 s,
`runner-fixtures` 113 s. Peak gate RSS was 2.85 GB and peak footprint
1.97 GB against a 25.8 GB gate share on a 51.5 GB host; the largest single
task, `runner-fixtures`, peaked at 1.43 GB. The critical path ran through
the structural phase, the build, `target-worktree`, the three exclusive
suites, `skeleton`, the kernel and compiler packages, two vertical files
and the launchpad update file. D019's row of 23:05Z read the same shape
with about 5,700 lane-seconds, 328 ms idle, a 526 s convoy and 514 s of
mixed work bounded by `target-worktree`.

The levers, in the order D019 gave them, with what the code fixes today:
the lane count (`scheduleSuites` defaults to the lesser of four and half
the parallelism and refuses more, lines 1927 to 1946; `acquireHostLanes`
refuses any capacity but four; `DEFAULT_MEMORY.hostLanes` is four;
`gateLoad` refuses a concurrency above four and scales each deadline by
two per peer slot); overlap of light suites with the three exclusive rows
(an `isolated` row reserves every lane, and the exclusive flag's comment
says its bounds were measured alone); the vertical's share (four files at
two slots each, which eight lanes would run at once); and, from §3, the
`target-worktree` file split. The memory the gate share allows (25.8 GB)
is eighteen times the largest task peak, so eight lanes at a per-lane
budget of 3.2 GB keep more than twice the headroom of the largest task.
The inference from the timeline is that the mixed phases pack onto eight
lanes and the convoy stops idling three, so a passing run falls from
about 46 to about 30 minutes; it is an inference, and D019 asked for
before-and-after timelines from `scripts/measure-gates.mjs`.

WO-222 is filed with that instrument as its acceptance: the before series
is the three passing rows above, the after series three fresh complete
runs at the handoff identity on the same machine, and each lever is kept
only when the after median is at least one fifth below the before median
and no task ended at its deadline; a lever the series does not justify
ships in its old form with the series recorded, so the order closes
truthfully either way. It owes one live feedback episode because
`gate-deadlines.mjs` and `host-resources.mjs` are judged sources, and the
deterministic re-mints of the editions that register them. Rejected: adding
D019's row to WO-217 (axis: one outcome; a measured lever beside 35 defect
fixes would be judged as one); placing WO-222 after the batches (axis:
where the saving lands; each batch pays the complete run several times, and
WO-221 paid fifteen); taking the levers on the inference (axis: evidence;
the series decides). The NoOp cost is the status quo: about 46 minutes per
passing complete run and the failed runs beside them, at each of the
sixteen queued orders.

Two risks are named in the order rather than solved here: deadlines under
eight lanes of CPU contention are derived by the existing rule (the solo
baseline times two per peer slot) and a task ending at its deadline in the
after series keeps the lever off; and the host-lane registry must record
one capacity for every clone on the host, which the order gives it.

## 5. WO-221's follow-ups placed

WO-221's close boarded seven register rows holding 33 findings, all on
the target-order lifecycle: the subsystem WO-221 built and WO-218 owns
(the instance lifecycle, publication, release close, the starter and
worktrees). Each row goes to WO-218 and its findings to the order's steps
by surface:

| Row | Source | Surfaces and steps in WO-218 |
| --- | --- | --- |
| FUP-3a4c476e4e8099bd | FINAL-001 F2 to F9, F12 to F18 (D038, D040) | F2 to F5 and the hook half of F12: `registeredTargetAdmission` (step 17); F6, F7, F8, F17: `scripts/release.mjs` (step 3); F9 and the draft half of F12: `target-publish.mjs` (step 18); F13 to F16: the literal fallback (step 14); F18: `starter-refresh.mjs` (step 19) |
| FUP-f64c4d8ab41f49d4 | FINAL-002 F1 to F13 (D045) | F1, F2, F3, F5: the close (step 15); F4: the starter refresh (step 19); F6, F7, F9: the admission (step 17); F8: the literal fallback (step 14); F10, F13: the draft (step 18); F11: `gate-reuse.mjs` and F12: `test-verifier-gate-claims.mjs` (step 20) |
| FUP-309c72a92ff260ce | VER-002 F2 (D036) | the settings file validated before the first irreversible step of start and close (steps 14, 15) |
| FUP-fb62261f3877a5cb | VER-002 F1 (D035) | the per-order Codex rules file excused from main's cleanliness check (step 14) |
| FUP-cb738250f386b071 | VER-003 (D041) | the over-ceiling refusal text, with `scripts/lib/git.mjs` (step 15) |
| FUP-4c9a576536de99ff | VER-003 (D042) | an unwritable declared directory (step 15) |
| FUP-f32886b04703d3db | D040, reopened by D043 | the null-advisory masquerade at close (steps 3, 15) |

The admission findings edit `registeredTargetAdmission` in
`harness-host.ts`, a registered source of the authority, feedback and
harness editions, so WO-218 re-mints each staled edition; receipt 047 read
`FEEDBACK_SOURCE_PATHS` as naming none of these surfaces, which the
executor re-reads at its base. WO-219 edits the same file after WO-218
and rebases on it, which its known issues now say.

WO-218's criterion 4 is rewritten by this pass to the form receipt 046's
known issue said an activation amendment would give it: `--touching` over
the order's changed files lists no row of this order's list that is still
pending, and a row of another batch or a candidate row it lists is left as
it is and named in the README. WO-219's criterion 4 is rewritten the same
way. WO-217 and WO-220 are not amended, so their verdicts carry by hash
and their criterion 4 keeps the activation route (§10).

The two review rows carry 15 and 13 findings; WO-218 settles each row
when every finding has its case or its recorded decline, with a
per-finding table in its README (step 24). The batch grows from 32 to 42
rows and from 20 to 28 steps, with `harness-fixtures`, `runner-fixtures`,
`resume`, `work-orders-fixtures` and `outward-lint` added to its Preflight
line for the new steps.

## 6. The fork's requests to core

The fork's planning pass of 2026-10-18 consumed core's prompt (the
2026-10-18 pass, Appendix A) and kept its kit-level needs as dated notes in
§10 of its planning document, to be carried into a core planning pass
until WO-193 lands the channel. The operator did not carry them in this
dispatch; this pass read the committed document on the operator's machine
and treats each note as evidence with its own disposition, never as
operator direction. Each became a candidate in the map (the 2026-10-19
section) and a register row:

| Note | Reading | Disposition |
| --- | --- | --- |
| `plan conditions` in an instance: ten rows unknown for absent core sources, one hold against a one-sample median | planning machinery; the command's own output | allocated to WO-219 (FUP-10996fedecfde047) |
| `status --json` and `current.md` name a target order's moved report paths after `target-records` | the target-order lifecycle; the projection in `scripts/resume.mjs` | allocated to WO-218 (FUP-3c5f5a2bdbe06c07) |
| `historicalDependencyIds` hard-codes core's WO-001 and WO-002 | confirmed at `scripts/lib/dependencies.mjs` line 6 | allocated to WO-218 (FUP-47eb4d9bdf4cbfa1) |
| the outward lint refuses a title opening with a gitmoji | not reproduced here; core's own titles open with one | allocated to WO-218 to reproduce or decline with the output (FUP-98aeb43c543dfbaf) |
| `followups --apply` refuses the host scratchpad the role grants | reproduced by this pass: the batch of §9 was refused from the session scratch and applied from the ignored control lane | allocated to WO-219 (FUP-dadc66e1f81f83a5) |
| a chain of target orders needs one pass per member for its base | a feature of target orders; no chain has run | deferred (FUP-c779cf907c180c40) |
| a `repo.settings` effect in the authority profile | the fork's WO-010 applies the setting under host permissions | deferred (FUP-338bcbd293351a82) |
| session and order status for a console, with a direction channel | WO-193's channel and the console view model, both queued | deferred (FUP-280abd447f789958) |
| `plan start` dates the branch in UTC | every control record is UTC | declined (FUP-8259cdfb8c390498) |

Two notes need nothing: the close's remark that deleting a draft's remote
branch is outside the role disappears with WO-221's reused draft branch
and the fork's head-branch setting, and the draft at verified is WO-221's
opt-in form. The fork's D4 waits for the starter at the revision carrying
WO-221; the refresh of 13:12Z put v0.85.0 there with its tag and Release,
so the fork's upgrade order (its candidate C1) can file.

## 7. Orders filed and amended

- [WO-222](../work-orders/WO-222-the-complete-run-fits-the-machine.md),
  filed: lanes from the host under a memory budget per lane, light peers
  beside the three exclusive suites, the `target-worktree` file split, the
  before and after series as the acceptance. Cost, provenance, the
  rejected alternatives with their axes and the execution plan are in the
  order.
- [WO-218](../work-orders/WO-218-boarded-follow-ups-the-instance-and-publication.md),
  amended: ten rows added (42), the per-finding routing of §5, surfaces
  and Preflight suites extended, steps 17 to 24 added, criterion 4
  rewritten, receipt 046's known issues moved from the catalog row into
  the order, one operator-review assumption added.
- [WO-219](../work-orders/WO-219-boarded-follow-ups-records-roles-and-the-harness.md),
  amended: two rows added (43), step 16 added, criterion 4 rewritten,
  receipts 046 and 047's known issues moved into the order, the rebase on
  WO-218 recorded.
- WO-217 and WO-220: unchanged.

## 8. The sequence

WO-221 leaves the list (closed, v0.85.0). WO-222 is placed first, before
WO-217, because every later order pays the complete run several times; the
operator may move it by one sequence edit. The batches and the focus orders
follow unchanged. The sequence's paragraph on the fork's next target order
now says that the order has not run and that the hand-step count is reread
when it does. The paragraph on the batches names the pass that cut them
and the rows the two later passes added.

## 9. The register

Twenty dispositions, applied as one batch at revision `a7fb7497…` (the
request was refused from the session scratch, the fork's note of §6, and
applied from the ignored control lane); the register is at `4301a832…`
after the sync.

| Row | Disposition | Target |
| --- | --- | --- |
| FUP-1dce3a6f7ac60eac (WO-221 D019, the gate-cost order) | allocated | WO-222 |
| FUP-e96221b106cd136a (cold-gate structural cuts; WO-216 closed and the rows read) | allocated | WO-222 |
| FUP-182984d482ca59ca (WO-216's measured claim; close one of five read) | deferred: reread at each of the next four closes | — |
| FUP-3a4c476e4e8099bd (FINAL-001's follow-ups; the next planning pass places them) | allocated | WO-218 |
| FUP-f64c4d8ab41f49d4 (FINAL-002's thirteen follow-ups) | allocated | WO-218 |
| FUP-309c72a92ff260ce, FUP-fb62261f3877a5cb, FUP-cb738250f386b071, FUP-4c9a576536de99ff, FUP-f32886b04703d3db (WO-221's verification follow-ups) | allocated | WO-218 |
| FUP-ff2dbefe3e73a657 (WO-216 D035, the override record) | settled: its two actions are FUP-851cba3a914ab359 in WO-217 and FUP-b0418fa8b09362be in WO-219 | — |
| FUP-3c5f5a2bdbe06c07, FUP-47eb4d9bdf4cbfa1, FUP-98aeb43c543dfbaf (the fork's kit defects) | allocated | WO-218 |
| FUP-10996fedecfde047, FUP-dadc66e1f81f83a5 (the fork's planning-machinery defects) | allocated | WO-219 |
| FUP-c779cf907c180c40, FUP-338bcbd293351a82, FUP-280abd447f789958 (the fork's features) | deferred with their conditions | — |
| FUP-8259cdfb8c390498 (UTC branch dates) | declined | — |
| FUP-f1c7a256bec46737 (cold start) | kept open as the operator's reserved efficiency pass (unchanged reading) | — |

Pending rows: 164 at entry, 173 after the nine candidates were minted, 159
after the batch (1 open, 158 deferred, 0 untriaged), of 1,198 rows.

## 10. Decisions and NoOp records

Prose records in the `NoOpIntent` shape: `kind: NoOp`, a `reason`, cited
`evidence`, `reevaluation` cadence and `usefulWhen` condition.

| NoOp | reason and evidence | reevaluation | usefulWhen |
| --- | --- | --- | --- |
| Reopening the order-size rule | The 6 of 8 figure counts every order; one merged order has closed (WO-210, first verification failed), one observation against eight; WO-221's composition cost is recorded as an observation. Evidence: §3. | Each planning pass. | Merged orders fail first verification more often than five of eight, or the complete run's median halves. |
| An order per fork request | The three kit defects and two planning-machinery defects go to the batches that own their surfaces; the three features wait for a second instance or the order that builds their surface. Evidence: §6. | At WO-218's and WO-219's close. | A fork request names a surface no batch owns, or the operator carries one with a direction. |
| Adding D019's row to WO-217 | One outcome per order: a measured lever beside 35 defect fixes would be judged as one; WO-222 stands alone with the series as its acceptance. Evidence: §4. | At WO-222's close. | The series shows no lever worth keeping, in which case the next batch editing the runner takes what remains. |
| Placing WO-222 after the batches | Each batch pays the complete run several times (WO-221 paid fifteen); the saving lands at every order after WO-222. Evidence: §4. | On the operator's sequence edit. | The operator wants a batch first. |
| Amending WO-217 and WO-220 for criterion 4 | Their verdicts carry by hash; the activation amendment receipt 046 planned remains their route. Evidence: §5. | When either is next amended, or at its activation. | A pass amends either for another reason. |
| A research worker for the fork's notes | Each note names its record; the one code claim this pass could check (`dependencies.mjs` line 6) was checked inline and the lint claim is routed to a fixture. Evidence: §6. | Each pass that reads the fork. | A note needs a host page or a run this pass cannot read. |
| A reader run | Profile unchanged; `plan start` reported none due. | Every planning entry. | A changed profile with three unscored releases, or the operator's word. |
| Re-recording the open cold-start row | 29,214 against 24,576; the operator's reserved efficiency pass. Evidence: §3. | Every planning entry. | A role text changes the reading, or the operator opens the efficiency pass. |
| Re-issuing the fork a prompt | The fork's 2026-10-18 pass consumed Appendix A and decided each item; its upgrade order files when the starter carries WO-221, which it does since 13:12Z. Evidence: §6. | At the fork's next pass. | The fork asks, or a core change needs a fork decision. |
| The 2026-10-18 NoOps due at WO-221's close | Each holds (§3); the hand-step count waits for the fork's next target order. | At the fork's next target close. | As each records. |

Bounded cleanup in the map, recorded: the 2026-10-18 pass had placed
receipt 047's known issues for WO-217, WO-219 and WO-221 in an extra
seventh cell of their catalog rows; this pass folded each into the
preflight cell, moved WO-218's and WO-219's known issues into the orders it
amended, and left WO-217's on its row.

## 11. Write-backs

Product 07, three passages: §Operator-opened planning pass, the
order-size paragraph, which still said every order pays the complete gate
fresh at final review whether or not main moved, now says that final
review reuses the passing complete row at the integrated identity and pays
a fresh run only when the identity changed (WO-221 D017), with the pair
cost WO-078 measured; the two-screens paragraph gains the host-form screen
from VER-001's cause (§2); and §Preflight before the full gate's measured
claim gains the first-close reading of §3. The roadmap's generated release
table was refreshed inside its exempt block
(`npm run release -- list --markdown --write`; 170 tags, v0.85.0 added).
The idea ledger gains this pass's registration heading. The publication
check reported the software-engineer edition's lock stale after the
product 07 edit; `npm run sync` refreshed it, and `npm run publication:check`
passes.

## 12. Document ceilings

Product 07 grew to 223,848 non-exempt bytes (from 213,853): WO-221's
write-backs under the three scope expansions and the target close, and
this pass's three passages. Its ceiling is set to 246,232 with this
section as the decision. Every other document is unchanged since the
2026-10-17 pass and keeps its ceiling. No order carries a byte bound.

## 13. Goal alignment and cost

The win condition the sequence names is progress in core, the starter,
the fork, DotLn-Angular and the rest at the same time, without
babysitting, with feedback and bugs routed to where they belong and acted
on. This pass routes the fork's nine notes without the operator carrying
them, places WO-221's 33 findings where one order resolves them, and files
the one order that shortens the gate every later order pays. Cost: one
order cycle for WO-222 ahead of the batches, with its three-run after
series and one live feedback episode; WO-218 grows by ten rows and WO-219
by two. The NoOp would leave every queued order paying about 46 minutes
per passing complete run and the fork's notes waiting on memory.
`npm run meta -- --plan-cost` refreshes the cost table after the subject
is committed (it requires WO-222's committed order file).

Process cost for this pass: `harness usage` at entry read 89,770 total
tokens (source claude-transcript-message-usage, scope dispatch, cutoff
2026-10-19T13:14Z; cost unknown, counter unavailable); at the end of
drafting, 7,072,134 total tokens (6,522,364 cached, 400,466 cache-write,
148,436 output) over 90 steps and 0 subagents observed, 20 remaining. The
final counters are in the ignored receipts and the response.

## 14. Validation and independent judgment

Written after the refutation receipt is filed (see the end of this
document).
