# Planning pass, 2026-10-03: why a Claude release close stops before it is finished

Dispatch: the operator's `planning:` message after the WO-184 close
(`main` at `efe62994`, v0.66.0 published), asking why a release close in
Claude keeps failing at a job that is only to publish merged code and
remove the worktree, with three mid-turn messages: the WO-184 close
session's own account of its two stops; why WO-188 sits so far down the
sequence; and an instruction to push the branch and open the pull
request at the end, with the question why it always has to be given.
The four messages are captured verbatim in ignored intake
(`docs/intake/notes/2026-10-03-release-close-finishes-planning.md`,
SHA-256 `081e94bb8ca34f94ce5ec149996c1f9015de1827e760179c436bc9c7f13fcb5d`).
Planner synthesis over repository records, the helper's retained close
records, the harness session journals and this operator's own session
transcripts. The clean-room screen found no stop condition.

## 1. What was read

- `npm run plan -- failures` at entry: 2 local release closes and 0 host
  denials in the window, which opens at receipt 039 (2026-10-02 14:40
  UTC). The five denials below fall before it; the journals of the WO-177
  and WO-182 sessions hold them, so the denial journal works and the
  window hides them.
- The retained close record of every order that has one
  (`docs/control/local/retained/WO-NNN/release-close.json`): 14 closes
  from 2026-10-01 to 2026-10-03, 12 in Claude Code and 2 in Codex.
- The session journal of each close (`docs/control/local/harness/`,
  keyed by the session digest) and the transcript of each Claude close
  session.
- The role text (`packages/skeleton/src/loadouts/contributor.ts`
  `releaseCloseRemedy`, generated into the release-close skill), the
  admission (`packages/skeleton/src/harness-host.ts`
  `releaseCloseAdmission`), the generated hooks' fallback
  (`packages/compiler/src/harness.ts`), `scripts/release.mjs` `close` and
  `finishPublishedWorktree`, `scripts/worktree.mjs` `finish`, and
  `scripts/lib/git.mjs` `removeMergedBranch`.
- The 2026-10-02 planning document §10 and §13 and WO-188's placement
  paragraph and dependency block.
- `npm run plan -- followups --touching scripts/release.mjs
  scripts/worktree.mjs packages/skeleton/src/loadouts/contributor.ts`:
  four rows, disposed in §7.

## 2. The record: twelve Claude closes

| Order | Session started | Hook at the prompt | Dispatch recorded | Publish command | Outcome |
| --- | --- | --- | --- | --- | --- |
| WO-176 | 10-01 15:14 | normal | before WO-178 | redirect | unaided |
| WO-103 | 10-01 15:43 | normal | before WO-178 | redirect | unaided |
| WO-102 | 10-01 16:16 | normal | before WO-178 | redirect | classifier denied; operator ran it |
| WO-178 | 10-01 19:20 | fallback, `pins-differ` | no | byte-exact | unaided (the classifier allowed it) |
| WO-177 | 10-01 20:21 | normal | yes | redirect | classifier denied; operator ran it |
| WO-182 | 10-01 21:28 | normal | yes | variable prefix | classifier denied; operator ran it |
| WO-061 | 10-01 23:20 | fallback, `pins-differ` | no | redirect | classifier denied; operator ran it |
| WO-179 | 10-02 00:11 | fallback, `pins-differ` | no | redirect | classifier denied; operator ran it |
| WO-124 | 10-02 00:40 | fallback, `pins-differ` | no | redirect | unaided |
| WO-107 | 10-02 03:06 | normal | yes | variable prefix | unaided |
| WO-062 | 10-02 03:28 | normal | yes | redirect | unaided |
| WO-184 | 10-03 15:45 | fallback, `pins-differ` | no | redirect | published; cleanup stopped twice; operator removed the directory and re-ran |

Times are UTC. Six of twelve finished unaided. Five needed the operator
because the classifier denied the publish; one because cleanup stopped.
Both Codex closes (WO-105, WO-181) finished unaided; Codex has no
classifier. The operator's word "always" is wider than the record. What
the record does show is that every second Claude close needed the
operator, and no close since WO-178 landed was helped by the admission
written for it.

## 3. The causes

**The admission never fires (two independent reasons).** WO-178 made
the permission hook admit the byte-exact helper after a recorded
release-close dispatch, so that the operator's own pre-approval decides
instead of the classifier. No journal of the nine closes since then
holds a `releaseCloseAdmission` row.

- In five of the nine, the prompt hook ran its fallback with
  `pins-differ: built adapter unavailable`. The merged order had changed
  the pinned runtime; main's built adapter is refreshed by the helper
  itself, later. The fallback records nothing but an advisory row, so
  `releaseCloseDispatch` is never set and the admission cannot match.
  Every order that edits the runtime arrives at its close this way.
- In the other four the dispatch was recorded, but the session wrapped
  the command in a redirect or prefixed it with a shell variable. The
  admission matches only the byte-exact command. The helper prints 305
  to 342 KB, which is why sessions wrap it (an inference: the sessions
  read the redirected file afterwards with `tail`, `sed`, `grep` or
  `awk` rather than the output itself).

Once the admission does not apply, the classifier decides, and it denied
5 of the 11 wrapped commands. The one byte-exact run (WO-178) was allowed
by the classifier, not the admission, since that session's hook was in
fallback.

**The role sentence tells the session to stop.** WO-179's sentence says
to report a cleanup blocker or host denial once with the operator's
remedy (`!` or a `/permissions` retry), then finish other work without
repeating publication, and never to repeat transitions. It never says
when the close is done. The five denied sessions did exactly what it
says. The WO-184 session stopped twice on it: first at the permission
failure, then with the merged branch still present, because re-running
the helper read as repeating publication. The helper's own recorded
remedy for every cleanup blocker is to re-run the same command
(`finishPublishedWorktree` writes it into each blocker), and a re-run
takes the `already-published` path: it re-checks the Release and
publishes nothing. The role text forbids the remedy the helper prescribes.

**Cleanup cannot finish a removal the snapshots block.** The WO-184
fixture kept its live verification fixtures inside the worktree
(`.runtime/wo184/material/`), and the verifier sealed snapshots under
them at mode `0500`. `worktree.mjs` restores write permission only for
beacon directories, so `git worktree remove` failed. Git had already
dropped the worktree from its list, so the record called it `removed`
and a re-run could no longer see the 10,574 files left on disk.

**The branch step hides.** The merged branch is deleted only when the
worktree was already gone at the start of the run, and the dry run never
previews that deletion. After the failed removal, the WO-184 preview
said cleanup was `clean` with no rows while `wo-184` still existed.

These are fixes that failed. The 2026-09-30 pass saw "a publish the
Claude auto-mode classifier denied and nobody retried" (the map's
paragraph of that date) and answered with WO-178's admission and
WO-179's report-once sentence. Nobody measured whether the admission
fired, and the sentence wrote the hand-back into the role.

## 4. Why WO-188 sits where it does

The 2026-10-02 pass filed seven machinery orders and seated them beside
seven delivery orders "WO-185 to WO-191 in number order" (§13 of that
document). WO-188 got the fourth pair from its number. Its one hard
edge, WO-187, has the reason "the same loadout source and harness
bundle, edited first". That is a file-collision ordering: nothing in
WO-188 needs WO-187's behavior. With WO-186 depending on WO-185, the
machinery lane is strictly serial: WO-185 (in flight), WO-186, WO-187,
then WO-188. That pass did not weigh how often release close needed the
operator. Its release-close items came from WO-176 and WO-178 decisions,
read as small boarded defects.

This pass does not move WO-188. Its release-close items 1 and 3 to 5
handle scratch repositories, tag outcomes and record shape, none of
which caused a stop in §2. The causes in §3 go into a new small order
that runs now (§6). WO-188's item 2, the one builder for the admitted
spelling, is taken by that order. Moving the whole of WO-188 forward would put
twenty-three unrelated items, a re-mint of all five editions and WO-187's
loadout edits in front of the fix. Reopen: a close stops on something
WO-188 items 1, 3, 4 or 5 name before WO-188 runs.

## 5. Why the operator has to ask for the push and the pull request

The operator's global instructions forbid pushing or opening a pull
request without explicit authorization. Product 07 says a planning
pass's output "lands through the ordinary pull request from a planning
branch" without saying who opens it, and the planner procedure says
nothing about it. So every planning session stops at a committed local
branch. In 9 of the 12 planning sessions since 2026-09-20 the operator
asked (7 typed directly, 2 carried in a compaction summary). `resume:
final review` already carries the authorization to publish its reviewed
branch. The planning dispatch can carry the same for its own branch and
pull request, and nothing more. This pass records the operator's message
4 as that direction; WO-195 writes it into the planner procedure and
product 07. This pass itself pushes and opens its pull request on the
operator's instruction in message 4.

## 6. Decisions

- **File [WO-195](../work-orders/WO-195-roles-finish-what-was-dispatched.md)**
  for the four causes in §3 and the planner sentence in §5. It makes the
  admission reach the sessions it was written for, gives the helper a
  short output and one admitted spelling, completes the three cleanup
  steps, and replaces the release-close sentence with a completion
  condition and the helper's retry. One order, because the release-close
  and planner sentences share one loadout source, one re-mint and one
  bundle re-emit. Reopen: a Claude close after WO-195 merges needs an
  operator command, or its journal shows no `releaseCloseAdmission` row
  for an exact command.
- **Placement: next, as a third lane beside WO-185.** It has no hard
  edge in the queue. It shares `harness-host.ts` and `resume.mjs` with
  WO-185 (in flight) and `harness-host.ts` with WO-186; final review
  integrates main. Every close until it lands remains exposed to §3.
  Reopen: the operator prefers it after WO-185 to avoid the shared
  files.
- **WO-188 unchanged.** Its item 2 ends as not reproduced under its own
  rule once WO-195 lands; its title and count stay. Reopen as in §4.
- **Declined alternatives**, each in `NoOpIntent` shape in §8.

## 7. Register rows read

- FUP-da471832071118c7 (WO-176 D029, the moved-main retry): its
  condition "the next release-recovery order edits these seams" occurs
  with WO-195, and WO-195 edits the retry text without changing
  `ensureExistingRelease`. Re-deferred with that reason; it is a carry-in
  of WO-195. Reopen unchanged: a real retry meets moved main.
- FUP-8cfd3ff52146a016 (WO-166 D008, a real-runtime publish fixture in a
  linked pair): its condition (a close leaves main reserved or reclaims
  a live reservation) has not occurred. Kept deferred.
- FUP-ec72b2ea596bdc75 (the planner's sentence on repairs): its
  condition names the next order that edits the planner procedure, and
  WO-195 adds one sentence to it. WO-195 does not change the repairs
  sentence. Re-deferred to an order that edits that sentence or a second
  misreading.
- FUP-cd1a227413938345 (product documents owned as wholes): matched only
  the loadout path; its condition has not occurred. Kept deferred.

## 8. Goal alignment and the alternatives

Mission and critical path: a release close is the last step of every
order; when it needs the operator, the operator's flow stops at the end
of every second order, which the vision's operator-flow aim names as
the cost to remove. WO-195 is machinery off the delivery path and blocks
nothing; it removes recurring operator rescue on that path.

- *Shifting the burden to the intervenor* is the trap in force: the
  report-once sentence and the `!` remedy put the finish on the operator,
  and WO-195 removes that dependence.
- *Fixes that fail*: WO-178 and WO-179 were the last fix, unmeasured. WO-195's
  first criterion is a fixture in the stale state that defeated the
  admission, and its reopening condition reads the journal row.
- *Rule beating*: a close could pass its fixtures while live sessions
  still wrap the command; the summary output removes the reason to wrap,
  and the next planning pass reads the journal of the first live close.
- *Escalation*: no new refusal, phase or check is added; the role text
  shrinks to a completion condition.
- Tragedy of the commons, drift to low performance, success to the
  successful and seeking the wrong goal: not material; the change
  shortens output each session reads and targets the observed outcome,
  a finished close.

Naive Interventionism: the admission's useful function (a dispatch-bound,
byte-exact pre-approval that keeps host deny and ask rules) is kept and
made reachable; consumers are the release-close role in Claude and the
security document's statement; second-order risk is the admission
firing in a state it should not, answered by requiring the same facts
and naming the missing one; every part is reversible by reverting the
order.

NoOp records:

- *Do nothing.* Evidence: 6 of 12 closes needed the operator; the
  admission has fired 0 of 9 times. Why action wins: the same failure
  recurs at every runtime-changing order's close. Reopen: the Claude
  closes before WO-195 lands all finish unaided, which would show the
  failure is rarer than this record.
- *A project allow rule for the helper.* Declined: broader than the
  admission (no dispatch or legal-action check) and a committed absolute
  path. Reopen: WO-195's admission still fails to fire in the next two
  closes.
- *Accept redirects in the admission.* Declined: arbitrary write paths
  and 300 KB of context kept. Reopen: the summary output does not stop
  sessions wrapping the command.
- *Un-seal snapshots in `verification-worktree.ts`.* Declined: a
  feedback-judged source (a live episode) and the seal is right while
  verification runs. Reopen: a sealed snapshot blocks something other
  than worktree removal.
- *Move WO-188 forward.* Declined in §4.

## 9. The sequence

WO-184 leaves the list (closed, v0.66.0). WO-195 is listed first; the
sequence note says it runs now beside WO-185 as a third lane. No other
order moves.

## 10. Document ceiling

WO-195 writes two statements into product 07 (the release-close
completion condition and retry in §Workflow closeout and releases, and
the planning pass's push and pull request in §Operator-opened planning
pass). Product 07's ceiling rises by 700 bytes, from 166,207 to
166,907, to cover them beside the write-backs the 2026-10-02 pass
already reserved. Reopen: WO-195's write-back lands smaller, and the
next pass lowers the ceiling to what was used.

## 11. The judgment

Receipt 040 (`2026-10-03-planning-90bdcd90e4af7f16-040`) is this pass's
judgment. A fresh background worker with no inherited conversation read
the canonical prompt and the goal card, checked the order's claims in
the source at `662cf03e`, and judged WO-195 and the sequence. Plan
verdict: aligned-with-findings, no hold; 37 unchanged verdicts carried
by hash. Dispatch to filed receipt took 657 s. The worker confirmed the
two spellings, the fallback that records no dispatch, the branch left
by the removing run, the two phrases criterion 5 removes and the Cost
line's edition and suite claims. It could not check the session-record
counts (6 of 12 closes, 5 denials, 9 of 12 requests, 305 to 342 KB),
which the prompt does not carry, and left them unknown.

Its six findings are known issues with reopening observations, on
WO-195's catalog row in the map. The two to weigh first: the admission
has never fired live, so whether the host honors a DotLn allow over the
classifier is unobserved until WO-195's own close; and the classifier
may deny a planning pass's push or pull request as it denied the
publish, with nothing admitting them. Both are observed at the first
use after WO-195 lands.

Cost of this pass: one sub-agent (1 of the cap of 20 used in the
session); no code suite; the document gate.
