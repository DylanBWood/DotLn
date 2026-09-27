# Onesie-twosie planning pass, 2026-09-27: drain the follow-up queue

Document-only planning pass on branch
`planning/2026-09-27-onesie-twosie-followup-drain` from clean `main` at
`4c34b332` (WO-166 merged and published as v0.52.3). Between work orders;
the projection lists WO-070, WO-115, WO-165, WO-085 and WO-166 closed.
Every claim below names its source; a value nobody observed is written as
unknown. The pass is dated by the repository's UTC convention: it was
dispatched at 23:55Z on 2026-09-26 and `plan start` named the branch at
00:01Z.

## 1. What was asked, and the subject

The operator's dispatch (captured verbatim in ignored intake,
`docs/intake/notes/2026-09-27-onesie-twosie-followup-drain-planning.md`)
asked for a small pass: drain the follow-up queue, fix small nagging
issues, at most two work orders, both in parallel and both next; one order
or none is an acceptable result.

The category, as this pass reads it: defects already met and boarded, small
enough that several fit one order, whose cost recurs for a session or the
operator. Inside it: register rows that name a bounded fix on a seam an
order can open cheaply. Outside it: product candidates, however ready;
hardening with no observed occurrence; anything that needs a live paid
episode. The pass stays inside that category and records what it met
outside it (§5.3).

Subject: the sequence as left by the 2026-09-25 second pass (receipts 029
and 030); the register at revision `36c3cc9a…` with 653 entries and 155
pending (13 untriaged, 2 needing review, 3 open, 137 deferred); the
decisions, verifications and final reviews of the five orders closed on
2026-09-25 and 2026-09-26; the source at `4c34b332`.

## 2. The queue, read whole

All 155 pending rows were read, the 57 decision rows with their whole
`followup` and `reopenWhen` text from the decisions files. The feed pages
at eight rows, so the rows were projected into session scratch by two
throwaway scripts (193 KB); §4 turns that chore into an order item.

| Class | Rows | What they are |
| --- | --- | --- |
| Untriaged | 13 | decisions boarded by WO-070, WO-115, WO-165, WO-085 and WO-166 |
| Needs review | 2 | a settled and an allocated candidate whose source text changed |
| Open | 3 | two operator decisions and the planner-startup measurement |
| Deferred, decision rows | 44 | boarded defects waiting for a seam or an observation |
| Deferred, candidate rows | 93 | product and pattern candidates, gathered seams, map returns |

Two measurements from product 07's register-settlement candidate: three of
the thirteen untriaged rows are in-order directives the order's own cycle
discharged and a fourth was discharged by a later order (its threshold is
ten), and untriaged rows are thirteen (its threshold is fifty). Neither
reopening observation occurred.

## 3. What nags, verified against the source

Each row chosen for an order was re-observed on `main` at `4c34b332`
before it was written into the order. A row that no longer reproduces is
settled, not carried.

| Observation | Evidence | Route |
| --- | --- | --- |
| The printed session scratch path does not exist | `harnessSessionScratch` computes the path; its four call sites print, return or judge it and none creates it (`harness-host.ts` calls `mkdirSync` in eight other places). WO-166's final review lost its first gate to the absent directory (D015). This session's directory was born 70 s after the dispatch printed it, in the second of the planner's own `mkdir -p` | WO-168 item 1 |
| A granted root follows a symlink | every grant kind resolves with `prospectiveRealpath` at judgment; a review executed the swap and a write landed outside (WO-158 D028 a) | WO-168 item 2 |
| A live gate refuses listed reads for their arguments | the built `liveGateReads` returns `null` for `git --no-pager diff HEAD~1`, `show stash@{0}`, `grep -n '<title>' f`, a quoted `%H <%ae>` format, `wc -l < a.md`, `ls docs 2>/dev/null` and `npm run --silent resume -- status`; three reports record refused reads in a gate window | WO-168 item 4 |
| Quoted globs refused in a live gate (WO-142 D018, first half) | not reproduced: `grep -n "a*" a.md` and `grep -n 'N[0-9]' a.md` are admitted by the WO-158 list | settled inside the row's allocation |
| A refused Codex dispatch keeps its reservation | `acquireHarnessWriter` places, journals, then records; `record` throws on a log that is not a regular file (WO-166 D014) | WO-168 item 5 |
| A stale built runtime throws a `TypeError` at a Codex dispatch | `reserveCodexDispatch` destructures an entry point the older build lacks; an inference from code. `main`'s own build (2026-09-26T23:53Z) holds the entry point, so the transitional case has passed | WO-168 item 6 |
| Three standing sentences understate WO-166 | `HARNESS_BOUNDARIES`; product 02's writer paragraph; product 07's index paragraph and release-close row (D016, D014) | WO-168 item 7 |
| Seam-conditioned rows fire unseen | four seams, eight rows, nine closed orders (§4) | WO-169 item 1 |
| The integration record doubles its full stop | nine decisions read "Tag observation: local snapshot only.."; the stub appends a full stop to `release prepare`'s message | WO-169 item 4 |
| The first integration pass regenerates over conflict markers | the stage is `applied` after the stash apply whatever conflicts remain (WO-138 D011); WO-165's integration met five authored conflicts | WO-169 item 4 |
| A script change does not select the suite that scans scripts | the configuration-root suite reads every non-test script and declares eight; WO-165's literal reached `main` and WO-085's repair met it (D014) | WO-169 item 5 |
| The meter calls an unset ceiling unavailable | `display(row.ceiling)` in the drift rows | WO-169 item 6 |
| `release prepare` says "no files changed" beside a changed draft (WO-142 D020) | discharged: WO-160 item 3 lists each file written (v0.51.0) | settled |
| The PR body's dispatch table is empty (WO-110 D013) | not reproduced: WO-166's PR body carries executor, verifier and reviewer rows | settled |
| The pins-only evidence test fails on a carried edition (WO-070 D011) | discharged: WO-166 criterion 6, commit `14619ee7` | settled |

## 4. Why the queue does not drain by itself

Fifty-seven of the 137 deferred rows name an order's activation, close or
landing, or "the next order that" opens a seam (a count by pattern over
the register's reopening text). Nothing shows such a row to that order:
the completion check advises about the document gate's row and the
adjacent queue, never about the register. Four seams were checked against
first-parent history since each deferral:

| Seam | Rows waiting | Orders that opened it afterwards |
| --- | --- | --- |
| `packages/skeleton/src/reactor.ts` | FUP-f12a1f894923b2b2 (deferred 2026-09-19) | WO-099, WO-151, WO-154, WO-070 |
| `scripts/lib/meta.mjs`, release preparation | FUP-fa028783f3f6b17f, FUP-526d14d44ee178b3, FUP-156ca538f603194a, FUP-b66c5b4726dc9262 (2026-09-21) | WO-155, WO-158, WO-160 |
| `resident-state.ts` with a feedback edition | FUP-4f8cd7989607ad3f, FUP-56b599e15f97e666 (2026-09-21) | WO-100 |
| WO-115's activation | FUP-4656197433cb8b3d (2026-09-25) | WO-115 |

Eight rows, nine orders, no disposition. One of the eight was even fixed
without anyone recording it (WO-160 item 3 discharged WO-142 D020). A
planning pass finds these only by reading every row and every history, as
this one did; the mechanism that would make it routine is a command that
names the rows a change touches and an advisory at completion. That is
WO-169 item 1, with the export and the batch apply that remove the two
scripts each pass rewrites (items 2 and 3).

## 5. The register: dispositions

After `npm run meta` synced this pass's five map candidates (658 entries,
160 pending), 48 rows were disposed through `followups --apply`: 18
allocated, 9 settled, 10 deferred, 1 duplicate and 10 open. The register
then holds 132 pending rows, 120 deferred and 12 open, none untriaged and
none needing review. Rows not listed keep their disposition: 110 deferred
rows whose reopening observation is not known to have occurred, and the
two open operator decisions (consume before produce; the babysitting
rate).

### 5.1 The thirteen untriaged, two needing review and one open

| Row | Source | Disposition |
| --- | --- | --- |
| FUP-a6c598371c7f86cf | WO-166 D015, the scratch directory | allocated, WO-168 items 1 and 2 |
| FUP-b537eae489004287 | WO-166 D014, three minor defects | allocated, WO-168 items 5, 6 and 7 |
| FUP-465c6ce0f041b447 | WO-166 D016, three standing sentences | allocated, WO-168 item 7 |
| FUP-8cfd3ff52146a016 | WO-166 D008, a real-runtime release-close fixture | deferred; its second half is discharged by `main`'s rebuild (§8) |
| FUP-a6b9c4dc86ac8995 | WO-085 D009, observations O1 to O5 | allocated, WO-086 (O3); O1, O2, O4 and O5 declined (§8) |
| FUP-040634d583e2c517 | WO-085 D015, observations V1 to V7 | allocated, WO-086 (V2, V7); V5 written into product 08 by this pass; V1, V3, V4 and V6 declined (§8) |
| FUP-40f361277410f64f | WO-085 D016, the proof WO-167 criterion 2 cites | allocated, WO-167 (criterion 2 amended, §6) |
| FUP-7c271477efbc2c15 | WO-085 D008, the repair directive | settled by the repair and VER-002 |
| FUP-59f75a891ac4d0d0 | WO-165 D006, two minor defects | settled by D008's corrections at final review |
| FUP-9069237b88bdff3f | WO-115 D025, reopened by D026 | settled by D026's fresh cycle (VER-006, FINAL-003, v0.52.0) |
| FUP-ca628adcc713c0b8 | WO-115 D026, control fold hardening | deferred (§8) |
| FUP-04bdf07955e1e24f | WO-070 D011, the pins-only test | settled by WO-166 criterion 6 |
| FUP-a058e82c0bbd9b6d | WO-070 D009, plane and kit root resolution | allocated, WO-075 (catalog carry-in) |
| FUP-195ab93be762ad42 | the stale-writer candidate, re-read at revision 5 | settled: WO-166 closed at v0.52.3 |
| FUP-fc4158d3207e495d | the Tinkerer candidate, re-read at revision 11 | settled again: the revision is an anchor repair (`c02511ab`) |
| FUP-0111 | planner startup context | open; this pass's measurement recorded |

### 5.2 Deferred rows this pass moved

| Row | Source | Disposition |
| --- | --- | --- |
| FUP-6996e331536d4389 | WO-158 D028, the hook and grant seam | allocated, WO-168 items 2, 3 and 4 |
| FUP-a310804514162e1f | WO-142 D018, harmless reads refused | allocated, WO-168 item 4 (the quoted-glob half no longer reproduces) |
| FUP-c787bb9b32bafcf8 | WO-142 D023, the stranded comment | allocated, WO-168 item 8 |
| FUP-156ca538f603194a | WO-140 D007, the hedge match | allocated, WO-168 item 8 |
| FUP-c3f5fff27ea981b8 | WO-138 D011, the integrate helper | allocated, WO-169 item 4; its reopening observation (a second integration with an authored conflict) occurred at WO-165 |
| FUP-e5a6ca7dbe6270ea | WO-155 D006, the unset label | allocated, WO-169 item 6 |
| FUP-ca485137e32985fb | machinery suite selection before final review | allocated, WO-169 item 5, with the planning rule in product 07 |
| FUP-4656197433cb8b3d | WO-114 D013, resident index-source hardening | allocated, WO-117 (catalog carry-in) |
| FUP-9e2be6bfac0708fe | WO-142 D012, Git metadata admission | settled by WO-158's configured-program check; the index stat refresh is the recorded residual |
| FUP-526d14d44ee178b3 | WO-142 D020, `release prepare`'s message | settled by WO-160 item 3 |
| FUP-b66c5b4726dc9262 | WO-110 D013, the empty dispatch table | settled, not reproduced |
| FUP-fa028783f3f6b17f, FUP-ebf4ab0c8e372692, FUP-04ec9fa011f39d93 | gathered seams of 2026-09-21 | deferred again with what remains of each |
| FUP-f12a1f894923b2b2, FUP-4f8cd7989607ad3f, FUP-56b599e15f97e666 | seam-conditioned rows of §4 | deferred again with the missed openings recorded |
| FUP-f1c7a256bec46737 | WO-054 D006, the cold-start ceilings | deferred again: three ceilings were raised since under the standing route (reviewer 2026-09-19, verifier 2026-09-20, executor 2026-09-22); the efficiency pass stays the operator's |

### 5.3 Reopening conditions that occurred, outside this pass's category

Nine rows name an observation that has occurred. Each is a product
candidate or an operator decision, not a small defect, so none is filed
here; each is recorded `open` with the evidence, which puts it on the
first page of the next pass's feed.

| Row | Candidate | The observation |
| --- | --- | --- |
| FUP-0073 | intent declaration and the stranger test | the parity contract exists (WO-115, v0.52.0) |
| FUP-0089 | Additional Opinion | WO-056 closed |
| FUP-0091 | Context Continuity | WO-120 landed |
| FUP-0107 | budget-window work-order ladders | WO-111 closed with two observed unattended runs |
| FUP-0113 | model-input exposure plans | WO-110 activated and closed; no `ModelInputPlan` exists in source |
| FUP-0bdf39fe462c07f0 | the stored-data inventory | a planning pass opened; this one was scoped away from it |
| FUP-beb13d8d099d2917 | refutation receipts by identity and hash | WO-085 landed and a pass had room; the change sits on the gate every pass runs |
| FUP-5e2f4ce16f9e8be1, FUP-8a4e201d861208ad | retention of never-current evidence editions | 216 edition directories, four selected; whether evidence may be pruned is the operator's decision |

### 5.4 This pass's map candidates

Candidates 1 to 3 are allocated to WO-169. Candidate 4 (changed machinery
suites in the plain product gate) is a duplicate of FUP-ca485137e32985fb
and candidate 5 (programs the live gate refuses) is deferred; both are
declined in §8.

## 6. The orders

| Order | What it lands | Class | Re-mint |
| --- | --- | --- | --- |
| WO-168 A printed path exists (new) | the scratch directory at print; a granted root is a real directory; the override exit before an input refusal; argument forms of listed reads; a refused Codex dispatch leaves no reservation; a stale runtime names bootstrap; the writer sentences; two boy-scout items | patch | deterministic (harness-host, harness-command, observed-facts, the compiler's harness text); the feedback carry and console re-pin; no live episode |
| WO-169 Follow-ups reach their seam (new) | `followups --touching` and the completion advisory; `--export`; an array form of `--apply`; the integrate helper's order and record; the configuration-root sources; the unset label | patch | none |
| WO-086 Generated release history (amended) | adds the retirement of the docs check's heading exemption for one registered generated block; criterion 4's ceiling statement corrected: the exempt bytes were never counted, so the ceiling does not fall by them | patch | none |
| WO-167 The execution guide folded (amended) | criterion 2 names `node scripts/harness-context.mjs --check` as the proof for the skills' citations; this pass reproduced the refusal on a renamed heading ("Unresolved required section") | patch | none |

Each new order re-observes an item before editing it and may end an item
"not reproduced"; each names `npm test -- --review` and `npm run
test:docs` in its final criterion, because every source it edits is a
declared source of a machinery suite. Both orders edit product 07 in
different sections and bound their growth (1,200 and 600 bytes) against
2,790 bytes of headroom after this pass's own sentence.

## 7. The sequence

Five closed entries leave (WO-070, WO-115, WO-166, WO-085, WO-165); 44
queued entries remain.

| Slot | Entries | Why here |
| --- | --- | --- |
| head | WO-168; WO-169 | the operator's direction: both next, in parallel. Disjoint files and product sections; no hard edge; only WO-168 re-mints |
| second (one entry) | WO-164 | WO-165 closed; WO-164 edits `scripts/resume.mjs` as WO-168 does, so it follows WO-168's close; it may run beside WO-162 or WO-163 |
| third (unchanged) | WO-162; WO-163 | maintenance |
| fourth (unchanged) | WO-086; WO-167 | both amended by this pass, neither moved |
| fifth (one entry, unchanged) | WO-087 | after WO-086 |

The delivery pair that held the head since 2026-09-16 is closed. The next
product entries are WO-060 and WO-116, behind nine debt entries; the
operator's 2026-09-25 answer kept that order, and this pass adds two debt
entries in front at the operator's direction.

## 8. Declined alternatives — the NoOp register of this pass

Each is a `NoOpIntent`: what happens if nothing changes, why the choice
wins, what reopens it.

- **File no order.** Every role session keeps finding the printed scratch
  path absent; the operator directed that it never happen again. Action
  wins for WO-168. For WO-169 the queue keeps filling faster than passes
  read it. Reopen: none.
- **One order instead of two.** The harness items re-mint and the tooling
  items do not; one order would make the tooling wait on a re-mint and the
  verifier read both seams. Two lanes cost less wall-clock. Reopen: the
  operator wants one lane.
- **Add `cut`, `sort`, `date`, `printf` and `echo` to the live-gate list.**
  Sessions lose a turn and rerun with a listed program. Each addition
  needs a bounded option vocabulary (`sort -o` writes a file) on the
  boundary that protects gate inputs. Declined; WO-168 corrects argument
  forms only. Reopen: map candidate 5.
- **Select changed machinery suites in plain `npm test`.** The executor's
  gate can stay green over a machinery failure. The runner change alters
  the duration and meaning of the gate every role runs. The planning rule
  is the smaller probe. Reopen: map candidate 4.
- **A real-runtime release-close fixture (WO-166 D008).** Release close
  under Codex stays exercised through a synthetic adapter. No close has
  failed on the writer protocol, and the fixture needs a linked pair with
  publication stubs. Deferred. Reopen: a release close leaves `main`
  reserved or reclaims a live reservation, or the adapter diverges.
- **Widen the docs check's recognizers (WO-085 O1, O2, V1).** A dated
  paragraph of an unmatched shape passes while the document is under its
  ceiling. The ceiling is the limiter; WO-167 and WO-087 empty two
  baselines. Declined. Reopen: a product document gains such a paragraph
  or heading under its ceiling.
- **Compare ceiling raises with the integration base; require a tracked
  raise anchor; report unused link exceptions; document ignored targets
  (O4, V3, V4, V6).** No ceiling has been raised and nothing fails today.
  Declined. Reopen: the first raise, or an exception that admits a new
  broken link.
- **Control fold hardening (WO-115 D026).** A hand-appended binding with a
  false subject type folds; `resume correct` cannot write one and
  publication ignores it. No consequence exists to remove. Deferred.
  Reopen: the next order that edits the `RecordCorrected` fold.
- **`resident-bind --check`, the AC3 coupling check (WO-157 D040, WO-142
  D015).** Each guards a case with no occurrence. Left deferred.
- **The main-module check in `mutate.mjs` (WO-142 D009).** The campaign's
  `instrumentHash` is the digest of that file, so the edit re-keys
  mutation evidence with a 45-minute run budget. Left deferred. Reopen:
  the next order that extends the mutation corpus.
- **The supervisor of a detached Codex episode (WO-159 D010).**
  `cli-actor.ts` is a feedback source path; the fix pays a live episode.
  Left deferred.
- **File the fired product candidates (§5.3).** Outside the operator's
  category for this pass. Recorded open. Reopen: the next pass that files
  product orders.
- **Run the stored-data inventory first.** Its reopening text names the
  next pass; the operator scoped this one. Recorded open.
- **Deleting anything.** No order here removes evidence or history.
  Reopen: never.

## 9. Goal alignment

Mission and critical path: neither order is on the source-to-deliverable
path. Each removes a cost that recurs on every order: a session's lost
turn and a masked gate (WO-168); follow-ups that wait for a pass to be
found (WO-169). The delivery pair is closed and the next product entries
are unchanged.

Traps. Policy resistance: the live-gate correction widens argument forms
without touching what the gate protects, so the two guards do not undo
each other. Commons: the generated sentence is bounded against the
reviewer's 581 bytes; both orders bound their product bytes. Drift:
"printed means exists" is an explicit standard the fixture now holds.
Escalation: WO-169 adds an advisory, never a gate; the planning rule adds
no step for orders that touch no machinery source. Success to the
successful: the structured-path field and the runner default are recorded,
not excluded. Shifting the burden: WO-169 moves the finding of fired rows
from a planner's reading to a command. Rule beating: WO-168's fixture may
not create the directory it asserts; WO-169's textual match is labeled
advisory so a clean advisory is not read as a verdict. Wrong goal: the
measure is fewer lost turns and fewer rows fired unseen, not rows closed.

Naive Interventionism: the live-gate list's function (gate inputs stay as
the gate read them) is kept; its consumers are every session beside a live
gate; the second-order risk is an admitted form that writes, bounded by a
fixture pair per form and by refusing every redirect but `/dev/null`;
each item is one call site and reversible. The register's existing
dispositions, schema and collector are untouched.

Platform lens: `followups --touching`, `--export` and the array apply
arrive as commands with typed output; the scratch directory is a contract
a stranger to the session can rely on; this repository consumes all of
them before any export.

## 10. Evidence and cost of this pass

- Research: none delegated; the planner read the register, the decisions
  and the source directly and probed the built classifier. Fan-out plan:
  one refuter of twenty subagent admissions.
- Documents: two orders and two amended; the sequence; the map (one
  rationale paragraph, one candidates section, two catalog rows, five row
  notes); the ledger section; product 07 and product 08 (one sentence
  each, in place); this document; the register dispositions; the
  generated index and cost table.
- Session usage and the refutation's cost are in §12 and the response.

## 11. Reversal conditions for this plan

- A role session reports the printed scratch path absent after WO-168.
- An admitted live-gate form is observed to change a gate input.
- An order closes with a touching row undisposed after WO-169.
- An order whose criterion named the review gate meets a deterministic
  machinery failure first at final review.
- The operator moves a product entry above the pair, or strikes an item.

## 12. Independent review

Filed after the committed subject is judged; see the receipt beside this
pass in `docs/planning/refutations/`.
