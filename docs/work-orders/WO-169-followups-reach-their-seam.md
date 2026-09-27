# WO-169 — Follow-ups reach the order that opens their seam: the feed names the pending rows a change, a file list or an order touches, for the planner before an order is filed and for the executor at completion, exports its rows whole and applies a batch of dispositions in one command; the integrate helper regenerates after authored conflicts are staged and records the release line once; the review gate selects the configuration-root suite for every script it scans; the meter names an unset ceiling (v0.52.4)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. Three forms of an existing command, one
completion advisory, one helper's ordering and output, one row of the
runner's source table and one rendered label; no control-event schema,
register schema, gate step or contract change. Assigned at activation
under the standing opt-out default.
**Cost:** adds `npm run plan -- followups --touching [<path or WO-NNN>…]`
(the pending rows whose text names a changed or given path, or a given
order), one advisory at `implementation-ready` and `repair-complete` when
that set is not empty, which states what the executor does with the rows,
`followups --export <file>` (every pending row whole, written to a file,
counts on standard output) and an array form of `followups --apply`
(one expected revision, applied in order, all or none); a conflict check
before the integrate helper's first regeneration; `scripts/` among the
configuration-root suite's declared sources, which adds that suite (2.3 s
alone on the operator's host, measured 2026-09-27) to the review gate of
every order that changes a script; one fixture per item.
Removes: the silent firing of seam-conditioned rows (four seams, eight
rows and nine closed orders counted on 2026-09-27, below); the throwaway
script each planning pass writes to read the register (the 2026-09-25 pass
read 36 rows that way, this one 155) and the one request file and one
invocation per disposition (163 retained request files in the main
checkout's local control lane on 2026-09-27); the doubled full stop in
every integration record since WO-100 (nine records); `Regenerated:` lines
printed over a tree that still holds conflict markers; a red machinery
suite reaching `main` unselected (WO-085 D014). Re-mints: none
(`scripts/lib/planning-followups.mjs`, `scripts/refute-plan.mjs`,
`scripts/lib/lifecycle-evidence.mjs`, `scripts/lib/worktree-integration.mjs`,
`scripts/test-runner.mjs` and `scripts/lib/meta.mjs` are not registered
evidence sources). Wall-clock, tokens and context bytes of the order
itself are unknown until run.
**Nomination provenance:** the operator's 2026-09-27 dispatch (a small
pass that drains the follow-up queue and fixes small nagging issues in at
most two parallel orders, both next), captured in ignored intake (SHA-256
in the ledger section); this pass's measurement of the register
([planning document](../planning/onesie-twosie-followup-drain-2026-09-27.md)
§4); register rows FUP-c3f5fff27ea981b8 (WO-138 D011),
FUP-e5a6ca7dbe6270ea (WO-155 D006), FUP-ca485137e32985fb (machinery suite
selection, the declared-sources half) and the three map candidates this
pass records for the feed (FUP-99f720bad9200a33, FUP-28ded9eb997633f2,
FUP-d7c0c433892e120f). Planner-synthesized. Opaque identifier, not a
priority. Clean-room screen: no stop condition.
**Depends on:** WO-142 merged (the collector rule that a decision enters
the feed by its `followup`; closed); WO-160 merged (the last order to edit
the integrate helper's commits and the completion advisory; closed,
v0.51.0); WO-085 merged (the last edit of the integration decision stub;
closed, v0.52.2).
**Recommended placement:** paired with WO-168 at the head of the sequence,
at the operator's direction. This order edits
`scripts/lib/planning-followups.mjs`, `scripts/refute-plan.mjs`,
`scripts/lib/lifecycle-evidence.mjs`, `scripts/lib/worktree-integration.mjs`,
`scripts/test-runner.mjs`, `scripts/lib/meta.mjs`, their fixtures,
`docs/planning/followups.md` and product 07 §Retained planning
follow-ups; WO-168 edits the harness runtime, the compiler's harness
text, `scripts/resume.mjs` and other sections of products 02 and 07.
Disjoint files and disjoint product sections; neither depends on the
other; this order re-mints nothing. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-142",
    "relation": "satisfied-by-close",
    "reason": "the collector rule that a decision enters the feed by its followup"
  },
  {
    "workOrderId": "WO-160",
    "relation": "satisfied-by-close",
    "reason": "the last order to edit the integrate helper's commits and the completion advisory"
  },
  {
    "workOrderId": "WO-085",
    "relation": "satisfied-by-close",
    "reason": "the last edit of the integration decision stub"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/planning-followups.mjs`
(`planningFollowups`, `disposeFollowup`, `followupStatus`, the 8 KB page
bound); `scripts/refute-plan.mjs` (the `followups` command);
`scripts/lib/lifecycle-evidence.mjs` (the two advisories at
`implementation-ready` and `repair-complete`);
`scripts/lib/worktree-integration.mjs` (the stage set to `applied` after
the stash apply; `regenerate`; the decision stub's `Release preparation:`
line) and `scripts/release.mjs` (the `prepare` message it embeds);
`scripts/test-runner.mjs` (`machinerySources`, `changedMachinery`) and
`scripts/test-configuration-root.mjs` (the scan of every non-test script);
`scripts/lib/meta.mjs` (`renderMetaTable`, the drift rows and the budget
rows); `docs/evidence/WO-138/decisions.md` D011;
`docs/evidence/WO-165/decisions.md` D007 (the second integration with
authored conflicts); `docs/evidence/WO-085/decisions.md` D014;
`docs/evidence/WO-155/decisions.md` D006;
`docs/evidence/WO-144/decisions.md` D010 (part 1);
`docs/planning/followups.md`; product 07 §Retained planning follow-ups;
the
[2026-09-27 planning document](../planning/onesie-twosie-followup-drain-2026-09-27.md)
§4 and §5.

**Objective:** a follow-up deferred until "the next order that edits" a
file, or until a named order activates or closes, is shown three times:
to the planner who files an order naming that file, to the executor whose
change touches it, and to the pass that retires the closed order; each
showing ends in a recorded disposition; a planning pass reads and
disposes the register with the feed's own commands; an integration's
output and record describe the tree as it is; a script change selects the
suite that scans scripts; an unset ceiling is called unset.

**Observed gap (dated 2026-09-27, `main` at `4c34b332`):**

1. Nothing shows a deferred row to the order that opens its seam. Counted
   against first-parent history: `reactor.ts` was edited by WO-099,
   WO-151, WO-154 and WO-070 after the 2026-09-19 deferral of the row
   that waits for "the next order that opens `reactor.ts`"
   (FUP-f12a1f894923b2b2); `scripts/lib/meta.mjs` by WO-155 and WO-158
   and `release-preparation.mjs` by WO-160 after the 2026-09-21 deferral
   of the four meter and closeout rows (FUP-fa028783f3f6b17f,
   FUP-526d14d44ee178b3, FUP-156ca538f603194a, FUP-b66c5b4726dc9262);
   `resident-state.ts` by WO-100, which recorded a feedback edition,
   after the 2026-09-21 deferral of two rows that wait for exactly that
   (FUP-4f8cd7989607ad3f, FUP-56b599e15f97e666); and WO-115 activated
   and closed without the row deferred until it did
   (FUP-4656197433cb8b3d). Each row's latest disposition is still its
   deferral. The completion check prints two advisories (the document
   gate's row and the adjacent queue) and none for the register.
2. The feed pages at eight rows and clips reasons at 220 characters; a
   pass that must read every pending row writes its own projection. The
   register held 155 pending rows at revision `36c3cc9a…`.
3. `followups --apply` takes one request bound to the register's current
   revision, which every apply changes; a pass that disposes sixty rows
   writes sixty files and chains sixty revisions by script.
4. `worktree integrate` sets its stage to `applied` after the stash apply
   and runs every regeneration step while authored conflicts remain, so
   the first pass prints `Regenerated:` lines over conflict markers
   (WO-138 D011; WO-165's integration met five authored conflicts). The
   decision stub appends a full stop to a release message that ends with
   one: nine records read "Tag observation: local snapshot only.."
   (WO-100, WO-120, WO-151, WO-154, WO-156, WO-158, WO-160, WO-165,
   WO-166).
5. The configuration-root suite scans every non-test script under
   `scripts/` for a literal document root and declares eight sources, so
   `--review` selects it only when one of the eight changes. WO-165 added
   a literal to `scripts/authority-evidence.mjs`; no gate of WO-165
   selected the suite, `main` carried the failure, and WO-085's repair
   met it (D014).
6. The meter's drift rows render an unset cold-start ceiling as
   "ceiling unavailable" (`display(row.ceiling)`), while the budget rows
   and the legend say "unset" (WO-155 D006).

**Design (scope discipline):**

- Item 1: `followups --touching` with no argument reads the files
  changed against the merge base with `main` and the active order's
  identifier; with arguments it reads the given paths and order
  identifiers. A row matches when its source text, its decision's
  `followup` or `reopenWhen`, or its latest disposition names the path,
  its base name or the order. Output is the feed's row shape within the
  page bound, with a continuation. It is a textual match and says so; a
  false match costs a row read, a missed one leaves today's behaviour.
  Three uses, each ending in a record. The planner runs it with the files
  an order names before filing the order, and allocates or declines each
  row in that pass. The completion check prints one advisory with the
  count, the command and the rule: fix a row inside the Boy Scout bound or
  record it as left in the order's decisions, never widen the order; the
  final review disposes each listed row through the feed. A pass that
  retires closed orders runs it with their identifiers. The advisory
  never blocks a completion (the WO-131 direction) and the role skills
  are unchanged, because the advisory carries the rule.
- Item 2: `followups --export <file>` writes every pending row (`--all`
  for every row) whole: identity, status, kind, source, title, the
  decision's `decision`, `followup` and `reopenWhen` or the candidate's
  summary, and the disposition history. The destination is a file under a
  granted scratch root or the ignored local control lane; standard output
  carries the counts, the revision and the path only. The feed's page
  bound is unchanged.
- Item 3: `followups --apply <file>` also accepts an array of requests
  under one `expectedRevision`. Every request is validated against the
  state the earlier ones produce, under one lock; one invalid request
  writes nothing and names its index. The single-request form is
  unchanged.
- Item 4: the helper regenerates only when no authored conflict remains;
  while one remains it prints the conflicts and that generation waits for
  `--continue`. The stub records the release message without a second
  full stop or an embedded line break.
- Item 5: the configuration-root suite declares `scripts/` so a change to
  any script it scans selects it under `--review`; a runner fixture
  asserts the selection for a changed script outside the former eight.
- Item 6: the drift rows render a null ceiling as "unset"; the
  process-debt render test asserts it for the refuter, whose ceiling is
  unset.
- **Declined alternatives, recorded:** a structured path field on every
  disposition (a register schema change and a migration of 653 entries;
  the textual match is the smaller probe); blocking a completion on
  unread rows (completion never blocks on advisories); selecting changed
  machinery suites in plain `npm test` (changes the duration and meaning
  of the gate every role runs; the planning rule that an order naming a
  machinery source names `npm test -- --review` is the smaller probe,
  recorded by the 2026-09-27 pass); deferring the integrate helper's
  fixes to WO-086 (four pairs integrate before it runs).

**Deliverables:** the three feed forms; the advisory; the helper's two
corrections; the source row; the label; fixtures; the two document
write-backs; decisions per item.

**Acceptance criteria (all required)**

1. On a fixture register, `followups --touching scripts/lib/meta.mjs`
   returns the pending rows whose text names that path or `meta.mjs` and
   no settled row; `--touching WO-115` returns the rows that name that
   order; with no argument it returns the rows for the fixture's changed
   files and active order; `implementation-ready` prints the advisory
   with the count, the command and the rule on a fixture with one match
   and stays silent with none; no completion is refused. This order's own
   final review lists every row its `--touching` run returned with the
   disposition it recorded.
2. `followups --export` writes every pending row with its whole
   `followup` text and disposition history to the named file and prints
   only counts, revision and path; a destination outside the granted
   roots is refused; the feed's pages are byte-identical before and
   after.
3. An array of three requests applies in order under one revision and
   yields the same register bytes as the three single applies; an array
   whose second request is invalid writes nothing and names index 1.
4. A fixture integration with one authored conflict prints the conflict
   and no `Regenerated:` line, and regenerates under `--continue` once
   the conflict is staged; the stub's release line ends with one full
   stop and holds no line break.
5. `npm test -- --review --list` on a fixture that changes
   `scripts/authority-evidence.mjs` lists the configuration-root suite.
6. The meter's drift row for a role with no ceiling reads "ceiling unset".
7. Write-backs land: `docs/planning/followups.md` and product 07
   §Retained planning follow-ups name the three forms and the three uses
   in place, adding at most 500 bytes to product 07 (185,895 of 188,399
   counted bytes at the pass's commit; WO-168 adds at most 1,000 before
   it); the register rows named in the provenance are retargeted at
   close.
8. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; one `followups --touching`
run on this order's own diff, recorded in the decisions with the rows it
returned and their dispositions; `npm test -- --review` before
`implementation-ready`, because the plan and runner sources this order
edits are declared sources of machinery suites, and again at final review.
No live row.

**Write-back duty:** the two documents in criterion 7; decisions per
item; the register rows.

**Non-goals:** changing the register's schema, the collector's rules or
any existing disposition; the role skills (the advisory carries the
command, so no loadout is regenerated); selecting machinery suites in
plain `npm test`; the control fold, `resident-bind --check` and the docs
check's recognizers (deferred by the 2026-09-27 pass with their reopening
observations); the release history (WO-086).

**Operator-review assumptions**

1. A textual match is acceptable for an advisory: it is a pointer for the
   executor's judgment, never a verdict.
2. The batch apply keeps the guarantee the single form gives: the planner
   read the revision it disposes against.
3. A patch with no live row is right for tooling whose criteria are
   fixtures.
