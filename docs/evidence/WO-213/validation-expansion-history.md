# WO-213 validation expansion: ideas, attempts and outcomes

This is the account a planning pass needs to understand the validation-system
expansion that WO-213 carried from 2026-10-16 to 2026-10-17 and then withdrew.
The operator added criteria 15 to 19 on 2026-10-16
([D039](decisions.md#wo-213-d039)); after four failed verifications the
operator directed on 2026-10-17 that every change related to them be undone
([D072](decisions.md#wo-213-d072)). The code is back to its bytes before the
expansion; this file keeps what was learned. Every figure names its source.
Gate wall times come from the rows of the local gate index
(`docs/control/local/harness/checks.json`, ignored, on the executor's host);
figures marked derived are sums or differences of those rows. Statements
marked inference are judgments, not observations.

## 1. What the operator wanted

Paraphrased from D039, D045, D046, D051, D052, D053, D065 and D071:

1. **No late bookkeeping failures.** A missing dependency declaration or a
   stale copied-fixture list must not first surface twenty minutes into the
   complete gate. Two such failures stopped consecutive complete review
   attempts on 2026-10-16
   ([D038](decisions.md#wo-213-d038): a copied CLI fixture missed
   `runtime-inputs.mjs`; [D039](decisions.md#wo-213-d039): `harness-fixtures`
   did not declare `scripts/lib/control-store.mjs`, found after 1,420.4 s
   and reproduced in about 19 s by the isolated coverage case).
2. **No paying twice.** Product 07's 2026-10-13 rule required each order's
   **Preflight:** suites to run one at a time before the first complete
   gate and again after each repair, and the complete gate then ran them
   again: in the operator's words, the full gate in effect ran twice. The
   operator asked for the complete gate to accept individual runs, or for
   the preflights to stop, or for a better third option.
3. **Fast failure feedback.** A touched suite should fail within minutes,
   not deep inside the complete gate, and the complete gate should remain
   the final check (D045, D052).
4. **Keep passes whose inputs survive a fix** (D052), and do not repeat
   unchanged work between executor and verifier (D071).

## 2. Starting point

- One code identity covers every non-document file
  (`gateCodeIdentity` in `packages/skeleton/src/gate-evidence.mjs`). A
  complete row at an identity could be reused at that same identity; a
  single-suite row could never supply a complete gate
  (`scripts/lib/gate-reuse.mjs`).
- Machinery suites declared their sources by hand (WO-174); one runner
  fixture checked those lists against direct imports, inside the expensive
  `runner-fixtures` suite.
- Fresh complete reviews took 2,263.0 s (2026-10-15T19:35Z) and 2,202.7 s
  (2026-10-16T00:01Z). The last pre-expansion preflight sweep (03:06 to
  03:21Z) ran nine suites in 842 s of task time, plus a 119 s document gate
  (rows; sums derived).

## 3. Timeline

| When (2026-10-16/17 UTC)        | Repair or report                                                  | Ideas adopted                                                                                                                                                      | Outcome                                                                                                                                 |
| ------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 04:20Z to 08:06Z                | Second repair, expansion part (D039 to D042)                      | Derive machinery sources and copied-fixture closures from source; refuse a bad task graph before any build; let single-suite passes supply the complete gate under an execution contract; make preflight optional | Complete review passed at 07:55Z (2,331.1 s, 2 of 104 tasks carried)                                                                   |
| 09:50Z to 11:18Z                | [VER-003](../../verifications/WO-213/VER-003.md) (D043)          | —                                                                                                                                                                  | Fail, criterion 17: no contract matched across sessions; a passing diagnostic displaced the standing complete row                      |
| 13:58Z to 17:51Z                | Third repair (D044 to D046)                                       | Bind exactly the environment the child receives, withholding session and output-only labels; targeted-first validation made required (D045)                       | Complete review passed at 17:45Z (1,689.1 s, 13 carried); targeted-first plus complete took about 67.5 min                              |
| 18:18Z to 18:30Z                | [VER-004](../../verifications/WO-213/VER-004.md) (D047, D048)    | —                                                                                                                                                                  | Fail, criterion 16: a partial pass plus a pass under another contract revived an old complete claim; product 07 over its byte ceiling |
| 19:24Z to 02:30Z                | Fourth repair (D049 to D066)                                      | Multi-suite `--only` through the complete scheduler; per-task input-bound reuse; a compiler-based input analyzer (removed by the operator in D065); declared bindings; first-failure stop | Complete review passed at 02:22Z (1,911.8 s, 12 carried)                                                                                |
| 03:01Z to 03:14Z                | [VER-005](../../verifications/WO-213/VER-005.md) (D067)          | —                                                                                                                                                                  | Fail, criteria 16, 17, 19: command paths spelled with `..`, `./` or `//` left a declared entry unbound and a stale pass was carried     |
| 03:16Z to 06:08Z                | Fifth repair (D068)                                               | Read commands only in exact known shapes; widen the import closure                                                                                                | Complete review passed at 06:04Z (1,395.7 s, 12 carried)                                                                                |
| 11:28Z to 12:07Z                | [VER-006](../../verifications/WO-213/VER-006.md) (D069 to D071)  | —                                                                                                                                                                  | Fail: loader aliases bound nothing (stale pass); a lifecycle projection file and ordinary environment differences invalidated unchanged work |
| 12:13Z onward                   | This repair (D072)                                                | Undo criteria 15 to 19 at the operator's direction                                                                                                                | Code restored to its pre-expansion identity plus one declaration                                                                        |

## 4. The approaches in detail

### A. Derive dependencies from source (D040, D041)

`deriveMachinerySources` in `scripts/lib/machinery-coverage.mjs` walked
each machinery suite's entry files, transitive relative imports and literal
first-party script paths; hand declarations fell from 307 to 52 with none
lost (`source-declaration-comparison.json`). `scripts/lib/module-fixtures.mjs`
let a copied fixture name its entry points and derived the module closure.
`validateTaskGraph` refused missing or cyclic task dependencies before any
build. **What held:** every verification judged criterion 15 met; the D038
and D039 classes of omission were found automatically. **What failed:** the
shell-literal scanner fed a shell comment to the JavaScript lexer and stalled
a complete gate in admission (D064); a later literal-word change broke suite
selection (D068).

### B. Carry task results at the same identity under an execution contract (D040, D041)

`taskExecutionDigest` in `scripts/lib/suite-evidence.mjs` hashed the Node
runtime, the filtered child environment and the task declaration;
`boundSingleSuite` let `suite:<name>` rows supply tasks to a complete gate.
An independent review (D041) added environment, context, build-output and
invocation binding. **What failed (VER-003):** the contract bound host and
terminal labels, so 0 of 104 executor contracts matched the verifier's; a
passing diagnostic under another contract displaced the standing complete
row, and restoring the claim cost a 37.5-minute gate. Inside one session the
split was `npm test --silent` setting `npm_config_loglevel` (found by
instrumentation in D044, not by the earlier explanation).

### C. Bind exactly the child's environment (D044, D049)

Session, resident, terminal and npm output-only names were withheld, PATH
entries resolved to their real directories, a keyed host digest explained
each task not carried, and displacement returned to the base rule with one
bound. **What failed (VER-004):** a confined partial pass under one contract
and an ordinary pass under another revived an old complete claim, because
two histories classified the same partial row differently. Each transition
had a test; the combination did not.

### D. Targeted-first validation (D045, D046, D051, D058, D060, D062, D066)

The operator first made targeted runs required and first, expecting carried
passes to make them free; measured serially, targeted-first plus complete
took about 67.5 min against 37.5 to 51.0 min for one fresh complete gate
(D046, rows). D051 then ran the targeted set as one multi-suite `--only`
through the complete gate's scheduler. Integration problems followed: the
bounded wrapper buffered status lines until the end (D058), its 900 s cap
applied to the whole multi-suite run (D060), nested concurrency tests ran
under a one-lane parent (D062), and the first-failure stop had about ten
gaps (D066).

### E. Per-task input-bound reuse through static analysis (D052 to D057, D064)

A compiler-based analyzer (`scripts/lib/task-input-analysis.mjs`, never
committed, so no ref holds it) followed arguments through wrappers,
re-exports and callbacks and hashed the files a task reads. Probes and
reviewers produced about two dozen unsafe-key counterexamples (aliasing,
mutation, inherited options, generated or prerequisite-produced inputs). On
the real selection it bound **0 of 96 tasks**: 62 met a shell or subprocess
boundary, 27 its work limit, 1 its size limit, 2 had no static entry
(`input-binding-coverage.json`). Its fallback marked tasks not reusable, so
no preflight pass could reach the complete gate
(`input-binding-carry.mjs`). The operator removed it (D065).

### F. Declared bindings (D065, D067)

A suite that declared its inputs was bound by them, its entries' import
closure and the runner's own sources; an undeclared suite was bound by the
whole code identity. **What failed (VER-005):** the command reader silently
dropped entry spellings with `..`, `./` or `//`, so a changed entry exiting
13 was carried and both claim readers accepted it.

### G. Exact command shapes and a wider closure (D068)

Commands were read only in known shapes; anything else ran fresh; the
closure widened to more module kinds and every file a module names by a
literal. **What failed (VER-006):** `createRequire` aliases and
URL-encoded `import()` targets bound nothing (stale pass, V6-F1), and the
wider closure pulled `docs/control/current.md` into all four declared
bindings, so lifecycle projection writes invalidated unchanged work (V6-F2).

### H. Environment in every contract (carried from B and C)

**What failed (VER-006, V6-F3):** ninety task contracts were rejected for
ordinary executor-to-verifier differences (`GIT_EDITOR`, `GIT_PAGER`,
`LC_ALL`, `LC_CTYPE`, `PATH`); the same five names had already appeared at
VER-004. The verifier's rerun was stopped after 1,506.0 s.

## 5. Measurements

Complete `npm test -- --review` runs (fresh/carried tasks):

| Recorded (UTC)   | Context                              | Wall      | Fresh/carried | Result                             |
| ---------------- | ------------------------------------ | --------- | ------------- | ---------------------------------- |
| 10-15 19:35      | before the expansion                 | 2,263.0 s | 102/0         | pass                               |
| 10-16 00:01      | before the expansion                 | 2,202.7 s | 103/0         | pass                               |
| 10-16 04:17      | attempt that prompted D039           | 1,420.4 s | —             | stopped, no row                    |
| 10-16 07:02      | second repair                        | 2,286.7 s | 102/2         | fail (wo107-schema, D042)          |
| 10-16 07:55      | second repair                        | 2,331.1 s | 102/2         | pass                               |
| 10-16 10:56      | VER-003                              | 2,248.3 s | 104/0         | pass                               |
| 10-16 15:59      | third repair                         | 3,062.8 s | 101/3         | pass                               |
| 10-16 17:45      | third repair                         | 1,689.1 s | 91/13         | pass                               |
| 10-16 22:57      | fourth repair, analyzer stall (D064) | 428.4 s   | —             | stopped, no row                    |
| 10-17 02:22      | fourth repair                        | 1,911.8 s | 92/12         | pass                               |
| 10-17 about 05:40 | fifth repair, under bounded wrapper | 893.1 s   | —             | killed at the 900 s cap, no row    |
| 10-17 06:04      | fifth repair                         | 1,395.7 s | 92/12         | pass                               |
| 10-17 about 11:40 | VER-006 rerun                       | 1,506.0 s | —             | stopped, no row                    |

- **Success-path cost (derived):** fourth repair 1,409 s targeted plus
  1,912 s complete (about 55 min); fifth repair 1,003 s plus 1,396 s (about
  40 min); one fresh complete gate before the expansion took about 37 min.
- **Carried work:** at most 12 or 13 of 104 tasks were ever carried from a
  targeted run. Nine targeted suites read documents and always ran fresh
  by design. The complete gate's critical path ran through tasks nobody
  carried: at 06:04Z it was 1,392.1 s of 1,395.7 s, through launchpad
  (290 s, holding all four lanes), skeleton (252 s), and the vertical files
  (464 s and 352 s, run two at a time).
- **Document gate:** 32 rows between 10-16 06:24Z and 10-17 11:39Z, each 35
  fresh tasks, passing runs 106 to 173 s (about 3,780 s in all, derived).
- **Stopped runs:** about 1,708 s of stopped targeted attempts in the fourth
  repair alone recorded nothing and supplied nothing (D058, D059, D060,
  D064).
- **Total recorded gate wall time across the expansion:** about 8.9 hours
  (derived).
- **Review load:** four verifications, all failed, with six blocking
  findings (V3-F1, V4-F1, V5-F1, V6-F1, V6-F2, V6-F3) and one nonblocking
  (V4-F2); 17 worker admissions in the repairs, roughly 179 overlapping
  reviewer observations; verifier token counters 23.5M (VER-003), 5.1M
  (VER-004), 5.8M (VER-005) and 19.0M (VER-006), from the reports.

## 6. The pattern

Every binding change swung between two errors (inference from the findings
above):

- **Too narrow, a stale pass admitted:** V4-F1 (partial pass), V5-F1 (path
  spellings), V6-F1 (loader aliases) and the analyzer's counterexamples.
- **Too broad, unchanged work invalidated:** V3-F1 (session labels and npm
  spelling), V6-F2 (a projection file in the closure), V6-F3 (ambient
  environment).

Fixes on one side caused the next failure on the other: D041's full
environment binding led to V3-F1 and later V6-F3; D068's wider closure led to
V6-F2. Each rule inferred a task's inputs from outside the process, while the
integration suites read Git state, installed tools and live records (D061).
The runner and binder under test were also the tools recording the evidence
that judged them (VER-006).

## 7. Lessons and assumptions that proved wrong

1. **Carried task time is not wall time saved.** The complete gate's critical
   path was made of tasks nobody had touched; carrying 12 tasks barely moved
   it (D051 states this after the D045 assumption failed).
2. **Whole-code identity makes every fix restart everything.** Code changed
   between nearly every run, so most targeted rows carried nothing; even a
   guidance edit, being code, invalidated a green 51-minute gate (D046).
3. **Binding more is not safer.** Over-binding stopped reuse entirely and,
   combined with displacement, lost a standing claim (VER-003).
4. **A sound static analysis stops at child processes,** which every
   integration suite starts; a six-second coverage probe would have shown
   that before three and a half hours were spent (D065; timing inference).
5. **A safe fallback can defeat the goal:** "not reusable" blocked even the
   same-identity carry the base already had (D065).
6. **Route-by-route fixing does not converge.** Each review found a new
   spelling or loader route; a parser that drops what it does not recognise
   fails open (D067, D068, D069).
7. **Separately tested transitions fail in combination;** one shared
   eligibility predicate with tests of sequences was missing (VER-004).
8. **Cheap checks ran too late.** D039's omission, D059's Git-screen hit
   (reproducible in 119 ms) and D062's configuration-root failure each
   surfaced inside a run of 20 minutes or more.
9. **Test the boundary the operator sees:** the real wrapper's live output,
   a clock that matches the work, and the parent's lane reservation (D058,
   D060, D062).
10. **Diagnose before explaining:** three explanations had to be corrected
    (D051, D059, D064), and instrumentation found the npm `--silent` split
    that reasoning had attributed to session labels (D044).
11. **Stopped runs record nothing,** so their work is lost however close they
    came.

## 8. Candidate directions for planning

All of these are inferences with their motivating evidence; none is decided.

1. **A structural phase that runs in seconds before any suite** (the D065
   follow-up, FUP-92bdaad7521fd511): run the policy screens and declaration
   checks first. Evidence: lesson 8. Risk: a second list to keep in sync; a
   green structural phase mistaken for coverage.
2. **One command that regenerates every safely derived artifact** (also
   D065): the decisions and work-order indexes, harness snapshot,
   publication locks and role oracles, naming those policy keeps manual
   (baseline fingerprints, evidence editions). Evidence: authority re-mints
   (D040, D041, D063), lock refreshes (D050), the role oracle (D046). Risk:
   regeneration launders unintended drift.
3. **Cut complete-gate wall time directly:** the critical path in section 5
   (launchpad's exclusive lanes, skeleton, the vertical files two at a time).
   Risk: isolation and peer caps exist for memory and contention reasons
   (criterion 13's history); trimming cases loses coverage.
4. **Drop the separate preflight, or run it only when the structural phase
   cannot be trusted.** Evidence: targeted plus complete cost 40 to 67 min
   against about 37 for one fresh gate. Risk: the complete gate becomes the
   first detector again unless direction 1 replaces the preflight's purpose.
5. **Hermetic, content-addressed tasks** (declared inputs made available to
   the task, a fixed environment, undeclared reads failing) instead of
   inferred bindings. Evidence: section 6; `scripts/lib/product-read-guard.mjs`
   already observes Node file reads and could check declarations against
   actual reads, though not reads by Git or shell children (not verified
   beyond reading the source). Risk: the largest redesign; an incomplete
   sandbox repeats the stale-pass class.
6. **A controlled task environment** in place of binding the ambient one.
   Evidence: D043, D044, D047, D071. Risk: hides genuine host-dependent
   behaviour and needs pinned tool paths.

## 9. Where the material is

- **Code of each attempt:** `refs/dotln/checkpoint/WO-213/16` (end of the
  second repair), `/20` (third), `/24` (fourth), `/28` (fifth) and `/31`
  (immediately before the undo). The pre-expansion tree D072 rebuilt is
  object `a69240cca9f81959ee365c83766f6e51cbc1f2df`; the analyzer of
  approach E is in no ref.
- **Decisions:** [D039](decisions.md#wo-213-d039) to
  [D071](decisions.md#wo-213-d071), and [D072](decisions.md#wo-213-d072) for
  the undo.
- **Reports:** [VER-003](../../verifications/WO-213/VER-003.md),
  [VER-004](../../verifications/WO-213/VER-004.md),
  [VER-005](../../verifications/WO-213/VER-005.md),
  [VER-006](../../verifications/WO-213/VER-006.md).
- **Evidence:** [input-binding-coverage.json](input-binding-coverage.json),
  [source-declaration-comparison.json](source-declaration-comparison.json),
  [cli-task-composition.json](cli-task-composition.json),
  [independent-review-repair004.md](independent-review-repair004.md),
  [ver004-failure-mask.json](ver004-failure-mask.json) and
  [ver006-probes.json](ver006-probes.json). The retained probe scripts
  (`input-binding-*.mjs`, `ver005-*.mjs`, `ver006-*.mjs`) import modules the
  undo removed; they document what was run and no longer execute against
  the current code.

## 10. Fixes of older behaviour withdrawn with the expansion

Three changes made under the expansion's authority also corrected behaviour
that predates it. D072 withdrew them with the rest and routed them to
planning:

- **wo107-schema under memory pressure** (D042): two watchdog fixture cases
  refuse before spawning when the host's health sample reports pressure 2;
  the withdrawn change controlled that sample inside the test process.
- **Import-reader lexer progress** (D064): the pinned TypeScript scanner can
  stop advancing on shell text or malformed JavaScript; latent while the
  only machinery shell entry, `scripts/test-fixture-temp-root.sh`, has no
  comment.
- **Future-dated task finish** (D055): ordering by finish time lets an
  execution with an impossible future finish outrank a later failure.

## 11. This undo

The operator's choice was criteria 15 to 19 only, keeping criteria 1 to 14
and every repair made before the expansion. The rebuilt pre-expansion code
matched the recorded identity exactly; one declaration (D039's rejected
NoOp) was added. Seventeen read-only workers then ran: thirteen verifiers
found no criteria 1 to 14 behaviour, pre-expansion repair or instance fix
lost, and named the withdrawn fixes of section 10 and the stale records to
correct; four researchers assembled this account.

The restored flow then ran as the 2026-10-13 rule requires, at code identity
`b407908294cb66bc8010ab8dea5f66095dde8971cecb2b1e2d6236640b9efcf3`:

- the order's nine Preflight suites plus `runner-fixtures`, `launchpad` and
  `launchpad-planning`, one at a time under the bounded wrapper, all passed
  between 12:36:08Z and 13:17:07Z (2,120.2 s of suite time over twelve rows,
  derived; `target-worktree` alone 597.3 s);
- one fresh `npm test -- --review` passed 46 suites and 103 tasks with no
  failure in 2,976.3 s (recorded 14:06:48.986Z), longer than the earlier
  fresh gates of section 2. Its critical path of nineteen tasks included
  launchpad, worktree-integration, harness-fixtures, process-debt, skeleton,
  runner-fixtures and two vertical files; its longest tasks were
  target-worktree (668.4 s), two vertical files (573.3 s and 557.6 s) and
  launchpad-planning (444.5 s).

So the restored flow paid about 85 minutes of gate time for one clean pass
(derived), and nine of the twelve preflight suites ran a second time inside
the complete gate (all but docs-check-fixtures, docs-check and plan, which the
review selection does not include); that double cost is the problem this
account leaves to planning.
