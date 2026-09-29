# WO-116 FINAL-001 — final review

**Verdict:** pass. WO-116 asked for a terminal command that renders the canonical audit record's three projections for a store's retained log, with their fidelity labels and the causal links the fold recognizes; a console contract identifier whose served result is that command's bytes; a text-host render; bounded write-backs; an unchanged fold; and both gates. The subject does each of these. [VER-001](../../verifications/WO-116/VER-001.md) passed all five criteria. This review read the full subject diff against the original order, the decisions, the handoff ledger, the fixture transcripts and the ideation receipt; staged the order's work; ran the review gate once at the staged identity; and reopened two register rows whose conditions this order met. It changed no source and no product document, and routes nothing to repair.

**Subject:** [`docs/work-orders/WO-116-audit-projection-served.md`](../../work-orders/WO-116-audit-projection-served.md) on branch `wo-116` at `5eda673c` plus the working tree, which this review staged. `git ls-remote origin refs/heads/main`, local `main` and the merge base all name `5eda673c`, so the subject already contains current `main` and no integration was needed. The dispatch checkpoint is `refs/dotln/checkpoint/WO-116/5` (`1110acc8`).

- The recorded `reportHash` of VER-001 (`sha256:78905e14…`) equals the report's current SHA-256.
- The order's text differs from `main` only in its heading's release label, `(v0.54.0)`. The five criteria are the ones the 2026-09-28 amendment filed.
- The ideation capture in this worktree's ignored intake, `docs/intake/notes/WO-116-expanded-ideation-2026-09-28.md`, hashes to the `b00d1e63…` that D015, the ledger section and the map section record. It stays there until release close: `worktree finish` reconciles worktree-local intake into main before removal (`scripts/worktree.mjs` imports `reconcileWorktreeMaterial`), and this role holds no grant to write the main checkout.
- What this review wrote is documents and local state only: the register dispositions, the refreshed indexes, meter snapshot and PR meter block, this report, the PR body and the release notes.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.284","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no other choice about the verdict. The harness version is what `claude --version` reports in this session. The model is this session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` value, which `resume status` reads back for this session as `claude-session-readback`: the selected effort, not the effective one. The order asks for `reviewer any`. Subagent plan, stated before any spawn: none, against the cap of 20 with 0 observed at entry (exact-observed). The subject is three source files, two test files and bounded write-backs, which one reader can hold, and the verifier had already rerun both fixture families.

**Process cost:** entry 84948 tokens; handoff 11159730 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 18da9375-0735-400a-9703-2a1ff47914d0`. The entry reading was observed at 2026-09-29T00:00:34.885Z, before the order was read. The handoff reading was observed at 2026-09-29T00:12:10.742Z, after the register dispositions, the PR body, the release notes and this report's judgment text were written and before `test:docs` and the result transition; it counts 10,919,857 tokens of reused cached input, 189,966 of cache writes and 49,757 of output, over 80 steps and 69 commands. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero. The harness counted 0 subagents, exact-observed, 20 of the cap of 20 remaining. The largest wait was the review gate, 322.76 s, during which repository writes are refused; this report and the PR and release texts were drafted in session scratch beside it, and every repository write followed it.

## Goal-aligned judgment

The order is the third step of gate U of the critical path: WO-117's console live host depends on a served audit, and without it a UI that audits needs its own reader of the log. The questions for this review were whether the served bytes can drift from the terminal's, whether any selection adds a label or field the fold does not produce, and whether the limits the executor met are recorded where planning will find them.

- **Policy resistance and rule beating:** the terminal command calls the same `renderAuditProjections` the skeleton's `--audit` calls, and the console serves the child's bytes; the fixtures compare served bytes with a separate terminal run and with the skeleton CLI's output, not only with the function, so a self-comparison cannot pass alone.
- **Seeking the wrong goal:** the goal is one source for audit, not a richer audit. The resident-store limit (D008) is a real usefulness gap for WO-117, and it is correctly a planning row rather than new semantics inside this order.
- **Drift to low performance:** refusals are exact bytes, pinned for exit code, stdout and stderr in both fixture families.
- **Escalation, commons:** one command, one option, one identifier; one log read per call, no cache or background work.
- **Success to the successful:** the declined redaction layer, filter-after-fold, JSON mode and console-only route each carry a reason and a reopening condition (D002, D005, D006).
- **Shifting the burden:** a UI no longer needs a second log reader; the text host's render is the existing `invoke`, so nothing new needs operator rescue.
- **Naive Interventionism:** the fold, its scope rule and every other `dotln` command keep their behaviour; I checked that each other command's option guard still refuses the newly parsed `--workstream`.
- **NoOp** leaves WO-117 blocked and runtime audit the one inspection the parity contract cannot serve.

## Source changes

I read every changed source and test file against the order and the unchanged fold.

- **`packages/skeleton/src/dotln.ts`.** The `audit` branch refuses any switch, any option but `--store`, `--workstream` and `--episode`, and both selections together at the audit usage; reads `WorkerStore.read()` and `decodeLog`; refuses an empty result by store; keeps envelopes whose `workstreamId` or `episodeId` equals the selection; refuses an empty selection by name; and prints `renderAuditProjections(selected)`. The fold's `projectionScope` then labels the run from its inputs (`ep:` only when every input shares one episode in one workstream), so the command adds no label. The shared parser gains `--workstream`; `presence`, `handoff`, `resident`, `status`, `demo` and `verify-demo`/`feedback-audit` each still refuse it through their own guards. The refusal allowlist gains `audit:` and `invalid audit `, the prefix of every `invalid audit …` refusal in `audit.ts`. The general usage line and the unknown-command list now also name `handoff`, the adjacent repair D011 records.
- **`packages/skeleton/src/console-commands.ts`.** One entry, `dotln.audit`, with the `dotln.js` entrypoint and prefix `["audit"]`.
- **`packages/skeleton/src/audit.ts`** and **`artifact-audit.ts`**: no diff. The fold tolerates a selection whose causation points outside it: an unresolved reference yields no dependency.
- **`packages/skeleton/test/audit-command.test.ts`** (new) and **`packages/console/test/console-commands.test.ts`**: the fixtures spawn the built entrypoints, compare against the skeleton CLI's `--audit` section and against separate terminal runs, pin refusal bytes and exit codes, assert no store is written and the missing directory is not created, check the envelope's five keys, and audit the resident's own store against the log prefix present when the child started.

No change adds a dependency or a lint, type or format suppression (added lines scanned for `eslint-disable`, `ts-ignore`, `ts-expect-error`, `ts-nocheck`, `prettier-ignore` and coverage ignores: none). The manifest and lockfile changes are the skeleton version and the console's pin.

## Criteria

**Criterion 1:** met

Over the fixture log, `dotln audit` prints the skeleton `--audit` section byte for byte for the whole log, `--workstream ws_repo_garden` and `--episode ep_seiri_1`, with `L0 RECEIPT`/`L0`, `CAUSAL TIMELINE`/`L1` and `GOVERNED RAW JSON`/`L4` in order and the fold's explicit event link and causation. Over a mixed log each selection equals the fold over the envelopes it selects, labeled `log:mixed`, `ws:ws_repo_garden`, `ws:ws_second`, `ep:ep_seiri_1` and `ep:ep_seiri_2`. An empty directory, an empty log and a missing directory refuse naming the store, and `ep_absent` and `ws_absent` refuse naming the selection and the store. This review's own check outside the fixtures wrote the fixture log to a session-scratch store and compared `dotln audit` with the skeleton CLI's `--audit` section by `cmp`: 59,613 bytes, sha256 `ec659a6d…`, identical for all three scopes, with the three headings and labels in order; the empty store and `ep_absent` refused by name with exit 1, and the empty store stayed empty. The skeleton suite of this review's gate ran the fixture on the staged subject.

**Criterion 2:** met

The WO-116 console case compares nine served store-and-selection pairs, refusals included, with a direct terminal run for exit code, stdout and stderr; the result envelope holds exactly `version`, `command`, `exitCode`, `stdoutBase64` and `stderrBase64`, so the served result holds no field the terminal's output lacks. The text host's `invoke` output equals the terminal run and the skeleton `--audit` section and carries the three headings and labels in order. The console suite of this review's gate ran it on the staged subject.

**Criterion 3:** met

Product 09 grows from 50,759 to 51,102 bytes (`wc -c` against `main`), 343 added of the 400 allowed, in the paragraph it amends; product 04 grows 49 bytes of the 200 allowed, in the command table and the sentence that reserved runtime audit for this order; the console README's parity paragraph and example name `dotln.audit` and what `invoke` prints; the decisions file records D001 to D016; the publication locks are current (`publication:check`). None of the four write-backs is a dated paragraph. The roadmap's dated release-boundary paragraph is the release label's own record (D009), outside the criterion's list, as WO-173's was.

**Criterion 4:** met

`git diff main -- packages/skeleton/src/audit.ts packages/skeleton/src/artifact-audit.ts` is empty; the command imports the existing renderer. The registered sources touched are the skeleton manifest and the lockfile, whose version lines the edition checks normalize, and the four edition checks pass in `npm run test:docs`, so no edition is stale (D007).

**Criterion 5:** met

The review gate `npm test -- --review` passed at the staged code identity `89720b83…`: 29 suites, 0 failed, 73 fresh tasks, 322.76 s, exit 0, recorded 2026-09-29T00:09:39.426Z. Staging the order's untracked test moved the identity off the executor's `598c484d…`, so the gate ran instead of reusing that row. `npm run test:docs` passed after this report was written (Checks). `git diff --check` and `git diff --cached --check` are clean; `package-lock.json` changes only the skeleton's version and the console's pin, so no dependency is added. `handoff.md` judges all five criteria met, and the completion recorded `unmetCriteria: []`.

## Ideation receipt

D015 is the receipt for the operator's `ideation:` messages during execution; I read it with the ledger section `2026-09-28 — Ideation during WO-116 execution` and the planning map section `Candidates — returns from ideation during WO-116`.

- **Source treatment:** Shape-First synthesis of the operator's own words about this repository's process; the ledger rewrites them rather than quoting, and nothing is employer-derived. No direct-draft filing is claimed, and none is present.
- **Traceability and status:** two entries are `candidate` and one is `raw`, each `operator-directed`; the third is marked tentative in the operator's word "possibly". Nothing speculative is presented as settled, and no product, decision or schema surface changed.
- **Consistency:** the stoppable-phase entry restates product 02's rule that a refused Stop is reported once and keeps the writer; the Blackjack +3 reference matches ADR-0007 item 6 and its 2026-09-24 amendment (a curve that grows to a peak, declines and resets) and product 03 §Candidate — progressive absence authority and return readiness.
- **Helpers:** none was created, so no executable breakout evidence is owed.
- **Corrections:** D013 and D014 record the two errors the operator named, each with what was misread, what was meant and what changed. D014's follow-up, product 07 step 1's capture destination, is a planning row.
- **The trial:** D016 records the operator-directed use of the wait, which is the reopening condition of map item 2; that row is reopened below.

## Rows

`npm run plan -- followups --touching` returned 8 pending rows at register revision `d6adf2cf…`. One batch through `followups --apply` recorded two dispositions (register `d6adf2cf…` to `3e03a7af…`); each reason cites this report.

| Row | Matched | Disposition recorded | Why |
| --- | --- | --- | --- |
| FUP-0053 (audit causal-association hardening) | WO-116 | open | Its deferral condition, WO-116 activation, occurred. WO-116 did not take it up, and D012 adds the derived selection-adjacency observation. |
| FUP-1f47fd50acc97814 (map item 2, waits under the Blackjack +3 shape) | not listed; found by reading D016 | open | Its reopening condition, an operator-directed trial, occurred in this order (D016). The textual match missed it because the row names its seam in other words. |

Left for the planning pass as new nominations of this order: `FUP-3d4b39cd4b2c4a08` (D008, resident audit action classes), `FUP-bf614feaea90cac3` (D014, product 07 step 1) and `FUP-3bb4dea9dde2a392` (map item 1, utilization versus activation). Left as they are, each a text match whose condition did not occur: `FUP-0073` (`dotln.ts`; it reopens when WO-083 closes), `FUP-50cda1c03ecd8ea8` (`meta.json` by name; the byte-proof writer is untouched), `FUP-acfe4bfda716d8fb` (the generated `current.md`; usage attribution is untouched) and `FUP-fd05316b6030ef73` (generated indexes and the release line; the named sentences are unchanged).

The worktree's adjacent queue: `adjacent-0001` completed (D011); nothing pending.

## Findings

No finding is routed to repair, and no criterion fails.

- **A resident store audits with empty L0 and L1** (usefulness limit, boarded in [D008](../../evidence/WO-116/decisions.md#wo-116-d008--observed-limit-a-resident-stores-own-events-are-context-to-the-fold), follow-up `FUP-3d4b39cd4b2c4a08`). The fold's consequential source types are the fixture scenario's; a resident appends none of them, so only governed raw shows what the resident did, and the omission labels say "fixture" over any store. The order's criteria are stated over the fixture log and its non-goals exclude new audit semantics, so this is not a failure of WO-116; it bears directly on WO-117's usefulness and belongs in that planning pass.
- **Adjacency within a selection** (observation, D002 and D012; FUP-0053 reopened). A selection is judged as the fold judges a log holding only that scope. The command applies the fold exactly as the order requires; the question is the fold's, and it waits for planning.
- **The command is classified `shell.run`** (D004). A read-only envelope refuses `dotln.audit` as it refuses `dotln.status`; distinguishing read-only `dotln` subcommands is the terminal classifier's change and reopens D004.
- **The meter names policy resistance a reopen candidate** (process observation). `npm run meta` counts 21 guard refusals for WO-116, against the 19 the executor's README records, and reports the count worsened over three consecutive order deltas. The executor's README attributes most of its 19 to review probes refused while its own gate ran. This review met the live-gate guard once, when a read using command substitution was refused during its own gate; I have not attributed the other added refusal. The candidate is the meter's to carry to planning; nothing in WO-116's criteria depends on it.

## Verification sequence

1. **Activation** at 2026-09-28T22:36:48Z, checkpoint 1.
2. **Implementation** (executor, Claude Code 2.1.284, `claude-opus-5-5`, effort max, `claude-session-readback`): `ImplementationReady` at 23:51:08Z, checkpoint 2, `unmetCriteria: []`. D001 to D016, including the ideation receipt D015 and the corrections D013 and D014.
3. **[VER-001](../../verifications/WO-116/VER-001.md)** (Codex CLI 0.158.0, `gpt-6-sol`, effort max, `codex-session-readback`): requested at 23:53:26Z, checkpoint 3; pass at 23:58:14Z, checkpoint 4. All five criteria met; the resident-summary limit carried to this review.
4. **FINAL-001** (this report): dispatched at 2026-09-29T00:00:28Z, checkpoint 5. No finding routed to repair.

## Checks

| Check | Result |
| --- | --- |
| `git ls-remote origin refs/heads/main`, local `main`, merge base | all `5eda673c`; no integration needed |
| Tags | local and `origin` end at `v0.53.2`; `v0.54.0` is free |
| SHA-256 of VER-001; of the ideation capture | each equals its record |
| `npm test -- --review` | 29 passed, 0 failed, 322.76 s, 73 fresh tasks, exit 0; recorded 2026-09-29T00:09:39.426Z; code identity `89720b83…`, staged tree `b78767ab`; row `host-gate:89720b832322836bb12823968c43a97c93c6ef80786ad572d87df320cb707b7d:npm test` |
| Spot check in session scratch: `dotln audit` over the fixture log against the skeleton `--audit` section | 59,613 bytes, sha256 `ec659a6d…`, `cmp` identical for the whole log, `--workstream ws_repo_garden` and `--episode ep_seiri_1`; the empty store and `ep_absent` refuse by name, exit 1 |
| Product 09, product 04 | 50,759 to 51,102 bytes (+343); 59,662 to 59,711 bytes (+49) |
| Suppressions, manifests, lockfile | none added; skeleton `0.45.0` and its pin only |
| `npm run plan -- followups --touching`, then `--apply` | 8 rows at `d6adf2cf…`; two dispositions applied; register `d6adf2cf…` to `3e03a7af…` |
| `node scripts/adjacent-work.mjs list` | `adjacent-0001` completed; nothing pending |
| `npm run publication:check` | exit 0; 267/267 product headings indexed; 30 and 45 linked source sections current |
| `npm run harness -- check` | 31 generated surfaces |
| `node scripts/refute-plan.mjs check` | exit 0 |
| `npm run release -- check-surfaces --local` | exit 0; `@dotln/skeleton` src changed, `0.44.4` to `0.45.0`; console pin `0.45.0`; the other components need no bump |
| `npm run release -- prepare --local` | `v0.54.0` remains current; meter snapshot (3,898 bytes) and PR meter block refreshed |
| `npm run meta` | exit 0; register synced; one standing advisory, `sequenceBytes=13965 exceeds 8192`, outside this order; one reopen candidate, policy resistance (Findings) |
| `git diff --check`, `git diff --cached --check` | clean |
| `npm run test:docs` | the first run after this report was written failed `release-surfaces`, whose release-notes check reads any `<word` as raw HTML, on the `<directory>`-style placeholders in the release notes, and eight dependent tasks did not run; with uppercase placeholders the next run passed 23 of 23, 0 failed, 13.04 s, 23 fresh tasks, exit 0; a run on the final bytes of this report also passed 23 of 23 |
