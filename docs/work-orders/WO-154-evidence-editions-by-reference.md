# WO-154 — Evidence editions keyed by behavior and recorded by reference: a feedback self-host edition records its subject and baseline files as blob references resolved from Git, staleness follows a behavioral identity with the version pins as metadata, a pins-only change re-mints without a live episode, and every existing edition stays byte-identical (v0.46.0)

**Model:** any capable model. The one live row is the re-mint's self-host
episode under today's rule. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The edition schema version moves, the
recorder and its check change shape, and two registered evidence sources are
edited. Assigned at activation under the standing opt-out default.
**Cost:** adds a blob-reference projection in the recorder, a behavioral
identity beside the subject hash, a resolver in `feedback-evidence --check`,
an edition schema version bump, regressions in the feedback suite, and,
because `packages/skeleton/src/feedback-selfhost.ts` and
`scripts/lib/evidence-sources.mjs` are registered evidence sources, one
edition re-mint with one live feedback self-host episode (WO-147 D010; that
episode ran 320.6 s under WO-147), the last re-mint paid under today's rule.
Removes, measured on 2026-09-22 at `4bf626f4`: about 1.2 MB of the 1.26 MB
each feedback edition adds (82 tracked self-host logs hold 104,786,967 of
184,846,333 tracked bytes; 97% of those bytes are the registered source
bodies copied twice per edition as `payload.subject.files` and
`payload.baseline.files`; the non-copy records are about 40 KB per edition),
and one live episode of about 320 s for every order whose registered-source
change is version pins only (59 editions for 34 orders in the seven days to
2026-09-21, most from component bumps that release assignment makes
routine). At the current cadence that is about 80 MB a week of repository
growth that stops. Wall-clock, tokens and context bytes of the order itself
are unknown until run.
**Nomination provenance:** REVIEW-002 findings ER2-001 (major) and ER2-002
(major), both measured, both survived REFUTATION-003, both accepted on
2026-09-22 with the filed packets `content-addressed-evidence-inputs` and
`behavioral-staleness-key-for-evidence-editions`
(`docs/proposals/<id>/packet.json`); FUP-0051's reopening observation, a
demonstrated upkeep problem. Planner-synthesized in the 2026-09-22
REVIEW-002 pass, first as a design waiting for room and then filed when the
operator directed that closed entries leave the sequence; both dispatches
are captured verbatim in ignored intake (SHA-256 in the ledger section).
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-147 merged (D010, the staleness rule this order re-keys
and the rejection it keeps; closed, v0.40.1).
**Recommended placement:** paired with WO-153 directly after WO-100 and
WO-064 and before WO-111 and WO-114. It edits
`packages/skeleton/src/feedback-selfhost.ts`, `scripts/feedback-evidence.mjs`,
`scripts/lib/evidence-sources.mjs`, their tests, the edition schema and, in
its second criterion group, `scripts/lib/plan-receipts.mjs`; WO-153 edits
`scripts/resume.mjs` and the process-debt fixture. The two share no file and
neither depends on the other; only this order re-mints the editions, so the
pair pays one live episode, not two. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-147",
    "relation": "satisfied-by-close",
    "reason": "D010: the staleness rule this order re-keys and the rejection of bypassing it that this order keeps as a regression"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):**
`docs/instance/entropy-reducer/runs/REVIEW-002.md` (ER2-001 and ER2-002,
their reproductions and evidence references) and
`docs/instance/entropy-reducer/runs/REFUTATION-003.md` (the independent
measurements); `docs/proposals/content-addressed-evidence-inputs/packet.json`
and `docs/proposals/behavioral-staleness-key-for-evidence-editions/packet.json`
(scope, risks, alternatives and dissenting evidence);
`packages/skeleton/src/feedback-selfhost.ts` (`baselineFiles` built from
`source.files`, lines 101–133; the files array copied into the verification
subject, lines 214–254; `validateSelfhost`'s subject comparison, lines
172–189 and 212); `scripts/feedback-evidence.mjs` (`--write`, `--check`,
`--record-selfhost`); `scripts/lib/evidence-sources.mjs` (`commonSources`,
lines 5–8, 28 and 31: `package.json`, `package-lock.json` and every workspace
`package.json`); `docs/evidence/WO-147/decisions.md` §WO-147-D010 (the
field-by-field comparison that showed a subject-only difference, the live
episode's cost, the rejected bypass and its reason); `scripts/lib/plan-receipts.mjs`
(the receipt subject that embeds every sequenced order's text);
`docs/planning/refutations/README.md` (receipts filed as a self-contained
pair); 03-architecture.md §Corpus policy (link an authority rather than copy
it; the evidence-growth paragraph dated 2026-09-22); 07-execution-guide.md
§Process budget (the Cost line is the promise, the cost table the
observation) and §Operator-opened planning pass (the edition duty for a
registered source).

**Objective:** A new feedback self-host edition records the files it audited
by path and blob identity instead of by body, resolves those bodies from Git
when a check or a reader needs them, and is re-minted only when the inputs
that change the audited behavior change; a change to version pins alone
produces a deterministic edition that carries the previous live audit by
reference; a behavioral change still cannot inherit an older live audit;
every edition and receipt already committed keeps its exact bytes.

**Observed gap (dated 2026-09-22, `main` at `4bf626f4`; the review's figures
at `5b4b99ca` in the receipt):**

- 82 tracked `docs/evidence/**/feedback*/selfhost-verification.jsonl` files
  total 104,786,967 bytes, 56.7% of 184,846,333 tracked bytes. Two record
  types per log, `VerificationOpened` (63.4%) and `CommandPersisted`
  (33.4%), carry the full text of every registered source file twice, as
  `{path, contents}` entries. Consecutive editions share no identical line.
  Two closes since the review added 3,904,695 bytes.
- `commonSources` registers `package.json`, `package-lock.json` and every
  workspace `package.json`, so any component bump stales both editions;
  release assignment is opt-out, so nearly every order bumps one. WO-147
  D010 re-minted an edition that differed from its predecessor in exactly
  one field, the subject hash, at the cost of one live episode of 320.6 s.
- The 24 planning refutation receipts' JSON totals 11,451,460 bytes and
  grows with the sequence because each embeds every sequenced order's
  objective, cost, criteria and non-goals beside the subject hash and
  sequence hash that already identify them (receipt 024: 814,036 bytes,
  subject 447,370 bytes).

**Design (scope discipline):**

- The recorder projects `payload.subject.files` and `payload.baseline.files`
  as `{path, blobHash, bytes}`, with `blobHash` the Git blob identity of the
  bytes it read (`git hash-object` semantics) so the reference is stable
  whether or not the commit exists yet. `--check` resolves a body from the
  committed tree at any commit that holds the blob, or from a working-tree
  file whose hash matches, and reports an unresolvable reference as stale
  by path. The edition schema version moves; `validateSelfhost` accepts the
  previous shape for existing editions and the new shape for new ones.
- The edition carries two identities beside the subject hash it already
  records: a behavioral identity over the policy hash, the fixtures and the
  audited compiler and skeleton modules, and a pins record over the version
  and lock files. Staleness and the live-episode requirement follow the
  behavioral identity. A pins-only change re-mints deterministically, with
  the pins record updated and the previous edition's live audit carried by
  reference and named. The executor enumerates the behavioral inputs from
  the current registered list, records the enumeration and its reason in
  the decisions, and keeps every input whose omission could let a behavior
  change inherit a stale audit.
- WO-147 D010's rejection is a regression: a change to any behavioral input
  with an unchanged pins record stales the edition, and an edition that
  tries to carry a live audit across a behavioral change is refused.
- Second criterion group, the receipt subject: `plan-receipts.mjs` stores
  each sequenced order by identity and hash with the text resolvable from
  the committed subject at the receipt's revision, and the rendered receipt
  keeps its plain-subject summary. If the executor finds this a different
  seam, it records that decision and this group becomes a patch order of
  its own; the feedback recorder is the delivery.
- **Declined alternatives, recorded (the packets' own list and the
  planning pass):** Git LFS or a release asset (moves the copy, keeps it);
  in-place compression (5 to 10 times smaller, still by value); retaining
  only the latest edition per family outside the tree (rewrites what an
  immutable record is); a size budget in `docs/control/budgets.json` (a
  ceiling that never binds); removing the package files from
  `commonSources` alone (loses the pins record and the deterministic
  re-mint).

**Deliverables:** the recorder and check changes; the two identities and
the staleness rule; the regressions; the schema version and the re-minted
editions with their live episode; the receipt-subject group or its split
decision; the write-backs in criterion 7.

**Acceptance criteria (all required)**

1. A new edition's `payload.subject.files` and `payload.baseline.files`
   entries are `{path, blobHash, bytes}`; `feedback-evidence --check`
   resolves every referenced body from Git or a hash-matching working-tree
   file and reports an unresolvable one as stale by path; the fixture
   proves both the committed and the not-yet-committed cases.
2. The edition records a behavioral identity and a pins record; a
   pins-only change re-mints without a live episode and names the carried
   live audit; a behavioral change requires a fresh live episode; the
   enumeration of behavioral inputs and its reason are in the decisions.
3. Regression: with the behavioral check bypassed, a behavioral change
   inheriting an older live audit is refused; the test fails against the
   current source's by-value shape only where the shape is asserted, and
   passes the D010 comparison mechanically.
4. Every existing edition and receipt is byte-identical (`git diff` over
   `docs/evidence/**/feedback*` and `docs/planning/refutations/` shows
   only the new edition and this order's own receipts); the schema version
   moves; `validateSelfhost` accepts both shapes; the console's pinned
   self-host case is re-pinned.
5. The per-edition bytes before and after (the 1.26 MB figure against the
   new edition's size) and the live-episode rule change are recorded in the
   decisions with the commands that measured them.
6. The receipt subject stores order text by identity and hash with
   resolution from the committed subject, and the plan check still binds
   the same subject hash; or the decisions record the split into a patch
   order with the reason.
7. The authority and feedback editions are re-minted with one live
   self-host episode and the reason each changed; `npm test` green;
   `git diff --check` clean; no new dependency; the suite's effect on the
   gate step count reported.

**Evidence gate:** the regression transcripts; the edition re-mint record
with its live episode; the byte measurement; `npm test` once at final
review.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; product 03 §Corpus policy's evidence-growth paragraph gains
the after figure; the ledger is reserved for planning synthesis.

**Non-goals:** rewriting history or any committed edition; Git LFS; storage
outside the tracked tree; the authority edition beyond what the pins record
needs; the receipt renderer's Markdown; the live self-host audit's own
verdict rules.

**Operator-review assumptions**

1. An edition whose bodies are reconstructed from Git is acceptable
   evidence; the repository is the evidence store, and a reader without
   the Git objects is not a supported consumer.
2. Activating this order authorizes one live self-host episode for the
   re-mint.

## Operator authorization — 2026-09-24

During `resume: fix` after VER-001, the operator authorized one more live
feedback self-host episode for this repair and folded in `FUP-0c86ada82f559914`
([WO-154-D011](../evidence/WO-154/decisions.md#wo-154-d011--ver-001-f1-repair-a-compiler-release-is-recorded-metadata-at-every-replay-layer)).

**Repair — VER-001-F1.** A rebuilt compiler release-label change stopped both
`--check` and `--carry`, because every layer that replays a recorded stream
recompiled it at the current label. The feedback slice's
`assertCompiledFeedback` did this, and so did the verification slice when
comparing a persisted command. `assertCompiledFeedback` and
`assertVerificationTask` now compare a recorded program or capsule with this
compiler's lowering at the release label it records. Any other difference
still fails. The verification slice adopts a persisted command whose capsule
differs from the dispatched one only in that label. A compiler release moves
`policyHash`, which the console binds to the current compiled policy, so
`feedback-evidence --check` then names the deterministic `--carry` (no live
episode). A change to component labels that leaves `policyHash` unchanged
still keeps the live audit with no action.

**Folded follow-up — `FUP-0c86ada82f559914` (D007).** The resolver takes the
live audit's `pins/` files as working-tree candidates, so recording no longer
writes the snapshot into the object database.

**Re-mint.** The repair edits files the live verifier judges, so feedback is
re-minted as WO-154 revision 002 with this one live episode, after the last
judged-file edit. Every other edition whose check the repair stales is
re-minted deterministically. Revision 001 stays on disk as the record
VER-001 judged.

8. Regression: after a compiler release-label change is built, `--check`
   names the carry and exits nonzero. `--carry` then mints an edition with no
   live episode. The carried edition checks, and the stored-stream replay
   passes for the carried feedback streams and the verification edition. A
   judged-file change is still refused by check and carry. Programs and
   capsules recorded at another release are admitted only when the rest is
   the current lowering, and the verification slice refuses any other
   persisted drift. The pins snapshot resolves from the working tree with
   no object write.
