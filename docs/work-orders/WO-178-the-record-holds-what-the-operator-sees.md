# WO-178 — The record holds what the operator sees: the hooks journal host denials and each operator message's route, time and class, the Stop advisory names running monitors, the lifecycle admits the exact publish command under Claude auto mode, and `plan failures` counts closes, denials, interventions, long phases and repeated gate runs beside the judgments it already lists (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. Additive journal rows, one admission
in the permission hook for one exact command shape under recorded
lifecycle facts, read-only counts in a command that exists, one header
line the index reads as optional, one document check; no refusal of a
completion, no control-event schema change. Assigned at activation under
the standing opt-out default.
**Cost:** adds a `PermissionDenied` hook registration in the generated
Claude settings and its journal row (tool, input digest and bracketed
reason; under 1 KB a denial); a typed row per operator message from the
prompt hook (route, time, digest, byte count, prefix class or
`unclassified`, order, role, phase; never text); the Stop advisory's list
of background dispatches this session started that still run; one
`permissionDecision: allow` in the generated permission hook for the byte
exact release-close publish or dry-run helper when the session's recorded
dispatch is `release-close` for that order, cwd is the main checkout and
canonical status lists `release-close` among its legal actions; in
`plan failures` and `plan start`: a count of closes whose
`release-close.json` (WO-176) shows a blocker or an unpublished tag, of
host denials, of interventions by class, order and phase, of phase
attempts above twice the phase's median, of product-gate rows at an
identity already green, and the delivery/machinery split of the last
eight closed orders from an optional `**Track:**` header; one check in
`scripts/docs-check.mjs` that a sentence attributing words to the
operator in a work order's provenance line or a decision's text cites a
capture digest; fixtures for each. Removes: the two classes of failure
this pass could not see (a close that stopped short, a host denial of
the publish); the 86% of correction episodes no role writes down
(WO-172 D013: the record holds 29 of 203); the hand timing of long
phases and the hand count of gate reruns the 2026-09-28 and 2026-09-30
passes paid; the drift no pass noticed until the operator did (2026-09-28
§11). Re-mints: `packages/skeleton/src/harness-host.ts` is a registered
evidence source and a declared machinery source, so the editions it
stales are re-minted deterministically and `npm test -- --review` runs
before handoff; `scripts/refute-plan.mjs`, `scripts/lib/plan-failures.mjs`,
`scripts/docs-check.mjs` and `scripts/work-orders.mjs` are not registered
sources; no judged feedback source changes, so no live episode.
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's dispatch of 2026-09-30 (item 3:
the Claude auto-mode classifier denied `release close WO-086 --publish`
as "Create Public Surface" and the session neither retried nor sought
another route; messages 3 to 5: WO-172 should have given the pass a
trove of places to improve, beside the queue and the boarded items),
captured in ignored intake (SHA-256 in the ledger section); WO-172's
subject map themes 8, 11, 13, 20, 23 and 30 and its measurement that
the record holds 14% of correction episodes (D013) with the classes the
operator confirmed (D018); the 2026-09-25 map item on the classifier
denying a verifier's instrument run, whose class recurred in another
role; register rows FUP-84ea5fb168c317cf, FUP-0c76cd39223a576b,
FUP-ecf9d3b703a0b7d9, FUP-f287a595299249ff, FUP-71fc2efc208f597a,
FUP-01e80ba5ce62c72a, FUP-d90c46abf5658272 and FUP-3682b768d1d00a3b
(DotLn-owned authority, whose first admission this is). Claude Code's
documentation read on 2026-09-30: allow, ask and deny rules resolve
before the classifier and narrow Bash rules stay in effect in auto mode
while wildcarded interpreters are suspended; a PreToolUse hook's
`"allow"` "bypasses the permission system entirely and runs without
prompting the user or checking permission rules"; the `PermissionDenied`
event fires "when auto mode denies a tool call, including denials
without a classifier verdict"; `autoMode` configuration is read only
from user or managed settings. Planner-synthesized. Opaque identifier,
not a priority. Clean-room screen: the operator's words never enter the
journal, only digests and classes; no stop condition.
**Depends on:** WO-175 merged (both edit `scripts/refute-plan.mjs`;
WO-175 closes first); WO-172 merged (`plan failures`; closed, v0.56.2);
WO-066 merged (D012: the hook enforces exact spellings; closed, v0.57.0).
**Recommended placement:** paired with WO-181 in the fourth slot, the
machinery lane beside the independent review episode (disjoint: WO-181
edits the skeleton's verification protocol and host). This order edits
`packages/skeleton/src/harness-host.ts`, `scripts/refute-plan.mjs`,
`scripts/lib/plan-failures.mjs`, `scripts/docs-check.mjs` and
`scripts/work-orders.mjs`. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-175",
    "relation": "hard",
    "reason": "both edit scripts/refute-plan.mjs; WO-175 closes first"
  },
  {
    "workOrderId": "WO-172",
    "relation": "satisfied-by-close",
    "reason": "plan failures and the block plan start prints"
  },
  {
    "workOrderId": "WO-066",
    "relation": "satisfied-by-close",
    "reason": "the permission hook's exact-spelling rule (D012)"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/skeleton/src/harness-host.ts`
(the PreToolUse permission facet and its `permissionDecision: deny`
paths; the UserPromptSubmit handling; the Stop advisory that lists
journaled background dispatches, WO-141; the session journal writer);
`scripts/lib/harness.mjs` (the generated settings and hook emission;
`allowed` output paths); `.claude/settings.json` (the hook wiring at
`b51a58a8`: PreToolUse, PostToolUse, UserPromptSubmit, SessionStart,
Stop; no `PermissionDenied`); `scripts/release.mjs` and `scripts/worktree.mjs`
(the exact helper text they print); `scripts/refute-plan.mjs` (`start`,
`failures`) and `scripts/lib/plan-failures.mjs`; `scripts/lib/meta.mjs`
(`completedPhaseAttempts`, read only); `docs/control/local/harness/checks.json`
(the gate index rows and their `codeIdentity`); `scripts/docs-check.mjs`
(the baseline-aware link check, as the place a sentence check joins);
`scripts/work-orders.mjs` (the header fields the index reads);
`docs/evidence/WO-172/decisions.md` D008, D013, D018, D053, D059 and
`intervention-subjects.md` themes 8, 11, 13, 20, 23, 30;
`docs/planning/failures-across-phases-2026-09-28.md` §8, §9, §11;
`docs/AI-HARNESS-SECURITY.md` §Current mode choices (the Claude
auto-mode row); product 07 §Operator resume phrases (the release-close
row) and §Discipline (the five refusals).

**Objective:** a planning pass opens on a record that holds what the
operator saw: the close that stopped, the command the host refused, the
correction nobody wrote down, the monitor left running, the phase that
ran twice its median, the gate run again at an identity already green,
and how much of the last eight closes was delivery. And under Claude
Code auto mode the one command the lifecycle has already authorized runs
without a classifier verdict, because the lifecycle admits it.

**Observed gap (dated 2026-09-30, `main` at `b51a58a8`):**

1. The generated permission hook emits only `deny` decisions; the project
   settings carry no allow rules and register no `PermissionDenied` hook.
   The operator reports that on 2026-09-29 the auto-mode classifier
   denied `release close WO-086 --publish` as "Create Public Surface" and
   the session did not retry or find another route; the tag was created
   at 16:00 local by a route the record does not show. The session
   journal of that close holds 192 Bash rows and no denial.
2. WO-172's survey read 2,396 operator messages and found the record
   holds 29 of 203 correction episodes (14%) and 29 of 44 failure
   instructions (D013); its D018 confirmed the classes correction,
   override, ideation and other step on both sampled items and named two
   the rubric lacked, positive reinforcement and trial and error. The
   prompt hook sees every Claude message and records none of this.
3. Since WO-173 closed (2026-09-28T17:00Z to this pass), the gate index
   holds 40 `npm test` rows across 11 orders, 12 of them fresh runs at a
   code identity already green (one identity ran five times on
   2026-09-30 between 00:55Z and 02:47Z, all exit 0, all `fresh`);
   WO-173's covering-row lookup exists (`scripts/lib/gate-reuse.mjs`) and
   did not apply, for a reason the rows do not state (`--again`, a
   wider selection, or an index local to another checkout). WO-174
   records the selections before and after; this order counts the rows.
4. Phase durations are in every event (`elapsed` in canonical status,
   `completedPhaseAttempts` in the meter) and no instrument lists the
   attempts above a phase's median; the 2026-09-28 pass timed them by
   hand (§3, §8).
5. Of the sixteen orders closed between 2026-09-25 and 2026-09-28, two
   were delivery (§11 of that pass); no order header says which track
   it is on, so the split is a hand count each pass.
6. Operator words stand in provenance lines and decision texts beyond
   the dispatch fields WO-172 paraphrased (D008 lists the fields and
   files); no check finds a new one.

**Design (scope discipline):**

- **Denials are journaled.** The generated settings register a
  `PermissionDenied` hook; its handler appends a session-journal row with
  the tool name, a digest and byte count of the tool input, the reason
  text's bracketed rule name, order, role and phase, and prints one
  advisory naming the operator's two routes (the `!` prefix; the
  `/permissions` Recently denied retry). It returns no `retry`.
- **Interventions are journaled.** The UserPromptSubmit handler appends
  a typed row per operator message: route (turn prompt, mid-turn,
  interrupt), time, digest, byte count, class from a recognized prefix
  (`resume:`, `planning:`, `ideation:`, `analysis:`, `operator override:`,
  `scope expand:`, `conversation only:`) or `unclassified`, order, role
  and phase. The class vocabulary is D018's: correction, direction,
  question, ideation, answer, scope expansion, interrupt,
  acknowledgement, override, takeover, other step, positive
  reinforcement, trial and error; a classifier that fills `unclassified`
  rows is a later candidate, not this order. Codex records the same row
  at dispatch for the dispatching message only, and its counts say so.
- **Monitors are named.** The Stop advisory lists background dispatches
  the session started that are still running, by the journal it already
  keeps (WO-141), beside the expected completion event.
- **The publish command is admitted.** The permission facet returns
  `permissionDecision: allow` with a reason naming the lifecycle facts
  when the Bash command equals, byte for byte, the helper release close
  prints (`<execPath> <main>/scripts/release.mjs close WO-NNN --publish`
  or `--dry-run`, with WO-176's `--material` flag admitted after
  `--publish`), the session's recorded dispatch is `release-close` for
  that order, cwd is the main checkout and canonical status lists
  `release-close` among the order's legal next actions. Any other byte,
  order, directory or dispatch keeps today's judgment (defer to the
  host). This is the hook's first admission; the reason string says so.
- **The counts.** `plan failures` gains, each labeled local and counted
  only: `localReleaseCloses` (records under the retained lane with a
  blocker or no published tag; WO-176 writes them, and the count reads
  zero records until it does), `localHostDenials` (journal rows),
  `interventions` (rows by class, order and phase, with the
  `unclassified` count), `longPhases` (completed attempts above twice
  the median of that phase over the record, from the control logs),
  `repeatedGateRuns` (rows at a code identity already holding a green
  row, by order). `plan start` prints the counts and the delivery/machinery
  split of the last eight closed orders from an optional `**Track:**
  delivery|machinery|evidence` header the index reads as `unknown` when
  absent; this order adds the line to no other order.
- **Operator words cite their capture.** `scripts/docs-check.mjs` reports
  a provenance line or decision text under `docs/work-orders/` and
  `docs/evidence/*/decisions.md` that attributes words to the operator
  (a quotation mark after "operator" or a `dispatch` field with quoted
  text) without a `SHA-256` or `--capture-hash` in the same record, as a
  counted advisory with the baseline WO-172 D008 lists; the executor
  paraphrases at most thirty findings by the WO-172 route and records the
  rest as the baseline.
- **Declined alternatives, recorded:** a project `permissions.allow` rule
  (the helper begins with the absolute node path, so the rule is a
  wildcarded interpreter that auto mode suspends, and a rule admits a
  family, WO-066 D012); `autoMode.allow` prose in the operator's user
  settings (outside the repository; the operator may add it; nothing
  here depends on it); recording message text (never; digests and
  classes only); a model classifier in the hook (cost and latency on
  every prompt; a candidate); refusing anything new (this order adds one
  admission and no refusal).

**Deliverables:** the two hook handlers and the registration; the Stop
advisory line; the admission with its fixtures; the five counts and the
split; the `Track:` header reader; the document check; the write-backs.

**Acceptance criteria (all required)**

1. Driven with the hook fixture harness, a `PermissionDenied` event
   appends a journal row with tool, digest, byte count, bracketed rule,
   order, role and phase, and prints one advisory naming both operator
   routes; `npm run harness -- check` is green after regeneration and the
   generated settings register the hook.
2. A UserPromptSubmit fixture with a prefixed message records its class
   and route; an unprefixed message records `unclassified`; no row holds
   message text (the fixture asserts the digest and the absence of the
   text).
3. A Stop fixture with one journaled background dispatch still running
   names it in the advisory; with none running the advisory is unchanged.
4. The permission fixture: the exact publish helper text with the
   lifecycle facts (dispatch recorded as `release-close` for WO-NNN, cwd
   main, `release-close` legal) returns `allow` with the facts in its
   reason; the same text without the recorded dispatch, from a worktree,
   for an order whose legal actions lack `release-close`, with another
   order id, with a trailing argument or with a widened path returns no
   `allow`; every existing refusal fixture passes unchanged.
5. `plan failures` prints the five counts with their labels from
   fixtures that hold one close record with a blocker, one denial row,
   three intervention rows (two classes and one unclassified), one phase
   attempt above twice its median and two gate rows at one identity;
   `plan start` prints the counts and the split, with `unknown` for
   orders lacking `Track:`; the failures export carries the rows.
6. `docs-check` reports one seeded provenance line attributing words to
   the operator without a capture digest and is silent on the D008
   baseline; the executor's paraphrase pass records its count.
7. Write-backs: `docs/AI-HARNESS-SECURITY.md` §Current mode choices, the
   Claude auto-mode row names the admitted command and the denial
   journal, in place within 500 bytes; product 07 §Operator-opened
   planning pass, the sentence on `plan failures`, in place within 300
   bytes; `docs/evidence/WO-178/decisions.md`; the decisions index; the
   register rows the provenance names retargeted at close.
8. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixtures of criteria 1 to 6; `npm test -- --review`
before `implementation-ready`, because `harness-host.ts` is a declared
machinery source; the editions it stales re-minted deterministically; no
live feedback episode. The first release close under Claude Code auto
mode after this order merges is the live observation: its
`release-close.json` (WO-176) and the denial journal say whether the
host honored the admission; the next planning pass reads them.

**Write-back duty:** the two documents, in place; the order's decisions
with sources and reopening conditions; the register rows.

**Non-goals:** recording operator text; classifying `unclassified` rows
with a model; a hook-level allow for any other command; Codex or Copilot
admission (the host permission mode decides there and no classifier
runs); the close record itself (WO-176); changing the gate's reuse
(WO-174 explains the repeats); adding `Track:` to existing orders (the
next planning pass, in its own subject revision); the sweep of every
operator-worded record (bounded to thirty here; FUP-71fc2efc208f597a
keeps the rest).

**Operator-review assumptions**

1. The lifecycle facts are sufficient authorization for the hook to
   admit the exact publish command without a host prompt: the order is
   closed with a passing final review, the operator's phrase dispatched
   release-close, and the helper validates every prerequisite before its
   first remote call.
2. Whether the host honors a hook `allow` in auto mode is what its
   documentation says on 2026-09-30; the first live close is the check,
   and a denial recorded there reopens the route.
3. A journal of digests and classes, never text, is inside the clean-room
   floor; the operator's words stay in the host transcript and in
   planning captures.
