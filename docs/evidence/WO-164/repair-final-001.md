# WO-164 repair of FINAL-001

Operator dispatch: `resume: fix`, 2026-09-27, on
[FINAL-001](../../final-reviews/WO-164/FINAL-001.md). The original order and
FINAL-001's findings F1 (D010), F2 (D011) and F3 (D012) remain the obligation.
During the dispatch the operator widened F2 from disposition to completion
with a `scope expand:` direction to implement the three known issues where no
planning pass is needed, and then, with a second `scope expand:`, asked for
`main` to be merged in.
[D013](decisions.md#wo-164-d013--repair-final-001-the-caches-root-derivation-and-the-listings-lazy-manifest-attribution),
[D014](decisions.md#wo-164-d014--receipt-028s-three-known-issues-two-implemented-one-stated-from-dated-measurements)
and
[D016](decisions.md#wo-164-d016--merge-main-and-hand-off-the-repaired-subject)
record the choices, alternatives, goal alignment and reopening conditions.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.283","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

The harness version is from `claude --version`, the model is this session's
model as the host reports it, and `xhigh` is the host's `CLAUDE_EFFORT` value,
the selected effort and not an effective one.

**Process cost:** entry 82,835 tokens (61,652 cached input, 20,728 cache-write,
4 uncached input, 451 output), source claude-transcript-message-usage, dispatch
scope, observed 2026-09-27T18:50:11.229Z. Handoff counters belong in the
ignored harness receipt and the response. Reasoning tokens and dollar
cost are unavailable from this counter, which means unknown, not zero. No
subagents were spawned (0 of the cap of 20). D001 remains this order's one
economy experiment; this repair starts no second one.

## Change

- **F1.** `scripts/lib/release-list-cache.mjs` resolves its scripts directory
  as `join(TOOL_ROOT, "scripts")` through `scripts/lib/config.mjs`. The
  directory is the same one the module's own URL resolved.
- **F3.** `release list` keeps a throw from `manifestWorkOrders` in place of
  an uncached release's attribution and throws it only when that release's
  range attributes nothing, the one case in which the original read it. A
  record holding an error never enters the cache.
- **Receipt 028 (1), criterion 4.** When `resume status --all --json` fails or
  returns ids that differ from the control log, the collector reads each
  order with `status --json --work-order` and returns the result under
  `resume:status--json#per-order-fallback`. If that fails too, the fold's
  failure is reported under `resume:status--json`.
- **Receipt 028 (2), criterion 3.** `harness prune` lists
  `docs/control/local/cache/release-list.json` as a retained
  `release-list-cache` row and never removes it. Product 07's prune paragraph
  and the console README state the new behavior.
- **Receipt 028 (3), criterion 2.** D014 states the observed growth rate from
  dated measurements; no code changes.
- **Adjacent defect, deferred.** An empty-range DotLn tag with a non-array
  `changedFiles` fails the whole listing in the original and repaired code
  alike. Queue item `adjacent-0001` is deferred onto `FUP-e2cf2122a642d1e0`
  (D013's follow-up).

## Integration of `main`

`npm run worktree -- integrate WO-164` fast-forwarded the branch from
`894be584` to `371b7a08` (WO-171 merged, v0.52.6), with checkpoint
`refs/dotln/checkpoint/WO-164/12` and named stash `4692cd22` retained. Before
it ran, the two new source files were staged fully, because the integration
refuses intent-to-add entries. Three authored conflicts were resolved (D016):
`scripts/lib/harness-prune.mjs` (WO-171's judge structure kept whole, the
cache row added as `judgeListingCache`), `docs/product/06-roadmap.md` (both
activation notes, newest merge first) and `docs/planning/followups.json`
(three-way merge by row). Release preparation retimed WO-164 from v0.52.6 to
v0.52.7, and the console README follows. The integration's draft decision
D015 is left for the final reviewer to complete.

After the merge, the document gate found two defects in this subject.
Product 07 was 221 bytes over its ceiling, because WO-171's additions and
this order's met there. Prettier also flagged `packages/console/src/collect.ts`
and `packages/console/test/collect.test.ts`, both edited in this repair. The
WO-164 after-figure paragraph in product 07's cold-gate candidate was tightened
in place with every figure kept, leaving 49 bytes of headroom. The two files
were formatted, a whitespace-only change.

## Measured outcome on the operator's tree

Before the merge: 2026-09-27T19:02:27Z, 113 orders, 104 annotated tags,
1-minute load 4.92 to 5.29.

| Measurement | Result |
| --- | --- |
| `release list`, original (`git archive HEAD` of `scripts` and `packages`, run with `DOTLN_LAUNCHPAD`) | 6,162 ms; 105 lines; SHA-256 `273ea687117b3f0c586aa8b6a104b56fcd943cddfd485c17e8a5749bc299706a` |
| `release list`, repaired, cache removed | 1,684 ms; same bytes |
| `release list`, repaired, warm | 62 ms; same bytes |
| `collectSources`, cache removed, fresh processes | 2,312; 2,258; 2,297 ms |
| `collectSources`, warm, fresh processes | 672; 655; 640 ms |

After the merge: 2026-09-27T19:22:10Z, 114 orders, 105 annotated tags, 1-minute
load 3.22 to 3.36.

| Measurement | Result |
| --- | --- |
| `release list`, original (`main`'s script from `git archive HEAD`) | 5,785 ms; 106 lines; SHA-256 `2481906d740370d873f36f4d0fb92163e2e7debbd83772688aa674b4c755e21d` |
| `release list`, repaired, cache removed | 1,602 ms; same bytes |
| `release list`, repaired, warm | 58 ms; same bytes |
| `collectSources`, cache removed, fresh processes | 2,160; 2,177; 2,197 ms |
| `collectSources`, warm, fresh processes | 628; 633; 645 ms |

Every `collectSources` run, before and after the merge, returned every order's
status (113, then 114) under `resume:status--json` (the fold, not the
fallback), that tree's listing hash and no unavailable source. The collector's normal path and the listing's rows are unchanged, so
the board follows from these two sources (inference from `collect.ts`, as in
FINAL-001; this repair did not re-render the original board).

## Synthetic listing comparison (F3)

A fixture repository with four DotLn releases, one commit each, whose
manifests carry `notes.changedFiles` as a string, an object, a number and
null. The original, the repaired cold listing and the repaired warm listing
were run against it, before and after the merge, with the same result:

| Case | Original | Repaired cold | Repaired warm |
| --- | --- | --- | --- |
| Non-empty ranges | exit 0, rows `v0.1.1`–`v0.1.4` attributing `WO-911`–`WO-914`, empty stderr | identical | identical |
| An added empty-range tag with a string value | exit 1, no stdout, `error: ((intermediate value) ?? []).flatMap is not a function or its return value is not iterable` | identical | identical |

## Regressions and mutation checks

| Check | Result |
| --- | --- |
| `node scripts/test-configuration-root.mjs` | 13 passed, 0 failed |
| `node --test packages/console/dist/test/collect.test.js` | 1 passed (11.3 s): the census, the fallback case and the non-array manifest rows |
| Same test with checkpoint 11's `scripts/release.mjs` | fails: `flatMap is not a function`; file restored and compared byte for byte |
| Same test with checkpoint 11's `packages/console/src/collect.ts`, rebuilt | fails at the fallback census, 4 node processes where 13 are expected; source restored byte for byte and rebuilt |
| `node --test --test-name-pattern="WO-142 D1\|prune" scripts/test-harness.mjs` | 10 passed, 0 failed |
| Prune fixture with checkpoint 11's `scripts/lib/harness-prune.mjs` | fails: `actual: []` for the `release-list-cache` row; file restored byte for byte |
| `node scripts/harness.mjs prune` (read-only) on this checkout | exit 0; 30 candidates, 14 retained, including the `release-list-cache` row |
| `npm run release -- prepare --local`; `check-surfaces --local`, before the merge | target v0.52.6 remained current; 51 PASS, exit 0 |
| `npm run publication:check`, before the merge | both editions current after the software-engineer lock moved to `615c4219…` for product 07's edit |
| After the merge: `node scripts/test-configuration-root.mjs`; the console collection test; `node --test --test-name-pattern="WO-142 D1\|prune\|WO-171" scripts/test-harness.mjs` | 13 passed; 1 passed (9.2 s); 19 passed; none failed |
| After the merge: `npm run publication:check`; `node scripts/harness.mjs check`; `npm run release -- check-surfaces --local` | both editions current; exit 0 with 31 generated surfaces; 51 PASS, exit 0, at target v0.52.7 |
| `npm run plan -- check`; `git diff --check`, before and after the merge | exit 0; clean |

## Gates

| Gate | Subject | Result |
| --- | --- | --- |
| `npm test -- --review` | the repair before the merge, on `894be584` | 34 passed, 0 failed, 648.00 s, 78 fresh tasks, exit 0, recorded 2026-09-27T19:17:31.816Z; `configuration-root` 4.26 s, `console` 25.62 s |
| `npm test -- --review` | the merged subject on `371b7a08`, tree `f85556c3`, code identity `3f59bb6431b097d52bb801b4bc89fff92cd4069fe89e06ae31ca4e648707ecae` | 34 passed, 0 failed, 639.25 s, 78 fresh tasks, exit 0, recorded 2026-09-27T19:33:32.642Z; `configuration-root` 4.17 s, `console` 25.46 s, `harness-fixtures` 246.75 s |
| `npm run test:docs` | the merged subject | 13 passed, 10 failed, 22.25 s, recorded 2026-09-27T19:34:46.506Z: `format` (the two console files) and `docs-check` (product 07 over its ceiling); the rest failed on the `format` preflight |
| `npm run test:docs` | after the trim and the formatting | 23 passed, 0 failed, 12.59 s, recorded 2026-09-27T19:36:06.762Z; `docs-check` 8.45 s, `console-docs` 1.42 s |
| `npm test -- --review` | the final subject, tree `71c26ec9`, code identity `310096b93b4d75d5f66aef87b0256f832c3918edd14676ebbc5932d3e8f42cf0` | 34 passed, 0 failed, 642.96 s, 78 fresh tasks, exit 0, recorded 2026-09-27T19:46:57.004Z; `configuration-root` 4.01 s, `console` 25.21 s |

All three review selections ran the `configuration-root` machinery suite that
FINAL-001's gate failed. The last row is the binding one: the formatting
changed source bytes after the second.

## Executor errors and the operator time they cost

- **The third review gate was avoidable (about 643 s of gate time, plus the
  operator's wait).** I started the post-merge `npm test -- --review` at
  19:22 without first running `npm run test:docs`. `npm test` does not run
  the format check. When the document gate ran afterwards, it failed on
  Prettier style in two files I had edited and on product 07's ceiling.
  Fixing the formatting changed source bytes, so the 19:22 gate no longer
  covered the handoff subject and a third gate had to run at 19:36. Running
  the document gate, or `npm run format:check`, before each full gate would
  have caught both defects in about 13 s. The pre-merge gate at 19:06 also
  ran on the unformatted files; it passed only because `npm test` does not
  check formatting.
- **Three bounded waits looked like reruns.** `node scripts/harness.mjs
  evidence --wait --timeout 580` exits 2 when its bound expires before a
  gate of about 640 s ends. Each call only waited; no gate ran more than
  once per subject. I did not explain this to the operator when the calls
  began.
- **A mutation check ran twice (about 1 minute).** My first run of the
  checkpoint-11 collector against the new test filtered its output with
  `grep` and hid the failing assertion, so I rebuilt and ran it again to
  read the reason.
- **Small failed commands.** Two parses of the persisted status output
  failed (a `require` of a non-JavaScript file, then trailing text after
  the JSON) before I wrote it to a temporary file. The first same-tree
  comparison failed because the `git archive` copy lacked `packages/`. The
  first register merge script threw on a row changed only on `main`. During
  live gates, the hook refused `claude --version`, a heredoc edit to a
  scratch file and a command with a `$TMPDIR` expansion. Each cost seconds.

The pre-merge gate at 19:06 was not avoidable in the same way. `main`'s
WO-171 merge commit (`371b7a08`) is dated 19:13:52Z, after that gate started,
and the merge followed the operator's later direction.

## Remaining lifecycle work

A fresh `resume: verify` judges this subject, then `resume: final review`.
The register rows D010 to D012 minted (`FUP-e9bd0effe2b00f0e`,
`FUP-6a9eb3c24f1ab9ea`, `FUP-934cf5f4268029c8`) and the allocated rows
(`FUP-7f9a27e6ed6c44b3`, `FUP-b8a329d9970b8206`, `FUP-d68bd29cf96864f1`) are
disposed at the passing final review.
