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
different sections and bound their growth (1,000 and 500 bytes; WO-170
300 and WO-171 200) against 2,504 bytes of headroom after this pass's own
two sentences (185,895 of 188,399 counted bytes).

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
product entries are WO-060 and WO-116, behind eight debt entries: six
queued before this pass, kept in place by the operator's 2026-09-25
answer, and the two this pass adds in front at the operator's direction.
§15 adds one more entry and the recommendation that follows from it.

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
  category when the pass opened, so they were recorded open; the
  operator's answer then delegated the decision, and §13 decides each.
- **Run the stored-data inventory first.** Not run when the pass opened
  (the operator had scoped it); run under the operator's answer as §14.
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

- Research for the first judgment: none delegated; the planner read the
  register, the decisions and the source directly and probed the built
  classifier. For the operator's answer one read-only survey enumerated
  the stored-data lanes (§14). Subagent admissions used: three of twenty
  (the first refuter, the survey, the second refuter).
- Refutation 031: 1,822,935 ms from dispatch to file by the receipt; the
  worker reported 216,381 tokens and 28 tool uses over 1,521 s (harness
  readback of the agent task).
- Session usage at the hook readback of 00:42Z: 55,366,394 total tokens,
  54,600,511 of them cached input; source
  claude-transcript-message-usage, scope dispatch; cost unknown. The
  handoff figure is in the response.
- Documents: three orders filed and two amended, then all four judged
  orders repaired against receipt 031; the sequence; the map; two ledger
  sections; product 07 (two sentences) and product 08 (one), in place;
  this document; the register dispositions; the generated index and cost
  table.

## 11. Reversal conditions for this plan

- A role session reports the printed scratch path absent after WO-168.
- An admitted live-gate form is observed to change a gate input.
- An order closes with a touching row undisposed after WO-169.
- An order whose criterion named the review gate meets a deterministic
  machinery failure first at final review.
- The operator moves a product entry above the pair, or strikes an item.

## 12. Independent review — receipt 031 and the repairs it led to

Receipt 031 (`2026-09-27-planning-e4deffba4add0aff-031`) judged WO-168,
WO-169, WO-086 and WO-167 aligned-with-findings, with no hold and fifteen
known issues, each with a reopening observation. The refuter read only
the compiled subject. Twelve of the fifteen name a defect in an order's
text that an executor or verifier would meet, so the text is repaired
here, before anyone activates it, and the repaired subject is judged
again (§16; the precedent is the 2026-09-25 pass's second judgment).

| Finding (receipt 031) | Repair |
| --- | --- |
| WO-168: the objective said a listed read is never refused for its spelling, while criterion 4 keeps `ls docs/*.md` refused | the title and objective name the four admitted forms and say expansion, unquoted globs and other redirects stay refused |
| WO-168: a granted root that does not exist yet, or whose `lstat` fails, was unspecified | an absent root is judged as at `4c34b332`; another `lstat` error falls back to that judgment with one advisory; criterion 2 has a fixture for each |
| WO-168: "three sentences", "four sentences" and "stated once" did not reconcile; the generated sentence could spend a third of the reviewer's headroom | four sentences, counted the same way everywhere (one generated, one in product 02, two in product 07); the generated sentence is bounded to 100 bytes, by rewording the clause it replaces |
| WO-168: ten criteria proved mechanisms on fixtures and no observed outcome | criterion 10: the verification report and the final review record what their own sessions observed on the branch's hooks (the scratch directory at dispatch; every live-gate refusal by program and form) |
| WO-169: the advisory fires after the edit, to a session with no rule for the rows; the path form suits a planner better | three uses, each ending in a record: the planner before filing, the executor at completion with the rule in the advisory (fix inside the Boy Scout bound or record as left; never widen), the pass that retires closed orders; rows naming an order match too; the order's own final review disposes every row its run returned |
| WO-169: the configuration-root suite's added run time was uncounted | measured alone on the operator's host: 2.3 s; the Cost line carries it |
| WO-169: "within 600 bytes of product 07's headroom" had two readings and no number | at most 500 bytes added; 185,895 of 188,399 counted bytes at the pass's commit |
| WO-086: a table generated from local tags makes the document gate depend on refs outside the tree; a sibling lane's tag would turn it red | the index's existing rule: the committed table carries its tag snapshot, recorded tags must remain available and unchanged, a newer local tag is reported and never refuses |
| WO-086: the table joined through the heading's version, which WO-113 may move into control events | the join is through the tag's manifest, as the index's local release evidence is; the heading is display text |
| WO-086: "recorded once" was untested with two writers; the excluded alternative had no reason in the compiled text | criterion 3 requires exactly one integration decision per collision; the non-goal states why version assignment at publication is the larger change |
| WO-086: no criterion pinned the removal the Cost line claims | criterion 4: no retiming, activation-completion or forward-retiming paragraph outside the markers; bytes before and after; the ceiling does not exceed its entry at the order's base |
| WO-167: the verifier's evidence was a count; the fold table had no location; no proof covered a queued order's `Cites` line; the ceiling had no headroom | a per-row record in the verification report; the table at `docs/evidence/WO-167/fold-table.md` with dated citations; the executor lists and retargets the product 07 headings queued orders cite; the ceiling is the landing count plus two per cent; the map's bytes are recorded |

Three known issues stand as recorded, with the receipt's reopening
observations: that none of the judged orders unblocks a critical-path gate
(true, and the reason for §15's recommendation); that the wider
configuration-root selection may catch nothing (2.3 s per gate is the
price); and that the planning map has no byte ceiling while WO-167 and
WO-087 move sections into it (WO-167 now records the map's bytes).

## 13. The operator's answer: decisions made under delegation

After the first report the operator answered (captured in the sibling
intake note
`2026-09-27-onesie-twosie-followup-drain-planning-followup.md`): push and
open the pull request when done; for the decisions reported as the
operator's, make the best call, including later orders beyond the two,
and cite the reasons. Each decision below is the planner's, made under
that delegation, and each can be reversed by the operator at review.

| Decision | Call | Reason | Reopen |
| --- | --- | --- | --- |
| WO-168 item 4: the `/dev/null` sink and the literal input redirect | keep both | a `/dev/null` sink opens no gate input; an input redirect opens its file read-only; each has an admitted and a refused fixture; sessions met both refusals | an admitted form is observed to change a gate input |
| Consume before produce for standard passes (FUP-304746d9f9c448c0) | adopted, in place in product 07 | every order this pass filed traces to an occurred reopening condition or an operator direction, so the rule costs nothing it did not already do; it bounds what a pass may add to the operator's queue; the meter's machinery share for the last three orders is 0.56 to 0.65 | the operator withdraws it, or a pass records a verified defect it could not file |
| The babysitting rate, measured (FUP-a33f893036882d16) | filed as WO-170 | the meter reports 0 operator corrections for five orders whose journals it could not read, and nothing counts the 32 operator-direction dispatches the record holds; it is the mission's own measure | the order's decisions |
| Session journals are discarded at teardown (FUP-85562931791378d4) | allocated to WO-170 | the snapshot written while the journals exist is the public summary; twelve of fourteen trap series are null or a false zero | a question about session behaviour the snapshot cannot answer |
| The stored-data inventory (FUP-0bdf39fe462c07f0) | run now, by hand, as §14; no generator filed | its own text names a pass's opening research stream; a hand inventory is the smallest probe of whether the table earns a generator; it found two defects worth an order (WO-170's unread usage, WO-171's prune) and three worth a record | a second pass wants the same table |
| Prune apply re-plans per candidate (FUP-6aafd40115ac97fd) | filed as WO-171 | deferred on 2026-09-21 for want of an observed failure; now one listing takes 64.2 s for 186 candidates, the source re-plans before every deletion, the last apply log reads exit 143 and 5.5 GB is listed unpruned | the order's decisions |
| Refutation receipts by identity and hash (FUP-beb13d8d099d2917) | deferred | a receipt pair is 450 KB and the directory 17 MB, but the whole repository packs to 24.9 MiB; the change is a receipt schema change with forty read sites on the gate every pass runs, and WO-162 refactors the same helpers first | the directory passes 32 MB, or WO-162 closes |
| Retention of never-current evidence editions (FUP-5e2f4ce16f9e8be1, FUP-8a4e201d861208ad) | pruning declined; deferred | immutable reports link to edition files; since WO-154 an order's editions cost 0.14 to 0.73 MB (WO-166: 0.62 MB, five authority revisions at 76 KB each); history packs small | a week adds more than 10 MB of tracked evidence, or one order commits more than 1 MB of revisions it never makes current |
| Intent declaration and the stranger test (FUP-0073) | deferred, half settled | `dotln intent "<prose>"` exists (`packages/skeleton/src/dotln.ts`) and WO-123 carries a filed intent to a terminal state; what remains is the roadmap's v1.0.0 exit, a witnessed run by a non-author, which needs the loop first | WO-083 closes |
| Additional Opinion (FUP-0089) | deferred | the support needs one batch identity across repeated episodes so that outbox deduplication does not erase the repeat, a kernel and outbox contract; second opinions are dispatched by hand today and work; it belongs with the pattern shelf | WO-091 to WO-095 land |
| Context Continuity (FUP-0091) | deferred | the candidate itself places continuity in the host's durable work state and allocates no order; WO-120 and WO-100 landed that state, and WO-112 is the first loop that assembles context from it; no Claude-side failure is on record | WO-112 activates, or a session is observed losing its owned task after compaction |
| Budget-window work-order ladders (FUP-0107) | deferred | WO-111's two unattended runs were 5S changes in a scratch repository under one resident; a ladder allocates this repository's own orders across lanes and usage windows, which needs the resident-owned loop | WO-118 closes, or a second lane runs unattended |
| Model-input exposure plans (FUP-0113) | deferred | no role sends private or operator-owned material to a model; WO-110 and WO-138 left local inference qualified for one read-only ranking task; WO-062 is the first order that brings external source text to a model input | WO-062 activates, or a local role that reads private material is proposed |

Five of the nine rows are product candidates that wait on product orders
already in the sequence (WO-062, WO-083, WO-112, WO-118, the pattern
shelf). Filing more orders would not advance them; running the product
sequence does. Each carries a note on the catalog row of the order that
reopens it, so the condition is seen when that order is opened.

The register after both judgments: 662 entries, 129 pending, 128 of them
deferred with a reopening observation and one open (the planner startup
measurement); none untriaged and none needing review. The pass began
with 155 pending, added nine rows of its own and recorded 66
dispositions, 48 before the first judgment and 18 after the operator's
answer.

## 14. The stored-data inventory, run by hand

The operator observed on 2026-09-25 that much of what the application
stores is not measured, analyzed or acted on, and the map recorded the
inventory as a pass's opening research stream. One read-only survey
enumerated 22 lanes (303,417 tokens, 192 tool uses, 1,363 s by the
harness readback); the planner re-measured the rows it relies on, marked
"re-measured". Three questions per lane: a counter reads it (A), a
planning pass or review consumed it (B), a decision cites it (C). Counts
of B and C are files found by pattern and are approximate.

| Lane | Kept in | Size on 2026-09-27 | Bound | A | B | C |
| --- | --- | --- | --- | --- | --- | --- |
| Control event logs | tracked | 89 files, 1,046 events | append-only | yes | 61 | 8 |
| Refutation log and receipts | tracked | 75 files, 17 MB (re-measured) | none | receipts yes, log no | 22 | 11 |
| Follow-up register | tracked | 658 entries (re-measured) | none | no | 31 | 14 |
| Planning cost table | tracked | 37 KB | 64 KB | no, it is meter output | 3 | 2 |
| Evidence editions | tracked | 260 edition rows, 99.5 MB (re-measured) | none | current and feedback only | 92 | 30 |
| Meter snapshots | tracked | WO-043, WO-049, WO-126 only (re-measured) | baseline immutable | yes | 7 | 0 |
| Cold-start observations | tracked | 18 files | none | harness-context only | 25 | 5 |
| Entropy runs and reviews | tracked | 17 files | none | reviews only | 10 | 2 |
| Discovery records | tracked | 92 files | none | no | 121 | 14 |
| Decisions and lineage indexes | tracked | 600 KB | regenerated | no | 45 | 10 |
| Beacons | ignored | none in `main` | leave with the worktree | yes | 19 | 0 |
| Harness journals and state | ignored | 109 journals, 15 MB | advisory markers only | the checkout's own only | 27 | 2 |
| Writer events | ignored | 370 rows | none | no | 7 | 1 |
| Gate rows and failure output | ignored | 256 rows in the hot index (re-measured) | 256-row index; history unbounded | rows yes, output no | 26 | 8 |
| Usage observations | ignored | 239 rows in `main`; 2,141 retained (re-measured) | none | `main` yes, retained no | 3 | 5 |
| Retained per-order lanes | ignored | 72 lanes listed by the prune, 56.7 MB (re-measured) | prune, never completed | no | 5 | 1 |
| Adjacent-work queues | ignored | 48 files | none | gates only | 2 | 2 |
| Planning-local files | ignored | about 370 files | none | no | 2 | 0 |
| Release-close local records | ignored | 16 files | none | no | 0 | 0 |
| Checkpoint refs and stashes | local refs | 1,056 refs; 24 stashes, 14 of them integration stashes of 5.4 GB (re-measured) | stashes by the prune | refs yes | 259 | 20 |
| Resident and worker stores | ignored | none in `main`; 24 retained files | none | on request | 10 | 2 |
| Operator-control state, session scratch | system temporary | 2,386 and 55 entries | none | no | 2 | 1 |

What the inventory found, with the route each takes:

| Finding | Evidence | Route |
| --- | --- | --- |
| The executor's, verifier's and reviewer's usage exists only in retained copies nothing reads | 73 copies, 2,141 rows (executor 791, verifier 876, reviewer 458); `usageRows` reads the checkout's own file; `main` holds planner, release-close and refuter rows | WO-170: read, and recovered once into per-order snapshots |
| Session journals, subagent counters and writer events leave with the worktree | the harness lane is disposable at teardown; `main`'s 93 session states are release-close, planner, refuter or unlabeled | WO-170: the snapshot written while they exist |
| A prune apply cannot finish | one listing 64.2 s; a re-plan before every deletion; 186 candidates; the last apply log reads exit 143; 5,508,635,182 bytes listed | WO-171 |
| Gate rows outlive the failure output they cite | in `main`'s hot index 257 distinct output references, 234 unresolved: teardown copies the rows and not the files | map candidate 6, deferred |
| A gate marker with no birth observation never expires | one marker of 2026-09-16, pid 43275, `processStartedAt` null; its process is gone today, and a reused pid would read as a live gate | map candidate 7, deferred |
| The register has no flow counter | nothing reports arrivals against settlements per pass; this document's §5 is a hand count | map candidate 8, deferred |
| Operator-control state accumulates in the temporary directory | 2,386 entries, read only by the open-override advisory | map candidate 9, declined |

Lanes where none of the three holds: the release-close local records. The
planning-local files and the operator-control state have no counter and
no decision. Nothing here is deleted by this pass.

## 15. The later orders, the sequence and one recommendation

| Order | What it lands | Class | Re-mint |
| --- | --- | --- | --- |
| WO-170 The meter keeps what sessions observed (new) | a per-order snapshot of at most 8 KB written by `release prepare` while the journals exist; retained usage read, and recovered once for the closed orders; a correction count computed from no journal reads unavailable, not zero; operator directions per closed order counted from decision dispatches and off-ramp events | patch | none while no registered evidence source is edited |
| WO-171 Prune apply finishes (new) | one plan and one publication observation per apply; a pre-delete check of the one candidate; an interrupted apply resumes; a lane keeps its usage copy until the order's snapshot is committed | patch | none |

Placement. WO-171 pairs with WO-164 in the second slot: disjoint files
(the prune and its fixtures; the console collector, the status command
and the release listing), no hard edge, neither re-mints. WO-170 takes a
one-entry slot after them, because it edits `scripts/release.mjs`
(`prepare`) as WO-164 does (`list`) and `scripts/lib/meta.mjs` as WO-169
does, and before WO-086, which rewrites what `release prepare` writes at
a collision. WO-171's usage reason keeps the order of WO-170 and the
operator's next apply from mattering. The sequence holds 46 entries.

| Slot | Entries |
| --- | --- |
| head | WO-168; WO-169 |
| second | WO-164; WO-171 |
| third | WO-170 |
| fourth | WO-162; WO-163 |
| fifth | WO-086; WO-167 |
| sixth | WO-087 |
| seventh | WO-060; WO-116 (the first product entries) |

Recommendation, recorded and not acted on: receipt 031 observes that the
first eight entries sit outside every critical-path gate, and §13 shows
five deferred product candidates waiting on product orders already
queued. WO-060 depends only on WO-008 and its own text says "any free
lane"; WO-116 depends on closed orders. Either can run in the second lane
beside WO-164 or WO-170 without waiting for the debt entries. The
operator's 2026-09-25 answer kept the debt entries first for a stated
three days, so the order of existing entries is left as the operator set
it; moving WO-060 and WO-116 up is the operator's call.

Goal alignment for WO-171. Mission: it removes a rescue the operator
cannot complete today, since the apply is the operator's own command and
does not finish. Critical path: none. Traps: shifting the burden is the
material lens (the residue waits on a command that runs for hours);
commons, since 5.5 GB of local residue is shared disk every worktree and
gate draws on; policy resistance, since the usage reason keeps the prune
from undoing what WO-170 recovers; rule beating, since the fixture counts
observations instead of timing them; escalation, drift, success to the
successful and wrong goal are immaterial to a change of ordering inside
one command. Naive Interventionism: every retention reason, the byte
proof and the publication requirement are kept; the change is what is
re-read, not what may be deleted. NoOp: the residue grows by each
order's lane and stash, and the usage copies stay one successful apply
from deletion.

Goal alignment for WO-170. Mission: it measures the thing the mission
names, how often the operator has to step in, which no record reports
today. Critical path: none directly; it is the instrument that shows
whether the debt entries ahead of the product entries reduce that rate.
Traps: seeking the wrong goal is the material lens, since a plan that
cannot read its outcome optimizes proxies (orders closed, rows disposed);
rule beating, since a zero from an unread journal passes for a clean
record; commons, since the snapshot is bounded at 8 KB per order;
escalation and policy resistance, since it adds no gate, refusal or
threshold; drift, since unavailable is reported as unavailable; shifting
the burden, since the count replaces a planner's hand count; success to
the successful, since committing the journals was weighed and declined
for what they contain. Naive Interventionism: the meter's existing
readers and the pull-request body's table keep their shape apart from
one column; the change is reversible by deleting the snapshot writer.
NoOp: every closed order keeps reading null or zero on `main`, and the
next pass counts directions by hand again.

## 16. Second judgment

The repaired orders, WO-170 and the revised sequence are committed and
judged by a second fresh worker; its receipt is filed beside receipt 031.
