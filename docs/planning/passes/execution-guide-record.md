# Execution guide record

Dated accounts that stood in the [execution guide](../../product/07-execution-guide.md) until WO-238 moved them here, byte for byte except for their relative links, which are rebased to this directory. The guide states the rules; this record keeps how they arrived. It is a record: it is not rewritten, and the guide links it.

## The cold-start measurements

The measurements behind the cold-start section's method, as the section stated them before WO-238 restated it as current rules.

`node scripts/harness-context.mjs --check` measures the installed floor plus each
role skill against the previous edition and its budget. Required task-document
reads remain scoped by the directives above; editing a product document does
not alter the cold-start comparison or require a new evidence edition. The
historical [WO-039 measurement](../../evidence/WO-039/harness-context.json) retains
its original broader method.

WO-155's measurement compares with the highest reachable local release tag
(`vX.Y.Z`) and reports each role's bytes and delta beside its ceiling. The last
acceptance comparison uses the first committed snapshot on the current
branch's first-parent history containing that role's latest global acceptance
(date, then record order). Its source and measured bytes are recorded; the
ceiling and numbers in historical reason prose are not byte measurements.
Missing history or files produce an unavailable delta with a cause.
`--check` refuses any unresolved `Read:`, never a budget advisory;
no flag prints the measurement alone. `npm run meta` includes the same per-role rows
in its drift signal. The [loading observations](../../evidence/WO-155/skill-loading.json)
found fresh Claude Explore and Copilot task workers without the floor in their initial context,
so the full refusals paragraph remains in each skill under WO-155's fallback.

This guide is the operating contract. Harness-specific observations (version,
model and effort readback, host permission modes) live in
`docs/AI-HARNESS-SECURITY.md` and the playbook, with a pointer where each
left (WO-090, 2026-09-20). The [WO-090 measurement](../../evidence/WO-090/README.md)
by WO-039's method records that this guide enters the fixture's directed sets
only through §Goal-aligned decisions; actual orders add their cited sections.
Retiring that section's duplicated role procedure lowers every measured role's
directed total; the harness-observation moves alone left those totals unchanged.

## Entropy Reducer consumptions

Each planning pass that consumed an Entropy Reducer review, as §Operator-opened planning pass listed them.

Consumptions: [[REVIEW-002 pass](entropy-review-002-2026-09-22.md),
2026-09-22]; [[off-ramps pass](off-ramps-5s-entropy-2026-09-25.md)
§9, 2026-09-25]; [[REVIEW-006 pass](entropy-review-006-2026-10-10.md),
2026-10-10: one order from one finding, one product sentence from the other];
[[REVIEW-007 pass](entropy-review-007-2026-10-20.md),
2026-10-20: no new order, both findings to WO-219 as steps, one of them a
guard on the review machinery itself].

## Why the planning screens exist

The screens before filing, with the failed orders and verifications that produced each, as §Operator-opened planning pass carried them before WO-238 listed the screens as rules.

An order carries an `Execution plan`: numbered steps in execution order,
each naming one file (existing, with the function or export it changes, or
new, in a directory that exists or an earlier step creates), the change, and
the command that checks it; write-backs last, each with the section heading
as it reads today; then the handoff sequence of §Discipline. A step that
cannot be written until another order merges says so and names what will be
known then. Two screens before filing [2026-10-07 pass](machinery-reset-2026-10-07.md): an order that says
no code ships is checked against every cited design for work assigned to it
("a model episode in WO-NNN", "supplied by WO-NNN") and against every
criterion that needs capability the tree lacks (WO-112 D018: planned as
evidence-only, it needed four code repairs under override); and no criterion
requires a deterministic reading of natural language or free-form Markdown,
which includes counting its sentences (WO-189's criterion 5 cost three failed
verifications on 2026-10-10 before a line count replaced the sentence count).
A classification of wording is a persisted judgment supplied as input; a
record inside a document is a marker block holding JSON or a typed field.
WO-123 (criterion 5, four repairs) and WO-187 (criteria 2 and 4, four
repairs) spent 39.9 hours between them before each reader was replaced by a
structured input. Two more screens [2026-10-13 pass](standard-pass-2026-10-13.md): verification judges
each criterion as written, so a scope decision recorded in a Design, a step
or a known issue is written into every criterion it narrows, and no step
contradicts a criterion (WO-118's VER-001 failed criterion 4, whose phases
step 7 had moved onto receipts while the criterion still required the
console to show them); and an order whose criteria need a live run names, at
its base, each surface the run must show, write or traverse, and whether it
exists and has been run (WO-118 needed three mid-run scope amendments for
four such surfaces, and WO-083's publication step named a command that publishes only a
source-change episode). One more [2026-10-19 pass](standard-pass-2026-10-19.md): a criterion names the
behavior a host's configuration form must give (the admitted command, the
removal at close) and cites the published host page it was read from; the
form itself (a settings key, a marker, a rules file) is the executor's,
read from that page at execution, so a host that documents a different
form costs no failed verification (WO-221's criteria 2 and 3 fixed a
marker and a `config.toml` form the hosts do not support; VER-001 failed
them as written and D028's operator amendment replaced them). One more
[2026-10-20 pass](entropy-review-007-2026-10-20.md): a criterion that settles a boarded row by a case that
fails without the fix names the control, the case run with only that
row's fix reverted and recorded with both arms' exit codes in a replayable
file, as WO-218's repair recorded its 91 controls after VER-001 found three
named cases passing at the base; a case that also passes at the base, or
with the fix reverted, settles nothing. One more [2026-10-25 pass](fork-returns-and-review-lint-2026-10-25.md): an order
that changes which commit a lifecycle step computes from (a base, a merge
base, a revision) names every reader of that field across `scripts/` and
`packages/` in its Observed gap, each kept or moved with its reason (WO-230
moved the publish's three reads to the described base and left
`lintReviewedTargetCommits`, the fourth reader, on the activation base; the
DotLn-Angular fork's WO-013 FINAL-002 was refused on two merged subjects the
day the release landed, and WO-231 moves it). An order that adds recurring
work to a gate, a hook, a prune or a close names that work's measured cost
before and after, in its Cost line and its decisions, from a close's step
timings or `plan conditions`; a cost that is not measured is `unknown`,
never assumed cheap ([the 2026-10-28
pass](document-contract-and-release-close-2026-10-28.md);
WO-236-D025). Five more [[the 2026-11-01 pass](fork-blocks-close-residue-reviews-criteria-desktop-opt-in-2026-11-01.md),
the operator's item 7 of that day]: a criterion states a behavior
observable on the uncommitted candidate by a named command; a count, a
ceiling, a cost, a duration or a token figure is a Cost line or a decisions
record and never a criterion's subject (WO-173's criterion 5 and WO-197's
criterion 2 were waived on a byte figure and a timing ceiling; the fork's
WO-022 carried a token-spend stop its executor asked the operator to lift);
a judgment the kit makes at a later phase, the final review's clean subject
or the release close's clean and undeclared-material judgments, stays with
that phase, and a clause that reads `HEAD` or a commit range for the
order's own changes before the final review's commit checks nothing (the
fork's WO-021 criterion 9 failed its VER-001 on 129 uncommitted paths); a
criterion that reads data names where it exists at the base or which step
creates it (WO-197's criterion 1 read per-case timing that began on
2026-10-05); a criterion that depends on a host, a service or an operator
account names its fallback evidence (WO-192's criterion 17); and the
criteria are read against each other and the non-goals for a pair that
cannot both hold. These are the five classes by which a verifier or a final
reviewer records a criterion defective with `npm run resume -- defect`
(bookkeeping, later-phase, absent-input, host-behavior, contradiction).
`npm run work-orders -- index --check` prints `criteria advisory: WO-NNN
criterion N: <what matched>` for each criterion of an active or open order
whose wording often marks
one: a number followed by a unit (`s`, `ms`, `min`, `h`, `bytes`, `KB`,
`MB`, `GB`, `tokens`, `USD`, `%`) or a dollar amount (`$5`), a median,
ceiling, budget or cap beside a figure, `HEAD`, `git log`, a `..` or `...` revision range, or the phrases
"after the review gate", "at release close" and "after the final review".
It refuses nothing, because a figure can rightly name a record and a
regular expression over prose is a screen, not a judgment: the planner reads
each line before filing. `plan check` returns the same lines as its
`criteriaAdvisories`, and `npm run test:docs` relays them from its passing
`index` task, as it relays `ADVISORY` lines. `plan failures` counts the
records by class, and a
pass that reads one re-reads this list [WO-249].

## The document byte ceilings

The rule that set a byte ceiling for each product document, retired by WO-238 (WO-238-D005).

Ceilings are planning's alone [operator direction, 2026-10-07](machinery-reset-2026-10-07.md): every pass
sets each product document's ceiling (`docs/control/doc-ceilings.json`) at
its measured non-exempt bytes plus one tenth, citing its planning document;
the document check reports an overrun as an advisory that the next pass reads
(mechanical once WO-196 lands); no role trims reviewed text to a number and no
review asks the operator to settle bytes. When the operator makes bytes a goal and boards an overrun,
the entry may name an `advisoryDecision` in public evidence with a current
unresolved registered follow-up; the check reports the exact overrun without
raising its ceiling or exempting bytes. Remove that reference when the useful
text fits.

## Where the session commands were placed

The placement correction behind the first-party session commands.

Quoted examples of these prefixes are discussion, not a dispatch. A message actually prefixed `ideation:` still follows the ideation pipeline even when its subject is one of these commands. The contract is carried in the Contributor's generated instructions for both harnesses; this does not claim the separately deferred phrase-table generator in WO-088 is implemented. VER-002 F2–F4 corrected this placement on 2026-09-11: every generated role target carries the prefixes, including when optional supports are removed; the locked hand-written floor retains its original wording.
