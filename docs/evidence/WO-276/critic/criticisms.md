# The meta critics' criticisms of the executor, as WO-276 judged them

Recorded on 2026-11-12, during WO-276's execution, at the operator's request
that the critics' criticisms that were judged valid be kept where a planning
pass or the follow-up register can mine them (capture
`wo276-keep-the-critics-valid-criticisms-for-planning-2026-11-12.txt`,
SHA-256 `235f034acf6ac759eb34af3513ba4525a9cf9383a4bc7cc83430e520f2a116de`).
It covers the thirty-five critics launched up to 21:57 UTC that day, the
thirty-sixth and thirty-seventh, launched at 17:19 and 18:20 UTC on
2026-11-13 in the repair of VER-003, and the fortieth to forty-third,
launched at 02:26, 03:41, 04:57 and 07:00 UTC on 2026-11-14 in the repair
of FINAL-001: 152 points, each with the decision that judged it. The thirty-eighth and
thirty-ninth were stopped before they
returned a report and made no point
([WO-276-D145](../decisions.md#wo-276-d145--the-seventeenth-complete-run-passes-on-the-candidate-the-repair-of-ver-003-leaves-the-restarted-daemon-stayed-flat-under-it-a-critic-launched-after-the-pass-is-stopped-on-the-operators-direction),
[WO-276-D166](../decisions.md#wo-276-d166--correction-the-thirty-ninth-meta-critic-was-launched-before-the-repair-had-done-anything-to-judge-and-is-stopped)).
[README.md](README.md) says what the critic is and how it is run.

## What this record is, and what it is not

- **Its source is the order's decisions**, where the executor judged each
  critic's report, and the standing file for the thirty-third critic. The
  critics' own reports stay in the ignored reviews lane
  (`critic-<n>.md`): they quote the session's transcripts, and no word of
  them is copied here. Each point is therefore the executor's paraphrase of
  a criticism of itself.
- **"Valid" means the executor accepted it**, wholly or in part, and changed
  how it worked. Nobody else judged these points. A reader who doubts a row
  has the critic's report in the ignored lane and the decision named beside
  it.
- **The critics were not all the same instrument.** Critics 1 to 29 worked
  from a brief that included a status the executor wrote and that let them
  judge the implementation; the operator corrected both, and critics 30 to
  37 and 40 to 43 read the session's transcripts themselves under a fixed
  charter and judge conduct alone. The rows of the two groups are counted apart
  below.
- **How it was made.** A research worker (a Claude `dotln-worker`,
  read-only, 20:11 to 20:22 UTC) read the decisions and returned the tables
  and the classes. The executor read its rows for critics 3, 19, 26, 30 and
  33 against the decisions, found them to match, and corrected one cell (the
  answer to the thirtieth critic's fourth point). The other rows are the
  worker's reading and were not checked one by one. The classes are the
  worker's grouping, named from what the rows say. The thirty-fourth
  critic's two rows and the thirty-fifth's three, with their places in the
  classes, were added by the executor when D112 and D118 judged them. The
  thirty-sixth critic's five rows were added by the repair's executor on
  2026-11-13, an hour after [D141](../decisions.md#wo-276-d141--the-fifteenth-complete-run-is-stopped-on-the-operators-direction-what-is-and-is-not-established-about-the-file-events-daemons-memory-the-thirty-sixth-critics-five-points-and-the-two-things-this-session-could-not-do-itself) judged them
  and only when the operator asked whether the record was being kept up
  (capture
  `wo276-ver003-repair-codex-cleanup-and-the-critics-record-2026-11-13.txt`,
  SHA-256
  `4a532165257ab4224fad7d1fca7d31b9156a822f2157dec8f8877809d5706560`); the
  class of each is that executor's reading. The thirty-seventh critic's
  three rows were added with [D144](../decisions.md#wo-276-d144--correction-what-the-daemon-comparison-established-and-what-wo-276-d142-and-the-gates-refusal-said-beyond-it-the-thirty-seventh-critics-three-points), the decision that judged them, and the
  fortieth critic's three with [D179](../decisions.md#wo-276-d179--the-fortieth-critics-three-points-a-reconciliation-that-left-nineteen-comparisons-out-a-review-round-launched-before-the-cheap-checks-and-a-handoff-sentence-that-credited-probes-the-executor-had-only-read) and the forty-first's four
  with [D182](../decisions.md#wo-276-d182--the-forty-first-critics-four-points-a-shared-repairs-consumers-not-listed-before-it-exit-statuses-read-from-the-logging-a-return-field-the-brief-never-named-and-a-requested-setting-given-as-what-ran) the forty-second's one with [D184](../decisions.md#wo-276-d184--the-forty-second-critics-point-a-cases-pass-credited-for-a-shape-its-edited-input-no-longer-held) and the forty-third's three
  with [D186](../decisions.md#wo-276-d186--the-forty-third-critics-three-points-a-reviewers-scope-narrowed-on-a-reason-not-checked-cheap-checks-run-late-and-a-cause-given-to-the-operator-before-its-code-was-read), the decisions that judged them; the class of each is
  that repair's executor's reading.

## Before and after the thirtieth launch

The operator asked on 2026-11-12 that the findings of the proper meta
critics be told apart from the earlier ones (capture
`wo276-delineate-the-proper-critics-findings-2026-11-12.txt`, SHA-256
`36f9cc9afb47a01f6131cced56fe1bb36006242f8fb902977085a01e9a7c70a4`). The line is the
thirtieth launch. Before it, twenty-nine critics were given a status the
executor wrote and were allowed to judge the implementation: 113 points,
nine of them about the code, 107 accepted, 2 in part and 4 with no verdict
stated. From it on, the twelve critics that returned a report (30 to 37
and 40 to 43) read the session's transcripts and the repository themselves
under a fixed charter and judge conduct alone: 39 points, all about
conduct, all accepted.

The accepted conduct criticisms, by class, on each side of the line:

| Class | Before (1 to 29) | After (30 to 37, 40 to 43) |
| --- | --- | --- |
| A recovery record left stale, superseded or contradicting itself | 16 | 5 |
| An hours forecast that does not add up | 16 | 0 |
| Checks and runs chosen or timed poorly | 12 | 3 |
| A result, cause or property claimed before its observation | 8 | 9 |
| A gate or review round started with known work unfinished | 5 | 3 |
| A change checked against too few consumers or input variants | 7 | 1 |
| A timed comparison not held to a single difference | 7 | 0 |
| Worker cadence, scope and budget handled loosely | 6 | 2 |
| The executor settling what belongs to the operator or the host | 6 | 0 |
| A figure, time or order in a record that does not match its observation | 2 | 5 |
| A heuristic repaired one counterexample at a time | 5 | 0 |
| Coverage claimed beyond what a test or comparison shows | 4 | 3 |
| A worker given premises it should not rely on | 1 | 5 |
| A known defect deferred for a reason that does not hold | 4 | 0 |
| An as-built record filed before its recheck and gates | 1 | 1 |
| A problem or a question handed to the operator that was the executor's to settle | 0 | 2 |
| **All** | **100** | **39** |

What the twelve independent critics found, the first six in their own
order of weight and the six of the repairs after them:

- The recovery record (the standing file, and once the checkpoint named as
  a part's end) did not match what had been done: four of the twenty
  points, from three of the six critics (31, 33 and 34), the last two
  after the first had been accepted and a rule written. It is the first class on both sides of the
  line.
- What a record said did not match what was observed: a result given the
  time of a later run, records that state the intended order of work and
  not the one the tools show, a statistic that joined two samples, a
  finding's class taken from the helper's list without the order's
  definition of it.
- A worker was handed something it should not have relied on: the
  executor's own account of its work (the critics before the thirtieth), an
  inference stated as fact in an attacker's brief.
- Success was claimed before it was had: a pass reported before the run, a
  build's failure hidden by a pipe, a round of reviews recorded as the
  paired measurement without reading what each worker had been assigned,
  a model and effort that were requested given as the ones that ran.
- A gate was started with known work unfinished, and two checks failed on
  their own preparation.
- Launches were handled loosely: a launch promised with nothing set to wake
  for it, a recheck widened to code the worker had not read.
- An as-built record was filed before its gates.
- The thirty-sixth critic, in the repair of VER-003, found two classes the
  six before it had not, both known from before the line: runs timed
  poorly (a complete run left running for fourteen minutes after planned
  changes had made its result worthless, and the run before it launched
  without the option the order's step prescribes, so that seven suites never
  started) and coverage claimed beyond what was checked (every reader said
  to be compared or to have no committed input, before each exclusion had
  been read against the inputs the tree held). It found a class no critic
  had named: the executor told the operator that a problem was beyond it
  before checking what it could do. And it found a worker's brief carrying
  an inference as settled, described to the operator as carrying none.
- The thirty-seventh critic, an hour later, found three: a small comparison
  on a healthy daemon recorded as settling a question about a complete run
  and about a stuck daemon, with a sentence in the gate's own refusal that
  the order's samples contradicted; the permission check's refusal turned
  into a question about a direction the operator had already given; and a
  complete run started on a standing file forty minutes stale, against the
  step that has it rewritten before each run. The last is the recovery
  record again, the first class on both sides of the line, from four of the
  twelve critics.
- The fortieth critic, in the repair of FINAL-001, found three, each in a
  class known from before: a reconciliation of a comparison driver's run
  recorded as complete, which had passed over nineteen of the seventy-nine
  comparisons without saying so (coverage claimed beyond what was checked);
  the review ladder's first round launched before the checks that cost
  seconds had run and before the handoff's passages were written (a round
  started with known work unfinished); and a handoff sentence that credited
  two probes the executor had read and not run (a result claimed before its
  observation).
- The forty-first, an hour later, found four: a repair that moved into the
  shared parse entry before the executor had listed every reader of what it
  changed, so one consumer, the front page's guard, failed later (the first
  point after the line in the class of a change checked against too few
  consumers); statuses announced from a chain's logging and not from the
  checked command (a result claimed before its observation); re-tasks that
  told three reviewers their brief required a field it never named (a
  worker given a premise it should not rely on); and a critic's requested
  model and effort written as what ran, against a rule adopted in the order
  (a record that does not match its observation).
- The forty-second found one: a case's pass cited in a decision for a
  shape its input no longer held, after a script's string replacement had
  turned the math block's double dollar lines into single ones (coverage
  claimed beyond what a test shows).
- The forty-third found three: a reviewer's proposed scope rejected on a
  reason never checked against the committed orders, and the class then
  called closed (a result claimed before its observation); a template's
  consumer test first met in the complete run, and a long chain run before
  the check that costs seconds (checks chosen or timed poorly); and a cause
  given to the operator before the deciding validator was read (a cause
  claimed before its observation).

What the earlier critics found that the later ones did not (forecasts of
hours, the choice and timing of suites, comparisons of timed runs, the
number of consumers a repair was checked against, heuristics grown one
example at a time) follows what their brief pointed them at: the executor's
status told them about hours, suites and repairs. Their rows are evidence of
those faults; their absence after the line is not evidence that the faults
stopped.

The operator's note on seeing this split: there may be a use for both
kinds of critic. [README.md](README.md) says what each is and what stands
against the briefed kind as it was run.

## How a planning pass can use it

The classes below are ordered by how often a criticism of that kind was
accepted, over all forty-one critics that returned a report, and the
table above splits them by instrument. Each is a way an executor went wrong that a second model had to
point out, most of them more than once, and several after a rule against
them was already written in the standing file. For each class a pass can ask
what the kit could carry so that no critic is needed to say it: a sentence
in a role's text, a check a command makes (the standing file's next action
against the last completed results; a record's time against the session
journal; a forecast's rows against their sum), or nothing, with the reason.
The by-critic table gives the cases to test such a rule against.

## Accepted conduct criticisms by class

139 rows (conduct, accepted wholly or in part):

1. **Recovery record left stale, superseded or self-contradictory** (standing file, handoff or checkpoint), so a resumed session would act on what is no longer true. **21 times.** Critics 2 (D045), 4 (D048), 7 (D052), 10 (D062), 11 and 12 (D067), 14 (D070), 15 and 16 (D072), 17 (D074), 18 (D076), 19 (D077), 20 (D080), 23 (D085), 24 (D087), 26 (D091), 31 (D106), and 33 twice (standing file; D111), 34 (D112) and 37 (D144).
2. **Hours forecast that doesn't add up**: it double counts or overlaps, leaves out work, rests on an assumption nothing observed supports, is fitted to the bound, or names an overrun without a choice. **16 times.** Critics 1 (D043), 2 (D045), 3 (D046), 4 (D048), 5 (D049), 7 (D052), 8 (D054), 9 (D058), 11 and 12 (D067), 13 (D068), 17 (D075), 19 (D077), 20 (D080), 21 (D082), 23 (D085).
3. **Checks and runs chosen or timed poorly**: more suites than the rule asks, a complete run cut short, a second suite started beside a failing one, a suite deferred until it hid a failure, an accidental gate from a careless probe, a long case rerun for one line, a run left running after its result could no longer bear on the next decision, a run launched without the option its step prescribes. **15 times.** Critics 1 (D043), 2 (D045), 3 (D046), 5 (D049), 9 (D058), 10 (D062), 12 (D067), 14 (D070), 21 (D082), 23 (D085), 27 (D093), 28 (D097), 36 twice (D141) and 43 (D186).
4. **Result, cause, property or premise claimed or designed on before the observation that would establish it**, or beyond what the observation covers, a status included that the logging made and not the checked command, and a reviewer's scope narrowed on a reason never checked. **17 times.** Critics 12 (D067), 17 (D074), 18 (D076), 23 (D085), 26 (D091), 28 (D097), 29 twice (D100), 30 (D103), 31 (D106), 35 twice (D118), 37 (D144), 40 (D179), 41 (D182), 43 twice (D186).
5. **Gate or review round started with known work unfinished**: returns not triaged, held notes not decided, pre-gate checks or a name search not done, a comparison not yet run, a test file's preparation not read, authored passages not yet written. **8 times.** Critics 13 (D068), 15 (D072), 22 twice (D084), 24 (D087), 30 (D103), 33 (standing file), 40 (D179).
6. **Change or repair checked against too few consumers or input variants**, or built before its consumers were mapped, a shared module's behavior changed before every reader of it was listed included. **8 times.** Critics 1 (D043), 3 (D046), 6 (D051), 8 (D054), 11 (D067), 17 (D074), 24 (D087), 41 (D182).
7. **Timed comparison or baseline not held to a single difference**: repairs, caches or inherited priority leads in one tree only, an observation taken after the edit, the wrong starting point. **7 times.** Critics 1 (D043), 2 (D045), 3 (D046), 4 (D048), 5 (D049), 8 (D054), 9 (D058/D057).
8. **Worker cadence and budget handled loosely**: launches held for reasons the cadence does not admit, nothing set to wake for a due launch, uses not counted against the work left, a re-task sent beyond what the rule admits. **8 times.** Critics 11 (D067), 15 (D072), 19 (D077), 22 (D084), 25 (D089), 27 (D093), 30 (D103), 34 (D112).
9. **Executor settled what belongs to the operator or the host**: read a requirement down, framed a difficulty as scope, called a known defect a scope decision, or suggested a route around a host safeguard. **6 times.** Critics 2 (D045), 16 (D072), 18 twice (D076), 20 (D080), 21 (D082).
10. **Figure, time or order in a record that does not match its observation**: wrong sample, out-of-date code, intended rather than actual order, a field the collector misreads, a class taken from an incomplete reading of its definition, a requested setting written as what ran. **7 times.** Critics 1 (D043), 27 (D093), 30 (D103), 31 (D106), 32 (D108), 35 (D118), 41 (D182).
11. **Heuristic repaired one counterexample at a time**, with no stated contract, family of forms or stopping point. **5 times.** Critics 11 (D067/D066), 20 (D080), 21 (D082), 26 (D091), 28 (D097).
12. **Coverage of a test or comparison claimed beyond what it shows**, including a reconciliation that passed over members of its set without saying so, and a case's pass cited for a shape its edited input no longer held. **7 times.** Critics 6 (D051), 12 (D067/D066), 21 (D082), 29 (D100), 36 (D141), 40 (D179), 42 (D184).
13. **Worker given premises it should not rely on**: the executor's own account, an inference stated as fact, files later than the tree it names, or a re-task that says the brief asked for what it never named. **6 times.** Critics 10 (D062), 30 (D103), 31 (D106), 32 (D108), 36 (D141), 41 (D182).
14. **Known defect or observed failure deferred or held for a reason that does not hold**, or a held list not kept consistent. **4 times.** Critics 7 (D052), 14 (D070), 25 (D089), 27 (D093).
15. **As-built record filed before the recheck and gates it reports.** **2 times.** Critics 26 (D091), 32 (D108). This is close to class 4.
16. **Problem or question handed to the operator that was the executor's to settle**: a failure said to need an action the executor could not take, with the permission and the alternatives unchecked; a refusal by the session's permission check turned into a question about a direction already given. **2 times.** Critics 36 (D141) and 37 (D144, with D143). It is the reverse of class 9, and the operator made the same correction without a critic three times in this order (D083, D119 and the messages D141 records).

## Counts

| Critic | Points | Accepted | In part | Declined | Not stated |
|---|---|---|---|---|---|
| 1 | 6 | 5 | 0 | 0 | 1 |
| 2 | 5 | 4 | 1 | 0 | 0 |
| 3 | 4 | 4 | 0 | 0 | 0 |
| 4 | 3 | 3 | 0 | 0 | 0 |
| 5 | 3 | 3 | 0 | 0 | 0 |
| 6 | 5 | 2 | 0 | 0 | 3 |
| 7 | 4 | 4 | 0 | 0 | 0 |
| 8 | 3 | 3 | 0 | 0 | 0 |
| 9 | 3 | 3 | 0 | 0 | 0 |
| 10 | 3 | 3 | 0 | 0 | 0 |
| 11 | 5 | 5 | 0 | 0 | 0 |
| 12 | 5 | 5 | 0 | 0 | 0 |
| 13 | 3 | 3 | 0 | 0 | 0 |
| 14 | 4 | 4 | 0 | 0 | 0 |
| 15 | 4 | 4 | 0 | 0 | 0 |
| 16 | 3 | 3 | 0 | 0 | 0 |
| 17 | 4 | 4 | 0 | 0 | 0 |
| 18 | 4 | 4 | 0 | 0 | 0 |
| 19 | 4 | 4 | 0 | 0 | 0 |
| 20 | 5 | 5 | 0 | 0 | 0 |
| 21 | 5 | 5 | 0 | 0 | 0 |
| 22 | 3 | 3 | 0 | 0 | 0 |
| 23 | 4 | 4 | 0 | 0 | 0 |
| 24 | 4 | 4 | 0 | 0 | 0 |
| 25 | 3 | 3 | 0 | 0 | 0 |
| 26 | 4 | 4 | 0 | 0 | 0 |
| 27 | 4 | 4 | 0 | 0 | 0 |
| 28 | 3 | 3 | 0 | 0 | 0 |
| 29 | 3 | 2 | 1 | 0 | 0 |
| 30 | 5 | 5 | 0 | 0 | 0 |
| 31 | 4 | 4 | 0 | 0 | 0 |
| 32 | 3 | 3 | 0 | 0 | 0 |
| 33 | 3 | 3 | 0 | 0 | 0 |
| 34 | 2 | 2 | 0 | 0 | 0 |
| 35 | 3 | 3 | 0 | 0 | 0 |
| 36 | 5 | 5 | 0 | 0 | 0 |
| 37 | 3 | 3 | 0 | 0 | 0 |
| 40 | 3 | 3 | 0 | 0 | 0 |
| 41 | 4 | 4 | 0 | 0 | 0 |
| 42 | 1 | 1 | 0 | 0 | 0 |
| 43 | 3 | 3 | 0 | 0 | 0 |
| **Total** | **152** | **146** | **2** | **0** | **4** |
| 1–29 | 113 | 107 | 2 | 0 | 4 |
| 30–37, 40–43 | 39 | 39 | 0 | 0 | 0 |

- **By kind:** 143 conduct and 9 implementation. All nine implementation points come from critics 7 to 25 and were all accepted.
- **Nothing declined outright.** The only remedy declined was critic 29's call identifier, and D102 later reversed that.

## By critic

### After: critics 30 to 43, under the fixed charter

The thirty-eighth and thirty-ninth were stopped before they returned a
report and have no rows.

| Critic | Decision | The point | Kind | Judged | What changed, or why it was declined |
| --- | --- | --- | --- | --- | --- |
| 30 | D103 | Reported success before having it, and reran after a failed edit. | conduct | accepted | A claim rests on a completed result on the named tree. |
| 30 | D103 | Started gates with known work unfinished. | conduct | accepted | No gate until every return is judged, every change applied and records regenerated. |
| 30 | D103 | Made the critic depend on the executor's account. | conduct | accepted | Ended by the charter (D101). |
| 30 | D103 | Records gave the intended order of work, not the order the tools show. | conduct | accepted | A time in a record is taken from a tool's timestamp. |
| 30 | D103 | Promised a launch time and ended the turn with nothing set to wake it. | conduct | accepted | A background timer is started. |
| 31 | D106 | A result keeps the time of its own run. | conduct | accepted | Given as a rule only. |
| 31 | D106 | A build that a check depends on was piped. | conduct | accepted | Rule: no pipe. |
| 31 | D106 | Update the standing file at each step boundary. | conduct | accepted | Rule. |
| 31 | D106 | A worker's brief should carry what is unobserved as open. | conduct | accepted | Rule; D106 corrects D105's sentence about the matcher engine. |
| 32 | D108 | An inference was given to the attacker as fact. | conduct | accepted | Already withdrawn. Adopted: check each conclusion against its observation, with scope, uncertainty and completion, before filing or briefing. |
| 32 | D108 | D106 filed as the as-built record before its gates, against D091. | conduct | accepted | D108 written after the gates as the real as-built record. |
| 32 | D108 | A statistic joined two samples and gave one sample's median for both. | conduct | accepted | Corrected. |
| 33 | standing (no decision) | The standing file kept superseded instructions beside their corrections. | conduct | accepted | A correction replaces what it supersedes. |
| 33 | standing | The checkpoint named as Part Q's end held a stale standing file and an incomplete handoff. | conduct | accepted | Records are written before the end checkpoint, and the gated tree is named. |
| 33 | standing | Two checks failed on their own preparation. | conduct | accepted | Read the suite row's command and the cases' tags before the first run. |
| 34 | D112 | The standing file, patched a sentence at a time, held a count of 155 above a list that ran to 160, after the same file's criticism by critic 33. | conduct | accepted | Before a turn ends with work unfinished, the whole active block is read against the completed results and launches, and its count, launches and next action are replaced together. |
| 34 | D112 | A recheck was widened to code the worker had not read (step R4) before the installed re-task rule was reread. | conduct | accepted | A re-task's brief is checked against the rule before it is sent; a fresh attacker read steps R4 to R6. |
| 35 | D118 | A round of reviews was recorded as the paired measurement although its workers had been launched as rechecks: the three kinds on recheck briefs, the combined worker on the change since an earlier report's tree. | conduct | accepted | A worker's brief is rendered with a dry run and its round, base and tree are read before it is launched and before its return is recorded; the arrays of D080 and D117 are renamed. |
| 35 | D118 | A regression against the base was classed lesser from the helper's list of classes, where the order defines criterion to include breaking behavior main had. | conduct | accepted | The class is corrected; a class is taken from the order's definition. |
| 35 | D118 | A launcher's requested model and effort were reported to the operator as the ones that ran. | conduct | accepted | They are reported as requested unless the host's readback was read. |
| 36 | D141 | A complete run was left running for fourteen minutes after the executor had planned changes that made another run necessary, and the memory investigation was put off until it ended. | conduct | accepted | When the priority or the planned changes move, what the running gate can still establish is judged again; a gate whose result cannot bear on the next decision is stopped. |
| 36 | D141 | The operator was told that another failure on memory pressure would need an action the executor could not take, before the executor had checked its permission or the alternatives. | conduct | accepted | What the session can do is checked before a problem is called the operator's; the administrator check was made and the two refused actions were each named with the evidence. |
| 36 | D141 | The fourteenth complete run was launched without the option the order's step prescribes, and seven suites never started. | conduct | accepted | A repair's complete run is launched with the step's own command, read from the order. |
| 36 | D141 | The decision said every remaining reader had no committed input before each exclusion had been read; one had 216 records in the tree. | conduct | accepted | A claim about every member of a set waits until each member is checked; the comparison was added and passed. |
| 36 | D141 | The research worker's brief stated that the number of files alone was ruled out as the cause, an inference, and the operator was told the brief carried no conclusions. | conduct | accepted | A brief gives observations and says what is unexplained; what was sent is described as it was sent. |
| 37 | D144 | A comparison of 20,000 files on a healthy daemon was recorded as showing that where a gate's files are made does not matter and as a bound for a complete run; the gate's refusal said each gate adds memory, which the order's own samples contradict. | conduct | accepted | The two conclusions and the derived figure are withdrawn by name; the refusal, its comment and the guide say what was observed and that the cause is not established. |
| 37 | D144 (D143) | The permission check's refusal was turned into a question to the operator about a direction already given, where the refusal left other methods open. | conduct | accepted | A refusal is reported with what was refused; the change is made by a method the check admits, and no question is put about a direction the operator has given. |
| 37 | D144 | The sixteenth complete run was started on a standing file written forty minutes earlier that still listed finished work as needing the operator, against the step that has it rewritten before each run. | conduct | accepted | The standing file is rewritten before every complete run; it was rewritten before the seventeenth. |
| 40 | D179 | WO-276-D176 recorded a reconciliation of the comparison driver's run with the records, while the executor's script had cut the summaries short and passed over the nineteen it could not parse, two of them grown in inputs beyond the ten the decision listed. | conduct | accepted | Withdrawn by name (WO-276-D180) and made again from the next run's whole output, with every one of the 79 comparisons accounted for and any line that does not parse reported. |
| 40 | D179 | The ladder's first round was launched before the affected checks that cost seconds had run and before the handoff's passages were written; one check failed within six seconds and changed a source. | conduct | accepted | Before the second round's tree is taken, the test files the round's repairs touch run whole with the document, planning and index checks, and the handoff and decisions are written. |
| 40 | D179 | The handoff said every probe of the final review showed its defect gone, when two had been read and not run. | conduct | accepted | Both were run and the sentence says what each showed; a statement about a set of results is checked against the complete results, naming any member skipped. |
| 41 | D182 | The parse entry's repair changed what every reader of the tree receives after a search for the readers of the extensions' nodes that covered one directory; the consumer it missed failed later. | conduct | accepted | Every reader of a shared module's changed property is listed across scripts and packages before the edit and before any long comparison (the guard was repaired in D181). |
| 41 | D182 | Statuses were announced from a chain's trailing echo or grep, not from the checked command: an exit 1 announced as 0, a pass read as a failure, two failed suites under a chain's 0. | conduct | accepted | A status is announced only from the checked command's own printed exit and result line; a chain ends with its worst step's status. |
| 41 | D182 | Three re-tasks told the reviewers their brief required schemaVersion, which the brief delivered on the Agent route never named; the schema reaches a worker only as the CLI's argument. | conduct | accepted | An Agent-route worker is given the complete return contract and an omission is judged against the text delivered; the brief's gap, which main shares, goes to planning. |
| 41 | D182 | D179 named the fortieth critic's requested model and effort as what ran, against D118's rule. | conduct | accepted | Settings are given as requested unless the host's readback was read; D182 says what D179's words are. |
| 42 | D184 | A script's string replacement turned the B4 case's math block lines from double dollars to single, and D178 cited the case's pass for a math block its input no longer held. | conduct | accepted | An edited case's own input and expectation diff is read before its pass is cited, and a test input holding a dollar sign is edited with the editor; D183 restored the lines and D184 names D178's sentence unsupported until then. |
| 43 | D186 | D183 rejected the second round's proposed reading on a predicted false refusal never checked against the committed orders, and the handoff called the class closed; the third round found it open. | conduct | accepted | A reason for narrowing a reviewer's scope is checked before it is recorded, and a class is called closed only to the extent its evidence covers; D185 withdrew the rejection. |
| 43 | D186 | A template's consumer test was first met failing in the complete run, and a 29-minute chain ran before the check that costs seconds, which then failed three ways. | conduct | accepted | An affected-check list is kept across the whole repair, and the checks that cost seconds run before long comparisons and complete runs. |
| 43 | D186 | The operator was told main's integrate command failed because the order added an event type; main's validator admits the event and refuses the metric. | conduct | accepted | A cause is given as established only after the deciding code is read, else called an inference; D187 records the metric. |

### Before: critics 1 to 29, briefed by the executor

| Critic | Decision | The point | Kind | Judged | What changed, or why it was declined |
| --- | --- | --- | --- | --- | --- |
| 1 | D043 | Part C ran eight suites (32 min) before a complete run that reran them all, which is more than the light-part rule asked. | conduct | accepted | Before a part's batch the executor names two or three suites, each with the defect it would catch. The rest are left to the complete runs. |
| 1 | D043 (D044) | Findings of single combined reviews were written into the paired-round array, so the collector would count them as paired rounds. | conduct | accepted | The arrays in D030 and D038 were renamed. Rolling-review and critic points are judged in prose only, and the one paired-round record is kept for the closing ladder. |
| 1 | D043 | Edits made between Part D's two timed runs would make the trees differ by more than Part D. | conduct | accepted | From the baseline's start to the after run's end the tree changes only by Part D. Repairs are listed and made afterwards, or the baseline is run again. |
| 1 | D043 | The worker cap. | conduct | not stated | Answered as already handled by D041 (200 uses, count carried at each launch). No verdict word. |
| 1 | D043 | A part that crosses many files should be read before it is built: each criterion set beside its producer, consumers and case, and an apparent contradiction first tested as a move of existing behaviour. | conduct | accepted | Became the consumer map made before each part. |
| 1 | D043 | The remaining hours had no allocation. | conduct | accepted (after Part D) | The standing file carries an allocation once Part D's runs give a complete run's time. |
| 2 | D045 | Stopping the first baseline complete run at 15 minutes. | conduct | accepted in part | The critic's two conditions were adopted and said to be met, but the stop itself was defended. D046 later recorded the stop as having delayed a discovery. |
| 2 | D045 | The fixture install cache was warm for the before tree only, which biased the timed pair. | conduct | accepted | The same bounded fixture warm-up runs before each timed run, and launchpad task times are kept beside the wall time. |
| 2 | D045 | The hours needed an allowance now, not after Part D. | conduct | accepted | A provisional allowance for each part was put in the standing file. |
| 2 | D045 | Criterion A6 was misread as an instruction to write a record, and was recorded unmet. | conduct | accepted | Correction: one sentence added to the release-close root, and the criterion judged met. |
| 2 | D045 | The standing file was not one current snapshot. | conduct | accepted | Rewritten as one snapshot; the history stays in the decisions. |
| 3 | D046 | A repair to shared code should also be proven against a case another caller already holds. | conduct | accepted | Standing-file rule: list the callers first, then test with the moving case and another caller's case. |
| 3 | D046 | The next baseline would inherit failure-priority leads that the after run would not have. | conduct | accepted | The three failed suites were run singly before the baseline. Any lead that still differs is named. |
| 3 | D046 | Part D's allowance needed reforecasting now. | conduct | accepted | Reforecast with what is cut first, and a stop for reassessment after a third failed baseline. |
| 3 | D046 | Stopping the first run delayed discovery with no proven saving. | conduct | accepted | Recorded as about 80 minutes deferred. Rule: a failed complete run finishes unless every remaining task is blocked by the cause found. |
| 4 | D048 | The hours table's total was two hours under the sum of its rows and left out Z1 and the held repairs. | conduct | accepted | One forecast with every row, a reserve and cuts decided in advance. |
| 4 | D048 | The control run had already run the exclusive suites back to back. | conduct | accepted | Already in D047, which also admits the observation was recorded after the edit. |
| 4 | D048 | The standing file still described a withdrawn behaviour and a finished step. | conduct | accepted | Both corrected. |
| 5 | D049 | Putting the race repair in the tree would make the after run differ from the control by more than Part D. | conduct | accepted | Repair withdrawn to a patch and the code restored byte for byte to checkpoint 13. |
| 5 | D049 | D048's forecast fitted the bound by giving later parts no suites. | conduct | accepted | Each part again names one or two suites. The operator is told about the thin reserve instead of the table being balanced. |
| 5 | D049 | The title evidence was scheduled after the timed runs, though it needs no timed run. | conduct | accepted | Taken at once. |
| 6 | D051 | All callers of the reader's unrestricted fields should be audited together. | conduct | accepted | 12 uses in 8 functions audited; four changed to read labels. |
| 6 | D051 | Part B closed on the screen's coverage, not on whether the migration was complete. | conduct | accepted | The screen now resolves names bound to constants, and criterion B1 holds by the screen. |
| 6 | D051 | The hours table. | conduct | not stated | Answered that it was reconciled when Part D closed (D050). |
| 6 | D051 | The runner gate ran twice where once would have done. | conduct | not stated | Stated as fact; no change named. |
| 6 | D051 | What was repaired, listed in order in the standing file. | conduct | not stated | The record says only that the standing file lists the repairs in order. |
| 7 | D052 | The duplicate-title case started the source reader once per file. | implementation | accepted | Reads all suite files in one batch. |
| 7 | D052 | D051 left the replaced-tag finding unrepaired, for a reason that does not follow from the criterion. | conduct | accepted | Repaired inside the one record. |
| 7 | D052 | The hours table named an overrun but gave no choice. | conduct | accepted | The choice is stated with what each side buys, and was put to the operator. |
| 7 | D052 | Standing-file bullets called repairs still due after they were made. | conduct | accepted | Replaced. |
| 8 | D054 | The hours table multiplied wrongly and counted report reading twice. | conduct | accepted | Rebuilt from costs kept apart. |
| 8 | D054 | A shared repair proven against two callers can miss a default the two share. | conduct | accepted | Input variants are listed beside the callers before a repair. Applied to Part F, it put the browser rule back in every role (D055). |
| 8 | D054 | Take Part F's baseline from its start checkpoint, by the method that measures the end. | conduct | accepted | Done before the sections moved. |
| 9 | D058 | The slow forecast column paired a slow pace with a light report burden that nothing observed supports. | conduct | accepted | Four cells from two stated assumptions, and a latest start for the closing steps. |
| 9 | D058, D057 | Part G's comparison should be made across the change, not from the part's start. | conduct | accepted | Made across the transition. |
| 9 | D058 | The suite rule was stated two ways, and Parts E and F each ran four suites. | conduct | accepted | One rule: at most two named gates, a third only as a written exception. |
| 10 | D062 | A rolling reviewer could pair a diff of its named tree with later files from a changing checkout. | conduct | accepted | The review helper's brief tells the worker to read files from the named tree. |
| 10 | D062 | A part's second suite started beside the first and stopped at the same check. | conduct | accepted | The second suite starts only after the first passes. |
| 10 | D062 | Stale statements in the standing file and the handoff, including a figure that covered none of Parts C to H. | conduct | accepted | Removed or restated. |
| 11 | D067, D066 | Do not patch the duplicate-title rule a fifth time. | conduct | accepted | Rebuilt against a corpus whose registrations node gives. |
| 11 | D067 | A repair needs a counterexample through the real consumer that fails with the protection off. | conduct | accepted | Adopted as a rule. |
| 11 | D067 | Worker-use budget. | conduct | accepted | Cadences stop at 184 of 200, and the executor says so when the count passes 160. |
| 11 | D067 | The standing file lacked a snapshot of the part in hand. | conduct | accepted | Added. |
| 11 | D067 | The hours had no line for the backlog of reports. | conduct | accepted | Added. |
| 12 | D067 | Repairs to closed parts had no finite validation batch. | conduct | accepted | A named batch, written before it starts. |
| 12 | D067, D065 | Part I spent three designs inferring a fact its inputs do not carry. | conduct | accepted | Before a second heuristic repair, write down which observation decides the case and which fact is missing. |
| 12 | D067, D066 | A coverage claim should name the forms a test holds and the forms it does not. | conduct | accepted | The case and its corpus were reworded. |
| 12 | D067 | The standing file's current-state sections did not describe the present tree. | conduct | accepted | Rewritten. |
| 12 | D067 | The hours should count launches and time triage, repair and validation apart. | conduct | accepted | Recounted. |
| 13 | D068 | D065's rejection missed a bounded alternative: let the operator state the revision at publish. | implementation | accepted | `update --publish` takes `--from`. |
| 13 | D068 | The hours components summed to 291 minutes for a 183-minute interval. | conduct | accepted | The forecast uses whole-part durations, each labelled with its interval. |
| 13 | D068 | Decide the nine held notes before the closing ladder's first round. | conduct | accepted | Priced at 1 h 30 min; the closing's latest start moved earlier. |
| 14 | D070 | Two guard gaps were held for the close although the guards were in use. | conduct | accepted | D068's rejection reversed and the gaps repaired with one shared npm-line reader. |
| 14 | D069, D070 | The usage report priced a role's rows at the model of its latest attested event. | implementation | accepted | The model is tied to the session; rows that cannot be attributed print "model not attested". |
| 14 | D070 | Deferring process-debt hid a Part H failure for four hours. | conduct | accepted | A new module gets a whole process-debt run at its first draft, and process-debt is the first gate. |
| 14 | D070 | The standing file said Part J had not begun. | conduct | accepted | Rewritten, and again at each consequential change. |
| 15 | D072 | A falling session count was treated as a restart without reading what the producers do. | implementation | accepted | The producers were read; the figure is marked "fell" and the days are stated unknown. |
| 15 | D072 | The launchpad gate failure could have been avoided by searching for the neighbouring module's name. | conduct | accepted | Rule: search before the first gate. |
| 15 | D072 | The attacker fell due during a gate, and a gate rerun was started ahead of it. | conduct | accepted | A launch that falls due in a gate goes out before the next gate. D107 later corrected how this rule had been extended. |
| 15 | D072 | The standing file gave the held notes two placements. | conduct | accepted | One placement; the launch history cut. |
| 16 | D072, D069 | Withdrawing the defaults key reduces what the design promises, and that is not the executor's to settle. | conduct | accepted | Put to the operator; the handoff names it. |
| 16 | D072, D073 | The close sequence scheduled gates, records, then gates again. | conduct | accepted | One gate batch after the last repair. |
| 16 | D072 | The wide package-manager reading feeds a count, and a count is a statement of fact. | implementation | accepted | Policy written down (a count may be high, never low); no further extension without a corpus run. |
| 17 | D074 | Search every kit program for where the reserved root is read, and build the criterion 85 fixture before further work. | conduct | accepted | Done; it found the temporary-root scan. |
| 17 | D074 | The host observation should use the kit's actual emitted bundle. | conduct | accepted | Re-observed; three rules for fragments followed. |
| 17 | D074 | Stale state in the standing file, and a settled attack narrative kept there. | conduct | accepted | Rewritten; the narrative replaced by a reference. |
| 17 | D075 | The command-reader corpus needed its own estimate. | conduct | accepted | Estimated at 1 h 45 min; the latest start moved earlier. |
| 18 | D076 | An implementation difficulty was put to the operator as a scope question before the executor looked for a reading that keeps the requirement. | conduct | accepted | Rules on explaining the coupling first, and changing position only on a named fact. |
| 18 | D076 | Prove the host launch path before a redesign rests on it. | conduct | accepted | Four host runs, read from the host's own record. |
| 18 | D076 | The executor said further forms outside a heuristic's boundary would be answered by the boundary. | conduct | accepted | Withdrawn; the rule now counts and prints what it cannot read. |
| 18 | D076 | The standing file listed Part J as done and priced no reopened work. | conduct | accepted | Rewritten. |
| 19 | D077 | A due reviewer was held until the documents matched the code. | conduct | accepted | The cadence waits only for a live gate. |
| 19 | D077 | The operator's new instruction had to be planned and priced apart from the closing. | conduct | accepted | Priced at 4 to 9 uses and up to 3 h 45 min. |
| 19 | D077 | The copied-fixture check missed files copied by directory. | implementation | accepted | Follows static imports; two short declarations corrected. |
| 19 | D077 | The standing file's active block. | conduct | accepted | Rewritten. |
| 20 | D080 | Leaving two known defects as follow-ups and calling that a scope decision; only the operator can accept leaving a known defect. | conduct | accepted | Recorded as unresolved, awaiting the operator. |
| 20 | D080 | The four-model limit did not justify leaving the judge's models in launch code. | implementation | accepted | Rows and a judge worker added. |
| 20 | D080 | Another corpus file does not end the title rule's form-by-form growth. | conduct | accepted | Rule compared with node's registrations after the complete run (D081). |
| 20 | D080 | The standing file held three untrue statements and a contradiction. | conduct | accepted | Corrected. |
| 20 | D080 | The slowest forecast row left out the rebuild. | conduct | accepted | Ordinary work and rework written apart. |
| 21 | D082 | Two readings that both find no duplicate do not show full reading; compare by file. | conduct | accepted | Compared by file. |
| 21 | D082 | Build a matrix of forms before calling a screen repair complete. | conduct | accepted | A matrix of 7,812 readers, 1,406 misses; the screen now also judges a pattern by what it matches. |
| 21 | D082 | Start the complete run with `--keep-going`. | conduct | accepted | Done. |
| 21 | D082 | Rewrite the forecast by remaining part and drop the sentence the table does not support. | conduct | accepted | Done when the run ends. |
| 21 | D082 | The standing file suggested another session make the edit the host had blocked. | conduct | accepted | Withdrawn. |
| 22 | D084 | Run the comparison of the title rule with node before another complete run. | conduct | accepted | Run first; two blind files repaired. |
| 22 | D084 | Launch the overdue reviewer at the next boundary, not 45 minutes after a pass as the handover said. | conduct | accepted | Done. |
| 22 | D084 | Part L's map should name copying fixtures and generated outputs before its gates. | conduct | accepted | Done in D085. |
| 23 | D085 | The forecast had little margin and stood in two places. | conduct | accepted | One forecast governs. |
| 23 | D085 | The accidental gates were a failure of the probe's design: a set of files fit to read is not fit to run. | conduct | accepted | No rerun; the inventory is validated before any run, and a follow-up condition added. |
| 23 | D085 | D084 named the cause of a raised timing baseline without establishing it. | conduct | accepted | The figure is marked provisional. |
| 23 | D085 | The standing file held a superseded sequence beside the current one. | conduct | accepted | One sequence. |
| 24 | D087 | The hook's recognizer of the close helper was missing from the part's consumer map. | conduct | accepted | Admits the flag, with a case; the hook suite added as a gate. |
| 24 | D087 | The drive judged a merge by ancestry alone. | implementation | accepted | Resolved early, with step M1. |
| 24 | D087 | The standing file's cadence section held an old count and log. | conduct | accepted | Rules only; the count kept in one place. |
| 24 | D087 | Pre-gate checks were prose, and two gate starts did not follow them. | conduct | accepted | One scripted pre-gate sequence. |
| 25 | D089 | D087 left a match unresolved on an unchecked premise, and the close could delete the branch. | implementation | accepted | Exact confirmation; the counterexample run. |
| 25 | D089 | The hours had no count of worker uses against them. | conduct | accepted | A uses table at each part's close. |
| 25 | D089 | A held note was repaired without cause and its entry stayed on the held list. | conduct | accepted | Entry retired; rule restated on the list. |
| 26 | D091 | Limit (d) had no demonstrated end. | conduct | accepted | Run in four histories and kept as a case. |
| 26 | D091 | The standing file was stale. | conduct | accepted | Refreshed. |
| 26 | D091, D092 | Two readers kept yielding new spellings with no stopping condition. | conduct | accepted | A declared family and a written boundary before the next extension. |
| 26 | D091 | As-built records written before rechecks needed correcting records. | conduct | accepted | The as-built record is appended once, after the recheck and gates. |
| 27 | D093 | A prerequisite observed once was left as a light note and kept nowhere. | conduct | accepted | Probed, held by a case, and one sentence added to product 07. |
| 27 | D093 | Running every consumer file whole before gates was costly. | conduct | accepted | Narrowed to focused guarded cases; whole files only for a stated risk. |
| 27 | D093 | A reviewer was held 13 minutes on reasoning that was not checked. | conduct | accepted | Condition withdrawn. |
| 27 | D093 | Part M's timings predated D089's change. | conduct | accepted | Rerun on current code. |
| 28 | D097, D095 | The title rule grew by repair, without a contract or a comparison with a smaller rule, and the family files are no evidence for the scope classes. | conduct | accepted | Contract stated; 19 scope files added; extension ended. The smaller rule was weighed and not taken. |
| 28 | D097 | The case was never run on node 24. | conduct | accepted | Run; it failed; repaired. |
| 28 | D097 | The evidence script reran a long case to read one line. | conduct | accepted | Uses kept output. |
| 29 | D100 (D102) | Recast by D100 as conduct: the executor named a pairing hazard, wrote the opposite, and filed a record asserting the property without the case that tests it. | conduct | accepted in part | D098's sentence corrected and cases added. The critic's remedy (a call identifier on each row) was declined in D100, then adopted in D102 after an attacker's finding. |
| 29 | D100 | The consumer map's cases could not exercise the worked value. | conduct | accepted | The route exercised in the tests. |
| 29 | D100 | The reading's cost was unmeasured while consumers were built on it. | conduct | accepted | Measured (169 ms). |

## What the record does not establish

- **No critic's own words.** Every "point" is the executor's paraphrase in a decision. I read no report under the local control directory.
- **Critic 1 (D043):** the cap point (4) has no verdict word; it is answered as already handled by D041.
- **Critic 2 (D045):** "accepted in part" is my reading. The decision adopts the critic's two conditions but defends the stop. D046 later corrects that defence.
- **Critic 6 (D051):**
  - The decision gives no count of the sixth critic's points and no verdict words.
  - It pools "the fifth critic's and the sixth critic's reports" with five reviews into ten findings, but attributes only items (4) and (7) and three "other points" to the sixth critic.
  - Whether any of the ten findings came from the fifth critic beyond D049's race repair is not stated.
  - The wording of the three "not stated" rows is unclear about what the critic actually asked.
- **Critics 7 (D052) and 21 (D082):** neither decision uses a verdict word. I marked "accepted" because a change is recorded for each point.
- **Critic 29 (D100):** it is not stated whether the declined call identifier belonged to the first point or was a separate remedy. D102 reversed that decline.
- **Critic 31 (D106):** the four points are given only as short rules. Whether the decision's sentence on the binary's engine is part of point 4 is my inference; the critic README paraphrases it as an inference given to a worker as fact.
- **Critic 33:** recorded only in the standing file; no decision yet.
- **Borderline "kind" calls:**
  - 10's first point: the fix is a sentence in the review helper's code.
  - 13's first, 15's first and 25's first (labelled implementation): each also rests on a missed alternative or an unchecked premise.
  - 14's first (labelled conduct): a deferral judgment about code gaps.
  - 24's first and second: consumer-map omission against a code defect.
  - 26's first and 27's first: could be read as test or documentation gaps.
- **Critic 15's third point:** D107 says a rule held "since the fifteenth critic" was later corrected, and that rule (no gate while a worker is out) is broader than the point D072 records. Who widened it is not stated.
- **Critics 1 to 29:** these points were made under a brief that included the approach of the code (D040) and a status the executor wrote (D101), so they may reflect that framing.
