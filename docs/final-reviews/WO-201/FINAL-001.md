# WO-201 FINAL-001 — final review

**Verdict:** pass. WO-201 makes an exported kit run core's gates on the runtime it carries: inside an export that holds no package TypeScript, `npm test`, `npm run test:docs` and `npm test -- --review` exit 0, each starting with `kit-verify`, a manifest verification of every carried compiled file, in place of the build; 27 suite rows run and 45 are declared `core-only` with the input the kit lacks, printed by name on every selection; `launchpad verify` exists as a command form; the kit carries the compiled tests and the fixtures they read, manifest-listed and byte-identical to a rebuild; and the client README states which suites run in a fork, where an instance's orders and reports live, and what editing a kit file means. All seven criteria hold at the integrated subject, which keeps every judged byte of the subject VER-002 passed. The verification sequence is VER-001 (fail, one blocking finding and one follow-up), the repair ([D014](../../evidence/WO-201/decisions.md#wo-201-d014--correct-the-exclusion-using-clean-execution-evidence), [D015](../../evidence/WO-201/decisions.md#wo-201-d015--refuse-an-unavailable-explicit-suite-request-before-recording-evidence)) and VER-002 (pass, no new finding). This review found no new defect ([D019](../../evidence/WO-201/decisions.md#wo-201-d019--final-review-pass-final-001-at-the-integrated-subject-the-task-growth-watch-returned-to-planning-the-allocated-rows-disposed)). The order's launchpad task watch fired, and its two register rows are returned to planning.

**Subject:** [`docs/work-orders/WO-201-export-runs-core-suites.md`](../../work-orders/WO-201-export-runs-core-suites.md) on branch `wo-201`, uncommitted over `main` at `69f830ba2495d94b663c623c318291bb44351570`. `git ls-remote origin`, `origin/main` and local `main` all name that commit, origin lists no `wo-201` branch, and the branch carries no commit of its own, so integration merged nothing ([D018](../../evidence/WO-201/decisions.md#wo-201-d018)).

- The gate code identity is `77dc3935cfebec2380d7464234649c0e639778f286ce4ade9af02b6fe501df9d`, the identity VER-002 judged and the executor's repair review row covers. `gateCodeIdentity` returned it after integration. This review edited no code byte.
- The recorded `reportHash` of VER-001 (`sha256:c5b9ac30…`) and VER-002 (`sha256:c4b8e5ca…`) each equals the report's current SHA-256.
- The order differs from `main` only in its heading's version label, `(v0.77.0)`, assigned at activation ([D003](../../evidence/WO-201/decisions.md#wo-201-d003)). The seven criteria are the original text; no amendment, waiver or correction is recorded.
- No ideation receipt exists for this order: `docs/evidence/WO-201/` holds no `ideation.md`. The nomination provenance is the operator's direction of 2026-10-11, item (a) of the three-repository route dispatch (captured verbatim in ignored intake, SHA-256 `d570ff00…`), synthesized by the [2026-10-11 route planning pass](../../planning/three-repository-route-2026-10-11.md) and judged in planning receipt 044 with three known issues; all are judged under Known issues below.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.296","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version`, and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends xhigh for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at the handoff reading. Every claim the verdict rests on was run in this session or read at the verifiers' reports, whose own exports reproduced the executor's fixture twice.

**Process cost:** entry 92703 tokens; handoff 3180492 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 0eb52679-9216-40a7-8c16-5e06667a2e49`.

- Entry was observed at 2026-10-12T08:27:08.384Z after 2 steps and 1 command.
- Handoff was observed at 08:40:37.640Z after 61 steps and 60 commands, after the integration, the affected checks, the bounded fixture run, the decisions and the register batch, and before this report, `npm run format` and the two gates. It counts 2,851,303 cached input, 277,846 cache-write, 484 uncached input and 50,859 output tokens. These are cumulative transcript totals, almost all cached input, so they do not measure live context. Reasoning tokens and dollar cost are unavailable. Final counters after the result transition are in the ignored receipts and the response.
- Wall clock from entry to the handoff reading was about 13.5 minutes, 72 s of it the bounded fixture run.
- Tradeoff: the fresh product gate was not rerun. No judged code byte changed since the executor's passing review row and VER-002, the order names `npm test -- --review` at final review, and the handoff sequence runs it, where it composes the passing tasks at that identity. In its place this review paid for its own bounded run of the fixture's two WO-201 cases and the extended rebuild case (72 s), which exports a kit and runs the three selections inside it. VER-001's and VER-002's reruns of the declared rows with the declarations removed (42 and 43 rows, 566 s and 428 s) were read at their reports rather than repeated: the repair changed no declared row's input after VER-001, and VER-002 judged this exact subject.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-201/FINAL-001.md`.

Read in full: the order with its known issues and carry-ins; VER-001 and VER-002; this order's D001 to D017 and the integration stub; `handoff.md`, `self-review.md`, `meta.json`, `gate-in-kit.json` (parsed), `suite-inventory.json` (parsed) and `core-gates.json` (head); the control log `docs/control/orders/WO-201.jsonl`; the executor's `PR.md` stub (meter only); product 07 §Verification review and attack, §Independent workflows and integration, §Discipline and §Model-specific notes; product 08 §PRs and commits and §Release-note edition; the four reader profiles and their balanced examples; product 03 §Platform and instance boundary's kit paragraphs; the route planning document §7; planning receipt 044's WO-201 judgment; WO-074 D007 and D011 and WO-075 D011, the decisions the carry-ins come from; WO-200's and WO-078's final reviews, PR bodies, release notes and integration decisions as the form of the previous reviews.

Reviewed: the complete implementation diff against `main`: `scripts/test-runner.mjs` (the `isKitRoot` predicate, `buildSuite`, the 45 `kit` declarations and the validator that refuses a malformed one, the `kit-verify` first step and lane predecessors in `scheduleSuites`, the kit block of `runGateChecks` with its not-carried lines, the `--only` refusal and the selection, the `kit-verify` reuse exclusion and the diagnostic forwarding), `scripts/launchpad.mjs` (`RUNTIME_TEST_OUTPUT`, `TEST_FIXTURE_TREES`, `TEST_SUPPORT_FILES`, `KIT_FILES.excluded` and its filter in `readKitSources`, `readRuntime` over both outputs, `kitPath`, `verifyKit` and the `verify` CLI form), `scripts/lib/document-gate-stubs.mjs` (one registration), `scripts/test-runner.test.mjs` (the kit list case, the `--only` refusal case and the schedule case), `scripts/test-launchpad.mjs` (the `KIT_FILES`-driven verbatim comparison, the rebuild case over `dist/test`, the criterion 4 case and the three-selection case with its diagnostic) and `scripts/kit/README.client.md` (the rewritten §What runs here, the kit-file list, the "Your orders live here" and true-fork paragraphs and the terms sentence); the write-backs to product 03, `docs/LEGAL.md`, the capability table, the root README's release line, both publication locks and the order's heading; the regenerated indexes by their diff stats. Cross-checked against the diff: the exported suites table (72 rows, 45 declared, 27 undeclared, every declaration matching `/^core-only: \S/`, every declaration's name and reason present as a row of the README table, which has 45 rows), the runner's own `--list` at this worktree (`build` present, no `kit:` line), and the inventory's 45 core-only rows, each carrying clean exclusion evidence.

Lenses, and why:

- Correctness and tests: the order's central claims are which suites run in a kit and why the rest do not, and VER-001 found one of those claims false.
- Operator flow: an instance operator reads the README's three lists and the table, runs the three gates and asks for one suite with `--only`.
- Authority and private data: `kit-verify` is the instance's integrity check on carried code, and the kit must carry no core history.
- Release surfaces and the register: final review is acceptance, this order ships a minor release with no component change, and it carries two allocated rows and a watch that fired.

Integration: `npm run worktree -- integrate WO-201 --intake-backup <session scratch>/DotLn-wo201-intake-20261012T083220Z.zip` took the backup from a fresh `npm run backup:intake` of the three ignored intake files, fetched `main` equal to the base, checkpointed the work (`refs/dotln/checkpoint/WO-201/10`), retained its named stash `66618bf3…`, re-applied the work without an authored conflict and regenerated projections only. D018 records the carried-forward claims. The seven affected checks and preflights all pass on the integrated tree (Executed checks). No component version collides: local tags and origin both end at v0.76.1, which names the base commit, neither lists v0.77.0, `check-surfaces --local` reports no bump required for any of the six workspaces, and `package.json`, `package-lock.json` and `packages/*/package.json` are not in the diff. No evidence edition is registered to this order.

Disclosure: instruments under review also recorded this work. `scripts/test-runner.mjs`, which this order changes, produced the executor's review row this review consumes and the two `--list` readings above, and inside the fixture export it is the kit's own runner that recorded the three gate rows this review's probe reports; `scripts/launchpad.mjs`, which this order changes, is the `verify` form under judgment. Each was also judged directly: the core listing was read from the runner at this worktree, the kit's selections were compared to the imported table and the README text by this review's own script, and the refusal and advisory paths were observed in the fixture's assertions and in VER-001's and VER-002's direct `verify` runs.

## Known issues and the ideation receipt

- **Receipt 044, criterion 1 (known issue, the nested gate wall-clock):** occurred. The `launchpad` task read 409,254 ms in the implementation-ready review gate and 328,008 ms in the repair's passing review gate, above twice the 49,691 ms thirty-day median (99,382 ms) and twice the pre-order 123,776 ms reading (247,552 ms). [D011](../../evidence/WO-201/decisions.md#wo-201-d011--retain-the-three-selections-and-record-the-full-tasks-cost) and [D017](../../evidence/WO-201/decisions.md#wo-201-d017--record-the-repaired-subject-and-complete-review-evidence) record the contributors: the three-selection case 191,260 ms and the existing update case 74,466 ms under three concurrent peers; the focused case alone 67.6 s to 74.5 s; the kit grown from 9,793,574 to 15,971,669 manifest-listed bytes. All three selections are retained, as the order's carry-in required. The order asked for the cause recorded and no selection dropped, which is done; the bound the receipt asks for across WO-202, WO-203, WO-207, WO-208 and WO-209 is planning's, so this review returns FUP-b531e850b70f6d4e and FUP-e96221b106cd136a to open (Register below). Not a finding.
- **Receipt 044, criterion 2 (known issue, rule beating):** occurred at VER-001's subject and not at this one. VER-001's F1 was exactly this: `publication-fixtures` declared `core-only` while every input it reads is carried. D014 removed the declaration and recorded the rule, declare no row core-only without a clean export failure on its named input, and VER-002 reran the remaining 43 declared rows with their declarations removed and found each failing on its named input. VER-002's observation stands: the fixture independently binds only two portable rows (`publication-fixtures`, `beacon-portability`), so a future false declaration rests on that rule and on verification, not on the gate. D013 declined the roughly fifteen-minute every-row inventory inside the gate for the cost it would add to the watched task. That remains the receipt's reopening condition and stays with planning.
- **Receipt 044, criterion 5 (known issue, two masters):** did not occur. The §7 sentences name no suite, so the drafted text and the observed lists cannot conflict; D005's narrowing of the true-fork paragraph is judged under criterion 5.
- **FUP-8fb7ae17dd0fad5b (WO-074 D007):** allocated here; its reopening condition occurred by the operator's direction. The gap closes: the three selections run in a source-free export. Settled (Register).
- **FUP-e624167a7f6555f6 (WO-074 D011):** allocated here and decided by [D004](../../evidence/WO-201/decisions.md#wo-201-d004--keep-the-role-qualification-oracle-with-its-core-report): the WO-138 oracle is excluded from `KIT_FILES` and `local-runner-double` is declared, because the suite reads the core WO-052 verification report. Both verifications confirm the fixture absent from the export and the row failing only on that path. Settled (Register).
- **The README sentences that ride here:** landed, as judged under criterion 5.
- **Depends on:** WO-075, WO-077 and WO-078, each closed and typed `satisfied-by-close`; status reports all three met. No queued order.
- **Operator-review assumptions:** 1 (the compiled tests travel under the runtime's terms) is written into `docs/LEGAL.md`'s kit-runtime entry; 2 (a suite needing a core document stays core's and the README names it) is the 45-row table.

## Earlier findings

- **VER-001 F1 (blocking; criteria 2 and 5): repaired.** `publication-fixtures` carries no declaration; it runs fresh in the kit's `npm test` (958 ms in the recorded row) and is reused in review at the kit's unchanged identity. The README's product and review lists include it and the table no longer names it. The inventory, capability table, handoff and decision figures read 27 carried and 45 declared. VER-002 reproduced the repair in its own export; this review's probe shows the row in the product selection's 15 required suites.
- **VER-001 F2 (follow-up; taken into the repair as D015 with the operator's confirmation): repaired.** In a kit, `--only <declared row>` throws `Suite <name> is not carried in this kit (core-only: <reason>)` before any task or gate result, with `--list` as well. VER-002 probed eight requests through plain, document, review, `--list` and the direct runner; this review's probe shows `publication` and `runner-fixtures` exiting 1 with the gate index unchanged. The core `--only` path is untouched: the refusal sits inside the `isKitRoot(repo)` branch.
- **The executor's two implementation workers:** the criteria adversary's one finding (byte growth missing from the decisions) was fixed as D010 and re-measured as [D016](../../evidence/WO-201/decisions.md#wo-201-d016--refresh-export-measurements-without-dropping-coverage); the improver found none. Neither executed suites; the repair spawned no workers and `handoff.md` carries `self-review: found 0; fixed 0; recorded 0` with the separate-pass fallback named.

## Criterion judgments

**Criterion 1:** met

- This review's bounded run of the fixture's three-selection case inside a fresh source-free export (08:33:19Z to 08:34:32Z, exit 0): `npm test` exit 0 in 40,235 ms wall (15 required suites, all fresh), `npm run test:docs` exit 0 in 12,003 ms (11 suites), `npm test -- --review` exit 0 in 9,581 ms (22 suites, 13 composed from the kit's own passing product row at its unchanged identity, `kit-verify` fresh). The first task of each is `kit-verify`; the case asserts no `PROGRESS [build]` line and no `scripts/build.mjs` in any output.
- Refusal: after a one-byte change to `packages/kernel/dist/test/ac1-purity.test.js`, `npm test` exits 1 naming the path, and `kit-verify` is the only executed case of the failed row. VER-002 refused the review and document gates on a `dist/src` skeleton file and a compiler `dist/test` file; VER-001 refused the plain gate on `packages/compiler/dist/src/index.js`.
- Durations are recorded in [`gate-in-kit.json`](../../evidence/WO-201/gate-in-kit.json): 42,362, 14,565 and 10,501 ms wall and 74,490 ms for the case, with the three gate rows' identities, required suites and cases.

**Criterion 2:** met

- The imported table has 72 rows: 45 with `kit: "core-only: <reason>"` and 27 without. This review's probe prints exactly 45 not-carried lines on each of the three `--list` runs and the three gate runs, byte-equal to the recorded list; the carried union of the three gates is exactly the 27 undeclared rows, with `kit-verify` in place of `build`. The fixture asserts both equalities, and separately that `publication-fixtures` and `beacon-portability` run in the product selections.
- Every declaration is founded: VER-001 reran 42 declared rows with the declarations removed and VER-002 reran 43, each failing on its named uncarried input; `skeleton` and `harness-fixtures` rest on VER-001's clean rerun with their inputs unchanged. The inventory cites that evidence on each of its 45 core-only rows.
- `--list` shows the same set, and a declared row cannot be requested by name (Earlier findings, F2).

**Criterion 3:** met

- The extended WO-075 criterion 1 case passed in this review's run (913 ms): every `dist/src` and `dist/test` file under the three runtime packages is manifest-listed, byte-identical to the fixture clone's rebuild at the commit, and the kit holds no package TypeScript and no `tsconfig.json`; VER-002 counted 454 compiled files, 184 of them tests, with none unlisted.
- The kit lists 863 files at 15,971,669 bytes in this review's export, the figures D016 records: +6,178,095 bytes over the pre-order export of 605 files and 9,793,574 bytes; 259 added files at 6,150,768 bytes, the excluded WO-138 oracle at 3,947 bytes, a net file-set growth of 6,146,821 bytes.
- The excluded `scripts/fixtures/wo138-local-role-qualification.json` is absent, asserted by the WO-074 criterion 1 case. VER-002's 3-byte difference between its export and the fixture's is a recorded limit; no byte figure binds the criterion.

**Criterion 4:** met

- `launchpad verify [<dir>]` is in the CLI's usage string and `verifyKit` is exported. This review's run of the criterion 4 case: the fresh export verifies (`kit: 863 files verified at <commit>`), with an explicit directory from another working directory, and with a `DOTLN_LAUNCHPAD` override pointing elsewhere; a one-byte change to a kernel `dist/src` file and to a kernel `dist/test` file each refuse with exit 1 naming the path; an edited `scripts/bootstrap.mjs` gives exactly one `kit: 1 kit files differ from the manifest` line and exit 0.
- VER-001's fourteen variations (a deleted `dist` file, a symlink to identical bytes, a script edit combined with a `dist` edit, two edited and one deleted script, extra arguments) and VER-002's seven (a `.d.ts` declaration, three simultaneous non-`dist` differences, the advisory forwarded as `[kit-verify] kit: 1 kit files differ…` through a passing gate) are read at their reports and are consistent with the fixture's three cases.

**Criterion 5:** met

- §What runs here, and what does not: the three lists equal the observed selections, in order; the fixture asserts each `- \`<command>\`: …` line against the gate row's `requiredSuites` and each of the 45 table rows against the table's declaration. The `--only` refusal is documented.
- §Kit files and instance files carries the §7 "Your orders live here" paragraph verbatim plus one sentence that planning inside a fresh kit is pending WO-202.
- §Taking upstream updates carries the true-fork paragraph as [D005](../../evidence/WO-201/decisions.md#wo-201-d005--preserve-the-readmes-intent-without-claiming-pending-behavior) narrowed it: the update preview is WO-203's, a `dist` edit refuses rather than advises, and an instance file at a new kit path is refused as the existing text already says. Both verifications checked those claims against `planUpdate`; this review adopts their judgment that landing the draft verbatim would publish claims the subject contradicts, which is adaptation within the criterion.
- The template travels manifest-listed under `scripts/`, and the WO-074 criterion 1 case re-hashes it.

**Criterion 6:** met

- Product 03 §Platform and instance boundary replaces the cited sentence in place with what runs in a kit and the `--only` refusal; no dated paragraph. `npm run publication:check` reports both editions current (29 and 45 linked sections) and 254 of 254 headings indexed.
- `docs/LEGAL.md` §Current state's kit-runtime entry carries the compiled tests under the same terms, in place.
- The capability table's `launchpad.starter` reassessment sits under the dated heading step 8 directs, cites the recorded passing gate rows and the 27/45 counts. This review replaced its clause that independent re-verification and final review remain pending with the sequence's outcome, a status sentence in a surface the order declared, not a behavioral edit; publication:check passes after it.
- The decisions file records FUP-e624167a7f6555f6's decision (D004) and the repair's correction (D014, typed `correction`). Both publication locks are refreshed.

**Criterion 7:** met

- Product gate, consumed and not rerun fresh: the canonical `npm test` row at the current code identity records `gateSelection` `review`, `executionMode` `fresh`, exit 0, 32 required suites and 84 fresh tasks, 1,206,139 ms, recorded 2026-10-12T07:20:34.115Z; `launchpad` and `runner-fixtures` are among its suites. Four `npm run test:docs` rows at the same identity exit 0 (35 of 35). This review's handoff-sequence gates are in Executed checks.
- `git diff --check` is clean before and after integration; `npm run format:check` passes.
- `package.json`, `package-lock.json` and `packages/*/package.json` are not in the diff; no new dependency. No lint or type suppression directive appears in the diff.

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

None. Beyond rereading the diff and the write-backs, this review ran the fixture's two WO-201 cases and the extended rebuild case in its own bounded process at the integrated tree, compared the exported kit's observed selections and byte figures with the recorded evidence (equal), checked the runner table, the README table and the inventory against one another, confirmed core's own listing unchanged, verified both report hashes, and ran the publication, harness, release-surface, whitespace, format, lineage and lock checks before and after integration. The one open risk, that the gate binds only two portable rows independently of the declaration table, is planning receipt 044's criterion-2 condition and is recorded above; it breaks no criterion and no behavior `main` had, and a reviewer writes no behavioral fix.

## Register

`npm run plan -- followups --touching` matched 23 pending rows at revision `6da66097…` by textual match, read over three pages. `npm run meta` after D018 and D019 left that revision unchanged, since neither decision mints a row. One `followups --apply` batch of six requests moved the register to `681e1ca0…`.

| Row | Disposition | Why |
| --- | --- | --- |
| FUP-8fb7ae17dd0fad5b (WO-074 D007) | settled | Allocated here. The three selections run in a source-free export with `kit-verify` in place of the build, 27 rows carried and 45 declared by name with their reason, and the README rewritten from the observed lists; reproduced by VER-001, VER-002 and this review. |
| FUP-e624167a7f6555f6 (WO-074 D011) | settled | Allocated here and decided by D004: the oracle is excluded, its suite declared, the exclusion asserted by the fixture and named in the README. |
| FUP-b531e850b70f6d4e (the launchpad task watch) | open | Allocated here; its condition occurred (Known issues, receipt 044 criterion 1). D011 and D017 record the contributors and all three selections are retained. Planning owns a bound or a structural cut. |
| FUP-e96221b106cd136a (cold-gate structural cuts) | open | Its launchpad reopening condition occurred at this order's handoff; the thirty-day rule and the decision between a bound, a structural cut and a fixture-cost order stay with planning. |
| FUP-8ea5ac7538fe92d8 (D013's repair rule) | settled | Discharged by D014 and D015 and reproduced by VER-002 and this review. |
| FUP-0cff4c27b1874d9d (D009, reopened by D013) | settled | The remaining 45 declarations each rest on a clean export failure on the named input, cited per row in the inventory. |

The other 17 matched rows are textual matches whose seams this change did not open and whose conditions did not occur, as [D012](../../evidence/WO-201/decisions.md#wo-201-d012--judge-the-matching-follow-ups-without-widening-the-order) read them at handoff; this review reread each. FUP-06de60fa5d19fe5a, FUP-0c10689747f83675, FUP-369525016cc270e1 and FUP-b28b870422a74166 match `docs/LEGAL.md` for operator identity or gate-identity inputs this order does not change; the legal edit is covered by the always-fresh document gate. FUP-5094b24d6d68d2e4, FUP-d0a9719cc2e4ec55, FUP-de6162b279f66709, FUP-e821aa2ced3aa111, FUP-e8f5399db33d0b5a and FUP-f5f10101e717d59b name `scripts/test-runner.mjs` or its fixture for consumers the kit selection does not touch; FUP-642d7a4beaed2272's format-preflight case did not recur, `runner-fixtures` passing in the executor's row. FUP-cc27c2c1a82fed2c names `scripts/test-launchpad.mjs` for release-close and export conditions not observed in this order's exports. FUP-fb8cbeabbddef397 names the document gate's cost: the four recorded document gates at this identity ran 98.4 s to 113.6 s, under its 180 s condition, with `resume` at 82.8 s under its 120 s. FUP-441469088613e52a, FUP-adf6621e7f958dd8 and FUP-fd05316b6030ef73 match product 03 or the README's release line; FUP-4b70089b028849f0 matches the register itself; FUP-9b0632b0ec72d168 and FUP-acfe4bfda716d8fb match generated projections.

## Observations (not findings)

- `verify`'s trust root is the manifest: a manifest whose hash is rewritten to match an edited `dist` file passes, and an unlisted file added under `dist/src` passes and is loaded by no carried selection (VER-001, outside criterion 4's three cases). Run from a subdirectory, the default root is the working directory and the error names the manifest there; the README documents the root invocation.
- Every kit invocation, `--only <carried row>` included, prints the 45 not-carried lines before its own output; the README says so.
- The README's three observed lists are hard-coded text bound to the gate rows by the fixture, so a changed selection fails the launchpad task until the README follows; that is the coupling the order asked for.
- The regenerated `docs/work-orders/HISTORY.md` marks WO-200 released at v0.76.1: a sibling's publication, bookkeeping under product 07 §Independent workflows and integration.
- `npm run meta` reports reopening candidate WO-150-D003 (executor cold start 28,112 bytes against 24,576), the same value WO-200's and WO-076's reviews reported; not a WO-201 observation.

## Release surfaces

`PR.md` carries the reviewed body above the meter the integration regenerated, written under product 08 §PRs and commits and the `prBody` profile: the resulting behavior first and why it matters, how kit mode and `verify` work, what the kit now carries, the limits a reviewer acts on with their decisions and register rows, and the validation with links relative to the body file. `RELEASE-NOTES.md` has the five sections of product 08 §Release-note edition, one physical line per prose paragraph. The proposed title, a headline with a gitmoji shortcode sized by the change against the whole merged series: `:white_check_mark: An exported kit runs core's three gates on its carried runtime, verifying the compiled files by manifest instead of building`.

## Executed checks

Probes and checks ran under `node scripts/harness.mjs bounded`, one process at a time, at code identity `77dc3935…`; the worktree was only read until the writes this report names. Times are 2026-10-12 UTC.

| Check | Window | Exit | Result |
| --- | --- | --- | --- |
| `node scripts/harness.mjs usage` at entry | 08:27:08 | 0 | 92,703 tokens, 0 subagents |
| Report hashes; `gateCodeIdentity`; canonical gate rows at that identity | before integration | 0 | VER-001 and VER-002 equal their recorded hashes; `77dc3935…`; one review `npm test` row (exit 0, 32 suites, 07:20:34Z) and four document rows (exit 0) |
| `node scripts/test-runner.mjs --list` at this worktree; imported table against the README table and the inventory | before integration | 0 | `build` present, 0 `kit:` lines; 72 rows, 45 declared, 27 undeclared, 45 README rows, 0 missing; inventory 27/45 with clean evidence on each exclusion |
| `git diff --check`; dependency manifests; suppression grep | before integration | 0 | clean; `package.json`, lockfile and workspace manifests unchanged; no directive in the diff |
| `npm run backup:intake`; `npm run worktree -- integrate WO-201 --intake-backup …` | 08:32:20–08:32:24 | 0 | 3 intake files archived; no-op merge; checkpoint `refs/dotln/checkpoint/WO-201/10`; stash `66618bf3…` retained; D018 |
| `gateCodeIdentity` after integration; `git diff --stat main -- .claude .agents .codex` | after integrate | 0 | `77dc3935…`; empty |
| Bounded `npm run publication:check`; `node scripts/harness.mjs check`; `npm run release -- check-surfaces --local`; `git diff --check`; `npm run format:check`; `node scripts/lineage.mjs index --check`; `node scripts/check-publication.mjs --print-locks` | 08:32:57–08:33:06 | 0 each | 254/254 headings, both editions CURRENT; 34 surfaces; release block v0.77.0 over v0.76.1, six components unchanged; clean; formatted; lineage index current; locks equal the committed values |
| Bounded `node --test --test-name-pattern='WO-201\|WO-075 criterion 1' scripts/test-launchpad.mjs` | 08:33:19–08:34:32 | 0 | 3 tests, 3 pass, 72.3 s; three selections exit 0 at 40,235, 12,003 and 9,581 ms wall; 45 not carried, 27 carried, lists equal to the recorded evidence; two unavailable requests exit 1 with no gate row; refusal on `packages/kernel/dist/test/ac1-purity.test.js`; 863 files, 15,971,669 bytes |
| `npm run meta`; bounded `npm run publication:check` after the capability-table edit | 08:38–08:39 | 0 | decisions index and register regenerated at revision `6da66097…`; 254/254, both editions CURRENT |
| `npm run plan -- followups --apply` (six dispositions) | 08:40:38 | 0 | register `6da66097…` to `681e1ca0…` |
| `node scripts/harness.mjs usage` at handoff | 08:40:37 | 0 | 3,180,492 tokens, 0 subagents |
| `npm run format`; `npm run test:docs` (first run) | 08:47:30–08:48:06 | 0; 1 | every script unchanged, the new reports and decisions formatted; the document gate stopped at the `release-surfaces` preflight: the reviewed-notes rule refuses an angle-bracket placeholder even inside inline code (`RELEASE-NOTES.md` line 7), 17 passed, 18 refused as preflight-dependent, recorded 2026-10-12T08:48:06.774Z |
| Placeholders rewritten as words in `RELEASE-NOTES.md` and `PR.md`; `npm run release -- check-surfaces --local`; `npm run format` | 08:49:00–08:49:37 | 0 | no angle bracket remains; every surface line PASS; identity `77dc3935…` unchanged |
| `npm run test:docs` | 08:49:37–08:51:17 | 0 | 35 passed, 0 failed, 98.67 s, 35 fresh tasks; recorded 2026-10-12T08:51:17.285Z at code identity `77dc3935…`; the result transition's inline run at the filed bytes follows this table's last edit |
| `npm test -- --review` | 08:51:17–08:51:24 | 0 | 32 passed, 0 failed, 6.29 s, 1 fresh task (`format`), 31 tasks reused from the executor's 2026-10-12T07:20:34.115Z row at the same identity; recorded 2026-10-12T08:51:24.693Z, `executionMode` `composed` |

The handoff usage reading precedes the four gate rows that follow it in the table; the gates ran after this report's first draft, and their rows were added afterwards, as reports may be completed after a passing gate without changing the code identity.

Repository writes: this report, `PR.md` and `RELEASE-NOTES.md`; D018's completion and D019; the capability-table clause; six register dispositions; and the regenerated projections, indexes, locks and meter the integration and `npm run meta` produced. No implementation source was edited. The check and probe logs stayed in the session scratch; the register request file was written to the ignored `.runtime/` path and removed after the apply.

Goal alignment:

- Traps: deferring to a passing re-verification instead of rereading the diff and running the fixture; treating the fired task-growth watch as either a finding or as settled by the order's record; taking VER-002's two-portable-row observation as a reviewer's repair; sizing the PR title by the previous title.
- NoOp: failing would send a subject with every criterion met through repair, verification and a twenty-minute gate, and would leave every instance unable to pass its own gate.
- Outcome: matched. The criteria were judged from this review's own run and the two verifiers' exports at the same identity, no new defect was found, the two allocated rows were settled by what the change did, the two watch rows were returned to planning with the measured cause, and the reviewed work is preserved for the commit series.
