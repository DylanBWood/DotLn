# WO-192 independent implementation review

Two fresh `codex-spawn-agent` workers ran as `gpt-6.1-sol`, effort `max`.
Each received only WO-192 and the complete implementation diff. Neither wrote
files, ran tests, or inherited the executor's conversation. The criteria review
excluded design cleanup; the design review excluded criterion judgments and
adversarial test design. Transferred concerns were counted only once.

The criteria adversary found four issues:

1. Concurrent drive entry could launch competing workers and overwrite the
   shared record. `runDrive` now holds a kernel-backed host lock; the concurrent
   entry regression asserts that only one invocation reaches the launcher.
2. A refused lifecycle dispatch could become an incomplete retry. The transport
   now correlates dispatch tool results with typed refusals, and the regression
   asserts one launch and `dispatch-refused` while retaining its usage.
3. The grant test checked only the resolver. The added permission-hook test
   exercises both recorded roots, an alias, another order's refused root, and
   the recorded authority grant and source.
4. The budget test bypassed the driven adapter. The added shared-context test
   covers two phase workers, repeated tool identifiers, a nested spawner,
   result linkage, per-spawner admission and the total ceiling.

The design improver found three issues:

1. An exception after starting a worker could orphan it or leave its reservation.
   Transport handlers now precede record persistence; failure kills and awaits
   the child, and an independent `finally` releases only its reservations.
2. The driver duplicated generated worker metadata. The compiler's
   `workerSpecification` now supplies both generation and transport, with the
   selected launchpad's own harness drift check before launch.
3. Routing and grants separately resolved the same registry. Both now use
   `resolveOrderWorktrees` and its validated physical roots.

Those seven findings received implementation changes and regression coverage in
`scripts/test-drive.mjs`, `scripts/test-harness.mjs`, and
`packages/skeleton/test/subagent-budget.test.ts`. The final gate result and
criterion judgments remain outstanding until handoff. No finding is deferred.

Both workers reread the refreshed diff in their existing independent contexts.
The criteria adversary confirmed its four original findings were addressed; the
design improver confirmed its three. Each reported zero distinct new findings.
These are source-review results; neither worker claimed to have run the gate.

After the operator expanded qualification to both hosts in every role, the same
independent workers reviewed the amended order and refreshed complete diff. The
criteria adversary found two new issues: nested detached cancellation could leave
a phase running while the fixture removed its records, and a native worker-entry
refusal could become an incomplete retry. The design improver transferred its
overlapping cancellation concern to the criteria review and found one distinct
issue: Codex isolation setup occurred before its cleanup scope.

The current repair adds a short-lived process supervisor and owner cancellation,
requires observed phase termination before fixture removal, includes isolation
setup in `finally`, and recognizes the native entry refusal. Regression cases
exercise actual nested processes and setup faults. The distinct cumulative count
is ten: six criteria findings and four design findings. The criteria follow-up
kept cancellation open for supervisor loss; the final repair retains the native
PID, terminates its group on supervisor exit before pipe close, observes native
termination, and preserves reservations if termination remains unobserved. A
separate regression kills the supervisor after spawn.

Both workers have now completed their source follow-up: all six criteria and
all four design findings are addressed, with zero distinct new findings. Neither
worker ran tests. Executable validation remains the executor's gate and live-run
duty; these source reviews alone supply no passing check.

The next source follow-up found two additional criteria issues, counted once
each: a combined entry-and-gate command could produce a false entry refusal,
and fixture cleanup discarded the required document-gate evidence. The design
review transferred its overlapping entry/output concern and found no distinct
new design issue. The repairs use recorded native entry state and retain and
validate both consumed gate objects. The cumulative count is twelve: eight
criteria findings and four design findings. The criteria worker reread the
repairs and confirmed both addressed, with zero additional findings. The design
worker reported no distinct new findings in this pass. Executable validation
of these repairs is still pending.

A focused design follow-up found one additional issue: the outer router sandbox
received only main and host scratch, while the native phase could need the
registered target and paired launchpad outside system temp. The launcher now
resolves and admits that exact physical pair before the router starts; its
regression asserts the roots and strict phrase. A live outside-temp denial has
not been observed. The cumulative unique count is thirteen: eight criteria and
five design findings. The design worker confirmed the repair in its source follow-up, with zero
new design findings. Executable validation is still pending.


The research follow-up added two distinct criteria findings, transferred from
and counted only once with the design reviewer: help output could satisfy lookup
evidence, and a research child's CLI call attempted to take its parent's writer.
A shared literal-command classifier now governs both target admission and lookup
evidence, rejects help and unsupported forms, and treats admitted research as
not writing repository files at both target permission and writer hooks. New
cases retain the parent's reservation while allowing child lookups and refusing
child repository writes. The cumulative count is fifteen: ten criteria findings
and five design findings. The criteria worker confirmed both source repairs with zero new findings; the
design worker likewise found no new distinct issue. Executable validation is
still outstanding.

The launcher follow-up found two new criteria defects: a fixture-only exclusion
left the ordinary operator entry path unequipped, and native transport continued
after a denied launcher result. The generated router skill now supplies the same
host permission request for both entry paths, without installing an exclusion.
Transport stops on launcher failure; an observed operator-session denial also
latches a router-only tool refusal until a new drive phrase. New regressions cover
termination before an alternative launch and refusal in the ordinary hook path.
The cumulative count is seventeen: twelve criteria findings and five design
findings. Both independent workers confirmed these source repairs with zero new findings.
Executable validation remains outstanding. A self-check also moved the new
transport regression out of an inadvertently nested test declaration before
the complete gate.

The final research follow-up added one unique design finding: curl's own URL
globbing could expand one quoted search operand into several requests. The
adapter now rejects raw brace and bracket forms, with negative cases. Criteria
review found no additional issue. The cumulative distinct count is eighteen:
twelve criteria and six design findings. Both independent workers confirmed the
source repairs with zero new findings. Complete gate 6 failed an outdated
grant-list assertion; gate 7 passed that suite but failed four role-projection
tests. Neither run supplies a complete pass.

Both workers reviewed D036 and reported zero new unique findings. The bounded
reproduction of the failing role-projection file passed all eight cases. The
criteria reviewer also checked dollar-budget scope: the configured ceiling
covers phase-worker costs, excluding the separately reported outer router cost.
The order's attended-run and separate-reporting requirements permit that limit;
it is not an enforced total-spend ceiling. D037 makes the scope explicit. The
cumulative distinct count remains eighteen, all source-addressed; full executable
qualification is still outstanding.

The criteria reviewer confirmed D037's reporting scope. Both workers then
reviewed D038–D039 and found no new unique issue: the live kit preserves and
checks its instruction link before launch, and completed Codex web-search events
use their native statusless contract while explicit failures remain failures.
The bounded copy comparison and web-event regression both passed. Attempt 28
was stopped after the fixture copy defect was identified; its target gate and
four CLI research operations passed, but it recorded no phase completion.

The D040 review added two distinct findings. The design reviewer found a mismatch
between diagnostic failure recognition and history retention; one shared
predicate now covers failed, declined and nonzero-exit commands. The criteria
reviewer found an open-ended whole-line scan that could retain refusal-shaped
private identifiers and misattribute quoted codes; the repair restricts both
code vocabulary and structured error sources. Seven bounded protocol cases
passed. The cumulative count is twenty: thirteen criteria and seven design
findings. Both reviewers independently confirmed these latest source repairs,
with no additional distinct findings. All twenty are source-addressed; complete
native lifecycles and the complete gate remain outstanding.

Both reviewers also checked D043's native wrapper, permission-source and init
readback reductions without finding another distinct issue. The three bounded
native-readback regressions passed. Counts remain thirteen criteria findings and
seven design findings. Attempt 31 completed all five research operations and
the target gate but failed the document gate while loading the TypeScript ES
module; it was stopped through its owning driver and cleaned up. That runtime
failure was reproduced in a nested native session selecting Node 22.2.0 while
its launcher used Node 26.9.0. A bounded comparison passed after setting the
tool-environment PATH explicitly; changing only the process PATH did not work.

Both reviewers checked D044's per-invocation runtime selection and cleanup
regression, with zero new distinct findings. Counts remain thirteen criteria
findings and seven design findings, all source-addressed. The focused launcher
regression passed. A fresh native lifecycle and the complete gate remain
outstanding; the bounded comparison alone supplies neither verdict.

Both reviewers checked D045's follow-up scope correction and D046's shared
native boundary reducer, with no new distinct findings. The five bounded
launcher and protocol cases passed. Counts remain thirteen criteria findings
and seven design findings. Attempt 32 passed its target and document gates but
ended at the two-attempt incomplete bound without a completion event. A smaller
native reproduction identified the Git object-database write refusal; normal
one-command host approval made both direct and nested completion commands pass.
That diagnostic is not a complete generated-role qualification. D047's resulting
router and phase instructions received a fresh source follow-up. The criteria
reviewer found one new issue: a phase could stop after permission denial while
the driver launched another incomplete attempt. The design reviewer transferred
the overlap without counting it again. D048 propagates explicit native denials
to the driver's refusal stop and preserves fatal errors across later result
messages. Ten bounded protocol and launcher cases passed, including both hosts'
one-launch refusal regressions. The cumulative count is twenty-one: fourteen
criteria findings and seven design findings. Both independent workers confirmed
the source repair with no new distinct findings; all twenty-one are
source-addressed. Complete native qualification and the complete gate remain
outstanding.

Complete review gate 8 reached the skeleton suite but failed one older writer
envelope assertion that omitted the order-worktree grant required by this
order. D049 updates that exact expected list while preserving denied-effect
and one-writer assertions. The rebuilt failing case passed its bounded
reproduction. This executor-discovered test correction adds no independent
review finding; a fresh complete gate is still required.

Complete review gate 9 passed the skeleton suite, then two target-worktree
suites failed in shared publication setup: the generalized fixture root was
referenced outside its lexical scope. D050 reads the fixture's own configured
control root. Four bounded cases passed, covering publication and all three
affected start cases. This executor-discovered fixture correction adds no
independent finding; the complete gate must run again.

The design follow-up found one related root mismatch: publication setup still
wrote the local term list to a fixed path. D051 resolves that file and its ignore
rule from the configured root while retaining the default cache ignore rule.
The new custom-root regression exercises actual term screening, redacted refusal
and untracked local material; it and the four affected existing cases passed.
Both reviewers confirmed the source repair with no new distinct issue. The
design confirmation succeeded after one provider-capacity interruption.
Cumulative findings are now twenty-two: fourteen criteria and eight design,
all source-addressed. The complete gate and native qualifications remain
outstanding.

Complete gate 10 passed both previously failing target-worktree suites. Its
single executed failure was the runner's exact case inventory, which omitted
D051's new regression. D052 updates the explicit declaration and expanded-name
lists and their counts; the named reproduction passed with concurrency and
deadline assertions intact. This test bookkeeping adds no independent finding.

Complete gate 11 passed forty-two suites and failed only the export-update
suite. The new pre-router budget subtest had supplied root-first arguments to
a command-first helper, so its harness command never launched. D053 corrects
both harness and meta calls. All fifteen tests in the affected parent case
passed, including preservation of the legacy budget bytes. This executor-found
test correction adds no independent finding; a fresh complete gate is required.

Both independent reviewers checked the final inventory and command-helper
corrections. Neither found a new issue; cumulative counts remain fourteen
criteria and eight design findings, all source-addressed.

Complete gate 12 passed: `npm test -- --review` reported forty-three suites
passed, zero failed, 109 fresh tasks and 1,829.27 seconds. This includes every
previously failing fixture and the final source-reviewed corrections. Native
all-role qualification and the final document gate remain outstanding.

The next criteria follow-up found a false dispatch-refusal attribution: failed
printing or search commands containing helper text could stop the driver.
D054 parses an actual single helper invocation and preserves genuine host
denial stops. The related research adapter rejects transformed shell status.
All forty-four bounded cases passed across both native protocols. Cumulative
independent findings are twenty-three: fifteen criteria and eight design;
the newest source repair awaits independent confirmation and a fresh complete
gate at its changed identity.

Native Codex attempt 33 recorded implementation and passing verification with
both consumed gates, then its router ended with an unexplained native error
before final review. All workers ended and cleanup completed. D055 retains
in-progress observations separately from completed attempts and adds fixed
diagnostic signals for future native failures. This diagnostic repair does not
complete the missing roles or resolve Claude's D042 host-permission blocker.

The attribution follow-up kept finding fifteen open for unrelated target helpers
sharing the same basename. D054 now requires the absolute canonical script or
npm prefix; unqualified command cwd is unobserved. Native phase instructions
use that qualified helper. All fifty-three focused cases passed after this
refinement, including foreign-helper negatives and genuine-refusal positives.
The seven D055 interruption and diagnostic regressions also passed.

Both independent reviewers confirmed the final D054/D055 source with no new
unique finding. All twenty-three findings are source-addressed: fifteen criteria
and eight design. A fresh complete gate and both hosts’ full native role
qualification remain outstanding.

Complete gate 13 passed at the final D054/D055 source: forty-three suites,
zero failures, 109 fresh tasks and 1,927.35 seconds. All source review findings
are addressed and the full executable gate is green. Native all-role
qualification and the final document gate remain outstanding.

Native Codex attempt 34 recorded implementation and passing verification with
both gates, but both reviewer attempts timed out without a verdict. The first
reached the implicit fifteen-minute phase cutoff after fixing a generated
surface and passing its document gate; the second reached the remaining
fixture deadline. The driver stopped at its existing incomplete bound, and all
workers ended before cleanup removed the fixture. Release close did not run.

That observation reopened D040. A read-only source trace confirmed that the
implicit cutoff also prevents a normal self-order phase from awaiting the
1,927.35-second complete gate measured above. D056 adds an optional, reported
instance phase budget and keeps qualification separately bounded. Eight focused
checks passed, including cancellation and the existing admission/retry/denial
boundaries. This executor-discovered repair adds no independent review count;
it needs fresh source review, generation and a complete gate. Gate 13 is evidence
for the preceding source, not the new clock policy. Both hosts' complete native
qualification and the final document gate remain outstanding.

The D056 follow-up found one additional criteria defect: the absolute deadline
was converted to a relative duration before asynchronous preparation, allowing
late admission and launch. Cumulative independent findings are twenty-four:
sixteen criteria and eight design; the duplicate design observation was
transferred. The repair preserves the absolute bound through adapter setup and
supervisor startup, admits only after a fresh check, records the actual applied
duration and handles a refused launch without inventing a worker. Twelve focused
checks pass, including all four new preparation/startup counterexamples. Source
confirmation and a fresh complete gate remain pending.

Both independent follow-ups confirm the final D056 source with zero new unique
findings. All twenty-four findings are source-addressed: sixteen criteria and
eight design. Reviewers did not run tests or claim native qualification; the
complete gate and both hosts' full native lifecycle evidence remain outstanding.

Complete gate 14 passed on the final D056 source: forty-three suites, zero
failures, 109 fresh tasks and 1,752.57 seconds. This includes the new deadline
counterexamples and legacy-budget compatibility. All twenty-four independent
findings are source-addressed with the complete gate green. Both hosts' full
native qualification and the final document gate remain outstanding.

Native Codex attempt 35 stopped at the existing incomplete bound after two
executor workers exited with native error and turn.failed events. Neither
worker timed out; both entered the correct phase and reached passing target
and document gates, but neither recorded ImplementationReady. The reduced
diagnostics identify no cause. The router exited successfully after reporting
the stop, all workers ended and the fixture was removed. No identical Codex
retry is justified before diagnosis.

The operator then authorized disabling sandbox settings for qualification and
requested a future planning item. D057 adds an opt-in Claude-only exception in
disposable local settings; FUP-ec3d1b98b15afd49 is deferred to the next planning
session. The independent reviews found one shared early-failure receipt gap,
owned by design: the selected sandbox configuration could be lost before a
driver record existed. A shared value now populates both receipt constructors.
Cumulative findings are twenty-five: sixteen criteria and nine design. Source
confirmation is pending. Gate 14 precedes this fixture-only change; a final
complete gate is still owed at the resulting source identity.

Both independent reviewers confirmed the D057 receipt repair and D058's narrow
operator-approved launcher grant. Attempt 36 retained the selected sandbox-off
configuration and showed an automatic classifier denial of the launcher;
attempt 37 admitted that launcher but the classifier denied a required
Context7 lookup. Both runs stopped and cleaned up. The operator separately
approved D059's declared-tool fixture policy; its live qualification is ongoing.

D060 adds bounded native diagnostic categories after a read-only check of the
versioned Codex exec schema. Seven focused checks passed before review. The
reviewers found one shared availability-counting defect in Claude's empty JSON
wrapper, owned by design. The final source extracts actual string content and
adds absent, empty, blank and real-message cases; both reviewers confirmed it.
Cumulative independent findings are twenty-six: sixteen criteria and ten design,
all source-addressed. Execution of the newest regression waits for the running
native fixture because probes are serial. A fresh complete gate remains owed.

Attempt 38 completed implementation and passing verification with both gates,
then stopped at the existing incomplete-review bound. Both reviewer processes
exited normally; neither recorded a verdict. A live report read identifies the
missing instance publication vocabulary as the completion blocker. D061
preserves that synthetic policy across kit installation and exercises the
installed commit linter before launching another native run. The separate
integration-command refusals remain observations, not a claimed vocabulary
effect. All workers ended and cleanup removed the fixture. No full native
qualification is claimed.

The D060 diagnostic reproduction has now executed the Claude availability
counterexample and existing denial-stop checks successfully. Independent
finding counts remain twenty-six; D061 is executor-discovered.

Both independent follow-ups confirmed D061 with no new unique finding. The
separate integration diagnosis found a cwd mismatch in an already-admitted
route: its helper read target-local control instead of the paired launchpad's.
D062 routes only the matching registered target root to its launchpad and
prints that command in the review briefing. Two focused checks passed, including
real integration, order/subdirectory refusals, alias identity and unchanged
target refs and bytes. This is an executor-discovered route repair confirmed
by a read-only trace; it is not attributed as attempt 38's completion blocker.

Both independent reviewers confirmed D062 with zero new unique findings.
Cumulative independent findings remain sixteen criteria and ten design, all
source-addressed. Native attempt 39 starts with D061 and D062, after formatting
and sync; final complete and document gate evidence is still outstanding.

Native Claude attempt 39 completed implementation, passing verification and
passing final review, each with actual target and document gate evidence.
Its reviewer also completed canonical launchpad integration. The post-merge
drive stopped on a writer conflict before starting release close. The original
receipt identifies no holder, so specific attribution remains unknown.

D063 prevents router tool calls from acquiring a writer while preserving the
existing foreign-holder refusal. A read-only diagnostic worker independently
found that the native startup command pwd -P was absent from metadata admission;
the criteria reviewer accepted this transferred finding as number seventeen.
The cumulative independent count is twenty-seven: seventeen criteria and ten
design. Five focused checks pass, including unsupported router calls leaving
no reservation, foreign-holder preservation and bounded conflict diagnostics.
The design follow-up found zero new issues; final criteria confirmation is
pending. These checks do not replace the final complete gate.

The close-only native fixture labels its earlier phases as coordinator-seeded
and exports no native completions for them. Attempts 40 and 41 rejected the
new setup's effort-field spelling and process-cost cause respectively before
launching any native agent; both were corrected to the existing formats.
Attempt 42 has completed coordinator setup and local synthetic merges and is
running the real generated router. Its native close outcome remains pending.

Attempt 42 subsequently entered native release close without a writer conflict.
It recorded no-release policy but retained the target and stopped on a later
host permission denial; the denied command is unidentified. The deterministic
close preview reproduced temporary fixture settings as undeclared target
material and, in a second diagnostic arm, protected launchpad settings.
D064 restores the coordinator's verified temporary settings after phases end.
The resulting canonical preview passes with zero blockers, recorded in
close-fixture-preflight.json; that receipt explicitly claims no native work.

The design reviewer found one additional ownership-failure handling defect:
changed settings triggered an assertion, but final cleanup still deleted their
fixture. Validation now covers all regular files before any restoration, emits
a fixed error, and retains the fixture on mismatch. The disclosure consequence
belongs to this same finding, counted once. Both reviewers confirmed the repair.
Cumulative independent findings are twenty-eight: seventeen criteria and eleven
design, all source-addressed. New behavioral checks await the running native
probe; source confirmation alone is not passing execution evidence.

D065 is root-discovered: a partial no-release disposition previously counted as
a finished close. It now needs completed cleanup, while a matching non-preview
partial receipt carries completed removal proof for canonical retry after refs
or target registration disappear. Both reviewers confirmed the source and
partial-receipt regression with no additional unique findings. The published
tag route remains as explicitly required by the order.

Native Codex attempt 43 is running the full lifecycle. Claude's successful
earlier lifecycle remains attempt 39; its completed native close is still owed.
The final complete and document gates and ImplementationReady remain outstanding.

Attempt 43 was cancelled through its owner after the native document gate
identified two literal target-readme paths introduced in the new qualifier.
The receipt confirms owner cancellation, no timeout, no canonical completion,
ended workers and removed fixture. D066 corrects those paths without relaxing
the structural rule. The affected configuration-root suite and the D064/D065
regressions now pass: twenty checks in wo192-close-reentry-reproduction.log.
Both independent reviewers confirmed D064 and D065 with no new unique issues;
all twenty-eight independent findings are source-addressed and their newest
behavioral checks have executed successfully. The final complete gate is still
owed. Native Claude close-only attempt 44 is running before the next full
Codex qualification.

Native Claude attempt 44 passes its isolated router/release-close episode:
worker exit zero, canonical stop released, target removed, launchpad cleanup
clean and no blockers. No tags or releases were published in the synthetic
repositories. Together with attempt 39's actual executor-through-final-review
target lifecycle and consumed target/document gates, this completes Claude's
five-role qualification. Attempt 44's earlier phases remain explicitly
coordinator-seeded and are not counted as native evidence. Both independent
reviewers confirmed D066 with zero new findings. Native Codex attempt 45 is
running the corrected full lifecycle; the final gates remain outstanding.

Native Codex attempt 45 completed the full lifecycle successfully. Its actual
executor, verifier and reviewer each recorded their canonical completion with
target and passing document gate evidence. After the coordinator's synthetic
local merges, a second native router and fresh close worker recorded released:
no-release publication policy, target removed, launchpad cleanup clean and no
blockers. Both router sessions and all four phase workers exited zero; cleanup
removed the fixture after all workers ended. The reviewer corrected its own
metadata before passing, without a separate repair transition. Supplied model
and effort remain operator-attested because effective native readback is absent.
Together with Claude attempts 39 and 44, both hosts have performed all five
roles; native-qualification.md records the evidence and limitations. Independent
review totals remain twenty-eight: seventeen criteria and eleven design, all
fixed, zero recorded unresolved. The final complete and document gates and the
real ImplementationReady transition remain outstanding.

Complete gate 15 failed one target-review test assertion introduced by D062:
its shared expected-command list incorrectly required pre-review integration
in the post-pass result. D067 separates those expectations without changing
product behavior or weakening either exact-list assertion. The failed run
retains 39 passing groups, four groups not passing, one failing task and nine
tasks not started after that failure. This is executor-discovered, so independent
counts remain seventeen criteria and eleven design, all fixed. The two affected
cases and a fresh complete gate must pass before handoff.

The D067 reproduction passed both affected cases in 18.973 seconds, including
the pre-review briefing and the post-pass result through both target routing
forms. Both independent reviewers confirmed the correction with zero new unique
findings. Counts remain twenty-eight found and fixed, zero recorded unresolved.
A fresh complete gate is still required; gate 15 remains failed evidence.

Complete gate 16 passes the final source: 43 required suites, 109 fresh tasks,
zero failures, zero reused suites and no unrun task, in 2080.493 seconds.
Its recorded code identity is
693d43468174ce61358f6261cddb78f68c9bfc79f262fc728fa204b53e6feea9.
The target-review suite passes with D067, alongside all prior source repairs.
Independent review counts remain twenty-eight found and fixed, zero recorded
unresolved. Both hosts' native five-role qualification is complete. The final
handoff records the criterion judgments; the document gate must judge its
finished bytes before the real ImplementationReady transition.

The final output review found a missing gate registration: scripts/test-drive.mjs
was not imported or selected by the complete runner. Its focused receipts remain
valid for their selected cases, but attributing the entire file to the complete
pass was unsupported. D068 registers it in the existing harness fixture suite,
with serial file execution and a runner regression that requires actual table
case output. The handoff is explicitly draft with criterion 13 unmet until the
corrected gate passes. This is executor-discovered; independent review counts
have not changed. ImplementationReady has not been recorded.

The first complete execution of test-drive.mjs ran 94 cases and exposed one
root-discovered product defect: permissionEffect rejected a paired reviewer
git -C commit before its later localCommit adapter could run. The first repair
then exposed the same parse refusal in no-attribution. D069 uses one validated
adapter across permission and feedback checks, retaining the physical destination
for relative message files. The expanded actual-hook regression passes, including
attribution refusal and contradictory target/paired -F contents. The generic
classifier and all unrelated command refusals stay intact. The complete driver
file must pass after snapshot regeneration, followed by the newly registered
complete gate; no final readiness is claimed from the earlier 43-suite pass.

The D068 command-registration regression passes using the runner's existing
suiteEnvironment, which removes Node's inherited test-worker marker. Its first
version retained that marker and received no child test output, so that failed
receipt is preserved. The declaration check passes with the driver inputs.
The D069 hook regression passes across permissions, writer isolation and
no-attribution, including relative message-file resolution and refused forms.
The installed runtime snapshots must be regenerated before full driver and
complete-gate execution. Independent review follow-ups remain read-only.

After regeneration, the entire driver file passes all 94 tests in 32.935
seconds, including the expanded target hook case. The actual registered-command
regression and declaration check pass too; driver-regressions.json retains the
bounded summary. Both reviewers confirmed D069 with no new unique findings,
including the selected-root behavior in feedback checks. Counts remain seventeen
criteria and eleven design, all fixed. The next complete gate includes this
driver file; the draft handoff stays unready until that run and its final
document gate pass.

Complete gate 17 passed the combined harness suite, including the driver file,
then exposed a root-discovered test expectation missed in D068: the historical
command inventory required the old single-file command exactly. D070 adds an
exact normalization to the current two-file command, retaining the frozen
baseline and strict inventory assertion. The already-failed gate was stopped
canonically after 813.9 seconds; its failed and stopped evidence supplies no
complete pass. Independent finding counts remain twenty-eight found and fixed,
zero recorded unresolved. Focused reproduction and a fresh complete gate remain
required before the draft handoff can support readiness.

The D070 bounded reproduction passes both affected inventory/registration
checks in 258.697 milliseconds with no failure. No product code changed in
this correction. A fresh complete gate and the final document gate remain due.

Complete gate 18 passes the final source: 43 required suites, 109 fresh tasks,
zero failures, zero reused suites and no unrun suite, in 1902.323 seconds.
It finished at 2026-10-26T19:06:39.560Z with code identity
96995a91888e41ef5881f1c44db24a1cf5412e3cb2fb25d0d7af4adf0522c98c.
The combined harness suite executes the driver file; the runner suite passes
the inventory and registered-command regressions. All prior source repairs
are included. Independent counts remain twenty-eight found and fixed, zero
recorded unresolved. The finalized handoff requires the final document row
before ImplementationReady; earlier failed and stopped receipts remain intact.

The first final document gate failed one document assertion: D023's dispatch
label omitted the required control prefix. The correction names the existing
resume: next execution and its conversation-only planning capture, preserving
the operator's request and the follow-up's scope. No code changed. The failed
document row is retained; the final document gate must pass after regeneration.

The second document gate passed twenty-six suites and failed resume: the
fixture's exact active status omitted route. The same omission existed in its
closed and projection-drift expectations. D071 adds explicit route values to
all three, retaining strict full-object equality. This is root-discovered and
the independent counts are unchanged. The entire lifecycle fixture is the
bounded reproduction; the criteria reviewer has the current script and diff
for a narrow read-only confirmation. Complete review 18 predates this test-source
repair and cannot support readiness at the new code identity.

D072 records the operator's correction of the repeated validation-order
failure. The remaining sequence now closes the whole document suite before
the next complete review, freezes source and tests, then finalizes the handoff
and runs its document check. The broader platform correction is planning input.

The full bounded lifecycle reproduction passed in 126.131 seconds, ending
at 2026-10-26T19:21:54.995Z. The criteria reviewer found no new unique issue
and confirmed no other full-status assertion in the script omits route.
Counts remain seventeen criteria plus eleven design, all fixed. The document
suite now precedes the next complete gate under D072.

The operator corrected D072's deferral: the platform sequence itself must be
fixed now. D073 binds that expansion and the requested README rewrite. The
runner now makes document/lifecycle checks prerequisites in complete reviews,
runs those checks fresh, and retains valid product reuse. Final report edits
still require the document gate. Generated roles state the enforced order;
target orders pass the launchpad document gate before their target gate.

The additional independent criteria review found a dangling document
dependency after confined-partial selection removed an outside-only suite.
The runner now assigns the dependency barrier after those filters. The
ten-case bounded regression passed at 2026-10-26T19:51:32.356Z in 10.915 seconds,
including both review spellings, partial evidence, ordering, reuse, installed
and focused selection, source declarations and generated handoff order.
The actual receipt-bound amendment fixture separately passed in 1.829 seconds;
the front-page corpus and structural/reuse regressions passed in 7.104 seconds.
The direct repository document check passed with zero failures.

Criteria count is eighteen, design eleven, twenty-nine total; all are fixed.
The design follow-up found no additional unique issue and transferred the
partial-selection concern to criteria. Root-discovered inventory omissions and
obsolete selection expectations were repaired before the next combined gate
and are not double-counted as independent findings. Complete review and final
handoff validation remain outstanding.

D074 and D075 follow the operator's corrections after complete review 19
stopped on two failures. D074 completed the review-inventory expectation; D075
removed D073's document union, dependency injection and document-reuse changes
and split only the resume suite at its input boundary, so the synthetic
lifecycle fixtures run as a product preflight and the two historical record
comparisons stay in the document gate. The design reviewer confirmed that those
comparisons depend only on shared setup and their existing ordering. Counts
stay at eighteen criteria and eleven design findings, all fixed.

D077: the session that finishes the order spawned no further reviewer. The
recorded separate passes above are the fallback the role names, and the
complete and document rows in handoff.md judge the final source.

## Reviews of the integrated tree, 2026-10-30 and 2026-10-31

Three Claude `dotln-worker` agents reviewed the integrated tree under
nonoverlapping briefs: a criteria adversary, a design improver and a consistency
reviewer. They are pinned to `claude-opus-5-5` at `xhigh`, and their effective
readback is unavailable. Every recheck went to the same agent by message, so the
session launched three agents in all, an exact observation with no unlinked
children.

A finding is counted as its reviewer reported it. A defect two reviewers found
counts twice, and an item carried to a later round counts in each round that
reported it. Fixed includes a finding that a repair answered differently than
proposed, and, in round 7, a correction to the record. Recorded means the code
stayed as it was and a decision says why. No finding is open.

Cells read found/fixed/recorded.

| Round | Subject | Criteria | Design | Consistency | Total |
| --- | --- | --- | --- | --- | --- |
| 1 | The integrated tree | 12/12/0 | 9/9/0 | 7/7/0 | 28/28/0 |
| 2 | WO-192-D090's repairs | 14/11/3 | 10/10/0 | 10/8/2 | 34/29/5 |
| 3 | D094 to D096 | 4/4/0 | 8/8/0 | 3/3/0 | 15/15/0 |
| 4 | D097 | 4/3/1 | 5/5/0 | 4/4/0 | 13/12/1 |
| 5 | D098 | 2/1/1 | 3/2/1 | 7/5/2 | 12/8/4 |
| 6 | D099 | 3/1/2 | 1/1/0 | 4/4/0 | 8/6/2 |
| 7 | D101 and the live record | 8/8/0 | 1/0/1 | 8/6/2 | 17/14/3 |
| Total | | 47/40/7 | 37/35/2 | 43/37/6 | 127/112/15 |

What each round turned on:

1. A read-only reviewer became a foreign writer, which limited two of the three
   reviews. D089 and D090 answer this round.
2. The router's spawn refusal admitted any prompt with the type omitted, the next
   complete gate would have failed on a stale count pin, and the usage writer
   refused every router session. D094 repairs them and D095 boards three rules.
3. Helpers could still reach writes through commands the table called reads, and
   the fetch had no limit. D097 repairs them and corrects two D094 statements.
4. A branch with no commits read as merged. D098 repairs it.
5. D098's own repair stranded every real target order at awaiting-merge. All three
   reviewers reproduced it, and D099 replaces it with close's rule.
6. One order's unreadable control record stopped another's merge reading. D099
   now reads only the order's own record.
7. No code defect. The findings were overclaims and gaps in the live record, which
   D101, D102 and native-qualification.md correct.

Recorded without change:

- Criteria: the cold-start route, launch text outside the meter and a nested
  helper's root mapping (D095); a transport child outliving the fetch limit (D098);
  squash merges reading as unmerged, a reactivated order inheriting an earlier
  receipt, and `routeFacts` called with no events (D099).
- Design: the lane error prefix that still says publish (D099), and an operator's
  own Codex router having no session, so its usage stays unknown (D101 and D102).
- Consistency: spawned helpers as evidence sources (D095); the floor's grant
  sentence, inexact for one grant (D094); the router's weaker merge sentence and
  the order's superseded step 8 (D099); the worker note's broad wording and `harness
  begin`'s untested refusal path (D102).

Five of these need a rule and went to planning. The executor left the other ten by
its own judgment, which departs from the order's expansion; handoff.md names them and
says why.

Two reviewers' probes each attempted a real `git push`. Both were refused and
nothing was published; D099 records the cause and the stop rule that followed.

All three reviewers finished the final recheck on the final code, at 05:42Z, 05:46Z
and 05:50Z on 2026-10-31, before the complete runs of 05:57Z and 06:42Z, and were not
restarted after them. No code changed between those runs (D103).
