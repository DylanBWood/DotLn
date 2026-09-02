# WO-006 final review FINAL-001

**Subject:** branch `wo-006`, working tree (uncommitted), 2026-09-01. Base,
`HEAD`, and `origin/main` are all `f2a4b232e1868691398964433c7e373fca4b84bb`,
which the published `v0.2.2` tag also names. The subject VER-003 verified is
73 tracked modifications plus the untracked additions (`.prettierrc.json`,
`.prettierignore`, `docs/AI-HARNESS-SECURITY.md`, ADR-0003 through ADR-0005,
`docs/planning/work-order-map.md`, the seven `docs/publication/` artifacts,
`docs/verifications/WO-006/`, `scripts/check-publication.mjs`, and
`scripts/test-publication.sh`) — 10,888 insertions and 3,187 deletions against
`HEAD`, the large majority authorized repository-wide Prettier reformatting.
This review adds this report, its PR body, two bounded corrections, and, under
operator direction, two draft work orders with their map rows (see
§Corrections and additions).
**Authority:** `docs/work-orders/WO-006-publication-bootstrap.md`, unmodified
by this review: twenty acceptance criteria, thirteen operator-authorized
expansions, two required corrections, one operator deferral, ten ideation
breakout receipts, a Claude startup correction receipt, and a final repair
evidence receipt.
**Inputs reviewed:** the work order end-to-end; the complete verification
sequence `VER-001` (fail), `VER-002` (fail), `VER-003` (pass), in order; the
full diff and every untracked addition; the executable evidence, re-run
first-hand; every breakout receipt with its ledger, product, decision, and
publication surfaces; the clean-room boundary; the control log and all
fourteen pre-review checkpoints.
**Reviewer:** Claude Fable 5.1 at `ultracode` effort in Claude Code 2.1.258
with sandboxed Bash, fresh session dispatched by `resume: final review`.
WO-006's Model line permits any capable model.

**Verdict: WO-006 passes final review, with two bounded wording corrections
applied.** All twenty acceptance criteria hold on independent re-derivation,
with the single exception of the AC8 clause the operator explicitly deferred,
which this review records without scoring exactly as VER-003 did. The
executable evidence gate is green at every stage. VER-003's four minor
findings were re-confirmed and are carried, not repaired: each would require a
code, test, lock-input, or scope-authority change that a final reviewer may
not make. No blocking or material finding stands. The branch is ready for
operator review and merge.

## Dispatch and subject integrity

`npm run resume -- final-review` allocated this exact report path and advanced
the control state from `verified` to `final-review`, recording checkpoint
`74101196cb3fbb4f7a6486ceca412b8079e506ff`
(`refs/dotln/checkpoint/WO-006/14`). Because `checkpoint()` runs before
`append()`, that snapshot is the tree immediately before the
`FinalReviewRequested` event; the working tree differs from it only by the
appended event, the regenerated projection, and this review's own changes.

- `docs/control/resume.jsonl` is a strict append: its first 8,423 bytes (38
  lines) are byte-identical to `HEAD` under `cmp`, and the fifteen WO-006
  events that follow form a legal path that an independent fold — written
  without importing `scripts/resume.mjs` — reproduces as
  `docs/control/current.md` byte for byte. All fourteen checkpoint refs
  resolve to commits whose parent is `HEAD`.
- `VER-001.md` has SHA-256 prefix `7a55c341def6306f` at checkpoints 3 through
  14 and in the working tree; `VER-002.md` has `c45a94082b59be09` from
  checkpoint 9 onward; `VER-003.md` has `c26154b8923beb3a` at checkpoints 13
  and 14 and in the working tree. No numbered record changed after it was
  written, and `git diff HEAD -- docs/verifications docs/final-reviews
  docs/releases docs/decisions` touches only the three directory READMEs
  (Prettier reflow, word streams identical) and the ADR-0002 append.
- Checkpoint 13 (VER-003 completed) to checkpoint 14 differs only in the two
  control files. Checkpoint 14 to the committed tree, measured through an
  isolated temporary index, differs only in the control files, this report and
  its PR body, and the files §Corrections and additions names.
- The six review lenses confirmed by `cmp` that every WO-006 surface they read
  was byte-identical to checkpoint 14; no agent wrote to the worktree. The
  lead reviewer edited only the files named below, and did so while the
  lenses were running, which two lenses observed and recorded rather than
  silently absorbed.

## Corrections and additions

Two corrections in the wording lane `docs/final-reviews/README.md` grants,
each proven contained by diffing against checkpoint 14 and each followed by a
re-run of the checks it could affect:

1. **`docs/planning/work-order-map.md`** — VER-003 finding 2's own suggested
   hardening. The "Now and after this close" block no longer names individual
   lifecycle steps (it was one transition behind at VER-003 and three behind
   by the time this review opened) and now defers to the control projection;
   the WO-006 catalog row carries VER-003 and this report in its evidence
   cell and drops its stale repair instruction. The file is Prettier-formatted
   (not ignored, contrary to this review's initial brief to the lenses, which
   one lens refuted), so it was re-printed through the pinned formatter and
   `npm run format:check` is green. The map is not a publication lock input.
   The row's "FINAL-001 pass" cell was authored before the verdict event
   existed and was made true by recording `final-review-result pass` before
   the commit; the sequencing is disclosed here rather than hidden.
2. **`docs/publication/software-engineer-toc.md:14`** — the edition now labels
   itself a lossy projection, as `base-outline.md` lines 89 and 103 require of
   every edition and as the everyday edition already does at its line 14.
   Exactly one sentence changed ("contract-first, implementation-deep, lossy
   projection"); no link, fact, limitation, permission, or evidence changed.
   Editions are not lock inputs — locks cover blueprint subtrees — so both
   locks remain `CURRENT` and `npm run publication:check` passes unchanged.
   VER-003 had recorded the missing label as a refuted observation because
   AC2 was still met; two of three adversarial refuters graded the correction
   note-level and permitted. The merged edition therefore differs from the
   bytes VER-003 verified by exactly this sentence.

Neither correction touches code, a contract, acceptance behavior, a schema,
compatibility, authority, a settled decision body, or prior verification
evidence, so neither triggers the repair loop.

**Operator-directed planning additions, outside the verified WO-006
subject.** With the dispatch the operator forwarded two follow-up work-order
nominations and, when asked how to treat them, wrote: "i supplied two possible
future WOs for you to review and then create". Asked whether to assign
identifiers (the nomination text said none should be assigned until planning
selects them) and where the documents should land, the operator selected
"Assign WO-013 and WO-014" and "In the WO-006 reviewed commit and PR". This
review therefore created `docs/work-orders/WO-013-portable-fixture-temp-roots.md`
and `docs/work-orders/WO-014-approval-burden-contract.md` as draft,
unactivated, version-unassigned orders, added their catalog rows and a
follow-up bullet to the work-order map, and lists them in the PR body as
unverified planning drafts. They are Prettier-ignored under the
scope-authority rule, so their formatting is by hand; their relative links
were checked and resolve. They change no code, contract, acceptance behavior,
schema, authority, or prior evidence of WO-006. The assessment behind them is
in §Follow-up work-order nominations.

## Final evidence summary

All evidence re-established first-hand in this episode, not inherited:

- `npm run format:check`: clean. `npm run publication:check`: 134/134
  headings indexed, three identical dual-voice claim links, both editions
  `CURRENT` at 27 and 42 linked source sections. `git diff --check`: clean.
- `tsc -b --force` then `node --test` over kernel and skeleton: 68/68. Corpus
  harness `node --test corpus/harness/*.test.mjs`: 22/22.
- All six shell suites and the complete `npm test` chain green from a mirror
  under `$TMPDIR` whose code under test (`scripts/resume.mjs`,
  `scripts/release.mjs`, `scripts/worktree.mjs`,
  `scripts/check-publication.mjs`, `scripts/backup-intake.sh`, `.gitignore`,
  and the tag-manifest template) was proved byte-identical with `cmp`, with
  exactly two lines per suite relocated from the literal `/private/tmp`
  prefix to the sandbox's temporary root — the same disclosed deviation as
  VER-001 through VER-003. The unchanged `npm test` was also run in this
  sandbox and stops after `format:check` at the first suite with
  `mktemp: mkdtemp failed on /private/tmp/dotln-publication-test.<suffix>:
  Operation not permitted`; that capture is the before-evidence WO-013 asks
  for. No fixture residue remained under the sandbox root afterwards.
- Independent re-derivations by the review lenses, not trusting the
  deliverable's own instruments: 134 headings enumerated by a separate
  fence-aware parser and anchored with the real `github-slugger` 2.0.0 (zero
  divergences from the index); the staleness loop reproduced in an isolated
  clone with the §7 hashes and both stored locks matching byte-exactly; the
  Prettier partition recomputed through Prettier's API (152 walked = 67
  ignored + 9 unsupported + 75 formatted + 0 unformatted + 1 symlink), with 41
  tracked modifications proved pure re-prints of their `HEAD` blobs including
  every `packages/` source and test file and `scripts/worktree.mjs`'s
  311-line diffstat; the `scripts/resume.mjs` non-formatting delta isolated to
  exactly three hunks (the reopen clause in `legalActions`, the checkpoint
  warning string, and the `fix` guard); the lockfile delta exactly
  `prettier@3.9.6`, `dev: true`, with nothing removed; a token-normalized
  8-gram detector over all ten local intake notes finding zero shared runs in
  `docs/publication/` and one elsewhere — the operator's own slogan, already
  committed at `HEAD`; zero clean-room, credential, hostname, e-mail, or
  personal-path hits in the changed set; 246 publication links and every
  edition link resolving at `HEAD` as well as in the working tree.
- Scope discipline and classification hold as VER-003 found: no `Claim` IR or
  `PublicationPlan` promotion, 08's seven-value vocabulary only, no extra
  edition, renderer, or publication, no runtime dependency, and no version,
  export, or `files` change; `v0.2.3` remains the correct patch class, the
  next boundary above the published `v0.2.2`.

## Verification-sequence soundness

The three-report sequence soundly supports closure. VER-001's blocking and
material findings, VER-002's two material findings, and every minor and
non-blocking finding in both were confirmed repaired by VER-003 first-hand and
re-confirmed here at the cited locations. VER-003's own reasoning reproduces
under this review's independent re-derivation, including its refutations. Its
four minor findings are accurate and are carried below.

VER-003 is immutable; errata verified by this review are recorded here
instead:

1. Line 59 says the log's first "4,996 bytes — HEAD's exact length" are
   identical; `HEAD`'s `resume.jsonl` is 8,423 bytes, and the identity holds
   over all of them.
2. Lines 557–558 cite the WO-006 receipt bullets as `:376-384` and `:629-637`;
   they begin at `:378` and `:630`.
3. Line 609 cites `scripts/test-checkpoint.sh:21-23` for the no-ref-minted
   assertion; it sits at `:22-24`.
4. The AC14 row reports "two unattributed generic uses of cognitive load";
   there are three (roadmap, pattern library, ledger), all pre-existing at
   `HEAD` and none book-attributed. The pass is unaffected.
5. VER-003 never names the `ImplementationReady` event's
   `checkpointUnavailable` marker; its "thirteen events, twelve checkpoint
   shas" arithmetic implies it and the log discloses it. The same
   completeness gap was recorded of earlier verifiers.

## Findings carried

None blocks. Each was verified in context; those from VER-003 were reproduced.

1. **Kernel-loop section states full grammars with no deferral note**
   (VER-003 finding 1). `docs/product/02-domain-model.md` §Events and
   decisions still lists 14 Cadence kinds and 11 Program constructors while
   the kernel evaluates 6 of each. Both editions link the section, so it is a
   lock input: the one-sentence disclosure VER-003 suggested changes both
   stored locks and the captured demonstration and is repair-class work for a
   future pass, not a final-review correction.
2. **One AC19 fixture mutant survives** (VER-003 finding 3, reproduced in an
   isolated mirror). Swapping the reopen event's source fields for the latest
   verification still passes `scripts/test-resume.sh`. The shipped code is
   correct; the fixture edit is a test change and belongs to a repair or a
   follow-on order.
3. **Two receipts omit the Unresolved-choices field** (VER-003 finding 4;
   three refuters unanimous at minor). The work order is scope authority and
   the verified subject, so adding bullets is not a permitted correction.
4. **The restore hint reads as post-transition.** The advertised
   `git checkout refs/dotln/checkpoint/... -- .` restores the tree from
   before the latest event and does not delete files absent from the
   snapshot, so a numbered report written after the snapshot survives as an
   orphan relative to the restored log. VER-003 refuted it as unpinned and
   this review concurs; `docs/PLAYBOOK.md` is the safe place for one
   sentence in a future pass, since the execution guide is a lock input and
   `render()` is code.
5. **Engineer chapter 8 names "attested isolation profiles"**, whose text
   lives under a vision-status candidate heading the chapter does not cite
   directly. Traceability holds because the cited Architecture H1 subtree
   spans the file, so the lock covers it, and no cross-edition fact diverges.
6. **Prettier-only AST change** in `corpus/harness/wo101-program-corpus.test.mjs`:
   numeric object keys were unquoted inside a `deepEqual` expectation. The
   file is byte-identical to Prettier's re-print of `HEAD` and the assertion
   is semantically unchanged; "pure re-print" means formatter-output equality.
7. **Immutable VER reports name the sandbox temporary root with its local
   uid.** Not a personal home path, credential, or employer identifier; this
   report and WO-013 say `$TMPDIR` instead.
8. **06 §Work-order navigation is indexed `planned`** while every "Candidate —"
   heading is `vision`. Defensible under the index's own rule because its
   first increment exists in the tree; a status label is acceptance content
   and was not touched.
9. **Ledger restraint-accounting entry does not restate the nonterminal-request
   clause in words**; 05 and 09, which AC9 binds, state it explicitly. The
   ledger is append-only.
10. **The LangGraph comparison page is cited by URL only in the receipt**, not
    in 03 or the ledger; nothing in 03 claims content from it.
11. **`/private/tmp` carries dozens of `dotln-*` entries from earlier
    sessions** (fixture roots, probes, logs). This review deleted nothing
    outside the sandbox root and records the residue for WO-013 as an
    observation about interrupted runs, not as its cleanup target.

## Operator-deferred axes — recorded, not scored

Per `WO-006` §Operator deferral for the VER-002 repair and VER-003
§Operator-deferred axes, this review read no personal settings file and ran no
`claude config` or `claude doctor`. Six items belong to the dedicated work
order the deferral names, which is WO-014's first phase:

1. AC8's second sentence — persistent `acceptEdits`, zero checkout-local allow
   entries, and a witnessed fresh-session startup — rests on the executor's
   receipt; VER-002 readback-confirmed six of seven pinned axes and found the
   startup half not assessable non-interactively.
2. The runbook's §Current posture "remembered command rules" row and its
   post-correction paragraph read as present-tense invariants.
3. The Claude startup correction receipt and the Final repair evidence receipt
   assert zero allow entries and a witnessed `accept edits on`.
4. ADR-0003 and ADR-0004 carry no backward supersession marker.
5. The `docs/README.md` config-log repair entry asserts the full posture and
   witnessed startup (dated by the log's convention, so an entry rather than
   an invariant).
6. `WO-006` records the operator "will use automode for now", while ADR-0005
   lists auto mode among its rejected alternatives for the persisted baseline.
   Both are true of what they describe (session practice versus persisted
   default); reconciling them is a superseding decision, never an in-place
   edit.

## Follow-up work-order nominations

The operator forwarded two nominations with the dispatch. Both were assessed by
a dedicated read-only lens and by the lead reviewer against the repository,
then created as drafts under the operator's direction quoted above.

**Nomination 1 → `WO-013` — portable temporary roots for shell test
fixtures.** Every factual claim reproduces: all six suites `mktemp` under a
literal `/private/tmp/dotln-<suite>-test.XXXXXX` and guard cleanup on that
prefix; `mktemp` under `$TMPDIR` succeeds while `/private/tmp` and `/tmp`
(a symlink to `private/tmp`) are denied in the sandbox; `scripts/resume.mjs`
already uses `os.tmpdir()`; VER-001 through VER-003 and this review disclosed
the relocation; an unchanged `npm test` fails at the first suite. It is
bounded to test infrastructure, conflicts with no settled decision, adds no
dependency or safety-setting change, and is correctly routed as a follow-up
rather than a WO-006 repair (any suite edit now would be code under the
fail condition). Refinements folded into the draft: two of the six guards
currently warn and continue with exit 0 while the other four exit 1, so
fail-closed cleanup is a named behavior change; the `stat -f` non-goal counts
three call sites; the `mktemp` failure quotes its substituted suffix.
Cleanup must derive from the created directory, never from a literal prefix,
which is the ledger's adopted fixture-hygiene rule already.

**Nomination 2 → `WO-014` — approval-burden baseline, remediation, and
fresh-session acceptance.** Its problem statement was corrected from "the
repair proved Claude's effective settings" to what the record supports (the
executor recorded them; VER-002 confirmed six of seven axes by readback; the
startup half is unwitnessed). Its classification vocabulary already exists in
05 and 09's restraint-attribution paragraphs and the draft reuses it. Its
overlap with the dedicated harness/posture reconciliation VER-003 required is
near-total — both need the same witnessed fresh session — so WO-014 is written
as that dedicated order, with reconciliation as an independently verifiable
first phase, the baseline second, and remediation plus fresh-session
acceptance third, and it consumes WO-013's verified result so the baseline is
not dominated by the known defect. Scenario E is constrained to synthetic
fixtures (a decoy denied path, a reserved `.invalid` name), consistent with
the runbook's rule never to test denies against a real credential or host.
Two planner notes are in the draft: evidence under `docs/discovery/` needs a
`.prettierignore` entry if it is to keep its bytes, and the auto-mode
divergence above is named as phase-1 subject.

Two observations from this review belong in WO-014's baseline as classified
boundary crossings: the GitHub CLI cannot read its configuration directory
inside the sandbox, so `worktree publish`'s preflight refuses before any
mutation and the PR step returns to the operator; and the Git credential
helper reported a keychain store failure on a read-only remote query that
nonetheless succeeded.

**Identity and sequencing.** The nominations asked that no identifier be
assigned until planning selects them; the operator, acting as planner in this
session, chose `WO-013` and `WO-014`. Both are opaque stable references,
drafts with no version, slot, or release promise; the map's follow-up bullet
recommends WO-013 before WO-014 and leaves their order against WO-007 to the
operator. No ledger entry is due for either: WO-013 applies the adopted
fixture-hygiene rule and WO-014 applies the adopted attention-interface and
restraint-accounting ideas; the skipped duty is stated in each draft.

## Remaining deviations and open questions

- **Shell suites ran relocated**, as in every prior report. The unchanged
  command's in-sandbox failure is captured above; WO-013 closes the gap.
- **Publish step returned to the operator.** `npm run worktree -- publish`
  preflights `gh --version`, which exits 1 in this sandbox because the CLI's
  configuration directory is read-denied, so the helper refuses before any
  push. The reviewed commit is made here; the operator runs the exact publish
  command from the same worktree outside the sandbox. No push, PR, or merge
  was attempted from this session.
- **Adversarial coverage was partial.** Twenty-six of the review's refuter
  and critic agents failed on a harness session-limit error after the six
  lenses completed; the lead reviewer adjudicated every unrefuted candidate
  first-hand and states so in §Method.
- **Ledger duty correctly skipped** for this review's own changes: the map
  wording, the edition label, and the two drafts transform no design idea.
- **Release disposition:** WO-006 is `v0.2.3`, the first boundary above the
  published `v0.2.2`. After merge, the separately authorized
  `resume: release close` evaluates it; nothing here performs or implies a
  release action.

## Acceptance criteria

| #   | Criterion (abbreviated)                                        | Result                                                                                                                                                     |
| --- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Every product section indexed with audience tags and status    | **Pass.** 134 headings, 134 rows, one-to-one by two independent sluggers; all labels in vocabulary.                                                        |
| 2   | Editions differ sharply; shared sources; no fact divergence    | **Pass.** 7 Parts/12 chapters/27 sources vs 8 Modules/17/42; 14 shared; no FACT/LIMITATION/PERMISSION/EVIDENCE divergence; engineer edition now self-lossy. |
| 3   | Dual-voice sample, identical claim links                       | **Pass.** Three links per voice, byte-identical, same order.                                                                                               |
| 4   | Staleness loop demonstrated and captured                       | **Pass.** Reproduced in an isolated clone; §7 hashes and both locks match byte-exactly; no probe residue.                                                   |
| 5   | No publication artifact derives from intake                    | **Pass.** Zero shared 8-grams in `docs/publication/`; no intake link or path.                                                                              |
| 6   | Ideation clean-room rewritten; receipts complete               | **Pass with note.** Ten batches, all ledger entries, all surfaces present; ledger 319/0 append; two receipts lack Unresolved choices (carried).             |
| 7   | Prettier exact; exclusions documented; everything formatted    | **Pass.** Exact 3.9.6, lockfile +17/−0, partition 67/9/75/0, 41 pure re-prints, ADR-0002 append-only.                                                      |
| 8   | Harness runbook accurate, sanitized, dated; posture evidenced  | **Pass on the assessable half; posture/startup half operator-deferred to WO-014.**                                                                          |
| 9   | Malcolm restraint accounting observable-only                   | **Pass.** Every clause in 05, 09, and the ledger; category lists identical on all three.                                                                    |
| 10  | Rule-source import stays a candidate planning surface          | **Pass.** Provenance, six states, three paths, suggestion ≠ selection, public scope qualified, no implemented-import claim.                                  |
| 11  | Settings fault sequence recorded without blame-shifting        | **Pass.** Consistent attribution across WO-006, ADR-0005, config log, runbook; ADR-0005 supersedes ADR-0004 Decision 4 only.                                |
| 12  | Embodied Explorer bounded post-1.0 candidate                   | **Pass.** Embodiment truth, learned model, Identity separate; safety boundary explicit; nothing in code.                                                    |
| 13  | Navigation: legal / eligible / recommended distinct; IDs opaque | **Pass with note.** Every evidence cell audited against its artifact or tag; map currency corrected here; no ID renumbered.                                |
| 14  | Team Topologies only a provenance-aware nomination             | **Pass.** No book-derived content, citation, number, or schedule.                                                                                          |
| 15  | Mission: dependable workflow as a means to operator flow       | **Pass.** Means/end hierarchy on every surface; no promise, inference, or metric-as-proof.                                                                  |
| 16  | Binary quench candidate, no severity score                     | **Pass.** OR into `conducting | quenched`; nine and typography non-canonical; recovery evidence-bound.                                                      |
| 17  | Flow Steward bypassable, revocable, authority-preserving       | **Pass.** Seven prohibitions verbatim; sources by URL; rejected stereotypes explicit.                                                                       |
| 18  | Temporal interpretation both actors; `expand()` bounded        | **Pass.** Attachment correctable; counts rule-specific; _Outliers_ unmined; no `rxjs` anywhere.                                                            |
| 19  | `resume: fix` reopens only against a preserved source          | **Pass.** Every clause exercised live in a throwaway repository; one fixture mutant survives (carried).                                                    |
| 20  | Brain/hands and related boundaries stay distinct               | **Pass.** LangGraph a lowering candidate; containers an attested probe; worktrees never containment; WO-009 untouched.                                     |

## Proposed PR

- **Title:** `:sparkles: WO-006: publication bootstrap, staleness loop, and dev tooling`
  — `:memo:` is reserved for documentation-only deliverables and this change
  adds a dev dependency, two scripts, a test-chain change, and a lifecycle
  transition; `:sparkles:` matches the mixed docs-plus-tooling precedent.
- **Body:** `docs/final-reviews/WO-006/PR.md`, committed alongside this
  report.

## Ready to merge

Closeout from here, per the playbook: `final-review-result pass` is recorded
before the reviewed commit; the operator then runs, from this worktree outside
the sandbox:

```bash
npm run worktree -- publish WO-006 --title ':sparkles: WO-006: publication bootstrap, staleness loop, and dev tooling' --body-file docs/final-reviews/WO-006/PR.md
```

The helper pushes only `wo-006`, opens the PR, and prints the release-close
handoff. The operator retains merge authority.

## Method

Review orchestrated as a six-lens read-only workflow at `ultracode` effort:
publication core and the checker as an instrument; control plane,
verification-sequence soundness, and AC19; Prettier, classification,
clean-room, links, and conventions; harness runbook, ADR chain, deferred axes,
and the two nominations; ideation batch A (AC6, 9, 10, 12, 14); ideation batch
B (AC13, 15–18, 20). Forty-three agents were launched; the six lenses and
eleven refuters completed (624 tool uses), then twenty-six refuters and the
completeness critic failed on a harness session-limit error. Adversarial
panels therefore completed for the engineer-edition label (two of three graded
note and permitted), the surviving AC19 mutant (survived), the two receipts
missing Unresolved choices (three unanimous at minor), the map currency
(superseded by the applied edit), and the map's early "FINAL-001 pass" cell
(survived as a sequencing note). The lead reviewer adjudicated every remaining
candidate first-hand — VER-003's errata by re-measuring the log, grepping the
report, and reading the cited lines; the draft corrections by reading the
scripts; the restore-hint note by reading `scripts/resume.mjs` and the
checkpoint contents — and built the acceptance matrix from the lenses'
per-criterion rows in place of the failed critic. Every lens returned its
commands and outputs, and every check the lead relied on was reproduced from
those commands or run directly. The lead independently re-ran the executable
gate, proved VER immutability across checkpoints, measured the pre- and
post-review deltas through an isolated index, applied the two corrections, and
re-ran the affected checks.

## Self-referential instruments — disclosure

`scripts/resume.mjs` allocated this report's path and will record its verdict,
and it is modified by the subject; its behaviour was exercised in throwaway
repositories and the control log was verified through git object bytes rather
than through the script. `scripts/check-publication.mjs` and `format:check`
are subject deliverables; their headline numbers were reproduced by separate
parsers, a separate slugger, a from-scratch lock reimplementation, and
Prettier's API from a mirror. None can fail silently in the way the
execution guide's abstention rule contemplates.
