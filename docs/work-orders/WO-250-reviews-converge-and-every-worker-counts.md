# WO-250 — Reviews converge and every worker counts: the three independent reviews run once over the diff, recheck only what they found, end in one combined recheck and then in the executor's own judgment; a review worker on Codex or Claude launches from any host through one kit command with a canonical brief and a report the verifier can read; every worker launch and re-task on every path counts against the subagent cap; and no review worker starts a gate (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** minor. One new command, one new refusal class,
one counter that counts more than it did, and the executor's review rule
rewritten as a ladder with an end; an order that ran its reviews as today
is still admitted. Assigned at activation under the standing opt-out
default.
**Cost:** adds `scripts/worker.mjs` (new command, `npm run worker -- review
--kind criteria|design|consistency|combined --host codex|claude [--order
WO-NNN | --subject planning] [--since <tree>] [--round N] [--recheck
<report>] [--dry-run]`) and
`scripts/lib/review-worker.mjs` (new): the brief rendered from the three
reviewer definitions in `packages/skeleton/src/loadouts/contributor.ts`
(172 to 174), the order's text, `git diff --stat` against `--since` (the
merge base with `main` for round 1; the last reviewed tree for a recheck),
the probe rule every review worker reads (single tests under `node
scripts/harness.mjs bounded --`, never a gate) and, for a recheck, the
prior report's findings to confirm or refute; the launch through the
transport the entropy review already has (`scripts/lib/entropy-review.mjs`
`TRANSPORT_DEFAULTS` 647 to 660 and the transport selection 1181 to 1183;
`codexExecArgv`, `packages/skeleton/src/worker-transport.ts` 368, with the
isolated Codex home, read-only sandbox and the pin gpt-6.1-sol at `max`;
the `claude-cli-print` form at claude-opus-5-5 `xhigh`), the launch shared
with the entropy review through one module rather than copied; for a planning subject (`--subject planning`, on a `planning/` branch with
no order) the brief rendered from the branch's planning document and
changed orders and the lane `docs/control/local/reviews/planning-<date>/`;
the report written to the order's ignored reviews lane,
`docs/control/local/reviews/WO-NNN/round-<N>-<kind>.md`
with a `.json` beside it in a closed findings shape (`id`, `severity`
`blocking|should-fix|note`, `summary`, `file`, `line`, `criterion`), and
one line printed, `review: <kind> round <N> found <N> (<B> blocking);
<elapsed>`, or that the worker returned no report; a `WorkerLaunched` row
in the session journal (session, order, kind, host, CLI version, round,
started, ended, tokens where the host reports them); the helper's Codex
argv keeping `code_mode_host`, `shell_tool` and `unified_exec` enabled as
the entropy review's form does (the filter at 903 and 1002), where the
default worker argv (805 to 810) disables all of `codexDisabled`, and its
Claude print argv passing the read tools (`Read`, `Grep`, `Glob` and a
read-only `Bash`) where the default worker passes `--tools ""` (743 to
744), since a reviewer over files must read them, with `--dry-run` printing
the argv it would launch; a fake transport for the fixture as the entropy
review's; in `packages/skeleton/src/subagent-budget.ts`
(`admitSubagentTool`, 247 to 346) the counter counting uses: a launch
(today's direct and workflow admissions), a re-task (a `SendMessage` or an
`Agent` call with `resume` to a known agent, which today is admitted
uncounted at 318 to 333) and a kit-launched worker (in a hooked Claude session the hook counts the
`npm run worker -- review` Bash command itself as a launch, since the
helper's child process has no session identity to charge; under Codex,
where `CODEX_THREAD_ID` names the session and no hook fires, the helper
calls the same admission before launching; both refuse past the cap with
the same message), with `harness usage` printing `workers:
launched N (claude A, codex B), re-tasked M, cap C, remaining R` and the
countKind as today; in `packages/skeleton/src/harness-command.ts`
(`harnessToolEffects`, 10 to 55) `SendMessage` classed as a re-task that
the admission counts; in `packages/skeleton/src/harness-host.ts` (the
command judgment, where WO-247-D012 left it) a new floor refusal,
`DOTLN_WORKER_GATE_REFUSED`: a session carrying an `agent_id` (a subagent of
this session) that runs `npm test` in any form, `node scripts/test-runner.mjs`,
`node scripts/target-gate.mjs`, `npm run test:docs` or `npm run test:full`
is refused naming the bounded single-test form; the helper's brief carries
the same rule for a Codex worker, whose calls are unhooked; in
`scripts/lib/worktree-removal.mjs` (`retainWorktreeJournals`, 85 to 131,
which today reads one source, the harness directory
`dispatchJournalDirectory`, through the `closedJournalEntry` name filter of
`packages/skeleton/src/temporary-root-records.mjs` 113 to 119) a second
source, the order's reviews lane, moved into the same retained lane under
`reviews/`, with the closed-journal class's declared entries extended, so
the reports outlive the worktree; in
`scripts/lib/handoff-ledger.mjs` (the `self-review:` line, 21 and 259) the
line's optional trailing fields `rounds <R>; unreviewed <M> lines
(<reason>)`, advisory as the line is; in
`packages/skeleton/src/loadouts/contributor.ts` the executor's review
paragraphs (172 to 174) and the complete-run sentence (682) rewritten as
the ladder in §Design, the launch sentence (83) naming
the helper as the route to a Codex review worker from a Claude session and
the counting rule, and the fan-out sentence (662) counting re-tasks and
kit launches (WO-244, which lands after this order, writes the planner's
`plan review` as the helper's caller); the generated
refusals sentence (`packages/compiler/src/harness.ts` 1339) gaining this
refusal's row, its count following the list WO-251 makes it; product 07 §Discipline (2797 to 2840), §Preflight before the
full gate (3990 to 4000) and the kit guide stated as built; cases in
`scripts/test-harness.mjs` (the `harness-fixtures` suite's file, with
`scripts/test-drive.mjs`: the refusal; a re-task counted; a kit launch
counted and refused past the cap; the roots), `scripts/test-plan-refutation.mjs` (the helper over a fixture
order with the fake transport: three reports named by round and kind, the
printed counts, a recheck reading its prior report, a missing report
reported) and `scripts/test-release.sh` (the reviews lane retained at
close). Removes: the rule "after any new set of code changes, restart all
three existing reviewers" with no end (WO-237 ran four rounds, 19, 13, 4
and 12 distinct findings, and a fifth from one reviewer, before the
operator stopped it); the ad hoc launcher every session writes when the
operator asks for Codex reviewers from a Claude session (WO-237-D011: "no
kit command launches a Codex dotln-worker from a Claude session"; the fork's
2026-11-01 pass and the 2026-10-31 planning pass each wrote their own);
reviewer launches that the cap never saw (the 2026-10-31 pass counted its
three `codex exec` workers "not against the cap"; a resumed agent is
admitted uncounted, `subagent-budget.ts` 301 to 308); review workers that run gates and hold the live-gate
refusal against the executor for minutes (WO-247-D012: 142, 20 and 438
seconds); and review reports that vanish before verification
(WO-237-D014: the originals were in a session scratch that no longer
existed). Wall-clock: a review round is the same worker time as today; the
ladder removes rounds; the refusal and the counting are one match and one
counter write per judged call, measured before and after. Context bytes:
this file, about 24,000; the executor root grows by the ladder and shrinks
by the restart sentences, measured against its ceiling under the standing
route. Commands: `npm run worker -- review`, new. Tokens: unknown until
run. Steps: 11. Re-mints: `harness-host.ts`, `harness-command.ts`,
`subagent-budget.ts`, `worker-transport.ts`, `temporary-root-records.mjs`
and `contributor.ts` are
runtime sources the executor checks against `scripts/lib/evidence-sources.mjs`
at activation and re-mints deterministically where an edition is staled;
no feedback-judged source changes, so no live feedback episode;
`harness-host.ts`, `contributor.ts` and `scripts/release.mjs` are declared
machinery sources, so `npm test -- --review` runs before handoff.
**Nomination provenance:** the operator's items 6, 6.a and 6.b of the
2026-11-01 planning dispatch (ignored capture
`docs/intake/notes/planning-fork-blocks-close-residue-reviews-criteria-and-desktop-opt-in-2026-11-01.md`,
SHA-256 `65b3db5f78aa7bdba95e94ce62e12015afbc144e058b5699767040e37b22d0a2`):
why core and the instance write ad hoc code when a Claude executor is asked
to run reviewers on Codex, and whether that is not just a Codex
dotln-worker; who keeps pushing reviewer reuse; an epsilon after which the
remaining changes need no new reviewers, or one reviewer with all three
briefs and then none, because "any code change needs all three reviewers"
produces an endless loop and the main thread should know when its changes
are good enough; and why each reviewer use does not count against the
twenty-subagent cap. WO-237-D011 (FUP-a62cdc9ff882ac1a: a kit route for a
read-only Codex review from a Claude session), WO-247-D012
(FUP-19017ddcdf6cadb8: a hook refusal of a gate launched by a review
worker) and WO-237-D014 (FUP-a121c8dcc77a6dfd: the review reports readable
into verification). The fork's item 6 of 2026-11-01 as evidence: three
`codex exec` reviewers over 25 orders from a session-scratch launcher, and
Codex CLI 0.166.0 refusing tool calls under a disabled-feature list. Filed
by the [2026-11-01 pass](../planning/fork-blocks-close-residue-reviews-criteria-desktop-opt-in-2026-11-01.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-233 (closed: the three independent reviews on every
execution and fix, the rule this order gives an end); WO-139 (closed: the
subagent counter and its admission points); WO-192 (closed, v0.104.0: the
per-spawner admission and the driven ceiling the counter serves); WO-151
(closed: the entropy review's transports this order shares); WO-247
(closed, v0.106.0: the probe sentence every review worker reads and the
refusal it left to planning); WO-237 (closed, v0.107.0: the retained lane
the reviews lane joins).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-233",
    "relation": "satisfied-by-close",
    "reason": "the three independent reviews on every execution and fix, whose rule this order bounds"
  },
  {
    "workOrderId": "WO-139",
    "relation": "satisfied-by-close",
    "reason": "the subagent counter, cap and admission this order extends to re-tasks and kit launches"
  },
  {
    "workOrderId": "WO-192",
    "relation": "satisfied-by-close",
    "reason": "the per-spawner admission and driven ceiling the counter serves"
  },
  {
    "workOrderId": "WO-151",
    "relation": "satisfied-by-close",
    "reason": "the claude-cli-print and codex-cli-exec transports the helper launches through"
  },
  {
    "workOrderId": "WO-247",
    "relation": "satisfied-by-close",
    "reason": "the probe sentence in the worker definition and the gate refusal it left to planning"
  },
  {
    "workOrderId": "WO-237",
    "relation": "satisfied-by-close",
    "reason": "main's retained lane for a closed order, which the reviews lane joins"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/skeleton/src/loadouts/contributor.ts`
(83 the launch sentence with the probe rule; 172 to 174 the three
reviewers and the restart sentence; 662 the fan-out sentence; 682 the
complete-run sentence); `packages/skeleton/src/subagent-budget.ts`
(`SpawnInput` 16 to 23; `readSubagentCap` 55; `admitSubagentTool` 247 to
346, the resumed-agent branch 301 to 308; `subagentUsage` 223);
`packages/skeleton/src/harness-command.ts` (`harnessToolEffects` 10 to 55);
`packages/skeleton/src/harness-host.ts` (the spawn admission 6369 to 6453:
`admitSubagentTool` at 6443, the live-gate advisory on spawn at 6450);
`packages/skeleton/src/worker-transport.ts` (`codexDisabled` 314 to 337 and
its filter at 903 and 1002, which leaves `shell_tool`, `unified_exec` and
`code_mode_host` enabled; `codexExecArgv` 368; the default worker argv 735 to 750 and 798 to 815,
which passes `--tools ""` to Claude and every `codexDisabled` feature to
Codex; `OBSERVED_CLI_VERSIONS` 658 to 661, codex 0.154.0, against 0.166.0
observed on the operator's host on 2026-11-01); `scripts/lib/entropy-review.mjs` (`TRANSPORT_DEFAULTS` 647 to
660; the transport selection 1181 to 1183); `scripts/lib/handoff-ledger.mjs`
(21, 259); `scripts/lib/worktree-removal.mjs` (`retainWorktreeJournals` and
`closedJournalEntry`, 85 to 130); `packages/compiler/src/harness.ts` 1339 (`HARNESS_BOUNDARIES`, a
hand-written sentence that counts six); product 07 §Verification review
and attack (the reviewers paragraph, 2797 to 2840) and §Discipline's
§Preflight before the full gate (3990 to 4000); `docs/evidence/WO-237/decisions.md#wo-237-d011`,
`#wo-237-d014`; `docs/evidence/WO-247/decisions.md#wo-247-d012`; the map's
candidate "total subagent cap across every spawn path".

**Objective:** The three independent reviews make an order faster by
finding defects before the gate, and they end: one round over the diff, one
recheck of what was fixed, one combined last look, then the executor's own
judgment recorded in the handoff. A reviewer on either host launches with
one kit command and a canonical brief, writes a report the verifier reads,
and counts against the cap like every other worker. A review worker never
starts a gate.

**Observed gap (dated 2026-11-01 at `main` `64286ff8`, v0.107.0):**

- The executor's text says "after any new set of code changes, restart all
  three existing reviewers on the current diff and finish their rechecks
  before the next complete run" (contributor.ts 174; product 07
  §Verification review and attack, 2829 to 2831) and gives no end. WO-237 ran four recheck rounds (19, 13, 4 and 12
  distinct findings) and a fifth from one reviewer, with the operator
  writing at 17:04Z to stop and run the gates (D011); its executor also
  asked the operator whether to lift a token-spend criterion the fork's
  order carried (the operator's item 6.b).
- No kit command launches a Codex review worker from a Claude session
  (WO-237-D011's evidence: the role text names Claude `dotln-worker` or
  Codex `spawn_agent` inside a Codex session; `drive-worker.mjs` launches
  whole phases). The 2026-10-31 planning pass, WO-237's executor and the
  fork's 2026-11-01 pass each wrote a `codex exec` launcher of their own in
  an ignored lane; the entropy review has had the transport since WO-151.
- The subagent counter counts direct `Agent` and `Workflow` admissions and
  children at their first attributable call (WO-139, WO-192); a resumed
  agent is admitted uncounted (`subagent-budget.ts` 301 to 308), `SendMessage`
  is not in the tool inventory, and a `codex exec` worker launched from
  `Bash` is a shell command the counter never sees; the counter is keyed by
  the hook's `session_id`, which a child process the session launches does
  not carry. The 2026-10-31 pass
  recorded its three reviewers as "not against the cap".
- WO-247's consistency reviewer ran `npm test -- --only resume`, `compiler`
  and `skeleton` (142, 20 and 438 seconds), each holding the live-gate
  refusal against the executor's writes (D012); the worker definition and
  the launch sentence now carry the probe rule as text, and D012 left the
  hook refusal to planning as a floor change.
- WO-237's verifier could not read the original three reports: the
  executor's scratch directory was gone and `reviews.md` held the
  dispositions alone (D014).
- The planner's text says "reuse agents before spawning more" (662) and the
  executor's "reuse the same workers within the execution or repair" (174);
  the operator asks who pushes reuse and what it buys.

**Design (scope discipline):**

- **A ladder with an end.** Round 1: after implementation and its
  write-backs, three reviewers over the whole diff against the merge base,
  as today. The executor fixes or records each finding. Round 2, the
  recheck: each reviewer whose findings were fixed rechecks those fixes on
  the current diff and nothing else; a new finding is admitted only when it
  breaks an acceptance criterion or a behavior `main` had (the verifier's
  own standard), and any other new finding is recorded in the handoff, not
  fixed. Round 3, the last: when round 2's fixes changed code again, one
  combined worker carrying the three briefs reads the delta since round 2's
  reviewed tree under the same admission rule. After round 3 no reviewer
  runs in this execution or repair: the executor judges the remaining
  delta and the handoff's `self-review:` line records the rounds and the
  unreviewed lines with the reason. A round is skipped, and the line says
  so, when the fixes before it touch only comments, documentation,
  formatting, test names or regenerated files. A repair after a failed
  complete run takes the same ladder over the repair's diff; a repair diff
  under fifty changed source lines starts at round 3. Rejected: no reviews
  (axis: the rounds found 19, 13 and 4 distinct defects on WO-237 before
  the gate; the loop, not the review, is the defect). Rejected: a cap on
  rounds alone without the admission rule (axis: a recheck that opens new
  fronts never converges whatever the count; the rule is what ends it).
- **Reuse is for rechecks and is counted.** A recheck resumes the same
  worker where the host keeps it (Claude's `SendMessage`), because it holds
  the diff and its findings and the recheck is a confirmation, not a new
  search; where the host cannot, a fresh worker reads the prior report.
  Either way the re-task counts one against the cap. The tradeoff is
  recorded: reuse saves the re-read and keeps the findings consistent;
  anchoring is accepted because the recheck's question is whether the fix
  holds. Rejected: fresh workers for every recheck (axis: three re-reads of
  the diff per round for a question the first reader can answer).
- **One kit command, two hosts, one brief.** `npm run worker -- review`
  renders the canonical brief from the role text so no session writes its
  own, launches through the entropy review's transport, writes the report
  where the verifier and the close can find it, and counts the launch. In a
  Claude session the `Agent` tool with `dotln-worker` stays the ordinary
  route and is counted by the hook; the helper is the route to a Codex
  worker from Claude, to a Claude print worker from Codex, and for a
  planning subject through `--subject planning` (WO-244's `plan review`,
  which lands after this order, is that caller). The helper's argv keeps
  the Codex worker's tools enabled and gives the Claude print worker its
  read tools, since a reviewer over files reads them and the default worker
  argv, built for an inlined subject, gives neither. Rejected: a Codex
  `spawn_agent` from Claude (axis: it is Codex's own primitive).
  Rejected: a new transport (axis: the entropy review's two are the pin).
- **Every use counts, on every path.** Launches, re-tasks and kit launches
  are uses; the cap compares uses. In a Claude session the hook counts the
  helper's Bash command as the launch, because the helper's child process
  has no session identity to charge; under Codex, unhooked, the helper is
  the counter and the role text keeps the explicit count, as today. Rejected: counting kit launches separately from the cap (axis:
  the operator's item 6.b; a cap that one path escapes is a suggestion).
- **A review worker never starts a gate.** The hook refuses the gate forms
  from a subagent by literal command (a program's own effects stay
  unobserved, as every hook refusal); the brief carries the rule for a
  Codex worker. A new refusal of the floor, which planning records here;
  the generated sentence counts it from its list, one more than at
  activation.
  Rejected: leaving it to the brief alone (axis: WO-247-D012's operator
  direction: every session, not one brief).
- **Reports live with the order.** The reviews lane in the worktree,
  retained into main's lane at close; an `Agent`-tool worker's returned
  text is written there by the executor under the same name, so the
  verifier reads every round whatever the launch route. Rejected: committed
  evidence (axis: the reports are the executor's working record; the
  consolidated `reviews.md` and the handoff line are the committed account).
- **Live-run surfaces at the base.** The counter, the transports, the
  retained lane, the handoff line, the worker definition's probe sentence:
  exist. The helper, the re-task class, the refusal, the lane entry, the
  ladder text: absent.

**Execution plan (the executor follows these steps in order; observed at `64286ff8`, 2026-11-01):**

1. `scripts/lib/entropy-review.mjs`: extract the transport launch
   (`claude-cli-print` and `codex-cli-exec` argv, isolated home, elapsed
   and version readback, the fake) into a shared module the entropy review
   and the helper import, with the entropy review's own cases unchanged.
   Check: `npm test -- --only plan-refutation`.
2. `scripts/lib/review-worker.mjs` (new) and `scripts/worker.mjs` (new):
   the brief rendered from `contributor.ts` 172 to 174 and the order, or
   from the planning document and changed orders under `--subject planning`;
   the `--since`, `--round`, `--recheck` and `--dry-run` inputs; the Codex
   argv with the three features enabled and the Claude argv with the read
   tools; the report and its `.json` in the reviews lane (the order's, or
   `planning-<date>/`); the printed line; the `WorkerLaunched` journal row;
   under Codex the admission through the subagent counter before launch. Check: `npm
   test -- --only plan-refutation`.
3. `packages/skeleton/src/subagent-budget.ts`: uses (launches, re-tasks,
   kit launches) with the cap compared to uses; `subagentUsage` and
   `subagentSummary` report launches by host, re-tasks and the remainder;
   `packages/skeleton/src/harness-command.ts`: `SendMessage` as a re-task;
   `packages/skeleton/src/harness-host.ts`: the re-task admission beside the
   spawn admission (6443) and the `npm run worker -- review` Bash command
   admitted and counted as a launch by literal command. Check: `npm test --
   --only harness-fixtures`.
4. `packages/skeleton/src/harness-host.ts`: `DOTLN_WORKER_GATE_REFUSED` for
   a session with `agent_id` running a gate form; `packages/compiler/src/harness.ts`
   (1339): this refusal's row in the list the sentence is rendered from; the
   refusal's measured cost recorded. Check: `npm test -- --only harness-fixtures`; `npm test --
   --only harness`.
5. `scripts/lib/worktree-removal.mjs` (`retainWorktreeJournals`) and
   `packages/skeleton/src/temporary-root-records.mjs` (the closed-journal
   class's declared entries, 113 to 119): the order's reviews lane as a
   second source moved into main's retained lane under `reviews/` at close. Check: `bash
   scripts/test-release.sh --case success` under the bounded wrapper; `npm
   test -- --only release`.
6. `scripts/lib/handoff-ledger.mjs` (21, 259): the optional trailing fields
   of the `self-review:` line. Check: `npm test -- --only process-debt`.
7. `packages/skeleton/src/loadouts/contributor.ts`: the ladder in place of
   172 to 174 and 682's restart sentence, the launch sentence (83) naming
   the helper and the counting rule, the fan-out sentence (662) counting
   re-tasks and kit launches; `npm run sync`; each root measured against its ceiling under the
   standing route. Check: `npm test -- --only harness`; `npm test -- --only
   harness-context`.
8. `scripts/test-plan-refutation.mjs` and `scripts/test-harness.mjs`: the
   cases the Cost names. Check: the same suites.
9. Write-backs: product 07 §Verification review and attack (the reviewers
   paragraph, 2797 to 2840: the ladder, the reuse tradeoff, the counting),
   §Discipline's §Preflight before the full gate (3990 to 4000: a repair's
   ladder) and the refusals paragraph (this refusal's row); the kit
   guide (`docs/KIT.md` once WO-245 merges, otherwise
   `scripts/kit/README.client.md`) §What runs here, and what does not (the
   command, the refusal, the counting); `docs/evidence/WO-250/decisions.md`
   (the refusal's and the counter's measured cost; each root's bytes; the
   Codex CLI version observed and `OBSERVED_CLI_VERSIONS` updated to it);
   re-mint any edition the runtime sources stale; `npm run meta`; `node
   scripts/lineage.mjs index --check`; `npm run publication:check`.
10. Run this order's own reviews by the ladder, at least one kind through
    the helper (on Codex where the CLI is installed and admitted, otherwise
    on Claude through the helper, recording which), and record each round's
    counts and the `harness usage` line in the decisions as the first
    observation of the rule.
11. Handoff: integrate `main` first when it has moved (WO-233's rule);
    finish source edits; `npm run format` and `npm run sync`; one `npm test
    -- --review` in the background awaited with `node scripts/harness.mjs
    evidence --wait`; `docs/evidence/WO-250/handoff.md` with the
    `self-review:` line in its new shape; `npm run test:docs` once after the
    last document edit; `npm run resume -- implementation-ready <flags>`
    (product 07 §Discipline).

**Deliverables:** the shared transport module; the helper and its reports;
the counter's uses and the re-task class; the gate refusal; the retained
reviews lane; the handoff line's fields; the ladder in the role text; the
write-backs.

**Acceptance criteria (all required)**

1. `npm run worker -- review --kind criteria --host codex` on a fixture
   order with the fake transport writes
   `docs/control/local/reviews/WO-NNN/round-1-criteria.md` and its `.json`,
   prints `review: criteria round 1 found N (B blocking); <elapsed>`,
   appends a `WorkerLaunched` journal row and counts one use; `--kind
   combined --round 3 --recheck <report>` renders the three briefs and the
   prior findings into one brief; `--subject planning` on a planning-branch
   fixture writes `docs/control/local/reviews/planning-<date>/round-1-criteria.md`
   from the branch's planning document and changed orders; a worker that
   returns no report is reported as such; under the fixture's Codex session
   identity a launch past the cap is refused with the cap's message before
   any process starts; `--dry-run` prints a Codex argv with no `--disable`
   for `code_mode_host`, `shell_tool` or `unified_exec` and a Claude argv
   naming `Read`, `Grep`, `Glob` and `Bash`; one real launch of each form on
   the executing host returns a report that cites a file it read, recorded
   in the decisions, or the host's refusal or absence is recorded.
2. In the harness fixture, a `SendMessage` to a known agent, an `Agent`
   call resuming one and a Bash command `npm run worker -- review …` each
   count one use; `harness usage` prints launches by host, re-tasks and the
   remainder; the twenty-first use is refused.
3. In the harness fixture, a PreToolUse input carrying an `agent_id` whose
   command is `npm test`, `npm test -- --only resume`, `node
   scripts/test-runner.mjs --review`, `node scripts/target-gate.mjs` or
   `npm run test:docs` is refused with `DOTLN_WORKER_GATE_REFUSED` naming
   the bounded single-test form; the same commands without an `agent_id`
   are judged as today; `node scripts/harness.mjs bounded -- node --test
   --test-name-pattern x scripts/test-x.mjs` from the subagent is admitted.
4. The release fixture's close moves `docs/control/local/reviews/WO-NNN/`
   into main's retained lane for the order beside the journals.
5. A handoff line `self-review: found 19; fixed 18; recorded 1; rounds 3;
   unreviewed 12 lines (comments and a test name)` passes the handoff
   check; the line without the trailing fields passes as today; a malformed
   trailing field (`rounds x; garbage`) prints the advisory, which the
   current regex (`handoff-ledger.mjs` 21, no end anchor) does not.
6. The emitted executor root carries the ladder, the admission rule, the
   skip rule, the fifty-line repair rule, the counting rule and the helper
   as the Codex route, and no longer the sentence restarting all three
   reviewers after any change; the generated refusals sentence names the
   worker gate refusal and counts one more than it did at activation;
   `harness check` passes.
7. Product 07 and the kit guide state the ladder, the command, the counting
   and the refusal as built; `npm run publication:check` is green.
8. This order's decisions record its own rounds under the ladder, with at
   least one round launched through the helper (on Codex where the Codex
   CLI is installed and admitted on the executing host; otherwise on Claude
   through the helper's `claude-cli-print` form, with the host's refusal or
   absence recorded), and the `harness usage` line after the last round.
9. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only plan-refutation` for steps 1, 2 and 8;
`npm test -- --only harness-fixtures` for steps 3, 4 and 8; `npm test --
--only harness` and `npm test -- --only harness-context` for steps 4, 7 and
8; `npm test -- --only release` for step 5; `npm test -- --only
process-debt` for step 6; `npm run test:docs` when a document changes; each
under `node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the fixtures of criteria 1 to 5; the deterministic
re-mints of any edition the runtime sources stale; `npm test -- --review`
before `implementation-ready`, final review reusing the passing complete row
at the integrated code identity when one exists.

**Write-back duty:** as listed in step 9 and criterion 7.

**Known issues and carry-ins:**

- WO-237-D011 (FUP-a62cdc9ff882ac1a), WO-247-D012 (FUP-19017ddcdf6cadb8)
  and WO-237-D014 (FUP-a121c8dcc77a6dfd) are taken in steps 2, 4 and 5
  (reopen: each on its own condition).
- The fork's item 6 of 2026-11-01: under a disabled-feature list written
  against Codex CLI 0.154.0, Codex CLI 0.166.0 answered every tool call
  with "code-mode host is disabled". The kit's default worker argv (805 to
  810) disables every `codexDisabled` feature, the three among them, and
  only the entropy review's form keeps them (903 and 1002), which is the
  shape the fork's launcher most likely inherited; the helper takes the
  entropy form, and the executor confirms on 0.166.0 and records the
  disabled list it passes (reopen: a helper-launched Codex worker reads
  nothing).
- The fifty-line threshold for a repair is the planner's figure, not a
  measurement; the executor records the repair diffs this order and the
  next two meet, and a pass re-reads it (reopen: two repairs under fifty
  lines each needed round 1 to find a blocking defect).
- The `Agent`-tool route in a Claude session writes no report file; the
  executor writes the worker's returned text into the lane under the round
  and kind name (reopen: a verification finds a round's report missing
  from the lane).
- The map's candidate "total subagent cap across every spawn path" asks
  for admission before creation on every path; this order counts the paths
  the kit launches or the hook sees and leaves the guarantee for agents a
  host creates before any hook fires where WO-139 left it (reopen: a
  session exceeds the cap on a path this order does not count).

**Non-goals:** removing the independent reviews; a fourth reviewer kind;
changing the refuter; a new transport or pin; counting the operator's own
sessions; a Codex hook.

**Operator-review assumptions:** that one recheck plus one combined last
look is the right ladder and the executor's judgment after it is wanted;
that reuse for rechecks is kept with its tradeoff recorded, since the
operator did not push against it; that a repair under fifty changed source
lines starting at the combined round is the epsilon the operator described.
Reopen on the operator's word.
