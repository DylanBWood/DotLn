# Plan refutation — 2026-09-27-planning-e4deffba4add0aff-031

Subject: `sha256:695385b450ec94e111ddd6668ab754ca9dc9ed69b2a2eaa2c7a75cfd51a2109d` at committed revision `3f4c0fe296f600c52402998248404f8520277350`.

Pass: `planning-e4deffba4add0aff` (planning). Verdict: **aligned-with-findings**.

Review source: direct harness session. Harness version, model and effort: unknown; settings verification: unverified. No CLI launch or transport acceptance is claimed.

Judgment frozen: 2026-09-27T01:10:31.712Z. Frozen result hash: `sha256:3e3152997f2db06ae91a1bfa091f1101335a12c518403c5580e5928bb7b029ef`. Local-terms list: **present**.

Judgment basis: canonical subject and plan-goal-review-v1 protocol. Independence is session-attested; context isolation was not enforced and model tools were available. Session statement: I am a fresh plan refuter running as a subagent on the model named Fable 5.1 (claude-fable-5-1), with no prior conversation. I used one file as evidence: the canonical prompt refute-prompt.json in the session scratch directory, 118,149 bytes, whose SHA-256 I confirmed as 1f6f46e23a97065102e1f6e534d4ef5a047cf809e272c7c9f5735e796e2c85cf before reading. Because it is one long line, I read it with read-only node -e commands that parsed it and printed one field or slice at a time: identity, mask, lens, role, workOrder, outputInstructions, workerInstructions and resultSchema in full; subject.standard (five theses, seven exclusions, five roles, the roles table, 42 capability rows); subject.goalReview (platform standard, goal standard, the critical-path table and its two chains, evidence hash, cost evidence status, and all five trap observations, the 6,707-character drift observation in three slices); the four judged orders WO-168, WO-169, WO-086 and WO-167 with title, objective, cost, every criterion and non-goals; scope; all 44 sequence entries; deferrals, which is empty; and the cost table (11 acceptances, 44 rows whose metrics are all null, and five traps that are byte-identical to the five observations). I confirmed that the parsed object re-serializes to the raw file minus its trailing newline, so no part of the line went unread. I listed the scratch directory's file names once and read no other file there. My context also held project instruction text and a Git status snapshot that the harness preloads; I did not seek them and did not use them as evidence. I did not read the repository, planning documents, earlier receipts or Git history, did not search the web, and did not spawn or delegate to any agent. I judged the four orders against the four questions, the eight trap lenses, the supplied vision passages and the five roles. The numbered items that the WO-168 and WO-169 cost lines point to as 'below' are not in the compiled subject, so I treated them as unknown. I found no observed failure, since every trap reports an empty worsening list and reopenCandidate false and most series are null, and no contradiction of a supplied vision passage, so I hold nothing. All four orders and the plan are aligned-with-findings; I recorded 15 known issues, each with a reopening observation. I wrote two files in the scratch directory, refute-result.json and refute-statement.txt, and checked the result against the prompt's closed resultSchema with a read-only script, which reported no errors. After writing I ran one read-only git status to confirm the working tree was unchanged; it printed nothing and I used it as no evidence for the judgment. I made no repository writes and no Git writes, and I did not file or commit a receipt.

This verdict evaluates a planning horizon; it does not verify implementation or confer operator decision authority.

Scope: pass; dispatch-to-file 1822935 ms. Judged 4 orders and the sequence; carried 40 unchanged verdicts by order and receipt hash.

## Validated result

```json
{
  "schemaVersion": "plan-goal-review-v1",
  "orders": [
    {
      "workOrderId": "WO-168",
      "verdict": "aligned-with-findings",
      "criticalPathAndNoOp": "Gate: none. WO-168 is absent from the supplied critical-path table and its compiled text names no blocked outcome. Its seam is the harness every role session runs under, so any effect on a gate is indirect and unstated. It heads a sequence whose first eight entries (WO-168, WO-169, WO-164, WO-162, WO-163, WO-086, WO-167, WO-087) sit outside gates A to P; the first gate order is WO-060 (G), ninth. NoOp cost in the order's own records: one turn in every role session spent finding the printed scratch path absent (no session count given); one masked gate failure at WO-166's final review (FINAL-001, reviewer error 1); refused reads beside a live gate (four spellings named in the Cost line, 'the seven commands of the observed gap' in criterion 4); three standing sentences that understate what WO-166 shipped; a reservation left behind by a refused Codex dispatch and a TypeError from a stale built runtime (no incident count for either). NoOp cost in the meter: not observed. guardRefusals and stopRefusals are null for four of the five measured orders and 0 for WO-165; bypassTools, adHocScripts and reAnnouncements are null for all five; operatorCorrections is 0 for all five. So the recorded cost is one dated incident plus named commands, it falls on agent sessions, and no operator rescue is on record. Inaction leaves those costs recurring. Action costs an unknown amount; the nearest comparable, WO-166, took 4 h 13 min from activation to its final-review pass with one repair.",
      "systemTraps": "Policy resistance: item 4 is a second round on the same guard after WO-166: the guard refuses a read, a session respells or works around, a pass admits more spellings; the expansion-spelled redirect adapter is already parked as a further round. Whether a form the live-gate list admits can still be refused by the outside-write guard for its redirect is unknown from the compiled subject. guardRefusals is null for four measured orders and 0 for one; worsening is empty. Tragedy of the commons: up to 200 bytes enter every cold-start profile; four registered evidence sources are touched, so editions re-mint, the compiler release owes a carry and the console a re-pin; these are shared costs of keeping harness host code inside registered evidence sources. Drift to low performance: the reviewer profile stands at 23,995 of 24,576 bytes (581 free, at least 381 after this order); eight cold-start ceilings were raised by 4,096-byte steps between 2026-09-17 and 2026-09-22; the role-text efficiency pass is a non-goal here. This order raises no ceiling (criterion 7). Escalation: two refusal conditions are added (a symlinked granted root; a listed Git read under a configured hook or signature format) and one opaque crash becomes a named refusal, while four refused spellings are removed; each refusal is a surface for the next gap report. Success to the successful: the enumerated read list receives more investment while the adapter candidate waits; the compiled subject gives no comparison. Shifting the burden: operatorCorrections is 0 on all five measured orders, so no recorded operator rescue is removed; the abandoned Codex session's operator release stays a non-goal, so that rescue remains. Rule beating: the criteria prove enumerated cases on fixtures while the objective states universals (finding on criterion 4); readAmplification and reAnnouncements are null and stopRefusals is null or, once, 0, so the meter gives no evidence either way. Seeking the wrong goal: machinery work on machinery, with no gate named; machinery share was 0.61, 0.65 and 0.56 on the last three measured orders, and no criterion measures whether this order lowers it (finding on criterion 10).",
      "removalBalance": "Not shown. Named additions: eight mechanisms, among them two new refusal conditions and one refusal message; at most 200 bytes of net growth in a sentence that enters every cold-start profile; one fixture per item; re-minted editions for four registered evidence sources, a compiler release carry and a console re-pin. Named removals: one turn per role session, one masked gate failure, the refused reads of the observed gap, and three standing sentences that are rewritten, not deleted. In standing text and code the addition is the larger side: text grows and no code is removed. The removal is larger only if recurring session turns are counted over many sessions, and the Cost line gives no session count while the meter has no series for it. The order's own elapsed cost is unknown; the one comparable is 4 h 13 min with one repair. Unknown, not a hold.",
      "failureBehavior": "Mixed. Degrades: a scratch path that cannot be created yields one advisory and an unblocked dispatch (criterion 1); an argument form the new parser does not recognize keeps the old refusal; a failed release leaves the old stale reservation. Refuses by design: a granted root whose final component is a symlink (new); a listed Git read while an executable `post-index-change` hook or a `%G` pretty format is configured (new); a Codex dispatch against a stale built runtime, where a named refusal replaces a TypeError, so the stop is the same and its cause becomes legible. Not pinned by any criterion: what the guard does when `lstat` of a granted root fails because the root is absent or unreadable (finding on criterion 2); what the harness does when the printed path already exists as a directory with a wider mode or another owner, a state in which the criterion's 'mode 0700 owned by the session user' would not hold and the fixture, which starts from an absent path, cannot show it.",
      "findings": [
        {
          "criterionId": "criterion:4",
          "kind": "known-issue",
          "reason": "The objective says a session beside a live gate 'is refused for what a command does, never for how a listed read spells its arguments', and the title says the gate 'stops refusing listed reads for their arguments'. The Cost line ships an enumeration: 'four argument forms and one command spelling admitted'. Criterion 4 itself keeps `ls docs/*.md` refused, and `ls` is a listed program because the same order admits `ls docs 2>/dev/null` while adding no program to the list. A glob is an argument spelling. So the universal in the objective is false at close by the order's own fixture table, and a passing table cannot establish it. The refusal may well be right, since an expansion can change what a command does; then the objective's opposition of effect and spelling is the part that is wrong, and it is the sentence a reader and a verifier meet first. Spellings outside the four forms stay refused, the expansion-spelled redirect adapter is a non-goal, and the series that would count such refusals is null for four of five measured orders, so the next gap will again arrive as an anecdote and an order item.",
          "evidence": null,
          "reopenWhen": "After WO-168 closes, a session beside a live gate is refused a listed read whose only unadmitted token is an argument spelling outside the four forms (the constructed case is `ls docs/*.md`) and the refusal is filed as a gap or follow-up, or a later order adds further argument forms to the same list."
        },
        {
          "criterionId": "criterion:2",
          "kind": "known-issue",
          "reason": "Criterion 2 pins two states of a granted root's final component: a symlink (refused, root and cause named) and a real directory (admitted). It does not pin the state in which `lstat` itself fails because the root is absent or unreadable. Item 1 creates the session scratch path only, and only where it is printed; nothing in the compiled subject creates the host-scratchpad root, so an absent root is reachable. The objective's 'a grant follows a real directory and nothing else' reads as a refusal in that state, which would turn a write the guard admitted at 4c34b332 into a refusal, including the write that would create the root. Whether the mechanism's own failure refuses or falls back to the old containment-only grant with an advisory is unknown from the compiled subject.",
          "evidence": null,
          "reopenWhen": "After WO-168, a write under a granted session-scratch or host-scratchpad root that does not exist yet, or whose `lstat` errors, is refused where the same write was admitted at 4c34b332."
        },
        {
          "criterionId": "criterion:7",
          "kind": "known-issue",
          "reason": "The generated sentence 'enters every cold-start profile' and may grow by 200 bytes. The drift observation puts the reviewer profile at 23,995 of 24,576 bytes, 581 free, and it has grown 2,696 bytes since its 2026-09-19 acceptance. The cost table records eight cold-start ceiling raises of one 4,096-byte step each between 2026-09-17 and 2026-09-22, two for each of executor, verifier, reviewer and release-close, each preserving reviewed rules instead of trimming; the efficiency pass those acceptances point to is a non-goal of this order, and no title in the 44-order sequence names it. The order stays inside the ceiling, so nothing fails here; it spends up to about a third of the reviewer's remaining headroom on a boundary that concerns Codex dispatch, in every role and both skill roots. Separately, the counts do not reconcile inside the compiled subject: the Cost line rewrites 'three standing sentences', criterion 7 requires products 02 and 07 to 'carry the four sentences in place', and the objective says the boundary is 'stated once'. The item text that might reconcile them is not in the compiled subject.",
          "evidence": null,
          "reopenWhen": "A cold-start profile's verdict leaves `within`, or a new coldStartBytes acceptance is recorded, at WO-168 or at the next order that adds a reviewed sentence to the reviewer profile; or WO-168's verification records disagreement about which sentences criterion 7 covers."
        },
        {
          "criterionId": "criterion:10",
          "kind": "known-issue",
          "reason": "The Cost line's removals are recurring costs, a turn in every role session and refused reads beside a live gate, but no criterion measures them after the change and the cost table has no series that could. guardRefusals and stopRefusals are null for WO-070, WO-115, WO-085 and WO-166 and 0 for WO-165; bypassTools and adHocScripts are null for all five; operatorCorrections is 0 for all five. Ten criteria prove eight mechanisms on fixtures and a green gate. The goal standard says 'verification and handoff compare observed outcomes with the promised benefit'; here there is no observed outcome to compare. Against that unmeasured removal stands a measured kind of addition: the nearest comparable order took 4 h 13 min with one repair, machinery share on the last three measured orders was 0.61, 0.65 and 0.56, and this order re-mints editions for four registered evidence sources and owes a compiler release carry and a console re-pin. It also heads eight consecutive orders that sit outside every gate. The benefit may be real; the records cannot show it either way.",
          "evidence": null,
          "reopenWhen": "WO-168's measured machineryShare is at or above WO-166's 0.559, or guardRefusals is still null in the cost table for the first order that runs beside a live gate after WO-168 closes."
        }
      ]
    },
    {
      "workOrderId": "WO-169",
      "verdict": "aligned-with-findings",
      "criticalPathAndNoOp": "Gate: none. WO-169 is absent from the critical-path table and names no blocked outcome; it is planning, integration and review machinery. NoOp cost in the order's own records: seam-conditioned follow-ups that fired silently (four seams, eight rows and nine closed orders counted on 2026-09-27; the table behind that count is not in the compiled subject); one throwaway script per planning pass to read the register (36 rows on 2026-09-25, 155 in this pass); one request file and one invocation per disposition (163 retained request files); a doubled full stop in nine integration records since WO-100; `Regenerated:` lines printed over a tree that holds conflict markers (no count); one red machinery suite that reached `main` unselected (WO-085 D014). NoOp cost in the meter: not observed. The cost table's series are per work order and none covers a planning pass; adHocScripts, emergencyPasses and manualCloseoutSteps are null for all five measured orders. Inaction keeps a script per pass and an invocation per disposition for a register this pass read at 155 rows. The order's own cost is unknown until run and the Cost line names no comparable.",
      "systemTraps": "Policy resistance: the advisory shows rows to an order that has no authority to absorb them (finding on criterion 1); the register's schema is a non-goal, so a seam stays prose and the matcher infers it from text. Tragedy of the commons: `scripts/` as a declared source puts the configuration-root suite into every script-changing review gate, and one advisory line at two lifecycle points enters every order's output; neither total is accounted (finding on criterion 5). Drift to low performance: criterion 6 names the refuter's unset ceiling (16,742 bytes, ceiling null) and sets none; the label is accurate and changes no standard. Escalation: three command forms and an advisory are process added to manage a register of process residue that this pass read at 155 rows; if rows are shown and not disposed, the register keeps growing and the next pass adds more tooling. Success to the successful: text matching over free-text rows is preferred to a typed seam because the schema is excluded; the compiled subject gives no comparison. Shifting the burden: operatorCorrections is 0 on all five measured orders; the advisory names no owner, so the rows it surfaces return to the next planning pass or to the operator. Rule beating: fixtures prove the match, the line, the batch and the listing; none proves that a seam-conditioned row is disposed by the order that opens its seam. Seeking the wrong goal: no gate named; machinery work on planning machinery; four unrelated seams (the feed, the integrate helper, the review gate's selection, the meter's label) travel under one title, so one item's repair holds the other three.",
      "removalBalance": "Plausible in procedure, not shown in time. Named removals carry counts: a throwaway script per planning pass (36 rows read that way on 2026-09-25, 155 in this pass), one request file and one invocation per disposition (163 retained request files), a doubled full stop in nine integration records, silent firing across four seams, eight rows and nine closed orders, one red suite that reached `main`. Named additions: three command forms, one advisory at two lifecycle points, one conflict check, one wider suite selection, one label, one fixture per item. Per planning pass the removal is the larger side. Per order the balance is open: the Cost line counts the red suite that was missed and does not count the run time the wider selection adds to every script-changing review gate. The retained request files are not said to be deleted. No series in the cost table covers a planning pass, so the per-pass removal cannot be confirmed by the meter. The order's own cost is unknown until run and no comparable is named.",
      "failureBehavior": "Mostly degrades. The advisory refuses no completion (criterion 1), so a missed or wrong match falls back to the old silence or to one extra line. An invalid array writes nothing and names the failing index, and single applies remain (criterion 3). Export refuses a destination outside the granted roots, as the existing guard does, and leaves the feed's pages byte-identical (criterion 2); if it fails, the pass is back to its script. Two items turn a silent pass into a stop by design: the integrate helper halts on an authored conflict until `--continue`, and the review gate fails on a red configuration-root suite it used not to select. Not pinned: how an authored conflict is detected. If it is read from the index, a clean tree cannot trip it; if it is read from marker text, a file that holds marker-like lines would stop an integration that ran before. The compiled subject does not say which.",
      "findings": [
        {
          "criterionId": "criterion:1",
          "kind": "known-issue",
          "reason": "The objective is that a follow-up deferred until 'the next order that edits' a file 'is shown to the order that edits it'. The mechanism shows it at `implementation-ready` and `repair-complete`, after the edit is made, to a session whose order is already bounded. The role skills are a non-goal ('the advisory carries the command'), so no role rule says what that session does with the rows. Two outcomes are constructible: the rows are read and left pending, so the firing is audible and nothing else changes; or the session widens its order to absorb them, which the goal standard denies ('Goal alignment grants no authority to reorder or expand work'). `--touching` with a given path serves a planner before the order is written, and that use fits the seam better than the advisory does. The match is textual, rows 'whose text names a changed or given path' or its basename, because the register's schema is a non-goal: a row that names its seam without the path is missed, and a row that names the path for another reason is counted. The fixture proves the match and the line. It does not prove that a seam-conditioned row is disposed by the order that opens its seam, which is what the title promises.",
          "evidence": null,
          "reopenWhen": "After WO-169, an order prints the advisory with a non-zero count and closes with those rows still pending and not retargeted; or an order closes having edited a file that a pending seam-conditioned row was waiting on and `--touching` did not list that row."
        },
        {
          "criterionId": "criterion:5",
          "kind": "known-issue",
          "reason": "Declaring `scripts/` a source of the configuration-root suite selects that suite in the review gate of every order that changes a script. The next four orders in the sequence do: WO-162, WO-163 and WO-086 by their own text, WO-164 by inference from its title. The Cost line counts the removal, one red machinery suite that reached `main` unselected (WO-085 D014), and does not count the addition, the suite's run time in each of those gates; that duration is not in the compiled subject. gateStepCount rose from 78 to 84 at WO-166 and machinery share stood at 0.56 to 0.65 on the last three measured orders. The cost is unknown, not shown to be excessive.",
          "evidence": null,
          "reopenWhen": "gateStepCount or the review gate's elapsed time rises on the first script-changing order after WO-169 and the wider selection caught no red configuration-root result in that gate."
        },
        {
          "criterionId": "criterion:7",
          "kind": "known-issue",
          "reason": "Criterion 7 requires the write-back 'within 600 bytes of product 07's headroom'. The clause can be read as a bound on the addition (at most 600 bytes) or as the headroom the addition must fit inside. Product 07's byte count and ceiling are not in the compiled subject, so neither reading has a number to test against. WO-168 writes four sentences into products 02 and 07 before this order with 'no ceiling raised', and WO-086 edits a product 07 sentence after it, so three queued orders draw on the same unnamed headroom before WO-167 resets the ceiling.",
          "evidence": null,
          "reopenWhen": "The docs check refuses product 07 for its ceiling, or product 07's entry in doc-ceilings.json is raised, during WO-168, WO-169 or WO-086."
        }
      ]
    },
    {
      "workOrderId": "WO-164",
      "verdict": "aligned-with-findings",
      "criticalPathAndNoOp": "Gate: no lettered gate; it unblocks the document gate (npm run test:docs, 24.81 s of which 20.06 s is collection) that 'every planning pass and final review runs', which the Cost line says became the gate's critical path once WO-156 cut the plan tasks under 2 s. That is a per-order throughput cost on every later order, including the gate orders. NoOp cost as the Cost line records it from REVIEW-003 at fa9957f1: 101 sequential status forks (12.8-13.3 s), one release list of 5.2-5.6 s through about 1,050 Git spawns linear in tag count (24 tags 1.48 s, 93 tags 5.63 s), 18.4-19.1 s of collectSources per collection, growing with every closed order and tag; FUP-7f9a27e6ed6c44b3 stays open. None of these figures is in the five observations; they are the line's citations.",
      "systemTraps": "Tragedy of the commons: the order directly reduces shared compute and operator waiting on every gate run. Rule beating: byte-identical board output with the hash in the decisions (criterion 1) and a regression that fails against the original source (criterion 3) make a fake pass hard; a cache keyed by the immutable tag object id cannot serve a moved tag's stale result. Drift to low performance: sets an explicit band (under 3 s) with before and after recorded. Policy resistance: if the per-tag cache is written to disk under a gate input during a live npm test it meets the live-gate write refusal; the cache's location is unspecified. Seeking the wrong goal: the title's 'growing by a second a day' is not derived from the cited per-order (0.12 s) and per-tag (about 0.06 s) figures; the measured removal, not the slogan, is the order's case. Escalation, shifting the burden, success to the successful: immaterial, no operator step, no competing collector.",
      "removalBalance": "Adds a status --all --json fold, a per-tag cache, the collector's use of both and spawn-count regressions; removes 101 forks and about 1,050 Git spawns per collection, about 18-19 s. In runtime the removal dominates; in code it adds. No edition re-mints. The order's own cost is unknown until run (row null).",
      "failureBehavior": "If status --all fails or diverges from the per-order form, the text names no runtime fallback to per-order collection; criterion 4's fixture catches divergence at test time only. A cache miss recomputes, degrading to the old cost, which is the right shape. A cache serving wrong data would change board bytes, which criterion 1 checks only on the same tree at the same time; the regression bounds spawn counts, not correctness across time.",
      "findings": [
        {
          "criterionId": "criterion:4",
          "kind": "known-issue",
          "reason": "No runtime fallback from the one-process fold to the per-order form is named; a fold failure on the operator's host would fail the collection rather than slow it.",
          "evidence": null,
          "reopenWhen": "A collection on the operator's host fails or its output differs from the per-order form outside the fixture."
        },
        {
          "criterionId": "criterion:3",
          "kind": "known-issue",
          "reason": "The per-tag cache's storage is unspecified; a disk cache under a gate input written during a live npm test meets the live-gate write refusal, and a cache elsewhere is invisible to harness prune.",
          "evidence": null,
          "reopenWhen": "guardRefusals for WO-164 records a refusal naming the cache path during test:docs, or a prune inventory lists an unregistered cache."
        },
        {
          "criterionId": "criterion:2",
          "kind": "known-issue",
          "reason": "The title's growth rate ('a second a day') is not supported by the Cost line's figures (0.12 s per order, about 0.06 s per tag); it is an unsupported extrapolation in an order whose case is otherwise measured.",
          "evidence": null,
          "reopenWhen": "Two dated collectSources measurements on the unmodified source, compared with REVIEW-003's 18.4-19.1 s at fa9957f1, establish the actual growth per day."
        }
      ]
    },
    {
      "workOrderId": "WO-162",
      "verdict": "aligned-with-findings",
      "criticalPathAndNoOp": "Gate: none named and no blocked outcome named; the objective is entropy inside the scripts unit and the compiler. NoOp cost as the Cost line records it from the planning document section 8: seventeen local git wrappers (about 286 call sites) with none importing runGit; twenty mkdir-then-write fixture helpers (about 635 sites, fourteen byte-identical); nine pretty-JSON definers plus 44 inline sites; six receipt helpers cloned between entropy-review.mjs and plan-receipts.mjs; five JSON readers duplicating paths.mjs; eight bare-hex digest copies beside a prefixed sha256 (an import hazard); compile.ts re-declaring compareText and orderedUnique. The meter observes none of this; the goal standard's requirement that prerequisite work name the blocked outcome is not met by this order's text.",
      "systemTraps": "Seeking the wrong goal: the largest lens here; a refactor over roughly 900 call sites serves no named outcome, and its process cost is its own measure against the 0.25-0.52 machineryShare series. Rule beating: byte-identical fixture outputs and stored digests (criterion 5) and unchanged asserted error messages (criterion 4) are strong oracles. Policy resistance: folding a null-on-failure wrapper into a throwing runGit turns a degrade into a refusal at that site; criterion 7 requires one decision per divergence, which is the right brake. Drift to low performance: one definition per helper improves an explicit standard. Tragedy of the commons: authority edition re-mint only; no live episode. Escalation: a wide diff across dozens of files; WO-160 edits the same scripts and precedes it in the sequence, so a parallel-worktree run would collide. Shifting the burden, success to the successful: immaterial.",
      "removalBalance": "Yes, clearly: one scripts/lib module, one bare-hex export, two compiler exports and one regression against dozens of duplicate definitions and hundreds of call sites. The order's own cost is unknown until run (row null).",
      "failureBehavior": "The regression refuses at the gate; there is no runtime mechanism to degrade. The semantic risk is per site: a caller that formerly returned null on failure now throws if its variant is not expressed as an argument, the opposite of the preferred degrade direction; criterion 7's decisions are where each such site must be named.",
      "findings": [
        {
          "criterionId": "criterion:1",
          "kind": "known-issue",
          "reason": "The Cost line says most wrappers express 'hookless, identity, timeout or null-on-failure variants as arguments'; a null-on-failure site converted to a throwing runGit call changes a silent degrade into a refusal, and byte-identical fixture outputs do not exercise the failure path.",
          "evidence": null,
          "reopenWhen": "A former null-on-failure caller throws in a fixture or a live run (a new refusal or stack trace naming runGit), or a decision records such a site."
        },
        {
          "criterionId": "criterion:7",
          "kind": "known-issue",
          "reason": "No blocked outcome is named; the value is entropy reduction whose benefit to a product outcome is unquantified, and the order's own machineryShare will be its only measure.",
          "evidence": null,
          "reopenWhen": "The seeking-the-wrong-goal series records WO-162's machineryShare above the series maximum 0.524, or elapsedPerCodeByte gains its first value on this order."
        }
      ]
    },
    {
      "workOrderId": "WO-163",
      "verdict": "aligned-with-findings",
      "criticalPathAndNoOp": "Gate: none named; 5S Sort and Set in order. NoOp cost as the Cost line records it from the planning document section 7: three import-only top-level entrypoints, a CLI block in scripts/lib/release-fixtures.mjs, three planning JSON inputs no receipt, check or document reads, the 1.28 MB machine-written followups.json appearing authored in diffs, one evidence tool whose --check has failed since its activation commit (WO-142 D008) and one whose operator-run row has waited since 2026-09-20 (WO-099 D007). Not measured by the meter; no blocked outcome named.",
      "systemTraps": "Drift to low performance: criterion 5 allows closing a failing --check by marking its reproduction historical, a route that can normalize a worse baseline; which option is chosen is the signal. Rule beating: the .gitattributes row, if it disables diff for followups.json, hides it from git diff --check (criterion 6). Seeking the wrong goal: no outcome named, but the order 'adds nothing new' and its cost is small. Policy resistance: moving files can break the runner's machinery-source lists; criterion 2 pins them. Tragedy of the commons, escalation, shifting the burden, success to the successful: immaterial, small, no operator step, no live episode.",
      "removalBalance": "Yes: adds one attribute row and decisions; moves three files, removes a command block and three inputs, marks one generated file, closes two dispositions. The order's own cost is unknown until run (row null); no registered source changes.",
      "failureBehavior": "A missed importer fails harness check or the discovery fixtures, a refusal at the gate, appropriate for a move. The attribute row degrades harmlessly (display only) unless it disables diff. The historical marker has no failure mode and no repair.",
      "findings": [
        {
          "criterionId": "criterion:5",
          "kind": "known-issue",
          "reason": "The 'reproduction marked historical' option closes WO-142 D008 without repairing the --check that has failed since activation; the tool stays in the tree with a known-failing check.",
          "evidence": null,
          "reopenWhen": "The recorded disposition says historical for a --check that still fails on the current tree while the tool remains in the tree."
        },
        {
          "criterionId": "criterion:4",
          "kind": "known-issue",
          "reason": "The attribute's semantics are unspecified; a binary or -diff attribute would remove followups.json from git diff and git diff --check, weakening criterion 6.",
          "evidence": null,
          "reopenWhen": "git check-attr shows a diff-disabling attribute on followups.json, or git diff --check skips it."
        }
      ]
    },
    {
      "workOrderId": "WO-086",
      "verdict": "aligned-with-findings",
      "criticalPathAndNoOp": "Gate: none. WO-086 lies in the critical-path table's `deferred` row (WO-084 to WO-090, docs reset), which the table calls 'Not the product bottleneck; each child floats after the first external change or a dated waiver'. The subject lists no active deferral, so it floats, and it is placed sixth of 44, ahead of every open gate order. By its title WO-087, eighth, assumes this order's generated release history, so what WO-086 unblocks is another docs-reset order (inference from the two titles). NoOp cost in the order's own records: 06 section Release boundary spans lines 21 to 857 and 63,183 bytes at 4c34b332 under an unconditional docs-check exemption; it holds 20 machine-written collision-retiming paragraphs and grows by two paragraphs per order. With 44 orders queued, inaction adds about 88 paragraphs to a section that no ceiling counts (arithmetic on the Cost line's rate). NoOp cost in the meter: not observed; no series measures document growth, and readAmplification is null for all five measured orders. The order's own cost is unknown until run and no comparable is named.",
      "systemTraps": "Policy resistance: the marker check ties a docs gate that every order must pass to local tag refs, which any sibling lane changes by publishing (finding on criterion 1); `release prepare` writes the version into the order heading while queued WO-113 moves state out of order files (second finding on criterion 1). Tragedy of the commons: the order shrinks a shared read surface and ends its growth per order, which is the lens it serves best; the receipt keeps the bytes in the repository. Drift to low performance: the ceiling is set from the landing count plus two per cent, so the standard follows the result (finding on criterion 4). Escalation: prose is replaced by a generated block, a marker check, a collision path and a refusal; each is a new place for a gate to stop. Success to the successful: version assignment at activation keeps its investment; assignment at publication, which would leave no collision to record, is a non-goal (finding on criterion 3). Shifting the burden: operatorCorrections is 0 on all five measured orders, and the collision paragraphs are already machine-written, so no recorded operator rescue is removed; what is removed is reader attention. Rule beating: all five criteria can pass with the retiming paragraphs still in 06 (finding on criterion 4). Seeking the wrong goal: the order answers the showrunner's question 'what did the release contain?' with the tag as the record, which fits the role; it is documentation hygiene from the deferred row, placed ahead of the gates.",
      "removalBalance": "Named, yes; pinned, no. On the surface a reader meets, the removal is the larger side: 545 lines of 06 section Release boundary, the end of two paragraphs of growth per order, the retiming vocabulary on four surfaces, and an unconditional exemption covering 63,183 bytes, against one generated table, one registered marker pair, one command form and one collision path. In repository bytes it is a move: the retired notes are kept byte for byte in a dated receipt, which the Cost line lists under its additions. No criterion asserts that the 545 lines leave 06, and the ceiling is set from whatever the document weighs at landing (finding on criterion 4). The order's own cost is unknown until run.",
      "failureBehavior": "No. It refuses, and there is no old behavior left to fall back to. A stale table fails the marker check (criterion 1); an unregistered marker pair or a demoted terminating heading is reported (criterion 4); a conflicted decisions record refuses `release prepare` with the path and writes nothing (criterion 3). The hand-kept prose and the unconditional exemption are removed, so a failure of `release list --markdown` or of the join between a tag and its order heading leaves the docs gate red. These refusals are the purpose of the order. One of them can fire for a cause outside the order's tree, because the table is a function of local tag refs (finding on criterion 1).",
      "findings": [
        {
          "criterionId": "criterion:1",
          "kind": "known-issue",
          "reason": "The table holds 'one row per local annotated tag' and 'the marker check refuses a stale table', so the docs gate's verdict on a commit depends on the tag refs of the checkout it runs in, which the commit does not contain. Two cases are constructible. A sibling lane publishes a tag while this worktree's tracked files are unchanged, and the table goes stale here; worktrees of one repository share their tag refs, so this needs no fetch. A clone or an export that holds fewer tags generates a shorter table and refuses the committed one. The Cost line counts 20 collision paragraphs, so lanes publishing beside one another is the recorded norm. The old behavior was an exemption that could not refuse; the new one makes `npm run test:docs`, which all four judged orders require green, a function of state outside the tree. The goal standard's platform lens asks for 'content-addressed inputs' and 'no private setting as the source of a guarantee'. The README release block is checked the same way by the order's own words, but it carries one version claim, not a row for every tag.",
          "evidence": null,
          "reopenWhen": "`npm run test:docs` refuses the 06 release table in a worktree whose tracked files have not changed since its last green run, or in a checkout whose local annotated tags differ from those present where the table was generated."
        },
        {
          "criterionId": "criterion:1",
          "kind": "known-issue",
          "reason": "`release prepare` writes the target version 'into the control event and the order heading only', and the table takes its order column 'from the tag and the order heading'. WO-113, 30th in the same sequence, makes work-order files 'stable contracts: state changes live in control events', 'checked forward from a cutoff'. A version written into a heading at activation is a state change in the order file, and the control event already carries the same value. WO-113's criteria text is not in the compiled subject, so whether it exempts the heading is unknown. If it does not, the generated table loses a source that this order has just made it depend on.",
          "evidence": null,
          "reopenWhen": "WO-113's activation or verification names the heading's version as a state change to migrate, or the table's join fails for an order whose heading carries no version."
        },
        {
          "criterionId": "criterion:3",
          "kind": "known-issue",
          "reason": "All 44 titles in the sequence carry '(version assigned at activation)', the Cost line counts 20 collision paragraphs, and 'version assignment at publication (map candidate)' is a non-goal. The order therefore changes where a collision is written, a typed decision instead of roadmap and README prose, and builds an append path, a fixture and a refusal for it, while the design that lets concurrent lanes collide stays. If versions were assigned at publication there would be no collision for this path to record. The compiled subject gives no reason for excluding that alternative. Separately, the objective says a collision 'is recorded once', while the decision is one 'the integrate helper already drafts' and `release prepare` now appends; criterion 3 tests the append and the refusal, not that two writers yield one record. WO-169 removes a doubled full stop from nine records written by the same helper, so duplication on this seam has precedent.",
          "evidence": null,
          "reopenWhen": "A version collision is recorded on any order after WO-086, or one collision yields two integration decisions in an order's decisions record."
        },
        {
          "criterionId": "criterion:4",
          "kind": "known-issue",
          "reason": "The Cost line's removal is 545 lines of 06 section Release boundary and the end of two paragraphs of growth per order. No criterion asserts it. Criterion 1 proves the table, criterion 2 that the retired notes exist in the receipt, criterion 3 the behavior at a future collision, and criterion 4 sets product 06's ceiling to 'its counted bytes at landing plus two per cent', which any byte count satisfies. A landing that leaves the retiming paragraphs in 06 outside the markers passes all five criteria with a ceiling sized to hold them. Because the 63,183 exempt bytes 'were never counted', whatever survives outside the markers is counted for the first time, so the new ceiling may be higher than the present one; its direction is unknown from the compiled subject. WO-167 pins its own removal (zero dated paragraphs, bytes before and after, ceiling lowered to the result) and uses a different ceiling rule, the exact after count.",
          "evidence": null,
          "reopenWhen": "Product 06 at WO-086's landing still holds a collision-retiming, activation-completion or forward-retiming paragraph outside the generated markers, or its new entry in doc-ceilings.json exceeds its entry at 4c34b332."
        }
      ]
    },
    {
      "workOrderId": "WO-167",
      "verdict": "aligned-with-findings",
      "criticalPathAndNoOp": "Gate: none. WO-167 is absent from the critical-path table and names no blocked outcome; it consolidates product 07, the execution guide. It is placed seventh of 44, after three judged orders that each write into product 07 (WO-168 criterion 7, WO-169 criterion 7, WO-086 criterion 4) and ahead of every open gate order. NoOp cost in the order's own records: 32 dated amendment paragraphs and nine candidate sections stay in the guide, so a reader meets a rule in its sentence and again in its amendment. The Cost line adds 'the reading they cost every cold start', which no supplied series measures: coldStartBytes counts the instruction file plus the role skill, and readAmplification is null for all five measured orders. Product 07's byte count and ceiling are not in the compiled subject. The order's own cost is unknown until run and no comparable is named.",
      "systemTraps": "Policy resistance: a ceiling equal to the byte count meets a standing habit of writing rules back into product 07, which three of the four judged orders do, and a recorded route that answers a breach with a 4,096-byte raise (finding on criterion 4). Tragedy of the commons: the nine candidates move to the planning map, which also receives 864 lines from WO-087; the size of that shared sink is not measured by either order (finding on criterion 3). Drift to low performance: this is the one judged order that lowers a ceiling and empties a baseline, which is the opposite of drift if it holds. Escalation: later amendments must be in-place edits inside a full ceiling; the constructible responses are a raise or text placed in another document. Success to the successful: the fold invests in prose at seventh place while the rule migration that compiles always-on sentences into units (WO-096 to WO-098) sits at 35th to 37th; whether any of the 32 folded rules is a migration candidate is unknown. Shifting the burden: operatorCorrections is 0 on all five measured orders; the fold moves work to the verifier, who carries 32 judgment comparisons. Rule beating: a recorded count satisfies criterion 1 (finding on criterion 1), and the three named proofs do not cover every citation class criterion 2 claims (finding on criterion 2). Seeking the wrong goal: no gate named; the measured outcome is one document's byte count, while the claimed benefit is reading cost at cold start, which no supplied series measures.",
      "removalBalance": "Yes for product 07, by construction; size unknown. Criterion 1 requires zero dated bold paragraphs and zero `Candidate` headings, and criterion 4 requires a ceiling lowered to the after count, which cannot be met unless the document shrinks. How much it shrinks is unknown until run: each dated paragraph is replaced by an edit to its sentence plus a bracketed citation. For the documentation set the balance is smaller than for 07: the nine candidate sections move to the planning map, so their bytes leave the guide and not the repository, and the map's bytes are not recorded. The claimed removal of 'the reading they cost every cold start' is not measured: coldStartBytes counts the instruction file plus the role skill, and readAmplification is null for all five measured orders.",
      "failureBehavior": "No, by design. After the fold the WO-085 baseline for 07 is empty and the ceiling equals the byte count, so a new dated paragraph, a new `Candidate` heading or any net growth in product 07 is refused by the docs check; the old way of amending the guide is what the order removes. At landing, a moved heading fails `harness-context.mjs --check` with 'Unresolved required section', strictly, and the criterion requires zero failures from all three checks. A citation class that none of the three checks covers would not refuse and would not degrade; it would fail silently for whoever follows the citation (finding on criterion 2). The fold itself is a documentation edit and is reversible through Git.",
      "findings": [
        {
          "criterionId": "criterion:1",
          "kind": "known-issue",
          "reason": "Criterion 1 has the verifier check 'every row's rule against its sentence' and record 'the count checked'. The recorded evidence is a number. A count of 32 can be written without any row having been compared. The risk it guards is the order's largest: a fold that changes a rule's meaning changes it for every role that reads the guide, and the non-goal 'any change to a rule's meaning' is enforced only by this judgment. The goal standard's platform lens asks that a result be 'usable by a stranger to the session'; a per-row record (paragraph, sentence, verdict) would make the judgment inspectable, and the criterion does not ask for one.",
          "evidence": null,
          "reopenWhen": "WO-167's verification report holds a count without per-row comparisons, or a correction is later filed against product 07 for a folded sentence that states its rule differently from the dated paragraph in the fold table."
        },
        {
          "criterionId": "criterion:2",
          "kind": "known-issue",
          "reason": "Criterion 2 claims that every heading cited by 'a role skill, a queued order's `Cites` line or the publication index' resolves, then names three proofs and what each proves: `harness-context.mjs --check` for the role skills and the instruction file, the docs check for Markdown links 'in root and configured-document files only', and `check-publication` for the index rows. No named proof covers a queued order's `Cites` line, and the criterion itself says the docs check reads inline-code citations 'as nothing'. Headings do move in this order: the nine `Candidate` headings leave product 07 for the map. A queued order that cites one of them would be unresolved after the fold with all three checks at zero failures. A second class is uncovered as well: records cite the guide by date, not by heading. Acceptances in the cost table dated 2026-09-20 and 2026-09-22 rest on 'product 07's standing 2026-09-17 route', by its name a dated paragraph of the guide (inference). After the fold a paragraph's date is 'reduced to a bracketed citation of the decision or planning document', which need not carry the date, so such a citation resolves only through the fold table, whose location the criterion does not name.",
          "evidence": null,
          "reopenWhen": "After the fold, a queued order's `Cites` line names a product 07 heading that no longer exists there while all three checks report zero failures; or a reader cannot resolve 'product 07's standing 2026-09-17 route' to a sentence of the folded guide without the fold table."
        },
        {
          "criterionId": "criterion:3",
          "kind": "known-issue",
          "reason": "Criterion 3 records the register's pending counts before and after and criterion 4 records product 07's bytes before and after; neither records the planning map, which receives the nine candidate sections. WO-087, next in the sequence, moves a further 864 lines of roadmap candidates and policy into the same map. The reading does not leave the system; it moves from sessions that read the guide to passes that read the map, and the planning side is already over one budget: the sequence file was measured at 8,273 bytes against 8,192 on 2026-09-22 and its ceiling raised to 12,369. Whether the map has a ceiling is not in the compiled subject.",
          "evidence": null,
          "reopenWhen": "The planning map's byte count after WO-167 or WO-087 breaches a ceiling or receives an acceptance, or a planning pass after them records a read of the map that was truncated, split or skipped for size."
        },
        {
          "criterionId": "criterion:4",
          "kind": "known-issue",
          "reason": "Criterion 4 lowers product 07's ceiling 'to the after count', which leaves no headroom; the objective wants the ceiling to hold the guide at its folded size. Writing a rule back into product 07 is routine in this horizon: three of the four judged orders do it (WO-168 criterion 7, WO-169 criterion 7, WO-086 criterion 4). The first order after WO-167 with such a write-back meets a full ceiling and an empty baseline. The cost table shows how breaches have been settled so far: eight cold-start ceilings and the sequence ceiling were each raised by one 4,096-byte step with the reviewed text preserved, 'never trimmed around'. If that route applies to document ceilings, the lowered ceiling lasts until the next write-back and then sits 4,096 bytes above the guide; if it does not, that order is refused or must displace a sentence. Which holds is unknown from the compiled subject. WO-086 sets its document ceiling by a different rule, the landing count plus two per cent.",
          "evidence": null,
          "reopenWhen": "The first order after WO-167 that writes a sentence into product 07 records a docs-check ceiling refusal or a raised product 07 entry in doc-ceilings.json."
        }
      ]
    },
    {
      "workOrderId": "WO-087",
      "verdict": "aligned-with-findings",
      "criticalPathAndNoOp": "Gate: none; deferred row, floating. NoOp cost in the records: not in the trap observations; in the tree, 06 is 148,793 bytes and 2,155 lines at both 9cc597d7 and af742c5b, and lines 799-1662 at 9cc597d7 run exactly from ## Work-order navigation and identity (candidate) to the line before ## v0.0.0 Clean-room bootstrap: 864 lines, as the Cost says. The register references seven of the nine sections (navigation and identity 14 refs, unattended portfolio 11, local-model experiments 11, bounded baseline 3, whole-or-split 2, budget-window 2, beacon checkpoint 2; seven key fields), which matches the seven --apply requests; the two capability-progression subsections and counterfactual profiling have no register rows. docs/publication/audience-status-index.md holds twelve rows for anchors in that range. If nothing changes, the roadmap keeps carrying 864 lines of policy that product 07 §Documentation freshness now says belongs in the planning map.",
      "systemTraps": "Policy resistance: none found; WO-085's link check lands first and guards the move. Tragedy of the commons: 864 lines move from a bounded document to the map, which is exempt from ceilings and already 341,119 bytes; the bytes are not reduced, they are relocated to a surface with no bound and no meter. Drift to low performance: 06's ceiling is lowered; the map's standard is undefined. Escalation: seven recorded --apply requests; bounded. Success to the successful: the map as the candidates' home is the existing convention, so no alternative is displaced. Shifting the burden: none. Rule beating: 06 under its lowered ceiling is satisfied by relocation, and the objective (the roadmap holds the ladder and the generated history) is met by construction; the register duplicate rows are the only evidence that nothing was lost. Seeking the wrong goal: moving candidate policy out of a product commitment document is a semantics correction the exclusions support (bundled patterns are examples, not kernel truth); aligned.",
      "removalBalance": "On 06, yes: 864 lines out and only markers and a pointer in. On the repository, no: the same text lands in the map, plus register duplicates and index edits, and the Cost line says so. The move is honest and the count is verified.",
      "failureBehavior": "An edit; guards are WO-085's check and check-publication, refusals. A link to a moved section from outside the check's scope (a generated skill, README, an evidence file) breaks silently; the twelve publication-index rows are removed by hand and check-publication catches only what the index still names. No old behaviour to fall back to, and none needed.",
      "findings": [
        {
          "criterionId": "criterion:1",
          "kind": "known-issue",
          "reason": "The map receives 864 lines and has no ceiling or meter; the order lowers 06's bound and records nothing about the map's growth, so the reader cost moves rather than falls.",
          "evidence": null,
          "reopenWhen": "The planner subject's subjectCharacters series or the map's byte count rises after WO-087 lands with no bound recorded for it."
        },
        {
          "criterionId": "criterion:1",
          "kind": "known-issue",
          "reason": "Link scope: twelve publication-index rows and an unknown number of links outside docs/product/ point at anchors in lines 799-1662; the criterion cites the docs check and check-publication, whose combined scope is not stated.",
          "evidence": null,
          "reopenWhen": "A broken link to a moved roadmap section is found after landing in a file neither check covers."
        }
      ]
    },
    {
      "workOrderId": "WO-060",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate G supplies portable intake for contracts and source adapters. NoOp leaves downstream work without a screened, immutable source boundary; cost is unmeasured.",
      "systemTraps": "Policy resistance: one decoder and screen provide consistent input rules. Commons: content addressing avoids repeated source copies. Drift: resolving spans preserve provenance. Escalation: adapters remain separate. Success to the successful: sourceKind supports multiple origins. Intervenor burden: structured intake reduces manual reconstruction. Rule beating: a pattern screen is not universal secret detection. Wrong goal: usable intent with protected provenance.",
      "removalBalance": "Unknown: the legacy Cost line provides no comparison.",
      "failureBehavior": "Malformed or screened content refuses before storage. This protects privacy; falling back to unscreened intake would discard the boundary's purpose.",
      "findings": []
    },
    {
      "workOrderId": "WO-116",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate U makes audit accessible to the live console and gate V. NoOp requires separate access to canonical audit projections; costs are unmeasured.",
      "systemTraps": "Policy resistance: canonical audit remains the sole source. Commons: reuses existing projections. Drift: fidelity labels prevent overstated interpretation. Escalation: no new audit semantics are added. Success to the successful: any parity client can consume the result. Intervenor burden: reduces evidence navigation. Rule beating: rendering does not improve underlying evidence. Wrong goal: inspectable outcomes for unfamiliar users.",
      "removalBalance": "Unknown: the legacy line does not price accessibility gains against the serving layer.",
      "failureBehavior": "The underlying audit projection remains available as the baseline. Serving failure must not fabricate a complete audit; no contrary behavior is specified.",
      "findings": []
    },
    {
      "workOrderId": "WO-065",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate H enables post-delivery resolution in WO-066 and V. NoOp leaves pull-request state to manual polling and classification; costs are unmeasured.",
      "systemTraps": "Policy resistance: classifications separate human and automated review. Commons: identical observations append nothing. Drift: current head identity anchors state. Escalation: no separate daemon is introduced. Success to the successful: typed events keep the adapter replaceable. Intervenor burden: removes routine polling. Rule beating: local status cannot substitute for observed remote state. Wrong goal: delivery closure rather than observation volume.",
      "removalBalance": "Unknown: no measured larger removal is declared.",
      "failureBehavior": "Failed reads cannot establish resolved state; secret-bearing content refuses before storage. Manual observation remains possible, but stale results must remain distinguishable from fresh evidence.",
      "findings": []
    },
    {
      "workOrderId": "WO-117",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate U provides the operator-visible runtime and supports V's exit. NoOp leaves supported commands and projections without the witnessed live experience.",
      "systemTraps": "Policy resistance: one parity contract prevents UI authority drift. Commons: refresh costs belong to the client. Drift: live witnessed behavior complements fixtures. Escalation: no drag-and-drop scope is added. Success to the successful: the text host remains one of multiple possible clients. Intervenor burden: integrates status, action and audit. Rule beating: screenshots or transcripts alone do not prove unseen functionality. Wrong goal: strengthens the smallest useful loop.",
      "removalBalance": "Unknown: the legacy Cost line does not quantify reduced navigation.",
      "failureBehavior": "Terminal commands remain the underlying interface if the live console fails. Unsupported connections should remain visibly unavailable, not imply resident progress.",
      "findings": []
    },
    {
      "workOrderId": "WO-066",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate H completes the post-PR loop required by V. NoOp retains manual triage, repair, verification, push and re-observation; costs are unmeasured.",
      "systemTraps": "Policy resistance: human review remains outside automatic disposition. Commons: bounded repair limits episode cost. Drift: verification precedes push. Escalation: incorrect suggestions can be rejected. Success to the successful: reviewer origin does not make a suggestion correct. Intervenor burden: routine resolution is automated. Rule beating: flipping a resolved bit cannot pass. Wrong goal: actual observed closure rather than reply activity.",
      "removalBalance": "Unknown: the legacy line does not measure the removed handoff chain against added episodes.",
      "failureBehavior": "Outside-scope items yield NeedsHuman; failed verification prevents push. Persisted continuations resume without repeated publication, preserving manual handling for unresolved decisions.",
      "findings": []
    },
    {
      "workOrderId": "WO-057",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate F provides browser evidence for WO-059 and V. NoOp leaves installation, isolation, replay and cleanup assumptions untested; costs are unmeasured.",
      "systemTraps": "Policy resistance: environment observations precede adapter promises. Commons: browser probes consume bounded resources. Drift: actual screenshot behavior defines comparison rules. Escalation: no dependency lands during discovery. Success to the successful: tests operation without a privileged connected server. Intervenor burden: records reusable setup truth. Rule beating: process observation checks cleanup. Wrong goal: enables evidence for real visual criteria.",
      "removalBalance": "Unknown: the legacy line does not quantify avoided integration mistakes.",
      "failureBehavior": "Unavailable capabilities can be recorded without implementing the adapter. Unequal screenshots are observations, not grounds for inventing determinism.",
      "findings": []
    },
    {
      "workOrderId": "WO-058",
      "verdict": "aligned-with-findings",
      "criticalPathAndNoOp": "Gate F supplies visual/network witness rules for V. NoOp permits unsuitable witness types to appear sufficient; costs are unmeasured.",
      "systemTraps": "Policy resistance: typed witness rules clarify acceptance but broad error propagation can conflict with independent criteria. Commons: browser-free fixtures bound cost. Drift: missing evidence stays unverified. Escalation: unrelated errors could trigger extra repair. Success to the successful: DOM evidence is not privileged as universal proof. Intervenor burden: deterministic folding reduces judgment repetition. Rule beating: screenshots must bind to criteria. Wrong goal: correct claims rather than witness counts.",
      "removalBalance": "Unknown: the legacy Cost line does not quantify the benefit.",
      "failureBehavior": "Missing required witnesses yield unverified; negative witnesses cannot be relabeled by implementers. Existing behavior claims remain compatible.",
      "findings": [
        {
          "criterionId": "criterion:3",
          "kind": "known-issue",
          "reason": "A console error fails every criterion in its scenario without a stated causal distinction. This may be an intentional scenario contract, but its wider burden is unobserved.",
          "evidence": null,
          "reopenWhen": "A recorded unrelated or expected console error causes otherwise satisfied criteria to fail and generates unnecessary repair."
        }
      ]
    },
    {
      "workOrderId": "WO-059",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate F implements the browser port consumed by V. NoOp leaves visual and network claims without independent runtime witnesses; costs are unmeasured.",
      "systemTraps": "Policy resistance: witness contracts isolate adapter specifics. Commons: browser and dependency costs stay outside the kernel. Drift: saved scenarios compare reproducible evidence. Escalation: one pinned dependency bounds expansion. Success to the successful: no connected server is required. Intervenor burden: automated capture and cleanup replace manual collection. Rule beating: console failures remain negative. Wrong goal: evidence for application behavior.",
      "removalBalance": "Unknown: the legacy Cost line does not establish a larger removal; the adapter is a product capability.",
      "failureBehavior": "Browser failure cannot produce verified witnesses. Kill recovery cleans up processes; unavailable evidence remains unverified while non-browser contracts remain usable.",
      "findings": []
    },
    {
      "workOrderId": "WO-061",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate G turns source artifacts into contracts consumed by V. NoOp retains manual interpretation and revision tracking; costs are unmeasured.",
      "systemTraps": "Policy resistance: explicit supersession reconciles reversals. Commons: selective invalidation avoids restarting unrelated work. Drift: source spans preserve the acceptance basis. Escalation: ambiguity remains open rather than generating assumptions. Success to the successful: inferred statements cannot overwrite rules silently. Intervenor burden: durable understanding reduces restatement. Rule beating: model inference is never relabeled deterministic. Wrong goal: product lead intent survives lowering.",
      "removalBalance": "Unknown: no comparative measurement appears in the legacy line.",
      "failureBehavior": "Unresolved interpretation stays open; invalid inference refuses. Valid unchanged source retains its derived items rather than forcing whole-contract regeneration.",
      "findings": []
    },
    {
      "workOrderId": "WO-124",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate G enables bounded implementation orders in V. NoOp requires repeated manual surface/test selection; costs are unmeasured.",
      "systemTraps": "Policy resistance: profile and contract evidence share one derivation. Commons: scoped tests avoid indiscriminate work. Drift: unresolved paths do not become guesses. Escalation: confidence handoff can create operator work and must remain material. Success to the successful: supplied inference stays labeled. Intervenor burden: automates resolvable cases. Rule beating: confidence alone is not correctness. Wrong goal: express intended change within authority.",
      "removalBalance": "Unknown: the legacy line does not compare automated derivation and handoffs with the manual baseline.",
      "failureBehavior": "Low confidence yields NeedsHuman with candidates, preserving a manual decision path. It does not dispatch an invented scope.",
      "findings": []
    },
    {
      "workOrderId": "WO-062",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate G supplies the first external source adapter for V. NoOp leaves issue intake manual; costs are unmeasured.",
      "systemTraps": "Policy resistance: one SourceBundle boundary separates tracker behavior. Commons: stable hashes avoid duplicate storage. Drift: revisions retain source identity. Escalation: the adapter remains read-only. Success to the successful: GitHub is a port implementation, not kernel doctrine. Intervenor burden: removes copy/paste intake. Rule beating: screening precedes persistence. Wrong goal: usable intent rather than connector coverage.",
      "removalBalance": "Unknown: no larger measured removal is declared.",
      "failureBehavior": "Fetch or screening failure cannot produce a trusted bundle. Existing stored bundles retain their identities; failure must not masquerade as a fresh unchanged source.",
      "findings": []
    },
    {
      "workOrderId": "WO-123",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate V composes the existing primitives into one intent-to-delivery continuation. NoOp leaves the operator coordinating each primitive manually; the cost is unmeasured.",
      "systemTraps": "Policy resistance: one authority-checked admission joins existing contracts. Commons: persisted steps prevent duplicate work. Drift: terminal outcomes require each receipt. Escalation: failures stop at named steps. Success to the successful: command and resident entries share implementation. Intervenor burden: removes ordinary phase handoffs. Rule beating: a draft cannot stand in for authorization. Wrong goal: delivers the mission's smallest complete loop.",
      "removalBalance": "Unknown quantitatively, but the objective names a substantial procedural replacement without adding a separate primitive.",
      "failureBehavior": "Ambiguous or unauthorized intents remain drafts or NeedsHuman. Named step failures stop safely; individual primitives remain available for authorized manual operation.",
      "findings": []
    },
    {
      "workOrderId": "WO-112",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate V proves the integrated source-to-deliverable loop from core. NoOp leaves component success without demonstrated replacement of the predecessor workflow.",
      "systemTraps": "Policy resistance: exercises the complete authority and evidence chain. Commons: records context, tokens, time and cost. Drift: item-by-item parity prevents weakened standards. Escalation: repairs remain bounded by prior mechanisms. Success to the successful: compares against an actual predecessor baseline. Intervenor burden: interventions and touch time are measured. Rule beating: every representative item must be observed-met. Wrong goal: verified delivery rather than activity.",
      "removalBalance": "The legacy Cost line is unknown; this order is where the proposed replacement's comparative benefits are measured.",
      "failureBehavior": "Unknown or unmet parity remains unverified or failed. No runtime fixes are smuggled into the proof, and the prior workflow remains the practical baseline.",
      "findings": []
    },
    {
      "workOrderId": "WO-074",
      "verdict": "aligned-with-findings",
      "criticalPathAndNoOp": "Gate S enables a starter instance consumed by V and P. NoOp leaves the control plane tied to this repository; costs are unmeasured.",
      "systemTraps": "Policy resistance: export portability conflicts with inherited version refusals. Commons: manifest-listed contents bound the kit. Drift: in-place suites verify usable output. Escalation: discovery chores can burden fresh users. Success to the successful: local/offline distribution avoids marketplace dependence. Intervenor burden: templates remove setup reconstruction. Rule beating: file export alone does not prove a working instance. Wrong goal: a stranger should obtain a usable platform.",
      "removalBalance": "Unknown: the legacy line does not quantify avoided bootstrap work.",
      "failureBehavior": "Nonempty destinations refuse to protect user files. The inherited unknown-version attestation refusal does not gracefully degrade and conflicts with WO-132's later advisory treatment.",
      "findings": [
        {
          "criterionId": "criterion:5",
          "kind": "known-issue",
          "reason": "The export requires a version refusal that WO-132 removes from the source workflow. This is unresolved horizon residue, not evidence that a produced export has already failed.",
          "evidence": null,
          "reopenWhen": "A generated starter rejects an otherwise authorized completion solely because its installed harness version lacks a discovery row."
        }
      ]
    },
    {
      "workOrderId": "WO-075",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate S makes the starter executable and enables the instance proof in V. NoOp exports control-plane files without the required runtime and governed bundle.",
      "systemTraps": "Policy resistance: runtime pins and bundle checks align. Commons: directed-load totals cannot exceed core. Drift: byte identity and smoke tests define the baseline. Escalation: no package publication is introduced. Success to the successful: local distribution remains complete. Intervenor burden: consumers need not rebuild the platform from session knowledge. Rule beating: a denied-effect smoke checks actual enforcement. Wrong goal: usable externalized capability.",
      "removalBalance": "Unknown: the legacy line does not quantify setup work removed by the bundled runtime.",
      "failureBehavior": "Drift refuses harness validation; existing source operation remains unaffected. An unavailable exported runtime cannot truthfully claim the governed profile works.",
      "findings": []
    },
    {
      "workOrderId": "WO-072",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate S enables governed target worktrees and gate P's real consumer. NoOp leaves target lifecycle and report routing manual; costs are unmeasured.",
      "systemTraps": "Policy resistance: explicit launchpad selection prevents split control state. Commons: a local registry avoids repeated discovery. Drift: target cleanliness and no-release behavior are verified. Escalation: publication remains separate. Success to the successful: registered targets use the same lifecycle. Intervenor burden: standard handoffs replace remembered paths. Rule beating: ignored files must also stay out of commits. Wrong goal: safe cross-repository work.",
      "removalBalance": "Unknown: legacy Cost supplies no measured comparison.",
      "failureBehavior": "Missing or ambiguous target context must not select another repository. Cleanup is limited by containment; existing self-repository commands retain their route.",
      "findings": []
    },
    {
      "workOrderId": "WO-073",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate S supplies on-demand repository knowledge for target work and gate P. NoOp requires repeated repository priming; its cost is unmeasured.",
      "systemTraps": "Policy resistance: explicit policy layers expose conflicts. Commons: profiles load only for active target work. Drift: demonstrated architecture replaces guesses. Escalation: missing profiles can require setup, but no ambient cold-start expansion occurs. Success to the successful: classes are chosen compositions. Intervenor burden: durable commands reduce restatement. Rule beating: profile presence is not proof of correctness. Wrong goal: the engineer's authored build carries behavior.",
      "removalBalance": "Unknown: unchanged cold-start totals constrain addition, but the legacy line does not measure removed priming.",
      "failureBehavior": "A missing required target profile refuses activation with its path. Existing non-target workflows remain usable; policy specificity cannot supersede the authority floor.",
      "findings": []
    },
    {
      "workOrderId": "WO-076",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate S enables instance-owned builds and V's starter proof. NoOp leaves consumers editing the shipped Contributor build directly; costs are unmeasured.",
      "systemTraps": "Policy resistance: overlays make instance choices explicit. Commons: reuse avoids copying entire builds. Drift: manifest differences are bounded. Escalation: build:none provides a minimal option. Success to the successful: bundled identity and units can be removed. Intervenor burden: re-emission automates customization. Rule beating: widening still requires admitted provenance. Wrong goal: platform sovereignty rather than prescribed organization.",
      "removalBalance": "Unknown: the legacy line does not price avoided fork maintenance.",
      "failureBehavior": "Absent customization preserves the kit build; build:none intentionally emits the floor. Invalid widening refuses while valid narrowing remains available.",
      "findings": []
    },
    {
      "workOrderId": "WO-077",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate S sustains starter instances after initial export. NoOp requires manual comparison and update of kit files; costs are unmeasured.",
      "systemTraps": "Policy resistance: manifest ownership separates kit and instance edits. Commons: selective updates avoid copying everything. Drift: pinned upstream identity remains inspectable. Escalation: mechanical actions require explicit opt-in. Success to the successful: local modifications remain protected. Intervenor burden: automates safe updates and prints needed actions. Rule beating: rewriting a manifest cannot justify overwriting authored files. Wrong goal: maintainable independent instances.",
      "removalBalance": "Unknown: the legacy Cost line does not quantify the manual update baseline.",
      "failureBehavior": "Modified kit files are retained and reported; instance files remain unchanged. Missing manifests refuse because ownership is unknown. Resident continuity is explicitly tested.",
      "findings": []
    },
    {
      "workOrderId": "WO-078",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate S supplies export provenance for the starter and consumer in P. NoOp requires one checkout lookup per sibling whenever versions or builds must be established.",
      "systemTraps": "Policy resistance: generated rows avoid competing bookkeeping. Commons: small receipts trade disk for repeated reads. Drift: current receipt hashes expose stale entries. Escalation: no separate export step is added. Success to the successful: entries include not-evidenced states. Intervenor burden: removes remembered sibling versions. Rule beating: registry presence cannot certify a consumer run. Wrong goal: useful provenance rather than registry completeness.",
      "removalBalance": "A concrete manual removal is named, but its magnitude versus generator and check cost remains to be measured.",
      "failureBehavior": "A stale render refuses its check; receipts and manifests remain the underlying evidence. The criteria do not require preventing otherwise valid export solely because presentation is stale.",
      "findings": []
    },
    {
      "workOrderId": "WO-118",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate V is the resident-owned product exit leading to R3. NoOp leaves the system dependent on manual phase prompting despite component proofs.",
      "systemTraps": "Policy resistance: exercises all authority and handoff boundaries together. Commons: measures full-loop expenditure. Drift: strict representative outcomes prevent diluted replacement claims. Escalation: only material decisions return to humans. Success to the successful: exported instances must work beyond the author's checkout. Intervenor burden: ordinary coordination must disappear. Rule beating: actor death and restart test actual durability. Wrong goal: one intent reaching verifiable delivery.",
      "removalBalance": "Unknown in the legacy Cost line; the order measures whether the proposed workflow actually removes supervision.",
      "failureBehavior": "Ambiguous control intent yields NeedsHuman; ordinary failures recover under the resident. Unmet replacement criteria remain failed rather than being relabeled as successful partial automation.",
      "findings": []
    },
    {
      "workOrderId": "WO-113",
      "verdict": "aligned-with-findings",
      "criticalPathAndNoOp": "Gate B stabilizes authority files consumed by WO-120 and the lifecycle. NoOp mixes contracts, state and receipts, increasing repeated interpretation; cost is unmeasured.",
      "systemTraps": "Policy resistance: separate surfaces clarify ownership. Commons: smaller contracts reduce repeated reads. Drift: historical bytes remain preserved. Escalation: syntactic bans can create relocation chores. Success to the successful: existing history is grandfathered. Intervenor burden: machine-kept state replaces manual edits. Rule beating: section shape is not semantic stability. Wrong goal: legible authority rather than immaculate filing.",
      "removalBalance": "Unknown: the legacy line does not show that the check and migration cost are smaller than removed reading and maintenance.",
      "failureBehavior": "New prohibited sections refuse the index check; there is no advisory fallback. Existing closed records remain intact.",
      "findings": [
        {
          "criterionId": "criterion:1",
          "kind": "known-issue",
          "reason": "Date- and heading-based detection can confuse a stable contract's dated evidence or assumptions with a lifecycle receipt.",
          "evidence": null,
          "reopenWhen": "A legitimate stable-contract provenance statement is rejected solely because it contains a date or matching heading."
        }
      ]
    },
    {
      "workOrderId": "WO-080",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate P represents outcomes spanning repositories. NoOp leaves member compatibility and staleness to manual coordination; costs are unmeasured.",
      "systemTraps": "Policy resistance: member state remains independently authoritative. Commons: one grouping reuses existing headers and logs. Drift: stale bases stay visible. Escalation: no new event schema is introduced. Success to the successful: no repository's green status dominates siblings. Intervenor burden: reduces cross-repository bookkeeping. Rule beating: grouped green cannot erase a stale member. Wrong goal: outcome delivery rather than individual order throughput.",
      "removalBalance": "Unknown: the legacy Cost line does not quantify the coordination removed.",
      "failureBehavior": "Stale or failing members remain visible independently. Existing order-level information remains usable when grouping is absent.",
      "findings": []
    },
    {
      "workOrderId": "WO-081",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate P exposes workstream coordination in the board. NoOp leaves the index as the only grouped view; costs are unmeasured.",
      "systemTraps": "Policy resistance: board and index share data. Commons: one additive projection avoids duplicated state. Drift: existing panels remain unchanged. Escalation: no new workflow authority is added. Success to the successful: older capsules still render. Intervenor burden: reduces navigation among member orders. Rule beating: visual grouping does not prove delivery. Wrong goal: showrunner clarity.",
      "removalBalance": "Unknown: no larger measured removal appears in the legacy Cost line.",
      "failureBehavior": "Yes: capsules without the extension still render. Failure of the new view does not change underlying member status.",
      "findings": []
    },
    {
      "workOrderId": "WO-082",
      "verdict": "aligned-with-findings",
      "criticalPathAndNoOp": "Gate P qualifies multi-repository work before the operator's real run. NoOp leaves six coordination behaviors unproven outside isolated components.",
      "systemTraps": "Policy resistance: collisions and independent progress are tested together. Commons: synthetic repositories bound experiment cost. Drift: stale claims cannot inherit green status. Escalation: blocked edges name manual handoffs. Success to the successful: pinned contracts allow independent members to proceed. Intervenor burden: restart behavior reduces re-priming. Rule beating: six demonstrations require actual state transitions. Wrong goal: coordinated delivery.",
      "removalBalance": "Unknown: this is an evidence-producing pilot with no quantified savings declaration.",
      "failureBehavior": "Unavailable edges expose a manual route while unrelated members continue. The precise scope of the collision refusal needs to remain the worktree, as in the shared writer rule.",
      "findings": [
        {
          "criterionId": "criterion:1",
          "kind": "known-issue",
          "reason": "The objective describes collision on one repository, whereas writer isolation is one writer per worktree. The fixture must distinguish an actual shared-worktree conflict from safe sibling worktrees.",
          "evidence": null,
          "reopenWhen": "The pilot or implementation refuses independent writers in distinct worktrees solely because they belong to the same repository."
        }
      ]
    },
    {
      "workOrderId": "WO-083",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Gate P proves the platform in the operator's own consumer after the starter exit. NoOp leaves real workflow replacement and priming reduction unobserved.",
      "systemTraps": "Policy resistance: the fork's emitted build must govern the actual run. Commons: elapsed phases and interventions are counted. Drift: baselines are pinned before activation. Escalation: every manual handoff remains visible. Success to the successful: author-checkout success is insufficient. Intervenor burden: zero vision restatements tests priming. Rule beating: unknown baseline cannot pass. Wrong goal: demonstrated user benefit.",
      "removalBalance": "Unknown before execution; independent baseline comparisons are the intended evidence of removal.",
      "failureBehavior": "Missing baseline yields unverified, and non-improving measures fail their claim. The prior workflow remains the comparison rather than being declared obsolete without evidence.",
      "findings": []
    },
    {
      "workOrderId": "WO-096",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Deferred migration support after the first external change, enabling WO-097/098. NoOp retains uncertain shape coverage and always-on prose; costs are unmeasured.",
      "systemTraps": "Policy resistance: one derived classification avoids competing inventories. Commons: whole-set enumeration has bounded but real cost. Drift: pinned denominator prevents denominator drift. Escalation: no mechanisms are compiled here. Success to the successful: exclusions and reference status remain legitimate outcomes. Intervenor burden: reusable classification reduces rediscovery. Rule beating: counts cannot substitute for behavior. Wrong goal: selective context reduction, not migration volume.",
      "removalBalance": "Unknown: legacy Cost does not quantify inventory work against future savings.",
      "failureBehavior": "Missing local terms yields unavailable rather than a clean privacy claim. Classification failures prevent a misleading render; existing mechanisms remain usable.",
      "findings": []
    },
    {
      "workOrderId": "WO-097",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Deferred migration work supports the compiled-rules thesis after the product bottleneck. NoOp retains the six selected always-on sentences; byte costs await selection and measurement.",
      "systemTraps": "Policy resistance: mechanisms must cover the retired rule's behavior. Commons: fewer prompt bytes trade against hook execution. Drift: regression fixtures preserve useful corrections. Escalation: six new mechanisms can add maintenance. Success to the successful: duplicates are prohibited. Intervenor burden: checks aim to remove repeated correction. Rule beating: sentence removal alone is insufficient. Wrong goal: cheaper dependable behavior rather than unit count.",
      "removalBalance": "Not established by the legacy Cost line. Instruction-byte comparisons provide partial evidence, not total runtime/process savings.",
      "failureBehavior": "The criteria prove coverage when mechanisms are present, but do not specify each mechanism's unavailable-state fallback. Failure behavior must be judged for the selected units, not presumed safe.",
      "findings": []
    },
    {
      "workOrderId": "WO-098",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Deferred migration completes a representative batch and measures directed-load reduction. NoOp retains the remaining selected prose and lacks whole-set evidence.",
      "systemTraps": "Policy resistance: reverse mappings preserve correction intent. Commons: every role must load fewer bytes, while cadence cost remains relevant. Drift: restated rules revert to prose status. Escalation: batch scope limits migration expansion. Success to the successful: references remain valid alternatives. Intervenor burden: fewer restatements are tested. Rule beating: unit counts cannot prove reduced supervision. Wrong goal: useful compiled behavior at lower total cost.",
      "removalBalance": "The acceptance text requires a real context reduction, but the legacy Cost line does not establish total additions versus removals.",
      "failureBehavior": "A failed behavioral migration is labeled prose again rather than falsely counted as a mechanism. Individual hook/cadence failures still need their own contracts.",
      "findings": []
    },
    {
      "workOrderId": "WO-091",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Deferred workshop work enables richer compositions after the first external change. NoOp retains single-active groups; its opportunity cost is unmeasured.",
      "systemTraps": "Policy resistance: authority and precedence remain per active. Commons: shared supports avoid duplicated loadouts. Drift: old hashes remain exact. Escalation: six-link overflow is a decomposition diagnostic. Success to the successful: multiple active mechanics become possible. Intervenor burden: explicit pipelines replace guessed interactions. Rule beating: compiling alone cannot prove intended behavior. Wrong goal: engineer-authored composition, not metaphor-driven kernel growth.",
      "removalBalance": "Unknown: this is a new authoring capability with no measured larger removal.",
      "failureBehavior": "Single-active programs retain existing semantics. Noncommuting compositions require an explicit pipeline; overflow is described as a diagnostic rather than a universal refusal.",
      "findings": []
    },
    {
      "workOrderId": "WO-092",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Deferred workshop extension enables WO-094's set bonuses. NoOp lacks a declarative set relationship; costs are unmeasured.",
      "systemTraps": "Policy resistance: bonuses use existing emission kinds. Commons: shared graph data avoids view-specific implementations. Drift: absent sets preserve hashes. Escalation: fixture sets bound scope. Success to the successful: no mandatory 5S doctrine enters here. Intervenor burden: inspection shows arming conditions. Rule beating: round-trip equality must preserve mechanics. Wrong goal: meaningful composition rather than decorative metaphor.",
      "removalBalance": "Unknown: the legacy Cost line names no measured replacement.",
      "failureBehavior": "Yes for absence: sets normalize to empty and old graphs remain unchanged. Bonuses below threshold stay dark.",
      "findings": []
    },
    {
      "workOrderId": "WO-093",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Deferred workshop data supplies the 5S example set. NoOp leaves five mechanics uncompiled; no measured cost is supplied.",
      "systemTraps": "Policy resistance: terms lower into explicit envelopes and seeds. Commons: reuse of existing definitions avoids duplication. Drift: divergences are recorded. Escalation: bonuses and runtime scenarios stay separate. Success to the successful: examples remain optional compositions. Intervenor burden: authored mechanics reduce repeated mapping. Rule beating: tooltip completeness is not behavioral proof. Wrong goal: exact authoring semantics rather than ontology by resemblance.",
      "removalBalance": "Unknown: the legacy line does not quantify reused definitions or avoided prompting.",
      "failureBehavior": "Unequipped mechanics leave existing programs unchanged. Compilation alone does not claim runtime behavior; later scenarios provide that evidence.",
      "findings": []
    },
    {
      "workOrderId": "WO-094",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Deferred workshop lowering enables the full-set scenario. NoOp leaves bonuses descriptive rather than executable; costs are unmeasured.",
      "systemTraps": "Policy resistance: bonus emissions remain within authority. Commons: integrity checks and reevaluation add recurring compute. Drift: bonuses arm only at explicit thresholds. Escalation: reevaluation is bounded. Success to the successful: the optional set does not prescribe all builds. Intervenor burden: standardization can remove repeated repair. Rule beating: semantic hashes change only for armed effects. Wrong goal: useful behavior rather than piece collection.",
      "removalBalance": "Unknown: the legacy Cost line does not compare recurring verification/cadence costs with avoided repair.",
      "failureBehavior": "Missing pieces leave bonuses dark. Destructive actions intentionally refuse without the selected safety conditions; old unmodified loadouts remain unaffected.",
      "findings": []
    },
    {
      "workOrderId": "WO-095",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Deferred workshop proof demonstrates the compiled set without advancing it ahead of the work-platform exit. NoOp leaves combined behavior and inspection unproven.",
      "systemTraps": "Policy resistance: one scenario tests bonus interactions. Commons: deterministic fakes bound resource cost. Drift: complete Decisions and the old oracle remain equal. Escalation: no graphical authoring is added. Success to the successful: the existing scenario remains supported. Intervenor burden: visible bonuses aid inspection. Rule beating: rendered hashes alone are supplemented by behavior. Wrong goal: tester evidence for the authored composition.",
      "removalBalance": "Unknown: the legacy line makes no quantified removal claim.",
      "failureBehavior": "The prior scenario remains unchanged. Return cancels the bounded cadence, and destructive authority stays refused rather than inferred from the full set.",
      "findings": []
    },
    {
      "workOrderId": "WO-088",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Deferred documentation consistency for the operator command surface. NoOp retains multiple hand-maintained phrase tables; cost is unmeasured.",
      "systemTraps": "Policy resistance: one emitted table prevents divergent instructions. Commons: repeated edits become generation. Drift: stale copies are detectable. Escalation: no new phrase or workflow is introduced. Success to the successful: consumers share the same command source. Intervenor burden: reduces command-spelling diagnosis. Rule beating: byte equality cannot certify command usability. Wrong goal: accessible ordinary operation.",
      "removalBalance": "Manual duplication is removed in the objective, but a larger cost removal is not established by the legacy line.",
      "failureBehavior": "Stale-copy validation refuses its check. The command implementation remains the source of truth, and existing phrases do not change.",
      "findings": []
    },
    {
      "workOrderId": "WO-089",
      "verdict": "aligned",
      "criticalPathAndNoOp": "Deferred capability-truth maintenance. NoOp retains duplicate addenda and the missing verification row; costs are unmeasured.",
      "systemTraps": "Policy resistance: one row per capability reconciles updates. Commons: less repeated history reading. Drift: promotions require cited passing evidence. Escalation: no new capability work is added. Success to the successful: old levels are not automatically promoted. Intervenor burden: reduces reconstruction of current status. Rule beating: table consolidation cannot create evidence. Wrong goal: truthful product understanding.",
      "removalBalance": "Unknown: the legacy Cost line does not price the one-time consolidation or subsequent reading savings.",
      "failureBehavior": "Unsupported levels stay where they were, and historical assessments remain preserved. Failure to substantiate promotion does not erase prior evidence.",
      "findings": []
    }
  ],
  "planVerdict": "aligned-with-findings",
  "holdReasons": []
}
```

## Addressed holds

```json
[]
```

## Dispositions carried from earlier receipts

```json
[]
```

Only evidence-backed misalignment holds. Criterion-text-bound dispositions in the planning control log settle findings without another judgment; known issues name reopening observations. This receipt and all historical receipts remain immutable.

Receipt hash: `sha256:8c91b507887f194b1daee07a790fef04f81bf8e466b685f7dc2f55645aba5254`.
