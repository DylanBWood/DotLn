# The fork's target-write blocker filed first as WO-236, the journal question answered on its corrected unit as WO-237, and the fork's two blocks answered (2026-10-28)

## The dispatch and its capture

The operator opened `planning: issues from the fucking fork. HUGE FUCKING
BLOCKER. …` at 2026-10-28T13:22:01Z in Claude Code (Fable 5.1 at max
effort, selected by the operator with `/model` before the dispatch) and
sent two further messages during the pass, at 13:22:32Z and 13:22:42Z. The
dispatch carried three things: the DotLn-Enterprise-Starter fork's blocker
block of 2026-10-28 (a Claude Code executor refused an Edit into its
registered DotLn-Angular target worktree), the operator's question whether
worktrees should be kept fourteen to thirty days before automatic removal
because the fork's executor could not read earlier orders' journals, and
the fork's standard block of its v0.100.0 pass of the same day. All three
messages are captured verbatim in ignored intake,
`docs/intake/notes/planning-target-write-grant-and-fork-block-2026-10-28.md`,
SHA-256 `a7f2260e8e0377a737e2141692f1f4cda28c71c052b0fd0dd1fc79c5cd16a5e1`;
the capture is a sibling record, never a source to mine, and this document
paraphrases it.

`npm run plan -- start target-write-grant-and-fork-block` opened
`planning/2026-10-28-target-write-grant-and-fork-block` from clean `main`
at `2b872abc` (pull request #249, WO-233's merge and v0.100.0) at 13:40Z;
the start ran 171 s in the background because its system-temp census is
part of it. The pass is document-only: it files two orders, retires one
closed one, amends none, activates nothing, publishes nothing in any target
and never merges. Its refutation is its independent verification (the last
section).

Usage at entry (`harness usage b4b7cf55-…`, 13:22:21Z): 99,813 total
tokens, source `claude-transcript-message-usage`, scope dispatch; cost
unknown (counter unavailable). Fan-out plan, stated before the first spawn:
one refuter as `dotln-worker` (claude-opus-5-5, xhigh; the dispatch names
no Fable worker), no research workers, no descendants; the 20-admission cap
leaves 19. The pass read the fork's working checkout and its WO-019
launchpad and target worktrees on this machine read-only (the registry row,
the journal row, the control logs, the target bundle, the two planning
documents the block names) and wrote only on core's planning branch.

## The direction ledger

Every operator message of the dispatch, in order, with the event the pass
reads in it, its aim and what the pass did. Times are the prompt hook's
observation times.

| # | Hook time | Event read | Aim | Disposition |
| --- | --- | --- | --- | --- |
| 1 | 13:22:01Z | OperatorDirection (dispatch) | Treat the fork's refused target edit as a critical blocker: file the kit change, say what proves it and what to merge in what order; check the assumption that worktrees should be kept fourteen to thirty days; file, decline or defer every item of the fork's standard block | Acted: WO-236 filed first with the proof as its criteria 1 to 3 and the merge order in the answer block (§The blocker, §The orders, §The fork's two blocks); the assumption checked and corrected, WO-237 filed on the journals (§The journal question); every item disposed (§The fork's two blocks, §The register) |
| 2 | 13:22:32Z | OperatorRejectsUnsupportedAssumption (a question in the form of a rejection: how can the executor not write from the launchpad into the repository it works on) | Name the mechanism | Answered in §The blocker: the fifth refusal knows five grant kinds and none resolves a registered target; every earlier target implementation ran under Codex, whose tool calls are unhooked |
| 3 | 13:22:42Z | OperatorReportsRepeatedFailure (how was such a piece left off) | Name the cause, from the record | Answered in §How it was left off, with the dated evidence: the three-host qualification covered publication, not implementation, and no criterion or gate case ever asked for an executor edit under the hook |

No message withdrew an earlier one; messages 2 and 3 sharpen message 1's
first item and are answered inside it. The dispatch's aim stayed first.

## Entry readings

| Subject | Observation | Source |
| --- | --- | --- |
| Launchpad | `main` at `2b872abc`, clean; WO-233 `closed` (final review FINAL-001 pass, five verifications, released as v0.100.0 on 2026-10-28T04:08Z); legal next actions `release-close` (already done) and `next` | `git status`, `npm run resume -- status --json`, `docs/control/local/retained/WO-233/release-close.json` |
| WO-234 | `active` in the sibling worktree `../DotLn-wo234` at `2b872abc`, activated 2026-10-28T12:53:07Z; 49 session files in its harness directory; uncommitted edits to its five Codex skill roots at 13:30Z; no verification yet | the worktree's `status --json`, `git status`, its harness directory (read-only) |
| WO-192 | preserved in `../DotLn-wo192` at `939af628`, unchanged by this pass | `git worktree list` |
| `plan failures` | window since receipt 056 (2026-10-26T23:40Z): 4 failed verifications, 0 failed final reviews, 4 repairs, 1 order made ready, 1 failed first verification, 0 corrections, 0 off-ramps, 7 amendments, 0 withdrawn; all of WO-233's (VER-001 to VER-004 fails and their repairs, D001 of WO-233 and WO-235 and the five amendments of the 2026-10-26 pass); 31 failed local gate rows, all WO-233's; final-review escapes 0 of 1 (10 recent reviews, 0 escapes); record: 163 failed verifications, 23 failed final reviews, 189 repairs, 195 orders made ready over the history | `npm run plan -- failures` |
| Conditions | 3 hold, 3 unknown: the thirty-day median of fresh complete plain gates 424.5 s against 360 (the cold-gate candidate, holding since the 2026-10-24 passes), the `target-worktree` gate task's latest fresh run 611.3 s against 189.8 (one run; its file lanes within their medians), and WO-150-D003's executor cold-start reading (30,857 bytes, reopened and accepted on 2026-10-27 at 34,953); 2,906 decision conditions and 1,367 register rows not evaluated | `npm run plan -- conditions` |
| Register at entry | 1,372 rows, 206 pending (205 deferred, 1 needs-review: FUP-0126), revision `898d9fdd…`; after this pass's sync 1,387 rows, 221 pending, revision `dbf07e3b…` (the fifteen rows §The register disposes) | `npm run plan -- followups`, `--sync`, `--export` |
| The prune census | read-only, 220 s; 0 candidates in every class and 0 blockers; retained roots in the tail the host kept: coordination 16, unclassed temporary roots 152, warm fixtures 6, legacy backfill 180 (the host's background capture kept only the census's last thirty lines, so the other classes' retained counts are unobserved by this pass) | `node scripts/harness.mjs prune` (dry run) |
| Reader scores | unknown: the captured `plan start` output holds only the register page | `npm run plan -- start` |
| The fork's checkouts | its working checkout `../DotLn-Instance` at its `main` (the control logs of WO-004 to WO-014, the two planning documents, the publication grant in its `grants.json`); the WO-019 launchpad `../DotLn-Instance-wo019` (the registry row binding WO-019 to `../DotLn-Angular-wo019`, clone `../DotLn-Angular`, branch `wo-019`, base `1c3a4ff2`; the journal row of 13:12:32Z; the manifest's three executor grants); the target worktree with the kit's target bundle (`.claude/hooks`, `settings.json`, `target-worker-manifest.json`, `CLAUDE.local.md`) | read-only reads of those files |
| Open issues | none read: `gh issue list` was not run in this pass; the 2026-10-26 pass found none and no issue intake is claimed here | boundary named |

## The blocker, read against the kit

The fork's facts hold. Its WO-019 launchpad journaled, at
2026-10-28T13:12:32Z, a `PreToolUse` row for an `Edit` with
`outsideWrite: { role: "executor", destination: "<home>/Projects/DotLn-Angular-wo019/libs/…/study-explanation.html", status: "refused" }`.
Its manifest grants the executor `system-temp`, `session-scratch` and
`host-scratchpad` under the one authority grant
`contributor.outside-temporary`, as core's does. Its registry
`docs/control/local/target-worktrees.json` binds WO-019 to that target.

The mechanism (the hook's source at `2b872abc`): `outsideWriteResponse`
(`packages/skeleton/src/harness-host.ts` 4859 to 5030) judges every known
write destination outside the worktree root against the session role's
grants, and its switch (4936 to 4967) resolves five kinds: the host's
temporary directory, the DotLn session scratch, the host-printed
scratchpad, an operator-named absolute root carried in the grant, and
main's ignored intake. The compiler closes the set (`OutsideWriteGrant`
at `packages/compiler/src/harness.ts` 213 to 219; the validation list 345
to 360), and an `operator-root` grant is admitted only through a
provenance-bearing authority grant compiled into the loadout (395 to 407).
`packages/skeleton/loadouts/grants.json` is publication authority: the
publish admission reads it for the push, pull-request and release effects
(1920 to 1930) and nothing reads it for outside writes. So the fork's first
route, an operator grant beside its publication grant that compiles to an
operator-root grant, is not a route the kit has; the kit change the fork
named as the alternative is the fix, and it is WO-236.

The hook already reads the registry for another purpose: the publish
admission (1878 to 1930) locates `target-worktrees.json` in main and in the
worktree, requires exactly one row for the dispatched order, and compares
the two. The session knows its order: the observed lifecycle dispatch binds
`session.workOrder` and `session.role` (905 to 919), and the canonical
status supplies the order otherwise (`harnessControl`, 593 to 612). WO-236
puts those three things together: a sixth kind, `target-worktree`, declared
by the executor role only, resolved at every judged write from the
session's order, the launchpad's own registry row for it and the row's
target path, granting nothing when the row is missing, doubled, bound to
another launchpad, or the order's phase is not `active` or `repairing`. The
other four refusals and the five kinds do not move; Copilot, which reuses
the Claude registration, gets the same judgment; Codex is unchanged.

Why the fork's executor is the first to meet it: the fork's control logs
attest every `ImplementationReady` and `RepairCompleted` of WO-004, WO-005,
WO-006, WO-007, WO-013 and WO-014 to `codex-cli` (gpt-6-astra), with
`claude-code` on every verification, final review and records commit.
WO-019's `resume: next` of 2026-10-26 is the first Claude Code executor
dispatch on a target order in either repository (core has run no target
order of its own), and the refusal fired at its first Edit. A Claude
session started inside the target instead would meet the target-worker
bundle (`contributor.ts` `targetWorkerProfiles`; `scripts/lib/harness.mjs`
1233), a PreToolUse-only profile that omits the skills and lifecycle hooks
by design and carries the same three grants rooted at the target, so the
launchpad's records would be refused from there the same way: neither root
grants the other.

### How it was left off

The record, dated:

- **2026-09-19, WO-144** (`904f8944`): the fifth refusal lands with four
  grant kinds (the host-printed scratchpad follows with WO-158). Product
  03 records the operator's answer of that day: work-stream-facing roles
  of the enterprise starter will by nature write outside a project and
  declare that themselves. The declaration route built was the roles'
  compiled grants and the operator-root kind behind a loadout authority;
  no instance-facing declaration and no registry-resolved kind.
- **2026-10-11** (`dfe191e2`): registered targets get a worktree lifecycle
  (start at the declared base, select through the launchpad, close without
  a release). A target worktree is by construction outside the launchpad
  project. No grant was added and no criterion asked for an executor edit
  into it under the hook.
- **2026-10-18 and 2026-10-19, WO-221** (`993e8096`): the three-host
  qualification. Its host lines are the Codex `--add-dir`, the Copilot
  `--allow-tool` forms, and for Claude Code that the hook admits the
  registered publish commands; its live episode of 2026-10-18 ran the
  operator's first target order under Claude Code auto mode for the push
  and under Codex with the approval policy off and the sandbox off for the
  work (its order, 215 to 222). Publication was qualified on three hosts;
  implementation was qualified where the operator ran it, which was Codex.
- **2026-10-18 to 2026-10-26**: six fork target orders, every
  implementation and repair under Codex, every verification and review
  under Claude Code, which reads the target and runs its gate and needs no
  grant.
- **2026-10-26 to 2026-10-28**: the fork's WO-019 executor runs under
  Claude Code for an attended design comparison; its first Edit into the
  target, at 13:12:32Z on 2026-10-28, is refused.
- **The gate**: the WO-144 cases (`scripts/test-harness.mjs` 9410, 9628,
  9755) grant and refuse temporary roots, scratch, an operator root and
  main's intake; the WO-221 cases (2374 onward) admit the publish helper;
  `scripts/test-target-worktree-start.mjs` asserts no Claude Code launch
  line. No case writes into a registered target from a role session.

The reading: the qualification order asked each host to publish and
assumed the implementation would run where the operator ran it. Nobody
wrote the criterion "a Claude Code executor edits the target worktree under
the hook", so the design's blind spot was never exercised until the
operator changed hosts for one order. The planning rule that an order whose
criteria need a live run names each surface the run must traverse (product
07, the 2026-10-13 screen) did not catch it because WO-221's live run did
traverse its surfaces; the missing surface belonged to no order. WO-236's
criteria 2 and 3 are that missing case, with the paired control at the
base.

## The journal question, verified

The operator's assumption, checked against the record:

- Journals live under the checkout's `docs/control/local/harness/`
  (`harnessStateDirectory`, `harness-host.ts` 476 to 481): the session
  journal `<digest>.jsonl` (dispatch rows, tool-call judgments,
  outside-write rows, registered-target admissions, host denials, operator
  messages), the session state, `checks.json` (the gate index),
  `suite-success/`, `deadlines/`, and the gate's captures (`runner/`,
  `check-history/`, `check-output/`), `targets/` and `excludes/`.
- Release close removes the worktree ("its directory is gone", product 07
  §Workflow closeout; WO-233's close record: the worktree `removed` with a
  preservation receipt for operator material only) and then runs the
  prune. Nothing moves the journals first. The one carry is the meter
  snapshot `docs/evidence/<WO>/meta.json`, written at release preparation
  from the worktree's journals (`release.mjs` 4086 to 4094) and holding
  usage by role, not the rows. The committed control log keeps the actor
  attestation per phase, which is how the fork's executor answered its
  question after all.
- `plan failures` reads journals from the current checkout's harness
  directory only (`plan-failures.mjs` 750 to 770), so its denial and
  intervention counts never include a closed order's sessions.
- Sizes on this machine: the fork's WO-019 launchpad harness directory 604
  KB; WO-192's worktree holds four journals of 368 KB inside a 1.2 GB
  harness directory whose `runner/` is 1.1 GB of gate captures; main's 242
  journals of two months are 63 MB beside `check-history/` 375 MB and
  `check-output/` 25 MB; the whole WO-192 worktree is 2.1 GB and the
  fork's target worktree 1.3 GB (`du`, `ls -lS`, `find … -name '*.jsonl'`).
  The captures already carry retention classes in the budgets file
  (`gate-fixture-passed` 0, `gate-fixture-failed` 24, `worker-capture` 1,
  `legacy-backfill` 48 hours; `coordination` `null`), in hours, and the
  class set is closed (`temporary-root-records.mjs` 66 to 74, 113 to 125).

So: the concern is right and the unit is wrong. Removing the journals at
close loses the only record of the hook's judgments, the host's denials and
the dispatch rows, and planning never reads them for a closed order; but
keeping worktrees fourteen to thirty days would keep gigabytes of
regenerable captures, build output and installed packages per order, which
is the residue WO-233 was filed on the operator's direction to stop. The
journals are kilobytes. WO-237 therefore moves the worktree's session
journals, session state and gate index into main's retained lane for the
order (`docs/control/local/retained/<WO>/harness/`, beside the removal
proof that lane already holds) as an owned root of a new class
`closed-journal` with a seed of 720 hours, which the existing prune judges
and the operator can set to `null` to keep forever; `plan failures` counts
a closed order's rows from the lane and `harness usage` reads a retained
session. Nothing is committed and no worktree is kept.

## The orders

**WO-236 — The executor edits the registered target worktree** (machinery,
minor; first). The compiler admits a sixth outside-write grant kind,
`target-worktree`, with no root field; the executor role declares it with
the authority grant `contributor.target-worktree`, whose reason is the
operator's authorization of 2026-10-28; the hook resolves it at every judged
write from the session's order, the launchpad's registry row and the row's
target path, and grants nothing when any of those is missing, doubled or
bound elsewhere, naming the cause in WO-168's form; the writer, gate-input,
planning-branch and subagent refusals and the five existing kinds are
untouched; `worktree start` prints the Claude Code launch line beside the
Codex and Copilot ones and makes its `Next (run manually)` lines consistent
with them; every instance receives the grant through the kit update and its
own `harness emit`, because the grant is a role declaration compiled from
the instance's own registry. The proof the fork asked for is criteria 1 to
3: `harness check` green, an executor Edit under the registered target
admitted and journaled `granted` with its kind and authority, the same
write refused at the base (the paired control), and a write beside the
target, by another role, or with no row refused with the cause named.
Sources: the fork's journal row and block; the hook, compiler and loadout
sources cited in the order; WO-221's host notes.

**WO-237 — A closed order keeps its journals** (machinery, minor; fourth,
after WO-235). The class, its seed in the budgets file and the kit
template; the move inside the close's worktree removal with a `journals`
field on the close record; the prune's judgment of the lane; `plan
failures` and `harness usage` reading retained lanes; the instance-history
case. Sources: the operator's question; the fork's executor's observation;
the sizes and the readers above.

Both orders carry their cost line, provenance, typed dependencies, cites,
a dated observed gap with line citations, a design with rejected
alternatives and their axes, an execution plan naming files and checks,
criteria with paired controls, the Preflight line, an evidence gate, the
write-back duty, known issues and carry-ins, non-goals and operator-review
assumptions, as product 07's artifact list requires. They are separate
because they change different subsystems (the hook boundary; the close's
retention) and the first is wanted today.

**WO-234 is active.** It was activated in `../DotLn-wo234` at 12:53Z
today, thirty minutes before this dispatch, and its hunks overlap WO-236's
in `harness-host.ts`, `contributor.ts`, the compiler's `harness.ts` and the
role oracle. The sequence places WO-236 first on the operator's dispatch;
the serial rule runs one order at a time; the order of activation is the
operator's. Both routes are on WO-236's preflight paragraph in the map:
start WO-236 now from `main` and let WO-234's worktree resume afterwards,
integrating `main` by the main checkout's current code (WO-233's rule), or
let WO-234 close first and start WO-236 one cycle later. The pass neither
pauses nor amends WO-234.

## The fork's two blocks, answered

The fork's block of 2026-10-28 names, as its item 3, its block of
2026-10-26 (its planning document `acceptance-by-use-2026-10-26.md` §11),
which the operator never pasted into core and core's 2026-10-27 answer did
not read. The pass read it from the fork's working checkout on this
machine, read-only, and answers both blocks here. Each item is evidence the
operator carried, read against the record it names.

**The block of 2026-10-26.**

1. A drafted prompt carried a rule the operator never gave (core's
   2026-10-24 document, line 604, and its §10). Filed and done in this
   pass: the block is annotated after its fence, and product 07
   §Operator-opened planning pass item 5 records that a session-drafted
   paste block carries the session's authority and not the operator's,
   whatever its grammatical person. Blocking: no.
2. Acceptance by use as an instance-owned role duty (WO-014-D019's
   question). Answered: there is no supported route today that adds duty
   text to a generated role and survives regeneration; what an instance
   owns is the support switches (`contributorConfiguredProgram`), the
   publication grants file and the registration's `hostRules`; the order
   text, the workstream rule and the operator record are the designed
   carriers of a duty. The extension contract is deferred with its
   reopening conditions (candidate 8). Blocking: no; the fork continues on
   the order text.
3. The draft publish's observability at `verification-result pass`.
   Deferred (candidate 9): the draft form is opt-in and core declares no
   draft step and no actor, so the briefing names no publish; the next
   edit of that case on a target order prints the command or refuses
   without a draft head. Blocking: no.
4. The receipts as a form filled to length. Allocated to WO-088 as a
   carry-in on its catalog row (candidate 10): the protocol's per-order
   text fields (`plan-refutation-protocol.ts` 572 to 606) and the
   prompt's eight-trap question (`authority-evidence.mjs` 306) are that
   order's subsystem. Blocking: no.
5. Confirmations: recorded.

**The block of 2026-10-28.**

1. The lint report from WO-013 and WO-014: recorded; the two stale-ref
   rows (FUP-e4fa2bbf7c3968ec, FUP-378c5638bf515e52) are re-disposed with
   the fork's two field uses and stay deferred to the next order that
   edits the lint, which also takes the ask to record the linted range on
   the `FinalReviewCompleted` event (candidate 5). Blocking: no.
2. Confirmations at v0.100.0: recorded. The ask on template-derived
   instance files in the preview is allocated to WO-207 as a carry-in on
   its row (candidate 6). Blocking: no.
3. The 2026-10-26 block: answered above.
4. (a) WO-234 counts an attended session as an unattended one: the bound
   is elapsed wall clock from the dispatch start in the journal, which is
   the known issue on its criterion 1 (idle time) the executor decides and
   records; `accept-overrun` is legal in `active` and the other named
   phases with no stop required first (criterion 5), scoped to the order
   and phase, and the standing reads any recorded acceptance, so an
   acceptance recorded ahead of a stop extends the bound ahead of it; the
   fork's attended case is recorded on WO-234's row as evidence for that
   reading (candidate 11). (b) Recorded on WO-235's row (candidate 12).
   (c) Declined: product 07 governs core's lifecycle and the comparison
   procedure is the fork's workstream rule (candidate 13). Blocking: no.
5. Acknowledgements: recorded.

```text
planning: core's answers of 2026-10-28 to the DotLn-Enterprise-Starter fork's blocker block and its standard block of its v0.100.0 pass, and to its block of 2026-10-26

Answered by core's pass of 2026-10-28 (docs/planning/target-write-grant-and-fork-block-2026-10-28.md), which files WO-236 first and WO-237 fourth on the operator's dispatch.

The blocker. Confirmed from your journal row and the kit's source: the fifth refusal resolves five grant kinds (system-temp, session-scratch, host-scratchpad, operator-root, main-intake) and none resolves a registered target; grants.json is publication authority and feeds no outside-write grant, and an operator-root kind is admitted only through an authority grant compiled into the loadout, so your route 1 does not exist in the kit. The kit change you named is filed as WO-236, first in core's queue: a sixth kind, target-worktree, declared by the executor role only and resolved at every judged write from the session's dispatched order, the launchpad's own target-worktrees.json row for it and the row's target path; nothing granted when the row is missing, doubled, bound to another launchpad, or the phase is not active or repairing; the other four refusals and the five kinds untouched; Copilot gets the same judgment, Codex is unchanged; worktree start prints the Claude Code launch line (the launchpad is the session directory; the target is the granted root). Your proof is its criteria 1 to 3: harness check green; an executor Edit under the registered target admitted and journaled granted with kind target-worktree and its authority, the same write refused at the base as the paired control, and a write beside the target, by a verifier or reviewer, or with no registry row refused with the cause named. Blocks your WO-019 under Claude Code: yes, until the carrying release.

What to merge, in order: (1) core merges its planning pull request (document-only); (2) core activates WO-236 from main, runs it through verification and final review, merges its pull request and runs release close, which publishes v0.101.0 and refreshes the starter; (3) you take the release with the launchpad update, re-emit (your executor's manifest then carries the target-worktree grant), merge your update pull request and run update --finish; (4) the WO-019 session integrates your main by the main checkout's current code, re-emits in its worktree, and continues round 23; its first Edit into the target is journaled granted. Meanwhile two routes exist for that session, neither of them this order's: a Codex session with --add-dir, as WO-004 to WO-014 ran, or operator override: in the Claude session, which suspends all five refusals for that session and records its use at off. The choice is the operator's; core touched neither the WO-019 worktree nor its records.

Your block of 2026-10-26, read in this pass. 1: done; the 2026-10-24 document is annotated after its drafted block and product 07 records that a session-drafted paste block carries the session's authority only. 2: no supported route adds duty text to a generated role today; an instance owns its support switches, its grants file and its hostRules, and the order text, the workstream rule and the operator record are the designed carriers of a duty; the extension contract is deferred with its reopening conditions (core's candidate 8). 3: deferred (candidate 9); the draft form is opt-in and core declares no draft step or actor, so the briefing names no publish; your orders' route stands. 4: allocated to WO-088 as a carry-in (candidate 10). 5: recorded. None blocks.

Your block of 2026-10-28. 1: recorded; FUP-e4fa2bbf7c3968ec and FUP-378c5638bf515e52 are re-disposed with your two field uses and stay deferred to the next order that edits the lint, which also takes your ask to record the linted range on the FinalReviewCompleted event (candidate 5). 2: recorded; the template-derived instance files in the preview are allocated to WO-207 as a carry-in (candidate 6). 3: answered above. 4a: as filed, WO-234 counts an attended session the same as an unattended one, since the bound is elapsed wall clock from the dispatch start; that is its criterion-1 known issue (idle time), which its executor decides and records, and your case is recorded on its row as evidence; accept-overrun is legal in active and the other named phases with no stop required first, scoped to the order and phase, and the standing reads any recorded acceptance, so an acceptance recorded before the stop extends the bound ahead of it. 4b: recorded on WO-235's row. 4c: declined; the procedure is your workstream's rule. 5: recorded.

For your reading: WO-237 (fourth in core's queue) keeps a closed order's session journals, state and gate index in main's retained lane for thirty days under a retention class the prune judges, which is what your executor lacked on 2026-10-28; your worktrees stay removed at close.
```

## The register

`npm run plan -- followups --sync` after the map's candidates section
minted fifteen rows (1,372 to 1,387; pending 206 to 221; revision
`898d9fdd…` to `dbf07e3b…`). One batch (`followups --apply`) disposed
eighteen rows against that revision:

| Row | Disposition |
| --- | --- |
| FUP-0126 (needs-review, source revision 23) | deferred again: product 12 unchanged by this pass, WO-083 queued |
| FUP-378c5638bf515e52, FUP-e4fa2bbf7c3968ec (WO-231-D005, D006) | deferred again with the fork's two field uses; the next order editing the lint takes them with candidate 5 |
| FUP-4aad33559d1d2d75 (an operator-root grant per order) | declined |
| FUP-b8917a0da507079a (the override as the standing route) | declined; interim only |
| FUP-eb0985a7a2a61b60 (verifier and reviewer grants) | declined |
| FUP-8fb144fabed2b84d (keeping worktrees fourteen to thirty days) | declined as the unit; WO-237 carries the concern |
| FUP-2fe2709d9b33c9e7 (the linted range on the event) | deferred to the next lint order |
| FUP-b44117f7b047e976 (template-derived files in the preview) | allocated to WO-207 |
| FUP-673c3991de705929 (the session-drafted block's authority) | settled in this pass |
| FUP-fc889fc98e33c547 (instance-owned role duties) | deferred |
| FUP-9a4929e4a041875f (the draft publish's observability) | deferred |
| FUP-552421f436626033 (the receipt as a form) | allocated to WO-088 |
| FUP-632348a91b2ae9d8 (WO-234 and an attended session) | deferred; recorded on WO-234's row |
| FUP-26f3950b44d6cfe8 (WO-235's field case) | settled |
| FUP-3543644330310589 (a product 07 sentence on iterative comparison) | declined |
| FUP-f6efcb5addbfd630 (the `Next (run manually)` lines) | allocated to WO-236 |
| FUP-bcaaa8a0be02f59e (the entry readings' failures) | settled |

Each row's reason and reopening condition are in the register and in the
map's candidates section. No row of an active worktree was touched.

## Write-backs and document ceilings

Product 07 §Operator-opened planning pass item 5 gains one sentence group:
a block a session drafts for the operator to paste into an instance carries
that session's authority and not the operator's, whatever its grammatical
person, with the fork's case as its evidence. Product 07 measures 269,727
non-exempt bytes after the edit and its ceiling is set to 296,700
(`docs/control/doc-ceilings.json`, citing this section). No other product
document changes; the orders carry their own write-back duties (WO-236:
products 03 and 07, the security document, the kit README; WO-237: product
07 and the kit README). The 2026-10-24 planning document gains its
annotation after the drafted block. The map gains two catalog rows, one
preflight paragraph (WO-236), four row notes (WO-234 and WO-235 field cases;
WO-207 and WO-088 carry-ins) and one candidates section of fifteen items;
the sequence its dated rationale; the ledger its registration heading. The
sequence file reads 18,914 bytes against its 12,369-byte acceptance, an
advisory the standing route leaves to planning, as the 2026-10-26 pass
recorded at 17,017.

## NoOps and traps

Every candidate weighed and not filed is in the map's section "Candidates —
returns from the fork's target-write blocker, the journal question and the
fork's two blocks (recorded 2026-10-28)" with its evidence and reopening
condition, and disposed in the register: the per-order operator-root grant,
the override as the standing route, grants for the verifier and reviewer,
keeping worktrees for a window, the linted range on the event, the
template-derived files in the preview, the drafted block's authority
(settled), instance-owned role duties, the draft publish's observability,
the receipt as a form, the attended-session reading of WO-234, WO-235's
field case, a product 07 sentence on iterative comparison, the printed
`Next` lines, and the entry readings' failures.

Traps, named before the material choices. Drift to low performance: the
orders and this document are derived from product 07's artifact list and
the checks that judge them, with the 2026-10-26 pass's documents read as
evidence of what happened and not as the pattern (its direction ledger is
reused because product 07 now requires one). Shifting the burden to the
intervenor: the fix is a kit grant resolved from the instance's registry,
not an override the operator opens per session or a rule written by hand
per order; the journals are kept by the close, not by an operator who
remembers not to close. Rule beating: the grant is judged at every write
against the registry row, the role and the phase, never a path baked into a
manifest. Policy resistance: the other refusals stay as they are, and the
fork's live session has two interim routes, both recorded with their width.
Escalation: no second approval layer; one authority grant with the
operator's authorization as its reason. Tragedy of the commons: journals
are kept for a window the operator owns, not forever, and the worktree's
gigabytes are not kept at all. Success to the successful: WO-234 is not
displaced; both activation routes are on the record and the choice is the
operator's. Seeking the wrong goal: WO-236 is judged by the admitted write
and the refused sibling write under a paired control, not by a passing
check alone. The NoOp (answer the fork with the override route and file
nothing) was weighed: every Claude Code target execution in every instance
would then run under a recovery mode that suspends five refusals, and the
journals would keep disappearing at every close. The aim stated in the
ledger was matched: the blocker filed first with the fork's proof as its
criteria, the assumption checked and corrected, every item disposed, the
answer block written.

## The sequence

WO-233 (v0.100.0) leaves the list; WO-236 is first; WO-234 and WO-235 keep
their places; WO-237 is fourth, before WO-192; nothing else moves relative
to its neighbours. The preamble carries the dated rationale.

## Process cost

Critical path: the fork's WO-019 waits on WO-236's release for its Claude
Code session, or continues under one of the two interim routes; core's
WO-234 is active in its worktree, and the two orders share four files, so
one closes before the other activates and the second pays one integrate by
current code. NoOp cost: every Claude Code target execution runs under the
override, and the journals of every closed order keep disappearing.
Removal balance: WO-236 removes the Codex-only route for implementing a
target order and the override as the only Claude Code route, and adds one
kind, one authority grant and one printed line; WO-237 removes the loss of
journals at close and adds one class and one move. Failure behavior: an
unresolvable grant refuses closed and names its cause, as the fifth refusal
does today; a failed journal move is a cleanup blocker with the close's
retry command, as the prune's refusal is. Wall-clock: dispatch 13:22Z; the
operator's two messages by 13:23Z; the fork's and the kit's records read to
13:45Z; the two orders, the sequence, the map, product 07, the annotation,
the ledger and the register written from 13:50Z; the first commit and the
refutation times are in the last section. Usage at handoff is in the
response. Agents: the refuter only; the actual worker type is recorded
below.
