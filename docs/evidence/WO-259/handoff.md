# WO-259 implementation handoff

WO-259, committed words and filed records, executed on branch `wo-259` over
`main` at `898f95ff`. Main has not moved (`git ls-remote origin
refs/heads/main` reads `898f95ffde31…`, the merge base), so nothing was
integrated. Release target v0.122.0 ([D001](decisions.md#wo-259-d001));
`@dotln/compiler` 0.43.0 and `@dotln/skeleton` 0.89.0
([D013](decisions.md#wo-259-d013)). Handoff code identity
`1a504cda03bed23dc4b6e27c88aa9595d03f6fa667ec8b85e0c37ca7758cb5e1`. The
decisions are D001 to D023 in [decisions.md](decisions.md); the fixture
outputs and the final rows are in [criteria-fixtures.txt](criteria-fixtures.txt).
The branch holds no commit: it commits at final review.

The operator classified one part of this execution as a critical error for
the next planning session: the executor carried out review findings' fixes
without judging whether real writers produce the inputs they named
([D022](decisions.md#wo-259-d022); `FUP-6fe1262fb31292b3`, disposed open).
The final reviewer should read D022 first.

## Criteria

**Criterion 1:** met. All fourteen installed role roots (`SKILL.md` for the seven roles under `.claude/skills/` and under `.agents/skills/`) and the three worker definitions that render the one worker prompt (`.claude/agents/dotln-worker.md`, `.claude/agents/dotln-worker-fable.md`, `.codex/agents/dotln-worker-astra.toml`) carry the paraphrase rule and both no-print rules (the contents of `docs/control/local/`; a commit header or an author line): a grep of each rule's sentence counts one in every file. Both router roots name awaiting-plan-approval with the operator's next step. Cold starts against WO-258-D013's acceptances: executor 45,319, planner 31,536, refuter 28,316, release-close 29,394, reviewer 42,117, router 17,991 and verifier 39,471 bytes; the executor, planner, release-close, reviewer and verifier stand accepted, the router is within its 21,220 ceiling and the refuter has no ceiling set, so no ceiling moves and no acceptance route was needed. No role text or role source changed after round 1's tree, and the process-debt suite, which runs the role oracle `wo259-role-baseline.json` and `scripts/test-gate-followups.mjs`'s cold-start budgets, passed at the handoff code identity. [D003](decisions.md#wo-259-d003).

**Criterion 2:** met. The WO-259 cases in `scripts/test-docs-check.mjs` run `node scripts/docs-check.mjs` in fixtures. With one ignored capture, a changed decisions file carrying a run of the capture's words at the declared 12-word window fails as `FAIL <file>:<line>: 12 or more consecutive words shared with the ignored capture sha256:<digest>`, and the output holds none of the words; the same record with `operatorQuote` carrying `captureSha256` and `requestedIn` passes; with `features.verbatim-operator-words` elected the line prints as an advisory and the check exits 0; a file unchanged against the merge base is not screened, nor a run the base already held; a changed `scripts/` source fails the same way at its line; a checkout with no capture prints `verbatim screen: no captures` and passes. A directory or capture under the intake root that its owner closed is named in an advisory and never fails the check, while a changed file the screen cannot read still fails ([D020](decisions.md#wo-259-d020)). One boundary is recorded, not fixed: a record whose JSON spells the `operatorQuote` or `text` key with unicode escapes loses the exemption and fails closed ([D021](decisions.md#wo-259-d021)). docs-check-fixtures is a document task and passed in the final `npm run test:docs` row (§Gates). [D005](decisions.md#wo-259-d005), [D006](decisions.md#wo-259-d006).

**Criterion 3:** met. The same fixture plants both records: a current record the branch adds with attributed speech and no capture citation fails `node scripts/docs-check.mjs` naming WO-999-D001, and the same text in a historical record keeps its note, counted under `historical baseline: 1` with no failure; a record written before the branch keeps its advisory. docs-check-fixtures, final `npm run test:docs` row (§Gates). [D006](decisions.md#wo-259-d006).

**Criterion 4:** met. In `scripts/test-harness.mjs` (harness-fixtures) four hand-back envelopes journal with source `host-agent-handback`, attribution `host` and routeSource `host-agent-handback-envelope`, and five malformed shapes keep their attribution. In `scripts/test-plan-refutation.mjs` (plan-refutation), `npm run plan -- check` refuses a `Rules recorded` entry naming that row's `recordedAt` and session, naming the source, and `npm run plan -- failures` counts the row as `hostHandbacks`, in no intervention count. The envelope's shape was re-observed in this session as metadata only: 581 bytes in four lines, an `agent-message` element with a `from` attribute, the `[Subagent hand-back]` frame line, an indented report line and the closing tag. Both suites passed at the handoff code identity. [D008](decisions.md#wo-259-d008).

**Criterion 5:** met. `npm run worker -- review --kind criteria --host claude --order WO-259 --dry-run`, replayed after the first passing complete review ([criterion-5-brief.json](criterion-5-brief.json), written by [criterion-5-brief.mjs](criterion-5-brief.mjs)), exits 0 and prints a brief whose preamble (2,053 characters before its `## Brief` heading) carries the paraphrase rule, the `docs/control/local/` rule and the author-line rule, with the measured size beside it: 41,597 against the 400,000 ceiling in one batch. The worker definition and the brief's renderer did not change afterwards. `scripts/test-review-worker.mjs`, run inside plan-refutation, pins the three rules for every kind on both hosts. [D004](decisions.md#wo-259-d004).

**Criterion 6:** met. In `scripts/test-runner.test.mjs` (runner-fixtures), with a registered list carrying one `refuse:` term and a changed Markdown file carrying it, `npm run test:docs` fails first in the `terms` task with `FAIL docs/carried.md:3: a local term in refuse mode` and no term in the output; with no list the task prints `local-terms list: unavailable` and its advisory, and the gate passes. Against the fixture's bare origin, `node scripts/refute-plan.mjs publish` (`scripts/test-plan-refutation.mjs`) and `node scripts/launchpad.mjs update --publish` (`scripts/test-launchpad-update.mjs`) refuse a branch whose committed change carries the term before any push. runner-fixtures, plan-refutation and the launchpad update file passed at the handoff code identity, and this branch's own `terms` task passed in the final document row (§Gates). [D009](decisions.md#wo-259-d009).

**Criterion 7:** met. In `scripts/test-worktree.sh` (worktree), with the committed control record at phase active, `node scripts/worktree.mjs publish WO-099 --title --body-file` refuses with `WO-099 has no committed passing final review: its committed control record reads phase active` and nothing reaches the origin; after the passing final review is committed, the same form pushes and opens the pull request. The worktree suite passed at the handoff code identity. [D010](decisions.md#wo-259-d010).

**Criterion 8:** met. [criterion-8-discovery.json](criterion-8-discovery.json), replayed after the first passing complete review: on a record without `versions`, `node scripts/discover.mjs harness claude-code` records one version (2.1.319) and one line, and a second run records nothing new and prints `already recorded`; with the record hand-broken, `npm run resume -- status` prints `Discovery record: docs/discovery/environment.json cannot be parsed (Unexpected end of JSON input); …` and no missing-observation line. Neither module changed afterwards; process-debt and resume passed at the handoff code identity. [D011](decisions.md#wo-259-d011).

**Criterion 9:** met. [criterion-9-records.json](criterion-9-records.json), written by [criterion-9-records.mjs](criterion-9-records.mjs) and replayed at the handoff identity (its fixed arm's module digest `ecb944bee2c7…` is the current `scripts/lib/target-records.mjs`), holds both arms with their exit codes: control 1, fixed 0. Fixed: `npm run resume -- target-records` with uncommitted sources refuses (exit 1) naming the commit step; after the records commit it files (exit 0) with a footer naming that commit, and after the launchpad publish every relative link of each filed record resolves at that commit on the bare origin (`git cat-file -e`, exit 0). Control, the module at `898f95ff` filing before the commit: the footer names a commit holding none of the three filed records, and `probe.json` exits 128. The arms follow Markdown links; a raw HTML link's character references decode through the document check's own decoder ([D021](decisions.md#wo-259-d021)), and the filing case in `scripts/test-target-worktree-publish.mjs`, whose record links `<a href="pro&#98;e&period;json">`, files once `probe.json` is committed. The target-worktree publish file passed at the handoff code identity. [D012](decisions.md#wo-259-d012).

**Criterion 10:** met. The write-backs land in their named sections, each replacing the sentence now wrong ([D014](decisions.md#wo-259-d014)). Product 07's §Documentation freshness and ownership, §Verification review and attack, §Operator-opened planning pass and §Workflow closeout and releases link D003, D006, D008, D009, D010, D012, D016 and D020. The kit guide's §Features, §Planning in this instance and §Document quality link D005, D006, D008 and D009, and §Releases in this instance links D012; §First steps is the `kit-first-steps` entry point, where the document check refuses a record link, so its two write-backs link by anchor to §Document quality and §Releases in this instance, which cite D009 and D012, as WO-258-D028 did. The playbook's target reviewer sequence links D012, and `npm run meta` regenerated `docs/control/FEATURES.md`. The decisions record each step with its evidence and reopening condition (D001 to D023), the declared 12-word window with its reason ([D006](decisions.md#wo-259-d006)), and the `docs-check` and `terms` task timings before and after ([D007](decisions.md#wo-259-d007); in the final document row, run beside the other document tasks, `docs-check` took 37,306 ms and `terms` 1,638 ms, within D007's reopening bounds). The release's Read before upgrading names the re-emit and a new session: `criticalNotes` in `scripts/release.mjs`, which the release renders under Read before upgrading, derives over this branch's changed files "re-emit with node scripts/harness.mjs emit and start a new session" for the emitted host settings (`packages/compiler/src/harness.ts`) and for the feature election (`scripts/lib/feature-registry.mjs`) ([criteria-fixtures.txt](criteria-fixtures.txt)).

**Criterion 11:** met. `npm test -- --review` passed at the handoff code identity in a complete row covering the review selection, which product 07 reads for `npm test` too; `npm run test:docs` passed on the same candidate tree; `git diff --check` prints nothing and exits 0 (§Gates).

## Gates

- `npm test -- --review`: row `npm test`, exit 0, 560,379 ms (0 h 9 min),
  recorded 2026-11-08T20:27:02.231Z, selection review, tree
  `c3a441f0446a1e3220794ccd4cdaa24c42870996`, code identity `1a504cda03be…`:
  45 passed; 0 failed; 10 fresh tasks. It executed the structural
  preflight, instance-history, browser-evidence and both vertical files, and
  carries every other suite's pass from the run recorded
  2026-11-08T20:10:51.535Z at the same code identity, which executed them.
- `npm run test:docs`: exit 0, 139,667 ms (0 h 2 min), recorded
  2026-11-08T20:29:43.809Z on the same tree: 28 passed; 0 failed.
- `git diff --check`: no output, exit 0.
- Failed attempts, each recorded with its cause:
  - Both fully fresh complete runs (recorded 18:04:43Z, 3,014,748 ms, and
    20:10:51Z, 3,178,934 ms) failed only in instance-history: the updated
    fixture instance's nested configuration-root reached its 30-second suite
    deadline under the run's concurrency, so browser-evidence and the
    vertical files never started. No cause on this branch was found, and the
    recurrence reopens WO-225-D019 for planning
    ([D019](decisions.md#wo-259-d019), [D023](decisions.md#wo-259-d023)).
  - The attempt recorded 18:16:19Z (54,617 ms) stopped in the generated
    preflight because D019 had been added without regenerating the
    decisions index.
  - The document gate recorded 18:43:56Z failed docs-check-fixtures: round
    1's fix made the verbatim screen fail the check on a closed intake
    directory, which the private roots' rule admits; D020 repaired it and the
    code identity moved from `f32b6b06671c…`, where a complete row had
    passed at 18:28:07Z, to the handoff identity.

## Review

self-review (Codex gpt-6.1-sol at max through npm run worker -- review, D002): found 20; fixed 19; recorded 1; rounds 4; unreviewed 241 lines (after round 4's tree 27770ee8: its F2 and F3 fixes, D021 to D023, the register and the regenerated pages, judged under D021 and D023). Reports: `docs/control/local/reviews/WO-259/round-1-criteria.md`, `round-1-design.md`, `round-1-consistency.md`, `round-2-criteria.md`, `round-2-design.md`, `round-2-consistency.md`, `round-3-combined.md` and `repair-2/round-4-combined.md`.

Round 1, three workers over tree `bd76fb65`, found ten findings, eight
distinct ([D016](decisions.md#wo-259-d016)). Round 2's three rechecks over
`99b0b6ba` held seven of them, found two fixes incomplete and admitted three
new breaks ([D017](decisions.md#wo-259-d017)). Round 3, one combined worker
over the delta since `99b0b6ba`, found four
([D018](decisions.md#wo-259-d018)). Round 4, the repair's ladder after the
document gate's failure (D020's repair added 38 source lines, under product
07's fifty), read everything after round 3's tree and found three: F2 and F3
fixed, F1 recorded ([D021](decisions.md#wo-259-d021)). The 241 lines after
round 4 are 74 of source (`scripts/docs-check.mjs`,
`scripts/lib/markdown-links.mjs`, `scripts/lib/target-records.mjs`), 5 of
the filing case, and 162 of records, standing text and regenerated files
(D021 to D023, the follow-up register, the decision index, product 07's
D020 sentence and its publication lock). This handoff, the appended fixture
record and the replayed criterion evidence are records written after the
ladder. D022 records, as the operator classified it, that the executor took
the rounds' fixes for contrived inputs as asked instead of judging them.

## Follow-ups and carry-ins

- `FUP-6fe1262fb31292b3`: [D022](decisions.md#wo-259-d022), critical as the
  operator classified it; disposed open, so `plan start` lists it ahead of
  the deferred and untriaged rows.
- `FUP-67944ed9c85b7199`: [D021](decisions.md#wo-259-d021), an admission
  rule for review findings against hand-written readers; untriaged.
- `FUP-7b7e2e59a8ef2e06`: WO-225-D019, reopened by
  [D019](decisions.md#wo-259-d019) and [D023](decisions.md#wo-259-d023);
  untriaged.
- Delivered carry-ins, whose register rows final review disposes
  ([D015](decisions.md#wo-259-d015)): `FUP-9cfd1cd290f68d1b` by D010,
  `FUP-1c2f009b880027e6` by D003 and `FUP-1b94e79e02e54e70` by D009.

## Attestation and usage

- Actor: `claude-code` 2.1.319 (the version the criterion 8 replay's real
  discovery observed), model `claude-opus-5-5`, effort `max` from this
  session's `CLAUDE_EFFORT`, source `claude-session-readback`.
- Workers: eight review workers on Codex `gpt-6.1-sol` at max effort through
  the review helper ([D002](decisions.md#wo-259-d002)) and one Claude probe
  worker for the hand-back observation ([D008](decisions.md#wo-259-d008)):
  nine uses of the cap of 20, none re-tasked.
- Usage: `node scripts/harness.mjs usage
  ff145f23-f97e-4761-8caa-61db141bbc2f`, observed
  2026-11-08T20:30:12.465Z, source `claude-transcript-message-usage`, scope
  dispatch: 329,102,536 total tokens (input 1,458; cached input
  326,999,731; cache write 1,404,056; output 697,291; reasoning output and
  cost unknown, counters unavailable). The command prints no cutoff.
  Dispatch standing 6 h 57 min of the 8 h 0 min bound; complete runs 4 of
  20.
