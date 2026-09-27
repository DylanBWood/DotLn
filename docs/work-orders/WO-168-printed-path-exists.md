# WO-168 — A printed path exists: the harness creates the session scratch directory wherever it prints it, a granted root is a real directory, a refused Codex dispatch leaves no reservation, a live gate admits four argument forms of the reads it already lists, and the standing writer sentences say what ships (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. Hook and dispatch behaviour at existing
boundaries, refusal and advisory text, one generated sentence and three
product sentences; no control-event schema, gate step, grant kind or
contract change. Assigned at activation under the standing opt-out default.
**Cost:** adds, across the eight items below, a `mkdir` (mode 0700) at the
three places the session scratch path is printed or returned and one
advisory when it fails; an `lstat` of a granted root's final component
before the outside-write guard grants under it; the override exit's message
ahead of an input refusal; four argument forms and one command spelling
admitted for programs already on the live-gate list, and two configured
programs added to the check that guards a listed Git read; the release of a
reservation a refused Codex dispatch placed; a refusal naming
`node scripts/bootstrap.mjs` where a stale built runtime throws a
`TypeError`; the longest-identity rule in one hedge match; one fixture per
item. Removes: the turn every role session spends finding the printed
scratch path absent, and the masked gate failure that absence produced at
WO-166's final review (FINAL-001, reviewer error 1); the refused
`git --no-pager diff HEAD~1`, `grep -n '<title>' f`, `wc -l < a.md` and
`ls docs 2>/dev/null` a session meets while a gate is live; four standing
sentences that understate or misstate what WO-166 shipped (one generated,
one in product 02, two in product 07). Re-mints:
`packages/skeleton/src/harness-host.ts`, `harness-command.ts`,
`observed-facts.ts` and `packages/compiler/src/harness.ts` are registered
evidence sources (`scripts/lib/evidence-sources.mjs`), so the editions whose
checks they stale re-mint deterministically (WO-152 D004), and the compiler
release owes `feedback-evidence --carry` and the console re-pin (WO-154
D011); none is a feedback source path (`FEEDBACK_SOURCE_PATHS`), so no live
episode (WO-147 D010). The generated sentence enters every cold-start
profile: its net growth is at most 100 bytes, against a reviewer headroom
of 581 bytes measured at `4c34b332`. Wall-clock, tokens and context bytes
of the order itself are unknown until run; WO-166, the nearest comparable
order on this seam, took 4 h 13 min from activation to its final-review
pass with one repair (`docs/control/orders/WO-166.jsonl`).
**Nomination provenance:** the operator's 2026-09-27 dispatch (a small
pass that drains the follow-up queue and fixes small nagging issues in at
most two parallel orders, both next), captured in ignored intake (SHA-256
in the ledger section); the operator's direction recorded in WO-166 D015
that a session never writes to a scratch directory that does not exist;
register rows FUP-a6c598371c7f86cf (WO-166 D015), FUP-b537eae489004287
(WO-166 D014), FUP-465c6ce0f041b447 (WO-166 D016), FUP-6996e331536d4389
(WO-158 D028), FUP-a310804514162e1f (WO-142 D018), FUP-c787bb9b32bafcf8
(WO-142 D023, item b) and FUP-156ca538f603194a (WO-140 D007).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-166 merged (the last order to edit `harness-host.ts` and
the Codex dispatch in `scripts/resume.mjs`; closed, v0.52.3); WO-158 merged
(the live-gate list and the host-scratchpad grant; closed, v0.49.0);
WO-144 merged (the session scratch convention and the outside-write guard;
closed).
**Recommended placement:** paired with WO-169 at the head of the sequence,
at the operator's direction. This order edits `harness-host.ts`,
`harness-command.ts`, `observed-facts.ts`, the compiler's `harness.ts`,
`scripts/harness.mjs`, `scripts/resume.mjs`, their fixtures, and named
sentences of products 02 and 07 (§Discipline and the resume table);
WO-169 edits the follow-up feed, the integrate helper, the test runner's
source table, the meter's render and product 07 §Retained planning
follow-ups. Disjoint files and disjoint product sections; neither depends
on the other; only this order re-mints. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-166",
    "relation": "satisfied-by-close",
    "reason": "the last order to edit harness-host.ts and the Codex dispatch in scripts/resume.mjs"
  },
  {
    "workOrderId": "WO-158",
    "relation": "satisfied-by-close",
    "reason": "the live-gate read list and the host-scratchpad grant this order corrects"
  },
  {
    "workOrderId": "WO-144",
    "relation": "satisfied-by-close",
    "reason": "the session scratch convention and the outside-write guard"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/evidence/WO-166/decisions.md` D008,
D014, D015 and D016; `docs/evidence/WO-158/decisions.md` D028;
`docs/evidence/WO-142/decisions.md` D018 and D023;
`docs/evidence/WO-140/decisions.md` D007;
`packages/skeleton/src/harness-host.ts` (`harnessSessionScratch` and its
four call sites; the outside-write grant roots and `prospectiveRealpath`;
`configuredGitPrograms`; `acquireHarnessWriter` and
`reserveCodexDispatchWriter`; `runHarnessHook`, where an input refusal
returns before the override exit);
`packages/skeleton/src/harness-command.ts` (`LIVE_GATE_READ_LIST`,
`liveGateReads`, `liveGateRead`, `liveGateGit`; the comment above
`readCommand`); `packages/skeleton/src/observed-facts.ts` (the hedge
match on `gate.checkId`); `packages/compiler/src/harness.ts`
(`HARNESS_BOUNDARIES`); `scripts/harness.mjs` (`scratch`);
`scripts/resume.mjs` (`reserveCodexDispatch`);
`scripts/lib/harness-runtime.mjs` (`reportHarnessRuntime`);
`scripts/test-harness.mjs` (the WO-144 outside-write case) and
`scripts/test-process-debt.mjs` (the WO-153 case and its comment);
product 02 §the writer paragraph; product 07 §Operator resume phrases (the
`resume: release close` row and the work-order index paragraph) and
§Discipline (the WO-158 read-only list and the scratch sentences); the
[2026-09-27 planning document](../planning/onesie-twosie-followup-drain-2026-09-27.md)
§3 and §5.

**Objective:** a path the harness prints for temporary work exists when it
is printed; a grant never follows a granted root through a symlink; a
dispatch that is refused leaves the worktree as it found it; a session
working beside a live gate is no longer refused four argument forms of
listed reads that change no gate input (a quoted angle bracket, a revision
suffix, a literal input redirect, a `/dev/null` sink), while expansion,
unquoted globs and every other redirect stay refused; and a reader of the
blueprint meets the Codex writer boundary stated the same way in each of
the four sentences that carry it.

**Observed gap (dated 2026-09-27, `main` at `4c34b332`):**

1. `harnessSessionScratch` only computes
   `<system-temp>/dotln/<session key>/scratch`. Its four call sites (the
   role-dispatch briefing, `beginHarnessSession`'s result, the
   `session-scratch` grant root and `harness scratch`) print, return or
   judge the path, and none creates it; `harness-host.ts` calls `mkdirSync`
   in eight other places. WO-166's final review redirected its first gate
   log there, the redirect failed, `npm test` never started and the
   trailing command reported exit 0 (D015). In the planning session that
   filed this order the directory was born at 23:56:39Z, 70 seconds after
   the dispatch printed the path and in the same second as the planner's
   first command that ran `mkdir -p` on it, at mode 0755 (an inference
   from the birth time: nothing had created it earlier).
2. Every grant kind resolves its root with `prospectiveRealpath` at
   judgment time, so a granted root replaced by a symlink carries the
   grant to its target; a read-only review executed the swap on
   session-scratch and a write landed in an ungranted directory (WO-158
   D028, item a).
3. With an override exit pending, an input the decoder refuses (a missing
   `cwd`, invalid JSON) returns the protocol refusal before the override
   branch, so neither the exit message nor the record command prints; an
   exception after a successful `override-record` append reaches the
   advisory that says the event was not appended (D028, items c and d; the
   second is a code reading).
4. The built classifier, probed on 2026-09-27: `liveGateReads` returns
   `null` for `git --no-pager diff HEAD~1`, `git --no-pager show
   stash@{0}`, `grep -n '<title>' f`, a quoted `%H <%ae>` format,
   `wc -l < a.md`, `ls docs 2>/dev/null` and
   `npm run --silent resume -- status`, while it admits
   `npm run resume --silent -- status`, `grep -n "a*" a.md` and
   `grep -n 'N[0-9]' a.md` (the quoted-glob half of WO-142 D018 no longer
   reproduces). Three reports record refused reads during a live gate
   (WO-158 VER-003 and FINAL-002; WO-166 FINAL-001, reviewer error 7).
   `configuredGitPrograms` names no repository hook and no `%G` held in
   `format.pretty` or `pretty.<alias>` (D028, item b); the helper forms
   compare `args.join(" ")` (item f).
5. `acquireHarnessWriter` places the reservation, appends the writer
   event, then calls `record`, which throws when the session's
   observation log is not a regular file; the Codex dispatch is refused
   with its reservation in place (WO-166 D014, third defect).
6. `reserveCodexDispatch` destructures `reserveCodexDispatchWriter` from
   the built runtime and calls it; a built runtime older than the scripts
   fails with a `TypeError` after the pins-differ advisory (D014, first
   defect; an inference from code, not executed). An unbuilt runtime is
   already refused with a message naming `npm run build`.
7. Four standing sentences are silent or stale about what WO-166 ships.
   One is generated: the five-refusals sentence says Codex carries the
   duties "as role text without automatic enforcement". One is in product
   02: the writer paragraph names neither the `codex-host` and `thread`
   owners nor the fields a refusal carries. Two are in product 07: the
   work-order index paragraph names two of the five completions that
   release, and the `resume: release close` row still says the helper
   command is projected by `resume release-close` (D016; D014, second
   defect).
8. The comment "Bounded destination adapter for gate admission" sits above
   `readCommand`, not `shellWriteTargets` (WO-142 D023, item b);
   `observed-facts.ts` matches a hedged quantity to a gate row with
   `part.includes(gate.checkId)`, so `npm test -- --inside-sandbox`
   resolves to the full gate's row (WO-140 D007).

**Design (scope discipline):**

Each item is re-observed on the activation tree before it is edited and
ends as fixed, not reproduced, or returned with a decision (the WO-142
rule). One fixture per fixed item.

- Item 1: the directory is created, mode 0700, at the role-dispatch
  briefing in the Claude hook, in `beginHarnessSession` under Codex and in
  `harness scratch`, before the path is printed or returned. An existing
  real directory owned by the session user is used as it is. A creation
  failure, or a path that exists as anything else, prints one advisory
  naming the path and the cause and never blocks the dispatch. The fixture
  drives a real dispatch and asserts the directory exists without creating
  it; the WO-144 fixture stops creating it for itself.
- Item 2: a granted root whose final component exists and is a symlink,
  or is not a directory owned by the session user, grants nothing, for
  session-scratch and host-scratchpad alike; ancestors still resolve
  physically, so the system temporary directory's own symlinked prefix
  keeps working. The refusal names the root and the cause. A root that
  does not exist yet is judged as at `4c34b332`, so the write that
  creates it is admitted; an `lstat` error other than absence falls back
  to that judgment with one advisory, never to a refusal.
- Item 3: with an override exit pending, the exit message and the record
  command print before any input refusal; a record that was appended is
  never reported as not appended.
- Item 4: for programs already on the list, admit a quoted word that
  contains `<` or `>`; revision suffixes (`~`, `^`, `@{…}`) in an operand
  of a listed Git read, where the word does not begin with `~` and a brace
  pair holds no comma or range; an input redirect from a literal path;
  an output redirect whose literal operand is exactly `/dev/null`; and
  `npm run --silent resume -- status`. Expansion, command substitution,
  unquoted globs, `<>`, heredocs and every other redirect stay refused.
  The helper forms compare argument by argument. `configuredGitPrograms`
  also refuses while `core.hooksPath` or the repository's hooks directory
  holds an executable hook a listed read can trigger, or a configured
  pretty format holds `%G`. The list names no new program. The refusal
  text and product 07's paragraph state the admitted forms.
- Item 5: a Codex dispatch that is refused after its reservation was
  placed releases that reservation before the refusal is returned; the
  WO-153 fixture comment states the behaviour the fixture now proves.
- Item 6: when the built runtime lacks an entry point the dispatch needs,
  the dispatch refuses before any event with a message naming
  `node scripts/bootstrap.mjs`.
- Item 7: `HARNESS_BOUNDARIES` says that under Codex a lifecycle dispatch
  reserves the writer and refuses a foreign holder, and that the other
  duties and grants are role text because Codex tool calls are unhooked,
  within the 100-byte bound, by rewording the clause it replaces; the
  bundle and skills are regenerated and the cold-start observation
  recorded before and after. Products 02 and 07 are edited in place, in
  the three sentences named in the gap, within the
  documents' headroom (02: 2,954 bytes at `4c34b332`; 07: 2,504 bytes at
  the planning pass's commit, of which this order uses at most 1,000 in
  07 and 600 in 02).
- Item 8: the comment moves above `shellWriteTargets`; the hedge match
  prefers the longest matching identity, with a fixture holding both rows.
- **Declined alternatives, recorded:** adding `cut`, `sort`, `date`,
  `printf` or `echo` to the live-gate list (each needs a bounded option
  vocabulary; the refusal already names the list; the planning document
  §8 holds the reopening observation); a real-runtime release-close
  fixture in a linked pair (WO-166 D008; its reopening observation has
  not occurred); a lease or a liveness probe for a pid-less holder
  (product 02's rejection stands); creating the scratch directory lazily
  at the first write (the redirect that failed was a shell's, which no
  hook can complete); raising a cold-start or document ceiling (the
  edits are bounded instead).

**Deliverables:** the eight items with fixtures; the regenerated bundle,
skills and instruction file; the re-minted editions; the product
sentences; decisions per item.

**Acceptance criteria (all required)**

1. After a Claude role dispatch, after `beginHarnessSession` under Codex
   and after `harness scratch`, the printed path is a directory of mode
   0700 owned by the session user, asserted by a fixture that does not
   create it; a path that exists as a file or a symlink yields one
   advisory and an unblocked dispatch; product 07's scratch sentence says
   the path exists when it is printed.
2. A write under a granted root whose final component is a symlink is
   refused for session-scratch and for host-scratchpad, with the root and
   the cause named; a write under a real granted root is admitted; a
   write under a granted root that does not exist yet is admitted as at
   `4c34b332`; a fixture in which `lstat` fails for another reason admits
   with one advisory; the system temporary grant is unchanged.
3. With an override exit pending, a hook input with no `cwd` prints the
   exit message and the record command; a fixture in which the record
   call throws after the append prints no "was not appended" line.
4. A fixture table holds an admitted and a refused command for each form
   in item 4, including the seven commands of the observed gap as
   admitted and `git --no-pager diff $(x)`, `ls docs/*.md`,
   `wc -l <> a.md`, `ls docs 2>/tmp/x` and `cut -c1-80 a.md` as refused;
   a listed Git read is refused while an executable `post-index-change`
   hook or a `%G` pretty format is configured; `LIVE_GATE_READ_LIST`
   names the same programs as before; the refusal text and product 07's
   read-only list paragraph state the admitted forms.
5. A Codex dispatch refused because its observation log is not a regular
   file leaves `writer --show` reporting `reserved:false`, and a second
   session's dispatch is then admitted.
6. A Codex dispatch against a built runtime that lacks the reservation
   entry point exits non-zero before any event with a message naming
   `node scripts/bootstrap.mjs`.
7. The generated five-refusals sentence states the Codex dispatch
   reservation; its net growth is at most 100 bytes and every profile's
   `coldStartBytes` verdict is unchanged; `node scripts/harness.mjs check`
   passes. Product 02 carries its one sentence and product 07 its two, in
   place; with the two product 07 edits of criteria 1 and 4 the order
   adds at most 1,000 bytes to product 07 and 600 to product 02, and the
   docs check passes with no ceiling raised.
8. The comment sits above `shellWriteTargets`; a hedge naming
   `npm test -- --inside-sandbox` resolves to that row when both rows are
   in scope.
9. Stale editions re-mint deterministically with no live episode; the
   register rows named in the provenance are retargeted at close.
10. The verification report and the final review each record what their
    own session observed on this branch's hooks: that the scratch
    directory existed when its path was printed, and every command a live
    gate refused them, by program and form. A refusal of one of the four
    admitted forms fails this criterion; refusals of other forms are
    counted and become the reopening evidence of map candidate 5.
11. `npm test -- --review` and `npm run test:docs` green; `git diff
    --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the cold-start observation
before and after; the two sessions' own observations of criterion 10;
`npm test -- --review` before `implementation-ready`,
because every source this order edits is a declared source of a machinery
suite (`scripts/test-runner.mjs` `machinerySources`), and again at final
review. No live row.

**Write-back duty:** products 02 and 07, edited in place; decisions per
item; the register rows.

**Non-goals:** a new program on the live-gate list; the expansion-spelled
redirect adapter and the root-cwd precondition (map candidates dated
2026-09-21); a release-close fixture against the real runtime (WO-166
D008); the abandoned Codex session's operator release; the supervisor of
a detached Codex episode (WO-159 D010); the role-text efficiency pass the
operator reserved (WO-054 D006).

**Operator-review assumptions**

1. Admitting argument forms for programs already listed is a correction
   of the list's width, not an addition to it. Decided on 2026-09-27
   under the operator's delegation: the `/dev/null` and input-redirect
   forms stay, because a `/dev/null` sink opens no gate input, a literal
   input redirect opens its file read-only, and each has an admitted and
   a refused fixture; the operator may still strike either at review.
2. A patch: no event schema changes and no grant kind is added.
3. The re-observe rule lets an item end "not reproduced" without failing
   the order.
