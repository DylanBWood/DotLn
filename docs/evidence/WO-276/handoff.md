# WO-276 handoff (written a part at a time, and the repairs of VER-001 through VER-004)

WO-276 (the queue lands as one order) runs on branch `wo-276` over `main` at
`0097fcac6`. Release target: v1.0.0, a major release by the operator's
naming and a minor one by its content; it was v0.123.0 until 2026-11-11
([D005](decisions.md#wo-276-d005), [D073](decisions.md#wo-276-d073--this-orders-release-is-v100-and-the-roadmaps-teammate-ready-rung-is-v200-on-the-operators-word)). The branch has no commits; it commits at
final review. This file gains one row and its criterion lines at each part's
end ([D013](decisions.md#wo-276-d013--the-handoff-is-written-a-part-at-a-time-beside-the-standing-file));
a line written at a part's end is a judgment at that part's checkpoint.
Step Z3 judged them on the final candidate in this sense, and no further:
every suite that holds a line's cases ran in the order's tenth complete run
on the final tree and passed, and the document gate ran after the last
document edit; the executor did not read each earlier line against the
source a second time ([D121](decisions.md#wo-276-d121--the-tenth-complete-run-passes-on-the-final-candidate-and-how-step-z3-judges-the-handoffs-lines)).
The repair of VER-001 judged them again on the repaired candidate in the
same sense: the order's eleventh complete run passed on it, and the repair
changed the comment check, its cases and the records named in its row below.
The repair of VER-002 judges them once more, in the same sense, on the
candidate it leaves: the lines of the ten criteria that report reopened are
rewritten below with what now holds each, and the other lines stand on the
complete run and the document gate named under criterion 133.
The repair of VER-003 judges them again in the same sense: the lines of the
three criteria that report reopened (17, 18 and 25) and the line of
criterion 26 gain what now holds each, and the other lines stand on the
complete run and the document gate named under criterion 133.

The repair of VER-004 carries forward VER-004's 130 met judgments and the
three recorded criterion contradictions (51, 121 and 123). The cleanup
authority finding is repaired with the evidence below. Its current complete
run passed all 48 suites and 125 fresh tasks. The unrelated intermittent
discovery timeout is deferred, on the operator's direction, to FUP-27ff5c4e26de1675
([D151](decisions.md#wo-276-d151--the-complete-run-passes-the-operator-defers-the-discovery-timeout-to-a-follow-up-fix)); a passing rerun is not claimed to fix it.

The repair of FINAL-001 (2026-11-14) answers the final review's nine
blocking findings, each repaired as the class it names with the rule the
repaired code holds and a case the report did not quote: criteria 25, 28
and 98, which that report judged unmet, are met again on the evidence
their lines below now name, and the lines of criteria 3, 20, 21, 59, 74 and
76 gain what the repair changed or what the report's follow-ups asked of
this file. The repair also takes the report's follow-ups that WO-276-D163
and WO-276-D164 give it and boards the rest
([D177](decisions.md#wo-276-d177--what-the-repair-of-final-001-takes-of-the-reviews-follow-ups-what-it-boards-and-the-provenance-records-reader-beside-f3)).
On the operator's directions at its start, it runs the order's meta critic
on its clock and a full review ladder of Opus 5.5 workers in place of the
one combined review a repair runs
([D165](decisions.md#wo-276-d165--the-operators-directions-at-the-start-of-the-repair-of-final-001-the-astra-meta-critic-on-its-clock-with-its-findings-kept-a-full-review-ladder-of-opus-55-workers-at-the-end-and-a-worker-cap-of-50)).

The repair of VER-006 (2026-11-14) answers that report's one blocking
finding, the criteria reader's class left open after FINAL-001's F52, and
carries forward its 130 met judgments and the three recorded
contradictions. The lines of criteria 25, 27 and 133 gain what this repair
changed and the gates it ran, and criterion 26's line names the feedback
edition the check now reads; the others stand on the complete run and the
document gate named under criterion 133.

Read first:

- The repair of [VER-006](../../verifications/WO-276/VER-006.md) closes
  the criteria reader's class for a list that skips a number. The shared
  refusal had looked only for the next number after the last item read, so
  a swallowed 3 after a 1 went unseen and every reader returned the prefix
  ([D192](decisions.md#wo-276-d192--the-repair-of-ver-006-a-criteria-list-is-refused-where-a-block-holds-an-item-numbered-as-none-before-it-was-not-only-where-it-holds-the-next-number)).
  The refusal is now held to the line reader the lifecycle used before the
  shared parser. Under the criteria, a line another block holds that opens
  an item refuses the list whatever its number (skipped, falling or
  repeated), a wrapped fence's lines included. After a wrapped line the
  parser takes for a heading or a label, the same holds up to the next label
  or heading at the margin. After a label the author set at the margin, only
  the next number refuses, so prose after a complete list reads as before.
  The repair's combined review found the wrapped fence, refusals of such
  prose in the first version of this repair, and a repeated number; each is
  closed, and D192's statement that its rule refused the same lines as
  before is corrected
  ([D193](decisions.md#wo-276-d193--correction-wo-276-d192-said-the-rule-refused-the-same-lines-as-before-on-a-list-numbered-one-by-one-and-that-the-formatter-keeps-prose-wrapping),
  [D194](decisions.md#wo-276-d194--the-repairs-combined-review-a-wrapped-fence-prose-after-a-complete-list-and-a-repeated-number-each-closed-by-holding-the-refusal-to-the-line-readers-items)).
  The case holds the report's three shapes, ten more that checkpoint 97 read
  short with no refusal, fourteen that read as main read them, and the
  handoff, the report claims, the mission contract, the index screen and
  the filing. The comparison over every committed order reads as before.
  One shape stays read short as main read it: a group's label at the margin
  after which the numbering skips. The report's follow-up stays on
  FUP-fd53a36c83596313 with its cause diagnosed (D192).

- The repair of [FINAL-001](../../final-reviews/WO-276/FINAL-001.md)
  answers its nine blocking findings. All nine of the review's probes were
  run on the repair: seven show the defect gone (rebase-reuse, the terms
  cost, the dollar fields, the unread refusal, the presence command, the
  verification order, and the walkthrough option, which the host now
  refuses by name); the coverage probe shows a row and a driver entry for
  each of its seven readers; and the criteria probe meets the reader's
  refusal of this order as it was filed, naming line 3407 and criterion 79
  on line 3410, which is the repaired behavior, so it prints no count. A close took one base commit for two of a
  branch's (F1, [D167](decisions.md#wo-276-d167--the-closes-rebase-rule-takes-one-base-commit-for-each-of-the-branchs-commits-in-the-branchs-order)); the terms
  screen's search multiplied on number-led lines (F2, [D168](decisions.md#wo-276-d168--the-local-terms-search-goes-on-only-while-its-candidate-begins-an-entry-and-reads-each-of-its-states-once)); a
  label inside inline math opened no field (F3, [D169](decisions.md#wo-276-d169--a-label-that-opens-a-line-inside-a-span-the-parsers-extensions-read-as-one-node-opens-its-field)); a refused
  mission check recorded no launcher (F4, [D170](decisions.md#wo-276-d170--a-resident-that-holds-no-reader-of-mission-documents-records-the-checks-failure-as-documents-unread-and-the-hold-names-the-launcher)); the cards
  were read inside the store's lock (F5, [D171](decisions.md#wo-276-d171--the-resident-store-reads-the-work-order-cards-before-it-takes-its-append-lock-and-the-launchers-card-command-has-a-time-bound)); the walkthrough
  passed a removed option (F6, [D172](decisions.md#wo-276-d172--the-resident-host-refuses-an-option-it-does-not-read-and-the-live-walkthrough-hands-over-the-card-source)); six moved readers
  had no comparison, and the screen and census the repair added found five
  more (F7, [D173](decisions.md#wo-276-d173--ten-moved-readers-gain-their-comparisons-the-inventorys-screen-is-run-again-with-the-marker-comment-form-and-a-census-of-the-shared-readers-callers-holds-every-mover)); verification ran the
  instance's code before the runtime check, and so did an update's plan
  (F8, [D174](decisions.md#wo-276-d174--kit-verification-and-an-updates-plan-compare-every-carried-compiled-runtime-file-before-any-of-the-instances-code-runs)); and the criteria reader
  returned a shorter list after a raw HTML block (F52, [D175](decisions.md#wo-276-d175--a-criteria-list-the-parser-reads-as-shorter-than-written-is-refused-by-every-reader-of-it-and-never-returned-shorter)).
  Three changed expectations are named with their cause in those
  decisions: the criterion B4 case's inline-math entry (D169), the WO-275
  mission case's failure code (D170) and the actor tests' host options
  (D172). The whole comparison driver was run again on the repaired readers
  ([D176](decisions.md#wo-276-d176--the-whole-comparison-driver-run-again-on-the-repaired-readers-names-every-difference-and-moves-no-recorded-comparison)), and the judged sources' edit
  owed a live feedback episode, recorded as edition 008, and the ladder's
  first round's repairs another, recorded as edition 009. The review
  ladder's first round found eleven more, five of them in a criterion's
  class (a label or a heading read inside the criteria list, a label in a
  strikethrough, a link between two dollar figures, the criteria refusal
  recorded as a transport fault at a mission check, and a refusal broader
  than the defect), each closed as its class with a case
  ([D178](decisions.md#wo-276-d178--the-ladders-first-round-eleven-findings-from-three-reviewers-five-of-them-in-a-criterions-class-each-closed-as-its-class-with-a-case)).
  The parse entry now forms no extension span for any reader but the front
  page's guard, which asks for the parser's own reading by name
  ([D181](decisions.md#wo-276-d181--the-front-pages-guard-reads-the-parsers-own-reading-with-the-spans-the-parse-entrys-neutral-copy-had-taken-from-it-the-checks-before-the-second-round-found-it)),
  and the driver, run again and reconciled from its whole output, names
  the three readings that moved ([D180](decisions.md#wo-276-d180--correction-wo-276-d176s-reconciliation-compared-60-of-the-79-comparisons-the-run-after-the-ladders-first-round-is-reconciled-whole-and-its-three-new-differences-are-the-bases-math-extension), which corrects D176).
  The second round found two regressions the first round's repairs had
  left or made (a wrapped number-sign line followed by one more line, or a
  note, still hid the criteria after it; the neutral copy's bracket broke a
  link whose text opens with a bracketed word), each closed as its class
  with cases, and five lesser findings, all fixed
  ([D183](decisions.md#wo-276-d183--the-ladders-second-round-two-regressions-the-first-rounds-repairs-left-or-made-each-closed-as-its-class-and-five-lesser-findings)).
  The third, combined round found the criteria class still open where a
  second label or heading stands before the criteria go on; every block
  after the closing one is now read up to the first ordered list, a family
  of 32 generated shapes holds it (16 of them read short on that round's
  tree), and two lesser findings were fixed. These repairs came after the
  ladder's last round and no reviewer read them
  ([D185](decisions.md#wo-276-d185--the-ladders-third-round-the-criteria-class-closed-by-reading-every-block-after-the-closing-one-to-the-first-ordered-list-a-reading-wo-276-d183-rejected-on-a-reason-that-did-not-hold)).
  The first two complete runs failed on two consumers of the repair's
  changes, a seed case's pin of the first order's terms check and an
  integration fixture's clone of this order as filed, each repaired as its
  run's own; the third passed
  ([D187](decisions.md#wo-276-d187--the-closing-runs-the-first-two-complete-runs-failed-on-two-consumers-of-this-repairs-changes-each-repaired-as-its-runs-own-the-third-passed-and-main-had-not-moved)),
  the document gate then failed on a case of the shared reader that still
  asked for the span the parse no longer forms, and after its repair the
  fourth complete run and the document gate passed on the final candidate
  ([D188](decisions.md#wo-276-d188--the-document-gate-failed-on-a-case-the-parse-entrys-change-left-its-repair-moved-the-code-identity-and-the-fourth-complete-run-and-the-document-gate-passed-on-the-final-candidate)).
  Five critics ran on the operator's clock; the four that reported made
  eleven points, all accepted
  ([D186](decisions.md#wo-276-d186--the-forty-third-critics-three-points-a-reviewers-scope-narrowed-on-a-reason-not-checked-cheap-checks-run-late-and-a-cause-given-to-the-operator-before-its-code-was-read)
  and the decisions it lists).
- The repair of [VER-004](../../verifications/WO-276/VER-004.md) addresses
  its sole blocking finding: cleanup selected live command lines from the
  server installation. It now recognizes background command roles and a
  daemon-to-server-to-helper parent chain within one installed release.
  Live commands and unclassified installation processes prevent cleanup.
  Two new regression tests fail against checkpoint 77 and pass against the
  repair; the verifier's original probe also preserves both same-installation
  live CLI forms. The tests record signals without sending any. The temporary
  repository, outside-installation live-session and abandoned-server controls
  remain in the lifecycle suite. See
  [D148](decisions.md#wo-276-d148--recognize-background-roles-before-cleanup)
  and [the probe results](repair-ver004/independent-probes.json).
- [VER-003](../../verifications/WO-276/VER-003.md) found the ten repairs of
  VER-002 held and failed the candidate on three findings, each of them
  left by that repair: the snapshot stopped where a tracked directory had
  become a file (criterion 17, a regression against main); the screen left
  out a source named by its suffix alone directly under a root (criterion
  18); and four moved readers were held by a check of a generated page
  where criterion 25 asks for a comparison. Each is repaired as the class
  it names ([D137](decisions.md#wo-276-d137--the-repair-of-ver-003-the-snapshot-follows-a-tracked-path-whose-place-changed-shape-the-screen-asks-the-source-reader-what-is-source-and-every-reader-with-a-committed-input-is-compared)).
  Four things are worth a reader's attention before the criterion lines.
  The snapshot's class was wider than the report's case: a directory that
  became a link or a repository of its own failed in the same pass. The
  repair's review then found one more member, which neither report had
  quoted and which the repair of VER-002 had introduced: on a volume that
  folds case, a rename by case alone left both names in a snapshot, where
  main holds one. It is repaired, the pass now adding by name only what Git
  says an ignore rule matches, and the cases hold fifteen shapes
  ([D138](decisions.md#wo-276-d138--the-repairs-combined-review-seven-findings-judged-a-rename-by-case-alone-leaves-one-name-again-and-the-feedback-audits-row-is-compared)).
  The screen now asks the source reader what is
  source and keeps no copy of its rule, which edited a judged feedback
  source and was followed by one live episode (edition 006). Holding
  every row of the comparison map to the report's rule found three more
  readers with a committed input, and the review a fourth: one showed a
  difference no record had named (the capability table's row ids, a defect
  of the base's pattern) and one showed that a probe this order had
  migrated, `scripts/probes/wo242-controls.mjs`, imported a module that does
  not exist and could not load; it is repaired. And two things are carried
  to planning by follow-ups: a snapshot still holds a directory that is a
  repository of its own as main's did, by its commit and without its files
  (D137), and no gate holds a script's relative imports resolvable (D138).

- [VER-002](../../verifications/WO-276/VER-002.md) found the two
  regressions of VER-001 repaired and failed the candidate on eleven
  further findings: ten original criteria (17, 18, 21, 25, 64, 65, 101,
  103, 115 and 127) and one regression against main in the admission of an
  appended execution record. Ten are repaired in code, each as the class it
  names with the rule the repaired code holds and cases the report did not
  quote ([D131](decisions.md#wo-276-d131--the-repair-of-ver-002-ten-findings-in-code-each-closed-as-the-class-it-names)). The
  eleventh was missing evidence: Part B's reader comparisons were audited
  reader by reader and completed ([D132](decisions.md#wo-276-d132--the-reader-comparisons-are-audited-reader-by-reader-and-completed-and-what-they-found)).
  Three things that audit found are worth a reader's attention before the
  criterion lines. A recorded comparison, of the work orders' headers, no
  longer passed when rerun, and is repaired. The Execution-plan path reading
  differs from the base's on 28 orders, each a defect of the base's pattern.
  And the mission check's capsule now holds a wider objective clause on 55
  closed orders, and a thesis with its subsection: each follows from the
  order format's one reader and the shared section reader, each is named as
  a defect of the old reader with the evidence for that name, and the
  question the first raises, whether a label that wraps onto a second line
  should end a field, is carried to planning. VER-002's seven follow-up
  findings (F3 and F12 to F17) are not repaired here; they are carried to
  planning by D131's follow-up.
- [VER-001](../../verifications/WO-276/VER-001.md) failed the candidate on
  two regressions in the comment check, which Part B had moved onto the
  source reader's scanner: it skipped `.jsx` and `.tsx` comments, and read a
  valid regular expression after a conditional as a comment. The repair
  reads every comment the check judges from one syntax-tree batch of the
  source reader, refuses a selected file the reader cannot parse instead of
  skipping it, and counts lines at line feeds as main did
  ([D127](decisions.md#wo-276-d127--the-comment-check-reads-its-comments-from-one-syntax-tree-batch-so-every-admitted-extension-is-judged-and-a-regular-expression-is-never-a-comment),
  [D128](decisions.md#wo-276-d128--the-repairs-combined-review-six-findings-judged-the-line-count-it-broke-repaired-with-a-case-the-here-document-dialect-recorded-with-a-follow-up)).
  On the 691 code files the check reads, main, the judged candidate and
  the repaired check report the same 69 findings. On 21 regression inputs
  the repaired check equals main on 18. The other three are here-documents
  in other languages, read as modules, which the judged candidate already
  did; that difference is recorded and carried to planning as
  FUP-5d58f2b322fe5ff7
  ([repair-001/comment-reader-comparison.json](repair-001/comment-reader-comparison.json)).
  The verifier's records of criteria 51, 121 and 123 as contradictions
  stand as recorded, and their lines below are unchanged.
- The closing did not run the review ladder to its end. A round of four
  reviewers on one tree found three things, each repaired with a case
  ([D117](decisions.md#wo-276-d117--the-closing-ladders-first-round-three-findings-from-four-reviewers-on-one-tree-each-reproduced-and-repaired-with-a-case)); that round was not the paired measurement the order's
  header declares, and neither was the mid-order round, so the order
  records no paired round. The executor then stopped the two rechecks of
  those repairs and a properly launched paired round, six workers, on a
  misreading of the operator's message, and the operator directed the
  complete run ([D118](decisions.md#wo-276-d118--correction-the-closing-round-of-d117-was-not-the-paired-measurement-six-reviewers-were-stopped-on-a-misreading-of-the-operators-condition-and-the-order-goes-to-its-complete-run-on-the-operators-direction)). The three repairs, 211 lines added and 7
  removed in four files, were read by no reviewer. The ninth complete run
  failed three suites on expectations Parts M and Q had left stale; four
  expectation lines in three test files were changed, also read by no
  reviewer, and the tenth run passed ([D120](decisions.md#wo-276-d120--the-ninth-complete-run-failed-three-suites-on-expectations-this-orders-own-changes-had-left-stale-each-is-repaired-and-the-run-is-started-again), [D121](decisions.md#wo-276-d121--the-tenth-complete-run-passes-on-the-final-candidate-and-how-step-z3-judges-the-handoffs-lines)).
- The operator renumbered during the dispatch: this order's release is
  v1.0.0, and the roadmap's Teammate-ready rung, which was v1.0.0, is
  v2.0.0. The two queued orders that name the rung, WO-183 and WO-083, are
  left as filed and boarded for a planning pass, on the operator's word
  that the renumbering is no priority
  ([D073](decisions.md#wo-276-d073--this-orders-release-is-v100-and-the-roadmaps-teammate-ready-rung-is-v200-on-the-operators-word)).
- Part J's worker half was rebuilt after the part first closed, on the
  operator's direction of 2026-11-11, and the order's text for it was
  amended to match ([D077](decisions.md#wo-276-d077--worker-models-as-redesigned-on-the-operators-direction-models-are-rows-of-data-workers-are-names-an-instance-binds-to-them-one-resolver-and-two-commands-answer-every-launch-and-no-worker-definition-hook-or-sentence-names-a-model)). What a worker runs is one table of
  data: models are rows, an instance names any number of workers and
  binds each to a model, and one resolver with two commands (`npm run
  worker -- list` and `-- show <name>`) answers every launch. The two
  per-model worker definitions an earlier kit emitted are gone, no role's
  text names a model, and no dispatch line selects a worker. The fixed
  options, the restated option and the withdrawn defaults key of the
  first build (D069, D072) are superseded. Criteria 77 to 80 and 83 are
  judged below against the amended text. The part's attack pass then found
  eleven things, seven repaired and four recorded with a follow-up,
  and the order's Part J was amended a second time for what is left
  ([D078](decisions.md#wo-276-d078--part-js-rebuilt-half-closed-rolling-review-31-and-the-fifth-attack-pass-judged-the-host-probes-launch-the-default-worker-from-the-table-and-what-in-the-kit-still-writes-a-model-of-its-own-is-named)).
- Part K found something about the host that this order does not close.
  On Claude Code 2.1.322 a `PreToolUse` hook that returns a rewritten
  input has the rewritten call run without the kit's guards being shown
  it. The settings fragment of Part K therefore takes no hook under
  `PreToolUse`, nor under `SubagentStop` or `UserPromptSubmit`, which is
  narrower than the design's sentence that its hooks follow the kit's for
  each event. A hook in a settings file the kit does not write can still
  do it, which is boarded for planning
  ([D074](decisions.md#wo-276-d074--part-k-as-built-one-root-that-is-the-instances-by-guarantee-a-settings-fragment-that-only-adds-and-takes-no-pretooluse-hook-and-what-the-host-was-observed-to-do),
  [D075](decisions.md#wo-276-d075--part-ks-close-the-second-attack-pass-judged-the-two-gates-a-test-that-pinned-the-renamed-rung-corrected-and-the-command-reader-corpus-estimated-apart-from-the-closing-preparation)).
- The operator changed how this order is executed during the dispatch. A
  part is kept light: spot checks, the suites with the most signal and one
  review launch. The full review ladder and the complete run are paid once,
  at the order's end, with one exception before Part D
  ([D027](decisions.md#wo-276-d027--a-part-is-kept-light-spot-checks-the-suites-with-the-most-signal-one-review-launch),
  [D028](decisions.md#wo-276-d028--the-full-review-ladder-and-the-full-suite-run-are-paid-once-at-the-orders-end),
  [D029](decisions.md#wo-276-d029--before-the-gate-run-changes-a-complete-run-that-passes-whole-is-the-baseline)).
- The refusal of the host's question dialog was struck on the operator's
  direction: no step A10, and criterion 9 states what holds
  ([D012](decisions.md#wo-276-d012--the-refusal-of-the-question-dialog-is-struck-from-this-order-on-the-operators-direction)).
- The review helper gained `--part <letter>`, which no step names: the order
  is too large for a brief, and the design frame has each launch name its
  part
  ([D023](decisions.md#wo-276-d023--a-review-launch-names-the-part-whose-criteria-are-due)).
- The publish screens read each changed file as the commit holds it; they
  read the working copy before, so a refuse entry hidden in the working tree
  passed
  ([D024](decisions.md#wo-276-d024--each-of-criterion-a4s-eight-commands-has-a-case-in-both-modes-and-a-publish-screen-reads-the-bytes-it-pushes)).

## Parts

| Part | Began on | Ended on | Gate | Review | Decisions |
| --- | --- | --- | --- | --- | --- |
| The repair of VER-006 | recovery checkpoint 97 (`1555ae1ea`), tree `2cedbfbc07fe`, which holds the report; the tree VER-006 judged is `bba372e5ee2b` | the complete run's tree `5f3d9341a15c`, code identity `adba01dad241` | `npm test -- --review`, the first of this repair: 15:13 to 15:57 UTC on 2026-11-14, 48 suites and 125 fresh tasks, no failure or unrun task, 0 h 43 min; main and origin/main stood at `0097fcac6` at its start and its end. Before it, under the bounded wrapper: `scripts/test-derived-orders.mjs` 19 of 19, `scripts/test-plan-refutation.mjs` 182 of 182, the skeleton's mission-check file 21 of 21, the process-debt case that reads criteria by number, the comparison driver's five criteria comparisons, and the feedback, artifact, verification, authority and harness evidence checks. The closing document gate is recorded under criterion 133. | one combined review on the tree `7c4f4d621ae3`: found 7, two blocking; all fixed or corrected, the repairs counted as unreviewed | D192 to D194 |
| The repair of FINAL-001 | recovery checkpoint 87 (`4cd46dc66`), tree `b4e69a6ed6c9`, which holds the report | the complete run's tree `439c9397e568`, code identity `bdf0da6a025a` | `npm test -- --review --keep-going`, the fourth of this repair: 08:12 to 08:58 UTC on 2026-11-14, 48 suites and 125 fresh tasks, no failure or unrun task, 0 h 46 min. The first two failed, on a seed case's pin and an integration fixture's clone of this order as filed, each repaired as its run's own (D187); the third passed, and the document gate then failed on a case of the shared reader, whose repair moved the code identity (D188). Two live feedback episodes, editions 008 and 009 | a full ladder of Opus 5.5 workers on the operator's direction: round 1 three kinds (eleven findings), round 2 three fresh rechecks (seven), round 3 one combined worker (three); nineteen fixed and two recorded (D178, D183, D185). Four critics' eleven points, all accepted (D179, D182, D184, D186) | D165 to D187 |
| The repair of VER-004 | checkpoint 77, tree `3f40a7f55b27` | the complete run's candidate `d77e79bebde58`, code identity `469463787832` | `npm test -- --review --keep-going`, 20:56 to 21:53 UTC on 2026-11-13: 48 suites, 125 fresh tasks, no failures or unrun tasks, 0 h 57 min. The first run stopped after one discovery timeout; its follow-up is FUP-27ff5c4e26de1675. The closing document gate is recorded under criterion 133. | one combined review at checkpoint 81, tree `434e4612b5a1`: no findings; no later code changes | D148 to D151 |
| The repair of VER-003 | the tree at the repair's dispatch (`78a31bd5da2f`), which holds the report | the repaired candidate, the complete run's tree `ed720578c261`, held by `refs/dotln/checkpoint/WO-276/76` (`174c72ac2`) | The complete review run, `npm test -- --review --keep-going`, the order's seventeenth: 18:43 to 19:28 UTC on 2026-11-13, 48 suites and 125 fresh tasks, no failure, 0 h 45 min, at code identity `a4f05b44dc2a` (D145). Before it in this repair: the fourteenth failed two suites, neither on the repair's own change (D139); the fifteenth was stopped on the operator's direction while the file-events daemon held 15 GiB (D141); the sixteenth was stopped by the executor for a change to a file it was judging and held one failed case, since repaired (D143). Two live feedback episodes (editions 006 and 007) followed edits of judged files | one combined review by the default worker on Claude over the change from the dispatch's tree to tree `3e086f57d7ac`: seven findings, one blocking (a rename by case alone left both names in a snapshot, repaired with cases), six repaired in all and one recorded (D138); the thirty-sixth and thirty-seventh critics, eight points on the executor's conduct, all accepted (D141, D144); one research worker on the daemon's memory (D141) | D137 to D145 |
| The repair of VER-001 | `refs/dotln/checkpoint/WO-276/63` (`a64d9dec6`), the tree at the repair's dispatch (`a6811f85a332`), which holds the report | the repaired candidate, the complete run's tree `064f1e96abc4` | The complete review run, `npm test -- --review`, the order's eleventh: 02:05 to 02:55 UTC on 2026-11-13, 48 suites and 125 fresh tasks, no failure, 0 h 50 min, at code identity `4eac11312738`. Before it, under the bounded wrapper: `scripts/test-comment-labels.mjs` whole (12 pass), the declarations check, the publication check, the feedback evidence check (edition 005 judges the current source) and the comparison script | one combined review by the default worker on Claude, carrying the three briefs, over the change from the dispatch's tree to tree `2ff145387523`: six findings, one blocking (the line count, repaired with a case), one recorded with a follow-up (here-documents in other languages), one improvement added as a case (one start of the compiler's interface a check), and three notes, one corrected in the evidence and two recorded (D128) | D127, D128 |
| Z (the closing) | `refs/dotln/checkpoint/WO-276/52` (`90859a7ee`), Part R's records | `refs/dotln/checkpoint/WO-276/56` (`33a23cc02`), taken before the tenth complete run, whose row names tree `969687f5c086` | Step Z1's document gate passed at 21:34 UTC on 2026-11-12 on tree `ba23b11b642e` (D116). The complete review run, `npm test -- --review --keep-going`: the ninth, 22:33 to 23:23 UTC, failed `license-fixtures`, the export file of `launchpad` and the start file of `target-worktree` on expectations Parts M and Q had left stale, each repaired (D120); the tenth, 23:30 UTC to 00:26 UTC on 2026-11-13, passed: 125 tasks, 0 h 56 min (D121). The document gate after the handoff was written failed `plan` and `plan-refutation-current` at 00:39 UTC on an amendment's binding of D080, which the executor had edited in place; the decision is re-bound and the gate run again (D122), its passing row named under criterion 133 | rolling review 53 (design, round 20): no new finding, its note a repeat of rolling review 50's (D116); a round of four at 21:38 UTC, launched as rechecks and so not the paired measurement: three findings, two from the criteria worker and one from the combined worker, each reproduced and repaired with a case (D117, D118); two rechecks of those repairs and a paired round one of four, stopped unreturned at 22:18 UTC (D118); the thirty-fifth critic, three points on the executor's conduct, all accepted (D118) | D113 to D122 |
| R | `refs/dotln/checkpoint/WO-276/50` (`b5e11ea79`) | `refs/dotln/checkpoint/WO-276/51` (`e3d7a63a5`), the tree the gates passed on; the part's records (D112, criteria 126 to 132 and the standing file's close) are in `refs/dotln/checkpoint/WO-276/52`, taken with this row in it | Two suites as single gates, named at the part's opening (D109), started by the pre-gate sequence, the second only when the first had passed, on the first start, 2026-11-12 20:55 to 21:06 UTC: `plan-refutation` (0 h 3 min) and `resume` (0 h 4 min), both on tree `cb7145918655`. Before any gate the pre-gate checks stopped twice on the part's own files, at the configuration-root preflight and at the Git-surface check, and each was repaired; the sequence then ran once without a gate while the attacker rechecked and once with the gates. No start waited for a whole-change reviewer or the critic, and each waited for the attacker's returns (D107, D112) | four attack passes on the part (D063, D107): seven findings on steps R1 to R3, one on their repairs, four from a fresh attacker on steps R4 to R6 and two from its recheck, fourteen in all, each repaired with a case, two of them in part, their other halves declined (D112); rolling reviews 50 to 52 read parts A to Q while it ran: one note held from the first (D110), no finding in the others; the thirty-third and thirty-fourth critics, five points on the executor's conduct, all accepted (D111, D112); at the operator's request a research worker's digest of every critic's judged points, kept as a record for planning (D111) | D109 to D112 |
| Q | `refs/dotln/checkpoint/WO-276/48` (`0d4322a7f`) | `refs/dotln/checkpoint/WO-276/49` (`61501e13e`), the tree the gates passed on; the part's records (criteria 120 to 125 and the standing file as it stood at the close) are in `refs/dotln/checkpoint/WO-276/50` (`b5e11ea79`), since checkpoint 49 was taken before they were written (the thirty-third critic, D111) | Two suites as single gates, named before the batch (D104), started by the pre-gate sequence, the second only when the first had passed, on its fourth start, 2026-11-12 18:33 to 18:40 UTC: `compiler` (0 h 1 min) and `harness-fixtures` (0 h 6 min), both on tree `6cb1ea9c8f8f`. Since the operator's direction of 18:09 UTC no start waited for a whole-change reviewer or the critic (D107). The first start stopped at the document check and the second at a probe of the executor's own, neither reaching a gate; the third passed `compiler` and failed one existing case of `harness-fixtures`, which pins the bytes of the two worker profiles and which the part, adding two fields to a profile, had not run. Each is in D108 | two attack passes on the part (D063): five findings and, on the repairs and on steps Q4 and Q5, six more, seven repaired, three recorded as limits and one declined (D106); rolling reviews 47 to 49 read parts A to P while it ran: no findings in the first and the third, one note held from the second (D106, D108); the thirty-first and thirty-second critics, seven points on the executor's conduct, all accepted (D106, D108), and the operator's correction of the cadences (D107) | D104 to D108 |
| P | `refs/dotln/checkpoint/WO-276/45` (`05d26e6c3`) | `refs/dotln/checkpoint/WO-276/47` (`50c4d1044`) | Two suites as single gates, named before the batch (D098), started by the pre-gate sequence, the second only when the first had passed, on its third start, 2026-11-12 16:10 to 16:20 UTC: `harness-fixtures` (0 h 6 min) and `resume` (0 h 4 min), both on tree `91c55cc701ef`. The first start's `harness-fixtures` failed one existing case that passed in every run outside that gate and in the third start, its cause not established; the second start stopped at the document check on a path in the standing file (D103) | two attack passes on the part (D063): six findings and, on the repairs, five more, eight repaired and three recorded as limits (D102, D103); rolling reviews 44 to 46 read parts A to O while it ran: two notes held, and two findings on the title rule of criterion E1, each run against node first and repaired (D100, D103); the twenty-ninth and thirtieth critics, the second under a fixed charter that reads the session transcripts (D100, D101, D103) | D098 to D103 |
| N | `refs/dotln/checkpoint/WO-276/41` (`347b6f4ae`) | `refs/dotln/checkpoint/WO-276/42` (`a3034b1a4`) | Two suites as single gates, started by the pre-gate sequence, the second only when the first had passed: `target-worktree` (0 h 12 min) and `harness-fixtures` (0 h 5 min), both on tree `b9e0110d5cd6`, on the third start; two earlier starts of the first failed (D091). D089 had named `target-publish` as the second; it was replaced before any start (D091) | two attack passes on the part (D063): seven findings, all repaired, and on the repairs four more, three repaired and one recorded with a run of it; rolling reviews 38, 39 and 40 fell in it: none, two repaired, and three repaired after its close (D092); critics 25 and 26 fell in it, their seven points taken | D089, D090, D091 |
| O | `refs/dotln/checkpoint/WO-276/43` (`b7dedb4ff`) | `refs/dotln/checkpoint/WO-276/44` (`340025e6c`) | Two suites as single gates, started by the pre-gate sequence, the second only when the first had passed: `work-orders-fixtures` (0 h 1 min) and `launchpad-planning` (0 h 5 min, on tree `e1d48b572428`), on the third start of the second; its first two failed, neither on a case of the part (D096) | three attack passes on the part (D063): no finding on it; the same passes returned eighteen findings on the title rule of criterion E1, all repaired (D095); rolling reviews 41, 42 and 43 fell in it: one repaired (D094), none, and one already repaired when it landed (D097); critics 27 and 28 fell in it, their seven points taken | D093, D094, D095, D096, D097 |
| M | `refs/dotln/checkpoint/WO-276/40` (`6538aaf0a`) | `refs/dotln/checkpoint/WO-276/41` (`347b6f4ae`) | Two suites as single gates, named before the batch (D087), started by the pre-gate sequence, the second only when the first had passed: `target-worktree` (0 h 12 min) and `harness-fixtures` (0 h 6 min), both on tree `0ee590382a63` | two attack passes on the part (D063): eleven findings and, on the repairs, four more, with eleven repaired with cases and the rest left with their reasons; rolling reviews 36 and 37 (design, rounds 14 and 15) fell in it: one note each, the first repaired, the second held; critic 24 fell in it, its four points taken | D087, D088 |
| L | `refs/dotln/checkpoint/WO-276/39` (`9f86bc03c`) | `refs/dotln/checkpoint/WO-276/40` (`6538aaf0a`) | Two suites as single gates, named before the batch (D085), the second started only when the first had passed, 2026-11-12 04:02 to 04:15 UTC: `target-worktree` (0 h 11 min) and `docs-check-fixtures` (0 h 2 min). Two earlier starts of the first stopped in the structural phase, at the configuration-root preflight (a comment spelling a document root) and at the Git-surface check (two forms of `git clone`, since recorded). Before them, one process at a time under the bounded wrapper: the cases of criteria L1 to L4 and the count, the rule-record case and its document case, the evidence script, `bash scripts/test-resume.sh`, the process-debt and configuration-root files whole, and, for rolling review 35, the cases of criteria E1 and B1. `launchpad`, `resume`, `skeleton`, `compiler`, `harness-fixtures` and `runner-fixtures`, which the part or those repairs also touch, are left to the order's complete run (D027) | one attack pass on the part (D063): seven findings, all repaired with cases; rolling review 35 (criteria, round 14) fell in it: two findings on Parts B and E, both repaired; critics 22 and 23 fell before it (D084, D085) | D085, D086 |
| J, its worker half rebuilt | `refs/dotln/checkpoint/WO-276/29` (`07af4128d`) | `refs/dotln/checkpoint/WO-276/30` (`b72ca68a5`) | No suite as a gate: the operator asked for the full ladder and one complete run once this was done (D077), and that run judges the suites. Under the bounded wrapper, one process at a time, 2026-11-11 20:55 to 22:07 UTC: the review-worker, codex-continuation, process-debt, harness-probe, authority-probe, entropy-review and work-orders files whole, the compiler's harness file and the skeleton's entropy-reducer file whole, the configuration-root parent case, the update fixture's parent case and the export's host-election case, and the part's cases in the harness, refuter, drive and runner files; the evidence script; one live feedback episode (edition 004) for the import reader's new option | the two design reviewers and the synthesizer the operator directed (D077); the fifth attack pass on Part J, eleven findings, seven repaired and four recorded (D078); rolling review 31, two findings, both repaired; the nineteenth critic, four points taken (D077) | D076, D077, D078, D079 |
| K | `refs/dotln/checkpoint/WO-276/28` (`55e3fefde`) | `refs/dotln/checkpoint/WO-276/29` (`07af4128d`) | Two suites as single gates, named before the batch and run once on 2026-11-11 after the second attack pass's repairs (D075): `harness-fixtures` (19:30 UTC, 4 min 57 s) and `launchpad` (19:35 UTC, 9 min 39 s), each passed on its first start. Before them, one process at a time under the bounded wrapper: the docs-check, comment-labels, process-debt and configuration-root files whole, `bash scripts/test-resume.sh`, the evidence script, and the part's cases in the harness, target harness, target worktree, temporary-root and export files. `compiler`, `runner-fixtures`, `target-worktree`, `configuration-root` and `resume`, which the part's steps also name, are left to the order's complete run (D027) | two attack passes on the part (D063), eight findings each, one rated blocking: thirteen repaired with cases or corrected, three stated (D074, D075); rolling reviews 27 and 28; the seventeenth critic, whose map of every kit program that reads the root, with the export fixture of criterion 85, found a scan both the attacker and the executor had read as leaving the root alone (D074); seven runs of the host itself for the order's known issue | D074, D075 |
| J | `refs/dotln/checkpoint/WO-276/25` (`d7253d7de`) | `refs/dotln/checkpoint/WO-276/27` (`3a80df12b`) | Four suites as single gates, each started only when the one before had passed, in two rounds on 2026-11-11 (D069, D072). The first, 16:00 to 16:29 UTC: `process-debt` (0 h 3 min) and `harness-fixtures` (0 h 4 min) passed on their first start, and `launchpad` failed once, on an expected list of the build-free modules an export carries, and passed on its second start (0 h 9 min). The third and fourth attack passes and two rolling reviews then changed every one of those suites' files. The second, 17:31 to 17:56 UTC, each passing on its first start: `process-debt` (0 h 3 min), `harness-fixtures` (0 h 5 min), `launchpad` (0 h 10 min) and `runner-fixtures` (0 h 4 min), the last for three repairs in its file. Before each round of them, one process at a time under the bounded wrapper: the configuration-root, review-worker and process-debt files whole, the launchpad export file whole from the second round on, `bash scripts/test-work-orders.sh`, the part's cases in the harness, launchpad-update, plan-refutation, drive and docs-check files, the cases of criterion E1 and of Part H's attack, and the evidence script. The whole process-debt file, run first at 14:50 to find older cases pinning a shape the part changed, found six failures from four causes, each repaired before any gate (D070). `compiler`, `skeleton`, `plan-refutation` and `configuration-root`, which the part's steps also name, are left to the order's complete run (D027) | four attack passes on the part (D063): 8, 7, 7 and 4 findings, 26 in all, none rated blocking after the first pass, every one repaired or, for the `defaults` key that three of them broke, withdrawn (D069); rolling reviews 22 to 26 and critics 14 and 15, with two guards' held notes repaired on a critic's word (D070, D072); the cadences' intervals changed by the operator (D071) | D069 to D072 |
| I | `refs/dotln/checkpoint/WO-276/21` (`b03d25e3c`); its first code is `refs/dotln/checkpoint/WO-276/22` (`8f2d1a9fd`) | `refs/dotln/checkpoint/WO-276/24` (`7e6940dae`) | Three suites as single gates, each started only when the one before had passed, named before the batch with the third as a stated exception (D067), 2026-11-11 13:46 to 14:06 UTC: `launchpad` (0 h 10 min), `harness-fixtures` (0 h 6 min) and `runner-fixtures` (0 h 4 min) passed, each on its first start (a comment's wording in the launch recognizer changed after them). Before them, one process at a time under the bounded wrapper: the cases of criteria I1 to I6 and the evidence script; and, for the repairs to Parts A to H that the attack reports and the rolling reviews called for, the lineage, review-worker, outward-lint, retained-records and configuration-root files whole, the WO-276 cases of the docs-check, process-debt, sync, skeleton and launchpad-seeds files, `bash scripts/test-resume.sh` and `bash scripts/test-worktree.sh`. The first run of the resume script failed on its case table for the handoff's self-review line, whose reading a repair of Part B's attack had moved; the reading was restored and the script passed (D066). The declarations check named one file the process-debt suite's sources lacked; it was added. `docs-check-fixtures`, `skeleton`, `process-debt` and `sync-fixtures` are left to the order's complete run (D027, D067) | five attack passes on the part (D063): 8, 8, 7, 8 and 6 findings, 37 in all, 35 repaired with cases and two stated as limits (a rename by the instance; an over-count on purpose); the eight attack reports on Parts A to H (D064): 54 findings, 42 repaired, 2 stated, 8 held, 2 declined (D066); rolling reviews 15 to 20 and critics 11 and 12 (D067) | D062 to D067 |
| H | `refs/dotln/checkpoint/WO-276/20` (`606ce3a61`) | `refs/dotln/checkpoint/WO-276/21` (`b03d25e3c`) | Two suites as single gates, both named before the batch, 2026-11-11 10:45 to 10:59 UTC: `runner-fixtures` (0 h 3 min) and `launchpad` (0 h 7 min) passed on their second start; the first start of each stopped in the structural phase at the configuration-root preflight, which named the new entry's own derivation of the kit's root (D060). One live feedback episode (edition 003) ran before the checks of steps H3 and H5, whose file is a judged feedback source. The cases of criteria H1 to H9, the evidence script, the update file's two changed cases, the export file's listing case, the sync file's operator-commands case and the gate follow-up file's remedy case passed under the bounded wrapper; `process-debt`, `sync-fixtures`, `harness-fixtures`, `fixture-temp-root` and `launchpad-planning` are left to the order's complete run (D027) | none of its own; rolling reviews 13 and 14 fell in it: three findings, on Parts B, C and E, each repaired (D059, D061) | D059 to D061 |
| G | `refs/dotln/checkpoint/WO-276/19` (`edb0f3693`) | `refs/dotln/checkpoint/WO-276/20` (`606ce3a61`) | No suite of its own: the part changes no product source, its code having arrived with Part B's port and passed both of Part D's complete runs. Its evidence script (a fresh export through the launchpad fixture) and its new harness case passed under the bounded wrapper, and the document check passed, 2026-11-11 10:02 to 10:11 UTC | none of its own; critic 9 fell in it (D058) | D057, D058 |
| F | `refs/dotln/checkpoint/WO-276/17` (`637c4739d`) | `refs/dotln/checkpoint/WO-276/18` (`828374c11`) | Four suites as single gates, 2026-11-11 09:33 to 09:51 UTC: `process-debt` (0 h 3 min), `skeleton` (0 h 7 min), `harness-fixtures` (0 h 5 min) and `plan-refutation` (0 h 3 min) passed; the first start of `process-debt` stopped in its structural phase on stale authority evidence and one aborted publish dry run, neither in the suite (D055). The built skeleton and compiler test files, the gate follow-up file and the changed cases of the hook and process-debt files passed under the bounded wrapper; `compiler`, `harness-context`, `sync-fixtures`, `runner-fixtures` and `launchpad-planning` are left to the order's complete run (D027) | none of its own; rolling review 11 and critic 8 fell in it: one finding, on Part E, repaired (D054) | D054, D055 |
| E | `refs/dotln/checkpoint/WO-276/16` (`6ace4de2a`) | `refs/dotln/checkpoint/WO-276/17` (`637c4739d`) | Four suites as single gates, 2026-11-11 08:37 to 08:54 UTC: `runner-fixtures` (0 h 3 min), `target-publish` (0 h 2 min) and `console` (0 h 1 min) passed; `vertical` stopped once at its format preflight on an evidence script copied in unformatted, and passed when run again (08:45 UTC, 0 h 8 min). The cases of steps E1, E3 and E4 and the six end-to-end statement cases passed under the bounded wrapper; `skeleton`, `sync-fixtures` and `worktree-integration` are left to the order's complete run (D027) | none of its own; rolling reviews 9 and 10 and critic 7 fell in it: three findings, on Parts A to C, each repaired (D052) | D052, D053 |
| D | `refs/dotln/checkpoint/WO-276/9` (`8f2fca881`), then the repairs the baseline called for: its control ran on `refs/dotln/checkpoint/WO-276/12` (`65841c605`) | `refs/dotln/checkpoint/WO-276/15` (`43bef7438`) | Five complete review runs, 2026-11-11 00:59 to 06:59 UTC: one stopped and one failed before the control (three causes, D046), the control passed (03:20, 0 h 54 min), the first after run failed one suite on a race outside the part (D049), the second passed (06:17, 0 h 42 min). Single suites: `runner-fixtures` six times, once failing on that race's other step and once on a stale registry; `harness-fixtures` three times in succession with three shards; `target-worktree`; `worktree-integration` twice; `launchpad-planning`, `plan-refutation`, `process-debt` | none of its own; rolling reviews 3 to 6 and critics 1 to 6 fell in it, none found a defect in the part's code, and seven findings on Parts A to C are held for the step after its close (the standing file lists them) | D043 to D050 |
| C | `refs/dotln/checkpoint/WO-276/6` (`d35293a3f`) | `refs/dotln/checkpoint/WO-276/9` (`8f2fca881`) | Eight suites in series, 2026-11-10 23:46 to 2026-11-11 00:18 UTC: six passed, `harness-fixtures` among them; `plan-refutation` and `process-debt` failed one case each, repaired, the cases passing alone (D042) | none of its own: the rolling reviewers read the whole change from 00:21 UTC (D040) | D039 to D042 |
| B | `refs/dotln/checkpoint/WO-276/5` (`842803cda`) | `refs/dotln/checkpoint/WO-276/6` (`d35293a3f`) | Four suites, the document check, the terms task and the structural checks, 2026-11-10 22:13 to 22:40 UTC: `work-orders-fixtures` and `sync-fixtures` passed; `harness-fixtures` failed three cases and `docs-check-fixtures` two, on four causes, each repaired and its case passing under the bounded wrapper (D037); after the review's repairs, seven test files and the console's four pass (D038) | one combined launch: found 6; fixed 6; recorded 0 (D038) | D031 to D038 |
| A | `refs/dotln/checkpoint/WO-276/1` (`ee506c88f`) | `refs/dotln/checkpoint/WO-276/5` (`842803cda`) | Its whole Preflight line ran once, 2026-11-10 19:00 to 20:10 UTC: 17 suites passed; `plan-refutation`, `process-debt` and `launchpad` failed on three stale expectations, repaired, their cases passing under the bounded wrapper (D026) | one combined launch: found 3; fixed 2; recorded 1 (D030) | D002, D008 to D010, D014 to D026, D030 |

## Criteria

**Criterion 1:** met. (A1) `scripts/test-runner.test.mjs`, the case named for
criterion A1 and the document gate's terms-task case that reads the relayed
`CONTEXT` lines; `npm test -- --only runner-fixtures` passed (19:07 UTC). The
two streams of both branches are in
[part-a/terms-streams.json](part-a/terms-streams.json).

**Criterion 2:** met. (A2) `scripts/test-plan-refutation.mjs`, the check
named for criteria A2 and A3 (both sections, a mode word alone, a list
written before the sections); it passed inside the `plan-refutation` run of
19:09 UTC, whose one failure was another case (D026).

**Criterion 3:** met. (A3) The same check: three letters across a brace, a
pipe and a backslash do not match; a hyphen, a period, a space and a line
break do; a two-word entry across a quotation marker; an address and a host
and port match their own spelling
([D008](decisions.md#wo-276-d008--the-lists-two-classes-and-the-runs-a-match-joins-across-step-a1)).
After FINAL-001 (F2) the search for an entry goes on only while its
candidate begins one and reads each of its states once: the case named for
the bounded search holds a thousand number-led lines under an entry of
forty letters and two hundred lines that every numbered line can go on
beginning, and a match reached with a marker's number counted once [D168](decisions.md#wo-276-d168--the-local-terms-search-goes-on-only-while-its-candidate-begins-an-entry-and-reads-each-of-its-states-once).

**Criterion 4:** met. (A4) Each of the eight commands has a case in both
modes
([D024](decisions.md#wo-276-d024--each-of-criterion-a4s-eight-commands-has-a-case-in-both-modes-and-a-publish-screen-reads-the-bytes-it-pushes));
`harness-fixtures`, `worktree`, `process-debt` (after D026) and the export
and update files of `launchpad` passed.

**Criterion 5:** met. (A5) `scripts/test-target-publish.mjs`: a context-mode
match in the composed body waits for `--confirm-terms` and proceeds with it;
`npm test -- --only target-publish` passed (19:38 UTC).

**Criterion 6:** met. (A6) The process-debt role case holds the stage's
reading in every executor, verifier, reviewer and planner root, the waiting
sentence in the five roots that wait on a gate, the worker's hand-back in the
three worker definitions, the instruction to record a correction as a
decision of kind `correction` in the executor's, verifier's and reviewer's
roots, and in the release-close root the sentence that says what that record
is and that a release close adds none to a closed order. The last was
recorded unmet until the second critic's report
([D026](decisions.md#wo-276-d026--three-expectations-follow-this-parts-sentences-and-where-the-corrections-sentence-lives),
[D030](decisions.md#wo-276-d030--part-as-review-judged-and-the-part-closed),
corrected by [D045](decisions.md#wo-276-d045--correction-the-release-close-root-states-what-a-corrections-record-is-so-criterion-a6-holds-whole-the-second-critics-five-points-judged)).
`node scripts/harness.mjs check` reads 43 surfaces equal to the emitted ones.

**Criterion 7:** met. (A7) The same case: no executor root holds a fifty-line
figure or sends a repair through the ladder; each says the repair's lines are
unreviewed, that the next run takes `--keep-going`, and that an order in
parts runs its ladder a part at a time with `--since`
([D021](decisions.md#wo-276-d021--the-role-text-of-steps-a6-a7-a9-a11-a12-and-a15-and-the-installed-roots-bytes)).

**Criterion 8:** met. (A8) `scripts/test-harness.mjs`, the worker-stop case;
`npm test -- --only harness-fixtures` passed (19:19 UTC). What the host did
is in [part-a/subagent-stop-probe.json](part-a/subagent-stop-probe.json): the
refused stop held the worker
([D015](decisions.md#wo-276-d015--what-the-host-gives-at-a-workers-stop-and-what-the-hook-reads-of-it-steps-a8-and-a9)).

**Criterion 9:** met. (A9, as restated by D012) `scripts/test-harness.mjs`:
the question dialog is admitted to every dispatched role and no refusal row
names it.

**Criterion 10:** met. (A10) `scripts/test-harness.mjs`, the accepted-cap
case (the twenty-first admitted, past the cap refused, usage prints it,
another order reads the file's value, unlimited refuses nothing). This
session's own readback after its acceptance of 100 is in
[part-a/usage-cap.json](part-a/usage-cap.json)
([D016](decisions.md#wo-276-d016--a-cap-accepted-for-one-dispatch-is-read-by-every-counter-of-that-dispatch-step-a11)).

**Criterion 11:** met. (A11) `scripts/test-off-ramps.mjs`, the three version
orders beside the effort readback; `npm test -- --only resume` passed (19:36
UTC).

**Criterion 12:** met. (A12) `scripts/test-host-guard.test.mjs`: the spawned
guard's record holds the title; on this host `ps` prints it
([D018](decisions.md#wo-276-d018--the-host-guards-process-title-step-a13)).

**Criterion 13:** met. (A13) `scripts/test-docs-check.mjs`, the case on
words and addresses and the kit root; `npm test -- --only
docs-check-fixtures` passed (19:04 UTC).

**Criterion 14:** met. (A14) `packages/skeleton/fixtures/` holds no
`*role-baseline*.json`, `scripts/check-role-oracle.mjs` is absent, no source
names a `role-oracle` task, and the harness case edits a committed skill
root by hand and reads the failure naming it
([D014](decisions.md#wo-276-d014--the-role-baseline-chain-is-removed-step-a5)).

**Criterion 15:** met. (A15) The sections step A17 names state each rule and
link this order's decisions; §First steps links §Document quality
([D022](decisions.md#wo-276-d022--where-step-a17s-write-backs-went));
`node scripts/docs-check.mjs` passes with 0 failures.

**Criterion 16:** met. (A16) The runner case named for criterion A16; the
export lists the example list and its three sample files as kit files, and
its document case holds the guide's four blocks to them; the streams are in
[part-a/terms-streams.json](part-a/terms-streams.json).

**Criterion 17:** met. (A17) `scripts/test-off-ramps.mjs`, the checkpoint
order: a new ref, a commit holding the tracked and the untracked change, no
event and an unchanged status; `resume` and `checkpoint` passed (19:36 and
19:03 UTC).
After VER-002 (F4) the commit holds every file Git tracks whatever an
ignore rule now says of its path or the index is told to assume of it: the
snapshot stages from an empty index, as it did, and then adds by name the
tracked files that pass left out. The same case holds a tracked file changed
and then matched by a new rule, a file added by force and never committed, a
file Git is told to assume unchanged and one it is told to skip, each
changed afterwards, an ignored untracked file left out, a staged file the
tree lost left out, and the index unchanged
([D133](decisions.md#wo-276-d133--the-repairs-combined-review-six-findings-judged-two-regressions-of-the-repair-itself-repaired-with-cases),
[D131](decisions.md#wo-276-d131--the-repair-of-ver-002-ten-findings-in-code-each-closed-as-the-class-it-names)).
After VER-003 (F1) the snapshot follows a tracked path whose place in the
working tree changed shape. The pass that adds the left-out tracked files
by name stopped on a tracked file whose directory had become a file, and,
as a probe of the judged candidate showed, on one whose directory had
become a link to a directory holding the same name or a repository of its
own. A tracked path is now added by name only where the working tree still
holds it: the path is a file or a link, every directory above it is a
directory, and nothing the first pass staged stands above it. A missing
path reads as lost and any other failure to read one is raised
([D137](decisions.md#wo-276-d137--the-repair-of-ver-003-the-snapshot-follows-a-tracked-path-whose-place-changed-shape-the-screen-asks-the-source-reader-what-is-source-and-every-reader-with-a-committed-input-is-compared)).
The repair's review found that the same pass, on a volume that folds case,
added back the old name of a file or a directory renamed by case alone,
since such a volume answers for a name in any case; main holds the new name
alone. The pass now adds by name only a tracked path that Git says an
ignore rule matches, the one class it exists for, and still looks for every
tracked path the first pass left out, so that one it cannot read is an
error
([D138](decisions.md#wo-276-d138--the-repairs-combined-review-seven-findings-judged-a-rename-by-case-alone-leaves-one-name-again-and-the-feedback-audits-row-is-compared)).
The cases beside the checkpoint case hold fifteen shapes with the index
unchanged, among them a file and a directory renamed by case alone, a
tracked file a rule ignores renamed the same way and a directory that
became a repository a rule ignores; the replacement's bytes in the snapshot
and in a checkpoint made from it; and a directory nothing may enter as an
error. They fail at their first shape against the module the report judged
and at the first rename against the module the review read. The resume
suite holds them in the complete run named under criterion 133.

**Criterion 18:** met. (B1) The screen of pattern readers runs in
`node scripts/docs-check.mjs`, which passes: it reads every non-test source
under `scripts/` and `packages/*/src/` and finds nothing
([part-b/measurements.json](part-b/measurements.json); 165 pattern readers in
46 sources before, [part-b/inventory.json](part-b/inventory.json)).
`scripts/test-docs-check.mjs`, the case named for criteria B1 and B5, refuses
a heading, a fence, a bold field label, a table row, a list item, a marker
comment and JSON text by file and line with the reader to call, and passes a
test, a fixture and a pattern that only resembles Markdown. A regular
expression is judged twice, by how it is spelled and by what it matches
(lines of each form, each paired with lines that lack only the syntax); the
case named for criterion B1's matrix crosses each form's spellings into
7,812 readers, of which the screen names every one where its spelled forms
alone named 6,406, and names none of 31 patterns that read something else
([D082](decisions.md#wo-276-d082--the-mid-order-ladders-last-round-two-findings-repaired-the-pattern-screen-now-also-judged-by-what-a-pattern-matches-and-the-twenty-first-critics-five-points)).
What that shows is the screen's tested recognition, not that every pattern
an author could write is named: one loose enough to match a line without
the syntax as well, and spelled outside the spelled forms, is passed. The
exceptions are the two lists `scripts/lib/markdown-screen.mjs` names; six readers that
compare exact marker lines with a constant, which the screen cannot see, are
named as the remainder in
[D038](decisions.md#wo-276-d038--part-bs-review-judged-its-six-findings-repaired-and-the-part-closed)
([D033](decisions.md#wo-276-d033--what-this-part-changes-in-the-ported-readers-one-build-free-source-reader-no-committed-cards-one-parse-a-document)).
After VER-002 (F1) the screen selects a source of every dialect the
source reader parses, under `scripts/` and under a package's `src/`, and
refuses a selected path the reader parses in no dialect. The case named for
the dialects writes a pattern reader in each of twelve suffixes under three
directories and holds each refused by file and line through the document
check, with the same suffixes as tests and fixtures left out. Over this
repository the screen now selects 430 sources and finds nothing
([D131](decisions.md#wo-276-d131--the-repair-of-ver-002-ten-findings-in-code-each-closed-as-the-class-it-names)).
After VER-003 (F3) the screen keeps no copy of the reader's suffixes. Its
pattern required a character, and none of them a line break, between a root
and the suffix's dot, so a file named by its suffix alone directly under a
root was left out, and so was a name that holds a line break. Where a file
stands is now the screen's rule and whether it is source is the reader's,
which `packages/skeleton/src/source-reading.mjs` exports and the screen
asks. The same case writes every suffix as a name of its own directly
under each root and below a directory there, names with several dots, a
leading dot, a space and a leading hyphen, and a name with a line break,
and holds each selected and refused by file and line; a test and a fixture
named by suffix alone, a suffix with no dot before it and a source outside
both roots stay out. Over this repository the screen selects 431 sources,
the ones the pattern selected, and finds nothing
([D137](decisions.md#wo-276-d137--the-repair-of-ver-003-the-snapshot-follows-a-tracked-path-whose-place-changed-shape-the-screen-asks-the-source-reader-what-is-source-and-every-reader-with-a-committed-input-is-compared)).

**Criterion 19:** met. (B2) No file under `packages/` imports Prettier (a
search of every package source finds none). The index pages carry no data
comment; `npm run work-orders -- index --check` passes with
`docs/control/release-history.json` and
`docs/control/workstream-observations.json` present, and the cases of
`scripts/test-work-orders.mjs` and `scripts/test-docs-check.mjs` fail each
check naming the command when a record is missing or damaged; the workstream
fixture's check passes with a target and no target checkout; `index --json`
prints the cards; `docs/work-orders/index.json` is gone and nothing replaces
it. `npm test -- --only work-orders-fixtures` passed (22:29 UTC).

**Criterion 20:** met. (B3) `scripts/test-launchpad-export.mjs`, the case
named for criterion B3: a fresh export with no `node_modules` and no built
output activates its first order, passes its index check, and `launchpad
verify` and `launchpad preview --from` each answer by naming the runtime file
the copy lacks. The resume and work-order fixtures copy the scripts into a
root with nothing installed and nothing built, and both suites' cases pass
there. The criterion's Check names the work-orders suite; the bare copy's
case that covers the four commands is the launchpad export's, in
`scripts/test-launchpad-export.mjs`, named above.

**Criterion 21:** met. (B4) `scripts/test-configuration-root.mjs`, the
header case: a quoted field and a field in a list item declare nothing, four
fields read from one order cost one parse, and the whole order one more.
The header read from the leading text equals the whole read on 269 of 269
orders
([part-b/comparisons/work-order-header-only.json](part-b/comparisons/work-order-header-only.json)).
After VER-002 (F5) the header read from an order's lead is the header
the whole document gives: the parser reads the line that could end the
header with its whole paragraph, and the whole document is parsed wherever
the parser finds no end of the header in the lead or the text below could
change its reading. The case named for criterion B4 compares thirty-two
documents field for field, the report's two among them. Over the 269
committed orders the two readings are equal, 268 are read from the lead
alone, and the header reading takes 580 ms where whole documents take
2,056 ms ([repair-002/header-reading.json](repair-002/header-reading.json);
[D131](decisions.md#wo-276-d131--the-repair-of-ver-002-ten-findings-in-code-each-closed-as-the-class-it-names)).
After FINAL-001 (F3) a label that opens a line inside inline math, a Liquid
tag or a wiki link opens its field, and after the review ladder's first
round no such span forms at all, since the parse entry hands the parser a
text in which their openers mean nothing, and a label inside a
strikethrough between two tildes opens its field: the case named for F3
reads a header with a dollar figure in two fields, the review ladder
between two figures, a Liquid tag over a label, a criterion judged between
two lines that each hold a figure, a header and judgment lines between two
tildes, and a link and a code span between two figures, over a tree that
holds no extension node; the criterion B4 case now reads its inline-math,
Liquid and math-block inputs from the lead alone
([D169](decisions.md#wo-276-d169--a-label-that-opens-a-line-inside-a-span-the-parsers-extensions-read-as-one-node-opens-its-field),
[D178](decisions.md#wo-276-d178--the-ladders-first-round-eleven-findings-from-three-reviewers-five-of-them-in-a-criterions-class-each-closed-as-its-class-with-a-case)).

**Criterion 22:** met. (B5) `node scripts/lib/vendored-parser.mjs --check`
passes; `scripts/test-sync.mjs`, `scripts/test-runner.test.mjs` and
`scripts/test-launchpad-export.mjs`, the cases named for criterion B5: the
check names each of the three files after one byte changes, the terms task
screens a changed copy as any added file, and a fresh export holds the three
files and `THIRD_PARTY_NOTICES`; `docs/LEGAL.md` names the copy, and the
check fails naming the page when it does not
([D032](decisions.md#wo-276-d032--the-carried-parser-is-proven-by-recorded-hash-and-left-out-of-the-screens-by-its-bytes)).

**Criterion 23:** met. (B6) `scripts/test-evidence-sources.mjs`, the case
named for criterion B6: one module names TypeScript's reading interfaces, a
fresh process that imports it has loaded no TypeScript, token reads start no
process and a batch of three sources starts one.

**Criterion 24:** met. (B7) The hooks' shell reader, the whole-text reading
and the classifier's word reader both, is
`packages/skeleton/src/shell-reading.mjs`; `harness-command.ts` keeps the
judgments and imports it, and `harness-host.ts` and
`scripts/lib/git-surface.mjs` hold no lexer of their own. The classifier's
answers from the build before the move and the build after it are equal on
52,749 commands, 28,142 of them refused
([D038](decisions.md#wo-276-d038--part-bs-review-judged-its-six-findings-repaired-and-the-part-closed)).
`npm test -- --only harness-fixtures` ran before the word reader moved and
failed three cases, none a refusal case, each repaired and passing alone
([D037](decisions.md#wo-276-d037--part-bs-light-gate-what-ran-what-failed-and-why));
the order's complete run runs the suite on the final tree.

**Criterion 25:** met. (B8) After FINAL-001 (F7) every reader that moved
has a comparison or a row saying why it has none. The repair added ten
comparisons: the six readers the review named (the Front page field, 1,479
equal; the integration note, 291 equal; a mixed projection's masks and
restore, 253 equal; the publication pages' product links, 564 equal; the
voice sections, 2 differing in one named class; the dependency block's
removal, 269 equal) and four more the inventory's screen found when run
again over its own tree with the marker-comment form (the executor root's
origin comment, 112; the instruction file's harness block, 34; a filed
record's link destinations, 2,360; the product gate's block, 223; all
equal). [part-b/inventory-marker-comments.json](part-b/inventory-marker-comments.json)
holds 45 findings in 22 files, each held by a row, and
[part-b/reader-census.json](part-b/reader-census.json) holds the 46 sources
that call a shared reader more often than at the base, each held by a row,
the entropy review's workstream block among them with no committed input
[D173](decisions.md#wo-276-d173--ten-moved-readers-gain-their-comparisons-the-inventorys-screen-is-run-again-with-the-marker-comment-form-and-a-census-of-the-shared-readers-callers-holds-every-mover).
The whole driver, run again after the review ladder's first round changed
the parse entry so that no extension span forms, read 36,290 inputs in its
79 comparisons, 35,109 equal and 1,181 different in 20 comparisons. The
three differences it had not named are each the base's math extension
hiding or mispairing a code span, the worktree's spans being the ones
CommonMark's backtick rule gives, and are named. Every comparison was then
compared with its record from the run's whole output: 66 as recorded, 11
with more inputs and every added one equal, and 2 changed, whose records
were written again
([D180](decisions.md#wo-276-d180--correction-wo-276-d176s-reconciliation-compared-60-of-the-79-comparisons-the-run-after-the-ladders-first-round-is-reconciled-whole-and-its-three-new-differences-are-the-bases-math-extension),
which corrects D176's account of the run before it). Before it, [part-b/inventory.json](part-b/inventory.json)
and [part-b/comparisons/](part-b/comparisons/readers.mjs), as the repairs of
VER-002 (F6) and VER-003 (F2) leave them:
[coverage.json](part-b/comparisons/coverage.json) maps the inventory's 53
sources reader by reader, 84 readers in all, each to the recorded
comparison that calls it at the base and in the worktree over the committed
documents or sources it reads (75 readers), or to the reason none exists
(9: the reader has no committed input, each with the count that shows it
or with what it reads that nothing commits, or it reads no text). No reader
is left uncompared because a check regenerates its output. The repair of
VER-003 added nine comparisons. Five are of the four readers that report
names: the follow-up register's candidates (85 of the 87 documents equal
and no row of any other document on either side; the two that differ hold
the two candidates the order's known issues for Part B expect, ER4-002 and
ER5-002, re-keyed because a label with a space before its closing
asterisks is no longer bold); the release history's
components (12 of 12) and order titles (269 of 269); the ledger (154 of
154); and the siblings registry's manifest hashes (41 of 41). Three are of
readers the audit of the remaining rows found with a committed input: the
capability table's row ids (0 of 36 equal, one class, a defect of the
base's pattern, which read no id from a row that names its capability in
words first), the role-qualification probe's quoted rows (1 of 1) and the
retained runtime the WO-242 controls probe reads from a hook (126 of 126).
That last probe could not load as this order had left it, which the audit
found and the repair corrects
([D137](decisions.md#wo-276-d137--the-repair-of-ver-003-the-snapshot-follows-a-tracked-path-whose-place-changed-shape-the-screen-asks-the-source-reader-what-is-source-and-every-reader-with-a-committed-input-is-compared)).
The ninth came from the repair's review, which found that the map's row for
the feedback audit named a reading that had not moved and gave no committed
input for the one that had: a test's result row, found by the test's name,
which 216 committed records of the audit hold (216 of 216 equal, over 4,320
runs). Those lines are the ones the base's own test kept, so the comparison
cannot show a row the base dropped, which the map states
([D138](decisions.md#wo-276-d138--the-repairs-combined-review-seven-findings-judged-a-rename-by-case-alone-leaves-one-name-again-and-the-feedback-audits-row-is-compared)).
As the repair of VER-003 left it, `readers.mjs` recorded 69 comparisons over
30,621 inputs, 29,445 equal and 1,176 different in 18 comparisons, none
unnamed. The whole driver was
rerun without recording when it held 68, before the review: it read 30,417
inputs and exited 0 with none unnamed. The comparison added since and the
two whose reader or class the review's repairs touched (the capability
rows and the import reading) were each rerun alone and exit 0. What follows
is the repair of VER-002's account of the first
sixty: 29,678 inputs, 28,540 equal and
1,138 different in 16 comparisons, every difference named in
[named-differences.json](part-b/comparisons/named-differences.json) and none
unnamed, a class named for all of a comparison's inputs being held to a test
the driver runs on every difference; `shell-reader.mjs` compares the shell
reader and, added by this
repair, the hook host's word splitter over 27,990 commands, 453 different
in two named classes. Both scripts exit 0 when rerun. The three readers
VER-002 named are among them: the known-issue sections (269 of 269 orders
equal), the criterion judgments (776 of 776 handoffs and reports) and the
Execution-plan paths (241 of 269, the other 28 three defects of the base's
pattern). Of the 1,138, 950 are a refusal both readers make whose words
changed; the rest are defects of the old readers, among them three that
change what the mission check's capsule holds, which the note at the head
of this file names ([D132](decisions.md#wo-276-d132--the-reader-comparisons-are-audited-reader-by-reader-and-completed-and-what-they-found)).
The verifier's rerun clause is the verifier's. Earlier records: the
thirteen comparisons of the execution and its mid-order ladder
([D035](decisions.md#wo-276-d035--part-bs-comparisons-the-difference-each-reader-shows-and-the-feedback-episode),
[D038](decisions.md#wo-276-d038--part-bs-review-judged-its-six-findings-repaired-and-the-part-closed),
[D080](decisions.md#wo-276-d080--the-mid-order-ladders-first-round-nine-findings-from-four-reviewers-each-judged-and-repaired-and-the-twentieth-critics-five-points)),
one of which, the work orders' headers, no longer passed when rerun and is
repaired; and the comment check, compared after VER-001 with main's check
and with the judged candidate over the 691 code files it reads and 21
regression inputs
([repair-001/comment-reader-comparison.json](repair-001/comment-reader-comparison.json),
[D127](decisions.md#wo-276-d127--the-comment-check-reads-its-comments-from-one-syntax-tree-batch-so-every-admitted-extension-is-judged-and-a-regular-expression-is-never-a-comment),
[D128](decisions.md#wo-276-d128--the-repairs-combined-review-six-findings-judged-the-line-count-it-broke-repaired-with-a-case-the-here-document-dialect-recorded-with-a-follow-up)).
After VER-006 the criteria refusal's rule changed, and the comparisons that
read it were run again on the repaired reader, after its first version and
again after the review's repairs: `order-criteria` 269 of 269 equal,
`plan-continuation-criteria` 261 of 261, `planning-subjects` and
`planning-subjects-base` 68 of 68 each, and `mission-clauses` 210 equal with
the 59 differences already named; each count equals its recorded file, so no
record was rewritten
([D192](decisions.md#wo-276-d192--the-repair-of-ver-006-a-criteria-list-is-refused-where-a-block-holds-an-item-numbered-as-none-before-it-was-not-only-where-it-holds-the-next-number),
[D194](decisions.md#wo-276-d194--the-repairs-combined-review-a-wrapped-fence-prose-after-a-complete-list-and-a-repeated-number-each-closed-by-holding-the-refusal-to-the-line-readers-items)).

**Criterion 26:** met. (B9) `npm run evidence:feedback -- --check` passes on
edition WO-276 revision 009, whose live audit judges the candidate the
repair of VER-006 leaves: run after that repair's last code change on
2026-11-14, the check reports that the live audit `feedback-009` judged the
current source, so no new episode was owed. The repair of FINAL-001
recorded revision 008 after its edit of judged sources and revision 009
after its review ladder's first round's repairs. At
Part B's end the edition was revision 002, and the
order's later episodes recorded revisions 003 to 005. After VER-003 two
live episodes followed edits of judged files: revision 006 after the source
reader gained the export the screen asks (F3), and revision 007 after the
host's native helpers came to be remembered by directory, the repair the
fourteenth complete run called for
([D139](decisions.md#wo-276-d139--the-fourteenth-complete-run-failed-in-two-suites-neither-on-the-repairs-own-change-a-nested-gate-refused-on-the-hosts-memory-pressure-and-a-lane-case-met-a-reader-cache-that-answered-for-the-wrong-directory-which-is-repaired);
[D137](decisions.md#wo-276-d137--the-repair-of-ver-003-the-snapshot-follows-a-tracked-path-whose-place-changed-shape-the-screen-asks-the-source-reader-what-is-source-and-every-reader-with-a-committed-input-is-compared)).

**Criterion 27:** met. (B10) Product 07 §Discipline and §Where the control
plane finds its documents, the kit guide §Document quality, §Kit files and
instance files and §Taking upstream updates, and `docs/LEGAL.md` state the
rule, the screen, the two records and the carried parser, each linking this
order's decisions; `node scripts/docs-check.mjs` passes. After VER-006
product 07's paragraph on an order's acceptance criteria states that a list
which skips a number reads as written, that the refusal is held to the line
reader's items whatever their number, a wrapped fence's included, and that
after a label at the margin only the next number goes on, linking
[D192](decisions.md#wo-276-d192--the-repair-of-ver-006-a-criteria-list-is-refused-where-a-block-holds-an-item-numbered-as-none-before-it-was-not-only-where-it-holds-the-next-number)
and
[D194](decisions.md#wo-276-d194--the-repairs-combined-review-a-wrapped-fence-prose-after-a-complete-list-and-a-repeated-number-each-closed-by-holding-the-refusal-to-the-line-readers-items).

**Criterion 28:** met. (B11) `packages/skeleton/test/mission-check.test.ts`
and `runtime-status.test.ts`: a resident without the launcher holds a
mission check with no judgment, its log records the failure as
`documents-unread` and the hold a replay of that log gives names
`scripts/resident.mjs` (the case named for F4, after FINAL-001 [D170](decisions.md#wo-276-d170--a-resident-that-holds-no-reader-of-mission-documents-records-the-checks-failure-as-documents-unread-and-the-hold-names-the-launcher)),
and a check over an order whose criteria list the reader refuses records
`contract-unreadable`, with a hold that names the index check (the case
the ladder's first round asked for, [D178](decisions.md#wo-276-d178--the-ladders-first-round-eleven-findings-from-three-reviewers-five-of-them-in-a-criterions-class-each-closed-as-its-class-with-a-case));
it reports its work orders unavailable with the console naming the
launcher beside that reason; a helper's transaction completes while a
launched owner's card source is slow, and the host refuses an option it
does not read (the cases named for F5 and F6, [D171](decisions.md#wo-276-d171--the-resident-store-reads-the-work-order-cards-before-it-takes-its-append-lock-and-the-launchers-card-command-has-a-time-bound), [D172](decisions.md#wo-276-d172--the-resident-host-refuses-an-option-it-does-not-read-and-the-live-walkthrough-hands-over-the-card-source));
`scripts/test-resident-bind.mjs`, the case named for criterion B11: the
launcher's card source reads an order's card again after its file changes;
`packages/skeleton/test/discovery.test.ts`: a Markdown profile is refused by
name.

**Criterion 29:** met. (C1) [part-c/briefs.json](part-c/briefs.json): the
four dry-run briefs for this order and the recheck brief each carry the
sentence that says what blocks, and a round-one brief asks each finding for
the writer of its input. `scripts/test-review-worker.mjs`, the case named
for criterion C1: a criteria report with a disposition outside the three is
kept as `round-1-criteria.refused.md`, the refusal line names the path, and
the round has no recorded report ([D039](decisions.md#wo-276-d039--part-c-as-built-the-blocking-rule-in-every-brief-one-review-for-a-fix-the-ladder-line-and-the-paired-record)). `plan-refutation` ran with
one unrelated failure, since repaired ([D042](decisions.md#wo-276-d042--part-cs-gate-eight-suites-two-failures-and-their-causes-and-the-part-closed)).

**Criterion 30:** met. (C2) Both installed executor roots carry the judgment
rule and neither carries the old clause
([part-c/executor-review-sentences.json](part-c/executor-review-sentences.json));
`node scripts/harness.mjs check` reads 43 surfaces equal to the emitted
ones; the process-debt role case asserts both.

**Criterion 31:** met. (C3) The same roots state that a fix dispatch repairs
the class its failed report names and runs one combined review over the
repair's change since the tree that report judged, and no root sends three
round-one reviewers on a fix; the same case and the executor-text case
(8 pass).

**Criterion 32:** met. (C4) The roots state the three sizes and that a paired
round's reviewers are given no other's report. `scripts/test-work-orders.sh`
(37 pass), the case named for criterion C4: each of the three values passes
and shows on the card, another value and a repeated line refuse naming the
order and the line, an order with no line passes, and a closed order's line
is not judged. `npm test -- --only work-orders-fixtures` passed (23:47 UTC).

**Criterion 33:** met. (C5) `scripts/test-docs-check.mjs`, the case named for
criterion C5, and [part-c/docs-check.json](part-c/docs-check.json);
`npm test -- --only docs-check-fixtures` passed (23:49 UTC).

**Criterion 34:** met. (C6) `scripts/test-review-worker.mjs`, the case named
for criterion C6, and
[part-c/paired-rounds-fixture.json](part-c/paired-rounds-fixture.json): each
paired order's findings by class and by finder, its first verification, the
sums, and nothing from an order that declares `full` or no line.

**Criterion 35:** met. (C7) Product 07 §Verification review and attack and
§Operator-opened planning pass and the kit guide's ladder paragraph state
the round-one rule, the fix dispatch's one review, the header line and the
paired record, each linking [D039](decisions.md#wo-276-d039--part-c-as-built-the-blocking-rule-in-every-brief-one-review-for-a-fix-the-ladder-line-and-the-paired-record); `node scripts/docs-check.mjs`
passes. Step F6 has not moved any paragraph yet.

**Criterion 36:** met. (C9) `scripts/test-review-worker.mjs`, the case named
for criterion C9: a second batch without an `Items` table records the round
when the merged report carries it, and a refused merged report is kept with
each batch's report under names that say which is which, the refusal line
naming every path.

**Criterion 37:** met. (D1) `scripts/test-runner.test.mjs`, the case named
for criterion D1: with an exclusive row and a heavy row both changed since
the last gate, another exclusive row with the branch lead and a heavy row
that failed last, `expandSuiteTasks` returns the exclusive tasks adjacent,
each at 2200, ahead of the changed heavy row (2000) and behind the failed one
(3000), and the scheduler starts them in that order
([D047](decisions.md#wo-276-d047--part-d-as-built-the-control-and-what-it-can-show-the-convoy-the-shards-the-file-order-the-conditions-reading-and-the-cases-that-follow)); `npm test -- --only runner-fixtures` passed (07:08 UTC).

**Criterion 38:** met. (D2) The same file's case named for criterion D2: one
task for each of the row's three shards, each carrying its shard to its
process; the scheduler admits them together (three at eight lanes, two at
four) with no task beside them that is neither a shard nor light, and no
more light peers than the row's overlap. The row declares `shards: 3`. With
no shard named, `node --test --test-name-pattern <title>
scripts/test-harness.mjs` runs the named case (run under the bounded wrapper
for a title of an imported file, 1 of 1; the case "the registered harness
suite executes the driver route tables" holds it for two more).

**Criterion 39:** met. (D3) `npm test -- --only harness-fixtures` passed three
times in succession (04:31, 04:36, 04:42 UTC) and inside both after runs.
[part-d/titles.json](part-d/titles.json): 431 titles declared by the nine
files the row loads, 431 run by the three shard tasks, each title in exactly
one shard, the two lists equal, taken at 06:07 UTC on the code this part
ends on ([D049](decisions.md#wo-276-d049--the-first-after-run-failed-on-a-race-outside-part-d-its-repair-waits-so-that-the-two-timed-trees-differ-by-part-d-alone-the-fifth-critics-points-judged)).

**Criterion 40:** met. (D4) The expanded `target-worktree` group lists the
close file's task first (the runner case "target-worktree file tasks run
under two independent deadlines at eight lanes", so titled since Part E
took the registry out of it); `npm test -- --only target-worktree` passed
(04:52 UTC, 0 h 10 min).

**Criterion 41:** met. (D5) [part-d/before.json](part-d/before.json) and
[part-d/after.json](part-d/after.json) each hold a passing fresh complete
review row's timeline (`row.exitCode` 0, `row.tasksReused` 0,
`row.executionMode` forced-fresh). The control ran on checkpoint 12's tree
and the after row on checkpoint 14's, whose code is checkpoint 13's: the
trees differ in the files Part D's steps name and in this order's evidence
files (`git diff --name-only` between the two checkpoints lists 23 paths:
the 12 sources of steps D2 to D5, the part's 8 evidence files, the
decisions, the standing file and the generated decisions index). In the after row `readings.betweenExclusiveStarts` is empty
([D050](decisions.md#wo-276-d050--part-ds-comparison-54-minutes-before-and-42-after-what-the-pair-shows-worktree-integration-declares-no-overlap-and-the-part-closed)).

**Criterion 42:** met. (D6) `harness-fixtures` shows light peers beside it in
both rows and `process-debt` in the after row
(`readings.lightPeersBeside`); `worktree-integration` shows none in either
and no longer declares `overlap` ([D050](decisions.md#wo-276-d050--part-ds-comparison-54-minutes-before-and-42-after-what-the-pair-shows-worktree-integration-declares-no-overlap-and-the-part-closed)).

**Criterion 43:** met. (D7) The runner test file's case named for criterion
D7: with one fresh passing complete row of the review selection and none of
the plain one, the reading's first row lists that row as its sample with
`selection: "review"`, and no per-task row exists for a task name the row
does not hold.

**Criterion 44:** met. (D8) Product 07 §Preflight before the full gate states
the exclusive suites' shared priority, the hook suite's shards and the
target-worktree file order, each linking [D047](decisions.md#wo-276-d047--part-d-as-built-the-control-and-what-it-can-show-the-convoy-the-shards-the-file-order-the-conditions-reading-and-the-cases-that-follow) or [D050](decisions.md#wo-276-d050--part-ds-comparison-54-minutes-before-and-42-after-what-the-pair-shows-worktree-integration-declares-no-overlap-and-the-part-closed);
`node scripts/docs-check.mjs` passes.

**Criterion 45:** met. (E1) `scripts/fixtures/` holds neither registry, and
no file under `scripts/` or `packages/` names one (`grep -rn
"launchpad-cases\|target-worktree-cases" scripts packages` prints nothing).
`scripts/test-runner.test.mjs`, the case named for criterion E1: a fixture
suite file that declares "one" and "two" twice at its top level is named
with each title, and a file that repeats a title only inside a nested case
and inside a string is not; over every suite file of the repository it
finds none, in one start of the source reader. Another name for a
registrar or for one of the file's own functions is read as what it names,
by the corpus file `registrar-alias`, which is compared with what node
registers. A suite file is read with the suite files it loads by import,
whose cases node registers under it; a two-file block of the case holds
that to node. The rule was compared file by file with what node registers
(every suite file loaded with a recorder in place of `node:test`, from the
ignored reviews lane): 191 suite files, 174 listed by node, 3,408
registrations, no title twice on either side, none the rule understates,
and no file where node registers a title the rule neither counts nor shows
as unread. In 30 files the rule's 120 unread sites account for the
difference: 520 registrations whose titles are built at run time, among
which a duplicate is visible only to node. Three files do not load under
the recorder and have no node side. Since then the forms the rule reads
are held to node by a family the case generates and runs: every way a name
comes to be a registrar or a namespace, crossed with every registering
member the running node has and with both spellings of a member access
(335 files, run on node 26.9.0 and on 24.15.0, the two the repository
supports), beside thirty-four boundary files, thirty that the rule must
count as unread and four on which it is silent, nineteen files that hold
the scope classes of its reading of names from both sides, and controls
that it must neither report nor count; every name it reads is resolved
to its declaration; and a registration is counted exactly only where the
rule knows how often its body runs, and as unread elsewhere. What the
rule reads exactly, what it shows as unread and what it does not see is
stated once, with the end of its extension in this order, in D097. Over
the repository's suite files it shows 103 registrations in 30 files
as unread, one fewer than before these repairs, the one being a hook, and
its whole reading of each of 177 files is what it was before the attack's
repairs
([D092](decisions.md#wo-276-d092--rolling-review-40s-three-findings-in-closed-parts-the-title-rule-and-the-pattern-screen-each-get-a-declared-family-and-a-written-boundary-in-place-of-one-more-spelling-and-a-codex-count-without-its-cached-part-is-no-longer-read-as-uncached),
[D094](decisions.md#wo-276-d094--rolling-review-41s-finding-in-a-closed-part-the-title-rule-reads-what-a-registrar-is-in-one-place-by-either-spelling-of-a-member-and-to-any-depth-and-its-family-is-crossed-with-nodes-own-members-and-both-spellings),
[D095](decisions.md#wo-276-d095--the-attack-on-the-title-rule-eight-findings-and-a-ninth-the-executor-ran-repaired-the-rules-boundary-gains-a-second-side-how-often-a-body-runs),
[D097](decisions.md#wo-276-d097--the-twenty-eighth-critics-three-points-the-title-rules-contract-is-stated-and-its-extension-ended-for-this-order-its-scope-classes-are-held-to-node-by-files-of-their-own-the-case-is-made-to-pass-on-node-24-and-the-parts-evidence-reads-a-kept-run))
([D081](decisions.md#wo-276-d081--the-mid-order-ladders-recheck-round-the-first-rounds-nine-findings-held-four-new-ones-repaired-and-the-title-rule-measured-against-nodes-own-registrations),
[D082](decisions.md#wo-276-d082--the-mid-order-ladders-last-round-two-findings-repaired-the-pattern-screen-now-also-judged-by-what-a-pattern-matches-and-the-twenty-first-critics-five-points),
[D084](decisions.md#wo-276-d084--resumed-in-a-new-session-the-stopped-runs-leftovers-and-the-four-failures-of-a-complete-run-repaired-the-title-rule-made-to-read-a-suite-file-with-the-files-it-loads-and-the-two-behaviors-of-part-js-rebuilt-half-left-as-d082-records-them)).
[part-e/duplicate-title.txt](part-e/duplicate-title.txt) is the case's
failing output with a suite file that declares one title twice: it names
the file and the title. `npm test -- --only runner-fixtures` passed (08:37
UTC, 0 h 3 min). What each registry refused is recorded in [D053](decisions.md#wo-276-d053--part-e-as-built-case-titles-checked-for-duplicates-no-per-case-time-bound-a-fixed-self-host-edition-the-statement-wordings-as-a-table-and-one-vertical-task-a-file).

**Criterion 46:** met. (E2) `scripts/test-target-publish.mjs` holds no
per-case time bound (`repairedCaseMs`, its wrapper and the module-end check
are gone; `test` is node:test's), and `npm test -- --only target-publish`
passed (08:41 UTC, 0 h 2 min).

**Criterion 47:** met. (E3) [part-e/console-check.json](part-e/console-check.json):
with the feedback selection moved to another edition than the one the
self-host case reads (revision 001 for 002, for the length of the run), the
`console-fixtures` artifact's check command, the one sync and the structural
phase run, exits 0 with all six cases matching, and
`packages/console/fixtures/expected/selfhost.*` keep their bytes; they also
equal checkpoint 16's (`git diff --stat` between the two is empty). The
edition moved to is an older one, there being no newer yet: the check reads
no selection, so the direction does not enter. A newer edition has been
selected since: Part H's live episode recorded revision 003, and with it
selected the artifact's check is current and the expected files still equal
checkpoint 16's (`git diff --stat` empty; D060). At the base the artifact's
check was the mode `--check-current-selfhost`, which failed with the
selected edition's path as its expected value
(`git show main:scripts/console-fixtures.mjs`).
`packages/console/test/board.test.ts` holds the case "[document] WO-276
criterion E3", which loads the edition `currentEvidence` selects and
applies the property checks with no byte comparison (1 pass with either
edition selected). `npm test -- --only console` passed (08:44 UTC, 0 h 1
min). `npm test -- --only sync-fixtures` was not run as a suite in this
part: its case of the artifact's stale message and the real inventory case
passed under the bounded wrapper, and the suite runs in the order's complete
run (D027) ([D053](decisions.md#wo-276-d053--part-e-as-built-case-titles-checked-for-duplicates-no-per-case-time-bound-a-fixed-self-host-edition-the-statement-wordings-as-a-table-and-one-vertical-task-a-file)).

**Criterion 48:** met. (E4) [part-e/wordings.json](part-e/wordings.json)
lists the 95 iterations of the four statement cases of
`scripts/test-vertical.mjs` at the base (`0097fcac6`), read from the titles
the file registers there, which are 82 distinct rows.
[part-e/table-rows.json](part-e/table-rows.json) holds the rows of the
table `STATEMENT_WORDINGS` in
`packages/skeleton/test/vertical-judgment.test.ts` as read from its source:
each of the 82 is a row with its statement role, its assertion kind and the
classification kind and rule expected of `baselineClass` and of
`baselineStoryClass`; none is missing, none differs in kind, and one row is
beyond the base. The table's case passes. `scripts/test-vertical.mjs` keeps
one end-to-end case for each statement class and outcome on each path the
four cases walked, six in all, and they pass (6 of 6 alone, 0 h 0 min 19
s). `npm test -- --only vertical` passed (08:45 UTC, 0 h 8 min); `npm test --
--only skeleton` was not run as a suite after the table was added: the
table's case passes in the built test file under the bounded wrapper, the
suite passed at 07:50 UTC with the rest of its files as they are, and it
runs in the order's complete run (D027) ([D053](decisions.md#wo-276-d053--part-e-as-built-case-titles-checked-for-duplicates-no-per-case-time-bound-a-fixed-self-host-edition-the-statement-wordings-as-a-table-and-one-vertical-task-a-file)).

**Criterion 49:** met. (E5) Product 07 §Preflight before the full gate
states that no list of case titles is kept and that a case of the runner's
tests refuses a suite file that declares one title twice; §Verification
review and attack states, in the consistency reviewer's paragraph, that a
suite's case titles are checked for duplicates and against no registry.
Both link [D053](decisions.md#wo-276-d053--part-e-as-built-case-titles-checked-for-duplicates-no-per-case-time-bound-a-fixed-self-host-edition-the-statement-wordings-as-a-table-and-one-vertical-task-a-file). `node
scripts/docs-check.mjs` passes.

**Criterion 50:** met. (F1) `packages/skeleton/test/executor-supports.test.ts`,
the case named for criterion F1: under each support setting, each host
profile and both skill roots, every role's emitted root but the router's
holds once each shared rule whose record names the role and holds none
whose record does not, both derived from the records
(`sharedRules` in `packages/skeleton/src/loadouts/contributor.ts`); a record
that names no role fails it; the router's root, which the part leaves as it
is, holds exactly the seven shared rules its own composition names. The
built test file passes whole (8 of 8). `npm test -- --only skeleton` passed (09:37 UTC, 0 h 7 min).
([D055](decisions.md#wo-276-d055--part-f-as-built-the-shared-rules-as-records-the-rule-by-role-table-the-refutations-steps-from-its-command-the-review-helpers-section-and-the-meters-second-number)).

**Criterion 51:** unmet (contradiction), in one clause; the rest holds
([D084](decisions.md#wo-276-d084--resumed-in-a-new-session-the-stopped-runs-leftovers-and-the-four-failures-of-a-complete-run-repaired-the-title-rule-made-to-read-a-suite-file-with-the-files-it-loads-and-the-two-behaviors-of-part-js-rebuilt-half-left-as-d082-records-them)). (F2) The clause: the records equal the table "by the case
of criterion F1". That case's check is the product suite, and a product
case may not read an order's records: the `skeleton` suite failed on the
product read guard when the comparison stood in it (the complete run of
01:58 UTC on 2026-11-12, all 624 cases passing). The comparison is now a
case of its own in the same file, "[document] WO-276 criterion F2", which
the document gate runs and the product suite skips, so no candidate holds
the clause as written. What holds: [part-f/rule-table.md](part-f/rule-table.md)
holds the 30 rules by the 6 roles with a reason in every cell: for a rule a
role keeps, what of that role's procedure the rule governs; for the seven
cells this part leaves out, that the role reaches none; and for one, the
operator's controls in the release close's root, that the base's root
never held it. `rule-table.mjs` writes the table from the records and fails
where a record and a reason disagree, its `--check` fails where the
committed table differs from them, and the document case runs that check.
The dispatch bounds stay with the planner, the refuter and the release
close, and the browser rule, which an instance can elect for any session,
stays with all six.

**Criterion 52:** met. (F3) [part-f/harness-check.txt](part-f/harness-check.txt):
with a line added by hand to a committed skill root, `node
scripts/harness.mjs check` exits 1 naming that root.
`packages/skeleton/fixtures/` holds no `*role-baseline*.json`,
`scripts/check-role-oracle.mjs` is absent, and neither the runner nor the
generated-artifact inventory nor the structural checks name a `role-oracle`
task (Part A, step A5; judged here on this part's candidate).

**Criterion 53:** met. (F4) No installed root or agent definition names `npm
run plan -- review` (`grep -rc` over both skill roots and both agent
directories counts none), and the hook counts no worker use for it: the
use-count case admits `npm run plan -- review` and `node
scripts/refute-plan.mjs review` with the count unchanged, and
`kitWorkerLaunch` returns nothing for the second.

**Criterion 54:** met. (F5) The installed planner roots name no skill for the
refutation: their step reads "run `npm run plan -- refute` for one
independent goal review per pass and follow the parent's steps it prints
beside the prompt". The command writes the parent's steps to its error
stream beside the prompt, naming `npm run plan -- receipt`
([part-f/refute-steps.txt](part-f/refute-steps.txt)); the plan-refutation
case of the direct command holds that it writes exactly those and that the
worker's prompt holds none. The installed refuter roots carry the refuter's
procedure unchanged. `npm test -- --only plan-refutation` passed (09:49 UTC, 0 h 3 min).

**Criterion 55:** met. (F6) In product 07, §Verification review and attack,
the section the verifier's and the reviewer's `Read:` lines name, holds no
`--kind` flag; the paragraphs that do stand under the second-level heading
"Review helper and round reports", which the first links once. The
installed planner roots name the ideation section in one sentence, for an
`ideation:` entry. `node scripts/docs-check.mjs` passes.

**Criterion 56:** met. (F7) `npm run meta` prints, for each role under each
skill root, its installed bytes and the bytes of its fixed reads (for the
planner, 32,865 and 68,360), and
[part-f/after.json](part-f/after.json) lists the planner's fixed reads as
§Operator-opened planning pass and the sequence. The process-debt case
named for criterion F7 holds the reading. `npm test -- --only process-debt` passed (09:33 UTC, 0 h 3 min).


**Criterion 57:** met. (G1) [part-g/results.json](part-g/results.json): the
first order and the security seed of a fresh export, kept as
`part-g/first-order.exported.txt` and `part-g/AI-HARNESS-SECURITY.exported.txt`,
name Claude Code, hold no other agent harness's or model provider's name and
neither phrase of step G1, and say another host is inspected only where the
instance's configuration elects it. `scripts/test-launchpad-seeds.mjs` holds
the case that refuses a first order with either phrase, in any letter case
([D057](decisions.md#wo-276-d057--part-g-as-judged-the-seeds-name-claude-code-alone-a-discovery-record-turns-no-host-on-the-operators-commands-are-a-generated-page-and-what-core-should-hear-is-one-file)).

**Criterion 58:** met. (G2) [part-g/hosts.json](part-g/hosts.json): with a
discovery record that holds observed versions of `codex-cli` and
`copilot-cli`, no election and no attestation, the inventory reports both
hosts off, naming the discovery record as showing each without an election,
and the emit's surfaces are Claude's alone (`.claude`, `CLAUDE.md`); with an
attestation under `codex-cli` that host reads inferred from the
attestations. This repository's 42 emitted surfaces at this part's end
equal, path and hash, those of the tree the part began on (checkpoint 19),
and are the same three host profiles and the same surface paths as main's.
The harness case named for criterion G2 holds what an existing instance's
next check and emit do with a host that is no longer on.

**Criterion 59:** met. (G3) In a fresh export with no install,
`docs/OPERATOR.md` (kept as `part-g/OPERATOR.exported.txt`) names the kit's
version (`v0.123.0`) and holds the ten command blocks the kit guide marks,
in the cycle's order, byte for byte, and `node scripts/launchpad.mjs
commands` prints the page (`part-g/commands-output.txt`, exit 0).
[part-g/generated-check.txt](part-g/generated-check.txt): in a scratch copy
the generated check exits 1 naming `docs/OPERATOR.md` as stale after a
marked block changes and 0 once the page is regenerated, and exits 1 naming
the guide's line for a fenced shell block with neither marker. Step G3
describes each marker as a start and an end comment around a block; what
was built, and what this line judges, is one comment on the line above
each block, as [D057](decisions.md#wo-276-d057--part-g-as-judged-the-seeds-name-claude-code-alone-a-discovery-record-turns-no-host-on-the-operators-commands-are-a-generated-page-and-what-core-should-hear-is-one-file)
records with its reason; the criterion does not depend on the form.

**Criterion 60:** met. (G4) A fresh export's `FOR-CORE.md` equals
`scripts/kit/for-core.template.md` (`results.json`, `forCore`). The starter
refresh's case of `scripts/test-launchpad-update.mjs` adds the file to a
starter that lacks it (`seeds added: FOR-CORE.md`), and a seed an owner has
changed is not rewritten (`exportSeedPaths`).
[part-g/entry-checks.txt](part-g/entry-checks.txt): the document check's
judgment passes the seeded file and an entry of the stated form and fails,
naming the entry and the field, an entry that lacks a field, one with a
value outside its set and one whose block is no JSON.

**Criterion 61:** met. (G5) The installed reviewer roots hold the sentence
that a final review appends to `FOR-CORE.md` what the kit got wrong or made
hard during the order, and the installed planner roots the sentence that a
pass reads the file at entry, writes its own entries there and writes no
block for core in its document, each opening "Where this root holds
`FOR-CORE.md`" (one occurrence in each of the four roots). `node
scripts/harness.mjs check` passes: the installed roots equal the emitted
ones.

**Criterion 62:** met. (G6) The kit guide's §First steps, §Features,
§Planning in this instance and §Releases in this instance, and product 07's
planning item and its §Model-specific notes, state the hosts, the page and
the file as steps G1 to G5 leave them, and their links name
[D057](decisions.md#wo-276-d057--part-g-as-judged-the-seeds-name-claude-code-alone-a-discovery-record-turns-no-host-on-the-operators-commands-are-a-generated-page-and-what-core-should-hear-is-one-file); §First steps, a
reader entry point, links §Releases in this instance, which carries the
link. `node scripts/docs-check.mjs` passes.

**Criterion 63:** met. (H1) `scripts/test-launchpad-seeds.mjs`, the case
named for criteria H1, H2, H7 and H9: in a copy of a fresh export with no
`node_modules` at all, `node scripts/doctor.mjs` prints a table with one
row for each of the nine assumptions that apply to an instance electing no
host (the Node range, the Git floor, the compiler, a lane's memory,
symbolic links, line-ending conversion, the forge, the platform and the
Claude CLI), each row holding an observed value, a verdict, what depends on
it and a remedy, and `--json` prints the same rows. No compiled runtime is
loaded: the runner's case named for criteria H2 and H9 follows the entry's
imports through `sourceImports` and finds Node's own modules and build-free
files of the repository alone. On this host the command prints 11 rows,
none unmet, and exits 0
([part-h/host-report.txt](part-h/host-report.txt),
[part-h/host-report.json](part-h/host-report.json)).

**Criterion 64:** met. (H2) [part-h/injected.json](part-h/injected.json),
summarized in [part-h/results.json](part-h/results.json): with a Node below
the range, a Git below the floor and a compiler that fails injected at once,
the three rows read unmet in one run and the command exits 1; with every
assumption met it exits 0; with two facts that cannot be read (the Git
configuration and the origin) their rows read unknown and it exits 0. The
last clause is held on the export's own files by the seeds case: with
`scripts/lib/host-doctor.mjs` replaced in the export by a file that fails to
load and a Node below the floor, the entry prints the Node row with the
range `package.json` declares and exits 1. The runner's case holds the
entry's own judgment of Node equal to `judgeRunningNode`'s over seven
versions.
After VER-002 (F8) the hosts this instance has on are a fact like the
others: where they cannot be read the report prints one row marked unknown,
looks for no elected host's CLI and exits as it would without it; and a
tool that is on the path and does not answer for its version is reported
found and unread, which leaves the forge row unknown, where it was reported
missing and failed that row
(`scripts/test-runner.test.mjs`, the case named for criteria H2 and H3;
[D133](decisions.md#wo-276-d133--the-repairs-combined-review-six-findings-judged-two-regressions-of-the-repair-itself-repaired-with-cases),
[D131](decisions.md#wo-276-d131--the-repair-of-ver-002-ten-findings-in-code-each-closed-as-the-class-it-names)).

**Criterion 65:** met. (H3) `scripts/test-runner.test.mjs`, the case named
for criteria H1 to H3: with a host name, a user name, a home directory and
an origin URL injected, and a probe whose own error message holds three of
them, neither the table nor the JSON of five reports (all met, three unmet,
unknown rows, others unmet) holds any of the four, the origin's owner or
repository, a host name by pattern, a URL scheme, or an absolute path of
either platform's form. The evidence files of this part were read for the
same and hold none.
After VER-002 (F9) a path's segment and an address's parts are whatever
is not white space, in any script. The case named for criteria H2 and H3
injects eight values, among them paths in Latin with diacritics, Han and
Cyrillic, an scp-style address, a share, a drive path and a URL with a
non-ASCII host, and holds the table and the JSON free of each and of any
slash that opens a path; the report's own words with a slash stand. A path
with a space in a name is withheld up to the space
([D131](decisions.md#wo-276-d131--the-repair-of-ver-002-ten-findings-in-code-each-closed-as-the-class-it-names)).

**Criterion 66:** met. (H4) [part-h/host-task.txt](part-h/host-task.txt):
on an injected host of 16 GB and twelve logical processors (six lanes of
1,431,655,765 bytes) the host task exits 0 in a kit root, whose carried
peak is 602,734,592 bytes, and exits 1 in core naming the per-lane
shortfall against 1,509,638,144 bytes and the gate share that would admit
it, in the words it used before the comparison moved (the gate follow-up
file's remedy case passes unchanged). The runner's case named for criterion
H4 also holds the baseline's kit peak equal to the reading computed from
the suite table and the baseline's samples.

**Criterion 67:** met. (H5) [part-h/previews.txt](part-h/previews.txt): in
a fork of a fresh export, the preview of a revision that declares
`engines.node` `^99.0.0` and `engines.git` `>=99.0.0` prints one line for
each, naming the floor and this host's version, above its file sections,
and its plan; the preview of a revision whose floors are met prints no such
line and its plan; both exit 0. The fork-preview case of
`scripts/test-launchpad-update.mjs` asserts the same in the update fixture.
The floor reading took 4.6 ms beside previews of about 190 ms
(`results.json`, `preview`).

**Criterion 68:** met. (H6) `scripts/test-runner.test.mjs`, the case named
for criterion H6: with a compiler that cannot be run, the lock helper's
first use fails with an error naming the compiler tried, what the kit needs
it for and the platform's remedy, with the tool's own message kept; the
host report's compiler row carries the same remedy.

**Criterion 69:** met. (H7) The seeds case: a fresh export's
`.gitattributes` equals `scripts/kit/gitattributes.template` and the
manifest does not list it. The starter-refresh case of
`scripts/test-launchpad-update.mjs`: a refresh adds the file to a starter
that lacks it (`seeds added: .gitattributes, FOR-CORE.md,
docs/lineage/README.md`) and leaves a starter's own file byte-identical.

**Criterion 70:** met. (H8) The kit guide's §First steps opens with the
command and names the compiler, the forge's tool, the merge policy release
close needs and the three statements about hosts (macOS exercised, Linux
and WSL2 designed for and not exercised, native Windows unsupported);
§Taking upstream updates states the preview's floor lines and links
[D060](decisions.md#wo-276-d060--part-h-as-built-the-host-report-a-kit-roots-host-check-sized-to-its-carried-tasks-the-previews-floor-lines-the-compilers-failure-and-the-attributes-seed);
§First steps, a reader entry point, links that section. `node
scripts/docs-check.mjs` passes; `npm run test:docs` runs at the order's end
(step Z3).

**Criterion 71:** met. (H9) The seeds case: in the export, which elects no
host and holds no attestation, with stand-in `claude`, `codex` and
`copilot` commands first on the path that record each call, the command
prints the Claude CLI's row alone and the record holds `claude --version`
and nothing else; with `features.host-codex` elected it prints that host's
row as well and the record holds `claude --version` and `codex --version`.

**Criterion 72:** met. (I1) The update fixture's case of
`scripts/test-launchpad-update.mjs` ("WO-276 criteria I1 and I2"): with the
seeded first order and `docs/control/budgets.json` changed by the instance
and by the incoming revision since their merge base, and a merge commit
that carries Git's merged bytes for both, `node scripts/launchpad.mjs
update --publish --title <title> --body-file <path>` refuses before any
push, naming both paths, the `git checkout <the instance's side> --
<paths>` command and `--take`. With a merge commit that holds the
instance's bytes for both it proceeds; with `--take` naming the budgets
file and the first order restored by the printed command it proceeds and
prints `taken: docs/control/budgets.json`. The file only the starter
changed, the file it added and the kit file are in no refusal. With `main`
merged into the branch after the update's merge, the same commit is judged,
the same paths are named and the restore names the instance's side of that
merge, never `main`'s later tip. `part-i/publish.txt` holds the three
outputs. A second case holds the choice of the merge over small histories,
every one an attacker built among them
([D065](decisions.md#wo-276-d065--part-i-as-built-an-updates-merge-keeps-the-instances-bytes-the-preview-lists-the-files-both-sides-changed-a-surface-the-instances-emit-wrote-is-re-emitted-and-every-spelling-of-a-worker-launch-counts)).

**Criterion 73:** met. (I2) The same case: `node scripts/launchpad.mjs
preview --from <revision>`, run from the incoming tree's script, lists both
paths as `both changed:` rows under the line that says to keep this
instance's bytes, above the kit's rows, and lists none of the three files
criterion 72 says are never named. `part-i/preview.txt` holds the section.

**Criterion 74:** met. (I3) The harness case "WO-250 a gate or a kit launch
is found by its script's path whatever Node options stand before it": one
use for each of `npm run worker -- review`, `npm run --silent worker --
review`, `npm run worker --silent -- review` and `node scripts/worker.mjs
review` (`part-i/results.json`, `launches`), and for the other spellings
npm runs as that launch; the hook's own totals are held by the case "WO-250
every use counts". Step I3 says that the npm argument reader is unchanged;
[D070](decisions.md#wo-276-d070--the-fourteenth-critic-and-rolling-reviews-22-and-23-judged-the-gate-refusal-the-launch-count-and-the-dispatch-bound-read-a-package-managers-line-the-same-way-the-release-tables-writer-renders-a-stale-index-on-a-rerun-and-the-duplicate-title-rule-reads-the-shard-helpers-aliases) widened it, so that the gate refusal, the launch
count and the dispatch bound read a package manager's line the same way,
and the spellings this line counts are read by the widened reader.

**Criterion 75:** met. (I4) The kit guide's §Taking upstream updates states
the rule (a file both sides changed keeps this instance's bytes; a closed
order's text is restored, never merged), the preview's section, the
publish's judgment with its refusals, `--take` and the `re-emitted:` row;
§Opting in to instance actions says which update route its first sentence
describes; each links D065. `node scripts/docs-check.mjs` passes; `npm run
test:docs` runs at the order's end (step Z3).

**Criterion 76:** met. (I6) The subtest "WO-276 criterion I6" of the export
update case: an instance whose harness manifest its own emit wrote, and
whose `node scripts/harness.mjs check` passes, is shown `re-emitted:
.claude/harness-manifest.json` by the update's plan and by the preview and
is refused nothing; the same file edited by hand, where the check fails,
is refused as locally modified with the row saying which; and a preview
that meets no such file runs with nothing installed. After FINAL-001 (F8)
the plan asks that check only where every compiled runtime file holds
bytes a kit wrote, and verification compares every file before it asks:
the case named for F8 holds both orders with a stand-in check that
records each run [D174](decisions.md#wo-276-d174--kit-verification-and-an-updates-plan-compare-every-carried-compiled-runtime-file-before-any-of-the-instances-code-runs).

**Criterion 77:** met. (J1) The harness case "WO-276 criterion J1": in a
fixture instance whose models file adds a model and whose configuration
binds `default` and `verifier` to it for Claude, emit writes
`.claude/agents/dotln-worker.md` and the phase definitions with that
model's id and effort (the verifier's with its own effort) and check
passes, where before that emit it names drift; a definition edited by hand
is drift, and so is the table changed with no emit (the kit's own model
given another id in the models file); with neither stated, or both stating
nothing, the emitted definitions, the role text and the session hook are
byte for byte the ones the tree emitted from an instance that never held
them. The harness case "WO-276 no worker definition and no sentence of a
role's text is tied to a model" holds the rest: the emitted tree has the
one worker definition and the four phase definitions and no Codex agent
file, and no role root or instruction file of either host holds a model id
the kit lists or a model's name. The subtest "WO-276 criterion J1" of the
export update case runs the commands themselves in an exported instance:
after `node scripts/harness.mjs emit` and a passing `check`, the update's
plan and the preview refuse nothing (`0 refused`), and `node
scripts/launchpad.mjs verify` reports no file as differing and counts the
harness surfaces the instance's own emit wrote; the same definition edited
by hand differs. `part-j/dotln-worker.emitted.txt` is the definition an
exported instance's own emit wrote, and `part-j/results.json` holds the
exit codes of the check before it, the emit and the check after, with the
names of the emitted definitions
([D077](decisions.md#wo-276-d077--worker-models-as-redesigned-on-the-operators-direction-models-are-rows-of-data-workers-are-names-an-instance-binds-to-them-one-resolver-and-two-commands-answer-every-launch-and-no-worker-definition-hook-or-sentence-names-a-model)).

**Criterion 78:** met. (J2) Each launch takes its answer from the one
resolution. The review helper: the case "WO-276 criteria J2 and J4" reads
the dry run's printed launch (`--model model-a --effort high` on Claude
Code; on Codex the default's configured effort, a named worker's, and an
effort given for the one launch), and the evidence script runs `node
scripts/worker.mjs review --kind criteria --host claude --order WO-001
--dry-run` in an exported instance. The refuter: the direct-command case
of `scripts/test-plan-refutation.mjs` runs `plan refute --model <name>` on
a launchpad with a planning pass and reads the launch it prints, by the
model's name and by its exact id, which is what `npm run worker -- show`
prints; the evidence script reads the same launch from the command's own
function, since a fresh export holds no pass for the command to judge.
`show`: the worker-table case reads it for each provider (a Claude
session's launch of the one definition, by family and printed as not exact
for a model the definition does not hold; a Codex spawn by exact id and
effort with the worker's rules as its preamble; the note that names the
kit's commands where the session cannot make the launch), and the evidence
script runs `node scripts/worker.mjs list` and `show night-review` in the
instance. The drive: the harness case reads the phase definition for the
executor and for the verifier on both hosts, `default`'s model and effort
in the first and `verifier`'s in the second, and the drive's own builder
puts a definition's model and effort in the session's arguments. Forty
workers of an instance's own, several on one model, each resolve on their
own in the worker-table case, with the default restated beside them and
changing none; a launch that names nothing runs `default`.
`part-j/launches.txt` holds the listing, the name shown and the three
launches.

**Criterion 79:** met. (J3) The configuration-root case: a `workers`
section or a models file with an unknown key, a binding to a model that is
not listed or is another provider's, a name that would mean two things (a
worker with a model's name; a model whose id is a name; two rows of one
provider with one id), an effort outside its provider's levels, and a
negative price are each refused as the configuration loads, naming the
file and the key; so are a name a launch cannot take, a worker that binds
no provider, a model id of another form or a reserved word, a missing
price class, a price keyed by a name every object inherits, a models file
that is no JSON or carries no version, and a family on a Codex row.
`part-j/refusals.txt` holds the criterion's five messages.

**Criterion 80:** met. (J4) The same review-worker case, with the fixture
launcher's failing double: the failure's message says the model came from
`dotln.models.json#models.haiku and dotln.config.json#workers.default.claude`,
the row that holds the id and the binding that chose it; with nothing
declared it names no file.

**Criterion 81:** met. (J5) The process-debt case "WO-276 criteria J5 and
J6": an order's `meta.json`, written from usage rows by the snapshot's own
writer, holds `uncachedInputTokens`, `cacheReadTokens`, `cacheWriteTokens`
and `outputTokens` per role beside the total, with `null` for the Codex
row's cache write and for all four of a source whose counters the reading
cannot place. A Claude row and a Codex row made from the same counters by
the usage module each have classes that sum to that host's own total, and
the two totals differ. The classes are derived where they are read and the
judged usage source is not edited, a deviation from the step's named file
that D069 records with its reason.

**Criterion 82:** met. (J6) The same case and `part-j/usage.txt`: `npm run
meta -- --usage` prints tokens by class for each order and for each local
calendar day, with the roles under each; an observation made at half past
three in the morning UTC is counted on the evening before in a zone west
of it, and a session observed on two days leaves on each what that day's
observation added. With the instance's `prices` naming the model a session's own
events attest it prints the estimate marked `(an estimate)`; for a model
with no declared price, and for a session no event attests, it prints
`unknown`. The report reads the whole ledger and the retained copies, which
the case shows with an order the meter's pages do not select; a line says
how many of its observations gave no count of the dispatch, and marks a
session whose count fell between observations.

**Criterion 83:** met. (J7) The kit guide's §Kit files and instance files
states what an instance configures (a model, a worker and a provider; the
`workers` section and the models file, each with an example; the two
commands; what is refused when the configuration loads; that emit follows
an edit; how a launch reaches its model on each provider; that the record
states the model that ran) and the report (what it reads, how a day is
counted, that prices are the instance's, in the models file, and an
estimate is marked as one), and links D077;
`scripts/kit/dotln.config.example.json` holds a default and an advanced
worker for each provider with no model id and no price; product 07
§Model-specific notes states the one table and how a session finds and
launches a worker, and the passages of product 07 and the security notes
that named an option or a pinned model now name the `default` worker.
`node scripts/docs-check.mjs` passes; `npm run test:docs` runs with the
complete run the operator asked for after this part (D077) and again at
the order's end (step Z3).

**Criterion 84:** met. (K1) The export file's case "WO-276 criterion K1":
no path of the kit's manifest lies under `extensions/`; the kit-path
predicate answers false for the root, for paths under it and for the same
paths in another letter case, and true for the kit's own; and
`kitManifest`, where an export builds its manifest, refuses a file list
that names such a path, naming it. The same case holds what the guarantee
needs beside the criterion's words: a declared kit action that renames a
root into or out of the root, or adds a field under the instance's
configuration section, is refused, and the configuration-root file refuses
a document root there
([D074](decisions.md#wo-276-d074--part-k-as-built-one-root-that-is-the-instances-by-guarantee-a-settings-fragment-that-only-adds-and-takes-no-pretooluse-hook-and-what-the-host-was-observed-to-do)).

**Criterion 85:** met. (K2) The export file's case "the exported instance
checks runtime, coordination records and explicit diagnostics separately"
commits five files under `extensions/` in an exported instance (a script
that makes a temporary directory, a source the formatter would rewrite, a
`package.json` with its lockfile and a JSON Lines file) and then runs `npm
test`, `npm run test:docs` and `npm test -- --review` there, each passing,
and `node scripts/harness.mjs emit` and `check`, both passing; the instance
is still a kit root and no file under the root is rewritten or added. The
case failed once, on the temporary-root scan, before that scan was taught
the root. `part-k/k2-outputs.txt` holds the four outputs from the evidence
script's own instance.

**Criterion 86:** met, with the hook under an event the merge takes. (K3)
The harness case "WO-276 criterion K3": with a fragment that declares one
hook and one permission rule, check names drift until emit runs, emit
writes a `.claude/settings.json` that holds every entry the kit emits
without it, key by key and in place, and both of the fragment's, and check
passes; with the fragment removed, or adding nothing, emit writes the bytes
it writes with none, the manifest's among them; and emit refuses, naming
the key and writing nothing, a fragment that would replace an emitted entry
(`autoMemoryEnabled`, `attribution`), one that names a key the merge does
not define (`env`, `disableAllHooks`, `permissions.defaultMode`) and one
with `null` where a list belongs. The hook is under `PostToolUse`: a hook
under `PreToolUse`, `SubagentStop` or `UserPromptSubmit` is one of the
refusals, for the reasons D074 and D075 give, as are a hook the kit
registers itself, the kit's own rule written into another list and a
character a reader cannot see. The
target harness file's case of the same name: a target worktree's emitted
settings hold the hook and the rule, its check passes, a refused fragment
stops the emit before a write, and with the fragment removed the bytes are
the ones emitted with none. The subtest "WO-276 criterion K3" of the export
update case runs the commands in an exported instance: after its own emit
and a passing check, the update's plan and the preview refuse nothing, and
`node scripts/launchpad.mjs verify` reports no file as differing and counts
the surfaces the instance's emit wrote. `part-k/merged-settings.txt` and
`part-k/refusals.txt` hold the merged file and the refusals,
`part-k/results.json` emit's and check's times before and after, and
`part-k/host-observation.txt` what the host itself did with the merged
file in seven runs: the kit's guard and a deny rule added through the
fragment each refused a call beside an allow rule that names it, and each
call ran where the guard's condition, or the rule, was absent.

**Criterion 87:** met. (K4) The configuration-root file: a configuration
whose `extensions` is an object loads with that object returned as written,
nested values and all, an absent section loads as an empty object, and an
array, a string, a number, `null` or `true` in its place is refused naming
the section.

**Criterion 88:** met. (K5) `bash scripts/test-resume.sh`: the status
output's first key is `schemaVersion`, 1, and both of its exact status
expectations hold with it. `part-k/status.txt` holds the output's first
lines in an exported instance, and the empty array the list of all orders
prints there, which carries none.

**Criterion 89:** met. (K6) Two cases of
`scripts/test-target-worktree-start.mjs`, one for each kind of order. A
target order whose launchpad change lies only under `extensions/`: the
selection prints the target gate and the document gate and says that the
paths are the instance's own and owe no kit suite. A self order, which is
what an instance's order for its own tool is: the same, with the document
gate alone; with launchpad source beside the paths, with a path that only
resembles the root, or with a criterion that names `npm test`, it owes the
complete run as any launchpad order does.

**Criterion 90:** met. (K7) The kit guide's §Extending this instance states
the root's guarantee and what still reads the root, the fragment with the
subset it takes, the configuration section, the three outputs a tool may
read, and each of the six placement rules, links the rule on what an
instance sends core in §Planning in this instance, and links D074; §Hooks
and §Kit files and instance files point to it where they spoke of the
ignored local file alone. Product 07 §Workflow closeout and releases
states that a release that changes a listed output says so in its Read
before upgrading. The export file's heading list holds the new section.
`node scripts/docs-check.mjs` passes over the repository; the document
gate itself runs once, at the order's end (D028).

**Criterion 91:** met. (L1) `scripts/test-launchpad-export.mjs`, the case
named for criterion L1: a fresh export's `docs/repositories/README.md`
states that the profile is the entry and the index, the area-note
convention with its block's two fields (`paths` and `commit`), the
sentence on an observation order and the agent-skills section, and holds
no Markdown discovery block; its worked note, for an invented target, is
one the shared reader takes, and the page itself is no note
([D086](decisions.md#wo-276-d086--part-l-as-built-area-notes-beside-a-targets-profile-read-by-the-document-check-and-the-briefing-and-one-sentence-in-three-roles)).

**Criterion 92:** met. (L2) `scripts/test-docs-check.mjs`, the case named
for criterion L2, through the function and through `node
scripts/docs-check.mjs`: a note whose block lists paths and a commit
passes, at any depth under the profile's directory; a block that lacks
either field fails naming the file, the block's line and the field, as do
an empty list, a path that leaves the target or holds a control
character, a shortened or symbolic commit, an unknown field, a block that
is no JSON object, a second block and no block; and a profile with no
directory passes. [part-l/docs-check.txt](part-l/docs-check.txt) holds the
command's own lines in a fixture of two registered profiles.

**Criterion 93:** met. (L3) `scripts/test-target-worktree-start.mjs`, the
case named for criteria L3 and L4: in the target fixture with a profile,
two area notes and an order whose header names a workstream that has a
Rules section, the execution, verification and final-review briefings
each print the profile's path, both notes with their paths and commits,
and the workstream document's path with the line of its Rules section. A
second case holds an order with no profile, with a profile and no note,
and with no workstream to what it has.
[part-l/briefings.txt](part-l/briefings.txt) holds the lines.

**Criterion 94:** met. (L4) The same case: after two commits in the
registered clone touch one note's paths the briefing prints two for that
note and zero for the other; a note written at a commit the clone does not
hold prints `unknown`, as does a note whose block cannot be read, and the
briefing completes. A third case holds the count itself: a tree's or a
blob's id is no commit, and a shallow or a partial clone gives `unknown`
and starts no transfer.

**Criterion 95:** met. (L5) The rule-record case of the skeleton suite
holds the sentence, the record `area-notes`, in the emitted roots of the
executor, the verifier and the reviewer, once each in both skill roots,
and in no other role's; `node scripts/harness.mjs check` passes over the
installed roots (41 generated surfaces). The rule table holds the record
with a reason for each of the three roles it leaves out; its comparison
with the records is the document case beside the rule-record case
(criterion 51). The `skeleton` suite is left to the order's complete run;
it passed as a single gate at 03:29 UTC on the tree the part began on.

**Criterion 96:** met. (L6) The kit guide states the convention and the
briefing's lines in §First steps, where a target is registered, and the
recipe for studying a large target area by area in §Planning in this
instance, which links D086 (§First steps, an entry point, links no
record and points there). Product 12's sentence says what the briefing
names and what a role reads; product 07 §Research and guided-operator
work orders gains the area note as a research order's deliverable; and
core's repository profile page states the convention beside its item on
discovery conventions, which is as step B7 left it. Each links D086.
`node scripts/docs-check.mjs` passes over the repository; the document
gate itself runs at the order's end (D028).
**Criterion 97:** met. (M1) `scripts/test-target-worktree-close.mjs`, the
case named for criterion M1 in the close fixture, the order's change of
two commits landed on the target's base through a second clone: placed
there as one new commit, the branch no ancestor of the base, the dry run
and the publishing close both proceed and print the base commit matched
(`one commit holds the branch's whole change, <commit> (a squash); 2 base
commits read`); with each of the branch's commits replayed they proceed
and print the two commits (a rebase); with a merge commit they proceed as
before (`the branch is merged`). The function's own cases hold the three
readings and the count without a close fixture.
[part-m/close-outputs.txt](part-m/close-outputs.txt) holds the close's
lines ([D087](decisions.md#wo-276-d087--part-m-as-built-a-target-order-closes-when-its-base-holds-the-reviewed-change-by-ancestry-a-squash-or-a-rebase-or-under-a-commit-named-for-it-the-instance-lists-its-authors-and-the-drive-settles-a-targets-own-release)).

**Criterion 98:** met. (M2) After FINAL-001 (F1) a rebase match takes one
base commit for each of the branch's, in its order: the case named for
that rule holds the review's shape (a branch that changes, reverts and
changes again, three of four replayed) as not merged, the whole branch
replayed as merged with four base commits, and a replay in the other order
as not merged [D167](decisions.md#wo-276-d167--the-closes-rebase-rule-takes-one-base-commit-for-each-of-the-branchs-commits-in-the-branchs-order); the base's commits are read in
topological order, and the close's refusal names a rebase that left out a
commit the base already held among its causes
([D178](decisions.md#wo-276-d178--the-ladders-first-round-eleven-findings-from-three-reviewers-five-of-them-in-a-criterions-class-each-closed-as-its-class-with-a-case)). The same file, the case named for criterion
M2: with a base that does not hold the change the close refuses in both
modes, both worktrees retained, and its message names `--merged-as
<commit>` with the count of base commits read; with `--merged-as` naming
the commit of an edited squash in the fetched base it proceeds and prints
that commit and its subject; with `--merged-as` naming a commit that is
not in the base (the branch's own tip) it refuses naming the commit, as it
does for a commit of the base that touches none of the change's paths and
for a name that is no commit. The command the record keeps to run again
repeats no refused name and keeps an accepted one.

**Criterion 99:** met. (M3) `scripts/test-configuration-root.mjs`, the
case named for criterion M3: with `contributions.authors` listing two
identities a commit by either passes the sign-off rule without a trailer,
a third author's fails without one and passes with one, and a malformed
entry, a repeated one and a value that is no list are refused when the
configuration loads, the entry by its index.
[part-m/signoff.txt](part-m/signoff.txt) holds the rule's lines and the
three refusals.

**Criterion 100:** met. (M4) The kit guide's section Working as a team on
one instance states the six conventions, what is one at a time and what
runs side by side, the author list and the two repositories' merge rules;
§First steps, §Releases in this instance and §Kit files and instance
files say the same of merge commits, a target's merge and the list; each
links D087. Product 07 §Independent workflows and integration states the
merged check. `node scripts/docs-check.mjs` passes over the repository;
the document gate itself runs at the order's end (D028).

**Criterion 101:** met. (M6) `scripts/test-drive.mjs`, in the case of the
target's roots: for a close record of this activation that is no dry run,
with the launchpad's publication `not-attempted`, a declared target
policy, the cleanup clean with the branch deleted and the target removed,
a target outcome of `published` (or `current`) reads as released and
the route holds no further step; `prepared` routes to the release close,
as do `not-attempted`, `partially-published` and `refused`; a
`no-release` close routes as before. A later dry run or stopped attempt
that rewrites the record changes none of it.
[part-m/status.txt](part-m/status.txt) holds the route `npm run resume --
status` prints for the three records in the close fixture.
After VER-002 (F7) the route reads the close's whole history, the
record's own attempts and the archives it names, through the reader the
close itself uses. The case named for criterion M6 holds a settled close
released through twelve later attempts, not released after a reactivation
or where an archive cannot be read, and an archive name outside the order's
history not followed ([D131](decisions.md#wo-276-d131--the-repair-of-ver-002-ten-findings-in-code-each-closed-as-the-class-it-names)).
**Criterion 102:** met. (N1) `scripts/test-configuration-root.mjs`, the
case named for criterion N1: a registration with `records` set to
`instance` or `target` loads; `Instance`, `launchpad`, an empty
string, `null`, `true` and a list are each refused naming
`repositories.target.records`; and a registration without the key reads
`target` ([D090](decisions.md#wo-276-d090--part-n-as-built-a-registration-says-whether-its-orders-records-are-filed-into-the-target-or-stay-in-the-instance-mains-value-governs-every-reader-and-a-committed-records-binding-decides-an-order-in-flight)).

**Criterion 103:** met. (N2) `scripts/test-target-worktree-publish.mjs`,
the case named for criterion N2, in the target fixture with the
repository registered `instance`: an order that has passed its final
review is offered no `target-records` step (`status --json`), `resume
target-records` is refused naming the setting, and the order's own
publish and the target's publish both proceed, each run as its command.
The target's published head is the commit the final review bound; its
tree holds none of the four record paths; and the order's branch on the
instance's origin holds the order's text, its decisions and its two
reports. [part-n/records.txt](part-n/records.txt) holds the lines and the
two listings.
The fixture keeps its documents under `records/` and marks that root as
documentation in `.gitattributes`; criteria N2 to N4 are judged with the
mark in place. Without it the same order's own publish is refused for
want of a test row, since the gate's code identity then counts the
order's records commits as code: the case named for the twenty-seventh
critic holds that refusal, and product 07's roots paragraph states the
mark as what an instance with a moved root sets
([D093](decisions.md#wo-276-d093--part-o-begins-on-checkpoint-43-an-initiatives-layout-is-a-section-of-its-workstream-document-planned-items-are-not-orders-and-a-pass-files-the-next-wave-and-the-twenty-seventh-critics-four-points)).
After VER-002 (F2) the reviewed tree is what is judged: a second case
named for criterion N2 holds a change that removes two earlier-cycle
records published at the reviewed commit, and one that removes a record and
edits another refused naming the edited one alone
([D131](decisions.md#wo-276-d131--the-repair-of-ver-002-ten-findings-in-code-each-closed-as-the-class-it-names)).

**Criterion 104:** met. (N3) The same file, the case named for criteria
N3 and N4: with the repository registered `target` the same order is
offered the step; the target publish and the order publish each refuse
without it, naming the missing records event; with it both proceed, and
the published head is the records commit, whose tree holds the four
records.

**Criterion 105:** met. (N4) The same case: an order whose records were
filed under the default publishes them after main's registration changes
to `instance`: the published head is the records commit, and the order
publish prints that its records live in the target at that commit and
that the key is now `instance`.

**Criterion 106:** met. (N5) `scripts/test-plan-first.mjs`, the case
named for criterion N5: with plan-first elected and the repository
registered `instance`, the order's plan-first directory is under the
instance's evidence root, and the plan is proposed, approved and applied
from there, with nothing of it in the target; the case of the target
documents beside it holds the directory under the target's documentation
root for a registration without the key. The fixture cases of criteria N2
and N3 hold the directory to each value in the lifecycle fixture, and the
case of criterion N1 holds the function. The case named for the
twenty-sixth critic carries a plan through the whole lifecycle with
plan-first elected, under each value and across a change of main's value
after the approval: the documents stay where the order's own checkout put
them, the approval stands, and with the documents in the instance both
publishes proceed ([D091](decisions.md#wo-276-d091--part-ns-second-attack-pass-two-failed-gates-and-its-close-only-the-change-is-judged-for-records-the-records-action-reads-mains-registration-or-refuses-a-plan-approved-under-one-value-stands-when-main-changes-and-the-release-notes-keep-their-links-where-records-are-filed)).

**Criterion 107:** met. (N6) `bash scripts/test-work-orders.sh`, the
case of the target record cards: the card of a closed target order with
no records binding whose repository is registered `instance` says
`Records: in this instance` with the key and its value; under the
default with nothing filed it has no Records line; with a binding it
names the repository and the commit, as at the base.
[part-n/records.txt](part-n/records.txt) holds the card of the order of
criterion N2 and of criterion N3 as the index renders them.

**Criterion 108:** met. (N7) The skeleton's case named for criterion N7:
the reviewer's emitted roots state the records step and the commit of the
moved records' removal as the registration's, in both skill roots and in
no other role's; the executor's roots carry the plan-first sentence,
which names the registration's value, where plan-first is elected and not
otherwise, so core's installed roots, which elect it off, carry the
reviewer's sentence alone. `node scripts/harness.mjs check` passes over
the installed roots. The `skeleton` suite is left to the order's
complete run.

**Criterion 109:** met. (N8) The kit guide's §First steps states the key
beside `documentationRoot`, its two values, that an instance working a
team's application repository sets `instance` and that the value is read
from main, and its publish paragraph states the records step as the
registration's; the team section it points to links D090, since §First
steps is an entry point and links no record. `node scripts/docs-check.mjs` passes
over the repository; the document gate itself runs at the order's end
(D028).

**Criterion 110:** met. (O1) `scripts/test-launchpad-export.mjs`, the case
named for criterion O1, on a fresh export's `docs/workstreams/README.md`:
its opening says that for an initiative the document also holds a layout
whose planned items are not member orders; its Layout section, read as a
heading of the page so that one inside a fence does not count, names the
four parts (what exists, what the initiative asks, the way there, what is
unknown) and says that a planned item has no identifier and no order
file and is not a member order; its worked example holds the section's
five headings and a table of planned items and names no order; and the
page's template places the layout's skeleton before the member table,
its marked block as it was.
[part-o/exported-layout-section.txt](part-o/exported-layout-section.txt)
is the exported section. The `launchpad` suite, which step O1 names, is
left to the order's complete run ([D093](decisions.md#wo-276-d093--part-o-begins-on-checkpoint-43-an-initiatives-layout-is-a-section-of-its-workstream-document-planned-items-are-not-orders-and-a-pass-files-the-next-wave-and-the-twenty-seventh-critics-four-points)).

**Criterion 111:** met. (O2) In the exported instance of the planning
fixture (`scripts/test-launchpad-planning.mjs`, the block marked for
criterion O2 in its long case), a workstream document whose layout names
three planned items with no order files, committed with the index
refreshed, passes `npm run work-orders -- index --check` and `npm run
plan -- check`; with a member added to its marked block that has no
order file both refuse, each in the words it prints for the same
document without a layout, which the case compares.
[part-o/runs.txt](part-o/runs.txt) holds the four runs. That fixture's
workstream has no filed member, because its flow admits one judgment a
pass and a member order would need a second receipt; the side with a
filed member is `scripts/test-work-orders.mjs`, the case named for
criterion O2: one member with its order file beside three planned items,
the index and its check pass, the index holds the one member, and a
second member with no order file is refused with or without the layout
in the same words. The fixture of the planning file's separate-track
case carries the layout too, and the plan subject reads its two members
as before. No reader was changed: the parser admits the heading as the
known issue asked. Both rows passed as single gates started by the pre-gate sequence at 10:23 UTC, the second only when the first had passed: `work-orders-fixtures` (1 min 2 s) and `launchpad-planning` (4 min 37 s, on tree `e1d48b572428`), the second on its third start (D096).

**Criterion 112:** met. (O3) The skeleton's case named for criterion O3:
the planner's emitted root holds step O3's sentence in both skill
directories and no other role's root holds it. The record's row is in the
rule table of step F3, which now holds 32 rules, and the table's check
passes. `node scripts/harness.mjs check` passes over the installed roots,
and the export file's case named for criterion O3 holds a fresh export's
planner root to the sentence and its executor's root to its absence.
The `skeleton` and `compiler` suites, which the step names, are left to
the order's complete run.

**Criterion 113:** met. (O4) The kit guide's §Planning in this instance,
the paragraph that begins "For an initiative": the rolling way (lay it
out, file a wave, run it, revise), the layout as the Layout section of
the initiative's workstream document with its four parts, where the team
reads it (in the instance, or in the target's documentation root where a
target-scoped pass publishes a copy), that no check judges what it says,
and that how large an order may be is the instance's own rule; it links
D093. Product 07's §Operator-opened planning pass states the layout as a
planning artifact of an instance. `node scripts/docs-check.mjs` passes
over the repository; the document gate itself runs at the order's end
(D028).

**Criterion 114:** met. (P1) `scripts/test-dispatch-bound.mjs`, the three
cases named for criterion P1. Two half-hours of activity twenty hours
apart, the gap beginning at a turn's end row: the standing reports one
hour worked beside twenty-one elapsed, and a bounded probe runs under the
eight-hour bound. Nine hours of unbroken activity: the standing is
exceeded and its message is, character for character, the one the bound
gave before (the value, the bound and a standing line with one figure),
and the bounded probe is refused with it. One tool call whose start and
end rows are fifty minutes apart: the fifty minutes are counted, also
where a turn ends while a worker's call runs. The standing keeps the
elapsed time since the dispatch as `elapsedMs` beside the worked time,
`workedMs`, and its line prints both where they differ. Five further cases
hold what the attack and the first refutation asked for (D102): no rows,
one long turn and a host that journals no tool call read elapsed time; a
call that never ended; calls of one tool side by side, with and without
their calls named; the sessions of one attempt. `accept-overrun` compares
a ceiling with the worked value (`scripts/test-off-ramps.mjs`, the block
for `WO-111`). `part-p/standings.txt` holds the three standings as
printed. The gate rows are in the Parts table.

**Criterion 115:** met. (P2) Three cases named for criterion P2. In
`scripts/test-harness.mjs` the prompt hook itself, in the harness fixture
with a usage ledger of the day: with a figure above the day's use the
facts carry the day's use and the figure; at the figure they also carry
the stopping advisory; with a dollar figure and a day no price can
estimate they carry the day's tokens and `unknown` for the estimate; with
no figure, the key absent or both fields null, the day's line is absent
and the other lines are the ones printed with a figure, instants and
durations set aside. In `scripts/test-observed-facts.mjs` the line's
wording for each case, and that the facts without it are the facts before.
In `scripts/test-process-debt.mjs` the day's use against the usage
report's reading. Where the estimate is unknown the line still gives what
the sessions that have one come to, and that least amount reaches a dollar
figure as an estimate would (the second attack pass, D103). `part-p/facts.txt` holds the three lines;
`part-p/prompt-cost.json` and `part-p/prompt-timing.json` hold the prompt
hook's timings, and `part-p/standing-cost.json` the standing's.
After VER-002 (F11) the day's least amounts are summed an observation
at a time, so one with no count takes nothing from what another measured.
The process-debt case holds, through the line the prompt prints, a measured
session beside an uncounted one of the same role, of another role, of
another order and one that attests no model, and a host that reports a
total and no cache split ([D131](decisions.md#wo-276-d131--the-repair-of-ver-002-ten-findings-in-code-each-closed-as-the-class-it-names)).

**Criterion 116:** met. (P3) `scripts/test-process-debt.mjs`, the case
named for criterion P3: `readBudgets` refuses a `spend` that is no
object, a `spend.daily` that is a number, a string, a list or null, a
negative, zero, string or boolean figure, and a field other than the two,
each with `Invalid budget:` and the field's own path; it loads tokens,
dollars, both, and both null, which is how the kit's template seeds the
field.

**Criterion 117:** met. (P4) The skeleton's case named for criterion P4:
the executor's emitted root holds the stopping rule and the standing
file's four parts in both skill directories, and no other role's root
names the file. The record's row is in the rule table of step F3, which
now holds 33 rules, and the table's check passes. `node
scripts/harness.mjs check` passes over the installed roots. In
`scripts/test-off-ramps.mjs`, the block `standing101`: an active order's
briefing without a standing file is the base's; with one it is the same
text with one line that names the file; `implementation-ready` removes
the file, prints that it did, and the transition's later assertions hold
as before. A repair is the executor's phase too: the block `standing102`
holds the repair's briefing to the same line and `repair-complete` to the
same removal (D103). `part-p/briefing.txt` holds this order's own briefing both
ways. The `skeleton` and `compiler` suites, which the step names, are left
to the order's complete run.

**Criterion 118:** met. (P5) The kit guide's §Owned cleanup and retention
states that the bound counts worked time and what the standing prints,
linking D102; its §Planning in this instance, the paragraph that begins
"An order may be paced across days", states where the figure is declared,
the line a session is shown and the standing, linking D098, and adds no
second-level heading. Product 07's §Operator recovery controls states the
bound's reading and that a dispatch which names no order starts at its
own session, linking D102; its §Discipline states the standing file
before the handoff sequence, linking D098. `node scripts/docs-check.mjs`
passes over the repository; the document gate itself runs at the order's
end (D028).

**Criterion 119:** met. (P7) `scripts/test-dispatch-bound.mjs`, the case
named for criterion P7: beside the journal of a planner session two days
old on the same dispatch line, a new planner session is bound at its own
dispatch, its standing starts there and counts no complete run made
before it, and it keeps its own start when dispatched again; an executor
dispatched again in the same phase of one order keeps the earlier start.
The same holds for a planner begun by the command, which is bound with
the order the control record selects, and a second router session on one
drive line keeps the earlier start (D102).

**Criterion 120:** met. (Q1) This repository's emitted
`.claude/settings.json` registers the attribution hook for the names the
tool table maps to a shell command and the lint-directive hook for those
it maps to a write, and for no other name; no hook of any event is a
presence hook, and `.claude/hooks/` holds none
(`docs/evidence/WO-276/part-q/settings.json` holds the registrations and
the hook files, for this checkout and for a target worktree's bundle).
The criterion's clause on a name the table does not hold applies wherever
the host's matcher can express that. It does where Claude Code is the
only host, the one host observed to read a matcher that leaves names out:
there a name the table does not hold starts each narrowed hook. This
repository elects Copilot CLI, which shares the settings file and was not
observed on such a matcher, so its matchers list the names of each hook's
kinds, the form the design gives for that case, and a name the table does
not hold starts only the hooks registered for every tool (D106 records the
gap and its follow-up). The harness suite's case named for criteria Q1 and
Q2 holds both forms, in a checkout whose only host is Claude Code and in
one that elects the others, for every name of the table; the compiler's
case named for criterion Q1 holds each form under the readings a host
makes of a matcher, names with a line break among them, and the profile
check's refusals. A target worktree's settings hold the same: the
compiler's `WO-049 target lowering…` and the target suite's cases find no
presence hook in its bundle, and a target installed while its bundle held
one verifies, is replaced without it and is removed (`WO-276 criterion
Q1: a target installed…`). `node scripts/harness.mjs check` passed in the
pre-gate sequence. Both forms were run on Claude Code 2.1.322 (D106).

**Criterion 121:** unmet (contradiction), in one clause; the rest holds
([D106](decisions.md#wo-276-d106--part-q-as-built-with-both-readings-of-what-a-call-costs-in-hooks)). (Q2) The clause: the attribution refusal fires for a shell
command "under each tool name that maps to its kind". The shell kind's
names are Bash, exec_command, Monitor, write_stdin and functions.exec, and
at the tree this part began on the unit judged a command under the first
two alone. A refusal under the other three would be one this part adds,
which the design's parity forbids (this part adds no refusal and tightens
none on any host), so no candidate holds the clause and the design
together. For those three names the hook starts and decides as it did at
that tree. What holds: every case of `npm test -- --only
harness-fixtures` passed at the tree this part ended on (2026-11-12 18:34
to 18:40 UTC, tree `6cb1ea9c8f8f`), Part A's subagent-stop cases among
them, and none of its refusal cases was changed by this part; the cases
edited are the ones that asserted a presence hook's registration, and the
one that pins the worker profiles' bytes, whose digest is unchanged
(D108). The attribution refusal fires for a shell command under Bash and
under exec_command (the case named for criteria Q1 and Q2). The
heartbeat's case passes for each of the four events with a store named,
under operator control and with the adapter unavailable as well, and holds
that a heartbeat that fails changes no hook's answer (`WO-276 criterion
Q2: with a store named…`); a target's permission hook carries it after
its decision (`WO-049 target hooks…`). For a read and a search, which the
narrowed hooks no longer start for, the session journal holds the call's
start and end rows (`each hook the settings register for a tool…`).

**Criterion 122:** met. (Q3) `WO-276 criterion Q3: on a planning branch…`:
through a stand-in Git that notes each call, the hooks before and after a
read and a search make no `git symbolic-ref` call, a write outside `docs/`
and root Markdown is refused by each hook in the words of the tree this
part began on, and a name the table does not hold is asked the branch as a
write is. With the kind test turned off the case failed on the read.
`docs/evidence/WO-276/part-q/counts.json` holds the counts.

**Criterion 123:** unmet (contradiction), in one clause; the rest holds
([D106](decisions.md#wo-276-d106--part-q-as-built-with-both-readings-of-what-a-call-costs-in-hooks)). (Q4) The clause: two snapshots with no file changed between
them "read no file's bytes the second time". The order's known issue for
this part requires the snapshot to read again any file whose times fall
within the tick of the cache's own write, so a file written within that
tick of the first snapshot (two seconds, as built) is read again by the
second though nothing changed between them; no candidate holds the clause
and the known issue together. What holds, by `WO-276 criterion Q4: two
authorship snapshots…`: for files whose times lie more than two seconds
behind the first snapshot the second reads no file's bytes; after one
file changes the next snapshot reads that file alone, and every hash the
session holds equals a read of every output; a file just written is read
again, and a rewrite of the same size is seen. With the two-second rule
turned off the case failed. `docs/evidence/WO-276/part-q/counts.json`
holds each snapshot's files and bytes read; D106 states what the suite
cannot construct.

**Criterion 124:** met. (Q5) `docs/evidence/WO-276/part-q/before.json` and
`after.json` hold the timing rows of the same fifty calls, and D106 states
both readings (400 hook processes and 210) and, for each cut, whether the second shows it.

**Criterion 125:** met. (Q6) The kit guide's §Hooks states which hooks run
for which tools, how a narrowed hook's matcher is written and for which
hosts, that the presence heartbeat has no hook of its own and which hooks
record it, linking D105 and D106; D108, written after the gates, corrects one figure of D106 and is to join that citation at the closing preparation. `node scripts/docs-check.mjs` passes
over the repository; the document gate itself runs at the order's end
(D028).

**Criterion 126:** met. (R1) In kit-root fixtures an order numbered as each
of core's named orders behaves as any other at the ten sites D112 lists.
`docs/evidence/WO-276/part-r/kit-root.json` shows five of them beside
core's own root: the receipt's page carries no added sentence, the
release-note contract is not switched, a feedback edition under that number
takes a revision and its own directory, the plan refuter's brief names no
order of core's and core's persisted correction record is not read. The
cases named `WO-276 criterion R1…` hold the rest: the effort exemption in
the kit-root block of `scripts/test-resume.sh`, the two one-time
continuations and the receipt in `scripts/test-plan-refutation.mjs`, the
index card's delivery line and the ledger duty in
`scripts/test-work-orders.mjs`, the contract in
`scripts/test-release-preparation.mjs`. In core's own root each site
behaves as before, and `npm run plan -- check` re-renders the 68 committed
receipts byte for byte (last run 20:54:10 UTC). An instance's receipt page
of an earlier release, which holds core's sentence, still reads in a kit
root. What this judgment rests on short of the criterion's words, for the
verifier: no case prepares a release in a kit root, so "its passing final
review leaves the release-note contract as it was" is held by the exported
decision over a committed control log and by a pin on the script's source,
and the sites are held in several fixtures, not one (D112).

**Criterion 127:** met. (R2) `docs/evidence/WO-276/part-r/withdrawal.json`:
in a fixture launchpad, `npm run resume -- withdraw --disposition
abandoned` with a reason and a capture, for an order with a file and no
event, records `WorkOrderWithdrawn` at ordinal 1 naming the order's file;
`npm run work-orders -- index` then `index --check` pass with the order
listed under Withdrawn and absent from the sequence; the same command for
an identifier with no file is refused as an unknown order. The cases
`WO-276 criterion R2…` in `scripts/test-work-orders.mjs` (the fold, in
the legacy log and in a segment) and the blocks of
`scripts/test-off-ramps.mjs` (the command, by `--work-order` and by the
order's own branch) hold it; the `resume` gate passed with them.
After VER-002 (F18) the withdrawal of a never-activated order also
records the registered repository its file declares. A further case named
for criterion R2 runs the command for a launchpad order and for a target
order and holds both listed as withdrawn with the index check passing, and
a first-event withdrawal without that identity, or with a malformed one,
refused by name ([D131](decisions.md#wo-276-d131--the-repair-of-ver-002-ten-findings-in-code-each-closed-as-the-class-it-names)).

**Criterion 128:** met. (R3) `docs/evidence/WO-276/part-r/batches.json`: a
batch that leaves a row allocated to an order whose file the change removed
is refused naming the row, with the register's bytes unchanged, and the
batch that re-disposes the row applies and the register reads again. The
case `WO-276 criterion R3…` in `scripts/test-process-debt.mjs` holds
both, and a single request judged the same way (D112).

**Criterion 129:** met. (R4) The case `WO-276 criterion R4: a receipt's
known issue is disposed as a hold is…` in
`scripts/test-plan-refutation.mjs`, through the command itself: after a
receipt with no hold and one known issue, a repair of the order's Cost line
fails the check without a disposition, in the words it failed in before,
and passes after `npm run plan -- dispose <receipt> <known-issue id>
<reason>`; the receipt's two files keep their bytes. Every committed
receipt's stored holds check as they did: `npm run plan -- check` passes
over the 68. Two further cases of that name hold what the attack found: a
row recorded after a later receipt carried its order, and a row dated after
a receipt's episode but in the log when it is written (D112). The
`plan-refutation` gate passed with all three.

**Criterion 130:** met. (R5) The case `WO-276 criterion R5…` in
`scripts/test-plan-refutation.mjs`: an open order whose execution plan
names a declared source of a machinery suite its Preflight field leaves out
gets one `preflight advisory` naming the order, the suite and the file;
an order whose Preflight names the suite gets none; no line names a
structural row or a suite of generated records; and the check's pass count
is the same with and without advisories, an unreadable table included.
`docs/evidence/WO-276/part-r/preflight-advisories.json`: in this
repository the check exits 0 and prints 20 lines for seven open orders.

**Criterion 131:** met. (R6) The rule-record case of the skeleton suite
(`WO-276 criteria F1 and F2…`) holds each emitted root whose role the
`fan-out` record names to the record's text, once, and `WO-276 criterion
R6…` holds that text to the part's rule and the planner's procedure to the
capture rule and the sentence on the preflight advisory; both passed on the
built tree at 20:44:20 UTC, and under the product read guard in the
pre-gate sequence. The installed roots of the executor, the verifier, the
reviewer, the planner and the refuter carry the rule once and release
close's does not, in both skill directories; the installed planner roots
carry the capture rule and the advisory sentence once each. `node
scripts/harness.mjs check` shows the installed roots equal to the emitted
ones (37 generated surfaces, 20:45:46 UTC and again in the pre-gate
sequence). The skeleton suite itself was not a gate of the part: the
order's complete run judges it.

**Criterion 132:** met. (R7) The kit guide's §Planning in this instance
states the three ways an unactivated order leaves, what a capture holds
when a message carries a pasted block, and the re-task rule, and §Releases
in this instance that an instance's order numbers are its own; product 07's
§Operator recovery controls states the withdrawal of an order that was
never activated, and §Operator-opened planning pass the known issue's
disposition, the preflight advisory among the screens and the capture rule.
Each links D109, the part's opening decision, as D108's rule has it; D112,
written after the gates, is to join those citations at the closing
preparation. `node scripts/docs-check.mjs` and `npm run
publication:check` pass (the pre-gate sequence, 20:55 UTC); the document
gate itself runs at the order's end (D028).

**Criterion 133:** met. (Z1) The current repair's complete run, that of the
repair of VER-006, `npm test -- --review`, passed from 15:13:35 to 15:57:05
UTC on 2026-11-14: 48 suites and 125 fresh tasks, none reused, no failures
or unrun tasks, 0 h 43 min. The row names tree `5f3d9341a15c` and code
identity `adba01dad241`; the code and build output were unchanged through
the run, and main and origin/main stood at `0097fcac6` at its start and its
end. The review form supplies the plain `npm test` claim too; no separate
plain run was made. It was this repair's first complete run, after its
combined review's repairs. `npm run test:docs` passed from 15:59:15 to
16:01:40 UTC on the same date: 29 suites and 29 fresh tasks, no failures,
0 h 2 min, at the same code identity. Its document tree `315fa54d98a0`
excludes this order's evidence directory, so these closing evidence writes
retain that pass; it ran once, after the last document edit outside that
directory.

The repair of FINAL-001's complete run, `npm test -- --review --keep-going`, passed from
08:12:24 to 08:58:38 UTC on 2026-11-14: 48 suites and 125 fresh tasks, no
failures or unrun tasks, 0 h 46 min. The row names candidate
`439c9397e568` and code identity `bdf0da6a025a`; the code and build output
were unchanged through the run, and main and origin/main stood at
`0097fcac6` at its start and its end. The review form supplies the plain
`npm test` claim too; no separate plain run was made. The three runs
before it in this repair supply no pass at this identity: two failed and
the third passed before a case the document gate then failed was repaired
([D187](decisions.md#wo-276-d187--the-closing-runs-the-first-two-complete-runs-failed-on-two-consumers-of-this-repairs-changes-each-repaired-as-its-runs-own-the-third-passed-and-main-had-not-moved),
[D188](decisions.md#wo-276-d188--the-document-gate-failed-on-a-case-the-parse-entrys-change-left-its-repair-moved-the-code-identity-and-the-fourth-complete-run-and-the-document-gate-passed-on-the-final-candidate)).
`npm run test:docs` passed from 09:05:20 to 09:08:11 UTC on the same date:
29 suites and 29 fresh tasks, no failures, 0 h 3 min, at the same code
identity. Its document tree `adbc354759d5` excludes this order's evidence
directory, so these closing evidence writes retain that pass. Of the two
document gates before it in this repair, the first failed on the case
D188 repairs and the second passed before D188 and the index page it
regenerated.

## Review

self-review (the repair of VER-006): found 7; fixed 7; recorded 0; rounds 1 (one combined review, a fix dispatch's one); unreviewed 731 lines (the round's repairs in work-order-document.mjs +93 -67, markdown-links.mjs +7 -6 and the test file +212 -63, product 07 +19 -12 and its publication page +1 -1, D193 and D194, meta.json, the decisions index and this file; and the records written after the complete run)

The repair of VER-006 ran the one combined review a fix dispatch runs: one
fresh `dotln-worker` on Claude carrying the three briefs (`claude-opus-5-5`
as its own context named it; no effort readback), over the change since the
tree VER-006 judged (`bba372e5ee2b`) on the tree `7c4f4d621ae3`, with the
failed report's finding and repair rule named and D192 given as a claim to
test. It found seven, two blocking: a wrapped fence hid the criteria after
it, and the first version of this repair refused complete lists whose later
prose wraps onto a number-led line. All seven are fixed or corrected
([D193](decisions.md#wo-276-d193--correction-wo-276-d192-said-the-rule-refused-the-same-lines-as-before-on-a-list-numbered-one-by-one-and-that-the-formatter-keeps-prose-wrapping),
[D194](decisions.md#wo-276-d194--the-repairs-combined-review-a-wrapped-fence-prose-after-a-complete-list-and-a-repeated-number-each-closed-by-holding-the-refusal-to-the-line-readers-items)).
The report is
`docs/control/local/reviews/WO-276/repair-23/since-bba372e5ee2b/round-1-combined.md`.
No reviewer read the round's repairs; the line above counts them, and the
complete run judged them.

self-review (the repair of FINAL-001): found 21; fixed 19; recorded 2; rounds 3 (a full ladder: criteria, design and consistency; their fresh rechecks; one combined round); unreviewed 602 lines (the combined round's three repairs, the repairs the closing runs and the document gate called for, and the records written after the ladder's last round)

The repair of FINAL-001 ran the full ladder the operator asked for in
place of the one combined review a repair runs
([D165](decisions.md#wo-276-d165--the-operators-directions-at-the-start-of-the-repair-of-final-001-the-astra-meta-critic-on-its-clock-with-its-findings-kept-a-full-review-ladder-of-opus-55-workers-at-the-end-and-a-worker-cap-of-50)),
each reviewer a `dotln-worker` on Claude (`claude-opus-5-5` at `xhigh` as
requested; the host printed no readback). Round 1, three fresh reviewers of
the repair's change since recovery checkpoint 87 on the tree
`55b75a16d1f4`: fifteen findings, eleven distinct, five in a criterion's
class, nine fixed and two recorded
([D178](decisions.md#wo-276-d178--the-ladders-first-round-eleven-findings-from-three-reviewers-five-of-them-in-a-criterions-class-each-closed-as-its-class-with-a-case)),
after three format-only re-tasks for a field the brief never named
([D182](decisions.md#wo-276-d182--the-forty-first-critics-four-points-a-shared-repairs-consumers-not-listed-before-it-exit-statuses-read-from-the-logging-a-return-field-the-brief-never-named-and-a-requested-setting-given-as-what-ran)).
Round 2, three fresh rechecks on checkpoint 90's tree `fc60d72b59fe`, each
brief carrying the complete return contract: eight findings, seven
distinct, all fixed
([D183](decisions.md#wo-276-d183--the-ladders-second-round-two-regressions-the-first-rounds-repairs-left-or-made-each-closed-as-its-class-and-five-lesser-findings)).
Round 3, one combined worker over the change since that tree, on
checkpoint 91's tree `f0a0526938f3`: three findings, all fixed after the
round
([D185](decisions.md#wo-276-d185--the-ladders-third-round-the-criteria-class-closed-by-reading-every-block-after-the-closing-one-to-the-first-ordered-list-a-reading-wo-276-d183-rejected-on-a-reason-that-did-not-hold)).
The reports are under
`docs/control/local/reviews/WO-276/repair-20/since-b4e69a6ed6c9/`:
`round-1-criteria.md`, `round-1-design.md`, `round-1-consistency.md`,
`round-2-criteria.md`, `round-2-design.md`, `round-2-consistency.md` and
`round-3-combined.md`. No reviewer read the changes after round 3's tree:
its three repairs, the repairs the first two complete runs called for
([D187](decisions.md#wo-276-d187--the-closing-runs-the-first-two-complete-runs-failed-on-two-consumers-of-this-repairs-changes-each-repaired-as-its-runs-own-the-third-passed-and-main-had-not-moved))
and the records written since; the line above counts them.

self-review (the repair of VER-004): found 0; fixed 0; recorded 0; rounds 1; unreviewed 283 lines (closing decisions, follow-up, handoff and generated records after the combined review; no code changes)

The repair of VER-004 ran one combined review against checkpoint 77's
tree `3f40a7f55b27`, judging checkpoint 81's tree `434e4612b5a1`. The
report is `docs/control/local/reviews/WO-276/repair-18/since-3f40a7f55b27/round-1-combined.md`.
It found no blocking, should-fix or note findings. The default worker ran
on Codex with the configured selection `gpt-6.1-sol` at `max`; host
model and effort readback were unavailable, so its attestation records
unknown. One format-only continuation supplied the required report table
labels and changed no judgment or probe. This was one review and two
worker uses. The executor made no later code change. D149 records the
review; D150 records the failed first gate and D151 the passing second
gate and operator-directed follow-up. No further reviewer was run.

self-review (the repair of VER-003): found 7; fixed 6; recorded 1; rounds 1; unreviewed 977 lines (the changes after the round in sixteen files: checkpoint.mjs +30 -9, the new codex-background.mjs +138, evidence-sources.mjs +5 -2, host-resources.mjs +7 -2, worker-launch.mjs +7, resume.mjs +13 -2, structural-checks.mjs +66 -5, test-runner.mjs +17 -1, four test files +501 -21, the comparison driver +93, the critic launcher +5, the kit guide +11 -1, the execution guide +30 -11)

The repair's one combined review is
`docs/control/local/reviews/WO-276/repair-14/since-78a31bd5da2f/round-1-combined.md`,
recorded by the helper from the default worker's return (Claude,
`claude-opus-5-5` at `xhigh` as the recorder attests, the host printing no
readback; 0 h 21 min, 259,460 tokens). It read the change from the
dispatch's tree `78a31bd5da2f` to tree `3e086f57d7ac`. Its seven findings
and their judgments are in
[D138](decisions.md#wo-276-d138--the-repairs-combined-review-seven-findings-judged-a-rename-by-case-alone-leaves-one-name-again-and-the-feedback-audits-row-is-compared).
One was blocking and was a defect the repair of VER-002 had made, which
neither report had quoted: on a volume that folds case, a rename by case
alone left both names in a snapshot. It is repaired with cases, and five
more findings with it; one is recorded with no code. A fix dispatch runs no
other round, so what followed was read by no reviewer, and it is most of
this repair by lines: the review's own repairs, the reader cache the
fourteenth run called for
([D139](decisions.md#wo-276-d139--the-fourteenth-complete-run-failed-in-two-suites-neither-on-the-repairs-own-change-a-nested-gate-refused-on-the-hosts-memory-pressure-and-a-lane-case-met-a-reader-cache-that-answered-for-the-wrong-directory-which-is-repaired)),
the admission of a gate started inside a running gate
([D140](decisions.md#wo-276-d140--a-gate-started-inside-a-running-gate-stands-on-that-gates-admission-at-warning-memory-pressure-on-the-operators-direction-that-a-suite-which-cannot-run-on-this-machine-is-defective))
and the repair of what that change broke
([D143](decisions.md#wo-276-d143--the-kit-closes-the-background-server-codex-leaves-running-the-sixteenth-complete-run-is-stopped-for-that-change-the-critics-record-and-clock-are-brought-up-to-date-in-the-repair)),
the check of the file-events daemon
([D142](decisions.md#wo-276-d142--a-gate-shows-the-file-events-daemons-size-at-every-start-and-refuses-above-1-gib-after-a-restart-showed-the-daemon-healthy-and-a-measured-comparison-showed-that-where-the-gates-files-are-made-does-not-matter),
corrected in
[D144](decisions.md#wo-276-d144--correction-what-the-daemon-comparison-established-and-what-wo-276-d142-and-the-gates-refusal-said-beyond-it-the-thirty-seventh-critics-three-points))
and the closing of the background server Codex leaves running
([D143](decisions.md#wo-276-d143--the-kit-closes-the-background-server-codex-leaves-running-the-sixteenth-complete-run-is-stopped-for-that-change-the-critics-record-and-clock-are-brought-up-to-date-in-the-repair)).
The seventeenth complete run judged them
([D145](decisions.md#wo-276-d145--the-seventeenth-complete-run-passes-on-the-candidate-the-repair-of-ver-003-leaves-the-restarted-daemon-stayed-flat-under-it-a-critic-launched-after-the-pass-is-stopped-on-the-operators-direction)).
The last three of those are not repairs of VER-003's findings: the operator
directed each during the repair, and the final review is asked to read
them as new code that no reviewer has seen. The meta critic ran twice in
the repair, eight points in all, each accepted
([D141](decisions.md#wo-276-d141--the-fifteenth-complete-run-is-stopped-on-the-operators-direction-what-is-and-is-not-established-about-the-file-events-daemons-memory-the-thirty-sixth-critics-five-points-and-the-two-things-this-session-could-not-do-itself),
[D144](decisions.md#wo-276-d144--correction-what-the-daemon-comparison-established-and-what-wo-276-d142-and-the-gates-refusal-said-beyond-it-the-thirty-seventh-critics-three-points));
a third launch, made after the passing run, was stopped unreturned on the
operator's direction ([D145](decisions.md#wo-276-d145--the-seventeenth-complete-run-passes-on-the-candidate-the-repair-of-ver-003-leaves-the-restarted-daemon-stayed-flat-under-it-a-critic-launched-after-the-pass-is-stopped-on-the-operators-direction)).

self-review (the repair of VER-002): found 6; fixed 5; recorded 1; rounds 1; unreviewed 367 lines (the repairs after the round in nine files: checkpoint.mjs +36 -25, host-doctor.mjs +36 -17 with the comment the twelfth run refused, plan-continuation.mjs +7 -5, work-order-document.mjs -7, three test files +87 -1, the comparison driver +135 -2, the kit guide +7 -2)

The repair's one combined review is
`docs/control/local/reviews/WO-276/repair-12/since-f9adffa2fb49/round-1-combined.md`,
recorded by the helper from the default worker's return (Claude,
`claude-opus-5-5` at `xhigh` as the host recorded the launch; 0 h 18 min,
250,551 tokens). It read the change from the dispatch's tree `f9adffa2fb49`
to tree `8d88a1b909e1`, with VER-002 and the two repair decisions as
assigned inputs. Its six findings and their judgments are in
[D133](decisions.md#wo-276-d133--the-repairs-combined-review-six-findings-judged-two-regressions-of-the-repair-itself-repaired-with-cases).
Two were blocking, and both were regressions the repair itself had made:
the snapshot, as first repaired, lost a change to a file Git is told to
assume unchanged or to skip, and the execution-record rule, as first
repaired, refused plain emphasis that opens a line. Both are repaired with
cases. Two more were taken: a tool whose version cannot be read was
reported missing, and the classes the comparison evidence names for a whole
comparison were not tested difference by difference; the test, once
written, found a second kind of difference in the work-order cards on its
first run. One note was taken (the kit guide states the host report's limit
at a space in a path) and one is recorded with no code: that naming the
mission capsule's wider objective clause a defect of the old reader is a
judgment, which the final review is asked to weigh. A fix dispatch runs no
other round, so the repairs after it were read by no reviewer. The twelfth
complete run then stopped in its preflight on a comment one of those
repairs had written, the comment was reworded, and the thirteenth run
judged them ([D134](decisions.md#wo-276-d134--the-twelfth-complete-run-stopped-on-a-comment-this-repair-wrote-and-the-thirteenth-passes-on-the-repaired-candidate)).
The earlier research for the comparison evidence was one worker, launched
once and re-tasked once; it wrote nothing in the repository, and every
result it reported was rerun before it was recorded
([D132](decisions.md#wo-276-d132--the-reader-comparisons-are-audited-reader-by-reader-and-completed-and-what-they-found)).

self-review (the repair of VER-001): found 6; fixed 3; recorded 3; rounds 1; unreviewed 190 lines (the repairs after the round in three files: comment-labels.mjs +19 -25, its test file +66, the comparison script +75 -5)

The repair's one combined review is
`docs/control/local/reviews/WO-276/repair-11/since-a6811f85a332/round-1-combined.md`,
recorded by the helper from the default worker's return (Claude,
`claude-opus-5-5` at `xhigh` as the host recorded the launch; 0 h 12 min).
It read the change from the dispatch's tree `a6811f85a332` to tree
`2ff145387523`. Its six findings and their judgments are in
[D128](decisions.md#wo-276-d128--the-repairs-combined-review-six-findings-judged-the-line-count-it-broke-repaired-with-a-case-the-here-document-dialect-recorded-with-a-follow-up):
fixed, the line count taken from the compiler's line map (blocking, with a
case), a case pinning one start of the compiler's interface a check, and
the comparison's header; recorded, here-documents in other languages
(FUP-5d58f2b322fe5ff7), the Part B inventory's dated row and the
uncommented scanner comment reader. A fix dispatch runs no other round, so
the repairs after it were read by no reviewer and the eleventh complete run
judged them.

The execution's review, before VER-001:

self-review (the execution, Parts A to Z): found 348; fixed 309; recorded 39; rounds 104 (two combined launches, fifty-three rolling whole-change reviews, eight attack reviews of closed parts, six of Part I, five of Part J, two of Part K, one of Part L, two of Part M, two of Part N, three of Part O, two of Part P, two of Part Q and four of Part R, the mid-order ladder's three rounds: a first round of four whose nine findings are the reviewFindings of D080, a recheck round of three with four new findings, and a last combined round on the difference with two, all fifteen fixed; and the closing's round of four, whose three findings are the reviewFindings of D117, all fixed; neither round of four is a paired measurement, since in each the combined worker was given a different change from the three kinds (D118), and the order records no paired round; D027, D040, D063, D064, D076, D077, D078, D080, D081, D082, D100, D102, D103, D106, D108, D110, D112, D114, D116, D117, D118, D120, D121, D122). Of the thirty-nine recorded, twelve are the notes held for the closing preparation, each declined there with its reason and given to planning in one follow-up (D114; a thirteenth, Part D's on the test files a sharded row loads, was repaired there with a case and is counted as fixed; rolling review 50's, on the installed role roots being composed by position, joined them in Part R; rolling review 48's, on the daily line's import of the metadata module, joined them in Part Q; rolling review 37's, on the update's per-path Git reads, joined them in Part M, rolling review 32's, on the shard helper, left them when Part M repaired it, and rolling review 44's two, on the configuration's models file and the doctor's reading of a compiler failure, joined them in Part P), twenty-two are limits or consequences stated in the decisions (three of them Part Q's: the time a hook that carries the heartbeat takes with a store named, a hook whose output the reader closed early, which records no heartbeat, and criterion Q4's first sentence against the order's known issue; three of them Part P's: a call still running when the standing is read, calls of one tool side by side on a host that names no call, and a session with no tool call, which reads elapsed time; four of them Part M's: a squash reverted since, a base that changed lines beside the change, a retry's summary after a partial close, and a partial clone of the target, which the drive leaves to the attended close; one Part N's: a plan-first directory that follows the order's own checkout while its records follow main's), four are declined (the fourth in Part Q: a profile declaration that names a kind its unit does not judge, which the declaration alone states) and one is a defect the fifth attack pass on Part J found and the part leaves with a follow-up (D078: `show` judging a launch against the table before an emit); a part of another of that pass's findings is left the same way (a receipt filed now still admits the retired worker types); the note four rolling reviews recorded, the release table's, is repaired and counted as fixed (D065 to D075). Two of Part R's fourteen attack findings are repaired in part and counted as fixed, their other halves declined in D112: a revisionless feedback edition under an instance's own order, and the kit-root test's refusal of a malformed root. Lines no reviewer read: the closing round's three repairs (211 lines added and 7 removed in four files), whose two rechecks were stopped unreturned with a paired round one of four (six launches, counted in no round; D118), and the three repairs after the ninth complete run (7 lines added and 4 removed in three test files; D120).

- Part A: `docs/control/local/reviews/WO-276/round-1-combined.md`, three
  findings: a cap accepted during a drive (fixed), a lifecycle worker's stop
  filed under the wrong scope (fixed), the release-close clause of criterion
  6 (recorded unmet then; met since D045)
  ([D030](decisions.md#wo-276-d030--part-as-review-judged-and-the-part-closed)).
- Part B: `docs/control/local/reviews/WO-276/round-2-combined.md`, six
  findings, all fixed: marker comments read by pattern, a regular expression
  after a condition unseen by the screen, the header cut on a lazily
  continued quotation, the classifier's word reader left in the command
  module, comparisons missing for some readers, and the console census's
  count
  ([D038](decisions.md#wo-276-d038--part-bs-review-judged-its-six-findings-repaired-and-the-part-closed)).
- From 2026-11-11 00:21 UTC the operator's two cadences run: one whole-change
  reviewer of a random kind every 30 minutes and one critic of the execution
  every hour; each part's end judges the reports received during it
  ([D040](decisions.md#wo-276-d040--the-bound-is-48-hours-a-reviewer-reads-the-whole-change-every-30-minutes-and-a-critic-reads-the-execution-every-hour)).
- Critic 1 (`docs/control/local/reviews/WO-276/critic-1.md`), six points, all
  adopted: the paired-round array holds paired rounds only, so the arrays of
  the two single reviews above were renamed; Part D's two timed runs differ
  by Part D's steps alone; a part names two or three suites before its
  batch
  ([D043](decisions.md#wo-276-d043--correction-the-paired-round-array-holds-paired-rounds-only-the-first-critics-six-points-judged-what-may-change-between-part-ds-two-timed-runs)).
- Rolling review 1, consistency
  (`docs/control/local/reviews/WO-276/round-1-consistency.md`), three
  findings: the index's refresh staled the roadmap's release table and the
  table's writer the index (fixed: each renders the other's page when the
  tag record changes; the index's half of that was replaced the same day by
  a check that admits recorded tags newer than the table,
  [D046](decisions.md#wo-276-d046--correction-two-repairs-of-this-morning-broke-other-consumers-and-are-replaced-what-the-stopped-run-deferred-the-third-critics-points-judged)),
  the single-review arrays (already corrected by D043)
  and a removed index record still named in the workstreams guide and two
  console fixture entries (fixed)
  ([D044](decisions.md#wo-276-d044--the-first-rolling-review-judged-the-tag-records-two-pages-are-rendered-together-and-the-removed-index-record-is-named-nowhere)).
- Rolling reviews 3 to 8 and critics 3 to 6 fell in Part D's window: ten
  findings on Parts A to D, each repaired after the after run with its own
  case and a second consumer's, and one recorded
  ([D051](decisions.md#wo-276-d051--the-reviews-that-fell-in-part-ds-window-judged-ten-findings-on-parts-a-to-d-repaired-after-the-after-run-and-the-screen-sees-a-comparison-through-a-constant)).
- Rolling reviews 9 and 10 (design rounds 3 and 4) and critic 7 fell in
  Part E. Three findings, each repaired: the card cache's list and the
  paired-round report each enumerated the orders apart from the roots every
  reader of the orders lists, and a lifecycle worker's writer was released
  before its stop was judged. The replaced tag D051 recorded is repaired on
  the critic's point, inside the one record
  ([D052](decisions.md#wo-276-d052--correction-a-replaced-release-tag-is-still-named-after-an-index-refresh-rolling-reviews-9-and-10-and-the-seventh-critic-judged)).
- Rolling review 11 (consistency round 5) and critic 8 fell in Part F. The
  review's one finding is repaired: the duplicate-title rule of Part E now
  sees a suite file's own registration function. The critic's three points
  were adopted
  ([D054](decisions.md#wo-276-d054--rolling-review-11-and-the-eighth-critic-judged-the-duplicate-title-rule-sees-a-files-own-registration-function-and-a-shared-repair-lists-its-input-variants)).
- Rolling review 12 (criteria round 3) returned between Parts F and G with
  three findings on Parts B and E, each repaired: the screen's string form
  for a table row, the duplicate-title rule inside module-level loops and
  blocks, and the mission's decision reader, which took a quoted example
  for a decision
  ([D056](decisions.md#wo-276-d056--rolling-review-12-judged-the-screen-sees-a-table-row-read-by-a-string-test-the-duplicate-title-rule-follows-the-modules-control-flow-and-the-missions-decisions-are-top-level-records)).
- Critic 9 fell in Part G: the forecast's two assumptions are kept apart,
  the closing steps have a latest start, and one rule governs a part's
  suites
  ([D058](decisions.md#wo-276-d058--the-ninth-critic-judged-the-forecasts-two-assumptions-kept-apart-a-latest-start-for-the-closing-steps-and-one-rule-for-a-parts-suites)).
- Rolling review 13 (consistency round 6) returned in Part H with two
  findings, each repaired: the duplicate-title rule dropped a repeat inside
  the second branch of a guard, and two follow-up rows re-keyed by Part B's
  reader had not been given the dispositions of the rows they replace
  ([D059](decisions.md#wo-276-d059--rolling-review-13-judged-a-repeat-inside-one-branch-of-a-guard-is-a-duplicate-title-and-two-re-keyed-follow-ups-carry-their-dispositions)).
- Rolling review 14 (design round 5) returned in Part H: its two earlier
  findings held, and its one note is repaired, the resident's owner binding
  its copy of the cards as available after the copy's write had failed
  ([D061](decisions.md#wo-276-d061--rolling-review-14-judged-a-card-copy-that-could-not-be-written-is-bound-as-that-failure)).
- Critic 10 returned as Part I began, three points, all adopted: a
  reviewer's brief has it read files from the tree its report names, a
  part's second suite starts only when the first has passed, and two stale
  statements left the standing file and this section's first line
  ([D062](decisions.md#wo-276-d062--the-tenth-critic-judged-a-reviewer-reads-files-from-the-tree-its-report-names-a-parts-second-suite-waits-for-the-first-and-two-stale-statements-leave-the-recovery-records)).
- Part I's five attack passes (the third cadence,
  [D063](decisions.md#wo-276-d063--the-bound-is-72-hours-and-a-third-cadence-attacks-the-part-in-hand-every-30-minutes)):
  37 findings, 35 repaired with cases and two recorded as stated limits (a
  file the instance renamed takes the starter's change to the old path; a
  launch spelling counted on purpose under either reading of an npm flag).
  The first four passes each broke the choice of the update's merge; the
  fifth left it standing and broke the judgment after it
  ([D065](decisions.md#wo-276-d065--part-i-as-built-an-updates-merge-keeps-the-instances-bytes-the-preview-lists-the-files-both-sides-changed-a-surface-the-instances-emit-wrote-is-re-emitted-and-every-spelling-of-a-worker-launch-counts)).
  The reports are `attack-1.md` to `attack-5.md` in the ignored reviews
  lane.
- The eight attack reports on Parts A to H
  ([D064](decisions.md#wo-276-d064--one-attack-reviewer-over-each-closed-part-once)):
  54 findings, 42 repaired with cases, two stated as consequences of Part
  D's design, eight held as notes for the closing ladder and two declined
  ([D066](decisions.md#wo-276-d066--the-attack-reports-on-parts-a-to-h-judged-forty-two-findings-repaired-with-cases-two-stated-as-consequences-eight-held-as-notes-and-two-declined)).
  The reports are `attack-part-a.md` to `attack-part-h.md`. For the
  verifier: criterion 51's rule table records that the release-close root
  never held the operator-controls rule at the base, which one attacker
  read as a gap and the executor declined to change.
- Rolling reviews 15 to 20 and critics 11 and 12 fell in Part I: twenty
  findings across the six reviews, eighteen repaired and one note recorded
  twice (the release table's writer, held for the closing ladder); the two
  critics' ten points all taken
  ([D067](decisions.md#wo-276-d067--rolling-reviews-15-to-20-and-the-eleventh-and-twelfth-critics-judged)).
  Review 20's one blocking finding was a defect in the repair of Part D's
  attack, reproduced with real host lanes before it was repaired.
- After Part I's checkpoint, three reports changed it: the thirteenth
  critic (the publish takes `--from <revision>`; the hours use whole
  intervals; the held notes are decided before the ladder), a sixth attack
  pass (seven findings, six repaired with cases and one stated: the
  instance's bytes are read from the commits of `main` the branch holds,
  not from a line's tip) and rolling review 21 (the release table's note a
  third time)
  ([D068](decisions.md#wo-276-d068--the-thirteenth-critic-the-sixth-attack-on-part-i-and-rolling-review-21-judged-the-publish-takes-the-revision-it-is-told-and-the-instances-bytes-are-those-of-the-commits-the-branch-holds)).
  Their cases ran under the bounded wrapper; the suites that hold those
  files run with Part J's gates.
- Part J's four attack passes (D063): eight findings, seven, seven and
  four, none rated blocking after the first, all settled; the fourth found
  the withdrawal leaving nothing behind and the emitted text unchanged
  where the section restates nothing. Three passes in a row
  broke the one key of the section that names which option is a host's
  default, each in a place the pass before had not reached; the key is
  withdrawn, a deviation from step J1 that no criterion names, and an
  instance restates what the default option runs instead. The second
  pass's repair uncovered a fault of the first build that no reviewer had
  named: the launch rule nearly fills a role line's bound, so a long model
  id made emit fail. In the usage report the passes and two critics moved
  the reading from the meter's five orders to the whole ledger, from a
  session's last observation to what each observation adds on its day,
  and from a role's latest model to the model of the session that
  attested it, with a mark wherever a figure is not known
  ([D069](decisions.md#wo-276-d069--part-j-as-built-an-instances-workers-section-decides-what-each-worker-runs-one-resolver-answers-every-reader-and-the-usage-report-gives-tokens-by-class-and-by-day-with-an-estimate-from-the-instances-own-prices)).
- The fourteenth critic and rolling reviews 22 and 23 came back during
  Part J. The critic's four points were taken: the two guards' notes held
  since the sixth attack on Part I (a launch through Corepack uncounted, a
  gate through npm's other words unrefused) were repaired at once, and
  pnpm and yarn with them; a model is tied to its session; the whole
  process-debt file runs when a part adds a shared module; the standing
  file's block for the part in hand is kept current. Review 22 returned
  the release table's note a fourth time and it is repaired; review 23's
  one finding, rated blocking against criterion E1, was real and is
  repaired with a corpus file node runs
  ([D070](decisions.md#wo-276-d070--the-fourteenth-critic-and-rolling-reviews-22-and-23-judged-the-gate-refusal-the-launch-count-and-the-dispatch-bound-read-a-package-managers-line-the-same-way-the-release-tables-writer-renders-a-stale-index-on-a-rerun-and-the-duplicate-title-rule-reads-the-shard-helpers-aliases)).
- Part J's gates, the fifteenth critic and rolling reviews 24 to 26. The
  launchpad gate failed once on an expected list that a search for the new
  module's neighbour would have found, and that search is now a rule. The
  critic's four points were taken: what a falling count means was read at
  the producers before the policy was kept, and the report marks it; the
  overdue attacker went out before any further gate; the standing file
  gives the held notes one placement. Review 24 found nothing. Review 25
  returned three findings, each rated blocking and each read, not run:
  two were real and are repaired (a wrapper that registers its title
  twice; an indented bold field's label), and one is declined with its
  reason, the host report's row for `core.autocrlf input` now saying
  what that setting does. Review 26 returned one, rated blocking and real:
  the host report's redaction could rewrite a verdict and with it the exit
  status, so a row's identity and verdict are no longer redacted
  ([D072](decisions.md#wo-276-d072--part-js-gates-the-fifteenth-critic-and-rolling-reviews-24-to-26-judged-a-sessions-count-that-fell-is-marked-wherever-it-is-summed-a-new-module-is-searched-for-beside-its-neighbour-before-the-first-gate-and-a-launch-due-in-a-gate-goes-out-before-the-next)).
- The operator set the whole-change reviewer and the attacker to every 45
  minutes and the critic to every 75
  ([D071](decisions.md#wo-276-d071--the-whole-change-reviewer-and-the-attacker-run-every-45-minutes-and-the-critic-every-75-on-the-operators-word)).
- The operator rejected Part J's worker options after the part closed, and its worker half was rebuilt as one table of models and named workers; the fixed options, the restated option and the withdrawn defaults key are superseded, and the order's text was amended to match ([D077](decisions.md#wo-276-d077--worker-models-as-redesigned-on-the-operators-direction-models-are-rows-of-data-workers-are-names-an-instance-binds-to-them-one-resolver-and-two-commands-answer-every-launch-and-no-worker-definition-hook-or-sentence-names-a-model)).
- Part K (D063, D071): rolling review 27 returned three findings in closed
  parts, each real and repaired with a case; review 28 none. The part's
  first attack pass returned eight, one rated blocking and real (an
  instance's own order that changes only the reserved root was never
  classified); six are repaired with cases and two are stated in the kit
  guide and not changed (the gate's code identity keeps the root; the list
  of all orders prints an unversioned empty array). The seventeenth critic
  asked for a map of every kit program that reads the root before further
  work on the settings fragment, and for criterion 85's fixture first: the
  fixture found a scan the attack pass had read as leaving the root alone.
  It also asked that the claim about the host rest on the kit's own emitted
  bundle: two runs of the host with a merged fragment are saved beside the
  three made with a stand-in guard. A fragment takes no hook under
  `PreToolUse`, since the host was seen to run a call such a hook rewrites
  without showing it to the kit's guards; that the same holds for a hook
  in any settings file the kit does not write is boarded for planning
  ([D074](decisions.md#wo-276-d074--part-k-as-built-one-root-that-is-the-instances-by-guarantee-a-settings-fragment-that-only-adds-and-takes-no-pretooluse-hook-and-what-the-host-was-observed-to-do)).
- Part K's second attack pass (D063): eight findings, two rated should fix. Seven are repaired or corrected. The fragment takes no hook under `SubagentStop` or `UserPromptSubmit` either, on the host's documentation; emit and check agree where the command writes to another root than the launchpad; the guard folds the long s; three more kinds of entry are refused (the kit's own rule written into another list, a hook the kit registers, a character a reader cannot see); the guide's sentences on an instance with no compiled harness and on a target worktree's check are corrected; and two more runs of the host observed what the saved observation had only read. One is stated: a criterion's words claim the complete run by a pattern older than this order, and the guide tells an owner how to name their own tests. The same decision corrects D073, which said no test pins the rung it renamed: one did, and names v2.0.0 now
  ([D075](decisions.md#wo-276-d075--part-ks-close-the-second-attack-pass-judged-the-two-gates-a-test-that-pinned-the-renamed-rung-corrected-and-the-command-reader-corpus-estimated-apart-from-the-closing-preparation)).
- Between Part K and Part L, the session of 2026-11-12 (the operator's
  mid-order sequence): two complete runs. The first (00:28 UTC, 0 h 49
  min) failed four suites, one case each: a fixture copy list, a stale
  rule table, a timing baseline and an integration case that was not
  reproduced. The second (01:58 UTC, 0 h 50 min) failed `skeleton` alone,
  on the product read guard, and the table comparison became a document
  case. Each repair passes alone; none took a review round, a failed run
  judging its own repair, and the two rolling reviews below read them.
  No third complete run was made before Part L; the order's closing run
  is owed as before. The title rule was compared with what node
  registers and now reads a suite file with the suite files it loads.
  The twenty-second critic's three points were taken. Rolling reviews 33
  and 34, both consistency by the draw (rounds 12 and 13;
  `docs/control/local/reviews/WO-276/repair-5/round-12-consistency.md`,
  `repair-9/round-13-consistency.md`): no finding, and the two findings
  of round 11 held. The terms screen listed no line (0 refuse, 0 context
  over 518 changed files)
  ([D084](decisions.md#wo-276-d084--resumed-in-a-new-session-the-stopped-runs-leftovers-and-the-four-failures-of-a-complete-run-repaired-the-title-rule-made-to-read-a-suite-file-with-the-files-it-loads-and-the-two-behaviors-of-part-js-rebuilt-half-left-as-d082-records-them)).
- Part L (D063, D071): its attack pass returned seven findings, six of
  them run: an id that names no commit counted from, a shallow and a
  partial clone counted from (the latter fetching and leaving a helper
  running), a path that could forge a briefing line, a byte order mark
  that hid the block, an unlisted directory passed over and a directory
  matched by a folded case. All seven are repaired with cases. Rolling
  review 35 (criteria, round 14;
  `docs/control/local/reviews/WO-276/repair-9/round-14-criteria.md`): two
  findings in closed parts, a registrar taken by destructuring (criterion
  E1) and a bold label written with underscores (criterion B1), both
  repaired with cases; the two findings of round 13 held
  ([D086](decisions.md#wo-276-d086--part-l-as-built-area-notes-beside-a-targets-profile-read-by-the-document-check-and-the-briefing-and-one-sentence-in-three-roles)).
- Part M (D063, D071): its first attack pass returned eleven findings,
  seven of them run; eight are repaired with cases (a base with no merge
  base, an identity blind to whitespace and path spelling, a merge of the
  branch with its own change, a named commit at or before the fork, the
  flag on a launchpad order refused only after effects, the base's patches
  read up to five times, a base past the read limit, a retry command
  without the flag) and three are left with their reasons. Its second
  pass, a recheck by the same worker, found four more in the repairs: the
  status read looking only at the newest attempt of a close, a refused
  name repeated by the retry command, a declared target's settled state
  lost to a later refusal, and a partial clone left at awaiting-merge with
  a stop that claimed a comparison. Three are repaired with cases and the
  fourth has its stop text corrected and the attended close named; a
  commit named on a rewritten base is left to the person naming it.
  Rolling review 36 (design, round 14;
  `docs/control/local/reviews/WO-276/repair-9/round-14-design.md`): one
  note, the shard helper's modifiers, repaired with a case. Rolling review
  37 (design, round 15; `repair-9/round-15-design.md`): one note, a Git
  process for each path in the update's reading of both sides, with no
  measured regression; held for the closing preparation
  ([D087](decisions.md#wo-276-d087--part-m-as-built-a-target-order-closes-when-its-base-holds-the-reviewed-change-by-ancestry-a-squash-or-a-rebase-or-under-a-commit-named-for-it-the-instance-lists-its-authors-and-the-drive-settles-a-targets-own-release), [D088](decisions.md#wo-276-d088--part-ms-second-attack-pass-and-its-close-the-drive-reads-a-close-over-the-records-attempts-a-refused-name-is-not-repeated-and-a-partial-clone-is-left-to-the-attended-close)).
- Part N (D063, D071): its first attack pass returned seven findings, six
  of them run, all repaired: plan-first unable to get past its proposal
  under `instance`, record paths published and exempt from the identifier
  rule, a records step offered that main's registration did not require,
  an order that neither value published, a refusal that named the wrong
  cause, a screen command and a gate check that disagreed, and a bound
  order's publish that depended on main's configuration loading. Its
  second pass, a recheck by the same worker, found none of the seven
  holding and four more in the repairs: a refusal for a record path the
  target's base already held, a records action that filed where main's
  registration could not be read, and an approved plan lost without a word
  when the registration's value changed, all three repaired with cases;
  and the plan-first directory following the order's own checkout while
  the records follow main's, recorded as it stands with what a run of it
  shows (D091). Rolling review
  38 (consistency, round 14;
  `docs/control/local/reviews/WO-276/repair-9/round-14-consistency.md`): no
  finding. Rolling review 39 (criteria, round 15;
  `repair-9/round-15-criteria.md`): two findings in closed parts, a field
  label named between underscores (criterion B1) and a name given to a
  module's namespace (criterion E1), both repaired with corpus entries.
  Two starts of the part's first gate failed, neither on a case of the
  part's subject: the product read guard on a fixture helper that read
  the repository's legal record, and a declared target's Release notes,
  whose record links the part had made plain text wherever no records
  binding existed (D091). The twenty-sixth critic's first point was run:
  a plan approved under one registration value stands when main's value
  changes, and the publishes follow main.
  The twenty-fifth critic's first point reopened Part M's merged check:
  another person's identical edit at another of several identical places
  had the change's patch identity and would have been taken for it; the
  comparison is now exact, file by file, with the history held at the
  function and through the close fixture
  ([D089](decisions.md#wo-276-d089--part-n-begins-on-checkpoint-41-and-the-twenty-fifth-critics-three-points-a-base-commit-counts-only-where-it-is-the-branchs-change-exactly-the-uses-left-are-tracked-beside-the-hours-and-a-held-note-stays-held),
  [D090](decisions.md#wo-276-d090--part-n-as-built-a-registration-says-whether-its-orders-records-are-filed-into-the-target-or-stay-in-the-instance-mains-value-governs-every-reader-and-a-committed-records-binding-decides-an-order-in-flight),
  [D091](decisions.md#wo-276-d091--part-ns-second-attack-pass-two-failed-gates-and-its-close-only-the-change-is-judged-for-records-the-records-action-reads-mains-registration-or-refuses-a-plan-approved-under-one-value-stands-when-main-changes-and-the-release-notes-keep-their-links-where-records-are-filed)).
- Between Parts N and O (D071): rolling review 40 (criteria, round 16;
  `docs/control/local/reviews/WO-276/repair-9/round-16-criteria.md`):
  three findings in closed parts, all repaired. Two were one more
  spelling each in the two readers earlier rounds had found spellings in
  (a label as a group of alternatives, criterion B1; a module awaited and
  given a name, criterion E1), and under the twenty-sixth critic's third
  point each reader was given a declared family tested together and a
  written boundary in place of another example: the title rule is held to
  node on 82 files that cross every binding with every use, counts as
  unread whatever is registered through a name the file derives from the
  test module, and is silent only for routes that three files pin; the
  screen reads a bold field's label by its shape. The third was a usage
  figure (criterion J5): a Codex count with no cached part was written as
  wholly uncached, and is now unknown
  ([D092](decisions.md#wo-276-d092--rolling-review-40s-three-findings-in-closed-parts-the-title-rule-and-the-pattern-screen-each-get-a-declared-family-and-a-written-boundary-in-place-of-one-more-spelling-and-a-codex-count-without-its-cached-part-is-no-longer-read-as-uncached)).
- The twenty-seventh critic (08:23 to 08:36 UTC), four points, all taken
  ([D093](decisions.md#wo-276-d093--part-o-begins-on-checkpoint-43-an-initiatives-layout-is-a-section-of-its-workstream-document-planned-items-are-not-orders-and-a-pass-files-the-next-wave-and-the-twenty-seventh-critics-four-points)):
  the lifecycle fixture's documentation mark, which Part N's passing cases
  rely on, is now held from both sides by cases and stated for a reader
  where a root is configured; the whole-file runs before a gate are
  narrowed to focused cases under the read guard from their first run,
  with the measured cost of the wider rule; a reviewer goes out on its
  minute whatever repair is in hand; and Part M's times, taken before its
  comparison was replaced, were taken again on the comparison as built,
  with the path the replacement added.
- During Part O (D071): rolling review 41 (criteria, round 17;
  `docs/control/local/reviews/WO-276/repair-9/round-17-criteria.md`):
  round 16's three findings held, and one new finding in a closed part,
  repaired: a member of a namespace taken by a literal key registered a
  title the rule neither reported nor counted (criterion E1). It was the
  seventh spelling found in that reader, and the repair removes the two
  lists the earlier family could not reach: what a registrar is, is read
  in one place, by either spelling of a member and to any depth, and
  which members register is every one that is no hook and no utility. The
  family is generated from node's own members and both spellings, 335
  files on this host; a computed key and a callee that only names a
  registrar are counted as unread; and a control holds the hooks and
  utilities, reached six ways, to no report and no count. Two sentences
  of D094 are corrected here, since a record is not rewritten: it says
  five ways, a miscount of the six its control file holds; and it says
  the reviewer's file was run before the repair, where it was run after
  the repair was written, against a kept copy of the rule as it stood at
  checkpoint 43, which fails on it
  ([D094](decisions.md#wo-276-d094--rolling-review-41s-finding-in-a-closed-part-the-title-rule-reads-what-a-registrar-is-in-one-place-by-either-spelling-of-a-member-and-to-any-depth-and-its-family-is-crossed-with-nodes-own-members-and-both-spellings)).
- Part O (D063, D071): its attacker (three passes, the second and third
  rechecks by the same worker) found nothing on the part: layouts placed
  before and after the Rules section and the marked block, a fenced
  example holding a whole block, a table cell naming an order, the three
  new cases' assertions, the planner sentence's reach and two statements
  of the guide all held under its probes. The same passes were given the
  title rule of criterion E1 as a second surface and returned eighteen
  findings on it, eight, five and five, all but one run under node: routes
  to a registrar and counts of a body's runs that the rule passed over in
  silence, and reports of a repeat node does not register. All are
  repaired, with a ninth class the executor ran itself and three shapes
  from its own probes: the rule resolves every name to its declaration,
  counts a registration exactly only where it knows how often its body
  runs, and reads a name with a second value as unread
  ([D095](decisions.md#wo-276-d095--the-attack-on-the-title-rule-eight-findings-and-a-ninth-the-executor-ran-repaired-the-rules-boundary-gains-a-second-side-how-often-a-body-runs)).
  Rolling review 42 (consistency, round 15;
  `docs/control/local/reviews/WO-276/repair-9/round-15-consistency.md`):
  no finding. Rolling review 43 (consistency, round 16;
  `docs/control/local/reviews/WO-276/repair-9/round-16-consistency.md`):
  one finding, that the control of hooks calls a member node 24.15.0
  does not have; the critic's second point had found it and it was
  repaired while the round ran, seconds after its tree was taken.
  The twenty-eighth critic (09:38 to 09:51 UTC), three points, all
  taken ([D097](decisions.md#wo-276-d097--the-twenty-eighth-critics-three-points-the-title-rules-contract-is-stated-and-its-extension-ended-for-this-order-its-scope-classes-are-held-to-node-by-files-of-their-own-the-case-is-made-to-pass-on-node-24-and-the-parts-evidence-reads-a-kept-run)):
  the title rule's contract is stated and nothing more is added to the
  rule in this order; its scope classes are held to node by nineteen
  files; the case, run under node 24.15.0 for the first time, failed on
  a control file from D094 and was repaired, and reads its generated
  files in one batch after one failure of the source reader's channel;
  and the part's evidence script reads a kept run. The part's second
  gate failed twice before it passed, neither time on a case of the
  part: on a decisions index the executor had made stale by appending a
  record while the gate sequence ran, and on a sentence of the kit guide
  that Part M reworded and a case of the planning file pins. The part as
  built is
  [D096](decisions.md#wo-276-d096--part-o-as-built-the-seeded-workstreams-page-carries-the-layout-no-reader-of-a-workstream-document-reads-it-but-the-document-check-the-planners-root-holds-one-sentence-and-the-guide-states-the-rolling-way).
- Parts P, Q and R and the closing: what each one's reviews found is in
  the Review column of its row under Parts, with the decisions the row
  names (D098 to D122).

## For the release's notes

The notes are the final review's to write
([D116](decisions.md#wo-276-d116--step-z1-the-release-target-stands-main-has-not-moved-no-feedback-episode-is-owed-the-six-timings-are-taken-again-and-the-document-gate-passes)).
What this order's decisions ask their Read before upgrading to carry,
gathered here once:

- The release is v1.0.0, and the roadmap's Teammate-ready rung, which
  older records call v1.0.0, is v2.0.0
  ([D073](decisions.md#wo-276-d073--this-orders-release-is-v100-and-the-roadmaps-teammate-ready-rung-is-v200-on-the-operators-word)).
- The seeds name Claude Code alone. An instance that works with Codex or
  Copilot elects the host (`features.host-codex`,
  `features.host-copilot`) and emits again
  ([D057](decisions.md#wo-276-d057--part-g-as-judged-the-seeds-name-claude-code-alone-a-discovery-record-turns-no-host-on-the-operators-commands-are-a-generated-page-and-what-core-should-hear-is-one-file)).
- An instance that takes the seed into a clone whose files Git had
  already converted renormalizes once, with `git add --renormalize .`
  ([D060](decisions.md#wo-276-d060--part-h-as-built-the-host-report-a-kit-roots-host-check-sized-to-its-carried-tasks-the-previews-floor-lines-the-compilers-failure-and-the-attributes-seed)).
- The status output's first key is `schemaVersion`, and a consumer that
  compares the whole object admits it. A configuration whose document
  root lies under `extensions/` no longer loads, and names the root to
  move. An emit reads `.claude/settings.instance.json` where an
  instance has one
  ([D074](decisions.md#wo-276-d074--part-k-as-built-one-root-that-is-the-instances-by-guarantee-a-settings-fragment-that-only-adds-and-takes-no-pretooluse-hook-and-what-the-host-was-observed-to-do)).
- The seeded repository profile page changed; an existing instance keeps
  its own copy and meets the convention in the kit guide's sections First
  steps and Planning in this instance. A target order's briefing prints
  the profile's path, its area notes and the order's workstream document,
  and the document check judges the block of a note beside a registered
  profile
  ([D086](decisions.md#wo-276-d086--part-l-as-built-area-notes-beside-a-targets-profile-read-by-the-document-check-and-the-briefing-and-one-sentence-in-three-roles)).
- A target order closes on a squash or a rebase of its reviewed change,
  and takes `--merged-as <commit>` where the change landed under another
  patch; the hook's recognizer of the close helper admits that flag once
  an instance's hooks are regenerated. `contributions.authors` is
  admitted beside `operatorAuthor`, and the example configuration
  carries it empty. The kit guide gains the section Working as a team on
  one instance. The drive reads a target's merge as the close does and
  settles a target that declares a release policy on its own published
  release
  ([D087](decisions.md#wo-276-d087--part-m-as-built-a-target-order-closes-when-its-base-holds-the-reviewed-change-by-ancestry-a-squash-or-a-rebase-or-under-a-commit-named-for-it-the-instance-lists-its-authors-and-the-drive-settles-a-targets-own-release)).
- `repositories.<id>.records` is admitted, with `target` as before
  when it is absent. An instance working a team's application repository
  sets `instance`: no records step is offered, the target is published
  at the reviewed commit, and the order's records are published by the
  instance's own pull request; a target order's plan-first files are then
  under the instance's evidence root and its conversation is screened
  there. The value is read from main
  ([D090](decisions.md#wo-276-d090--part-n-as-built-a-registration-says-whether-its-orders-records-are-filed-into-the-target-or-stay-in-the-instance-mains-value-governs-every-reader-and-a-committed-records-binding-decides-an-order-in-flight)).
- The seeded workstreams page changed; an existing instance keeps its own
  copy and meets the layout in the kit guide's Planning in this instance.
  An instance whose document root is outside `docs/` marks it as
  documentation in `.gitattributes`
  ([D093](decisions.md#wo-276-d093--part-o-begins-on-checkpoint-43-an-initiatives-layout-is-a-section-of-its-workstream-document-planned-items-are-not-orders-and-a-pass-files-the-next-wave-and-the-twenty-seventh-critics-four-points)).
- The standing prints worked time, with the elapsed time beside it where
  the two differ, and `accept-overrun` compares a ceiling with worked
  time. A planning pass, and any dispatch whose line names no order,
  starts at its own session. `spend.daily` is optional, a new export
  seeds it null, and a spend of any other shape refuses the budgets' load
  by its field. A prompt carries one more line only where a figure is
  declared. An executor's standing file is named by its briefing and
  removed by `implementation-ready` or `repair-complete`. Every tool
  row the hooks write carries a call key, and a router begun by the
  command is bound by its drive's line
  ([D103](decisions.md#wo-276-d103--part-p-as-built-worked-time-from-paired-tool-calls-a-days-figure-that-is-advisory-the-standing-file-in-both-of-the-executors-phases-the-second-attack-pass-rolling-review-45-and-the-gates)).

Three more things an upgrading instance will see, which no decision asks
of the notes in those words; the executor adds them for the final review
to weigh:

- No bundle holds a presence hook any longer: an emit removes the four
  presence hook files, and a target's bundle is one file smaller
  ([D106](decisions.md#wo-276-d106--part-q-as-built-with-both-readings-of-what-a-call-costs-in-hooks),
  [D120](decisions.md#wo-276-d120--the-ninth-complete-run-failed-three-suites-on-expectations-this-orders-own-changes-had-left-stale-each-is-repaired-and-the-run-is-started-again)).
- The two per-model worker definitions an earlier kit emitted are gone;
  workers are names an instance binds to models, listed by `npm run
  worker -- list`
  ([D077](decisions.md#wo-276-d077--worker-models-as-redesigned-on-the-operators-direction-models-are-rows-of-data-workers-are-names-an-instance-binds-to-them-one-resolver-and-two-commands-answer-every-launch-and-no-worker-definition-hook-or-sentence-names-a-model)).
- An instance numbers its own orders through the range core's use, and
  its plan refuter's brief no longer carries a fact about one of core's
  orders, so the refuter's compiled identity in a kit root differs from an
  earlier release's; a receipt an earlier release wrote is still read
  ([D112](decisions.md#wo-276-d112--part-r-as-built-the-predicate-at-ten-sites-a-withdrawal-as-an-orders-first-event-a-register-judged-as-it-is-left-a-known-issue-disposed-the-preflight-advisory-and-the-re-task-and-capture-rules)).

What the repair of FINAL-001 adds to what an upgrading instance will see:

- An order whose criteria list the parser reads as shorter than written is
  refused by every reader of the list, naming the line and the remedy:
  where a wrapped line opens with an HTML tag's name or a comment, such as
  a placeholder `<option>`, or with a number sign, or where a paragraph or
  a bold label between items holds the items after it, or where a label or
  a heading set at the margin divides the criteria into groups. A note or a
  comment after the list is read past. A resident's mission check records
  such an order as `contract-unreadable`
  ([D175](decisions.md#wo-276-d175--a-criteria-list-the-parser-reads-as-shorter-than-written-is-refused-by-every-reader-of-it-and-never-returned-shorter),
  [D178](decisions.md#wo-276-d178--the-ladders-first-round-eleven-findings-from-three-reviewers-five-of-them-in-a-criterions-class-each-closed-as-its-class-with-a-case)).
- The Markdown readers no longer read inline math, a Liquid tag or a wiki
  link as one span: a link, a code span, a comment or a header label
  written between two dollar figures, and a link whose text is a bracketed
  word such as `[[draft]](notes.md)`, are read as CommonMark reads them, and
  a label inside a strikethrough between two tildes opens its field
  ([D169](decisions.md#wo-276-d169--a-label-that-opens-a-line-inside-a-span-the-parsers-extensions-read-as-one-node-opens-its-field),
  [D178](decisions.md#wo-276-d178--the-ladders-first-round-eleven-findings-from-three-reviewers-five-of-them-in-a-criterions-class-each-closed-as-its-class-with-a-case)).
- A resident started without its launcher records a mission check's
  failure as `documents-unread`, and its hold names `scripts/resident.mjs`;
  the resident host refuses an option it does not read, the removed
  `workOrderIndexPath` among them, so a script that built a host with it
  passes `workOrderCards`
  ([D170](decisions.md#wo-276-d170--a-resident-that-holds-no-reader-of-mission-documents-records-the-checks-failure-as-documents-unread-and-the-hold-names-the-launcher),
  [D172](decisions.md#wo-276-d172--the-resident-host-refuses-an-option-it-does-not-read-and-the-live-walkthrough-hands-over-the-card-source)).
- A target close takes a rebase only where the base holds one commit for
  each of the branch's, in its order; otherwise it refuses naming
  `--merged-as`, a rebase that left out a commit the base already held
  among the causes it names
  ([D167](decisions.md#wo-276-d167--the-closes-rebase-rule-takes-one-base-commit-for-each-of-the-branchs-commits-in-the-branchs-order),
  [D178](decisions.md#wo-276-d178--the-ladders-first-round-eleven-findings-from-three-reviewers-five-of-them-in-a-criterions-class-each-closed-as-its-class-with-a-case)).
- An update's plan refuses a generated surface as locally modified,
  `runtime-differs`, where a compiled runtime file holds bytes no kit
  wrote, and asks the instance's harness check only otherwise; the update
  branch runs `npm run sync` after the emit and the lineage index
  ([D174](decisions.md#wo-276-d174--kit-verification-and-an-updates-plan-compare-every-carried-compiled-runtime-file-before-any-of-the-instances-code-runs)).

## Actor and usage

Current repair of VER-006:

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.325","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

The actor fields come from this Claude Code session's own readback: the
transcript's model, the harness version the session's hook observed and
the session's `CLAUDE_EFFORT` (`xhigh`; selected, not effective, effort).
The handoff observation, `node scripts/harness.mjs usage
6cb5d7d5-41ce-4e72-ac96-542c10b91fae` at 15:58:10 UTC on 2026-11-14 (source
`claude-transcript-message-usage`, scope `dispatch`), is 31,722,981 total
tokens: input 270, cached input 31,212,880, cache write 348,024 and output
161,807; reasoning output and cost are unknown. These counters include
repeated and cached input. The first observation, at 14:42:07 UTC, fourteen
minutes into the dispatch, was 7,917,529; no reading was taken at the
dispatch's first minute. The dispatch standing is within its bound: 1 h 30
min of 8 h 0 min, and 1 complete run of 20. The hook counts 1 worker launch
and 0 re-tasks of the cap of 20. Final counters remain in the ignored
receipt and the final response.

Terms context review for this repair: 0 listed context lines read. The
branch screen found 0 refuse and 0 context lines across 909 changed files.

The repair of FINAL-001:

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.325","model":"claude-opus-5-5","effort":"max","source":"claude-session-readback"}

The actor fields come from this Claude Code session's own readback: the
transcript's model, the harness version the session's hook observed and
the session's `CLAUDE_EFFORT`. The handoff observation, `node
scripts/harness.mjs usage ba0cbb86-e737-4ae2-bc08-f5346a6970a1` at
07:56:20 UTC on 2026-11-14 (source `claude-transcript-message-usage`, scope
`dispatch`), is 424,376,487 total tokens: input 1,684, cached input
421,738,342, cache write 1,755,437 and output 881,024; reasoning output and
cost are unknown. These counters include repeated and cached input. The
entry observation at 01:04:20 UTC recorded the worker counter at zero
(D165); its token figure was not kept in a record. The dispatch standing is
within its bound: 5 h 26 min worked (6 h 53 min elapsed) of 8 h 0 min, and
3 complete runs of 20. The hook counts 7 worker launches and 3 re-tasks of
the cap of 50; the five critics and the two live feedback episodes it does
not count bring the uses to 17 (D187). Final counters remain in the
ignored receipt and the final response.

Terms context review for this repair: 0 listed context lines read. The
branch screen found 0 refuse and 0 context lines across 894 changed files.

The repair of VER-004:

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.169.0","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

The actor fields come from the current Codex session readback. Entry usage
was 54,611 tokens at 20:00:12.310 UTC on 2026-11-13. The handoff observation
at 21:53:38.979 UTC is 40,468,726 total tokens (40,392,750 input, of which
40,004,352 cached; 75,976 output, of which 27,515 reasoning; no cache-write
input). Source: `codex-transcript-counter`; scope: `dispatch`; cost is
unknown. These counters include repeated and cached input. The dispatch
standing is within its bound: 1 h 54 min of 8 h 0 min and 2 complete runs
of 20. The host's observed worker counter is zero; the actual review used
one launch and one format-only continuation, as recorded in D149. The
counter does not establish that no worker ran. Final counters remain in
the ignored receipt and final response.

Terms context review for this repair: 0 listed context lines read. The
branch screen found 0 refuse and 0 context lines across 809 changed files.

Earlier execution and repair observations follow.

The executor ran as `claude-fable-5-2` at effort `xhigh` on Claude Code
2.1.322, each read back from the session and none taken from the dispatch
line: the transcript's model and version fields and the session's
`CLAUDE_EFFORT` ([D121](decisions.md#wo-276-d121--the-tenth-complete-run-passes-on-the-final-candidate-and-how-step-z3-judges-the-handoffs-lines)).
Review, attack and critic workers ran on Codex with the model and effort
the worker table requests; where a report's host readback was not read,
those settings are requested values and not observed ones (the
thirty-fifth critic's third point,
[D118](decisions.md#wo-276-d118--correction-the-closing-round-of-d117-was-not-the-paired-measurement-six-reviewers-were-stopped-on-a-misreading-of-the-operators-condition-and-the-order-goes-to-its-complete-run-on-the-operators-direction)).

Usage, from `node scripts/harness.mjs usage
d260fc60-0a32-46bb-b7df-1a7234a8e6b3`, source
`claude-transcript-message-usage`, scope `dispatch`, observed
2026-11-13T00:33:38Z, after the tenth complete run: 752,520,141 tokens in
this session's transcript (input 2,870; cached input 747,884,228; cache
write 3,033,260; output 1,599,783; reasoning output and cost unknown).
`npm run meta`, at about 22:27 UTC on 2026-11-12, printed 3,668,985,050
tokens for the order across its sessions. The dispatch began
2026-11-10T16:43:56Z: 55 h 49 min elapsed and 51 h 48 min worked against a
bound of 96 h, and 10 complete runs of the 20 the bound allows; the
standing reads `within`. Workers observed in this session: 29 uses (25
launched, 6 on Claude and 19 on Codex, and 4 re-tasked), the uncounted
remainder unknown. The executor's own count across the dispatch's
sessions is 172 uses against the limit of 200 it held, where the log
admits 220. Six of those uses returned nothing (D118). Final counters
stay in the ignored receipts.

The repair of VER-001 ran as `claude-opus-5-5` at effort `xhigh` on
Claude Code 2.1.323: the model as the session reports it, the effort read
from the session's `CLAUDE_EFFORT` (host-selected, not effective effort)
and the version as the session's hook observed it, which the briefing
prints. Usage, from `node scripts/harness.mjs usage
ad182989-b6b6-490a-9cc1-7810387eb0d0`, source
`claude-transcript-message-usage`, scope `dispatch`, observed
2026-11-13T02:57:06Z, after the eleventh complete run: 30,569,740 tokens in
this session's transcript (input 294; cached input 30,175,572; cache write
291,008; output 102,866; reasoning output and cost unknown). The repair's
dispatch began 2026-11-13T01:33:38Z: 1 h 23 min of its 8 h bound and 1
complete run of 20; the standing reads `within`. Workers: the counter
reads two uses (one Claude launch, one unattributed). The Claude launch is
the combined reviewer, which reported 185,863 tokens. The session launched
no other worker: it ran the review helper twice, each with `--dry-run`,
which renders the brief and launches nothing. That the counter took one of
those for the unattributed use is an inference from the commands run; the
counter's attribution was not read further.

The repair of VER-002 ran as `claude-fable-5-2` at effort `xhigh` on
Claude Code 2.1.323: the model as the session reports it, the effort read
from the session's `CLAUDE_EFFORT` (host-selected, not effective effort)
and the version as the session's hook observed it, which the briefing
prints. Usage, from `node scripts/harness.mjs usage
a47d17a2-740b-46d1-8c1f-23373dd57e94`, source
`claude-transcript-message-usage`, scope `dispatch`, observed
2026-11-13T07:20:20Z, after the thirteenth complete run and the document
gate: 199,385,639 tokens in this session's transcript (input 750; cached
input 198,086,551; cache write 884,478; output 413,860; reasoning output
and cost unknown). The repair's dispatch began 2026-11-13T04:02:43Z: 2 h
36 min worked and 3 h 18 min elapsed of its 8 h bound; the standing reads
`within` and counts 1 complete run of 20, though two were started, the
first having stopped in its preflight after 25 seconds. Workers: the
counter reads three uses, two Claude launches and one re-task, of the 20
this dispatch may make. The first launch and its re-task were the research
worker for the comparison evidence, which reported 417,383 and 720,950
tokens over 29 and 41 minutes; the second launch was the combined
reviewer, 250,551 tokens over 18 min 40 s. The session also ran the review
helper twice with `--dry-run`, which renders the brief and launches
nothing. Terms context review: 0 listed context lines read; the branch
screen listed none (0 refuse, 0 context over 733 changed files), run
before the document gate.

The repair of VER-003 ran as `claude-fable-5-2` at effort `xhigh` on
Claude Code 2.1.323: the model as the session reports it, the effort read
from the session's `CLAUDE_EFFORT` (host-selected, not effective effort)
and the version as the session's hook observed it, which the briefing
prints. Usage, from `node scripts/harness.mjs usage
6385145c-f32f-451a-adc3-03c302c20be8`, source
`claude-transcript-message-usage`, scope `dispatch`, observed
2026-11-13T19:37:46Z, after the seventeenth complete run and the document
gate: 250,729,026 tokens in this session's transcript (input 1,050; cached
input 248,889,473; cache write 1,210,236; output 628,267; reasoning output
and cost unknown). The repair's dispatch began 2026-11-13T14:04:01Z: 5 h
34 min elapsed of its 8 h bound, the report giving the same figure as
worked; the standing reads `within` and counts 4 complete runs of 20,
where five were started (one failed, three stopped, the last of those
after 18 seconds, and one passed); which of them it leaves out was not
read. Workers: the counter reads two launches, one on Claude and one
unattributed, of the 20 this dispatch may make, and it undercounts. The
session launched five. One was on Claude: the combined reviewer, 259,460
tokens over 0 h 21 min. Four were on Codex, through the order's critic
launcher and a scratch launcher of the same form, whose commands the hook
does not count; each was launched as GPT-6 Astra at the effort the worker
table gives that name, which are requested values, and none reported its
tokens: the thirty-sixth critic (0 h 15 min), the research worker on the
file-events daemon (0 h 16 min), the thirty-seventh critic (0 h 13 min)
and a thirty-eighth, stopped unreturned after two minutes
([D145](decisions.md#wo-276-d145--the-seventeenth-complete-run-passes-on-the-candidate-the-repair-of-ver-003-leaves-the-restarted-daemon-stayed-flat-under-it-a-critic-launched-after-the-pass-is-stopped-on-the-operators-direction)).
What the counter's unattributed launch is was not read further. The
session also ran two live feedback episodes (editions 006 and 007). Terms
context review: 0 listed context lines read; the branch screen listed none
(0 refuse, 0 context over 792 changed files), run before the document
gate.
