# WO-157 implementation — closeout follow-ups, one order (v0.45.0)

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.280","model":"claude-opus-5-5[1m]","effort":"xhigh","mode":"subagents","raw":"ultracode","source":"claude-session-readback"}

The model is the operator's `/model` selection at dispatch (Opus 5.5, 1M
context). The effort is the operator's ultracode selection; Claude Code exports
the root session's selected effort as `CLAUDE_EFFORT=xhigh`, which this order's
item 11 now admits as `claude-session-readback` (selected, not effective). The
harness version is `claude --version`.

Dispatch: `resume: next`, 2026-09-22, recorded by the harness at 22:45:08Z
before this procedure loaded. The canonical selection was active WO-157 in its
matching `wo-157` worktree with one registered writer. No branch commit, push,
PR, tag or lifecycle repair was performed ([D017](decisions.md#wo-157-d017)).
The operator offered a scratch GitHub repository for real repository or PR
tests; none of this order's checks needed it, so it was not used. Independent
verification and final review remain separate dispatches.

## What changed, by criterion

Each item has one decision recording the route chosen, the fail-before and
pass-after transcripts under [fixtures/](fixtures/), and any deviation.
Every fixture's fail-before was taken twice: in the working tree before the
item's source changed, and again with the final test files in a clone of base
64ab40de ([fixtures/fail-before-sweep.txt](fixtures/fail-before-sweep.txt),
[D018](decisions.md#wo-157-d018)).

| Criterion | Evidence |
| --- | --- |
| 1 — integrate helper and intent-to-add | [D002](decisions.md#wo-157-d002). `worktree integrate` refuses intent-to-add entries before any fetch, checkpoint or receipt, naming each path and `git add -- <paths>`; the same refusal runs at `--continue`. A stash that fails with nothing stashed removes the pending receipt or restores the completed one it replaced; a stash Git stores and then fails to finish is recorded, and `--continue` resumes it. Only a new stash entry with this integration's name and base counts as its own. `scripts/test-worktree-integration.mjs` 9 of 9 ([item-01-after.tap](fixtures/item-01-after.tap)). Product 07's interim sentence is replaced. |
| 2 — deferred queue items get public targets | [D003](decisions.md#wo-157-d003). A `retarget` action changes only a deferred item's target to a current `FUP-` identifier, admitted in `active`, `repairing` and `final-review`, and by a `reviewer` actor for retarget only. It refuses prose, a missing identifier, an extra field and a queued item. `scripts/test-adjacent-queue.mjs` 7 of 7. The regenerated executor skill carries the sync-before-dispose sentence; `harness check --loadout contributor` passes (31 surfaces). Used live: adjacent-0001 below is deferred onto a minted identifier. |
| 3 — files ceiling and removals | [D004](decisions.md#wo-157-d004). The source-change host refuses a change over the envelope's `files` ceiling, and any `D` or `T` entry without `repo.delete` other than the declared Sort source, naming paths and ceiling. The in-ceiling and Sort cases still pass. The `PortfolioCeiling.files` comment matches. Source-change host, portfolio and writer suites 30 of 30 ([item-03-after.tap](fixtures/item-03-after.tap)). |
| 4 — target publication runs no target hook | [D005](decisions.md#wo-157-d005); probe record [writer-profile-probe.md](writer-profile-probe.md). Publication pushes the observed commit from a host-created bare repository, with hooks and fsmonitor off, to origin's configured URL before any rewrite, which must name the resolved repository. Planted `pre-push` and `reference-transaction` hooks, `receivepack`, `core.sshCommand` and an `include.path` setting `core.fsmonitor` do not run. `scripts/test-target-publish.mjs` 6 of 6. |
| 5 — grant-bearing identity | [D006](decisions.md#wo-157-d006). `isCompilationEnvironment` admits the optional `authorityGrantRegistry`, validated by `normalizeAuthorityGrants`; a grant-bearing identity equips and runs a `SourceChangeHost` episode to `observed`; a malformed registry refuses. Product 02 §Artifact identity v1 states the field. |
| 6 — binding compiled under the registered profile | [D007](decisions.md#wo-157-d007). `resident-bind --portfolio/--template/--base` compiles through `registeredRepositoryInputs`. `--check` refuses a hand-written store that departs from the bound repository's `authorityProfile`, naming each departure, and passes a loader-built one. An unreadable, absent or `self` profile refuses by name. `scripts/test-resident-bind.mjs` 21 of 21. |
| 7 — default model | [D008](decisions.md#wo-157-d008). Without `--model` and `--effort`, a bind records `gpt-6-luna` (codex-cli-exec) or `claude-sonnet-5` (claude-cli-print) at `xhigh`, with `modelSource`/`effortSource` `default`; with them, `operator`. Both ids were read back live on 2026-09-22 (claude-sonnet-5 reported by Claude Code 2.1.280; gpt-6-luna accepted by codex-cli 0.155.1). Product 06 states the shipped default and its reopening condition. |
| 8 — refused live episodes carry their reason | [D009](decisions.md#wo-157-d009). The `WorkerInterrupted` payload for `invalid-result` is exactly `{commandId, detail, reason, workerEpisodeId}` from a closed vocabulary. The CLI prints `worker refused: invalid-result (<detail>)`. No raw output reaches the store or the terminal; an unknown detail is recorded as `unclassified`. `verification.test.js` 22 of 22. |
| 9 — confinement witness | [D010](decisions.md#wo-157-d010). New receipts record added, removed and resized scratch path sets (listed up to 100, bound by count and SHA-256) and an untracked-path observation (count and hash only). The witness sentence names only what is observed. The fixture adds one path and removes another. |
| 10 — refutation statement | [D011](decisions.md#wo-157-d011). A refutation receipt records no separate statement and renders `## Attempt reasons`; filed refutations keep theirs. Entropy fixtures 18 of 18; `entropy check` ok. |
| 11 — Claude Code selected-effort readback | [D012](decisions.md#wo-157-d012). `claude-session-readback` is admitted only when `CLAUDE_EFFORT` equals the attested effort. A claude-code `unknown` is refused while the variable is readable. Status and dispatches print the selected-session line. `environment.json` carries the `selectedSessionReadback` row. The role text says the root session reads the variable. `scripts/test-resume.sh` passes. This report's own attestation uses the new source. |
| 12 — registries follow the import graph | [D013](decisions.md#wo-157-d013), [D019](decisions.md#wo-157-d019). Every edition script runs the import-closure check (zero unregistered imports in all five inventories). The feedback subject carries the three request protocols, and a missing imported protocol refuses. In a temporary copy, a changed `entropy-review-protocol.ts` fails `feedback-evidence --check` ("feedback evidence is stale"), an excluded import does not, and an unregistered import is refused by name ([item-12-after.tap](fixtures/item-12-after.tap), run after the re-mint). |
| 13 — registrations row | [D014](decisions.md#wo-157-d014). `test:docs` gains `registrations`: it fails on a planted untracked `docs/**/*.jsonl` and on a removed `entropy.mjs` stub, and passes on the tree ("309 JSONL under docs/ (233 EventEnvelope streams, 76 classified); 21 document-gate tasks stubbed"). |
| 14 — allocation events across section changes | [D015](decisions.md#wo-157-d015). An allocation records `sectionsHash`; the fold validates it against the named set (legacy events use the pinned WO-120 set). A corrupt authority makes only its own order unreadable, named on selection, in status and in the index. `scripts/test-derived-orders.mjs` 13 of 13. The WO-113 map row carries the note. |
| 15 — deterministic gate-sandbox teardown | [D016](decisions.md#wo-157-d016). Cause: Git 2.55's detached auto-maintenance repacking during `rmSync`. The fixture sets `maintenance.auto=false`; each gate tags its roots and fails naming any tagged root that survives. Race reproduced and shown fixed: 172 of 200 ENOTEMPTY unfixed, 0 of 200 as landed ([item-15-race.txt](fixtures/item-15-race.txt)); the opt-in probe is in `scripts/probes/gate-sandbox-race/`. |
| 16 — one re-mint | [D019](decisions.md#wo-157-d019), [D020](decisions.md#wo-157-d020), [D023](decisions.md#wo-157-d023). After the last registered-source edit: authority `WO-157/authority/001`, artifact identity `WO-157/artifact-identity`, verification `WO-157/verification`, feedback `WO-157/feedback-001` with one live self-host episode (below), all selected in `docs/evidence/current.json`; every edition `--check` passes; the harness chain re-ran. Skeleton 0.37.0 → 0.38.0, console 0.1.9 → 0.1.10 with the exact pin. |
| 17 — fixtures and gate | Fail-before per item in the decisions and the base-clone sweep; changed existing expectations are named in D008, D010, D012 and [D022](decisions.md#wo-157-d022) (the role oracle, already red at base). `npm test -- --review`, run outside the sandbox: the first run (2026-09-23T00:27Z, 538.23 s) failed one skeleton case, which pinned the role sentence item 11 rewords. D012 names that change. The second run passed: **41 suites passed, 0 failed, 531.49 s, 85 fresh tasks** (gate row 2026-09-23T00:45:42Z). `npm run test:docs`: 21 passed, 0 failed, 30.23 s. |
| 18 — write-backs | Product 02 §Artifact identity v1 (item 5); product 06 (item 7's default moved to shipped, the release note); product 07 (items 1, 4, 6, 14, 15 and the model-notes pointer); product 03 and docs/AI-HARNESS-SECURITY.md (items 6, 9, 11); the skeleton and entropy-reducer READMEs. `npm run publication:check` passes with refreshed locks. Every item decision carries a reopening condition. The inherited ledger duty is discharged, as the index row says, by this decisions file and its row in the decisions index; no lifecycle ledger append. |
| 19 — checks and ceilings | `git diff --check` clean; no dependency added. The executor cold-start ceiling was raised by the standing route to 29,246 with both rules named ([D021](decisions.md#wo-157-d021)); every other role is within its ceiling. |

## The live self-host episode

`claude-cli-print`, `claude-sonnet-5`, effort `xhigh`, Claude Code 2.1.280,
store `.runtime/feedback-audit-wo157-r001`
([D023](decisions.md#wo-157-d023)).

| Attempt | Started (UTC) | Outcome | Launch | Tokens | USD |
| --- | --- | --- | --- | --- | --- |
| 1 | 2026-09-23 00:17:25 | `worker refused: invalid-result (finding shape)`; pending work retained | 282,226 ms | 1,364,052 | 1.8980914 |
| 2 (same store, retained command) | 2026-09-23 00:22:41 | complete: ten fixtures, 1,192 saved instruction bytes | 31,224 ms | 937,199 | 1.4015924 |
| Total | | | 313,450 ms | 2,301,251 | 3.2996838 |

Usage is from the transport's result envelope
(`docs/control/local/process/usage.jsonl`). Effective model and effort are
unknown; each attempt records only the host-launch selection. The completed
streams are recorded in `WO-157/feedback-001`, and `feedback-evidence --check`
verifies them.

Attempt 1's refusal named its cause only because of item 8. WO-152's two
refused episodes recorded none. The cause is a confirmed gap: when a subject
has no failing witness, the verifier's output schema still admits findings,
and the validator can never accept any finding there. Whether attempt 1's
finding failed on that gap is an inference, because raw output is not stored.
It is boarded up as [D024](decisions.md#wo-157-d024) rather than fixed, since
the fix would edit a registered source and force a second re-mint.

The default-model readback for item 7 cost one further USD 0.139 Claude call
(`error_max_budget_usd` over a USD 0.05 cap) and one minimal Codex call whose
cost is unknown ([D008](decisions.md#wo-157-d008)).

## Adjacent work and follow-ups

- **adjacent-0002, deferred.** The verifier's output schema admits findings
  the validator refuses. It is deferred onto `FUP-c31c7bcab9270f49`
  ([D024](decisions.md#wo-157-d024)) for the next order that re-mints the
  feedback edition.
- **adjacent-0001, deferred.** The source-change host runs writer-controlled
  test code with the operator's privileges. The item 4 probe showed this, and
  it predates the order (product 03). It was queued and deferred onto
  `FUP-92fd86e53b44fa39`, the follow-up minted from
  [D005](decisions.md#wo-157-d005): sandbox the focused test run before
  WO-066's first target publication.
- **Repaired in scope:**
  - the vacuous WO-142 inventory test ([D013](decisions.md#wo-157-d013));
  - `--continue` meeting intent-to-add entries ([D002](decisions.md#wo-157-d002));
  - the role oracle, which had been red since WO-151
    ([D022](decisions.md#wo-157-d022)).
- **Known limits:**
  - no live Codex or Claude writer episode was run for item 4; the probe
    exercised the sandbox profile and the hook directly;
  - whether a nested `claude -p` inherits `CLAUDE_EFFORT` is unprobed;
  - `FEEDBACK_SOURCE_PATHS` still does not follow the whole import graph
    (D013);
  - the pre-existing untagged sandbox root `dotln-gate-sandbox-HzuoRI` is
    left in place (D016).

## Time, commands and cost

The dispatch was recorded at 2026-09-22T22:45:08Z. The handoff reading
below was taken at 2026-09-23T00:45:52Z, so the order took about two hours of
wall-clock. Groups have no separate durations: after 23:27Z the six groups
were edited interleaved, first while implementing and then while repairing the
review's findings. The first edit of each group comes from the session
transcript's tool-call timestamps.

| Group (items) | First edit (UTC) | Commands that establish it |
| --- | --- | --- |
| A (1, 2) | 22:54 | `node --test scripts/test-worktree-integration.mjs`, `node --test scripts/test-adjacent-queue.mjs`, `harness emit`/`check --loadout contributor` |
| B (3, 4, 5) | 23:00 | the skeleton source-change-host, portfolio and writer suites; `node --test scripts/test-target-publish.mjs`; the writer-profile probe |
| C (6, 7) | 23:13 | `node --test scripts/test-resident-bind.mjs`, `scripts/test-authority-grants.mjs`; the live model readbacks |
| D (8–11) | 23:15 | skeleton `verification.test.js`; `node --test scripts/test-entropy-review.mjs`; `npm run entropy -- check`; `bash scripts/test-resume.sh` |
| E (12–14) | 23:27 | `node --test scripts/test-evidence-sources.mjs`, `scripts/test-runner.test.mjs`, `scripts/test-derived-orders.mjs`; `node scripts/check-registrations.mjs` |
| F (15) | 23:32 | `node --test scripts/test-runner.test.mjs`; `node scripts/probes/gate-sandbox-race/race.mjs` |

Other spans:

- The understand workflow was dispatched at 22:49:06Z and the review
  workflow at 23:39:34Z.
- The base-clone fail-before sweep was recorded before 23:50Z.
- The re-mint ran from `npm run build` through the feedback write. Live
  attempts ran 00:17:25–00:22:07Z and 00:22:41–00:23:12Z.
- Gates ran 00:27:01–00:36:00Z (failed) and 00:36:50–00:45:42Z (passed).

Tokens per group are unknown: the harness exposes only the dispatch's
session total. Subagents: 12 of the cap of 20 (7 understand, 5 review; exact
observed count). Whether the session counter includes the subagents' own
tokens is unknown: the harness reports them as 12 unlinked children. Live
spend outside the session is the episode's USD 3.2996838 and the USD 0.139
readback call.

**Process cost:** entry 95,128 tokens; handoff 236,462,816 tokens; source claude-transcript-message-usage (scope dispatch; entry cutoff 2026-09-22T22:45:32Z, handoff cutoff 2026-09-23T00:45:52Z; cost in USD unavailable from this counter)

## Repair after VER-001 (`resume: fix`, 2026-09-23 to 2026-09-24)

**Repair attestation:** Claude Code 2.1.280, model `claude-opus-5-5[1m]`,
effort `xhigh` from `claude-session-readback` (the session exports
`CLAUDE_EFFORT=xhigh`). The canonical selection was WO-157 in `repairing`,
failure source [VER-001](../../verifications/WO-157/VER-001.md), in the
matching `wo-157` worktree with this session as its one writer. No branch
commit, push, PR or tag.

During the repair the operator expanded scope: a fix deferred only to avoid
another re-mint is done now, and a fix deferred for larger reasons may stay
deferred ([D030](decisions.md#wo-157-d030)). The order gained the appended
section "Operator scope expansion — 2026-09-23" (item 16, criterion 20),
bound by `plan amend-order` (`PlanExecutionAmended`, 2026-09-23T01:13:57Z).

| Source | Repair | Decision |
| --- | --- | --- |
| VER-001 F1, criterion 3 | The removal and type-change refusal names the path count and the configured `files` ceiling, or "no files ceiling". | [D031](decisions.md#wo-157-d031) |
| VER-001 F2, criterion 9 | The untracked listing is read untrimmed, and path lists are hashed NUL-terminated (`pathListDigest`): the untracked listing and the scratch path sets. | [D032](decisions.md#wo-157-d032) |
| VER-001 F3, criterion 11 | Under a readable `CLAUDE_EFFORT`, a claude-code attestation must be that effort from `claude-session-readback`; anything else is refused with no event appended. The role text and the security guide say so. | [D033](decisions.md#wo-157-d033) |
| VER-001 F4, criterion 12 | Imports are read from TypeScript's own scanner tokens (`typescript/unstable/ast`), not a text pattern: semicolonless and chained or optioned forms are read, and only type imports are skipped. | [D034](decisions.md#wo-157-d034) |
| Item 16 (D024, adjacent-0002), criterion 20 | The verifier schema states admission's finding rules; with no failing witness it admits no finding and no `fail` verdict. | [D035](decisions.md#wo-157-d035) |
| Criterion 16 | Every edition re-minted after the repair's last registered-source edit, as new revisions, with one new live self-host episode. | [D036](decisions.md#wo-157-d036) |

**Fixtures.** Every new or changed fixture fails against the tree VER-001
judged (`refs/dotln/checkpoint/WO-157/5`), each on its own assertion, in a
clone built from its own sources with only the final fixture files copied in
([repair-fail-before-sweep.txt](fixtures/repair-fail-before-sweep.txt)). F2
reproduces the verifier's colliding hash `ea7fb08b…`. They pass after
([repair-after.tap](fixtures/repair-after.tap);
[repair-item-12-after.tap](fixtures/repair-item-12-after.tap), which runs the
real `feedback-evidence --check` after the mint). Changed existing
expectations are named in D033 (test-resume.sh, test-worktree.sh, the role
oracle) and D035 (three schema pins).

**Independent review.** One read-only subagent (1 of the cap of 20; no
descendants) reviewed the repair before the mint. It found three defects,
and each is fixed in the decisions above:

- F2's listing was still trimmed by `runGit`, so a leading-space path could
  collide.
- My first F4 repair, a grammar-shaped regex, regressed forms the old parser
  caught.
- D034 recorded that TypeScript 7.0.2 exposes no parser API, which was false;
  I had checked only the package's main export.

It also found the item 16 schema equal to or looser than admission
everywhere, on a differential probe, and found no flow wrongly refused by F3.

**Live self-host episode** ([D036](decisions.md#wo-157-d036)):
`claude-cli-print`, `claude-sonnet-5`, effort `xhigh`, Claude Code 2.1.280,
store `.runtime/feedback-audit-wo157-r002`, started 2026-09-24T14:07:55Z.

| Attempt | Outcome | Launch | Tokens | USD |
| --- | --- | --- | --- | --- |
| 1 | complete: ten fixtures, 1,192 saved instruction bytes; no refusal | 172,160 ms | 659,304 (18,499 output) | 1.5648478 |

Usage is from the transport's result envelope. Effective model and effort
are unknown. The verifier received the tightened schema (findings
`maxItems: 0`, verdict `pass` or `unverified`, reconstructed from the
recorded stream) and accepted it.

**Adjacent queue.** adjacent-0002 was revised, announced, started and
completed under the scope expansion. adjacent-0001 stays deferred on
`FUP-92fd86e53b44fa39` by the operator's authorization. The register row for
D024's follow-up (`FUP-c31c7bcab9270f49`) is fixed by D035 and awaits a
planning pass to settle it.

**Context7.** At the operator's request, the scanner rules were checked
against Context7's `/microsoft/typescript` v7.0.2 documentation; the calls
succeeded from this session.

**Checks.** `npm test -- --review`, run 2026-09-24T14:14:16Z to 14:23:02Z
after the mint: **41 suites passed, 0 failed, 525.16 s, 85 fresh tasks**. No
`dotln-gate-sandbox-*` root remained in the temporary directory afterwards,
and the untagged root D016 left in place was also gone (removed outside DotLn;
the session's scratch directory was emptied by the same system-temp cleanup
during the pause between 2026-09-23 and 2026-09-24). Also run on the repaired
tree: the skeleton package (428 of 428); the entropy suite (19 of 19); the
process-debt suite with the ambient `CLAUDE_EFFORT=xhigh` (90 of 90);
`scripts/test-resume.sh` and `scripts/test-worktree.sh`; every edition
`--check`; `harness check --loadout contributor` (31 surfaces);
`harness-context --check` (executor 25,183 of 29,246 bytes, reviewer 23,071
of 24,576, verifier 21,893 of 25,151); `npm run publication:check`;
`npm run plan -- check`; `release check-surfaces --local` (44 PASS;
`release prepare --local` keeps target v0.45.0, with no component bump beyond
skeleton 0.38.0, since compiler, kernel and console sources are unchanged);
and `git diff --check`.

**Repair process cost:** entry 83,716 tokens (2026-09-23T01:05:32Z); handoff
61,021,827 tokens (2026-09-24T14:23:08Z); source
claude-transcript-message-usage, scope dispatch; USD unavailable from this
counter. Live spend outside the session: the episode's USD 1.5648478.
Subagents: 1 of 20, exactly observed. The wall-clock includes a pause of
about 36 hours between the review's return and the resumed work.
