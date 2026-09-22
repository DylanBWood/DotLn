# WO-063 FINAL-001 — final review

**Verdict:** pass. The subject meets all four acceptance criteria, the single
verification in the sequence is sound and reproducible, and the order's text is
byte-identical to the activated authority except for the release assignment its
own decision records. One product gate failed before the passing one, in another
order's fixture teardown and not in this subject; it is boarded up as
[WO-063-D005](../../evidence/WO-063/decisions.md#wo-063-d005) with a named
follow-up rather than repaired here.

**Subject:** [`docs/work-orders/WO-063-outward-artifact-lint.md`](../../work-orders/WO-063-outward-artifact-lint.md)
on branch `wo-063`. Both bases are the same commit: the branch has no commit of
its own, and `HEAD`, local `main` and `origin/main` are all `532059e38ec3` after
`git fetch origin main --tags`. No integration, merge, retime or conflict
resolution was needed, and no acceptance claim was carried across a moved base.
The reviewed work is the staged working tree at
`refs/dotln/checkpoint/WO-063/5` (`758a371b9ee6`), code identity
`db1c820d26ef9cccd265da9344eea9c16167f720a5b9cf9ac5e358d92faea76f`.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.263","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}

Human actor: the operator dispatched `resume: final review` in an attended
Claude Code session. This harness exposes no effective effort readback, so the
model and effort are operator-attested rather than session readback; the harness
name and version come from the project harness note. The order requires
`reviewer any`, so no effort drift arises. No subagent was launched: the harness
reports `count` 0, `countKind` `exact-observed` against the cap of 20, so the
whole budget remains. Two background tasks were dispatched and both observed to
completion (the two product gates, 290,195 ms and 284,496 ms to terminal
observation).

**Process cost:** entry 82632 tokens; handoff 8460791 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage`, taken
at 2026-09-22T01:55:57.758Z and 2026-09-22T02:11:59.339Z. Reasoning-output
tokens and dollar cost are unknown because those counters are unavailable in
this harness; they are unknown, not zero. This session recorded two `npm test`
gate rows, 289,844 ms at 2026-09-22T02:03:23.082Z (failed) and 284,165 ms at
2026-09-22T02:09:41.684Z (passed).

## Goal-aligned judgment

Principle 16 makes the projection boundary real: DotLn's internal vocabulary
must not reach a target's PRs, commits or coworker-facing text, and WO-033's
phase 2 already specified the two-part deny list this order delivers. Nothing
checked outward artifacts before they left the launchpad, and WO-064 cannot
apply a lint that does not exist. The intervention stays at the size of that
gap: one pure function, one stdin CLI, one editable committed vocabulary file,
one fixture suite and a five-line runner registration, with no dependency, no
runtime component, no hook, no caller and no target file.

Against the traps: escalation is bounded by a fixed profile instead of the
declined rule language; rule beating is answered by negative fixtures for
camouflage, privacy, absent lists and CLI exit codes; shifting the burden is
reduced because every finding names a stable rule and an original-text span;
policy resistance is bounded because the local list is still read only through
the unchanged WO-039 checker and is never committed or hashed; seeking the wrong
goal is bounded by the order's own non-goal, which leaves remote effects to
WO-064 and is honoured. Naive Interventionism is the live trap for this review
itself, and it decided two calls: I did not patch a shared test fixture whose
race I could not reproduce, and I did not rewrap an unwrapped product-doc bullet
whose only defect is cosmetic. NoOp would leave WO-064's admitted prerequisite
absent. The order claims no measured time or token saving, and none is claimed
in its receipt, its decisions or here.

## Authority: the order text against the activated text

`git diff refs/dotln/checkpoint/WO-063/1 -- docs/work-orders/WO-063-outward-artifact-lint.md`
returns exactly one hunk: the H1's `(version assigned at activation)` became
`(v0.40.3)`. Every other byte — all four acceptance criteria, the evidence gate,
the write-back duty, the non-goals, the operator-review assumption, the
dependency block and the nomination provenance — is identical to the text
activated at `16a69d4a0eea`. That single edit is the standing release assignment
recorded in WO-063-D003, and `npm run plan -- check` admits it as a
release-assignment continuation.

## The verification sequence

The sequence is one report: [VER-001](../../verifications/WO-063/VER-001.md),
verdict `pass`, recorded 2026-09-22T01:54:13.752Z against
`refs/dotln/checkpoint/WO-063/3`. There is no earlier failed verification, no
repair event and no superseded report, so nothing is carried forward from an
older subject. The control log for this order held five events before this
review's own result: activation, implementation-ready, the verification request,
its completion, and this final-review request.

VER-001 is sound on its own terms and I did not take it on trust. I reproduced
its consequential claims against the current bytes with my own probes rather
than rerunning its transcript: the 72-code-point bound holds on both sides in
code points and not UTF-16 units (67 astral emoji after `fix: ` pass, 68
refuse); camouflage is caught across a zero-width joiner, a zero-width space, a
soft hyphen, fullwidth forms, circled letters and a line break, while
`gemstone unmask dotlnish` passes, so the matcher joins whole tokens and never
matches inside a word; `Fix:`, `fix:handle input`, a trailing space and a tab
after the colon each refuse with `subject.shape`; `fix/../main` refuses with
`branch.shape`, which is what keeps a ref-traversal name out of a target; and a
supplied local observation produces a line-precision span with a count and no
term, matched text, list content or hash. VER-001's own instrument disclosure is
the right one and I repeated its substance: `scripts/test-runner.mjs` is both
subject and instrument, so the five added lines were read directly and the
suite was also run outside the runner.

One correction to VER-001's framing, which changes nothing about its verdict.
It reports its gate as judging "the same code" as the executor's because both
recorded code identity `a52ffe5dd216e1da…`. That identity was computed while
`scripts/lib/outward-lint.mjs`, `scripts/outward-lint.mjs` and
`scripts/test-outward-lint.mjs` were still untracked, and `gateCodeIdentity`
enumerates tracked files (`git ls-files`), so the three files carrying this
order's entire implementation were outside both of those identities. The suites
still executed that code — the `outward-lint` case ran and passed in both gates
— so no claim in VER-001 is falsified; what those two rows do not do is bind the
new bytes to the gate. That is exactly why the reviewer's gate is the one
publication consumes: I staged the new sources first, which moved the identity
to `db1c820d26ef9ccc…`, and `reviewedProductGate` compares that identity against
`HEAD` at publish.

## Criterion 1 — shape fixtures for subjects and branch names

Six required cases are executable fixtures in `scripts/test-outward-lint.mjs`
and all pass: a conforming subject; a missing type and an unknown type
(`subject.shape`, `subject.type`); an over-length subject (`subject.length`, at
73 code points, with 72 passing); a missing blank line (`commit.blank-line`,
including the case where the separator is a space rather than empty); and a
conforming and a non-conforming branch name (`branch.shape`), with
`branch.type` for an unknown branch type. Every refusal names its rule and
carries a span into the original text. **Pass.**

## Criterion 2 — two-part vocabulary deny, and `unavailable` rather than pass

All three parts hold. A body carrying a committed public term refuses with
`vocabulary.launchpad` and names the term with an exact span; a body carrying a
synthetic local term refuses with `vocabulary.local` when a fixture list is
present, exposing only a starting line and a count; and with no local list the
result is `unavailable` with exit code 2 while the committed part still runs and
still refuses. The third part is real in this worktree, not only in a fixture:
`docs/control/local/terms.txt` does not exist here, and the CLI returns
`unavailable` for clean text and `refused` with the public findings for text
carrying `DotLn`. Empty and uncontained lists yield
`local-terms.configuration` rather than a pass, and the symlink fixture leaks
neither the target's contents nor its path. **Pass.**

## Criterion 3 — write-backs

`docs/product/07-execution-guide.md` §Discipline opens with one bullet,
**Outward artifacts (WO-063)**, naming the pure lint and stdin CLI, the
conventional subject, title and branch checks, the configured public
vocabulary, the redacted local-term check, the `unavailable` result and
WO-064's ownership of publication integration. The ledger duty is discharged by
substitution, which is available because WO-063 was filed from the 2026-09-08
critical-path planning pass, before the 2026-09-09 boundary: the decisions file
carries WO-063-D001 through D005, `docs/lineage/decisions-index.md` carries all
five rows, and the WO-063 entry in the generated work-order index states the
inherited ledger duty and that no lifecycle ledger append is due. **Pass.**

## Criterion 4 — product gate, whitespace and dependencies

`npm test -- --review` at the staged code identity: **25 passed, 0 failed,
284.17 s, 69 fresh tasks**, exit 0, recorded 2026-09-22T02:09:41.684Z with
`sandbox.inForce` false, so it is a full row and not a partial inside-sandbox
one. `outward-lint` is among the 25 required suites and recorded exit 0 in
374 ms. `git diff --check` is clean on the staged tree. No dependency changed:
`package.json`, `package-lock.json` and `packages/` are untouched, the suite is
registered with `needsBuild: false`, and the new modules import only `node:`
builtins and existing project modules. No new `eslint-disable`, `@ts-ignore`,
`@ts-expect-error`, `prettier-ignore` or `biome-ignore` directive appears in any
changed file. **Pass.**

## The failed first gate, and why it is not a finding against this order

The reviewer's first gate at the same code identity failed: exit 1 at
2026-09-22T02:03:23.082Z, 24 of 25 cases green, the failing case
`runner-fixtures`. Its retained output shows `not ok 44 — WO-140 a partial
inside-sandbox row is rejected by every product-gate consumer at the code
identity where a full row is accepted`, with `failureType: 'hookFailed'` and
`ENOTEMPTY` from `rmSync` at `scripts/test-runner.test.mjs:1308`. The
assertions in that test all passed; the `t.after` teardown created by
`sandboxFixture` failed to remove its temporary repository, which still exists
and retains only `.git/objects/pack`, so the recursive removal raced with a
holder or writer of that path rather than being blocked by the `0o555`
directory the teardown already re-chmods. Run alone, the subtest passes; the
second full gate at the same identity passes 25 of 25.

This is not in WO-063's subject: the order's only change to the runner is the
five-line `outward-lint` registration in `scripts/test-runner.mjs`, and the
failure is in WO-140's fixture in `scripts/test-runner.test.mjs`, which this
order does not touch. I will not claim more than that. In the failing gate the
case started concurrently with `skeleton`, `worktree-integration` and
`local-runner-double`, so the added suite's scheduling pressure cannot be
excluded as a trigger, and this worktree's gate cache holds five `npm test`
rows, which is too little history to call the race pre-existing from the record.
I did not patch the teardown: no root cause was reproduced, a blanket retry
would be a guess, and a reviewer who writes a fix to a shared fixture is the
only judge of the one change no independent verification saw. WO-063-D005
records the defect, the three rejected dispositions and a named follow-up that
asks for the writer of `.git/objects/pack` to be identified and the teardown
made deterministic at that cause, with the abandoned-directory symptom as
acceptance.

## Integration, release and publication

`origin/main` was fetched and equals `HEAD`, so there is no new base, no merge
commit and no carried-forward claim. The highest published tag is `v0.40.2`, so
the `v0.40.3` application patch assigned in WO-063-D003 remains correct against
origin's tag observation and not only the local snapshot; no retiming was
needed; the executor's own `npm run release -- prepare --local` had already
reported `v0.40.3` current, which WO-063-D003 records. I sequenced the meter
refresh wrongly and say so here: I recorded the pass first, after which
`release prepare` refuses with `release prepare requires an unpublished, open
work order`, so the process-meter block was regenerated by invoking the same
producers that command uses — `collectMeta` and `renderMetaTable` from
`scripts/lib/meta.mjs` — into the same markers in the reviewed PR body. The
table is therefore observed after this review's own result rather than at
implementation time as the executor's draft had it. One consequence is
disclosed rather than hidden: `renderMetaTable` omits per-dispatch rows for a
closed order, and a passing final review closes the order, so a table rendered
after the result carries the work rows and an empty dispatch table. The block
is rendered from the same `collectMeta` data with this order's phase label set
to `final-review`, the phase this window actually ran in; no metric value is
altered, and the rows are the generator's own. The table reports one correction
against WO-063, which is this session's own journal entry, and it is the reason
the next order's meter should be refreshed before its result is recorded, not
after.

Two publication artifacts needed reviewer correction before they could be
published, and both are this role's own deliverables rather than defects in the
subject. The prepared `PR.md` opened with `# fix: lint outward artifact shape
and vocabulary`; every reviewed body in this repository uses `# WO-NNN`, and
08-publication-compiler.md §PRs and commits requires a gitmoji shortcode and a
headline in the title, which the conventional-commit spelling is not. That
spelling is the profile this lint enforces *for targets*; this repository's own
PRs follow its own publication contract, which is the same projection boundary
read from the other side. The body also linked no evidence and omitted the
limits a reviewer must act on. It is rewritten. `RELEASE-NOTES.md` carries the
five required sections and needed no correction beyond the evidence it now
cites.

## Clean-room screen and the ideation-receipt clause

The committed vocabulary file names only this repository's own public terms —
`DotLn`, `launchpad`, `gem(s)`, `mask(s)` — which are exactly the terms
Principle 16 names, and it contains no employer material, internal identifier,
host or credential. No local term is committed, hashed or echoed anywhere in
the diff, the reports or the publication artifacts, which is the property the
order was cut to preserve. The local-terms screen itself reports `unavailable`
in this worktree, so the screen here is inspection of the whole staged diff,
not a passing automated check, and I state it as such.

This order has no ideation breakout receipt, so the dispatch's "ideation
receipt" clause resolves to the outcome receipt,
[implementation.md](../../evidence/WO-063/implementation.md), which names the
affected surfaces and checks, and to the order's nomination provenance in the
2026-09-08 critical-path planning pass. That pass's ledger section records its
own clean-room screen and states that the two employer-identifying terms it
found stay in the ignored capture and reach no committed surface; nothing in
this order's diff contradicts that. No intake material was read for this review.

## Limits carried forward

These are limits of the delivered lint, not failures of any criterion, and
VER-001 records each one. The `text.control-character` class covers C0 except
tab, LF and CR, plus DEL, U+2028 and U+2029, so bidi overrides and isolates and
the C1 range including NEL pass — I confirmed both directly — and the order
states no control-character criterion at all, so the rule is an addition beyond
scope whose class belongs to WO-064 or a fresh nomination. The generic public
terms refuse ordinary English such as `Apply the mask layer`, which
WO-063-D001's reopening condition already covers and the editable committed file
already answers. A span widens to a whole source character when that character
NFKC-expands and a match begins inside the expansion; no committed term reaches
this case. Nothing calls the lint yet, which is the order's non-goal observed
correctly. This repository's own branch and PR body would be refused by its own
lint, which is Principle 16 working rather than a defect.

## Reproduction

From `/Users/dylanwood/Projects/DotLn-wo063` on branch `wo-063`:

```text
git diff refs/dotln/checkpoint/WO-063/1 -- docs/work-orders/WO-063-outward-artifact-lint.md
git fetch origin main --tags && git rev-parse HEAD origin/main
git add -A
npm test -- --review
git diff --check --cached
node -e "import('./scripts/lib/meta.mjs').then(async m => console.log(m.renderMetaTable(await m.collectMeta(process.cwd()))))"
node --test scripts/test-outward-lint.mjs
node --test --test-name-pattern 'WO-140 a partial inside-sandbox row' scripts/test-runner.test.mjs
printf '%s\n' 'fix(parser): handle empty input' | node scripts/outward-lint.mjs commit   # exit 2, localTerms unavailable
printf '%s\n' 'chore: update the DotLn launchpad' | node scripts/outward-lint.mjs commit # exit 1, DotLn and launchpad
printf '%s\n' 'fix/../main' | node scripts/outward-lint.mjs branch                       # exit 1, branch.shape
```
