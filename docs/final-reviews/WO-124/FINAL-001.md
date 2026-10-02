# WO-124 — FINAL-001

**Verdict:** pass. All six criteria are met against the original order on the integrated tree. `main` had moved from the executor's base `aa770898` (`v0.63.0`) to `a3da7127` (WO-179 as `v0.63.1`), so I integrated it. Every WO-124 source, test, fixture and product file is byte-identical to the subject VER-001 judged, and main changed none of them. The authority evidence edition was re-minted on the integrated source as WO-124 revision 003, and `v0.64.0` stays the target ([D013](../../evidence/WO-124/decisions.md#wo-124-d013)). A fresh `npm test -- --review` passed on the integrated tree. My own probes beyond the fixtures found three derivation behaviors that are consumer decisions, not failures. I boarded them for WO-123's planning as `FUP-ae5eaf150be2b1da`, and deferred the two register rows whose condition this order met ([D014](../../evidence/WO-124/decisions.md#wo-124-d014--final-review-passes-and-boards-three-derivation-seams-outside-the-fixtures)). I also removed the operator's home path from two of this order's public transcripts ([D015](../../evidence/WO-124/decisions.md#wo-124-d015--final-review-removes-the-operators-home-path-from-two-public-transcripts)).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.287","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 84655 tokens; handoff 19580472 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-124 and allocated this path. The actor values are this session's:
- Claude Code 2.1.287, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Cost scope is this dispatch, read with `node scripts/harness.mjs usage beb7e838-eb02-4895-9c1f-bc99e805434a`. The entry sample was observed at 2026-10-02T00:15:22.984Z and the handoff sample at 2026-10-02T00:35:41.161Z (127 steps, 117 commands), before this report was filed. Both are cumulative transcript counters. 19,284,143 of the handoff total is cached input. Reasoning tokens and dollar cost were unavailable. Fan-out plan: no subagents out of the 20 available. The harness observed 0 admissions, and this session was the only writer. The one product gate on the integrated tree took 423 s of the dispatch.

## Subject and evidence

Verified subject: the uncommitted worktree over base `aa770898e00d7367255405fcc248fa119adc8037`, at code identity `8d517f6535939d36f5f60a93a2cdf9bfce66143440914f05ad06df25a69e2eb4` (checkpoint `refs/dotln/checkpoint/WO-124/2`; the final-review request is checkpoint `/5`). Integrated subject: the same work over `a3da7127b0c52c110e3f48e34cbfe0e3cd1a2570`, at code identity `c9d73883c4bcc72cf7370a8bd00ea4897f0b0dbeb2e07d84a1e31b082668bcfe` (preservation checkpoint `/6`).

The numbered verification sequence is complete: [VER-001](../../verifications/WO-124/VER-001.md) passed all six criteria with no finding. It ran its own probes for an inferred path missing from the index, case-insensitive nouns, the `src/parser-other` directory-prefix trap and `../`. It also recorded and corrected its own redundant gate rerun, which recorded no check. There is no repair or second verification.

No ideation breakout receipt applies. The evidence folder holds none, and `docs/intake/` holds only tracked `.gitkeep` files. The nomination provenance is the 2026-09-08 external review and the 2026-09-28 planning document §10, both cited by the order. The order's text changed only in its title, where the version placeholder became `v0.64.0`. No scope expansion, waiver, withdrawal, lifecycle correction or override is recorded. `npm run plan -- check` exits 0.

I read:
- the order and its cited sources: the WO-061 story-contract module and order, WO-073's order, `verification-worktree.ts` (`prepareWorktreeVerification` and `assertWorktreeSnapshot`), `scripts/lib/evidence-sources.mjs`, product 02's snapshot bounds, products 03 §Ports and 06 §Application version pending — Source-to-deliverable vertical, and product 07 §Goal-aligned decisions and §Independent workflows and integration;
- the handoff, `implementation.md`, D001–D012, the verification report and the control log;
- the full diff: `deriveSurfaces`, its decoders and rule patterns in `story-contract.ts`, the new `snapshot-index.ts`, both new tests, the fixture and its generator, the two product sentences, the version labels and pins, the evidence editions and selector, the regenerated harness bundle, the console fixtures, and the generated index, register and decisions rows.

The implementation matches the Design. `deriveSurfaces` is pure over its inputs: it decodes the profile, the index and its options before use and reads only active requirement statements. A named path or directory resolves only to files the index holds; anything else stays a `not-in-snapshot` candidate. A noun from the profile maps to its directories under the exported `SURFACE_RULE_PATTERNS`. Inferences must name an active requirement, a repository path and a rationale, and they keep an `inferred` origin. Each surface keeps every distinct origin in canonical order. Tests are the profile commands whose directories hold a surface, copied byte for byte. The gate is `confidence < threshold`, with the threshold defaulting to 1, and a `null` index hands off naming `SURFACE_SNAPSHOT_BOUND`. `readSnapshotIndex` checks the seal with WO-054's `assertWorktreeSnapshot` before and after reading. It then compares each mounted file with the sealed contents and returns the decoded index. It neither writes nor widens the snapshot.

Code quality: the derivation adds 448 lines to the existing module, with small named decoders and one exported rule table. The tests pin exact outputs rather than counts. Observations from my probes on the integrated build, none of them a failure of a declared criterion:
- A backticked command (`` `npm test` ``) and prose `and/or` become `not-in-snapshot` candidates. They are noise in the candidate list but never surfaces.
- `./src/parser/read.ts` stays a candidate and the contract hands off. So does the plural `parsers` against the noun `parser`. Both are conservative.
- Three behaviors reach outside the fixtures and are boarded (D014, `FUP-ae5eaf150be2b1da`): a caller threshold of 0 returns `DerivedSurfaces` with no surfaces; an inferred entry alone counts as coverage; and prose `parser-other` matches the noun `parser`. The first two follow the order's literal Design, and the third follows the declared rule. Criterion 1 names cases outside its fixtures as follow-ups, not failures.

Clean-room screen: I searched the staged diff against `main` for user paths, temporary directories, account addresses, URLs, token and key shapes and private keys. Two of this order's public transcripts held the operator's absolute home path in stack and interrupt lines: one line in `compiler-tests-initial.txt` and 21 in `test-review-stopped.txt`. I replaced that prefix with `<worktree>/` and changed nothing else. The raw copies stay in the ignored local lane. 78 older tracked records hold the same form, many of them immutable reports, and `FUP-af65972e5491da22` nominates them for a planning decision at low priority ([D015](../../evidence/WO-124/decisions.md#wo-124-d015--final-review-removes-the-operators-home-path-from-two-public-transcripts)). Nothing else matched. No employer material, credential or secret is present, and no lint or type suppression was added.

## Integration

Recorded in [D013](../../evidence/WO-124/decisions.md#wo-124-d013). `npm run worktree -- integrate WO-124` checkpointed the work (`/6`), kept the named stash `304f8a47`, fast-forwarded the uncommitted branch to `a3da7127` and applied the stash.
- **Authored conflicts:** four, all bookkeeping.
  - `packages/skeleton/package.json`, `packages/console/package.json` and `package-lock.json`: main's skeleton patch 0.49.2 against this order's minor 0.50.0. I kept 0.50.0. It is still the next minor above 0.49.2, main does not use it, and it carries the new `readSnapshotIndex` export.
  - `docs/evidence/current.json`: main selected WO-179 authority revision 002, and this order WO-124 revision 002.
- After `--continue`, the helper regenerated the bundle and manifest, the control projection, release preparation, the decisions index, register and meta, the work-order index, the publication locks and the console fixtures.
- **Evidence editions:** `authority-evidence.mjs --check` failed on WO-124/002 because WO-179 changed the role skill hashes. I re-minted authority as WO-124 revision 003 and selected it, and `--check` exits 0. Revisions 001 and 002 are unchanged. Artifact identity, verification and feedback stay on WO-124 revision 002, and their `--check` scripts pass on the integrated tree. The feedback carry still names the retained live audit, so no live episode is owed.
- **Versions:** release preparation keeps `v0.64.0`, the next minor above `v0.63.1`, under the unchanged minor classification. Compiler 0.24.0 and skeleton 0.50.0 do not collide with main. The console's own version stays 0.4.0 and pins both. Harness runtime 0.34.2 comes from main, and this order does not change it.
- **Carried-forward claims:** the diff of the staged tree against `refs/dotln/checkpoint/WO-124/2` is empty over `packages/compiler/src`, `packages/compiler/test`, `packages/compiler/fixtures`, both snapshot-index files, `verification-worktree.ts`, products 03 and 06, `evidence-sources.mjs` and the fixture generator. Main changed none of those paths between the two bases. VER-001's judgments therefore carry forward on unchanged inputs. Criteria 1–3 and 5 were checked again on the integrated tree, and criterion 6's gate ran there.

## Criteria

**Criterion 1:** met. On the integrated build, the five WO-124 compiler tests pass, and `node docs/evidence/WO-124/fixtures.mjs --check` reproduces all eleven derivations (37,302 bytes).
- `explicit` pins one `rule`/`named-path` origin on `src/parser/read.ts`, and `architecture` pins `rule`/`architecture` origins on both parser files.
- `inferred` labels `src/shared/cache.ts` with the fixture's rationale.
- `src/missing.ts` stays a candidate in `missing-path`, `partial` and `covered-with-candidate`.
- `missing-path` hands off at confidence 0. `partial` hands off at 0.5 under the default threshold, and `partial-at-half` returns `DerivedSurfaces` at a threshold of 0.5.

**Criterion 2:** met.
- The union test pins exactly `node --test test/parser.test.mjs` and `npm run check` for the parser surfaces. It excludes the `src/parser-other` command, and returns a command with spaces and quoting byte-identical.
- Every fixture case serializes identically on a repeat run and with profile, index and inference order reversed. The inputs are unchanged after the run, and the output is frozen.
- Malformed profiles, indexes, thresholds and inferences refuse with their field paths, sparse slots included. The test passes on the integrated build.

**Criterion 3:** met. The snapshot test passes on the integrated build. It reports all four files of a snapshot produced by `prepareWorktreeVerification`, each with its path, UTF-8 size and SHA-256. The result equals an independently computed index; `unicode.txt` is pinned at 3 bytes and its digest, and drift refuses. `verification-worktree.ts` is unchanged against both bases.

**Criterion 4:** met.
- **Product 03:** +232 bytes (174,319 → 174,551) in §Ports, directly after the ImpactMap/cartographer sentence. The limit is 300.
- **Product 06:** +56 bytes (73,545 → 73,601) inside the `RepoProfile + ImpactMap` step of the pipeline sentence, in §Application version pending — Source-to-deliverable vertical. The limit is 150.
- Both changes are in place, with no dated paragraph, and the document gate checks both ceilings.
- D001–D015 and their index rows are present.
- `npm run publication:check` passes with both tables of contents current. The integration regenerated their locks.

**Criterion 5:** met.
- `story-contract.ts` is registered in `scripts/lib/evidence-sources.mjs`, which D001 and D004 record.
- Every edition the Cost line names is re-minted or carried: authority as WO-124 revision 003 on the integrated source (D013, after revisions 001 and 002, D004 and D009); artifact identity and verification as WO-124 revision 002; and feedback carried into WO-124 feedback-002.
- The console pins compiler 0.24.0 and skeleton 0.50.0. Its fixture diff against `main` touches only `manifest.json` and the three `selfhost` expected outputs, and `console-fixtures.mjs --check` matches all five cases.
- `node scripts/harness.mjs check` exits 0 on 32 generated surfaces.

**Criterion 6:** met.
- `npm test -- --review` on the integrated tree: 35 passed, 0 failed, 80 fresh tasks, 423.47 s, recorded 2026-10-02T00:33:20.047Z at code identity `c9d73883c4bcc72cf7370a8bd00ea4897f0b0dbeb2e07d84a1e31b082668bcfe` (`host-gate:c9d73883…:npm test`). `coveringGateCheck` returns it for the current 35-suite review selection, which includes the compiler, skeleton, console and five evidence suites.
- `npm run test:docs`: 24 passed, 0 failed, 43.84 s, with this report, PR.md, RELEASE-NOTES.md and D013–D015 in place. The result transition runs it again inline.
- `git diff --check` and `git diff --cached --check` are clean.
- The package changes are compiler 0.23.0 → 0.24.0, skeleton 0.49.2 → 0.50.0 and the pins of them. No dependency was added.

## Register

`npm run plan -- followups --touching` listed eleven pending rows before this review's own records were added. D014 records the dispositions.

| Rows | Disposition | Reason |
| --- | --- | --- |
| FUP-2534f4dc631f5ebc | deferred | WO-061-D011's four compile seams named "the next order that edits `story-contract.ts`", and this order edited it. WO-124 left `compileStoryContract` and `revise` unchanged (a non-goal, D011), and WO-062 does not edit the module. It reopens at the planning pass before WO-062 or WO-123 activates, or at the next edit to the compile or revision code. |
| FUP-aa6dbe9c5ad79995 | deferred | WO-061-D010's `follows` choice had the same trigger and stays unchanged. It reopens on the same conditions, or at the next edit to the `follows` rule. |
| FUP-ae5eaf150be2b1da | new, untriaged | This review's three derivation seams, for the planner before WO-123 activates (D014). |
| FUP-af65972e5491da22 | new, untriaged | 78 older tracked records that hold the operator's absolute home path, nominated at low priority (D015). |
| FUP-57ecd19a26362b1c, FUP-a8ff3066b5663629 | left untriaged | WO-123's review-context and baseline/waiver duties. They name WO-124 only as an input (D011). |
| FUP-adf6621e7f958dd8 | left deferred | Its numeric condition did not occur. With this order's three authority revisions staged, repeated `authority.json` blobs are 7,330,686 of 165,396,921 tracked `docs/evidence` bytes (4.43%), against a 10% threshold. |
| The other 6 | left | Textual matches only, on this order's decisions and meta, the control projection, product 03 and the README files. |

## Executed checks

- Integration: `npm run worktree -- integrate WO-124`, then `--continue` after resolving the four conflicts.
- Evidence editions: `authority-evidence.mjs --check` failed on WO-124/002 (role skill hashes). `--write --edition WO-124 --revision 003` was followed by `--check`, which exits 0. `artifact-identity-evidence.mjs`, `verification-evidence.mjs` and `feedback-evidence.mjs --check` exit 0.
- `npm run build`; `node --test` on the WO-124 compiler test (5 pass) and the snapshot test (1 pass); `fixtures.mjs --check` (11 derivations, 37,302 bytes). My seven probes are recorded in D014.
- `node scripts/console-fixtures.mjs --check`: all five cases match.
- `node scripts/harness.mjs check`: exit 0, 32 generated surfaces.
- `npm run publication:check`: pass, both tables of contents current.
- `npm run release -- check-surfaces --local`: exit 0.
- `npm run meta`, `npm run meta -- --check` and `npm run plan -- check`: exit 0. `followups --apply` recorded the two deferrals.
- `npm test -- --review`: 35 passed, 0 failed, 80 fresh tasks, 423.47 s, recorded 2026-10-02T00:33:20.047Z at code identity `c9d73883c4bcc72cf7370a8bd00ea4897f0b0dbeb2e07d84a1e31b082668bcfe` (`host-gate:c9d73883…:npm test`). `coveringGateCheck` returns it for the current 35-suite review selection, which includes the compiler, skeleton, console and five evidence suites.
- `npm run test:docs`: 24 passed, 0 failed, 43.84 s, with this report, PR.md, RELEASE-NOTES.md and D013–D015 in place. The result transition runs it again inline.
- `git diff --check` and `git diff --cached --check`: clean.

## Judgment and publication

D014 compares this pass with the mission, the eight system traps, Naive Interventionism and NoOp. Against the promised benefit, the observed outcome is:
- An order's surfaces and tests can now be derived from its contract, a typed profile and a sealed snapshot index. Every entry carries its origin, and an uncovered requirement or a missing snapshot hands off instead of guessing. This is the input WO-123 and WO-118 were waiting on.
- The cost is 448 lines added to the compiler module and a 41-line skeleton reader. It also adds three authority, two artifact-identity and verification and two feedback edition copies, one integrated product gate, and 288 bytes across two product documents.

Not yet observed: how often real issues hand off at the default threshold, and whether rule-origin surfaces are correct on a real repository. D014 ties its reopening to WO-123's first composed run.

Result route: `final-review-result pass`.
