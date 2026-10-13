# WO-118 FINAL-001 — final review

**Verdict:** pass. An exported starter instance's resident carried one filed intent through all fourteen vertical phases to a resolved pull request while presence was away. It replaced a native writer killed mid-episode without a second commit and resumed the same admitted intent after its own SIGTERM and relaunch. It repaired the delayed automated suggestion and rejected the planted wrong one with evidence. The instance's own console showed the run live, and `dotln audit` reproduces it afterwards. The write-backs land in place, and the gates are green. All seven criteria hold at the integrated subject, which keeps every judged byte of the subject VER-002 passed ([D017](../../evidence/WO-118/decisions.md#wo-118-d017--final-review-integration-took-in-nothing-every-acceptance-claim-carried-forward)). The verification sequence is VER-001 (fail: criterion 4 unmet, [D009](../../evidence/WO-118/decisions.md#wo-118-d009--verification-fail-criterion-4-is-unmet-because-no-run-was-both-shown-live-and-audited)), the repair ([D011](../../evidence/WO-118/decisions.md#wo-118-d011--repair-dispatch-run-the-witnessed-rerun-and-restore-the-host-guard) to [D014](../../evidence/WO-118/decisions.md#wo-118-d014--independent-review-of-the-repair)) and VER-002 (pass; two follow-ups, [D015](../../evidence/WO-118/decisions.md#wo-118-d015--verification-board-the-checkers-build-drift-exit-behavior) and [D016](../../evidence/WO-118/decisions.md#wo-118-d016--verification-retain-a-documentation-inventory-follow-up)). This review found eleven follow-ups and nothing blocking. Three are fixed in place, and the rest are boarded with repair rules ([D018](../../evidence/WO-118/decisions.md#wo-118-d018--final-review-follow-up-live-status-misses-how-a-resident-owned-continuation-ends) to [D021](../../evidence/WO-118/decisions.md#wo-118-d021--final-review-pass-final-001-at-the-integrated-subject-eleven-follow-ups-three-fixed-in-place)).

**Subject:** [`docs/work-orders/WO-118-resident-owned-loop-from-starter.md`](../../work-orders/WO-118-resident-owned-loop-from-starter.md) on branch `wo-118`, uncommitted over `main` at `6421221bb46fcb42ed85af112f0c1c2b539200b8`. `git ls-remote origin`, `origin/main` and local `main` all name that commit, origin lists no `wo-118` branch, and the branch carries no commit of its own, so integration merged nothing (D017).

- VER-002 judged code identity `99fb21b175c81af5e893fdbd22fe96663e9ae34df959772247cd2dac98f35448`, the identity of the executor's passing review row. `gateCodeIdentity` returned it before and after integration and after every edit of this review, none of which touched a code byte, so every gate row below is at that identity. VER-001 judged the earlier identity `d8ffd82c…`, which the repair moved.
- The recorded `reportHash` of VER-001 (`sha256:8307ec42…`) and of VER-002 (`sha256:a9a6228f…`) each equal the report's current SHA-256.
- The order differs from `main` in its heading's version label, `(v0.80.0)`, assigned at activation ([D001](../../evidence/WO-118/decisions.md#wo-118-d001)), and in the Release classification, Cost, Design and Non-goals text of the operator's three scope expansions ([D003](../../evidence/WO-118/decisions.md#wo-118-d003--authorized-repairs-and-fresh-proof), [D004](../../evidence/WO-118/decisions.md#wo-118-d004--exact-authorized-status-writeback), [D007](../../evidence/WO-118/decisions.md#wo-118-d007--live-vertical-status)), each bound by a `PlanExecutionAmended` row of planning receipt 044. The seven criteria are the original text, and status reports no waiver, correction, withdrawal or override record.
- No ideation receipt exists for this order: `docs/evidence/WO-118/` holds no `ideation.md`. The nomination provenance is the external review of the revised plan (2026-09-08, finding 1), preserved in ignored intake with its hash in the ledger, synthesized by the planner and amended by the 2026-09-28, 2026-10-10 and 2026-10-11 passes. [Planning receipt 044](../../planning/refutations/2026-10-11-planning-fb68306765535a9d-044.md) judged the order aligned with two known issues, both judged under Known issues below.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.296","model":"claude-opus-5-5","effort":"max","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session, selected max effort with `/effort` with Ultracode on, and made no choice about the verdict. The harness version comes from `claude --version`, and the model is the session's model as the host reports it. Effort `max` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order allows any reviewer effort.

Subagent plan: four `dotln-worker` reviewers in one workflow, against a `subagentCap` of 20 with 0 admissions observed at entry, leaving 16, and no descendants. Each judged one group of lenses read-only, wrote only in the session scratch and ran its probes one at a time under the bounded wrapper: runtime (actor replacement, the status projection and the export), planning gate (the writeback repair), evidence (re-derivation from the retained stores and a privacy screen) and criteria (a completeness critic over every clause and write-back). They returned 21 items, and this review reproduced or re-read each finding it kept before counting it. The handoff reading observed 4 admissions, exact, with 16 remaining.

**Process cost:** entry 102273 tokens; handoff 78622580 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 456270f8-f4db-4077-b014-36c34e7ccb87`.

- Entry was observed at 2026-10-13T14:06:46.012Z after 4 steps and 3 commands.
- Handoff was observed at 15:05:45.920Z after 215 steps and 193 commands. That was after the integration, the affected checks, the review panel, the reproductions, the register disposition, this review's suite runs, the first two document gates and the composed review gate, and before this report's completion, the body's and the notes' gate figures, and the last document gate. It counts 77,728,588 cached input, 624,754 cache-write, 406 uncached input and 268,832 output tokens. These are cumulative transcript totals, almost all cached input, so they do not measure live context. Reasoning tokens and dollar cost are unavailable. The four reviewers' own usage, 967,552 tokens over 353 tool uses in 1,140.8 s by the workflow's count, is outside this dispatch's transcript total. Final counters after the result transition are in the ignored receipts and the response.
- Wall clock from the dispatch (14:06:34Z) to the handoff reading was about 59 minutes. The largest parts were the review panel (about 19 minutes), the native recovery suite (294.5 s), the document gates (50.1 s and 101.3 s) and the planning suite (53.4 s). The rest went to reading, reproductions and records.
- Tradeoff: the panel cost about a million reviewer tokens and a third of the wall clock, and it found the eleven follow-ups this review records, two of them correctness gaps in the order's own surfaces (F1, F7), that two verifications had not reported. The review gate composes from the executor's passing tasks at the unchanged identity rather than rerunning 22 minutes of suites; this review instead reran the three suites that carry the order's runtime and gate claims.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-118/FINAL-001.md`.

Read in full: the order with its known issues, carry-ins, non-goals and operator-review assumptions; VER-001 and VER-002; this order's D001 to D016 and the integration stub; `handoff.md`, `self-review.md`, the evidence README and the witnessed receipt; the control log `docs/control/orders/WO-118.jsonl`; the regenerated `PR.md` stub (meter only); product 07 §Verification review and attack, §Discipline and §Operator-opened planning pass; product 08 §PRs and commits and §Release-note edition; the reader profiles and balanced examples for the PR title, body, commit subject and release notes; planning receipt 044's WO-118 judgment; WO-203's final review, body and notes as the form of the previous review.

Reviewed: the complete subject diff against `main`. Runtime: `packages/skeleton/src/vertical-host.ts` (the interrupted source-change branch) and `packages/skeleton/src/runtime-status.ts` (`verticalCommand`, `intentHoldReason`, the intent loop and its terminal retirement), with `source-change-host.ts`, `vertical-scheduling.ts`, `resident-state.ts`, `vertical.ts`, `dotln.ts` and `scripts/lib/vertical-runtime.mjs` for context. Export: `scripts/launchpad.mjs`, `scripts/test-launchpad.mjs`, the runner's kit labels and `scripts/kit/README.client.md`. Planning gate: `scripts/lib/plan-continuation.mjs`, `plan-receipts.mjs` and `plan-subject.mjs` and the new case in `scripts/test-plan-refutation.mjs`, with the five WO-118 amendment rows. Tests: `scripts/test-vertical.recovery.mjs`, `packages/skeleton/test/runtime-status.test.ts` and the writer fixture. Documents: products 00, 07 and 12, the README, the capability table and both publication locks. The package manifests change only skeleton's version, the console's exact pin and the lockfile; no lint or type suppression directive and no order, report or finding label appears in the added code lines.

Lenses, and why:

- Correctness and tests: the order adds a recovery branch, a status projection and a gate route, each after a live failure.
- Operator flow: the console is what an operator watches during an unattended run, and VER-001 failed the order on it.
- Authority, evidence and privacy: the run wrote outside the repository and to a scratch remote, its evidence is the product exit's record, and the writeback route changes what the planning gate admits.
- Maintainer in six months: WO-083 runs this loop in an operator's instance, so a stale claim lands there.

Integration: `npm run worktree -- integrate WO-118 --intake-backup <session scratch>/DotLn-wo118-intake-20261013T140842Z.zip` took the backup from a fresh `npm run backup:intake` of the three ignored intake files, fetched `main` equal to the base, checkpointed the work (`refs/dotln/checkpoint/WO-118/10`), retained its named stash `20c4b1f9…`, re-applied the work without an authored conflict and regenerated projections only. D017 records the carried-forward claims. No component version collides: local tags and origin both end at v0.79.0, and `check-surfaces --local` reports the release block v0.80.0 over v0.79.0, skeleton's src changed at 0.58.1 and the five other components unchanged. The changed registered evidence sources are `packages/skeleton/package.json` and `package-lock.json`, whose only change is the release label the editions normalize away, so no re-mint is owed.

Disclosure: instruments under review also recorded this work. The changed planning gate judged `npm run plan -- check` and the document gate's planning tasks; the changed runner, whose change is kit labels only, recorded every gate row; the repaired `projectRuntimeStatus` produced the status replays; and the order's own `check-witnessed-run.mjs` is among the checks below. Each was also judged directly: the gate by attacks in scratch clones, the projection by fixture probes and raw-log comparisons, and the checker's claims by independent re-derivation from the stores and by this review's resident-audit comparison.

## Known issues and the ideation receipt

- **Receipt 044, criterion 3 (known issue, a leak outside the declared set):** occurred. VER-001 found runtime evidence identifiers in the generated body, the runtime's reply and the branch, outside the configured vocabulary ([D010](../../evidence/WO-118/decisions.md#wo-118-d010--verification-follow-up-target-facing-text-carries-runtime-identifiers-outside-the-declared-outward-set), FUP-a272d577fd351b43). VER-002 and this review's evidence reviewer re-observed the same forms on the live pull request (read-only, 2026-10-13T14:14:19Z). Criterion 3 judges the declared set and routes such a case to a follow-up by its own text; the row stays for the planner before WO-083.
- **Receipt 044, criterion 1 (known issue, an outside-project write refusal):** did not occur. The witnessed run wrote six directories outside the repository, all under the system temporary root every default role is granted ([supplement](../../evidence/WO-118/final-001/witnessed-supplement.json)). Status records no override, and no DotLn outside-write refusal is on record. The only refusal recorded is the host's auto-mode classifier declining the remote setup writes, which the operator answered by choosing the witnessed rerun (D011).
- **Carry-in FUP-faae1df8f1022634 (baseline assessment):** met. The admitted intent carries its model-produced baseline assessment in the initial and witnessed runs, and the checker asserts it.
- **Carry-in FUP-82750a69c54c2ced (WO-123-D044's five items):** recorded. The witnessed receipt lists all five conditions with what was observed, none occurred, and the checker derives each; the receipt follows D044's own list.
- **Item (e) of the 2026-10-11 route pass (the instance's own planning pass):** declined with the operator's agreement before activation; its reopening conditions have not occurred, and FUP-7787c6f1867375f8 is unchanged.
- **Depends on:** all fifteen typed dependencies are closed, and status reports each met.
- **Operator-review assumptions:** 1 (a failed run records its receipt and does not close the order) holds: the initial, repaired and completed runs and the visibility witness are preserved with their causes. 2 (the operator witnesses from the operator's terminal) was delegated: the executor witnessed under WO-112-D007's delegation, which the order's 2026-10-07 decision admits, and no operator-terminal attestation exists. 3 (the operator's inputs to the two controls) holds: the ambiguous filing, its answer and the planted suggestion are the only control inputs, and the rejection is the runtime's triage.

## Earlier findings

- **VER-001 F1 (blocking, no run both shown live and audited): repaired.** The witnessed run's own console ran from before the first command to after the terminal state, and its vertical and resident audits reproduce its stores (D013). VER-002 reproduced it, and this review's evidence reviewer re-derived the frame counts, snapshots and audit equality from the raw stores.
- **VER-001 F2 (follow-up, outward identifiers): boarded** in D010 with FUP-a272d577fd351b43, re-observed unchanged.
- **VER-001 F3 (follow-up, finished verticals in live status): repaired** in D012; VER-002's 500-intent probe and the new status test cover it. This review's F1 is the one ending that retirement does not see.
- **VER-001 F4 (follow-up, the D044 record): repaired** in the witnessed receipt.
- **VER-002 F1 (follow-up, the checker's build-drift exit): boarded** in D015 with FUP-ca4ac7a4862415c4; the evidence reviewer reproduced it, no worse. **VER-002 F2 (follow-up, product 03's inventory): boarded** in D016 with FUP-baed69b4ca53afa1.

## Criterion judgments

**Criterion 1:** met

- Phase transitions: the witnessed checker asserts that every resident event's actor is `resident-host`, that every vertical event's actor is `vertical-host`, and that all 14 `VerticalStepCompleted` steps completed in order. The evidence reviewer re-derived the same from the 11 raw logs (558 events): the actors are the runtime's hosts and the loadout identity, none of them an operator or console actor.
- Human events: across all logs the only human-origin event is `evt_8`, presence away (setup). The instance's control log allocates WO-900 and WO-901 from the two filings and WO-902 from the runtime. That set equals `human-events.json`.
- Named inputs: the control-author mapping (setup, before the resident's first start), the control issue, the kill (10:53:53.557Z), the SIGTERM and relaunch (10:53:26.499Z and .602Z), the answer (10:52:38.276Z, not consumed) and the planted suggestion (10:56:58.362Z) all precede the terminal settlement (`evt_102`, 11:01:05.309Z). Each is named in the receipt or its control-action inventory. The witness line names the executor under WO-112-D007's delegation and D011's authorization.
- Terminal: resolved, with the representative's `needsHuman` false and both threads resolved. Read-only re-observation at 14:14:19Z and 14:21:49Z found the pull request open with two `fix:` commits and head, title and body unchanged.
- Read with F2: both writers' `requiresHuman` reports never reached the control log, which is the record the criterion judges, and it holds no NeedsHuman.

**Criterion 2:** met

- Replacement: two `WorkerAttemptStarted` events share one command (`cmd_cbd7c0ac18aef22e`) and episode (`ep_ef6b4ef7218024a7ff8d4421`, attempts `_1` and `_2`).
  - SIGKILL came 1,238 ms after attempt 1 started, after one heartbeat, with no commit.
  - `SourceChangeProcessStopped` followed 14 ms later, and attempt 2 started 1,861 ms after the kill.
  - One `SourceChangeObserved` and one source commit followed. The ledger starts and settles the source step once, and the later commit is the review repair.
- Restart: SIGTERM came 72 ms after the bundle settled (`evt_22`, 10:53:26.427Z) and the relaunch at 10:53:26.602Z. The contract step started 365 ms after the relaunch, with one admission, one opened vertical and one binding key.
- This review's run of the native recovery suite passed 15 of 15 at the subject's identity: five actor-death modes, the terminal case and nine WO-199 cases.
- Limits: the kill came before any commit and the restart between steps, and the runtime records no resident lifecycle event.

**Criterion 3:** met

- Pull request: open, with a generated title and body equal to the recorded observation and two `fix:` commits, by read-only re-observation.
- Delayed suggestion: model triage accepted the whitespace suggestion, one commit repaired it, verification passed the delivered head against the original criterion, and its thread is resolved.
- Planted suggestion: model triage rejected the instruction to restore Pending, with three evidence references and the runtime's reply.
- Outward checks: the outward lint passes ten live artifacts, and the six-file delivered tree holds none of the declared terms or prefixes.
- Receipt 044's known issue occurred (D010), and the criterion routes it as a follow-up.

**Criterion 4:** met

- The instance's own console ran from before presence-away to after the terminal state. It painted 73 frames: 37 change-driven, 18 requested status frames and 18 repaints, each repaint identical to the live frame before it.
- In change-driven frames, every step lasting two seconds or more appears as a live `vertical-host` actor: baseline, source-change, verification, review, publish, observation and resolution. Lint does too.
- Seventeen change frames show live work beside the contract hold. WO-902 shows active. The final change frame has no vertical-host row, and the hold remains.
- The snapshots hold 18 rows: the 14 settlements, the hold, the kill, the terminal state and one restart marker.
- `dotln audit` over the vertical store reproduces all 29 events in its governed raw view. Over the resident store it reproduces a 116-event prefix followed only by clock samples. L0 and L1 summarize none of them.
- F1, F4 and F6 are gaps the run did not meet or that lie outside the criterion's named items, and they are boarded in D018.

**Criterion 5:** met

- 24 measure rows, each labeled `observed`, `launch-claim` or `unknown`, with a method.
- The eight parity items equal WO-112 criterion 3's list and are all observed-met, so the replacement claim is limited to them.
- The checker and the evidence reviewer recompute the 458,886 ms cycle, the 560,263 ms driver window and the 13 launches.
- The supplement now records each launch's claim per episode: codex-cli-exec 0.162.1, gpt-6.1-sol and max, with effective model and effort unknown.

**Criterion 6:** met

- Placement:
  - Product 00's sentence sits inside §The one-paragraph story (line 133, between the headings at 118 and 135), appended in place.
  - Product 12 extends the WO-112 sentence in place.
  - The README adds one sentence inside the `dotln-what-runs` markers, 10 of 11 budgeted lines.
  - The capability table appends `## WO-118 dated reassessment (2026-10-13)` after the WO-112 and WO-201 sections and edits no row in place. It rates both scopes 1, demonstrable, with E0 and cites the witnessed receipt; the rating rests on criterion 1 observed.
- The decisions file holds D001 to D021. Both publication locks are current; the software-engineer lock was refreshed again after this review's product 07 fix.
- The two capability rows omit the ", live-evidenced" label that other live rows carry, as WO-112's row does. Their substance, live witnessed receipts from a starter instance, is present.
- The product 00, product 12 and README sentences still describe live status as a fresh export's demonstration. They remain true, because the witnessed run was itself a fresh export, and the product 00 sentence is hash-bound by D007.

**Criterion 7:** met — `npm test -- --review`; `npm run test:docs`; `git diff --check`.

- `npm test -- --review`: the executor's fresh row at `99fb21b1…` passed 36 suites and 91 fresh tasks in 1,335.7 s with exit 0. This review's composed row at the same identity passed 36 of 36 in 6.52 s, with one fresh task (format) and 90 reused from that row, `identityUnchanged` and `buildOutputUnchanged`, recorded 2026-10-13T15:05:15.982Z.
- `npm run test:docs`: this review's row at the same identity passed 35 of 35 in 101.28 s, all fresh, recorded 15:04:59.133Z, after this report's first draft; the later run is in Executed checks.
- `git diff --check` is clean, and `npm run format:check` passes.
- The package manifests change only skeleton's version, the console's exact pin and the lockfile, so no dependency is added.

## Findings

<!-- dotln-findings:start -->
[
  {"id": "F1", "route": "follow-up", "class": "escape", "summary": "A continuation whose authority expires between steps keeps a stale vertical-host row and shows no hold in live status (D018)."},
  {"id": "F2", "route": "follow-up", "class": "new-scope", "summary": "The source-change host drops a writer's blocked status and requiresHuman, which both witnessed writers reported (D019)."},
  {"id": "F3", "route": "follow-up", "class": "new-scope", "summary": "The Codex writer's git commit exits 128 under the dotln-writer Git grants at codex-cli 0.162.1 although the commit lands (D019)."},
  {"id": "F4", "route": "follow-up", "class": "new-scope", "summary": "The live status budget line counts only portfolio-actor dispatch, not intent admission (D018)."},
  {"id": "F5", "route": "follow-up", "class": "escape", "summary": "Under dotln vertical a killed writer now leaves the step pending instead of refused, with no operator-path test (D019)."},
  {"id": "F6", "route": "follow-up", "class": "new-scope", "summary": "Once a finished continuation retires, live status shows no sign of the outcome; the order list never changes (D018)."},
  {"id": "F7", "route": "follow-up", "class": "escape", "summary": "An authorized story writeback does not compose with a vision citation relocation until the next planning pass (D020)."},
  {"id": "F8", "route": "follow-up", "class": "escape", "summary": "Product 07's writeback paragraph sat before an unrelated citation and omitted the current-amendment rule; fixed here (D020)."},
  {"id": "F9", "route": "follow-up", "class": "escape", "summary": "The evidence README overstated which committed transcripts the witnessed checker compares; narrowed here (D021)."},
  {"id": "F10", "route": "follow-up", "class": "escape", "summary": "The witnessed run's committed evidence lacked its outside directories, export checks and per-episode launch claims; supplemented here (D021)."},
  {"id": "F11", "route": "follow-up", "class": "new-scope", "summary": "Product 04 does not describe runtime-status-v1's vertical-host rows and intent hold codes (D018)."}
]
<!-- dotln-findings:end -->

None blocks. No criterion is unmet, and no finding breaks behavior `main` had: `main`'s status showed no vertical work, `main`'s source-change host already ignored `requiresHuman`, and `main`'s planning gate refuses any change to the story at all. Product 07 routes every such defect as a follow-up.

How each finding was established:

- **F1:** reproduced with a bounded fixture probe. Authority expired between steps: the vertical ended NeedsHuman at `derived-order`, while the resident ledger held only non-terminal settlements and status kept `surfaces:vertical-host:unknown` with no hold.
- **F2:** reproduced by a scan of every retained `WorkerResultObserved` event and by reading `source-change-host.ts`.
- **F3:** established from the writers' attempt records (codex-cli-exec 0.162.1), their summaries, the target's Git configuration (`rerere.enabled` true) and WO-112-D017's grants. The denials themselves are the writers' report; the host records `observedDenials` as unavailable.
- **F4 and F6:** read from the projection and the witnessed console transcript.
- **F5:** read from `vertical-runtime.mjs`, `vertical-host.ts` and `dotln.ts`; not executed.
- **F7:** reproduced on three scratch clones, with the gate rerun by this review.
- **F8 to F11:** read from the documents and records.

The class follows product 07: `escape` for a defect in the verified subject inside verification's instructed scope, and `new-scope` otherwise. Each escape lies in that scope:

- F1 is in the D012 projection and the kit README.
- F5 is in the D003 branch.
- F7 and F8 are in the D004 gate and its product 07 text.
- F9 is in the evidence README.
- F10 is in the Design's outside-directory clause and the Model field's per-episode launch claims, inside the evidence surface.

F2, F3, F4, F6 and F11 lie in behavior or documents this order does not change. F8 to F10 change documentation or evidence only, no code byte and no judged claim, within the reviewer's Boy Scout bound.

## Register

`npm run plan -- followups --touching` matched 43 pending rows of 258 at revision `dbf39a8e…` before this review's records, read over all pages, with each matched row's full disposition history read where its condition named WO-118 or a changed file. After `npm run meta` minted the three new rows, it matched 47 of 263 at `1f8f11d4…`. One batch request moved the register to `d0b02059…` with 264 pending, and a reread matched 48.

| Row | Disposition | Why |
| --- | --- | --- |
| FUP-0091 (Context Continuity) | deferred, new trigger | The trigger, WO-118 activates, fired on 2026-10-13. The witnessed run lasted 560 s with 13 short native episodes, and no WO-118 record names a session that lost its owned task after compaction. The next long resident-owned run is WO-083's. |
| FUP-3d4b39cd4b2c4a08 (WO-116 D008, audit classes for resident events) | deferred, new trigger | The trigger, WO-118's run is audited, fired. L0 and L1 were empty for the vertical and resident stores, and the governed raw view carried criterion 4, so the audit was usable without summaries for this scenario. |
| FUP-441469088613e52a (the absence-curve experiment) | deferred, retargeted to WO-118's close | WO-118 activated. Presence stayed away under the finish policy, so the run exercised no part of the curve. The experiment's prerequisite reaches `main` at this order's close. |
| FUP-7e0490f3c107e919 (private paths in receipt statements) | deferred, narrowed trigger | WO-118 edits `plan-receipts.mjs` only to validate the writeback binding; it touches no receipt statement or screen. |
| FUP-9625ca888d7d08f5 (WO-162 D016, correcting an execution amendment) | deferred, narrowed trigger | Both halves fired: D004 and D007 were edited after their first amendment rows, and the binding code changed. Re-binding the same decision supersedes the earlier row, and the gate passes; withdrawing a row whose decision changed still refuses. |
| FUP-b8440605da5a4eb2 (WO-112 D047, replayed record labels) | deferred, retargeted to WO-083 | Its 'before WO-118's live run' trigger passed unacted. No replayed record failed validation in WO-118's runs. |
| FUP-50a41e39f51a3e01 (WO-090 D006, an executor route for goal-standard edits) | deferred, relation recorded | WO-118-D004 opened an adjacent, narrower route for one goal-standard input (the story, with exact bytes and no fresh refutation). Product 07's goal-alignment section still has none. |
| FUP-c842faafbe34c7da (WO-112 D008/D017, Codex writer Git grants) | reopened (open) | Its condition occurred in substance in every WO-118 run (F3); D019 reopens WO-112-D017. |

The order's own new rows stay untriaged for planning, as the boarded follow-ups they are: FUP-2b9a8e696b38fb97 (D018), FUP-6c444dbf9a4d92bb (D019) and FUP-c8ec65f056105759 (D020), beside VER-001's and VER-002's rows FUP-a272d577fd351b43, FUP-ca4ac7a4862415c4 and FUP-baed69b4ca53afa1 and the repair's FUP-e18e6a5422109bfb, FUP-eeb25ea9315438ad and FUP-589c1d588cb302a9.

The other matched rows are left as they are. Their seams this change did not open, and their conditions have not occurred:

- **Close-time triggers:** FUP-0044 and FUP-e5fccb54a23a8af7 name WO-118's close, and the planning pass after release close disposes them, as this order's non-goals note for FUP-0107.
- **Conditions checked in the run records:** FUP-0d2a940087f0036d needs WO-083's run. FUP-49c4a5f7176252e7 needs an untyped refusal after a rerun; the only source refusal, in the initial run, came before any rerun, and every later replacement completed. FUP-5d48c4f3c2a3730d did not fire: the four triage records judged four distinct items. FUP-88c339c51cfc1933 did not fire: no run configured a browser scenario. FUP-642d7a4beaed2272 did not fire: the runner's format-preflight case failed in no gate of this order.
- **Planning triggers that cannot fire after this order closes:** FUP-7c269a184f75e742 and FUP-165f9860f8f32a67 wait for a pass that places WO-118 first or in a head pair. No pass did; the route pass listed it sixth. The run met none of their run conditions: two review threads, no body-limit stop, a fresh resolution observation, and no operator walkthrough.
- **Textual matches on runner, gate and document paths:** FUP-a6cf30a8b7bc4a83, FUP-acfe4bfda716d8fb, FUP-de6162b279f66709, FUP-e8f5399db33d0b5a, FUP-fd05316b6030ef73, FUP-9b0632b0ec72d168, FUP-00af89947ed9099f, FUP-dc58e92c5cafc732, FUP-dc79b4b1065bf66e, FUP-cc27c2c1a82fed2c, FUP-d0a9719cc2e4ec55, FUP-e821aa2ced3aa111, FUP-f5f10101e717d59b, FUP-fb8cbeabbddef397, FUP-beb13d8d099d2917, FUP-67a07b670440cf5a and FUP-f1c7a256bec46737. The Codex `ultra` readback mapped to xhigh in this order's attestation is the same pattern earlier orders recorded.
- **Other untriaged rows:** FUP-2eddaaaa1ea5d3c3 and FUP-3cceac0fff2dba94 are other orders' rows for planning.
- **The rule this review applies:** FUP-4b70089b028849f0, ER5-002's rule that the observer of a fired trigger re-disposes it. No fired trigger is left unchanged.

## Observations (not findings)

- **Projection cost.** The projection rebuilds the continuation program for every admitted intent on each publication: about 23 µs per intent and 47 ms at 2,000 finished intents, by a bounded probe; the witnessed run's two intents cost about 0.05 ms. D018 offers memoization as optional.
- **A stale live episode during relaunch waits.** A step kept pending after an actor death shows as an available live episode until relaunch, also while presence or a dispatch hold delays the relaunch. This is inferred from the code and was not reproduced.
- **Null payloads.** An event with a null payload makes the projection throw, but `replayResident` rejects such a ledger first with "invalid resident event payload" (bounded probe), so no resident path reaches it.
- **Skeleton's patch level.** Skeleton moves to 0.58.1 and the console keeps 0.4.2 with only its pin moved. That satisfies the enforced rule, and a patch fits repairs framed within runtime-status-v1's existing fields (D021).
- **The writeback anchor.** A writeback's criterion is an unchanged-text anchor: any order's operator-authorized amendment can bind the story writeback to one of its own criteria (the planning reviewer's attack). The authority rests on the decision and its amendment row, as product 07 states (D020).
- **The checker's final frame.** The witnessed checker's final-frame assertion reads a repaint frame identical to the last change-driven frame. The claim holds, and the checker's repair under FUP-ca4ac7a4862415c4 should assert on the change-driven frame.
- **Planning signals.** `npm run meta` reports the standing WO-150-D003 cold-start candidate (`coldStartBytes.executor` 28,112 against 24,576). It also reports a seeking-the-wrong-goal candidate: machinery share 0.217 (Δ 0.047) and elapsed time per code byte 308.4 (Δ 20.4), worsened over three consecutive order deltas. Both are for the next planning pass.
- **The roadmap table.** The document check reports that product 06's release table lacks tags v0.75.0 to v0.79.0. This is informational and standing, not this order's.

## Release surfaces

`PR.md` carries the reviewed body above the meter the integration regenerated, written under product 08 §PRs and commits and the `prBody` profile:
- the resulting behavior first, and why it matters;
- what the run showed;
- the three runtime repairs and the planning route;
- the limits a reviewer acts on, with their decisions and register rows, and the operator's action on the scratch repository;
- the validation, with links relative to the body file.

`RELEASE-NOTES.md` has the five sections of product 08 §Release-note edition, one physical line per prose paragraph. The proposed title is a headline with a gitmoji shortcode, sized by the change against the whole merged series: `:sparkles: An exported starter's resident takes one filed intent to a resolved pull request unattended, replacing a killed writer and surviving its own restart`.

## Executed checks

Checks ran under `node scripts/harness.mjs bounded`, one process at a time, where noted. The worktree was only read until the writes this report names. Times are 2026-10-13 UTC.

| Check | Window | Exit | Result |
| --- | --- | --- | --- |
| `node scripts/harness.mjs usage` at entry (not bounded) | 14:06:46 | 0 | 102,273 tokens, 0 subagents |
| Report hashes; `gateCodeIdentity`; canonical gate rows at that identity (not bounded) | before integration | 0 | VER-001 `8307ec42…` and VER-002 `a9a6228f…` equal their recorded hashes; `99fb21b1…`; the executor's fresh review row (exit 0, 36 suites, 91 tasks, 1,335.7 s, 11:58:03Z) and four document rows at that identity |
| Diff reads; dependency manifests; suppression and label greps (not bounded) | before integration | 0 | 30 tracked files and the untracked evidence; manifests change only skeleton's version, the console pin and the lock |
| `npm run backup:intake`; `npm run worktree -- integrate WO-118 --intake-backup …` (not bounded) | 14:08:42–14:08:52 | 0 | 3 intake files archived; no-op merge; checkpoint `refs/dotln/checkpoint/WO-118/10`; stash `20c4b1f9…` retained; D017 |
| `gateCodeIdentity` after integration; `git diff --stat main -- .claude .agents .codex`; `git ls-remote` (not bounded) | 14:09 | 0 | `99fb21b1…`; empty; origin `main` at the base, no `wo-118` branch, no v0.80.0 tag |
| Bounded `npm run publication:check`; `node scripts/harness.mjs check`; `npm run release -- check-surfaces --local`; `node scripts/lineage.mjs index --check`; `node scripts/check-publication.mjs --print-locks`; `npm run format:check`; `npm run plan -- check`; `git diff --check` (not bounded) | 14:09:15–14:09:43 | 0 each | 254/254 headings, both editions CURRENT; 34 surfaces; release block v0.80.0 over v0.79.0, skeleton src changed at 0.58.1, five components unchanged, PR body profile passes; 170 sections; locks equal the committed values; formatted; plan check passes with `authorized-execution-writeback` (D007); clean |
| Register `followups --touching`, all pages (not bounded) | 14:13–14:31 | 0 | 43 matched of 258 pending at `dbf39a8e…`; every condition naming WO-118 checked against the run records |
| Four `dotln-worker` reviewers (workflow) | 14:13–14:32 | done | 21 items; 4 agents, 353 tool uses, 967,552 tokens, 1,140.8 s |
| Bounded reproductions | 14:33–14:47 | 0 each | F1 expiry probe (stale row, no hold); F2 writer-status scan across the retained runs; F3 attempt records and the target's Git configuration; F7 gate on three scratch clones; null-payload replay; resident-audit comparison (116 = 116) |
| Bounded `node docs/evidence/WO-118/final-001/supplement.mjs`; privacy scan of its output (not bounded) | 14:42:23 | 0 | 6 outside directories under system-temp, export checks 913/34/34/913, delivery shapes, 13 launch claims; no private selector |
| Product 07 fix; `npm run publication:check`; lock refresh; bounded `npm run plan -- check`; `node scripts/lineage.mjs index --check` | 14:44–14:46 | 1, then 0 | the software-engineer lock went stale, then CURRENT after its refresh; plan check passes; 170 sections |
| D017 to D020; `npm run meta`; `followups --apply` (one batch); `followups --touching` (not bounded) | 14:46–14:50 | 0 | 20 decision blocks parse; 3 rows minted; register `1f8f11d4…` to `d0b02059…`, 8 dispositions, 264 pending, 48 matched |
| Bounded `node --test packages/skeleton/dist/test/runtime-status.test.js` | 14:49 | 0 | 10 of 10, 2.42 s |
| Bounded `node --test scripts/test-vertical.recovery.mjs` | 14:50:08–14:55:02 | 0 | 15 of 15, 294.5 s |
| Bounded `node scripts/test-plan-refutation.mjs --fixtures-only` | 14:56 | 0 | 88 of 88, 53.4 s, both new writeback cases |
| `npm run format` twice; `npm run format:check` (not bounded) | 14:57 | 0 | stable; identity `99fb21b1…` unchanged |
| `npm run test:docs` (first run; not bounded) | 14:57:39–14:58:29 | 1 | 17 passed, 18 failed: `docs-check` refused the body and notes' links to this report and D021, which did not exist yet; the rest were not executed; recorded 14:58:29.491Z |
| D021 and this report's first draft; `npm run meta`; `npm run format`; `npm run test:docs` (second run; not bounded) | 14:59–15:04:59 | 0 | 21 decision blocks parse; every script unchanged, identity `99fb21b1…` unchanged; 35 passed, 0 failed, 101.28 s, 35 fresh tasks; recorded 15:04:59.133Z |
| `npm test -- --review`, in the background (not bounded) | 15:05:07–15:05:16 | 0 | 36 passed, 0 failed, 6.52 s; composed: one fresh task (`format`) and 90 tasks reused from the executor's fresh row of 11:58:03.830Z at the same identity; recorded 15:05:15.982Z, `identityUnchanged` and `buildOutputUnchanged`; the product-gate row this result cites |
| `node scripts/harness.mjs usage` at handoff (not bounded) | 15:05:45 | 0 | 78,622,580 tokens, 4 subagents exact, 16 remaining |
| Gate figures in the body, the notes and D021; two report corrections; `npm run meta`; `npm run format`; `npm run test:docs` (third run; not bounded) | 15:06–15:08:58 | 0 | every script unchanged, identity `99fb21b1…` unchanged; 35 passed, 0 failed, 105.20 s, 35 fresh tasks; recorded 15:08:58.024Z; the result transition's inline run at the filed bytes follows this table's last edit |

Repository writes:
- this report, `PR.md` and `RELEASE-NOTES.md`;
- D017's completion and D018 to D021;
- the supplement and its collector under `docs/evidence/WO-118/final-001/`;
- three passages of the evidence README;
- the product 07 paragraph and the software-engineer edition's lock;
- eight register dispositions;
- the regenerated projections, indexes, locks and meter that the integration and `npm run meta` produced.

No behavioral source was edited. The intake backup, the probes, the clones and the gate logs stayed in the session scratch. The register request was written to the ignored `.runtime/` path and removed after the apply.

Goal alignment:

- **Traps:**
  - Deferring to VER-002's pass instead of judging the run's own records; this was answered by the panel and the reproductions.
  - Treating the writers' `requiresHuman` as noise, or failing the order on a host rule it never touched; it was recorded and boarded with the evidence.
  - Widening the review into runtime fixes that two verifications never saw; these were boarded with repair rules.
  - Leaving the fired register triggers for another pass; each was re-disposed from the run's evidence.
  - Rerunning the live loop for the appearance of rigor.
- **NoOp:** failing would send a subject with every criterion met through another repair and verification and hold WO-083. Passing silently would leave the eleven gaps unrecorded for the run that meets an operator's repository.
- **Outcome:** matched. The criteria were judged against the run's records at the judged identity, eleven follow-ups were recorded with their routes, three were fixed in place without touching code, and the reviewed work is preserved for the commit series.
