# WO-007 final review FINAL-001

**Subject:** branch `wo-007`, worktree `DotLn-wo007`, uncommitted working tree,
2026-09-02. Base, `HEAD`, `origin/main`, and the live remote `refs/heads/main`
are all `08a79f240bf0a38d1eb0266316b5444e4a14581a`, which the published
`v0.2.3` tag also names; the branch carries no local commits, so the entire
subject is the dirty tree. At review open: 23 tracked modifications, 1,361
insertions / 357 deletions against `HEAD` (including the two `docs/control`
files), plus 14 untracked files totalling 4,495 lines:
`packages/skeleton/src/audit.ts` (1,106), `packages/skeleton/test/audit.test.ts`
(849), `docs/product/11-proteino.md` (260), the nine planning drafts WO-016
through WO-023 and WO-109, and the two verification reports. The subject is
exactly the tree VER-002 passed: every blob in `refs/dotln/checkpoint/WO-007/8`
matches the working tree except the two control files the verify transition
wrote (and the `AGENTS.md` symlink, which a content hash cannot compare), and no
file exists in the tree that is absent from that checkpoint (174 paths each
way). This review adds this report, its PR body, two bounded wording
corrections (§Corrections applied), and the lifecycle's own events.
**Authority:** `docs/work-orders/WO-007-audit-record-baseline.md` — objective,
scope discipline, constraints, five acceptance criteria, write-back duty,
evidence gate, non-goals, and four dated receipts (the `προτείνω` ideation
breakout, the Clean Room active-gem breakout, the root README direct-draft
scope expansion, and the VER-001 repair receipt). Unmodified by this review.
Each receipt names its raw batch or authority, surfaces, boundaries, unresolved
choices, and required review, as 07 §Ideation breakout receipt and verification
requires; all four were digested as subject.
**Prior reports:** `VER-001` (fail; six findings, all in the operator-added
planning/provenance scope, none in the audit implementation) → `resume: fix`
repair → `VER-002` (pass; all six findings repaired, one Minor finding, five
non-blocking observations). That is the complete sequence.
**Inputs reviewed:** the work order end-to-end including all four receipts;
VER-001 and VER-002 in full; the complete diff and every untracked file (the
audit source and tests line by line; the nine work-order drafts; chapter 11;
the root README; every product, ledger, planning, publication, and boundary
diff); the execution guide's resume, ideation, closeout, discipline, and model
sections; the final-review and verification READMEs; the playbook's
final-review steps; 09 §Fidelity levels and §Bootstrap sequence and the
roadmap's v0.3.0 rung; the WO-006 and WO-015 final reviews as format and
correction precedent; the control log, all nine pre-review checkpoints, and
the clean-room boundary.
**Reviewer:** Claude Fable 5.1 (model id `claude-fable-5-1`) at `max` effort in
Claude Code with sandboxed Bash, fresh session dispatched by
`resume: final review`, no sidecar agents. WO-007 permits any capable model. No
implementer, repair, or verifier context was carried into this session.

**Verdict: WO-007 passes final review, with two bounded wording corrections
applied.** All five acceptance criteria hold on evidence re-established in this
session: the TypeScript lanes and the skeleton CLI unmodified, the six shell
suites from a byte-verified relocated mirror, two separate CLI invocations
producing byte-identical projections, and a thirteen-mutation drill in a
scratch mirror in which every mutation of an acceptance path failed a named
test. The constraints hold (zero new dependencies, kernel byte-identical,
deliverable inside the skeleton package, `--audit` additive). The write-back
and ledger duties are discharged. All six VER-001 findings are repaired as
VER-002 found, and VER-002's citations reproduce. The expanded documentation
subject was reviewed against each receipt's own review list and against the
settled decisions; nothing presents a speculative choice as settled, no
authority widens, and the clean-room sweep is clean. Two findings were
corrected in the wording lane `docs/final-reviews/README.md` grants; one minor
test-adequacy finding is carried because its remedy is a test change; the rest
are notes and handoff instructions. Nothing touches code, a contract,
acceptance behaviour, a schema, compatibility, authority, or prior verification
evidence, so the repair loop is not triggered. The branch is ready for operator
review and merge.

## Self-referential instruments — disclosure

1. **`packages/skeleton/test/audit.test.ts` is both the deliverable and the
   acceptance instrument.** I did not accept its self-report. In a scratch
   mirror of the repository (`rsync` excluding `.git` and build output, with
   the workspace `node_modules` links resolving inside the mirror), thirteen
   single-point mutations were applied one at a time to a copy of `audit.ts`,
   each rebuilt with `tsc -b --force` and run through `node --test`; the
   original `audit.ts` was re-hashed afterwards (`9ef5b4e0…`, unchanged).
   Results are in §Final evidence summary and §Findings F-3.
2. **`scripts/resume.mjs` allocated this report's path, minted checkpoint 9,
   and will record the verdict.** It is not in the WO-007 diff
   (`git diff --stat HEAD -- scripts` is empty; `package.json` maps `resume` to
   it unchanged), its failure mode is loud (append-only log with a regenerated
   projection), and an independent fold written for this review without
   importing it reproduces `docs/control/current.md` byte for byte at phase
   `final-review` (re-checked after the verdict is recorded).
3. **`scripts/check-publication.mjs` (merged WO-006) checks publication
   surfaces that are part of this subject.** Its printed locks were compared
   against the committed lock lines in both edition outlines and against the
   transcript in `staleness-demonstration.md` §9; all three agree. A separate
   link resolver written for this review (GitHub slug rules, fence-aware)
   resolved every local link in the 33 changed or new Markdown files
   independently of the checker.
4. **The shell suites could not run as written.** This session's sandbox denies
   writes under `/private/tmp`, where all six suites hardcode their `mktemp`
   root; the unmodified `npm test` stops at the first suite with
   `mktemp: mkdtemp failed on /private/tmp/dotln-publication-test.<suffix>:
   Operation not permitted`. The suites ran from a scratch mirror whose only
   change is that prefix (exactly two lines per suite, shown by `diff`; every
   helper they copy — the four `.mjs` scripts, `backup-intake.sh`,
   `.gitignore`, the tag-manifest template, and the two kernel sources — proved
   byte-identical by `cmp`). The worktree suite additionally required the
   sandbox root's realpath (`/private/tmp/claude-501/…`) because
   `worktree.mjs` prints resolved paths while the suite composes its
   expectation from the literal root; under the symlinked `/tmp/claude-501/…`
   prefix it fails at `scripts/test-worktree.sh:42`, a relocation artifact,
   not a defect (the helper is byte-identical to `v0.2.3`). This is the WO-013
   condition, disclosed by VER-001, VER-002, and every prior report, and is
   not scored against WO-007. No tracked file was touched to obtain any
   evidence; `.claude/settings.json` is byte-identical to `HEAD` and this
   worktree holds no local settings file.

## Dispatch and subject integrity

```text
pwd                                      /Users/dylanwood/Projects/DotLn-wo007
git rev-parse --show-toplevel            /Users/dylanwood/Projects/DotLn-wo007
git branch --show-current                wo-007
```

`npm run resume -- final-review` allocated exactly
`docs/final-reviews/WO-007/FINAL-001.md` (the directory did not exist),
advanced the control state from `verified` to `final-review`, and minted
checkpoint `065f6f654759e7e8915ae97752202e6d9a714c51`
(`refs/dotln/checkpoint/WO-007/9`). Checkpoint 9 differs from checkpoint 8 only
in the two control files (`git diff --stat`: 5 insertions, 4 deletions), and
every WO-007 checkpoint (1 through 9) is parented on `08a79f2`.

- **Control log is a strict append.** The first 13,926 bytes (60 lines) of
  `docs/control/resume.jsonl` are byte-identical to `HEAD` under `cmp`; the
  file now has 69 lines; `git diff -U0 HEAD` shows zero removed lines. The nine
  WO-007 events form the legal path `WorkOrderActivated` →
  `ImplementationReady` → `VerificationRequested` (VER-001) →
  `VerificationCompleted` (fail) → `RepairRequested` → `RepairCompleted` →
  `VerificationRequested` (VER-002) → `VerificationCompleted` (pass) →
  `FinalReviewRequested`, each carrying the checkpoint SHA and ref that
  `git for-each-ref` reports.
- **The audit deliverable is byte-frozen across the whole repair and
  verification window.** `packages/skeleton/src/audit.ts`
  (`9ef5b4e067554fbeccd2b2303a8465a58f83504f`),
  `packages/skeleton/test/audit.test.ts`
  (`3bb723bc02620fb4d4968ea8bbf2cab5a0c6a20d`), and
  `packages/skeleton/src/cli.ts` (`2223480d595dd896d53be9fafd3035302630bb9e`)
  have identical blob hashes at checkpoints 3 (VER-001 allocation), 6, 7, 8,
  9, and in the working tree. The repair window (checkpoints 3 → 8, excluding
  control and verification files) touched 23 files, all documentation.
- **The verification reports are immutable.** `VER-002.md` has SHA-256 prefix
  `ed713d5750c52f7e` on disk and at checkpoints 8 and 9; `VER-001.md` has
  `d0ab60731605339d` on disk and at checkpoint 4.
- **Protected paths are untouched.** `git diff --stat HEAD` over
  `packages/kernel/`, `package.json`, `package-lock.json`, `scripts/`,
  `docs/decisions/`, `corpus/`, `.claude/`, `.gitignore`, `.prettierrc.json`,
  `.prettierignore`, and `tsconfig.json` is empty. `docs/intake/` in this
  worktree holds only its three tracked `.gitkeep` files; the main checkout
  holds the single raw copy (counted, not read).

## Final evidence summary

Every item below was re-established in this session, not inherited.

- **Toolchain:** node v22.2.0, npm 10.8.0, git 2.55.0, Prettier 3.9.6,
  TypeScript 5.4.5 — matching VER-002's header.
- **Unmodified lanes:** `npm run format:check` clean;
  `rm -rf packages/*/dist && tsc -b --force` clean; `node --test` over kernel
  and skeleton: 77 tests, 77 pass, 0 fail;
  `npm run publication:check -- --print-locks`: 149/149 headings indexed,
  three identical dual-voice claim links, both editions `CURRENT` (27 and 42
  linked source sections), locks `3e4131fb…56f72a4` and `4034d583…58c04dd`
  equal to the committed lock lines and to `staleness-demonstration.md` §9;
  `git diff --check` clean.
- **Relocated shell suites (disclosure item 4):** `test-publication.sh`,
  `test-backup-intake.sh`, `test-resume.sh`, `test-checkpoint.sh`,
  `test-worktree.sh`, and `test-release.sh` all PASS; the release suite printed
  `malformed cadence source refused before tag publication` and the exact
  six/eight cadence arrays. No fixture residue remained under the sandbox root
  afterwards.
- **Skeleton CLI, witnessed:** `npm run skeleton` ends
  `verified=true candidates=1`; `npm run skeleton -- --audit` prints
  `L0 RECEIPT`, `CAUSAL TIMELINE`, and `GOVERNED RAW JSON` (1,010 lines after
  the banner: 10 receipt entries, 10 timeline entries, 21 retained event
  envelopes) and then the same receipt. Everything printed before `L0 RECEIPT`
  is byte-identical to the default form's output, so the flag is additive. Two
  separate invocations produced byte-identical output (SHA-256 prefix
  `87f9d218…`). No `"payload"` key appears outside the governed-raw section.
- **Mutation drill (disclosure item 1), thirteen mutations:** denied record's
  `authorityEnvelopeRef` replaced → AC4 fails; L0 `timelineLink` without the
  record anchor → AC3 fails; causation dependencies ignored in `causalOrder` →
  the causal-ordering test fails; grouped evidence links reduced to the primary
  event → AC3 and AC4 fail; governed raw drops the first event → AC3 fails;
  refusal association labels swapped → AC4 and the association test fail;
  projection scope forced to `log:mixed` → AC3 and the scope test fail;
  recovery `originalCommandEventId` pointed at the redispatch event → AC2
  fails; `no-op` record dropped → AC2 and AC3 fail. Four survived: the
  verification verdict forced to `passed` regardless of `accepted`; a
  partially non-canonical `NoOp` evidence list accepted; the non-finite
  `occurredAt` refusal disabled; the `schemaVersion !== 1` refusal disabled.
  See F-3.
- **Independent link resolution:** 316 local links in 33 changed or new
  Markdown files; all resolve (the map's new FINAL-001 link resolves once this
  report is in the same commit).
- **Clean-room sweep:** category grep over all 37 changed or new files
  (tracker/ALM product names, predecessor names, managed-host and gateway
  terms, internal hostnames and domains, e-mail addresses, credential and key
  patterns): the only hits are `CLAUDE.md`'s own boundary statement and three
  pre-existing, unchanged ledger lines that record earlier genericisation. The
  predecessor is named only generically and as `v1`. Absolute operator home
  paths appear in VER-001, VER-002, and the WO-007 repair receipt's
  backup-archive paths (VER-002 observation; not a stop condition; the
  operator's call).

## Verification-sequence soundness

A failed VER-001 repaired under `resume: fix`, a `repair-complete` checkpoint,
and an independent VER-002 pass is a sound basis for closure. VER-002
re-established the audit result independently, corroborated F1's provenance
repair by re-measuring overlap rather than trusting the receipt, and re-checked
F2 through F6 at their cited locations; I read each of those locations myself
(the provenance lines in WO-016 through WO-022, the map's provenance section,
WO-023 criterion 3 versus 7, WO-109's `Depends on` and preflight, WO-022's v3
bounds and criterion 9, WO-018's `Depends on`) and concur. Every concrete
VER-002 citation I checked is exact: `audit.ts:23` (the class table), `:126`
(the record base; the union is at `:205`), the test locations `:63`, `:166`,
`:238`, `:802`, `:837`, `scenario.ts` returning its input `log` unchanged from
`replayScenario`, the skeleton README sentence at `:49`–`:52`, WO-016's
observed-problem section, the 149/149 coverage, the lock values, the 77-test
count, and the checkpoint SHAs. VER-002's harness deviation touched no tracked
file. VER-001's own evidence run was the unmodified `npm test` under a
different harness and stands; VER-002 cites it accurately.

## Corrections applied by this review

Two corrections, in the wording lane `docs/final-reviews/README.md` grants,
each proven contained by diffing against checkpoint 9 and followed by a re-run
of the checks it could affect. `npm run format:check`,
`npm run publication:check`, the link resolver, and `git diff --check` are
green afterwards; neither file is a publication lock input.

1. **`docs/planning/work-order-map.md`** (F-1) — the "Legal now" bullet and the
   WO-007 catalog row described VER-001's failure and a repair cycle "in
   progress". True when the executor wrote them during repair; false at the
   moment they would be committed beside VER-002 and this report. Following
   WO-006 FINAL-001 §Corrections item 1 and WO-015 FINAL-001 F-1 — the same
   block and the same row, corrected at final review for the same reason — the
   bullet now defers to the catalog row and the control projection, and the
   row's evidence, preflight, and disposition cells read "VER-002 pass;
   FINAL-001 pass; reviewed state committed and awaiting operator merge;
   `v0.3.0` remains unpublished pending a fresh release close", "operator merge
   and a fresh release close remain required", and "passed VER-002 and
   FINAL-001; awaiting operator merge and a fresh `v0.3.0` release close".
   Thirteen lines (`git diff refs/dotln/checkpoint/WO-007/9 --
   docs/planning/work-order-map.md`: 7 insertions, 6 deletions), re-printed
   through the pinned formatter; the table's column widths did not change. The
   map declares itself "not lifecycle or scope authority". As in both
   precedents, the row's "FINAL-001 pass" cell is authored before the verdict
   event exists and is made true by recording `final-review-result pass`
   before the reviewed commit; the sequencing is disclosed here rather than
   hidden.
2. **`packages/skeleton/README.md:52`** (F-2, VER-002 F1) — the sentence saying
   the audit tests "require byte-identical output over live and replayed JSONL"
   now says "over the live log, its re-encoded form, and an independently
   re-run scenario log", which is what `audit.test.ts:837` proves:
   `replayScenario` returns its input `log` string unchanged
   (`scenario.ts:431`), so the replay leg reduces to `f(x) === f(x)` and the
   substantive identity property rests on the encode/decode round trip and the
   fresh `runScenario` leg. One sentence (2 insertions, 1 deletion); no link,
   fact, permission, or evidence changed. The test itself is untouched — a
   redundant assertion is not a defect, and a test edit is outside this lane;
   WO-016 already owns the structural cause and will restore a real replay leg
   when the kernel's `replay()` drives the scenario. The roadmap's v0.3.0 exit
   sentence ("identical projection output over live and replayed logs")
   carries the same wording, is met in letter and, through the re-run leg, in
   substance, is a lock input, and was left alone.

No other file was changed. The whole-tree delta against checkpoint 9 is exactly
the two control files, these two corrections, and this report with its PR body.

## Findings

Grades follow the rubric blocking / major / minor / note; none is blocking or
major.

**F-1 (minor, corrected above): stale work-order-map projection.**

**F-2 (minor, corrected above): the skeleton README overstated the replay leg**
(VER-002 F1).

**F-3 (minor, carried; the remedy is a test change): four negative branches of
the audit fold are implemented and documented but not bound by any test.** The
mutation drill's survivors: (a) `deriveAuditRecords` maps `accepted` to
`passed | failed | unknown` (`audit.ts:586`–`:592`), but no assertion pins
`failed` or `unknown` — the hand-built `accepted: false` fixture at
`audit.test.ts:767` asserts only the association label and event ids, and the
demo log contains only a passing verification — so a fold reporting every
verification as `passed` passes the suite; (b) the partial-evidence refusal at
`:647`–`:651` (a `NoOp` whose evidence list mixes canonical and unknown ids) is
not exercised — the existing negative case uses an all-unknown list, which the
`length === 0` branch alone catches; (c) the non-finite `occurredAt` refusal at
`:369` and (d) the `schemaVersion !== 1` refusal at `:352` are never
triggered, although 09 §Audit projections lists both among the fold's
refusals. The code is correct by inspection on all four, no acceptance
criterion requires these fixtures, and the evidence gate ("every criterion
mapped to a named test or captured output") is met; this is test thinness of
the WO-006 FINAL-001 "one mutant survives" class. Recommended home: WO-016
(which already owns a negative scenario outcome and the skeleton test rewrite)
for (a), and WO-108's mutation probe or the same order for (b)–(d). Four
one-line assertions would close all four.

**F-4 (note, handoff instruction): the main checkout's ignored
`.claude/settings.local.json` will refuse the release close.** This worktree
holds no local settings file and no non-disposable ignored material
(`git ls-files --others --ignored --exclude-standard`, filtered by the finish
gate's own allow list, is empty), so `worktree finish` will pass. The main
checkout at `/Users/dylanwood/Projects/DotLn` still holds its globally ignored,
non-disposable `.claude/settings.local.json` (confirmed read-only by directory
listing), and `npm run release -- close WO-007 --publish` calls
`ensureNoIgnoredInfluence(main)` (`scripts/release.mjs:725`) before anything
else; it would refuse with `main checkout contains ignored material that can
contaminate release evidence: .claude/settings.local.json`. Same as WO-015
FINAL-001 F-3; move the file out before `resume: release close`.

**F-5 (note, hardening candidate): host-locale-dependent tie-break.**
`projectCausalTimeline`'s append-stable sort (`audit.ts:964`–`:968`) breaks
ordinal ties with `localeCompare()` and no explicit locale, while `causalOrder`
(`:902`–`:909`) uses code-unit comparison. Under schema version 1 a tie arises
only between the two records of one `CommandResult` (`external-effect` and
`result`), whose class names differ at the first letter in every locale, so
today's output is deterministic across hosts and the byte-identity evidence
stands; a future class pair differing only in punctuation could order
differently under ICU collation. Replace with the code-unit comparison already
used above it when `audit.ts` is next open (WO-016 forbids touching it; a later
order).

### Candidates considered and not sustained

- _L1 links to L4, skipping L2 and L3, against the "links one level down"
  clause._ Not sustained: 09 §Fidelity levels requires each lossy view to link
  to the records it summarises and state whether deeper data exists; L2 and L3
  are bootstrap steps 4–7 material this order explicitly defers; the timeline's
  `deeperProjection` names L4 with `availability: "exists"` and
  `intendedAccess: "restricted"`; both verifiers accepted the same reading.
- _`docs/publication/audience-status-index.md` labels five chapter-11 sections
  `specified` although the chapter is a horizon._ Not sustained: the index
  vocabulary classifies what a section does (states a contract or invariant
  versus paints a vision); those five sections state contracts (the
  shape-first ladder, the application/platform boundary, intervention truth,
  promotion never silent, the evidence ladder); VER-002 accepted the
  classification; and a status label is acceptance content outside this lane.
- _The root README will read stale once `v0.3.0` is tagged ("This checkout
  contains that rung under review")._ Not sustained as a correction: the
  sentence is anchored to "the published boundary at the start of WO-007" and
  is true at merge; it is operator-authored direct-draft text; refreshing it
  after the release is ordinary follow-on documentation.

## Expanded documentation subject

Each receipt's own review list was worked through against the promoted
surfaces.

- **Planning batch WO-016 through WO-023 and WO-109.** Every `Depends on:`
  clause agrees with the map's dependency column and its "Now" prose (WO-016:
  WO-007; WO-017, WO-019, and WO-023: `main` at or after `v0.2.3`; WO-018:
  WO-017 with WO-013 as recommended sequencing; WO-020: WO-007 + WO-016;
  WO-021: WO-020 + WO-018 + WO-019; WO-022: WO-021 + WO-008; WO-109: WO-007
  with reconciliation as activation preflight). Each of WO-016 through WO-022
  carries its `**Direct-draft provenance:**` line; WO-023 and WO-109 are
  synthesis. None grants authority through possession (beacons, codebooks,
  senses, and skills are repeatedly "not authority"), none reopens an ADR, and
  each states model, effort, release class, evidence gate, write-back duty, and
  non-goals. WO-016's observed-problem section accurately describes the
  hand-mirrored replay path that F-2 rests on. WO-023 pins its compiled
  reviewer to Claude Fable 5.1 at `max`, treats the Clean Room floor as a hard
  guard, and records the direct-to-work-orders filing of this batch as a
  bootstrap exception rather than the rule.
- **`προτείνω` (chapter 11 and its bounded cross-links in 00, 04, 06, 10,
  `docs/README.md`, and the root README).** Platform, application, UI host,
  model, harness, simulated resident, and domain actor stay distinct;
  communicative force and authority are held orthogonal; the evidence ladder
  keeps correlation below causation and scopes even its top rung to declared
  runs; latent measures name proxy, evaluator, and limitation; "mystery before,
  provenance after" keeps surprise inspectable; the Generative Agents paper is
  cited to its primary source as inspiration, and the media and game references
  are labelled operator recollection and shape with explicit disclaimers. The
  chapter's status line and §Unresolved product choices keep it visibly
  unsettled; the roadmap and 10 both say naming the destination moves nothing
  on the ladder. 00-vision's provenance note dates the 2026-09-02
  operator-instructed sources.
- **Clean Room as an active (`CLAUDE.md`, 03, 04, 05, 07, `docs/README.md`,
  ledger, WO-023).** The employer/secret floor is locked on every surface and
  compiles to an external guard, never a support; exactly one source-treatment
  strategy or an explicit ordered pipeline; assurance supports only add
  evidence or narrow promotion; Direct Draft Fidelity requires explicit
  operator filing direction and recorded provenance and cannot be inferred from
  polished wording or a filename; Beware of Naive Interventionism can argue for
  preservation but not for passing unsafe material. ADR-0001 is extended, not
  reopened (`docs/decisions/` untouched). `docs/README.md` carries the dated
  config-log line; the change is handling precision, not a safety-boundary
  move.
- **Root `README.md` (direct draft).** VER-002's fact-check of every
  capability, release, platform, test-suite, and active-slot claim was
  spot-checked and holds (published boundary `v0.2.3`; skeleton first shipped
  at `v0.2.0`; zero kernel runtime dependencies; the `npm test` lane list; the
  corpus lanes separate; `v1.0.0`'s single exit criterion; the effort-drift
  confession; the tag-annotation manifest; `checkpointUnavailable` entries in
  the log). The hedges are load-bearing. The predecessor is described only
  generically. The receipt's fidelity half — comparing the filed README with
  the operator's supplied draft — is not dischargeable by a reviewer because no
  artifact of the draft exists (VER-002 observation); it is the operator's, at
  PR review.
- **Publication surfaces.** Fourteen new headings indexed (chapter 11,
  `Shape-first synthesis`, the `προτείνω` interface section) plus the Clean
  Room pattern section; both locks refreshed for unchanged linked subtrees;
  `staleness-demonstration.md` appends §8 and §9 and its discontinuity note now
  points at "the latest recapture".
- **Ledger and write-back.** `docs/lineage/idea-ledger.md` gains four
  append-only sections (Clean Room, the entropy review, `προτείνω`, and the two
  adopted WO-007 audit ideas); no earlier entry is rewritten (`git diff` shows
  additions only). 09 replaces the candidate envelope with the pinned
  `AuditRecord` schema version 1, the class-by-class required-field table, the
  two-audience question table, and the projection semantics, and states that
  `recordedAt`, policy, runtime, integrity, and redaction data were never
  collected rather than inventing them. The roadmap's v0.3.0 rung already names
  WO-007.

## Acceptance criteria

| #   | Criterion                                                                                          | Verdict | Evidence                                                                                                                                                                                                                                                                                                                                                                                                       |
| --- | -------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Consequential-action enumeration with the question each record answers, per audience              | met     | `consequentialActionClasses` (`audit.ts:23`–`:122`) names seven classes with source event types, required references, an operator question, and a verifier question; pinned by a literal expected value at `audit.test.ts:63`; mirrored in 09's two tables                                                                                                                                                     |
| 2   | Minimal `AuditRecord` compiles; every record references canonical ids, never copied payloads       | met     | discriminated union at `audit.ts:126`–`:212`; `tsc -b --force` clean; `audit.test.ts:166` asserts every record's event ids are canonical, no `payload` key, no candidate path or WorkOrder body in the serialisation, a denied record carries no `commandId`, and the recovery record equals a literal; witnessed in the CLI: 0 `"payload"` keys outside governed raw                                            |
| 3   | Three projections over the WO-003 demo log; each lossy view names omissions and links one level down | met     | L0 (`fidelity: "L0"`, six omissions, links `causal-timeline`), L1 (`fidelity: "L1"`, six omissions, published `orderPolicy` and correlation groups, links `governed-raw-json`), L4 (all 21 envelopes, `restricted` intent, `enforcement: "deferred"`); `audit.test.ts:238`; captured 1,010-line output; mutations M2, M4, M5, M8 each fail it                                                                  |
| 4   | Step 9's structural refusal visible in receipt and timeline with its authority decision            | met     | receipt entries `repo.delete`/`requested` (evt_10) and `repo.delete`/`denied` with `authorityEnvelopeRef: "auth_seiri"`, `reason: "effect denied"`, evidence `evt_10, evt_11, evt_12`; the timeline entry adds `association: "derived-same-episode-time-adjacency"` and no `commandId`; `audit.test.ts:802`; mutations M1, M4, M6 each fail it                                                                  |
| 5   | Re-running the projections over a replayed log yields identical output                             | met     | `audit.test.ts:837` (live, replayed, re-encoded, independently re-run; the fold does not mutate the log); two separate CLI invocations byte-identical; the replay leg's vacuity is disclosed in F-2 and now stated honestly in the skeleton README                                                                                                                                                              |

Constraints: `package.json`, both package manifests, and the lockfile unchanged
(zero new dependencies; the CLI reuses the kernel's `decodeLog`); the
deliverable lives inside `packages/skeleton/`; `packages/kernel/` byte-identical
to `HEAD`; the `--audit` flag is additive. Non-goals respected: no access
enforcement (declared `deferred`), no crash-ambiguity simulation, no backup
exercise, no dashboards, no SQLite, no signed exports, no logging or metrics.

## Remaining deviations and open questions

None requires a change to the subject.

- **Shell suites ran relocated** (disclosure item 4). WO-013 closes the gap;
  the operator may re-run the unmodified `npm test` outside a sandbox once
  before merging if belt-and-braces evidence is wanted, as VER-002 suggested.
- **Publish step returned to the operator.** `npm run worktree -- publish`
  preflights `gh --version`, which exits 1 in this sandbox because the GitHub
  CLI's configuration directory is read-denied, so the helper refuses before
  any push (fail closed). The reviewed commit is made here; the operator runs
  the exact command in §Ready to merge from this worktree outside the sandbox.
- **README fidelity is the operator's check** (above).
- **Test thinness carried** (F-3) and the locale tie-break (F-5): candidates
  for WO-016 and WO-108.
- **Automated CLI output coverage** for the default and `--audit` forms is
  still absent; the ledger parks it to WO-016; both forms were witnessed here.
- **The CLI banner prints `@dotln/skeleton v0.2.0`** while the skeleton README
  calls the output "the v0.3.0 audit projections"; package versions are
  assigned at release close, so the strings differ by design (VER-002
  observation).
- **Absolute operator home paths** in the two verification reports and the
  repair receipt: existing precedent in merged evidence; not a clean-room stop;
  the operator's call.
- **Ledger duty:** discharged for the subject; no entry is owed for this
  review's own two corrections, which transform no design idea.
- **Release disposition:** WO-007 is `v0.3.0`, a minor above the published
  `v0.2.3`. After merge, the separately authorized `resume: release close`
  evaluates it and will re-run all merged evidence from the main checkout,
  including the unrelocated shell suites; nothing here performs or implies a
  release action.
- **Attribution:** the reviewed commit carries a plain subject and no
  attribution trailer, per the operator's standing rule and the repository's
  hand-authored history.

## Proposed PR

- **Title:** `:sparkles: WO-007: audit-record baseline with three projections`
  — the change adds exported runtime capability (the audit fold, its types,
  and the CLI flag) alongside documentation, so it is not the `:memo:` case;
  WO-006 is the mixed precedent.
- **Body:** `docs/final-reviews/WO-007/PR.md`, committed alongside this
  report.

## Ready to merge — handoff

Closeout from here, per the playbook: `final-review-result pass` is recorded
before the reviewed commit (it also makes the map's "FINAL-001 pass" cell
true); the reviewed state is committed with a plain subject. The operator then
runs, from this worktree outside the sandbox:

```bash
npm run worktree -- publish WO-007 --title ':sparkles: WO-007: audit-record baseline with three projections' --body-file docs/final-reviews/WO-007/PR.md
```

The helper pushes only `wo-007`, opens the PR, and prints the release-close
handoff. The operator retains merge authority. After the merge, and only under
a fresh `resume: release close`, `npm run release -- close WO-007 --publish`
runs from the main checkout; before that command, move the main checkout's
`.claude/settings.local.json` out of the repository (F-4), or the close refuses
by name. The close reruns all merged evidence and may cut annotated `v0.3.0`.

## Method

Single-session lead review at `max` effort, no sub-agents. Sequence: dispatch
resolution and control-state read; the work order with all four receipts;
VER-001 and VER-002 in full; the complete diff and every new file read
directly; control-plane integrity by blob comparison against checkpoints 8 and
9, `cmp` of the log prefix, and an independent fold; the unmodified TypeScript,
formatter, publication, and whitespace lanes; the six shell suites from a
byte-verified relocated mirror; the skeleton CLI in both forms with a
determinism re-run and a default-output identity check; the thirteen-mutation
drill in a scratch mirror; an independent link resolver over every changed
Markdown file; a category clean-room sweep; spot-checks of VER-002's citations;
the two corrections with a diff against checkpoint 9 and re-run checks.
