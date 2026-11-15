# WO-277 — FINAL-001

**Verdict:** pass. All four criteria are met on the tree the verifier judged.
Four findings are routed to follow-ups; none fails a criterion or breaks a
behavior `main` had. Whether each paragraph of the page serves a person is
the operator's reading, which criterion 2 assigns to the operator; it is
taken at the pull request and is not claimed here.

## Subject and method

Final review of
[WO-277](../../work-orders/WO-277-the-starters-commands-page-tells-a-person-every-step.md),
requested on 2026-11-15. The subject is the uncommitted `wo-277` change over
`b8591a7307703d2cd454e51ac0c0557dc10d48d0`, as
[VER-002](../../verifications/WO-277/VER-002.md) passed it. `npm run worktree
-- integrate WO-277` fetched `origin`'s `main` and took in nothing: `main` is
still the merge base. The integrated code identity is therefore the verified
one, `274d9bc7d57447f31227fc7a69cd769fb91065e4124205e4eb4bc2b389a4275e`.

I read the order and the sections of the guide it cites, the generator, the
page whole, the 2026-11-07 and 2026-11-14 passes' sections of the operator's
commands, the full diff, the executor's handoff and decisions D001 to D024,
[VER-001](../../verifications/WO-277/VER-001.md) and VER-002, the publication
contract and the latest planning receipt's judgment of this order. I did not
read the nine review reports in the ignored reviews lane. Their findings and
dispositions are in D007, D009, D017 and the handoff, and each claim this
verdict rests on was reproduced here instead.

Four probes ran the kit's code, each one process under the bounded wrapper
and outside any gate: the generator's own check; the verifier's export probe
on a fresh export, its output in session scratch; a reading of the gate
ledger through the canonical claim reader; and a new probe of two update
histories. The printed page was compared with the committed page by `cmp` in
the plain shell, where the timing readings of F4 and a few counting scripts
also ran. The document gate ran twice: a trial at 18:52 UTC, which passed
with 29 tasks, and the run after this report's last edit, whose row the
result consumes; the branch terms screen preceded each. No complete run was
started. The lenses were correctness, operator flow and private data.

## Criteria

**Criterion 1:** met. `node scripts/lib/operator-commands.mjs --check` prints
`docs/OPERATOR.md is current` and exits 0 (17:48:33 UTC). In
[the page](../../OPERATOR.md), step 1 holds the clone recipe's block (lines 13
to 24) and then a block of `mkdir -p docs/control/local`, `cp
scripts/kit/terms.example.txt docs/control/local/terms.txt` and `npm run terms
-- check CLAUDE.md README.md` (lines 26 to 30), before the first planning
pass's step (line 32).

**Criterion 2:** met. `node scripts/launchpad.mjs commands` prints the
committed page byte for byte in this checkout and in a fresh export (8,973
bytes, SHA-256
`874635cc92db6456869a883d2117cd64781499d881a281002a7ca54f3f3c702c`). Each of
its seven steps opens with a paragraph before its blocks, the first planning
pass's paragraph names `WO-001`, and the release step's names `git checkout
main -- .claude/harness-manifest.json`
([export results](../../evidence/WO-277/final-001/export-results.json)). The
criterion's last sentence assigns to the operator the reading of whether each
paragraph serves a person. That reading is not claimed.
[D025](../../evidence/WO-277/decisions.md#wo-277-d025--final-review-the-four-criteria-stand-on-the-tree-the-verifier-judged-the-page-is-not-edited-here-and-the-operators-reading-is-taken-at-the-pull-request)
records the reviewer's own reading for the operator to weigh, and the safe
default: the pull request, which the operator merges by hand, is where the
operator reads the page.

**Criterion 3:** met. In a fresh export built here by
`scripts/lib/launchpad-fixture.mjs`, the launchpad suite's own fixture, the
exported `README.md`'s first paragraph links `docs/OPERATOR.md`, the exported
guide's first paragraph links `OPERATOR.md`, and the commands printed in the
export hold the terms list's block in step 1, after the clone recipe. The
export's guide and page hash to its manifest's rows. The suite's own cases
hold the exported front page to the seed, the exported guide to the manifest
and the export's printed page to the checkout's; they ran on these bytes in
the complete run of criterion 4.

**Criterion 4:** met. For `npm test -- --review` and `npm test`, the canonical
claim reader admits the complete review row recorded at
2026-11-15T16:52:24.433Z at the integrated code identity, exit 0, with no
advisory ([gate rows](../../evidence/WO-277/final-001/gate-rows.json)). That
row composes the forced-fresh run that ended 16:35 UTC with one task run
again. In the fresh run every suite that reads the guide or the page ran on
the final page and passed; the target-worktree close file timed out there
under the host's load and passed when run again (D018, D019). The guide's
marked blocks, the page and the seed have not changed since, and this review
changes none of them, so the row stands for them. For `npm run test:docs`,
the document gate runs once after this report's last edit, and this review's
result is recorded only on its passing row for the exact candidate tree.

## Findings

<!-- dotln-findings:start -->
[
  {
    "id": "F1",
    "route": "follow-up",
    "class": "escape",
    "summary": "After an earlier squash-merged update, the release step's checkout keeps that update's bytes of a file only the starter changed, and the publish refuses nothing."
  },
  {
    "id": "F2",
    "route": "follow-up",
    "class": "escape",
    "summary": "The release step names no route for a kit file this instance edited and the starter changed; going on from the emit commits the conflict's markers."
  },
  {
    "id": "F3",
    "route": "follow-up",
    "class": "escape",
    "summary": "The handoff's self-review line is over the reader's bound for its reason, and the advisory says the line is lacking."
  },
  {
    "id": "F4",
    "route": "follow-up",
    "class": "new-scope",
    "summary": "The sync refused the decisions-index and work-order index checks on their 30 s limits while the host was slow; both pass at ordinary speed."
  }
]
<!-- dotln-findings:end -->

F1 to F3 are boarded in
[D026](../../evidence/WO-277/decisions.md#wo-277-d026--the-final-reviews-three-findings-each-a-follow-up-two-update-histories-the-release-step-gives-no-route-for-and-a-handoff-advisory-that-names-the-wrong-cause),
whose register row is `FUP-be21bcb82ee48a3a`. Each is class `escape`: it was
in the verified subject and inside verification's instructed scope. F4 is
boarded in
[D028](../../evidence/WO-277/decisions.md#wo-277-d028--the-sync-refused-two-checks-on-their-time-limits-while-the-host-was-slow-both-pass-at-ordinary-speed-and-the-document-gate-is-run-when-the-host-is),
whose row is `FUP-8cfdf28d91a0d2b7`. It is class `new-scope`: it is the
gate's machinery, outside the order and its subject, met while this review
regenerated its own indexes. None of the four is blocking. None fails a
criterion, and none breaks a behavior `main` had: `main`'s page gave the
release step no recovery at all, the preview already told a person to keep
this instance's bytes for a file both sides changed, and the checks' limits
are `main`'s.

**F1 and F2.** Round 2's design reviewer named both from the guide without
running them, the handoff carried them with no register row, and VER-001 read
the note and did not reproduce it.
[A probe](../../evidence/WO-277/final-001/update-recovery-gaps.mjs) now
reproduces both in synthetic histories
([its result](../../evidence/WO-277/final-001/update-recovery-gaps.json)).
After an earlier update that reached `main` by a squash merge, a file only
the starter ever changed is listed as changed on both sides. The page's `git
checkout main -- <path>` keeps the earlier update's bytes, and the publish's
judgment finds nothing not kept, so the starter's later change is left out in
silence. The page itself asks for a merge commit, so an instance that follows
it does not make this history. For a kit file the instance edited, the merge
stops on it, the page's recovery leaves it unmerged, and the block's `git add
-A` and `git commit` conclude the merge with the conflict's markers in the
file. Neither is fixed here. A change to the page after its reviews is an
acceptance-relevant edit the final reviewer may not make and approve, and it
would owe the page's suites a fresh run. The release's notes state both under
Read before upgrading.

**F3.** The handoff's `self-review:` line is present. Its reason for the
unreviewed lines is 287 characters where the reader admits 200, so the ledger
reader advises that the line is lacking. The handoff is the executor's record
and is not rewritten; the advisory's wording is the follow-up.

**F4.** After this review's records were written, `npm run sync` refused the
decisions-index check and the work-order index check as timed out, each on
the 30 s limit the sync and every gate's structural phase share. The tree
was not the cause. For about a quarter of an hour the host ran a fixed loop
3.4 times slower than it did minutes later, under the operator's own
desktop load; in that time the decisions-index check took 72 s, and at
ordinary speed it takes 15 s. The two generators were run by their own
commands, each check then passed, and the document gate was started only
once the loop read at its ordinary speed. The check uses half of its limit
unloaded and parses every decisions record and every stamped receipt on
each run, so its margin shrinks with each order; that is the follow-up.

## The meta critic

An hour into this review the operator asked for the meta critic on GPT-6
Astra. It is the conduct critic kept under `docs/evidence/WO-276/critic/`,
one read-only Codex worker under a fixed charter. It was launched then, as
launch 2 for this order, and the result was held for its report, so that
what it said could reach these records
([D029](../../evidence/WO-277/decisions.md#wo-277-d029--the-operators-direction-an-hour-into-the-final-review-the-meta-critic-on-gpt-6-astra-launched-then-as-launch-2-on-a-copy-of-the-transcripts-that-holds-no-account-address)).
It read a copy of this worktree's transcripts in which the two account
addresses the host wrote are replaced by a placeholder. No row of the copy
matched the private list in either class, and the read-only sandbox was
refused a write beside it. This was the review's one worker use, of a cap of
20. The launcher reported `gpt-6-astra` at `max`; the run took 17 min.

The report made five criticisms, four of the executor's two sessions and one
of a routing this review had already made. Each was checked against the
transcripts and the control log, and each is accepted
([D030](../../evidence/WO-277/decisions.md#wo-277-d030--the-second-meta-critics-five-points-each-checked-and-accepted-four-are-the-executors-conduct-and-stand-as-recorded-the-missing-messages-rule-is-reopened-with-its-cause-unsettled-and-four-deferred-observations-gain-a-destination)).
None changes a criterion's judgment or a reviewed byte of the product. Two
change the record. The length rule the handoff gives for messages missing
from the host's transcript is contradicted by the repair's own transcript
and by this session's, so D010's follow-up returns to review with the cause
open. And three improvements the executor left to WO-281, with one more
from this review's reading of the page, had no register row and now have
one. The checking also found that this session's transcript lacks the
messages in which the reviewer told the operator, before the launch, of the
worker plan and of the transcript copy; it holds both in a closing message
seven minutes after the launch. The critic's first change, that evidence is
read before each claim and before the completion, is the order of this
review's closing steps: each authored output is read at its final bytes
before the result is recorded.

## The verification sequence and the planning receipt

VER-001 met criteria 1 to 3 and failed criterion 4 on one blocking finding:
the status capture held two home-directory paths, which the document gate
refuses. Reproduced as repaired: lines 13 and 14 of
[the capture](../../evidence/WO-277/status.json) read `<worktree>`, and a
search of this order's evidence, verifications and control segment for a
home-directory path lists no file (D014). Its follow-up finding, a release
step that could not keep a file the instance deleted, was repaired in the
same dispatch with `git rm <path>` (D015); the page's paragraph names it, and
the executor's and the verifier's probes each resolve the modify/delete merge
with the deletion kept. VER-002 reproduced both repairs and passed. Its
handoff of the operator's reading and the release notes to this review is
answered above and below.

The latest planning judgment of this order, receipt 069, lists four known
issues. First, criterion 1 could pass while a person publishes with the
example list unedited. The step 1 paragraph tells the reader to replace the
example's entries, and step 2's route for a refused publish repeats it;
nothing checks it, since the order bars a new check, and D003's and D007's
follow-ups carry the rest. Second, nothing retires the interim route for the
harness manifest: D006's follow-up, `FUP-5621408816545b95`, gives its removal
an owner. Third, the operator's reading cannot speak for a first-time reader:
that stands as a limit, and no such reader was asked. Fourth, the order's
Cost line dates the operator's encounter a day after its observed gap: the
order's text is left as judged, and no record of this review rests on that
date. The order names no ideation breakout, so there is no other receipt.

## Actors

Every completion actor is at or above the order's declared minimum for its
role (executor xhigh, verifier xhigh, reviewer high; any capable model), and
the control projection reports the drift within the order as `xhigh -> max`.

| Completion | Actor | Declared | Met |
| --- | --- | --- | --- |
| `ImplementationReady` | Claude Code 2.1.325, `claude-fable-5-2`, effort `xhigh`, `claude-session-readback` | executor xhigh | yes |
| `RepairCompleted` | Claude Code 2.1.325, `claude-opus-5-5`, effort `max`, `claude-session-readback` | executor xhigh | yes |
| VER-001, `VerificationCompleted` | Codex CLI 0.169.0, `gpt-6-astra`, effort `max`, `codex-session-readback`, account `not-applicable`; the report's header holds the same six values | verifier xhigh | yes |
| VER-002, `VerificationCompleted` | Codex CLI 0.169.0, `gpt-6-astra`, effort `max`, `codex-session-readback`, account `not-applicable`; the report's header holds the same six values | verifier xhigh | yes |
| FINAL-001, intended | Claude Code 2.1.325, `claude-fable-5-2`, effort `max`, `claude-session-readback` | reviewer high | yes |

This review's actor: Claude Code 2.1.325, the version the session's hook
observed; model `claude-fable-5-2`; effort `max`, the session's selected
value read from `CLAUDE_EFFORT`, which is not an effective readback.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.325","model":"claude-fable-5-2","effort":"max","source":"claude-session-readback"}

## Documents, expected data and consumers

The changed standing documents hold their current state and no dated account.
In `docs/KIT.md` the seven marker lines and the first paragraph are
replacements, the sentence on an absent list is replaced by what each publish
does (D003), and the new block stands with the two paragraphs that say how to
use it. The seed front page's first paragraph is a replacement, and
`README.md`'s release line is release preparation's. `docs/OPERATOR.md`, the
decisions index, the work-order index, the follow-up register, the sibling
index and the roadmap's release table are generated and were changed through
their commands; the roadmap's row and the release record are D005's repair of
a case `main` fails.

One expected value changed: the seed front page's pin in
`scripts/test-launchpad-export.mjs`, whose cause and provenance D008 names.
Its consumers were traced here. The export writes `README.md` from the seed
(`scripts/launchpad.mjs`). The starter refresh proves an earlier seed from
the starter's own manifest history (`scripts/lib/starter-seeds.mjs`), not
from a list of hashes, and the old hash appears in no script, so nothing else
holds it. The page's consumers are the sync suite's case for the page and the
launchpad suite's export and seed cases, which ran fresh on the final page.
The page's version, `v1.0.1`, is read from `README.md`'s release line.

## Follow-ups this change touches

`npm run plan -- followups --touching` listed 16 pending rows when this
review read it, before its own three rows were minted (D026's, D028's and
D030's). Twelve were this order's
own and go to the next planning pass. Of the four earlier rows, three only
match a path and are left as they are. The fourth, `FUP-912adb42a652b75f`
(WO-245-D005), was deferred until a guide-only edit would claim a cached
product pass. That occurred in this order's repair (D018), so the row is set
open with the observation
([D027](../../evidence/WO-277/decisions.md#wo-277-d027--of-the-four-earlier-follow-ups-this-change-matches-three-are-left-as-they-are-and-ones-condition-occurred-a-guide-only-edit-claimed-a-cached-product-pass)).
No criterion of this order stands on the reused row.

## Release surfaces

The target is `v1.0.1`, a patch above `v1.0.0`
([D001](../../evidence/WO-277/decisions.md#wo-277-d001)); release preparation
at this review kept it against `origin`'s tags. [PR.md](PR.md) and
[RELEASE-NOTES.md](RELEASE-NOTES.md) stand beside this report. The notes'
Read before upgrading says that the page is the place to start, that an
instance whose front page is its own keeps it, that an instance with no terms
list registers one with its own entries, and what the release step does and
does not answer, as the order's write-back duty and D008 ask.

Proposed title: `:children_crossing: The starter's commands page walks a
person through every step, the private terms list first, so a first planning
pass that follows it no longer fails at its publish`. The body is PR.md.

The branch commits as four changes: the starter's `v1.0.0` refresh receipt in
the sibling register; the roadmap's `v1.0.0` row with the release record; the
page, the guide, the seed and its pin at `v1.0.1`; and the order's records.
With those commits the branch is ready for the operator's review. Nothing is
merged by this review.

## Limits, goal alignment and cost

Nothing was published live, run on a managed machine or read by a first-time
reader. The probes use synthetic Git histories and the suite's export
fixture; the publish's whole judgment of an update was exercised through its
`instanceChangesNotKept` reading, not through a forge. The export fixture,
the bounded wrapper and the gate ledger are the project's own instruments.

The branch terms screen, `node scripts/terms.mjs branch`, listed no line in
either class, so there was none to read: **0 context lines read**.

The outcome matched the request. Three traps were named before the verdict
(D025): a complete row standing for documents its suites never read, the
operator's reading written as done, and a follow-up raised to a blocker or
left as a sentence. The page's hashes were compared with the captures made
after the fresh run and no reviewed byte changed; the reading is stated as
the operator's; and each finding has a register row. Running the complete
review again would have cost about 47 min and added no observation at this
identity; reviewing nothing would have left the page out of the starter.

**Process cost:** entry 169687 tokens; handoff 78966001 tokens; source claude-transcript-message-usage

The counters are dispatch-scoped, read at 17:46:00 UTC and 19:16:21 UTC on
2026-11-15 with `node scripts/harness.mjs usage`. The handoff figure is
cumulative and is mostly cached input (78,070,153 tokens), not unique
context; dollars and reasoning tokens have no counter, and the critic's own
use on the other provider is not in it. At the handoff reading the dispatch
stood at 1 h 31 min of 8 h 0 min, with no complete run. The harness counts
no worker launch, since no hook sees the critic's launcher; by hand it is
one use of 20. Of that time about a quarter of an hour went to finding why
the sync's checks timed out (F4), and about half an hour to the critic: its
checks, its run of 17 min and its answers. Final counters stay in the
ignored receipt and the closing message.
