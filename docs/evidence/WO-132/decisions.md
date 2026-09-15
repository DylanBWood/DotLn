# WO-132 decisions

## WO-132-D001

```json
{
  "id": "WO-132-D001",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Implement the machinery stand-down as the single bounded system change authorized by WO-132; remove transition gate requirements and replica reuse before simplifying their consumers.",
  "evidence": ["docs/work-orders/WO-132-machinery-stand-down.md", "docs/planning/machinery-stand-down-2026-09-15.md", "docs/evidence/WO-128/decisions.md#wo-128-d010", "scripts/lib/lifecycle-evidence.mjs", "scripts/test-runner.mjs"],
  "rejected": [
    {"option": "NoOp", "reason": "The recorded eight gates and repeated permission/refutation refusals would continue blocking the selected product critical path."},
    {"option": "Repair only the whole-tree key", "reason": "Leaves transition gating, replica costs and unrelated permission refusals in place."},
    {"option": "Split the work into separate orders", "reason": "The operator explicitly exempted this order because each split would pay the old lifecycle in full."}
  ],
  "reopenWhen": "A removed mechanism is shown by an observed failure to protect a required product outcome, or the three fresh product gates fail the six-minute target. The operator removed the eight-hour cutoff during execution."
}
```

The contribution to the local-first runtime is removal of the recurring
supervision cost delaying the next source-to-deliverable orders. Policy
resistance and escalation are the gates/refusals undoing ordinary progress;
commons cost and drift are judged against the recorded 605-second baseline.
Success to the successful is addressed by removing machinery despite prior
investment. Shifting the burden is addressed by retaining executable release
close and writer protection. Rule beating is checked with an executed lifecycle
and code-change identity probes. Seeking the wrong goal is checked against
operator flow and three fresh gate durations, not receipt count. Naive
Interventionism: retain product tests, immutable reports, clean-room rules,
host permissions, live-gate protection and one writer per worktree.

### Rollback fallback, recorded before implementation

Entry: 2026-09-15T05:46Z. The operator removed the eight-hour cutoff during
execution and authorized the time and resources needed to finish. Root is the sole
writable agent in this worktree; analysis workers are read-only. No branch
commit or publication is authorized by this dispatch.

The timed fallback below is superseded by that operator amendment. If the
operator later chooses rollback, preserve current work and intake through the
canonical recovery procedure. The optional recovery procedure uses a separate
branch from updated main and these reverse-order
commands, identified from the first-parent merge history:

```sh
git switch -c recovery/wo132-runner-revert
git revert --no-commit -m 1 b38c069
git revert --no-commit -m 1 dfc0874
git revert --no-commit -m 1 6c9b39a
```

These are WO-131 (#61), WO-130 (#58), and WO-129 (#57). They are recorded,
not executed. Resolve conflicts while retaining the later egress-first close,
operator controls, live-gate stop and load-derived deadlines, then review the
result before committing or publishing. Never apply this fallback over the
pending implementation worktree.

### Measurement baseline

The planning diagnosis records 605 seconds and 82 fresh tasks at v0.17.7.
The final measurements below identify source bytes, scope and cutoff.
Entry usage is unknown: the collector found no usable current-session token
counters. No substitute session or zero total is used.


## WO-132-D002

```json
{
  "id": "WO-132-D002",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Retire repeated lifecycle gates and runner replicas; retain a tracked-source product identity, one reviewer row and the two hook invariants. Keep historical evidence immutable and compare edition sources directly when only component release labels change. Prepare application v0.18.0 with compiler 0.10.0, skeleton 0.16.0 and console 0.1.6.",
  "evidence": [
    "docs/work-orders/WO-132-machinery-stand-down.md",
    "docs/planning/machinery-stand-down-2026-09-15.md",
    "docs/evidence/WO-044/decisions.md#wo-044-d016",
    "docs/evidence/WO-128/decisions.md#wo-128-d010",
    "docs/evidence/WO-131/engineering-review.md",
    "scripts/test-runner.mjs",
    "scripts/test-release-composition.mjs"
  ],
  "rejected": [
    {
      "option": "Keep suite reuse as an opt-in mode",
      "reason": "Retains the declared-input/replica/cache maintenance that the order explicitly removes."
    },
    {
      "option": "Treat every release-label bump as a new live audit",
      "reason": "Version-only changes do not change the behavior the historical observation tested; current behavioral assertions still run and actual source changes require current evidence."
    },
    {
      "option": "Delete historical validators and receipts",
      "reason": "Their original identities and meaning are evidence; only newly dispatched judgments use the goal-review protocol."
    }
  ],
  "reopenWhen": "An observed product failure, code-identity mismatch, missing source-triggered review suite or next real order paying repeated gates demonstrates a required protection was lost."
}
```

### Removal and demotion register

| Mechanism removed or demoted | Source decision and implementation | Reopen only on |
| --- | --- | --- |
| Whole-tree gate, session authorship, output-read, usage, projection and pending planning-handoff prerequisites at every completion | WO-126 lifecycle contract, WO-044 D014/D016; `scripts/lib/lifecycle-evidence.mjs` now runs inline diff and logs missing observations | A legal completion loses a required report or attestation, or illegal phase is admitted |
| Shared suite successes, declared-input keys and environment fingerprints | WO-129 and WO-131 review R2–R4; deleted from `scripts/lib/suite-evidence.mjs` and `gate-evidence.mjs` | Measured iteration cost warrants a separately authorized proposal |
| Replica worktrees, installed copies, Git replicas and kernel-denial probe | WO-130 and WO-131 review R1/R7; deleted `suite-replica.mjs`, `suite-sandbox.mjs` and their machinery-only tests | An observed working-tree suite contaminates another required product check |
| Per-test expansion except release cases; default machinery suites | WO-127–WO-131 runner; `scripts/test-runner.mjs` now one task per suite and `protects` declarations | Actual product protection was omitted or source-triggered review fails to select its own machinery |
| Slower shared scheduling for heavy machinery | WO-128 D008/D010, same-source 462.3 s exclusive versus 666.5 s shared; restore exclusive harness/process-debt | A same-source comparison supports a faster reliable configuration |
| Main-branch writer prohibition and managed-release bypass | Feedback writer v1; writer v2 reserves every branch in `feedback.ts` and `harness-host.ts` | Second live writer is admitted or dead-owner recovery loses pending work |
| Hook denials for classification, unknown tools, outside reads, attribution and unavailable adapter | WO-126 classifier/observers and WO-131 review; generated hooks journal advisory and defer to host | An observed failure demonstrates host permission plus two invariants cannot protect the authorized boundary |
| Version floors, selector/readback admission and below-declared effort refusal | WO-019/WO-125/WO-126; `resume.mjs`, worker transport and refuter now retain supplied values; ultra maps to xhigh + subagents + raw | A supplied field cannot be represented faithfully or launch selection is silently changed |
| Post-merge suites, install, smoke and cleanup-before-publication | WO-130/WO-131 close, WO-044 D016; release consumes committed reviewer row before best-effort cleanup | Code mismatch publishes, duplicate publication changes bytes, or cleanup destroys retained work |
| Third-hold stop, pass budget, structural cost hold and repair re-judgment | WO-041/WO-126 refutation and receipts 009–012 in the planning diagnosis; new goal-review schema with criterion-bound dispositions | A recorded failure or vision contradiction was demoted without a defensible disposition |
| Process-cost refusal | WO-126 budgets, context meter and usage collection; measurements now advisory/unknown and closed Cost promises print beside observed rows | Missing observation is presented as measured success, or shortfall disappears from planning input |
| Version-only evidence re-audits | WO-044 D016; direct source-content comparison to the edition-filing commit, with only component release labels normalized | Changed behavior or external dependency is admitted as unchanged evidence |

The release is minor because it changes lifecycle admission, feedback writer
semantics and refutation output. Kernel remains unchanged. The console patch
parses the new goal verdicts, four answers and findings and displays `holdReasons`; it is necessary
schema-consumer compatibility, with no console feature or architecture change.
No dependency is added. Generated role text carries the same duties and residue
in both harnesses; host permission enforcement remains outside DotLn.

### Integration corrections

2026-09-15: Initial edits assumed all synthetic lifecycle fixtures already used
Git. Inline `git diff --check` exposed two fixtures without repositories; they
now initialize Git, while the product phase/report assertions remain intact.
The context checker also retained an old cost-budget exception after the hook
change; the breach now prints an advisory. Retired replica/cache composition
assertions were removed with their implementation, and the executable release
fixture covers the replacement one-gate lifecycle.

The operator's cutoff amendment is recorded in the order's execution appendix,
preserving the original planning subject and superseding the old timed stop.
The three required fresh product measurements are recorded in [product-gates.json](product-gates.json).
Final-review publication and the next real order remain separate dispatches.

The first full product run completed in 243.151 seconds with 62 fresh tasks and
four failures. It is retained as a failed integration observation, not a passing
measurement. The beacon CLI fixture omitted a newly imported gate-evidence
module; its copied source set now includes it. The console selfhost fixture
pinned writer v1 despite the new live audit observing writer v2; a new WO-132
unit snapshot and selfhost pins preserve all historical snapshots. The compiler
purity regex treated emitted hook text as executed I/O; a test-only syntax walk
now distinguishes literal text from executable imports, calls and template
substitutions. The checkpoint failure shim hid its own shell before reaching
checkpoint creation; it now fails the intended commit-tree operation after the
inline diff check. These corrections preserve the product assertions.

The meter also still counted retired per-suite check rows. It now reads the
latest successful aggregate's observed task count, with explicit historical
fallbacks; failed runs do not replace that count, and zero and unknown remain
distinct. The focused regression covers new, historical, missing and failed
observations. Release prose was unwrapped to satisfy the existing GitHub body
profile. Publication coverage and source locks were updated for the new dated
contract sections.


## WO-132-D003

```json
{
  "id": "WO-132-D003",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Complete the disposition migration for historical holds and permit an exact Cost-header repair within the existing criterion-bound disposition or override. Generate current release notes from the reviewer-evidence contract without claiming an unexecuted dependency install.",
  "evidence": [
    "docs/work-orders/WO-132-machinery-stand-down.md",
    "scripts/lib/plan-receipts.mjs",
    "scripts/lib/plan-continuation.mjs",
    "scripts/release.mjs"
  ],
  "rejected": [
    {"option": "NoOp", "reason": "Source audit reproduced a disposed historical hold remaining unanswered and identified a Cost repair blocked from both continuation and another judgment; current release prose would assert npm ci despite the new close never running it."},
    {"option": "Accept arbitrary order edits after disposition", "reason": "Would detach the accepted repair from the exact criterion and Cost text that was reviewed."},
    {"option": "Require another worker judgment for the repaired Cost line", "reason": "Would restore the repair/re-judgment loop removed by criterion 11 without any changed observed evidence."}
  ],
  "reopenWhen": "An unrelated order edit passes continuation, historical receipt identity changes, or publication prose asserts an observation absent from its evidence contract."
}
```

This is a completion of criteria 10 and 11 within their existing commands and
records. The refuter explicitly judges the Cost line; a repair must be able to
settle that finding. Exact old/current Cost text is bound alongside the held
criterion on the existing disposition, with no new operator step or general
subject-edit exception. Historical receipts and control events retain their
bytes; unrelated edits still require a matching planning subject. Historical
tag reconstruction retains its original notes while the new product-row
contract uses a truthful code-identity statement.

The goal is removal of a reproduced repair refusal on the product critical
path. Against the eight traps: policy resistance and escalation are the
self-reinstating judgment loop; commons cost and drift are the unnecessary
worker pass; success to the successful would preserve the obsolete validator;
shifting the burden would require operator bypass; rule beating is prevented
by exact repair text; seeking the wrong goal would count a fresh receipt instead
of a settled finding. Naive Interventionism is bounded by preserving historical
identities and unrelated-edit refusal. NoOp retains the observed contradiction.

The full machinery run exposed two further fixture mismatches: an old context
size assertion still expected a refusal, and the release-case inventory omitted
the added one-gate lifecycle case. The corrected assertions retain read
accounting and every existing release scenario. Both focused reproductions and
repairs ran before the final validation pass. Component README headings and the
current console note now match the prepared component versions.


### Final observed outcomes

All three consecutive final-source `npm test` runs passed with 19 suites,
62 fresh tasks and zero reused tasks. All 43 release cases ran; their timeline
uses four lanes with up to four release cases concurrent.

| Observation | Wall seconds | Fresh tasks | Result |
| --- | ---: | ---: | --- |
| Recorded v0.17.7 planning baseline | 605.000 | 82 | Prior observation |
| Initial integration attempt | 243.151 | 62 | Failed; preserved with its four diagnoses |
| Final fresh run 1 | 254.908 | 62 | Passed |
| Final fresh run 2 | 250.500 | 62 | Passed |
| Final fresh run 3 | 246.160 | 62 | Passed |

The mean is 250.523 seconds, a 58.59% reduction in wall time
against the recorded baseline. This meets the under-360-second target and is
within the planning diagnosis's 230–270-second estimate. The suite inventory
removes 20 tasks from the default gate while preserving product tests. The
separate final machinery run passed all 16 checks in 547.16 seconds; the final
document run passed all 17 checks in 70.69 seconds. Machinery time remains
visible and is paid on demand or when its sources change at review.

[Product gate observations](product-gates.json) retain both identities, exact
UTC observations and task timelines, including the initial failed attempt.
[Validation](validation.md) records the executable checks and their limits.
The close fixture used exactly one gate and completed close in 6.144 seconds
with local transport doubles. Actual publication and the next real order's
one-gate control segment remain future observations under their own dispatches.
This executor's three calibration runs are the explicit criterion-6 duty,
not a recurring transition prerequisite. The mission outcome is a measured
removal of repeated work, with host permissions, writer isolation, live-gate
protection and historical evidence retained. No rollback was needed.

## WO-132-D004

```json
{
  "id": "WO-132-D004",
  "date": "2026-09-15",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1 by reading the complete Cost paragraph through its field, paragraph or true end-of-file boundary, and exercise the closed-order collection and rendered planning-input path with wrapped authority text.",
  "evidence": ["docs/verifications/WO-132/VER-001.md#f1", "scripts/lib/meta.mjs", "scripts/test-process-debt.mjs", "docs/work-orders/WO-126-process-debt.md", "docs/product/07-execution-guide.md#discipline"],
  "rejected": [
    {"option": "NoOp", "reason": "The printed promise drops the removal clause and cannot inform the next product-planning decision."},
    {"option": "Remove end-of-file support", "reason": "A final Cost paragraph without another field must still be represented."},
    {"option": "Infer a ceiling from an estimate or another section", "reason": "That would invent a Cost promise; ambiguous declarations must remain unknown."}
  ],
  "reopenWhen": "A real declaration is truncated or an explicit measured shortfall fails to appear as planning input."
}
```

The mission contribution is a truthful closeout comparison that helps the next
planning pass avoid another machinery detour. Rule beating and seeking the
wrong goal are addressed by testing Markdown through the printed result, not
only an injected string. Policy resistance, escalation and shifting the burden
are bounded by keeping reconciliation advisory, without another operator step.
Commons cost and drift are bounded by focused regressions and the existing
checks. Success to the successful supplies no reason to retain the broken
parser. Naive Interventionism: preserve historical authorities and observations,
true end-of-file support and unknown outcomes; no new mechanism or dependency.

Correction, 2026-09-15: VER-001 correctly diagnoses truncation, but attributes
an "under six minutes fresh" promise to WO-132's Cost paragraph. That paragraph
estimates about 250 seconds; the under-360-second requirement is criterion 6.
Full WO-126–WO-132 Cost paragraphs have no numeric ceiling matching the existing
explicit-bound grammar. Their unknown outcomes remain honest after extraction
is repaired. A wrapped fixture with an explicit bound establishes the printed
shortfall path; the immutable verification report is preserved.

## WO-132-D005

```json
{
  "id": "WO-132-D005",
  "date": "2026-09-15",
  "dispatch": "resume: fix",
  "decision": "Apply the operator-approved adjacent repairs in order: exclude unavailable or invalid durations from cost outcomes, then admit ls, head and grep through the existing bounded gate destination adapter with read and write regression coverage.",
  "evidence": ["scripts/lib/meta.mjs", "docs/verifications/WO-132/VER-001.md#f2", "docs/verifications/WO-132/VER-001.md#f3", "packages/skeleton/src/harness-command.ts", "scripts/test-harness.mjs", "docs/planning/machinery-stand-down-2026-09-15.md#7-declined-alternatives--the-noop-register-of-this-pass"],
  "rejected": [
    {"option": "NoOp", "reason": "Missing duration currently reports met, and the verifier encountered read-only shell refusals without regression coverage."},
    {"option": "Admit every opaque shell command during the gate", "reason": "Would remove the protected live-gate write invariant."},
    {"option": "Build a general shell classifier or weaken writer reservations", "reason": "Exceeds the three ordinary utilities needed by the observed reads and repeats the planning diagnosis's declined classifier approach."}
  ],
  "reopenWhen": "A named ordinary read is still refused, a redirected or chained gate-input write is admitted, or absent duration is reported as measured success. Broader shell support requires a concrete destination adapter and executable protection evidence."
}
```

The operator explicitly selected both bounded repairs during this dispatch.
The local adjacent queue records their cause, scope, priority, announcements
and actor-attested steering. These repairs protect truthful measurements and
reduce supervision during the one gate window. They add no recurring step.
Rule beating and seeking the wrong goal are addressed by invalid-duration and
actual shell-payload regressions. Policy resistance, escalation and shifting
the burden are reduced by admitting ordinary reads without bypasses. Commons
cost and drift stay bounded by the same existing suites; success to the
successful does not justify preserving false positives. Naive Interventionism
preserves displayed observations, zero durations, writer reservations,
redirection destinations and opaque expansion refusals. The adapter retains
its existing assumption that bare utility names refer to ordinary programs.
F2's loop example remains opaque; this repair does not claim arbitrary shell
reads are recognized.

The first repair document run correctly rejected the stale authority bundle
snapshot after rebuilding the changed shell adapter (one failure, four
dependent checks skipped). Authority revision 001 was generated and checked
before selecting it in `docs/evidence/current.json`; the original authority
files remain byte-for-byte intact. This is the existing immutable-evidence
procedure, with no new admission rule. The publication source lock also follows
the documented repair. The prepared v0.18.0 and its component classifications
remain unchanged.

## WO-132-D006

```json
{
  "id": "WO-132-D006",
  "date": "2026-09-15",
  "dispatch": "resume: fix",
  "decision": "Repair VER-002 F1 in the bounded gate destination adapter: `>&word`, `N>&word` and `>>&word` record `word` as the destination when the operand is not a descriptor number, `-` records no destination, a spaced operand is the next word, and a missing, expanded or wildcard operand stays opaque; pin the parse with an adapter unit test and with hook-fixture denials into `packages/<pkg>/dist` and `./node_modules` (F2).",
  "evidence": ["docs/verifications/WO-132/VER-002.md#f1", "docs/verifications/WO-132/VER-002.md#f2", "packages/skeleton/src/harness-command.ts", "scripts/test-process-debt.mjs", "scripts/test-harness.mjs", "docs/evidence/WO-132/repair-002.md", "docs/evidence/WO-132/authority/002/authority.json"],
  "rejected": [
    {"option": "NoOp", "reason": "The kept live-gate invariant admitted writes to the built dist and installed modules the gate executes, and D005 named that observation as its own reopening condition."},
    {"option": "Return null for every non-numeric `>&` operand", "reason": "Fail-closed for the invariant, but it would refuse `>&scratch` and keep the `2>&-` false refusal recorded as O1; the destination is fully determined by the operand, so recording it is no wider than the existing `>` and `&>` branches."},
    {"option": "Remove `ls`, `head` and `grep` from the admitted programs again", "reason": "Would reopen VER-001 F2/F3 over-refusal without closing the `echo`, `printf` and `cat` form of the same misparse, which predates this order."},
    {"option": "Anchor the repository's `dist/` and `node_modules/` ignore rules instead", "reason": "Treats the symptom in a data file; the corrupted spelling would still reach the classifier, and any later unanchored rule would reopen it."}
  ],
  "reopenWhen": "A shell spelling that bash or zsh resolves to a gate input is recorded as a different path by shellWritePaths, or an ordinary read that only duplicates or closes a descriptor is refused during a live gate."
}
```

The mission contribution is the meaning of the one product-gate row: after
this order the reviewer's single `npm test` row is the release evidence and
the close runs no suite, so the refusal that keeps the gate's inputs still
while it runs is what makes that row evidence. Rule beating is addressed by
pointing the fixture at the destinations the invariant protects (`packages/*/dist`,
`./node_modules`) rather than at tracked files whose corrupted spelling was
denied by accident; seeking the wrong goal, by judging the invariant and not
the fixture's pass. Shifting the burden: no rerun exists to catch a tampered
gate, so the parse is repaired at its source. Policy resistance and escalation
are bounded by scoping the change to the misparse: it removes a false refusal
(`2>&-`) and adds none. Commons cost and drift stay bounded by the existing
two suites and no new mechanism; success to the successful supplies no reason
to keep a parse that bash and zsh contradict. Naive Interventionism preserves
input duplication (`<&word`), quoted and expanded operands and the admitted
program list exactly as they were, and touches no writer reservation or host
permission. NoOp was compared and rejected above.

Provenance: the `>&` misparse is on `main` for `echo`, `printf` and `cat`
(VER-002 F1, introduced by `c8983cc`); the VER-001 repair admitted `ls`, `head`
and `grep` through the same parse. This repair closes both.

Corrections, 2026-09-15, to the VER-001 repair record
[repair-validation.md](repair-validation.md), which stays unedited:

- "All three retain protected-file and success-record write denials, including
  redirection" was written from the `>`, `>>`, `&>` and `tee` cases the fixture
  exercised. It did not hold for `>&`, `1>&` or `>>&`, and the fixture could
  not fail on them (VER-002 F2). What was meant is the tested redirect forms;
  what changed is that the adapter and the fixture now cover the descriptor
  forms as well.
- "16 original WO-132 evidence/report files match the entry checkpoint" is
  17 of 19 byte-identical: `decisions.md` is append-only with its prefix
  intact, and the generated cost table in `PR.md` was refreshed (VER-002 O7).
- "The new integration regression first failed" and "the missing-duration
  regression first reproduced `met`" describe runs that are not in the retained
  logs the record cites; VER-002 corroborated all three by in-memory replays of
  the old code. This repair records its own pre-repair observation in
  [repair-002.md](repair-002.md) from the checkpoint-9 source.

## WO-132-D007

```json
{
  "id": "WO-132-D007",
  "date": "2026-09-15",
  "dispatch": "resume: fix",
  "decision": "Repair VER-003 F1 by distinguishing the single-output redirect operator from append before interpreting its operand: numeric and dash operands after >& duplicate or close descriptors, while >>& retains them as filenames. Extend the existing parser and generated-hook regressions with the seven reported commands.",
  "evidence": ["docs/verifications/WO-132/VER-003.md#f1--append-operands-are-discarded-as-descriptors", "packages/skeleton/src/harness-command.ts", "scripts/test-process-debt.mjs", "scripts/test-harness.mjs", "https://zsh.sourceforge.io/Doc/Release/Redirection.html"],
  "rejected": [
    {"option": "NoOp", "reason": "Five direct zsh 5.9 scratch commands appended to their numeric or dash destination while the current adapter returned an empty write set; VER-003 independently reproduced the generated-hook admissions."},
    {"option": "Make all append redirects opaque", "reason": "The literal destination is available, so that would unnecessarily refuse append writes to permitted scratch paths."},
    {"option": "Replace the shell classifier or remove admitted read utilities", "reason": "The observed regression needs only the operator distinction; broader changes add risk and reopen ordinary-read refusals."}
  ],
  "reopenWhen": "An executed supported redirect writes a gate input while the adapter returns a different destination or no destination, or a descriptor-only ordinary read is refused by this correction."
}
```

The goal is reliable evidence for the product loop: the single reviewed gate
must retain its input protection before release close can consume its result.
Rule beating and seeking the wrong goal favor testing the actual numeric/dash
destinations in generated hooks, not only a passing parser assertion. Policy
resistance, escalation and shifting the burden favor retaining ordinary reads
and fixing the operand distinction without another operator step. Commons cost
and drift favor the two affected suites and existing generation checks;
success to the successful gives the old parser no preference over the observed
shell behavior. Naive Interventionism preserves the existing pathname,
descriptor and opaque-command handling and adds no mechanism or dependency.
NoOp retains the reproduced gate-input admission.

Correction, 2026-09-15: D006 and [repair-002.md](repair-002.md) generalized the
numeric/dash descriptor exception to both `>&` and `>>&`. It applies only to
`>&`; zsh's `>>&` opens an append destination even when it is named `1` or `-`.
The [zsh redirection manual](https://zsh.sourceforge.io/Doc/Release/Redirection.html)
documents the operators separately. Five fresh `/bin/zsh -f -c` executions
confirmed the file effects before editing the adapter. This append-only
correction preserves the earlier record and narrows the explanation; the
implementation and both existing regressions now distinguish the operators.

## WO-132-D008

```json
{
  "id": "WO-132-D008",
  "date": "2026-09-15",
  "dispatch": "resume: fix",
  "decision": "Repair VER-004 F1 with one shared literal-operand boundary in both output-redirect branches. An operand must start with an ASCII letter, digit, dot, underscore or slash, or be the literal dash filename; shell-special prefixes such as ! and = stay opaque. Preserve the existing expansion checks, descriptor-only reads and literal append destinations. Pin every reported command against the parser and generated live-gate hooks.",
  "evidence": ["docs/verifications/WO-132/VER-004.md", "packages/skeleton/src/harness-command.ts", "scripts/test-process-debt.mjs", "scripts/test-harness.mjs", "https://zsh.sourceforge.io/Doc/Release/Redirection.html", "https://zsh.sourceforge.io/Doc/Release/Expansion.html#Filename-Expansion"],
  "rejected": [
    {"option": "NoOp", "reason": "VER-004 executed the generated hooks and found admissions into built gate inputs; this meets D006 and D007's reopening observations."},
    {"option": "Strip ! and record both bash and zsh destinations", "reason": "Adds another spelling-specific interpretation after three consecutive operand findings and leaves other shell-special prefixes to the same loop."},
    {"option": "Make every redirect opaque or remove ordinary read utilities", "reason": "Would discard already-tested literal scratch writes and descriptor-only reads; the observed failure needs only the operand boundary."},
    {"option": "Change ignore rules or replace the shell parser", "reason": "The former leaves a false destination in the adapter; the latter adds a larger mechanism outside this bounded repair."}
  ],
  "reopenWhen": "An executed shell redirect is admitted during a live gate while writing a protected input, or this boundary refuses a required ordinary descriptor-only read. Broader literal-prefix support requires an observed need and shell-effect evidence."
}
```

The mission and critical-path contribution is dependable evidence for the
source-to-deliverable loop: release close consumes the single reviewed gate.
Rule beating and seeking the wrong goal favor generated-hook checks against
the actual dist and installed-module targets, with the pre-repair failure
retained. Policy resistance and escalation favor a shared operand rule over
another operator spelling patch. Shifting the burden favors closing the
admission here, without a release rerun or operator rescue. Commons cost and
drift favor the two affected suites and existing generated/document checks;
success to the successful gives the existing parser no preference over the
observed shell effects. Naive Interventionism preserves normal path handling,
numeric/dash append files, descriptor-only reads, and host delegation outside
a live gate. It adds no dependency or recurring command. NoOp retains F1.

Correction, 2026-09-15: D006 and D007 correctly describe their tested pathname
and numeric/dash cases, but their operand checks did not establish that every
captured suffix was a literal pathname. VER-004 shows that zsh consumes `!` as
part of a clobber-override operator while bash can keep it in a filename. The
adapter must return opaque for this ambiguous prefix instead of sending a
different spelling to the ignore classifier. The product 07 sentence is
narrowed to ordinary literal operands; earlier decisions and reports remain
unchanged. The final checks and their limits are recorded in repair 004.
