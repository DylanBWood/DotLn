# WO-254 — The hooks get out of the operator's way: a zombie is not a live writer, the recovery commands a refusal names are admitted from the refused session, a dispatch that stops releases its writer and a denied activation leaves no worktree, a question is answered and a remark is not a rule, the operator's standing instructions survive a Codex compaction, the three shell-classification advisories go quiet, and a session blocked on the operator says so once and ends its turn (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. The writer guard's liveness judgment,
two admitted command forms, a release at a stopped dispatch, a message
class and a planning block, a compaction record field and three advisories
silenced; no refusal is removed and no permission widened. Assigned at
activation under the standing opt-out default.
**Cost:** adds, in `packages/skeleton/src/harness-host.ts`
(`harnessProcessAlive`, after 2647: signal-zero existence then a start-time
comparison) and `scripts/lib/off-ramps.mjs` (`processAlive`, 142 to 148:
`process.kill(pid, 0)`), a zombie judgment: a process whose table state is
`Z` (macOS and Linux `ps -o stat=`) is dead, so its reservation is stale
and `writer --release` needs no `--force`; in the writer-isolation refusal
(`harness-host.ts` 1305 to 1327 and the message at 3381) the admission of
the two commands the message names, `node scripts/harness.mjs writer
--show` from any session and `node scripts/harness.mjs writer --release`
from a session whose dispatch was refused when the holder is dead or a
zombie, judged by exact argv through the existing classifier, while
`--force` against a live holder stays the operator's action as today (`scripts/harness.mjs` 242 to 247 already
calls `--show` a bounded metadata read and `--release` an operator action);
in the Codex lifecycle dispatch (the `codex-host` owner of
`codexHostProcess`, 2627 to 2645) the writer released when the dispatched
role's command exits without its completion event, with the stop recorded
in the session journal (WO-241's release close of 2026-11-03 stopped on a
prune blocker at 22:43Z and its Codex TUI held the writer as `alive: true`
until the operator killed the defunct process at 23:17Z); in the activation
route (`npm run resume -- next` and `worktree start`) no worktree created
before the host admits the dispatch, and a worktree the host then denies
removed by the same command with the denial recorded (the operator's
`../DotLn-wo242` of 2026-11-03: a denied activation, a worktree left
behind); in the prompt hook's message classification (`operatorPrefixes`,
`harness-host.ts` 1414 to 1421: a class by prefix only) a `question` class
for an unprefixed message that ends in a question mark (an interrogative
opening alone does not class it, since "Do not run the final gate until I
approve." opens with one: the criteria adversary's F4 of 2026-11-04),
carried on `OperatorMessageObserved` (1584) and injected as advisory
context: "Operator question: read it as a smell. Your next message answers
it one of two ways, with the evidence: why the current course is right, or
what the question changes in your reading and what you will now do
differently. Keep working either way; if the message also asks for an
action, including to pause, stop or wait, do that, since a request is
explicit whatever its grammar; it records no rule" (the operator's
clarification of 2026-11-04, ignored capture SHA-256 `3f7ba4606f22f33601570f964d50d3aff6c3413294f2adea844c524f73b65e6c`: a confident
colleague explains why the work is right, an unconfident one takes the
smell as evidence, and neither stops on their own); in `scripts/lib/planning-document.mjs` and `plan check`
a `Rules recorded` block in the pass document naming every standing rule
the pass writes into a standing document from the operator's words, each
with the message's journal reference (the session key and the row's
`recordedAt`), the class `plan check` reads from that row, its capture
digest and the sentence, so a rule whose referenced row the journal classes
as a `question`, or that names no row, is refused by `plan check` whatever
label the planner wrote (the criteria adversary's F6: a label alone can be
misapplied), and the operator reads every new rule in one place, and in the
instance operator-record template the kit ships the sentence that a
standing rule is recorded only from the operator's direction with its
capture digest (moved here from WO-257 on the design improver's F5 of
2026-11-04); in
`packages/compiler/src/codex-continuation.mjs` (the `SessionStart` compact
context at 194) the operator's standing instructions of the session restored with the
task: the Codex prompt hook that writes `OperatorMessageObserved` today
(the session journal of 2026-11-03 shows those rows for a Codex session,
with a digest and byte count and no text) also keeps the message's text,
bounded as the override capture is (64 KiB), in the ignored session
journal for every operator message since the dispatch with its class, and
the compact `SessionStart` reads them back, so an unprefixed instruction
such as "pause before the final gate" typed into a Codex session is
captured and restored (the criteria adversary's F5 named the missing
capture source), and a probe that
records each post-compaction first assistant message against the saved
task; in `packages/skeleton/src/harness-command.ts` (155, 205, 2623, 2895)
the three advisories `Shell control syntax requires an explicit effect
adapter`, `Dynamic shell substitution requires an explicit effect adapter`
and `Shell working-directory override needs a separately reviewed host
adapter` written to the session journal only, never to the agent's context,
when host permissions decide (513, 434 and 336 rows in fourteen days of
this checkout's journals, on nearly every `cd … && …` or `$(…)` call); and
in `packages/skeleton/src/loadouts/contributor.ts` one common sentence: a
session blocked on an action only the operator can take states the block
and the one line that clears it in a single message and ends its turn,
because the host holds a `!` command the operator types until the turn
ends (the host's interactive-mode page, read 2026-11-03: "Commands and
shell commands: Claude Code holds them until the turn ends"). Removes: a
planning pass refused every shell call for 0 h 4 min (23:12 to 23:17Z,
2026-11-03) by a reservation whose holder was `<defunct>`, with the
refusal naming two commands it then refused; an operator typing the
release by hand; a `!` command queued 0 h 10 min behind an agent's turn
(the operator's item 24); three advisories that hide the real ones (item
14); a question read as direction (item 10) and a passing remark recorded
as a standing rule (item 11; the fork's "standing rule" that takes a newer
starter before every pass, items 12 and 13); a Codex session that answers
an old message after compaction and forgets "pause before the final gate"
(item 7). Wall-clock: the zombie judgment reads a column the table already
carries; the admissions are two argv comparisons; the release is one
teardown the dispatch already owns; the class is a regular expression on
the first content line; the block is written by the pass; the compaction
field is a journal read; the advisories cost less, not more. Context
bytes: this file, about 20,000; every role root grows by the one common
sentence, measured against its ceiling under the standing route; the
agent's context shrinks by three advisories per shell call. Commands: none
new. Tokens: unknown until run. Steps: 10. Re-mints: `harness-host.ts`,
`harness-command.ts` and `contributor.ts` are runtime sources the executor
checks against `scripts/lib/evidence-sources.mjs` at activation; the hooks
are feedback-judged sources (`FEEDBACK_SOURCE_PATHS`), so this order names
the feedback re-mint and one live feedback self-host episode in its
dispatch dimensions (WO-147 D010); `scripts/refute-plan.mjs` and
`scripts/resume.mjs` are declared machinery sources, so `npm test --
--review` runs before handoff.
**Nomination provenance:** the operator's items 7, 10, 11, 12, 13, 14, 23
and 24 of the 2026-11-03 planning dispatch and its mid-turn messages ("THERE
IS NO OTHER PROCESS"; "ADD THAT AS ISSUE 23"; "WHY AM I HAVING TO MANUALLY
INTERVENE TO TELL YOU TO RELEASE A NON EXISTENT LOCK"; "IF YOU WOULD SHUT
THE FUCK UP THE COMMAND WOULD RUN"; "i got a deny on wo-242 when trying to
create it so i dont know how its worktree has been created"), captured in
ignored intake `docs/intake/planning-dispatch-2026-11-03-recurring-failures.md`,
SHA-256 `4c7e47a6548004d909128fdfcc346663fc419280b798d00abec73d7ffb180f83`.
Filed by the
[2026-11-03 pass](../planning/passes/recurring-failures-and-queue-drain-2026-11-03.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-251 (closed: the emitted settings and the hook's
refusal table this order adds admissions to); WO-249 (closed: the
operator's-words rule for waivers this order extends to rules).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-251",
    "relation": "satisfied-by-close",
    "reason": "the hook refusal table and emitted settings this order adds the two admitted recovery commands to"
  },
  {
    "workOrderId": "WO-249",
    "relation": "satisfied-by-close",
    "reason": "the rule that an off-ramp is recorded only from the operator's words asking for it, which this order extends to standing rules"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/skeleton/src/harness-host.ts`
(`operatorPrefixes` 1414 to 1421; the writer-isolation refusal at 1305 to
1327; `OperatorMessageObserved` 1584; `codexHostProcess` 2627 to 2645;
`harnessProcessAlive` from 2647; the refusal message at 3381;
`writerIsolationFacts` 4472); `scripts/lib/off-ramps.mjs` 142 to 148;
`scripts/lib/host-resources.mjs` (`processAlive` 497; the `ps` read at
466); `scripts/harness.mjs` 242 to 247; `packages/skeleton/src/harness-command.ts`
155, 205, 2623, 2895; `packages/compiler/src/codex-continuation.mjs` 103
and 194 to 219; `packages/skeleton/src/loadouts/contributor.ts` (the
"Request needed authority here through the host permission flow" sentence
and the operator-message sentence of the planner); `scripts/lib/planning-document.mjs`
(the section headings); product 07 §Discipline ("A question is not a
waiver", 3697 to 3710), §Operator recovery controls, §Operator-opened
planning pass precondition 5 (an item is evidence, never direction) and
§Paired passes and the synthesis pass (the rules recorded from mid-turn
messages); this pass's §Readings and its session journal
`docs/control/local/harness/fde01246…jsonl` (the refusals) and
`e63df0b3…jsonl` (the writer acquired by pid 56325, `codex-host`).

**Objective:** No session asks the operator to run a kit command for a
state the kit can judge itself: a dead holder is dead, the refusal's own
recovery commands run, a stopped dispatch lets go, a denied activation
leaves nothing behind. A question gets an answer and changes nothing; a
remark becomes a rule only when the pass says so in one block the operator
can read and strike. A Codex session keeps the operator's standing
instructions across a compaction. The agent's context carries the
advisories that matter and not three that fire on every shell call. When
a session is truly blocked on the operator, it says so once and yields.

**Observed gap (dated 2026-11-03 at `main` `eb7c58ff6`, v0.114.0):**

- Session journal `e63df0b3…`: at 22:41:38Z a Codex session acquired the
  main checkout's writer (`owner: {pid: 56325, source: "codex-host"}`),
  dispatched `resume: release close` for WO-241, and recorded nothing
  more; its rollout shows the close publishing by 22:43Z, stopping on a
  prune blocker, and the session deleting fixtures by hand at 23:10Z. At
  23:12Z this pass's first shell call was refused: "the worktree is
  reserved by another session (… host process 56325 … is alive)";
  `writer --show` and `writer --release --force`, the two commands the
  refusal names, were refused with the same message. The operator ran
  `writer --release --force; kill 56325` by hand at 23:17Z; `ps -p 56325`
  then printed `<defunct>`. `harnessProcessAlive` judges by signal-zero
  existence and start time; a zombie passes both.
- `scripts/harness.mjs` 242 to 247 calls `--show` a bounded metadata read
  and `--release` an operator action; the hook's refusal (1305 to 1327)
  judges the dispatch before any command, so the inspection the message
  recommends cannot run from the session it is recommended to.
- The host holds a `!` command the operator types until the agent's turn
  ends (interactive-mode page, read 2026-11-03); this pass's turn kept
  reading hook source for minutes while the operator's release command
  waited; the operator's item 24.
- `../DotLn-wo242` exists with three modified generated files and no
  activation row in `docs/control/resume.jsonl`; the operator's activation
  was denied by the host and the worktree stayed.
- `operatorPrefixes` classes a message by its prefix only; an unprefixed
  message is not classed, and the roles' text ("A question is not a
  waiver", product 07 §Discipline) is the only thing between a question and
  a stop. The operator's item 10: agents stop, idle or decide on a
  question; item 11: a passing remark is recorded as a universal rule.
  Product 07 §Paired passes records rules from "the fourth, fifth and sixth
  messages" of a dispatch; the fork's pass of 2026-11-03 took starter
  v0.113.0 "under your standing rule" four minutes after its publication,
  a rule the operator's items 12 and 13 say they never gave.
- `codex-continuation.mjs` 194 restores the task after a compaction and
  says the last message may be old steering; it carries no standing
  instruction the operator gave during the session. The operator's item 7:
  after a compaction Codex still sometimes answers an old message, ignores
  "pause before the final gate", or replies and idles. Two compaction rows
  across thirteen Codex sessions on 2026-11-02 (`~/.codex/sessions`), none
  on 2026-11-03.
- Fourteen days of this checkout's journals: 513 `Shell working-directory
  override` advisories, 434 `Shell control syntax`, 336 `Dynamic shell
  substitution`, each ending "host permissions decide"; the operator's item
  14 asks what the sessions keep running into, and these three are the
  bulk of the log.

**Design (scope discipline):**

- **A zombie is dead.** The process table's state column decides; a `Z`
  row is a dead owner and its reservation is stale. Rejected: a liveness
  heartbeat (axis: a holder that writes nothing has no heartbeat to miss;
  the table already says it).
- **The refusal's remedy is admitted where it is read.** The two commands
  the message names run from the refused session, judged by exact argv:
  `--show` always, and `--release` without `--force` for a holder the
  table proves dead or a zombie, each writing the writer-events row it
  writes today; `--force` against a live holder stays the operator's,
  because a refusal proves contention and not abandonment (the design
  improver's F1 of 2026-11-04).
  Rejected: admitting any `harness` subcommand under a foreign writer
  (axis: the one-writer rule; `--show` and `--release` are the recovery,
  nothing else is).
- **A stopped dispatch lets go.** The Codex lifecycle dispatch releases
  the writer when its role command exits without the completion event,
  recording the stop; a live, working dispatch is unchanged. Rejected:
  releasing on idle time (axis: WO-237's retained reservations are not
  idle-timed; a stop is an event, not a duration). A denied activation
  removes what it created before the denial, recorded in the journal.
- **A question is a smell, and the answer has two pathways.** The hook
  classes an unprefixed message that ends in `?` as `question` (an
  interrogative opening is not enough: "Do not …" and "Can you …?" are
  instructions) and injects the context that names the two answers a
  colleague gives to a smell, why the course is right with the evidence or
  what the smell changes and what happens next, and that neither stops the
  work; the role text carries the same two pathways for Codex, whose
  prompts are unhooked. Rejected: "answer and continue" alone (axis: the
  operator's words of 2026-11-04: the pathways must be clear, since today
  a question is read as a request to stop). The exception: a message that asks for an action, pausing, stopping
  and waiting among them, is an explicit request whatever its grammar (the
  design improver's F2 and the criteria adversary's round-2 F1 of
  2026-11-04);
  the role text keeps "A question is not a waiver". Rejected: a semantic classifier (axis: WO-178's rule that the
  prefix table is control language, never a reading of prose; the
  question mark and the interrogative are form, not meaning). Codex
  message hooks are unobserved, so the class is the Claude hook's and the
  role text's; the Codex continuation carries the role text.
- **A rule is written once, in the open.** A pass that records a standing
  rule from the operator's words writes it into the `Rules recorded` block
  with the message's journal reference and digest; `plan check` reads the
  referenced row's class from the journal and refuses a rule whose row is
  a `question` or missing, so the planner's label decides nothing; the
  operator strikes a rule by the same block. Rejected: refusing rules from mid-turn messages (axis:
  the operator's mid-turn words of 2026-10-30 were direction; what failed
  was recording a remark without saying so).
- **Standing instructions ride the compaction record.** The prompt hook
  keeps each operator message's bounded text with its class in the ignored
  session journal; the `PostCompact` record names the session, and the
  compact `SessionStart` restores every message since the dispatch with
  the task, so an explicit request in question form is not dropped by its
  grammar and an unprefixed instruction is not lost for want of a hook.
  Rejected: a Codex pause protocol (axis: WO-054's adapter deliberately
  parses no conversational stop language; the instruction is restored,
  not interpreted).
- **An advisory that fires on every call is a journal row.** The three
  classification advisories stay in the journal and leave the agent's
  context when host permissions decide; an advisory that names a refusal
  stays. Rejected: removing the classification (axis: the registered-target
  admission reads it).
- **Blocked means one message and the turn's end.** The common sentence;
  no new phrase. Rejected: an agent-side `!` runner (axis: the host owns
  the queue).
- **Live-run surfaces at the base.** The process table, the refusal, the
  dispatch journal, the prefix table, the pass document, the compaction
  adapter, the advisories: exist. The zombie column, the admissions, the
  release at stop, the activation's order of operations, the class, the
  block, the restored instructions, the silence, the sentence: absent.

**Execution plan (the executor follows these steps in order; observed at `eb7c58ff6`, 2026-11-03):**

1. `scripts/lib/host-resources.mjs` (the `ps` read at 466 and
   `processAlive` 497) and `packages/skeleton/src/harness-host.ts`
   (`harnessProcessAlive`): read `stat=` with the table and judge a `Z` row
   dead; `scripts/lib/off-ramps.mjs` (`processAlive` 142) takes the same
   judgment. Check: `npm test -- --only harness` with a case that plants a
   table row in state `Z` and asserts dead.
2. `packages/skeleton/src/harness-host.ts` (the refusal at 1305 to 1327 and
   `writerIsolationFacts` 4472): admit `node scripts/harness.mjs writer
   --show` from any session and `node scripts/harness.mjs writer --release`
   from a session the writer-isolation unit refused when the holder is dead
   or a zombie, by exact argv; `--force` against a live holder is refused
   as today; the refusal message names what is admitted. Check: `npm test --
   --only harness` (the fixture of `scripts/test-harness.mjs` 925 to 1217
   that plants a `codex-host` owner), asserting the two admissions and the
   refusal of a third command.
3. The Codex lifecycle dispatch (`scripts/resume.mjs` and the dispatch
   helper that reserves the writer for `codex-host`): release the writer
   when the role's command exits without its completion event, append the
   stop to the session journal, and leave a live dispatch alone. Check:
   `npm test -- --only resume` with a fixture whose role command exits 1
   and asserts `writer --show` reads released.
4. `scripts/resume.mjs` (`next`) and `scripts/worktree.mjs` (`start`):
   create the worktree only after the host admits the dispatch; when the
   host denies after creation, remove the created worktree and branch and
   record the denial. Check: `npm test -- --only worktree` with a planted
   denial.
5. `packages/skeleton/src/harness-host.ts` (`operatorPrefixes` and the
   `OperatorMessageObserved` row): the `question` class by the question
   mark alone and its injected context naming the two pathways and the
   action-request exception; `packages/skeleton/src/loadouts/contributor.ts`
   carries the two pathways in every role root for the Codex host; the
   generated hook definition carries it.
   Check: `npm test -- --only harness` with the three forms and one
   prefixed message asserting its existing class.
6. `scripts/lib/planning-document.mjs` and `scripts/refute-plan.mjs` (`plan
   check`): the `Rules recorded` block (a JSON array of `{rule, document,
   section, message: {sessionKey, recordedAt}, captureDigest}`), refused
   when the referenced journal row is missing or its class is `question`; `plan start` writes the empty
   block; product 07's planning section states it; the emitted instance
   operator-record template carries the one sentence on rules. Check: `npm
   test -- --only plan-refutation`; `npm test -- --only launchpad`.
7. The Codex prompt hook (the `OperatorMessageObserved` writer) and
   `packages/compiler/src/codex-continuation.mjs`: the hook keeps each
   operator message's bounded text beside its class and digest in the
   ignored session journal; the `PostCompact` record names the session
   and the compact `SessionStart` restores every message since the
   dispatch; the compact `SessionStart` context restores
   them after the task sentence; the probe records the first assistant
   message after each compaction against the saved task in the session
   journal. Check: `npm test -- --only codex-continuation`.
8. `packages/skeleton/src/harness-command.ts` (155, 205, 2623, 2895): the
   three advisories become journal rows without `systemMessage` when the
   outcome is "host permissions decide"; a refusal's advisory is unchanged.
   Check: `npm test -- --only harness-fixtures` asserting no `systemMessage` for
   `cd /tmp && ls` and one for a refused command.
9. `packages/skeleton/src/loadouts/contributor.ts`: the common sentence
   (blocked on the operator: one message, the one line, the turn ends);
   `npm run sync`; each root measured against its ceiling. Check: `npm test
   -- --only harness-context`.
10. Write-backs: product 07 §Operator recovery controls (the admitted
    commands; the zombie; the release at stop), §Discipline (the question
    class; the blocked-turn sentence), §Operator-opened planning pass (the
    `Rules recorded` block) and §Model-specific notes (the restored
    instructions); the kit guide §Hooks; `docs/evidence/WO-254/decisions.md`
    (the live feedback episode; the advisory counts before and after over
    one gate); the feedback re-mint; `npm run meta`; `npm run
    publication:check`. Then the handoff of WO-253 step 10, with
    `docs/evidence/WO-254/handoff.md`.

**Deliverables:** the zombie judgment; the two admissions; the release at
stop; the activation's order; the `question` class; the `Rules recorded`
block and its check; the restored instructions and the probe; the quiet
advisories; the sentence; product 07 and the kit guide.

**Acceptance criteria (all required)**

1. In the harness fixture, a writer reservation whose owner row the planted
   process table shows in state `Z` is judged released by `node
   scripts/harness.mjs writer --show` and released by `writer --release`
   without `--force`; a planted live owner still refuses `--release` without
   `--force`.
2. In the harness fixture under a planted foreign writer whose owner row is
   in state `Z`, `node scripts/harness.mjs writer --show` runs from the
   refused session and `node scripts/harness.mjs writer --release` runs
   from it and releases; under a planted live foreign writer `--show` runs,
   `--release --force` is refused from the refused session, and `git
   status` is refused with the message naming what is admitted.
3. In the resume fixture, a Codex-dispatched role command that exits
   without its completion event leaves `writer --show` reading released and
   a journal row naming the stop; a planted activation the host denies
   after the worktree's creation leaves no worktree and no branch and
   records the denial.
4. The prompt hook records `class: question` on `OperatorMessageObserved`
   for `why is the close slow?` and `is this done?`, injects the context
   naming the two pathways (why the course is right with the evidence, or
   what the question changes and what happens next) and the action-request
   exception, and every emitted role root carries the two pathways; it
   records
   `direction` for `resume: next`, and records no `question` class for
   `How many roots are there`, `Do not run the final gate until I
   approve.` and `fix the test`; for `Can you pause before the final gate?`
   and `Can you add the missing regression test?` it records `question`
   and the injected context names the action-request exception.
5. `npm run plan -- check` on a planning branch whose pass document's
   `Rules recorded` block names a rule whose referenced journal row is a
   `question` refuses naming the rule even when the block labels it
   `direction`, refuses a rule naming no row, and passes when the
   referenced row is `direction` and the capture digest matches; `plan start` writes the empty block;
   the emitted instance operator-record template carries the sentence on
   rules.
6. In the Codex continuation fixture, an unprefixed operator instruction
   ("pause before the final gate") and a question-form request ("could you
   pause before the final gate?") typed into the fixture session are
   captured by the prompt hook with their classes and text, and after a
   `PostCompact` both are restored verbatim in the compact `SessionStart`
   context after the task sentence, and the probe's journal
   row names the first assistant message after the compaction.
7. The classification fixture shows no `systemMessage` for `cd /tmp && ls`,
   `echo $(date)` and `a; b` when host permissions decide, journal rows for
   each, and an unchanged `systemMessage` for a refused command.
8. Every emitted role root carries the blocked-turn sentence and `harness
   check` passes; product 07 and the kit guide state the admitted commands,
   the zombie judgment, the release at stop, the question class, the rules
   block and the restored instructions as built; `npm run
   publication:check` is green.
9. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency; the live feedback self-host episode recorded
   in the decisions.

**Preflight:** `npm test -- --only harness` for steps 1, 2 and 5; `npm test
-- --only resume` for step 3; `npm test -- --only worktree` for step 4; `npm test -- --only
plan-refutation` for step 6; `npm test -- --only codex-continuation` for
step 7; `npm test -- --only harness-fixtures` for step 8; `npm test -- --only
harness-context` for step 9; `npm run test:docs` when a document changes;
each under `node scripts/harness.mjs bounded --`; then one `npm test --
--review` (07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the fixtures of criteria 1 to 7; the feedback re-mint
and the live feedback self-host episode; `npm test -- --review` before
`implementation-ready`, final review reusing the passing complete row at
the integrated code identity when one exists.

**Write-back duty:** as listed in step 10 and criterion 8.

**Known issues and carry-ins:**

- Until this order lands, a foreign writer whose holder is a zombie is
  released by the operator's one line, `node scripts/harness.mjs writer
  --release --force`, and the session says so once and ends its turn
  (product 07 §Operator recovery controls carries the sentence from this
  pass).
- Codex tool calls are unhooked; the `question` class and the quiet
  advisories are the Claude hook's, and the role text and the continuation
  carry the duty on Codex (reopen: a Codex message hook becomes
  observable).
- `../DotLn-wo243` holds 56 staged files the operator began for WO-243;
  this order does not touch it; WO-243's executor integrates `main` and
  adopts or discards them at activation under the operator's word (reopen:
  the activation refuses the occupied path).

- FUP-4763c82de6324631 (WO-251-D017: Make the hook and the host deny the same names for each listed desktop skill. Emit Skill(skill:<n): a follow-up a recent close wrote instead of
  fixing in place, allocated here by the 2026-11-03 pass on the operator's
  item 4; the executor takes it in the step that owns its file and records
  the decision (reopen: the hook and the host deny different names after WO-254).
- FUP-4798f1b5f5a74ed1 (WO-249-D017: appendTransition in scripts/resume.mjs writes an event before folding it, so when a command's pre): a follow-up a recent close wrote instead of
  fixing in place, allocated here by the 2026-11-03 pass on the operator's
  item 4; the executor takes it in the step that owns its file and records
  the decision (reopen: a segment takes an event it cannot read after WO-254).
- FUP-a0efaae1b9887fde (WO-241-D003: Unify the spawn-cap runtime's budget path with configured control roots, with relocated-root admi): a follow-up a recent close wrote instead of
  fixing in place, allocated here by the 2026-11-03 pass on the operator's
  item 4; the executor takes it in the step that owns its file and records
  the decision (reopen: the spawn cap reads a budget path outside the configured control roots after WO-254).
- FUP-1b5cb21e12253f3e (WO-241-D015: Make the driven-session-ceiling and driven-phase-timeout reader proofs observe scripts/lib/drive-): a follow-up a recent close wrote instead of
  fixing in place, allocated here by the 2026-11-03 pass on the operator's
  item 4; the executor takes it in the step that owns its file and records
  the decision (reopen: removing either read still passes after WO-254).

**Non-goals:** a semantic classifier of operator prose; a Codex pause
protocol; removing the shell classification; widening any refusal; an
agent-side runner for `!` commands.

**Operator-review assumptions:** that the question forms above are the
ones that stop sessions (the operator's own messages of 2026-11-03 are the
evidence); that a rule the operator wants kept is one they will leave in
the `Rules recorded` block; that restoring standing instructions verbatim
after a compaction is what "ignoring standing orders" asks for. Reopen on
the operator's word.
