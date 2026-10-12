# WO-076 FINAL-001 — final review

**Verdict:** pass. WO-076 gives an instance its own build: `harness emit` reads the JSON overlay the configuration's `build.overlay` names and composes it over the kit's Contributor build, replacing the identity, equipping or unequipping the existing support switches, narrowing the envelope, adding `operator` or `host-policy` grants whose provenance the manifest records, or declaring `build: none` so only the hand-written floor remains; ungranted widening refuses with `AUTHORITY WIDENING`, a malformed or unreadable overlay refuses by path before any write, and with no overlay the emitted content is unchanged. All six criteria hold at the integrated subject, which keeps every judged byte of the subject VER-001 passed. The verification sequence is one passing verification, which boarded three follow-ups that stay boarded ([D007](../../evidence/WO-076/decisions.md#wo-076-d007), [D008](../../evidence/WO-076/decisions.md#wo-076-d008), [D009](../../evidence/WO-076/decisions.md#wo-076-d009)). This review found one new defect, F1, a follow-up that breaks no criterion and no behavior `main` had: the `build: none` manifest reads as `runtime-unavailable` to the control plane's runtime reader, so such an instance is advised to bootstrap on every command and cannot finish a worktree or prepare a release ([D011](../../evidence/WO-076/decisions.md#wo-076-d011), FUP-9d397b57910ae6ed).

**Subject:** [`docs/work-orders/WO-076-instance-build-overlay.md`](../../work-orders/WO-076-instance-build-overlay.md) on branch `wo-076`, uncommitted over `main` at `ffff74e12a4075592192b77818d629ad549f49f8`. `git ls-remote origin refs/heads/main`, `origin/main` and local `main` all name that commit, and origin lists no `wo-076` branch, so integration merged nothing ([D010](../../evidence/WO-076/decisions.md#wo-076-d010)).

- The gate code identity is `d43b5afa42bb68116270fdf7f9a4366f0df823da6e7474341e93bc0a23a54321`, the identity VER-001 judged and the executor's review row covers. `gateCandidates` returned it after integration. This review edited no code byte.
- The recorded `reportHash` of VER-001 (`sha256:e612d96b…`) equals the report's current SHA-256.
- The order differs from `main` only in its heading's version label, `(v0.76.0)`, assigned at activation ([D005](../../evidence/WO-076/decisions.md#wo-076-d005)). The six criteria are the original text.
- No ideation receipt exists for this order: `docs/evidence/WO-076/` holds no `ideation.md`. The nomination provenance is WO-033's item cut into this order at the operator's 2026-09-08 correction, the 2026-09-28 planning document §10, the 2026-10-07 pass that wrote the execution plan, planning receipt 044 (2026-10-11) with one criterion-2 known issue, and the 2026-10-11 standard pass that allocated FUP-44639ec9a751d8d1; all are judged under Known issues below.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.296","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version`, and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at handoff. This session ran every probe and check the verdict rests on, so no worker was needed.

**Process cost:** entry 145991 tokens; handoff 7229821 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 1af5f198-6869-4e42-8887-872d5f8b8cdc`.

- Entry was observed at 2026-10-12T02:00:24.377Z after 3 steps.
- Handoff was observed at 02:30:30.579Z after 102 steps and 101 commands, after the document and review gates. It counts 6,797,399 cached input, 328,637 cache-write, 1,092 uncached input and 102,693 output tokens. These are cumulative transcript totals, almost all cached input, so they do not measure live context. The sample predates the confirming document gate at the filed bytes, the result transition, the commit series and the publish; the response reports the later counter.
- Reasoning tokens and dollar cost are unavailable.
- Tradeoff: the fresh product gate was not rerun. The code identity is unchanged from the executor's passing review row and VER-001, and the order names `npm test -- --review` at final review, which this review ran: it reused the passing tasks at that identity and ran `format` fresh. A fresh gate would have added no evidence about paths this review did not already exercise through the fixtures, the probe and the executor's row.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-076/FINAL-001.md`.

Read in full: the order, with its known issues and carry-ins; VER-001 and its probe transcript, README and copy script; this order's D001 to D009; `handoff.md`, `self-review.md`, `gates.json`, `meta.json`, `fixture-transcript.txt` and `no-overlay-compatibility.json`; the executor's `PR.md` draft (a meter block only); product 07 §Verification review and attack and §Independent workflows and integration; product 08 §PRs and commits and §Release-note edition; the five reader profiles and their balanced examples; receipt 044's WO-076 judgment; WO-072's FINAL-001, PR body, release notes and D009 and D010 as the form of the previous final review.

Reviewed: the complete implementation diff against `main`: `scripts/lib/harness.mjs` (the decoder, the reader, the composition in `harnessInstallation`, the broadened `walkOwned`, `emitHarness` and `checkHarness` under `build: none`), `scripts/harness.mjs` (overlay read and the `mkdir` moved after decoding), `packages/skeleton/src/loadouts/contributor.ts` (`overlayContributor`, the identity facet, the matcher filter, `contributorSupportIds`), `packages/compiler/src/harness.ts` and `artifact-identity.ts`, the six WO-076 fixtures and the integration fixture's source copy, the write-backs to the kit README, ADR-0006, product 10 and the publication locks, the package manifests and lockfile, the regenerated bundle, manifest and console fixtures, and the four evidence editions by their generation and check evidence. Cross-checked against the diff: `validateBuild` and `findLaunchpad` in `scripts/lib/config.mjs`, `containedRegularFile` in `scripts/lib/paths.mjs`, `harnessRuntimeCause` and its consumers in `scripts/lib/harness-runtime.mjs`, `scripts/resume.mjs`, `scripts/refute-plan.mjs`, `scripts/worktree.mjs` and `scripts/release.mjs`, the manifest readers in `scripts/build.mjs`, `scripts/lib/harness-prune.mjs` and `packages/skeleton/src/harness-host.ts`, and the exported support ids against the README's list.

Lenses, and why:

- Correctness and tests: a parser and a composition whose fixtures hold the real envelope constant.
- Authority: the overlay can grant effects and must not widen without provenance.
- Operator flow: a fork edits this file by hand, and an instance that selects `build: none` still runs the control plane afterwards.
- Release surfaces: final review is acceptance, and this order ships a minor release with a compiler and skeleton bump.

Integration: `npm run worktree -- integrate WO-076` fetched `main` equal to the base, checkpointed the work, retained its named stash, re-applied it without an authored conflict and regenerated projections only. D010 records the carried-forward claims and the affected checks, all of which pass. No component version collides: local tags end at v0.75.0, origin lists v0.75.0 and no v0.76.0, and the compiler and skeleton are private workspace packages.

Disclosure: instruments under review also recorded this work. `harness emit` and `harness check` are the subject, and the integration helper regenerated the bundle with them; the bundle is unchanged and check passes with 34 surfaces. `node scripts/harness.mjs evidence`, run once without flags at 02:14:41Z to look at the gate state, instead ran the evidence command: it refreshed owned projections, recorded a `git diff --check` row and reported the executor's passing review row; the integration regenerated those projections after it, and it appended no lifecycle event.

## Known issues and the ideation receipt

- **Receipt 044, criterion 2 (known issue):** `build: none` emits only the hand-written floor, and the subject does not say that floor states that no compiled refusal, hook or verification governs the instance. Its reopening condition occurred: VER-001 observed exactly this on the real core floor and boarded it as F1 (D007, FUP-d72bf62d3c82ca3f). This review confirms the observation on its own scratch copy (the floor alone remains, with the five `Read[role]` directives) and leaves the board as planning's, beside FUP-44639ec9a751d8d1.
- **2026-10-11 standard pass, FUP-44639ec9a751d8d1 allocated here:** emit the Start here directives from the compiled bundle. The executor left it ([D003](../../evidence/WO-076/decisions.md#wo-076-d003)) because the move changes the no-overlay instruction bytes criterion 4 preserves; the order permits recording the carry-in as left. The register row is deferred at source revision 4.
- **2026-10-07 corrections (line counts, product 10 headroom, the harness edition as the inventory check):** the executor re-measured at its base (D001 evidence: 337, 858 and 1,389 lines) and ran the inventory check inside the review row.
- **Blocked on WO-074 and WO-075:** both are closed and merged; the client README template and the kit export exist at the base.

## Criterion judgments

**Criterion 1:** met

- This review's bounded run of the six WO-076 fixtures (02:09:27.638Z to 02:09:32.157Z, exit 0) passed the narrowing case: the diagnostic records `resourceLimits.writers` 1 to 0 and `requiredEvidence` gaining `instance-check`, every other envelope field unchanged, the thirty changed installed paths, the derived differences (semantic and target hashes, file hashes, overlay path and SHA-256) and `unrelatedChanges: []`; the assertions compare every merged and per-profile file and the whole manifest after only those substitutions.
- VER-001 varied the narrowed fields on the real bundle (`remote.push` denied, `expiresAt` lowered, a revocation event type added) and found only those lines, the semantic hash and the manifest's overlay entry changed.

**Criterion 2:** met

- The identity case passed in this review's run: the replacement identity's text reaches the bundle, neither unequipped support's id or text remains, and the newly equipped switch's text appears; a changed identity moves both the target hash and the overlay digest.
- The `build: none` case passed: a block-only floor refuses without mutation, the emit leaves the floor and an empty manifest, `check` passes with the runtime snapshot removed, residue inside the block is reported and re-emitted away, and deselecting the overlay restores the build. This review's probe on a scratch copy of the subject with the real core floor (02:14:04Z to 02:14:05Z) emitted 2 surfaces, passed `check`, and left only `.claude/harness-manifest.json` and `CLAUDE.md` under the owned roots. VER-001 reproduced the same on the real corpus and deselected the overlay byte for byte.
- F1 below and VER-001's F1 (D007) concern what the floor and the control plane do after that emit, outside the criterion's clause.

**Criterion 3:** met

- The widening case passed in this review's run: `allowedEffects` naming `network.request` refuses with `AUTHORITY WIDENING`, exit 1, bundle unchanged and no `--out` directory; with an `operator` or `host-policy` grant the emit and check pass, every profile's manifest records the grant with its `grantedBy`, the enforced envelope allows the granted effect, and the permission facet keeps the envelope hook with an empty matcher list.
- VER-001 refused four ungranted routes (a kit-denied effect, an absent effect, a raised writer limit, a new resource above zero) and three grant shapes (a duplicate id, a wildcard denial over a granted effect, `grantedBy: "agent"`).

**Criterion 4:** met

- The refusal case passed in this review's run: a missing, non-JSON, unknown-key and wrong-type overlay each exit 1 with `invalid build overlay in build/overlay.json`, name the key or condition, create no output directory and leave the bundle unchanged; the closed-schema case refuses nine nested shapes.
- With no overlay declared, the no-overlay case re-emits the fixture bytes unchanged, and VER-001's copy emit at the same runtime is byte-identical to the worktree. Against `main` only the compiler release identity differs, as the Cost line foresaw for a compiler source change ([D004](../../evidence/WO-076/decisions.md#wo-076-d004)); the live manifest has no `overlay` key, and `node scripts/harness.mjs check` passes with 34 surfaces before and after integration. VER-001's twelve further refusal variants are outside the declared set and hold as well.

**Criterion 5:** met

- `scripts/kit/README.client.md` opens, before `## First steps`, with the Contributor build as starter content and the overlay as the owner of the fork's build, an example, the schema and the refusals; its ten support switch ids equal `contributorSupportIds` as exported by the built skeleton. ADR-0006 §Amendments has one dated bullet in the section's form. Product 10 §Separate version axes lists the overlay schema axis in place with no dated paragraph. [D001](../../evidence/WO-076/decisions.md#wo-076-d001) records that WO-069-D001 does not reopen. The publication locks changed and `npm run publication:check` reports both editions `CURRENT` (29 and 45 linked sections) after integration; the decisions index and register are current after `npm run meta`.

**Criterion 6:** met

- `docs/evidence/current.json` names WO-076 revision 001 for authority, artifact-identity, verification and feedback, and the four directories exist; the harness inventory passed inside the executor's review row. `npm test -- --review`: the executor's row at code identity `d43b5afa…` passed 41 suites with 93 fresh tasks in 1,535.0 s (2026-10-12T01:20:31.460Z, exit 0); this review's run at the same identity (02:30:16.460Z) reused those tasks, ran `format` fresh and passed 41 of 41 in 8.39 s. `npm run test:docs` passed 35 of 35 in 134.04 s at this report (02:29:57.139Z), and a confirming run at the filed bytes precedes the result transition. `git diff --check` is clean before and after integration. The package diffs move only the compiler, skeleton and console versions and pins, and the lockfile changes only those five lines; no dependency was added and no suppression directive appears.

## Findings

<!-- dotln-findings:start -->
[
  {"id": "F1", "route": "follow-up", "class": "escape", "summary": "The build: none manifest's empty profile list reads as runtime-unavailable to the control plane's runtime reader, so an instance that selects build: none is advised to bootstrap on every resume and plan command and worktree finish, settle and release preparation refuse after a rebuild"}
]
<!-- dotln-findings:end -->

**F1 — the `build: none` manifest reads as `runtime-unavailable` (follow-up, escape).**

- Reproduction, under `node scripts/harness.mjs bounded` in a scratch copy of the subject made by VER-001's `mkcopy.sh` (02:14:04.039Z to 02:14:05.775Z, exit 0): with `dotln.config.json` selecting `build/overlay.json` and the overlay `{"version":1,"build":"none"}`, `harness emit` exits 0 with 2 generated surfaces and `harness check` exits 0; the manifest holds `build: "none"`, `profiles: []`, `installed: []` and the overlay's path and SHA-256. `harnessRuntimeCause(copy)` returns `runtime-unavailable`. `refreshHarnessRuntime(copy, build)` runs the build callback once and throws `Built runtime still runtime-unavailable; checkout preserved; run node scripts/bootstrap.mjs`. `node scripts/resume.mjs status` exits 0 and prints `DotLn advisory: runtime-unavailable; run node scripts/bootstrap.mjs to prepare this worktree; host permissions decide.` on stderr. The same copy re-emitted with no overlay reads `null` and prints no advisory, as this worktree does.
- Cause: `scripts/lib/harness-runtime.mjs` `harnessRuntimeCause` returns `runtime-unavailable` for a manifest whose `profiles` is not a non-empty array and reads no `build` key; the rule predates this order, when an empty list could only mean a broken installation. Its consumers are `scripts/resume.mjs` line 1166 and `scripts/refute-plan.mjs` line 348 (an advisory on every command), `scripts/worktree.mjs` line 944 (`refreshHarnessRuntime` at `finish` and `settle`, which throws) and `scripts/release.mjs` `ensureReleaseRuntime` (called by release preparation and the non-dry-run close), which by its code rebuilds and then refuses; the release path was not run in the copy, which holds no release record.
- Route: follow-up. Criterion 2 asks for the floor alone with `harness check` passing, and both hold on the fixture, on VER-001's real corpus and on this review's copy; `main` had no `build: none`.
- Class: escape. The defect was present in VER-001's subject at the same code identity. Product 07 §Verification review and attack instructs the real corpus instead of a fixture for every criterion, and VER-001 named the operator-flow lens; its `buildNone` probe ran `emit` and `check` and no lifecycle, worktree or release command. The surface list does not decide the class: the manifest shape is the subject's, and running the instance after the emit is criterion 2's attack under that lens.
- Boarded: [D011](../../evidence/WO-076/decisions.md#wo-076-d011), FUP-9d397b57910ae6ed, with the rule a repair must hold: a manifest that declares `build: none` has no runtime to pin, so the reader returns `null` for it and no command advises, rebuilds or refuses on its account, while a manifest with no `build` key and an empty profile list keeps reading `runtime-unavailable`.
- Not fixed here: a reviewer never writes a behavioral fix and certifies it, and the edit would change the code identity and lose the passing product gate.

## Register

`npm run plan -- followups --touching` matched 20 pending rows at revision `7d8123c6…` by textual match before this review's decisions, 5 rows for the order's own identifier at `39b1dec8…` after `npm run meta` minted FUP-9d397b57910ae6ed. This review read every matched row. One `followups --apply` request moved the register to `ca15d4ec…`.

| Row | Disposition | Why |
| --- | --- | --- |
| FUP-e835d826e9af5417 (WO-187-D042) | deferred again | Its condition "an order edits the verifier loadout" occurred by its letter: the order edits `packages/skeleton/src/loadouts/contributor.ts`, but only the overlay composition and the identity facet; the verifier role text is unchanged and its emitted skill differs only by hashes (VER-001's F2 reproduction). The remaining sentence is role text a reviewer may not write at final review; the reopening condition now names the verifier role text. |

The other rows are textual matches whose seams this change did not open and whose conditions did not occur: FUP-1315c82ef74fb832 and FUP-f5f10101e717d59b name `scripts/resume.mjs` and `runHarnessEvidenceChecks`, which the order does not edit; FUP-cb922b59e013dbf1 names the runtime snapshot's hand-listed files, which changed under their own pins and loaded no stale module; FUP-5e52eb500e395237 and FUP-3f9d788f4d8c89ac name gate-reuse and handoff-ledger behavior this order does not touch; FUP-adf6621e7f958dd8 asks for a copy count the one new authority revision does not approach; FUP-67a07b670440cf5a asks whether a findings block records unmeasured, and this block is one well-formed array; FUP-16a4af39c710459b waits on the operator; FUP-8cfd3ff52146a016, FUP-d4493f4251e69c87, FUP-ec72b2ea596bdc75, FUP-acfe4bfda716d8fb, FUP-9b0632b0ec72d168, FUP-fd05316b6030ef73 and FUP-4b70089b028849f0 match generated projections, the test file or the README's release line. FUP-44639ec9a751d8d1 carries the executor's D003 disposition. FUP-d72bf62d3c82ca3f, FUP-d5d0ef5cf034102e, FUP-620f25409f65f4aa (VER-001) and FUP-9d397b57910ae6ed (this review) are this order's own boards and stay for planning.

## Observations (not findings)

- `emit --profile` now removes every previously installed file the selected profile does not own, including another profile's settings file, because `walkOwned` no longer limits itself to `.codex/` and `.claude/agents/`; a full emit restores every file, and no committed manifest ever listed a path outside the allowed surfaces (VER-001). `main` left a settings file whose hooks it had removed, so this is the more coherent state.
- `decodeBuildOverlay` runs twice per emit, in `readBuildOverlay` and again in `harnessInstallation` on the same bytes; the second run guards programmatic callers and costs nothing observable.
- `readBuildOverlay` resolves the overlay from `findLaunchpad()` while the floor and output use `harnessRoot(cwd)`; the two agree because the CLI refuses to run outside its root.
- `overlayContributor` holds the widening ceiling and the narrowing rules in one function of about 130 lines with one rule per envelope field; a new field needs a matching rule there, which the README's schema list and D002 document.
- `npm run meta` reports reopening candidate WO-150-D003 (executor cold start 28,112 bytes against 24,576). The same size is in this order's activation snapshot and in WO-072's final review, so it is not a WO-076 finding.

## Release surfaces

`PR.md` carries the reviewed body above the meter the integration regenerated, written under product 08 §PRs and commits and the `prBody` profile: the resulting behavior first, then how an overlay composes, the limits a reviewer acts on with their decisions and register rows, and the validation with links relative to the body file. `RELEASE-NOTES.md` has the five sections of product 08 §Release-note edition, one physical line per prose paragraph. The proposed title is a headline with a gitmoji shortcode, sized by the change against the whole merged series and not by the previous title.

## Executed checks

Probes ran under `node scripts/harness.mjs bounded`, at code identity `d43b5afa…`, in disposable fixtures or a scratch copy under the session's DotLn scratch directory; the worktree was only read until the writes this report names.

| Check | Window (2026-10-12, UTC) | Exit | Result |
| --- | --- | --- | --- |
| `node scripts/harness.mjs usage` at entry | 02:00:24 | 0 | 145,991 tokens, 0 subagents |
| `git diff --check`, `npm run format:check` | before integration | 0 | clean; Prettier clean |
| `node scripts/harness.mjs check` | before and after integration | 0 | 34 generated surfaces; live manifest has no `overlay` key |
| Bounded `node --test --test-name-pattern=WO-076 scripts/test-harness.mjs` | 02:09:27–02:09:32 | 0 | 6 passed, 0 failed, 4.5 s |
| `npm run publication:check` | before and after integration | 0 | both editions `CURRENT`; bootstrap checks pass |
| `npm run release -- check-surfaces --local` | before and after integration | 0 | 57 passing lines, no failure |
| Bounded `build: none` probe on a scratch copy (F1) | 02:14:04–02:14:05 | 0 | emit 2 surfaces, check pass; cause `runtime-unavailable`; refresh throws; advisory on `resume status`; default copy reads `null` |
| `node scripts/harness.mjs evidence` (no flags, see Disclosure) | 02:14:41 | 0 | reported the executor's passing review row; `git diff --check` row recorded |
| `npm run worktree -- integrate WO-076` | 02:14–02:15 | 0 | no-op merge; checkpoint `refs/dotln/checkpoint/WO-076/6`; stash `50ae7bf5…` retained; D010 |
| `gateCandidates` for `npm test` and `npm run test:docs` | after integration | 0 | identity `d43b5afa…`; one passing review row |
| `npm run meta` | before 02:23:27 | 0 | FUP-9d397b57910ae6ed minted; register `39b1dec8…` |
| `npm run plan -- followups --apply` (one re-deferral) | 02:23:27 | 0 | register `ca15d4ec…` |
| `npm run format`, then `npm run test:docs` | 02:27:43–02:29:57 | 0 | 35 passed, 0 failed, 134.04 s, 35 fresh tasks; a confirming run at the filed bytes follows this table's last edit and D011's closing paragraph records it |
| `npm test -- --review` | 02:30:08–02:30:16 | 0 | 41 passed, 0 failed, 8.39 s, 1 fresh task (`format`), 92 tasks reused from the executor's 01:20:31 row at the same identity |

Repository writes: this report, `PR.md` and `RELEASE-NOTES.md`; D010's completion and D011; one register disposition; and the regenerated decisions index, register, meta and projections. No implementation source was edited. The probe script and the scratch copy stayed in the session scratch directory; the register request file was written to the ignored `.runtime/` path and removed after the apply.

Goal alignment:

- Traps: deferring to a passing verification instead of reading the diff and running the instance after the new state; widening F1 into a repair the reviewer writes; classing F1 by the surface list rather than by verification's scope; treating the register's one fired condition as noise.
- NoOp: failing would send a pre-existing reader rule through repair, verification and a 25-minute gate with every criterion already met, and would leave the kit without the overlay that WO-077 and WO-118 build on.
- Outcome: matched. The criteria were judged from the fixtures, VER-001's real-corpus probes and this review's own probe at the subject, F1 is reproduced and boarded with its repair rule, the fired register row is re-disposed by name, and the reviewed work is preserved for the commit series.
