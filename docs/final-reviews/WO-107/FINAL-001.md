# WO-107 — FINAL-001

**Verdict:** pass. All seven criteria are met against the original order, including the scope exception the operator authorized in D007. The evidence:
- VER-001's independent re-derivation of every run order and statistic;
- my own reading of the full diff against the order;
- the order's own checks, re-run on the integrated tree;
- a fresh product gate run after the new files were staged.

`main` had not moved past the base, so integration changed nothing. The review met two defects, and neither is an acceptance defect:
- [D010](../../evidence/WO-107/decisions.md#wo-107-d010--final-review-the-lanes-own-checks-are-keyed-to-this-orders-bytes): three of the lane's own checks are keyed to this order's bytes, so ordinary later changes break them. D010 boards the lane's after-base rule beside WO-105's as `FUP-8f0561e50754114f`.
- [D011](../../evidence/WO-107/decisions.md#wo-107-d011--final-review-the-lifecycle-whitespace-check-never-reads-new-files): the lifecycle's inline `git diff --check` never reads an order's new files. D011 boards that as `FUP-def7dd3b4f48a6fb`.

`FUP-0044`'s deferral trigger, WO-107 activation, occurred, so I reopened that row for planning.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.287","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 83762 tokens; handoff 19518565 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`, recorded by the harness before this procedure loaded. The canonical phase selected WO-107 and allocated this path. The actor values are this session's:
- Claude Code 2.1.287, from `claude --version`;
- model `claude-opus-5-5`;
- effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order allows any effort for the reviewer.

Cost scope: this dispatch, read with `node scripts/harness.mjs usage 0850b82b-4f99-4739-8d37-c63dac1d3931`, scope `dispatch`.
- **Entry:** observed at 2026-10-02T02:42:57.679Z.
- **Handoff:** observed at 02:58:58.360Z (122 steps, 91 commands), before this report was filed.
- **Breakdown:** 19,189,441 of the handoff total is cached input. Reasoning tokens and dollar cost were unavailable, which means unknown, not zero.
- **Wall clock:** the largest single cost was the product gate (420.10 s).
- **Subagents:** the plan was none, out of the 20 available. The readback observed 0, and the root was the only writer.

## Subject and evidence

The verified subject is the uncommitted WO-107 worktree at base `2bae7d407af2d5d07d16c5b15dc63134e277eabd` (`v0.64.0`), checkpoint `refs/dotln/checkpoint/WO-107/3`. The numbered verification sequence is complete: [VER-001](../../verifications/WO-107/VER-001.md) passed, and no repair followed. Its SHA-256 equals the control log's `reportHash` (`9933a469…`). After staging, `git diff --cached refs/dotln/checkpoint/WO-107/3` lists only lifecycle records:
- the control log and its projection;
- the integration stub;
- `meta.json` and PR.md's meter;
- VER-001;
- the decisions and work-order indexes.

`corpus/`, `packages/`, `scripts/` and the package files are byte-identical to what VER-001 verified.

No ideation breakout receipt applies. The evidence folder holds none, and the control log records no scope-expansion event. The order's text was amended once, under the operator's one-entry registry exception (D006, D007). The authorization is the operator's answer in the local adjacent-work queue's check-in (revision 3, `async-input`): "Authorize the one-entry classification fix." Like VER-001, I read it as actor-attested; I did not witness it. `npm run plan -- amend-order` refuses an order outside the latest planning receipt, so the amendment is recorded in D007 and in the order rather than in the planning log.

**Integration.** `docs/intake/` holds no ignored file, so the helper needed no intake backup. `npm run worktree -- integrate WO-107`:
- fetched `main` at `2bae7d40`, the order's own base;
- checkpointed the work as `refs/dotln/checkpoint/WO-107/6`;
- retained the include-untracked stash `cf76a5fa` (`WO-107 integrate 2026-10-02`);
- fast-forwarded with no change and re-applied the stash;
- regenerated the projections, release preparation and indexes;
- reported no authored conflict.

`git ls-remote` showed `v0.64.0` as the newest `v0.64` tag on origin, so `v0.64.1` stays current. I completed the helper's draft record as [D009](../../evidence/WO-107/decisions.md#wo-107-d009). Every claim carries forward with its original evidence.

**What I reviewed.**
- The order and its cited sources: product 07 §Goal-aligned decisions, §Independent workflows and integration and §Discipline; product 08 §PRs and commits and §Release-note edition; and the planning document's §10.1 rules and §10.3 restatement of WO-107.
- The handoff, D001–D008, the control log, `meta.json`, VER-001 and the adjacent-work queue.
- The full diff:
  - all four collector modules and the schema and self-test suite;
  - the four archived first-collector sources and their README;
  - `SCHEMA-WO-107.md`;
  - the record shape and the command-scenario tables of the comparison;
  - the transcript's non-sample events: 3 execution starts, 2 recorded executions, 1 failed sample, 1 comparison generation and 6 validation receipts;
  - every tracked change: the order's heading, exception text and criterion 6 wording, the fixture line, the README release line, the control projection and the generated indexes.

The diff matches the order's design:
- New files sit only under `corpus/harness/`, `corpus/baselines/` and `corpus/manifests/runs/`. The one existing-file edit outside the lifecycle records is the authorized fixture entry.
- The comparison never loads the current runtime. It reads the committed records, the archived first collector and the current collector modules (D005).
- `execute` stops the campaign at the first failed sample. A failed sample therefore never enters a record, and the transcript retains it. The order's retention rule covers that path, and the schema states it.
- `--compare` refuses an existing destination (`wx`), and `--check` asserts the observations' bytes are unchanged before and after.

Clean-room screen: I searched every new and changed WO-107 file for user paths, account identities, email addresses, hosts, URLs and secret shapes, and found none. The environment records only platform, OS release, architecture, CPU model and count, toolchain versions and a lockfile digest. No lint, type or format suppression appears in the new sources.

## Criteria

**Criterion 1:** met. The observations hold 72 records: two executions, each of the 36 declared scenarios. They hold 612 measured samples and 138 warm-ups. The seeds are distinct: `wo107-base-a-20261002` and `wo107-base-b-20261002`. Every record carries distribution stats, the full environment profile and run- and invocation-level boundary samples. `validateRecords` with pairing enforces exactly two complete groups with distinct seeds and equal registries and environments. The corpus test passes on the integrated tree, and VER-001 re-derived the same facts with a script that imports nothing from the harness.

**Criterion 2:** met. `node --test --test-reporter=tap corpus/harness/wo107-*.test.mjs` passes 13 of 13 on the integrated tree. That includes validation of every committed record and the mutation refusals.

**Criterion 3:** met. The transcript records the generation with `--compare … --out corpus/baselines/WO-107-comparison.md` (`comparison-generated`). On the integrated tree, `--compare --check` exited 0, and the observations (`d433c425…`) and report (`f7e19da1…`) hashed the same before and after. VER-001's negative controls show the check fails on a one-byte report change and on an altered sample. The report states overlap descriptively, as "overlap" or "are disjoint" for the min–max and p25–p90 ranges, with no verdict or threshold.

**Criterion 4:** met. There is one JSON record per line with a final newline, in a file keyed to the base commit, and every record names that commit. The first 36 lines keep their pre-append digest `34226e64…`, which the corpus test checks. Each record's statistics are recomputed from all of its measured samples, and each count equals the declared repetitions (9, or 3 for commands). The first execution's 381.8 s skeleton-suite sample stays in that record's maximum.

**Criterion 5:** met, judged against the declared set. Each of the eight declared metrics carries count, min, p25, p50, p90, max, mean and standard deviation, in every record and in the report. The raw sample values sit beside their distributions. Load and memory fields are typed `boundary-sample` in the records and labeled "boundary samples, not distributions or peaks" in the report.

**Criterion 6:** met. D001 records both seeds and both count pairs. VER-001 showed the archived first collector already hard-codes them, so they were fixed before the first execution. Against `2bae7d40`, the only change under `packages`, `scripts`, `package.json`, `package-lock.json` or `tsconfig.json` is the D007 fixture line. Every other tracked change is a lifecycle record. That includes the follow-up register, which `npm run meta` and this review's FUP-0044 disposition wrote. `docs/planning/` (apart from that generated register), the roadmap, `docs/README.md`, `corpus/README.md` and product 03 are untouched.

**Criterion 7:** met. On the integrated tree, after `npm run build`, the order's `--compare --check` command and `node --test corpus/harness/wo107-*.test.mjs` pass.
- `npm test -- --review` passed at code identity `d04f565c…`, run after the new files were staged.
- `npm run test:docs` passed. The result transition runs it again inline, together with `git diff --check`.
- `git diff --check` is clean. That is the command the criterion names and the lifecycle runs.
- No package manifest or lockfile changed, so there is no new dependency.

Staged, `git diff --cached --check` reports one line: the generated comparison ends with a blank line. The comparison generator produces that byte, and the collector revision pins it. Both executor and verifier ran `git diff --check` while the files were untracked, so neither run covered them. D011 boards that lifecycle gap, and D010 boards the report's fix together with the collector revision archive it needs.

## Defects met in review

D010 records three self-checks keyed to this order's bytes. None fails at the subject.
- **Classification pin.** The classification self-test requires the fixture's whole-file hash to equal `335e66e7…`. A scratch reproduction adds one sibling entry, and `validateClassification` then throws on the hash although WO-107's entry is unchanged.
- **Collector pin.** The second execution's protocol is the live hash of the four collector modules, and only the first revision is archived. On a scratch copy, appending one comment outside every timed section makes `--compare --check` exit 1 with `known collector revision`.
- **Registry runtime.** The registry self-test builds against the current kernel and skeleton. That is inferred from the code and was not executed.

The order pins its measurements to its base, and the planning pass's "re-runnable" means the check appends nothing to its input. These are therefore not acceptance defects, and a reviewer may not write the harness change and certify it. The after-base rule for corpus lanes is the open question `FUP-d093f77bd927f9dc` already holds for WO-105. D010 explains why that ambiguity, together with the reviewer's lack of authority, justifies a named deferral rather than failing the review. It also explains why D010 is not left as a sentence here.

D011 is outside the order's criteria and surfaces: `scripts/lib/lifecycle-evidence.mjs` runs `git diff --check` with no base and no `--cached`. The committed tree already carries 410 whitespace reports, all in byte-exact captures and generated outputs, so the fix must first decide which paths are exempt.

## Register

`npm run plan -- followups --touching --work-order WO-107` matched 6 rows, the same six D008 judged.

| Rows | Matched | Disposition | Reason |
| --- | --- | --- | --- |
| FUP-0044 | `WO-107` | reopened (`open`) | Its recorded trigger, WO-107 activation, occurred. WO-107 delivers the profiling cell it would reuse, and product 03 lists three real transports. Allocation stays a planning decision. |
| FUP-b7a66e7a4fa7ad20 | `decisions.md` | left | Textual match. Release preparation, the integrate helper and the release-history check are untouched, and this integration met no collision. |
| FUP-50cda1c03ecd8ea8 | `meta.json` | left | Textual match on the meter snapshot. `harness-prune.mjs` is untouched. |
| FUP-71fc2efc208f597a | `decisions.md` | left | No advisory appeared, and no retained fingerprint changed. D008 records the same-day paraphrase of operator phrases. |
| FUP-acfe4bfda716d8fb | `current.md` | left | Textual match on the control projection. Usage attribution is untouched. |
| FUP-fd05316b6030ef73 | `README.md`, the work-order index | left | Textual match on the release line and the generated index. The writer text is untouched. |

`npm run meta` synced D009–D011 into the decisions index, and D010's and D011's follow-ups as `FUP-8f0561e50754114f` and `FUP-def7dd3b4f48a6fb`.

## Executed checks

- **Integration:** `npm run worktree -- integrate WO-107`, with no intake backup needed. Bases `2bae7d40` → `2bae7d40`, checkpoint `/6`, stash `cf76a5fa`, no authored conflicts.
- **Printed affected checks,** run on the integrated tree:
  - `npm run publication:check`: exit 0.
  - `node scripts/harness.mjs check`: exit 0, 32 generated surfaces.
  - `npm run release -- check-surfaces --local`: 57 PASS, 0 FAIL, exit 0.
- **Product row:** `npm test -- --review`, recorded 2026-10-02T02:56:58.939Z, after the order's new files were staged.
  - 30 passed, 0 failed, 420.10 s, 75 fresh tasks.
  - Code identity `d04f565cc0cc0dd634cdca6024eff5a18980c45e187d2fbd98369602d3de1897`; `gateCodeIdentity` recomputed after the gate gives the same value.
- **`npm run build`,** then:
  - `node corpus/harness/profile.mjs --compare corpus/baselines/observations-2bae7d407af2d5d07d16c5b15dc63134e277eabd.jsonl --check`: exit 0, hashes unchanged.
  - `node --test --test-reporter=tap corpus/harness/wo107-*.test.mjs`: 13 passed.
- **Reproductions** in DotLn session scratch: the fixture pin and the collector pin, as above.
- **Whitespace:** `git diff --cached --check` reported the one generated-report line above. `git diff --check 4b825dc6… HEAD` counted the 410 committed reports.
- **Register:** `npm run meta` synced D009–D011 and the two new follow-ups. Its health line: `no observed budget breach; … 1 reopen candidates` (WO-150-D003, as at earlier closes). `npm run plan -- followups --apply` reopened FUP-0044.
- **Documents:** `npm run test:docs`, run with this report, PR.md, RELEASE-NOTES.md and D009–D011 in place: 24 passed, 0 failed, 37.29 s, 24 fresh tasks. The result transition runs it again inline.

## Judgment and publication

D010 and D011 compare their choices with the mission, the system traps, Naive Interventionism and NoOp. Against the promised benefit, the observed outcome is:
- The cost loop has its first observed column: two complete executions of the 36 declared scenarios, with every sample, the outlier and the machine load around each one kept.
- The column is reproducible: the comparison regenerates byte for byte from the records without loading the current runtime.
- Three of the lane's self-checks do not survive ordinary later changes. That limit is disclosed and boarded with WO-105's rather than repaired in a second cycle.

No efficiency gain is claimed. The tradeoff: I spent one fresh product gate and two scratch reproductions to establish which checks are base-keyed, instead of carrying the verifier's pass forward unexamined. In exchange, the review met a whitespace check that had read none of the order's new files.

Reviewed PR title: `:chart_with_upwards_trend: Record the first measured performance baseline, with the machine load beside every sample, so declared costs can be checked against observations`. The gitmoji catalog assigns that shortcode to adding or updating analytics or tracking code, and this change adds measurement records. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state which of the lane's checks are keyed to this order's bytes. A pass authorizes committing this reviewed state, pushing only `wo-107` and opening its PR. The helper supplies the post-merge release-close handoff.
