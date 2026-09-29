# WO-065 FINAL-001 — final review

**Verdict:** pass. WO-065 asked for a read-only observer that reads a pull request DotLn opened through `gh` in JSON mode and appends one `PullRequestStateObserved { repositoryId, number, headSha, checks[], comments[] }` to the store's `publication/` log. It also asked for comments classified by role and class and screened through WO-060, refusals that append nothing, an operator-invoked command with no cadence, a live smoke, bounded write-backs and both gates. The subject does each of these. [VER-001](../../verifications/WO-065/VER-001.md) failed criterion 1 because automation was keyed to a `[bot]` login suffix that GraphQL never returns. The repair decoded the actor type, and [VER-002](../../verifications/WO-065/VER-002.md) passed all six criteria. This review did the following:

- read the full subject diff against the original order, the decisions, the handoff ledger, both verifications and the ideation receipt;
- ran the observer against three populated public pull requests, the case neither verification could reach, and recorded what that showed in [D015](../../evidence/WO-065/decisions.md#wo-065-d015);
- staged the order's source and ran the review gate once at the staged identity;
- opened two register rows for planning.

It changed no source and no product document, and routes nothing to repair. The two defects VER-002 boarded (F4, F5) are behavioral repairs. Product 07 §Independent workflows and integration says a reviewer never writes a behavioral fix and certifies it, so they go to planning under `FUP-7a8e67d555cccc01`. The live run found two limits that follow from declared choices, not defects, and they go to planning under `FUP-b20c90983e966131`:

- a machine account typed `User` is stored as a human reviewer;
- most real bot review text is refused because it links off the forge host.

**Subject:** [`docs/work-orders/WO-065-pull-request-state-observation.md`](../../work-orders/WO-065-pull-request-state-observation.md) on branch `wo-065` at `8c28f479`, plus the working tree, which this review staged. `git ls-remote origin` (fetched), local `main` and the merge base all name `8c28f479`, so the subject already contains current `main` and no integration was needed. The dispatch checkpoint is `refs/dotln/checkpoint/WO-065/9` (`b6fb04f1`).

- The recorded `reportHash` of VER-001 (`sha256:99e74e34…`) and VER-002 (`sha256:0fc50a4a…`) each equal the report's current SHA-256.
- The staged bytes of the observer, its test, its fixture, the `gh` helper and `worktree.mjs` equal the SHA-256 values in the repair's [`repair-subject.json`](../../evidence/WO-065/repair-subject.json), so the gate below ran the bytes VER-002 judged.
- The order's text differs from `main` in two places:
  - its heading's release label, `(v0.55.0)`;
  - the authorized ideation-breakout paragraph, bound by the `PlanExecutionAmended` row for `WO-065-D008` in `docs/control/plan-refutations.jsonl`.
  The six criteria and the non-goals are the ones the 2026-09-28 amendment filed.
- The ideation capture hashes to the `88b5b554…` that D008 and the ledger section record. It sits in this worktree's ignored intake as `docs/intake/notes/WO-065-expanded-ideation-2026-09-29.md`. It stays there until release close: `worktree finish` reconciles worktree-local intake into main before removal, and this role holds no grant to write the main checkout.
- This review wrote documents and local state only:
  - decision D015 and two register dispositions;
  - the refreshed indexes, meter snapshot and PR meter block;
  - this report, the PR body and the release notes.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.284","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no other choice about the verdict.

- **Harness version:** what `claude --version` reports in this session.
- **Model:** this session's model as the host reports it.
- **Effort:** `xhigh`, the host's `CLAUDE_EFFORT` value. `resume status` reads it back for this session as `claude-session-readback`, which is the selected effort, not the effective one. The order asks for `reviewer any`.
- **Subagent plan,** stated before the spawn: one read-only probe with no descendants, against the cap of 20 with 0 observed at entry (exact-observed). The subject was a size one reader can hold, so I read all of it myself. The one question neither verification could answer was how the observer behaves on a populated pull request, so that was the probe's only duty.
- **Workflow mode:** no setting readback shows it, so the profile D008 adds reads as off, and one delegated probe fits its zero-to-three expectation.

**Process cost:** entry 84931 tokens; handoff 14853884 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 8947cbd2-7bda-41f3-aab6-04637badcbc3`.

- **Entry:** observed at 2026-09-29T02:15:03.711Z, before the order was read.
- **Handoff:** observed at 2026-09-29T02:34:01.871Z, after the register dispositions, D015, the PR body, the release notes and this report's judgment text were written, and before `test:docs` and the result transition. It counts:
  - 14,541,619 tokens of reused cached input;
  - 238,530 of cache writes;
  - 73,569 of output;
  - over 98 steps and 71 commands.

  The harness counted 1 subagent, exact-observed, leaving 19 of the cap of 20.
- **Not counted:** reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero.
- **The probe subagent** reported 93,356 tokens, 34 tool uses and 689.9 s in its completion notice. Those are its own counters, outside this dispatch's transcript total.
- **Waits:** the review gate, 351.96 s, ran beside the probe. This report, the PR body and the release notes were drafted in session scratch during it, and every repository write followed it.

## Goal-aligned judgment

The order is the observation slice of the source-to-deliverable vertical. `PullRequestOpened` had no reader, so DotLn could not see what happened to the pull request it published. WO-066 resolves review comments from these stored classes, and WO-123 composes the command into the vertical. This review asked three questions:

- whether a stored class can be wrong on the API's real shapes;
- whether any rejected text can reach the store or a log;
- whether the limits the verifiers met are recorded where planning will find them.

- **Rule beating and seeking the wrong goal:** a green fixture over a synthetic shape is what VER-001 caught. The repair's fake `gh` now refuses any author selection without `__typename`. This review also ran the observer on real responses rather than counting passing tests.
- **Policy resistance:** the observer uses the publisher's own identity, lock and log, and WO-060's screen unchanged. It widens no allowlist and keeps no hash of refused text.
- **Drift to low performance:** unreadable structure refuses the whole observation with a field path. An unreadable or screened string refuses only its own item, and its peers are stored.
- **Escalation and commons:** there is one command, no poller and no new gate. Each run costs the pages the pull request actually has.
- **Success to the successful:** the existing fake-`gh` harness was extended, not duplicated (D001). The declined poller, remote writes, package-side observer and hashed refusals each carry a reason and a reopening condition (D002).
- **Shifting the burden:** without the observer, the operator copies review feedback by hand. With it, WO-066 reads typed items, and a refused item tells it to stop and read again instead of acting blind.
- **Naive Interventionism:** VER-002's F4 and F5 need a hostile or broken forge response and fail closed with nothing stored. Repairing them here would put an unverified behavioral change into a reviewed PR, so they go to planning with the triggers D014 names.
- **NoOp** leaves the post-PR loop blind and WO-066 without an input.

## Source changes

I read every changed source and test file against the order.

- **`scripts/lib/pull-request-observer.mjs` (new).** `observePullRequest` requires exactly one `PullRequestOpened` from `target-publish-host` for the number, optionally narrowed by repository. It checks that event once before taking the publication lock and again under it. It validates the recorded `repositoryId` as canonical `HOST/OWNER/REPO` and runs the screen's host rule on it before any `gh` call. Reads use `gh api graphql --hostname HOST` with read-only queries:
  - pull request metadata;
  - the status-check rollup pinned to the observed head;
  - conversation comments;
  - reviews;
  - review threads, with each thread's comments paged by node id.

  Every author selects `__typename login`. `Bot` is `automation`, the other four Actor types are positively admitted, and an unknown or missing type refuses at its path. The pull request's author is `reporter` only when type and case-folded login match. Every stored string, including ids, paths, check names and bodies, passes `decodeSourceBundle` as a one-entry bundle with the forge host as the only allowed host:
  - a finding keeps shape, path and span;
  - malformed text keeps shape `malformed-text` and path, without a span;
  - any refusal omits the item's text, and a refused path also omits its line;
  - a refused id becomes a collision-avoiding `refused:N` placeholder;
  - a refused check name becomes `[refused]` with its state kept.

  Structural decode failures, GraphQL errors, a `gh` failure, a changed head or author, duplicate node ids and stalled pagination throw before the append, so nothing is written, and the lock is released in `finally`. The payload is compared canonically with the latest observation caused by the same opening event, so identical or reordered state appends nothing and a change, including a return to an earlier state, appends one. The log line prints counts only.
- **`scripts/worktree.mjs`.** `observe-pr` takes exactly `--store`, `--number` (a positive decimal) and an optional `--repository`. It refuses anything else with its usage line, runs before any lifecycle state is read, and is added to the general usage line.
- **`scripts/lib/github-repository.mjs`.** `executeGh` takes an optional `maxBuffer`. Only the observer passes one (16 MiB), so every other caller keeps its default.
- **`scripts/test-target-publish.mjs` and `scripts/fixtures/target-publish/observation.json` (new).** The existing fake `gh` delegates `api graphql` to a replay script. The replay refuses mutations, a wrong host or repository, and author selections without `__typename`, and serves recorded GraphQL-shaped responses by operation and cursor. Eleven WO-065 cases cross the CLI boundary and read the stored bytes: AC1, F1, AC2, pagination, AC3, duplicates and concurrency, F2, two F3 cases, drafts and deleted authors, and a page over 1 MiB. The fixture uses synthetic identifiers only (`dotln-fixture/target`, `fixture-author`, `CR_1`).

No change adds a dependency or a lint, type or format suppression. I scanned the diff and the two new files for `eslint-disable`, `ts-ignore`, `ts-expect-error`, `ts-nocheck`, `prettier-ignore`, `biome-ignore` and coverage ignores and found none. `package.json`, `package-lock.json` and every package manifest are unchanged against `main`.

Two payload details differ from the order's text, and WO-066 should read them:

- `refused` is `{ shape, path, span? }` rather than `{ shape, span }`. VER-001's repair rule required the path, and the span is absent only for `malformed-text`, a shape outside WO-060's declared set.
- Check-derived items use `ci:<id>` and `check:<id>`, and refused ids use `refused:N`. None of these is a forge comment id (D003, D012).

## Criteria

**Criterion 1:** met

The AC1 fixture asserts `ci:CR_1` `ci-failure`, `PRRC_1` `automated-review` from a `Bot` author, `PRRC_2` `human-review` and `PRRC_3` `resolved`. It also asserts correlation, causation and workstream from the opening event. It asserts no append for an identical or reordered re-run, and one append each for a new head, a return from B to A, a new comment, an edited body and a resolution change. The F1 case sets `Bot` authors on every connection and on the thread-pagination path, and checks that the four non-bot types stay `reviewer`. VER-002 reproduced the classes over the API's actor shape and the live schema. This review's live run on three populated public pull requests stored the classes the criterion names, and a separate raw GraphQL read agreed item by item (Findings, D015):

- failing checks as `ci-failure`;
- `Bot` authors as `automation`;
- resolved threads as `resolved`;
- people as `reporter` or `reviewer`.

The `target-publish` suite of this review's gate ran these cases on the staged subject.

**Criterion 2:** met

The AC2 fixture first asserts that its screened cases equal `SOURCE_SECRET_SHAPES` plus `SOURCE_URL_FORMS`, so the criterion is judged against WO-060's declared set. Each case is planted after a two-byte `é`. For each one it asserts:

- no text;
- `refused` `{ shape, path, span: { entryId: "comment", start: 3, end } }`;
- neither the match nor the body appears anywhere in the log.

The comment that links only to `github.com` and the safe peer `PRRC_2` keep their text, and the store holds only the log file. The F2 and F3 cases extend the same no-retention search to malformed bodies, refused paths, ids and check names.

**Criterion 3:** met

The AC3 fixture refuses an unrecorded number before any `gh` call. It also refuses:

- invalid JSON at `$`;
- wrong field types at their paths;
- unknown enum values;
- unknown or missing actor types at `author.__typename`;
- GraphQL `errors`;
- a `gh` exit 9;
- number and head mismatches;
- stalled pagination.

Each case exits 1, leaves the log byte-identical, releases the lock and does not echo the fixture's `secret-fixture` marker or a stack trace. VER-002's F4 is a decodable value that cannot be passed back to `gh`, which is outside the three inputs this criterion names; it is judged under Findings.

**Criterion 4:** met

[`smoke.json`](../../evidence/WO-065/smoke.json) records one `PullRequestStateObserved` from `pull-request-observer` against an operator-authorized scratch pull request. That pull request was published through DotLn's own publisher (D004, D006), and the record reduces identifiers to shapes as WO-064's does. It shows the five payload keys, a head and number matching an independent `gh pr view`, causation and correlation matching the opening event, and zero appends on a second run. [`repair-smoke.json`](../../evidence/WO-065/repair-smoke.json) and VER-002 re-observed the same pull request with the repaired reader and appended nothing. That pull request has no checks or comments, so it proves the query and the unchanged-state path but not classification.

This review ran the observer read-only against three public pull requests: `pytorch/pytorch#198710`, `SharpMUSH/SharpMUSH#1390` and `sydlexius/stillwater#3275`. Each was read from a synthetic `PullRequestOpened` in session scratch, so none of them is the criterion's smoke; they add the classification the empty scratch pull request cannot show.

- Every run exited 0 with empty stderr.
- The first run appended one event per pull request, correlated to the opening event. The runs stored 283, 19 and 74 checks (the first over three pages) and 21, 12 and 13 comments.
- Each second run printed "Pull request state unchanged; no event appended."
- The probe's `gh` shim logged 50 calls and no mutation.

**Criterion 5:** met

- **Product 02:** grows from 147,835 to 148,268 bytes (`wc -c` against `main`). That is 433 bytes added of the 450 allowed, and the ceiling is 150,611. The new text is in the paragraph it amends, WO-064's event paragraph in §Actors and episodes (the edge), where it replaces "WO-065 owns the first reader" with no date. It names the event, the same log and `npm run worktree -- observe-pr`, and its sentence on refused text matches the code.
- **Decisions:** the file records D001 to D014 from execution and verification, and this review adds D015. D003 and D005 carry their corrections, and D007's "408 bytes" is the original figure, which D013 updates.
- **Publication locks:** both are current (`publication:check`).

The roadmap's dated release-boundary paragraph is the release label's own record, outside this criterion's list, as in earlier orders.

**Criterion 6:** met

The review gate, `npm test -- --review`, passed at the staged code identity `354e9846…`: 30 passed, 0 failed, 74 fresh tasks, 351.96 s, exit 0, recorded 2026-09-29T02:27:01.778Z. Staging the two new source files moved the identity off the repair's `ae532e8c…`, so the gate ran instead of reusing that row.

- `npm run test:docs` passed after this report was written (Checks).
- `git diff --check` and `git diff --cached --check` are clean.
- No manifest or lockfile changed, so no dependency is added.
- The handoff ledger judges all six criteria met, and the repair completion recorded `unmetCriteria: []`.

## Ideation receipt

D008 is the receipt for the operator's `ideation:` message during execution. I read it with the ledger section `2026-09-29 — Ideation during WO-065: useful delegation with workflow mode`, product 05's new paragraph "Personal workflow profile (specified)" in §Orchestration and quality policies, and the order's breakout paragraph.

- **Traceability:** met.
  - The capture's SHA-256 matches D008 and the ledger.
  - Product 05's paragraph cites D008.
  - The order amendment is bound by its `PlanExecutionAmended` row.
  - `FUP-e62d0d2771185a38` carries the implementation to planning.
- **Source treatment:** Shape-First synthesis of the operator's own account of these harnesses. Nothing is quoted or employer-derived, and no direct-draft filing is claimed.
- **Counting-scope inference:** labeled. Counting over one root workflow task is written as "the synthesis of the operator's comparison against the shared total budget", and D008 calls it an explicit synthesis inference with a reopening condition.
- **Policy consistency:** holds.
  - The floor is scheduled within host concurrency, authority, No Fan-Out and "the remaining root budget (currently 20 including descendants)". That figure matches `docs/control/budgets.json` `subagentCap`.
  - An unmet minimum is reported, not forced.
  - Off-mode sets an expectation, not a cap, and does not equip No Fan-Out.
- **Specification versus enforcement:** distinguished.
  - The paragraph "claims no runtime enforcement or settings change".
  - The evidence README labels the executor's three-agent count actor-attested beside zero instrument-observed admissions.
  - No setting, hook, skill or manifest changed.
- **Helpers:** none was created, so no executable breakout evidence is owed.

## Rows

`npm run plan -- followups --touching` returned 5 pending rows at register revision `d0ecc913…`. Two requests through `followups --apply` recorded two dispositions, and each reason cites this report:

- the first moved the register from `d0ecc913…` to `5dc49d87…`;
- `npm run meta` then harvested D015's follow-up (`8dff5c15…`);
- the second moved it to `1a17689b…`.

| Row | Matched | Disposition recorded | Why |
| --- | --- | --- | --- |
| FUP-7a8e67d555cccc01 (D014: F4, F5, WO-060's C1-control question) | WO-065 | open | F4 and F5 are behavioral repairs, which a reviewer does not write and certify. They fall due before WO-123 composes `observe-pr` into a resident vertical or WO-066 relies on complete observations. |
| FUP-b20c90983e966131 (D015: machine-user automation, admitted hosts) | new, from this review | open | Both limits follow from the order's declared choices, the `Bot` type and the forge-host-only allowlist. Planning judges them before WO-066 relies on automated review text or classes. |

Left as they are:

- `FUP-e62d0d2771185a38`, already open for planning: D008, the delegation profile's implementation.
- `FUP-50cda1c03ecd8ea8`, a textual match on `docs/evidence/WO-065/meta.json`. The byte-proof writer is untouched.
- `FUP-acfe4bfda716d8fb`, a textual match on the generated `current.md`. Usage attribution is untouched.
- `FUP-fd05316b6030ef73`, textual matches on the README release line, the evidence README, the lineage README and product 02. WO-065 edits only WO-064's event paragraph there, and the named standing sentences are unchanged.

The rows this order's repair implemented, `FUP-c327e33bc8eda813` (D009, F1) and `FUP-0b67dbaface3d750` (D010, F2 and F3), are closed as `allocated` to WO-065. Their reopening condition, a VER-001 case that re-verification finds unresolved, did not occur. `FUP-045a0a480f95bcc7` is settled with the reopening condition "either order is activated with a citation that does not resolve". WO-065 was activated citing `scripts/lib/github-repository.mjs`, which resolves.

The worktree's adjacent queue: `adjacent-0001` (F2 and F3) is completed, and nothing is pending.

## Findings

No finding is routed to repair, and no criterion fails.

- **F4: a NUL byte in a value sent back to `gh` echoes response bytes on stderr.** Low to medium. Boarded in [D014](../../evidence/WO-065/decisions.md#wo-065-d014), follow-up `FUP-7a8e67d555cccc01`, opened by this review.
  - `pageInfo.endCursor` and a paged thread id are decoded as any string. One holding U+0000 makes `spawnSync` throw, and the CLI prints the message, which quotes the value's leading bytes.
  - Nothing is stored and the lock is released.
  - It contradicts the observer's own comment "Even errors must not echo an API response" and the evidence README's "No raw API failure text is logged", which is true only for inputs without such a byte. I left the executor's README as recorded and state the limit in the PR body and release notes.
- **F5: one token run of millions of characters overflows WO-060's screen and refuses the whole observation.** Low. Boarded in D014, same follow-up. The error carries no content and nothing is stored. A 65,536-character run is refused per item as intended.
- **A remote reordering with a refused item present appends a new event.** Observation. Refusal paths and `refused:N` placeholders are positional, and the evidence README declares this. A byte-identical re-run appends nothing.
- **The observation is paged, not atomic.** Observation. A head or author change during the read refuses. Other changes between pages, such as a new comment, can land in one page and not another; the next observation records them. D002 and the observer's doc comment state this.
- **A machine account registered as a user is stored as a human reviewer.** Usefulness limit. Recorded in [D015](../../evidence/WO-065/decisions.md#wo-065-d015), follow-up `FUP-b20c90983e966131`.
  - On `pytorch/pytorch#198710` the merge bot's GraphQL type is `User`, so its three comments are `reviewer`/`human-review`.
  - The order lets the executor declare the automation pattern, and the `Bot` type is that declaration. A `User`-typed account cannot be told from a person by type, so this does not fail criterion 1.
  - WO-066 would treat such comments as human review, so planning judges whether an operator-declared login list should count as automation.
- **Most real bot review text is refused.** Usefulness limit. Recorded in D015, same follow-up.
  - Across the three pull requests, 12 of the 21 non-CI `Bot` items were stored as `scheme-authority` refusals without text, and no human item was refused.
  - They link to other hosts: dashboards, badges, the reviewing apps' documentation and the forge's own `docs.github.com`.
  - This is the order's operator-review assumption 3 working as written: the forge host is the whole allowlist until a later order admits more.
  - Its consequence is that WO-066 sees the class and the refusal, but not the text, for most automated review comments.
- **Each multi-comment review thread costs one more `gh` call.** Observation. D005 requests one comment per thread and pages the rest by thread id to avoid amplifying a single response. The live run confirmed the extra call on the two pull requests with multi-comment threads.

## Verification sequence

1. **Activation** at 2026-09-29T00:22:17Z, checkpoint 1.
2. **Implementation** (executor: Codex CLI 0.158.0, `gpt-6-astra`, effort xhigh, mode subagents from raw `ultra`, `codex-session-readback`). `ImplementationReady` at 00:54:32Z, checkpoint 2, `unmetCriteria: []`. It recorded D001 to D008, including the ideation receipt D008.
3. **[VER-001](../../verifications/WO-065/VER-001.md)** (Claude Code 2.1.284, `claude-opus-5-5`, effort xhigh, `claude-session-readback`). Requested at 01:01:04Z, checkpoint 3; failed at 01:15:51Z, checkpoint 4.
   - F1, blocking criterion 1: GraphQL `Bot` logins carry no `[bot]` suffix (D009).
   - F2 and F3, boarded: one malformed or screened string refused the whole observation (D010).
4. **Repair** (Codex CLI 0.158.0, `gpt-6-astra`, effort max, `codex-session-readback`). Requested at 01:20:12Z, checkpoint 5; completed at 01:40:32Z, checkpoint 6, `unmetCriteria: []`.
   - F1 was fixed by decoding the actor type.
   - F2 and F3 were fixed as per-item refusals with field paths, plus a host check before `gh`, under operator-confirmed `adjacent-0001`.
   - It recorded D011 to D013.
5. **[VER-002](../../verifications/WO-065/VER-002.md)** (Claude Code 2.1.284, `claude-opus-5-5`, effort xhigh, `claude-session-readback`). Requested at 01:51:13Z, checkpoint 7; passed at 02:13:46Z, checkpoint 8.
   - F1 to F3 are confirmed fixed and all six criteria are met.
   - F4 and F5 were boarded (D014).
6. **FINAL-001** (this report): dispatched at 02:14:56Z, checkpoint 9. No finding is routed to repair.

## Checks

| Check | Result |
| --- | --- |
| `git fetch origin`, `origin/main`, local `main`, merge base | all `8c28f479`; no integration needed |
| Tags | local and `origin` end at `v0.54.0`; `v0.55.0` is free |
| SHA-256 of VER-001, VER-002 and the ideation capture | each equals its record |
| Staged source bytes against `repair-subject.json` | all five SHA-256 values equal |
| `npm test -- --review` | 30 passed, 0 failed, 351.96 s, 74 fresh tasks, exit 0; recorded 2026-09-29T02:27:01.778Z; code identity `354e9846…`, tree `707ed7c3`; row `host-gate:354e984619e4d28ea08ea59631927af13201581a34ea984f3d826f7f5422134f:npm test` |
| Live read-only run in session scratch on three public pull requests | exit 0 and empty stderr on all six runs; one event each, then unchanged; stored items equal a separate raw GraphQL read; 50 `gh` calls, no mutation (D015) |
| Product 02 | 147,835 to 148,268 bytes (+433 of 450); ceiling 150,611 |
| Suppressions, manifests, lockfile | none added; unchanged against `main` |
| `npm run plan -- followups --touching`, then `--apply` | 5 rows at `d0ecc913…`; two dispositions; register to `1a17689b…` |
| `node scripts/adjacent-work.mjs list` | `adjacent-0001` completed; nothing pending |
| `npm run publication:check` | exit 0; 30 and 45 linked source sections current |
| `npm run harness -- check` | 31 generated surfaces |
| `node scripts/refute-plan.mjs check`, `npm run plan -- check` | exit 0, exit 0 |
| `npm run release -- check-surfaces --local` | exit 0; release block `v0.55.0`; every component `src` unchanged, no bump required; pins exact |
| `npm run release -- prepare --local` | exit 0; `v0.55.0` remains current; meter snapshot (3,862 bytes) and PR meter block refreshed |
| `npm run meta` | exit 0; D015's follow-up harvested; one standing advisory, `sequenceBytes=13965 exceeds 8192`, outside this order; 0 reopen candidates |
| `git diff --check`, `git diff --cached --check` | clean |
| `npm run test:docs` | after this report, D015 and `npm run meta`: 23 passed, 0 failed, 13.38 s, 23 fresh tasks; it runs again inline at the result transition |
