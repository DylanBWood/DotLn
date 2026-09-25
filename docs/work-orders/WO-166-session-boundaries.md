# WO-166 — Session boundaries: a Codex lifecycle dispatch reserves the writer its completion releases, every Codex completion releases, a writer refusal names the holder's age, an open override is surfaced at the next session start, and a live gate is waited on with a command that exits (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. Session begin and completion behaviour
under Codex, one harness command, refusal text and role text; no
control-event schema, gate step or contract change. Assigned at activation
under the standing opt-out default.
**Cost:** adds a writer reservation at `beginHarnessSessionOnce` for the
five Codex dispatch roles (`next`, `fix`, `verify`, `final-review`,
`release-close`; `scripts/resume.mjs` `codexDispatchRoles`), keyed by the
actor id completion already releases (SHA-256 of `CODEX_THREAD_ID`) and
owned by the dispatch's non-shell ancestor as the Claude path records it,
with a live or unknown foreign holder refusing the dispatch before any
event is appended; the release that `implementation-ready` and
`repair-complete` perform (WO-139 D005) at `verification-result`,
`final-review-result` and `release-close` too; the holder's `reservedAt`
age and the release command on every writer refusal;
`node scripts/harness.mjs evidence --wait [--timeout <seconds>]`, which
returns when `activeGateRuns` is empty and prints the newest `checks.json`
row for the current tree (exit 0 on a recorded pass, 1 on a recorded
failure, 2 at timeout or with no row); a session-start advisory naming an
override entered and not exited in the same worktree (WO-158 D012); two
sentences of role text (under Codex the dispatch reserves and the
completion releases, `writer --show` is the check and a hand-built hook
payload is never the route; a live gate is awaited with a command that
exits, never an open-ended follower); fixtures for each. Removes: the
mid-phase reservation two Codex sessions made by hand (WO-156 repair,
WO-161 implementation) and the unreserved handoff a third recorded (WO-161
repair), with the diagnosis turns each spent; the open-ended monitor a
Claude session left running after WO-160's gate. Re-mints:
`packages/skeleton/src/harness-host.ts`, `gate-evidence.mjs` and
`loadouts/contributor.ts` are registered evidence sources
(`scripts/lib/evidence-sources.mjs`), so the editions whose checks they
stale re-mint deterministically (WO-152 D004); none is a feedback source
path (`FEEDBACK_SOURCE_PATHS`), so no live episode (WO-147 D010). Boy-scout
carry-in: the WO-154 pins-only test at `scripts/test-evidence-sources.mjs`
lines 266–269 resolves the live audit through `edition.liveAudit.edition`
(WO-161 D007), because this order's re-mint runs that selection. Wall-clock,
tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's 2026-09-25 dispatch, items 1 and
2 ("codex writer reservation issues"; a monitor built on `tail -f` that
never exits), with two mid-turn clarifications (recent; found mid-phase;
frequency unclear); product 07 §Candidate — stale writer reservation
self-diagnosis, whose reopening condition (a second observed occurrence)
WO-156 and WO-161 met; register rows FUP-a0d6b960702fb9a4 (WO-158 D012),
FUP-7b4b41e2875f852d (WO-158 D029, item a) and FUP-be91067a3842b44a (WO-161
D007). Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: no stop condition.
**Depends on:** WO-158 merged (the waive refusal that reads a live
reservation; closed, v0.49.0); WO-160 merged (the last order to edit the
`resume` dispatch entry; closed, v0.51.0).
**Recommended placement:** paired with WO-085 directly after WO-070 and
WO-115. This order edits `harness-host.ts`, `gate-evidence.mjs`,
`scripts/harness.mjs`, `scripts/resume.mjs` and the contributor loadout;
WO-085 adds a docs check and edits product documents. Disjoint files;
neither depends on the other; only this order re-mints. A recommendation,
not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-158",
    "relation": "satisfied-by-close",
    "reason": "the waive refusal that reads a live writer reservation"
  },
  {
    "workOrderId": "WO-160",
    "relation": "satisfied-by-close",
    "reason": "the last order to edit the resume dispatch entry"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/resume.mjs` (`codexDispatchRoles`;
the `beginHarnessSessionOnce` call; the two `executorWriterRelease` call
sites at `implementation-ready` and `repair-complete`);
`packages/skeleton/src/harness-host.ts` (`writerIsolationFacts` →
`reserveHarnessWriter`, the Claude-only reservation; `beginHarnessSession`;
`releaseHarnessWriterByOperator`); `scripts/lib/executor-handoff.mjs`;
`packages/skeleton/src/gate-evidence.mjs` (`activeGateRuns`,
`requestGateStop`, `beginGateRun`); `docs/evidence/WO-156/repair.md` (the
writer observation); `docs/evidence/WO-161/implementation.md` and
`repair.md` (the two others); `docs/verifications/WO-050/VER-001.md`
finding 1 (the leak this must not reintroduce);
`docs/evidence/WO-139/decisions.md` D005; product 02 §the writer paragraph
("A time-based lease was rejected…"); product 07 §Candidate — stale writer
reservation self-diagnosis; the
[2026-09-25 standard-pass planning document](../planning/standard-pass-2026-09-25.md)
§2 and §3.

**Objective:** a Codex session holds the worktree's writer from its
lifecycle dispatch to its completion without a step of its own, is refused
at dispatch with the holder's identity and age when another session holds
it, is told at session start about an override left open, and can wait for
a live gate with one command that exits with the recorded outcome.

**Observed gap (dated 2026-09-25, `main` at `64f9326f`):**

- Reservation happens only on the Claude hook path (`writerIsolationFacts`).
  `beginHarnessSessionOnce`, which every Codex lifecycle dispatch calls,
  reserves nothing, while the role text says DotLn "reserves one writer per
  worktree" and that completion "releases the current Codex session's
  writer reservation".
- Three Codex sessions since WO-155 met the gap: WO-156's repair (the
  dispatch created the session and reserved nothing; the root ran the hook
  adapter by hand; liveness unknown), WO-161's implementation (reserved by
  the generated pre-tool adapter at 16:52:41, liveness unavailable) and
  WO-161's repair (`reserved:false` before the dispatch and at handoff).
  Frequency across all Codex sessions is unknown: worktree-local session
  journals are discarded at teardown, and main's 121 journals hold planner
  sessions only.
- Only `implementation-ready` and `repair-complete` release;
  `verification-result`, `final-review-result` and `release-close` do not.
- A writer refusal reports the holder's actor id and pid, not its age
  (unchecked since the 2026-09-19 pass recorded WO-139's substance).
- No command waits for a live gate; `evidence --stop` polls the same
  marker directory to end one. A Claude executor watched WO-160's gate with
  `tail -f | grep`, which never exits.
- A session that ends without `operator override: off` appends nothing
  (WO-158 D012).

**Design (scope discipline):**

- Reserve at dispatch inside `beginHarnessSessionOnce` for the Codex roles
  only, through `reserveHarnessWriter` with the actor id
  `executorWriterRelease` computes. A live or unknown foreign holder
  refuses the dispatch with the holder's actor id, owner, `reservedAt` and
  age, before `resume` appends any event; a dead holder is reclaimed and
  journaled as today. Liveness of a Codex-owned reservation is recorded as
  observed (`unavailable` is admitted for the session's own holder), never
  invented.
- Release at every Codex completion command through the existing
  `executorWriterRelease` (generalized as the executor sees fit), keeping
  D005's order: the durable result first, then the release, then the
  "reservation remains" refusal.
- Every reservation refusal (`harness-host.ts`) adds the holder's age in
  seconds and `node scripts/harness.mjs writer --release`.
- `evidence --wait`: poll `activeGateRuns` at a bounded interval until it
  is empty or `--timeout` elapses; print the newest `checks.json` row whose
  `treeHash` matches the current tree, or `{"run":null}`; exit codes as in
  Cost. In Claude Code the command runs in the background so the harness
  re-invokes on exit; in Codex it blocks.
- Session-start advisory: `beginHarnessSession` (Codex) and the Claude
  session hook print one line when the worktree's operator-control state
  records an override entered and not exited, naming its entry time; no
  event is appended.
- Role text in `loadouts/contributor.ts`: the two sentences in Cost;
  regenerate the bundle and skills; re-mint the stale editions.
- Fixtures: a Codex dispatch reserves and its completion releases for all
  five roles; a live foreign holder refuses with age; `--wait` returns on
  an empty marker directory with the row, at timeout with exit 2, and keeps
  waiting while a marker with a live pid exists; the advisory prints once
  for an open override and not otherwise; the carried-edition test resolves
  the live audit through the edition.
- **Declined alternatives, recorded:** a `writer --reserve` command a
  session runs by hand (WO-139 D005 rejected a manual step, and it is what
  the three sessions improvised); dropping the writer under Codex (loses
  the one-writer invariant two lanes rely on); a time-based lease (product
  02: an idle live session is not a dead one); watching gate output for a
  result line (the log has no end marker; the marker directory does); the
  detached-episode supervisor fix (WO-159 D010) inside this order
  (`cli-actor.ts` is a feedback source and would make this order pay a live
  episode).

**Deliverables:** the reservation at dispatch; the releases; the refusal
text; `evidence --wait`; the advisory; the role text, bundle and editions;
the fixtures; the carried-edition test fix.

**Acceptance criteria (all required)**

1. A fixture drives each of the five Codex dispatch roles: `writer --show`
   reports the session's reservation after the dispatch and
   `reserved:false` after its completion command; a live foreign holder
   refuses the dispatch with its age before any event is appended.
2. Every writer refusal names the holder's actor id, owner, `reservedAt`,
   age in seconds and the operator release command.
3. `node scripts/harness.mjs evidence --wait` returns with the recorded row
   and exit 0 after a gate that passed, 1 after one that failed, and 2 at
   `--timeout` with a live marker or with no row; a fixture covers each.
4. A session start in a worktree whose operator-control state holds an open
   override prints the advisory once; none otherwise.
5. The role text carries the two sentences in Cost; `node
   scripts/harness.mjs check` passes; stale editions re-mint
   deterministically with no live episode.
6. `scripts/test-evidence-sources.mjs` passes with a carried feedback
   edition current (FUP-be91067a3842b44a).
7. Product 07's stale-writer candidate records the shipped behaviour in
   place; register rows FUP-a0d6b960702fb9a4, FUP-7b4b41e2875f852d (item a)
   and FUP-be91067a3842b44a are retargeted at close.
8. `npm test` and `npm run test:docs` green; `git diff --check` clean; no
   new dependency.

**Evidence gate:** the fixture transcripts; the verifier's own `writer
--show` at dispatch and after completion when the verification runs under
Codex (its report, not a paid episode); `npm test` at final review.

**Write-back duty:** product 07's candidate, edited in place; decisions; the
register rows.

**Non-goals:** the supervisor that leaves a detached Codex episode running
(WO-159 D010; deferred to the next order that edits `cli-actor.ts` or
`cli-episode.ts`); background-task journaling in Claude Code (WO-142 F2); a
total subagent cap; the outside-write grant checks (WO-158 D028); the
`waive` refusal's CLAUDE_EFFORT item (WO-158 D029, item c).

**Operator-review assumptions**

1. A dispatch that reserves is the Codex equivalent of the Claude hook, not
   a new permission boundary: the operator's phrase already authorizes the
   dispatch that now reserves.
2. A patch: no event schema changes; the reservation file keeps its
   `harness-writer-v1` contract.
