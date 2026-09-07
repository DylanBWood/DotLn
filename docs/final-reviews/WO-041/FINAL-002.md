# WO-041 final review FINAL-002

**Verdict: WO-041 passes final review.** The three blocking findings of
FINAL-001 are repaired on an integrated base that has not moved since, the
operator-authorized breakout's four criteria are met, the original mechanism is
byte-identical to what VER-002 passed, and the package is publishable: the full
gate is green on the reviewed tree, the origin release-surface preflight passes
every rule, the plan gate validates the live receipt, and the two publication
bodies validate. This review applied two cosmetic documentation corrections and
no behavioral change.

- Subject work order: `docs/work-orders/WO-041-plan-refutation-mechanism.md`,
  heading target `v0.13.3` after the recorded collision retiming, with the
  appended §Operator-authorized breakout — 2026-09-07 (criteria 8–11). Criteria
  1–7 are unchanged since VER-002.
- Subject state: branch `wo-041`, worktree `DotLn-wo041`, uncommitted working
  tree, 2026-09-07. `HEAD`, `main`, and `origin/main` are all
  `a360d04ac865e6a55c64f06cd0467f9e69acf9f7`, the WO-038 merge (#43) that the
  annotated tag `v0.13.2` names; `git fetch origin` and `git ls-remote origin
  main` in this session agree, and the remote tag set ends at `v0.13.2`.
  `git log main..wo-041` is empty, so the entire subject is the dirty tree: 34
  tracked modifications (742 insertions, 172 deletions against `HEAD` after
  this review's ledger correction) and 27 untracked paths at review open,
  61 `git status --porcelain -uall` entries before this report, its PR body,
  and its release notes exist. The untracked set is the control segment, eight files under
  `docs/evidence/WO-041/` (the README, the fixture transcript, the breakout
  receipt, the continuity record, the integration-check transcript, and the
  three-file feedback edition), the live receipt pair, `VER-001.md` (388
  lines), `VER-002.md` (282), `VER-003.md` (490), `FINAL-001.md` (463), four
  new skeleton modules (640 lines), the skeleton's projection test (198), and
  seven new scripts (2,688 lines including the 993-line plan-refutation
  fixture suite and the 289-line release-preparation suite).
- Verification sequence read in full: `VER-001` (fail), `VER-002` (pass),
  `VER-003` (pass), and this order's `FINAL-001` (fail). Their adjudication is
  in §FINAL-001's findings and §The original deliverable.
- Ideation receipt: `docs/evidence/WO-041/ideation.md`, the 2026-09-07
  parallel-workflow correction, read in full and digested in §The breakout.
- Checkpoints: VER-002 verdict `bbd6a69` (`refs/dotln/checkpoint/WO-041/8`),
  FINAL-001 verdict `0306e11` (10), repair-complete `40eb9a3` (12), VER-003
  request `a593f73` (13), VER-003 verdict `395b659` (14), this dispatch
  `3dd5c11` (15), recorded at 2026-09-07T18:20:35.932Z.

## Actor

This review ran on the Claude Code CLI, version `2.1.263` (`claude --version`
observed in this session; the version is on the harness's observed `versions`
list in `docs/discovery/environment.json`), model `claude-fable-5-1`, at
reasoning effort `max` selected by this session's model control. The value is
self-reported: `max` is on the harness's documented `sessionEffortSelector`
values, while `effectiveEffortReadback` for `claude-code` remains `not found`
with `harnessReadbackEligible: false`, so `harness-readback` is unavailable and
not claimed. The shell exposes `CLAUDE_EFFORT=max`, a launch selection visible
to the process, not a recorded readback. The work order declares the reviewer
role `any`.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.263","model":"claude-fable-5-1","effort":"max","source":"self-reported"}

### Actors across the order, against the declared minima

The order declares `Effort: executor xhigh+; verifier xhigh+; reviewer any`
and `Model: any capable model`. Every completed value is at or above its
floor; the projection reports `Effort drift: none`.

| Role and event                          | Actor (control log)                                            | Floor  | Meets |
| --------------------------------------- | -------------------------------------------------------------- | ------ | ----- |
| executor, `ImplementationReady`         | codex-cli 0.153.4, `gpt-6-astra`, `max`, operator-attested     | xhigh+ | yes   |
| executor, `RepairCompleted` (VER-001)   | codex-cli 0.153.4, `gpt-6-astra`, `max`, operator-attested     | xhigh+ | yes   |
| executor, `RepairCompleted` (FINAL-001) | codex-cli 0.153.4, `gpt-6-astra`, `max`, operator-attested     | xhigh+ | yes   |
| verifier, `VER-001` (fail)              | claude-code 2.1.263, `claude-opus-5[1m]`, `max`, self-reported | xhigh+ | yes   |
| verifier, `VER-002` (pass)              | claude-code 2.1.263, `claude-opus-5[1m]`, `max`, self-reported | xhigh+ | yes   |
| verifier, `VER-003` (pass)              | claude-code 2.1.263, `claude-opus-5[1m]`, `max`, self-reported | xhigh+ | yes   |
| reviewer, `FINAL-001` (fail)            | claude-code 2.1.263, `claude-fable-5-1`, `max`, self-reported  | any    | yes   |
| reviewer, `FINAL-002` (this, pass)      | claude-code 2.1.263, `claude-fable-5-1`, `max`, self-reported  | any    | yes   |

All three verification reports carry a machine header equal to their control
event. Quoted here indented so that only this report's own header starts at
column one:

> `**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.263","model":"claude-opus-5[1m]","effort":"max","source":"self-reported"}`
> (VER-001, VER-002, and VER-003, identical; the same verifier repeated, which
> each report discloses and which is not a self-verification because the
> implementer and both repairers are the Codex executor.)

Implementer, verifier, and reviewer are structurally separate: Codex CLI wrote
the deliverable, both repairs, and the breakout code; Claude Opus 5 verified
three times; Claude Fable 5.1 reviewed twice. No reviewer session wrote a
subject file other than the two corrections in §Corrections applied by this
review, which touch no code, contract, acceptance behavior, schema,
compatibility, authority, or prior evidence.

## Dispatch and subject integrity

`npm run resume --silent -- status --json` at open: phase `verified`, latest
verification `VER-003` with verdict `pass`, `legalNextActions: ["final-review"]`,
no projection warning. `npm run resume -- final-review` allocated
`docs/final-reviews/WO-041/FINAL-002.md` and checkpoint 15; the index was
regenerated after the dispatch and is regenerated again after the verdict.

The tree reviewed is the tree VER-003 passed plus the lifecycle's own
bookkeeping. A temporary-index tree of the working tree (`2bb61f0`, built
under `GIT_INDEX_FILE` in `$TMPDIR` without touching the real index) differs
from the VER-003 verdict checkpoint `395b659` (14) and from this dispatch's
checkpoint `3dd5c11` (15) by `git diff-tree` only in `docs/control/current.md`,
`docs/control/orders/WO-041.jsonl`, and the regenerated
`docs/work-orders/README.md`; against the repair-complete checkpoint `40eb9a3`
(12) the only addition is `VER-003.md` itself. Every untracked file is present
in those checkpoints. No substantive file moved between the repair, the
verification, and this review.

Immutability, verified by `git hash-object`: `VER-001.md`
(`4b2f961e…`) is identical at checkpoints 4, 8, 10, and 14; `VER-002.md`
(`747602ac…`) at 8, 10, and 14; `VER-003.md` (`731da671…`) at 14;
`FINAL-001.md` (`47ec48a9…`) at 10 and 14; and the live receipt pair
(`b720a9b7…`, `83394a84…`) at 4, 8, 10, and 14. All equal the working tree.

Identity of the VER-002-verified mechanism: `scripts/lib/plan-subject.mjs`,
`plan-receipts.mjs`, `terms.mjs`, `scripts/refute-plan.mjs`,
`scripts/test-plan-refutation.mjs`, `packages/skeleton/src/loadouts/plan-refuter.ts`,
`plan-refutation-protocol.ts`, `plan-refutation-host.ts`,
`plan-refutation-fake.ts`, `docs/planning/refutations/README.md`, the four
shared skeleton edits (`reactor.ts`, `verification-protocol.ts`,
`worker-store.ts`, `worker-transport.ts`), `scripts/resume.mjs`,
`scripts/feedback-evidence.mjs`, `docs/evidence/WO-041/fixtures.txt`, and
`inspection-continuity.json` are byte-identical to checkpoint 8 (`bbd6a69`).
This is the basis on which §The original deliverable carries FINAL-001's
adjudication forward.

## What this review re-established first-hand

All inside the Claude Code sandbox, on this worktree, without any destructive
Git command:

- `npm test` on the reviewed tree, twice: once at open on the tree VER-003
  passed, and once after the corrections and the publication bodies below.
  Both exit 0 with zero `not ok` lines. In command order: Prettier clean;
  `check-surfaces --local` (`Tag observation: local ancestors of HEAD only;
  publication checks origin.`, `PASS release-block: observed v0.13.3; expected
  v0.13.3 (work-order target v0.13.3; latest local tag v0.13.2)`, and the
  three component rules); 7 of 7 release-preparation tests; the GitHub body
  profile tests; 9 of 9 license-surface tests and the live license check; the
  shell suites (fixture temp root, publication, intake backup, resume,
  checkpoint, worktree, release including the two new fixtures, work orders);
  `check-publication.mjs` with 235 of 235 headings indexed and both audience
  locks `CURRENT`; `index --check` current; `tsc -b --force`; 285 of 285
  package tests; all eleven plan-refutation fixture groups ending
  `Plan gate: {"receipts":1,"passes":0,"enforcement":"pending introduction commit","localTerms":"unavailable"}`;
  8 of 8 identity-corpus tests; the artifact-identity, verification-evidence,
  and feedback-evidence checks, the last against the WO-041 edition (ten
  passing regressions, ten removal failures, 2,393 fewer instruction bytes);
  and 21 of 21 mutation self-tests. Logs under `$TMPDIR`.
- `npm run release --silent -- check-surfaces` (origin observation): exit 0.
  `PASS release-block: observed v0.13.3; expected v0.13.3 (work-order target
  v0.13.3; latest published v0.13.2)`; `PASS component-version @dotln/skeleton:
  src changed; observed 0.12.1; previous v0.13.2 0.12.0; expected a different
  version`; compiler `0.6.0` and kernel `0.2.1` `src unchanged`; the GitHub
  body profile over this package's `PR.md` and `RELEASE-NOTES.md`; and every
  license-surface rule including the four offline npm refusals. Both rules that
  FINAL-001 recorded as `FAIL` now pass.
- `npm run plan --silent -- check`: exit 0,
  `{"receipts":1,"passes":0,"enforcement":"pending introduction commit","localTerms":"unavailable"}`.
  The live receipt pair validates end to end against a subject rebuilt from its
  recorded revision `01c2e32`, which is an ancestor of `HEAD`, so the receipt
  stays resolvable after integration.
- `node scripts/check-publication.mjs`: 235 of 235 product headings indexed,
  3 identical claim links per voice, both audience locks `CURRENT` (30 and 45
  linked sections), re-run after each correction.
- `git diff --check` and `git diff --cached --check`: clean before and after
  the corrections.
- `git fetch origin` (the credential helper's keychain refusal inside the
  sandbox is noise; the fetch itself succeeded), `git ls-remote origin main`,
  and `git ls-remote --tags origin`: `origin/main` is `a360d04`, unchanged
  since VER-003, and no tag above `v0.13.2` exists remotely or locally. No
  integration is due in this window.
- The publication bodies: `parseReleaseNotes` accepts `RELEASE-NOTES.md` with
  exactly the five headings, and `assertGitHubBodyProfile` accepts both
  `RELEASE-NOTES.md` and `PR.md`; `check-surfaces` reports the same on its
  `github-body-profile` line.
- Breakout provenance: `shasum -a 256` over the capture the ideation receipt
  names in the main checkout's ignored intake
  (`docs/intake/notes/2026-09-07-wo041-parallel-workflow-correction.md`) equals
  the receipt's recorded
  `8ade09bc4c735915516f14fb3fb754f1db9a69a2f21efa29b48f7aa1d1ab742c`; the
  file's content was not read. This worktree's `docs/intake/notes/` holds no
  worktree-local capture. The preserved sync stash `82713231…` exists under the
  message `WO-041 sync 2026-09-07 after FINAL-001 and workflow ideation` and
  was not applied, popped, or dropped.
- `check-surfaces --local` selection on `main`: `resume status --json` in the
  main checkout, run read-only by absolute path, selects the latest closed
  order (WO-038) when no order is open, so the new head-of-gate step evaluates
  a real authority between work orders. Before this order's release close the
  selection will be WO-041 at `v0.13.3` against the ancestral tag `v0.13.2`, and
  after the tag it is the same order at an equal version; both are passing
  states of `releaseBlockRule` and `componentVersionRules`, so `npm test` on
  `main` stays green through the close.
- Internal cross-references: a script resolved every relative link in the
  twenty changed or new Markdown surfaces; all targets exist, and each anchor
  the script could not slug matches a real heading on inspection (the em-dash
  headings in the phase-two plan, the evidence README, and the execution
  guide).
- Clean-room screen: a token screen over every added line of the tracked diff
  and every new non-stream file (7,657 lines) for commercial ticketing/ALM
  product names, predecessor-system names, managed-host, corporate-gateway,
  proxy, and internal-hostname shapes, private address ranges, and credential
  shapes returned only this order's own prose describing the screen. VER-003
  read the two model-output surfaces (`docs/evidence/WO-041/README.md`,
  `ideation.md`) and the live receipt's free text in full; this review read
  the receipt's rendered header and its first four order verdicts directly
  and relies on FINAL-001's full read of the identical bytes for the rest.
  `docs/intake` was not read.

## FINAL-001's findings, adjudicated on the repaired subject

### 1. Release target and README block: repaired

The heading reads `(v0.13.3)`; the README release block carries exactly one
strict version and describes "a control-plane patch above the published
license-posture release"; the roadmap keeps the original activation completion
verbatim and adds the dated retiming note naming the superseded `v0.13.2`, the
successor, the classification, and the reason. The retime was produced by the
new `release prepare --local` command, whose arithmetic I read: it increments
the patch axis of the observed latest tag under the order's single declared
classification, replaces the strict version only where it is not part of a
longer token, and refuses a heading or block with any count of versions other
than one. `check-surfaces` passes the rule against origin.

### 2. Skeleton component version: repaired

`packages/skeleton/package.json` and the lockfile's `packages/skeleton` entry
are `0.12.1`; `check-surfaces` reports the bump against `v0.13.2`'s `0.12.0`
with source changed. Observation 2's three true-when-written sentences are
rewritten: the roadmap's activation completion, the evidence README's opening,
and the ledger's first-pair entry now state the bump.

### 3. Base sync and re-recorded evidence: repaired, and the rule that made it a finding is corrected

`wo-041` was fast-forwarded to `a360d04` without a work-order commit; the
four generated conflicts were regenerated rather than hand-merged (both
edition locks `CURRENT`, `index --check` green, the control projection agreeing
with the fold); the three authored conflicts were resolved by the executor
and read here: the README block combines both descriptions into one claim,
the roadmap keeps both activation completions, and `package.json` carries the
`plan` script and the widened test chain beside WO-038's license fields. The
feedback edition is fresh on the integrated base: the verifier capsule's
`baseCommit` is `a360d04`, the verification stream runs from
2026-09-07T17:15:46.104Z to 17:16:04.492Z inside the repair window, both
acceptance criteria are verified with host-admitted provenance, and
`feedback-evidence.mjs --check --edition WO-041` is green in the gate.

FINAL-001 routed this integration through repair because the standing
procedure said a substantive integration returns through repair and fresh
verification. The operator's breakout replaces that rule with an
evidence-scoped one (§The breakout), and this order's own history is the
measured case for it. Under the corrected contract a reviewer integrating an
unchanged-behavior base would do the merge, retime, and regeneration inside
the review; here the executor did that work, VER-003 verified it, and nothing
remains to integrate. The time-indexing is explicit: FINAL-001 was judged
against the procedure in force at 16:47Z, and this review is judged against
the contract the same order lands.

## The breakout — criteria 8 to 11, and the ideation-receipt duties

The receipt names three operator messages captured in ignored intake, their
SHA-256 (verified above), the clean-room supports applied, the authorized
correction in four bullets, the durable homes, the review duties, and the
unresolved scope. This review checked each duty the execution guide assigns a
reviewer of an ideation breakout:

- **Source treatment and provenance.** Synthesized, not directly filed; no
  direct-filing exception is claimed and no verbatim capture appears in any
  committed surface. The screen above found no employer term, host, gateway,
  policy, or credential shape.
- **Traceability to operator intent.** Each of the three captured
  instructions has a durable home: independent progress with no sibling-phase
  prerequisite (07 §Independent workflows and integration, the playbook, the
  concurrent plan's lane rules 3–5 and admission row, the phase-two plan, the
  map, WO-033); the voluntary final-review-through-release-close window,
  labeled discipline rather than gate in every surface, with a gate named as
  an open option only; and evidence invalidation by affected claim, with the
  three mechanical increments (release preparation, early ancestral surface
  checks, the feedback projection). Nothing exceeds the three instructions:
  no scheduler, no semantic conflict resolver, no lifecycle-legality or
  event-schema change.
- **Consistency with settled decisions and vocabulary.** The implementer ≠
  verifier rule survives inside the new contract in each surface ("A reviewer
  never writes a behavioral fix and certifies it"); immutable numbered
  evidence is preserved structurally (§Dispatch and subject integrity); the
  release-boundary rule in 06 keeps reclassification, scope change, and
  publication under explicit authority while authorizing routine collision
  retiming; the vocabulary is the repository's own (orders, phases, lanes,
  windows, claims, projections). The marked sequence block hashes
  `sha256:22be356d…` at checkpoint 8, at `HEAD`, and now.
- **Version and schema effects.** Skeleton `0.12.1` (source changed, no
  exported runtime capability change); compiler and kernel unchanged with
  byte-identical `src/`; the lockfile changes only by that version; no
  dependency change; the control-event schema, phases, and legal actions are
  untouched; plan overrides use their own separate append-only log; the
  feedback projection is a new source contract for new editions only, stated
  as such in 02 and the skeleton README.
- **Cross-references.** Resolved as above.
- **Speculative choices presented as settled.** None found. The gate for the
  final-review window is an open option; WO-033's fuller sync helper is named
  as future work; general evidence-impact analysis and arbitrary authored
  conflicts are declared manual; the capability row states what would promote
  it and that this order's live run does not.
- **Executable helpers created in the breakout** are implementation under the
  same evidence rules, and the receipt names them. Product fit and failure
  coverage are adjudicated per criterion below.

**Criterion 8: met.** Read end to end in 07, the playbook diff, the concurrent
plan, the phase-two plan, the map, and WO-033. The phase-count verification
reserve and the automatic return-to-repair rule are struck everywhere they
appeared; no surface introduces a sibling-phase prerequisite; historical
evidence stays immutable; the marked sequence is unchanged.

**Criterion 9: met.** `scripts/lib/release-preparation.mjs` (168 lines) reads
and validates every input before any edit (Git root, the selected `wo-NNN`
branch, an open phase, a valid UTC date, a strict latest tag, contained regular
files, one strict version in the heading, one declaration of `patch`, `minor`,
or `major`, one exact ordered README block whose single version equals the
heading's, and the roadmap's boundary section), computes the successor under
the declared axis, and returns the three edits with before and after bytes;
`applyReleasePreparation` refuses if any file changed since planning and
restores every written file in reverse on a write error. The seven-test suite
covers each consequential failure mode I could name: no write during planning,
idempotence, wrong classification arithmetic, the eight malformed or ambiguous
inputs with the snapshot proven unchanged after each throw, closed and unknown
phases, an invalid date, a prerelease latest tag, an out-of-range version,
prerelease tokens preserved beside the strict target, the wrong worktree, an
escaped symlinked source, a stale plan, and byte recovery after a mid-sequence
write failure. In `scripts/release.mjs`, `ancestralLocalTags` filters the
local tag map by `git for-each-ref --merged=HEAD refs/tags`, `check-surfaces
--local` builds its remote view from that filtered map, and the `prepare`
action uses the whole local snapshot under `--local` and origin otherwise; the
two real-Git fixtures in `scripts/test-release.sh` prove that a sibling's
annotated non-ancestor tag is ignored locally, that the authoritative check
still requires origin, that `prepare --local` retimes without touching three
independent control segments or any ref and reports "no files changed" on
repetition, and the pre-existing missing-bump assertion now runs under
`--local` as well. VER-003 established the filter's binding by mutation; this
review did not repeat the mutation and relies on that report for it (§What I
did not re-derive). Product fit: the helper removes the exact manual sequence
FINAL-001 had to spell out, keeps judgment where the guide puts it (the
operator's classification and the dated note), and appends no control event.

**Criterion 10: met.** `feedbackSourceFile` in `packages/skeleton/src/feedback-audit.ts`
rewrites only `package-lock.json` and `packages/skeleton/package.json`, deletes
`version` and `license` at the root and, for the lockfile, in the four known
workspace entries, records the omitted JSON pointers, labels the capsule
`feedback-package-projection-v1` with its physical source path, and throws on
a non-object manifest, a missing `packages` object, or a non-object workspace
entry. The projection's own test file is pinned into `FEEDBACK_SOURCE_PATHS`.
The four-test skeleton suite proves stability under the exact upstream change
that forced the repair (license fields plus a skeleton bump across the
manifest, the lockfile root, and all four workspace entries) and under a
lockfile reformat, invalidation by every declared source path, by `scripts`,
`prepublishOnly`, `exports`, `dependencies`, `private`, an unknown extension
field, an external dependency's `version`, `integrity`, `resolved`, and
`license`, an unknown workspace's version, and `lockfileVersion`, and refusal
of five malformed inputs. The label reaches the verifier: the WO-041 edition's
`VerificationOpened` payload carries both capsules with `projection`,
`sourcePath`, and `omitted`. VER-003 additionally replicated fourteen rows on
its own fixture. The live edition required by the criterion is the one
adjudicated under finding 3.

**Criterion 11: met.** The gate, the origin preflight, the plan gate,
publication, and `git diff --check` all pass on the final tree (above). The
sync record in the evidence README names the stash, the base before and
after, the seven conflicts by class, the retime, and the superseded edition;
the first-pair receipt in the phase-two plan names the measured spans and
states that no time saving is demonstrated; the breakout receipt names what
remains manual. This review added a dated completion note to the receipt so
that the repair, VER-003, and this dispatch are recorded beside the earlier
observation (§Corrections applied by this review).

## The original deliverable — criteria 1 to 7

Criteria 1, 2, 3, and 5 rest on modules byte-identical to checkpoint 8, where
FINAL-001 read every one of them end to end and recorded its agreement in §The
verified deliverable stands; VER-003 re-ran all eleven fixture groups on the
integrated tree and confirmed the identity. This review re-established the
identity itself (§Dispatch and subject integrity), re-read
`plan-refutation-host.ts`, `loadouts/plan-refuter.ts`, `refute-plan.mjs`, and
the four shared skeleton diffs, and watched the eleven groups pass twice in
this tree's gate. The host authorizes the read before dispatch and the report
after the result through the skeleton's single decider, dispatches from an
empty `mkdtemp` directory with `modelTools: []`, checks the receipt's command
id and transport name, validates the result positively, and removes the
scratch directory in every path; the loadout keeps only `repo.read*` and
`report.emit`, denies write, git, remote, settings, and decision effects,
zeroes the container's socket budget and supports, and pins the six questions
as both obligations and acceptance criteria; the CLI refuses an unknown
transport or effort, refuses to refute a dirty planning subject, refuses a
same-subject re-roll, and stops at the third consecutive hold before any
dispatch. FINAL-001's adjudication stands.

**Criterion 4: met.** The committed receipt pair (167 rendered lines) records
`claude-cli-print`, harness `2.1.263`, `claude-fable-5-1`, `max`, dispatched
2026-09-07T12:59:32.930Z and completed 13:09:21.372Z over the ten-order
sequence at `01c2e32`, verdict `pass`, zero holds, `selectionSource:
host-launch` with effective model and effort honestly `unknown`, and the
rendered self-referential disclosure. The verdict on WO-041 is advisory and is
used as evidence nowhere in this report. Committing the pair is this review's
duty and is in the series below.

**Criterion 6: met.** All eight write-backs land and say something true about
the mechanism on this tree: 07 §Operator-opened planning pass (the mandatory
step, the hold and override rules, the forward-only boundary, the receipt pair
as a standard artifact); the 13 tester paragraph and the roles table's
showrunner and tester rows; the docs map lines for `refutations/` and the
separate override log; the README release block; the dated
`control.plan-refutation` row, worded in the table's existing
"pending review" convention; the publication index rows (07 §Independent
workflows and integration and §Operator-opened planning pass, 13 §UIFA
tester, all `implemented`) and both refreshed locks; and the ledger's two
dated sections.

**Criterion 7: met.** `npm test` green twice; `git diff --check` clean;
`package.json` adds only the `plan` script and the widened test chain; the
lockfile changes only by the skeleton version; `packages/kernel` and
`packages/compiler` have no diff against `HEAD`.

## Non-blocking observations

Carried from VER-001, VER-003, and FINAL-001, none changed by this review:

1. **The gate binds from the introduction commit** (VER-001 O1, VER-003 O4).
   This repair edits the capability table, the roles table, and two sequence
   order files; all are inert while enforcement is pending, and the first
   planning pass after the merge is the first the gate binds. Meet it
   deliberately.
2. **`prepare --local` and `check-surfaces --local` observe different tag
   sets** by design (VER-003 O1); the reason lives in 07 rather than beside the
   code.
3. **`feedbackSourceFile`'s workspace list is fixed** at four entries; a fifth
   workspace over-invalidates (VER-003 O2).
4. **A lightweight ancestral release tag throws** rather than reporting a FAIL
   line, now reachable inside `npm test` (VER-003 O3).
5. **Same-day planning passes** resolve to the heading nearer the top of the
   ledger (FINAL-001 O5).
6. **One feedback edition per order** is a writer limit; the superseded
   uncommitted edition is preserved in the named stash (FINAL-001 O1).
7. **`gh` inside the Claude Code sandbox** cannot read its configuration
   (FINAL-001 O8); the handoff below covers it.
8. **`.prettierignore` asymmetry** (VER-001 O4): only the first manual redirect
   receipt remains formatter-owned; harmless.

New in this review:

9. **The commit series cannot be split along the mechanism/breakout seam at
   file granularity.** The FINAL-001 repair rewrote `package.json`'s single
   test line, the README block, the work order, 07, the ledger, and
   `.prettierignore` so that each carries both changes; a hunk-level split
   would fabricate intermediate states that never existed. The series below
   keeps the implementation in one commit and says so.
10. **The capability row's "pending review" wording** follows the table's
    convention for dated rows and will read as historical after the merge, as
    the earlier rows do. No action.

## Corrections applied by this review

Two, both non-substantive documentation changes, both re-checked:

1. `docs/lineage/idea-ledger.md`: the two new 2026-09-07 sections carried a
   three-line and two two-line blank gaps (VER-003 O6); four blank lines were
   removed so every boundary is one blank line. The ledger is
   formatter-ignored; `git diff --check`, `check-publication.mjs`, and the plan
   gate are unaffected and were re-run.
2. `docs/planning/phase-two-plan-2026-09-06.md`: a dated completion note
   under the first-pair receipt recording the repair's close (17:46:26.253Z,
   3,355,985 ms), VER-003's request and pass (17:49:12.203Z to 18:04:36.154Z,
   923,951 ms), and this review's dispatch (18:20:35.932Z), each recomputed
   from the control segment; the note repeats the receipt's own caveat that the
   repair span is not pure integration cost. Prettier clean.

No code, contract, acceptance behavior, schema, compatibility, authority, or
prior evidence was touched. The second gate run covers both.

## Findings

No blocking finding. The non-blocking items are recorded above and in the PR
body's open items.

## Remaining deviations and open questions

- **Forward-only enforcement** means the gate's first binding run is the next
  planning pass; until the introduction commit exists on `main`'s first-parent
  line, `plan check` reports `pending introduction commit`.
- **The local operator terms list is unavailable in this checkout**, so the
  receipt writer's refusal is proven only by the synthetic-term fixture.
- **One reviewer model for both final reviews** and one verifier model for all
  three verifications; each is disclosed and none is a self-review.
- **Claude Code attestations remain `self-reported`**; no effective-effort
  readback is recorded for the harness.
- **The publish helper's `gh` preflight may refuse inside the sandbox**; the
  operator runs the same command from this worktree outside it.

## Proposed PR

Title: `:safety_vest: Add the blinded plan refuter that gates planning passes, and the independent-workflow integration contract with release preparation (WO-041, v0.13.3)`.
The gitmoji catalog lists `:safety_vest:` as "Add or update code related to
validation", which is this change's main purpose: a validator for plans, a
validator for release surfaces, and a validated evidence projection. Body:
`docs/final-reviews/WO-041/PR.md`, committed in the series below and
transported byte-for-byte by the publisher.

## Commit series

Three commits, each with a plain subject and an explanatory body and no
attribution trailer, followed by a check that `git status --porcelain` is
empty, that `git diff HEAD` is empty, and that `check-surfaces --committed
WO-041` passes on the result:

1. **Implementation with its tests, evidence, and documentation:** the four
   new and four edited skeleton modules, the skeleton manifest and lockfile,
   the projection test, `scripts/refute-plan.mjs`, the four new `scripts/lib`
   modules, `scripts/test-plan-refutation.mjs`,
   `scripts/test-release-preparation.mjs`, the `scripts/release.mjs`,
   `scripts/test-release.sh`, `scripts/feedback-evidence.mjs`, and
   `scripts/resume.mjs` hunks, `package.json`, `.prettierignore`, the receipt
   convention and the live receipt pair, `README.md`, `docs/README.md`,
   `docs/PLAYBOOK.md`, the product docs 02, 06, 07, and 13, the planning
   documents (capability table, concurrent plan, phase-two plan with this
   review's note, map), WO-033, WO-041, the publication index and both locks,
   the ledger with this review's correction, and the executor evidence
   (`README.md`, `fixtures.txt`, `ideation.md`, `inspection-continuity.json`,
   `integration-checks.txt`).
2. **WO-041 feedback evidence edition:** `docs/evidence/WO-041/feedback/`
   (`feedback.json`, `selfhost-audit.jsonl`, `selfhost-verification.jsonl`),
   separated because the streams are large and would obscure the diff, as
   WO-038's series did for its edition.
3. **Independent review evidence and closed control state:** `VER-001.md`,
   `VER-002.md`, `VER-003.md`, `FINAL-001.md`, this report, `PR.md`,
   `RELEASE-NOTES.md`, `docs/control/orders/WO-041.jsonl`,
   `docs/control/current.md`, and the regenerated `docs/work-orders/README.md`.

## Ready to merge: handoff

After `final-review-result pass`, the index refresh, and the series, the branch
is ready for operator review. Publication is the bounded publisher from this
worktree:

```bash
npm run worktree -- publish WO-041 --title ':safety_vest: Add the blinded plan refuter that gates planning passes, and the independent-workflow integration contract with release preparation (WO-041, v0.13.3)' --body-file docs/final-reviews/WO-041/PR.md
```

It runs `check-surfaces --committed`, the body and notes validation, and the
sign-off check before any remote effect, then preflights `gh`. Inside the
Claude Code sandbox `gh` cannot read its configuration, so if the helper
refuses at that preflight the operator runs the same command from this
worktree outside the sandbox; the helper is idempotent up to that point and
mutates nothing before it. After the operator merges the PR and authorizes
`resume: release close`, the operator runs the exact absolute subject-helper
command the publisher prints, with the main checkout as the working directory;
because `v0.13.3` is strictly above `v0.13.2`, that close runs `npm ci` and
the evidence gate (whose `check-surfaces --local` step selects this closed
order, as checked above), assembles the edition from this package's notes,
creates and pushes the annotated `v0.13.3` tag, and creates the matching
GitHub Release. Nothing here merges, tags, publishes a package, or edits a
Release.

## Disclosures

1. **Self-referential instruments.** `scripts/resume.mjs` allocated this
   report and records its verdict; WO-041 changes one line of it (the
   `parseActor` export), byte-identical since VER-002. `scripts/release.mjs`
   `check-surfaces --local` is both a deliverable and the first step of the
   `npm test` this report relies on; its binding was established by VER-003's
   mutation, and this review checked its selection behavior on `main`
   separately. `packages/skeleton/src/feedback-audit.ts` is both the changed
   instrument and a pinned input to its own subject; VER-003's independent
   probe and the executor's suite cover it. `scripts/work-orders.mjs index`
   was regenerated after dispatch and again after the verdict. The plan
   refuter judged WO-041 `thesis-advancing`; that verdict is advisory and
   unused.
2. **No destructive Git command ran.** The subject-integrity comparison used
   a temporary index file under `$TMPDIR` and created only a dangling tree
   object; the working tree, the real index, the refs, and the shared stash
   are untouched. `docs/intake` was not read; the capture was hashed by path
   only.
3. **Effort evidence limit.** `CLAUDE_EFFORT=max` is visible in the shell as a
   launch selection; no effective-session readback exists for this harness,
   so the attestation is `self-reported`.
4. **What I did not re-derive.** The module-swap binding of VER-002's two
   repair groups and VER-001's throwaway-repository reproduction of the five
   subject-hash families (both on files proven byte-identical here, with the
   encoding fixtures green twice in this tree); VER-003's mutation of the
   ancestral tag filter and its fourteen-row projection probe (the fixtures
   that encode both claims ran green twice here); FINAL-001's full read of
   the plan-refutation modules and the receipt's free text (identical bytes,
   re-read in part as stated above).
5. **Time-indexing.** FINAL-001's third finding is judged against the
   procedure in force when it was written; this review is judged against the
   contract this order lands, and says so in §FINAL-001's findings.
6. **Repeated reviewer.** The same harness and model as FINAL-001; see §Actor.

## Method

Commands run, in order: `npm run resume --silent -- status --json`;
`npm run resume -- final-review`; `npm run work-orders -- index`;
`git fetch origin`, `git ls-remote origin main`, `git ls-remote --tags origin`;
`git diff --check`, `git diff --cached --check`; `node scripts/check-publication.mjs`;
`npm test` (full gate, background, log under `$TMPDIR`); the temporary-index
comparison (`git read-tree`, `git add -A`, `git write-tree`, `git diff-tree`
against checkpoints 8, 10, 12, 14, and 15); `git hash-object` and `git ls-tree`
comparisons for the reports, the receipt pair, and the mechanism's modules
against checkpoints 4, 8, 10, and 14; `npm run release --silent -- check-surfaces`;
`npm run plan --silent -- check`; `git diff HEAD -- <each changed file>` and
every new file; `resume status --json` in the main checkout by absolute path;
`shasum -a 256` over the breakout capture; `git stash list`; the link
resolver and the token screen (both small Node and shell scripts under
`$TMPDIR`); the two corrections with `npx prettier --check` and the fast
checks re-run; the body validators; and the second `npm test` before the
completion event. Files read in full: the work order, VER-001 through VER-003,
FINAL-001, the control segment, the executor evidence README, `ideation.md`,
`integration-checks.txt`, `fixtures.txt`, `inspection-continuity.json`,
`scripts/lib/release-preparation.mjs`, `scripts/test-release-preparation.mjs`,
`packages/skeleton/test/feedback-audit-source.test.ts`,
`plan-refutation-host.ts`, `loadouts/plan-refuter.ts`, `refute-plan.mjs`, the
`scripts/release.mjs`, `scripts/test-release.sh`, `feedback-audit.ts`,
`feedback-evidence.mjs`, `resume.mjs`, `package.json`, the skeleton manifest,
the lockfile, and `.prettierignore` diffs, the four shared skeleton diffs,
every documentation diff, the live receipt header and first four verdicts,
the feedback edition's report header and verification stream, the relevant
sections of 07, the playbook, the phase-two plan, the concurrent plan, the map,
WO-033, the final-reviews README, the publication guidance in 08, the
`worktree publish` helper, and the WO-038 final-review package as precedent.
Tools: sandboxed Bash only, with `git`, `node`, `npm`, `npx`, `shasum`, `grep`,
`sed`, `awk`, and `python3` for one string insertion in this review's own
correction. No live model was invoked, no authenticated npm or GitHub call was
made, no destructive Git command ran, and the shared stash was untouched.
