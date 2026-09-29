# WO-116 implementation evidence

Dispatch `resume: next` on 2026-09-28, recorded by the harness after the order's activation at 22:36:48Z. Executor: Claude Code 2.1.284, model `claude-opus-5-5`, effort `max` read from `CLAUDE_EFFORT` (the root session's selected effort, not an effective readback). One writer, this session. Subagents: three read-only readers (procedure, byte budgets, contract enumerations) and a read-only review of four lenses with one batch verifier, all through workflows; none wrote. Operator steering: one `conversation only:` question during the dispatch, asking what the order is and why it matters, answered in chat without pausing work; no direction, veto or scope change.

## What changed

| Item | Change | Decision | Fixture |
| ---- | ------ | -------- | ------- |
| 1 | `dotln audit --store <directory> [--workstream <id> \| --episode <id>]` in packages/skeleton/src/dotln.ts: reads the store's `events.jsonl`, selects envelopes by workstream or episode, prints the fold's three projections unchanged | [D002](decisions.md#wo-116-d002--the-terminal-command-selects-envelopes-before-the-unchanged-fold) | packages/skeleton/test/audit-command.test.ts, first two cases |
| 2 | Refusals: a store with no events, an absent workstream or episode, the fold's own refusals, the audit usage | [D003](decisions.md#wo-116-d003--refusals-in-the-terminals-words) | audit-command.test.ts, second case; console-commands.test.ts WO-116 |
| 3 | `dotln.audit` in `console-commands-v1`, classified `shell.run` by the terminal classifier | [D004](decisions.md#wo-116-d004--one-contract-identifier-classified-by-the-terminals-classifier) | console-commands.test.ts: the WO-115 enumerations and WO-116 |
| 4 | The text host renders the served bytes through `console invoke` | [D005](decisions.md#wo-116-d005--the-text-host-renders-the-served-bytes-through-invoke) | console-commands.test.ts WO-116 |
| 5 | No redaction or access rule in the served command | [D006](decisions.md#wo-116-d006--the-served-command-serves-the-terminals-bytes-and-adds-no-access-rule) | console-commands.test.ts WO-116: served bytes and envelope keys |
| 6 | `packages/skeleton/src/audit.ts` unchanged; no edition re-minted | [D007](decisions.md#wo-116-d007--the-audit-fold-is-unchanged-nothing-is-re-minted) | `git diff -- packages/skeleton/src/audit.ts` empty |
| 7 | Write-backs: product 09 (+343 bytes), product 04 (+49 bytes), the console README's parity paragraph and example | [D010](decisions.md#wo-116-d010--write-backs-in-place) | docs-check, check-publication |
| 8 | Release `v0.54.0`: skeleton `0.44.4` to `0.45.0`, console pin and lockfile, roadmap paragraph, README block, heading, publication locks | [D009](decisions.md#wo-116-d009--release-v0540-skeleton-0450-console-pin-and-lockfile) | `release check-surfaces --local` |
| 9 | Adjacent repair: the dotln usage and unknown-command list name `handoff answer` (Follow-up Queue `adjacent-0001`) | [D011](decisions.md#wo-116-d011--adjacent-repair-the-dotln-usage-and-command-list-name-handoff) | audit-command.test.ts, third case |
| 10 | Economy experiment: spawn the terminal entrypoint per case, kept | [D001](decisions.md#wo-116-d001--economy-experiment-spawn-the-terminal-entrypoint-for-each-audit-case) | — |
| 11 | Observed limit and a met reopening condition, for planning | [D008](decisions.md#wo-116-d008--observed-limit-a-resident-stores-own-events-are-context-to-the-fold), [D012](decisions.md#wo-116-d012--fup-0053s-reopening-condition-is-met-its-disposition-stays-with-planning) | — |
| 12 | Ideation breakout on the operator's `ideation:`: capture in this worktree's ignored intake, one idea-ledger section, one planning-map candidates section; no product surface | [D015](decisions.md#wo-116-d015--ideation-breakout-receipt-utilization-not-activation-while-a-phase-waits) | `lineage index --check`, `meta --check` |
| 13 | Two failures the operator named during the dispatch, recorded as corrections | [D013](decisions.md#wo-116-d013--correction-activation-not-utilization-while-the-review-ran), [D014](decisions.md#wo-116-d014--correction-a-capture-aimed-at-the-main-checkout) | — |

The [fixture transcripts](fixtures.txt) hold the TAP summaries, the byte comparison with the skeleton's `--audit`, the refusals and the resident-store audit.

## Measurements

- The fixture log's projections: the skeleton CLI's `--audit` section and `dotln audit` over a store holding that log are 59,613 bytes each, sha256 `ec659a6d15835727…`, identical for the whole log, `--workstream ws_repo_garden` and `--episode ep_seiri_1`.
- Product 09: 50,759 to 51,102 bytes (+343 against the order's 400), ceiling 51,775, headroom 673. Product 04: 59,662 to 59,711 bytes (+49 against 200), ceiling 60,856, headroom 1,145.
- Spawn cost of the dotln entrypoint: 0.06 to 0.08 s per call on the operator's host (D001).
- Fixture durations on the operator's host, at the final code: the three terminal cases 1.47 s; the WO-116 loopback case 2.83 s inside the console file's 19.52 s.

## Gates at the subject

- `npm test -- --again --review`: 29 suites passed, 0 failed, 73 fresh tasks, 320.16 s, recorded 2026-09-28T23:48:16.012Z at code identity `598c484dc463bef3c1c2fba846f5b0fe498523f9b7533ca9f92f5c55e772f2d6`, evidence `host-gate:598c484dc463bef3c1c2fba846f5b0fe498523f9b7533ca9f92f5c55e772f2d6:npm test`. It ran with `--again` because the untracked audit-command test changed after the first row (318.94 s at 23:17:10Z, code identity `c6547c0a…`) and the gate's code identity hashes tracked paths only. The selection is the runner's own `--review --list`: build, the release, publication, resume, checkpoint and worktree fixtures, kernel, compiler, skeleton, console, the adjacent queue, resident-bind, derived orders, portfolio and the other machinery rows.
- `npm run test:docs`: 23 tasks passed, 0 failed, at 23:08:23Z, 23:20:55Z and 23:36:54Z (13.37 s), including format, docs-check, publication, meta and the four edition checks; the completion runs it again inline.
- `node scripts/release.mjs check-surfaces --local`: exit 0. `npm run release -- prepare --local`: `WO-116 target v0.54.0 remains current`; it wrote [meta.json](meta.json) (2,908 bytes) and the PR meter block.
- `git diff --check`: clean for tracked and untracked changes.

## Follow-up rows this change touches

- `FUP-3d4b39cd4b2c4a08` (new, pending): audit action classes for a resident store's own events ([D008](decisions.md#wo-116-d008--observed-limit-a-resident-stores-own-events-are-context-to-the-fold)).
- `FUP-0053` (deferred until `WO-116 activation or an observed mis-association`): the activation meets its condition; its disposition stays with planning, with one derived observation about selections ([D012](decisions.md#wo-116-d012--fup-0053s-reopening-condition-is-met-its-disposition-stays-with-planning)).

## Observations and limits

- A resident store audits without refusal, but its own events are context to the fold: L0 and L1 are empty and only governed raw shows what the resident did, and the fold's omission labels name the fixture over any store (D008).
- A selection is one projection run over the selected envelopes, so adjacency-derived pairings are judged within the selection; no store observed in this order interleaves workstreams (D002, D012).
- `npm run meta` reports one process-budget advisory, `sequenceBytes=13965 exceeds 8192`, from the planning sequence file this order does not touch.
- `npm run meta` also counts 19 guard refusals for WO-116 and names policy resistance a reopen candidate (the count worsened over three consecutive order deltas). The executor ran `npm test -- --review` while the read-only review was probing, and the live-gate write guard refused the reviewers' probe commands in that window: their transcripts carry the refusal text, the three earlier readers' carry none, and the executor met that guard once; later the outside-write guard refused the executor's capture aimed at the main checkout ([D014](decisions.md#wo-116-d014--correction-a-capture-aimed-at-the-main-checkout)). Running the gate after the review instead would have spent about 319 s more wall-clock without those refusals.
- Failures the operator named, recorded as corrections: while the review ran, the executor kept its turn alive with repeated status checks that had no question to answer and no end, activation rather than utilization, on an unread assumption that stopping was unsafe ([D013](decisions.md#wo-116-d013--correction-activation-not-utilization-while-the-review-ran)); during the ideation breakout it aimed the raw capture at the main checkout's intake instead of its own worktree, a write the guard refused and that belongs to final review or release close ([D014](decisions.md#wo-116-d014--correction-a-capture-aimed-at-the-main-checkout)). The capture in this worktree's ignored intake awaits that reconciliation.
- Errors of this execution, corrected before any record: a first build was piped through `tail`, which hid its exit status, so one test run read the previous dist and reported a vacuous pass; the build is rerun under `pipefail` since. A first refusal transcript printed `exit 0` because a command substitution ran before `$?` expanded; the transcript was recaptured with the status saved first. The `handoff` listing (D011) was edited before its Follow-up Queue item was recorded; the item was queued, announced, started and completed with its checks afterwards.
