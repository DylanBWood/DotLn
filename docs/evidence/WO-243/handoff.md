# WO-243 repair handoff

The executor's judgment of each acceptance criterion, with its evidence, for
`npm run resume -- repair-complete` on 2026-11-07, after VER-001.

This repair addresses VER-001 F1: criterion 3's comparison-base census, D006,
omitted `changedAgainstMain` in `scripts/lib/planning-followups.mjs`, a reader
of the branch's merge base with main. The finding's class is an incomplete
census, so the repair states the rule the census holds and checks every site
against it. [D017](decisions.md#wo-243-d017--the-comparison-base-census-completed-under-a-stated-rule)
completes D006, which stays as written, under that rule. A reader is a runtime
function in `scripts/` or `packages/` that reads the activation checkpoint, the
integrate helper's receipt or the branch's fork point from main, listed with
the runtime callers of the exported readers the check follows. D017's eight
rows add the quoted reader with its two callers and seven readers the report
did not quote: `resolveBase` in `scripts/resident-bind.mjs`, `publishUpdate`
in `scripts/launchpad.mjs`, worktree publish's `origin/main...HEAD` diff,
`contributionSignoffRules` in `scripts/lib/contributions.mjs`, `regenerate`
in the integrate helper, the selection's own callers, and the gate runner's
call of `classifyDocumentFailures`. The classes outside the census are stated
beside them. [`census-check.mjs`](census-check.mjs) holds the rule: every
matching site needs a disposition whose row the census names. The repair
changes no product source, so the code identity and its passing complete row
stand. The outcome matches the repair's aim; NoOp would have left criterion 3
unmet.

**Criterion 1:** met. The repair changes no product source (`git diff --stat 8370344c 7ab95fab -- packages scripts` is empty; code identity `67d6258cb8e3d0a9b99a1c18882f88edc576d8a449c7d2289949ea33c465ddbc` unchanged), so the execution's evidence stands. The closeout matrix in `scripts/test-target-worktree-start.mjs` runs each case through the three readers as a session runs them: `npm run resume -- briefing`, `worktree integrate` and the advisory completion records. They name the same checks for a target-only order and a target order whose launchpad changes are documents and records (the target gate with `--review` and the document gate), for an integration that only adopted main's kit change (the same two, no complete run), and for a local machinery edit and a resolved machinery conflict (the complete run added). A launchpad order agrees across its briefing, owed list and completion advisory in the case "target briefings name a missing repository …", whose repair-complete advisory matches its repair briefing. Both cases pass in the complete run `host-gate:67d6258cb8e3d0a9b99a1c18882f88edc576d8a449c7d2289949ea33c465ddbc:npm test`, suite `target-worktree`; VER-001 judged this criterion met on its own probes.

**Criterion 2:** met. Unchanged by the repair. The same matrix selects the complete run with the uncertainty named in its reason for an unreadable registration, a missing activation base, an unclassifiable path and a runner that imports without a suite table. The selection runs no gate, supplies no row and never throws; completion adds one advisory and no refusal (D003, D012 to D014). VER-001's nineteen independent fixture checks agree.

**Criterion 3:** met. The paired control in `controls.json` is unchanged: the base arm exits 1 and requests the complete run for the target-only order, the candidate arm exits 0 without it, and both arms name it for the mixed order. D009 records the measured closeout cost before and after. D006 with D017 enumerates every reader of the comparison bases with its kept or moved semantics. [`census-check.json`](census-check.json) records both arms at code identity `67d6258c`: with D006 alone the check exits 1 and names 18 omitted reader keys and 2 unstated classes; with D006 and D017 it exits 0, with 57 reader keys over 100 sites disposed and 30 ancestry predicates. The round-three worker found no omitted reader ([D018](decisions.md#wo-243-d018--the-repairs-review-round-three-alone-its-notes-disposed)). VER-001's reproduction, `verification-census.mjs`, reads D006's section alone and still exits 1 (rerun 2026-11-07, `listedInD006: false`); the census it asks for is D006 and D017 together.

**Criterion 4:** met. Unchanged by the repair. Product 07 §Preflight before the full gate and §Independent workflows and integration, and `docs/KIT.md` §What runs here, and what does not, state the selection and its limits (D011, D014). The executor root's cold start is 44,563 bytes against its 29,246-byte ceiling (D008, `packages/skeleton/fixtures/wo243-role-baseline.json`, FUP-d91a2e2780a65b70). The staled authority edition is re-minted (WO-243 revision 003 selected). `npm run publication:check` passes at this tree (PASS publication bootstrap checks, 2026-11-07T16:21:40Z).

**Criterion 5:** met. `npm test -- --review` stands on the passing complete row at the unchanged code identity, `host-gate:67d6258cb8e3d0a9b99a1c18882f88edc576d8a449c7d2289949ea33c465ddbc:npm test` (review selection, 44 required suites, exit 0, recorded 2026-11-07T09:04:58Z); `requireGateClaims` consumes it with no advisories (read 2026-11-07T16:20:35Z). `npm run test:docs` runs once after this ledger, the last document edit, and completion consumes its row. `git diff --check` exits 0, and the new untracked files hold no trailing whitespace. No dependency is added: the repair changes no package or lockfile, and the execution moves only the `@dotln/skeleton` workspace version, to 0.87.1, with its console pin and lockfile entry.

self-review: found 5; fixed 4; recorded 1; rounds 1 (round three alone, one combined worker; the repair changes no product source); unreviewed 50 lines (D017's corrections, D018 and one comment in census-check.mjs, written after round three and judged by the executor)

## Review ladder of this repair

- Round three alone, one fresh combined `dotln-worker` over the repair's delta: tree `7ab95fab` against `8370344c`, the tree the fix dispatch's checkpoint recorded. Report: `docs/control/local/reviews/WO-243/repair-1/round-3-combined.md`. It admitted no finding and raised five notes. F2 to F5 corrected D017's own text: the caller rule, the start's own base, reads of `HEAD` by name and two row wordings. F1, that the check keys sites by function so a further read inside a keyed function passes it, is recorded, and D017 states the limit (D018).
- Rounds one and two were not run: the repair changes no product source, under the fifty changed source lines at which a repair starts at round three (D018).
- The worker ran the census check's two arms with the recorded results and read each of the 30 ancestry sites; it ran no gate.

## Checks this repair ran

- `node scripts/harness.mjs bounded -- node docs/evidence/WO-243/census-check.mjs`, with and without `--census D006`, recorded in `census-check.json`: control exit 1, candidate exit 0, last at 2026-11-07T16:39Z.
- `npm run meta`, `node scripts/meta.mjs --check` and `node scripts/lineage.mjs index --check` (PASS, 193 sections) after D017 and D018.
- A read of `requireGateClaims` for criterion 5 and `npm run publication:check`, as cited above.
- One probe error, corrected: the first read of the standing row imported `readControl` from `scripts/lib/control.mjs`, which does not export it, and threw before reading anything; the rerun imported it from `scripts/lib/control-store.mjs`. The probe stayed in session scratch and is not evidence.

## Execution's review ladder, before VER-001

The execution's ladder found 33, fixed 31 and recorded 2 over three rounds, with 7 lines judged by the executor after round three.

- Round 1, three fresh `dotln-worker` reviewers over tree `e124dd38` against base `e4fe2dae`: criteria 5 findings, design 10, consistency 8. 22 fixed; design F8, the hand-kept list of records the gates read, recorded in D013 with FUP-0560f7b8644b36f2. Reports: `docs/control/local/reviews/WO-243/round-1-criteria.md`, `round-1-design.md`, `round-1-consistency.md`.
- Round 2, each reviewer resumed over tree `9551026b`: every round-1 fix held except the recorded design F8; 8 new findings, fixed on a named basis (D014) apart from design F3, the affected line's Git-failure fallback, recorded with FUP-dcaad50cf7affa85. Reports: `round-2-criteria.md`, `round-2-design.md`, `round-2-consistency.md`.
- Round 3, one combined worker over the delta since `9551026b`, tree `969604c9`: no finding admitted; two notes fixed by the executor afterward. Report: `round-3-combined.md`.
- Residual notes recorded, not fixed: the target lost when a state object throws inside the selection, the hand-kept list of actions that load the runner, the unused re-export through `executor-readiness.mjs`, and the receipt union written in two modules. None changes a selection.

The execution's probes, one file at a time under `node scripts/harness.mjs bounded --`, ran `scripts/test-target-worktree-start.mjs` (34 of 34), `scripts/test-worktree-integration.mjs` (49 of 49), `packages/skeleton/dist/test/executor-supports.test.js` (8 of 8), `scripts/test-process-debt.mjs` (183 of 183), `scripts/test-runner.test.mjs` (189 of 189), `scripts/test-configuration-root.mjs` (31 of 31) and `bash scripts/test-resume.sh --fixtures-only`; the first resume probe's failure is the cause D012 records.

## Attestation and usage

- Actor of this repair: harness claude-code 2.1.319 (`claude --version`), model claude-opus-5-5, effort max as `CLAUDE_EFFORT` reads it (selected, not effective effort), source claude-session-readback. The order recommends xhigh for the executor.
- Workers: one `dotln-worker` launch and no re-task, one use against the cap of 20; the host's completion notice reports 0 h 12 min, 74 tool calls and 188,617 tokens for it.
- Usage at entry: 157,792 total tokens (claude-transcript-message-usage, dispatch scope, 2026-11-07T15:58:28Z). At this ledger: 26,404,719 total tokens, nearly all cached input reads (same source and scope, 2026-11-07T16:36:59Z); cost unavailable. Final counters stay in the ignored receipts and the response.
- Dispatch standing at this ledger: 0 h 39 min of 8 h 0 min; no complete run of 20.
- The execution's actor was the same harness, model and effort; it used seven worker uses and recorded 177,659,154 total tokens at its handoff.
- The earlier paused attempt of 2026-11-03 stays in `refs/dotln/checkpoint/WO-243/1` to `/3`, unadopted (D002).
