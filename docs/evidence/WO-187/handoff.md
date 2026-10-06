# WO-187 executor handoff

**Harness:** claude-code
**Harness version:** 2.1.291
**Model:** claude-fable-5-1
**Effort:** xhigh
**Source:** claude-session-readback
**Work order:** WO-187
**Dispatch:** resume: fix (VER-004)
**Repair baseline:** refs/dotln/checkpoint/WO-187/17

**Criterion 1:** met. The verifier roots are unchanged by this repair and carry the one duty sentence, the product 07 read directive and the completed gate sentence. Product 07 §Verification review and attack keeps the three duties, the variation axes, the review questions, the three routes, the re-verification rule and the six-lens catalog; its reader rules are replaced by the three formats. The executor roots carry the self-review sentence, reworded to name a handoff.md line with no byte change. After the last regeneration the bounded `npm run harness -- check` passed all 33 generated surfaces.
**Criterion 2:** met. The lifecycle fixture passes at the worktree and prints the order's carry-in sections and the receipt's known issue; against the 08845c71 resume source it fails at "verify must print the order's known issues" (`repair-004/fixture.json`). VER-004's wrapped `**Cost:**` line and the carry-in after it now print (`repair-004/reproductions.json`). All 15 real carry-in sections print whole with bodies identical to the pre-repair reader's (`repair-004/corpus.json`). Each section's header names the line that ended it.
**Criterion 3:** met. The fixture records `implementation-ready` with exactly one advisory naming the line when the handoff lacks it, and with none when the line is present. The line has one form, pinned by a table of thirty-five handoff texts. This handoff carries the line below.
**Criterion 4:** met. `final-review-result` reads only the report's findings block. The fixture records the three class counts and `unclassed` in the event, names blocking findings F4 and F5 in one advisory for a missing and an unknown class, and records every result, from the docs directory and from the root. A block that cannot give a complete count records none, with one advisory naming the cause; each of VER-004's eight finding-shaped prose lines now reads unmeasured instead of a lower measured count. `plan failures` prints escapes and unclassed findings per order and `plan start` prints the last-ten figure over the synthetic log.
**Criterion 5:** met. Product 07 holds the lens catalog in the section the verifier's text cites by name, §Model-specific notes still names `.claude/agents/dotln-worker.md` as the source of a spawned Claude worker's effort, and the PLAYBOOK still says the verifier is fed the order's known issues; none of these is changed by this repair. Harness check covers the worker definition, and the passing review gate holds the cases that fail on a hand-edited model or effort. `worker-pin-probe.json` keeps the low-root launch row and its record that the host reported no worker effort; this repair's adversary was launched by the same type and again reported no effort.
**Criterion 6:** met. Measured before and after regeneration (`repair-004/cold-start.json`, D046): the reviewer root is 27,882 bytes against 28,884, up 241; the executor root is unchanged at 29,777, 531 over its unchanged ceiling on FUP-8ce4b4b0104ba41b; the other four roots are unchanged; both skill trees are equal. `docs/control/budgets.json` has no diff and no acceptance was added. Product 07 is 174,675 bytes, down 822, and 7,768 over its unchanged ceiling on FUP-0a7c93eed06727ce.
**Criterion 7:** met. D044 records the repair's rules and choices, D045 the self-review dispositions and D046 the outcome with the two changed role sentences and the finding each answers; D006 keeps the original mapping. `npm run meta` regenerated the decisions index through D046. `close-register.md` keeps the two retargets owed at close and adds the prepared dispositions for the rows this repair settles or narrows.
**Criterion 8:** met. `npm test -- --review` passed 38 suites with 0 failed and 88 fresh tasks in 1,607.53 s at code identity b8245313e92bd0493329f4e38506337ffd28e292b13dfc0cc42ea3e6c3ca34fe (`repair-004/review-gate.json`). `npm run test:docs` passed 29 suites with 0 failed and 29 fresh tasks in 77.65 s at the same code identity, after a first run that failed on one README link to a record not yet written (`repair-004/document-gate.json`); completion runs it again inline over the final documents. `git diff --check` and `git diff --cached --check` are clean. No dependency was added.

self-review: found 12; fixed 9; recorded 3

One fresh `dotln-worker` read only the order and the diffs; its twelve findings
and the root's judgment of each are in
[repair-004/self-review.md](repair-004/self-review.md). Nine are fixed, each
with a fixture row that fails without the fix
([mutations.json](repair-004/mutations.json)). Three are recorded in D045: the
strict block validation D039 F1(a) sets is kept and boarded on
FUP-67a07b670440cf5a, one unverified concern is dismissed on the source, and
two reader edges are judged limits. Session use: one worker, zero descendants,
cap 20; the harness counter reports 1 observed admission, 19 remaining and an unknown uncounted remainder. The worker reported its model as claude-opus-5-5 and no
effort readback; its effective effort and the dollar cost are unknown.

The readers now hold three exact formats (D044). One boundary is stated and
pinned rather than closed: structure counts only at the start of a line, so a
field label at the start of a line inside an indented fence, after a blank
line, ends a carry-in section. The header names the line that ended every
section, and [fence-rules.json](repair-004/fence-rules.json) shows why the two
other fence rules are worse. A final-review report filed without the findings
block, every existing one included, reads unmeasured with one advisory;
recorded events are not re-read.

The adjacent queue stays at revision 18 with no queued or running item. Two
fixes reach beyond VER-004's quoted inputs inside files this repair rewrites
(the singular near-label advisory and the fixture's dated synthetic reviews);
they were made in the announced self-review batch and are disclosed in D045.
No scratch repository was added to the worktree; fixture repositories live in
granted session scratch.

The contributor role text changed (the reviewer's findings sentence and one
executor phrase), so authority evidence is re-minted as WO-187 revision 002
and `docs/evidence/current.json` selects it; revision 001 is intact and the
other three editions verify unchanged. WO-187's own role oracle holds the
eight new reviewer and executor hashes. The classified local release stays
v0.67.1 with compiler 0.25.3 and skeleton 0.52.4 as already prepared; the
release surfaces check passes. No branch commit or publication was performed.

D002 remains the order's sole economy experiment, kept-current; no second one
was started. Entry usage was 108,451 cumulative tokens, source
claude-transcript-message-usage, dispatch scope, cutoff
2026-10-06T05:25:10.628Z. Handoff usage was 40,807,566 cumulative tokens (40,073,055 cached input, 250,603 output) after 143 steps and 115 commands at 2026-10-06T06:46:51.287Z, from the same source and scope. Final counters stay in
ignored receipts and the response. The review gate took 1,607.5 s against
901.6 s for the previous repair's; 756.2 s of it was the build task waiting on
host lanes another worktree held (D043's boarded observation), so no slowdown
of the suites is inferred.

Independent verification must judge this repair; VER-004 remains the immutable
failed judgment of its earlier subject.
