# WO-074 FINAL-001 — final review

**Verdict:** pass. `npm run launchpad -- export <dir>` materializes a launchpad instance from a manifest-listed kit read as Git blobs at the HEAD commit of the checkout that holds the running scripts, with instance seeds written once and never listed, the launchpad's local-terms list screening every exported text before any write, and no intake, local settings, Beacon, runtime store, TypeScript package source or evidence of this repository inside. All eight original criteria are met at the integrated subject. This review found no new defect: the findings block is empty, and the three follow-ups the executor boarded (D007, D010, D011) stay boarded with their reopening conditions.

**Subject:** [`docs/work-orders/WO-074-launchpad-export-kit.md`](../../work-orders/WO-074-launchpad-export-kit.md) on branch `wo-074`, uncommitted over `main` at `28d32e26fade7b7d2fe6ed00c43707ad58b87f70`. `git ls-remote origin refs/heads/main`, `origin/main` and local `main` all name that commit, so integration merged nothing.

- The gate code identity is `7b57ef29042a715b9ee198e29878d72783b84d4351cc3dc86e066be476b3d79d`. VER-001 judged this identity and the executor's review row covers it. `gateCodeIdentity` returned it after integration and again after `npm run format`. This review edited no code byte.
- The order differs from `main` only in its heading's version label, `(v0.70.0)`. The eight criteria are the original text.
- No ideation receipt exists for this order: `docs/evidence/WO-074/` holds no `ideation.md`, and the order's nomination provenance is a planner-synthesized draft from WO-033 and the 2026-09-28 planning pass, so there is no breakout receipt or promoted document to digest.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.295","model":"claude-fable-5-1","effort":"max","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version` (2.1.295), and the model is the session's model as the host reports it. Effort `max` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at handoff. Every claim the verdict rests on could be run in this session: the fixture suite, the criterion 6 export against the operator's list, the license census, the clean-room screen and the affected checks.

**Process cost:** entry 195202 tokens; handoff 21602192 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 4b891ced-3b4a-4bf5-9302-daffd8d5ccfe`.

- Entry was observed at 2026-10-09T06:05:53.567Z, after 4 steps and 3 commands.
- Handoff was observed at 06:56:45.363Z, after 98 steps and 97 commands. It counts 21,182,266 cached input, 316,588 cache-write, 3,048 uncached input and 100,290 output tokens. These are cumulative transcript totals, almost all cached input, so they do not measure live context.
- Reasoning tokens and dollar cost are unavailable (`counter-unavailable`).
- Wall clock from dispatch to the handoff reading was about 51 minutes, of which the document gate took 24 minutes (1,432 s against about 100 s in the executor's and verifier's runs; the runner's critical path names format, build, docs-check and resume with 18 ms of waiting, so the time was inside the tasks, and the cause was not observed). The two bounded probes took 6 s and 1 s. Integration and its regeneration took under a minute.
- Tradeoff: the review gate reused the executor's passing tasks at the unchanged identity (60.98 s against 1,043.999 s fresh), ran `format` fresh and passed 35 of 35; the probes that bear on criteria 1 to 6 ran here fresh in under 10 s. No matched two-way cost experiment was performed and no unmeasured saving is claimed.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-074/FINAL-001.md`.

Read in full: the order; VER-001 with its probe and check evidence; the control log; `handoff.md`; D001 to D011 and the helper's draft D012; the adversary and improver reports with every disposition; `criterion-6-local-terms.md`; the fixture transcript; `scripts/launchpad.mjs`; `scripts/test-launchpad.mjs`; the nine templates under `scripts/kit/`; product 07 §Independent workflows and integration, §Verification review and attack, §Ideation breakout receipt and verification and §Model-specific notes; product 08 §PRs and commits and §Release-note edition; the cited LEGAL decision and current state, the idea-ledger entry, WO-069 D001 and D002, WO-070 D009, the stand-down §5, the 2026-09-28 pass §10, the first order WO-001 and the overlay template.

Reviewed: the complete subject diff against `main`: the fifteen modified tracked files (the README version claim, LEGAL, the docs map, product 03, the two publication locks, `package.json`, `scripts/license-surfaces.mjs`, `scripts/test-runner.mjs`, the order heading, and the generated control, evidence-selection, decisions-index, follow-up-register and work-order-index projections) and the new files (`scripts/launchpad.mjs`, `scripts/test-launchpad.mjs`, `scripts/kit/*`, the order's control segment, evidence, verification and this review's directory). The generated index diff was judged by its generator's check, not read line by line.

Lenses, and why:

- **Authority and private data:** the export writes outside the project and reads a private list; the clean-room screen is an operator-review assumption.
- **Correctness and tests:** a new exporter with provenance claims, refusals before writes and a pruned lockfile.
- **Platform fit:** the kit is the first consumable slice of the platform and instance boundary that WO-075 to WO-078 build on.
- **Operator flow:** a stranger must be able to start an instance from the client README.
- **Release surfaces:** final review is acceptance.

Goal alignment:

- **Traps:**
  - Deferring to VER-001's pass and the executor's 37 self-review findings instead of re-deriving the criteria here.
  - Widening the order over its already-boarded follow-ups and its own wording gaps, which are planning's.
  - Writing a behavioral fix and certifying it.
- **What I did:**
  - Re-ran the fixture suite and reproduced criterion 6 against the operator's list from a committed copy of the reviewed tree, with the exported script's hash tied to this tree's bytes.
  - Judged the criteria against their declared sets and left the boards and the order's wording gaps where D010 and D011 put them.
  - Changed no source; the only repository writes are this review's records and the regenerated projections.
- **NoOp:** leaving the order unreviewed keeps the starter an operator-reported intention and WO-075 to WO-078 blocked.

Integration: `npm run worktree -- integrate WO-074 --intake-backup <archive>` fetched `main` equal to the base, stashed and re-applied the work (named stash `89ce66420f9e900092201a3ba9daf5d7fa768383`) and regenerated the runtime, the harness bundle and manifest, the control projection, the release preparation, the decisions index, the follow-up register, meta and the work-order index, and the publication locks. Checkpoint 6 was recorded. The intake backup was created by `npm run backup:intake` into the session scratch. No authored conflict arose. [D012](../../evidence/WO-074/decisions.md#wo-074-d012) records both bases, the carried-forward claims and the affected checks, all of which pass. No component version collides: the application target v0.70.0 remains current, local and origin tags end at v0.69.2, and no component package changed. The evidence editions stay WO-074 revision 001.

## Earlier findings

- **Adversary F1 to F16 and improver F01 to F21** (37 found; 35 fixed; 2 recorded): every disposition was read. The fixture suite as it now stands encodes most of the fixes, and it passed fresh here: the license census excludes only `scripts/license-surfaces.mjs` (F1, F03), the planted list and its hash are asserted absent (F6), every plant is force-added (F7), a discovery record that lacks the attested version advises and one that holds it does not (F9), the unavailable summary says no text was checked (F10), the unreadable case skips with a reason under root (F15), the Codex dispatch refusal is asserted (F01), `README.md` and `.gitignore` are seeds (F04), the contract block is placeholder-free (F05), and the instance-path prefixes include `docs/workstreams/` and `docs/repositories/` (F13). F2's stale criterion 6 run is answered by the executor's, the verifier's and this review's runs, each from a committed copy whose exported `scripts/launchpad.mjs` hashes to the reviewed bytes. F14 and F16, recorded rather than fixed, are D011's follow-up and the order's step 11 wording.
- **VER-001:** no blocking finding and no implementation edit. Its three boards are unchanged at this identity: D007's exported test command, D010's operator author constant, D011's verification-derived fixture data.
- **WO-069 D001 and D002** do not reopen, and **WO-070 D009** stays allocated to WO-075, as D008 records; this review found no reason to change those dispositions.

## Criterion judgments

**Criterion 1:** met

- The fixture suite, run fresh under `node scripts/harness.mjs bounded` at this identity, passes its refusal cases (an occupied directory, a regular file and an unreadable directory are refused before any write, with the destination untouched), its identity case (every `scripts/**` and `packages/beacons/**` file equals the blob at the commit `UPSTREAM.md` names, by Git object id and mode; every manifest hash verifies; the manifest lists every kit file and exactly the 23 seeds, the manifest and the symlink are unlisted), its offline `npm ci` case, and its activation case: with no `.ts` under any `packages/*/src`, the kit's own `resume activate WO-001` succeeds and `status --json` reports WO-001 active.
- The export from a committed copy of this tree against the main checkout's list ([final-001-observations.json](../../evidence/WO-074/final-001-observations.json)) lists 282 kit files whose hashes all verify, and its `scripts/launchpad.mjs` hashes to `067cd504…`, equal to this worktree's bytes and to the hash VER-001 and the executor recorded. By source, `readKitSources` reads blobs with `git ls-tree` and `cat-file --batch` and refuses a path absent at the commit or not a regular file; the work tree is never read.
- The export's `npm test` is not claimed; [D007](../../evidence/WO-074/decisions.md#wo-074-d007--the-exports-own-test-command-is-a-follow-up) records it as FUP-8fb7ae17dd0fad5b and the client README says so.

**Criterion 2:** met

- The same fresh fixture case decodes the public and verifier control Beacons after activation to codebook 2, phase active, and asserts that `packages/skeleton` holds exactly the six build-free `.mjs` modules the scripts import and the empty grants seed, with no TypeScript source anywhere under `packages/*/src`. The judgment follows Execution plan step 1's reading of "package source" as TypeScript source; the criterion's shorter wording is the order gap D011 already records for the next amendment, and this report does not amend it.

**Criterion 3:** met, against the declared set

- The fresh fixture plants one of each declared item plus a control-Beacon projection, force-adds the ignored ones so every plant is a blob at the exported commit, and finds none in the export; no exported file contains a plant marker or the synthetic list's hash, no exported file hashes to the list, the list is absent, and the manifest names no instance path and no `.ts` source.
- The terms case prints `present (N texts checked)` for a non-matching list, `unavailable; no text was checked against a local-terms list` for no list, refuses an empty list, and refuses a match by file and line without printing the term, each refused export leaving no destination. By source, `exportKit` builds every write and the manifest, runs `checkLocalTerms` over each UTF-8 text, and only then creates the destination.
- The fixture-derived data under `scripts/fixtures/` is outside the declared set; [D011](../../evidence/WO-074/decisions.md#wo-074-d011--self-review-findings-and-a-follow-up-outside-criterion-3s-declared-set) boards it as FUP-e624167a7f6555f6.

**Criterion 4:** met

- This review's census over every exported path of the committed-copy export, excluding only `scripts/license-surfaces.mjs`, found exactly `LICENSE`, `LICENSE-docs` and `NOTICE`; the `--license none` export found exactly `LICENSE-PENDING.md`. Its notice grants no rights, names no license, names no license identifier, and says a file carrying its own label keeps it; the generated `package.json` says `UNLICENSED` while the default export's says `Apache-2.0`. The fresh fixture checks the three files against the pins `scripts/license-surfaces.mjs` exports, which `npm run release -- check-surfaces --local` confirmed equal the hashes LEGAL §Decision — 2026-09-06 pins.
- Operator-review assumption 4: the notice's wording is acceptable; it grants nothing, names nothing, and leaves the label question to the owner.

**Criterion 5:** met

- The fresh fixture's `implementation-ready` inside the export, attesting `claude-code 0.0.0-fixture` with no discovery record, prints `Advisory: attestation recorded as supplied; claude-code 0.0.0-fixture effort xhigh has no matching discovery observation.` and records the attestation as supplied; a discovery record that lacks the version still advises, one that holds it observed with the effort does not. The client README states the fresh-fork advisory, its discovery condition, and that a `CLAUDE_EFFORT` session attests with `claude-session-readback`.

**Criterion 6:** met

- From a committed copy of this tree (commit `cdd1c2e0…` in the session scratch) with `DOTLN_LAUNCHPAD` naming `/Users/dylanwood/Projects/DotLn`, which holds the operator's list, `scripts/launchpad.mjs export` exited 0 and printed `local-terms list: present (305 texts checked)`, refusing nothing. The list's contents were neither read nor printed; the command, output and redacted locations are in [final-001-observations.json](../../evidence/WO-074/final-001-observations.json). This is the third such run on the reviewed bytes, after the executor's and VER-001's.

**Criterion 7:** met

- Product 03 §Platform and instance boundary carries one undated paragraph naming the kit's first slice, in place after the starter paragraph; the file is 178,287 bytes against the 194,488 ceiling the 2026-10-07 pass set. The paragraph's claims match the source read for this review: the HEAD commit of the scripts' checkout, the manifest's shape, the seeds, the launchpad's list, and what a kit without package source runs.
- `docs/LEGAL.md` §Current state carries the dated observation in that section's form; `docs/README.md` §Map names `scripts/kit/`; D001 to D012 are in the decisions file; `npm run publication:check` reports both audience outlines CURRENT and 254 of 254 product headings indexed at the integrated tree. The order's step 11 names the status index for the locks, but the locks live in the two outlines, as D010 records; the implementation is right.

**Criterion 8:** met

- The four current WO-074 revision 001 editions pass their checks at the integrated tree: authority, artifact identity, verification, and feedback carried from WO-199 feedback-004 with no live episode.
- The executor's `npm test -- --review` at code identity `7b57ef29…` passed 35 suites and 85 fresh tasks in 1,043.999 s (recorded 2026-10-09T05:24:22.775Z, exit 0), with `launchpad` passing in 9.749 s. This review's gate at the same identity is in Executed checks below. `npm run test:docs` passes inline.
- `git diff --check` is clean. `package.json` adds only the `launchpad` script; the dependency manifests and lockfile are unchanged.

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

Not findings, each checked:

- **The kit's `npm run terms -- check` refuses before `git init`** with Git's "not a git repository" error, because the scripts resolve their launchpad through the Git top level. The client README's first step is `git init` before any control-plane command, and after it the command prints `unavailable` with no list, `present` with a non-matching list, and refuses a match by file and line (probed in the committed-copy export). The documented order of steps holds.
- **The fixture's activation case mutates the shared default export before the criterion 3 scan.** The scan asserts the absence of plants, markers and the list, which activation cannot introduce, so the assertions stay sound; a separate export per case would read more plainly. Maintainability only.
- **The order's own wording gaps**: criterion 2 says `packages/skeleton` source where step 1 defines package source as TypeScript source; step 11 names the status index for locks that live in the two outlines; the Cost line's 400-byte bound was superseded by the Known issues correction. D010 and D011 record them for the next amendment; they are planning's, not the executor's.
- **Two figures for product 03's size** in the records: the handoff says 178,287 bytes and D010's evidence says 178,153. The file measures 178,287 bytes now; the smaller figure predates a later wording edit. Neither figure bears on the criterion, whose bound is the 194,488 ceiling.
- **The `--license none` probe printed `unavailable`** because the committed copy's launchpad holds no list and that run did not name the main checkout; the criterion 6 run is the default export, and criterion 4 judges only the license census.

## Implementation review

- **Correctness.** Every refusal precedes the first write: the destination check, the absent-at-commit check, the regular-file check, the option check and the terms check all run before `mkdirSync`. The manifest is computed from the exact bytes written, so a hash can only verify against them. The lockfile pruner resolves each dependency by npm's nested lookup from the depending entry upward and throws when core's lockfile lacks a required package, so a stale core lockfile fails loudly rather than exporting an uninstallable kit.
- **Authority and private data.** The private list never leaves `checkLocalTerms`: refusals carry file, line and count, never the term, and the export prints only the status. The forge remote reaches the kit only through `parseGitHubTarget`, which refuses passwords, non-git usernames, ports and local paths, so no credentialed URL can enter `UPSTREAM.md`. The export writes nowhere but the destination.
- **Platform fit.** The kit is an allowlist of trees, files, documents and templates plus three generated files; the seeds are the one list a fork owns. WO-075 adds workspaces through `KIT_WORKSPACES`, WO-077 tells a seed from a kit file by the manifest's absence (D003's reopening condition names the typed record it may need), and WO-078's launchpad parameter already exists.
- **Operator flow.** The client README's six steps were followed in the fixture and the probe: `git init`, `npm ci`, the list, the optional configuration, `activate` and `status`. The two advisories name their remedies.
- **Maintainer in six months.** The allowlist, the seed list and the root conventions sit at the top of one file with their reasons in comments; D002 and D003 explain why the kit is the scripts' commit and why seeds are unlisted. The one rule a maintainer must not forget is that a kit path's template and its rendered seed are both blobs at the commit, which the dirty-tree fixture case guards.
- **Clean-room screen (operator-review assumption 1).** Every template under `scripts/kit/` and every seed the export writes were read in full. A bounded screen over the 20 kit-authored texts of the committed-copy export (pattern in the observations file) matched six lines: the harness-security template's rule that no credential, hostname, internal service name or employer policy text belongs in the file, the first order's instruction to name no specific host, gateway, vendor policy or internal service, its generic "gateway and provider behavior" audit topic, and the repository-profile convention's "name no credential, hostname or internal service". Each is a rule or a generic question; none describes a specific managed host, gateway or policy.

## Follow-up register

`npm run plan -- followups --touching` lists 14 pending rows by textual match. This review disposes none:

- Three are this order's own boards (FUP-8fb7ae17dd0fad5b, FUP-06de60fa5d19fe5a, FUP-e624167a7f6555f6), untriaged for planning.
- FUP-8111fc3dd4c22331 (the documentation map's dated log) reopens when WO-189 closes or `docs/README.md` passes 25,000 bytes; it measures 21,031 bytes after this order's one added line.
- FUP-adf6621e7f958dd8 (retained evidence links canonical inputs) reopens at the next edit of `scripts/authority-evidence.mjs` or when repeated authority copies exceed a tenth of tracked evidence bytes; this order edits no evidence script and adds one deterministic re-mint, far below that threshold.
- FUP-b28b870422a74166 (license-surfaces reads `docs/LEGAL.md`, an input outside the code identity): this order edits LEGAL's prose and leaves its three hash declarations unchanged; `npm run release -- check-surfaces --local` and the document gate's release-surfaces check judge the current bytes, so the seam stays planning's.
- The remaining eight match only on `scripts/test-runner.mjs`, the generated control projection, the root README or product 03, and this change opens none of their seams.

`npm run meta` reports one standing reopen candidate, WO-150-D003 (`coldStartBytes.executor` above 24576), which the WO-199 and earlier reviews also recorded. This order does not change the executor briefing.

## Release surfaces

- [`PR.md`](PR.md) is written under product 08 §PRs and commits, with one physical line per prose paragraph and the regenerated process meter kept below the prose.
- [`RELEASE-NOTES.md`](RELEASE-NOTES.md) is the five-section minor edition for v0.70.0; `parseReleaseNotes` accepts it.

The proposed PR title is `:sparkles: A launchpad export writes a new instance from core's pinned commit, screened against the private terms list`. Its gitmoji is `:sparkles:`, because the order introduces a capability. The title leads with what a reader can now do and the two properties that matter to a fork: the pinned commit and the screened text. The last two merged PR titles run 14 and 17 words; this title's 17 words come from its content, not from the previous title.

## Executed checks

Each probe ran alone under `node scripts/harness.mjs bounded`, at code identity `7b57ef29…`; each check ran alone.

| Check | Window (2026-10-09, UTC) | Exit | Result |
| --- | --- | --- | --- |
| `npm run backup:intake`; `npm run worktree -- integrate WO-074 --intake-backup <archive>` | 06:18:39–06:19:02 | 0 | no-op merge; checkpoint 6; stash `89ce6642…`; D012 |
| `git diff --check` | 06:19:2x | 0 | clean |
| `npm run publication:check` | 06:19:33 | 0 | 254/254 headings; both outlines CURRENT |
| `node scripts/harness.mjs check` | 06:19:36 | 0 | 33 generated surfaces |
| `npm run release -- check-surfaces --local` | 06:19:40 | 0 | license pins and publish guards pass |
| authority, artifact-identity, verification and feedback `--check` | 06:19:46–06:20:03 | 0 each | all four editions current |
| `node --test scripts/test-launchpad.mjs` (bounded) | 06:20:14–06:20:20 | 0 | 10 passed, 0 failed, 0 skipped, 5.96 s |
| criterion 6, identity, license census and clean-room probe (bounded) | 06:22:10–06:22:11 | 0 | `present (305 texts checked)`; hashes equal; census exact |
| kit `node scripts/terms.mjs check` before and after `git init` in the export | 06:24 | 1, then 0, 0, 1 | refuses outside a repository; unavailable, present, match refused after `git init` |
| `npm run meta` after D012's completion | 06:30:17 | 0 | D012 indexed; one standing reopen candidate (WO-150-D003) |
| `npm run format` | 06:30:43–06:30:49 | 0 | identity unchanged |
| `npm run test:docs` | 06:30:54–06:54:47 | 0 | 29 passed, 0 failed, 1,432.27 s, 29 fresh tasks |
| `npm test -- --review` | 06:55:28–06:56:30 | 0 | 35 passed, 0 failed, 60.98 s, 1 fresh task (`format`), the rest reused from the executor's row at this identity |

After the gate figures were filled into this report, the PR body and the release notes, `npm run format` and `git diff --check` ran again; the result transition runs `npm run test:docs` and `git diff --check` inline on the final bytes. Probe rows are in [`final-001-observations.json`](../../evidence/WO-074/final-001-observations.json), with local paths redacted.

Repository writes:

- this report, `PR.md` and `RELEASE-NOTES.md`;
- D012's completion;
- `final-001-observations.json`;
- the regenerated runtime, harness bundle, control, decisions-index, follow-up-register, meta, work-order-index and publication-lock projections.

No implementation source was edited. The intake backup, the committed copies and the probe exports live in the session scratch; the fixture suite's own cleanup removed its temporary repositories.

Goal alignment outcome: matched. Each criterion was re-derived from a fresh probe or check at the integrated subject; the three boards stayed boards; no source byte changed, and the reviewed state is ready to commit.
