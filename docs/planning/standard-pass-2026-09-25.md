# Standard planning pass, 2026-09-25 (second): the operator's four items

Document-only planning pass on branch
`planning/2026-09-25-standard-pass-four-items` from clean `main` at
`64f9326f` (WO-160 merged and released as v0.51.0). Between work orders;
the projection lists WO-158 to WO-161 closed. Every claim below names its
source; a value nobody observed is written as unknown.

## 1. What was asked, and the subject

The operator's dispatch (captured verbatim in ignored intake,
`docs/intake/notes/2026-09-25-standard-pass-four-items-planning.md`,
SHA-256 `0bf01a6570392d4255674d9a8c1da18b0ed70eb380df6457ec4ccfca67b50ae7`)
asked for a standard planning pass and to look into four items: a Claude
session's own admission that it watched the machinery log with
`tail -f | grep`, which never exits; "codex writer reservation issues";
release retiming phrases everywhere in the documents, which make the
operator disinclined to run parallel work orders; and the product
documents becoming "a cancer (all adds, ballooning in size, AI slop)".
Three mid-turn messages: whether planning passes are aware of Naive
Interventionism (yes: product 07 §Operator-opened planning pass,
precondition 3, and §Goal-aligned decisions; §9 below is the record); the
Codex writer issues are recent, the session finds mid-phase that no writer
was requested and requests it then; and it is not clear whether it happens
every time.

Subject: the sequence as left by the 2026-09-25 off-ramps pass (receipt
028); the register at revision `de330576…` with 159 pending rows, 36 of
them untriaged; the harness sources; the three Codex reports that met the
writer gap; the product documents' Git history since 2026-09-01.

## 2. Item 1 — the monitor that never exits (observed)

- No rule in the role skills, product 07 or the harness manifest says how
  to wait for a long-running gate; the executor text names
  `harness read-output` for reading output and `evidence --stop` for
  ending a gate, nothing for waiting on one.
- The gate already publishes what a wait needs: `beginGateRun` writes a
  `gate-run-v1` marker per run, `activeGateRuns` lists the live ones with
  owner liveness, and `checks.json` records each run's row
  (`packages/skeleton/src/gate-evidence.mjs`; `scripts/harness.mjs`
  `evidence --stop` polls exactly this).
- The Claude harness offers a background run that re-invokes the agent on
  exit; the session used a foreground follower instead. Codex has no
  equivalent; a blocking command is the right shape there.

Decision: `node scripts/harness.mjs evidence --wait [--timeout]`, returning
when no live run remains and printing the recorded row, plus one role
sentence (a live gate is awaited with a command that exits, never an
open-ended follower). Filed in WO-166 (§7). NoOp weighed in §9.

## 3. Item 2 — the Codex writer gap (observed; frequency unknown)

What the sources show:

- Reservation happens on one path: the Claude PreToolUse hook's
  `writerIsolationFacts` → `reserveHarnessWriter`
  (`packages/skeleton/src/harness-host.ts`). The Codex lifecycle dispatch
  entry, `beginHarnessSessionOnce` (called by `scripts/resume.mjs` for
  `next`, `fix`, `verify`, `final-review` and `release-close` under
  `CODEX_THREAD_ID`), begins the session and reserves nothing.
- Release exists on the Codex path for two of five completions:
  `implementation-ready` and `repair-complete` call
  `executorWriterRelease` (WO-139 D005, 2026-09-18). `verification-result`,
  `final-review-result` and `release-close` do not.
- The role text every Codex session reads says DotLn "reserves one writer
  per worktree on any branch, including main" (the five refusals, emitted
  once by WO-155) and that completion "automatically release[s] the
  current Codex session's writer reservation … Never leave the writer
  reserved at handoff" (`.agents/skills/dotln-executor/SKILL.md` line 45).
  The Codex briefing (`scripts/lib/harness-runtime.mjs`) says nothing about
  the writer. There is no reserve command: `harness writer` takes `--show`
  and `--release` only.

What the record shows (three cases, all after WO-155's floor landed):

| Session | What happened | Source |
| --- | --- | --- |
| WO-156 repair (Codex, 2026-09-24) | "Codex dispatch created the harness session but did not reserve a writer automatically … The root explicitly ran the existing writer guard … This is a manual guard invocation"; liveness unknown | `docs/evidence/WO-156/repair.md` §Writer observation |
| WO-161 implementation (Codex, 2026-09-25) | "Codex dispatch established the session but did not automatically reserve the writer. The explicit generated pre-tool adapter subsequently reserved this same session at 16:52:41.909Z. Its shell-ancestor liveness became unavailable" | `docs/evidence/WO-161/implementation.md` |
| WO-161 repair (Codex, 2026-09-25) | "`writer --show` reported `reserved:false` before the repair dispatch and at this handoff, so this Codex session has no observed writer reservation" | `docs/evidence/WO-161/repair.md` |

The operator's reading is confirmed by the record: the gap is met
mid-phase, and the sessions that reserved did so by invoking the Claude
hook adapter by hand with a built payload — an improvised route, and the
one that produces the `liveness: unavailable` holder WO-050 VER-001
recorded leaking. It is recent in the sense that matters: WO-155 put the
five-refusals paragraph, which names the reservation, into every role text
on 2026-09-2x, and WO-139 made completion release on 2026-09-18; a session
reading "reserves … releases" and seeing `reserved:false` does something
about it. Whether it happens every time is unknown and cannot be found out
from `main`: the harness journals live in
`docs/control/local/harness/` of the worktree that ran the session and
are discarded at its teardown; the 121 journals in the main checkout are
planner sessions. Every recent order used Codex one to five times
(`docs/control/orders/WO-153.jsonl` to `WO-161.jsonl`: 27 Codex
attestations against 36 Claude), so the exposure is every Codex
verification and every Codex execution.

The product 07 candidate "stale writer reservation self-diagnosis" said to
reopen on a second observed occurrence of the *leak*; what recurred is the
opposite failure with the same root (no automatic reservation under
Codex) and the same improvised remedy. Its unchecked part, the holder's
age on every refusal, is still unchecked.

Decision: the dispatch reserves, every Codex completion releases, a
refusal names the age and the release command; the role text says a
hand-built hook payload is never the route. WO-166 (§7). The candidate is
edited in place in product 07 (no dated paragraph). Alternatives and the
NoOp are in §9. The detached-episode supervisor fix (WO-159 D010) is kept
out because `cli-actor.ts` is a feedback source and would make the order
pay a live episode.

## 4. Item 3 — retiming phrases (observed)

- 1,056 lines under `docs/` mention retiming. On surfaces a reader meets
  first: the roadmap (35 lines, of which 20 are `**WO-NNN collision
  retiming (date):**` paragraphs machine-written by
  `scripts/lib/release-preparation.mjs` line 120, plus the activation
  completion and component integration paragraphs and two forward-retiming
  subsections: §Release boundary is lines 21–566, 545 lines); product 07
  (7 lines in §Independent workflows and integration); CLAUDE.md (one
  hand-written sentence: "Final review integrates main and retimes under
  the existing classification"); the sequence's intro. The rest are
  immutable reports, decisions and the generated register and index.
- Every pair since the 2026-09-16 two-lane decision has collided: WO-158
  v0.48.0→v0.49.0, WO-160 v0.50.0→v0.51.0, WO-111, WO-156, WO-100, WO-147,
  WO-069, WO-099, WO-110, WO-146 (the roadmap's notes). The 2026-09-17
  amendment made the second lane by preference an order with no retime; it
  did not change that both orders claim the next version at activation
  (product 07 §Discipline, "release assignment is opt-out"), which is the
  collision's cause.
- The 2026-09-19 pass measured WO-086 and found "no recurring hand cost"
  because the note is machine-written, and held it until WO-079 landed.
  WO-079 landed on 2026-09-20. The cost is the reader's, and the operator
  is the reader: the notes are the visible price of a second lane.

Decision: WO-086 rewritten and reopened — the roadmap's release history is
generated from tags between checked markers; the 545 lines move verbatim
to one planning receipt; `release prepare` records a collision as the
integration decision the integrate helper already drafts and writes no
roadmap or README prose. CLAUDE.md's sentence and product 07's sentence
lose the word (CLAUDE.md edited in this pass; the 07 sentence is WO-086's,
named so WO-167 leaves it alone). Version assignment at publication, which
removes the collision itself, is recorded as map candidate 1 with its
reopening observation; the smaller probe goes first (§9).

## 5. Item 4 — the product documents (measured)

| Measure | Value | Source |
| --- | --- | --- |
| `docs/product/` bytes, 2026-09-01 → HEAD | 296,483 → 1,048,121 (3.5×) | `git ls-tree -r -l` at `e696de63` and `64f9326f` |
| Commits touching `docs/product/` since 2026-09-01 | 164 | `git log` |
| Lines added / deleted in that span | 13,033 / 2,827 | `git log --numstat` |
| Largest documents | 07: 181,458 B (2,531 lines); 03: 171,984; 06: 148,793; 02: 147,558; 05: 133,283 | `wc` |
| Dated bold paragraphs under product headings | 183 (06: 107; 07: 32; 03: 23; 05: 8) | `grep -c -E '^\*\*[^*]*(2026-0[89]-…)'` |
| `Candidate —` headings in product documents | 64 (05: 21; 07: 9; 03: 8; 06: 6) | `grep -c -E '^##+ Candidate'` |
| Product 07 at WO-090's close (2026-09-20) → now | 1,933 → 2,531 lines | `git show f47399a6:…` |
| Size or receipt check in `check-publication` or the document gate | none | `scripts/check-publication.mjs`, `scripts/test-runner.mjs` |

The mechanisms, from the rules themselves: every order's write-back duty
and every pass's "product-doc write-back" append a dated paragraph
(product 07 §Documentation freshness and ownership said not to rewrite
history and nothing about editing in place); candidates are filed as
product-document sections; `release prepare` writes two roadmap
paragraphs per order; and no check bounds any of it. The 2026-09-19 pass
held all five documentation orders (WO-085 to WO-089) with reopening
conditions; two have fired (WO-086: WO-079 landed; WO-085 and WO-089: "a
planning pass rewrites" them — this one does, for WO-085). WO-090's
consolidation of the guide shows what a cut without an inflow check does.

Decisions (details in §7):

- WO-085 rewritten: the inflow check — per-document byte ceilings
  (`docs/control/doc-ceilings.json`), refusal of a new dated receipt
  paragraph or candidate heading under `docs/product/` against a baseline,
  a decision `dispatch` field that carries a control prefix and a
  paraphrase (WO-153 D008), and WO-090 D007's anchor rules; the
  edit-in-place rule written into product 07 by this pass and bound to the
  check by the order. The 2026-09-19 objection (the check would refuse
  `release prepare`'s own note) is answered by exempting that exact shape
  until WO-086 retires it.
- WO-086: the roadmap's 545 lines of notes generated away (§4).
- WO-087 rewritten: the roadmap's 650 lines of candidates move to the
  planning map, not to a sixteenth product document.
- WO-167: the guide's 32 dated amendments folded into their sentences with
  citations and its nine candidates moved; one document per order so the
  verifier reads the whole diff; 03, 02 and 05 follow as map candidate 2.
- This pass's own write-backs edit in place: the stale-writer candidate,
  the freshness rule, product 02's sandbox wording (WO-161 D008) and
  CLAUDE.md. No consumption paragraph is added to §Operator-opened
  planning pass; this document and the ledger are the record.

## 6. The register: 36 untriaged rows and three pending, read and disposed

Read whole by script (product 07 §Candidate — planner startup context
records why; FUP-0111 records this pass's measurement in its disposition
rather than in a new product paragraph). After `npm run meta` synced this
pass's own map candidates (four new rows) and its product 07 edit (one
candidate returned to review), 44 rows were disposed; the composition:

| Class | Rows | Disposition |
| --- | --- | --- |
| In-order repair directives discharged by the order's own repair and passing verification (WO-157 D025, D026, D028; WO-158 D021; WO-160 D012, D014, D016) and one decision in force (WO-114 D010) | 8 | settled, with the closing verdict named |
| Decisions in force with no outstanding action (WO-158 D007, D011, D025) | 3 | settled |
| Adjacent-queue nominations WO-160's close performed (D013, D017, D019, D021; 59 rows retained under `docs/control/local/retained/WO-160/adjacent-work.jsonl`) | 4 | settled; reopen when the stash-drop seam is next edited |
| Settled by this pass's own edits: the heading placeholder restored (WO-159 D011); product 02's sandbox wording (WO-161 D008) | 2 | settled |
| FUP-16adc40db1da7959 (pasted dispatch): a second observation, this pass's typed prefix with a pasted block resolved normally | 1 | settled; reopen when a pasted-only message dispatches a role or fails to |
| FUP-0083 at revision 8 (the WO-160 and WO-161 write-backs to product 03, commits `45781106` and `b4339617`) | 1 | re-settled; same reopening condition |
| Nominations naming an order this pass files or rewrites: the stale-writer candidate re-read after its in-place edit, WO-158 D012 and D029 (item a), WO-161 D007 → WO-166; WO-153 D008 → WO-085 | 5 | allocated |
| Nominations naming a queued order, before WO-066's first target publication (WO-157 D005, D038; WO-159 D009) | 3 | allocated as catalog carry-ins on WO-066 |
| Everything else with a seam to wait for (WO-157 D024, D040; WO-155 D006; WO-114 D013; WO-159 D010, D020; WO-154 D003; WO-158 D005, D006, D008, D028; the absence-curve candidate) | 12 | deferred, each with its source's reopening observation |
| This pass's map candidates 1 to 3 | 3 | deferred with the map's reopening observations |
| This pass's map candidate 4 (receipts embed the subject) | 1 | duplicate of the WO-154 D003 row |
| FUP-0111 (planner startup context) | 1 | open; this pass's measurement recorded in the disposition |

Totals: 19 settled, 8 allocated, 15 deferred, 1 duplicate, 1 open; the
register's revision after the last disposition is recorded in the
planning check. Rows this pass's edits invalidate are re-recorded at their
new revisions with the same status.

## 7. The orders

| Order | What it lands | Class | Re-mint |
| --- | --- | --- | --- |
| WO-166 Session boundaries (new) | Codex dispatch reserves for all five roles; every Codex completion releases; refusal names age and command; open-override advisory at session start; `evidence --wait`; two role sentences; carried-edition test fix | patch | deterministic (harness-host, gate-evidence, contributor loadout); no live episode |
| WO-085 Product documents stop accreting (rewritten) | `scripts/docs-check.mjs` in the document gate; ceilings file; baselines; dispatch-prefix rule; WO-090 anchor rules; the bound rule in 07 and 08 | patch | none |
| WO-086 Generated release history (rewritten) | `release list --markdown` between markers; notes preserved verbatim; `release prepare` writes the integration decision only | patch | none |
| WO-167 The execution guide folded (new) | 32 amendments folded with citations; nine candidates to the map; anchors preserved; 07's ceiling lowered | patch | none |
| WO-087 Candidates leave the roadmap (rewritten) | 650 lines to the map under their slugs; register reconciled; 06's ceiling lowered | patch | none |

Each carries a `Cost:` line naming additions and removals, a dated
observed gap at `64f9326f`, acceptance criteria that name both gates,
non-goals and operator-review assumptions. WO-088 (gap not reproduced)
and WO-089 (a fold that is a planning act) keep their 2026-09-19 holds.

## 8. The sequence

Four closed entries leave (WO-158 to WO-161); 47 queued entries remain.

| Slot | Pair | Why here |
| --- | --- | --- |
| head (unchanged) | WO-070; WO-115 | the critical path has waited since 2026-09-16; the operator may move the second pair above it (§12) |
| second | WO-166; WO-085 | the operator's items 1, 2 and 4 at their inflow; disjoint files (harness runtime and loadout vs a docs check and product sentences); only WO-166 re-mints |
| third (unchanged) | WO-164; WO-165 | REVIEW-003's remaining findings |
| fourth (unchanged) | WO-162; WO-163 | maintenance after delivery |
| fifth | WO-086; WO-167 | items 3 and 4's mass reductions once the check holds them; WO-086 after WO-164 (`release.mjs`); WO-167 after WO-085; one named 07 sentence is WO-086's |
| sixth (one entry) | WO-087 | after WO-086 (both edit 06); may run beside WO-167 |

No blocking edge inside a pair; `plan check` verifies the typed edges
(WO-086→WO-164, WO-167→WO-085, WO-087→WO-086 as `hard`).

## 9. Declined alternatives — the NoOp register of this pass

Each is a `NoOpIntent`: what happens if nothing changes, why the choice
wins, what reopens it. The system traps are named where they bite.

- **Item 1, do nothing.** The session corrected itself; a rule is cheap
  but unenforced; the wasted monitor cost a background slot and the
  operator's attention. Action wins because the marker already exists and
  a command that exits is what both harnesses can use. Reopen: never for
  the command; the role sentence reopens if a session still uses a
  follower after WO-166 (rule beating).
- **Item 1, role text only, no command.** Declined: every session would
  compose its own wait against the marker directory; the command is the
  interface (platform lens). Reopen: none.
- **Item 2, do nothing (advisory under Codex by design).** Each Codex
  session spends diagnosis turns and either improvises a hook payload,
  producing the `liveness: unavailable` holder that leaked in WO-050, or
  hands off without the invariant. Naive Interventionism: the existing
  function kept is the one-writer invariant; the consumers are the five
  Codex roles and the `waive` refusal (WO-158 D029 item a benefits); the
  second-order risk is a stuck reservation when a Codex session dies,
  bounded by WO-139's completion release and the operator's
  `writer --release`; reversible (one call site). Reopen: a Codex-owned
  reservation outlives its session twice after WO-166 (then the lease
  question product 02 declined returns).
- **Item 2, a `writer --reserve` command.** Declined: WO-139 D005 rejected
  a manual step, and it is what the sessions improvised. Reopen: none.
- **Item 2, drop the writer under Codex.** Declined: two lanes rely on the
  invariant; Codex sessions are 27 of the last 63 attestations. Reopen:
  the operator stops running Codex sessions in worktrees.
- **Item 2, the detached-episode supervisor fix inside WO-166.** Declined:
  `cli-actor.ts` is a feedback source; the order would pay a live
  episode. Deferred to the next order that edits it. Reopen: an orphaned
  episode is observed.
- **Item 3, do nothing.** 545 roadmap lines and two paragraphs per order
  keep accruing; the operator keeps reading the price of a second lane.
  Action wins: the reader's cost is the operator's flow (seeking the
  right goal). Reopen: none.
- **Item 3, version assigned at publication.** The structural fix; it
  removes the collision, not only its prose. Declined for this pass as the
  larger change (activation event, heading rule, `check-surfaces`, every
  role text; escalation risk in a seam every order crosses). Map candidate
  1. Reopen: after WO-086, a collision still needs a hand step or produces
  a review finding, or the operator asks.
- **Item 3, strip the word from product 07's integration section now.**
  Declined: the mechanism sentences stay true; WO-086 changes the one
  that names roadmap prose. CLAUDE.md's hand-written line is edited now.
  Reopen: none.
- **Item 4, do nothing.** 3.5× in 24 days at a rising rate; the guide
  regrew a third of WO-090's cut in five days (drift to low performance:
  the baseline worsens and nothing measures it). Reopen: none.
- **Item 4, one big consolidation order.** Declined: a fold is a rewrite
  the verifier must read whole against the whole document; one document
  per order (WO-167 first, the guide every role reads). Reopen: WO-167's
  verifier finds the method safe enough to batch.
- **Item 4, a repository-wide byte budget.** Declined: a reader pays per
  document. Reopen: none.
- **Item 4, a prose-quality check.** Declined: no rule a gate can judge;
  the ceiling is the proxy the operator can read (rule beating: a ceiling
  can be gamed by moving text out of `docs/product/` — the check's
  message names the two legitimate destinations, and a move into
  `docs/planning/` is visible in the diff). Reopen: a document meets its
  ceiling by relocation without consolidation.
- **Item 4, move the second pair to the head.** The 2026-09-25 morning
  pass declined putting maintenance above the delivery pair, and the
  reason holds; the operator's pain is stated and the operator can move it
  (§12). Reopen: the operator says so.
- **Deleting anything.** Every removal in these orders preserves bytes in
  a receipt or the map. Reopen: never.

## 10. Goal alignment

Mission and critical path: none of the five orders is on the
source-to-deliverable critical path; each removes a recurring cost the
operator or a role pays on every order (a Codex session's diagnosis
turns, a wait, a reader's 545 lines, a cold-start read), which is the
Contributor's stated purpose — moving recurring supervision and recovery
into machinery. The delivery pair keeps the head.

Traps: policy resistance — WO-085's ceiling and the freshness duty pull
the same way once the rule says edit in place; commons — the ceilings
account for the reader's total; drift — the ceiling is the explicit
standard the documents lacked; escalation — a check that refuses
legitimate edits provokes workarounds, so its message names the remedy
and a planning decision can raise a ceiling; success to the successful —
version-at-publication is recorded rather than excluded; shifting the
burden — WO-166 removes the operator's `writer --release` rescue from the
Codex path; rule beating — named above; wrong goal — the operator's four
items are the goal, stated in the operator's words.

Platform lens: `evidence --wait`, the reservation at dispatch and the
docs check arrive as commands with typed output; the generated release
table is content-addressed to tags; this repository consumes all of them
before any export.

## 11. Evidence and cost of this pass

- Research: none delegated; the planner read the sources directly. Zero
  of twenty subagent admissions used before the refuter; the refuter is
  the first.
- Session usage at the last hook readback before drafting: 81,427 total
  tokens (64,148 cached input) at 20:50 UTC, source
  claude-transcript-message-usage, scope dispatch; the handoff figure is
  in the response.
- Documents: two orders and three rewrites; four heading placeholders;
  the sequence; the map (five catalog rows, one carry-in row, one
  section); the ledger section; product 07 (two in-place edits), product
  02 (one), CLAUDE.md (one); this document; the register dispositions; the
  generated index and cost table.

## 12. Reversal conditions for this plan

- A Codex-owned reservation outlives its session twice after WO-166.
- After WO-086 a collision still needs a hand step or produces a review
  finding (then map candidate 1).
- The docs check refuses an edit the operator judges legitimate more than
  once a week (then the ceiling policy, not the check, is wrong).
- A document meets its ceiling by relocation without consolidation.
- The operator moves the second pair above WO-070 and WO-115, or the
  delivery pair above everything.
- WO-167's verifier finds a folded rule changed meaning (then the fold
  method is the finding).

## 13. Independent review

The refutation receipt for this pass is filed under
`docs/planning/refutations/` by `npm run plan -- refute` and the receipt
helper; its judgment, holds and dispositions are recorded there and in
the control log, not restated here.
