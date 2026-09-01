# WO-005 final review FINAL-001

**Subject:** branch `wo-005`, working tree (uncommitted), 2026-09-01. Base,
`HEAD`, and `origin/main` all
`e3f8cbda968ef9ba258f093facaac21ea9e66a7b` — the revision the table itself
pins. Change set: `docs/planning/capability-table.md` (111 lines, new
`docs/planning/` directory), one map line in `docs/README.md`,
`docs/verifications/WO-005/VER-001.md`, and control-plane lifecycle state
under `docs/control/`.
**Authority:** `docs/work-orders/WO-005-capability-table.md`, unmodified by
this review.
**Inputs reviewed:** the work order end-to-end; the complete verification
sequence (`VER-001`, pass, the only report); every subject file; executable
evidence re-established first-hand; the roadmap surfaces the work order cites
(§Capability progression policies — levels table, policy list, visible-payoff
rule — and the v0.2.2 entry); the clean-room boundary. No ideation breakout
occurred and no receipt exists (`docs/intake/notes/` and `chats/` are empty at
review time), so the briefing's receipt duty is vacuously satisfied.
**Reviewer:** Fable 5, ultracode effort, fresh session dispatched by
`resume: final review`. WO-005's Model line permits any capable model.

**Verdict: WO-005 passes final review, with one bounded wording correction
applied.** The table's stated observation-window start date was factually
wrong by one day; the correction is the exact smallest fix VER-001's sole
non-blocking finding proposed, sits squarely in the wording-correction lane
`docs/final-reviews/README.md` grants this review, and is proven below to be
the only byte of the subject this review changed. No blocking or major finding
survives otherwise. The branch is ready for operator review and merge.

## Subject integrity

- The sorted `git status --porcelain -uall` hash was identical before and
  after the 13-agent read-only review fan-out (`d0435d8f…`); only the lead
  reviewer then applied the single recorded correction. No agent modified the
  repository.
- Checkpoint refs `refs/dotln/checkpoint/WO-005/1–4` exist and match their
  control-log events exactly. The `ImplementationReady` event carries
  `checkpointUnavailable: true` — the tooling's designed warn-and-proceed
  fallback, the same class as three logged WO-012/WO-101 events.
- `docs/control/resume.jsonl` is a pure trailing append over the committed
  history (Activated → ImplementationReady → VerificationRequested VER-001 →
  VerificationCompleted pass → FinalReviewRequested FINAL-001, all legal), and
  `docs/control/current.md` agrees with `npm run resume -- status`.
- `git diff main --stat` modifies no existing file under
  `docs/verifications/`, `docs/final-reviews/`, `docs/releases/`,
  `docs/decisions/`, `docs/lineage/`, `docs/product/`, `packages/`, `corpus/`,
  or `scripts/`. The deliverable is not gitignored.

## Correction applied by this review

One, proven one-line-contained by diffing the working file against the
pre-review checkpoint blob (`refs/dotln/checkpoint/WO-005/4`):

```diff
-repository evidence dated 2026-08-31 through 2026-09-01 and present at that
+repository evidence dated 2026-08-30 through 2026-09-01 and present at that
```

Basis, first-hand at the pin: `git blame --date=short e3f8cbd` gives
`docs/discovery/environment.md` 166/64/214 live lines dated
2026-08-30/-31/09-01 and `environment.json` 71/1/67; both files were created
by `4bae5f3` (2026-08-30) and `environment.md`'s H1 self-dates 2026-08-30. The
stated window therefore excluded 237 live lines of evidence the table itself
names (lines 20–23) and cites (the Transports row). VER-001 carried exactly
this as its sole non-blocking finding and proposed this smallest correction.
Two independent review lenses re-derived it from scratch, and each survived a
three-refuter adversarial panel unanimously at correction-needed grade.

The correction touches no code, contract, acceptance behavior (AC4 binds only
counts, and the table uses none), schema, compatibility, authority, or prior
verification evidence, so it does not trigger the repair loop. Affected checks
were rerun: only line 13 changed; the line-92 anchor slug, which legitimately
contains `2026-08-31`, is intact; no link target changed. The merged
deliverable consequently differs from the bytes VER-001 verified by exactly
this one word, disclosed here.

## Final evidence summary

All evidence re-established first-hand in this episode, not inherited:

- Root release-evidence suite `npm test`: **68/68**. Corpus harness
  `node --test corpus/harness/*.test.mjs` (cited by three rows): **22/22**.
- All **37** distinct link targets resolve at the pinned revision
  (`git cat-file -e` per target, 0 missing); all three anchor fragments match
  real heading slugs at the pin.
- AC1–AC5 re-established independently: all 12 enumerated capabilities present
  as rows with the full required column set; every row carries evidence links
  or an explicit latent label with source/outcome links; composite =
  min(dimensions) recomputed for all 12 rows with every `(min N)` annotation
  agreeing (the skeleton 2,2,2,2,1,1→1 and projections 1,1,2→1 rows exercise
  the anti-hiding rule); every row names a concrete blocking gate; every
  numeral in the table body classifies as level, date, or identifier — no
  counts used, window and scope stated regardless; the policy
  "breadth first / one skill point better" is verbatim in the roadmap's list
  (`06-roadmap.md:263`) with a one-paragraph rationale, target = current+1
  for all 12 rows, and the visible-payoff rule restated as binding.
- Scope discipline: `E0 — unknown` appears exactly 13 times (12 cells + the
  prose declaration); no baseline fabricated, and the closing note refuses to
  repurpose corpus sizes or test counts as one. No row's evidence cell cites a
  failing verdict — the failing reports (WO-002/VER-002, WO-003/VER-001,
  WO-004/VER-001) appear only in the evidence-boundary prose, explicitly
  labeled as failing.
- Declared-scope truth: the cadence subset (Once, After, Every, Until, Gate,
  Backoff) and program subset (Done, Emit, Invoke, Await, Sequence, Guard)
  match `packages/kernel/src/core.ts`'s switches and deferral throws exactly,
  independently restated by `packages/kernel/README.md`. Negative claims
  re-established at the pin: `requiredEvidence: []` at
  `packages/skeleton/src/scenario.ts:95`, no test drives verifier rejection,
  `cli.ts` has no automated coverage, and no transport adapter or compiler
  package exists — supporting the latent-0 rows.
- Level substantiation for all seven non-latent rows checked against the
  cited test files at the pin against the roadmap's level bar; each holds.
- Non-goals respected: the change set is documentation and control state only.
- `docs/README.md` map line: path correct, same change, placed between
  `docs/product/` and `docs/lineage/` in pipeline order, description column
  aligned with both neighbours.
- Clean-room: category scans over both deliverables and VER-001 for
  commercial-tracker names, predecessor-system naming, managed-host/gateway/
  employer-policy descriptions, internal hostnames, and credentials — zero
  hits.
- Roadmap fit: the v0.2.2 entry names `docs/planning/capability-table.md` and
  its exit condition ("every non-latent row naming its blocking gate"), which
  the deliverable satisfies; the roadmap's level vocabulary matches the
  table's exactly; no roadmap edit was needed or made.

## Verification-sequence soundness

The single-report sequence (VER-001, pass, one non-blocking finding) soundly
supports closure: its acceptance verdicts, evidence-gate mapping, scope
audits, and refutation reasoning all reproduce under this review's
independent re-derivation, and its sole finding was accurate — this review
upgraded it from carried observation to applied correction. VER-001 is
immutable; four errata are recorded here instead:

1. Its root-test-scope citation is `package.json:9`, not `:8` (line 8 is the
   build script). Substance correct.
2. The verbatim policy sits at `06-roadmap.md:263`; VER-001's `:281-283`
   points at unrelated prose. The AC5 pass itself is sound.
3. Its fenced blame figures (165/68/211 for `environment.md`, 71/3/65 for
   `environment.json`) do not reproduce under any method tried (`--date=short`
   parse and `--line-porcelain` author-time, multiple timezones); correct
   figures are 166/64/214 and 71/1/67, totals agreeing at 444/139, and its
   downstream "236 lines" should be 237. Direction, substance, and grade of
   its finding are unaffected; an adversarial panel graded this erratum
   note-level.
4. Its dispatch section names only the successful verify checkpoint, not the
   `ImplementationReady` `checkpointUnavailable` marker; the log itself
   discloses it (the same completeness gap WO-101's FINAL-001 noted of its
   verifier).

Together the citation errata suggest VER-001's line references were not all
machine-checked; this review's own citations were taken from command output.

## Note-grade findings carried

None blocks; all were verified in context.

1. **Authorization expiry/resource evidence is uncited.** The row's
   "expiry … and resource accounting L2" dimension is closed by
   `packages/kernel/test/kernel.test.ts:110-117`, which the evidence cell does
   not name; coverage is transitively cited via WO-003 VER-002's whole-suite
   record. The L2 claim is true at the pin. Optional later link addition; not
   corrected here to keep the correction set minimal.
2. **One kernel guard is untested.** `core.ts:18`'s
   "Every intervalMs must be positive" throw has no test anywhere at the pin.
   AC3 covers the subset's other failure paths, so the L2 claim stands under
   the roadmap's important-failures bar; a one-line `assert.throws` is a
   candidate for the cadence row's next increment.
3. **The `v0.2.1` tag phrasing is loose** (also observed by VER-001): the tag
   targets `329820e`, an ancestor two commits behind the pin, not the pin
   itself. The sentence's actual claim — the tag carries WO-004, WO-012, and
   intervening commits — is correct. Left as-is.
4. **Kilobyte-wide table rows.** The widest row is 1,073 characters against a
   369-character committed maximum elsewhere; Markdown rows cannot wrap.
   Carried for future table-maintenance tooling (a WO-005 non-goal today),
   since single-cell diffs will be hard to review.
5. **Implementer attribution gap.** No durable subject artifact records the
   implementing model/effort (VER-001 records the verifier: Claude Opus 4.5;
   this review: Fable 5, ultracode). Same class as WO-101 FINAL-001's note 6;
   recorded here as the closest durable result artifact.

## Remaining deviations and open questions

- **Ledger duty correctly skipped** (the required skipped-duty note): the
  policy is applied verbatim from the roadmap, the efficiency column
  instantiates the already-adopted ledger idea, and no progression idea was
  transformed.
- **Release disposition:** WO-005 is classified `v0.2.2` patch — the first
  boundary **above** the published `v0.2.1` tag. After merge, the separately
  authorized `resume: release close` evaluates an eligible publish; nothing in
  this review performs or implies any release action, and tag publication
  still requires the operator's explicit phrase with `--publish`.

## Proposed PR

- **Title:** `:memo: WO-005: capability table v1`
- **Body:** `docs/final-reviews/WO-005/PR.md` (committed alongside this
  report).

## Ready to merge

Closeout from here, per the playbook: record `final-review-result pass`,
commit the reviewed state, publish with the guarded `worktree publish` step.
The operator retains merge authority.

## Method

Review orchestrated as a four-lens read-only workflow at ultracode effort
(acceptance re-establishment; evidence-truth link and level substantiation;
verification-sequence soundness and control-plane legality; clean-room,
conventions, and product fit) — 13 agents, 73 recorded checks. A three-refuter
adversarial panel ran per candidate above note grade: two candidates (the same
window defect, raised independently by two lenses) survived unanimously; one
(the VER-001 blame-figure erratum) was killed to note grade 2–1. The lead
reviewer independently reran the executable evidence, re-derived the blame
distributions, read the work order, VER-001, the deliverable, and the cited
roadmap surfaces directly, verified control-log legality and all checkpoint
refs first-hand, verified the fan-out left the tree untouched by status-hash
comparison, applied the single correction, and proved its containment against
checkpoint `WO-005/4` byte-for-byte.
