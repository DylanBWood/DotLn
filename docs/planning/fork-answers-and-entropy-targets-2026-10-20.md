# Planning pass on the fork's answers and the Entropy Reducer request, 2026-10-20

## 1. Subject, authority and provenance

The operator opened `planning: standard planning pass +` on 2026-10-20 at
about 20:51Z in Claude Code (Fable 5.1, effort max, host-selected),
followed by two pasted blocks: the answers and observations the operator's
instance (the fork, checked out as `DotLn-Instance`) wrote for core in its
planning pass of 2026-10-20 (its §12, eight items), and the operator's own
request for a way to run the Entropy Reducer against a workstream's
repositories. Three mid-turn messages followed: that the three
host-settings removals the fork's pass asked for were already done; that
they were done at the end of that planning session, so nothing has run
without them except the fork's pull request being updated; and a request
to say at the end when work in the fork can resume and whether that needs
starter v0.87.0 or later. Every message is captured verbatim in ignored
intake
(`docs/intake/notes/planning-fork-answers-and-entropy-targets-2026-10-20.md`,
SHA-256
`794059fbb2ede05d959a20f2608863a7eb3293ffaefb7009c8407c71a51b15c3`), a
sibling record, never a source to mine. The subject is the register's
existing rows, the failures and conditions since receipt 050, the fork's
eight items read against the code each names at `a6b68245` and against the
fork's committed planning document, read on the operator's machine without
a write (`DotLn-Instance`, `main` at `60a1a76`, clean), and the operator's
request read against the Entropy Reducer's code. The two settings files
the fork's pass asked the operator to edit were read for the presence of
the three named patterns only, as counts (all three absent), never copied;
this checkout's ignored host observation logs were read by row kind only.
This document is planner synthesis of public repository evidence; the
clean-room screen found no suspect material: the fork is the operator's
own public instance, its target the public repository it is, and no target
code or employer material enters.

Entry was clean `main` at `a6b68245`, WO-218 closed (v0.87.0; canonical
status reads `closed` with legal next `release-close, next, activate`) and
no active order. The pass runs on
`planning/2026-10-20-fork-answers-and-entropy-targets`, created by `plan
start`. Only the parent writes this planning checkout.

Fan-out, planned against `subagentCap` 20 with 0 admissions observed at
entry: one background refuter after the subject is committed; no research
worker, because every input is a repository record on this machine, the
fork's committed document or this checkout's ignored journals read by
kind. The planner wrote every artifact.

Aim, as read: file, decline or defer each of the fork's eight items with
its reopening condition and name the owning surface; decide the Entropy
Reducer request the same way; answer the operator's question about
resuming work in the fork. Traps named before the material choices:
reading the fork's items as operator direction (they are evidence the
operator carried; the direction is the dispatch's "file, decline or
defer"); adding the fork's five code-level observations to WO-219 because
it owns role text and hooks (its size row, FUP-524a82332e21e127, names the
cost, and the fork would wait two batches for a gate repair it is blocked
on today); filing one order per observation (the fixed cycle is the cost;
the five observations are what one instance meets taking one release);
recording the host's behavior without the trust entries as observed (the
operator's second message corrects that reading: nothing has run since the
removal); reading the operator's settings beyond the three named patterns
(counts only); and the NoOp of leaving the fork's document-gate failure to
the next order that edits `docs-check.mjs`, which would hold the fork at
v0.85.0 for two batch cycles.

## 2. Entry observations

`plan start` and `plan failures` in the window since receipt 050
(2026-10-20T20:41:15Z): 0 items; 0 failed verifications, 0 failed final
reviews, 0 repairs, 0 orders made ready, 0 failed first verifications, 0
corrections, 0 off-ramps and 0 amendments. The record totals stand at 148
failed verifications, 22 failed final reviews, 173 repairs, 180 orders made
ready, 87 failed first verifications, 181 corrections, 6 off-ramps (4
`CriterionWaived`, 2 `OperatorOverrideRecorded`) and 78 amendments (1
withdrawn). The sixteen measured final reviews of the ten most recent
orders recorded 184 escapes, 11.5 per review. Local records: 0 release
closes, 0 host denials, 4 interventions (3 unclassified), 0 long phases, 0
repeated gate rows, 2 failed gate rows (unassigned) and the eight recent
closes split five delivery and three machinery. No final review passed
since REVIEW-007 ended (20:00:55Z). The register held 163 pending rows at
entry (1 open, 162 deferred, 0 untriaged) of 1,221, at revision
`513e292a…`. No reader run is due (`readerDue` false; seven unscored
releases on an unchanged profile). Process cost at entry: `harness usage`
read 96,540 total tokens (73,454 cached, 22,216 cache-write, 866 output;
source claude-transcript-message-usage, scope dispatch, observed
2026-10-20T20:51:25Z; cost unknown, counter unavailable).

**Routing the failed reports.** None failed in the window; nothing closed
since receipt 050, so no boarded row and no lifecycle-opened reopening
condition is new to this pass.

## 3. Reopening observations

`plan conditions` at 20:53Z (37.2 s; load 2.5 on 16 CPUs):

| Measure | Observation | Threshold | Holds |
| --- | --- | --- | --- |
| Plan check, median of three | 4.921 s | 8 s | no |
| Release table lag | 0 tags | 3 tags | no |
| Latest two closed orders, distinct evidence blob bytes | 2,509,079 and 1,205,251 | 1 MB in two consecutive orders | yes (unchanged) |
| Evidence path growth since Monday 00:00 UTC | 4,841,097 bytes | 10 MB | no |
| collectSources | 0.823 s | 3 s | no |
| Uncached release listing | 3.560 s | 10 s | no |
| status --all --json | 6,499,372 bytes | 32 MB | no |
| Work-order index | 1.914 s | 10 s | no |
| Document gate and docs-check (`--slow`) | not measured | 30 s / 15 s | unknown |
| Plain gate, thirty-day median | 300.5 s | 360 s | no |
| gate-task vertical | 722.7 s against a 753.9 s median (74 samples) | 1,130.8 s | no |
| gate-task vertical:file:test-vertical.mjs | 723.5 s, no earlier sample | none | unknown |
| gate-task target-worktree | 611.3 s against a 126.6 s median (38 samples) | 189.8 s | yes (unchanged) |
| gate-task vertical:file:test-vertical.mjs:statements | 549.9 s against 491.1 s | 736.7 s | no |
| gate-task vertical:file:test-vertical-judgment.mjs | 476.9 s against 469.2 s | 703.8 s | no |
| coldStartBytes.executor | 29,213 | 24,576 (WO-150-D003) | reopened; the ceiling is 29,246 |

**The two holds are the entropy pass's.** The evidence row reads the same
two orders (WO-222 and WO-218) the 2026-10-20 entropy pass read an hour
earlier and re-deferred under a condition that separates required records
from captures (FUP-8a4e201d861208ad; its §5.3); nothing closed since, so
the new condition is not read as occurred. The `target-worktree` row's
latest fresh sample is still the pre-split task's, answered by WO-222's
file lanes (the 2026-10-19 fork-requests pass §3); no new sample exists.
The cold start is 29,213 bytes, 33 under its ceiling, the operator's
reserved efficiency pass (FUP-f1c7a256bec46737, open, unchanged reading).
The order-size rule has no new close to read. No deferred row whose
reopening condition opens with a lifecycle event fired, because no order
moved since receipt 050.

**One decision condition occurred.** WO-218-D041 (moved verification,
final-review and decision records resolve through their immutable target
binding) reopens when "a moved report stops resolving"; the fork's
document gate at v0.87.0 fails on `docs-check`'s read of a moved decisions
record (§4, item 4). The condition is consumed by WO-223.

**Rows read and left.** FUP-da505c82f2262b8e (a second sign-off-exempt
author identity) reopens on "the operator's answer, or the next refused
publish": the fork pre-empted its refusal by declaring the identity in its
WO-012, so no publish was refused and the row stays deferred.
FUP-524a82332e21e127 (WO-219's size) is the reason this pass adds no row to
WO-219 (§4). FUP-c7f181269a96c4c5 (the reviewer on a cadence) is
unchanged: WO-224 adds a subject, not a schedule. The five rows `followups
--touching` lists for the files the two new orders name
(FUP-005a8af5234cb3f3 and FUP-bfab19adc5e5eac1 on the protocol file, which
WO-224 leaves unchanged by design; FUP-da505c82f2262b8e on
`contributions.mjs`, whose rule WO-223 does not change; FUP-edefd92233980b63
on WO-221; FUP-fa028783f3f6b17f on `meta.mjs`'s attribution, which WO-223
does not touch) are matches by name, not by seam, and are left as they
are.

## 4. The fork's answers and observations, decided

The fork's pass of 2026-10-20 took starter v0.87.0 as a draft update pull
request (its #14) because the kit's document gate fails on its moved
records, filed WO-012 for what v0.87.0 lets it declare, read the WO-005
episode for core's qualification row, and wrote the eight items below (its
§12). Each item was read against the code it names at `a6b68245` and
against the fork's committed §4, §7 and §11. The operator's two mid-turn
messages change item 1's standing: the three removals happened after the
episode and nothing has run since.

| Item | Reading at `a6b68245` | Disposition |
| --- | --- | --- |
| 1. The Claude Code qualification row | the fork's §11 is complete in the shape core asked for; the host's behavior without the entries is unobserved | written into `docs/evidence/WO-221/host-qualification.md` by this pass; no row |
| 2. The publish spelling and the journal | the hook admits only the node spelling since v0.87.0 (`registeredTargetAdmission`); the kit README's session form is still the npm spelling; core's role text names no target form | product 07 states the spelling and the journal reading (this pass); the kit README is WO-223 step 4 (FUP-d46ad41337290ed2) |
| 3. The release-close helper's byte-exact form | `releaseCloseCommand`'s print; the advisory is reached only after the prefix matched; this checkout's journals hold 38 admitted and 50 withheld rows | the advisory prints the expected spelling and the mismatch class: WO-223 step 6 (FUP-d46ad41337290ed2) |
| 4. docs-check on moved records | confirmed: `checkDocs` calls `readListed(root, row.path)` on a moved row; core has no moved record and the fixture never runs `checkDocs` | WO-223 step 2 (FUP-c944c20ce5477b28), position 1 of the sequence |
| 5. The gates in a secondary worktree | confirmed: `readTargetRecord` falls back to `mainWorktree(root)` and nothing else | the reader reads the primary checkout through the common Git directory before the main worktree, and the README states the arrangement: WO-223 steps 3 and 4 (FUP-24c8306abf8c5db3) |
| 6. The sign-off rule's declaration | confirmed: nothing names `contributions.operatorAuthor` before the publish; the kit's action kinds cannot carry it | a `worktree start` advisory and the FAIL line: WO-223 step 5 (FUP-78a266a47859fdf1); the preview action declined |
| 7. The 72-character limit | the pre-review lint is WO-218 D019 (`r18-commit-lint`), not D043 (the gitmoji admission); the refusal names the rule and not the limit | the refusals print the length and the limit: WO-223 step 7 (FUP-56008da3fb2468ac); the role-text sentence declined |
| 8. Confirmations | each confirmed by id against core's record; the fork's `FUP-4c3c0351adc4c2cc` is its own register's id (unknown here) and waits on core's FUP-2304d46e6feb711b in WO-219 | nothing changes |

**1. The qualification row.** The fork's §11 carries every field core's
2026-10-19 answer asked for: the host version (2.1.304), auto mode with
the two interim `autoMode.environment` entries and the launchpad-local
`Bash(node *)` and `Bash(gh pr create:*)` allows present, `hostRules`
absent; the draft publish at `verified` through the npm spelling,
classed `lifecycle.run` and allowed with no `registeredTargetAdmission`
row in any journal, no prompt, the draft pull request; the closed-phase
publish refused by the kit's own outward lint on a 90-character subject
and done by hand; the close carried by host permissions after
`byte-exact helper spelling missing`, as at the instance's two earlier
closes; no `HostPermissionDenied` row; the base checkout untouched and the
target worktree's declared output deleted. The row is rewritten from it,
with one standing paragraph the operator's messages supply: the three
settings removals were made on 2026-10-20 at the end of the fork's
planning pass (this pass read both files for the three patterns and found
none), no lifecycle command has run since, and the fork's WO-006 draft
publish under the node spelling is the first observation of the host after
a hook admission alone; that episode rewrites the row again. The Codex
and Copilot rows stay blocked, as `host-qualification.md` says until an
episode runs on each. The file is the record WO-221 designated for this
("a row is rewritten from the episode's observations when it has run") and
the 2026-10-19 pass committed core to the rewrite; it is not an immutable
report.

**2. The spelling and the journal.** `registeredTargetAdmission`
(`packages/skeleton/src/harness-host.ts` line 1585) admits the helper only
as `node scripts/worktree.mjs publish WO-NNN --target-worktree …` (or the
same with the node binary's path) run from the launchpad root, and
withholds every other shape, the `npm run worktree -- publish` form
included, with `use the node spelling of worktree publish; raw git, gh and
npm receive no registered-target admission` (line 1608; WO-218 D062). A
session that ran the npm form reads, at v0.85.0, the ordinary PreToolUse
row the hook writes for every admitted command, `effect: "lifecycle.run"`
and `allowed: true`, and no `registeredTargetAdmission` row, which is
exactly what the fork found; at v0.87.0 it reads an `advisory` row carrying
the withholding text. Product 07 now says both (§Operator resume phrases,
the target publish sentence; §Workflow closeout and releases, the
registered-target paragraph). The kit README still says "The session form
is `npm run worktree -- publish WO-NNN --target-worktree …`"
(`scripts/kit/README.client.md` line 147) six lines before it says the
hook admits only the node spelling; that sentence is WO-223's (step 4).
Core's own role text names no target publish form (the reviewer's names
the launchpad form); the fork's instance profile did, and its 2026-10-20
pass rewrote it (its §13). No role-text row.

**3. The byte-exact form.** The hook admits `releaseCloseCommand`'s print
(`scripts/lib/git.mjs` line 252): the quoted `process.execPath`, the quoted
`scripts/release.mjs` of main, `close WO-NNN` and exactly `--publish`,
`--dry-run`, or `--publish` followed by canonical `--material '<path>=disposable|preserve'`
words, compared with the hook's own `process.execPath` and the main
checkout's path. The advisory `byte-exact helper spelling missing` is
returned only after the node path, the script path and the order word have
matched (`releaseCloseAdmission`, lines 1245 to 1271), so every such row
records a mismatch after the order word: more words, a shell operator or
redirect, or a material word spelled otherwise. This checkout's ignored
host observation logs, read by row kind only, hold 38 admitted
`releaseCloseAdmission` rows and 50 of these withheld rows; the fork's
three closes were all withheld and carried by host permissions. The
cheapest rung is the advisory saying what it expected: WO-223 step 6 makes
it print the `--publish` and `--dry-run` spellings for the dispatched order
and the mismatch class, with the admitted forms unchanged and each base
admission kept by a case (receipt 049's rule for hooks). Admitting a
suffixed or piped helper was rejected: the byte-exact rule is WO-178's, and
a redirect changes what the operator sees. The next withheld close in the
fork then names what differed, which this pass cannot read from a journal
that records the advisory and not the command.

**4. docs-check on moved records.** Confirmed at the source:
`readDecisions` (`scripts/lib/meta.mjs` line 296) merges `movedDecisions`
into its rows and reads a moved row's text through `readTargetRecord`,
keeping the launchpad path as `row.path`; `checkDocs`
(`scripts/docs-check.mjs` line 448) calls `readListed(root, row.path)` for
every row, and for a moved row that path is not a regular file. The fork
observed `docs/evidence/WO-004/decisions.md: document is not a readable
regular file (ENOENT)` on its update branch at v0.87.0 before any instance
change, with the `entropy`, `reader-profiles`, `plan` and
`plan-refutation-current` checks skipped after it, and the complete run
passing 7 of 7 (its §4). Core's gate is green because core holds no moved
record, and the moved-records fixture (`scripts/test-target-worktree-publish.mjs`
line 1610) reads `readDecisions`, the decisions index and the status
projection but never runs `checkDocs`, which is why WO-218's verification
did not see it. This is the fork's blocker: its D1 holds the update as a
draft until a starter release carries the repair, and WO-012 waits behind
it. It is WO-223's first step and the reason WO-223 runs first.

**5. The secondary worktree.** `readTargetRecord`
(`scripts/lib/target-record-reader.mjs` lines 56 to 61) reads the ignored
clone mapping from the running checkout and then from `mainWorktree(root)`
(`scripts/lib/git.mjs` line 231), which throws `no main-branch
control-plane worktree found` when no worktree has `main` checked out; a
secondary worktree never holds the mapping. The fork's arrangement
(primary checkout on a planning branch, the update branch in a secondary
worktree) therefore cannot run `npm run sync`, `docs-check` or the planning
checks there, and the fork ran them with the primary checkout on `main`
beside the branch's worktree (its §4). The answer to its question is both
halves: the reader reads the running checkout, then the primary checkout
(the worktree whose Git directory is `git rev-parse --git-common-dir`,
where `worktree clone` is run in every recorded instance and where the
mapping lives whatever branch is checked out), then the main-branch
worktree, and refuses naming the three and the arrangement; and the kit
README states the arrangement. Moving the mapping into the common Git
directory itself was rejected: every ignored lane lives under the
configured control root, and the hook's admission reads main's lane by
design. WO-223 steps 3 and 4.

**6. The sign-off declaration.** `contributionSignoffRules`
(`scripts/lib/contributions.mjs`) runs at the launchpad publish
(`scripts/worktree.mjs` line 1231) over `origin/main..HEAD` and fails every
commit by an author other than `contributions.operatorAuthor` without a
matching trailer; its FAIL line names the trailer and `git commit --amend
--signoff`, not the declaration. The update preview printed `No instance
actions declared` because `scripts/kit/KIT-ACTIONS.json` holds
`actions: []`, and `readKitActions` (`scripts/launchpad.mjs` line 1572)
admits only `rename-root`, `add-config-field` and `change-phrase`, none of
which can carry an identity the kit does not know; the v0.87.0 notes name
the key in prose. The fork read the rule at its source and declares the
identity in WO-012 before its first publish under v0.87.0 (its D2). The
shape that reaches every instance at the moment before any commit: one
`worktree start` advisory when the key is undeclared, and the FAIL line
naming the key beside the trailer route. A new action kind for the preview
was rejected (axis: the schema; a kind without a value), and role text was
rejected (the executor root had 33 and the reviewer 85 bytes of headroom at
receipt 050). WO-223 step 5. FUP-da505c82f2262b8e (the GitHub "Update
branch" commits as a second exempt identity) is a different question and
stays deferred.

**7. The limit.** The fork cites WO-218 D043 for the pre-review commit
lint; D043 is the gitmoji admission (FUP-98aeb43c543dfbaf). The lint before
`final-review-result pass` is WO-218 D019 (FUP-c9dc1abccd1f1a9d, control
`r18-commit-lint`), in `scripts/lib/target-commit-lint.mjs`, and it refuses
naming the rule ids only (`subject.length`); the limit, 72, is
`subjectLengthLimit` in `scripts/lib/outward-lint.mjs` line 7 and appears
in no product document or role text. At v0.85.0 the fork's final publish
was refused at the publish-time lint; at v0.87.0 the same subject is
refused before the pass is recorded, still without the number. The refusal
prints the length and the limit: WO-223 step 7. Naming 72 in the reviewer
role text is declined: the refusal arrives when the subject is written, and
the reviewer root is 85 bytes under its ceiling.

**8. Confirmations.** `release.displayName`, `baseDisposablePolicy`
`judge-only`, `contributions.operatorAuthor` and `historicalWorkOrders`
are v0.87.0's grammar (WO-218 D044, D042 and their notes); no starter tag
arrives under `remote.upstream.tagOpt --no-tags`, which is the interim
route the 2026-10-19 pass named and WO-218 made unnecessary for a fresh
fetch; the carried items keep their dispositions by id. The fork's
`FUP-4c3c0351adc4c2cc` is an id of the fork's register (core's
`followups --show` answers "Unknown follow-up identifier"); the core row it
waits on is FUP-2304d46e6feb711b, allocated to WO-219 step 17. Nothing to
file.

**Where the five observations go.** All five land on one subsystem, what
an instance meets taking v0.87.0 and publishing under it (the document
gate on moved records, the moved-record reader, the launchpad publish's
sign-off rule, the two hook admissions' advisories and the kit README, the
commit lint), which is WO-218's closed subsystem. The entropy pass placed
WO-218's own boarded rows in WO-219 as a named exception and recorded
WO-219's size as a row with a reopening condition; adding five more and
making the fork wait behind WO-217 and WO-219 for a gate repair it is
blocked on today was weighed and rejected. One order, WO-223, takes the five as one outcome (an instance with moved records takes a starter update without a step the kit did not name; the gap was observed at v0.87.0 and the repair ships in the next release), runs first, and the fork takes the starter release it produces
into its existing draft pull request (its D1). The 2026-10-13 sizing rule
is applied as written: a chain on one subsystem as one order; unrelated
subsystems not bundled.

## 5. The Entropy Reducer on a workstream's repositories

**The request.** The operator wants to run the Entropy Reducer against a
registered target repository at a recorded commit, or against a
workstream's set of repositories, with the discipline the launchpad review
has (a frozen subject, the pinned reviewer, blinded refutation, immutable
receipts, operator disposition into the launchpad's register with rows that
can target the workstream's orders), exported in the kit so a fork can run
it; the target is the operator's own repository, so the clean-room floor is
unchanged. The operator found no order or register row planning it and
asked this pass to decide it.

**The observation, confirmed at `a6b68245`.** `freezeSubject`
(`scripts/lib/entropy-review.mjs` line 334) clones the launchpad and
detaches at the subject commit; `resolveSubject` (line 363) resolves a
revision of the launchpad; `subjectRecord` (line 373) writes `repository:
"."`; `beginEntropyReview` (line 1084) takes only a launchpad revision;
`beginEntropyRefutation` (line 1455) freezes the launchpad again at the
review's commit; `scripts/entropy.mjs` offers `review [<commit>]` and no
repository or workstream flag. The compiled program is a census of the
paths `git ls-files` names in the frozen copy
(`packages/skeleton/src/entropy-review-protocol.ts` line 438), and the
loadout compiles against whatever `repo` path it is given
(`compileReviewerWorkOrder`, line 1251). A registered target repository is
a separate clone under the registration's `worktreeParent`, recorded in
the ignored clone map (`scripts/lib/target-worktrees.mjs`), so it is never
in the subject. The subject schema (`assertEntropySubject`, line 149)
requires `repository` to be a string and nothing more, and the fixture
asserts `"."`. The kit template `scripts/kit/workstream.template.md`
carries a `dotln-workstream` JSON block whose `members[].repositoryId`
names a workstream's repositories; the fork's `WS-001` has that shape.
No order and no register row plans the target or workstream subject
(grep over `docs/work-orders/`, the map and `docs/product/`; WO-193 names
Entropy Reducer packets as a request source; FUP-c7f181269a96c4c5 is the
cadence candidate). `scripts/entropy.mjs` and `scripts/lib/entropy-review.mjs`
are kit files (declared machinery sources of `launchpad-planning`), which
is why the fork can review its launchpad.

**The decision: filed as WO-224.** The request is the operator's
direction, the mechanism is a parameterization of an existing path (one
freeze path taking the repository to clone, a subject record carrying the
registration id, the explicit-commit binding the launchpad review already
has for a named commit, receipts and candidate headings naming the
repository and commit), and the register already allocates any row to any
order of the launchpad, so "rows that can target the workstream's orders"
needs the receipt to name the target and nothing new. A workstream review
is one episode per distinct member repository in sequence (the launchpad
when a member names `self`), one receipt each carrying the workstream id;
a composite frozen root was rejected because the compiled census runs in
one repository and a composite copy is no repository anyone can name
later. The subject-schema and loadout files are left unchanged by design,
because the protocol file is a judged feedback source and a registered
evidence source (a change owes the editions' re-mint and one live feedback
episode, which the order's Cost line names for the case a step must edit
it). The surfaces that own it: `scripts/lib/entropy-review.mjs` and
`scripts/entropy.mjs` (the subject, the freeze, the binding, the
refutation, the disposal heading, the workstream reader and the flags),
`scripts/test-entropy-review.mjs` (fixture cases over a fixture launchpad
with a registered fixture target, under the `fake` transport),
`docs/instance/entropy-reducer/README.md` (the subjects), product 07
§Operator-opened planning pass (the phrase with a subject token), product
05 (the identity's subject) and product 12 (a workstream's repositories as
one subject set). WO-219 step 22 edits `freezeSubject` for ER7-001 (the
frozen copy's route home) and WO-080 settles the workstream convention;
both are referenced with no typed edge, and WO-224 is placed after WO-080
so that the guard lands before a target is frozen and the convention is
final before it is read. Cost: about 993 s and USD 9.50 per episode at the
pinned actor by the REVIEW-002 observation, USD 9.32, 5.03 and 7.21 per
pair for REVIEW-005 to REVIEW-007, paid once per member repository; the
fixtures run fake, and the first live target review is the operator's own
`planning: entropy reducer` dispatch with a subject. The NoOp would leave
the discipline at the control plane while the fork's product code
accumulates in DotLn-Angular, which is the operator's stated reason.
Deferring until WO-083's real run shows where entropy accumulates was
weighed and rejected: the operator has the evidence of their own
repository, and the kit is the delivery.

## 6. Orders filed

Two orders, each with `Model:` and three-role `Effort:` lines, a `Cost:`
header naming additions and removals, provenance naming the capture, a
dated observed gap, a Design naming rejected alternatives and the axis each
differs on, criteria whose last names both gates, a Preflight line, an
execution plan whose steps name a file and a check, known issues,
non-goals and operator-review assumptions:

| Order | Outcome | Hard edges | Placement |
| --- | --- | --- | --- |
| [WO-223](../work-orders/WO-223-an-instance-takes-a-starter-update.md) | an instance with moved target records takes a starter update and publishes under it without a step the kit did not name (the gap observed at v0.87.0; the repair ships in the next release): `checkDocs` reads a moved decisions record through its binding; the moved-record reader finds the clone mapping from any worktree; `worktree start` and the sign-off FAIL line name the declaration; the release-close advisory prints the expected spelling and the mismatch class; the commit lint names its limit; the kit README spells the admitted helper | WO-218 and WO-221 (closed) | position 1, before WO-217 |
| [WO-224](../work-orders/WO-224-entropy-reducer-on-a-registered-target.md) | the Entropy Reducer reviews a registered target repository at a recorded commit or a workstream's repositories, frozen as the launchpad is, with the pinned reviewer, the blinded refutation, immutable receipts in the launchpad and dispositions into its register, one episode per member, in the kit | WO-151, WO-165, WO-071 (closed); WO-219 and WO-080 reference-only | after WO-080 |

The screens of product 07: both orders ship code and say so, and no cited
design assigns either work it does not take; no criterion reads natural
language (each names a command, a case, a control or an exact output);
the live-run surfaces exist and were read today (WO-223's five
observations at their sources and in the fork's run; WO-224's freeze path,
subject schema, loadout entry and the fixture helpers, with the first live
run named as the operator's); WO-223's criteria 1 and 2 name the paired
control in the shape WO-218's repair filed, as the 2026-10-20 screen
requires; WO-223 names the host behavior it does not observe (criterion 4
keeps the base admissions by a case, and the hook's `allow` after the
fork's removals is the fork's episode); WO-224's criteria name the `fake`
transport and the pinned actor's cost per repository for the live run.
Each Preflight token was resolved against the runner's declared suites
(`plan-refutation` and `entropy` for the entropy tests, `target-worktree`,
`docs-check-fixtures`, `docs-check`, `launchpad`, `launchpad-planning`,
`license-fixtures`, `worktree`, `harness-fixtures`, `outward-lint`,
`target-publish`, `skeleton`, `configuration-root`); both final criteria
name `npm test -- --review` because declared machinery sources change.

## 7. The sequence

Sixteen entries, serial: WO-223, WO-217, WO-219, WO-220, WO-080, WO-224,
WO-204, WO-192, WO-083, WO-207, WO-193, WO-183, WO-088, WO-091, WO-096 and
WO-014. WO-223 goes first because the fork's update is blocked on its
first step and every instance with moved records meets the same failure;
the batches follow unchanged in their order. WO-224 goes after WO-080,
whose workstream convention its `--workstream` form reads, and after
WO-219, whose frozen-copy guard lands before a target is frozen. Neither
placement is a dependency token; the operator may move either by one
sequence edit. The sequence's paragraphs now say why WO-223 runs first and
where WO-224 sits; its byte count is 9,960 against the accepted 12,369.

## 8. The register

The entry register held 163 pending rows (1 open, 162 deferred, 0
untriaged) of 1,221, at revision `513e292a…`. `npm run sync` regenerated
the stale meta, lineage and publication artifacts; `npm run meta` and
`followups --sync` minted the six candidates of the map's new section
(1,227 rows; 169 pending; revision `2bc13b5b…`); one batch of six
allocations applied from the ignored control lane
(`docs/control/local/apply-fork-answers-2026-10-20.json`), leaving the
register at `3e4b3977…` with 163 pending (1 open, 162 deferred, 0
untriaged; 280 allocated). The register counts an allocated row as closed,
so the pending count ends where it began.

| Row | Content | Disposition | Target |
| --- | --- | --- | --- |
| FUP-c944c20ce5477b28 | docs-check reads a moved decisions record through its binding | allocated | WO-223 (step 2) |
| FUP-24c8306abf8c5db3 | the moved-record reader finds the clone mapping from any worktree of the launchpad | allocated | WO-223 (steps 3 and 4) |
| FUP-78a266a47859fdf1 | the sign-off rule names its declaration before the first commit | allocated | WO-223 (step 5) |
| FUP-d46ad41337290ed2 | the admission advisories and the kit README spell the admitted helpers | allocated | WO-223 (steps 4 and 6) |
| FUP-56008da3fb2468ac | the commit lint names its limit | allocated | WO-223 (step 7) |
| FUP-3687a15aef2b62f4 | the Entropy Reducer reviews a registered target repository or a workstream's repositories | allocated | WO-224 |
| FUP-da505c82f2262b8e, FUP-524a82332e21e127, FUP-c7f181269a96c4c5, FUP-8a4e201d861208ad, FUP-f1c7a256bec46737 | read in §3 | left as they are | — |
| FUP-005a8af5234cb3f3, FUP-bfab19adc5e5eac1, FUP-edefd92233980b63, FUP-fa028783f3f6b17f | `--touching` matches by name, not by seam (§3) | left as they are | — |

Each allocation's reason names the step and criterion and its reopening
condition names the order's withdrawal or re-sequencing and the
observation that would show the fix did not land.

## 9. Decisions and NoOp records

Prose records in the `NoOpIntent` shape: `kind: NoOp`, a `reason`, cited
`evidence`, `reevaluation` cadence and `usefulWhen` condition.

| NoOp | reason and evidence | reevaluation | usefulWhen |
| --- | --- | --- | --- |
| Adding the fork's five observations to WO-219 | WO-219 holds 50 rows with two named exceptions and a size row (FUP-524a82332e21e127); the fork would wait behind WO-217 and WO-219 for a gate repair it is blocked on today. Evidence: §4. | At WO-223's close. | WO-223 is withdrawn, or the operator wants the batches first. |
| One order per observation | Five cycles for five observations on one subsystem; the 2026-10-13 sizing rule takes a chain on one subsystem as one order. Evidence: §4, §6. | At WO-223's first verification. | That verification fails on more than two of the five, or the operator wants one shipped alone. |
| A kit action for the sign-off declaration | `readKitActions` admits three kinds, none carrying a value the kit does not know; the `worktree start` advisory reaches every instance before any commit. Evidence: §4 item 6. | At WO-207 (the update channel). | An instance's first publish under a release carrying WO-223 is still refused without an earlier advisory. |
| Role text for the limit or the publish spelling | The refusal and the advisory arrive at the moment of use; the executor root had 33 and the reviewer 85 bytes of headroom at receipt 050; core's role text names no target publish form. Evidence: §4 items 2 and 7. | At WO-219's close. | A reviewer is refused on `subject.length` twice in one order after WO-223, or a role names the npm form. |
| The clone mapping in the common Git directory | Every ignored lane lives under the configured control root and the hook reads main's lane by design; the reader's lookup order answers the fork's case. Evidence: §4 item 5. | At WO-223's close. | An instance layout has no primary checkout holding the mapping and no worktree on `main`. |
| Admitting a suffixed or piped release-close helper | WO-178's byte-exact rule; a redirect changes what the operator sees; the prefix already matches in every withheld row, so the advisory can say what differed. Evidence: §4 item 3. | At the next withheld close after WO-223. | The advisory shows a class of mismatch the role text cannot avoid. |
| Rewriting WO-221's Codex and Copilot rows | No episode has run on either host; the file says a row is rewritten from an episode. Evidence: §4 item 1. | When the fork runs a target order under Codex or Copilot. | Such an episode is recorded. |
| Reading the operator's settings beyond three patterns, or the journals beyond kinds | The floor keeps settings and journal contents out of every committed surface; counts answered the question. Evidence: §1. | Each pass that reads a host record. | A question needs a field no count answers. |
| Placing WO-224 before the batches or before WO-080 | The workstream convention and the frozen-copy guard land first; the fork gains the capability at the first starter release after the close either way. Evidence: §5. | On the operator's sequence edit. | The operator wants the target review before WO-080 and WO-219 close. |
| A composite multi-repository frozen root | The compiled census runs in one repository; a composite copy is no repository anyone can name later. Evidence: §5. | At WO-224's first verification. | A workstream review needs cross-repository probes the per-repository episodes cannot make. |
| A review cadence (FUP-c7f181269a96c4c5) | WO-224 adds a subject, not a schedule; the row's reading of 2026-10-20 stands. Evidence: §3. | Each entropy pass. | The operator asks for a cadence. |
| Deferring the target review until WO-083's run | The operator has the evidence of their own repository and asked for the decision now; the kit is the delivery. Evidence: §5. | At WO-224's close. | The fork's first live target review finds nothing a lifecycle gate had passed, twice. |
| A local patch of the fork's `docs-check.mjs` | The fork's own D1 rejected the true-fork path; core's answer is the release WO-223 produces. Evidence: §4 item 4. | At WO-223's close. | WO-223 slips past the fork's next planned order and the operator directs the patch. |
| A research worker | Every input is a record on this machine, the fork's committed document or code read inline. Evidence: §1. | Each pass that reads the fork. | A request needs a host page or a run this pass cannot read. |
| A reader run | Profile unchanged; `plan start` reported none due (seven unscored). | Every planning entry. | A changed profile with three unscored releases, or the operator's word. |
| Re-recording the open cold-start row | 29,213 against 24,576, unchanged; the operator's reserved efficiency pass. Evidence: §3. | Every planning entry. | A role text changes the reading, or the operator opens the efficiency pass. |
| Re-basing the `target-worktree` median; an evidence ceiling | The same stale sample and the same two orders the entropy pass read; no close since. Evidence: §3. | Each planning entry. | As each row records. |

## 10. Write-backs

- Product 07, three sentences: §Operator resume phrases (the target
  publish sentence now spells the admitted helper and names the withheld
  npm form); §Workflow closeout and releases (the registered-target
  paragraph now says what a session that ran the npm form reads from its
  journal at v0.85.0 and at v0.87.0); §Operator-opened planning pass (the
  `planning: entropy reducer` paragraph now says the subject is the
  launchpad and that a target or workstream review is WO-224's).
- `docs/evidence/WO-221/host-qualification.md`: the Claude Code row
  rewritten from the fork's episode with the standing paragraph of §4 item
  1; one known issue added. The Codex and Copilot rows unchanged.
- The map: the candidates section recorded 2026-10-20 (second pass) with
  six items; catalog rows for WO-223 and WO-224; WO-221's row names the
  rewritten qualification row.
- The sequence (§7); the ledger's registration heading;
  `docs/control/doc-ceilings.json` (§11); the register (§8); the generated
  work-order index, lineage index and publication lock (`npm run sync`,
  `npm run work-orders -- index`).
- Not written: the kit README (a kit file; WO-223 step 4), the review
  guide (WO-224 step 10) and the roadmap's release table (no release since
  the entropy pass).

## 11. Document ceilings

Product 07 measured 233,673 non-exempt bytes after this pass's three
sentences (232,739 at the entropy pass); its ceiling is set at that size
plus one tenth, 257,041, with this section as the decision. Every other
product document is unchanged since the entropy pass and keeps its
ceiling. No order carries a byte bound.

## 12. Goal alignment and cost

The win condition the sequence names is progress in core, the starter, the
fork, DotLn-Angular and DotLn WoW Forever at the same time, without
babysitting, with feedback and bugs routed to where they belong and acted
on. This pass routes the fork's five code-level observations to one order
at the head of the queue, so the fork's blocked update leaves its draft
after one core release rather than after three batches; answers the
fork's two questions (the byte-exact form, the reader's arrangement) with
the record and a repair rather than a README note alone; writes the
qualification row core asked for into the record WO-221 designated; and
turns the operator's request into an order whose mechanism is a
parameterization of the existing review path, with the fork as its first
user. Cost: two order cycles (WO-223 small, WO-224 moderate), no
amendment to any existing order, and three product sentences. Lenses that
changed the plan: shifting the burden (the advisories say what they
expected and the start says what the publish will require, so the operator
stops carrying the kit's spelling in their head); rule beating (WO-223's
criteria name the paired control, so a case that passes at the base
settles nothing); seeking the wrong goal (the preview action and the role
text were declined for the cheaper rung at the moment of use); and
process activity is not progress (the fork's confirmations are confirmed
by id, not re-opened). The NoOp would leave the fork at v0.85.0 until
WO-219 closes, every instance with moved records failing its gate on
taking v0.87.0, and the Entropy Reducer stopping at the control plane.

Process cost for this pass: `harness usage` at entry read 96,540 total
tokens (§2); at the end of drafting, 5,871,512 (5,288,776 cached, 452,007
cache-write, 130,045 output; 98 steps; 0 subagents, 20 remaining;
observed 2026-10-20T21:26:48Z; cost unknown, counter unavailable). The
counters at the receipt and the final figures are in §13 and the response.

## 13. Validation and independent judgment

Checks run on the working tree after the last write of the subject:
`npm run sync` (meta, lineage and publication regenerated); `npm run meta`
(no budget breach; `sequenceBytes` 9,960 against the accepted 12,369);
`npm run plan -- followups --sync` and `--apply` (§8); `npm run work-orders
-- index` and `--check` (both pages current); `node scripts/docs-check.mjs`
(product 07 at 233,673 bytes; the operator-word advisories unchanged from
the entropy pass's 28, none from this pass's documents). The refutation,
the cost table (`npm run meta -- --plan-cost`, which needs the committed
orders) and the final `npm run test:docs` are recorded below once run.

## Appendix A. The answer for the fork's next planning pass

The operator pastes the block below into the fork's planning session; it
carries core's dispositions of the fork's eight items of 2026-10-20, the
decision on the Entropy Reducer request, and the answer to the operator's
question about resuming work. Each item names the record it rests on.

```text
planning: answers from core's 2026-10-20 fork-answers pass (DotLn main once its pull request merges; docs/planning/fork-answers-and-entropy-targets-2026-10-20.md) to this fork's items of 2026-10-20 (latest-upstream-and-core-answers-2026-10-20.md §12). Read each against the named record and decide each in this pass.

1. The Claude Code qualification row: written into core's docs/evidence/WO-221/host-qualification.md from §11, with the standing that the three settings removals were made after the WO-005 episode (verified absent on 2026-10-20) and nothing lifecycle has run since, so WO-006's draft publish under the node spelling is the first observation of the host after a hook admission alone. Record for it what core's 2026-10-19 answer listed, plus: whether the classifier asked, which command, who answered, and the journal row's kind for the node-spelled helper (a registeredTargetAdmission row, or an advisory row with its text). Core rewrites the row again from it.

2. The spelling: node scripts/worktree.mjs publish WO-NNN --target-worktree … from the launchpad root is the only admitted form since v0.87.0; npm run worktree -- publish is withheld with an advisory naming the node spelling. A session that ran the npm form at v0.85.0 reads the ordinary PreToolUse row (effect lifecycle.run, allowed true) and no registeredTargetAdmission row; at v0.87.0 it reads the advisory row. Core's product 07 says so; the kit README's "session form" sentence is corrected by core's WO-223 (register row FUP-d46ad41337290ed2). Keep the node spelling in WO-006's steps, as your C1 planned.

3. The release-close helper: the byte-exact form is exactly what npm run resume -- release-close prints (the quoted node path, the quoted scripts/release.mjs of main, close WO-NNN, then --publish or --dry-run, or --publish with canonical --material words), run with no words after it, no redirect, no pipe. The withheld advisory is reached only after the node path, the script path and the order matched, so your three closes differed after the order word; core's own journals hold 38 admitted and 50 withheld rows of the same kind. WO-223 makes the advisory print the expected spelling and the mismatch class (FUP-d46ad41337290ed2); the next close names what differed.

4. docs-check on moved records: confirmed and allocated to WO-223 (FUP-c944c20ce5477b28), position 1 of core's sequence, with a fixture instance that has moved records and the control failing at the base. Your D1 stands: #14 stays a draft until the starter release that carries WO-223; then merge it into the same branch, re-run the gates, mark ready, merge, bootstrap, and WO-012 can activate.

5. The secondary worktree: both halves. WO-223 (FUP-24c8306abf8c5db3) makes readTargetRecord read the clone mapping from the running checkout, then the primary checkout found through git rev-parse --git-common-dir, then the main worktree, with a refusal naming all three, and the kit README states the arrangement. Until then: run the gates from the primary checkout, or keep a worktree on main that holds the mapping, as you did.

6. The sign-off declaration: WO-223 (FUP-78a266a47859fdf1) adds one worktree start advisory when contributions.operatorAuthor is undeclared and makes the FAIL line name the key; a preview action was declined (no admitted action kind carries an identity the kit does not know). WO-012's declaration is the right route and needs nothing more.

7. The 72-character limit: the pre-review lint is WO-218 D019 (control r18-commit-lint), not D043 (the gitmoji admission). WO-223 (FUP-56008da3fb2468ac) makes both refusals print the length and the limit; the reviewer role text does not name it and will not (cold-start headroom; the refusal arrives when the subject is written). Keep subjects at or under 72 characters until then.

8. Confirmations: acknowledged by id; FUP-4c3c0351adc4c2cc is your register's id, and the core row it waits on is FUP-2304d46e6feb711b in WO-219 (open, second batch).

9. The Entropy Reducer on a workstream's repositories (the operator's request): filed as core's WO-224 (FUP-3687a15aef2b62f4), placed after WO-080 and WO-219: npm run entropy -- review --repository <id> [<commit>] and --workstream WS-NNN freeze the registered clone at a recorded commit as the launchpad is frozen, with the pinned reviewer, the blinded refutation, immutable receipts in the launchpad whose subject names the repository and commit, and dispositions into the launchpad's register that a pass allocates to the workstream's orders, one episode per member repository (about USD 5 to 10 and 15 minutes each at the pinned actor), in the kit. WS-001 is the first workstream it will read.

Resuming work here: nothing in core blocks the fork at v0.85.0 today. Its main is clean with a green document gate, and WO-005 ran its whole lifecycle under v0.85.0. The UI planning pass (your D7) needs no kit change. WO-006 can run under v0.85.0 if this pass drops its planned hard edge on WO-012: the close is no-release under the default policy, the base checkout is judged under the default policy (it held nothing at WO-005's close), the draft publish uses the npm spelling the v0.85.0 hook classes lifecycle.run, and commit subjects stay at or under 72 characters; with the entries removed, that draft is also the host observation of item 1. WO-012 and a release titled DotLn Angular need v0.87.0 or later and wait for the starter release that carries core's WO-223: one core order cycle after core's planning pull request merges (recent orders closed within a day of activation; WO-223 is one subsystem and small), then your D1's merge into #14.
```
