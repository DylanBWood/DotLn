# The room of 2026-11-25, round 4: final signatures on draft 2

Record of the [2026-11-25 planning pass](data-is-the-record-2026-11-25.md). Each seat answered `SIGN` or `BLOCK` after its round-3 blocks were taken. These are the seats' own papers as returned, changed in four ways only: a checkout's absolute path is replaced by its name (`worktree:` marks a path in WO-288's worktree, whose files are not on `main`), each paper's headings are set one level down, and a document's title in quotation marks is set as code where the document check would read it as the operator's words, and the repository's formatter has laid out its Markdown. A model named here is the one the host or the seat reported. What the pass checked itself is said in the pass document.

## Claude Fable 5.2

Seat: Claude Fable 5.2, round 4
BLOCK

wt = `the WO-288 worktree`; other paths are under `the main checkout`. I ran no gate or test.

My four round-3 blocks are resolved in draft 2:
- The recorder programs stay on file (item 1).
- A criterion's being met is defined and the broken-promise ground is gone (item 5, section 4).
- The final review reads only what the verification names as unread (item 7).
- The integration rule binds every role (second paragraph).

I also checked item 2's figure of 154 calls in 23 files against wt `docs/evidence/WO-288/part-d/repair-ver-015-limit-calls.json`, and it holds.

**The one hole the merge opened.** It is in item 5's grounds, the kind I blocked on.
- Draft 1 returned the order when a retained program exited nonzero twice. Draft 2 returns it when one is "still showing its violation", with no second run.
- Three of the four programs race a timer against a deadline (wt `docs/evidence/WO-288/ver-013-witness.mjs`:65, wt `docs/evidence/WO-288/ver-014-health-body.mjs`:32-37, wt `docs/evidence/WO-288/ver-014-concurrent-qualification.mjs`:24-38). One slow arm on a loaded host would return the order at its only verification.
- The chair's own first attack found this and closed it with the second run (`docs/planning/passes/data-is-the-record-2026-11-25.md`:152-153, 167).

**Replacement, for that clause of item 5:**
"one of ver-013-witness.mjs, ver-014-older-receipts.mjs, ver-014-health-body.mjs or ver-014-concurrent-qualification.mjs, each run as its header says with a built checkout of main at 77b5fc11e where it takes one, showing its violation on two runs;"

With it I sign.

**A note that is not a block.** Item 6 stops the order when "the handoff's run still fails after one scoped correction and a retry".
- The repair it continues already holds two failed complete runs (wt `docs/evidence/WO-288/standing.md`:9-11), so the executor cannot tell whether the count starts now. Inserting "counted from this direction" settles that and contradicts nobody.
- I would not have chosen two runs. The repair before this one passed on its third complete run (WO-288-D321, D322 and D324 in wt `docs/evidence/WO-288/decisions.md`). If the figure stands, put that fact beside it for him.

**The line I want on the first page, once the replacement is in:**
"In September this line closed 108 orders at a median of 2.9 hours, and every month since has added rules and hours; judge each proposal here, the room's included, by what it removes."

## Claude Opus 5.5

Seat: Claude Opus 5.5, round 4
SIGN

Draft 2 resolves all six of my round-3 blocks. I checked each against the two checkouts.

- **B1. The retained recorder programs and which cases go** (section 9, item 1). The programs stay on file, no role runs them, and their exit status returns nothing, so the links from VER-013 to VER-015 and FINAL-001 still resolve. The cases that go are bounded: those asserting that a return `main` refuses is recorded. The split-batch assertions and `main`'s parser cases stay.
- **B2. The day's-figure order at integration** (section 2 and section 9, second paragraph). I checked WO-297's criteria against the worktree's emitted roots and its facts line.
  - Both executor roots in the worktree hold "A day's figure" and the phrase "finish the step in hand, write `docs/evidence/WO-NNN/standing.md` and end the turn".
  - No worktree root holds "say the day's figure is reached".
  - `renderDailyUse` in the worktree ends with the sentence WO-297 names.

  WO-297's cases therefore hold under the worktree's text. The integration paragraph applies to every role.
- **B3. A check that did not run** (section 4 and item 5). It neither passes nor returns. It goes through the host's permission flow, or becomes one stated block that only the operator can clear.
- **B4. What closes each finding, and what the final review reads** (item 7).
  - F1 closes by the withdrawal of criterion 14's last clause.
  - F2 closes by the public recorder's behavior on the control and on the damaged assignments.
  - F3 closes by item 2.
  - The verification names only interactions of the repair as unread, so the final review cannot turn into a sweep.
- **B5. Criteria 31 and 32** (section 9, third paragraph; item 4; section 8). The text of rules 2 to 6 and 9 stays as criterion 31 judges it. Criteria 4, 31 and 32 are judged against checkpoint 131. The critic cadence stays elected, and un-electing it waits for the merge.
- **B6. The figures** (section 1). I recomputed them from `docs/control/orders/`:
  - 108, 71, 20 and 6 orders; medians of 2.9, 8.3, 10.9 and 15.0 h; 80, 30, 3 and 0 orders under six hours.
  - Median time to implementation-ready from 1.1 to 5.6 h.
  - September: 24 days with a pass, 21 of them with two or more, and 3 on which every pass took under six hours.

**Other checks.**
- The case item 2 names exists: `scripts/test-runner.test.mjs:21522` in the worktree. The draft quotes the start of its title, and the start is enough for `--test-name-pattern`.
- The Codex continuation case's 1 ms limit carries its mark and its other limit is read from its key (`scripts/test-codex-continuation.mjs:236–239`).

**Disagreements I accept.**
- The chair kept the `memory.gateShare` raise as the owner's decision. The standing instruction against editing the budgets file for one order supports that.
- P4's wording for a failing case (reproduced under the recorded load) contains mine.

**Residual ambiguities, not holes.**
- Item 7 asks the verifier to give the recorder "each of the damaged assignments", while item 1 says no role runs the programs that hold them. A verifier can take the inputs from `ver-015-recorder.mjs`'s source and VER-015's F2 without running the program. Either way, nothing returns the order.
- Item 8's "the executor records the failed handoff" is a decision plus the standing file, because `repair-complete` needs passing evidence. That is a stop, not a return.

**One line for the operator's first page, under my seat:**

To your question: every change re-runs every test; what stops is re-reading code a change cannot reach, and each order now says before work starts what can send it back.

## GPT-6.2 Astra

BLOCK

Section 9 item 2 permits a planted limit that the defective inventory already detected. VER-015 found that renaming `gitRootMs` to `gitRootTimeoutMs` made the inventory report both supplying lines. That would satisfy the planted-control clause while leaving the destructured Codex deadline unchecked. D332 records the control that exercised that path. VER-015 inventory (`worktree:docs/evidence/WO-288/ver-015-inventory.md:20`) · D332 (`worktree:docs/evidence/WO-288/decisions.md:12950`)

I would sign with this replacement for the planted-control condition in item 2.

*When D332’s control supplies the ordinary Codex deadline as the unregistered literal `60_000` through the destructured `controlLimits` array binding, the full D3 inventory must fail and identify the line that supplies that literal.*

## GPT-6.2 Sol

BLOCK

Section 9.8 still leaves two gaps in P1’s stop and delivery rules. `repair-complete` removes the standing file before verification, so a judge who returns the order needs to write a fresh one. Repair transition (`worktree:scripts/resume.mjs:2398`)

If WO-297’s console task hits the document-gate memory limit twice and WO-288 is then held, §2 puts the standalone console fix first. The direction in §9.8 puts the publication port first in that same case. Recorded console stops (`docs/planning/passes/the-kit-keeps-working-2026-11-23.md:1026`)

Replace §9.8 with the following.

> Give WO-288 one verification and, on a pass, one final review. If either returns the order or item 6 stops qualification, end the attempt. The judge files the report and records the verdict, or the executor records the failed or incomplete handoff. The role ending the attempt writes a fresh standing file with the result and what would reopen the order. Preserve the worktree and checkpoints. At the next planning pass, record the hold under Not now. Make the publication port next unless WO-297’s release was held after the console task hit its memory limit in two document-gate runs. In that case, file and schedule the standalone console fix ahead of the port. Retire the port only when release close confirms its fixes shipped.
